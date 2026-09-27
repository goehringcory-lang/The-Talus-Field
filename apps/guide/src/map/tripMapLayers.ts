// =============================================================================
// The trip layer's sources and layers on the MapLibre map, kept out of
// routes/Map.tsx: three GeoJSON sources (the legs, the hikes' trails, the
// pins), one line layer per travel mode so each keeps its own dash, a pin
// symbol layer whose images come from map/tripIcons.ts, and a label layer
// whose text collides like any other label, so time labels never pile up.
//
// Added with addLayer, so the scheme-change rebuild in Map.tsx carries them
// across; their pin images are re-drawn on `styleimagemissing`, since a
// rebuilt style drops every image it did not ship.
// =============================================================================

import type { ExpressionSpecification, GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl'
import { TRIP_DIMMED_OPACITY, TRIP_LINES, TRIP_STRAIGHT_OPACITY, tripCasing } from './theme'

export const TRIP_LEG_LAYERS = ['trip-legs-drive', 'trip-legs-walk', 'trip-legs-shuttle'] as const
export const TRIP_PIN_LAYER = 'trip-stops'
const LAYERS = [
  'trip-legs-casing',
  ...TRIP_LEG_LAYERS,
  'trip-hikes-casing',
  'trip-hikes',
  'trip-focus',
  TRIP_PIN_LAYER,
  'trip-labels',
]

const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }

function dayOpacity(selectedDay: string | null, base: number | ExpressionSpecification = 1): ExpressionSpecification | number {
  if (!selectedDay) return base
  return ['case', ['==', ['get', 'day'], selectedDay], base, TRIP_DIMMED_OPACITY] as ExpressionSpecification
}

const LEG_OPACITY: ExpressionSpecification = [
  'case',
  ['in', ['get', 'geometry'], ['literal', ['straight', 'pending']]],
  TRIP_STRAIGHT_OPACITY,
  0.95,
]

/** Create the trip sources and layers once; safe to call again. */
export function ensureTripLayers(map: MapLibreMap) {
  if (map.getSource('trip-legs')) return
  map.addSource('trip-legs', { type: 'geojson', data: EMPTY })
  map.addSource('trip-hikes', { type: 'geojson', data: EMPTY })
  map.addSource('trip-stops', { type: 'geojson', data: EMPTY })

  const casing = tripCasing()
  map.addLayer({
    id: 'trip-legs-casing',
    type: 'line',
    source: 'trip-legs',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': casing, 'line-width': 7, 'line-opacity': 0.85 },
  })
  for (const mode of ['drive', 'walk', 'shuttle'] as const) {
    const style = TRIP_LINES[mode]
    map.addLayer({
      id: `trip-legs-${mode}`,
      type: 'line',
      source: 'trip-legs',
      filter: ['==', ['get', 'mode'], mode],
      layout: { 'line-join': 'round', 'line-cap': mode === 'walk' ? 'round' : 'butt' },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': style.width,
        'line-opacity': LEG_OPACITY,
        ...(style.dash ? { 'line-dasharray': [...style.dash] } : {}),
      },
    })
  }
  map.addLayer({
    id: 'trip-hikes-casing',
    type: 'line',
    source: 'trip-hikes',
    layout: { 'line-join': 'round' },
    paint: { 'line-color': casing, 'line-width': 6, 'line-opacity': 0.8 },
  })
  map.addLayer({
    id: 'trip-hikes',
    type: 'line',
    source: 'trip-hikes',
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': TRIP_LINES.hike.width,
      'line-dasharray': [...TRIP_LINES.hike.dash],
    },
  })
  map.addLayer({
    id: 'trip-focus',
    type: 'circle',
    source: 'trip-stops',
    filter: ['==', ['get', 'itemId'], ''],
    paint: {
      'circle-radius': 22,
      'circle-color': 'transparent',
      'circle-stroke-color': ['get', 'color'],
      'circle-stroke-width': 3,
    },
  })
  map.addLayer({
    id: TRIP_PIN_LAYER,
    type: 'symbol',
    source: 'trip-stops',
    layout: {
      'icon-image': ['get', 'icon'],
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
      'text-field': ['get', 'order'],
      'text-font': ['Noto Sans Medium'],
      'text-size': 13,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'symbol-sort-key': ['to-number', ['get', 'order']],
    },
    paint: { 'text-color': '#ffffff' },
  })
  map.addLayer({
    id: 'trip-labels',
    type: 'symbol',
    source: 'trip-stops',
    minzoom: 12.5,
    layout: {
      'text-field': ['get', 'label'],
      'text-font': ['Noto Sans Medium'],
      'text-size': 11,
      'text-offset': [0, 1.6],
      'text-anchor': 'top',
      'text-optional': true,
    },
    paint: {
      'text-color': ['get', 'color'],
      'text-halo-color': casing,
      'text-halo-width': 1.6,
    },
  })
}

export function setTripData(
  map: MapLibreMap,
  data: { legs: GeoJSON.FeatureCollection; hikes: GeoJSON.FeatureCollection; stops: GeoJSON.FeatureCollection },
) {
  ;(map.getSource('trip-legs') as GeoJSONSource | undefined)?.setData(data.legs)
  ;(map.getSource('trip-hikes') as GeoJSONSource | undefined)?.setData(data.hikes)
  ;(map.getSource('trip-stops') as GeoJSONSource | undefined)?.setData(data.stops)
}

export function setTripVisible(map: MapLibreMap, visible: boolean) {
  for (const id of LAYERS) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none')
}

/** Show every day, or one with the others dimmed. */
export function setTripDay(map: MapLibreMap, selectedDay: string | null) {
  for (const id of TRIP_LEG_LAYERS) map.setPaintProperty(id, 'line-opacity', dayOpacity(selectedDay, LEG_OPACITY))
  map.setPaintProperty('trip-hikes', 'line-opacity', dayOpacity(selectedDay))
  map.setPaintProperty(TRIP_PIN_LAYER, 'icon-opacity', dayOpacity(selectedDay))
  map.setPaintProperty(TRIP_PIN_LAYER, 'text-opacity', dayOpacity(selectedDay))
  map.setPaintProperty('trip-labels', 'text-opacity', dayOpacity(selectedDay))
}

export function setTripFocus(map: MapLibreMap, itemId: string | null) {
  map.setFilter('trip-focus', ['==', ['get', 'itemId'], itemId ?? ''])
}
