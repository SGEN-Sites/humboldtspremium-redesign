// parts.mjs: shared sections. Every section is a band (key light + clipped backdrops) so art can cross seams.
import fs from 'node:fs';
import { esc, u, asset, icon, img, imgSrc, btn, kicker, linkArrow, breadcrumb, acc, plain, md, video, IMG } from './html.mjs';
import { store, CATS, CATALOG, catCount, FACTS, SHOP, DAYS, feelings, hoursShort } from '../content/site.mjs';

const PIMG = new URL('../assets/img/p/', import.meta.url);
export const hasPimg = (slug) => fs.existsSync(new URL(slug + '.webp', PIMG));

// ---------- atmosphere ----------
export const fog = (cls = '') => `<div class="fog ${cls}" aria-hidden="true"><span class="fog__l fog__l--1"></span><span class="fog__l fog__l--2"></span><span class="fog__l fog__l--3"></span></div>`;
export const embers = (n = 26, cls = '') => `<canvas class="embers ${cls}" data-embers="${n}" aria-hidden="true"></canvas>`;
export const grain = () => '<span class="grain-layer" aria-hidden="true"></span>';
export const floater = (id, cls, depth = 0.15, rot = 0) => `<span class="floater ${cls}" data-depth="${depth}" data-rot="${rot}" aria-hidden="true">${img(id, { alt: '', sizes: '200px', pick: 0 })}</span>`;

// ---------- inner page hero (one consistent height; art is a backdrop) ----------
export function pageHero({ kicker: k, title, lead, image, crumbs, actions = '', chips = '', variant = '', art = '', pos = 'center' }) {
  return `<section class="phero ${variant}" data-spot>
  <div class="band__clip">${image ? img(image, { alt: '', cls: 'phero__img', sizes: '100vw', eager: true, style: `object-position:${pos}` }) : ''}<div class="phero__scrim"></div>${fog('fog--low')}${embers(18)}<span class="key-light"></span></div>
  <div class="phero__in wrap">
    ${crumbs ? breadcrumb(crumbs) : ''}
    ${k ? kicker(k) : ''}
    <h1 class="phero__h" data-split>${acc(title)}</h1>
    ${lead ? `<p class="lead phero__lead">${lead}</p>` : ''}
    ${chips ? `<div class="phero__chips">${chips}</div>` : ''}
    ${actions ? `<div class="actions">${actions}</div>` : ''}
  </div>
  ${art}
</section>`;
}

// ---------- products ----------
const typeOf = (name) => { const m = name.match(/\((I|S|H|I\/S|S\/I|H\/I|I\/H|H\/S|S\/H)\)/); if (!m) return ''; const t = m[1][0]; return t === 'I' ? 'Indica' : t === 'S' ? 'Sativa' : 'Hybrid'; };
const thcOf = (name) => { const m = name.match(/(\d{1,2}(?:\.\d+)?)\s*%\s*THC/i); return m ? Number(m[1]) : null; };
const num = (p) => Number(String(p).replace(/[^0-9.]/g, '')) || 0;
export function productCard(p, { i = 0, catSlug = '' } = {}) {
  const t = typeOf(p.name); const thc = thcOf(p.name);
  const pic = hasPimg(p.slug) ? `<img src="${asset('img/p/' + p.slug + '.webp')}" alt="${esc(p.name)}" width="480" height="480" loading="lazy" decoding="async">` : `<span class="pc__ph">${icon('leaf')}</span>`;
  const ribbon = p.ribbon ? `<span class="pc__rib${/sale/i.test(p.ribbon) ? ' is-sale' : ''}">${esc(p.ribbon.replace(/!+$/, ''))}</span>` : '';
  const price = p.was ? `<span class="pc__price"><s aria-label="Regular price">${esc(p.was)}</s> <b aria-label="Sale price">${esc(p.price)}</b></span>` : `<span class="pc__price"><b>${esc(p.price)}</b></span>`;
  return `<article class="pc" data-tilt data-type="${t}" data-price="${num(p.price)}" data-thc="${thc ?? ''}" data-name="${esc(p.name.toLowerCase())}" data-cats="${esc(p.cats.join(' '))}" style="--i:${i % 12}">
  <a class="pc__media" href="${SHOP.product(p.slug)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">${pic}<span class="pc__glow"></span>${ribbon}</a>
  <div class="pc__body">
    <div class="pc__tags">${t ? `<span class="pc__type pc__type--${t.toLowerCase()}">${t}</span>` : ''}${thc ? `<span class="pc__thc">${thc}% THC</span>` : ''}</div>
    <h3 class="pc__name"><a href="${SHOP.product(p.slug)}" target="_blank" rel="noopener">${esc(p.name)}</a></h3>
    <div class="pc__foot">${price}<a class="pc__add" href="${SHOP.product(p.slug)}" target="_blank" rel="noopener" aria-label="Add ${esc(p.name)} to your cart (opens the live store)">${icon('bag')}<span>Add to cart</span></a></div>
  </div>
</article>`;
}
export function productGrid(slugs, { id = 'grid', tools = true, catSlug = '', limit = 24, title = '' } = {}) {
  const items = slugs.map((s) => CATALOG.products[s]).filter(Boolean);
  const types = ['Indica', 'Sativa', 'Hybrid'].filter((t) => items.some((p) => typeOf(p.name) === t));
  const toolbar = tools ? `<div class="pg-tools" data-grid-tools="${id}">
    <label class="pg-search">${icon('search')}<span class="sr-only">Search these products</span><input type="search" placeholder="Search ${items.length} products" data-grid-q></label>
    ${types.length > 1 ? `<div class="pg-chips" role="group" aria-label="Filter by type"><button type="button" class="chip is-on" data-grid-type="">All</button>${types.map((t) => `<button type="button" class="chip" data-grid-type="${t}">${t}</button>`).join('')}</div>` : ''}
    <label class="pg-sort"><span class="sr-only">Sort</span><select data-grid-sort><option value="">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="thc-desc">THC: high to low</option><option value="name">Name: A to Z</option></select></label>
    <p class="pg-count" aria-live="polite"><span data-grid-count>${items.length}</span> products</p>
  </div>` : '';
  return `<div class="pgrid-wrap" id="${id}" data-grid data-limit="${limit}">
  ${toolbar}
  <div class="pgrid">${items.map((p, i) => productCard(p, { i, catSlug })).join('')}</div>
  <p class="pg-empty" data-grid-empty hidden>Nothing matches that yet. Try another word, or <a href="${u('/shop/')}">see every product</a>.</p>
  ${items.length > limit ? `<div class="pg-more"><button type="button" class="btn btn--ghost" data-grid-more><span>Show more</span>${icon('chev')}</button></div>` : ''}
  <p class="pg-note">${icon('bag')} Prices and stock are a snapshot of the live store (${esc(new Date(CATALOG.capturedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))}). <b>Add to cart</b> opens the product in the live store, where your bag and checkout live. <a href="${SHOP.cart}" target="_blank" rel="noopener">View your bag</a>.</p>
</div>`;
}

// ---------- category wall (the store's slat wall) ----------
export function catWall(slugs, { cls = '' } = {}) {
  return `<div class="catwall ${cls}" data-catwall>${slugs.map((s, i) => {
    const c = CATS[s]; const n = catCount(s);
    return `<a class="cat" href="${u('/' + s + '/')}" style="--i:${i}" data-tilt data-spot>
      <span class="cat__slats" aria-hidden="true">${'<i></i>'.repeat(9)}</span>
      <span class="cat__light" aria-hidden="true"></span>
      <span class="cat__art">${img(c.art, { alt: '', sizes: '(max-width: 760px) 40vw, 220px', pick: 1 })}</span>
      <span class="cat__body"><span class="cat__n">${n} products</span><span class="cat__name">${esc(c.name)}</span><span class="cat__blurb">${esc(c.blurb)}</span><span class="cat__go">Shop ${esc(c.name.toLowerCase())} ${icon('arrow')}</span></span>
    </a>`;
  }).join('')}</div>`;
}

// ---------- shop by feeling ----------
export function feelingTiles() {
  return `<div class="feel">${feelings.map((f, i) => `<a class="feel__tile feel__tile--${f.tone}" href="${u('/' + f.slug + '/')}" data-spot style="--i:${i}">
    <span class="feel__media">${img(f.img, { alt: '', sizes: '(max-width: 760px) 100vw, 33vw' })}</span>
    <span class="feel__shade"></span>
    <span class="feel__body"><span class="feel__k">${catCount(f.slug)} ${esc(CATS[f.slug].name.toLowerCase())} products</span><span class="feel__name">${f.key}</span><span class="feel__line">${esc(f.line)}</span><span class="feel__go">Shop ${f.key.toLowerCase()} ${icon('arrow')}</span></span>
  </a>`).join('')}</div>`;
}

// ---------- daily deals board ----------
export function dealsBoard({ compact = false } = {}) {
  const d = FACTS.dailyDeals.value;
  return `<div class="board${compact ? ' board--compact' : ''}" data-deals-board>
  ${DAYS.slice(1).concat('Sunday').map((day) => `<div class="board__day" data-day="${day}">
    <p class="board__name"><span>${day.slice(0, 3)}</span><span class="board__full">${day}</span><span class="board__today">Today</span></p>
    <ul>${d[day].map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
  </div>`).join('')}
  </div>
  <p class="board__src">Daily deals as posted by the Arcata store. **Discounts cannot be stacked or applied to items on special or to sale items.</p>`;
}

export function saleRail() {
  const sale = CATALOG.categories.find((c) => c.slug === 'a-sale-items').products.map((s) => CATALOG.products[s]).filter(Boolean);
  return `<div class="rail" data-rail><div class="rail__track">${sale.map((p, i) => productCard(p, { i })).join('')}</div>
  <div class="rail__nav"><button type="button" class="rail__btn" data-rail-prev aria-label="Previous">${icon('left')}</button><button type="button" class="rail__btn" data-rail-next aria-label="Next">${icon('right')}</button></div></div>`;
}
export function catRail(slug, max = 14) {
  const list = CATALOG.categories.find((c) => c.slug === slug).products.slice(0, max).map((s) => CATALOG.products[s]).filter(Boolean);
  return `<div class="rail" data-rail><div class="rail__track">${list.map((p, i) => productCard(p, { i })).join('')}</div>
  <div class="rail__nav"><button type="button" class="rail__btn" data-rail-prev aria-label="Previous">${icon('left')}</button><button type="button" class="rail__btn" data-rail-next aria-label="Next">${icon('right')}</button></div></div>`;
}

// ---------- promos ----------
export function promoCards() {
  const m = FACTS.monthPromos;
  const card = (t, i, tag) => `<li class="promo-card glass" style="--i:${i}"><span class="promo-card__tag">${tag}</span><p>${esc(t)}</p></li>`;
  return `<div class="promos">
    <div><h3 class="promos__h">${esc(m.month)} promotions</h3><ul class="promo-list">${m.value.map((t, i) => card(t, i, 'This month')).join('')}</ul></div>
    <div><h3 class="promos__h">On going promos</h3><ul class="promo-list">${m.ongoing.map((t, i) => card(t, i, 'Ongoing')).join('')}</ul></div>
  </div>
  <p class="board__src">${esc(m.footnote)}. Promotions as posted by the Arcata store for ${esc(m.month)} 2026; ask the counter for this month's list.</p>`;
}
export function wheelCard() {
  return `<div class="wheel" id="wheel" data-spot>
  <div class="wheel__spin" aria-hidden="true"><svg viewBox="0 0 200 200">${Array.from({ length: 12 }, (_, i) => { const a0 = (i * 30 - 90) * Math.PI / 180, a1 = ((i + 1) * 30 - 90) * Math.PI / 180; const x0 = 100 + 92 * Math.cos(a0), y0 = 100 + 92 * Math.sin(a0), x1 = 100 + 92 * Math.cos(a1), y1 = 100 + 92 * Math.sin(a1); return `<path d="M100 100L${x0.toFixed(1)} ${y0.toFixed(1)}A92 92 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}z" class="w${i % 4}"/>`; }).join('')}<circle cx="100" cy="100" r="18" class="wc"/></svg><span class="wheel__pin"></span></div>
  <div class="wheel__txt">${kicker('Every 1st of the month')}<h3>Spend $50 or more, <span class="acc">spin the wheel.</span></h3><p>Includes both locations and delivery. **While supplies last!**</p></div>
</div>`;
}

// ---------- staff picks ----------
export function staffPicks() {
  const s = FACTS.staffPicks;
  return `<div class="picks" data-picks>${s.value.filter((x) => x[2]).slice(0, 12).map(([k, item, who], i) => `<figure class="pick" style="--i:${i}" data-tilt>
    <span class="pick__k">${esc(k)}</span>
    <p class="pick__item">${esc(item)}</p>
    <figcaption class="pick__who"><span class="pick__init" aria-hidden="true">${esc(who[0])}</span>${esc(who)}'s pick</figcaption>
  </figure>`).join('')}</div>
  <p class="board__src">Staff picks as published in California Leaf, ${esc(s.asOf)}. Ask the counter what the team is into this week.</p>`;
}

// ---------- story stats ----------
export function storyStats() {
  return `<div class="stats">
    <div class="stat" data-count-wrap><span class="stat__n"><span data-count="2015">2015</span></span><span class="stat__l">Serving Humboldt since</span></div>
    <div class="stat"><span class="stat__n"><span data-count="2">2</span></span><span class="stat__l">Stores, one family: Arcata and Eureka</span></div>
    <div class="stat"><span class="stat__n stat__n--word">Farm <span class="acc">to</span> counter</span><span class="stat__l">Farmed, made, delivered and sold here</span></div>
  </div>`;
}

// ---------- visit band ----------
export function hoursList(cls = '') {
  return `<ul class="hours ${cls}" data-hours>${store.hours.map(([d, h]) => `<li data-hday="${d}"><span>${d.replace('Thu rsday', 'Thursday')}</span><span>${esc(h)}</span></li>`).join('')}</ul>`;
}
export function mapEmbed(cls = '') {
  return `<div class="map ${cls}" id="map" data-map>
  <div class="map__ph" data-map-ph>
    <svg class="map__art" viewBox="0 0 400 260" aria-hidden="true"><path class="map__road map__road--big" d="M0 172 C80 168 160 170 230 176 S340 190 400 186"/><path class="map__road" d="M196 0 L204 260"/><path class="map__road" d="M120 0 L128 260"/><path class="map__road" d="M276 0 L282 260"/><path class="map__water" d="M0 230 C70 214 150 236 230 222 S350 240 400 228 L400 260 L0 260z"/><path class="map__marsh" d="M140 200 C170 196 214 204 252 198 L258 228 C210 232 168 226 140 230z"/><circle class="map__pin-glow" cx="203" cy="166" r="22"/><circle class="map__pin" cx="203" cy="166" r="7"/></svg>
    <div class="map__label"><b>460 I St</b><span>Corner of I St &amp; Samoa Blvd</span></div>
    <button type="button" class="btn btn--sm" data-map-load><span>Load the Google map</span>${icon('pin')}</button>
  </div>
  <template data-map-tpl><iframe title="Map to Humboldt's Premium Arcata, 460 I St" src="https://www.google.com/maps?q=Humboldt%27s+Premium+Arcata,+460+I+St,+Arcata,+CA+95521&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></template>
</div>`;
}
export function visitBand({ title = 'Find us on the corner of *I St and Samoa*', withPhoto = true } = {}) {
  return `<section class="band band--lit visit" data-spot style="--lx:20%;--ly:30%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap visit__grid">
    <div class="visit__info" data-reveal>
      ${kicker('Visit Arcata')}
      <h2>${acc(title)}</h2>
      <p class="lead">Welcome to our Arcata location at 460 I St. Come in, shop the store or just say "Hi" to everyone.</p>
      <div class="visit__cols">
        <div><p class="visit__h">${icon('clock')} Arcata Store Hours</p>${hoursList()}</div>
        <div class="visit__facts">
          <p class="visit__h">${icon('pin')} Address</p><p>${store.street}, ${store.city}, ${store.region} ${store.zip}<br><span class="muted">${esc(store.corner)}</span></p>
          <p class="visit__h">${icon('cash')} Payments</p><p class="muted small">Cash and debit ($3.00 fee). Sorry, no credit.</p>
          <p class="visit__h">${icon('id')} ID</p><p class="muted small">ID is required. No ID, no sale!</p>
        </div>
      </div>
      <div class="actions">${btn('Get directions', store.directions, { ic: 'ne' })}${btn('Call ' + store.phone, 'tel:' + store.tel, { kind: 'ghost', ic: 'phone' })}</div>
    </div>
    <div class="visit__media" data-reveal>
      ${withPhoto ? `<figure class="visit__photo" data-depth="-0.06">${img('storefront-dusk', { alt: 'The Arcata store at dusk, wall lights on', sizes: '(max-width: 900px) 100vw, 40vw' })}</figure>` : ''}
      ${mapEmbed()}
    </div>
  </div>
</section>`;
}

// ---------- faq ----------
export function faqList(items, { open = 0 } = {}) {
  return `<div class="faq">${items.map((f, i) => `<details class="faq__item"${i < open ? ' open' : ''}><summary><span>${esc(f.q)}</span><span class="faq__ic" aria-hidden="true"></span></summary><div class="faq__a">${md(f.a)}</div></details>`).join('')}</div>`;
}

// ---------- closing CTA ----------
export function ctaBand({ k = 'Arcata’s backyard', title = 'Stay a *while.*', lead = 'Order ahead, pick up at 460 I St, and pull up a chair in the courtyard.', image = 'courtyard-night', actions } = {}) {
  return `<section class="cta-band" data-spot>
  <div class="band__clip">${img(image, { alt: '', cls: 'cta-band__img', sizes: '100vw' })}<div class="cta-band__shade"></div>${fog()}${embers(30)}</div>
  <div class="wrap cta-band__in" data-reveal>
    ${kicker(k)}
    <h2 class="cta-band__h">${acc(title)}</h2>
    <p class="lead">${lead}</p>
    <div class="actions">${actions || btn('Order ahead', '/shop/') + btn('See the courtyard', '/courtyard-lounge/', { kind: 'ghost' })}</div>
  </div>
</section>`;
}

// ---------- slat reveal photo (the slatted wood wall from the store) ----------
export function slatPhoto(id, { alt, cls = '', sizes = '(max-width: 900px) 100vw, 50vw', caption = '' } = {}) {
  return `<figure class="slat ${cls}" data-slat>
  <span class="slat__img">${img(id, { alt, sizes })}</span>
  <span class="slat__bars" aria-hidden="true">${Array.from({ length: 10 }, (_, i) => `<i style="--s:${i}"></i>`).join('')}</span>
  ${caption ? `<figcaption>${caption}</figcaption>` : ''}
</figure>`;
}
export function marquee(words, cls = '') {
  const run = words.map((w) => `<span>${esc(w)}</span><i aria-hidden="true">${icon('spark')}</i>`).join('');
  return `<div class="marquee ${cls}" aria-hidden="true"><div class="marquee__track">${run}${run}</div></div>`;
}
export function aiNote(kind = 'edited') {
  return kind === 'edited' ? 'Photo: the store’s own courtyard photo, relit to dusk with AI.' : 'Illustrative image, AI-generated.';
}
