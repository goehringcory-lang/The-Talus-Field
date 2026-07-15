// =============================================================================
// Offline download packs.
//
// Each pack is a flat URL list plus which Cache API bucket it belongs in:
// photos go to the SW's runtime cache, map tiles to the unversioned tile
// cache. Both caches survive shell-cache rotation on deploy, so a downloaded
// pack outlives app updates. approxBytes are display estimates with the real
// figure depending on format negotiation (AVIF vs JPG) and tile content.
// =============================================================================

import { REGIONS, getStopsByRegion, SECRET_SPOTS, type Region } from '../content'
import { precachePhotoUrls, type PhotoFormat } from '../utils/photo'
import { buildTileUrls } from './tiles'

export const RUNTIME_CACHE = 'tfg-runtime'
export const TILES_CACHE = 'tfg-tiles'

export type Pack = {
  id: string
  label: string
  detail: string
  cacheName: string
  urls: string[]
  approxBytes: number
  // Fraction of URLs allowed to fail while still recording the pack as done.
  // Photo packs tolerate nothing: every photo is paid content. The tile pack
  // tolerates a few missing tiles at the bbox edge.
  tolerateMissing: number
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
  return Array.from(urls)
}

// The Secret Guide's region-less spots (secret-spots.ts) belong to no region,
// so their paid photos are in no region pack. They get their own pack — the
// hidden-collection stops already ride along in their region's pack via
// includeHidden above, so this covers only SECRET_SPOTS to avoid double-listing.
function secretGuidePhotoUrls(format: PhotoFormat): string[] {
  const urls = new Set<string>()
  for (const spot of SECRET_SPOTS) {
    for (const photo of spot.photos) {
      for (const url of precachePhotoUrls(photo.src, format)) urls.add(url)
    }
  }
  return Array.from(urls)
}

const REGION_LABELS: Record<Region, string> = {
  valley: 'Yosemite Valley photos',
  'glacier-mariposa': 'Glacier Point & Mariposa photos',
  tuolumne: 'Tuolumne photos',
  'hetch-hetchy': 'Hetch Hetchy photos',
}

// Display estimates. Photos: packs now fetch only the one format this device
// renders (avif/webp/jpg) across the width ladder, plus the small JPEG the map
// popup needs, so a photo is ~5 URLs averaging ~120 KB. Tiles: ~25 KB average.
const PHOTO_BYTES_PER_URL = 120_000
const TILE_BYTES = 25_000

export function buildPacks(format: PhotoFormat): Pack[] {
  const regionPacks: Pack[] = REGIONS.map((region) => {
    const urls = regionPhotoUrls(region, format)
    return {
      id: `photos-${region.id}`,
      label: REGION_LABELS[region.id],
      detail: 'Every photo in the region, all sizes',
      cacheName: RUNTIME_CACHE,
      urls,
      approxBytes: urls.length * PHOTO_BYTES_PER_URL,
      tolerateMissing: 0,
    }
  })

  const secretUrls = secretGuidePhotoUrls(format)
  const secretPack: Pack = {
    id: 'photos-secret-guide',
    label: 'Secret Guide photos',
    detail: 'Every photo in the region-less secret spots, all sizes',
    cacheName: RUNTIME_CACHE,
    urls: secretUrls,
    approxBytes: secretUrls.length * PHOTO_BYTES_PER_URL,
    tolerateMissing: 0,
  }

  const tileUrls = buildTileUrls()
  const mapPack: Pack = {
    id: 'park-map',
    label: 'Offline park map',
    detail: 'Topo tiles for the whole park and the road corridors',
    cacheName: TILES_CACHE,
    urls: tileUrls,
    approxBytes: tileUrls.length * TILE_BYTES,
    tolerateMissing: 0.05,
  }

  return [...regionPacks, secretPack, mapPack]
}

export function formatBytes(bytes: number): string {
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1000))} KB`
  return `${Math.round(bytes / 1_000_000)} MB`
}
