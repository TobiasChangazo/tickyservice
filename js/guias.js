/* =========================================================
   TickyService — Guías destacadas
   - En modo preview (window.GUIAS_PREVIEW = true, home): 2 guías
     por categoría, prioriza destacada:true, completa con el resto,
     y muestra el botón "Ver todas" hacia guias.html
   - En la página de guías (sin flag): muestra todas las guías que
     cumplen el filtro, sin botón "Ver todas"
   - Badge de categoría solo en la pestaña "Todas"
   ========================================================= */
(function(){

const PREVIEW = window.GUIAS_PREVIEW === true;

// Categorías, niveles y guías vienen de guias-data.js
const { CATEGORIAS, NIVELES, GUIAS } = window.TICKY_GUIAS;

const POR_CATEGORIA = PREVIEW ? 2 : Infinity;
const URL_GUIAS = 'guias.html';

// guias.html?cat=pc abre directo en esa categoría (lo usa el breadcrumb del detalle)
const catURL = new URLSearchParams(location.search).get('cat');
const state = {
  categoria: CATEGORIAS.some(c => c.id === catURL) ? catURL : 'todas',
  nivel: 0,
};

const $tabs  = document.getElementById('guias-tabs');
const $pills = document.getElementById('guias-pills');
const $all   = document.getElementById('guias-all');
const $grid  = document.getElementById('guias-grid');

/* ---------- Helpers ---------- */
const levelBars = () => '<span class="level"><b></b><b></b><b></b></span>';

const cumpleNivel = g => !state.nivel || g.nivel === state.nivel;

// En preview: 2 guías de una categoría (destacadas primero, completa con el resto).
// En la página de guías: todas las que cumplen el filtro (POR_CATEGORIA = Infinity).
function topDeCategoria(catId) {
  const pool = GUIAS.filter(g => g.categoria === catId && cumpleNivel(g));
  const destacadas = pool.filter(g => g.destacada);
  const resto = pool.filter(g => !g.destacada);
  return [...destacadas, ...resto].slice(0, POR_CATEGORIA);
}

function guiasVisibles() {
  if (state.categoria === 'todas') {
    return CATEGORIAS.flatMap(c => topDeCategoria(c.id));
  }
  return topDeCategoria(state.categoria);
}

function totalEnCategoria(catId) {
  return catId === 'todas'
    ? GUIAS.length
    : GUIAS.filter(g => g.categoria === catId).length;
}

/* ---------- Render ---------- */
function renderTabs() {
  const items = [{ id: 'todas', nombre: 'Todas' }, ...CATEGORIAS];
  $tabs.innerHTML = items.map(c => `
    <button class="filter-tab ${state.categoria === c.id ? 'is-active' : ''}" data-cat="${c.id}">
      ${c.nombre}<span class="filter-count">${totalEnCategoria(c.id)}</span>
    </button>
  `).join('');
}

function renderPills() {
  $pills.innerHTML = NIVELES.map(n => `
    <button class="filter-pill ${state.nivel === n.id ? 'is-active' : ''}" data-nivel="${n.id}" ${n.id ? `data-level="${n.id}"` : ''}>
      ${n.id ? levelBars() : '<i data-lucide="layout-grid"></i>'}
      ${n.nombre}
    </button>
  `).join('');
}

function renderBoton() {
  if (!$all) return;
  const total = totalEnCategoria(state.categoria);
  const cat = CATEGORIAS.find(c => c.id === state.categoria);
  $all.querySelector('span').textContent = cat
    ? `Ver las ${total} de ${cat.nombre}`
    : `Ver las ${total} guías`;
  $all.href = URL_GUIAS;
}

function renderGrid() {
  const lista = guiasVisibles();
  const mostrarBadge = state.categoria === 'todas';

  if (!lista.length) {
    $grid.innerHTML = `
      <div class="guias-empty">
        No hay guías con este filtro.
        ${PREVIEW ? `<a href="${URL_GUIAS}">Ver todas →</a>` : ''}
      </div>`;
    return;
  }

  $grid.innerHTML = lista.map(g => {
    const cat = CATEGORIAS.find(c => c.id === g.categoria);
    const nivel = NIVELES.find(n => n.id === g.nivel);
    return `
      <a class="guia-card" href="guia.html?g=${g.slug}">
        <div>
          <p class="guia-meta">
            ${mostrarBadge ? `<span class="guia-badge"><i data-lucide="${cat.icono}"></i>${cat.nombre}</span>` : ''}
            ${g.tipo} · ${g.duracion}
          </p>
          <h3 class="guia-title">${g.titulo}</h3>
          <span class="guia-level" data-level="${g.nivel}">
            ${levelBars()}${nivel.nombre}
          </span>
        </div>
        <i data-lucide="arrow-right" class="guia-arrow"></i>
      </a>`;
  }).join('');
}

function render() {
  renderTabs();
  renderPills();
  renderBoton();
  renderGrid();
  if (window.lucide) lucide.createIcons();
}

/* ---------- Eventos ---------- */
$tabs.addEventListener('click', e => {
  const btn = e.target.closest('[data-cat]');
  if (!btn) return;
  state.categoria = btn.dataset.cat;
  render();
});

$pills.addEventListener('click', e => {
  const btn = e.target.closest('[data-nivel]');
  if (!btn) return;
  state.nivel = Number(btn.dataset.nivel);
  render();
});

render();

})();
