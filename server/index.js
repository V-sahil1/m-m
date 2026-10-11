// Local reservation server: receives the booking form and sends the emails (see reservations.js).
// It also serves the built site after `npm run build`. On Vercel the functions in api/ do this job instead.
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { emailConfigured, handleReservation } from './reservations.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Read react-app/.env when it exists (real environment variables take precedence)
try {
  process.loadEnvFile(path.join(root, '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (request, response) => {
  response.json({ ok: true, emailConfigured: emailConfigured() });
});

app.post('/api/reservations', async (request, response) => {
  const result = await handleReservation(request.body, request.ip);
  response.status(result.status).json(result.body);
});

// Serve the built site when it exists (npm run build, then npm start)
const dist = path.join(root, 'dist');
if (fs.existsSync(path.join(dist, 'index.html'))) {
  app.use(express.static(dist));
  app.get(/^(?!\/api\/).*/, (request, response) => response.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Reservation server on http://localhost:${PORT}`);
  if (!emailConfigured()) console.warn('Email is NOT configured: add GMAIL_USER and GMAIL_APP_PASSWORD to .env');
});
