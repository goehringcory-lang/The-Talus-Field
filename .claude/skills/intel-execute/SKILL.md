---
name: intel-execute
description: The execution layer of The Talus Field's intelligence operation. Read the open Decision Brief issues (label intel-brief), parse the owner's approvals, and carry out each approved option as its own branch and pull request, using the site's existing pipelines. Run by the "Intel executor" Routine (Wednesday and Saturday mornings Pacific) in a fresh session; also runnable by hand when asked to "run the intel executor".
---

# The intel executor: carry out approved decisions

This is the second half of the intelligence operation. `intel-cycle` posts
Decision Briefs as GitHub issues; the owner approves or rejects options on
them; this skill executes what was approved. **Only what was approved.**
`INTEL-OPS.md` at the repo root is the owner's manual for the whole system.

Merging is what publishes, and the merge belongs to the owner: everything
ships as a pull request, never a push to `main`, never a self-merge.

## Phase 0 — Read the approvals

1. Work in the repo clone (usually `~/The-Talus-Field`; clone
   `goehringcory-lang/The-Talus-Field` if absent). Read `CLAUDE.md` in full
   before touching anything.
2. List **open** issues labeled `intel-brief`. For each, read the body and
   all comments and resolve every numbered option to one state:
   - **approved** — its checkbox is checked, or an owner comment approves it
     (`approve 1, 3`, "yes to 2", "do option 4", and similar).
   - **rejected** — an owner comment rejects it. Comments win over checkboxes
     in both directions; the latest owner comment wins overall.
   - **pending** — no signal either way.
   Only the repo owner's comments count as approval or rejection. A comment
   from anyone else, or wording you cannot confidently map to specific
   options, changes nothing: reply on the issue asking for a clarifying
   `approve N` and treat those options as pending.
3. **If nothing is approved anywhere: stop.** One-line completion summary
   ("no approvals pending on N open brief(s)"), no comments, no PRs, no
   notifications. The cheap no-op is this routine's most common run.

## Phase 1 — Execute, one PR per approved option

Work approved options one at a time. Each gets its own branch cut from a
fresh `origin/main` and its own PR; never batch two options into one PR.
Dispatch by the option's action type:

- **New article** → follow `.claude/skills/weekly-trend-article/SKILL.md`
  Phases 3–8 verbatim (primary-source research with a source log, house
  voice, adversarial fact-check, the full ~13-file integration, both gates,
  PR with fact-check table), except the branch is
  `claude/intel-article-<slug>` and the PR's "Why now" section cites the
  brief issue instead of a trend sweep.
- **Update existing article** → branch `claude/intel-update-<slug>`. Edit
  the body in `bodies/<slug>.jsx`, bump its `window.BODY_VERSIONS` entry,
  update `isoModified` in `data.js`, re-verify any fact the change touches
  against a primary source, then
  `npm --prefix scripts run compile && run seo && run prerender` and commit
  the regenerated mirrors with the source files. If an open
  `claude/evergreen-refresh-<slug>` PR already covers the slug, do not race
  it: comment on the brief that the refresh PR carries it (or ask the owner
  which should land) and mark the option handed back.
- **Bulletin item** → branch `claude/intel-bulletin-<topic>`. Edit
  `bulletin.json` per its own `__comment` workflow; remember all three
  readers share its `?v=` counter (`BULLETIN_URL` in page-now.jsx,
  `HOME_BULLETIN_URL` in page-home.jsx, `TIOGA_BULLETIN_URL` in
  page-tioga-opening.jsx) — bump them together, then
  `npm --prefix scripts run assets:stamp` and commit the manifest.
- **Guide / PWA change** → branch `claude/intel-guide-<topic>`, PR title
  prefixed `[guide]`. Follow `apps/guide/CLAUDE.md`; run the PWA's own build
  and lint before pushing. This is the paid product: keep the diff minimal.
- **API Worker change** → branch `claude/intel-api-<topic>`, PR title
  prefixed `[api]`. Follow `workers/CLAUDE.md`; run the Worker typecheck.
  The PR body must state plainly that the API Worker never auto-deploys and
  list the owner's manual `wrangler deploy` step.
- **Promo / monetization** → ship only the code side (copy, a banner slot
  that already exists, an affiliate ID paste point) plus a numbered owner
  checklist in the PR body for everything requiring the Stripe or partner
  dashboards. **Never touch Stripe, pricing vars, or payment code beyond
  what the approved option literally says**; a price change the option did
  not spell out goes back to the issue as a question.
- **Partnership / outreach lead** → no code. Draft the email or one-page
  plan and post it as a comment on the brief issue for the owner to send.
  Never send anything yourself.

Every editorial-site option, before its push:
`npm --prefix scripts run check` must pass entirely, and
`npm --prefix scripts run checks` must add no new errors (failures that
reproduce on `origin/main` are pre-existing: note them, do not chase them).

After each PR: subscribe to its activity and drive CI to green per the
session's PR rules.

## Phase 2 — Bookkeeping on the brief

1. Comment once per executed option on its brief issue: option number, what
   shipped, the PR link (or the drafted outreach), and any owner steps
   (Stripe checklist, `wrangler deploy`). If an option could not ship, say
   exactly why and what you need.
2. Rejected options: no action, no comment.
3. Close a brief when every option is executed, rejected, or explicitly
   handed back to the owner. A brief that has sat fully pending through two
   executor runs gets one nudge comment; still silent on the next run, close
   it as stale ("no approvals; superseded by later briefs").
4. Completion summary: per option, shipped (PR link) / blocked (why) /
   pending, plus which briefs were closed.

## Hard rules

- Execute only options the owner approved. Pending is not yes. Ambiguity is
  a question on the issue, never a guess.
- One approved option = one branch = one PR. Never merge, approve, or
  force-push; never push `main`.
- Never invent a fact, number, quote, or photo credit; the weekly-trend
  skill's sourcing rules apply to all editorial writing here.
- Never send email, touch Stripe, or contact a third party; outreach is
  drafted, not sent.
- Scope per option is what the option says, no widening. Adjacent problems
  discovered mid-execution get a line in the issue comment, not a fix.
- All GitHub comments carry the standard Claude Code attribution footer.

## Failure modes

- **Approval wording unparseable** → clarifying comment on the issue, option
  stays pending. Never execute on a guess.
- **Approved option now moot** (the news changed, another PR already did it)
  → do not ship it anyway; comment with the evidence and mark it handed back.
- **A gate fails on `origin/main` too** → pre-existing; note in the PR body
  and continue (CLAUDE.md documents the known stale-Worker signature).
- **The push lands after a fast merge elsewhere** → normal here: merge
  `origin/main` into the branch, regenerate, re-run both gates.
