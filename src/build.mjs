// build.mjs: render every page into a static site. Node builtins only.
//   node src/build.mjs [--out dist] [--base /] [--preview]
// --preview stamps noindex on every page and a robots Disallow (the public Pages preview).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'dist'));
const BASE = arg('--base', '/');
const preview = process.argv.includes('--preview');

const { setBase } = await import('./lib/html.mjs');
setBase(BASE);
const { layout, setBuild } = await import('./lib/layout.mjs');
const build = Date.now().toString(36);
setBuild(build);
const pages = [];
for (const mod of ['home', 'shop', 'courtyard', 'story', 'visit', 'more']) pages.push(...(await import(`./pages/${mod}.mjs`)).default());
const more = await import('./pages/more.mjs');
pages.push(more.sitemapPage(pages));
pages.push(more.notFound());

// duplicate-path guard (fail closed)
const seen = new Set();
for (const p of pages) { if (seen.has(p.path)) throw new Error('duplicate page path ' + p.path); seen.add(p.path); }

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const p of pages) {
  const html = layout(p, { preview });
  const file = p.file ? path.join(OUT, p.file) : path.join(OUT, p.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// assets: css (concatenated in order), js, fonts, images, video
const copyDir = (src, dst) => { fs.mkdirSync(dst, { recursive: true }); for (const f of fs.readdirSync(src)) { if (f === '.DS_Store') continue; const s = path.join(src, f); const d = path.join(dst, f); if (fs.statSync(s).isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d); } };
const A = path.join(OUT, 'assets');
copyDir(path.join(ROOT, 'src/assets/fonts'), path.join(A, 'fonts'));
copyDir(path.join(ROOT, 'src/assets/img'), path.join(A, 'img'));
copyDir(path.join(ROOT, 'src/assets/video'), path.join(A, 'video'));
fs.mkdirSync(path.join(A, 'css'), { recursive: true });
fs.mkdirSync(path.join(A, 'js'), { recursive: true });
const cssFiles = fs.readdirSync(path.join(ROOT, 'src/styles')).filter((f) => f.endsWith('.css')).sort();
const css = cssFiles.map((f) => `/* ${f} */\n` + fs.readFileSync(path.join(ROOT, 'src/styles', f), 'utf8')).join('\n');
fs.writeFileSync(path.join(A, 'css/site.css'), css);
for (const f of ['site.js', 'fx.js']) fs.copyFileSync(path.join(ROOT, 'src/scripts', f), path.join(A, 'js', f));

// robots + sitemap
const SITE = 'https://www.humboldtspremiumarcata.com';
fs.writeFileSync(path.join(OUT, 'robots.txt'), preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
const urls = pages.filter((p) => !p.file && !p.refresh).map((p) => `<url><loc>${SITE}${p.path}</loc></url>`).join('\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
if (preview) fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log(`built ${pages.length} pages -> ${path.relative(ROOT, OUT)} (base ${BASE}${preview ? ', preview/noindex' : ''})`);
