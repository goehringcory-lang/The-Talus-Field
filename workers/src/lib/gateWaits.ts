import type { Env } from '../env'
import { fetchWaitsSummary, type WaitsSummaryEntry } from './waits'

// Entrance-gate wait LOG: one row per gate per cron run in the GATE_WAITS D1
// database, so the season's waits can be studied later. Nothing public reads
// it except the raw export (routes/gateWaits.ts); no page renders it.
//
// Source: the public NPS transit-time feed (lib/waits.ts), and only that.
// One fetch per run, 8s timeout, no retries: a missed ten-minute sample is a
// gap in the log, which the analysis can see, while a retry loop on a dead
// feed is wasted CPU on every run. Rows are written with INSERT OR IGNORE
// keyed on (ts_utc, gate), so a re-run of the same scheduled minute is a
// no-op rather than a duplicate.

export const GATE_WAITS_FETCH_TIMEOUT_MS = 8_000

export type GateWaitRow = {
  ts_utc: string // ISO, the run's scheduled minute
  gate: string // pair_name minus its " Wait Time" suffix: "South Entrance"
  wait_minutes: number | null
  raw_status: 'ok' | 'stale' | 'missing'
}

// Columns in table order; the CSV export and the INSERT share it.
export const GATE_WAIT_COLUMNS = ['ts_utc', 'gate', 'wait_minutes', 'raw_status'] as const

// The scheduled time truncated to the minute, so every gate in one run shares
// one timestamp and a repeated invocation of the same minute collides on the
// primary key instead of adding rows.
export function runTimestamp(scheduledTimeMs: number): string {
  const d = new Date(scheduledTimeMs)
  d.setUTCSeconds(0, 0)
  return d.toISOString().replace(/\.000Z$/, 'Z')
}

// Feed summary -> log rows. Unlike waitsDisplay (which hides a stale number
// from readers), the log keeps the feed's number when it is stale and says so
// in raw_status, so the analysis decides what a stale reading is worth.
// "missing" is a pair with no numeric wait. Entries with no pair_name are
// dropped, and a repeated gate keeps its first entry.
export function gateWaitRows(summary: WaitsSummaryEntry[], tsUtc: string): GateWaitRow[] {
  const rows: GateWaitRow[] = []
  const seen = new Set<string>()
  for (const pair of summary) {
    const gate = String(pair?.pair_name ?? '').replace(/\s*Wait Time$/i, '').trim()
    if (!gate || seen.has(gate)) continue
    seen.add(gate)
    const n = pair.current_wait_minutes
    const minutes = typeof n === 'number' && Number.isFinite(n) ? Math.round(n) : null
    const hasValue = minutes !== null
    rows.push({
      ts_utc: tsUtc,
      gate,
      wait_minutes: minutes,
      raw_status: !hasValue ? 'missing' : pair.stale ? 'stale' : 'ok',
    })
  }
  return rows
}

const INSERT_SQL =
  'INSERT OR IGNORE INTO gate_waits (ts_utc, gate, wait_minutes, raw_status) VALUES (?, ?, ?, ?)'

export type LogResult =
  | { status: 'skipped'; reason: 'no_binding' }
  | { status: 'fetch_failed' }
  | { status: 'write_failed' }
  | { status: 'written'; rows: number }

// The cron entry point. Never throws: a missing binding, a dead feed and a
// failed write each log one line and return.
export async function logGateWaits(env: Env, scheduledTimeMs: number): Promise<LogResult> {
  const db = env.GATE_WAITS
  if (!db) {
    console.warn('gate-waits: GATE_WAITS binding missing, skipping run')
    return { status: 'skipped', reason: 'no_binding' }
  }

  let summary: WaitsSummaryEntry[]
  try {
    summary = await fetchWaitsSummary(GATE_WAITS_FETCH_TIMEOUT_MS)
  } catch (err) {
    console.error('gate-waits: feed fetch failed, no rows this run', err)
    return { status: 'fetch_failed' }
  }

  const rows = gateWaitRows(summary, runTimestamp(scheduledTimeMs))
  if (rows.length === 0) return { status: 'written', rows: 0 }
  try {
    const stmt = db.prepare(INSERT_SQL)
    await db.batch(rows.map((r) => stmt.bind(r.ts_utc, r.gate, r.wait_minutes, r.raw_status)))
  } catch (err) {
    console.error('gate-waits: D1 batch failed', err)
    return { status: 'write_failed' }
  }
  return { status: 'written', rows: rows.length }
}

// ---- Export ---------------------------------------------------------------

export const EXPORT_ROW_LIMIT = 10_000

export type ExportQuery = {
  format: 'csv' | 'json'
  since: string | null // inclusive
  until: string | null // exclusive
  gate: string | null
}

// Accepts a full ISO timestamp or a bare date (YYYY-MM-DD, read as 00:00Z)
// and normalises to the stored form, so string comparison on ts_utc is a
// time comparison.
function normaliseTime(raw: string | undefined): string | null | undefined {
  if (raw === undefined || raw === '') return null
  if (!/^\d{4}-\d{2}-\d{2}([T ][\d:.]+(Z|[+-]\d{2}:?\d{2})?)?$/.test(raw)) return undefined
  const ms = Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00Z` : raw)
  if (Number.isNaN(ms)) return undefined
  return new Date(ms).toISOString().replace(/\.000Z$/, 'Z')
}

export function parseExportQuery(
  q: Record<string, string | undefined>,
): { ok: true; query: ExportQuery } | { ok: false; error: string } {
  const format = (q.format ?? 'csv').toLowerCase()
  if (format !== 'csv' && format !== 'json') return { ok: false, error: 'format must be csv or json' }
  const since = normaliseTime(q.since)
  if (since === undefined) return { ok: false, error: 'since must be an ISO date or timestamp' }
  const until = normaliseTime(q.until)
  if (until === undefined) return { ok: false, error: 'until must be an ISO date or timestamp' }
  const gate = q.gate?.trim() || null
  if (gate && gate.length > 64) return { ok: false, error: 'gate is too long' }
  return { ok: true, query: { format, since, until, gate } }
}

// Parameterised SELECT for an export. Fetches limit + 1 so the caller can
// tell a full page from a truncated one.
export function exportStatement(query: ExportQuery, limit = EXPORT_ROW_LIMIT): { sql: string; params: string[] } {
  const where: string[] = []
  const params: string[] = []
  if (query.since) { where.push('ts_utc >= ?'); params.push(query.since) }
  if (query.until) { where.push('ts_utc < ?'); params.push(query.until) }
  if (query.gate) { where.push('gate = ?'); params.push(query.gate) }
  const sql =
    `SELECT ${GATE_WAIT_COLUMNS.join(', ')} FROM gate_waits` +
    (where.length ? ` WHERE ${where.join(' AND ')}` : '') +
    ` ORDER BY ts_utc ASC, gate ASC LIMIT ${limit + 1}`
  return { sql, params }
}

function csvCell(v: string | number | null): string {
  if (v === null) return ''
  const s = String(v)
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

// RFC 4180: CRLF line ends, header row, null as an empty cell.
export function toCsv(rows: GateWaitRow[]): string {
  const lines = [GATE_WAIT_COLUMNS.join(',')]
  for (const r of rows) lines.push(GATE_WAIT_COLUMNS.map((c) => csvCell(r[c])).join(','))
  return lines.join('\r\n') + '\r\n'
}
