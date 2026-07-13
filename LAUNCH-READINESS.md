# Field Guide launch readiness

_Audit date: 2026-07-13. Branch: `claude/pwa-audit-launch-bzmnx9`. This branch flips the guide to on-sale, so merging it to `main` puts the buy button in front of readers. Do not merge until the ops gate below is cleared._

## Verdict

| Subsystem | State |
|---|---|
| Worker purchase→access flow | Ship-ready. Checkout enforces a fail-closed monthly cap. The Stripe webhook verifies signatures, guards on the product tag, dedupes retries, provisions the buyer record (548-day access), and claims the dedupe slot only after the access email sends, so a failed email is retried by Stripe. Refunds (full or partial) revoke access. The whole path is covered by `workers/test/e2e-flow.mts`, which now runs in CI. |
| Buyer sign-in | Ship-ready, verified end to end. The purchase email carries a magic link (`/open?token=`, exchanged at `/api/auth/exchange`) and a 6-digit code for `/login` (`/api/auth/login`, rate-limited, constant-time compare). JWTs are stamped to the buyer's real expiry, so one sign-in lasts the paid window offline. Storage-blocked browsers still sign in; offline and 5xx never punish the buyer. |
| PWA shell and offline | Ship-ready. The July 12 audit (PR #182) fixed 18 bugs here; this audit re-verified the service worker HTML-poisoning guards, pack download and verify tolerances, the update banner chain, and the manifest and icon set. Build, lint, and typecheck are green. |
| Editorial sales page | On sale in this branch. Buy box renders the live price from `/api/inventory` with a $19 fallback, handles sold-out (409) and cancelled checkout, and links buyers to the app's login. Verified headless: buy button, price, and offer line render; the waitlist box is gone. |
| Sales copy honesty | Verified claim by claim against the shipped app: four regions, tappable GPS, offline topo map, time budgets and lot-full swaps, programs by date, trip planner with calendar export, essentials and packing checklist, search, Secret Guide. The "about 45 MB" download figure is accurate for current content; re-measure it when the photo pass lands. |
| Content | The gap that remains. 54 stops and 15 secret spots are written and schema-validated, but 25 stops and all 15 secret spots have no photo, 9 images are reused across 34 stops, and 28 coordinates still carry ground-truth TODO markers. Details and the prepared fix below. |

## What this branch changed

- **On-sale flip.** `GUIDE_ON_SALE = true` in `page-guide.jsx` (compiled into `dist/page-guide.js`), noscript nav link restored in `index.html`, shared cache-buster bumped to `?v=139`, Field Guide reference line restored in `llms.txt`, SEO mirrors regenerated. The waitlist box stays in the file for any future sales pause.
- **CI.** The Worker job now runs the hermetic purchase-flow e2e (`npm run test:flow`) after typecheck, so checkout, webhook provisioning, auth, and refund revocation regressions fail PRs.
- **Attribution.** `scripts/data/photo-credits.json` now records the one shipped third-party photo (`milky-way-sentinel-dome.jpg`: Jackhen1992, CC BY-SA 4.0) and `emit-credits` wrote it into the PWA, so the plate caption and the Account page's Photography section now render the legally required credit. The Account paragraph was reworded to describe exactly what is credited.
- **Docs made truthful.** DEPLOY.md's smoke test and relaunch checklist now match the code (four regions, no sold/cap counter UI, KV production ids filled, editorial re-integration marked done). CLAUDE.md no longer calls `/api/auth/login` legacy or the guide waitlisted. `Open.tsx` comments no longer claim magic-link tokens are single-use server-side (they are deliberately reusable until access expires).

## Pre-merge ops gate

Merging this branch is the go-live action. Verify each item first; DEPLOY.md sections 2 through 8 are the runbook.

1. Secrets set on the deployed Worker: `STRIPE_SECRET_KEY` (live), `STRIPE_WEBHOOK_SECRET`, `MAGIC_LINK_SIGNING_SECRET`, `RESEND_API_KEY`.
2. Stripe webhook endpoint `https://api.thetalusfieldjournal.com/api/stripe/webhook` subscribed to **both** `checkout.session.completed` and `charge.refunded`. Without the second, refunded buyers keep access.
3. Resend sending domain for `cory@thetalusfieldjournal.com` verified **before** live keys. This is the sharpest failure in the system: with it unverified, a buyer is charged, the email throws, and no code or link ever arrives. (Stripe will retry the webhook, so a fix recovers stranded buyers automatically.)
4. `curl https://api.thetalusfieldjournal.com/api/inventory` returns `sold`, `cap: 100`, `priceCents: 1900`. The cap fails closed, so a misconfigured var reads as sold out.
5. Rotate or delete `DEV_USERNAME`/`DEV_CODE`; keep `ADMIN_*` as the operator door.
6. Full test-mode purchase per DEPLOY.md section 8: card 4242, email arrives, magic link signs in, email+code signs in on a second browser, then refund in the Stripe dashboard and confirm sign-in stops working.
7. Owner access seeded (DEPLOY.md "Owner access") so your own login outlives the launch.

## After merge

- Watch the first live purchase end to end (Stripe dashboard, Worker logs, your own inbox test).
- Optional, any time later: attach `guide.thetalusfieldjournal.com` to the Pages project **first**, then flip `GUIDE_APP_BASE` in `page-guide.jsx` and `APP_BASE_URL` in `workers/wrangler.toml` and redeploy the Worker. Never flip the vars before the domain resolves, or purchase emails link to a dead host. CORS already allows both origins.

## The photo pass: prepared, not yet run

The biggest perceived-value gap in a $19 product: 25 of 54 stops and all 15 secret spots render placeholders, and 9 images stretch across 34 stops (one meadow photo serves 6 of them). The repo has a complete pipeline to fix this from Wikimedia Commons with license-safe candidates and generated credits: `scripts/fetch-guide-photos.mjs` with a 57-slot manifest.

This session attempted the full pass. The sandbox's network policy denies `commons.wikimedia.org` (CONNECT 403 at the egress gateway), so the fetch cannot run here until `commons.wikimedia.org` and `upload.wikimedia.org` are added to the environment's allowed domains. Rerun in a session where those hosts resolve:

```bash
cd scripts
NODE_USE_ENV_PROXY=1 node fetch-guide-photos.mjs fetch            # all empty slots
NODE_USE_ENV_PROXY=1 node fetch-guide-photos.mjs fetch --force --only=region-valley.jpg   # repeat for the other 3 region heroes
# review candidates in scripts/data/photo-candidates/<file>/ against meta.json
node fetch-guide-photos.mjs select <file.jpg> <n>                 # per accepted slot
npm run images                                                    # responsive variants
node fetch-guide-photos.mjs emit-credits
node fetch-guide-photos.mjs verify
```

Then wire the files: add `photos: [{ src, caption }]` to the 33 photoless stops, replace the recycled entry on 12 stops that have their own manifest slot (valley-loop-drive, old-big-oak-flat-road, mirror-lake, four-mile-trailhead, washburn-point, glacier-point, tioga-road-drive, olmsted-point, may-lake, tenaya-lake, cathedral-lakes, gaylor-lake), and fill the 7 secret spots with slots. Captions double as alt text. Afterwards: add a `photos-secret-guide` download pack in `offline/manifest.ts` (region-less secret-spot photos are in no pack today) and extend `PACK_IDS` in `Home.tsx` and `Welcome.tsx`; measure the real download size and update the four "about 45 MB" claims in `page-guide.jsx`; refresh the photo notes in CLAUDE.md and the `stops.ts` header.

Two owner questions from the attribution review:
- 8 legacy photos have no recorded provenance (`tunnel-view`, `cooks-meadow`, `bridalveil-fall`, `el-capitan-*`, `mist-trail`, `vernal-fall`, `half-dome`, `tuolumne-meadows` families). If they are your own shots, say so and the credits copy can name house photography again; if any were pulled from the web, replace them via the pipeline.
- The milky-way credit's `source` URL is empty; fill in the Commons file page when reachable (`scripts/data/photo-credits.json`, then `emit-credits`).

## Known gaps, accepted for this launch

- **28 coordinates flagged `TODO: verify on the ground`** (15 stops, 8 secret spots, 5 amenities). Web-verified once in July 2026; the markers that remain had no authoritative source and need a field visit. Never strip a marker without standing at the spot. Wrong turnouts are the product's core risk.
- `valley-loop-drive` has no coordinate (it is a route, handled by the planner's flat buffer) and `curry-village` has no time budget (lodging). Both intentional.
- No PWA test suite and `strict` is off in its tsconfig. The Worker e2e in CI is the only automated behavioral net.
- `/tiles` and `/api/contact` are unauthenticated and unthrottled. Accepted abuse surface at this scale; the tile proxy leans on 30-day edge caching.
- Magic links are reusable until access expires, by design (documented in `Open.tsx`); the 64-hex token is the capability.
- The photo manifest slot `secret:mcgurk-meadow` is a no-op (the spot lives in `stops.ts` as a hidden stop).
- The PWA host stays deliberately noindexed (meta + `X-Robots-Tag`). No robots.txt was added: a `Disallow: /` would stop crawlers from ever seeing the noindex signals and can produce reference-only listings once the editorial site links the app.

## Verification record (2026-07-13)

Baseline before changes and re-run after: PWA `build` and `lint` green; Worker `typecheck` and `test:flow` green (all e2e checks pass); editorial `check` (cache-busters, SEO mirrors, prerender, compiled dist) green; editorial `checks` battery 0 errors, 0 warnings across 8 checks. Headless render check of `/guide` after the flip: buy button, $19, and offer line present, waitlist absent, no page errors.
