// courtyard.mjs: the courtyard & lounge (the hero of the experience) and What's on.
import { esc, u, icon, img, imgSrc, btn, kicker, linkArrow, acc, video, asset } from '../lib/html.mjs';
import { store, FACTS, LEARN, DAYS } from '../content/site.mjs';
import { pageHero, fog, embers, slatPhoto, faqList, ctaBand, marquee, wheelCard, dealsBoard } from '../lib/parts.mjs';

function courtyard() {
  const fire = video('fire-table');
  const faqs = (LEARN.faq || []).filter((f) => /courtyard|lounge|smok|bring|consum/i.test(f.q + f.cat)).slice(0, 6);
  const body = `
<section class="yhero" data-yhero data-spot>
  <div class="yhero__stage">
    <div class="yhero__layer" data-depth="0.18">${img('courtyard-sunset', { alt: 'The courtyard at sunset: lanterns on, fog drifting through the tall trees behind the rock waterfall', sizes: '100vw', eager: true, cls: 'yhero__img' })}</div>
    <div class="yhero__shade"></div>
    ${fog('fog--hero')}
    ${embers(52, 'embers--hero')}
  </div>
  <div class="wrap yhero__in">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="${u('/')}">Home</a></li><li aria-current="page">Courtyard &amp; Lounge</li></ol></nav>
    <p class="badge-ember">${icon('flame')} Outdoor smoking lounge approved · Nov 10, 2026</p>
    <h1 class="yhero__h t-mega" data-split>The courtyard <span class="acc">&amp; lounge.</span></h1>
    <p class="lead">Covered gazebos, fireplaces and a built-in rock waterfall beside Jolly Giant Creek. Townspeople are encouraged to hang with friends here. Pull up a chair.</p>
    <div class="actions">${btn('Order ahead', '/shop/')}${btn('The lounge news', '#news', { kind: 'ghost', ic: 'chev' })}</div>
  </div>
</section>

${marquee(['Gazebos', 'Fireplaces', 'A rock waterfall', 'Jolly Giant Creek', 'The Arcata Marsh', 'Stay a while'], 'marquee--seam')}

<section class="band yard-tour" data-spot style="--lx:20%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('What’s out back')}<h2>${acc('Arcata’s backyard, *piece by piece.*')}</h2></div><p class="lead">The best seat in the house is outside.</p></div>
    <div class="tour">
      <figure class="tour__item tour__item--a" data-reveal>${slatPhoto('waterfall-golden', { alt: 'The rock waterfall and its Bigfoot statue at golden hour', sizes: '(max-width: 900px) 100vw, 58vw' })}<figcaption><b>The rock waterfall</b> Built into the courtyard wall. Look for the Bigfoot on the rocks.</figcaption></figure>
      <figure class="tour__item tour__item--b" data-reveal>${slatPhoto('leaf-gazebos', { alt: 'Covered gazebos and teak chairs in the courtyard', sizes: '(max-width: 900px) 100vw, 38vw' })}<figcaption><b>Covered gazebos</b> Shade on sunny days, cover when the fog rolls in.</figcaption></figure>
      <figure class="tour__item tour__item--c" data-reveal>${slatPhoto('courtyard-day', { alt: 'Teal-cushioned sofas and a teak table on the courtyard turf', sizes: '(max-width: 900px) 100vw, 38vw' })}<figcaption><b>Sofas and teak tables</b> Room for the whole crew.</figcaption></figure>
      <figure class="tour__item tour__item--d glass" data-reveal>
        <video class="tour__video" muted playsinline loop preload="none" data-lazy-video poster="${imgSrc('fire-table', 1400)}" data-src-sm="${asset(fire.files[0].src)}" aria-label="Flames dancing along an outdoor fire table (illustrative, AI-generated)"></video>
        <figcaption><b>By the fire</b> Fireplaces and heaters for foggy Humboldt nights.</figcaption></figure>
    </div>
  </div>
</section>

<section class="band band--lit news" id="news" data-spot style="--lx:85%;--ly:20%">
  <div class="band__clip">${img('courtyard-night', { alt: '', cls: 'band__bg news__bg', sizes: '(max-width: 760px) 400vw, 100vw' })}<div class="news__shade"></div>${embers(28)}</div>
  <div class="wrap news__grid">
    <div data-reveal>
      ${kicker('The lounge news')}
      <h2>${acc('Approved for *outdoor smoking.*')}</h2>
      <p class="lead">On November 10, 2026, the Arcata Planning Commission unanimously approved an outdoor smoking lounge on the patio, for products bought in the store.</p>
      <p class="muted">James pitched it as a calm, clean place to smoke that cuts cannabis litter around town, with daily litter sweeps and an air scrubber. Mellower than the competition, more like eating outside at a restaurant.</p>
      <p class="tiny">As reported by the Lost Coast Outpost, Nov 9 and Nov 11, 2026. Opening date and final house rules will be posted by the store.</p>
    </div>
    <ol class="steps" data-reveal>
      <li class="step"><span class="step__y">2022</span><span class="step__t">The city approves an outdoor consumption patio for the Arcata site, for non-smoking use.</span></li>
      <li class="step"><span class="step__y">Summer 2023</span><span class="step__t">The store opens at 460 I St, in the old V&amp;N Burger Bar building.</span></li>
      <li class="step"><span class="step__y">April 2026</span><span class="step__t">The Arcata City Council legalizes on-site smoking.</span></li>
      <li class="step is-now"><span class="step__y">Nov 10, 2026</span><span class="step__t">The Planning Commission unanimously approves the outdoor smoking lounge.</span></li>
      <li class="step is-next"><span class="step__y">Next</span><span class="step__t">Opening day, house rules and hours, announced here and on Instagram.</span></li>
    </ol>
  </div>
</section>

<section class="band today" data-spot style="--lx:15%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('How it works')}<h2>${acc('Like eating outside *at a restaurant.*')}</h2></div><p class="lead">Calm, clean and unhurried. Here is what the courtyard is for, today and once the lounge opens.</p></div>
    <div class="today__grid">
      <article class="today__card glass" data-reveal data-spot><span class="today__tag">Today</span><h3>Edibles and THC drinks</h3><p>The courtyard welcomes edibles and THC drinks bought in the store. Hang with friends, catch the food truck, take your time.</p></article>
      <article class="today__card glass" data-reveal data-spot><span class="today__tag today__tag--ember">Coming soon</span><h3>Outdoor smoking</h3><p>With the November 2026 approval, the patio becomes Arcata's outdoor smoking lounge for products bought in the store.</p></article>
      <article class="today__card glass" data-reveal data-spot><span class="today__tag today__tag--sage">Always</span><h3>Good neighbors</h3><p>Daily litter sweeps, an air scrubber and a tidy block. 21 and over, ID required, no sales to parking lots or alleyways.</p></article>
    </div>
    <div class="actions">${btn('Courtyard manners', '/learn/courtyard-etiquette/', { kind: 'ghost' })}${btn('What’s on', '/whats-on/', { kind: 'ghost' })}</div>
  </div>
</section>

<section class="band marsh-band" data-spot>
  <div class="band__clip">${img('marsh-golden', { alt: '', cls: 'band__bg', sizes: '(max-width: 760px) 400vw, 100vw' })}<div class="marsh-band__shade"></div>${fog()}</div>
  <div class="wrap marsh-band__in" data-reveal>
    ${kicker('Before or after the Marsh')}
    <h2>${acc('Walk the Marsh, *then the fire.*')}</h2>
    <p class="lead">The courtyard is a natural stop before or after a walk at the local Arcata Marsh, just south of the store.</p>
    <div class="actions">${btn('Plan the walk', '/arcata-marsh/')}${btn('Get directions', store.directions, { kind: 'ghost' })}</div>
  </div>
</section>

${faqs.length ? `<section class="band faq-band"><div class="wrap faq-band__grid"><div data-reveal>${kicker('Courtyard questions')}<h2>${acc('Before you *pull up a chair.*')}</h2></div><div data-reveal>${faqList(faqs, { open: 1 })}</div></div></section>` : ''}
${ctaBand({ title: 'Pull up a *chair.*', lead: 'Order ahead, pick up at 460 I St and settle in by the waterfall.', image: 'courtyard-dusk' })}`;
  return [{
    path: '/courtyard-lounge/', key: 'courtyard', bodyClass: 'pg-yard', schemaBiz: true,
    title: "Courtyard & Outdoor Cannabis Lounge in Arcata | Humboldt's Premium",
    description: "Arcata's backyard: a courtyard with gazebos, fireplaces and a rock waterfall at 460 I St, approved Nov 10, 2026 as an outdoor smoking lounge.",
    crumbs: [['Home', '/'], ['Courtyard & Lounge', '/courtyard-lounge/']], ogImage: 'courtyard-sunset', body, faqLd: faqs,
  }];
}

function whatsOn() {
  const now = new Date('2026-11-20T12:00:00-08:00');
  const next1st = new Date(now.getFullYear(), now.getMonth() + (now.getDate() > 1 ? 1 : 0), 1);
  const fmt = (d) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const body = `
${pageHero({ kicker: 'What’s on', title: 'Food trucks, parties *and the wheel.*', lead: 'The courtyard was built for hanging out. Here is what keeps it lively, and where to find this week’s line-up.', image: 'courtyard-night', crumbs: [['Home', '/'], ['What’s on', '/whats-on/']], actions: btn('Follow @humboldtspremium420', store.social.instagram, { ic: 'insta' }) + btn('TikTok @humboldtspremium', store.social.tiktok, { kind: 'ghost' }) })}
<section class="band" data-spot style="--lx:80%;--ly:10%">
  <div class="band__clip"><span class="key-light"></span></div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('Next on the calendar')}<h2>${acc('The *1st of the month.*')}</h2></div><p class="lead">The one date we can promise: the wheel comes out on the 1st, at both stores and on delivery.</p></div>
    <div class="cal glass" data-reveal>
      <div class="cal__date"><span class="cal__m">${next1st.toLocaleDateString('en-US', { month: 'short' })}</span><span class="cal__d">1</span></div>
      <div class="cal__body"><p class="cal__when">${fmt(next1st)} · during store hours</p><h3>Spin the wheel</h3><p>Spend $50 or more, spin the wheel. Includes both locations and delivery. **While supplies last!**</p></div>
    </div>
    <div data-reveal>${wheelCard()}</div>
  </div>
</section>
<section class="band band--lit" data-spot style="--lx:20%;--ly:0%">
  <div class="band__clip"><span class="key-light"></span>${fog('fog--low')}</div>
  <div class="wrap">
    <div class="section-head" data-reveal><div>${kicker('Regulars')}<h2>${acc('What keeps the *backyard busy.*')}</h2></div></div>
    <div class="evts">
      <article class="evt glass" data-reveal style="--i:0"><span class="evt__ic">${icon('burger')}</span><p class="evt__when">Days posted on Instagram and TikTok</p><h3>Food trucks in the lot</h3><p>Local food trucks park on site, like Humboldt's own Fry Burger. The building used to be the V&amp;N Burger Bar, so it is still a place people come to eat and hang out.</p></article>
      <article class="evt glass" data-reveal style="--i:1"><span class="evt__ic">${icon('music')}</span><p class="evt__when">Each anniversary, in August</p><h3>The block party</h3><p>A DJ, vendors, games, spin-the-wheel and in-store specials. The first-anniversary party was Saturday, Aug 24, 2024.</p></article>
      <article class="evt glass" data-reveal style="--i:2"><span class="evt__ic">${icon('tag')}</span><p class="evt__when">Every day of the week</p><h3>Daily deals</h3><p>A different board every day, from $2 HP prerolls to quarter-ounce zips.</p>${linkArrow('Today’s deals', '/deals/')}</article>
      <article class="evt glass" data-reveal style="--i:3"><span class="evt__ic">${icon('flame')}</span><p class="evt__when">Opening date to be announced</p><h3>The outdoor smoking lounge</h3><p>Approved on Nov 10, 2026. Opening day and house rules will be posted here first.</p>${linkArrow('The lounge news', '/courtyard-lounge/#news')}</article>
    </div>
  </div>
</section>
${ctaBand({ title: 'See you *out back.*', image: 'courtyard-dusk' })}`;
  return [{
    path: '/whats-on/', key: 'whats-on', bodyClass: 'pg-events',
    title: "What's On at the Courtyard | Humboldt's Premium Arcata",
    description: 'Food trucks, anniversary block parties and Spin the Wheel on the 1st of every month at Humboldt’s Premium Arcata, 460 I St.',
    crumbs: [['Home', '/'], ['What’s on', '/whats-on/']], ogImage: 'courtyard-night', body,
  }];
}

export default function courtyardPages() { return [...courtyard(), ...whatsOn()]; }
