// =============================================================================
// GET /api/gate-waits/export?format=csv|json&since=&until=&gate=
//
// Raw read-only export of the entrance-gate wait log (lib/gateWaits.ts).
// UNAUTHENTICATED, like /api/waits: every row is a reading of the public NPS
// feed, so there is nothing to protect but the D1 read quota, which the row
// cap and the edge cache below look after. No page links here.
//
// since is inclusive, until exclusive; both take YYYY-MM-DD or a full ISO
// timestamp. At most EXPORT_ROW_LIMIT rows, oldest first; a capped answer
// says so (X-Gate-Waits-Truncated: true, and `truncated` in JSON), and the
// next page starts at the last ts_utc returned (re-reading that one minute's
// rows, which INSERT OR IGNORE keeps unique).
// =============================================================================

import { Hono } from 'hono'
import type { Env } from '../env'
import {
  EXPORT_ROW_LIMIT,
  exportStatement,
  parseExportQuery,
  toCsv,
  type GateWaitRow,
} from '../lib/gateWaits'

export const gateWaits = new Hono<{ Bindings: Env }>()

// The log gains rows every ten minutes, so a ten-minute edge copy costs
// nothing in freshness and turns a repeated download into zero D1 reads.
const CACHE_CONTROL = 'public, max-age=600'

gateWaits.get('/export', async (c) => {
  const db = c.env.GATE_WAITS
  if (!db) return c.json({ error: 'not_configured' }, 503)

  const parsed = parseExportQuery(c.req.query())
  if (!parsed.ok) return c.json({ error: parsed.error }, 400)
  const { query } = parsed

  // Workers responses skip the zone cache, so cache explicitly per URL.
  const cache = (caches as unknown as { default: Cache }).default
  const cacheKey = new Request(c.req.url, { method: 'GET' })
  const hit = await cache.match(cacheKey)
  if (hit) return hit

  const { sql, params } = exportStatement(query)
  let rows: GateWaitRow[]
  try {
    const result = await db.prepare(sql).bind(...params).all<GateWaitRow>()
    rows = result.results ?? []
  } catch (err) {
    console.error('gate-waits export: D1 query failed', err)
    return c.json({ error: 'query_failed' }, 502)
  }
  const truncated = rows.length > EXPORT_ROW_LIMIT
  if (truncated) rows = rows.slice(0, EXPORT_ROW_LIMIT)

  const headers: Record<string, string> = {
    'Cache-Control': CACHE_CONTROL,
    'X-Gate-Waits-Truncated': String(truncated),
    'X-Gate-Waits-Rows': String(rows.length),
  }
  let res: Response
  if (query.format === 'csv') {
    res = new Response(toCsv(rows), {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="gate-waits.csv"',
      },
    })
  } else {
    res = new Response(
      JSON.stringify({
        source: 'NPS Yosemite transit-time feed (public waits.json)',
        limit: EXPORT_ROW_LIMIT,
        count: rows.length,
        truncated,
        rows,
      }),
      { status: 200, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } },
    )
  }
  c.executionCtx.waitUntil(cache.put(cacheKey, res.clone()))
  return res
})
