# Mobile Optimization Audit — The Talus Field

Status tracker for the mobile overhaul. ~70% of traffic is mobile, much of it in-park on
slow/absent cellular. Scope: every section of every page across the editorial site, the
Field Guide PWA, and supporting infra.

Decisions on record:
- Editorial site stays **build-free** — optimize around in-browser Babel, do not add a bundler.
- **Full responsive image pipeline**, generated offline and committed.
- Map stays **Google Maps**; be honest about online-only and deep-link to native maps.
- **Measure before/after** each phase (Lighthouse mobile).

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` out of scope

---

## Baseline

> Note: this sandbox has Node but **no Chrome/Lighthouse and no display**, so real Lighthouse/
> PSI field numbers must be captured from a device or PageSpeed Insights. Below are objective
> proxy metrics (measurable here) that map directly to LCP and transpile cost; re-measure the
> same proxies after each phase, and run real Lighthouse mobile on your machine at check-ins.

### Proxy baseline (captured 2026-05-23, pre-Phase-1)

| Metric | Baseline | Target |
|---|---|---|
| Editorial `img/` total weight | 37 MB | < 8 MB |
| Heaviest hero (`tunnel-view-autumn`) | 8.97 MB | < 0.2 MB (800w AVIF) |
| Images > 3 MB | 5 | 0 |
| Babel-transpiled scripts in `index.html` | 40 | ~17 (bodies lazy-loaded) |
| ...article bodies loaded on home | 23 | 0 |
| React build | dev (unminified) | production minified |
| PWA `photos/` total weight | 5.2 MB | < 2 MB |

### Lighthouse mobile (run on device / PSI — fill at check-ins)

| Page | Perf | LCP | INP | CLS | Date |
|---|---|---|---|---|---|
| Editorial — home | | | | | |
| Editorial — article | | | | | |
| Editorial — /map | | | | | |
| PWA — home (region picker) | | | | | |
| PWA — stop detail | | | | | |
| PWA — /map | | | | | |

---

## Phase 0 — Baseline & audit doc
- [x] Write this file (issue inventory + tracker)
- [x] Capture proxy baseline metrics (image weight, script count, React build)
- [ ] Capture Lighthouse mobile for the six pages (device/PSI — outside sandbox)

## Phase 1 — Performance foundation
- [x] `scripts/gen-responsive-images.mjs` (sharp) → committed `img/responsive/<slug>-<w>.{avif,webp,jpg}` at 400/800/1200/1600, no upscale, idempotent
- [x] Root `package.json` with `sharp` devDependency + `images` script
- [x] `ResponsiveImage` component in `components.jsx` (+ `SIZES_HERO/CARD/BODY`)
- [x] Wire `ResponsiveImage` into `Placeholder` (no changes to `data.js`/bodies)
- [x] Static home-hero `<link rel=preload imagesrcset>` in `index.html`; render-time preload for article heroes (`preloadResponsive`)
- [x] Lazy-load the 23 article bodies (`window.loadArticleBody`, `BODY_VERSIONS`); remove body `<script>` tags from `index.html`; `page-article.jsx` `useEffect([slug])`
- [x] Switch CDN React to production minified builds (SRI computed from npm UMD)
- [x] `data-presets="react"` on `type="text/babel"` scripts
- [x] Extend `scripts/check-cache-busters.sh` to lint `BODY_VERSIONS` (passes)
- [x] PWA: `<picture>`/srcset in `StopCard.tsx` via `ResponsivePhoto`; PWA build passes
- [x] CLS: aspect-ratio already on placeholder/card wrappers; `font-display: swap` confirmed
- [x] Bump `?v=` to 80 on editorial files; `check-cache-busters.sh` passes
- [ ] Check-in: re-run Lighthouse on device/PSI, record delta (sandbox has no browser)

### Phase 1 evidence (measured in sandbox)
- Heavy hero `half-dome-glacier-point-road-josh-carter.jpg`: 4.30 MB → **106 KB** (800w AVIF served to phones), ~97% smaller.
- Babel-transpiled scripts in `index.html`: 40 → **17** (23 bodies now load on demand).
- React: dev (unminified) → **production min** with recomputed SRI.
- Slug mapping verified incl. spaced filenames (`Half Dome Main Photo.jpg` → `half-dome-main-photo-*`).

> Sandbox limit: no Chrome and unpkg/Google-Fonts CDNs are not in the network
> allowlist, so the editorial site cannot be loaded in a browser here. Editorial
> runtime verification (the `<picture>` serving AVIF, lazy body loading, prod React
> booting) must be done by the owner locally / on a device. PWA build verified here.

## Phase 2 — Touch targets & thumb zones
- [x] Editorial: nav CTA + primary (`min-height: 44px; display: inline-flex`) 
- [x] Editorial: hamburger `nav__menu-toggle` bumped 32px → 44×44px
- [x] Editorial: map sidebar `trip-btn` 22px → 32px desktop / 44px mobile; `region-stop-add` 24px → 32px/44px; `region-toggle` + `region-add` + `quickpick` → `min-height: 44px`
- [x] Editorial: global `button/a :focus-visible` + `:active` tap feedback
- [x] Editorial map: visual toast (`.map-sidebar__toast`) on stop add/remove (+ existing aria-live for SR)
- [x] PWA: `.gps-chip` → `min-height: 44px; padding: 10px 12px; align-items: center`
- [x] PWA: `.map-tabbar__tab`, `.map-itinerary`, `.map-stop` → `min-height: 44px`
- [x] PWA: bottom tab bar `BottomNav.tsx` (Guide / Map / Account) in `GatedChrome`; fixed to viewport bottom with safe-area inset; content offset via `.bottom-nav-offset`; `GatedChrome` header hidden on ≤640px (bottom nav is primary)
- [x] PWA: sticky Prev/Next — `.stop-prevnext` class; on ≤640px `position: sticky; bottom: calc(56px + safe-area + 8px)` with backdrop-blur
- [x] PWA: Login `paddingTop/Bottom` → `clamp(32px, 10vh, 96px)`; `inputMode` + `enterKeyHint` on both fields; `autoCorrect="off"`; loading spinner (`.spinner` CSS animation)
- [x] PWA: Map height adjusted for bottom nav (`100dvh - 56px - 56px - safe-area`)
- [ ] Check-in: device-width walkthrough (outside sandbox)

## Phase 3 — Outdoor legibility & accessibility
- [ ] Lift tertiary text contrast (`--ink-3`); enlarge 10px eyebrow/`.mono` on mobile
- [ ] `prefers-color-scheme: dark` in both apps (default light)
- [ ] Site-wide `:focus-visible` outlines
- [ ] `prefers-reduced-motion` handling
- [ ] Check-in: axe + Lighthouse a11y

## Phase 4 — PWA mobile UX & offline honesty
- [ ] Login/Open: `inputMode`, `enterKeyHint`, loading spinner, responsive padding
- [ ] Route-based code splitting (`React.lazy`)
- [ ] Map: online-only made explicit; verify native deep-link; tighten 720px breakpoint
- [ ] SW pre-cache stop coords + photos on region load (`public/sw.js`)
- [ ] Wire missing stop photos (~9 of ~21 exist)
- [ ] Platform-aware `InstallPrompt.tsx` (Android prompt / iOS instructions)
- [ ] Reconsider manifest `orientation` lock
- [ ] Check-in: airplane-mode offline walkthrough

## Phase 5 — Mobile SEO / AI Overviews
- [ ] `Article` JSON-LD on article pages
- [ ] `TouristAttraction` + `GeoCoordinates` on stops/places
- [ ] `FAQPage` on planning guide / Q&A articles
- [ ] `BreadcrumbList`
- [ ] Validate with Google Rich Results test
- [ ] Final before/after Lighthouse across all six pages

---

## Full issue inventory (from audit)

### Editorial site
- 8.6MB hero JPEG (`tunnel-view-autumn-aniket-deole.jpg`); ~25MB of oversized JPEGs total, served full-res to phones; no srcset/`<picture>` anywhere.
- 40 `<script type="text/babel">` files transpiled in-browser every load; all 23 article bodies load on the home page though none render there.
- React loaded as unminified dev builds from CDN.
- Map sidebar trip/up/down/remove buttons 22–28px (< 44px); InfoWindow max-width 300px crowds narrow phones; no add/remove confirmation.
- Nav CTA ~32px tall; `:focus`/`:active` only on map elements (no tap feedback elsewhere).
- Tertiary text `--ink-3` (#6e5c43 ≈4.5:1) + 10px eyebrow/`.mono` labels hard to read in sun.
- No dark mode; no `prefers-reduced-motion`.
- Breakpoints 720/880/480/420 otherwise solid; grids collapse cleanly; no horizontal overflow.

### Field Guide PWA
- Photos 1200×900, no srcset; only ~9 of ~21 stops have photos (rest show placeholder, so offline visual guide doesn't cache).
- No route-based code splitting (single bundle).
- Touch targets: GPS chips ~20px, meta chips ~20px, map itinerary ~30px, map stop-list ~24px (all < 44px).
- No bottom navigation; relies on top `GatedChrome` links.
- Login/Open: missing `inputMode`/`enterKeyHint`, no loading spinner; 96px top/bottom padding wastes small-screen vertical space.
- Map is Google Maps, online-only — defeats offline-first promise; SW (`public/sw.js`) caches shell + photos but not coords/structured data.
- Manifest locks `orientation: portrait`.
- No dark mode; secondary text contrast ~4.5:1.
- Single 720px breakpoint (`Map.css`) — itineraries sidebar crowds map on ~390px screens.

### SEO / page experience
- Editorial has `WebSite` + `Organization` JSON-LD only; missing `Article`, `TouristAttraction`, `FAQPage`, `BreadcrumbList`.
- Viewport, HTTPS, `noscript` fallback, OG/Twitter tags all present and good.

---

## Out of scope (future candidates)
- [-] Bundler/build step for the editorial site (owner decision: keep no-build).
- [-] Offline raster map tiles (MapLibre + bundled tiles) — larger effort, deferred.
- [-] Stripe checkout mobile flow — checkout currently disabled; revisit when re-enabled.
