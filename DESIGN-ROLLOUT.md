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
- [x] 404 (`NotFoundPage`, also every unknown `/articles/` or `/section/` slug)
- [x] Route failed to load
- [x] Newsletter signup confirmation (inline success state; there is no separate thank-you route)

### 6. Generated static pages (`scripts/gen-archive.mjs` + `archive/archive.css`)
- [x] `/archive/` landing
- [x] `/archive/<year>/` indexes
- [x] `/archive/<year>/vol-<v>-no-<n>/` issue pages (512)

### Already converted before this pass (must stay visually unchanged)
- [x] `/` (source of truth)
- [x] `/planning`, `/conditions`, `/guide` (PR #413)

## What was made shared

- **One base layout.** app.jsx renders `Header` (now a thin wrapper over
  `HomeMasthead`), then `<main class="hp-design">`, then `Footer`, on every route.
  The static home shell's `<main>` carries the same class.
- **One palette and one type system.** The design palette is the `:root`
  palette, under both the site token names and the `--hp-*` names. The Golden
  Hour, Granite and High Sierra swaps, the density swap, the Tweaks panel
  (`tweaks-panel.jsx`) and every dark-mode block are deleted.
- **Components.** `HpPageHead` gains `as` and `children`. `HpLetter` passes
  `variant` through. `HpPostcard` is extracted from `HpLetter` with identical
  markup. `HomeLink` routes `/section/<slug>`.
- **Primitives rewritten in place in the design's language.**
  - The reading column (`.hp-reading`) and the reading typography (`.prose`,
    which also covers the prerendered fragment).
  - Photo plates, `.btn`, `.eyebrow`, `.crumbs`, `.chip`, `.field`.
  - The letter box (`.nlbox`), the Field Guide card (`.band-guide`), the TOC,
    the stat block, the related rail, the pitch card, the newsletter modal.
- **Retired.** The legacy masthead, the hamburger with its query box, the
  phone scroll-hide, `BottomNav`, `NAV_SECONDARY`, `DESIGN_ROUTES`,
  `ArticleCard`, and 223 CSS rules nothing referenced any more. The stylesheet
  went from 9,963 lines to about 8,040.

## Content and front matter

No article bodies, catalog entries or front matter changed. Content is JSX
and a catalog here, not markdown. Every page kept its copy, links, GA4
locations, Buttondown tags and affiliate lists.

The only new words are labels in the design's eyebrow voice:

- Existing eyebrows set in tracked capitals.
- Letter eyebrows reading "SUNDAY FIELD NOTES / FREE".
- Counts moved into eyebrows ("5 FILMS").
- "RESULTS" and "THE JOURNAL" over search results and related reads.

## Deliberately left as is

- **Dark mode.** The design has no dark palette, so the whole site now
  renders light in dark mode, as the homepage already did. A dark scheme
  would be a new design pass.
- **The footer and KeepGoing markup.** They keep their pre-rollout markup
  and container, because the homepage's footer is part of the source of
  truth. They are restyled only by the palette.
- **The `/stay` booking colour** (`--stay-book`) and the one-colour-one-action
  rule. **`LodgingCta`** keeps the look PR #413 accepted on `/planning`.
- **`GuidePromo` on `/dates`.** Its reminder chips drive the letter's tag,
  so the card and the letter stay in the column.
- **The Park Bulletin's mono date labels and status colours.** They carry
  meaning (the ledger's dates, open/warn/closed) and were checked for
  contrast in the September redesign.
- **The PWA** (guide.thetalusfieldjournal.com), which is out of scope.

## Bugs found in the homepage design (not fixed: `/` must stay unchanged)

1. **The masthead wraps its labels between 761px and about 850px.** At tablet
   widths the brand, five links and the button share one row, so "Start
   here", "The journal", "Park conditions" and "Sunday Letter" each break onto
   two lines, and so does the button. The rollout now shows this on every
   route. A fix is to drop the nav to its own row below about 900px (the
   rule the 760px breakpoint already applies) or to set `white-space: nowrap`
   on the links and let the gap shrink.
2. **The footer still wears the retired palette.** Its top rule (`#11161c`)
   and wordmark (`#0c1014`) are the High Sierra ink, inherited from
   `<html>` before the rollout. They are pinned so `/` stays identical, and
   deleting the two pinned values in `styles.css` finishes the job.
3. **The footer and KeepGoing sit on the legacy container.** They use
   `.wrap` (1240px plus gutter), not `.hp-wrap` (1280px, 56px margins), so
   their left edge does not line up with the page above them at any width.
4. **KeepGoing uses the legacy serif base** (19px EB Garamond for the
   notes), restated so `/planning`, `/conditions` and `/guide` stay identical.
5. **Two known issues from PR #413 still stand.** There is no dark mode
   (above), and on `/conditions` at phone width the elevation chart's
   "4,000 FT" labels touch the axis labels.

## Verification

- `/`, `/planning`, `/conditions` and `/guide` are pixel-identical to `main`
  at 1440 and 1024. At 390 the only change is the page's last pixel row,
  where `<html>`'s background shows through (old paper before, site paper
  now).
- Every route was captured at 360, 390, 768, 1024 and 1440: no horizontal
  overflow and no console errors.
- Behaviour tested in headless Chromium:
  - masthead menus and links on interior pages, and `aria-current`
  - search results and the arrow-key walk
  - the `/articles` section chip and its `?section` mirror
  - the article TOC, the hero lightbox and the related-rail link
  - the kit tabs, the brand link, and the 404 suggestions
- `npm --prefix scripts run check` and `npm --prefix scripts run checks`
  pass. The sitemap has 676 URLs, the feed has 72 items, and the SEO mirrors,
  prerender, dist, home shell and archive are all up to date.
