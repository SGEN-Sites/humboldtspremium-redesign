// layout.mjs: the page shell. Head + JSON-LD, splash, 21+ gate, promo/utility line, header with mega menus,
// drawer, footer, sticky pickup bar, scripts.
import { esc, u, asset, icon, img, imgSrc, btn, IMG } from './html.mjs';
import { store, NAV, MEGA, CATS, catCount, FACTS, SHOP, hoursShort, DAYS, LIVE } from '../content/site.mjs';

const SITE = 'https://www.humboldtspremiumarcata.com';
let BUILD = Date.now().toString(36);
export const setBuild = (b) => { BUILD = b; };

const logo = (cls = '', eager = false) => `<img class="logo-img ${cls}" src="${asset(IMG['logo-light'].variants[1].src)}" srcset="${IMG['logo-light'].variants.map((v) => `${asset(v.src)} ${v.w}w`).join(', ')}" sizes="(max-width: 760px) 132px, 168px" width="${IMG['logo-light'].variants[1].w}" height="${IMG['logo-light'].variants[1].h}" alt="Humboldt's Premium"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;

function jsonLd(p) {
  const blocks = [];
  const biz = {
    '@context': 'https://schema.org', '@type': ['Store', 'LocalBusiness'], '@id': SITE + '/#store',
    name: store.name, url: SITE + '/', telephone: store.phone, email: store.email, image: SITE + '/' + 'assets/' + IMG['courtyard-dusk'].variants[1].src,
    logo: SITE + '/assets/' + IMG.logo.png,
    address: { '@type': 'PostalAddress', streetAddress: store.street, addressLocality: store.city, addressRegion: store.region, postalCode: store.zip, addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: store.lat, longitude: store.lng },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '19:00' },
    ],
    paymentAccepted: 'Cash, Debit', currenciesAccepted: 'USD',
    sameAs: [store.social.instagram, store.social.facebook, store.social.tiktok],
  };
  if (p.schemaBiz) blocks.push(biz);
  if (p.crumbs && p.crumbs.length > 1) blocks.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: p.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: SITE + c[1] })) });
  if (p.faqLd && p.faqLd.length) blocks.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faqLd.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '') } })) });
  if (p.article) blocks.push({ '@context': 'https://schema.org', '@type': 'Article', headline: p.article.title, description: p.description, publisher: { '@id': SITE + '/#store' }, mainEntityOfPage: SITE + p.path });
  return blocks.map((b) => `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`).join('\n');
}

function megaPanel(key) {
  const m = MEGA[key];
  const col = (c) => `<div class="mega__col"><p class="mega__h">${esc(c.h)}</p><ul>${c.links.map((l) => {
    if (typeof l === 'string') { const cat = CATS[l]; return `<li><a href="${u('/' + l + '/')}"><span>${esc(cat.name)}</span><span class="mega__n">${catCount(l)}</span></a></li>`; }
    return `<li><a href="${esc(u(l[1]))}"><span>${esc(l[0])}</span></a></li>`;
  }).join('')}</ul></div>`;
  let side = '';
  if (key === 'shop') side = `<div class="mega__side"><a class="mega__card mega__card--feel" href="${u('/shop/')}">${img('cat-humboldt', { sizes: '160px', cls: 'mega__art', alt: '' })}<span class="mega__card-k">All ${catCount('shop')} products</span><span class="mega__card-t">Shop the whole menu</span><span class="mega__card-s">Prices from the live store. Add to cart opens your bag.</span></a><div class="mega__feel">${[['Relax', 'a-indica-flower'], ['Balance', 'a-hybrid-flower'], ['Uplift', 'a-sativa-flower']].map(([f, s]) => `<a href="${u('/' + s + '/')}" class="chip chip--sun">${f}</a>`).join('')}<a href="${u('/a-sale-items/')}" class="chip chip--ember">${icon('tag')}Sale items</a></div></div>`;
  if (key === 'visit') side = `<div class="mega__side"><a class="mega__card" href="${u('/arcata-details/')}">${img('storefront-dusk', { sizes: '260px', cls: 'mega__photo', alt: 'The store at dusk' })}<span class="mega__card-t">460 I St, Arcata</span><span class="mega__card-s">${esc(store.corner)}</span></a></div>`;
  if (key === 'lounge') side = `<div class="mega__side"><a class="mega__card" href="${u('/courtyard-lounge/')}">${img('courtyard-night', { sizes: '260px', cls: 'mega__photo', alt: 'The courtyard at night' })}<span class="mega__card-k">Approved Nov 10, 2026</span><span class="mega__card-t">Arcata's outdoor smoking lounge</span><span class="mega__card-s">Gazebos, fire and a rock waterfall by Jolly Giant Creek.</span></a></div>`;
  if (key === 'learn') side =`<div class="mega__side"><a class="mega__card" href="${u('/learn/')}">${img('redwood-fog', { sizes: '260px', cls: 'mega__photo', alt: '' })}<span class="mega__card-t">The Learn hub</span><span class="mega__card-s">Plain guides from the counter.</span></a></div>`;
  return `<div class="mega" id="mega-${key}" data-mega-panel="${key}" hidden><div class="mega__in wrap">${m.cols.map(col).join('')}${side}</div></div>`;
}

const dealsData = () => esc(JSON.stringify(FACTS.dailyDeals.value));

function utility() {
  const promos = [
    `<span class="promo" data-today-deal>${icon('tag')}<b>Daily deals</b> every day of the week <a href="${u('/deals/')}">See today</a></span>`,
    `<span class="promo">${icon('wheel')}<b>Spin the wheel</b> on the 1st of the month with $50 or more <a href="${u('/deals/#wheel')}">How it works</a></span>`,
    `<span class="promo">${icon('truck')}<b>Free Home Delivery</b> from Trinidad to Rio Dell <a href="${u('/delivery/')}">Delivery</a></span>`,
    `<span class="promo">${icon('flame')}<b>Outdoor smoking lounge approved</b> for the courtyard <a href="${u('/courtyard-lounge/')}">The news</a></span>`,
  ];
  return `<div class="util" data-util>
  <div class="util__in wrap">
    <div class="util__rot" data-rotator aria-live="polite" data-deals="${dealsData()}">${promos.map((p, i) => `<div class="util__slide${i ? '' : ' is-on'}">${p}</div>`).join('')}</div>
    <div class="util__right"><span class="status" data-open-status>${icon('clock')}<span class="status__txt">Mon to Sat 9 AM to 9 PM · Sun 10 AM to 7 PM</span></span><span class="util__lic">Lic. ${esc(store.license)}</span></div>
  </div></div>`;
}

function header(p) {
  const cur = (href) => (p.path === href || (href !== '/' && p.path.startsWith(href)) || (p.navKey && p.navKey === href) ? ' aria-current="page"' : '');
  return `<header class="hdr" data-hdr>
  <div class="hdr__in wrap">
    <a class="hdr__logo" href="${u('/')}" aria-label="Humboldt's Premium Arcata, home">${logo('', true)}</a>
    <nav class="nav" aria-label="Main">
      <ul class="nav__list">${NAV.map((n) => `<li class="nav__item${n.mega ? ' has-mega' : ''}"><a class="nav__a${n.hot ? ' nav__a--hot' : ''}" href="${u(n.href)}"${cur(n.href)}${n.mega ? ` data-mega="${n.mega}" aria-expanded="false" aria-controls="mega-${n.mega}"` : ''}>${n.hot ? '<span class="nav__ember" aria-hidden="true"></span>' : ''}${esc(n.label)}${n.mega ? icon('chev', 'nav__chev') : ''}</a></li>`).join('')}</ul>
    </nav>
    <div class="hdr__act">
      <a class="hdr__icon" href="tel:${store.tel}" aria-label="Call the Arcata store, ${store.phone}">${icon('phone')}</a>
      <a class="hdr__icon" href="${SHOP.search}" target="_blank" rel="noopener" aria-label="Search the live menu (opens the live store)">${icon('search')}</a>
      <a class="hdr__icon hdr__bag" href="${SHOP.cart}" target="_blank" rel="noopener" aria-label="Your bag (opens the live store cart)">${icon('bag')}</a>
      ${btn('Order ahead', '/shop/', { cls: 'btn--sm hdr__cta' })}
      <button class="hdr__burger" type="button" data-drawer-open aria-controls="drawer" aria-expanded="false"><span class="sr-only">Menu</span>${icon('menu')}</button>
    </div>
  </div>
  ${Object.keys(MEGA).map(megaPanel).join('')}
</header>`;
}

function drawer() {
  const grp = (h, items) => `<details class="drw__grp"><summary>${esc(h)}${icon('chev')}</summary><ul>${items.map(([l, href, n]) => `<li><a href="${esc(u(href))}">${esc(l)}${n ? `<span class="mega__n">${n}</span>` : ''}</a></li>`).join('')}</ul></details>`;
  const shopItems = Object.entries(CATS).map(([s, c]) => [c.name, '/' + s + '/', catCount(s)]);
  return `<div class="drw" id="drawer" data-drawer hidden>
  <div class="drw__scrim" data-drawer-close></div>
  <div class="drw__panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="drw__top">${logo()}<button class="drw__x" type="button" data-drawer-close aria-label="Close menu">${icon('close')}</button></div>
    <a class="drw__big" href="${u('/shop/')}">Shop all ${catCount('shop')} products ${icon('arrow')}</a>
    ${grp('Shop by category', shopItems)}
    <ul class="drw__main">${NAV.slice(1).map((n) => `<li><a href="${u(n.href)}">${esc(n.label)}${icon('arrow')}</a></li>`).join('')}</ul>
    ${grp('Visit & delivery', MEGA.visit.cols.flatMap((c) => c.links))}
    ${grp('Learn', MEGA.learn.cols.flatMap((c) => c.links))}
    <div class="drw__foot"><a class="btn btn--block-sm" href="${SHOP.cart}" target="_blank" rel="noopener"><span>Your bag</span>${icon('bag')}</a><a class="btn btn--ghost btn--block-sm" href="tel:${store.tel}"><span>Call ${store.phone}</span>${icon('phone')}</a></div>
  </div></div>`;
}

function gate() {
  return `<div class="gate" data-gate hidden role="dialog" aria-modal="true" aria-labelledby="gate-t">
  <div class="gate__bg" aria-hidden="true">${img('courtyard-night', { sizes: '100vw', alt: '', cls: 'gate__img' })}<div class="gate__fog fog-drift"></div></div>
  <div class="gate__card glass">
    ${logo('gate__logo')}
    <p class="kicker"><span class="dot" aria-hidden="true"></span>Arcata Age Check</p>
    <h2 id="gate-t" class="gate__h">Pull up a chair. <span class="acc">First, are you 21?</span></h2>
    <p class="gate__p">Humboldt's Premium Arcata is for adults 21 and over. ID is required in store: no ID, no sale.</p>
    <div class="gate__btns"><button class="btn" type="button" data-gate-yes><span>"YES" I am 21 or over</span>${icon('arrow')}</button><button class="btn btn--ghost" type="button" data-gate-no><span>"NO" I am under 21</span></button></div>
    <p class="gate__no" data-gate-msg hidden>Thanks for being honest. Come back and see us when you are 21.</p>
    <p class="gate__fine">By entering you agree you are of legal age to view cannabis content in California. Lic. ${esc(store.license)}</p>
  </div></div>`;
}

function splash() {
  return `<div class="splash" data-splash hidden aria-hidden="true">
  <div class="splash__fog"></div>
  <svg class="splash__sun" viewBox="0 0 200 110" aria-hidden="true"><defs><radialGradient id="sg" cx="50%" cy="100%" r="90%"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#fdc232"/><stop offset="1" stop-color="#e8732c" stop-opacity="0"/></radialGradient></defs>
    <g class="splash__rays">${Array.from({ length: 13 }, (_, i) => { const a = Math.PI * (i / 12); const x = 100 - Math.cos(a) * 96, y = 104 - Math.sin(a) * 96; return `<line x1="100" y1="104" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`; }).join('')}</g>
    <path class="splash__arc" d="M8 104a92 92 0 0 1 184 0"/><circle class="splash__core" cx="100" cy="104" r="34" fill="url(#sg)"/>
    <path class="splash__tree" d="M100 30l-9 18h5l-8 14h6l-9 16h11v26h8V78h11l-9-16h6l-8-14h5z"/>
  </svg>
  <p class="splash__word">Arcata's <span class="acc">Backyard</span></p>
  <canvas class="splash__embers" data-splash-embers></canvas>
</div>`;
}

function footer() {
  const col = (h, links) => `<div class="ft__col"><p class="ft__h">${esc(h)}</p><ul>${links.map(([l, href]) => `<li><a href="${esc(u(href))}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''}>${esc(l)}</a></li>`).join('')}</ul></div>`;
  return `<footer class="ft" data-footer>
  <div class="ft__glow" aria-hidden="true"></div>
  <div class="ft__top wrap">
    <div class="ft__brand">
      <a href="${u('/')}" class="ft__logo" aria-label="Home">${logo()}</a>
      <p class="ft__line">Arcata's backyard. Premium Humboldt cannabis, a fireside courtyard, and a family that has worked every step from farm to counter.</p>
      <address class="ft__nap"><strong>${esc(store.name)}</strong><br>${esc(store.street)}, ${esc(store.city)}, ${store.region} ${store.zip}<br>${esc(store.corner)}<br><a href="tel:${store.tel}">${store.phone}</a> · <a href="mailto:${store.email}">${store.email}</a></address>
      <ul class="ft__hours">${hoursShort.map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join('')}</ul>
      <div class="ft__social"><a href="${store.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('insta')}</a><a href="${store.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon('fb')}</a><a href="${store.social.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${icon('tiktok')}</a><a href="${store.reviews}" target="_blank" rel="noopener" aria-label="Google reviews">${icon('google')}</a></div>
    </div>
    ${col('Shop', [['All products', '/shop/'], ['Flower', '/a-all-flower-1/'], ['Prerolls', '/a-prerolls/'], ['Cartridges', '/a-cartridges/'], ['Concentrates', '/a-concentrates/'], ['Edibles', '/edibles/'], ['Drinks', '/a-drinks/'], ['Sale items', '/a-sale-items/']])}
    ${col('Visit', [['Hours & policies', '/arcata-details/'], ['Free home delivery', '/delivery/'], ['Our two stores', '/locations/'], ['Contact', '/contact/'], ['Before or after the Marsh', '/arcata-marsh/'], ['Eureka store', store.eureka.site]])}
    ${col('The backyard', [['Courtyard & Lounge', '/courtyard-lounge/'], ['What\u2019s on', '/whats-on/'], ['Daily deals', '/deals/'], ['Our story', '/about-us/'], ['Join the team', '/about-us/#join']])}
    ${col('Learn', [['Learn hub', '/learn/'], ['First visit', '/learn/first-visit/'], ['Edibles & drinks', '/learn/edibles-and-drinks/'], ['California laws', '/learn/california-cannabis-laws/'], ['Glossary', '/learn/glossary/'], ['FAQ', '/faq/'], ['Site map', '/sitemap/']])}
  </div>
  <div class="ft__legal wrap">
    <div class="ft__warn"><strong>For adults 21 and over.</strong> Keep cannabis out of reach of children and pets. Do not drive or operate machinery under the influence. Consume only where it is allowed.</div>
    <p>${esc(FACTS.legal.value)} · License# ${esc(store.license)} · ${esc(store.street)}, Arcata, CA ${store.zip}</p>
    <p class="ft__preview">Design concept preview, not the official ${esc(store.short)} website. Shop and cart buttons open the live store. Some imagery is AI-generated or AI-relit from the store's own photos and is labelled as such.</p>
  </div>
</footer>`;
}

function stickyBar() {
  return `<div class="stk" data-sticky hidden>
  <div class="stk__in">
    <span class="stk__flame" aria-hidden="true">${icon('flame')}</span>
    <p class="stk__txt"><strong>Pick up at 460 I St</strong><span class="stk__status" data-open-status-short>Open today</span></p>
    <div class="stk__btns"><a class="btn btn--sm stk__go" href="${u('/shop/')}" data-magnet><span>Order ahead</span>${icon('arrow')}</a><a class="btn btn--sm btn--ghost stk__call" href="tel:${store.tel}"><span>Call</span>${icon('phone')}</a></div>
    <button class="stk__x" type="button" data-sticky-close aria-label="Hide this bar for this visit">${icon('close')}</button>
  </div></div>`;
}

export function layout(p, ctx) {
  const title = p.title;
  const canon = SITE + (p.canonical || p.path);
  const robots = ctx.preview ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow">';
  const og = p.ogImage ? imgSrc(p.ogImage, 1400) : imgSrc('courtyard-dusk', 1600);
  const bodyCls = ['pg', p.bodyClass || '', p.dark === false ? 'pg--light' : ''].join(' ').trim();
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}">
${robots}
<link rel="canonical" href="${esc(canon)}">
${p.refresh ? `<meta http-equiv="refresh" content="0; url=${esc(u(p.refresh))}">` : ''}
<meta property="og:type" content="website"><meta property="og:site_name" content="Humboldt's Premium Arcata"><meta property="og:title" content="${esc(p.ogTitle || title)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${esc(canon)}"><meta property="og:image" content="${esc(og)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#120c08">
<link rel="icon" type="image/png" href="${asset('img/favicon.png')}">
<link rel="preload" href="${asset('fonts/fraunces-roman.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${asset('fonts/figtree-roman.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset('css/site.css')}?v=${BUILD}">
<script>document.documentElement.classList.replace('no-js','js');try{if(!localStorage.getItem('hp.age'))document.documentElement.classList.add('gate-pending');if(!sessionStorage.getItem('hp.splash')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!/[?&]splash=off/.test(location.search))document.documentElement.classList.add('splash-pending')}catch(e){}</script>
${jsonLd(p)}
</head>
<body class="${bodyCls}" data-page="${esc(p.key || p.path)}">
<a class="skip" href="#main">Skip to content</a>
${splash()}
${utility()}
${header(p)}
${drawer()}
<main id="main" tabindex="-1">
${p.body}
</main>
${footer()}
${stickyBar()}
${gate()}
<div class="cursor-light" data-cursor-light aria-hidden="true"></div>
<script src="${asset('js/site.js')}?v=${BUILD}" defer></script>
<script src="${asset('js/fx.js')}?v=${BUILD}" defer></script>
</body>
</html>
`;
}
