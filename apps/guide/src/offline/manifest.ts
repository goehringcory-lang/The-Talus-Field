// =============================================================================
// Offline download packs.
//
// Each pack is a flat URL list plus which Cache API bucket it belongs in:
// photos go to the SW's runtime cache, map tiles to the unversioned tile
// cache. Both caches survive shell-cache rotation on deploy, so a downloaded
// pack outlives app updates. approxBytes are display estimates with the real
// figure depending on format negotiation (AVIF vs JPG) and tile content.
// =============================================================================

import { REGIONS, getStopsByRegion, type Region } from '../content'
import { allPhotoUrls } from '../utils/photo'
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

function regionPhotoUrls(region: (typeof REGIONS)[number]): string[] {
  const urls = new Set<string>()
  // The region's picker-card hero belongs offline with its stops.
  for (const url of allPhotoUrls(region.photo.src)) urls.add(url)
  // Hidden areas are paid content too; their photos belong in the pack.
  for (const stop of getStopsByRegion(region.id, { includeHidden: true })) {
    for (const photo of stop.photos) {
      for (const url of allPhotoUrls(photo.src)) urls.add(url)
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

// Display estimates. Photos: every responsive variant of a base image sums
// to roughly 2.5 MB, but the browser only requests one format per width, so
// the cached set lands well under the worst case. Tiles: ~25 KB average.
const PHOTO_BYTES_PER_URL = 180_000
const TILE_BYTES = 25_000

export function buildPacks(): Pack[] {
  const regionPacks: Pack[] = REGIONS.map((region) => {
    const urls = regionPhotoUrls(region)
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

  return [...regionPacks, mapPack]
}

export function formatBytes(bytes: number): string {
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1000))} KB`
  return `${Math.round(bytes / 1_000_000)} MB`
}
