import { site } from '../site.config.js';

const LIMITS = {
  name: 80,
  email: 160,
  instagram: 60,
  description: 4000,
  referral: 120,
};

const MAX_QUANTITY = 25;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Control characters, excluding \n and \r which are legal in the textarea.
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const widthValues = new Set(site.widths.map((w) => w.value));
const woodValues = new Set(site.woods.map((w) => w.value));
const moldValues = new Set(site.molds.map((m) => m.value));
const finishValues = new Set(site.finishes.map((f) => f.value));
const budgetValues = new Set(site.budgets.map((b) => b.value));
const timelineValues = new Set(site.timelines.map((t) => t.value));

function clean(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(CONTROL_RE, ' ')
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Validates a raw order payload.
 * Returns { ok: true, value } or { ok: false, errors: { field: message } }.
 */
export function validateOrder(body) {
  const errors = {};
  const raw = body && typeof body === 'object' ? body : {};

  const value = {
    name: clean(raw.name),
    email: clean(raw.email).toLowerCase(),
    instagram: clean(raw.instagram).replace(/^@+/, ''),
    width: clean(raw.width),
    wood: clean(raw.wood),
    mold: clean(raw.mold),
    finish: clean(raw.finish),
    quantity: Number.parseInt(clean(raw.quantity) || '1', 10),
    budget: clean(raw.budget),
    timeline: clean(raw.timeline),
    description: clean(raw.description),
    referral: clean(raw.referral),
  };

  if (value.name.length < 2) {
    errors.name = 'Please tell me your name.';
  } else if (value.name.length > LIMITS.name) {
    errors.name = `Keep this under ${LIMITS.name} characters.`;
  }

  if (!EMAIL_RE.test(value.email)) {
    errors.email = 'That email address does not look right.';
  } else if (value.email.length > LIMITS.email) {
    errors.email = `Keep this under ${LIMITS.email} characters.`;
  }

  if (value.instagram.length > LIMITS.instagram) {
    errors.instagram = `Keep this under ${LIMITS.instagram} characters.`;
  }

  if (!widthValues.has(value.width)) {
    errors.width = 'Pick a deck width.';
  }

  if (value.wood && !woodValues.has(value.wood)) {
    errors.wood = 'Pick one of the listed wood options.';
  }

  if (value.mold && !moldValues.has(value.mold)) {
    errors.mold = 'Pick one of the listed molds.';
  }

  if (value.finish && !finishValues.has(value.finish)) {
    errors.finish = 'Pick one of the listed finishes.';
  }

  if (!Number.isInteger(value.quantity) || value.quantity < 1) {
    errors.quantity = 'How many decks? One or more.';
  } else if (value.quantity > MAX_QUANTITY) {
    errors.quantity = `For more than ${MAX_QUANTITY}, email me directly.`;
  }

  if (value.budget && !budgetValues.has(value.budget)) {
    errors.budget = 'Pick one of the listed budget ranges.';
  }

  if (value.timeline && !timelineValues.has(value.timeline)) {
    errors.timeline = 'Pick one of the listed timeframes.';
  }

  if (value.description.length < 15) {
    errors.description = 'A couple of sentences about the deck, please.';
  } else if (value.description.length > LIMITS.description) {
    errors.description = `Keep this under ${LIMITS.description} characters.`;
  }

  if (value.referral.length > LIMITS.referral) {
    errors.referral = `Keep this under ${LIMITS.referral} characters.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value };
}

export { LIMITS, MAX_QUANTITY };
