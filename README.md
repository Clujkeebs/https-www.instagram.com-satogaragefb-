# Sato Garage

Storefront for handmade fingerboard decks. Plain HTML, CSS and JavaScript — no build
step, no dependencies. Open `index.html` in a browser and it runs.

```
index.html          Home
shop.html           Full catalog with category filters
custom.html         Custom order page
404.html
assets/
  css/styles.css    All styling
  js/config.js      Brand details, Instagram link, JotForm IDs  ← edit this
  js/products.js    The catalog                                 ← edit this
  js/checkout.js    Builds prefilled JotForm order links
  js/main.js        Renders the pages
  img/products/     Product images
```

## 1. Add the real logo

The site currently uses `assets/img/logo-placeholder.svg` — a stand-in, **not** the
Sato Garage logo.

To swap in the real one: upload the logo as **`assets/img/logo.png`**. That's it —
`config.js` already points at that path, and every logo on the site switches over as
soon as the file exists. Square, transparent background, 1000×1000 or larger.

Uploading through GitHub: open the repo → `assets/img/` → **Add file → Upload files**
→ drop the logo in → commit.

## 2. Set up ordering

Orders go through JotForm. Until the form IDs are filled in, every order button falls
back to the Instagram DMs, so the site is usable either way.

Create two forms in JotForm:

- **In-stock orders** — product, SKU, quantity, name, email, shipping address
- **Custom orders** — shape, width, concave, kicks, graphic, budget, contact

Then put their IDs in `assets/js/config.js`:

```js
jotform: {
  stockFormId: "240123456789012",   // the digits in form.jotform.com/240123456789012
  customFormId: "240987654321098",
  ...
}
```

The custom form gets embedded directly on `custom.html`. The in-stock form opens with
the product, SKU and price already filled in — for that to work, the `fields` names in
`config.js` have to match the field names on the form (in JotForm: click a field →
**Advanced → Field Name**).

## 3. Add products

Everything in the shop comes from `assets/js/products.js`. Copy an existing entry:

```js
{
  sku: "SG-004",
  name: "Deck name",
  category: "decks",          // decks | completes | parts | custom
  price: 50,                  // null shows "Quote" instead of a price
  status: "in-stock",         // in-stock | sold-out | coming-soon
  featured: true,             // show it on the home page
  image: "assets/img/products/deck-name.jpg",
  specs: ["32mm", "5-ply maple", "Medium concave"],
  description: "One or two lines about the deck.",
}
```

Product photos go in `assets/img/products/`. Square images look best — the cards crop
to a square. **The current products and their artwork are placeholders** to show the
layout; replace them with the real decks and photos.

## 4. Other settings

`assets/js/config.js` also holds the contact email, shipping note and Instagram
handle. Leaving `email` empty hides the email link.

## Running it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

It's a static site, so anything works — Vercel, Netlify, GitHub Pages. No build
command, no output directory.
