# Code & ROI Audit — August 2026

Full-repo audit run by five parallel agents across the Worker API, the Field Guide PWA,
the editorial site, the build/CI guards, and the revenue funnel. Findings are code-level
and cite `file:line`. Nothing in this pass changed product code.

**Baseline:** all repo guards currently pass — `scripts run check` (9 guards + 945 itinerary
placements), `workers typecheck`, `guide lint`, `guide build`. Every finding below is
something no existing guard catches.

---

## Top 10, in fix order

| # | Severity | Where | What |
|---|---|---|---|
| 1 | CRITICAL | `workers/src/routes/stripe.ts:231-241,260,289` | Renewal/gift path re-extends access on Stripe retry |
| 2 | HIGH | `workers/src/lib/kv.ts:130-161` | Access-code rate limit is non-atomic; effectively unenforced |
| 3 | HIGH | `apps/guide/src/sync/schema.ts:67-78` | Sync salvage silently wipes saved stops/notes across devices |
| 4 | HIGH | `apps/guide/src/trip/slotting.ts:240-257` | Anchored stops miss the day-overflow check → 9:30 p.m. lunch |
| 5 | HIGH | `app.jsx:882-890` | `/#start-here` — the homepage's own hero CTA — 404s on refresh |
| 6 | HIGH | `app.jsx:952-970` | Route races: last bundle to load wins, not last clicked |
| 7 | HIGH | `.github/workflows/ci.yml:15-50` | No CI runs the editorial guards; stale `dist/` can auto-deploy |
| 8 | HIGH | `scripts/check-cache-busters.sh` | Guard checks `?v=` presence, never freshness |
| 9 | HIGH (ROI) | `page-guide.jsx:106,193` | No purchase event — the buy funnel is unmeasurable |
| 10 | HIGH (ROI) | `page-map.jsx:53-61,388-395` | Shared `?trip=` links land on the email wall |

**Status, re-verified against the tree 2026-08-23.** Rows 1, 4, 5, 6, 7, 9 and 10 read as fixed
in current `main` (the renewal extension is now keyed on `lastExtensionEventId`; the anchored
loop has the day-overflow check; `legacyHashToRoute` leaves real in-page anchors alone;
navigation takes a request token; CI runs the editorial guard suite; `guide_purchase` fires on
the Stripe return; a `?trip=` link opens ungated for the visit). Row 3 was **half** fixed and
row 8 was open; both are closed below. Row 2 is the one still open.

---

## 1. Worker API (`workers/`)

**[CRITICAL] `routes/stripe.ts:231-241, 260, 289` — renewal extension is not idempotent.**
`putBuyer` writes `expiresAt = max(now, existing.expiresAt) + 548d`, but the dedupe slot is
only claimed at `:305`, *after* the email send. If `sendRenewalConfirmation`/`sendGiftAccess`
throws, the handler 500s, Stripe retries, and the retry re-reads the already-extended record
and adds another 548 days. A Resend outage during retries stacks multiple 18-month grants for
one $2.49 payment. The `:285` comment ("putBuyer is idempotent on email") holds only for the
fresh-purchase branch. **Fix: claim the dedupe key before any side effect, or make the
extension absolute rather than relative.**

**[HIGH — STILL OPEN as of 2026-08-23] `lib/kv.ts:130-161` — `incrementFixedWindow` is a non-atomic read-modify-write**,
and it is the only protection on the 6-digit access code (`routes/auth.ts:63`). 500 concurrent
`POST /api/auth/login` for a known buyer email all read the same counter, all pass the
`attempts <= 5` check, none get 429. KV reads are also up to 60s stale across colos, so
sequential bursts from different regions undercount too. The cap on a ~10⁶ space is
effectively unenforced. **Fix: Durable Object counter, or accept and add a hard per-email
lockout with a longer window.**

**[MEDIUM] `lib/kv.ts:366-373` — `recordRenewLinkAttempt` re-puts a fresh `expirationTtl: 3600`
on every call**, which is exactly the sliding-window permanent-lockout scheme the header
comment at `:122-127` says was removed. A bot probing `GET /api/checkout/renew?token=` more
than hourly keeps the counter alive forever; past 10 the IP locks out permanently, and behind
CGNAT that blocks every real buyer on that address from renewing.

**[MEDIUM] `routes/checkout.ts:24` — `/api/checkout/start` has no auth, honeypot, or rate
limiter**, unlike `/api/contact`, `/api/waitlist`, and `/api/trip/email` which all hash-IP
throttle. Each call creates a live Stripe Checkout session; a trivial loop exhausts the
account's Stripe API rate limit and blocks real buyers.

**[MEDIUM] `routes/push.ts:88-105` — subscribe overwrites any existing record for an endpoint
hash with no ownership check.** Any signed-in account that learns a victim's endpoint URL takes
over that device: the victim stops getting their own renewal notices, and an attacker-set
year-long trip window pushes their phone every morning indefinitely. The DELETE handler at
`:134` guards this exact case; subscribe does not.

**[MEDIUM] `routes/stripe.ts:263` vs `routes/checkout.ts:25-37` — the inventory cap is checked
against `currentMonthLabel()` (now) but incremented into the month of `session.created`.** A
session created 23:50 UTC on the last of the month and paid after midnight increments a bucket
nothing reads. The monthly cap silently oversells across every month boundary.

**[MEDIUM] `lib/kv.ts:115-120` — `incrementInventory` is read-then-write with no atomicity.**
Two concurrent webhooks both read N and write N+1, permanently losing a sale from the count.

**[LOW] `lib/kv.ts:100-104` — `putBuyer` never deletes the previous `token:<hex>` index entry,
and they carry no `expirationTtl`.** Unbounded key growth, and an old access token from a
forwarded email keeps working at `GET /api/checkout/renew?token=`.

**[LOW] `routes/auth.ts:119-121` — `/api/auth/resend` and `/api/auth/dev-login` use the raw
`cf-connecting-ip` as KV key material**, while every other throttled route SHA-256s it first.
The comment at `kv.ts:200-201` says the raw address never touches KV; on these two paths it
lands in KV listings and logs.

**[LOW] `routes/photos.ts:138-145` — the R2 put silently overwrites an existing
`<surface>/<slug>.<ext>` key.** `ingest-photos.mjs` treats this as a hard error without
`--replace`; here, two phone uploads with the same subject name destroy the first staged file
before the import workflow sees it. (No traversal risk — `slugify` at `:52` is sound.)

**[LOW] `routes/programs.ts:68-84, 128-131` — with `NPS_API_KEY` unset, the meta record is
never written, so `stale` is permanently true.** Every `/api/programs` request then attempts a
doomed live fetch plus a no-op `waitUntil` instead of reading KV.

---

## 2. Field Guide PWA (`apps/guide/`)

**[HIGH] `src/trip/slotting.ts:240-257` — the anchored (midday/sunset) loop is the only
placement path with no `start + duration > DAY_END` check.** The floating loop has it at
`:291`, the evening loop at `:321`. Reproduced: a `midday` stop plus back-to-back fixed
programs 08:00–21:00 puts `curry-village-pizza` at **startMin 1290 — 9:30 p.m., ending 10:30
p.m.** A buyer sees "Lunch" at 9:30 p.m. on `/trip` and in the exported `.ics`. This is the
exact failure the anchoring comment says it exists to prevent; `check-itineraries.ts` only
exercises presets, so it never sees it.

**[HIGH — FIXED 2026-08-23] `src/sync/schema.ts:67-78` + `src/sync/planSync.ts:118-126,166` — salvage silently
zeroes `favorites`/`visited`/`notes` when their shape doesn't match**, with no equivalent of
the `planUnparseable` guard that protects `plan`. A server doc from a newer build (or with one
corrupted field) arriving with a newer stamp wipes every saved stop, visited mark, and private
note on this device — then `:166` pushes the now-empty doc back, propagating the loss to every
other device. Asymmetric with the plan, which is explicitly protected from exactly this.
*Fixed: `parseSyncDoc` now returns a per-field `unparseable` map instead of the plan-only flag,
`applyRemote` skips any field it names rather than writing the placeholder over real data, and
the heal push fires only when nothing was lost. A list survives only intact (filtering the bad
entries out of a newer build's `[{id, addedAt}]` was the same wipe in slow motion) and an absent
field counts as a loss, since every build that writes this document writes all four. Note the
audit's own framing was slightly off: `planSync` HAD been reworked around `planUnparseable`, so
the plan half was covered and only the other three fields were exposed.*

**[MEDIUM] `src/trip/useTripPlan.ts:46-51` — the cross-tab `storage` listener assigns
`memPlan = readStorage()`, which returns `null` on a version mismatch** (`TripPlan` requires
`version: z.literal(1)`). `memPlan = null` makes the next read return `emptyPlan()`, and the
next "Add to trip" **writes that empty plan over the good one**. Triggered by a staged deploy
where one tab runs a newer build.

**[MEDIUM] `src/offline/useDownloads.ts:320-331` — `remove()` reads the completion map, awaits
N cache deletes, then writes the stale map back.** A pack completing during those awaits has
its `completed[id] = true` clobbered: shows "Downloaded" this session, reverts on next launch,
files orphaned where `remove` can no longer target them.

**[MEDIUM] `src/offline/useDownloads.ts:76-87` — `verifyPack` ignores `pack.tolerateMissing`.**
The tile pack downloads with 5% tolerance but verifies at 0%, so one iOS-evicted tile flips it
to `stale` and tells the buyer to re-download ~100 MB — repeatedly, since re-downloading can't
fix a recurring eviction.

**[MEDIUM] `src/auth/AuthGate.tsx:22-31` — the `storage` handler has no `e.key` filter**, so
every cross-tab write to `tfg.trip.plan`, `tfg.favorites`, etc. calls `dropMemoryJwt()`. Where
`setStoredJwt` failed but `getItem` works (quota exhausted), the JWT lives only in `memoryJwt`
and the next unrelated write signs the buyer out mid-session. Also forces a full provider
re-render on every foreign-key write.

**[MEDIUM] `public/sw.js:374-389` + `:7` — `tfg-runtime` is unversioned, cache-first, never
revalidated**, and `activate` only purges HTML from it. Photo URLs carry no `?v=` (unlike
`/tracks/`), so a photo re-shot at the same filename via `--replace` is served from the old
cache **forever** on any device that visited that stop. No invalidation short of clearing site
data.

**[MEDIUM] `src/trip/useTripPlan.ts:266-268` — dragging a stop onto a day that already holds
it takes the dedupe branch, which deletes the dragged item outright**, discarding its
`startTime`, `durationMin`, and `eventUid`. The block the user was holding vanishes with no
toast and no undo. Reads as "the drag deleted my stop."

**[LOW-MED] `src/components/TripAgenda.tsx:88-91` + `useTripPlan.ts:243` — `placeItem` never
clamps to `plan.dates`** (unlike `addStop`/`addHike`, which use `clampDay`). With a late program
on the last trip day, dropping at the bottom of the track moves the item to the day *after* the
trip ends, into the "outside your dates" bucket.

**[LOW] `public/sw.js:329, 385, 401` — `cache.put(...)` is neither awaited nor caught** in all
three cache-first handlers. A routine `QuotaExceededError` becomes an unhandled rejection in
the SW; in the tiles branch the un-awaited put also races the returned response.

**[LOW] `src/trip/ics.ts:104-112` — `dtLocal` only rolls the date forward.** A negative
`startMin` wraps to `23:30` on the start day while `timeOfDay` is modulo-corrected, so `DTEND`
can precede `DTSTART` and calendar clients reject the VEVENT.

**[LOW] `src/trip/agendaLayout.ts:95` — `to` is hard-clamped to `LATEST` (26:00).** A 23:00
block with a 4-hour duration renders past the bottom of its track, and any drag on it clamps
back inside the window — the block cannot be moved to where it visually sits.

*Verified clean:* `sun/solar.ts` (ICU "24" and UTC-boundary handling both correct),
`utils/date.ts`, `lib/install.ts` (module-level `autoDecision` survives StrictMode),
`exportTrip.ts`, `importTrip.ts`, and the never-cache-HTML invariant, consistently enforced
across `sw.js` install/fetch/message and `useDownloads.fetchIntoCache`.

---

## 3. Editorial site (root `*.jsx`, `edge/`)

**[HIGH] `app.jsx:882-890` (boot mirror at `1170-1177`) — `legacyHashToRoute` treats any hash
on `/` as a legacy route key, but the home shell ships a real in-page anchor:** `index.html:259`
renders `<a href="#start-here">First visit →</a>`. Reloading, bookmarking, or sharing
`https://thetalusfieldjournal.com/#start-here` rewrites the URL to `/start-here` and renders
"Page not found". **The homepage's own first hero CTA 404s on refresh.**

**[HIGH] `app.jsx:952-970 `go()` + `941-949 onPop` — navigation has no request token.**
`ensureRoute(r).then(() => setRoute(r))` commits whichever bundle resolves *last*, not whichever
was requested last. Click "Field Guide" (large, cold) then quickly "Conditions": the URL and
history say `/conditions`, `applySeo` runs for `/conditions`, then the guide bundle lands and
paints the guide page under the `/conditions` URL. `onPop` races `go()` the same way.

**[MEDIUM] `app.jsx:129-141 `loadScriptOnce` + `154-158` — a rejected promise is cached in
`loadedScripts[src]` forever**, and the prefetch sweep swallows the rejection. One flaky fetch
during the first-interaction warm-up (~25 bundles at once) permanently poisons that route for
the session: every later click does a full `window.location.assign` reload instead of an SPA
navigation, with no retry short of closing the tab.

**[MEDIUM] `page-map.jsx:904` — `mapId: "DEMO_MAP_ID"` is Google's documented development-only
map ID, shipped in production.** Subject to Google-side throttling/deprecation, and it blocks
cloud-based map styling. If Google retires it, `AdvancedMarkerElement` stops rendering and the
map goes pin-less — the `.catch` at `:936` covers the loader, not a live-but-empty map.

**[MEDIUM] `.assetsignore` vs `wrangler.jsonc` (`assets.directory: "."`) — the ignore list
excludes `apps`, `workers`, `edge`, `.claude`, `*.md`, but not `scripts/`, `.github/`, or
`photo-inbox/`.** So `https://thetalusfieldjournal.com/scripts/gen-seo-artifacts.mjs`,
`/scripts/data/lighthouse-history.json`, and `/.github/workflows/photo-import.yml` are
fetchable on the production domain.

**[MEDIUM] `intent-data.js:240-257` — `relaxIntent`'s `CEILING` guard is applied only on the
`return candidates[i]` path, never on the `fallback` path.** With an empty `intent.topic`,
candidates[2] and [4] collapse to the all-empty selection, which passes 100% of the catalog;
if candidates[0]/[1] match nothing, the function returns **the entire archive** presented as
"the entries that fit your trip" — the exact non-narrowing the comment above it forbids.

**[LOW] `edge/seo.js:1044-1047` — `REDIRECTS` discards the query string and hard-codes the apex
origin.** A retired slug arriving as `/articles/old-slug?utm_source=newsletter` loses its
attribution; a `www.` visitor is bounced cross-host. Latent only because the table is empty.

**[LOW] `components.jsx:1276` — `ExpediaBanner`'s disclosure link is a bare `<a href="/affiliate">`
with no `go()` handler**, unlike every other in-app link in the file. Tapping it forces a full
document reload and re-downloads the shell.

*Verified clean:* the `known` SEO table covers all 29 `STATIC_ROUTE_KEYS` (`kit` at `:370` and
`films` at `:404` are special-cased above the table) and matches `edge/seo.js` one-for-one;
`?trip=` is id-whitelisted at both `edge/seo.js:386-388` and `page-map.jsx:171-180` with all
edge meta going through `setAttribute`/`escapeHtmlText`, so no injection; `points.geojson` and
`POINTS_URL` were bumped in the same commit; no direct `window.localStorage` outside
`storage.js`, and the map gate genuinely fails open; no dead route keys in
`NAV_GROUPS`/`NAV_SECONDARY`/`KEEP_GOING`; `affiliate.js` empty-ID branches all fail soft with
no retired bare `article` `aff_list` value; CSP covers everything actually loaded.

---

## 4. Build guards & CI

The guards that exist are sound — drift probes confirmed `gen-compiled --check` and
`check-seo-artifacts.sh` both correctly fail on real drift. The problem is coverage.

**[HIGH] `.github/workflows/ci.yml:15-50` — no CI runs the editorial guard suite.** It builds
and lints the PWA and typechecks the Worker only. The editorial site auto-deploys from `main`
via Cloudflare Workers Build, so stale `dist/*.js`, stale SEO mirrors, an untagged article, or a
dangling guide-photo `src` can merge and deploy. Every editorial guard is local-only and
voluntary. **Highest-leverage single fix in this section: add `npm --prefix scripts run check`
to the PR job.**

**[HIGH — FIXED 2026-08-23] `scripts/check-cache-busters.sh` — verifies `?v=` presence, never freshness.** Probe:
appended a comment to `styles.css` with no version bump; the guard passed. Combined with the
above, edited CSS/JSX ships behind a 30-day-immutable CDN cache with nothing failing. **Fix:
hash the file contents and compare against a committed manifest.**
*Fixed as specified: `scripts/check-asset-freshness.mjs` + `scripts/data/asset-versions.json`,
wired into `run check` (so CI gates it, per the item above). 105 assets covered, which closes
the MEDIUM below in the same pass: every `PAGE_MODULES` bundle (served under a shared number no
file mentions — the largest blind spot), every `dist/bodies/*.js` against its `BODY_VERSIONS`
entry, `points.geojson`, `bulletin.json` including that the two constants agree, and the `/img/`
counter. `--stamp` refuses to record new bytes under an unchanged version; the original probe
and four others now fail the guard.*

**[MEDIUM — FIXED 2026-08-23, by the item above]** Three hand-coupled data cache-busters have no guard at all — `POINTS_URL`
(`page-map.jsx:22`) and the `BULLETIN_URL`/`HOME_BULLETIN_URL` pair (`page-now.jsx:15`,
`page-home.jsx:305`). Editing `points.geojson` or `bulletin.json` without bumping passes
everything, and the two bulletin constants agreeing is itself unchecked.

**[MEDIUM] `system-checks.yml:69-80` pushes directly to `main`** with `contents: write`. `[skip ci]`
suppresses GitHub Actions but **not** Cloudflare Workers Build, so every nightly Lighthouse
commit triggers a full editorial redeploy. The `if: github.event_name != 'pull_request'` guard
at `:70` is dead code — the workflow only triggers on `schedule`/`workflow_dispatch`.

**[MEDIUM] `scripts/gen-seo-artifacts.mjs:205-241` — the sitemap's static-route table is
hand-maintained and uncovered.** `check-seo-artifacts.sh` only proves the committed sitemap
matches what the generator emits; it cannot notice a route in `STATIC_ROUTES`/`edge/seo.js`
that was never added to this table — and so is absent from the sitemap *and* from
`indexnow.yml`, which parses `sitemap.xml`. The literal `lastmod` values also never move when a
page's copy changes.

**[MEDIUM] Two generated artifacts have no freshness check at all.** `img/og/trip-{1..20}.jpg`
(`gen-og-cards.mjs` has no `--check` and isn't in `run check`) — a renamed trip point
regenerates the checked `trip-points.json` while the baked OG images keep the old name. And
`apps/guide/src/content/trails.generated.ts` + `TRACKS_VERSION` — a `hikes.ts` stat edit
silently desyncs the committed track stats and the SW cache-busting hash.

**[MEDIUM] `photo-import.yml` opens PRs no guard inspects.** The Ingest step deliberately
discards the exit code (`set +e` … `status=${PIPESTATUS[0]}` … only echoed), then commits and
opens a PR. `ci.yml`'s `pull_request` job never runs `photos:check`, so a photo with an
incomplete responsive ladder merges green — and per CLAUDE.md that makes a whole region's
offline pack fail permanently.

**[LOW-MED] Two integrity checks are warn-only where the production failure is silent.**
Current run: `12 referenced photo(s) have no recorded author/license` (licensing exposure on a
paid product) and `1 article carries no tags in any facet` — CLAUDE.md calls the intent guard
"the only thing that can catch drift", but the untagged case exits 0, and an untagged article
is invisible to every filter on `/planning` and `/articles`.

**[LOW] `indexnow.yml:46-58` re-pings the entire sitemap on any qualifying push** (~80 URLs, no
diff against the previous commit). A cache-buster bump in `index.html` re-submits the whole
site. The secret guard at `:29-39` is correct and fails soft.

*Also noted:* `apps/guide` build emits `dist/assets/Map-*.js` at **1,055 kB**, over the 500 kB
warning threshold.

---

## 5. ROI & revenue

### Ship this week (high return, low effort)

**1. The buy funnel has no conversion event.** `page-guide.jsx:153, 1051, 1152` fire
`guide_buy_click` from three placements, but the Stripe return at `:106,193` reads
`?guide=success` and tracks *nothing*. There is no `purchase` or `begin_checkout` in the GA4
inventory. Conversion rate per placement is uncomputable, so every buy-box decision is blind.
Stash the buy location in sessionStorage before the redirect, fire `guide_purchase{location,
gift}` on success. **S — and it gates honest measurement of items 12–13.**

**2. The map is still fully view-gated, which voids the OG-card investment.**
`page-map.jsx:53-61, 388-395, 1254`: the gate renders whenever `!unlocked`, *including* on
`/map?trip=` links. Both strategy docs claim this shipped; the code disagrees.
`gen-og-cards.mjs` and the per-trip `edge/seo.js` override exist purely to make shared trip
links clickable in a text thread — every one of those clicks currently lands on a blurred email
wall. At minimum, skip the gate when `?trip=` is present. **S–M.**

**3. 512 archive pages carry zero capture and zero product CTA.** *Shipped 2026-08-23: `askBlock`
in the generator puts one unit at the end of every issue page and the landing page — the Sunday
letter (Buttondown tags `archive` / `archive-index`, the only attribution a surface with no GA4
can have) plus one line on the Field Guide whose citation count is read from the guide's own
content rather than typed. Rules at the block; summary in CLAUDE.md's archive bullet.*
`scripts/gen-archive.mjs:137-138`
— the issue footer links only `/films`, `/about`, `/`, and `/map`. That's the largest indexed
surface on the site (~1.87M words, its own sitemap) monetized at $0. One template edit +
regenerate = 512 pages of funnel. **S.**

**4. `/consult` is unsellable but is actively being recommended.** `page-consult.jsx:18-20`:
both `CONSULT_PAYMENT_LINK_URL` and `CONSULT_BOOKING_URL` are `""`, so the page degrades to a
mailto — while `intent-data.js:475,493` routes every constrained trip plan (4+ days, access
needs, unbooked peak dates) there. ~$570/mo of stated capacity blocked on pasting two dashboard
URLs. **S.**

**5. Four high-lodging-intent article bodies have no affiliate link at all.** *Shipped 2026-08-23:
all four now carry one inline `AvailabilityLink` at the point the prose already sends the reader
to find a bed, plus a boxed `LodgingCta` and an `AffiliateNote`. The guardrail is applied in each:
the unaffiliated best answer (the concessioner's in-park rooms, the Ahwahnee, the accessible rooms
you have to phone for) stays the recommendation, linkless, and the search answers only the question
it can — what is left on your dates.* 16 of 49 bodies
use `AvailabilityLink`/`LodgingCta`. Uncovered, by lodging-keyword density:
`yosemite-for-non-hikers.jsx` (20 mentions), `yosemite-without-reservations-2026.jsx` (7),
`where-to-propose-in-yosemite.jsx` (6 — highest ADR intent on the site),
`yosemite-accessibility-guide.jsx` (5). Components and disclosure already exist; markup plus a
`?v=` bump. **S each.**

**6. The Expedia banner slot on `/stay` is dark.** `affiliate.js:56-64` — `EXPEDIA_BANNER.img`
and `.href` are empty, so `ExpediaBanner` renders nothing on the highest-commercial-intent page.
Component, CSP allowance, and `aff_list: stay_banner` tracking all shipped. Paste two URLs. **S.**

### Next

**7. Newsletter conversion numbers are fiction.** `components.jsx:1449+` still posts to the
Buttondown iframe embed and calls `trackNewsletterSubmit` on `onSubmit`. The CONVERSION-STRATEGY
R8 Worker endpoint never shipped. Typos and rejections count as conversions, so map-gate CR —
the number justifying the gate in item 2 — is inflated by an unknown factor. **M.**

**8. Every signed-out PWA storefront surface is `noindex, nofollow`.** `apps/guide/index.html:17`
and `public/_headers:4` block the whole app, including `/preview` and the ~66 signed-out
`/stop/:id` teaser pages the storefront pass built *specifically* as shareable landing pages
with OG tags. `nofollow` also strips link equity back to the editorial site. Gated content
should stay blocked; marketing surfaces should not. **M.**

**9. Purchase emails send buyers to a `pages.dev` host.** `workers/wrangler.toml:60` and
`page-guide.jsx:9`. Magic links, access codes, renewal notices, and the `/preview` link all land
on a hostname that looks nothing like the brand, at the highest-anxiety moment in the funnel.
LAUNCH-READINESS documents the safe order: attach `guide.thetalusfieldjournal.com` first, then
flip both vars. Also unblocks item 8. **M.**
*Resolved (August 2026), in the documented order: domain attached to the Pages project, a stale
`guide.thetalusfieldjournal.com/*` route on the editorial Worker that was shadowing it removed,
then both vars flipped to `https://guide.thetalusfieldjournal.com`. The `wrangler.toml` line
cited above has since drifted to `:66`. The pages.dev origin stays in the CORS allowlist so
magic links already in inboxes keep working.*

**10. Group codes is a B2B pitch page with no price.** `page-partners.jsx:20-26` removed the
tier table, and there's no promo/redeem route in the Worker. A lodging manager can't get a
number. Manual invoicing for the first ten partners is fine — but quote a per-code price. **S**
for the price line, **M** for KV codes + `/open` redemption.

**11. Camping has no camping affiliate.** `affiliate.js:34-44`: Booking, Stay22, and Hipcamp IDs
are all `""`. `yosemite-camping-complete-guide.jsx` is one of the four money articles but its
Expedia links are a poor category match. Hipcamp is the best unexploited program-to-content fit
on the site; code is **S**, application lead time is the real cost — start it now.

### Bigger bets

**12. Pricing and the strategy docs have diverged.** `wrangler.toml` sets
`GUIDE_PRICE_CENTS = "399"`, but MONETIZATION-IDEAS reasons about $19 throughout — including
2.4's B2B model at "$8–10/code," **2.5× above current retail** and unsellable as written. §2.5's
price test is the highest-leverage item on the board (one var, read live by the buy box,
`/preview`, and `/partners`), but the pricing decision comes first and
`GUIDE_RENEWAL_PRICE_CENTS` must move with it. **Decision: S. Consequences: L.**

**13. The paid product gets less visual weight than the free lead magnet on every article.**
`page-article.jsx:445-464` gives `/map` a full bordered CTA card; the Field Guide at `:487-495`
gets one 13px grey sentence, on 40 of 49 articles. `GuidePromo` is used on ten static routes and
**zero** article pages — where all the organic traffic lands. Test `GuidePromo` on `planning`
articles, measured with item 1's new event. **S–M.**

**14. The photo pass is a conversion project wearing a content chore's clothes.** 26 unfilled
slots, 18 entries rendering "Photo coming," 10 showing a neighbor's photo. `/preview` renders
real entries through the real `StopCard` — a photoless sample *is* the sample, and screenshots
are the sales page's only proof. Still blocked on Commons/Pexels egress, but the local
`ingest-photos.mjs` path needs no allowlist and the owner is in the park. **M.**

---

## Cross-cutting themes

1. **Non-atomic KV read-modify-write is a pattern, not an incident** — it appears in the rate
   limiter, the inventory counter, and the download-completion map. Each is individually
   low-probability; together they're the most common defect class in the repo.
2. **Guards check presence, not correctness** — cache-busters, the sitemap table, OG cards, and
   track stats all have a "someone remembered to update it" step that nothing verifies.
3. **The revenue instrumentation gap is upstream of every optimization** — items 1, 7, and 13
   are one problem: the funnel can't be measured, so improvements can't be ranked by evidence.
4. **Several features shipped fully and were never switched on** — the Expedia banner, `/consult`
   payment links, the trip-share OG cards behind the map gate. This is the cheapest revenue in
   the audit.
