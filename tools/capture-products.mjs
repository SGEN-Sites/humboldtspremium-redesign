// capture-products.mjs: read the live Wix Stores category pages from the untouched crawl (audit/raw) and freeze the
// product catalogue into src/content/products.json, so the redesign's category pages list the real products.
// Each product keeps its live product URL: "Add to cart" opens that page, where the live Wix cart lives.
//   node tools/capture-products.mjs
import fs from 'node:fs';
import path from 'node:path';

const RAW = path.resolve('audit/raw');
const ORIGIN = 'https://www.humboldtspremiumarcata.com';
const CATS = [
  // live URL slug, live nav label (verbatim), file stem
  ['shop', 'Shop Arcata', 'shop'],
  ['accessories', 'A Accessories', 'accessories'],
  ['a-all-flower-1', 'A Flower (All)', 'a-all-flower-1'],
  ['a-indica-flower', 'A Indica Flower', 'a-indica-flower'],
  ['a-sativa-flower', 'A Sativa Flower', 'a-sativa-flower'],
  ['a-hybrid-flower', 'A Hybrid Flower', 'a-hybrid-flower'],
  ['a-humboldt-grown', 'A Humboldt Grown (Flower/Prerolls)', 'a-humboldt-grown'],
  ['a-cartridges', 'A Cartridges', 'a-cartridges'],
  ['a-concentrates', 'A Concentrates', 'a-concentrates'],
  ['a-cbd-cbn', 'A CBD/CBN', 'a-cbd-cbn'],
  ['a-prerolls', 'A Prerolls', 'a-prerolls'],
  ['edibles', 'A Edibles', 'edibles'],
  ['a-drinks', 'A Drinks', 'a-drinks'],
  ['a-tintctures', 'A Tintctures', 'a-tintctures'],
  ['a-topicals', 'A Topicals', 'a-topicals'],
  ['a-sale-items', 'A Sale Items', 'a-sale-items'],
];
const dec = (s) => String(s).replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();

function parse(html) {
  const items = html.split('data-hook="product-item-root"').slice(1);
  return items.map((chunk) => {
    const slug = (chunk.match(/\/product-page\/([a-z0-9-]+)/) || [])[1];
    const name = dec((chunk.match(/data-hook="product-item-name">([^<]*)</) || [])[1] || '');
    const pay = (chunk.match(/data-hook="product-item-price-to-pay"[^>]*data-wix-price="([^"]+)"/) || [])[1] || '';
    const was = (chunk.match(/data-hook="product-item-price-before-discount"[^>]*data-wix-original-price="([^"]+)"/) || [])[1] || '';
    const ribbon = dec((chunk.match(/data-hook="RibbonDataHook\.RibbonOnImage">([^<]*)</) || [])[1] || '');
    const info = (chunk.match(/data-image-info="([^"]+)"/) || [])[1];
    let img = null;
    if (info) { try { const j = JSON.parse(dec(info)); img = { uri: j.imageData.uri, w: j.imageData.width, h: j.imageData.height }; } catch {} }
    const oos = /data-hook="product-item-out-of-stock"|Out of stock/i.test(chunk.slice(0, 6000));
    return { slug, name, price: pay, was, ribbon, img, oos };
  }).filter((p) => p.slug && p.name);
}

const products = {}; const cats = [];
for (const [slug, label, stem] of CATS) {
  const files = fs.readdirSync(RAW).filter((f) => f === `${stem}.html` || new RegExp(`^${stem}-page-\\d+\\.html$`).test(f))
    .sort((a, b) => (Number((a.match(/page-(\d+)/) || [, 1])[1]) - Number((b.match(/page-(\d+)/) || [, 1])[1])));
  const list = [];
  let pagesLinked = 1;
  for (const f of files) {
    const html = fs.readFileSync(path.join(RAW, f), 'utf8');
    const strip = (html.match(/data-hook="page-(\d+)"/g) || []).map((m) => Number(m.match(/\d+/)[0]));
    pagesLinked = Math.max(pagesLinked, ...strip, 1);
    for (const p of parse(html)) { if (!list.includes(p.slug)) list.push(p.slug); products[p.slug] = { ...(products[p.slug] || {}), ...p, cats: [...new Set([...(products[p.slug]?.cats || []), slug])] }; }
  }
  const title = (fs.readFileSync(path.join(RAW, `${stem}.html`), 'utf8').match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  cats.push({ slug, label, title: dec(title), files: files.length, pagesLinked, count: list.length, products: list });
  console.log(slug.padEnd(18), String(list.length).padStart(4), 'products', `files ${files.length} / pages linked ${pagesLinked}`, files.length < pagesLinked ? '  << MISSING PAGES' : '');
}
const out = { capturedFrom: ORIGIN, capturedAt: fs.statSync(path.join(RAW, 'shop.html')).mtime.toISOString(), note: 'Snapshot of the live Wix Stores category pages; prices and stock change daily. The live store and its cart are the final word.', categories: cats, products };
fs.writeFileSync('src/content/products.json', JSON.stringify(out, null, 1));
console.log('unique products', Object.keys(products).length, '· sitemap products', (fs.readdirSync(RAW).filter((f) => f.startsWith('product-page-')).length));
