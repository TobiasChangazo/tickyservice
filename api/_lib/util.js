/* =========================================================
   TickyService — utilidades de las funciones del newsletter
   (los archivos que empiezan con _ no son endpoints en Vercel)
   ========================================================= */
import crypto from 'node:crypto';
import { redis, K } from './redis.js';

// Gmail personal: ~500 destinatarios por día. Dejamos margen.
export const LIMITE_DIARIO = Number(process.env.GMAIL_LIMITE_DIARIO) || 450;

/* ---------- URL pública del sitio (para links de los mails) ---------- */
export function urlDelSitio(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'tickyservice.vercel.app';
  return `https://${host}`;
}

export function urlDeBaja(sitio, token) {
  return `${sitio}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}

/* ---------- Validación y limpieza ---------- */
export function limpiarNombre(valor) {
  return String(valor ?? '')
    .replace(/[\u0000-\u001F\u007F<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
}

// La misma regla que usa el navegador para type="email" (sin comillas, comas,
// ; ni < >), más un dominio con punto. Así a Nodemailer solo le llega una
// dirección simple, sin trucos de su parser de direcciones.
const EMAIL_RE = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;
export function limpiarEmail(valor) {
  const email = String(valor ?? '').trim().toLowerCase();
  return email.length <= 254 && EMAIL_RE.test(email) ? email : '';
}

export function esUrlHttps(valor) {
  try {
    return new URL(valor).protocol === 'https:';
  } catch {
    return false;
  }
}

export function escaparHtml(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function nuevoToken() {
  return crypto.randomBytes(24).toString('base64url');
}

/* Compara la clave sin filtrar cuánto coincide por el tiempo de respuesta */
export function claveValida(recibida) {
  const esperada = process.env.ADMIN_KEY;
  if (!esperada || typeof recibida !== 'string') return false;
  const a = crypto.createHash('sha256').update(recibida).digest();
  const b = crypto.createHash('sha256').update(esperada).digest();
  return crypto.timingSafeEqual(a, b);
}

export function ipDe(req) {
  const fwd = String(req.headers['x-forwarded-for'] || '');
  return fwd.split(',')[0].trim() || req.socket?.remoteAddress || 'desconocida';
}

/* Cuenta intentos por clave en una ventana de 1 hora. Devuelve true si se pasó. */
export async function superaLimite(clave, maximo) {
  const intentos = await redis.incr(clave);
  if (intentos === 1) await redis.expire(clave, 3600);
  return intentos > maximo;
}

/* ---------- Cupo diario de Gmail ---------- */
function fechaAR() {
  // en-CA da AAAA-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());
}

export async function enviadosHoy() {
  return Number(await redis.get(K.enviosDelDia(fechaAR()))) || 0;
}

export async function cupoDeHoy() {
  return Math.max(0, LIMITE_DIARIO - await enviadosHoy());
}

export async function sumarEnvios(cantidad) {
  const clave = K.enviosDelDia(fechaAR());
  await redis.incrby(clave, cantidad);
  await redis.expire(clave, 60 * 60 * 48);
}

/* ---------- Respuestas ----------
   Con JS el sitio pide JSON. Sin JS (formulario común) devolvemos
   una página simple con el mensaje y un link para volver. */
export function quiereJson(req) {
  const accept = String(req.headers.accept || '');
  const tipo = String(req.headers['content-type'] || '');
  return accept.includes('application/json') || tipo.includes('application/json');
}

export function responder(req, res, estado, datos) {
  res.setHeader('Cache-Control', 'no-store');
  if (quiereJson(req)) return res.status(estado).json(datos);
  return enviarPagina(res, estado, {
    titulo: datos.ok ? '¡Listo!' : 'Ups, algo falló',
    mensaje: datos.mensaje || datos.error,
    ok: datos.ok,
    volver: volverA(req),
  });
}

function volverA(req) {
  // Solo volvemos a páginas del mismo sitio
  try {
    const ref = new URL(req.headers.referer);
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    if (ref.host === host) return ref.pathname;
  } catch { /* sin referer válido */ }
  return '/';
}

export function enviarPagina(res, estado, { titulo, mensaje, ok = true, volver = '/', extra = '' }) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex');
  // Colores = tokens.css (brand-700, lilac-050, ink-900, ink-600, accent-text, danger-text)
  res.status(estado).send(`<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escaparHtml(titulo)} — TickyService</title>
<meta name="robots" content="noindex">
<link rel="icon" type="image/png" href="/img/marca/favicon.png">
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;box-sizing:border-box;background:#FAF6FD;font-family:Poppins,'Segoe UI',system-ui,sans-serif;color:#1C1330}
  main{max-width:460px;width:100%;background:#fff;border:1px solid #E6D6F3;border-radius:22px;overflow:hidden;text-align:center}
  header{background:#470C78;padding:22px}
  header img{height:28px;width:auto}
  .cuerpo{padding:28px 26px 30px}
  h1{margin:0 0 10px;font-size:1.4rem;color:${ok ? '#470C78' : '#8C2436'}}
  p{margin:0 0 22px;line-height:1.55;color:#4A3D63}
  a.btn{display:inline-block;padding:12px 24px;border-radius:999px;background:#470C78;color:#fff;font-weight:600;text-decoration:none}
  a.btn:focus-visible{outline:3px solid #1C1330;outline-offset:3px}
  .extra{margin:18px 0 0;font-size:.9rem}
  .extra a{color:#5B2191}
</style>
</head>
<body>
<main>
  <header><img src="/img/marca/logo-wordmark-blanco.png" alt="TickyService" width="131" height="28"></header>
  <div class="cuerpo">
    <h1>${escaparHtml(titulo)}</h1>
    <p>${escaparHtml(mensaje)}</p>
    <a class="btn" href="${escaparHtml(volver)}">Volver al sitio</a>
    ${extra}
  </div>
</main>
</body>
</html>`);
}
