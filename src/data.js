export const navLinks = [
  { id: 'top', label: 'Story' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'menu', label: 'Menu' },
  { id: 'spaces', label: 'Spaces' },
  { id: 'journal', label: 'Journal' },
  { id: 'booking', label: 'Visit' },
];

// Rotating second and third lines of the hero headline; "Find your" stays fixed
export const heroPhrases = [
  { accent: 'little moment', lead: 'of', close: 'calm.' },
  { accent: 'quiet corner', lead: 'of', close: 'light.' },
  { accent: 'slow morning', lead: 'of', close: 'ritual.' },
];

export const footerLinks = [
  { id: 'top', label: 'Our Story' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'menu', label: 'Tasting Menu' },
  { id: 'spaces', label: 'Architecture' },
  { id: 'journal', label: 'Quarterly Journal' },
];

export const philosophyNotes = [
  {
    title: 'Raw Materiality',
    body: 'Constructed exclusively with breathable French hydraulic lime plaster, untreated European Douglas fir, and sandblasted quartz stone. Every texture invites touch, aging softly with humidity and daily ritual.',
  },
  {
    title: 'Filtered Luminescence',
    body: 'Direct southern glare is diffused through woven unbleached Belgian linen scrims, producing an amber-tinted morning glow that settles guests into an unhurried, contemplative rhythm.',
  },
];

export const menuItems = [
  {
    name: 'Ceremonial Uji Matcha Latte',
    price: '$8.50',
    description:
      'Single-estate ceremonial grade matcha, hand-whisked to microfoam, steamed oat milk, cold-pressed Madagascar bourbon vanilla essence.',
  },
  {
    name: 'Moss & Citrus Cold Drip',
    price: '$9.00',
    description:
      '18-hour slow Dutch cold brew, cold-pressed bergamot oil, charred yuzu peel, clarified botanical tonic water, artisanal hand-cut sphere ice.',
  },
  {
    name: 'Cardamom Pistachio Morning Bun',
    price: '$7.50',
    description:
      '48-hour laminated wild sourdough brioche, Sicilian Bronte pistachio frangipane, hand-crushed green Guatemala cardamom, salted demerara glaze.',
  },
  {
    name: 'Smoked Trout & Fermented Herb Tartine',
    price: '$18.00',
    description:
      'Wild applewood-cured river trout, whipped grass-fed crème fraîche, cold-pressed dill oil, house fermented yellow mustard seeds on dark seeded rye.',
  },
];

// One day at the café told in five plates, shown one at a time below the menu
export const storyPlates = [
  {
    image: '/assets/images/story-toastie.jpg',
    alt: 'Grilled sandwich cut into triangles, filled with peppers and onion',
    time: '08:30 — First Light',
    name: 'The Garden',
    accent: 'Toastie',
    text: 'The morning begins on the grill. Thick-cut bread pressed until it stripes, a warm spiced filling of sweet peppers and red onion, cut while it still steams.',
  },
  {
    image: '/assets/images/story-pomodoro.jpg',
    alt: 'Wooden bowl of penne in tomato sauce beside a latte with leaf art at a garden window',
    time: '11:00 — The Window Seat',
    name: 'Penne',
    accent: 'al Pomodoro',
    text: 'By late morning the garden table is taken. A fern poured into the foam of a flat white, and a wooden bowl of penne in slow tomato under a snowfall of aged cheese.',
  },
  {
    image: '/assets/images/story-pizza.jpg',
    alt: 'Two wood-fired pizzas with blistered crusts, olives, soft cheese and pesto',
    time: '13:30 — The Wood Fire',
    name: 'Fire-Blistered',
    accent: 'Pizza',
    text: 'At midday the oven takes over. Dough rested for two days, blistered in ninety seconds, then dressed with olives, sun-dried tomato, soft cheese and basil pesto.',
  },
  {
    image: '/assets/images/story-rose.jpg',
    alt: 'Penne in a pink tomato cream sauce with black olives and two slices of garlic toast',
    time: '18:00 — Golden Hour',
    name: 'Rosé Penne',
    accent: '& Garlic Toast',
    text: 'As the light turns amber, the kitchen slows. Penne folded through a blush of tomato and cream, black olives, parsley, and two shards of garlic toast for the sauce.',
  },
  {
    image: '/assets/images/story-cheesecake.jpg',
    alt: 'Cheesecake topped with caramel and a spiced biscuit on a bed of crumbs',
    time: '20:30 — The Last Bite',
    name: 'Biscoff',
    accent: 'Cheesecake',
    text: 'And then, something sweet to close the day. Soft-set cheesecake under warm caramel and a spiced biscuit, resting on its own crumbs. Stay as long as you like.',
  },
];

export const galleryFrames = [
  {
    key: 'atrium',
    image: '/assets/images/atrium.jpg',
    alt: 'Tranquil Scandinavian-Japanese café dining space with pale oak banquettes and paper lanterns',
    label: 'Dining Pavilion',
    title: 'The Northern Light Atrium',
    lines: ['The Northern', 'Light Atrium'],
    code: 'A-01',
  },
  {
    key: 'bar',
    image: '/assets/images/bar.jpg',
    alt: 'Fluted cast-concrete coffee bar counter with a minimalist floral arrangement',
    label: 'Bar Detail',
    title: 'Fluted Cast-Concrete Bar',
    lines: ['Fluted', 'Concrete Bar'],
    code: 'A-02',
  },
  {
    key: 'alcove',
    image: '/assets/images/alcove.jpg',
    alt: 'Sunlit reading alcove with built-in shelving and an olive linen bench',
    label: 'Alcove',
    title: 'The Reading Chamber',
    lines: ['The Reading', 'Chamber'],
    code: 'A-03',
  },
  {
    key: 'ceramics',
    image: '/assets/images/ceramics.jpg',
    alt: 'Row of handcrafted ceramic cups and tea vessels on a rough-sawn wood shelf',
    label: 'Craft Objects',
    title: 'Bespoke Hasami Kiln Vessels',
    lines: ['Hasami Kiln', 'Vessels'],
    code: 'A-04',
  },
];

export const materialSpecs = [
  {
    icon: 'forest',
    label: 'Timber Construction',
    title: 'Danish Douglas Fir',
    body: 'Sustainably harvested, lye-treated, soap-finished for raw velvet touch.',
  },
  {
    icon: 'architecture',
    label: 'Wall Surface',
    title: 'St. Astier Natural Lime',
    body: 'Breathable hydraulic mineral mortar retaining natural indoor humidity balance.',
  },
  {
    icon: 'graphic_eq',
    label: 'Acoustic Engineering',
    title: 'Felted Merino Wool',
    body: 'Subtle ceiling insets dampening hard clatter to maintain calm murmur.',
  },
];

export const stories = [
  {
    image: '/assets/images/journal-brewing.jpg',
    alt: 'Gooseneck kettle pouring hot water onto a ceramic V60 dripper in morning light',
    volume: 'Vol. 12 · Roastery',
    readTime: '6 Min Read',
    title: 'Notes on Brewing at 92°C',
    body: 'Why fractional variances in extraction temperature either elevate the delicate jasmine florality of washed Ethiopian landraces or mute them entirely.',
  },
  {
    image: '/assets/images/journal-hasami.jpg',
    alt: 'Craftsman shaping an unglazed tea cup on a pottery wheel in Hasami, Japan',
    volume: 'Vol. 11 · Provenance',
    readTime: '8 Min Read',
    title: 'The Ceramics of Hasami Prefecture',
    body: 'A journey to Nagasaki to commission our bespoke tactile vessels. Four centuries of porcelain craft tuned specifically to the lip profile of single-origin espresso.',
  },
  {
    image: '/assets/images/journal-light.jpg',
    alt: 'Golden sunrise streaming through linen blinds onto lime washed walls and an empty wooden table',
    volume: 'Vol. 10 · Architecture',
    readTime: '4 Min Read',
    title: 'Morning Light: A Photo Essay',
    body: 'Documenting the sixty minutes between sunrise and the unlocking of our front doors when the atelier exists in its purest form of suspended stillness.',
  },
];

export const bookingOptions = {
  dates: [
    'Today · Autumn Afternoon',
    'Tomorrow · Morning Session',
    'Thursday, Oct 24',
    'Friday, Oct 25',
    'Saturday, Oct 26',
    'Sunday, Oct 27',
  ],
  times: [
    '08:30 AM (Morning Pour)',
    '10:00 AM (Tea Service)',
    '11:30 AM (Bake Batch 01)',
    '01:00 PM (Midday Luncheon)',
    '03:30 PM (Slow Matcha Hour)',
  ],
  parties: [
    'Solo Contemplation (1)',
    'Pair (2 Guests)',
    'Intimate Gathering (3-4)',
    'Communal Oak Table (5-8)',
  ],
};
