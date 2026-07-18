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
| `BODY_VERSIONS`, `loadArticleBody`, `ARTICLE_BODIES` | data.js | Lazy article-body system: per-slug cache busters, the on-demand loader, and the registry each body file writes itself into. |
| `NATURE_NOTES` | videos-data.js | Film archive data for /films. |
| `Header`, `Footer`, `ArticleCard`, `NewsletterInline`, `ExitIntentNewsletter`, `Placeholder`, `ResponsiveImage`, `MapLightbox`, `MotifMountains`, `MotifSun`, `MotifTrees` | components.jsx | Shared components (implicit globals). |
| `preloadResponsive`, `SIZES_HERO`, `SIZES_BODY`, `SIZES_CARD` | components.jsx | LCP image preloading and the shared `sizes` strings for ResponsiveImage. |
| `trackNewsletterSubmit`, `trackNewsletterImpression`, `useNewsletterImpression`, `isSubscribed` | components.jsx | Newsletter funnel helpers. All delegate to `window.track`; submit also sets the subscribed flag. |
| `readHistory` | components.jsx | Read-history store over safeStorage: `last`/`setLast`/`clearLast` (the unfinished article behind the home resume band) and `done`/`markDone` (finished slugs, used to rank the article related rail unread-first). |
| `TweaksPanel`, `useTweaks`, `TweakSection`, `TweakRadio`, plus the other `Tweak*` controls | tweaks-panel.jsx | The site-wide tweaks drawer (implicit globals). |
| `TWEAK_DEFAULTS` | index.html | Default palette and density consumed by `useTweaks` in app.jsx. |
| `HomePage`, `ArticlesIndex`, `CategoryPage`, `ArticlePage`, `AboutPage`, `KitPage`, `PlacesPage`, `FilmsPage`, `MapPage`, `GuidePage`, `PlanningGuide`, `ChecklistPage`, `NewsletterPage`, `ContactPage`, `AdvertisePage`, `PrivacyPage`, `TermsPage`, `AffiliatePage` | the matching page-*.jsx (page-articles.jsx, page-legal.jsx, and page-newsletter-contact.jsx each export more than one) | Page components, mounted by the route chain in app.jsx. |
| `routeToPath`, `SITE_ORIGIN` | app.jsx | Route-to-URL helper for real href attributes, and the canonical origin. |

Adding a page means: create the page file, add its `<script>` tag to index.html, add it to the route chain and `REQUIRED_GLOBALS` in app.jsx, and mirror its SEO in functions/_middleware.js.

## GA4 event inventory

All events fire through `window.track`. Names and where they fire:

| Event | Fires from |
|---|---|
| `newsletter_signup`, `newsletter_impression` | components.jsx helpers, called by every newsletter unit with a `location` param |
| `newsletter_exit_intent_shown` | components.jsx (ExitIntentNewsletter) |
| `guide_cta_click` | components.jsx (Footer "Field Guide" link, masthead nav), page-home.jsx (Go Deeper band, `location: home_band`) |
| `guide_buy_click` | page-guide.jsx (`location`: `guide_aside` buy box or `guide_closer` end-of-pitch button) |
| `guide_sample_click` | page-guide.jsx (links to the PWA's free sample at `/preview`, with `location`: `guide_aside` or `guide_closer`) |
| `film_play` | page-films.jsx |
| `affiliate_click` | app.jsx (delegated document listener on `a[data-aff-network]`) |
| `outbound_click` | app.jsx (same delegated listener; external-host `target="_blank"` anchors without `data-aff-network`) |
| `page_view` | app.jsx (SPA route changes after the first render; the initial pageview comes from the gtag config in index.html) |
| `contact_submit` | page-newsletter-contact.jsx (successful contact-form send, with `subject`) |
| `kit_item_toggle` | page-kit.jsx (checklist tick/untick, with `item_id` and `checked`) |
| `article_progress` | page-article.jsx (reading depth against the body at the 25/50/75/100 marks, once per view) |
| `related_click` | page-article.jsx (related-rail card clicks, with `from` = the referring slug) |
| `resume_shown`, `resume_click` | page-home.jsx (the "Where you left off" band) |
| `trip_add`, `trip_add_all`, `trip_quick_pick`, `trip_undo`, `trip_share`, `trip_share_open`, `trip_route_open`, `map_pin_click`, `map_article_click`, `map_filter_category`, `map_search`, `map_cluster_click`, `map_directions_click` | page-map.jsx |
| `trip_email_send` | page-map.jsx (TripEmailBox, "email this trip to yourself", with `trip_size`) |
| `stop_share` | page-map.jsx (InfoWindow "Copy link to this stop") |
| `guide_teaser_click` | page-map.jsx (trip next-steps card), page-article.jsx (article-end line, trails/planning) — with `location` |
| `itinerary_open_map` | page-itineraries.jsx ("Open this trip on the map", with `itinerary`) |
| `home_utility_click` | page-home.jsx ("Plan your trip" row, with `target`) |
| `article_share` | components.jsx (ShareRow on article pages; `method` = web-share or copy) |
| `series_band_click` | page-article.jsx (Planning Guide series band; `from`/`to` slugs, `to: planning-hub` for the hub link) |
| `toc_jump` | page-article.jsx (in-guide table-of-contents jumps) |
| `cta_click` | components.jsx (masthead links: `location: masthead_cta` for The Map, `masthead_now` for This week); page-home.jsx (`home_dispatch` for the dispatch teaser, `home_path` with `target` for the Go Deeper row, `home_strip_now` for the About-strip line) |

## localStorage key inventory

All access goes through `window.safeStorage`.

| Key | Written by | Meaning |
|---|---|---|
| `tfg.trip` | page-map.jsx | Saved trip stop ids (versioned envelope). |
| `tfg.kit.checked` | page-kit.jsx | Ticked packing-list items (versioned envelope). |
| `tfg.nl.subscribed` | components.jsx | Optimistic subscribed flag, set on any newsletter submit. |
| `tfg.nl.exit.seen` | components.jsx | Exit-intent cooldown timestamp (14 days). |
| `tfg.map.unlocked` | page-map.jsx | Trip-builder gate. Fails OPEN: when storage is unavailable the gate reads as unlocked. |
| `tfg.read.last` | page-article.jsx (via `readHistory`) | Most recent article left 10–90% read: `{ slug, pct, at }`. Feeds the home resume band; cleared when the piece is finished. |
| `tfg.read.done` | page-article.jsx (via `readHistory`) | Slugs read past ~90%, capped at 100. Deprioritizes finished pieces in the related rail. |
| `tfg.read.resume` | page-home.jsx | One-shot handoff flag set by a resume-band click; the article page consumes it and jumps back to the saved depth. |
