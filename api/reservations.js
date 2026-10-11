// Vercel function for POST /api/reservations. Vercel hosts only the built site,
// so the Express server in server/index.js never runs there; this takes its place.
import { handleReservation } from '../server/reservations.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const forwarded = request.headers['x-forwarded-for'];
  const clientKey = (Array.isArray(forwarded) ? forwarded[0] : forwarded || '').split(',')[0].trim() || 'unknown';

  const result = await handleReservation(request.body, clientKey);
  return response.status(result.status).json(result.body);
}
