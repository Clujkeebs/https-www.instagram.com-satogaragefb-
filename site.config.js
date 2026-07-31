/**
 * ---------------------------------------------------------------------------
 * All of the shop's details live here.
 * ---------------------------------------------------------------------------
 * Change a value, restart the server, and it updates across every page --
 * nav, footer, contact links and all of the order form's dropdowns. The server
 * also validates incoming orders against these exact lists, so adding an
 * option here is all it takes to start accepting it.
 *
 * Longer prose (hero copy, the About story) lives in the HTML files in
 * public/ and is marked with <!-- EDIT --> comments.
 */

export const site = {
  // --- Identity -----------------------------------------------------------
  name: 'Sato Garage',
  owner: 'Valor Hirsch',
  tagline: 'Fingerboard decks, made by hand.',
  shortDescription:
    'Handmade fingerboard decks — pressed, shaped, sanded and finished one at a time in my garage in the USA.',

  // --- Contact ------------------------------------------------------------
  // Leave a value as an empty string to hide it everywhere on the site.
  email: 'satogaragefingerboards@gmail.com',
  phone: '',
  location: 'Handmade in the USA',
  hours: 'DMs and emails answered most evenings',

  // --- Social -------------------------------------------------------------
  instagramHandle: 'satogaragefb',
  instagramUrl: 'https://www.instagram.com/satogaragefb/',

  // --- Order form dropdowns ----------------------------------------------
  widths: [
    { value: '32mm', label: '32 mm' },
    { value: '33mm', label: '33 mm' },
    { value: '33.5mm', label: '33.5 mm' },
    { value: '34mm', label: '34 mm' },
    { value: '35mm', label: '35 mm' },
    { value: 'unsure', label: 'Not sure — help me pick' },
  ],

  woods: [
    { value: '5-ply-maple', label: '5-ply maple' },
    { value: '6-ply-maple', label: '6-ply maple' },
    { value: '7-ply-maple', label: '7-ply maple' },
    { value: 'exotic-veneer', label: 'Exotic veneer top/bottom' },
    { value: 'unsure', label: 'Not sure — help me pick' },
  ],

  molds: [
    { value: 'mellow', label: 'Mellow concave' },
    { value: 'medium', label: 'Medium concave' },
    { value: 'deep', label: 'Deep concave' },
    { value: 'unsure', label: 'Not sure — help me pick' },
  ],

  finishes: [
    { value: 'natural', label: 'Natural / clear coat' },
    { value: 'stained', label: 'Stained' },
    { value: 'painted', label: 'Painted, solid colour' },
    { value: 'graphic', label: 'Custom graphic' },
    { value: 'unsure', label: 'Not sure yet' },
  ],

  budgets: [
    { value: 'under-30', label: 'Under $30' },
    { value: '30-50', label: '$30 – $50' },
    { value: '50-80', label: '$50 – $80' },
    { value: '80-plus', label: '$80+' },
    { value: 'unsure', label: 'Not sure yet' },
  ],

  timelines: [
    { value: 'no-rush', label: 'No rush' },
    { value: 'few-weeks', label: 'Within a few weeks' },
    { value: 'specific-date', label: 'Needed by a specific date' },
  ],

  // --- "What I make" cards on the home page -------------------------------
  serviceCards: [
    {
      title: 'Custom decks',
      body: 'Your width, your mold, your wood. Pressed to order and shaped by hand — nothing gets cut from a batch of a hundred.',
    },
    {
      title: 'Wood and veneers',
      body: 'Standard maple plies, or an exotic veneer top and bottom if you want the grain to be the graphic.',
    },
    {
      title: 'Graphics and finishes',
      body: 'Natural clear coat, stains, solid colours or a custom graphic. Send a reference and we will work it out.',
    },
    {
      title: 'One-offs',
      body: 'Odd sizes, weird shapes, a deck for a gift. If it can be pressed, it is worth asking about.',
    },
  ],

  // --- "How it works" steps -----------------------------------------------
  processSteps: [
    {
      title: 'Send the specs',
      body: 'Fill out the custom order form — width, mold, wood and what you want it to look like. Not sure? Say so and I will help.',
    },
    {
      title: 'We sort the details',
      body: 'I get back to you with what is doable, the price and roughly how long it will take.',
    },
    {
      title: 'Pressed and shaped',
      body: 'Glued, pressed, cut, sanded and finished by hand. You get photos along the way.',
    },
    {
      title: 'Boxed and shipped',
      body: 'Wrapped up and sent out, with a tracking number once it is on its way.',
    },
  ],
};

export default site;
