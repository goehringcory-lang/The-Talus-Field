// Guard: a rebuild of unchanged source must produce a byte-identical build.
//
// The Pages project rebuilds on every push to main, and most of those pushes
// change nothing in this app — the nightly Lighthouse chore commit is the usual
// one. Anything wall-clock that reaches sw.js or a hashed chunk turns each of
// those into a real update for every installed copy: a rotated shell cache, a
// re-download of the whole bundle over park LTE, and an "Updated. Tap to
// refresh." bar for a build with no changes in it. Both used to happen (an ISO
// timestamp in the SW cache name, and the build date `define`d into the main
// and Account chunks), and nothing at runtime can tell a real update from that
// one — by the time it reaches a phone it is a genuinely different file.
//
// So the invariant is checked at the only place it is still visible: build
// twice, demand the same bytes. Run from apps/guide:
//
//   node scripts/check-build-determinism.mjs
//
// Wired into CI (.github/workflows/ci.yml) after the build step, where a dist/
// already exists and this costs one extra vite build.

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dist = join(root, 'dist')
const viteBin = join(root, 'node_modules', 'vite', 'bin', 'vite.js')

function build() {
  execFileSync(process.execPath, [viteBin, 'build'], { cwd: root, stdio: 'pipe' })
}

/** Every emitted file, keyed by dist-relative path, valued by content hash.
 * index.html is excluded on purpose, mirroring the SW version hash in
 * vite.config.ts: it carries the tfg-build-date meta, whose git-derived value
 * falls back to the wall clock on a shallow CI clone — two builds straddling
 * a UTC midnight would then fail this check over a stamp no installed client
 * keys an update on (the navigation handler re-caches HTML on every online
 * load regardless). */
function snapshot() {
  const out = new Map()
  const walk = (dir) => {
    for (const entry of readdirSync(dir).sort()) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) walk(full)
      else out.set(relative(dist, full), createHash('sha256').update(readFileSync(full)).digest('hex'))
    }
  }
  walk(dist)
  out.delete('index.html')
  return out
}

/** The SW's version line, which is what the browser's byte-compare turns on. */
function swVersion() {
  const source = readFileSync(join(dist, 'sw.js'), 'utf8')
  return source.match(/^const VERSION = '(.*)'$/m)?.[1] ?? '(no VERSION line)'
}

if (!existsSync(join(dist, 'sw.js'))) {
  console.log('No dist/ yet, building once first…')
  build()
}

const before = snapshot()
const versionBefore = swVersion()

console.log('Rebuilding to compare…')
build()

const after = snapshot()
const versionAfter = swVersion()

const changed = []
for (const [file, hash] of after) {
  if (!before.has(file)) changed.push(`${file} (only in the second build)`)
  else if (before.get(file) !== hash) changed.push(file)
}
for (const file of before.keys()) {
  if (!after.has(file)) changed.push(`${file} (only in the first build)`)
}

if (changed.length === 0) {
  console.log(`OK: two builds of the same source are byte-identical (SW version ${versionAfter}).`)
  process.exit(0)
}

console.error('\nFAIL: rebuilding unchanged source produced a different build.\n')
console.error('Files that differ between two consecutive builds:')
for (const file of changed) console.error(`  - ${file}`)
if (versionBefore !== versionAfter) {
  console.error(`\nService worker version moved: ${versionBefore} -> ${versionAfter}`)
}
console.error(
  '\nSomething non-deterministic reached the build — almost always a clock read\n' +
  '(new Date(), Date.now()) in vite.config.ts or in a module the bundle pulls in.\n' +
  'Every installed copy of the guide would take this as a real update: a fresh\n' +
  'shell cache, a full re-download, and an update banner for a build with no\n' +
  'changes in it. Derive the value from content or from git instead.\n',
)
process.exit(1)
