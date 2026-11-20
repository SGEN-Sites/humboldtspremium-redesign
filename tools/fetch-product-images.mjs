// fetch-product-images.mjs: download each captured product's image from the live store's image CDN once, as a
// 480px WebP (Wix "fit" transform, whole photo kept), into src/assets/img/p/<slug>.webp. Resumable; 4 at a time.
import fs from 'node:fs';
import path from 'node:path';
const cat = JSON.parse(fs.readFileSync('src/content/products.json', 'utf8'));
const OUT = path.resolve('src/assets/img/p'); fs.mkdirSync(OUT, { recursive: true });
const list = Object.values(cat.products).filter((p) => p.img && p.img.uri);
let i = 0, ok = 0, skip = 0, bad = [];
const one = async (p) => {
  const f = path.join(OUT, p.slug + '.webp');
  if (fs.existsSync(f) && fs.statSync(f).size > 500) { skip++; return; }
  const uri = p.img.uri;
  const url = `https://static.wixstatic.com/media/${uri}/v1/fit/w_480,h_480,q_86,enc_webp/${encodeURIComponent(uri.replace(/~/g, '_'))}`;
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh) site-reforge capture' } });
  if (!r.ok) { bad.push([p.slug, r.status]); return; }
  fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); ok++;
};
await Promise.all(Array.from({ length: 4 }, async () => { while (i < list.length) { const p = list[i++]; try { await one(p); } catch (e) { bad.push([p.slug, e.message]); } await new Promise((r) => setTimeout(r, 120)); } }));
console.log(`products with image ${list.length} · downloaded ${ok} · already ${skip} · failed ${bad.length}`);
if (bad.length) { console.log(bad.slice(0, 20)); fs.writeFileSync('audit/product-image-failures.json', JSON.stringify(bad, null, 1)); }
