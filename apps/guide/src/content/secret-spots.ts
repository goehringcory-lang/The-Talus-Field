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
    teaser:
      'A spring-fed pool dropping a foot over a mossy lip beside Southside Drive. The smallest waterfall in the park, and the first stop almost everyone drives past.',
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
    teaser:
      'A robin-sized bird that walks underwater works the Merced riffles here all year. Learn the dip once and you cannot miss it again.',
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
    teaser:
      'Come back after dark: the wall becomes a black absence scattered with headlamps, climbers cooking dinner on portaledges a thousand feet up.',
    body:
      'You already know this meadow from the daytime stop, watching climbers through binoculars. Come back after full dark. The wall you watched all afternoon is now a black absence against the stars, and scattered across it, a thousand and two thousand feet up, are points of light: the headlamps of climbers settled onto their portaledges for the night. Standard routes take parties three to five days, which means on any summer night there are people cooking dinner and going to sleep on a vertical wall above you.\n\n' +
      'Park at the same Northside Drive pullout, walk a few steps into the meadow, turn your headlamp off, and give your eyes ten minutes. The lights resolve slowly. Some are steady, some move as a climber sorts gear. Twenty to thirty minutes is the right stay: long enough to pick out several camps and register what you are looking at, short enough that you are not standing in a dark meadow past the point of the idea.\n\n' +
      'Two courtesies. Sound carries at night and the people on the wall are trying to sleep, so keep voices down. And do not sweep the wall with a bright light; use a red lamp for your own footing and leave the beam out of the sky.',
    photos: [{ src: '/photos/el-cap-meadow-after-dark.jpg', caption: 'Yosemite Valley after dark from Tunnel View, El Capitan on the left. From the meadow you stand directly beneath that wall, watching headlamps on it.' }],
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
    teaser:
      'The best drive-to dark sky in the park: flat granite slabs at 8,300 feet, thirty feet from the car, the Milky Way textured with dark lanes.',
    body:
      'The best drive-to dark sky in the park. Olmsted Point sits at 8,300 feet on Tioga Road with broad horizons, almost no nearby light, and, the part that matters at midnight, flat granite slabs right at the parking area to lie back on. No tripod required, no walking required. Park, walk thirty feet, lie down, lamp off, and give your eyes ten full minutes. The Milky Way from up here is not a faint band; it is textured, with visible dark lanes.\n\n' +
      'Timing is most of the trip. The galactic core is up roughly April through October and best from mid-July through mid-August, arching overhead between about 11 p.m. and 3 a.m. The other half of the equation is the moon: a full moon washes the whole show out, so aim for a new moon week or a night when the moon has not yet risen. The full moon dates for your trip window are in the programs list in this guide; plan around them, not just around the weather.\n\n' +
      'Practical notes. Tioga Road is only open roughly late May through October, so this is a summer and fall spot. It is cold at 8,300 feet after dark even in August, colder than you think because you are lying still; bring a real jacket and a hat. Use a red headlamp and keep phone screens down, both for your own night vision and for the photographer who set up an hour before you arrived.',
    photos: [{ src: '/photos/olmsted-point-at-night.jpg' }],
    swap:
      'If Tioga Road is closed, [Glacier Point](/stop/glacier-point) is the drive-to alternative on the south side (summer Saturdays often have telescope star parties). [Tenaya Lake](/stop/tenaya-lake)\'s east beach, ten minutes further up Tioga, trades the granite slabs for the Milky Way reflected in still water.',
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
    teaser:
      'Sequoias without the production: a mile down the 1874 wagon road to a couple dozen giants and the drive-through Dead Giant. The climb back out is the price.',
    body:
      'Giant sequoias without the Mariposa Grove production: no welcome plaza, no shuttle, no crowd. From the parking lot at Crane Flat, where Tioga Road leaves Big Oak Flat Road, you walk down a mile of the old Big Oak Flat Road itself, the 1874 wagon grade, closed to cars, the same historic road whose lower valley section is a separate day in this guide. The pavement descends about 500 feet through fir forest and delivers you to a couple dozen mature sequoias standing in the drainage.\n\n' +
      'The grove\'s landmark is the Dead Giant, a sequoia snag tunneled for stagecoaches in 1878. You can still walk through it. Look at the living trees while you are down there: the blackened bark scars are not damage in any meaningful sense. Sequoias are built for fire, and the park now runs deliberate restoration burns through this grove because without fire the seedlings never get the bare soil and open light they need. A fire-scarred grove is a functioning one.\n\n' +
      'The catch is the walk out. What was a pleasant mile downhill becomes 500 feet of steady climbing at over 6,000 feet of elevation, and people underestimate it reliably; you will pass them on the way up, stopped and rethinking. It is fine, just honest. Carry water, take it slow, and call the round trip two hours with real time among the trees.',
    photos: [{ src: '/photos/tuolumne-grove-old-road.jpg' }],
    swap:
      'If the Tuolumne Grove lot is full, the [Merced Grove](/stop/merced-grove) trailhead is a few miles west on Big Oak Flat Road: a smaller grove, a similar down-then-up walk, and even fewer people. If you want the full sequoia day with the famous named trees, that is [Mariposa Grove](/stop/mariposa-grove), a different trip.',
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
    teaser:
      'The lowest-effort summit in the park: about a mile round trip, 200 feet up, and the whole Tuolumne basin turning gold at last light.',
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
    teaser:
      'A sandy Merced beach staring straight up at El Capitan, thirty feet from Southside Drive, and empty at midday when nowhere else in the valley is.',
    body:
      'A small sandy beach on the Merced, reached from a pullout on Southside Drive at the Cathedral Beach picnic area. The river bends here and the beach faces straight upstream at El Capitan, the full wall head-on, and on calm afternoons the water is still enough to hold the reflection. It is the composition people hike for, sitting thirty feet from a road, and in the middle of a summer day you can sit on this sand for an hour and see nobody. That almost never happens in the valley. It happens here.\n\n' +
      'The picnic tables in the trees make it the best lunch stop on the south side of the river; cooler food at a table with 3,000 feet of granite in front of you beats anything sold in the park. Late afternoon is the light: soft on the wall, calm on the water. Note the beach etiquette on containers, since the park asks for cans or plastic rather than glass on the sandy riverbank, and broken glass in sand is exactly as bad as it sounds.\n\n' +
      'Swimming is real here but seasonal. In May and June the Merced is snowmelt, fast and genuinely cold, and the current is stronger than the surface suggests; stay out. By late July and August the river has dropped and warmed at the edges and a wade or a short swim off the beach is one of the better hours the valley offers.',
    photos: [{ src: '/photos/cathedral-beach-quiet-picnic.jpg' }],
    swap:
      'If the pullout is taken or the beach has company, [Sentinel Beach](/stop/sentinel-beach-parking) is a mile east on the same road: same river, same picnic setup, Half Dome instead of El Capitan on a calm morning.',
  },

  // --- Parking moves -------------------------------------------------------
  {
    id: 'sentinel-beach-parking',
    title: 'Sentinel Beach, park first and swim',
    order: 9,
    category: 'parking',
    kind: 'parking',
    coord: [-119.604146, 37.734834], // user-provided — TODO: verify on the ground
    teaser:
      'Usually has spaces when the east valley is full. Park, swim the sandy stretch off the lot, and bike in instead of joining the circling queue.',
    body:
      'Sentinel Beach is on the maps, so this is less a secret than a persistent gap in the parking wars: most of the time there are spaces here, and a nice sandy stretch of the Merced right off the lot to jump in for a swim. The pro move is to treat it as your base for the whole day. Park, swim, and bring a bike: from here you ride into the main section of the valley instead of joining the circling queue for a spot further east.',
    hazard:
      'In May and June the Merced is fast, cold snowmelt and the current is stronger than the surface suggests. Save the swim for mid and late summer, when the river has dropped and warmed.',
    photos: [{ src: '/photos/sentinel-beach-parking.jpg', caption: 'A sandy Merced River bank on the Valley floor, slow water and granite above it. Sentinel Beach is exactly this.' }],
  },
  {
    id: 'el-cap-crossover-parking',
    title: 'Park at El Capitan, skip the east valley',
    order: 10,
    category: 'parking',
    kind: 'parking',
    coord: [-119.6314, 37.7240], // verified 2026-07: El Capitan Bridge / crossover parking (OSM + Natural Atlas); prior user pin was ~840 m west at the meadow pullouts, not the bridge the body describes
    teaser:
      'The east valley\'s parking dies by mid-morning; this lot holds out far longer. Park at the bridge, then bike or shuttle east with the Captain behind you.',
    body:
      'The east valley is where parking goes to die by mid-morning. Skip the battle for spaces entirely: park at El Capitan, where the lot holds out far longer, and enjoy the views while you are at it. From El Capitan Bridge, ride a bike in or take the free shuttle to the east end. You trade half an hour of circling for a short ride with the biggest wall in the park behind you.',
    photos: [{ src: '/photos/el-cap-crossover-parking.jpg', caption: 'El Capitan from El Capitan Meadow, the view from the crossover.' }],
  },
  {
    id: 'sentinel-dome-overflow',
    title: 'Sentinel Dome and Taft Point, the overflow move',
    order: 11,
    category: 'parking',
    kind: 'parking',
    coord: [-119.580376, 37.719110], // user-provided — TODO: verify on the ground
    teaser:
      'The shared Sentinel Dome and Taft Point lot fills early, but a full lot is not a turnaround: a service road along Glacier Point Road adds walking, not a new plan.',
    body:
      'The shared lot for Sentinel Dome and Taft Point is small and fills early on any good-weather day. A full lot is not a turnaround. Just along Glacier Point Road there is a service road with room to park; leave the car there and walk up to Sentinel Dome from the road. It adds a stretch of walking, not a change of plans.',
    photos: [{ src: '/photos/sentinel-dome-overflow.jpg', caption: 'The Jeffrey pine on Sentinel Dome\'s summit, photographed before it fell in 2003. The dome is the same.' }],
  },
  {
    id: 'foresta-barns-loop',
    title: 'The Foresta loop, barns and bridges',
    order: 12,
    // 'trails', not 'parking': the entry is a walking loop, and the Parking
    // tab promises somewhere to put the car.
    category: 'trails',
    kind: 'trailhead',
    coord: [-119.750678, 37.702540], // user-provided — TODO: verify on the ground
    teaser:
      'A neighborhood walk past old barns and an old bridge, with El Capitan and Half Dome from angles almost nobody collects.',
    body:
      'Foresta is a small community off Big Oak Flat Road that visitors drive past without registering. Park next to the old barns and walk the loop: over the old bridge behind the green house, then around First Street and Dana Way. The views of El Capitan and Half Dome from out here are beautiful, and almost no one other than the locals and the short-term renters knows the walk exists. It is a neighborhood, so walk it like one: quietly, on the roads.',
    photos: [{ src: '/photos/foresta-barns-loop.jpg', caption: 'Foresta\'s meadows after the fire, the Valley\'s walls in the distance. The loop runs through this ground.' }],
  },

  // --- Quiet camping -------------------------------------------------------
  {
    id: 'foresta-forest-service-camping',
    title: 'The Forest Service camp with the valley views',
    order: 13,
    category: 'camping',
    kind: 'camping',
    coord: [-119.765725, 37.708092], // user-provided — TODO: verify on the ground
    teaser:
      'Forest Service land just outside the valley where you can camp with El Capitan views: no fees, no reservations, no amenities, and pack-it-all-out rules.',
    body:
      'Just outside Yosemite Valley there is Forest Service land where you can camp with views of El Capitan and Half Dome. No toilets, no amenities, no reservations needed, and no fee machinery, which is exactly why so few people know it is here. Pack out everything you pack in, and don\'t publish the pin. The place stays good exactly as long as it stays quiet.',
    hazard:
      'Dispersed camping with no toilets, no water, and no services. Check current fire restrictions before lighting anything.',
    photos: [{ src: '/photos/foresta-forest-service-camping.jpg', caption: 'A Stanislaus National Forest campsite: a table, a bear box, and no reservation.' }],
  },
  {
    id: 'little-nellie-falls',
    title: 'Little Nellie Falls, the old wagon road out of Foresta',
    order: 14,
    category: 'camping',
    kind: 'camping',
    coord: [-119.782716, 37.720222], // user-provided — TODO: verify on the ground
    elevationFt: 4600,
    timeBudgetMin: 180,
    season: 'Spring to early summer',
    teaser:
      'Five and a half miles of the 1874 Coulterville wagon road, out and back from Foresta, to a fifteen-foot fall in Stanislaus National Forest with a picnic table at the bottom of it.',
    body:
      'The Old Coulterville Road was the first wagon road into Yosemite Valley, finished in 1874, and the stretch west of Foresta is now a quiet forest track that almost nobody drives to. Park where the road forks a few miles into the Foresta area, take the right fork on foot past the south side of Big Meadow, and follow the old grade as it climbs. Little Nellie Falls is about 2.8 miles out, 5.6 round trip with roughly 470 feet of gain: a fifteen-foot fall on Little Crane Creek, just over the park boundary in Stanislaus National Forest, with a picnic table and the sound of the creek and, most days, nobody.\n\n' +
      'The route forks four times. Bear right at the first three, which all come early, and left at the last. The 2009 Big Meadow fire and the 2013 Rim Fire both burned through here, so the walk is partly through regrowth and standing snags rather than old forest; the payoff is the open views back toward the Valley rim that the fires opened up, and the flowers that follow fire in spring.\n\n' +
      'The fall is best in spring and early summer, when Little Crane Creek is carrying snowmelt; by late summer it is a trickle. Because the site is national forest rather than park, the overnight rules are the forest\'s, not Yosemite\'s: no wilderness permit, a California campfire permit for any flame, and a check of current fire restrictions before you light anything. Pack out everything.',
    hazard:
      'The route crosses two burn scars: snags fall without wind and the shade is thin. Carry water; the creek is the only source and needs treating.',
    photos: [{ src: '/photos/foresta-cascades.jpg', caption: 'A fall in the trees off the old road. Little Nellie is smaller, with a picnic table at the bottom of it.' }], // stand-in: not this entry, see guide-photo-manifest.json
  },
  {
    id: 'inspiration-point',
    title: 'Inspiration Point, Tunnel View without the people',
    order: 15,
    category: 'camping',
    kind: 'camping',
    coord: [-119.682513, 37.714671], // user-provided — TODO: verify on the ground
    elevationFt: 5400,
    timeBudgetMin: 150,
    difficulty: 'moderate',
    teaser:
      'Tunnel View\'s framed composition from the old stage road above the tunnel, with nobody in it, and a wilderness permit you can actually get that puts the view at sunrise from a sleeping bag.',
    body:
      'The Tunnel View, with no people. The Pohono Trail starts across Wawona Road from the Tunnel View lots and climbs the old Wawona stage road grade, the one the tunnel replaced in 1933: 1.3 miles and about 1,000 feet to Inspiration Point, the same framed composition of El Capitan, Bridalveil and Half Dome that a thousand people are photographing below you, seen from a granite slab you may have to yourself. Old Inspiration Point, the stage-road overlook the 1850s travelers stopped at, is another mile and a few hundred feet on. Almost everyone stays at the parking lot.\n\n' +
      'The quiet part is the paperwork. This is wilderness, and a wilderness permit for the Pohono Trail from Tunnel View is one of the easier ones in the park to hold, reservable six months out and often available the day before at a permit station, because the trail is a hard climb to a ridge with no lake at the end of it. Camping is dispersed, not at a site, and the rules that govern the Valley rim apply: well back from the trail and the viewpoint, no fires, a bear canister. What that buys you is the Valley at first light from your sleeping bag, the walls turning color before the first car reaches the tunnel.\n\n' +
      'It is a real climb with no water on it. Carry what you will drink, start early in summer, and read the current permit rules on the wilderness pages before you count on a spot.',
    hazard:
      'No water on the trail or at the top. The old grade has loose sand and drop-offs behind the brush at the viewpoint.',
    photos: [{ src: '/photos/inspiration-point.jpg', caption: 'The framed valley composition. Inspiration Point sits on the old road above the tunnel.' }],
  },
  {
    id: 'hidden-lake',
    title: 'Hidden Lake, the tarn behind Olmsted Point',
    order: 16,
    category: 'camping',
    kind: 'camping',
    coord: [-119.495897, 37.805353], // user-provided — TODO: verify on the ground
    elevationFt: 8250,
    timeBudgetMin: 120,
    season: 'Tioga Road season',
    teaser:
      'A small granite tarn a short walk from Tioga Road with no official trail to it, and a wilderness permit that is actually attainable. Short approach, real lake, obtainable paperwork.',
    body:
      'A small lake in the granite between Olmsted Point and the west end of Tenaya Lake, with no official trail and no sign, which is why it has the name. The approach is short, under a mile of route-finding over slabs and through lodgepole from the road, and it asks for the kind of attention a marked trail does not: pick a line, note it, and expect to walk it back. The Tenaya Lake to Yosemite Valley trail passes north of the lake on its way toward Mount Watkins and Snow Creek, and a ridge on that trail gives a glimpse of it, but the lake itself belongs to whoever walks in.\n\n' +
      'The combination is what earns the entry: a real lake with granite shores at 8,000 feet, a walk you can do in an afternoon, and, for a night, a wilderness permit from a trailhead that is not one of the famous ones. Any overnight in the park\'s wilderness needs the permit and a bear canister, and the standing rule of at least a mile from the road and out of sight of it decides where the tent goes, so the lake is a base for a camp beyond it rather than a site on its shore. Read the current trailhead rules before you count on it.\n\n' +
      'Day or night, the reward is the same: an hour on warm granite by still water, with Tioga Road traffic audible somewhere behind you and nobody in front of you.',
    hazard:
      'No trail. Route-finding over granite and through forest; carry a map and a fix of the car, and turn back if the line stops making sense. Mosquitoes are serious through July.',
    photos: [{ src: '/photos/backcountry-camp-alpenglow.jpg', caption: 'A backcountry camp at first light, everything carried in. Hidden Lake asks for a short walk and a permit you can actually get.' }], // stand-in: not this entry, see guide-photo-manifest.json
  },

  // --- Quiet vistas, second set (September 2026 pass) ----------------------
  {
    id: 'swinging-bridge-reflection',
    title: 'Swinging Bridge, the Yosemite Falls reflection',
    order: 17,
    category: 'vistas',
    kind: 'viewpoint',
    coord: [-119.600316, 37.736968], // verified 2026-09: Swinging Bridge picnic-area lot on Southside Dr (NPS place page; OSM node "Swinging Bridge" at -119.6003, 37.7370 agrees within 20 m)
    elevationFt: 4000,
    timeBudgetMin: 30,
    teaser:
      'The whole 2,425 feet of Yosemite Falls standing upside down in the Merced, from a footbridge thirty steps from a picnic lot that the tour buses do not stop at.',
    body:
      'The classic Yosemite Falls reflection is shot from here, and most visitors never find it: a small picnic area on Southside Drive between Sentinel Beach and the chapel, a few tables in the trees, and a footbridge over the Merced with the full height of the falls lined up above the water. The name is a leftover. The original suspension footbridge was wrecked by flood after flood and replaced with a fixed one after the 1964 flood, so it does not swing, and the 1965 bridge has held through everything since, including 1997.\n\n' +
      'The reflection has a recipe. The falls face the morning sun, so the upper fall is fully lit by mid-morning, and the reflection works in the window when the wall is bright but the sun has not yet reached the water: roughly the hour after the light comes over the rim. The water has to be slow enough to hold it. At peak spring flow the falls are enormous and the river is fast, and you get a softer, moving reflection; by late summer the river is glassy and the falls may be a wet streak, so May and early June are the compromise. Three stands: upstream of the bridge for the clean reflection, on it for the height, downstream to put the bridge in the frame.\n\n' +
      'The beach under the bridge is the Valley\'s best-known swimming hole later in summer, mostly shallow with a few deep holes. Parking is a dozen spaces and no more, so treat it as a morning stop; the Four Mile Trail shuttle stop is a short walk west.',
    hazard:
      'No jumping or diving from the bridge. In May and June the current under it is strong and cold; the swim is a July and August thing.',
    photoTiming: { best: 'golden-am', note: 'Mid-morning, once the sun lights the upper fall and before it reaches the river.' },
    photos: [{ src: '/photos/swinging-bridge-reflection.jpg', caption: 'Yosemite Falls standing on its head in the Merced at Swinging Bridge.' }],
    swap:
      'If the lot is full, [Sentinel Beach](/stop/sentinel-beach-parking) is a few hundred yards west with the same river and a bigger lot, and [Cook\'s Meadow](/stop/cooks-meadow-loop) puts the falls behind the meadow instead of the water.',
  },
  {
    id: 'siesta-lake',
    title: 'Siesta Lake, the pond Tioga Road bends around',
    order: 18,
    category: 'vistas',
    kind: 'viewpoint',
    coord: [-119.66028, 37.85147], // verified 2026-09: HAER Tioga Road survey photo caption "view at Siesta Lake", N 37°51'05.3" W 119°39'37.0" (Library of Congress); pullout on the south shoulder
    elevationFt: 7990,
    timeBudgetMin: 15,
    season: 'Tioga Road season',
    teaser:
      'A shallow spring-fed pond on the south side of Tioga Road, unsigned, a mile west of the White Wolf turnoff, that holds a still reflection of the firs at dawn and turns red around the edges in October.',
    body:
      'Tioga Road passes dozens of things worth stopping for and signs almost none of them. Siesta Lake is one: a small spring-fed pond ringed by lodgepole and red fir on the south side of the road, about 13 miles east of Crane Flat and a mile short of the White Wolf turnoff. There is no sign and no lot, only a shoulder pullout, and at 60 miles an hour it is a flash of water between trees. The road engineers of the 1950s liked it enough to bend the new alignment around it rather than fill it.\n\n' +
      'It is not an alpine lake. It is no more than five feet deep, which is why the fish that were once stocked here winter-killed and were gone by the mid-1950s, and why it is glassy on a still morning when the bigger lakes are not: nothing moves it. Dawn gives you the firs standing on their heads in it; October, when the shoreline shrubs go red and orange, is the color. The park\'s old auto-tour guide noted the black-backed woodpecker nesting here, a bird of burned and beetle-killed forest that is a real find for anyone keeping a list.\n\n' +
      'Fifteen minutes. It is the kind of stop this section exists for: on the way to somewhere, free of anything to do, and better than most of the things you were driving toward.',
    hazard:
      'The pullout is on a curve. Get the car fully off the pavement and cross on foot with the road in view both ways.',
    photoTiming: { best: 'sunrise', note: 'Dead calm water at first light, before the road wakes up.' },
    photos: [{ src: '/photos/siesta-lake.jpg' }],
  },
  {
    id: 'wawona-point',
    title: 'Wawona Point, the top of the Mariposa Grove',
    order: 19,
    category: 'vistas',
    kind: 'viewpoint',
    coord: [-119.6007, 37.5187], // verified 2026-09: OSM peak node "Wawona Point" (Nominatim); spur from the upper-grove loop past the Fallen Wawona Tunnel Tree
    elevationFt: 6810,
    timeBudgetMin: 300,
    difficulty: 'strenuous',
    season: 'Grove shuttle season',
    teaser:
      'Past the Grizzly Giant the crowd thins to nothing, and the trail keeps climbing through the upper grove to a stone overlook at 6,810 feet where you look down on Wawona instead of up at trees.',
    body:
      'The Mariposa Grove has a top, and almost nobody goes there. From the Arrival Area the Mariposa Grove Trail passes the Grizzly Giant and the California Tunnel Tree, where the shuttle-load of visitors turns around, and then keeps going: up through the upper grove, past the Mariposa Grove Cabin and the Fallen Wawona Tunnel Tree, to a short spur on the old road that ends at Wawona Point. Seven miles round trip from the Arrival Area with 1,200 feet of gain, four to six hours with the trees, and the last mile is yours.\n\n' +
      'The overlook does not face Yosemite Valley. It looks south and west over the Wawona meadow, Wawona Dome, the South Fork of the Merced and the old Chowchilla Mountain wagon road, 3,000 feet below, which is exactly why it is quiet: it is a view of the part of the park people drive through. The stone parapet was rebuilt in the grove restoration that closed the grove from 2015 to 2018 and took out the tram, the gift shop and the asphalt. The Wawona Tunnel Tree you pass on the way, tunneled in 1881 for a stagecoach fare, fell under snow in February 1969 and was left where it lies.\n\n' +
      'Ride the free shuttle from the Welcome Plaza to the Arrival Area and start early; the plaza lot is about 300 spaces and fills by late morning in season. Outside the shuttle season the grove is a two-mile walk from the plaza before the trail even starts, which makes this a full day.',
    hazard:
      'Sun and sand on the upper road, and 6,800 feet of elevation. Carry more water than the grove\'s lower loop suggests.',
    photos: [{ src: '/photos/wawona-point.jpg', caption: 'The view from Wawona Point: Wawona and the South Fork country, 3,000 feet below.' }],
    swap:
      'If the whole grove is the day, [Mariposa Grove](/stop/mariposa-grove) is the core stop. For a valley-scale overlook at the same effort, [Sentinel Dome](/stop/sentinel-dome) is the one.',
  },
  {
    id: 'union-point',
    title: 'Union Point, the perch on the Four Mile Trail',
    order: 20,
    category: 'vistas',
    kind: 'viewpoint',
    coord: [-119.5877, 37.7348], // verified 2026-09: OSM peak node "Union Point" (Nominatim); a few yards off the Four Mile Trail about 3 mi up from the Southside Dr trailhead
    elevationFt: 6314,
    timeBudgetMin: 240,
    difficulty: 'strenuous',
    season: 'Trail opens in spring',
    teaser:
      'Two thirds of the way up the Four Mile Trail, a railed rock a few steps off the switchbacks with the whole Valley below it. Most people are looking at their feet when they pass the spur.',
    body:
      'The Four Mile Trail climbs 3,200 feet from Southside Drive to Glacier Point, and the people on it are mostly doing it as a job: down from the top, or up to the view they already know. A little over two thirds of the way up, about three miles and 2,300 feet from the road, a spur of ten yards leaves the trail for a railed rock called Union Point, 2,300 feet above the Valley floor. Yosemite Falls is straight across, Half Dome and North Dome to the east, El Capitan and the Cathedral Rocks west, and the two roads out of the Valley drawn on the floor like a map. It is a better composition than Glacier Point for the falls, and it is empty.\n\n' +
      'The trail was James McCauley\'s toll route, built by John Conway in 1871 and 1872; his crew had reached this point in the spring of 1872 when he was hurt, and the trail opened that summer. The name is almost certainly the 1870s kind of patriotism. It was rebuilt and lengthened to 4.8 miles in the early 1900s and kept the old name, which is why the sign at the bottom is lying to you by nearly a mile.\n\n' +
      'Union Point is also the trail\'s winter gate. When snow closes the upper trail, the lower three miles to a gate just below the point stay open, so in the shoulder seasons this is as high as the trail goes and the reason to walk it. Trailhead parking is a handful of roadside spaces; the Valley shuttle stops at the trailhead.',
    hazard:
      'Drop-offs hidden by brush, loose sand on old pavement, and no water on the trail. The rail at the point is old; lean on the rock, not the iron.',
    photos: [{ src: '/photos/union-point.jpg', caption: 'Yosemite Valley from the south wall, El Capitan across the way: the view the Four Mile Trail earns on the way up to Union Point.' }],
    swap:
      'If the whole climb is too much, [Columbia Rock](/hike/columbia-rock) on the Yosemite Falls trail is the same idea from the other wall, a mile up.',
  },

  // --- Hidden trails, across the line --------------------------------------
  {
    id: 'bennettville',
    title: 'Bennettville, the silver town outside Tioga Pass',
    order: 21,
    category: 'trails',
    kind: 'trailhead',
    coord: [-119.2511, 37.9378], // verified 2026-09: Junction Campground / Bennettville trailhead lot at the Saddlebag Lake Rd fork, 2.2 mi east of the Tioga Pass entrance (Inyo NF campground page)
    elevationFt: 9600,
    timeBudgetMin: 150,
    difficulty: 'moderate',
    season: 'Tioga Road season',
    teaser:
      'Two miles east of the Tioga Pass gate, a mile of trail along Mine Creek reaches the two surviving buildings of an 1880s silver town that never shipped an ounce, with two alpine lakes beyond.',
    body:
      'Two miles east of the Tioga Pass entrance, Saddlebag Lake Road leaves Highway 120, and at the fork before the Junction Campground bridge there is a lot for about ten cars. The trail follows Mine Creek up through the meadows for about a mile and 400 feet to Bennettville, which in 1882 was going to be a city. The Great Sierra Consolidated Silver Company sank the Great Sierra Tunnel toward a silver ledge on Tioga Hill, three shifts a day around the clock, spent $300,000, and stopped on July 3, 1884, 1,784 feet in, without shipping a single load of ore. The post office lasted two years. Two of the fourteen buildings survive, the assay office and the bunkhouse, stabilized by the Forest Service in 1993.\n\n' +
      'The town is the reason Tioga Road exists. The company built the Great Sierra Wagon Road, 56 miles in 130 days, to supply the mine from the west; Stephen Mather bought it in 1915 for $15,000 and gave it to the government, and it became the road you drove in on. So the walk is the park\'s origin story, in a national forest, with nobody on it.\n\n' +
      'Keep going. Shell Lake is a few minutes past the cabins and Fantail Lake about three quarters of a mile beyond, both under the Tioga Crest and both worth the extra hour. In July, Mine Creek runs loud with snowmelt beside the whole route.',
    hazard:
      'This is 9,600 to 9,900 feet: altitude, afternoon storms and wind. The tunnel mouth by the creek is an old mine; stay out of it.',
    photos: [{ src: '/photos/bennettville.jpg', caption: 'The Bennettville bunkhouse, one of the two buildings left of the fourteen.' }],
    swap:
      'If the lot is full, [Gaylor Lakes](/stop/gaylor-lake) from the Tioga Pass entrance is the other short walk into the same mining country, inside the park.',
  },

  // --- Parking, second set ---------------------------------------------------
  {
    id: 'valley-trailhead-parking',
    title: 'The trailhead lot past Curry Village',
    order: 22,
    category: 'parking',
    kind: 'parking',
    coord: [-119.566577, 37.735344], // verified 2026-07: same lot as the curry-village-day-use-lot amenity and the editorial curry-village-trailhead-parking pin
    elevationFt: 4000,
    timeBudgetMin: 10,
    teaser:
      'A lot most visitors never see, past the end of Curry Village on the road toward Happy Isles: half a mile from the Mist Trail, and the only Valley lot where a car can legally sit for days.',
    body:
      'Beyond Curry Village, the road continues toward Happy Isles and is closed to everything but shuttles and park vehicles. Just before the closure is a lot signed Trailhead Parking, built for Mist Trail and Half Dome hikers and, with a wilderness permit, for backpackers leaving a car for days, which no other Valley lot allows. It is half a mile from the Happy Isles trailhead on foot, against a mile from the Curry Village day lot and three from Yosemite Village. Most drivers never get past the village signs.\n\n' +
      'The move is timing. On a summer weekend the lot fills by about 8 a.m.; at 5:30 there are spaces. Park, and you are walking to the Mist Trail before the first shuttle runs, which puts you on the Vernal Fall footbridge with the mist and without the queue. Back at the car, the Curry Village pizza deck is a short walk west.\n\n' +
      'If it is full, do not circle it. Drop back to the Curry Village day lot, then the shuttle to Happy Isles; the lots east of the village all drain the same way and the shuttle is the answer to all of them.',
    photos: [{ src: '/photos/valley-trailhead-parking.jpg', caption: 'The Merced at Happy Isles, half a mile from the lot.' }],
    swap:
      'Full? [Curry Village](/stop/curry-village) has the day lot a mile back, and the [Mist Trail](/stop/mist-trail) entry covers the shuttle from there.',
  },
  {
    id: 'tenaya-lake-lots',
    title: 'Tenaya Lake, three lots and the shoulder rule',
    order: 23,
    category: 'parking',
    kind: 'parking',
    coord: [-119.451882, 37.837954], // NPS API places: Tenaya Lake Picnic Area (same pin as the tenaya-lake stop)
    elevationFt: 8150,
    timeBudgetMin: 10,
    season: 'Tioga Road season',
    teaser:
      'The beach lot at the east end fills first and everyone stops there. The Sunrise trailhead lot at the west end and Murphy Creek in the middle hold out, and the whole east shore is a ten-minute walk from any of them.',
    body:
      'Tenaya Lake has about 230 legal spaces in three places, and on a summer afternoon all of them are taken. The big beach at the east end has the picnic area and the sand, so it fills first. The Sunrise Lakes trailhead lot at the west end is the biggest and the last to fill, because people think it belongs to the hike, and Murphy Creek, the middle picnic area on the north shore, sits between them with its own short path to the water. The lake is a mile long; the walk between any lot and the east beach is ten to fifteen minutes on the loop trail, on the flat.\n\n' +
      'The rule that matters is the shoulder. The park counts about 40 designated roadside spaces along Tioga Road at the lake, and wheels on the pavement or the meadow edge outside them get a ticket, so if the three lots and the marked shoulder are full, the honest answer is to keep driving to Olmsted Point and come back in an hour, not to invent a space.\n\n' +
      'The other timing fact: overnight parking along Tioga Road, including the trailhead lot, ends October 15 every year, before the road itself closes.',
    photos: [{ src: '/photos/tenaya-lake.jpg', caption: 'Tenaya Lake from the east beach. The lots are at both ends and the middle of the north shore.' }],
    swap:
      'If the whole lake is full, [Olmsted Point](/stop/olmsted-point) is five minutes west with a big lot, and the [Tenaya Lake](/stop/tenaya-lake) stop has the beach itself.',
  },

  // --- Camping, second set: over the line and up the rough road ------------
  {
    id: 'yosemite-creek-campground',
    title: 'Yosemite Creek, the campground down the rough road',
    order: 24,
    category: 'camping',
    kind: 'camping',
    coord: [-119.5958, 37.8267], // verified 2026-07: same pin as the yosemite-creek-campground amenity (campground on Yosemite Creek ~5 mi down the old Tioga Rd from the highway)
    elevationFt: 7700,
    timeBudgetMin: 30,
    season: 'July to early September',
    teaser:
      'Seventy-five tent sites at the end of a rough five-mile spur off Tioga Road that keeps out the RVs and most of everyone else, on the creek that becomes Yosemite Falls.',
    body:
      'Of the drive-to campgrounds in the park, this is the one that still feels like camping. A narrow, winding, badly surfaced five-mile spur leaves Tioga Road and drops to a bend in Yosemite Creek at 7,700 feet, where 75 tent sites sit under lodgepole beside the water. The road does the curating: the park says RVs and trailers are not recommended, and they take the hint, so the campground is tents, small cars, and quiet. There is no piped water; the creek is the supply and it has to be treated. Every site has a fire ring, a table and a bear box, and the toilets are vault.\n\n' +
      'The paperwork is the point of this entry. It is one of the campgrounds that releases on recreation.gov two weeks before the arrival date at 7 a.m. Pacific, on a rolling daily window, rather than in the months-ahead scramble that empties the Valley campgrounds in minutes. Fourteen days out, at seven in the morning, with the date already chosen, a site here is a realistic thing to get. The season is short, roughly July to early September.\n\n' +
      'From the campground, the Yosemite Creek trail follows the water downstream toward the top of Yosemite Falls, so the creek at your site is the same water that goes over the lip 2,400 feet above the Valley a few miles on.',
    hazard:
      'Treat all water. The spur is slow and rough in both directions; allow 25 minutes each way, and keep speed down for oncoming cars on the blind bends.',
    photos: [{ src: '/photos/yosemite-creek-campground.jpg', caption: 'Yosemite Creek in the high country. The campground sits on a bend of this water.' }],
    swap:
      'Same two-week release, easier road: [White Wolf](/stop/white-wolf) up the highway, or Porcupine Flat further east.',
  },
  {
    id: 'tioga-lake-campground',
    title: 'Tioga Lake, first-come at 9,700 feet outside the gate',
    order: 25,
    category: 'camping',
    kind: 'camping',
    coord: [-119.2548, 37.9275], // verified 2026-09: OSM camp_site "Tioga Lake Campground" on CA 120 (Nominatim), ~1 mi east of the Tioga Pass entrance
    elevationFt: 9700,
    timeBudgetMin: 30,
    season: 'June to October',
    teaser:
      'Thirteen sites on the shore of Tioga Lake, a mile outside the Tioga Pass entrance in Inyo National Forest: no reservations at all, self-register at the board, and the park gate is five minutes away.',
    body:
      'The park\'s own campgrounds book up. The Forest Service ones just outside the Tioga Pass entrance mostly do not, because they run first-come, first-served with self-registration at the campground, and a car that arrives early on a weekday with cash in an envelope usually gets a site. Tioga Lake is the closest of them: 13 sites on the lakeshore at 9,700 feet, a mile east of the gate on Highway 120, with vault toilets, a hand pump for water, tables, and bear boxes that are mandatory because this is active bear country. The fee is about twenty dollars.\n\n' +
      'The setting outdoes most of the park\'s campgrounds. The lake sits under the Tioga Crest with the Dana Plateau across the road, the stars are the high-desert kind, and Tuolumne Meadows is fifteen minutes west. Ellery Lake and Saddlebag Lake, a few miles on, run the same way if Tioga is full; Junction, at the Saddlebag Lake Road fork, is the Bennettville trailhead.\n\n' +
      'Two honest cautions. At this altitude a first night can mean a bad headache for someone arriving from sea level, and the season is short: the campground opens when the snow lets it, roughly June, and closes in October with the pass.',
    hazard:
      'Altitude sickness is real at 9,700 feet on the first night. Freezing temperatures any month; bear boxes are required, not suggested.',
    photos: [{ src: '/photos/tioga-lake-campground.jpg', caption: 'A Tioga Lake site: a table on the shore, the Tioga Crest behind.' }],
    swap:
      'If it is full, Ellery Lake and Saddlebag Lake campgrounds are a few miles east on the same terms. Inside the park, [Tuolumne Meadows](/stop/tuolumne-meadows-grill) has the reservable campground.',
  },
  {
    id: 'summerdale-campground',
    title: 'Summerdale, the meadow camp a mile from the south gate',
    order: 26,
    category: 'camping',
    kind: 'camping',
    coord: [-119.6331, 37.4909], // verified 2026-09: OSM camp_site "Summerdale Campground" on Hwy 41 at Fish Camp (Nominatim), 1.5 mi south of the South Entrance
    elevationFt: 5011,
    timeBudgetMin: 30,
    season: 'Late spring to fall',
    teaser:
      'Twenty-nine sites in a wildflower meadow on Big Creek at Fish Camp, a mile and a half south of the South Entrance on Highway 41, reservable six months out when Wawona and the Valley are long gone.',
    body:
      'When every campground inside the park is booked, the answer on the Highway 41 side is a mile and a half outside it. Summerdale sits in Sierra National Forest at Fish Camp, at 5,011 feet, on the left just before the South Entrance: 29 sites in a meadow of firs, cottonwoods and cedars along Big Creek, each with a paved spur, a table, a grill and a fire ring, with vault toilets and water. The Mariposa Grove Welcome Plaza is a few minutes up the road, which makes this the best base in the park for being first into the grove.\n\n' +
      'The paperwork is easier than the park\'s. Sites are reservable on recreation.gov up to six months ahead, with a three-day lead time before arrival, a two-night minimum on weekends and three on holidays; the window is long enough that a site is realistic in spring for a summer trip, when the park\'s own campgrounds on this side are gone.\n\n' +
      'Big Creek holds rainbow trout. Fish Camp itself has a general store and the Tenaya Lodge across the road, which is the nearest hot meal and, for a family of campers, the nearest swimming pool that will sell you a day.',
    hazard:
      'Bears use this corridor as much as the park; store food in the vehicle or a locker at all times.',
    photos: [{ src: '/photos/valley-campground-tent.jpg', caption: 'A tent site under conifers, the shape of a night at Summerdale. Commons has no photo of the campground itself.' }], // stand-in: not this entry, see guide-photo-manifest.json
    swap:
      'Inside the gate, [Wawona](/stop/wawona-hotel-history-center) has the park campground and the hotel. On the other side of the park, the same idea is Tioga Lake.',
  },

  // --- After dark, second set ------------------------------------------------
  {
    id: 'yosemite-falls-moonbow',
    title: 'The moonbow at Lower Yosemite Fall',
    order: 27,
    category: 'after-dark',
    kind: 'viewpoint',
    coord: [-119.5966, 37.7466], // web-derived: shuttle stop 6 loop start (same pin as the lower-yosemite-fall stop); TODO: verify on the ground
    elevationFt: 4000,
    timeBudgetMin: 90,
    season: 'April to June, full moon',
    teaser:
      'On the full-moon nights of spring, when the fall is loud and the moon is low, a rainbow forms in the mist at the footbridge below Lower Yosemite Fall. To the eye it is white. To a camera it is the whole spectrum.',
    body:
      'A rainbow needs a bright light behind you, low in the sky, and a curtain of water in front of you. A full moon is bright enough. In April, May and June the fall carries enough snowmelt to fill the base of Lower Yosemite Fall with mist, and on the nights around the full moon the moon rises into the right place, behind the footbridge at the base of the fall, low over the south rim. The arc forms high and to the left of the fall and sinks down and to the right over the creek across the hours it lasts. Your eyes see it as a pale white bow, because there is not enough light for color vision; a phone on a long exposure sees red through violet.\n\n' +
      'The timing is a calculation, not a guess. The moon has to be full or nearly so and under about 42 degrees above the horizon, the same geometry as a daytime rainbow, and each year the astronomers at Texas State University publish the nights and hours when that holds for the lower fall. The night-sky page in this guide gives you the moon phase for your dates; late May and June full moons are the most reliable, and a cloud over the moon cancels the whole thing.\n\n' +
      'Walk in from the shuttle stop with a red headlamp, wear a shell, and expect company: the footbridge is the known spot and on the right night it holds a line of tripods. Stand where the spray is thickest, wait for your eyes, and then look for the bow between you and the fall, not on it. Upper Yosemite Fall throws its own moonbow, best seen from Cook\'s Meadow or Sentinel Bridge, and with almost nobody looking.',
    hazard:
      'The footbridge and the rock beside it are wet and slick in the spray. Paths are paved but dark; keep to them.',
    photoTiming: { best: 'night', note: 'Around the spring full moons, in the hours the moon is low behind the bridge.' },
    photos: [{ src: '/photos/yosemite-falls-moonbow.jpg', caption: 'Yosemite Falls under a full moon. The bow forms in the mist at the base of the lower fall, below the frame here.' }],
    swap:
      'For the upper fall\'s bow, [Cook\'s Meadow](/stop/cooks-meadow-loop) or the [Sentinel Bridge](/stop/sentinel-bridge-sunset) pullout, both a short walk from the same shuttle loop.',
  },
  {
    id: 'glacier-point-star-party',
    title: 'Glacier Point after dark, the star parties and the moonrise',
    order: 28,
    category: 'after-dark',
    kind: 'viewpoint',
    coord: [-119.5731, 37.7283], // verified 2026-07: Glacier Point main lot (same pin as the glacier-point stop; Hikespeak/LOC HAER)
    elevationFt: 7214,
    timeBudgetMin: 120,
    season: 'Summer Saturdays',
    teaser:
      'On summer Saturday nights an astronomy club sets up ten to thirty telescopes in the amphitheater at Glacier Point, free, and the full moon comes up behind Half Dome. The crowd that filled the point at sunset has gone down the road.',
    body:
      'Glacier Point at sunset is the park\'s busiest hour. Stay. In June, July and August, California astronomy clubs take turns at the point, one club a weekend, and on Saturday nights from about 8:30 they set up between ten and thirty telescopes in and around the amphitheater and hand you the eyepiece: Saturn, the Moon, star clusters, whatever is up. It is informal and free, run as a public service by the clubs and the park; you can drop in and stay as long as you like. The park\'s event calendar carries the dates for the summer, so check it against your trip window rather than assuming.\n\n' +
      'The other show needs no club. Half Dome sits due east of the point, and on the night of a full moon in summer the moon rises behind it, sometimes over its shoulder, which is the photograph of the park that people spend years trying to time. The night-sky page in this guide gives you the moonrise and the phase for your dates; get there an hour early with a jacket, because 7,200 feet is cold once the sun goes.\n\n' +
      'Afterward is the honest part. It is a 32-mile drive back to the Valley on a mountain road in the dark, after a long day, and deer are on it; the drive is what ends most people\'s star parties early. Sleep at Bridalveil Creek or Wawona if you can.',
    hazard:
      'Unfenced drops beyond the railings in the dark; stay on the paved paths. The drive down Glacier Point Road at night is slow and full of deer.',
    photoTiming: { best: 'night', note: 'Full-moon nights for the rise behind Half Dome; new-moon Saturdays for the telescopes and the Milky Way.' },
    photos: [{ src: '/photos/glacier-point-star-party.jpg', caption: 'The Milky Way from Glacier Point on a moonless night.' }],
    swap:
      'If Glacier Point Road is closed, [Olmsted Point](/stop/olmsted-point-at-night) is the drive-to dark sky on Tioga Road; if both are, [El Capitan Meadow](/stop/el-cap-meadow-after-dark) is the Valley\'s own night.',
  },
  {
    id: 'great-gray-owl-dusk',
    title: 'Crane Flat at dusk, the great gray owl watch',
    order: 29,
    category: 'after-dark',
    kind: 'viewpoint',
    coord: [-119.8015, 37.7566], // web-derived: Crane Flat meadow point (same pin as the crane-flat-meadow stop); TODO: verify on the ground
    elevationFt: 6192,
    timeBudgetMin: 60,
    season: 'Late spring to early fall',
    teaser:
      'The largest owl in North America hunts the meadow edges at Crane Flat in the last hour of light. Yosemite holds most of California\'s two or three hundred, and they are a subspecies found nowhere else.',
    body:
      'The great gray owl is the tallest owl on the continent, a grey ghost with a face like a satellite dish, and Yosemite is the southern end of its world. The park\'s birds were shown in 2010 to be their own subspecies, Strix nebulosa yosemitensis, genetically distinct from every other great gray in North America; California holds perhaps 200 to 300 of them and about two thirds of those live in the park, in the mid-elevation belt where forest meets meadow. They hunt voles and gophers from low perches at the meadow edge, mostly in the first and last hours of light, and Crane Flat is the meadow the park itself names for seeing one.\n\n' +
      'The method is patience. Park at the meadow pullout an hour before sunset, walk the road edge to a place with a long view down the meadow, and stand still. Look at the tops of the low snags and the lower limbs of the trees at the edge, not at the sky; a great gray sits and listens, then drops. The other good meadow is McGurk, off Glacier Point Road, at the same hour.\n\n' +
      'The etiquette is not optional. This is a state-endangered bird that is losing owls to cars on the park roads; no recorded calls, no approaching a perched bird, no flash, no walking into the meadow, and drive the meadow stretches slowly at dusk. Seeing one at a hundred yards through binoculars, in the last of the light, is the whole experience, and it is enough.',
    hazard:
      'Roadside pullout on a highway at dusk: park fully off the pavement, wear something light, and cross with care. Mosquitoes in early summer.',
    photoTiming: { best: 'golden-pm', note: 'The hour before sunset, when the owls come to the meadow edge to hunt.' },
    photos: [{ src: '/photos/wildlife-great-gray-owl.jpg', caption: 'A great gray owl on a meadow-edge perch. This is the posture to scan for at Crane Flat: low, still, facing the grass.' }],
    swap:
      'If Crane Flat is quiet, [McGurk Meadow](/stop/mcgurk-meadow) off Glacier Point Road is the other meadow the park names, and the [Crane Flat](/stop/crane-flat-meadow) stop covers the meadow by day.',
  },
]

export const SECRET_SPOTS: SecretSpotT[] = SecretSpots.parse(seed).sort(
  (a, b) => a.order - b.order,
)

