// HTML and plain-text bodies for the two reservation emails.
// Email clients ignore stylesheets and web fonts, so everything is table-based with inline styles.

const colors = {
  page: '#f4f5e3',
  card: '#ffffff',
  ink: '#1b1d12',
  muted: '#45483a',
  faint: '#767869',
  olive: '#5c6e21',
  line: '#e3e4d3',
  wash: '#fafae9',
};

const serif = "Georgia, 'Times New Roman', serif";
const sans = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const label = (text) =>
  `<p style="margin:0 0 6px;font-family:${sans};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${colors.olive};">${text}</p>`;

function detailRows(rows) {
  return rows
    .map(
      ([name, value]) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid ${colors.line};font-family:${sans};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${colors.faint};width:38%;vertical-align:top;">${name}</td>
          <td style="padding:14px 0;border-bottom:1px solid ${colors.line};font-family:${sans};font-size:15px;color:${colors.ink};vertical-align:top;">${value}</td>
        </tr>`
    )
    .join('');
}

function layout({ preheader, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Moss &amp; Mellow</title>
</head>
<body style="margin:0;padding:0;background:${colors.page};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:${colors.page};">${preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.page};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr>
          <td align="center" style="padding:8px 0 28px;">
            <p style="margin:0;font-family:${serif};font-size:26px;letter-spacing:1px;text-transform:uppercase;color:${colors.ink};">Moss &amp; Mellow</p>
            <p style="margin:6px 0 0;font-family:${sans};font-size:10px;letter-spacing:4px;text-transform:uppercase;color:${colors.olive};">Atelier</p>
          </td>
        </tr>
        <tr>
          <td style="background:${colors.card};border-top:4px solid ${colors.olive};padding:40px 36px;">
            ${body}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:28px 16px 8px;font-family:${sans};font-size:12px;line-height:1.7;color:${colors.faint};">
            74 Rue de Bellechasse, Paris &nbsp;·&nbsp; Kingly Court, Carnaby, London<br>
            Open daily 07:30 — 18:00
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

// Sent to the guest who made the reservation
export function guestEmail(booking) {
  const name = escapeHtml(booking.name);
  const rows = detailRows([
    ['Date', escapeHtml(booking.date)],
    ['Service time', escapeHtml(booking.time)],
    ['Party', escapeHtml(booking.party)],
    ['Reference', escapeHtml(booking.reference)],
  ]);

  const html = layout({
    preheader: `Your table is held for ${escapeHtml(booking.date)} at ${escapeHtml(booking.time)}.`,
    body: `
      ${label('Reservation confirmed')}
      <h1 style="margin:0 0 18px;font-family:${serif};font-weight:normal;font-size:34px;line-height:1.1;color:${colors.ink};">
        Slow down. Settle in.<br><span style="font-style:italic;color:${colors.olive};">The kettle is on.</span>
      </h1>
      <p style="margin:0 0 28px;font-family:${sans};font-size:15px;line-height:1.7;color:${colors.muted};">
        Dear ${name}, thank you for reserving your pause with us. A quiet table is being held in your name. Here are the details of your visit.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${colors.line};">${rows}</table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
        <tr>
          <td style="background:${colors.wash};padding:20px 22px;font-family:${sans};font-size:13px;line-height:1.7;color:${colors.muted};">
            <strong style="color:${colors.ink};">Good to know</strong><br>
            We hold tables for fifteen minutes past the reserved time. The kitchen closes at 16:00 daily.
            To change or cancel, simply reply to this email.
          </td>
        </tr>
      </table>
      <p style="margin:28px 0 0;font-family:${serif};font-style:italic;font-size:17px;color:${colors.ink};">
        We look forward to welcoming you.<br>
        <span style="font-family:${sans};font-style:normal;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${colors.faint};">— The Moss &amp; Mellow team</span>
      </p>`,
  });

  const text = [
    `Dear ${booking.name},`,
    '',
    'Thank you for reserving your pause with Moss & Mellow. A quiet table is being held in your name.',
    '',
    `Date: ${booking.date}`,
    `Service time: ${booking.time}`,
    `Party: ${booking.party}`,
    `Reference: ${booking.reference}`,
    '',
    'We hold tables for fifteen minutes past the reserved time. The kitchen closes at 16:00 daily.',
    'To change or cancel, simply reply to this email.',
    '',
    '— The Moss & Mellow team',
  ].join('\n');

  return { subject: `Your table at Moss & Mellow — ${booking.date}`, html, text };
}

// Sent to the café so the team knows a table was requested
export function ownerEmail(booking) {
  const email = escapeHtml(booking.email);
  const rows = detailRows([
    ['Guest', escapeHtml(booking.name)],
    ['Email', `<a href="mailto:${email}" style="color:${colors.olive};">${email}</a>`],
    ['Date', escapeHtml(booking.date)],
    ['Service time', escapeHtml(booking.time)],
    ['Party', escapeHtml(booking.party)],
    ['Reference', escapeHtml(booking.reference)],
    ['Received', escapeHtml(booking.receivedAt)],
  ]);

  const html = layout({
    preheader: `${escapeHtml(booking.name)} · ${escapeHtml(booking.party)} · ${escapeHtml(booking.date)}, ${escapeHtml(booking.time)}`,
    body: `
      ${label('New reservation')}
      <h1 style="margin:0 0 18px;font-family:${serif};font-weight:normal;font-size:30px;line-height:1.15;color:${colors.ink};">
        ${escapeHtml(booking.name)} has reserved a table
      </h1>
      <p style="margin:0 0 28px;font-family:${sans};font-size:15px;line-height:1.7;color:${colors.muted};">
        A reservation was made through the website. The guest has been sent a confirmation. Reply to this email to write to them directly.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${colors.line};">${rows}</table>`,
  });

  const text = [
    'New reservation from the website',
    '',
    `Guest: ${booking.name}`,
    `Email: ${booking.email}`,
    `Date: ${booking.date}`,
    `Service time: ${booking.time}`,
    `Party: ${booking.party}`,
    `Reference: ${booking.reference}`,
    `Received: ${booking.receivedAt}`,
  ].join('\n');

  return { subject: `New reservation — ${booking.name}, ${booking.date}, ${booking.time}`, html, text };
}
