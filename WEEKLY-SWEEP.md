# The Weekly Sweep

The Sunday-morning health check for The Talus Field. A scheduled Claude Code task runs this every Sunday at 6:00 AM Pacific, before the Sunday letter goes out; it also works pasted into any session ("run the weekly sweep"). The goal: verify the site is healthy end to end, fix what is safe to fix behind one PR, and hand back a report short enough to read over coffee.

## The facts the sweep runs on

- **Repo**: goehringcory-lang/The-Talus-Field. Merges to `main` deploy the editorial site and the PWA; nothing else deploys anything.
- **Editorial site** https://thetalusfieldjournal.com — Cloudflare Worker `the-talus-field` (entry `edge/seo.js`, repo root uploaded as static assets). Auto-deploys on every merge to `main` via the git-connected Workers Build.
- **Field Guide PWA** https://guide.thetalusfieldjournal.com — Cloudflare Pages project `talus-field-guide` (`apps/guide/`), auto-deploys on merge to `main`. A **paid product**: $3.99 one-time, 18-month access. There is no free trial; `TALUS30` is the standing newsletter promo code (30 days of access via `POST /api/redeem`, redeemed on the PWA's `/redeem` page), configured in `PROMO_CODES` in `workers/wrangler.toml`. The old `talus-field-guide.pages.dev` host still resolving is **intentional** (magic links already sent), not a misconfiguration.
- **API** https://api.thetalusfieldjournal.com — Worker `talus-field-guide-api` (`workers/`). **Never auto-deploys**; it ships only by a manual `wrangler deploy` from `workers/`. A live value that disagrees with `workers/wrangler.toml` means the deploy is stale, never that the repo is wrong.
- **Email**: Buttondown sends the newsletter (custom sending domain); Resend sends transactional mail (access codes, magic links, trip links, the contact form).
- **Known failure mode** (recurred repeatedly in Aug 2026): production regresses to a stale Workers Build with no repo change. The signature: the newest articles 404 on the live site while older ones serve fine and every repo-side check passes. See "Things that have surprised past edits" in CLAUDE.md. The repo is not broken. Do not "fix" it.

## Fix policy — read before acting

1. All fixes go on this session's designated branch (if none was assigned, cut `weekly-sweep-YYYY-MM-DD` from `origin/main`), one PR, opened only when there is at least one fix. Never commit to `main`; merging is the owner's call, and a merge puts everything straight in front of readers.
2. The repo's discipline binds every fix. Generated files (`dist/`, `articles.json`, `sitemap.xml`, `feed.xml`, `llms.txt`, prerender fragments, the home shell, the `/archive` HTML) are never hand-edited: change the source (`data.js`, `seo-data.json`, `*.jsx`, `edge/seo.js`) and run the generators. Any JSX edit needs `npm --prefix scripts run compile` and a `?v=` bump in `index.html`. `npm --prefix scripts run check` must pass before committing; `ci.yml` enforces the same gate on the PR.
3. **Safe to fix without asking**: stale generated mirrors (regenerate them), missing or duplicate titles, descriptions, and og tags at the source (`seo-data.json`, `data.js`, the `known` tables in `edge/seo.js` and `app.jsx`), broken internal links, structured-data errors, a redirect for a genuinely moved slug (the `REDIRECTS` table in `edge/seo.js`), robots.txt corrections, and check-suite failures with obvious mechanical causes.
4. **Report only, never touch**: article bodies, headlines, deks, and any reader-visible copy or voice; `bulletin.json` content; anything priced or paid (`GUIDE_ON_SALE`, `GUIDE_PRICE_CENTS`, `PROMO_CODES`, Stripe, checkout, auth); everything under `workers/` (a fix there does nothing until a human deploys it); DNS; deleting pages; the newsletter itself.
5. **Stale deploy**: it cannot be redeployed from here. Report it as the top-line item, note that any merge to `main` (including this sweep's own PR) re-triggers the Workers Build and clears the symptom, and point the owner at the Workers Build deploy history in the Cloudflare dashboard for what rolled the version back.
6. PRs in this repo merge fast, sometimes while a session is still pushing. Check the PR's state before pushing more commits; never stack commits on a merged PR (`stranded-commits.yml` backstops this).
7. **Never transact against production**: no newsletter form submissions, no checkout sessions, no promo-code redemptions, no contact-form posts. Every funnel check is render-and-config only.

## Phase 0 — Setup

`cd scripts && npm install`, and `cd apps/guide && npm install` (the guard suite's last step runs there). Work from a clean checkout of `origin/main`.

## Phase 1 — Deploy integrity (always first)

1. **Editorial staleness probe**: take the three newest slugs in `window.ARTICLES` (`data.js`, by date) and fetch `https://thetalusfieldjournal.com/articles/<slug>` for each; any 404 is the known failure signature. Then diff live `/articles.json` and `/sitemap.xml` against `git show origin/main:articles.json` and `origin/main:sitemap.xml`.
2. **PWA**: `https://guide.thetalusfieldjournal.com` returns 200 and serves the app shell.
3. **API staleness** is covered by the battery in Phase 2 (`checks/api.mjs` diffs `/api/inventory` against `[vars]` in `workers/wrangler.toml`). Its errors are sale-breaking: top-line.

## Phase 2 — The repo's own battery

1. `npm --prefix scripts run check` — the offline guard gate. Green on `main`, or top-line.
2. `npm --prefix scripts run checks:online` — the full battery (links, per-page SEO, og:image, JSON-LD, sitemap, feed, image hygiene, mirror freshness, template smoke, SPF/DKIM/DMARC, API probes). **Errors** are sale- or integrity-breaking by design: fix per policy or report top-line. **Warnings** are judgment calls: fix the cheap ones, report the rest. Read findings against `scripts/data/baseline-report.md`; new ones matter more than standing ones.

## Phase 3 — CI and automation health

Via the GitHub tools (a scheduled run that finds itself without them should say so in the report and skip what it cannot check, not stall):

1. `system-checks.yml` (nightly, 09:17 UTC): all green this week? A red nightly is the site's stale-deploy alarm; read its log and report artifact before anything else.
2. `ci.yml` green on `main`.
3. `indexnow.yml` ran and succeeded for any content push this week.
4. `photo-import.yml` / `stranded-commits.yml`: only worth a line if they ran and failed.
5. Open PRs older than 7 days, including last week's sweep PR if it is still open — do not re-fix what it already fixes.

## Phase 4 — Editorial deadlines (report-only)

1. **Bulletin edition**: read `edition.start`/`edition.end` in `bulletin.json`. Lapsed, or ending within the coming week → flag it: the ~5-weekly rewrite is due, together with the same-cadence re-curation of `workers/src/data/manual-programs.ts` (its `GUIDE_START`/`GUIDE_END` and the per-program symbols). Carrying a stale edition without a note is a standing-commitment breach, so a lapsed edition outranks everything except a broken sale. The Thursday "Bulletin edition turn" Routine (`.claude/skills/bulletin-edition/SKILL.md`) owns doing the rewrite; this flag is the backstop for that routine failing or being paused.
2. The battery's warning about an empty `/api/programs` fortnight is the same deadline seen from the other side.

## Phase 5 — Performance trend

Read `scripts/data/lighthouse-history.json` (the nightly writes it; do not run Lighthouse again). Report the week's trajectory for the tracked pages. Flag only: a score drop of more than 10 points sustained across nights, LCP over 2.5 s, or CLS over 0.1. Do not chase single-night noise, and remember the homepage's LCP element is the dek text, not the hero photo — image preloads are not the fix.

## Phase 6 — Funnel spot checks (render and config only)

1. **Newsletter**: the homepage rail's signup form renders and its action points at the Buttondown endpoint. Never submit it.
2. **Guide buy box**: `/guide` renders the buy box, and `/api/inventory` returns 200 with `priceCents` matching `GUIDE_PRICE_CENTS` (parity and CORS are Phase 2 errors if broken). Never start a checkout.
3. **Promo door**: the PWA's `/redeem` page loads, and `PROMO_CODES` in the repo still carries `TALUS30:30`. Never redeem a code.
4. **Email DNS** (SPF/DKIM/DMARC) is the battery's `email-auth` module. DNS is always report-only.

If a render check needs a real browser, the repo's `verify` skill drives headless Chromium.

## Phase 7 — Growth inputs (report-only)

1. Web-search "The Talus Field" plus this week's article topics: new mentions, backlinks, or scrapers worth knowing about.
2. For each article published this week, suggest 2–3 internal links from older relevant pieces. Suggestions only: adding a link edits a body, and bodies are the owner's.
3. **Archive pick**: one *Yosemite Nature Notes* issue from `/archive` that is seasonally relevant to the coming week in the park (blooming, migrating, melting, arriving), with its real `/archive/<year>/vol-…` URL, as an adaptation candidate.

## The report

The final message of the sweep session, shortest first, under 40 lines total:

1. **Verdict (2 lines max)**: "Safe to send the Sunday letter" or "Fix X first." Note the PR if one is waiting.
2. **Fixed**: what is in the PR, with the link.
3. **Needs your decision**: everything report-only that deserves an answer.
4. **Health snapshot**: one line each — deploy parity, battery errors/warnings vs baseline, nightly CI, Lighthouse trend, bulletin days remaining.
5. **Content**: the archive pick, plus any mentions or link suggestions.

If everything is clean, the report is the verdict, the snapshot, and the archive pick. Nothing else.

## Not in this sweep (yet)

Google Search Console (query data, CTR-driven title work, coverage errors) needs API credentials this environment does not hold, so nothing here pretends to see it. If that data should drive the sweep, wire a GSC credential into the task's environment and add the phase back.

Keep this file honest: when the site changes shape (a new deployable, a retired route, a new check), update the sweep the same way CLAUDE.md gets updated.
