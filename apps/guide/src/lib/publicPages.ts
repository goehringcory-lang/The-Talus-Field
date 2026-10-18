// =============================================================================
// The storefront pages search engines may index, and what each one says about
// itself. Everything else in the app is gated or personal and stays behind
// index.html's `noindex, nofollow`.
//
// Two readers, one table, so they cannot disagree:
//   - the routes (/preview, StopTeaser) set their document title from here;
//   - scripts/prerender-public.ts writes one static HTML file per page into
//     dist/ with the same title, the description, a canonical URL on the
//     production host, per-page social tags, and the page's own markup, then
//     lists the pages in dist/sitemap.xml.
//
// Indexed: /preview and the teaser of every core stop, plus the five sample
// entries (which /preview already reproduces in full). NOT indexed: the
// teasers of the Secret Guide's entries (secret spots and hidden stops). Their
// names are the premium section's whole premise, and a search result listing
// "the unsigned turnouts" by name gives them away; the pages still render for
// anyone holding a shared link, they are just not offered to crawlers.
// =============================================================================

import {
  REGIONS,
  getRegionMeta,
  getSecretGuideEntries,
  getStopsByRegion,
  isSecretGuideEntry,
} from '../content'
import type { GuideStopT } from '../content'
import { isPreviewStopId } from './storefront'

// The production host. The pages.dev host serves the same files but carries a
// host-scoped noindex header (public/_headers), and every canonical points here.
export const PUBLIC_ORIGIN = 'https://guide.thetalusfieldjournal.com'

export const PREVIEW_DOCUMENT_TITLE = 'Free sample · Yosemite Field Guide'

export type PublicPage = {
  path: string
  /** The document title minus the " · The Talus Field" suffix useDocumentTitle adds. */
  title: string
  description: string
  /** Site-relative photo path for og:image. */
  image?: string
}

export function coreStopCount(): number {
  return REGIONS.reduce((n, r) => n + getStopsByRegion(r.id).length, 0)
}

export function stopTeaserTitle(stop: GuideStopT): string {
  return `${stop.title} · Yosemite Field Guide`
}

/** The teaser page's intro line: the entry's own teaser, else a line placing it. */
export function stopTeaserIntro(stop: GuideStopT): string {
  if (stop.teaser) return stop.teaser
  return isSecretGuideEntry(stop)
    ? `One of the ${getSecretGuideEntries().length} entries in the Secret Guide: the unsigned turnouts, quiet trails, and after-dark spots that never make it into articles.`
    : `One of the ${coreStopCount()} stops in the Field Guide's regional reading order.`
}

function stopDescription(stop: GuideStopT): string {
  const region = 'region' in stop ? getRegionMeta(stop.region)?.title : undefined
  const lead = stopTeaserIntro(stop).trim()
  const where = region
    ? ` From the ${region} section of The Talus Field's offline Yosemite Field Guide.`
    : " From The Talus Field's offline Yosemite Field Guide."
  return (/[.!?]$/.test(lead) ? lead : `${lead}.`) + where
}

export function isIndexableStop(stop: GuideStopT): boolean {
  return !isSecretGuideEntry(stop) || isPreviewStopId(stop.id)
}

export type IndexedStopGroup = { id: string; title: string; stops: GuideStopT[] }

/**
 * The indexed teasers in reading order, grouped the way /preview lists them:
 * each region's core stops, then the one Secret Guide sample. The sitemap,
 * /preview's stop index and the teasers' prev/next all read this, so a page
 * in the sitemap is never left without an inbound link.
 */
export function indexedStopGroups(): IndexedStopGroup[] {
  const groups: IndexedStopGroup[] = REGIONS.map((r) => ({
    id: r.id,
    title: r.title,
    stops: getStopsByRegion(r.id).filter(isIndexableStop),
  }))
  groups.push({
    id: 'secret-guide',
    title: 'The Secret Guide',
    stops: getSecretGuideEntries().filter(isIndexableStop),
  })
  return groups.filter((g) => g.stops.length > 0)
}

export function indexedStops(): GuideStopT[] {
  return indexedStopGroups().flatMap((g) => g.stops)
}

/** Neighbours in reading order; both undefined for a teaser that is not indexed. */
export function adjacentIndexedStops(id: string): { prev?: GuideStopT; next?: GuideStopT } {
  const order = indexedStops()
  const i = order.findIndex((s) => s.id === id)
  if (i < 0) return {}
  return { prev: order[i - 1], next: order[i + 1] }
}

export function publicPages(): PublicPage[] {
  const pages: PublicPage[] = [
    {
      path: '/preview',
      title: PREVIEW_DOCUMENT_TITLE,
      description:
        'Five real entries from the offline Yosemite Field Guide, reproduced in full: one stop from each of the four regions and one from the Secret Guide.',
      image: '/photos/tunnel-view-panorama.jpg',
    },
  ]
  for (const stop of indexedStops()) {
    pages.push({
      path: `/stop/${stop.id}`,
      title: stopTeaserTitle(stop),
      description: stopDescription(stop),
      image: stop.photos[0]?.src,
    })
  }
  return pages
}
