// The Secret Guide's hand-kept tables point at entries by id: the picks, the
// routes, the chapter photos. A retired or renamed entry would drop a pick
// or a route stop without a word on the page, so each reference is held to
// a real entry here, and each route leg to a price the planner can give.
import { describe, expect, it } from 'vitest'
import {
  SECRET_GUIDE_CATEGORIES,
  SECRET_GUIDE_PICKS,
  SECRET_ROUTES,
  getSecretGuideEntries,
  getStopById,
} from './index'
import { driveMinutesBetween } from '../trip/slotting'
import type { TripItemT } from '../trip/schema'

const entries = getSecretGuideEntries()
const ids = new Set(entries.map((s) => s.id))

function item(stopId: string): TripItemT {
  return { type: 'stop', itemId: stopId, stopId, day: '2026-07-01', eventUid: stopId } as TripItemT
}

describe('the Secret Guide tables', () => {
  it('names a real Secret Guide entry in every pick', () => {
    for (const p of SECRET_GUIDE_PICKS) expect(ids.has(p.id), p.id).toBe(true)
  })

  it('gives every chapter entries, and a photo entry from its own chapter', () => {
    for (const c of SECRET_GUIDE_CATEGORIES) {
      const inChapter = entries.filter((s) => s.category === c.id)
      expect(inChapter.length, c.id).toBeGreaterThan(0)
      const photoEntry = inChapter.find((s) => s.id === c.photo)
      expect(photoEntry, `${c.id} photo ${c.photo}`).toBeDefined()
      expect(photoEntry?.photos.length, c.photo).toBeGreaterThan(0)
    }
  })

  it('builds every route from real stops, mostly Secret Guide entries, each leg priced', () => {
    for (const r of SECRET_ROUTES) {
      expect(r.stops.length, r.id).toBeGreaterThanOrEqual(3)
      const secret = r.stops.filter((s) => ids.has(s.id)).length
      expect(secret, `${r.id} is a Secret Guide route`).toBeGreaterThan(r.stops.length / 2)
      r.stops.forEach((s, i) => {
        const stop = getStopById(s.id)
        expect(stop, `${r.id}: ${s.id}`).toBeDefined()
        expect(stop?.coord, `${r.id}: ${s.id} needs a pin to be driven to`).toBeDefined()
        if (i > 0) {
          const leg = driveMinutesBetween(item(r.stops[i - 1].id), item(s.id))
          expect(leg, `${r.id}: leg into ${s.id}`).not.toBeNull()
        }
      })
    }
  })

  it('books programs only through a named source, and prices no entry outside Programs', () => {
    for (const s of entries) {
      if (s.booking) expect(s.category, `${s.id} carries a booking link`).toBe('programs')
      if (s.kind === 'program') expect(s.category, s.id).toBe('programs')
    }
  })
})
