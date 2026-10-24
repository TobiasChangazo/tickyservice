/* =========================================================
   TickyService — JS común a todas las páginas
   El sitio funciona sin JavaScript: los links de WhatsApp ya
   traen número y mensaje en el HTML, y el newsletter se manda
   como formulario común. Esto solo mejora lo que ya está:
   - Número y mensajes de WhatsApp en un solo lugar (TICKY)
   - Botón flotante de las guías con el nombre de la guía
   - Newsletter con estados de cargando / éxito / error
   ========================================================= */

/* ---------- Datos de contacto: cambiar SOLO acá ----------
   (los href del HTML son el respaldo sin JS; este script los
   pisa con estos valores en cada página) */
const TICKY = {
  WA_NUMERO: '5492257637016', // +54 9 2257 63-7016
  WA_MENSAJE_BASE: 'Hola TickyService! Vengo de la web y quería hacer una consulta sobre mi equipo.',
  WA_MENSAJE_GUIA: "Hola! Probé la guía '{guia}' y no se solucionó.",

  waUrl(texto) {
    return `https://wa.me/${this.WA_NUMERO}` + (texto ? `?text=${encodeURIComponent(texto)}` : '');
  },
};
window.TICKY = TICKY;

/* ---------- Links de WhatsApp ----------
   Todos pasan a usar TICKY.WA_NUMERO. Los que tienen mensaje propio
   (guías, diagnóstico, presupuesto) lo conservan; los genéricos
   llevan el mensaje base. */
document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
  let texto;
  if (link.dataset.waGuia) {
    texto = TICKY.WA_MENSAJE_GUIA.replace('{guia}', link.dataset.waGuia);
  } else {
    texto = new URL(link.href).searchParams.get('text') || TICKY.WA_MENSAJE_BASE;
  }
  link.href = TICKY.waUrl(texto);
});

/* ---------- Newsletter ----------
   La validación es la nativa del navegador (required, type="email"):
   el evento submit solo llega si los campos están bien. */
document.querySelectorAll('form[data-newsletter]').forEach((form) => {
  const estado = form.querySelector('.news-estado');
  const boton = form.querySelector('button[type="submit"]');
  const textoBoton = boton.querySelector('span');
  const textoOriginal = textoBoton.textContent;

  function mostrar(tipo, mensaje) {
    estado.dataset.estado = tipo;
    estado.textContent = mensaje;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (boton.disabled) return;

    const datos = Object.fromEntries(new FormData(form));
    datos.acepto = form.elements.acepto.checked;

    boton.disabled = true;
    form.setAttribute('aria-busy', 'true');
    textoBoton.textContent = 'Suscribiendo…';
    mostrar('cargando', 'Te estamos suscribiendo…');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(datos),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'No pudimos suscribirte. Probá de nuevo en un rato.');

      mostrar('ok', json.mensaje);
      form.reset();
    } catch (err) {
      // fetch tira TypeError cuando no hay conexión o el servidor no responde
      mostrar('error', err instanceof TypeError
        ? 'No pudimos conectarnos. Revisá tu internet y probá de nuevo.'
        : err.message);
    } finally {
      boton.disabled = false;
      form.removeAttribute('aria-busy');
      textoBoton.textContent = textoOriginal;
    }
  });
});
