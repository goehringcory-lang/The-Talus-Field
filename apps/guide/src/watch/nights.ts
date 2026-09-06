// Pure date arithmetic and labels for campsite watches. The form speaks
// arrive / leave like the trip board; the API takes a first night and a
// count, and the two conversions live here so they cannot drift apart.
// No clock in this module: callers pass today.

import { addDaysIso } from '../utils/date'

// The Worker's limits (workers/src/routes/watch.ts), mirrored for the form's
// min/max attributes.
export const MAX_WATCH_NIGHTS = 14
export const MAX_DAYS_AHEAD = 190

/** Nights between an arrival and a departure morning; never negative. */
export function nightsBetween(arrive: string, leave: string): number {
  const ms = Date.parse(`${leave}T00:00:00Z`) - Date.parse(`${arrive}T00:00:00Z`)
  return Math.max(0, Math.round(ms / 86_400_000))
}

/** The last night a watch covers. */
export function lastNightOf(start: string, nights: number): string {
  return addDaysIso(start, Math.max(1, nights) - 1)
}

/** The morning after the last night, which is what "Leaving" means. */
export function leaveDateOf(start: string, nights: number): string {
  return addDaysIso(start, Math.max(1, nights))
}

/** Clamp a leave date to one night after arrival and at most MAX_WATCH_NIGHTS. */
export function clampLeave(arrive: string, leave: string): string {
  const nights = nightsBetween(arrive, leave)
  if (nights < 1) return addDaysIso(arrive, 1)
  if (nights > MAX_WATCH_NIGHTS) return addDaysIso(arrive, MAX_WATCH_NIGHTS)
  return leave
}

const monthDay = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
const dayOnly = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' })

/** "Oct 3" */
export function nightLabel(date: string): string {
  return monthDay(date)
}

/** "Oct 3", "Oct 3–5", "Sep 30 – Oct 2", or "Oct 3, Oct 7, Oct 9 +2 more":
 *  the same shape the Worker prints in its push and email copy. */
export function nightsLabel(dates: string[]): string {
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

/** "2 nights" */
export function nightsCount(nights: number): string {
  return `${nights} ${nights === 1 ? 'night' : 'nights'}`
}
