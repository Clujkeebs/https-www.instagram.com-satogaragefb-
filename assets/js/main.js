/* Sato Garage — page behaviour.
   Renders the catalog from products.js and wires the small bits of UI. */

(function () {
  var cfg = window.SATO_CONFIG;
  var products = window.SATO_PRODUCTS || [];
  var checkout = window.SatoCheckout;

  /* ------------------------------ helpers ------------------------------ */

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function money(price) {
    if (price === null || price === undefined) return "Quote";
    return "$" + price;
  }

  function badgeFor(product) {
    if (product.status === "sold-out") return { cls: "badge--sold", text: "Sold out" };
    if (product.status === "coming-soon") return { cls: "badge--soon", text: "Coming soon" };
    if (product.category === "custom") return { cls: "badge--custom", text: "Made to order" };
    return null;
  }

  /* --------------------------- product cards --------------------------- */

  function cardFor(product) {
    var badge = badgeFor(product);
    var orderable = product.status === "in-stock";
    var order = orderable ? checkout.resolveOrder(product) : null;
    var label = checkout.orderLabel(product);

    var button = orderable
      ? '<a class="btn" href="' + escapeHtml(order.href) + '" target="_blank" rel="noopener">' +
        escapeHtml(label) + "</a>"
      : '<span class="btn" aria-disabled="true">' + escapeHtml(label) + "</span>";

    var specs = (product.specs || [])
      .map(function (spec) { return "<li>" + escapeHtml(spec) + "</li>"; })
      .join("");

    return el(
      '<article class="card" data-category="' + escapeHtml(product.category) + '">' +
        '<div class="card__media">' +
          (badge ? '<span class="badge ' + badge.cls + '">' + badge.text + "</span>" : "") +
          '<img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) +
            '" loading="lazy" width="800" height="800">' +
        "</div>" +
        '<div class="card__body">' +
          '<div class="card__top">' +
            '<h3 class="card__name">' + escapeHtml(product.name) + "</h3>" +
            '<span class="card__price">' + escapeHtml(money(product.price)) + "</span>" +
          "</div>" +
          '<ul class="specs">' + specs + "</ul>" +
          '<p class="card__desc">' + escapeHtml(product.description) + "</p>" +
          button +
        "</div>" +
      "</article>"
    );
  }

  function renderGrid(node, list) {
    node.innerHTML = "";
    if (!list.length) {
      node.appendChild(el('<p class="empty">Nothing here yet — check the Instagram for drops.</p>'));
      return;
    }
    list.forEach(function (product) { node.appendChild(cardFor(product)); });
  }

  /* ------------------------------- grids ------------------------------- */

  var featured = document.querySelector("[data-featured-grid]");
  if (featured) {
    renderGrid(featured, products.filter(function (p) { return p.featured; }));
  }

  var shop = document.querySelector("[data-shop-grid]");
  if (shop) {
    var filters = document.querySelector("[data-filters]");
    var active = "all";

    var apply = function () {
      renderGrid(shop, products.filter(function (p) {
        return active === "all" || p.category === active;
      }));
    };

    if (filters) {
      filters.addEventListener("click", function (event) {
        var chip = event.target.closest(".chip");
        if (!chip) return;
        active = chip.dataset.filter;
        filters.querySelectorAll(".chip").forEach(function (c) {
          c.setAttribute("aria-pressed", String(c === chip));
        });
        apply();
      });
    }

    apply();
  }

  /* --------------------------- custom order --------------------------- */

  var customMount = document.querySelector("[data-custom-order]");
  if (customMount) {
    var formId = checkout.customOrderFormId();
    if (formId) {
      customMount.appendChild(
        el('<iframe class="jotform-frame" title="Custom order form" ' +
           'src="https://form.jotform.com/' + encodeURIComponent(formId) + '" ' +
           'allow="geolocation; microphone; camera"></iframe>')
      );
    } else {
      customMount.appendChild(
        el('<div class="order-panel">' +
             "<p>The custom order form isn't hooked up yet — send the details straight to the DMs and " +
             "you'll get a quote back.</p>" +
             '<a class="btn" href="' + escapeHtml(cfg.social.instagram) + '" target="_blank" rel="noopener">' +
               "Message " + escapeHtml(cfg.social.instagramHandle) +
             "</a>" +
           "</div>")
      );
    }
  }

  /* ----------------------- small bits of chrome ----------------------- */

  // Any element that should point at the Instagram profile.
  document.querySelectorAll("[data-instagram]").forEach(function (node) {
    node.setAttribute("href", cfg.social.instagram);
  });

  document.querySelectorAll("[data-handle]").forEach(function (node) {
    node.textContent = cfg.social.instagramHandle;
  });

  // Swap in the real logo when one is dropped into assets/img/.
  document.querySelectorAll("[data-logo]").forEach(function (img) {
    var configured = cfg.brand.logo;
    if (!configured || configured === img.getAttribute("src")) return;
    var probe = new Image();
    probe.onload = function () { img.src = configured; };
    probe.src = configured;
  });

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  var shippingNote = document.querySelector("[data-shipping-note]");
  if (shippingNote) shippingNote.textContent = cfg.shipping.note;
})();
