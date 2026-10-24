/* =========================================================
   POST /api/subscribe  { nombre, email, acepto, website }
   Guarda al suscriptor (sin duplicados) y le manda la bienvenida.
   Acepta JSON (desde site.js) o un formulario común (sin JS).
   "website" es el honeypot: las personas no lo ven, los bots sí.
   ========================================================= */
import { redis, K, hayBaseConfigurada } from './_lib/redis.js';
import { crearTransporte, enviarCorreo, mailBienvenida } from './_lib/correo.js';
import {
  limpiarNombre, limpiarEmail, nuevoToken, ipDe, superaLimite,
  cupoDeHoy, sumarEnvios, urlDelSitio, urlDeBaja, responder,
} from './_lib/util.js';

const MENSAJE_OK = '¡Listo! Te va a llegar un mail cada vez que subamos un video.';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return responder(req, res, 405, { ok: false, error: 'Método no permitido.' });
  }

  const body = typeof req.body === 'object' && req.body ? req.body : {};

  // Honeypot completo = bot. Le respondemos "ok" para que no insista.
  if (String(body.website || '').trim()) {
    return responder(req, res, 200, { ok: true, mensaje: MENSAJE_OK });
  }

  const nombre = limpiarNombre(body.nombre);
  const email = limpiarEmail(body.email);
  const acepto = [true, 'true', 'on', '1', 'si'].includes(body.acepto);

  if (!nombre) return responder(req, res, 400, { ok: false, error: 'Decinos tu nombre así te saludamos en los mails.' });
  if (!email) return responder(req, res, 400, { ok: false, error: 'Revisá el email: parece que tiene un error.' });
  if (!acepto) return responder(req, res, 400, { ok: false, error: 'Tenés que aceptar recibir los mails para suscribirte.' });

  if (!hayBaseConfigurada()) {
    console.error('subscribe: falta configurar Upstash Redis');
    return responder(req, res, 500, { ok: false, error: 'El newsletter todavía no está configurado. Probá más tarde.' });
  }

  try {
    if (await superaLimite(K.limite('sub', ipDe(req)), 8)) {
      return responder(req, res, 429, { ok: false, error: 'Hiciste muchos intentos seguidos. Probá de nuevo en un rato.' });
    }

    const actual = await redis.hgetall(K.sub(email));

    if (actual?.estado === 'activo') {
      return responder(req, res, 200, {
        ok: true,
        yaSuscripto: true,
        mensaje: '¡Ya estabas suscripto/a! Te va a seguir llegando un mail con cada video nuevo.',
      });
    }

    // Si se había dado de baja, reusamos su token: el link viejo sigue sirviendo
    const token = actual?.token || nuevoToken();

    await redis.multi()
      .hset(K.sub(email), { nombre, email, token, estado: 'activo', alta: new Date().toISOString(), baja: '' })
      .set(K.token(token), email)
      .sadd(K.activos, email)
      .exec();

    // La bienvenida no es crítica: si falla, la suscripción igual quedó guardada
    try {
      if (await cupoDeHoy() > 0) {
        const sitio = urlDelSitio(req);
        const urlBaja = urlDeBaja(sitio, token);
        const transporte = crearTransporte();
        try {
          await enviarCorreo(transporte, { para: email, urlBaja, ...mailBienvenida({ nombre, sitio, urlBaja }) });
          await sumarEnvios(1);
        } finally {
          transporte.close();
        }
      }
    } catch (err) {
      console.error('subscribe: no se pudo mandar la bienvenida', err);
    }

    return responder(req, res, 200, { ok: true, mensaje: MENSAJE_OK });
  } catch (err) {
    console.error('subscribe:', err);
    return responder(req, res, 500, { ok: false, error: 'No pudimos suscribirte. Probá de nuevo en un rato.' });
  }
}
