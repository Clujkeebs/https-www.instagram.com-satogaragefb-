/* Sato Garage — product catalog.
   Add, edit or remove decks here. Images go in assets/img/products/.

   status: "in-stock" | "sold-out" | "coming-soon"
   featured: true puts it on the home page */

window.SATO_PRODUCTS = [
  {
    sku: "SG-001",
    name: "Street Mutt",
    category: "decks",
    price: 45,
    status: "in-stock",
    featured: true,
    image: "assets/img/products/street-mutt.svg",
    specs: ["32mm", "5-ply maple", "Medium concave"],
    description:
      "The house shape. Mellow kick, medium concave, hand-sanded rails — the one to learn on and keep riding.",
  },
  {
    sku: "SG-002",
    name: "Gold Chain",
    category: "decks",
    price: 55,
    status: "in-stock",
    featured: true,
    image: "assets/img/products/gold-chain.svg",
    specs: ["33mm", "5-ply maple", "Deep concave"],
    description:
      "Wider platform, deeper concave and a gold foil graphic pulled straight off the logo. Limited pressing.",
  },
  {
    sku: "SG-003",
    name: "Garage Series",
    category: "decks",
    price: 40,
    status: "sold-out",
    featured: true,
    image: "assets/img/products/garage-series.svg",
    specs: ["30mm", "5-ply maple", "Mellow concave"],
    description:
      "Narrow cruiser shape for tight lines and ledge work. Sold out — restock announced on Instagram.",
  },
  {
    sku: "SG-101",
    name: "Complete Setup",
    category: "completes",
    price: 95,
    status: "in-stock",
    featured: true,
    image: "assets/img/products/complete-setup.svg",
    specs: ["Deck + trucks", "Bearing wheels", "Foam or real tape"],
    description:
      "Ready to ride out of the box. Pick your deck, we build it with trucks, wheels and tape.",
  },
  {
    sku: "SG-201",
    name: "Grip Tape Pack",
    category: "parts",
    price: 12,
    status: "in-stock",
    featured: false,
    image: "assets/img/products/grip-tape.svg",
    specs: ["3 sheets", "Pre-cut", "Foam + real"],
    description: "Three pre-cut sheets. Mix of foam and real tape.",
  },
  {
    sku: "SG-202",
    name: "Bearing Wheels",
    category: "parts",
    price: 22,
    status: "in-stock",
    featured: false,
    image: "assets/img/products/bearing-wheels.svg",
    specs: ["Set of 4", "CNC", "Bearing core"],
    description: "Set of four CNC bearing wheels. Rolls quiet, holds speed.",
  },
  {
    sku: "SG-301",
    name: "Custom Deck",
    category: "custom",
    price: null,
    status: "in-stock",
    featured: false,
    image: "assets/img/products/custom-deck.svg",
    specs: ["Your shape", "Your graphic", "Built to order"],
    description:
      "Your shape, your concave, your graphic. Tell us what you want and we'll quote it.",
  },
];
