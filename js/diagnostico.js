/* =========================================================
   TickyService — Diagnóstico por síntoma
   Íconos: Lucide (data-lucide). WhatsApp va como SVG inline.
   ========================================================= */
(function(){

// Para cada síntoma:
// - icono: nombre de Lucide
// - equipos: texto de la línea de meta
// - pasos: array de strings
// - resultado: texto final ({{ }} marca la parte en negrita)
const SINTOMAS = [
  {
    id: 'no-enciende',
    titulo: 'No enciende o no arranca',
    icono: 'power',
    equipos: 'Notebook · PC · Consola',
    pasos: [
      'Probá con otro cargador o cable que sepas que funciona.',
      'Mantené presionado el botón de encendido 15 segundos para descargar estática y volvé a intentar.',
      'Si es notebook con batería removible, sacala y probá encenderla solo con el cargador conectado.',
      'Fijate si prende alguna luz o se escucha el ventilador al conectar la carga.',
    ],
    resultado: 'Si no reacciona de ninguna manera, {{es una falla de hardware}} (fuente, placa o batería).',
  },
  {
    id: 'se-apaga',
    titulo: 'Se apaga solo o se reinicia',
    icono: 'refresh-cw',
    equipos: 'Notebook · PC · Consola',
    pasos: [
      'Revisá que las rejillas de ventilación no estén tapadas de polvo o pelusa.',
      'Usalo sobre una superficie dura y plana, nunca sobre la cama o el sillón.',
      'Actualizá el sistema operativo y los controladores de video.',
      'Desconectá periféricos que no uses y probá de nuevo.',
    ],
    resultado: 'Si se sigue apagando después de ventilarlo y actualizarlo, {{probablemente sea la pasta térmica o la fuente}}.',
  },
  {
    id: 'se-calienta',
    titulo: 'Se calienta mucho',
    icono: 'flame',
    equipos: 'Notebook · PC · Consola',
    pasos: [
      'Usalo sobre una superficie dura, nunca sobre tela o almohadones.',
      'Limpiá las rejillas de ventilación con aire comprimido si tenés.',
      'Cerrá programas que no estés usando, sobre todo los que consumen mucho procesador.',
      'Si tenés base con ventilador, usala en juegos o programas pesados.',
    ],
    resultado: 'Si se sigue calentando igual, {{es momento de un cambio de pasta térmica}} y limpieza interna, trabajo de taller.',
  },
  {
    id: 'pantalla',
    titulo: 'Pantalla rota, con manchas o líneas',
    icono: 'monitor-off',
    equipos: 'Notebook · Monitor',
    pasos: [
      'Anotá si el problema aparece siempre o solo al mover o abrir/cerrar la tapa.',
      'Conectá el equipo a un monitor o TV externo para descartar que sea la placa de video.',
      'Sacá fotos del problema con buena luz, ayuda a dar un presupuesto más rápido.',
    ],
    resultado: 'Esto casi siempre {{requiere reemplazo de pantalla o cable flex}}, es reparación de taller.',
  },
  {
    id: 'drift',
    titulo: 'Joystick con drift (se mueve solo)',
    icono: 'gamepad-2',
    equipos: 'Joystick',
    pasos: [
      'Actualizá el firmware del control desde la consola o PC.',
      'Calibrá los analógicos desde la configuración del sistema.',
      'Limpiá alrededor del stick con un cepillo suave, sin líquidos.',
      'Probalo en otro dispositivo para confirmar que el problema es del control.',
    ],
    resultado: 'Si el drift sigue después de calibrar y limpiar, {{hay que reemplazar el potenciómetro}} del analógico.',
  },
  {
    id: 'no-lee-discos',
    titulo: 'La consola no lee discos',
    icono: 'disc',
    equipos: 'Consola',
    pasos: [
      'Probá con otro disco original en buen estado.',
      'Limpiá el disco con un paño suave desde el centro hacia el borde.',
      'Reiniciá la consola completamente: apagar, desenchufar 30 segundos y volver a encender.',
    ],
    resultado: 'Si ningún disco anda y la lectora hace ruido raro, {{la lente necesita limpieza o reemplazo}}.',
  },
  {
    id: 'lento',
    titulo: 'Anda muy lento',
    icono: 'clock-4',
    equipos: 'Notebook · PC',
    pasos: [
      'Reiniciá el equipo (ayuda más de lo que parece).',
      'Desinstalá programas que no uses y borrá archivos temporales.',
      'Revisá el espacio libre en el disco: menos del 15% lo hace más lento.',
      'Ejecutá un antivirus actualizado para descartar malware.',
    ],
    resultado: 'Si sigue lento igual, {{probablemente necesite un SSD o más memoria RAM}}.',
  },
  {
    id: 'sin-internet',
    titulo: 'Sin conexión a internet o wifi',
    icono: 'wifi-off',
    equipos: 'Notebook · PC · Consola',
    pasos: [
      'Reiniciá el router y esperá un minuto antes de reconectar.',
      'Probá conectarte a otra red (datos del celular) para descartar el problema del proveedor.',
      'Olvidá la red guardada y volvé a conectarte escribiendo la contraseña de nuevo.',
      'Revisá que el modo avión esté apagado y el wifi habilitado.',
    ],
    resultado: 'Si otros dispositivos sí se conectan y el tuyo no, {{puede ser la placa de wifi}}.',
  },
];

const WA_ICON = `
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.24-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.28 11.28 0 0 0 12.05.72C5.8.72.7 5.8.7 12.07c0 2 .52 3.95 1.52 5.67L.6 23.64l6.03-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.25 0 11.35-5.09 11.35-11.36 0-3.03-1.18-5.88-3.33-8.03"/>
</svg>`;

const $items  = document.getElementById('diag-items');
const $detail = document.getElementById('diag-detail');

let actual = SINTOMAS[0].id;

const negrita = txt => txt.replace(/\{\{(.+?)\}\}/g, '<strong>$1</strong>');

const linkWhatsApp = s =>
  waLink(`Hola! Tengo un problema: ${s.titulo}. Ya probé los pasos del diagnóstico de la web y sigue igual. ¿Me pasan presupuesto y un turno?`);

function renderLista() {
  $items.innerHTML = SINTOMAS.map(s => `
    <button class="diag-item ${s.id === actual ? 'is-active' : ''}"
            role="tab"
            aria-selected="${s.id === actual}"
            data-id="${s.id}">
      <i data-lucide="${s.icono}"></i>${s.titulo}
    </button>
  `).join('');
}

function renderDetalle() {
  const s = SINTOMAS.find(x => x.id === actual);

  $detail.innerHTML = `
    <div class="diag-head">
      <div class="diag-icon"><i data-lucide="${s.icono}"></i></div>
      <div>
        <h3 class="diag-detail-title">${s.titulo}</h3>
        <p class="diag-meta">${s.equipos} · ${s.pasos.length} pasos</p>
      </div>
    </div>

    <ol class="diag-steps">
      ${s.pasos.map((p, i) => `
        <li class="diag-step">
          <span class="diag-step-num">${i + 1}</span>
          <p class="diag-step-text">${p}</p>
        </li>
      `).join('')}
    </ol>

    <div class="diag-result">
      <p class="diag-result-text">${negrita(s.resultado)}</p>
      <a class="btn-wa" href="${linkWhatsApp(s)}" target="_blank" rel="noopener">
        ${WA_ICON}Consultanos
      </a>
    </div>
  `;

  // Reinicia la animación de entrada
  $detail.style.animation = 'none';
  $detail.offsetHeight;
  $detail.style.animation = '';
}

function render() {
  renderLista();
  renderDetalle();
  if (window.lucide) lucide.createIcons();
}

$items.addEventListener('click', e => {
  const btn = e.target.closest('[data-id]');
  if (!btn || btn.dataset.id === actual) return;
  actual = btn.dataset.id;
  render();

  // En mobile, centra el chip elegido
  btn.scrollIntoView?.({ behavior: 'smooth', inline: 'center', block: 'nearest' });
});

// Navegación con flechas del teclado
$items.addEventListener('keydown', e => {
  if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
  e.preventDefault();
  const i = SINTOMAS.findIndex(s => s.id === actual);
  const dir = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : -1;
  actual = SINTOMAS[(i + dir + SINTOMAS.length) % SINTOMAS.length].id;
  render();
  $items.querySelector(`[data-id="${actual}"]`).focus();
});

render();

})();
