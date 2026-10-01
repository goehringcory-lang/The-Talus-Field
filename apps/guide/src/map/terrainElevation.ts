// =============================================================================
// One covering-tile pass per frame for terrain elevation lookups, not one per
// pin.
//
// With 3D terrain on, every DOM marker places itself on each camera move with
// `map.project`, which asks the terrain for the ground's elevation under the
// pin. MapLibre's `Terrain.getElevationForLngLat` answers by computing the
// full set of covering tiles for the current camera, only to take the highest
// tile zoom in it, and then samples the DEM at that zoom. The zoom depends on
// the camera alone, never on the point, yet the ~260 pins recomputed it one
// after another, every frame: in the September 2026 profile that covering-tile
// pass (`coveringTiles`, `getTileBoundingVolume`) was the single largest cost
// of a pan once the GPU readbacks were gone (map/pinMarker.ts,
// map/scaleControl.ts).
//
// This wraps the method on each Terrain the map creates (MapLibre builds a
// new one on every `setTerrain`, and fires 'terrain' when it does) so the
// zoom is computed once per camera per frame with the same options through
// the public `map.coveringTiles`, and every lookup after the first samples
// the DEM directly. Same zoom, same sample, same answer; only the repeats go.
// A lookup against any other transform (a camera animation's scratch copy)
// falls through to the original.
// =============================================================================

import type maplibregl from 'maplibre-gl'

type Terrain = NonNullable<maplibregl.Map['terrain']>
type Transform = Parameters<Terrain['getElevationForLngLat']>[1]

const wrapped = new WeakSet<Terrain>()

function cameraOf(t: Transform): number[] {
  return [t.center.lng, t.center.lat, t.zoom, t.pitch, t.bearing, t.roll, t.width, t.height, t.elevation]
}

function sameCamera(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

function wrap(map: maplibregl.Map, terrain: Terrain, renders: () => number) {
  if (wrapped.has(terrain)) return
  wrapped.add(terrain)
  const original = terrain.getElevationForLngLat.bind(terrain)
  let camera: number[] = []
  let frame = -1
  let zoom = 0
  terrain.getElevationForLngLat = (lnglat, transform) => {
    if (transform !== (map.transform as Transform)) return original(lnglat, transform)
    const now = cameraOf(transform)
    // Tiles loading between frames can change the covering set under a still
    // camera, so the cached zoom also lasts no longer than one frame.
    if (frame !== renders() || !sameCamera(now, camera)) {
      const tm = terrain.tileManager
      // Exactly the options MapLibre's own implementation passes; `terrain`
      // is accepted at runtime though the public options type omits it.
      const tiles = map.coveringTiles({
        maxzoom: tm.maxzoom,
        minzoom: tm.minzoom,
        tileSize: 512,
        terrain,
      } as maplibregl.CoveringTilesOptions)
      zoom = 0
      for (const tile of tiles) if (tile.canonical.z > zoom) zoom = Math.min(tile.canonical.z, tm.maxzoom)
      camera = now
      frame = renders()
    }
    return terrain.getElevationForLngLatZoom(lnglat, zoom)
  }
}

/** Wrap the map's terrain now and every terrain it creates later. */
export function shareTerrainElevation(map: maplibregl.Map) {
  let renders = 0
  map.on('render', () => {
    renders++
  })
  const onTerrain = () => {
    if (map.terrain) wrap(map, map.terrain, () => renders)
  }
  map.on('terrain', onTerrain)
  onTerrain()
}
