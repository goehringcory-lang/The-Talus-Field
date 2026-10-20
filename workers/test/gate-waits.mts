// The entrance-gate wait log: feed -> rows, the cron run's fetch and write
// discipline (one fetch, no retry, one batch, missing binding skips), and the
// export's query parsing and CSV. Run: npm run test:gate-waits
import type { Env } from '../src/env'
import {
  EXPORT_ROW_LIMIT,
  GATE_WAITS_FETCH_TIMEOUT_MS,
  exportStatement,
  gateWaitRows,
  logGateWaits,
  parseExportQuery,
  runTimestamp,
  toCsv,
} from '../src/lib/gateWaits'
import { WAITS_URL, parseWaitsSummary } from '../src/lib/waits'

let failures = 0
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) console.log(`ok    ${name}`)
  else { failures++; console.log(`FAIL  ${name}${detail !== undefined ? ` :: ${JSON.stringify(detail)}` : ''}`) }
}

// The feed's head as the Range request sees it: the summary, then history
// cut off mid-array by the 8 KB window.
const FEED_HEAD =
  '{"summary":[' +
  '{"pair_name":"South Entrance Wait Time","current_wait_minutes":12.4},' +
  '{"pair_name":"Arch Rock Wait Time","current_wait_minutes":3,"stale":true},' +
  '{"pair_name":"Big Oak Flat Wait Time","current_wait_minutes":null},' +
  '{"current_wait_minutes":5},' +
  '{"pair_name":"South Entrance Wait Time","current_wait_minutes":40}' +
  '],"history":[{"pair_name":"South Entrance Wait Time","t":"2026-10-20T1'

console.log('\nFeed -> rows')
const TS = runTimestamp(Date.parse('2026-10-20T17:40:07.123Z'))
check('the run timestamp is truncated to the minute', TS === '2026-10-20T17:40:00Z', TS)
{
  const summary = parseWaitsSummary(FEED_HEAD)
  check('the truncated feed head parses', Array.isArray(summary) && summary.length === 5, summary)
  const rows = gateWaitRows(summary ?? [], TS)
  check('three gates, nameless and repeated entries dropped', rows.length === 3, rows)
  const by = Object.fromEntries(rows.map((r) => [r.gate, r]))
  check('gate names lose the " Wait Time" suffix', Object.keys(by).join('|') === 'South Entrance|Arch Rock|Big Oak Flat', Object.keys(by))
  check('a live reading is rounded and ok', by['South Entrance']?.wait_minutes === 12 && by['South Entrance']?.raw_status === 'ok', by['South Entrance'])
  check('a repeated gate keeps its first entry', by['South Entrance']?.wait_minutes === 12)
  check('a stale reading keeps its number and says stale', by['Arch Rock']?.wait_minutes === 3 && by['Arch Rock']?.raw_status === 'stale', by['Arch Rock'])
  check('no number is NULL and missing', by['Big Oak Flat']?.wait_minutes === null && by['Big Oak Flat']?.raw_status === 'missing', by['Big Oak Flat'])
  check('every row carries the run timestamp', rows.every((r) => r.ts_utc === TS))
}
check('a feed with no summary parses to null', parseWaitsSummary('{"history":[]}') === null)

console.log('\nThe cron run')

type Bound = { sql: string; args: unknown[] }
function fakeDb(opts: { failBatch?: boolean } = {}) {
  const batches: Bound[][] = []
  const db = {
    prepare(sql: string) {
      return { bind: (...args: unknown[]) => ({ sql, args }) }
    },
    async batch(stmts: Bound[]) {
      if (opts.failBatch) throw new Error('D1 down')
      batches.push(stmts)
      return []
    },
  }
  return { db, batches }
}

const realFetch = globalThis.fetch
const realError = console.error
const realWarn = console.warn
let fetchCalls: { url: string; init?: RequestInit }[] = []
function mockFetch(respond: () => Response | Promise<Response>) {
  fetchCalls = []
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    fetchCalls.push({ url: String(input), init })
    return respond()
  }) as typeof fetch
}
console.error = () => {}
console.warn = () => {}

const SCHED = Date.parse('2026-10-20T17:40:00Z')
try {
  {
    mockFetch(() => new Response(FEED_HEAD, { status: 206 }))
    const { db, batches } = fakeDb()
    const res = await logGateWaits({ GATE_WAITS: db } as unknown as Env, SCHED)
    check('a good run writes three rows', res.status === 'written' && res.rows === 3, res)
    check('exactly one fetch, to the public feed', fetchCalls.length === 1 && fetchCalls[0].url === WAITS_URL, fetchCalls.map((f) => f.url))
    const init = fetchCalls[0]?.init
    check('the fetch carries a timeout signal', init?.signal instanceof AbortSignal)
    check('the fetch is a Range request for the head', (init?.headers as Record<string, string>)?.Range === 'bytes=0-8191')
    check('the timeout is 8 s', GATE_WAITS_FETCH_TIMEOUT_MS === 8_000)
    check('all gates go in one batch', batches.length === 1 && batches[0].length === 3, batches.map((b) => b.length))
    check('the insert ignores a repeated (ts_utc, gate)', /^INSERT OR IGNORE INTO gate_waits/.test(batches[0]?.[0]?.sql ?? ''))
    check('bound values are in column order', JSON.stringify(batches[0]?.[0]?.args) === JSON.stringify([TS, 'South Entrance', 12, 'ok']), batches[0]?.[0]?.args)
  }
  {
    mockFetch(() => new Response('nope', { status: 503 }))
    const { db, batches } = fakeDb()
    const res = await logGateWaits({ GATE_WAITS: db } as unknown as Env, SCHED)
    check('a feed error writes nothing', res.status === 'fetch_failed' && batches.length === 0, res)
    check('... and is not retried', fetchCalls.length === 1, fetchCalls.length)
  }
  {
    mockFetch(() => { throw new TypeError('network down') })
    const { db } = fakeDb()
    const res = await logGateWaits({ GATE_WAITS: db } as unknown as Env, SCHED)
    check('a thrown fetch is caught, once', res.status === 'fetch_failed' && fetchCalls.length === 1, res)
  }
  {
    mockFetch(() => new Response('{"history":[]}', { status: 200 }))
    const { db, batches } = fakeDb()
    const res = await logGateWaits({ GATE_WAITS: db } as unknown as Env, SCHED)
    check('a feed with no summary writes nothing', res.status === 'fetch_failed' && batches.length === 0, res)
  }
  {
    mockFetch(() => new Response(FEED_HEAD, { status: 206 }))
    const res = await logGateWaits({} as Env, SCHED)
    check('a missing binding skips without fetching', res.status === 'skipped' && fetchCalls.length === 0, res)
  }
  {
    mockFetch(() => new Response(FEED_HEAD, { status: 206 }))
    const { db } = fakeDb({ failBatch: true })
    const res = await logGateWaits({ GATE_WAITS: db } as unknown as Env, SCHED)
    check('a failed D1 batch is caught', res.status === 'write_failed', res)
  }
} finally {
  globalThis.fetch = realFetch
  console.error = realError
  console.warn = realWarn
}

console.log('\nThe export')
{
  const p = parseExportQuery({})
  check('defaults: csv, no filters', p.ok && p.query.format === 'csv' && !p.query.since && !p.query.until && !p.query.gate, p)
  const d = parseExportQuery({ format: 'JSON', since: '2026-07-01', until: '2026-07-02T08:30:00-07:00', gate: 'Arch Rock' })
  check('a bare date is midnight UTC', d.ok && d.query.since === '2026-07-01T00:00:00Z', d)
  check('an offset timestamp is normalised to UTC', d.ok && d.query.until === '2026-07-02T15:30:00Z', d)
  check('format is case-insensitive', d.ok && d.query.format === 'json', d)
  check('a bad format is refused', !parseExportQuery({ format: 'xml' }).ok)
  check('a bad since is refused', !parseExportQuery({ since: 'yesterday' }).ok)
  check('an impossible date is refused', !parseExportQuery({ until: '2026-13-45' }).ok)
  if (d.ok) {
    const s = exportStatement(d.query)
    check('filters become bound parameters', JSON.stringify(s.params) === JSON.stringify(['2026-07-01T00:00:00Z', '2026-07-02T15:30:00Z', 'Arch Rock']), s)
    check('since inclusive, until exclusive', /ts_utc >= \? AND ts_utc < \? AND gate = \?/.test(s.sql), s.sql)
    check('the statement fetches one past the limit', s.sql.endsWith(`LIMIT ${EXPORT_ROW_LIMIT + 1}`), s.sql)
    check('the user\'s gate never enters the SQL text', !s.sql.includes('Arch Rock'))
  }
  check('no filters, no WHERE', !/WHERE/.test(exportStatement({ format: 'csv', since: null, until: null, gate: null }).sql))
}
{
  const csv = toCsv([
    { ts_utc: '2026-10-20T17:40:00Z', gate: 'South Entrance', wait_minutes: 12, raw_status: 'ok' },
    { ts_utc: '2026-10-20T17:40:00Z', gate: 'Big Oak Flat', wait_minutes: null, raw_status: 'missing' },
    { ts_utc: '2026-10-20T17:40:00Z', gate: 'Odd, "Gate"', wait_minutes: 0, raw_status: 'stale' },
  ])
  const lines = csv.split('\r\n')
  check('CSV header row', lines[0] === 'ts_utc,gate,wait_minutes,raw_status', lines[0])
  check('CSV data row', lines[1] === '2026-10-20T17:40:00Z,South Entrance,12,ok', lines[1])
  check('CSV NULL is an empty cell', lines[2] === '2026-10-20T17:40:00Z,Big Oak Flat,,missing', lines[2])
  check('CSV quotes commas and doubles quotes; zero stays 0', lines[3] === '2026-10-20T17:40:00Z,"Odd, ""Gate""",0,stale', lines[3])
  check('CSV ends with CRLF', csv.endsWith('\r\n') && lines.length === 5)
  check('an empty export is the header alone', toCsv([]) === 'ts_utc,gate,wait_minutes,raw_status\r\n')
}

console.log(failures ? `\n${failures} failure(s)` : '\nall gate-wait checks pass')
process.exit(failures ? 1 : 0)
