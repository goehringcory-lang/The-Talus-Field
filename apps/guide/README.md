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
  `src/offline/` (download packs, tile math) and the DownloadManager on
  /account.
- **Trip planner** — `src/trip/` (day slotting, ICS export, and `importTrip.ts`, which takes the editorial map's `/trip?import=` hand-off); `src/sync/` syncs the plan across devices through `/api/trip/plan`.
- **Architecture notes** — `CLAUDE.md` in this directory is the detailed reference.

## Deploys

Merging to `main` auto-deploys via Cloudflare Pages. The Worker deploys
separately (`wrangler deploy` from `workers/`); deploy the Worker first when a
change touches both. See `../../DEPLOY.md` for the full runbook.
