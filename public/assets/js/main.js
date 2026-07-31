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
  fillTextSlots(config);
  fillLinkSlots(config);
  renderServiceCards(config);
  renderProcessSteps(config);

  if (config.name) {
    document.title = document.title.replace('Sato Garage', config.name);
  }
}

setupNav();
markCurrentPage();
stampYear();
getConfig().then(applyConfig);
