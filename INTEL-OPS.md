# INTEL-OPS.md — The Talus Field intelligence operation

The standing agent "organization" that watches the Yosemite tourism
environment and turns what it finds into product work, with the owner as the
only approval gate. Set up August 2026.

## The four layers, and where each lives

| Layer | What it does | Where it runs |
|---|---|---|
| **Sensing** | Scans the environment: NPS Yosemite, Yosemite Hospitality, the independent lodges (Tenaya, AutoCamp, Evergreen, Rush Creek, Firefall Ranch, Under Canvas), tourism bureaus and gateway towns, YARTS/Caltrans, r/Yosemite and local press. | Six parallel Sonnet scout subagents inside the intel-cycle session, twice a week. |
| **Interpretation** | Scores each finding against the product: covered by the catalog? bulletin-worthy? guide/PWA relevant? revenue angle? market signal? | Main context of the same intel-cycle session. |
| **Decision** | Turns survivors into at most six numbered options, each with sources, the case for or against, a specific recommended action, and an effort tag. Posts one **Decision Brief** GitHub issue (label `intel-brief`). Recommending "ignore" is a first-class outcome; an empty cycle posts nothing. | End of the same intel-cycle session, then **waits for you**. |
| **Execution** | Reads your approvals off the brief and carries out each approved option as its own branch and PR, using the site's existing pipelines. Never merges. | The intel-executor session, twice a week. |

Sensing, interpretation, and decision deliberately share one session: the
expensive part of a scheduled run is loading context (repo, CLAUDE.md,
catalog), not the layer boundaries, so splitting them across sessions would
roughly triple the cost to pass a report between agents that could have
shared a context. The one real break point is your approval, and that is
where the system stops and persists.

## The schedule

| Routine | When (Pacific) | Runbook |
|---|---|---|
| Intel cycle — sense, interpret, decide | Tue + Fri, ~7am | `.claude/skills/intel-cycle/SKILL.md` |
| Intel executor — run approved decisions | Wed + Sat, ~7am | `.claude/skills/intel-execute/SKILL.md` |

The offset is deliberate: each brief lands with an evening for you to review
before the next executor run. The days avoid the other standing Routines
(Monday trend article and revenue pulse, Thursday bulletin edition turn,
Sunday site sweep, monthly edition article on the 25th; the revenue pulse's
runbook is `.claude/skills/revenue-pulse/SKILL.md`).

## How to approve

On the Decision Brief issue, either **check an option's checkbox** or
**comment** — comments win, and only your comments count:

> approve 1, 3
> reject 2

Anything you say nothing about stays pending for one more cycle; a brief
ignored through two executor runs gets one nudge, then closes as stale.
Rejections are silent — nothing ships, nothing argues back.

## Running it by hand

In any Claude Code session on this repo:

- "run the intel cycle" → a brief now, outside the schedule.
- "run the intel executor" → your approvals executed now instead of
  Wednesday/Saturday.

Or fire the Routine itself from the Routines list (`fire_trigger`).

## Changing the machine

- **Add or drop a source**: edit the beat list in
  `.claude/skills/intel-cycle/SKILL.md` (Phase 1). That list is the source
  registry; nothing else needs to change.
- **Change cadence**: update the two Routines' cron expressions
  (`update_trigger`), and keep the executor a day behind the cycle.
- **Pause everything**: disable the two Routines; the skills stay for manual
  runs.
- **Widen or narrow execution scope**: the dispatch table and hard rules in
  `.claude/skills/intel-execute/SKILL.md`. Current scope is the whole repo,
  PR-only, with the guardrails: Stripe and pricing are never touched beyond
  what an approved option literally says, the API Worker's manual deploy
  stays yours, and outreach is drafted but never sent.

## Territory versus the existing Routines

- The **Monday trend article** owns "one new article from the week's search
  trends". The intel cycle may still brief a strong article topic, but it
  says so when the Monday routine is likely to take it, and the executor
  cites the brief, not a trend sweep.
- The **monthly edition article** owns "Yosemite in <Month>".
- The **Sunday sweep** owns site health; broken links and stale mirrors
  never appear in a brief.

The intel operation's lane is what none of those can see: industry and
competitor moves, conference/retreat and event signals, monetization and
promo windows, bulletin-worthy changes, guide/PWA gaps, and updates that new
information forces on existing articles.

## State

There is no state file. Dedupe works by reading the last three `intel-brief`
issues, so the issues themselves are the memory: don't delete them, closed
is fine.
