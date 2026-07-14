// =============================================================================
// MAP AMENITIES — parking lots and campgrounds.
//
// These are map-only pins: they render on /map with a note and a Directions
// deeplink, and that is all. They are deliberately NOT Stops. No /stop pages,
// no region lists, no search results, no itinerary presets. The `region`
// field exists only so the itineraries tab can narrow the pins to the trip's
// regions.
//
// Coords: web-verified July 2026 against NPS pages, recreation.gov-derived
//   campground directories, and OSM/Wikipedia-derived sources; each coord
//   line carries its source, matching the stops.ts convention. Lines marked
//   `// TODO: verify on the ground` had conflicting or thin sources and must
//   be checked at the actual spot before relying on them for navigation.
//   Several parking pins reuse coords already verified for stops.ts or the
//   editorial points.geojson; those lines say so.
// Seasons: campground operating windows shift year to year; `season` strings
//   state the pattern, not published dates. Check recreation.gov before
//   promising anyone a site.
// =============================================================================

import { z } from 'zod'
import { Amenities, type AmenityT } from './schema'

type AmenityInput = z.input<typeof Amenities>[number]

const seed: AmenityInput[] = [
  // ===========================================================================
  // YOSEMITE VALLEY
  // ===========================================================================
  {
    id: 'upper-pines-campground',
    name: 'Upper Pines Campground',
    kind: 'camping',
    region: 'valley',
    coord: [-119.5635, 37.736], // verified 2026-07: Upper Pines loops east of Curry Village (parkrangerjohn/distancesto; sources spread ~90 m, lot-scale)
    note: 'The biggest Valley campground and the only one open all year. Reservations only, and they vanish minutes after release.',
  },
  {
    id: 'lower-pines-campground',
    name: 'Lower Pines Campground',
    kind: 'camping',
    region: 'valley',
    coord: [-119.566314, 37.739466], // verified 2026-07: Lower Pines entrance/loops (AAA/NPS + Campendium agree within 60 m); nudged ~150 m south off the prior pin toward North Pines
    note: 'Across Stoneman Meadow from Curry Village, on the Merced. Reservations only.',
    season: 'Roughly April through October',
  },
  {
    id: 'north-pines-campground',
    name: 'North Pines Campground',
    kind: 'camping',
    region: 'valley',
    coord: [-119.56556, 37.74194], // verified 2026-07: North Pines loops north of the Merced across Clark's Bridge (recreation.gov/RIDB mirror); prior pin sat ~260 m SW at Lower Pines' NE edge
    note: 'The quietest of the three Pines campgrounds, at the Tenaya Creek confluence next to the stables. Reservations only.',
    season: 'Roughly April through October',
  },
  {
    id: 'camp-4',
    name: 'Camp 4',
    kind: 'camping',
    region: 'valley',
    coord: [-119.6021, 37.7421], // verified 2026-07: Camp 4 walk-in lot, Northside Dr below the Yosemite Falls wall (NPS/Hikespeak)
    note: "The historic climbers' campground, walk-in tent sites below the Yosemite Falls wall. Sites go by same-week lottery on recreation.gov in peak season.",
  },
  {
    id: 'yosemite-village-day-use-lot',
    name: 'Yosemite Village day-use parking',
    kind: 'parking',
    region: 'valley',
    coord: [-119.5818, 37.7458], // TODO: verify on the ground — derived ±150 m from the NPS Village parking map (roundabout off Northside Dr, shuttle stop 1); no published coord (2026-07 web pass)
    note: 'The main Valley day-use lot, off the roundabout by the Village Store at shuttle stop 1. Full by mid-morning in season; arrive early or commit to circling.',
  },
  {
    id: 'curry-village-day-use-lot',
    name: 'Curry Village day-use parking',
    kind: 'parking',
    region: 'valley',
    coord: [-119.566577, 37.735344], // verified 2026-07: same lot as the editorial points.geojson curry-village-trailhead-parking pin
    note: 'The day-use lot at Curry Village. Closest parking for the Mist Trail and the Happy Isles trailhead.',
  },
  {
    id: 'yosemite-falls-lot',
    name: 'Yosemite Falls day-use parking',
    kind: 'parking',
    region: 'valley',
    coord: [-119.6012117, 37.741385], // verified 2026-07: same lot as the editorial points.geojson yosemite-lodge pin
    note: 'The lot by Yosemite Valley Lodge, a short walk from the Lower Yosemite Fall trail. Tends to fill after the Village lot, not before.',
  },

  // ===========================================================================
  // GLACIER POINT & MARIPOSA GROVE
  // ===========================================================================
  {
    id: 'bridalveil-creek-campground',
    name: 'Bridalveil Creek Campground',
    kind: 'camping',
    region: 'glacier-mariposa',
    coord: [-119.62, 37.658], // verified 2026-07: campground proper, south of Glacier Point Rd down the access road (latitude.to; ~220 m south of the stops.ts access-road pin)
    note: 'The only campground on Glacier Point Road, at 7,200 feet halfway to the point. Cold nights even in July.',
    season: 'Summer only, roughly July through early September',
  },
  {
    id: 'wawona-campground',
    name: 'Wawona Campground',
    kind: 'camping',
    region: 'glacier-mariposa',
    coord: [-119.6729, 37.5447], // verified 2026-07: campground loops along the South Fork Merced, Hwy 41 NW of Wawona (recreation.gov via campgroundviews)
    note: 'On the South Fork of the Merced a mile north of Wawona, the closest campground to the Mariposa Grove. One loop stays open through winter.',
  },
  {
    id: 'glacier-point-lot',
    name: 'Glacier Point parking',
    kind: 'parking',
    region: 'glacier-mariposa',
    coord: [-119.5731, 37.7283], // verified 2026-07: Glacier Point main lot (same pin as the glacier-point stop; Hikespeak/LOC HAER)
    note: 'The main lot at the end of Glacier Point Road. Fills by mid-morning in summer; sunset crowds arrive an hour early for a space.',
    season: 'Road closed in winter',
  },
  {
    id: 'mariposa-grove-welcome-plaza',
    name: 'Mariposa Grove Welcome Plaza parking',
    kind: 'parking',
    region: 'glacier-mariposa',
    coord: [-119.632, 37.5085], // TODO: verify on the ground — Welcome Plaza lot at the South Entrance, derived ±150 m (same pin as the mariposa-grove stop; 2026-07 web pass)
    note: 'Cars park here, at the Welcome Plaza by the South Entrance, and the shuttle runs into the grove. The grove road itself has been closed to private cars since 2018.',
  },

  // ===========================================================================
  // TUOLUMNE & THE HWY 120 CORRIDOR
  // ===========================================================================
  {
    id: 'crane-flat-campground',
    name: 'Crane Flat Campground',
    kind: 'camping',
    region: 'tuolumne',
    coord: [-119.7993, 37.7476], // TODO: verify on the ground — The Dyrt pin in the loops off Big Oak Flat Rd south of the Crane Flat wye; other published coords conflict by km scale (2026-07 web pass)
    note: 'In the forest at the Crane Flat junction, where Tioga Road leaves Big Oak Flat Road. Handy to both the Valley and the high country, close to the Tuolumne and Merced sequoia groves.',
    season: 'Summer only, roughly July through September',
  },
  {
    id: 'tamarack-flat-campground',
    name: 'Tamarack Flat Campground',
    kind: 'camping',
    region: 'tuolumne',
    coord: [-119.7366, 37.7521], // verified 2026-07: campground at the road-end of the Tamarack Flat spur off Tioga Rd (same pin as the tamarack-to-cascade stop; latitude.to/CampingRoadTrip)
    note: 'Primitive sites at the end of a rough 3-mile spur off Tioga Road. No water, no reservations for most of its history; check current rules before counting on it.',
    season: 'Seasonal; closed in winter',
  },
  {
    id: 'white-wolf-campground',
    name: 'White Wolf Campground',
    kind: 'camping',
    region: 'tuolumne',
    coord: [-119.6471, 37.8707], // TODO: verify on the ground — Wikipedia pin at the White Wolf road-end; latitude.to differs ~500 m (2026-07 web pass)
    note: 'At 8,000 feet up a short spur off Tioga Road, next to the old White Wolf Lodge. Cold, quiet, and well placed for Lukens Lake and Harden Lake.',
    season: 'Seasonal; closed in winter',
  },
  {
    id: 'yosemite-creek-campground',
    name: 'Yosemite Creek Campground',
    kind: 'camping',
    region: 'tuolumne',
    coord: [-119.5958, 37.8267], // verified 2026-07: campground on Yosemite Creek ~5 mi down the old Tioga Rd from the highway (campgroundviews; single source, matches access-road geometry)
    note: 'Primitive creekside sites five slow miles down a rough single-lane road off Tioga Road. The access road is the filter; the campground is the reward.',
    season: 'Seasonal; roughly July through early September',
  },
  {
    id: 'porcupine-flat-campground',
    name: 'Porcupine Flat Campground',
    kind: 'camping',
    region: 'tuolumne',
    coord: [-119.5651, 37.8075], // verified 2026-07: campground on Tioga Rd at 8,100 ft (latitude.to/CampingRoadTrip)
    note: 'Right on Tioga Road at 8,100 feet, primitive and first-come for much of its history. A practical base for Olmsted Point and May Lake.',
    season: 'Seasonal; closed in winter',
  },
  {
    id: 'tuolumne-meadows-campground',
    name: 'Tuolumne Meadows Campground',
    kind: 'camping',
    region: 'tuolumne',
    coord: [-119.36, 37.8711], // verified 2026-07: campground loops south of Tioga Rd behind the Tuolumne Meadows store (parkrangerjohn, lot-scale)
    note: 'The big high-country campground behind the Tuolumne Meadows store, on the river at 8,600 feet. Reopened after a multi-year rebuild; reservations only.',
    season: 'Tioga Road season only',
  },
  {
    id: 'tuolumne-meadows-lots',
    name: 'Tuolumne Meadows parking',
    kind: 'parking',
    region: 'tuolumne',
    coord: [-119.3586, 37.8732], // verified 2026-07: Tuolumne Meadows Visitor Center lot (same pin as the cathedral-lakes stop; NPS TH page)
    note: 'The visitor center lot, the most reliable parking in the meadows since the trailhead reshuffle. Roadside pullouts along Tioga Road fill first.',
    season: 'Tioga Road season only',
  },

  // ===========================================================================
  // HETCH HETCHY & EVERGREEN ROAD
  // ===========================================================================
  {
    id: 'hodgdon-meadow-campground',
    name: 'Hodgdon Meadow Campground',
    kind: 'camping',
    region: 'hetch-hetchy',
    coord: [-119.8658, 37.7989], // verified 2026-07: campground just inside the Big Oak Flat entrance (CampingRoadTrip/NPS-derived; two sources within ~120 m)
    note: 'Just inside the Big Oak Flat entrance at 4,900 feet, open all year. The closest campground to Hetch Hetchy and a practical first-night stop off Highway 120.',
  },
  {
    id: 'hetch-hetchy-dam-lot',
    name: "O'Shaughnessy Dam parking",
    kind: 'parking',
    region: 'hetch-hetchy',
    coord: [-119.7886, 37.9464], // verified 2026-07: dam road-end lot (same pin as the oshaughnessy-dam stop; Wikipedia dam-crest + NPS trailhead points)
    note: 'The small lot at the end of Hetch Hetchy Road, at the dam. The road is gated roughly sunrise to sunset, so plan the drive out before the light goes.',
  },
]

export const AMENITIES: AmenityT[] = Amenities.parse(seed)
