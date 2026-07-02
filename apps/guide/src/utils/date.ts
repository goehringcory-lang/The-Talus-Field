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
