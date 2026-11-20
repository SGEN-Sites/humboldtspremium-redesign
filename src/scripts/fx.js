/* fx.js: drifting embers on canvas. Embers rise, flicker and sway; near the pointer they brighten and are pushed
   aside like sparks off a fire. One shared rAF loop, only visible canvases draw, paused in hidden tabs, DPR aware,
   off under reduced motion. */
(() => {
  const W = window, d = document;
  if (W.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fine = W.matchMedia('(pointer: fine)').matches;
  const canvases = [...d.querySelectorAll('canvas[data-embers], canvas[data-splash-embers]')];
  if (!canvases.length) return;
  const dpr = Math.min(2, W.devicePixelRatio || 1);
  const mouse = { x: -9999, y: -9999 };
  if (fine) W.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  const fields = canvases.map((cv) => {
    const n = cv.hasAttribute('data-splash-embers') ? 70 : Number(cv.dataset.embers || 24);
    return { cv, ctx: cv.getContext('2d'), n: W.innerWidth < 760 ? Math.ceil(n * 0.5) : n, parts: [], vis: false, w: 0, h: 0, rect: null };
  });
  const spawn = (f, anywhere) => ({
    x: Math.random() * f.w,
    y: anywhere ? Math.random() * f.h : f.h + Math.random() * 40,
    r: (Math.random() * 1.6 + .6) * dpr,
    vy: -(Math.random() * .55 + .25) * dpr,
    vx: (Math.random() - .5) * .25 * dpr,
    ph: Math.random() * Math.PI * 2,
    life: 0, max: 380 + Math.random() * 520,
    hue: 22 + Math.random() * 22,
  });
  function size(f) {
    const r = f.cv.getBoundingClientRect(); f.rect = r;
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (w !== f.w || h !== f.h) { f.cv.width = w; f.cv.height = h; f.w = w; f.h = h; f.parts = Array.from({ length: f.n }, () => spawn(f, true)); }
  }
  if ('IntersectionObserver' in W) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { const f = fields.find((x) => x.cv === e.target); if (f) { f.vis = e.isIntersecting; if (f.vis) size(f); } }), { rootMargin: '100px' });
    fields.forEach((f) => io.observe(f.cv));
  } else fields.forEach((f) => { f.vis = true; size(f); });
  W.addEventListener('resize', () => fields.forEach((f) => f.vis && size(f)), { passive: true });
  let t = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (d.hidden) return;
    t += 1;
    for (const f of fields) {
      if (!f.vis || !f.w) continue;
      if (t % 30 === 0) f.rect = f.cv.getBoundingClientRect();
      const { ctx } = f; ctx.clearRect(0, 0, f.w, f.h);
      const mx = (mouse.x - (f.rect ? f.rect.left : 0)) * dpr, my = (mouse.y - (f.rect ? f.rect.top : 0)) * dpr;
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < f.parts.length; i++) {
        const p = f.parts[i];
        p.life++; p.ph += .04;
        p.x += p.vx + Math.sin(p.ph) * .35 * dpr; p.y += p.vy;
        const dx = p.x - mx, dy = p.y - my, dist = Math.hypot(dx, dy), R = 140 * dpr;
        let boost = 0;
        if (dist < R) { const k = (1 - dist / R); p.x += (dx / (dist || 1)) * k * 2.2 * dpr; p.y += (dy / (dist || 1)) * k * 1.4 * dpr - k * .6 * dpr; boost = k; }
        const fade = Math.min(1, p.life / 40) * Math.max(0, 1 - p.life / p.max);
        const flick = .65 + Math.sin(p.ph * 3.1) * .2 + Math.random() * .15;
        const a = Math.max(0, Math.min(1, fade * flick + boost * .5));
        const r = p.r * (1 + boost * 1.2);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        g.addColorStop(0, `hsla(${p.hue + 18}, 100%, 82%, ${a})`);
        g.addColorStop(.25, `hsla(${p.hue}, 100%, 60%, ${a * .7})`);
        g.addColorStop(1, `hsla(${p.hue - 8}, 100%, 45%, 0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2); ctx.fill();
        if (p.life > p.max || p.y < -20 || p.x < -40 || p.x > f.w + 40) f.parts[i] = spawn(f, false);
      }
    }
  }
  requestAnimationFrame(frame);
})();
