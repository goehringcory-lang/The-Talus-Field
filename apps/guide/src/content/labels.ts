// Reader-facing labels and meta formatters for stops, shared by the stop
// card and the signed-out teaser page.

import type { StopT } from './schema'

export const KIND_LABEL: Record<StopT['kind'], string> = {
  viewpoint: 'Viewpoint',
  trailhead: 'Trailhead',
  parking: 'Parking',
  lodging: 'Lodging',
  meal: 'Meal',
  drive: 'Drive',
  camping: 'Camping', // map amenities and secret spots; no core Stop uses it
}

export const DIFFICULTY_LABEL: Record<NonNullable<StopT['difficulty']>, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  strenuous: 'Strenuous',
}

export function formatElevation(ft: number): string {
  return `${ft.toLocaleString('en-US')} ft`
}

export function formatTime(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`
}
