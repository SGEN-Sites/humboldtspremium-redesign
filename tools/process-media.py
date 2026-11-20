#!/usr/bin/env python3
"""process-media.py: turn the private source media into the site's shipped WebP / MP4 files and write
src/content/images.json (id -> variants, intrinsic size, provenance, AI label).

Sources live in private/ (never published). Run with:  python3 -I tools/process-media.py [--only id,id]
Provenance kinds:
  live      = image served by the live site (humboldtspremiumarcata.com, wixstatic CDN)
  owner     = the business's own photo on its Google Maps listing ("By owner" tab)
  press     = the store's photo as published in California Leaf (Feb 2025, photos by Amy Alves)
  edited    = an owner photo relit with AI (structure kept; IPTC + data-ai="edited")
  generated = AI-generated mood or category art (IPTC + data-ai="generated"); never stands in for the real store
"""
import json, os, subprocess, sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
OUT = P('src/assets/img')
VOUT = P('src/assets/video')
try:
    import imageio_ffmpeg; FF = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    FF = 'ffmpeg'
os.makedirs(OUT, exist_ok=True); os.makedirs(VOUT, exist_ok=True)

G = 'private/gen'; S = 'private/sources'
# id: (source, kind, widths, crop(l,t,r,b fractions) or None, alt, quality)
IMAGES = {
  # --- the real place (owner / live / press) ---
  'courtyard-day':      (f'{S}/gmaps-owner/own-7.jpg', 'owner', [800, 1400, 2200], None, 'The courtyard in daylight: teal-cushioned wicker sofas, a round teak table and chairs, the rock waterfall and the sunburst sign over the gate', 86),
  'waterfall-day':      (f'{S}/gmaps-owner/own-6.jpg', 'owner', [800, 1400, 2000], None, 'The rock waterfall in the courtyard, with a small Bigfoot statue sitting on the rocks', 86),
  'courtyard-teal':     (f'{S}/gmaps-owner/own-2.jpg', 'owner', [640], None, 'Teal wicker sofas and teak tables on the courtyard turf', 86),
  'storefront-day':     (f'{S}/gmaps-owner/own-0.jpg', 'owner', [800, 1400, 2000], None, "The Humboldt's Premium storefront at 460 I St with the sunburst redwood mural", 86),
  'storefront-dusk':    (f'{S}/gmaps-owner/own-8.jpg', 'owner', [700, 1441], None, 'The store at dusk with its wall lights on', 88),
  'storefront-night':   (f'{S}/live/ba64af_091071175953464297e8ac6318d375bb-mv2.jpg', 'live', [800, 1400, 2000], None, 'The store and courtyard wall lit up at night, seen across the parking lot', 86),
  'street-view':        (f'{S}/gmaps-owner/own-3.jpg', 'owner', [800, 1400], None, 'The building on I Street', 86),
  'interior-wide':      (f'{S}/live/ba64af_4dd63dca4a464ceda299fb6660e8c619-mv2.jpg', 'live', [800, 1400, 2200], None, 'Inside the Arcata store: glass counters, slat walls and square pendant lights', 86),
  'interior-counter':   (f'{S}/gmaps-owner/own-1.jpg', 'owner', [800, 1400, 2000], None, 'The counter and slat walls inside the store', 86),
  'interior-door':      (f'{S}/live/ba64af_0fbd16be5bf64ce2bb76df0489b0a037-mv2.jpg', 'live', [800, 1400], None, 'The sales floor and front door inside the store', 86),
  'glass-case':         (f'{S}/live/ba64af_d5600c20948f4958853a8a05710b5f57-mv2.jpg', 'live', [800, 1599], None, 'Glass pipes and bongs in a lit display case', 86),
  'merch-tees':         (f'{S}/live/ba64af_6c0cadeb3c3c4417a2144ee8663c7b59-mv2.jpg', 'live', [600, 1000], None, "Humboldt AF and Humboldt's Premium t-shirts on the wall", 86),
  'sign-pole':          (f'{S}/leaf/leaf-Sign.jpg', 'press', [667], None, "The Humboldt's Premium Dispensary pole sign against a blue sky", 88),
  'leaf-gazebos':       (f'{S}/leaf/leaf-Arcata-Lounge-1.jpg', 'press', [889], None, 'Covered gazebos and teak chairs in the courtyard lounge on a sunny day', 88),
  'leaf-interior':      (f'{S}/leaf/leaf-Arcata-Dispensary.jpg', 'press', [1392], None, 'A wide view of the sales floor with its glass counters and coolers', 88),
  'house-products':     (f'{S}/leaf/leaf-Humboldts-Premium-Products.jpg', 'press', [889], None, "House-brand 707 Rolls preroll packs and a Widowmaker mini on the counter", 88),
  'team-dustin':        (f'{S}/live/ba64af_7040f160ce454b5ca0298a983e7d189d-mv2.jpg', 'live', [631], None, 'Dustin', 86),
  'team-justin':        (f'{S}/live/ba64af_9bf2ff8271db447da8cb5547b4fdf0bd-mv2.jpeg', 'live', [600, 1000], None, 'Justin', 86),
  'team-misha':         (f'{S}/live/ba64af_518c90ac0cd443b69c5e13a58f46bce6-mv2.jpg', 'live', [600, 1000], None, 'Misha', 86),
  'team-james':         (f'{S}/live/ba64af_54a013cb8c6c423f9e1a21db94ff9ee7-mv2.jpg', 'live', [600, 935], None, 'James', 86),
  # --- owner photos relit with AI (structure kept) ---
  'courtyard-dusk':     (f'{G}/fal1/out/nb-courtyard-dusk-a.png', 'edited', [960, 1600, 2400, 3200], None, 'The courtyard at dusk: lanterns glowing, the waterfall softly lit, teal sofas and the teak table under a fading sky', 88),
  'courtyard-night':    (f'{G}/fal1/out/nb-courtyard-night.png', 'edited', [960, 1600, 2400], None, 'The courtyard at night under the stars, the lanterns and waterfall lights glowing warm', 88),
  'courtyard-sunset':   (f'{G}/hf2/out/rl2-courtyard-dusk-a.png', 'edited', [960, 1600, 2336], None, 'The courtyard at sunset with fog drifting through the tall trees', 88),
  'waterfall-golden':   (f'{G}/fal1/out/nb-waterfall-golden.png', 'edited', [800, 1400, 2200], None, 'The rock waterfall and its Bigfoot statue in late golden-hour light', 88),
  # --- generated mood (never the store) ---
  'redwood-fog':        (f'{G}/hf1/out/scene-redwood-fog.png', 'generated', [960, 1600, 2688], None, 'Fog drifting between old-growth redwood trunks at sunrise', 86),
  'marsh-golden':       (f'{G}/hf1/out/scene-marsh-golden.png', 'generated', [960, 1600, 2688], None, 'Marsh grasses and still water at golden hour with fog on the far shore', 86),
  'fire-table':         (f'{G}/hf1/out/scene-fire-table.png', 'generated', [800, 1400, 2048], None, 'Flames dancing along an outdoor fire table at blue hour', 86),
  'fog-hills':          (f'{G}/hf1/out/scene-fog-hills.png', 'generated', [1200, 2000, 2688], None, 'Coastal fog rolling over dark redwood hills under an amber dusk sky', 86),
  'plate-embers':       (f'{G}/hf1/out/plate-embers.png', 'generated', [1200, 2000], None, '', 82),
  'plate-fog':          (f'{G}/hf1/out/plate-fog.png', 'generated', [1400, 2400], None, '', 82),
}
CUTS = {  # transparent cut-outs (fal BiRefNet v2) of generated category art + floating objects
  'cat-flower': 'Cannabis flower beside a small glass jar', 'cat-prerolls': 'Three pre-rolled joints', 'cat-vape': 'A vape cartridge on a slim battery',
  'cat-concentrates': 'A jar of golden live resin with diamonds', 'cat-edibles': 'Cannabis gummies in a stone dish', 'cat-drinks': 'A cold beverage can',
  'cat-tinctures': 'A tincture dropper bottle', 'cat-topicals': 'A tin of balm and a lotion bottle', 'cat-cbd': 'A CBD dropper bottle with soft gels',
  'cat-accessories': 'A brass grinder, rolling papers and a glass pipe', 'cat-humboldt': 'A cannabis bud on redwood bark',
  'obj-redwood-sprig-a': '', 'obj-redwood-sprig-b': '', 'obj-maple-leaf': '',
}

def webp(im, path, q, lossless=False):
    im.save(path, 'WEBP', quality=q, method=6, lossless=lossless)

def run_images(only):
    man = {}
    for k, (src, kind, widths, crop, alt, q) in IMAGES.items():
        if only and k not in only: continue
        im = ImageOps.exif_transpose(Image.open(P(src))).convert('RGB')
        if crop:
            W, H = im.size; im = im.crop((int(crop[0]*W), int(crop[1]*H), int(crop[2]*W), int(crop[3]*H)))
        W, H = im.size; vs = []
        for w in sorted(set(min(w, W) for w in widths)):
            h = round(H * w / W); f = f'{k}-{w}.webp'
            webp(im.resize((w, h), Image.LANCZOS) if w != W else im, os.path.join(OUT, f), q)
            vs.append({'src': f'img/{f}', 'w': w, 'h': h})
        man[k] = {'kind': kind, 'w': W, 'h': H, 'variants': vs, 'alt': alt, 'ai': kind in ('edited', 'generated'), 'aiKind': kind if kind in ('edited', 'generated') else None, 'source': src.replace(f'{S}/', 'sources/').replace(f'{G}/', 'gen/')}
        print(k, kind, W, H, [v['w'] for v in vs])
    for k, alt in CUTS.items():
        if only and k not in only: continue
        f = P(f'{G}/cut/out/cut-{k}.png')
        if not os.path.exists(f): print('MISSING cut', k); continue
        im = Image.open(f).convert('RGBA')
        bbox = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
        if bbox:
            pad = int(max(im.size) * 0.02); l, t, r, b = bbox
            im = im.crop((max(0, l - pad), max(0, t - pad), min(im.size[0], r + pad), min(im.size[1], b + pad)))
        W, H = im.size; vs = []
        for w in sorted(set(min(w, W) for w in [360, 720, 1100])):
            h = round(H * w / W); fn = f'{k}-{w}.webp'
            (im.resize((w, h), Image.LANCZOS) if w != W else im).save(os.path.join(OUT, fn), 'WEBP', quality=88, method=6)
            vs.append({'src': f'img/{fn}', 'w': w, 'h': h})
        man[k] = {'kind': 'generated', 'w': W, 'h': H, 'variants': vs, 'alt': alt, 'ai': True, 'aiKind': 'generated', 'cutout': True, 'source': f'gen/cut/out/cut-{k}.png'}
        print('cut', k, W, H)
    return man

def run_logo():
    # the client's own logo files from the live site (wixstatic), kept as-is; WebP with alpha for the page, PNG for og:image
    man = {}
    for k, src in [('logo', f'{S}/live/logo-client-provided.png'), ('logo-sticker', f'{S}/live/logo-sticker.png'), ('logo-af', f'{S}/live/ba64af_00_af-logo.png')]:
        if not os.path.exists(P(src)): print('MISSING logo', src); continue
        im = Image.open(P(src)).convert('RGBA'); bbox = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
        if bbox: im = im.crop(bbox)
        W, H = im.size; vs = []
        for w in sorted(set(min(w, W) for w in [240, 480, 960])):
            h = round(H * w / W); fn = f'{k}-{w}.webp'
            (im.resize((w, h), Image.LANCZOS) if w != W else im).save(os.path.join(OUT, fn), 'WEBP', lossless=True, method=6, exact=True)
            vs.append({'src': f'img/{fn}', 'w': w, 'h': h})
        im.resize((960, round(H * 960 / W)), Image.LANCZOS).save(os.path.join(OUT, f'{k}.png'), optimize=True)
        man[k] = {'kind': 'live', 'w': W, 'h': H, 'variants': vs, 'png': f'img/{k}.png', 'alt': "Humboldt's Premium", 'ai': False, 'source': src}
        print('logo', k, W, H)
    return man

def run_video():
    jobs = [
      ('courtyard-dusk', f'{G}/vid/out/loop-courtyard-dusk.mp4', [(1920, 23), (1280, 24)]),
      ('fire-table', f'{G}/vid/out/loop-fire-table.mp4', [(1280, 24)]),
    ]
    man = {}
    for k, src, outs in jobs:
        files = []
        for w, crf in outs:
            f = f'{k}-{w}.mp4'
            subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y', '-i', P(src), '-an', '-vf', f'scale={w}:-2:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-g', '48', '-movflags', '+faststart', '-metadata', 'comment=AI-generated motion (Higgsfield Kling 3.0) from an AI-relit owner photo', os.path.join(VOUT, f)], check=True)
            files.append({'src': f'video/{f}', 'w': w, 'bytes': os.path.getsize(os.path.join(VOUT, f))})
        poster = f'{k}-poster.webp'
        subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y', '-i', P(src), '-vframes', '1', '-vf', 'scale=1600:-2', os.path.join(VOUT, 'tmp.png')], check=True)
        Image.open(os.path.join(VOUT, 'tmp.png')).convert('RGB').save(os.path.join(VOUT, poster), 'WEBP', quality=82, method=6); os.remove(os.path.join(VOUT, 'tmp.png'))
        man[k] = {'files': files, 'poster': f'video/{poster}', 'ai': True, 'source': src.replace(f'{G}/', 'gen/')}
        print('video', k, [(x['w'], x['bytes']) for x in files])
    return man

if __name__ == '__main__':
    only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else set()
    mf = P('src/content/images.json')
    man = json.load(open(mf)) if os.path.exists(mf) else {}
    man.update(run_images(only))
    if not only or 'logo' in only: man.update(run_logo())
    if not only or 'video' in only:
        vm = run_video(); man['_video'] = vm
    json.dump(man, open(mf, 'w'), indent=1)
    print('images.json', len([k for k in man if not k.startswith('_')]))
