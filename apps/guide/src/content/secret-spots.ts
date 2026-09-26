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
]

export const SECRET_SPOTS: SecretSpotT[] = SecretSpots.parse(seed).sort(
  (a, b) => a.order - b.order,
)

