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
    'Uncrowded viewpoints, trails past where most hikers turn around, parking when the main lots fill, campsites you can get, and the park after dark. Every entry is pinned on the map, works offline, and drops into your trip plan.',
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
      'Viewpoints without the queues: small waterfalls, riverbanks, and reflections near the main sights.',
  },
  {
    id: 'trails',
    title: 'Hidden Trails',
    tagline:
      'Trails that continue past where most hikers turn around, inside the park and just outside it.',
  },
  {
    id: 'parking',
    title: 'Parking',
    tagline: 'Where to park when the lot you wanted is full.',
  },
  {
    id: 'camping',
    title: 'Camping',
    tagline: 'Legal places to sleep, with permits you can get, inside and outside the boundary.',
  },
  {
    id: 'after-dark',
    title: 'After Dark',
    tagline:
      'The park after sunset: headlamps on El Capitan, a moonbow at the falls, the Milky Way at 8,300 feet.',
  },
]

// Folio numerals for the categories, in SECRET_GUIDE_CATEGORIES order: the
// contents index, the section heads and each entry's folio line all read them.
export const SECRET_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] as const

export const SECRET_GUIDE_CATEGORY_TITLE: Record<SecretCategoryT, string> = Object.fromEntries(
  SECRET_GUIDE_CATEGORIES.map((c) => [c.id, c.title]),
) as Record<SecretCategoryT, string>
