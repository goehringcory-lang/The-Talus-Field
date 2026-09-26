// =============================================================================
// The day-hike catalog for the Plan tab's Hikes section: every established
// day hike inside the park boundary, grouped by the guide's four regions.
//
// Provenance: distances, elevation gains, and difficulty calls were compiled
// from the yosemitehikes.com trail index and NPS trail pages (July 2026 pass).
// Stats only; every description is original Talus Field copy. Where a hike's
// standard trailhead already exists as a guide Stop, `stopId` cross-links it
// and the coord reuses that stop's verified pin. Coords without a stop link
// are web-derived trailhead approximations, fine for the planner's drive-time
// buffers; treat them like the stops.ts TODO pins until ground-truthed.
//
// `photo` is set only where a Commons file is verified to show this trail or
// its destination (manifest slots `hike:<id>`, see check-guide-photos.mjs);
// Lukens, Harden, Sunrise Lakes, Mono Meadow, the Wawona swinging bridge,
// Lookout Point, Carlon Falls, and the Four Mile Trail have none yet.
//
// durationMin is a deliberately generous moving-plus-lingering estimate for
// the trip planner's day slotting, not a fitness claim.
// =============================================================================

import { Hikes, type HikeT } from './schema'

const seed: HikeT[] = [
  // --- Yosemite Valley ------------------------------------------------------
  {
    id: 'lower-yosemite-fall',
    title: 'Lower Yosemite Fall',
    region: 'valley',
    order: 1,
    distanceMi: 1.0,
    elevationGainFt: 50,
    difficulty: 'easy',
    route: 'loop',
    durationMin: 40,
    trailhead: 'Lower Yosemite Fall trailhead, shuttle stop 6',
    coord: [-119.5966, 37.7466], // web-derived: shuttle stop 6 loop start; TODO verify on the ground
    photo: { src: '/photos/hike-lower-yosemite-fall.jpg', alt: 'Lower Yosemite Fall dropping into its boulder pool, a rainbow in the spray.' },
    description:
      'The paved loop to the base of the last drop of North America’s tallest waterfall. Peak flow in May soaks the footbridge; by August the wall can be dry.',
  },
  {
    id: 'cooks-meadow',
    title: 'Cook’s Meadow Loop',
    region: 'valley',
    order: 2,
    distanceMi: 1.0,
    elevationGainFt: 0,
    difficulty: 'easy',
    route: 'loop',
    durationMin: 40,
    trailhead: 'Sentinel Bridge lot, or shuttle stop 6 at Lower Yosemite Fall',
    stopId: 'cooks-meadow-loop',
    coord: [-119.5896, 37.7435], // same pin as stop cooks-meadow-loop
    photo: { src: '/photos/hike-cooks-meadow.jpg', alt: 'Half Dome above Cook’s Meadow on a foggy autumn morning.' },
    description:
      'A flat meadow circuit with Yosemite Falls, Half Dome, and Sentinel Rock all in view at once, for almost no effort.',
  },
  {
    id: 'bridalveil-fall',
    title: 'Bridalveil Fall',
    region: 'valley',
    order: 3,
    distanceMi: 0.5,
    elevationGainFt: 100,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 30,
    trailhead: 'Bridalveil Fall lot, Wawona Road at Southside Drive',
    stopId: 'bridalveil-fall',
    coord: [-119.6509, 37.7167], // same pin as stop bridalveil-fall
    photo: { src: '/photos/hike-bridalveil-fall.jpg', alt: 'Bridalveil Fall pouring off the cliff into mist.' },
    description:
      'The short paved walk to the fall the Ahwahneechee called Pohono. It runs all year and throws spray across the viewing area through early summer.',
  },
  {
    id: 'mirror-lake',
    title: 'Mirror Lake',
    region: 'valley',
    order: 4,
    distanceMi: 2.0,
    distanceNote: '5 mi loop option around the lake and back along Tenaya Creek',
    elevationGainFt: 100,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 90,
    trailhead: 'Mirror Lake trailhead, shuttle stop 17',
    stopId: 'mirror-lake',
    coord: [-119.56, 37.7393], // same pin as stop mirror-lake
    photo: { src: '/photos/mirror-lake.jpg', alt: 'Mirror Lake reflecting the granite walls of Tenaya Canyon.' },
    description:
      'A gentle walk up Tenaya Canyon to the seasonal lake under Half Dome’s north face. Come in spring for the reflection; by late summer it is a meadow with a creek.',
  },
  {
    id: 'valley-loop-trail',
    title: 'Valley Loop Trail',
    region: 'valley',
    order: 5,
    distanceMi: 11.5,
    distanceNote: '7.2 mi half-loop option via the El Capitan crossover',
    elevationGainFt: 200,
    difficulty: 'moderate',
    route: 'loop',
    durationMin: 330,
    trailhead: 'Most Valley shuttle stops; Lower Yosemite Fall, stop 6, works well',
    coord: [-119.5966, 37.7466], // same pin as lower-yosemite-fall hike
    photo: { src: '/photos/hike-valley-loop-trail.jpg', alt: 'A Valley Loop Trail sign pointing to El Capitan and Bridalveil Fall.' },
    description:
      'The mostly flat circuit of the Valley floor on the old wagon roads, past every major wall and away from most of the crowd. Easy to shorten at any crossover.',
  },
  {
    id: 'artist-point',
    title: 'Artist Point',
    region: 'valley',
    order: 6,
    distanceMi: 2.0,
    elevationGainFt: 500,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 100,
    trailhead: 'Tunnel View upper lot',
    stopId: 'artist-point',
    coord: [-119.6773, 37.7156], // moved 2026-09 to the Tunnel View upper lot the trailhead text names (Recreation.gov Pohono Trail at Wawona Tunnel)
    photo: { src: '/photos/hike-artist-point.jpg', alt: 'An early photograph of Yosemite Valley from Artist Point: El Capitan, Half Dome, and Bridalveil Fall.' },
    description:
      'A short climb on the old stagecoach grade to the ledge where the nineteenth-century painters set their easels. Tunnel View’s panorama without Tunnel View’s parking lot.',
  },
  {
    id: 'inspiration-point',
    title: 'Inspiration Point',
    region: 'valley',
    order: 7,
    distanceMi: 2.6,
    elevationGainFt: 1000,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 150,
    trailhead: 'Tunnel View upper lot',
    stopId: 'inspiration-point',
    coord: [-119.6773, 37.7156], // same pin as stop tunnel-view (trail starts from the upper lot)
    photo: { src: '/photos/hike-inspiration-point.jpg', alt: 'Yosemite Valley from Inspiration Point, El Capitan and Bridalveil Fall beyond the trees.' },
    description:
      'The steady climb from Tunnel View to the old road’s higher, quieter viewpoint. The valley panorama widens with every switchback.',
  },
  {
    id: 'columbia-rock',
    title: 'Columbia Rock',
    region: 'valley',
    order: 8,
    distanceMi: 2.0,
    elevationGainFt: 1000,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 120,
    trailhead: 'Upper Yosemite Fall trailhead at Camp 4',
    coord: [-119.6021, 37.742], // web-derived: Camp 4 trailhead; TODO verify on the ground
    photo: { src: '/photos/hike-columbia-rock.jpg', alt: 'An early photograph of the head of the Valley from Columbia Rock, Half Dome at center.' },
    description:
      'The first mile of switchbacks on the Yosemite Falls Trail, ending at a railed perch with Half Dome and Sentinel Rock across the valley. A sample of the full climb for a third of the effort.',
  },
  {
    id: 'vernal-fall-mist-trail',
    title: 'Vernal Fall via the Mist Trail',
    region: 'valley',
    order: 9,
    distanceMi: 3.0,
    elevationGainFt: 1000,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 180,
    trailhead: 'Happy Isles, shuttle stop 16',
    stopId: 'mist-trail',
    coord: [-119.558, 37.7322], // same pin as stop mist-trail
    hazard:
      'The granite staircase beside the fall is soaked and slick through early summer. Never enter the Emerald Pool above the fall.',
    photo: { src: '/photos/hike-vernal-fall-mist-trail.jpg', alt: 'The Mist Trail sign pointing to Vernal Fall, Nevada Fall, and the John Muir Trail.' },
    description:
      'The stone steps up through Vernal Fall’s spray, the park’s most-hiked mile. Bring a shell in spring or plan on hiking wet.',
  },
  {
    id: 'nevada-fall',
    title: 'Nevada Fall loop',
    region: 'valley',
    order: 10,
    distanceMi: 7.0,
    distanceNote: 'up the Mist Trail, down the John Muir Trail',
    elevationGainFt: 1900,
    difficulty: 'strenuous',
    route: 'lollipop',
    durationMin: 330,
    trailhead: 'Happy Isles, shuttle stop 16',
    stopId: 'mist-trail',
    coord: [-119.558, 37.7322], // same pin as stop mist-trail
    hazard:
      'The granite stairs are soaked and slick through early summer. Never enter the Emerald Pool or the river above either fall; the current above the brinks is far stronger than it looks.',
    photo: { src: '/photos/hike-nevada-fall.jpg', alt: 'Nevada Fall beside the dome of Liberty Cap.' },
    description:
      'Past Vernal Fall to the brink of its bigger sibling, then down the John Muir Trail for the Liberty Cap panorama. Two big waterfalls in one day.',
  },
  {
    id: 'upper-yosemite-fall',
    title: 'Upper Yosemite Fall',
    region: 'valley',
    order: 11,
    distanceMi: 7.6,
    distanceNote: 'add 1.6 mi round trip for Yosemite Point',
    elevationGainFt: 2600,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 420,
    trailhead: 'Upper Yosemite Fall trailhead at Camp 4',
    coord: [-119.6021, 37.742], // same pin as columbia-rock hike
    photo: { src: '/photos/hike-upper-yosemite-fall.jpg', alt: 'Upper Yosemite Fall leaving the rim over a snowy talus slope.' },
    description:
      'Dozens of switchbacks to the notch where the fall leaves the rim. Start early: the trail bakes by mid-morning.',
  },
  {
    id: 'four-mile-trail',
    title: 'Four Mile Trail',
    region: 'valley',
    order: 12,
    distanceMi: 4.8,
    distanceNote: 'one-way to Glacier Point; 9.6 mi round trip',
    elevationGainFt: 3200,
    difficulty: 'strenuous',
    route: 'one-way',
    durationMin: 270,
    trailhead: 'Southside Drive west of Swinging Bridge, shuttle stop 11',
    stopId: 'four-mile-trailhead',
    coord: [-119.602, 37.7339], // same pin as stop four-mile-trailhead
    season: 'Upper trail closes in snow, November or December to May',
    description:
      'The switchbacked climb from the Valley floor to Glacier Point, with the falls and Half Dome in view most of the way up. Hike it one-way if someone can meet you on top.',
  },
  {
    id: 'half-dome',
    title: 'Half Dome',
    region: 'valley',
    order: 13,
    distanceMi: 14.2,
    distanceNote: 'via the Mist Trail; 16.4 mi via the John Muir Trail',
    elevationGainFt: 4800,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 720,
    trailhead: 'Happy Isles, shuttle stop 16',
    stopId: 'mist-trail',
    coord: [-119.558, 37.7322], // same pin as stop mist-trail
    season: 'Cables up late May to mid-October',
    permit:
      'Permit required whenever the cables are up, by preseason lottery in March or the two-day-ahead daily lottery on recreation.gov.',
    hazard:
      'The cable route climbs bare granite at a 45-degree pitch. Do not start up if the rock is wet or storms are forecast, and turn around if clouds build.',
    photo: { src: '/photos/hike-half-dome.jpg', alt: 'The Half Dome cables running up the dome’s bare shoulder.' },
    description:
      'The park’s signature endurance day: past both falls, up Sub Dome’s stairs, then the cables to the summit plateau. Ten to twelve hours for most parties; train for it.',
  },
  {
    id: 'eagle-peak',
    title: 'Eagle Peak',
    region: 'valley',
    order: 14,
    distanceMi: 13.5,
    elevationGainFt: 3800,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 540,
    trailhead: 'Upper Yosemite Fall trailhead at Camp 4',
    stopId: 'eagle-peak',
    coord: [-119.6021, 37.742], // Camp 4 start; the linked stop pins the summit
    photo: { src: '/photos/hike-eagle-peak.jpg', alt: 'The Three Brothers, Eagle Peak the highest of them.' },
    description:
      'The Yosemite Falls climb, then a few more quiet miles to the highest of the Three Brothers. A Half Dome-length day with far fewer people.',
  },
  {
    id: 'snow-creek-trail',
    title: 'Snow Creek Trail',
    region: 'valley',
    order: 15,
    distanceMi: 9.4,
    elevationGainFt: 2700,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 420,
    trailhead: 'Mirror Lake trailhead, shuttle stop 17',
    stopId: 'snow-creek-trail',
    coord: [-119.56, 37.7393], // Mirror Lake start; the linked stop pins the footbridge junction
    photo: { src: '/photos/hike-snow-creek-trail.jpg', alt: 'Snow Creek Falls through the pines.' },
    description:
      'Switchback after switchback out of Tenaya Canyon to the rim across from Half Dome, on the emptiest big climb that starts on the Valley floor.',
  },

  // --- Glacier Point & Mariposa Grove --------------------------------------
  {
    id: 'mcgurk-meadow',
    title: 'McGurk Meadow',
    region: 'glacier-mariposa',
    order: 1,
    distanceMi: 1.6,
    elevationGainFt: 150,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 60,
    trailhead: 'McGurk Meadow trailhead pullout, Glacier Point Road mile 7.5',
    stopId: 'mcgurk-meadow',
    coord: [-119.6282, 37.6705], // same pin as stop mcgurk-meadow
    season: 'Glacier Point Road season',
    photo: { src: '/photos/hike-mcgurk-meadow.jpg', alt: 'McGurk Meadow, wet grass and a stepping-stone path under lodgepole pines.' },
    description:
      'A gentle forest walk to a wildflower meadow and a collapsing sheepherder’s cabin. Flowers peak in July.',
  },
  {
    id: 'dewey-point',
    title: 'Dewey Point',
    region: 'glacier-mariposa',
    order: 2,
    distanceMi: 7.0,
    elevationGainFt: 800,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 270,
    trailhead: 'McGurk Meadow trailhead pullout, Glacier Point Road mile 7.5',
    stopId: 'mcgurk-meadow',
    coord: [-119.6282, 37.6705], // same pin as stop mcgurk-meadow
    season: 'Glacier Point Road season',
    photo: { src: '/photos/hike-dewey-point.jpg', alt: 'The view east from Dewey Point toward Half Dome and the snowy high country.' },
    description:
      'Through McGurk Meadow to an unrailed rim point 3,000 feet above the west Valley, looking straight across at El Capitan.',
  },
  {
    id: 'taft-point',
    title: 'Taft Point and the Fissures',
    region: 'glacier-mariposa',
    order: 3,
    distanceMi: 2.2,
    elevationGainFt: 250,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 90,
    trailhead: 'Sentinel Dome and Taft Point shared lot, Glacier Point Road mile 13.6',
    season: 'Glacier Point Road season',
    stopId: 'taft-point',
    coord: [-119.5861, 37.7124], // same pin as stop taft-point
    hazard:
      'Past one short railing at the lookout, the point and the Fissures are open drops, the Fissures alone as deep as 2,000 feet. Keep children in hand.',
    photo: { src: '/photos/hike-taft-point.jpg', alt: 'The view from Taft Point: El Capitan and the Valley floor far below.' },
    description:
      'An easy walk to the Fissures, deep slots in the rim, and a ledge over the Valley railed at one spot and open everywhere else. Watch children closely.',
  },
  {
    id: 'sentinel-dome',
    title: 'Sentinel Dome',
    region: 'glacier-mariposa',
    order: 4,
    distanceMi: 2.2,
    elevationGainFt: 450,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 100,
    trailhead: 'Sentinel Dome and Taft Point shared lot, Glacier Point Road mile 13.6',
    season: 'Glacier Point Road season',
    stopId: 'sentinel-dome',
    coord: [-119.5861, 37.7124], // shared lot; the linked stop pins the summit
    photo: { src: '/photos/hike-sentinel-dome.jpg', alt: 'The weathered dead Jeffrey pine on Sentinel Dome’s summit.' },
    description:
      'The easiest 360-degree summit in the park: a gradual walk, then a short scramble up the dome’s shoulder to a full-circle view from Half Dome to the Coast Ranges on the clearest days.',
  },
  {
    id: 'sentinel-taft-loop',
    title: 'Sentinel Dome and Taft Point loop',
    region: 'glacier-mariposa',
    order: 5,
    distanceMi: 5.1,
    elevationGainFt: 1000,
    difficulty: 'moderate',
    route: 'loop',
    durationMin: 210,
    trailhead: 'Sentinel Dome and Taft Point shared lot, Glacier Point Road mile 13.6',
    season: 'Glacier Point Road season',
    stopId: 'taft-point',
    coord: [-119.5861, 37.7124], // same pin as stop taft-point
    photo: { src: '/photos/hike-sentinel-taft-loop.jpg', alt: 'El Capitan across the Valley from Taft Point.' },
    description:
      'Both rim landmarks joined by the Pohono Trail’s quietest stretch, with a long look down onto Yosemite Falls between them.',
  },
  {
    id: 'illilouette-fall',
    title: 'Illilouette Fall',
    region: 'glacier-mariposa',
    order: 6,
    distanceMi: 4.0,
    elevationGainFt: 1200,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 210,
    trailhead: 'Glacier Point',
    season: 'Glacier Point Road season',
    stopId: 'glacier-point',
    coord: [-119.5731, 37.7283], // same pin as stop glacier-point
    photo: { src: '/photos/hike-illilouette-fall.jpg', alt: 'Illilouette Fall dropping into its gorge.' },
    description:
      'The first leg of the Panorama Trail, dropping to the footbridge above the fall. The climb is all on the way back.',
  },
  {
    id: 'panorama-trail',
    title: 'Panorama Trail',
    region: 'glacier-mariposa',
    order: 7,
    distanceMi: 8.5,
    distanceNote: 'one-way, Glacier Point down to Happy Isles',
    elevationGainFt: 800,
    difficulty: 'strenuous',
    route: 'one-way',
    durationMin: 360,
    trailhead: 'Glacier Point',
    season: 'Glacier Point Road season',
    stopId: 'glacier-point',
    coord: [-119.5731, 37.7283], // same pin as stop glacier-point
    photo: { src: '/photos/hike-panorama-trail.jpg', alt: 'The Panorama Trail through forest near Illilouette Creek.' },
    description:
      'Off the rim past Illilouette, Nevada, and Vernal Falls with Half Dome in view most of the way. Mostly downhill, but the miles and one real climb still count.',
  },
  {
    id: 'pohono-trail',
    title: 'Pohono Trail',
    region: 'glacier-mariposa',
    order: 8,
    distanceMi: 13.0,
    distanceNote: 'one-way, Glacier Point to Tunnel View',
    elevationGainFt: 1900,
    difficulty: 'strenuous',
    route: 'one-way',
    durationMin: 480,
    trailhead: 'Glacier Point',
    season: 'Glacier Point Road season',
    stopId: 'glacier-point',
    coord: [-119.5731, 37.7283], // same pin as stop glacier-point
    photo: { src: '/photos/hike-pohono-trail.jpg', alt: 'Yosemite Valley and El Capitan from Crocker Point on the Pohono Trail.' },
    description:
      'The south rim end to end: Sentinel Dome, Taft Point, and Dewey, Crocker, and Stanford Points in one long day. Needs a car at each end.',
  },
  {
    id: 'mono-meadow',
    title: 'Mono Meadow',
    region: 'glacier-mariposa',
    order: 9,
    distanceMi: 3.0,
    elevationGainFt: 400,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 120,
    trailhead: 'Mono Meadow lot, Glacier Point Road mile 10',
    coord: [-119.5851, 37.6713], // OSM-derived: signed Mono Meadow trailhead pullout at Glacier Point Road mile 10 (the earlier web-derived pin sat 0.9 km west); TODO verify on the ground
    season: 'Glacier Point Road season',
    description:
      'Down through firs to a boggy meadow, then on to an opening with a clear shot of Mount Starr King and the Clark Range. Expect mud and log crossings all summer.',
  },
  {
    id: 'ostrander-lake',
    title: 'Ostrander Lake',
    region: 'glacier-mariposa',
    order: 10,
    distanceMi: 12.7,
    elevationGainFt: 1550,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 420,
    trailhead: 'Ostrander Lake trailhead, Glacier Point Road mile 9',
    stopId: 'ostrander-lake',
    coord: [-119.6039, 37.6668], // same pin as stop ostrander-lake
    season: 'Glacier Point Road season',
    photo: { src: '/photos/ostrander-lake.jpg', alt: 'Ostrander Lake under a granite ridge.' },
    description:
      'A long walk through lodgepole and old burns, gentle for the first half and steep near the end, to a granite-bowled lake under Horse Ridge. Few other parties.',
  },
  {
    id: 'wawona-meadow-loop',
    title: 'Wawona Meadow Loop',
    region: 'glacier-mariposa',
    order: 11,
    distanceMi: 3.5,
    elevationGainFt: 200,
    difficulty: 'easy',
    route: 'loop',
    durationMin: 100,
    trailhead: 'Across Highway 41 from the Wawona Hotel',
    stopId: 'wawona-meadow-loop',
    coord: [-119.6576, 37.5351], // moved 2026-09 to NPS places, same as the stop
    photo: { src: '/photos/wawona-meadow-loop.jpg', alt: 'An early photograph of Wawona Meadow, a stage road along its edge.' },
    description:
      'A flat lap of the meadow across the road from the Wawona Hotel on an old road grade. Spring wildflowers, big pines, and almost never another party.',
  },
  {
    id: 'wawona-swinging-bridge',
    title: 'Swinging Bridge of Wawona',
    region: 'glacier-mariposa',
    order: 12,
    distanceMi: 4.8,
    elevationGainFt: 150,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 150,
    trailhead: 'Wawona Store day-use parking',
    coord: [-119.6565, 37.5385], // OSM-derived: Wawona Store lot; the walk follows Forest Drive to the river trail (no public parking at the road-end); TODO verify on the ground
    description:
      'An easy walk up the South Fork of the Merced to a bouncing footbridge over granite pools. Swimming holes below it in summer.',
  },
  {
    id: 'chilnualna-falls',
    title: 'Chilnualna Falls',
    region: 'glacier-mariposa',
    order: 13,
    distanceMi: 8.4,
    elevationGainFt: 2300,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 330,
    trailhead: 'Chilnualna Falls lot, end of Chilnualna Falls Road',
    stopId: 'chilnualna-falls',
    coord: [-119.6337, 37.5484], // same pin as stop chilnualna-falls
    hazard:
      'The cascades run over smooth, water-polished granite with no railings. People have died sliding here; stay off wet rock at every tier.',
    photo: { src: '/photos/hike-chilnualna-falls.jpg', alt: 'One of the Chilnualna cascades roaring between boulders.' },
    description:
      'Wawona’s big climb, up alongside a chain of cascades to the top of the falls. Best in May and June while the creek still roars.',
  },
  {
    id: 'grizzly-giant-loop',
    title: 'Grizzly Giant Loop',
    region: 'glacier-mariposa',
    order: 14,
    distanceMi: 2.0,
    elevationGainFt: 300,
    difficulty: 'easy',
    route: 'loop',
    durationMin: 100,
    trailhead: 'Mariposa Grove arrival area, via the Welcome Plaza shuttle',
    season: 'Spring through fall (shuttle season)',
    stopId: 'mariposa-grove',
    coord: [-119.63, 37.5068], // moved 2026-09 to the Welcome Plaza, same as the mariposa-grove stop
    photo: { src: '/photos/hike-grizzly-giant-loop.jpg', alt: 'Carleton Watkins’s photograph of the Grizzly Giant’s trunk, people at its base.' },
    description:
      'The lower grove’s main trees: the Fallen Monarch, the Bachelor and Three Graces, the 3,000-year-old Grizzly Giant, and the California Tunnel Tree.',
  },
  {
    id: 'mariposa-grove-guardians-loop',
    title: 'Guardians Loop, upper Mariposa Grove',
    region: 'glacier-mariposa',
    order: 15,
    distanceMi: 6.5,
    elevationGainFt: 1200,
    difficulty: 'moderate',
    route: 'loop',
    durationMin: 270,
    trailhead: 'Mariposa Grove arrival area, via the Welcome Plaza shuttle',
    season: 'Spring through fall (shuttle season)',
    stopId: 'mariposa-grove',
    coord: [-119.63, 37.5068], // moved 2026-09 to the Welcome Plaza, same as the mariposa-grove stop
    photo: { src: '/photos/hike-mariposa-grove-guardians-loop.jpg', alt: 'Giant sequoias and a fallen log in the upper Mariposa Grove.' },
    description:
      'Past the Grizzly Giant and on into the upper grove, where the sequoias continue and the crowds thin. Wawona Point’s overlook, on the Mariposa Grove Trail beyond the loop, is the optional bonus.',
  },

  // --- Tuolumne Meadows & Tioga Road ----------------------------------------
  {
    id: 'tuolumne-grove',
    title: 'Tuolumne Grove',
    region: 'tuolumne',
    order: 1,
    distanceMi: 2.5,
    elevationGainFt: 500,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 120,
    trailhead: 'Tuolumne Grove lot at Crane Flat',
    stopId: 'tuolumne-grove-old-road',
    coord: [-119.80561, 37.75826], // TODO: verify on the ground — moved 2026-09 to the trailhead lot (OSM; the tuolumne-grove-old-road pin); the NPS API point is the grove itself
    photo: { src: '/photos/hike-tuolumne-grove.jpg', alt: 'The walk-through tunnel tree in the Tuolumne Grove.' },
    description:
      'Down the Old Big Oak Flat Road to two dozen giant sequoias, including a walk-through tunnel tree. The climb is all on the return.',
  },
  {
    id: 'lukens-lake',
    title: 'Lukens Lake',
    region: 'tuolumne',
    order: 2,
    distanceMi: 1.6,
    elevationGainFt: 200,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 60,
    trailhead: 'Lukens Lake trailhead, Tioga Road east of White Wolf',
    coord: [-119.6152, 37.8505], // TODO: verify on the ground — moved 2026-09 ~600 m to the trailhead: NPS places, Recreation.gov and the OSM lot agree
    season: 'Tioga Road season',
    description:
      'A short hop over a forested rise to a shallow lake rimmed by a meadow that flowers in July. An easy first high-country walk.',
  },
  {
    id: 'harden-lake',
    title: 'Harden Lake',
    region: 'tuolumne',
    order: 3,
    distanceMi: 5.6,
    elevationGainFt: 300,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 180,
    trailhead: 'White Wolf Lodge',
    coord: [-119.6486, 37.8697], // web-derived: White Wolf road-end; TODO verify on the ground
    season: 'Tioga Road season',
    description:
      'A nearly flat walk on old roadbed from White Wolf to a boulder-dotted lake in the forest. Wildflowers line the sandy stretches in early summer.',
  },
  {
    id: 'may-lake',
    title: 'May Lake',
    region: 'tuolumne',
    order: 4,
    distanceMi: 2.4,
    elevationGainFt: 500,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 100,
    trailhead: 'May Lake trailhead, end of the Old Tioga Road spur',
    stopId: 'may-lake',
    coord: [-119.4912341, 37.8324607], // same pin as stop may-lake
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-may-lake.jpg', alt: 'May Lake’s clear water against granite and pines.' },
    description:
      'A short granite-benched climb to a High Sierra Camp lake sitting under Mount Hoffmann’s wall. Easy enough for children.',
  },
  {
    id: 'mount-hoffmann',
    title: 'Mount Hoffmann',
    region: 'tuolumne',
    order: 5,
    distanceMi: 6.0,
    elevationGainFt: 2000,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 330,
    trailhead: 'May Lake trailhead, end of the Old Tioga Road spur',
    stopId: 'may-lake',
    coord: [-119.4912341, 37.8324607], // same pin as stop may-lake
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-mount-hoffmann.jpg', alt: 'An early photograph of Mount Hoffmann’s northeast spur above granite slabs.' },
    description:
      'Past May Lake and up scree to the park’s geographic center, with a summit view across most of the park. The last stretch is a hands-on scramble.',
  },
  {
    id: 'olmsted-point',
    title: 'Olmsted Point nature trail',
    region: 'tuolumne',
    order: 6,
    distanceMi: 0.5,
    elevationGainFt: 100,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 30,
    trailhead: 'Olmsted Point pullout, Tioga Road',
    stopId: 'olmsted-point',
    coord: [-119.4852, 37.8107], // same pin as stop olmsted-point
    season: 'Tioga Road season',
    photo: { src: '/photos/olmsted-point.jpg', alt: 'The view from Olmsted Point down Tenaya Canyon.' },
    description:
      'The short walk from the pullout to the dome’s open granite, where Half Dome’s back side and Clouds Rest fill the canyon. Short enough for a driving day.',
  },
  {
    id: 'tenaya-lake-loop',
    title: 'Tenaya Lake loop',
    region: 'tuolumne',
    order: 7,
    distanceMi: 2.5,
    elevationGainFt: 0,
    difficulty: 'easy',
    route: 'loop',
    durationMin: 90,
    trailhead: 'Tenaya Lake picnic area, northeast shore',
    stopId: 'tenaya-lake',
    coord: [-119.45188, 37.83795], // same pin as stop tenaya-lake
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-tenaya-lake-loop.jpg', alt: 'Tenaya Lake’s shore beneath a granite dome.' },
    description:
      'A flat shoreline circuit of the largest lake in Yosemite’s frontcountry, granite domes on every side. The east-end beach is the picnic spot.',
  },
  {
    id: 'sunrise-lakes',
    title: 'Sunrise Lakes',
    region: 'tuolumne',
    order: 8,
    distanceMi: 7.5,
    elevationGainFt: 1400,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 300,
    trailhead: 'Sunrise Lakes trailhead, southwest end of Tenaya Lake',
    stopId: 'clouds-rest-tenaya',
    coord: [-119.47, 37.8256], // same pin as stop clouds-rest-tenaya
    season: 'Tioga Road season',
    description:
      'One real climb out of Tenaya Canyon, then three granite-basin lakes in quick succession. Turn around at whichever one suits the day.',
  },
  {
    id: 'clouds-rest',
    title: 'Clouds Rest',
    region: 'tuolumne',
    order: 9,
    distanceMi: 14.5,
    elevationGainFt: 1775,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 480,
    trailhead: 'Sunrise Lakes trailhead, southwest end of Tenaya Lake',
    stopId: 'clouds-rest-tenaya',
    coord: [-119.47, 37.8256], // same pin as stop clouds-rest-tenaya
    season: 'Tioga Road season',
    hazard:
      'The summit ridge narrows to a few feet with long drops on both sides. Skip it in wind, in lightning weather, or when the rock is wet.',
    photo: { src: '/photos/hike-clouds-rest.jpg', alt: 'The granite flanks of Clouds Rest above forest, snow on the ridge.' },
    description:
      'The summit that looks down on Half Dome, at the end of a long but never brutal day from Tenaya Lake.',
  },
  {
    id: 'north-dome',
    title: 'North Dome',
    region: 'tuolumne',
    order: 10,
    distanceMi: 8.8,
    elevationGainFt: 1200,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 300,
    trailhead: 'Porcupine Creek trailhead, Tioga Road',
    stopId: 'north-dome-indian-rock',
    coord: [-119.5454, 37.8066], // moved 2026-09 to the Porcupine Creek trailhead (NPS, Recreation.gov, OSM)
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-north-dome.jpg', alt: 'Half Dome’s face seen from the top of North Dome.' },
    description:
      'Forest and meadow walking, then steep rock steps down onto a dome directly across from Half Dome’s face. The Indian Rock arch is a short, steep side trip.',
  },
  {
    id: 'pothole-dome',
    title: 'Pothole Dome',
    region: 'tuolumne',
    order: 11,
    distanceMi: 1.0,
    elevationGainFt: 200,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 60,
    trailhead: 'Pothole Dome pullout, west end of Tuolumne Meadows',
    stopId: 'pothole-dome-sunset',
    coord: [-119.39455, 37.87693], // TODO: verify on the ground — moved 2026-09 to the NPS Pothole Dome trailhead (the pothole-dome-sunset secret spot's pin)
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-pothole-dome.jpg', alt: 'Pothole Dome rising from the edge of Tuolumne Meadows.' },
    description:
      'Around the meadow’s edge and up easy glacier-polished granite for a view over all of Tuolumne Meadows. About ten minutes of climbing.',
  },
  {
    id: 'soda-springs-parsons-lodge',
    title: 'Soda Springs and Parsons Lodge',
    region: 'tuolumne',
    order: 12,
    distanceMi: 1.5,
    elevationGainFt: 100,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 75,
    trailhead: 'Lembert Dome lot, Tioga Road',
    stopId: 'soda-springs-parsons-lodge',
    coord: [-119.3535, 37.8774], // moved 2026-09 to the Lembert Dome lot trailhead, same as the stop
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-soda-springs-parsons-lodge.jpg', alt: 'Parsons Memorial Lodge, the stone lodge beside Soda Springs.' },
    description:
      'A flat meadow walk to naturally carbonated springs, where a campfire talk helped launch the campaign for the park, and the stone lodge the Sierra Club built beside them in 1915.',
  },
  {
    id: 'lembert-dome',
    title: 'Lembert Dome',
    region: 'tuolumne',
    order: 13,
    distanceMi: 2.8,
    elevationGainFt: 850,
    difficulty: 'moderate',
    route: 'lollipop',
    durationMin: 150,
    trailhead: 'Dog Lake lot, Tuolumne Meadows Lodge Road',
    stopId: 'lyell-canyon',
    coord: [-119.339, 37.8783], // same pin as stop lyell-canyon (Dog Lake lot)
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-lembert-dome.jpg', alt: 'Lembert Dome above Tuolumne Meadows.' },
    description:
      'Around the back of the dome and up its bare granite shoulder to the summit over Tuolumne Meadows. A common sunset spot.',
  },
  {
    id: 'dog-lake',
    title: 'Dog Lake',
    region: 'tuolumne',
    order: 14,
    distanceMi: 2.8,
    elevationGainFt: 650,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 120,
    trailhead: 'Dog Lake lot, Tuolumne Meadows Lodge Road',
    stopId: 'lyell-canyon',
    coord: [-119.339, 37.8783], // same pin as stop lyell-canyon (Dog Lake lot)
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-dog-lake.jpg', alt: 'Dog Lake with Mount Dana and Mount Gibbs on the horizon.' },
    description:
      'One stiff climb, then a warm, shallow lake with Mount Dana and Mount Gibbs on the horizon. Warm enough to swim.',
  },
  {
    id: 'elizabeth-lake',
    title: 'Elizabeth Lake',
    region: 'tuolumne',
    order: 15,
    distanceMi: 4.8,
    elevationGainFt: 900,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 180,
    trailhead: 'Tuolumne Meadows Campground, at the back of the B loop',
    coord: [-119.3554, 37.8712], // web-derived: trailhead inside the campground; TODO verify on the ground
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-elizabeth-lake.jpg', alt: 'Unicorn Peak above the meadows near Elizabeth Lake, in a 1968 park photograph.' },
    description:
      'A steady forest climb from the campground to a cirque lake under Unicorn Peak’s horn. Arrive by mid-morning for a still reflection.',
  },
  {
    id: 'cathedral-lakes',
    title: 'Cathedral Lakes',
    region: 'tuolumne',
    order: 16,
    distanceMi: 8.0,
    distanceNote: 'about the same distance to the lower lake, on a short spur',
    elevationGainFt: 1000,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 300,
    trailhead: 'Cathedral Lakes trailhead, west end of Tuolumne Meadows',
    stopId: 'cathedral-lakes',
    coord: [-119.374706, 37.872634], // same pin as stop cathedral-lakes
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-cathedral-lakes.jpg', alt: 'Cathedral Peak above a Cathedral Lake.' },
    description:
      'Up the John Muir Trail to two lakes below Cathedral Peak. Go on a weekday; the trailhead lot fills early.',
  },
  {
    id: 'glen-aulin',
    title: 'Glen Aulin and Tuolumne Falls',
    region: 'tuolumne',
    order: 17,
    distanceMi: 11.0,
    elevationGainFt: 800,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 390,
    trailhead: 'Lembert Dome lot, Tioga Road',
    stopId: 'soda-springs-parsons-lodge',
    coord: [-119.3535, 37.8774], // moved 2026-09 to the Lembert Dome lot trailhead (Recreation.gov Young Lakes via Glen Aulin)
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-glen-aulin.jpg', alt: 'White Cascade pouring into its pool at Glen Aulin.' },
    description:
      'Down the Tuolumne River past a series of cascades to the White Cascade pool at Glen Aulin camp. The grade is gentle; the mileage and the return climb are the work.',
  },
  {
    id: 'lyell-canyon',
    title: 'Lyell Canyon',
    region: 'tuolumne',
    order: 18,
    distanceMi: 8.0,
    distanceNote: 'flat the whole way; turn around anywhere up to mile 8',
    elevationGainFt: 200,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 270,
    trailhead: 'Dog Lake lot, Tuolumne Meadows Lodge Road',
    stopId: 'lyell-canyon',
    coord: [-119.339, 37.8783], // same pin as stop lyell-canyon
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-lyell-canyon.jpg', alt: 'The Lyell Fork meandering through Lyell Canyon below granite slopes.' },
    description:
      'The John Muir Trail up a dead-flat subalpine canyon, the river meandering alongside for miles. Long mileage with little climbing.',
  },
  {
    id: 'mono-pass',
    title: 'Mono Pass',
    region: 'tuolumne',
    order: 19,
    distanceMi: 8.0,
    elevationGainFt: 900,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 300,
    trailhead: 'Mono Pass trailhead, Dana Meadows',
    stopId: 'mono-pass-meadows',
    coord: [-119.2627, 37.8909], // same pin as stop mono-pass-meadows
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-mono-pass.jpg', alt: 'A meadow lake along the Mono Pass trail, peaks beyond.' },
    description:
      'The old Mono trade route to a 10,600-foot pass on the crest, past meadows, mining-cabin ruins, and a chain of lakes just over the top.',
  },
  {
    id: 'gaylor-lakes',
    title: 'Gaylor Lakes',
    region: 'tuolumne',
    order: 20,
    distanceMi: 3.0,
    elevationGainFt: 600,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 150,
    trailhead: 'Gaylor Lakes trailhead at the Tioga Pass entrance',
    stopId: 'gaylor-lake',
    coord: [-119.258173, 37.9101685], // same pin as stop gaylor-lake
    season: 'Tioga Road season',
    photo: { src: '/photos/hike-gaylor-lakes.jpg', alt: 'A Gaylor Lake half-thawed in its alpine basin.' },
    description:
      'A steep ridge climb from the entrance station, then alpine lake basins and a silver-mine site above 10,000 feet. The shortest route to alpine terrain in the park.',
  },
  {
    id: 'mount-dana',
    title: 'Mount Dana',
    region: 'tuolumne',
    order: 21,
    distanceMi: 5.8,
    elevationGainFt: 3100,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 390,
    trailhead: 'Tioga Pass entrance station',
    coord: [-119.2577, 37.9109], // web-derived: unsigned start at the Tioga Pass entrance; TODO verify on the ground
    season: 'Tioga Road season',
    hazard:
      'The summit is 13,061 feet and the route above the meadows is an unsigned use path, not a maintained trail: altitude sickness, route-finding, and afternoon lightning are the real risks. Start early and turn around if weather builds.',
    photo: { src: '/photos/hike-mount-dana.jpg', alt: 'Mount Dana under snow, in a park ranger’s winter photograph.' },
    description:
      'The park’s second-highest summit by its relentless west shoulder, with Mono Lake filling the view east. No trail junctions and no let-up.',
  },

  // --- Hetch Hetchy & Evergreen Road ---------------------------------------
  {
    id: 'lookout-point',
    title: 'Lookout Point',
    region: 'hetch-hetchy',
    order: 1,
    distanceMi: 2.8,
    elevationGainFt: 600,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 100,
    trailhead: 'Hetch Hetchy entrance station, Hetch Hetchy Road',
    stopId: 'lookout-point',
    coord: [-119.8414, 37.8933], // same pin as stop lookout-point
    description:
      'A short climb to a rocky knob that overlooks the Hetch Hetchy Valley from a distance, Wapama Falls in the view. Best in spring when the falls run hard.',
  },
  {
    id: 'wapama-falls',
    title: 'Wapama Falls',
    region: 'hetch-hetchy',
    order: 2,
    distanceMi: 5.5,
    elevationGainFt: 200,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 180,
    trailhead: 'O’Shaughnessy Dam road-end',
    stopId: 'wapama-falls-trail',
    coord: [-119.7875, 37.9465], // same pin as stop wapama-falls-trail
    hazard:
      'In big spring flow the falls flood their own footbridges. If water is running over the planks, do not cross.',
    photo: { src: '/photos/hike-wapama-falls.jpg', alt: 'The stone steps and footbridge below Wapama Falls.' },
    description:
      'Across the dam, through the tunnel, and along the reservoir to the footbridges under Wapama’s thousand-foot drop, passing wispy Tueeulala Fall on the way.',
  },
  {
    id: 'rancheria-falls',
    title: 'Rancheria Falls',
    region: 'hetch-hetchy',
    order: 3,
    distanceMi: 13.0,
    elevationGainFt: 800,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 420,
    trailhead: 'O’Shaughnessy Dam road-end',
    stopId: 'rancheria-falls',
    coord: [-119.7875, 37.9465], // same pin as stop rancheria-falls
    hazard:
      'Rattlesnake country with poison oak along the trail, largely shadeless in summer heat, and the Wapama Falls bridges en route can close in high water.',
    photo: { src: '/photos/hike-rancheria-falls.jpg', alt: 'The rapids below Rancheria Falls.' },
    description:
      'Past Wapama and on along the canyon wall to a run of slickrock cascades where day-hikers thin out. Hot by midsummer; spring is the season.',
  },
  {
    id: 'poopenaut-valley',
    title: 'Poopenaut Valley',
    region: 'hetch-hetchy',
    order: 4,
    distanceMi: 3.0,
    elevationGainFt: 1300,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 180,
    trailhead: 'Hetch Hetchy Road, signed pullout 3.9 mi past the entrance',
    coord: [-119.8146, 37.9102], // TODO: verify on the ground — moved 2026-09 to the trailhead, same as the stop
    hazard:
      'The climb out is relentless and largely shadeless and bakes by late morning; carry more water than three miles suggests. Rattlesnake country, and the river runs dam-released cold and fast. Stay out of the current.',
    photo: { src: '/photos/hike-poopenaut-valley.jpg', alt: 'Poopenaut Valley along the Tuolumne River below the dam.' },
    description:
      'One of the park’s steepest maintained miles, straight down to the Tuolumne River below the dam. Short, very steep on the way out, and rarely busy.',
  },
  {
    id: 'carlon-falls',
    title: 'Carlon Falls',
    region: 'hetch-hetchy',
    order: 5,
    distanceMi: 3.8,
    elevationGainFt: 250,
    difficulty: 'easy',
    route: 'out-and-back',
    durationMin: 150,
    trailhead: 'Carlon day-use area, Evergreen Road',
    coord: [-119.8615, 37.8143], // TODO: verify on the ground — moved 2026-09 to the Carlon trailhead, same as the stop
    description:
      'An easy river walk on the South Fork Tuolumne to a wide fall that typically runs all year, with a swimming hole at its base. Popular with locals on summer afternoons.',
  },
  {
    id: 'merced-grove',
    title: 'Merced Grove',
    region: 'hetch-hetchy',
    order: 6,
    distanceMi: 3.0,
    elevationGainFt: 600,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 130,
    trailhead: 'Merced Grove lot, Big Oak Flat Road',
    stopId: 'merced-grove',
    coord: [-119.8422, 37.763], // moved 2026-09 to the trailhead lot (OSM, Recreation.gov), same as the stop
    photo: { src: '/photos/hike-merced-grove.jpg', alt: 'Giant sequoias along the trail in the Merced Grove.' },
    description:
      'A downhill road-grade walk to the park’s smallest sequoia grove, about twenty big trees with no shuttle. The climb is on the return.',
  },
]

export const HIKES: HikeT[] = Hikes.parse(seed)
