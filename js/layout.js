/* =========================================================
   TickyService — Header, footer y botón flotante compartidos
   Única plantilla para las 7 páginas. Cada HTML solo tiene:

     <div id="site-header"></div>
     <script src="js/layout.js"></script>
     ...
     <div id="site-footer"></div>

   Requiere js/config.js (WHATSAPP_NUMERO, waLink, INSTAGRAM_URL).
   Se carga sincrónico justo después de #site-header para que el
   header se pinte sin parpadeo; el footer se monta cuando termina
   de parsearse el documento. Sin fetch de parciales: funciona
   abriendo los .html con file://.
   ========================================================= */
(function(){

const NAV = [
  { href: 'index.html',     texto: 'Inicio' },
  { href: 'guias.html',     texto: 'Guías' },
  { href: 'servicios.html', texto: 'Servicios' },
  { href: 'tienda.html',    texto: 'Tienda' },
  { href: 'contacto.html',  texto: 'Contacto' },
  { href: 'nosotros.html',  texto: 'Nosotros' },
];

// Páginas que no están en el menú pero pertenecen a una sección
const SECCION_DE = { 'guia.html': 'guias.html' };

const UBICACION = 'Mar de Ajó | Partido de la Costa';
const EMAIL = 'contacto@tickyservice.com.ar';

// Página actual: último segmento de la ruta ("" → index.html)
let pagina = decodeURIComponent(location.pathname.split('/').pop() || 'index.html').toLowerCase();
if (!pagina.includes('.')) pagina += '.html';

// "page" en la página exacta; "true" en la sección a la que pertenece
function ariaCurrent(href) {
  if (href === pagina) return ' aria-current="page"';
  if (SECCION_DE[pagina] === href) return ' aria-current="true"';
  return '';
}

/* ---------- Íconos que usan header, footer y botón flotante ---------- */
const ICONOS = `
<svg class="icon-sprite" aria-hidden="true">
  <defs>
    <symbol id="icon-menu" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></symbol>
    <symbol id="icon-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>
    <symbol id="icon-whatsapp" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.8 14.2c-.3.7-1.4 1.3-2.1 1.4-.5.1-1.2.2-3.5-.7-2.9-1.2-4.8-4.1-5-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1l1.7.8c.2.1.4.2.4.4.1.2.1.9-.2 1.6z"/></symbol>
  </defs>
</svg>`;

/* ---------- Plantillas ---------- */
const HEADER = `
<header class="site-header">
  <div class="container header-bar">
    <a class="brand" href="index.html">
      <img class="brand__logo" src="img/marca/logo-wordmark.png" alt="TickyService" width="631" height="140">
    </a>

    <input type="checkbox" id="nav-toggle" class="sr-only nav-toggle-input">
    <label for="nav-toggle" class="nav-toggle">
      <svg class="icon nav-toggle__open" aria-hidden="true"><use href="#icon-menu"></use></svg>
      <svg class="icon nav-toggle__close" aria-hidden="true"><use href="#icon-close"></use></svg>
      <span class="sr-only">Abrir menú de navegación</span>
    </label>

    <nav class="nav" aria-label="Navegación principal">
      <ul class="nav__list">
        ${NAV.map(l => `<li><a class="nav__link" href="${l.href}"${ariaCurrent(l.href)}>${l.texto}</a></li>`).join('\n        ')}
      </ul>
    </nav>
  </div>
</header>
<label for="nav-toggle" class="nav-backdrop" aria-hidden="true"></label>`;

const FOOTER = `
<footer class="site-footer brand-surface">
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="container">
    <div class="footer__grid">
      <div>
        <a class="footer__brand" href="index.html">
          <img class="footer__logo" src="img/marca/logo-zorro.png" alt="" width="32" height="32">
          <img class="footer__wordmark" src="img/marca/logo-wordmark-blanco.png" alt="TickyService" width="1250" height="268">
        </a>
        <p class="footer__desc">Servicio técnico, repuestos y tienda de tecnología.</p>
        <p class="footer__desc">Calidad y rapidez en cada reparación.</p>
      </div>
      <div>
        <h3 class="footer__heading">Secciones</h3>
        <ul class="footer__list">
          ${NAV.slice(1).map(l => `<li><a href="${l.href}">${l.texto}</a></li>`).join('\n          ')}
        </ul>
      </div>
      <div>
        <h3 class="footer__heading">Servicio técnico</h3>
        <ul class="footer__list">
          <li><a href="servicios.html?eq=notebook">Notebook</a></li>
          <li><a href="servicios.html?eq=pc">PC</a></li>
          <li><a href="servicios.html?eq=joystick">Joystick</a></li>
          <li><a href="servicios.html?eq=consola">Consola</a></li>
        </ul>
      </div>
      <div>
        <h3 class="footer__heading">Contacto</h3>
        <ul class="footer__list">
          <li><a href="${waLink()}">WhatsApp</a></li>
          <li><a href="${INSTAGRAM_URL}">Instagram</a></li>
          <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li>${UBICACION}</li>
        </ul>
      </div>
    </div>
    <div class="footer__legal">
      <span>© 2026 TickyService. Todos los derechos reservados.</span>
    </div>
  </div>
</footer>

<a class="float-wa" href="${waLink()}">
  <svg class="icon" aria-hidden="true"><use href="#icon-whatsapp"></use></svg>
  <span class="sr-only">Escribinos por WhatsApp</span>
  <span class="float-wa__tooltip" aria-hidden="true">Escribinos por WhatsApp</span>
</a>`;

/* ---------- Montaje ---------- */
// Reemplaza el contenedor por el markup (no lo anida: así el header
// sigue siendo hijo directo de <body> y position:sticky funciona)
function montar(id, html) {
  const $el = document.getElementById(id);
  if (!$el) return;
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  $el.replaceWith(tpl.content);
}

document.body.insertAdjacentHTML('afterbegin', ICONOS);
montar('site-header', HEADER);

// Links declarativos: <a data-wa="mensaje opcional"> → href de WhatsApp
function linksWhatsApp() {
  document.querySelectorAll('a[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa); });
}

function alTerminar() {
  montar('site-footer', FOOTER);
  linksWhatsApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', alTerminar);
} else {
  alTerminar();
}

})();
