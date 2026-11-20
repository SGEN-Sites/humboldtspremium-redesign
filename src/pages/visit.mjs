// visit.mjs: /arcata-details/ (live words verbatim), delivery + town pages, locations, contact, the Marsh, FAQ.
import { esc, u, icon, img, btn, kicker, linkArrow, acc, md } from '../lib/html.mjs';
import { store, FACTS, LEARN, deliveryTowns, catCount } from '../content/site.mjs';
import { pageHero, fog, embers, hoursList, mapEmbed, visitBand, faqList, ctaBand, catFlow, slatPhoto } from '../lib/parts.mjs';

function details() {
  const pol = FACTS.policies.value;
  const body = `
${pageHero({ kicker: 'Arcata Details', title: 'Hours, payments *and the fine print.*', lead: 'Welcome to our Arcata location at 460 I St (On the corner of I St. and Samoa Blvd.).', image: 'storefront-dusk', crumbs: [['Home', '/'], ['Visit', '/arcata-details/']], actions: btn('Get directions', store.directions) + btn('Call 707-630-4098', 'tel:' + store.tel, { kind: 'ghost', ic: 'phone' }), pos: 'center 40%' })}
<section class="band band--lit details" data-spot style="--lx:85%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap details__grid">
    <div class="details__hours glass" data-reveal>
      <h2 class="details__h">${icon('clock')} Arcata Store Hours:</h2>
      ${hoursList('hours--big')}
      <p class="status status--big" data-open-status>${icon('clock')}<span class="status__txt">Checking today’s hours</span></p>
    </div>
    <div class="details__copy" data-reveal>
      <p class="lead">Online orders can be placed by visiting the "Shop" page or phone in orders by calling 707-630-4098.</p>
      <div class="details__cards">
        <div class="dcard">${icon('cash')}<p>WE ARE ACCEPTING CASH AND DEBIT ($3.00 fee) PAYMENTS (SORRY, NO CREDIT)</p></div>
        <div class="dcard">${icon('id')}<p>ID is required NO ID, NO SALE!</p></div>
        <div class="dcard">${icon('tag')}<p>${esc(pol[0])}</p></div>
      </div>
      <h3>Exchanges and store policies</h3>
      <ul class="policy">${pol.slice(1).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <p class="details__claim">${esc(FACTS.claims.value[0])}</p>
      <p class="details__claim details__claim--sm">${esc(FACTS.claims.value[1])}</p>
      <div class="actions">${btn('Shop now', '/shop/')}${btn('Free home delivery', '/delivery/', { kind: 'ghost' })}</div>
    </div>
  </div>
</section>
<section class="band getting-here" data-spot style="--lx:15%;--ly:20%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap gh__grid">
    <div data-reveal>
      ${kicker('Getting here')}
      <h2>${acc('Click the map, *get ready to be directed.*')}</h2>
      <p class="lead">Click on the car and get ready to be directed to our location with a map! We are at 460 I St, on the corner of I St. and Samoa Blvd.</p>
      <ul class="gh__list">
        <li>${icon('pin')}<span><b>From Samoa Blvd (Hwy 255)</b> turn onto I St; we are right on the corner.</span></li>
        <li>${icon('walk')}<span><b>From the Arcata Marsh</b> head north toward Samoa Blvd: the courtyard is a natural stop before or after your walk.</span></li>
        <li>${icon('tree')}<span><b>From Cal Poly Humboldt</b> make your way through town to I St and follow it south to Samoa Blvd.</span></li>
      </ul>
      <div class="actions">${btn('Open in Google Maps', store.directions)}</div>
    </div>
    <div data-reveal>${mapEmbed('map--tall')}</div>
  </div>
</section>
${ctaBand({ title: 'Come in, *say "Hi."*', lead: 'Come in, shop the store or just say "Hi" to everyone.', image: 'courtyard-dusk' })}`;
  return {
    path: '/arcata-details/', key: 'visit', bodyClass: 'pg-visit', schemaBiz: true,
    title: "Arcata Store Hours, Payments & Directions | Humboldt's Premium",
    description: 'Humboldt’s Premium Arcata, 460 I St on the corner of I St and Samoa Blvd. Open Mon to Sat 9am to 9pm, Sun 10am to 7pm. Cash and debit, ID required.',
    crumbs: [['Home', '/'], ['Visit', '/arcata-details/']], ogImage: 'storefront-dusk', body,
  };
}

function delivery() {
  const towns = FACTS.deliveryTowns.value;
  const body = `
${pageHero({ kicker: 'Free Home Delivery', title: 'From Trinidad *to Rio Dell.*', lead: 'We also offer delivery service from Trinidad to Rio Dell. Call it in, or ask about delivery when you order.', image: 'fog-hills', crumbs: [['Home', '/'], ['Delivery', '/delivery/']], actions: btn('Call 707-630-4098', 'tel:' + store.tel, { ic: 'phone' }) + btn('Email delivery', 'mailto:' + store.deliveryEmail, { kind: 'ghost', ic: 'mail' }) })}
<section class="band band--lit" id="towns" data-spot style="--lx:80%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('Delivery towns')}<h2>${acc('Across *Humboldt County.*')}</h2></div><p class="lead">Arcata, Eureka, McKinleyville, Ferndale, Fortuna, Blue Lake and Carlotta, with service from Trinidad to Rio Dell.</p></div>
    <div class="towns">
      <a class="town glass town--home" href="${u('/arcata-details/')}" data-reveal data-spot><span class="town__k">Home base</span><span class="town__n">Arcata</span><span class="town__s">Pickup at 460 I St, or delivery around town.</span>${icon('arrow')}</a>
      ${deliveryTowns.map((t, i) => `<a class="town glass" href="${u('/delivery/' + t.slug + '/')}" data-reveal data-spot style="--i:${i}"><span class="town__k">Delivery</span><span class="town__n">${esc(t.name)}</span><span class="town__s">${esc(t.note)}</span>${icon('arrow')}</a>`).join('')}
    </div>
  </div>
</section>
<section class="band how" data-spot style="--lx:20%;--ly:20%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('How it works')}<h2>${acc('Three steps *to your door.*')}</h2></div></div>
    <ol class="how__steps">
      <li class="glass" data-reveal style="--i:0"><span class="how__n">1</span><h3>Pick your products</h3><p>Browse the menu: every category page lists what is on the shelf right now.</p>${linkArrow('Shop the menu', '/shop/')}</li>
      <li class="glass" data-reveal style="--i:1"><span class="how__n">2</span><h3>Call or email it in</h3><p>Call 707-630-4098 or email ${esc(store.deliveryEmail)} with your order and address.</p></li>
      <li class="glass" data-reveal style="--i:2"><span class="how__n">3</span><h3>Have your ID ready</h3><p>21 and over only. ID is required NO ID, NO SALE! No sales to parking lots or alleyways or other public areas.</p></li>
    </ol>
    <p class="tiny">Delivery hours, minimums and zones are confirmed by phone; ask the store when you order.</p>
  </div>
</section>
${ctaBand({ title: 'Or pick it up *by the fire.*', lead: 'Order ahead and pick up at 460 I St, then stay a while in the courtyard.', image: 'courtyard-night' })}`;
  const townPages = deliveryTowns.map((t) => ({
    path: `/delivery/${t.slug}/`, key: 'town-' + t.slug, bodyClass: 'pg-town',
    title: `Cannabis Delivery to ${t.name}, CA | Humboldt's Premium Arcata`,
    description: `Free home delivery of Humboldt cannabis to ${t.name} from Humboldt's Premium Arcata. Flower, prerolls, carts, edibles and drinks. Call 707-630-4098.`.slice(0, 158),
    crumbs: [['Home', '/'], ['Delivery', '/delivery/'], [t.name, `/delivery/${t.slug}/`]], ogImage: 'fog-hills',
    body: `
${pageHero({ kicker: `Delivery · ${t.name}`, title: `Humboldt cannabis, *delivered to ${t.name}.*`, lead: `${esc(t.note)} ${esc(t.name)} is ${esc(t.route)} from our Arcata store, inside our delivery area from Trinidad to Rio Dell.`, image: t.slug === 'blue-lake' || t.slug === 'carlotta' ? 'redwood-fog' : t.slug === 'eureka' || t.slug === 'mckinleyville' ? 'fog-hills' : 'marsh-golden', crumbs: [['Home', '/'], ['Delivery', '/delivery/'], [t.name, `/delivery/${t.slug}/`]], actions: btn('Call 707-630-4098', 'tel:' + store.tel, { ic: 'phone' }) + btn('Browse the menu', '/shop/', { kind: 'ghost' }) })}
<section class="band band--lit" data-spot style="--lx:85%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('What we deliver')}<h2>${acc(`The whole menu, *to ${t.name}.*`)}</h2></div><p class="lead">Free Home Delivery. Pick from ${catCount('shop')} products, then call or email your order in.</p></div>
    ${catFlow(['a-all-flower-1', 'a-prerolls', 'a-cartridges', 'edibles', 'a-drinks', 'a-humboldt-grown'], { id: 'cats-town' })}
  </div>
</section>
<section class="band" data-spot style="--lx:15%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap town-facts">
    <div class="glass town-facts__card" data-reveal><h3>${icon('truck')} Delivery to ${esc(t.name)}</h3><ul class="policy"><li>Call 707-630-4098 or email ${esc(store.deliveryEmail)}.</li><li>21 and over. ID is required NO ID, NO SALE!</li><li>We accept cash and debit ($3.00 fee). Sorry, no credit.</li><li>All Sales include excise and sales tax.</li><li>No sales to parking lots or alleyways or other public areas.</li></ul></div>
    <div class="glass town-facts__card" data-reveal><h3>${icon('store')} Or come to us</h3><p>Our Arcata store is at 460 I St, on the corner of I St. and Samoa Blvd, with a courtyard out back. ${t.slug === 'eureka' ? 'In Eureka, our sister store is at 1131 Broadway (707-496-0506).' : ''}</p>${linkArrow('Hours & directions', '/arcata-details/')}</div>
  </div>
  <div class="wrap"><p class="tiny">Delivery hours, minimums and zones are confirmed by phone.</p><nav class="town-links" aria-label="Other delivery towns">${deliveryTowns.filter((x) => x.slug !== t.slug).map((x) => `<a class="chip" href="${u('/delivery/' + x.slug + '/')}">${esc(x.name)}</a>`).join('')}</nav></div>
</section>`,
  }));
  return [{
    path: '/delivery/', key: 'delivery', bodyClass: 'pg-delivery',
    title: "Free Cannabis Delivery in Humboldt County | Humboldt's Premium",
    description: 'Free home delivery from Humboldt’s Premium Arcata, from Trinidad to Rio Dell: Arcata, Eureka, McKinleyville, Blue Lake, Fortuna, Ferndale and Carlotta.',
    crumbs: [['Home', '/'], ['Delivery', '/delivery/']], ogImage: 'fog-hills', body,
  }, ...townPages];
}

function locations() {
  const body = `
${pageHero({ kicker: 'Two stores, one family', title: 'Arcata *and Eureka.*', lead: 'Humboldt’s Premium at 460 I St, Arcata, and at 1131 Broadway, Eureka. Dispensary and delivery from both.', image: 'street-view', crumbs: [['Home', '/'], ['Locations', '/locations/']] })}
<section class="band band--lit" data-spot style="--lx:50%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap locs">
    <article class="loc glass" data-reveal data-spot>${slatPhoto('storefront-dusk', { alt: 'The Arcata store at dusk', sizes: '(max-width: 900px) 100vw, 45vw' })}<div class="loc__body"><span class="chip chip--sun">You are here</span><h2>Arcata</h2><p>460 I St, Arcata Ca 95521<br><span class="muted">On the corner of I St. and Samoa Blvd.</span></p><p><a href="tel:${store.tel}">707-630-4098</a></p>${hoursList()}<div class="actions">${btn('Shop Arcata', '/shop/')}${btn('Directions', store.directions, { kind: 'ghost' })}</div></div></article>
    <article class="loc glass" data-reveal data-spot><div class="loc__ph">${img('logo-sticker', { alt: "Humboldt's Premium", sizes: '320px', pick: 1 })}<p class="tiny">Our sister store</p></div><div class="loc__body"><span class="chip">Sister store</span><h2>Eureka</h2><p>1131 Broadway, Eureka CA, 95501</p><p><a href="tel:+17074960506">707-496-0506</a></p><p class="muted small">The Eureka storefront opened in 2020. Its own site has its own menu and hours.</p><div class="actions">${btn('Visit the Eureka site', store.eureka.site)}</div></div></article>
  </div>
</section>
${ctaBand({ image: 'courtyard-dusk' })}`;
  return { path: '/locations/', key: 'locations', bodyClass: 'pg-locs', title: "Locations: Arcata & Eureka | Humboldt's Premium", description: 'Two Humboldt’s Premium dispensaries: 460 I St in Arcata, with its courtyard lounge, and 1131 Broadway in Eureka. Dispensary and delivery from both.', crumbs: [['Home', '/'], ['Locations', '/locations/']], ogImage: 'street-view', body };
}

function contact() {
  const body = `
${pageHero({ kicker: 'Contact', title: 'Say *"Hi."*', lead: 'Call, email or stop by the corner of I St. and Samoa Blvd.', image: 'interior-door', crumbs: [['Home', '/'], ['Contact', '/contact/']] })}
<section class="band band--lit" data-spot style="--lx:80%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap contact__grid">
    <div class="contact__cards">
      <a class="ccard glass" href="tel:${store.tel}" data-reveal data-spot>${icon('phone')}<span><small>Arcata store</small><b>707-630-4098</b></span></a>
      <a class="ccard glass" href="mailto:${store.email}" data-reveal data-spot>${icon('mail')}<span><small>Email</small><b>${esc(store.email)}</b></span></a>
      <a class="ccard glass" href="mailto:${store.deliveryEmail}" data-reveal data-spot>${icon('truck')}<span><small>Delivery</small><b>${esc(store.deliveryEmail)}</b></span></a>
      <a class="ccard glass" href="${store.directions}" target="_blank" rel="noopener" data-reveal data-spot>${icon('pin')}<span><small>Visit</small><b>460 I St, Arcata, CA 95521</b></span></a>
    </div>
    <form class="cform glass" data-reveal onsubmit="return false" aria-describedby="cform-note">
      <h2 class="cform__h">${acc('Send a *note.*')}</h2>
      <label><span>Name</span><input name="name" autocomplete="name" required></label>
      <label><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
      <label><span>Message</span><textarea name="msg" rows="4" required></textarea></label>
      <button class="btn" type="submit" disabled><span>Send</span>${icon('arrow')}</button>
      <p class="tiny" id="cform-note">Preview build: this form is not connected yet. Please call or email the store.</p>
    </form>
  </div>
</section>
${ctaBand({ image: 'courtyard-night' })}`;
  return { path: '/contact/', key: 'contact', bodyClass: 'pg-contact', title: "Contact | Humboldt's Premium Arcata", description: 'Call 707-630-4098, email humboldtspremiumarcata@humboldtafc.com or delivery@humboldtafc.com, or visit 460 I St, Arcata. Humboldt’s Premium Arcata.', crumbs: [['Home', '/'], ['Contact', '/contact/']], ogImage: 'interior-door', body };
}

function marsh() {
  const body = `
${pageHero({ kicker: 'Before or after the Marsh', title: 'Walk the Marsh, *then the fire.*', lead: 'Our courtyard is a natural stop before or after a walk at the local Arcata Marsh, just south of the store below Samoa Blvd.', image: 'marsh-golden', crumbs: [['Home', '/'], ['The Marsh', '/arcata-marsh/']], actions: btn('Get directions', store.directions) + btn('See the courtyard', '/courtyard-lounge/', { kind: 'ghost' }) })}
<section class="band band--lit" data-spot style="--lx:20%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap marsh__grid">
    <div data-reveal>
      ${kicker('A good Arcata afternoon')}
      <h2>${acc('Fog, birds, *then the courtyard.*')}</h2>
      <ol class="how__steps how__steps--list">
        <li class="glass"><span class="how__n">1</span><h3>Order ahead</h3><p>Pick your products online and pick them up on the way.</p></li>
        <li class="glass"><span class="how__n">2</span><h3>Walk the Marsh</h3><p>The Arcata Marsh is just south of the store. Keep products sealed and stowed while you walk.</p></li>
        <li class="glass"><span class="how__n">3</span><h3>Warm up out back</h3><p>Covered gazebos, fireplaces and the rock waterfall. Edibles and THC drinks welcome today.</p></li>
      </ol>
    </div>
    <div data-reveal>${slatPhoto('waterfall-golden', { alt: 'The courtyard waterfall at golden hour', sizes: '(max-width: 900px) 100vw, 45vw' })}<p class="tiny">Consume only where it is allowed: never in public places like the Marsh trails.</p></div>
  </div>
</section>
${ctaBand({ title: 'The fire is *on the way back.*', image: 'courtyard-dusk' })}`;
  return { path: '/arcata-marsh/', key: 'marsh', bodyClass: 'pg-marsh', title: "Dispensary Near the Arcata Marsh | Humboldt's Premium Arcata", description: 'Walking the Arcata Marsh? Humboldt’s Premium is just north at 460 I St: order ahead, then warm up in our courtyard with gazebos, fire and a waterfall.', crumbs: [['Home', '/'], ['The Marsh', '/arcata-marsh/']], ogImage: 'marsh-golden', body };
}

function faq() {
  const items = LEARN.faq || [];
  const cats = [...new Set(items.map((f) => f.cat))];
  const body = `
${pageHero({ kicker: 'FAQ', title: 'Questions from *the counter.*', lead: 'Hours, ID, payments, delivery, deals and the courtyard. Still stuck? Call 707-630-4098.', image: 'interior-counter', crumbs: [['Home', '/'], ['FAQ', '/faq/']] })}
<section class="band band--lit" data-spot style="--lx:85%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap faqpage">
    <nav class="faqpage__nav" aria-label="FAQ topics">${cats.map((c) => `<a class="chip" href="#${c.toLowerCase().replace(/[^a-z]+/g, '-')}">${esc(c)}</a>`).join('')}</nav>
    ${cats.map((c) => `<div class="faqpage__grp" id="${c.toLowerCase().replace(/[^a-z]+/g, '-')}" data-reveal><h2>${esc(c)}</h2>${faqList(items.filter((f) => f.cat === c))}</div>`).join('')}
  </div>
</section>
${ctaBand({ image: 'courtyard-dusk' })}`;
  return { path: '/faq/', key: 'faq', bodyClass: 'pg-faq', title: "FAQ | Humboldt's Premium Arcata Dispensary", description: 'Answers about hours, ID, payments, delivery, daily deals and the courtyard lounge at Humboldt’s Premium Arcata, 460 I St.', crumbs: [['Home', '/'], ['FAQ', '/faq/']], ogImage: 'interior-counter', body, faqLd: items };
}

export default function visit() { return [details(), ...delivery(), locations(), contact(), marsh(), faq()]; }
