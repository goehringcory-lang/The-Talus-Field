---
name: season-preflight
description: The season pre-flight — on the 10th of each month, keep the park calendar true ahead of the reader: re-verify every row of the deadline table (scripts/data/deadlines.json, which feeds /dates, its calendar files, and the Field Guide's trip board) and the fee table (fees-data.js) against their nps.gov sources, roll year-specific rows and RULE_YEARS forward, and advance the verified dates both pages print; then, when a dated annual article's season opens before the end of the second month ahead, write next year's edition (tioga-road-opening-weekend-<year> and its siblings) and repoint the page that links last year's. At most two PRs a run: the dates, and one article. Run by the "Season pre-flight" Routine (10th of each month, early morning Pacific) in a fresh session; also runnable by hand when asked to "run the season pre-flight".
---

# The season pre-flight

Readers plan six to ten weeks ahead, and the search for a seasonal question
arrives before the season does. The site's dated facts live in places no
weekly routine owns end to end: the deadline table
(`scripts/data/deadlines.json`, one source for /dates, its `.ics` files, and
the Field Guide's trip board), the fee table (`fees-data.js`, the
/international calculator), and the dated annual articles (`<topic>-<year>`),
whose next edition has to exist before readers search for it. /dates prints
"Verified against the National Park Service pages linked above on <date>"
for the whole table, and /international prints the fee table's date the
same way. The monthly edition writes next month's dated piece; this routine
keeps both tables true and their dates current, and writes the annual
editions ahead of their seasons.

## Territory

- **This lane:** `scripts/data/deadlines.json` and what it generates
  (`dates-data.js`, `ics/`), the Field Guide's hand mirror
  `apps/guide/src/content/deadlines.ts` (it changes in the same PR or `run
  check` fails), `RULE_YEARS` in `scripts/gen-dates-ics.mjs`, `fees-data.js`,
  the next-year edition of a dated annual article, and the one link on an
  evergreen page that points at a dated edition, with the same link in that
  page's crawler copy in `edge/seo.js`.
- **The monthly edition** owns `yosemite-in-<month>-<year>`: never write or
  edit one.
- **The evergreen refresh** owns existing article bodies: last year's
  edition is never edited here. Name it under "Links in" so the refresh
  adds the pointer to the new one.
- **The reference refresh** owns every other fact on the standing pages,
  including the copy on /dates and /international that explains the tables.
- **The intel executor** makes news-forced changes to either table when the
  owner approved them; stand down on a table an open `claude/intel-` PR
  touches.

## Phase 0 — Preflight

1. Work in the repo clone (clone `goehringcory-lang/The-Talus-Field` if
   absent). Read `CLAUDE.md` (the five-feature pass bullet on /dates and
   /international), the `__comment` in `deadlines.json`, and the header of
   `fees-data.js`.
2. `cd scripts && npm install`; `cd apps/guide && npm install`.
3. Dedupe: list open PRs with prefixes `claude/season-preflight-`,
   `claude/intel-`, `claude/evergreen-refresh-`, and
   `claude/monthly-edition-`. If last month's pre-flight PR is still open,
   drive it green and do only what it does not cover.

## Phase 1 — The window

The window runs from the run date through the last day of the second
calendar month after it: a run on October 10 covers through December 31.
Build it from the repo, never from memory:

- **Rows about to matter**: every deadline row whose date or window falls
  inside it (an `annual` row's next occurrence, a `season` row's own dates,
  the `rule` row's occurrences for `RULE_YEARS`). These are read first and
  hardest in Phase 2, because a reader is about to act on them.
- **Successors due**: the `window.ARTICLES` slugs in `data.js` that carry a
  year, except `yosemite-in-<month>-<year>`. A piece with `ARTICLE_MONTHS` in
  `intent-data.js` has its season there; a piece without one covers a
  calendar year, and its season opens on January 1. A successor is due when
  the slug with its year advanced does not exist and the first month of
  next year's season falls inside the window.

## Phase 2 — The dates PR (every run)

1. **Re-verify every row** of `deadlines.json` against the page named in its
   `source`, read directly: the dates, the `confidence`, and every fact in
   `detail`. The table is small and many rows share a page; the page prints
   one date for all of it, so all of it is checked. Correct what changed. A
   date the park has not announced stays `typical` with its pattern; a guess
   is never promoted to `published`.
2. **Roll forward.** A `season` row whose window has ended is replaced by
   next season's row (a new id carrying the new year) once the park has
   published next season's dates, and not before: until then the ended row
   prints its own year and stays honest. Delete `ics/<old-id>.ics` when an id
   is retired, because the generator writes files and never prunes them, and
   grep for links to the old file. `RULE_YEARS`: from September on it lists
   next year and the year after; years before the table's `verified` year are
   dropped (the generator fails otherwise).
3. **Re-verify the fee table**: every row of `FEES` against `FEES.sources`.
   Fee rules take effect on January 1 when they change, so the November and
   December runs also look for an announced change. The interpretive call in
   the file's header (one $250 pass covers a car) changes only together with
   its two sources. The header names the evergreen refresh as the table's
   re-verifier; correct that sentence to name this routine the first time
   the file changes here.
4. Set `verified` in each table to today when every row in it was
   re-verified; a row that could not be read keeps its values, and that
   table's date stays where it was (Failure modes). Then:

   ```bash
   npm --prefix scripts run dates        # dates-data.js and ics/
   npm --prefix scripts run fees:check   # sweeps every calculator input
   npm --prefix scripts run check        # must pass entirely, including the deadlines mirror
   npm --prefix scripts run checks       # no NEW errors vs origin/main
   ```

   Mirror every changed row into `apps/guide/src/content/deadlines.ts`
   before `check`. When `check-asset-freshness.mjs` fails because
   `dates-data.js` or `fees-data.js` changed under the unchanged shared
   `?v=`, bump the shared `?v=` in `index.html`, run `npm --prefix scripts
   run assets:stamp`, and commit the manifest.
5. Branch `claude/season-preflight-dates-<YYYY-MM>` from `origin/main`; one
   commit with both tables, the mirror, the generated files, and any version
   bump; PR title `Dates: verified <date>` plus what changed. Body: the
   window, the claim table (row, claim, verdict, source, accessed, before and
   after), what rolled forward, and Flags (a sentence on /dates or
   /international that no longer matches its table, for the reference
   refresh).

## Phase 3 — The article PR (at most one a run)

When more than one successor is due, take the one whose season opens
first and name the rest in the summary for the next run.

1. **Check the premise first.** A dated piece was written because that year
   had something specific to say. Read last year's edition and establish from
   primary sources whether the same question exists this year (a reservation
   system dropped in one year can return in the next; a road closed for
   construction can reopen). If the premise no longer holds, write nothing
   and put the finding in the summary for the intel cycle.
2. **Write it** through `.claude/skills/weekly-trend-article/SKILL.md`
   Phases 4 to 8, with these overrides:
   - slug: last year's slug with the year advanced
     (`tioga-road-opening-weekend-2027`), the same `cat`;
   - the piece answers what is different this year and links last year's
     edition rather than restating it; a date the park has not announced is
     written as when the park announces it, never as last year's date;
   - `ARTICLE_MONTHS`: the same window as last year's edition unless the
     new body states another;
   - `RELATED`: last year's edition, the evergreen cousin, and two to four
     topical fits;
   - branch `claude/season-preflight-<new-slug>`.
3. **Repoint** the evergreen page that links last year's edition (grep
   `page-*.jsx` and `edge/seo.js` for `/articles/<old-slug>`) to the new
   slug, in the page and its crawler copy, in the same PR. Last year's
   edition stays published and unedited; list it under **Links in**.
4. Open the PR, subscribe to its activity, drive CI green, never merge.

## Hard rules

- At most two PRs a run: one for the dates, one article.
- Every date, fee, and rule traces to the primary page named in its row or
  the article's fact-check table. A pattern stays a pattern until the park
  publishes the date.
- Never edit last year's edition, a monthly edition, or a fact on a
  standing page outside the one dated-article link.
- House voice in every row, sentence, and header: no em-dashes, no
  exclamation marks.
- Never push to `main`, never merge or approve, never force-push.

## Failure modes

- **A row's source page moved or will not load** → retry once, then search
  nps.gov for the page's new address; a row that still cannot be
  re-verified keeps its values, its table's `verified` stays where it was,
  and the PR body says which row and why. The rest of the run proceeds.
- **`check-deadlines.mjs` fails** → the mirror in `deadlines.ts` disagrees
  with the table; fix the mirror, never the checker.
- **No successor is due** → the article half of the run is a one-line
  note of when the next one comes due.
- **A fast merge elsewhere conflicts** → merge `origin/main` into the
  branch, regenerate, rerun the gates.
