/* site.js: Humboldt's Premium Arcata. Vanilla, no dependencies. Every URL is read from the HTML (works under any
   base path). Everything degrades: no JS = all content visible, no gate, no splash. */
(() => {
  const d = document, html = d.documentElement, W = window;
  const $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const reduced = W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = W.matchMedia('(pointer: fine)').matches;
  const store = { get: (k, s) => { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } }, set: (k, v, s) => { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} } };

  /* ---------- splash -> gate ---------- */
  const splash = $('[data-splash]'), gate = $('[data-gate]');
  const needGate = !store.get('hp.age');
  function showGate() {
    if (!gate || !needGate) { html.classList.remove('gate-pending'); return; }
    gate.hidden = false; html.classList.add('gate-on'); html.classList.remove('gate-pending');
    const yes = $('[data-gate-yes]', gate); setTimeout(() => yes && yes.focus(), 60);
  }
  function endSplash() {
    if (!splash || splash.dataset.done) return; splash.dataset.done = '1';
    splash.classList.add('is-out'); store.set('hp.splash', '1', true);
    setTimeout(() => { html.classList.remove('splash-pending'); splash.hidden = true; d.dispatchEvent(new Event('hp:splashdone')); }, 560);
    showGate();
  }
  if (html.classList.contains('splash-pending') && splash) {
    splash.hidden = false;
    const dur = html.classList.contains('sp-1') ? 1650 : 2450;
    const t = setTimeout(endSplash, dur);
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((e) => W.addEventListener(e, () => { clearTimeout(t); endSplash(); }, { once: true, passive: true }));
  } else { showGate(); }
  if (gate) {
    gate.addEventListener('click', (e) => {
      if (e.target.closest('[data-gate-yes]')) { store.set('hp.age', '1'); gate.hidden = true; html.classList.remove('gate-on'); }
      if (e.target.closest('[data-gate-no]')) { const m = $('[data-gate-msg]', gate); if (m) m.hidden = false; }
    });
    gate.addEventListener('keydown', (e) => { if (e.key !== 'Tab') return; const f = $$('button, a[href]', gate); const i = f.indexOf(d.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } });
  }

  /* ---------- store hours (Pacific time) -> open-now status, today rows, deals board ---------- */
  const HOURS = { 0: [10, 19], 1: [9, 21], 2: [9, 21], 3: [9, 21], 4: [9, 21], 5: [9, 21], 6: [9, 21] };
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const fmtH = (h) => (h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`);
  function pacificNow() {
    try {
      const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      const g = (t) => (p.find((x) => x.type === t) || {}).value;
      const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday'));
      return { day: wd, h: Number(g('hour')) % 24, m: Number(g('minute')) };
    } catch (e) { const n = new Date(); return { day: n.getDay(), h: n.getHours(), m: n.getMinutes() }; }
  }
  const now = pacificNow();
  const [o, c] = HOURS[now.day]; const t = now.h + now.m / 60;
  const open = t >= o && t < c;
  let long, short;
  if (open) { long = `Open now · until ${fmtH(c)} today`; short = `Open now until ${fmtH(c)}`; }
  else if (t < o) { long = `Opens today at ${fmtH(o)}`; short = `Opens at ${fmtH(o)} today`; }
  else { const nd = (now.day + 1) % 7; long = `Closed now · opens ${DAYS[nd]} at ${fmtH(HOURS[nd][0])}`; short = `Opens ${DAYS[nd].slice(0, 3)} at ${fmtH(HOURS[nd][0])}`; }
  $$('[data-open-status]').forEach((el) => { el.classList.add(open ? 'is-open' : 'is-closed'); const s = $('.status__txt', el); if (s) s.textContent = long; });
  $$('[data-open-status-short]').forEach((el) => { el.textContent = short; });
  $$('[data-hours] li').forEach((li) => { if (li.dataset.hday && li.dataset.hday.replace(/\s/g, '').startsWith(DAYS[now.day].slice(0, 3))) li.classList.add('is-today'); });
  $$('[data-deals-board] [data-day]').forEach((el) => { if (el.dataset.day === DAYS[now.day]) { el.classList.add('is-today'); const b = el.parentElement; if (b.scrollWidth > b.clientWidth + 4) b.scrollLeft = el.offsetLeft - 16; } });

  /* ---------- utility rotator + today's deal ---------- */
  const rot = $('[data-rotator]');
  if (rot) {
    try {
      const deals = JSON.parse(rot.dataset.deals || '{}')[DAYS[now.day]];
      const slot = $('[data-today-deal]', rot);
      if (deals && slot) { const b = slot.querySelector('b'); const a = slot.querySelector('a'); b.textContent = `${DAYS[now.day]}:`; b.nextSibling.textContent = ' ' + deals.slice(0, 2).join(' · ') + ' '; a.textContent = 'All deals'; }
    } catch (e) {}
    const slides = $$('.util__slide', rot); let i = 0;
    if (slides.length > 1 && !reduced) setInterval(() => { if (d.hidden || rot.matches(':hover')) return; const cur = slides[i]; cur.classList.remove('is-on'); cur.classList.add('is-out'); i = (i + 1) % slides.length; const nx = slides[i]; nx.classList.remove('is-out'); nx.classList.add('is-on'); setTimeout(() => cur.classList.remove('is-out'), 700); }, 5200);
  }

  /* ---------- header: scrolled state, hide on scroll down ---------- */
  const hdr = $('[data-hdr]'); let lastY = W.scrollY;
  /* ---------- mega menus ---------- */
  let openMega = null, megaTimer;
  const closeMega = () => { if (!openMega) return; const [a, p] = openMega; a.setAttribute('aria-expanded', 'false'); p.classList.remove('is-open'); hdr.classList.remove('mega-open'); const pp = p; setTimeout(() => { if (!pp.classList.contains('is-open')) pp.hidden = true; }, 380); openMega = null; };
  const showMega = (a) => { const p = d.getElementById('mega-' + a.dataset.mega); if (!p) return; if (openMega && openMega[1] === p) return; closeMega(); p.hidden = false; requestAnimationFrame(() => p.classList.add('is-open')); a.setAttribute('aria-expanded', 'true'); hdr.classList.add('mega-open'); openMega = [a, p]; };
  $$('[data-mega]').forEach((a) => {
    a.addEventListener('click', (e) => { if (W.innerWidth < 1041) return; if (openMega && openMega[0] === a) return; e.preventDefault(); showMega(a); });
    if (fine) { a.addEventListener('pointerenter', () => { clearTimeout(megaTimer); megaTimer = setTimeout(() => showMega(a), 90); }); a.addEventListener('pointerleave', () => clearTimeout(megaTimer)); }
  });
  if (hdr) {
    hdr.addEventListener('pointerleave', () => { clearTimeout(megaTimer); megaTimer = setTimeout(closeMega, 260); });
    hdr.addEventListener('pointerenter', () => clearTimeout(megaTimer));
    d.addEventListener('click', (e) => { if (openMega && !e.target.closest('[data-hdr]')) closeMega(); });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (openMega) { const a = openMega[0]; closeMega(); a.focus(); } closeDrawer(); } });
    const q = new URLSearchParams(location.search).get('mega'); if (q) { const a = $(`[data-mega="${q}"]`); if (a) setTimeout(() => showMega(a), 400); }
  }

  /* ---------- drawer ---------- */
  const drawer = $('[data-drawer]'), burger = $('[data-drawer-open]');
  function openDrawer() { if (!drawer) return; drawer.hidden = false; requestAnimationFrame(() => drawer.classList.add('is-open')); html.classList.add('drawer-open'); burger && burger.setAttribute('aria-expanded', 'true'); setTimeout(() => { const x = $('.drw__x', drawer); x && x.focus(); }, 80); syncSticky(); }
  function closeDrawer() { if (!drawer || drawer.hidden) return; drawer.classList.remove('is-open'); html.classList.remove('drawer-open'); burger && burger.setAttribute('aria-expanded', 'false'); setTimeout(() => { drawer.hidden = true; }, 480); syncSticky(); }
  burger && burger.addEventListener('click', openDrawer);
  $$('[data-drawer-close]').forEach((b) => b.addEventListener('click', closeDrawer));

  /* ---------- sticky pickup bar ---------- */
  const stk = $('[data-sticky]'), foot = $('[data-footer]');
  let footVisible = false, typing = false;
  const stkClosed = () => store.get('hp.stk', true) === '1';
  function syncSticky() {
    if (!stk) return;
    const show = !stkClosed() && W.scrollY > W.innerHeight * 0.8 && !footVisible && !typing && !html.classList.contains('drawer-open') && !html.classList.contains('gate-on');
    if (show && stk.hidden) stk.hidden = false;
    stk.classList.toggle('is-on', show);
    html.style.setProperty('--bottom-stack', show ? (stk.offsetHeight + 24) + 'px' : '0px');
  }
  if (stk) {
    $('[data-sticky-close]', stk).addEventListener('click', () => { store.set('hp.stk', '1', true); syncSticky(); });
    if ('IntersectionObserver' in W && foot) new IntersectionObserver((es) => { footVisible = es[0].isIntersecting; syncSticky(); }, { rootMargin: '0px 0px -60px 0px' }).observe(foot);
    d.addEventListener('focusin', (e) => { if (e.target.matches('input, textarea, select')) { typing = true; syncSticky(); } });
    d.addEventListener('focusout', (e) => { if (e.target.matches('input, textarea, select')) { typing = false; syncSticky(); } });
  }

  /* ---------- one scroll loop: header state, parallax, hero progress ---------- */
  const depthEls = $$('[data-depth]');
  const heroes = $$('[data-hero], [data-yhero], .phero, .cta-band');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = W.scrollY, vh = W.innerHeight;
    if (hdr) {
      hdr.classList.toggle('is-scrolled', y > 12);
      const down = y > lastY + 4, up = y < lastY - 4;
      if (down && y > vh * 0.9 && !openMega && !html.classList.contains('drawer-open')) hdr.classList.add('is-hidden');
      else if (up || y < vh * 0.5) hdr.classList.remove('is-hidden');
      lastY = y;
    }
    syncSticky();
    if (reduced) return;
    for (const el of heroes) { const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) continue; const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height))); el.style.setProperty('--sy', p.toFixed(4)); if (el.classList.contains('cta-band')) el.style.setProperty('--sp', ((vh - r.top) / (vh + r.height)).toFixed(4)); }
    if (W.innerWidth < 760) return;
    for (const el of depthEls) {
      const r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) continue;
      const delta = (r.top + r.height / 2 - vh / 2) * Number(el.dataset.depth || 0);
      el.style.setProperty('--py', delta.toFixed(1));
      if (el.dataset.rot) el.style.setProperty('--pr', (delta * Number(el.dataset.rot) / 400).toFixed(2));
    }
  }
  W.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  W.addEventListener('resize', () => requestAnimationFrame(onScroll), { passive: true });
  onScroll();

  /* ---------- reveals + split words ---------- */
  $$('[data-split]').forEach((h) => {
    if (reduced) return;
    h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    let w = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/); const frag = d.createDocumentFragment();
          parts.forEach((p) => { if (!p) return; if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(p)); return; } const o = d.createElement('span'); o.className = 'sw'; o.setAttribute('aria-hidden', 'true'); const i = d.createElement('span'); i.style.setProperty('--w', w++); i.textContent = p; o.appendChild(i); frag.appendChild(o); });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('sr-only')) walk(n);
      });
    };
    walk(h); h.classList.add('is-split');
  });
  const revealTargets = $$('[data-reveal], .catwall, .pgrid, .is-split');
  if ('IntersectionObserver' in W && !reduced) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach((el) => io.observe(el));
    // fail-safe: anything on screen after 2.5 s is shown even if the observer never fired
    setTimeout(() => revealTargets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < W.innerHeight && r.bottom > 0) el.classList.add('is-in'); }), 2500);
    d.addEventListener('hp:splashdone', () => revealTargets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < W.innerHeight && r.bottom > 0) el.classList.add('is-in'); }));
  } else html.classList.add('reveal-all');

  /* ---------- pointer: key light per band, cursor firelight, fog parting, tilt, magnetic ---------- */
  const cl = $('[data-cursor-light]');
  if (fine && !reduced) {
    let px = -999, py = -999, raf = 0;
    W.addEventListener('pointermove', (e) => {
      px = e.clientX; py = e.clientY; html.classList.add('has-cursor');
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (cl) cl.style.transform = `translate3d(${px}px, ${py}px, 0)`; });
    }, { passive: true });
    d.addEventListener('pointerleave', () => html.classList.remove('has-cursor'));
    $$('[data-spot]').forEach((el) => el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--lx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      el.style.setProperty('--ly', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      if (el.matches('[data-hero], [data-yhero]')) { el.style.setProperty('--cx', (e.clientX - r.left) + 'px'); el.style.setProperty('--cy', (e.clientY - r.top) + 'px'); }
    }, { passive: true }));
    $$('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; el.style.setProperty('--ry', ((x - .5) * 9).toFixed(2) + 'deg'); el.style.setProperty('--rx', ((.5 - y) * 7).toFixed(2) + 'deg'); el.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--my', (y * 100).toFixed(1) + '%'); }, { passive: true });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
    $$('[data-magnet]').forEach((b) => {
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top; b.style.setProperty('--mgx', ((x - r.width / 2) * .18).toFixed(1) + 'px'); b.style.setProperty('--mgy', ((y - r.height / 2) * .3).toFixed(1) + 'px'); b.style.setProperty('--bx', x + 'px'); b.style.setProperty('--by', y + 'px'); }, { passive: true });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--mgx', '0px'); b.style.setProperty('--mgy', '0px'); });
    });
  }

  /* ---------- video: hero loop + lazy loops (never on reduced motion or Save-Data) ---------- */
  const saveData = navigator.connection && navigator.connection.saveData;
  const hv = $('[data-hero-video]'), toggle = $('[data-video-toggle]');
  function playSafe(v) { const p = v.play(); if (p && p.catch) p.catch(() => { const go = () => { v.play().catch(() => {}); }; W.addEventListener('pointerdown', go, { once: true }); W.addEventListener('scroll', go, { once: true, passive: true }); }); }
  if (hv && !reduced && !saveData && W.innerWidth >= 700) {
    hv.src = W.innerWidth >= 1280 ? hv.dataset.srcLg : hv.dataset.srcSm;
    hv.addEventListener('playing', () => hv.classList.add('is-playing'));
    const start = () => playSafe(hv);
    if (html.classList.contains('splash-pending')) d.addEventListener('hp:splashdone', start, { once: true }); else setTimeout(start, 300);
    if ('IntersectionObserver' in W) new IntersectionObserver((es) => { if (es[0].isIntersecting) { if (!hv.dataset.paused) playSafe(hv); } else hv.pause(); }).observe(hv);
    toggle && toggle.addEventListener('click', () => { if (hv.paused) { delete hv.dataset.paused; playSafe(hv); toggle.setAttribute('aria-pressed', 'false'); toggle.setAttribute('aria-label', 'Pause the background video'); toggle.innerHTML = toggle.innerHTML.replace('M8 5v14l11-7z', 'M8 5v14M16 5v14'); } else { hv.dataset.paused = '1'; hv.pause(); toggle.setAttribute('aria-pressed', 'true'); toggle.setAttribute('aria-label', 'Play the background video'); toggle.innerHTML = toggle.innerHTML.replace('M8 5v14M16 5v14', 'M8 5v14l11-7z'); } });
  } else if (toggle) toggle.hidden = true;
  const lazyV = $$('[data-lazy-video]');
  if (lazyV.length && !reduced && !saveData && 'IntersectionObserver' in W) {
    const vio = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target; if (e.isIntersecting) { if (!v.src) v.src = v.dataset.srcSm; playSafe(v); } else if (v.src) v.pause(); }), { rootMargin: '200px 0px' });
    lazyV.forEach((v) => vio.observe(v));
  }

  /* ---------- photos arrive (gilded frame: settle + one light sweep; morning mist: the fog lifts) ---------- */
  const phs = $$('[data-ph]');
  if ('IntersectionObserver' in W && !reduced) { const po = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); po.unobserve(e.target); } }), { threshold: .3 }); phs.forEach((p) => po.observe(p)); }
  else phs.forEach((p) => p.classList.add('is-in'));
  if (fine && !reduced) phs.forEach((p) => { p.addEventListener('pointermove', (e) => { const r = p.getBoundingClientRect(); p.style.setProperty('--phx', (((e.clientX - r.left) / r.width - .5) * -16).toFixed(1) + 'px'); p.style.setProperty('--phy', (((e.clientY - r.top) / r.height - .5) * -12).toFixed(1) + 'px'); }, { passive: true }); p.addEventListener('pointerleave', () => { p.style.setProperty('--phx', '0px'); p.style.setProperty('--phy', '0px'); }); });
  /* review hooks for the options page: replay a splash variant, re-run the photo arrival */
  W.HP = {
    playSplash(n) { if (!splash) return; html.classList.remove('sp-1', 'sp-2', 'sp-3'); html.classList.add('sp-' + n); delete splash.dataset.done; splash.classList.remove('is-out'); splash.hidden = false; html.classList.add('splash-replay', 'splash-pending'); void splash.offsetWidth; html.classList.remove('splash-replay'); setTimeout(() => { endSplash(); }, n == 1 ? 1650 : 2450); },
    replayPhotos(root) { $$('[data-ph]', root).forEach((p) => { p.classList.remove('is-in'); void p.offsetWidth; setTimeout(() => p.classList.add('is-in'), 80); }); },
  };

  /* ---------- rails ---------- */
  $$('[data-rail]').forEach((r) => { const tr = $('.rail__track', r); const step = () => (tr.firstElementChild ? tr.firstElementChild.getBoundingClientRect().width + 16 : 260) * (W.innerWidth < 760 ? 1 : 2); $('[data-rail-prev]', r).addEventListener('click', () => tr.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' })); $('[data-rail-next]', r).addEventListener('click', () => tr.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' })); });

  /* ---------- timeline: drag to scroll ---------- */
  $$('[data-tline]').forEach((tl) => { let down = false, sx = 0, sl = 0; tl.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = tl.scrollLeft; tl.setPointerCapture(e.pointerId); }); tl.addEventListener('pointermove', (e) => { if (down) tl.scrollLeft = sl - (e.clientX - sx); }); tl.addEventListener('pointerup', () => { down = false; }); tl.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') tl.scrollBy({ left: 300 }); if (e.key === 'ArrowLeft') tl.scrollBy({ left: -300 }); }); });

  /* ---------- count-up ---------- */
  if ('IntersectionObserver' in W && !reduced) { const co = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; const el = e.target; co.unobserve(el); const to = Number(el.dataset.count); const from = to > 1000 ? to - 25 : 0; const t0 = performance.now(); const dur = 1400; const tick = (now) => { const k = Math.min(1, (now - t0) / dur); const v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); el.textContent = v; if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }), { threshold: .6 }); $$('[data-count]').forEach((el) => co.observe(el)); }

  /* ---------- map: load Google only on request ---------- */
  $$('[data-map]').forEach((m) => { const b = $('[data-map-load]', m); b && b.addEventListener('click', () => { const tpl = $('[data-map-tpl]', m); m.appendChild(tpl.content.cloneNode(true)); $('[data-map-ph]', m).remove(); }); });

  /* ---------- font review chip (only while a ?font= option is active) ---------- */
  const fo = html.dataset.font; let fxs = null, spv = null;
  let dvs = null; try { fxs = sessionStorage.getItem('hp.fx'); spv = sessionStorage.getItem('hp.splashv'); dvs = sessionStorage.getItem('hp.div'); } catch (e) {}
  if ((fo || fxs || spv || dvs) && !$('.lab-grid') && !$('.fxlab') && !$('.dvlab')) {
    const names = { live: 'A · Live site match', logo: 'B · Logo match', inknut: 'C · Inknut headlines', caps: 'D · Premium caps', western: 'E · Western + Garamond', current: 'F · First build' };
    const parts = []; if (fo) parts.push(`Fonts <b>${names[fo] || fo}</b>`); if (fxs) parts.push(`Photos <b>${fxs === 'mist' ? '2 · Morning mist' : '1 · Gilded frame'}</b>`); if (spv) parts.push(`Splash <b>S${spv}</b>`); if (dvs) parts.push(`Dividers <b>${dvs}</b>`);
    const chip = d.createElement('div'); chip.className = 'font-chip';
    chip.innerHTML = `<span>${parts.join(' · ')}</span><a href="${html.dataset.lab.replace('fonts/', 'effects/')}">All options</a><a href="?font=default&fx=default&splash=reset&div=default">Reset</a>`;
    d.body.appendChild(chip);
  }

  /* ---------- the premium wheel: idle turn, a decelerating spin on request, the next 1st of the month ---------- */
  $$('[data-wheel]').forEach((w) => {
    const rot = $('[data-wheel-rot]', w), btn = $('[data-wheel-spin]', w), note = $('[data-wheel-note]', w), nx = $('[data-next-first] span', w);
    let ang = 0; if (!reduced) rot.classList.add('is-idle');
    try { const p = pacificNow(); const t = new Date(); const ym = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(t); const g = (k) => Number(ym.find((x) => x.type === k).value); const y = g('year'), m = g('month'), dd = g('day');
      if (dd === 1) nx.textContent = 'Spin day is today'; else { const n1 = new Date(Date.UTC(m === 12 ? y + 1 : y, m === 12 ? 0 : m, 1, 12)); const days = Math.round((n1 - Date.UTC(y, m - 1, dd, 12)) / 864e5); nx.textContent = `Next spin: ${n1.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })} · in ${days} day${days === 1 ? '' : 's'}`; } } catch (e) {}
    btn && btn.addEventListener('click', () => {
      if (reduced) { note.hidden = false; return; }
      const cur = getComputedStyle(rot).transform; let base = 0; if (cur && cur !== 'none') { const mm = cur.match(/matrix\(([^)]+)\)/); if (mm) { const v = mm[1].split(',').map(Number); base = Math.atan2(v[1], v[0]) * 180 / Math.PI; } }
      rot.classList.remove('is-idle'); rot.style.transition = 'none'; rot.style.transform = `rotate(${base}deg)`; void rot.offsetWidth;
      ang = base + 1440 + Math.floor(Math.random() * 360); rot.style.transition = ''; rot.style.transform = `rotate(${ang}deg)`;
      w.classList.add('is-spinning'); btn.disabled = true; setTimeout(() => { w.classList.remove('is-spinning'); btn.disabled = false; note.hidden = false; }, 5200);
    });
  });

  /* ---------- category coverflow ---------- */
  $$('[data-cflow]').forEach((cf) => {
    const cards = $$('.cfc', cf), dots = $$('[data-cflow-dot]', cf), n = cards.length; if (!n) return;
    let act = 0, timer = 0, paused = false;
    const geo = () => { const w = cf.clientWidth; const cw = cards[0].offsetWidth; return { s1: Math.min(cw * 0.86, w * 0.24), s2: Math.min(cw * 1.5, w * 0.40), s3: Math.min(cw * 2.0, w * 0.52) }; };
    function render() {
      const g = geo();
      cards.forEach((c, i) => {
        let dd = i - act; if (dd > n / 2) dd -= n; if (dd < -n / 2) dd += n; const a = Math.abs(dd), sg = Math.sign(dd);
        const x = a === 0 ? 0 : a === 1 ? g.s1 : a === 2 ? g.s2 : g.s3 + (a - 3) * 40;
        const sc = [1.08, .84, .7, .58][Math.min(a, 3)];
        c.style.transform = `translateX(${sg * x}px) scale(${sc})`;
        c.style.opacity = a > 3 ? 0 : [1, .82, .5, .22][a];
        c.style.filter = a ? `brightness(${[1, .66, .48, .36][Math.min(a, 3)]}) saturate(.85)` : 'none';
        c.style.zIndex = 20 - a; c.style.pointerEvents = a > 2 ? 'none' : 'auto';
        c.classList.toggle('is-active', a === 0); c.tabIndex = a === 0 ? 0 : -1; c.setAttribute('aria-hidden', a > 2 ? 'true' : 'false');
      });
      dots.forEach((dt, i) => dt.setAttribute('aria-selected', i === act ? 'true' : 'false'));
      cf.style.setProperty('--cg', getComputedStyle(cards[act]).getPropertyValue('--glow').trim() || '#fdc232');
    }
    const go = (k) => { act = ((k % n) + n) % n; render(); };
    const auto = () => { clearInterval(timer); if (!reduced) timer = setInterval(() => { if (!paused && !d.hidden) go(act + 1); }, 3400); };
    cards.forEach((c, i) => c.addEventListener('click', (e) => { if (i !== act) { e.preventDefault(); go(i); auto(); } }));
    dots.forEach((dt, i) => dt.addEventListener('click', () => { go(i); auto(); }));
    $('[data-cflow-prev]', cf).addEventListener('click', () => { go(act - 1); auto(); });
    $('[data-cflow-next]', cf).addEventListener('click', () => { go(act + 1); auto(); });
    cf.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { go(act + 1); auto(); cards[act].focus(); } if (e.key === 'ArrowLeft') { go(act - 1); auto(); cards[act].focus(); } });
    cf.addEventListener('pointerenter', () => { paused = true; }); cf.addEventListener('pointerleave', () => { paused = false; });
    cf.addEventListener('focusin', () => { paused = true; }); cf.addEventListener('focusout', () => { paused = false; });
    let sx = null, moved = false; const tr = $('[data-cflow-track]', cf);
    tr.addEventListener('pointerdown', (e) => { sx = e.clientX; moved = false; }, { passive: true });
    tr.addEventListener('pointermove', (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 50) { go(act + (e.clientX < sx ? 1 : -1)); sx = e.clientX; moved = true; auto(); } }, { passive: true });
    tr.addEventListener('pointerup', () => { sx = null; });
    tr.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
    W.addEventListener('resize', render, { passive: true });
    if ('IntersectionObserver' in W) new IntersectionObserver((es) => { paused = !es[0].isIntersecting; }).observe(cf);
    render(); auto();
  });

  /* ---------- options page controls ---------- */
  $$('[data-replay]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); W.HP.replayPhotos(a.closest('[data-fxcol]')); }));
  $$('[data-play]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); W.HP.playSplash(a.dataset.play); }));
  if ($('.fxlab__grid') && !reduced) setTimeout(() => $$('[data-fxcol]').forEach((c) => W.HP.replayPhotos(c)), 900);

  /* ---------- product grids: search, type, sort, show more ---------- */
  $$('[data-grid]').forEach((wrap) => {
    const grid = $('.pgrid', wrap); const cards = $$('.pc', grid); const limit = Number(wrap.dataset.limit || 24);
    const q = $('[data-grid-q]', wrap), sort = $('[data-grid-sort]', wrap), count = $('[data-grid-count]', wrap), empty = $('[data-grid-empty]', wrap), more = $('[data-grid-more]', wrap);
    let type = '', shown = limit; const orig = cards.slice();
    function apply() {
      const term = (q && q.value || '').trim().toLowerCase();
      let list = orig.filter((c) => (!term || c.dataset.name.includes(term)) && (!type || c.dataset.type === type));
      const s = sort && sort.value;
      if (s) { list = list.slice().sort((a, b) => s === 'price-asc' ? a.dataset.price - b.dataset.price : s === 'price-desc' ? b.dataset.price - a.dataset.price : s === 'thc-desc' ? (Number(b.dataset.thc) || 0) - (Number(a.dataset.thc) || 0) : a.dataset.name.localeCompare(b.dataset.name)); }
      const frag = d.createDocumentFragment(); list.forEach((c) => frag.appendChild(c)); orig.filter((c) => !list.includes(c)).forEach((c) => frag.appendChild(c)); grid.appendChild(frag);
      orig.forEach((c) => { c.classList.toggle('is-filtered', !list.includes(c)); });
      list.forEach((c, i) => c.classList.toggle('is-over', i >= shown));
      wrap.classList.toggle('is-limited', list.length > shown);
      if (more) more.parentElement.hidden = list.length <= shown;
      if (count) count.textContent = list.length;
      if (empty) empty.hidden = list.length > 0;
    }
    q && q.addEventListener('input', () => { shown = limit; apply(); });
    sort && sort.addEventListener('change', apply);
    $$('[data-grid-type]', wrap).forEach((b) => b.addEventListener('click', () => { type = b.dataset.gridType; $$('[data-grid-type]', wrap).forEach((x) => x.classList.toggle('is-on', x === b)); shown = limit; apply(); }));
    more && more.addEventListener('click', () => { shown += limit * 2; apply(); });
    apply();
  });
})();
