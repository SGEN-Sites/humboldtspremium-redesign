// home.mjs: "Arcata's Backyard". The page runs like one evening in the courtyard: golden hour to firelight.
import { esc, u, asset, icon, img, imgSrc, btn, kicker, linkArrow, acc, video } from '../lib/html.mjs';
import { store, CATS, catCount, FACTS, SHOP, LEARN } from '../content/site.mjs';
import { fog, embers, catWall, feelingTiles, dealsBoard, saleRail, catRail, wheelCard, staffPicks, storyStats, visitBand, faqList, marquee, slatPhoto } from '../lib/parts.mjs';

export default function home() {
  const v = video('courtyard-dusk');
  const fire = video('fire-table');
  const faqs = (LEARN.faq || []).filter((f) => /hour|ID|pay|deliver|courtyard|lounge|order/i.test(f.q)).slice(0, 6);
  const body = `
<section class="hero" data-hero data-spot>
  <div class="hero__media" data-hero-media>
    <video class="hero__video" data-hero-video muted playsinline loop preload="none" poster="${imgSrc('courtyard-dusk', 2400)}" aria-hidden="true"
      data-src-lg="${asset(v.files[0].src)}" data-src-sm="${asset(v.files[1].src)}"></video>
    ${img('courtyard-dusk', { alt: 'The Humboldt’s Premium courtyard at dusk: lanterns glowing, the rock waterfall lit, teal sofas around the teak table', cls: 'hero__still', sizes: '100vw', eager: true, pick: 2 })}
  </div>
  <div class="hero__shade" aria-hidden="true"></div>
  ${fog('fog--hero')}
  ${embers(46, 'embers--hero')}
  <div class="hero__in wrap">
    <p class="hero__k kicker"><span class="dot" aria-hidden="true"></span><span class="hide-sm">Humboldt's Premium · </span>Cannabis dispensary <span class="hide-sm">&amp; courtyard </span>· Arcata, CA</p>
    <h1 class="hero__h t-mega" data-split>Arcata's <span class="acc">Backyard.</span></h1>
    <p class="lead hero__lead">Premium Humboldt cannabis, fair prices, and a fireside courtyard where you are welcome to stay a while. Built by a Humboldt family, farm to counter.</p>
    <div class="actions">${btn('Order ahead', '/shop/')}${btn('See the courtyard', '/courtyard-lounge/', { kind: 'ghost' })}</div>
  </div>
  <div class="hero__bar wrap">
    <div class="qbar glass" data-reveal>
      <a class="qbar__i" href="${u('/arcata-details/')}">${icon('clock')}<span><b data-open-status-short>Open today</b><small>Mon to Sat 9 to 9 · Sun 10 to 7</small></span></a>
      <a class="qbar__i" href="${store.directions}" target="_blank" rel="noopener">${icon('pin')}<span><b>460 I St</b><small>Corner of I St &amp; Samoa Blvd</small></span></a>
      <a class="qbar__i" href="${u('/delivery/')}">${icon('truck')}<span><b>Pickup &amp; delivery</b><small>Free home delivery</small></span></a>
      <a class="qbar__i" href="tel:${store.tel}">${icon('phone')}<span><b>${store.phone}</b><small>Phone in your order</small></span></a>
    </div>
  </div>
  <button class="hero__pause" type="button" data-video-toggle aria-pressed="false" aria-label="Pause the background video">${icon('pause')}</button>
</section>

${marquee(['Arcata’s backyard', 'Humboldt grown', 'Farm to counter', 'Stay a while', 'No ID, no sale', 'Fireside on I Street'], 'marquee--seam')}

<section class="band ways" data-spot style="--lx:80%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head" data-reveal>
      <div>${kicker('How do you want to shop?')}<h2>${acc('Your way, *every day.*')}</h2></div>
      <p class="lead">Online orders can be placed by visiting the "Shop" page or phone in orders by calling 707-630-4098.</p>
    </div>
    <div class="ways__grid">
      <a class="way" href="${u('/shop/')}" data-reveal data-spot style="--i:0">${slatPhoto('interior-counter', { alt: 'The counter and slat walls inside the store', sizes: '(max-width: 900px) 100vw, 33vw' })}<span class="way__body"><span class="way__ic">${icon('bag')}</span><span class="way__t">Order ahead for pickup</span><span class="way__s">Browse all ${catCount('shop')} products, add to cart, pick up at the counter.</span><span class="way__go">Shop the menu ${icon('arrow')}</span></span></a>
      <a class="way" href="${u('/arcata-details/')}" data-reveal data-spot style="--i:1">${slatPhoto('interior-wide', { alt: 'The sales floor with glass counters and pendant lights', sizes: '(max-width: 900px) 100vw, 33vw' })}<span class="way__body"><span class="way__ic">${icon('store')}</span><span class="way__t">Shop the store</span><span class="way__s">Come in, shop the store or just say "Hi" to everyone.</span><span class="way__go">Hours &amp; policies ${icon('arrow')}</span></span></a>
      <a class="way" href="${u('/delivery/')}" data-reveal data-spot style="--i:2">${slatPhoto('fog-hills', { alt: '', sizes: '(max-width: 900px) 100vw, 33vw' })}<span class="way__body"><span class="way__ic">${icon('truck')}</span><span class="way__t">Free home delivery</span><span class="way__s">We also offer delivery service from Trinidad to Rio Dell.</span><span class="way__go">Delivery towns ${icon('arrow')}</span></span></a>
    </div>
  </div>
</section>

<section class="band band--lit cats-band" data-spot style="--lx:15%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap">
    <div class="section-head" data-reveal>
      <div>${kicker('Shop by category')}<h2>${acc('Everything on the *slat wall.*')}</h2></div>
      <div class="section-head__side"><p class="lead">Every button opens a page full of real products. Add to cart drops you straight into your bag.</p>${linkArrow('Shop all ' + catCount('shop') + ' products', '/shop/')}</div>
    </div>
    ${catWall(['a-all-flower-1', 'a-prerolls', 'a-cartridges', 'a-concentrates', 'edibles', 'a-drinks', 'a-humboldt-grown', 'a-tintctures', 'a-topicals', 'a-cbd-cbn', 'accessories', 'a-sale-items'])}
  </div>
</section>

<section class="band deals-band" data-spot style="--lx:70%;--ly:20%">
  <div class="band__clip"><span class="key-light"></span>${embers(20)}</div>
  <div class="wrap">
    <div class="section-head" data-reveal>
      <div>${kicker('Today’s deals')}<h2>${acc('Something good *every day.*')}</h2></div>
      <div class="section-head__side"><p class="lead">The Arcata daily deals board, with today lit up. Plus everything marked down right now.</p>${linkArrow('All deals & promos', '/deals/')}</div>
    </div>
    <div data-reveal>${dealsBoard({ compact: true })}</div>
    <div class="deals-band__sale" data-reveal>
      <div class="deals-band__sale-head"><h3>${acc('On sale *right now*')}</h3>${linkArrow('All ' + catCount('a-sale-items') + ' sale items', '/a-sale-items/')}</div>
      ${saleRail()}
    </div>
    <div data-reveal>${wheelCard()}</div>
  </div>
</section>

<section class="band band--lit grown" data-spot style="--lx:85%;--ly:40%">
  <div class="band__clip">${img('redwood-fog', { alt: '', cls: 'band__bg grown__bg', sizes: '100vw' })}<div class="grown__shade"></div>${fog()}</div>
  <div class="wrap">
    <div class="section-head" data-reveal>
      <div>${kicker('Humboldt grown')}<h2>${acc('From our own *backyard.*')}</h2></div>
      <div class="section-head__side"><p class="lead">${catCount('a-humboldt-grown')} Humboldt grown flower and prerolls on the menu today, from Humboldt farms.</p>${linkArrow('Shop Humboldt grown', '/a-humboldt-grown/')}</div>
    </div>
    <div data-reveal>${catRail('a-humboldt-grown', 14)}</div>
  </div>
</section>

<section class="band feel-band" data-spot style="--lx:50%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head section-head--center" data-reveal>${kicker('Shop by feeling')}<h2>${acc('How do you want to *feel tonight?*')}</h2><p class="lead">A loose guide, not a promise: everyone is different. Start low, go slow, and ask the counter.</p></div>
    ${feelingTiles()}
  </div>
</section>

<section class="yard" data-yard data-spot>
  <div class="yard__stage">
    <div class="yard__layer yard__layer--back" data-depth="0.12">${img('courtyard-night', { alt: 'The courtyard at night, lanterns and the waterfall lights glowing', sizes: '100vw', cls: 'yard__img' })}</div>
    <div class="yard__shade" aria-hidden="true"></div>
    ${fog('fog--yard')}
    ${embers(40, 'embers--yard')}
  </div>
  <div class="wrap yard__in">
    <div class="yard__copy" data-reveal>
      <p class="badge-ember">${icon('flame')} Outdoor smoking lounge approved · Nov 10, 2026</p>
      ${kicker('The courtyard & lounge')}
      <h2 class="yard__h">${acc('A courtyard built for *staying.*')}</h2>
      <p class="lead">Covered gazebos, fireplaces and a built-in rock waterfall, with Jolly Giant Creek running beside the lot. A natural stop before or after a walk at the Arcata Marsh.</p>
      <ul class="yard__list">
        <li>${icon('sofa')} Teal sofas, teak tables and patio heaters</li>
        <li>${icon('drop')} The rock waterfall (say hi to the Bigfoot)</li>
        <li>${icon('flame')} Edibles and THC drinks welcome today; smoking lounge on the way</li>
      </ul>
      <div class="actions">${btn('See the courtyard', '/courtyard-lounge/')}${btn('Courtyard manners', '/learn/courtyard-etiquette/', { kind: 'ghost' })}</div>
    </div>
    <figure class="yard__fire glass" data-reveal data-depth="-0.1">
      <video class="yard__video" muted playsinline loop preload="none" data-lazy-video poster="${imgSrc('fire-table', 1400)}" data-src-sm="${asset(fire.files[0].src)}" aria-hidden="true"></video>
      <figcaption>By the fire, after dark</figcaption>
    </figure>
  </div>
</section>

<section class="band whatson" data-spot style="--lx:25%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head" data-reveal>
      <div>${kicker('What’s on')}<h2>${acc('Food trucks, parties *and the wheel.*')}</h2></div>
      <div class="section-head__side"><p class="lead">The courtyard was built for hanging out. Here is what keeps it lively.</p>${linkArrow('What’s on', '/whats-on/')}</div>
    </div>
    <div class="evts">
      <article class="evt glass" data-reveal data-spot style="--i:0"><span class="evt__ic">${icon('burger')}</span><p class="evt__when">On site, check the week</p><h3>Food trucks in the lot</h3><p>Local food trucks park on site, like Humboldt's own Fry Burger.</p>${linkArrow('Follow for the line-up', store.social.instagram)}</article>
      <article class="evt glass" data-reveal data-spot style="--i:1"><span class="evt__ic">${icon('music')}</span><p class="evt__when">Each anniversary, in August</p><h3>The block party</h3><p>A DJ, vendors, games, a prize wheel and in-store specials. The first one was Aug 24, 2024.</p>${linkArrow('See what’s on', '/whats-on/')}</article>
      <article class="evt glass" data-reveal data-spot style="--i:2"><span class="evt__ic">${icon('wheel')}</span><p class="evt__when">The 1st of every month</p><h3>Spin the wheel</h3><p>Spend $50 or more and spin. Includes both locations and delivery, while supplies last.</p>${linkArrow('How the wheel works', '/deals/#wheel')}</article>
    </div>
  </div>
</section>

<section class="band band--lit picks-band" data-spot style="--lx:90%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap">
    <div class="section-head" data-reveal>
      <div>${kicker('Staff picks')}<h2>${acc('Picked by the *Prem. Team.*')}</h2></div>
      <p class="lead">Real people, real favorites. Ask any of us what we are into this week.</p>
    </div>
    ${staffPicks()}
  </div>
</section>

<section class="band story-band" data-spot style="--lx:10%;--ly:40%">
  <div class="band__clip"><span class="key-light"></span>${embers(16)}</div>
  <div class="wrap story-band__grid">
    <div class="story-band__media" data-reveal>
      ${slatPhoto('interior-wide', { alt: 'Inside the store James built: glass counters, slat walls, square pendant lights', sizes: '(max-width: 900px) 100vw, 46vw', cls: 'slat--tall' })}
    </div>
    <div class="story-band__copy" data-reveal>
      ${kicker('Our story')}
      <h2>${acc('Built by a Humboldt *contractor family.*')}</h2>
      <p class="lead">James Alves was a professional contractor. When construction dipped after the real estate crash, he and his wife Amy turned to cannabis: a collective, a farm, two delivery services.</p>
      <p class="muted">Like most enterprises in this unpredictable industry, they had to close the doors and re-evaluate. They came back with retail: Eureka in 2020, then this shop on I Street, laid out from the customer's point of view and built by James himself.</p>
      ${storyStats()}
      <div class="actions">${btn('Read our story', '/about-us/')}${btn('Meet the Prem. Team', '/about-us/#team', { kind: 'ghost' })}</div>
    </div>
  </div>
</section>

${visitBand()}

${faqs.length ? `<section class="band faq-band" data-spot style="--lx:50%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap faq-band__grid">
    <div data-reveal>${kicker('Good to know')}<h2>${acc('Questions from *the counter.*')}</h2><p class="lead">The things people ask us most. More in the full FAQ.</p><div class="actions">${btn('All questions', '/faq/', { kind: 'ghost' })}</div></div>
    <div data-reveal>${faqList(faqs, { open: 1 })}</div>
  </div>
</section>` : ''}

<section class="band social" data-spot>
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head" data-reveal>
      <div>${kicker('@humboldtspremium420')}<h2>${acc('See you *in the backyard.*')}</h2></div>
      <div class="section-head__side">${linkArrow('Follow on Instagram', store.social.instagram)}${linkArrow('Read our Google reviews', store.reviews)}</div>
    </div>
    <div class="social__grid">
      ${[['courtyard-day', 'The courtyard on a sunny day'], ['waterfall-golden', 'The rock waterfall at golden hour'], ['storefront-night', 'The store lit up at night'], ['glass-case', 'Glass in the display case'], ['merch-tees', 'House t-shirts'], ['house-products', 'House 707 Rolls']].map(([id, alt], i) => `<a class="social__tile" href="${store.social.instagram}" target="_blank" rel="noopener" style="--i:${i}" data-reveal>${img(id, { alt, sizes: '(max-width: 760px) 50vw, 16vw', pick: 0 })}<span class="social__ic">${icon('insta')}</span></a>`).join('')}
    </div>
  </div>
</section>`;
  return [{
    path: '/', key: 'home', bodyClass: 'pg-home', schemaBiz: true,
    title: "Humboldt's Premium Arcata | Cannabis Dispensary & Courtyard Lounge",
    description: "Arcata's backyard: premium Humboldt cannabis at 460 I St, a fireside courtyard with a rock waterfall, daily deals, order-ahead pickup and free home delivery.",
    ogImage: 'courtyard-dusk', crumbs: [['Home', '/']], body,
  }];
}
