---
name: guide-fact-audit
description: The Field Guide fact audit — once a week, re-verify the perishable facts already in the paid PWA (hours, fees, shuttle and road windows, parking rules, trail access, phone numbers) against primary sources: the next ten stops, hikes, or secret spots in the rotation, one whole content file, or the in-park dining hours and help numbers when a new Yosemite Guide edition has landed, as `npm run audit:candidates` picks; correct what changed, flag what this lane cannot change, one [guide] PR. Run by the "Field Guide fact audit" Routine (Friday mornings Pacific) in a fresh session; also runnable by hand when asked to "run the guide fact audit".
---

# The Field Guide fact audit: keep the paid guide true

The Field Guide is the product the site sells, and the buyer reading it is
often standing at a trailhead with no signal and nothing to check it
against. Every hour, fee, shuttle window, parking rule, and road season in
`apps/guide/src/content/` was true on the day it was written, and the park
changes them on its own schedule. The evergreen refresh re-verifies the
articles, the depth pass adds archive notes, and the intel executor fixes
what the news forces; this routine is the scheduled re-verification of what
the guide already says. **Minimal diff, nothing invented, every correction
sourced.**

The rotation is kept in `scripts/data/guide-fact-ledger.json` and computed
by `apps/guide/scripts/fact-audit-candidates.ts`, so a run spends its time
on the sources, not on the bookkeeping.

## Territory

- **This lane:** the perishable facts in the text fields of `stops.ts`,
  `hikes.ts`, `secret-spots.ts`, `dining.ts`, `help.ts`, `amenities.ts`,
  `essentials.ts`, and `seasonal.ts` (a stop's `body`, `teaser`, `swap`,
  `hazard`, `season`, and `photoTiming.note`; a hike's `description`,
  `trailhead`, `distanceNote`, `season`, `permit`, and `hazard`; dining
  hours and notes; amenity hours and notes; the help numbers and their
  sources; the dates and descriptions of seasonal rows), plus the ledger.
- **The depth pass** owns `history` notes and adds body-derived fields.
  This routine corrects the fields an entry already has and never adds one.
- **The intel executor** makes news-forced guide changes the owner
  approved. An entry an open `claude/intel-guide-` or `claude/guide-depth-`
  PR touches is skipped this run.
- **The season pre-flight** owns `deadlines.ts`, the mirror of
  `scripts/data/deadlines.json`; **the bulletin turn** owns
  `workers/src/data/manual-programs.ts`.
- **The owner** owns ground truth and the numbers the trail tracks
  validate. Never touch `coord`, `elevationFt`, a `TODO: verify on the
  ground` marker, `photos`, `timeBudgetMin`, `durationMin`, `dayPart` (the
  itinerary checker anchors on it), `order`, `region`, `collection`,
  `category`, `id`, `stopId`, or a hike's `distanceMi` and `elevationGainFt`:
  `scripts/gen-hike-tracks.mjs` validates every track against those two,
  with a per-hike definition of gain (net, one-way, or cumulative), so a
  change there means regenerating the tracks, which is the owner's call.
  Also never: the `plan` arrays in `itineraries.ts`, the schema, `sw.js`,
  anything under `workers/`, anything that sells. A discrepancy in any of
  these goes under Flags.
- `wildlife.ts` and `hunts.ts` carry natural history rather than logistics
  and are not in the rotation.

## Phase 0 — Preflight

1. Work in the repo clone (clone `goehringcory-lang/The-Talus-Field` if
   absent). Read `CLAUDE.md`, then in `apps/guide/CLAUDE.md` the "Content
   model", "Coords are web-verified", "Trail tracks", and "Nothing in the
   build may read the clock" bullets, and the header comment of every
   content file the run touches (`dining.ts` and `help.ts` say where their
   numbers come from).
2. `cd scripts && npm install`; `cd apps/guide && npm install`.
3. Dedupe: list open PRs with prefixes `claude/guide-fact-audit-`,
   `claude/guide-depth-`, and `claude/intel-guide-`. If last week's audit
   PR is still open, drive it green and stop.

## Phase 1 — The pick

From `apps/guide`: `npm run audit:candidates`. It prints one run, plus any
queued discrepancies:

- **edition** — the printed Yosemite Guide has turned and `dining.ts`
  (`DINING_HOURS_SOURCE`) or `help.ts` (`HELP_SOURCE`) still names the
  previous edition. Re-transcribe the in-park dining hours and the help
  numbers from the edition `bulletin.json` names (its `sourceUrl` is the
  Guide page, which links the PDF), then set both sources to that edition.
  Gateway-town venues keep day patterns and never clock hours; the header
  of `dining.ts` says why.
- **file:<name>** — the whole file, every perishable claim in it.
- **entries** — the ten entries listed, in full.

Queued items ride along with whichever run it is. Take the run the script
prints; the rotation is only fair if nobody picks around it.

## Phase 2 — Verify every perishable claim

Read each entry or file in full and table every hour, fee, date, season
window, shuttle or bus detail, parking rule, permit or reservation
requirement, access or closure statement, phone number, and distance stated
in prose:

| Entry | Claim | Still true / changed / unverifiable | Source URL | Accessed |
|---|---|---|---|---|

Primary sources only: the place's own page and the trail pages on
`nps.gov/yose`, the conditions page, the fees page, the printed Yosemite
Guide, `recreation.gov`, `travel.yosemite.com` (concessioner hours,
lodging, stores), YARTS, Caltrans, and official county and gateway-town
pages. Fetch and read each page directly (the environment has full
Internet access; `ROUTINES.md`, "Network access"). A page that fails to
load after one retry may be corroborated by a WebSearch result that quotes
it, marked `(via search)`, with the failure named in the PR body; a claim
that rests only on secondary coverage is hedged or cut, never left
standing. A CONNECT 403 from the agent proxy means the environment's
network policy regressed: say so and stop.

Check the site's own canon as well: `bulletin.json` and the article that
covers the place. The NPS page wins a disagreement. A disagreement inside
an article is a Flag for the evergreen refresh, never an edit here.

Two kinds of claim need a second look:

- **A number the guide states twice** (a stop body and its hike entry, a
  stop and `amenities.ts`, `essentials.ts` and `help.ts`) must agree after
  the run, or the Flags must say why they differ (a hike's structured gain
  is often net while the park quotes cumulative gain).
- **A seasonal pattern** ("the shuttle runs mid-June to early September")
  stays correct when this year's dates differ from it; change it only when
  the pattern itself changed. This year's dates belong in `seasonal.ts`
  rows and the bulletin.

## Phase 3 — Edit, surgically

- Correct each changed claim in place, in the same register and length.
  Hedge ("typically", "check the current Guide") or cut what cannot be
  verified. Never average two sources into a number.
- The guide is bundled into every installed copy until the next update,
  and a buyer may open it a year from now: prefer the durable phrasing the
  files already use over a date that will lapse. `seasonal.ts` rows and the
  Guide-sourced hours are dated by design and are the exception.
- A `teaser` restates its `body`: when a body fact changes, fix the teaser
  that repeats it.
- House voice in every edited sentence: dry, declarative, no em-dashes, no
  exclamation marks.
- Update the ledger in the same commit: every entry audited this run (or
  the file) gets today's date, even when nothing in it changed; a resolved
  queue item is removed; ids the script reported as gone are dropped; a
  discrepancy found this run that belongs to this lane but could not be
  settled (a source that contradicts itself, a page that would not load)
  becomes a queue item with its note.

## Phase 4 — Verify, ship

```bash
cd apps/guide && npm run build && npm run check:build && npm run lint && npm test
npm --prefix scripts run check     # must pass entirely: itineraries, citations, photos, the deadlines mirror
npm --prefix scripts run checks    # no NEW errors vs origin/main
```

Branch `claude/guide-fact-audit-<YYYY-MM-DD>` from `origin/main`; commit
the content files and the ledger together; `git push -u origin <branch>`.
PR title `[guide] Fact audit: <the run>` ("ten Valley stops", "amenities",
"dining hours and help numbers for the <edition> Guide"). PR body, in
order:

- **The run**: what `audit:candidates` printed and the queued items taken.
- **The claim table**: every claim checked, its verdict, before and after
  text for each correction, and the source with its access date.
- **Flags**: hike stats, coordinates, article disagreements, and
  cross-file disagreements this lane cannot settle, each with its source.
- **Scope**: the files changed, which are only content files in this lane
  and the ledger.

Subscribe to PR activity and drive CI green (the PWA build-and-lint job and
the editorial guards both run). **Never merge.** Completion summary: the
run, the number of claims checked and corrected, the PR link, and what the
rotation takes next.

## Hard rules

- One run per week, exactly the one the script prints.
- Every corrected fact carries a primary source in the claim table.
  Nothing invented, nothing from memory.
- Never touch the fields listed under Territory; flag them.
- House voice. No em-dashes, no exclamation marks.
- Never push to `main`, never merge or approve, never force-push.

## Failure modes

- **Everything in the run already matches its sources** → the PR still
  ships: the ledger dates are what move the rotation, and the claim table
  is the record that the entries were checked.
- **A load-bearing source will not load** → hedge what can be hedged, queue
  the rest in the ledger, and say plainly in the PR which claims remain
  unverified.
- **The edition run cannot read the new Guide** (the PDF is missing or
  unreadable) → change nothing, say what failed; the next run retries.
- **The PWA build or lint fails on `origin/main` too** → pre-existing; note
  it in the PR body and continue.
- **A fast merge elsewhere conflicts** → merge `origin/main` into the
  branch, rerun the gates.
