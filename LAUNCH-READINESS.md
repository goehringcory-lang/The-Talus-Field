# Field Guide launch readiness

_Audit date: 2026-07-13. Branch: `claude/pwa-audit-launch-bzmnx9`. This branch flips the guide to on-sale, so merging it to `main` puts the buy button in front of readers. Do not merge until the ops gate below is cleared._

## Verdict

| Subsystem | State |
|---|---|
| Worker purchase→access flow | Ship-ready. Checkout enforces a fail-closed monthly cap. The Stripe webhook verifies signatures, guards on the product tag, dedupes retries, provisions the buyer record (548-day access), and claims the dedupe slot only after the access email sends, so a failed email is retried by Stripe. Refunds (full or partial) revoke access. The whole path is covered by `workers/test/e2e-flow.mts`, which now runs in CI. |
| Buyer sign-in | Ship-ready, verified end to end. The purchase email carries a magic link (`/open?token=`, exchanged at `/api/auth/exchange`) and a 6-digit code for `/login` (`/api/auth/login`, rate-limited, constant-time compare). JWTs are stamped to the buyer's real expiry, so one sign-in lasts the paid window offline. Storage-blocked browsers still sign in; offline and 5xx never punish the buyer. |
| PWA shell and offline | Ship-ready. The July 12 audit (PR #182) fixed 18 bugs here; this audit re-verified the service worker HTML-poisoning guards, pack download and verify tolerances, the update banner chain, and the manifest and icon set. Build, lint, and typecheck are green. |
| Editorial sales page | On sale in this branch. Buy box renders the live price from `/api/inventory` with a $3.99 fallback, handles sold-out (409) and cancelled checkout, and links buyers to the app's login. Verified headless: buy button, price, and offer line render; the waitlist box is gone. |
| Sales copy honesty | Verified claim by claim against the shipped app: four regions, tappable GPS, offline topo map, time budgets and lot-full swaps, programs by date, trip planner with calendar export, essentials and packing checklist, search, Secret Guide. The download figure was re-measured on 2026-08-29 after the stand-in photo pass and is now stated as "about 70 MB" (the app's own buildPacks estimate: 70.4 MB on avif/webp, 61.1 MB on jpg). It had drifted: the copy still said 50 MB when the real estimate was already 60.2 MB. Re-measured 2026-09-04 after the photo pass: 81 unique photos ship, the app's own buildPacks estimate is about 66 MB (405 photo URLs at 120 KB plus the map and tracks) and the real avif ladder on disk is 36 MB of photos, so "about 70 MB" stands as an honest ceiling. |
| Content | 54 stops and 15 secret spots are written and schema-validated. The September 2026 photo pass gave every entry a credited photograph (four honest stand-ins remain, see below); 28 coordinates still carry ground-truth TODO markers. |

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
4. `curl https://api.thetalusfieldjournal.com/api/inventory` returns `sold`, `cap: 100`, `priceCents: 399`. The cap fails closed, so a misconfigured var reads as sold out.
5. Rotate or delete `DEV_USERNAME`/`DEV_CODE`; keep `ADMIN_*` as the operator door.
6. Full test-mode purchase per DEPLOY.md section 8: card 4242, email arrives, magic link signs in, email+code signs in on a second browser, then refund in the Stripe dashboard and confirm sign-in stops working.
7. Owner access seeded (DEPLOY.md "Owner access") so your own login outlives the launch.

## After merge

- Watch the first live purchase end to end (Stripe dashboard, Worker logs, your own inbox test).
- Done (August 2026): `guide.thetalusfieldjournal.com` is attached to the Pages project and serving. Order actually used: domain attached first, then a stale `guide.thetalusfieldjournal.com/*` route on the editorial Worker that was shadowing it removed, then `GUIDE_APP_BASE` in `page-guide.jsx` and `APP_BASE_URL` in `workers/wrangler.toml` flipped. CORS still allows both origins, so magic links already sent against the pages.dev host keep working.

## The photo pass: run September 2026

The pipeline described in earlier revisions of this section (`scripts/fetch-guide-photos.mjs`, the 76-slot manifest, Commons categories ahead of text search) finally ran once the environment could reach `commons.wikimedia.org` and `upload.wikimedia.org`. Read the live inventory off disk with `npm --prefix scripts run photos:check`; do not copy numbers from here into another doc.

What the run did: filled every manifest slot Commons could answer, replaced the twelve legacy photos that had no recorded provenance (the four region heroes and eight files copied from the editorial site) with credited files under new filenames, and gave the seven entries that were recycling another entry's photo their own. Every candidate was reviewed by eye on a contact sheet before selection; public domain and CC0 were preferred, and the CC BY / CC BY-SA files that remain are credited on the plate and on the Account page. Four entries still carry a stand-in (Carlon Falls, Evergreen Lodge, Little Nellie Falls, Hidden Lake), captioned to say what the photograph shows; Rancheria Falls keeps the Wapama trail photo for the same reason. Those are the outstanding slots, and they will stay outstanding until someone stands there with a camera: Commons has nothing usable for any of them.

Three things learned about the source, now encoded in the script: the API rate-limits a burst of unauthenticated calls (429 with Retry-After) and the fetch retries instead of dropping the slot; `upload.wikimedia.org` throttles a run of original-file downloads from one address for ten minutes at a time while `/thumb/` keeps serving, so every download now goes through a thumbnail URL; and anonymous thumbnails are only served at standard bucket widths (1280, 1920), so `THUMB_WIDTH` must stay a bucket. Waterfall slots carry `portraitOk` in the manifest, because the landscape-only gate left them nothing but lookalikes from the wrong drainage. The same script fills editorial slots in `img/` with `--target=editorial` (own manifest and credits JSON under `scripts/data/`).

The attribution questions from the earlier review are closed: no shipped photo lacks a recorded author and licence, and the milky-way credit's source URL is the only field still empty.

## Known gaps, accepted for this launch

- **28 coordinates flagged `TODO: verify on the ground`** (15 stops, 8 secret spots, 5 amenities). Web-verified once in July 2026; the markers that remain had no authoritative source and need a field visit. Never strip a marker without standing at the spot. Wrong turnouts are the product's core risk.
- `valley-loop-drive` has no coordinate (it is a route, handled by the planner's flat buffer) and `curry-village` has no time budget (lodging). Both intentional.
- No PWA test suite and `strict` is off in its tsconfig. The Worker e2e in CI is the only automated behavioral net.
- `/tiles` and `/api/contact` are unauthenticated and unthrottled. Accepted abuse surface at this scale; the tile proxy leans on 30-day edge caching.
- Magic links are reusable until access expires, by design (documented in `Open.tsx`); the 64-hex token is the capability.
- The photo manifest slot `secret:mcgurk-meadow` is a no-op (the spot lives in `stops.ts` as a hidden stop).
- The PWA host stays deliberately noindexed (meta + `X-Robots-Tag`). No robots.txt was added: a `Disallow: /` would stop crawlers from ever seeing the noindex signals and can produce reference-only listings once the editorial site links the app.

## Verification record (2026-07-13)

Baseline before changes and re-run after: PWA `build` and `lint` green; Worker `typecheck` and `test:flow` green (all e2e checks pass); editorial `check` (cache-busters, SEO mirrors, prerender, compiled dist) green; editorial `checks` battery 0 errors, 0 warnings across 8 checks. Headless render check of `/guide` after the flip: buy button, $3.99, and offer line present, waitlist absent, no page errors.
