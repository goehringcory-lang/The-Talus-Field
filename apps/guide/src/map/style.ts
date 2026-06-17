// MapLibre style for the offline park map. Raster-only on purpose: a raster
// source needs no glyphs or sprites, so once the tiles are cached the map is
// fully offline. Tiles come from our own Worker proxy (long-lived immutable
// cache headers, CORS *), which the service worker stores in the unversioned
// tfg-tiles cache.

import type { StyleSpecification } from 'maplibre-gl'
import { API_BASE } from '../lib/api'

export const MAP_ATTRIBUTION = 'Esri, USGS | © OpenStreetMap contributors'

export function buildMapStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      topo: {
        type: 'raster',
        // The proxy path order is z/y/x, matching the upstream tile scheme.
        tiles: [`${API_BASE}/tiles/{z}/{y}/{x}`],
        tileSize: 256,
        minzoom: 6,
        // Raster overzooms past 14, so trailhead-scale zoom works offline
        // without caching the (huge) z15+ tile set.
        maxzoom: 14,
        attribution: MAP_ATTRIBUTION,
      },
    },
    layers: [{ id: 'topo', type: 'raster', source: 'topo' }],
  }
}
