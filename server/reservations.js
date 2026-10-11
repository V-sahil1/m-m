// Reservation logic shared by the local Express server (server/index.js) and the
// Vercel functions (api/*.js): checks the booking and sends two emails through Gmail,
// one to the café and one to the guest.
import nodemailer from 'nodemailer';
import { bookingOptions, dateValue } from '../src/data.js';
import { guestEmail, ownerEmail } from './emails.js';

// Read when first needed, not at import: the Express server loads .env after its imports run
let mailer;
function getMailer() {
  if (mailer) return mailer;

  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null;

  mailer = {
    user: GMAIL_USER,
    // Where reservation notices go; defaults to the sending account
    owner: process.env.OWNER_EMAIL || GMAIL_USER,
    transporter: nodemailer.createTransport({
      // Port 587 with STARTTLS: some antivirus mail scanners break certificate checks on port 465
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      // Google shows app passwords in groups of four; the spaces are not part of the password
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD.replace(/\s+/g, '') },
    }),
  };
  return mailer;
}

export const emailConfigured = () => getMailer() !== null;

// At most five reservations per address every ten minutes.
// On Vercel this memory is per function instance, so there it is only a rough guard.
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

// Handles one submitted booking form. Returns the HTTP status and JSON body to reply with.
export async function handleReservation(body, clientKey) {
  const mail = getMailer();
  if (!mail) {
    console.error('Reservation received but GMAIL_USER / GMAIL_APP_PASSWORD are not set');
    return { status: 503, body: { error: 'Reservations by email are not set up yet. Please try again later.' } };
  }
  if (rateLimited(clientKey)) {
    return { status: 429, body: { error: 'Too many reservations from this connection. Please try again in a few minutes.' } };
  }

  const { booking, error } = parseBooking(body);
  if (error) return { status: 400, body: { error } };

  booking.reference = 'MM-' + Date.now().toString(36).toUpperCase().slice(-6);
  booking.receivedAt = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

  const from = { name: 'Moss & Mellow', address: mail.user };
  try {
    // The café's copy first: if that fails, the guest is not told the table is held
    await mail.transporter.sendMail({ from, to: mail.owner, replyTo: booking.email, ...ownerEmail(booking) });
    await mail.transporter.sendMail({ from, to: booking.email, replyTo: mail.owner, ...guestEmail(booking) });
  } catch (sendError) {
    console.error('Could not send reservation email:', sendError.message);
    return { status: 502, body: { error: 'We could not send your confirmation just now. Please try again in a moment.' } };
  }

  return { status: 200, body: { ok: true, reference: booking.reference } };
}
