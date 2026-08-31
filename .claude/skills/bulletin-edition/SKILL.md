---
name: bulletin-edition
description: The Park Bulletin edition turn — watch for the next NPS Yosemite Guide edition and, when it publishes (roughly every five weeks), rewrite bulletin.json and re-curate the PWA programs feed from it, then open one PR. Run by the "Bulletin edition turn" Routine (Thursday mornings Pacific) in a fresh session; also runnable by hand when asked to "turn the bulletin edition" or "check the bulletin edition".
---

# The bulletin edition turn

`/now` (The Park Bulletin) is a standing editorial commitment: one page per
NPS Yosemite Guide edition, rewritten when the park publishes a new Guide
(~every 5 weeks), and never carried past its end date without a note. The
Sunday sweep *flags* a lapsing edition but is forbidden to touch
`bulletin.json`; this skill is the hand that does the work. The
`__comment` at the top of `bulletin.json` is the authoritative per-field
workflow; this file adds the cadence, the gate, and the shipping rules.

Merging is what publishes and it belongs to the owner: one branch, one PR,
never push to `main`, never merge or approve.

## Phase 0 — The gate (this is where most runs end)

Read `edition.start` / `edition.end` in `bulletin.json` and compute days
until `end`.

- **More than 10 days left** → stop now with a one-line summary
  ("edition current through <end>, N days left, no action"). No fetches,
  no branch, no PR. This is the common case and it must stay cheap.
- **10 or fewer days left, or lapsed** → fetch
  https://www.nps.gov/yose/planyourvisit/guide.htm (and the current Guide
  PDF it links) once and determine whether a new edition covering dates
  beyond the current `end` has been published.
  - **New Guide is out** → Phase 1, the full turn.
  - **No new Guide, current edition not yet lapsed** → stop with a
    "watching: new Guide not yet published" summary. No changes.
  - **No new Guide, edition lapsed** → Phase 4, the stale note. Carrying a
    lapsed edition silently is the one failure this routine exists to
    prevent.

## Phase 1 — The turn

Rewrite `bulletin.json` from the new Guide, section by section, per its own
`__comment`: the `edition` block (label, start, end, updated, lede, source,
sourceUrl), alerts, areas, the Valley clock (`valleyDay` +
`valleyDayNote`), `elsewhere`, events (each with its `end` ISO date so the
page can dim it), trails, hours, transit, phones.

Rules that have teeth:

- **Facts come from the printed Guide plus park sources only.** Never
  invent a program, time, date, or closure. A row the Guide does not carry
  is a row this file does not carry.
- **`access` / `allAges` are the Guide's own printed symbols, read off the
  Programs page row by row, true-only.** An unmarked program stays
  unmarked.
- **Alert icons** come from the `BULLETIN_ICONS` registry in
  `page-now.jsx` and only restate what the alert text already says; when
  in doubt, omit the icon and let the neutral mark render.
- The lede is original Talus Field copy in house voice (dry, declarative,
  no em-dashes, no exclamation marks), not NPS copy.

## Phase 2 — The programs feed

Re-curate `workers/src/data/manual-programs.ts` from the same new Guide's
Programs page: its `GUIDE_START`/`GUIDE_END` and the program rows, with
`accessible` / `familyFriendly` carrying the same two printed symbols,
true-only. This ships in the same PR, and the PR body must state that the
API Worker never auto-deploys and list the owner's step:
`cd workers && npx wrangler deploy`.

## Phase 3 — Plumbing, verify, ship

1. Bump the bulletin's shared `?v=` counter in **all three readers**:
   `BULLETIN_URL` (page-now.jsx), `HOME_BULLETIN_URL` (page-home.jsx),
   `TIOGA_BULLETIN_URL` (page-tioga-opening.jsx).
2. `npm --prefix scripts run compile && npm --prefix scripts run seo &&
   npm --prefix scripts run assets:stamp`.
3. `npm --prefix scripts run check` must pass entirely;
   `npm --prefix scripts run checks` must add no new errors (failures that
   reproduce on `origin/main` are pre-existing: note, do not chase).
4. Branch `claude/bulletin-edition-<new-start-date>` cut from
   `origin/main`; commit the JSON, the worker file, the version bumps, and
   every regenerated mirror together; `git push -u origin <branch>`; open
   one PR whose body carries the edition label, the Guide source URL, what
   materially changed from the prior edition, and the owner's wrangler
   deploy step. Subscribe to PR activity and drive CI green. Do not merge.

## Phase 4 — The stale note (fallback only)

If the edition has lapsed and no new Guide exists yet: prepend one alert,
`{ "icon": "clock", "text": "This edition ended <end date>; the park has
not yet published the next Yosemite Guide. Dated items below may have
passed." }`, set `edition.updated` to today, then Phase 3 (bump, verify,
one small PR, branch `claude/bulletin-stale-note-<date>`). Remove the note
as part of the next real turn. Never post a second stale-note PR while one
is open.

## Guardrails

- Touch only: `bulletin.json`, `workers/src/data/manual-programs.ts`, the
  three `?v=` readers, and regenerated mirrors. Nothing else.
- Read-only weeks are the normal outcome; never manufacture work.
- If the Guide page is unreachable or its dates are ambiguous, report that
  in the summary and change nothing — a wrong edition is worse than a late
  one.
- End every run with a one-paragraph summary: no-op / watching / turned
  (PR link) / stale note (PR link).
