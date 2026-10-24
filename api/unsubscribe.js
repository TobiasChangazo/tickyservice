/* =========================================================
   GET  /api/unsubscribe?token=...  → link "Darme de baja" de los mails
   POST /api/unsubscribe?token=...  → baja en un clic desde Gmail
                                      (header List-Unsubscribe-Post)
   ========================================================= */
import { redis, K, hayBaseConfigurada } from './_lib/redis.js';
import { enviarPagina } from './_lib/util.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).send('Método no permitido.');
  }

  const unClic = req.method === 'POST';
  const token = String(req.query.token || '').slice(0, 100);
  res.setHeader('Cache-Control', 'no-store');

  if (!hayBaseConfigurada()) {
    return enviarPagina(res, 500, { ok: false, titulo: 'Ups, algo falló', mensaje: 'No pudimos procesar la baja. Probá de nuevo en un rato.' });
  }

  try {
    const email = token ? await redis.get(K.token(token)) : null;

    if (!email) {
      if (unClic) return res.status(404).send('Link inválido.');
      return enviarPagina(res, 404, {
        ok: false,
        titulo: 'Link no válido',
        mensaje: 'No encontramos esta suscripción. Puede que el link esté incompleto: probá copiarlo entero desde el mail.',
      });
    }

    await redis.multi()
      .srem(K.activos, email)
      .hset(K.sub(email), { estado: 'baja', baja: new Date().toISOString() })
      .exec();

    if (unClic) return res.status(200).send('Baja confirmada.');

    return enviarPagina(res, 200, {
      titulo: 'Te diste de baja',
      mensaje: 'Listo, no te van a llegar más mails de TickyService. Gracias por habernos acompañado.',
      extra: '<p class="extra">¿Fue sin querer? <a href="/#newsletter">Volvé a suscribirte</a></p>',
    });
  } catch (err) {
    console.error('unsubscribe:', err);
    if (unClic) return res.status(500).send('Error.');
    return enviarPagina(res, 500, { ok: false, titulo: 'Ups, algo falló', mensaje: 'No pudimos procesar la baja. Probá de nuevo en un rato.' });
  }
}
