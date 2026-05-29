# SEO runbook

Operational notes for keeping thetalusfieldjournal.com indexed and discoverable.
Most of this is manual work in Google Search Console (GSC); the code side is
small and documented at the bottom.

## The actual bottleneck: getting pages crawled and indexed

A new site with low authority gets a small crawl budget. Google reports many
URLs as "Discovered, currently not indexed" (never crawled). Code cannot force
indexing. The levers that work:

1. **Request indexing manually.** GSC, URL Inspection, paste the URL, "Request
   Indexing." Prioritize the articles tied to live impressions:
   - `/articles/where-to-eat-yosemite` (dining/restaurants queries)
   - `/articles/tioga-road-opening-weekend-2026` (Tioga Pass opening queries)
   - `/articles/mist-trail-the-real-guide`
   - `/articles/half-dome-permit-lottery-2026`
   - `/articles/four-mile-up-panorama-down`
   - plus the hubs: `/`, `/planning`, `/articles`
2. **Earn backlinks.** r/Yosemite, r/nationalparks, hiking forums, blogger
   outreach, and sharing each new article. Backlinks drive both discovery and
   ranking for a young domain.
3. **Time + internal linking.** Internal linking is already in place (see
   "Already handled" below); keep it intact as articles are added.

## Sitemap and the feed.xml "Incorrect namespace" trap

`sitemap.xml` is correct: its root is
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ...>` plus a valid
`xmlns:image` declaration. It lists every page (43 URLs, matching GSC's
discovered count). Do not "fix" the namespace; it is already right.

If GSC shows an "Incorrect namespace" error under Sitemaps:

1. Check **which** submitted file is flagged. The likely culprit is `feed.xml`,
   which is an RSS 2.0 feed (root `<rss version="2.0">`), not a sitemap. If it
   was submitted in the Sitemaps report, GSC validates it as a sitemap and the
   RSS root namespace fails that check.
2. Fix: remove `feed.xml` from the Sitemaps report (keep it as the site's RSS
   feed; it is fine for that purpose), and re-submit `sitemap.xml` to clear any
   stale validation.

## Publishing checklist (keep the hand-maintained lists in sync)

There is no build step and no sitemap generator. When you add or edit an
article, update **all** of these by hand or they drift apart:

- `articles.json` (consumed by the Cloudflare Pages middleware for per-route SEO)
- `data.js` (`window.ARTICLES` and the `window.BODY_VERSIONS` map)
- `sitemap.xml` (add the `<url>` entry, with an `<image:image>` if there is a hero)
- `feed.xml` (add the `<item>`)
- the `<noscript>` article list in `index.html` (easy to forget; it is what
  non-JS crawlers read for internal links)

Then bump the shared `?v=N` cache-buster on the edited files in `index.html` and
run `bash scripts/check-cache-busters.sh` before committing.

## Already handled (do not regress these)

- **Per-route head metadata.** `functions/_middleware.js` rewrites title, meta
  description, canonical, Open Graph, Twitter, and JSON-LD per route on the edge,
  so non-JS crawlers get correct metadata from the first byte.
- **Internal linking.** The `<noscript>` block in `index.html` links every
  article; each article page ends with related links; global nav and footer link
  the hubs; every article is within two clicks of the homepage via `/articles`.
- **Single H1 per page.** A screen-reader-only static `<h1>` lives in
  `index.html` for non-JS HTML parsers (Bing's auditor). `app.jsx` removes it on
  boot so JS-rendering crawlers and users see exactly one `<h1>` (the per-route
  title). Keep both halves; removing only one reintroduces a duplicate H1 or
  drops the no-JS fallback.
- **Structured data.** Article, BreadcrumbList, WebSite, and Organization schema
  are emitted; breadcrumbs validate clean.
