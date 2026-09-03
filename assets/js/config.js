/* Sato Garage — site configuration.
   Everything the shop owner needs to change lives in this file. */

window.SATO_CONFIG = {
  brand: {
    name: "Sato Garage",
    shortName: "Sato Garage FB",
    tagline: "Handmade fingerboard decks",
    blurb:
      "Small-batch fingerboard decks pressed, shaped and finished by hand. No mass production — every deck leaves the garage one at a time.",
    email: "", // e.g. "orders@satogarage.com" — leave empty to hide the email link
    logo: "assets/img/logo.png", // drop the real logo here; falls back to the badge mark
  },

  social: {
    instagram: "https://www.instagram.com/satogaragefb/",
    instagramHandle: "@satogaragefb",
  },

  /* Orders run through JotForm. Paste the form IDs below — the digits in
     https://form.jotform.com/240123456789012 — and the buttons go live.
     Until then every order button falls back to the Instagram DMs. */
  jotform: {
    stockFormId: "",
    customFormId: "",

    // JotForm prefills a form from URL params whose names match its field names.
    // Rename these to match the actual fields on the forms.
    fields: {
      product: "product",
      sku: "sku",
      price: "price",
    },
  },

  shipping: {
    note: "Ships from the garage within 3–5 business days.",
    regions: "US shipping. Ask about international before ordering.",
  },
};
