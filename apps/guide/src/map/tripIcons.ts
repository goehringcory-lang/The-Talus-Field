// =============================================================================
// The trip layer's pins, drawn once per (stop type, day colour) into canvas
// images the map's symbol layer places. The shape says what the stop is, a
// number drawn over it by the symbol layer says where it falls in the day, and
// the colour says which day: three signals, so no one is ever the only one.
//
//   circle     a stop, viewpoint, meal or anything else
//   diamond    a hike (pinned at its trailhead; the trail is drawn dashed)
//   square     a ranger or partner program (its published start time)
//   hexagon    a parking lot
// =============================================================================

import type { Map as MapLibreMap } from 'maplibre-gl'
import type { TripStopKind } from './tripLayer'

export const TRIP_STOP_KINDS: TripStopKind[] = ['other', 'hike', 'program', 'parking']

export const TRIP_KIND_LABEL: Record<TripStopKind, string> = {
  other: 'Stop',
  hike: 'Hike (at the trailhead)',
  program: 'Program',
  parking: 'Parking',
}

const SIZE = 30 // CSS pixels; drawn at 2x
const RATIO = 2

/** The shape's outline, for the canvas pin and for the legend's SVG. */
export function shapePath(kind: TripStopKind, size = SIZE): string {
  const c = size / 2
  const r = size / 2 - 2.5
  switch (kind) {
    case 'hike':
      return `M${c},${c - r - 1} L${c + r + 1},${c} L${c},${c + r + 1} L${c - r - 1},${c} Z`
    case 'program':
      return `M${c - r + 1},${c - r + 1} H${c + r - 1} V${c + r - 1} H${c - r + 1} Z`
    case 'parking': {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i + Math.PI / 6
        return `${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`
      })
      return `M${pts.join(' L')} Z`
    }
    default:
      return `M${c - r},${c} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`
  }
}

function drawIcon(kind: TripStopKind, color: string, stroke: string): ImageData | null {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SIZE * RATIO
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.scale(RATIO, RATIO)
  const path = new Path2D(shapePath(kind))
  ctx.fillStyle = color
  ctx.fill(path)
  ctx.lineWidth = 2.5
  ctx.strokeStyle = stroke
  ctx.stroke(path)
  return ctx.getImageData(0, 0, SIZE * RATIO, SIZE * RATIO)
}

/** The program meeting points layer's pin: the program square in the accent colour. */
export const PROGRAM_POINT_ICON = 'trip-program-point'

/** Register (or replace, after a scheme change) every pin image the trip and program layers name. */
export function addTripIcons(map: MapLibreMap, colors: string[], stroke: string, accent: string) {
  const point = drawIcon('program', accent, stroke)
  if (point) {
    if (map.hasImage(PROGRAM_POINT_ICON)) map.updateImage(PROGRAM_POINT_ICON, point)
    else map.addImage(PROGRAM_POINT_ICON, point, { pixelRatio: RATIO })
  }
  colors.forEach((color, i) => {
    for (const kind of TRIP_STOP_KINDS) {
      const id = `trip-${kind}-${i}`
      const data = drawIcon(kind, color, stroke)
      if (!data) continue
      if (map.hasImage(id)) map.updateImage(id, data)
      else map.addImage(id, data, { pixelRatio: RATIO })
    }
  })
}
