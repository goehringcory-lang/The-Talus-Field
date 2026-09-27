# The Talus Field — Field Guide PWA

The paid Yosemite field guide at `guide.thetalusfieldjournal.com` (the
`talus-field-guide.pages.dev` host keeps resolving alongside the custom
domain): $3.99 one-time,
18 months of access. Offline-first by design — buyers download the guide, map
tiles, and photos onto their phone before entering the park, where there is no
signal.

## Stack

Vite + React 19 + TypeScript, react-router-dom for routing, zod to validate all
content at build time, MapLibre GL for the offline topo map. Styling is
hand-rolled CSS custom properties in `src/styles/tokens.css` (no utility
framework in the components).

## Commands

```bash
npm run dev      # local dev server on :5173
npm run build    # tsc -b && vite build → dist/
npm run lint     # eslint
npm test         # vitest
npm run audit:candidates   # the fact audit's next picks (see .claude/skills/guide-fact-audit)
```

The API lives in `../../workers/` (Cloudflare Worker); run it locally with
`npm run dev` there (wrangler, :8787). `VITE_API_BASE` defaults to
`http://localhost:8787` in dev and is set to the production API by
`.env.production`. The build stamp shown on Home and /account comes from a
`tfg-build-date` meta tag that `vite.config.ts` injects into `index.html` (the
date of the last commit touching this app) — deliberately not `define`d into
the bundle; `npm run check:build` guards the reason why.

## Where things live

- **Content** — `src/content/`: `stops.ts` (the 66 region stops, core and hidden, zod-validated at
  module load), `hikes.ts`, `secret-spots.ts` and `secret-guide.ts`, `dining.ts`,
  `amenities.ts`, `essentials.ts`, `help.ts`, `wildlife.ts`, `seasonal.ts`,
  `itineraries.ts`, `deadlines.ts` (a hand mirror of the editorial site's
  `scripts/data/deadlines.json`, checked by `check-deadlines.mjs`) and
  `archive.ts` (Nature Notes citations). Editing these files is how the guide's
  content changes; a schema violation fails the build rather than shipping bad
  data.
- **Live feeds** — `src/weather/`, `src/waits/`, `src/parking/`, `src/alerts/`,
  `src/air/`, `src/flow/`: each reads its Worker route through a zod schema,
  carries a `staleness.ts` cut-off, and renders nothing rather than a guess when
  the feed is silent or too old. `src/programs/` reads `/api/programs` for the
  trip window and merges the bundled seasonal almanac.
- **Auth** — `src/auth/`: JWT in localStorage, signed by the Worker to the
  buyer's access expiry. `me.ts` mirrors the Worker's `/api/auth/me` response.
- **Offline** — `public/sw.js` (hand-rolled service worker) plus
  `src/offline/` (download packs) and the DownloadManager on /account and in
  the map's Information pane.
- **The map** — `src/routes/Map.tsx` and `src/map/`; see "The 3D map" below.
- **Trip planner** — `src/trip/` (day slotting, ICS export, and `importTrip.ts`, which takes the editorial map's `/trip?import=` hand-off); `src/sync/` syncs the plan across devices through `/api/trip/plan`.
- **Architecture notes** — `CLAUDE.md` in this directory is the detailed reference.

## The 3D map

`/map` is MapLibre GL over a self-hosted vector basemap on 3D terrain. Nothing
on it needs a third-party key, and every byte it draws can be cached offline.

**Where the files live**

| File | What it is |
|---|---|
| `src/routes/Map.tsx` | The route: the MapLibre instance, pins, popups, filters, the 2D/3D toggle, Reset view, Offline areas |
| `src/map/theme.ts` | Every colour and tunable number: fills per scheme, terrain exaggeration (1.4), hillshade, sky, the opening camera |
| `src/map/style.ts` | Builds the MapLibre style: Protomaps layers, the terrain and hillshade sources (two sources on purpose), sky, the park boundary and the outside-the-park dimming |
| `src/map/regions.ts` | The tile extent and the offline areas, pure, shared with the tile generator |
| `src/map/tiles.generated.ts` | Generated: the tile archive version and each offline pack's measured size |
| `src/map/data/park-boundary.json` | Generated: the NPS boundary, simplified |
| `src/map/attribution.ts` | The data credits |
| `src/map/kinds.ts` | Pin kinds, colours and glyphs |
| `public/map-assets/` | Label glyphs and sprites (Noto Sans, OFL; sprites, MIT) |
| `../../workers/src/routes/maptiles.ts` | The Worker's `/vt` and `/dem` tile routes over the R2 archives |

**Regenerating the data**

- Tiles: `npm run map:tiles` builds both PMTiles archives (the Protomaps OSM
  build, the Terrarium elevation) into the gitignored `scripts/.mapcache/out/`,
  rewrites `src/map/tiles.generated.ts`, and prints the two
  `wrangler r2 object put` commands. **Upload before merging**: the app asks
  for tiles by the new version, and the Worker 404s a version it does not hold.
  Needs Node 22.5+; the script fetches the go-pmtiles CLI itself. Runbook:
  `../../DEPLOY.md`, "3D map tiles (R2)".
- Park boundary: `npm run map:data` refetches the NPS boundary into
  `src/map/data/park-boundary.json`.

**Offline**

The download packs are an overview (the whole park at driving scale, z6-z11,
plus glyphs and sprites) and four areas at trailhead scale (z12-z15 vector,
z12-z13 elevation). An area requires the overview: downloading one fetches the
overview first, and the overview cannot be removed while an area is on the
device. Sizes shown before a download are measured from the archives, not
estimated. Offline, the map outlines the downloaded areas and the notice above
it names them.

To change an area, edit its box in `src/map/regions.ts`, then rerun
`npm run map:tiles` (the sizes are measured over the new tile lists; a unit
test fails if the two disagree). Tile versions are path segments, so the
service worker drops the previous version's tiles when a new build activates.

**Environment**

No new variables. The map reads `VITE_API_BASE` like everything else, and the
Worker needs the `MAP_TILES` R2 binding in `workers/wrangler.toml` (a bucket,
not a secret).

## Deploys

Merging to `main` auto-deploys via Cloudflare Pages. The API Worker deploys
from the same merge through its own Workers Build (when `workers/` changed),
in parallel and with no ordering between the two, so a change that touches
both must let the PWA tolerate the old Worker for a few minutes, or land the
Worker half in an earlier PR. See `../../DEPLOY.md` for the full runbook.
