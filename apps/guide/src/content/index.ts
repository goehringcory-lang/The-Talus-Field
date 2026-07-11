import { stops } from './stops'
import { ESSENTIALS } from './essentials'
import { SECRET_SPOTS } from './secret-spots'
import { SECRET_GUIDE_CATEGORIES } from './secret-guide'
import type { EssentialSectionT, EssentialTopicT, Region, SecretCategoryT, SecretSpotT, StopT } from './schema'

export { Stop, Stops, RegionEnum, StopKindEnum, StopCollection, SecretCategory, SecretSpot, SecretSpots, EssentialTopic, EssentialTopics, EssentialSection, SeasonalEvent, SeasonalEvents, SeasonalConfidence, Amenity, Amenities, AmenityKindEnum } from './schema'
export type { StopT, Region, StopKind, StopCollectionT, SecretCategoryT, SecretSpotT, EssentialTopicT, EssentialSectionT, SeasonalEventT, SeasonalConfidenceT, AmenityT, AmenityKind } from './schema'
export { stops } from './stops'
export { AMENITIES } from './amenities'
export { ESSENTIALS, ESSENTIALS_META } from './essentials'
export { SECRET_SPOTS } from './secret-spots'
export { SECRET_GUIDE_META, SECRET_GUIDE_CATEGORIES, SECRET_GUIDE_CATEGORY_TITLE } from './secret-guide'
export { SEASONAL_EVENTS, seasonalWindowsInRange, seasonalDaysInRange, seasonalToProgramEvent, seasonalRangeLabel } from './seasonal'

// Section headers for the /essentials list, in display order.
export const ESSENTIAL_SECTIONS: { id: EssentialSectionT; title: string }[] = [
  { id: 'plan', title: 'Planning the trip' },
  { id: 'on-the-ground', title: 'On the ground' },
  { id: 'safety', title: 'Safety' },
  { id: 'packing', title: 'Packing' },
]

export const REGIONS: { id: Region; title: string; teaser: string; photo: { src: string } }[] = [
  {
    id: 'valley',
    title: 'Yosemite Valley & surrounding areas',
    teaser:
      'The valley floor and the rim viewpoints that look down into it. Tunnel View, the meadows, the climbing wall, the Mist Trail, the lodgings.',
    photo: { src: '/photos/region-valley.jpg' },
  },
  {
    id: 'glacier-mariposa',
    title: 'Glacier Point & the Mariposa Grove',
    teaser:
      'The southern rim and the giant sequoias. Higher elevation, more driving, big payoff views. Closed in winter.',
    photo: { src: '/photos/region-glacier-mariposa.jpg' },
  },
  {
    id: 'tuolumne',
    title: 'Tuolumne Meadows & the Highway 120 corridor',
    teaser:
      'The high country. Granite domes, alpine lakes, the meadow that turns the trip into something bigger than the valley. Tioga Road open roughly June through October.',
    photo: { src: '/photos/region-tuolumne.jpg' },
  },
  {
    id: 'hetch-hetchy',
    title: 'Hetch Hetchy & the Evergreen Road corridor',
    teaser:
      'The other granite valley, half of it under a reservoir, with its own entrance and day-use gate hours. Open year-round and nearly empty.',
    photo: { src: '/photos/region-hetch-hetchy.jpg' },
  },
]

// Chip-length region names; the full REGIONS titles are card headlines.
export const REGION_SHORT: Record<Region, string> = {
  valley: 'Valley',
  'glacier-mariposa': 'Glacier Point & Mariposa',
  tuolumne: 'Tuolumne',
  'hetch-hetchy': 'Hetch Hetchy',
}

// Hidden stops stay out of the curated region flow unless a caller opts in;
// leaking them into a core surface should be a visible decision at the call site.
export function getStopsByRegion(region: Region, opts?: { includeHidden?: boolean }): StopT[] {
  return stops
    .filter((s) => s.region === region && (opts?.includeHidden || s.collection !== 'hidden'))
    .sort((a, b) => a.order - b.order)
}

export function getHiddenStops(): StopT[] {
  const regionRank = new Map(REGIONS.map((r, i) => [r.id, i]))
  return stops
    .filter((s) => s.collection === 'hidden')
    .sort(
      (a, b) =>
        (regionRank.get(a.region) ?? 0) - (regionRank.get(b.region) ?? 0) || a.order - b.order,
    )
}

// A stop from either premium surface: core/hidden Stops carry a region,
// SecretSpots do not. Narrow with `'region' in stop`.
export type GuideStopT = StopT | SecretSpotT

// Single resolver for /stop/:id, the trip planner, ICS export, and the map
// popup. Secret spots resolve here too, so a planned secret spot never
// degrades to a raw id.
export function getStopById(id: string): GuideStopT | undefined {
  return stops.find((s) => s.id === id) ?? SECRET_SPOTS.find((s) => s.id === id)
}

export function isSecretGuideEntry(s: GuideStopT): boolean {
  return !('region' in s) || s.collection === 'hidden'
}

// The merged Secret Guide list: category rank (SECRET_GUIDE_CATEGORIES
// order), then secret spots before hidden stops, then region rank, then
// `order` within the source collection.
export function getSecretGuideEntries(category?: SecretCategoryT): GuideStopT[] {
  const catRank = new Map(SECRET_GUIDE_CATEGORIES.map((c, i) => [c.id, i]))
  const regionRank = new Map(REGIONS.map((r, i) => [r.id, i]))
  const merged: GuideStopT[] = [...SECRET_SPOTS, ...stops.filter((s) => s.collection === 'hidden')]
  const key = (s: GuideStopT): [number, number, number, number] => [
    s.category ? catRank.get(s.category) ?? 99 : 99,
    'region' in s ? 1 : 0,
    'region' in s ? regionRank.get(s.region) ?? 0 : 0,
    s.order,
  ]
  return merged
    .filter((s) => !category || s.category === category)
    .sort((a, b) => {
      const ka = key(a)
      const kb = key(b)
      for (let i = 0; i < 4; i++) if (ka[i] !== kb[i]) return ka[i] - kb[i]
      return 0
    })
}

export function getRegionMeta(id: Region): { title: string; teaser: string } | undefined {
  const r = REGIONS.find((r) => r.id === id)
  return r ? { title: r.title, teaser: r.teaser } : undefined
}

export function getEssentialById(id: string): EssentialTopicT | undefined {
  return ESSENTIALS.find((t) => t.id === id)
}
