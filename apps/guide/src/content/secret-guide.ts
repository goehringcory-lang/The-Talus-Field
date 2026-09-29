// =============================================================================
// THE SECRET GUIDE — page copy, chapter metadata, the editor's picks and the
// routes for /secret-guide.
//
// The merged premium section: region-less secret spots (secret-spots.ts)
// plus the hidden-collection stops (stops.ts), filtered by SecretCategory.
// The entries themselves come from getSecretGuideEntries() in ./index.
//
// Nothing here may state a count or a date: the page reads its numbers live
// from the entries, and this copy is bundled into every installed copy of the
// app until the next update. Every pick and every route line restates the
// entry it links to; retire the entry, retire the line (secret-guide.test.ts
// fails on an id that no longer resolves).
// =============================================================================

import type { SecretCategoryT } from './schema'

export const SECRET_GUIDE_META = {
  title: 'The Secret Guide',
  eyebrow: 'Included with your guide',
  teaser:
    'The pullouts, overlooks and after-dark spots the signs skip, the trails past where most people turn around, and the handful of programs worth planning an evening around.',
  // The promise under the hero. Each one is a fact about the app, not the
  // park, so it cannot go stale.
  promises: ['Pinned on the map', 'Works offline', 'Drops into your plan'],
  // The hero photograph: Valley View on a winter night, the Merced under
  // El Capitan. A mood, not an entry, so the credit line under it names it.
  heroPhoto: '/photos/valley-view-winter-night.jpg',
  heroCaption: 'Valley View on a winter night',
}

// Filter tabs and chapters, in display order. `photo` names the entry whose
// first photograph stands for the chapter on its tile; a retired entry falls
// back to the chapter's first entry.
export const SECRET_GUIDE_CATEGORIES: {
  id: SecretCategoryT
  title: string
  tagline: string
  photo: string
}[] = [
  {
    id: 'vistas',
    title: 'Quiet Vistas',
    tagline:
      'Viewpoints without the queues: small waterfalls, riverbanks, and reflections near the main sights.',
    photo: 'swinging-bridge-reflection',
  },
  {
    id: 'trails',
    title: 'Hidden Trails',
    tagline:
      'Trails that continue past where most hikers turn around, inside the park and just outside it.',
    photo: 'yosemite-point',
  },
  {
    id: 'parking',
    title: 'Parking',
    tagline:
      'Where to put the car when the lot you wanted is full: the small pullouts, the lots that hold out, and the rules that come with them.',
    photo: 'tenaya-lake-lots',
  },
  {
    id: 'camping',
    title: 'Camping',
    tagline: 'Legal places to sleep, with permits you can get, inside and outside the boundary.',
    photo: 'tioga-lake-campground',
  },
  {
    id: 'after-dark',
    title: 'After Dark',
    tagline:
      'The park after sunset: headlamps on El Capitan, a moonbow at the falls, the Milky Way at 8,300 feet.',
    photo: 'glacier-point-star-party',
  },
  {
    id: 'programs',
    title: 'Programs',
    tagline:
      'The few guided hours worth planning around: a night sky walk, the Ahwahnee\'s own history tour, the Curry Village evening talk, and the ranger programs to pick.',
    photo: 'ahwahnee-history-tour',
  },
]

// Chapter numerals, in SECRET_GUIDE_CATEGORIES order: the contents, the
// chapter heads and each entry's folio line all read them.
export const SECRET_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'] as const

export const SECRET_GUIDE_CATEGORY_TITLE: Record<SecretCategoryT, string> = Object.fromEntries(
  SECRET_GUIDE_CATEGORIES.map((c) => [c.id, c.title]),
) as Record<SecretCategoryT, string>

// "If you do six things": the editor's short version, opened under the hero.
// Each line is a sentence the entry itself already makes.
export const SECRET_GUIDE_PICKS: { id: string; line: string }[] = [
  { id: 'conservancy-night-sky', line: 'Book the Conservancy\'s night sky program before you book dinner.' },
  { id: 'ahwahnee-history-tour', line: 'Take the free Ahwahnee history tour. The building is the story.' },
  { id: 'el-cap-crossover-parking', line: 'Park at El Capitan, not in the east Valley, and ride in.' },
  { id: 'swinging-bridge-reflection', line: 'Swinging Bridge in May, the hour after the sun reaches the fall.' },
  { id: 'pothole-dome-sunset', line: 'Pothole Dome for the last hour of light in Tuolumne.' },
  { id: 'olmsted-point-at-night', line: 'Olmsted Point in a new-moon week, lamp off, ten minutes.' },
]

// Routes: the Secret Guide in day-sized pieces, laid out the way the
// editorial site's /itineraries lays out its plans. Stops are in the order
// they are driven or walked; `when` is the time of day the entry itself
// names, never a clock time, and the page prices each leg between stops
// from the park's own driving table (trip/slotting.ts), so a route cannot
// promise a drive the planner would refuse.
export type SecretRoute = {
  id: string
  label: string // the tile's big word: "A day", "An evening"
  title: string
  dek: string
  season: string // the one line on when the route works
  stops: { id: string; when: string; note: string }[]
}

export const SECRET_ROUTES: SecretRoute[] = [
  {
    id: 'quiet-valley-day',
    label: 'A day',
    title: 'The Valley, quietly',
    dek: 'The Valley floor at the hours and places the crowd is not, from a foot-high waterfall at dawn to headlamps on El Capitan after dark.',
    season: 'Works all year. The reflection is best in May and early June; the tour runs on the hotel\'s own calendar.',
    stops: [
      { id: 'fern-spring', when: 'First light', note: 'The smallest waterfall in the park, its ferns backlit by the low morning light.' },
      { id: 'swinging-bridge-reflection', when: 'Mid-morning', note: 'Yosemite Falls in the Merced once the sun is on the upper fall and not yet on the water.' },
      { id: 'cathedral-beach-quiet-picnic', when: 'Lunch', note: 'The picnic tables in the trees and a sandy beach facing El Capitan.' },
      { id: 'ahwahnee-history-tour', when: 'Afternoon', note: 'The hotel\'s free history tour, an hour on the building and who stayed in it.' },
      { id: 'el-cap-meadow-after-dark', when: 'After dark', note: 'Lamp off in the meadow, and the headlamps of climbers a thousand feet up.' },
    ],
  },
  {
    id: 'tioga-into-the-night',
    label: 'An afternoon',
    title: 'Tioga Road, into the night',
    dek: 'West to east across the high country as the day empties out, then back to the best drive-to dark sky in the park.',
    season: 'Tioga Road season only, roughly June to October. Pick a new-moon week for the last stop.',
    stops: [
      { id: 'siesta-lake', when: 'Afternoon', note: 'The unsigned pond the road bends around, a shoulder pullout and fifteen minutes.' },
      { id: 'tenaya-lake-lots', when: 'Late afternoon', note: 'Park at the Sunrise trailhead lot at the west end, usually the last of the three to fill.' },
      { id: 'pothole-dome-sunset', when: 'Last hour of light', note: 'Ten or fifteen minutes up the granite to the whole Tuolumne basin turning gold.' },
      { id: 'olmsted-point-at-night', when: 'After dark', note: 'Flat slabs thirty feet from the car at 8,300 feet, and the Milky Way.' },
    ],
  },
  {
    id: 'sequoias-to-stars',
    label: 'A long day',
    title: 'Sequoias to stars',
    dek: 'The top of the Mariposa Grove in the morning, a meadow walk up Glacier Point Road in the afternoon, and Glacier Point after dark.',
    season: 'Summer, when the grove shuttle and Glacier Point Road both run. Saturdays for the telescopes.',
    stops: [
      { id: 'wawona-point', when: 'Morning', note: 'Past the Grizzly Giant to the stone overlook at 6,810 feet, the last mile usually empty.' },
      { id: 'mcgurk-meadow', when: 'Afternoon', note: 'An easy 1.6 miles round trip to a wildflower meadow and an 1890s sheepherder\'s cabin.' },
      { id: 'washburn-point', when: 'Before sunset', note: 'The better Half Dome, full profile, with Vernal and Nevada Falls stacked below it.' },
      { id: 'glacier-point-star-party', when: 'After dark', note: 'The astronomy clubs\' free telescopes, and the moon rising behind Half Dome.' },
    ],
  },
  {
    id: 'owl-hour',
    label: 'An evening',
    title: 'The owl hour on the Big Oak Flat side',
    dek: 'A walk through Foresta, the old wagon road down to the Tuolumne Grove, and the meadow where the great gray owls hunt at dusk.',
    season: 'Late spring to early fall, while Tioga Road is open to the Tuolumne Grove lot.',
    stops: [
      { id: 'foresta-barns-loop', when: 'Afternoon', note: 'The neighborhood loop past the old barns and bridge, with El Capitan and Half Dome from new angles.' },
      { id: 'tuolumne-grove-old-road', when: 'Late afternoon', note: 'A mile down the 1874 wagon road to the sequoias and the walk-through Dead Giant.' },
      { id: 'great-gray-owl-dusk', when: 'The hour before sunset', note: 'Stand still at the Crane Flat meadow edge and scan the low snags.' },
    ],
  },
]
