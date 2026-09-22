# Design rollout: the homepage system, site-wide (September 2026)

The September 2026 homepage (PR #410, #412) introduced the `.hp-design` system,
and PR #413 extended it to `/planning`, `/conditions` and `/guide`. This pass
takes it to every other page on thetalusfieldjournal.com. The Field Guide PWA is
out of scope.

The homepage is the source of truth. It is not redesigned here, and it is
pixel-diffed against `main` at 1440, 1024 and 390 after every step.

## How the site is built (what "template" means here)

There is no template engine. Every route is a React component in a
`page-*.jsx` file, and the content model is the catalog in `data.js` plus the
article bodies in `bodies/*.jsx` (JSX, not markdown). The one exception is
`/archive/`, which `scripts/gen-archive.mjs` generates as static HTML from the
markdown in `nature-notes/`. A "template" in this checklist is therefore a
shared component or a shared set of legacy primitives (`.page-head`, `.wrap`,
`.prose`, `.section-head`, `ArticleCard`, `NewsletterInline`, `GuidePromo`)
that a group of pages is built from.

## Inventory

Status: `[x]` converted, `[ ]` not yet.

### 0. Shell, on every route (app.jsx + components.jsx)
- [x] Masthead: `HomeMasthead` on every route; the legacy masthead, hamburger, scroll-hide and `BottomNav` are retired
- [x] Base layout: `<main>` is the `.hp-design` root, so every page inherits the tokens and type
- [x] Palette: the design palette is the site palette; the Granite / High Sierra / Golden Hour swaps, the density swap and the dark-mode blocks are retired
- [x] Footer
- [x] Onward links (`KeepGoing`)
- [ ] Back-to-top, nav-progress bar, exit-intent modal, lightbox

### 1. Article template (`page-article.jsx`, 72 pages at `/articles/<slug>`)
- [x] Article head (crumbs, section eyebrow, h1, dek, byline, hero plate)
- [x] Reading typography: measure, line height, h2/h3, lists, images and captions, blockquotes, tables, callouts, code
- [x] In-body components: `LodgingCta`, `AvailabilityLink`, `AffiliateNote`, town facts, gateway map, decision aid, TOC, series band
- [x] Related rail, share row, end-of-article guide CTA, sticky guide bar, newsletter
- [x] Prerendered fragments (`gen-prerender.mjs`): markup unchanged, painted in the new type before boot

### 2. Listing and index templates
- [x] `/articles` (ArticlesIndex)
- [x] `/section/<slug>` x4: planning, trails, wildlife, seasonal (CategoryPage)
- [x] `/search`
- [x] `/explore`
- [x] `/start-here`
- [x] `/films`
- [x] `/itineraries`
- [x] `/webcams`
- [x] `/places` (Directory)

### 3. Static content template (page head + prose)
- [x] `/about`
- [x] `/privacy`, `/terms`, `/affiliate` (page-legal.jsx)
- [x] `/newsletter`, `/contact` (page-newsletter-contact.jsx)
- [x] `/consult`
- [x] `/widget`
- [x] `/partners`
- [x] `/advertise`

### 4. Tools and reference pages
- [x] `/dates`
- [x] `/international`
- [x] `/distances`
- [x] `/firefall`
- [x] `/tioga-opening`
- [x] `/half-dome-lottery`
- [x] `/kit`
- [x] `/checklist`
- [x] `/now` (The Park Bulletin)
- [x] `/stay`
- [x] `/map`

### 5. Utility
- [ ] 404 (`NotFoundPage`, also every unknown `/articles/` or `/section/` slug)
- [ ] Route failed to load
- [ ] Newsletter signup confirmation (inline success state; there is no separate thank-you route)

### 6. Generated static pages (`scripts/gen-archive.mjs` + `archive/archive.css`)
- [ ] `/archive/` landing
- [ ] `/archive/<year>/` indexes
- [ ] `/archive/<year>/vol-<v>-no-<n>/` issue pages (512)

### Already converted before this pass (must stay visually unchanged)
- [x] `/` (source of truth)
- [x] `/planning`, `/conditions`, `/guide` (PR #413)
