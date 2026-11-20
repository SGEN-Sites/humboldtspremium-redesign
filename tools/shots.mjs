// shots.mjs: screenshots for review. Full page under reduced motion (reveals settled), sliced into viewport-high tiles.
//   PW_CORE=... node tools/shots.mjs <rel> <width> [--motion] [--name x]
import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require(process.env.PW_CORE);
const [rel = '/', w = '1440'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const motion = process.argv.includes('--motion');
const DIR = path.resolve(process.env.SHOT_DIR || 'dist'); const OUT = path.resolve('private/shots'); fs.mkdirSync(OUT, { recursive: true });
const srv = http.createServer((req, res) => { let f = path.join(DIR, decodeURIComponent(req.url.split('?')[0])); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) { res.writeHead(404); res.end(); return; } const st = fs.statSync(f); if (req.headers.range && f.endsWith('.mp4')) { const [a, b] = req.headers.range.replace('bytes=', '').split('-'); const s = +a, e = b ? +b : st.size - 1; res.writeHead(206, { 'content-type': 'video/mp4', 'content-range': `bytes ${s}-${e}/${st.size}`, 'accept-ranges': 'bytes', 'content-length': e - s + 1 }); fs.createReadStream(f, { start: s, end: e }).pipe(res); return; } res.writeHead(200, { 'content-type': f.endsWith('.mp4') ? 'video/mp4' : f.endsWith('.css') ? 'text/css' : f.endsWith('.js') ? 'text/javascript' : f.endsWith('.webp') ? 'image/webp' : f.endsWith('.woff2') ? 'font/woff2' : 'text/html' }); fs.createReadStream(f).pipe(res); });
await new Promise((r) => srv.listen(0, r)); const B = `http://127.0.0.1:${srv.address().port}`;
const br = await chromium.launch();
const H = Number(w) < 800 ? 844 : 900;
const ctx = await br.newContext({ viewport: { width: Number(w), height: H }, deviceScaleFactor: 1, reducedMotion: motion ? 'no-preference' : 'reduce' });
await ctx.addInitScript(() => { localStorage.setItem('hp.age', '1'); sessionStorage.setItem('hp.splash', '1'); });
await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
const p = await ctx.newPage(); await p.goto(B + rel, { waitUntil: 'load' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
await p.waitForTimeout(900);
const name = (process.argv.includes('--name') ? process.argv[process.argv.indexOf('--name') + 1] : (rel === '/' ? 'home' : rel.replace(/^\/|\/$/g, '').replace(/\//g, '_'))) + '-' + w;
const full = path.join(OUT, name + '-full.png');
await p.screenshot({ path: full, fullPage: true });
const total = await p.evaluate(() => document.documentElement.scrollHeight);
await br.close(); srv.close();
// slice into tiles of ~1.6 viewports for reading
const { execFileSync } = await import('node:child_process');
const py = `
from PIL import Image
im=Image.open(${JSON.stringify(full)}); W,H=im.size; step=${Math.round(H * 1.7)}; i=0; y=0
while y<H:
  c=im.crop((0,y,W,min(H,y+step))); c.thumbnail((1100,1600)); c.convert('RGB').save(${JSON.stringify(path.join(OUT, name))}+'-%02d.jpg'%i, quality=70); i+=1; y+=step
print(i,'tiles',W,H)`;
console.log(execFileSync('python3', ['-c', py]).toString().trim(), 'page height', total);
