// =============================================================================
// The Field Guide fact audit's pick: which part of the guide gets re-verified
// against primary sources this week.
//
// The weekly "Field Guide fact audit" Routine
// (.claude/skills/guide-fact-audit/SKILL.md) re-checks the perishable facts
// already in the paid guide: hours, fees, shuttle and road windows, parking
// rules, trail access. This script does the bookkeeping so the run keeps only
// the judgment. It reads the audit's ledger (scripts/data/guide-fact-ledger.json
// at the repo root) and the content itself, and prints the run:
//
//   1. edition  when DINING_HOURS_SOURCE or HELP_SOURCE does not name the
//               edition bulletin.json carries: the in-park dining hours and
//               the help numbers are transcribed from the printed Yosemite
//               Guide, so a new edition makes both stale at once.
//   2. file     when a whole-file unit (amenities, essentials, seasonal) has
//               never been audited or was last audited over FILE_DAYS ago.
//   3. entries  otherwise: the next ENTRY_BATCH stops, hikes, and secret
//               spots, oldest audit first, never-audited first of all, ties
//               broken by reader value (core stops, then hikes, then the
//               Secret Guide; the Valley, then Glacier Point and Mariposa,
//               then Tuolumne, then Hetch Hetchy).
//
// Queued discrepancies (the ledger's `queue`) ride along with whichever run
// it is. Run from apps/guide: `npm run audit:candidates`. Reads, never writes.
// =============================================================================

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { stops } from '../src/content/stops'
import { HIKES } from '../src/content/hikes'
import { SECRET_SPOTS } from '../src/content/secret-spots'
import { DINING_HOURS_SOURCE } from '../src/content/dining'
import { HELP_SOURCE } from '../src/content/help'

const ENTRY_BATCH = 10
const FILE_DAYS = 84
const FILE_UNITS = ['amenities', 'essentials', 'seasonal'] as const
const REGION_ORDER = ['valley', 'glacier-mariposa', 'tuolumne', 'hetch-hetchy']

type Ledger = {
  files: Record<string, string | null>
  entries: Record<string, string>
  queue: { id: string; file: string; added: string; note: string }[]
}

const ROOT = path.resolve(process.cwd(), '../..')
const LEDGER_PATH = path.join(ROOT, 'scripts/data/guide-fact-ledger.json')
const BULLETIN_PATH = path.join(ROOT, 'bulletin.json')
if (!existsSync(LEDGER_PATH) || !existsSync(BULLETIN_PATH)) {
  console.error('fact-audit-candidates: run from apps/guide (npm run audit:candidates)')
  process.exit(1)
}

const ledger = JSON.parse(readFileSync(LEDGER_PATH, 'utf8')) as Ledger
const bulletin = JSON.parse(readFileSync(BULLETIN_PATH, 'utf8')) as { edition: { label: string } }

const today = new Date().toISOString().slice(0, 10)
const daysSince = (iso: string | null | undefined) =>
  iso ? Math.floor((Date.parse(today) - Date.parse(iso)) / 86_400_000) : Infinity
const norm = (s: string) => s.replace(/[‒-―-]+/g, '-').replace(/\s+/g, ' ').trim().toLowerCase()

// ---------------------------------------------------------------- the rotation
type Candidate = { id: string; file: string; label: string; audited: string | null; rank: number }
const rotation: Candidate[] = []
const regionRank = (r: string) => REGION_ORDER.indexOf(r)
const push = (id: string, file: string, label: string) =>
  rotation.push({ id, file, label, audited: ledger.entries[id] ?? null, rank: rotation.length })

const byRegionThenOrder = <T extends { region: string; order: number }>(a: T, b: T) =>
  regionRank(a.region) - regionRank(b.region) || a.order - b.order
for (const s of [...stops].filter((s) => s.collection !== 'hidden').sort(byRegionThenOrder)) {
  push(s.id, 'stops.ts', `core stop, ${s.region}: ${s.title}`)
}
for (const h of [...HIKES].sort(byRegionThenOrder)) push(h.id, 'hikes.ts', `hike, ${h.region}: ${h.title}`)
for (const s of [...stops].filter((s) => s.collection === 'hidden').sort(byRegionThenOrder)) {
  push(s.id, 'stops.ts', `Secret Guide stop, ${s.region}: ${s.title}`)
}
for (const s of [...SECRET_SPOTS].sort((a, b) => a.order - b.order)) push(s.id, 'secret-spots.ts', `secret spot: ${s.title}`)

// ---------------------------------------------------------------- the pick
const editionLabel = bulletin.edition.label
const editionStale = [
  ['dining.ts DINING_HOURS_SOURCE', DINING_HOURS_SOURCE.edition],
  ['help.ts HELP_SOURCE', HELP_SOURCE.edition],
].filter(([, ed]) => norm(ed) !== norm(editionLabel))

const overdueFiles = FILE_UNITS.map((f, i) => ({ f, i, audited: ledger.files[f] ?? null }))
  .filter((u) => daysSince(u.audited) > FILE_DAYS)
  .sort((a, b) => (a.audited ?? '').localeCompare(b.audited ?? '') || a.i - b.i)

const known = new Set(rotation.map((c) => c.id))
const staleLedgerRows = Object.keys(ledger.entries).filter((id) => !known.has(id))
const queue = ledger.queue ?? []

let run: string
let batch: Candidate[] = []
if (editionStale.length) run = 'edition'
else if (overdueFiles.length) run = `file:${overdueFiles[0].f}`
else {
  run = 'entries'
  batch = [...rotation]
    .sort((a, b) => (a.audited ?? '').localeCompare(b.audited ?? '') || a.rank - b.rank)
    .slice(0, ENTRY_BATCH)
}

// ---------------------------------------------------------------- report
const never = rotation.filter((c) => !c.audited).length
const oldest = rotation.map((c) => c.audited).filter(Boolean).sort()[0] ?? 'none'
console.log(`Field Guide fact audit, ${today}`)
console.log(`rotation: ${rotation.length} entries, ${never} never audited, oldest audit ${oldest}`)
console.log(`files: ${FILE_UNITS.map((f) => `${f} ${ledger.files[f] ?? 'never'}`).join(', ')}`)
console.log(`bulletin edition: ${editionLabel}`)
console.log('')
if (run === 'edition') {
  console.log('RUN: edition. The printed Guide has turned and these still name the previous edition:')
  for (const [where, ed] of editionStale) console.log(`  ${where}: ${ed}`)
  console.log('Re-transcribe the in-park dining hours and the help numbers from the current Guide, then set both sources.')
} else if (run.startsWith('file:')) {
  const u = overdueFiles[0]
  console.log(`RUN: ${run}. Last audited: ${u.audited ?? 'never'} (a file unit is due after ${FILE_DAYS} days).`)
} else {
  console.log(`RUN: entries. The next ${batch.length}:`)
  for (const c of batch) console.log(`  ${c.id.padEnd(34)} ${c.file.padEnd(16)} ${c.audited ?? 'never'}  ${c.label}`)
}
if (queue.length) {
  console.log('')
  console.log('QUEUED (take these in this run as well):')
  for (const q of queue) console.log(`  ${q.id} (${q.file}, queued ${q.added}): ${q.note}`)
}
if (staleLedgerRows.length) {
  console.log('')
  console.log(`Ledger rows for ids no longer in the guide (drop them in this run's PR): ${staleLedgerRows.join(', ')}`)
}
