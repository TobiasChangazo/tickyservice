/* =========================================================
   TickyService — base de suscriptores (Upstash Redis)
   La integración de Upstash en el Marketplace de Vercel crea
   KV_REST_API_URL / KV_REST_API_TOKEN; si creaste la base desde
   upstash.com usás UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.
   ========================================================= */
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  // Guardamos todo como texto: que "123" no vuelva como número
  automaticDeserialization: false,
});

/* Claves de la base:
   news:sub:<email>              hash  { nombre, email, token, estado, alta, baja }
   news:activos                  set   emails suscriptos (los que reciben mails)
   news:token:<token>            texto email (para el link de baja)
   news:envios:<AAAA-MM-DD>      contador de mails mandados ese día
   news:campana:<id>             hash  { titulo, link, creada }  (id = hash del link)
   news:campana:<id>:enviados    set   emails que ya recibieron ese video
   news:campana:<id>:fallidos    set   emails donde falló el envío
   news:rl:<tipo>:<ip>           contador anti-abuso, dura 1 hora */
export const K = {
  sub: (email) => `news:sub:${email}`,
  activos: 'news:activos',
  token: (token) => `news:token:${token}`,
  enviosDelDia: (fecha) => `news:envios:${fecha}`,
  campana: (id) => `news:campana:${id}`,
  enviados: (id) => `news:campana:${id}:enviados`,
  fallidos: (id) => `news:campana:${id}:fallidos`,
  limite: (tipo, ip) => `news:rl:${tipo}:${ip}`,
};

export function hayBaseConfigurada() {
  return Boolean(
    (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
  );
}
