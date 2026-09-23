---
name: reference-refresh
description: The reference page refresh — once a week, take the standing reference route whose facts were verified longest ago (the rotation in scripts/data/reference-ledger.json, from /half-dome-lottery and /international through /webcams), re-verify every fee, date, rule, hour, phone number, and drive time it states against primary sources, correct the page and every crawler copy of it together, and open one PR. Run by the "Reference page refresh" Routine (Sunday mornings Pacific) in a fresh session; also runnable by hand when asked to "run the reference refresh" or "refresh /<route>".
---

# The reference page refresh

The standing pages are the site's reference shelf: the Half Dome lottery,
the international fee, the firefall, the lodging board, Tioga's opening,
the deadline table's explanations, the Planning Guide, the itineraries, the
map's first-visit layer, the drive times, the conditions board, the packing
lists, the webcams. They state fees, lottery rules, road windows, drive
times, and in-park seasons, and each fact exists at least twice: once in
the page React draws and once in the copy crawlers read, the route's
`HUB_PROSE` entry and `known[path]` FAQ in `edge/seo.js` (plus, for
/planning, the client mirror in `app.jsx`, kept word for word). The
evergreen refresh re-verifies articles and the sweep fixes titles and
descriptions; this routine is the scheduled re-verification of what the
standing pages say. **One route per run, verified, corrected in every copy
at once.**

## Territory

- **This lane:** the reader-visible facts on the ledger's routes, in the
  files each row names, and the crawler copies the row names. The ledger
  row is the boundary; a file it lists under `notFacts` is read, never
  edited.
- **The sweep** owns titles, descriptions, og tags, and structured-data
  validity. This routine changes the facts inside a FAQ answer or a
  `HUB_PROSE` paragraph, never a title or description.
- **The revenue pulse** owns every booking link, `aff_list` value,
  `ExpediaBanner`, `LodgingCta`, guide band, letter capture, the buy box,
  `/guide`, and `/consult`.
- **The bulletin turn** owns `bulletin.json` and the two `?v=` counters that
  read it.
- **The season pre-flight** owns `scripts/data/deadlines.json`,
  `fees-data.js`, `dates-data.js`, `ics/`, `RULE_YEARS`, and the link from an
  event page to its dated article.
- **The article routines** own `ARTICLE_INTENT`, `ARTICLE_MONTHS`,
  `INTENT_NO_TAGS`, and `TRIP_RULES` in `intent-data.js`; this routine may
  change only `TRIP_MONTHS` rows, and only for /planning.
- **The owner** owns `points.geojson` and every coordinate.
- Never, in any run: `NAV_GROUPS`, `HOME_NAV`, the `Footer`, `KEEP_GOING`
  (they bake into the home shell and the archive's hand-kept mirror),
  shared components in `components.jsx`, `styles.css`, any `Hp*`
  component, layout, or the home shell in `index.html`.

## Phase 0 — Preflight

1. Work in the repo clone (clone `goehringcory-lang/The-Talus-Field` if
   absent). Read `CLAUDE.md`: the design-system bullet, the Navigation
   bullet's rule on dates in copy, the static-route recipe at the end of
   the Itineraries + Conditions bullet, and "Cache-buster discipline".
2. `cd scripts && npm install`; `cd apps/guide && npm install` (the gate's
   last step runs there).
3. Dedupe: list open PRs and the files each one changes. A route with an
   open PR from any lane on any of its files or crawler copies is skipped
   this run. If last week's refresh PR is still open, drive it green and
   stop.

## Phase 1 — The pick

Read `scripts/data/reference-ledger.json`. Take the first row whose
`verified` is null; when every row has a date, the row with the oldest;
ties go to list order, which puts the most perishable pages first. Skip the
rows Phase 0 excluded. Say in the PR body why this route, with the dates.

## Phase 2 — Verify every perishable claim

Read the row's files in full and each crawler copy it names. Table every
fee, price, date, window, rule, requirement, hour, phone number, drive time,
distance, elevation, count, and "as of" claim:

| Where (file or crawler copy) | Claim | Still true / changed / unverifiable | Source URL | Accessed |
|---|---|---|---|---|

Primary sources only: `nps.gov/yose` (the topic's own page, the conditions
page, fees, the printed Yosemite Guide), `recreation.gov`,
`travel.yosemite.com`, Caltrans, NWS, YARTS, and official county and
gateway-town pages. Fetch and read each page directly (`ROUTINES.md`,
"Network access"); a page that fails after one retry may be corroborated by
a WebSearch result quoting it, marked `(via search)`; a claim resting only
on secondary coverage is hedged or cut. A CONNECT 403 from the agent proxy
means the environment's network policy regressed: say so and stop.

A claim the page renders from another lane's data (a fee from
`fees-data.js`, a date from `deadlines.json`, a row from `bulletin.json`) is
checked and never edited here: a wrong value there is a Flag naming the
owning routine. A disagreement between the page and its own crawler copy is
settled in favour of the verified fact, and every copy is conformed to it.

## Phase 3 — Edit, surgically

- Correct each changed fact in place, in the same register, in the page and
  in every copy the row names, so that they say the same thing. A FAQ answer
  restates the page and adds nothing.
- The event pages (/firefall, /tioga-opening, /half-dome-lottery) carry no
  year in their copy (`CLAUDE.md`, Monetization pass): "the park announces
  the dates each winter", never a year.
- No restructuring, no new sections, no new components, no class or style
  change, no rewrite for voice. The page's shape is the design system's.
- `TRIP_MONTHS` (for /planning only): change a row only when a primary
  source contradicts it, and quote the source in the PR.
- House voice in every edited sentence: no em-dashes, no exclamation marks.
- Set the row's `verified` in the ledger to today, in the same commit, even
  when nothing else changed; the one exception is a load-bearing claim left
  unverified (Failure modes).

## Phase 4 — Generate, verify, ship

```bash
npm --prefix scripts run compile       # when a .jsx file changed
npm --prefix scripts run intent:check  # when intent-data.js changed
npm --prefix scripts run check         # must pass entirely
npm --prefix scripts run checks        # no NEW errors vs origin/main
```

When `check-asset-freshness.mjs` fails because a versioned asset changed
under the unchanged shared `?v=`, bump the shared `?v=` in `index.html`,
run `npm --prefix scripts run assets:stamp`, and commit the manifest.
`edge/seo.js` needs no regeneration; it ships with the next Workers Build.

Branch `claude/reference-refresh-<route-slug>-<YYYY-MM-DD>` from
`origin/main`; commit the edited sources, the ledger, and every regenerated
file together; `git push -u origin <branch>`. PR title `Reference refresh:
/<route>`. PR body, in order:

- **Why this route**: the ledger dates.
- **The claim table**: every claim, its verdict, before and after text for
  each correction, and the source with its access date.
- **Copies conformed**: which crawler copies changed and how.
- **Flags**: facts owned by another lane that look wrong, each naming the
  owning routine and the source.
- **Scope**: the statement that no title, description, link target,
  placement, or layout changed.

Subscribe to PR activity and drive CI green. **Never merge.** Completion
summary: the route, the number of claims checked and corrected, the PR
link, and the route the rotation takes next.

## Hard rules

- One route per run, the one the ledger picks.
- Every corrected fact carries a primary source in the claim table.
- The page and its crawler copies leave the run saying the same thing.
- Never touch another lane's files; flag them.
- House voice. No em-dashes, no exclamation marks.
- Never push to `main`, never merge or approve, never force-push.

## Failure modes

- **Everything on the page is still true** → the PR still ships: the ledger
  date moves the rotation and the claim table records the check.
- **Every row is excluded by open PRs** → ship nothing and say so.
- **A load-bearing source will not load** → hedge what can be hedged, list
  the rest under Flags, and leave `verified` unchanged for the row so it
  comes back first next week.
- **`run checks` errors that reproduce on `origin/main`** → pre-existing;
  note and continue.
- **A fast merge elsewhere conflicts** → merge `origin/main` into the
  branch, regenerate, rerun the gates.
