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
// Photos: the September 2026 photo pass replaced the placeholder set. Every
//   entry now carries a photograph with a recorded author and licence
//   (photoCredits.ts, generated from scripts/data/photo-credits.json), pulled
//   from Wikimedia Commons by scripts/fetch-guide-photos.mjs and reviewed by eye
//   against the place before selection. Public-domain and CC0 files were
//   preferred; the CC BY / CC BY-SA files that remain are credited on the plate
//   and on the Account page, which is the licence's one condition. Four entries
//   still carry a **stand-in**, marked `// stand-in:` on the line, because
//   Commons holds no usable photograph of the place (Carlon Falls, Evergreen
//   Lodge, Little Nellie Falls, Hidden Lake). The rule for those is unchanged:
//   **the caption must name what the photograph actually shows** and then say
//   how it relates to the entry, never let the reader take it for a picture of
//   the entry. A stand-in captioned as the place is worse than an empty tile.
//   Several historic public-domain plates (Pillsbury, Fiske, Watkins-era
//   stereographs, USGS) stand in for places that have no modern free photo; the
//   caption names the photographer and the era. Never point a `src` at a file
//   that is not in public/photos yet, because photo download packs tolerate zero
//   missing files and one dangling reference fails its whole region's offline
//   download (check-guide-photos.mjs guards this). Filenames are URL keys the
//   service worker caches for good, so a replaced photo gets a **new** filename
//   (the region heroes became region-*-<subject>.jpg for exactly that reason).
//   `/guide` and its FAQ mirrors disclose the stand-ins in prose; if that set
//   changes, that copy moves with it. Outstanding slots:
//   scripts/data/guide-photo-manifest.json, inventory via
//   `npm --prefix scripts run photos:check`.
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
      'The valley in one frame: El Capitan left, Bridalveil right, Half Dome at the back, and the glacier\'s U-shaped floor. Stay fifteen minutes, not thirty seconds.',
    body:
      'The overlook at the east end of the Wawona Tunnel. El Capitan on the left, Bridalveil Fall on the right, Half Dome at the back. Stay fifteen minutes, not thirty seconds.\n\nThe U-shape of the valley floor is glacial: thousands of feet of ice cut it. The hanging valleys above the rim are why the waterfalls drop so far. On arrival, this view orients every later stop. On departure, give it five minutes.',
    photos: [{ src: '/photos/tunnel-view-panorama.jpg', caption: 'The classic view from the Wawona Tunnel pullout.' }],
    swap:
      'If the parking lot is full (it usually is between 10 a.m. and 4 p.m.), drive on in and catch [Valley View](/stop/valley-view), Gates of the Valley, on the way out: Northside Drive runs one way west, so it comes at the end of the loop. Lower angle, same valley.',
    history: {
      note:
        'The tunnel behind you was new in 1933, and the naturalists spent that ' +
        'first year logging what walked into it. Nature Notes recorded two deer ' +
        'inside on the evening of May 30, one of them entering through the lit west ' +
        'portal and reaching the first adit before turning back.',
      volume: 12,
      number: 11,
      issueDate: 'November 1933',
    },
    photoTiming: {
      best: 'sunset',
      note:
        'This overlook looks east into the valley, so the last light of the day comes from behind you and lights El Capitan and Half Dome instead of leaving them in shadow.',
    },
  },
  {
    id: 'valley-loop-drive',
    title: 'Valley loop drive, Tunnel View to Curry Village',
    region: 'valley',
    order: 2,
    kind: 'drive',
    timeBudgetMin: 60,
    photos: [{ src: '/photos/valley-loop-drive.jpg', caption: 'Cathedral Rocks and the Cathedral Spires across the meadow, the south wall of the loop.' }],
    teaser:
      'The valley floor is a one-way loop, and a missed turn costs a 20 to 45 minute lap. Drive it before 9 a.m. as a preview: Bridalveil, Cathedral Beach, Sentinel Beach, the Swinging Bridge.',
    body:
      'The valley floor is a one-way loop: Southside Drive runs east, Northside Drive runs west. A missed turn costs a full lap, twenty to forty-five minutes depending on traffic. Drive it before 9 a.m.; between 11 and 4 in summer it is stop-and-go.\n\nPullouts on the eastbound leg: Bridalveil Fall parking, Cathedral Beach (El Capitan across the river), Sentinel Beach (Half Dome reflection on calm mornings), the Swinging Bridge (kids and quiet water). Treat this leg as a preview and don\'t commit to a hike yet. The westbound return passes [El Capitan Meadow](/stop/el-capitan-meadow) and [Valley View](/stop/valley-view), and shows different walls.\n\nThe speed limit is low and enforced; driving 25 instead of 35 is how you notice the pullouts. If you arrive midday, do the drive as reconnaissance and spend the afternoon on foot.',
    history: {
      note:
        'Nature Notes published this exact drive in January 1942 as a special ' +
        'number: a self-guiding auto tour of the valley floor, a complete circle of ' +
        'about 22 miles that the naturalists said would require at least two hours. ' +
        'They started the tour at the museum and told you to come back to it at the ' +
        'end, to fix what you had learned.',
      volume: 21,
      number: 1,
      issueDate: 'January 1942',
    },
    photoTiming: {
      best: 'golden-am',
      note:
        'Drive it early: before the crowds arrive the light comes down the north wall instead of flattening into the midday parking-lot glare.',
    },
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
      'A flat one-mile boardwalk through the meadow at the center of the valley. Walk the full counter-clockwise loop rather than turning around at the Lower Yosemite Fall vista: it adds Half Dome from Sentinel Bridge, Yosemite Falls over the meadow, and the black oaks the Ahwahneechee tended for centuries.\n\nCome back at sunset for bears. Cook\'s Meadow is the valley\'s most reliable bear watch: black bears come out of the tree line in the last light to graze the meadow and work the black oaks, especially in fall when the acorns drop. Watch from the boardwalk and keep at least 150 feet. The parkwide odds list is in [Where to actually see a bear](/essentials/bear-viewing).',
    photos: [{ src: '/photos/cooks-meadow-loop.jpg', caption: 'A Valley shuttle passing Cook\'s Meadow, Half Dome behind it. The loop crosses this road twice.' }],
    swap:
      'In late summer when the falls are dry, walk the meadow instead: golden grass, low light through the oaks. Skip the fall vista, do the loop in reverse from Sentinel Bridge.',
    photoTiming: {
      best: 'sunset',
      note:
        'Come back in the last light, when bears are most likely to work the tree line and Half Dome and Yosemite Falls bookend the meadow in gold.',
    },
    history: {
      note:
        'In January 1980 the park archeologist Steve Danziger reported on test ' +
        'coring under the Village Mall blacktop, where the village of Ahwahnee, ' +
        'perhaps the largest Native American village in the park, once stood. The ' +
        'midden ran more than four feet deep in places without a break, which he ' +
        'read as 1,000 years or more of continuous occupation, and the site proved ' +
        'larger than previously known, running from north of the visitor center south ' +
        'into Cook\'s Meadow.',
      volume: 47,
      number: 8,
      issueDate: 'January 1980',
    },
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
      'A one-mile paved loop to the base of one of the tallest waterfalls in North America. In May the footbridge sits in a spray cloud; by late August the wall can be silent. Go before 9 a.m. or after dinner.',
    body:
      'A paved one-mile loop to the base of the final 320-foot drop of Yosemite Falls, which falls 2,425 feet in three stages, one of the tallest waterfalls in North America. It is one of the most walked trails in the park, so time it: before 9 a.m., when the light works down the wall and swifts hunt the cliff, or after dinner, when the tour groups have left. Midday is crowded.\n\nThe fall runs on snowmelt. In May the footbridge sits inside a spray cloud; by late August the wall is often bare granite with a dark stain. In September, walk the loop anyway: the eastern half, which few visitors take, runs through black oaks and old talus. Stay off the boulders above the bridge; polished granite plus spray is the loop\'s one real hazard.\n\nOn clear spring nights near the full moon, the spray at the footbridge can throw a moonbow; see [the moonbow entry](/stop/yosemite-falls-moonbow).',
    photos: [{ src: '/photos/lower-yosemite-fall-footbridge.jpg', caption: 'Lower Yosemite Fall from the footbridge at the base of the loop.' }],
    swap:
      'If the loop is a shoulder-to-shoulder parade, cross Northside Drive at shuttle stop 6 into [Cook\'s Meadow](/stop/cooks-meadow-loop) instead: the full 2,425-foot drop in one frame, which the base of the fall itself cannot show you.',
    history: {
      note:
        'Through the winters the fall builds an ice cone at its base out of frozen ' +
        'spray, and in 1932 Assistant Park Naturalist M. E. Beatty roped up with ' +
        'the mountaineer Norman Clyde and climbed it. They found an inverted funnel ' +
        'filling nearly the whole width of the hanging valley, rising at 45 to 60 ' +
        'degrees to a point they put at close to 300 feet.',
      volume: 11,
      number: 5,
      issueDate: 'May 1932',
    },
    photoTiming: {
      best: 'night',
      note:
        'On clear spring nights near the full moon, the spray at the footbridge throws a pale lunar rainbow worth a walk back up after dark.',
    },
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
      'A five-minute walk on a paved path, rebuilt with boardwalks and a viewing plaza. Bridalveil flows year-round: Yosemite Falls dries up by August, this one doesn\'t. In spring the platform sits in the spray; bring a layer if the day is cool.\n\nThe Ahwahneechee name is Pohono, usually translated as spirit of the puffing wind. The fall drops 620 feet from a hanging valley, and the afternoon wind pushes the bottom half sideways, sometimes lifting the ribbon off the wall. The hanging valley is glacial: the side glacier that carved Bridalveil Creek\'s canyon was small, the trunk glacier in the main valley cut thousands of feet deeper, and when the ice left, the creek\'s valley was stranded above the floor. Every waterfall on these walls has the same origin.',
    photos: [{ src: '/photos/bridalveil-fall.jpg', caption: 'Bridalveil Fall from the base trail in spring, the mist reaching the path.' }],
    history: {
      note:
        'In 1931 Nature Notes printed an account of a drive through the valley with ' +
        'Maria Lebrado, described there as the last surviving member of Chief ' +
        'Tenaya\'s band. As the party came up on this fall she called out its name ' +
        'in warning, Pohono, and told them the villages ended here: beyond it, the ' +
        'account says, a person feared to go.',
      volume: 10,
      number: 7,
      issueDate: 'July 1931',
    },
  },
  {
    id: 'valley-view',
    title: 'Valley View, the river-level goodbye',
    region: 'valley',
    order: 6,
    kind: 'viewpoint',
    coord: [-119.662, 37.7172], // TODO: verify on the ground — moved 2026-09 ~340 m S to the turnout: NPS places "Valley View" (-119.662124, 37.717152) and the OSM viewpoint/lot/toilets agree within 26 m
    elevationFt: 3900,
    timeBudgetMin: 20,
    teaser:
      'The river-level bookend to Tunnel View: El Capitan and Cathedral Rocks framing the Merced at pullout V11 on Northside Drive. Ansel Adams shot it as Gates of the Valley.',
    body:
      'Valley View is Tunnel View at river level. The pullout is on Northside Drive just east of the Pohono Bridge, marked V11. Northside runs one way west, so you reach it on the way out of the valley. El Capitan on the left, Cathedral Rocks and part of Bridalveil on the right, the Merced over granite boulders in front. Ansel Adams photographed this frame as Gates of the Valley.\n\nThe pullout holds about a dozen cars and turns over fast. There is no circling back on a one-way road: if it is full, the options are another lap of the valley or tomorrow. Late afternoon puts warm light on El Capitan, winter dusk turns the frame pink, and calm mornings bring a river reflection. Make it the last stop of the last day.',
    photos: [{ src: '/photos/valley-view.jpg', caption: 'The Gates of the Valley frame from the riverbank: El Capitan left, Bridalveil right.' }],
    swap:
      'Full pullout and no patience for another lap? [Cathedral Beach picnic area](/stop/cathedral-beach-quiet-picnic) on Southside Drive gives you El Capitan across the river from the south bank, and almost nobody uses it.',
    history: {
      note:
        'Nature Notes in June 1925 retraced the Mariposa Battalion\'s entry of 1851. After a first camp near the foot of the trail from Old ' +
        'Inspiration Point, Major Savage and Captains Bolling and Dill found a ford ' +
        'used by the Indians a short way downstream, and the writer judged that in ' +
        'all probability it was the ford at what the bulletin already called Valley ' +
        'View. The California Medical Association placed a bronze plaque to Dr. ' +
        'Lafayette Houghton Bunnell of that party on a boulder at the camp-site ' +
        'opposite El Capitan.',
      volume: 4,
      number: 6,
      issueDate: 'June 1925',
    },
    photoTiming: {
      best: 'sunset',
      note:
        'Late afternoon puts warm light on El Capitan, and winter dusk turns the whole Gates of the Valley frame pink.',
    },
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
      'Climb the abandoned 1874 wagon road from a dirt pullout on Northside Drive: hand-stacked walls, stagecoach switchbacks, few people. Half a day, easy.',
    body:
      'A small dirt pullout on Northside Drive, between the Pohono Bridge and El Capitan, is the start. From it you climb the original Big Oak Flat Road, the wagon grade completed in 1874, one of the three original roads to the valley floor. It carried traffic for nearly seventy years until a rockslide in 1943 closed it to cars. Most of the roadbed remains: hand-stacked retaining walls, cut blocks, switchbacks wide enough for a six-horse coach. Few people walk it.\n\nThe climb is rock-hopping and a little scrambly in places, nothing technical, doable with kids. About a mile and 800 feet of gain reach the first big preserved section. Half a day, easy; a full day if you keep going. Bring lunch; there is shade under incense cedars and a view across to Cathedral Rocks.\n\nIn spring, March through June depending on snowmelt, extend west to the base of Ribbon Fall. The traverse is unmarked and rough through talus. Ribbon Fall is a 1,612-foot single drop, often called the tallest single drop in North America, fed only by snowmelt off the rim. It peaks in May and is usually dry by July.',
    swap:
      'The dirt pullout holds maybe four or five cars. If it\'s full, the nearest parking is the roadside pullouts at El Capitan Meadow, about half a mile back east on the same one-way road; park there and walk west along Northside Drive. Adds ten to fifteen minutes each way and a touch of road noise, but you don\'t lose the day.',
    history: {
      note:
        'A 1933 Nature Notes survey of the valley\'s rock falls singled out the ' +
        'ground this road was built on, calling the slides at the lower end of the ' +
        'Big Oak Flat road the most conspicuous in the valley. Talus cones take ' +
        'hundreds or thousands of years to build, the article noted, but one can be ' +
        'made in a single year, or by a single fall. The road lasted twelve more.',
      volume: 12,
      number: 2,
      issueDate: 'February 1933',
    },
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
      'The dirt pullout on Northside Drive, between the Pohono Bridge and El Capitan, on the north side of the road. It holds four or five cars and has no real sign; look for the old roadbed angling up into the trees behind it. This pin lets you navigate straight to it instead of hunting at 15 mph with traffic behind you.\n\nIf it\'s full, park at the El Capitan Meadow roadside pullouts, about half a mile back east (you pass them first on this one-way road), and walk west along Northside Drive. That adds ten to fifteen minutes each way. The climb starts at the pullout: see [Old Big Oak Flat Road and Ribbon Fall](/stop/old-big-oak-flat-road).',
    photos: [{ src: '/photos/old-road-trailhead-pullout.jpg' }],
    swap:
      'If the pullout is full, park at the El Capitan Meadow roadside pullouts, about half a mile back east, and walk west along Northside Drive. Adds ten to fifteen minutes each way.',
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
      'Partway up the old Big Oak Flat Road grade, the trees open onto Bridalveil Fall from above its rim, with Cathedral Rocks behind and the Merced on the valley floor below. In the 1870s this was the first full look at the valley for travelers on the Big Oak Flat Road, and the stagecoach drivers stopped here.\n\nMorning light is best, when the south wall is lit and the fall carries its spray rainbow (hence the name). Reached only on foot via the old road from [the Northside Drive pullout](/stop/old-road-trailhead-pullout); budget it as part of the [Old Big Oak Flat Road half day](/stop/old-big-oak-flat-road).',
    photos: [{ src: '/photos/rainbow-view-old-road.jpg' }],
    photoTiming: {
      best: 'golden-am',
      note:
        'Morning light falls on the south wall and puts the spray rainbow in Bridalveil Fall, which is where the view takes its name.',
    },
    history: {
      note:
        'In July 1950 Shirley Sargent wrote up the old road for Nature Notes, ' +
        'closed to cars by a rock slide in 1943. Beyond the log gate at Gentry, she ' +
        'reported, the Control Road lay under pine needles and cones, and around the ' +
        'curve was the view tourists first had of the valley: the old iron rail where ' +
        'photographers snapped Bridalveil Fall and Cathedral Rocks was still there. In ' +
        'its driving years inbound cars came down only on the odd hours, and missing ' +
        'the last control meant a nine-hour wait.',
      volume: 29,
      number: 7,
      issueDate: 'July 1950',
    },
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
      'A rough, unmarked talus traverse to the base of what is often called North America\'s tallest single-drop waterfall, 1,612 feet, flowing only in spring, roughly March to June.',
    body:
      'A 1,612-foot single drop, often called the tallest in North America, flowing only in spring. Ribbon Fall is fed by snowmelt off the rim west of El Capitan: it starts in March, peaks in May, and is usually dry by July. No sign, no trail marker.\n\nThe approach leaves the [old Big Oak Flat Road](/stop/old-big-oak-flat-road) and traverses west through talus toward the sound of water. It is an unmarked, rough route, not a trail; wear real shoes and take the blocks slowly. Check the seasonal window before committing the day: in a dry year the fall can be done by the first week of May.',
    swap:
      'If the traverse is more than the group wants, [Bridalveil Fall](/stop/bridalveil-fall) runs year-round and its viewing platform is a five-minute paved walk. Same hanging-valley geology, a fraction of the effort.',
    photos: [{ src: '/photos/ribbon-fall-base.jpg' }],
    history: {
      note:
        'Reynold E. Carlson wrote this approach up for Nature Notes in 1935 and ' +
        'nothing about it has changed. There is no trail to the base of Ribbon ' +
        'Fall, he reported, and probably only a few people each year make their way ' +
        'into the dark opening at its base. He also found a small amount of water ' +
        'still coming over the lip in July.',
      volume: 14,
      number: 6,
      issueDate: 'June 1935',
    },
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
      'Cascade Creek stairsteps off the north rim a few miles inside the Arch Rock entrance, best in April and May, with uncrowded picnic tables on the west end of the valley.',
    body:
      'Cascade Creek comes off the north rim in a long stairstep of whitewater, best in April and May. The picnic tables along the creek, a few miles inside the Arch Rock entrance, are the quietest lunch stop on the west end of the valley. It is the first stop if you enter on Highway 140, and a good finish after a morning on the [old road](/stop/old-big-oak-flat-road).\n\nAbove the rim is Foresta, the small private inholding the 1990 A-Rock fire burned through. Its meadow blooms in June and is a good deer and bear sightline at dusk. The Foresta road leaves Big Oak Flat Road (the modern highway) a few miles above the valley, well below Crane Flat.',
    photos: [{ src: '/photos/foresta-cascades.jpg' }],
    history: {
      note:
        'Nature Notes told Foresta\'s story in March 1955. In 1913 B. Davis bought ' +
        'the 200 acres above the Arch Rock entrance to make a summer resort, built ' +
        'the seven-mile road from El Portal to Foresta at a reported cost of ' +
        '$25,000, sold his magnesite mines for $20,000 to push it on to Crane Flat, ' +
        'and put up a small hotel, 37 tent houses, a swimming pool and bath houses. ' +
        'Davis abandoned the project in 1915, and three years later the hotel burned.',
      volume: 34,
      number: 3,
      issueDate: 'March 1955',
    },
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
      'Pull off at the meadow and look up: there are usually climbers on the 3,000-foot wall. Bring binoculars.',
    body:
      'Pull off Northside Drive at the meadow and look up: there are usually climbers on the 3,000-foot wall. Bring binoculars. A photographer with a long lens will often point them out if you ask. Most parties take 3–5 days on the standard routes and sleep in portaledges on the face.',
    photos: [{ src: '/photos/el-capitan-snow-spring.jpg', caption: 'El Capitan in last light above the Merced, snow still on the banks.' }],
    history: {
      note:
        'The English names on these walls were handed out in a single day. Nature ' +
        'Notes dates it to March 25, 1851, when the Mariposa Battalion came in by ' +
        'way of Inspiration Point and camped under El Capitan facing Bridalveil ' +
        'Fall. The party\'s medical officer, Dr. L. H. Bunnell, went back to ' +
        'Mariposa and gave the first published account of the place to the Gazette ' +
        'there.',
      volume: 12,
      number: 6,
      issueDate: 'June 1933',
    },
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
      'A walk-in campground behind Yosemite Valley Lodge, and the most consequential campsite in the history of climbing. Through the 1950s and 60s the climbers who lived here for months, Royal Robbins, Warren Harding, Yvon Chouinard forging pitons on an anvil by the parking lot, worked out the techniques and gear that made walls like El Capitan possible. When the Park Service later planned to redevelop the site, climbers fought it in court, and in 2003 Camp 4 went onto the National Register of Historic Places.\n\nIt is a public campground, not a museum; walk through respectfully and keep voices down among the tents. The granite blocks in camp are bouldering landmarks, and most afternoons someone is trying Midnight Lightning on the Columbia Boulder, first climbed in 1978. The Yosemite Falls Trail starts directly behind camp, and the search-and-rescue site next door is staffed largely by climbers. Pair it with [El Capitan Meadow](/stop/el-capitan-meadow).',
    photos: [{ src: '/photos/camp-4.jpg', caption: 'A walk-in site at Camp 4 under the pines. The Yosemite Falls Trail starts directly behind the campground.' }],
    history: {
      note:
        'The archive caught the era just before this campground\'s. In 1946 Nature ' +
        'Notes described the first ascent of the Lost Arrow by Jack Arnold, Fritz ' +
        'Lippmann, Robin Hansen and Axel Nelson: every earlier party had started ' +
        'from the base of the upper fall and got nowhere, so this one threw a ' +
        'weighted cord across from the canyon rim to the top of the spire and ' +
        'crossed on the rope.',
      volume: 25,
      number: 10,
      issueDate: 'October 1946',
    },
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
    photos: [{ src: '/photos/mirror-lake.jpg', caption: 'Mirror Lake in spring, Mount Watkins reflected, before the summer draw-down.' }],
    teaser:
      'Two flat miles round trip to the closest spot in the valley to Half Dome. Go early, before the breeze erases the reflection.',
    body:
      'Two miles round trip from the shuttle stop, mostly flat. The "lake" is a pool in the Tenaya Creek drainage: a real lake in spring, mostly meadow by August. It is the closest spot in the valley to Half Dome, directly below it. Go early: the trail is in shade until 10 a.m. and the reflection is gone by mid-morning when the breeze picks up.\n\nWhere Tenaya Creek feeds and drains the lake, watch for the water ouzel, or American dipper: a dark, robin-sized bird that walks into fast current, grips the streambed with oversized feet, and forages underwater for insect larvae. Ouzels need cold, fast, well-oxygenated water, so one is a sign of a healthy creek. Early hours are best. The Secret Spots section has a dedicated ouzel-watching spot on the Merced at Happy Isles. For more of Tenaya Creek, see [Three Chutes Falls](/stop/three-chutes-falls).',
    history: {
      note:
        'The lake is a rockfall deposit. A 1933 Nature Notes piece on valley rock ' +
        'falls used it as the classic case: a great fall at the lower end of the ' +
        'lake, which it dated to roughly 250 years ago, dammed Tenaya Creek and ' +
        'ponded the water behind it. Everything since has been the creek filling ' +
        'that pond back in.',
      volume: 12,
      number: 2,
      issueDate: 'February 1933',
    },
    photoTiming: {
      best: 'sunrise',
      note:
        'Go at first light: the reflection is calm and clear before the morning breeze rises and erases it by mid-morning.',
    },
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
    // Source: Yosemite Guide Vol 51 Issue 8 (September 23 - November 24, 2026); NPS vernalnevadatrail.htm (Jul 27, 2026).
    hazard:
      'Repair closures through October 2026: the Mist Trail between its John Muir Trail junction, just above the Vernal Fall footbridge, and the top of Vernal Fall is closed Monday through Thursday, 7 a.m. to 3:30 p.m. (open Fridays through Sundays, holidays, and outside those hours when conditions allow); the John Muir Trail by Clark Point is the signed detour. The John Muir Trail between Clark Point and the Panorama Trail junction reopened July 27 after repairs, and it and the Mist Trail above the footbridge may close for winter from November. Check conditions at the Welcome Center before counting on the loop.',
    teaser:
      'Six hundred granite steps in the spray to Vernal Fall, then Nevada if you have it. Start at Happy Isles by 6:30 a.m. and come down the John Muir Trail.',
    body:
      '5.8 miles by the park\'s count, 2,000 ft of gain, 5–6 hours with breaks, as a loop up the Mist Trail and down the John Muir Trail. Start at Happy Isles by 6:30 a.m.; earlier is better. The first 0.8 miles is paved to the Vernal Fall footbridge, where most casual hikers turn around. Past the bridge you climb about 600 granite steps, in spray (May–June) or on sun-baked rock (August), to the top of Vernal Fall, 1.2 miles in. If you\'re still strong, continue 1.5 miles to Nevada Fall.\n\nDescend on the John Muir Trail: longer, gentler, easier on the knees, and less crowded. The Mist Trail is wet and slippery; trekking poles help. Bring more water than you think. Above Vernal Fall the trail passes Emerald Pool and the Silver Apron: entering either is prohibited because of frequent injuries and fatalities.\n\nThe steps were set by hand and vary: some rise a foot, some closer to two, some tilt enough to slide a wet boot. This staircase, not the exposure, is where most Mist Trail injuries happen, usually someone in worn soles or sandals falling on wet granite. Wear real tread. The footbridge and staircase are crowded; the trail thins above Vernal Fall.\n\nIn May and June, at full snowmelt, the spray zone below Vernal Fall soaks you for about twenty minutes: bag your phone, wear synthetic not cotton, and carry a dry shirt. By August you get misted rather than drenched. On a wet day, the John Muir Trail bypass between the two falls is the drier, gentler way around.',
    photos: [{ src: '/photos/vernal-fall-mist-trail.jpg', caption: 'Vernal Fall in full spring flow, the first payoff on the Mist Trail.' }],
    swap:
      'If the legs say no, just do Vernal Fall and back via the same trail (2.4 miles RT, 1,000 ft). Still a real hike. In winter, roughly November through April, the granite stairs above the footbridge close when they ice over; the paved stretch to the footbridge stays open. If you have the legs and the cables are up (late May to mid-October) and the lottery gods love you, this is the day for [Half Dome](/hike/half-dome): 14–16 miles, 4,800 ft, 10–12 hours, separate permit.',
    history: {
      note:
        'This has been the paying route up the canyon since 1870. A Nature Notes ' +
        'history of park trails puts a cabin serving as a toll station at Register ' +
        'Rock, near the present junction a short way above the footbridge, and ' +
        'credits Albert Snow with building the horse trail from there over the ' +
        'shoulder at Clark Point to the flat between the two falls, where he ran a ' +
        'hotel called La Casa Nevada. The 1868 guidebook it quotes warned that the ' +
        'perpendicular part of the ascent is surmounted by the aid of ladders.',
      volume: 22,
      number: 10,
      issueDate: 'October 1943',
    },
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
    // Source: Yosemite Guide Vol 51 Issue 8 (September 23 - November 24, 2026); NPS conditions, Sep 23, 2026.
    hazard:
      'Through October 2026 the Mist Trail between the John Muir Trail junction and the top of Vernal Fall is closed Monday through Thursday, 7 a.m. to 3:30 p.m., so on those days the Panorama descent comes down the John Muir Trail by Clark Point. For winter the upper Four Mile Trail closes, usually by November or December, and the John Muir Trail between Clark Point and the Panorama Trail junction may close from November. Confirm trail status before committing to the loop.',
    photos: [{ src: '/photos/four-mile-trailhead.jpg', caption: 'Vernal Fall, one of the two falls the Panorama descent passes.' }],
    teaser:
      '3,200 feet and some 58 switchbacks from the valley floor to Glacier Point. There is no water anywhere on the trail; start at dawn with three liters.',
    body:
      'The trailhead is a small lot on Southside Drive between Sentinel Beach and the Swinging Bridge, at the foot of Sentinel Rock, and it fills by 7 a.m. on busy days. If it\'s full, park at a day-use lot and ride the Valleywide shuttle to stop 11. Start at 5:30 or 6 a.m.: the first mile is the steepest and most exposed and it bakes once the sun clears the rim. There is no water on this trail. Carry three liters minimum.\n\nAbout 4.8 miles one way, roughly 3,200 feet of gain across about 58 switchbacks. The trail was built in 1872 as a toll route of about four miles; half a century later crews rerouted it with gentler switchbacks, and the name stuck. Union Point, near mile three, has Yosemite Falls across, El Capitan west, and Half Dome east; it is where many people quit, but the top is worth the rest of the climb.\n\nThe loop option: up the Four Mile, down the Panorama Trail past Illilouette and Nevada Falls to Happy Isles. 13 to 14 miles, around 4,000 feet of total climbing (including an 800-foot climb out of the Illilouette drainage), 8 to 10 hours. From Happy Isles (shuttle stop 16) ride the Valleywide shuttle to stop 11; it serves stops in numerical order, so budget most of a lap. Two cars simplifies it. Don\'t plan on hitching down from Glacier Point.\n\nGlacier Point Road must be open for the loop (it typically opens in May), and the upper Four Mile Trail closes in winter when ice makes the ledges unsafe, typically until well into spring. In summer the climb is exposed: morning start, hat, sunscreen, three liters. Check the NPS conditions page the night before.',
    history: {
      note:
        'John Conway began this trail in 1871 under James McCauley and finished it ' +
        'the following year, according to a Nature Notes history of park trails. ' +
        'McCauley went on to build the Mountain House at Glacier Point in 1878. The ' +
        'trail opened as a horse route and by 1877 had fallen into enough disrepair ' +
        'that only hikers used it, which is roughly where it has stayed.',
      volume: 22,
      number: 10,
      issueDate: 'October 1943',
    },
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
      'The Yosemite Museum, the reconstructed Miwok village behind it, and the Ansel Adams Gallery, all a short walk from the grocery store.',
    body:
      'The valley\'s working center: the Welcome Center, the Village Store, the post office, most of the rangers. Park once in the Village day-use lot and walk the cluster; don\'t move the car between buildings.\n\nThe Yosemite Museum, opened in 1926 as the first purpose-built museum in the national park system, holds a major basket collection by Ahwahneechee and Mono Lake Paiute weavers, some pieces years in the making. Basketry and other traditional-skill demonstrations run near the entrance on many days.\n\nBehind the museum, a self-guided loop walks through the reconstructed Indian Village of the Ahwahnee: bark umachas, an acorn granary, a roundhouse still used ceremonially by the park\'s associated tribes, and a pounding rock worn deep with mortar holes. Allow fifteen minutes. Next door, the Ansel Adams Gallery has operated in the Valley since 1902, when it opened as Best\'s Studio, and on this spot since the new village was built in the 1920s; Adams married the owner\'s daughter, and the gallery still sells prints made from his negatives.\n\nAcross the road from the museum, the Pioneer Cemetery holds Galen Clark, the valley\'s first guardian, under sequoias he planted.',
    photos: [{ src: '/photos/yosemite-village.jpg', caption: 'The Valley Visitor Center in Yosemite Village, the Yosemite Falls wall behind it.' }],
    history: {
      note:
        'The museum here is the reason this bulletin exists. The first issue of ' +
        'Yosemite Nature Notes, dated July 10, 1922, reported that the newly ' +
        'established Yosemite Museum had opened on the evening of June 17 with six ' +
        'rooms covering history, ethnology, geology, natural history, botany and ' +
        'the trees of the region, and that 5,631 people had walked through in the ' +
        'two weeks that followed.',
      volume: 1,
      number: 1,
      issueDate: 'July 10, 1922',
    },
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
      'The 1927 lobby and Great Lounge are open to anyone. Walk through, sit by the stone fireplace under the 24-foot ceiling, order a drink at the bar. No reservation needed.',
    body:
      'The lobby and Great Lounge are open to the public; you don\'t have to be a guest. The 1927 building is a national historic landmark: Native American motifs, exposed beams, a stone fireplace under a 24-foot ceiling. The dining room asks for a reservation and proper attire at dinner; the bar asks for neither.\n\nGilbert Stanley Underwood designed it. What reads as timber is largely poured concrete, formed and stained to imitate redwood so the hotel could not burn like its wooden predecessors. Circle the Great Lounge for the stained-glass panels along the tops of the windows, then look into the smaller rooms off it. Every December the dining room hosts the Bracebridge Dinner, a costumed banquet the hotel has produced since 1927. Queen Elizabeth II, President Kennedy, and Steve Jobs all have history here; the lobby mentions none of it.',
    photos: [{ src: '/photos/ahwahnee-hotel.jpg' }],
    history: {
      note:
        'Four years after the hotel opened, Junior Park Naturalist C. C. Presnall ' +
        'filed a piece for Nature Notes called Wilderness Neighbors of the Ahwahnee ' +
        'Hotel. A gray fox had been box-trapped within a few rods of the building, ' +
        'and the protected wildflower gardens laid out around it, he wrote, had ' +
        'brought prosperous times again to certain kinds of birds.',
      volume: 10,
      number: 8,
      issueDate: 'August 1931',
    },
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
    dayPart: 'sunset',
    teaser:
      'Half Dome catches the last light here with the Merced in the foreground. Skip the crowded rail for the small beach below the bridge, and stay past the gold.',
    body:
      'Half Dome catches the last light from here, with the Merced in the foreground. Skip the crowded rail and walk down to the small beach below the bridge for a wider angle. Stay until the wall goes from gold to pink to grey, and into twilight.\n\nThe mirror reflection needs slack water, which the Merced offers only once spring runoff drops, so late summer through winter is reflection season; in May the river moves too fast. A few evenings each month the moon rises near Half Dome\'s shoulder shortly after sunset. If moonrise lands within an hour of sunset, stay for it. Ansel Adams photographed from this bridge.',
    photos: [{ src: '/photos/half-dome-merced-river-spring.jpg', caption: 'Half Dome above the Merced from the Valley floor, the view the bridge frames.' }],
    history: {
      note:
        'In October 1959 Nature Notes traced this crossing through four ' +
        'photographs. The first bridge had already given way to a more substantial ' +
        'one when Eadweard Muybridge photographed the span around 1865, and records ' +
        'put an all-metal bridge here in 1878. The concrete bridge was built by the ' +
        'Gutleben brothers, who also built the hotel at Glacier Point. A small ' +
        'incense cedar on the bank, found with a magnifying glass in the Muybridge ' +
        'print, measured three feet six inches in diameter at chest height in 1958.',
      volume: 38,
      number: 10,
      issueDate: 'October 1959',
    },
    photoTiming: {
      best: 'sunset',
      note:
        'Half Dome catches the day\'s last light from this bridge, so stay past the first gold as the wall turns pink and grey.',
    },
  },
  {
    id: 'curry-village',
    title: 'Curry Village, base camp',
    region: 'valley',
    order: 20,
    kind: 'lodging',
    coord: [-119.5726, 37.7377], // verified 2026-07: Curry Village core, registration/dining (OSM); was ~390 m off (same pin as curry-village-pizza)
    teaser:
      'Tent or wood cabins at the original 1899 camp, walking distance to the dining hall, the shuttle, and the Mist Trail. Reservations open 366 days out.',
    body:
      'Tent cabins or wood cabins. The tent cabins are the original 1899 camp; the wood cabins have insulation. The location is what you pay for: walking distance to the dining hall, the shuttle stop, and the Mist Trail trailhead. On a multi-night trip, stay all your nights here to avoid packing each morning. Reservations open 366 days out and the good months sell in minutes.',
    swap:
      'If Curry is full: Yosemite Valley Lodge or [the Ahwahnee](/stop/ahwahnee-hotel) are the in-park alternates. Outside the park: El Portal (closest, 30 min), Mariposa (45 min, more options), or Groveland (Big Oak Flat entrance side, 1 hr to valley).',
    photos: [{ src: '/photos/curry-village.jpg' }],
    history: {
      note:
        'Camp Curry had the park\'s public science programming before the park had ' +
        'much of one. The first issue of Nature Notes, in July 1922, announced that ' +
        'a flower show had been started here so visitors at the upper end of the ' +
        'valley could study the wildflowers. Forty-eight species were on display ' +
        'the first day.',
      volume: 1,
      number: 1,
      issueDate: 'July 10, 1922',
    },
  },
  {
    id: 'curry-village-pizza',
    title: 'Lunch at Curry Village',
    region: 'valley',
    order: 21,
    kind: 'meal',
    dayPart: 'midday',
    coord: [-119.5726, 37.7377], // verified 2026-07: Curry Village core (same pin as curry-village)
    timeBudgetMin: 60,
    teaser:
      'The pizza patio is right where you land off the Mist Trail: fast, good after a hike, no reservation. Bar 1899 next door has small plates indoors.',
    body:
      'You\'ll be hungry off the Mist Trail. The Curry Village pizza patio is right there, fast, and good after a hike. If the deck line is long, Bar 1899 next door has small plates and indoor seating; check its hours, which shrink to evenings late in the season. The Ahwahnee dining room serves lunch too; the reservation it recommends is for dinner, but you\'ll want to clean up first.',
    photos: [{ src: '/photos/curry-village-pizza.jpg' }],
    history: {
      note:
        'Herbert Sonn, the bird man of Yosemite, arrived in 1914. When the old ' +
        'village was cleared for the Ahwahnee, Mother Curry gave him a plot at Camp ' +
        'Curry at the foot of the Ledge Trail, where he pitched a tent and fenced an ' +
        'amphitheater with brambles and sticks. He lectured twice a day, called down ' +
        'Steller\'s jays that caught nuts in the air and landed on his hand, and sold ' +
        'souvenir birds of cones. Stuart Cross, later the Curry company\'s president, ' +
        'started at twelve as his assistant for an occasional quarter.',
      volume: 44,
      number: 5,
      issueDate: 'October 1975',
    },
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
      'Two miles round trip on the abandoned stagecoach grade above Tunnel View to the rim where Thomas Ayres sketched the valley in 1855.',
    body:
      'About a mile from the Tunnel View lot, two miles round trip with a modest climb. Start on the Pohono Trail from the east end of the [Tunnel View](/stop/tunnel-view) parking lot (that pin is the parking for this one). At half a mile, where the trail crosses the old stagecoach road, turn left onto the abandoned grade to Artist Point. The view is Tunnel View from higher and further east, usually with nobody there. Do it as the first or last hour of a valley day.\n\nIn 1855 Thomas Ayres sketched the valley from this rim, among the first drawings of it. From 1875 the stage road ran past the spot; when the Wawona Tunnel opened in 1933, the grade was abandoned. If you stay on the Pohono Trail another half mile before the turnoff, a stone marker notes the original Inspiration Point, though trees have mostly closed that view.',
    photoTiming: {
      best: 'sunset',
      note:
        'The view here is Tunnel View shifted higher and east, so the same last light on El Capitan and Bridalveil applies.',
    },
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
      'Cross the bridge above Upper Yosemite Fall and continue to the rim at 6,936 feet: Lost Arrow below, Half Dome ahead, the valley nearly 3,000 feet down.',
    body:
      'About 8.8 miles round trip from the trailhead behind Camp 4, with 3,200 feet of gain. Start at first light. Climb the Yosemite Falls Trail to the overlook above the upper fall, then cross the bridge over Yosemite Creek and continue east three quarters of a mile to the rim point at 6,936 feet. The spur costs less than an hour more and loses most of the crowd.\n\nFrom the point, the Lost Arrow spire stands off the cliff below, Half Dome is in the middle distance, the valley floor is nearly 3,000 feet down, and to the west the upper fall goes over the lip.\n\nIn spring 1871 John Muir worked onto Fern Ledge, a shelf partway up this wall that passes behind the upper fall. The ledge is still there. The way to it was never a trail, crosses steep dirt above open cliff, and has hurt people badly since. Read Muir\'s account instead.',
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
      'A maintained trail to the highest of the Three Brothers, nearly seven miles one way, with El Capitan just to the west at eye level for once. Carry three liters.',
    body:
      'About 13 miles round trip with about 3,800 feet of gain; budget eight to nine hours and start early. Eagle Peak is the highest of the Three Brothers, west of Yosemite Falls, with a maintained trail to the top. From the Yosemite Falls Trailhead behind Camp 4 it is about six and a half miles one way: up the falls trail, past the top of the upper fall, then through Eagle Peak Meadows to the summit spur.\n\nThe summit looks down the full length of the valley: the Merced on the floor, Half Dome and Clouds Rest at the far end, El Capitan just west and level with you, its summit slabs rolling into the 3,000-foot face.\n\nThere is no reliable water past Yosemite Creek and the upper switchbacks bake in the afternoon. Hat, three liters, and a turnaround time.',
    history: {
      note:
        'The naturalists ran this as a guided day in the 1930s. A 1935 Nature Notes ' +
        'account has a bus carrying the group from the valley floor up to Gentry on ' +
        'the Big Oak Flat Road, from where they hiked to El Capitan and Eagle Peak ' +
        'and came back down by the Yosemite Falls Trail. The bus and the road are ' +
        'gone. The traverse is not.',
      volume: 14,
      number: 6,
      issueDate: 'June 1935',
    },
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
    photos: [{ src: '/photos/snow-creek-trail.jpg', caption: 'Tenaya Canyon from the south rim in an A.C. Pillsbury photograph, Half Dome at right. The Snow Creek switchbacks climb the canyon\'s north wall, on the left.' }],
    hazard:
      'The switchbacks are shadeless by mid-morning and there is no water between Tenaya Creek and Snow Creek. Do not leave the trail toward Tenaya Canyon; the gorge below is technical terrain where hikers have died.',
    teaser:
      'The steepest maintained way out of the valley: 2,600 feet in about two and a half miles up dozens of switchbacks, each one reframing Half Dome and Tenaya Canyon.',
    body:
      'The steepest maintained trail out of the valley and the least used: 2,600 feet of gain in about two and a half miles of switchbacks up the wall of Tenaya Canyon, starting past Mirror Lake. The usual day is out-and-back to the rim from the Mirror Lake shuttle stop, about nine and a half miles round trip, six to seven hours. With two cars, strong parties go one way: up Snow Creek, across the rim past North Dome, out at the Porcupine Creek trailhead on Tioga Road.\n\nApril through October is the easy season; in winter the lower switchbacks can ice over. Carry more water than the mileage suggests. Every switchback gives a view of Half Dome, Clouds Rest, and the canyon.\n\nDo not attempt Tenaya Canyon itself. The gorge between Mirror Lake and Tenaya Lake is a technical canyoneering route with mandatory swims and rappels, the park map warns against it, and it has killed experienced people.',
    history: {
      note:
        'There was a lodge at the top of these switchbacks. A 1931 Nature Notes ' +
        'ski-touring account has the party stopping for coffee at the Snow Creek ' +
        'Ski Lodge, 4,000 feet above the valley, where the cook kept a tame marten ' +
        'that came to the door for scraps and was regularly seen by guests and ' +
        'guides. Nothing is served up there now.',
      volume: 10,
      number: 4,
      issueDate: '1931',
    },
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
    photos: [{ src: '/photos/three-chutes-falls.jpg', caption: 'Tenaya Creek in its canyon below Half Dome, photographed by Arthur Pillsbury around 1900. Three Chutes is a mile up this creek.' }],
    hazard:
      'Past the loop\'s upstream footbridges, any crossing of Tenaya Creek is a ford. In May and June the current is fast and cold enough to knock an adult down; if the water is over your knees, this is a viewpoint, not a swim. Do not continue past the falls into upper Tenaya Canyon.',
    teaser:
      'Half a mile up Tenaya Creek past the upstream end of the Mirror Lake loop, the creek drops eighty feet through three granite chutes. Best in spring.',
    body:
      'From the upstream end of the Mirror Lake loop, follow Tenaya Creek about half a mile into the lower canyon, where the creek drops eighty feet through three granite chutes into a string of pools. Added to a [Mirror Lake](/stop/mirror-lake) morning, the outing is at least five miles round trip from the shuttle stop. The going is boulders and braided use trails along the creek: walking, not scrambling.\n\nSpring brings the most water and the most danger. Read the hazard note before any crossing, and in high snowmelt stay on the near bank. By midsummer the pools are calm, with boulders for lunch and few people.',
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
    season: 'March to June',
    coord: [-119.5915, 37.7452], // verified 2026-07: Cook's Meadow floor viewing ground (lot-scale)
    elevationFt: 4000,
    timeBudgetMin: 90,
    photos: [{ src: '/photos/valley-ephemeral-falls.jpg' }],
    teaser:
      'Sentinel Fall, Staircase Falls, Royal Arch Cascade, Lehamite: the valley\'s second set of waterfalls, running a few weeks each spring beside famous neighbors.',
    body:
      'March through May, and the days after any hard rain, several short-lived falls run beside the famous ones. Look up at the walls between landmarks on any valley-floor walk. By July most are dry.\n\nSentinel Fall drops roughly 2,000 feet in stages from the wall west of Sentinel Rock; see it from Southside Drive near Sentinel Beach. Staircase Falls comes down 1,300 feet of granite steps on the wall behind Curry Village. Royal Arch Cascade streams down the wall near the Ahwahnee after rain. Lehamite Falls drops 1,180 feet out of Indian Canyon about a mile east of Yosemite Falls.\n\nThe Ledge Trail to Glacier Point and the Sierra Point overlook above Happy Isles both appear on old postcards. The first was still open in the 1940s before the park abandoned it; the park let the second go after rockfall in the 1970s. Both are closed for cause, with fatalities behind the decision. The scramble to the summit of Sentinel Rock belongs to climbers. This guide gives directions to none of them.',
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
      'Stand at Tunnel View and look right instead: Silver Strand runs at the west end, and Widow\'s Tears drops well over a thousand feet for a few weeks of hard snowmelt.',
    body:
      'Two short-lived falls visible from [Tunnel View](/stop/tunnel-view) or [Artist Point](/stop/artist-point), no extra miles. In spring, look right of Bridalveil at the south wall west of the fall. Silver Strand Falls drops off the rim where Meadow Brook goes over, the westernmost waterfall in the valley. One drainage over is Widow\'s Tears, a slender plunge of well over a thousand feet that runs for only a few weeks of hard snowmelt. The name is Victorian humor: a widow\'s tears, the saying went, are the first to stop. Binoculars help; after a storm both can run at once.',
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
    coord: [-119.7033, 37.6524], // TODO: verify on the ground — moved 2026-09 to the Glacier Point Rd / Wawona Rd junction (OSM); the July pin sat inside the private Yosemite West subdivision
    timeBudgetMin: 120,
    teaser:
      'Sixteen miles from Chinquapin to Glacier Point, and the road is the experience: Pothole Meadows, the Sentinel Dome lot, Washburn Point. Give it three or four hours.',
    body:
      'Sixteen miles from the Chinquapin junction to Glacier Point. Plan three to four hours for the round trip with stops, not one. The road is closed November through May (sometimes longer); in winter, swap this region for a Hetch Hetchy day.\n\nStops on the way: Pothole Meadows (mile 10) for early-summer wildflowers, the Sentinel Dome / Taft Point trailhead (mile 13.6), and Washburn Point (mile 15.5), whose Half Dome and Vernal-Nevada view is arguably better than Glacier Point\'s.',
    photos: [{ src: '/photos/mcgurk-meadow.jpg', caption: 'Lower McGurk Meadow, one of the Glacier Point Road meadows the drive passes.' }],
    history: {
      note:
        'In 1943 Park Naturalist C. Frank Brockman traced this road to the company ' +
        'a group of men formed in 1874 with Washburn, Chapman and Moore, then ' +
        'operating Wawona, to build a toll road to the Valley, incorporated in 1877 ' +
        'as the Yosemite Stage and Turnpike Company. The whole system, Raymond to ' +
        'Wawona, the Mariposa Grove road, and the Chinquapin to Glacier Point unit, ' +
        'completed in 1882, cost $76,750. In 1917 the tolls from Wawona to the ' +
        'south rim, Glacier Point road included, passed to the federal government ' +
        'and were abolished.',
      volume: 22,
      number: 7,
      issueDate: 'July 1943',
    },
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
      'A five-mile loop takes both viewpoints in one walk: Sentinel\'s 360-degree panorama and Taft\'s open cliff edge, joined by a little-used stretch of rim trail.',
    body:
      'The Sentinel Dome to Taft Point loop: 5 miles, about 1,000 ft of gain, both viewpoints in one walk, in either order. Sentinel is the 360-degree panorama: Half Dome, El Capitan, the Clark Range, the high country to the north. Taft is the cliff edge over the valley. Bring lunch and allow thirty minutes on top of Sentinel.\n\nThe connector, a stretch of the Pohono Trail through rim forest with Yosemite Falls in and out of view, sees far less traffic than either point, because most visitors do the two as separate out-and-backs from the shared lot.',
    photos: [{ src: '/photos/milky-way-sentinel-dome.jpg', caption: 'Sentinel Dome at night, Milky Way over the panorama.' }],
    swap:
      'If you only have time for one, Sentinel Dome alone is 2.2 miles round trip with about 450 feet of gain, easier than it looks, and the better introduction. [Taft Point](/stop/taft-point) alone is the same 2.2 miles with even less climbing (~250 ft), but the cliff edge is the whole point: go if heights don\'t bother you.',
    history: {
      note:
        'The Jeffrey pine on the summit was already the point of the walk when ' +
        'Ranger-Naturalist Art Carthew wrote it up for Nature Notes in 1940, ' +
        'calling it one of the favorite subjects of photographers and of those who ' +
        'appreciate the staunch battle the old tree has been forced to wage against ' +
        'the winds and storms. The tree lost that battle in a drought and came ' +
        'down. People still walk up expecting it.',
      volume: 19,
      number: 5,
      issueDate: 'May 1940',
    },
    photoTiming: {
      best: 'sunset',
      note:
        'The loop shares Taft Point\'s sunset light, with El Capitan and the high country going gold from the open summit.',
    },
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
    hazard:
      'The point is an open cliff edge high over the Valley, with one small section of railing at the tip and nothing else between you and the air, and the Fissures beside it drop as much as 2,000 feet; people have died here taking photographs. Stay twenty feet back, keep children in hand, and treat the whole rim as the edge, because in places the Fissures mean it is.',
    teaser:
      'A gentle 2.2 miles to the Fissures and an unrailed cliff edge, with El Capitan in profile across the void. The view from twenty feet back is just as good.',
    body:
      '2.2 miles round trip, mostly gentle, from the shared Sentinel Dome / Taft Point lot at mile 13.6 on Glacier Point Road, dropping slightly through forest onto open granite. Just before the point are the Fissures, deep cracks where you can look straight down through the cliff to the trees below. The point is an open cliff edge high over the Valley floor, the Fissures beside it as deep as 2,000 feet, and apart from one small section of railing at the tip there is no barrier. El Capitan is in profile across the valley.\n\nPeople have died here taking photographs. The view from twenty feet back is nearly the same and far safer. Keep children in hand and treat the whole rim as the edge, because the fissures make it one.\n\nSunset is the popular hour, when El Capitan goes gold. Bring a headlamp per person, not per group, for the walk back in the dark, and a layer for the late-afternoon wind.',
    swap:
      'If a sheer edge at dusk is not your group\'s idea of a good time, [Sentinel Dome](/stop/sentinel-dome) leaves from the same lot: 2.2 miles round trip to a bare granite summit at 8,122 feet with a 360-degree panorama and no exposure. Same sunset, safer seat.',
    photoTiming: {
      best: 'sunset',
      note:
        'Sunset is the famous hour here: the light comes up the valley and lights El Capitan gold across the void.',
    },
    history: {
      note:
        'Ranger-Naturalist Enid Michael wrote in January 1939 of the rarities she ' +
        'and Mr. Michael had met in their years in the valley. One was the small ' +
        'yellow-flowered violet Viola sheltoni, found by accident one early spring ' +
        'after they slid down the snow chute west of Taft Point as a shortcut to the ' +
        'valley floor. They were well down on the talus, following a bear trail ' +
        'through the woods, when they came on it; the deeply cut, many-fingered leaf ' +
        'was what set it apart from the district\'s other yellow violets.',
      volume: 18,
      number: 1,
      issueDate: 'January 1939',
    },
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
      'A big paved pullout a mile before Glacier Point, two minutes from the car. Washburn has the fuller Half Dome: the sheer face and domed back in one profile, with Vernal and Nevada Falls stacked in the Merced canyon below. Glacier Point\'s rim hides the falls.\n\nIt has a fraction of the Glacier Point crowd and no services: no snack bar, no gift shop, no water. Stop here first on the way in. On July afternoons when the Glacier Point lot is full, make this the stop: you lose the eye-level Half Dome and the valley-floor drop, and keep the falls and the Clark Range.',
    history: {
      note:
        'The Yosemite Book, the state survey\'s guide of 1868, called Half Dome ' +
        'perfectly inaccessible, probably the only one of the prominent points ' +
        'above the Yosemite which never has been, and never will be trodden by ' +
        'human foot. Nature Notes quoted the line in 1943, noted that it had been ' +
        'disproved in 1875, and added that first-time visitors to this view ' +
        'generally feel the same way.',
      volume: 22,
      number: 10,
      issueDate: 'October 1943',
    },
    photoTiming: {
      best: 'sunset',
      note:
        'This pullout shares Glacier Point\'s evening light on Half Dome a mile up the road, with a fraction of the crowd and none of the amenities.',
    },
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
      'Half Dome at eye level, the valley floor 3,200 feet below, the waterfalls visible end to end. Avoid noon to four: parking is hard and the light is flat. From 4:30 p.m. the lot empties and the light warms; stay through sunset if you can, and drive back slowly in the dark. In summer the Yosemite Guide lists evening programs here, star parties on some nights and a ticketed stargazing program.\n\nGlacier Point Road is plowed open after winter, typically in May, and the first weeks are the quiet ones: easy parking, skeletal amenities, water possibly not yet running, and snow at the trailheads and shaded meadows into late spring. Check the Park Service road-status page the night before, bring your own water, and go early.',
    photos: [{ src: '/photos/half-dome-eye-level.jpg', caption: 'Half Dome at eye level, with the high country stacked behind it.' }],
    swap:
      'If parking is hopeless, the [Four-Mile Trail](/stop/four-mile-trailhead) goes from Glacier Point down to the valley floor (4.8 miles, 3,200 ft loss). Park one car at the bottom, drive the other up. Knees take the hit, not your patience.',
    history: {
      note:
        'The firefall began as one man\'s after-dinner trick. Nature Notes ran its ' +
        'history in 1934: James McCauley, who reached the valley in 1870 and built ' +
        'the Mountain House up here in 1878, pushed his campfire embers over the ' +
        'cliff for his guests, who went down to the valley floor to watch. The ' +
        'orders became so numerous that he settled on charging $1.50 a fall.',
      volume: 13,
      number: 6,
      issueDate: 'June 1934',
    },
    photoTiming: {
      best: 'sunset',
      note:
        'Come in the last hour before sunset to watch warm light climb Half Dome as the shadow rises up its face.',
    },
  },
  {
    id: 'mariposa-grove',
    title: 'Mariposa Grove of Giant Sequoias',
    region: 'glacier-mariposa',
    order: 6,
    kind: 'trailhead',
    coord: [-119.63, 37.5068], // TODO: verify on the ground — moved 2026-09 to the Welcome Plaza: NPS places, NPS parkinglots, the plaza shuttle stop and the OSM lot agree within 81 m
    elevationFt: 5600,
    timeBudgetMin: 180,
    teaser:
      'Park at the Welcome Plaza, ride the free shuttle up, and walk the two-mile Grizzly Giant Loop among the largest trees on earth. Late afternoon empties the grove.',
    body:
      'Park at the Welcome Plaza and ride the free shuttle two miles up to the grove. The shuttle runs about every 15 minutes from spring (never before mid-April) through November; first run at 8 a.m., and in summer the last ride up is around 7 p.m., with a final bus down at 8. The service day shortens from late September, so check current hours.\n\nWalk the Grizzly Giant Loop (2 miles, 300 ft of gain): the Fallen Monarch, the Bachelor and Three Graces, the Grizzly Giant (around 3,000 years old), and the California Tunnel Tree just past it. Late afternoon is less crowded. These are giant sequoias, not redwoods: the largest trees on earth by volume, growing only in this strip of the Sierra.\n\nThe black scars on the trunks are from fire the trees survived. Mature sequoia bark runs up to two feet thick, fibrous and rich in tannin, and barely conducts heat, so a ground fire chars the surface while thinner-barked white fir and incense cedar die. The seeds, no bigger than an oat seed, need the bare, ash-enriched soil and sunlight a burn opens up. After a century and a half of suppression left the groves crowded, the park now sets low-intensity burns in Mariposa.',
    swap:
      'If you have stamina, the [Guardians Loop](/hike/mariposa-grove-guardians-loop) (6.5 miles, 1,200 ft) takes you up to the upper grove. Most visitors don\'t make it that far, which is the point.',
    photos: [{ src: '/photos/mariposa-grove.jpg' }],
    history: {
      note:
        'Nature Notes printed a walking guide to this grove in 1931 that reads like ' +
        'an inventory: Texas Tree, 267 feet high and 20.4 feet through at the base; ' +
        'Columbia Tree, 290 feet and the second tallest in the grove. It counted ' +
        'roughly 200 trees over ten feet in diameter in one square mile, credited ' +
        'Galen Clark with the 1857 discovery while allowing that other people had ' +
        'certainly been there earlier, and described the log cabin museum as a 1930 ' +
        'reproduction standing where Clark\'s hospice once did.',
      volume: 10,
      number: 6,
      issueDate: 'June 1931',
    },
    photoTiming: {
      best: 'golden-pm',
      note:
        'Late afternoon turns the canopy gold and empties the grove of the day\'s crowd.',
    },
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
    // Source: Yosemite Guide Vol 51 Issue 6 (July 15 - August 18, 2026);
    // seasonal closing dates from Vol 51 Issue 8 (September 23 - November 24, 2026).
    hazard:
      'The Wawona Hotel and its dining room are closed for renovation, with no reopening date published, so the lobby bar and the lunch walk-in below are off the table for now. The grounds and the history center stay open; the golf course closes for the season after October 25, 2026, and the visitor center after October 31. Confirm at travelyosemite.com before planning a meal here.',
    teaser:
      'The 1876 hotel\'s white verandas, the Wawona covered bridge, and the Pioneer Yosemite History Center\'s relocated cabins and coaches. The easy add to a Mariposa Grove day.',
    body:
      'The Wawona Hotel opened in 1876 as the stagecoach stop between the railhead and the valley and is still a hotel: white Victorian buildings around a lawn, wide verandas, a national historic landmark. When the hotel is open, the porch is open to anyone; order a drink from the lobby bar. Across the road is the 1918 nine-hole golf course. The small building beside the hotel was the studio of Thomas Hill, whose paintings of this landscape helped argue for its protection; in season it is the Wawona visitor center.\n\nFive minutes north on foot, the Pioneer Yosemite History Center gathers buildings moved from around the park: a Wells Fargo office, homestead cabins, a jail, and a barn of the stagecoaches that ran the Wawona road. You enter across the Wawona covered bridge, built by Galen Clark in 1857 and later roofed by the Washburns in the style of their native Vermont. In summer there are open exhibits, a working blacksmith, and short horse-drawn wagon rides; the rest of the year the buildings are closed but the grounds are open.\n\nIt pairs with the [Mariposa Grove](/stop/mariposa-grove), ten minutes south, and with [Chilnualna Falls](/stop/chilnualna-falls) and the [meadow loop](/stop/wawona-meadow-loop) for a full Wawona day. When the hotel dining room is running, it takes lunch walk-ins far more easily than dinner.',
    photos: [{ src: '/photos/wawona-hotel-history-center.jpg', caption: 'The Wawona Hotel\'s white verandas across its lawn. The history center is a short walk past it.' }],
    history: {
      note:
        'The covered bridge was nearly lost. Nature Notes reported in November 1957 ' +
        'that the original, built sometime before 1874, had been mortally wounded by ' +
        'the floods of the 1955 winter and was dismantled and restored as a Mission ' +
        '66 project, one of the first steps toward the Wawona pioneer village. New ' +
        'timbers were hand ' +
        'hewn from ponderosa pine, square nails matched the old ones, and the ' +
        'finished bridge, two trusses 14 feet apart with a 106-foot clear span, was ' +
        'pulled back into place along steel beams in about five hours.',
      volume: 36,
      number: 11,
      issueDate: 'November 1957',
    },
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
      'The Pohono Trail past Dewey Point: 9 to 10.5 miles round trip for the west valley from above, Bridalveil straight below its rim, and very few people.',
    body:
      'From the Dewey Point trailhead on Glacier Point Road: 9.2 miles round trip for Dewey and Crocker Points, about 10.5 for Dewey, Crocker, and Stanford. Crocker is half a mile past Dewey, Stanford another six tenths past that, along the Pohono Trail through rim forest with open granite at each point. Dewey sees a handful of hikers a day; the other two see fewer.\n\nThe views: Bridalveil Fall from directly over its rim, Ribbon Fall\'s full 1,612 feet in spring, El Capitan in profile. Turn around at whichever point suits the group.\n\nJune through October, whenever Glacier Point Road is open. Carry water for the full distance; there is none on the rim.',
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
      'An easy 1.6 miles round trip to a pocket meadow with one of the park\'s best wildflower shows and an 1890s sheepherder\'s cabin at the door.',
    body:
      'About 1.6 miles round trip at an easy grade from a signed pullout on Glacier Point Road, to a pocket meadow under a mile off the road with one of the park\'s best wildflower displays: shooting star and camas early, then paintbrush, corn lily, and lupine through July. Go early or late in the day for better light and deer at the meadow edges.\n\nBefore the meadow the trail passes a one-room log cabin with a low door. It belonged to John McGurk, who summered sheep here in the 1890s until the new park pushed the flocks out.\n\nThe trail continues past the meadow to join the Pohono Trail toward [Dewey, Crocker, and Stanford Points](/stop/crocker-stanford-points) for a longer day.',
    history: {
      note:
        'The cabin in the meadow made a 1956 Nature Notes survey of the park\'s ' +
        'surviving pioneer buildings. It logs a stockman\'s cabin one mile west of ' +
        'Bridalveil Creek and about a mile north of the Glacier Point road, built ' +
        'of lodgepole logs notched on the under side only, and puts it in the same ' +
        'construction as the cabin standing in Mono Meadows.',
      volume: 35,
      number: 9,
      issueDate: 'September 1956',
    },
    photoTiming: {
      best: 'golden-am',
      note:
        'Morning light softens the meadow and tends to bring deer out to its edges.',
    },
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
    coord: [-119.6194, 37.6617], // TODO: verify on the ground — moved 2026-09 ~230 m to the trailhead: Recreation.gov and OSM agree within 35 m
    elevationFt: 7000,
    timeBudgetMin: 150,
    photos: [{ src: '/photos/bridalveil-creek-trail.jpg' }],
    teaser:
      'A flat walk in lodgepole forest along the creek that becomes Bridalveil Fall, with very few people. Good for a tired day.',
    body:
      'A flat walk in lodgepole forest along Bridalveil Creek, meadows on the first half, creek on the second, with very few people. Start near the Bridalveil Creek campground turnoff on Glacier Point Road; two to four miles out and back is the usual shape. No climb. Dippers work the riffles. This is the creek that becomes Bridalveil Fall a few miles north.\n\nJune through October, early summer for the meadow bloom. Mosquitoes are heavy in June; bring repellent or come in August.',
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
    photos: [{ src: '/photos/ostrander-lake.jpg', caption: 'Ostrander Lake\'s granite shore below Horse Ridge, the hut a short walk from here.' }],
    teaser:
      'Twelve miles round trip to a granite-shored lake under Horse Ridge, past the 1941 ski hut. Gentle first half, then a steep climb, 1,500 feet in all. A full day.',
    body:
      'Twelve miles round trip off Glacier Point Road to a lake under Horse Ridge, usually quiet even in summer. The first half is gentle, on old roadbed through meadows and recovering burn with July wildflowers; the second half climbs, about 1,500 feet total, with views across the Illilouette drainage to the Clark Range.\n\nThe stone building above the shore is the Ostrander Ski Hut, built in 1941 and run for winter reservations. In summer it is closed; the lake has granite shores and cold water swimmable by August.\n\nA full day: start early and carry real water. July through September; earlier there is snow on the ridge.',
    history: {
      note:
        'The hut at the lake is the one announced in this issue. Nature Notes ' +
        'reprinted the Park Service release for the new Ostrander Lake Ski Hut and ' +
        'the marked touring trails leading to it, including the line that anyone ' +
        'wanting to use it must register in advance with the ranger at Badger Pass ' +
        'to assure the availability of a bunk. You still have to ask first. It is a ' +
        'lottery now.',
      volume: 20,
      number: 1,
      issueDate: 'January 1941',
    },
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
    coord: [-119.6576, 37.5351], // TODO: verify on the ground — moved 2026-09 ~120 m to NPS places "Wawona Meadow Loop Trailhead"
    elevationFt: 4000,
    timeBudgetMin: 120,
    photos: [{ src: '/photos/wawona-meadow-loop.jpg' }],
    teaser:
      'A flat 3.5-mile loop across from the Wawona Hotel, one of the least-visited maintained trails in the park. It is not dramatic. That is the point.',
    body:
      'A flat 3.5-mile loop around the meadow across from the Wawona Hotel, on an old road under ponderosa and incense cedar, one of the least-visited maintained trails in the park. Start across the road from the hotel near the golf course and walk either direction. Spring brings wildflowers along the fence lines; summer evenings bring deer.\n\nWawona sits low, so the loop works year-round, including winter when the high country is shut. Use it before the Mariposa Grove shuttle, on a recovery day, or pair it with [Chilnualna Falls](/stop/chilnualna-falls) for a full Wawona day.',
    photoTiming: {
      best: 'golden-pm',
      note:
        'Summer evenings bring soft light and deer to the meadow, the best hour for this easy walk.',
    },
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
    photos: [{ src: '/photos/chilnualna-falls.jpg', caption: 'The lower cascades of Chilnualna Falls sliding into their pool. The main fall is above.' }],
    hazard:
      'The granite beside the cascades is water-polished and slick, and the current above the drops is faster than it looks. People have died sliding here. Watch the falls from the trail, not from the rocks beside the water.',
    teaser:
      'Five major cascades and 8.4 miles round trip out of Wawona, practically deserted while the Mist Trail shuffles. The lower gorge pays off within half an hour.',
    body:
      '8.4 miles round trip with over 2,000 feet of gain, from the end of Chilnualna Falls Road in Wawona, beside a chain of five major cascades. It sees far fewer people than the Mist Trail.\n\nThe lower cascades, in a rocky gorge within half an hour of the trailhead, make a complete short outing for families. The full climb is a real day: switchbacks through oak and manzanita, then pine, to the top falls pouring through bare granite above the Wawona basin.\n\nPeak flow is late spring into early summer; the trail is open year-round, and autumn is quiet. Carry water for the full climb. The lower gorge is dangerous; read the caution before anyone leaves the trail.',
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
      'About 46 miles from Crane Flat to Tioga Pass at 9,945 feet, fir forest opening into granite domes and meadows. Gas up at Crane Flat; there is none on the road.',
    body:
      'About 46 miles from Crane Flat to Tioga Pass (9,945 ft). Gas up at Crane Flat; there is no gas on Tioga Road. Tioga is closed November through May (sometimes longer). When it opens, typically late May or early June, the first two weeks bring snowmelt and little traffic. Driven straight through it is under two hours; with stops it is a full day.\n\nWest to east: [Crane Flat](/stop/crane-flat-meadow) for gas and the bear meadow, [White Wolf](/stop/white-wolf) for a leg stretch, [Olmsted Point](/stop/olmsted-point), [Tenaya Lake](/stop/tenaya-lake) for lunch, the meadows for the afternoon, and [Tioga Pass](/stop/gaylor-lake) if there is time.\n\nThe road follows the Great Sierra Wagon Road, built over the crest in 1883 to serve a silver mine that failed almost immediately, later bought for the public and rebuilt as the modern highway in 1961. A few original stretches survive as spur roads, including the one to [May Lake](/stop/may-lake). Eastbound, the road climbs from fir forest through lodgepole pine to granite domes and meadows in about ninety minutes.',
    photos: [{ src: '/photos/tioga-road-drive.jpg', caption: 'Tuolumne Meadows, the high-country payoff.' }],
    history: {
      note:
        'You are driving on a road somebody bought. A 1932 Nature Notes ' +
        'appreciation of Stephen Mather, the Park Service\'s first director, listed ' +
        'the projects he paid for out of his own fortune, and named among them the ' +
        'purchase of the old Tioga toll road in Yosemite National Park and the ' +
        'building of the Rangers\' Club.',
      volume: 11,
      number: 7,
      issueDate: 'July 1932',
    },
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
    photos: [{ src: '/photos/crane-flat-meadow.jpg', caption: 'The forest edge at Crane Flat, where the Big Oak Flat and Tioga Roads meet.' }],
    teaser:
      'The big meadow at the Tioga Road junction is one of the most consistent places in the park to see a black bear. Pull over, stay at the edge, and scan the far tree line at dawn or dusk.',
    body:
      'The last gas before Tioga Pass, and across the junction where Tioga Road leaves Big Oak Flat Road, a subalpine meadow at 6,200 feet that is one of Yosemite\'s most consistent bear-viewing areas. Black bears graze the grass in spring and early summer and work the forest edge for grubs and berries through the season, mostly in the first and last hours of light.\n\nPark in a legal pullout, stay at the meadow edge or beside the car, and glass the far tree line. Keep at least 150 feet, never walk into the meadow toward a bear, and if a bear stops feeding to look at you, you are too close. Bring binoculars.\n\nThe meadow has wildflowers into July, and the [Tuolumne Grove sequoias](/stop/tuolumne-grove-old-road) start half a mile east. The full bear-watching guide is in [Where to actually see a bear](/essentials/bear-viewing).',
    swap:
      'No bear on your pass through? Come back at dawn, when the meadow is frosted and empty of people, or fold it into the Tioga Road drive on the way out. Midday odds are poor; the bears are bedded in the forest.',
    history: {
      note:
        'The sequoias below this junction were found by accident. Nature Notes ' +
        'reconstructed the day from Dr. J. L. Cogswell\'s own account: on May 10, ' +
        '1858, a party camped at Crane Flat set out after a deer one of them had ' +
        'wounded at dusk, followed the track north over the rise and a quarter mile ' +
        'down the far slope, and walked into the Tuolumne Grove. We were so greatly ' +
        'surprised at the monstrous size, Cogswell wrote, we thought no more of the ' +
        'deer.',
      volume: 16,
      number: 8,
      issueDate: 'August 1937',
    },
    photoTiming: {
      best: 'golden-pm',
      note:
        'Bears are most reliable working the meadow edge in the last hour of daylight, when the light across the grass is softest too.',
    },
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
      'A short spur north off Tioga Road, about half an hour east of Crane Flat, to a meadow at 8,000 feet ringed by lodgepole pine, with a camp of white tent cabins that has served Tioga travelers since the 1920s and a small campground. The lodge and its cabins are closed for the 2026 season for sewer-line repairs (the dining directory tracks the details), and its seasons have been irregular in recent years, so confirm any meal or cabin plan. The meadow and trailheads are the reliable draw.\n\nTwo easy walks: Harden Lake, about 5.8 miles round trip on nearly flat old roadbed from the White Wolf road-end, to a boulder-dotted forest lake; and Lukens Lake, from a signed trailhead two miles east on Tioga Road, a 1.6-mile round trip over a forested rise to a shallow lake with one of the park\'s best July wildflower meadows. Neither has real switchbacks.\n\nDeer work the meadow edges at dusk. Use White Wolf as a leg stretch on the drive east, or as a first high-country night to adjust to altitude before Tuolumne.',
    photos: [{ src: '/photos/white-wolf.jpg', caption: 'The White Wolf Lodge dining building, a mile off Tioga Road.' }],
    history: {
      note:
        'A 1939 Nature Notes survey asked valley campers which of the park\'s other ' +
        'campgrounds they used. The answers ranked Tuolumne Meadows, Mariposa ' +
        'Grove, Tenaya Lake, Glacier Point, Wawona, White Wolf, Yosemite Creek. ' +
        'White Wolf came sixth then, and it holds roughly the same place now: ' +
        'known, and skipped.',
      volume: 18,
      number: 6,
      issueDate: 'June 1939',
    },
    photoTiming: {
      best: 'golden-pm',
      note:
        'Deer work the meadow edges at dusk, the quietest and softest-lit hour to be here.',
    },
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
      'A short walk from the parking lot to a granite slab scattered with glacial erratics, boulders left when the ice melted. Clouds Rest fills the view, with the back side of Half Dome over its left shoulder.\n\nClouds Rest is 4,500 feet of bare granite, the largest continuous rock face in the park. Take the quarter-mile trail from the lot down to the point itself: the angle improves, the crowd thins, and the erratics on the open slab, some the size of cars, sit where the ice left them.\n\nDriving back west at the end of a Tuolumne day, stop again: late sun rakes across the granite and Half Dome goes gold.',
    photos: [{ src: '/photos/olmsted-point.jpg', caption: 'Half Dome from the high country side.' }],
    history: {
      note:
        'A 1944 Nature Notes roster of everyone who had administered the Yosemite ' +
        'Grant since 1864 opens with Frederick Law Olmsted, chairman of the first ' +
        'commission from September 28, 1864 to May 21, 1866. It reprints his own ' +
        'account of the job: to take possession of the Valley for the State, to ' +
        'organize and direct the survey. The name on this turnout is his family\'s.',
      volume: 23,
      number: 6,
      issueDate: 'June 1944',
    },
    photoTiming: {
      best: 'sunset',
      note:
        'Stop again on the drive back west at day\'s end: late sun rakes the granite slab and lights Half Dome gold in the distance.',
    },
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
      '1.2 well-graded miles each way to a lake at 9,329 feet under Mount Hoffmann. Cold but swimmable on a warm afternoon; a good moderate hike for families.',
    body:
      '1.2 miles each way with about 500 feet of gain on a well-graded trail through lodgepole pine and open granite. Turn north off Tioga Road onto the Old Tioga Road spur (a couple of miles west of Olmsted Point) and follow it 1.7 miles to the trailhead parking. The grade is steady but not steep, a good pick for kids.\n\nMay Lake sits at 9,329 ft with Mount Hoffmann (the geographic center of the park) above the north shore. The water is cold but swimmable on a warm afternoon from the granite slabs on the east side; the park closes the water near the High Sierra Camp\'s water intake to swimming, so keep clear of it. Bring a towel and lunch. Stronger hikers can go another 2 miles and 1,500 ft to the summit of Hoffmann (10,850 ft) for a 360-degree view of the park.',
    swap:
      'The trailhead spur road is rough dirt, passable in any car taken slowly, but it rattles. If the parking lot is full (it holds maybe twenty cars), there is no overflow; come back early next morning or skip to [Tenaya Lake](/stop/tenaya-lake). The lake holds snow into late June some years; check conditions before late-spring trips.',
    history: {
      note:
        'Mount Hoffmann, the peak standing over the lake (10,921 feet by the ' +
        'survey of the day; modern maps say 10,850), is the geographical center ' +
        'of Yosemite National Park. Ranger-Naturalist Arthur Carthew opened his ' +
        '1940 Nature Notes account of climbing its summit block with that fact, ' +
        'adding that the mountain is readily accessible from the May Lake camp ' +
        'snuggled at its base.',
      volume: 19,
      number: 3,
      issueDate: 'March 1940',
    },
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
      'Use the east beach. Granite cliffs on the south side, lodgepole forest on the north, Polly Dome at the west end. The water is 55–60°F even in August: short swims only. In late May the lake is often still partly iced; by July the edges are sun-warmed. Stop here for lunch on the rocks.\n\nThe lake is named for Tenaya, the Ahwahneechee chief whose people were driven from the valley by the Mariposa Battalion in 1851 and pursued into this high country. His people called it Pywiack, lake of the shining rocks, for the glacier-polished granite along the south shore.\n\nA mostly flat loop circles the lake in about 2.5 miles on sand, slabs, and boardwalk, with the south shore under the polished cliffs. Paddlers carry in boards and kayaks for calm morning water; by early afternoon the wind brings whitecaps.',
    history: {
      note:
        'A 1931 Nature Notes itinerary for the High Sierra camps stopped here for ' +
        'the rock rather than the water. At Lake Tenaya glacial pavements may be ' +
        'seen at their best, it says: entire acres of brilliant gleaming polish, ' +
        'and the pressure exerted by the ice to produce it must have been ' +
        'tremendous. Walk fifty yards off the beach onto the slabs and you are ' +
        'standing on the sentence.',
      volume: 10,
      number: 5,
      issueDate: 'May 1931',
    },
    photoTiming: {
      best: 'golden-am',
      note:
        'Morning is calmest here, with glass-flat water for paddling before the afternoon wind picks up and turns the lake to whitecaps.',
    },
  },
  {
    id: 'cathedral-lakes',
    title: 'Cathedral Lakes',
    region: 'tuolumne',
    order: 7,
    kind: 'trailhead',
    photos: [{ src: '/photos/cathedral-lakes.jpg', caption: 'Tuolumne high country, the landscape Cathedral Lakes sits in.' }],
    coord: [-119.374706, 37.872634], // verified 2026-07: Cathedral Lakes Trailhead parking at the Tuolumne Meadows Visitor Center (NPS TH data; VC at 37.8716,-119.3742 per Wikidata); prior pin sat ~1.4 km east at the store/campground
    elevationFt: 8560,
    timeBudgetMin: 360,
    teaser:
      'About eight miles round trip from the relocated Tuolumne Meadows trailhead to a lake at 9,288 feet with Cathedral Peak rising straight out of the water.',
    body:
      'The trailhead is at the Tuolumne Meadows Visitor Center. 7.6 miles round trip to Upper Cathedral Lake by the park\'s count (1,000 ft of gain), about the same to Lower Cathedral on its short spur, or about 9 miles for both. Plan 5–7 hours with lake time. Best mid-July through mid-September; the trail can hold snow into late June. Bring layers.\n\nYou start around 8,500 feet, so the first forested miles feel harder than the gain suggests; don\'t rush the ascent. At the spur junction near the top, choose. Lower Cathedral, at 9,288 ft, is the one in the photographs: a granite ramp to the south shore with Cathedral Peak, the granodiorite peak John Muir camped on in 1869, rising from the water. Upper Cathedral, a short way on up the main trail, is smaller, colder, and quieter. Both adds distance and a descent and re-ascent; do the Lower first.\n\nAt 9,500 feet the basin is fully exposed, and afternoon thunderstorms build fast in July and August. Carry a rain shell in those months and be off the open granite and heading down by early afternoon if storms are forecast. UV is intense; cover up. Carry three liters; there\'s no reliable water between the trailhead and the basin.',
    swap:
      'If an eight-mile hike is too much, do the [Pothole Dome](/stop/pothole-dome-sunset) short scramble at the west end of Tuolumne Meadows instead (1 mile round trip, ~200 ft, 360-degree view). [Soda Springs / Parsons Lodge](/stop/soda-springs-parsons-lodge) from there is another easy 1.5 miles round trip.',
    history: {
      note:
        'The naturalists\' 1931 list of day trips out of Tuolumne Meadows has this ' +
        'one at number five: Budd Lake, Cathedral Lake and Cathedral Peak, a good ' +
        'one day\'s trip, driving to the foot of the trail. Stronger parties, it ' +
        'adds, can easily climb Cathedral if the leader chooses the party with ' +
        'care.',
      volume: 10,
      number: 9,
      issueDate: 'September 1931',
    },
  },
  {
    id: 'soda-springs-parsons-lodge',
    title: 'Soda Springs and Parsons Lodge',
    region: 'tuolumne',
    order: 8,
    kind: 'trailhead',
    coord: [-119.3535, 37.8774], // moved 2026-09 ~200 m W to the Lembert Dome lot trailhead: Recreation.gov and OSM agree within 12 m
    elevationFt: 8600,
    timeBudgetMin: 90,
    teaser:
      'An easy 1.5 miles from the Lembert Dome lot to a naturally carbonated spring and the 1915 Parsons Lodge. End the high-country day here.',
    body:
      'A 1.5-mile round trip from the Lembert Dome parking lot. Soda Springs is a naturally carbonated spring in the meadow; read the wayside beside it before you taste it. Parsons Lodge is a 1915 stone Sierra Club building, staffed daily in high summer with an open reading room, typically 10 to 4 once Tioga Road opens; the current Yosemite Guide has the season dates. It works as the last stop of a high-country day before the twilight drive back to the valley.',
    photos: [{ src: '/photos/tuolumne-meadows-lembert-dome.jpg', caption: 'Lembert Dome at sunset from the Soda Springs side of the meadow.' }],
    history: {
      note:
        'A 1931 Nature Notes itinerary for the High Sierra camps treated these ' +
        'springs as a scheduled event. Parties coming through Tuolumne Meadows ' +
        'stopped at the store first for oranges, lemons and sugar to use at the ' +
        'springs, and the write-up rates the best mineral water as the one at the ' +
        'Sierra Club lodge, a mile and three quarters west of the ranger station, ' +
        'where the trail for Glen Aulin starts.',
      volume: 10,
      number: 5,
      issueDate: 'May 1931',
    },
  },
  {
    id: 'tuolumne-meadows-grill',
    title: 'The Tuolumne Meadows Grill, lunch at 8,600 feet',
    region: 'tuolumne',
    order: 9,
    kind: 'meal',
    dayPart: 'midday',
    season: 'Closed for 2026',
    coord: [-119.357, 37.8743], // TODO: verify on the ground — moved 2026-09 ~180 m E: NPS places "Tuolumne Meadows Grill" and the OSM node agree within 5 m
    elevationFt: 8600,
    timeBudgetMin: 45,
    teaser:
      'Closed for the rest of 2026. The store and grill shut on September 20, and the lodge dining tent on September 13. Tioga Road stays open until snow closes it. Pack lunch from the Valley or Crane Flat.',
    body:
      'The store, the grill, and the lodge dining tent are closed for the 2026 season. The Yosemite Guide for September 23 to November 24 lists all three as closed, and Tioga Road stays open until snow shuts it. Bring water, lunch, and a full tank from Crane Flat; the next food eastbound is Lee Vining.\n\nWhen open, the grill serves burgers, breakfast sandwiches, chili, and soft-serve from a griddle in a canvas-sided building beside the store. The picnic tables fill with Pacific Crest Trail and John Muir Trail hikers, day hikers, climbers, and rangers.\n\nThe store is a small outfitter: fuel canisters, groceries, the only supplies in the high country, plus a seasonal post office where thru-hikers collect resupply boxes. The complex is tents and trailers struck every fall and rebuilt when Tioga Road opens; it does not exist in winter.',
    photos: [{ src: '/photos/tuolumne-meadows-grill.jpg', caption: 'Tuolumne Meadows at the end of the season. The store and grill tents sit at the meadow\'s east end.' }],
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
      'The trail starts at the Tioga Pass entrance station, 9,945 ft, and climbs about a mile up a sun-exposed grade to a ridge at 10,500 ft; expect to stop a few times in the first half hour. From the ridge you drop into the Gaylor Lakes basin: Middle Gaylor Lake at 10,300 ft, granite shores, the Cathedral Range to the south. Plan 2 to 3 hours round trip including lake time.\n\nBest July and August. Earlier, the upper switchbacks are slick or snow-covered; later, the meadows are brown. The trail continues another mile north to Upper Gaylor Lake and the ruins of the Great Sierra Mine, an 1880s silver dig that never paid for itself; stone chimneys still stand.',
    swap:
      'The parking at the Tioga Pass entrance station is small and fills early in summer. Get there before 9 a.m. or accept a roadside spot a few hundred yards back. Sea-level visitors should pace themselves on the climb: you start at 9,945 ft and gain about another 500 to reach the ridge.',
    history: {
      note:
        'The stone cabin above the top lake was already a relic when Nature Notes ' +
        'described it in 1937: a survivor of the mining days of the eighties, its ' +
        'walls sturdily built of rough rectangular blocks of the metamorphic rock ' +
        'around it. The item was filed as a bird record. A naturalist party out of ' +
        'Tuolumne Meadows on July 21, 1936 found rosy finches nesting in the ruin.',
      volume: 16,
      number: 6,
      issueDate: 'June 1937',
    },
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
    coord: [-119.5454, 37.8066], // TODO: verify on the ground — moved 2026-09 ~500 m SSE to the Porcupine Creek trailhead: NPS places, Recreation.gov and the OSM lot agree
    elevationFt: 8100,
    timeBudgetMin: 360,
    photos: [{ src: '/photos/north-dome-indian-rock.jpg' }],
    teaser:
      'About ten miles round trip to the only summit that hands you Half Dome\'s full face at eye level, with a twenty-minute detour to Yosemite\'s only natural granite arch.',
    body:
      'About ten miles round trip from the Porcupine Creek trailhead on Tioga Road, forest first, then open rim, finishing on the bare dome. Half Dome stands across Tenaya Canyon at eye level, the full 2,000-foot face in one frame with Clouds Rest behind it. North Dome is the only summit with that view on a maintained trail.\n\nTwo thirds of the way in, a signed side trail climbs three tenths of a mile to Indian Rock, the only natural granite arch in Yosemite, about fifteen feet across on a hilltop. The detour takes about twenty minutes.\n\nJune through October, whenever Tioga Road is open. The trail loses elevation on the way out, so the climbing comes on the return; save water and legs for it.',
    history: {
      note:
        'Nature Notes recommended this rim traverse in 1938 for exactly the reason ' +
        'it sits in the Secret Guide. Past Basket Dome the route runs a ' +
        'considerable distance north by Indian Rock before joining Snow Creek and ' +
        'dropping into Tenaya Canyon by the zigzags: a fairly strenuous one-day ' +
        'hike, the writer allowed, but one for the person who desires solitude in ' +
        'his hiking.',
      volume: 17,
      number: 12,
      issueDate: 'December 1938',
    },
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
      'The summit ridge is narrow with long drops on both sides and is no place in wind, storm, or lightning, or when the rock is wet. Afternoon thunderheads build fast here in July and August; plan to be off the ridge by early afternoon.',
    teaser:
      'A thousand feet higher than Half Dome, no permit lottery, no cables, a fraction of the company, and Half Dome itself in the summit view. Fourteen miles round trip.',
    body:
      'About fourteen miles round trip with about 2,300 feet of gain from the Sunrise Lakes trailhead at the west end of Tenaya Lake. Compared with Half Dome: a thousand feet higher, no permit lottery, no cables, fewer people, and Half Dome in the view below.\n\nThe last few hundred yards narrow to a blocky granite spine with drop-offs on both sides. It is a walkway, not a scramble, and a bypass path runs below the crest. The summit is a narrow platform at 9,926 feet overlooking the valley, the high country, and the Clark Range.\n\nStart at first light and carry three liters. June through October, Tioga Road permitting; the trail holds snow into early summer some years.',
    history: {
      note:
        'The bird that works this summit has been working it since at least 1922, ' +
        'when the second issue ever of Nature Notes ran a short item headed What Is ' +
        'The Bird On Cloud\'s Rest. Nearly every hiker to the top, it said, meets a ' +
        'large gray, black and white member of the jay family that cleans up the ' +
        'leftovers from lunches. It is Clark\'s nutcracker, and it is still up there ' +
        'doing it.',
      volume: 1,
      number: 2,
      issueDate: 'July 17, 1922',
    },
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
      'The John Muir Trail leaves Tuolumne Meadows across from the Dog Lake parking area, crosses the twin bridges over the Lyell Fork, and runs up Lyell Canyon: eight miles of nearly flat walking, about 200 feet of total gain, beside a river of green pools, gravel meanders, and slickrock slides.\n\nThere is no set destination. The twin bridges at a mile and a half make a short outing; the first big bend at three or four miles a long one. Crowds thin the farther you go.\n\nJuly through September. Mosquitoes are heavy after snowmelt; by late July the meadows dry out. Trout hold in the pools, deer work the far bank in the evening, and JMT hikers pass through.',
    history: {
      note:
        'The glacier at the head of this canyon has been on the books since October ' +
        '1931, when the park painted six stations onto the Lyell ice and began ' +
        'running a steel tape from each to the ice front every autumn. Nature Notes ' +
        'published the second year\'s reading in 1932: 452 feet on the most easterly ' +
        'lobe, against 460 the year before, which they recorded as an advance of ' +
        'eight feet.',
      volume: 11,
      number: 12,
      issueDate: 'December 1932',
    },
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
      'Eight miles round trip, moderate only because of the altitude. July through September. The Mono Pass Trail leaves Tioga Road at Dana Meadows, a couple of miles inside Tioga Pass, and climbs gently, about a thousand feet over four miles, through creek crossings and wet meadows to the 10,600-foot gap where the Sierra drains east toward Mono Lake. It sees far fewer people than Cathedral Lakes or Lembert Dome.\n\nThe route was a trade route over the crest for centuries, obsidian moving west and acorns moving east. At the top, Bloody Canyon drops away below and Mono Lake lies beyond it, a view out of the park into the Great Basin. Weathered log cabins from a failed 1880s mining venture stand near the pass.',
    history: {
      note:
        'This was a crossing long before it was a trail. Nature Notes tells it ' +
        'through Joseph Reddeford Walker, who in 1833 worked south from the ' +
        'Humboldt sink looking for a way over the range, found nothing, and on ' +
        'reaching the Mono Lake country persuaded Mono people to show him a route ' +
        'they were already using. They led the party up Bloody Canyon and over Mono ' +
        'Pass into the Tuolumne Meadows country.',
      volume: 12,
      number: 11,
      issueDate: 'November 1933',
    },
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
      'Sixteen to seventeen miles round trip, ten to twelve hours, no permit needed for the day hike. Start before sunrise. From Tamarack Flat Campground off Tioga Road, follow an easy 2.5 miles down the abandoned Big Oak Flat Road grade to the Tamarack Creek footbridge, then climb about six miles, with exposed granite crossings and one meadow, until the rim opens and the summit slabs roll toward the edge of the 3,000-foot face. June through October, Tioga Road permitting.\n\nThe summit is a broad granite back, not a point. The valley is directly below and the Cathedral Rocks across. You may meet climbers topping out after days on the wall; give them room.\n\nThe old road is the same 1874 wagon grade you can climb from the valley floor at the [Old Big Oak Flat Road](/stop/old-big-oak-flat-road) stop, severed in the middle by the 1945 rockslide. Few people attempt this hike.',
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
      'The road to Hetch Hetchy: 16 slow miles from Highway 120 to the dam, gated roughly sunrise to sunset, 25-foot vehicle limit. Plan a full day.',
    body:
      'About 16 miles, most of it slow, from Highway 120 to the O\'Shaughnessy Dam. Just outside the Big Oak Flat entrance, Evergreen Road runs north through forest and the old summer-camp community of Camp Mather; at Mather pick up Hetch Hetchy Road, pass the park entrance station, and wind down to the dam. The last several miles are hairpins with steep drops. Don\'t speed or pass.\n\nTwo rules. The road is gated, open roughly sunrise to sunset with exact hours posted at the entrance station, so a sunset-at-the-dam plan ends at a closed gate. And there\'s a 25-foot vehicle length limit: large RVs and trailers can\'t go.\n\nFrom Yosemite Valley it is roughly an hour and a half each way, so Hetch Hetchy works as a full day, not a half-day add-on. Along Evergreen Road you cross the 2013 Rim Fire\'s burn country in recovery before the reservoir appears below its granite walls. On a July Saturday when the Valley is jammed, there can be fewer than a hundred people here.',
  },
  {
    id: 'carlon-falls',
    title: 'Carlon Falls, the river walk on Evergreen Road',
    region: 'hetch-hetchy',
    order: 2,
    kind: 'trailhead',
    difficulty: 'easy',
    coord: [-119.8615, 37.8143], // TODO: verify on the ground — moved 2026-09 ~300 m to the Carlon trailhead by the Evergreen Rd bridge: OSM trailhead and day-use area agree
    elevationFt: 4400,
    timeBudgetMin: 150,
    hazard:
      'The granite beside the fall is water-polished and slick, and spring current is stronger than it looks. Swim the base pool in summer low flow only.',
    teaser:
      'An easy, nearly flat river walk up the South Fork Tuolumne to a broad fall that typically runs all year, with a swimming hole at its base. The corridor\'s family stop, a mile up Evergreen Road.',
    body:
      'About 3.8 miles round trip, nearly flat, from the Carlon day-use area, a mile up Evergreen Road from Highway 120 where the road crosses the South Fork of the Tuolumne. The trail leaves the north side of the bridge and follows the river upstream into the park under ponderosa and incense cedar, past green pools and low cascades. The trailhead is outside the park entrance station, so it costs no gate time. The site was once the Carl Inn, a resort for Yosemite travelers from 1916 into the 1930s.\n\nCarlon Falls is a broad curtain of whitewater over a granite ledge that typically runs all year. The deep pool at its base is a good swimming hole by midsummer. In spring the fall is loud and the pool off limits. The polished granite near the water is slippery; read the caution note.\n\nDo it as the opener to the [Hetch Hetchy day](/stop/evergreen-road-drive) on a hot forecast, or on the way out for an afternoon swim.',
    photos: [{ src: '/photos/carlon-falls.jpg', caption: 'The South Fork Tuolumne in spring flow near the Carlon day-use area, not the fall itself. Carlon Falls is a mile up this river.' }], // stand-in: not this entry, see guide-photo-manifest.json
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
      'Two miles round trip to a bare granite knob above the entrance station: the reservoir, Kolana Rock, and Wapama Falls from above. April and May are the season.',
    body:
      'About 2 miles round trip and 680 feet of gain, an hour to ninety minutes. The trail leaves from near the Hetch Hetchy entrance station at Mather and climbs through pine and recovering burn to a bare granite knob. From the top: the reservoir below, Kolana Rock on the south wall, and in spring Wapama Falls on the north wall.\n\nApril and May are the season, with the falls at full volume and good wildflowers around the knob. Do it first on a Hetch Hetchy day, before the dam and the Wapama walk.',
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
    photos: [{ src: '/photos/region-hetch-hetchy-kolana-rock.jpg', caption: 'Kolana Rock over the reservoir from the trail beyond the dam.' }],
    teaser:
      'Walk a quarter mile across the 1923 dam to a tunnel hand-cut through the cliff, Kolana Rock and Wapama Falls up-canyon. Muir\'s valley floor is still down there.',
    body:
      'Park at the end of the road and walk out onto the dam: a quarter mile across, flat and paved, ending in a tunnel hand-cut through the cliff. From the middle, look east: the reservoir running up-canyon, Kolana Rock off the south wall, Wapama Falls dropping over 1,000 feet down the north wall. The dam went up in 1923 and was raised in 1938; the seam between the two phases is visible from the upstream side, and interpretive signs at the eastern end cover the rest.\n\nThis valley was inside a national park when San Francisco applied to flood it. John Muir fought the dam from roughly 1908 to 1913, lost when the Raker Act passed Congress, and died in 1914. The reservoir holds 117 billion gallons and supplies drinking water to about 2.7 million people in the Bay Area.\n\nThe valley floor Muir walked is 200 to 350 feet under the surface, depending on the year.',
    history: {
      note:
        'Nature Notes marked the day the argument became plumbing. On October 28, ' +
        '1934, it reported, water flowed for the first time from the Hetch Hetchy ' +
        'reservoir to San Francisco, 155 miles away, more than thirty years after ' +
        'the city first applied to take it.',
      volume: 13,
      number: 12,
      issueDate: 'December 1934',
    },
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
      'Five rolling miles round trip along the north shore to the footbridges under a 1,000-foot fall. Best in spring; in peak snowmelt the bridges can close.',
    body:
      'About 5 miles round trip with roughly 500 feet of up and down on rolling terrain; plan four to five hours including lunch at the falls. Cross the dam, go through the tunnel, and follow the north shore east. In May and June you pass under Tueeulala Falls, a spring-only fall that\'s gone by July most years, then reach the footbridges at the base of Wapama, where the fall drops over 1,000 feet and high-water spray soaks the bridges.\n\nIn peak snowmelt the terminal bridges are sometimes closed for safety, and debris has swept them out in flood years. Check the NPS conditions page before a May or June visit. This is rattlesnake country, so watch your feet in the rocks, and poison oak grows close to the trail; wear long pants if unsure.\n\nThe low elevation keeps the trail open year-round: it is hikeable in February and an exposed, 90-degree grind on an August afternoon. Spring is the best season. Carry more water than feels necessary and bring sun protection; long sections have no shade.',
    swap:
      'If the Wapama bridges are closed in high water, don\'t force it. Walk the dam and tunnel for the up-close granite, then drive back to the entrance station and hike [Lookout Point](/stop/lookout-point) instead: about 2 miles round trip to a knob that looks over the valley and Wapama Falls from a safe distance.',
  },

  {
    id: 'evergreen-lodge',
    title: 'The Evergreen Lodge, the meal on the way out',
    region: 'hetch-hetchy',
    order: 6,
    kind: 'meal',
    dayPart: 'evening',
    coord: [-119.858, 37.8758], // TODO: verify on the ground — moved 2026-09 ~970 m to the lodge: OSM lodge, restaurant and store within 15 m; the July pin was 759 m from any road
    elevationFt: 4600,
    timeBudgetMin: 75,
    teaser:
      'A 1921 lodge in the pines a mile before Camp Mather: tavern, restaurant, general store, and the only reliable food and drink on the Hetch Hetchy corridor.',
    body:
      'There is no food service at Hetch Hetchy: nothing at the dam or the entrance station, and the drive back to Highway 120 is slow. The Evergreen Lodge, built in 1921 alongside the dam works, sits in the pines on Evergreen Road about a mile before Camp Mather: a tavern with a deck, a restaurant, cabins, and a general store for sandwiches, coffee, ice, and sunscreen.\n\nStop for coffee and a breakfast sandwich on the drive in, before the gate, and for a burger on the deck after the [Wapama miles](/stop/wapama-falls-trail). Hours are seasonal and shorten outside summer; check ahead before counting on dinner.',
    photos: [{ src: '/photos/evergreen-lodge.jpg', caption: 'A cabin at Camp Mather, the city camp next door to the lodge on Evergreen Road. The lodge\'s own cabins sit in the same forest.' }], // stand-in: not this entry, see guide-photo-manifest.json
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
    coord: [-119.8422, 37.763], // moved 2026-09 ~790 m to the trailhead lot on Big Oak Flat Rd: OSM trailhead + 8-space lot and Recreation.gov agree; the July pin was in the forest
    elevationFt: 5400,
    timeBudgetMin: 150,
    photos: [{ src: '/photos/merced-grove.jpg' }],
    teaser:
      'The smallest and least-visited of Yosemite\'s three sequoia groves: three miles round trip to about twenty giants you stand alone with.',
    body:
      'About three miles round trip on an old road grade, downhill on the way in and uphill on the way out. Merced Grove is the smallest of Yosemite\'s three sequoia groves, about twenty mature giants in a drainage off Big Oak Flat Road, and the least visited. Allow an hour at the bottom.\n\nThe trailhead is on the way to everything on this side of the park, so the grove works as the opener or closer to a [Hetch Hetchy day](/stop/evergreen-road-drive). Open year-round when the road is; in good snow years it is a winter snowshoe walk.',
    history: {
      note:
        'There was a fire lookout above this grove, and Nature Notes sold it to ' +
        'motorists as a stop. A 1932 item put the Merced Grove Lookout a ten-minute ' +
        'drive off the Big Oak Flat Road at Crane Flat, with a fire guard on duty ' +
        'who took special pride in pointing out where an unusually severe fire had ' +
        'once been stopped just short of the Merced Grove of Big Trees.',
      volume: 11,
      number: 8,
      issueDate: 'August 1932',
    },
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
    photos: [{ src: '/photos/wapama-falls-trail.jpg', caption: 'Wapama Falls at the footbridges, the crossing you clear on the way out to Rancheria.' }],
    hazard:
      'Rattlesnake country the whole way, poison oak close to the trail, and long stretches of full sun. In peak snowmelt the Wapama bridges can close and end the trip early; check conditions before a May or June start.',
    teaser:
      'Thirteen miles round trip, past where the day-hikers turn around at Wapama, to cascades dropping more than a thousand feet through a narrow gorge.',
    body:
      'Thirteen miles round trip from the dam, with steady rolling gain. Past the Wapama bridges, where most day hikers turn around, the shoreline trail continues east beneath granite domes to Rancheria Falls, where Rancheria Creek drops more than a thousand vertical feet in cascades and slides through a narrow gorge. Past Wapama you will likely have the trail to yourselves. Beyond Rancheria the trail climbs toward Tiltill Valley and the northwest wilderness.\n\nStart early; the [gate hours](/stop/evergreen-road-drive) bracket the day at both ends. Spring is for water, fall for temperature; avoid summer afternoons. Read the caution and carry more water than feels reasonable.',
    history: {
      note:
        'In the late summer of 1935 Junior Forester Elliott Sawyer found a lone ' +
        'single-leaf pinyon on the lower west slope of Rancheria Mountain, near the ' +
        'trail you are walking. It is a tree of the dry country east of the crest, ' +
        'and Nature Notes noted that this one stood on a possible route the Paiute ' +
        'used coming into Hetch Hetchy.',
      volume: 16,
      number: 1,
      issueDate: 'January 1937',
    },
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
    coord: [-119.8146, 37.9102], // TODO: verify on the ground — moved 2026-09 ~1.3 km to the trailhead 3.9 road-mi past the entrance: NPS places, Recreation.gov and OSM agree
    elevationFt: 3600,
    timeBudgetMin: 210,
    hazard:
      'The climb out is relentless and largely shadeless, and it bakes by late morning; carry more water than two and a half miles suggests. Rattlesnake country, and the river runs dam-released cold and fast. Stay out of the current.',
    teaser:
      'One of the park\'s steepest maintained trails: 1,300 feet down in 1.3 miles to the Tuolumne River below the dam, and the same 1,300 back up. Very few people go.',
    body:
      'A 1.3-mile trail off Hetch Hetchy Road that loses 1,300 feet, one of the steepest maintained grades in the park, to the Tuolumne below O\'Shaughnessy Dam. The signed pullout is 3.9 miles past the entrance station. The trail goes straight down through oak and bear clover.\n\nThe floor has meanders, sand bars, spring wildflowers on the benches, the dam out of sight upstream, and almost no one else; a few fishermen know it.\n\nThe way out regains 1,300 feet in 1.3 miles, mostly in the open. Walk down in the morning cool and climb out before the heat, or go in spring or fall. Avoid July afternoons.',
    photos: [{ src: '/photos/poopenaut-valley.jpg', caption: 'The Tuolumne below O\'Shaughnessy Dam, in a USGS photograph from the river gauge cableway. Poopenaut Valley is this stretch of river.' }],
    history: {
      note:
        'The drop you are about to make is the whole point of the place. A 1940 ' +
        'Nature Notes piece on the mix-up to be found in the life zones of the ' +
        'Hetch Hetchy region recorded two ash-throated flycatchers down in ' +
        'Poopenaut Valley at 3,500 feet, a foothill bird inside a park most people ' +
        'picture as high country. The floor down there belongs to a different world ' +
        'than the rim you are standing on.',
      volume: 19,
      number: 10,
      issueDate: 'October 1940',
    },
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
      'Just west of the Evergreen Road junction, Highway 120 crosses the South Fork of the Tuolumne, and a signed spur drops to Rainbow Pool: a short waterfall into a broad green pool ringed by granite shelves. It is Stanislaus National Forest land: free, no reservation, reachable after you\'ve left the park. Picnic tables and vault toilets above the water. Stagecoach travelers stopped here on the old toll road, and a small resort operated at the pool for decades before it burned.\n\nBy July the water is warm by Sierra standards; weekends fill with local families, weekday evenings are quieter. People jump from the ledges. The Forest Service\'s advice and this guide\'s agree: check the depth yourself before anyone jumps, never dive, and stay out entirely in spring flow, when the current is dangerous.\n\nIt pairs with [Carlon Falls](/stop/carlon-falls): Carlon for the walk, Rainbow Pool for the swim, and a good last stop on the drive home from a [Hetch Hetchy day](/stop/evergreen-road-drive).',
    photos: [{ src: '/photos/rainbow-pool.jpg', caption: 'The South Fork Tuolumne pouring over granite at the Highway 120 crossing, where Rainbow Pool sits.' }],
  },
]

// Validate the entire collection at module-load. Any schema violation throws
// here and Vite surfaces it in the browser overlay or fails the build in CI.
export const stops: StopT[] = Stops.parse(seed)
