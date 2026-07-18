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
    teaser: 'Six downloads and checks to do on wifi the night before. Twenty minutes now buys a trip that works without signal.',
    body:
      'Most of the park has no usable cell service. Everything on this list works around that, and all of it has to happen **before** you lose signal, ideally the night before on hotel or home wifi.\n\n' +
      '**1. Download an offline area in Google Maps.** This is what keeps turn-by-turn driving directions working past the entrance station. In Google Maps: tap your profile picture → **Offline maps** → **Select your own map** → pinch and drag until the rectangle covers the whole park plus the highway you\'re arriving on → **Download**. It\'s a few hundred megabytes, so do it on wifi. Offline areas expire after about thirty days, so refresh it if you downloaded it a while ago. Apple Maps on recent iOS versions has the same feature under your profile → **Offline Maps**. Every GPS pin in this guide hands off to your Maps app with one tap; the offline area is what makes that handoff work at a trailhead with no bars.\n\n' +
      '**2. Download this guide and the park map.** Open **Account → Offline** in this app and download the guide, your region\'s photos, and the offline park map (about 20 MB). After that the whole app, the topo map included, works in airplane mode. The app\'s own map does not depend on Google\'s: it keeps working even if you skip step 1, but you\'ll want both.\n\n' +
      '**3. Grab the current Yosemite Guide.** The park publishes a seasonal newspaper, the *Yosemite Guide*, with the ranger program schedule, shuttle map, and visitor center hours for the exact weeks you\'re there. Download the current PDF from **nps.gov/yose/planyourvisit/guide.htm** and it lives on your phone for the trip.\n\n' +
      '**4. Check the reservation and road situation.** Timed-entry rules change year to year; verify at nps.gov/yose whether your dates and arrival time need a reservation. If your trip touches Glacier Point Road or Tioga Road, check the road status page too.\n\n' +
      '**5. Fuel and cash.** There is no gas in Yosemite Valley. Fill up in the gateway towns, and again at Crane Flat if you\'re heading up Tioga Road.\n\n' +
      '**6. Save the numbers.** 911 works by call or text inside the park. General park information and recorded road conditions: 209/372-0200 (press 1, then 1 for roads). Roadside assistance: 209/372-1060. The Yosemite Medical Clinic in the valley (209/372-4637) takes urgent-care walk-ins on weekday early afternoons; it is not an emergency room.',
    checklist: [
      { id: 'gmaps-offline', label: 'Google or Apple Maps offline area covering the park and your approach highway' },
      { id: 'app-offline', label: 'This guide, photos, and the park map downloaded (Account → Offline)' },
      { id: 'yosemite-guide-pdf', label: 'Current Yosemite Guide PDF saved from nps.gov' },
      { id: 'reservation-check', label: 'Timed-entry reservation rules checked for your dates' },
      { id: 'road-status', label: 'Glacier Point and Tioga road status checked, if your plan needs them' },
      { id: 'fuel', label: 'Gas tank filled outside the park' },
      { id: 'batteries', label: 'Phone and battery pack charged' },
      { id: 'key-numbers', label: 'Key numbers saved: 911 (call or text), park info 209/372-0200, roadside 209/372-1060, clinic 209/372-4637' },
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
    teaser: 'The free shuttle runs 7 a.m. to 10 p.m., there is no gas in the valley, and moving your car after 9 a.m. is the mistake.',
    body:
      'The single biggest tactical decision of a valley day is where your car stops moving.\n\n' +
      'The east end of Yosemite Valley runs on a **free shuttle** that loops the places you actually want: the visitor center area, the Lower Yosemite Fall stop, Curry Village, and the trailhead stop for the Mist Trail. It runs frequently through the day. Park once in a day-use lot, then treat the shuttle as your valley transit. The stops in this guide that sit on the loop say so.\n\n' +
      'The valley roads are mostly **one-way**: Southside Drive flows in, Northside Drive flows out. Miss a pullout and you are committing to the full loop to come back around, which costs twenty to thirty minutes in traffic season. The guide orders the valley stops with this in mind. Read the next two stops before you drive past either.\n\n' +
      'If you are staying outside the park, the math is simple: every hour after sunrise you arrive costs you a parking option. The lots fill from mid-morning in season. Arriving by 8 a.m. is not an enthusiast flex, it is how you skip the part of the day people go home complaining about.\n\n' +
      '**Shuttle mechanics.** The shuttle runs 7 a.m. to 10 p.m. daily, free, no ticket. Two loops: the Valleywide loop (green) covers the full valley about every half hour, roughly 90 minutes round trip; the East Valley loop (purple) covers the visitor center, Curry Village, and the Happy Isles trailheads every 20 minutes or so, about 50 minutes round trip. Pets are not allowed on shuttles. The Mariposa Grove runs its own free shuttle from its Welcome Plaza, roughly every 15 minutes through the day in season.\n\n' +
      '**Transit from outside.** YARTS buses reach the valley without a car: the Highway 140 route from Merced runs year-round, and summer-only routes come over 120 from Sonora, 395 from Mammoth Lakes, and 41 from Fresno. Schedules at yarts.com.\n\n' +
      '**Fuel, charging, breakdowns.** There is no gas in Yosemite Valley. The nearest pumps are El Portal (15 miles), Crane Flat (16.5 miles), and Wawona (28 miles), all 24-hour pay-at-pump. EV chargers exist at several valley locations (The Ahwahnee, Curry Village, the Welcome Center area, Yosemite Falls parking, Yosemite Valley Lodge) plus El Portal and the Wawona Store; check the current Yosemite Guide for counts and status. For a breakdown, 24-hour roadside assistance is 209/372-1060.\n\n' +
      '**Bikes, and live traffic.** The valley has miles of paved bike path, 15 mph limit, no bikes on hiking trails, helmets required under 18. Rentals at Yosemite Valley Lodge and Curry Village in season, and a free bike share (one- to two-hour rides) stages at Yosemite Village and the Camp 4 parking area; goyose.org/bikeshare. For live traffic and parking alerts, text ynptraffic to 333111. Recorded road conditions: 209/372-0200, then 1, 1.',
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
      '- **Never approach a bear, ever, for any photo.** If one approaches you, gather children, stand together, make noise, look large. Do not run and do not drop your food; that teaches the bear that approaching people works.\n' +
      '- **Keep your distance: at least 150 feet from bears and coyotes, 25 feet from everything else.** Approaching or feeding any wildlife, birds and squirrels included, is illegal, not just unwise.\n\n' +
      'Drive the posted speed limits, especially at dawn and dusk. Speeding kills bears in this park every year, and the curve where it happens usually has a sign marking the last one. Drivers hit dozens of bears in this park in a typical year. If you see a bear, or see people crowding one, report it: the Save-a-Bear line is 209/372-0322.\n\n' +
      'None of this means you should hope not to see a bear. Watching one graze a meadow at a legal distance is one of the best moments the park offers, and the meadows with the best odds are in [Where to actually see a bear](/essentials/bear-viewing).',
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
      'This is the dresser-top list, not an expedition manifest. It assumes day trips from a bed, not backpacking. Check things off below; the app remembers between visits. When the short list is not enough, the Day pack topic carries the full trail manifest and Pack the car carries the complete car-camping load.\n\n' +
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
      'At the desk, ask for a **Junior Ranger booklet**. It is free and it is the best parenting tool the Park Service has ever produced: activities keyed to spots around the park, things to find, questions to answer. Your kids have missions now. When they finish enough, they take the oath with a ranger and get a badge they will care about more than anything in the gift shop. While you are there, check the ranger program schedule; the free programs, some built for kids, fill the tired 4 p.m. gap perfectly. The programs list in this guide filters Junior Ranger and kids events for your trip dates, so you can slot them into your plan before you arrive. In summer there are daily Junior Ranger walks in the valley and a Junior Ranger talk at the Mariposa Grove, and the Happy Isles Art and Nature Center runs a free drop-in kids art studio most days.\n\n' +
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
      'The two drive-to spots: **Glacier Point**, at 7,200 feet with open horizons and a paved walk of a few hundred feet from the lot, is one of the best drive-to dark-sky sites in any national park. It hosts free public **star parties** on scheduled summer nights, astronomy clubs with telescopes, plus a ticketed concessioner-run sky program some weeks. The dates are published per season; the programs list in this guide carries them for your trip window. **Olmsted Point**, at 8,000 feet on Tioga Road, has flat granite slabs to lie on and very little nearby light. Tenaya Lake and the Tuolumne Meadows pullouts work too.\n\n' +
      'Two practical notes. Use a red headlamp setting after dark; white light ruins night vision, yours and everyone\'s nearby, for 20 to 30 minutes. And layer for cold: at 8,000 feet on a clear summer night the temperature can be in the 40s by midnight, and sitting still chills you faster than hiking.',
  },
  {
    id: 'bear-viewing',
    title: 'Where to actually see a bear',
    order: 26,
    section: 'on-the-ground',
    teaser: 'Cook\'s Meadow right at sunset, the Crane Flat meadow, and how to watch a black bear without changing its evening.',
    body:
      'Yosemite holds a few hundred black bears, and most visitors never see one, because most visitors are looking at waterfalls at noon. Bears keep a different schedule. They work the meadow edges at dawn and in the last hour of light: grass in spring, grubs out of downed logs in summer, acorns under the black oaks in fall. If you want to see one, go where the food is, at the hours the bears are on it.\n\n' +
      'The short list, in rough order of odds:\n\n' +
      '- **[Crane Flat](/stop/crane-flat-meadow)** is one of the most consistent bear areas in the park. The big meadow at the Tioga Road junction is ringed by forest, and bears come onto the open grass through spring and summer. Scan the far tree line from the meadow edge; binoculars turn a dark dot into the sighting.\n' +
      '- **[Cook\'s Meadow](/stop/cooks-meadow-loop) right at sunset** is the valley\'s best odds. Walk the boardwalk loop in the last light and watch the meadow edge and the black oaks, especially in fall when the acorns drop. Half Dome going pink is the consolation prize if the bears stay home.\n' +
      '- **[El Capitan Meadow](/stop/el-capitan-meadow)** and the valley\'s western meadows work the same sunset window, with fewer people standing next to you.\n' +
      '- **The Tioga Road meadows**, Tuolumne Meadows included, produce steady sightings all summer; the road-shoulder pullouts are the viewing platform. [Wawona\'s meadow](/stop/wawona-meadow-loop) does the same for the south end of the park on summer evenings.\n\n' +
      'How to watch one. Stay at least 150 feet away, which is about half a football field; if the bear changes what it is doing because of you, you are too close, whatever the distance. Watch from the boardwalk, the road shoulder, or beside your car, never from inside the meadow. Never approach, never feed, never walk closer for a photo, and keep children beside you. And drive the posted limits at dawn and dusk: cars kill more of these bears than anything else. If you see people crowding a bear, report it to the Save-a-Bear line, 209/372-0322.\n\n' +
      'A sighting is luck stacked on habit: right meadow, right hour, quiet feet. The food-storage rules that keep these bears wild, and alive, are in [Bears, and the food rules](/essentials/bear-safety). They are the other half of this topic.',
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
  {
    id: 'quiet-trails',
    title: 'The quiet trails, and the ones we left out',
    order: 43,
    section: 'safety',
    teaser: 'What the Secret Guide trails are, what they are not, and why the closed routes in the park\'s history get named here but never mapped.',
    body:
      'The hidden trails in the Secret Guide are maintained, signed park trails. Every one of them appears on the official park map; what makes them hidden is traffic, not legality or condition. But less traveled cuts both ways. On the Mist Trail, a twisted ankle means forty strangers offer help within the minute. On the trail to Stanford Point or Rancheria Falls, the next hiker may be hours behind you. The margin you carry has to be bigger out there: the full day-pack list, more water than the mileage suggests, and someone at home who knows your trail and your turnaround time.\n\n' +
      'Creek fords are seasonal decisions, not fixed facts about a trail. A crossing that is a rock-hop in August can be a fast, thigh-deep problem in June, and snowmelt water is cold enough to take your footing and your judgment at the same time. The rule that keeps people alive is boring: if moving water is over your knees, turn around. The stop is still there next month.\n\n' +
      'Some stops carry a short Caution note. It is not boilerplate; it names the specific thing that hurts people at that specific place, a slick lip above a cascade, an unrailed rim, a ford. Read it as part of the stop, not as fine print.\n\n' +
      'Finally, the routes we left out. This guide names some famous ghosts, the Ledge Trail to Glacier Point, the Sierra Point overlook, Fern Ledge behind the upper fall, the descent of Tenaya Canyon, because they are part of the park\'s story and you will hear about them. It gives directions to none of them. The park closed or abandoned those routes for cause, the cause being rockfall, exposure, and a fatality list that is still growing, and no guidebook paragraph changes what the granite does. The history is yours to enjoy. The maintained trail next to it is the one to walk.',
  },

  // ── Packing kits ported from the editorial KIT system (brand callouts and
  // affiliate links stripped; ids prefixed so the global tfg.checklist map
  // cannot collide across topics) ─────────────────────────────────────────────

  {
    id: 'day-pack',
    title: 'The day pack, item by item',
    order: 61,
    section: 'packing',
    teaser: 'The full day-hike manifest, grouped the way you pack, navigation through emergency. Most of it is small and lives in the pack year-round.',
    body:
      'This is the single-day trail kit for the Valley or the high country, spring through fall. It looks long because it is honest; most of it is small and stays in the pack between trips. The dresser-top version is the Packing checklist topic; this is the one to walk through the night before a real hike.\n\n' +
      'Three principles do most of the work. Water and calories beyond what feels reasonable, because the climbs are steeper and the air drier than the trailhead suggests. Layers over jackets, because the valley floor and the rim can be twenty degrees apart on the same afternoon. And navigation that does not need a signal, because cell service dies past Crane Flat.\n\n' +
      'Check items off below; the app remembers between visits.',
    checklist: [
      { id: 'daypack-pack', label: '20 to 25L pack with a hip belt', note: 'Hip belt matters more than the brand. It should sit on your iliac crest, not your waist.', group: 'Navigation' },
      { id: 'daypack-paper-map', label: 'Paper map of the park', note: 'Cell service dies past Crane Flat. A physical map does not need a signal.', group: 'Navigation' },
      { id: 'daypack-compass', label: 'Baseplate compass', note: 'Paired with the paper map, it is useful when the phone is dead or lost.', group: 'Navigation' },
      { id: 'daypack-offline-maps', label: 'Downloaded offline maps', note: 'Download at home before you leave; the park has no reliable data connection. Account → Offline covers this guide and its park map.', group: 'Navigation' },
      { id: 'daypack-inreach', label: 'Satellite messenger with SOS', note: 'Two-way texting and SOS when there is no cell signal, which is most of the high country.', group: 'Navigation' },
      { id: 'daypack-power-bank', label: 'Power bank, 10,000 mAh', note: 'Backup for phone navigation and the satellite messenger. Charge it the night before.', group: 'Navigation' },
      { id: 'daypack-sun-hat', label: 'Wide-brim sun hat', note: 'Granite reflects. A baseball cap is not enough above 7,000 feet.', group: 'Sun protection' },
      { id: 'daypack-sun-shirt', label: 'Long-sleeve sun shirt, UPF 50', note: 'Light color, hood if you can find it. Wear it even in heat.', group: 'Sun protection' },
      { id: 'daypack-sunscreen', label: 'Sunscreen, SPF 50, reef-safe', note: 'Reapply every two hours at elevation.', group: 'Sun protection' },
      { id: 'daypack-sunglasses', label: 'Polarized sunglasses, UV400', note: 'Polarized lenses cut glare off granite and water.', group: 'Sun protection' },
      { id: 'daypack-lip-balm', label: 'SPF lip balm', note: 'Lips chap and burn faster than skin at elevation.', group: 'Sun protection' },
      { id: 'daypack-insulated-jacket', label: 'Packable insulated jacket', note: 'The Valley is warm at 10am and 40°F at the rim by 3pm. Synthetic insulation still works if it gets wet.', group: 'Clothing & insulation' },
      { id: 'daypack-rain-shell', label: 'Packable rain shell with taped seams', note: 'Afternoon thunderstorms are common in summer high country.', group: 'Clothing & insulation' },
      { id: 'daypack-beanie', label: 'Warm beanie', group: 'Clothing & insulation' },
      { id: 'daypack-gloves', label: 'Lightweight gloves', note: 'Worth carrying for Tuolumne.', group: 'Clothing & insulation' },
      { id: 'daypack-extra-socks', label: 'Extra wool or synthetic socks', note: 'Wet socks cause blisters. A dry pair costs almost no weight.', group: 'Clothing & insulation' },
      { id: 'daypack-buff', label: 'Buff or neck gaiter', group: 'Clothing & insulation' },
      { id: 'daypack-headlamp', label: 'Headlamp plus spare battery', note: 'Day hikes turn into night hikes more often than you would think.', group: 'Illumination' },
      { id: 'daypack-first-aid-kit', label: 'Small first aid kit', note: 'Blister care is what you actually use.', group: 'First aid' },
      { id: 'daypack-leukotape', label: 'Leukotape or moleskin', note: 'Apply before hot spots form.', group: 'First aid' },
      { id: 'daypack-ibuprofen', label: 'Ibuprofen', group: 'First aid' },
      { id: 'daypack-antihistamine', label: 'Antihistamine', group: 'First aid' },
      { id: 'daypack-tweezers', label: 'Tweezers', group: 'First aid' },
      { id: 'daypack-prescription-meds', label: 'Personal prescription meds', group: 'First aid' },
      { id: 'daypack-lighter', label: 'Lighter or waterproof matches', note: 'Emergency fire only. Campfires are banned above 9,600 feet.', group: 'Fire' },
      { id: 'daypack-knife', label: 'Small folding knife or multi-tool', group: 'Tools & repair' },
      { id: 'daypack-duct-tape', label: 'Duct tape, short strip', group: 'Tools & repair' },
      { id: 'daypack-paracord', label: '10 to 15 feet of paracord', group: 'Tools & repair' },
      { id: 'daypack-reservoir', label: '2L reservoir plus 1L bottle', note: 'Reservoir for steady sipping, bottle for filtering refills. Both, not either.', group: 'Food & water' },
      { id: 'daypack-water-filter', label: 'Squeeze water filter', note: 'Squeeze-style. Cheap, fast, and keeps working when the temperature drops.', group: 'Food & water' },
      { id: 'daypack-electrolytes', label: 'Electrolyte tabs or powder', group: 'Food & water' },
      { id: 'daypack-trail-snacks', label: 'Trail snacks, twice what you think', note: 'Calories matter more than weight up here. Bring real food: bars, nuts, jerky, dried fruit, hard candy.', group: 'Food & water' },
      { id: 'daypack-emergency-food', label: 'Extra emergency food, one meal', group: 'Food & water' },
      { id: 'daypack-bivy', label: 'Emergency bivy or space blanket', group: 'Emergency' },
      { id: 'daypack-whistle', label: 'Pealess whistle', group: 'Emergency' },
      { id: 'daypack-head-net', label: 'Over-the-head mosquito head net', note: 'Meadows and creek crossings in spring and early summer can be dense with mosquitoes.', group: 'Easily forgotten', season: 'Early summer' },
      { id: 'daypack-insect-repellent', label: 'DEET or picaridin insect repellent', group: 'Easily forgotten', season: 'Early summer' },
      { id: 'daypack-hand-sanitizer', label: 'Hand sanitizer', group: 'Easily forgotten' },
      { id: 'daypack-trowel', label: 'Trowel, TP, and Ziploc', note: 'For catholes on longer day hikes.', group: 'Easily forgotten' },
      { id: 'daypack-trekking-poles', label: 'Trekking poles', note: 'They reduce knee stress on steep descents.', group: 'Easily forgotten' },
      { id: 'daypack-sit-pad', label: 'Packable foam sit pad', group: 'Easily forgotten' },
      { id: 'daypack-dry-bag', label: 'Small dry bag for phone and electronics', group: 'Easily forgotten' },
      { id: 'daypack-cash', label: 'Cash in small bills', note: 'Parking is cash-only at several trailheads.', group: 'Easily forgotten' },
      { id: 'daypack-footwear', label: 'Hiking boots or trail runners', note: 'Road sneakers do not grip wet granite.', group: 'Easily forgotten' },
    ],
  },
  {
    id: 'pack-the-car',
    title: 'Pack the car: the full trunk load',
    order: 62,
    section: 'packing',
    teaser: 'The complete car-camping manifest, from the camp box to bear-locker discipline. Pack it once, leave it packed.',
    body:
      'The full trunk load for a Yosemite drive with a campsite or tent cabin at the end of it. The organizing idea is the camp box: one durable bin holding the essentials you always bring, stored loaded between trips, grabbed on the way out the door.\n\n' +
      'Two Yosemite-specific rules shape the load. First, bear-locker discipline: everything with a scent, food, toothpaste, sunscreen, trash, goes in the campsite bear box, never in the car overnight. The trunk is not bear-proof. Second, firewood is bought in the park, not carried in; California invasive-pest rules apply and rangers check.\n\n' +
      'Nobody needs every item on every trip. Skim the groups that match your setup and check off as you load.',
    checklist: [
      { id: 'car-john-box', label: 'The camp box: one bin, always packed', note: 'A single durable storage box holding every camping essential you always bring: a double-burner stove, propane, a hatchet, paracord, firestarter, a flashlight, a spare headlamp and batteries, a lantern, a tarp, a deck of cards. The point is that you never unpack it between trips. Load it once, store it loaded, grab it on the way out the door. You will never forget the propane again.', group: 'The John box' },
      { id: 'car-tent', label: 'Tent sized for the group plus one', group: 'Shelter & sleep' },
      { id: 'car-footprint', label: 'Tent footprint or ground cloth', group: 'Shelter & sleep' },
      { id: 'car-stakes', label: 'Extra tent stakes', note: 'Rocky Sierra soil bends cheap ones.', group: 'Shelter & sleep' },
      { id: 'car-mallet', label: 'Mallet or rubber hammer', group: 'Shelter & sleep' },
      { id: 'car-sleeping-bag', label: 'Sleeping bag, one per person', note: 'Rate it to at least 20°F.', group: 'Shelter & sleep' },
      { id: 'car-sleeping-pad', label: 'Sleeping pad or air mattress', group: 'Shelter & sleep' },
      { id: 'car-pillow', label: 'Pillow, one per person', group: 'Shelter & sleep' },
      { id: 'car-blankets', label: 'Extra blankets', note: 'One wool blanket per tent.', group: 'Shelter & sleep' },
      { id: 'car-tarp-primary', label: 'Tarp', group: 'Shelter & sleep' },
      { id: 'car-tarp-extra', label: 'Extra tarp', note: 'Stage it separately so you always have a spare.', group: 'Shelter & sleep' },
      { id: 'car-canopy', label: 'Pop-up shade canopy', note: 'Eight hours of August sun makes this mandatory.', group: 'Shelter & sleep' },
      { id: 'car-canopy-stakes', label: 'Canopy stakes and guy lines', group: 'Shelter & sleep' },
      { id: 'car-tent-repair', label: 'Tent repair kit', group: 'Shelter & sleep' },
      { id: 'car-stove', label: 'Double-burner propane stove', group: 'Kitchen & cooking' },
      { id: 'car-windscreen', label: 'Stove windscreen', note: 'Sierra afternoons are windy.', group: 'Kitchen & cooking' },
      { id: 'car-spare-propane', label: 'Spare standard 1 lb propane canister', note: 'Always carry one extra.', group: 'Kitchen & cooking' },
      { id: 'car-little-kamper', label: 'Refillable 1 lb propane canister', note: 'Sold at the Village Store and other in-park locations on an exchange model: buy one, then swap empties for full. The park disposes of roughly 24,000 single-use cylinders left at campsites every year.', group: 'Kitchen & cooking' },
      { id: 'car-adapter-hose', label: '1 lb-to-bulk-tank adapter hose', note: 'Cheaper fuel on longer trips.', group: 'Kitchen & cooking' },
      { id: 'car-skillet', label: 'Cast iron skillet, 10 to 12 inch', group: 'Kitchen & cooking' },
      { id: 'car-pot', label: 'Pot with lid, 4 quart', group: 'Kitchen & cooking' },
      { id: 'car-saucepan', label: 'Saucepan, 2 quart', group: 'Kitchen & cooking' },
      { id: 'car-kettle', label: 'Kettle or percolator', group: 'Kitchen & cooking' },
      { id: 'car-dutch-oven', label: 'Dutch oven, optional', group: 'Kitchen & cooking' },
      { id: 'car-grate', label: 'Portable grilling grate', note: 'Campsite grates vary.', group: 'Kitchen & cooking' },
      { id: 'car-pot-gripper', label: 'Pot gripper or handle', group: 'Kitchen & cooking' },
      { id: 'car-cutting-board', label: 'Thin flexible cutting board', note: 'It rolls flat and rinses in seconds.', group: 'Kitchen & cooking' },
      { id: 'car-chef-knife', label: 'Chef knife in a sheath', group: 'Kitchen & cooking' },
      { id: 'car-paring-knife', label: 'Paring knife', group: 'Kitchen & cooking' },
      { id: 'car-spatula', label: 'Metal spatula', group: 'Kitchen & cooking' },
      { id: 'car-tongs', label: 'Long-handled tongs', group: 'Kitchen & cooking' },
      { id: 'car-wooden-spoon', label: 'Wooden spoon', group: 'Kitchen & cooking' },
      { id: 'car-ladle', label: 'Ladle', group: 'Kitchen & cooking' },
      { id: 'car-whisk', label: 'Whisk', group: 'Kitchen & cooking' },
      { id: 'car-serving-spoon', label: 'Large serving spoon', group: 'Kitchen & cooking' },
      { id: 'car-can-opener', label: 'Can opener', group: 'Kitchen & cooking' },
      { id: 'car-bottle-opener', label: 'Bottle opener or wine key', group: 'Kitchen & cooking' },
      { id: 'car-mixing-bowl', label: 'Collapsible mixing bowl', group: 'Kitchen & cooking' },
      { id: 'car-measuring-cups', label: 'Measuring cups', group: 'Kitchen & cooking' },
      { id: 'car-plates', label: 'Unbreakable plates, one per person', group: 'Kitchen & cooking' },
      { id: 'car-bowls', label: 'Unbreakable bowls, one per person', group: 'Kitchen & cooking' },
      { id: 'car-mugs', label: 'Insulated mugs, one per person', group: 'Kitchen & cooking' },
      { id: 'car-utensils', label: 'Eating utensils, one set per person', group: 'Kitchen & cooking' },
      { id: 'car-foil', label: 'Heavy-duty aluminum foil', group: 'Kitchen & cooking' },
      { id: 'car-ziploc-bags', label: 'Ziploc bags, quart and gallon', group: 'Kitchen & cooking' },
      { id: 'car-spice-kit', label: 'Spice kit', note: 'Salt, pepper, garlic, paprika, red pepper, olive oil.', group: 'Kitchen & cooking' },
      { id: 'car-cooking-oil', label: 'Cooking oil in a squeeze bottle', group: 'Kitchen & cooking' },
      { id: 'car-dish-soap', label: 'Biodegradable dish soap', group: 'Kitchen & cooking' },
      { id: 'car-sponge', label: 'Sponge or scrubber', group: 'Kitchen & cooking' },
      { id: 'car-wash-basin', label: 'Collapsible wash basin', note: 'A two-basin wash and rinse uses less water.', group: 'Kitchen & cooking' },
      { id: 'car-dish-towels', label: 'Dish towels', group: 'Kitchen & cooking' },
      { id: 'car-paper-towels', label: 'Paper towels', group: 'Kitchen & cooking' },
      { id: 'car-food-containers', label: 'Reusable food containers', group: 'Kitchen & cooking' },
      { id: 'car-kitchen-trash-bags', label: 'Kitchen trash bags', group: 'Kitchen & cooking' },
      { id: 'car-kitchen-lighter', label: 'Lighter, keep two', group: 'Kitchen & cooking' },
      { id: 'car-kitchen-matches', label: 'Waterproof matches, backup', group: 'Kitchen & cooking' },
      { id: 'car-water-jug-5gal', label: '5 gallon jug with a spigot', note: 'Not for drinking. For radiators, hand-washing, the unexpected.', group: 'Water' },
      { id: 'car-water-jug-2gal', label: '2 gallon collapsible jug', group: 'Water' },
      { id: 'car-water-filter', label: 'Water filter', note: 'Squeeze-style, as a backup if the spigot is closed.', group: 'Water' },
      { id: 'car-purification-tablets', label: 'Purification tablets, backup', group: 'Water' },
      { id: 'car-bottles', label: 'Reusable bottles, one per person', group: 'Water' },
      { id: 'car-tumbler', label: 'Insulated tumbler, one per person', group: 'Water' },
      { id: 'car-firewood', label: 'Firewood, bought in-park', note: 'California invasive-pest rules apply and rangers enforce them at checkpoints. Buy it locally.', group: 'Fire' },
      { id: 'car-kindling', label: 'Kindling', group: 'Fire' },
      { id: 'car-fatwood', label: 'Fatwood or fire-starting sticks', group: 'Fire' },
      { id: 'car-firestarter-cubes', label: 'Firestarter cubes', group: 'Fire' },
      { id: 'car-newspaper', label: 'Newspaper, backup tinder', group: 'Fire' },
      { id: 'car-long-lighter', label: 'Long-reach lighter', group: 'Fire' },
      { id: 'car-fire-matches', label: 'Waterproof matches', group: 'Fire' },
      { id: 'car-fire-gloves', label: 'Leather fire gloves', group: 'Fire' },
      { id: 'car-coal-shovel', label: 'Small metal shovel or trowel', note: 'For spreading coals and smothering the fire.', group: 'Fire' },
      { id: 'car-water-bucket', label: 'Metal water bucket', note: 'Full extinguishment is required before you leave a fire.', group: 'Fire' },
      { id: 'car-roasting-sticks', label: 'Telescoping roasting sticks', group: 'Fire' },
      { id: 'car-campfire-hours', label: 'Valley campfire hours awareness', note: 'Campfires in Valley campgrounds are restricted to certain evening hours, and high-country wilderness fires are banned above 9,600 feet. Propane stoves stay legal during fire bans.', group: 'Fire' },
      { id: 'car-hatchet', label: 'Hatchet', group: 'Tools & repair' },
      { id: 'car-folding-saw', label: 'Folding saw', note: 'Cuts what the hatchet bounces off.', group: 'Tools & repair' },
      { id: 'car-work-gloves', label: 'Work gloves', group: 'Tools & repair' },
      { id: 'car-paracord-50', label: 'Paracord, 50 feet', group: 'Tools & repair' },
      { id: 'car-bank-line-100', label: 'Additional paracord or bank line, 100 feet', group: 'Tools & repair' },
      { id: 'car-bungees', label: 'Assorted bungee cords', group: 'Tools & repair' },
      { id: 'car-carabiners', label: 'Utility carabiners', group: 'Tools & repair' },
      { id: 'car-duct-tape', label: 'Duct tape, full roll', group: 'Tools & repair' },
      { id: 'car-zip-ties', label: 'Assorted zip ties', group: 'Tools & repair' },
      { id: 'car-multi-tool', label: 'Multi-tool', group: 'Tools & repair' },
      { id: 'car-toolkit', label: 'Small toolkit', note: 'Screwdrivers, a wrench, pliers.', group: 'Tools & repair' },
      { id: 'car-pole-sleeve', label: 'Tent pole repair sleeve', group: 'Tools & repair' },
      { id: 'car-seam-sealer', label: 'Seam sealer', group: 'Tools & repair' },
      { id: 'car-gear-ties', label: 'Gear ties', group: 'Tools & repair' },
      { id: 'car-cable-locks', label: 'Cable locks', note: 'Secure gear to the rack or table.', group: 'Tools & repair' },
      { id: 'car-needle-thread', label: 'Heavy-duty needle and thread', group: 'Tools & repair' },
      { id: 'car-headlamp', label: 'Headlamp, one per person', note: 'Vault toilets at midnight are not the place to share.', group: 'Lighting & power' },
      { id: 'car-spare-headlamp', label: 'Spare headlamp with fresh batteries', group: 'Lighting & power' },
      { id: 'car-batteries', label: 'Extra batteries, AA and AAA', group: 'Lighting & power' },
      { id: 'car-lantern', label: 'LED lantern', group: 'Lighting & power' },
      { id: 'car-flashlight', label: 'Handheld flashlight', group: 'Lighting & power' },
      { id: 'car-power-bank', label: 'Power bank, 20,000 mAh', note: 'Cell service is unreliable past Crane Flat.', group: 'Lighting & power' },
      { id: 'car-car-charger', label: 'Multi-port car USB charger', group: 'Lighting & power' },
      { id: 'car-string-lights', label: 'String lights, battery or solar', group: 'Lighting & power' },
      { id: 'car-solar-lantern', label: 'Collapsible solar lantern', group: 'Lighting & power' },
      { id: 'car-candles', label: 'Candles in a covered holder', group: 'Lighting & power' },
      { id: 'car-folding-chairs', label: 'Standard folding camp chairs, one per person', note: 'You will use them more than anything else you bring.', group: 'Comfort & camp setup' },
      { id: 'car-packable-chairs', label: 'Packable backpacking-style camp chairs, one or two extra', note: 'Folds to the size of a water bottle and goes in the John box.', group: 'Comfort & camp setup' },
      { id: 'car-camp-table', label: 'Small folding camp table', note: 'Keeps the picnic table from becoming a staging area.', group: 'Comfort & camp setup' },
      { id: 'car-hammock', label: 'Hammock with tree-friendly straps', group: 'Comfort & camp setup' },
      { id: 'car-outdoor-rug', label: 'Outdoor rug or foam mat', group: 'Comfort & camp setup' },
      { id: 'car-clothesline', label: 'Clothesline, 20 feet', group: 'Comfort & camp setup' },
      { id: 'car-clothespins', label: 'Clothespins', group: 'Comfort & camp setup' },
      { id: 'car-broom', label: 'Whisk broom and dustpan', group: 'Comfort & camp setup' },
      { id: 'car-backup-pillow', label: 'Inflatable backup pillow', group: 'Comfort & camp setup' },
      { id: 'car-quilt', label: 'Packable quilt or outdoor blanket', group: 'Comfort & camp setup' },
      { id: 'car-tote-bags', label: 'Tote bags for grocery and bear-locker runs', group: 'Comfort & camp setup' },
      { id: 'car-first-aid-kit', label: 'Comprehensive first aid kit', note: 'Blister treatment, moleskin, a SAM splint, an ace bandage, antiseptic, gauze, tape, and OTC meds. Note that bear spray is not permitted in Yosemite. Do not bring it.', group: 'Safety & first aid' },
      { id: 'car-tweezers', label: 'Dedicated tweezers', group: 'Safety & first aid' },
      { id: 'car-whistle', label: 'Whistle, one per person', group: 'Safety & first aid' },
      { id: 'car-jump-pack', label: 'Lithium jump pack', note: 'Better than cables. Cell service is unreliable past Crane Flat.', group: 'Safety & first aid' },
      { id: 'car-jumper-cables', label: 'Jumper cables, backup', group: 'Safety & first aid' },
      { id: 'car-road-flares', label: 'Road flares or reflective triangles', group: 'Safety & first aid' },
      { id: 'car-fire-extinguisher', label: 'Small ABC fire extinguisher', group: 'Safety & first aid' },
      { id: 'car-tire-chains', label: 'Tire chains, November through April', note: 'Required during chain controls and rangers check. Practice once at home.', group: 'Safety & first aid', season: 'Winter' },
      { id: 'car-tire-gauge', label: 'Tire pressure gauge', group: 'Safety & first aid' },
      { id: 'car-car-kit', label: 'Basic car kit', note: 'Spare, jack, lug wrench.', group: 'Safety & first aid' },
      { id: 'car-mylar-blankets', label: 'Mylar emergency blankets', group: 'Safety & first aid' },
      { id: 'car-sunscreen', label: 'Sunscreen, SPF 50', group: 'Safety & first aid' },
      { id: 'car-insect-repellent', label: 'Insect repellent, DEET or picaridin', group: 'Safety & first aid' },
      { id: 'car-tick-check', label: 'Tick-check reminder', note: 'Yosemite has Lyme-carrying ticks.', group: 'Safety & first aid' },
      { id: 'car-toilet-paper', label: 'Extra toilet paper', group: 'Hygiene & sanitation' },
      { id: 'car-hand-wash-station', label: 'Portable hand-wash station', group: 'Hygiene & sanitation' },
      { id: 'car-hand-sanitizer', label: 'Hand sanitizer, large', group: 'Hygiene & sanitation' },
      { id: 'car-wet-wipes', label: 'Wet or baby wipes', group: 'Hygiene & sanitation' },
      { id: 'car-camp-soap', label: 'Biodegradable camp soap', note: 'Keep it 200 feet from water.', group: 'Hygiene & sanitation' },
      { id: 'car-shampoo', label: 'Travel shampoo and conditioner', group: 'Hygiene & sanitation' },
      { id: 'car-towels', label: 'Quick-dry towels, one per person', group: 'Hygiene & sanitation' },
      { id: 'car-toiletries', label: 'Toiletries kit', note: 'Toothbrush, paste, floss, deodorant, lip balm, feminine items. All in the bear locker overnight.', group: 'Hygiene & sanitation' },
      { id: 'car-mirror', label: 'Small mirror', group: 'Hygiene & sanitation' },
      { id: 'car-shower-sandals', label: 'Shower sandals or flip-flops', note: 'Curry Village and Housekeeping showers require them.', group: 'Hygiene & sanitation' },
      { id: 'car-shower-coins', label: 'Quarters and small bills', note: 'For the coin showers.', group: 'Hygiene & sanitation' },
      { id: 'car-contractor-bags', label: 'Contractor trash bags', group: 'Hygiene & sanitation' },
      { id: 'car-recycling-bag', label: 'Recycling bag', group: 'Hygiene & sanitation' },
      { id: 'car-grey-water', label: 'Grey-water container', note: 'Do not dump dishwater on the ground.', group: 'Hygiene & sanitation' },
      { id: 'car-wag-bags', label: 'WAG bags for remote sites', group: 'Hygiene & sanitation' },
      { id: 'car-cooler', label: 'Cooler with ice', note: 'Bear-aware: nothing with a scent stays in the car overnight.', group: 'Food & camp kitchen' },
      { id: 'car-second-cooler', label: 'Second cooler or dry-goods bin', group: 'Food & camp kitchen' },
      { id: 'car-block-ice', label: 'Block ice', note: 'It lasts longer. Freeze it in a cleaned jug.', group: 'Food & camp kitchen' },
      { id: 'car-dry-goods-bin', label: 'Dry-goods bin with a lid', group: 'Food & camp kitchen' },
      { id: 'car-coffee-setup', label: 'Coffee setup', note: 'Pour-over or percolator, grounds, filters, a manual grinder.', group: 'Food & camp kitchen' },
      { id: 'car-creamer', label: 'Shelf-stable creamer', group: 'Food & camp kitchen' },
      { id: 'car-tea-cocoa', label: 'Tea and cocoa packets', group: 'Food & camp kitchen' },
      { id: 'car-condiments', label: 'Condiment packets', group: 'Food & camp kitchen' },
      { id: 'car-oil-butter', label: 'Cooking oil and butter, sealed', group: 'Food & camp kitchen' },
      { id: 'car-snack-bag', label: 'Snack bag', note: 'Granola, trail mix, jerky, dried fruit. There is one grocery store in the Valley and the line is long.', group: 'Food & camp kitchen' },
      { id: 'car-smores-kit', label: 'S\'mores kit, boxed together', group: 'Food & camp kitchen' },
      { id: 'car-meal-plan', label: 'Printed meal plan', group: 'Food & camp kitchen' },
      { id: 'car-paper-plates', label: 'Small supply of paper plates and cups', group: 'Food & camp kitchen' },
      { id: 'car-napkins', label: 'Napkins', group: 'Food & camp kitchen' },
      { id: 'car-base-layers', label: 'Moisture-wicking base layers', group: 'Clothing & footwear' },
      { id: 'car-mid-layer', label: 'Mid-layer fleece or down', group: 'Clothing & footwear' },
      { id: 'car-outer-jacket', label: 'Insulated outer jacket', group: 'Clothing & footwear' },
      { id: 'car-rain-jacket', label: 'Packable rain jacket', note: 'Summer afternoon thunderstorms are not rare.', group: 'Clothing & footwear' },
      { id: 'car-rain-pants', label: 'Rain pants', group: 'Clothing & footwear' },
      { id: 'car-hiking-pants', label: 'Zip-off hiking pants', group: 'Clothing & footwear' },
      { id: 'car-camp-pants', label: 'Camp pants or shorts', group: 'Clothing & footwear' },
      { id: 'car-tshirts', label: 'T-shirts', group: 'Clothing & footwear' },
      { id: 'car-sun-shirt', label: 'Long-sleeve UPF 50 sun shirt', group: 'Clothing & footwear' },
      { id: 'car-beanie', label: 'Beanie', group: 'Clothing & footwear' },
      { id: 'car-sun-hat', label: 'Wide-brim sun hat', group: 'Clothing & footwear' },
      { id: 'car-gloves', label: 'Lightweight gloves', group: 'Clothing & footwear' },
      { id: 'car-boots', label: 'Broken-in hiking boots', group: 'Clothing & footwear' },
      { id: 'car-camp-shoes', label: 'Camp shoes or sandals', group: 'Clothing & footwear' },
      { id: 'car-socks', label: 'Extra socks, two pairs per day', group: 'Clothing & footwear' },
      { id: 'car-swimwear', label: 'Swimwear', note: 'The Merced swimming holes are real, cold, and worth it.', group: 'Clothing & footwear', season: 'Summer' },
      { id: 'car-underwear', label: 'Underwear, plus extras', group: 'Clothing & footwear' },
      { id: 'car-sleepwear', label: 'Dedicated sleepwear', group: 'Clothing & footwear' },
      { id: 'car-gaiters', label: 'Low gaiters', group: 'Clothing & footwear' },
      { id: 'car-permit-confirmation', label: 'Printed campsite and permit confirmation', note: 'Include your Half Dome confirmation if you have one.', group: 'Yosemite-specific' },
      { id: 'car-park-map', label: 'Paper park map', group: 'Yosemite-specific' },
      { id: 'car-bear-locker-discipline', label: 'Bear-locker discipline', note: 'All food and scented items, including deodorant, toothpaste, chapstick, sunscreen, and trash, go in the bear box. The trunk is not bear-proof.', group: 'Yosemite-specific' },
      { id: 'car-offline-app', label: 'Offline NPS app, downloaded', group: 'Yosemite-specific' },
      { id: 'car-park-pass', label: 'Park entrance receipt or America the Beautiful pass', note: 'Keep it on the dashboard.', group: 'Yosemite-specific' },
    ],
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
