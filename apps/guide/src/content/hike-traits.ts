// =============================================================================
// HIKE TRAITS — the trail matcher's judgment layer, kept out of hikes.ts on
// purpose: the catalog carries verified numbers (distance, gain, published
// stats), this file carries editorial calls (is it kid-friendly, how crowded,
// how much shade) that were assigned from each hike's own prose and stats in
// July 2026 and adversarially cross-checked against the descriptions. A call
// that contradicts the catalog's prose is a bug; fix the call or the prose,
// never let them disagree.
//
// kidFriendly: a typical six-year-old finishes it and enjoys it.
// stroller:    paved or boardwalk-smooth the whole way (rare here).
// crowd:       relative to Yosemite trails, not to wilderness generally.
// shade:       exposed (open granite), partial, or shaded (forest walk).
//
// Validated at module load against the hike catalog in both directions: a
// hike without traits or a trait for a retired hike id throws in the Vite
// overlay and fails the build, same posture as Stops.parse.
// =============================================================================

import { z } from 'zod'
import { HIKES } from './hikes'

export const HikeTraits = z.object({
  kidFriendly: z.boolean(),
  stroller: z.boolean(),
  crowd: z.enum(['low', 'moderate', 'high']),
  shade: z.enum(['exposed', 'partial', 'shaded']),
})
export type HikeTraitsT = z.infer<typeof HikeTraits>

const TRAITS: Record<string, HikeTraitsT> = {
  'lower-yosemite-fall': { kidFriendly: true, stroller: true, crowd: 'high', shade: 'partial' },
  'cooks-meadow': { kidFriendly: true, stroller: false, crowd: 'high', shade: 'exposed' },
  'bridalveil-fall': { kidFriendly: true, stroller: true, crowd: 'high', shade: 'exposed' },
  'mirror-lake': { kidFriendly: true, stroller: false, crowd: 'moderate', shade: 'shaded' },
  'valley-loop-trail': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'artist-point': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'partial' },
  'inspiration-point': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'columbia-rock': { kidFriendly: false, stroller: false, crowd: 'high', shade: 'exposed' },
  'vernal-fall-mist-trail': { kidFriendly: false, stroller: false, crowd: 'high', shade: 'partial' },
  'nevada-fall': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'partial' },
  'upper-yosemite-fall': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'exposed' },
  'four-mile-trail': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'exposed' },
  'half-dome': { kidFriendly: false, stroller: false, crowd: 'high', shade: 'exposed' },
  'eagle-peak': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'snow-creek-trail': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'exposed' },
  'mcgurk-meadow': { kidFriendly: true, stroller: false, crowd: 'moderate', shade: 'shaded' },
  'dewey-point': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'taft-point': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'exposed' },
  'sentinel-dome': { kidFriendly: true, stroller: false, crowd: 'moderate', shade: 'exposed' },
  'sentinel-taft-loop': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'illilouette-fall': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'panorama-trail': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'partial' },
  'pohono-trail': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'mono-meadow': { kidFriendly: true, stroller: false, crowd: 'moderate', shade: 'partial' },
  'ostrander-lake': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'wawona-meadow-loop': { kidFriendly: true, stroller: false, crowd: 'low', shade: 'partial' },
  'wawona-swinging-bridge': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'chilnualna-falls': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'partial' },
  'grizzly-giant-loop': { kidFriendly: true, stroller: false, crowd: 'high', shade: 'shaded' },
  'mariposa-grove-guardians-loop': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'tuolumne-grove': { kidFriendly: true, stroller: false, crowd: 'low', shade: 'shaded' },
  'lukens-lake': { kidFriendly: true, stroller: false, crowd: 'moderate', shade: 'shaded' },
  'harden-lake': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'may-lake': { kidFriendly: true, stroller: false, crowd: 'moderate', shade: 'partial' },
  'mount-hoffmann': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'exposed' },
  'olmsted-point': { kidFriendly: true, stroller: false, crowd: 'high', shade: 'exposed' },
  'tenaya-lake-loop': { kidFriendly: true, stroller: false, crowd: 'high', shade: 'exposed' },
  'sunrise-lakes': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'partial' },
  'clouds-rest': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'exposed' },
  'north-dome': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'pothole-dome': { kidFriendly: true, stroller: false, crowd: 'moderate', shade: 'exposed' },
  'soda-springs-parsons-lodge': { kidFriendly: true, stroller: false, crowd: 'moderate', shade: 'exposed' },
  'lembert-dome': { kidFriendly: false, stroller: false, crowd: 'high', shade: 'exposed' },
  'dog-lake': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'partial' },
  'elizabeth-lake': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'shaded' },
  'cathedral-lakes': { kidFriendly: false, stroller: false, crowd: 'high', shade: 'partial' },
  'glen-aulin': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'partial' },
  'lyell-canyon': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'exposed' },
  'mono-pass': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'exposed' },
  'gaylor-lakes': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'exposed' },
  'mount-dana': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'exposed' },
  'lookout-point': { kidFriendly: true, stroller: false, crowd: 'moderate', shade: 'partial' },
  'wapama-falls': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'partial' },
  'rancheria-falls': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'exposed' },
  'poopenaut-valley': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'partial' },
  'carlon-falls': { kidFriendly: false, stroller: false, crowd: 'moderate', shade: 'shaded' },
  'merced-grove': { kidFriendly: false, stroller: false, crowd: 'low', shade: 'shaded' },
}

// Both directions checked so the map can never silently drift from hikes.ts.
{
  const hikeIds = new Set(HIKES.map((h) => h.id))
  for (const id of Object.keys(TRAITS)) {
    if (!hikeIds.has(id)) throw new Error(`hike-traits: unknown hike id '${id}'`)
    HikeTraits.parse(TRAITS[id])
  }
  for (const id of hikeIds) {
    if (!TRAITS[id]) throw new Error(`hike-traits: missing traits for hike '${id}'`)
  }
}

export function getHikeTraits(hikeId: string): HikeTraitsT | undefined {
  return TRAITS[hikeId]
}
