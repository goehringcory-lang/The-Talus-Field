import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const buildDate = new Date().toISOString().slice(0, 10) // YYYY-MM-DD, for display
// Full timestamp for the SW cache name: a date-only stamp made same-day
// redeploys emit a byte-identical sw.js, so the browser saw no update and
// the UpdateBanner never fired for hotfixes.
const buildStamp = new Date().toISOString().replace(/[:.]/g, '-')

// Stamp dist/sw.js: __BUILD_DATE__ becomes the unique cache-name version,
// __API_BASE__ the Worker origin the push handler calls, and the
// __BUILD_ASSETS__ placeholder array becomes the list of hashed JS/CSS
// chunks so the SW precaches them (an update that first runs offline would
// otherwise white-screen — index.html cached, its scripts not).
// The SW lives in public/ (must be served at /sw.js for scope) so we can't
// import constants — we string-replace the emitted file instead.
//
// apiBase comes from loadEnv, NOT process.env: VITE_API_BASE lives in
// .env.production, which Vite exposes on import.meta.env only. Reading
// process.env here silently baked localhost into the production service
// worker, and the failure was invisible — every push fell back to the generic
// notification because the SW was asking a dev host what it was about.
function stampServiceWorker(apiBase: string): Plugin {
  return {
    name: 'tfg-stamp-sw',
    apply: 'build',
    async closeBundle() {
      const assets = (await readdir(resolve('dist/assets'))).map((f) => `/assets/${f}`)
      const swPath = resolve('dist/sw.js')
      const source = await readFile(swPath, 'utf8')
      await writeFile(
        swPath,
        source
          .replaceAll('__BUILD_DATE__', buildStamp)
          .replaceAll('__API_BASE__', apiBase)
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
    plugins: [react(), stampServiceWorker(apiBase)],
    define: {
      'import.meta.env.VITE_BUILD_DATE': JSON.stringify(buildDate),
    },
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
