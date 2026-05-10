# The Talus Field — Website Audit & Next Steps

_Audit date: 2026-05-09. Compiled from four parallel sub-audits: editorial site, PWA field guide, Worker API + infra, cross-cutting QA._

The site is close to a working brand-and-product surface, but three things are blocking confident launch: **broken editorial routes**, **a half-finished PWA content layer**, and **a Stripe relaunch path with sharp edges**. Below are the next steps, ordered.

---

## P0 — fix this week

1. **Wire `/guide` and `/cap` into the editorial router.** `page-guide.jsx` and `page-cap.jsx` are loaded in `index.html` but `app.jsx:337-374` has no case for them, so both URLs fall through to the homepage. Add globals + cases + sitemap entries. _Same fix path resolves the orphan `/affiliate` link in `page-advertise.jsx:62` and `page-kit.jsx:17`._
2. **Verify the 20 stop coordinates marked `// TODO: verify`** in `apps/guide/src/content/stops.ts`. Cathedral Lakes (line 383, "VERIFY URGENTLY") is the worst offender. Wrong turnouts in a navigation PWA are a credibility and safety issue.
3. **Photos for 12 of 21 stops are missing** in `apps/guide/public/photos/` (only 9 files exist). Either ship the photos or render an explicit "photo coming" state — silently broken `<img>` is worse than absence.
4. **Stripe webhook is not safe to flip on.** `workers/src/routes/stripe.ts:36-83` has no `event.id` dedupe (Stripe retries → duplicate buyer records and double-incremented inventory) and `sendMagicLink()` at line 80 has no try/catch (failed email returns `200`, buyer paid and got nothing). Both must land before checkout reopens.
5. **Remove `/api/auth/dev-login` brute-force exposure.** No rate limiting on a 6-digit code path is a 1M-key brute force in prod. Either add throttling matching `/api/auth/login`'s 5/hour, or env-gate the route off in production.

## P1 — before relaunching checkout

6. **Inventory cap race.** `workers/src/lib/kv.ts:49-54` does read-modify-write on eventually-consistent KV. Two concurrent webhooks both read 99 → both write 100. Switch to a Durable Object counter or pre-issued voucher pool.
7. **No JWT revocation / logout.** 90-day tokens with no kill switch. Add `/api/auth/logout` + KV revocation list before any real buyer holds a token (`workers/src/lib/jwt.ts`).
8. **PWA → editorial back-link is missing.** Buyers are stranded inside `guide.thetalusfieldjournal.com` with no path back to the journal. Add a header/footer link in the gated chrome.
9. **Stale homepage masthead.** `page-home.jsx:20` still says "Vol. III · No. 18 · The April Issue" on May 9. Either templatize or remove.
10. **Em-dashes in `bodies/pack-your-car-for-yosemite.jsx`** (lines 9, 31, 45, 53, 67) violate the documented voice rule. Replace with periods or commas.
11. **Author location mismatch** between `page-legal.jsx:30` ("El Portal") and `data.js:14` ("Yosemite National Park"). Pick one — it's leaking into structured data.
12. **`DEPLOY.md` is stale** — references trip-based model (`1day`/`3day`/`5day`, "35 stops") and outdated env var names. Fold into the current region-based reality or delete the bad sections.

## P2 — hygiene & polish

13. **`node_modules/` is committed** under `workers/` and `apps/guide/`. Remove from history, fix `.gitignore`.
14. **No CI.** Add a single GitHub Actions workflow: PWA `npm run build && npm run lint`, Worker `npm run typecheck`, and a smoke check that every `bodies/*.jsx` registered in `index.html` resolves. Editorial site has zero automated guardrails today.
15. **Image weights.** `img/day-pack-flat-lay.jpg` (2.2MB), `lower-yosemite-fall.jpg` (982KB), `vernal-fall.jpg` (954KB) are served full-size with no `srcset` and inconsistent `loading="lazy"` (only 2 occurrences in the editorial JSX). Convert to WebP + add lazy loading.
16. **Cache-buster drift.** Article body scripts sit at `?v=1` while page scripts are at `?v=20-35` (`index.html`). Either bump on every body edit or move to a shared version constant.
17. **No CSP.** `_headers` has no `Content-Security-Policy`. Add `default-src 'self'`, `form-action 'self'`, and an explicit allow-list for the GA + Stripe + API origins.
18. **Stop schema doesn't enforce minimum data per kind.** 9/21 stops lack `coord`, 8 lack `elevationFt`. Tighten `apps/guide/src/content/schema.ts` so a missing coord fails the build instead of shipping a half-empty stop card.
19. **Single source of truth for articles.** `articles.json`, `categories.json`, `sitemap.xml`, `feed.xml`, `llms.txt`, and `data.js` all mirror the same set by hand. Generate the static files from `data.js` in a tiny build script.
20. **Add a root `README.md`.** Repo currently has only `CLAUDE.md` + `DEPLOY.md` — public visitors get no orientation.

---

## Recommended sprint order

- **Sprint 1 (1–2 days):** P0 #1, #9, #10, #11 — pure editorial fixes, ship as one PR. Visible polish and unbroken nav.
- **Sprint 2 (3–5 days):** P0 #2, #3 — coordinate verification pass + photo shoot/photo-coming UX. This is the gating work for any PWA marketing.
- **Sprint 3 (3–5 days):** P0 #4, #5 + P1 #6, #7 — harden the Worker so checkout can be re-enabled. Should land behind a `STRIPE_LIVE` flag.
- **Sprint 4 (ongoing):** P2 hygiene + CI. Pay this down once and the next quarter of edits is faster.

**Single biggest unlock:** the PWA cannot honestly be sold until the coordinate TODOs are resolved and every stop has a photo. Everything else is fixable in days; that one is fixable only with field time.
