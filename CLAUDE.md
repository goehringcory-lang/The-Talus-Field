# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project shape

This repo contains three subsystems for **The Talus Field**, a Yosemite editorial site and field guide product. They are intentionally co-located so a single change (e.g. brand rename, copy update) can touch all three at once.

| Path | What it is | Stack |
|---|---|---|
| repo root (`*.jsx`, `index.html`, `styles.css`, `bodies/`, `img/`) | **Editorial site** at `thetalusfieldjournal.com`. Static, no build. | Vanilla React via `<script type="text/babel">` from a CDN; styled with hand-written CSS in `styles.css`. |
| `apps/guide/` | **Field Guide PWA** at `guide.thetalusfieldjournal.com`. Buyer-only, offline-capable. | Vite + React 19 + TypeScript + react-router-dom + tailwind 4 + zod. |
| `workers/` | **API** at `api.thetalusfieldjournal.com`. Auth, Stripe checkout/webhook, KV-backed buyer records. | Cloudflare Worker + Hono + `@tsndr/cloudflare-worker-jwt` + KV. |

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

Deployment is **not** done from this repo's CI. `main` auto-deploys to Cloudflare Pages for the editorial site and PWA; the Worker requires a manual `wrangler deploy` from `workers/` (with KV namespace IDs filled into `wrangler.toml` and secrets set via `wrangler secret put`).

## Editorial site conventions

- **No build step.** `index.html` loads each `*.jsx` file directly via `<script type="text/babel" src="...?v=N">`. Babel transforms in-browser. This is intentional: the site is meant to be readable and editable without tooling.
- **Cache-buster discipline.** When you edit a JSX file or `styles.css`, bump its `?v=N` query in `index.html`. Cloudflare and browsers both cache aggressively otherwise. Recent versions visible in git history give the next number. All files currently share the same version; bump them together to a new shared number when shipping a batch. Run `bash scripts/check-cache-busters.sh` before committing — it errors if any reference is missing a `?v=`.
- **Globals via `window`.** Each JSX file attaches its top-level component to `window` (e.g. `window.GuidePage = GuidePage`) so siblings can reference it. The list of `/* global */` comments at the top of each file declares what it consumes.
- **Article bodies** live in `bodies/*.jsx`. Each is registered in `index.html` and indexed in `data.js`.
- **`page-guide.jsx` runtime URL overrides:** `window.GUIDE_API_BASE` and `window.GUIDE_APP_BASE` can be set in a console snippet to point at local dev (`http://localhost:8787` and `http://localhost:5173`) before the script loads.

## SEO and generative AI search

The site is optimized for both classic Google Search and the generative AI features layered on top of it (AI Overviews, AI Mode, ChatGPT/Claude/Perplexity citations). Per [Google's own guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), AI search is still grounded in core Search ranking, so the work is standard SEO — not "AEO" or "GEO" tactics.

- **SEO lives in two places, and they must agree.** `functions/_middleware.js` is a Cloudflare Pages Function that rewrites `index.html` at the edge so every URL ships its own `<title>`, `<meta>`, canonical, OG/Twitter tags, and JSON-LD before any JS runs — this is the path non-JS crawlers (most AI bots, social card scrapers) take. `app.jsx` re-applies the same tags on the client during SPA navigation. The two `buildSeo`/`seoForPath` functions are intentional duplicates; change them together.
- **Article metadata has two sources of truth.** `data.js` feeds the client; `articles.json` feeds the edge middleware. When you add or revise an article, update both, plus `sitemap.xml` and `feed.xml`. Bump `isoModified` when an article is meaningfully revised so Google sees the update. (AUDIT.md #19 calls out the duplication as a P2 to fix with a generator script; until then, sync by hand.)
- **Article OG meta** (`article:published_time`, `article:modified_time`, `article:author`, `article:section`) is appended by both the edge middleware and the client, and removed on non-article routes so it doesn't bleed across SPA navigations. `og:image:alt` falls back to `a.placeholder || a.title`.
- **Structured data floor.** `WebSite` + `Organization` (publisher) in `index.html`; per-route `Article` / `CollectionPage` + `BreadcrumbList` from the middleware/client; optional `FAQPage` when an article carries a `faq` array in `articles.json`. Don't pile on more schemas — Google explicitly warns against overdoing structured data.
- **Cache-buster bumps are an SEO concern, not just a dev one.** Googlebot fetches whatever is at the URL with current caching. A forgotten `?v=N` bump on a JSX edit can leave AI/search crawlers seeing pre-edit content for the TTL window. Always run `scripts/check-cache-busters.sh` before committing.
- **IndexNow.** After publishing or meaningfully revising an article, run `scripts/indexnow-ping.sh <url>...` to push-notify Bing, Yandex, Seznam, Naver, and Yep. The Worker endpoint (`/api/indexnow/submit`) is the bearer-gated forwarder.
- **`llms.txt` is grandfathered, not aspirational.** Google has stated it doesn't use it; we keep it because some non-Google AI crawlers may. Don't expand the pattern with new AI-specific text files, markup, or Markdown mirrors — they don't help and dilute the canonical HTML.
- **Things to *not* do** (from Google's AI search guide): chunk content for "AI readability," rewrite for long-tail keyword variations, seek inauthentic mentions, generate commodity SEO listicles. The editorial voice (dry, declarative, first-hand) already maps to what Google calls non-commodity, people-first content; keep writing for the reader, not the model.
- **Hidden routes.** `/map` ships with `robots: "noindex, nofollow"` while it's in preview (see both the middleware and `app.jsx:buildSeo`). Mirror this pattern for any future URL-only-access route.

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
- `/api/indexnow/submit` — bearer-token-gated POST that forwards a `{ urls: [...] }` list to api.indexnow.org. Push-indexes Bing / Yandex / Seznam / Naver / Yep in a single call. Use `scripts/indexnow-ping.sh` after publishing an article. Requires `INDEXNOW_KEY` and `INDEXNOW_ADMIN_TOKEN` secrets.

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
