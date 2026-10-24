/* =========================================================
   TickyService — Contacto
   Arma el mensaje de WhatsApp con nombre, titular del turno y
   consulta, lo muestra en "Así nos va a llegar" y abre WhatsApp.
   El número sale de TICKY (js/site.js, se carga antes).
   ========================================================= */

const $form = document.getElementById('contact-form');
const $nombre = document.getElementById('c-nombre');
const $titular = document.getElementById('c-titular');
const $mensaje = document.getElementById('c-mensaje');
const $previewBox = document.getElementById('c-preview-box');
const $preview = document.getElementById('c-preview');

function armarMensaje() {
  const nombre = $nombre.value.trim();
  const titular = $titular.value.trim();
  const consulta = $mensaje.value.trim();

  const lineas = [nombre ? `Hola TickyService! Soy ${nombre}.` : 'Hola TickyService!'];
  if (titular) lineas.push(`Titular del turno: ${titular}`);
  if (consulta) lineas.push('', consulta);
  return lineas.join('\n');
}

function actualizarPreview() {
  $preview.textContent = armarMensaje();
}

$previewBox.hidden = false;
actualizarPreview();
$form.addEventListener('input', actualizarPreview);

// submit solo llega si la validación nativa pasó (required, minlength)
$form.addEventListener('submit', (e) => {
  e.preventDefault();
  window.open(TICKY.waUrl(armarMensaje()), '_blank', 'noopener');
});
