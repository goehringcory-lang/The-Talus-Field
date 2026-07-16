import type { Env } from '../env'

// Entrance-wait summary for the embeddable widget (/widget/conditions).
// Server-side port of the editorial masthead's EntranceWaits fetch
// (components.jsx): the NPS transit-time display publishes waits.json on a
// public S3 bucket, ~1 MB because weeks of history follow the summary array,
// so we fetch only the first 8 KB via a Range request and bracket-match the
// summary out of the truncated JSON. Cached in GUIDE_PROGRAMS KV so a page of
// hotel-site embeds never fans out to the S3 bucket; stale-on-failure like
// lib/weather.ts. The feed is undocumented and can move or change shape —
// every consumer must treat null as "render nothing", never as an error.

const WAITS_URL =
  'https://npsvms-338365424831-us-west-1-an.s3.us-west-1.amazonaws.com/yose/transit-time/display/public/waits.json'
const WAITS_KEY = 'waits:v1'
const FRESH_MS = 5 * 60 * 1000

export type WaitsSummaryEntry = {
  pair_name?: string
  current_wait_minutes?: number | null
  stale?: boolean
}

export type WaitsRecord = {
  fetchedAt: string // ISO
  summary: WaitsSummaryEntry[]
}

// Mirror of parseWaitsSummary in components.jsx: find the "summary" key and
// bracket-match its array out of a truncated JSON document.
function parseWaitsSummary(text: string): WaitsSummaryEntry[] | null {
  const key = text.indexOf('"summary"')
  if (key === -1) return null
  const start = text.indexOf('[', key)
  if (start === -1) return null
  let depth = 0
  for (let i = start; i < text.length; i++) {
    const ch = text[i]
    if (ch === '[') depth++
    else if (ch === ']' && --depth === 0) {
      try {
        const parsed = JSON.parse(text.slice(start, i + 1)) as unknown
        return Array.isArray(parsed) ? (parsed as WaitsSummaryEntry[]) : null
      } catch {
        return null
      }
    }
  }
  return null
}

async function readCached(env: Env): Promise<WaitsRecord | null> {
  const raw = await env.GUIDE_PROGRAMS.get(WAITS_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as WaitsRecord
  } catch {
    return null
  }
}

export async function getWaits(env: Env): Promise<WaitsRecord | null> {
  const cached = await readCached(env)
  if (cached && Date.now() - Date.parse(cached.fetchedAt) < FRESH_MS) {
    return cached
  }

  try {
    const res = await fetch(WAITS_URL, { headers: { Range: 'bytes=0-8191' } })
    if (!res.ok) throw new Error(`waits.json HTTP ${res.status}`)
    const summary = parseWaitsSummary(await res.text())
    if (!summary || summary.length === 0) throw new Error('waits.json summary not found')
    const record: WaitsRecord = { fetchedAt: new Date().toISOString(), summary }
    await env.GUIDE_PROGRAMS.put(WAITS_KEY, JSON.stringify(record))
    return record
  } catch (err) {
    // A failed spot keeps its stale copy, same policy as the weather cache.
    console.error('getWaits: refresh failed, serving stale if any', err)
    return cached
  }
}
