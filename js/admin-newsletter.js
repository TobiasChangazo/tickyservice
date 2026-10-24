/* =========================================================
   TickyService — Admin del newsletter
   Habla con POST /api/send-video. El envío va en tandas: cada
   llamada manda unos pocos mails y esta página repite hasta que
   no quedan pendientes (o se llega al límite diario de Gmail).
   ========================================================= */

const $ = (id) => document.getElementById(id);

const $form = $('adm-form');
const $titulo = $('a-titulo');
const $link = $('a-link');
const $clave = $('a-clave');
const $btnPreview = $('btn-preview');
const $btnPrueba = $('btn-prueba');
const $btnEnviar = $('btn-enviar');
const $btnReintentar = $('btn-reintentar');
const $nota = $('adm-nota');
const $estado = $('adm-estado');
const $resumen = $('adm-resumen');

let previewDe = '';     // título + link de la vista previa vigente
let suscriptores = 0;
let enviando = false;

function datos() {
  return { titulo: $titulo.value.trim(), link: $link.value.trim(), clave: $clave.value };
}
const firma = (d) => `${d.titulo}\n${d.link}`;

function mostrar($el, tipo, mensaje) {
  $el.dataset.estado = tipo;
  $el.textContent = mensaje;
}

async function llamar(accion, extra = {}) {
  const res = await fetch('/api/send-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...datos(), accion, ...extra }),
  });
  const json = await res.json().catch(() => ({ ok: false, error: `El servidor respondió ${res.status}.` }));
  if (!res.ok || !json.ok) throw new Error(json.error || `Error ${res.status}`);
  return json;
}

function bloquear(si) {
  [$btnPreview, $btnPrueba, $btnEnviar, $btnReintentar].forEach((b) => { b.disabled = si; });
  if (!si) $btnEnviar.disabled = firma(datos()) !== previewDe;
  $form.toggleAttribute('aria-busy', si);
}

function mensajeDeError(err) {
  return err instanceof TypeError ? 'No hay conexión con el servidor. ¿Estás en el sitio publicado en Vercel?' : err.message;
}

/* ---------- Vista previa ---------- */
$btnPreview.addEventListener('click', async () => {
  if (!$form.reportValidity()) return;
  bloquear(true);
  mostrar($estado, 'cargando', 'Armando la vista previa…');
  try {
    const [preview, estado] = await Promise.all([llamar('preview'), llamar('estado')]);
    const $frame = $('prev-frame');
    $frame.srcdoc = preview.html;
    $frame.hidden = false;
    $('prev-vacio').hidden = true;
    $('prev-asunto').textContent = preview.asunto;

    suscriptores = estado.suscriptores;
    $resumen.hidden = false;
    $resumen.textContent = `${suscriptores} suscriptores activos · cupo de Gmail hoy: ${estado.cupoHoy} de ${estado.limiteDiario}`;

    previewDe = firma(datos());
    $nota.hidden = true;
    mostrar($estado, 'ok', 'Vista previa lista. Si está todo bien, ya podés enviar.');
  } catch (err) {
    mostrar($estado, 'error', mensajeDeError(err));
  } finally {
    bloquear(false);
  }
});

// Si se cambia el título o el link, hay que volver a mirar la vista previa
[$titulo, $link].forEach(($input) => $input.addEventListener('input', () => {
  const vigente = firma(datos()) === previewDe;
  $btnEnviar.disabled = enviando || !vigente;
  $nota.hidden = vigente;
}));

/* ---------- Prueba ---------- */
$btnPrueba.addEventListener('click', async () => {
  if (!$form.reportValidity()) return;
  bloquear(true);
  mostrar($estado, 'cargando', 'Mandando la prueba…');
  try {
    const r = await llamar('prueba');
    mostrar($estado, 'ok', r.mensaje);
  } catch (err) {
    mostrar($estado, 'error', mensajeDeError(err));
  } finally {
    bloquear(false);
  }
});

/* ---------- Envío en tandas ---------- */
$form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!$form.reportValidity() || firma(datos()) !== previewDe) return;
  const ok = window.confirm(`¿Mandar "${datos().titulo}" a ${suscriptores} suscriptores?\n\nLos que ya lo recibieron no lo vuelven a recibir.`);
  if (ok) enviar(false);
});

$btnReintentar.addEventListener('click', () => enviar(true));

const $mensaje = $('prog-mensaje');
const $listaErrores = $('prog-errores-lista');

function pintar(r) {
  const hechos = r.totalEnviados + r.totalFallidos;
  const total = hechos + r.pendientes;
  $('prog-barra').value = total ? Math.round((hechos / total) * 100) : 100;
  $('st-enviados').textContent = r.totalEnviados;
  $('st-fallidos').textContent = r.totalFallidos;
  $('st-pendientes').textContent = r.pendientes;
  $('st-cupo').textContent = r.cupoHoy;

  r.errores.forEach(({ email, error }) => {
    const li = document.createElement('li');
    li.textContent = `${email}: ${error}`;
    $listaErrores.append(li);
  });
  $('prog-errores').hidden = !$listaErrores.children.length;
}

function avisarSiSale(e) {
  e.preventDefault();
}

async function enviar(reintentar) {
  enviando = true;
  bloquear(true);
  window.addEventListener('beforeunload', avisarSiSale);
  $('adm-progreso').hidden = false;
  $btnReintentar.hidden = true;
  $listaErrores.replaceChildren();
  mostrar($mensaje, 'cargando', 'Enviando… no cierres esta pestaña.');

  let r;
  let anterior = Infinity;
  let primera = true;
  let mandadosAhora = 0;

  try {
    do {
      r = await llamar('enviar', { reintentarFallidos: primera && reintentar });
      primera = false;
      mandadosAhora += r.loteEnviados;
      pintar(r);
      mostrar($mensaje, 'cargando', `Enviando… ${r.totalEnviados} de ${r.totalEnviados + r.totalFallidos + r.pendientes}. No cierres esta pestaña.`);
      if (r.pendientes >= anterior) break; // no avanzó: cortamos para no quedar en un bucle
      anterior = r.pendientes;
    } while (!r.terminado && !r.limiteAlcanzado);

    if (r.limiteAlcanzado) {
      mostrar($mensaje, 'error', `Llegamos al límite diario de Gmail y quedan ${r.pendientes} pendientes. Mañana abrí esta página, pegá el mismo link y apretá “Enviar”: sigue desde donde quedó, sin repetir mails.`);
    } else if (r.terminado && mandadosAhora === 0 && r.totalFallidos === 0) {
      mostrar($mensaje, 'ok', `Este video ya se había mandado a todos (${r.totalEnviados} suscriptores).`);
    } else if (r.terminado) {
      const fallas = r.totalFallidos ? ` ${r.totalFallidos} fallaron: podés reintentarlos.` : '';
      mostrar($mensaje, 'ok', `¡Listo! Se mandó a ${r.totalEnviados} suscriptores.${fallas}`);
    } else {
      mostrar($mensaje, 'error', `El envío se frenó con ${r.pendientes} pendientes. Apretá “Enviar” de nuevo para seguir.`);
    }
    $btnReintentar.hidden = !(r.totalFallidos > 0 && !r.limiteAlcanzado);
  } catch (err) {
    mostrar($mensaje, 'error', `Se cortó el envío: ${mensajeDeError(err)} Apretá “Enviar” de nuevo y sigue desde donde quedó.`);
  } finally {
    enviando = false;
    window.removeEventListener('beforeunload', avisarSiSale);
    bloquear(false);
  }
}
