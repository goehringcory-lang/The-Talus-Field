# The Talus Field

A Yosemite editorial site and field guide product, kept by a resident.

## Subsystems

The repo holds three co-located subsystems so a single change (brand rename, copy update, shared style) can touch all three at once.

| Path | What it is | Stack |
|---|---|---|
| repo root (`*.jsx`, `index.html`, `styles.css`, `bodies/`, `img/`) | Editorial site at `thetalusfieldjournal.com`: articles, the trip-planner map, the Park Bulletin, the lodging board, reference pages, and the Nature Notes archive. Static, no bundler. | Vanilla React, `*.jsx` precompiled into `/dist/*.js` by `scripts/gen-compiled.mjs`; hand-written CSS in `styles.css`; edge SEO via the root Worker entry `edge/seo.js`. |
| `apps/guide/` | Field Guide PWA at `guide.thetalusfieldjournal.com` (the `talus-field-guide.pages.dev` host keeps resolving alongside it). Paid ($3.99 one-time, 18 months of access), account-gated, offline-capable. | Vite + React 19 + TypeScript + react-router-dom + zod. |
| `workers/` | API at `api.thetalusfieldjournal.com`. Auth, Stripe checkout/webhook, KV-backed buyer records, live park feeds (weather, entrance waits, parking, alerts, air, river flow, programs), the contact and trip-email forms, web push, and the nightly road watch. | Cloudflare Worker + Hono + `@tsndr/cloudflare-worker-jwt` + KV. |

## Quick start

Local dev hosts:

```bash
# Editorial site, port 8765 (.claude/launch.json uses 8766)
python -m http.server 8765

# PWA, port 5173
npm --prefix apps/guide run dev

# Worker, local dev
cd workers && npm run dev
```

Build, typecheck and test:

```bash
npm --prefix apps/guide run build       # tsc -b && vite build
npm --prefix apps/guide run lint
npm --prefix apps/guide test            # vitest
npm --prefix workers run typecheck      # tsc --noEmit
```

The editorial site has no bundler, but it does have a compile step: the root
`*.jsx` files are precompiled into `/dist/*.js`, which is what the browser
loads. Its tooling lives in `scripts/` (run `cd scripts && npm install` once):

```bash
npm --prefix scripts run compile        # after editing any root or bodies/ jsx
npm --prefix scripts run seo            # regenerate the SEO mirrors after a catalog change
npm --prefix scripts run check          # the pre-commit gate (CI runs it on every PR)
npm --prefix scripts run checks         # the offline health battery
```

There is no test suite or typecheck for the editorial site; runtime errors
surface in the browser, which is what the `verify` skill in
`.claude/skills/verify/` drives.

## More docs

- `CLAUDE.md` is the orientation document for working in this repo, including conventions, gotchas, and architectural notes.
- `DEPLOY.md` is the end-to-end deployment runbook for Cloudflare Pages and Workers.
- `ARCHITECTURE.md` inventories the editorial site's `window.*` globals, GA4 events and localStorage keys.
- `DESIGN-ROLLOUT.md` records the September 2026 design system and which pages are built on it.
- `SEO.md` is the indexing runbook and the article publishing checklist.
- `ROUTINES.md` is the owner's manual for the scheduled agent fleet; each routine's runbook is under `.claude/skills/`.
- `apps/guide/CLAUDE.md` and `workers/CLAUDE.md` cover the PWA and the API in depth.
