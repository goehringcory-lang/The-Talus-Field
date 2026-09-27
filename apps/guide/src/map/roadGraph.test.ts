import { describe, expect, it } from 'vitest'
import { GRAPH_FLAGS, RoadGraph, decodePolyline, encodePolyline, type Pt, type RoadGraphFile } from './roadGraph'
import { ROADS_URL } from './mapData.generated'

const MILE = 1609.34

describe('polyline codec', () => {
  it('round-trips at five decimals, negatives included', () => {
    const line: Pt[] = [[-119.60073, 37.74158], [-119.5704, 37.73825], [-119.53321, 37.74604]]
    expect(decodePolyline(encodePolyline(line))).toEqual(line)
  })
})

// A square block with one one-way side, small enough to reason about:
//   0 ---- 1
//   |      |      0->1 is one-way east; everything else is two-way.
//   3 ---- 2      The footpath 0-2 is walk-only, cutting the corner.
function toyGraph(): RoadGraph {
  const pts: Pt[] = [[0, 0.01], [0.01, 0.01], [0.01, 0], [0, 0]]
  const both = GRAPH_FLAGS.DRIVE_FORWARD | GRAPH_FLAGS.DRIVE_BACKWARD | GRAPH_FLAGS.WALK
  const file: RoadGraphFile = {
    v: 1,
    licence: 'test',
    osm: 'test',
    nodes: pts.flatMap(([x, y]) => [Math.round(x * 1e5), Math.round(y * 1e5)]),
    edges: [
      [0, 1, 1100, GRAPH_FLAGS.DRIVE_FORWARD | GRAPH_FLAGS.WALK, encodePolyline([pts[0], pts[1]])],
      [1, 2, 1100, both, encodePolyline([pts[1], pts[2]])],
      [2, 3, 1100, both, encodePolyline([pts[2], pts[3]])],
      [3, 0, 1100, both, encodePolyline([pts[3], pts[0]])],
      [0, 2, 1560, GRAPH_FLAGS.WALK, encodePolyline([pts[0], pts[2]])],
    ],
  }
  return new RoadGraph(file)
}

describe('RoadGraph on a toy block', () => {
  it('drives with a one-way street, and around the block against it', () => {
    const g = toyGraph()
    const east = g.route([0, 0.01], [0.01, 0.01], 'drive')
    const west = g.route([0.01, 0.01], [0, 0.01], 'drive')
    expect(east?.metres).toBe(1100)
    expect(west?.metres).toBe(3300)
  })

  it('walks the footpath a car may not use, in both directions', () => {
    const g = toyGraph()
    expect(g.route([0, 0.01], [0.01, 0], 'walk')?.metres).toBe(1560)
    expect(g.route([0.01, 0], [0, 0.01], 'walk')?.metres).toBe(1560)
    expect(g.route([0, 0.01], [0.01, 0], 'drive')?.metres).toBe(2200)
  })

  it('refuses a route when an end is too far from the network', () => {
    const g = toyGraph()
    expect(g.route([0, 0.01], [0.2, 0.2], 'drive')).toBeNull()
  })

  it('starts and ends the line at the points asked for', () => {
    const r = toyGraph().route([0.0001, 0.0101], [0.01, 0.0001], 'drive')!
    expect(r.coords[0]).toEqual([0.0001, 0.0101])
    expect(r.coords[r.coords.length - 1]).toEqual([0.01, 0.0001])
  })
})

// The committed graph, checked against distances the park publishes, so a
// regeneration that loses a road, a one-way rule or a junction fails here.
describe('the park road graph', () => {
  // The generator removes the previous file, so the glob holds exactly the
  // one ROADS_URL names; the lookup by name fails loudly if they disagree.
  const files = import.meta.glob<RoadGraphFile>('../../public/map/roads-*.json', { eager: true, import: 'default' })
  const file = files[`../../public${ROADS_URL}`]
  it('is the graph ROADS_URL names', () => {
    expect(Object.keys(files)).toEqual([`../../public${ROADS_URL}`])
  })
  const g = new RoadGraph(file)
  const lodge: Pt = [-119.600732, 37.74158] // shuttle stop 7, NPS record
  const curry: Pt = [-119.570411, 37.738246] // shuttle stop 14
  const glacier: Pt = [-119.5741, 37.7277]
  const tuolumne: Pt = [-119.3598, 37.8759]

  it('carries the OSM licence it is published under', () => {
    expect(file.licence).toMatch(/Open Database License/)
  })

  it('reaches Glacier Point and Tuolumne at the published road distances', () => {
    // NPS: Glacier Point is about 30 miles from the Valley, Tuolumne Meadows about 55.
    expect(g.route(lodge, glacier, 'drive')!.metres / MILE).toBeGreaterThan(28)
    expect(g.route(lodge, glacier, 'drive')!.metres / MILE).toBeLessThan(33)
    expect(g.route(lodge, tuolumne, 'drive')!.metres / MILE).toBeGreaterThan(51)
    expect(g.route(lodge, tuolumne, 'drive')!.metres / MILE).toBeLessThan(58)
  })

  it('keeps the Valley loop one-way: the Lodge to Curry Village goes round by El Capitan', () => {
    const out = g.route(lodge, curry, 'drive')!.metres
    const back = g.route(curry, lodge, 'drive')!.metres
    expect(out).toBeGreaterThan(back * 2)
  })
})
