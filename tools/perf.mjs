// perf.mjs: cold-load and scroll performance for a page, with network and CPU throttling (Chromium + CDP).
//   PW_CORE=... node tools/perf.mjs [--base http://127.0.0.1:8787] [--pages /,/shop/] [--out audit/perf.json]
// Desktop: 1440x900, 20 Mbps / 40 ms, CPU 1x.  Phone: 390x844 DPR 3, 9 Mbps / 60 ms, CPU 4x (a mid-range phone).
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require(process.env.PW_CORE || 'playwright-core');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg('--base', 'http://127.0.0.1:8787').replace(/\/$/, '');
const PAGES = arg('--pages', '/,/shop/').split(',');
const OUT = arg('--out', 'audit/perf.json');
const PROFILES = [
  { name: 'desktop', vp: { width: 1440, height: 900 }, dpr: 1, down: 20e6, lat: 40, cpu: 1 },
  { name: 'phone', vp: { width: 390, height: 844 }, dpr: 3, down: 9e6, lat: 60, cpu: 4, mobile: true },
];
const br = await chromium.launch();
const rows = [];
for (const pf of PROFILES) for (const rel of PAGES) {
  const ctx = await br.newContext({ viewport: pf.vp, deviceScaleFactor: pf.dpr, isMobile: !!pf.mobile, hasTouch: !!pf.mobile });
  await ctx.addInitScript(() => {
    try { localStorage.setItem('hp.age', '1'); sessionStorage.setItem('hp.splash', '1'); } catch (e) {}
    window.__lcp = 0; window.__fcp = 0; window.__long = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(e.duration); }).observe({ type: 'longtask', buffered: true });
  });
  const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: pf.lat, downloadThroughput: pf.down / 8, uploadThroughput: 2e6 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: pf.cpu });
  let bytes = 0, reqs = 0; const byType = {};
  cdp.on('Network.responseReceived', (e) => { e.response && (byType[e.requestId] = e.type); });
  cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; reqs++; const t = byType[e.requestId] || 'Other'; byType['_' + t] = (byType['_' + t] || 0) + e.encodedDataLength; });
  const t0 = Date.now();
  await p.goto(BASE + rel, { waitUntil: 'load', timeout: 120000 });
  const loadMs = Date.now() - t0;
  await p.waitForTimeout(2500);
  const first = await p.evaluate(() => ({ lcp: Math.round(window.__lcp), fcp: Math.round(window.__fcp), tbt: Math.round(window.__long.reduce((a, d) => a + Math.max(0, d - 50), 0)), longTasks: window.__long.length }));
  const bytesAtLoad = bytes;
  // scroll smoothness: frames painted while scrolling the page at a steady pace for ~4 s
  const fps = await p.evaluate(async () => {
    const H = document.documentElement.scrollHeight - innerHeight; let frames = 0, worst = 0, last = performance.now();
    const t0 = performance.now(); const dur = 4000;
    await new Promise((res) => { const step = (now) => { frames++; worst = Math.max(worst, now - last); last = now; const k = Math.min(1, (now - t0) / dur); window.scrollTo(0, H * k * 0.85); if (k < 1) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
    return { fps: Math.round(frames / (dur / 1000)), worstFrameMs: Math.round(worst) };
  });
  await p.waitForTimeout(1500);
  const typeKB = Object.fromEntries(Object.entries(byType).filter(([k]) => k.startsWith('_')).map(([k, v]) => [k.slice(1), Math.round(v / 1024)]));
  const row = { profile: pf.name, page: rel, loadMs, ...first, kbAtLoad: Math.round(bytesAtLoad / 1024), kbAfterScroll: Math.round(bytes / 1024), requests: reqs, ...fps, kbByType: typeKB };
  rows.push(row);
  console.log(`${pf.name.padEnd(7)} ${rel.padEnd(8)} FCP ${String(row.fcp).padStart(5)}ms  LCP ${String(row.lcp).padStart(5)}ms  load ${String(loadMs).padStart(6)}ms  TBT ${String(row.tbt).padStart(5)}ms  ${String(row.kbAtLoad).padStart(6)} KB at load / ${row.kbAfterScroll} KB after scroll, ${reqs} req  scroll ${row.fps} fps (worst frame ${row.worstFrameMs} ms)`);
  await ctx.close();
}
await br.close();
fs.mkdirSync('audit', { recursive: true });
const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
prev.push({ at: new Date().toISOString(), base: BASE, rows });
fs.writeFileSync(OUT, JSON.stringify(prev, null, 1));
