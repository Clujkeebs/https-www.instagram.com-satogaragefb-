/**
 * ---------------------------------------------------------------------------
 * EDIT THIS FILE FIRST.
 * ---------------------------------------------------------------------------
 * Everything here is business info I could not look up (the Instagram account
 * is private to logged-out visitors), so it is filled in with sensible
 * placeholders. Change the values, restart the server, and the whole site --
 * page titles, nav, footer, contact links and the order form's dropdowns --
 * updates. No HTML editing required for any of this.
 *
 * Longer prose (the hero copy, the About story) lives in the HTML files in
 * public/ and is marked with <!-- EDIT --> comments.
 */

export const site = {
  // --- Identity -----------------------------------------------------------
  name: 'Sato Garage',
  tagline: 'Custom builds, done right.',
  shortDescription:
    'A one-man custom shop building, modifying and maintaining vehicles that stand out.',
  foundedYear: 2019,

  // --- Contact ------------------------------------------------------------
  // Leave a value as an empty string to hide it everywhere on the site.
  email: 'hello@satogarage.com',
  phone: '',
  location: 'Ask for the address when you book',
  hours: 'Mon–Fri, 9am–6pm · Weekends by appointment',

  // --- Social -------------------------------------------------------------
  instagramHandle: 'satogaragefb',
  instagramUrl: 'https://www.instagram.com/satogaragefb/',

  // --- Order form ---------------------------------------------------------
  // These drive the dropdowns on the "Order Custom" page. The server also
  // validates submissions against these exact values, so adding an option
  // here is all it takes to start accepting it.
  services: [
    { value: 'full-build', label: 'Full custom build' },
    { value: 'restoration', label: 'Restoration' },
    { value: 'performance', label: 'Performance / engine work' },
    { value: 'suspension', label: 'Suspension & stance' },
    { value: 'bodywork', label: 'Bodywork & paint' },
    { value: 'fabrication', label: 'One-off fabrication' },
    { value: 'maintenance', label: 'Service & maintenance' },
    { value: 'other', label: 'Something else' },
  ],

  budgets: [
    { value: 'under-1k', label: 'Under $1,000' },
    { value: '1k-5k', label: '$1,000 – $5,000' },
    { value: '5k-15k', label: '$5,000 – $15,000' },
    { value: '15k-plus', label: '$15,000+' },
    { value: 'unsure', label: 'Not sure yet' },
  ],

  timelines: [
    { value: 'asap', label: 'As soon as possible' },
    { value: '1-3-months', label: 'In the next 1–3 months' },
    { value: '3-6-months', label: '3–6 months out' },
    { value: 'flexible', label: 'Flexible / no rush' },
  ],

  // --- Services shown on the home page ------------------------------------
  serviceCards: [
    {
      title: 'Full custom builds',
      body: 'Start to finish. You bring the idea or the shell, we plan the build, source the parts and hand back something that turns heads.',
    },
    {
      title: 'Restoration',
      body: 'Bringing tired vehicles back to life — rust repair, panel work, mechanical refresh and a finish that respects the original.',
    },
    {
      title: 'Performance work',
      body: 'Engine work, intake and exhaust, tuning and the supporting mods to make sure the power actually gets used.',
    },
    {
      title: 'Fabrication',
      body: 'Brackets, mounts, cages, custom exhaust routing. If the part does not exist off the shelf, it gets made here.',
    },
  ],

  // --- "How it works" steps -----------------------------------------------
  processSteps: [
    {
      title: 'Tell us about it',
      body: 'Fill out the custom order form with the vehicle, the idea and roughly what you want to spend.',
    },
    {
      title: 'We talk it through',
      body: 'Expect a reply within a couple of days to work out what is realistic, what it costs and how long it takes.',
    },
    {
      title: 'Build slot booked',
      body: 'Once the plan and the quote are agreed, the vehicle gets a slot in the shop and a deposit locks it in.',
    },
    {
      title: 'Updates until it is done',
      body: 'Photos and progress as the work happens. No black box, no surprise invoices at the end.',
    },
  ],
};

export default site;
