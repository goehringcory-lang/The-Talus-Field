// =============================================================================
// FIELD GUIDE STOPS — region-organized.
//
// Stops are grouped into four regions: the Valley, Glacier Point & Mariposa,
// Tuolumne / the Hwy 120 corridor, and Hetch Hetchy. Within each region,
// `order` defines a suggested reading sequence (roughly the order a
// thoughtful visitor would do them in), but the page presents them as a flat
// list — visitors pick by what fits the time they have.
//
// Collections: entries with `collection: 'hidden'` are the Hidden Areas set,
// surfaced on /hidden-areas and kept out of the default region lists and the
// itinerary presets. They number from `order: 101` within each region so the
// core reading sequence never reshuffles. Hidden entries are maintained,
// signed park trails only; closed or abandoned routes are named in prose as
// history, never with directions.
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
    photos: [{ src: '/photos/el-capitan-winter.jpg', caption: 'El Capitan from Northside Drive along the valley loop.' }],
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
    photos: [{ src: '/photos/cathedral-rocks.jpg', caption: 'Cathedral Rocks, visible across the valley from the old road.' }],
    body:
      'A small dirt pullout on Northside Drive, between the Pohono Bridge and El Capitan. Most people drive past it. From this turnout you can climb the original Big Oak Flat Road — the wagon grade completed in 1874, one of the three original roads built to reach the valley floor. It carried stagecoaches for seventy years. A massive rockslide in 1945 closed it permanently, and it\'s never reopened to vehicles. Most of the old roadbed is still there: hand-stacked retaining walls, cut blocks, switchbacks wide enough for a six-horse coach. Almost nobody walks it.\n\nThe climb is rock-hopping and a little scrambly in places — nothing technical, doable with kids. About a mile and 800 feet of gain gets you to the first big preserved section of road. Bring lunch. Sit in the shade of incense cedars and look across the valley at Cathedral Rocks. Half a day, easy. A full day if you keep going.\n\nIn early spring — March through early May, depending on snowmelt — extend west from the old road to the base of Ribbon Fall. The traverse is unmarked and rough; you\'re following the sound of water through talus. The payoff is standing under a 1,612-foot single drop — the tallest waterfall in North America, taller than the Empire State Building. It only flows for a few weeks a year, fed entirely by snowmelt off the rim above. By late May it\'s usually dry. Most visitors never see it run.\n\nSummer or not, the road itself is the year-round draw. You\'re walking the grade that carried the first generation of Yosemite tourists down into the valley, and you\'ll have it to yourself.',
    swap:
      'The dirt pullout holds maybe four or five cars. If it\'s full, park at the Bridalveil Fall lot a quarter mile east and walk back along Northside Drive. Adds fifteen minutes each way and a touch of road noise, but you don\'t lose the day.',
  },
  {
    id: 'old-road-trailhead-pullout',
    title: 'Old Big Oak Flat Road pullout, where to park',
    region: 'valley',
    order: 6,
    kind: 'parking',
    coord: [-119.6451, 37.7238], // TODO: verify (dirt pullout, Northside Drive between Pohono Bridge and El Capitan)
    elevationFt: 4000,
    timeBudgetMin: 10,
    body:
      'The dirt pullout on Northside Drive, between the Pohono Bridge and El Capitan, on the north side of the road. It holds four or five cars and has no sign worth the name; the tell is the old roadbed angling up into the trees behind it. This pin exists so you can navigate straight to it instead of hunting for it at 15 mph with traffic behind you.\n\nIf it\'s full, park at the Bridalveil Fall lot a quarter mile east and walk back along Northside Drive. Adds fifteen minutes each way. From the pullout, the climb starts immediately: see [Old Big Oak Flat Road and Ribbon Fall](/stop/old-big-oak-flat-road) for the day itself.',
  },
  {
    id: 'rainbow-view-old-road',
    title: 'Rainbow View, the old road\'s reward',
    region: 'valley',
    order: 7,
    kind: 'viewpoint',
    coord: [-119.6608, 37.7255], // TODO: verify (Rainbow View on the old Big Oak Flat Road grade)
    elevationFt: 4800,
    timeBudgetMin: 90,
    body:
      'The viewpoint the stagecoach drivers used to stop at. Partway up the old Big Oak Flat Road grade, the trees open and you\'re looking across the valley at Bridalveil Fall from above its rim: the whole ribbon of it, the Cathedral Rocks stacked behind, the Merced threading the valley floor below. In the 1870s this was the first full look at the valley most visitors ever got, and the road was aligned to deliver it. Now nobody\'s here.\n\nThe light is best in the morning, when the south wall is lit and the fall carries its spray rainbow (that\'s the name). Reached only on foot via the old road from [the Northside Drive pullout](/stop/old-road-trailhead-pullout); budget the climb as part of the [Old Big Oak Flat Road half day](/stop/old-big-oak-flat-road).',
  },
  {
    id: 'ribbon-fall-base',
    title: 'Ribbon Fall, the few weeks it runs',
    region: 'valley',
    order: 8,
    kind: 'viewpoint',
    coord: [-119.6503, 37.7300], // TODO: verify (base of Ribbon Fall amphitheater, west of El Capitan)
    elevationFt: 4400,
    timeBudgetMin: 120,
    body:
      'A 1,612-foot single drop, the tallest waterfall in North America, and it only exists for a few weeks a year. Ribbon Fall is fed entirely by snowmelt off the rim west of El Capitan: it wakes in March, peaks in April and early May, and is usually a stain on the wall by late May. There is no sign, no trail marker, and no crowd.\n\nThe approach leaves the [old Big Oak Flat Road](/stop/old-big-oak-flat-road) and traverses west through talus toward the sound of water. It\'s unmarked and rough, a route rather than a trail; wear real shoes and take your time on the blocks. The amphitheater at the base is loud, cold, and yours. Check the seasonal window before committing the day: in a dry year the show can be over by the first week of May.',
    swap:
      'If the traverse is more than the group wants, Bridalveil Fall runs year-round and its viewing platform is a five-minute paved walk. Same geology lesson, one tenth the effort.',
  },
  {
    id: 'foresta-cascades',
    title: 'Cascade Creek and the Foresta side',
    region: 'valley',
    order: 9,
    kind: 'viewpoint',
    coord: [-119.7134, 37.7228], // TODO: verify (Cascade picnic area, Hwy 140 just inside the Arch Rock entrance)
    elevationFt: 3800,
    timeBudgetMin: 60,
    body:
      'Where the old Big Oak Flat Road corridor meets the modern one. Cascade Creek comes off the north rim in a long stairstep of whitewater, best in April and May, and the picnic tables along the creek just inside the Arch Rock entrance are the quietest lunch stop on the west end of the valley. If you\'re entering on Highway 140, this is the first place worth stopping; if you\'ve spent the morning on the [old road](/stop/old-big-oak-flat-road), it\'s the closing move.\n\nAbove the rim sits Foresta, the small private inholding the 1990 A-Rock fire burned through; the meadow there is a wildflower show in June and one of the park\'s better deer and bear sightlines at dusk. The Foresta road leaves Big Oak Flat Road (the modern highway) near Crane Flat.',
  },
  {
    id: 'el-capitan-meadow',
    title: 'El Capitan Meadow, watching the wall',
    region: 'valley',
    order: 10,
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
    order: 11,
    kind: 'trailhead',
    coord: [-119.5570, 37.7464], // TODO: verify
    elevationFt: 4094,
    timeBudgetMin: 90,
    photos: [{ src: '/photos/half-dome.jpg', caption: 'Half Dome reflected in the still water of Mirror Lake.' }],
    body:
      'Two miles round trip from the shuttle stop, mostly flat. The "lake" is really a pool in the Tenaya Creek drainage; it\'s a real lake in spring, mostly meadow by August. Either way it\'s the closest spot in the valley to Half Dome, looking up the back side of it. Go early — the trail is in shade until 10 a.m. and the reflection is gone by mid-morning when the breeze picks up.\n\n' +
      'Watch Tenaya Creek where it feeds and drains the lake and you may spot a water ouzel, the American dipper: a dark, robin-sized bird that walks straight into fast current instead of avoiding it. It grips the streambed with oversized feet, dives in, and forages for insect larvae underwater, seeing well enough below the surface to hunt in the flow. Ouzels only work cold, fast, well-oxygenated water, so seeing one is a sign the creek is healthy. Come at the same quiet early hours you\'d come for the reflection, before the crowds and the wind. The guide\'s Secret Spots section has a dedicated ouzel-watching spot on the Merced at Happy Isles. And if the lake leaves you wanting more of Tenaya Creek, the canyon above holds a waterfall almost nobody visits: see [Three Chutes Falls](/stop/three-chutes-falls).',
  },
  {
    id: 'mist-trail',
    title: 'Mist Trail to Vernal Fall (and Nevada, if you have it)',
    region: 'valley',
    order: 12,
    kind: 'trailhead',
    coord: [-119.5594, 37.7338], // TODO: verify (Happy Isles)
    elevationFt: 4035,
    timeBudgetMin: 360,
    // Source: Yosemite Guide Vol 51 Issue 5 (June 10 - July 14, 2026).
    hazard:
      'Repair closures through 2026: the Mist Trail is closed Monday through Thursday, 7 a.m. to 3:30 p.m., June 30 through late October (open Fridays, weekends, and holidays, and outside those hours when conditions allow). The John Muir Trail between Clark Point and the Panorama Trail junction is closed until mid-July 2026, which blocks the usual descent. Check conditions at the Welcome Center before counting on the loop.',
    body:
      'The hike that earns the trip. Start at Happy Isles by 6:30 a.m. — earlier is better. The first 0.8 miles is paved and gets you to the Vernal Fall footbridge — most casual hikers turn around here. Past the bridge, the granite stairs start. You climb 600 stone steps in spray (May–June) or sun-baked rock (August). Vernal Fall is at the top of the stairs, 1.6 miles in. If you\'re still strong, push another 1.5 miles to Nevada Fall.\n\nDescend on the John Muir Trail — longer, gentler, easier on the knees, and you\'ll have it largely to yourself because most people return the way they came up. Loop total: about 7 miles, 2,000 ft of gain, 5–6 hours with breaks. The Mist Trail is wet and slippery; trekking poles help. Bring more water than you think.\n\n' +
      'About those 600 steps: the CCC carved and set them into the rock in the 1930s, and no two are alike. Some rise a foot, some closer to two, some tilt just enough to slide a wet boot. This staircase, not the exposure, is where most Mist Trail injuries happen, almost always someone in worn soles or sandals going down hard on soaked granite. Real tread is the difference between a great day and the clinic. The crowd stacks up here too: the footbridge is a parade and the staircase moves at a shuffle, but the trail thins fast above Vernal Fall, and the stretch on to Nevada can feel nearly empty on a weekday.\n\n' +
      'How wet you get depends entirely on the month. In May and June, at full snowmelt, the spray zone below Vernal Fall is like standing in a rainstorm for twenty minutes: clothes soaked through, phone and camera wet, no exceptions. Bag your phone, wear synthetic not cotton, and stash a dry shirt to change into up top. By August the falls drop and you get misted rather than drenched, more canyon hike than waterfall hike. If the soaked stairs feel like too much on a wet day, the John Muir Trail bypass between the two falls is the drier, gentler way around them.',
    photos: [{ src: '/photos/vernal-fall.jpg', caption: 'Vernal Fall at the top of the granite stairs.' }],
    swap:
      'If the legs say no, just do Vernal Fall and back via the same trail (3 miles RT, 1,000 ft). Still a real hike. The first lower mile is closed November–April when the stairs ice over. If you have the legs and the cables are open (mid-May to mid-October) and the lottery gods love you, this is the day for Half Dome — 14–16 miles, 4,800 ft, 10–12 hours, separate permit.',
  },
  {
    id: 'four-mile-trailhead',
    title: 'Four Mile Trail, earning Glacier Point',
    region: 'valley',
    order: 13,
    kind: 'trailhead',
    coord: [-119.6020, 37.7339], // TODO: verify (Four Mile Trailhead lot, Southside Drive near the Swinging Bridge)
    elevationFt: 4000,
    timeBudgetMin: 480,
    // Source: Yosemite Guide Vol 51 Issue 5 (June 10 - July 14, 2026).
    hazard:
      'Through mid-July 2026 the John Muir Trail is closed between Clark Point and the Panorama Trail junction, and short Panorama Trail closures are possible, which can break this route\'s Panorama descent to Happy Isles. Confirm trail status before committing to the loop.',
    photos: [{ src: '/photos/vernal-fall.jpg', caption: 'Vernal Fall, one of the two falls the Panorama descent passes.' }],
    body:
      'The trailhead is a small lot on Southside Drive, about a mile west of Sentinel Beach near the Swinging Bridge, and it fills by 7 a.m. on busy days. If it\'s full, park at the day-use lot and ride the shuttle to the El Capitan stop (E6). Start at 5:30 or 6 in the morning, not because it\'s virtuous but because the first mile is the steepest and most exposed on the route and it bakes once the sun clears the rim. There is no water anywhere on this trail. Carry three liters minimum.\n\n' +
      'The trail was built in 1872 as a toll route and was exactly four miles then; the Park Service rebuilt it in the late 1920s with gentler switchbacks, the mileage grew to about 4.8, and the name stuck. You climb roughly 3,200 feet across something like 58 switchbacks. Union Point, near mile three, is the rest stop with the view that makes people quit early: Yosemite Falls straight across, El Capitan west, Half Dome appearing east. Keep going. Popping out at the Glacier Point railing after three hours on the wall beats driving there by more than the effort costs.\n\n' +
      'The strong move is the loop: up the Four Mile, then down the Panorama Trail past Illilouette Fall and Nevada Fall to Happy Isles. 13 to 14 miles, around 4,000 feet of total climbing (there\'s an 800-foot surprise back out of the Illilouette drainage), 8 to 10 hours. The one-way logistics are workable rather than elegant: finish at Happy Isles (shuttle stop 16) and ride the Valley shuttle back toward E6, the closest stop to your car. Two cars simplifies everything. Hitching a ride down from Glacier Point happens, but don\'t build a day around a stranger\'s empty seat.\n\n' +
      'Season matters twice. Glacier Point Road has to be open for the loop to work (it typically opens in May), and the upper Four Mile Trail itself closes in winter when ice makes the ledges unsafe, typically until well into spring. In summer the climb is very exposed in heat: morning start, hat, sunscreen, and the three liters. Check the NPS conditions page the night before.',
  },
  {
    id: 'ahwahnee-hotel',
    title: 'The Ahwahnee Hotel, lobby visit',
    region: 'valley',
    order: 14,
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
    order: 15,
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
    order: 16,
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
    order: 17,
    kind: 'meal',
    coord: [-119.5688, 37.7395], // TODO: verify (Curry Village core)
    timeBudgetMin: 60,
    body:
      'You\'ll be hungry off the Mist Trail. The Curry Village pizza patio is right there, fast, and good after a hike. Loft has a slightly better menu if you have patience. The Ahwahnee dining room is available for lunch but you\'ll need a reservation and you\'ll want to clean up first.',
  },

  // ---------------------------------------------------------------------------
  // HIDDEN AREAS — Yosemite Valley
  // ---------------------------------------------------------------------------
  {
    id: 'artist-point',
    title: 'Artist Point, the view the stagecoaches stopped for',
    region: 'valley',
    order: 101,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'easy',
    coord: [-119.6697, 37.7135], // TODO: verify (Artist Point, old stagecoach road grade above Tunnel View)
    elevationFt: 4700,
    timeBudgetMin: 120,
    photos: [],
    body:
      'In 1855 an artist named Thomas Ayres stood here and drew the first picture of Yosemite Valley ever published. For the next eight decades the stagecoach road into the valley ran right past the spot; when the Wawona Tunnel opened in 1933, the old grade was abandoned and the viewpoint went quiet. It has stayed quiet ever since, a few hundred yards of walking from one of the most crowded overlooks in America.\n\nStart on the Pohono Trail from the east end of the Tunnel View parking lot. At half a mile, where the trail crosses the old stagecoach road, turn left onto the abandoned grade; Artist Point is about a mile from the car, two miles round trip with a modest climb. The view is Tunnel View from higher and further east: same El Capitan, same Bridalveil, no idling buses, usually nobody at all. If you stay on the Pohono Trail another half mile before the turnoff, a stone marker notes the original Inspiration Point, though trees have mostly closed over that view.\n\nDo it as the first or last hour of a valley day. The parking is the [Tunnel View](/stop/tunnel-view) lot, so that pin is this pin too.',
  },
  {
    id: 'yosemite-point',
    title: 'Yosemite Point, looking straight down the fall',
    region: 'valley',
    order: 102,
    kind: 'viewpoint',
    collection: 'hidden',
    difficulty: 'strenuous',
    coord: [-119.5904, 37.7565], // TODO: verify (Yosemite Point, north rim east of Upper Yosemite Fall)
    elevationFt: 6936,
    timeBudgetMin: 480,
    photos: [],
    hazard:
      'Past the railed overlook the rim is bare, unrailed granite over a vertical drop. Keep a body length back from the edge; the view does not improve past that line.',
    body:
      'Most people who climb the Yosemite Falls Trail stop at the overlook above the upper fall and call it a summit. Yosemite Point is the better ending: cross the bridge over Yosemite Creek and continue east another three quarters of a mile to the rim point at 6,936 feet. The Lost Arrow spire stands off the cliff below you, Half Dome fills the middle distance, the valley floor is a vertical mile down, and back west you can watch the top of the upper fall throw itself over the lip you just walked around.\n\nThe numbers are honest: about 9.6 miles round trip from the trailhead behind Camp 4, with 3,200 feet of gain. Start at first light. The falls trail is busy to the top of the fall and nearly empty past it; the spur to the point costs less than an hour more and subtracts almost all of the remaining company.\n\nOne piece of history to know and leave alone. In the spring of 1871 John Muir worked his way onto Fern Ledge, a natural shelf partway up this wall that passes behind the upper fall, and stood in the moonlit spray while the water arced over his head. The ledge is still there. The way to it was never a trail, crosses steep dirt above open cliff, and has hurt people badly in the years since. Read Muir\'s account instead. He went so you don\'t have to.',
  },
  {
    id: 'eagle-peak',
    title: 'Eagle Peak, the top of the Three Brothers',
    region: 'valley',
    order: 103,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'strenuous',
    coord: [-119.6109, 37.7532], // TODO: verify (Eagle Peak summit; route via Yosemite Falls Trail)
    elevationFt: 7779,
    timeBudgetMin: 510,
    photos: [],
    hazard:
      'The summit blocks end in open air with no railings anywhere past the falls overlook. No water on the upper mountain in summer; carry three liters.',
    body:
      'Eagle Peak is the highest of the Three Brothers, the stacked formation west of Yosemite Falls, and a maintained trail runs all the way to the top. From the Yosemite Falls Trailhead behind Camp 4 it is six miles one way with about 3,500 feet of gain: up the falls trail, past the top of the upper fall where the crowd evaporates, then through Eagle Peak Meadows to the summit spur. Budget eight to nine hours round trip and start early.\n\nThe view is the reason to do it. You look down the full length of the valley with the Merced threading the floor, Half Dome and Clouds Rest stacked at the far end, and El Capitan directly across, level with you for once. From here you watch the Captain\'s summit slabs roll over into the 3,000-foot face, a perspective the valley floor cannot supply and very few visitors ever collect.\n\nThere is no reliable water past Yosemite Creek and the upper switchbacks bake in the afternoon. Hat, three liters, and the discipline to turn around if the day gets away from you.',
  },
  {
    id: 'snow-creek-trail',
    title: 'Snow Creek Trail, the hard way to the quiet rim',
    region: 'valley',
    order: 104,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'strenuous',
    coord: [-119.5511, 37.7503], // TODO: verify (Snow Creek Trail junction, Tenaya Canyon beyond Mirror Lake)
    elevationFt: 4100,
    timeBudgetMin: 360,
    photos: [],
    hazard:
      'The switchbacks are shadeless by mid-morning and there is no water between Tenaya Creek and Snow Creek. Do not leave the trail toward Tenaya Canyon; the gorge below is technical terrain where hikers have died.',
    body:
      'The Snow Creek Trail leaves the valley at its quietest corner, past Mirror Lake, and solves the north rim with brutal directness: 2,600 feet of gain in 1.7 miles, more than a hundred switchbacks stacked up the wall of Tenaya Canyon. It is the steepest maintained way out of the valley and the emptiest, because everyone who reads that sentence picks a different trail. The ones who go get the finest sustained view in the valley. Every switchback reframes Half Dome, Clouds Rest, and the polished trench of the canyon, and by the top you have the geography memorized.\n\nThe usual day is an out-and-back to the rim from the Mirror Lake shuttle stop, about nine miles round trip, five to six hours. With two cars, strong parties run it one way: up Snow Creek, across the rim past North Dome, out at the Porcupine Creek trailhead on Tioga Road. Either way, April through October is the season; carry more water than the mileage suggests.\n\nYou will spend the climb looking into Tenaya Canyon, and by the second hour the obvious question forms: can you go up the canyon itself? The answer is no. The gorge between Mirror Lake and Tenaya Lake is a technical canyoneering route with mandatory swims and rappels, the park map warns against it in plain language, and it has killed experienced people. It is magnificent from the switchbacks. That is the seat.',
  },
  {
    id: 'three-chutes-falls',
    title: 'Three Chutes Falls, the waterfall past Mirror Lake',
    region: 'valley',
    order: 105,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'moderate',
    season: 'April to June',
    coord: [-119.5480, 37.7519], // TODO: verify (Tenaya Creek, ~0.5 mi upstream of Mirror Lake)
    elevationFt: 4300,
    timeBudgetMin: 180,
    photos: [],
    hazard:
      'The crossings above Mirror Lake are fords, not bridges. In May and June the current is fast and cold enough to knock an adult down; if the water is over your knees, this is a viewpoint, not a swim. Do not continue past the falls into upper Tenaya Canyon.',
    body:
      'Mirror Lake is where the valley crowd turns around. Stay with the creek instead. From the upstream end of the Mirror Lake loop, work up Tenaya Creek about half a mile into the lower canyon, and the creek drops eighty feet through three clean granite chutes into a string of pools. In spring the whole show thunders. By midsummer it gentles into the best quiet water on the east end of the valley, with boulders to eat lunch on and no audience.\n\nThe going is rougher than a maintained path, boulders and braided use trails along the creek, but it is walking, not scrambling. Add it to a [Mirror Lake](/stop/mirror-lake) morning and the whole outing is about three miles round trip from the shuttle stop.\n\nSpring is the season and also the caution. The show and the danger are the same water; read the hazard note before you commit to a crossing, and in high snowmelt be content with the near bank. It is the better photograph anyway.',
  },
  {
    id: 'valley-ephemeral-falls',
    title: 'The waterfalls nobody sees',
    region: 'valley',
    order: 106,
    kind: 'viewpoint',
    collection: 'hidden',
    difficulty: 'easy',
    season: 'March to May',
    coord: [-119.5915, 37.7452], // TODO: verify (Cook's Meadow, central viewing ground for the ephemeral falls)
    elevationFt: 4000,
    timeBudgetMin: 90,
    photos: [],
    body:
      'The valley runs a second set of waterfalls that most visitors never notice, because they exist for only a few weeks and because they fall beside famous neighbors. Sentinel Fall drops roughly 2,000 feet in stages from the wall west of Sentinel Rock, a long silver flume best seen from Southside Drive near Sentinel Beach. Staircase Falls comes down the wall behind Curry Village in 1,300 feet of granite steps while the dinner line forms below it, unwatched. Royal Arch Cascade streams down the polished wall near the Ahwahnee after rain. And Lehamite Falls drops 1,180 feet out of Indian Canyon a few hundred yards east of Yosemite Falls, which is exactly why nobody sees it: every eye goes to the famous fall and never comes back.\n\nMarch through May, and the days after any hard rain, are the window. The walk is whatever valley-floor stroll you were taking anyway; the skill is looking up at the walls between the landmarks. By June most of these are stains on the granite, and by August you can stand under them and never know they exist.\n\nA closing note on the routes that once climbed toward these walls. The Ledge Trail to Glacier Point and the Sierra Point overlook above Happy Isles both appear on old postcards; the park closed the first in the 1920s and let the second go after rockfall in the 1970s, and both are closed for cause, with a list of fatalities behind the decision. The scramble to the summit of Sentinel Rock belongs to climbers. This guide names them because the history is worth knowing, and gives directions to none of them.',
  },
  {
    id: 'widows-tears-silver-strand',
    title: 'Widow\'s Tears and Silver Strand, the west-end ephemerals',
    region: 'valley',
    order: 107,
    kind: 'viewpoint',
    collection: 'hidden',
    difficulty: 'easy',
    season: 'March to May',
    coord: [-119.6776, 37.7158], // TODO: verify (viewed from the Tunnel View overlook)
    elevationFt: 4400,
    timeBudgetMin: 45,
    photos: [],
    body:
      'Stand at Tunnel View in April and every eye goes to Bridalveil. Look right instead, at the south wall west of the fall. Silver Strand Falls drops 560 feet where Meadow Brook goes over the rim, the westernmost waterfall in the valley, plainly visible from the overlook whenever it runs. One drainage over hangs Widow\'s Tears, a slender plunge of nearly 1,200 feet and possibly the shortest-lived waterfall in the park: a few weeks of hard snowmelt and it is gone. The name is old Victorian humor, and dry: a widow\'s tears, the saying went, are the first to stop.\n\nThis is a two-for-one with [Tunnel View](/stop/tunnel-view) or [Artist Point](/stop/artist-point). No extra miles, just the knowledge of where to look. Binoculars help. Catch both running at once after a storm and you will be the only person at the rail who knows their names.',
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
      'The Sentinel-Dome-to-Taft-Point loop is the right move: 5 miles, ~700 ft of gain, both viewpoints in one walk. Sentinel is the 360-degree panorama — Half Dome, El Capitan, the Clark Range, the high country to the north. Taft is the cliff edge with the 3,000-foot drop. Do them in either order. Bring lunch and stay on top of Sentinel for thirty minutes — you won\'t see the high country laid out like this from many other places.\n\nThe quiet part of the loop is the connector itself. The stretch of the Pohono Trail linking the two points sees a fraction of the foot traffic of either endpoint: rolling rim forest with Yosemite Falls appearing and reappearing across the valley. Most visitors do the two points as separate out-and-backs from the shared lot and never walk it, which is exactly why you should.',
    photos: [{ src: '/photos/milky-way-sentinel-dome.jpg', caption: 'Sentinel Dome at night, Milky Way over the panorama.' }],
    swap:
      'If you only have time for one, Sentinel Dome alone is 2.2 miles round trip with about 400 feet of gain, easier than it looks, and the better introduction. Taft Point alone is even shorter (2.2 mi RT, ~250 ft) but the cliff edge is the whole point — go if heights don\'t bother you.',
  },
  {
    id: 'taft-point',
    title: 'Taft Point, the unrailed edge',
    region: 'glacier-mariposa',
    order: 3,
    kind: 'trailhead',
    coord: [-119.5861, 37.7124], // TODO: verify (Sentinel Dome / Taft Point shared lot, Glacier Point Road mile 13.6)
    elevationFt: 7500,
    timeBudgetMin: 90,
    photos: [],
    body:
      'From the shared Sentinel Dome / Taft Point lot at mile 13.6 on Glacier Point Road, the Taft Point trail runs 2.2 miles round trip, mostly gentle, dropping slightly through forest onto open granite. Just before the point you pass the Fissures: deep cracks in the rock where you can look straight down through the cliff to the trees far below. Then the point itself, and this needs saying plainly: it is a sheer 3,000-foot drop to the Valley floor, and except for one small section of railing at the tip, there is nothing between you and the air. Across the void, El Capitan in profile, an angle the Valley floor never gives you.\n\n' +
      'People have died here taking photographs. The view from twenty feet back is not meaningfully worse than the view from the edge, and it is enormously safer. Keep children in hand, keep the group honest, and treat the whole rim as the edge, because in places the fissures mean it is.\n\n' +
      'Sunset is the famous hour, when the light comes up the valley and El Capitan goes gold. If you go for it, bring a headlamp per person, not per group: the walk back is in the dark, and a late-afternoon breeze up here turns cold fast, so carry a layer.',
    swap:
      'If a sheer edge at dusk is not your group\'s idea of a good time, Sentinel Dome leaves from the same lot: 2.2 miles round trip to a bare granite summit at 8,122 feet with a 360-degree panorama and no exposure. Same sunset, safer seat.',
  },
  {
    id: 'washburn-point',
    title: 'Washburn Point, the better Half Dome',
    region: 'glacier-mariposa',
    order: 4,
    kind: 'viewpoint',
    coord: [-119.5722, 37.7203], // TODO: verify (Washburn Point pullout, Glacier Point Road mile 15.5)
    elevationFt: 7850,
    timeBudgetMin: 30,
    photos: [{ src: '/photos/half-dome.jpg', caption: 'Half Dome. Washburn Point shows it in full profile, falls stacked below.' }],
    body:
      'A mile before Glacier Point, the road swings through a big paved pullout. Most drivers blow past it with the destination in mind, which is exactly backwards. Washburn Point has the better Half Dome: the full profile, sheer face and domed back in one silhouette, with Vernal and Nevada Falls stacked one above the other in the Merced canyon directly below. Glacier Point hides that staircase of water behind its own rim. Washburn hands it to you.\n\n' +
      'It is two minutes from the car, with a fraction of the Glacier Point crowd and none of the services: no snack bar, no gift shop, no water. Stop here first on the way in, because the view sets up everything Glacier Point adds. And on the July afternoons when the Glacier Point lot is hopeless, this pullout quietly is the stop. You lose the eye-level Half Dome and the valley-floor vertigo; you keep the falls, the Clark Range, and your patience.',
  },
  {
    id: 'glacier-point',
    title: 'Glacier Point, the right time of day',
    region: 'glacier-mariposa',
    order: 5,
    kind: 'viewpoint',
    coord: [-119.5731, 37.7283], // TODO: verify
    elevationFt: 7214,
    timeBudgetMin: 75,
    body:
      'Half Dome at eye level. The valley floor 3,200 feet below. The waterfalls visible end-to-end. Avoid noon to four — the parking is brutal and the light is flat. Late afternoon (4:30 p.m. onward) the lot empties, the light turns warm, and you can sit on the wall and watch the shadow climb Half Dome. Stay through sunset if you can; the drive back to the valley in the dark is fine, just slow. If a ranger is giving an evening talk (most weekends June through August), stay for it — they\'re short and they\'re good.\n\n' +
      'One more note on timing across the calendar: Glacier Point Road is plowed open only after winter, typically sometime in May, and the first weeks of the season are the quiet ones. The lot is easy, the amenities are skeletal, water may not be running yet, and the high country you\'re looking at east of here still reads as full winter while the Valley below has gone green. Snow lines the trailheads and the shaded meadows into late spring. It\'s the rare stretch when this overlook feels like a place you found rather than a place everyone\'s been. Check the Park Service road-status page the night before, bring your own water, and go early.',
    photos: [{ src: '/photos/half-dome.jpg', caption: 'Half Dome at eye level from the Glacier Point wall.' }],
    swap:
      'If parking is hopeless, the Four-Mile Trail goes from Glacier Point down to the valley floor (4.8 miles, 3,200 ft loss). Park one car at the bottom, drive the other up. Knees take the hit, not your patience.',
  },
  {
    id: 'mariposa-grove',
    title: 'Mariposa Grove of Giant Sequoias',
    region: 'glacier-mariposa',
    order: 6,
    kind: 'trailhead',
    coord: [-119.6083, 37.5108], // TODO: verify (Mariposa Grove Welcome Plaza; was off ~700 m)
    elevationFt: 5600,
    timeBudgetMin: 180,
    body:
      'You park at the Welcome Plaza and ride the free shuttle two miles up to the grove. Walk the Grizzly Giant Loop (2 miles, 300 ft of gain) — past the Fallen Monarch, the Bachelor and Three Graces, the Grizzly Giant itself (around 2,700 years old). Don\'t skip the California Tunnel Tree just past Grizzly Giant. The shuttle runs every 15 minutes from April through November; first run at 8 a.m., and in summer the last ride up is around 7 p.m., with a final bus down at 8. Late afternoon turns the canopy gold and the grove empties out. These trees are not redwoods. They\'re the largest trees on earth by volume, and they only grow in this strip of the Sierra.\n\n' +
      'Those black fire scars on the big trunks aren\'t damage, they\'re a health record. A mature sequoia\'s bark runs up to two feet thick, fibrous and rich in tannin, so it barely conducts heat: a ground fire chars the surface, and the char itself insulates the living wood while the thinner-barked white fir and incense cedar nearby die. The tree needs those fires. Its seeds are no bigger than an oat seed and require the bare, ash-enriched mineral soil and sunlight a burn opens up. After a century and a half of suppression left the groves crowded and declining, the park now sets careful low-intensity burns in Mariposa to do what fire always did here.',
    swap:
      'If you have stamina, the Guardians Loop (6.5 miles, 1,200 ft) takes you up to the upper grove. Most visitors don\'t make it that far, which is the point.',
  },

  // ---------------------------------------------------------------------------
  // HIDDEN AREAS — Glacier Point & the Mariposa Grove
  // ---------------------------------------------------------------------------
  {
    id: 'crocker-stanford-points',
    title: 'Crocker and Stanford Points, past where Dewey turns around',
    region: 'glacier-mariposa',
    order: 101,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'moderate',
    coord: [-119.6367, 37.6640], // TODO: verify (Dewey Point trailhead pullout, Glacier Point Road)
    elevationFt: 7300,
    timeBudgetMin: 420,
    photos: [],
    hazard:
      'The rim at all three points is bare, unrailed granite over a vertical drop. The safe seat is a body length back from the edge; the view is the same.',
    body:
      'Dewey Point gets the traffic, a relative term out here meaning a handful of hikers a day. Crocker and Stanford Points, the next two stations west along the Pohono Trail, get nobody. From the Dewey Point trailhead on Glacier Point Road it is 9.2 miles round trip to take in Dewey and Crocker, about 10.5 for all three; the trail rolls through rim forest and steps out onto open granite at each named point. Crocker is half a mile past Dewey, Stanford another six tenths past that.\n\nWhat the extra miles buy is the west valley from above. Bridalveil Fall from directly over its rim, Ribbon Fall running its full 1,612 feet across the void in spring, El Capitan in profile, and odds near zero of sharing any of it. Turn around at whichever point matches the group\'s legs; every one of them is a complete day.\n\nJune through October, whenever Glacier Point Road is open. Carry water for the full distance; there is none on the rim.',
  },
  {
    id: 'mcgurk-meadow',
    title: 'McGurk Meadow and the sheepherder\'s cabin',
    region: 'glacier-mariposa',
    order: 102,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'easy',
    season: 'June to August',
    coord: [-119.6403, 37.6686], // TODO: verify (McGurk Meadow trailhead pullout, Glacier Point Road)
    elevationFt: 7000,
    timeBudgetMin: 100,
    photos: [],
    body:
      'A pocket meadow a mile off Glacier Point Road that runs one of the best wildflower shows in the park: shooting star and camas early, then paintbrush, corn lily, and lupine in waves as the season moves through July. The walk is about 3.7 miles round trip at an easy grade, ninety minutes of walking plus however long the flowers hold you.\n\nJust before the meadow the trail passes a one-room log cabin, low enough that you duck through the door. It belonged to John McGurk, who summered sheep here in the 1890s until the new park pushed the flocks out. The cabin is the right place to say the quiet part: this meadow looks wild, and it is also a place people worked.\n\nThe trailhead is a signed pullout on Glacier Point Road. Go early or late in the day; the light is better and the deer come out to the meadow edges. The same trail continues past the meadow to join the Pohono Trail toward [Dewey, Crocker, and Stanford Points](/stop/crocker-stanford-points) for anyone assembling a bigger day.',
  },
  {
    id: 'bridalveil-creek-trail',
    title: 'Bridalveil Creek, the trail nobody goes to',
    region: 'glacier-mariposa',
    order: 103,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'easy',
    coord: [-119.6202, 37.6600], // TODO: verify (Bridalveil Creek campground area, Glacier Point Road)
    elevationFt: 7000,
    timeBudgetMin: 150,
    photos: [],
    body:
      'A flat walk in lodgepole woods along Bridalveil Creek, meadows on the first half, creek on the second, and statistically nobody on any of it. This is the trail for the day the group is tired of destinations. No climb, no rim, no crowd, just a Sierra creek doing creek things, dippers working the riffles, and the kind of quiet the famous trails cannot offer at noon in July.\n\nStart near the Bridalveil Creek campground turnoff on Glacier Point Road and walk as far as the afternoon deserves; two to four miles out and back is the usual shape. This is the same creek that goes over the rim as Bridalveil Fall a few miles north, which is a good thing to know while you eat lunch beside it.\n\nJune through October, with early summer for the meadow bloom. Mosquitoes are honest here in June; bring repellent or come back in August.',
  },
  {
    id: 'ostrander-lake',
    title: 'Ostrander Lake, the long quiet walk to granite water',
    region: 'glacier-mariposa',
    order: 104,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'strenuous',
    season: 'July to September',
    coord: [-119.6153, 37.6547], // TODO: verify (Ostrander Lake trailhead, Glacier Point Road)
    elevationFt: 7000,
    timeBudgetMin: 420,
    photos: [],
    body:
      'Twelve miles round trip off Glacier Point Road to an alpine lake under Horse Ridge, and generally quiet even in the middle of summer. The first half is gentle, old roadbed through meadows and recovering burn that runs thick with wildflowers in July; the back half climbs in earnest, about 1,600 feet all told, with the views opening across the Illilouette drainage to the Clark Range as you gain the ridge.\n\nThe stone building above the shore is the Ostrander Ski Hut, built in 1941 and still run for winter reservations, when this whole basin turns into backcountry ski terrain. In summer it is closed and the lake is the destination: granite shores, cold swimmable water by August, and lunch rocks with a view back over everything you climbed.\n\nStart early, carry real water, and treat it as a full day. July through September; earlier and you will find snow on the ridge, later and the light goes long and cold.',
  },
  {
    id: 'wawona-meadow-loop',
    title: 'Wawona Meadow Loop, the walk everyone skips',
    region: 'glacier-mariposa',
    order: 105,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'easy',
    coord: [-119.6580, 37.5370], // TODO: verify (Wawona Meadow Loop trailhead, across from the Wawona Hotel)
    elevationFt: 4000,
    timeBudgetMin: 120,
    photos: [],
    body:
      'A flat 3.5-mile loop around the meadow across from the Wawona Hotel, on an old road under ponderosa and incense cedar, and by the numbers one of the least-visited maintained trails in the park. Spring runs wildflowers along the fence lines. Summer evenings run soft light and deer. It is not dramatic. That is the point.\n\nThis is the walk for the Wawona morning before the Mariposa Grove shuttle, the recovery day after a big rim hike, or the last hour of light when the drive out is tomorrow. Because Wawona sits low, the loop works year-round, including the winter months when the high country is shut.\n\nStart across the road from the hotel, near the golf course, and walk the loop in either direction. Pair it with [Chilnualna Falls](/stop/chilnualna-falls) for a full Wawona day that never touches the valley.',
  },
  {
    id: 'chilnualna-falls',
    title: 'Chilnualna Falls, the big water Wawona keeps to itself',
    region: 'glacier-mariposa',
    order: 106,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'strenuous',
    coord: [-119.6323, 37.5481], // TODO: verify (Chilnualna Falls trailhead, end of Chilnualna Falls Road, Wawona)
    elevationFt: 4200,
    timeBudgetMin: 360,
    photos: [],
    hazard:
      'The granite beside the cascades is water-polished and slick, and the current above the drops is faster than it looks. People have died sliding here. Watch the falls from the trail, not from the rocks beside the water.',
    body:
      'The valley has no monopoly on big water. Chilnualna Creek comes down out of the Wawona high country in a chain of five major cascades, and the trail that climbs beside them, 8.4 miles round trip with over 2,000 feet of gain, runs practically deserted while the Mist Trail moves at a shuffle. The reason is pure geography: it starts in Wawona, at the end of Chilnualna Falls Road, and the valley crowd never finds it.\n\nThere is a version for everyone. The lower cascades tumble through a rocky gorge within half an hour of the trailhead, a genuine payoff for a family that goes no further. The full climb is a real day: switchbacks through oak and manzanita, then pine, the creek appearing and disappearing beside you, each cascade bigger than the last until the top falls pour through bare granite with the Wawona basin spread below.\n\nPeak flow is late spring into early summer, and the trail is open year-round; autumn is quiet and gold here. Carry water for the full climb. The lower gorge is loud, cold, and closer than you think; read the caution before anyone leaves the trail.',
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
    id: 'may-lake',
    title: 'May Lake, the moderate hike that earns the high country',
    region: 'tuolumne',
    order: 3,
    kind: 'trailhead',
    coord: [-119.4912341, 37.8324607],
    elevationFt: 9329,
    timeBudgetMin: 180,
    photos: [{ src: '/photos/tuolumne-meadows.jpg', caption: 'The high-country granite and meadow landscape around May Lake.' }],
    body:
      'The best moderate hike in the high country. Turn north off Tioga Road onto the Old Tioga Road spur (between Olmsted Point and Tenaya Lake) and follow it 1.7 miles to the trailhead parking. The hike itself is 1.2 miles each way with about 500 feet of gain on a well-graded trail through lodgepole pine and over open granite. The grade is steady but not steep, which makes it the right pick for pushing kids past the point where a flat walk would have ended. Most families do it.\n\nMay Lake sits at 9,329 ft with Mount Hoffmann (the geographic center of the park) rising directly above the north shore. The water is cold but swimmable on a warm afternoon, and the granite slabs on the east side are the place to do it. Bring a towel and lunch. Stronger hikers can push another 2 miles and 1,500 ft to the summit of Hoffmann (10,850 ft) for a 360-degree view of the park.',
    swap:
      'The trailhead spur road is rough dirt, passable in any car taken slowly, but it rattles. If the parking lot is full (it holds maybe twenty cars), there is no overflow; come back early next morning or skip to Tenaya Lake. The lake holds snow into late June some years; check conditions before late-spring trips.',
  },
  {
    id: 'tenaya-lake',
    title: 'Tenaya Lake',
    region: 'tuolumne',
    order: 4,
    kind: 'viewpoint',
    coord: [-119.4548, 37.8330], // TODO: verify
    elevationFt: 8150,
    timeBudgetMin: 60,
    photos: [{ src: '/photos/tuolumne-meadows.jpg', caption: 'Open granite and clear high-country water at Tenaya Lake.' }],
    body:
      'The east beach is the spot. Granite cliffs on the south side, lodgepole forest on the north, Polly Dome rising at the west end. The water is 55–60°F even in August — short swims only. In late May the lake is often still partly iced over; by July it\'s sun-warmed at the edges. Stop here for lunch on the rocks.',
  },
  {
    id: 'cathedral-lakes',
    title: 'Cathedral Lakes',
    region: 'tuolumne',
    order: 5,
    kind: 'trailhead',
    photos: [{ src: '/photos/tuolumne-meadows.jpg', caption: 'Tuolumne high country — the landscape Cathedral Lakes sits in.' }],
    coord: [-119.3592, 37.8735], // TODO: verify — NPS relocated this trailhead to the Tuolumne Meadows Visitor Center parking in 2022 (Tioga Road Rehabilitation Project; roadside parking at the old TH was removed). Coord targets the visitor center lot; ground-truth before launch.
    elevationFt: 8560,
    timeBudgetMin: 360,
    body:
      'The high-country day hike. The new trailhead is at the Tuolumne Meadows Visitor Center. 9 miles round trip to Lower Cathedral Lake (1,000 ft of gain), or 10.5 miles for both lakes. Lower Cathedral sits at 9,288 ft with Cathedral Peak rising directly behind it — the granodiorite peak John Muir camped on in 1869. Best mid-July through mid-September; trail can hold snow into late June. Plan 5–7 hours with lake time. Bring layers.\n\n' +
      'Respect the altitude. You start around 8,500 feet and climb from there, so the first forested miles feel harder than the modest gain suggests. Give yourself the full five to seven hours and don\'t rush the ascent. At the junction, decide between the lakes. Lower Cathedral is the one from the photographs: a granite ramp to the south shore with Cathedral Peak rising straight out of the water. Upper Cathedral sits a few hundred yards past the junction in a tighter granite bowl, smaller, colder, and quieter. Most hikers see only the Lower. Doing both adds distance and a real descent and re-ascent, so take the Lower first while your legs are fresh.\n\n' +
      'Watch the sky. At 9,500 feet the basin is fully exposed, and afternoon thunderstorms build fast in July and August. A rain shell is not optional in those months, and the discipline that keeps you safe is simple: plan to be off the open granite and heading down by early afternoon if storms are in the forecast, no matter how good the lake looks. UV is intense at this altitude even when the weather holds, so cover up. Carry three liters; there\'s no reliable water between the trailhead and the basin.',
    swap:
      'If a 9-mile hike is too much, do the Pothole Dome short scramble at the west end of Tuolumne Meadows instead (0.5 mi, ~200 ft, 360-degree view). Soda Springs / Parsons Lodge from there is another easy 1.5 miles round trip.',
  },
  {
    id: 'soda-springs-parsons-lodge',
    title: 'Soda Springs and Parsons Lodge',
    region: 'tuolumne',
    order: 6,
    kind: 'trailhead',
    coord: [-119.3589, 37.8772], // TODO: verify (Lembert Dome parking lot, start of Soda Springs walk; was off ~900 m)
    elevationFt: 8600,
    timeBudgetMin: 90,
    body:
      'A 1.5-mile round trip from the Lembert Dome parking lot. Soda Springs is a naturally carbonated spring bubbling up out of the meadow — taste it if you want, it\'s safe (a little metallic). Parsons Lodge is a 1915 stone Sierra Club building, staffed daily in high summer with an open reading room, typically 10 to 4 once Tioga Road opens; the current Yosemite Guide has the season dates. End the high-country day here. Drive back to the valley in twilight; the Tioga Road in low light is a memory you keep.',
    photos: [{ src: '/photos/tuolumne-meadows.jpg', caption: 'Tuolumne Meadows from the Soda Springs walk.' }],
  },
  {
    id: 'gaylor-lake',
    title: 'Gaylor Lake, the short, steep payoff at Tioga Pass',
    region: 'tuolumne',
    order: 7,
    kind: 'trailhead',
    coord: [-119.258173, 37.9101685],
    elevationFt: 9945,
    timeBudgetMin: 150,
    photos: [{ src: '/photos/tuolumne-meadows.jpg', caption: 'High-country terrain near Tioga Pass and the Gaylor Lakes basin.' }],
    body:
      'The trail starts at the Tioga Pass entrance station, 9,945 ft, and climbs about a mile straight up a sun-baked grade to a ridge at 10,500 ft. The first half hour is steep enough that you stop a few times. Then the ridge opens and you drop into the Gaylor Lakes basin: Middle Gaylor Lake at 10,300 ft, granite shores, and the Cathedral Range across the south. The reward is out of proportion to the distance.\n\nBest July and August. Earlier and the upper switchbacks are slick or snow-covered; later and the meadows have browned out. The trail continues another mile north past Middle Gaylor to Upper Gaylor Lake and the ruins of the Great Sierra Mine, a late-1880s silver dig that never produced enough to pay for itself. Stone chimneys are still standing. Plan 2 to 3 hours round trip including time at the lake.',
    swap:
      'The parking at the Tioga Pass entrance station is small and fills early in summer. Get there before 9 a.m. or accept a roadside spot a few hundred yards back. Sea-level visitors should pace themselves on the climb: you start at 9,945 ft and gain another 550 to reach the ridge.',
  },

  // ---------------------------------------------------------------------------
  // HIDDEN AREAS — Tuolumne & the Highway 120 corridor
  // ---------------------------------------------------------------------------
  {
    id: 'north-dome-indian-rock',
    title: 'North Dome and Indian Rock, the seat across from Half Dome',
    region: 'tuolumne',
    order: 101,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'moderate',
    season: 'June to October',
    coord: [-119.5477, 37.8106], // TODO: verify (Porcupine Creek trailhead, Tioga Road)
    elevationFt: 8100,
    timeBudgetMin: 360,
    photos: [],
    body:
      'Half Dome\'s face is best seen not from the valley floor but from straight across Tenaya Canyon, and North Dome is the only summit that hands you that seat on a maintained trail. From the Porcupine Creek trailhead on Tioga Road the route runs about nine miles round trip, forest first, then open rim. The finish descends onto the bare dome itself, and Half Dome stands across the canyon at eye level, the full 2,000-foot face in a single frame, with Clouds Rest rising behind it. Photographers call this the honest angle. They are right.\n\nTwo thirds of the way in, a signed side trail climbs three tenths of a mile to Indian Rock, the only natural granite arch in Yosemite, about fifteen feet of it standing on a hilltop with views in every direction. Most hikers skip the detour. Do not; it is twenty minutes for the rarest rock formation in the park.\n\nJune through October, whenever Tioga Road is open. The trail loses elevation on the way out, which means the climbing comes on the way back; save water and legs for it.',
  },
  {
    id: 'clouds-rest-tenaya',
    title: 'Clouds Rest, the summit that outranks Half Dome',
    region: 'tuolumne',
    order: 102,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'strenuous',
    season: 'June to October',
    coord: [-119.4700, 37.8256], // TODO: verify (Sunrise Lakes trailhead, west end of Tenaya Lake)
    elevationFt: 8150,
    timeBudgetMin: 480,
    photos: [],
    hazard:
      'The summit ridge is narrow with long drops on both sides and is no place in wind, storm, or lightning. Afternoon thunderheads build fast here in July and August; plan to be off the ridge by early afternoon.',
    body:
      'Ask people who have done both and a surprising number pick Clouds Rest over Half Dome: a thousand feet higher, no permit lottery, no cables, a fraction of the company, and a summit view that includes Half Dome itself as a foreground object. From the Sunrise Lakes trailhead at the west end of Tenaya Lake it is about fourteen miles round trip with roughly 3,000 feet of climbing once the rollers are counted.\n\nThe famous moment is the summit ridge. The last few hundred yards narrow to a blocky granite spine with real air on both sides. It is a walkway, not a scramble, but it concentrates the mind, and a bypass path runs below the crest for anyone who wants it. The top is a long narrow platform at 9,926 feet with the entire park laid out: the valley, the high country, the Clark Range, and Half Dome below you for once.\n\nStart at first light from the trailhead, carry three liters, and treat the season window seriously; the trail holds snow into early summer some years. June through October, Tioga Road permitting.',
  },
  {
    id: 'lyell-canyon',
    title: 'Lyell Canyon, eight flat miles of high country',
    region: 'tuolumne',
    order: 103,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'easy',
    season: 'July to September',
    coord: [-119.3379, 37.8730], // TODO: verify (Lyell Canyon / JMT trailhead near the Dog Lake parking area, Tuolumne Meadows)
    elevationFt: 8700,
    timeBudgetMin: 240,
    photos: [],
    hazard:
      'Afternoon thunderstorms are routine in high summer and the canyon floor is open meadow. Check the sky at lunch and be walking back before the anvils build.',
    body:
      'The easiest miles in the high country. The John Muir Trail leaves Tuolumne Meadows across from the Dog Lake parking area, crosses the twin bridges over the Lyell Fork, and runs up Lyell Canyon: eight miles of nearly dead-flat walking, about 200 feet of total gain, beside a river that alternates green pools, gravel meanders, and slickrock slides, with the canyon walls keeping the scale honest the whole way.\n\nThere is no destination and none is needed. Walk until the trip says turn around; the twin bridges at one mile make a complete short outing, the first big bend at three or four miles a complete long one. The further you go, the fewer people you see, a rule that holds here more reliably than anywhere else this close to a road.\n\nJuly through September. The mosquito weeks after snowmelt are real; by late July the meadows dry and the walking is perfect. Trout hold in the pools, deer work the far bank in the evening, and the JMT hikers passing through with big packs make excellent five-minute company.',
  },
  {
    id: 'mono-pass-meadows',
    title: 'Mono Pass, the old trade route over the crest',
    region: 'tuolumne',
    order: 104,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'moderate',
    season: 'July to September',
    coord: [-119.2643, 37.8901], // TODO: verify (Mono Pass trailhead, Tioga Road at Dana Meadows)
    elevationFt: 9700,
    timeBudgetMin: 300,
    photos: [],
    hazard:
      'The trailhead sits near 9,700 feet and the pass above 10,600. Flatlanders feel it. Pace the first mile, drink more than usual, and turn around if a headache builds.',
    body:
      'The Mono Pass Trail leaves Tioga Road at Dana Meadows, a couple of miles inside Tioga Pass, and climbs gently, about a thousand feet over four miles, through creek crossings and wet meadows to the 10,600-foot gap where the Sierra drains east toward Mono Lake. People walked this line for centuries before it was a park trail; it was a trade route over the crest, obsidian moving west and acorns moving east, and the pass still feels like a doorway rather than a summit.\n\nThe payoff arrives at the top: Bloody Canyon dropping away below you and Mono Lake lying flat and pale beyond it, a view clean out of the park and into the Great Basin. Weathered log cabins from a failed 1880s mining venture stand near the pass, doorless and patient, worth the short wander.\n\nEight miles round trip, moderate only because of the altitude. July through September. Compared with Cathedral Lakes or Lembert Dome this trail is close to empty, which at this trailhead elevation counts as one of the quietest good deals in the park.',
  },
  {
    id: 'el-capitan-summit-tamarack',
    title: 'El Capitan from Tamarack Flat, the summit on foot',
    region: 'tuolumne',
    order: 105,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'strenuous',
    season: 'June to October',
    coord: [-119.7391, 37.7626], // TODO: verify (Tamarack Flat Campground, off Tioga Road)
    elevationFt: 6300,
    timeBudgetMin: 600,
    photos: [],
    hazard:
      'A very long day with no reliable water after early season; carry four liters. The summit rolls toward the face with no railing and no warning, and gusts on the rim are real. Stay well back from the edge.',
    body:
      'You can stand on top of El Capitan without touching a rope. The approach comes from above: start at Tamarack Flat Campground off Tioga Road, follow an easy 2.5 miles down the abandoned Big Oak Flat Road grade to the Tamarack Creek footbridge, then climb about six honest miles, exposed granite crossings and one meadow interlude, until the rim opens and the summit slabs roll toward the edge of the 3,000-foot face. Sixteen to seventeen miles round trip, ten to twelve hours, no permit needed for the day hike. Start before sunrise.\n\nThe summit is a broad granite back, not a point, and the drama is in where it stops. The valley is directly below, the Cathedral Rocks across, and if your timing is lucky you will meet climbers topping out after days on the wall, hauling their lives up the last lip. Give them the moment; they earned it differently than you did.\n\nThe old road you walk in on is the same 1874 wagon grade you can climb from the valley floor at the [Old Big Oak Flat Road](/stop/old-big-oak-flat-road) stop, severed in the middle by the 1945 rockslide. Walking its top end to the top of El Capitan is the deepest cut on this list; almost no one attempts it. June through October, Tioga Road permitting.',
  },

  // ===========================================================================
  // HETCH HETCHY & THE EVERGREEN ROAD CORRIDOR
  // The other granite valley. Its own entrance, day-use gate hours, a 25-foot
  // vehicle limit, open year-round, and almost nobody there.
  // ===========================================================================
  {
    id: 'evergreen-road-drive',
    title: 'Evergreen Road, the drive into the other Yosemite',
    region: 'hetch-hetchy',
    order: 1,
    kind: 'drive',
    coord: [-119.8790, 37.7986], // TODO: verify (Evergreen Road junction with Hwy 120, just outside the Big Oak Flat entrance)
    timeBudgetMin: 90,
    photos: [],
    body:
      'Hetch Hetchy has its own front door. Just outside the Big Oak Flat entrance, Evergreen Road leaves Highway 120 and runs north through forest and the old summer-camp community of Camp Mather; at Mather you pick up Hetch Hetchy Road, pass the park entrance station, and wind down to the O\'Shaughnessy Dam. Call it 16 miles from the highway, most of it slow. The last several miles are hairpins with steep drops. Don\'t speed. Don\'t pass.\n\n' +
      'Two rules catch people. The road is gated, open roughly sunrise to sunset with the exact hours posted at the entrance station, so a sunset-at-the-dam plan ends at a closed gate. And there\'s a 25-foot vehicle length limit: large RVs and trailers don\'t go.\n\n' +
      'The drive is part of the trip, not the tax on it. You cross the 2013 Rim Fire\'s burn country in visible recovery along Evergreen Road, then the road tips into the Tuolumne watershed and the reservoir appears below, granite walls rising straight out of the water. From Yosemite Valley you\'re looking at roughly an hour and forty-five minutes each way, which is why Hetch Hetchy works as a full day and fails as a half-day add-on. Budget the whole day and it repays you: on a July Saturday when the Valley is bumper to bumper, you can see fewer than a hundred people out here.',
  },
  {
    id: 'lookout-point',
    title: 'Lookout Point, the whole valley in one look',
    region: 'hetch-hetchy',
    order: 2,
    kind: 'viewpoint',
    coord: [-119.8237, 37.8817], // TODO: verify (Lookout Point knob, NE of the Mather entrance station)
    elevationFt: 4200,
    timeBudgetMin: 90,
    photos: [],
    body:
      'The short hike almost everyone drives past. The trail leaves from near the Hetch Hetchy entrance station at Mather and climbs gently through pine and recovering burn to a bare granite knob, about 2 miles round trip. From the top you get the overview the dam walk can\'t give you: the reservoir laid out below, Kolana Rock on the south wall, and in spring both Wapama and Tueeulala Falls streaking the north wall, the whole valley in a single frame.\n\n' +
      'April and May are the season. The falls are at full volume and the slopes around the knob put on one of the better wildflower shows at this elevation in the park. Do it as the opener to a Hetch Hetchy day, before the dam and the Wapama walk, and everything you see for the rest of the day sits somewhere on this view. An hour to ninety minutes, done.',
  },
  {
    id: 'oshaughnessy-dam',
    title: 'O\'Shaughnessy Dam, the walk across the argument',
    region: 'hetch-hetchy',
    order: 3,
    kind: 'viewpoint',
    coord: [-119.7886, 37.9464], // TODO: verify (O'Shaughnessy Dam crest, road-end parking)
    elevationFt: 3800,
    timeBudgetMin: 45,
    photos: [],
    body:
      'Park at the end of the road and walk out onto the dam. It\'s a quarter mile across, flat and paved, one of the few ways to stand inside a Sierra granite valley without hiking, and it ends in a tunnel hand-cut through the cliff at the far side. From the middle, look east: the reservoir running up-canyon, Kolana Rock standing off the south wall like Cathedral Rocks moved thirty miles north, Wapama Falls dropping over 1,000 feet down the north wall. The dam went up in 1923 and was raised in 1938; the seam between the two construction phases is visible from the upstream side, and interpretive signs at the eastern end tell the rest.\n\n' +
      'The history, stated plainly: this valley was inside a national park when San Francisco applied to flood it. John Muir fought the dam from roughly 1908 to 1913, lost when the Raker Act passed Congress, and died in 1914. The reservoir now holds 117 billion gallons and supplies drinking water to about 2.7 million people in the Bay Area. Both of those facts are true at once, and standing on the dam is the best place in California to hold them together.\n\n' +
      'The valley floor Muir walked is 200 to 350 feet under the surface, depending on the year. It wasn\'t removed; it\'s preserved down there, and the granite, the falls, and the eagles above the waterline are still doing the work of being themselves. Stand here a moment on your way out and look east. That\'s the trip.',
  },
  {
    id: 'wapama-falls-trail',
    title: 'Wapama Falls, five miles to the spray',
    region: 'hetch-hetchy',
    order: 4,
    kind: 'trailhead',
    coord: [-119.7911, 37.9453], // TODO: verify (trailhead parking at the dam road-end)
    elevationFt: 3800,
    timeBudgetMin: 300,
    photos: [],
    body:
      'The standard Hetch Hetchy day, and one of the best waterfall hikes in the park that almost nobody does. Cross the dam, pass through the tunnel, and follow the north shore east: about 5 miles round trip with roughly 700 feet of cumulative gain, rolling terrain rather than one climb. In May and June you pass under Tueeulala Falls first, a wispy spring-only fall that\'s gone by July most years, then reach the footbridges at the base of Wapama, where the fall drops over 1,000 feet and the spray in high water soaks everything on the bridges.\n\n' +
      'That spray is the honest caveat. In peak snowmelt the terminal bridges are sometimes closed for safety, and they have been swept out by debris in flood years. Check the NPS conditions page before a May or June visit. Two more honest notes: this is rattlesnake country, so watch your feet in the rocks, and poison oak grows close to the trail in places, so know what it looks like and wear long pants if you\'re unsure.\n\n' +
      'The trail is open year-round because the elevation is low, which cuts both ways: this is one of the few real hikes in the park you can do in February, and it\'s an exposed, 90-degree grind on an August afternoon. Spring is the show. Plan four to five hours including lunch at the base of the falls, carry more water than feels necessary, and bring sun protection; long sections have no shade.',
    swap:
      'If the Wapama bridges are closed in high water, don\'t force it. Walk the dam and tunnel for the up-close granite, then drive back to the entrance station and hike Lookout Point instead: 2 miles round trip to a knob that gives you both falls from a safe distance.',
  },

  // ---------------------------------------------------------------------------
  // HIDDEN AREAS — Hetch Hetchy & the Evergreen Road corridor
  // ---------------------------------------------------------------------------
  {
    id: 'merced-grove',
    title: 'Merced Grove, the sequoias you get to yourself',
    region: 'hetch-hetchy',
    order: 101,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'easy',
    coord: [-119.8409, 37.7495], // TODO: verify (Merced Grove trailhead, Big Oak Flat Road)
    elevationFt: 5400,
    timeBudgetMin: 150,
    photos: [],
    body:
      'Yosemite has three sequoia groves and the crowds know one of them. Merced Grove is the smallest, a couple dozen mature giants in a quiet drainage off Big Oak Flat Road, and the least visited by a wide margin. The walk is about three miles round trip on an old road grade, downhill on the way in with the climb saved for the walk out.\n\nWhat the numbers do not say is the experience. At Mariposa you see the big trees over heads and past the shuttle line. Here you stand alone with them, and the silence around a 250-foot tree turns out to be part of the tree. Give it an unhurried hour at the bottom; the grove is small enough to know personally.\n\nThe trailhead sits on the way to everything on this side of the park, which makes the grove the natural opener or closer to a [Hetch Hetchy day](/stop/evergreen-road-drive). Open year-round when the road is; in good snow years it makes a fine winter snowshoe walk.',
  },
  {
    id: 'rancheria-falls',
    title: 'Rancheria Falls, past where the day-hikers turn around',
    region: 'hetch-hetchy',
    order: 102,
    kind: 'trailhead',
    collection: 'hidden',
    difficulty: 'strenuous',
    coord: [-119.7911, 37.9453], // TODO: verify (trailhead at the O'Shaughnessy Dam road-end; route continues past Wapama)
    elevationFt: 3800,
    timeBudgetMin: 420,
    photos: [],
    hazard:
      'Rattlesnake country the whole way, poison oak close to the trail, and long stretches of full sun. In peak snowmelt the Wapama bridges can close and end the trip early; check conditions before a May or June start.',
    body:
      'Wapama Falls is where the Hetch Hetchy day-hikers turn around. The trail keeps going, and so should you if you have the legs: past the Wapama bridges the shoreline path rolls east beneath granite domes toward Rancheria Falls, where Rancheria Creek comes down more than a thousand vertical feet in a chain of cascades and slides through a narrow gorge. Thirteen miles round trip from the dam, with steady rolling gain, and past Wapama you will likely have the water, the walls, and the canyon to yourselves. Only a small fraction of park visitors ever see Hetch Hetchy at all; a fraction of those get this far.\n\nThe country is the argument. The walls here stand comparison with the valley\'s, the reservoir gives them a mirror, and the emptiness does the rest. Beyond Rancheria the trail climbs toward Tiltill Valley and the vast northwest wilderness, which is a fact to enjoy from a lunch rock rather than a suggestion.\n\nStart early; the [gate hours](/stop/evergreen-road-drive) bracket your day at both ends. Spring is for water, fall for temperature, and a summer afternoon out here is a grind you schedule around, not through. Read the caution, carry more water than feels reasonable, and it is one of the great quiet days in the park.',
  },
]

// Validate the entire collection at module-load. Any schema violation throws
// here and Vite surfaces it in the browser overlay or fails the build in CI.
export const stops: StopT[] = Stops.parse(seed)
