import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// NOTHING IN THIS FILE MAY READ THE CLOCK. The Pages project rebuilds on every
// push to main, including commits that touch nothing in this app (the nightly
// Lighthouse chore commit is the usual one), so anything wall-clock that
// reaches the emitted bundle or sw.js turns a no-op redeploy into a real
// update: a fresh app shell and an "Updated. Tap to refresh." bar, daily, for
// an offline-first product whose buyers are on park LTE. Both used to happen —
// an ISO timestamp in the SW cache name and the build date `define`d into two
// hashed chunks. `scripts/check-build-determinism.mjs` guards it now.

// The "Last updated" stamp on Home and the build line on /account. The date of
// the last commit that actually changed apps/guide is the honest answer to
// "when was this guide last revised" (a wall-clock date claimed a revision on
// every nightly rebuild) and it is stable across no-op rebuilds. Falls back to
// today when git has no answer — no .git at all, or a shallow clone whose HEAD
// does not touch this path — which is inaccurate but no longer expensive, since
// the stamp rides in index.html rather than in a hashed chunk.
function guideBuildDate(): string {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', '.'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out
  } catch { /* no git in the build image, or a clone too shallow to answer */ }
  return new Date().toISOString().slice(0, 10)
}

// The stamp goes into index.html, NOT into the bundle via `define`. Baked into
// the bundle it landed in the main chunk and the Account chunk, so a rebuild on
// a new calendar day changed their content hashes, which changed the SW's
// BUILD_ASSETS list, which changed sw.js — every buyer re-downloading ~500 kB
// of byte-identical app because the date on a footer had ticked over.
// index.html is unhashed, revalidated on every load, and re-cached by the SW's
// network-first navigation handler, so a stamp that moves there costs nothing.
function stampBuildDate(date: string): Plugin {
  return {
    name: 'tfg-stamp-build-date',
    transformIndexHtml() {
      return [
        { tag: 'meta', attrs: { name: 'tfg-build-date', content: date }, injectTo: 'head' },
      ]
    },
  }
}

// Stamp dist/sw.js: __BUILD_VERSION__ becomes the cache-name version,
// __API_BASE__ the Worker origin the push handler calls, __TRACKS_VERSION__
// the ?v= hash on track URLs (so activate can purge superseded track files
// from the unversioned runtime cache), and the __BUILD_ASSETS__ placeholder
// array becomes the list of hashed JS/CSS chunks so the SW precaches them (an
// update that first runs offline would otherwise white-screen — index.html
// cached, its scripts not).
// The SW lives in public/ (must be served at /sw.js for scope) so we can't
// import constants — we string-replace the emitted file instead.
//
// The version is a hash of what actually shipped: the SW template, the API
// base baked into it, and the sorted list of content-hashed asset filenames.
// That is exactly the "did anything change" question the browser is asking
// when it byte-compares sw.js on every update() call. A real change (app code,
// CSS, the SW itself) moves an asset hash or the template and fires the update
// banner, same-day hotfixes included — which is what the old ISO timestamp was
// reaching for. A rebuild of unchanged source produces the same bytes and the
// browser correctly sees no update at all.
//
// index.html is deliberately NOT hashed in: it carries the build-date meta
// above, and its freshness never depended on the shell version anyway (the
// navigation handler is network-first and re-caches it on every online load).
//
// apiBase comes from loadEnv, NOT process.env: VITE_API_BASE lives in
// .env.production, which Vite exposes on import.meta.env only. Reading
// process.env here silently baked localhost into the production service
// worker, and the failure was invisible — every push fell back to the generic
// notification because the SW was asking a dev host what it was about.
// The tracks hash is read off the generated module's source rather than
// imported: the config runs under Node, and a regex over one line is a
// smaller dependency than loading the TypeScript. Deterministic by
// construction (file content, never the clock). Fails loudly if the line
// moves, because an unstamped placeholder would silently disable the purge.
async function tracksVersion(): Promise<string> {
  const source = await readFile(resolve('src/content/trails.generated.ts'), 'utf8')
  const match = source.match(/^export const TRACKS_VERSION = '([0-9a-f]+)'$/m)
  if (!match) throw new Error('TRACKS_VERSION not found in src/content/trails.generated.ts')
  return match[1]
}

function stampServiceWorker(apiBase: string): Plugin {
  return {
    name: 'tfg-stamp-sw',
    apply: 'build',
    async closeBundle() {
      const tracks = await tracksVersion()
      // Sorted: readdir order is filesystem-dependent, and this list is both
      // baked into the SW and hashed into its version.
      const assets = (await readdir(resolve('dist/assets')))
        .sort()
        .map((f) => `/assets/${f}`)
      const swPath = resolve('dist/sw.js')
      const source = await readFile(swPath, 'utf8')
      const version = createHash('sha256')
        .update(source)
        .update('\0')
        .update(apiBase)
        .update('\0')
        .update(assets.join('\n'))
        .update('\0')
        .update(tracks)
        .digest('hex')
        .slice(0, 16)
      await writeFile(
        swPath,
        source
          .replaceAll('__BUILD_VERSION__', version)
          .replaceAll('__API_BASE__', apiBase)
          .replaceAll('__TRACKS_VERSION__', tracks)
          .replace('/* __BUILD_ASSETS__ */ []', JSON.stringify(assets)),
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  // '' prefix: load every var, not just VITE_-prefixed ones, so this keeps
  // working if the API base is ever supplied unprefixed by the CI environment.
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = env.VITE_API_BASE ?? 'http://localhost:8787'
  return {
    plugins: [react(), stampBuildDate(guideBuildDate()), stampServiceWorker(apiBase)],
    build: {
      rollupOptions: {
        output: {
          // Pin the framework into its own chunk: /assets/* is served immutable
          // and the SW re-precaches the shell every deploy, so a vendor hash
          // that only changes on dependency bumps is served from HTTP cache
          // during updates instead of re-downloaded with every app change.
          // Exact-name match so react-markdown et al. stay in their lazy chunks.
          manualChunks(id) {
            if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
              return 'react-vendor'
            }
          },
        },
      },
    },
    server: {
      port: 5173,
    },
  }
})
