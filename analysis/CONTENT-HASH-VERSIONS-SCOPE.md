# Scope: per-file content hashes instead of the shared `?v=` counter

October 14, 2026. Status: **scoped, not built.** Branch `content-hash-versions`.

Prompted by Anthropic's "Redesigning source control" (engineering blog), whose
central scaling lesson is that a piece of global state every change must update
stops working once there are many concurrent writers, and that derived data
should be keyed by content so it never goes stale. This repo has exactly one
such piece of state, and the routine fleet writes to it on almost every PR.

## The problem, measured

Every editorial PR bumps one shared integer (`?v=454` today) on every eager
`<script>` and the stylesheet in `index.html`, and `assets:stamp` then rewrites
the `"v"` field of 55 entries in `scripts/data/asset-versions.json`. So two PRs
that touch **unrelated** files still edit the same lines, and the second one
to merge always conflicts. There is also a race: both PRs pick `N+1`, and the
loser has to re-bump "over main's".

From the last 150 merged PRs (September 1 to October 14, 2026):

| | Count |
|---|---|
| PRs that touched `index.html` or `asset-versions.json` | 100 of 150 |
| PR pairs open at the same time | 51 |
| ... where both touched the hotspot | 20 |
| ... of those 20, pairs that shared no versioned asset at all | **9** (pure counter collisions) |
| ... of those 20, pairs that shared a real asset (`data.js`, `styles.css`, `dist/components.js`, ...) | 11 |

The repair commits are in the history: #548 ("rebump the shared ?v= to 423
and restamp", then again "rebump shared ?v= to 426"), #524 (twice, 400 then
401), #546, #555 ("430 over main's 429"), #562. `index.html` and
`asset-versions.json` were each touched by 120 commits since September 14,
more than any other file in the repo.

## The change

Version each asset by its own bytes. The `?v=` value becomes the first 10 hex
characters of the file's SHA-256, written by a generator, never by hand.

1. **Eager tags in `index.html`** carry their own hash:
   `<script src="/dist/app.js?v=3f9a1c02be" defer></script>`. The eight tags
   and the stylesheet link get a **blank line between each**, because git
   conflicts on changes to adjacent lines and merges cleanly when one
   unchanged line sits between them (verified in a scratch repo, both cases).
2. **Lazy bundles** (`PAGE_MODULES`, today injected with the shared number
   read off the app.js tag) read their hash from a generated, non-executing
   data block in `index.html`:
   ```html
   <!-- GENERATED:ASSET-HASHES (gen-asset-hashes.mjs; do not hand-edit) -->
   <script type="application/json" id="asset-hashes">{
   "/dist/intent.js": "a1b2c3d4e5",

   "/dist/page-about.js": "0f1e2d3c4b",

   ...
   }</script>
   <!-- /GENERATED:ASSET-HASHES -->
   ```
   Blank-line separated for the same reason. `app.jsx` replaces
   `ASSET_VERSION` with a lookup (`ASSET_HASHES[src]`, falling back to no
   query if the block is missing, which still works under the 300s TTL).
   `type="application/json"` is not executed, so it needs nothing from the
   CSP. `dist/app.js` holds no hashes, so editing a page bundle does not
   change app.js's own hash (no cascade, no cycle).
3. **A generator replaces both guards**: `scripts/gen-asset-hashes.mjs`, with
   `--check` in `run check` like `home-shell` and `compile`. It reuses the
   collection logic already in `check-asset-freshness.mjs` (index.html tags,
   the `PAGE_MODULES` parse, the counters) and writes hashes instead of
   comparing integers.
   - `check-asset-freshness.mjs` and `scripts/data/asset-versions.json` are
     **deleted**. The guard they implemented ("bytes moved, version did not")
     cannot fail any more: the version *is* the bytes, and `--check` fails if
     the written hash disagrees with the file, which is the same assertion.
   - `check-cache-busters.sh` loses its "one canonical number" block and keeps
     the presence check and the `BODY_VERSIONS` sync check (until phase 2).
   - `npm run assets:stamp` stays as an alias of the generator, so the ten
     runbooks that say "bump, then stamp" keep working while they are edited.
   - Ordering: it runs after `compile` and `home-shell` (it hashes `dist/`
     output, and `home-shell` rewrites `index.html`).

What the workflow becomes: edit, `run compile`, `run assets:stamp`, commit.
No number to choose, nothing to bump, nothing to race for.

## Phases

**Phase 1 (the change above).** Shared counter gone. Eliminates the 9 pure
collisions outright. For the 11 that shared a real asset, the hash line still
conflicts, but now only when the source genuinely changed on both sides, and
the resolution is always the same: take main's source, rerun the generator.

**Phase 2 (optional, one decision).** Fold the other hand-kept counters into
the same table:
- `window.BODY_VERSIONS` in `data.js` (84 per-slug integers, 582 changed
  lines in `data.js` since September 14) moves into the JSON block, and
  `loadArticleBody` reads it there. That stops a body edit from touching
  `data.js` at all, which removes a second hotspot. Cost: about 84 more
  entries in every HTML response (roughly 2 KB gzipped, since hashes compress
  poorly). The alternative is to keep `BODY_VERSIONS` in `data.js` and let the
  generator write hashes into it, which costs no bytes but keeps `data.js` hot.
- `POINTS_URL` (itineraries-data.js) and the two bulletin consts
  (`BULLETIN_URL`, `TIOGA_BULLETIN_URL`) read from the table too, which
  retires the "both bulletin readers must agree" check, since one table
  cannot disagree with itself.
- The `/img/` counter (mark plus favicons, `?v=2`) also moves to hashes. It
  is the longest-lived staleness risk (30-day immutable), and the masthead
  `<img>` is also baked in `components.jsx`, `gen-home-shell.mjs` output and
  the archive template, so it needs the generator to rewrite those too, or
  stay a manual counter. Recommend leaving it manual: it changed once all year.

**Phase 3 (pairs with this, separate PR).** A small Action that, when a PR
turns `CONFLICTING` and every conflicted path is generated (the hash block,
`dist/`, `articles.json`, `sitemap-articles.xml`, `feed.xml`, `llms*.txt`,
`prerender/`), merges main, reruns the generators, and pushes. It handles the
residual 11 and the SEO mirrors in one place. It must refuse when any
hand-written file conflicts.

**Bonus, after phase 1 is stable.** With every `/dist/*` request carrying a
true content hash, `_headers` could serve `/dist/*` `immutable` for a year
instead of `max-age=300`, saving revalidation round trips on repeat visits.
Only safe if nothing requests `/dist/*` without a hash (the archive pages and
the prerender fragments do not load scripts; confirm before flipping).

## Not chosen: hashing at deploy time

The cleanest version commits no hashes at all: the Workers Build computes
them and rewrites `index.html` on deploy, so there is never a hash line to
conflict on. That requires a real root build step, which CLAUDE.md forbids
("the root stays a static, build-free deploy"), and `/` is served straight off
the asset layer, so the Worker cannot rewrite it at request time either. It is
the owner's call; this scope assumes the rule stands.

## Files touched (phase 1)

| File | Change |
|---|---|
| `scripts/gen-asset-hashes.mjs` | new: generator + `--check` |
| `scripts/check-asset-freshness.mjs`, `scripts/data/asset-versions.json` | deleted |
| `scripts/check-cache-busters.sh` | drop the shared-number block |
| `scripts/package.json` | `assets:stamp` alias, swap the guard in `check` |
| `index.html` | hashes on 9 tags, blank-line spacing, the JSON block |
| `app.jsx` (+ `dist/app.js`) | `ASSET_VERSION` becomes a table lookup |
| `CLAUDE.md` | rewrite the "Cache-buster discipline" bullet |
| `ARCHITECTURE.md`, `SEO.md`, `.claude/rules/map-trips.md`, `.claude/rules/bulletin.md` | bump wording |
| 8 runbooks under `.claude/skills/` (trend, evergreen, season pre-flight, revenue pulse, reference refresh, monthly edition, intel executor, bulletin edition) | "bump the shared ?v=" steps become "run assets:stamp" |

Old audits (`CODE-AUDIT-2026-08`, `MOBILE-AUDIT`, `ACCESSIBILITY-AUDIT`)
mention the counter historically and are left as they are.

## Risks

- **A runbook keeps bumping a number that no longer exists.** The `--check`
  fails on a hand-edited hash, so the PR goes red instead of shipping wrong;
  the runbook edits land in the same PR.
- **The first deploy invalidates every cached asset once.** Same cost as any
  shared bump today.
- **A stale `index.html` in a browser** asks for old hashes, which still
  resolve (the query string is ignored by the asset layer) and serve the
  current file. That is today's behavior too.
- **`--check` must hash the committed `dist/` output**, not a fresh compile,
  or it would pass a PR whose `dist/` was not regenerated. `gen-compiled
  --check` already guards that, and runs first.

## Verification for the build

- `npm --prefix scripts run check` and `run checks` green.
- Scratch-repo test in CI or by hand: two branches editing different page
  bundles merge with no conflict.
- `/verify` on `/`, an article (lazy body), `/map` (points.geojson), `/now`:
  every injected request carries a 10-hex `?v=` and returns 200.
