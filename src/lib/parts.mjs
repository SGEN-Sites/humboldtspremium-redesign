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
      <span class="cat__halo" aria-hidden="true"></span>
      <span class="cat__light" aria-hidden="true"></span>
      <span class="cat__art">${img(c.art, { alt: '', sizes: '(max-width: 760px) 40vw, 220px', pick: 1 })}</span>
      <span class="cat__body"><span class="cat__n">${n} products</span><span class="cat__name">${esc(c.name)}</span><span class="cat__blurb">${esc(c.blurb)}</span><span class="cat__go">Shop ${esc(c.name.toLowerCase())} ${icon('arrow')}</span></span>
    </a>`;
  }).join('')}</div>`;
}

// ---------- category coverflow: poster cards in one row, the centre card large and lit, neighbours recede ----------
const GLOW = { 'a-all-flower-1': '#fdc232', 'a-indica-flower': '#6592b6', 'a-sativa-flower': '#fdc232', 'a-hybrid-flower': '#8f9d74', 'a-humboldt-grown': '#8f9d74', 'a-prerolls': '#e8732c', 'a-cartridges': '#f2a93b', 'a-concentrates': '#fce594', 'edibles': '#c2622f', 'a-drinks': '#d17f45', 'a-tintctures': '#b5652a', 'a-topicals': '#e8dece', 'a-cbd-cbn': '#6592b6', 'accessories': '#c9a24a', 'a-sale-items': '#ff9a4a' };
export function catFlow(slugs, { id = 'cats' } = {}) {
  return `<div class="cflow" id="${id}" data-cflow aria-roledescription="carousel" aria-label="Shop by category">
  <div class="cflow__glow" aria-hidden="true"></div>
  <div class="cflow__track" data-cflow-track>${slugs.map((s, i) => {
    const c = CATS[s]; const n = catCount(s);
    return `<a class="cfc" href="${u('/' + s + '/')}" data-i="${i}" style="--glow:${GLOW[s] || '#fdc232'}" aria-label="${esc(c.name)}: ${n} products">
      <span class="cfc__bg" aria-hidden="true"></span>
      <span class="cfc__top"><img class="cfc__mark" src="${asset('img/favicon.png')}" alt="" width="28" height="28"><span class="cfc__n"><b>${n}</b> products</span></span>
      <span class="cfc__art">${img(c.art, { alt: '', sizes: '(max-width: 760px) 50vw, 260px', pick: 1 })}</span>
      <span class="cfc__body"><span class="cfc__name">${esc(c.name)}</span><span class="cfc__blurb">${esc(c.blurb)}</span><span class="cfc__go">Shop ${esc(c.name.toLowerCase())} ${icon('arrow')}</span></span>
    </a>`;
  }).join('')}</div>
  <div class="cflow__bar">
    <button type="button" class="rail__btn" data-cflow-prev aria-label="Previous category">${icon('left')}</button>
    <div class="cflow__dots" role="tablist" aria-label="Choose a category">${slugs.map((s, i) => `<button type="button" role="tab" class="cflow__dot" data-cflow-dot="${i}" aria-label="${esc(CATS[s].name)}"></button>`).join('')}</div>
    <button type="button" class="rail__btn" data-cflow-next aria-label="Next category">${icon('right')}</button>
  </div>
</div>`;
}

// ---------- shop by feeling ----------
export function feelingTiles() {
  return `<div class="feel" data-accordion>${feelings.map((f, i) => `<a class="feel__tile feel__tile--${f.tone}${i === 0 ? ' is-open' : ''}" href="${u('/' + f.slug + '/')}" data-spot style="--i:${i}">
    <span class="feel__media">${img(f.img, { alt: '', sizes: '(max-width: 760px) 100vw, 33vw' })}</span>
    <span class="feel__shade"></span>
    <span class="feel__spine" aria-hidden="true">${f.key}</span>
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
let WHEEL_N = 0;
// A realistic premium prize wheel: wood rim with grain, brass studs, gilded bezel and dividers, jewel-tone segments,
// a brass hub holding the logo's sun-and-tree mark, a static lacquer gloss and a brass pointer. The wheel turns; the
// light and the pointer stay put, as they would in the room.
export function wheelCard() {
  const k = ++WHEEL_N, C = 200, R = 172, N = 12;
  const pal = ['#5b1f10', '#b8642a', '#d9a63c', '#22463a'];
  const pt = (r, a) => [C + r * Math.cos(a), C + r * Math.sin(a)];
  const seg = Array.from({ length: N }, (_, i) => {
    const a0 = (i / N) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / N) * 2 * Math.PI - Math.PI / 2;
    const [x0, y0] = pt(R, a0), [x1, y1] = pt(R, a1); const am = (a0 + a1) / 2; const [dx, dy] = pt(122, am);
    return `<path d="M${C} ${C}L${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}z" fill="url(#wseg${k}-${i % 4})"/>`
      + `<g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${(am * 180 / Math.PI + 90).toFixed(1)})"><path d="M0 -9 L5 0 L0 9 L-5 0z" fill="url(#wgold${k})" opacity=".95"/></g>`;
  }).join('');
  const divs = Array.from({ length: N }, (_, i) => { const a = (i / N) * 2 * Math.PI - Math.PI / 2; const [x, y] = pt(R, a); const [x2, y2] = pt(58, a); return `<line x1="${x2.toFixed(2)}" y1="${y2.toFixed(2)}" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" stroke="#2a1608" stroke-width="3.6" opacity=".55"/><line x1="${x2.toFixed(2)}" y1="${y2.toFixed(2)}" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" stroke="url(#wgold${k})" stroke-width="1.8"/>`; }).join('');
  const studs = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * 2 * Math.PI; const [x, y] = pt(186, a); return `<circle cx="${x.toFixed(2)}" cy="${(y + 1.2).toFixed(2)}" r="4.6" fill="#1a0d06" opacity=".6"/><circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4.4" fill="url(#wstud${k})"/>`; }).join('');
  const segGrad = pal.map((c, j) => `<radialGradient id="wseg${k}-${j}" cx="200" cy="200" r="172" gradientUnits="userSpaceOnUse"><stop offset=".3" stop-color="${c}" stop-opacity=".82"/><stop offset=".86" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".78"/></radialGradient>`).join('');
  const svg = `<svg class="wheel2__spin" viewBox="0 0 400 400" aria-hidden="true" focusable="false"><defs>${segGrad}
    <linearGradient id="wgold${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1c2"/><stop offset=".35" stop-color="#e2b453"/><stop offset=".6" stop-color="#9c6d22"/><stop offset="1" stop-color="#f3d98a"/></linearGradient>
    <radialGradient id="wstud${k}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff4cf"/><stop offset=".35" stop-color="#e0b04d"/><stop offset="1" stop-color="#6e4813"/></radialGradient>
    <radialGradient id="wwood${k}" cx="200" cy="200" r="200" gradientUnits="userSpaceOnUse"><stop offset=".86" stop-color="#3b200f"/><stop offset=".93" stop-color="#6b3a1c"/><stop offset="1" stop-color="#2a160a"/></radialGradient>
    <filter id="wgrain${k}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.16" numOctaves="3" seed="11"/><feColorMatrix values="0 0 0 0 .24  0 0 0 0 .12  0 0 0 0 .05  0 0 0 .7 0"/></filter>
    <mask id="wring${k}"><circle cx="200" cy="200" r="199" fill="#fff"/><circle cx="200" cy="200" r="174" fill="#000"/></mask>
    <radialGradient id="whub${k}" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#fff0c4"/><stop offset=".3" stop-color="#d9a640"/><stop offset=".75" stop-color="#8a5a18"/><stop offset="1" stop-color="#4a2f0a"/></radialGradient>
    <radialGradient id="whubcap${k}" cx=".4" cy=".34" r=".78"><stop offset="0" stop-color="#f7dc92"/><stop offset=".42" stop-color="#b98432"/><stop offset=".85" stop-color="#6a4512"/><stop offset="1" stop-color="#3e2809"/></radialGradient></defs>
    <circle cx="200" cy="200" r="199" fill="url(#wwood${k})"/>
    <rect width="400" height="400" filter="url(#wgrain${k})" mask="url(#wring${k})"/>
    <circle cx="200" cy="200" r="178" fill="none" stroke="url(#wgold${k})" stroke-width="6"/>
    ${studs}
    ${seg}
    ${divs}
    <circle cx="200" cy="200" r="174" fill="none" stroke="#1a0d06" stroke-width="2" opacity=".6"/>
    <circle cx="200" cy="200" r="58" fill="url(#whub${k})"/>
    <circle cx="200" cy="200" r="58" fill="none" stroke="#3a2408" stroke-width="1.5" opacity=".6"/>
    <circle cx="200" cy="200" r="43" fill="url(#whubcap${k})"/>
    <circle cx="200" cy="200" r="43" fill="none" stroke="url(#wgold${k})" stroke-width="2.5"/>
    <circle cx="200" cy="200" r="31" fill="none" stroke="#3a2408" stroke-width="1.4" opacity=".55"/>
    <circle cx="200" cy="200" r="30" fill="none" stroke="#fff1c2" stroke-width=".8" opacity=".35"/>
    <circle cx="200" cy="201.2" r="11.5" fill="#2a1608" opacity=".55"/>
    <circle cx="200" cy="200" r="11" fill="url(#wstud${k})"/>
  </svg>`;
  const light = `<svg class="wheel2__light" viewBox="0 0 400 400" aria-hidden="true" focusable="false"><defs>
    <radialGradient id="wlit${k}" cx=".32" cy=".26" r=".85"><stop offset="0" stop-color="#fff6dc" stop-opacity=".34"/><stop offset=".45" stop-color="#fff6dc" stop-opacity=".04"/><stop offset=".8" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
    <linearGradient id="wgloss${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <circle cx="200" cy="200" r="199" fill="url(#wlit${k})"/>
    <path d="M60 150 A150 120 0 0 1 340 150 A170 70 0 0 0 60 150z" fill="url(#wgloss${k})"/></svg>`;
  const pointer = `<svg class="wheel2__pointer" viewBox="0 0 60 84" aria-hidden="true" focusable="false"><defs><linearGradient id="wptr${k}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a4e14"/><stop offset=".45" stop-color="#ffe9a8"/><stop offset=".6" stop-color="#d9a640"/><stop offset="1" stop-color="#5e3a0c"/></linearGradient></defs>
    <path d="M30 82 L12 26 A20 20 0 1 1 48 26z" fill="url(#wptr${k})" stroke="#3a2408" stroke-width="1.5"/><circle cx="30" cy="22" r="7" fill="#2a1608" stroke="#f3d98a" stroke-width="2"/></svg>`;
  return `<div class="wheel2" id="wheel" data-spot data-wheel>
  <div class="wheel2__stage">
    <span class="wheel2__shadow" aria-hidden="true"></span>
    <div class="wheel2__rot" data-wheel-rot>${svg}</div>
    ${light}
    ${pointer}
  </div>
  <div class="wheel2__txt">
    ${kicker('Every 1st of the month')}
    <h3>Spend $50 or more, <span class="acc">spin the wheel.</span></h3>
    <p>Includes both locations and delivery. **While supplies last!**</p>
  </div>
  <div class="wheel2__meta">
    <span class="wheel2__next" data-next-first>${icon('cal')}<span>Next spin: the 1st</span></span>
    <button type="button" class="btn btn--sm" data-wheel-spin><span>Give it a spin</span>${icon('wheel')}</button>
    <p class="wheel2__note" data-wheel-note hidden>Just for fun here. The real wheel comes out in the store on the 1st.</p>
  </div>
</div>`;
}

// ---------- staff picks: tall hero cards. The product breaks out of the top of the card, a category pill and the
// name, details from the live menu when the product is on today's shelf, and a "Picked by" strip with a round photo
// (or one uniform placeholder) and the action. ----------
const PICKS = JSON.parse(fs.readFileSync(new URL('../content/picks.json', import.meta.url), 'utf8'));
const PICK_CAT = {
  Flower: { art: 'cat-flower', glow: '#fdc232', href: '/a-all-flower-1/', label: 'flower' },
  Joints: { art: 'cat-prerolls', glow: '#e8732c', href: '/a-prerolls/', label: 'prerolls' },
  Carts: { art: 'cat-vape', glow: '#f2a93b', href: '/a-cartridges/', label: 'cartridges' },
  Dabs: { art: 'cat-concentrates', glow: '#fce594', href: '/a-concentrates/', label: 'concentrates' },
  Edibles: { art: 'cat-edibles', glow: '#c2622f', href: '/edibles/', label: 'edibles' },
  Drink: { art: 'cat-drinks', glow: '#d17f45', href: '/a-drinks/', label: 'drinks' },
};
const AVATAR_PH = '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" fill="#3a2418"/><circle cx="20" cy="15.5" r="6.6" fill="#c9b9a2" opacity=".6"/><path d="M6.5 37c1.9-7.8 7.2-11.4 13.5-11.4S31.6 29.2 33.5 37z" fill="#c9b9a2" opacity=".6"/></svg>';
export function staffPicks() {
  const cards = PICKS.picks.map((k, i) => {
    const c = PICK_CAT[k.cat]; const p = k.slug ? CATALOG.products[k.slug] : null;
    const thc = p ? thcOf(p.name) : null; const mg = p ? (p.name.match(/(\d{2,4})\s*mg\s*thc/i) || [])[1] : null; const t = p ? typeOf(p.name) : '';
    const art = p && fs.existsSync(new URL('../assets/img/picks/' + p.slug + '.webp', import.meta.url))
      ? `<img src="${asset('img/picks/' + p.slug + '.webp')}" alt="${esc(p.name)}" loading="lazy" decoding="async">`
      : img(c.art, { alt: '', sizes: '260px', pick: 1 });
    const who = k.house ? 'The house' : k.who;
    const av = k.photo ? img(k.photo, { alt: '', sizes: '44px', pick: 0 }) : AVATAR_PH;
    const stats = p ? `<p class="hcard__label">On today's menu</p>
      <div class="hcard__stats">
        ${t ? `<div class="hcard__row"><span>${icon('leaf')} Type</span><b>${t}</b></div>` : ''}
        ${thc ? `<div class="hcard__row"><span>${icon('flame')} THC</span><b>${thc}%</b></div><div class="hcard__bar"><i style="--v:${Math.min(100, Math.round(thc / (thc > 50 ? 95 : 40) * 100))}%"></i></div>` : ''}
        ${!thc && mg ? `<div class="hcard__row"><span>${icon('flame')} THC</span><b>${mg} mg</b></div>` : ''}
        <div class="hcard__row"><span>${icon('tag')} Price</span><b>${p.was ? `<s>${esc(p.was)}</s> ` : ''}${esc(p.price)}</b></div>
      </div>` : `<p class="hcard__label">The pick</p><p class="hcard__note">Not on the shelf today. Ask the counter what ${esc(k.who)} is into now, or browse the ${c.label}.</p>`;
    const cta = p ? `<a class="btn btn--sm hcard__cta" href="${SHOP.product(p.slug)}" target="_blank" rel="noopener"><span>Add to cart</span>${icon('bag')}</a>`
      : `<a class="btn btn--sm btn--ghost hcard__cta" href="${u(c.href)}"><span>Shop ${c.label}</span>${icon('arrow')}</a>`;
    return `<article class="hcard${p ? ' is-live' : ''}" style="--glow:${c.glow};--i:${i}">
      <div class="hcard__art">${art}</div>
      <div class="hcard__body">
        <span class="hcard__pill">${esc(k.cat)}${p ? ' <i>· in stock</i>' : ''}</span>
        <h3 class="hcard__name">${esc(k.item)}</h3>
        ${stats}
      </div>
      <div class="hcard__foot">
        <span class="hcard__who"><span class="hcard__av">${av}</span><span><small>Picked by</small><b>${esc(who)}</b></span></span>
        ${cta}
      </div>
    </article>`;
  }).join('');
  return `<div class="rail hrail" data-rail><div class="rail__track">${cards}</div>
  <div class="rail__nav"><button type="button" class="rail__btn" data-rail-prev aria-label="Previous pick">${icon('left')}</button><button type="button" class="rail__btn" data-rail-next aria-label="Next pick">${icon('right')}</button></div></div>
  <p class="board__src">Staff picks as published in California Leaf, ${esc(PICKS.asOf)}; stock and prices from today's live menu. Ask the counter what the team is into this week.</p>`;
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
  return `<figure class="slat ph ${cls}" data-ph>
  <span class="slat__img ph__img">${img(id, { alt, sizes })}</span>
  <span class="ph__sheen" aria-hidden="true"></span><span class="ph__mist" aria-hidden="true"></span><span class="ph__edge" aria-hidden="true"></span>
  ${caption ? `<figcaption>${caption}</figcaption>` : ''}
</figure>`;
}
export function marquee(words, cls = '') {
  const run = words.map((w) => `<span>${esc(w)}</span><i aria-hidden="true"></i>`).join('');
  return `<div class="marquee ${cls}" aria-hidden="true"><div class="marquee__track">${run}${run}${run}${run}</div></div>`;
}
export function aiNote(kind = 'edited') {
  return kind === 'edited' ? 'Photo: the store’s own courtyard photo, relit to dusk with AI.' : 'Illustrative image, AI-generated.';
}
