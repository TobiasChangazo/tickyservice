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

// Orden fijo de categorías (define también el orden en "Todas")
const CATEGORIAS = [
  { id: 'notebook', nombre: 'Notebook', icono: 'laptop' },
  { id: 'pc',       nombre: 'PC',       icono: 'cpu' },
  { id: 'joystick', nombre: 'Joystick', icono: 'gamepad-2' },
  { id: 'consola',  nombre: 'Consola',  icono: 'gamepad' },
];

const NIVELES = [
  { id: 0, nombre: 'Todas' },
  { id: 1, nombre: 'Podés hacerlo vos' },
  { id: 2, nombre: 'Requiere herramientas' },
  { id: 3, nombre: 'Es trabajo de taller' },
];

// Mismas 15 guías que antes vivían como HTML estático en guias.html
const GUIAS = [
  { titulo: 'Notebook que no enciende: primeros pasos', categoria: 'notebook', tipo: 'Guía', duracion: '5 min de lectura', nivel: 1, destacada: true, url: '#' },
  { titulo: 'Backup antes de llevar el equipo al taller', categoria: 'notebook', tipo: 'Checklist', duracion: '3 min de lectura', nivel: 1, destacada: false, url: '#' },
  { titulo: 'Batería de notebook que no carga: qué revisar', categoria: 'notebook', tipo: 'Guía', duracion: '4 min de lectura', nivel: 1, destacada: true, url: '#' },

  { titulo: 'PC lenta: 6 cosas para probar antes de traerla', categoria: 'pc', tipo: 'Checklist', duracion: '4 min de lectura', nivel: 1, destacada: true, url: '#' },
  { titulo: 'PC no bootea: pantalla negra al encender', categoria: 'pc', tipo: 'Guía', duracion: '6 min de lectura', nivel: 3, destacada: false, url: '#' },
  { titulo: 'Cómo limpiar el polvo por dentro de tu PC', categoria: 'pc', tipo: 'Video', duracion: '7 min de video', nivel: 2, destacada: false, url: '#' },
  { titulo: 'Cuándo conviene sumar un SSD en vez de comprar una PC nueva', categoria: 'pc', tipo: 'Guía', duracion: '5 min de lectura', nivel: 1, destacada: true, url: '#' },
  { titulo: 'Sin wifi o internet: diagnóstico rápido', categoria: 'pc', tipo: 'Checklist', duracion: '3 min de lectura', nivel: 1, destacada: false, url: '#' },

  { titulo: 'Joystick con drift: cómo detectarlo y calibrarlo', categoria: 'joystick', tipo: 'Video', duracion: '6 min de video', nivel: 1, destacada: true, url: '#' },
  { titulo: 'Mi joystick no conecta por bluetooth', categoria: 'joystick', tipo: 'Guía', duracion: '4 min de lectura', nivel: 1, destacada: true, url: '#' },
  { titulo: 'Limpieza de gatillos y botones pegados', categoria: 'joystick', tipo: 'Checklist', duracion: '3 min de lectura', nivel: 2, destacada: false, url: '#' },

  { titulo: 'La consola no lee discos: guía de limpieza', categoria: 'consola', tipo: 'Guía', duracion: '5 min de lectura', nivel: 2, destacada: true, url: '#' },
  { titulo: 'Consola que se apaga sola jugando', categoria: 'consola', tipo: 'Guía', duracion: '5 min de lectura', nivel: 3, destacada: false, url: '#' },
  { titulo: 'Cómo vincular un joystick nuevo a tu consola', categoria: 'consola', tipo: 'Video', duracion: '3 min de video', nivel: 1, destacada: true, url: '#' },
  { titulo: 'Actualizar el sistema de tu consola paso a paso', categoria: 'consola', tipo: 'Checklist', duracion: '4 min de lectura', nivel: 1, destacada: false, url: '#' },
];

const POR_CATEGORIA = PREVIEW ? 2 : Infinity;
const URL_GUIAS = 'guias.html';

const state = { categoria: 'todas', nivel: 0 };

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
      <a class="guia-card" href="${g.url}">
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
