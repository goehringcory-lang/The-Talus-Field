---
name: monthly-edition-article
description: The monthly edition article — on the 25th, write "Yosemite in <next month> <year>", the dated, this-year-specific companion to the evergreen seasonal pieces, fully fact-checked and integrated through the SEO pipeline, and open a PR. Run by the "Monthly edition article" Routine (25th of each month, early morning Pacific) in a fresh session; also runnable by hand when asked to "write the monthly edition article".
---

# The monthly edition article: Yosemite in <Month> <Year>

The catalog carries evergreen seasonal pieces (yosemite-in-fall,
yosemite-in-winter, yosemite-in-march) and, since June 2026, **dated**
month editions (`yosemite-in-<month>-<year>`): what is actually true of
that specific month this year — reservation rules, road status, concession
season dates, closures, events, lotteries. Readers plan 2-8 weeks ahead,
so the piece for month M publishes on the 25th of month M−1. The
intel-cycle and trend-article routines both treat this lane as owned;
this skill is the owner.

## Phase 1 — The gate

The target is the **calendar month after the run date** (a run on Aug 25
writes September). Load `window.ARTICLES` from `data.js`; if a
`yosemite-in-<month>-<year>` entry for the target month already exists,
stop with a one-line summary. One article per run, never two months at
once.

## Phase 2 — What the month decides

Before writing, establish from primary sources (nps.gov/yose,
recreation.gov, travel.yosemite.com, Caltrans, YARTS, NWS) what the target
month decides this year: entrance-reservation requirements and their exact
dates, Tioga and Glacier Point road status (use `TRIP_MONTHS` language:
open / closed / unsettled, and say which), concession and shuttle season
dates (the current `bulletin.json` edition is a strong source if its dates
cover the target month), permit and lottery windows, dated events, and the
honest crowd and weather picture. Keep a source log: claim, URL, access
date. The piece must answer "what is different about <Month> <Year>",
not restate the evergreen seasonal piece — link to that piece instead.

## Phase 3 — Write, check, integrate, ship

Follow `.claude/skills/weekly-trend-article/SKILL.md` Phases 4-8 verbatim
(house voice, adversarial fact-check with the table in the PR body, full
integration through `bodies/<slug>.jsx`, `data.js` ARTICLES +
BODY_VERSIONS + RELATED, `intent-data.js`, `seo-data.json`, then compile /
seo / prerender, verify with `run check` + `run checks`, ship), with these
overrides:

- Slug `yosemite-in-<month>-<year>`, `cat: "seasonal"`, matching the June
  and September 2026 entries' field shape.
- Branch `claude/monthly-edition-<month>-<year>`.
- `ARTICLE_MONTHS` gets exactly the target month — this is the one article
  type whose window is definitionally a single visit month.
- `RELATED` links the evergreen cousin for the same season, the crowd
  forecast piece, and 2-4 topical fits; follow the existing dated pieces'
  entries as the model.
- Reuse an existing `img/` photo with its exact existing credit line.

Open the PR, subscribe to its activity, drive CI green, never merge.

## Guardrails

- Never edit a previous month's dated piece in this run; if one is now
  materially wrong, say so in the completion summary for the intel cycle
  to brief.
- A month with genuinely nothing year-specific to say does not exist in
  Yosemite; but if research collapses (sources unreachable), ship nothing
  and say why rather than padding the evergreen piece's content into a
  dated shell.
- End with the standard completion summary: title, PR link, word count,
  intent tags, or the reason for a skip.
