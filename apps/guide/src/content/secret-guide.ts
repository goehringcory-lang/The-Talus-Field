// =============================================================================
// THE SECRET GUIDE — page copy and category metadata for /secret-guide.
//
// The merged premium section: region-less secret spots (secret-spots.ts)
// plus the hidden-collection stops (stops.ts), filtered by SecretCategory.
// The entries themselves come from getSecretGuideEntries() in ./index.
//
// Nothing here may state a count or a date: the folio reads its numbers live
// from the entries, and this copy is bundled into every installed copy of the
// app until the next update.
// =============================================================================

import type { SecretCategoryT } from './schema'

export const SECRET_GUIDE_META = {
  title: 'The Secret Guide',
  eyebrow: 'Included with purchase',
  teaser:
    'The quiet vistas, the trails past where the crowds turn around, the parking moves that save a morning, the camping you can actually get, and the park after dark. None of it makes the brochures. Every entry is pinned on the map, works offline, and drops into your trip plan.',
  // The foot line of the folio: what every entry in the section carries.
  // Each one is a fact about the app, not the park, so it cannot go stale.
  promises: ['Pinned on the map', 'Works offline', 'Drops into the plan'],
}

// Filter tabs and category sections, in display order.
export const SECRET_GUIDE_CATEGORIES: { id: SecretCategoryT; title: string; tagline: string }[] = [
  {
    id: 'vistas',
    title: 'Quiet Vistas',
    tagline:
      'The views without the queues. Small water, empty riverbanks, reflections, and the compositions people hike right past.',
  },
  {
    id: 'trails',
    title: 'Hidden Trails',
    tagline:
      'Real trails to real destinations, starting past the point where the crowds turn around, inside the park and just over its line.',
  },
  {
    id: 'parking',
    title: 'Parking',
    tagline: 'Where to put the car when the lot you wanted is full, and the move that turns a full lot into a better day.',
  },
  {
    id: 'camping',
    title: 'Camping',
    tagline: 'Quiet, legal places to sleep, with paperwork you can actually get, on both sides of the boundary.',
  },
  {
    id: 'after-dark',
    title: 'After Dark',
    tagline:
      'What the park does once the light goes. Headlamps on El Capitan, a moonbow at the falls, the Milky Way at 8,300 feet.',
  },
]

// Folio numerals for the categories, in SECRET_GUIDE_CATEGORIES order: the
// contents index, the section heads and each entry's folio line all read them.
export const SECRET_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] as const

export const SECRET_GUIDE_CATEGORY_TITLE: Record<SecretCategoryT, string> = Object.fromEntries(
  SECRET_GUIDE_CATEGORIES.map((c) => [c.id, c.title]),
) as Record<SecretCategoryT, string>
