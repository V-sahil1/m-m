// Reservation API: receives the booking form and sends two emails through Gmail,
// one to the café and one to the guest. In production it also serves the built site.
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bookingOptions, dateValue } from '../src/data.js';
import { guestEmail, ownerEmail } from './emails.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Read react-app/.env when it exists (real environment variables take precedence)
try {
  process.loadEnvFile(path.join(root, '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
// Where reservation notices go; defaults to the sending account
const OWNER_EMAIL = process.env.OWNER_EMAIL || GMAIL_USER;
const PORT = Number(process.env.PORT) || 3001;

const configured = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);
const transporter = configured
  ? nodemailer.createTransport({
      // Port 587 with STARTTLS: some antivirus mail scanners break certificate checks on port 465
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      // Google shows app passwords in groups of four; the spaces are not part of the password
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD.replace(/\s+/g, '') },
    })
  : null;

const app = express();
app.use(express.json({ limit: '10kb' }));

// At most five reservations per address every ten minutes
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map();
function rateLimited(key) {
  const now = Date.now();
  const hits = (recent.get(key) || []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

const TIME_SLOTS = bookingOptions.timeGroups.flatMap((group) => group.slots);
const DAY_MS = 24 * 60 * 60 * 1000;

// A real calendar day inside the booking window. The guest's clock may be in another
// time zone than the server's, so one day of slack is allowed at each end.
function isBookableDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (dateValue(date) !== value) return false;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysAway = Math.round((date - today) / DAY_MS);
  return daysAway >= -1 && daysAway <= bookingOptions.daysAhead;
}

const EMAIL_PATTERN = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;

function parseBooking(body) {
  const name = typeof body?.name === 'string' ? body.name.replace(/[\r\n]+/g, ' ').trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const { date, time, party } = body ?? {};
  const slot = TIME_SLOTS.find((option) => option.value === time);

  if (name.length < 1 || name.length > 80) return { error: 'Please enter your name.' };
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return { error: 'Please enter a valid email address.' };
  // Only the choices the form offers are accepted
  if (!isBookableDate(date) || !slot || !bookingOptions.parties.includes(party)) {
    return { error: 'Please choose a date, time and party size from the list.' };
  }

  // The emails show the date and time written out, e.g. "Sunday 11 October 2026" at "8:30 AM"
  const [year, month, day] = date.split('-').map(Number);
  const dateLabel = new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return { booking: { name, email, date: dateLabel, time: slot.label, party } };
}

app.get('/api/health', (request, response) => {
  response.json({ ok: true, emailConfigured: configured });
});

app.post('/api/reservations', async (request, response) => {
  if (!configured) {
    console.error('Reservation received but GMAIL_USER / GMAIL_APP_PASSWORD are not set in .env');
    return response.status(503).json({ error: 'Reservations by email are not set up yet. Please try again later.' });
  }
  if (rateLimited(request.ip)) {
    return response.status(429).json({ error: 'Too many reservations from this connection. Please try again in a few minutes.' });
  }

  const { booking, error } = parseBooking(request.body);
  if (error) return response.status(400).json({ error });

  booking.reference = 'MM-' + Date.now().toString(36).toUpperCase().slice(-6);
  booking.receivedAt = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

  const from = { name: 'Moss & Mellow', address: GMAIL_USER };
  try {
    // The café's copy first: if that fails, the guest is not told the table is held
    await transporter.sendMail({ from, to: OWNER_EMAIL, replyTo: booking.email, ...ownerEmail(booking) });
    await transporter.sendMail({ from, to: booking.email, replyTo: OWNER_EMAIL, ...guestEmail(booking) });
  } catch (sendError) {
    console.error('Could not send reservation email:', sendError.message);
    return response.status(502).json({ error: 'We could not send your confirmation just now. Please try again in a moment.' });
  }

  return response.json({ ok: true, reference: booking.reference });
});

// Serve the built site when it exists (npm run build, then npm start)
const dist = path.join(root, 'dist');
if (fs.existsSync(path.join(dist, 'index.html'))) {
  app.use(express.static(dist));
  app.get(/^(?!\/api\/).*/, (request, response) => response.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Reservation server on http://localhost:${PORT}`);
  if (!configured) console.warn('Email is NOT configured: add GMAIL_USER and GMAIL_APP_PASSWORD to .env');
});
