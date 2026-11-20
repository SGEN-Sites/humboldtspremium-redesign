// site.mjs: the store's facts (from facts/client-facts.json, each sourced there), navigation and the shop map.
import fs from 'node:fs';

export const FACTS = JSON.parse(fs.readFileSync(new URL('../../facts/client-facts.json', import.meta.url), 'utf8'));
export const CATALOG = JSON.parse(fs.readFileSync(new URL('./products.json', import.meta.url), 'utf8'));
const LEARN_FILE = new URL('./learn.json', import.meta.url);
export const LEARN = fs.existsSync(LEARN_FILE) ? JSON.parse(fs.readFileSync(LEARN_FILE, 'utf8')) : { articles: [], glossary: [], faq: [] };

export const LIVE = 'https://www.humboldtspremiumarcata.com';
export const SHOP = {
  cart: LIVE + '/cart-page',
  search: LIVE + '/search',
  product: (slug) => `${LIVE}/product-page/${slug}`,
};
export const store = {
  name: "Humboldt's Premium Arcata",
  short: "Humboldt's Premium",
  street: '460 I St', city: 'Arcata', region: 'CA', zip: '95521',
  corner: 'On the corner of I St. and Samoa Blvd.',
  phone: '707-630-4098', tel: '+17076304098',
  email: FACTS.email.value, deliveryEmail: FACTS.deliveryEmail.value,
  license: FACTS.license.value,
  lat: FACTS.geo.lat, lng: FACTS.geo.lng,
  maps: 'https://www.google.com/maps/search/?api=1&query=Humboldt%27s+Premium+Arcata+460+I+St+Arcata+CA+95521',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=460+I+St,+Arcata,+CA+95521',
  reviews: 'https://www.google.com/maps/search/?api=1&query=Humboldt%27s+Premium+Arcata',
  hours: FACTS.hours.value, // [day, "9:00 am - 9:00 pm"]
  // machine hours for the open-now status (24h), same source as above
  hoursMachine: { 0: [10, 19], 1: [9, 21], 2: [9, 21], 3: [9, 21], 4: [9, 21], 5: [9, 21], 6: [9, 21] },
  social: FACTS.social,
  eureka: FACTS.eureka,
};
export const hoursShort = [['Mon to Sat', '9 AM to 9 PM'], ['Sunday', '10 AM to 7 PM']];

// category map: live slug -> display name, live label (kept verbatim in the page), art, blurb (neutral glue)
export const CATS = {
  'a-all-flower-1': { name: 'Flower', label: 'A Flower (All)', art: 'cat-flower', group: 'Flower', blurb: 'Every jar on the shelf, indica to sativa.' },
  'a-indica-flower': { name: 'Indica', label: 'A Indica Flower', art: 'cat-flower', group: 'Flower', feeling: 'Relax', blurb: 'The wind-down side of the menu.' },
  'a-sativa-flower': { name: 'Sativa', label: 'A Sativa Flower', art: 'cat-flower', group: 'Flower', feeling: 'Uplift', blurb: 'The daytime, get-outside side.' },
  'a-hybrid-flower': { name: 'Hybrid', label: 'A Hybrid Flower', art: 'cat-flower', group: 'Flower', feeling: 'Balance', blurb: 'A little of both.' },
  'a-humboldt-grown': { name: 'Humboldt Grown', label: 'A Humboldt Grown (Flower/Prerolls)', art: 'cat-humboldt', group: 'Flower', blurb: 'Flower and prerolls from our own backyard.' },
  'a-prerolls': { name: 'Prerolls', label: 'A Prerolls', art: 'cat-prerolls', group: 'Ready to roll', blurb: 'Singles, packs and infused.' },
  'a-cartridges': { name: 'Cartridges', label: 'A Cartridges', art: 'cat-vape', group: 'Ready to roll', blurb: '510 carts and all-in-ones.' },
  'a-concentrates': { name: 'Concentrates', label: 'A Concentrates', art: 'cat-concentrates', group: 'Ready to roll', blurb: 'Live resin, badder, diamonds, hash.' },
  'edibles': { name: 'Edibles', label: 'A Edibles', art: 'cat-edibles', group: 'Edibles & more', blurb: 'Gummies, chocolates and more.' },
  'a-drinks': { name: 'Drinks', label: 'A Drinks', art: 'cat-drinks', group: 'Edibles & more', blurb: 'Sodas, seltzers and shots.' },
  'a-tintctures': { name: 'Tinctures', label: 'A Tintctures', art: 'cat-tinctures', group: 'Edibles & more', blurb: 'Measured by the drop.' },
  'a-topicals': { name: 'Topicals', label: 'A Topicals', art: 'cat-topicals', group: 'Edibles & more', blurb: 'Balms and lotions.' },
  'a-cbd-cbn': { name: 'CBD / CBN', label: 'A CBD/CBN', art: 'cat-cbd', group: 'Edibles & more', blurb: 'Low and no THC options.' },
  'accessories': { name: 'Accessories', label: 'A Accessories', art: 'cat-accessories', group: 'Edibles & more', blurb: 'Glass, grinders and papers.' },
  'a-sale-items': { name: 'Sale Items', label: 'A Sale Items', art: 'cat-concentrates', group: 'Deals', blurb: 'Marked down right now.' },
};
export const catCount = (slug) => (CATALOG.categories.find((c) => c.slug === slug) || { count: 0 }).count;
export const feelings = [
  { key: 'Relax', slug: 'a-indica-flower', img: 'fire-table', line: 'Fireside. Slow evening. Indica.', tone: 'ember' },
  { key: 'Balance', slug: 'a-hybrid-flower', img: 'marsh-golden', line: 'Golden hour. A walk at the Marsh. Hybrid.', tone: 'sun' },
  { key: 'Uplift', slug: 'a-sativa-flower', img: 'redwood-fog', line: 'Morning fog, sun breaking through. Sativa.', tone: 'sage' },
];

export const NAV = [
  { label: 'Shop', href: '/shop/', mega: 'shop' },
  { label: 'Deals', href: '/deals/' },
  { label: 'Courtyard & Lounge', href: '/courtyard-lounge/', hot: true, mega: 'lounge' },
  { label: 'Our Story', href: '/about-us/' },
  { label: 'Visit', href: '/arcata-details/', mega: 'visit' },
  { label: 'Learn', href: '/learn/', mega: 'learn' },
];
export const MEGA = {
  shop: {
    cols: [
      { h: 'Flower', links: ['a-all-flower-1', 'a-indica-flower', 'a-sativa-flower', 'a-hybrid-flower', 'a-humboldt-grown'] },
      { h: 'Ready to roll', links: ['a-prerolls', 'a-cartridges', 'a-concentrates'] },
      { h: 'Edibles & more', links: ['edibles', 'a-drinks', 'a-tintctures', 'a-topicals', 'a-cbd-cbn', 'accessories'] },
    ],
    feel: true,
  },
  visit: {
    cols: [
      { h: 'Arcata store', links: [['Hours, payments & policies', '/arcata-details/'], ['Directions & parking map', '/arcata-details/#map'], ['Contact us', '/contact/'], ['Our two stores', '/locations/']] },
      { h: 'Delivery', links: [['Free home delivery', '/delivery/'], ['Delivery towns', '/delivery/#towns'], ['Order ahead for pickup', '/shop/']] },
      { h: 'Around Arcata', links: [['Before or after the Marsh', '/arcata-marsh/'], ['What’s on', '/whats-on/'], ['FAQ', '/faq/']] },
    ],
  },
  lounge: {
    cols: [
      { h: 'Arcata\u2019s backyard', links: [['The courtyard & lounge', '/courtyard-lounge/'], ['The lounge news', '/courtyard-lounge/#news'], ['Courtyard manners', '/learn/courtyard-etiquette/']] },
      { h: 'What\u2019s on', links: [['Food trucks, parties & the wheel', '/whats-on/'], ['Daily deals', '/deals/'], ['Before or after the Marsh', '/arcata-marsh/']] },
    ],
  },
  learn: {
    cols: [
      { h: 'Start here', links: [['Your first visit', '/learn/first-visit/'], ['Relax, balance, uplift', '/learn/indica-sativa-hybrid/'], ['Every format, explained', '/learn/cannabis-formats/']] },
      { h: 'Go deeper', links: [['Edibles & drinks', '/learn/edibles-and-drinks/'], ['CBD & CBN', '/learn/cbd-and-cbn/'], ['Humboldt grown', '/learn/humboldt-grown/']] },
      { h: 'Good to know', links: [['Courtyard manners', '/learn/courtyard-etiquette/'], ['California cannabis laws', '/learn/california-cannabis-laws/'], ['Glossary', '/learn/glossary/'], ['FAQ', '/faq/']] },
    ],
  },
};

export const deliveryTowns = [
  { slug: 'mckinleyville', name: 'McKinleyville', route: 'north of Arcata on US-101', note: 'Just up the coast past the Mad River.' },
  { slug: 'eureka', name: 'Eureka', route: 'south on US-101 along Humboldt Bay', note: 'Our sister store is here too, at 1131 Broadway.' },
  { slug: 'blue-lake', name: 'Blue Lake', route: 'east of Arcata on State Route 299', note: 'Up the Mad River valley.' },
  { slug: 'fortuna', name: 'Fortuna', route: 'south on US-101 past Eureka', note: 'Down in the Eel River valley.' },
  { slug: 'ferndale', name: 'Ferndale', route: 'south on US-101, then west toward the coast', note: 'The Victorian village by the Eel River delta.' },
  { slug: 'carlotta', name: 'Carlotta', route: 'south on US-101, then east on State Route 36', note: 'Up the Van Duzen, where the redwoods close in.' },
];
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
