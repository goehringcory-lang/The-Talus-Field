// =============================================================================
// Pin markers that test terrain occlusion only while the camera rests.
//
// MapLibre fades a DOM marker that sits behind a ridge by reading the
// terrain's depth framebuffer back from the GPU (`gl.readPixels`, one or two
// per marker), and it does so for every marker every 100 ms while the camera
// moves. Each readback is a synchronous round trip that stalls the GPU
// pipeline, and the map carries ~260 pins: profiled in September 2026 on a
// laptop GPU, readPixels was 41% of all main-thread time during a pan and
// rotate, and the 3D view ran at 9 fps.
//
// The test only matters once the view settles (the declutter pass reads the
// covered class to let a hidden pin give way), so this subclass skips it
// while the map moves or loads and queues the pin instead. A queue per map
// drains a few pins a frame once the camera rests, skipping pins that are off
// screen or hidden by CSS, so the readbacks are spread thin rather than
// landing in one frame. MapLibre's own `transition: opacity .2s` on
// `.maplibregl-marker` fades a pin that turns out to be covered.
//
// `_updateOpacity` is MapLibre's (typed in its d.ts, not documented); if a
// future version renames it the override is simply never called and pins
// fall back to the library's behaviour.
// =============================================================================

import maplibregl from 'maplibre-gl'

/** Occlusion tests per frame. Two readbacks each at most. */
const PER_FRAME = 16

type Queue = { pending: Set<PinMarker>; frame: number }
const queues = new WeakMap<maplibregl.Map, Queue>()

function queueFor(map: maplibregl.Map): Queue {
  let q = queues.get(map)
  if (!q) {
    const queue: Queue = { pending: new Set(), frame: 0 }
    // A pin marked while the terrain was still loading is tested once the
    // map goes idle; 'idle' also follows every settled camera move.
    map.on('idle', () => schedule(map, queue))
    map.on('remove', () => {
      cancelAnimationFrame(queue.frame)
      queue.pending.clear()
    })
    queues.set(map, queue)
    q = queue
  }
  return q
}

function schedule(map: maplibregl.Map, q: Queue) {
  if (!q.frame && q.pending.size) q.frame = requestAnimationFrame(() => drain(map, q))
}

function drain(map: maplibregl.Map, q: Queue) {
  q.frame = 0
  // Moving again: the next moveend re-queues every pin, and the depth
  // buffer would be a frame stale anyway.
  if (map.isMoving() || !map.terrain) return
  const w = map.transform.width
  const h = map.transform.height
  // All the reads first, then all the writes: a test sets the pin's opacity
  // and class, and a layout read after it would force a fresh style pass.
  const batch: PinMarker[] = []
  for (const marker of q.pending) {
    q.pending.delete(marker)
    if (!marker._map) continue
    const p = marker._pos
    // Off screen, or display:none (a minor pin at driving-out zoom): leave
    // it; it is tested again on the first settled view that shows it.
    if (!p || p.x < -40 || p.x > w + 40 || p.y < -10 || p.y > h + 60) continue
    if (marker.getElement().offsetParent === null) continue
    batch.push(marker)
    if (batch.length >= PER_FRAME) break
  }
  for (const marker of batch) marker.testOcclusion()
  schedule(map, q)
}

export class PinMarker extends maplibregl.Marker {
  override _updateOpacity(force = false): void {
    const map = this._map
    if (!map?.terrain) {
      super._updateOpacity(force)
      return
    }
    const q = queueFor(map)
    q.pending.add(this)
    if (!map.isMoving() && map.loaded()) schedule(map, q)
  }

  /** The library's depth-buffer test, run by the queue on a settled frame. */
  testOcclusion(): void {
    super._updateOpacity(true)
  }
}
