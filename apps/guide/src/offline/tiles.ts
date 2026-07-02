// =============================================================================
// Offline map tile math.
//
// The Worker proxies raster topo tiles at /tiles/{z}/{y}/{x} (note z/y/x
// order, matching the upstream scheme). For offline use we precache:
//   - the whole park at z8–z12 (orientation + driving scale), and
//   - the three road corridors all stops live on at z13–z14 (trailhead scale).
// Corridor-only high zoom keeps the download ~700 tiles / about 20 MB instead
// of ~3,000 tiles for the full park rectangle.
// =============================================================================

import { API_BASE } from '../lib/api'

// [west, south, east, north]
type Bbox = [number, number, number, number]

// Yosemite National Park, padded to the gateway roads.
export const PARK_BBOX: Bbox = [-119.93, 37.45, -119.05, 38.2]

// The three corridors every stop in the guide sits inside.
const VALLEY_BBOX: Bbox = [-119.75, 37.66, -119.53, 37.77]
const GLACIER_MARIPOSA_BBOX: Bbox = [-119.72, 37.49, -119.55, 37.73]
// Extended west/south to the Crane Flat junction so tioga-road-drive
// (-119.7973, 37.7551) still gets trailhead-zoom tiles offline.
const TIOGA_BBOX: Bbox = [-119.82, 37.74, -119.25, 37.95]

const PARK_ZOOMS = [8, 9, 10, 11, 12]
const CORRIDOR_ZOOMS = [13, 14]

export function lng2x(lng: number, z: number): number {
  return Math.floor(((lng + 180) / 360) * 2 ** z)
}

export function lat2y(lat: number, z: number): number {
  const rad = (lat * Math.PI) / 180
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z,
  )
}

function* tilesInBbox(bbox: Bbox, z: number): Generator<[number, number, number]> {
  const [west, south, east, north] = bbox
  const xMin = lng2x(west, z)
  const xMax = lng2x(east, z)
  // y grows southward in the slippy scheme.
  const yMin = lat2y(north, z)
  const yMax = lat2y(south, z)
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      yield [z, y, x]
    }
  }
}

export function tileUrl(z: number, y: number, x: number): string {
  return `${API_BASE}/tiles/${z}/${y}/${x}`
}

/** Every tile URL the offline map pack needs. Deduped: corridors overlap. */
export function buildTileUrls(): string[] {
  const urls = new Set<string>()
  for (const z of PARK_ZOOMS) {
    for (const [tz, ty, tx] of tilesInBbox(PARK_BBOX, z)) urls.add(tileUrl(tz, ty, tx))
  }
  for (const z of CORRIDOR_ZOOMS) {
    for (const bbox of [VALLEY_BBOX, GLACIER_MARIPOSA_BBOX, TIOGA_BBOX]) {
      for (const [tz, ty, tx] of tilesInBbox(bbox, z)) urls.add(tileUrl(tz, ty, tx))
    }
  }
  return Array.from(urls)
}
