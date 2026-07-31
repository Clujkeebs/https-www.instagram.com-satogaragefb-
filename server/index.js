import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from '../site.config.js';
import { validateOrder } from './validate.js';
import { createOrder, listOrders, countOrders } from './db.js';
import { rateLimit } from './rateLimit.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(rootDir, 'public');

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

const app = express();

// Behind a reverse proxy (Fly, Render, nginx) this makes req.ip the real
// client address so rate limiting works per visitor rather than per proxy.
app.set('trust proxy', Number(process.env.TRUST_PROXY ?? 1));
app.disable('x-powered-by');

app.use(express.json({ limit: '32kb' }));

// Baseline security headers. The site loads no third-party assets, so the
// policy can stay strict.
app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': [
      "default-src 'self'",
      "img-src 'self' data:",
      "style-src 'self'",
      "script-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  });
  next();
});

// --- API -------------------------------------------------------------------

/** Public site configuration, consumed by the frontend on every page. */
app.get('/api/config', (req, res) => {
  res.json({
    name: site.name,
    tagline: site.tagline,
    shortDescription: site.shortDescription,
    foundedYear: site.foundedYear,
    email: site.email,
    phone: site.phone,
    location: site.location,
    hours: site.hours,
    instagramHandle: site.instagramHandle,
    instagramUrl: site.instagramUrl,
    services: site.services,
    budgets: site.budgets,
    timelines: site.timelines,
    serviceCards: site.serviceCards,
    processSteps: site.processSteps,
  });
});

app.post(
  '/api/orders',
  rateLimit({ windowMs: 60 * 60 * 1000, max: 5 }),
  (req, res) => {
    // Honeypot: a real browser leaves this hidden field empty. Bots fill it,
    // and get a convincing success response so they stop retrying.
    if (typeof req.body?.website === 'string' && req.body.website.trim() !== '') {
      return res.status(201).json({ ok: true, reference: 'SG-000000' });
    }

    const result = validateOrder(req.body);
    if (!result.ok) {
      return res
        .status(400)
        .json({ ok: false, error: 'Some fields need fixing.', errors: result.errors });
    }

    try {
      const reference = createOrder(result.value);
      console.log(
        `[order] ${reference} — ${result.value.service} — ${result.value.email}`,
      );
      return res.status(201).json({ ok: true, reference });
    } catch (err) {
      console.error('[order] failed to save:', err);
      return res.status(500).json({
        ok: false,
        error: 'Something went wrong saving that. Please try again or email us.',
      });
    }
  },
);

/** Admin: read submitted orders. Requires ADMIN_TOKEN to be set. */
app.get('/api/orders', (req, res) => {
  if (!ADMIN_TOKEN) {
    return res
      .status(503)
      .json({ error: 'Admin access is not configured. Set ADMIN_TOKEN.' });
  }

  const header = req.get('authorization') || '';
  const provided = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (provided !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  return res.json({ total: countOrders(), orders: listOrders(req.query.limit) });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// --- Static site -----------------------------------------------------------

app.use(
  express.static(publicDir, {
    extensions: ['html'], // /about serves about.html
    maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0,
  }),
);

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found.' });
  }
  return res.status(404).sendFile(join(publicDir, '404.html'));
});

app.listen(PORT, () => {
  console.log(`${site.name} running at http://localhost:${PORT}`);
});

export default app;
