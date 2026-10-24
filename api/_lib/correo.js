/* =========================================================
   TickyService — envío de mails (Nodemailer + SMTP de Gmail)
   y plantillas del newsletter.

   Las plantillas usan tablas y estilos en línea: es lo único que
   Gmail, Outlook y los celulares muestran igual. Los colores son
   los de marca (tokens.css), escritos acá porque en un mail no
   hay variables CSS.
   ========================================================= */
import nodemailer from 'nodemailer';
import { escaparHtml } from './util.js';

const C = {
  violeta: '#470C78',   // --brand-700
  lila: '#D3B6EB',      // lila claro de marca
  lilaFondo: '#F2E9F9', // --lilac-100
  tinta: '#1C1330',     // --ink-900
  texto: '#4A3D63',     // --ink-600
  apagado: '#635779',   // --ink-400
  linea: '#E6D6F3',     // --lilac-200
};

/* ---------- Transporte ----------
   pool: true reutiliza una sola conexión para toda la tanda.
   Siempre cerrarlo al terminar (en serverless no queda nadie que lo cierre). */
export function crearTransporte({ pool = false } = {}) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Faltan GMAIL_USER o GMAIL_APP_PASSWORD en las variables de entorno.');
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, ''), // Google la muestra con espacios
    },
    pool,
    maxConnections: 1,
  });
}

export function enviarCorreo(transporte, { para, asunto, html, texto, urlBaja }) {
  return transporte.sendMail({
    from: { name: 'TickyService', address: process.env.GMAIL_USER },
    to: para,
    subject: asunto,
    html,
    text: texto,
    headers: {
      // Botón "Anular suscripción" que Gmail muestra al lado del remitente
      'List-Unsubscribe': `<${urlBaja}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });
}

/* ---------- Plantillas ---------- */
export function mailBienvenida({ nombre, sitio, urlBaja }) {
  const n = escaparHtml(nombre);
  return {
    asunto: '¡Listo, ya estás suscripto/a a TickyService! 🎉',
    html: marco({
      sitio,
      urlBaja,
      preheader: 'Te vamos a avisar cada vez que subamos un video tutorial.',
      contenido: `
        <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:700;color:${C.violeta};">¡Hola ${n}, bienvenido/a!</h1>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${C.texto};">Gracias por sumarte al newsletter de TickyService. Cada vez que subamos un video tutorial a nuestro Instagram, te va a llegar un mail como este.</p>
        <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:${C.texto};">Mientras tanto, en la web tenés guías paso a paso para resolver los problemas más comunes de notebooks, PCs, joysticks y consolas.</p>
        ${boton('Ver las guías', `${sitio}/guias.html`)}`,
    }),
    texto: [
      `¡Hola ${nombre}, bienvenido/a!`,
      '',
      'Gracias por sumarte al newsletter de TickyService. Cada vez que subamos un video tutorial a nuestro Instagram, te va a llegar un mail.',
      '',
      `Guías paso a paso: ${sitio}/guias.html`,
      '',
      pieTexto(urlBaja),
    ].join('\n'),
  };
}

export function mailVideo({ nombre, titulo, link, sitio, urlBaja }) {
  const n = escaparHtml(nombre);
  const t = escaparHtml(titulo);
  const l = escaparHtml(link);
  return {
    asunto: 'Nuevo video tutorial en TickyService 🎥',
    html: marco({
      sitio,
      urlBaja,
      preheader: `Subimos un nuevo video: ${titulo}`,
      contenido: `
        <p style="margin:0 0 10px;font-size:12px;line-height:1;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.violeta};">🎥 Nuevo video tutorial</p>
        <h1 style="margin:0 0 20px;font-size:24px;line-height:1.25;font-weight:700;color:${C.tinta};">${t}</h1>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${C.texto};">Hola ${n}, subimos un nuevo video tutorial: <strong style="color:${C.tinta};">${t}</strong>.</p>
        <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:${C.texto};">Te invitamos a verlo en nuestro Instagram.</p>
        ${boton('Ver video', link)}
        <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:${C.apagado};">¿No funciona el botón? Copiá este link:<br><a href="${l}" style="color:${C.violeta};word-break:break-all;">${l}</a></p>`,
    }),
    texto: [
      `Hola ${nombre}, subimos un nuevo video tutorial: ${titulo}.`,
      '',
      `Te invitamos a verlo en nuestro Instagram: ${link}`,
      '',
      pieTexto(urlBaja),
    ].join('\n'),
  };
}

function boton(texto, href) {
  // Botón "a prueba de balas": la celda lleva el color por si el cliente ignora el padding del <a>
  return `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
          <tr>
            <td align="center" bgcolor="${C.violeta}" style="border-radius:999px;background:${C.violeta};">
              <a href="${escaparHtml(href)}" target="_blank" style="display:inline-block;padding:14px 34px;font-family:Poppins,'Segoe UI',Arial,sans-serif;font-size:16px;font-weight:700;line-height:1;color:#ffffff;text-decoration:none;border-radius:999px;">${escaparHtml(texto)}</a>
            </td>
          </tr>
        </table>`;
}

function pieTexto(urlBaja) {
  return [
    '—',
    'TickyService · Servicio técnico, repuestos y tecnología · Mar de Ajó, Partido de la Costa',
    'Te llega este mail porque te suscribiste en nuestra web.',
    `Darme de baja: ${urlBaja}`,
  ].join('\n');
}

function marco({ sitio, urlBaja, preheader, contenido }) {
  const logo = `${sitio}/img/marca/logo-wordmark-blanco.png`;
  return `<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>TickyService</title>
</head>
<body style="margin:0;padding:0;background:${C.lilaFondo};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escaparHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.lilaFondo};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid ${C.linea};font-family:Poppins,'Segoe UI',Arial,sans-serif;">
          <tr>
            <td align="center" bgcolor="${C.violeta}" style="background:${C.violeta};padding:26px 24px;">
              <a href="${escaparHtml(sitio)}" target="_blank"><img src="${escaparHtml(logo)}" width="168" height="36" alt="TickyService" style="display:block;border:0;width:168px;height:auto;color:#ffffff;font-size:22px;font-weight:700;"></a>
            </td>
          </tr>
          <tr><td height="6" bgcolor="${C.lila}" style="background:${C.lila};font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td style="padding:34px 30px 36px;">
              ${contenido}
            </td>
          </tr>
          <tr>
            <td style="padding:22px 30px 26px;background:${C.lilaFondo};border-top:1px solid ${C.linea};">
              <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:${C.texto};"><strong style="color:${C.violeta};">TickyService</strong> · Servicio técnico, repuestos y tecnología<br>Mar de Ajó, Partido de la Costa</p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:${C.apagado};">Te llega este mail porque te suscribiste en nuestra web. <a href="${escaparHtml(urlBaja)}" style="color:${C.violeta};text-decoration:underline;">Darme de baja</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
