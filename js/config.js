/* =========================================================
   TickyService — Configuración global
   Datos de contacto en un solo lugar. Se carga antes que
   cualquier otro script del sitio (lo usan layout.js y los
   scripts de cada página).

   Links de WhatsApp en el HTML: en vez de escribir el número,
   usar <a href="contacto.html" data-wa="Mensaje opcional">; layout.js
   les pone el href con waLink().
   ========================================================= */

const WHATSAPP_NUMERO = '5492233024504';
const INSTAGRAM_URL = 'https://instagram.com/tickyservice';

// Link a WhatsApp con mensaje prellenado opcional
function waLink(texto) {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}
