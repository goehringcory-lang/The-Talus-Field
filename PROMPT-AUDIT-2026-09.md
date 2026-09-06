# Prompt audit, September 2026

An audit of every file that reaches a model as instruction text in this
repo, run against the dated-pattern catalogue in the `claude-api` skill's
`prompt-audit` guide. Two deliverables: this report, and the proposed diff
in `PROMPT-AUDIT-2026-09.patch` beside it. **Nothing in the patch has been
applied.** Take hunks selectively with
`git apply --include='<path>' PROMPT-AUDIT-2026-09.patch`, or the whole
thing with `git apply PROMPT-AUDIT-2026-09.patch`; it was verified to apply
cleanly on `origin/main` at `6f08727`.

## Assumptions

- **Scope.** The request named no file, so the scope is the whole prompt
  surface Step 1 found: the three `CLAUDE.md` files, the eleven
  `.claude/skills/*/SKILL.md` runbooks, and the three owner's manuals the
  runbooks tell a session to read (`ROUTINES.md`, `INTEL-OPS.md`,
  `WEEKLY-SWEEP.md`). The Routines' stored prompts live in claude.ai/code,
  not in the repo, and are out of scope; ROUTINES.md says a material
  runbook change goes in both, so the same edits apply there by hand.
- **Target model.** `ROUTINES.md` states the fleet runs on **Fable** and
  the intel cycle's scouts on **Sonnet**; nothing documents a migration in
  progress. The target is therefore Claude Fable 5.1 for every runbook and
  Claude Sonnet 5 for the scout subagents. Both names in the repo are
  aliases, not version pins, so they track the current generation.
- **Provider and language.** No file in the repo calls a model API. There
  is no Anthropic SDK code, no request builder, no tool definitions, no
  non-Anthropic provider marker. Group 3 (tool descriptions) and the
  request-config half of Group 4 are therefore empty by construction. The
  repo's language (TypeScript, plus the uncompiled root JavaScript) has no
  bearing on the audit.
- **Provenance.** Every file in scope was created between 2026-08-26 and
  2026-09-06 and last touched within the past nine days, so none of it
  was written for an earlier model generation. What the audit found is
  drift of a different kind: instructions written as a diff against a
  previous week's runbook, counts and claims that the code has already
  moved past, and arithmetic the model is asked to redo by hand each run.

## Summary

The surface is largely clean. There is no pressure language at all (zero
capitalised MUST / NEVER / ALWAYS across sixteen files), no scaffolding
that an API feature replaced, no anti-formatting or update-suppressing
rules, and every prohibition cluster encodes a stated business constraint
(never merge, never invent a fact, never touch Stripe, never send) with
its reason beside it. Those stay.

| Group | Findings | Proposed edits |
|---|---|---|
| 1a Pressure language | 0 | 0 |
| 1b Scaffolds replaced by features | 1 (a rubric the model computes) | 1 |
| 1c Over-specification | 1 (one rule stated three times in one file) | 2 hunks |
| 1d Fossils | 7 (migration-relative phrasing, stale claims, an unenforced rule) | 7 |
| 1f Output-shaping ceilings | 1 | 1 |
| 2 Brittle skill files | 3 (volatile counts, history narrative) | 3 |
| 3 Tool descriptions | none in scope | 0 |
| 4 Config and architecture | 1 advisory (no cost accounting) | 0 |
| Flags only (low confidence) | 3 | 0 |

The three findings worth reading first:

1. **`WEEKLY-SWEEP.md` tells the sweep the homepage's LCP element is the
   dek text.** `CLAUDE.md` records that it has been the shell's hero image
   since the August redesign and that the nightly number is a simulation.
   A sweep following its own runbook would misdiagnose a real regression.
2. **Six lines are written as diffs against the previous runbook**
   ("is the exception now, not the posture", "used to pick", "no longer
   suggested here", "an earlier version of this note said"), and one is a
   one-shot instruction for a run that has not happened yet. A fresh
   session never saw the previous version; relative phrasing implies
   alternatives that do not exist. The patch states each rule as if it
   had always been the rule.
3. **The evergreen refresh asks the model to score sixty-seven articles by
   hand every Wednesday** (perishable-fact density, inbound-link counts, a
   weighted combination). The patch adds `scripts/refresh-candidates.mjs`
   so the run reads a table and keeps only the judgment (the two
   exclusions GitHub answers, and the pick).

## Findings

Ordered by confidence. Line numbers refer to `origin/main` at `6f08727`.

### High

**F1. `WEEKLY-SWEEP.md:57`**
Evidence: "remember the homepage's LCP element is the dek text, not the hero photo — image preloads are not the fix."
Pattern: Group 2, volatile specifics; a factual claim the code moved past.
Why obsolete: `CLAUDE.md` ("Things that have surprised past edits") states the LCP element has been the static shell's hero image since the August 2026 redesign, re-measured in September, and that the nightly figure is Lighthouse's simulated LCP. The sweep would reason from the wrong element.
Confidence: High. Action: `rewrite` (patch states the current element and points at `observedLargestContentfulPaint`).

**F2. `.claude/skills/weekly-trend-article/SKILL.md:261-263`**
Evidence: "(An earlier version of this note said a pure add needs no bump; that predates the asset-freshness guard, and PR #341 hit it.)"
Pattern: Group 1d migration-relative phrasing; Group 2 history narrative with a PR number.
Why obsolete: the session never saw the earlier version, so the sentence describes a phantom alternative. The rule itself (a pure add trips the guard) is kept and stated directly.
Confidence: High. Action: `rewrite`.

**F3. `.claude/skills/guide-depth/SKILL.md:14-15`**
Evidence: "as of September 2026 twenty-seven stops and all fifteen secret spots have none."
Pattern: Group 2 volatile specifics.
Why obsolete: already wrong. `secret-spots.ts` carries 28 entries after the Secret Guide pass merged on 2026-09-06 (`#364`); the file's own Phase 0 says the inventory is read live and "never from this runbook". A number in the framing paragraph contradicts that rule and will keep drifting.
Confidence: High. Action: `rewrite` (drop the counts, keep the proportion).

**F4. `.claude/skills/intel-cycle/SKILL.md:22` and `:48`**
Evidence: "Four Routines already exist and own their lanes:" followed by a list of eight; "everything those three cannot see".
Pattern: Group 2 patch accretion; a count left behind as the list grew (git history shows it started at "Three").
Why obsolete: two different wrong numbers in one section make the model reconcile them; neither carries information.
Confidence: High. Action: `rewrite` (drop the count).

**F5. `.claude/skills/sunday-letter/SKILL.md:13-14`**
Evidence: "**It never sends anything**: Buttondown is not reachable from the sandbox, and sending is the owner's decision every week."
Pattern: Group 1d, a rule justified by a workaround that no longer holds.
Why obsolete: `ROUTINES.md` records full Internet access since 2026-09-04; Buttondown is reachable. The real reasons are that the environment holds no Buttondown credentials and that sending is the owner's signature. A reason the model can see is false weakens the rule it supports.
Confidence: High. Action: `rewrite` (state the two true reasons).

### Medium

**F6. `.claude/skills/weekly-trend-article/SKILL.md:107-109`**
Evidence: "`(via search)` is the exception now, not the posture".
Pattern: Group 1d migration-relative phrasing ("now").
Why obsolete: written on 2026-09-04 as a contrast with the August fallback; a fresh session has no August to contrast with.
Confidence: Medium. Action: `rewrite`.

**F7. `.claude/skills/revenue-pulse/SKILL.md:89-94`**
Evidence: "the August runs could not reach `api.thetalusfieldjournal.com` and fell back to repo-side parity, and the allow-list sat at the top of 'Your court'. That item is resolved: the first ledger comment after this change says so and drops it."
Pattern: Group 1d migration-relative phrasing; Group 2 recency trap (one incident encoded as a standing instruction).
Why obsolete: "the first ledger comment after this change" is unknowable to a session; every future run either re-announces the resolution or guesses it already happened. The intent survives as a state-conditioned rule: if the ledger still carries the item, drop it.
Confidence: Medium. Action: `rewrite`. Note: the first pulse after the change is Monday 2026-09-07; the rewritten rule fires correctly on that run too.

**F8. `WEEKLY-SWEEP.md:71`**
Evidence: "Inbound links for the week's new articles are no longer suggested here".
Pattern: Group 1d migration-relative phrasing.
Confidence: Medium. Action: `rewrite`.

**F9. `.claude/skills/sunday-letter/SKILL.md:21-22`**
Evidence: "The **Sunday sweep** used to pick the archive issue; this routine owns the archive pick now".
Pattern: Group 1d migration-relative phrasing.
Confidence: Medium. Action: `rewrite`.

**F10. `ROUTINES.md:86-116`**
Evidence: the "Network access: full Internet since September 2026" section: two paragraphs on what the August environment refused and which fallbacks the runbooks carried, then "What changed:" as a list of diffs, then "Two things did not change."
Pattern: Group 2 history narrative; Group 1d migration-relative phrasing.
Why obsolete: every runbook sends a session here ("`ROUTINES.md`, Network access") for the current rules, and it reads a changelog. The patch keeps every current fact (the hosts that answer, the four rules, the two limits that are the origin's, the credentials the environment lacks, the allow-list for reference) and drops the before-and-after.
Confidence: Medium (this is also the owner's manual, so the archaeology has a reader; the patch keeps the switch date in one clause). Action: `rewrite`.

**F11. `.claude/skills/weekly-trend-article/SKILL.md:188-189`**
Evidence: "touches ~13 files (see #305 and #311 in history)".
Pattern: Group 2 history narrative (PR numbers).
Why obsolete: a session cannot read a PR number without tools, and the file count is the useful fact.
Confidence: Medium. Action: `rewrite` (keep the count).

**F12. `.claude/skills/weekly-trend-article/SKILL.md:10-11, 309-311, 334` and `.claude/skills/cornerstone-article/SKILL.md:14-15, 133, 149`**
Evidence: "never merge" stated in the opening paragraph, again inside the Phase 8 shipping step ("**Do not merge.** ... merging it is the owner's publish button"), and again in Hard rules; the same three-fold pattern in cornerstone.
Pattern: Group 1c padding (repetition as reinforcement). The keep list allows one end-of-prompt recap; three statements in one file is scattered duplication.
Why obsolete: current models retain a once-stated constraint; the reconciled wordings cost effort and the anxious register bleeds into output. The patch removes the mid-file copy only and leaves the opening statement and the Hard rules recap.
Confidence: Medium. Action: `remove` (two hunks, one per file). Cross-file repetition (twelve files) is not a finding: each runbook loads alone.

**F13. `WEEKLY-SWEEP.md:75-77`**
Evidence: "under 40 lines total", "Verdict (2 lines max)".
Pattern: Group 1f numeric output ceilings.
Why obsolete: numeric clamps were tuned against models that padded; the goal ("short enough to read over coffee", already stated in the file's first paragraph) is audience framing and survives without the number. The section-by-section structure and "if everything is clean, the report is the verdict and the snapshot" are kept, since they pin a format.
Confidence: Medium. Action: `rewrite`.

**F14. House-voice rule, stated in nine files and enforced by none**
Evidence: "no em-dashes, no exclamation marks in reader-facing copy" (`CLAUDE.md` Brand & voice; every article runbook's Hard rules; `bulletin-edition`, `guide-depth`, `sunday-letter`, `revenue-pulse`).
Pattern: Group 1d unenforced instructions ("enforce in code what can be enforced in code").
Why: the rule is a real house constraint and stays as prose, but it is mechanically checkable and nothing in `npm --prefix scripts run check` looks. The bodies are clean today (the sweep CLAUDE.md mentions held), so the guard passes on `main`. The patch adds `scripts/check-house-voice.mjs` (bodies, `data.js` strings, `bulletin.json`; code comments skipped; the printed program name "Welcome to Tuolumne!" allow-listed) and wires it into `run check` as the fifteenth guard.
Confidence: Medium. Action: `add`. Verified: `node check-house-voice.mjs` reports 69 files clean on `6f08727`.

**F15. `.claude/skills/evergreen-refresh/SKILL.md:44-63`**
Evidence: "Build the candidate table from the repo every run: ... days since `isoModified`, weighted by the body's density of perishable facts: dollar amounts, years, month names, 'reservation', 'permit' ... count `href="/articles/<slug>"` occurrences across the *other* bodies ... Pick the highest combined score".
Pattern: Group 1b (arithmetic rubrics the model must compute); Group 4 (tallying that belongs in code).
Why obsolete: the inputs fully determine the table, and a model recounting sixty-seven bodies each week is slow, expensive, and non-reproducible between runs (two sessions would weight "density" differently). The patch adds `scripts/refresh-candidates.mjs`, which prints the table with the same signals and the same exclusions, and rewrites Phase 1 to read it and apply only the two exclusions GitHub can answer. The scoring is deliberately transparent (age × (1 + density/10), plus a fixed bonus for zero inbound links) so the owner can retune it in one place.
Confidence: Medium. Action: `add` + `rewrite`. Verified: the script runs on `6f08727` and ranks `tioga-road-opening-weekend-2026` first (116 days, 123 perishable facts).

### Low (flag only, no edit proposed)

**F16. Skill frontmatter descriptions.** Each of the eleven runbooks carries a 60 to 90 word `description` that summarises the whole runbook. Descriptions ride into every session's skill listing (roughly 800 words per session before any skill is invoked). Group 2 treats growing descriptions as a tax, but Group 3's split says trigger text may carry weight, and there is no evidence of mis-triggering. Flag: consider trimming each to its intent and its hand-run phrase if the listing's cost ever matters.

**F17. "Read `CLAUDE.md` in full"** in eight runbooks. Claude Code loads `CLAUDE.md` when the session's working directory is the repo, so the line is working redundancy; it is harmless when the routine starts outside the clone. Keep-list item 8.

**F18. Root `CLAUDE.md` and `apps/guide/CLAUDE.md`** are dense with dated narrative ("July 2026 pass", "PR #219", "Seen Aug 9, 2026"). Group 2's history-narrative row matches on the surface, but nearly every narrative is the reason for a rule that the keep list protects, no line encodes a workaround for a prior model, and the style is the repo's deliberate documentation convention (`WEEKLY-SWEEP.md`: "update the sweep the same way CLAUDE.md gets updated"). The one contradiction found (F1) is fixed in the sweep, not here. No edit.

### Group 4 advisory

`ROUTINES.md` records each routine's wall-clock order of magnitude and nothing about token or dollar cost per run. The audit guide's standing recommendation is that per-surface cost visibility comes first, since every other cleanup is otherwise unmeasurable. The Routines list in claude.ai/code exposes per-session usage; a line per routine in ROUTINES.md's week table, refreshed by the Sunday sweep's fleet-health step, would close the gap. Not in the patch because nothing in the repo can read those numbers.

## What was checked and found clean

- Pressure language (1a): none. Emphasis in the runbooks is bold on the
  one or two real constraints per file, each with its reason.
- API scaffolds (1b): no thinking incantations, prefill, sampling
  parameters, beta headers, or forced tool use, because there is no API
  code. The word and character limits that remain (article 1,800 to
  3,200 words, the letter 250 to 450, subject under 60 characters, the
  archive note 40 to 90 words, scout digests of five items) pin
  genuinely format-sensitive outputs and stay (keep-list item 7).
- Prohibition clusters (1e): every Hard rules block encodes business or
  policy constraints with provenance (the owner's merge, the paid product,
  fabricated facts, Stripe, sending). None describe an output tic.
- Fossils (1d): no retired model names; `Fable` and `sonnet` are aliases.
  No update suppressors, no anti-formatting rules, no reminder cadence.
- Tool descriptions (Group 3): none in scope.
- The `verify` skill: low-freedom exact mechanics for a fragile sandbox
  operation, kept as written (keep-list item 3).

## Applying and verifying

```bash
git apply PROMPT-AUDIT-2026-09.patch
cd scripts && npm install
node check-house-voice.mjs --verbose     # F14: expects "69 files clean"
node refresh-candidates.mjs | head        # F15: the Wednesday table
npm run check                             # the guard suite with F14 wired in
```

After applying, mirror F2, F6, F7 and F11 into the Routines' stored
prompts by hand, per ROUTINES.md ("a material change goes in both").
Re-run this audit at the next model release; the runbooks are per-model
artifacts.
