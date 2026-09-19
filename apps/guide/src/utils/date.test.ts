// Park-local calendar dates. The product is Pacific: a UTC date after about
// 5 p.m. PDT rolls to tomorrow, which would default a trip to the wrong day
// and hide this evening's programs. Vitest runs in whatever zone CI has (UTC),
// so every case pins an instant and expects the Pacific answer.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { addDaysIso, formatClock, formatDayHeader, parkNowMinutes, todayIso, tripDatesLabel } from './date'

afterEach(() => vi.useRealTimers())

const at = (iso: string) => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(iso))
}

describe('todayIso and parkNowMinutes', () => {
  it('is still the 3rd at 8:30 p.m. Pacific, though UTC has moved on', () => {
    at('2026-07-04T03:30:00Z')
    expect(todayIso()).toBe('2026-07-03')
    expect(parkNowMinutes()).toBe(20 * 60 + 30)
  })

  it('reads midnight as minute zero, not 24 hours', () => {
    at('2026-01-15T08:00:00Z') // 00:00 PST
    expect(todayIso()).toBe('2026-01-15')
    expect(parkNowMinutes()).toBe(0)
  })
})

describe('addDaysIso', () => {
  it('crosses month ends and the spring-forward date without drift', () => {
    expect(addDaysIso('2026-02-28', 1)).toBe('2026-03-01')
    expect(addDaysIso('2026-03-08', 1)).toBe('2026-03-09')
    expect(addDaysIso('2026-03-09', -1)).toBe('2026-03-08')
    expect(addDaysIso('2026-12-31', 1)).toBe('2027-01-01')
  })
})

describe('the labels', () => {
  it('spells a day header and a trip range the same way everywhere', () => {
    expect(formatDayHeader('2026-07-14')).toBe('Tuesday, July 14')
    expect(tripDatesLabel({ start: '2026-07-20', end: '2026-07-24' })).toBe('Jul 20–24')
    expect(tripDatesLabel({ start: '2026-06-29', end: '2026-07-02' })).toBe('Jun 29 – Jul 2')
  })

  it('formats the clock in house style and wraps past midnight', () => {
    expect(formatClock(0)).toBe('12 a.m.')
    expect(formatClock(12 * 60 + 30)).toBe('12:30 p.m.')
    expect(formatClock(24 * 60 + 30)).toBe('12:30 a.m.')
    expect(formatClock(9 * 60)).toBe('9 a.m.')
  })
})
