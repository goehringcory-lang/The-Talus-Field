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

/** "9:30 a.m." for minutes from midnight, house style. */
export function formatClock(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const ampm = h >= 12 ? 'p.m.' : 'a.m.'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour12} ${ampm}` : `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
}
