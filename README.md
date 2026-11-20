# Humboldt's Premium Arcata: redesign preview

A design concept for [humboldtspremiumarcata.com](https://www.humboldtspremiumarcata.com/): **"Arcata's Backyard"**,
a dispensary site led by the store's courtyard and its newly approved outdoor lounge, with the live store's whole
menu and every live URL kept. Static, platform-free, no runtime dependencies.

- Preview (noindex): https://sgen-sites.github.io/humboldtspremium-redesign/
- Design system: [docs/DESIGN.md](docs/DESIGN.md) · Pitch notes and open questions: [docs/PITCH-NOTES.md](docs/PITCH-NOTES.md)
- Pages and URLs: [docs/IA.md](docs/IA.md) · Image provenance: [docs/MEDIA.md](docs/MEDIA.md)

## Build

```bash
node src/build.mjs                                   # -> dist/  (production paths)
node src/build.mjs --preview --out dist-preview --base /humboldtspremium-redesign/   # the Pages preview
```

Node 18+, builtins only. Content: `facts/client-facts.json` (every fact with its source), `src/content/products.json`
(the live menu, captured 2026-11-20 by `tools/capture-products.mjs`), `src/content/learn.json` (guides, glossary, FAQ),
`src/content/images.json` (media manifest written by `tools/process-media.py`).

## Checks

```bash
PW_CORE=<playwright-core> node tools/check.mjs --vp 1440x900,1024x768,390x844,360x740   # errors, images, overflow, 404s, one H1
PW_CORE=<playwright-core> node tools/ui-test.mjs                                        # splash, gate, video, menus, sticky bar, live add-to-cart
```

Shop buttons and the bag open the live store (its product pages and cart). Prices are a snapshot; the live store is the
final word.
