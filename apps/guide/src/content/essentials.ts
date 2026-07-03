// =============================================================================
// ESSENTIALS — the know-before-you-go section.
//
// Durable park logistics only: entrance mechanics, getting around, food
// storage, coverage, seasons. Anything that changes year to year is phrased
// to point at nps.gov/yose rather than freeze a date that will go stale.
// Bodies match the editorial voice. Validated at module load, same as stops.
// =============================================================================

import { z } from 'zod'
import { EssentialTopics, type EssentialTopicT } from './schema'

type EssentialInput = z.input<typeof EssentialTopics>[number]

const seed: EssentialInput[] = [
  {
    id: 'before-you-go',
    title: 'Before you go: the night-before downloads',
    order: 0,
    section: 'plan',
    teaser: 'Five downloads and checks to do on wifi the night before. Twenty minutes now buys a trip that works without signal.',
    body:
      'Most of the park has no usable cell service. Everything on this list works around that, and all of it has to happen **before** you lose signal, ideally the night before on hotel or home wifi.\n\n' +
      '**1. Download an offline area in Google Maps.** This is what keeps turn-by-turn driving directions working past the entrance station. In Google Maps: tap your profile picture → **Offline maps** → **Select your own map** → pinch and drag until the rectangle covers the whole park plus the highway you\'re arriving on → **Download**. It\'s a few hundred megabytes, so do it on wifi. Offline areas expire after about thirty days, so refresh it if you downloaded it a while ago. Apple Maps on recent iOS versions has the same feature under your profile → **Offline Maps**. Every GPS pin in this guide hands off to your Maps app with one tap; the offline area is what makes that handoff work at a trailhead with no bars.\n\n' +
      '**2. Download this guide and the park map.** Open **Account → Offline** in this app and download the guide, your region\'s photos, and the offline park map (about 20 MB). After that the whole app, the topo map included, works in airplane mode. The app\'s own map does not depend on Google\'s: it keeps working even if you skip step 1, but you\'ll want both.\n\n' +
      '**3. Grab the current Yosemite Guide.** The park publishes a seasonal newspaper, the *Yosemite Guide*, with the ranger program schedule, shuttle map, and visitor center hours for the exact weeks you\'re there. Download the current PDF from **nps.gov/yose/planyourvisit/guide.htm** and it lives on your phone for the trip.\n\n' +
      '**4. Check the reservation and road situation.** Timed-entry rules change year to year; verify at nps.gov/yose whether your dates and arrival time need a reservation. If your trip touches Glacier Point Road or Tioga Road, check the road status page too.\n\n' +
      '**5. Fuel and cash.** There is no gas in Yosemite Valley. Fill up in the gateway towns, and again at Crane Flat if you\'re heading up Tioga Road.',
    checklist: [
      { id: 'gmaps-offline', label: 'Google or Apple Maps offline area covering the park and your approach highway' },
      { id: 'app-offline', label: 'This guide, photos, and the park map downloaded (Account → Offline)' },
      { id: 'yosemite-guide-pdf', label: 'Current Yosemite Guide PDF saved from nps.gov' },
      { id: 'reservation-check', label: 'Timed-entry reservation rules checked for your dates' },
      { id: 'road-status', label: 'Glacier Point and Tioga road status checked, if your plan needs them' },
      { id: 'fuel', label: 'Gas tank filled outside the park' },
      { id: 'batteries', label: 'Phone and battery pack charged' },
    ],
  },
  {
    id: 'entrances-and-reservations',
    title: 'Entrances, fees, and the reservation question',
    order: 1,
    section: 'plan',
    teaser: 'Which gate you actually want, what it costs, and how to find out if you need a timed-entry reservation this year.',
    body:
      'Yosemite has five entrances and most visitors only ever hear about one of them.\n\n' +
      '**Arch Rock** (Highway 140 through El Portal) is the lowest entrance and the one that stays open when storms close everything else. **Big Oak Flat** (Highway 120 from the west, through Groveland) is the workhorse from the Bay Area. **South Entrance** (Highway 41 through Oakhurst) puts you at the Mariposa Grove first and Tunnel View on the way in, which is the best first look at the valley there is. **Tioga Pass** (Highway 120 from the east, out of Lee Vining) is the high-country door and only exists as an option roughly June through October. **Hetch Hetchy** is its own corner of the park with its own hours.\n\n' +
      'The entrance fee is charged per vehicle and is valid for seven days. Pay it once, keep the receipt on your dashboard, come and go all week. An annual America the Beautiful pass covers it if you visit more than two or three national parks a year.\n\n' +
      'The part that changes: in recent peak seasons the park has required a **timed-entry reservation** on top of the entrance fee for certain dates and hours. The rules are set fresh each year. Before you book lodging, check the current system at **nps.gov/yose** and search "reservations." Two things have stayed true across versions of the system: arriving very early or later in the afternoon has generally been the workaround, and in-park lodging or camping reservations have generally exempted you. Verify both for the current year before you rely on them.',
  },
  {
    id: 'getting-around',
    title: 'Getting around: park once, ride the shuttle',
    order: 20,
    section: 'on-the-ground',
    teaser: 'The free valley shuttle, the one-way road system, and why moving your car after 9 a.m. is the mistake.',
    body:
      'The single biggest tactical decision of a valley day is where your car stops moving.\n\n' +
      'The east end of Yosemite Valley runs on a **free shuttle** that loops the places you actually want: the visitor center area, the Lower Yosemite Fall stop, Curry Village, and the trailhead stop for the Mist Trail. It runs frequently through the day. Park once in a day-use lot, then treat the shuttle as your valley transit. The stops in this guide that sit on the loop say so.\n\n' +
      'The valley roads are mostly **one-way**: Southside Drive flows in, Northside Drive flows out. Miss a pullout and you are committing to the full loop to come back around, which costs twenty to thirty minutes in traffic season. The guide orders the valley stops with this in mind. Read the next two stops before you drive past either.\n\n' +
      'If you are staying outside the park, the math is simple: every hour after sunrise you arrive costs you a parking option. The lots fill from mid-morning in season. Arriving by 8 a.m. is not an enthusiast flex, it is how you skip the part of the day people go home complaining about.',
  },
  {
    id: 'bear-safety',
    title: 'Bears, and the food rules that are actually laws',
    order: 40,
    section: 'safety',
    teaser: 'Black bears, not grizzlies. What they want is your cooler, and the storage rules are enforced.',
    body:
      'Yosemite has black bears. There are no grizzlies in California and there have not been for about a century. A Yosemite black bear does not want you; it wants the granola bar in your daypack and the cooler in your back seat, and it is shockingly good at getting both.\n\n' +
      'The rules, which are park law and enforced with fines:\n\n' +
      '- **Never leave food in your car overnight.** Bears recognize coolers and grocery bags through windows and they open cars the way you open a soda can. Use the brown steel **food lockers** at trailheads, campgrounds, and lodging areas.\n' +
      '- **"Food" means anything scented.** Toothpaste, sunscreen, gum, empty wrappers, the baby seat with the crushed crackers in it.\n' +
      '- **By day, keep food within arm\'s reach.** A daypack on the ground while you wade in the river is a daypack a bear can take.\n' +
      '- **Never approach a bear, ever, for any photo.** If one approaches you, gather children, stand together, make noise, look large. Do not run and do not drop your food; that teaches the bear that approaching people works.\n\n' +
      'Drive the posted speed limits, especially at dawn and dusk. Speeding kills bears in this park every year, and the curve where it happens usually has a sign marking the last one.',
  },
  {
    id: 'cell-coverage-offline',
    title: 'Cell coverage, and how this app behaves without it',
    order: 21,
    section: 'on-the-ground',
    teaser: 'Where service dies, why GPS still works, and the two downloads to do the night before.',
    body:
      'Plan on having no usable signal for most of your trip. There is some coverage around Yosemite Village and parts of the valley floor, and effectively none on the trails, on Glacier Point Road, and along most of Tioga Road. The gateway towns have normal service. In between, nothing you can count on.\n\n' +
      'Two facts make this fine instead of frightening:\n\n' +
      '1. **GPS does not need cell service.** Your phone\'s blue dot works in airplane mode. What needs the network is loading the map underneath the dot, which is exactly what downloading solves.\n' +
      '2. **This app is built to be downloaded.** Open **Account → Offline** and download the guide and the park map before you leave wifi. Everything in the app, every stop, every photo, the topo map, then works with the phone in airplane mode. Airplane mode also stops your battery from cooking itself searching for towers, which is the most common way phones die in the park.\n\n' +
      'For turn-by-turn driving directions, also download an offline area of the park in Google Maps or Apple Maps the night before. The GPS chips in this guide hand you off to those apps; with the area downloaded, the handoff works at the trailhead too.\n\n' +
      'Tell someone outside the park what trail you are doing and when you expect to be out. That is not drama, it is the standard practice the rescue teams ask for.',
  },
  {
    id: 'seasons-and-roads',
    title: 'What the seasons do to the roads and the falls',
    order: 2,
    section: 'plan',
    teaser: 'Tioga and Glacier Point close for half the year. The waterfalls keep a schedule too.',
    body:
      'The park you get depends almost entirely on when you come.\n\n' +
      '**The two big seasonal roads.** Tioga Road (the high country, all of the Tuolumne region in this guide) and Glacier Point Road close with the first real snow, typically in November, and reopen after plowing, typically late May into June for Tioga. If your trip is outside roughly June through October, plan as if the Tuolumne region does not exist and check the Glacier Point Road status before promising anyone that view. Current road status is on **nps.gov/yose** and at the park\'s recorded road line.\n\n' +
      '**Winter driving.** Chains can be required on park roads any time from roughly November through March, even for rental cars, even with all-wheel drive, depending on the restriction level posted. Carry them or be prepared to buy them in a gateway town at gateway-town prices. The valley itself stays open all winter and is the quietest, strangest, most beautiful version of the park.\n\n' +
      '**The waterfall schedule.** The falls run on snowmelt. They build through spring, peak roughly May into June, and then fade. Yosemite Falls is often dry by late August; it is not broken, it is seasonal. Bridalveil runs year-round. If waterfalls are the point of your trip, come in late spring. If you come in autumn, come for the light and the quiet and adjust your expectations about water.\n\n' +
      '**Summer heat.** The valley floor sits around 4,000 feet and runs hot in July and August, mid-90s on the worst days. The rim and the high country run ten to twenty degrees cooler, which is half the argument for Tuolumne in this guide.',
  },
  {
    id: 'packing-checklist',
    title: 'The packing checklist',
    order: 60,
    section: 'packing',
    teaser: 'Check items off in the app the night before. Seasonal items are marked.',
    body:
      'This is the dresser-top list, not an expedition manifest. It assumes day trips from a bed, not backpacking. Check things off below; the app remembers between visits.\n\n' +
      'Two notes that earn their place here:\n\n' +
      '- **Layers beat jackets.** The valley floor and the rim can be twenty degrees apart on the same afternoon, and the temperature falls fast when the sun leaves the valley walls.\n' +
      '- **More water than feels reasonable.** The air is dry, the elevation is real, and the climbs out of the valley are steeper than they look from a parking lot.',
    checklist: [
      { id: 'water', label: 'Water, at least two liters per person for any real walk' },
      { id: 'layers', label: 'Layers: a warm one and a shell, regardless of forecast' },
      { id: 'footwear', label: 'Shoes with actual grip, broken in, not new' },
      { id: 'sun', label: 'Sunscreen, hat, sunglasses; the granite reflects everything' },
      { id: 'snacks', label: 'More snacks than the children claim to need' },
      { id: 'headlamp', label: 'Headlamp or flashlight, even for an afternoon plan' },
      { id: 'firstaid', label: 'Small first-aid kit with blister care' },
      { id: 'offline', label: 'This guide downloaded for offline (Account → Offline)' },
      { id: 'mapsarea', label: 'Google or Apple Maps offline area of the park' },
      { id: 'battery', label: 'Battery pack and cable' },
      { id: 'cash-card', label: 'Card and some cash; gateway gas stations are quirky' },
      { id: 'bugspray', label: 'Bug spray for the meadows', season: 'Early summer' },
      { id: 'swimsuit', label: 'Swimsuit and a towel for the river', season: 'Summer' },
      { id: 'micro-spikes', label: 'Microspikes for icy paved paths', season: 'Winter' },
      { id: 'chains', label: 'Tire chains, fitted to your car before the trip', season: 'Winter' },
      { id: 'mist-layer', label: 'A wet-weather layer for the Mist Trail spray', season: 'Spring' },
    ],
  },

  // ── Topics adapted from the Talus Field editorial archive ──────────────────
  // Condensed for the guide, second person, durable facts only; year-specific
  // policy defers to nps.gov / recreation.gov rather than freezing a date.

  {
    id: 'first-timer-orientation',
    title: 'First trip: how to think about the park',
    order: 3,
    section: 'plan',
    teaser: 'The famous places earned their fame. Most people just visit them the worst possible way. The strategy, not the list, is what needs fixing.',
    body:
      'Every guide hands first-timers the same list: Tunnel View, Cook\'s Meadow, Glacier Point, the Mariposa Grove, Tuolumne Meadows. The list is fine. Those places earned their fame, and you should see them. The problem is how most people see them: Tunnel View at one in the afternoon in July, lot full, overlook three-deep, one photo over a stranger\'s shoulder, gone. They visit the busiest version of the busiest places at the busiest time, then go home saying Yosemite was beautiful but crowded. It was, at that hour.\n\n' +
      'Three habits separate that trip from a good one. **Research the season**: Tioga Road does not open until late May or June and sometimes later, the waterfalls peak in spring and are mostly dry by August, and smoke can erase vistas for weeks. **Know what you actually want**: of granite, waterfalls, old-growth, high country, and solitude, pick the two that matter most, because the order you visit them in matters. **Be willing to flex**: the trip you plan from your kitchen table is rarely the trip the park gives you, and the visitors who have great trips are the ones who swap a stop instead of pushing on a full lot.\n\n' +
      'The hardest part is what you refuse to do. One day started at sunrise and spent on three or four things beats several days of arriving at noon and hunting for parking. On a single valley day, skip Glacier Point Road (two to three hours of round-trip driving), the Mariposa Grove (an hour-plus each way, plus a shuttle), and Tioga Road (half a day each way). None of those are cuts against the park; they are the centerpiece of a second day, which is when the trip earns altitude and stops being a checklist.\n\n' +
      'Booking order: check the current year\'s entry rules at nps.gov/yose first, pick your season, pick your gateway town (the Gateway towns topic) before you book a bed, and only then build the itinerary. The trip planner on the Plan tab has 1, 2, and 3 day presets built on exactly this do-less-earlier logic; start from one and adjust.',
  },
  {
    id: 'crowds-and-timing',
    title: 'Crowds: the calendar, the clock, and the escape',
    order: 4,
    section: 'plan',
    teaser: 'The daily crowd curve has held the same shape for fifty years. The hour you reach the gate matters more than the month you pick.',
    body:
      'Whether the park meters entry with a reservation system changes year to year; check nps.gov/yose for the current rules before you book anything. What does not change is the shape of the demand, and that shape is the thing to plan around.\n\n' +
      '**The calendar.** June through August is the crush, and weekend days run roughly 45 percent busier than weekdays all year. Holiday weekends spike above their months: Memorial Day, July 4, Labor Day, Thanksgiving week, the December holiday week, and the firefall window in mid-to-late February. September splits in half: Labor Day weekend behaves like July, and the Tuesday after it is a different park, with summer weather, the high country open, and crowd pressure down by a third. Midweek in October is the sleeper, and midweek early November trades short days for a valley that is nearly yours.\n\n' +
      '**The clock.** The valley crowd builds from about 8 a.m., peaks between 11 a.m. and 3 p.m., and tails off after 5. By 8 p.m. the valley is functionally empty. The busiest entry window at the gates runs roughly 9 a.m. to 2 p.m., and on peak weekends the afternoon entrance delays are measured in hours. So: through the gate before 8 a.m., before 7 on a summer weekend, or arrive after 4 p.m. and take the evening light instead. Once parked, stay parked; ride the shuttle. Give the midday hours a deliberate low-friction plan, a museum, a slow river walk, a long lunch, and re-emerge when the lots start emptying.\n\n' +
      '**The escape.** Crowds in Yosemite are crowds at the parking lot; they thin dramatically with distance from it. Wawona, Hetch Hetchy, and the Tioga Road stops beyond the famous turnouts run at a fraction of valley traffic. And keep a swap ready for every marquee stop: Valley View when Tunnel View is full, Sentinel Dome or Taft Point when Glacier Point is a wait. Several of the swaps are arguably better than the originals. For live parking and traffic updates, text ynptraffic to 333111 before you commit to the drive.',
  },
  {
    id: 'budget',
    title: 'What a trip actually costs',
    order: 5,
    section: 'plan',
    teaser: 'The park itself is cheap: one vehicle fee, free shuttles, free trails. The bed is the variable that decides everything else.',
    body:
      'The entrance fee is charged per vehicle, roughly $35, and is valid for seven days, so a car of five pays the same as a solo driver. An annual America the Beautiful pass, on the order of $80, covers every national park for a year and pays for itself if you visit more than twice. Current fees are at nps.gov/yose.\n\n' +
      '**Lodging is where trips diverge.** Campsites run roughly $25 to $40 a night. Tent cabins at Curry Village are on the order of $170 to $200; Yosemite Valley Lodge rooms roughly $300 to $500 depending on season; the Ahwahnee starts around $600 and climbs. Gateway-town motels and hotels run roughly $120 to $300 a night, and a vacation rental split among a group can undercut all of it per person. Current in-park rates are at travelyosemite.com. Everything books months out for summer.\n\n' +
      '**Food is the easiest saving.** A cooler stocked at a gateway grocery store runs roughly $15 to $25 per person per day; a deli sandwich and a drink inside the park is on the order of $20 per person, and the Village Store charges well above supermarket prices. The workable pattern: cook or pack most meals, eat one park meal a day if you want the experience, and treat the Ahwahnee dining room as a once-per-trip splurge, not a routine.\n\n' +
      '**Gas and gear.** There is no gas in Yosemite Valley, and the in-park pumps at Crane Flat and Wawona run roughly fifty cents to a dollar more per gallon than the gateway towns, so fill up before you enter. Parking is free everywhere in the park; the cost is time, not money. On gear, the one non-negotiable purchase is sturdy, broken-in shoes with real tread. You do not need trekking poles, a GPS unit, or bear spray, which is prohibited here anyway; these are black bears.\n\n' +
      'The two shapes of the trip: the cheap version is a campsite, a cooler, and one restaurant meal, on the order of a few hundred dollars total for two people over several days. The splurge is the Ahwahnee, prix fixe dinners, and a guided full-day program, on the order of several thousand. Both groups have great trips. The difference is choices, not quality.',
  },
  {
    id: 'gateway-towns',
    title: 'The gateway towns, compared',
    order: 6,
    section: 'plan',
    teaser: 'Five towns on four highways, an hour or more apart in drive time. Pick by your trip\'s center of gravity, not by reviews.',
    body:
      'The five main gateway towns are not interchangeable. Each sits on a different highway into a different entrance, and the wrong one costs you an hour of driving every day of the trip. Pick by where your trip actually points: valley trips base west, sequoia trips base south, high-country trips base east.\n\n' +
      '**El Portal** (Highway 140) is the closest, about 25 to 30 minutes to the valley along the Merced River canyon, the prettiest approach the park has. It is a small park-adjacent settlement: a few lodges, a gas station, a market, not much else, and the location prices it like in-park lodging. Pick it if being inside the park at sunrise every day is the priority, or for winter, when low-elevation 140 is the most reliable road in.\n\n' +
      '**Mariposa** (Highway 140) is 45 minutes to an hour out and the safest first-timer\'s choice: a real gold-rush town with restaurants, grocery stores, and lodging from budget motel to country inn. The trade is at least 90 minutes of round-trip driving a day and earlier alarms for sunrise.\n\n' +
      '**Oakhurst** (Highway 41) has the longest valley drive, 75 to 90 minutes over a winding climb, but sits about 20 minutes from Wawona and the Mariposa Grove. It is the largest gateway by amenities, with predictable chain hotels and chain prices. Pick it for a sequoia-centered trip, or if you are coming from Los Angeles or Fresno.\n\n' +
      '**Groveland** (Highway 120, chain controls common in winter) is 60 to 75 minutes out and the underrated pick: a historic main street, one of California\'s oldest saloons, and generally easier last-minute rooms than Mariposa. Best positioned for Hetch Hetchy and the northern park, and on the natural route from the Bay Area.\n\n' +
      '**Lee Vining** (Highway 120 east, over Tioga Pass, seasonal only) is a different trip entirely: 30 minutes to Tuolumne Meadows, 90-plus to the valley, Mono Lake at the doorstep, and no practical park access at all when Tioga is closed. Pick it for a high-country trip or an eastern Sierra itinerary. Wherever you land, book early: summer gateway lodging fills six to twelve months out.',
  },
  {
    id: 'half-dome-permits',
    title: 'Half Dome: the permit lottery and the honest math',
    order: 7,
    section: 'plan',
    teaser: 'Two lotteries, roughly one-in-five odds, and a 14 to 16 mile day. What the cables actually ask of you.',
    body:
      'The Half Dome day hike is 14 to 16 miles round trip from Happy Isles with about 4,800 feet of gain. Most hikers take 10 to 12 hours; you leave before sunrise. The finale is the cables: two steel lines running 400 vertical feet up the back of the dome at roughly 45 degrees, with wooden crossboards to brace your feet. In July and August you climb them in a conga line. When the rock is dry it is thrilling. When it is wet it is dangerous; nearly all fatal falls from the cable route have happened on wet rock. Rangers assist hundreds of hikers on this trail every summer, and most of those emergencies trace back to poor preparation.\n\n' +
      'A permit is required past the base of the subdome whenever the cables are up, typically the Friday before Memorial Day through the day after Columbus Day, with a hard cap of 300 people per day (about 225 day hikers). Rangers check permits and photo ID at the subdome. There are two ways in, both lotteries on recreation.gov, both with a $10 non-refundable application fee and $10 per person if you win.\n\n' +
      'The **preseason lottery** has, in recent years, taken applications through March with results emailed in mid-April. Up to six people and up to seven date choices per application. Recent seasons have run around a one-in-five success rate. Saturdays draw the most applications; weekdays late in the season are the soft spot.\n\n' +
      'The **daily lottery** releases extra permits two days before each hike date: apply by 4 p.m. Pacific, results that evening. Recent weekday odds have run around 22 percent, weekends closer to 14. If you strike out preseason, plan the hike for the middle of your trip and apply every eligible day you are in the park.\n\n' +
      'The programs list in this guide carries the typical lottery windows as calendar events you can add to your trip plan, so the March application month and the two-day-ahead rhythm do not sneak past you. Confirm current dates and rules on recreation.gov before you count on any of them.\n\n' +
      'Be honest about fitness, carry four liters of water and gloves for the cables, set a non-negotiable turnaround time, and do not touch the cables if rain is possible. If the permit never comes, Clouds Rest off Tioga Road needs no permit, stands a thousand feet higher, and is the better hike for most people anyway.',
  },
  {
    id: 'hetch-hetchy',
    title: 'Hetch Hetchy: the other Yosemite Valley',
    order: 8,
    section: 'plan',
    teaser: 'A second glacial valley, half of it under a reservoir, with its own entrance, gate hours, and almost no visitors.',
    body:
      'Yosemite has a second granite valley. Hetch Hetchy sits in the park\'s northwestern corner: same elevation as the famous one, roughly the same length, carved by the same kind of glacier. In 1913 Congress let San Francisco dam it, over John Muir\'s ferocious objection, and since the O\'Shaughnessy Dam was completed in 1923 the lower valley has been a reservoir supplying drinking water to roughly 2.7 million people in the Bay Area. The walls, the domes, and the waterfalls above the waterline are still there, and on a Saturday in July when the Valley is jammed, you can hike here all day and see fewer than a hundred people.\n\n' +
      'It is its own corner of the park with its own rules. You reach it via Highway 120 and the Big Oak Flat Entrance, then a separate winding road, about 16 miles to the dam. From Yosemite Valley the drive is roughly an hour and forty-five minutes each way, which is why this works as a full day and not a half-day add-on. The access road is open roughly sunrise to sunset, with exact hours posted at the entrance and on the NPS Hetch Hetchy page, and it carries a 25-foot vehicle length limit. Arrive at 7 p.m. expecting a sunset walk and you will be turned away.\n\n' +
      'The standard day: walk the quarter mile across the dam, through a hand-cut tunnel, then take the trail to the base of **Wapama Falls**, which drops over 1,000 feet down the north wall. About 5 miles round trip, roughly 700 feet of rolling gain, four to five hours with lunch at the falls. In spring, wispy Tueeulala Falls runs beside it; the pair in May is the best version of the place. In high water the bridge below Wapama gets soaked and is sometimes closed, so check conditions first.\n\n' +
      'The area is open year-round, though snow can close the access road in winter; spring through early summer is prime, and October brings gold black oaks and empty trails. There is no food, no lodging, and no swimming or boating: this is a domestic water supply. Pack everything in. The lack of amenities is exactly why almost nobody goes, and exactly why you should.',
  },
  {
    id: 'eating-in-the-park',
    title: 'Eating in the park: the realistic tiers',
    order: 22,
    section: 'on-the-ground',
    teaser: 'Your cooler beats most of it. The pizza deck earns its line, the Ahwahnee is an event, and the rest is fuel.',
    body:
      'The Valley is not a culinary destination, and the trip goes better once you accept that. Think in tiers, from what you brought to what you book.\n\n' +
      '**Tier one is your cooler.** Buy groceries in a gateway town, pack a cooler, and eat lunch on a granite slab next to the river. The Cascade Picnic Area has shade, tables, and its own stretch of the Merced; El Capitan Meadow has no tables and the best view in the Valley. This beats any counter in the park on both price and setting. The catch is the bear rules, which are law: food and anything scented goes in a steel food locker or your trunk, never loose in the car overnight, and a daypack with snacks stays within arm\'s reach. See the bear topic in this guide.\n\n' +
      '**Tier two is the counter.** Degnan\'s Kitchen in Yosemite Village is the one place inside the park to get a decent sandwich for under twenty dollars, and a 7 a.m. coffee and breakfast sandwich there is a solid Valley move. The Village Store is for the emergency afternoon popsicle, not for provisioning; everything in it costs more than it should.\n\n' +
      '**Tier three is the pizza deck.** The Curry Village pizza stop in the Valley region is the one restaurant in the park worth going out of your way for: pizza and beer on a wooden deck under the Glacier Point Apron at the end of a long day. There is almost always a line, and the line is part of it. Not the best pizza in California; the best meal in the Valley on the right summer evening.\n\n' +
      '**Tier four is the Ahwahnee dining room,** covered at the Ahwahnee stop in this guide. It has moved to a prix fixe dinner format at special-occasion prices, reservations required, so it is a planned event rather than a spontaneous stop. Book ahead or skip it without guilt.\n\n' +
      'What to skip: the gateway-town chains, and the idea that food is the trip. If a night out matters, Mariposa and Oakhurst each have a brewery-restaurant worth the drive. Otherwise, one pizza-deck night, one cooler lunch by the river, done.',
  },
  {
    id: 'with-kids',
    title: 'Yosemite with kids: pace, water, and the badge',
    order: 23,
    section: 'on-the-ground',
    teaser: 'The Junior Ranger booklet, the four walks that actually work, river-beach logic, and why three things beat eight.',
    body:
      'Families who have a great Yosemite day and families who melt down in a parking lot differ on three things: what time they arrived, what they did first, and whether they let the kids set the pace. Arrive before 9 a.m., park once, and make your first stop the visitor center.\n\n' +
      'At the desk, ask for a **Junior Ranger booklet**. It is free and it is the best parenting tool the Park Service has ever produced: activities keyed to spots around the park, things to find, questions to answer. Your kids have missions now. When they finish enough, they take the oath with a ranger and get a badge they will care about more than anything in the gift shop. While you are there, check the ranger program schedule; the free programs, some built for kids, fill the tired 4 p.m. gap perfectly. The programs list in this guide filters Junior Ranger and kids events for your trip dates, so you can slot them into your plan before you arrive.\n\n' +
      'The walks that actually work: **Lower Yosemite Fall** (1 mile, paved, stroller-friendly, misty in spring and a granite playground in late summer), **Cook\'s Meadow** (2 miles, paved, flat, the postcard views without the crowds), **Mirror Lake** (2 miles on packed dirt, fine with a real-wheeled stroller, boulders and creek at the end), and **Bridalveil Fall** (half a mile, paved but steep in spots, carry the small ones). Skip the Mist Trail unless your kids are 12 and up and fit; 600 granite steps and cliff exposure is an adult hike.\n\n' +
      'Budget unstructured water time. Kids remember the creek, not the vista. By late July the Merced mellows and Housekeeping Camp has the best family river beach, with the Cascade Picnic Area as the quieter option. Before mid-July the snowmelt current is genuinely dangerous: nothing above the knees, and never near water above a waterfall.\n\n' +
      'The pace math: short legs cover about half what you think, and enthusiasm is a budget you spend down. Plan three things done well, not eight viewpoints. Build in a bail-out: know which stop you will cut, keep the car or shuttle within reach, and treat a meltdown at 2 p.m. as data, not failure. Two hours of hiking and four hours of throwing pebbles in a creek is not a wasted day. That is the trip.',
  },
  {
    id: 'non-hikers',
    title: 'The park without hiking',
    order: 24,
    section: 'on-the-ground',
    teaser: 'The valley loop, the pullouts, and the short paved paths deliver most of the iconic views without a trail. Where the payoff per step is highest.',
    body:
      'You do not have to hike to see Yosemite. The valley sits in a granite trough about a mile wide and seven miles long, and the roads pass within view of, or directly under, almost every famous feature in the park: Tunnel View, El Capitan, Bridalveil Fall, Yosemite Falls, Half Dome. Several can be photographed from the parking lot. This is not a watered-down version of the park. It is the park as the road system was designed to deliver it; the trails are an addition, not the substitute.\n\n' +
      'The core of it is the **valley loop by car**, three to four hours including stops. Tunnel View is a parking-lot overlook, no walking required. Valley View is a riverside pullout with a flat path of about thirty yards and benches. El Capitan Meadow is a roadside pullout where you stand at the meadow edge and look up; with binoculars you can sometimes pick out climbers on the wall. Cook\'s Meadow puts the reflected Yosemite Falls view within a hundred feet of the car. Sentinel Bridge is fifty feet of paved walking to the view of Half Dome over the Merced, one of the most photographed views in the park.\n\n' +
      'If a little walking is fine, the highest payoff per step:\n\n' +
      '- **Bridalveil Fall**: a paved quarter mile with a small grade to the lower viewing area.\n' +
      '- **Lower Yosemite Fall**: a half-mile paved loop to the base of the falls, one slight rise.\n' +
      '- **Cook\'s Meadow boardwalk**: a flat one-mile loop with benches at intervals.\n\n' +
      'The two big drives extend the same logic. Glacier Point ends at a lot a few hundred yards from the overlook, on a paved path with a moderate descent, at 7,200 feet with Half Dome at eye level. Tioga Road is itself the experience, with Olmsted Point, the Tenaya Lake beach, and the Tuolumne Meadows pullouts all reachable from the road shoulder or short paved paths. Both roads are seasonal; the Seasons topic covers the windows.\n\n' +
      'For weather days or slower pacing: the Yosemite Museum and the Ansel Adams Gallery are free to enter, and the Ahwahnee\'s Great Lounge is open to the public. For mixed-ability groups, the shape that works is low-energy mornings, one or two short walks separated by a long break, and one shared big-view moment, Glacier Point if the road is open, Tunnel View at sunset if it is not. Drop the hikers in your group at a trailhead early and pick them up at noon. Everyone gets what they want.',
  },
  {
    id: 'stargazing',
    title: 'Stargazing: where and when to look up',
    order: 25,
    section: 'on-the-ground',
    teaser: 'The valley floor is a mediocre observatory. The rim and the high country are among the best drive-to dark skies in California, if you do the moon math.',
    body:
      'The valley is the wrong place to stargaze. On the Bortle dark-sky scale, where 1 is the darkest natural sky and 9 is an inner city, most of the valley floor reads 3 or 4: lodging and parking lights plus glow from outside the park. The high country, Glacier Point, Tioga Road, Tuolumne Meadows, reads 2 and occasionally 1. The difference is not subtle. At Bortle 4 you see roughly 2,000 stars and a faint Milky Way; at Bortle 2 you see closer to 6,000 and the Milky Way casts shadows.\n\n' +
      'The other variable is the **moon**. A full moon at a dark site is brighter than a new moon over the suburbs, and it washes out the Milky Way entirely. Plan around it: new-moon nights, or hours when the moon has set or not yet risen. The programs list in this guide carries the full-moon dates and the summer star-party season as calendar events, so you can lay your trip dates against them and add them to a trip plan.\n\n' +
      'Timing: the Milky Way\'s galactic core, the bright section everyone means, is visible roughly April through October and peaks June through August. For the densest view, aim for mid-July through mid-August in a new-moon week, when the core arches nearly overhead between about 11 p.m. and 3 a.m. In winter the core is below the horizon; you get Orion and the fainter northern arm instead.\n\n' +
      'The two drive-to spots: **Glacier Point**, at 7,200 feet with open horizons and a paved walk of a few hundred feet from the lot, is one of the best drive-to dark-sky sites in any national park. It hosts free public **star parties** most summer weekend nights, astronomy clubs with telescopes plus ranger talks, roughly June through August while the road is open. **Olmsted Point**, at 8,000 feet on Tioga Road, has flat granite slabs to lie on and very little nearby light. Tenaya Lake and the Tuolumne Meadows pullouts work too.\n\n' +
      'Two practical notes. Use a red headlamp setting after dark; white light ruins night vision, yours and everyone\'s nearby, for 20 to 30 minutes. And layer for cold: at 8,000 feet on a clear summer night the temperature can be in the 40s by midnight, and sitting still chills you faster than hiking.',
  },
  {
    id: 'heat-safety',
    title: 'Heat: the valley floor in July and August',
    order: 41,
    section: 'safety',
    teaser: 'The valley is a granite box that hits 90 regularly in midsummer. The counters are an early start, more water than feels reasonable, and elevation.',
    body:
      'Yosemite Valley sits at about 4,000 feet, which sounds cool and is not. It is a granite box a mile wide with walls 3,000 to 4,000 feet high, no sea breeze, no relief until the sun drops behind the south rim. In July and August, highs reach 90 regularly and occasionally crack 100, and those are shade readings: granite in direct sun can hit 140 to 160 degrees and radiates heat at you from every direction on an exposed trail.\n\n' +
      'The strategy is simple and inflexible: **start before 7 a.m. and be off exposed sections by 10 or 11**. The trails that punish a late start most are the Four Mile Trail (south-facing, shadeless, the one the park service calls very dangerous and exposed), the Upper Yosemite Falls switchbacks above Columbia Rock, and the Mist Trail above the Vernal Fall footbridge, where the refreshing spray ends and 600 stone steps in direct sun begin.\n\n' +
      'The water math: the official guidance is one quart per hour of hiking in the heat; a full day on an exposed trail in July means 4 to 6 liters per person. Carry it anyway. And pair it with electrolytes, salty snacks or tablets, because drinking large amounts of plain water can dilute your blood sodium and produce symptoms that mimic heat exhaustion. By some estimates roughly a quarter of the park\'s nontraumatic search-and-rescue missions are dehydration or heat related.\n\n' +
      'Know the line between the two heat illnesses. **Heat exhaustion**: heavy sweating, nausea, dizziness, pale clammy skin. Shade, rest, water with electrolytes, recovery. **Heat stroke**: sweating stops, skin goes red and dry, confusion sets in. That is a 911 call. Cool the person aggressively, wet clothing, shade, fanning, and get help.\n\n' +
      'The valley itself offers two refuges: the shaded river corridor, which runs 10 to 15 degrees cooler than the open meadows, and the Merced itself, swimmable roughly mid-July through mid-September at Sentinel and Cathedral beaches. Do not swim in May or June, when snowmelt makes the river fast and dangerously cold, and never swim above a waterfall.\n\n' +
      'The best move of all is to **go high**. Temperature drops about 3.5 degrees per thousand feet, so Tuolumne Meadows at 8,600 feet runs 18 to 20 degrees cooler than the valley: when the valley is 90, Tuolumne is 72. Glacier Point and Tenaya Lake sit in between. On the worst days, the high country is the trip you actually imagined.',
  },
  {
    id: 'smoke-season',
    title: 'Smoke season: reading the air, flexing the plan',
    order: 42,
    section: 'safety',
    teaser: 'Wildfire smoke overlaps the California summer most years. How to read the air quality index and what a smoke day does to the plan.',
    body:
      'Smoke season in California now runs roughly July through October most years, sometimes into June in dry years, and Yosemite sits in one of the most fire-prone regions in the West. The planning question is not whether your dates might overlap smoke, it is whether you have a plan for the day they do.\n\n' +
      'The geography does most of the work. The valley is a deep granite trough: smoke pushed in on the prevailing summer winds pours in and settles, and cold air drainage at night pulls more down from the ridges, so the valley is often the worst air in the park. The high country above about 7,500 feet, Glacier Point and Tuolumne, is sometimes above the inversion layer holding the smoke down. On a day the valley reads Unhealthy, Tuolumne can read Moderate or even Good. Not always, but often enough that a high-elevation flex plan is the single most useful smoke strategy you have.\n\n' +
      'The tool is the Air Quality Index. Check **airnow.gov** (and its fire and smoke map) plus the park\'s current conditions page on nps.gov the night before you drive in and again the morning of any big hike; readings can change in two hours. The working thresholds: under 100, a normal trip with hazier vistas. 101 to 150, a yellow-light day: short, low-effort activities like the meadow loops, Bridalveil, and the viewpoints, not a big ascent, and be more conservative with children, older adults, and anyone with a respiratory condition. 151 to 200, flex hard: drive to the high country or go indoors, the museum, the gallery, a long lunch. Above 200, seriously consider rescheduling; driving hours to look at gray is not a vacation.\n\n' +
      'Tactics that earn their keep: mornings are usually cleaner than afternoons, since smoke often peaks late in the day as wind picks up. Wind direction matters more than fire distance, a fire 80 miles upwind beats a fire 20 miles downwind. Cancel the long exposed hikes first and keep the short walks. Pack a few N95 masks; they are not a shield but they cut the dose, and if anyone in the group uses a rescue inhaler, carry it.\n\n' +
      'One distinction worth knowing: not all smoke means a wildfire emergency. The park also sets prescribed burns deliberately as forest management, and it announces them on the current conditions page. Either way, judge the day by the AQI reading, not by the smell. No one can tell you in advance whether your week will be clear. The reading on the morning of is the fact; plan to it.',
  },
]

export const ESSENTIALS: EssentialTopicT[] = EssentialTopics.parse(seed).sort(
  (a, b) => a.order - b.order,
)

export const ESSENTIALS_META = {
  title: 'Know before you go',
  teaser:
    'Entrances, crowds, budgets, gateway towns, Half Dome permits, bears, heat, smoke, stargazing, and the packing checklists. The logistics layer under the whole trip.',
}
