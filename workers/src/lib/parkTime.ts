// =============================================================================
// Park-local time. The reader is in America/Los_Angeles year round, and every
// "today" in the Worker that touches a trip day, a program, or a campsite
// night has to be that calendar date, not UTC's: a UTC date after about 5pm
// Pacific has already rolled to tomorrow. Shared by the push sweep, the
// campsite watch route, and the availability sweep so the three can never
// disagree about what day it is.
// =============================================================================

const PARK_TZ = 'America/Los_Angeles'

export function parkNow(at: Date): { date: string; hour: number } {
  // en-CA gives YYYY-MM-DD; the park is America/Los_Angeles year round.
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: PARK_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  })
  const parts = fmt.formatToParts(at)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    // Intl can render midnight as "24" in some engines; normalize it.
    hour: Number.parseInt(get('hour'), 10) % 24,
  }
}

/** The park's calendar date, YYYY-MM-DD. */
export function parkToday(at = new Date()): string {
  return parkNow(at).date
}

/** "7:05 a.m." park time, house style, for copy that names a clock time. */
export function parkClock(at: Date | string): string {
  const d = typeof at === 'string' ? new Date(at) : at
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PARK_TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(d)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const period = get('dayPeriod').toLowerCase().startsWith('p') ? 'p.m.' : 'a.m.'
  return `${get('hour')}:${get('minute')} ${period}`
}
