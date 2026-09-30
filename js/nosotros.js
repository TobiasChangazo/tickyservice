/* =========================================================
   TickyService — Nosotros
   Cuenta los números de la franja oscura cuando entran en pantalla
   ========================================================= */

(() => {
  // Cantidad real de guías publicadas (js/guias-data.js)
  const $guias = document.getElementById('stat-guias');
  if ($guias && window.TICKY_GUIAS) {
    const total = window.TICKY_GUIAS.GUIAS.length;
    $guias.dataset.count = total;
    $guias.textContent = total;
  }

  const numeros = document.querySelectorAll('.about-stats [data-count]');
  if (!numeros.length) return;

  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const formato = n => n.toLocaleString('es-AR');

  function animar(el) {
    const final = Number(el.dataset.count);
    if (reducir) {
      el.textContent = formato(final);
      return;
    }

    const duracion = 1400;
    const inicio = performance.now();

    function frame(ahora) {
      const t = Math.min((ahora - inicio) / duracion, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out
      el.textContent = formato(Math.round(final * ease));
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  // Arranca en 0 (el HTML trae el valor final por si no carga el JS)
  if (!reducir) numeros.forEach(el => { el.textContent = '0'; });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animar(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  numeros.forEach(el => observer.observe(el));

  if (window.lucide) lucide.createIcons();
})();
