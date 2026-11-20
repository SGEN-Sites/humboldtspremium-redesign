// lab.mjs: /lab/fonts/, font pairing options for the owner (noindex like every preview page; not in the site map).
import { esc, u, icon, img } from '../lib/html.mjs';
import { FONT_CSS, FONT_OPTIONS } from '../content/fonts.mjs';

export default function lab() {
  const card = (o, i) => `<article class="spec fo-${o.id}">
  ${img(i % 2 ? 'courtyard-night' : 'courtyard-dusk', { alt: '', cls: 'spec__bg', sizes: '(max-width: 1000px) 100vw, 50vw', pick: 1 })}<div class="spec__shade"></div>
  <div class="spec__in">
    <p class="spec__tag">${esc(o.name)} <span>${esc(o.fonts)}</span></p>
    <p class="kicker"><span class="dot" aria-hidden="true"></span>Cannabis dispensary · Arcata, CA</p>
    <h2 class="spec__h1">Arcata's <span class="acc">Backyard.</span></h2>
    <p>Premium Humboldt cannabis, fair prices, and a fireside courtyard where you are welcome to stay a while. Built by a Humboldt family, farm to counter.</p>
    <div class="spec__row"><a class="btn" href="${u('/shop/?font=' + o.id)}"><span>Order ahead</span>${icon('arrow')}</a><a class="btn btn--ghost" href="${u('/courtyard-lounge/?font=' + o.id)}"><span>See the courtyard</span>${icon('arrow')}</a></div>
    <h3>Everything on the <span class="acc">slat wall.</span></h3>
    <p>Welcome to our Arcata location at 460 I St. Come in, shop the store or just say "Hi" to everyone.</p>
    <div class="spec__cards"><div class="spec__card"><small>59 products</small><b>Flower</b></div><div class="spec__card"><small>57 products</small><b>Cartridges</b></div><div class="spec__card"><small>65 products</small><b>Edibles</b></div></div>
    <p class="spec__why">${esc(o.why)}</p>
    <div class="spec__go"><a href="${u('/?font=' + o.id)}">See the whole site in this pairing</a><a href="${u('/about-us/?font=' + o.id)}">Our Story page</a></div>
  </div>
</article>`;
  return [{
    path: '/lab/fonts/', key: 'lab-fonts', lab: true, bodyClass: 'pg-lab',
    title: "Font pairing options | Humboldt's Premium Arcata preview",
    description: 'Font pairing options for the Humboldt’s Premium Arcata redesign, matched to the fonts the store already uses.',
    extraHead: `<link rel="stylesheet" href="${FONT_CSS}">`,
    body: `<section class="lab-hd wrap"><h1>Font pairing options</h1><p>The live site sets its text in Futura, one heading in Inknut Antiqua and the age check in EB Garamond; the logo pairs a Western display face (HUMBOLDT'S) with Roman capitals (PREMIUM). Each option below uses open fonts that stand in for those. Click <b>See the whole site in this pairing</b> to browse every page in it; a chip in the corner switches back.</p></section>
<section class="wrap lab-grid">${FONT_OPTIONS.map(card).join('')}</section>`,
  }];
}
