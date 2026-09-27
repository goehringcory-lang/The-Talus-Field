import { describe, expect, it } from 'vitest'
import { OFFLINE_REGIONS, overviewTiles, regionTiles, tilesInBbox, lat2y, lng2x, inBbox, MAP_EXTENT } from './regions'
import { TILESET } from './tiles.generated'

describe('offline map regions', () => {
  // The sizes a reader is shown before a download were measured by
  // gen-map-tiles.ts over these exact tile lists. A box edited without
  // rerunning the generator would show one size and fetch another.
  it('matches the tile counts the generator measured', () => {
    expect(TILESET.packs.overview.tiles).toBe(overviewTiles().length)
    for (const r of OFFLINE_REGIONS) expect(TILESET.packs[r.id]?.tiles, r.id).toBe(regionTiles(r.id).length)
  })

  it('keeps every region inside the archive extent', () => {
    for (const r of OFFLINE_REGIONS) {
      const [w, s, e, n] = r.bbox
      expect(inBbox([w, s], MAP_EXTENT) && inBbox([e, n], MAP_EXTENT), r.id).toBe(true)
    }
  })

  it('adds only trailhead-scale zooms on top of the overview', () => {
    const overview = new Set(overviewTiles().map((t) => `${t.kind}/${t.z}/${t.x}/${t.y}`))
    for (const r of OFFLINE_REGIONS) {
      for (const t of regionTiles(r.id)) expect(overview.has(`${t.kind}/${t.z}/${t.x}/${t.y}`)).toBe(false)
    }
  })

  it('addresses the slippy pyramid the way the tile servers do', () => {
    // Half Dome at z12 is tile 687/1583; the elevation read there through the
    // Worker's archive is the summit's (2,684 m at z13).
    expect([lng2x(-119.5332, 12), lat2y(37.746, 12)]).toEqual([687, 1583])
    const tiles = [...tilesInBbox([-119.6, 37.7, -119.5, 37.8], 10)]
    expect(tiles.every(([z]) => z === 10)).toBe(true)
    expect(tiles.length).toBeGreaterThan(0)
  })
})
