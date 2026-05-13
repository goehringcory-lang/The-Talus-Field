# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project shape

This repo contains three subsystems for **The Talus Field**, a Yosemite editorial site and field guide product. They are intentionally co-located so a single change (e.g. brand rename, copy update) can touch all three at once.

| Path | What it is | Stack |
|---|---|---|
| repo root (`*.jsx`, `index.html`, `styles.css`, `bodies/`, `img/`, `functions/`) | **Editorial site** at `thetalusfieldjournal.com`. Static SPA with edge-rendered SEO. | Vanilla React via `<script type="text/babel">` from a CDN; styled with hand-written CSS in `styles.css`; Cloudflare Pages Function for per-route `<head>` rewriting. |
| `apps/guide/` | **Field Guide PWA** at `guide.thetalusfieldjournal.com`. Buyer-only, offline-capable. | Vite + React 19 + TypeScript + react-router-dom + tailwind 4 + zod + maplibre-gl. |
| `workers/` | **API** at `api.thetalusfieldjournal.com`. Auth, Stripe checkout/webhook, KV-backed buyer records, map-tile proxy. | Cloudflare Worker + Hono + `@tsndr/cloudflare-worker-jwt` + KV. |

`README.md` is the public-facing orientation. `DEPLOY.md` is the deployment runbook — note it was written against the older trip-based PWA model (`1day`/`3day`/`5day`, "35 stops") and is stale on specifics; the PWA was refactored to region-based (`valley`/`glacier-mariposa`/`tuolumne`, ~21 stops). `AUDIT.md` is a snapshot punch list of P0/P1/P2 issues (some already fixed since it was written — `/guide` and `/cap` are now wired, CI exists, CSP is in `_headers`, root `README.md` exists).

## Common commands

Local dev hosts (matches `.claude/launch.json`):

```bash
# Editorial site — port 8765 (launch.json uses 8766; either works)
python -m http.server 8765

# PWA — port 5173
npm --prefix apps/guide run dev

# Worker — local dev
cd workers && npm run dev      # = wrangler dev
```

Build / typecheck / lint:

```bash
npm --prefix apps/guide run build       # tsc -b && vite build → apps/guide/dist
npm --prefix apps/guide run lint        # eslint .
npm --prefix workers run typecheck      # tsc --noEmit
```

CI (`.github/workflows/ci.yml`) runs the PWA build + lint and the Worker typecheck on every PR and push to `main`. The editorial site has **no** automated checks — runtime errors surface only in the browser.

Deployment is **not** done from CI. `main` auto-deploys to Cloudflare Pages for both the editorial site and the PWA; the Worker requires a manual `wrangler deploy` from `workers/` (with KV namespace IDs filled into `wrangler.toml` and secrets set via `wrangler secret put`).

## Editorial site conventions

- **No build step.** `index.html` loads each `*.jsx` file directly via `<script type="text/babel" src="...?v=N">`. Babel transforms in-browser. This is intentional: the site is meant to be readable and editable without tooling.
- **Cache-buster discipline.** When you edit a JSX file or `styles.css`, bump its `?v=N` query in `index.html`. Cloudflare and browsers both cache aggressively otherwise. Recent versions visible in git history give the next number. New article bodies start at `?v=1`; older bodies are at `?v=20-25` and pages at `?v=22-33` — there is drift; don't try to unify it during unrelated work.
- **Globals via `window`.** Each JSX file attaches its top-level component to `window` (e.g. `window.GuidePage = GuidePage`) so siblings can reference it. The list of `/* global */` comments at the top of each file declares what it consumes.
- **Article bodies** live in `bodies/*.jsx`. Each is registered in `index.html`, indexed in `data.js`, and mirrored in `articles.json` (which the edge SEO function reads). When adding an article, update all three.
- **Static index files** (`articles.json`, `categories.json`, `sitemap.xml`, `feed.xml`, `llms.txt`) currently mirror `data.js` **by hand**. Audit item #19 calls for generating them from `data.js`; until that lands, edits must touch all of them.
- **Edge-rendered SEO.** `functions/_middleware.js` is a Cloudflare Pages Function that rewrites `<title>`, meta, canonical, OG, Twitter, JSON-LD, and breadcrumb tags per route using HTMLRewriter, so non-JS crawlers see correct per-page metadata. The browser-side code in `app.jsx` still updates these on hydration; the function makes the first byte correct. New routes must be added to its `known` map (and to `app.jsx`, sitemap, etc.).
- **Routing.** `app.jsx` uses the History API with route keys (`home`, `about`, `a:slug`, `cat:slug`, etc.) translated to/from real paths. Add new routes to: the `routeToPath`/`pathToRoute` helpers, the big `if/else` route resolver around `app.jsx:387`, the SEO map in `functions/_middleware.js`, `sitemap.xml`, and the nav in `components.jsx`.
- **Map route is hidden.** `/map` is a typed-URL preview only — not in the nav, sitemap, article footer, or robots index (`_middleware.js` emits `robots: noindex, nofollow` for it). Don't surface it until it's ready.
- **`page-guide.jsx` runtime URL overrides:** `window.GUIDE_API_BASE` and `window.GUIDE_APP_BASE` can be set in a console snippet to point at local dev (`http://localhost:8787` and `http://localhost:5173`) before the script loads.
- **CSP.** `_headers` ships a `Content-Security-Policy` that allow-lists Google Analytics, unpkg (Babel CDN), and Google Maps. If you add a new third-party script, image, or fetch destination, extend the CSP at the same time or it will be silently blocked.
- **Pages config.** `wrangler.jsonc` at the repo root configures the editorial Cloudflare Pages project (SPA fallback, custom domains). It is **not** the Worker config — the Worker lives in `workers/wrangler.toml`.

## PWA architecture

- **Content model.** `apps/guide/src/content/schema.ts` defines `Stop` (zod schema) with a `region` enum: `valley` | `glacier-mariposa` | `tuolumne`. `content/stops.ts` is the seed array, validated at module load via `Stops.parse(seed)` — schema violations throw in the Vite overlay or fail the build. `content/index.ts` exports `REGIONS` (the picker metadata) and helpers `getStopsByRegion`, `getStopById`, `getRegionMeta`.
- **Coords are unverified.** Most stops carry `// TODO: verify` on `coord` because the field guide's value prop depends on accurate parking turnouts; never strip these markers without a real ground-truth pass. `apps/guide/src/content/stops.ts` calls out Cathedral Lakes specifically as "VERIFY URGENTLY".
- **Routes** (see `apps/guide/src/App.tsx`): `/open` (magic-link landing), `/login`, `/` (region picker), `/region/:regionId`, `/stop/:stopId`, `/account`. Everything except `/open` and `/login` is wrapped in `RequireAuth`. `/trip/*` redirects to `/` for back-compat with the old trip-based model; unknown routes also redirect to `/`.
- **Auth state.** JWT lives in `localStorage` under key `tfg.jwt` (`auth/storage.ts`). Session shape: `{ jwt, username }` — the JWT `sub` claim is treated as a string label and surfaced as `username` regardless of which Worker auth path issued it.
- **Photos** live in `apps/guide/public/photos/`. As of this writing 9 are present (`tunnel-view`, `cathedral-rocks`, `el-capitan-winter`, `half-dome`, `lower-yosemite-fall`, `milky-way-sentinel-dome`, `tuolumne-meadows`, `vernal-fall`, `wildflowers`); roughly half the stops still have no matching image. The `PhotoPlaceholder` component handles the missing case — don't ship raw broken `<img>` for new stops.
- **Service worker** (`apps/guide/public/sw.js`) caches the app shell + photos for offline use. Its cache name uses a `__BUILD_DATE__` token rewritten by `vite.config.ts` at build time, so each deploy invalidates old caches. The `UpdateBanner` component prompts when a new build is available.

## Worker architecture

Routes mounted in `workers/src/index.ts`:

- `/tiles/:z/:y/:x` — **map-tile proxy** for Esri World Topo. Proxied through our first-party origin so ad-blockers (EasyPrivacy etc., which classify tile CDNs as trackers) don't break the map. Caches at the Cloudflare edge for 30 days. Mounted at root, **not** under `/api/*`, so the CORS middleware doesn't run on image requests. The path is validated against non-numeric/path-traversal input.
- `/api/inventory` — public scarcity counter for the editorial `/guide` page. Reads `currentMonthLabel()` + the KV inventory count.
- `/api/auth/login` — **legacy** email + 6-digit code path, KV-backed buyer lookup. Currently unused by the PWA but retained for the Stripe relaunch.
- `/api/auth/dev-login` — **active** username + code path, env-backed (`DEV_USERNAME`/`DEV_CODE`/`ADMIN_USERNAME`/`ADMIN_CODE` secrets). Pre-Stripe; either pair issues a JWT. AUDIT item #5 calls this out as a brute-force risk in prod (no rate limiting on a 6-digit code).
- `/api/auth/exchange` — exchanges a magic-link `accessToken` for a JWT.
- `/api/checkout/*` — Stripe Checkout session start + inventory cap enforcement.
- `/api/stripe/webhook` — Stripe `checkout.session.completed` handler; provisions a buyer record in KV and emails the access code. AUDIT items #4 and #6 call out missing `event.id` dedupe, unguarded `sendMagicLink`, and the KV read-modify-write race; flip checkout back on only after these land.

Both auth paths sign the same JWT shape (`{ sub, iat, exp }`, HS256, 90-day TTL) using `MAGIC_LINK_SIGNING_SECRET`. The `sub` claim carries an email for `/login` and a username for `/dev-login` — the PWA doesn't care which.

CORS in `index.ts` allow-lists the editorial origin (apex + www), the PWA origin, and `http://localhost:5173`/`5174`/`8000` for local dev. Add new dev origins there. Note the editorial dev server runs on `:8765` (`launch.json` uses `:8766`); neither is in the CORS allow-list today — local dev hits the deployed Worker, or you can add the port and redeploy locally.

`workers/src/lib/`: `kv.ts` (buyer records + inventory), `jwt.ts` (sign/verify), `tokens.ts` (magic-link tokens), `stripe.ts` (Stripe API helpers), `email.ts` (Resend integration).

## Map subsystem

There are **two** maps in this repo, and they share data but nothing else:

1. **Editorial `/map`** (hidden preview): `page-map.jsx` + `points.geojson` at the repo root. Uses the **Google Maps JavaScript API** (script tag in `index.html`, key restricted to `thetalusfieldjournal.com` + `localhost:8765` in the Google Cloud console). Has a 1/2/3-day itinerary sidebar that filters markers by region. URL state: `/map?itinerary=2day&stop=tunnel-view`.
2. **PWA map** (planned per `MAP_INTEGRATION_PLAN.md`): MapLibre GL, offline-capable, on the buyer side. The package is installed but integration is in progress.

`scripts/seed-points-from-stops.mjs` is a one-shot ETL that reads `apps/guide/src/content/stops.ts` and writes `points.geojson`. It has per-id category overrides (Bridalveil Fall → `waterfall`, Mariposa Grove → `sequoia`, etc.) because the PWA's `kind` enum doesn't cleanly map to the editorial map's `category` enum. Re-running is destructive to any hand edits in `points.geojson`; the file is meant to be hand-maintained after the initial seed.

Past iterations of the map went through Leaflet + OSM + USGS + Esri-via-Worker-proxy before settling on Google Maps. The Worker `/tiles/:z/:y/:x` proxy is left in place because (a) it still serves any non-Google tile use and (b) `MAP_INTEGRATION_PLAN.md` may use it for the PWA.

## Brand & voice

The brand is **The Talus Field** (formerly "Yosemite Sentinel"). The editorial voice is dry, declarative, journalistic — no marketing fluff, no exclamation marks, em-dashes have been deliberately removed across the codebase. Match the existing tone when writing copy. (AUDIT item #10: `bodies/pack-your-car-for-yosemite.jsx` still has a few em-dashes that need replacing.)

## Things that have surprised past edits

- The editorial site has **no test suite, lint, or typecheck** — runtime errors only surface in the browser. CI covers only the PWA and Worker.
- `articles.json`, `categories.json`, `sitemap.xml`, `feed.xml`, `llms.txt`, and `data.js` are all hand-mirrored. Edits that add or rename an article must touch all of them. Edge SEO in `functions/_middleware.js` reads `articles.json` + `categories.json` — if it's missing there, the per-route `<head>` falls back to the homepage default.
- `DEPLOY.md` references `1day`/`3day`/`5day` trips and "35 stops"; the PWA is region-based with ~21 stops. The editorial `/map` itinerary sidebar is `1day`/`2day`/`3day` — different from both the PWA and the old DEPLOY model.
- The Worker `/api/auth/login` route looks dead from the PWA side but is intentionally retained for the future Stripe-based flow.
- Stripe checkout, Resend email, and the inventory cap are all wired up but currently unreachable from the UI (the `/guide` CTA was swapped to a sign-in link). Don't delete this code — it's pre-Stripe-relaunch scaffolding. AUDIT items #4–#7 must land before checkout reopens.
- Photos for the new region-based PWA stops are partial — about half are present in `apps/guide/public/photos/`; the rest fall back to `PhotoPlaceholder`. Don't assume a stop has a photo just because it's listed in `stops.ts`.
- The `/map` route is intentionally hidden (no nav link, no sitemap entry, `robots: noindex, nofollow` via the edge function). Don't surface it during an unrelated edit.
- The Google Maps API key in `index.html` is committed but is restricted by referrer in the Google Cloud console; it is **not** treated as a secret. Don't rotate it without updating the referrer allow-list.
- `node_modules/` was historically committed under `workers/` and `apps/guide/` (AUDIT item #13). `.gitignore` was tightened, but check `git status` before committing to make sure stray installs aren't sneaking back in.
