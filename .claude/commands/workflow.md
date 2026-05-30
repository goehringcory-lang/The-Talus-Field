---
description: Audit the repo for code quality, security, performance, dependencies, accessibility, and best practices, then write a prioritized report.
argument-hint: "[optional: subsystem to focus on — site | guide | workers | all]"
---

# Repository audit

Run a thorough, read-only audit of this repository and produce a single
prioritized report. Do **not** change application code as part of this command —
the deliverable is the report.

Scope: `$ARGUMENTS` if provided (one of `site`, `guide`, `workers`, `all`).
Default to `all` when no argument is given.

## Repo shape (for orientation)

Three co-located subsystems — audit each against the right standards:

| Area | Path | Stack | Notes |
|---|---|---|---|
| Editorial site | repo root `*.jsx`, `index.html`, `styles.css`, `bodies/`, `img/` | Vanilla React via in-browser Babel CDN, hand-written CSS, **no build/lint/tests** | Cache-buster discipline: every edited JSX/CSS file needs a bumped `?v=N` in `index.html` |
| Field Guide PWA | `apps/guide/` | Vite + React 19 + TS + react-router + tailwind 4 + zod | `npm --prefix apps/guide run build` / `run lint` |
| API | `workers/` | Cloudflare Worker + Hono + JWT + KV | `npm --prefix workers run typecheck` |

## What to check

Work through these dimensions. Use search and the build/lint/typecheck commands
above; read source where a finding needs confirmation. Prefer parallel
read-only exploration (e.g. dispatch `Explore` agents per subsystem).

1. **Security** — auth/JWT handling (`workers/`, `apps/guide/src/auth/`), secret
   handling and anything that looks like a leaked credential, CORS allow-list,
   input validation (zod usage), the Stripe webhook + IndexNow bearer-gated
   routes, `localStorage` token storage, XSS surface in the editorial JSX
   (`dangerouslySetInnerHTML`, unescaped content). Run a dependency
   vulnerability pass (`npm audit` in `apps/guide` and `workers`).
2. **Broken / outdated dependencies** — `npm audit`, obviously stale or
   unused deps, version mismatches, missing lockfile entries, CDN-pinned
   versions in `index.html` that are stale.
3. **Code quality** — run `run lint` (guide) and `run typecheck` (guide +
   workers) and report real findings; dead code, duplication, the
   pre-Stripe-relaunch scaffolding that's intentionally retained (note it,
   don't flag it for deletion — see CLAUDE.md), `// TODO: verify` coord markers.
4. **Performance** — bundle/asset weight, the in-browser Babel transform cost
   on the editorial site, missing image dimensions/lazy-loading, service-worker
   cache strategy (`apps/guide/public/sw.js`), unnecessary re-renders.
5. **Accessibility** — alt text on images, heading order, color contrast in
   `styles.css`, focus management and keyboard nav in the PWA, form labels,
   `aria-*` usage, landmark structure.
6. **Best practices / conventions** — adherence to the rules in `CLAUDE.md`
   (cache-buster discipline — run `bash scripts/check-cache-busters.sh`; brand
   voice "The Talus Field", no em-dashes/exclamation marks; `window` globals
   pattern), error handling, logging, and consistency across subsystems.

## Report format

Write the report to `audit-report.md` at the repo root (overwrite if present)
**and** summarize the top findings in your reply.

Structure it as:

- **Summary** — one paragraph + a count of findings by severity.
- **Findings table** — columns: Priority (`P0`/`P1`/`P2`/`P3`), Area, Subsystem,
  Finding, `file:line`, Recommendation.
  - `P0` = security hole / data loss / broken build.
  - `P1` = real bug or notable risk.
  - `P2` = quality / perf / a11y improvement.
  - `P3` = nit / style / nice-to-have.
- **Per-dimension detail** — a short section for each of the six dimensions
  above with the reasoning behind the findings.
- **Quick wins** — the handful of high-value, low-effort fixes worth doing first.

Cite concrete `file:line` references for every finding so they're actionable.
Be honest about what you could not verify (e.g. coords, deploy-time secrets).
Do not fix anything unless I explicitly ask in a follow-up.
