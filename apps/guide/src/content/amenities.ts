// =============================================================================
// MAP AMENITIES — the park's infrastructure layer.
//
// These are map-only pins: they render on /map with a note and a Directions
// deeplink, and that is all. They are deliberately NOT Stops. No /stop pages,
// no region lists, no search results, no itinerary presets. The `region`
// field exists only so the itineraries tab can narrow the pins to the trip's
// regions.
//
// Two layers live here. The July 2026 set is parking lots and campgrounds.
// The September 2026 map pass added what a visitor expects any park map to
// carry and this one did not: the five entrance stations, the visitor and
// wilderness centers with their hours, the Valley shuttle stops numbered as
// NPS numbers them, the signed picnic areas, gas / EV / showers / laundry /
// stores, the lodges the guide has no stop for, and the named landmarks a
// reader points at and asks about (Cathedral Rocks, Royal Arches). Every
// coordinate in that layer is quoted verbatim from the NPS API
// (developer.nps.gov, `places` / `visitorcenters` / `parkinglots`,
// parkCode=yose, pulled 2026-09-05) unless its line says otherwise; the
// landmark summits come from Wikipedia, and a landmark pin marks a thing you
// look at, so a hundred metres either way changes nothing. Hours are as NPS
// publishes them and belong to the same re-check as dining hours on every
// Guide edition turn. Shuttle facts: nps.gov/yose/planyourvisit/
// publictransportation.htm and the per-stop NPS place pages.
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
    coord: [-119.374706, 37.872634], // verified 2026-07: Tuolumne Meadows Visitor Center lot (same pin as the cathedral-lakes stop; NPS Cathedral Lakes TH data, VC per Wikidata); prior pin sat ~1.4 km east at the store/campground
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

  // ===========================================================================
  // THE INFRASTRUCTURE LAYER (September 2026). Coords verbatim from the NPS
  // API unless the line says otherwise; see the header.
  // ===========================================================================

  // --- Entrance stations ------------------------------------------------------
  {
    id: 'arch-rock-entrance',
    name: 'Arch Rock Entrance',
    kind: 'entrance',
    region: 'valley',
    coord: [-119.730975, 37.686075], // NPS API places: Arch Rock Entrance
    note: 'The Highway 140 gate from El Portal and Mariposa, 11 miles and about 20 minutes below the Valley. Named for the boulders the road squeezes between. Entrance fees are card only; no cash at any gate.',
    hours: 'Open 24 hours',
  },
  {
    id: 'big-oak-flat-entrance',
    name: 'Big Oak Flat Entrance',
    kind: 'entrance',
    region: 'hetch-hetchy',
    coord: [-119.874546, 37.800857], // NPS API places: Big Oak Flat Entrance
    note: 'The Highway 120 west gate from Groveland, 25 miles and about 45 minutes from the Valley. The information station and wilderness permit desk sit just inside; Hodgdon Meadow Campground is the first turn.',
    hours: 'Open 24 hours',
  },
  {
    id: 'south-entrance',
    name: 'South Entrance',
    kind: 'entrance',
    region: 'glacier-mariposa',
    coord: [-119.631329, 37.506244], // NPS API places: South Entrance
    note: 'The Highway 41 gate from Oakhurst and Fish Camp, 35 miles and about an hour from the Valley. The Mariposa Grove Welcome Plaza is the next turn after the gate.',
    hours: 'Open 24 hours',
  },
  {
    id: 'tioga-pass-entrance',
    name: 'Tioga Pass Entrance',
    kind: 'entrance',
    region: 'tuolumne',
    coord: [-119.257969, 37.910741], // NPS API places: Tioga Pass Entrance
    note: 'The east gate at 9,945 feet, the highest highway pass in California, from Lee Vining and US 395. Open only while Tioga Road is open, usually late May or June into November.',
    season: 'Tioga Road season only',
  },
  {
    id: 'hetch-hetchy-entrance',
    name: 'Hetch Hetchy Entrance',
    kind: 'entrance',
    region: 'hetch-hetchy',
    coord: [-119.841696, 37.893591], // NPS API places: Hetch Hetchy Entrance
    note: 'The gate at Camp Mather on Hetch Hetchy Road, 38 miles and about an hour and a quarter from the Valley. Vehicles over 25 feet long or 8 feet wide are not permitted on the road beyond.',
    hours: 'Sunrise to sunset; the road closes overnight',
  },

  // --- Visitor and wilderness centers -----------------------------------------
  {
    id: 'valley-welcome-center',
    name: 'Yosemite Valley Welcome Center',
    kind: 'visitor-center',
    region: 'valley',
    coord: [-119.58445, 37.746508], // NPS API visitorcenters: Yosemite Valley Welcome Center
    note: 'The first-stop desk in Yosemite Village, next to the Village day-use lot at shuttle stops 1 and 2. Maps, the Yosemite Guide, and a ranger to ask.',
    hours: '9 a.m. to 5 p.m. daily, year-round',
  },
  {
    id: 'yosemite-exploration-center',
    name: 'Yosemite Exploration Center',
    kind: 'visitor-center',
    region: 'valley',
    coord: [-119.587148, 37.748784], // NPS API places: Yosemite Exploration Center
    note: 'The former Valley Visitor Center, rebuilt as the exhibit hall, with the theater behind it and the Yosemite Museum and the Wilderness Center next door. Shuttle stop 5.',
  },
  {
    id: 'valley-wilderness-center',
    name: 'Yosemite Valley Wilderness Center',
    kind: 'visitor-center',
    region: 'valley',
    coord: [-119.58662, 37.748305], // NPS API places: Yosemite Valley Wilderness Center
    note: 'Wilderness permits, bear canister rentals, and the trail-conditions board, between the Exploration Center and the post office.',
    hours: '8 a.m. to 5 p.m.',
  },
  {
    id: 'happy-isles-art-nature-center',
    name: 'Happy Isles Art and Nature Center',
    kind: 'visitor-center',
    region: 'valley',
    coord: [-119.559463, 37.730692], // NPS API places: Happy Isles Art and Nature Center
    note: 'The family stop at shuttle stop 16, a hundred metres from the Mist Trail trailhead: hands-on exhibits, the junior ranger desk, and art classes in season.',
    season: 'Spring through fall',
  },
  {
    id: 'wawona-visitor-center',
    name: "Wawona Visitor Center at Hill's Studio",
    kind: 'visitor-center',
    region: 'glacier-mariposa',
    coord: [-119.655392, 37.537154], // NPS API visitorcenters: Wawona Visitor Center at Hill's Studio
    note: "Thomas Hill's 1886 painting studio beside the Wawona Hotel, now the south end's information desk and wilderness permit station.",
    hours: '8 a.m. to 5 p.m., late May to early October',
  },
  {
    id: 'big-oak-flat-information-station',
    name: 'Big Oak Flat Information Station',
    kind: 'visitor-center',
    region: 'hetch-hetchy',
    coord: [-119.875434, 37.80034], // NPS API visitorcenters: Big Oak Flat Information Station
    note: 'Just inside the Big Oak Flat Entrance: information, the Highway 120 wilderness permit desk, and a YARTS stop.',
    hours: '8 a.m. to 5 p.m., late May to early October',
  },
  {
    id: 'tuolumne-meadows-visitor-center',
    name: 'Tuolumne Meadows Visitor Center',
    kind: 'visitor-center',
    region: 'tuolumne',
    coord: [-119.374178, 37.871567], // NPS API visitorcenters: Tuolumne Meadows Visitor Center
    note: 'The high country desk on Tioga Road at the west end of the meadow, with exhibits on the alpine year. Wilderness permits are at the separate Wilderness Center a mile east.',
    hours: '9 a.m. to 5 p.m., late May to late September',
    season: 'Tioga Road season only',
  },
  {
    id: 'tuolumne-meadows-wilderness-center',
    name: 'Tuolumne Meadows Wilderness Center',
    kind: 'visitor-center',
    region: 'tuolumne',
    coord: [-119.345733, 37.876912], // NPS API places: Tuolumne Meadows Wilderness Center
    note: 'Wilderness permits and bear canisters for the Tuolumne trailheads, on the Tuolumne Meadows Lodge road off Tioga Road.',
    hours: '8 a.m. to 5 p.m.',
    season: 'Tioga Road season only',
  },

  // --- Yosemite Valley shuttle stops -------------------------------------------
  // Numbered as NPS numbers them; there is no stop 13. Two routes: Valleywide
  // (every stop) and East Valley (stops 1, 2, 12, 14 to 19). Both run 7 a.m.
  // to 10 p.m. daily, free, no ticket. The route names below are the per-stop
  // NPS place pages' own.
  {
    id: 'shuttle-stop-1',
    name: 'Shuttle stop 1, Yosemite Village parking',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.583663, 37.744429], // NPS API places: Valley Shuttle Stop 1
    glyph: '1',
    note: 'Valleywide and East Valley routes. The stop for the main day-use lot: park once here and ride.',
  },
  {
    id: 'shuttle-stop-2',
    name: 'Shuttle stop 2, Welcome Center',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.585226, 37.747158], // NPS API places: Valley Shuttle Stop 2
    glyph: '2',
    note: 'Valleywide and East Valley routes. Yosemite Village: the Welcome Center, the Village Store, and the post office.',
  },
  {
    id: 'shuttle-stop-3',
    name: 'Shuttle stop 3, The Ahwahnee',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.574696, 37.746999], // NPS API places: Valley Shuttle Stop 3
    glyph: '3',
    note: 'Valleywide route. The hotel, its bar and dining room, and the start of the Ahwahnee Meadow walk.',
  },
  {
    id: 'shuttle-stop-4',
    name: "Shuttle stop 4, Degnan's Kitchen",
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.585554, 37.747658], // NPS API places: Valley Shuttle Stop 4
    glyph: '4',
    note: "Valleywide route. Degnan's Kitchen and the Loft, the Village's counter food.",
  },
  {
    id: 'shuttle-stop-5',
    name: 'Shuttle stop 5, Exploration Center',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.587626, 37.747775], // NPS API places: Valley Shuttle Stop 5
    glyph: '5',
    note: 'Valleywide route. The Exploration Center, the Museum, the Wilderness Center, and the Ansel Adams Gallery.',
  },
  {
    id: 'shuttle-stop-6',
    name: 'Shuttle stop 6, Lower Yosemite Fall',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.593413, 37.745708], // NPS API places: Valley Shuttle Stop 6
    glyph: '6',
    note: 'Valleywide route. The Lower Yosemite Fall trailhead and picnic area.',
  },
  {
    id: 'shuttle-stop-7',
    name: 'Shuttle stop 7, Yosemite Valley Lodge',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.600732, 37.74158], // NPS API places: Valley Shuttle Stop 7
    glyph: '7',
    note: 'Valleywide route. The Lodge, the Yosemite Falls day-use lot, and the YARTS bus stop.',
  },
  {
    id: 'shuttle-stop-8',
    name: 'Shuttle stop 8, El Capitan Picnic Area',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.620789, 37.728243], // NPS API places: Valley Shuttle Stop 8
    glyph: '8',
    note: 'Valleywide route. The picnic area under El Capitan, the closest stop to the climber-watching ground.',
  },
  {
    id: 'shuttle-stop-9',
    name: 'Shuttle stop 9, El Capitan Meadow',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.630986, 37.723827], // NPS API places: Valley Shuttle Stop 9
    glyph: '9',
    note: 'Valleywide route. El Capitan Meadow and the west end of the Valley loop.',
  },
  {
    id: 'shuttle-stop-10',
    name: 'Shuttle stop 10, Cathedral Beach',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.624373, 37.721572], // NPS API places: Valley Shuttle Stop 10
    glyph: '10',
    note: 'Valleywide route. Cathedral Beach picnic area on the Merced, across from El Capitan.',
  },
  {
    id: 'shuttle-stop-11',
    name: 'Shuttle stop 11, Four Mile Trailhead',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.601805, 37.733927], // NPS API places: Valley Shuttle Stop 11
    glyph: '11',
    note: 'Valleywide route. The Four Mile Trail to Glacier Point, Swinging Bridge, and Sentinel Beach.',
  },
  {
    id: 'shuttle-stop-12',
    name: 'Shuttle stop 12, Housekeeping Camp',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.578807, 37.739812], // NPS API places: Valley Shuttle Stop 12
    glyph: '12',
    note: 'Valleywide and East Valley routes. Housekeeping Camp, its laundry, and the Conservation Heritage Center.',
  },
  {
    id: 'shuttle-stop-14',
    name: 'Shuttle stop 14, Curry Village eastbound',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.570411, 37.738246], // NPS API places: Valley Shuttle Stop 14
    glyph: '14',
    note: 'Valleywide and East Valley routes, toward the campgrounds and Happy Isles. Curry Village, its food, showers, and the YARTS stop.',
  },
  {
    id: 'shuttle-stop-15',
    name: 'Shuttle stop 15, Upper Pines Campground',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.566805, 37.737531], // NPS API places: Valley Shuttle Stop 15
    glyph: '15',
    note: 'Valleywide and East Valley routes. Upper Pines and the wilderness trailhead parking.',
  },
  {
    id: 'shuttle-stop-16',
    name: 'Shuttle stop 16, Happy Isles',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.559797, 37.732421], // NPS API places: Valley Shuttle Stop 16
    glyph: '16',
    note: 'Valleywide and East Valley routes. The Mist Trail and John Muir Trail trailhead, and the Art and Nature Center. The road past here is closed to private cars.',
  },
  {
    id: 'shuttle-stop-17',
    name: 'Shuttle stop 17, Mirror Lake Trailhead',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.559708, 37.739349], // NPS API places: Valley Shuttle Stop 17
    glyph: '17',
    note: 'Valleywide and East Valley routes. The paved mile to Mirror Lake starts here.',
  },
  {
    id: 'shuttle-stop-18',
    name: 'Shuttle stop 18, Lower Pines Campground',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.565928, 37.739204], // NPS API places: Valley Shuttle Stop 18
    glyph: '18',
    note: 'Valleywide and East Valley routes. Lower and North Pines campgrounds and the stables.',
  },
  {
    id: 'shuttle-stop-19',
    name: 'Shuttle stop 19, Curry Village westbound',
    kind: 'shuttle',
    region: 'valley',
    coord: [-119.570599, 37.738298], // NPS API places: Valley Shuttle Stop 19
    glyph: '19',
    note: 'Valleywide and East Valley routes, toward the Village and the Lodge.',
  },
  {
    id: 'mariposa-grove-shuttle-arrival',
    name: 'Mariposa Grove shuttle, Arrival Area',
    kind: 'shuttle',
    region: 'glacier-mariposa',
    coord: [-119.611058, 37.50156], // NPS API places: Mariposa Grove Shuttle Stop 1
    glyph: 'G',
    note: 'Where the free grove shuttle from the Welcome Plaza drops you, at the Big Trees Loop trailhead. When the shuttle is not running the Washburn Trail walks the two miles up from the plaza.',
    season: 'Roughly mid-April through November',
  },

  // --- Picnic areas ------------------------------------------------------------
  // The signed picnic areas on nps.gov/yose/planyourvisit/picnic.htm. All have
  // tables and vault toilets; the notes carry the two exceptions NPS lists
  // (no grills, and the only two with drinking water).
  {
    id: 'church-bowl-picnic',
    name: 'Church Bowl Picnic Area',
    kind: 'picnic',
    region: 'valley',
    coord: [-119.580973, 37.748559], // NPS API places: Church Bowl Picnic Area
    note: 'Tables under the oaks at the edge of Ahwahnee Meadow, looking at Half Dome and Glacier Point. One of the two Valley picnic areas with drinking water.',
  },
  {
    id: 'lower-yosemite-fall-picnic',
    name: 'Lower Yosemite Fall Picnic Area',
    kind: 'picnic',
    region: 'valley',
    coord: [-119.596023, 37.745845], // NPS API places: Lower Yosemite Fall Picnic Area
    note: 'Beside the Lower Yosemite Fall trailhead at shuttle stop 6. Drinking water, tables, no grills.',
  },
  {
    id: 'swinging-bridge-picnic',
    name: 'Swinging Bridge Picnic Area',
    kind: 'picnic',
    region: 'valley',
    coord: [-119.599215, 37.736346], // NPS API places: Swinging Bridge
    note: 'On the Merced below Yosemite Falls, the classic reflection of the fall in the river. Tables, grills, and the footbridge across to the Lodge side.',
  },
  {
    id: 'el-capitan-picnic',
    name: 'El Capitan Picnic Area',
    kind: 'picnic',
    region: 'valley',
    coord: [-119.620634, 37.72821], // NPS API places: El Capitan Picnic Area
    note: 'Under the wall on Northside Drive at shuttle stop 8, the spot most people actually watch climbers from. Tables and grills.',
  },
  {
    id: 'cathedral-beach-picnic',
    name: 'Cathedral Beach Picnic Area',
    kind: 'picnic',
    region: 'valley',
    coord: [-119.625122, 37.722869], // NPS API places: Cathedral Beach Picnic Area
    note: 'On the south bank of the Merced at shuttle stop 10, facing El Capitan across the river. Tables and grills; the sandbar is the swimming spot.',
  },
  {
    id: 'cascades-picnic',
    name: 'The Cascades Picnic Area',
    kind: 'picnic',
    region: 'valley',
    coord: [-119.713416, 37.722928], // NPS API places: The Cascades Picnic Area
    note: 'On Highway 140 below the Valley, at the foot of the Cascades, which run loud in spring and dry to a trickle by August. Tables and grills.',
  },
  {
    id: 'mariposa-grove-picnic',
    name: 'Mariposa Grove Picnic Area',
    kind: 'picnic',
    region: 'glacier-mariposa',
    coord: [-119.621418, 37.501336], // NPS API places: Mariposa Grove Picnic Area
    note: 'On Mariposa Grove Road between the Welcome Plaza and the grove. Tables and grills.',
  },
  {
    id: 'wawona-picnic',
    name: 'Wawona Picnic Area',
    kind: 'picnic',
    region: 'glacier-mariposa',
    coord: [-119.6703, 37.542894], // NPS API places: Wawona Picnic Area
    note: 'On the South Fork of the Merced by Wawona Campground. Tables and grills.',
  },
  {
    id: 'yosemite-creek-picnic',
    name: 'Yosemite Creek Picnic Area',
    kind: 'picnic',
    region: 'tuolumne',
    coord: [-119.573267, 37.850411], // NPS API places: Yosemite Creek Picnic Area
    note: 'Where Tioga Road crosses Yosemite Creek, the water that goes over the falls a few miles south. Tables, no grills.',
    season: 'Tioga Road season only',
  },
  {
    id: 'tenaya-lake-picnic',
    name: 'Tenaya Lake Picnic Area',
    kind: 'picnic',
    region: 'tuolumne',
    coord: [-119.451882, 37.837954], // NPS API places: Tenaya Lake Picnic Area
    note: 'At the east end of the lake, by the beach. Tables and grills.',
    season: 'Tioga Road season only',
  },
  {
    id: 'murphy-creek-picnic',
    name: 'Murphy Creek Picnic Area',
    kind: 'picnic',
    region: 'tuolumne',
    coord: [-119.464438, 37.832927], // NPS API places: Murphy Creek Picnic Area
    note: 'The quieter tables at the west end of Tenaya Lake, at the Murphy Creek trailhead.',
    season: 'Tioga Road season only',
  },

  // --- Services: gas, EV, showers, laundry, stores, post, clinic ----------------
  {
    id: 'crane-flat-gas',
    name: 'Crane Flat gas station',
    kind: 'services',
    region: 'tuolumne',
    coord: [-119.796779, 37.752998], // NPS API places: Crane Flat Gas Station
    note: 'Unleaded and diesel at the Tioga Road junction, pumps 24 hours by card. There is no gas in the Valley and none in Tuolumne Meadows any more, so this is the last fill before the high country.',
  },
  {
    id: 'wawona-gas',
    name: 'Wawona gas station',
    kind: 'services',
    region: 'glacier-mariposa',
    coord: [-119.65745, 37.537189], // NPS API places: Wawona Gas Station
    note: 'Gas, diesel, and propane by the Wawona Store, pumps 24 hours by card and staffed 8 to 5. The EV charger is in the store lot.',
  },
  {
    id: 'el-portal-gas',
    name: 'El Portal gas station and market',
    kind: 'services',
    region: 'valley',
    coord: [-119.781681, 37.67481], // NPS API places: El Portal Gas Station and Market
    note: 'The closest fuel to the Valley, outside the Arch Rock Entrance on Highway 140: gas, diesel, propane, a market, and a two-plug EV charger.',
  },
  {
    id: 'curry-village-services',
    name: 'Curry Village showers, lockers and EV charging',
    kind: 'services',
    region: 'valley',
    coord: [-119.572737, 37.73871], // NPS API places: Curry Village EV Charging Station
    note: 'Public showers 24 hours a day for a small fee, open to non-guests, and twenty Level 2 EV plugs in the lot west of the village. Bear lockers at the trailhead lot.',
  },
  {
    id: 'housekeeping-camp-laundry',
    name: 'Housekeeping Camp laundry',
    kind: 'services',
    region: 'valley',
    coord: [-119.57948, 37.740794], // NPS API places: Housekeeping Camp
    note: 'The only public laundromat in the Valley, open to everyone; the shower house is for guests. Shuttle stop 12.',
    season: 'Roughly mid-April to early October',
  },
  {
    id: 'village-store',
    name: 'Village Store and post office',
    kind: 'services',
    region: 'valley',
    coord: [-119.584472, 37.746905], // NPS API places: Village Store
    note: 'Groceries, camping supplies, ice, and an ATM in Yosemite Village, with the post office a short walk west. The largest store in the park.',
  },
  {
    id: 'yosemite-medical-clinic',
    name: 'Yosemite Medical Clinic',
    kind: 'services',
    region: 'valley',
    coord: [-119.5828, 37.748592], // NPS API places: Yosemite Medical Clinic
    note: 'Urgent care in Yosemite Village, behind the Village Store. Not an emergency room: for an emergency call 911.',
  },
  {
    id: 'valley-lodge-ev',
    name: 'Yosemite Valley Lodge EV charging',
    kind: 'services',
    region: 'valley',
    coord: [-119.597894, 37.742935], // NPS API places: Yosemite Valley Lodge EV Charging Station
    note: 'Level 2 chargers at the Lodge, with ten more at the Yosemite Falls day-use lot next door and four at the Welcome Center lot.',
  },
  {
    id: 'tuolumne-meadows-store',
    name: 'Tuolumne Meadows Store and post office',
    kind: 'services',
    region: 'tuolumne',
    coord: [-119.356908, 37.874375], // NPS API places: Tuolumne Meadows Store
    note: 'Groceries, camping supplies, and the post office, with the grill next door. No gas here any more.',
    season: 'Tioga Road season only',
  },
  {
    id: 'badger-pass',
    name: 'Badger Pass ski area',
    kind: 'services',
    region: 'glacier-mariposa',
    coord: [-119.664341, 37.662435], // NPS API places: Badger Pass Ski Area
    note: 'The winter end of Glacier Point Road, open since 1935: downhill and cross-country rentals, a snack bar, and the trailhead for the ski to Dewey Point and the Ostrander hut.',
    season: 'Winter; the road beyond closes here November to May',
  },

  // --- Lodging the guide has no stop for -----------------------------------------
  {
    id: 'yosemite-valley-lodge',
    name: 'Yosemite Valley Lodge',
    kind: 'lodging',
    region: 'valley',
    coord: [-119.598294, 37.74349], // NPS API places: Yosemite Valley Lodge
    note: 'The largest lodging in the Valley, a short walk from Lower Yosemite Fall, with the Mountain Room, Base Camp Eatery, and a Starbucks. Shuttle stop 7 and the YARTS stop are at the door.',
  },
  {
    id: 'housekeeping-camp',
    name: 'Housekeeping Camp',
    kind: 'lodging',
    region: 'valley',
    coord: [-119.57948, 37.740794], // NPS API places: Housekeeping Camp (same pin as the laundry above)
    note: 'Camping on the Merced without pitching a tent: fixed units with a store and the public laundry on site. Shuttle stop 12.',
    season: 'Roughly mid-April to early October',
  },
  {
    id: 'tuolumne-meadows-lodge',
    name: 'Tuolumne Meadows Lodge',
    kind: 'lodging',
    region: 'tuolumne',
    coord: [-119.332947, 37.877319], // NPS API places: Tuolumne Meadows Lodge
    note: 'Canvas tent cabins by the Tuolumne River at the end of the lodge road, the only lodging in the high country. Dinner and breakfast are served in the dining tent.',
    season: 'Tioga Road season only',
  },

  // --- Landmarks: what am I looking at -------------------------------------------
  // A landmark pin marks a feature you look at, not a place you drive to, so
  // the popup has no Directions button. Summits are from Wikipedia unless the
  // line says otherwise.
  {
    id: 'half-dome',
    name: 'Half Dome',
    kind: 'landmark',
    region: 'valley',
    coord: [-119.53294, 37.746036], // Wikipedia: Half Dome
    note: 'The 8,839-foot granite dome at the head of the Valley, the face sheared by ice and the back climbed by the cables. The hike needs a permit (see Day hikes).',
  },
  {
    id: 'el-capitan',
    name: 'El Capitan',
    kind: 'landmark',
    region: 'valley',
    coord: [-119.63583, 37.74222], // Wikipedia: El Capitan
    note: 'Three thousand feet of granite from meadow to rim. The climbers are the dots; the meadow across the road is where to look from.',
  },
  {
    id: 'cathedral-rocks',
    name: 'Cathedral Rocks and Spires',
    kind: 'landmark',
    region: 'valley',
    coord: [-119.636833, 37.714649], // Wikipedia: Middle Cathedral Rock
    note: 'The three summits across the Valley from El Capitan, with the two spires to their east. Bridalveil Fall drops off their west shoulder.',
  },
  {
    id: 'three-brothers',
    name: 'Three Brothers',
    kind: 'landmark',
    region: 'valley',
    coord: [-119.614712, 37.746013], // Wikipedia: Three Brothers (Yosemite)
    note: 'The three stacked gables on the north wall east of El Capitan; Eagle Peak, at 7,783 feet, is the top one.',
  },
  {
    id: 'sentinel-rock',
    name: 'Sentinel Rock',
    kind: 'landmark',
    region: 'valley',
    coord: [-119.594331, 37.728815], // Wikipedia: Sentinel Rock
    note: 'The 7,038-foot spire on the south wall above Swinging Bridge and the Four Mile Trail.',
  },
  {
    id: 'royal-arches',
    name: 'Royal Arches',
    kind: 'landmark',
    region: 'valley',
    coord: [-119.569, 37.7484], // Wikipedia: Royal Arches (Yosemite)
    note: 'The curved exfoliation arches in the north wall behind The Ahwahnee, with North Dome above them.',
  },
  {
    id: 'washington-column',
    name: 'Washington Column',
    kind: 'landmark',
    region: 'valley',
    coord: [-119.56, 37.75], // Wikipedia: Washington Column
    note: 'The pillar east of Royal Arches, facing Half Dome across Tenaya Canyon, above Mirror Lake.',
  },
  {
    id: 'nevada-fall',
    name: 'Nevada Fall',
    kind: 'landmark',
    region: 'valley',
    coord: [-119.533374, 37.724764], // Wikipedia: Nevada Fall
    note: 'The 594-foot fall on the Merced above Vernal Fall, bent where it hits the apron. Reached on foot by the Mist Trail or the John Muir Trail.',
  },
  {
    id: 'grizzly-giant',
    name: 'Grizzly Giant',
    kind: 'landmark',
    region: 'glacier-mariposa',
    coord: [-119.600664, 37.503514], // Wikipedia: Grizzly Giant
    note: 'The most visited tree in the park, about 209 feet tall and close to 3,000 years old, on the Grizzly Giant Loop from the grove arrival area. The California Tunnel Tree stands a hundred metres on.',
  },
  {
    id: 'california-tunnel-tree',
    name: 'California Tunnel Tree',
    kind: 'landmark',
    region: 'glacier-mariposa',
    coord: [-119.600307, 37.504288], // NPS API places: Grizzly Giant Tour, The Surviving Tunnel Tree
    note: 'Cut in 1895 for stagecoaches and still standing, the only tunnel tree left in the grove.',
  },
  {
    id: 'fallen-monarch',
    name: 'Fallen Monarch',
    kind: 'landmark',
    region: 'glacier-mariposa',
    coord: [-119.608891, 37.502526], // NPS API places: Big Trees Loop, The Fallen Monarch
    note: 'The great downed sequoia on the accessible Big Trees Loop, roots in the air; nobody knows when it fell.',
  },
  {
    id: 'yosemite-chapel',
    name: 'Yosemite Chapel',
    kind: 'landmark',
    region: 'valley',
    coord: [-119.591587, 37.740988], // NPS API places: Yosemite Chapel
    note: 'The oldest building in the Valley, from 1879, on Southside Drive by Sentinel Bridge.',
  },
  {
    id: 'ansel-adams-gallery',
    name: 'The Ansel Adams Gallery',
    kind: 'landmark',
    region: 'valley',
    coord: [-119.586825, 37.748497], // NPS API places: The Ansel Adams Gallery
    note: 'The gallery in Yosemite Village between the Museum and the post office: Adams prints, contemporary work, and photography walks.',
  },
  {
    id: 'conservation-heritage-center',
    name: 'Yosemite Conservation Heritage Center',
    kind: 'landmark',
    region: 'valley',
    coord: [-119.579523, 37.739886], // NPS API places: Yosemite Conservation Heritage Center
    note: 'The 1903 Sierra Club lodge, formerly LeConte Memorial Lodge, with a library and evening programs. Shuttle stop 12.',
  },
]

export const AMENITIES: AmenityT[] = Amenities.parse(seed)
