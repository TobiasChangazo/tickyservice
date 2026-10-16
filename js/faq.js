/* =========================================================
   TickyService — FAQ (acordeón)
   <div id="faq-list" data-limite="4"> muestra solo las primeras N
   preguntas; el botón #faq-mas despliega el resto en el lugar.
   Sin data-limite se muestran todas. Íconos: Lucide (data-lucide).
   ========================================================= */
(function(){

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

const $list = document.getElementById('faq-list');
const $mas  = document.getElementById('faq-mas');
if (!$list) return;

const LIMITE = Math.min(Number($list.dataset.limite) || FAQS.length, FAQS.length);
let abierta = 0; // -1 para arrancar con todas cerradas

const negrita = txt => txt.replace(/\{\{(.+?)\}\}/g, '<strong>$1</strong>');

/* ---------- Acordeón ---------- */
function render() {
  $list.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item ${i === abierta ? 'is-open' : ''}" data-i="${i}"${i >= LIMITE ? ' hidden' : ''}>
      <h3 class="faq-h">
        <button type="button" class="faq-q"
                id="faq-q-${i}"
                aria-expanded="${i === abierta}"
                aria-controls="faq-a-${i}">
          <span class="faq-q-text">${f.pregunta}</span>
          <span class="faq-toggle" aria-hidden="true"><i data-lucide="plus" class="faq-ic-mas"></i><i data-lucide="minus" class="faq-ic-menos"></i></span>
        </button>
      </h3>
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

/* ---------- Ver todas las preguntas ---------- */
if ($mas) {
  if (LIMITE >= FAQS.length) $mas.hidden = true;
  $mas.addEventListener('click', () => {
    $list.querySelectorAll('.faq-item[hidden]').forEach(item => { item.hidden = false; });
    $mas.hidden = true;
    // El foco pasa a la primera pregunta nueva (el botón deja de existir)
    $list.querySelectorAll('.faq-q')[LIMITE]?.focus();
  });
}

render();

})();
