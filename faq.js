/* =========================================================
   TickyService — FAQ
   Íconos: Lucide (data-lucide). WhatsApp va como SVG inline.
   ========================================================= */
(function(){

// Mismo número que en diagnóstico y servicios
const WHATSAPP_NUMERO = '549232323232';

// Lo que va entre {{ }} sale en negrita
const FAQS = [
  {
    pregunta: '¿Cuánto tarda una reparación?',
    respuesta: 'La mayoría de los diagnósticos están en {{24 a 48 horas}}, y te avisamos el tiempo estimado apenas confirmamos el presupuesto.',
  },
  {
    pregunta: '¿El presupuesto tiene costo?',
    respuesta: 'No, {{el diagnóstico y el presupuesto son sin cargo}}. Solo abonás si decidís avanzar con la reparación.',
  },
  {
    pregunta: '¿Qué garantía tienen las reparaciones?',
    respuesta: 'Todas nuestras reparaciones y repuestos instalados cuentan con {{garantía escrita}}, cuyo plazo te informamos junto con el presupuesto.',
  },
  {
    pregunta: '¿Hacen retiro a domicilio?',
    respuesta: 'Sí, coordinamos el retiro y la entrega a domicilio en {{Mar de Ajó y alrededores}}. Consultanos la disponibilidad por WhatsApp.',
  },
  {
    pregunta: '¿Qué formas de pago aceptan?',
    respuesta: '{{Efectivo, transferencia bancaria y tarjetas de débito y crédito}}.',
  },
  {
    pregunta: '¿Tengo que hacer backup de mis datos antes de traerlo?',
    respuesta: 'Sí, siempre te lo vamos a pedir. Algunas reparaciones implican borrar o reinstalar el sistema, así que un backup previo te evita disgustos. {{Tenemos una guía corta}} para hacerlo antes de traer el equipo.',
  },
  {
    pregunta: '¿Hay equipos que no se pueden reparar?',
    respuesta: 'Sí. Cuando el daño no tiene una reparación que valga la pena frente al costo de un equipo nuevo, o cuando ya no se consiguen repuestos, {{te lo decimos de entrada en el diagnóstico}}, sin vueltas.',
  },
];

const WA_ICON = `
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.24-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.28 11.28 0 0 0 12.05.72C5.8.72.7 5.8.7 12.07c0 2 .52 3.95 1.52 5.67L.6 23.64l6.03-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.25 0 11.35-5.09 11.35-11.36 0-3.03-1.18-5.88-3.33-8.03"/>
</svg>`;

const $list = document.getElementById('faq-list');
const $wa   = document.getElementById('faq-wa');

let abierta = 0; // -1 para arrancar con todas cerradas

const negrita = txt => txt.replace(/\{\{(.+?)\}\}/g, '<strong>$1</strong>');

/* ---------- CTA ---------- */
$wa.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
  'Hola! Probé lo de la web y el problema sigue. Les cuento:'
)}`;
$wa.insertAdjacentHTML('afterbegin', WA_ICON);

/* ---------- Acordeón ---------- */
function render() {
  $list.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item ${i === abierta ? 'is-open' : ''}" data-i="${i}">
      <button class="faq-q"
              id="faq-q-${i}"
              aria-expanded="${i === abierta}"
              aria-controls="faq-a-${i}">
        <p class="faq-q-text">${f.pregunta}</p>
        <span class="faq-toggle"><i data-lucide="plus"></i></span>
      </button>
      <div class="faq-a-wrap" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
        <div class="faq-a-inner">
          <p class="faq-a">${negrita(f.respuesta)}</p>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

// Solo actualiza clases (no re-renderiza) para que la animación sea suave
function toggle(i) {
  abierta = abierta === i ? -1 : i;
  $list.querySelectorAll('.faq-item').forEach(item => {
    const open = Number(item.dataset.i) === abierta;
    item.classList.toggle('is-open', open);
    item.querySelector('.faq-q').setAttribute('aria-expanded', open);
  });
}

$list.addEventListener('click', e => {
  const btn = e.target.closest('.faq-q');
  if (!btn) return;
  toggle(Number(btn.closest('.faq-item').dataset.i));
});

render();

})();
