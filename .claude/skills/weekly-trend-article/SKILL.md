---
name: weekly-trend-article
description: The weekly trend-driven article routine — research what people searched and asked about Yosemite this week, pick the one topic the catalog does not answer, write it fact-checked in house voice, integrate it through the full SEO pipeline, and open a PR. Run by the "Weekly Yosemite trend article" Routine (Mondays, early morning Pacific) in a fresh session; also runnable by hand when asked to "write this week's article".
---

# The weekly trend article

One article per run, driven by what real people searched and asked about Yosemite
in the past seven days, published through the site's complete pipeline. The PR is
the deliverable; **merging is what publishes, and the merge belongs to the owner.
Never push to `main`, never merge the PR yourself.**

The bar: an article this site would have commissioned anyway, where the week's
search interest only decided *which one ships first*. If no candidate clears that
bar, ship nothing and say so — a filler article costs more than a quiet week.

## Phase 0 — Preflight

1. Work in the repo clone (usually `~/The-Talus-Field`; clone
   `goehringcory-lang/The-Talus-Field` if absent). Read `CLAUDE.md` in full first.
2. `git fetch origin main` and start a fresh branch **from origin/main**
   (final name after Phase 2: `claude/trend-article-<slug>`).
3. `cd scripts && npm install` (once per session; the generators need it).

## Phase 1 — Trend sweep (past 7 days)

Gather from several independent sources; each is blind to the others. Log what
each one surfaced — the log becomes the "why now" section of the PR.

- **Web search**: run several queries scoped to the last week — Yosemite news,
  announcements, closures, reservations, road and trail changes, event coverage.
  News volume is a proxy for search volume.
- **NPS primary**: current conditions (`nps.gov/yose/planyourvisit/conditions.htm`)
  and the news releases page. What the park just announced is what visitors are
  about to search for.
- **Reddit**: `https://old.reddit.com/r/Yosemite/top/.json?t=week` — the questions
  people asked this week, in the words they used. Repeated questions are the
  strongest topic signal this sweep produces.
- **Google Trends** (best effort): the trending RSS
  (`https://trends.google.com/trending/rss?geo=US`) rarely surfaces Yosemite;
  treat it as a bonus signal, not a required one, and move on if it is empty
  or unreachable.
- **The seasonal calendar**: readers plan two to eight weeks ahead, so the
  *visit months* coming up are part of "current" demand. A late-August run is
  serving September and October planners.
- **The site's own bulletin**: `bulletin.json` — what the current Guide edition
  says is happening. An alert or closure there often names the planning question
  readers are asking elsewhere.

Output: a ranked candidate list — topic, the search phrasing readers actually
use, and the evidence lines behind it.

## Phase 2 — Topic selection

1. Load the catalog: every `slug` + `title` in `window.ARTICLES` (`data.js`),
   plus `PLANNING_SERIES` and recent `isoDate`s.
2. Apply the rules, in order:
   - **Answer the planning question underneath the news, not the news.** A
     rescue, a viral photo, or a closure is not an article; "what do I do if
     that trail is closed during my trip" is.
   - **The catalog wins ties.** If an existing article already answers the
     question, the topic is dead — pick the next candidate or a genuinely
     distinct angle. Updating existing articles is out of scope for this
     routine; if the week's news makes one stale, flag it in the summary
     instead.
   - **Evergreen phrasing by default.** A year belongs in the slug and copy only
     when the content is genuinely dated (the way
     `when-to-visit-yosemite-2026-crowd-forecast` is); the event decision-aid
     pages (`/firefall` etc.) are deliberately yearless and are not this
     routine's format.
   - **Fallback ladder**: strongest trend topic → best seasonal gap (a coming
     visit month the catalog underserves; check `ARTICLE_MONTHS` coverage) →
     skip the week. Never invent a third option.
3. One article per run. Fix the slug (lowercase-hyphenated), the category
   (`planning` | `trails` | `wildlife` | `seasonal` — must be one of the four in
   `window.CATEGORIES`), and rename the branch to `claude/trend-article-<slug>`.

## Phase 3 — Research and the source log

Facts come from primary sources only: `nps.gov/yose`, `recreation.gov`,
`travel.yosemite.com` (the park concessioner), Caltrans (roads), NWS
(weather climatology), YARTS, official gateway-town and county pages,
Yosemite Conservancy. Blogs, forums, and Wikipedia are leads to chase into a
primary source, never citations.

Keep a source log as you go — one row per fact:

| Claim | Source URL | Accessed |
|---|---|---|

Two additional constraints:

- **The site's published canon counts.** Road dates, permit systems, trail
  distances and elevations must agree with what the site already says (the
  related articles are the canon). Where canon and a current NPS page disagree,
  the NPS page wins for the new article — and the discrepancy gets flagged in
  the PR body so the owner can decide about the older piece.
- **A fact that cannot be verified does not ship.** Cut it or hedge it
  explicitly; never average two sources into a made-up number.

## Phase 4 — Writing

Read two recent bodies first (`bodies/yosemite-winter-hikes.jsx` and one more)
to load the register, then write to these rules:

- **Voice** (from CLAUDE.md, non-negotiable): dry, declarative, journalistic.
  No marketing fluff, no exclamation marks, and **no em-dashes in reader-facing
  copy** — commas, colons, or periods instead. Specifics over adjectives.
  Uncertainty stated plainly ("typically", "in most years") beats false
  precision.
- **Length**: 1,800–3,200 words, the catalog norm.
- **Structure**: an opening `<p className="dropcap">` that names the reader's
  actual situation; `<h2>` sections in the order the decisions come at the
  reader; `<strong>` on load-bearing facts; a practical close, not a call to
  action.
- **Internal links**: two to four `<a href="/articles/<slug>">` links to the
  related pieces, plus `/now`, `/planning`, `/map`, or `/conditions` where they
  genuinely help. Every target must exist (a slug in `data.js` or a real route).
  Links into `/archive/` are plain `<a href>` — never a `go()` handler.
- **Figures**: one to three `<Placeholder>` blocks reusing existing `img/`
  photos. Copy the exact `credit` line the image carries elsewhere in the repo
  (grep for the filename); never invent or alter a credit.
- **Monetization**: only when the topic genuinely answers a lodging or camping
  question, using the existing `LodgingCta` / `AvailabilityLink` +
  `AffiliateNote` pattern with an existing `aff_list` placement value
  (`article_cta` / `article_inline` — see ARCHITECTURE.md; never a new one, and
  never the retired bare `article`). The guardrail holds: the best
  recommendation stays top and linkless if unaffiliated. When in doubt, omit
  monetization entirely.
- **Scope**: no new components, routes, CSS, GA4 locations, or dependencies.

## Phase 5 — Fact-check pass (separate from writing)

A second, adversarial read of the finished draft:

1. Walk the draft claim by claim. Every number, date, price, mileage,
   elevation, name, and policy must have a row in the source log. No row →
   verify it now or cut it.
2. Check time-sensitivity: no "this week" / "currently" phrasing for anything
   that will drift; seasonal claims state typical windows, sourced.
3. Verify every internal link target and every image path exists.
4. Check the draft against the site's own related articles for contradictions.
5. The surviving log becomes the fact-check table in the PR body.

## Phase 6 — Integration (the full pipeline)

The canonical single-article commit touches ~13 files (see #305 and #311 in
history). Edit four by hand; the rest are generated.

1. **`bodies/<slug>.jsx`** — new file, following the existing pattern exactly:

   ```jsx
   /* global React, Placeholder, MotifMountains, MotifTrees */

   window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

   window.ARTICLE_BODIES["<slug>"] = function <PascalCase>Body() {
     return (
       <>
         <p className="dropcap">…</p>
         …
       </>
     );
   };
   ```

   Declare in the `/* global */` comment exactly what the body consumes.

2. **`data.js`** — two edits:
   - `window.BODY_VERSIONS`: add `"<slug>": 1,` (this is the body's
     cache-buster; `check-cache-busters.sh` fails if it is missing).
   - `window.ARTICLES`: insert the entry **at the top of the array** (newest
     first), matching the existing shape:
     `slug`, `cat`, `title` (sentence case, colon subtitle in the recent
     style), `dek` (the newsstand pitch, two to four sentences), `seoDek`
     (plain, ≤160 chars), `date` ("Month D, YYYY" — today), `isoDate`,
     `isoModified` (today), `read` ("N min" ≈ words ÷ 260), `placeholder`
     (alt text for the hero), `image` (`img/<file>.jpg`), and `credit` when
     the image carries one elsewhere in the repo.
   - `PLANNING_SERIES`: leave alone unless the piece unambiguously belongs to
     one part; membership there is curation, not a default.

3. **`intent-data.js`** — read the header comment first, then:
   - `window.ARTICLE_INTENT`: add an entry. Tag what the article **answers**,
     not what it mentions; an empty facet is a legitimate answer. An article
     with no tag in any facet must instead be declared in
     `window.INTENT_NO_TAGS` with its reason.
   - `window.ARTICLE_MONTHS`: only if the piece is season- or road-windowed.
     The window is the reader's **visit** month, never the reading month, and
     is quoted from the article's own published body.
   - `TRIP_RULES`: do not touch unless `check-intent-tags` fails without it,
     and explain any change in the PR body.

4. **`seo-data.json`** — add the enrichment entry (every article has one):
   `wordCount` (the actual count), `keywords` (7–10, phrased the way people
   search), `faq` (4–7 Q/A pairs whose answers restate the body **only** —
   the FAQ may not introduce a single fact the body does not state).

5. **Images**: reuse existing `img/` photos — they already have `responsive/`
   variants and og crops, which is where `articles.json`'s `ogImage` comes
   from. Only fetch a new photo when nothing fits: explicit license required
   (Wikimedia Commons / Unsplash / Pexels), slug-named file into `img/`, then
   `npm --prefix scripts run images`, and carry the exact credit. After
   `run seo`, confirm the article's `ogImage` materialized in `articles.json`.

6. **Generate** (order matters):

   ```bash
   npm --prefix scripts run compile     # dist/bodies/<slug>.js + any drift
   npm --prefix scripts run seo         # articles.json, sitemap, feed, llms.txt, index.html noscript list
   npm --prefix scripts run prerender   # prerender/<slug>.html
   ```

7. **Cache-busters**: a pure article add needs **no** shared `?v=` bump —
   both canonical article commits shipped without one (`data.js` and
   `intent-data.js` ride a short TTL that self-heals, per `_headers`).
   `BODY_VERSIONS` from step 2 is the only new counter.

## Phase 7 — Verification gates

Both must be clean before anything ships:

```bash
npm --prefix scripts run check    # the pre-commit gate — must pass entirely
npm --prefix scripts run checks   # offline health battery — no NEW errors
```

If `check` fails, fix the article integration until it passes; that is what the
gate is for. If `checks` reports errors that exist on `origin/main` too, they
are pre-existing: note them in the run summary, do not chase them, and do not
let them block the PR (CLAUDE.md documents the known stale-Worker signature).

Commit the hand-edited files **and** every regenerated file together:
`articles.json`, `sitemap.xml`, `feed.xml`, `llms.txt`, `index.html` (noscript
list), `prerender/<slug>.html`, `dist/bodies/<slug>.js`, plus any dist drift
the compile step corrected.

## Phase 8 — Ship

1. Commit in the repo's style: a title line naming the article and its section,
   a body explaining the trend rationale, the gap it fills, the fact-check
   posture, and that all mirrors were regenerated with the check suite green.
2. `git push -u origin claude/trend-article-<slug>` (retry up to 4 times with
   exponential backoff on network failure only).
3. Open the PR. The body carries, in order:
   - **Why now** — the trend evidence from Phase 1, with sources.
   - **What it adds** — the catalog gap it fills, and the intent tags chosen.
   - **Fact-check table** — the surviving source log from Phase 5.
   - **Pipeline checklist** — each Phase 6 step confirmed, both gates green.
   - Any flags for the owner (canon discrepancies, pre-existing check errors).

   If the session has no GitHub PR tool, the pushed branch is still the
   deliverable: put the ready-to-click PR URL
   (`https://github.com/goehringcory-lang/The-Talus-Field/pull/new/<branch>`)
   and the full would-be PR body in the completion summary instead. That is a
   degraded finish, not a failure.
4. Subscribe to PR activity (if the tooling allows) and drive CI to green:
   fix and push on failures, answer review comments. **Do not merge.** The PR
   sitting green and mergeable is this routine's finish line; merging it is
   the owner's publish button.
5. End with a short completion summary: the article shipped (title, PR link,
   word count, tags) or the reason the week was skipped.

## Failure modes

- **No topic clears the bar** → no PR. Report the trend digest and why each
  candidate failed (covered / no planning value / unverifiable).
- **A source will not load** through the environment's proxy → try an
  alternate primary source; a claim that stays unverifiable gets cut.
- **`run checks` errors that reproduce on origin/main** → pre-existing; note
  and continue. Nightly-CI 404s on only the newest articles mean a stale
  production Worker, not a repo problem (see CLAUDE.md).
- **The push lands after a fast merge** of some other PR → normal here;
  conflicts resolve by merging `origin/main` into the branch, regenerating,
  re-running both gates.

## Hard rules

- Never invent a fact, number, quote, or photo credit.
- Never push to `main`; never merge or approve the PR; never force-push.
- One article per run; no edits to existing articles.
- Touch nothing under `workers/` or `apps/guide/`, and no changes to
  `styles.css`, `app.jsx`, `components.jsx`, or `index.html` beyond what the
  generators write.
- No em-dashes or exclamation marks in reader-facing copy.
- FAQ answers and every seo-data.json fact come from the article's published
  body, nowhere else.
