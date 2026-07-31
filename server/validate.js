import { site } from '../site.config.js';

const LIMITS = {
  name: 80,
  email: 160,
  phone: 40,
  vehicle: 120,
  description: 4000,
  referral: 120,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Control characters, excluding \n and \r which are legal in the textarea.
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const serviceValues = new Set(site.services.map((s) => s.value));
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
    phone: clean(raw.phone),
    vehicle: clean(raw.vehicle),
    service: clean(raw.service),
    budget: clean(raw.budget),
    timeline: clean(raw.timeline),
    description: clean(raw.description),
    referral: clean(raw.referral),
  };

  if (value.name.length < 2) {
    errors.name = 'Please tell us your name.';
  } else if (value.name.length > LIMITS.name) {
    errors.name = `Keep this under ${LIMITS.name} characters.`;
  }

  if (!EMAIL_RE.test(value.email)) {
    errors.email = 'That email address does not look right.';
  } else if (value.email.length > LIMITS.email) {
    errors.email = `Keep this under ${LIMITS.email} characters.`;
  }

  if (value.phone.length > LIMITS.phone) {
    errors.phone = `Keep this under ${LIMITS.phone} characters.`;
  }

  if (value.vehicle.length < 2) {
    errors.vehicle = 'Let us know what we are working on.';
  } else if (value.vehicle.length > LIMITS.vehicle) {
    errors.vehicle = `Keep this under ${LIMITS.vehicle} characters.`;
  }

  if (!serviceValues.has(value.service)) {
    errors.service = 'Pick the type of work you need.';
  }

  if (value.budget && !budgetValues.has(value.budget)) {
    errors.budget = 'Pick one of the listed budget ranges.';
  }

  if (value.timeline && !timelineValues.has(value.timeline)) {
    errors.timeline = 'Pick one of the listed timeframes.';
  }

  if (value.description.length < 15) {
    errors.description = 'A couple of sentences about the project, please.';
  } else if (value.description.length > LIMITS.description) {
    errors.description = `Keep this under ${LIMITS.description} characters.`;
  }

  if (value.referral.length > LIMITS.referral) {
    errors.referral = `Keep this under ${LIMITS.referral} characters.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value };
}

export { LIMITS };
