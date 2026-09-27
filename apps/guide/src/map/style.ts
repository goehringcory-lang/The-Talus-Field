// MapLibre style for the park map: a self-hosted Protomaps vector basemap on
// 3D terrain, with a soft hillshade, a sky, and the park boundary.
//
// Everything the style fetches is first-party: tiles from the API Worker's
// /vt and /dem routes (versioned by TILESET, immutable), glyphs and sprites
// from /map-assets on the guide's own origin. The service worker keeps tiles
// in the unversioned tfg-tiles cache and the assets in tfg-runtime, so once a
// region is downloaded the whole style renders in airplane mode.
//
// Terrain and hillshade read the same elevation tiles through two separate
// raster-dem sources, as MapLibre recommends: the terrain source is sampled
// at a coarser internal resolution, and sharing one source makes the
// hillshade render at that resolution too.
//
// The Esri World Topo raster this replaced (September 2026) was cached
// offline in bulk, which Esri's basemap terms do not allow a commercial app
// without an ArcGIS licence; the Worker's /tiles proxy stays up only for
// installed copies still running the old build.

import type { FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson'
import type { LayerSpecification, StyleSpecification } from 'maplibre-gl'
import { layers as basemapLayers } from '@protomaps/basemaps'
import { API_BASE } from '../lib/api'
import { TILESET } from './tiles.generated'
import { MAP_ATTRIBUTION_HTML } from './attribution'
import { buildTheme, HILLSHADE_EXAGGERATION, TERRAIN_EXAGGERATION, type MapTheme } from './theme'
import boundary from './data/park-boundary.json'

export const PARK_BOUNDARY = boundary as FeatureCollection<Polygon | MultiPolygon>

export const TERRAIN_SOURCE = 'terrain'

/** The terrain spec the 3D view sets; 2D sets none. */
export const TERRAIN_SPEC = { source: TERRAIN_SOURCE, exaggeration: TERRAIN_EXAGGERATION }

export function basemapTileUrl(z: number, x: number, y: number): string {
  return `${API_BASE}/vt/${TILESET.version}/${z}/${x}/${y}.mvt`
}

export function demTileUrl(z: number, x: number, y: number): string {
  return `${API_BASE}/dem/${TILESET.version}/${z}/${x}/${y}.webp`
}

/** The world with the park cut out of it: dims everything outside the boundary. */
function outsideMask(): FeatureCollection<Polygon> {
  const world: Position[] = [[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]]
  const holes: Position[][] = []
  for (const f of PARK_BOUNDARY.features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    for (const rings of polys) holes.push(rings[0])
  }
  return {
    type: 'FeatureCollection',
    features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [world, ...holes] } }],
  }
}

// The Protomaps layer list is one ordered array: ground fills, then roads,
// then labels. The hillshade sits above the fills and water and below the
// first road, so the relief shades the land without greying the roads; the
// outside-the-park dimming and the boundary line sit above the roads and
// below every label, so a gateway town's name stays readable.
function withOverlays(base: LayerSpecification[], theme: MapTheme): LayerSpecification[] {
  let firstRoad = base.findIndex((l) => /^(roads|tunnels|bridges)/.test(l.id))
  let firstLabel = base.findIndex((l) => l.type === 'symbol')
  if (firstLabel < 0) firstLabel = base.length
  if (firstRoad < 0 || firstRoad > firstLabel) firstRoad = firstLabel
  const hillshade: LayerSpecification = {
    id: 'hillshade',
    type: 'hillshade',
    source: 'hillshade',
    paint: {
      'hillshade-exaggeration': HILLSHADE_EXAGGERATION,
      'hillshade-shadow-color': theme.hillshade.shadow,
      'hillshade-highlight-color': theme.hillshade.highlight,
      'hillshade-accent-color': theme.hillshade.accent,
    },
  }
  const mask: LayerSpecification = {
    id: 'park-mask',
    type: 'fill',
    source: 'park-mask',
    paint: { 'fill-color': theme.boundary.mask, 'fill-opacity': theme.boundary.maskOpacity },
  }
  const line: LayerSpecification = {
    id: 'park-boundary',
    type: 'line',
    source: 'park-boundary',
    paint: {
      'line-color': theme.boundary.line,
      'line-opacity': 0.55,
      'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1, 13, 2],
      'line-dasharray': [3, 2],
    },
  }
  return [
    ...base.slice(0, firstRoad),
    hillshade,
    ...base.slice(firstRoad, firstLabel),
    mask,
    line,
    ...base.slice(firstLabel),
  ]
}

export function buildMapStyle(theme: MapTheme = buildTheme()): StyleSpecification {
  // MapLibre resolves glyph and sprite URLs against nothing, so they must be
  // absolute; the tile URLs already are (API_BASE).
  const origin = window.location.origin
  const bounds = TILESET.bounds
  const dem = {
    type: 'raster-dem' as const,
    tiles: [`${API_BASE}/dem/${TILESET.version}/{z}/{x}/{y}.webp`],
    tileSize: 256,
    encoding: TILESET.dem.encoding,
    minzoom: TILESET.dem.minzoom,
    maxzoom: TILESET.dem.maxzoom,
    bounds,
  }
  return {
    version: 8,
    glyphs: `${origin}/map-assets/fonts/{fontstack}/{range}.pbf`,
    sprite: `${origin}/map-assets/sprites/${theme.scheme === 'granite' ? 'dark' : 'light'}`,
    sources: {
      protomaps: {
        type: 'vector',
        tiles: [`${API_BASE}/vt/${TILESET.version}/{z}/{x}/{y}.mvt`],
        minzoom: TILESET.basemap.minzoom,
        maxzoom: TILESET.basemap.maxzoom,
        bounds,
        attribution: MAP_ATTRIBUTION_HTML,
      },
      [TERRAIN_SOURCE]: dem,
      hillshade: { ...dem },
      'park-mask': { type: 'geojson', data: outsideMask() },
      'park-boundary': { type: 'geojson', data: PARK_BOUNDARY },
    },
    layers: withOverlays(basemapLayers('protomaps', theme.flavor, { lang: 'en' }), theme),
    sky: {
      'sky-color': theme.sky.sky,
      'horizon-color': theme.sky.horizon,
      'fog-color': theme.sky.fog,
      'sky-horizon-blend': 0.6,
      'horizon-fog-blend': 0.7,
      'fog-ground-blend': 0.85,
      'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 8, 0.9, 13, 0.4],
    },
  }
}
