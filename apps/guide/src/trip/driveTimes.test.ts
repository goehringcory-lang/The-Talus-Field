// The drive-time table and the anchoring rules, stated as cases. The figures
// are the park's (content/driveTimes.ts cites the page); these check that the
// tree reproduces every published figure exactly, that every place the guide
// sends a reader anchors somewhere sensible, and that the two traps the module
// was built around stay shut: a Valley program must never snap to Glacier
// Point's pin, and a spur-road lot must never claim a highway stop.
import { describe, expect, it } from 'vitest'
import { HIKES, SECRET_SPOTS, stops } from '../content'
import { DRIVE_NODES, REGION_DRIVE_NODES, SECRET_SPOT_DRIVE_NODE } from '../content/driveTimes'
import { haversineMiles } from '../utils/geo'
import {
  driveNodeForHike,
  driveNodeForItem,
  driveNodeForStop,
  publishedDriveMinutes,
  resolveDriveNodeAt,
  treeMinutes,
} from './driveTimes'
import { driveMinutesBetween } from './slotting'
import { programItemId, stopItemId } from './schema'
import type { TripItemT } from './schema'

const DAY = '2026-07-15'
const stop = (stopId: string): TripItemT => ({ type: 'stop', itemId: stopItemId(stopId, DAY), stopId, day: DAY })
const programAt = (coord: [number, number]): TripItemT => ({
  type: 'program',
  itemId: programItemId('p'),
  programId: 'p',
  snapshot: { id: 'p', source: 'nps', category: 'talk', title: 'Talk', description: '', date: DAY, timeStart: '12:00', coord },
})

describe('the published table', () => {
  it('resolves every point to a real guide entry with a coordinate', () => {
    for (const n of DRIVE_NODES) {
      if (!n.at) continue
      expect(resolveDriveNodeAt(n.at), `${n.id} -> ${n.at}`).toBeDefined()
    }
  })

  it('is a tree rooted at the Valley whose times never run backwards', () => {
    const byId = new Map(DRIVE_NODES.map((n) => [n.id, n]))
    for (const n of DRIVE_NODES) {
      if (n.parent === null) {
        expect(n.id).toBe('valley')
        continue
      }
      const parent = byId.get(n.parent)
      expect(parent, `${n.id}'s parent ${n.parent}`).toBeDefined()
      expect(n.minutes).toBeGreaterThanOrEqual(parent!.minutes)
    }
  })

  it('reproduces every published minutes-from-the-Valley figure exactly', () => {
    for (const n of DRIVE_NODES) expect(treeMinutes('valley', n.id), n.id).toBe(n.minutes)
  })

  it('prices a leg across two roads through the point where they part', () => {
    // Glacier Point Road and Wawona Road part at Chinquapin (30).
    expect(treeMinutes('glacier-point', 'south-entrance')).toBe(60 - 30 + (60 - 30))
    // Hetch Hetchy and Tuolumne part at Crane Flat (30).
    expect(treeMinutes('hetch-hetchy', 'tuolumne-meadows')).toBe(75 - 30 + (90 - 30))
    expect(treeMinutes('tunnel-view', 'glacier-point')).toBe(45)
    expect(treeMinutes('glacier-point', 'glacier-point')).toBe(0)
  })
})

describe('anchoring', () => {
  it('gives every secret spot with a coordinate a hand-named point, and names no spot that is gone', () => {
    for (const s of SECRET_SPOTS) {
      if (s.coord) expect(SECRET_SPOT_DRIVE_NODE[s.id], s.id).toBeDefined()
    }
    const ids = new Set(SECRET_SPOTS.map((s) => s.id))
    for (const id of Object.keys(SECRET_SPOT_DRIVE_NODE)) expect(ids.has(id), id).toBe(true)
  })

  it('anchors every stop and hike with a coordinate to a point in its own region, within eight miles', () => {
    const coordOf = new Map(DRIVE_NODES.filter((n) => n.at).map((n) => [n.id, resolveDriveNodeAt(n.at!)!]))
    for (const s of stops) {
      if (!s.coord) continue
      const node = driveNodeForStop(s)
      expect(node, s.id).not.toBeNull()
      expect(REGION_DRIVE_NODES[s.region]).toContain(node)
      expect(haversineMiles(s.coord, coordOf.get(node!)!), s.id).toBeLessThanOrEqual(8)
    }
    for (const h of HIKES) {
      if (!h.coord) continue
      const node = driveNodeForHike(h)
      expect(node, h.id).not.toBeNull()
      expect(REGION_DRIVE_NODES[h.region]).toContain(node)
      expect(haversineMiles(h.coord, coordOf.get(node!)!), h.id).toBeLessThanOrEqual(8)
    }
  })

  it('keeps a spur-road lot from claiming the highway stop beside it', () => {
    // May Lake's lot is up a side road; Olmsted Point is on Tioga Road.
    expect(driveNodeForItem(stop('olmsted-point'))).toBe('tenaya-lake')
    expect(driveNodeForItem(stop('may-lake'))).toBe('may-lake')
  })

  it('never lets a Valley-floor program snap to the Glacier Point pin a mile overhead', () => {
    // Curry Village: nearer Glacier Point's pin than the Welcome Center's.
    expect(driveNodeForItem(programAt([-119.5726, 37.7377]))).toBe('valley')
    // And a program far from any guide stop has no anchor at all.
    expect(driveNodeForItem(programAt([-118.9, 37.75]))).toBeNull()
  })
})

describe('what the trip board prints', () => {
  it('puts Glacier Point an hour above the Valley, not fifteen minutes', () => {
    // The board used to show 15 min for this leg from straight-line distance.
    expect(publishedDriveMinutes(stop('yosemite-village'), stop('glacier-point'))).toBe(60)
    expect(driveMinutesBetween(stop('yosemite-village'), stop('glacier-point'))).toBe(70)
  })

  it('leaves the short hops to the straight-line estimate', () => {
    // Same published point: the table cannot resolve it.
    expect(publishedDriveMinutes(stop('glacier-point'), stop('washburn-point'))).toBeNull()
    // Two Valley-floor points: the one-way loops are not in the tree.
    expect(publishedDriveMinutes(stop('tunnel-view'), stop('cooks-meadow-loop'))).toBeNull()
  })
})
