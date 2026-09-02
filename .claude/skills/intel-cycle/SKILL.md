---
name: intel-cycle
description: The intel cycle — sensing, interpretation, and decision layers of The Talus Field's standing intelligence operation. Scan the Yosemite tourism environment (NPS, Yosemite Hospitality, independent lodges, tourism bureaus, gateway towns, transport, community and press), analyze what was found against the product, and post one Decision Brief as a GitHub issue for the owner's yes/no approval. Run by the "Intel cycle" Routine (Tuesday and Friday mornings Pacific) in a fresh session; also runnable by hand when asked to "run the intel cycle".
---

# The intel cycle: sense, interpret, decide

This is the first half of The Talus Field's intelligence operation. It watches
the Yosemite tourism environment, decides what the findings mean for the
product, and puts a short list of recommended actions in front of the owner.
It **never changes anything**: the deliverable is one GitHub issue (the
Decision Brief), and the separate `intel-execute` skill carries out whatever
the owner approves on it. `INTEL-OPS.md` at the repo root is the owner's
manual for the whole system.

The bar for an item to reach the brief: **would this be worth an employee's
afternoon if employees cost money?** A thin brief is a legitimate outcome. An
empty cycle posts no issue at all, only a completion summary saying so.

## Territory (do not duplicate the other Routines)

Four Routines already exist and own their lanes:

- **Weekly trend article** (Mondays) owns "one new article from the week's
  search trends". If this cycle surfaces a pure article topic driven by search
  interest, check whether the most recent trend-article PR already took it;
  if the topic is strong and untaken, it is still fine to brief it, but say in
  the option that the Monday routine may pick it up and let the owner decide.
- **Monthly edition article** (25th) owns the "Yosemite in <Month>" pieces.
- **Bulletin edition turn** (Thursdays) owns rewriting `bulletin.json` and
  the programs feed when a new NPS Yosemite Guide edition publishes. A
  bulletin-worthy change *mid-edition* (a sudden closure, a new alert) is
  still this brief's lane; the ~5-weekly edition rollover is not.
- **Weekly site sweep** (Sundays) owns site health. Broken links, stale
  mirrors, and check failures are its territory, not this brief's.

This cycle's lane is everything those three cannot see: business and
tourism-industry signals, competitor and partner moves, monetization and promo
opportunities, bulletin-worthy park changes, PWA/guide content gaps, and
updates that new information forces on existing articles.

## Phase 0 — Preflight (cheap, main context)

1. Work in the repo clone (usually `~/The-Talus-Field`; clone
   `goehringcory-lang/The-Talus-Field` if absent). Read `CLAUDE.md` in full.
2. Load the product picture, titles only, no bodies:
   - every `slug` + `title` in `window.ARTICLES` (`data.js`),
   - `bulletin.json`'s `edition` and alert/road headlines,
   - the guide's four regions (skim `apps/guide/CLAUDE.md`, not the code).
3. Build the **dedupe ledger**: list the last 3 issues labeled `intel-brief`
   (open or closed) and the most recent `claude/trend-article-*` PR title.
   Anything already briefed or already turned into an article is dead on
   arrival this cycle unless it has materially changed since.
4. Note the window: everything since the previous brief's date (or 7 days on
   a first run or after a gap).

## Phase 1 — Sensing (fan-out, cheap models)
## Phase 1 — Sensing (fan-out, Sonnet scouts)
Launch the six scouts below **in parallel as subagents with `model: sonnet`**,
each restricted to WebSearch/WebFetch. Each scout returns a compact digest:
at most **5 items**, each as `headline | date | source URL | two-sentence
summary`, nothing else — no prose, no analysis, no page dumps. A scout that
finds nothing new in the window says "nothing new" and stops. A scout whose
sources will not load says which ones failed. Scouts never launch their own
subagents and never exceed ~10 fetches.

The beat list is the source registry; edit it here when the owner adds or
drops a source.

1. **NPS Yosemite** — news releases
   (`nps.gov/yose/learn/news/newsreleases.htm`), current conditions,
   reservation/permit policy changes, planning-page changes.
2. **Yosemite Hospitality** — `travel.yosemite.com`: lodging offers, dining,
   events and seasonal programming (Bracebridge, Vintners'/Chefs' Holidays),
   anything new on packages or tours.
3. **Independent lodges** — Tenaya Lodge, AutoCamp Yosemite, Evergreen Lodge,
   Rush Creek Lodge, Firefall Ranch, Under Canvas Yosemite: packages, promos,
   openings/renovations, and group, retreat, or conference offerings.
4. **Tourism bureaus and gateway towns** — Visit Yosemite | Madera County,
   Visit Tuolumne County, Yosemite Mariposa County Tourism Bureau; town event
   calendars (Mariposa, Oakhurst, Groveland, El Portal); board meetings,
   marketing campaigns, conferences, FAM tours, grant programs.
5. **Transport and access** — YARTS service changes, Caltrans on 140/120/41,
   entrance-reservation news, Tioga/Glacier Point road status changes.
6. **Community and press** — r/Yosemite top threads of the window
   (`https://old.reddit.com/r/Yosemite/top/.json?t=week`), Mariposa Gazette,
   Sierra Star, Union Democrat, plus one general web search over the window.

## Phase 2 — Interpretation (main context)

Merge the digests. Drop dedupe-ledger hits. For each survivor, score it
against the product, in this order:

- Does the catalog already answer it? (slug list from Phase 0)
- Does the bulletin already carry it, or should it?
- Does it touch the Field Guide (a stop, a region note, the buy pitch)?
- Is there a revenue angle: lodging affiliate placement, a guide promo
  window, a `/consult` tie-in, an advertising or partnership lead?
- Is it a market signal worth watching even with no action (a competitor's
  product, a bureau campaign, a pricing move)?

Classify each survivor as exactly one of: **article opportunity**,
**update existing article**, **bulletin item**, **guide/PWA change**,
**promo/monetization**, **partnership/outreach lead**, **watch**, or
**ignore**. Ignores are discarded silently; they cost nothing downstream.
"Watch" items get one line in the brief's footer, not a numbered option.

## Phase 3 — Decision (main context)

For each surviving item, write one numbered option:

- **What happened** — with the source link(s).
- **Why it matters to The Talus Field** — the honest connection to readers,
  buyers, or revenue; if the honest answer is "it doesn't much", say so and
  recommend against.
- **Recommended action** — specific and executable: "write `<working slug>`
  covering X", "update `<slug>` section Y with Z", "add a bulletin alert:
  ...", "run a guide promo for window W (owner does the Stripe side)",
  "draft outreach to X", or "ignore, because ...". Recommending against is a
  first-class recommendation.
- **Effort** — small (an edit), medium (an article or guide change), or
  large (anything multi-PR), so the owner can weigh cost at a glance.

Cap the brief at **6 numbered options**; if more survive, keep the strongest
six and put the rest as one-liners under Watch. Every option must be
something `intel-execute` (or the owner) can actually do.

## Phase 4 — Publish the brief

1. Ensure the `intel-brief` label exists (create it once: name `intel-brief`,
   description "Decision briefs from the intel cycle").
2. Open **one** issue titled `Decision brief — <YYYY-MM-DD>` with label
   `intel-brief`. Body, in order:
   - one-paragraph cycle summary (window covered, scouts that failed, if any),
   - the numbered options, each starting with a markdown checkbox:
     `- [ ] **Option N — <action type>: <one-line title>**` followed by the
     four fields above,
   - a **Watch** section (one-liners),
   - a **How to approve** footer: check an option's box or comment
     `approve 1, 3 / reject 2`; comments win over boxes; the executor runs
     Wednesday and Saturday mornings, or ask any session to "run the intel
     executor now"; unaddressed options stay pending for one more cycle,
     then the brief is closed as stale.
   - the standard Claude Code attribution footer.
3. End with a short completion summary: options posted (count and one-line
   list) and the issue URL, or "empty cycle, no issue posted" with why.

## Hard rules

- **Read-only.** No commits, no branches, no PRs, no merges, no edits to any
  repo file, nothing sent anywhere except the one GitHub issue.
- Never fabricate a finding: every item carries a real URL that was actually
  fetched or returned by search this run. An unverifiable rumor either dies
  or is labeled explicitly as unconfirmed.
- Scouts are capped as specified; do not widen the fan-out because a beat was
  quiet. Quiet is a result.
- One issue per cycle, ever. If a brief for today already exists (a manual
  run raced the Routine), add nothing and stop.
- No dated commitments in the brief that will silently expire; every
  time-sensitive option names its window.

## Failure modes

- **All scouts empty** → no issue; completion summary says the environment
  was quiet.
- **GitHub issue tools unavailable** → the brief still gets produced: put its
  full markdown in the completion summary and say it needs manual posting.
  Degraded finish, not a failure.
- **A beat's sources unreachable through the proxy** → note it in the brief's
  summary line; never pad with invented items.
