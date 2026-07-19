// =============================================================================
// Track file schema — mirrors the JSON emitted by scripts/gen-hike-tracks.mjs
// into public/tracks/<hikeId>.json (kept in sync by hand, same policy as the
// programs and weather schemas). Geometry is USGS National Map trail linework
// (NPS source data); elevations are USGS 3DEP. `verified` records how the
// track compared to the published stats in content/hikes.ts at generation
// time: 'match' landed inside the strict tolerance, 'approx' inside the wide
// one (always labeled in the UI).
// =============================================================================

import { z } from 'zod'

export const TrackVerdict = z.enum(['match', 'approx'])

export const Track = z.object({
  v: z.literal(1),
  id: z.string(),
  route: z.enum(['out-and-back', 'loop', 'lollipop', 'one-way']),
  source: z.object({
    geometry: z.string(),
    elevation: z.string(),
  }),
  verified: z.object({
    distance: TrackVerdict,
    gain: TrackVerdict,
  }),
  lineMi: z.number(),          // length of the stored line
  fullMi: z.number(),          // full walked distance (out-and-backs doubled)
  line: z.array(z.tuple([z.number(), z.number()])).min(2), // [lng, lat]
  profile: z.array(z.tuple([z.number(), z.number()])).min(2), // [mi, ft] over the stored line
  stats: z.object({
    gainFt: z.number(),
    lossFt: z.number(),
    minFt: z.number(),
    maxFt: z.number(),
    trailheadFt: z.number(),
    maxGradePct: z.number(),
    highPointMi: z.number(),
  }),
  note: z.string().optional(),
})

export type TrackT = z.infer<typeof Track>
