// check.mjs: render-check a built site. Serves the folder, opens every page in headless Chromium at the given
// viewports and records console/page errors, broken images, sideways overflow, internal 404s and live-store links.
//   PW_CORE=<playwright-core> node tools/check.mjs [--dir dist] [--vp 1440x900,390x844] [--shots home,shop] [--only /,/shop/]
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_CORE || 'playwright-core');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const DIR = path.resolve(arg('--dir', 'dist'));
const VPS = arg('--vp', '1440x900,390x844').split(',').map((s) => s.split('x').map(Number));
const ONLY = (arg('--only', '') || '').split(',').filter(Boolean);
const SHOTS = (arg('--shots', '') || '').split(',').filter(Boolean);
const OUT = path.resolve('private/shots'); fs.mkdirSync(OUT, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml' };
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); let f = path.join(DIR, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404, { 'content-type': 'text/html' }); res.end(fs.existsSync(path.join(DIR, '404.html')) ? fs.readFileSync(path.join(DIR, '404.html')) : 'nf'); return; }
  const st = fs.statSync(f); const ty = types[path.extname(f)] || 'application/octet-stream';
  if (req.headers.range && ty === 'video/mp4') { const [a, b] = req.headers.range.replace('bytes=', '').split('-'); const s = Number(a), e = b ? Number(b) : st.size - 1; res.writeHead(206, { 'content-type': ty, 'content-range': `bytes ${s}-${e}/${st.size}`, 'accept-ranges': 'bytes', 'content-length': e - s + 1 }); fs.createReadStream(f, { start: s, end: e }).pipe(res); return; }
  res.writeHead(200, { 'content-type': ty, 'content-length': st.size }); fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(0, r));
const BASE = `http://127.0.0.1:${srv.address().port}`;
const pages = [];
const walk = (d, rel = '/') => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) { if (f !== 'assets') walk(p, rel + f + '/'); } else if (f === 'index.html') pages.push(rel); } };
walk(DIR);
const list = (ONLY.length ? pages.filter((p) => ONLY.includes(p)) : pages).filter((p) => !/http-equiv="refresh"/.test(fs.readFileSync(path.join(DIR, p, 'index.html'), 'utf8')));
const br = await chromium.launch();
const report = { at: new Date().toISOString(), pages: [] };
let issues = 0;
for (const [w, h] of VPS) {
  const ctx = await br.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce', hasTouch: w < 800 });
  await ctx.addInitScript(() => { try { localStorage.setItem('hp.age', '1'); sessionStorage.setItem('hp.splash', '1'); } catch (e) {} });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  for (const rel of list) {
    const pg = await ctx.newPage(); const errs = [];
    pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    pg.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_FAILED|ERR_BLOCKED|Failed to load resource/.test(m.text())) errs.push(m.text().slice(0, 200)); });
    const bad404 = []; pg.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(BASE)) bad404.push(r.status() + ' ' + r.url().replace(BASE, '')); });
    await pg.goto(BASE + rel, { waitUntil: 'load' });
    await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); });
    await pg.waitForTimeout(300);
    const m = await pg.evaluate(() => {
      const ow = document.documentElement.scrollWidth - window.innerWidth;
      const wide = []; if (ow > 1) document.querySelectorAll('body *').forEach((el) => { const r = el.getBoundingClientRect(); if (r.right > window.innerWidth + 1 && getComputedStyle(el).position !== 'fixed') wide.push((typeof el.className === 'string' ? el.className.split(' ')[0] : el.tagName) + ' ' + Math.round(r.right)); });
      const imgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && !i.closest('[hidden]')).map((i) => i.getAttribute('src'));
      const live = [...document.querySelectorAll('a[href*="humboldtspremiumarcata.com"]')].length;
      const h1 = [...document.querySelectorAll('h1')].map((x) => x.textContent.trim().slice(0, 60));
      return { overflow: ow, wide: wide.slice(0, 6), brokenImgs: imgs.slice(0, 6), live, h1, height: document.body.scrollHeight };
    });
    const key = rel === '/' ? 'home' : rel.replace(/^\/|\/$/g, '').replace(/\//g, '_');
    if (SHOTS.includes(key) || SHOTS.includes('all')) await pg.screenshot({ path: path.join(OUT, `${key}-${w}.png`), fullPage: true });
    const prob = errs.length + (m.overflow > 1 ? 1 : 0) + m.brokenImgs.length + bad404.length + (m.h1.length !== 1 ? 1 : 0);
    issues += prob;
    report.pages.push({ rel, vp: w, ...m, errs, bad404: [...new Set(bad404)].slice(0, 8) });
    if (prob) console.log(`[${w}] ${rel}  overflow ${m.overflow} ${m.wide.join(' | ')}  imgs ${m.brokenImgs.join(',')}  404 ${[...new Set(bad404)].slice(0, 4).join(',')}  h1 ${m.h1.length}  ${errs.slice(0, 3).join(' || ')}`);
    await pg.close();
  }
  await ctx.close();
}
await br.close(); srv.close();
fs.writeFileSync('audit/check.json', JSON.stringify(report, null, 1));
console.log(`checked ${list.length} pages x ${VPS.length} viewports · issues ${issues}`);
process.exit(issues ? 1 : 0);
