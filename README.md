# Esteh Indonesia, Premium Redesign Template (OmniStack Digital)

Redesign template for [estehindonesia.com](https://www.estehindonesia.com/) built from the
site's **real** brand assets, extracted colors, logo, photography, and copy. No placeholders.

## Workflow

**Part 1, Extraction** (`npm run extract`)

`scripts/extract.mjs` opens the live site (home, `/corporate`, `/news`, `/partnership`,
`/merchandise`, `/membership`) in headless Chromium and:

- captures every image the pages request (network response sniffing) plus all
  `<img src>`/`srcset`, CSS `background-image`, `/_next/static/media/*` and `/images/*` URLs,
  resolving `/_next/image?url=…` optimizer URLs to their originals
- downloads every unique image ≥1KB into `assets/images/` with original filenames
- fetches every `@font-face` font declared in the site's CSS into `assets/brand/fonts/`
- extracts the palette from computed styles (body/header/nav/buttons/links/footer/brand-ish
  class names) and every stylesheet (in-page rules + raw `/_next/static/css/*` files),
  deduped and frequency-sorted, each hex tagged with where it was found
- reads logo colors directly from SVG fills / dominant raster pixels (brand ground truth)
- records real heading/body `font-family` values
- writes `assets/brand/extraction-raw.json` and `assets/brand/image-manifest.json`
  (filename, dimensions, dominant colors, source URL)

The curated output is `assets/brand/design-tokens.json`, named colors with exact extracted
hex values and provenance notes, fonts, real copy (address, socials, milestones, menu,
partnership and store-opening copy, all sourced from the live site), and the annotated image
manifest. **All template colors and images trace back to this file.**

Test the pipeline without touching the live site:

```sh
node scripts/extract.mjs --base http://127.0.0.1:8081 --pages "/"
```

**Part 2, Template** (`npm run dev`)

Single-page premium template, Vite + Lenis (smooth scroll) + GSAP/ScrollTrigger (scroll
animation). Colors only via CSS custom properties generated from `design-tokens.json`; every
image and font from `public/` (copied from `assets/`, real assets only). Ports to Next.js 15
later.

### Wordmark

The real logo reads `es` + interpunct dot + `teh`, where the accent above the second word's
`e` is not a typographic acute accent. It is a small tilted green leaf glyph, pixel-verified
from the real logo file (`assets/images/logo-color.40669c9a.png`). The template renders this
literally: plain `e` + a positioned leaf SVG (`public/images/icon-leaf.svg`), never the
Unicode `é` character. See `assets/brand/design-tokens.json` → `wordmark` for the full note.

### Sections

Fixed nav (real logo, mix-blend-mode difference, animated underlines) · hero (real photography,
split-text reveal, scroll parallax) · brand film (scroll-triggered playback of the provided
product video, graceful static fallback if a browser can't decode it) · story (real photography,
milestones sourced from the Corporate page, count-up on scroll) · menu (real current signature
line-up, 3D tilt-on-hover, stagger-in on scroll, accent-green glow) · store opening timeline
(real 7-step process from the Partnership page) · partnership CTA (real recruitment copy,
magnetic button) · footer (real address, real socials).

Global polish: custom cursor (fine pointer only), SVG grain overlay, full
`prefers-reduced-motion` support, mobile-responsive with tilt/cursor disabled and `clamp()`
hero type.

## Status

- [x] Extraction pipeline built and verified end-to-end (fixture site, then the live site)
- [x] Live-site extraction complete: real images, real fonts (Esteh Sans), real palette, real
      copy pulled from estehindonesia.com
- [x] `assets/brand/design-tokens.json` curated with provenance notes
- [x] Template built: all sections, all interactions, `npm run dev` and `npm run build` both
      clean with zero console errors
- [x] Full-page screenshots captured at 1440px and 390px

### Known limitation

Individual per-flavor product photography lives on
`estehindonesia.sgp1.cdn.digitaloceanspaces.com`, a separate CDN host still blocked by this
environment's egress policy. The menu section therefore presents the real, current signature
flavor names typographically rather than with mismatched or placeholder photography. Once that
host is allowlisted, `npm run extract` will pull those photos and the menu cards can be
upgraded to include them.
