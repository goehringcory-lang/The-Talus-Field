# ROUTINES.md — the scheduled agent fleet

The owner's manual for every Claude Code Routine that runs against this
repo. Set up August 2026, reorganized September 2026. `INTEL-OPS.md` covers
the intel operation in more depth; this file is the map of the whole
fleet: what each routine is for, when it runs, what it may touch, where it
stops for the owner, and what the environment can reach.

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

## Network access: full Internet since September 2026

Every routine runs in the "Default Cloud Environment". Through August
2026 that environment's egress policy refused almost every host the
runbooks depend on (only GitHub and web *search* got through; confirmed
from inside a session on 2026-09-02 as a CONNECT 403 from the agent proxy
on every direct fetch), and the runbooks carried fallbacks for it: facts
checked through search results that quoted the primary page, marked
`(via search)`; a revenue pulse that could not verify the live sale path;
a sweep without its online battery; a bulletin turn that could not read
the new Guide; a photo pass that could not run at all.

**On 2026-09-04 the environment was switched to full Internet access**,
and the switch was confirmed from inside a session: `nps.gov` (the Guide
page and its PDFs), `recreation.gov`, `travelyosemite.com`, Caltrans, NWS,
YARTS, Google Trends, the local papers, Wikimedia Commons, and the site's
own three hosts all answer directly. The runbooks and the Routines' stored
prompts were updated the same day. What changed:

- **Primary pages are fetched and read.** `(via search)` is no longer a
  posture; it marks the rare page that fails to load after one retry, and
  the PR body or brief names the page and the failure.
- **The revenue pulse verifies the live sale path** every Monday
  (`checks -- --only=api --online`), and the sweep runs the online
  battery. The allow-list item that sat at the top of the ledger's "Your
  court" is resolved and comes off at the next comment.
- **The bulletin turn reads the new Guide itself**, so an edition rollover
  is automated end to end.
- **The photo pass ran** (`LAUNCH-READINESS.md`); wiring a photo into the
  guide stays the owner's, per the territory table.

Two things did not change. Some hosts wall off non-browser clients on
their own account, and that is their policy, not the environment's: Reddit
redirects the anonymous `.json` feed to a login page and answers 403 to
non-browser user agents (fetch `www.reddit.com/r/Yosemite/top/?t=week` as
HTML with a browser user agent), a lodge behind a Cloudflare challenge
answers 403 to everything, and Commons rate-limits a burst with 429 plus
`Retry-After` (the photo script retries). A 403 or 429 *from the origin*
is reported as that site's behaviour; a **CONNECT 403 from the agent
proxy** (`curl -sS "$HTTPS_PROXY/__agentproxy/status"`) means the
environment's network policy has regressed, and every runbook says to
report exactly that rather than an outage. And the environment still holds
no GA4, Search Console, Stripe, or Buttondown credentials; numbers reach
the routines only when the owner pastes them into the ledger.

For reference, the hosts the runbooks reach, should the policy ever need
to be narrowed to an allow-list again:

```
www.nps.gov  nps.gov  www.recreation.gov  recreation.gov
www.travelyosemite.com  travelyosemite.com  yarts.com  www.yarts.com
dot.ca.gov  roads.dot.ca.gov  quickmap.dot.ca.gov
forecast.weather.gov  api.weather.gov  www.weather.gov
old.reddit.com  www.reddit.com
yosemite.org  www.yosemite.org  yosemiteclimbing.org  www.yosemiteclimbing.org
www.yosemitemariposa.com  www.visittuolumne.com  www.yosemitethisyear.com
www.mariposagazette.com  www.sierrastar.com  www.uniondemocrat.com
thetalusfieldjournal.com  api.thetalusfieldjournal.com  guide.thetalusfieldjournal.com
commons.wikimedia.org  upload.wikimedia.org  api.pexels.com  images.pexels.com
trends.google.com
www.tenayalodge.com  autocamp.com  www.evergreenlodge.com  www.rushcreeklodge.com  firefallranch.com  www.undercanvas.com
```

## Changing the machine

- **Pause or resume** a routine: the Routines list in claude.ai/code, or
  `update_trigger` with `enabled` from any session. The runbooks stay for
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
