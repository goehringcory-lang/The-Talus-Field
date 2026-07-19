// =============================================================================
// FIELD GUIDE STOPS — region-organized.
//
// Stops are grouped into four regions: the Valley, Glacier Point & Mariposa,
// Tuolumne / the Hwy 120 corridor, and Hetch Hetchy. Within each region,
// `order` defines a suggested reading sequence (roughly the order a
// thoughtful visitor would do them in), but the page presents them as a flat
// list — visitors pick by what fits the time they have.
//
// Collections: entries with `collection: 'hidden'` belong to The Secret
// Guide, surfaced on /secret-guide (grouped by `category`) and kept out of
// the default region lists and the itinerary presets. They number from
// `order: 101` within each region so the core reading sequence never
// reshuffles. Hidden entries are maintained, signed park trails only; closed
// or abandoned routes are named in prose as history, never with directions.
//
// Bodies: drafted to match the editorial voice. Expect to refine.
// Coords: web-verified July 2026 against NPS place/trailhead pages, USGS
//   GNIS, and OSM-derived sources; each coord line carries its source and
//   any prior offset. Lines still marked `// TODO: verify on the ground`
//   had no authoritative source (unsigned pullouts, off-trail features,
//   conflicting sources) and must be checked at the actual spot before
//   relying on them for navigation. The PWA opens these in native Maps,
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
    coord: [-119.6773, 37.7156], // verified 2026-07: Wawona Tunnel east-portal overlook lot (Hikespeak/latitude.to)
    elevationFt: 4400,
    timeBudgetMin: 25,
    teaser:
      'You come out of the Wawona Tunnel and the whole valley is there at once: El Capitan, Bridalveil, Half Dome on the back wall. Stay fifteen minutes, not thirty seconds.',
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
    photos: [], // TODO: photo removed — automated fetch grabbed wrong subject; needs a correct image
    teaser:
      'A slow eastbound preview of the valley floor: Bridalveil parking, Cathedral Beach, the Swinging Bridge, Sentinel Beach. Don\'t commit to a hike yet.',
    body:
      'Slow drive east on Southside Drive. Pullouts worth taking on the way: Bridalveil Fall parking, Cathedral Beach (El Capitan view across the river), the Swinging Bridge (kids and quiet water), Sentinel Beach (Half Dome reflection on calm mornings). Don\'t commit to a hike yet — you\'re previewing. Every stop here is a place worth coming back to with intention.\n\n' +
      'Understand the road system once and it stops fighting you: the valley floor is a one-way loop, Southside Drive running east and Northside Drive running west, and a missed turn costs a full lap, thirty to forty-five minutes in traffic. Use the shape instead. The eastbound leg is the preview; the westbound return past [El Capitan Meadow](/stop/el-capitan-meadow) and [Valley View](/stop/valley-view) is the second act, and the two roads show you different walls. The speed limit is low, enforced, and also simply correct: the difference between 25 and 35 is every pullout you failed to notice.\n\n' +
      'Timing is the other half. Before 9 a.m. the loop is a country road with the light coming down the north wall; between 11 and 4 in summer it is a parking lot punctuated by scenery. If you arrive midday, do the drive anyway, but do it as reconnaissance and spend the afternoon on foot.',
  },
  {
    id: 'cooks-meadow-loop',
    title: 'Cook\'s Meadow Loop',
    region: 'valley',
    order: 3,
    kind: 'trailhead',
    coord: [-119.5896, 37.7435], // verified 2026-07: loop start at Sentinel Bridge lot, shuttle stop 11 (NPS); was ~400 m off
    elevationFt: 4035,
    timeBudgetMin: 60,
    teaser:
      'A flat one-mile boardwalk loop through the meadow at the heart of the valley. Come back right at sunset: this is the valley\'s most reliable place to watch a black bear.',
    body:
      'A flat one-mile boardwalk through the meadow at the heart of the valley. Most visitors walk to the Lower Yosemite Fall vista and turn around. Don\'t. Take the full counter-clockwise loop. You get Half Dome from Sentinel Bridge, El Capitan over the meadow, and the black oaks the Ahwahnechee tended for centuries. This is the walk that makes the valley feel like a place, not a viewpoint.\n\nThen come back right at sunset for the other show. Cook\'s Meadow is the valley\'s most reliable bear watch: black bears come out of the tree line in the last light to graze the meadow and work the black oaks, especially in fall when the acorns drop. Watch from the boardwalk, keep at least 150 feet, and let the bear keep its evening. The parkwide odds list is in [Where to actually see a bear](/essentials/bear-viewing).',
    photos: [{ src: '/photos/lower-yosemite-fall.jpg', caption: 'Lower Yosemite Fall, the standard turn-around point on the loop.' }],
    swap:
      'In late summer when the falls are dry, the meadow itself is the show — golden grass, low light through the oaks. Skip the fall vista, do the loop in reverse from Sentinel Bridge.',
  },
  {
    id: 'lower-yosemite-fall',
    title: 'Lower Yosemite Fall, timed right',
    region: 'valley',
    order: 4,
    kind: 'trailhead',
    coord: [-119.5966, 37.7466], // web-derived: shuttle stop 6 loop start (same pin as the lower-yosemite-fall hike); TODO: verify on the ground
    elevationFt: 4000,
    timeBudgetMin: 60,
    teaser:
      'A one-mile paved loop to the base of North America\'s tallest waterfall. In May the footbridge sits in a spray cloud; by late August the wall can be silent. Go before 9 a.m. or after dinner.',
    body:
      'Yosemite Falls drops 2,425 feet in three stages, the tallest waterfall in North America, and the paved one-mile loop to the base of the final 320-foot drop is the most walked trail in the park. That is not a reason to skip it. It is a reason to time it. Before 9 a.m. the loop is quiet, the light works down the wall, and the swifts are hunting the cliff face. After dinner the tour groups are gone and the fall goes to silhouette. Midday belongs to the crowd, and the crowd is welcome to it.\n\n' +
      'The fall runs on snowmelt and the calendar is dramatic. In May the footbridge sits inside a spray cloud and conversation requires raised voices; by late August the wall above is often bare granite with a dark stain where a waterfall used to be. If your trip lands in September, walk the loop anyway. The dry wall is its own lesson in what snow means here, and the eastern half of the loop, which most visitors never take, is a quiet walk through black oaks and old talus with the whole route to yourself. Stay off the wet boulders below the bridge; polished granite plus spray is the loop\'s one real hazard.\n\n' +
      'One window most guidebooks skip: on clear spring nights within a couple of days of the full moon, the spray at the footbridge throws a lunar rainbow, a pale arc your eye reads as silver and a long camera exposure reads in color. Photographers plan whole years around those dates. If your trip lines up in April, May, or June, walk back up after 10 p.m. and see it.',
    photos: [{ src: '/photos/lower-yosemite-fall.jpg', caption: 'Lower Yosemite Fall from the footbridge at the base of the loop.' }],
    swap:
      'If the loop is a shoulder-to-shoulder parade, walk 200 yards west into Cook\'s Meadow instead: the full 2,425-foot drop in one frame, which the base of the fall itself cannot show you.',
  },
  {
    id: 'bridalveil-fall',
    title: 'Bridalveil Fall',
    region: 'valley',
    order: 5,
    kind: 'trailhead',
    coord: [-119.6509, 37.7167], // verified 2026-07: rebuilt Bridalveil Fall lot at Wawona Rd / Southside Dr (NPS/Hikespeak); was ~260 m off
    elevationFt: 4100,
    timeBudgetMin: 30,
    teaser:
      'A five-minute paved walk to the fall that flows year-round, long after Yosemite Falls goes dry. Misty in spring; bring a layer.',
    body:
      'Five-minute walk on a paved path, rebuilt end to end in a restoration finished in 2023 that replaced the old cramped overlook with boardwalks and a proper viewing plaza. Bridalveil flows year-round, which makes it the reliable fall — Yosemite Falls dries up by August, this one doesn\'t. Spring is the drench, and the platform sits in the spray; bring a layer if the day is cool.\n\n' +
      'The Ahwahnechee name is Pohono, usually translated as spirit of the puffing wind, and ten minutes here explains it: the fall drops 620 feet from a hanging valley, and the afternoon wind takes the bottom half sideways, sometimes lifting the whole ribbon off the wall. That hanging valley is the trip\'s geology lesson in miniature. The side glacier that carved Bridalveil Creek\'s canyon was small; the trunk glacier in the main valley was enormous and cut thousands of feet deeper; when the ice left, the creek\'s valley was stranded in the air, and the creek has been falling out of it ever since. Every waterfall on these walls is the same story at a different scale.\n\n' +
      'You don\'t need long here, but you do need to do it.',
    photos: [{ src: '/photos/cathedral-rocks.jpg', caption: 'Cathedral Rocks looming above the Bridalveil drainage.' }],
  },
  {
    id: 'valley-view',
    title: 'Valley View, the river-level goodbye',
    region: 'valley',
    order: 6,
    kind: 'viewpoint',
    coord: [-119.6616, 37.7203], // web-derived: V11 pullout, Northside Dr just east of Pohono Bridge; TODO: verify on the ground
    elevationFt: 3900,
    timeBudgetMin: 20,
    teaser:
      'The river-level bookend to Tunnel View: El Capitan and Cathedral Rocks framing the Merced at pullout V11 on Northside Drive. Ansel Adams shot it as Gates of the Valley.',
    body:
      'Tunnel View shows you the valley from above. Valley View hands it to you at river level. The pullout sits on Northside Drive just east of the Pohono Bridge, marked V11, and because Northside runs one way west, you reach it on the way out of the valley, which is exactly the right time to see it. El Capitan stands on the left, Cathedral Rocks and a sliver of Bridalveil on the right, and the Merced slides over granite boulders in the foreground. Ansel Adams shot this frame as Gates of the Valley, and the composition has not moved since.\n\n' +
      'The pullout holds about a dozen cars and turns over fast, but there is no circling back on a one-way road: if it is full, your options are another lap of the valley or tomorrow. Late afternoon puts warm light on El Capitan, winter dusk turns the whole frame pink, and on calm mornings the river holds the reflection. Make it the last stop of the last day. Thirty seconds after you pull out, the valley is behind you, and this is the image that rides home in the car.',
    photos: [], // TODO: needs dedicated photography — no editorial image matches the Valley View riverbank frame
    swap:
      'Full pullout and no patience for another lap? Cathedral Beach picnic area on Southside Drive gives you El Capitan across the river from the south bank, and almost nobody uses it.',
  },
  {
    id: 'old-big-oak-flat-road',
    title: 'Old Big Oak Flat Road and Ribbon Fall',
    region: 'valley',
    order: 7,
    kind: 'trailhead',
    coord: [-119.6451, 37.7238], // TODO: verify on the ground — unsigned dirt pullout (V9), Northside Dr; trip reports match this spot but no source publishes the coord (2026-07 web pass; same pin as old-road-trailhead-pullout)
    elevationFt: 4000,
    timeBudgetMin: 240,
    photos: [{ src: '/photos/old-big-oak-flat-road.jpg', caption: 'Cathedral Rocks, visible across the valley from the old road.' }],
    teaser:
      'Climb the abandoned 1874 wagon road from a dirt pullout on Northside Drive: hand-stacked walls, stagecoach switchbacks, and almost nobody on them. Half a day, easy.',
    body:
      'A small dirt pullout on Northside Drive, between the Pohono Bridge and El Capitan. Most people drive past it. From this turnout you can climb the original Big Oak Flat Road — the wagon grade completed in 1874, one of the three original roads built to reach the valley floor. It carried stagecoaches for seventy years. A massive rockslide in 1945 closed it permanently, and it\'s never reopened to vehicles. Most of the old roadbed is still there: hand-stacked retaining walls, cut blocks, switchbacks wide enough for a six-horse coach. Almost nobody walks it.\n\nThe climb is rock-hopping and a little scrambly in places — nothing technical, doable with kids. About a mile and 800 feet of gain gets you to the first big preserved section of road. Bring lunch. Sit in the shade of incense cedars and look across the valley at Cathedral Rocks. Half a day, easy. A full day if you keep going.\n\nIn early spring — March through early May, depending on snowmelt — extend west from the old road to the base of Ribbon Fall. The traverse is unmarked and rough; you\'re following the sound of water through talus. The payoff is standing under a 1,612-foot single drop — the tallest waterfall in North America, taller than the Empire State Building. It only flows for a few weeks a year, fed entirely by snowmelt off the rim above. By late May it\'s usually dry. Most visitors never see it run.\n\nSummer or not, the road itself is the year-round draw. You\'re walking the grade that carried the first generation of Yosemite tourists down into the valley, and you\'ll have it to yourself.',
    swap:
      'The dirt pullout holds maybe four or five cars. If it\'s full, park at the Bridalveil Fall lot a quarter mile east and walk back along Northside Drive. Adds fifteen minutes each way and a touch of road noise, but you don\'t lose the day.',
  },
  {
    id: 'old-road-trailhead-pullout',
    title: 'Old Big Oak Flat Road pullout, where to park',
    region: 'valley',
    order: 8,
    kind: 'parking',
    coord: [-119.6451, 37.7238], // TODO: verify on the ground — same pullout as old-big-oak-flat-road; no published coord (2026-07 web pass)
    elevationFt: 4000,
    timeBudgetMin: 10,
    teaser:
      'The unsigned dirt pullout on Northside Drive where the old road climb starts. It holds four or five cars; this pin exists so you can drive straight to it.',
    body:
      'The dirt pullout on Northside Drive, between the Pohono Bridge and El Capitan, on the north side of the road. It holds four or five cars and has no sign worth the name; the tell is the old roadbed angling up into the trees behind it. This pin exists so you can navigate straight to it instead of hunting for it at 15 mph with traffic behind you.\n\nIf it\'s full, park at the Bridalveil Fall lot a quarter mile east and walk back along Northside Drive. Adds fifteen minutes each way. From the pullout, the climb starts immediately: see [Old Big Oak Flat Road and Ribbon Fall](/stop/old-big-oak-flat-road) for the day itself.',
    photos: [{ src: '/photos/old-road-trailhead-pullout.jpg' }],
  },
  {
    id: 'rainbow-view-old-road',
    title: 'Rainbow View, the old road\'s reward',
    region: 'valley',
    order: 9,
    kind: 'viewpoint',
    coord: [-119.6608, 37.7255], // TODO: verify on the ground — Rainbow View bench on the old road grade; not in GNIS, route accounts only (2026-07 web pass)
    elevationFt: 4800,
    timeBudgetMin: 90,
    teaser:
      'Partway up the old road grade the trees open on Bridalveil Fall from above its rim, the view the stagecoach drivers stopped for. Morning light is best.',
    body:
      'The viewpoint the stagecoach drivers used to stop at. Partway up the old Big Oak Flat Road grade, the trees open and you\'re looking across the valley at Bridalveil Fall from above its rim: the whole ribbon of it, the Cathedral Rocks stacked behind, the Merced threading the valley floor below. In the 1870s this was the first full look at the valley most visitors ever got, and the road was aligned to deliver it. Now nobody\'s here.\n\nThe light is best in the morning, when the south wall is lit and the fall carries its spray rainbow (that\'s the name). Reached only on foot via the old road from [the Northside Drive pullout](/stop/old-road-trailhead-pullout); budget the climb as part of the [Old Big Oak Flat Road half day](/stop/old-big-oak-flat-road).',
    photos: [{ src: '/photos/rainbow-view-old-road.jpg' }],
  },
  {
    id: 'ribbon-fall-base',
    title: 'Ribbon Fall, the few weeks it runs',
    region: 'valley',
    order: 10,
    kind: 'viewpoint',
    coord: [-119.6477, 37.7334], // TODO: verify on the ground — estimated directly below the WWD fall coord; no published coord for the amphitheater base (2026-07 web pass; prior pin sat ~440 m short, toward the road)
    elevationFt: 4400,
    timeBudgetMin: 120,
    teaser:
      'A rough, unmarked talus traverse to the base of North America\'s tallest single-drop waterfall, 1,612 feet, flowing only a few weeks each spring.',
    body:
      'A 1,612-foot single drop, the tallest waterfall in North America, and it only exists for a few weeks a year. Ribbon Fall is fed entirely by snowmelt off the rim west of El Capitan: it wakes in March, peaks in April and early May, and is usually a stain on the wall by late May. There is no sign, no trail marker, and no crowd.\n\nThe approach leaves the [old Big Oak Flat Road](/stop/old-big-oak-flat-road) and traverses west through talus toward the sound of water. It\'s unmarked and rough, a route rather than a trail; wear real shoes and take your time on the blocks. The amphitheater at the base is loud, cold, and yours. Check the seasonal window before committing the day: in a dry year the show can be over by the first week of May.',
    swap:
      'If the traverse is more than the group wants, Bridalveil Fall runs year-round and its viewing platform is a five-minute paved walk. Same geology lesson, one tenth the effort.',
    photos: [{ src: '/photos/ribbon-fall-base.jpg' }],
  },
  {
    id: 'foresta-cascades',
    title: 'Cascade Creek and the Foresta side',
    region: 'valley',
    order: 11,
    kind: 'viewpoint',
    coord: [-119.7134, 37.7228], // verified 2026-07: Cascades picnic area, El Portal Rd / Hwy 140 (NPS place page, lot-scale)
    elevationFt: 3800,
    timeBudgetMin: 60,
    teaser:
      'Cascade Creek stairsteps off the north rim just inside the Arch Rock entrance, best in April and May, with the quietest picnic tables on the west end of the valley.',
    body:
      'Where the old Big Oak Flat Road corridor meets the modern one. Cascade Creek comes off the north rim in a long stairstep of whitewater, best in April and May, and the picnic tables along the creek just inside the Arch Rock entrance are the quietest lunch stop on the west end of the valley. If you\'re entering on Highway 140, this is the first place worth stopping; if you\'ve spent the morning on the [old road](/stop/old-big-oak-flat-road), it\'s the closing move.\n\nAbove the rim sits Foresta, the small private inholding the 1990 A-Rock fire burned through; the meadow there is a wildflower show in June and one of the park\'s better deer and bear sightlines at dusk. The Foresta road leaves Big Oak Flat Road (the modern highway) near Crane Flat.',
    photos: [{ src: '/photos/foresta-cascades.jpg' }],
  },
  {
    id: 'el-capitan-meadow',
    title: 'El Capitan Meadow, watching the wall',
    region: 'valley',
    order: 12,
    kind: 'viewpoint',
    coord: [-119.6354, 37.7238], // verified 2026-07: El Capitan Meadow roadside pullouts, Northside Dr (GNIS); was ~480 m off
    elevationFt: 4000,
    timeBudgetMin: 60,
    teaser:
      'Pull off at the meadow and look up: there are climbers on the 3,000-foot wall right now. Bring binoculars. The best free show in the park.',
    body:
      'Pull off Northside Drive at the meadow and look up. There are climbers somewhere on the wall right now. Find the photographer with the longest lens, ask politely, and they\'ll point them out — climbers love showing them off. Most parties take 3–5 days on the standard routes; you\'re looking at people in tents glued to a 3,000-foot vertical wall, who have been on it for two days and will be there for two more. Bring binoculars if you have them. This is the best free show in the park.',
    photos: [{ src: '/photos/el-capitan-winter.jpg', caption: 'El Capitan from Northside Drive, winter light.' }],
  },
  {
    id: 'camp-4',
    title: 'Camp 4, where modern climbing was invented',
    region: 'valley',
    order: 13,
    kind: 'viewpoint',
    coord: [-119.6029, 37.7421], // web-derived: Camp 4 walk-in campground entrance, Northside Dr behind Yosemite Valley Lodge; TODO: verify on the ground
    elevationFt: 4000,
    timeBudgetMin: 30,
    teaser:
      'The walk-in campground where big-wall climbing was worked out in the 1950s and 60s, now on the National Register of Historic Places. Walk through, watch the boulderers.',
    body:
      'Camp 4 is a walk-in campground behind Yosemite Valley Lodge, and on the surface that is all it is: picnic tables, bear boxes, tents under the oaks. It is also the most consequential campsite in the history of climbing. Through the 1950s and 60s the climbers who lived here for months at a stretch, Royal Robbins, Warren Harding, Yvon Chouinard forging pitons on an anvil by the parking lot, worked out the techniques and the gear that made walls like El Capitan possible. When the Park Service later planned to redevelop the site, climbers fought it in court, and in 2003 Camp 4 went onto the National Register of Historic Places: a campground listed alongside battlefields, for what happened in it.\n\n' +
      'You can walk through respectfully; it is a public campground, not a museum. The granite blocks scattered through camp are world bouldering landmarks, and most afternoons someone is trying Midnight Lightning on the Columbia Boulder, a problem first climbed in 1978 and still a career moment for anyone who tops it. Watch from a polite distance and keep voices down among the tents. The Yosemite Falls Trail starts directly behind camp, and the search-and-rescue site next door is staffed largely by climbers, which is the arrangement this place has always run on. Pair the visit with [El Capitan Meadow](/stop/el-capitan-meadow): first the wall, then the campground that figured out how to climb it.',
    photos: [], // TODO: needs dedicated photography — no editorial image matches Camp 4
  },
  {
    id: 'mirror-lake',
    title: 'Mirror Lake, before the crowd',
    region: 'valley',
    order: 14,
    kind: 'trailhead',
    coord: [-119.5600, 37.7393], // verified 2026-07: Mirror Lake trailhead at shuttle stop 17 (NPS/Hikespeak); was mid-trail, ~830 m off
    elevationFt: 4094,
    timeBudgetMin: 90,
    photos: [], // TODO: photo removed — automated fetch grabbed wrong subject; needs a correct image
    teaser:
      'Two flat miles round trip to the closest spot in the valley to Half Dome. Go early, before the breeze erases the reflection.',
    body:
      'Two miles round trip from the shuttle stop, mostly flat. The "lake" is really a pool in the Tenaya Creek drainage; it\'s a real lake in spring, mostly meadow by August. Either way it\'s the closest spot in the valley to Half Dome, looking up the back side of it. Go early — the trail is in shade until 10 a.m. and the reflection is gone by mid-morning when the breeze picks up.\n\n' +
      'Watch Tenaya Creek where it feeds and drains the lake and you may spot a water ouzel, the American dipper: a dark, robin-sized bird that walks straight into fast current instead of avoiding it. It grips the streambed with oversized feet, dives in, and forages for insect larvae underwater, seeing well enough below the surface to hunt in the flow. Ouzels only work cold, fast, well-oxygenated water, so seeing one is a sign the creek is healthy. Come at the same quiet early hours you\'d come for the reflection, before the crowds and the wind. The guide\'s Secret Spots section has a dedicated ouzel-watching spot on the Merced at Happy Isles. And if the lake leaves you wanting more of Tenaya Creek, the canyon above holds a waterfall almost nobody visits: see [Three Chutes Falls](/stop/three-chutes-falls).',
  },
  {
    id: 'mist-trail',
    title: 'Mist Trail to Vernal Fall (and Nevada, if you have it)',
    region: 'valley',
    order: 15,
    kind: 'trailhead',
    coord: [-119.5580, 37.7322], // verified 2026-07: Happy Isles trailhead, shuttle stop 16 (Hikespeak/NPS); was ~215 m off
    elevationFt: 4035,
    timeBudgetMin: 360,
    // Source: Yosemite Guide Vol 51 Issue 5 (June 10 - July 14, 2026).
    hazard:
      'Repair closures through 2026: the Mist Trail is closed Monday through Thursday, 7 a.m. to 3:30 p.m., June 30 through late October (open Fridays, weekends, and holidays, and outside those hours when conditions allow). The John Muir Trail between Clark Point and the Panorama Trail junction is closed until mid-July 2026, which blocks the usual descent. Check conditions at the Welcome Center before counting on the loop.',
    teaser:
      'Six hundred granite steps in the spray to Vernal Fall, then Nevada if you have it. Start at Happy Isles by 6:30 a.m. and come down the John Muir Trail.',
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
    order: 16,
    kind: 'trailhead',
    coord: [-119.6020, 37.7339], // verified 2026-07: roadside lot, Southside Dr west of the Swinging Bridge (NPS place page)
    elevationFt: 4000,
    timeBudgetMin: 480,
    // Source: Yosemite Guide Vol 51 Issue 5 (June 10 - July 14, 2026).
    hazard:
      'Through mid-July 2026 the John Muir Trail is closed between Clark Point and the Panorama Trail junction, and short Panorama Trail closures are possible, which can break this route\'s Panorama descent to Happy Isles. Confirm trail status before committing to the loop.',
    photos: [{ src: '/photos/four-mile-trailhead.jpg', caption: 'Vernal Fall, one of the two falls the Panorama descent passes.' }],
    teaser:
      '3,200 feet and 58 switchbacks from the valley floor to Glacier Point. There is no water anywhere on the trail; start at dawn with three liters.',
    body:
      'The trailhead is a small lot on Southside Drive, about a mile west of Sentinel Beach near the Swinging Bridge, and it fills by 7 a.m. on busy days. If it\'s full, park at the day-use lot and ride the shuttle to the El Capitan stop (E6). Start at 5:30 or 6 in the morning, not because it\'s virtuous but because the first mile is the steepest and most exposed on the route and it bakes once the sun clears the rim. There is no water anywhere on this trail. Carry three liters minimum.\n\n' +
      'The trail was built in 1872 as a toll route and was exactly four miles then; the Park Service rebuilt it in the late 1920s with gentler switchbacks, the mileage grew to about 4.8, and the name stuck. You climb roughly 3,200 feet across something like 58 switchbacks. Union Point, near mile three, is the rest stop with the view that makes people quit early: Yosemite Falls straight across, El Capitan west, Half Dome appearing east. Keep going. Popping out at the Glacier Point railing after three hours on the wall beats driving there by more than the effort costs.\n\n' +
      'The strong move is the loop: up the Four Mile, then down the Panorama Trail past Illilouette Fall and Nevada Fall to Happy Isles. 13 to 14 miles, around 4,000 feet of total climbing (there\'s an 800-foot surprise back out of the Illilouette drainage), 8 to 10 hours. The one-way logistics are workable rather than elegant: finish at Happy Isles (shuttle stop 16) and ride the Valley shuttle back toward E6, the closest stop to your car. Two cars simplifies everything. Hitching a ride down from Glacier Point happens, but don\'t build a day around a stranger\'s empty seat.\n\n' +
      'Season matters twice. Glacier Point Road has to be open for the loop to work (it typically opens in May), and the upper Four Mile Trail itself closes in winter when ice makes the ledges unsafe, typically until well into spring. In summer the climb is very exposed in heat: morning start, hat, sunscreen, and the three liters. Check the NPS conditions page the night before.',
  },
  {
    id: 'yosemite-village',
    title: 'Yosemite Village, the museum hour',
    region: 'valley',
    order: 17,
    kind: 'viewpoint',
    coord: [-119.5871, 37.7488], // web-derived: Village Store / Welcome Center cluster, Yosemite Village; TODO: verify on the ground
    elevationFt: 4000,
    timeBudgetMin: 90,
    teaser:
      'The Yosemite Museum, the reconstructed Miwok village behind it, and the Ansel Adams Gallery: the best indoor hour in the park, hiding behind the grocery run.',
    body:
      'Yosemite Village is the valley\'s working center: the Welcome Center, the Village Store, the post office, most of the rangers. Treat it as errands and you will miss the best indoor hour in the park. The Yosemite Museum, built in 1926 and the first purpose-built museum in the national park system, holds a basket collection that belongs in any serious conversation about American art: work by Ahwahnechee and Mono Lake Paiute weavers, some pieces years in the making. In summer, demonstrations of basketry and other traditional skills run near the entrance, and they are worth planning around.\n\n' +
      'Behind the museum, a self-guided loop walks through the reconstructed Indian Village of the Ahwahnee: bark umachas, an acorn granary, a roundhouse still used ceremonially by the park\'s associated tribes, and a pounding rock worn deep with mortar holes from centuries of acorn work. Fifteen minutes here reframes every meadow you look at afterward, because all of them were tended, none of them wild in the storybook sense. Next door, the Ansel Adams Gallery has operated on this spot since 1902, when it opened as Best\'s Studio; Adams married the owner\'s daughter, and the gallery still sells prints made from his negatives. Ten minutes in front of the real prints will quietly recalibrate your own photographs of this place.\n\n' +
      'Two practical notes. Park once in the Village day-use lot and do the whole cluster on foot; do not move the car between buildings. And give the Pioneer Cemetery across the road from the museum ten quiet minutes: Galen Clark, the valley\'s first guardian, lies under sequoias he planted for himself.',
    photos: [], // TODO: needs dedicated photography — no editorial image matches the Village museum cluster
  },
  {
    id: 'ahwahnee-hotel',
    title: 'The Ahwahnee Hotel, lobby visit',
    region: 'valley',
    order: 18,
    kind: 'viewpoint',
    coord: [-119.5743, 37.7462], // verified 2026-07: Ahwahnee main entrance (OSM/Mapcarta)
    timeBudgetMin: 45,
    teaser:
      'The 1927 lobby and Great Lounge are open to anyone. Walk through, sit by the 24-foot fireplace, order a drink at the bar. No reservation needed.',
    body:
      'You don\'t have to be a guest. The lobby and Great Lounge are open to the public. Walk through. The 1927 building is a national historic landmark — Native American motifs, exposed beams, a 24-foot fireplace. Sit by the fire if it\'s lit. Order a drink at the bar. The dining room requires reservations and dress code; the bar doesn\'t. This is the kind of place worth spending an hour in just to absorb.\n\n' +
      'The building rewards a slower look than most guests give it. Gilbert Stanley Underwood designed it, and what reads as timber and stone is largely poured concrete, formed and stained to imitate redwood so this hotel could not burn down the way its wooden predecessors did; the deception still works from ten feet away. Circle the Great Lounge for the stained-glass panels along the tops of the windows, then find the smaller rooms off it, which most visitors walk past. Every December the dining room stages the Bracebridge Dinner, a costumed banquet the hotel has produced since 1927. Queen Elizabeth II, President Kennedy, and Steve Jobs all have history under this roof, and the lobby mentions none of it, which is very much the house style.',
    photos: [{ src: '/photos/ahwahnee-hotel.jpg' }],
  },
  {
    id: 'sentinel-bridge-sunset',
    title: 'Sentinel Bridge, the last hour',
    region: 'valley',
    order: 19,
    kind: 'viewpoint',
    coord: [-119.5901, 37.7434], // verified 2026-07: Sentinel Bridge span and lot proper (LOC/HAER CA-94, Gary Hart, agent review); nudged ~105 m north
    elevationFt: 4000,
    timeBudgetMin: 60,
    teaser:
      'Half Dome catches the last light here with the Merced in the foreground. Skip the crowded rail for the small beach below the bridge, and stay past the gold.',
    body:
      'Half Dome catches the last light from here. The Merced is in the foreground. People crowd the rail; walk down to the small beach below the bridge instead — wider angle, fewer elbows. If you have one image to take home, it\'s this one. Stay until the wall goes from gold to pink to grey, and through twilight to first stars. Most visitors leave too early.\n\n' +
      'Two refinements for anyone carrying a camera. The mirror reflection needs slack water, which the Merced only offers once the spring runoff drops, so late summer through winter is reflection season; in May the river moves too fast to hold the image. And a few evenings each month the moon comes up near Half Dome\'s shoulder shortly after sunset. Check moonrise against sunset time, and if they land within an hour of each other, stay for it. This bridge has held tripods on those evenings for a century, Ansel Adams\'s among them.',
    photos: [{ src: '/photos/half-dome.jpg', caption: 'Half Dome at last light.' }],
  },
  {
    id: 'curry-village',
    title: 'Curry Village, base camp',
    region: 'valley',
    order: 20,
    kind: 'lodging',
    coord: [-119.5726, 37.7377], // verified 2026-07: Curry Village core, registration/dining (OSM); was ~390 m off (same pin as curry-village-pizza)
    teaser:
      'Tent or wood cabins at the original 1899 camp, walking distance to the dining hall, the shuttle, and the Mist Trail. Reservations open thirteen months out.',
    body:
      'Tent cabins or wood cabins, your call. The tent cabins have history (this is the original 1899 camp); the wood cabins have insulation. Either way, the location is what you\'re paying for: walking distance to the dining hall, the shuttle stop, and the trailhead for Mist Trail in the morning. For a multi-night trip, stay all your nights here — the time you save on packing each morning is worth more than the variety. Reservations open thirteen months out and the good months sell in minutes.',
    swap:
      'If Curry is full: Yosemite Valley Lodge or the Ahwahnee are the in-park alternates. Outside the park: El Portal (closest, 30 min), Mariposa (45 min, more options), or Groveland (north entrance side, 1 hr to valley).',
    photos: [{ src: '/photos/curry-village.jpg' }],
  },
  {
    id: 'curry-village-pizza',
    title: 'Lunch at Curry Village',
    region: 'valley',
    order: 21,
    kind: 'meal',
    coord: [-119.5726, 37.7377], // verified 2026-07: Curry Village core (same pin as curry-village)
    timeBudgetMin: 60,
    teaser:
      'The pizza patio is right where you land off the Mist Trail: fast, good after a hike, no reservation. The Loft has the better menu if you have patience.',
    body:
      'You\'ll be hungry off the Mist Trail. The Curry Village pizza patio is right there, fast, and good after a hike. Loft has a slightly better menu if you have patience. The Ahwahnee dining room is available for lunch but you\'ll need a reservation and you\'ll want to clean up first.',
    photos: [{ src: '/photos/curry-village-pizza.jpg' }],
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
    category: 'trails',
    difficulty: 'easy',
    coord: [-119.6697, 37.7135], // TODO: verify on the ground — GNIS (37.7121, -119.6749) conflicts with trail-guide geometry (~-119.667); current pin sits between the candidates (2026-07 web pass)
    elevationFt: 4700,
    timeBudgetMin: 120,
    photos: [{ src: '/photos/artist-point.jpg' }],
    teaser:
      'Two miles round trip on the abandoned stagecoach grade above Tunnel View to the spot where the first published drawing of the valley was made in 1855.',
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
    category: 'trails',
    difficulty: 'strenuous',
    coord: [-119.5929, 37.7565], // verified 2026-07: Yosemite Point rim, 6,936 ft (OSM + Yosemite SAR dataset); was ~220 m off
    elevationFt: 6936,
    timeBudgetMin: 480,
    photos: [{ src: '/photos/yosemite-point.jpg' }],
    hazard:
      'Past the railed overlook the rim is bare, unrailed granite over a vertical drop. Keep a body length back from the edge; the view does not improve past that line.',
    teaser:
      'Cross the bridge above Upper Yosemite Fall and continue to the rim at 6,936 feet: Lost Arrow below, Half Dome ahead, the valley a vertical mile down.',
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
    category: 'trails',
    difficulty: 'strenuous',
    coord: [-119.6149, 37.7458], // verified 2026-07: Eagle Peak summit (GNIS/OSM); was ~890 m off, on the canyon slope
    elevationFt: 7779,
    timeBudgetMin: 510,
    photos: [{ src: '/photos/eagle-peak.jpg' }],
    hazard:
      'The summit blocks end in open air with no railings anywhere past the falls overlook. No water on the upper mountain in summer; carry three liters.',
    teaser:
      'A maintained trail to the highest of the Three Brothers, six miles one way, with El Capitan straight across at eye level for once. Carry three liters.',
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
    category: 'trails',
    difficulty: 'strenuous',
    coord: [-119.5375, 37.7560], // verified 2026-07: junction ~1.0–1.1 mi past Mirror Lake at Snow Creek confluence/footbridge (GNIS Snow Creek Falls + NPS/yosemiteperegrinelodge route texts); prior pin was ~700 m too far west and short
    elevationFt: 4100,
    timeBudgetMin: 360,
    photos: [], // TODO: photo removed — automated fetch grabbed wrong subject; needs a correct image
    hazard:
      'The switchbacks are shadeless by mid-morning and there is no water between Tenaya Creek and Snow Creek. Do not leave the trail toward Tenaya Canyon; the gorge below is technical terrain where hikers have died.',
    teaser:
      'The steepest maintained way out of the valley: 2,600 feet in 1.7 miles up more than a hundred switchbacks, each one reframing Half Dome and Tenaya Canyon.',
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
    category: 'trails',
    difficulty: 'moderate',
    season: 'April to June',
    coord: [-119.529914, 37.759413], // user-provided GPS — TODO: verify on the ground
    elevationFt: 4300,
    timeBudgetMin: 180,
    photos: [], // TODO: photo removed — automated fetch grabbed wrong subject; needs a correct image
    hazard:
      'The crossings above Mirror Lake are fords, not bridges. In May and June the current is fast and cold enough to knock an adult down; if the water is over your knees, this is a viewpoint, not a swim. Do not continue past the falls into upper Tenaya Canyon.',
    teaser:
      'Half a mile up Tenaya Creek past where the Mirror Lake crowd turns around, the creek drops eighty feet through three clean granite chutes. Spring is the show.',
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
    category: 'vistas',
    difficulty: 'easy',
    season: 'March to May',
    coord: [-119.5915, 37.7452], // verified 2026-07: Cook's Meadow floor viewing ground (lot-scale)
    elevationFt: 4000,
    timeBudgetMin: 90,
    photos: [{ src: '/photos/valley-ephemeral-falls.jpg' }],
    teaser:
      'Sentinel Fall, Staircase Falls, Royal Arch Cascade, Lehamite: the valley\'s second set of waterfalls, running a few weeks each spring beside famous neighbors.',
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
    category: 'vistas',
    difficulty: 'easy',
    season: 'March to May',
    coord: [-119.6773, 37.7156], // verified 2026-07: viewed from the Tunnel View overlook (same pin as tunnel-view)
    elevationFt: 4400,
    timeBudgetMin: 45,
    photos: [{ src: '/photos/widows-tears-silver-strand.jpg' }],
    teaser:
      'Stand at Tunnel View and look right instead: Silver Strand drops 560 feet at the west end, and Widow\'s Tears runs nearly 1,200 for a few weeks of hard snowmelt.',
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
    coord: [-119.7053, 37.6500], // TODO: verify on the ground — Chinquapin junction, GNIS-derived, sources spread ~300 m (2026-07 web pass; was ~5.9 km east, past Badger Pass)
    timeBudgetMin: 120,
    teaser:
      'Sixteen miles from Chinquapin to Glacier Point, and the road is the experience: Pothole Meadows, the Sentinel Dome lot, Washburn Point. Give it three or four hours.',
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
    coord: [-119.5842, 37.7233], // verified 2026-07: Sentinel Dome summit (GNIS); park at the shared lot, see taft-point
    elevationFt: 8122,
    timeBudgetMin: 120,
    teaser:
      'The five-mile loop takes both viewpoints in one walk: Sentinel\'s 360-degree panorama and Taft\'s 3,000-foot edge, joined by the quietest stretch of rim trail.',
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
    coord: [-119.5861, 37.7124], // verified 2026-07: Sentinel Dome / Taft Point shared lot, Glacier Point Rd mile 13.6 (NPS/Hikespeak)
    elevationFt: 7500,
    timeBudgetMin: 90,
    photos: [{ src: '/photos/taft-point.jpg' }],
    teaser:
      'A gentle 2.2 miles to the Fissures and an unrailed 3,000-foot drop, with El Capitan in profile across the void. The view from twenty feet back is just as good.',
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
    coord: [-119.5731, 37.7205], // verified 2026-07: Washburn Point pullout, Glacier Point Rd mile 15.5 (LOC HAER survey/Hikespeak); was ~80 m east
    elevationFt: 7850,
    timeBudgetMin: 30,
    photos: [{ src: '/photos/washburn-point.jpg', caption: 'Half Dome. Washburn Point shows it in full profile, falls stacked below.' }],
    teaser:
      'The big pullout a mile before Glacier Point, with the better Half Dome: full profile, Vernal and Nevada Falls stacked below. Stop here first.',
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
    coord: [-119.5731, 37.7283], // verified 2026-07: Glacier Point main lot / overlook path (Hikespeak/LOC HAER)
    elevationFt: 7214,
    timeBudgetMin: 75,
    teaser:
      'Half Dome at eye level and the valley floor 3,200 feet down. Come after 4:30 when the lot empties, and stay to watch the shadow climb the dome.',
    body:
      'Half Dome at eye level. The valley floor 3,200 feet below. The waterfalls visible end-to-end. Avoid noon to four — the parking is brutal and the light is flat. Late afternoon (4:30 p.m. onward) the lot empties, the light turns warm, and you can sit on the wall and watch the shadow climb Half Dome. Stay through sunset if you can; the drive back to the valley in the dark is fine, just slow. If a ranger is giving an evening talk (most weekends June through August), stay for it — they\'re short and they\'re good.\n\n' +
      'One more note on timing across the calendar: Glacier Point Road is plowed open only after winter, typically sometime in May, and the first weeks of the season are the quiet ones. The lot is easy, the amenities are skeletal, water may not be running yet, and the high country you\'re looking at east of here still reads as full winter while the Valley below has gone green. Snow lines the trailheads and the shaded meadows into late spring. It\'s the rare stretch when this overlook feels like a place you found rather than a place everyone\'s been. Check the Park Service road-status page the night before, bring your own water, and go early.',
    photos: [{ src: '/photos/glacier-point.jpg', caption: 'Half Dome at eye level from the Glacier Point wall.' }],
    swap:
      'If parking is hopeless, the Four-Mile Trail goes from Glacier Point down to the valley floor (4.8 miles, 3,200 ft loss). Park one car at the bottom, drive the other up. Knees take the hit, not your patience.',
  },
  {
    id: 'mariposa-grove',
    title: 'Mariposa Grove of Giant Sequoias',
    region: 'glacier-mariposa',
    order: 6,
    kind: 'trailhead',
    coord: [-119.6320, 37.5085], // TODO: verify on the ground — Welcome Plaza lot, Hwy 41 at the South Entrance, derived ±150 m (2026-07 web pass; prior pin was inside the grove at parking closed to cars since 2018)
    elevationFt: 5600,
    timeBudgetMin: 180,
    teaser:
      'Park at the Welcome Plaza, ride the free shuttle up, and walk the two-mile Grizzly Giant Loop among the largest trees on earth. Late afternoon empties the grove.',
    body:
      'You park at the Welcome Plaza and ride the free shuttle two miles up to the grove. Walk the Grizzly Giant Loop (2 miles, 300 ft of gain) — past the Fallen Monarch, the Bachelor and Three Graces, the Grizzly Giant itself (around 2,700 years old). Don\'t skip the California Tunnel Tree just past Grizzly Giant. The shuttle runs every 15 minutes from April through November; first run at 8 a.m., and in summer the last ride up is around 7 p.m., with a final bus down at 8. Late afternoon turns the canopy gold and the grove empties out. These trees are not redwoods. They\'re the largest trees on earth by volume, and they only grow in this strip of the Sierra.\n\n' +
      'Those black fire scars on the big trunks aren\'t damage, they\'re a health record. A mature sequoia\'s bark runs up to two feet thick, fibrous and rich in tannin, so it barely conducts heat: a ground fire chars the surface, and the char itself insulates the living wood while the thinner-barked white fir and incense cedar nearby die. The tree needs those fires. Its seeds are no bigger than an oat seed and require the bare, ash-enriched mineral soil and sunlight a burn opens up. After a century and a half of suppression left the groves crowded and declining, the park now sets careful low-intensity burns in Mariposa to do what fire always did here.',
    swap:
      'If you have stamina, the Guardians Loop (6.5 miles, 1,200 ft) takes you up to the upper grove. Most visitors don\'t make it that far, which is the point.',
    photos: [{ src: '/photos/mariposa-grove.jpg' }],
  },

  {
    id: 'wawona-hotel-history-center',
    title: 'Wawona, the hotel and the history center',
    region: 'glacier-mariposa',
    order: 7,
    kind: 'viewpoint',
    coord: [-119.6560, 37.5366], // web-derived: Wawona Hotel front, Hwy 41 (Pioneer History Center is a 5-min walk north); TODO: verify on the ground
    elevationFt: 4000,
    timeBudgetMin: 90,
    teaser:
      'The 1876 hotel\'s white verandas, the Wawona covered bridge, and the Pioneer Yosemite History Center\'s relocated cabins and coaches. The easy add to a Mariposa Grove day.',
    body:
      'Wawona is what the park looked like when getting here was the achievement. The Wawona Hotel opened in 1876 as the stagecoach stop between the railhead and the valley, and it is still operating: white Victorian buildings around a lawn, wicker chairs on the wide verandas, a national historic landmark that never stopped being a hotel. The porch is open to anyone. Order a drink from the lobby bar, take a chair, and look across the road at the 1918 nine-hole golf course, one of the odder sentences in any national park. The small building beside the hotel was the studio of Thomas Hill, whose enormous paintings of this landscape helped argue it into protection; in season it serves as the Wawona visitor center.\n\n' +
      'Five minutes north on foot, the Pioneer Yosemite History Center gathers buildings from the park\'s first decades, moved here when roads and time displaced them: a Wells Fargo office, homestead cabins, a jail, and a barn full of the actual stagecoaches that ran the road you drove in on. You enter across the Wawona covered bridge, built by Galen Clark in 1868 and roofed a decade later, which nearly every valley-bound visitor crossed for half a century. In summer there are costumed interpreters and short stage rides; the rest of the year the buildings are closed up but the walk among them is open, and the South Fork of the Merced runs quietly past it all.\n\n' +
      'It pairs naturally with the [Mariposa Grove](/stop/mariposa-grove), ten minutes south, and with [Chilnualna Falls](/stop/chilnualna-falls) and the [meadow loop](/stop/wawona-meadow-loop) for a full Wawona day that never touches the valley. The hotel dining room takes lunch walk-ins far more easily than dinner.',
    photos: [], // TODO: needs dedicated photography — no editorial image matches the Wawona Hotel or the covered bridge
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
    category: 'trails',
    difficulty: 'moderate',
    coord: [-119.6282, 37.6705], // verified 2026-07: Dewey Point access is the McGurk Meadow lot since the 2022 repave (same pin as mcgurk-meadow); was ~1 km off
    elevationFt: 7300,
    timeBudgetMin: 420,
    photos: [{ src: '/photos/crocker-stanford-points.jpg' }],
    hazard:
      'The rim at all three points is bare, unrailed granite over a vertical drop. The safe seat is a body length back from the edge; the view is the same.',
    teaser:
      'The Pohono Trail past Dewey Point, where the traffic drops to nobody: 9 to 10.5 miles round trip for the west valley from above, Bridalveil straight over its rim.',
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
    category: 'trails',
    difficulty: 'easy',
    season: 'June to August',
    coord: [-119.6282, 37.6705], // verified 2026-07: McGurk Meadow trailhead lot, Glacier Point Rd mile 7.5 (NPS/Trailforks); was ~1.1 km off
    elevationFt: 7000,
    timeBudgetMin: 100,
    photos: [{ src: '/photos/mcgurk-meadow.jpg' }],
    teaser:
      'An easy 3.7 miles round trip to a pocket meadow with one of the park\'s best wildflower shows and an 1890s sheepherder\'s cabin at the door.',
    body:
      'A pocket meadow a mile off Glacier Point Road that runs one of the best wildflower shows in the park: shooting star and camas early, then paintbrush, corn lily, and lupine in waves as the season moves through July. The walk is about 3.7 miles round trip at an easy grade, ninety minutes of walking plus however long the flowers hold you.\n\nJust before the meadow the trail passes a one-room log cabin, low enough that you duck through the door. It belonged to John McGurk, who summered sheep here in the 1890s until the new park pushed the flocks out. The cabin is the right place to say the quiet part: this meadow looks wild, and it is also a place people worked.\n\nThe trailhead is a signed pullout on Glacier Point Road. Go early or late in the day; the light is better and the deer come out to the meadow edges. The same trail continues past the meadow to join the Pohono Trail toward [Dewey, Crocker, and Stanford Points](/stop/crocker-stanford-points) for anyone assembling a bigger day.\n\nThe meadow is not dramatic. There is no granite wall, no waterfall, no view that fits a phone screen. It is gentle, and after two days of the valley\'s scale that is precisely the correction.',
  },
  {
    id: 'bridalveil-creek-trail',
    title: 'Bridalveil Creek, the trail nobody goes to',
    region: 'glacier-mariposa',
    order: 103,
    kind: 'trailhead',
    collection: 'hidden',
    category: 'trails',
    difficulty: 'easy',
    coord: [-119.6202, 37.6600], // TODO: verify on the ground — pin on the campground access road matches the body; no source pins a specific pullout (2026-07 web pass)
    elevationFt: 7000,
    timeBudgetMin: 150,
    photos: [{ src: '/photos/bridalveil-creek-trail.jpg' }],
    teaser:
      'A flat walk in lodgepole woods along the creek that later goes over the rim as Bridalveil Fall, and statistically nobody on any of it. The trail for the tired day.',
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
    category: 'trails',
    difficulty: 'strenuous',
    season: 'July to September',
    coord: [-119.6039, 37.6668], // verified 2026-07: Ostrander Lake trailhead, Glacier Point Rd mile 9 (Hiking Project/Modern Hiker); was ~1.7 km off
    elevationFt: 7000,
    timeBudgetMin: 420,
    photos: [], // TODO: photo removed — automated fetch grabbed wrong subject; needs a correct image
    teaser:
      'Twelve miles round trip to a granite-shored lake under Horse Ridge, past the 1941 ski hut. Gentle first half, 1,600 feet of climbing in the second. A full quiet day.',
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
    category: 'trails',
    difficulty: 'easy',
    coord: [-119.6567, 37.5359], // TODO: verify on the ground — loop start across Hwy 41 from the Wawona Hotel, derived ±75 m (2026-07 web pass; prior pin was at the hotel itself)
    elevationFt: 4000,
    timeBudgetMin: 120,
    photos: [{ src: '/photos/wawona-meadow-loop.jpg' }],
    teaser:
      'A flat 3.5-mile loop across from the Wawona Hotel, one of the least-visited maintained trails in the park. It is not dramatic. That is the point.',
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
    category: 'trails',
    difficulty: 'strenuous',
    coord: [-119.6337, 37.5484], // verified 2026-07: Chilnualna Falls trailhead lot, end of Chilnualna Falls Rd (NPS/Hikespeak); was ~130 m off
    elevationFt: 4200,
    timeBudgetMin: 360,
    photos: [], // TODO: photo removed — automated fetch grabbed wrong subject; needs a correct image
    hazard:
      'The granite beside the cascades is water-polished and slick, and the current above the drops is faster than it looks. People have died sliding here. Watch the falls from the trail, not from the rocks beside the water.',
    teaser:
      'Five major cascades and 8.4 miles round trip out of Wawona, practically deserted while the Mist Trail shuffles. The lower gorge pays off within half an hour.',
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
    coord: [-119.7966, 37.7527], // verified 2026-07: Crane Flat gas station at the Big Oak Flat Rd / Tioga Rd junction (iOverlander + OuterSpatial agree within 60 m); prior pin was ~580 m NW at the meadow point
    timeBudgetMin: 120,
    teaser:
      '47 miles from Crane Flat to Tioga Pass at 9,945 feet, fir forest opening into granite domes and meadows. Gas up at Crane Flat; there is none on the road.',
    body:
      '47 miles from Crane Flat to Tioga Pass (9,945 ft). Gas up at Crane Flat — there is no gas on Tioga Road itself. The road climbs through fir forest, then lodgepole pine, then opens into granite domes and meadows. Tioga is closed November through May (sometimes longer). When it opens — late May or early June in 2026 — the first two weeks are extraordinary: snowmelt, no crowds, hardly anyone on the road yet.\n\n' +
      'The road itself is the artifact. This is the line of the Great Sierra Wagon Road, scraped over the crest in 1883 to serve a silver mine that failed almost immediately, then bought for the public and finally rebuilt into the modern highway in 1961. A few original stretches survive as spur roads, including the one to [May Lake](/stop/may-lake). Driving east you climb through every forest belt in the Sierra in ninety minutes, and the trees thin out just as the granite takes over, which is the high country announcing itself.\n\n' +
      'The rhythm of the day, west to east: [Crane Flat](/stop/crane-flat-meadow) for gas and the bear meadow, [White Wolf](/stop/white-wolf) for the leg stretch, [Olmsted Point](/stop/olmsted-point) for the reveal, [Tenaya Lake](/stop/tenaya-lake) for lunch, the meadows for the afternoon, and [Tioga Pass](/stop/gaylor-lake) only if the day still has legs. Driven straight through it is under two hours. Driven properly it is the whole day, and the best road day in California.',
    photos: [{ src: '/photos/tioga-road-drive.jpg', caption: 'Tuolumne Meadows, the high-country payoff.' }],
  },
  {
    id: 'crane-flat-meadow',
    title: 'Crane Flat, the bear meadow at the junction',
    region: 'tuolumne',
    order: 2,
    kind: 'viewpoint',
    coord: [-119.8015, 37.7566], // web-derived: Crane Flat meadow point ~580 m NW of the gas-station wye (the point the old tioga-road-drive pin sat on; GNIS-scale accuracy); TODO: verify on the ground — confirm the signed shoulder pullout at the meadow edge on Big Oak Flat Rd
    elevationFt: 6192,
    timeBudgetMin: 30,
    photos: [], // TODO: needs dedicated photography — no editorial image matches the Crane Flat meadow
    teaser:
      'The big meadow at the Tioga Road junction is one of the most consistent places in the park to see a black bear. Pull over, stay at the edge, and scan the far tree line at dawn or dusk.',
    body:
      'Everyone stops at Crane Flat for gas and almost nobody looks past the pumps, which is the mistake. Across the junction where Tioga Road leaves Big Oak Flat Road lies a broad subalpine meadow at 6,200 feet, ringed by fir forest, and it is one of the most consistent bear-viewing areas in Yosemite. Black bears come onto the open grass to graze in spring and early summer and work the forest edge for grubs and berries through the season, mostly in the first and last hours of light.\n\nThe viewing is easy and it should stay that way: park in a legal pullout, stand at the meadow edge or beside the car, and glass the far tree line. Keep at least 150 feet, never walk into the meadow toward a bear, and if the bear stops feeding to look at you, you are too close. Binoculars are the difference between a dark dot and a bear.\n\nEven without a bear, the stop earns its half hour. The meadow runs wildflowers into July, the [Tuolumne Grove sequoias](/stop/tuolumne-grove-old-road) start half a mile east, and this is the last gas before Tioga Pass. The full bear-watching playbook is in [Where to actually see a bear](/essentials/bear-viewing).',
    swap:
      'No bear on your pass through? Come back at dawn, when the meadow is frosted and empty of people, or fold it into the Tioga Road drive on the way out. Midday odds are poor; the bears are bedded in the forest.',
  },
  {
    id: 'white-wolf',
    title: 'White Wolf, the quiet middle of Tioga Road',
    region: 'tuolumne',
    order: 3,
    kind: 'trailhead',
    season: 'Tioga Road season',
    coord: [-119.6486, 37.8697], // web-derived: White Wolf road-end (same pin as the harden-lake hike); TODO: verify on the ground
    elevationFt: 8000,
    timeBudgetMin: 90,
    teaser:
      'A lodgepole meadow at 8,000 feet, a 1920s camp, and two of the gentlest lake walks in the high country. The stop everyone drives past between Crane Flat and Olmsted Point.',
    body:
      'Tioga Road runs a long forested half hour east of Crane Flat before the famous stops begin, and almost everyone drives it straight through. White Wolf is the reason not to. A short spur drops north off the highway to a meadow at 8,000 feet ringed by lodgepole pine, with a camp of white tent cabins that has served Tioga travelers since the 1920s, a small campground, and the kind of quiet the Tuolumne core has already lost by mid-morning. The lodge\'s operating seasons have been irregular in recent years, so treat any meal or cabin plan as a bonus to confirm, not a schedule; the meadow, the trailheads, and the stillness are the reliable draw.\n\n' +
      'Two easy walks start here or nearby, and they are the gentlest introduction the high country offers. Harden Lake is 5.6 miles round trip on nearly flat old roadbed from the White Wolf road-end: a warm, shallow lake that is genuinely pleasant swimming by August, which almost nothing else up here is. Lukens Lake, from a signed trailhead two miles east on Tioga Road, is a 1.6-mile round-trip hop over a forested rise to a shallow lake edged by one of the best July wildflower meadows in the park. Neither has a switchback worth the name.\n\n' +
      'Deer work the meadow edges at dusk. Time White Wolf as the leg stretch on the drive east, or spend a first high-country night at the campground and let your lungs meet the altitude before the bigger Tuolumne days.',
    photos: [], // TODO: needs dedicated photography — no editorial image matches the White Wolf meadow
  },
  {
    id: 'olmsted-point',
    title: 'Olmsted Point',
    region: 'tuolumne',
    order: 4,
    kind: 'viewpoint',
    coord: [-119.4852, 37.8107], // verified 2026-07: Olmsted Point pullout, south side of Tioga Rd (GNIS/Wikipedia); was ~300 m off
    elevationFt: 8300,
    timeBudgetMin: 30,
    teaser:
      'A short walk from the lot to a granite slab strewn with glacial erratics, Clouds Rest dead ahead and Half Dome over its shoulder, from the back side.',
    body:
      'A short walk from the parking lot to a granite slab pocked with glacial erratics — boulders left here when the ice melted. Cloud\'s Rest dominates the view; Half Dome is visible over its left shoulder, from the back side. This is the geologically literate version of Tunnel View: same valley, viewed from where the glacier stood.\n\n' +
      'Look at Clouds Rest properly before you leave the rail: 4,500 feet of bare granite that reads at this distance as a single breaking wave, the largest continuous rock face in the park, and most people photograph Half Dome past it without ever seeing it. Then take the quarter-mile trail from the lot down to the point itself. Almost nobody does. The angle improves, the crowd disappears entirely, and the erratics out on the open slab, some the size of cars, sit exactly where the ice set them down and left.\n\n' +
      'If you are driving back west at the end of a Tuolumne day, stop again. Late sun rakes across the granite, every boulder throws a shadow, and Half Dome goes gold at a distance that makes the valley versions of the view feel crowded.',
    photos: [{ src: '/photos/olmsted-point.jpg', caption: 'Half Dome from the high country side.' }],
  },
  {
    id: 'may-lake',
    title: 'May Lake, the moderate hike that earns the high country',
    region: 'tuolumne',
    order: 5,
    kind: 'trailhead',
    coord: [-119.4912341, 37.8324607], // verified 2026-07: May Lake TH lot, end of the Old Tioga Rd spur (Hikespeak)
    elevationFt: 9329,
    timeBudgetMin: 180,
    photos: [{ src: '/photos/may-lake.jpg', caption: 'The high-country granite and meadow landscape around May Lake.' }],
    teaser:
      '1.2 well-graded miles each way to a lake at 9,329 feet under Mount Hoffmann. Cold but swimmable on a warm afternoon; the best moderate hike in the high country.',
    body:
      'The best moderate hike in the high country. Turn north off Tioga Road onto the Old Tioga Road spur (between Olmsted Point and Tenaya Lake) and follow it 1.7 miles to the trailhead parking. The hike itself is 1.2 miles each way with about 500 feet of gain on a well-graded trail through lodgepole pine and over open granite. The grade is steady but not steep, which makes it the right pick for pushing kids past the point where a flat walk would have ended. Most families do it.\n\nMay Lake sits at 9,329 ft with Mount Hoffmann (the geographic center of the park) rising directly above the north shore. The water is cold but swimmable on a warm afternoon, and the granite slabs on the east side are the place to do it. Bring a towel and lunch. Stronger hikers can push another 2 miles and 1,500 ft to the summit of Hoffmann (10,850 ft) for a 360-degree view of the park.',
    swap:
      'The trailhead spur road is rough dirt, passable in any car taken slowly, but it rattles. If the parking lot is full (it holds maybe twenty cars), there is no overflow; come back early next morning or skip to Tenaya Lake. The lake holds snow into late June some years; check conditions before late-spring trips.',
  },
  {
    id: 'tenaya-lake',
    title: 'Tenaya Lake',
    region: 'tuolumne',
    order: 6,
    kind: 'viewpoint',
    coord: [-119.45188, 37.83795], // verified 2026-07: Tenaya Lake Picnic Area lot at the NE corner (NPS POI via OuterSpatial); prior pin sat ~400 m ENE past the end of the lake
    elevationFt: 8150,
    timeBudgetMin: 60,
    photos: [{ src: '/photos/tenaya-lake.jpg', caption: 'Open granite and clear high-country water at Tenaya Lake.' }],
    teaser:
      'Granite cliffs, lodgepole shore, and the east beach for lunch on the rocks. The water stays around 55 to 60 degrees even in August; short swims only.',
    body:
      'The east beach is the spot. Granite cliffs on the south side, lodgepole forest on the north, Polly Dome rising at the west end. The water is 55–60°F even in August — short swims only. In late May the lake is often still partly iced over; by July it\'s sun-warmed at the edges. Stop here for lunch on the rocks.\n\n' +
      'The name carries the park\'s hardest history, and it belongs in the lunch conversation. The lake is named for Tenaya, the Ahwahnechee chief whose people were driven from the valley by the Mariposa Battalion in 1851 and pursued into this high country. His people already had a name for it: Pywiack, lake of the shining rocks, for the glacier-polished granite that still flashes along the south shore. Both names are true. Knowing the second changes how the first one sounds.\n\n' +
      'If the lunch hour turns into an afternoon, a mostly flat loop circles the lake in about 2.5 miles, sand and slabs and boardwalk, with the south shore walking directly beneath the polished cliffs. Paddlers carry in boards and kayaks for the morning glass; by early afternoon the wind is up and the lake belongs to whitecaps, which is your cue to drive on to the meadows.',
  },
  {
    id: 'cathedral-lakes',
    title: 'Cathedral Lakes',
    region: 'tuolumne',
    order: 7,
    kind: 'trailhead',
    photos: [{ src: '/photos/cathedral-lakes.jpg', caption: 'Tuolumne high country — the landscape Cathedral Lakes sits in.' }],
    coord: [-119.374706, 37.872634], // verified 2026-07: Cathedral Lakes Trailhead parking at the Tuolumne Meadows Visitor Center (NPS TH data; VC at 37.8716,-119.3742 per Wikidata); prior pin sat ~1.4 km east at the store/campground
    elevationFt: 8560,
    timeBudgetMin: 360,
    teaser:
      'Nine miles round trip from the relocated Tuolumne Meadows trailhead to a lake at 9,288 feet with Cathedral Peak rising straight out of the water.',
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
    order: 8,
    kind: 'trailhead',
    coord: [-119.3512, 37.8776], // verified 2026-07: Lembert Dome lot, Tioga Rd (NPS TH page); was ~675 m off
    elevationFt: 8600,
    timeBudgetMin: 90,
    teaser:
      'An easy 1.5 miles from the Lembert Dome lot to a naturally carbonated spring and the 1915 Parsons Lodge. End the high-country day here.',
    body:
      'A 1.5-mile round trip from the Lembert Dome parking lot. Soda Springs is a naturally carbonated spring bubbling up out of the meadow — taste it if you want, it\'s safe (a little metallic). Parsons Lodge is a 1915 stone Sierra Club building, staffed daily in high summer with an open reading room, typically 10 to 4 once Tioga Road opens; the current Yosemite Guide has the season dates. End the high-country day here. Drive back to the valley in twilight; the Tioga Road in low light is a memory you keep.',
    photos: [{ src: '/photos/tuolumne-meadows.jpg', caption: 'Tuolumne Meadows from the Soda Springs walk.' }],
  },
  {
    id: 'tuolumne-meadows-grill',
    title: 'The Tuolumne Meadows Grill, lunch at 8,600 feet',
    region: 'tuolumne',
    order: 9,
    kind: 'meal',
    season: 'Tioga Road season',
    coord: [-119.3590, 37.8741], // web-derived: Tuolumne Meadows Store / Grill complex, Tioga Rd east of the visitor center; TODO: verify on the ground
    elevationFt: 8600,
    timeBudgetMin: 45,
    teaser:
      'Burgers and soft serve from a canvas-sided building full of Pacific Crest Trail hikers three weeks from anywhere. Order at the window, eat at a picnic table, watch the meadow.',
    body:
      'The menu is burgers, breakfast sandwiches, chili, and soft-serve cones, cooked on a griddle in a canvas-sided building beside the Tuolumne Meadows Store. Nobody drives to the high country for the food. You eat here for the room: the picnic tables collect Pacific Crest Trail and John Muir Trail hikers three weeks from anywhere, day hikers down off Cathedral, climbers, and rangers, and the conversation is the best in the park. A thru-hiker eating a double cheeseburger and a pint of ice cream at eleven in the morning is not a spectacle; it is arithmetic, and they will cheerfully walk you through it.\n\n' +
      'The store next door is a real outfitter in miniature: fuel canisters, actual groceries, the only supplies in the high country, plus a seasonal post office where thru-hikers collect resupply boxes addressed months earlier. The whole complex lives in tents and trailers that are struck every fall and rebuilt when Tioga Road opens, so hours are seasonal and the entire place simply does not exist in winter. If the line at the window is long, read it as the grill operating exactly as intended.',
    photos: [], // TODO: needs dedicated photography — no editorial image matches the grill and store tents
  },
  {
    id: 'gaylor-lake',
    title: 'Gaylor Lake, the short, steep payoff at Tioga Pass',
    region: 'tuolumne',
    order: 10,
    kind: 'trailhead',
    coord: [-119.258173, 37.9101685], // verified 2026-07: Gaylor Lakes TH lot at the Tioga Pass entrance (NPS/Wikiloc)
    elevationFt: 9945,
    timeBudgetMin: 150,
    photos: [{ src: '/photos/gaylor-lake.jpg', caption: 'High-country terrain near Tioga Pass and the Gaylor Lakes basin.' }],
    teaser:
      'One steep mile from the Tioga Pass entrance station to a 10,500-foot ridge, then down into the Gaylor Lakes basin. The reward is out of proportion to the distance.',
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
    category: 'trails',
    difficulty: 'moderate',
    season: 'June to October',
    coord: [-119.5477, 37.8106], // TODO: verify on the ground — prose sources put the Porcupine Creek TH lot here (south side of Tioga Rd) but no published lot coord (2026-07 web pass)
    elevationFt: 8100,
    timeBudgetMin: 360,
    photos: [{ src: '/photos/north-dome-indian-rock.jpg' }],
    teaser:
      'Nine miles round trip to the only summit that hands you Half Dome\'s full face at eye level, with a twenty-minute detour to Yosemite\'s only natural granite arch.',
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
    category: 'trails',
    difficulty: 'strenuous',
    season: 'June to October',
    coord: [-119.4700, 37.8256], // verified 2026-07: Sunrise Lakes TH lot, SW end of Tenaya Lake (NPS; matches road-distance geometry from Olmsted Point)
    elevationFt: 8150,
    timeBudgetMin: 480,
    photos: [{ src: '/photos/clouds-rest-tenaya.jpg' }],
    hazard:
      'The summit ridge is narrow with long drops on both sides and is no place in wind, storm, or lightning. Afternoon thunderheads build fast here in July and August; plan to be off the ridge by early afternoon.',
    teaser:
      'A thousand feet higher than Half Dome, no permit lottery, no cables, a fraction of the company, and Half Dome itself in the summit view. Fourteen miles round trip.',
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
    category: 'trails',
    difficulty: 'easy',
    season: 'July to September',
    coord: [-119.3390, 37.8783], // verified 2026-07: Dog Lake lot, Tuolumne Meadows Lodge Rd (NPS Lyell Canyon TH page); was ~600 m off, in the meadow
    elevationFt: 8700,
    timeBudgetMin: 240,
    photos: [{ src: '/photos/lyell-canyon.jpg' }],
    hazard:
      'Afternoon thunderstorms are routine in high summer and the canyon floor is open meadow. Check the sky at lunch and be walking back before the anvils build.',
    teaser:
      'Eight nearly dead-flat miles of the John Muir Trail beside the Lyell Fork: green pools, gravel meanders, no destination needed. Turn around whenever you like.',
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
    category: 'trails',
    difficulty: 'moderate',
    season: 'July to September',
    coord: [-119.2627, 37.8909], // verified 2026-07: Mono Pass TH lot at Dana Meadows (yosemitehikes/Trailforks); was ~165 m off
    elevationFt: 9700,
    timeBudgetMin: 300,
    photos: [{ src: '/photos/mono-pass-meadows.jpg' }],
    hazard:
      'The trailhead sits near 9,700 feet and the pass above 10,600. Flatlanders feel it. Pace the first mile, drink more than usual, and turn around if a headache builds.',
    teaser:
      'Four gentle miles to the 10,600-foot gap where obsidian once moved west and acorns east, with Mono Lake pale beyond and 1880s mining cabins near the pass.',
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
    category: 'trails',
    difficulty: 'strenuous',
    season: 'June to October',
    coord: [-119.7366, 37.7521], // verified 2026-07: Tamarack Flat Campground road-end (latitude.to/CampingRoadTrip); was ~1.2 km up the spur road
    elevationFt: 6300,
    timeBudgetMin: 600,
    photos: [{ src: '/photos/el-capitan-summit-tamarack.jpg' }],
    hazard:
      'A very long day with no reliable water after early season; carry four liters. The summit rolls toward the face with no railing and no warning, and gusts on the rim are real. Stay well back from the edge.',
    teaser:
      'Stand on top of El Capitan without touching a rope: sixteen-plus miles round trip from Tamarack Flat, ten to twelve hours, and almost no one attempts it.',
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
    coord: [-119.87518, 37.81508], // verified 2026-07: Evergreen Rd / Hwy 120 junction at road-topology node (OSM/Overture 2026-06, agent verification); moved ~350 m north from prior pin
    timeBudgetMin: 90,
    photos: [{ src: '/photos/evergreen-road-drive.jpg' }],
    teaser:
      'Hetch Hetchy\'s own front door: 16 slow miles from Highway 120 to the dam, gated roughly sunrise to sunset, 25-foot vehicle limit. Budget the whole day out here.',
    body:
      'Hetch Hetchy has its own front door. Just outside the Big Oak Flat entrance, Evergreen Road leaves Highway 120 and runs north through forest and the old summer-camp community of Camp Mather; at Mather you pick up Hetch Hetchy Road, pass the park entrance station, and wind down to the O\'Shaughnessy Dam. Call it 16 miles from the highway, most of it slow. The last several miles are hairpins with steep drops. Don\'t speed. Don\'t pass.\n\n' +
      'Two rules catch people. The road is gated, open roughly sunrise to sunset with the exact hours posted at the entrance station, so a sunset-at-the-dam plan ends at a closed gate. And there\'s a 25-foot vehicle length limit: large RVs and trailers don\'t go.\n\n' +
      'The drive is part of the trip, not the tax on it. You cross the 2013 Rim Fire\'s burn country in visible recovery along Evergreen Road, then the road tips into the Tuolumne watershed and the reservoir appears below, granite walls rising straight out of the water. From Yosemite Valley you\'re looking at roughly an hour and forty-five minutes each way, which is why Hetch Hetchy works as a full day and fails as a half-day add-on. Budget the whole day and it repays you: on a July Saturday when the Valley is bumper to bumper, you can see fewer than a hundred people out here.',
  },
  {
    id: 'carlon-falls',
    title: 'Carlon Falls, the river walk on Evergreen Road',
    region: 'hetch-hetchy',
    order: 2,
    kind: 'trailhead',
    difficulty: 'easy',
    coord: [-119.859, 37.8125], // web-derived: Carlon day-use bridge on Evergreen Rd (same pin as the carlon-falls hike); TODO: verify on the ground
    elevationFt: 4400,
    timeBudgetMin: 150,
    hazard:
      'The granite beside the fall is water-polished and slick, and spring current is stronger than it looks. Swim the base pool in summer low flow only.',
    teaser:
      'An easy, nearly flat river walk up the South Fork Tuolumne to a broad year-round fall with a swimming hole at its base. The corridor\'s family stop, a mile up Evergreen Road.',
    body:
      'A mile up Evergreen Road from Highway 120, the road crosses the South Fork of the Tuolumne at the Carlon day-use area, once the site of the Carl Inn, a resort that fed and housed Yosemite travelers from 1916 into the 1930s. The trail leaves the north side of the bridge and follows the river upstream into the park: about 3.8 miles round trip, nearly flat, under big ponderosa and incense cedar the whole way, with the river alternating green pools and low cascades beside you. As waterfall walks in this park go, it is the gentlest honest one there is.\n\n' +
      'Carlon Falls itself is a broad curtain of whitewater over a granite ledge, and unlike the famous valley falls it runs all year. The deep pool at its base is one of the better swimming holes on this side of the park by midsummer. Spring turns the fall loud and the pool off limits; August turns the whole outing into a swim with a walk attached. Pick your lunch rock with attention; the polished granite near the water earns its caution note.\n\n' +
      'The trailhead sits outside the park entrance station, so it costs no gate time in either direction. Do it as the opener to the [Hetch Hetchy day](/stop/evergreen-road-drive) if the forecast is hot, or as the closer on the way out, when the river is the correct answer to the afternoon.',
    photos: [], // TODO: needs dedicated photography — no editorial image matches Carlon Falls
  },
  {
    id: 'lookout-point',
    title: 'Lookout Point, the whole valley in one look',
    region: 'hetch-hetchy',
    order: 3,
    kind: 'viewpoint',
    coord: [-119.8414, 37.8933], // verified 2026-07: trailhead at the Mather entrance station (GNIS + LOC HAER survey); was ~2 km SE
    elevationFt: 4200,
    timeBudgetMin: 90,
    photos: [{ src: '/photos/lookout-point.jpg' }],
    teaser:
      'Two miles round trip to a bare granite knob above the entrance station: the reservoir, Kolana Rock, and both falls in one frame. April and May are the season.',
    body:
      'The short hike almost everyone drives past. The trail leaves from near the Hetch Hetchy entrance station at Mather and climbs gently through pine and recovering burn to a bare granite knob, about 2 miles round trip. From the top you get the overview the dam walk can\'t give you: the reservoir laid out below, Kolana Rock on the south wall, and in spring both Wapama and Tueeulala Falls streaking the north wall, the whole valley in a single frame.\n\n' +
      'April and May are the season. The falls are at full volume and the slopes around the knob put on one of the better wildflower shows at this elevation in the park. Do it as the opener to a Hetch Hetchy day, before the dam and the Wapama walk, and everything you see for the rest of the day sits somewhere on this view. An hour to ninety minutes, done.',
  },
  {
    id: 'oshaughnessy-dam',
    title: 'O\'Shaughnessy Dam, the walk across the argument',
    region: 'hetch-hetchy',
    order: 4,
    kind: 'viewpoint',
    coord: [-119.7886, 37.9464], // verified 2026-07: dam road-end lot, SW abutment (bracketed by the Wikipedia dam-crest and NPS trailhead points)
    elevationFt: 3800,
    timeBudgetMin: 45,
    photos: [], // TODO: photo removed — automated fetch grabbed wrong subject; needs a correct image
    teaser:
      'Walk a quarter mile across the 1923 dam to a tunnel hand-cut through the cliff, Kolana Rock and Wapama Falls up-canyon. Muir\'s valley floor is still down there.',
    body:
      'Park at the end of the road and walk out onto the dam. It\'s a quarter mile across, flat and paved, one of the few ways to stand inside a Sierra granite valley without hiking, and it ends in a tunnel hand-cut through the cliff at the far side. From the middle, look east: the reservoir running up-canyon, Kolana Rock standing off the south wall like Cathedral Rocks moved thirty miles north, Wapama Falls dropping over 1,000 feet down the north wall. The dam went up in 1923 and was raised in 1938; the seam between the two construction phases is visible from the upstream side, and interpretive signs at the eastern end tell the rest.\n\n' +
      'The history, stated plainly: this valley was inside a national park when San Francisco applied to flood it. John Muir fought the dam from roughly 1908 to 1913, lost when the Raker Act passed Congress, and died in 1914. The reservoir now holds 117 billion gallons and supplies drinking water to about 2.7 million people in the Bay Area. Both of those facts are true at once, and standing on the dam is the best place in California to hold them together.\n\n' +
      'The valley floor Muir walked is 200 to 350 feet under the surface, depending on the year. It wasn\'t removed; it\'s preserved down there, and the granite, the falls, and the eagles above the waterline are still doing the work of being themselves. Stand here a moment on your way out and look east. That\'s the trip.',
  },
  {
    id: 'wapama-falls-trail',
    title: 'Wapama Falls, five miles to the spray',
    region: 'hetch-hetchy',
    order: 5,
    kind: 'trailhead',
    coord: [-119.7875, 37.9465], // verified 2026-07: Wapama/Rancheria trailhead at the dam road-end (NPS place page; same pin as rancheria-falls); was ~340 m off
    elevationFt: 3800,
    timeBudgetMin: 300,
    photos: [{ src: '/photos/wapama-falls-trail.jpg' }],
    teaser:
      'Five rolling miles along the north shore to the footbridges under a 1,000-foot fall. Spring is the show; in peak snowmelt the bridges can close.',
    body:
      'The standard Hetch Hetchy day, and one of the best waterfall hikes in the park that almost nobody does. Cross the dam, pass through the tunnel, and follow the north shore east: about 5 miles round trip with roughly 700 feet of cumulative gain, rolling terrain rather than one climb. In May and June you pass under Tueeulala Falls first, a wispy spring-only fall that\'s gone by July most years, then reach the footbridges at the base of Wapama, where the fall drops over 1,000 feet and the spray in high water soaks everything on the bridges.\n\n' +
      'That spray is the honest caveat. In peak snowmelt the terminal bridges are sometimes closed for safety, and they have been swept out by debris in flood years. Check the NPS conditions page before a May or June visit. Two more honest notes: this is rattlesnake country, so watch your feet in the rocks, and poison oak grows close to the trail in places, so know what it looks like and wear long pants if you\'re unsure.\n\n' +
      'The trail is open year-round because the elevation is low, which cuts both ways: this is one of the few real hikes in the park you can do in February, and it\'s an exposed, 90-degree grind on an August afternoon. Spring is the show. Plan four to five hours including lunch at the base of the falls, carry more water than feels necessary, and bring sun protection; long sections have no shade.',
    swap:
      'If the Wapama bridges are closed in high water, don\'t force it. Walk the dam and tunnel for the up-close granite, then drive back to the entrance station and hike Lookout Point instead: 2 miles round trip to a knob that gives you both falls from a safe distance.',
  },

  {
    id: 'evergreen-lodge',
    title: 'The Evergreen Lodge, the meal on the way out',
    region: 'hetch-hetchy',
    order: 6,
    kind: 'meal',
    coord: [-119.8530, 37.8680], // TODO: verify on the ground — web-derived, Evergreen Rd roughly a mile south of Camp Mather; pin is road-adjacent but unconfirmed
    elevationFt: 4600,
    timeBudgetMin: 75,
    teaser:
      'A 1921 lodge in the pines a mile before Camp Mather: tavern, restaurant, general store, and the only reliable food and drink on the Hetch Hetchy corridor.',
    body:
      'There is no food service at Hetch Hetchy. No snack bar at the dam, nothing at the entrance station, and the drive back to Highway 120 is slow. The Evergreen Lodge is therefore not a discovery; it is logistics, and good logistics at that. Built in 1921 alongside the dam works, it sits in the pines on Evergreen Road about a mile before Camp Mather: a tavern with a deck, a proper restaurant, cabins under the trees, and a general store good for sandwiches, coffee, ice, and forgotten sunscreen.\n\n' +
      'The move is timing. Coffee and a breakfast sandwich on the drive in, before the gate; then the burger and a beer on the deck after the [Wapama miles](/stop/wapama-falls-trail), before the hairpins back to the highway. Hours run seasonal and shorten outside summer, so check ahead before counting on dinner. As roadhouses at the end of a big day go, this one has a century of practice.',
    photos: [], // TODO: needs dedicated photography — no editorial image matches the Evergreen Lodge
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
    category: 'trails',
    difficulty: 'easy',
    coord: [-119.8461, 37.7566], // verified 2026-07: Merced Grove trailhead lot, Big Oak Flat Rd (OSM/OuterSpatial); was on the grove itself, 1.5 trail-miles past parking
    elevationFt: 5400,
    timeBudgetMin: 150,
    photos: [{ src: '/photos/merced-grove.jpg' }],
    teaser:
      'The smallest and least-visited of Yosemite\'s three sequoia groves: three miles round trip to a couple dozen giants you stand alone with.',
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
    category: 'trails',
    difficulty: 'strenuous',
    coord: [-119.7875, 37.9465], // verified 2026-07: same trailhead as wapama-falls-trail (NPS place page)
    elevationFt: 3800,
    timeBudgetMin: 420,
    photos: [], // TODO: photo removed — automated fetch grabbed wrong subject; needs a correct image
    hazard:
      'Rattlesnake country the whole way, poison oak close to the trail, and long stretches of full sun. In peak snowmelt the Wapama bridges can close and end the trip early; check conditions before a May or June start.',
    teaser:
      'Thirteen miles round trip, past where the day-hikers turn around at Wapama, to cascades dropping more than a thousand feet through a narrow gorge.',
    body:
      'Wapama Falls is where the Hetch Hetchy day-hikers turn around. The trail keeps going, and so should you if you have the legs: past the Wapama bridges the shoreline path rolls east beneath granite domes toward Rancheria Falls, where Rancheria Creek comes down more than a thousand vertical feet in a chain of cascades and slides through a narrow gorge. Thirteen miles round trip from the dam, with steady rolling gain, and past Wapama you will likely have the water, the walls, and the canyon to yourselves. Only a small fraction of park visitors ever see Hetch Hetchy at all; a fraction of those get this far.\n\nThe country is the argument. The walls here stand comparison with the valley\'s, the reservoir gives them a mirror, and the emptiness does the rest. Beyond Rancheria the trail climbs toward Tiltill Valley and the vast northwest wilderness, which is a fact to enjoy from a lunch rock rather than a suggestion.\n\nStart early; the [gate hours](/stop/evergreen-road-drive) bracket your day at both ends. Spring is for water, fall for temperature, and a summer afternoon out here is a grind you schedule around, not through. Read the caution, carry more water than feels reasonable, and it is one of the great quiet days in the park.',
  },
  {
    id: 'poopenaut-valley',
    title: 'Poopenaut Valley, straight down to the wild Tuolumne',
    region: 'hetch-hetchy',
    order: 103,
    kind: 'trailhead',
    collection: 'hidden',
    category: 'trails',
    difficulty: 'strenuous',
    season: 'Spring and fall',
    coord: [-119.8037, 37.9182], // web-derived: signed pullout on Hetch Hetchy Rd, 3.9 mi past the entrance (same pin as the poopenaut-valley hike); TODO: verify on the ground
    elevationFt: 3600,
    timeBudgetMin: 210,
    hazard:
      'The climb out is relentless and largely shadeless, and it bakes by late morning; carry more water than three miles suggests. Rattlesnake country, and the river runs dam-released cold and fast. Stay out of the current.',
    teaser:
      'The park\'s steepest maintained trail: 1,300 feet down in 1.3 miles to the Tuolumne River below the dam, and the same 1,300 back up. Almost nobody goes. That is the offer.',
    body:
      'Below O\'Shaughnessy Dam the Tuolumne runs wild again through a small green valley, and exactly one trail reaches it: a 1.3-mile plunge off Hetch Hetchy Road that loses 1,300 feet, the steepest maintained grade in the park. The signed pullout sits 3.9 miles past the entrance station. There are no switchback niceties. The trail simply goes down, through oak and bear clover, until the river noise rises to meet you.\n\n' +
      'The floor is the reward: meanders and sand bars, spring wildflowers on the benches, and a stretch of river with the dam out of sight upstream and essentially no one, ever, sharing it. A few fishermen know it. Lunch on a rock, feet in the shallows if the flow is gentle, and a granite valley to yourself within a mile and a half of a parked car, which may be the best ratio in the park.\n\n' +
      'Do the arithmetic before you commit, because the way out is the whole bill: 1,300 feet regained in 1.3 miles, most of it in the open. Walk down in the morning cool and climb out before the heat, or aim the whole outing at spring or fall. A July afternoon here is a mistake you only make once.',
    photos: [], // TODO: needs dedicated photography — no editorial image matches Poopenaut Valley
  },
  {
    id: 'rainbow-pool',
    title: 'Rainbow Pool, the swimming hole on the way home',
    region: 'hetch-hetchy',
    order: 104,
    kind: 'trailhead',
    collection: 'hidden',
    category: 'trails',
    difficulty: 'easy',
    season: 'July to September',
    coord: [-119.8780, 37.8137], // TODO: verify on the ground — web-derived, Hwy 120 at the South Fork Tuolumne crossing just west of the Evergreen Rd junction; confirm the day-use turnoff
    elevationFt: 4300,
    timeBudgetMin: 90,
    hazard:
      'Spring runoff turns the pool into fast current; swim only in summer low flow. Ledge jumping causes injuries here every year: check the depth yourself, and never dive.',
    teaser:
      'A waterfall pouring into a broad green pool right off Highway 120, minutes from the Evergreen Road junction. Free, Forest Service, and the correct last stop of a hot day.',
    body:
      'Just west of the Evergreen Road junction, Highway 120 crosses the South Fork of the Tuolumne, and a signed spur drops to Rainbow Pool: a short, forceful waterfall pouring into a broad green pool ringed by granite shelves. Stagecoach travelers stopped here when this was the toll road into the park, and a small resort traded on the pool for decades before it burned; what remains is the reason anyone built here at all. It sits on Stanislaus National Forest land, so it is free, needs no reservation, and works even after you have left the park for good.\n\n' +
      'By July the water is warm by Sierra standards and the shelves fill with local families on weekends; on a weekday evening you may have it nearly alone. People jump from the ledges. The Forest Service\'s advice and this guide\'s agree: check the depth yourself before anyone jumps, never dive, and stay out entirely in spring flow, when the current through the pool is a machine. There are picnic tables and vault toilets above the water, and nothing else, which is the charm.\n\n' +
      'It pairs with [Carlon Falls](/stop/carlon-falls) as the corridor\'s two river stops: Carlon for the walk, Rainbow Pool for the swim. On the drive home from a [Hetch Hetchy day](/stop/evergreen-road-drive), with the car pointed toward the highway and the heat still standing in the canyon, this is the stop that ends the day properly.',
    photos: [], // TODO: needs dedicated photography — no editorial image matches Rainbow Pool
  },
]

// Validate the entire collection at module-load. Any schema violation throws
// here and Vite surfaces it in the browser overlay or fails the build in CI.
export const stops: StopT[] = Stops.parse(seed)
