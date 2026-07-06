# The Talus Field

A Yosemite editorial site and field guide product, kept by a resident.

## Subsystems

The repo holds three co-located subsystems so a single change (brand rename, copy update, shared style) can touch all three at once.

| Path | What it is | Stack |
|---|---|---|
| repo root (`*.jsx`, `index.html`, `styles.css`, `bodies/`, `img/`) | Editorial site at `thetalusfieldjournal.com`. Static, no bundler. | Vanilla React, `*.jsx` precompiled into `/dist/*.js` by `scripts/gen-compiled.mjs`; hand-written CSS in `styles.css`; edge SEO via the root Worker entry `edge/seo.js`. |
| `apps/guide/` | Field Guide PWA at `talus-field-guide.pages.dev` (custom domain unattached until launch). Buyer-only, offline-capable. | Vite + React 19 + TypeScript + react-router-dom + zod. |
| `workers/` | API at `api.thetalusfieldjournal.com`. Auth, Stripe checkout/webhook, KV-backed buyer records. | Cloudflare Worker + Hono + `@tsndr/cloudflare-worker-jwt` + KV. |

## Quick start

Local dev hosts:

```bash
# Editorial site, port 8765
python -m http.server 8765

# PWA, port 5173
npm --prefix apps/guide run dev

# Worker, local dev
cd workers && npm run dev
```

Build and typecheck:

```bash
npm --prefix apps/guide run build       # tsc -b && vite build
npm --prefix apps/guide run lint
npm --prefix workers run typecheck      # tsc --noEmit
```

The editorial site has no build step, no test suite, and no linter. Runtime errors surface in the browser only.

## More docs

- `CLAUDE.md` is the orientation document for working in this repo, including conventions, gotchas, and architectural notes.
- `DEPLOY.md` is the end-to-end deployment runbook for Cloudflare Pages and Workers.
