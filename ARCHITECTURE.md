# Editorial site architecture reference

The editorial site has no build step: index.html loads every script directly and Babel transforms the JSX in the browser. Files communicate through globals, either explicit `window.*` assignments or top-level declarations that the Babel env preset downlevels to global `var` (see the comment above the script tags in index.html). This file inventories that surface so a change in one file does not silently break a sibling.

## Script load order (index.html)

Plain JS loads first, then the Babel-transformed JSX, with app.jsx always last because it consumes everything:

1. `storage.js` (plain JS): `window.safeStorage`
2. `data.js` (plain JS): article catalog and helpers
3. `videos-data.js` (plain JS): `window.NATURE_NOTES`
4. `tweaks-panel.jsx`
5. `components.jsx`
6. `page-*.jsx` (one per page)
7. `app.jsx`: routing, SEO, boot. Checks `REQUIRED_GLOBALS` before mounting and names any missing page global in the console (red banner on localhost).

Inline in `<head>`: `window.gtag`/`dataLayer` (GA4 bootstrap), `window.track` (guarded event sender), `window.TWEAK_DEFAULTS`.

## window.* inventory

| Global | Defined in | What it is |
|---|---|---|
| `track(name, params)` | index.html | The single GA4 event sender. Guarded: no-op when gtag is blocked or not ready. Every conversion event on the site goes through it. |
| `safeStorage` | storage.js | Safe localStorage wrapper: `get(key, fallback)`, `set`, `remove`, `getJSON`, `setJSON`. The only file that touches localStorage directly. `get` returns `fallback` only when storage throws, never when a key is merely absent. |
| `SITE`, `ARTICLES`, `CATEGORIES`, `START_HERE`, `KIT` | data.js | Masthead info, article catalog (source of truth for SEO mirrors), categories, featured slugs, packing checklists. |
| `byCategory`, `findArticle`, `findCategory` | data.js | Catalog lookups. |
| `RELATED`, `RELATED_COUNT`, `relatedFor(slug)` | data.js | Curated onward links per article, and the resolver behind them. `relatedFor` returns the curated list when one exists and otherwise a deterministic rotation through the article's own section, starting at the article's own position so links spread across the catalog rather than funnelling onto its first few entries. Three surfaces read it and must agree: the related rail in page-article.jsx, the crawler-visible block edge/seo.js appends to injected prose, and the `related` field in articles.json (the generator calls this same function through the catalog harvest). `gen-seo-artifacts.mjs` validates the table and `scripts/check-edge-redirects.mjs` asserts every rendered block resolves. |
| `BODY_VERSIONS`, `loadArticleBody`, `ARTICLE_BODIES` | data.js | Lazy article-body system: per-slug cache busters, the on-demand loader, and the registry each body file writes itself into. |
| `NATURE_NOTES` | videos-data.js | Film archive data for /films. |
| `INTENT_FACETS`, `ARTICLE_INTENT`, `ARTICLE_MONTHS`, `INTENT_NO_TAGS` | intent-data.js | The reader-intent taxonomy (stage / traveler / topic), the per-article tags behind the filters on `/planning` and `/articles`, the month windows for the handful of seasonal pieces, and the declared list of articles that carry no tag in any facet on purpose (with the reason). Hand-maintained against `ARTICLES`; `scripts/check-intent-tags.mjs` fails the build on drift. |
| `intentFor`, `matchesIntent`, `filterArticlesByIntent`, `intentCounts`, `intentSelectionCount`, `intentSummary`, `relaxIntent`, `articleFitsMonth`, `intentMonthOf`, `intentMonthLabel` | intent-data.js | Filter logic. Selections are OR within a facet and AND across facets; a selection may also carry a `month`, ANDed on top of all three and applied in every pool `intentCounts` measures, so a chip never promises an out-of-season entry. `intentCounts` scopes each option's count to the other facets so a chip dims honestly; `relaxIntent(intent, monthKey)` loosens a selection until it returns a usefully sized set, measured against the in-season archive and never relaxing the month. The month reaches the filter bar from the trip selector via `plan.intent`, is mirrored to `?month=`, and renders as its own removable row (not a facet — there are no month chips). |
| `TRIP_MONTHS`, `TRIP_QUESTIONS`, `tripMonth`, `buildTripPlan`, `tripSummary`, `tripAnswersComplete`, `itineraryForTrip` | intent-data.js | The five-question trip selector's data and its deterministic plan builder (reads, itinerary capped to what the month's roads allow, and which paid product the answers actually call for). |
| `TripSelector`, `IntentFilters`, `useIntentFilters` | intent.jsx | The React for the above. Loaded with intent-data.js on the `planning` and `articles` routes only (`PAGE_MODULES`), never in the eager shell. |
| `Header`, `Footer`, `KeepGoing`, `ArticleCard`, `NewsletterInline`, `ExitIntentNewsletter`, `Placeholder`, `ResponsiveImage`, `MapLightbox`, `MotifMountains`, `MotifSun`, `MotifTrees` | components.jsx | Shared components (implicit globals). |
| `NAV_GROUPS`, `navGroupLinks` | components.jsx | The site's navigation table — the grouped list of every reader-facing route, shared by the masthead dropdowns, the mobile menu, and (as a reference) the site index at `/explore`. Nothing in it may be date-derived or catalog-computed: the masthead is baked into index.html's static home shell. |
| `KEEP_GOING` | components.jsx | Curated onward links keyed by route, rendered by `KeepGoing` (mounted once in app.jsx, under any route present in the table). A route that is absent renders nothing. |
| `preloadResponsive`, `SIZES_HERO`, `SIZES_BODY`, `SIZES_CARD` | components.jsx | LCP image preloading and the shared `sizes` strings for ResponsiveImage. |
| `trackNewsletterSubmit`, `trackNewsletterImpression`, `useNewsletterImpression`, `isSubscribed` | components.jsx | Newsletter funnel helpers. All delegate to `window.track`; submit also sets the subscribed flag. |
| `readHistory` | components.jsx | Read-history store over safeStorage: `last`/`setLast`/`clearLast` (the unfinished article behind the home resume band) and `done`/`markDone` (finished slugs, used to rank the article related rail unread-first). |
| `TweaksPanel`, `useTweaks`, `TweakSection`, `TweakRadio`, plus the other `Tweak*` controls | tweaks-panel.jsx | The site-wide tweaks drawer (implicit globals). |
| `TWEAK_DEFAULTS` | index.html | Default palette and density consumed by `useTweaks` in app.jsx. |
| `HomePage`, `ArticlesIndex`, `CategoryPage`, `ArticlePage`, `AboutPage`, `KitPage`, `PlacesPage`, `FilmsPage`, `MapPage`, `GuidePage`, `PlanningGuide`, `ChecklistPage`, `NewsletterPage`, `ContactPage`, `AdvertisePage`, `PrivacyPage`, `TermsPage`, `AffiliatePage`, `ItinerariesPage`, `ConditionsPage`, `BulletinPage`, `FirefallPage`, `ConsultPage`, `WidgetPage`, `PartnersPage`, `SearchPage`, `ExplorePage`, `DistancesPage`, `WebcamsPage` | the matching page-*.jsx (page-articles.jsx, page-legal.jsx, and page-newsletter-contact.jsx each export more than one) | Page components, mounted by the route chain in app.jsx. |
| `routeToPath`, `SITE_ORIGIN` | app.jsx | Route-to-URL helper for real href attributes, and the canonical origin. |

Adding a page means: create the page file; register it in `PAGE_MODULES` and `STATIC_ROUTE_KEYS` and the route chain in app.jsx (NOT a `<script>` tag in index.html — page bundles lazy-load, and `REQUIRED_GLOBALS` is the eager shell only); add it to the compile list in `scripts/gen-compiled.mjs`, `STATIC_ROUTES` in `scripts/lib/catalog.mjs`, and the sitemap table in `scripts/gen-seo-artifacts.mjs`; mirror its `<head>` in both `edge/seo.js` (`known`, plus an optional `HUB_PROSE` thunk) and the client-side `known` table in app.jsx's `buildSeo` (a route missing from the latter silently falls back to homepage meta on SPA navigation); and list it in `SEARCH_PAGES` in page-search.jsx and on `/explore`.

Four more touchpoints that are easy to miss and that nothing fails the build over: give it a `KEEP_GOING` entry in components.jsx (a route absent from that table renders no onward-links rail at all), put it in exactly one of `NAV_GROUPS` or `NAV_SECONDARY`, add it to the `Footer` column lists (hand-maintained, not derived from the nav tables), and hand-add it to the `## Reference pages` section of `llms.txt`, which `gen-seo-artifacts.mjs` does not regenerate. If the route lands in `NAV_GROUPS`, run `npm --prefix scripts run home-shell` as well, since the masthead is baked into index.html. Finish with the shared `?v=` bump and `npm --prefix scripts run assets:stamp`.

## GA4 event inventory

All events fire through `window.track`. Names and where they fire:

| Event | Fires from |
|---|---|
| `newsletter_signup`, `newsletter_impression` | components.jsx helpers, called by every newsletter unit with a `location` param |
| `newsletter_exit_intent_shown` | components.jsx (ExitIntentNewsletter) |
| `guide_cta_click` | components.jsx (Footer "Field Guide" link, masthead nav), page-home.jsx (the rail's Field Guide plate, `location: home_rail`). Retired locations (annotate in GA4, do not reuse): `home_hero`, `home_band` (August 2026 homepage redesign, which made the guide one ask instead of two) |
| `guide_buy_click` | page-guide.jsx (`location`: `guide_aside` buy box, `guide_hero` hero button, `guide_compare` under the comparison table, `guide_closer` end-of-pitch button, or `guide_mobile_bar` sticky phone bar) |
| `guide_purchase` | page-guide.jsx, on the `?guide=success` / `?guide=gift-success` Stripe return. Carries the same `location` values as `guide_buy_click` (stashed in `tfg.guide.buyLocation` at click time, consumed once) plus `gift`. Fires only when the stash exists, so a refreshed or bookmarked success URL counts nothing. |
| `guide_sample_click` | page-guide.jsx (links to the PWA's free sample surfaces, with `location`: `guide_aside`, `guide_hero`, `guide_stop_example`, or `guide_closer`) |
| `widget_copy_snippet` | page-widget.jsx (copying the embed snippet) |
| `consult_book_click` | page-consult.jsx (`location`: `consult_pay`, `consult_schedule`, or `consult_mailto`, with `live`) |
| `partners_contact_click` | page-partners.jsx (group-code inquiries; `location`: `partners_tiers`, `partners_footer`, or `partners_contact_form`) |
| `film_play` | page-films.jsx |
| `affiliate_click` | app.jsx (delegated document listener on `a[data-aff-network]`). `aff_list` names the placement: `article_cta` (boxed LodgingCta in a body), `article_inline` (inline prose link in a body, any network), `article_town` (the per-town links in gateway-towns-compared), `article_picker` (the gateway-towns decision aid's recommendation link), `trip_selector` (the /planning plan output), `page_home` / `page_planning` / `page_itineraries` / `page_firefall` / `page_tioga` / `page_half_dome` / `page_distances` / `page_start_here` (standing-page CTAs), `stay_gateway` / `stay_property` (the named-stay rows under each corridor, per-property slug) / `stay_season` (the "when to stay where" blocks, per-season slug) / `stay_in_park_fallback` / `stay_camping_fallback` / `stay_banner` (/stay), `map_sidebar`, the kit checklist's per-list slugs (page-kit.jsx), and `page` (the AvailabilityLink default). The legacy value `article` (all in-body placements, undifferentiated) ended 2026-08-01; a dashboard split by `aff_list` sees the old value stop and the three `article_*` values begin that day. |
| `outbound_click` | app.jsx (same delegated listener; external-host `target="_blank"` anchors without `data-aff-network`) |
| `page_view` | app.jsx (SPA route changes after the first render; the initial pageview comes from the gtag config in index.html) |
| `contact_submit` | page-newsletter-contact.jsx (successful contact-form send, with `subject`) |
| `kit_item_toggle` | page-kit.jsx (checklist tick/untick, with `item_id` and `checked`) |
| `article_progress` | page-article.jsx (reading depth against the body at the 25/50/75/100 marks, once per view) |
| `related_click` | page-article.jsx (related-rail card clicks, with `from` = the referring slug) |
| `resume_shown`, `resume_click` | page-home.jsx (the "Where you left off" band) |
| `trip_add`, `trip_add_all`, `trip_quick_pick`, `trip_undo`, `trip_share`, `trip_share_open`, `trip_route_open`, `map_pin_click`, `map_article_click`, `map_filter_category`, `map_search`, `map_cluster_click`, `map_directions_click`, `map_reset_view`, `map_locate` | page-map.jsx |
| `trip_email_send` | page-map.jsx (TripEmailBox, "email this trip to yourself", with `trip_size`) |
| `stop_share` | page-map.jsx (InfoWindow "Copy link to this stop") |
| `guide_teaser_click` | page-map.jsx (trip next-steps card), page-article.jsx (article-end line, trails/planning) — with `location` |
| `itinerary_open_map` | page-itineraries.jsx ("Open this trip on the map", with `itinerary`) |
| `trip_selector_answer`, `trip_selector_complete`, `trip_selector_apply_filters` | intent.jsx (the five-question trip selector at the top of `/planning`: one per answer with `question`/`answer`, one when the fifth lands, one when the plan's results are poured into the filters with `matches`) |
| `intent_filter` | intent.jsx (the intent chip bar on `/planning` and `/articles`; `facet`, `option`, and `action` = `on`/`off`/`clear`) |
| `trip_open_in_guide` | page-map.jsx (the map sidebar's hand-off to the Field Guide app; `trip_size`). The link opens `<app>/trip?import=<ids>`, which the PWA resolves against its own catalog. |
| `article_share` | components.jsx (ShareRow on article pages; `method` = web-share or copy) |
| `series_band_click` | page-article.jsx (Planning Guide series band; `from`/`to` slugs, `to: planning-hub` for the hub link) |
| `toc_jump` | page-article.jsx (in-guide table-of-contents jumps) |
| `nav_search_submit` | components.jsx (the search box at the top of the mobile menu; `location`, `has_query`) |
| `keep_going_click` | components.jsx (the site-wide onward-links block; `from` route and `target` route) |
| `index_click` | page-explore.jsx (destination clicks on the site index; `target`) |
| `cta_click` | components.jsx (masthead: `location: masthead_search` for search; `bottom_nav` with `target` for the mobile bottom tabs), Footer (`footer_index` for the site-index link); page-home.jsx (`home_hero` with `target` for the two hero buttons, `home_index` with `target` for the four index entries, `home_dispatch` for the Bulletin band, `home_start_here` for the Start Here block's link to /start-here). Retired locations (annotate in GA4, do not reuse): `masthead_cta`, `masthead_now` (nav simplification pass); `home_door`, `home_month`, `home_path`, `home_strip_now` (August 2026 homepage redesign, which retired the audience links, the month planner, the Go Deeper row and the About strip) |

## localStorage key inventory

All access goes through `window.safeStorage`.

| Key | Written by | Meaning |
|---|---|---|
| `tfg.trip` | page-map.jsx | Saved trip stop ids (versioned envelope). |
| `tfg.trip.selector` | intent.jsx | The five trip-selector answers as JSON. A `?when=&days=&stay=&party=&focus=` query string wins over it on mount, so a shared plan link always shows the sender's plan and not the reader's own. |
| `tfg.kit.checked` | page-kit.jsx | Ticked packing-list items (versioned envelope). |
| `tfg.nl.subscribed` | components.jsx | Optimistic subscribed flag, set on any newsletter submit. |
| `tfg.nl.exit.seen` | components.jsx | Exit-intent cooldown timestamp (14 days). |
| `tfg.map.unlocked` | page-map.jsx | Map gate (the whole `/map` page sits behind the newsletter signup; a shared `/map?trip=` link bypasses it for the visit without writing this flag). Fails OPEN: when storage is unavailable the gate reads as unlocked. |
| `tfg.guide.buyLocation` | page-guide.jsx | Which buy placement started the in-flight Stripe checkout (`{ location, gift }`). Written at `guide_buy_click`, consumed exactly once by the success return to fire `guide_purchase`, cleared on cancel. |
| `tfg.read.last` | page-article.jsx (via `readHistory`) | Most recent article left 10–90% read: `{ slug, pct, at }`. Feeds the home resume band; cleared when the piece is finished. |
| `tfg.read.done` | page-article.jsx (via `readHistory`) | Slugs read past ~90%, capped at 100. Deprioritizes finished pieces in the related rail. |
| `tfg.read.resume` | page-home.jsx | One-shot handoff flag set by a resume-band click; the article page consumes it and jumps back to the saved depth. |
