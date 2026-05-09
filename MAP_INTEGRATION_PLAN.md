# Map Integration Plan — The Talus Field

> Status: proposal, not yet implemented. Branch: `claude/plan-map-integration-PS9OP`.
> Scope: editorial site at `thetalusfieldjournal.com` (repo root). The Field Guide PWA at `apps/guide/` is out of scope; we reuse its stop coordinates.

---

## 1. Executive summary

Build a dedicated **`/map` page** on the editorial site that aggregates every location referenced across articles into clickable pins on a **topographic basemap**, with a scrollable list on the left and the map on the right. Use **Leaflet (UMD via CDN) + USGS National Map Topo tiles** — both free, commercial-OK, and the most "field-guide" aesthetic available. Pins are stored as a single GeoJSON file checked into the repo and edited the same way articles are. A `?admin=1` overlay turns the map into a coordinate-capture tool so adding pins is "click on the map, copy the coords into the file."

**Why this shape:**
- Matches the existing no-build, vanilla-React, cache-buster workflow (no Vite, no bundler, no CMS).
- Reuses 20 of ~21 PWA stop coords as seed data; only ~8 new pins need to be coordinate-hunted.
- Lands on the natural empty slot: `page-places.jsx` already has the comment *"Replaces the old NPS map"* (line 61) — that intent has been waiting for this feature.

---

## 2. Key questions, answered

| Question | Decision | Why |
|---|---|---|
| Google Maps, Mapbox, or something else? | **Leaflet + USGS Topo** | Free, public-domain, commercial-OK, no API key. USGS quad style is the canonical Yosemite field-guide look. Google Maps is generic and consumer; Mapbox is editorial but requires billing + key. |
| Roadmap or topo? | **Topo, with an aerial toggle** | Yosemite's vertical relief *is* the story. USGS Topo for default; Esri World Imagery as a free aerial layer toggle. |
| How do users interact? | **List-left / map-right split + bidirectional hover/click sync** | Dominant pattern for editorial-discovery maps (Atlas Obscura, AllTrails, NYT 36 Hours). Crawlable by search engines, scales 20→200 pins. |
| How do *I* edit pins? | **Edit `points.geojson` directly, plus a `?admin=1` click-to-copy-coord overlay** | Same edit-and-bump-cache-buster loop as articles. No CMS, no admin auth, no DB. |
| What goes on the map? | **A curated index of locations referenced across articles** | Acts as a geographic table of contents. Each pin links to the 1-N articles that mention it. ~28 pins at launch (20 existing PWA stops + 8 new editorial-priority pins). |
| Where on the site? | **New top-nav item "Map" + per-article footer block "Locations in this piece"** | Top-nav for discovery, in-article for context. No homepage hero map (would dilute the journalistic voice). |

---

## 3. Tech stack

```
Leaflet 1.9.x          ← UMD bundle from unpkg, ~42kb
Leaflet.markercluster  ← only enable if launch-time pin count > 30
USGS Topo (WMTS)       ← https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer
Esri World Imagery     ← aerial toggle, free for low-volume
```

CDN tags added once to `index.html`:

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

Everything else is plain JSX loaded via the existing `<script type="text/babel">` pattern. **No build step. No bundler. No package.json change at the repo root.**

### Why not Mapbox / MapLibre / Google?

- **Google Maps**: generic consumer aesthetic, requires billing card on file, wrong vibe.
- **Mapbox GL JS**: beautiful but requires API key + paid above 50k loads, and the GL bundle is ~800kb.
- **MapLibre**: free fork of Mapbox GL, same bundle weight, more setup for vector tiles.
- **Leaflet wins** because the no-build CDN constraint and zero-recurring-cost preference dominate. If we ever want Stamen Terrain's painterly hillshade, Stadia Maps via Leaflet is a $20/mo upgrade with no code rewrite.

---

## 4. Data model

**One file, one source of truth: `points.geojson` at the repo root.**

GeoJSON FeatureCollection. Each Feature is a point with structured properties:

```jsonc
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [-119.6776, 37.7158] },
  "properties": {
    "id": "tunnel-view",
    "name": "Tunnel View",
    "category": "viewpoint",          // viewpoint|hike|geology|waterfall|sequoia|lodging|trailhead
    "region": "valley",                // valley|glacier-mariposa|tuolumne|hetch-hetchy|wawona
    "blurb": "The frame Ansel made famous. Park before the tunnel, not after.",
    "image": "img/tunnel-view.jpg",    // optional, reused from img/ or apps/guide/public/photos/
    "articles": ["first-time", "non-hikers", "stargazing"],  // slugs from data.js
    "verified": true                   // false → renders with a dashed pin and TODO badge in admin mode
  }
}
```

**Why GeoJSON over a hand-rolled JS array:**
- Pasteable from `geojson.io`, QGIS, Google Earth exports.
- One-liner consumption: `L.geoJSON(data, { pointToLayer, onEachFeature })`.
- Validates in any GIS tool if a coordinate gets fat-fingered.

**PWA reuse:** at launch, write a tiny one-shot script (`scripts/seed-points-from-stops.mjs`) that reads `apps/guide/src/content/stops.ts`, converts each stop to a Feature, and writes `points.geojson`. Run it once, then maintain `points.geojson` by hand. The PWA stays the source of truth for stops the *guide* uses; the editorial map is allowed to diverge (e.g. add Half Dome, which the PWA doesn't list because there's no parking turnout).

---

## 5. UI/UX spec

### Layout

**Desktop (≥768px):**
```
┌──────────────────────────────────────────────┐
│  Header (existing nav)                       │
├──────────────────────────────────────────────┤
│  Filter chips: All · Viewpoints · Hikes ·    │
│  Geology · Waterfalls · Sequoias · Lodging   │
├────────────────┬─────────────────────────────┤
│                │                             │
│  Pin list      │  Map                        │
│  (40%)         │  (60%)                      │
│                │                             │
│  · grouped by  │  USGS Topo basemap          │
│    region      │  Pins clustered at z<11     │
│  · scrollable  │  Aerial toggle (top-right)  │
│  · sticky      │                             │
│    region      │                             │
│    headers     │                             │
│                │                             │
└────────────────┴─────────────────────────────┘
```

**Mobile (<768px):** full-screen map with a draggable bottom sheet (peek/half/full snap points). Tapping a pin snaps to peek and shows the selected item as a card. *No list/map toggle button — bottom sheet is strictly better.*

### Interactions (the rules)

1. **Hover sidebar item** → pin scales 1.2× and pulses. **No map pan.** (Panning on hover makes scanning the list nauseating — this is the single biggest pitfall in this pattern.)
2. **Click sidebar item** → map flies to pin (`map.flyTo`, 600ms ease), opens popup, pin stays selected until dismissed.
3. **Click pin** → sidebar item scrolls into view and highlights; popup shows hero image, blurb, and "Read article" links.
4. **Filter chips** → multi-select OR-semantics, count badge per chip, persisted to URL (`/map?cat=viewpoint,geology`). Sharable filtered map = sharable trip plan.
5. **Empty filter result** → keep map at current bounds, show "No [category] in view — zoom out" rather than auto-resetting (auto-reset is disorienting).
6. **Deep link** → `/map?stop=tunnel-view` opens the page with that pin selected and bounds zoomed to it.
7. **Article footer block** → every article gets a "Locations in this piece" block listing its 1-4 referenced stops with thumbnails, each linking to `/map?stop=<id>`.

### Pin design

- **Iconographic, not numbered.** Numbers imply a sequence (a trip). Wrong mental model for a discovery index.
- **NPS-style rounded shield + category glyph.** 5-color palette tuned for the muted topo basemap:
  - Viewpoint — **gold** (existing `--gold`)
  - Hike / trailhead — **moss** (existing `--moss`)
  - Geology — **granite** gray
  - Waterfall — **slate blue**
  - Sequoia — **deep green**
  - Lodging — **paper** with dark border (subdued; not the story)
- **Cluster below zoom 11.** Default fit-bounds shows region clusters: "Valley · 12", "Tuolumne · 6". Click cluster → zoom in. ~28 pins doesn't strictly need clustering, but the Valley density (12 pins in <5km²) overlaps without it.
- **Two-tier zoom:** the default state is *region clusters*, mirroring the PWA's region picker.

### Discoverability

- **Top nav: "Map"** (not "Explore" — too app-y for the journalistic tone).
- **Per-article footer block** "Locations in this piece" (auto-generated from `properties.articles`).
- **Inline article chips** (phase 2): when an article body mentions a stop name, render it as a small chip with a category glyph linking to `/map?stop=...`. Skip in phase 1 — too invasive on existing copy.

---

## 6. Editing workflow (the part you really care about)

### Adding a new pin

1. Open `/map?admin=1` in the browser.
2. Click anywhere on the map. The admin overlay copies `{ "coordinates": [lng, lat] }` to clipboard and shows a toast with the values.
3. Open `points.geojson` in your editor and paste a new Feature, filling in id/name/category/region/blurb/articles.
4. Bump `index.html` cache-buster on `points.geojson` (e.g. `?v=4` → `?v=5`).
5. Commit, push, Cloudflare auto-deploys.

The admin overlay is ~30 lines of code, gated by a URL flag (no auth — there's nothing to protect, the GeoJSON is already public). It also renders unverified pins with a dashed outline and a small "TODO" badge so you can see at a glance which need ground-truth.

### Editing or moving a pin

Same loop: edit `points.geojson` directly, bump cache-buster. Optionally use admin mode to drag a pin and watch the new coords stream to the console.

### Why not a CMS / admin DB

- The site has no backend except the Worker (which is for auth + Stripe).
- Standing up an admin auth flow + DB schema for ~30 records that change a few times a year is overkill.
- Articles are already edited as raw JSX files. Pins should match that mental model exactly.

---

## 7. File layout

New files:

```
points.geojson                  ← seed data, ~28 features at launch
page-map.jsx                    ← /map page component (window.MapPage)
components-map.jsx              ← MapView, PinList, FilterChips, RegionGroup
admin-map.jsx                   ← ?admin=1 overlay (click-to-copy-coord, drag-to-move)
img/map/                        ← category glyph SVGs (viewpoint, hike, geology, …)
scripts/seed-points-from-stops.mjs  ← one-shot importer from PWA stops
```

Modified files:

```
index.html                      ← add Leaflet CSS+JS, new <script> tags + cache-busters, nav link
app.jsx                         ← add /map route
components.jsx                  ← add "Map" to nav, add LocationsInThisPiece component
data.js                         ← (optional) helper window.getStopsForArticle(slug)
page-places.jsx                 ← add "View map" CTA, eventually redirect or fold into /map
styles.css                      ← map-specific styles (leaflet overrides, sidebar, chips, bottom sheet)
```

The `apps/guide/` PWA is **not modified**. The map is editorial-site only.

---

## 8. Phased rollout

### Phase 1 — MVP (target: 1-2 weeks of evening work)

1. Wire Leaflet CDN + USGS Topo basemap in `index.html`.
2. Write `scripts/seed-points-from-stops.mjs`, run it, hand-edit `points.geojson` to clean up names/blurbs.
3. Build `page-map.jsx` with the desktop split-view, sidebar, basic pin rendering, click-to-fly, filter chips. No clustering yet.
4. Add "Map" to the nav.
5. Add `/map?stop=<id>` deep-linking.
6. Ship the `?admin=1` click-to-copy overlay so future pin edits are easy.
7. **Does not include:** mobile bottom sheet, article footer block, clustering, aerial toggle, inline article chips.

### Phase 2 — Mobile + integration (target: 1 week)

1. Mobile bottom sheet with peek/half/full snap points.
2. "Locations in this piece" footer block in `page-article.jsx`, auto-derived from `properties.articles` reverse index.
3. Marker clustering at zoom < 11.
4. Aerial layer toggle (Esri World Imagery).

### Phase 3 — Polish + new content (target: 1 week, ongoing)

1. Add the 8 priority new pins requiring fresh coords (Half Dome, Hetch Hetchy ecosystem, Mt. Lyell Glacier, Cathedral Peak, Valley View, Washburn Point, Cathedral Rocks, Glen Aulin).
2. Inline location chips in article bodies (touches existing copy — do this last and only if it reads well).
3. Replace `page-places.jsx` region-card hero with a small map preview, "View full map" CTA. Keep the operator categories (lodging, food, etc.) below.

### Out of scope (for now)

- User-saved pins / favorites.
- Routing / directions.
- Search bar over pins (sidebar list + filter chips are enough at this scale).
- GPX export.
- Offline map (the editorial site is online-only by design; the PWA is the offline product).
- Scrollytelling. Reserve for one-off feature articles, not the main map.

---

## 9. Seed pin inventory

**20 reusable from PWA stops** (all have coords, marked TODO: verify):

Tunnel View · Bridalveil Fall · El Capitan Meadow · Cook's Meadow · Mirror Lake · Mist Trail / Happy Isles · Ahwahnee Hotel · Sentinel Bridge · Curry Village · Old Big Oak Flat Road (Ribbon Fall) · Glacier Point Road · Sentinel Dome · Glacier Point · Mariposa Grove · Tioga Road · Olmsted Point · Tenaya Lake · Cathedral Lakes · Soda Springs · Taft Point

**8 new pins to coordinate-hunt** (mentioned in 2+ articles, no PWA stop):

Half Dome · Hetch Hetchy O'Shaughnessy Dam · Wapama Falls · Tueeulala Falls · Mount Lyell Glacier · Cathedral Peak · Valley View / Gates of the Valley · Washburn Point

**Multi-article hub locations** (highest UX priority — these get the richest popups):

Tunnel View (4 articles) · Half Dome (6) · Glacier Point (4) · Yosemite Falls (5) · Mariposa Grove (3) · El Capitan (4) · Tioga Road (5) · Tuolumne Meadows (4) · Cook's Meadow (4) · Hetch Hetchy (2) · Bridalveil Fall (4) · Mist Trail (2) · Sentinel Dome / Taft Point (2) · Olmsted Point (2) · Tenaya Lake (2)

---

## 10. Open questions for the owner

These should be answered before phase 1 starts. Defaults are listed; speak up if any are wrong.

1. **Topo aesthetic.** USGS Topo (free, classic green-and-tan quad) is the default. If you'd rather have Stamen Terrain's painterly hillshade and accept ~$20/mo Stadia Maps, switch the basemap URL — no other code change. *Default: USGS.*
2. **Folding `/places` into `/map`.** `page-places.jsx` currently has 3 region image-card tiles ("Replaces the old NPS map") plus operator/business categories. Three options:
   - (a) Replace `/places` entirely with the new `/map` page, fold operators into a separate `/directory` page.
   - (b) Keep `/places` as-is, add `/map` alongside.
   - (c) Phase 1 builds `/map` standalone; phase 3 consolidates.
   *Default: (c).*
3. **Per-article inline location chips.** Touches every article body. Could improve discovery a lot, or could read like clutter against your dry voice. *Default: ship without; revisit in phase 3 with one experimental article.*
4. **Half Dome pin.** No parking turnout, no obvious "stop." Pin it on the summit, at the cables base, or at Mirror Lake (the closest reliable Valley vantage)? *Default: summit, with the popup explaining you don't go *there* — you look *at* it.*
5. **Verified vs TODO coords.** Every PWA stop is flagged `// TODO: verify`. Phase 1 ships pins with a small "approximate location" badge for unverified ones. Acceptable, or do we hold pins until field-verified? *Default: ship with the badge — the cost of waiting is a feature that never launches.*

---

## 11. References (what we're stealing from)

- **Atlas Obscura `/places` map** — list-left/map-right split, category filters, popup-then-CTA flow.
- **NPS.gov Park Tiles + Felt-NPS collaboration** — pictographic pins in rounded shields, muted basemap palette.
- **AllTrails web** — bidirectional hover sync, URL-persisted filters.
- **NYT 36 Hours** — geographic table of contents pattern.
- **Mapbox cluster + Supercluster patterns** — clustering thresholds and behavior.
- **NN/g bottom sheet UX guidelines** — mobile snap-point pattern.

---

*End of plan.*
