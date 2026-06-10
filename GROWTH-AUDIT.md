# The Talus Field — Growth, Engagement & Monetization Audit

June 2026. Internal working document. Note: files at the repo root are served by
Cloudflare Pages (as DEPLOY.md is), so treat everything below as world-readable.
Nothing here is secret, but pricing decisions referenced here should be settled
in private before they appear on /advertise.

The goal, as stated: make the site the definitive online source for Yosemite,
grow readership into newsletter signups (phase 1), use the audience to sell
directory listings and newsletter advertising, then relaunch the paid Field
Guide PWA (phase 2, roughly next year). This document records where the site
stands, what was changed in the audit pass that produced it, and the
prioritized work that remains.

---

## 1. Where the site is strong

These are real assets. Most independent travel sites have none of them.

- **Edge SEO is solved.** `functions/_middleware.js` rewrites every route's
  title, description, canonical, OG/Twitter cards, and JSON-LD at the edge, so
  crawlers and link unfurlers get correct metadata without executing the
  in-browser Babel setup. This removes the usual penalty of the no-build
  architecture.
- **Structured data coverage is deep.** Article, FAQPage, BreadcrumbList,
  TouristAttraction (trail guides), CollectionPage (sections), plus static
  WebSite/Organization/Person nodes. FAQ and trail facts live in
  `seo-data.json` and flow into rich results.
- **The mirror pipeline is disciplined.** `articles.json`, `sitemap.xml`,
  `feed.xml`, and `llms.txt` are generated from `data.js` + `seo-data.json`,
  with a staleness check. Single source of truth, no drift.
- **AI-search posture is ahead of the curve.** robots.txt explicitly allows
  every major AI crawler (OpenAI, Anthropic, Google-Extended, Perplexity,
  Meta, Apple), llms.txt exists, and the Worker has an IndexNow push endpoint.
  As answer engines eat informational queries, being citable matters; the
  plumbing for that is already here.
- **Responsive images exist.** ~250 AVIF/WebP renditions at four breakpoints,
  with the home LCP image preloaded.
- **The newsletter funnel is instrumented.** Eight placements (hero, dedicated
  page, mid-article, article end, home strip, guide gate, guide footer,
  exit-intent modal), each with GA4 impression and submit events keyed by
  location, and Buttondown tags per source. Most sites guess at which
  placement converts; this one can know.
- **Editorial voice is a moat.** Dry, specific, first-person-resident.
  It is differentiated from both NPS.gov and the content-farm tier, which is
  exactly the positioning "definitive source" requires.

## 2. What this audit pass changed

Shipped alongside this document, in the same branch:

1. **The map is now the visible lead magnet, not a hidden one.** `/map` was
   noindexed, orphaned (no internal links), and fully hidden behind an email
   wall. It is now indexable with real metadata and JSON-LD, present in the
   sitemap and llms.txt, linked from the footer and the newsletter units, and
   visible to every visitor. The email gate moved to the moment of highest
   intent: the first attempt to build a trip. Visitors can browse every pin
   free; saving a trip costs an email address. Existing subscribers (the
   `tfg.nl.subscribed` flag) pass through without being asked again.
2. **Map coverage grew from 17 pins to 32.** Wawona (0 → 5), Hetch Hetchy
   (0 → 3), Glacier Point road (1 → 4), Tuolumne (3 → 7). All new points are
   `verified: false` — see the backlog item on ground-truthing.
3. **The map now feeds the journal.** Pin popups render "From the journal"
   links for stops with related articles (the data field existed but was never
   rendered). Article pages already link to the map; the loop now closes both
   ways.
4. **Trips are shareable and routable.** "Copy link to this trip" produces a
   `/map?trip=...` URL that reconstructs the trip on another device (a small
   organic-distribution channel: one planner shares with the rest of the
   carload). "Open route in Google Maps" hands the trip to native navigation.
5. **The lead-magnet promise now matches the product.** Site copy promised a
   "free printable map planner"; what subscribers actually get is the
   interactive map. All newsletter copy now pitches the map and trip builder,
   and links to it.
6. **SEO gaps closed.** FAQ schema added for the two articles that lacked it
   (working-in-yosemite, water-ouzels-waterfalls), and `feed.xml` items now
   carry their hero image, so RSS readers and aggregators show art.
7. **Map analytics.** GA4 events for pin clicks, trip adds, quick picks,
   share, route export, and article clickthroughs, plus the standard
   impression/submit pair on the new gate modal. The map's view-to-signup rate
   is now measurable.

## 3. Newsletter funnel review (phase 1 engine)

What exists is good. What follows is the gap list, roughly in order of value.

- **The welcome email is now the product handoff.** Signup unlocks the map on
  that one device via localStorage. The Buttondown welcome email should carry
  the map link prominently ("your map: thetalusfieldjournal.com/map") so the
  unlock survives device changes and the subscriber has a reason to keep the
  email. Worth writing carefully; it is the highest-open-rate email that will
  ever be sent.
- **Publish the archive.** Buttondown hosts a public archive; linking it from
  /newsletter gives prospects proof of what they are signing up for and gives
  search engines a steadily growing page set for free.
- **Ask for the forward.** A single dry line in the footer of each issue
  ("Forwarded this? Sign up here. Know someone planning a trip? Forward it.")
  is the cheapest growth channel a small list has.
- **Watch the per-placement numbers.** The GA4 instrumentation already
  segments impressions and submits by location. After a month of map-gate
  data, compare map_gate conversion against article_end and exit_intent;
  expect the map gate to win on rate, and articles to win on volume. Move
  emphasis accordingly.
- **Tag-based onboarding.** Buttondown tags already record signup source
  (map-gate, exit-intent, guide-free, etc.). A map-gate subscriber wants trip
  help now; an article-end subscriber is reading for pleasure. Even two
  different welcome emails would beat one.

## 4. The map (current state and remaining work)

Post-change architecture: free, indexable, Google Maps JS with category-styled
pins from `points.geojson`, region-grouped sidebar, localStorage trip with a
30-stop cap, quick picks for 1/2/3 days, share links, route export, and a
signup gate on trip-building.

Remaining work, in priority order:

1. **Ground-truth the 15 new pins.** Every point added in this pass is
   `verified: false`: coordinates are from public map data, not from standing
   in the turnout. The map's value proposition is accuracy. Walk them (or
   verify against your own GPS tracks) and flip the flags. The four
   pre-existing unverified pins need the same pass.
2. **Photos.** 30 of 32 pins have no `image` and fall back to Street View,
   which is absent or ugly at trailheads. Original photos are also a
   differentiator no competitor can scrape.
3. **A Wawona quick pick.** Wawona is a detour from the three main corridors,
   so it stays out of the 1/2/3-day presets, but a "Wawona half-day" pick
   would give the new region a front door.
4. **Per-pin practical notes.** The blurbs are good; the next field worth
   adding is the practical line ("lot fills by 9am", "vault toilet",
   "trailers will not fit") — that is the texture the paid guide trades on,
   and a taste of it on the free map sells the upgrade.
5. **Consider an ItemList JSON-LD** of pins once content is verified — held
   off for now so the structured data never asserts unverified facts.

## 5. SEO and content (remaining opportunities)

- **In-body internal links.** Related-article links exist at article end, but
  contextual links inside bodies are sparse. A pass that adds two or three
  natural cross-links per article (Half Dome ↔ Clouds Rest, gateway towns ↔
  cost article) is slow editorial work with durable ranking payoff.
- **Publish cadence beats everything.** 35 articles is a solid base; the
  "definitive source" position is won by coverage breadth. The biggest
  uncovered head terms worth owning: lodging inside the park (by property),
  February firefall logistics, winter driving/chains, Tioga Pass status page
  (a living page that earns seasonal links every single year), swimming holes,
  picnic logistics. Living/updated pages ("Is Tioga open?", "Reservation
  status today") earn recurring traffic that static articles cannot.
- **Image weight.** Several originals in `img/` run 4–8 MB. The responsive
  pipeline mitigates it for pages that use it, but the originals are served to
  anyone who hits them directly; re-export the worst offenders.
- **Webcams and conditions are sticky.** The homepage webcam strip and NWS
  links are return-visit drivers. A dedicated /conditions page (webcams,
  weather links, road status links, last-updated stamp) would concentrate that
  recurring traffic onto an indexable URL.
- **Search Console housekeeping.** After deploy: submit the updated sitemap,
  request indexing for /map, and run `scripts/indexnow-ping.sh` for the new
  URL set.

## 6. The Field Guide PWA (phase 2 audit)

No code changes were made in `apps/guide/` this pass; it is undeployed by
design. State of the product as built:

**Works today:** region picker → stop list → stop detail flow; three-tab map
(GPS pins, itineraries, offline instructions); platform-aware directions
links; offline app shell + per-region photo precache; install prompts for
Android and iOS; update banner; dev-login auth with rate limiting and
constant-time comparison; magic-link exchange and Stripe webhook provisioning
wired and dormant.

**Must fix before charging money:**

1. **Coordinates.** 13 of 23 stops carry `// TODO: verify`. One is urgent:
   Cathedral Lakes — the body text says the trailhead moved to the visitor
   center but the coordinate is the historical trailhead. A paid product that
   navigates someone to the wrong trailhead generates refunds and one-star
   word of mouth.
2. **Photos.** 9 photos cover 23 stops with heavy reuse (one Half Dome shot
   serves four different stops). Several stops render a placeholder.
3. **Marketing/product mismatch.** The editorial /guide page sells
   trip-planning day maps, an in-app seasonal packing checklist, and a
   contingency tree ("road closed, lot full, smoke, weather"). None of these
   exist in the app. Either build them before launch or rewrite the pitch;
   selling features that are not there is the one thing the editorial voice
   cannot survive.
4. **Auth.** Today only env-var dev credentials work; there is no signup
   path. The Stripe checkout → webhook → buyer record → emailed code path
   exists but is unreachable from the UI (intentionally). Smaller fixes for
   launch: the login page ignores the `from` redirect state, JWT expiry
   silently dumps users at the login screen with no message, and there is no
   error boundary or loading state on lazy routes.
5. **Pricing leverage.** The free map now demonstrates the product. The paid
   tier's differentiators should be the things the free map deliberately
   lacks: offline use, turnout-level verified coordinates, per-stop tactical
   writeups, hour-by-hour plans. Keep the free map good but shallow.

## 7. Monetization roadmap

**Phase 1 (now): audience.** Everything above serves this. The only numbers
that matter for the next two quarters are unique readers, subscriber count,
and per-placement conversion. Advertisers and listees buy audience.

**Phase 1.5: directory and newsletter sponsorship.** The inventory already
exists: `/places` (one listing, five open categories) and `/advertise`
(Standard and Featured tiers, "inquire for current rate").

- Set actual prices. Picking a number beats "inquire": small operators do not
  email to ask. Annual flat pricing fits the curation posture (e.g. mid-three
  figures Standard, roughly double for Featured — calibrate to traffic when
  the numbers exist). Keep "most inquiries are declined"; scarcity is the
  product.
- Seed the directory before selling it. A directory with one entry sells
  nothing. List 3–5 businesses you genuinely endorse, free, labeled
  honestly, then approach the categories adjacent to them ("your competitor
  category is filling").
- Outreach order: vacation rentals and small lodging in gateway towns have
  the highest customer value and the least Google visibility — start there.
  The gateway-towns article ranks for exactly the query their customers ask.
- Newsletter sponsorship is the second product: one clearly-labeled sponsor
  slot per issue once the list justifies it. The dry voice makes a labeled,
  editor-vetted sponsor note credible rather than corrosive.
- The kit page's affiliate scaffolding (`aff: "#"`, currently unrendered) is
  the third product; enable it when an affiliate program worth joining is
  chosen. Low effort, low ceiling, fine.

**Phase 2 (next year): the paid Field Guide.** Gate: do not launch until
section 6 items 1–3 are done and the editorial site clears a traffic bar you
set in advance. The free map's GA4 events (trip adds, route exports) identify
the exact users to market the paid guide to, and the newsletter is the
channel. The Stripe + inventory-cap + access-code machinery is already built
and tested-in-code; launch is a content-and-verification problem, not an
engineering one.

## 8. Prioritized backlog

| # | Item | Effort | Impact | Notes |
|---|------|--------|--------|-------|
| 1 | Write/upgrade the Buttondown welcome email (map link front and center) | S | High | Highest-open email that exists |
| 2 | Ground-truth the 19 unverified map pins | M | High | The product is accuracy |
| 3 | Set directory prices + seed 3–5 honest free listings | S | High | Unblocks phase 1.5 revenue |
| 4 | Publish Buttondown archive + forward ask in issue footer | S | Med | Free growth loops |
| 5 | Living /conditions page (webcams, weather, road status) | M | High | Recurring seasonal traffic |
| 6 | In-body internal linking pass across 35 articles | M | Med | Durable SEO |
| 7 | Per-pin practical notes on the map | M | Med | Sells the paid tier |
| 8 | Re-export oversized originals in img/ | S | Low | Core Web Vitals |
| 9 | Wawona quick pick on the map | S | Low | Front door for new region |
| 10 | PWA: fix Cathedral Lakes TH, verify 13 coords, photo pass | L | High (phase 2 gate) | Before any launch |
| 11 | PWA: build or un-promise checklist/contingency/day-map features | L | High (phase 2 gate) | Pitch must match product |
| 12 | Newsletter sponsor slot product page | S | Med | When list size justifies |
