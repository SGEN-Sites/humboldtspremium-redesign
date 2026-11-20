# Fog & Firelight: the design system

**Idea:** Arcata's backyard. The site behaves like one evening in the store's courtyard: coastal fog by day, golden
hour, dusk, then the fire. It leads with the place (the courtyard and the newly approved outdoor lounge), not the menu.

## Brand

- **Logo:** the client's own mark, unchanged. A light variant (gold-to-cream lettering, like the store's pole sign)
  is used on dark grounds; the original on light grounds.
- **Palette** (from the logo file, measured): sun gold `#FDC232`, pale sun `#FCE594`, slate outline `#6592B6`,
  evergreen `#00353F`, redwood trunk `#C2622F`. Derived: redwood-night grounds (`#120C08` to `#3A2418`), ember
  `#E8732C`, fog `#F4EDE2`, marsh sage `#8F9D74`. Contrast notes live beside each token in `src/styles/01-tokens.css`.
- **Type:** Fraunces (soft, warm lodge serif; italic "wonky" accents for one word per heading) and Figtree (UI and
  body). Both SIL OFL, self-hosted, latin subset.

## The three planes

1. **Back plane, bands:** warm near-black grounds, one key light per band that follows the pointer, clipped backdrops
   (photo, fog, embers), grain.
2. **Mid plane, glass:** frosted "fog on a window" panels only over varied backdrops; the mega menus stay near-opaque.
3. **Front plane, depth:** product renders and redwood sprigs that cross section seams and card tops, parallax on scroll.

## Signature moments

- **Splash:** the logo's sunburst rises out of the fog, embers lift; once per visit, about 1.6 s, any input skips it,
  then hands off to the 21+ check (which overlays the real page instead of replacing it).
- **Hero:** the store's own courtyard photo, relit to dusk, in motion (AI loop: water, fog, lantern flicker), fog layers
  that part around the cursor, rising embers that scatter from the pointer, a cursor firelight glow.
- **Slat wall:** the store's slatted walls become the reveal: at rest you look through thin slats at the photo; hover
  (or scrolling into view on touch) turns them open. The category wall puts each product above slatted cards.
- **Daily deals board:** split-flap style, today lights up gold automatically (Pacific time).
- **Open-now status** everywhere (utility line, hero bar, sticky bar, hours lists), computed from the posted hours.
- **Shop by feeling:** Relax (fireside), Balance (golden marsh), Uplift (morning fog in the redwoods).
- **Sticky pickup bar** past the hero; hidden at the footer, with the menu open and while typing; x hides it for the visit.

## The live site's effects, kept and taken further

The live site's own signature is an ambient full-screen golden-hour video (a coastal sunset with rolling waves) behind
the age check and the pages, a dark water texture, and fade-in entrances. The redesign keeps that idea: ambient
golden-hour motion behind everything. It is now the client's own courtyard at dusk instead of stock footage. Coastal
water becomes drifting fog, and the fade-ins become "light on" reveals (fade, rise, unblur, brighten).

## Motion rules

Transform, opacity and filter only; one rAF scroll loop; pointer effects only for fine pointers; videos never load
under reduced motion or Save-Data; everything is visible without JavaScript; all motion stops under
`prefers-reduced-motion`.

## House rules applied

No dashes before eyebrows; one accent per heading; no outlined text; flush cards (no overlapping cards); full-width
stacked buttons on phones; equal-width buttons in a group; no product shelves; no visible "AI" tags (AI imagery is
labelled in alt text, `data-ai` and the footer note).
