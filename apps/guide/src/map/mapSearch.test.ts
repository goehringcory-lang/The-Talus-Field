import { describe, expect, it } from 'vitest'
import { searchMap } from './mapSearch'
import { programPoints } from './programPoints'
import type { ProgramEventT } from '../programs/schema'

const ev = (id: string, date: string, coord?: [number, number], timeStart?: string): ProgramEventT => ({
  id,
  source: 'manual',
  category: 'ranger',
  title: `Program ${id}`,
  description: '',
  date,
  timeStart,
  location: 'Yosemite Valley Welcome Center',
  ...(coord ? { coord } : {}),
})

describe('program meeting points', () => {
  it('groups programs by where they meet, soonest first, and counts the ones with nowhere to pin', () => {
    const { points, unplaced } = programPoints(
      [
        ev('b', '2026-10-04', [-119.58523, 37.74716], '10:00'),
        ev('a', '2026-10-03', [-119.58524, 37.74717], '14:00'),
        ev('old', '2026-09-01', [-119.58523, 37.74716]),
        ev('nowhere', '2026-10-03'),
      ],
      '2026-10-01',
    )
    expect(points).toHaveLength(1)
    expect(points[0].events.map((e) => e.id)).toEqual(['a', 'b'])
    expect(unplaced).toBe(1)
  })
})

describe('map search', () => {
  it('finds a waterfall by its plural, the way /search does', () => {
    const hits = searchMap('vernal falls')
    expect(hits[0].title).toMatch(/Vernal/)
  })

  it('finds trails, parking and places to eat, each with a coordinate', () => {
    expect(searchMap('mist trail').some((h) => h.kind === 'trail')).toBe(true)
    expect(searchMap('shuttle stop 16').some((h) => h.kind === 'place' && h.id === 'shuttle-stop-16')).toBe(true)
    expect(searchMap('degnan').some((h) => h.kind === 'meal' || h.kind === 'place')).toBe(true)
    for (const h of searchMap('lake')) expect(h.coord).toHaveLength(2)
  })

  it('searches program meeting points by the programs held there', () => {
    const { points } = programPoints([ev('x', '2026-10-03', [-119.585, 37.747], '10:00')], '2026-10-01')
    points[0].events[0] = { ...points[0].events[0], title: 'Night sky walk' }
    expect(searchMap('night sky', points)[0].kind).toBe('program')
  })

  it('answers nothing for a one-letter query', () => {
    expect(searchMap('a')).toEqual([])
  })
})
