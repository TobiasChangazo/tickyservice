/* =========================================================
   TickyService — Servicios por equipo
   Íconos: Lucide (data-lucide). WhatsApp va como SVG inline.
   No se muestran precios ni tiempos por servicio: el sitio no
   tiene esos datos, así que cada fila linkea a WhatsApp para
   presupuesto sin cargo (o a la guía, si es un ítem "podés
   hacerlo vos"). El tiempo de entrega es el único dato de
   tiempo real que hay: "24 a 48 hs", igual que en el resto
   del sitio.
   ========================================================= */
(function(){

// Mismo número que usa el resto del sitio (footer, botón flotante, etc.)
const WHATSAPP_NUMERO = '549232323232';

const NIVELES = {
  1: 'Podés hacerlo vos',
  2: 'Requiere herramientas',
  3: 'Es trabajo de taller',
};

// Mismo catálogo que antes vivía como HTML estático (matriz de svc-panel):
// título/categorías/niveles sin cambios, solo cambia la presentación.
const EQUIPOS = [
  {
    id: 'notebook',
    nombre: 'Notebook',
    icono: 'laptop',
    tag: 'Reparación y mantenimiento',
    imagen: 'img/servicios/notebook.jpg',
    guias: 'guias.html?cat=notebook',
    categorias: [
      {
        nombre: 'Mantenimiento', icono: 'sparkles',
        servicios: [
          { nombre: 'Limpieza de teclado y carcasa', nivel: 1, guia: '#' },
          { nombre: 'Liberar espacio y actualizar Windows', nivel: 1, guia: 'guia.html?g=pc-lenta' },
          { nombre: 'Cambio de pasta térmica', nivel: 3 },
        ],
      },
      {
        nombre: 'Reparación', icono: 'wrench',
        servicios: [
          { nombre: 'Reemplazo de disco por SSD', nivel: 3 },
          { nombre: 'Cambio de bisagra o carcasa', nivel: 3 },
          { nombre: 'Reemplazo de teclado', nivel: 3 },
        ],
      },
      {
        nombre: 'Software', icono: 'code',
        servicios: [
          { nombre: 'Backup de archivos importantes', nivel: 1, guia: 'guia.html?g=backup-antes-del-taller' },
          { nombre: 'Eliminación de virus', nivel: 2 },
          { nombre: 'Instalación de sistema operativo', nivel: 3 },
        ],
      },
    ],
  },
  {
    id: 'pc',
    nombre: 'PC',
    icono: 'cpu',
    tag: 'Armado y reparación',
    imagen: 'img/servicios/pc.jpg',
    guias: 'guias.html?cat=pc',
    categorias: [
      {
        nombre: 'Mantenimiento', icono: 'sparkles',
        servicios: [
          { nombre: 'Revisar conexión de cables', nivel: 1, guia: '#' },
          { nombre: 'Destapar y soplar el polvo', nivel: 2 },
          { nombre: 'Cambio de pasta térmica', nivel: 3 },
        ],
      },
      {
        nombre: 'Reparación', icono: 'wrench',
        servicios: [
          { nombre: 'Sumar memoria RAM', nivel: 2 },
          { nombre: 'Actualizar placa de video', nivel: 2 },
          { nombre: 'Armado completo de PC', nivel: 3 },
        ],
      },
      {
        nombre: 'Software', icono: 'code',
        servicios: [
          { nombre: 'Backup antes de formatear', nivel: 1, guia: 'guia.html?g=backup-antes-del-taller' },
          { nombre: 'Instalación de Windows', nivel: 3 },
        ],
      },
    ],
  },
  {
    id: 'joystick',
    nombre: 'Joystick',
    icono: 'gamepad-2',
    tag: 'Reparación de drift y más',
    imagen: 'img/servicios/joystick.jpg',
    guias: 'guias.html?cat=joystick',
    categorias: [
      {
        nombre: 'Mantenimiento', icono: 'sparkles',
        servicios: [
          { nombre: 'Limpieza de gatillos y botones', nivel: 1, guia: 'guia.html?g=gatillos-botones-pegados' },
          { nombre: 'Actualizar firmware', nivel: 1, guia: '#' },
        ],
      },
      {
        nombre: 'Reparación', icono: 'wrench',
        servicios: [
          { nombre: 'Reemplazo de analógicos (drift)', nivel: 3 },
          { nombre: 'Cambio de pin de carga', nivel: 3 },
        ],
      },
      {
        nombre: 'Software', icono: 'code',
        servicios: [
          { nombre: 'Emparejar con consola o PC', nivel: 1, guia: 'guia.html?g=joystick-bluetooth' },
        ],
      },
    ],
  },
  {
    id: 'consola',
    nombre: 'Consola',
    icono: 'gamepad',
    tag: 'PlayStation · Xbox · Nintendo',
    imagen: 'img/servicios/consola.jpg',
    guias: 'guias.html?cat=consola',
    categorias: [
      {
        nombre: 'Mantenimiento', icono: 'sparkles',
        servicios: [
          { nombre: 'Limpieza de lente lectora', nivel: 2 },
          { nombre: 'Ventilar y despolvar', nivel: 2 },
        ],
      },
      {
        nombre: 'Reparación', icono: 'wrench',
        servicios: [
          { nombre: 'Cambio de fuente interna', nivel: 3 },
          { nombre: 'Reemplazo de puerto HDMI', nivel: 3 },
        ],
      },
      {
        nombre: 'Software', icono: 'code',
        servicios: [
          { nombre: 'Actualizar el sistema', nivel: 1, guia: 'guia.html?g=actualizar-consola' },
          { nombre: 'Vincular joysticks', nivel: 1, guia: 'guia.html?g=vincular-joystick-consola' },
        ],
      },
    ],
  },
];

const WA_ICON = `
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.24-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.28 11.28 0 0 0 12.05.72C5.8.72.7 5.8.7 12.07c0 2 .52 3.95 1.52 5.67L.6 23.64l6.03-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.25 0 11.35-5.09 11.35-11.36 0-3.03-1.18-5.88-3.33-8.03"/>
</svg>`;

const $seg   = document.getElementById('serv-seg');
const $panel = document.getElementById('serv-panel');

// servicios.html?eq=pc abre directo en ese equipo (lo usan los links del footer)
const eqURL = new URLSearchParams(location.search).get('eq');
let actual = EQUIPOS.some(e => e.id === eqURL) ? eqURL : EQUIPOS[0].id;

/* ---------- Helpers ---------- */
const levelBars = () => '<span class="level"><b></b><b></b><b></b></span>';

const waLink = texto =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;

const totalServicios = eq =>
  eq.categorias.reduce((acc, c) => acc + c.servicios.length, 0);

const totalDIY = eq =>
  eq.categorias.reduce((acc, c) => acc + c.servicios.filter(s => s.nivel === 1).length, 0);

// Precarga de las fotos para que el cambio de equipo sea instantáneo
EQUIPOS.forEach(eq => { const img = new Image(); img.src = eq.imagen; });

/* ---------- Render ---------- */
function renderSelector() {
  $seg.innerHTML = EQUIPOS.map(eq => `
    <button class="seg-btn ${eq.id === actual ? 'is-active' : ''}"
            role="tab"
            aria-selected="${eq.id === actual}"
            data-id="${eq.id}">
      <i data-lucide="${eq.icono}"></i>${eq.nombre}
      <span class="seg-count">${totalServicios(eq)}</span>
    </button>
  `).join('');
}

function renderFila(eq, s) {
  const esDIY = s.nivel === 1 && s.guia;
  const href = esDIY
    ? (s.guia === '#' ? eq.guias : s.guia)
    : waLink(`Hola! Quiero consultar por: ${s.nombre} (${eq.nombre}).`);
  const tiempo = esDIY ? '' : `<span><i data-lucide="clock"></i>24 a 48 hs</span>`;

  return `
    <a class="serv-row" href="${href}" ${esDIY ? '' : 'target="_blank" rel="noopener"'}>
      <div>
        <p class="serv-row-name">${s.nombre}</p>
        <div class="serv-row-meta">
          <span data-level="${s.nivel}">${levelBars()}${NIVELES[s.nivel]}</span>
          ${tiempo}
        </div>
      </div>
      <div class="serv-row-price">
        <p class="price-value--free">Presupuesto sin cargo</p>
        <p class="serv-row-action">${esDIY ? 'Ver guía →' : 'Consultar →'}</p>
      </div>
    </a>`;
}

function renderPanel() {
  const eq = EQUIPOS.find(e => e.id === actual);

  $panel.innerHTML = `
    <div class="serv-banner">
      <img class="serv-banner-img" src="${eq.imagen}" alt="${eq.nombre} en el taller de TickyService" loading="lazy">
      <div class="serv-banner-overlay"></div>
      <div class="serv-banner-content">
        <div>
          <span class="serv-tag"><i data-lucide="${eq.icono}"></i>${eq.tag}</span>
          <h3 class="serv-name">${eq.nombre}</h3>
          <p class="serv-meta">
            ${totalServicios(eq)} servicios · <strong>${totalDIY(eq)} los podés resolver vos</strong> con una guía
          </p>
        </div>
        <div class="serv-actions">
          <a class="btn-glass" href="${eq.guias}"><i data-lucide="book-open"></i>Guías de ${eq.nombre}</a>
          <a class="btn-wa" href="${waLink(`Hola! Quiero pedir presupuesto para mi ${eq.nombre.toLowerCase()}.`)}" target="_blank" rel="noopener">
            ${WA_ICON}Pedir presupuesto
          </a>
        </div>
      </div>
    </div>

    <div class="serv-cols">
      ${eq.categorias.map(c => `
        <div class="serv-col">
          <div class="serv-col-head">
            <i data-lucide="${c.icono}"></i>
            <p class="serv-col-title">${c.nombre}</p>
            <span class="serv-col-count">${c.servicios.length}</span>
          </div>
          ${c.servicios.map(s => renderFila(eq, s)).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

function render() {
  renderSelector();
  renderPanel();
  if (window.lucide) lucide.createIcons();
}

/* ---------- Eventos ---------- */
$seg.addEventListener('click', e => {
  const btn = e.target.closest('[data-id]');
  if (!btn || btn.dataset.id === actual) return;
  actual = btn.dataset.id;
  render();
  btn.scrollIntoView?.({ behavior: 'smooth', inline: 'center', block: 'nearest' });
});

// Flechas del teclado en el selector
$seg.addEventListener('keydown', e => {
  if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
  e.preventDefault();
  const i = EQUIPOS.findIndex(eq => eq.id === actual);
  const dir = e.key === 'ArrowRight' ? 1 : -1;
  actual = EQUIPOS[(i + dir + EQUIPOS.length) % EQUIPOS.length].id;
  render();
  $seg.querySelector(`[data-id="${actual}"]`).focus();
});

render();

})();
