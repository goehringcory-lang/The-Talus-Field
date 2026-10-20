// =============================================================================
// The backpacking trips (/backpacking, /backpacking/:id, the map's Backpacking
// tab). Ten overnight routes in the order to work up through them, from the
// park's shortest backpacking trip to four days down the Grand Canyon of the
// Tuolumne.
//
// Research pass: October 19, 2026. Every coordinate carries its source on its
// line: OpenStreetMap (Overpass, queried that day), USGS GNIS and 3DEP
// (epqs.nationalmap.gov), the NPS Wilderness Trailheads map, or a named field
// GPS where nothing official places the camp. Figures are the park's
// published ones, and the route generator (scripts/gen-backpacking-routes.ts)
// re-measures each trip over USGS/NPS trail linework and fails the trip if a
// camp or water source sits off its route (scripts/data/
// backpacking-routes-report.md). Permit names and quotas are Recreation.gov's
// (permit 445859) and the NPS trailhead list (May 11, 2026).
//
// Three rules for anyone editing this file.
//   - A camp is either a designated backpackers' camp, or the commonly used
//     area where the 4-mile, 1-mile and 100-foot rules allow camping, with the
//     rule stated. Never a spot the regulations exclude.
//   - Water coordinates are where the trail meets the water, not a lake's
//     centre, and "reliable" means it carries water through a normal August.
//     High Sierra Camp taps are never listed: nothing from the park says they
//     serve backpackers.
//   - No live conditions here (a road status, a fire closure, this year's
//     camp opening): those age in weeks. Say where to check instead.
// =============================================================================

import { BackpackTrips, type BackpackTripT } from './schema'

const RECGOV = 'https://www.recreation.gov/permits/445859'
const NPS_TRAILHEADS = 'https://www.nps.gov/yose/planyourvisit/trailheads.htm'
const NPS_WILDREGS = 'https://www.nps.gov/yose/planyourvisit/wildregs.htm'

const seed: BackpackTripT[] = [
  // --- 1. May Lake -----------------------------------------------------------
  {
    id: 'may-lake-overnight',
    title: 'May Lake',
    region: 'tuolumne',
    order: 1,
    level: 'first-trip',
    nightsMin: 1,
    nightsMax: 1,
    route: 'out-and-back',
    distanceMi: 2.4, // NPS May Lake Trailhead page
    elevationGainFt: 485, // NPS May Lake Trailhead page; 3DEP along the trail: 483
    highPointFt: 9330, // USGS 3DEP at the backpackers' camp
    season: 'Tioga Road season',
    teaser: 'The park’s shortest backpacking trip: a mile up granite to a lake under Mount Hoffmann.',
    description:
      'A little over a mile of steady climbing through forest and across granite slabs, with Half Dome and Clouds Rest behind you, to May Lake at the foot of Mount Hoffmann. The park calls it its shortest backpacking trip, and it is the one to learn the permit, the canister and a cold night on before committing to anything longer.',
    permit: {
      trailhead: 'May Lake',
      quota: 25,
      note:
        'Within a mile of May Lake you must sleep in the High Sierra Camp’s backpackers’ campground. If Tioga Road is closed on the permit date the permit is not valid and is not refunded.',
    },
    trailhead: {
      name: 'May Lake Trailhead, end of the May Lake road',
      coord: [-119.49111, 37.83281], // OSM: where the May Lake Trail leaves the lot (Recreation.gov division point 30 m away)
      parking:
        'The lot at the end of the narrow, rough May Lake road, about 1.75 miles north of Tioga Road; vault toilet. Early in summer the road can still be closed, which adds 1.75 miles each way on foot.',
    },
    days: [
      {
        from: 'May Lake Trailhead',
        to: 'May Lake',
        campId: 'may-lake-bp',
        summary:
          'A steady climb through red fir and over granite slabs to the lake’s southeast corner, where the trail meets the Glen Aulin trail beside the backpackers’ camp. There is no water on the way up; carry what you will drink.',
      },
      {
        from: 'May Lake',
        to: 'May Lake Trailhead',
        campId: null,
        summary:
          'The same way down, all of it downhill. An unmarked climbers’ path from the lake’s west side continues to the summit of Mount Hoffmann, the park’s geographic centre, for anyone with a morning to spend.',
      },
    ],
    camps: [
      {
        id: 'may-lake-bp',
        name: 'May Lake backpackers’ campground',
        kind: 'designated',
        // Steve Eckert's GPS of the backpackers' bear boxes (climber.org YE05,
        // 2004), matching OSM's camp toilet and the NPS trailheads map's camp
        // point; no agency coordinate exists. About 50 m either way.
        coord: [-119.49123, 37.84439],
        elevFt: 9326, // USGS 3DEP
        facilities: 'Bear boxes south of the High Sierra Camp buildings; a communal fire ring; a flush toilet may be open in season',
        rules:
          'Required within a mile of the High Sierra Camp, and the reason May Lake is legal so close to a road. Use the backpackers’ bear boxes, not the ones among the camp’s buildings, which are for its guests. Fires only in the communal ring, and only when no restriction is in force.',
      },
    ],
    water: [
      {
        id: 'may-lake-water',
        name: 'May Lake',
        kind: 'lake',
        coord: [-119.49163, 37.84507], // OSM lake outline: the shore nearest the camp
        reliability: 'reliable',
        note: 'The only water on the trip: the trail crosses no stream.',
      },
    ],
    hazards: [
      'Camp sits at about 9,300 feet. Expect a night near freezing even in August, and a headache on the first evening if you drove up from sea level that morning.',
      'Overnight parking at the trailhead ends on October 15, and Tioga Road closes for the winter after the first real snow.',
    ],
    hikeId: 'may-lake',
    sources: [
      { label: 'NPS: May Lake Trailhead', url: 'https://www.nps.gov/places/000/may-lake-trailhead.htm' },
      { label: 'NPS: Tioga Road backpacking trails', url: 'https://www.nps.gov/yose/planyourvisit/tioga-road-backpacking-trails.htm' },
      { label: 'NPS: Wilderness trailheads and quotas', url: NPS_TRAILHEADS },
      { label: 'NPS: Wilderness regulations', url: NPS_WILDREGS },
      { label: 'Recreation.gov: Yosemite wilderness permits', url: RECGOV },
    ],
    photo: { src: '/photos/hike-may-lake.jpg', alt: 'May Lake’s clear water against granite and pines.' },
  },
  // --- 2. Glen Aulin and the Grand Canyon of the Tuolumne --------------------
  {
    id: 'glen-aulin-waterwheel',
    title: 'Glen Aulin and Waterwheel Falls',
    region: 'tuolumne',
    order: 2,
    level: 'first-trip',
    nightsMin: 1,
    nightsMax: 2,
    route: 'out-and-back',
    distanceMi: 19, // NPS Tuolumne Meadows hikes: Glen Aulin, then 4 mi on to Waterwheel Falls, 19 mi in all
    elevationGainFt: 1850, // NPS Tuolumne backpacking trails: Waterwheel Falls round trip
    highPointFt: 8655, // USGS 3DEP, the trail above Lembert Dome parking
    season: 'Tioga Road season',
    teaser: 'Down the Tuolumne past three waterfalls to a camp at the head of its Grand Canyon.',
    description:
      'The Pacific Crest Trail follows the Tuolumne River out of the meadows, across two creeks and two footbridges, past Tuolumne Falls and White Cascade to the Glen Aulin High Sierra Camp. A second night farther down the canyon puts California, Le Conte and Waterwheel falls within an evening’s walk. It drops going in, so the climbing comes on the way out.',
    permit: {
      trailhead: 'Glen Aulin',
      quota: 25,
      note:
        'On a Glen Aulin permit the first night must be at the Glen Aulin backpackers’ campground; later nights may be farther on. To sleep beyond Glen Aulin on the first night, apply for "Glen Aulin->Cold Canyon/Waterwheel (pass through)" (20 a day) instead. Whether a second night at Glen Aulin itself is allowed is not stated by the park: ask when you collect the permit.',
    },
    trailhead: {
      name: 'Lembert Dome parking, Tioga Road',
      coord: [-119.3535, 37.87729], // OSM parking way 36808906; the NPS trailhead list says park here
      parking:
        'The park’s trailhead list says to park at Lembert Dome. The trail leaves along the stables road and becomes the old road west past Soda Springs.',
    },
    days: [
      {
        from: 'Lembert Dome',
        to: 'Glen Aulin',
        campId: 'glen-aulin-bp',
        summary:
          'West past Soda Springs, then the Pacific Crest Trail northwest across Delaney and Dingley creeks, both unbridged, and past the Young Lakes junction to the river. A footbridge crosses the Tuolumne; granite steps drop past Tuolumne Falls, a second bridge recrosses at White Cascade, and the Conness Creek bridge leads into camp.',
      },
      {
        from: 'Glen Aulin',
        to: 'Waterwheel Falls',
        campId: 'waterwheel-zone',
        summary:
          'A short morning down the Grand Canyon of the Tuolumne, the river beside the trail all the way, past California Falls and Le Conte Falls. Camping is legal from California Falls on, more than a mile below the High Sierra Camp; the camp here is the used ground near Waterwheel Falls, whose plumes throw arcs of water in early summer.',
      },
      {
        from: 'Waterwheel Falls',
        to: 'Lembert Dome',
        campId: null,
        summary:
          'The long day: back up the canyon past Glen Aulin and out the way you came, with nearly all of the trip’s climbing ahead of you. Start early, fill up at the river before White Cascade, and expect the last two miles across the meadows to feel longer than they are.',
      },
    ],
    camps: [
      {
        id: 'glen-aulin-bp',
        name: 'Glen Aulin backpackers’ campground',
        kind: 'designated',
        // Peter Labarba's GPS of the backpackers' bear boxes (climber.org YE06,
        // 2001), within 10 m of OSM's camp toilet (way 976027827); no agency
        // coordinate exists. About 50 m either way.
        coord: [-119.41774, 37.91011],
        elevFt: 7884, // USGS 3DEP
        facilities: 'Bear lockers, a toilet, communal fire rings; sites run uphill behind the camp buildings',
        rules:
          'Required for the first night on a Glen Aulin permit, and within a mile of the High Sierra Camp. Fires only in the communal rings and only when no restriction is in force. This is the Tuolumne watershed: wash and go to the toilet at least 300 feet from water.',
      },
      {
        id: 'waterwheel-zone',
        name: 'Near Waterwheel Falls',
        kind: 'zone',
        coord: [-119.45879, 37.92773], // OSM: the trail at Waterwheel Falls, the downstream end of the zone measured from California Falls
        elevFt: 6789, // USGS 3DEP (epqs.nationalmap.gov) at the coordinate
        facilities: 'None: carry a canister',
        rules:
          'Legal from a second night on a Glen Aulin permit, or the first on the pass-through permit. California Falls, where this reach begins, is more than a mile below the High Sierra Camp and far past the four-mile rule. Use a site that has been camped on, at least 100 feet from the river and the trail; 300 feet from water for washing and waste.',
      },
    ],
    water: [
      {
        id: 'ga-soda-springs-river',
        name: 'Tuolumne River by Soda Springs',
        kind: 'river',
        coord: [-119.36329, 37.87904], // OSM: the trail about 55 m from the river
        reliability: 'reliable',
        note: 'Soda Springs itself is a carbonated spring in a log enclosure, not a place to fill up.',
      },
      {
        id: 'delaney-creek',
        name: 'Delaney Creek',
        kind: 'creek',
        coord: [-119.37734, 37.88492], // OSM ford node; GNIS Delaney Creek 266636
        reliability: 'seasonal',
        note: 'An unbridged crossing, high and cold in June; it can run low by late summer.',
      },
      {
        id: 'dingley-creek',
        name: 'Dingley Creek',
        kind: 'creek',
        coord: [-119.39558, 37.89726], // OSM ford node; GNIS Dingley Creek 259376
        reliability: 'seasonal',
        note: 'Unbridged; the river is a few steps off the trail just beyond it.',
      },
      {
        id: 'ga-river-corridor',
        name: 'Tuolumne River, beside the trail',
        kind: 'river',
        coord: [-119.39766, 37.89879], // OSM: the trail within 35 m of the river
        reliability: 'reliable',
        note: 'From here to camp the river is rarely more than a few hundred feet away. Never fill or wade above Tuolumne Falls or White Cascade.',
      },
      {
        id: 'white-cascade',
        name: 'White Cascade and Conness Creek, at camp',
        kind: 'river',
        coord: [-119.42036, 37.90916], // OSM: the White Cascade footbridge
        reliability: 'reliable',
        note: 'Glen Aulin’s water. Treat it; nothing from the park offers the High Sierra Camp’s tap to backpackers.',
      },
      {
        id: 'grand-canyon-river',
        name: 'Tuolumne River, Grand Canyon',
        kind: 'river',
        coord: [-119.43168, 37.91432], // OSM: the trail below Glen Aulin, within 30 to 160 m of the river
        reliability: 'reliable',
        note: 'Below Glen Aulin the trail keeps to the river all the way to Waterwheel Falls.',
      },
      {
        id: 'waterwheel-river',
        name: 'Tuolumne River at Waterwheel Falls',
        kind: 'river',
        coord: [-119.45879, 37.92773], // OSM: the trail at Waterwheel Falls, beside the river
        reliability: 'reliable',
        note: 'The camp\u2019s water. Fill well away from the falls\u2019 brink.',
      },
    ],
    hazards: [
      'The park warns of several unbridged creek crossings that run high, cold and fast early in the season: cross where it is safe or turn back.',
      'Bears here have taken food from backpackers. Every scented thing goes in the canister, and the canister stays near you.',
      'Keep out of the river above every fall and cascade; the current below Tuolumne Falls and at White Cascade is strong even when the surface looks calm.',
      'Overnight parking ends on October 15, and a permit is void if Tioga Road is closed on its date.',
    ],
    hikeId: 'glen-aulin',
    sources: [
      { label: 'NPS: Glen Aulin Trailhead', url: 'https://www.nps.gov/places/000/glen-aulin-trailhead.htm' },
      { label: 'NPS: Tuolumne Meadows hikes', url: 'https://www.nps.gov/yose/planyourvisit/tmhikes.htm' },
      { label: 'NPS: Wilderness trailheads and quotas', url: NPS_TRAILHEADS },
      { label: 'NPS: Wilderness regulations', url: NPS_WILDREGS },
      { label: 'Recreation.gov: Yosemite wilderness permits', url: RECGOV },
    ],
  },
  // --- Ostrander Lake ---------------------------------------------------------
  {
    id: 'ostrander-lake',
    title: 'Ostrander Lake',
    region: 'glacier-mariposa',
    order: 3,
    level: 'first-trip',
    nightsMin: 1,
    nightsMax: 1,
    route: 'out-and-back',
    distanceMi: 12, // NPS Ostrander Lake Trailhead page and glacierhikes.htm (OSM measures 12.2)
    elevationGainFt: 1500, // NPS Ostrander Lake Trailhead page
    highPointFt: 8600, // USGS 3DEP: the shoulder above the lake
    season: 'Glacier Point Road season',
    teaser: 'Six miles from Glacier Point Road to a granite bowl under Horse Ridge, and the park’s stone ski hut.',
    description:
      'The trail runs nearly flat through lodgepole pine and an old burn past Lost Bear Meadow, then climbs steadily to a shoulder near 8,600 feet and drops a short way to Ostrander Lake, held in a bowl under Horse Ridge with the stone Ostrander Ski Hut on its north shore. It is the one trip on this list south of the Valley, and a first overnight that asks for a full day of walking.',
    permit: {
      trailhead: 'Ostrander (Lost Bear Meadow)',
      quota: 25,
      note:
        'Recreation.gov’s rule for this trailhead: hike at least one air mile south of Glacier Point Road and a mile and a half from the trailhead before camping. Half Dome cannot be added to this permit. A permit is void, and not refunded, if Glacier Point Road is closed on its date.',
    },
    trailhead: {
      name: 'Ostrander Lake Trailhead, Glacier Point Road',
      coord: [-119.6039, 37.6668], // OSM parking and guidepost within 25 m; Recreation.gov division point 45 m away
      parking:
        'The trailhead lot on the south side of Glacier Point Road, with a vault toilet and food lockers but no drinking water. Overnight parking anywhere on the road ends on October 15.',
    },
    days: [
      {
        from: 'Ostrander Lake Trailhead',
        to: 'Ostrander Lake',
        campId: 'ostrander-zone',
        summary:
          'Two and a half nearly level miles past Lost Bear Meadow, then the climb: from about mile 2.7 the trail rises through open, unshaded burn to the shoulder near 8,600 feet before a short drop to the lake. After the creeks of the first mile there is no water you can count on until the lake, so leave the car with full bottles.',
      },
      {
        from: 'Ostrander Lake',
        to: 'Ostrander Lake Trailhead',
        campId: null,
        summary: 'The same way out, a short climb to the shoulder and then almost all downhill.',
      },
    ],
    camps: [
      {
        id: 'ostrander-zone',
        name: 'Ostrander Lake',
        kind: 'zone',
        coord: [-119.54975, 37.62678], // OSM: where the trail reaches the north shore, by the ski hut
        elevFt: 8517, // USGS 3DEP at the lake
        facilities: 'None in summer: no lockers, toilet or piped water. The ski hut is a winter hut, reserved through Yosemite Conservancy.',
        rules:
          'Legal: more than six trail miles in and well over a mile from any road. Use an established site at least 100 feet from the shore and the trail; reports place the usual sites on the west and southwest sides, which this guide has not checked. Canister required.',
      },
    ],
    water: [
      {
        id: 'ostrander-start-streams',
        name: 'Creeks near the start',
        kind: 'creek',
        coord: [-119.60267, 37.6625], // OSM/USGS NHD: the first of two crossings, about a third of a mile in
        reliability: 'seasonal',
        note: 'Two small crossings in the first half mile, mapped as perennial; expect little or nothing late in summer.',
      },
      {
        id: 'ostrander-lake-water',
        name: 'Ostrander Lake',
        kind: 'lake',
        coord: [-119.54975, 37.62678], // OSM: the north shore at the trail's end
        reliability: 'reliable',
        note: 'The source of Bridalveil Creek, and the only water you can count on after the first mile.',
      },
    ],
    hazards: [
      'In October 2026 the Dome Fire closed this trail and everything south of Glacier Point Road. When it reopens, burned stretches carry falling trees and hollow stump holes: read the park’s closures page before you plan.',
      'The fourth and fifth miles cross old burn with little shade; start the climb early on a hot day.',
      'Overnight parking on Glacier Point Road ends on October 15, and the road closes to cars for the winter.',
    ],
    hikeId: 'ostrander-lake',
    sources: [
      { label: 'NPS: Ostrander Lake Trailhead', url: 'https://www.nps.gov/places/000/ostrander-lake-trailhead.htm' },
      { label: 'NPS: Wawona and Glacier Point backpacking trails', url: 'https://www.nps.gov/yose/planyourvisit/wawona-backpacking-trails.htm' },
      { label: 'NPS: Closures', url: 'https://www.nps.gov/yose/learn/management/closures.htm' },
      { label: 'NPS: Wilderness trailheads and quotas', url: NPS_TRAILHEADS },
      { label: 'Recreation.gov: Yosemite wilderness permits', url: RECGOV },
    ],
  },

  // --- Little Yosemite Valley and Half Dome ---------------------------------
  {
    id: 'little-yosemite-half-dome',
    title: 'Little Yosemite Valley and Half Dome',
    region: 'valley',
    order: 5,
    level: 'moderate',
    nightsMin: 1,
    nightsMax: 2,
    route: 'lollipop',
    // Measured, not published: NPS prints only the day-hike totals (14 to
    // 16.4 mi with the summit). Mist Trail up 3.75 mi, John Muir Trail down
    // 4.85 mi, over OSM linework with 3DEP gain (research pass, Oct 2026).
    distanceMi: 8.6,
    elevationGainFt: 2420,
    highPointFt: 6120, // the main route tops out at camp; the summit (8,839 ft) is the side trip
    season: 'Cables up late May to mid-October',
    teaser: 'Up the Mist Trail to the river camp under Half Dome, and the summit without a pack.',
    description:
      'The Mist Trail climbs past Vernal and Nevada falls to Little Yosemite Valley, a flat, pine-shaded stretch of the Merced with the park’s busiest backpackers’ campground. From there Half Dome is a day without a pack: three and a half miles up the John Muir and Half Dome trails to the cables. The walk out takes the John Muir Trail past Clark Point, kinder to the knees than the Mist Trail’s wet steps.',
    permit: {
      trailhead: 'Happy Isles->Little Yosemite Valley (No Donohue Pass)',
      quota: 25,
      note:
        'The first night must be at the Little Yosemite Valley campground. Half Dome can be added to this permit: about 75 backpackers a day, $10 a person, paid when the permit is issued and valid for the permit’s dates. Do not apply for "Happy Isles->Past LYV": that quota is for parties camping beyond the valley and cannot sleep there.',
    },
    trailhead: {
      name: 'Happy Isles, Valley shuttle stop 16',
      coord: [-119.558, 37.7322], // Recreation.gov division point 2 m away; same pin as the Mist Trail stop
      parking:
        'There is no parking at Happy Isles. Backpackers park in the wilderness trailhead lot past Curry Village, half a mile away, and ride the free Valley shuttle to stop 16 or walk the closed road. Drinking water and flush toilets at the shuttle stop.',
    },
    days: [
      {
        from: 'Happy Isles',
        to: 'Little Yosemite Valley',
        campId: 'lyv-camp',
        summary:
          'Up the Mist Trail: the Vernal Fall footbridge, the granite staircase beside the fall, Emerald Pool, then the climb beside Nevada Fall to the junction above its brink. The last mile is a level walk along the Merced into camp. Fill up at the footbridge fountain; above it, every drop comes from the river and needs treating.',
      },
      {
        from: 'Little Yosemite Valley',
        to: 'Little Yosemite Valley',
        campId: 'lyv-camp',
        sideTripId: 'half-dome-summit',
        summary:
          'Summit day, the tent left standing. Up the John Muir Trail to the Half Dome junction, then the Half Dome Trail and Sub Dome’s steps to the cables. Start at first light, be off the dome before the afternoon clouds build, and carry all your water: the Merced at camp is the last reliable source.',
      },
      {
        from: 'Little Yosemite Valley',
        to: 'Happy Isles',
        campId: null,
        summary:
          'Out by the John Muir Trail: across the Nevada Fall footbridge, along the cliff to Clark Point, and down the long switchbacks to the Vernal Fall footbridge and Happy Isles. On a one-night trip this follows the summit on day two, eleven-odd miles in all.',
      },
    ],
    camps: [
      {
        id: 'lyv-camp',
        name: 'Little Yosemite Valley campground',
        kind: 'designated',
        coord: [-119.51453, 37.73295], // OSM: the backpackers' campground; toilets building at [-119.51545, 37.7334]
        elevFt: 6120, // USGS 3DEP
        facilities: 'Composting toilets, communal bear lockers, two communal fire rings; no drinking water',
        rules:
          'Required for the first night, and the only legal camping between Happy Isles and the Half Dome and Sunrise junctions. No check-in; a tent may stay up while you climb Half Dome. Bears here have taken backpackers’ food: lockers or the canister, nothing left out. Fires only in the communal rings, dead and down wood only, and only when no restriction is in force.',
      },
    ],
    water: [
      {
        id: 'happy-isles-tap',
        name: 'Happy Isles drinking water',
        kind: 'tap',
        coord: [-119.55967, 37.7323], // NPS: drinking water at the shuttle stop
        reliability: 'reliable',
        note: 'Treated water at the trailhead.',
      },
      {
        id: 'vernal-footbridge-tap',
        name: 'Vernal Fall footbridge fountain',
        kind: 'tap',
        coord: [-119.55135, 37.72578], // OSM; NPS vernalnevadatrail.htm
        reliability: 'seasonal',
        note: 'Treated water, May to October only. The last tap on the trail.',
      },
      {
        id: 'merced-lyv',
        name: 'Merced River at Little Yosemite Valley',
        kind: 'river',
        coord: [-119.51378, 37.73195], // OSM: the river about 130 m south of camp
        reliability: 'reliable',
        note: 'The camp’s only water, and the last before Half Dome: the park suggests a gallon a person for the summit.',
      },
      {
        id: 'merced-nevada-bridge',
        name: 'Merced River at the Nevada Fall footbridge',
        kind: 'river',
        coord: [-119.5331, 37.7248], // OSM: the John Muir Trail's footbridge
        reliability: 'reliable',
        note: 'On the way out. Fill well upstream of the brink and away from the current.',
      },
    ],
    sideTrips: [
      {
        id: 'half-dome-summit',
        name: 'Half Dome',
        note:
          'The cables are up from the Friday before Memorial Day to the day after the second Monday in October, conditions permitting, and the summit needs the Half Dome add-on to your permit. The mapped trail ends at the foot of the cables; the last 400 feet are the cables themselves on bare granite at about 45 degrees. Never go up wet rock or with storms forecast.',
      },
    ],
    hazards: [
      'Nearly every fatal fall from Half Dome happened on wet rock. Turn around for rain, a forecast storm, or clouds building over the dome.',
      'Emerald Pool and the Silver Apron are closed to entry: the current above Vernal and Nevada falls is lethal.',
      'The Mist Trail’s granite steps are soaked and slick in spring and early summer, and crowded on any weekend.',
      'In winter the lower Mist Trail and the John Muir Trail between Clark Point and the top of Nevada Fall close for ice and rockfall.',
    ],
    hikeId: 'half-dome',
    sources: [
      { label: 'NPS: Little Yosemite Valley', url: 'https://www.nps.gov/yose/planyourvisit/lyv.htm' },
      { label: 'NPS: Half Dome', url: 'https://www.nps.gov/yose/planyourvisit/halfdome.htm' },
      { label: 'NPS: Half Dome permits for backpackers', url: 'https://www.nps.gov/yose/planyourvisit/hdwildpermits.htm' },
      { label: 'NPS: Wilderness trailheads and quotas', url: NPS_TRAILHEADS },
      { label: 'Recreation.gov: Yosemite wilderness permits', url: RECGOV },
    ],
    photo: { src: '/photos/hike-half-dome.jpg', alt: 'The Half Dome cables running up the dome’s bare shoulder.' },
  },
  // --- Young Lakes --------------------------------------------------------------
  {
    id: 'young-lakes',
    title: 'Young Lakes',
    region: 'tuolumne',
    order: 4,
    level: 'moderate',
    nightsMin: 1,
    nightsMax: 2,
    route: 'lollipop',
    distanceMi: 13.6, // NPS Tuolumne Meadows backpacking trails (OSM measures 13.0)
    // Measured: USGS 3DEP along the OSM loop. The park's 1,300 ft is the net
    // rise from the car to Lower Young Lake, not the climbing.
    elevationGainFt: 2400,
    highPointFt: 10064, // USGS 3DEP: the shoulder on the Dog Lake branch
    season: 'Tioga Road season',
    teaser: 'A loop to three lakes stacked under Ragged Peak, in by Dog Lake and out by the river.',
    description:
      'In by Dog Lake, over a shoulder past 10,000 feet, to Lower Young Lake under the wall of Ragged Peak, and out the next day down the long Young Lakes Trail and the Pacific Crest Trail past Soda Springs. Middle and Upper Young Lake sit a little higher on an informal path. Campfires are banned here, and nights at almost 10,000 feet are cold.',
    permit: {
      trailhead: 'Young Lakes via Dog Lake',
      quota: 20,
      note:
        'The permit fixes the trail you start on. In by Dog Lake (20 a day) is easier to win than in by the Glen Aulin trail (10 a day, "Young Lakes via Glen Aulin Trail"), which walks this loop the other way. Camp at least four trail miles from Tuolumne Meadows; no campfires at Young Lakes or anywhere above 9,600 feet.',
    },
    trailhead: {
      name: 'Lembert Dome parking, Tioga Road',
      coord: [-119.35358, 37.87744], // OSM node 'Young Lakes Trailhead'; Recreation.gov division point 5 m away
      parking:
        'Lembert Dome parking, north of Tioga Road; the Dog Lake trail can also start from the Dog Lake lot up the lodge road. No tap confirmed at either: fill up in Tuolumne Meadows.',
    },
    days: [
      {
        from: 'Lembert Dome',
        to: 'Lower Young Lake',
        campId: 'lower-young-lake',
        summary:
          'A steep first mile behind Lembert Dome to the Dog Lake junction (the lake is a short spur east), then across Delaney Creek and up through forest and meadow to a shoulder past 10,000 feet. The trail dips to meet the Glen Aulin branch and climbs again to Lower Young Lake, where the maintained trail ends on the north shore.',
      },
      {
        from: 'Lower Young Lake',
        to: 'Lembert Dome',
        campId: null,
        summary:
          'Back to the junction and down the Young Lakes Trail, a long descent through lodgepole with the Cathedral Range in view, to the Pacific Crest Trail. Then east past Soda Springs and along the stables road to the car. On a second night, walk up the informal path to Middle or Upper Young Lake first.',
      },
    ],
    camps: [
      {
        id: 'lower-young-lake',
        name: 'Lower Young Lake, north side',
        kind: 'zone',
        // An anchor in the area where the sources put the camps (the scattered
        // trees above the north shore), on OSM geometry 113 m from the lake
        // and 96 m from the trail; not a surveyed site.
        coord: [-119.3475, 37.9385],
        elevFt: 9907, // USGS 3DEP
        facilities: 'None: no toilet, no lockers, no fire rings in use',
        rules:
          'Legal: about six trail miles from Tuolumne Meadows and more than a mile from any road. No designated sites: use one that has been camped on, at least 100 feet from the lake and the trail. No campfires or wood stoves. Tuolumne watershed: wash and go to the toilet 300 feet from water.',
      },
    ],
    water: [
      {
        id: 'yl-delaney-dog-lake',
        name: 'Delaney Creek',
        kind: 'creek',
        coord: [-119.34747, 37.8979], // OSM crossing on the Dog Lake branch
        reliability: 'seasonal',
        note: 'Mapped as perennial, but it runs low late in the season. Unbridged; high and cold in June.',
      },
      {
        id: 'yl-dingley-upper',
        name: 'Dingley Creek',
        kind: 'creek',
        coord: [-119.3564, 37.91854], // OSM crossing on the Dog Lake branch
        reliability: 'seasonal',
        note: 'Reported dry by August in some years: ask at the wilderness center.',
      },
      {
        id: 'lower-young-lake-water',
        name: 'Lower Young Lake',
        kind: 'lake',
        coord: [-119.34673, 37.93755], // OSM lake way 296090737: the shore point nearest the trail
        reliability: 'reliable',
      },
      {
        id: 'yl-dingley-lower',
        name: 'Dingley Creek, lower crossing',
        kind: 'creek',
        coord: [-119.38199, 37.90063], // OSM crossing on the Young Lakes Trail
        reliability: 'seasonal',
        note: 'The same creek lower down; the same caution.',
      },
      {
        id: 'yl-delaney-pct',
        name: 'Delaney Creek, on the Pacific Crest Trail',
        kind: 'creek',
        coord: [-119.37734, 37.88492], // OSM ford node; GNIS Delaney Creek 266636
        reliability: 'seasonal',
        note: 'The last stream before the car.',
      },
    ],
    hazards: [
      'Delaney and Dingley creeks are unbridged and can run high, cold and fast early in the season: cross where it is safe or turn back.',
      'Camp sits near 9,900 feet, and the basin and the shoulder above it are exposed to afternoon storms.',
      'Overnight parking ends on October 15, and Tioga Road closes for the winter after the first real snow.',
    ],
    hikeId: 'dog-lake',
    sources: [
      { label: 'NPS: Tuolumne Meadows backpacking trails', url: 'https://www.nps.gov/yose/planyourvisit/tuolumne-backpacking-trails.htm' },
      { label: 'NPS: Lembert Dome and Dog Lake Trailhead', url: 'https://www.nps.gov/places/000/lembert-dome-and-dog-lake-trailhead.htm' },
      { label: 'NPS: Wilderness trailheads and quotas', url: NPS_TRAILHEADS },
      { label: 'NPS: Wilderness regulations', url: NPS_WILDREGS },
      { label: 'Recreation.gov: Yosemite wilderness permits', url: RECGOV },
    ],
  },

  // --- Ten Lakes --------------------------------------------------------------
  {
    id: 'ten-lakes',
    title: 'Ten Lakes',
    region: 'tuolumne',
    order: 6,
    level: 'moderate',
    nightsMin: 1,
    nightsMax: 1,
    route: 'out-and-back',
    distanceMi: 12.6, // NPS Yosemite Creek and Ten Lakes Trailhead page (OSM measures 12.1)
    elevationGainFt: 2200, // NPS trailhead page: the climb to Ten Lakes Pass (checked one way)
    highPointFt: 9655, // USGS 3DEP: Ten Lakes Pass
    season: 'Tioga Road season',
    teaser: 'A long, dry climb to a pass, and a basin of lakes on the far side of it.',
    description:
      'From Tioga Road the trail climbs steadily through conifers and over granite to Halfmoon Meadow, then switchbacks to a plateau and Ten Lakes Pass at 9,655 feet, where the basin opens below. The camp is 700 feet down, at the lower lakes. It is a big first day on little water, and the climb back over the pass comes first thing the next morning.',
    permit: {
      trailhead: 'Ten Lakes',
      quota: 40,
      note:
        'Not "Yosemite Creek", the trailhead across the road for trips south. Camp at least one air mile from any road; fires only in existing rings below 9,600 feet. Pick the permit up at the Big Oak Flat station.',
    },
    trailhead: {
      name: 'Ten Lakes Trailhead, Tioga Road',
      coord: [-119.5759, 37.85229], // OSM node 'Ten Lakes Trailhead'; NPS and Recreation.gov points within 60 m
      parking:
        'An unpaved lot beside the trailhead on the north side of Tioga Road, with food lockers; vault toilets in the paved Yosemite Creek lot across the road.',
    },
    days: [
      {
        from: 'Ten Lakes Trailhead',
        to: 'Ten Lakes',
        campId: 'ten-lakes-west',
        summary:
          'A long climb with no dependable water after the first third of a mile, past the White Wolf junction to Halfmoon Meadow, then switchbacks to the plateau and the pass. From the top the trail drops about 700 feet into the basin; the first lake is a short use path off the trail near the bottom. Leave the car with every bottle full.',
      },
      {
        from: 'Ten Lakes',
        to: 'Ten Lakes Trailhead',
        campId: null,
        summary:
          'Climb back over the pass and down the way you came. Fill up at the lakes: below Halfmoon Meadow the trail is dry in late summer. The Grant Lakes, a 1.2-mile spur south from the plateau, make a second night’s camp on a longer trip.',
      },
    ],
    camps: [
      {
        id: 'ten-lakes-west',
        name: 'Ten Lakes, the first lower lake',
        kind: 'zone',
        // An anchor on the north side of the westernmost lower lake, 104 m from
        // the water and 44 m from the use trail (OSM ways 131247000, 925244841);
        // not a surveyed site.
        coord: [-119.5302, 37.9033],
        elevFt: 9037, // USGS 3DEP
        facilities: 'None: no toilet or lockers',
        rules:
          'Legal: more than four miles in a straight line from Tioga Road. Use a site that has been camped on, at least 100 feet from water and the trail. Below 9,600 feet, so a fire is legal in an existing ring when no restriction is in force. Tuolumne watershed: wash and go to the toilet 300 feet from water.',
      },
    ],
    water: [
      {
        id: 'yosemite-creek-th',
        name: 'Yosemite Creek, near the trailhead',
        kind: 'creek',
        coord: [-119.57462, 37.8558], // OSM/USGS NHD: perennial, 60 to 110 m from the trail
        reliability: 'reliable',
        note: 'The last dependable water for almost four miles.',
      },
      {
        id: 'white-wolf-tributary',
        name: 'Tributary at the White Wolf junction',
        kind: 'creek',
        coord: [-119.56795, 37.87788], // OSM junction; NHD intermittent
        reliability: 'seasonal',
        note: 'Intermittent: do not count on it.',
      },
      {
        id: 'halfmoon-meadow',
        name: 'Halfmoon Meadow',
        kind: 'creek',
        coord: [-119.54627, 37.89549], // OSM: the meadow's west edge; Yosemite Creek's headwater 70 m off
        reliability: 'seasonal',
        note: 'Headwaters of Yosemite Creek; often a trickle by late summer. No camping in the meadow.',
      },
      {
        id: 'ten-lakes-first',
        name: 'The first lower lake',
        kind: 'lake',
        coord: [-119.52961, 37.90244], // OSM lake way 131247000: the shore nearest the trail, down its use path
        reliability: 'reliable',
        note: 'Down a short use path near the foot of the descent; its outlet crosses the trail.',
      },
      {
        id: 'ten-lakes-main',
        name: 'Ten Lakes, the largest lower lake',
        kind: 'lake',
        coord: [-119.52697, 37.9032], // OSM relation 12528389 'Ten Lakes': the shore where the trail reaches it
        reliability: 'reliable',
      },
    ],
    hazards: [
      'Day one is long and dry: carry at least three liters from the trailhead creek, more in July heat on the open granite.',
      'Stretches of granite on the way up are marked by cairns and easy to lose, especially near dusk.',
      'The plateau and the pass are exposed to afternoon thunderstorms.',
      'Overnight parking ends on October 15, and Tioga Road closes for the winter after the first real snow.',
    ],
    sources: [
      { label: 'NPS: Yosemite Creek and Ten Lakes Trailhead', url: 'https://www.nps.gov/places/000/yosemite-creek-and-ten-lakes-trailhead.htm' },
      { label: 'NPS: Tioga Road backpacking trails', url: 'https://www.nps.gov/yose/planyourvisit/tioga-road-backpacking-trails.htm' },
      { label: 'NPS: Wilderness trailheads and quotas', url: NPS_TRAILHEADS },
      { label: 'NPS: Wilderness regulations', url: NPS_WILDREGS },
      { label: 'Recreation.gov: Yosemite wilderness permits', url: RECGOV },
    ],
  },
  // --- Lyell Canyon -------------------------------------------------------------
  {
    id: 'lyell-canyon',
    title: 'Lyell Canyon to Donohue Pass',
    region: 'tuolumne',
    order: 7,
    level: 'moderate',
    nightsMin: 2,
    nightsMax: 3,
    route: 'out-and-back',
    // Measured: OSM from the NPS trailhead to the head of the canyon floor,
    // 8.6 mi each way, with 3DEP climbing. The park's 11.4 mi / 300 ft entry
    // turns round at the Ireland Creek junction, the first night here.
    distanceMi: 17.2,
    elevationGainFt: 540,
    highPointFt: 9000, // USGS 3DEP: the head of the canyon floor; Donohue Pass (11,056 ft) is the side trip
    season: 'Tioga Road season',
    teaser: 'The John Muir Trail up a flat, meadowed canyon to the foot of Mount Lyell, and a day to the pass.',
    description:
      'The John Muir and Pacific Crest trails share the floor of Lyell Canyon for eight nearly level miles beside the Lyell Fork, through long meadows under the Kuna Crest to the foot of Mount Lyell, the park’s highest peak. It is the gentlest long trip in the park until the last day, when a climb past the Lyell Fork footbridge and the tarns below the glacier reaches Donohue Pass at 11,056 feet.',
    permit: {
      trailhead: 'Lyell (No Donohue Pass)',
      quota: 10,
      note:
        'Travel at least four and a half miles out the canyon before camping. This permit does not let you cross Donohue Pass out of the park; standing on the pass and coming back is not addressed by the park, so ask at pickup. The other Lyell trailhead, "Lyell Canyon (Donohue Pass Eligible)" (30 a day), is for hikers leaving over the pass on the John Muir Trail.',
    },
    trailhead: {
      name: 'Lyell Canyon Trailhead, south of the Dog Lake parking area',
      coord: [-119.33862, 37.877585], // NPS places record; the "John Muir Trail" sign
      parking:
        'Park at the Dog Lake lot or the Tuolumne Meadows Wilderness Center; food lockers at trailhead parking. A John Muir Trail sign with distances marks the start.',
    },
    days: [
      {
        from: 'Lyell Canyon Trailhead',
        to: 'Ireland Creek junction',
        campId: 'ireland-creek',
        summary:
          'Over the Dana Fork bridge and the Twin Bridges on the Lyell Fork, past the Rafferty Creek junction, then up the open canyon with the river alongside. No camping in the first four and a half miles; the first well-used ground is around the Ireland Creek and Evelyn Lake junction.',
      },
      {
        from: 'Ireland Creek junction',
        to: 'Head of Lyell Canyon',
        campId: 'lyell-head',
        summary:
          'A short, nearly level walk to the upper meadows under Mount Lyell and the Kuna Crest, with the afternoon to spend. Camp in the lodgepole at the meadow’s edge, never on the meadow.',
      },
      {
        from: 'Head of Lyell Canyon',
        to: 'Head of Lyell Canyon',
        campId: 'lyell-head',
        sideTripId: 'donohue-pass',
        summary:
          'The pass, without a pack: switchbacks to the Lyell Fork footbridge, past the tarns below the Lyell Glacier, and up to Donohue Pass at 11,056 feet, then back to camp. Go early and be off the pass before the afternoon storms.',
      },
      {
        from: 'Head of Lyell Canyon',
        to: 'Lyell Canyon Trailhead',
        campId: null,
        summary: 'Back down the canyon the way you came, the river on the other side now.',
      },
    ],
    camps: [
      {
        id: 'ireland-creek',
        name: 'Ireland Creek junction',
        kind: 'zone',
        coord: [-119.27966, 37.82551], // OSM: the junction with the Ireland Lake and Evelyn Lake trail
        elevFt: 8925, // USGS 3DEP
        facilities: 'None: dispersed sites on the benches near the junction and along the river',
        rules:
          'Legal: about 5.9 trail miles out, past the four-and-a-half-mile limit. Use a site that has been camped on, at least 100 feet from water and the trail and off the meadow. Bears here have taken backpackers’ food. Tuolumne watershed: wash and go to the toilet 300 feet from water.',
      },
      {
        id: 'lyell-head',
        name: 'Head of Lyell Canyon',
        kind: 'zone',
        coord: [-119.26176, 37.79196], // the end of the flat floor on the 3DEP profile; NPS stock-site maps (2023) place used camps here
        elevFt: 8995, // USGS 3DEP
        facilities: 'None: sites in the lodgepole fringe of the upper meadows',
        rules:
          'Legal by the same rules, and below 9,600 feet, so a fire is allowed in an existing ring when no restriction is in force. Above the footbridge (9,650 feet) no fires or wood stoves at all. Stay out of the meadows.',
      },
    ],
    water: [
      {
        id: 'dana-fork',
        name: 'Dana Fork of the Tuolumne',
        kind: 'river',
        coord: [-119.33532, 37.87586], // OSM bridge
        reliability: 'reliable',
      },
      {
        id: 'twin-bridges',
        name: 'Lyell Fork at Twin Bridges',
        kind: 'river',
        coord: [-119.33285, 37.86969], // OSM bridges
        reliability: 'reliable',
      },
      {
        id: 'rafferty-creek-lyell',
        name: 'Rafferty Creek',
        kind: 'creek',
        coord: [-119.32268, 37.86659], // OSM bridge (rerouted)
        reliability: 'seasonal',
        note: 'The park reported it dry in September 2026.',
      },
      {
        id: 'lyell-fork-canyon',
        name: 'Lyell Fork, beside the trail',
        kind: 'river',
        coord: [-119.29641, 37.85495], // OSM: from here to the canyon head the river runs 30 to 130 m from the trail
        reliability: 'reliable',
        note: 'From here to the head of the canyon the river is never far.',
      },
      {
        id: 'ireland-creek-water',
        name: 'Ireland Creek',
        kind: 'creek',
        coord: [-119.27864, 37.82486], // OSM ford node 4095111093
        reliability: 'reliable',
        note: 'A wet crossing in snowmelt.',
      },
      {
        id: 'lyell-fork-head',
        name: 'Lyell Fork at the head of the canyon',
        kind: 'river',
        coord: [-119.26271, 37.79493], // OSM: a side creek with the Lyell Fork within about 50 m
        reliability: 'reliable',
      },
    ],
    sideTrips: [
      {
        id: 'donohue-pass',
        name: 'Donohue Pass',
        note:
          'About 3.9 miles each way and 2,000 feet up from the canyon head. Water at the footbridge and the upper fords; none on the last climb. No fires anywhere above 9,600 feet.',
      },
    ],
    hazards: [
      'Lightning on Donohue Pass and the open slabs above 10,000 feet: storms build most afternoons from June to September. Turn back for building clouds.',
      'Camps near 9,000 feet and a pass at 11,056: sleep a night at Tuolumne Meadows first if you have come up from sea level.',
      'Early in summer the canyon trail is muddy; walk through the puddles, not around them, which widens the trail into the meadow.',
      'Overnight parking ends on October 15, and Tioga Road closes for the winter after the first real snow.',
    ],
    hikeId: 'lyell-canyon',
    sources: [
      { label: 'NPS: Lyell Canyon Trailhead', url: 'https://www.nps.gov/places/000/lyell-canyon-trailhead.htm' },
      { label: 'NPS: John Muir Trail', url: 'https://www.nps.gov/yose/planyourvisit/jmt.htm' },
      { label: 'NPS: Wilderness trailheads and quotas', url: NPS_TRAILHEADS },
      { label: 'NPS: Wilderness regulations', url: NPS_WILDREGS },
      { label: 'Recreation.gov: Yosemite wilderness permits', url: RECGOV },
    ],
  },

  // --- Grand Canyon of the Tuolumne ------------------------------------------
  {
    id: 'grand-canyon-tuolumne',
    title: 'Grand Canyon of the Tuolumne',
    region: 'tuolumne',
    order: 10,
    level: 'strenuous',
    nightsMin: 3,
    nightsMax: 4,
    route: 'one-way',
    distanceMi: 30.8, // NPS Grand Canyon of the Tuolumne (OSM measures 29.5 from Lembert Dome parking)
    // NPS gives 5,350 ft climbing west to east; this direction loses 755 ft
    // net, so about 4,600 ft (3DEP along the line: 5,036, high in the gorge).
    elevationGainFt: 4600,
    highPointFt: 8656, // USGS 3DEP near the trailhead
    season: 'Tioga Road season; hot below 6,000 ft by midsummer',
    teaser: 'Thirty miles down the river past its waterfalls to Pate Valley, and the long climb out to White Wolf.',
    description:
      'From Tuolumne Meadows the river leads past Glen Aulin into its Grand Canyon: California, Le Conte and Waterwheel falls in a few miles, the trail stepping round the Muir Gorge, and the floor of Pate Valley at 4,400 feet. The last day climbs almost 4,000 feet up the canyon’s north wall to White Wolf, mostly in the open and mostly dry. The finest canyon walk in the park, and the hardest trip on this list.',
    permit: {
      trailhead: 'Glen Aulin',
      quota: 25,
      note:
        'East to west with the first night at the Glen Aulin backpackers’ campground. To sleep farther on the first night, use "Glen Aulin->Cold Canyon/Waterwheel (pass through)" (20 a day). Walked the other way, the trailhead is "White Wolf->Pate Valley" (30 a day).',
    },
    trailhead: {
      name: 'Lembert Dome parking, Tioga Road',
      coord: [-119.3535, 37.87729], // OSM parking way 36808906; the NPS trailhead list says park here
      parking: 'Park at Lembert Dome; the trail leaves through the gate on the stables road. Overnight parking ends October 15.',
    },
    exit: {
      name: 'Harden Lake Trailhead, White Wolf',
      coord: [-119.649353, 37.872753], // NPS places record 'Harden Lake Trailhead'
      parking:
        'Off Tioga Road at White Wolf (if the White Wolf road is closed, add about a mile). Do not count on water or services here: the campground had none in 2026 and the lodge was closed.',
    },
    transport:
      'You need to get back to Tuolumne Meadows. In summer YARTS’ Highway 120 East bus stops at White Wolf Lodge on request (book at least 12 hours ahead online, or call dispatch 24 hours ahead), and the afternoon run is the last of the day. Or leave a car at White Wolf and ride Yosemite Hospitality’s hikers’ bus up in the morning. Both run only in summer; check the season’s dates before you plan.',
    days: [
      {
        from: 'Lembert Dome',
        to: 'Glen Aulin',
        campId: 'gc-glen-aulin-bp',
        summary:
          'Past Soda Springs on the Pacific Crest Trail, across Delaney and Dingley creeks and the river’s first bridge, past Tuolumne Falls and White Cascade to the designated camp.',
      },
      {
        from: 'Glen Aulin',
        to: 'Return Creek',
        campId: 'return-creek',
        summary:
          'Off the Pacific Crest Trail for the canyon trail: California, Le Conte and Waterwheel falls in quick succession, then the Return Creek bridge. A short day by mileage and a long one by waterfalls; camp on the benches near the river below the bridge.',
      },
      {
        from: 'Return Creek',
        to: 'Pate Valley',
        campId: 'pate-valley',
        summary:
          'Down the canyon floor, then up and round the Muir Gorge on stone steps and switchbacks, the trail never entering the gorge itself. Register Creek is often dry by August; the river returns below it and stays close to Pate Valley’s two bridges. Hot, and snake country.',
      },
      {
        from: 'Pate Valley',
        to: 'White Wolf',
        campId: null,
        summary:
          'Fill every bottle at the river before you leave it. Along the river to the trip’s low point, then about 3,400 feet of switchbacks up the Morrison Creek drainage, past a view down to Hetch Hetchy, to the top of the climb, Harden Lake and the old Tioga Road grade to White Wolf. Start at first light.',
      },
    ],
    camps: [
      {
        id: 'gc-glen-aulin-bp',
        name: 'Glen Aulin backpackers’ campground',
        kind: 'designated',
        coord: [-119.41774, 37.91011], // climber.org YE06 GPS of the backpackers' boxes, within 10 m of OSM's camp toilet; about 50 m either way
        elevFt: 7884, // USGS 3DEP
        facilities: 'Bear lockers, a toilet, communal fire rings',
        rules:
          'Required for the first night on a Glen Aulin permit, and the only legal camp within a mile of the High Sierra Camp. Fires only in the communal rings and only when no restriction is in force. Wash and go to the toilet 300 feet from water.',
      },
      {
        id: 'return-creek',
        name: 'Below the Return Creek bridge',
        kind: 'zone',
        coord: [-119.46602, 37.93213], // OSM: the Return Creek bridge, at the downstream end of the Waterwheel-to-Return Creek benches
        elevFt: 6216, // USGS 3DEP
        facilities: 'None',
        rules:
          'Legal: more than a mile below the High Sierra Camp and far past the four-mile rule. Use a site that has been camped on, at least 100 feet from water and the trail; 300 feet from water for washing and waste.',
      },
      {
        id: 'pate-valley',
        name: 'Pate Valley',
        kind: 'zone',
        coord: [-119.594377, 37.930938], // NPS places record 'Pate Valley Trail Camp'; the park's map puts its fire ring about 130 m south of the footbridge
        elevFt: 4363, // USGS 3DEP
        facilities: 'None: no toilet or lockers',
        rules:
          'Camp south of the bridges at the used camp, and stay out of the sensitive area the park’s map marks in the valley. Bears are active here, and the river is San Francisco’s water supply: wash and go to the toilet 300 feet from it.',
      },
    ],
    water: [
      {
        id: 'gc-delaney',
        name: 'Delaney Creek',
        kind: 'creek',
        coord: [-119.37734, 37.88492], // OSM ford node; GNIS Delaney Creek 266636
        reliability: 'seasonal',
      },
      {
        id: 'gc-tuolumne-upper',
        name: 'Tuolumne River, upper canyon',
        kind: 'river',
        coord: [-119.41285, 37.9012], // OSM: the first footbridge
        reliability: 'reliable',
        note: 'The river is close by from about mile 3 to mile 13.',
      },
      {
        id: 'conness-creek',
        name: 'Conness Creek at Glen Aulin',
        kind: 'creek',
        coord: [-119.41975, 37.90961], // OSM bridge way 730807332
        reliability: 'reliable',
      },
      {
        id: 'return-creek-water',
        name: 'Return Creek',
        kind: 'creek',
        coord: [-119.46602, 37.93213], // OSM bridge
        reliability: 'reliable',
        note: 'The river is beside the camp too.',
      },
      {
        id: 'gc-tuolumne-middle',
        name: 'Tuolumne River, above the Muir Gorge',
        kind: 'river',
        coord: [-119.51534, 37.93139], // OSM: the trail beside the river before the climb round the gorge
        reliability: 'reliable',
        note: 'Fill here: the trail leaves the river for about a mile and a half round the gorge.',
      },
      {
        id: 'register-creek',
        name: 'Register Creek',
        kind: 'creek',
        coord: [-119.53307, 37.94007], // OSM ford
        reliability: 'seasonal',
        note: 'Often dry by August; the river is close again half a mile on.',
      },
      {
        id: 'pate-valley-river',
        name: 'Tuolumne River at Pate Valley',
        kind: 'river',
        coord: [-119.59332, 37.93201], // OSM: the Pate Valley bridges
        reliability: 'reliable',
        note: 'The last reliable water of the trip. Leave with enough for the whole climb.',
      },
      {
        id: 'morrison-creek',
        name: 'Morrison Creek',
        kind: 'creek',
        coord: [-119.63221, 37.91194], // OSM crossing
        reliability: 'seasonal',
        note: 'Reported anywhere from a slight flow to bone dry by late summer: do not plan on it.',
      },
      {
        id: 'harden-lake-water',
        name: 'Harden Lake',
        kind: 'lake',
        coord: [-119.67327, 37.89529], // OSM: the shore at the trail
        reliability: 'seasonal',
        note: 'A shallow lake that warms and shrinks through the summer; usually holds water, but treat it as a bonus.',
      },
    ],
    hazards: [
      'The last day: about 3,900 feet of climbing in nine and a half miles from Pate Valley, much of it on open switchbacks in the heat, with no reliable water after the river. Carry four liters or more and start at dawn.',
      'Rattlesnakes are common in the miles around Pate Valley. Watch where hands and feet go.',
      'Bears at Glen Aulin and in Pate Valley have taken backpackers’ food.',
      'The Pate Valley bridges were damaged in the 2017 floods and have since been crossed; in a big snow year ask about them at pickup. Never try the Muir Gorge itself: the trail climbs round it.',
      'The shuttle back from White Wolf is a request stop to book ahead, and missing the last bus means another night out.',
    ],
    hikeId: 'glen-aulin',
    sources: [
      { label: 'NPS: Tuolumne Meadows backpacking trails', url: 'https://www.nps.gov/yose/planyourvisit/tuolumne-backpacking-trails.htm' },
      { label: 'NPS: Harden Lake Trailhead', url: 'https://www.nps.gov/places/000/harden-lake-trailhead.htm' },
      { label: 'NPS: Wilderness trailheads and quotas', url: NPS_TRAILHEADS },
      { label: 'YARTS: Highway 120 East', url: 'https://www.yarts.com/bus_routes/highway-395-120e/' },
      { label: 'Recreation.gov: Yosemite wilderness permits', url: RECGOV },
    ],
  },
  // --- Cathedral Lakes to Yosemite Valley ------------------------------------
  {
    id: 'cathedral-to-valley',
    title: 'Cathedral Lakes to Yosemite Valley',
    region: 'tuolumne',
    order: 8,
    level: 'moderate',
    nightsMin: 2,
    nightsMax: 3,
    route: 'one-way',
    distanceMi: 22, // NPS Tuolumne backpacking trails: John Muir Trail to Yosemite Valley (OSM, with the Lower Cathedral spur: 21.7)
    // Measured: 3DEP along the OSM line, the spur included. The park's
    // 1,750 ft omits the spur and smooths the rolling high section.
    elevationGainFt: 2400,
    highPointFt: 9940, // USGS 3DEP: the shoulder under the Echo Peaks past Cathedral Pass
    season: 'Tioga Road season',
    teaser: 'The John Muir Trail from Tuolumne Meadows to Happy Isles, downhill most of the way.',
    description:
      'The classic way into the Valley on foot: the John Muir Trail from Tuolumne Meadows past the Cathedral Lakes and over Cathedral Pass, through Long Meadow to the Sunrise High Sierra Camp, down Sunrise Creek to Little Yosemite Valley, and out past Nevada and Vernal falls. Close to 7,000 feet of descent, most of it on the last two days. Half Dome can be added to the permit and climbed from Little Yosemite Valley.',
    permit: {
      trailhead: 'Cathedral Lakes',
      quota: 25,
      note:
        'Camp at Lower Cathedral Lake, or on the John Muir Trail past Upper Cathedral Lake, on the first night; the park’s map is not plain on which, so ask at pickup. Half Dome can be added (about 75 backpackers a day, $10 a person). Little Yosemite Valley is legal on a later night of this permit, not the first.',
    },
    trailhead: {
      name: 'Cathedral Lakes Trailhead, Tuolumne Meadows Visitor Center',
      coord: [-119.3751, 37.8725], // OSM node 'Cathedral Lakes Trailhead' at the relocated start (Recreation.gov still pins the old Tioga Road trailhead)
      parking:
        'The trail now begins at the visitor center’s parking lot. No toilet or tap confirmed at the lot: start with full bottles.',
    },
    exit: {
      name: 'Happy Isles, Valley shuttle stop 16',
      coord: [-119.55778, 37.73282], // OSM 'Happy Isles Trailhead' node
      parking: 'No parking at Happy Isles: ride the free Valley shuttle to the backpackers’ lot past Curry Village or the Yosemite Falls lot.',
    },
    transport:
      'A one-way trip: leave the car in the Valley and ride up in the morning, or the reverse. In summer YARTS’ Highway 120 East bus runs from Yosemite Village to Tuolumne Meadows (the visitor center and the John Muir Trailhead), and Yosemite Hospitality runs a once-daily hikers’ bus between Curry Village and Tuolumne Meadows Lodge. Both are summer-only: check the season’s dates and book ahead.',
    days: [
      {
        from: 'Tuolumne Meadows',
        to: 'Lower Cathedral Lake',
        campId: 'lower-cathedral',
        summary:
          'A flat start, then a steady thousand-foot climb through lodgepole on the John Muir Trail, across Budd and Cathedral creeks, to the signed spur and down it to Lower Cathedral Lake under Cathedral Peak. A short first day on purpose: you sleep near 9,300 feet.',
      },
      {
        from: 'Lower Cathedral Lake',
        to: 'Sunrise',
        campId: 'sunrise-bp',
        summary:
          'Back up the spur and past Upper Cathedral Lake, over Cathedral Pass and the high shoulder under the Echo Peaks, then down through Long Meadow to the Sunrise High Sierra Camp. Fill at Upper Cathedral Lake or the Long Meadow stream: the creek at camp can be dry.',
      },
      {
        from: 'Sunrise',
        to: 'Little Yosemite Valley',
        campId: 'cathedral-lyv',
        summary:
          'A short climb off the Sunrise bench, then the long John Muir Trail descent beside Sunrise Creek, past the Forsyth, Clouds Rest and Half Dome junctions, into the flat pines of Little Yosemite Valley. With a Half Dome add-on, the climb starts from the junction above camp the next morning.',
      },
      {
        from: 'Little Yosemite Valley',
        to: 'Happy Isles',
        campId: null,
        summary:
          'Out by the Mist Trail, past the top of Nevada Fall, Emerald Pool and the granite staircase beside Vernal Fall, or by the John Muir Trail past Clark Point, nearly a mile longer and easier on the knees.',
      },
    ],
    camps: [
      {
        id: 'lower-cathedral',
        name: 'Lower Cathedral Lake',
        kind: 'zone',
        coord: [-119.42245, 37.84638], // NPS wilderness trailheads map camping point; OSM lake
        elevFt: 9300, // USGS 3DEP
        facilities: 'None: no lockers or toilet',
        rules:
          'The camping point on the park’s map for this trailhead. No campfires anywhere in the Cathedral Lakes basins. Camp 100 feet from water and the trail on rock or bare ground, never on the meadow. It is one of the busiest lakes in the park: expect company.',
      },
      {
        id: 'sunrise-bp',
        name: 'Sunrise backpackers’ campground',
        kind: 'designated',
        coord: [-119.43384, 37.79427], // Bear Box Project GPS of the backpackers' lockers, southwest of the camp buildings; OSM agrees
        elevFt: 9340, // USGS 3DEP
        facilities: 'Bear lockers uphill from a composting toilet; a communal fire ring',
        rules:
          'Required within a mile of the High Sierra Camp. Use the backpackers’ lockers, not the ones among the camp buildings. Fires only in the communal ring, and only when no restriction is in force.',
      },
      {
        id: 'cathedral-lyv',
        name: 'Little Yosemite Valley campground',
        kind: 'designated',
        coord: [-119.5152, 37.73242], // OSM: the backpackers' campground
        elevFt: 6120, // USGS 3DEP
        facilities: 'Composting toilets, communal bear lockers, two communal fire rings; no drinking water',
        rules:
          'The only legal camping in the Little Yosemite Valley area. No check-in; the tent can stay up while you climb Half Dome. Fires only in the communal rings, when allowed.',
      },
    ],
    water: [
      {
        id: 'budd-creek',
        name: 'Budd Creek',
        kind: 'creek',
        coord: [-119.38345, 37.87172], // OSM crossing
        reliability: 'seasonal',
        note: 'No camping in its watershed.',
      },
      {
        id: 'cathedral-creek',
        name: 'Cathedral Creek',
        kind: 'creek',
        coord: [-119.40416, 37.86244], // OSM crossing
        reliability: 'seasonal',
      },
      {
        id: 'lower-cathedral-water',
        name: 'Lower Cathedral Lake',
        kind: 'lake',
        coord: [-119.42245, 37.84638], // OSM lake, at the end of the spur
        reliability: 'reliable',
      },
      {
        id: 'upper-cathedral-water',
        name: 'Upper Cathedral Lake',
        kind: 'lake',
        coord: [-119.41427, 37.83838], // OSM: the shore about 125 m from the trail
        reliability: 'reliable',
        note: 'The last sure water for almost three miles.',
      },
      {
        id: 'long-meadow',
        name: 'Long Meadow stream',
        kind: 'creek',
        coord: [-119.43007, 37.80477], // OSM
        reliability: 'reliable',
        note: 'Fill where it runs, not from the standing pools.',
      },
      {
        id: 'sunrise-creek-upper',
        name: 'Sunrise Creek',
        kind: 'creek',
        coord: [-119.45299, 37.7653], // OSM: the first crossing below Sunrise
        reliability: 'reliable',
      },
      {
        id: 'sunrise-creek-lower',
        name: 'Sunrise Creek, lower crossing',
        kind: 'creek',
        coord: [-119.49217, 37.74737], // OSM
        reliability: 'reliable',
      },
      {
        id: 'cathedral-merced-lyv',
        name: 'Merced River at Little Yosemite Valley',
        kind: 'river',
        coord: [-119.51374, 37.73234], // OSM
        reliability: 'reliable',
        note: 'The only water at camp, and the last before Half Dome.',
      },
      {
        id: 'cathedral-vernal-tap',
        name: 'Vernal Fall footbridge fountain',
        kind: 'tap',
        coord: [-119.55155, 37.72599], // OSM; NPS vernalnevadatrail.htm
        reliability: 'seasonal',
        note: 'Treated water, May to October.',
      },
    ],
    hazards: [
      'Cathedral Pass and the shoulder to Long Meadow are exposed to afternoon storms; snow lingers on the north side of the pass early in the season.',
      'Little Yosemite Valley and Sunrise have bears that have taken backpackers’ food.',
      'Entering Emerald Pool and the Silver Apron is prohibited: the current above both falls is lethal.',
      'Overnight parking on Tioga Road ends on October 15; the shuttles that make a one-way trip work run only in summer.',
    ],
    hikeId: 'cathedral-lakes',
    sources: [
      { label: 'NPS: Cathedral Lakes Trailhead', url: 'https://www.nps.gov/places/000/cathedral-lakes-trailhead.htm' },
      { label: 'NPS: Tuolumne Meadows backpacking trails', url: 'https://www.nps.gov/yose/planyourvisit/tuolumne-backpacking-trails.htm' },
      { label: 'NPS: Little Yosemite Valley', url: 'https://www.nps.gov/yose/planyourvisit/lyv.htm' },
      { label: 'NPS: Wilderness trailheads and quotas', url: NPS_TRAILHEADS },
      { label: 'Recreation.gov: Yosemite wilderness permits', url: RECGOV },
    ],
  },

  // --- Vogelsang, Merced Lake and Yosemite Valley -----------------------------
  {
    id: 'vogelsang-merced-lake-valley',
    title: 'Vogelsang, Merced Lake and the Valley',
    region: 'tuolumne',
    order: 9,
    level: 'strenuous',
    nightsMin: 3,
    nightsMax: 4,
    route: 'one-way',
    distanceMi: 28.8, // NPS trailheads table: Rafferty Creek to Merced Lake via Lewis Creek 15.7 + Happy Isles to Merced Lake 13.1
    // Measured: 3DEP along the OSM line; the park publishes no total.
    elevationGainFt: 2730,
    highPointFt: 10680, // USGS 3DEP: Vogelsang Pass
    season: 'Mid-July to early October',
    teaser: 'Over Vogelsang Pass and down the whole Merced: from the high country to Happy Isles in four days.',
    description:
      'Up Rafferty Creek to Tuolumne Pass and a night above 10,000 feet at Vogelsang, then over Vogelsang Pass, the trip’s high point, and 3,600 feet down Lewis Creek to Merced Lake. From there the Merced River leads the rest of the way: Echo Valley, Bunnell Point, Little Yosemite Valley, and out past Nevada and Vernal falls. The Vogelsang and Merced Lake High Sierra Camps did not open in 2025 or 2026, so plan on nothing from them.',
    permit: {
      trailhead: 'Rafferty Creek->Vogelsang',
      quota: 20,
      note:
        'Camp at least four trail miles from Tuolumne Meadows, past the arrow on Rafferty Creek on the park’s map; Vogelsang qualifies. Half Dome can be added at pickup. Little Yosemite Valley is legal on a later night of this permit.',
    },
    trailhead: {
      name: 'John Muir Trail trailhead, across from Dog Lake parking',
      coord: [-119.33534, 37.87593], // OSM: the Dana Fork footbridge at the start; YARTS 'John Muir Trailhead' stop
      parking: 'Dog Lake parking on the Tuolumne Meadows Lodge road, or the wilderness center lot (adds about two thirds of a mile).',
    },
    exit: {
      name: 'Happy Isles, Valley shuttle stop 16',
      coord: [-119.55778, 37.73282], // OSM 'Happy Isles Trailhead' node
      parking: 'No parking at Happy Isles: ride the free Valley shuttle to the backpackers’ lot past Curry Village or the Yosemite Falls lot.',
    },
    transport:
      'A one-way trip: leave the car in the Valley and ride up, or the reverse. In summer YARTS’ Highway 120 East bus runs between Yosemite Village and the John Muir Trailhead stop at the start, and Yosemite Hospitality runs a once-daily hikers’ bus between Curry Village and Tuolumne Meadows Lodge. Both are summer-only: check the season’s dates and book ahead.',
    days: [
      {
        from: 'Tuolumne Meadows',
        to: 'Vogelsang',
        campId: 'vogelsang-bp',
        summary:
          'A flat mile along the Lyell Fork to the Rafferty Creek junction, then a steady climb beside the creek to Tuolumne Pass and on to the backpackers’ camp by Fletcher Lake. You sleep above 10,000 feet: a night in Tuolumne Meadows first helps.',
      },
      {
        from: 'Vogelsang',
        to: 'Merced Lake',
        campId: 'merced-lake-bp',
        summary:
          'Past Vogelsang Lake to Vogelsang Pass, the trip’s high point, early, before the storms. Then the long drop down Lewis Creek, 3,600 feet in seven miles of loose granite, to the camp at the east end of Merced Lake. Fill at Florence Creek: the trail then runs high above Lewis Creek for three miles.',
      },
      {
        from: 'Merced Lake',
        to: 'Little Yosemite Valley',
        campId: 'vlv-lyv',
        summary:
          'Along Merced Lake and down the river through Echo Valley, across the Merced twice, past Bunnell Point and the slides of Bunnell Cascade, and into the long flat of Little Yosemite Valley. The river is beside the trail most of the day.',
      },
      {
        from: 'Little Yosemite Valley',
        to: 'Happy Isles',
        campId: null,
        summary:
          'Out by the Mist Trail past Nevada and Vernal falls, or by the John Muir Trail past Clark Point, nearly a mile longer and easier on the knees.',
      },
    ],
    camps: [
      {
        id: 'vogelsang-bp',
        name: 'Vogelsang backpackers’ campground',
        kind: 'designated',
        coord: [-119.3441, 37.797], // Bear Box Project GPS of the backpackers' lockers, northeast of the camp buildings and west of Fletcher Lake
        elevFt: 10130, // USGS 3DEP
        facilities: 'Food lockers in past seasons; the park lists no toilet at the backpackers’ sites',
        rules:
          'Required within a mile of the High Sierra Camp, open or not. No campfires at all: it is above 9,600 feet, and Vogelsang has no communal ring. No wood stoves either. Carry the canister even if the lockers stand.',
      },
      {
        id: 'merced-lake-bp',
        name: 'Merced Lake backpackers’ campground',
        kind: 'designated',
        coord: [-119.40704, 37.74062], // Bear Box Project GPS, about 200 yards east of the lake's northeast corner; OSM agrees
        elevFt: 7240, // USGS 3DEP
        facilities: 'Food lockers beside the trail; no tap water to count on while the High Sierra Camp is closed',
        rules:
          'Required within a mile of the High Sierra Camp. Fires only in the communal rings, and only when no restriction is in force.',
      },
      {
        id: 'vlv-lyv',
        name: 'Little Yosemite Valley campground',
        kind: 'designated',
        coord: [-119.5152, 37.73242], // OSM: the backpackers' campground
        elevFt: 6120, // USGS 3DEP
        facilities: 'Composting toilets, communal bear lockers, two communal fire rings; no drinking water',
        rules: 'The only legal camping in the Little Yosemite Valley area. Fires only in the communal rings, when allowed.',
      },
    ],
    water: [
      {
        id: 'v-lyell-fork',
        name: 'Lyell Fork footbridges',
        kind: 'river',
        coord: [-119.33296, 37.86961], // OSM
        reliability: 'reliable',
        note: 'Last big water before the Rafferty Creek climb.',
      },
      {
        id: 'rafferty-lower',
        name: 'Rafferty Creek',
        kind: 'creek',
        coord: [-119.32027, 37.84206], // OSM crossing
        reliability: 'seasonal',
        note: 'Runs most summers but can be dry by September; the park reported it dry in early September 2026.',
      },
      {
        id: 'fletcher-lake',
        name: 'Fletcher Lake and Fletcher Creek',
        kind: 'lake',
        coord: [-119.34515, 37.79456], // OSM
        reliability: 'reliable',
        note: 'Vogelsang’s camp water.',
      },
      {
        id: 'vogelsang-lake',
        name: 'Vogelsang Lake',
        kind: 'lake',
        coord: [-119.34534, 37.78785], // OSM relation 12437312 'Vogelsang Lake': the shore nearest the trail
        reliability: 'reliable',
        note: 'The last water before the pass.',
      },
      {
        id: 'lewis-upper',
        name: 'Lewis Creek, below the pass',
        kind: 'creek',
        coord: [-119.33782, 37.77412], // OSM crossing
        reliability: 'reliable',
      },
      {
        id: 'florence-creek',
        name: 'Florence Creek',
        kind: 'creek',
        coord: [-119.35479, 37.75592], // OSM crossing
        reliability: 'seasonal',
        note: 'Fill here: the trail stays high above Lewis Creek for about three miles.',
      },
      {
        id: 'lewis-lower',
        name: 'Lewis Creek above Merced Lake',
        kind: 'creek',
        coord: [-119.39659, 37.73876], // OSM crossing
        reliability: 'reliable',
      },
      {
        id: 'merced-lake-water',
        name: 'Merced Lake',
        kind: 'lake',
        coord: [-119.4063, 37.73806], // OSM: the river below the camp
        reliability: 'reliable',
        note: 'Merced Lake’s camp water; the High Sierra Camp spigot is not confirmed working.',
      },
      {
        id: 'merced-echo-bridge',
        name: 'Merced River below Echo Valley',
        kind: 'river',
        coord: [-119.44609, 37.74128], // OSM bridge; a second bridge near Bunnell Point
        reliability: 'reliable',
        note: 'Fill from calm banks only: the granite near Bunnell Cascade is slick and the water fast.',
      },
      {
        id: 'v-merced-lyv',
        name: 'Merced River at Little Yosemite Valley',
        kind: 'river',
        coord: [-119.51374, 37.73234], // OSM
        reliability: 'reliable',
      },
      {
        id: 'v-vernal-tap',
        name: 'Vernal Fall footbridge fountain',
        kind: 'tap',
        coord: [-119.55155, 37.72599], // OSM; NPS vernalnevadatrail.htm
        reliability: 'seasonal',
        note: 'Treated water, May to October.',
      },
    ],
    hazards: [
      'Night one is above 10,000 feet and the pass is 10,680: acclimatize at Tuolumne Meadows first.',
      'Cross Vogelsang Pass early; it is exposed to afternoon storms, and holds snow on its north side into July after a big winter.',
      'Rafferty and Lewis creeks can be real fords at the peak of the melt, from May into early July.',
      'Seven miles and 3,600 feet of descent down Lewis Creek on loose granite: poles and steady knees.',
      'Entering Emerald Pool and the Silver Apron is prohibited: the current above both falls is lethal.',
    ],
    sources: [
      { label: 'NPS: Wilderness trailheads (distances)', url: 'https://www.nps.gov/yose/planyourvisit/upload/wildernesstrailheads.pdf' },
      { label: 'NPS: Tuolumne Meadows backpacking trails', url: 'https://www.nps.gov/yose/planyourvisit/tuolumne-backpacking-trails.htm' },
      { label: 'NPS: Little Yosemite Valley', url: 'https://www.nps.gov/yose/planyourvisit/lyv.htm' },
      { label: 'NPS: Wilderness trailheads and quotas', url: NPS_TRAILHEADS },
      { label: 'Recreation.gov: Yosemite wilderness permits', url: RECGOV },
    ],
  },
]

export const BACKPACK_TRIPS: BackpackTripT[] = BackpackTrips.parse(seed).sort((a, b) => a.order - b.order)

export function getBackpackTripById(id: string): BackpackTripT | undefined {
  return BACKPACK_TRIPS.find((t) => t.id === id)
}
