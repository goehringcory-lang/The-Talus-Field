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
    trailhead: 'Sentinel Bridge lot, shuttle stop 11',
    stopId: 'cooks-meadow-loop',
    coord: [-119.5896, 37.7435], // same pin as stop cooks-meadow-loop
    description:
      'A flat meadow circuit with Yosemite Falls, Half Dome, and Sentinel Rock all in view at once. The best effort-to-scenery ratio in the park.',
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
    trailhead: 'Any Valley shuttle stop; Lower Yosemite Fall works well',
    coord: [-119.5966, 37.7466], // same pin as lower-yosemite-fall hike
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
    coord: [-119.6697, 37.7135], // same pin as stop artist-point
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
    description:
      'The first mile of switchbacks on the Yosemite Falls Trail, ending at a railed perch with Half Dome and Sentinel Rock across the valley. A fair sample of the big climb at a third of the price.',
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
    description:
      'The stone steps up through Vernal Fall’s spray, the most famous mile in the park. Bring a shell in spring or plan on hiking wet.',
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
    description:
      'Past Vernal Fall to the brink of its bigger sibling, then down the John Muir Trail for the Liberty Cap panorama. The best big-waterfall day the Valley offers.',
  },
  {
    id: 'upper-yosemite-fall',
    title: 'Upper Yosemite Fall',
    region: 'valley',
    order: 11,
    distanceMi: 7.6,
    distanceNote: '9.4 mi including Yosemite Point',
    elevationGainFt: 2600,
    difficulty: 'strenuous',
    route: 'out-and-back',
    durationMin: 420,
    trailhead: 'Upper Yosemite Fall trailhead at Camp 4',
    coord: [-119.6021, 37.742], // same pin as columbia-rock hike
    description:
      'Sixty-some switchbacks to the notch where the whole fall leaves the rim. Start early: the trail bakes by mid-morning and the climb earns every foot.',
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
    trailhead: 'Southside Drive west of Swinging Bridge',
    stopId: 'four-mile-trailhead',
    coord: [-119.602, 37.7339], // same pin as stop four-mile-trailhead
    season: 'Closed in snow, December to May',
    description:
      'The switchbacked climb from the Valley floor to Glacier Point, with the falls and Half Dome rearranging themselves the whole way up. Hike it one-way if someone can meet you on top.',
  },
  {
    id: 'half-dome',
    title: 'Half Dome',
    region: 'valley',
    order: 13,
    distanceMi: 14.2,
    distanceNote: 'via the Mist Trail; 16.5 mi via the John Muir Trail',
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
      'The cable route climbs bare granite at a 45-degree pitch. Do not start up if thunderstorms are forecast, and turn around if clouds build.',
    description:
      'The park’s signature endurance day: past both falls, up Sub Dome’s stairs, then the cables to the summit plateau. Twelve hours for most parties, and worth training for.',
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
    description:
      'The Yosemite Falls climb, then two more quiet miles to the highest of the Three Brothers. A Half Dome-caliber day with a fraction of the company.',
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
    description:
      'A hundred-plus switchbacks out of Tenaya Canyon to the rim across from Half Dome, on the emptiest big climb that starts on the Valley floor.',
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
    trailhead: 'McGurk Meadow lot, Glacier Point Road mile 7.5',
    stopId: 'mcgurk-meadow',
    coord: [-119.6282, 37.6705], // same pin as stop mcgurk-meadow
    season: 'Glacier Point Road season',
    description:
      'A gentle forest walk to a wildflower meadow and a collapsing sheepherder’s cabin. July is the flower show.',
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
    trailhead: 'McGurk Meadow lot, Glacier Point Road mile 7.5',
    stopId: 'mcgurk-meadow',
    coord: [-119.6282, 37.6705], // same pin as stop mcgurk-meadow
    season: 'Glacier Point Road season',
    description:
      'Through McGurk Meadow to an unrailed rim point 3,000 feet above the west Valley, looking straight across at El Capitan. The best rim view most visitors never hear about.',
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
    stopId: 'taft-point',
    coord: [-119.5861, 37.7124], // same pin as stop taft-point
    hazard:
      'The point and the fissures are unrailed drops of over 2,000 feet. Keep children in hand.',
    description:
      'An easy walk to deep slots in the rim and a railing-free ledge hanging over the Valley. Vertigo as a destination.',
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
    stopId: 'sentinel-dome',
    coord: [-119.5861, 37.7124], // shared lot; the linked stop pins the summit
    description:
      'The easiest 360-degree summit in the park: a gradual walk, then a short scramble up the dome’s shoulder to a full-circle view from Half Dome to the coast ranges.',
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
    stopId: 'taft-point',
    coord: [-119.5861, 37.7124], // same pin as stop taft-point
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
    stopId: 'glacier-point',
    coord: [-119.5731, 37.7283], // same pin as stop glacier-point
    description:
      'The first leg of the Panorama Trail, dropping to the footbridge above the fall almost nobody visits. The climb is all on the way back.',
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
    stopId: 'glacier-point',
    coord: [-119.5731, 37.7283], // same pin as stop glacier-point
    description:
      'Off the rim past Illilouette, Nevada, and Vernal Falls with Half Dome turning in view the whole way. Mostly downhill, but the miles and one real climb still count.',
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
    stopId: 'glacier-point',
    coord: [-119.5731, 37.7283], // same pin as stop glacier-point
    description:
      'The south rim end to end: Sentinel Dome, Taft Point, and Dewey, Crocker, and Stanford Points strung on one long, quiet day. Needs a car at each end.',
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
    coord: [-119.5946, 37.6764], // web-derived: Mono Meadow trailhead pullout; TODO verify on the ground
    season: 'Glacier Point Road season',
    description:
      'Down through firs to a boggy meadow, then on to an opening with a clear shot of Mount Starr King and the Clark Range. Expect wet feet early in the season.',
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
    description:
      'A long, even-tempered walk through lodgepole and old burns to a granite-bowled lake under Horse Ridge. Solitude is the point.',
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
    coord: [-119.6567, 37.5359], // same pin as stop wawona-meadow-loop
    description:
      'A flat lap of the meadow behind the Wawona Hotel on an old road grade. Spring wildflowers, big pines, and almost never another party.',
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
    trailhead: 'Forest Drive road-end, Wawona',
    coord: [-119.6428, 37.5443], // web-derived: Forest Dr road-end above the South Fork; TODO verify on the ground
    description:
      'An easy walk up the South Fork of the Merced to a bouncing footbridge over granite pools. The swimming holes below it are Wawona’s summer secret.',
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
    stopId: 'mariposa-grove',
    coord: [-119.632, 37.5085], // same pin as stop mariposa-grove (Welcome Plaza)
    description:
      'The lower grove’s greatest hits: the Fallen Monarch, the Bachelor and Three Graces, the 3,000-year-old Grizzly Giant, and the California Tunnel Tree.',
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
    stopId: 'mariposa-grove',
    coord: [-119.632, 37.5085], // same pin as stop mariposa-grove (Welcome Plaza)
    description:
      'Past the Grizzly Giant and on into the upper grove, where the sequoias keep going and the people do not. Wawona Point’s overlook is the turnaround bonus.',
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
    coord: [-119.8058, 37.7614], // web-derived: Tuolumne Grove lot, Tioga Rd at Crane Flat; TODO verify on the ground
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
    coord: [-119.6119, 37.8552], // web-derived: Lukens Lake TH pullout on Tioga Rd; TODO verify on the ground
    season: 'Tioga Road season',
    description:
      'A short hop over a forested rise to a shallow lake rimmed by one of the park’s best July flower meadows. An ideal first high-country leg-stretcher.',
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
      'A nearly flat walk on old roadbed from White Wolf to a warm little lake that actually invites swimming by August. Wildflowers line the sandy stretches in early summer.',
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
    description:
      'A short granite-benched climb to a High Sierra Camp lake sitting under Mount Hoffmann’s wall. High-country payoff at day-hike-with-kids effort.',
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
    description:
      'Past May Lake and up scree to the park’s geographic center, with a summit view that inventories the whole map. The last stretch is a hands-on scramble.',
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
    description:
      'The short walk from the pullout to the dome’s open granite, where Half Dome’s back side and Clouds Rest fill the canyon. Worth doing even on a driving day.',
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
    description:
      'A flat shoreline circuit of the high country’s biggest lake, granite domes on every side. The south-shore beach is the picnic spot.',
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
      'The summit ridge narrows to a few feet with long drops on both sides. Skip it in wind or lightning weather.',
    description:
      'The summit that looks down on Half Dome, at the end of a long but never brutal day from Tenaya Lake. Many who have done both call it the better hike.',
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
    coord: [-119.5477, 37.8106], // same pin as stop north-dome-indian-rock
    season: 'Tioga Road season',
    description:
      'A mostly gentle rim walk ending on a dome directly across from Half Dome’s face, the best straight-on view there is. The Indian Rock arch is a short side trip.',
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
    coord: [-119.3878, 37.8763], // web-derived: west-meadow pullout; TODO verify on the ground
    season: 'Tioga Road season',
    description:
      'Around the meadow’s edge and up easy glacier-polished granite for the full sweep of Tuolumne Meadows. Ten minutes of climbing, an hour of wanting to stay.',
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
    coord: [-119.3512, 37.8776], // same pin as stop soda-springs-parsons-lodge
    season: 'Tioga Road season',
    description:
      'A flat meadow walk to naturally carbonated springs and the stone Sierra Club lodge where the national park idea got argued into shape.',
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
    description:
      'Around the back of the dome and up its bare granite shoulder to the summit over Tuolumne Meadows. The classic high-country sunset perch.',
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
    description:
      'One stiff climb, then a warm, shallow lake with Mount Dana and Mount Gibbs on the horizon. The high country’s most swimmable water.',
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
    trailhead: 'Tuolumne Meadows Campground, near the group loop',
    coord: [-119.3554, 37.8712], // web-derived: trailhead inside the campground; TODO verify on the ground
    season: 'Tioga Road season',
    description:
      'A steady forest climb from the campground to a cirque lake under Unicorn Peak’s horn. Arrive by mid-morning and the reflection is glass.',
  },
  {
    id: 'cathedral-lakes',
    title: 'Cathedral Lakes',
    region: 'tuolumne',
    order: 16,
    distanceMi: 8.0,
    distanceNote: '7 mi turning around at the lower lake',
    elevationGainFt: 1000,
    difficulty: 'moderate',
    route: 'out-and-back',
    durationMin: 300,
    trailhead: 'Cathedral Lakes trailhead, west end of Tuolumne Meadows',
    stopId: 'cathedral-lakes',
    coord: [-119.374706, 37.872634], // same pin as stop cathedral-lakes
    season: 'Tioga Road season',
    description:
      'Up the John Muir Trail to two lakes arranged around Cathedral Peak’s spire, the high country’s signature postcard. Go on a weekday if you can.',
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
    coord: [-119.3512, 37.8776], // same pin as stop soda-springs-parsons-lodge
    season: 'Tioga Road season',
    description:
      'Down the Tuolumne River past a parade of cascades to the White Cascade pool at Glen Aulin camp. The grade is gentle; the mileage and the return climb are the work.',
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
    description:
      'The John Muir Trail up a dead-flat subalpine canyon, the river meandering alongside for miles. The rare big-mileage day with no climbing bill.',
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
    description:
      'One breathless ridge straight from the entrance station, then alpine lake basins and a silver-mine ghost site above 10,000 feet. The fastest route to true alpine country in the park.',
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
      'The summit is 13,061 feet: altitude sickness and afternoon lightning are the real risks. Start early and turn around if weather builds.',
    description:
      'The park’s second-highest summit by its relentless west shoulder, with Mono Lake filling the view east. No trail junctions, no mercy, no regrets.',
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
    trailhead: 'Mather entrance station, Hetch Hetchy Road',
    stopId: 'lookout-point',
    coord: [-119.8414, 37.8933], // same pin as stop lookout-point
    description:
      'A short climb to a knob with the whole Hetch Hetchy Valley in one frame, Wapama and Tueeulala Falls included. Best in spring when both falls run hard.',
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
    description:
      'Past Wapama and on along the canyon wall to a run of slickrock cascades where the day-hikers thin to nobody. Hot by midsummer; spring is the season.',
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
    coord: [-119.8037, 37.9182], // web-derived: signed pullout on Hetch Hetchy Rd; TODO verify on the ground
    description:
      'The park’s steepest maintained mile, straight down to the Tuolumne River below the dam. Short, brutal on the way out, and utterly empty.',
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
    coord: [-119.859, 37.8125], // web-derived: Carlon day-use bridge on Evergreen Rd; TODO verify on the ground
    description:
      'An easy river walk on the South Fork Tuolumne to a wide year-round fall with a swimming hole at its base. The locals’ summer afternoon.',
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
    coord: [-119.8461, 37.7566], // same pin as stop merced-grove
    description:
      'A downhill road-grade walk to the park’s smallest and quietest sequoia grove, twenty-some big trees with no shuttle and no crowd. Save something for the climb out.',
  },
]

export const HIKES: HikeT[] = Hikes.parse(seed)
