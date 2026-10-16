/* =========================================================
   TickyService — Detalle de guía (guia.html?g=slug)
   Lee la guía de guias-data.js y arma cabecera, video (si tiene),
   pasos, aviso de "frená acá" y la columna lateral.
   ========================================================= */
(function(){

const { CATEGORIAS, NIVELES, GUIAS } = window.TICKY_GUIAS;

const slug = new URLSearchParams(location.search).get('g');
const guia = GUIAS.find(g => g.slug === slug);

const $crumb  = document.getElementById('gd-crumb');
const $header = document.getElementById('gd-header');
const $layout = document.getElementById('gd-layout');

// Escapa texto de los datos antes de meterlo en innerHTML
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

const levelBar = nivel => `<span class="level-bar level-bar--${nivel.barra}" aria-hidden="true"><span></span><span></span><span></span></span>`;

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

/* ---------- ¿Se solucionó? (cierre del flujo del MVP) ---------- */
// Sí → estado de éxito en el mismo lugar · No → WhatsApp con presupuesto y turno
function renderPregunta() {
  const mensaje = `Hola! Seguí la guía "${guia.titulo}" (${cat.nombre}) y sigue igual. ¿Me pasan presupuesto y un turno?`;
  return `
    <h3 class="gd-cta__title" id="gd-outcome-title">¿Se solucionó?</h3>
    <p class="gd-cta__text">Contanos cómo te fue después de seguir los pasos.</p>
    <div class="gd-outcome__actions">
      <button type="button" class="btn gd-outcome__btn gd-outcome__btn--yes" data-outcome="si">
        <svg class="icon" aria-hidden="true"><use href="#icon-check"></use></svg>
        Sí, se solucionó
      </button>
      <a class="btn gd-outcome__btn gd-outcome__btn--wa" href="${waLink(mensaje)}" target="_blank" rel="noopener" aria-describedby="gd-outcome-note">
        <svg class="icon" aria-hidden="true"><use href="#icon-whatsapp"></use></svg>
        No, sigue igual
      </a>
    </div>
    <p class="gd-outcome__note" id="gd-outcome-note">Se abre WhatsApp para pedirnos presupuesto y turno. El diagnóstico es sin cargo.</p>`;
}

function renderExito() {
  return `
    <span class="gd-outcome__icon" aria-hidden="true"><svg class="icon"><use href="#icon-check"></use></svg></span>
    <h3 class="gd-cta__title" id="gd-outcome-title" tabindex="-1">¡Genial, quedó resuelto!</h3>
    <p class="gd-cta__text">Lo solucionaste vos. Guardate esta guía por si vuelve a pasar.</p>
    <ul class="gd-outcome__links">
      <li><a class="gd-outcome__link" href="guias.html?cat=${cat.id}">Ver más guías de ${esc(cat.nombre)} <span aria-hidden="true">→</span></a></li>
      <li><a class="gd-outcome__link" href="${INSTAGRAM_URL}" target="_blank" rel="noopener">
        <svg class="icon" aria-hidden="true"><use href="#icon-instagram"></use></svg>
        Seguí aprendiendo en Instagram
      </a></li>
    </ul>`;
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

      <section class="gd-cta gd-outcome" aria-labelledby="gd-outcome-title">
        <div class="gd-outcome__region" id="gd-outcome" aria-live="polite">
          ${renderPregunta()}
        </div>
      </section>

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

// "Sí": reemplaza la pregunta por el estado de éxito sin recargar. La región
// es aria-live, así que se anuncia; el foco pasa al nuevo título porque el
// botón que lo tenía deja de existir.
const $outcome = document.getElementById('gd-outcome');
$outcome.addEventListener('click', e => {
  if (!e.target.closest('[data-outcome="si"]')) return;
  $outcome.innerHTML = renderExito();
  $outcome.querySelector('#gd-outcome-title').focus();
});

})();
