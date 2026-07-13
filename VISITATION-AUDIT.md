# The Talus Field — Visitation Audit

July 2026. Internal working document. Scope: **acquisition** — getting more visitors to the site. Companion to `CONVERSION-STRATEGY.md` (July 2026), which owns the reader→subscriber→buyer funnel; where that plan's items also drive traffic, this audit records their current implementation status rather than re-arguing them.

Method: repo-source audit (which is exactly what the git-connected Cloudflare build deploys from `main`), the nightly Lighthouse history in CI, and the offline system-checks battery (all 8 checks green on this pass). File-and-line evidence throughout. The online checks battery could not reach the live site from this sandbox (egress proxy refuses the CONNECT tunnel, so every URL "fails" with 403); those results are an artifact, not findings. DNS checks did run: SPF, DKIM, and DMARC all resolve.

---

## 1. Executive summary — the five highest-leverage moves for traffic

1. **Fix LCP. Still.** As of the 2026-07-12 nightly run: homepage LCP **11.9s**, article LCP **8.7s**, homepage performance score **0.41**. This was `CONVERSION-STRATEGY.md` R2 and it has not been started (React still ships from unpkg, all 16 page bundles load on every route, four font families). Core Web Vitals are a ranking input and an abandonment input; every other item on this list is multiplied by it.
2. **Fill the head-term content gaps.** The catalog (37 articles) has no article on the park's biggest search magnets: **Horsetail Fall "Firefall"**, a **waterfalls overview**, **winter in Yosemite**, **photography spots**, **in-park lodging**, wildflowers, climbing/El Capitan. These are the top-of-funnel queries the site is structurally built to win and simply hasn't entered.
3. **Give hub pages crawler-visible bodies.** Prerendered prose exists for all 37 articles but for **zero** hub pages: `/planning`, `/map`, `/itineraries`, `/conditions`, `/kit`, `/films`, `/section/*` serve non-JS crawlers only meta + JSON-LD over a homepage-generic H1. Bing and the AI answer engines (which the site's llms.txt strategy is explicitly courting) rank these pages on meta alone.
4. **Ship the weekly "This Week in the Park" dispatch** (R5, still unbuilt; `/conditions` is a live-widget link-out page, not a dated weekly page). It is the only item on either plan that creates *recurring* visitation: freshness signal for Google, a bookmarkable return destination, and material the Sunday letter can point back to.
5. **Add a share loop to articles.** All sharing affordances live inside the map trip builder. The editorial article — the primary acquisition surface — has no share or copy-link affordance at all, and no `article_share` event to measure one.

---

## 2. What is already strong (verified; do not re-build)

- **Article-level technical SEO is genuinely excellent.** Every article: per-route title/description/canonical/OG/Twitter at the edge (`edge/seo.js`), prerendered body prose injected for non-JS crawlers (`edge/seo.js:517-676`, `/prerender/*.html`, correctly `X-Robots-Tag: noindex` in `_headers:60-61`), per-article og:image with dimensions and alt, Article + FAQPage + BreadcrumbList + TouristAttraction JSON-LD, image sitemap entries, `lastmod` on all 59 sitemap URLs.
- **The mirror pipeline and guards hold.** `articles.json` / `sitemap.xml` / `feed.xml` / `llms.txt` generated from `data.js` + `seo-data.json`, staleness-checked in CI nightly; this audit's offline run: 0 errors, 0 warnings across 8 checks.
- **AI-search posture is ahead of the curve.** robots.txt allow-lists every major AI crawler, llms.txt is current, IndexNow pushes on publish.
- **Most of CONVERSION-STRATEGY Pass 1–2 has shipped.** Verified in the current tree: R1 map gate moved to intent (gate fires only on add-to-trip actions, `page-map.jsx:518,572,675,713`; shared `/map?trip=` links render read-only ungated; the gate is dismissable), R3 contextual end-of-article offers with category-compound tags (`page-article.jsx:14-62,419`), R4 capture on `/kit` and `/films`, R6 credential byline + author box + "Updated" dates, R10 `/guide` public in waitlist mode (indexable, in sitemap, footer-linked), R12 A/B tests reduced to one live test.
- **Publishing velocity is real**: 37 articles since late April, five added this week (#185). The engine that would feed §3's content gaps exists.

Still open from that plan, traffic-relevant: **R2 (LCP)** and **R5 (weekly dispatch)** untouched; **R8** (Worker subscribe endpoint) not built; partials: no series band under bylines (R11a), no prev/next month links (R11c), no `sameAs` in the Person schema (R6d), hero dek does not lead with the credential (R7).

---

## 3. Findings

### F1 — Performance: LCP is the single biggest traffic leak (P0)

Evidence: `scripts/data/lighthouse-history.json`, 24 nightly runs. Latest (2026-07-12): home LCP 11,883ms / FCP 4,987ms / TBT 838ms / performance 0.41; article LCP 8,656ms / performance 0.65. The trend is flat-to-worsening across all 24 runs; nothing from the R2 recipe has landed:

- React UMD still loads from unpkg (`index.html:185-186`) — a third-party origin on the critical path.
- All 16 `page-*.js` bundles load eagerly on every route (`index.html:312-327`); the in-repo lazy-load pattern (`loadArticleBody`) proves the fix works here.
- Four Google Font families still load (`index.html:89`): EB Garamond, Source Serif 4, Inter, JetBrains Mono.

Why it is a *visitation* issue and not just a conversion issue: CWV feeds rankings on exactly the mobile search landers the site lives on, and an 8-12s paint bounces a share of every visitor other work acquires. **This should be the next engineering pass, before any new acquisition work.** Target from the strategy doc stands: article LCP <3.5s, home <4s, measured against the existing nightly trend.

### F2 — Content gaps: the catalog skips the park's biggest search magnets (P0, editorial)

The 37-article catalog skews planning (20 planning / 7 seasonal / 5 wildlife / 5 trails) and covers spring→fall. Verified absent, in rough order of search demand:

| Gap | Note |
|---|---|
| **Horsetail Fall / Firefall** | The largest seasonal Yosemite query spike of the year (February). Zero coverage. The PWA's seasonal almanac already models firefall windows (`apps/guide/src/content/seasonal.ts`) — the research is half done. Publish well before January so it has age when the spike hits. |
| **Yosemite waterfalls overview** | The park's top-of-funnel draw. Only tangential coverage (Mist Trail; the ouzel essay). One definitive "the waterfalls, and when they actually flow" piece can rank and feed the trails cluster. |
| **Winter in Yosemite** | Chains, Badger Pass, what closes, what a valley winter day looks like. The seasonal category currently ends at stargazing/smoke. Counter-seasonal content published now ranks by December. |
| **Photography / photo spots** | Tunnel View, Valley View, Glacier Point light. Heavily searched, and the natural home for share-worthy images. |
| **In-park lodging** | `where-to-eat-yosemite` has no lodging counterpart (Ahwahnee / Curry Village / the Lodge / Wawona / Housekeeping). High-intent, high-volume, and the gateway-towns piece already links context. |
| **Wildflowers / bloom timing** | Seasonal + wildlife crossover; May-June query spike. |
| **Climbing / El Capitan** | The park's global identity; even a non-climber's spectator guide ("watching climbers from El Cap Meadow") captures it honestly from the naturalist voice. |

These fit the existing machine (data.js + body + seo-data enrichment + FAQ + the same edge SEO), so each is a normal publish, not new infrastructure.

### F3 — Hub pages are meta-only for non-JS crawlers, under a generic H1 (P1)

- Prerender injection is articles-only (`edge/seo.js:127`; `scripts/gen-prerender.mjs` iterates `bodies/` only; `prerender/` contains exactly 37 files). `/planning`, `/map`, `/itineraries`, `/conditions`, `/kit`, `/films`, `/checklist`, `/places`, `/section/*` give Bing/Perplexity/GPTBot/ClaudeBot and social scrapers no route-specific body text — just meta, JSON-LD, and the homepage `<noscript>` block.
- The only static `<h1>` is homepage-generic on **every** route (`index.html:197-199`, removed by JS at boot, `app.jsx:814`). Non-JS crawlers see a topic-mismatched H1 on every hub, and **two** H1s on articles (the generic one plus the prerendered title, `edge/seo.js:671`).

Fix: extend the prerender pipeline to emit a short hub fragment per static route (the intro copy each hub already renders client-side is enough), and make `#seo-static-h1` route-aware (or strip it on article routes). These pages are the site's head-term landing pages ("Yosemite trip planner", "Yosemite itinerary", "Yosemite conditions"); right now they compete on meta alone in every non-Google index.

### F4 — Soft-404s: unknown URLs return 200 with homepage content (P1)

`seoForPath` returns `null` for unmatched paths and bad article slugs (`edge/seo.js:110,460`), the Worker falls through to the SPA shell, and the client falls back to home SEO (`app.jsx:492`). No 404 status, no noindex, no not-found state. Every typo'd or dead URL becomes an indexable thin duplicate of the homepage: crawl-budget waste and duplicate-content dampening exactly where link equity from old/misquoted URLs should consolidate. Fix: known-route allowlist in `edge/seo.js` → real 404 (or at minimum `noindex`) plus a client not-found view.

### F5 — robots.txt named-bot groups drop the Disallow rules (P2)

Robots.txt group-matching is most-specific-only. The explicit `Googlebot`/`Bingbot`/`YandexBot`/etc. groups contain only `Allow: /` (`robots.txt:26-51`) and therefore do **not** inherit `Disallow: /api/`, `/open`, `/login` from `User-agent: *` (`robots.txt:16-21`). The named engines can crawl exactly the junk routes (which are also F4 soft-404s). Fix: add the three Disallow lines to each named group, or delete the redundant named groups.

### F6 — IndexNow pings articles but not hubs (P2)

`.github/workflows/indexnow.yml` computes `/`, `/articles`, `/planning` + every article. `/map`, `/itineraries`, `/conditions`, `/films`, `/kit`, `/guide`, `/section/*` are never pushed, so Bing-family discovery of hub changes rides on sitemap recrawl only. One-line fix in the workflow's URL list (or generate it from `STATIC_ROUTES` in `scripts/lib/catalog.mjs` so it can't drift again).

### F7 — No share loop on articles; the only referral mechanics live in the map (P1)

Verified: no share button, no `navigator.share`, no copy-link, no share-intent links anywhere on article pages (`page-article.jsx`, `components.jsx`); no `article_share` event in the GA4 inventory. Meanwhile the map has a complete, instrumented share system (trip links, per-stop links, trip email; `page-map.jsx:716-732,1020-1041,1151-1250`). Articles are where the readership actually is. Fix: a quiet end-of-article share affordance in the house voice — `navigator.share` where available, copy-link fallback, `article_share` event — placed next to the author box. Low effort; it also feeds F2's shareable topics (photography, firefall).

### F8 — No recurring reason to visit: R5 is still the missing freshness engine (P1, editorial commitment)

`/conditions` shipped, but as a static link-out aggregator (live webcams, waits, forecast links; "everything here links out", `page-conditions.jsx:7-8`) — useful, but it is not *content*, carries no dates, and gives Google no freshness signal. The strategy doc's R5 (a dated weekly 150-300-word dispatch with an archive) remains the one plan item that manufactures **return visitation** and branded/direct traffic. The build is small; the honest blocker is the open cadence question (CONVERSION-STRATEGY §7.1), which needs an answer before building. If weekly is unsustainable, a biweekly/seasonal cadence with honest labeling still beats nothing.

### F9 — Authority loop: `sameAs` and off-site presence (P2)

- The Person schema still carries no `sameAs` (`index.html:156`, explicit comment) — R6d, gated on public profiles existing. Any public author profile (a Yosemite Conservancy bio page would be ideal; otherwise even one social or Substack-style profile) closes the E-E-A-T loop.
- There is **zero** off-site distribution surface: no social accounts referenced anywhere in the tree, no syndication automation, no Pinterest presence — notable because trip-planning is Pinterest's core query class and the site has strong image assets with responsive variants already generated. This is an operator decision, not a code change; if only one channel gets picked, Pinterest boards mapped to the four categories are the best effort-to-traffic fit for this content. RSS + IndexNow + llms.txt already cover the machine-readable channels well.

### F10 — Small technical polish (P3)

- **Visible breadcrumbs**: BreadcrumbList JSON-LD exists but no on-page breadcrumb; Google increasingly cross-checks the markup against visible navigation. One small component under the masthead on article/section pages adds internal links too.
- **Series band (R11a)**: the article→hub pathway is still missing; a one-line "Part of the Yosemite Planning Guide" band under bylines multiplies pages/session on the 13-article cluster and strengthens the hub Google should rank.
- **Topic hubs beyond the four sections**: no tag system; Half Dome (3 articles), camping, waterfalls-once-written have no dedicated hub URL. Replicate the `/planning` pattern for one or two clusters when the content exists — don't build taxonomy for taxonomy's sake.
- Sitemap homepage image points at the multi-MB source JPEG (`sitemap.xml:10`) instead of a responsive variant.
- `/guide` is commented out of the `<noscript>` nav (`index.html:224`) — an internal-linking orphan for non-JS crawlers while pre-launch.
- Stale comment: `app.jsx:537` still says "/map ships with noindex while hidden"; it doesn't (map is indexable and in the sitemap). Comment-only fix, but it misled this audit's first pass.

---

## 4. Sequenced roadmap

**Pass A — Engineering, this month.**
1. F1 LCP pass (own branch, verified against the nightly Lighthouse trend; the recipe is already specified as R2).
2. F4 soft-404s + F5 robots groups + F6 IndexNow list + F10 stale comment (one hygiene PR).

**Pass B — Editorial, rolling (start now; seasonal deadlines are real).**
3. F2 gap articles in demand order: waterfalls overview and photography (immediate summer demand), winter guide (publish by October), Firefall (publish by December), lodging, wildflowers, El Cap spectator.
4. F8 weekly dispatch — decide cadence first; ship only if sustainable.

**Pass C — Structure, after Pass A.**
5. F3 hub prerender + route-aware H1.
6. F7 article share affordance; F10 series band + visible breadcrumbs.
7. F9 `sameAs` when a public profile exists; pick one social channel or explicitly decide not to.

## 5. Measurement

- **Acquisition KPI:** organic sessions to article pages and to hub pages, split (GA4); Bing Webmaster + Search Console impressions for hub URLs before/after F3.
- **Performance:** the existing nightly Lighthouse trend (target: article <3.5s, home <4s LCP); CrUX field data once volume allows.
- **Content:** per-new-article impressions/clicks at 4 and 12 weeks; Firefall/winter pieces judged at their seasonal peak, not at publish.
- **Referral:** `article_share` (new), `trip_share_open` (exists), referral-medium sessions.
- **Return visitation:** GA4 returning-visitor share; direct/branded sessions to the dispatch page if F8 ships.
