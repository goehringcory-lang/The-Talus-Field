// =============================================================================
// Pin declutter: which pins draw full-size and which step down to a dot.
//
// The map carries ~260 DOM pins, and in 3D the Valley alone stacks forty of
// them into one heap, with the far side of every tilted view piling the rest
// against the horizon. MapLibre's own collision only works on symbol layers,
// and the pins are DOM markers on purpose (focusable, labelled buttons; see
// map/kinds.ts), so this does the same job in screen space: pins are placed
// in priority order and a pin whose box would overlap one already placed is
// drawn as a small dot in its kind's colour instead.
//
// Nothing is dropped. A dot is the same element, still in the tab order with
// the same label and the same popup on Enter; a tap on one zooms in until it
// has room to be a pin. That is the map-scale version of the fold rule the
// rest of the guide follows: hide, never drop.
//
// Pure (screen boxes in, ids out), so the placement rules are unit-tested in
// declutter.test.ts; routes/Map.tsx measures the boxes and applies the result.
// =============================================================================

export type DeclutterItem = {
  id: string
  /** Screen position of the pin's tip (its anchor), CSS pixels. */
  x: number
  y: number
  /** The box the pin occupies above its tip, already scaled. */
  w: number
  h: number
  /** Higher wins. */
  priority: number
  /** Always drawn full-size (the open popup's pin, a planned stop, focus). */
  pinned?: boolean
}

/** The pin's full box (26 x 36 CSS px, map/kinds.ts). */
export const PIN_W = 26
export const PIN_H = 36

/**
 * How much of a pin's box counts for collision. Below 1 lets neighbours
 * touch and overlap at the edges, as map pins do, while a pin whose glyph
 * would sit under another's still steps down.
 */
export const COLLISION_FACTOR = 0.85

/**
 * Perspective scale for a pin at screen height `y` in a canvas `height` tall,
 * at `pitch` degrees. A tilted map shows far ground near the top of the
 * screen, and full-size pins there read as a wall; shrinking them with depth
 * is what makes the 3D view read as depth rather than as clutter. Flat and
 * near-flat views keep every pin at full size. Quantised to 0.05 so a slow
 * pan does not restyle every pin every frame.
 */
export function depthScale(y: number, height: number, pitch: number): number {
  if (pitch <= 20 || height <= 0) return 1
  const strength = Math.min(1, (pitch - 20) / 40) * 0.45
  const far = Math.min(1, Math.max(0, 1 - y / height))
  const scale = 1 - strength * far ** 1.5
  return Math.round(Math.max(0.55, scale) * 20) / 20
}

/**
 * Place pins in priority order and return the ids drawn full-size. Ties go
 * to the pin lower on the screen (nearer the camera in 3D), then to the id,
 * so the result never depends on the order the markers were added in.
 */
export function declutter(items: DeclutterItem[], cell = 64): Set<string> {
  const order = [...items].sort(
    (a, b) =>
      Number(!!b.pinned) - Number(!!a.pinned) ||
      b.priority - a.priority ||
      b.y - a.y ||
      (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  )
  const shown = new Set<string>()
  // A uniform grid over the screen: each placed box is filed under every
  // cell it touches, so a candidate is tested against its neighbours only.
  const grid: Record<string, [number, number, number, number][]> = {}
  for (const it of order) {
    const w = it.w * COLLISION_FACTOR
    const h = it.h * COLLISION_FACTOR
    const box: [number, number, number, number] = [it.x - w / 2, it.y - h, it.x + w / 2, it.y]
    const c0 = Math.floor(box[0] / cell)
    const c1 = Math.floor(box[2] / cell)
    const r0 = Math.floor(box[1] / cell)
    const r1 = Math.floor(box[3] / cell)
    let hit = false
    if (!it.pinned) {
      outer: for (let c = c0; c <= c1; c++) {
        for (let r = r0; r <= r1; r++) {
          for (const b of grid[`${c},${r}`] ?? []) {
            if (box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1]) {
              hit = true
              break outer
            }
          }
        }
      }
    }
    if (hit) continue
    shown.add(it.id)
    for (let c = c0; c <= c1; c++) {
      for (let r = r0; r <= r1; r++) (grid[`${c},${r}`] ??= []).push(box)
    }
  }
  return shown
}
