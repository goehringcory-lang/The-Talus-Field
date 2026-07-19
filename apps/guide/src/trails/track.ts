// =============================================================================
// Track helpers: URL building, out-and-back mirroring, and the derived
// difficulty numbers the hike detail page reports. Everything here is
// computed from verified track data, never invented.
// =============================================================================

import { TRACKS, TRACKS_VERSION, type TrackSummary } from '../content/trails.generated'
import type { HikeT } from '../content'
import type { TrackT } from './schema'

export { TRACKS, TRACKS_VERSION }
export type { TrackSummary }

/** Track file URL. The ?v= content hash turns the cache-first runtime cache
 * over when tracks are regenerated (same discipline as the editorial site's
 * cache busters). */
export function trackUrl(hikeId: string): string {
  return `/tracks/${hikeId}.json?v=${TRACKS_VERSION}`
}

export function hasTrack(hikeId: string): boolean {
  return Object.hasOwn(TRACKS, hikeId)
}

export function getTrackSummary(hikeId: string): TrackSummary | undefined {
  return TRACKS[hikeId]
}

/** The stored profile covers the stored line; an out-and-back walks it there
 * and back, so mirror it for display. Loops/lollipops/one-ways are stored in
 * full. Returned points are [mi, ft] over the whole walked route. */
export function fullProfile(track: TrackT): [number, number][] {
  if (track.route !== 'out-and-back') return track.profile
  const out = track.profile
  const total = out[out.length - 1][0]
  const back: [number, number][] = []
  for (let i = out.length - 2; i >= 0; i--) {
    back.push([2 * total - out[i][0], out[i][1]])
  }
  return [...out, ...back]
}

// --- derived difficulty ------------------------------------------------------

/** Petzoldt-style energy miles: distance plus a mile per 500 ft of climbing.
 * The standard backpacker's effort estimate; computed from the verified
 * track's full-route numbers. */
export function energyMiles(mi: number, gainFt: number): number {
  return mi + gainFt / 500
}

export type EffortClass = 'easy' | 'moderate' | 'strenuous' | 'very-strenuous'

export const EFFORT_LABEL: Record<EffortClass, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  strenuous: 'Strenuous',
  'very-strenuous': 'Very strenuous',
}

/** Conventional energy-mile bands (< 6 easy, 6–12 moderate, 12–20 strenuous,
 * 20+ very strenuous). A second opinion beside the catalog's editorial call,
 * derived purely from the numbers. */
export function effortClass(em: number): EffortClass {
  if (em < 6) return 'easy'
  if (em < 12) return 'moderate'
  if (em < 20) return 'strenuous'
  return 'very-strenuous'
}

/** Altitude note threshold: above ~8,000 ft most lowland visitors feel it. */
export const ALTITUDE_NOTE_FT = 8000

/** Grade in percent between consecutive profile points at the given full-route
 * position, for the profile scrub readout. */
export function gradeAt(profile: [number, number][], mi: number): number {
  if (profile.length < 2) return 0
  let i = 1
  while (i < profile.length - 1 && profile[i][0] < mi) i++
  const [m0, f0] = profile[i - 1]
  const [m1, f1] = profile[i]
  const dm = (m1 - m0) * 5280
  if (dm <= 0) return 0
  return ((f1 - f0) / dm) * 100
}

/** Summary line for a hike's track availability, used by list rows. */
export function trackStatusLabel(hike: HikeT): string | null {
  const t = getTrackSummary(hike.id)
  if (!t) return null
  return t.verified ? 'GPS track' : 'GPS track (approx.)'
}
