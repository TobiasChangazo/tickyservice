/* =========================================================
   TickyService — Tienda
   Íconos: Lucide (data-lucide)
   ========================================================= */
(function(){

// Mismo número que en el resto del sitio
const WHATSAPP_NUMERO = '549232323232';

const FILTROS = [
  { id: 'todas',     nombre: 'Todas',     icono: 'layout-grid' },
  { id: 'notebooks', nombre: 'Notebooks', icono: 'laptop' },
  { id: 'pc',        nombre: 'PC',        icono: 'cpu' },
  { id: 'consolas',  nombre: 'Consolas',  icono: 'gamepad' },
  { id: 'joysticks', nombre: 'Joysticks', icono: 'gamepad-2' },
  { id: 'repuestos', nombre: 'Repuestos', icono: 'wrench' },
];

// stock: 1 = En stock · 2 = Poco stock · 3 = Sin stock
// imagen: opcional (si no hay, se muestra el ícono)
// url: opcional (si la categoría tiene página propia, la card lleva ahí en vez de WhatsApp)
const PRODUCTOS = [
  { categoria: 'notebooks', nombre: 'Notebooks',            icono: 'laptop',       descripcion: 'Ultrabooks y gamer, nuevas y reacondicionadas.',        precio: 450000, stock: 1, modelos: 12 },
  { categoria: 'pc',        nombre: 'PC armadas',           icono: 'cpu',          descripcion: 'Equipos a medida para trabajo, diseño o gaming.',       precio: 600000, stock: 1, modelos: 6 },
  { categoria: 'consolas',  nombre: 'Consolas',             icono: 'gamepad',      descripcion: 'PlayStation, Xbox y Nintendo, nuevas y usadas.',        precio: 380000, stock: 2, modelos: 4 },
  { categoria: 'joysticks', nombre: 'Joysticks y mandos',   icono: 'gamepad-2',    descripcion: 'Originales y compatibles para PC y consola.',           precio: 35000,  stock: 1, modelos: 18 },
  { categoria: 'repuestos', nombre: 'Baterías',             icono: 'battery',      descripcion: 'Reemplazo para notebooks de las principales marcas.',   precio: 18000,  stock: 1, modelos: 22 },
  { categoria: 'repuestos', nombre: 'Pantallas',            icono: 'monitor',      descripcion: 'Para notebook y celular, con colocación.',              precio: 45000,  stock: 2, modelos: 9 },
  { categoria: 'repuestos', nombre: 'Fuentes y cargadores', icono: 'plug',         descripcion: 'Fuentes de PC y cargadores universales.',               precio: 12000,  stock: 1, modelos: 15 },
  { categoria: 'repuestos', nombre: 'Memorias y SSD',       icono: 'memory-stick', descripcion: 'Ampliá la RAM o sumá un SSD para acelerar tu equipo.',  precio: 22000,  stock: 3, modelos: 0 },
];

const STOCK_LABEL = { 1: 'En stock', 2: 'Poco stock', 3: 'Sin stock' };

const $pills  = document.getElementById('shop-pills');
const $toggle = document.getElementById('shop-toggle');
const $grid   = document.getElementById('shop-grid');

const state = { filtro: 'todas', soloStock: false };

/* ---------- Helpers ---------- */
const formatoPrecio = n => '$' + n.toLocaleString('es-AR');

const waLink = p =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
    `Hola! Quiero consultar stock y precio de: ${p.nombre}.`
  )}`;

const contar = id =>
  id === 'todas' ? PRODUCTOS.length : PRODUCTOS.filter(p => p.categoria === id).length;

const filtrados = () =>
  PRODUCTOS.filter(p =>
    (state.filtro === 'todas' || p.categoria === state.filtro) &&
    (!state.soloStock || p.stock < 3)
  );

/* ---------- Render ---------- */
function renderPills() {
  $pills.innerHTML = FILTROS.map(f => `
    <button class="shop-pill ${state.filtro === f.id ? 'is-active' : ''}"
            data-filtro="${f.id}"
            aria-pressed="${state.filtro === f.id}">
      <i data-lucide="${f.icono}"></i>${f.nombre}
      <span class="shop-pill-count">${contar(f.id)}</span>
    </button>
  `).join('');
}

function renderCard(p) {
  const sinStock = p.stock === 3;
  const nombreCat = FILTROS.find(f => f.id === p.categoria)?.nombre ?? '';

  const media = p.imagen
    ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy">`
    : `<i data-lucide="${p.icono}"></i>`;

  const contenido = `
    <div class="product-media">
      ${media}
      <span class="stock-badge" data-stock="${p.stock}">${STOCK_LABEL[p.stock]}</span>
      ${p.modelos ? `<span class="qty-badge">${p.modelos} modelos</span>` : ''}
    </div>
    <div class="product-body">
      <p class="product-cat">${nombreCat}</p>
      <h3 class="product-name">${p.nombre}</h3>
      <p class="product-desc">${p.descripcion}</p>
      <div class="product-foot">
        <p class="product-price">
          <small>desde</small><strong>${formatoPrecio(p.precio)}</strong><span>ARS</span>
        </p>
        ${sinStock ? '' : '<span class="product-arrow"><i data-lucide="arrow-right"></i></span>'}
      </div>
    </div>`;

  // Sin stock: no es link
  if (sinStock) {
    return `<article class="product-card is-out" aria-label="${p.nombre}, sin stock">${contenido}</article>`;
  }

  const href = p.url || waLink(p);
  const externo = !p.url;
  return `
    <a class="product-card" href="${href}" ${externo ? 'target="_blank" rel="noopener"' : ''}
       aria-label="${p.nombre}, desde ${formatoPrecio(p.precio)}. ${STOCK_LABEL[p.stock]}">
      ${contenido}
    </a>`;
}

function renderGrid() {
  const lista = filtrados();
  $grid.innerHTML = lista.length
    ? lista.map(renderCard).join('')
    : '<p class="shop-empty">No hay productos con stock en esta categoría por ahora.</p>';
}

function render() {
  renderPills();
  renderGrid();
  $toggle.setAttribute('aria-checked', state.soloStock);
  if (window.lucide) lucide.createIcons();
}

/* ---------- Eventos ---------- */
$pills.addEventListener('click', e => {
  const btn = e.target.closest('[data-filtro]');
  if (!btn) return;
  state.filtro = btn.dataset.filtro;
  render();
});

$toggle.addEventListener('click', () => {
  state.soloStock = !state.soloStock;
  render();
});

render();

})();
