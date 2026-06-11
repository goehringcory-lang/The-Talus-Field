// =============================================================================
// SECRET SPOTS — the locked section.
//
// Seeded empty on purpose. The section unlocks itself the moment the first
// spot is added to `seed` below: secret parking turnouts, unsigned trailheads,
// insider notes. Same shape as a Stop minus `region` (these live outside the
// three-region geography). Every coord added here needs a real ground-truth
// pass before launch, same rule as stops.ts.
// =============================================================================

import { z } from 'zod'
import { SecretSpots, type SecretSpotT } from './schema'

type SecretSpotInput = z.input<typeof SecretSpots>[number]

const seed: SecretSpotInput[] = [
  // Example shape (leave commented until the content is real and verified):
  // {
  //   id: 'example-turnout',
  //   title: 'The turnout nobody slows down for',
  //   order: 1,
  //   kind: 'parking',
  //   coord: [-119.0, 37.0], // TODO: verify
  //   timeBudgetMin: 10,
  //   body: 'Why this spot, when to use it, what most people get wrong.',
  //   photos: [],
  // },
]

export const SECRET_SPOTS: SecretSpotT[] = SecretSpots.parse(seed).sort(
  (a, b) => a.order - b.order,
)

export const SECRET_META = {
  title: 'The Secret Spots',
  teaser:
    'Secret parking, quiet trails, the things that do not go in articles. In the works. Included with your purchase.',
}

export function secretsLocked(): boolean {
  return SECRET_SPOTS.length === 0
}
