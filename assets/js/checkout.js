/* Sato Garage — ordering layer.
   One place decides what an "Order" button does: a prefilled JotForm when the
   form IDs are set, the Instagram DMs until then. */

(function () {
  var cfg = window.SATO_CONFIG;

  function jotformUrl(formId, params) {
    var url = "https://form.jotform.com/" + encodeURIComponent(formId);
    var query = Object.keys(params)
      .filter(function (key) {
        var value = params[key];
        return value !== null && value !== undefined && value !== "";
      })
      .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      })
      .join("&");
    return query ? url + "?" + query : url;
  }

  function instagramUrl() {
    return cfg.social.instagram;
  }

  /* Where this product's order button points. */
  function resolveOrder(product) {
    var isCustom = product.category === "custom";
    var formId = isCustom
      ? cfg.jotform.customFormId
      : cfg.jotform.stockFormId || cfg.jotform.customFormId;

    if (!formId) {
      // No form set up yet — send them to the DMs.
      return { href: instagramUrl(), fallback: true };
    }

    var names = cfg.jotform.fields;
    var params = {};
    params[names.product] = product.name;
    params[names.sku] = product.sku;
    if (product.price !== null && product.price !== undefined) {
      params[names.price] = product.price;
    }

    return { href: jotformUrl(formId, params), fallback: false };
  }

  function orderLabel(product) {
    if (product.status === "sold-out") return "Sold out";
    if (product.status === "coming-soon") return "Coming soon";
    if (product.category === "custom") return "Request a quote";
    return resolveOrder(product).fallback ? "Order via DM" : "Order";
  }

  function customOrderUrl() {
    var formId = cfg.jotform.customFormId;
    return formId ? jotformUrl(formId, {}) : instagramUrl();
  }

  function customOrderFormId() {
    return cfg.jotform.customFormId || "";
  }

  window.SatoCheckout = {
    resolveOrder: resolveOrder,
    orderLabel: orderLabel,
    customOrderUrl: customOrderUrl,
    customOrderFormId: customOrderFormId,
  };
})();
