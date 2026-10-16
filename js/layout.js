/* =========================================================
   TickyService — Header, footer y botón flotante compartidos
   Única plantilla para las 7 páginas. Cada HTML solo tiene:

     <div id="site-header"></div>
     <script src="js/layout.js"></script>
     ...
     <div id="site-footer"></div>

   Requiere js/config.js (WHATSAPP_NUMERO, waLink, INSTAGRAM_URL) y
   js/guias-data.js (cantidad de guías del menú), cargados antes.
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

const UBICACION = 'Mar de Ajó, Partido de la Costa';
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

// Cantidad de guías publicadas (js/guias-data.js se carga antes que este script)
const TOTAL_GUIAS = window.TICKY_GUIAS ? window.TICKY_GUIAS.GUIAS.length : 0;

/* ---------- Íconos que usan header, menú, footer y botón flotante ----------
   Trazados de Lucide copiados como <symbol> (prefijo "i-" para no chocar
   con los sprites de cada página). No dependen de lucide.js: se ven en el
   primer render y también en guia.html, que no carga Lucide. */
const ICONOS = `
<svg class="icon-sprite" aria-hidden="true">
  <defs>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></symbol>
    <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></symbol>
    <symbol id="i-map-pin" viewBox="0 0 24 24"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></symbol>
    <symbol id="i-instagram" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></symbol>
    <symbol id="icon-whatsapp" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.8 14.2c-.3.7-1.4 1.3-2.1 1.4-.5.1-1.2.2-3.5-.7-2.9-1.2-4.8-4.1-5-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1l1.7.8c.2.1.4.2.4.4.1.2.1.9-.2 1.6z"/></symbol>
  </defs>
</svg>`;

/* ---------- Plantillas ---------- */
const icono = (id, clase = 'icon') => `<svg class="${clase}" aria-hidden="true"><use href="#${id}"></use></svg>`;

// Ítem del menú mobile: número mono, nombre, punto si es la página actual
// y la cantidad de guías en "Guías"
function itemMenu(l, i) {
  const actual = ariaCurrent(l.href);
  const cantidad = l.href === 'guias.html' && TOTAL_GUIAS
    ? `<span class="mmenu__count mono"><span aria-hidden="true">${TOTAL_GUIAS}</span><span class="sr-only">, ${TOTAL_GUIAS} guías</span></span>`
    : '';
  return `
      <a class="mmenu__link" href="${l.href}"${actual}>
        <span class="mmenu__num mono" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="mmenu__txt">${l.texto}</span>
        ${cantidad}${actual ? '<span class="mmenu__dot" aria-hidden="true"></span>' : ''}
      </a>`;
}

const HEADER = `
<header class="site-header">
  <div class="container header-bar">
    <a class="brand" href="index.html">
      <img class="brand__logo" src="img/marca/logo-wordmark.png" alt="TickyService" width="631" height="140">
    </a>

    <nav class="nav" aria-label="Navegación principal">
      <ul class="nav__list">
        ${NAV.map(l => `<li><a class="nav__link" href="${l.href}"${ariaCurrent(l.href)}>${l.texto}</a></li>`).join('\n        ')}
      </ul>
    </nav>

    <div class="header-actions">
      <a class="header-icon" href="index.html#sintomas" aria-label="Buscar por síntoma">${icono('i-search')}</a>
      <button type="button" class="menu-btn" aria-expanded="false" aria-controls="menu-movil" aria-label="Abrir menú">${icono('i-menu')}</button>
    </div>
  </div>
</header>

<div class="mmenu" id="menu-movil" role="dialog" aria-modal="true" aria-label="Menú" hidden>
  <div class="mmenu__top">
    <a class="mmenu__brand" href="index.html"><img src="img/marca/logo-wordmark-blanco.png" alt="TickyService, inicio" width="1250" height="268"></a>
    <button type="button" class="mmenu__close" aria-label="Cerrar menú">${icono('i-x')}</button>
  </div>

  <nav class="mmenu__nav" aria-label="Navegación principal">
    ${NAV.map(itemMenu).join('')}
  </nav>

  <div class="mmenu__foot">
    <a class="mmenu__cta" href="index.html#sintomas">
      ${icono('i-search')}<span>¿Qué le pasa a tu equipo?</span>${icono('i-arrow-right')}
    </a>
    <div class="mmenu__social">
      <a href="${waLink()}">${icono('icon-whatsapp', 'icon mmenu__wa')}WhatsApp</a>
      <a href="${INSTAGRAM_URL}">${icono('i-instagram')}Instagram</a>
    </div>
    <p class="mmenu__loc">${icono('i-map-pin')}${UBICACION}</p>
  </div>
</div>`;

const EQUIPOS_FOOTER = [
  { id: 'notebook', texto: 'Notebook' },
  { id: 'pc',       texto: 'PC' },
  { id: 'joystick', texto: 'Joystick' },
  { id: 'consola',  texto: 'Consola' },
];

const FOOTER = `
<footer class="site-footer">
  <div class="container footer__inner">
    <div class="footer__brand">
      <a class="footer__logo" href="index.html"><img src="img/marca/logo-wordmark-blanco.png" alt="TickyService, inicio" width="1250" height="268"></a>
      <p class="footer__desc">Servicio técnico, repuestos y tienda de tecnología.</p>
      <p class="footer__desc">Calidad y rapidez en cada reparación.</p>
      <div class="footer__social">
        <a href="${waLink()}" aria-label="WhatsApp">${icono('icon-whatsapp', 'icon footer__wa')}</a>
        <a href="${INSTAGRAM_URL}" aria-label="Instagram">${icono('i-instagram')}</a>
        <a href="mailto:${EMAIL}" aria-label="Email: ${EMAIL}">${icono('i-mail')}</a>
      </div>
    </div>

    <div class="footer__nav">
      <nav aria-labelledby="footer-secciones">
        <h2 class="footer__heading mono" id="footer-secciones">Secciones</h2>
        <ul class="footer__list">
          ${NAV.slice(1).map(l => `<li><a href="${l.href}">${l.texto}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      <nav aria-labelledby="footer-equipos">
        <h2 class="footer__heading mono" id="footer-equipos">Equipos</h2>
        <ul class="footer__list">
          ${EQUIPOS_FOOTER.map(e => `<li><a href="servicios.html?eq=${e.id}">${e.texto}</a></li>`).join('\n          ')}
        </ul>
      </nav>
    </div>

    <div class="footer__legal">
      <p class="footer__loc">${icono('i-map-pin')}${UBICACION}</p>
      <p class="footer__copy">© 2026 TickyService. Todos los derechos reservados.</p>
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

/* ---------- Menú mobile (< 900px): pantalla completa ----------
   Botón con aria-expanded; mientras está abierto se bloquea el scroll del
   body, Tab queda dentro del menú y Escape lo cierra. Al cerrar, el foco
   vuelve al botón de menú. */
function iniciarMenu() {
  const $btn = document.querySelector('.menu-btn');
  const $menu = document.getElementById('menu-movil');
  if (!$btn || !$menu) return;
  const $cerrar = $menu.querySelector('.mmenu__close');
  const enfocables = () => [...$menu.querySelectorAll('a[href], button:not([disabled])')];

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key !== 'Tab') return;
    const f = enfocables();
    const primero = f[0], ultimo = f[f.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  }

  function abrir() {
    $menu.hidden = false;
    $btn.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-abierto');
    document.addEventListener('keydown', onKey);
    $cerrar.focus();
  }

  function cerrar(devolverFoco = true) {
    if ($menu.hidden) return;
    $menu.hidden = true;
    $btn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-abierto');
    document.removeEventListener('keydown', onKey);
    if (devolverFoco) $btn.focus();
  }

  $btn.addEventListener('click', abrir);
  $cerrar.addEventListener('click', () => cerrar());
  // Elegir un link navega (o salta a un ancla de esta página): se cierra sin mover el foco
  $menu.addEventListener('click', e => { if (e.target.closest('a')) cerrar(false); });
  // Si la ventana pasa a desktop con el menú abierto, se cierra
  matchMedia('(min-width: 900px)').addEventListener('change', e => { if (e.matches) cerrar(false); });
}
iniciarMenu();

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
