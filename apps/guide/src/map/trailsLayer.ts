// =============================================================================
// The trails layer: every verified day hike drawn on the terrain, coloured by
// difficulty, tappable. Geometry comes from public/map/trails-<hash>.json
// (gen-map-data.ts packs the 57 track files into one); everything a reader
// reads about a trail (title, distance, gain, difficulty) comes from hikes.ts
// at runtime, so a corrected figure there reaches the map on the next build
// with no regeneration.
// =============================================================================

import type { ExpressionSpecification, GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl'
import { HIKES, type HikeT } from '../content'
import { TRAILS_URL } from './mapData.generated'
import { decodePolyline } from './roadGraph'
import { trailColors, tripCasing } from './theme'

export const TRAIL_LINE_LAYER = 'trails'

export type TrailFilter = {
  difficulties: Set<HikeT['difficulty']> | null // null: every difficulty
  maxMiles: number | null
  visible: boolean
}

export const LENGTH_CHOICES: { label: string; max: number | null }[] = [
  { label: 'Any length', max: null },
  { label: 'Under 3 mi', max: 3 },
  { label: 'Under 6 mi', max: 6 },
  { label: 'Under 10 mi', max: 10 },
]

let trailsPromise: Promise<GeoJSON.FeatureCollection<GeoJSON.LineString>> | null = null

/** The trails as GeoJSON, fetched once (the SW serves it offline from the overview pack). */
export function loadTrails(): Promise<GeoJSON.FeatureCollection<GeoJSON.LineString>> {
  trailsPromise ??= fetch(TRAILS_URL)
    .then((res) => {
      const type = res.headers.get('content-type')
      if (!res.ok || (type && type.includes('text/html'))) throw new Error('trails unavailable')
      return res.json() as Promise<{ trails: Record<string, string> }>
    })
    .then(({ trails }) => ({
      type: 'FeatureCollection' as const,
      features: HIKES.filter((h) => trails[h.id]).map((h) => ({
        type: 'Feature' as const,
        properties: {
          id: h.id,
          title: h.title,
          difficulty: h.difficulty ?? 'unrated',
          miles: h.distanceMi,
        },
        geometry: { type: 'LineString' as const, coordinates: decodePolyline(trails[h.id]) },
      })),
    }))
    .catch((err) => {
      trailsPromise = null
      throw err
    })
  return trailsPromise
}

// Widths are pixels at the centre of the view, and a tilted camera draws the
// ground near the lens at up to twice that; at the old 3.5 px a trail in the
// foreground of the opening view read heavier than the highway. Thinner, and
// faded at park scale, where fifty-seven trails would otherwise out-draw the
// pins they lead from.
const LINE_WIDTH: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], 10, 1, 12, 1.6, 15, 3]
const CASING_WIDTH: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], 10, 2, 12, 2.8, 15, 5.5]

function colorExpression(): ExpressionSpecification {
  const c = trailColors()
  return ['match', ['get', 'difficulty'], 'easy', c.easy, 'moderate', c.moderate, 'strenuous', c.strenuous, c.unrated]
}

/** Add the trail source and layers under the trip layer, once; safe to call again. */
export function ensureTrailLayers(map: MapLibreMap, data: GeoJSON.FeatureCollection) {
  const src = map.getSource('trails') as GeoJSONSource | undefined
  if (src) {
    src.setData(data)
    return
  }
  map.addSource('trails', { type: 'geojson', data })
  const before = map.getLayer('trip-legs-casing') ? 'trip-legs-casing' : undefined
  map.addLayer(
    {
      id: 'trails-casing',
      type: 'line',
      source: 'trails',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': tripCasing(), 'line-width': CASING_WIDTH, 'line-opacity': ['interpolate', ['linear'], ['zoom'], 9, 0.4, 12, 0.8] },
    },
    before,
  )
  map.addLayer(
    {
      id: TRAIL_LINE_LAYER,
      type: 'line',
      source: 'trails',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': colorExpression(),
        'line-width': LINE_WIDTH,
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 9, 0.55, 12, 0.9],
      },
    },
    before,
  )
  map.addLayer(
    {
      id: 'trails-selected',
      type: 'line',
      source: 'trails',
      filter: ['==', ['get', 'id'], ''],
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': colorExpression(), 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 15, 6] },
    },
    before,
  )
}

/** Re-read the scheme's trail colours after a style rebuild. */
export function recolorTrails(map: MapLibreMap) {
  if (!map.getLayer(TRAIL_LINE_LAYER)) return
  map.setPaintProperty(TRAIL_LINE_LAYER, 'line-color', colorExpression())
  map.setPaintProperty('trails-selected', 'line-color', colorExpression())
  map.setPaintProperty('trails-casing', 'line-color', tripCasing())
}

export function setTrailFilter(map: MapLibreMap, f: TrailFilter, hoveredOrSelected: string | null) {
  if (!map.getLayer(TRAIL_LINE_LAYER)) return
  const clauses: ExpressionSpecification[] = []
  if (f.difficulties) clauses.push(['in', ['get', 'difficulty'], ['literal', [...f.difficulties]]])
  if (f.maxMiles !== null) clauses.push(['<=', ['get', 'miles'], f.maxMiles])
  const filter: ExpressionSpecification = clauses.length ? ['all', ...clauses] : ['boolean', true]
  for (const id of ['trails-casing', TRAIL_LINE_LAYER]) {
    map.setFilter(id, filter)
    map.setLayoutProperty(id, 'visibility', f.visible ? 'visible' : 'none')
  }
  map.setFilter('trails-selected', ['==', ['get', 'id'], hoveredOrSelected ?? ''])
}
