// =============================================================================
// LANDMARKS — the major-destination reference layer.
//
// These are NOT guide stops: no editorial body, no time budget, no photos.
// They exist so every big name in the park has a tappable offline GPS pin on
// /map and a row in the GPS directory. Coordinates were compiled 2026-07 from
// NPS place pages, LOC HAER survey points, USGS-derived aggregators, and OSM.
//   verified: true  = multiple sources agree (signed lot or named feature)
//   verified: false = best available value, still `// TODO: verify` grade —
//                     the directory and popup label these "approximate".
// `pointsAt` says what the pin marks for navigation: the PARKING a driver
// needs, or the FEATURE itself (with the note carrying the parking pairing,
// e.g. Wapama Falls → park at O'Shaughnessy Dam).
// Validated at module load (incl. a Yosemite bbox check that catches swapped
// lat/lng); a bad row fails the build.
// =============================================================================

import { z } from 'zod'
import { Landmarks, type LandmarkArea, type LandmarkT } from './schema'

type LandmarkInput = z.input<typeof Landmarks>[number]

const GPR_SEASONAL = 'Glacier Point Road closed roughly November through late May.'
const TIOGA_SEASONAL = 'Tioga Road closed roughly November through late May or June.'
const HETCH_SEASONAL = 'Road open year-round, daytime hours only.'

const seed: LandmarkInput[] = [
  // ── Yosemite Valley ────────────────────────────────────────────────────────
  {
    id: 'lower-yosemite-fall-trailhead',
    name: 'Lower Yosemite Fall trailhead',
    area: 'valley', kind: 'trailhead', coord: [-119.59478, 37.74535], pointsAt: 'parking',
    note: 'Shuttle stop 6. Flat half-mile loop to the base of the lower fall; dry by late summer.',
    verified: true,
  },
  {
    id: 'yosemite-falls',
    name: 'Yosemite Falls',
    area: 'valley', kind: 'viewpoint', coord: [-119.5969, 37.7566], pointsAt: 'feature',
    note: 'The full 2,425 ft triple fall. View it from the Lower Fall trail or Cook\'s Meadow; snowmelt-fed, best April through June.',
    verified: true,
  },
  {
    id: 'upper-yosemite-fall-trailhead',
    name: 'Upper Yosemite Fall trailhead (Camp 4)',
    area: 'valley', kind: 'trailhead', coord: [-119.602, 37.74215], pointsAt: 'parking',
    note: 'Starts beside Camp 4. 7.2 mi round trip, 2,700 ft of gain; one of the valley\'s hardest day hikes.',
    verified: true,
  },
  {
    id: 'valley-view',
    name: 'Valley View (Gates of the Valley)',
    area: 'valley', kind: 'viewpoint', coord: [-119.6663, 37.7169], pointsAt: 'parking',
    note: 'Riverside pullout on Northside Drive near Pohono Bridge. El Capitan and Bridalveil over the Merced; the classic exit view.',
    verified: false, // TODO: verify (no authoritative decimal found for the pullout)
  },
  {
    id: 'el-capitan',
    name: 'El Capitan',
    area: 'valley', kind: 'viewpoint', coord: [-119.63776, 37.73395], pointsAt: 'feature',
    note: 'The 3,000 ft granite monolith. Watch climbers from El Capitan Meadow on Northside Drive.',
    verified: true,
  },
  {
    id: 'el-capitan-bridge',
    name: 'El Capitan Bridge',
    area: 'valley', kind: 'viewpoint', coord: [-119.63, 37.7185], pointsAt: 'feature',
    note: 'Merced crossing at El Capitan Meadow; connects Northside and Southside Drives.',
    verified: false, // TODO: verify
  },
  {
    id: 'half-dome',
    name: 'Half Dome (summit)',
    area: 'valley', kind: 'viewpoint', coord: [-119.53294, 37.74604], pointsAt: 'feature',
    note: 'Park at the Curry Village trailhead lot; trail starts at Happy Isles. 14–16 mi round trip; cables require a permit.',
    verified: true,
  },
  {
    id: 'vernal-fall-footbridge',
    name: 'Vernal Fall footbridge',
    area: 'valley', kind: 'viewpoint', coord: [-119.5486, 37.7286], pointsAt: 'feature',
    note: 'Park at the Curry Village trailhead lot; 0.8 mi up the paved Mist Trail from Happy Isles. First view of Vernal Fall.',
    verified: false, // TODO: verify (derived from trail descriptions)
  },
  {
    id: 'nevada-fall',
    name: 'Nevada Fall',
    area: 'valley', kind: 'viewpoint', coord: [-119.5334, 37.72565], pointsAt: 'feature',
    note: 'The 594 ft upper fall on the Mist Trail / John Muir Trail loop; ~3 mi in from Happy Isles.',
    verified: true,
  },
  {
    id: 'four-mile-trailhead',
    name: 'Four-Mile Trail trailhead',
    area: 'valley', kind: 'trailhead', coord: [-119.6035, 37.7334], pointsAt: 'parking',
    note: 'Roadside on Southside Drive. 4.8 mi and 3,200 ft up to Glacier Point; or hike it down with a car shuttle.',
    verified: true,
  },
  {
    id: 'swinging-bridge-valley',
    name: 'Swinging Bridge picnic area',
    area: 'valley', kind: 'parking', coord: [-119.60017, 37.73681], pointsAt: 'parking',
    note: 'Quiet river access and a Yosemite Falls reflection view; tables and restrooms.',
    verified: true,
  },
  {
    id: 'cathedral-beach',
    name: 'Cathedral Beach picnic area',
    area: 'valley', kind: 'parking', coord: [-119.62239, 37.72465], pointsAt: 'parking',
    note: 'Southside Drive tables with El Capitan straight across the river.',
    verified: true,
  },
  {
    id: 'sentinel-beach',
    name: 'Sentinel Beach picnic area',
    area: 'valley', kind: 'parking', coord: [-119.60455, 37.73582], pointsAt: 'parking',
    note: 'Sandy Merced access off Southside Drive; calm-morning Half Dome reflections nearby.',
    verified: true,
  },
  {
    id: 'valley-visitor-center',
    name: 'Yosemite Valley Visitor Center',
    area: 'valley', kind: 'facility', coord: [-119.58723, 37.74889], pointsAt: 'feature',
    note: 'Yosemite Village. Park in the Village day-use lot and walk or ride the shuttle; exhibits, rangers, and the theater.',
    verified: true,
  },
  {
    id: 'yosemite-valley-lodge',
    name: 'Yosemite Valley Lodge',
    area: 'valley', kind: 'lodging', coord: [-119.59842, 37.74326], pointsAt: 'parking',
    note: 'Across from Yosemite Falls; food court and the Valley Floor Tour departure point.',
    verified: true,
  },
  {
    id: 'housekeeping-camp',
    name: 'Housekeeping Camp',
    area: 'valley', kind: 'lodging', coord: [-119.5796, 37.7406], pointsAt: 'parking',
    note: 'Open-air units on the Merced; the best swimming beach of the lodging areas.',
    verified: true,
  },

  // ── Glacier Point Road / the south rim ─────────────────────────────────────
  {
    id: 'washburn-point',
    name: 'Washburn Point',
    area: 'south', kind: 'viewpoint', coord: [-119.573, 37.7204], pointsAt: 'parking',
    note: 'A mile before Glacier Point and arguably the better view: Half Dome plus Vernal and Nevada Falls stacked below.',
    seasonal: GPR_SEASONAL,
    verified: true,
  },
  {
    id: 'taft-point',
    name: 'Taft Point',
    area: 'south', kind: 'viewpoint', coord: [-119.60528, 37.71295], pointsAt: 'feature',
    note: 'Cliff-edge overlook and the Fissures. Park at the shared Sentinel Dome / Taft Point trailhead lot; 1.1 mi each way.',
    seasonal: GPR_SEASONAL,
    verified: true,
  },
  {
    id: 'sentinel-dome-summit',
    name: 'Sentinel Dome (summit)',
    area: 'south', kind: 'viewpoint', coord: [-119.58433, 37.72298], pointsAt: 'feature',
    note: '360° panorama at 8,122 ft. Park at the shared Sentinel Dome / Taft Point trailhead lot; 1.1 mi each way.',
    seasonal: GPR_SEASONAL,
    verified: true,
  },
  {
    id: 'sentinel-taft-trailhead',
    name: 'Sentinel Dome & Taft Point trailhead',
    area: 'south', kind: 'trailhead', coord: [-119.58645, 37.71235], pointsAt: 'parking',
    note: 'One lot serves both trails, mile 13.6 of Glacier Point Road. Fills mid-morning in summer.',
    seasonal: GPR_SEASONAL,
    verified: true,
  },
  {
    id: 'badger-pass',
    name: 'Badger Pass Ski Area',
    area: 'south', kind: 'facility', coord: [-119.6628, 37.6606], pointsAt: 'parking',
    note: 'California\'s oldest ski area; winter downhill, tubing, and the snowshoe/ski route toward Glacier Point.',
    seasonal: 'Winter operation; road plowed to Badger Pass only.',
    verified: true,
  },
  {
    id: 'mcgurk-meadow-trailhead',
    name: 'McGurk Meadow trailhead',
    area: 'south', kind: 'trailhead', coord: [-119.62827, 37.67049], pointsAt: 'parking',
    note: 'Roadside pullout. An easy 1.6 mi round trip to a wildflower meadow and a 19th-century cabin.',
    seasonal: GPR_SEASONAL,
    verified: true,
  },
  {
    id: 'ostrander-lake-trailhead',
    name: 'Ostrander Lake trailhead',
    area: 'south', kind: 'trailhead', coord: [-119.6118, 37.6612], pointsAt: 'parking',
    note: '12.5 mi round trip to a granite-bowl lake; the winter ski-hut route.',
    seasonal: GPR_SEASONAL,
    verified: false, // TODO: verify (reasoned from NPS directions)
  },

  // ── Wawona ─────────────────────────────────────────────────────────────────
  {
    id: 'wawona-hotel',
    name: 'Wawona Hotel',
    area: 'wawona', kind: 'lodging', coord: [-119.6561, 37.5369], pointsAt: 'parking',
    note: 'The 1876 Victorian hotel. Closed for rehabilitation since December 2024; check status before planning around it.',
    verified: true,
  },
  {
    id: 'pioneer-history-center',
    name: 'Pioneer Yosemite History Center',
    area: 'wawona', kind: 'viewpoint', coord: [-119.654, 37.5356], pointsAt: 'feature',
    note: 'Historic cabins and the covered bridge; park near the Wawona store and walk over.',
    verified: true,
  },
  {
    id: 'chilnualna-falls-trailhead',
    name: 'Chilnualna Falls trailhead',
    area: 'wawona', kind: 'trailhead', coord: [-119.63369, 37.54839], pointsAt: 'parking',
    note: '8.2 mi round trip, 2,300 ft of gain, up a chain of cascades. The south end\'s big earn-it hike.',
    verified: true,
  },
  {
    id: 'wawona-meadow-loop',
    name: 'Wawona Meadow Loop',
    area: 'wawona', kind: 'trailhead', coord: [-119.6499, 37.53441], pointsAt: 'parking',
    note: 'Flat 3.5 mi loop around the meadow; starts across from the Wawona Hotel golf course.',
    verified: true,
  },
  {
    id: 'swinging-bridge-wawona',
    name: 'Swinging Bridge (Wawona)',
    area: 'wawona', kind: 'viewpoint', coord: [-119.6283, 37.5449], pointsAt: 'feature',
    note: 'A genuinely swinging footbridge over the South Fork Merced; local swimming holes nearby.',
    verified: true,
  },

  // ── Tioga Road / Tuolumne corridor ─────────────────────────────────────────
  {
    id: 'tuolumne-grove-trailhead',
    name: 'Tuolumne Grove trailhead',
    area: 'tioga', kind: 'trailhead', coord: [-119.80561, 37.75826], pointsAt: 'parking',
    note: 'Near Crane Flat. 2.5 mi round trip, downhill in, to about two dozen giant sequoias and a walk-through tunnel tree.',
    verified: true,
  },
  {
    id: 'merced-grove-trailhead',
    name: 'Merced Grove trailhead',
    area: 'tioga', kind: 'trailhead', coord: [-119.84605, 37.75658], pointsAt: 'parking',
    note: 'The park\'s smallest, quietest sequoia grove; 3 mi round trip.',
    verified: true,
  },
  {
    id: 'white-wolf',
    name: 'White Wolf',
    area: 'tioga', kind: 'lodging', coord: [-119.64709, 37.87068], pointsAt: 'parking',
    note: 'Lodge and campground area at 8,000 ft; trailheads for Lukens and Harden Lakes.',
    seasonal: TIOGA_SEASONAL,
    verified: true,
  },
  {
    id: 'lukens-lake-trailhead',
    name: 'Lukens Lake trailhead',
    area: 'tioga', kind: 'trailhead', coord: [-119.61522, 37.85058], pointsAt: 'parking',
    note: '1.6 mi round trip to a wildflower-rimmed lake; the high country\'s easiest payoff.',
    seasonal: TIOGA_SEASONAL,
    verified: true,
  },
  {
    id: 'porcupine-creek-trailhead',
    name: 'Porcupine Creek / North Dome trailhead',
    area: 'tioga', kind: 'trailhead', coord: [-119.54611, 37.80667], pointsAt: 'parking',
    note: '9 mi round trip to North Dome: the head-on Half Dome view almost nobody hikes to.',
    seasonal: TIOGA_SEASONAL,
    verified: true,
  },
  {
    id: 'tenaya-lake-east-beach',
    name: 'Tenaya Lake east beach',
    area: 'tioga', kind: 'parking', coord: [-119.455, 37.8305], pointsAt: 'parking',
    note: 'The sandy beach at the east end; lunch rocks and very cold swimming.',
    seasonal: TIOGA_SEASONAL,
    verified: false, // TODO: verify (lot decimal not pinned)
  },
  {
    id: 'sunrise-lakes-trailhead',
    name: 'Sunrise Lakes trailhead',
    area: 'tioga', kind: 'trailhead', coord: [-119.45852, 37.8008], pointsAt: 'parking',
    note: 'Southwest end of Tenaya Lake; route to the Sunrise Lakes and Clouds Rest.',
    seasonal: TIOGA_SEASONAL,
    verified: false, // TODO: verify (source value may be a trail point, not the lot)
  },
  {
    id: 'tuolumne-visitor-center',
    name: 'Tuolumne Meadows Visitor Center',
    area: 'tioga', kind: 'facility', coord: [-119.3395, 37.876], pointsAt: 'parking',
    note: 'High-country visitor center; check here for current trail and program info.',
    seasonal: TIOGA_SEASONAL,
    verified: true,
  },
  {
    id: 'tuolumne-store',
    name: 'Tuolumne Meadows store & campground',
    area: 'tioga', kind: 'facility', coord: [-119.35299, 37.87377], pointsAt: 'parking',
    note: 'The canvas-sided store, grill, and post office; campground reopening per NPS after reconstruction.',
    seasonal: TIOGA_SEASONAL,
    verified: true,
  },
  {
    id: 'lembert-dome-parking',
    name: 'Lembert Dome / Dog Lake parking',
    area: 'tioga', kind: 'trailhead', coord: [-119.33897, 37.87834], pointsAt: 'parking',
    note: 'One lot serves Lembert Dome, Dog Lake, and the Soda Springs / Parsons Lodge walk.',
    seasonal: TIOGA_SEASONAL,
    verified: true,
  },
  {
    id: 'pothole-dome',
    name: 'Pothole Dome',
    area: 'tioga', kind: 'viewpoint', coord: [-119.39321, 37.87992], pointsAt: 'feature',
    note: 'West end of Tuolumne Meadows; a 15-minute scramble buys the whole meadow at sunset. Roadside pullout parking.',
    seasonal: TIOGA_SEASONAL,
    verified: true,
  },
  {
    id: 'tioga-pass-summit',
    name: 'Tioga Pass (9,945 ft)',
    area: 'tioga', kind: 'viewpoint', coord: [-119.2581, 37.9092], pointsAt: 'feature',
    note: 'The highest highway pass in California, at the park\'s east entrance station.',
    seasonal: TIOGA_SEASONAL,
    verified: true,
  },
  {
    id: 'mono-pass-trailhead',
    name: 'Mono Pass trailhead',
    area: 'tioga', kind: 'trailhead', coord: [-119.26266, 37.89094], pointsAt: 'parking',
    note: '8 mi round trip to a 10,600 ft pass with 19th-century mining cabins.',
    seasonal: TIOGA_SEASONAL,
    verified: true,
  },

  // ── Hetch Hetchy ───────────────────────────────────────────────────────────
  {
    id: 'oshaughnessy-dam',
    name: "O'Shaughnessy Dam parking",
    area: 'hetch-hetchy', kind: 'trailhead', coord: [-119.78753, 37.9465], pointsAt: 'parking',
    note: 'Trailhead for Wapama Falls and the reservoir-edge trail; walk across the dam and through the tunnel.',
    seasonal: HETCH_SEASONAL,
    verified: true,
  },
  {
    id: 'wapama-falls',
    name: 'Wapama Falls',
    area: 'hetch-hetchy', kind: 'viewpoint', coord: [-119.76551, 37.96731], pointsAt: 'feature',
    note: 'Park at O\'Shaughnessy Dam; 2.5 mi each way to footbridges under the 1,000 ft falls. Spray-soaked in spring.',
    seasonal: HETCH_SEASONAL,
    verified: true,
  },
  {
    id: 'lookout-point-trailhead',
    name: 'Lookout Point trailhead',
    area: 'hetch-hetchy', kind: 'trailhead', coord: [-119.8415, 37.8935], pointsAt: 'parking',
    note: 'Just inside the Hetch Hetchy entrance; 2.8 mi round trip to a reservoir overlook.',
    seasonal: HETCH_SEASONAL,
    verified: false, // TODO: verify (approximately at the entrance station)
  },

  // ── Entrance stations ──────────────────────────────────────────────────────
  {
    id: 'arch-rock-entrance',
    name: 'Arch Rock Entrance (Hwy 140)',
    area: 'entrances', kind: 'entrance', coord: [-119.7308, 37.6861], pointsAt: 'feature',
    note: 'The all-weather low road from Mariposa and El Portal; stays open when storms close the others.',
    verified: true,
  },
  {
    id: 'big-oak-flat-entrance',
    name: 'Big Oak Flat Entrance (Hwy 120 west)',
    area: 'entrances', kind: 'entrance', coord: [-119.87546, 37.80011], pointsAt: 'feature',
    note: 'The Bay Area workhorse, via Groveland.',
    verified: true,
  },
  {
    id: 'south-entrance',
    name: 'South Entrance (Hwy 41)',
    area: 'entrances', kind: 'entrance', coord: [-119.63192, 37.50694], pointsAt: 'feature',
    note: 'From Oakhurst and Fresno; the Mariposa Grove Welcome Plaza is immediately inside.',
    verified: true,
  },
  {
    id: 'tioga-pass-entrance',
    name: 'Tioga Pass Entrance (Hwy 120 east)',
    area: 'entrances', kind: 'entrance', coord: [-119.25483, 37.90667], pointsAt: 'feature',
    note: 'The east door, from Lee Vining and US 395.',
    seasonal: TIOGA_SEASONAL,
    verified: true,
  },
  {
    id: 'hetch-hetchy-entrance',
    name: 'Hetch Hetchy Entrance',
    area: 'entrances', kind: 'entrance', coord: [-119.84157, 37.89353], pointsAt: 'feature',
    note: 'Via Evergreen Road off Hwy 120; separate corner of the park with its own hours.',
    seasonal: HETCH_SEASONAL,
    verified: true,
  },

  // ── Practical ──────────────────────────────────────────────────────────────
  {
    id: 'crane-flat-gas',
    name: 'Crane Flat gas station',
    area: 'practical', kind: 'facility', coord: [-119.79667, 37.75278], pointsAt: 'parking',
    note: 'The junction of Hwy 120 and Tioga Road. Last gas before the high country; there is none in the valley.',
    verified: true,
  },
  {
    id: 'el-portal',
    name: 'El Portal',
    area: 'practical', kind: 'facility', coord: [-119.78406, 37.67465], pointsAt: 'feature',
    note: 'The Hwy 140 gateway town, 30 minutes from the valley floor; gas, food, and lodging.',
    verified: true,
  },
]

export const LANDMARKS: LandmarkT[] = Landmarks.parse(seed)

export const LANDMARK_AREAS: { id: LandmarkArea; label: string }[] = [
  { id: 'valley', label: 'Yosemite Valley' },
  { id: 'south', label: 'Glacier Point Road' },
  { id: 'wawona', label: 'Wawona' },
  { id: 'tioga', label: 'Tioga Road & Tuolumne' },
  { id: 'hetch-hetchy', label: 'Hetch Hetchy' },
  { id: 'entrances', label: 'Entrance stations' },
  { id: 'practical', label: 'Practical' },
]

export function getLandmarkById(id: string): LandmarkT | undefined {
  return LANDMARKS.find((l) => l.id === id)
}

export function landmarksByArea(area: LandmarkArea): LandmarkT[] {
  return LANDMARKS.filter((l) => l.area === area)
}
