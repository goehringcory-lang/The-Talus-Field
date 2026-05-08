import { stops } from './stops'
import type { Region, StopT } from './schema'

export { Stop, Stops, RegionEnum, StopKindEnum } from './schema'
export type { StopT, Region, StopKind } from './schema'
export { stops } from './stops'

export const REGIONS: { id: Region; title: string; teaser: string }[] = [
  {
    id: 'valley',
    title: 'Yosemite Valley & surrounding areas',
    teaser:
      'The valley floor and the rim viewpoints that look down into it. Tunnel View, the meadows, the climbing wall, the Mist Trail, the lodgings.',
  },
  {
    id: 'glacier-mariposa',
    title: 'Glacier Point & the Mariposa Grove',
    teaser:
      'The southern rim and the giant sequoias. Higher elevation, more driving, big payoff views. Closed in winter.',
  },
  {
    id: 'tuolumne',
    title: 'Tuolumne Meadows & the Highway 120 corridor',
    teaser:
      'The high country. Granite domes, alpine lakes, the meadow that turns the trip into something bigger than the valley. Tioga Road open roughly June through October.',
  },
]

export function getStopsByRegion(region: Region): StopT[] {
  return stops.filter((s) => s.region === region).sort((a, b) => a.order - b.order)
}

export function getStopById(id: string): StopT | undefined {
  return stops.find((s) => s.id === id)
}

export function getRegionMeta(id: Region): { title: string; teaser: string } | undefined {
  const r = REGIONS.find((r) => r.id === id)
  return r ? { title: r.title, teaser: r.teaser } : undefined
}
