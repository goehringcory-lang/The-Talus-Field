// =============================================================================
// Pure matching for campsite watches: given the compacted month grids
// (lib/recreationGov.ts) and what a watch asked for, which nights are open?
//
// No I/O, no clock, no env. The sweep and the /api/watch/:id route both call
// this, which is what keeps the notification and the detail page from ever
// disagreeing about the same grid. Callers own two things: dropping nights
// that have already passed, and treating a month the cache does not hold as
// "unchecked" rather than handing an empty grid in here (an empty grid is a
// true "nothing open").
// =============================================================================

import type { MonthAvailabilityT, MonthSiteT } from './recreationGov'

export type WatchSpec = {
  model: 'site' | 'person'
  dates: string[]          // the nights still wanted, YYYY-MM-DD
  mode: 'any' | 'full'     // any one night, or every night on one site
  party: number            // spots needed per night; person model only
}

export type OpeningSite = { id: string; site: string; loop: string }
export type Opening = {
  date: string
  sites: OpeningSite[]     // the sites open that night (person model: the pseudo-site)
  qty: number | null       // spots left that night; null for site-model campgrounds
}
export type MatchResult = {
  dates: string[]          // the nights the watch counts as open, sorted
  openings: Opening[]      // one per open night, in date order
  fullSites: string[]      // site ids open on every wanted night (site model)
}

export function addDaysIso(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** The nights a watch covers: `start` and the `nights - 1` after it. */
export function watchDates(start: string, nights: number): string[] {
  const out: string[] = []
  for (let i = 0; i < nights; i++) out.push(addDaysIso(start, i))
  return out
}

/** The distinct YYYY-MM months a set of nights touches, sorted. */
export function monthsOf(dates: string[]): string[] {
  return [...new Set(dates.map((d) => d.slice(0, 7)))].sort()
}

/**
 * Union the sites of several month grids by site id. A window that crosses a
 * month boundary is two KV records describing the same campsites, and `full`
 * mode has to see one site across both to know it is open every night.
 */
export function mergeMonths(months: MonthAvailabilityT[]): Record<string, MonthSiteT> {
  const merged: Record<string, MonthSiteT> = {}
  for (const month of months) {
    for (const [id, site] of Object.entries(month.sites)) {
      const prior = merged[id]
      if (!prior) {
        merged[id] = { ...site, dates: [...site.dates], ...(site.qty ? { qty: { ...site.qty } } : {}) }
        continue
      }
      prior.dates = [...new Set([...prior.dates, ...site.dates])].sort()
      if (site.qty) prior.qty = { ...(prior.qty ?? {}), ...site.qty }
    }
  }
  return merged
}

export function matchWatch(spec: WatchSpec, months: MonthAvailabilityT[]): MatchResult {
  const wanted = [...new Set(spec.dates)].sort()
  const empty: MatchResult = { dates: [], openings: [], fullSites: [] }
  if (wanted.length === 0) return empty

  const sites = mergeMonths(months)
  const wantedSet = new Set(wanted)
  const byDate = new Map<string, { sites: OpeningSite[]; qty: number }>()
  for (const d of wanted) byDate.set(d, { sites: [], qty: 0 })

  const fullSites: string[] = []
  for (const [id, site] of Object.entries(sites)) {
    let covered = 0
    for (const d of site.dates) {
      if (!wantedSet.has(d)) continue
      // A grid that says Available with no quantity is one spot; a quantity
      // of zero alongside Available has not been seen, but would be no spot.
      const q = site.qty?.[d] ?? 1
      if (q < 1) continue
      covered++
      const cell = byDate.get(d)!
      cell.sites.push({ id, site: site.site, loop: site.loop })
      cell.qty += q
    }
    if (covered === wanted.length) fullSites.push(id)
  }

  const isPerson = spec.model === 'person'
  const openOn = (d: string) => {
    const cell = byDate.get(d)!
    return isPerson ? cell.qty >= spec.party : cell.sites.length > 0
  }
  const opening = (d: string, onlySites?: Set<string>): Opening => {
    const cell = byDate.get(d)!
    const chosen = onlySites ? cell.sites.filter((s) => onlySites.has(s.id)) : cell.sites
    return { date: d, sites: chosen, qty: isPerson ? cell.qty : null }
  }

  if (spec.mode === 'any') {
    const dates = wanted.filter(openOn)
    return { dates, openings: dates.map((d) => opening(d)), fullSites }
  }

  // full: every wanted night, on one site (site model) or with enough spots
  // on each night (person model, where the one pseudo-site is a given).
  if (isPerson) {
    if (!wanted.every(openOn)) return { ...empty, fullSites }
    return { dates: wanted, openings: wanted.map((d) => opening(d)), fullSites }
  }
  if (fullSites.length === 0) return empty
  const fullSet = new Set(fullSites)
  return { dates: wanted, openings: wanted.map((d) => opening(d, fullSet)), fullSites }
}

// ── night labels, shared by the push copy and the email ─────────────────────
// Calendar dates rendered at noon UTC as UTC so no timezone can shift them.

const monthDay = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
const dayOnly = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' })

/** "Oct 3" */
export function formatNight(date: string): string {
  return monthDay(date)
}

/** "Oct 3", "Oct 3–5", "Sep 30 – Oct 2", or "Oct 3, Oct 7, Oct 9 +2 more". */
export function formatNights(dates: string[]): string {
  const sorted = [...new Set(dates)].sort()
  if (sorted.length === 0) return ''
  if (sorted.length === 1) return monthDay(sorted[0])
  const contiguous = sorted.every((d, i) => i === 0 || addDaysIso(sorted[i - 1], 1) === d)
  if (contiguous) {
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    return first.slice(0, 7) === last.slice(0, 7)
      ? `${monthDay(first)}–${dayOnly(last)}`
      : `${monthDay(first)} – ${monthDay(last)}`
  }
  const shown = sorted.slice(0, 3).map(monthDay).join(', ')
  const more = sorted.length - 3
  return more > 0 ? `${shown} +${more} more` : shown
}
