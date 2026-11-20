// ui-test.mjs: drive the interactive parts in a real (motion-on) headless browser and prove they work.
//   PW_CORE=... node tools/ui-test.mjs [--dir dist] [--base /]   or   node tools/ui-test.mjs --url https://.../
import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require(process.env.PW_CORE || 'playwright-core');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
let B = arg('--url', ''); let srv;
if (!B) {
  const DIR = path.resolve(arg('--dir', 'dist'));
  srv = http.createServer((req, res) => { let f = path.join(DIR, decodeURIComponent(req.url.split('?')[0])); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) { res.writeHead(404); res.end(); return; } const st = fs.statSync(f); const ty = f.endsWith('.mp4') ? 'video/mp4' : f.endsWith('.css') ? 'text/css' : f.endsWith('.js') ? 'text/javascript' : f.endsWith('.webp') ? 'image/webp' : f.endsWith('.woff2') ? 'font/woff2' : 'text/html'; if (req.headers.range && ty === 'video/mp4') { const [a, b] = req.headers.range.replace('bytes=', '').split('-'); const s = +a, e = b ? +b : st.size - 1; res.writeHead(206, { 'content-type': ty, 'content-range': `bytes ${s}-${e}/${st.size}`, 'accept-ranges': 'bytes', 'content-length': e - s + 1 }); fs.createReadStream(f, { start: s, end: e }).pipe(res); return; } res.writeHead(200, { 'content-type': ty, 'content-length': st.size }); fs.createReadStream(f).pipe(res); });
  await new Promise((r) => srv.listen(0, r)); B = `http://127.0.0.1:${srv.address().port}/`;
}
B = B.replace(/\/?$/, '/');
const results = []; const ok = (name, pass, detail = '') => { results.push({ name, pass: !!pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`); };
const br = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|sgen-sites\.github\.io)/, (r) => r.abort());
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|ERR_BLOCKED/.test(m.text())) errs.push(m.text().slice(0, 160)); });
await p.goto(B, { waitUntil: 'domcontentloaded' });
ok('splash shows on first visit', await p.evaluate(() => { const s = document.querySelector('[data-splash]'); return s && getComputedStyle(s).display !== 'none'; }));
await p.waitForTimeout(3400);
ok('splash hands off to the 21+ gate', await p.evaluate(() => !document.documentElement.classList.contains('splash-pending') && document.documentElement.classList.contains('gate-on')));
await p.click('[data-gate-yes]'); await p.waitForTimeout(400);
ok('gate closes on YES and remembers', await p.evaluate(() => !document.documentElement.classList.contains('gate-on') && localStorage.getItem('hp.age') === '1'));
ok('one H1, visible', await p.evaluate(() => { const h = document.querySelectorAll('h1'); const r = h[0].getBoundingClientRect(); return h.length === 1 && r.height > 40 && getComputedStyle(h[0]).opacity !== '0'; }));
await p.waitForTimeout(1500);
ok('hero video plays', await p.evaluate(() => { const v = document.querySelector('[data-hero-video]'); return v && !v.paused && v.readyState >= 2; }));
await p.hover('[data-mega="shop"]'); await p.waitForTimeout(500);
ok('shop mega menu opens on hover', await p.evaluate(() => { const m = document.getElementById('mega-shop'); return m && !m.hidden && m.classList.contains('is-open'); }));
const megaLinks = await p.evaluate(() => [...document.querySelectorAll('#mega-shop .mega__col a')].map((a) => a.getAttribute('href')));
ok('mega links point at category pages', megaLinks.length >= 14, megaLinks.length + ' links');
await p.mouse.move(700, 700); await p.waitForTimeout(500);
await p.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6)); await p.waitForTimeout(900);
ok('sticky pickup bar shows past the hero', await p.evaluate(() => document.querySelector('[data-sticky]').classList.contains('is-on')));
await p.click('[data-sticky-close]'); await p.waitForTimeout(500);
ok('sticky bar closes for the visit', await p.evaluate(() => !document.querySelector('[data-sticky]').classList.contains('is-on') && sessionStorage.getItem('hp.stk') === '1'));
ok('today is lit on the deals board', await p.evaluate(() => !!document.querySelector('[data-deals-board] .is-today')));
ok('embers canvas drawing', await p.evaluate(() => { const c = document.querySelector('canvas.embers'); return c && c.width > 0; }));
// a category page: products listed, add-to-cart goes to the live store product page, filter works
await p.goto(B + 'a-cartridges/', { waitUntil: 'load' }); await p.waitForTimeout(600);
const cat = await p.evaluate(() => { const cards = document.querySelectorAll('.pgrid .pc'); const add = [...document.querySelectorAll('.pc__add')].map((a) => a.href); return { n: cards.length, add: add.length, live: add.every((h) => h.startsWith('https://www.humboldtspremiumarcata.com/product-page/')), shown: [...cards].filter((c) => c.offsetParent).length }; });
ok('category page lists real products', cat.n > 0 && cat.shown > 0, `${cat.n} products, ${cat.shown} shown`);
ok('every Add to cart opens the live store product page', cat.live && cat.add === cat.n, `${cat.add} buttons`);
await p.fill('[data-grid-q]', 'halara'); await p.waitForTimeout(300);
const f = await p.evaluate(() => ({ count: Number(document.querySelector('[data-grid-count]').textContent), vis: [...document.querySelectorAll('.pgrid .pc')].filter((c) => c.offsetParent).every((c) => c.dataset.name.includes('halara')) }));
ok('search filters the grid', f.count > 0 && f.vis, f.count + ' match');
await p.fill('[data-grid-q]', ''); await p.click('[data-grid-type="Indica"]'); await p.waitForTimeout(300);
ok('type chip filters the grid', await p.evaluate(() => [...document.querySelectorAll('.pgrid .pc')].filter((c) => c.offsetParent).every((c) => c.dataset.type === 'Indica')));
// every category tile on home + shop leads to a page that has products
await p.goto(B, { waitUntil: 'load' });
const tiles = await p.evaluate(() => [...new Set([...document.querySelectorAll('.cat, .cfc, .feel__tile, #mega-shop .mega__col a, #mega-shop .mega__side a, [href$="/shop/"]')].map((a) => a.getAttribute('href')))]);
const empty = [];
for (const href of tiles) { const r = await p.request.get(new URL(href, B).href); const t = await r.text(); const n = (t.match(/class="pc"/g) || []).length; if (r.status() !== 200 || n === 0) empty.push(`${href} (${r.status()}, ${n})`); }
ok('every category / feeling / mega link lands on a page with products', empty.length === 0, `${tiles.length} links checked${empty.length ? ': ' + empty.join(', ') : ''}`);
ok('no console or page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
await br.close(); srv && srv.close();
fs.mkdirSync('audit', { recursive: true }); fs.writeFileSync('audit/ui-test.json', JSON.stringify({ at: new Date().toISOString(), base: B, results }, null, 1));
const fails = results.filter((r) => !r.pass).length;
console.log(fails ? `UI: ${fails} FAIL of ${results.length}` : `UI: PASS ${results.length}/${results.length}`);
process.exit(fails ? 1 : 0);
