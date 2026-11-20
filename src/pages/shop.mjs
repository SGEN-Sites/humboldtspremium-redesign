// shop.mjs: /shop/ (every product) and one page per live category, all on the live URLs. Every product card's
// "Add to cart" opens that product in the live store, where the bag and checkout live.
import { esc, u, icon, img, btn, kicker, linkArrow, acc } from '../lib/html.mjs';
import { CATS, CATALOG, catCount, SHOP, feelings } from '../content/site.mjs';
import { pageHero, productGrid, catFlow, feelingTiles, ctaBand } from '../lib/parts.mjs';

const LEARN_FOR = {
  'a-all-flower-1': ['/learn/indica-sativa-hybrid/', 'Indica, sativa, hybrid: what the labels mean'],
  'a-indica-flower': ['/learn/indica-sativa-hybrid/', 'Relax, balance, uplift: reading the labels'],
  'a-sativa-flower': ['/learn/indica-sativa-hybrid/', 'Relax, balance, uplift: reading the labels'],
  'a-hybrid-flower': ['/learn/indica-sativa-hybrid/', 'Relax, balance, uplift: reading the labels'],
  'a-humboldt-grown': ['/learn/humboldt-grown/', 'Why Humboldt grown matters'],
  'a-prerolls': ['/learn/cannabis-formats/', 'Every format on the menu, explained'],
  'a-cartridges': ['/learn/cannabis-formats/', 'Carts and all-in-ones, explained'],
  'a-concentrates': ['/learn/cannabis-formats/', 'Live resin, badder, diamonds: a quick guide'],
  'edibles': ['/learn/edibles-and-drinks/', 'Edibles: start low, go slow'],
  'a-drinks': ['/learn/edibles-and-drinks/', 'Drinks: how they differ from edibles'],
  'a-tintctures': ['/learn/cannabis-formats/', 'Tinctures, explained'],
  'a-topicals': ['/learn/cannabis-formats/', 'Topicals, explained'],
  'a-cbd-cbn': ['/learn/cbd-and-cbn/', 'CBD and CBN, in plain words'],
  'accessories': ['/learn/first-visit/', 'Your first visit to the Arcata store'],
  'a-sale-items': ['/deals/', 'Daily deals and this month’s promos'],
};
const TITLES = {
  'a-all-flower-1': 'All Cannabis Flower', 'a-indica-flower': 'Indica Flower', 'a-sativa-flower': 'Sativa Flower', 'a-hybrid-flower': 'Hybrid Flower',
  'a-humboldt-grown': 'Humboldt Grown Flower & Prerolls', 'a-prerolls': 'Prerolls', 'a-cartridges': 'Vape Cartridges & All-in-Ones', 'a-concentrates': 'Concentrates',
  'edibles': 'Cannabis Edibles', 'a-drinks': 'Cannabis Drinks', 'a-tintctures': 'Tinctures', 'a-topicals': 'Topicals', 'a-cbd-cbn': 'CBD & CBN', 'accessories': 'Accessories', 'a-sale-items': 'Sale Items',
};
const HEADS = {
  'a-all-flower-1': 'Every jar on *the shelf.*', 'a-indica-flower': 'Indica, for *the fireside.*', 'a-sativa-flower': 'Sativa, for *the fog lifting.*', 'a-hybrid-flower': 'Hybrid, *right down the middle.*',
  'a-humboldt-grown': 'Grown in *our own backyard.*', 'a-prerolls': 'Rolled and *ready.*', 'a-cartridges': 'Carts and *all-in-ones.*', 'a-concentrates': 'Live resin, badder, *diamonds.*',
  'edibles': 'Edibles, *start low.*', 'a-drinks': 'Sip, *don’t rush.*', 'a-tintctures': 'Measured by *the drop.*', 'a-topicals': 'Balms and *lotions.*', 'a-cbd-cbn': 'Low and *no THC.*', 'accessories': 'Glass, grinders, *papers.*', 'a-sale-items': 'Marked down *right now.*',
};

function catPage(slug) {
  const c = CATS[slug]; const cat = CATALOG.categories.find((x) => x.slug === slug);
  const n = cat.count; const [lh, lt] = LEARN_FOR[slug];
  const siblings = Object.entries(CATS).filter(([s, x]) => x.group === c.group && s !== slug);
  const isFlower = c.group === 'Flower';
  const body = `
${pageHero({
  kicker: `Shop Arcata · ${n} products`, title: HEADS[slug], image: isFlower ? (c.feeling === 'Relax' ? 'fire-table' : c.feeling === 'Uplift' ? 'redwood-fog' : c.feeling === 'Balance' ? 'marsh-golden' : 'interior-counter') : 'interior-wide',
  lead: `${esc(c.blurb)} Prices from the live store; <b>Add to cart</b> opens your bag.`,
  crumbs: [['Home', '/'], ['Shop', '/shop/'], [c.name, '/' + slug + '/']],
  chips: siblings.map(([s, x]) => `<a class="chip" href="${u('/' + s + '/')}">${esc(x.name)} <span class="mega__n">${catCount(s)}</span></a>`).join('') + (slug !== 'a-sale-items' ? `<a class="chip chip--ember" href="${u('/a-sale-items/')}">${icon('tag')} Sale items</a>` : ''),
  variant: 'phero--shop',
  art: `<div class="phero__art" data-depth="-0.12">${img(c.art, { alt: '', sizes: '(max-width: 760px) 50vw, 360px', eager: true, pick: 1 })}</div>`,
})}
<section class="band shop-band" data-spot style="--lx:80%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <h2 class="sr-only">${esc(TITLES[slug])}: ${n} products</h2>
    ${productGrid(cat.products, { id: 'grid-' + slug, catSlug: slug, limit: 24 })}
    <div class="shop-after">
      <a class="learn-card glass" href="${u(lh)}" data-spot>${icon('leaf')}<span><small>From the Learn hub</small><b>${esc(lt)}</b></span>${icon('arrow')}</a>
      <a class="learn-card glass" href="${u('/shop/')}" data-spot>${icon('bag')}<span><small>The whole menu</small><b>Shop all ${catCount('shop')} products</b></span>${icon('arrow')}</a>
    </div>
  </div>
</section>
${isFlower ? `<section class="band feel-band feel-band--slim"><div class="wrap"><div class="section-head section-head--center">${kicker('Shop by feeling')}<h2>${acc('Relax, balance *or uplift.*')}</h2></div>${feelingTiles()}</div></section>` : ''}`;
  return {
    path: '/' + slug + '/', key: 'cat-' + slug, bodyClass: 'pg-shop pg-cat',
    title: `${TITLES[slug]} in Arcata | Humboldt's Premium Arcata`,
    description: `Shop ${n} ${TITLES[slug].toLowerCase()} at Humboldt's Premium Arcata, 460 I St. Order ahead for pickup or free home delivery. Cash and debit, ID required.`.slice(0, 158),
    crumbs: [['Home', '/'], ['Shop', '/shop/'], [c.name, '/' + slug + '/']], ogImage: 'interior-wide', body,
  };
}

function shopPage() {
  const all = CATALOG.categories.find((c) => c.slug === 'shop');
  const body = `
${pageHero({
  kicker: `Shop Arcata · ${all.count} products`, title: 'The whole menu, *one shelf.*',
  lead: 'Browse every product in the Arcata store. Add to cart opens the product in the live store, where your bag and checkout live. Online orders can be placed here, or phone in orders by calling 707-630-4098.',
  image: 'interior-counter', crumbs: [['Home', '/'], ['Shop', '/shop/']], variant: 'phero--shop',
  actions: btn('View your bag', SHOP.cart, { ic: 'bag' }) + btn('Today’s deals', '/deals/', { kind: 'ghost' }),
  art: `<div class="phero__art phero__art--duo" data-depth="-0.12">${img('cat-concentrates', { alt: '', sizes: '280px', eager: true, pick: 1 })}${img('cat-prerolls', { alt: '', sizes: '280px', eager: true, pick: 1 })}</div>`,
})}
<section class="band band--lit" data-spot style="--lx:20%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head">${kicker('Shop by category')}<h2>${acc('Pick a *corner of the wall.*')}</h2></div>
    ${catFlow(['a-all-flower-1', 'a-indica-flower', 'a-sativa-flower', 'a-hybrid-flower', 'a-humboldt-grown', 'a-prerolls', 'a-cartridges', 'a-concentrates', 'edibles', 'a-drinks', 'a-tintctures', 'a-topicals', 'a-cbd-cbn', 'accessories', 'a-sale-items'], { id: 'cats-shop' })}
  </div>
</section>
<section class="band shop-band" id="all" data-spot style="--lx:80%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head"><div>${kicker('Every product')}<h2>${acc(`All ${all.count} *products.*`)}</h2></div><p class="lead">Search, filter by type or sort by price and THC.</p></div>
    ${productGrid(all.products, { id: 'grid-all', limit: 24 })}
  </div>
</section>
<section class="band feel-band feel-band--slim"><div class="wrap"><div class="section-head section-head--center">${kicker('Shop by feeling')}<h2>${acc('Relax, balance *or uplift.*')}</h2></div>${feelingTiles()}</div></section>`;
  return {
    path: '/shop/', key: 'shop', bodyClass: 'pg-shop',
    title: "Shop Cannabis in Arcata | Humboldt's Premium Arcata",
    description: `Shop all ${all.count} products at Humboldt's Premium Arcata: flower, prerolls, carts, concentrates, edibles and drinks. Order ahead for pickup at 460 I St.`,
    crumbs: [['Home', '/'], ['Shop', '/shop/']], ogImage: 'interior-counter', body,
  };
}

export default function shop() {
  return [shopPage(), ...Object.keys(CATS).map(catPage)];
}
