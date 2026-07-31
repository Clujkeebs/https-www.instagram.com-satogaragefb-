/**
 * Shared behaviour for every page:
 *  - loads /api/config and fills any [data-site="key"] element
 *  - builds contact links, service cards and process steps from that config
 *  - mobile nav toggle, current-year stamp
 *
 * Everything degrades gracefully: the HTML ships with sensible static text, so
 * if the API is unreachable the page still reads correctly.
 */

let configPromise = null;

export function getConfig() {
  if (!configPromise) {
    configPromise = fetch('/api/config')
      .then((res) => {
        if (!res.ok) throw new Error(`config request failed: ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        console.warn('[site] falling back to static content:', err.message);
        return null;
      });
  }
  return configPromise;
}

function fillTextSlots(config) {
  document.querySelectorAll('[data-site]').forEach((el) => {
    const value = config[el.dataset.site];
    if (typeof value === 'string' && value.trim() !== '') {
      el.textContent = value;
    }
  });
}

function fillLinkSlots(config) {
  document.querySelectorAll('[data-site-link]').forEach((el) => {
    const kind = el.dataset.siteLink;

    if (kind === 'email' && config.email) {
      el.href = `mailto:${config.email}`;
      if (el.dataset.siteLinkText !== 'keep') el.textContent = config.email;
    }

    if (kind === 'phone' && config.phone) {
      el.href = `tel:${config.phone.replace(/[^\d+]/g, '')}`;
      if (el.dataset.siteLinkText !== 'keep') el.textContent = config.phone;
    }

    if (kind === 'instagram' && config.instagramUrl) {
      el.href = config.instagramUrl;
      if (el.dataset.siteLinkText !== 'keep') {
        el.textContent = `@${config.instagramHandle}`;
      }
    }
  });

  // Handle shown inline inside a sentence, where the link text must stay put.
  if (config.instagramHandle) {
    document.querySelectorAll('[data-ig-handle]').forEach((el) => {
      el.textContent = `@${config.instagramHandle}`;
    });
  }

  // Hide any contact row whose value was intentionally left blank in the config.
  document.querySelectorAll('[data-requires]').forEach((el) => {
    const key = el.dataset.requires;
    const value = config[key];
    if (typeof value !== 'string' || value.trim() === '') {
      el.classList.add('hidden');
    }
  });
}

function renderServiceCards(config) {
  const host = document.querySelector('[data-render="service-cards"]');
  if (!host || !Array.isArray(config.serviceCards)) return;

  host.replaceChildren(
    ...config.serviceCards.map((item) => {
      const card = document.createElement('article');
      card.className = 'card';

      const title = document.createElement('h3');
      title.textContent = item.title;

      const body = document.createElement('p');
      body.textContent = item.body;

      card.append(title, body);
      return card;
    }),
  );
}

function renderProcessSteps(config) {
  const host = document.querySelector('[data-render="process-steps"]');
  if (!host || !Array.isArray(config.processSteps)) return;

  host.replaceChildren(
    ...config.processSteps.map((item, i) => {
      const card = document.createElement('article');
      card.className = 'card';

      const num = document.createElement('div');
      num.className = 'card__num';
      num.textContent = String(i + 1).padStart(2, '0');

      const title = document.createElement('h3');
      title.textContent = item.title;

      const body = document.createElement('p');
      body.textContent = item.body;

      card.append(num, title, body);
      return card;
    }),
  );
}

/**
 * Swap the "SG" monogram for the owner's profile photo, but only when the
 * server says the file is actually there — that keeps a missing photo from
 * logging a 404 on every page load. No photo = monogram stays, nothing breaks.
 */
function setupAvatar(config) {
  const slots = document.querySelectorAll('.avatar__img');
  if (slots.length === 0 || !config?.profilePhoto) return;

  // alt stays empty on purpose: every avatar sits next to text that already
  // names the shop, so announcing it again is just noise for screen readers.
  slots.forEach((img) => {
    img.src = config.profilePhoto;
  });
  document.documentElement.classList.add('has-avatar');
}

/**
 * Reveal-on-scroll. The stylesheet hides .reveal elements up front to avoid a
 * flash, so this must always finish the job — hence the unsupported-browser
 * path and the safety timeout.
 */
function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (items.length === 0) return;

  const showAll = () => items.forEach((el) => el.classList.add('is-visible'));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );

  items.forEach((el) => observer.observe(el));
  // head.js holds an independent backstop timer in case this file never runs.
}

function setupNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.dataset.open === 'true';
    nav.dataset.open = String(!open);
    toggle.setAttribute('aria-expanded', String(!open));
  });

  // Reset the menu when growing past the mobile breakpoint.
  window.matchMedia('(min-width: 721px)').addEventListener('change', (e) => {
    if (e.matches) {
      nav.dataset.open = 'false';
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function markCurrentPage() {
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.nav a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    const normalized = href === '/' ? '/' : href.replace(/\.html$/, '');
    const current = path === '/' ? '/' : path.replace(/\.html$/, '');
    if (normalized === current) link.setAttribute('aria-current', 'page');
  });
}

function stampYear() {
  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

export function applyConfig(config) {
  if (!config) return;
  setupAvatar(config);
  fillTextSlots(config);
  fillLinkSlots(config);
  renderServiceCards(config);
  renderProcessSteps(config);

  if (config.name) {
    document.title = document.title.replace('Sato Garage', config.name);
  }
}

// Wrapped so a failure in one enhancement cannot leave .reveal content hidden.
try {
  setupNav();
  markCurrentPage();
  stampYear();
} catch (err) {
  console.error('[site] setup failed:', err);
}

setupReveal();
getConfig().then(applyConfig);
