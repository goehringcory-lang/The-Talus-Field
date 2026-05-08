// =============================================================================
// FIELD GUIDE STOPS — first authoring pass.
//
// Bodies: drafted to match the editorial voice. Expect to refine.
// Coords: best-effort from public knowledge. Every coord marked
//   `// TODO: verify` should be checked against the actual spot before
//   relying on it for navigation. The PWA opens these in native Maps,
//   so a wrong coord lands the buyer at the wrong turnout.
// Photos: placeholder pass. Reusing editorial-site photos from /img/, copied
//   into public/photos/. Many stops still have no matching image and should
//   get dedicated photography before launch.
// =============================================================================

import { z } from 'zod'
import { Stops, type StopT } from './schema'

type StopInput = z.input<typeof Stops>[number]

const seed: StopInput[] = [
  // ===========================================================================
  // 1-DAY TRIP — five stops, valley-only, single arc from arrival to sunset.
  // For visitors with one day. The whole point is restraint: pick the famous
  // spots, do them well, leave with a real impression instead of a checklist.
  // ===========================================================================
  {
    id: '1day-tunnel-view',
    title: 'Tunnel View, the moment the valley opens',
    trip: '1day',
    day: 1,
    order: 1,
    kind: 'viewpoint',
    coord: [-119.6776, 37.7158], // TODO: verify
    elevationFt: 4400,
    timeBudgetMin: 25,
    body:
      'You come out of the Wawona Tunnel and the whole valley is there at once. El Capitan on the left, Bridalveil Fall on the right, Half Dome anchoring the back wall. Most people raise a phone and lower it after thirty seconds. Don\'t. Stay fifteen minutes. Look at the U-shape of the valley floor — a glacier did that, two thousand feet of ice. The hanging valleys above the rim are why the waterfalls fall so far. You\'re not looking at scenery; you\'re looking at the geological event. Once you see it, you can\'t unsee it for the rest of the day.',
    photos: [{ src: '/photos/tunnel-view.jpg', caption: 'The classic view from the Wawona Tunnel pullout.' }],
    swap:
      'If the parking lot is full (it usually is between 10 a.m. and 4 p.m.), continue down to Valley View / Gates of the Valley. Lower angle, same valley, no crowd.',
  },
  {
    id: '1day-cooks-meadow-loop',
    title: 'Cook\'s Meadow Loop',
    trip: '1day',
    day: 1,
    order: 2,
    kind: 'trailhead',
    coord: [-119.5874, 37.7466], // TODO: verify (Cook's Meadow boardwalk)
    elevationFt: 4035,
    timeBudgetMin: 60,
    body:
      'A flat one-mile boardwalk through the meadow at the heart of the valley. Most visitors walk to the Lower Yosemite Fall vista and turn around. Don\'t. Take the full counter-clockwise loop. You get Half Dome from Sentinel Bridge, El Capitan over the meadow, and the black oaks the Ahwahnechee tended for centuries. This is the walk that makes the valley feel like a place, not a viewpoint.',
    photos: [{ src: '/photos/lower-yosemite-fall.jpg', caption: 'Lower Yosemite Fall, the standard turn-around point on the loop.' }],
    swap:
      'In late summer when the falls are dry, the meadow itself is the show — golden grass, low light through the oaks. Skip the fall vista, do the loop in reverse from Sentinel Bridge.',
  },
  {
    id: '1day-bridalveil-fall',
    title: 'Bridalveil Fall',
    trip: '1day',
    day: 1,
    order: 3,
    kind: 'trailhead',
    coord: [-119.6480, 37.7172], // TODO: verify
    elevationFt: 4100,
    timeBudgetMin: 30,
    body:
      'Five-minute walk on a paved path. Bridalveil flows year-round, which makes it the reliable fall — Yosemite Falls dries up by August, this one doesn\'t. The viewing platform gets misty in spring; bring a layer if it\'s cool. You don\'t need long here, but you do need to do it.',
    photos: [{ src: '/photos/cathedral-rocks.jpg', caption: 'Cathedral Rocks looming above the Bridalveil drainage.' }],
  },
  {
    id: '1day-el-cap-meadow',
    title: 'El Capitan Meadow',
    trip: '1day',
    day: 1,
    order: 4,
    kind: 'viewpoint',
    coord: [-119.6310, 37.7212], // TODO: verify
    elevationFt: 4000,
    timeBudgetMin: 30,
    body:
      'Pull off Northside Drive at the meadow and look up. If there are climbers on El Cap (there usually are), borrow binoculars from the photographer with the tripod — they\'ll be happy to point them at the right spot. The wall is 3,000 feet. The climbers move at maybe a hundred feet an hour. You\'re looking at people who have been on that rock for two days and will be there for two more.',
    photos: [{ src: '/photos/el-capitan-winter.jpg', caption: 'El Capitan from Northside Drive, winter light.' }],
  },
  {
    id: '1day-sentinel-bridge-sunset',
    title: 'Sentinel Bridge, the last hour',
    trip: '1day',
    day: 1,
    order: 5,
    kind: 'viewpoint',
    coord: [-119.5867, 37.7421], // TODO: verify (Sentinel Bridge)
    elevationFt: 4000,
    timeBudgetMin: 45,
    body:
      'Half Dome catches the last light from here. The Merced is in the foreground. People crowd the rail; walk down to the small beach below the bridge instead — wider angle, fewer elbows. If you have one image to take home, it\'s this one. Stay until the wall goes from gold to pink to grey. Then drive out via Northside Drive in the dark; you\'ll be tired, and that\'s the right way to leave.',
    photos: [{ src: '/photos/half-dome.jpg', caption: 'Half Dome at last light.' }],
  },

  // ===========================================================================
  // 3-DAY TRIP — twelve stops. The most common visit. Day 1 = arrival and
  // valley orientation, Day 2 = Glacier Point Road and Mariposa Grove, Day 3 =
  // a real hike (Mist Trail) and departure.
  // ===========================================================================

  // --- Day 1: arrival ------------------------------------------------------
  {
    id: '3day-tunnel-view',
    title: 'Tunnel View, on arrival',
    trip: '3day',
    day: 1,
    order: 1,
    kind: 'viewpoint',
    coord: [-119.6776, 37.7158], // TODO: verify
    elevationFt: 4400,
    timeBudgetMin: 25,
    body:
      'First stop on the way in. The valley opens up all at once: El Cap on the left, Bridalveil on the right, Half Dome at the back. Stay fifteen minutes minimum. You have three days, but the orientation matters now — every later stop will sit somewhere on this view in your head.',
    photos: [{ src: '/photos/tunnel-view.jpg', caption: 'The view that anchors the trip.' }],
    swap:
      'If the lot is full, continue down to Valley View / Gates of the Valley for a lower-angle version.',
  },
  {
    id: '3day-valley-loop-drive',
    title: 'Valley loop drive, Tunnel View to Curry Village',
    trip: '3day',
    day: 1,
    order: 2,
    kind: 'drive',
    timeBudgetMin: 50,
    body:
      'Slow drive east on Southside Drive. Three pullouts worth taking on the way: Bridalveil Fall parking, Cathedral Beach (El Capitan view across the river), the Swinging Bridge (kids and quiet water). Don\'t commit to a hike yet. You\'re previewing — the whole point of arriving on day one is unfamiliarity giving way to familiarity.',
  },
  {
    id: '3day-cooks-meadow-loop',
    title: 'Cook\'s Meadow Loop, settle in',
    trip: '3day',
    day: 1,
    order: 3,
    kind: 'trailhead',
    coord: [-119.5874, 37.7466], // TODO: verify (Cook's Meadow boardwalk)
    elevationFt: 4035,
    timeBudgetMin: 60,
    body:
      'A flat one-mile boardwalk through the meadow at the heart of the valley. Most visitors walk to the Lower Yosemite Fall vista and turn around. You take the full loop, counter-clockwise from the falls. Half Dome from Sentinel Bridge, El Cap over the meadow, the black oaks the Ahwahnechee tended for centuries. This is the walk that makes the valley feel like a place.',
    photos: [{ src: '/photos/lower-yosemite-fall.jpg', caption: 'Lower Yosemite Fall from the boardwalk.' }],
  },
  {
    id: '3day-curry-village-night-1',
    title: 'Curry Village, first night',
    trip: '3day',
    day: 1,
    order: 4,
    kind: 'lodging',
    coord: [-119.5688, 37.7395], // TODO: verify (Curry Village core)
    body:
      'Tent cabins or wood cabins, your call. The tent cabins have history (this is the original 1899 camp); the wood cabins have insulation. Either way, the location is what you\'re paying for: walking distance to the dining hall, the shuttle stop, and the trailhead for Mist Trail in the morning. Reservations open thirteen months out and the good months sell in minutes. If you couldn\'t get Curry, Yosemite Valley Lodge or the Ahwahnee are the in-park alternates.',
    swap:
      'If staying outside the park: El Portal (closest, 30 min), Mariposa (45 min, more options), or Groveland (north entrance side, 1 hr to valley).',
  },

  // --- Day 2: Glacier Point Road + Mariposa --------------------------------
  {
    id: '3day-glacier-point-road-drive',
    title: 'Glacier Point Road, end to end',
    trip: '3day',
    day: 2,
    order: 1,
    kind: 'drive',
    coord: [-119.6386, 37.6517], // TODO: verify (Chinquapin junction; was 37.6573, ~620 m off)
    timeBudgetMin: 90,
    body:
      'Sixteen miles from the Chinquapin junction to Glacier Point itself. Most people drive it straight through to the viewpoint and complain about the parking. Don\'t. The road is the experience. Pothole Meadows (mile 10) for wildflowers in early summer, Sentinel Dome / Taft Point trailhead (mile 13.6), Washburn Point (mile 15.5) for the Half Dome / Vernal-Nevada view that\'s arguably better than Glacier Point itself. Plan three hours for the round trip with stops, not one.',
    photos: [{ src: '/photos/wildflowers.jpg', caption: 'Pothole Meadows in early summer.' }],
  },
  {
    id: '3day-sentinel-dome',
    title: 'Sentinel Dome, the easy 360',
    trip: '3day',
    day: 2,
    order: 2,
    kind: 'trailhead',
    coord: [-119.5841, 37.7236], // TODO: verify (Sentinel Dome summit; was 37.7155, ~900 m off)
    elevationFt: 8122,
    timeBudgetMin: 90,
    body:
      'A 2.2-mile round trip with about 400 feet of gain to a granite dome with a 360-degree view: Half Dome, El Capitan, the Clark Range, the high country to the north. Easier than it looks. Most visitors choose between Sentinel Dome and Taft Point — Taft has the cliff edge with the 3,000-foot drop, Sentinel has the panorama. Sentinel is the better introduction; come back for Taft another trip.',
    photos: [{ src: '/photos/milky-way-sentinel-dome.jpg', caption: 'Sentinel Dome at night, Milky Way over the panorama.' }],
    swap:
      'If you want both, do the Sentinel-Dome-to-Taft-Point loop (5 miles total). Adds about an hour and a half.',
  },
  {
    id: '3day-glacier-point',
    title: 'Glacier Point, late afternoon',
    trip: '3day',
    day: 2,
    order: 3,
    kind: 'viewpoint',
    coord: [-119.5731, 37.7283], // TODO: verify
    elevationFt: 7214,
    timeBudgetMin: 60,
    body:
      'Half Dome at eye level. The valley floor 3,200 feet below. The waterfalls visible end-to-end. Avoid noon to four — the parking is brutal and the light is flat. Late afternoon (4:30 p.m. onward) the lot empties, the light turns warm, and you can sit on the wall and watch the shadow climb Half Dome. Stay through sunset if you can; the drive back to the valley in the dark is fine, just slow.',
    photos: [{ src: '/photos/half-dome.jpg', caption: 'Half Dome at eye level from the Glacier Point wall.' }],
    swap:
      'If parking is hopeless, the Four-Mile Trail goes from Glacier Point down to the valley floor (4.8 miles, 3,200 ft loss). Park one car at the bottom, drive the other up. Knees take the hit, not your patience.',
  },
  {
    id: '3day-mariposa-grove',
    title: 'Mariposa Grove of Giant Sequoias',
    trip: '3day',
    day: 2,
    order: 4,
    kind: 'trailhead',
    coord: [-119.6083, 37.5108], // TODO: verify (Mariposa Grove Welcome Plaza; was off ~700 m)
    elevationFt: 5600,
    timeBudgetMin: 150,
    body:
      'You park at the Welcome Plaza and ride the free shuttle two miles up to the grove. Walk the Grizzly Giant Loop (2 miles, 300 ft of gain) — past the Fallen Monarch, the Bachelor and Three Graces, the Grizzly Giant itself (around 2,700 years old). Don\'t skip the California Tunnel Tree just past Grizzly Giant. The shuttle runs every 15 minutes from April through November; first run is 8 a.m., last around 6. If you go in the late afternoon, the grove empties and the light through the canopy is gold. These trees are not redwoods. They\'re the largest trees on earth by volume, and they only grow in this strip of the Sierra.',
    swap:
      'If you have stamina, the Guardians Loop (6.5 miles, 1,200 ft) takes you up to the upper grove. Most visitors don\'t make it that far, which is the point.',
  },

  // --- Day 3: hike + departure ---------------------------------------------
  {
    id: '3day-mist-trail',
    title: 'Mist Trail to Vernal Fall (and Nevada, if you have it in you)',
    trip: '3day',
    day: 3,
    order: 1,
    kind: 'trailhead',
    coord: [-119.5594, 37.7338], // TODO: verify (Happy Isles)
    elevationFt: 4035,
    timeBudgetMin: 360,
    body:
      'The hike that earns the trip. Start at Happy Isles by 6:30 a.m. The first 0.8 miles is paved and gets you to the Vernal Fall footbridge — most casual hikers turn around here. Past the bridge, the granite stairs start. You climb 600 stone steps in spray (May–June) or sun-baked rock (August). Vernal Fall is at the top of the stairs, 1.6 miles in. If you\'re still strong, push another 1.5 miles to Nevada Fall — the longer, gentler John Muir Trail descends from there back to Happy Isles. Loop total: about 7 miles, 2,000 ft of gain, 5–6 hours with breaks. Bring more water than you think.',
    photos: [{ src: '/photos/vernal-fall.jpg', caption: 'Vernal Fall at the top of the granite stairs.' }],
    swap:
      'If the legs say no, just do Vernal Fall and back via the same trail (3 miles RT, 1,000 ft). Still a real hike. The first lower mile is closed November–April when the stairs ice over.',
  },
  {
    id: '3day-lunch-curry-village',
    title: 'Lunch back at Curry Village',
    trip: '3day',
    day: 3,
    order: 2,
    kind: 'meal',
    coord: [-119.5688, 37.7395], // TODO: verify (Curry Village core)
    timeBudgetMin: 60,
    body:
      'You\'ll be hungry off the Mist Trail. The Curry Village pizza patio is right there, fast, and good after a hike. Loft has a slightly better menu if you have patience. The Ahwahnee dining room is available for lunch but you\'ll need a reservation and you\'ll want to clean up first.',
  },
  {
    id: '3day-tunnel-view-departure',
    title: 'Tunnel View, on the way out',
    trip: '3day',
    day: 3,
    order: 3,
    kind: 'viewpoint',
    coord: [-119.6776, 37.7158], // TODO: verify
    elevationFt: 4400,
    timeBudgetMin: 15,
    body:
      'Same view, three days later. It\'s a different view now because you\'ve been in it. El Capitan is the wall you watched climbers on. Half Dome is the rock you saw at sunset from Glacier Point. Bridalveil is the fall you walked to. Stay five minutes. Then go.',
    photos: [{ src: '/photos/tunnel-view.jpg', caption: 'The same view, leaving with three days inside it.' }],
  },

  // ===========================================================================
  // 5-DAY TRIP — twenty stops. The trip that actually shows you the park.
  // Adds a Tioga Road / Tuolumne high-country day, a valley deep day, a real
  // hike day, and unhurried mornings.
  // ===========================================================================

  // --- Day 1: arrival ------------------------------------------------------
  {
    id: '5day-tunnel-view',
    title: 'Tunnel View, the orientation',
    trip: '5day',
    day: 1,
    order: 1,
    kind: 'viewpoint',
    coord: [-119.6776, 37.7158], // TODO: verify
    elevationFt: 4400,
    timeBudgetMin: 30,
    body:
      'You have five days. That changes how you stand here. This isn\'t a quick photo stop — it\'s the orientation for everything coming. El Capitan on the left, where you\'ll watch climbers on day 2. Bridalveil on the right, which you\'ll walk to before lunch. Half Dome at the back, which you\'ll see from Glacier Point on day 3 and from above on day 4. Stay twenty minutes. Then drive in slowly.',
    photos: [{ src: '/photos/tunnel-view.jpg', caption: 'Day one orientation.' }],
  },
  {
    id: '5day-valley-loop-drive',
    title: 'Valley loop drive',
    trip: '5day',
    day: 1,
    order: 2,
    kind: 'drive',
    timeBudgetMin: 60,
    body:
      'Slow drive east on Southside Drive. Bridalveil Fall parking, Cathedral Beach for the El Cap view, Swinging Bridge for the quiet water, Sentinel Beach for the Half Dome reflection. You\'re previewing — every stop here is a place you\'ll come back to with intention later in the trip.',
  },
  {
    id: '5day-cooks-meadow-loop',
    title: 'Cook\'s Meadow Loop',
    trip: '5day',
    day: 1,
    order: 3,
    kind: 'trailhead',
    coord: [-119.5874, 37.7466], // TODO: verify (Cook's Meadow boardwalk)
    elevationFt: 4035,
    timeBudgetMin: 75,
    body:
      'Full one-mile boardwalk loop, counter-clockwise from the Lower Yosemite Fall vista. Half Dome from Sentinel Bridge, El Capitan over the meadow, black oaks and red-legged frogs in the shallow ponds. With five days, do it slow. You\'ll come back to this meadow at sunrise on day 4 — note the angles now.',
    photos: [{ src: '/photos/lower-yosemite-fall.jpg', caption: 'Lower Yosemite Fall.' }],
  },
  {
    id: '5day-curry-village-stay',
    title: 'Curry Village, base camp',
    trip: '5day',
    day: 1,
    order: 4,
    kind: 'lodging',
    coord: [-119.5688, 37.7395], // TODO: verify (Curry Village core)
    body:
      'Five nights here if you can swing it. The cabins aren\'t fancy but the location is unbeatable for a long trip — walking distance to the dining hall, the shuttle, and most trailheads. If Curry is full, Yosemite Valley Lodge is the next-best in-valley option. Avoid the temptation to mix lodging across the trip; the time you save on packing each morning is worth more than the variety.',
    swap:
      'For the high-country day (day 4), some visitors split off and stay at Tuolumne Meadows Lodge instead of driving back. If it\'s open and you can get a tent cabin, do it. Otherwise just budget the 90-minute drive back.',
  },

  // --- Day 2: valley deep --------------------------------------------------
  {
    id: '5day-mirror-lake',
    title: 'Mirror Lake, before the crowd',
    trip: '5day',
    day: 2,
    order: 1,
    kind: 'trailhead',
    coord: [-119.5570, 37.7464], // TODO: verify
    elevationFt: 4094,
    timeBudgetMin: 90,
    body:
      'Two miles round trip from the shuttle stop, mostly flat. The "lake" is really a pool in the Tenaya Creek drainage; it\'s a real lake in spring, mostly meadow by August. Either way it\'s the closest spot in the valley to Half Dome, looking up the back side of it. Go early — the trail is in shade until 10 a.m. and the reflection is gone by mid-morning when the breeze picks up.',
  },
  {
    id: '5day-el-cap-meadow-watch',
    title: 'El Capitan Meadow, watching the wall',
    trip: '5day',
    day: 2,
    order: 2,
    kind: 'viewpoint',
    coord: [-119.6310, 37.7212], // TODO: verify
    elevationFt: 4000,
    timeBudgetMin: 60,
    body:
      'Pull off and look up. There are climbers somewhere on the wall right now. Find the photographer with the longest lens, ask politely, and they\'ll point them out — climbers love showing them off. Most parties take 3–5 days on the standard routes; you\'re looking at people in tents glued to a 3,000-foot vertical wall. Bring binoculars if you have them. This is the best free show in the park.',
    photos: [{ src: '/photos/el-capitan-winter.jpg', caption: 'El Capitan from the meadow.' }],
  },
  {
    id: '5day-ahwahnee-tour',
    title: 'The Ahwahnee Hotel, lobby visit',
    trip: '5day',
    day: 2,
    order: 3,
    kind: 'viewpoint',
    coord: [-119.5747, 37.7458], // TODO: verify (Ahwahnee Hotel; was off ~600 m east)
    timeBudgetMin: 45,
    body:
      'You don\'t have to be a guest. The lobby and Great Lounge are open to the public. Walk through. The 1927 building is a national historic landmark — Native American motifs, exposed beams, a 24-foot fireplace. Sit by the fire if it\'s lit. Order a drink at the bar. The dining room requires reservations and dress code; the bar doesn\'t. This is the kind of place worth spending an hour in just to absorb.',
  },
  {
    id: '5day-sentinel-bridge-sunset',
    title: 'Sentinel Bridge, the long sunset',
    trip: '5day',
    day: 2,
    order: 4,
    kind: 'viewpoint',
    coord: [-119.5867, 37.7421], // TODO: verify (Sentinel Bridge)
    elevationFt: 4000,
    timeBudgetMin: 60,
    body:
      'Half Dome catches the last light. The Merced in the foreground. Walk down to the beach below the bridge for a wider angle and fewer elbows. Stay until the wall goes from gold to pink to grey, and then through twilight to first stars. With five days, you have the time to wait for the moment the wall stops glowing — most visitors leave too early.',
    photos: [{ src: '/photos/half-dome.jpg', caption: 'Half Dome at last light.' }],
  },

  // --- Day 3: Glacier Point Road + sequoias --------------------------------
  {
    id: '5day-glacier-point-road-drive',
    title: 'Glacier Point Road, slow version',
    trip: '5day',
    day: 3,
    order: 1,
    kind: 'drive',
    coord: [-119.6386, 37.6517], // TODO: verify (Chinquapin junction)
    timeBudgetMin: 120,
    body:
      'Sixteen miles. Plan four hours, not two. Pothole Meadows for wildflowers in early summer (mile 10), Sentinel Dome trailhead (mile 13.6), Washburn Point (mile 15.5) for what may be a better view than Glacier Point itself. The road is closed in winter — if you\'re here November through May, this whole day flips to a Hetch Hetchy or Mariposa Grove day instead.',
    photos: [{ src: '/photos/wildflowers.jpg', caption: 'Pothole Meadows wildflowers, early summer.' }],
  },
  {
    id: '5day-sentinel-dome',
    title: 'Sentinel Dome, the panorama',
    trip: '5day',
    day: 3,
    order: 2,
    kind: 'trailhead',
    coord: [-119.5841, 37.7236], // TODO: verify (Sentinel Dome summit; was 37.7155, ~900 m off)
    elevationFt: 8122,
    timeBudgetMin: 120,
    body:
      'The Sentinel-Dome-to-Taft-Point loop is the right move on a five-day trip: 5 miles, ~700 ft of gain, both viewpoints in one walk. Sentinel is the 360-degree panorama. Taft is the cliff edge with the 3,000-foot drop. Do them in either order. Bring lunch and stay on top of Sentinel for thirty minutes — you won\'t see the high country laid out like this from many other places.',
    photos: [{ src: '/photos/milky-way-sentinel-dome.jpg', caption: 'Sentinel Dome panorama, Milky Way edition.' }],
  },
  {
    id: '5day-glacier-point',
    title: 'Glacier Point, the right time of day',
    trip: '5day',
    day: 3,
    order: 3,
    kind: 'viewpoint',
    coord: [-119.5731, 37.7283], // TODO: verify
    elevationFt: 7214,
    timeBudgetMin: 75,
    body:
      'Park clears after 4 p.m. Light turns from flat to warm. Sit on the wall and watch the shadow climb Half Dome. If a ranger is giving an evening talk (most weekends June through August), stay for it — they\'re short and they\'re good. The drive down in the dark is slow but not hard.',
    photos: [{ src: '/photos/half-dome.jpg', caption: 'Half Dome from Glacier Point at sundown.' }],
  },
  {
    id: '5day-mariposa-grove',
    title: 'Mariposa Grove, late afternoon',
    trip: '5day',
    day: 3,
    order: 4,
    kind: 'trailhead',
    coord: [-119.6083, 37.5108], // TODO: verify (Mariposa Grove Welcome Plaza)
    elevationFt: 5600,
    timeBudgetMin: 180,
    body:
      'Park at the Welcome Plaza, take the shuttle two miles up. Grizzly Giant Loop (2 miles) is the standard; if you have the legs and the light, push to the Guardians Loop (6.5 miles, 1,200 ft of gain) and you\'ll have the upper grove largely to yourself. Late afternoon turns the canopy gold. Last shuttle is around 6 p.m. — time it so you\'re back at the plaza before dark.',
  },

  // --- Day 4: Tioga Road / Tuolumne Meadows --------------------------------
  {
    id: '5day-tioga-road-drive',
    title: 'Tioga Road, the high-country drive',
    trip: '5day',
    day: 4,
    order: 1,
    kind: 'drive',
    coord: [-119.7973, 37.7551], // TODO: verify (Crane Flat junction)
    timeBudgetMin: 120,
    body:
      '47 miles from Crane Flat to Tioga Pass (9,945 ft). Gas up at Crane Flat — there is no gas on Tioga Road itself. The road climbs through fir forest, then lodgepole pine, then opens into granite domes and meadows. Tioga is closed November through May (sometimes longer). When it opens — late May or early June in 2026 — the first two weeks are extraordinary: snowmelt, no crowds, hardly anyone on the road yet.',
    photos: [{ src: '/photos/tuolumne-meadows.jpg', caption: 'Tuolumne Meadows, the high-country payoff.' }],
  },
  {
    id: '5day-olmsted-point',
    title: 'Olmsted Point',
    trip: '5day',
    day: 4,
    order: 2,
    kind: 'viewpoint',
    coord: [-119.4884, 37.8096], // TODO: verify
    elevationFt: 8300,
    timeBudgetMin: 30,
    body:
      'A short walk from the parking lot to a granite slab pocked with glacial erratics — boulders left here when the ice melted. Cloud\'s Rest dominates the view; Half Dome is visible over its left shoulder, from the back side. This is the geologically literate version of Tunnel View: same valley, viewed from where the glacier stood.',
    photos: [{ src: '/photos/half-dome.jpg', caption: 'Half Dome from the high country side.' }],
  },
  {
    id: '5day-tenaya-lake',
    title: 'Tenaya Lake',
    trip: '5day',
    day: 4,
    order: 3,
    kind: 'viewpoint',
    coord: [-119.4548, 37.8330], // TODO: verify
    elevationFt: 8150,
    timeBudgetMin: 60,
    body:
      'The east beach is the spot. Granite cliffs on the south side, lodgepole forest on the north, Polly Dome rising at the west end. The water is 55–60°F even in August — short swims only. In late May the lake is often still partly iced over; by July it\'s sun-warmed at the edges. Stop here for lunch on the rocks.',
  },
  {
    id: '5day-cathedral-lakes',
    title: 'Cathedral Lakes',
    trip: '5day',
    day: 4,
    order: 4,
    kind: 'trailhead',
    coord: [-119.3829, 37.8732], // TODO: VERIFY URGENTLY — body says "new TH at visitor center" but the historical Cathedral Lakes TH is on Tioga Rd at -119.3829. Confirm whether NPS has actually relocated the trailhead before relying on this coord.
    elevationFt: 8560,
    timeBudgetMin: 360,
    body:
      'The high-country day hike. The new trailhead is at the Tuolumne Meadows Visitor Center. 9 miles round trip to Lower Cathedral Lake (1,000 ft of gain), or 10.5 miles for both lakes. Lower Cathedral sits at 9,288 ft with Cathedral Peak rising directly behind it — the granodiorite peak John Muir camped on in 1869. Best mid-July through mid-September; trail can hold snow into late June. Plan 5–7 hours with lake time. Bring layers.',
    swap:
      'If a 9-mile hike is too much, do the Pothole Dome short scramble at the west end of Tuolumne Meadows instead (0.5 mi, ~200 ft, 360-degree view). Soda Springs / Parsons Lodge from there is another easy 1.5 miles round trip.',
  },
  {
    id: '5day-soda-springs-parsons-lodge',
    title: 'Soda Springs and Parsons Lodge',
    trip: '5day',
    day: 4,
    order: 5,
    kind: 'trailhead',
    coord: [-119.3589, 37.8772], // TODO: verify (Lembert Dome parking lot, start of Soda Springs walk; was off ~900 m)
    elevationFt: 8600,
    timeBudgetMin: 90,
    body:
      'A 1.5-mile round trip from the Lembert Dome parking lot. Soda Springs is a naturally carbonated spring bubbling up out of the meadow — taste it if you want, it\'s safe (a little metallic). Parsons Lodge is a 1915 stone Sierra Club building, sometimes staffed in summer. End the high-country day here. Drive back to the valley in twilight; the Tioga Road in low light is a memory you keep.',
    photos: [{ src: '/photos/tuolumne-meadows.jpg', caption: 'Tuolumne Meadows from the Soda Springs walk.' }],
  },

  // --- Day 5: real hike + departure ----------------------------------------
  {
    id: '5day-mist-trail',
    title: 'Mist Trail and the John Muir descent',
    trip: '5day',
    day: 5,
    order: 1,
    kind: 'trailhead',
    coord: [-119.5594, 37.7338], // TODO: verify
    elevationFt: 4035,
    timeBudgetMin: 420,
    body:
      'The hike that earns the trip. Start at Happy Isles by 6:30 a.m. — earlier is better. Up the Mist Trail (granite stairs, 600 of them, in spray) to Vernal Fall (1.6 mi). Push to Nevada Fall (3 mi total, ~2,000 ft gain). Descend on the John Muir Trail — longer, gentler, easier on the knees, and you\'ll have it largely to yourself because most people descend the way they came up. Loop total: 7 miles, 5–6 hours. The Mist Trail is wet and slippery; trekking poles help.',
    photos: [{ src: '/photos/vernal-fall.jpg', caption: 'Vernal Fall from the top of the granite stairs.' }],
    swap:
      'If you have the legs and the cables are open (mid-May to mid-October) and the lottery gods love you, this is the day for Half Dome — 14–16 miles, 4,800 ft, 10–12 hours, separate permit. Otherwise the Mist/JMT loop is the right hike.',
  },
  {
    id: '5day-tunnel-view-departure',
    title: 'Tunnel View, on the way out',
    trip: '5day',
    day: 5,
    order: 2,
    kind: 'viewpoint',
    coord: [-119.6776, 37.7158], // TODO: verify
    elevationFt: 4400,
    timeBudgetMin: 20,
    body:
      'Same view as day one, five days later. Now El Capitan is the wall you watched climbers on. Half Dome is the rock you saw from Glacier Point at sunset and from Olmsted Point from the back. Cathedral Peak is somewhere in the high country to the right, the one you walked under yesterday. The valley got smaller because you got bigger inside it. Stay ten minutes. Then drive out.',
    photos: [{ src: '/photos/tunnel-view.jpg', caption: 'Five days later. Same view, different person.' }],
  },
]

// Validate the entire collection at module-load. Any schema violation throws
// here and Vite surfaces it in the browser overlay or fails the build in CI.
export const stops: StopT[] = Stops.parse(seed)
