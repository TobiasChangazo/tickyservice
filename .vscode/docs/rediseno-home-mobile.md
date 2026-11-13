# Rediseño del home — vista mobile

Referencias visuales: `docs/home-mobile.dc.html` (home) y `docs/menu-mobile.dc.html` (menú abierto). Son los diseños exportados de Claude Design: HTML con estilos inline. No se usa como página; sirve para copiar medidas, colores, tamaños de texto, radios y espaciados. Ante una duda, gana ese archivo.

## Objetivo

El home mobile (< 768px) pasa a seguir el flujo del MVP, con secciones numeradas:
**01 ¿Qué le pasa?** → **02 Guías** → **03 ¿No se solucionó?** → **04 Servicios** → **05 FAQ**.
En desktop (≥ 768px) no se rompe nada: las mismas secciones se reacomodan en más columnas.

## Base visual

- Fuentes: Poppins (ya está) + **JetBrains Mono 500/600**, solo para etiquetas, números y metadatos (`.mono`). Cargarla desde Google Fonts igual que Poppins.
- Colores nuevos (agregar a `css/tokens.css` con nombre; no hex sueltos):
  - fondo hero/menú `#2A0748` · tinta oscura/footer `#1C1330`
  - fondo claro `#FBF8FE` · tinte lila `#F3EAFB` · borde de tarjeta `#E6D9F3` · línea suave `#ECE2F6`
  - texto secundario `#4F4366`
  - acento verde agua sobre claro (texto) `#08715F` · texto sobre botón verde agua `#0B2E25`
  - chip de equipo: fondo `#E3F6F1`, texto `#08715F`
  - Si ya existe un token equivalente (±2 de diferencia), reutilizarlo.
- Cuadrícula: hero, sección 03 y menú con líneas blancas al 7%, celda de 32px. Sección 01 con líneas `rgba(71,12,120,.06)`. Usar los tokens de cuadrícula existentes y ajustarlos si hace falta.
- Etiqueta de sección: mono 11px, 600, `letter-spacing .14em`, mayúsculas, verde agua (`#08715F` sobre claro, `#0FB89B` sobre oscuro). Formato `01 — EMPEZÁ ACÁ`.
- Títulos de sección: 26px/1.15, 700. Texto: 15px/1.55, color secundario.
- Padding de sección: 40px 20px. Tarjetas: radio 18px, borde 1px `#E6D9F3`, fondo blanco.
- Todo lo tocable: mínimo 44px de alto.

## Secciones (en orden)

### Header (sticky, 64px)
- Fondo blanco al 94%, borde inferior `#ECE2F6`.
- Logo wordmark a **24px de alto** (hoy es mucho más grande).
- A la derecha: ícono de lupa (link a `#sintomas`) y botón de menú 44×44, radio 12, fondo `#F3EAFB`.

### Menú abierto (pantalla completa)
- Fondo `#2A0748` con cuadrícula. Arriba, logo blanco y botón cerrar 44×44.
- Links grandes (26px) con número mono `01…06` a la izquierda y separador entre ítems. El activo lleva un punto verde agua. Guías muestra la cantidad (16).
- Abajo: botón verde agua "¿Qué le pasa a tu equipo?" (→ `#sintomas`), botones WhatsApp e Instagram en dos columnas, y la ubicación.
- **Sin el zorro de fondo.**

### Hero
- Fondo `#2A0748` + cuadrícula. **Sin zorro en mobile** (en desktop puede quedar, sin tocar el texto).
- Eyebrow mono: `SERVICIO TÉCNICO · MAR DE AJÓ`.
- H1 36px/1.06, 800: "Tu hardware en manos de **confianza.**", con "confianza." en verde agua.
- Bajada (16px, blanco 80%): "Antes de traerlo, probá resolverlo con nuestras guías paso a paso. Si no sale, lo reparamos con presupuesto sin cargo."
- CTA principal (58px, verde agua, radio 16): lupa + "¿Qué le pasa a tu equipo?" + flecha abajo → `#sintomas`.
- CTA secundario (52px, borde blanco 32%): ícono WhatsApp + "Pedir presupuesto" → WhatsApp.
- Fila de 3 garantías con ícono verde agua, separada por una línea arriba: "Diagnóstico sin cargo" · "Entrega en 24 a 48 hs" · "30 días de garantía".
- **Se eliminan** la cita en itálica, los 4 chips (Reparación, Mantenimiento, etc.) y el link subrayado "Ver guías".

### 01 — ¿Qué le pasa a tu equipo? (`id="sintomas"`)
- Título "¿Qué le pasa a tu equipo?" y texto "Elegí el síntoma y te llevamos a los pasos para probar en casa."
- Grilla 2×2 de tarjetas link (alto mínimo 136px): ícono en cuadrado 42px con fondo `#F3EAFB`, flecha diagonal arriba a la derecha, título y equipos.
  - **No enciende** (Notebook · PC · Consola) → guía `notebook-no-enciende`
  - **Se calienta** (Notebook · PC · Consola) → guía `pasta-termica`
  - **Se apaga solo** (Notebook · PC · Consola) → guía `consola-se-apaga`
  - **Drift en el joystick** (Joystick) → guía `joystick-drift`
- Debajo, un link ancho con borde punteado: "Otro problema · Ver todos los síntomas" → diagnóstico (ver abajo).
- En desktop: 4 columnas.

### Diagnóstico guiado
Sale del home: queda reemplazado por la sección 01. **Mover el bloque de diagnóstico completo, sin cambiar cómo funciona, al final de `servicios.html`, con `id="diagnostico"`** (en la arquitectura del Figma está dentro de Servicios). "Otro problema" lleva a `servicios.html#diagnostico`. Actualizar los links que hoy apuntan al diagnóstico del home (footer incluido).

### 02 — Guías paso a paso (`id="guias"`)
- Etiqueta `02 — PROBÁ RESOLVERLO`, título "Guías paso a paso" y texto "Cada guía te dice si lo podés hacer vos, si necesitás herramientas o si ya es trabajo de taller."
- Filtro por equipo: chips de 40px que **pasan a la línea siguiente cuando no entran (sin scroll horizontal)**, con contador mono. El activo va relleno violeta `#470C78`. Se mantiene el mecanismo de filtrado que ya existe.
- El filtro de dificultad se reemplaza en el home por una **leyenda** (no filtra) en una caja `#FBF8FE`, con las 3 barras: Podés hacerlo vos / Con herramientas / Taller. En `guias.html` el filtro de dificultad sigue igual.
- Tarjetas de guía: chip de equipo con ícono, meta mono (`GUÍA · 5 MIN`, `VIDEO · 6 MIN`), título 17px 600, barra de nivel con su texto y flecha. Se mantiene el set de guías que muestra hoy el home y su filtrado.
- Botón ancho oscuro `#1C1330`, 54px: "Ver las 16 guías →" (flecha verde agua) → `guias.html`.
- En desktop: tarjetas en 2 o 3 columnas.

### 03 — ¿No se solucionó? (sección nueva, `id="reparacion"`)
- Fondo `#470C78` + cuadrícula, texto blanco.
- Título "Lo reparamos nosotros" y texto "Si la guía no alcanza, seguís con nosotros sin empezar de cero."
- Stepper vertical de 3 pasos: número mono en círculo verde agua de 32px, unidos por una línea verde agua al 45%.
  1. **Escribinos por WhatsApp**: "Contanos qué guía probaste y qué pasó."
  2. **Presupuesto sin cargo**: "Te decimos cuánto sale antes de tocar nada."
  3. **Turno y entrega en 24 a 48 hs**: "Con 30 días de garantía en mano de obra y repuestos."
- Botón WhatsApp verde `#25D366`, texto `#0B2E18`, 56px: "Pedir presupuesto y turno". El mensaje prellenado pide presupuesto y turno.
- Reemplaza el bloque de garantías que estaba después de servicios.

### 04 — Servicio técnico por equipo
- Etiqueta `04 — QUÉ REPARAMOS`, título "Servicio técnico por equipo".
- **Una sola tarjeta** con 4 filas link (alto mínimo 76px, separadas por línea): ícono 44px, nombre del equipo con la cantidad de servicios en mono, una línea de ejemplos y un chevron.
  - Notebook: Limpieza, SSD, bisagras, teclado, Windows
  - PC: Armado, RAM, placa de video, Windows
  - Joystick: Drift, pin de carga, gatillos y botones
  - Consola: Lente lectora, fuente, puerto HDMI
  - Las cantidades salen de los datos reales de servicios (hoy 9 / 8 / 5 / 6).
- Link "Ver todos los servicios →" a `servicios.html`.
- **Reemplaza** en el home el panel grande de servicios con pestañas, que sigue completo en `servicios.html`. Esto elimina el bug del texto "PLACEHOLDER" superpuesto.

### 05 — FAQ
- Etiqueta `05 — PREGUNTAS FRECUENTES`, título "Lo que más nos preguntan".
- En el home, solo las primeras 4 preguntas, con las **respuestas reales que ya están en el sitio**. Cada una es un acordeón con fondo blanco, borde y radio 14. El abierto lleva fondo `#F7F1FC` e ícono "−" en círculo violeta; los cerrados, "+" con borde.
- Link "Ver todas las preguntas →". Si no existe una página de FAQ, que apunte a `contacto.html` o dejar las 7 preguntas en el home: decidí y avisame.

### Footer
- Fondo `#1C1330`. Logo blanco de 24px y descripción.
- Fila de 3 botones de ícono de 48px (WhatsApp, Instagram, email).
- Dos columnas: SECCIONES (Guías, Servicios, Tienda, Contacto, Nosotros) y EQUIPOS (Notebook, PC, Joystick, Consola), con títulos mono en verde agua y links de 36px de alto.
- Abajo, con línea arriba: pin + "Mar de Ajó, Partido de la Costa" y "© 2026 TickyService. Todos los derechos reservados."
- **Padding inferior de 112px en mobile**, para que el botón flotante no tape el ©.

### Botón flotante de WhatsApp
- 56×56, radio 18 (no círculo), verde `#25D366`, ícono `#0B2E18`, sombra `0 8px 24px rgba(28,19,48,.28)`, a 16px de los bordes.

## Lo que no se toca
- El contenido de las guías, los datos de servicios y FAQ, los números de WhatsApp ni los textos del footer ya corregidos.
- Las demás páginas, salvo mover el diagnóstico a `servicios.html` y actualizar los links que apuntaban a él.

## Verificación
- A 390px y 360px: sin scroll horizontal, nada cortado (los chips pasan a otra línea), todos los elementos tocables de 44px o más y el botón flotante sin tapar texto al final.
- A 768, 1280 y 1440px: el home se ve ordenado, sin superposiciones y el hero sin chocar con el zorro.
- Que funcionen todos los links (síntomas → guías, "Otro problema" → diagnóstico en servicios) y que el diagnóstico siga andando en su nueva ubicación.
- Pasame capturas o un resumen de lo que cambió y de las decisiones que tomaste.
