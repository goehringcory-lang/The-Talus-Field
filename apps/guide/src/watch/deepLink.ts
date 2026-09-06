// =============================================================================
// /watch?target=<id>&start=<date>&end=<date>: the map popup's "Watch for
// openings" and any future editorial link land here. Same posture as
// trip/importTrip.ts: validate, and drop anything that does not resolve
// rather than guess. A signed-out visitor needs no stash: RequireAuth carries
// pathname + search through /login and back.
// =============================================================================

import { targetById } from './targets'

const TARGET_RE = /^[a-z0-9-]{1,40}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export type WatchPrefill = {
  target?: string   // a WATCH_TARGETS id
  start?: string    // arrival, YYYY-MM-DD
  end?: string      // departure morning, YYYY-MM-DD
}

function isDate(value: string | null): value is string {
  return !!value && DATE_RE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
}

export function parseWatchParams(search: string): WatchPrefill {
  const params = new URLSearchParams(search)
  const out: WatchPrefill = {}
  const target = (params.get('target') ?? '').trim().toLowerCase()
  if (TARGET_RE.test(target) && targetById(target)) out.target = target
  const start = params.get('start')
  const end = params.get('end')
  if (isDate(start)) out.start = start
  if (isDate(end)) out.end = end
  return out
}
