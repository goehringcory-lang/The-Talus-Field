// =============================================================================
// The backpacking layer (the map's Backpacking tab, October 2026): one trip's
// route drawn day by day, each night's camp, every water source, and the
// trailhead and the exit. With no trip chosen it draws every route thin in the
// ink, each one a tap target that chooses it.
//
// Same idiom as the trip layer (map/tripMapLayers.ts + map/tripIcons.ts):
// GeoJSON sources, symbol pins drawn on a canvas, added with addLayer so the
// scheme-change rebuild carries them across, and their images re-drawn on
// `styleimagemissing` (every id here starts `bp-`). Three signals per pin, so
// colour is never the only one: the shape (tent, drop, flag), the text (the
// night's number), and the colour (the day it ends, or water).
// =============================================================================

import type { ExpressionSpecification, GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl'
import type { BackpackTripT } from '../content/schema'
import { decodeRoute, sliceByMiles, type BackpackRouteT } from '../backpacking/routes'
import { decodePolyline } from './roadGraph'
import { TRIP_DIMMED_OPACITY, dayColors, inkColor, tripCasing, waterColor } from './theme'

export const BP_LINE_LAYER = 'bp-route'
export const BP_OVERVIEW_LAYER = 'bp-overview'
export const BP_POINT_LAYER = 'bp-points'
const LAYERS = ['bp-overview-casing', BP_OVERVIEW_LAYER, 'bp-route-casing', BP_LINE_LAYER, 'bp-side', 'bp-focus', BP_POINT_LAYER, 'bp-labels']

const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }

// --- pins ------------------------------------------------------------------------

type PinShape = 'tent' | 'water' | 'water-seasonal' | 'start' | 'end'
const SIZE = 30
const RATIO = 2

function pinPath(shape: PinShape): string {
  const c = SIZE / 2
  switch (shape) {
    case 'tent':
      // A tent: a broad triangle on a flat base, the door notch left to the
      // number the symbol layer draws over it.
      return `M${c},3 L${SIZE - 3},${SIZE - 5} L3,${SIZE - 5} Z`
    case 'water':
    case 'water-seasonal':
      // A drop: round below, pointed above.
      return `M${c},3 C${c + 3},9 ${c + 9},14 ${c + 9},${c + 4} A9,9 0 1,1 ${c - 9},${c + 4} C${c - 9},14 ${c - 3},9 ${c},3 Z`
    case 'start':
    case 'end':
      return `M5,5 H${SIZE - 5} V${SIZE - 5} H5 Z`
  }
}

function drawPin(shape: PinShape, fill: string, stroke: string): ImageData | null {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SIZE * RATIO
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.scale(RATIO, RATIO)
  const path = new Path2D(pinPath(shape))
  ctx.lineJoin = 'round'
  ctx.lineWidth = 2.5
  ctx.strokeStyle = stroke
  if (shape === 'water-seasonal') {
    // Hollow: the casing colour inside, the water hue as a thick outline.
    ctx.fillStyle = stroke
    ctx.fill(path)
    ctx.lineWidth = 3
    ctx.strokeStyle = fill
    ctx.stroke(path)
  } else {
    ctx.fillStyle = fill
    ctx.fill(path)
    ctx.stroke(path)
    if (shape === 'water') {
      // A highlight in the drop: the first day's blue is near the water's,
      // and the dot is what tells a drop from a tent at a glance.
      ctx.beginPath()
      ctx.arc(SIZE / 2 - 2.5, SIZE / 2 + 5, 2.6, 0, Math.PI * 2)
      ctx.fillStyle = stroke
      ctx.fill()
    }
  }
  return ctx.getImageData(0, 0, SIZE * RATIO, SIZE * RATIO)
}

function putImage(map: MapLibreMap, id: string, data: ImageData | null) {
  if (!data) return
  if (map.hasImage(id)) map.updateImage(id, data)
  else map.addImage(id, data, { pixelRatio: RATIO })
}

/** Register (or replace, after a scheme change) every pin image the layer names. */
export function addBackpackIcons(map: MapLibreMap) {
  const casing = tripCasing()
  const water = waterColor()
  const ink = inkColor()
  putImage(map, 'bp-water', drawPin('water', water, casing))
  putImage(map, 'bp-water-seasonal', drawPin('water-seasonal', water, casing))
  putImage(map, 'bp-start', drawPin('start', ink, casing))
  putImage(map, 'bp-end', drawPin('end', ink, casing))
  dayColors().forEach((color, i) => putImage(map, `bp-tent-${i}`, drawPin('tent', color, casing)))
}

/** The shapes for the pane's key, as SVG paths in a 30-unit box. */
export const BP_KEY_PATH = { tent: pinPath('tent'), water: pinPath('water'), start: pinPath('start') }

// --- data ------------------------------------------------------------------------

export type BackpackFeatureProps = {
  kind: 'camp' | 'water' | 'start' | 'end'
  id: string
  name: string
  mi: number
}

/** Every route thin in the ink: the overview, before a trip is chosen. */
export function overviewGeojson(trips: BackpackTripT[], routes: Record<string, BackpackRouteT>): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: trips
      .filter((t) => routes[t.id])
      .map((t) => ({
        type: 'Feature' as const,
        properties: { tripId: t.id, title: t.title },
        geometry: { type: 'LineString' as const, coordinates: decodeRoute(t.id, routes[t.id]).line },
      })),
  }
}

/** One trip: a line per day in the day's colour, side trips, and the pins. */
export function tripGeojson(trip: BackpackTripT, route: BackpackRouteT) {
  const colors = dayColors()
  const decoded = decodeRoute(trip.id, route)
  const lines: GeoJSON.Feature[] = route.days.map((d, i) => ({
    type: 'Feature',
    properties: { day: i + 1, color: colors[i % colors.length], tripId: trip.id },
    geometry: { type: 'LineString', coordinates: sliceByMiles(decoded, d.startMi, d.endMi) },
  }))
  const side: GeoJSON.Feature[] = []
  trip.days.forEach((d, i) => {
    const s = d.sideTripId ? route.sideTrips[d.sideTripId] : undefined
    if (!s) return
    side.push({
      type: 'Feature',
      properties: { day: i + 1, color: colors[i % colors.length] },
      geometry: { type: 'LineString', coordinates: decodePolyline(s.line) },
    })
  })

  const pins: GeoJSON.Feature[] = []
  const pin = (props: BackpackFeatureProps & { icon: string; label: string; order?: string; sort: number; day?: number }, coord: [number, number]) =>
    pins.push({ type: 'Feature', properties: props, geometry: { type: 'Point', coordinates: coord } })

  pin({ kind: 'start', id: 'start', name: trip.trailhead.name, mi: 0, icon: 'bp-start', label: trip.trailhead.name, order: 'S', sort: 4 }, trip.trailhead.coord)
  if (trip.exit) {
    pin({ kind: 'end', id: 'end', name: trip.exit.name, mi: route.stats.mi, icon: 'bp-end', label: trip.exit.name, order: 'E', sort: 4 }, trip.exit.coord)
  }
  for (const w of trip.water) {
    const m = route.markers[w.id]
    pin(
      {
        kind: 'water',
        id: w.id,
        name: w.name,
        mi: m?.mi ?? 0,
        icon: w.reliability === 'reliable' ? 'bp-water' : 'bp-water-seasonal',
        label: w.name,
        sort: 1,
      },
      w.coord,
    )
  }
  // A camp used two nights running (a layover) is one pin, numbered by its
  // first night; the pane lists both.
  const seen = new Set<string>()
  let night = 0
  trip.days.forEach((d, i) => {
    if (!d.campId) return
    night++
    if (seen.has(d.campId)) return
    seen.add(d.campId)
    const c = trip.camps.find((x) => x.id === d.campId)!
    pin(
      {
        kind: 'camp',
        id: c.id,
        name: c.name,
        mi: route.markers[c.id]?.mi ?? 0,
        icon: `bp-tent-${i % colors.length}`,
        label: c.name,
        order: String(night),
        sort: 3,
        day: i + 1,
      },
      c.coord,
    )
  })
  return {
    lines: { type: 'FeatureCollection' as const, features: lines },
    side: { type: 'FeatureCollection' as const, features: side },
    pins: { type: 'FeatureCollection' as const, features: pins },
  }
}

// --- layers ----------------------------------------------------------------------

/** Create the sources and layers once; safe to call again. */
export function ensureBackpackLayers(map: MapLibreMap) {
  if (map.getSource('bp-route')) return
  for (const id of ['bp-overview', 'bp-route', 'bp-side', 'bp-points']) map.addSource(id, { type: 'geojson', data: EMPTY })
  const casing = tripCasing()
  const ink = inkColor()
  map.addLayer({
    id: 'bp-overview-casing',
    type: 'line',
    source: 'bp-overview',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': casing, 'line-width': 6, 'line-opacity': 0.85 },
  })
  map.addLayer({
    id: BP_OVERVIEW_LAYER,
    type: 'line',
    source: 'bp-overview',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': ink, 'line-width': ['interpolate', ['linear'], ['zoom'], 9, 2, 13, 3.5] },
  })
  map.addLayer({
    id: 'bp-route-casing',
    type: 'line',
    source: 'bp-route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': casing, 'line-width': 8, 'line-opacity': 0.9 },
  })
  map.addLayer({
    id: BP_LINE_LAYER,
    type: 'line',
    source: 'bp-route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': ['get', 'color'], 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3.5, 14, 5] },
  })
  map.addLayer({
    id: 'bp-side',
    type: 'line',
    source: 'bp-side',
    layout: { 'line-join': 'round' },
    paint: { 'line-color': ['get', 'color'], 'line-width': 3, 'line-dasharray': [1.6, 1.2] },
  })
  map.addLayer({
    id: 'bp-focus',
    type: 'circle',
    source: 'bp-points',
    filter: ['==', ['get', 'id'], ''],
    paint: { 'circle-radius': 21, 'circle-color': 'transparent', 'circle-stroke-color': ink, 'circle-stroke-width': 3 },
  })
  map.addLayer({
    id: BP_POINT_LAYER,
    type: 'symbol',
    source: 'bp-points',
    layout: {
      'icon-image': ['get', 'icon'],
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
      'text-field': ['coalesce', ['get', 'order'], ''],
      'text-font': ['Noto Sans Medium'],
      'text-size': 12,
      'text-offset': [0, 0.25],
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'symbol-sort-key': ['get', 'sort'],
    },
    paint: { 'text-color': '#ffffff' },
  })
  map.addLayer({
    id: 'bp-labels',
    type: 'symbol',
    source: 'bp-points',
    minzoom: 12,
    layout: {
      'text-field': ['get', 'label'],
      'text-font': ['Noto Sans Medium'],
      'text-size': 11,
      'text-offset': [0, 1.5],
      'text-anchor': 'top',
      'text-optional': true,
      'symbol-sort-key': ['-', 10, ['get', 'sort']],
    },
    paint: { 'text-color': ink, 'text-halo-color': casing, 'text-halo-width': 1.6 },
  })
}

/** Re-read the scheme's colours after a style rebuild. */
export function recolorBackpack(map: MapLibreMap) {
  if (!map.getLayer(BP_LINE_LAYER)) return
  const casing = tripCasing()
  const ink = inkColor()
  for (const id of ['bp-overview-casing', 'bp-route-casing']) map.setPaintProperty(id, 'line-color', casing)
  map.setPaintProperty(BP_OVERVIEW_LAYER, 'line-color', ink)
  map.setPaintProperty('bp-focus', 'circle-stroke-color', ink)
  map.setPaintProperty('bp-labels', 'text-color', ink)
  map.setPaintProperty('bp-labels', 'text-halo-color', casing)
}

export function setBackpackData(
  map: MapLibreMap,
  data: { overview: GeoJSON.FeatureCollection; lines: GeoJSON.FeatureCollection; side: GeoJSON.FeatureCollection; pins: GeoJSON.FeatureCollection },
) {
  ;(map.getSource('bp-overview') as GeoJSONSource | undefined)?.setData(data.overview)
  ;(map.getSource('bp-route') as GeoJSONSource | undefined)?.setData(data.lines)
  ;(map.getSource('bp-side') as GeoJSONSource | undefined)?.setData(data.side)
  ;(map.getSource('bp-points') as GeoJSONSource | undefined)?.setData(data.pins)
}

export function setBackpackVisible(map: MapLibreMap, visible: boolean) {
  for (const id of LAYERS) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none')
}

/** Show every day, or one with the others dimmed; ring the focused pin. */
export function setBackpackDay(map: MapLibreMap, day: number | null, focusId: string | null) {
  if (!map.getLayer(BP_LINE_LAYER)) return
  const opacity: ExpressionSpecification | number = day === null ? 1 : ['case', ['==', ['get', 'day'], day], 1, TRIP_DIMMED_OPACITY]
  map.setPaintProperty(BP_LINE_LAYER, 'line-opacity', opacity)
  map.setPaintProperty('bp-side', 'line-opacity', opacity)
  map.setFilter('bp-focus', ['==', ['get', 'id'], focusId ?? ''])
}
