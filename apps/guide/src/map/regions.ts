// =============================================================================
// The 3D map's tile extent and its offline regions.
//
// Pure on purpose: scripts/gen-map-tiles.ts imports this module (through
// jiti) to cut the archives and to measure each region's download, and the
// app imports it to list the same tile URLs, so the size a reader is shown
// before a download is the sum of the exact files the download fetches.
//
// Two layers of detail. The overview pack is the whole extent at orientation
// scale (vector z6-z11, elevation z6-z11): enough to see the park in 3D and
// every road, lake and summit on it. A region pack adds trailhead scale
// (vector z12-z15, elevation z12-z13) inside one corridor's box. Each region
// needs the overview under it, so the download manager fetches the overview
// first, once.
// =============================================================================

/** [west, south, east, north] */
export type Bbox = [number, number, number, number]

/** The archives' extent: the park, its gateway towns and Hetch Hetchy Road. */
export const MAP_EXTENT: Bbox = [-120.0, 37.42, -119.0, 38.22]

export const BASEMAP_MIN_ZOOM = 6
export const BASEMAP_MAX_ZOOM = 15
export const DEM_MIN_ZOOM = 6
export const DEM_MAX_ZOOM = 13

/** The deepest zoom the overview pack carries. */
export const OVERVIEW_MAX_ZOOM = 11

export type OfflineRegionId = 'valley' | 'glacier-wawona' | 'tioga-tuolumne' | 'hetch-hetchy'

export type OfflineRegion = {
  id: OfflineRegionId
  label: string
  detail: string
  bbox: Bbox
}

// The corridor boxes are the four the Esri park-map pack used (offline/tiles.ts),
// which were widened stop by stop until every pin in the guide sat inside one.
export const OFFLINE_REGIONS: OfflineRegion[] = [
  {
    id: 'valley',
    label: 'Yosemite Valley',
    detail: 'The Valley floor and rim trails, El Portal to Happy Isles.',
    bbox: [-119.79, 37.66, -119.53, 37.77],
  },
  {
    id: 'glacier-wawona',
    label: 'Glacier Point and Wawona',
    detail: 'Glacier Point Road, Wawona Road, Wawona and the Mariposa Grove.',
    bbox: [-119.72, 37.49, -119.55, 37.73],
  },
  {
    id: 'tioga-tuolumne',
    label: 'Tioga Road and Tuolumne',
    detail: 'Crane Flat to Tioga Pass, Tuolumne Meadows and the Merced Grove.',
    bbox: [-119.85, 37.74, -119.25, 37.95],
  },
  {
    id: 'hetch-hetchy',
    label: 'Hetch Hetchy',
    detail: 'Evergreen Road, Camp Mather, the dam and the Wapama Falls shore.',
    bbox: [-119.98, 37.79, -119.75, 37.98],
  },
]

export function lng2x(lng: number, z: number): number {
  return Math.floor(((lng + 180) / 360) * 2 ** z)
}

export function lat2y(lat: number, z: number): number {
  const rad = (lat * Math.PI) / 180
  return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z)
}

/** Every [z, x, y] of the slippy pyramid inside a box at one zoom. */
export function* tilesInBbox(bbox: Bbox, z: number): Generator<[number, number, number]> {
  const [west, south, east, north] = bbox
  const xMax = lng2x(east, z)
  const yMax = lat2y(south, z) // y grows southward
  for (let x = lng2x(west, z); x <= xMax; x++) {
    for (let y = lat2y(north, z); y <= yMax; y++) yield [z, x, y]
  }
}

export type TileKind = 'vt' | 'dem'
export type TileAddress = { kind: TileKind; z: number; x: number; y: number }

function range(from: number, to: number): number[] {
  const out: number[] = []
  for (let z = from; z <= to; z++) out.push(z)
  return out
}

function collect(out: Map<string, TileAddress>, kind: TileKind, bbox: Bbox, zooms: number[]) {
  for (const z of zooms) {
    for (const [tz, x, y] of tilesInBbox(bbox, z)) out.set(`${kind}/${tz}/${x}/${y}`, { kind, z: tz, x, y })
  }
}

/** The tiles in the overview pack. */
export function overviewTiles(): TileAddress[] {
  const out = new Map<string, TileAddress>()
  collect(out, 'vt', MAP_EXTENT, range(BASEMAP_MIN_ZOOM, OVERVIEW_MAX_ZOOM))
  collect(out, 'dem', MAP_EXTENT, range(DEM_MIN_ZOOM, OVERVIEW_MAX_ZOOM))
  return [...out.values()]
}

/** The tiles one region pack adds on top of the overview. */
export function regionTiles(id: OfflineRegionId): TileAddress[] {
  const region = OFFLINE_REGIONS.find((r) => r.id === id)
  if (!region) return []
  const out = new Map<string, TileAddress>()
  collect(out, 'vt', region.bbox, range(OVERVIEW_MAX_ZOOM + 1, BASEMAP_MAX_ZOOM))
  collect(out, 'dem', region.bbox, range(OVERVIEW_MAX_ZOOM + 1, DEM_MAX_ZOOM))
  return [...out.values()]
}

/** Is a point inside a box? */
export function inBbox([lng, lat]: [number, number], [w, s, e, n]: Bbox): boolean {
  return lng >= w && lng <= e && lat >= s && lat <= n
}
