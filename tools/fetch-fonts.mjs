// fetch-fonts.mjs: self-host the open fonts this design uses (latin subset), writing src/assets/fonts/*.woff2 and
// src/styles/00-fonts.css. Owner's pick (option D, 2026-11-20): Cinzel (Roman capitals like the logo's PREMIUM) for
// headlines, EB Garamond (the live age check's face, roman + italic) for reading and accent words, Jost (open Futura
// stand-in, the live site's body face) for buttons and labels. All SIL OFL. Every descriptor Google sends is copied.
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('src/assets/fonts');
fs.mkdirSync(OUT, { recursive: true });
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Jost:wght@300..800&display=swap';
const UA = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' };
const css = await fetch(CSS_URL, { headers: UA }).then((r) => r.text());
const parts = css.split(/(?=\/\*\s*[\w-]+\s*\*\/\s*@font-face)/);
let out = '/* Self-hosted, latin subset. Cinzel, EB Garamond and Jost, all SIL Open Font License. */\n';
for (const part of parts) {
  const subset = (part.match(/^\/\*\s*([\w-]+)\s*\*\//) || [])[1];
  if (subset !== 'latin') continue;
  const b = part.slice(part.indexOf('@font-face'));
  const fam = b.match(/font-family:\s*'([^']+)'/)[1];
  const style = b.match(/font-style:\s*(\w+)/)[1];
  const weight = b.match(/font-weight:\s*([\d ]+);/)[1].trim();
  const stretch = (b.match(/font-stretch:\s*([^;]+);/) || [])[1];
  const url = b.match(/url\(([^)]+)\)/)[1];
  const range = b.match(/unicode-range:\s*([^;]+);/)[1];
  const name = `${fam.toLowerCase().replace(/\s+/g, '-')}-${style === 'italic' ? 'italic' : 'roman'}.woff2`;
  const buf = Buffer.from(await fetch(url, { headers: UA }).then((r) => r.arrayBuffer()));
  fs.writeFileSync(path.join(OUT, name), buf);
  out += `@font-face{font-family:'${fam}';font-style:${style};font-weight:${weight};${stretch ? `font-stretch:${stretch};` : ''}font-display:swap;src:url(../fonts/${name}) format('woff2');unicode-range:${range};}\n`;
  console.log(name, buf.length);
}
fs.writeFileSync('src/styles/00-fonts.css', out);
