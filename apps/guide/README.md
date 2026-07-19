# The Talus Field — Field Guide PWA

The paid Yosemite field guide at `talus-field-guide.pages.dev` (the custom
domain `guide.thetalusfieldjournal.com` is deliberately unattached until
launch): $19 one-time,
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
```

The API lives in `../../workers/` (Cloudflare Worker); run it locally with
`npm run dev` there (wrangler, :8787). `VITE_API_BASE` defaults to
`http://localhost:8787` in dev and is set to the production API by
`.env.production`. `VITE_BUILD_DATE` stamps the build (shown on /account).

## Where things live

- **Content** — `src/content/`: `stops.ts` (the 66 region stops, core and hidden, zod-validated at
  module load), `essentials.ts`, `secret-spots.ts`, `seasonal.ts`,
  `itineraries.ts`. Editing these files is how the guide's content changes;
  a schema violation fails the build rather than shipping bad data.
- **Auth** — `src/auth/`: JWT in localStorage, signed by the Worker to the
  buyer's access expiry. `me.ts` mirrors the Worker's `/api/auth/me` response.
- **Offline** — `public/sw.js` (hand-rolled service worker) plus
  `src/offline/` (download packs, tile math) and the DownloadManager on
  /account.
- **Trip planner** — `src/trip/` (day slotting, ICS export).

## Deploys

Merging to `main` auto-deploys via Cloudflare Pages. The Worker deploys
separately (`wrangler deploy` from `workers/`); deploy the Worker first when a
change touches both. See `../../DEPLOY.md` for the full runbook.
