import { stops } from './stops'
import { ESSENTIALS } from './essentials'
import type { EssentialSectionT, EssentialTopicT, Region, StopT } from './schema'

export { Stop, Stops, RegionEnum, StopKindEnum, StopCollection, SecretSpot, SecretSpots, SecretSpotSection, EssentialTopic, EssentialTopics, EssentialSection, SeasonalEvent, SeasonalEvents, SeasonalConfidence, Amenity, Amenities, AmenityKindEnum } from './schema'
export type { StopT, Region, StopKind, StopCollectionT, SecretSpotT, SecretSpotSectionT, EssentialTopicT, EssentialSectionT, SeasonalEventT, SeasonalConfidenceT, AmenityT, AmenityKind } from './schema'
export { stops } from './stops'
export { AMENITIES } from './amenities'
export { ESSENTIALS, ESSENTIALS_META } from './essentials'
export { SECRET_SPOTS, SECRET_META, SECRET_SECTIONS } from './secret-spots'
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

export const HIDDEN_META = {
  title: 'The Hidden Areas',
  teaser:
    'Twenty maintained trails and viewpoints the crowds walk past. Real trails, real destinations, no scrambling. Included with your purchase.',
}

export function getStopById(id: string): StopT | undefined {
  return stops.find((s) => s.id === id)
}

export function getRegionMeta(id: Region): { title: string; teaser: string } | undefined {
  const r = REGIONS.find((r) => r.id === id)
  return r ? { title: r.title, teaser: r.teaser } : undefined
}

export function getEssentialById(id: string): EssentialTopicT | undefined {
  return ESSENTIALS.find((t) => t.id === id)
}
