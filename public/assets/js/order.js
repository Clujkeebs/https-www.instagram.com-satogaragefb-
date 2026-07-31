/**
 * Order form: populates the dropdowns from /api/config, validates on the
 * client for fast feedback, posts to /api/orders and swaps in a success panel
 * carrying the reference number the server generated.
 */

import { getConfig } from './main.js';

const form = document.getElementById('order-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('order-submit');
const successPanel = document.getElementById('order-success');
const referenceEl = document.getElementById('order-reference');
const formSection = document.getElementById('order-form-section');

function fillSelect(select, options, placeholder) {
  if (!select || !Array.isArray(options)) return;

  const frag = document.createDocumentFragment();

  const first = document.createElement('option');
  first.value = '';
  first.textContent = placeholder;
  if (select.required) first.disabled = true;
  first.selected = true;
  frag.append(first);

  options.forEach((opt) => {
    const el = document.createElement('option');
    el.value = opt.value;
    el.textContent = opt.label;
    frag.append(el);
  });

  select.replaceChildren(frag);
}

function setFieldError(name, message) {
  const field = form.querySelector(`[data-field="${name}"]`);
  if (!field) return;

  const errorEl = field.querySelector('.error');
  const input = field.querySelector('input, select, textarea');

  if (message) {
    field.dataset.invalid = 'true';
    if (errorEl) errorEl.textContent = message;
    if (input) input.setAttribute('aria-invalid', 'true');
  } else {
    delete field.dataset.invalid;
    if (errorEl) errorEl.textContent = '';
    if (input) input.removeAttribute('aria-invalid');
  }
}

function clearErrors() {
  form.querySelectorAll('[data-field]').forEach((field) => {
    setFieldError(field.dataset.field, '');
  });
}

function setStatus(state, message) {
  if (!statusEl) return;
  if (!state) {
    statusEl.removeAttribute('data-state');
    statusEl.textContent = '';
    return;
  }
  statusEl.dataset.state = state;
  statusEl.textContent = message;
}

/** Mirrors the server rules so obvious mistakes never need a round trip. */
function validateLocally(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please tell us your name.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email || '')) {
    errors.email = 'That email address does not look right.';
  }
  if (!data.vehicle || data.vehicle.trim().length < 2) {
    errors.vehicle = 'Let us know what we are working on.';
  }
  if (!data.service) {
    errors.service = 'Pick the type of work you need.';
  }
  if (!data.description || data.description.trim().length < 15) {
    errors.description = 'A couple of sentences about the project, please.';
  }

  return errors;
}

async function handleSubmit(event) {
  event.preventDefault();
  clearErrors();
  setStatus(null);

  const data = Object.fromEntries(new FormData(form).entries());

  const localErrors = validateLocally(data);
  if (Object.keys(localErrors).length > 0) {
    Object.entries(localErrors).forEach(([field, msg]) => setFieldError(field, msg));
    setStatus('error', 'Please fix the highlighted fields.');
    form.querySelector('[data-invalid="true"] input, [data-invalid="true"] select, [data-invalid="true"] textarea')
      ?.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  setStatus('pending', 'Sending your request…');

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const payload = await res.json().catch(() => ({}));

    if (res.ok && payload.ok) {
      if (referenceEl) referenceEl.textContent = payload.reference;
      formSection?.classList.add('hidden');
      successPanel?.classList.remove('hidden');
      successPanel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      successPanel?.focus();
      return;
    }

    if (payload.errors) {
      Object.entries(payload.errors).forEach(([field, msg]) => setFieldError(field, msg));
    }
    setStatus(
      'error',
      payload.error || 'That did not go through. Please try again in a moment.',
    );
  } catch (err) {
    console.error('[order] submit failed:', err);
    setStatus(
      'error',
      'Could not reach the shop right now. Check your connection, or email us directly.',
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send request';
  }
}

async function init() {
  if (!form) return;

  const config = await getConfig();
  if (config) {
    fillSelect(form.elements.service, config.services, 'Choose the type of work…');
    fillSelect(form.elements.budget, config.budgets, 'Rough budget (optional)');
    fillSelect(form.elements.timeline, config.timelines, 'When do you need it? (optional)');
  }

  form.addEventListener('submit', handleSubmit);

  // Clear a field's error as soon as the visitor starts fixing it, and drop
  // the form-level banner once nothing is left flagged.
  const clearOnEdit = (event) => {
    const field = event.target.closest('[data-field]');
    if (field?.dataset.invalid !== 'true') return;

    setFieldError(field.dataset.field, '');
    if (form.querySelectorAll('[data-invalid="true"]').length === 0) {
      setStatus(null);
    }
  };

  form.addEventListener('input', clearOnEdit);
  // <select> fires "change", not "input", in some browsers.
  form.addEventListener('change', clearOnEdit);
}

init();
