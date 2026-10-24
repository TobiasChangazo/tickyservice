/* =========================================================
   POST /api/send-video  (lo usa /admin-newsletter.html)
   { clave, accion, titulo, link, reintentarFallidos }

   accion:
   - "estado"  → cuántos suscriptores hay y cuánto cupo de Gmail queda hoy
   - "preview" → asunto + HTML del mail tal cual va a llegar
   - "prueba"  → manda el mail solo a GMAIL_USER
   - "enviar"  → manda UNA tanda (NEWSLETTER_LOTE mails). La página la
                 llama una y otra vez hasta que no quedan pendientes.

   Cada video es una "campaña" identificada por su link: lo que ya se
   mandó queda anotado, así que si se corta (o se llega al límite
   diario) se vuelve a apretar "Enviar" y sigue sin repetir mails.
   ========================================================= */
import crypto from 'node:crypto';
import { redis, K, hayBaseConfigurada } from './_lib/redis.js';
import { crearTransporte, enviarCorreo, mailVideo } from './_lib/correo.js';
import {
  claveValida, ipDe, superaLimite, esUrlHttps, cupoDeHoy, enviadosHoy, sumarEnvios,
  urlDelSitio, urlDeBaja, LIMITE_DIARIO,
} from './_lib/util.js';

const LOTE = Number(process.env.NEWSLETTER_LOTE) || 20;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }
  if (!process.env.ADMIN_KEY) {
    return res.status(500).json({ ok: false, error: 'Falta configurar ADMIN_KEY en Vercel.' });
  }
  if (!hayBaseConfigurada()) {
    return res.status(500).json({ ok: false, error: 'Falta conectar Upstash Redis en Vercel.' });
  }

  const body = typeof req.body === 'object' && req.body ? req.body : {};

  try {
    // Freno a quien prueba claves al azar: 10 errores por hora por IP
    const claveIntentos = K.limite('admin', ipDe(req));
    if (Number(await redis.get(claveIntentos)) >= 10) {
      return res.status(429).json({ ok: false, error: 'Demasiados intentos con clave incorrecta. Esperá una hora.' });
    }
    if (!claveValida(body.clave)) {
      await superaLimite(claveIntentos, 10);
      return res.status(401).json({ ok: false, error: 'La clave no es correcta.' });
    }

    const accion = String(body.accion || '');

    if (accion === 'estado') {
      return res.status(200).json({ ok: true, ...await estado() });
    }

    const titulo = String(body.titulo || '').replace(/\s+/g, ' ').trim().slice(0, 150);
    const link = String(body.link || '').trim();
    if (!titulo) return res.status(400).json({ ok: false, error: 'Falta el título del video.' });
    if (!esUrlHttps(link)) return res.status(400).json({ ok: false, error: 'El link tiene que empezar con https://' });

    const sitio = urlDelSitio(req);

    if (accion === 'preview') {
      const mail = mailVideo({ nombre: 'Juan', titulo, link, sitio, urlBaja: urlDeBaja(sitio, 'ejemplo') });
      return res.status(200).json({ ok: true, asunto: mail.asunto, html: mail.html });
    }

    if (accion === 'prueba') {
      if (await cupoDeHoy() <= 0) {
        return res.status(429).json({ ok: false, error: 'Ya se usó el cupo diario de Gmail. Probá mañana.' });
      }
      const para = process.env.GMAIL_USER;
      const urlBaja = urlDeBaja(sitio, 'ejemplo');
      const transporte = crearTransporte();
      try {
        await enviarCorreo(transporte, { para, urlBaja, ...mailVideo({ nombre: 'TickyService', titulo, link, sitio, urlBaja }) });
      } finally {
        transporte.close();
      }
      await sumarEnvios(1);
      return res.status(200).json({ ok: true, mensaje: `Te mandamos una prueba a ${para}.` });
    }

    if (accion === 'enviar') {
      return res.status(200).json(await enviarTanda({ titulo, link, sitio, reintentar: body.reintentarFallidos === true }));
    }

    return res.status(400).json({ ok: false, error: 'Acción desconocida.' });
  } catch (err) {
    console.error('send-video:', err);
    return res.status(500).json({ ok: false, error: `Error del servidor: ${err.message}` });
  }
}

async function estado() {
  const [suscriptores, hoy] = await Promise.all([redis.scard(K.activos), enviadosHoy()]);
  return { suscriptores, enviadosHoy: hoy, limiteDiario: LIMITE_DIARIO, cupoHoy: Math.max(0, LIMITE_DIARIO - hoy) };
}

async function enviarTanda({ titulo, link, sitio, reintentar }) {
  const id = crypto.createHash('sha256').update(link).digest('hex').slice(0, 16);

  await redis.hsetnx(K.campana(id), 'creada', new Date().toISOString());
  await redis.hset(K.campana(id), { titulo, link });
  if (reintentar) await redis.del(K.fallidos(id));

  const [activos, yaEnviados, yaFallidos] = await Promise.all([
    redis.smembers(K.activos),
    redis.smembers(K.enviados(id)),
    redis.smembers(K.fallidos(id)),
  ]);
  const listos = new Set([...yaEnviados, ...yaFallidos]);
  const pendientes = activos.filter((email) => !listos.has(email));

  let cupo = await cupoDeHoy();
  const lote = pendientes.slice(0, Math.min(LOTE, cupo));
  const errores = [];
  let enviadosLote = 0;

  if (lote.length) {
    const subs = await Promise.all(lote.map((email) => redis.hgetall(K.sub(email))));
    const transporte = crearTransporte({ pool: true });
    try {
      for (const sub of subs) {
        if (!sub || sub.estado !== 'activo') continue; // se dio de baja mientras tanto
        const urlBaja = urlDeBaja(sitio, sub.token);
        try {
          await enviarCorreo(transporte, {
            para: sub.email,
            urlBaja,
            ...mailVideo({ nombre: sub.nombre, titulo, link, sitio, urlBaja }),
          });
          await redis.sadd(K.enviados(id), sub.email);
          enviadosLote++;
        } catch (err) {
          await redis.sadd(K.fallidos(id), sub.email);
          errores.push({ email: sub.email, error: err.message });
        }
      }
    } finally {
      transporte.close();
    }
    if (enviadosLote) await sumarEnvios(enviadosLote);
    cupo = Math.max(0, cupo - enviadosLote);
  }

  const [totalEnviados, totalFallidos] = await Promise.all([redis.scard(K.enviados(id)), redis.scard(K.fallidos(id))]);
  const quedan = Math.max(0, pendientes.length - lote.length);

  return {
    ok: true,
    campana: id,
    suscriptores: activos.length,
    loteEnviados: enviadosLote,
    loteFallidos: errores.length,
    totalEnviados,
    totalFallidos,
    pendientes: quedan,
    cupoHoy: cupo,
    terminado: quedan === 0,
    limiteAlcanzado: quedan > 0 && cupo === 0,
    errores,
  };
}
