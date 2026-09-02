---
name: cornerstone-article
description: The cornerstone article — the second weekly article, driven by standing search demand rather than the week's news: build the catalog's gap ledger live (head terms, the evergreen month guides, the questions people keep asking, thin cells in the trip selector), pick the one gap with the most trip-planning value, write it fact-checked in house voice through the full SEO pipeline, and open a PR. Run by the "Cornerstone article" Routine (Thursday mornings Pacific) in a fresh session; also runnable by hand when asked to "write a cornerstone article".
---

# The cornerstone article: fill the standing gaps

The Monday routine answers what people asked *this week*. Most Yosemite
search demand is not weekly: it is the same head terms every year, asked by
people who have never heard of the site. "Publish cadence beats everything"
was the June 2026 growth audit's verdict, and the "definitive source"
position is won by coverage breadth. This routine adds one article a week
against that standing demand, at the same bar and through the same
pipeline as the trend article. **Merging is what publishes, and the merge
belongs to the owner.**

The bar is unchanged: an article the site would have commissioned anyway.
A gap that only a content farm would fill is not a gap. If nothing clears
the bar, ship nothing and say so.

## Territory

- **Monday trend article** owns the week's demand; if its fallback took the
  seasonal gap this week (an open `claude/trend-article-*` PR on the same
  topic), that topic is taken.
- **Monthly edition** owns the dated `yosemite-in-<month>-<year>` pieces.
  The *evergreen* month guides (`yosemite-in-<month>`, no year, the shape
  of `yosemite-in-march`) are this routine's, and a strong series to
  complete.
- **Intel cycle / executor**: a topic that is a numbered option on an open
  `intel-brief` issue is the owner's to approve; do not race it.
- **Evergreen refresh** edits existing articles; this routine never does.
  Inbound-link candidates go in the PR body under "Links in".

## Phase 0 — Preflight

1. Work in the repo clone (clone `goehringcory-lang/The-Talus-Field` if
   absent). Read `CLAUDE.md` in full, then
   `.claude/skills/weekly-trend-article/SKILL.md`, whose Phases 3 to 8 this
   routine follows verbatim once the topic is chosen.
2. `git fetch origin main`; `cd scripts && npm install`.
3. Load the catalog (every `slug` + `title` + `cat` in `window.ARTICLES`),
   `PLANNING_SERIES`, `ARTICLE_MONTHS`, and the static routes in
   `scripts/lib/catalog.mjs` (a gap already answered by `/firefall`,
   `/tioga-opening`, `/half-dome-lottery`, `/distances`, `/stay`, or another
   standing page is not a gap).
4. Dedupe: open article PRs of any routine, the last two `intel-brief`
   issues' article options, and the last four cornerstone PRs.

## Phase 1 — The gap ledger (rebuilt every run)

Four sources, merged into one ranked list:

1. **The standing head-term list** below, each item checked against the
   catalog by slug, title, `seo-data.json` keywords, and a grep of
   `bodies/` for the term. An item a single existing article answers in
   depth is closed; edit it out of this list in the same PR.
2. **The questions people keep asking**: WebSearch for the planning
   questions readers type (`yosemite <topic>` with "how", "when", "can I",
   "is it worth", "first time"), the "people also ask" shapes the results
   show, and r/Yosemite threads the search surfaces. Repeated questions
   across sources are the strongest signal.
3. **Thin cells in the trip selector**: `npm --prefix scripts run
   intent:check` prints per-chip counts; a `who` or `topic` facet whose
   in-season answer set is thin for a coming month is a gap the site's own
   product exposes.
4. **Handoffs**: gaps named in recent PR bodies or completion summaries by
   the trend, refresh, and sweep routines.

Score each survivor by search demand (head term over long tail) × gap
(nothing on the site answers it) × fit (trip-planning value in the
naturalist's voice; an essay the archive could inform ranks above a
listicle) × revenue adjacency (lodging, camping, gear, or a Field Guide
region). Pick one. Evergreen slug, no year, sentence-case title in the
recent colon style, one of the four categories.

### Standing head-term list (September 2026; verify, then prune)

- The evergreen month guides not yet written: January, February, April,
  May, July, August, October, November, December (the catalog has March,
  fall, winter, and the dated June and September editions).
- Glacier Point itself: how to visit, when the road opens, the sunset
  logistics, the shuttle years.
- Yosemite Falls: the lower loop and the upper trail as one honest guide.
- Sentinel Dome and Taft Point: the loop most first-timers should do
  instead of the Mist Trail on a crowded day.
- Clouds Rest as the Half Dome alternative.
- Tioga Road stop by stop: Olmsted Point, Tenaya Lake, Tuolumne Meadows,
  Tioga Pass (the guide's region, so the product angle is honest).
- Winter driving and chain requirements, if `yosemite-in-winter` does not
  carry them in depth.
- Badger Pass: skiing and snowshoeing for people who are not skiers.
- Biking the Valley loop; rafting the Merced (the swimming piece exists).
- In-park lodging by property (the Ahwahnee, Yosemite Valley Lodge, Curry
  Village, Wawona, Housekeeping Camp), if `where-to-stay-in-yosemite` does
  not already treat each.
- Yosemite from Los Angeles, and from Las Vegas, as the Bay Area day-trip
  piece's siblings.
- Yosemite elevation, altitude, and the weather by month as one reference.
- The Valley without a car: the free shuttle as an itinerary.
- Yosemite with a baby or toddler, if the kids piece does not cover it.
- The Yosemite Museum, the Indian Village, the Ansel Adams Gallery, and
  the chapel: the rainy-day and non-hiker Valley afternoon.

## Phase 2 — Write, check, integrate, ship

Follow `.claude/skills/weekly-trend-article/SKILL.md` Phases 3 to 8
verbatim (primary-source research with a source log and the `(via search)`
posture when a domain is egress-blocked, house voice, 1,800 to 3,200
words, three to five in-body links, a `RELATED` entry, existing photos
with their exact credits, the adversarial fact-check, the full integration,
both gates, the cache-buster rule as the guard decides it), with these
overrides:

- Branch `claude/cornerstone-<slug>` from `origin/main`.
- The PR body's first section is **Why this** rather than "Why now": the
  gap evidence (the query set, the catalog check that found nothing, what
  the search results showed competitors covering, the trip-selector cell if
  one drove it), then **What it adds**, the **Fact-check table**, the
  **Pipeline checklist**, **Links in** (two or three older articles that
  should link here, with the sentence each belongs in, for the Wednesday
  refresh), the **Distribution handoff** (a two-to-three sentence letter
  blurb and a Reddit-ready answer, for the Saturday letter draft), and any
  flags.
- Monetization exactly as the trend runbook allows: only when the topic
  genuinely answers a lodging or camping question, through the existing
  `LodgingCta` / `AvailabilityLink` + `AffiliateNote` pattern with an
  existing `aff_list` value, guardrail intact. When in doubt, omit.
- If the chosen gap was on the standing list above, remove it from this
  file in the same commit. The list is a seed, not a backlog.

Subscribe to PR activity, drive CI green, **never merge**. Completion
summary: the article (title, PR link, word count, tags) and the gap it
closed, or the reason the week was skipped.

## Hard rules

- One article per run; never edit an existing article.
- Never invent a fact, number, quote, or photo credit; an unverifiable
  claim is cut or hedged.
- Touch only the editorial-site files the article needs: nothing under
  `workers/` or `apps/guide/`, no changes to `styles.css`, `app.jsx`, or
  `components.jsx`; no new routes, components, dependencies, or GA4
  locations.
- Evergreen phrasing: no year in the slug or the copy unless the content is
  genuinely dated, and dated content is the monthly edition's.
- No em-dashes or exclamation marks in reader-facing copy.
- Never push to `main`, never merge or approve, never force-push.
