// =============================================================================
// ALERTS — NPS park alerts plus derived road status for the seasonal roads.
//
// GET https://developer.nps.gov/api/v1/alerts?parkCode=yose — same free key
// and header convention as lib/nps.ts. The alerts feed is the park's own
// closure board: Tioga and Glacier Point openings, chain controls, trail
// closures, and smoke advisories all arrive here as prose. We serve the
// alerts themselves and ALSO derive a small structured summary (per-road
// open/closed/unknown, plus a chain-controls line) because "is Tioga open"
// is the question the guide gets asked, and making every client re-parse
// government prose would mean four slightly different answers.
//
// Derivation is deliberately conservative: a road with no matching alert is
// 'unknown', never 'open' — NPS removes the closure alert when a road opens,
// but silence is not a status. The PWA renders 'unknown' as nothing.
//
// KEEP IN SYNC with apps/guide/src/alerts/schema.ts — the PWA re-declares the
// response schema at its parse boundary, same convention as weather.
// =============================================================================

import { z } from 'zod'
import type { Env } from '../env'

const NPS_ALERTS_URL = 'https://developer.nps.gov/api/v1/alerts'
const PAGE_SIZE = 100

export const AlertCategory = z.enum(['closure', 'danger', 'caution', 'information'])
export type AlertCategoryT = z.infer<typeof AlertCategory>

export const AlertItem = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: AlertCategory,
  url: z.string().nullable(),
})
export type AlertItemT = z.infer<typeof AlertItem>

export const RoadId = z.enum(['tioga', 'glacier-point', 'mariposa-grove', 'hetch-hetchy'])
export type RoadIdT = z.infer<typeof RoadId>

export const RoadStatus = z.object({
  id: RoadId,
  label: z.string(),
  status: z.enum(['open', 'closed', 'unknown']),
  // The sentence the status was derived from, so the client can show its work.
  detail: z.string().nullable(),
})
export type RoadStatusT = z.infer<typeof RoadStatus>

export const AlertsRecord = z.object({
  fetchedAt: z.string(),
  alerts: z.array(AlertItem),
  roads: z.array(RoadStatus),
  // Chain-control notice text when an active alert mentions chains, else null.
  // Text, not a boolean: "R2 over 6,000 ft" is the useful part, and absence of
  // an alert is not proof chains aren't required somewhere on the drive in.
  chains: z.string().nullable(),
})
export type AlertsRecordT = z.infer<typeof AlertsRecord>

// ── KV layout (GUIDE_PROGRAMS: the "guide data cache, safe to lose" bucket) ──
// alerts:v1 → AlertsRecordT

const ALERTS_KEY = 'alerts:v1'
const FRESH_MS = 15 * 60 * 1000

// The roads whose seasonal status readers actually plan around. Matching is
// per-alert: the alert must name the road before any status words count.
const ROADS: Array<{ id: RoadIdT; label: string; re: RegExp }> = [
  { id: 'tioga', label: 'Tioga Road', re: /tioga/i },
  { id: 'glacier-point', label: 'Glacier Point Road', re: /glacier point road/i },
  { id: 'mariposa-grove', label: 'Mariposa Grove Road', re: /mariposa grove road/i },
  { id: 'hetch-hetchy', label: 'Hetch Hetchy Road', re: /hetch hetchy road/i },
]

const CLOSED_RE = /\b(closed|closure|will close|remains? closed|not open)\b/i
const OPEN_RE = /\b(is open|now open|has opened|reopened|open for the season)\b/i

type NpsAlert = {
  id?: string
  title?: string
  description?: string
  category?: string
  url?: string
}

function mapCategory(category?: string): AlertCategoryT {
  const c = (category ?? '').toLowerCase()
  if (c.includes('closure')) return 'closure'
  if (c.includes('danger')) return 'danger'
  if (c.includes('caution')) return 'caution'
  return 'information'
}

function deriveRoads(alerts: AlertItemT[]): RoadStatusT[] {
  return ROADS.map(({ id, label, re }) => {
    let status: RoadStatusT['status'] = 'unknown'
    let detail: string | null = null
    for (const alert of alerts) {
      const text = `${alert.title} ${alert.description}`
      if (!re.test(text)) continue
      // Closed wins over open: a "reopening June 1" sentence inside a closure
      // alert must not read as open today.
      if (CLOSED_RE.test(text)) {
        status = 'closed'
        detail = alert.title
        break
      }
      // No break here: a later alert can still mark the road closed, and
      // closed wins by breaking out above.
      if (OPEN_RE.test(text)) {
        status = 'open'
        detail = alert.title
      }
    }
    return { id, label, status, detail }
  })
}

function deriveChains(alerts: AlertItemT[]): string | null {
  for (const alert of alerts) {
    const text = `${alert.title} ${alert.description}`
    if (/\bchains?\b/i.test(text) && /\b(required|control|carry)\b/i.test(text)) {
      return alert.title
    }
  }
  return null
}

export async function readAlertsRecord(env: Env): Promise<AlertsRecordT | null> {
  const raw = await env.GUIDE_PROGRAMS.get(ALERTS_KEY)
  if (!raw) return null
  try {
    const parsed = AlertsRecord.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      console.error('readAlertsRecord: schema drift in KV', parsed.error.issues[0])
      return null
    }
    return parsed.data
  } catch (err) {
    console.error('readAlertsRecord: corrupt KV record', err)
    return null
  }
}

async function fetchNpsAlerts(env: Env): Promise<AlertItemT[]> {
  const params = new URLSearchParams({
    parkCode: 'yose',
    limit: String(PAGE_SIZE),
  })
  const res = await fetch(`${NPS_ALERTS_URL}?${params}`, {
    headers: { 'X-Api-Key': env.NPS_API_KEY ?? '', accept: 'application/json' },
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`NPS alerts API ${res.status}`)
  const body = (await res.json()) as { data?: NpsAlert[] }
  const out: AlertItemT[] = []
  for (const raw of body.data ?? []) {
    if (!raw.id || !raw.title) continue
    const candidate: AlertItemT = {
      id: raw.id,
      title: raw.title.trim(),
      description: (raw.description ?? '').trim(),
      category: mapCategory(raw.category),
      url: raw.url?.trim() || null,
    }
    const parsed = AlertItem.safeParse(candidate)
    if (parsed.success) out.push(parsed.data)
    else console.error('fetchNpsAlerts: dropped alert', raw.id, parsed.error.issues[0])
  }
  // Closures first, then dangers: the order the record stores is the order
  // every client renders, so severity sorting lives in exactly one place.
  const rank: Record<AlertCategoryT, number> = { closure: 0, danger: 1, caution: 2, information: 3 }
  out.sort((a, b) => rank[a.category] - rank[b.category])
  return out
}

/**
 * Refresh the alerts record. Stale-on-failure like lib/weather.ts: a dead NPS
 * API (or a missing NPS_API_KEY) keeps the previous record; null only when
 * nothing could be fetched AND nothing was cached.
 */
export async function refreshAlerts(env: Env): Promise<AlertsRecordT | null> {
  const previous = await readAlertsRecord(env)
  try {
    const alerts = await fetchNpsAlerts(env)
    const record: AlertsRecordT = {
      fetchedAt: new Date().toISOString(),
      alerts,
      roads: deriveRoads(alerts),
      chains: deriveChains(alerts),
    }
    await env.GUIDE_PROGRAMS.put(ALERTS_KEY, JSON.stringify(record))
    return record
  } catch (err) {
    console.error('refreshAlerts: refresh failed, serving stale if any', err)
    return previous
  }
}

export async function getAlerts(env: Env): Promise<AlertsRecordT | null> {
  const cached = await readAlertsRecord(env)
  if (cached && Date.now() - Date.parse(cached.fetchedAt) < FRESH_MS) {
    return cached
  }
  return refreshAlerts(env)
}
