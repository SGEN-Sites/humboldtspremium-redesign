// story.mjs: /about-us/ (Our Story). The live About words, verbatim, inside a family story told from sourced facts.
import { esc, u, icon, img, btn, kicker, linkArrow, acc } from '../lib/html.mjs';
import { store, FACTS } from '../content/site.mjs';
import { pageHero, fog, embers, slatPhoto, storyStats, ctaBand } from '../lib/parts.mjs';

export default function story() {
  const tl = FACTS.story.value;
  const team = [['team-dustin', 'Dustin'], ['team-justin', 'Justin'], ['team-misha', 'Misha'], ['team-james', 'James']];
  const body = `
${pageHero({ kicker: 'Our story', title: 'Built in Humboldt. *Grown in Humboldt.*', lead: 'A Humboldt contractor family that built cannabis businesses with their own hands, lost some, and came back with a place designed around how people feel when they walk in.', image: 'redwood-fog', crumbs: [['Home', '/'], ['Our Story', '/about-us/']], variant: 'phero--story', pos: '70% center' })}

<section class="band band--lit about" data-spot style="--lx:85%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap about__grid">
    <div class="about__copy" data-reveal>
      ${img('logo-af', { alt: 'Humboldt AF Cannabis', cls: 'about__af', sizes: '280px', pick: 1 })}
      <p class="about__big">Humboldt AF Cannabis is a farm to table Cannabis company.</p>
      <p>Our products are currently available for retail purchase at our dispensary storefronts, Humboldt's Premium Arcata 460 I St, Arcata Ca 95521, and Humboldt's Premium at 1131 Broadway, Eureka CA, 95501.</p>
      <p>We also offer delivery service from Trinidad to Rio Dell.</p>
      <div class="about__call glass">
        <p class="about__call-h">Call us at:</p>
        <p><span>Arcata</span> <a href="tel:${store.tel}">707-630-4098</a></p>
        <p><span>Eureka</span> <a href="tel:+17074960506">707-496-0506</a></p>
        <p class="about__call-f">Dispensary &amp; Delivery</p>
      </div>
    </div>
    <div class="about__stats" data-reveal>${storyStats()}</div>
  </div>
</section>

<section class="band tline-band" data-spot style="--lx:10%;--ly:30%">
  <div class="band__clip"><span class="key-light"></span>${embers(18)}</div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('The road here')}<h2>${acc('From a collective *to the courtyard.*')}</h2></div><p class="lead">Drag or scroll the timeline. Every line comes from the record: magazine features, the state license and the city's own votes.</p></div>
  </div>
  <div class="tline" data-tline tabindex="0" aria-label="Timeline, scroll sideways">
    <ol class="tline__track">${tl.map(([y, t], i) => `<li class="tline__item${i === tl.length - 1 ? ' is-now' : ''}" style="--i:${i}"><span class="tline__y">${esc(y || 'Then')}</span><span class="tline__dot" aria-hidden="true"></span><p>${esc(t)}</p></li>`).join('')}</ol>
  </div>
  <div class="wrap"><p class="tiny tline__src">Sources: California Leaf (Feb 2025), the Arcata Chamber listing, the store's Facebook page, the California DCC license record and the Lost Coast Outpost (Nov 9 and 11, 2026).</p></div>
</section>

<section class="band builders" data-spot style="--lx:80%;--ly:30%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap builders__grid">
    <div class="builders__media" data-reveal>${slatPhoto('leaf-interior', { alt: 'A wide view of the sales floor: glass counters, coolers, slat walls and the front door', sizes: '(max-width: 900px) 100vw, 50vw' })}</div>
    <div data-reveal>
      ${kicker('The builders')}
      <h2>${acc('A contractor *built this store.*')}</h2>
      <p class="lead">James and Amy took inspiration from one of their favorite shows, "Bar Rescue", to lay the shop out from the customer's point of view.</p>
      <p class="muted">The result is what you see now: slat boards with vibrant colors and floating lights from the ceiling, a clean and classy place to get your goodies, and a courtyard out back where townspeople are encouraged to hang with friends. For those who grew up here, it used to be the V&amp;N Burger Bar.</p>
      <ul class="chain">${[['tree', 'Farmed'], ['flame', 'Made'], ['truck', 'Delivered'], ['store', 'Sold'], ['sofa', 'Stayed']].map(([ic, t], i) => `<li style="--i:${i}">${icon(ic)}<span>${t}</span></li>`).join('')}</ul>
      <p class="tiny">Seed to shelf: farming, manufacturing, distribution, delivery and retail, all in Humboldt.</p>
    </div>
  </div>
</section>

<section class="band band--lit values" data-spot style="--lx:50%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap">
    <div class="section-head section-head--center" data-reveal>${kicker('What we care about')}<h2>${acc('Humboldt first, *always.*')}</h2></div>
    <div class="vals">${[
      ['tree', 'Humboldt first', '"Humboldt Grown" has its own shelf, staff picks lean on local farms, and there is a house concentrate: Humboldt’s Premium Diamonds.'],
      ['tag', 'Fair value', 'Humboldt’s finest at a great price, with a deals board for every day of the week.'],
      ['sofa', 'Hospitality by design', 'A store laid out from the customer’s point of view, and a courtyard built for hanging out.'],
      ['leaf', 'Good neighbors', 'Donations to local parks and recreation programs, including the FFA, which helps kids further their education in farming and agriculture.'],
      ['shield', 'Clean and responsible', 'A calm, clean lounge plan with daily litter sweeps and an air scrubber.'],
      ['star', 'Real people', 'A named team with signed staff picks. Say "Hi" to the Prem. Team.'],
    ].map(([ic, h, t], i) => `<article class="val glass" data-reveal data-spot style="--i:${i}">${icon(ic)}<h3>${h}</h3><p>${t}</p></article>`).join('')}</div>
  </div>
</section>

<section class="band team" id="team" data-spot style="--lx:20%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('Dispensary & Delivery')}<h2>${acc('Say "Hi" to our *"Prem. Team"*')}</h2></div><p class="lead">The faces behind the counter and the wheel.</p></div>
    <div class="team__grid">${team.map(([id, n], i) => `<figure class="mate" data-reveal data-tilt style="--i:${i}">${img(id, { alt: n, sizes: '(max-width: 760px) 50vw, 22vw', pick: 0 })}<figcaption>${n}</figcaption></figure>`).join('')}</div>
  </div>
</section>

<section class="band join" id="join" data-spot>
  <div class="band__clip">${img('storefront-night', { alt: '', cls: 'band__bg', sizes: '100vw' })}<div class="join__shade"></div>${embers(20)}</div>
  <div class="wrap join__in" data-reveal>
    ${kicker('JOIN US')}
    <h2>${acc('Work in *the backyard.*')}</h2>
    <p class="lead">We have the best Budtenders and Delivery drivers in Eureka and Humboldt County!! Come check us out!!</p>
    <div class="actions">${btn('Email the Arcata store', 'mailto:' + store.email, { ic: 'mail' })}${btn('Call 707-630-4098', 'tel:' + store.tel, { kind: 'ghost', ic: 'phone' })}</div>
  </div>
</section>
${ctaBand({ title: 'Come say *"Hi."*', lead: 'Welcome to our Arcata location at 460 I St. Come in, shop the store or just say "Hi" to everyone.', image: 'courtyard-dusk' })}`;
  return [{
    path: '/about-us/', key: 'story', bodyClass: 'pg-story',
    title: "Our Story | Humboldt's Premium Arcata, Family-Run Since 2015",
    description: "Humboldt AF Cannabis is a farm to table cannabis company. Meet the Humboldt contractor family and the Prem. Team behind Humboldt's Premium Arcata and Eureka.",
    crumbs: [['Home', '/'], ['Our Story', '/about-us/']], ogImage: 'redwood-fog', body,
  }];
}
