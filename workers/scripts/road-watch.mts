// =============================================================================
// road-watch.mts: the road alert drafter's reading, taken by the Worker's own
// rules.
//
// The Worker watches seven roads every night (src/lib/roads.ts): it derives a
// reading per road from the NPS alerts feed, holds a new reading as a
// candidate until the next refresh repeats it, and only then confirms the
// change, emails the operator, and queues the buyers' push notice. That
// confirmed snapshot lives in KV (roads:watch:v1) and no route serves it.
//
// The "Road alert drafter" Routine (.claude/skills/road-alert/SKILL.md) needs
// the same answer to draft the email the road-alert signups were promised
// (Buttondown tags alert-roads and alert-tioga). Rather than copy the
// Worker's regexes, this script imports deriveRoadReadings and advanceWatch
// and runs them against the public /api/alerts, so the drafter and the Worker
// cannot disagree about what counts as a change. The state between runs is
// the JSON block the routine keeps in its GitHub issue; this script only
// reads a file and writes a file.
//
//   npm run road-watch -- --previous=state.json --out=next.json
//   npm run road-watch -- --previous=next.json --out=next.json --confirm=tioga
//
//   --previous  the state the last run stored. Omit it, or pass a file that
//               holds `null`, on the first run: every road becomes the
//               baseline and nothing is announced, which is what the Worker
//               does the first night it sees a road.
//   --out       where the next state is written. Always written, so the
//               caller can store it unconditionally.
//   --confirm   promote one road's pending candidate to confirmed now. The
//               runbook uses it when the park's own conditions page (or
//               Caltrans, for a highway) already states the new reading: the
//               same-day stand-in for the Worker's second nightly reading.
//   --api       the API origin, default https://api.thetalusfieldjournal.com
//
// Prints one JSON object: { fetchedAt, stale, advanced, readings, confirmed,
// candidates, next }. `confirmed` lists the changes confirmed on this run,
// by a repeated reading or by --confirm. Exit 0 on success; 3 when the alerts
// record is missing or older than STALE_HOURS (nothing advances, and --out
// receives the previous state unchanged); 1 on anything else.
// =============================================================================

import { readFileSync, writeFileSync } from 'node:fs'
import { AlertsRecord } from '../src/lib/alerts'
import { WATCHED_ROADS, advanceWatch, deriveRoadReadings } from '../src/lib/roads'
import type { RoadChange, WatchedRoadId } from '../src/lib/roads'

type WatchRecord = NonNullable<Parameters<typeof advanceWatch>[0]>

const DEFAULT_API = 'https://api.thetalusfieldjournal.com'
// The Worker refreshes the alerts record on request once it is 15 minutes
// old, and serves the stale record when the NPS feed is down. A record this
// old means the feed is down, and a dead feed's silence is not a reading.
const STALE_HOURS = 36

function arg(name: string): string | undefined {
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === `--${name}`) return argv[i + 1]
    if (a.startsWith(`--${name}=`)) return a.slice(name.length + 3)
  }
  return undefined
}

// Same normalization as readWatch in src/lib/roads.ts: a partial or older
// record is filled in rather than rejected.
function readPrevious(path: string | undefined): WatchRecord | null {
  if (!path) return null
  const raw = readFileSync(path, 'utf8').trim()
  if (!raw || raw === 'null') return null
  const parsed = JSON.parse(raw) as Partial<WatchRecord>
  return {
    updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date(0).toISOString(),
    confirmed: parsed.confirmed ?? {},
    candidate: parsed.candidate ?? {},
    changes: Array.isArray(parsed.changes) ? parsed.changes : [],
  }
}

function labelOf(id: string): string {
  return WATCHED_ROADS.find((r) => r.id === id)?.label ?? id
}

// The confirm branch of advanceWatch, for one road, on the caller's say-so.
function confirmNow(record: WatchRecord, roadId: WatchedRoadId, now: Date): RoadChange {
  const candidate = record.candidate[roadId]
  if (!candidate) throw new Error(`no pending candidate for ${roadId}; nothing to confirm`)
  const known = record.confirmed[roadId]
  const change: RoadChange = {
    roadId,
    label: labelOf(roadId),
    from: known?.state ?? 'unknown',
    to: candidate.state,
    headline: candidate.headline,
    confirmedAt: now.toISOString(),
  }
  record.confirmed[roadId] = { state: candidate.state, headline: candidate.headline }
  delete record.candidate[roadId]
  record.changes.push(change)
  return change
}

async function main(): Promise<number> {
  const api = (arg('api') ?? DEFAULT_API).replace(/\/+$/, '')
  const out = arg('out')
  if (!out) throw new Error('--out=<file> is required')
  const confirmId = arg('confirm')
  if (confirmId !== undefined && !WATCHED_ROADS.some((r) => r.id === confirmId)) {
    throw new Error(`--confirm must be one of: ${WATCHED_ROADS.map((r) => r.id).join(', ')}`)
  }
  const previous = readPrevious(arg('previous'))

  const res = await fetch(`${api}/api/alerts`, {
    headers: { accept: 'application/json', 'user-agent': 'the-talus-field/road-watch' },
    signal: AbortSignal.timeout(20_000),
  })
  if (!res.ok) throw new Error(`GET ${api}/api/alerts answered ${res.status}`)
  const body = (await res.json()) as { fetchedAt?: string | null }
  // Read the clock after the fetch: the Worker refreshes the record while
  // answering, so a clock read before it can be older than the reading.
  const now = new Date()

  const ageHours = body.fetchedAt ? (now.getTime() - Date.parse(body.fetchedAt)) / 3_600_000 : Infinity
  if (!body.fetchedAt || !(ageHours <= STALE_HOURS)) {
    writeFileSync(out, JSON.stringify(previous, null, 2) + '\n')
    console.log(
      JSON.stringify(
        { fetchedAt: body.fetchedAt ?? null, stale: true, advanced: false, readings: [], confirmed: [], candidates: [], next: previous },
        null,
        2,
      ),
    )
    return 3
  }

  const parsed = AlertsRecord.safeParse(body)
  if (!parsed.success) {
    throw new Error(`/api/alerts no longer matches the Worker's schema: ${parsed.error.issues[0]?.message ?? 'unknown issue'}`)
  }
  const alerts = parsed.data
  const readings = deriveRoadReadings(alerts.alerts)

  // A record that is not newer than the last watch is the same reading as last
  // time; counting it again would confirm a candidate on one sighting. Same
  // rule as watchRoads in the Worker.
  let next: WatchRecord
  const confirmed: RoadChange[] = []
  let advanced = false
  if (previous && Date.parse(alerts.fetchedAt) <= Date.parse(previous.updatedAt)) {
    next = previous
  } else {
    const step = advanceWatch(previous, readings, now)
    next = step.next
    confirmed.push(...step.confirmed)
    advanced = true
    // Stamp the watch no earlier than the reading it consumed, so the next
    // run skips this same record even if this machine's clock runs behind
    // the Worker's (the edge also caches /api/alerts for five minutes).
    if (Date.parse(alerts.fetchedAt) > Date.parse(next.updatedAt)) next.updatedAt = alerts.fetchedAt
  }

  if (confirmId !== undefined) confirmed.push(confirmNow(next, confirmId as WatchedRoadId, now))

  writeFileSync(out, JSON.stringify(next, null, 2) + '\n')
  console.log(
    JSON.stringify(
      {
        fetchedAt: alerts.fetchedAt,
        stale: false,
        advanced,
        readings: WATCHED_ROADS.map((r) => ({ roadId: r.id, label: r.label, ...readings[r.id] })),
        confirmed,
        candidates: Object.entries(next.candidate).map(([roadId, c]) => ({
          roadId,
          label: labelOf(roadId),
          from: next.confirmed[roadId as WatchedRoadId]?.state ?? 'unknown',
          to: c?.state,
          headline: c?.headline ?? null,
          seenAt: c?.seenAt,
        })),
        next,
      },
      null,
      2,
    ),
  )
  return 0
}

main().then(
  (code) => {
    process.exitCode = code
  },
  (err: unknown) => {
    console.error(`road-watch: ${err instanceof Error ? err.message : String(err)}`)
    process.exitCode = 1
  },
)
