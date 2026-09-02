---
name: revenue-pulse
description: The revenue pulse — The Talus Field's standing profit routine. Once a week, verify the sale path end to end (checkout, inventory parity, affiliate links, consult, renewals), derive the revenue board from the repo's own money surfaces, ship the single highest-value conversion improvement as one pull request, and keep the owner's Revenue ledger issue current with everything only the owner can unblock. Run by the "Revenue pulse" Routine (Monday mornings Pacific) in a fresh session; also runnable by hand when asked to "run the revenue pulse".
---

# The revenue pulse: verify, pick one, ship it, queue the rest

The site earns four ways: Field Guide sales ($3.99 one-time, 18-month access,
live Stripe checkout), guide renewals ($2.49 via `/api/checkout/renew`),
affiliate commissions (Expedia live on the money articles; Patagonia on gear),
and paid consults (`/consult`, fail-soft to mailto until its links exist). The
newsletter is the audience asset all of them launch to, not a revenue line.

Three convictions govern every run:

1. **A broken sale outcosts any optimization.** Integrity comes before
   improvement, every run, no exceptions.
2. **The strategy is already written.** `CONVERSION-STRATEGY.md` and
   `MONETIZATION-IDEAS.md` are the plan; this routine's job is sequencing and
   shipping, not inventing strategy. A new revenue idea belongs in the ledger
   as a proposal for the owner, never in a PR.
3. **Trust is the revenue asset.** The brand's honesty guardrails (one ask per
   surface, real scarcity only, best recommendation stays top and linkless if
   unaffiliated) are what make the affiliate links and the $3.99 ask convert
   at all. An optimization that spends trust is a loss even when its
   click-through rises.

## Territory (do not duplicate the other Routines)

- **Weekly site sweep** (Sundays) owns site health: links, mirrors, SEO,
  Lighthouse, CI. This routine's integrity gate covers only the sale path,
  and it acts rather than merely reporting when the fix is repo-side.
- **Intel cycle** (Tue/Fri) owns external market signals — competitor promos,
  partnership leads, bureau campaigns. This routine is internal: the repo's
  own conversion surfaces and the documented backlog. If a backlog item is
  already a numbered option on an open `intel-brief` issue, leave it to the
  owner's approval there; do not race the executor.
- **Trend and monthly-edition articles** own content. This routine never
  writes or edits an article body; a money-article gap becomes a ledger
  proposal.
- **Bulletin edition turn** (Thursdays) owns `bulletin.json`.
- **Evergreen refresh** (Wednesdays) owns scheduled corrections and inbound
  links on existing articles; **cornerstone article** (Thursdays) owns the
  second weekly article; **Field Guide depth pass** (Tuesdays) owns the
  PWA's content depth (archive notes, body-derived fields); the **Sunday
  letter draft** (Saturdays) owns the newsletter draft and the distribution
  pack. A money surface inside any of those lanes (a missing `LodgingCta`,
  a guide pitch, an ask) is still this routine's: proposed through the
  ledger or shipped here, never added by them. `ROUTINES.md` is the map.

This routine's lane: the money path and the funnel plumbing — buy box,
checkout config parity, affiliate registry and placements, consult, renewal
and gift flows, capture segmentation, and the owner-court operations queue
(applications, dashboard steps, measurement numbers) that no other routine
tracks anywhere.

## Phase 0 — Preflight (cheap)

1. Work in the repo clone (clone `goehringcory-lang/The-Talus-Field` if
   absent). Read `CLAUDE.md` in full; it is dense with load-bearing rules.
2. Read the **Revenue ledger** issue (label `revenue-pulse`, normally titled
   "Revenue ledger") and every owner comment since the last run. **Owner
   steering wins over the default priority order**: "hold X", "do Y next",
   pasted GA4/Buttondown/Stripe numbers, and answered questions all bind this
   run. Only the repo owner's comments count.
3. Build the dedupe picture: open PRs from prior pulse runs (branch prefix
   `claude/revenue-pulse-`), open `intel-brief` options, and last Sunday's
   sweep PR. **If last week's pulse PR is still open, this run ships nothing
   new**: drive that PR green if it needs it, update the ledger, stop.

## Phase 1 — The sale-path gate (always, before any optimization)

1. `cd scripts && npm install`, then
   `npm --prefix scripts run checks -- --only=api --online` — the battery's
   `api` module: API reachability, `/api/inventory` parity against `[vars]`
   in `workers/wrangler.toml` (price, renewal price, cap), and the CORS echo
   the buy box depends on. Its **errors are sale-breaking by design.**
2. Render-and-config only, mirroring the sweep's rule: `/guide` serves and
   its buy box markup is present; `/api/inventory` returns 200 with
   `priceCents` matching `GUIDE_PRICE_CENTS`. **Never transact against
   production**: no checkouts, no signups, no redemptions, ever.
3. On a sale-breaking finding: repo-side → the fix is this run's one PR, and
   optimization waits a week. Deploy-side (a live value trailing the repo
   means a stale manual deploy; the API Worker never auto-deploys) → it is
   the top line of the ledger comment with the owner's exact step
   (`cd workers && npx wrangler deploy`). A stale editorial Workers Build
   (newest articles 404) is the sweep's known failure mode: report, never
   "fix" the repo.
4. **When the sandbox cannot reach the live hosts** (the egress policy has
   been refusing `thetalusfieldjournal.com`, `api.thetalusfieldjournal.com`
   and `guide.thetalusfieldjournal.com`; the first run hit exactly this),
   fall back to repo-side parity: every reader of `GUIDE_PRICE_CENTS`,
   `GUIDE_RENEWAL_PRICE_CENTS` and `GUIDE_MONTHLY_CAP` agrees with
   `workers/wrangler.toml`. Say plainly in the ledger that the live Worker
   was not verified, and keep the environment allow-list (the domain list
   in `ROUTINES.md`) at the top of "Your court" until a run can reach the
   API: it is the one owner action that unblocks this gate, the photo
   pass, and every routine's primary sourcing at once.

## Phase 2 — Derive the revenue board (from the repo, never from memory)

This file will go stale; the repo will not. Rebuild the board every run:

1. **Fail-soft consts still empty?** Read them, do not assume:
   `affiliate.js` (`BOOKING_AFFILIATE_AID`, `STAY22_AFFILIATE_ID`,
   `HIPCAMP_AFFILIATE_BASE`, `EXPEDIA_BANNER.img/href`) and
   `page-consult.jsx` (`CONSULT_PAYMENT_LINK_URL`, `CONSULT_BOOKING_URL`).
   Every empty const is configured revenue waiting on an owner action
   (an application or a dashboard paste) — an owner-court ledger item, not a
   code item.
2. **Backlog state:** the status lines in `MONETIZATION-IDEAS.md` Parts 1–3,
   the §5 roadmap and §7 open questions of `CONVERSION-STRATEGY.md`, and the
   `LAUNCH-READINESS.md` gate. Verify a "shipped" claim against the code
   before repeating it (e.g. the renewal sweep lives in
   `workers/src/lib/renewals.ts`; gift purchases and B2B code packs do not
   exist until the code says so).
3. **What moved since last run:** merged PRs and the ledger's own history.
4. **Measurement reality:** this environment holds no GA4, Search Console,
   Stripe, or Buttondown credentials. Numbers exist only when the owner
   pastes them into the ledger. Standing measurement asks (sessions, list
   size, tag counts, checkout and renewal volume, affiliate EPC) live in the
   ledger and are re-asked **at most monthly** — nagging is noise.

## Phase 3 — Pick exactly one

Score eligible items by expected revenue impact × confidence ÷ effort, with
the tie-break toward items that unblock other items. Eligible means:
code-side in this repo, small or medium effort, inside every hard rule
below, and not already owned by an open PR or a pending intel-brief option.

Default priority when the owner has not steered otherwise:

1. A sale-path fix (from Phase 1).
2. Finish what is in flight (`MONETIZATION-IDEAS.md` Part 1: launch-ops
   gaps, the photo pass, launch-sequence support).
3. Guide revenue depth that is code-side (Part 2: renewal UX, gift
   purchases, the B2B redemption path — never the pricing decisions).
4. Money-page and affiliate-placement work inside the guardrails
   (Part 3.1's remaining surfaces, placement plumbing, disclosure upkeep).
5. Capture and segmentation items from `CONVERSION-STRATEGY.md` §5 not yet
   shipped.

If nothing eligible clears the bar — **would this be worth an employee's
afternoon if employees cost money?** — ship nothing. The cheap no-op is a
first-class outcome, and a filler PR on the money path is worse than none.

## Phase 4 — Ship it

One branch `claude/revenue-pulse-<item>` cut from `origin/main`, one PR.
The repo's discipline binds everything:

- Editorial JSX → `npm --prefix scripts run compile`, the shared `?v=` bump,
  `run assets:stamp`; mirrors via `run seo` when the catalog is touched;
  `npm --prefix scripts run check` must pass entirely and
  `npm --prefix scripts run checks` must add no new errors (failures that
  reproduce on `origin/main` are pre-existing: note, do not chase).
- `apps/guide/` → build and lint pass; minimal diff, it is the paid product.
- `workers/` → typecheck passes, and the PR body states that the API Worker
  never auto-deploys, with the owner's manual deploy step.
- PR body: the item, the board reasoning (why this one, why now), the revenue
  mechanism expected, how it will be measured (the GA4 event or `aff_list`
  value that will show it, or the owner-court number to watch), and any
  numbered owner checklist for dashboard steps.
- A status line in `MONETIZATION-IDEAS.md` or `CONVERSION-STRATEGY.md`
  that the board found stale (the first run found renewals and gifts
  shipped and undocumented) may ride in the same PR: it is bookkeeping,
  not a second item.

Subscribe to the PR's activity and drive CI green. Never merge, never
approve, never push `main`, never force-push. Merging is what publishes and
it belongs to the owner.

## Phase 5 — The ledger

One standing issue, label `revenue-pulse`, titled "Revenue ledger" (create
the label and issue on the first run; reuse them forever). One comment per
run, four short sections:

- **Sale path** — one line: green, or what is broken and whose move it is.
- **Shipped** — the PR link, or "nothing this week" with the reason.
- **Your court** — the ranked owner queue, restating only items that changed
  or are new (the full queue gets restated monthly). Typical residents:
  empty affiliate IDs and their applications, the consult payment/booking
  links, banner creative, launch-ops gate items, pricing decisions,
  measurement numbers requested.
- **Next** — the item the next run intends to take, so a reply can veto it.

End the comment with the standard Claude Code attribution footer. If nothing
changed and nothing shipped, post no comment: silence is the no-op. Close the
ledger issue never; it is the owner's standing dashboard.

## Hard rules — trust is the revenue asset

- **Never change a price, cap, or promo code, and never touch Stripe,
  checkout, webhook, or auth code on this routine's own judgment.** Price
  experiments (`MONETIZATION-IDEAS.md` 2.5) are owner-initiated only.
  Payment-adjacent code changes are eligible only when the backlog item *is*
  that build (e.g. the gift-purchase flow), and the PR then carries the
  owner's dashboard checklist.
- **Nothing is asked for twice.** The homepage rail's one-of-each rule, the
  archive's one-ask rule, one guide pitch per page: adding a second ask
  anywhere is the regression the August 2026 redesign undid. No popups, no
  interstitials, no countdowns, no invented urgency; scarcity copy states
  only the real monthly cap and the real 18-month expiry.
- **The affiliate guardrail is published policy** (`/affiliate`): the best
  recommendation stays top, linkless, if unaffiliated. No placement that
  breaks it is eligible at any RPM, and no program's catalog ever shapes a
  recommendation.
- House voice on every reader-facing word: dry, declarative, no em-dashes,
  no exclamation marks.
- Never transact against production; every funnel check is render-and-config
  only.
- One PR per run, maximum. Never edit article bodies, `bulletin.json`, or
  anything another routine owns.
- New GA4 events or locations follow `ARCHITECTURE.md`'s inventory and never
  reuse a retired name.

## Failure modes

- **Online probes unreachable through the proxy** → run the battery offline,
  say so in the ledger comment, never invent a status.
- **GitHub tools unavailable** → the pushed branch is still the deliverable:
  put the ready-to-click PR URL and the full ledger comment text in the
  completion summary for manual posting. Degraded finish, not a failure.
- **Another session already took the item** (an open PR covers it) → next
  item on the board, or the no-op.

End every run with a short completion summary: sale-path status, what
shipped (PR link) or the no-op reason, and the ledger comment link.
