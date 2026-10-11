// Vercel function for GET /api/health: open it in the browser to check that the
// Gmail variables reached the deployment (emailConfigured should be true).
import { emailConfigured } from '../server/reservations.js';

export default function handler(request, response) {
  response.status(200).json({ ok: true, emailConfigured: emailConfigured() });
}
