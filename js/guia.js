/* =========================================================
   TickyService — Detalle de guía (guia.html?g=slug)
   Lee la guía de guias-data.js y arma cabecera, video (si tiene),
   pasos, aviso de "frená acá" y la columna lateral.
   ========================================================= */
(function(){

const { CATEGORIAS, NIVELES, GUIAS } = window.TICKY_GUIAS;
const WHATSAPP = '549232323232';

const slug = new URLSearchParams(location.search).get('g');
const guia = GUIAS.find(g => g.slug === slug);

const $crumb  = document.getElementById('gd-crumb');
const $header = document.getElementById('gd-header');
const $layout = document.getElementById('gd-layout');

// Escapa texto de los datos antes de meterlo en innerHTML
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

const levelBar = nivel => `<span class="level-bar level-bar--${nivel.barra}" aria-hidden="true"><span></span><span></span><span></span></span>`;

const waLink = texto => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

/* ---------- Guía no encontrada ---------- */
if (!guia) {
  document.title = 'Guía no encontrada — TickyService';
  $crumb.textContent = 'No encontrada';
  $header.innerHTML = `
    <h1 class="gd-title">No encontramos esa guía</h1>
    <p class="gd-lead">Puede que el link esté mal o que la guía se haya movido. <a class="gh-link-arrow" href="guias.html">Ver todas las guías →</a></p>`;
  $layout.remove();
  return;
}

const cat = CATEGORIAS.find(c => c.id === guia.categoria);
const nivel = NIVELES.find(n => n.id === guia.nivel);

/* ---------- Metadatos ---------- */
document.title = `${guia.titulo} — TickyService`;
document.querySelector('meta[name="description"]')?.setAttribute('content', guia.resumen);
document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
document.querySelector('meta[property="og:description"]')?.setAttribute('content', guia.resumen);

/* ---------- Cabecera ---------- */
$crumb.innerHTML = `<a href="guias.html?cat=${cat.id}">${esc(cat.nombre)}</a>`;
$crumb.removeAttribute('aria-current');
$crumb.insertAdjacentHTML('afterend', `<li aria-current="page">${esc(guia.titulo)}</li>`);

$header.innerHTML = `
  <p class="gh-meta gd-header__meta">${esc(guia.tipo)} · ${esc(guia.duracion)} · ${esc(cat.nombre)}</p>
  <h1 class="gd-title">${esc(guia.titulo)}</h1>
  <p class="gd-lead">${esc(guia.resumen)}</p>`;

/* ---------- Video (opcional) ---------- */
function renderVideo() {
  if (!('video' in guia)) return '';
  if (!guia.video) {
    return `
      <div class="gd-video gd-video--pending">
        <span class="gd-video__play" aria-hidden="true"><svg class="icon"><use href="#icon-play"></use></svg></span>
      </div>
      <p class="gd-video__note">Video en preparación — mientras tanto, seguí los pasos de abajo.</p>`;
  }
  return `
    <div class="gd-video">
      <iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(guia.video)}"
        title="Video: ${esc(guia.titulo)}" loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>`;
}

/* ---------- Pasos ---------- */
function renderPasos() {
  return `
    <span class="gh-eyebrow gd-steps-eyebrow">Paso a paso</span>
    <ol class="gd-steps">
      ${guia.pasos.map((p, i) => `
        <li class="gd-step">
          <span class="gd-step__num">${String(i + 1).padStart(2, '0')}</span>
          <div>
            <h2 class="gd-step__title">${esc(p.titulo)}</h2>
            <p class="gd-step__text">${esc(p.texto)}</p>
          </div>
        </li>`).join('')}
    </ol>`;
}

function renderFrena() {
  if (!guia.frena) return '';
  return `
    <div class="gd-warning">
      <span class="gd-warning__eyebrow">Frená acá</span>
      <h3 class="gd-warning__title">${esc(guia.frena.titulo)}</h3>
      <p class="gd-warning__text">${esc(guia.frena.texto)}</p>
    </div>`;
}

/* ---------- Columna lateral ---------- */
// Relacionadas: misma categoría (destacadas primero); si no alcanzan, completa con otras
function relacionadas(max = 2) {
  const otras = GUIAS.filter(g => g.slug !== guia.slug);
  const misma = otras.filter(g => g.categoria === guia.categoria)
    .sort((a, b) => b.destacada - a.destacada);
  const resto = otras.filter(g => g.categoria !== guia.categoria && g.destacada);
  return [...misma, ...resto].slice(0, max);
}

function renderAside() {
  const necesitas = guia.necesitas && guia.necesitas.length
    ? `<ul class="gd-needs">${guia.necesitas.map(n => `<li>${esc(n)}</li>`).join('')}</ul>`
    : `<p class="gd-time">Nada especial, solo el equipo.</p>`;

  const tienda = guia.tienda
    ? `<a class="btn btn--secondary" href="tienda.html">${esc(guia.tienda)} <span aria-hidden="true">→</span></a>`
    : '';

  return `
    <aside class="gd-aside">
      <div class="gd-box">
        <span class="gd-box__label">Nivel</span>
        <p class="gh-level">${levelBar(nivel)}${esc(nivel.nombre)}</p>

        <span class="gd-box__label">Qué necesitás</span>
        ${necesitas}

        <span class="gd-box__label">Tiempo estimado</span>
        <p class="gd-time">${esc(guia.tiempo)}</p>

        ${tienda}
      </div>

      <div class="gd-cta">
        <h3 class="gd-cta__title">¿Lo hiciste y sigue igual?</h3>
        <p class="gd-cta__text">Contanos qué probaste y te decimos si vale la pena traerlo. Diagnóstico sin cargo.</p>
        <a class="btn btn--primary" href="${waLink(`Hola! Seguí la guía "${guia.titulo}" y sigue igual.`)}">
          <svg class="icon" aria-hidden="true"><use href="#icon-whatsapp"></use></svg>
          Escribinos por WhatsApp
        </a>
      </div>

      <div class="gd-box">
        <span class="gd-box__label">Seguí con</span>
        <nav class="gd-related" aria-label="Guías relacionadas">
          ${relacionadas().map(g => `
            <a href="guia.html?g=${g.slug}">
              <p class="gd-related__meta">${esc(g.tipo)} · ${esc(g.duracion)}</p>
              <p class="gd-related__title">${esc(g.titulo)}</p>
            </a>`).join('')}
        </nav>
      </div>
    </aside>`;
}

$layout.innerHTML = `
  <div>
    ${renderVideo()}
    ${renderPasos()}
    ${renderFrena()}
  </div>
  ${renderAside()}`;

})();
