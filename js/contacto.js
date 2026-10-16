/* =========================================================
   TickyService — Contacto
   - Chips + nombre + consulta arman el mensaje de WhatsApp
   - Vista previa en vivo
   - Estado "Abierto ahora / Cerrado" según horario de Argentina
   Íconos: Lucide (data-lucide). WhatsApp va como SVG inline.
   ========================================================= */

// Número de WhatsApp y waLink(): js/config.js

// Link de Google Maps (buscá tu local y copiá "Compartir → Copiar vínculo")
const MAPS_URL = 'https://maps.google.com/?q=Mar+de+Ajó,+Buenos+Aires';

// Horarios: 0 = domingo ... 6 = sábado. null = cerrado
const HORARIOS = {
  0: null,
  1: ['09:00', '20:00'],
  2: ['09:00', '20:00'],
  3: ['09:00', '20:00'],
  4: ['09:00', '20:00'],
  5: ['09:00', '20:00'],
  6: null,
};

// Cómo se muestran agrupados en el panel
const HORARIOS_TEXTO = [
  { dias: [1, 2, 3, 4, 5], label: 'Lunes a viernes' },
  { dias: [6, 0],          label: 'Sábados y domingos' },
];

const NECESIDADES = [
  { id: 'reparación',    label: 'Reparación',    icono: 'wrench' },
  { id: 'presupuesto',   label: 'Presupuesto',   icono: 'receipt' },
  { id: 'comprar algo',  label: 'Comprar algo',  icono: 'shopping-bag' },
  { id: 'otra consulta', label: 'Otra consulta', icono: 'message-circle' },
];

const EQUIPOS = [
  { id: 'notebook', label: 'Notebook', icono: 'laptop' },
  { id: 'PC',       label: 'PC',       icono: 'cpu' },
  { id: 'joystick', label: 'Joystick', icono: 'gamepad-2' },
  { id: 'consola',  label: 'Consola',  icono: 'gamepad' },
  { id: '',         label: 'Otro',     icono: 'ellipsis' },
];

const WA_ICON = `
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.24-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.28 11.28 0 0 0 12.05.72C5.8.72.7 5.8.7 12.07c0 2 .52 3.95 1.52 5.67L.6 23.64l6.03-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.25 0 11.35-5.09 11.35-11.36 0-3.03-1.18-5.88-3.33-8.03"/>
</svg>`;

/* ---------- Elementos ---------- */
const $form      = document.getElementById('contact-form');
const $necesidad = document.getElementById('chips-necesidad');
const $equipo    = document.getElementById('chips-equipo');
const $nombre    = document.getElementById('c-nombre');
const $mensaje   = document.getElementById('c-mensaje');
const $preview   = document.getElementById('c-preview');
const $status    = document.getElementById('open-status');
const $hours     = document.getElementById('hours');

const state = {
  necesidad: NECESIDADES[0].id,
  equipo: EQUIPOS[0].id,
};

/* ---------- Chips ---------- */
function renderChips($el, opciones, seleccion) {
  $el.setAttribute('role', 'radiogroup');
  $el.innerHTML = opciones.map(o => `
    <button type="button" class="form-chip" role="radio"
            aria-checked="${o.id === seleccion}" data-value="${o.id}">
      <i data-lucide="${o.icono}"></i>${o.label}
    </button>
  `).join('');
}

function bindChips($el, key) {
  $el.addEventListener('click', e => {
    const chip = e.target.closest('.form-chip');
    if (!chip) return;
    state[key] = chip.dataset.value;
    $el.querySelectorAll('.form-chip').forEach(c =>
      c.setAttribute('aria-checked', c === chip)
    );
    actualizarPreview();
  });
}

/* ---------- Mensaje ---------- */
function armarMensaje() {
  const nombre = $nombre.value.trim();
  const detalle = $mensaje.value.trim();

  let txt = 'Hola!';
  if (nombre) txt += ` Soy ${nombre}.`;
  txt += ` Quiero consultar por ${state.necesidad}`;
  if (state.equipo) txt += ` de ${state.equipo === 'PC' ? 'PC' : state.equipo}`;
  txt += '.';
  if (detalle) txt += `\n\n${detalle}`;

  return txt;
}

function actualizarPreview() {
  $preview.textContent = armarMensaje();
}

/* ---------- Envío ---------- */
$form.addEventListener('submit', e => {
  e.preventDefault();

  const $field = $nombre.closest('.form-field');
  if (!$nombre.value.trim()) {
    $field.classList.add('has-error');
    $nombre.focus();
    return;
  }
  $field.classList.remove('has-error');

  window.open(waLink(armarMensaje()), '_blank', 'noopener');
});

$nombre.addEventListener('input', () => {
  $nombre.closest('.form-field').classList.remove('has-error');
  actualizarPreview();
});
$mensaje.addEventListener('input', actualizarPreview);

/* ---------- Horarios y estado ---------- */
// Hora actual en Argentina, sin importar la zona del visitante
function ahoraArgentina() {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const get = t => partes.find(p => p.type === t).value;
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const hora = Number(get('hour')) % 24;

  return { dia: dias[get('weekday')], minutos: hora * 60 + Number(get('minute')) };
}

const aMinutos = hhmm => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

function proximaApertura(dia) {
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    if (HORARIOS[d]) {
      const nombre = i === 1 ? 'mañana' : ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'][d];
      return `abrimos ${nombre} ${HORARIOS[d][0].replace(':00', '')} hs`;
    }
  }
  return '';
}

function renderHorarios() {
  const { dia, minutos } = ahoraArgentina();
  const hoy = HORARIOS[dia];

  // Estado
  let abierto = false;
  let texto = '';

  if (hoy) {
    const abre = aMinutos(hoy[0]);
    const cierra = aMinutos(hoy[1]);
    if (minutos >= abre && minutos < cierra) {
      abierto = true;
      texto = `Abierto · hasta las ${hoy[1].replace(':00', '')} hs`;
    } else if (minutos < abre) {
      texto = `Cerrado · abrimos hoy ${hoy[0].replace(':00', '')} hs`;
    }
  }
  if (!abierto && !texto) texto = `Cerrado · ${proximaApertura(dia)}`;

  $status.textContent = texto;
  $status.className = `open-status ${abierto ? 'is-open' : 'is-closed'}`;

  // Tabla
  $hours.innerHTML = HORARIOS_TEXTO.map(g => {
    const rango = HORARIOS[g.dias[0]];
    const esHoy = g.dias.includes(dia);
    return `
      <div class="hours-row ${rango ? '' : 'is-closed'} ${esHoy ? 'is-today' : ''}">
        <span>${g.label}</span>
        <strong>${rango ? `${rango[0]} – ${rango[1]}` : 'Cerrado'}</strong>
      </div>`;
  }).join('');
}

/* ---------- Links ---------- */
document.querySelector('.channel-icon--wa').innerHTML = WA_ICON;
document.getElementById('map-go').href = MAPS_URL;
$form.querySelector('.form-submit').insertAdjacentHTML('afterbegin', WA_ICON);

/* ---------- Init ---------- */
renderChips($necesidad, NECESIDADES, state.necesidad);
renderChips($equipo, EQUIPOS, state.equipo);
bindChips($necesidad, 'necesidad');
bindChips($equipo, 'equipo');
actualizarPreview();
renderHorarios();
setInterval(renderHorarios, 60 * 1000); // refresca el estado cada minuto

if (window.lucide) lucide.createIcons();
