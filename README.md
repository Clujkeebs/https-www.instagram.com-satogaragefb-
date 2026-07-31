# Sato Garage — website

A small full-stack site for [@satogaragefb](https://www.instagram.com/satogaragefb/)
— handmade fingerboard decks by Valor Hirsch. Home page, about page, and a
custom deck order form that saves real submissions to a database.

- **Frontend** — plain HTML, CSS and ES modules. No build step, no framework.
- **Backend** — Node + Express, with SQLite (via Node's built-in `node:sqlite`)
  for storing orders.
- **Dependencies** — one (`express`). Everything else is standard library.

---

## Running it

```bash
npm install
npm start          # http://localhost:3000
npm run dev        # same, with auto-restart on file changes
```

Requires Node 22.5 or newer (that's when `node:sqlite` landed).

---

## What's real and what needs checking

The shop name, owner, email, Instagram handle and the "handmade in the USA"
line all come from the Instagram bio. Everything else is a reasonable default
that Valor should look over:

- **Deck options** — the widths (32–35 mm), ply counts, concave and finish
  choices in `site.config.js` are sensible fingerboard defaults, not his actual
  range. Adjust them to whatever he really presses.
- **Prices** — the budget brackets are guesses. Change them to match real
  pricing.
- **The About story** — written from the bio alone. The section is marked
  `<!-- EDIT -->` and should be replaced with the real history.
- **Photos** — all three image slots are still placeholders.

---

## Editing the content

### 1. `site.config.js` — everything factual

Shop name, owner, contact details, and every dropdown on the order form
(widths, woods, molds, finishes, budgets, timeframes), plus the home page cards
and process steps. Change a value, restart, done — it flows through every page,
and the server validates incoming orders against the same lists, so adding an
option here is all it takes to start accepting it.

Leaving `phone` (or `email`) as an empty string hides it everywhere
automatically, so there are no dead links while a detail is still unknown.

### 2. The HTML in `public/` — the prose

Longer copy — the hero headline, the About story — lives in the page files and
is marked with `<!-- EDIT -->` comments:

| File | Page |
| --- | --- |
| `public/index.html` | Home |
| `public/about.html` | About |
| `public/order.html` | Order Custom |
| `public/404.html` | Not-found page |

### 3. The profile photo

**Save the Instagram profile picture as `public/assets/img/profile.jpg`.**
That is the whole job — it then appears in the header, the hero chip, the
Instagram band and the About page automatically. No restart and no code change:
the server checks for the file per request. `.jpeg`, `.png` and `.webp` work
too.

Until that file exists, every one of those spots shows an "SG" monogram
instead, so nothing looks broken in the meantime.

> I could not download the photo myself — Instagram blocks logged-out requests
> to the profile, so it has to be saved by hand from a signed-in browser.

### 4. Deck photos

There are three placeholder blocks (`<div class="split__media">…</div>`) marked
in the HTML, plus six tiles in the Instagram grid on the home page. Drop real
deck photos into `public/assets/img/` and swap each block for:

```html
<div class="split__media">
  <img src="/assets/img/deck-01.jpg" alt="Describe the photo here" />
</div>
```

The styling already handles the cropping.

### 5. Colours

The whole palette is six variables at the top of
`public/assets/css/styles.css` (`--bg`, `--accent`, and friends). Changing
`--accent` re-themes the entire site, hazard stripes included.

---

## Reading the orders that come in

Submissions are written to `data/orders.db` (SQLite, gitignored). To read them
over HTTP, set an admin token:

```bash
cp .env.example .env      # then fill in ADMIN_TOKEN
ADMIN_TOKEN=your-secret npm start

curl -H "Authorization: Bearer your-secret" http://localhost:3000/api/orders
```

Without `ADMIN_TOKEN` set, that endpoint stays switched off (503) rather than
being publicly readable. You can also open the file directly with any SQLite
browser.

**No email is sent when an order arrives** — orders land in the database and the
server logs a line. Wiring up an email notification needs an SMTP or Postmark/
Resend account, which is a decision for whoever owns the domain.

---

## API

| Method | Route | Notes |
| --- | --- | --- |
| `GET` | `/api/config` | Public site config used by the frontend |
| `POST` | `/api/orders` | Submit an order; returns a reference like `SG-7F3K92` |
| `GET` | `/api/orders` | Admin only, requires `Authorization: Bearer $ADMIN_TOKEN` |
| `GET` | `/api/health` | Uptime check |

The order form is protected by input validation (client and server), a hidden
honeypot field, and a rate limit of 5 submissions per IP per hour.

---

## Deploying

Any host that runs Node works — Render, Fly, Railway, a VPS. Two things matter:

1. **Persist the `data/` directory** (or point `DATA_DIR` at a mounted volume),
   otherwise submitted orders vanish on each redeploy.
2. Set `ADMIN_TOKEN`, and `NODE_ENV=production` to enable asset caching.

See `.env.example` for the full list of environment variables.
