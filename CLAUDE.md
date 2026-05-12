# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project shape

This repo contains three subsystems for **The Talus Field**, a Yosemite editorial site and field guide product. They are intentionally co-located so a single change (e.g. brand rename, copy update) can touch all three at once.

| Path | What it is | Stack |
|---|---|---|
| repo root (`*.jsx`, `index.html`, `styles.css`, `bodies/`, `img/`, `points.geojson`) | **Editorial site** at `thetalusfieldjournal.com`. Static assets + a single edge function. | Vanilla React via `<script type="text/babel">` from a CDN; styled with hand-written CSS in `styles.css`; Google Maps JS API on `/map`. |
| `functions/` | **Cloudflare Pages Functions** that wrap the editorial site. Currently one: `_middleware.js` rewrites `<head>` per route for SEO. | Pages Functions runtime + `HTMLRewriter`. |
| `apps/guide/` | **Field Guide PWA** at `guide.thetalusfieldjournal.com`. Buyer-only, offline-capable. | Vite + React 19 + TypeScript + react-router-dom + tailwind 4 + zod. |
| `workers/` | **API** at `api.thetalusfieldjournal.com`. Auth, Stripe checkout/webhook, KV-backed buyer records. | Cloudflare Worker + Hono + `@tsndr/cloudflare-worker-jwt` + KV. |
| `scripts/` | One-shot Node ETL scripts. `seed-points-from-stops.mjs` regenerates `points.geojson` from the PWA's `stops.ts`. | Node ESM, no deps. |

DEPLOY.md has a full deployment runbook. Note that DEPLOY.md was written against the older trip-based PWA model (`1day`/`3day`/`5day`, "35 stops"). The PWA was since refactored to region-based (`valley`/`glacier-mariposa`/`tuolumne`, ~21 stops); treat the smoke-test section as directionally correct but stale on specifics.

## Common commands

Local dev hosts (matches `.claude/launch.json`):

```bash
# Editorial site — port 8765
python -m http.server 8765

# PWA — port 5173
npm --prefix apps/guide run dev

# Worker — local dev
cd workers && npm run dev      # = wrangler dev
```

Build / typecheck:

```bash
npm --prefix apps/guide run build       # tsc -b && vite build → apps/guide/dist
npm --prefix apps/guide run lint
npm --prefix workers run typecheck      # tsc --noEmit
```

Deployment is **not** done from this repo's CI. `main` auto-deploys to Cloudflare Pages for the editorial site (assets + `functions/_middleware.js`, configured by the root `wrangler.jsonc`) and for the PWA; the Worker requires a manual `wrangler deploy` from `workers/` (with KV namespace IDs filled into `workers/wrangler.toml` and secrets set via `wrangler secret put`).

## Editorial site conventions

- **No client build step.** `index.html` loads each `*.jsx` file directly via `<script type="text/babel" src="...?v=N">`. Babel transforms in-browser. This is intentional: the site is meant to be readable and editable without tooling. The only server-side code is `functions/_middleware.js` (see below).
- **Cache-buster discipline.** When you edit a JSX file or `styles.css`, bump its `?v=N` query in `index.html`. Cloudflare and browsers both cache aggressively otherwise. Recent versions visible in git history give the next number. The no-cache header on HTML in `_headers` is what lets the new `?v=N` propagate immediately — don't relax it.
- **Globals via `window`.** Each JSX file attaches its top-level component to `window` (e.g. `window.GuidePage = GuidePage`) so siblings can reference it. The list of `/* global */` comments at the top of each file declares what it consumes.
- **Article bodies** live in `bodies/*.jsx`. Each is registered in `index.html` and indexed in `data.js`. New articles must *also* be added to `articles.json` (consumed by the edge SEO function) and `sitemap.xml`/`feed.xml`.
- **`/map` route.** `page-map.jsx` + `points.geojson` + Google Maps JS API. The API key is inline in `index.html` (restricted in Google Cloud to the production host + `localhost:8765`). 1/2/3-day itinerary presets in `page-map.jsx` filter pins by `region`. `/map` is `noindex` (set by the edge function) — it's a hidden preview.
- **`page-guide.jsx` runtime URL overrides:** `window.GUIDE_API_BASE` and `window.GUIDE_APP_BASE` can be set in a console snippet to point at local dev (`http://localhost:8787` and `http://localhost:5173`) before the script loads.
- **GA4** is loaded in `index.html` (gtag from `googletagmanager.com`). Any new third-party script or `fetch()` host must be added to the CSP in `_headers`.

## Pages Functions, headers, and SEO

- **`functions/_middleware.js`** runs on every editorial-site request. For known paths (`/`, `/articles`, `/articles/:slug`, `/section/:cat`, `/about`, `/kit`, `/places`, `/advertise`, `/newsletter`, `/contact`, `/privacy`, `/terms`, `/affiliate`, `/guide`, `/cap`, `/map`) it `HTMLRewriter`-patches the static `index.html` to inject the right `<title>`, meta description, canonical, OG/Twitter, and JSON-LD (Article + BreadcrumbList for articles, CollectionPage for sections). Unknown paths pass through unchanged. The client-side code in `app.jsx` still updates these tags after hydration; the function just makes the first byte correct for crawlers and social scrapers.
- **`articles.json` and `categories.json`** are the source of truth for the edge function. They're imported with `with { type: "json" }` at the top of `_middleware.js`. Keep them in sync with `data.js` when adding/editing articles, or the edge metadata will diverge from what the client renders.
- **`_headers`** sets the CSP (script-src includes `googletagmanager.com`, `unpkg.com`, `maps.googleapis.com`, `maps.gstatic.com`; connect-src includes the API host, GA, Maps), no-cache for HTML, immutable for `/img/*`, and 1-day cache for `*.jsx`/`styles.css`. Adding a new script CDN or `fetch()` host requires editing the CSP here.
- **`wrangler.jsonc`** at the repo root configures the editorial site's Pages deployment (assets-as-SPA, custom domains). The Worker has its own `workers/wrangler.toml` — don't confuse the two.
- **Static SEO files.** `sitemap.xml`, `robots.txt`, `feed.xml` (RSS), and `llms.txt` are hand-maintained and served with 5-minute cache. Update them when publishing or unpublishing articles.

## PWA architecture

- **Content model.** `apps/guide/src/content/schema.ts` defines `Stop` (zod schema) with a `region` enum: `valley` | `glacier-mariposa` | `tuolumne`. `content/stops.ts` is the seed array, validated at module load via `Stops.parse(seed)` — schema violations throw in the Vite overlay or fail the build. `content/index.ts` exports `REGIONS` (the picker metadata) and helpers `getStopsByRegion`, `getStopById`, `getRegionMeta`.
- **Coords are unverified.** Most stops carry `// TODO: verify` on `coord` because the field guide's value prop depends on accurate parking turnouts; never strip these markers without a real ground-truth pass.
- **Routes** (see `App.tsx`): `/open` (magic-link landing), `/login`, `/` (region picker), `/region/:regionId`, `/stop/:stopId`, `/account`. Everything except `/open` and `/login` is wrapped in `RequireAuth`. `/trip/*` exists as a back-compat redirect to `/` from the old trip-based model.
- **Auth state.** JWT lives in `localStorage` under key `tfg.jwt` (`auth/storage.ts`). Session shape: `{ jwt, username }` — the JWT `sub` claim is treated as a string label and surfaced as `username` regardless of which Worker auth path issued it.
- **Service worker** (`public/sw.js`) caches the app shell + photos for offline use. The `UpdateBanner` component prompts when a new build is available.

## Worker architecture

Routes mounted in `workers/src/index.ts`:

- `/api/auth/login` — **legacy** email + 6-digit code path, KV-backed buyer lookup. Currently unused by the PWA but kept for when Stripe checkout comes back.
- `/api/auth/dev-login` — **active** username + code path, env-backed (`DEV_USERNAME`/`DEV_CODE`/`ADMIN_USERNAME`/`ADMIN_CODE`). Pre-Stripe; either pair issues a JWT.
- `/api/auth/exchange` — exchanges a magic-link `accessToken` for a JWT.
- `/api/checkout/*` — Stripe Checkout session start + inventory cap enforcement. The editorial `/guide` page still calls `/api/inventory` for the scarcity counter.
- `/api/stripe/webhook` — Stripe `checkout.session.completed` handler; provisions a buyer record in KV and emails the access code.

Both auth paths sign the same JWT shape (`{ sub, iat, exp }`, HS256, 90-day TTL) using `MAGIC_LINK_SIGNING_SECRET`. The `sub` claim carries an email for `/login` and a username for `/dev-login` — the PWA doesn't care which.

CORS in `index.ts` allow-lists the editorial origin, the PWA origin, and `http://localhost:5173`/`5174`/`8000` for local dev. Add new dev origins there.

## Brand & voice

The brand is **The Talus Field** (formerly "Yosemite Sentinel"). The editorial voice is dry, declarative, journalistic — no marketing fluff, no exclamation marks, em-dashes have been deliberately removed across the codebase. Match the existing tone when writing copy.

## Things that have surprised past edits

- The editorial site has **no test suite, lint, or typecheck** — runtime errors only surface in the browser.
- `DEPLOY.md` references `1day`/`3day`/`5day` trips and "35 stops"; the current model is region-based with ~21 stops.
- The Worker `/api/auth/login` route looks dead from the PWA side but is intentionally retained for the future Stripe-based flow.
- Stripe checkout, Resend email, and the inventory cap are all wired up but currently unreachable from the UI (the `/guide` CTA was swapped to a sign-in link). Don't delete this code — it's pre-Stripe-relaunch scaffolding.
- Photos for the new region-based stops mostly don't exist in `apps/guide/public/photos/` yet (only `tunnel-view.jpg`). A previous photo-wiring pass targeted the old trip-based stop IDs and was dropped during the merge.
- The editorial site has **two sources of article metadata**: `data.js` (consumed by the in-browser React) and `articles.json` (consumed by the edge SEO function). They must be kept in sync when adding/editing articles.
- `points.geojson` is hand-maintained after the initial seed; re-running `scripts/seed-points-from-stops.mjs` will **overwrite** any edits. The PWA's `kind` enum and the map's `category` enum don't line up 1:1 — see the override map in the seed script before regenerating.
- `MAP_INTEGRATION_PLAN.md` was the design doc for `/map`; the feature has since shipped, so treat the plan as historical. `AUDIT.md` is a prioritized punch-list from a one-off audit — useful as a pointer to known gaps but not authoritative.
- The Google Maps API key is **inline in `index.html`** (intentional — Maps JS API keys are designed to be public, scoped by HTTP referrer in the Cloud console). If you rotate it, update the referrer allow-list too.
