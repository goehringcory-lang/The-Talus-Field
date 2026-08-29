// Calendar-date helpers. The product is Pacific-timezone (Yosemite), so
// "today" must be the park-local date, not UTC. A UTC date after ~5pm PDT
// rolls to tomorrow, which would default a California user's trip to the
// wrong day and filter out this evening's programs.
const PACIFIC = 'America/Los_Angeles'

/** Park-local (Pacific) calendar date as YYYY-MM-DD. */
export function todayIso(): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: PACIFIC }).format(new Date())
}

/** Minutes from park-local midnight, for the agenda's "now" rule. */
export function parkNowMinutes(): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PACIFIC,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
  // en-US hour12:false renders midnight as 24 in some engines.
  return (hour % 24) * 60 + minute
}

/** Add `days` (may be negative) to a YYYY-MM-DD date, returning YYYY-MM-DD. */
export function addDaysIso(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** "Tuesday, July 14" for a YYYY-MM-DD date (calendar date, timezone-safe). */
export function formatDayHeader(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** "Jul 20–24" or "Jun 29 – Jul 2" for a {start, end} of YYYY-MM-DD dates.
 * Timezone-safe: noon UTC, formatted as UTC, same idiom as forecastDays.
 * Shared by Home's trip strip and the field card, so the two spell a trip
 * the same way. */
export function tripDatesLabel(dates: { start: string; end: string }): string {
  const fmt = (iso: string) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
  const sameMonth = dates.start.slice(0, 7) === dates.end.slice(0, 7)
  if (sameMonth) {
    const endDay = new Date(`${dates.end}T12:00:00Z`).toLocaleDateString('en-US', {
      day: 'numeric',
      timeZone: 'UTC',
    })
    return `${fmt(dates.start)}–${endDay}`
  }
  return `${fmt(dates.start)} – ${fmt(dates.end)}`
}

/** "9:30 a.m." for minutes from midnight, house style. */
export function formatClock(minutes: number): string {
  // Callers add a duration to a start (a 23:30 program plus an hour), so the
  // value can run past midnight; without the wrap that reads as p.m.
  const wrapped = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  const ampm = h >= 12 ? 'p.m.' : 'a.m.'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour12} ${ampm}` : `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
}
