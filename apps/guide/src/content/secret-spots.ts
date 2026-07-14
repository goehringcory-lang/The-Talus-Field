// =============================================================================
// SECRET SPOTS — the region-less half of The Secret Guide (/secret-guide).
//
// Ships populated (the old "seeded empty, unlocks later" machinery is gone).
// Same shape as a Stop minus `region` (these live outside the four-region
// geography); `category` places each spot under a Secret Guide filter tab.
// Every coord here still needs a real ground-truth pass before launch, same
// rule as stops.ts — all are marked TODO: verify.
// =============================================================================

import { z } from 'zod'
import { SecretSpots, type SecretSpotT } from './schema'

type SecretSpotInput = z.input<typeof SecretSpots>[number]

const seed: SecretSpotInput[] = [
  {
    id: 'fern-spring',
    title: 'Fern Spring, the smallest waterfall in the park',
    order: 1,
    category: 'vistas',
    kind: 'viewpoint',
    coord: [-119.66500, 37.71556], // verified 2026-07: spring location via findaspring.com + oceanlight.com (Phil Colla); 37°42′56.02″N 119°39′54.00″W; ~500 ft ESE of Pohono Bridge per Gary Hart
    elevationFt: 3900,
    timeBudgetMin: 10,
    body:
      'A spring-fed pool at the edge of Southside Drive, just past the Pohono Bridge as you enter the valley, dropping maybe a foot over a mossy stone lip. Locals call it the smallest waterfall in the park, half as a joke and half not. Everyone drives past it: you have just come through the entrance, Tunnel View and Bridalveil are minutes ahead, and a one-foot waterfall does not read as a stop. That is exactly why it works.\n\n' +
      'Go in the morning, when low light comes through the trees and the ferns around the pool are backlit. On any given dawn there is a decent chance the only other person there is a photographer with a tripod, working the long exposures. The pull-off is small and unsigned in any useful way; the tell is the wet rock at the road edge. Ten minutes. It sets the scale for the day: the park does small as well as it does enormous, and almost nobody looks at the small.',
    photos: [{ src: '/photos/fern-spring.jpg' }],
  },
  {
    id: 'happy-isles-ouzel-watch',
    title: 'The ouzel watch, Merced riffles at Happy Isles',
    order: 2,
    category: 'vistas',
    kind: 'viewpoint',
    coord: [-119.5583, 37.7322], // TODO: verify (Happy Isles bridge over the Merced)
    elevationFt: 4035,
    timeBudgetMin: 30,
    body:
      'The water ouzel, officially the American dipper, is a dark, robin-sized bird that walks underwater. It grips the stream bottom with oversized feet and forages for insect larvae in current that would sweep you off yours. The fast, cold, well-oxygenated riffles of the Merced around Happy Isles are exactly its habitat, and the bridges here give you a stable place to stand and scan.\n\n' +
      'How to find one: watch the midstream rocks, not the banks. The giveaway is the dip, a constant knee-bend bobbing the bird does while standing on wet rock. Then it steps off the rock into whitewater and disappears, and 10 to 20 seconds later it pops up somewhere else. Once you have seen the dip you cannot miss it again. The footbridge below Vernal Fall, a short walk up the trail, is another reliable post.\n\n' +
      'Winter is the secret season. Ouzels do not migrate; they stay on the open water all year, and they sing through the cold months when almost no other bird does and almost no other visitor is listening. A gray January morning on an empty riverbank, one bird singing over the riffle, is the kind of thing this section of the guide exists for. Seeing one at all is good news, by the way: ouzels only live in cold, fast, clean water. The bird is the stream\'s health report.',
    photos: [{ src: '/photos/happy-isles-ouzel-watch.jpg' }],
  },
  {
    id: 'el-cap-meadow-after-dark',
    title: 'El Capitan Meadow after dark',
    order: 3,
    category: 'after-dark',
    kind: 'viewpoint',
    coord: [-119.6354, 37.7238], // verified 2026-07: same pullout as el-capitan-meadow stop on Northside Dr (evendo/Expedia, agent review); prior pin was ~480 m SE toward the Merced
    elevationFt: 4000,
    timeBudgetMin: 30,
    body:
      'You already know this meadow from the daytime stop, watching climbers through binoculars. Come back after full dark. The wall you watched all afternoon is now a black absence against the stars, and scattered across it, a thousand and two thousand feet up, are points of light: the headlamps of climbers settled onto their portaledges for the night. Standard routes take parties three to five days, which means on any summer night there are people cooking dinner and going to sleep on a vertical wall above you.\n\n' +
      'Park at the same Northside Drive pullout, walk a few steps into the meadow, turn your headlamp off, and give your eyes ten minutes. The lights resolve slowly. Some are steady, some move as a climber sorts gear. Twenty to thirty minutes is the right stay: long enough to pick out several camps and register what you are looking at, short enough that you are not standing in a dark meadow past the point of the idea.\n\n' +
      'Two courtesies. Sound carries at night and the people on the wall are trying to sleep, so keep voices down. And do not sweep the wall with a bright light; use a red lamp for your own footing and leave the beam out of the sky.',
    photos: [{ src: '/photos/el-cap-meadow-after-dark.jpg' }],
  },
  {
    id: 'olmsted-point-at-night',
    title: 'Olmsted Point at night, the stargazing pullout',
    order: 4,
    category: 'after-dark',
    kind: 'parking',
    coord: [-119.4852, 37.8107], // verified 2026-07: same Olmsted Point pullout as the daytime stop (NPS/Wikipedia); prior pin was ~300 m WSW where there is no lot
    elevationFt: 8300,
    timeBudgetMin: 45,
    body:
      'The best drive-to dark sky in the park. Olmsted Point sits at 8,300 feet on Tioga Road with broad horizons, almost no nearby light, and, the part that matters at midnight, flat granite slabs right at the parking area to lie back on. No tripod required, no walking required. Park, walk thirty feet, lie down, lamp off, and give your eyes ten full minutes. The Milky Way from up here is not a faint band; it is textured, with visible dark lanes.\n\n' +
      'Timing is most of the trip. The galactic core is up roughly April through October and best from mid-July through mid-August, arching overhead between about 11 p.m. and 3 a.m. The other half of the equation is the moon: a full moon washes the whole show out, so aim for a new moon week or a night when the moon has not yet risen. The full moon dates for your trip window are in the programs list in this guide; plan around them, not just around the weather.\n\n' +
      'Practical notes. Tioga Road is only open roughly late May through October, so this is a summer and fall spot. It is cold at 8,300 feet after dark even in August, colder than you think because you are lying still; bring a real jacket and a hat. Use a red headlamp and keep phone screens down, both for your own night vision and for the photographer who set up an hour before you arrived.',
    photos: [{ src: '/photos/olmsted-point-at-night.jpg' }],
    swap:
      'If Tioga Road is closed, Glacier Point is the drive-to alternative on the south side (summer Saturdays often have telescope star parties). Tenaya Lake\'s east beach, ten minutes further up Tioga, trades the granite slabs for the Milky Way reflected in still water.',
  },
  // McGurk Meadow lives in stops.ts (hidden collection, glacier-mariposa):
  // the entry there has the verified trailhead coord and the detail page.
  {
    id: 'tuolumne-grove-old-road',
    title: 'Tuolumne Grove, sequoias down the old road',
    order: 6,
    category: 'trails',
    kind: 'trailhead',
    coord: [-119.80561, 37.75826], // verified 2026-07: Tuolumne Grove Trailhead lot, 0.5–0.6 mi east of Crane Flat junction on Tioga Rd (Apple Maps + NPS/yosemitehikes road distance); prior pin was ~185 m south short of the lot
    elevationFt: 6200,
    timeBudgetMin: 120,
    body:
      'Giant sequoias without the Mariposa Grove production: no welcome plaza, no shuttle, no crowd. From the parking lot at Crane Flat, where Tioga Road leaves Big Oak Flat Road, you walk down a mile of the old Big Oak Flat Road itself, the 1874 wagon grade, closed to cars, the same historic road whose lower valley section is a separate day in this guide. The pavement descends about 500 feet through fir forest and delivers you to a couple dozen mature sequoias standing in the drainage.\n\n' +
      'The grove\'s landmark is the Dead Giant, a sequoia snag tunneled for stagecoaches in 1878. You can still walk through it. Look at the living trees while you are down there: the blackened bark scars are not damage in any meaningful sense. Sequoias are built for fire, and the park now runs deliberate restoration burns through this grove because without fire the seedlings never get the bare soil and open light they need. A fire-scarred grove is a functioning one.\n\n' +
      'The catch is the walk out. What was a pleasant mile downhill becomes 500 feet of steady climbing at over 6,000 feet of elevation, and people underestimate it reliably; you will pass them on the way up, stopped and rethinking. It is fine, just honest. Carry water, take it slow, and call the round trip two hours with real time among the trees.',
    photos: [{ src: '/photos/tuolumne-grove-old-road.jpg' }],
    swap:
      'If the Tuolumne Grove lot is full, the Merced Grove trailhead is a few miles west on Big Oak Flat Road: a smaller grove, a similar down-then-up walk, and even fewer people. If you want the full sequoia day with the famous named trees, that is Mariposa Grove, a different trip.',
  },
  {
    id: 'pothole-dome-sunset',
    title: 'Pothole Dome at last light',
    order: 7,
    category: 'after-dark',
    kind: 'trailhead',
    coord: [-119.394554, 37.876928], // verified 2026-07: NPS Pothole Dome Trailhead pullout at the west-end bend of Tioga Rd (NPS TH data + Anne's Travels GPS agree within 10 m); prior pin was ~370 m SW in the meadow
    elevationFt: 8760,
    timeBudgetMin: 45,
    body:
      'The lowest-effort summit in the park. Pothole Dome sits at the west end of Tuolumne Meadows with a pullout right at its base; the round trip is about a mile with 200 feet of gain, and the scramble up the granite takes ten to fifteen minutes. Follow the established path around the meadow edge to the base rather than cutting straight across. The meadow is wet and fragile most of the season, and the detour costs you two minutes.\n\n' +
      'Go for the last hour of the day. From the top, the whole meadow basin spreads east below you toward Lembert Dome and the Cathedral Range, and at sunset the light comes up the meadow lengthwise and turns the grass gold, then amber, then out. Underfoot, the granite itself is part of the show: whole sections are polished to a shine by the glacier that ground over this dome, smooth enough to catch the low sun like wet rock.\n\n' +
      'Bring a headlamp for the walk down; the granite is easy but the light goes fast at 8,700 feet, and the temperature goes with it. If you time it right you descend into a dark meadow with the first stars out and a five-minute walk to the car.',
    photos: [{ src: '/photos/pothole-dome-sunset.jpg' }],
  },
  {
    id: 'cathedral-beach-quiet-picnic',
    title: 'Cathedral Beach, the quiet riverbank',
    order: 8,
    category: 'vistas',
    kind: 'parking',
    coord: [-119.6188, 37.7189], // TODO: verify (Cathedral Beach picnic area, Southside Drive)
    elevationFt: 3950,
    timeBudgetMin: 60,
    body:
      'A small sandy beach on the Merced, reached from a pullout on Southside Drive at the Cathedral Beach picnic area. The river bends here and the beach faces straight upstream at El Capitan, the full wall head-on, and on calm afternoons the water is still enough to hold the reflection. It is the composition people hike for, sitting thirty feet from a road, and in the middle of a summer day you can sit on this sand for an hour and see nobody. That almost never happens in the valley. It happens here.\n\n' +
      'The picnic tables in the trees make it the best lunch stop on the south side of the river; cooler food at a table with 3,000 feet of granite in front of you beats anything sold in the park. Late afternoon is the light: soft on the wall, calm on the water. Note the beach etiquette on containers, since the park asks for cans or plastic rather than glass on the sandy riverbank, and broken glass in sand is exactly as bad as it sounds.\n\n' +
      'Swimming is real here but seasonal. In May and June the Merced is snowmelt, fast and genuinely cold, and the current is stronger than the surface suggests; stay out. By late July and August the river has dropped and warmed at the edges and a wade or a short swim off the beach is one of the better hours the valley offers.',
    photos: [{ src: '/photos/cathedral-beach-quiet-picnic.jpg' }],
    swap:
      'If the pullout is taken or the beach has company, Sentinel Beach is a mile east on the same road: same river, same picnic setup, Half Dome instead of El Capitan on a calm morning.',
  },

  // --- Parking moves -------------------------------------------------------
  {
    id: 'sentinel-beach-parking',
    title: 'Sentinel Beach, park first and swim',
    order: 9,
    category: 'parking',
    kind: 'parking',
    coord: [-119.604146, 37.734834], // user-provided — TODO: verify on the ground
    body:
      'Sentinel Beach is on the maps, so this is less a secret than a persistent gap in the parking wars: most of the time there are spaces here, and a nice sandy stretch of the Merced right off the lot to jump in for a swim. The pro move is to treat it as your base for the whole day. Park, swim, and bring a bike: from here you ride into the main section of the valley instead of joining the circling queue for a spot further east.',
    hazard:
      'In May and June the Merced is fast, cold snowmelt and the current is stronger than the surface suggests. Save the swim for mid and late summer, when the river has dropped and warmed.',
    photos: [],
  },
  {
    id: 'el-cap-crossover-parking',
    title: 'Park at El Capitan, skip the east valley',
    order: 10,
    category: 'parking',
    kind: 'parking',
    coord: [-119.6314, 37.7240], // verified 2026-07: El Capitan Bridge / crossover parking (OSM + Natural Atlas); prior user pin was ~840 m west at the meadow pullouts, not the bridge the body describes
    body:
      'The east valley is where parking goes to die by mid-morning. Skip the battle for spaces entirely: park at El Capitan, where the lot holds out far longer, and enjoy the views while you are at it. From El Capitan Bridge, ride a bike in or take the free shuttle to the east end. You trade half an hour of circling for a short ride with the biggest wall in the park behind you.',
    photos: [],
  },
  {
    id: 'sentinel-dome-overflow',
    title: 'Sentinel Dome and Taft Point, the overflow move',
    order: 11,
    category: 'parking',
    kind: 'parking',
    coord: [-119.580376, 37.719110], // user-provided — TODO: verify on the ground
    body:
      'The shared lot for Sentinel Dome and Taft Point is small and fills early on any good-weather day. A full lot is not a turnaround. Just along Glacier Point Road there is a service road with room to park; leave the car there and walk up to Sentinel Dome from the road. It adds a stretch of walking, not a change of plans.',
    photos: [],
  },
  {
    id: 'foresta-barns-loop',
    title: 'The Foresta loop, barns and bridges',
    order: 12,
    category: 'parking',
    kind: 'trailhead',
    coord: [-119.750678, 37.702540], // user-provided — TODO: verify on the ground
    body:
      'Foresta is a small community off Big Oak Flat Road that visitors drive past without registering. Park next to the old barns and walk the loop: over the old bridge behind the green house, then around First Street and Dana Way. The views of El Capitan and Half Dome from out here are beautiful, and almost no one other than the locals and the short-term renters knows the walk exists. It is a neighborhood, so walk it like one: quietly, on the roads.',
    photos: [],
  },

  // --- Quiet camping -------------------------------------------------------
  {
    id: 'foresta-forest-service-camping',
    title: 'The Forest Service camp with the valley views',
    order: 13,
    category: 'camping',
    kind: 'camping',
    coord: [-119.765725, 37.708092], // user-provided — TODO: verify on the ground
    body:
      'Just outside Yosemite Valley there is Forest Service land where you can camp with views of El Capitan and Half Dome. No toilets, no amenities, no reservations needed, and no fee machinery, which is exactly why so few people know it is here. Pack out everything you pack in, and keep the location to yourself. Keep it secret, keep it safe.',
    hazard:
      'Dispersed camping with no toilets, no water, and no services. Check current fire restrictions before lighting anything.',
    photos: [],
  },
  {
    id: 'little-nellie-falls',
    title: 'Little Nellie Falls',
    order: 14,
    category: 'camping',
    kind: 'camping',
    coord: [-119.782716, 37.720222], // user-provided — TODO: verify on the ground
    body:
      'A great location for a hike, and even better as an overnight: there is a backcountry campsite at the falls with a picnic table, which is more furniture than most wilderness sites offer. The falls are the destination; the quiet is the point.',
    photos: [],
  },
  {
    id: 'inspiration-point',
    title: 'Inspiration Point, Tunnel View without the people',
    order: 15,
    category: 'camping',
    kind: 'camping',
    coord: [-119.682513, 37.714671], // user-provided — TODO: verify on the ground
    body:
      'The Tunnel View, with no people. Inspiration Point sits above the tunnel with the same framed valley composition, and almost everyone stays down at the parking lot. The quiet part is the paperwork: this is a backpacking zone with a permit you can actually register for, which means the view can be yours at sunrise, from a sleeping bag.',
    photos: [],
  },
  {
    id: 'hidden-lake',
    title: 'Hidden Lake',
    order: 16,
    category: 'camping',
    kind: 'camping',
    coord: [-119.495897, 37.805353], // user-provided — TODO: verify on the ground
    body:
      'A great spot just off the road, with a backpacking permit that is actually attainable. Short approach, real lake, obtainable paperwork. That combination is rare enough in this park to earn the name.',
    photos: [],
  },
]

export const SECRET_SPOTS: SecretSpotT[] = SecretSpots.parse(seed).sort(
  (a, b) => a.order - b.order,
)

