# ROUTINES.md — the scheduled agent fleet

The owner's manual for every Claude Code Routine that runs against this
repo. Set up August 2026, reorganized September 2026. `INTEL-OPS.md` covers
the intel operation in more depth; this file is the map of the whole
fleet: what each routine is for, when it runs, what it may touch, where it
stops for the owner, and the one environment fix that unblocks most of it.

## What the fleet is for

The site earns in one direction: **visitors → newsletter subscribers →
Field Guide buyers**, with affiliate lodging links on the money articles
along the way and, when the list is large enough, a sponsor line. Every
routine serves one link of that chain:

| Link of the chain | Routines that serve it |
|---|---|
| More visitors (search coverage, freshness, internal links) | Monday trend article, Thursday cornerstone article, monthly edition, Wednesday evergreen refresh, Sunday sweep |
| Visitors who come back (the park, this week) | Bulletin edition turn, Sunday letter draft, intel cycle (bulletin items) |
| Subscribers (the letter sent every week, the forward ask) | Sunday letter draft |
| Buyers (a deeper product, an honest sales path) | Field Guide depth pass, revenue pulse, intel executor (approved guide changes) |
| Revenue plumbing (affiliates, consults, renewals, the ledger) | Revenue pulse |
| Opportunities nobody on the site can see | Intel cycle + executor |

The owner is the only approval gate: **every change ships as a pull
request and merging is publishing.** Nothing here pushes to `main`,
merges, sends an email, posts to social media, touches Stripe or a price,
or deploys the API Worker.

## The week (Pacific; crons are UTC and shift an hour at the DST change)

| Day | Time | Routine | Deliverable | Runbook |
|---|---|---|---|---|
| Sunday | 6am | **Weekly site sweep** | Health report; one PR of safe fixes when there are any | `WEEKLY-SWEEP.md` |
| Monday | 6am | **Weekly Yosemite trend article** | One article from the week's search demand, as a PR | `.claude/skills/weekly-trend-article/SKILL.md` |
| Monday | 9am | **Revenue pulse** | Sale-path check, one conversion PR, a comment on the Revenue ledger issue | `.claude/skills/revenue-pulse/SKILL.md` |
| Tuesday | 7am | **Intel cycle** | One Decision Brief issue (label `intel-brief`) or nothing | `.claude/skills/intel-cycle/SKILL.md` |
| Tuesday | 9am | **Field Guide depth pass** | Two or three sourced archive notes on stops, one `[guide]` PR | `.claude/skills/guide-depth/SKILL.md` |
| Wednesday | 7am | **Intel executor** | One PR per approved brief option | `.claude/skills/intel-execute/SKILL.md` |
| Wednesday | 9am | **Evergreen refresh** | One existing article re-verified, corrected, and linked, as a PR | `.claude/skills/evergreen-refresh/SKILL.md` |
| Thursday | 7am | **Bulletin edition turn** | Usually nothing; a `bulletin.json` rewrite PR when a new NPS Guide publishes | `.claude/skills/bulletin-edition/SKILL.md` |
| Thursday | 9am | **Cornerstone article** | One article against standing search demand, as a PR | `.claude/skills/cornerstone-article/SKILL.md` |
| Friday | 7am | **Intel cycle** | as Tuesday | |
| Saturday | 7am | **Intel executor** | as Wednesday | |
| Saturday | 9am | **Sunday letter draft** | A paste-ready Sunday Field Notes draft plus a distribution pack, as an issue (label `sunday-letter`) | `.claude/skills/sunday-letter/SKILL.md` |
| 25th | 6am | **Monthly edition article** | "Yosemite in <next month> <year>", as a PR | `.claude/skills/monthly-edition-article/SKILL.md` |

The 9am slots are deliberately two hours after the 7am ones on the same
day, so the later routine sees the earlier one's PR and does not race it.
**The four 9am Routines are disabled as of 2026-09-02 until they are
recreated from the Routines page**; see "Creating a Routine" below.
Every routine runs in a fresh session on the **Fable** model; the intel
cycle's six scout subagents run on **Sonnet**. Orders of magnitude: an
article run takes 15 to 40 minutes, a refresh, depth pass, or letter draft
5 to 20, and a gated no-op (bulletin, executor with nothing approved)
under two.

## Where each routine stops for you

| Surface | What you do |
|---|---|
| Any PR from a routine | Merge it, or close it. Merging deploys the editorial site and the PWA. A `[api]` PR also needs `cd workers && npx wrangler deploy` by hand; the PR body says so. |
| `intel-brief` issues | Check an option's box or comment `approve 1, 3 / reject 2`. Comments win. Silence for two executor runs closes the brief as stale. |
| The **Revenue ledger** issue (label `revenue-pulse`) | Read "Your court" and act on it or reply; paste GA4, Buttondown, or Stripe numbers there when you have them. Reply "hold X" or "do Y next" to steer the next run. |
| `sunday-letter` issues | Paste the draft into Buttondown, fill the one bracketed slot or delete it, send. The routine never sends. Post the distribution pack yourself or discard it. |
| The sweep's final message | Read it over coffee; anything under "Needs your decision" is yours. |

## Territory: who may touch what

Each routine has a lane, and the lanes do not overlap. When two routines
could do the same thing, the table says which one does.

| File or surface | Owner routine | Everyone else |
|---|---|---|
| New article bodies, `data.js` entries, `seo-data.json`, `intent-data.js` tags for a **new** piece | Trend, cornerstone, monthly edition, intel executor (approved) | never |
| **Existing** article bodies, on a schedule (facts, inbound links) | Evergreen refresh | never |
| Existing article bodies, when news forces it | Intel executor (approved) | refresh skips a slug with an open executor PR, and vice versa |
| `yosemite-in-<month>-<year>` (dated) | Monthly edition | flag, never edit |
| `bulletin.json`, `workers/src/data/manual-programs.ts` | Bulletin edition turn (the edition rollover), intel executor (mid-edition items, approved) | never; the sweep flags a lapsed edition |
| `apps/guide/` content depth (`history`, body-derived fields) | Field Guide depth pass | intel executor for news-forced guide changes; the pulse for storefront surfaces |
| Coords, photos in the PWA | the owner (ground truth, the photo pass) | never |
| Buy box, `/guide`, affiliate registry and placements, `/consult`, renewals, the ledger | Revenue pulse | intel executor only for an approved promo option, code side only |
| Prices, caps, promo codes, Stripe, checkout, webhook, auth | the owner | never |
| Metadata at the source, generated mirrors, redirects, robots | Sunday sweep | article routines regenerate mirrors as part of their own PRs |
| The newsletter (drafting) | Sunday letter draft | never sends; nobody else drafts |
| External signals, competitor and partner moves, outreach drafts | Intel cycle + executor | never sent by anyone |

## The one thing blocking most of the fleet: the environment's network policy

Every routine runs in the "Default Cloud Environment", and that
environment's egress policy currently refuses almost every host the
runbooks depend on: `nps.gov`, `recreation.gov`, `travelyosemite.com`,
Reddit, Caltrans, NWS, YARTS, the local papers, Wikimedia Commons and
Pexels (the photo pass), and even the site's own three hosts. Only GitHub
and web *search* get through. Confirmed from inside a session on
2026-09-02: every direct fetch fails with a CONNECT 403 from the agent
proxy. The effects so far:

- articles are fact-checked through search results that quote the primary
  page, marked `(via search)`, instead of the page itself;
- the revenue pulse cannot verify the live sale path (`/api/inventory`);
- the sweep cannot run its online battery;
- the photo pass cannot run at all;
- the bulletin turn cannot read the new Guide, so an edition rollover
  cannot be automated until this is fixed (it will post the stale note when
  an edition lapses, and stop there).

**The fix is yours and takes a few minutes.** The setting belongs to the
environment, not to any routine, so fixing it once fixes the whole fleet.
It has **no settings page and no direct URL**, which is why it is hard to
find: on [claude.ai/code](https://claude.ai/code), click the cloud icon
showing the environment's name in the row **above the message box**, hover
"Default Cloud Environment" in the menu, and click the settings gear on
its right. (The same dialog is reachable from a routine's edit form, via
the cloud icon below the Instructions box.) In the dialog set **Network
access** to **Custom**, put the hosts below in **Allowed domains**, one
per line, and **tick "Also include default list of common package
managers"** — without it the npm registry is blocked and every routine
fails at `npm install`. Save; the policy applies from the next run.
**Full** is the one-click alternative and a defensible choice here: no API
credentials are stored in this environment, and GitHub traffic bypasses
this allowlist through its own proxy either way. A leading `*.` matches
subdomains but not the bare domain, so both forms are listed:

```
thetalusfieldjournal.com
*.thetalusfieldjournal.com
nps.gov
*.nps.gov
recreation.gov
*.recreation.gov
travelyosemite.com
*.travelyosemite.com
yarts.com
*.yarts.com
dot.ca.gov
*.dot.ca.gov
weather.gov
*.weather.gov
reddit.com
*.reddit.com
yosemite.org
*.yosemite.org
yosemiteclimbing.org
*.yosemiteclimbing.org
yosemitemariposa.com
*.yosemitemariposa.com
visittuolumne.com
*.visittuolumne.com
yosemitethisyear.com
*.yosemitethisyear.com
mariposagazette.com
*.mariposagazette.com
sierrastar.com
*.sierrastar.com
uniondemocrat.com
*.uniondemocrat.com
wikimedia.org
*.wikimedia.org
pexels.com
*.pexels.com
trends.google.com
tenayalodge.com
*.tenayalodge.com
autocamp.com
*.autocamp.com
evergreenlodge.com
*.evergreenlodge.com
rushcreeklodge.com
*.rushcreeklodge.com
firefallranch.com
*.firefallranch.com
undercanvas.com
*.undercanvas.com
```

Until then, the runbooks say what each routine does instead (search-backed
sourcing, repo-side parity, the stale note), and the revenue ledger keeps
this item at the top of "Your court".

## Where the Routines live

They are **cloud routines**, and there is exactly one page for them:
[claude.ai/code/routines](https://claude.ai/code/routines). In the Desktop
app they are under the **Code** tab, **Routines** in the sidebar (or the
sidebar's **More** menu). The Routines section of the main Claude app is a
different surface and does not list these. From a terminal CLI session,
`/schedule list`, `/schedule update`, and `/schedule run` manage them;
`/schedule` is hidden inside a Claude Code web session, which is why a
session on this repo uses its Routine tools instead.

A routine created from the web form carries three things a routine created
another way may not: the **repositories** it clones, the **connectors** it
may use, and the environment. That is the difference the finding below is
about.

## Creating a Routine (and the September 2026 finding)

The seven older Routines were created from Claude Code sessions in August
2026 and carry the binding a fired session needs: a `sources` entry (the
repo clone), an `outcomes` entry (push access to a branch), and the GitHub
tools. **Four Routines created from a session on 2026-09-02 came back
without any of that** (their stored config held only the model), and two
test firings confirmed the effect: each session ran to completion and
produced no branch, no PR, and no issue, because it had neither a push
credential nor the GitHub tools. Those four (Field Guide depth pass,
Evergreen refresh, Cornerstone article, Sunday letter draft) are
**disabled** until recreated properly.

Create each at [claude.ai/code/routines](https://claude.ai/code/routines)
with **New routine**: this repository under **Select repositories**, the
Default environment, the connectors left as they come, the Fable model in
the prompt box's model selector, and a weekly schedule trigger. Because
the runbooks are on `main`, the prompt is one line:

| Name | Schedule (Pacific) | Prompt |
|---|---|---|
| Field Guide depth pass | Tuesdays 9am | Run the Field Guide depth pass for The Talus Field: read CLAUDE.md, then `.claude/skills/guide-depth/SKILL.md`, and follow it exactly. |
| Evergreen refresh | Wednesdays 9am | Run the evergreen refresh for The Talus Field: read CLAUDE.md, then `.claude/skills/evergreen-refresh/SKILL.md`, and follow it exactly. |
| Cornerstone article | Thursdays 9am | Write this week's cornerstone article for The Talus Field: read CLAUDE.md, then `.claude/skills/cornerstone-article/SKILL.md`, and follow it exactly. |
| Sunday letter draft | Saturdays 9am | Draft the Sunday letter for The Talus Field: read CLAUDE.md, then `.claude/skills/sunday-letter/SKILL.md`, and follow it exactly. |

Then delete the four disabled duplicates from the Routines list. A newly
created Routine is worth one manual firing (the Routines page has a run
button) to confirm it opens its PR or issue before trusting the schedule.
Until they exist, all four jobs still run by hand from any session on this
repo with the phrases at the end of this file.

## Changing the machine

- **Pause or resume** a routine: the **Repeats** toggle on its detail page
  at [claude.ai/code/routines](https://claude.ai/code/routines), or by
  asking any session on this repo. The runbooks stay for
  manual runs ("run the evergreen refresh", "draft the Sunday letter",
  "run the guide depth pass", "write a cornerstone article", and the
  phrases in the older runbooks).
- **Change a cadence**: the cron on the Routine; keep the 9am slots two
  hours after the 7am ones, and keep the executor a day behind the cycle.
- **Change what a routine does**: edit its `SKILL.md`; the Routine's stored
  prompt is a condensed fallback for when the runbook is not yet on
  `main`, so a material change goes in both.
- **Add a routine**: give it a row in the territory table first, then a
  runbook, then a cron. A routine without a lane will eventually edit
  something another routine owns.
- **Change the model**: `update_trigger` with `model`; the intel cycle's
  scouts are set in its runbook and prompt, not on the Routine.

## What is deliberately not automated

Sending the letter, posting anywhere, merging, deploying the API Worker,
changing a price or a code, moving a coordinate, wiring a photo, contacting
a third party, and any first-person field observation. Each of those is
either the owner's signature or the product's core promise, and a routine
that did them on its own would be spending the trust the site sells.

## Running the fleet by hand

In any Claude Code session on this repo, say the phrase in the runbook's
description ("run the intel cycle", "run the revenue pulse", "turn the
bulletin edition", "write this week's article", "write the monthly edition
article", "run the weekly sweep", "run the evergreen refresh", "run the
guide depth pass", "write a cornerstone article", "draft the Sunday
letter"), or fire the Routine itself from the Routines list.
