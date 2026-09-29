// =============================================================================
// Offline download packs.
//
// Each pack is a flat URL list plus which Cache API bucket it belongs in:
// photos go to the SW's runtime cache, map tiles to the unversioned tile
// cache. Both caches survive shell-cache rotation on deploy, so a downloaded
// pack outlives app updates. approxBytes are display estimates with the real
// figure depending on format negotiation (AVIF vs JPG) and tile content.
// =============================================================================

import { REGIONS, getStopsByRegion, SECRET_GUIDE_META, SECRET_SPOTS, HIKES, type Region } from '../content'
import { WILDLIFE } from '../content/wildlife'
import { TRACKS, trackUrl } from '../trails/track'
import { precachePhotoUrls, type PhotoFormat } from '../utils/photo'
import { OFFLINE_REGIONS, overviewTiles, regionTiles, type OfflineRegionId, type TileAddress } from '../map/regions'
import { TILESET } from '../map/tiles.generated'
import { ROADS_URL, TRAILS_URL } from '../map/mapData.generated'
import { API_BASE } from '../lib/api'

export const RUNTIME_CACHE = 'tfg-runtime'
export const TILES_CACHE = 'tfg-tiles'

// Pack ids, named once so status surfaces (Home, Welcome) can't drift from
// what buildPacks() actually returns. Kept as consts rather than derived from
// buildPacks() because building packs does the full tile-URL math.
export const SECRET_PACK_ID = 'photos-secret-guide'
export const WILDLIFE_PACK_ID = 'photos-wildlife'
export const TRACKS_PACK_ID = 'trail-tracks'
// The 3D map downloads as an overview (the whole park at orientation scale,
// plus the label glyphs and sprites) and one pack per road corridor at
// trailhead scale. A corridor pack requires the overview under it.
export const MAP_OVERVIEW_PACK_ID = 'map-overview'
export function mapRegionPackId(region: OfflineRegionId): string {
  return `map-${region}`
}
export const MAP_PACK_IDS: string[] = [
  MAP_OVERVIEW_PACK_ID,
  ...OFFLINE_REGIONS.map((r) => mapRegionPackId(r.id)),
]
export function regionPackId(region: Region): string {
  return `photos-${region}`
}
export const PACK_IDS: string[] = [
  ...REGIONS.map((r) => regionPackId(r.id)),
  SECRET_PACK_ID,
  WILDLIFE_PACK_ID,
  TRACKS_PACK_ID,
  ...MAP_PACK_IDS,
]

export type Pack = {
  id: string
  label: string
  detail: string
  cacheName: string
  urls: string[]
  approxBytes: number
  // Fraction of URLs allowed to fail while still recording the pack as done.
  // Photo packs tolerate nothing: every photo is paid content. The map packs
  // tolerate a few missing tiles at the bbox edge.
  tolerateMissing: number
  // A pack that is useless without another one (a map corridor without the
  // overview under it). Downloading it fetches the required pack first, and
  // the required pack cannot be deleted while it is downloaded.
  requires?: string
  // Map packs only: the corridor's box, for the "downloaded areas" outline.
  bbox?: [number, number, number, number]
}

function regionPhotoUrls(region: (typeof REGIONS)[number], format: PhotoFormat): string[] {
  const urls = new Set<string>()
  // The region's picker-card hero belongs offline with its stops.
  for (const url of precachePhotoUrls(region.photo.src, format)) urls.add(url)
  // Hidden areas are paid content too; their photos belong in the pack.
  for (const stop of getStopsByRegion(region.id, { includeHidden: true })) {
    for (const photo of stop.photos) {
      for (const url of precachePhotoUrls(photo.src, format)) urls.add(url)
    }
  }
  // Day-hike lead photos ride with their region too: /hike/:id is paid
  // content, and a trail page is most needed exactly where there is no signal.
  for (const hike of HIKES) {
    if (hike.region !== region.id || !hike.photo) continue
    for (const url of precachePhotoUrls(hike.photo.src, format)) urls.add(url)
  }
  return Array.from(urls)
}

// The Secret Guide's region-less spots (secret-spots.ts) belong to no region,
// so their paid photos are in no region pack. They get their own pack — the
// hidden-collection stops already ride along in their region's pack via
// includeHidden above, so this covers only SECRET_SPOTS (and the page's cover)
// to avoid double-listing.
function secretGuidePhotoUrls(format: PhotoFormat): string[] {
  const urls = new Set<string>()
  // The cover photograph of /secret-guide, so the page opens whole offline.
  for (const url of precachePhotoUrls(SECRET_GUIDE_META.heroPhoto, format)) urls.add(url)
  for (const spot of SECRET_SPOTS) {
    for (const photo of spot.photos) {
      for (const url of precachePhotoUrls(photo.src, format)) urls.add(url)
    }
  }
  return Array.from(urls)
}

// The quick-ID photos belong to no region either. /wildlife promises to work
// offline, and since September 2026 every entry carries a photo, so the plates
// need a pack of their own or the page renders "Photo coming" tiles in the
// backcountry.
function wildlifePhotoUrls(format: PhotoFormat): string[] {
  const urls = new Set<string>()
  for (const entry of WILDLIFE) {
    if (!entry.photo) continue
    for (const url of precachePhotoUrls(entry.photo.src, format)) urls.add(url)
  }
  return Array.from(urls)
}

const REGION_LABELS: Record<Region, string> = {
  valley: 'Yosemite Valley photos',
  'glacier-mariposa': 'Glacier Point & Mariposa photos',
  tuolumne: 'Tuolumne photos',
  'hetch-hetchy': 'Hetch Hetchy photos',
}

// Display estimate for photos: packs fetch only the one format this device
// renders (avif/webp/jpg) across the width ladder, plus the small JPEG the map
// popup needs, so a photo is ~5 URLs averaging ~120 KB. Map packs need no
// estimate: gen-map-tiles.ts measured every tile they list.
const PHOTO_BYTES_PER_URL = 120_000

// The label glyphs and sprite sheets the style fetches from /map-assets
// (public/map-assets/README.md). Both schemes' sprites, so switching the
// colour scheme in the backcountry still draws.
const MAP_FONTS = ['Noto Sans Regular', 'Noto Sans Medium', 'Noto Sans Italic']
const MAP_GLYPH_RANGES = ['0-255', '256-511', '8192-8447']
const MAP_ASSET_URLS = [
  ...MAP_FONTS.flatMap((f) => MAP_GLYPH_RANGES.map((r) => `/map-assets/fonts/${encodeURIComponent(f)}/${r}.pbf`)),
  ...['light', 'dark'].flatMap((s) => ['', '@2x'].flatMap((x) => [`/map-assets/sprites/${s}${x}.json`, `/map-assets/sprites/${s}${x}.png`])),
]
const MAP_ASSET_BYTES = 910_000
// public/map/roads-*.json, uncompressed (what the cache stores).
const ROADS_BYTES = 425_000 + 23_000 // and the trails file

export function mapTileUrl(t: TileAddress): string {
  return t.kind === 'vt'
    ? `${API_BASE}/vt/${TILESET.version}/${t.z}/${t.x}/${t.y}.mvt`
    : `${API_BASE}/dem/${TILESET.version}/${t.z}/${t.x}/${t.y}.webp`
}

function mapPacks(): Pack[] {
  const overview: Pack = {
    id: MAP_OVERVIEW_PACK_ID,
    label: 'Park map: overview',
    detail: 'The whole park in 3D at driving scale, every label, and the road network trip routes follow. Needed by each area below.',
    cacheName: TILES_CACHE,
    // The road graph rides here: every area's trip routes are drawn from it.
    urls: [...MAP_ASSET_URLS, ROADS_URL, TRAILS_URL, ...overviewTiles().map(mapTileUrl)],
    approxBytes: (TILESET.packs.overview?.bytes ?? 0) + MAP_ASSET_BYTES + ROADS_BYTES,
    tolerateMissing: 0.02,
  }
  const regions = OFFLINE_REGIONS.map<Pack>((r) => ({
    id: mapRegionPackId(r.id),
    label: `Park map: ${r.label}`,
    detail: `Trailhead-scale detail. ${r.detail}`,
    cacheName: TILES_CACHE,
    urls: regionTiles(r.id).map(mapTileUrl),
    approxBytes: TILESET.packs[r.id]?.bytes ?? 0,
    tolerateMissing: 0.02,
    requires: MAP_OVERVIEW_PACK_ID,
    bbox: r.bbox,
  }))
  return [overview, ...regions]
}

export function buildPacks(format: PhotoFormat): Pack[] {
  const regionPacks: Pack[] = REGIONS.map((region) => {
    const urls = regionPhotoUrls(region, format)
    return {
      id: regionPackId(region.id),
      label: REGION_LABELS[region.id],
      detail: 'Every stop and trail photo in the region, all sizes',
      cacheName: RUNTIME_CACHE,
      urls,
      approxBytes: urls.length * PHOTO_BYTES_PER_URL,
      tolerateMissing: 0,
    }
  })

  const secretUrls = secretGuidePhotoUrls(format)
  const secretPack: Pack = {
    id: SECRET_PACK_ID,
    label: 'Secret Guide photos',
    detail: 'Every photo in the region-less secret spots, all sizes',
    cacheName: RUNTIME_CACHE,
    urls: secretUrls,
    approxBytes: secretUrls.length * PHOTO_BYTES_PER_URL,
    tolerateMissing: 0,
  }

  const wildlifeUrls = wildlifePhotoUrls(format)
  const wildlifePack: Pack = {
    id: WILDLIFE_PACK_ID,
    label: 'Wildlife quick-ID photos',
    detail: 'One identification photo for every animal, bird, and tree on /wildlife',
    cacheName: RUNTIME_CACHE,
    urls: wildlifeUrls,
    approxBytes: wildlifeUrls.length * PHOTO_BYTES_PER_URL,
    tolerateMissing: 0,
  }

  // Trail tracks: small JSONs (geometry + elevation profile per hike), so the
  // whole set is one pack. Same cache the SW serves /tracks/ requests from;
  // the ?v= content hash in each URL turns entries over on regeneration.
  const trackUrls = Object.keys(TRACKS).map(trackUrl)
  const tracksPack: Pack = {
    id: TRACKS_PACK_ID,
    label: 'Trail tracks & elevation',
    detail: 'GPS tracks and elevation profiles for every verified day hike',
    cacheName: RUNTIME_CACHE,
    urls: trackUrls,
    approxBytes: trackUrls.length * 7_000,
    tolerateMissing: 0,
  }

  return [...regionPacks, secretPack, wildlifePack, tracksPack, ...mapPacks()]
}

export function formatBytes(bytes: number): string {
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1000))} KB`
  if (bytes < 10_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
  return `${Math.round(bytes / 1_000_000)} MB`
}
