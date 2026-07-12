// =============================================================================
// THE SECRET GUIDE — page copy and category metadata for /secret-guide.
//
// The merged premium section: region-less secret spots (secret-spots.ts)
// plus the hidden-collection stops (stops.ts), filtered by SecretCategory.
// The entries themselves come from getSecretGuideEntries() in ./index.
// =============================================================================

import type { SecretCategoryT } from './schema'

export const SECRET_GUIDE_META = {
  title: 'The Secret Guide',
  teaser:
    'The quiet vistas, the trails the crowds walk past, the parking moves that save a morning, the camping you can actually get, and the park after dark. None of it makes the brochures. All of it works on the map and in your trip plan.',
}

// Filter tabs and category sections, in display order.
export const SECRET_GUIDE_CATEGORIES: { id: SecretCategoryT; title: string; tagline: string }[] = [
  {
    id: 'vistas',
    title: 'Quiet Vistas',
    tagline:
      'The views without the queues. Small water, empty riverbanks, and the compositions people hike right past.',
  },
  {
    id: 'trails',
    title: 'Hidden Trails',
    tagline:
      'Real trails to real destinations, starting past the point where the crowds turn around.',
  },
  {
    id: 'parking',
    title: 'Parking',
    tagline: 'Where to put the car when the valley is full by nine.',
  },
  {
    id: 'camping',
    title: 'Camping',
    tagline: 'Quiet, legal places to sleep, with paperwork you can actually get.',
  },
  {
    id: 'after-dark',
    title: 'After Dark',
    tagline:
      'What the park does once the light goes. Headlamps on El Capitan, the Milky Way at 8,300 feet.',
  },
]

export const SECRET_GUIDE_CATEGORY_TITLE: Record<SecretCategoryT, string> = Object.fromEntries(
  SECRET_GUIDE_CATEGORIES.map((c) => [c.id, c.title]),
) as Record<SecretCategoryT, string>
