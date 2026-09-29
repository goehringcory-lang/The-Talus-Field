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
      'A spring-fed pool dropping a foot over a mossy lip beside Southside Drive. The smallest waterfall in the park, and the first stop most drivers pass.',
    body:
      'A spring-fed pool at the edge of Southside Drive, just past the Pohono Bridge as you enter the valley, dropping about a foot over a mossy stone lip. The pull-off is small and not usefully signed; look for wet rock at the road edge. Ten minutes.\n\nGo in the morning, when low light comes through the trees and backlights the ferns around the pool. At dawn the only other person there is often a photographer working long exposures. Locals call it the smallest waterfall in the park. Most drivers pass it on the way to Tunnel View and Bridalveil, a few minutes ahead.',
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
      'A robin-sized bird that walks underwater works the Merced riffles here all year. Watch for the dip on midstream rocks.',
    body:
      'The water ouzel, or American dipper, is a dark, robin-sized bird that walks underwater, gripping the stream bottom with oversized feet to forage for insect larvae. The fast, cold riffles of the Merced around Happy Isles are its habitat, and the bridges give you a stable place to scan. The footbridge below Vernal Fall, a short walk up the trail, is another reliable post.\n\nWatch the midstream rocks, not the banks. The giveaway is the dip: a constant knee-bend bob on wet rock. Then the bird steps into whitewater and surfaces 10 to 20 seconds later somewhere else.\n\nWinter is the best season. Ouzels do not migrate; they stay on open water all year and sing through the cold months, when few other birds do and few visitors are on the riverbank. Ouzels live only in cold, fast, clean water, so a sighting is a sign of a healthy stream.',
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
      'After dark the wall is a dark shape scattered with headlamps: climbers on portaledges a thousand feet up.',
    body:
      'Park at the same Northside Drive pullout as the daytime El Capitan Meadow stop, after full dark. Walk a few steps into the meadow, turn your headlamp off, and give your eyes ten minutes. Stay twenty to thirty minutes.\n\nThe wall shows as a dark shape against the stars, with points of light a thousand and two thousand feet up: headlamps of climbers on portaledges for the night. Standard routes take three to five days, so on any summer night parties are cooking and sleeping on the wall. Some lights hold steady; some move as a climber sorts gear.\n\nTwo courtesies. Sound carries at night and the climbers are trying to sleep, so keep voices down. Do not sweep the wall with a bright light; use a red lamp for your footing.',
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
      'The best drive-to dark sky in the park: flat granite slabs at 8,300 feet, thirty feet from the car, with dark lanes visible in the Milky Way.',
    body:
      'The best drive-to dark sky in the park: 8,300 feet on Tioga Road, broad horizons, almost no nearby light, and flat granite slabs at the parking area to lie on. No tripod or walking required. Park, walk thirty feet, lamp off, and give your eyes ten minutes. The Milky Way shows visible dark lanes from here.\n\nThe galactic core is up roughly April through October, best mid-July through mid-August, overhead between about 11 p.m. and 3 a.m. A full moon washes it out, so aim for a new-moon week or a night before moonrise. Full-moon dates for your trip are in this guide\'s programs list.\n\nTioga Road is typically open to cars from late May or June until sometime in November, so this is a summer and fall spot. It is cold at 8,300 feet after dark even in August, colder when lying still; bring a real jacket and a hat. Use a red headlamp and keep phone screens down, for your night vision and for photographers already set up.',
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
      'Sequoias without the crowds: a mile down the 1874 wagon road to a couple dozen giants and the walk-through Dead Giant. The climb back is 500 feet.',
    body:
      'Park at the lot on Tioga Road just east of Crane Flat and walk a mile down the old Big Oak Flat Road, the 1874 wagon grade, now closed to cars (its lower valley section is a separate entry in this guide). The pavement drops about 500 feet through fir forest to a couple dozen mature sequoias. Allow two hours round trip. No welcome plaza, no shuttle, and far fewer people than Mariposa Grove.\n\nThe landmark is the Dead Giant, a sequoia snag tunneled for stagecoaches in 1878; you can still walk through it. The black bark scars on the living trees are normal. Sequoias are built for fire, and the park runs restoration burns here because seedlings need bare soil and open light.\n\nThe walk out is 500 feet of steady climbing above 6,000 feet, and people underestimate it. Carry water and take it slow.',
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
      'The lowest-effort summit in the park. A pullout sits at the base of Pothole Dome at the west end of Tuolumne Meadows. The round trip is about a mile with 200 feet of gain; the granite scramble up takes ten to fifteen minutes. Follow the established path around the meadow edge rather than cutting across: the meadow is wet and fragile most of the season, and the detour costs two minutes.\n\nGo for the last hour of daylight. From the top the meadow spreads east toward Lembert Dome and the Cathedral Range, and the sunset light runs lengthwise up the grass. The granite underfoot is polished by the glacier that ground over the dome and catches the low sun.\n\nBring a headlamp for the walk down; at 8,700 feet the light and the temperature drop fast. The car is a five-minute walk from the base.',
    photos: [{ src: '/photos/pothole-dome-sunset.jpg' }],
  },
  {
    id: 'cathedral-beach-quiet-picnic',
    title: 'Cathedral Beach, the quiet riverbank',
    order: 8,
    category: 'vistas',
    kind: 'parking',
    coord: [-119.6251, 37.7229], // TODO: verify on the ground — moved 2026-09 ~710 m to Cathedral Beach: NPS places, OSM picnic site and the amenities pin agree
    elevationFt: 3950,
    timeBudgetMin: 60,
    teaser:
      'A sandy Merced beach facing El Capitan, thirty feet from Southside Drive, and often empty at midday.',
    body:
      'A small sandy beach on the Merced, reached from a pullout on Southside Drive at the Cathedral Beach picnic area. The beach faces upstream at El Capitan, and on calm afternoons the water holds the reflection. At midday in summer it is often empty, which is rare in the valley.\n\nThe picnic tables in the trees make it the best lunch stop on the south side of the river. Late afternoon has the softest light on the wall and the calmest water. No glass: park rules ban glass containers within 50 feet of any riverbank, because people walk the sand barefoot.\n\nSwimming is seasonal. In May and June the Merced is fast, cold snowmelt with more current than the surface suggests; stay out. By late July and August the river has dropped and warmed at the edges, and a wade or short swim off the beach is safe.',
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
      'Sentinel Beach usually has spaces when the east valley lots are full, with a sandy stretch of the Merced right off the lot for a swim. Use it as a base for the day: park, swim, and bring a bike to ride into the main part of the valley instead of circling for a spot further east.',
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
      'East valley parking fills by mid-morning. Park at El Capitan instead, where the lot holds out far longer. From El Capitan Bridge, bike in or take the free shuttle to the east end. It replaces half an hour of circling with a short ride.',
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
      'The shared Sentinel Dome and Taft Point lot fills early. A service road along Glacier Point Road adds walking, not a new plan.',
    body:
      'The shared Sentinel Dome and Taft Point lot is small and fills early on good-weather days. A service road just along Glacier Point Road has room to park; leave the car there and walk up to Sentinel Dome from the road. It adds some walking, not a change of plans. The park rule still applies: a paved turnout or marked space, fully off the road, never on vegetation. Cars parked otherwise are ticketed and can be towed.',
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
      'A neighborhood walk past old barns and an old bridge, with El Capitan and Half Dome from unusual angles.',
    body:
      'Foresta is a small community off Big Oak Flat Road. Park next to the old barns and walk the loop: over the old bridge behind the green house, then around First Street and Dana Way. The loop has views of El Capitan and Half Dome and is known mostly to locals and short-term renters. It is a neighborhood: keep noise down and stay on the roads.',
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
      'Forest Service land just outside Yosemite Valley allows camping with views of El Capitan and Half Dome. No toilets, no amenities, no reservations, no fee. Confirm you are over the park boundary on a Stanislaus National Forest map before you pitch: on the park side, camping and sleeping in a vehicle are allowed only in a registered campsite. Any flame needs a California campfire permit. Pack out everything, and do not publish the pin.',
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
      'Little Nellie Falls is about 2.8 miles out on the Old Coulterville Road, 5.6 miles round trip with roughly 470 feet of gain: a fifteen-foot fall on Little Crane Creek, just over the park boundary in Stanislaus National Forest, with a picnic table at the bottom. Park where the road forks a few miles into the Foresta area, take the right fork on foot past the south side of Big Meadow, and follow the old grade uphill. The road, finished in 1874, was the first wagon road into Yosemite Valley.\n\nThe route forks four times: bear right at the first three, which come early, and left at the last. The 2009 Big Meadow fire and the 2013 Rim Fire both burned here, so the walk runs through regrowth and standing snags, with open views back toward the Valley rim and post-fire flowers in spring.\n\nGo in spring and early summer, when the creek carries snowmelt; by late summer it is a trickle. Overnight rules are the national forest\'s: no wilderness permit, a California campfire permit for any flame, and a check of current fire restrictions. Pack out everything.',
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
      'Tunnel View\'s framed composition from the old stage road above the tunnel, with nobody in it, and a wilderness permit that is easier to hold than most for a night farther along the rim.',
    body:
      'The Pohono Trail starts across Wawona Road from the Tunnel View lots and climbs the old Wawona stage road grade, replaced by the tunnel in 1933: 1.2 miles and about 1,000 feet to Inspiration Point, the Tunnel View composition of El Capitan, Bridalveil and Half Dome from a granite slab with few people on it. Old Inspiration Point, the 1850s stage-road overlook, is two miles farther, 3.3 miles from the trailhead.\n\nInspiration Point is a day hike. Much of the rim is day-use, and camps must be at least four trail miles from Yosemite Valley and a mile from any road, so legal ground starts well past Old Inspiration Point, toward Dewey Point; the park\'s wilderness trailheads map marks the line. A Pohono Trail permit from Tunnel View is one of the easier ones to get: 60 percent of each day\'s quota is reservable on recreation.gov 24 weeks ahead and the rest seven days ahead; in winter, when no reservation is needed, permits are issued the day before or the day of at the nearest station. Camping is dispersed, with a bear canister and the park\'s fire rules.\n\nNo water on the trail. Carry what you will drink, start early in summer, and check current permit rules on the wilderness pages before counting on a spot.',
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
      'A small granite tarn a short walk from Tioga Road with no official trail, and a wilderness permit that is actually attainable.',
    body:
      'A small lake in the granite between Olmsted Point and the west end of Tenaya Lake, with no official trail and no sign. The approach from the road is under a mile of route-finding over slabs and through lodgepole: pick a line, note it, and expect to walk it back. The Tenaya Lake to Yosemite Valley trail passes north of the lake toward Mount Watkins and Snow Creek, and a ridge on that trail gives a glimpse of it.\n\nIt is a real lake with granite shores at 8,000 feet, reachable in an afternoon, with an attainable wilderness permit for a night. Any overnight needs the permit and a bear canister, and camps must be at least a mile from the road and out of sight of it, so the lake is a base for a camp beyond it, not a site on its shore. Check current trailhead rules before counting on it.',
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
      'All 2,425 feet of Yosemite Falls reflected in the Merced, from a footbridge thirty steps from a picnic lot the tour buses skip.',
    body:
      'The classic Yosemite Falls reflection is shot from here: a small picnic area on Southside Drive between Sentinel Beach and the chapel, and a footbridge over the Merced with the full height of the falls above the water. Parking is a dozen spaces, so come in the morning; the Four Mile Trail shuttle stop is a short walk west.\n\nTiming: the falls face the morning sun, and the reflection works when the upper fall is lit but the sun has not reached the water, roughly the hour after light comes over the rim. The river must be slow. At peak spring flow the reflection is soft and moving; by late summer the river is glassy but the falls may be a wet streak. May and early June are the compromise. Stand upstream of the bridge for the clean reflection, on it for the height, downstream to put the bridge in the frame.\n\nThe name is left over: the original suspension bridge was wrecked by repeated floods and replaced with a fixed one after the 1964 flood. The 1965 bridge has held since, including in 1997. The beach under it is a well-known swimming hole later in summer, mostly shallow with a few deep holes.',
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
      'A small spring-fed pond ringed by lodgepole and red fir on the south side of Tioga Road, about 13 miles east of Crane Flat and a mile short of the White Wolf turnoff. No sign and no lot, only a shoulder pullout. Fifteen minutes. The 1950s road engineers bent the alignment around it rather than fill it.\n\nIt is no more than five feet deep, which is why stocked fish winter-killed and were gone by the mid-1950s, and why it is glassy on still mornings. Come at dawn for the firs reflected in it, or in October, when the shoreline shrubs turn red and orange. The park\'s old auto-tour guide noted black-backed woodpeckers nesting here, a bird of burned and beetle-killed forest.',
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
      'Past the Grizzly Giant the crowd thins, and the trail climbs through the upper grove to a stone overlook at 6,810 feet looking down on Wawona.',
    body:
      'From the Arrival Area the Mariposa Grove Trail passes the Grizzly Giant and the California Tunnel Tree, where most visitors turn around, then climbs through the upper grove past the Mariposa Grove Cabin and the Fallen Wawona Tunnel Tree to a short spur on the old road ending at Wawona Point. Seven miles round trip with 1,200 feet of gain; four to six hours. The last mile is usually empty.\n\nThe overlook faces south and west, not toward the Valley: over the Wawona meadow, Wawona Dome, the South Fork of the Merced and the old Chowchilla Mountain wagon road, 3,000 feet below. The stone parapet was rebuilt during the restoration that closed the grove from 2015 to 2018 and removed the tram, gift shop and asphalt. The Wawona Tunnel Tree, tunneled in 1881 for stagecoaches, fell under snow in February 1969 and was left where it lies.\n\nRide the free shuttle from the Welcome Plaza to the Arrival Area and start early; the plaza lot has about 300 spaces and fills by late morning in season. Outside shuttle season the grove is a two-mile walk from the plaza before the trail starts, which makes this a full day.',
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
      'Two thirds of the way up the Four Mile Trail, a railed rock a few steps off the switchbacks with the Valley below it. The spur is easy to miss.',
    body:
      'About three miles and 2,300 feet up the Four Mile Trail from Southside Drive, a ten-yard spur leads to a railed rock called Union Point, 2,300 feet above the Valley floor. Yosemite Falls is straight across, Half Dome and North Dome to the east, El Capitan and the Cathedral Rocks west, and the Valley roads below. It frames the falls better than Glacier Point, with fewer people. Trailhead parking is a handful of roadside spaces; the Valley shuttle stops at the trailhead.\n\nThe point is also the trail\'s winter gate. When snow closes the upper trail, the lower three miles to a gate just below the point stay open, so in the shoulder seasons this is as high as the trail goes.\n\nThe trail was James McCauley\'s toll route, built by John Conway in 1871 and 1872; his crew reached this point in spring 1872 when he was hurt, and the trail opened that summer. The name is probably 1870s patriotism. It was rebuilt and lengthened to 4.8 miles in the early 1900s and kept its old name, so the sign at the bottom is off by nearly a mile. The full trail climbs 3,200 feet to Glacier Point.',
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
      'Two miles east of the Tioga Pass entrance, Saddlebag Lake Road leaves Highway 120; at the fork before the Junction Campground bridge is a lot for about ten cars. The trail follows Mine Creek up through meadows about a mile and 400 feet to Bennettville. Shell Lake is a few minutes past the cabins and Fantail Lake about three quarters of a mile beyond, both under the Tioga Crest; allow an extra hour. In July Mine Creek runs high with snowmelt along the route.\n\nIn 1882 the Great Sierra Consolidated Silver Company sank the Great Sierra Tunnel toward a silver ledge on Tioga Hill, working three shifts around the clock, spent $300,000, and stopped on July 3, 1884, 1,784 feet in, without shipping any ore. The post office lasted two years. Two of the fourteen buildings survive, the assay office and the bunkhouse, stabilized by the Forest Service in 1993.\n\nThe company built the Great Sierra Wagon Road, 56 miles in 130 days, to supply the mine from the west. Stephen Mather bought it in 1915 for $15,000 and gave it to the government; it became Tioga Road.',
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
      'The lot past the end of Curry Village is not for day hikers: the park reserves it for backpackers with a wilderness permit, and it is the only Valley lot where a car can legally sit for days.',
    body:
      'Just before the road past Curry Village closes to all but shuttles and park vehicles is a lot of about 190 spaces signed Trailhead Parking. It is for overnight wilderness permit holders only, the one place in the Valley a backpacker may leave a car for the days of a trip. Day hikers bound for the Mist Trail or Half Dome may not park here, however empty it looks.\n\nDay hikers use the Curry Village lot in the old apple orchard, about 490 unpaved spaces a short walk west. On summer weekends Valley lots can fill by late morning; at first light there are spaces. From there it is about a mile on foot to the Happy Isles trailhead, walked before the first shuttle, which puts you on the Vernal Fall footbridge ahead of the crowd. The Curry Village pizza deck is steps from the car.\n\nIf the orchard lot is full, do not circle: drop back to the day lots west of the village and take the shuttle to Happy Isles.',
    photos: [{ src: '/photos/valley-trailhead-parking.jpg', caption: 'The Merced at Happy Isles, half a mile from the lot.' }],
    swap:
      'Day hiking? [Curry Village](/stop/curry-village) has the day lot, and the [Mist Trail](/stop/mist-trail) entry covers the shuttle from there.',
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
      'The beach lot at the east end fills first and everyone stops there. The Sunrise trailhead lot at the west end and Murphy Creek in the middle hold out, and the lakeshore trail links all three on the flat.',
    body:
      'Tenaya Lake has about 230 legal spaces, roughly 175 in three lots and the rest marked along the road; on summer afternoons all are taken. The east-end beach lot, with the picnic area and sand, fills first. The Sunrise Lakes trailhead lot at the west end is usually last to fill. Murphy Creek, the middle picnic area on the north shore, has its own short path to the water: a short walk from the east beach on the loop trail, or about half an hour on the flat from the Sunrise lot.\n\nThe park\'s plan allows about 40 designated roadside spaces along Tioga Road. A car on vegetation or blocking traffic outside them is ticketed and can be towed. If the lots and marked shoulder are full, drive on to Olmsted Point and come back in an hour.\n\nOvernight parking along Tioga Road, including the trailhead lot, is prohibited from October 15 until the road reopens in spring, whether or not the road is still open.',
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
      'Seventy-four sites at the end of a rough five-mile spur off Tioga Road that keeps out RVs, on the creek that becomes Yosemite Falls.',
    body:
      'Seventy-four sites under lodgepole beside Yosemite Creek at 7,700 feet, at the end of a narrow, winding, badly surfaced five-mile spur off Tioga Road. The park does not recommend RVs or trailers, so the campground is mostly tents and small cars. No piped water; treat creek water. Each site has a fire ring, table and bear box; toilets are vault. Season: roughly July to early September.\n\nSites release on recreation.gov two weeks before the arrival date at 7 a.m. Pacific, on a rolling daily window, not in the months-ahead release that empties the Valley campgrounds. Book fourteen days out at 7 a.m. with your date chosen and a site is realistic.\n\nFrom the campground the Yosemite Creek trail follows the water downstream toward the top of Yosemite Falls, where the creek goes over the lip 2,400 feet above the Valley a few miles on.',
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
      'Thirteen first-come, first-served sites on the Tioga Lake shore, a mile east of the Tioga Pass entrance on Highway 120 in Inyo National Forest, about 9,500 feet by the Forest Service\'s count. Self-register at the campground; arrive early on a weekday with cash and a site is likely. Vault toilets, drinking water, tables, and mandatory bear boxes (active bear country). $30 a night, $10 for a second car; the fee rises every few seasons.\n\nThe lake sits under the Tioga Crest with the Dana Plateau across the road; Tuolumne Meadows is fifteen minutes west. Ellery Lake and Saddlebag Lake campgrounds, a few miles on, run the same way if Tioga is full. Junction, at the Saddlebag Lake Road fork, is the Bennettville trailhead.\n\nA first night at this altitude can mean a bad headache for someone arriving from sea level. The season is short: open when snow allows, roughly June, closing in October with the pass.',
    hazard:
      'Altitude sickness is real at 9,500 feet on the first night. Freezing temperatures any month; bear boxes are required, not suggested.',
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
    season: 'June to November',
    teaser:
      'Twenty-nine sites in a wildflower meadow on Big Creek at Fish Camp, a mile and a half south of the South Entrance on Highway 41, reservable six months out when Wawona and the Valley are long gone.',
    body:
      'Twenty-nine sites in Sierra National Forest at Fish Camp, 5,011 feet, on the left on Highway 41 a mile and a half before the South Entrance. The meadow of firs, cottonwoods and cedars runs along Big Creek; each site has a paved spur, table, grill and fire ring, with vault toilets and water. The Mariposa Grove Welcome Plaza is a few minutes up the road, a good base for an early start in the grove.\n\nReserve on recreation.gov up to six months ahead, with a three-day lead time before arrival, a two-night minimum on weekends and three on holidays. That window makes a site realistic in spring for a summer trip, after the park\'s campgrounds on this side are gone.\n\nBig Creek holds rainbow trout. Fish Camp has a general store, and Tenaya Lodge across the road is the nearest hot meal and a pool that sells day use.',
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
      'April to June, around the full moon, a moonbow forms in the mist at the footbridge below Lower Yosemite Fall. It looks white to the eye; a camera records color.',
    body:
      'April through June, on the nights around the full moon, a moonbow forms in the mist at the footbridge below Lower Yosemite Fall. Walk in from the shuttle stop with a red headlamp and a shell, and expect a line of tripods on the right night. See the night-sky page for your dates\' moon phase; late May and June full moons are most reliable, and cloud over the moon cancels it.\n\nThe moon must be full or nearly so and under about 42 degrees above the horizon, low over the south rim behind the footbridge; the fall must carry enough snowmelt to fill its base with mist. Texas State University astronomers publish the nights and hours each year. The arc forms high and to the left of the fall and sinks down and to the right over the creek. To the eye it is pale white, too dim for color vision; a phone on a long exposure records red through violet.\n\nStand where the spray is thickest, let your eyes adjust, and look for the bow between you and the fall. Upper Yosemite Fall has its own moonbow, seen from Cook\'s Meadow or Sentinel Bridge, with few people watching.',
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
      'On summer Saturday nights an astronomy club sets up ten to thirty free telescopes in the Glacier Point amphitheater, and the full moon rises behind Half Dome.',
    body:
      'In June, July and August, California astronomy clubs take turns at Glacier Point, one club a weekend. On Saturday nights from about 8:30 they set up ten to thirty telescopes in and around the amphitheater: Saturn, the Moon, star clusters. Free and informal, run by the clubs and the park; drop in and stay as long as you like. Check the park\'s event calendar for dates.\n\nHalf Dome sits due east of the point, and on a summer full-moon night the moon rises behind it or over its shoulder. See the night-sky page for moonrise and phase on your dates. Arrive an hour early with a jacket; 7,200 feet is cold after sunset.\n\nThe drive back to the Valley is about 30 miles on a mountain road in the dark, with deer on it. Sleep at Bridalveil Creek during its short midsummer season, or at Wawona.',
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
      'Park at the Crane Flat meadow pullout an hour before sunset, walk the road edge to a long view down the meadow, and stand still. Scan the tops of low snags and the lower limbs at the meadow edge, not the sky; a great gray sits, listens, then drops on voles and gophers. McGurk Meadow, off Glacier Point Road, is the other good meadow at the same hour.\n\nThe great gray is the tallest owl on the continent, and Yosemite is the southern end of its range. The park\'s birds were shown in 2010 to be a distinct subspecies, Strix nebulosa yosemitensis. California holds perhaps 200 to 300, about two thirds in the park, in the mid-elevation belt where forest meets meadow, hunting mostly in the first and last hours of light.\n\nIt is state-endangered and loses birds to cars on park roads. No recorded calls, no approaching a perched bird, no flash, no walking into the meadow, and drive the meadow stretches slowly at dusk. Binoculars at a hundred yards are the right distance.',
    hazard:
      'Roadside pullout on a highway at dusk: park fully off the pavement, wear something light, and cross with care. Mosquitoes in early summer.',
    photoTiming: { best: 'golden-pm', note: 'The hour before sunset, when the owls come to the meadow edge to hunt.' },
    photos: [{ src: '/photos/wildlife-great-gray-owl.jpg', caption: 'A great gray owl on a meadow-edge perch. This is the posture to scan for at Crane Flat: low, still, facing the grass.' }],
    swap:
      'If Crane Flat is quiet, [McGurk Meadow](/stop/mcgurk-meadow) off Glacier Point Road is the other well-known owl meadow, and the [Crane Flat](/stop/crane-flat-meadow) stop covers the meadow by day.',
  },

  // --- Parking, third set: the pullouts and small lots (September 2026) -----
  // Every lot here was placed from its OpenStreetMap feature and every rule
  // read off an NPS page or the current Yosemite Guide; space counts come
  // from yosemitehikes.com or NPS where one is given, and are left out where
  // nobody publishes one. The general rule under all of them is the Guide's:
  // a designated space or a paved turnout, pulled completely off the road;
  // never a new space on the shoulder or on vegetation.
  {
    id: 'valley-view-pullout',
    title: 'Valley View, the dozen spaces on the way out',
    order: 30,
    category: 'parking',
    kind: 'parking',
    coord: [-119.66198, 37.71732], // verified 2026-09: OSM parking way 136666994, beside viewpoint node 3331425528 "Valley View" on Northside Dr
    timeBudgetMin: 15,
    teaser:
      'The river-level view of El Capitan and Bridalveil has about a dozen spaces on Northside Drive, the one-way road out. You can reach it only on the way out of the Valley, so plan it as the last stop, not the first.',
    body:
      'Valley View, which some maps call Gates of the Valley, is a pullout on Northside Drive at the west end of the Valley: the Merced in front, El Capitan on the left, Bridalveil Fall on the right. There are a dozen or so spaces, some of them designated accessible, and the Park Service calls the parking extremely limited. The vault toilet is across the road.\n\nNorthside Drive is one-way, outbound, so the pullout can be reached only while leaving the Valley. Build it into the drive out rather than circling back for it: a car that turns around to try again has to loop the whole Valley floor.\n\nIf every space is taken, do not make one. The park\'s rule is a designated space or a paved turnout, pulled completely off the road; cars on vegetation or blocking traffic are cited and can be towed. The lot also floods: in January 1997 it stood under six feet of water.',
    photos: [{ src: '/photos/valley-view.jpg', caption: 'Valley View, the scene the pullout holds.' }],
    swap:
      'The view itself is the [Valley View](/stop/valley-view) stop. If the pullout is full, [Tunnel View](/stop/tunnel-view-lots) is a few minutes up Wawona Road with two lots.',
  },
  {
    id: 'tunnel-view-lots',
    title: 'Tunnel View, the two lots and the hikers in them',
    order: 31,
    category: 'parking',
    kind: 'parking',
    coord: [-119.67668, 37.71514], // verified 2026-09: OSM parking way 60399265 at the Tunnel View viewpoint (node 26637661); the second lot is way 371783228 across Wawona Rd
    timeBudgetMin: 15,
    teaser:
      'Tunnel View has lots on both sides of Wawona Road. Most cars stop to look and leave; the ones that stay belong to hikers on the Pohono Trail, which starts from the uphill lot.',
    body:
      'Tunnel View has parking on both sides of Wawona Road at the east portal of the Wawona Tunnel, with designated accessible spaces, open all year. It is a viewpoint lot: most visitors look and move on, so spaces come free even on busy days.\n\nThe catch is the uphill lot. The Pohono Trail to Inspiration Point starts there, and a hiker\'s car holds its space for hours. If you are hiking, take the uphill lot early; if you are here for the view, the other lot is the one that turns over.\n\nThere is no overflow. The park forbids creating a new roadside space, and cars on vegetation or blocking traffic are cited and can be towed. If both lots are full, drive down to Bridalveil Fall, five minutes below, and come back up.',
    photos: [{ src: '/photos/tunnel-view-panorama.jpg', caption: 'The view both lots are for.' }],
    swap:
      'If both lots are full, [Bridalveil Fall](/stop/bridalveil-roadside-parking) is five minutes down the road, and [Inspiration Point](/stop/inspiration-point) is the same view with nobody in it, 1.2 miles up the trail.',
  },
  {
    id: 'bridalveil-roadside-parking',
    title: 'Bridalveil Fall, the roadside spaces past the lot',
    order: 32,
    category: 'parking',
    kind: 'parking',
    coord: [-119.64932, 37.71954], // verified 2026-09: OSM parking way 269906751 on Southside Dr east of the Bridalveil lot (way 220380918); its fixme notes the spaces are now on the south side
    timeBudgetMin: 10,
    teaser:
      'The Bridalveil lot often fills. A few hundred yards farther into the Valley, the restoration finished in 2023 added formal roadside spaces on Southside Drive, and a trail runs beside the road back to the fall.',
    body:
      'The Bridalveil Fall lot is large and it still fills. The restoration finished in 2023 rebuilt the trail and the lot and added roadside parking and turning lanes nearby. Continue a few hundred yards east into the Valley on Southside Drive and look for the formal spaces along the road; a trail runs parallel to the road back to the fall.\n\nUse the marked spaces only. The meadow edge along Southside Drive is vegetation, and a car parked on it is cited and can be towed.',
    photos: [{ src: '/photos/bridalveil-fall.jpg', caption: 'Bridalveil Fall, a short walk back from the roadside spaces.' }],
    swap:
      'If those are gone too, continue to the [El Capitan crossover](/stop/el-cap-crossover-parking), which holds out far longer, and see the fall on the way out. The fall itself is the [Bridalveil Fall](/stop/bridalveil-fall) stop.',
  },
  {
    id: 'four-mile-trailhead-parking',
    title: 'Four Mile Trailhead, a dozen cars and a shuttle stop',
    order: 33,
    category: 'parking',
    kind: 'parking',
    coord: [-119.6018, 37.73396], // verified 2026-09: OSM parking way 538528251 "Four Mile Trail Parking Lot" on Southside Dr; the shuttle stop is node 4343414090 beside it
    timeBudgetMin: 10,
    teaser:
      'About a dozen cars fit at the Four Mile trailhead on Southside Drive, and on summer mornings they are taken early. The Valley shuttle stops at the trailhead, which is the better plan.',
    body:
      'The Four Mile Trail to Union Point and Glacier Point starts on Southside Drive, just west of Swinging Bridge. A dozen or so cars fit at the trailhead, and on summer mornings the spaces go early; trip reports put it at about 7:30. If it is full, the Swinging Bridge picnic lot is a few hundred yards east.\n\nThe better move is not to drive to it at all. Park once at a day-use lot and ride the Valley shuttle to the Four Mile Trailhead stop, number 11. The shuttle runs into the evening, so the walk down at the end of the day has a ride waiting at the bottom.',
    photos: [{ src: '/photos/four-mile-trailhead.jpg' }],
    swap:
      'If the trailhead is full, [Swinging Bridge](/stop/swinging-bridge-reflection) is a few hundred yards east. The climb is the [Four Mile Trail](/stop/four-mile-trailhead) stop, and [Union Point](/stop/union-point) is the part of it worth the effort.',
  },
  {
    id: 'mcgurk-meadow-lot',
    title: 'McGurk Meadow, the new lot and the old advice',
    order: 34,
    category: 'parking',
    kind: 'parking',
    coord: [-119.62715, 37.67029], // verified 2026-09: OSM node 14115557101 "McGurk Meadow Trailhead", the lot rebuilt in the 2022 Glacier Point Rd repaving
    timeBudgetMin: 10,
    season: 'Glacier Point Road season',
    teaser:
      'Older guides say McGurk Meadow has a few roadside spaces and send you down the road to park. The 2022 repaving built a lot at the trailhead for about forty cars, with pull-in spaces off the road.',
    body:
      'For years the McGurk Meadow and Dewey Point trailhead had only a few roadside spaces, and guidebooks sent drivers to park farther down Glacier Point Road and walk back. The road\'s repaving in 2022 built a lot at the trailhead with room for about forty cars, laid out for pull-in parking so that no one backs into the travel lane.\n\nIgnore the old advice and park at the trailhead. It is the start of the easy walk to McGurk Meadow and the longer rim walk to Dewey Point, and McGurk is one of the two meadows the owl entry in this guide names for dusk.\n\nOvernight parking on Glacier Point Road beyond Badger Pass is prohibited from October 15 until the road reopens.',
    photos: [{ src: '/photos/mcgurk-meadow.jpg', caption: 'McGurk Meadow, the short walk from the lot.' }],
    swap:
      'The walk is the [McGurk Meadow](/stop/mcgurk-meadow) entry. If the lot is full, [Mono Meadow](/stop/mono-meadow-lot) is a few miles on toward Glacier Point and rarely fills.',
  },
  {
    id: 'mono-meadow-lot',
    title: 'Mono Meadow, the Glacier Point Road lot that rarely fills',
    order: 35,
    category: 'parking',
    kind: 'parking',
    coord: [-119.58508, 37.67137], // verified 2026-09: OSM parking node 393908865 at the Mono Meadow trailhead (node 89182026) on Glacier Point Rd
    timeBudgetMin: 10,
    season: 'Glacier Point Road season',
    teaser:
      'A small trailhead lot on Glacier Point Road that rarely fills, and a warning about the rest of the road: the rebuild curbed the shoulder near Washburn Point, so a full lot there means driving on.',
    body:
      'Glacier Point Road\'s lots are small, and the road now gives no second chances. The rehabilitation added curbing near Washburn Point specifically to end overflow parking on the shoulder, so a full lot there means driving on to Glacier Point, not pulling over to wait.\n\nThe Mono Meadow trailhead lot, a few miles before the road\'s end, is the exception: small, and rarely full. It is the start of the Mono Meadow trail, and a good place to leave a car when the Sentinel Dome and Taft Point lot is full and you would rather walk than circle.\n\nOvernight parking on Glacier Point Road beyond Badger Pass is prohibited from October 15 until the road reopens.',
    photos: [{ src: '/photos/washburn-point.jpg', caption: 'Half Dome from Washburn Point, where the rebuilt road left no room to wait on the shoulder.' }], // stand-in: not this entry, see guide-photo-manifest.json
    swap:
      'The trail from this lot is the [Mono Meadow](/hike/mono-meadow) hike. For the view the curb protects, [Washburn Point](/stop/washburn-point).',
  },
  {
    id: 'lukens-lake-trailhead',
    title: 'Lukens Lake, the dozen spaces on Tioga Road',
    order: 36,
    category: 'parking',
    kind: 'parking',
    coord: [-119.61482, 37.85023], // verified 2026-09: OSM parking way 571357903 beside the Lukens Lake trailhead (node 89115200) on Tioga Rd
    timeBudgetMin: 10,
    season: 'Tioga Road season',
    teaser:
      'The short route to Lukens Lake leaves from a Tioga Road pullout with a dozen or so spaces and food lockers across the road. When it is full, the long route starts at White Wolf, two miles west.',
    body:
      'Lukens Lake has two trailheads. The short one is a pullout on Tioga Road with a dozen or so spaces and food lockers across the road; the long one starts at White Wolf, about two miles west, with about as many. Either reaches the lake; the White Wolf start adds the walk.\n\nUse the lockers for food. The park\'s storage rules apply at every trailhead, and the lockers are there for them.\n\nOvernight parking on Tioga Road and its lots is prohibited from October 15 until the road reopens in spring.',
    photos: [{ src: '/photos/white-wolf.jpg', caption: 'White Wolf, the other Lukens Lake trailhead, two miles west.' }], // stand-in: not this entry, see guide-photo-manifest.json
    swap:
      'The walk is the [Lukens Lake](/hike/lukens-lake) hike. If the pullout is full, [White Wolf](/stop/white-wolf) is two miles west.',
  },
  {
    id: 'may-lake-snow-flat-lot',
    title: 'May Lake, the lot at the end of the spur',
    order: 37,
    category: 'parking',
    kind: 'parking',
    coord: [-119.49065, 37.83289], // verified 2026-09: OSM parking way 170518018 at the end of the Snow Flat spur; the OSM "May Lake Trailhead" node sits on Tioga Rd at the turnoff, 1.8 mi short of it
    timeBudgetMin: 10,
    season: 'Tioga Road season',
    teaser:
      'The May Lake trailhead is not on Tioga Road. It is at the end of a 1.8-mile spur to Snow Flat, where the lot and the food lockers are; a map pin on the highway leaves you at the turnoff.',
    body:
      'Several maps and apps put "May Lake Trailhead" at the turnoff on Tioga Road. The trail starts 1.8 miles up the spur road to Snow Flat, which ends in the trailhead lot, where the food lockers are. Drive the spur; do not park at the turnoff.\n\nOvernight parking on Tioga Road and its lots is prohibited from October 15 until the road reopens.',
    photos: [{ src: '/photos/may-lake.jpg', caption: 'May Lake, the walk up from the lot.' }],
    swap:
      'The hike is the [May Lake](/stop/may-lake) entry. If the lot is full, [Olmsted Point](/stop/olmsted-point) is a few minutes east with a large lot.',
  },
  {
    id: 'tuolumne-cathedral-parking',
    title: 'Cathedral Lakes, where to park now',
    order: 38,
    category: 'parking',
    kind: 'parking',
    coord: [-119.37463, 37.87242], // verified 2026-09: OSM parking way 131358463, the Tuolumne Meadows Visitor Center lot NPS now names for the Cathedral Lakes trailhead
    timeBudgetMin: 10,
    season: 'Tioga Road season',
    teaser:
      'The old Cathedral Lakes advice was a shoulder pullout on Tioga Road. The Park Service now starts the hike from the Tuolumne Meadows Visitor Center lot, and roadside parking in Tuolumne ends October 15.',
    body:
      'The Cathedral Lakes trail leaves Tioga Road west of Tuolumne Meadows, and for years hikers parked along the shoulder beside it. The Park Service now says to start from the Tuolumne Meadows Visitor Center parking. Its trailheads page also names the Wilderness Center and Dog Lake lots, both farther east, and either works if the visitor center lot is full.\n\nThe Tuolumne shuttle that once carried hikers from those lots to the trailhead runs in summer only. After October 15 there is no roadside parking in Tuolumne, and overnight parking on Tioga Road and its lots, trailheads included, ends the same day.',
    photos: [{ src: '/photos/cathedral-lakes.jpg', caption: 'Cathedral Lakes, the reason for the lot.' }],
    swap:
      'The hike is the [Cathedral Lakes](/stop/cathedral-lakes) entry. For a sunset stop on the way back west, [Pothole Dome](/stop/pothole-dome-sunset) has its own pullout.',
  },
  {
    id: 'hetch-hetchy-day-lots',
    title: 'Hetch Hetchy, two day lots and a sunset gate',
    order: 39,
    category: 'parking',
    kind: 'parking',
    coord: [-119.78824, 37.9457], // verified 2026-09: OSM parking way 207241244, the day-use lot before the O'Shaughnessy Dam trailhead; the second is way 1434962140 past it
    timeBudgetMin: 10,
    teaser:
      'O\'Shaughnessy Dam has two small day-use lots, one before the trailhead and one after, and the road is open sunrise to sunset only. When they fill, usually weekend middays, the wait moves to the entrance station.',
    body:
      'Hetch Hetchy Road is open from sunrise to sunset only, and the parking at the dam is two small day-use lots: one just before the trailhead, with the toilets, and one just after it. Backpackers use a separate overnight lot near the trailhead.\n\nThe Park Service warns of delays at the Hetch Hetchy entrance station when the lots fill, typically midday on weekends, so a late arrival waits at the gate rather than at the dam. Come early or on a weekday. Vehicles longer than 25 feet or wider than 8 feet are not allowed on the road.',
    photos: [{ src: '/photos/oshaughnessy-dam.jpg', caption: 'O\'Shaughnessy Dam, a few steps from both lots.' }],
    swap:
      'The walk is [Wapama Falls](/stop/wapama-falls-trail), and the dam itself is [O\'Shaughnessy Dam](/stop/oshaughnessy-dam).',
  },

  // --- Quiet vistas, trails and after dark: third set (September 2026) -----
  {
    id: 'half-dome-view-big-oak-flat',
    title: 'Half Dome View, the Big Oak Flat Road\'s quiet overlook',
    order: 40,
    category: 'vistas',
    kind: 'viewpoint',
    coord: [-119.72727, 37.71367], // verified 2026-09: OSM viewpoint node 1874529987 "Half Dome View", paved parking way 179467013 beside it on Big Oak Flat Rd
    elevationFt: 4730,
    timeBudgetMin: 15,
    teaser:
      'A paved pullout at the tunnels on the 1940 Big Oak Flat Road, looking up the Merced gorge to El Capitan and Half Dome. The same Valley as Tunnel View, from the north wall, with a fraction of the people.',
    body:
      'A paved pullout on the Big Oak Flat Road near its tunnels, above the Merced gorge. The view runs up the gorge: El Capitan in the middle left, Half Dome in the middle background, and the Wawona Road cut through the forest on the far wall. It is the same Valley as Tunnel View, seen from the north side, with far fewer people. One wayside exhibit, about forest fire.\n\nThe road you are standing on is the new one. The Big Oak Flat Road was dedicated in June 1940 at a cost of $1,200,000; the original road it replaced had cost $40,000, and its lower grade into the Valley is the Old Big Oak Flat Road walk in this guide.\n\nChains may be required on this road from October through April.',
    hazard: 'The pullout is on a two-lane highway. Stay inside the paved parking area.',
    photos: [{ src: '/photos/half-dome-view-big-oak-flat.jpg', caption: 'Half Dome up the Merced gorge from the Big Oak Flat Road overlook.' }],
    swap:
      'For the classic framing, [Tunnel View](/stop/tunnel-view) on Wawona Road. The old road below is the [Old Big Oak Flat Road](/stop/old-big-oak-flat-road).',
  },
  {
    id: 'wildcat-falls',
    title: 'Wildcat Falls, the one across the road from the Cascades',
    order: 41,
    category: 'vistas',
    kind: 'viewpoint',
    coord: [-119.7171861, 37.7235783], // web-derived 2026-09: OSM waterfall node for Wildcat Falls, north of Hwy 140 about 2.7 mi past Arch Rock (Hikespeak); the turnout itself is unmapped, TODO: verify on the ground
    timeBudgetMin: 20,
    difficulty: 'easy',
    season: 'Spring',
    teaser:
      'On El Portal Road below the Valley, a short unmarked path leads from a turnout to the bottom tier of a 650-foot fall most drivers never see. Spring only; by midsummer it is a trickle.',
    body:
      'Wildcat Creek comes down the north wall of the Merced canyon in a fall of about 650 feet, most of it hidden in the trees above Highway 140. A turnout on the north side of the road, about 2.7 miles past the Arch Rock Entrance, has a short, unmarked and unmaintained path to the bottom tier, a 50-foot cascade: under a tenth of a mile each way, nearly flat. Trees close in around it, so it is a place to stand in the spray rather than a view.\n\nThe creek runs on snowmelt. Spring is the season; by midsummer it fades. The Cascades, a bigger fall where Cascade and Tamarack creeks meet, is a short way east with picnic tables and a vault toilet.',
    hazard:
      'The water is swift and cold, and the Park Service warns it can be deadly in spring runoff. Stay off wet rock.',
    photos: [{ src: '/photos/foresta-cascades.jpg', caption: 'A spring fall in the trees on the canyon wall. Wildcat Falls is this kind of water, closer to the road.' }], // stand-in: not this entry, see guide-photo-manifest.json
    swap:
      'The bigger fall next door is the Cascades, in the [Cascade Creek](/stop/foresta-cascades) stop. Ten minutes east, [Bridalveil Fall](/stop/bridalveil-fall).',
  },
  {
    id: 'yosemite-cemetery',
    title: 'The Yosemite Cemetery, across the road from the museum',
    order: 42,
    category: 'trails',
    kind: 'trailhead',
    coord: [-119.58876, 37.7488], // verified 2026-09: GNIS feature 2792076 via Wikidata Q27146061 (not mapped in OSM); west end of Yosemite Village
    elevationFt: 3990,
    timeBudgetMin: 30,
    difficulty: 'easy',
    teaser:
      'A small graveyard at the west end of Yosemite Village holds Galen Clark, James Hutchings, the first man up Half Dome, and eleven known graves of Yosemite Indians. Most people in the Village never cross the road to it.',
    body:
      'The Yosemite Cemetery is at the far west end of Yosemite Village: walk west past the Yosemite Museum and cross the street. It is small and shaded, with a rocky dirt path the Park Service notes is not wheelchair accessible.\n\nThe graves are the park\'s history in names. Galen Clark, the first guardian the state appointed. James Mason Hutchings, who brought the first tourist party in 1855. Forest Townsley, the first chief ranger. George Anderson, the first person to climb Half Dome. George Fiske, the photographer. Lucy Brown, an American Indian survivor who was over a hundred when she died, and eleven known graves of Yosemite Indians. Visitors who died in the park are buried here too.\n\nA Guide to the Yosemite Cemetery, which tells each marker\'s story, can be borrowed or bought at the Valley visitor center. Park at the Village day-use lot and walk about half a mile, or take the shuttle to stop 5 or 9. Allow ten minutes or an hour.',
    photos: [{ src: '/photos/yosemite-cemetery.jpg', caption: 'A marker under the incense cedars in the Yosemite Cemetery.' }],
    swap:
      'The museum and the Indian Village of the Ahwahnee behind it are in the [Yosemite Village](/stop/yosemite-village) stop.',
  },
  {
    id: 'stoneman-meadow-dusk',
    title: 'Stoneman Meadow at dusk, the primroses and the 1970 riot',
    order: 43,
    category: 'after-dark',
    kind: 'viewpoint',
    coord: [-119.5707173, 37.7406665], // verified 2026-09: OSM way 206870276 "Stoneman Meadow", beside Curry Village
    elevationFt: 3975,
    timeBudgetMin: 40,
    difficulty: 'easy',
    season: 'All year; primroses mid to late summer',
    teaser:
      'A boardwalk meadow by Curry Village facing Half Dome, North Dome and Washington Column, which the Park Service names as a sunset spot. In mid to late summer its evening primroses open at dusk for the sphinx moths.',
    body:
      'The Park Service lists views of Half Dome, North Dome, Upper Yosemite Fall and Washington Column from Stoneman Meadow and calls it an excellent place for sunset. Paths and a boardwalk cross it, wheelchair accessible. In mid to late summer, Hooker\'s evening primrose opens its yellow flowers at dusk, and the sphinx moths come to them; stay after the light goes to see it.\n\nThe meadow has a history no marker records. Over the Fourth of July weekend in 1970, rangers moved to clear young campers from the meadow and the confrontation became a riot. The park called in nearly 150 officers from Madera, Merced and Fresno and U.S. marshals, and 174 people were arrested over two days, 41 of them minors. The Interior Department\'s investigation found it unnecessary and avoidable, and the Park Service\'s federal law enforcement training followed in 1971.\n\nWalk over from Curry Village or take the shuttle; parking or driving on the meadow is prohibited.',
    hazard: 'Stay on the paths and the boardwalk. Bears use Valley meadows at dusk.',
    photoTiming: { best: 'sunset', note: 'The Park Service names it for sunset; stay on for the primroses as the light goes.' },
    photos: [{ src: '/photos/stoneman-meadow-dusk.jpg', caption: 'Stoneman Meadow on a smoky July morning in 2023, the north wall behind it.' }],
    swap:
      'For the same light over the river, [Sentinel Bridge](/stop/sentinel-bridge-sunset). After dark, the [Curry Village evening program](/stop/curry-village-evening-program) is a short walk away in summer.',
  },
  {
    id: 'nunatak-tioga-tarns',
    title: 'The Nunatak Trail, a half-mile of tarns outside Tioga Pass',
    order: 44,
    category: 'trails',
    kind: 'trailhead',
    coord: [-119.25063, 37.93127], // verified 2026-09: OSM node 1967245682 "Nunatak Tioga Tarns Trailhead" on CA 120, Inyo NF, just east of Tioga Lake
    elevationFt: 9640,
    timeBudgetMin: 40,
    difficulty: 'easy',
    season: 'Tioga Road season',
    teaser:
      'A signed half-mile loop among small tarns on the Inyo National Forest side of Tioga Pass, just east of Tioga Lake. The Forest Service calls it wheelchair and stroller friendly.',
    body:
      'The Forest Service trail starts at a roadside pullout with a ramp on Highway 120, just east of Tioga Lake and a few minutes outside the Tioga Pass entrance. It is about half a mile, nearly level, at about 9,500 feet by the Forest Service\'s figure, with signs along the way on the area\'s natural history and geology. The Forest Service lists it as wheelchair and stroller friendly.\n\nThe name is glaciology: a nunatak is a rocky crag that stood above an ice sheet while the ice flowed around it. The tarns are what the ice left in the hollows.\n\nDay use only, sunrise to sunset, with no drinking water. Dogs on leash. It opens and closes with the road.',
    hazard: 'This is about 9,500 feet. Walk slowly on the first day up from the coast.',
    photos: [{ src: '/photos/tioga-lake-campground.jpg', caption: 'Tioga Lake, beside the trailhead. The tarns on the loop are the same granite and water on a smaller scale.' }], // stand-in: not this entry, see guide-photo-manifest.json
    swap:
      'Down the road at Junction Campground, [Bennettville](/stop/bennettville) is the other short walk on this side of the pass.',
  },

  // --- Programs (September 2026) ---------------------------------------------
  // The guided hours worth planning around. Schedules move every season and
  // the fact audit re-reads them: the day and the time of day stay, a clock
  // time appears only where the provider publishes one for the whole year,
  // and every entry names where to check. Sources: yosemite.org (the
  // Conservancy), travelyosemite.com (Yosemite Hospitality), the NPS event
  // listings and the current Yosemite Guide, anseladams.com.
  {
    id: 'conservancy-night-sky',
    title: 'The Conservancy\'s night sky program, the one to book first',
    order: 45,
    category: 'programs',
    kind: 'program',
    timeBudgetMin: 120,
    cost: '$25',
    season: 'Friday and Saturday nights',
    teaser:
      'A Yosemite Conservancy naturalist, a laser pointer and the sky over the Valley: the constellations, the planets up that night, and the stories told about them. No telescopes. Book it before you book dinner.',
    body:
      'Explore Yosemite\'s Night Sky is Yosemite Conservancy\'s astronomy program. A naturalist takes a small group out under the sky over Yosemite Valley with a laser pointer and works through the constellations, the planets up that night, a little planetary science, and the stories cultures have told about the same stars. There are no telescopes. It is an evening spent learning to read the sky with your own eyes, which makes every other night of the trip better.\n\nIt runs on Friday and Saturday nights, starting later in early fall and earlier as the nights lengthen, and lasts an hour and a half to two hours. The meeting place in the Valley comes with the booking confirmation. It costs $25 a person, and children five and under are free. Book through the Conservancy weeks ahead.\n\nLight cloud does not stop it; the naturalist runs a modified program. Real rain cancels it, by text or email. A full moon does not cancel it either: the talk turns to the moon and the bright constellations. Bring a warm layer and a red light. Cancel 30 or more days out and the fee comes back less $25; inside 30 days it does not.',
    booking: { verb: 'Book', source: 'Yosemite Conservancy', url: 'https://yosemite.org/experience/stargazing/' },
    photos: [{ src: '/photos/glacier-point-star-party.jpg', caption: 'The Milky Way over the Sierra on a moonless night, the sky the program teaches you to read.' }], // stand-in: not this entry, see guide-photo-manifest.json
    swap:
      'If it is sold out, Yosemite Hospitality\'s Yosemite After Dark is a flashlight walk of about a mile and a half from Yosemite Valley Lodge, also $25. In summer, the astronomy clubs bring free telescopes to [Glacier Point](/stop/glacier-point-star-party).',
  },
  {
    id: 'ahwahnee-history-tour',
    title: 'The Ahwahnee history tour, the free hour inside the hotel',
    order: 46,
    category: 'programs',
    kind: 'program',
    coord: [-119.574352, 37.746295], // verified 2026-09: the back-lawn meeting point in the NPS event listing for the Historic Ahwahnee Hotel Tour
    timeBudgetMin: 60,
    cost: 'Free',
    season: 'Daily, afternoons',
    teaser:
      'Yosemite Hospitality runs a free one-hour tour of The Ahwahnee every afternoon: the building disguised as timber, the Navy hospital, the rooms Jeannette Dyer Spencer painted. You do not need to be a guest.',
    body:
      'The Ahwahnee looks like a lodge and reads like a museum, and the free Historic Ahwahnee Tour is the way in. Yosemite Hospitality runs it daily in the afternoon, an hour long, for up to 30 people, and it is wheelchair accessible. Reserve by phone at 888-413-8869 or online through Travel Yosemite. The concessioner\'s listing meets on the hotel\'s back lawn and the current Yosemite Guide gives the flagpole; ask at the front desk if the two disagree on the day.\n\nThe story is the building. Stephen Mather wanted a luxury hotel to bring wealthy visitors to the park. Gilbert Stanley Underwood, who had already designed the lodges at Zion and Bryce Canyon, built it to resist fire: steel, granite, and concrete stained to look like wood. It opened on July 14, 1927, after fourteen months of work. Jeannette Dyer Spencer designed the stenciling, the stained glass and the murals on Native basketry patterns. In 1943 the Navy leased the whole hotel as a convalescent hospital, and it stayed one until December 1945. From 2016 to 2019, during a trademark dispute with the departing concessioner, it was called The Majestic Yosemite Hotel, until a settlement returned the name.\n\nPark at Yosemite Village and walk fifteen minutes, or take the shuttle to stop 3; hotel parking is limited and valet fees may apply. Yosemite Hospitality\'s free guided nature walk leaves the same back lawn half an hour after the tour ends, first come, first served.',
    booking: { verb: 'Schedule', source: 'Travel Yosemite', url: 'https://www.travelyosemite.com/things-to-do/naturalist-walks-programs' },
    photos: [{ src: '/photos/ahwahnee-hotel.jpg', caption: 'The Ahwahnee in snow: granite, and concrete that passes for timber.' }],
    swap:
      'If the tour is full, the [Ahwahnee lobby visit](/stop/ahwahnee-hotel) covers the public rooms on your own.',
  },
  {
    id: 'curry-village-evening-program',
    title: 'The Curry Village evening program, half an hour under the trees',
    order: 47,
    category: 'programs',
    kind: 'program',
    coord: [-119.5718372, 37.7371439], // verified 2026-09: OSM way 193057619 "Curry Amphitheater"
    timeBudgetMin: 30,
    cost: 'Free',
    season: 'Summer; winter at Valley Lodge',
    teaser:
      'A free half-hour talk at the Curry Village amphitheater, a different subject each night, given by Yosemite Hospitality naturalists. No booking; walk over after dinner.',
    body:
      'Yosemite Hospitality\'s naturalists give a free evening talk at the Curry Village amphitheater: half an hour on the park\'s natural and cultural history, a different topic each night. It is drop-in, with no booking and no ticket. In summer it has run nightly at 8 p.m., and in spring on Friday and Saturday evenings; the current Yosemite Guide has the season\'s nights.\n\nThe short length is the point. It fits after dinner at Curry Village, it is short enough for children, and it leaves the rest of the evening. Take the shuttle to stop 14 or 19, or walk from the day lot.\n\nIn winter the program moves indoors, to the Cliff Room at Yosemite Valley Lodge, on most evenings of the week.',
    booking: { verb: 'Schedule', source: 'Travel Yosemite', url: 'https://www.travelyosemite.com/things-to-do/naturalist-walks-programs' },
    photos: [{ src: '/photos/curry-village.jpg', caption: 'Curry Village, where the evening talk is given in summer.' }],
    swap:
      'On summer Friday and Saturday nights, the [Conservation Heritage Center](/stop/conservation-heritage-center) runs its own free evening program a short walk west.',
  },
  {
    id: 'conservation-heritage-center',
    title: 'The Conservation Heritage Center, free evenings in a 1903 lodge',
    order: 48,
    category: 'programs',
    kind: 'program',
    coord: [-119.5795243, 37.7399217], // verified 2026-09: OSM way 164026487 "Yosemite Conservation Heritage Center" (the former LeConte Memorial Lodge), across from Housekeeping Camp
    elevationFt: 4000,
    timeBudgetMin: 90,
    cost: 'Free',
    season: 'May to September',
    teaser:
      'The Sierra Club\'s granite lodge across from Housekeeping Camp runs free evening programs on summer weekends. It was Yosemite\'s first public visitor center.',
    body:
      'The Sierra Club began building LeConte Memorial Lodge in 1903 as a memorial to Joseph LeConte, who had died in 1901. It first stood at the base of Glacier Point in Camp Curry and was moved in 1919 to its present site across from Housekeeping Camp. The Park Service calls it Yosemite\'s first public visitor center; it is a National Historic Landmark and now goes by the Yosemite Conservation Heritage Center.\n\nFrom May through September it is open Wednesday to Sunday, 10 a.m. to 4 p.m., with a reference library of John Muir, Ansel Adams and David Brower and a children\'s corner. On Friday and Saturday nights it holds free evening programs on natural history, outdoor adventure and conservation, about an hour and a half long. Parking is very limited; take the shuttle to stop 12.',
    hazard:
      'The building is not wheelchair accessible: eight stone steps to the door and no handrails.',
    photos: [{ src: '/photos/conservation-heritage-center.jpg', caption: 'The granite lodge, moved to this site in 1919.' }],
    swap:
      'Any night of the week in summer, the [Curry Village evening program](/stop/curry-village-evening-program) is a short walk east.',
  },
  {
    id: 'ranger-programs-to-pick',
    title: 'The ranger programs to pick: the children\'s, and Erik Westerlund\'s',
    order: 49,
    category: 'programs',
    kind: 'program',
    coord: [-119.58445, 37.746508], // NPS API visitorcenters: Yosemite Valley Welcome Center (same pin as the valley-welcome-center amenity), where the week's programs are posted
    timeBudgetMin: 60,
    cost: 'Free',
    teaser:
      'The park runs dozens of free ranger programs, and each is only as good as the ranger leading it. Two picks hold up: the children\'s programs, and any walk or talk led by Erik Westerlund, a Yosemite naturalist since 1992.',
    body:
      'Ranger programs are free, listed in the Yosemite Guide and the park\'s online calendar, and uneven: the same walk can be the best hour of a trip or a recitation, depending on who leads it, and the Guide does not print the leader\'s name. Two picks are safe.\n\nThe children\'s programs are the park\'s strongest. The Junior Ranger handbook, for ages 4 to 12, is free at any visitor center or as a download; children work through it and show a ranger for the badge. The Guide also lists short drop-in family programs, such as a Junior Ranger discovery table, which change by season.\n\nErik Westerlund has been a park naturalist in Yosemite since 1992 and won the 2024 Barry Hance Award, the park\'s highest employee honor. He teaches with impersonations, songs, riddles and small improvised dramas, on wildflowers, fungi, salamanders, hummingbirds and the park\'s history, and he yodels on the tram tours. Ask at the Welcome Center which programs he is leading that week.\n\nShelton Johnson, whose programs on the Buffalo Soldiers were for years the best-known ranger talks in the park, has retired. Older guides and articles still send people looking for them.',
    booking: { verb: 'Schedule', source: 'the NPS calendar', url: 'https://www.nps.gov/yose/planyourvisit/calendar.htm' },
    photos: [{ src: '/photos/ranger-programs-to-pick.jpg', caption: 'A ranger program for children in Yosemite. The children\'s programs are the park\'s strongest.' }],
    swap:
      'For children who have finished the badge, the free Kids\' Open Art Studio at [Happy Isles](/stop/happy-isles-art-class) is drop-in on weekdays in season.',
  },
  {
    id: 'ansel-adams-camera-walk',
    title: 'The Ansel Adams Gallery camera walk, free and ten people',
    order: 50,
    category: 'programs',
    kind: 'program',
    coord: [-119.586825, 37.748497], // verified 2026-09: the gallery porch meeting point in the NPS event listing for the free camera walk, Yosemite Village near shuttle stop 5
    timeBudgetMin: 90,
    cost: 'Free',
    season: 'Tuesdays and Thursdays, all year',
    teaser:
      'Twice a week, all year, a staff photographer from The Ansel Adams Gallery takes ten people on a free morning walk through the Valley: the camera you brought, composition, exposure. Registration opens three days ahead.',
    body:
      'The Ansel Adams Gallery in Yosemite Village runs a free photography walk on Tuesday and Thursday mornings at 9, all year, from the gallery porch. A staff photographer leads it for about an hour and a half, on using the camera you brought, composition and exposure; digital or film. It is limited to ten people.\n\nRegistration opens three days ahead on Eventbrite, or by phone at 650-692-3495. For a longer afternoon, the gallery\'s paid In the Footsteps of Ansel Adams program runs about four hours.',
    booking: { verb: 'Book', source: 'The Ansel Adams Gallery', url: 'https://www.anseladams.com/pages/photography-education' },
    photos: [{ src: '/photos/yosemite-village.jpg', caption: 'Yosemite Village, where the walk leaves from the gallery porch.' }], // stand-in: not this entry, see guide-photo-manifest.json
    swap:
      'To practice on your own afterward, [Swinging Bridge](/stop/swinging-bridge-reflection) is the classic Yosemite Falls reflection, in the morning.',
  },
  {
    id: 'happy-isles-art-class',
    title: 'Happy Isles Art and Nature Center, a morning outdoors with a paintbrush',
    order: 51,
    category: 'programs',
    kind: 'program',
    coord: [-119.559572, 37.7304692], // verified 2026-09: OSM node 1667739187 "Nature Center at Happy Isles", now the Happy Isles Art and Nature Center, at shuttle stop 16
    timeBudgetMin: 240,
    cost: 'Class fee',
    season: 'Spring to fall, weekdays',
    teaser:
      'Yosemite Conservancy\'s art classes are four hours outdoors with a working artist, weekday mornings in season at Happy Isles. Children draw for free at the open studio on weekdays.',
    body:
      'Yosemite Conservancy teaches art at the Happy Isles Art and Nature Center, by the Merced at the east end of the Valley: four-hour outdoor workshops led by guest artists, on weekday mornings from spring into fall, with supplies included. The class fee and the season\'s artists are on the Conservancy\'s art page, and its 2026 program added free classes, free children\'s classes and pop-up art.\n\nFor families, the free Kids\' Open Art Studio in the same building is drop-in on weekdays through the season. The center is at the Happy Isles shuttle stop, number 16, near the start of the Mist Trail; the road there is closed to private cars, so ride the shuttle or walk from Curry Village.',
    booking: { verb: 'Book', source: 'Yosemite Conservancy', url: 'https://yosemite.org/experience/art/' },
    photos: [{ src: '/photos/happy-isles-ouzel-watch.jpg', caption: 'The Merced at Happy Isles, beside the center.' }],
    swap:
      'The river outside is the [ouzel watch](/stop/happy-isles-ouzel-watch), and the [Mist Trail](/stop/mist-trail) starts a few steps away.',
  },
]

export const SECRET_SPOTS: SecretSpotT[] = SecretSpots.parse(seed).sort(
  (a, b) => a.order - b.order,
)

