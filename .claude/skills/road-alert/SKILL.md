---
name: road-alert
description: The road alert drafter — every morning, read the park's road alerts through the public /api/alerts with the Worker's own road-watch rules (workers/scripts/road-watch.mts), keep the watch's state in the "Road alert watch" issue, and when Tioga Road, Glacier Point Road, or a highway into the park confirms an opening or a closure, draft the email the site's road-alert signups were promised as a Buttondown draft addressed only to their tags (scripts/buttondown-alert.mjs), open a road-alert issue with the draft and the site copy the change makes wrong, and stop. Never sends, never schedules, never edits the site. Run by the "Road alert drafter" Routine (daily, early morning Pacific) in a fresh session; also runnable by hand when asked to "check the road alerts".
---

# The road alert drafter

Two captures on the site make a promise. /conditions (tag `alert-roads`):
"One email when Tioga Road, Glacier Point Road, or a highway into the park
opens or closes, sent to the people who asked for it." /tioga-opening (tag
`alert-tioga`): "One email the day the park announces Tioga Road is open,
and one when it closes for the season." The API Worker already watches the
roads every night (`workers/src/lib/roads.ts`) and emails the operator on a
confirmed change, but nothing writes the subscribers' email, and the
promise is only kept if the owner writes and sends it the same day. This
routine writes it. **The owner's click in Buttondown is the send; nothing
here sends, schedules, or publishes.**

Most mornings nothing changes, and the run ends at the gate in a minute or
two.

## Territory

- **This lane:** the "Road alert watch" issue (its state block), the
  road-alert change issues, and Buttondown drafts addressed to the alert
  tags through `scripts/buttondown-alert.mjs`. Nothing in the repo changes
  in a normal run.
- **The Sunday letter** owns the weekly newsletter; an alert is never
  folded into it and never scheduled.
- **The bulletin turn**, **the intel executor**, and **the reference
  refresh** own the site copy a road change makes wrong. This routine lists
  that copy in the change issue for them and edits none of it.
- **The owner** sends the email, and owns the Worker: a problem with the
  Worker's readings is a note in the issue, never a change under
  `workers/src`.

## Phase 0 — The gate (this is where most runs end)

1. Work in the repo clone (clone `goehringcory-lang/The-Talus-Field` if
   absent). `cd workers && npm ci`.
2. Find the open issue titled **Road alert watch** (label `road-alert`).
   Copy the JSON inside its `road-watch-state` block to a scratch file. If
   the issue does not exist, this is the first run: skip `--previous`, and
   Phase 3 creates the issue from the baseline. If the block does not parse,
   treat the run as a first run and say so in the issue.
3. From `workers/`:

   ```bash
   npm run road-watch -- --previous=<scratch>/state.json --out=<scratch>/next.json
   ```

   It fetches `https://api.thetalusfieldjournal.com/api/alerts`, derives the
   seven readings with the Worker's `deriveRoadReadings`, and advances the
   state with the Worker's `advanceWatch`: a new reading is a **candidate**
   until a later reading repeats it, and only then a **confirmed** change.
   Exit 3 means the alerts record is stale or empty (the NPS feed is down):
   nothing advances, and silence from a dead feed is not a reading.
4. **No candidate and no confirmed change** → Phase 3 (update the issue's
   state block and its last-checked line) and stop. This is the common
   case.

## Phase 1 — A candidate: confirm it from a second source, or wait

A candidate is a reading seen once. Before a day passes, check whether the
park already says the same thing somewhere a person reads:

- Tioga, Glacier Point, Mariposa Grove, Hetch Hetchy roads: the park's
  conditions page, `https://www.nps.gov/yose/planyourvisit/conditions.htm`
  (and `tiogaopen.htm` for Tioga).
- Highways 120, 140, 41: Caltrans (`https://roads.dot.ca.gov/`, QuickMap)
  for the road outside the park, the NPS conditions page for the miles
  inside it.

If the second source states the same status for the same road, confirm it
now:

```bash
npm run road-watch -- --previous=<scratch>/next.json --out=<scratch>/next.json --confirm=<roadId>
```

If it does not, leave the candidate: tomorrow's reading confirms it or
drops it. The readings are pattern-matched from the park's alert prose, and
one notice often names several roads (Tioga Road is also Highway 120, and
Glacier Point Road leaves Highway 41), so a reading can land on the wrong
road: a highway change is never confirmed on the reading alone, and a
reading the second source contradicts is noted in the issue as a false
reading, with the alert text that produced it.

## Phase 2 — A confirmed change: draft the promised email

Decide whom the change was promised to:

| Confirmed change | Promised to |
|---|---|
| Tioga Road opens for the season, or closes for the season (the park's notice says "for the season" or "until spring") | `alert-roads` and `alert-tioga`, one draft to both |
| Tioga Road closes or reopens within the season (a storm, an incident) | `alert-roads` |
| Glacier Point Road opens or closes | `alert-roads` |
| Highway 120, 140, or 41 closes or reopens, confirmed by Caltrans or the NPS conditions page | `alert-roads` |
| A change to or from `chains`, Mariposa Grove Road, Hetch Hetchy Road | nobody: note it in the issue |
| `open` to `unknown` (an opening notice was taken down) | nobody: note it |
| `closed` to `unknown` (a closure notice was taken down) | only when the conditions page states the road is open; then it is an opening |

For each promised change, write the alert as a Markdown file:

```
subject: Tioga Road is closed for the season
preheader: <one line, under 90 characters>

<Road> <opened | closed> on <weekday, Month D>. The Park Service's notice: "<the alert headline>".

<One or two sentences on what it changes for a trip, restating only what
the site already publishes (the /tioga-opening and /conditions copy,
bulletin.json's road rows) or the park's notice says.>

Before you drive, call the park's recorded road line, 209-372-0200, or read
the conditions page: https://www.nps.gov/yose/planyourvisit/conditions.htm
The journal's conditions board: https://thetalusfieldjournal.com/conditions
```

Forty to two hundred words, subject under 60 characters, house voice: dry,
declarative, no em-dashes, no exclamation marks, no image, no sales line.
Every fact in the body comes from the park's notice or the site's published
copy; name the source of each sentence in the change issue.

```bash
# from the repo root
node scripts/buttondown-alert.mjs <file> --tag=alert-roads [--tag=alert-tioga] --dry-run
node scripts/buttondown-alert.mjs <file> --tag=alert-roads [--tag=alert-tioga]
```

The script creates a draft only, addressed to the tags only, reads it back,
and deletes it if Buttondown stored any other audience. It refuses a second
draft with the same subject. Exit 2 means `BUTTONDOWN_API_KEY` is not in the
environment: the change issue then carries the paste-ready alert and the
audience to set by hand (subscribers tagged `alert-roads` or `alert-tioga`,
archive off).

Then open one issue per change, label `road-alert`, titled `Road alert:
<Road> <opened | closed> (<Mon D>)`, carrying: the change (from, to, the
time the watch confirmed it), the park's notice and the second source with
links, the Buttondown draft link (or the paste-ready alert and its
audience), and **Copy that may now read wrong**: a grep of the site for the
road's name next to "open", "closed", or "opens" (`bulletin.json`,
`page-*.jsx`, `bodies/`, `edge/seo.js`), each hit with its file and line and
the routine that owns it. Before opening, search open `road-alert` issues
for the same road and change; never open a second one.

## Phase 3 — Update the watch issue (last, every run)

Rewrite the body of **Road alert watch** (create it on the first run, label
`road-alert`): one sentence saying what the issue is and that it needs
nothing from the owner; a **Last checked** line with the Pacific time and
the alerts record's `fetchedAt`; a table of the seven roads (confirmed
state, the notice it came from, any pending candidate); and the new state
from `next.json` inside

````
<!-- road-watch-state -->
```json
{ ... }
```
````

The state is written last, after any draft and change issue exist, so a run
that fails midway repeats its work the next morning instead of losing it.

End every run with one line: `Roads unchanged` with the confirmed states, or
the change, the draft or issue link, and whom it is addressed to.

## Hard rules

- Never send, never schedule, never touch an email this routine did not
  create, and never draft for anyone outside the alert tags.
- Never draft a change the watch has not confirmed, and never a highway
  change without Caltrans or the park's conditions page agreeing.
- Every sentence in an alert traces to the park's notice or the site's
  published copy.
- Never edit the site, the Worker, or `bulletin.json`; list the copy for its
  owners.
- House voice. No em-dashes, no exclamation marks.

## Failure modes

- **Exit 3, the feed is stale** → update the last-checked line with "alerts
  feed stale since <fetchedAt>" and stop; three stale mornings in a row
  go in the final line so the owner sees it.
- **`/api/alerts` answers an error or the schema changed** → the script
  exits 1 with the reason; leave the state as it was, say so in the watch
  issue and the final line.
- **A CONNECT 403 from the agent proxy** → the environment's network policy
  regressed; say exactly that, change nothing.
- **Buttondown refuses the draft or the read-back fails** → the change issue
  carries the paste-ready alert and the error.
