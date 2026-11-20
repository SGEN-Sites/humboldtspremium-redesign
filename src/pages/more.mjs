// more.mjs: /deals/, the Learn hub + articles + glossary, /arcata-home/ (forwarding), /sitemap/, 404.
import { esc, u, icon, img, btn, kicker, linkArrow, acc, md } from '../lib/html.mjs';
import { store, FACTS, LEARN, CATALOG, catCount, CATS } from '../content/site.mjs';
import { pageHero, fog, embers, dealsBoard, promoCards, wheelCard, productGrid, ctaBand, faqList } from '../lib/parts.mjs';

const HERO_IMG = { redwood: 'redwood-fog', marsh: 'marsh-golden', fire: 'fire-table', fog: 'fog-hills', courtyard: 'courtyard-dusk', flower: 'interior-counter', prerolls: 'interior-wide', vape: 'interior-wide', concentrates: 'interior-counter', edibles: 'interior-wide', drinks: 'interior-wide', tinctures: 'interior-counter', topicals: 'interior-counter', cbd: 'interior-counter' };
const ART = { flower: 'cat-flower', prerolls: 'cat-prerolls', vape: 'cat-vape', concentrates: 'cat-concentrates', edibles: 'cat-edibles', drinks: 'cat-drinks', tinctures: 'cat-tinctures', topicals: 'cat-topicals', cbd: 'cat-cbd', redwood: 'cat-humboldt', marsh: 'cat-humboldt', fire: 'cat-drinks', fog: 'cat-flower', courtyard: 'cat-drinks' };

function deals() {
  const sale = CATALOG.categories.find((c) => c.slug === 'a-sale-items');
  const body = `
${pageHero({ kicker: 'Deals', title: 'Something good *every day.*', lead: 'The Arcata daily deals board, this month’s promotions, the wheel on the 1st and everything on sale right now.', image: 'interior-wide', crumbs: [['Home', '/'], ['Deals', '/deals/']], actions: btn('Shop sale items', '/a-sale-items/') + btn('View your bag', 'https://www.humboldtspremiumarcata.com/cart-page', { kind: 'ghost', ic: 'bag' }), variant: 'phero--shop', art: `<div class="phero__art" data-depth="-0.12">${img('cat-prerolls', { alt: '', sizes: '320px', eager: true, pick: 1 })}</div>` })}
<section class="band band--lit" id="daily" data-spot style="--lx:80%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span>${embers(18)}</div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('Daily deals')}<h2>${acc('Today is *lit up.*')}</h2></div><p class="lead">Monday through Sunday, as posted by the Arcata store.</p></div>
    <div data-reveal>${dealsBoard()}</div>
  </div>
</section>
<section class="band" id="month" data-spot style="--lx:20%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('This month')}<h2>${acc(`${FACTS.monthPromos.month} *promotions.*`)}</h2></div></div>
    <div data-reveal>${promoCards()}</div>
  </div>
</section>
<section class="band band--lit" data-spot style="--lx:70%;--ly:20%"><div class="band__clip"><span class="key-light"></span></div><div class="wrap" data-reveal>${wheelCard()}</div></section>
<section class="band shop-band" id="sale" data-spot style="--lx:85%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('On sale now')}<h2>${acc(`${sale.count} items, *marked down.*`)}</h2></div>${linkArrow('Open the sale page', '/a-sale-items/')}</div>
    ${productGrid(sale.products, { id: 'grid-deals', tools: false, limit: 24 })}
  </div>
</section>
${ctaBand({ title: 'Deals taste better *by the fire.*', image: 'courtyard-night' })}`;
  return { path: '/deals/', key: 'deals', bodyClass: 'pg-deals', title: "Daily Cannabis Deals in Arcata | Humboldt's Premium Arcata", description: 'Daily deals at Humboldt’s Premium Arcata: $2 HP prerolls, $10 Widowmaker Gold, quarter zips and more, plus monthly promos and Spin the Wheel on the 1st.', crumbs: [['Home', '/'], ['Deals', '/deals/']], ogImage: 'interior-wide', body };
}

function learnHub() {
  const arts = LEARN.articles || [];
  const body = `
${pageHero({ kicker: 'Learn', title: 'Plain guides *from the counter.*', lead: 'What the labels mean, how each format works, edibles without the guesswork, courtyard manners and California’s rules. Short reads, no jargon.', image: 'redwood-fog', crumbs: [['Home', '/'], ['Learn', '/learn/']], pos: '70% center' })}
<section class="band band--lit" data-spot style="--lx:80%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap">
    <div class="guides">${arts.map((a, i) => `<a class="guide glass${i === 0 ? ' guide--lead' : ''}" href="${u('/learn/' + a.slug + '/')}" data-reveal data-spot data-tilt style="--i:${i}">
      <span class="guide__art">${img(ART[a.hero] || 'cat-flower', { alt: '', sizes: '200px', pick: 0 })}</span>
      <span class="guide__k">${esc(a.kicker)} · ${a.readMins} min read</span><span class="guide__t">${esc(a.title)}</span><span class="guide__d">${esc(a.dek)}</span><span class="guide__go">Read ${icon('arrow')}</span></a>`).join('')}
      <a class="guide glass guide--gloss" href="${u('/learn/glossary/')}" data-reveal data-spot><span class="guide__k">Reference · ${(LEARN.glossary || []).length} terms</span><span class="guide__t">The glossary</span><span class="guide__d">From THCA to dry sift, in a sentence or two.</span><span class="guide__go">Look it up ${icon('arrow')}</span></a>
    </div>
  </div>
</section>
${ctaBand({ title: 'Questions? *Ask the counter.*', lead: 'Our budtenders are happy to help. Call 707-630-4098 or stop by 460 I St.', image: 'interior-wide', actions: btn('Read the FAQ', '/faq/') + btn('Shop the menu', '/shop/', { kind: 'ghost' }) })}`;
  return { path: '/learn/', key: 'learn', bodyClass: 'pg-learn', title: "Learn: Cannabis Guides | Humboldt's Premium Arcata", description: 'Plain cannabis guides from the Humboldt’s Premium counter: indica vs sativa, every format, edibles and drinks, CBD and CBN, courtyard manners and California law.', crumbs: [['Home', '/'], ['Learn', '/learn/']], ogImage: 'redwood-fog', body };
}

function article(a, all) {
  const rel = (a.related || []).map((s) => all.find((x) => x.slug === s)).filter(Boolean).slice(0, 3);
  const body = `
${pageHero({ kicker: `${a.kicker} · ${a.readMins} min read`, title: a.title, lead: esc(a.dek), image: HERO_IMG[a.hero] || 'redwood-fog', crumbs: [['Home', '/'], ['Learn', '/learn/'], [a.title, '/learn/' + a.slug + '/']], variant: 'phero--article' })}
<section class="band band--lit art-band" data-spot style="--lx:85%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap art">
    <article class="art__body prose" data-reveal>${md(a.body)}</article>
    <aside class="art__side">
      ${a.takeaways && a.takeaways.length ? `<div class="glass art__card"><p class="art__card-h">${icon('spark')} The short version</p><ul>${a.takeaways.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
      ${a.shop && a.shop.length ? `<div class="glass art__card"><p class="art__card-h">${icon('bag')} Shop this guide</p>${a.shop.map((s) => linkArrow(s.label, s.href)).join('')}</div>` : ''}
      <div class="glass art__card art__card--art">${img(ART[a.hero] || 'cat-flower', { alt: '', sizes: '240px', pick: 1 })}</div>
    </aside>
  </div>
</section>
${rel.length ? `<section class="band"><div class="wrap"><div class="section-head">${kicker('Keep reading')}<h2>${acc('More *from the counter.*')}</h2></div><div class="guides guides--3">${rel.map((r, i) => `<a class="guide glass" href="${u('/learn/' + r.slug + '/')}" data-spot data-tilt style="--i:${i}"><span class="guide__art">${img(ART[r.hero] || 'cat-flower', { alt: '', sizes: '200px', pick: 0 })}</span><span class="guide__k">${esc(r.kicker)}</span><span class="guide__t">${esc(r.title)}</span><span class="guide__go">Read ${icon('arrow')}</span></a>`).join('')}</div></div></section>` : ''}
${ctaBand({ image: 'courtyard-dusk' })}`;
  return { path: `/learn/${a.slug}/`, key: 'learn-' + a.slug, bodyClass: 'pg-article', title: a.metaTitle || `${a.title} | Humboldt's Premium Arcata`, description: a.description, crumbs: [['Home', '/'], ['Learn', '/learn/'], [a.title, `/learn/${a.slug}/`]], ogImage: HERO_IMG[a.hero] || 'redwood-fog', article: a, body };
}

function glossary() {
  const g = [...(LEARN.glossary || [])].sort((a, b) => a.term.localeCompare(b.term));
  const letters = [...new Set(g.map((x) => x.term[0].toUpperCase()))];
  const body = `
${pageHero({ kicker: 'Glossary', title: 'Say it like *a budtender.*', lead: `${g.length} terms you will hear at the counter, in a sentence or two each.`, image: 'interior-counter', crumbs: [['Home', '/'], ['Learn', '/learn/'], ['Glossary', '/learn/glossary/']] })}
<section class="band band--lit" data-spot style="--lx:80%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <nav class="gloss__az" aria-label="Jump to letter">${letters.map((l) => `<a href="#g-${l}">${l}</a>`).join('')}</nav>
    <dl class="gloss">${letters.map((l) => `<div class="gloss__grp" id="g-${l}"><p class="gloss__l">${l}</p>${g.filter((x) => x.term[0].toUpperCase() === l).map((x) => `<div class="gloss__item"><dt>${esc(x.term)}</dt><dd>${esc(x.def)}</dd></div>`).join('')}</div>`).join('')}</dl>
  </div>
</section>`;
  return { path: '/learn/glossary/', key: 'glossary', bodyClass: 'pg-gloss', title: "Cannabis Glossary | Humboldt's Premium Arcata", description: 'A plain cannabis glossary from the Humboldt’s Premium Arcata counter: THCA, terpenes, live resin, rosin, badder, diamonds, dry sift, AIO and more.', crumbs: [['Home', '/'], ['Learn', '/learn/'], ['Glossary', '/learn/glossary/']], ogImage: 'interior-counter', body };
}

function arcataHome() {
  // The live /arcata-home was the old home page; its words now live on the new home. This URL forwards there.
  return { path: '/arcata-home/', key: 'arcata-home', refresh: '/', canonical: '/', bodyClass: 'pg-fwd', title: "Arcata Home | Humboldt's Premium Arcata", description: 'Humboldt’s Premium Arcata home page: 460 I St, on the corner of I St and Samoa Blvd.', body: `<section class="band"><div class="wrap center"><h1>${acc('Arcata *Home*')}</h1><p class="lead">Welcome to our Arcata location at 460 I St. This page moved to our <a href="${u('/')}">home page</a>.</p>${btn('Go to the home page', '/')}</div></section>` };
}

export function sitemapPage(pages) {
  const groups = [['Shop', (p) => p.key && (p.key === 'shop' || p.key.startsWith('cat-') || p.key === 'deals')], ['The backyard', (p) => ['courtyard', 'whats-on', 'story'].includes(p.key)], ['Visit & delivery', (p) => ['visit', 'delivery', 'locations', 'contact', 'marsh', 'faq'].includes(p.key) || (p.key || '').startsWith('town-')], ['Learn', (p) => (p.key || '').startsWith('learn') || p.key === 'glossary'], ['Home', (p) => p.key === 'home']];
  const body = `
${pageHero({ kicker: 'Site map', title: 'Every page, *one list.*', image: 'fog-hills', crumbs: [['Home', '/'], ['Site map', '/sitemap/']] })}
<section class="band"><div class="wrap smap">${groups.map(([h, f]) => `<div class="smap__col"><h2>${h}</h2><ul>${pages.filter(f).map((p) => `<li><a href="${u(p.path)}">${esc(p.title.split(' | ')[0])}</a></li>`).join('')}</ul></div>`).join('')}</div></section>`;
  return { path: '/sitemap/', key: 'sitemap', bodyClass: 'pg-smap', title: "Site Map | Humboldt's Premium Arcata", description: 'Every page on the Humboldt’s Premium Arcata site: shop categories, deals, the courtyard, our story, delivery towns, learn guides and the FAQ.', crumbs: [['Home', '/'], ['Site map', '/sitemap/']], body };
}
export function notFound() {
  return { path: '/404/', file: '404.html', key: '404', bodyClass: 'pg-404', title: "Lost in the fog | Humboldt's Premium Arcata", description: 'This page drifted off into the fog.', body: `
<section class="nf" data-spot><div class="band__clip">${img('fog-hills', { alt: '', cls: 'band__bg', sizes: '100vw' })}<div class="phero__scrim"></div>${fog('fog--hero')}${embers(30)}</div>
<div class="wrap nf__in"><p class="nf__code">404</p><h1>${acc('Lost in *the fog.*')}</h1><p class="lead">This page drifted off. The courtyard is still right where we left it.</p><div class="actions">${btn('Back to the backyard', '/')}${btn('Shop the menu', '/shop/', { kind: 'ghost' })}</div></div></section>` };
}

export default function more() {
  const arts = LEARN.articles || [];
  return [deals(), learnHub(), ...arts.map((a) => article(a, arts)), glossary(), arcataHome()];
}
