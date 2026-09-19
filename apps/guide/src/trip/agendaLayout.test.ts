// The board's geometry, stated as cases: two things at the same hour share the
// track side by side, a gap resets the widths, and a day's window always
// leaves an hour of empty timeline past its first and last block, because a
// drag with nowhere later to go clamps straight back where it was.
import { describe, expect, it } from 'vitest'
import { clockLabel, dayWindowFor, durationLabel, hourMarks, layoutDay, snapMinutes } from './agendaLayout'
import type { SlottedItem } from './slotting'

// A slotted custom item: no content lookup, nothing but a start and a length.
const block = (title: string, startMin: number | null, durationMin: number): SlottedItem => ({
  item: { type: 'custom', itemId: `custom:${title}`, title, day: '2026-07-04' },
  day: '2026-07-04',
  startMin,
  durationMin,
  fixed: false,
})
const laneOf = (layout: ReturnType<typeof layoutDay>, title: string) => {
  const p = layout.placed.find((x) => x.s.item.itemId === `custom:${title}`)
  if (!p) throw new Error(`not placed: ${title}`)
  return p
}

describe('layoutDay', () => {
  it('gives disjoint blocks the full track', () => {
    const l = layoutDay([block('a', 480, 60), block('b', 600, 60)])
    expect(l.placed.map((p) => [p.lane, p.lanes])).toEqual([[0, 1], [0, 1]])
    expect(l.loose).toEqual([])
  })

  it('packs an overlap into two lanes and resets after a gap', () => {
    const l = layoutDay([block('a', 480, 90), block('b', 540, 60), block('c', 720, 30)])
    expect(laneOf(l, 'a').lane).toBe(0)
    expect(laneOf(l, 'b').lane).toBe(1)
    expect(laneOf(l, 'a').lanes).toBe(2)
    expect(laneOf(l, 'b').lanes).toBe(2)
    // Nothing runs at noon: c is its own cluster and takes the whole width.
    expect(laneOf(l, 'c').lane).toBe(0)
    expect(laneOf(l, 'c').lanes).toBe(1)
  })

  it('chains a transitive overlap into one cluster and reuses a freed lane', () => {
    // a 8-9, b 8:30-9:30, c 9:00-9:15: c overlaps b, not a, and takes a's lane.
    const l = layoutDay([block('a', 480, 60), block('b', 510, 60), block('c', 540, 15)])
    expect(laneOf(l, 'c').lane).toBe(0)
    expect(l.placed.every((p) => p.lanes === 2)).toBe(true)
  })

  it('sorts by start, longer first on a tie, and sends unplaced items to loose', () => {
    const l = layoutDay([block('short', 480, 30), block('none', null, 60), block('long', 480, 120)])
    expect(l.placed.map((p) => p.s.item.itemId)).toEqual(['custom:long', 'custom:short'])
    expect(l.loose.map((s) => s.item.itemId)).toEqual(['custom:none'])
  })

  it('draws a zero-minute block one minute tall so it stays hittable', () => {
    const p = layoutDay([block('zero', 600, 0)]).placed[0]
    expect(p.endMin - p.startMin).toBe(1)
  })
})

describe('dayWindowFor', () => {
  it('is the default park day plus its headroom when nothing is placed', () => {
    // 07:00 to 21:00 is the day; the hour either side is the drag room, and
    // an empty day keeps it so the first drop has somewhere to land.
    expect(dayWindowFor([])).toEqual({ from: 6 * 60, to: 22 * 60 })
  })

  it('widens by an hour past the earliest and latest block, on the hour', () => {
    const early = layoutDay([block('a', 6 * 60 + 30, 30)]).placed
    expect(dayWindowFor(early).from).toBe(5 * 60)
    const late = layoutDay([block('b', 21 * 60, 30)]).placed
    expect(dayWindowFor(late).to).toBe(23 * 60)
  })

  it('follows a 3 a.m. alpine start down and caps a star party at 2 a.m. next day', () => {
    expect(dayWindowFor(layoutDay([block('alpine', 3 * 60, 60)]).placed).from).toBe(2 * 60)
    expect(dayWindowFor(layoutDay([block('stars', 22 * 60, 4 * 60)]).placed).to).toBe(26 * 60)
    expect(dayWindowFor(layoutDay([block('dawn', 20, 30)]).placed).from).toBe(0)
  })

  it('never draws a track shorter than six hours', () => {
    const win = dayWindowFor(layoutDay([block('a', 480, 60)]).placed)
    expect(win.to - win.from).toBeGreaterThanOrEqual(6 * 60)
  })
})

describe('the clock helpers', () => {
  it('lists an hour mark per hour of the window, inclusive', () => {
    expect(hourMarks({ from: 420, to: 600 })).toEqual([420, 480, 540, 600])
  })

  it('labels the clock in house style and wraps past midnight', () => {
    expect(clockLabel(0)).toBe('12 a.m.')
    expect(clockLabel(9 * 60 + 30)).toBe('9:30 a.m.')
    expect(clockLabel(12 * 60)).toBe('12 p.m.')
    expect(clockLabel(24 * 60 + 30)).toBe('12:30 a.m.')
  })

  it('formats durations and snaps to the five-minute grain', () => {
    expect(durationLabel(45)).toBe('45m')
    expect(durationLabel(60)).toBe('1h')
    expect(durationLabel(90)).toBe('1h 30m')
    expect(snapMinutes(63)).toBe(65)
    expect(snapMinutes(62)).toBe(60)
  })
})
