// =============================================================================
// The 2D/3D switch, with the relief rising and settling alongside the tilt.
//
// `setTerrain` swaps the mountains in or out in one frame. Going to 2D that
// was the worst frame on the map: at 60 degrees of tilt the whole Sierra
// dropped flat under the reader, and only then did the camera start to level.
// Terrain exaggeration is a live uniform MapLibre reads every draw (and the
// CPU elevation lookups multiply by the same field), so the switch instead
// adds terrain at zero height and grows it to full while the camera tilts
// down into 3D, and going out it flattens the relief while the camera levels,
// dropping the terrain only once it is flat, when removing it changes
// nothing on screen. A gesture or another switch that interrupts the ease
// finishes the change at once; so does reduced motion, where MapLibre skips
// the ease itself.
// =============================================================================

import type maplibregl from 'maplibre-gl'
import { TERRAIN_SPEC } from './style'
import { TERRAIN_EXAGGERATION } from './theme'

let generation = 0

const smooth = (k: number) => k * k * (3 - 2 * k)

function animateExaggeration(
  map: maplibregl.Map,
  from: number,
  to: number,
  duration: number,
  ease: () => void,
  done: () => void,
) {
  // Bumped before the ease starts, so the moveend an interrupted switch
  // fires from inside it finds itself stale and does nothing.
  const gen = ++generation
  const t0 = performance.now()
  const step = () => {
    if (gen !== generation || !map.terrain) return
    const k = Math.min(1, (performance.now() - t0) / duration)
    map.terrain.exaggeration = from + (to - from) * smooth(k)
  }
  const end = () => {
    map.off('move', step)
    map.off('moveend', end)
    if (gen === generation) done()
  }
  ease()
  if (!map.isMoving()) {
    done()
    return
  }
  map.on('move', step)
  map.on('moveend', end)
}

export function easeInto3d(map: maplibregl.Map, camera: maplibregl.EaseToOptions, duration = 600) {
  if (!map.terrain) map.setTerrain({ ...TERRAIN_SPEC, exaggeration: 0 })
  const from = map.terrain?.exaggeration ?? 0
  animateExaggeration(
    map,
    from,
    TERRAIN_EXAGGERATION,
    duration,
    () => map.easeTo({ ...camera, duration }),
    () => {
      if (!map.terrain) return
      map.terrain.exaggeration = TERRAIN_EXAGGERATION
      map.triggerRepaint()
    },
  )
}

export function easeOutOf3d(map: maplibregl.Map, camera: maplibregl.EaseToOptions, duration = 600) {
  const from = map.terrain?.exaggeration ?? 0
  animateExaggeration(
    map,
    from,
    0,
    duration,
    () => map.easeTo({ ...camera, duration }),
    () => map.setTerrain(null),
  )
}
