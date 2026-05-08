// =============================================================================
// FIELD GUIDE STOPS — region-organized.
//
// Stops are grouped into three regions: the Valley, Glacier Point & Mariposa,
// and Tuolumne / the Hwy 120 corridor. Within each region, `order` defines a
// suggested reading sequence (roughly the order a thoughtful visitor would do
// them in), but the page presents them as a flat list — visitors pick by what
// fits the time they have.
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
  // YOSEMITE VALLEY & SURROUNDING AREAS
  // The valley floor and the rim viewpoints that look down into it. The hub
  // most visitors orbit. Tunnel View, the meadows, the climbing wall, the
  // Mist Trail, the lodgings.
  // ===========================================================================
  {
    id: 'tunnel-view',
    title: 'Tunnel View, the moment the valley opens',
    region: 'valley',
    order: 1,
    kind: 'viewpoint',
    coord: [-119.6776, 37.7158], // TODO: verify
    elevationFt: 4400,
    timeBudgetMin: 25,
    body:
      'You come out of the Wawona Tunnel and the whole valley is there at once. El Capitan on the left, Bridalveil Fall on the right, Half Dome anchoring the back wall. Most people raise a phone and lower it after thirty seconds. Don\'t. Stay fifteen minutes. Look at the U-shape of the valley floor — a glacier did that, two thousand feet of ice. The hanging valleys above the rim are why the waterfalls fall so far. You\'re not looking at scenery; you\'re looking at the geological event. Once you see it, you can\'t unsee it for the rest of the trip.\n\nIf this is your arrival, the orientation matters: every later stop will sit somewhere on this view in your head. If it\'s your departure, stay five minutes. The view is different now because you\'ve been in it.',
    photos: [{ src: '/photos/tunnel-view.jpg', caption: 'The classic view from the Wawona Tunnel pullout.' }],
    swap:
      'If the parking lot is full (it usually is between 10 a.m. and 4 p.m.), continue down to Valley View / Gates of the Valley. Lower angle, same valley, no crowd.',
  },
  {
    id: 'valley-loop-drive',
    title: 'Valley loop drive, Tunnel View to Curry Village',
    region: 'valley',
    order: 2,
    kind: 'drive',
    timeBudgetMin: 60,
    body:
      'Slow drive east on Southside Drive. Pullouts worth taking on the way: Bridalveil Fall parking, Cathedral Beach (El Capitan view across the river), the Swinging Bridge (kids and quiet water), Sentinel Beach (Half Dome reflection on calm mornings). Don\'t commit to a hike yet — you\'re previewing. Every stop here is a place worth coming back to with intention.',
  },
  {
    id: 'cooks-meadow-loop',
    title: 'Cook\'s Meadow Loop',
    region: 'valley',
    order: 3,
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
    id: 'bridalveil-fall',
    title: 'Bridalveil Fall',
    region: 'valley',
    order: 4,
    kind: 'trailhead',
    coord: [-119.6480, 37.7172], // TODO: verify
    elevationFt: 4100,
    timeBudgetMin: 30,
    body:
      'Five-minute walk on a paved path. Bridalveil flows year-round, which makes it the reliable fall — Yosemite Falls dries up by August, this one doesn\'t. The viewing platform gets misty in spring; bring a layer if it\'s cool. You don\'t need long here, but you do need to do it.',
    photos: [{ src: '/photos/cathedral-rocks.jpg', caption: 'Cathedral Rocks looming above the Bridalveil drainage.' }],
  },
  {
    id: 'old-big-oak-flat-road',
    title: 'Old Big Oak Flat Road and Ribbon Fall',
    region: 'valley',
    order: 5,
    kind: 'trailhead',
    coord: [-119.6451, 37.7238],
    elevationFt: 4000,
    timeBudgetMin: 240,
    body:
      'A small dirt pullout on Northside Drive, between the Pohono Bridge and El Capitan. Most people drive past it. From this turnout you can climb the original Big Oak Flat Road — the wagon grade completed in 1874, one of the three original roads built to reach the valley floor. It carried stagecoaches for seventy years. A massive rockslide in 1945 closed it permanently, and it\'s never reopened to vehicles. Most of the old roadbed is still there: hand-stacked retaining walls, cut blocks, switchbacks wide enough for a six-horse coach. Almost nobody walks it.\n\nThe climb is rock-hopping and a little scrambly in places — nothing technical, doable with kids. About a mile and 800 feet of gain gets you to the first big preserved section of road. Bring lunch. Sit in the shade of incense cedars and look across the valley at Cathedral Rocks. Half a day, easy. A full day if you keep going.\n\nIn early spring — March through early May, depending on snowmelt — extend west from the old road to the base of Ribbon Fall. The traverse is unmarked and rough; you\'re following the sound of water through talus. The payoff is standing under a 1,612-foot single drop — the tallest waterfall in North America, taller than the Empire State Building. It only flows for a few weeks a year, fed entirely by snowmelt off the rim above. By late May it\'s usually dry. Most visitors never see it run.\n\nSummer or not, the road itself is the year-round draw. You\'re walking the grade that carried the first generation of Yosemite tourists down into the valley, and you\'ll have it to yourself.',
    swap:
      'The dirt pullout holds maybe four or five cars. If it\'s full, park at the Bridalveil Fall lot a quarter mile east and walk back along Northside Drive. Adds fifteen minutes each way and a touch of road noise, but you don\'t lose the day.',
  },
  {
    id: 'el-capitan-meadow',
    title: 'El Capitan Meadow, watching the wall',
    region: 'valley',
    order: 6,
    kind: 'viewpoint',
    coord: [-119.6310, 37.7212], // TODO: verify
    elevationFt: 4000,
    timeBudgetMin: 60,
    body:
      'Pull off Northside Drive at the meadow and look up. There are climbers somewhere on the wall right now. Find the photographer with the longest lens, ask politely, and they\'ll point them out — climbers love showing them off. Most parties take 3–5 days on the standard routes; you\'re looking at people in tents glued to a 3,000-foot vertical wall, who have been on it for two days and will be there for two more. Bring binoculars if you have them. This is the best free show in the park.',
    photos: [{ src: '/photos/el-capitan-winter.jpg', caption: 'El Capitan from Northside Drive, winter light.' }],
  },
  {
    id: 'mirror-lake',
    title: 'Mirror Lake, before the crowd',
    region: 'valley',
    order: 7,
    kind: 'trailhead',
    coord: [-119.5570, 37.7464], // TODO: verify
    elevationFt: 4094,
    timeBudgetMin: 90,
    body:
      'Two miles round trip from the shuttle stop, mostly flat. The "lake" is really a pool in the Tenaya Creek drainage; it\'s a real lake in spring, mostly meadow by August. Either way it\'s the closest spot in the valley to Half Dome, looking up the back side of it. Go early — the trail is in shade until 10 a.m. and the reflection is gone by mid-morning when the breeze picks up.',
  },
  {
    id: 'mist-trail',
    title: 'Mist Trail to Vernal Fall (and Nevada, if you have it)',
    region: 'valley',
    order: 8,
    kind: 'trailhead',
    coord: [-119.5594, 37.7338], // TODO: verify (Happy Isles)
    elevationFt: 4035,
    timeBudgetMin: 360,
    body:
      'The hike that earns the trip. Start at Happy Isles by 6:30 a.m. — earlier is better. The first 0.8 miles is paved and gets you to the Vernal Fall footbridge — most casual hikers turn around here. Past the bridge, the granite stairs start. You climb 600 stone steps in spray (May–June) or sun-baked rock (August). Vernal Fall is at the top of the stairs, 1.6 miles in. If you\'re still strong, push another 1.5 miles to Nevada Fall.\n\nDescend on the John Muir Trail — longer, gentler, easier on the knees, and you\'ll have it largely to yourself because most people return the way they came up. Loop total: about 7 miles, 2,000 ft of gain, 5–6 hours with breaks. The Mist Trail is wet and slippery; trekking poles help. Bring more water than you think.',
    photos: [{ src: '/photos/vernal-fall.jpg', caption: 'Vernal Fall at the top of the granite stairs.' }],
    swap:
      'If the legs say no, just do Vernal Fall and back via the same trail (3 miles RT, 1,000 ft). Still a real hike. The first lower mile is closed November–April when the stairs ice over. If you have the legs and the cables are open (mid-May to mid-October) and the lottery gods love you, this is the day for Half Dome — 14–16 miles, 4,800 ft, 10–12 hours, separate permit.',
  },
  {
    id: 'ahwahnee-hotel',
    title: 'The Ahwahnee Hotel, lobby visit',
    region: 'valley',
    order: 9,
    kind: 'viewpoint',
    coord: [-119.5747, 37.7458], // TODO: verify (Ahwahnee Hotel; was off ~600 m east)
    timeBudgetMin: 45,
    body:
      'You don\'t have to be a guest. The lobby and Great Lounge are open to the public. Walk through. The 1927 building is a national historic landmark — Native American motifs, exposed beams, a 24-foot fireplace. Sit by the fire if it\'s lit. Order a drink at the bar. The dining room requires reservations and dress code; the bar doesn\'t. This is the kind of place worth spending an hour in just to absorb.',
  },
  {
    id: 'sentinel-bridge-sunset',
    title: 'Sentinel Bridge, the last hour',
    region: 'valley',
    order: 10,
    kind: 'viewpoint',
    coord: [-119.5867, 37.7421], // TODO: verify (Sentinel Bridge)
    elevationFt: 4000,
    timeBudgetMin: 60,
    body:
      'Half Dome catches the last light from here. The Merced is in the foreground. People crowd the rail; walk down to the small beach below the bridge instead — wider angle, fewer elbows. If you have one image to take home, it\'s this one. Stay until the wall goes from gold to pink to grey, and through twilight to first stars. Most visitors leave too early.',
    photos: [{ src: '/photos/half-dome.jpg', caption: 'Half Dome at last light.' }],
  },
  {
    id: 'curry-village',
    title: 'Curry Village, base camp',
    region: 'valley',
    order: 11,
    kind: 'lodging',
    coord: [-119.5688, 37.7395], // TODO: verify (Curry Village core)
    body:
      'Tent cabins or wood cabins, your call. The tent cabins have history (this is the original 1899 camp); the wood cabins have insulation. Either way, the location is what you\'re paying for: walking distance to the dining hall, the shuttle stop, and the trailhead for Mist Trail in the morning. For a multi-night trip, stay all your nights here — the time you save on packing each morning is worth more than the variety. Reservations open thirteen months out and the good months sell in minutes.',
    swap:
      'If Curry is full: Yosemite Valley Lodge or the Ahwahnee are the in-park alternates. Outside the park: El Portal (closest, 30 min), Mariposa (45 min, more options), or Groveland (north entrance side, 1 hr to valley).',
  },
  {
    id: 'curry-village-pizza',
    title: 'Lunch at Curry Village',
    region: 'valley',
    order: 12,
    kind: 'meal',
    coord: [-119.5688, 37.7395], // TODO: verify (Curry Village core)
    timeBudgetMin: 60,
    body:
      'You\'ll be hungry off the Mist Trail. The Curry Village pizza patio is right there, fast, and good after a hike. Loft has a slightly better menu if you have patience. The Ahwahnee dining room is available for lunch but you\'ll need a reservation and you\'ll want to clean up first.',
  },

  // ===========================================================================
  // GLACIER POINT & THE MARIPOSA GROVE
  // The southern rim and the giant sequoias. Higher elevation, more driving,
  // big payoff views. Glacier Point Road is closed in winter.
  // ===========================================================================
  {
    id: 'glacier-point-road-drive',
    title: 'Glacier Point Road, end to end',
    region: 'glacier-mariposa',
    order: 1,
    kind: 'drive',
    coord: [-119.6386, 37.6517], // TODO: verify (Chinquapin junction; was 37.6573, ~620 m off)
    timeBudgetMin: 120,
    body:
      'Sixteen miles from the Chinquapin junction to Glacier Point itself. Most people drive it straight through to the viewpoint and complain about the parking. Don\'t. The road is the experience. Pothole Meadows (mile 10) for wildflowers in early summer, Sentinel Dome / Taft Point trailhead (mile 13.6), Washburn Point (mile 15.5) for the Half Dome / Vernal-Nevada view that\'s arguably better than Glacier Point itself. Plan three to four hours for the round trip with stops, not one.\n\nThe road is closed November through May (sometimes longer). If you\'re here in winter, this whole region flips to a Hetch Hetchy day instead.',
    photos: [{ src: '/photos/wildflowers.jpg', caption: 'Pothole Meadows in early summer.' }],
  },
  {
    id: 'sentinel-dome',
    title: 'Sentinel Dome and Taft Point',
    region: 'glacier-mariposa',
    order: 2,
    kind: 'trailhead',
    coord: [-119.5841, 37.7236], // TODO: verify (Sentinel Dome summit; was 37.7155, ~900 m off)
    elevationFt: 8122,
    timeBudgetMin: 120,
    body:
      'The Sentinel-Dome-to-Taft-Point loop is the right move: 5 miles, ~700 ft of gain, both viewpoints in one walk. Sentinel is the 360-degree panorama — Half Dome, El Capitan, the Clark Range, the high country to the north. Taft is the cliff edge with the 3,000-foot drop. Do them in either order. Bring lunch and stay on top of Sentinel for thirty minutes — you won\'t see the high country laid out like this from many other places.',
    photos: [{ src: '/photos/milky-way-sentinel-dome.jpg', caption: 'Sentinel Dome at night, Milky Way over the panorama.' }],
    swap:
      'If you only have time for one, Sentinel Dome alone is 2.2 miles round trip with about 400 feet of gain, easier than it looks, and the better introduction. Taft Point alone is even shorter (2.2 mi RT, ~250 ft) but the cliff edge is the whole point — go if heights don\'t bother you.',
  },
  {
    id: 'glacier-point',
    title: 'Glacier Point, the right time of day',
    region: 'glacier-mariposa',
    order: 3,
    kind: 'viewpoint',
    coord: [-119.5731, 37.7283], // TODO: verify
    elevationFt: 7214,
    timeBudgetMin: 75,
    body:
      'Half Dome at eye level. The valley floor 3,200 feet below. The waterfalls visible end-to-end. Avoid noon to four — the parking is brutal and the light is flat. Late afternoon (4:30 p.m. onward) the lot empties, the light turns warm, and you can sit on the wall and watch the shadow climb Half Dome. Stay through sunset if you can; the drive back to the valley in the dark is fine, just slow. If a ranger is giving an evening talk (most weekends June through August), stay for it — they\'re short and they\'re good.',
    photos: [{ src: '/photos/half-dome.jpg', caption: 'Half Dome at eye level from the Glacier Point wall.' }],
    swap:
      'If parking is hopeless, the Four-Mile Trail goes from Glacier Point down to the valley floor (4.8 miles, 3,200 ft loss). Park one car at the bottom, drive the other up. Knees take the hit, not your patience.',
  },
  {
    id: 'mariposa-grove',
    title: 'Mariposa Grove of Giant Sequoias',
    region: 'glacier-mariposa',
    order: 4,
    kind: 'trailhead',
    coord: [-119.6083, 37.5108], // TODO: verify (Mariposa Grove Welcome Plaza; was off ~700 m)
    elevationFt: 5600,
    timeBudgetMin: 180,
    body:
      'You park at the Welcome Plaza and ride the free shuttle two miles up to the grove. Walk the Grizzly Giant Loop (2 miles, 300 ft of gain) — past the Fallen Monarch, the Bachelor and Three Graces, the Grizzly Giant itself (around 2,700 years old). Don\'t skip the California Tunnel Tree just past Grizzly Giant. The shuttle runs every 15 minutes from April through November; first run is 8 a.m., last around 6. Late afternoon turns the canopy gold and the grove empties out. These trees are not redwoods. They\'re the largest trees on earth by volume, and they only grow in this strip of the Sierra.',
    swap:
      'If you have stamina, the Guardians Loop (6.5 miles, 1,200 ft) takes you up to the upper grove. Most visitors don\'t make it that far, which is the point.',
  },

  // ===========================================================================
  // TUOLUMNE MEADOWS & THE HIGHWAY 120 CORRIDOR
  // The high country. Tioga Road is closed roughly November through May.
  // Granite domes, alpine lakes, the meadow that turns the trip into something
  // bigger than the valley.
  // ===========================================================================
  {
    id: 'tioga-road-drive',
    title: 'Tioga Road, the high-country drive',
    region: 'tuolumne',
    order: 1,
    kind: 'drive',
    coord: [-119.7973, 37.7551], // TODO: verify (Crane Flat junction)
    timeBudgetMin: 120,
    body:
      '47 miles from Crane Flat to Tioga Pass (9,945 ft). Gas up at Crane Flat — there is no gas on Tioga Road itself. The road climbs through fir forest, then lodgepole pine, then opens into granite domes and meadows. Tioga is closed November through May (sometimes longer). When it opens — late May or early June in 2026 — the first two weeks are extraordinary: snowmelt, no crowds, hardly anyone on the road yet.',
    photos: [{ src: '/photos/tuolumne-meadows.jpg', caption: 'Tuolumne Meadows, the high-country payoff.' }],
  },
  {
    id: 'olmsted-point',
    title: 'Olmsted Point',
    region: 'tuolumne',
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
    id: 'tenaya-lake',
    title: 'Tenaya Lake',
    region: 'tuolumne',
    order: 3,
    kind: 'viewpoint',
    coord: [-119.4548, 37.8330], // TODO: verify
    elevationFt: 8150,
    timeBudgetMin: 60,
    body:
      'The east beach is the spot. Granite cliffs on the south side, lodgepole forest on the north, Polly Dome rising at the west end. The water is 55–60°F even in August — short swims only. In late May the lake is often still partly iced over; by July it\'s sun-warmed at the edges. Stop here for lunch on the rocks.',
  },
  {
    id: 'cathedral-lakes',
    title: 'Cathedral Lakes',
    region: 'tuolumne',
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
    id: 'soda-springs-parsons-lodge',
    title: 'Soda Springs and Parsons Lodge',
    region: 'tuolumne',
    order: 5,
    kind: 'trailhead',
    coord: [-119.3589, 37.8772], // TODO: verify (Lembert Dome parking lot, start of Soda Springs walk; was off ~900 m)
    elevationFt: 8600,
    timeBudgetMin: 90,
    body:
      'A 1.5-mile round trip from the Lembert Dome parking lot. Soda Springs is a naturally carbonated spring bubbling up out of the meadow — taste it if you want, it\'s safe (a little metallic). Parsons Lodge is a 1915 stone Sierra Club building, sometimes staffed in summer. End the high-country day here. Drive back to the valley in twilight; the Tioga Road in low light is a memory you keep.',
    photos: [{ src: '/photos/tuolumne-meadows.jpg', caption: 'Tuolumne Meadows from the Soda Springs walk.' }],
  },
]

// Validate the entire collection at module-load. Any schema violation throws
// here and Vite surfaces it in the browser overlay or fails the build in CI.
export const stops: StopT[] = Stops.parse(seed)
