import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const buildDate = new Date().toISOString().slice(0, 10) // YYYY-MM-DD, for display
// Full timestamp for the SW cache name: a date-only stamp made same-day
// redeploys emit a byte-identical sw.js, so the browser saw no update and
// the UpdateBanner never fired for hotfixes.
const buildStamp = new Date().toISOString().replace(/[:.]/g, '-')

// Stamp dist/sw.js: __BUILD_DATE__ becomes the unique cache-name version, and
// the __BUILD_ASSETS__ placeholder array becomes the list of hashed JS/CSS
// chunks so the SW precaches them (an update that first runs offline would
// otherwise white-screen — index.html cached, its scripts not).
// The SW lives in public/ (must be served at /sw.js for scope) so we can't
// import constants — we string-replace the emitted file instead.
function stampServiceWorker(): Plugin {
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
          .replace('/* __BUILD_ASSETS__ */ []', JSON.stringify(assets)),
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), stampServiceWorker()],
  define: {
    'import.meta.env.VITE_BUILD_DATE': JSON.stringify(buildDate),
  },
  server: {
    port: 5173,
  },
})
