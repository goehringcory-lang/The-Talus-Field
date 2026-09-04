---
name: guide-depth
description: The Field Guide depth pass — once a week, make the paid PWA deeper with work the repo can verify offline: two or three sourced Nature Notes archive notes on stops and secret spots that lack one, plus at most one body-derived field (a swap, hazard, photo-timing, or teaser) that the entry's own text already supports; build, lint, citation check, one [guide] PR. Run by the "Field Guide depth pass" Routine (Tuesday mornings Pacific) in a fresh session; also runnable by hand when asked to "run the guide depth pass".
---

# The Field Guide depth pass

The Field Guide is the product the whole site sells ($3.99, 18 months), and
its perceived value is depth: the parking note, the time budget, the swap
when the lot is full, and the one thing about a place that no other guide
carries. The archive notes are that last thing. `Stop.history` is one short,
sourced note from *Yosemite Nature Notes* (the National Park Service's own
bulletin, 1922 onward, transcribed in `nature-notes/` and published at
`/archive`), and as of September 2026 twenty-seven stops and all fifteen
secret spots have none. The whole source is in the repo, so this routine needs
nothing outside it, and `scripts/check-archive-citations.mjs` can prove
every citation resolves.

This routine adds two or three notes a week and, when the entry's own body
already supports it, one small field. It is the paid product: **minimal
diff, nothing invented, nothing the owner cannot verify in a minute.**

## Territory

- The **intel executor** makes guide changes the news forces (a closed
  trail, a moved trailhead, a new program) when the owner approved them.
- The **revenue pulse** owns the buy box, the sales page, pricing, and the
  storefront surfaces. Nothing here touches how the guide sells.
- The **photo pass** (`LAUNCH-READINESS.md`) ran in September 2026 once
  the environment could reach Wikimedia Commons; the four stand-ins that
  remain have no Commons candidate. Wiring a photo stays the owner's
  (`ROUTINES.md`, territory table); this routine reports the inventory
  and never wires one.
- Coordinates are ground-truth work. **Never** strip a `TODO: verify on the
  ground` marker or move a coord.

## Phase 0 — Preflight

1. Work in the repo clone (clone `goehringcory-lang/The-Talus-Field` if
   absent). Read `CLAUDE.md`, then `apps/guide/CLAUDE.md` in full, and the
   header comment of `apps/guide/src/content/stops.ts`. The "Archive notes
   on stops" bullet and the `ArchiveNote` comment in
   `apps/guide/src/content/schema.ts` are the rules this routine lives by.
2. `cd scripts && npm install`; `cd apps/guide && npm install`.
3. Inventory, read live from the files (never from this runbook):
   - entries in `stops.ts` and `secret-spots.ts` without `history`;
   - entries without `teaser`, `swap`, `hazard`, or `photoTiming` whose
     body plainly supports one;
   - `npm --prefix scripts run photos:check` (report only);
   - `grep -c "TODO: verify" apps/guide/src/content/stops.ts` (report only).
4. Dedupe: open PRs with prefixes `claude/guide-depth-` and
   `claude/intel-guide-`. If last week's depth PR is still open, drive it
   green and stop.

## Phase 1 — Choose the entries

Order by reader value: core stops before hidden ones; the Valley, then
Glacier Point and Mariposa, then Tuolumne, then Hetch Hetchy (the order the
regions are read and bought); within a region, the entries with the highest
`order` rank first. Take the first two or three that the archive can
actually serve (Phase 2 decides that); do not force a note onto an entry
the archive never wrote about.

## Phase 2 — Research in the archive (offline)

For each chosen entry:

1. Grep `nature-notes/*.md` for the place: its current name, its historical
   names (the old Big Oak Flat Road, the Wawona Road, Artist Point, the
   Ledge Trail, Rainbow Pool, Carlon, Chilnualna, Wapama, Yosemite Point,
   Foresta, Crocker Point, Stanford Point), and the features the body
   names. `nature-notes/<v>-<n>.pdf.md` is volume `<v>` number `<n>`.
2. Read the two or three strongest hits in full. Look for a specific,
   dated, quotable fact: a measurement, a first sighting, a construction
   year, a naturalist's walk, a count, a named person doing a named thing.
   A passing mention is not a note.
3. Confirm the citation against the **generated page on disk**,
   `archive/<year>/vol-<v>-no-<n>/index.html`: the page exists, its
   masthead prints the date you will cite, and the fact is on the page. A
   page marked "(year inferred)" is not citable (54 issues have no legible
   date; `scripts/data/nature-notes-report.md` lists them).
4. Write the note: 40 to 90 words, house voice (dry, declarative, no
   em-dashes, no exclamation marks), past tense, and **every fact in it
   from the cited issue and nowhere else**. A reader who follows the link
   has to find what the note claims. Do not blend in a fact from NPS.gov,
   another issue, or memory. Do not editorialize about today.
5. Fill `history: { note, volume, number, issueDate }` in the entry;
   `issueDate` is the date the archive page prints, ending in the four-digit
   year, because the link is built from it.

Optionally, **one** field derived from the entry's own body (at most one
per run, and only when the body states the fact outright):

- `swap`: the body already names where to go when the lot is full;
- `hazard`: the body already states a plain danger (exposure, current, ice);
- `photoTiming`: the body already says which light the place is for
  (`best` from the enum, `note` one sentence, never a clock time);
- `teaser`: one or two plain sentences restating the body for the map
  popup, no markdown, no new facts.

Never: `coord`, `elevationFt`, `timeBudgetMin`, `dayPart` (the itinerary
checker anchors on it), `photos`, `order`, `region`, `collection`,
`category`, the `plan` arrays in `itineraries.ts`, the schema, `sw.js`,
anything under `workers/`, anything that sells.

## Phase 3 — Verify, ship

```bash
node scripts/check-archive-citations.mjs      # every citation resolves and prints its date
cd apps/guide && npm run build && npm run lint
npm --prefix scripts run check                # wires the citation and photo guards
npm --prefix scripts run checks               # no NEW errors vs origin/main
```

Branch `claude/guide-depth-<YYYY-MM-DD>` from `origin/main`; PR title
prefixed `[guide]`, naming the entries. PR body, in order:

- per note: the entry id, the issue cited with its full archive URL, and
  the **source lines quoted verbatim** from `nature-notes/` so the owner
  can check the note against them without opening anything;
- the one body-derived field, if any, with the body sentence it restates;
- the inventory line: entries still without a note, stand-ins remaining,
  `TODO` coords remaining, all read live this run;
- the statement that the diff touches only `stops.ts` / `secret-spots.ts`.

Subscribe to PR activity, drive CI green (the PWA build-and-lint job and
the editorial guards both run), **never merge**. Completion summary: the
entries, the issues cited, the PR link, and the count remaining.

## Hard rules

- Every fact in a note comes from the cited issue. No exceptions, no
  blending, no "it is still true today".
- Never cite an inferred-date issue; never guess a volume or number; the
  citation checker is the floor, not the bar.
- Minimal diff on the paid product: two or three notes and at most one
  field. Never touch coords, photos, prices, auth, the service worker, or
  the planner.
- House voice. No em-dashes, no exclamation marks.
- Never push to `main`, never merge or approve, never force-push.

## Failure modes

- **The archive has nothing on the chosen entries** → move down the order;
  if fewer than one honest note can be written this run, ship nothing and
  say which entries were searched. A stretched note is worse than none.
- **Citation check fails** → the date or number is wrong; fix it from the
  page's masthead, never by editing the checker.
- **PWA build or lint fails on `origin/main` too** → pre-existing; note it
  in the PR body and continue.
