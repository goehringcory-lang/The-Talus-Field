// The deadline resolver is the arithmetic between the table and a buyer's
// dates, and a wrong date here is worse than none. Each rule in the JSON's
// __comment is stated as a case: the 15th rule's two halves, the cables
// season's two anchors, the relative rows' anchor days, and the season rows'
// year gate.
import { describe, expect, it } from 'vitest'
import {
  DEADLINES,
  cablesSeason,
  deadlineClock,
  memorialDay,
  parseClock,
  releaseDateFor,
  resolveDeadlines,
} from './deadlines'

const byId = (list: ReturnType<typeof resolveDeadlines>, id: string) => list.filter((d) => d.id === id)

describe('the table', () => {
  it('carries every id once', () => {
    const ids = DEADLINES.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toContain('camp-15th')
    expect(ids).toContain('halfdome-cables')
  })
})

describe('memorialDay and cablesSeason', () => {
  it('finds the last Monday in May', () => {
    expect(memorialDay(2026)).toBe('2026-05-25')
    expect(memorialDay(2027)).toBe('2027-05-31')
  })

  it('runs from the Friday before Memorial Day to the day after the second Monday in October', () => {
    expect(cablesSeason(2026)).toEqual({ start: '2026-05-22', end: '2026-10-13' })
    // 2027: Memorial Day May 31, so the Friday before is May 28; the first
    // Monday in October is the 4th, the second the 11th, down on the 12th.
    expect(cablesSeason(2027)).toEqual({ start: '2027-05-28', end: '2027-10-12' })
  })
})

describe('releaseDateFor (the 15th rule)', () => {
  it('sends an arrival on or after the 15th to the 15th five months before its own month', () => {
    expect(releaseDateFor('2027-07-15', 5)).toBe('2027-02-15')
    expect(releaseDateFor('2027-07-31', 5)).toBe('2027-02-15')
  })

  it('sends an arrival before the 15th to the release one month earlier', () => {
    expect(releaseDateFor('2027-07-14', 5)).toBe('2027-01-15')
    expect(releaseDateFor('2027-07-01', 5)).toBe('2027-01-15')
  })

  it('crosses the year boundary', () => {
    expect(releaseDateFor('2027-03-10', 5)).toBe('2026-09-15')
    expect(releaseDateFor('2027-01-20', 5)).toBe('2026-08-15')
  })
})

describe('resolveDeadlines', () => {
  const trip = resolveDeadlines('2027-07-14', '2027-07-16', '2026-09-05')

  it('applies the Half Dome daily lottery to every trip day, two days ahead', () => {
    const daily = byId(trip, 'halfdome-daily')
    expect(daily.map((d) => d.date)).toEqual(['2027-07-12', '2027-07-13', '2027-07-14'])
    expect(daily.map((d) => d.forDay)).toEqual(['2027-07-14', '2027-07-15', '2027-07-16'])
  })

  it('applies the campground rows to the arrival day only', () => {
    expect(byId(trip, 'camp-two-weeks').map((d) => d.date)).toEqual(['2027-06-30'])
    expect(byId(trip, 'camp4').map((d) => d.date)).toEqual(['2027-07-07'])
    expect(byId(trip, 'camp-15th').map((d) => d.date)).toEqual(['2027-01-15'])
  })

  it('applies the wilderness rows to the start day, the lottery as a Sunday-to-Saturday week', () => {
    expect(byId(trip, 'wilderness-week-ahead').map((d) => d.date)).toEqual(['2027-07-07'])
    const [lottery] = byId(trip, 'wilderness-lottery')
    // 168 days before July 14, 2027 is Wednesday January 27; the week is Sun 24 to Sat 30.
    expect(lottery.date).toBe('2027-01-24')
    expect(lottery.endDate).toBe('2027-01-30')
  })

  it('places annual windows and the cables rule in the trip year', () => {
    const [preseason] = byId(trip, 'halfdome-preseason')
    expect(preseason.date).toBe('2027-03-01')
    expect(preseason.endDate).toBe('2027-03-31')
    const [cables] = byId(trip, 'halfdome-cables')
    expect(cables.date).toBe('2027-05-28')
    expect(cables.endDate).toBe('2027-10-12')
  })

  it('lists season rows only when their year matches', () => {
    expect(byId(trip, 'tuolumne-shuttle-2026')).toHaveLength(0)
    const thisYear = resolveDeadlines('2026-09-20', '2026-09-22', '2026-09-05')
    expect(byId(thisYear, 'tuolumne-shuttle-2026').map((d) => d.date)).toEqual(['2026-09-13'])
    expect(byId(thisYear, 'grove-shuttle-2026')).toHaveLength(1)
  })

  it('marks a deadline past once its whole window is behind today', () => {
    const list = resolveDeadlines('2026-09-20', '2026-09-22', '2026-09-15')
    expect(byId(list, 'tuolumne-shuttle-2026')[0].past).toBe(true) // Sep 13
    expect(byId(list, 'grove-shuttle-2026')[0].past).toBe(false) // runs to Oct 31
    expect(byId(list, 'camp4')[0].past).toBe(true) // Sep 13
    expect(byId(list, 'halfdome-daily')[0].past).toBe(false) // Sep 18
  })

  it('is sorted soonest first', () => {
    const dates = trip.map((d) => d.date)
    expect([...dates].sort()).toEqual(dates)
  })

  it('is deterministic and refuses a malformed or inverted window', () => {
    expect(resolveDeadlines('2027-07-14', '2027-07-16', '2026-09-05')).toEqual(trip)
    expect(resolveDeadlines('2027-07-16', '2027-07-14', '2026-09-05')).toEqual([])
    expect(resolveDeadlines('July 14', '2027-07-16', '2026-09-05')).toEqual([])
  })
})

describe('parseClock and deadlineClock', () => {
  it('reads house-style times', () => {
    expect(parseClock('7 a.m.')).toBe(7 * 60)
    expect(parseClock('4 p.m.')).toBe(16 * 60)
    expect(parseClock('12 a.m.')).toBe(0)
    expect(parseClock('12 p.m.')).toBe(12 * 60)
    expect(parseClock('8:30 p.m.')).toBe(20 * 60 + 30)
    expect(parseClock('midnight')).toBe(0)
    expect(parseClock('all day')).toBeNull()
  })

  it('turns a single time into an hour and a range into its span', () => {
    expect(deadlineClock('7 a.m.')).toEqual({ startMin: 420, durationMin: 60 })
    expect(deadlineClock('midnight to 4 p.m.')).toEqual({ startMin: 0, durationMin: 16 * 60 })
  })

  it('leaves windows and prose as all-day', () => {
    expect(deadlineClock('all day')).toBeNull()
    expect(deadlineClock('no fixed date')).toBeNull()
    expect(deadlineClock('Sunday to Saturday')).toBeNull()
    expect(deadlineClock('8 a.m. to 7 p.m. through September 23, then 8 to 5')).toBeNull()
  })
})
