import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = process.env.DATA_DIR || join(rootDir, 'data');

mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(join(dataDir, 'orders.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    reference     TEXT    NOT NULL UNIQUE,
    name          TEXT    NOT NULL,
    email         TEXT    NOT NULL,
    phone         TEXT    NOT NULL DEFAULT '',
    vehicle       TEXT    NOT NULL,
    service       TEXT    NOT NULL,
    budget        TEXT    NOT NULL DEFAULT '',
    timeline      TEXT    NOT NULL DEFAULT '',
    description   TEXT    NOT NULL,
    referral      TEXT    NOT NULL DEFAULT '',
    status        TEXT    NOT NULL DEFAULT 'new',
    created_at    TEXT    NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
`);

const insertStmt = db.prepare(`
  INSERT INTO orders
    (reference, name, email, phone, vehicle, service, budget, timeline, description, referral, created_at)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const listStmt = db.prepare(`
  SELECT * FROM orders ORDER BY created_at DESC LIMIT ?
`);

const countStmt = db.prepare('SELECT COUNT(*) AS total FROM orders');

/**
 * Human-friendly reference like SG-7F3K92 that a customer can quote in a
 * follow-up email.
 */
function makeReference() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I/L/O/0/1
  let out = '';
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `SG-${out}`;
}

export function createOrder(order) {
  // Retry on the astronomically unlikely reference collision.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const reference = makeReference();
    try {
      insertStmt.run(
        reference,
        order.name,
        order.email,
        order.phone,
        order.vehicle,
        order.service,
        order.budget,
        order.timeline,
        order.description,
        order.referral,
        new Date().toISOString(),
      );
      return reference;
    } catch (err) {
      if (!String(err.message).includes('UNIQUE')) throw err;
    }
  }
  throw new Error('Could not generate a unique order reference');
}

export function listOrders(limit = 100) {
  return listStmt.all(Math.min(Math.max(Number(limit) || 100, 1), 500));
}

export function countOrders() {
  return countStmt.get().total;
}

export default db;
