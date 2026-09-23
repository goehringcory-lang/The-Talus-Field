---
name: dependency-check
description: The dependency and security check — on the 1st of each month, audit the three npm packages (apps/guide, workers, scripts) and the GitHub Actions the workflows pin: triage every security advisory for whether it reaches code this repo actually runs, record the verdict in scripts/data/dependency-triage.json, apply the fixes and safe in-range updates, run each package's gates, and open one PR (flagged [api] with the owner's wrangler deploy step when workers/ changed). Run by the "Dependency and security check" Routine (1st of each month, early morning Pacific) in a fresh session; also runnable by hand when asked to "run the dependency check".
---

# The dependency and security check

The Field Guide sells behind a login and the API Worker holds the checkout,
the Stripe webhook, and the buyer records, so a vulnerable dependency here
is a product risk, not a lint warning. Nothing else watches the packages:
the repo has no Dependabot configuration, and a routine can do what an
alert cannot, which is read the advisory, find out whether the vulnerable
function is one this code calls, and prove the fix against the repo's own
gates. **One PR a month, every verdict written down with its evidence.**

## Territory

- **This lane:** `package.json` and `package-lock.json` in `apps/guide/`,
  `workers/`, and `scripts/`; the `uses:` versions and `node-version` in
  `.github/workflows/*.yml`; `scripts/data/dependency-triage.json`; and the
  smallest source change a bump strictly requires (a renamed import, a
  changed type), nothing more.
- **Report only, never changed here:** the React UMD builds in `vendor/`
  (the editorial site's React; a version change there is a design-scale
  change), the root `package.json` (a build shim that must stay
  dependency-free; `CLAUDE.md`, Common commands), the Node pin in
  `apps/guide/.nvmrc` and the Cloudflare build settings (the owner's), and
  the Dependabot and repository settings.
- Everything else belongs to the other routines. A bump that would need a
  behaviour change anywhere (an API the app uses was removed, a default
  changed) is a Flag with a migration note, not a code change.

## Phase 0 — Preflight

1. Work in the repo clone (clone `goehringcory-lang/The-Talus-Field` if
   absent). Read `CLAUDE.md`, the "Service worker" and "Nothing in the build
   may read the clock" bullets in `apps/guide/CLAUDE.md`, and
   `workers/CLAUDE.md`.
2. `npm ci` in `apps/guide`, `workers`, and `scripts`.
3. Dedupe: an open `claude/dependency-check-` PR from last month is driven
   green first, and nothing it already changes is changed again.

## Phase 1 — Inventory

For each of `apps/guide`, `workers`, `scripts`:

```bash
npm audit --json            # every advisory, production and dev
npm audit --omit=dev --json # the ones that ship
npm outdated --json         # what is behind, within and beyond each range
```

Then the workflows: every `uses:` line and `node-version` in
`.github/workflows/`, against each action's current major release, and the
annotations on the latest runs of `ci.yml` and `system-checks.yml` (the
GitHub tools read them), where GitHub announces a runtime deprecation
before it becomes a failure.

## Phase 2 — Triage every advisory

For each advisory not already settled in `dependency-triage.json` (a
settled `does-not-apply` is re-opened when the package, its installed
version, or the code that calls it changed):

1. Read the advisory itself (the GHSA page it links): the affected
   versions, and the function, option, or code path it is about.
2. Find whether this repo reaches that path: grep the package's imports
   and the calls into it, and read the call sites. A server-mode advisory in
   a package the PWA uses only in the browser, or an advisory in a helper
   the Worker never imports, does not apply; say which file proves it.
3. Record the verdict (`applies`, `does-not-apply`, or `unclear`) with that
   evidence, the installed version, and today's date. `unclear` is treated
   as `applies` for the fix decision.

Production advisories that apply come first; dev-only advisories matter
when they touch a build step that writes shipped files.

## Phase 3 — Update

- **An advisory that applies**: the smallest update that fixes it within
  the package's current major. If the fix needs a new major, do not bump:
  put it at the top of the PR body with the migration it requires.
- **In-range updates**: patch and minor releases of direct dependencies,
  when the release notes show nothing that changes behaviour this code
  depends on. Majors are listed with a one-line note, never applied.
- **Actions**: move a pinned action to its current major when the release
  notes show the repo's usage is unchanged by it.
- Keep lockfiles honest: `npm install <pkg>@<version>` or `npm update
  <pkg>`, never a hand edit, and never `npm audit fix --force`.

## Phase 4 — Verify

```bash
cd apps/guide && npm run build && npm run check:build && npm run lint && npm test
cd workers && npm run typecheck && npm run test:flow && npm run build   # build is a wrangler dry run; nothing deploys
npm --prefix scripts run check     # must pass entirely
npm --prefix scripts run checks    # no NEW errors vs origin/main
```

`check:build` builds the PWA twice and demands identical output, which is
what catches a dependency that reads the clock or bakes a timestamp into
the service worker. A gate that fails because of a bump means that bump
comes out of the PR and goes under Flags; the rest ships.

## Phase 5 — Ship

Branch `claude/dependency-check-<YYYY-MM>` from `origin/main`; commit the
lockfiles, manifests, workflow edits, and the triage file together; `git
push -u origin <branch>`. PR title `[deps] <month> dependency check`, with
`[api]` in front when anything under `workers/` changed. PR body, in order:

- **Advisories**: one row each, with the verdict, the evidence, and the
  fix or the reason for none.
- **Updates**: package, from, to, and why it is safe.
- **Held back**: majors and failed bumps, each with what it would take.
- **Deploy**: when `workers/` changed, the owner's step, `cd workers && npx
  wrangler deploy`, because the API Worker never deploys on merge.
- **Gates**: each command above and its result.

Subscribe to PR activity and drive CI green. **Never merge.** A month with
no advisory, no safe update, and no change to the triage file ships no PR;
the summary says so. Completion summary: the advisories and their verdicts,
the updates, the PR link, and what was held back.

## Hard rules

- A verdict without evidence is not a verdict: every `does-not-apply` names
  the file that proves it.
- No major version bump, no `--force`, no hand-edited lockfile.
- Never touch `vendor/`, the root `package.json`, the Node pin, or the
  Cloudflare and repository settings; report them.
- Never deploy, never push to `main`, never merge or approve, never
  force-push.

## Failure modes

- **`npm audit` cannot reach the registry** → retry once; a CONNECT 403
  from the agent proxy means the environment's network policy regressed:
  say so and ship nothing.
- **An advisory that applies has no fixed release yet** → record it as
  `applies`, describe the exposure and any mitigation in the PR body, and
  keep it at the top of every run's summary until a fix exists.
- **A gate fails on `origin/main` too** → pre-existing; note it and
  continue.
