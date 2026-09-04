---
name: evergreen-refresh
description: The evergreen refresh — once a week, pick the one existing article whose dated facts have aged most or whose inbound links are thinnest, re-verify every dated, priced, policy, road, and hours claim against primary sources, correct what changed, weave in contextual links to newer articles, bump its version and modified date, regenerate the mirrors, and open one PR. Run by the "Evergreen refresh" Routine (Wednesday mornings Pacific) in a fresh session; also runnable by hand when asked to "run the evergreen refresh" or "refresh <slug>".
---

# The evergreen refresh: keep the catalog true and linked

Sixty-odd articles, most of them evergreen planning pieces, and every one of
them carries fees, dates, reservation rules, road windows, and hours that
the park changes without notice. The site's whole claim is that it is
written from inside the park and checked on foot; an article that still
quotes last year's fee is the failure that claim cannot survive. Search
engines also read `isoModified` and the `lastmod` it feeds, and Search
Console's August 2026 count (66 articles with no contextual inbound link)
was the site's weakest structural signal. This routine is the scheduled
answer to both: **one article per run, verified, corrected, linked.**

## Territory

- The **Monday trend**, **Thursday cornerstone**, and **monthly edition**
  routines never edit an existing article; they name inbound-link
  candidates in their PR bodies ("Links in") for this routine to apply.
- The **intel executor** updates an article when *news* forces it and the
  owner approved the option. If an open `claude/intel-update-<slug>` PR
  exists, that slug is taken this week. Likewise the executor stands down
  on a slug with an open `claude/evergreen-refresh-<slug>` PR.
- The **monthly edition** owns `yosemite-in-<month>-<year>`; a dated
  edition that has gone wrong is flagged in the summary, never edited here.
- The **revenue pulse** owns money surfaces. A lodging article that lacks a
  `LodgingCta` is a ledger proposal, not a refresh edit.
- The **sweep** fixes metadata at the source (`seo-data.json`, `data.js`
  titles and deks); this routine fixes *bodies*.

## Phase 0 — Preflight

1. Work in the repo clone (clone `goehringcory-lang/The-Talus-Field` if
   absent). Read `CLAUDE.md` in full; the article-anchor rule and the
   `RELATED` rule below both come from it.
2. `git fetch origin main`; `cd scripts && npm install`.
3. Dedupe: open PRs with branch prefixes `claude/evergreen-refresh-`,
   `claude/intel-update-`, and any open article PR. If last week's refresh
   PR is still open, drive it green, update nothing else, and stop.

## Phase 1 — Pick one article (derive it, never guess)

Build the candidate table from the repo every run:

- For every entry in `window.ARTICLES` (`data.js`): `slug`, `cat`,
  `isoModified`, and the body file `bodies/<slug>.jsx`.
- **Decay signal**: days since `isoModified`, weighted by the body's
  density of perishable facts: dollar amounts, years, month names,
  "reservation", "permit", "lottery", "fee", "hours", "shuttle", "open",
  "closes", "through", road names. A natural-history essay has few and
  ages slowly; a permits guide has many and ages fast.
- **Inbound-link deficit**: count `href="/articles/<slug>"` occurrences
  across the *other* bodies. Zero inbound contextual links is the Search
  Console finding; it outranks age for an article under three months old.
- **Exclusions**: touched (by `isoModified`) in the last 45 days; a dated
  month edition (`yosemite-in-<month>-<year>`); any slug with an open PR;
  the article the last two refresh runs took.

Pick the highest combined score; ties go to the oldest `isoModified`. Say
in the PR body why this one, with the numbers.

## Phase 2 — Verify every perishable claim

Read the body in full. Extract every dated, priced, policy, road, trail,
hours, transit, and "as of" claim into a table:

| Claim in the body | Still true / changed / unverifiable | Source URL | Accessed |
|---|---|---|---|

Verify against primary sources only: `nps.gov/yose`, `recreation.gov`,
`travel.yosemite.com`, Caltrans, NWS, YARTS, official gateway-town and
county pages, each page fetched and read directly (the environment has
full Internet access; `ROUTINES.md`, "Network access"). A page that fails
to load after one retry may be corroborated by a WebSearch result that
quotes it, marked `(via search)`, with the failure named in the PR body; a
claim that rests only on secondary coverage is **hedged or cut**, never
left standing as a fact. Also check the site's own canon: `bulletin.json` and the related
articles. Where the body and a current NPS page disagree, the NPS page wins,
and the discrepancy is listed for the owner if it touches other articles.

## Phase 3 — Edit, surgically

The article's voice, structure, and argument are the owner's. This routine
corrects facts and adds links; it does not rewrite.

- **Correct** each changed claim in place, in the same register, with the
  new value. Hedge the unverifiable ("typically", "in most years") or cut
  it. Never average two sources into a number.
- **Never insert, delete, or reorder an `<h2>`.** Section anchors are
  positional (`sec-<index>-<slug>`), Google deep-links them, and a moved
  heading silently breaks every SERP jump link below it. If a heading must
  change for a factual reason, pin every existing anchor with authored ids
  first (CLAUDE.md, "Article section anchors are positional").
- **Add two to four contextual links** to articles that did not exist when
  this one was written, each woven into a sentence that already makes the
  point, with descriptive anchor text, never a "see also" list. Priority:
  the newest articles with the fewest inbound links, then the candidates
  named under "Links in" in recent article PRs. Every target must exist.
  Links into `/archive/` stay plain `<a href>`, no `go()` handler.
- **`RELATED`** (`data.js`): swap in a newer, better-fitting slug when one
  exists; the list stays four to six, no self-link, every slug resolving
  (`npm --prefix scripts run seo` fails otherwise).
- **`ARTICLE_MONTHS`** (`intent-data.js`): adjust only if the body's own
  stated window changed with the correction.
- **`seo-data.json`**: update `wordCount`; if a corrected fact appears in a
  FAQ answer, correct the answer to restate the body. The FAQ may not
  introduce a fact the body does not state.
- **`data.js`**: bump `BODY_VERSIONS[slug]` by one and set `isoModified`
  to today. Both are required; the cache-buster guard fails without the
  first and the `lastmod` signal is the point of the second.

Out of scope, always: new components, routes, CSS, GA4 locations,
dependencies; anything under `workers/` or `apps/guide/`; `styles.css`,
`app.jsx`, `components.jsx`; money surfaces (propose them in the summary).

## Phase 4 — Generate, verify, ship

```bash
npm --prefix scripts run compile
npm --prefix scripts run seo
npm --prefix scripts run prerender
npm --prefix scripts run check      # must pass entirely
npm --prefix scripts run checks     # no NEW errors vs origin/main
```

If `check-asset-freshness.mjs` fails because `data.js` / `intent-data.js`
changed under the unchanged shared `?v=`, bump the shared `?v=` in
`index.html`, run `npm --prefix scripts run assets:stamp`, and commit the
manifest.

Branch `claude/evergreen-refresh-<slug>` from `origin/main`; commit the
hand-edited files and every regenerated mirror together; push with
`git push -u origin <branch>`. Open one PR whose body carries, in order:

- **Why this article** — the decay and inbound-link numbers from Phase 1.
- **The claim table** — every perishable claim, its verdict, before and
  after text for each correction, and the source with access date.
- **Links added** — from this article to which slug, with the anchor text.
- **Anchors** — the statement that no `<h2>` was inserted, removed, or
  reordered.
- **Flags** — canon discrepancies in other articles, a money-surface
  proposal for the ledger, pre-existing check errors reproducing on main.

Subscribe to PR activity and drive CI green. **Never merge.** End with a
completion summary: the slug, the count of corrections and links, the PR
link, and the article next week's run would take.

## Hard rules

- One article per run. No voice rewrites, no restructuring, no heading
  changes.
- A perishable claim that cannot be verified does not stay as a fact.
- Never invent a number, date, quote, or credit; never alter a photo
  credit.
- House voice in every edited sentence: no em-dashes, no exclamation marks.
- Never push to `main`, never merge or approve, never force-push.

## Failure modes

- **Every candidate is excluded** (all recently touched or in flight) →
  ship nothing and say so; the catalog is current.
- **A primary page will not load and search cannot corroborate** one of
  the article's load-bearing facts → hedge what can be hedged, list the
  rest under Flags, and say plainly in the PR body which claims remain
  unverified rather than pretending the refresh was complete. A CONNECT 403
  from the agent proxy means the environment's network policy regressed;
  say so.
- **Fast merge elsewhere conflicts** → merge `origin/main` into the branch,
  regenerate, re-run both gates.
