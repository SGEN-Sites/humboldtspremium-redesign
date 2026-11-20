// html.mjs: escaping, base-aware URLs, icons, responsive images and small shared snippets. Node builtins only.
import fs from 'node:fs';

export const IMG = JSON.parse(fs.readFileSync(new URL('../content/images.json', import.meta.url), 'utf8'));
let BASE = '/';
export const setBase = (b) => { BASE = b.endsWith('/') ? b : b + '/'; };
export const getBase = () => BASE;
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const u = (p) => (/^(https?:|mailto:|tel:|sms:|#|data:)/.test(p) ? p : BASE + String(p).replace(/^\//, ''));
export const asset = (p) => u('assets/' + String(p).replace(/^\//, ''));
export const isExt = (h) => /^https?:/.test(h);

const ICONS = {
  arrow: '<path d="M5 12h13M13 6l6 6-6 6"/>',
  ne: '<path d="M7 17 17 7M9 7h8v8"/>',
  phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.2"/><path d="M6 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14 10h4M14 13h3"/>',
  truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  store: '<path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10h18"/><path d="M9 20v-5h6v5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.6 1 2.5 2 3 0-3 .5-6 1-8.5z"/>',
  tree: '<path d="M12 2 6 10h3l-4 6h5v6h4v-6h5l-4-6h3z"/>',
  wave: '<path d="M2 9c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0M2 15c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0"/>',
  leaf: '<path d="M5 19C5 10 11 5 20 4c0 9-5 15-14 15zM5 19l8-8"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6z"/>',
  cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9v.01M18 15v.01"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  burger: '<path d="M4 11a8 6 0 0 1 16 0zM3 14h18M4 17h16a0 0 0 0 1-2 3H6a2 2 0 0 1-2-3z"/>',
  wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1.5"/><path d="M12 3v7.5M12 13.5V21M3 12h7.5M13.5 12H21M5.6 5.6l5.3 5.3M13.1 13.1l5.3 5.3M18.4 5.6l-5.3 5.3M10.9 13.1l-5.3 5.3"/>',
  insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>',
  fb: '<path d="M14 21v-8h3l.5-3.5H14V7.6c0-1 .3-1.7 1.8-1.7H18V2.8c-.4-.1-1.6-.2-3-.2-3 0-4.9 1.8-4.9 5v2.9H7V13h3.1v8z"/>',
  tiktok: '<path d="M14 3c.4 2.6 2 4.2 4.6 4.4v3.2c-1.6 0-3.1-.5-4.5-1.4v6.3A5.5 5.5 0 1 1 8.6 10v3.3a2.3 2.3 0 1 0 2.2 2.3V3z"/>',
  google: '<path d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-7.1z"/><path d="M12 21c2.6 0 4.7-.9 6.3-2.3l-3.1-2.4c-.9.6-1.9.9-3.2.9-2.5 0-4.6-1.7-5.3-3.9H3.5v2.5A9.5 9.5 0 0 0 12 21z"/><path d="M6.7 13.3a5.7 5.7 0 0 1 0-3.6V7.2H3.5a9.5 9.5 0 0 0 0 8.6z"/><path d="M12 6.8c1.4 0 2.6.5 3.6 1.4L18.4 5.4A9.5 9.5 0 0 0 3.5 7.2l3.2 2.5C7.4 8.5 9.5 6.8 12 6.8z"/>',
  walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-6.5L14 17v4M8 11l3-3.5 3 2 2.5 3M11.5 14.5 10 9"/>',
  sofa: '<path d="M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3M2 12a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2zM5 17v2M19 17v2"/>',
  drop: '<path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/>',
  bigfoot: '<path d="M8 21c-1.5 0-2-1.5-1.5-3l1.5-5c.5-1.6.2-3.4-.5-5C6.6 5.6 8 3 10.5 3c3 0 4.5 2.4 4 5.5-.3 1.8.6 3.4 1.3 5l1.4 3.2c.8 1.8-.2 4.3-2.4 4.3z"/><circle cx="8" cy="5" r=".6"/>',
};
export const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;

// <img> for a manifest id: srcset from the variants, explicit dimensions, AI label where it applies.
export function img(id, { alt, cls = '', sizes = '100vw', eager = false, style = '', attrs = '', pick = 1 } = {}) {
  const m = IMG[id];
  if (!m) throw new Error('image id missing from images.json: ' + id);
  const a = alt ?? m.alt ?? '';
  const vs = m.variants;
  const def = vs[Math.min(pick, vs.length - 1)];
  const srcset = vs.length > 1 ? ` srcset="${vs.map((v) => `${asset(v.src)} ${v.w}w`).join(', ')}" sizes="${sizes}"` : '';
  const ai = m.aiKind ? ` data-ai="${m.aiKind}"` : '';
  return `<img src="${asset(def.src)}"${srcset} alt="${esc(a)}" width="${def.w}" height="${def.h}" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}${cls ? ` class="${cls}"` : ''}${ai}${style ? ` style="${style}"` : ''} ${attrs}>`;
}
export const imgSrc = (id, w = 0) => { const m = IMG[id]; const v = w ? (m.variants.find((x) => x.w >= w) || m.variants.at(-1)) : m.variants.at(-1); return asset(v.src); };
export const video = (id) => IMG._video[id];

export const kicker = (t, cls = '') => `<p class="kicker ${cls}"><span class="dot" aria-hidden="true"></span>${esc(t)}</p>`;
export const btn = (label, href, { kind = '', cls = '', attrs = '', ic } = {}) => {
  const ext = isExt(href);
  const target = ext ? ' target="_blank" rel="noopener"' : '';
  return `<a class="btn ${kind ? 'btn--' + kind : ''} ${cls}" href="${esc(u(href))}"${target} data-magnet ${attrs}><span>${label}</span>${icon(ic || (ext ? 'ne' : 'arrow'))}</a>`;
};
export const linkArrow = (label, href, cls = '') => `<a class="link-arrow ${cls}" href="${esc(u(href))}"${isExt(href) ? ' target="_blank" rel="noopener"' : ''}><span>${label}</span>${icon(isExt(href) ? 'ne' : 'arrow')}</a>`;
export const breadcrumb = (items) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((it, i) => (i < items.length - 1 ? `<li><a href="${esc(u(it[1]))}">${esc(it[0])}</a></li>` : `<li aria-current="page">${esc(it[0])}</li>`)).join('')}</ol></nav>`;

// tiny markdown: ##/### headings, paragraphs, lists, **bold**, *em*, [links](..)
export function md(src) {
  const inline = (t) => esc(t)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, a, h) => `<a href="${esc(u(h))}"${isExt(h) ? ' target="_blank" rel="noopener"' : ''}>${a}</a>`);
  const out = []; let list = null;
  for (const raw of String(src).split(/\n/)) {
    const line = raw.trimEnd();
    const li = line.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/);
    if (li) { if (!list) { list = /^\s*\d+\./.test(line) ? 'ol' : 'ul'; out.push(`<${list}>`); } out.push(`<li>${inline(li[1])}</li>`); continue; }
    if (list) { out.push(`</${list}>`); list = null; }
    if (!line.trim()) continue;
    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) { const lv = h[1].length; const id = h[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); out.push(`<h${lv} id="${id}">${inline(h[2])}</h${lv}>`); continue; }
    out.push(`<p>${inline(line)}</p>`);
  }
  if (list) out.push(`</${list}>`);
  return out.join('\n');
}
// one accent per heading: wrap the marked words *like this* in the ember italic
export const acc = (t, cls = '') => esc(t).replace(/\*([^*]+)\*/g, `<span class="acc ${cls}">$1</span>`);
export const plain = (t) => String(t).replace(/\*([^*]+)\*/g, '$1');
