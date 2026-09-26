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
    teaser: 'Six downloads and checks to do on wifi the night before.',
    body:
      'Most of the park has no usable cell service. Do everything on this list **before** you lose signal, ideally the night before on hotel or home wifi.\n\n' +
      '**1. Download an offline area in Google Maps.** This keeps turn-by-turn directions working past the entrance station. In Google Maps: tap your profile picture → **Offline maps** → **Select your own map** → pinch and drag until the rectangle covers the whole park plus the highway you\'re arriving on → **Download**. It\'s a few hundred megabytes, so do it on wifi. Offline areas expire after about thirty days, so refresh it if you downloaded it a while ago. Apple Maps on recent iOS versions has the same feature under your profile → **Offline Maps**. Every GPS pin in this guide opens your Maps app; the offline area makes that work at a trailhead with no bars.\n\n' +
      '**2. Download this guide and the park map.** Open **Account → Offline** in this app and download the guide, your region\'s photos, and the offline park map (about 20 MB). After that the app, topo map included, works in airplane mode. The app\'s map does not depend on Google\'s, but download both.\n\n' +
      '**3. Grab the current Yosemite Guide.** The park publishes a seasonal newspaper, the *Yosemite Guide*, with the ranger program schedule, shuttle map, and visitor center hours for the exact weeks you\'re there. Download the current PDF from **nps.gov/yose/planyourvisit/guide.htm**.\n\n' +
      '**4. Check the reservation and road situation.** Timed-entry rules change year to year; verify at nps.gov/yose whether your dates and arrival time need a reservation. If your trip touches Glacier Point Road or Tioga Road, check the road status page too.\n\n' +
      '**5. Fuel and cash.** There is no gas in Yosemite Valley. Fill up in the gateway towns, and again at Crane Flat if you\'re heading up Tioga Road.\n\n' +
      '**6. Save the numbers.** 911 is the emergency number. If a call will not go out, try texting it: SMS needs less signal than voice, though whether it reaches dispatch depends on the center answering. General park information and recorded road conditions: 209/372-0200 (press 1, then 1 for roads). Roadside assistance: 209/372-1060. The Yosemite Medical Clinic in the valley (209/372-4637) takes urgent-care walk-ins on weekday early afternoons; it is not an emergency room.',
    checklist: [
      { id: 'gmaps-offline', label: 'Google or Apple Maps offline area covering the park and your approach highway' },
      { id: 'app-offline', label: 'This guide, photos, and the park map downloaded (Account → Offline)' },
      { id: 'yosemite-guide-pdf', label: 'Current Yosemite Guide PDF saved from nps.gov' },
      { id: 'reservation-check', label: 'Timed-entry reservation rules checked for your dates' },
      { id: 'road-status', label: 'Glacier Point and Tioga road status checked, if your plan needs them' },
      { id: 'fuel', label: 'Gas tank filled outside the park' },
      { id: 'batteries', label: 'Phone and battery pack charged' },
      { id: 'key-numbers', label: 'Key numbers saved: 911, park info 209/372-0200, roadside 209/372-1060, clinic 209/372-4637' },
    ],
  },
  {
    id: 'entrances-and-reservations',
    title: 'Entrances, fees, and the reservation question',
    order: 1,
    section: 'plan',
    teaser: 'Which gate to use, what entry costs in 2026, and no timed-entry reservation this year.',
    body:
      'Yosemite has five entrances.\n\n' +
      '**Arch Rock** (Highway 140 through El Portal) is the lowest entrance and the one that stays open when storms close everything else. **Big Oak Flat** (Highway 120 from the west, through Groveland) is the main entrance for Bay Area drivers. **South Entrance** (Highway 41 through Oakhurst) puts you at the Mariposa Grove first and Tunnel View on the way in. **Tioga Pass** (Highway 120 from the east, out of Lee Vining) reaches the high country and is open roughly June through October. **Hetch Hetchy** is its own corner of the park with its own hours.\n\n' +
      'The entrance fee is valid for seven days, and the park does not take cash.\n\n' +
      '- **Private vehicle:** $35, covers everyone in it.\n' +
      '- **Motorcycle:** $30.\n' +
      '- **On foot, bicycle, or bus:** $20 per person age 16 and older; under 16 free.\n' +
      '- **Non-U.S. residents** age 16 and older: an additional $100 per person, unless they hold an annual pass or an America the Beautiful pass.\n' +
      '- **America the Beautiful annual pass:** $80 for U.S. residents, $250 for non-residents; one pass covers the vehicle.\n' +
      '- **Yosemite-only annual pass:** $70, sold only to U.S. citizens and residents.\n\n' +
      'Fee-free days in 2026 are for U.S. residents only. The table is at **nps.gov/yose/planyourvisit/fees.htm**.\n\n' +
      'No timed-entry reservation is required to enter the park in 2026. The park has used one in recent peak seasons and sets the rule fresh each year, so confirm at **nps.gov/yose** before a trip in a later year. When a reservation system has been in effect, arriving very early or late in the afternoon has worked around it, and in-park lodging or camping reservations have generally exempted you. Verify both.',
  },
  {
    id: 'getting-around',
    title: 'Getting around: park once, ride the shuttle',
    order: 20,
    section: 'on-the-ground',
    teaser: 'The free shuttle runs 7 a.m. to 10 p.m., there is no gas in the valley. Park before 9 a.m. and leave the car there.',
    body:
      'The east end of Yosemite Valley runs on a **free shuttle** that loops the main stops: the visitor center area, the Lower Yosemite Fall stop, Curry Village, and the trailhead stop for the Mist Trail. It runs frequently through the day. Park once in a day-use lot, then treat the shuttle as your valley transit. The stops in this guide that sit on the loop say so.\n\n' +
      'The valley roads are mostly **one-way**: Southside Drive flows in, Northside Drive flows out. Miss a pullout and you drive the full loop to come back, twenty to thirty minutes in traffic season. The guide orders the valley stops with this in mind; read the next two stops before you pass either.\n\n' +
      'If you are staying outside the park, arrive by 8 a.m. The lots fill from mid-morning in season.\n\n' +
      '**Shuttle mechanics.** The shuttle runs 7 a.m. to 10 p.m. daily, free, no ticket. Two loops: the Valleywide loop (green) serves every stop, about an hour and a half round trip; the East Valley loop (purple) covers Yosemite Village, Curry Village, the Pines campgrounds, and the Happy Isles trailheads, about 50 minutes round trip, and comes more often. Check the current Yosemite Guide for intervals. Shuttle stop 9 at El Capitan Meadow is temporarily closed. Pets are not allowed on shuttles.\n\n**Mariposa Grove shuttle.** Free, from the Welcome Plaza, about every 15 minutes. In 2026: 8 a.m. to 7 p.m. through September 23, 8 a.m. to 5 p.m. from September 24 through October 31, and 8 a.m. to 3:30 p.m. in November if the road stays open.\n\n' +
      '**Transit from outside.** YARTS buses reach the valley without a car: the Highway 140 route from Merced runs year-round, and summer-only routes come over 120 from Sonora, 395 from Mammoth Lakes, and 41 from Fresno. Schedules at yarts.com. Amtrak sells train-and-bus tickets to the valley: the train reaches Merced and YARTS carries the connection, as it does for Greyhound passengers. YARTS fares do not include the park entrance fee. There is no luggage storage in the park and no public transit to Hetch Hetchy.\n\n' +
      '**Fuel, charging, breakdowns.** There is no gas in Yosemite Valley. The nearest pumps are El Portal (15 miles), Crane Flat (16.5 miles), and Wawona (28 miles), all 24-hour pay-at-pump. EV chargers exist at several valley locations (The Ahwahnee, Curry Village, the Welcome Center area, Yosemite Falls parking, Yosemite Valley Lodge) plus El Portal and the Wawona Store; check the current Yosemite Guide for counts and status. For a breakdown, 24-hour roadside assistance is 209/372-1060.\n\n' +
      '**Bikes, and live traffic.** The valley has miles of paved bike path, 15 mph limit, no bikes on hiking trails, helmets required under 18. Rentals at Yosemite Valley Lodge and Curry Village in season, and a free bike share (one- to two-hour rides) stages at Yosemite Village and the Camp 4 parking area; goyose.org/bikeshare. For live traffic and parking alerts, text ynptraffic to 333111. Recorded road conditions: 209/372-0200, then 1, 1.',
  },
  {
    id: 'bear-safety',
    title: 'Bears, and the food rules that are actually laws',
    order: 40,
    section: 'safety',
    teaser: 'Black bears, not grizzlies. They want your cooler, and the storage rules are enforced.',
    body:
      'Yosemite has black bears. There are no grizzlies in California and there have not been for about a century. A Yosemite black bear wants the granola bar in your daypack and the cooler in your back seat, not you.\n\n' +
      'The rules, which are park law and enforced with fines:\n\n' +
      '- **Never leave food in your car overnight.** Bears recognize coolers and grocery bags through windows and break into cars. Use the brown steel **food lockers** at trailheads, campgrounds, and lodging areas.\n' +
      '- **"Food" means anything scented.** Toothpaste, sunscreen, gum, empty wrappers, the baby seat with the crushed crackers in it.\n' +
      '- **By day, keep food within arm\'s reach.** A daypack on the ground while you wade in the river is a daypack a bear can take.\n' +
      '- **Never approach a bear, ever, for any photo.** If one approaches you, gather children, stand together, make noise, look large. Do not run and do not drop your food; that teaches the bear that approaching people works.\n' +
      '- **Keep your distance: at least 150 feet (50 yards) from bears, and 25 yards from other wildlife.** Fifty yards is the park\'s legal minimum for bears; for everything else, any approach that disturbs the animal breaks the rule, and 25 yards is the Park Service\'s general guidance. Approaching or feeding any wildlife, birds and squirrels included, is illegal, not just unwise. The rest of the law is in [The rules that carry fines](/essentials/park-rules).\n\n' +
      'Drive the posted speed limits, especially at dawn and dusk. Drivers hit dozens of bears in this park in a typical year. If you see a bear, or see people crowding one, report it: the Save-a-Bear line is 209/372-0322.\n\n' +
      'The meadows with the best odds of a sighting are in [Where to actually see a bear](/essentials/bear-viewing).',
  },
  {
    id: 'cell-coverage-offline',
    title: 'Cell coverage, and how this app behaves without it',
    order: 21,
    section: 'on-the-ground',
    teaser: 'Where service dies, why GPS still works, and the two downloads to do the night before.',
    body:
      'Plan on having no usable signal for most of your trip. There is some coverage around Yosemite Village and parts of the valley floor, and effectively none on the trails, along Glacier Point Road short of the point itself, and along most of Tioga Road. The gateway towns have normal service. In between, assume none.\n\n' +
      '**By carrier, as the park last published it (April 2024).** AT&T, T-Mobile, and Verizon all reach Yosemite Valley, mostly its eastern end. AT&T also lists Glacier Point. Verizon lists Wawona, Crane Flat, and Foresta, with limited and unreliable coverage in El Portal. Tuolumne Meadows has no AT&T service and unreliable Verizon; the nearest dependable cell and landline service is in Lee Vining, outside the park. These are places a bar is possible, not promised. For Wi-Fi: the in-park lodges give it to registered guests, the county library branches in the Valley and Wawona have public computers and Wi-Fi, and Degnan\'s Kitchen and the El Portal Market offer it free.\n\n' +
      'Two facts make this workable:\n\n' +
      '1. **GPS does not need cell service.** Your phone\'s blue dot works in airplane mode. Loading the map under the dot needs the network; downloading solves that.\n' +
      '2. **This app is built to be downloaded.** Open **Account → Offline** and download the guide and the park map before you leave wifi. Every stop, photo, and the topo map then works in airplane mode. Airplane mode also stops the battery draining on tower searches, the most common way phones die in the park.\n\n' +
      'For turn-by-turn driving directions, also download an offline area of the park in Google Maps or Apple Maps the night before. The GPS chips in this guide open those apps, and the downloaded area makes them work at the trailhead.\n\n' +
      'Tell someone outside the park what trail you are doing and when you expect to be out. Rescue teams ask for this.',
  },
  {
    id: 'seasons-and-roads',
    title: 'What the seasons do to the roads and the falls',
    order: 2,
    section: 'plan',
    teaser: 'Tioga and Glacier Point close for half the year. The waterfalls keep a schedule too.',
    body:
      '**The two big seasonal roads.** Tioga Road (the high country, all of the Tuolumne region in this guide) and Glacier Point Road close with the first real snow, typically in November, and reopen after plowing, typically late May into June for Tioga. Outside roughly June through October, plan without the Tuolumne region and check Glacier Point Road status before counting on that view. Current road status is on **nps.gov/yose** and at the park\'s recorded road line.\n\n' +
      '**Winter driving.** Chains can be required on park roads any time from roughly November through March, even for rental cars, even with all-wheel drive, depending on the restriction level posted. Carry them or buy them in a gateway town at gateway-town prices. The valley stays open all winter and is at its quietest.\n\n' +
      '**The waterfall schedule.** The falls run on snowmelt. They build through spring, peak roughly May into June, and then fade. Yosemite Falls is often dry by late August. Bridalveil runs year-round. For waterfalls, come in late spring; in autumn, expect little water.\n\n' +
      '**Summer heat.** The valley floor sits around 4,000 feet and runs hot in July and August, mid-90s on the worst days. The rim and the high country run ten to twenty degrees cooler.',
  },
  {
    id: 'packing-checklist',
    title: 'The packing checklist',
    order: 60,
    section: 'packing',
    teaser: 'Check items off in the app the night before. Seasonal items are marked.',
    body:
      'This short list assumes day trips from a bed, not backpacking. Check things off below; the app remembers between visits. When the short list is not enough, the Day pack topic carries the full trail manifest and Pack the car carries the complete car-camping load.\n\n' +
      'Two notes:\n\n' +
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
    teaser: 'See the famous places, at the right hour and in the right season. Timing matters more than the list.',
    body:
      'The standard first-trip list is Tunnel View, Cook\'s Meadow, Glacier Point, the Mariposa Grove, and Tuolumne Meadows. See them, but not at their busiest: Tunnel View at 1 p.m. in July means a full lot and an overlook three-deep.\n\n' +
      'Three habits help. **Research the season**: Tioga Road does not open until late May or June and sometimes later, the waterfalls peak in spring and are mostly dry by August, and smoke can erase vistas for weeks. **Know what you want**: of granite, waterfalls, old-growth, high country, and solitude, pick the two that matter most, because the order you visit them in matters. **Be willing to flex**: swap a stop rather than wait on a full lot.\n\n' +
      'Do less, earlier. One day started at sunrise with three or four stops beats several days of arriving at noon. On a single valley day, skip Glacier Point Road (two to three hours of round-trip driving), the Mariposa Grove (an hour-plus each way, plus a shuttle), and Tioga Road (half a day each way). Each is the centerpiece of a second day.\n\n' +
      'Booking order: check the current year\'s entry rules at nps.gov/yose first, pick your season, pick your gateway town (the Gateway towns topic) before you book a bed, and only then build the itinerary. The trip planner on the Plan tab has 1, 2, and 3 day presets built on this logic; start from one and adjust.',
  },
  {
    id: 'crowds-and-timing',
    title: 'Crowds: the calendar, the clock, and the escape',
    order: 4,
    section: 'plan',
    teaser: 'The daily crowd curve has held the same shape for fifty years. The hour you reach the gate matters more than the month you pick.',
    body:
      'Whether the park meters entry with a reservation system changes year to year. It does not in 2026. Check nps.gov/yose before you book a later year. The shape of demand does not change; plan around it.\n\n' +
      '**The calendar.** June through August is the crush, and weekend days run roughly 45 percent busier than weekdays all year. Holiday weekends spike above their months: Memorial Day, July 4, Labor Day, Thanksgiving week, the December holiday week, and the firefall window in mid-to-late February. September splits in half: Labor Day weekend behaves like July, and the Tuesday after it has summer weather, the high country open, and crowds down by a third. Midweek in October is quiet, and midweek in early November trades short days for a nearly empty valley.\n\n' +
      '**The clock.** The valley crowd builds from about 8 a.m., peaks between 11 a.m. and 3 p.m., and tails off after 5. By 8 p.m. the valley is functionally empty. The busiest entry window at the gates runs roughly 9 a.m. to 2 p.m., and on peak weekends the afternoon entrance delays are measured in hours. Get through the gate before 8 a.m., before 7 on a summer weekend, or arrive after 4 p.m. for the evening light. Once parked, stay parked and ride the shuttle. Spend midday on something low-effort (a museum, a river walk, a long lunch) and go out again when the lots empty.\n\n' +
      '**The escape.** Crowds concentrate at parking lots and thin quickly away from them. Wawona, Hetch Hetchy, and the Tioga Road stops beyond the famous turnouts run at a fraction of valley traffic. And keep a swap ready for every marquee stop: Valley View when Tunnel View is full, Sentinel Dome or Taft Point when Glacier Point is a wait. For live parking and traffic updates, text ynptraffic to 333111 before you commit to the drive.',
  },
  {
    id: 'budget',
    title: 'What a trip actually costs',
    order: 5,
    section: 'plan',
    teaser: 'The park itself is cheap: one vehicle fee, free shuttles, free trails. The bed is the variable that decides everything else.',
    body:
      'A private vehicle pays $35 for seven days, and that pass covers everyone in the car. It does not cover the 2026 non-resident fee: each non-U.S. resident age 16 or older in the car pays another $100, unless the car is admitted on an annual pass or an America the Beautiful pass. That pass is $80 for a U.S. resident and $250 for a non-resident, and one of them covers the vehicle for a year at every federal fee site. A Yosemite-only annual pass is $70, for U.S. citizens and residents. Motorcycles are $30. People 16 and older who enter on foot, a bicycle, or a bus pay $20 each. The park does not take cash. Current fees are at nps.gov/yose/planyourvisit/fees.htm.\n\n' +
      '**Lodging is the biggest variable.** Most campgrounds are $36 a night. The primitive ones, Tamarack Flat, Yosemite Creek, and Porcupine Flat, are $24. Camp 4 is $10 per person a night while reservations are required, April 15 through November 29 in 2026, and $10 a night when it is first-come, first-served. The release windows are in [Camping](/essentials/camping).\n\nTent cabins at Curry Village are on the order of $170 to $200; Yosemite Valley Lodge rooms roughly $300 to $500 depending on season; the Ahwahnee starts around $600 and climbs. Gateway-town motels and hotels run roughly $120 to $300 a night, and a vacation rental split among a group can undercut all of it per person. Current in-park lodging rates are at travelyosemite.com. Everything books months out for summer.\n\n' +
      '**Food is the easiest saving.** A cooler stocked at a gateway grocery store runs roughly $15 to $25 per person per day; a deli sandwich and a drink inside the park is on the order of $20 per person, and the Village Store charges well above supermarket prices. Cook or pack most meals, eat at most one park meal a day, and treat the Ahwahnee dining room as a once-per-trip splurge.\n\n' +
      '**Gas and gear.** There is no gas in Yosemite Valley, and the in-park pumps at Crane Flat and Wawona run roughly fifty cents to a dollar more per gallon than the gateway towns, so fill up before you enter. Parking is free everywhere in the park. The one gear purchase that matters is sturdy, broken-in shoes with real tread. You do not need trekking poles, a GPS unit, or bear spray, which is prohibited here anyway; these are black bears.\n\n' +
      'The cheap version is a campsite, a cooler, and one restaurant meal, on the order of a few hundred dollars total for two people over several days. The splurge is the Ahwahnee, prix fixe dinners, and a guided full-day program, on the order of several thousand.',
  },
  {
    id: 'gateway-towns',
    title: 'The gateway towns, compared',
    order: 6,
    section: 'plan',
    teaser: 'Five towns on four highways, an hour or more apart in drive time. Pick the one on the highway toward what you came to see.',
    body:
      'Each of the five main gateway towns sits on a different highway into a different entrance, and the wrong one costs an hour of driving a day. Pick by where the trip points: valley trips base west, sequoia trips base south, high-country trips base east.\n\n' +
      '**El Portal** (Highway 140) is the closest, about 25 to 30 minutes to the valley along the Merced River canyon. It is a small settlement: a few lodges, a gas station, a market, not much else, and the location prices it like in-park lodging. Pick it if being inside the park at sunrise every day is the priority, or for winter, when low-elevation 140 is the most reliable road in.\n\n' +
      '**Mariposa** (Highway 140) is 45 minutes to an hour out and the easiest first-trip choice: a gold-rush town with restaurants, grocery stores, and lodging from budget motel to country inn. The trade is at least 90 minutes of round-trip driving a day and earlier alarms for sunrise.\n\n' +
      '**Oakhurst** (Highway 41) has the longest valley drive, 75 to 90 minutes over a winding climb, but sits about 20 minutes from Wawona and the Mariposa Grove. It is the largest gateway by amenities, with predictable chain hotels and chain prices. Pick it for a sequoia-centered trip, or if you are coming from Los Angeles or Fresno.\n\n' +
      '**Groveland** (Highway 120, chain controls common in winter) is 60 to 75 minutes out: a historic main street, one of California\'s oldest saloons, and generally easier last-minute rooms than Mariposa. Closest to Hetch Hetchy and the northern park, and on the natural route from the Bay Area.\n\n' +
      '**Lee Vining** (Highway 120 east, over Tioga Pass, seasonal only): 30 minutes to Tuolumne Meadows, 90-plus to the valley, Mono Lake at the doorstep, and no practical park access at all when Tioga is closed. Pick it for a high-country trip or an eastern Sierra itinerary. Wherever you land, book early: summer gateway lodging fills six to twelve months out.',
  },
  {
    id: 'half-dome-permits',
    title: 'Half Dome: the permit lottery and the honest math',
    order: 7,
    section: 'plan',
    teaser: 'Two lotteries, roughly one-in-five odds, and a 14 to 16 mile day.',
    body:
      'The Half Dome day hike is 14 to 16 miles round trip from Happy Isles with about 4,800 feet of gain. Most hikers take 10 to 12 hours; you leave before sunrise. The finale is the cables: two steel lines running 400 vertical feet up the back of the dome at roughly 45 degrees, with wooden crossboards to brace your feet. In July and August the line on them is continuous. Wet rock is dangerous: nearly all fatal falls from the cable route have happened on wet rock. Rangers assist hundreds of hikers on this trail every summer, and most of those emergencies trace back to poor preparation.\n\n' +
      'A permit is required past the base of the subdome whenever the cables are up, typically the Friday before Memorial Day through the day after Columbus Day, with a hard cap of 300 people per day (about 225 day hikers). Rangers check permits and photo ID at the subdome. There are two ways in, both lotteries on recreation.gov, both with a $10 non-refundable application fee and $10 per person if you win.\n\n' +
      'The **preseason lottery** has, in recent years, taken applications through March with results emailed in mid-April. Up to six people and up to seven date choices per application. Recent seasons have run around a one-in-five success rate. Saturdays draw the most applications; weekdays late in the season are the soft spot.\n\n' +
      'The **daily lottery** releases extra permits two days before each hike date: apply by 4 p.m. Pacific, results that evening. Recent weekday odds have run around 22 percent, weekends closer to 14. If you strike out preseason, plan the hike for the middle of your trip and apply every eligible day you are in the park.\n\n' +
      'The programs list in this guide carries the typical lottery windows as calendar events you can add to your trip plan, so the March application month and the two-day-ahead rhythm do not sneak past you. Confirm current dates and rules on recreation.gov before you count on any of them.\n\n' +
      'Judge your fitness honestly, carry four liters of water and gloves for the cables, set a non-negotiable turnaround time, and do not touch the cables if rain is possible. If the permit never comes, Clouds Rest off Tioga Road needs no permit, and stands a thousand feet higher.',
  },
  {
    id: 'hetch-hetchy',
    title: 'Hetch Hetchy: the other Yosemite Valley',
    order: 8,
    section: 'plan',
    teaser: 'A second glacial valley, half of it under a reservoir, with its own entrance, gate hours, and almost no visitors.',
    body:
      'Yosemite has a second granite valley. Hetch Hetchy sits in the park\'s northwestern corner: same elevation as the famous one, roughly the same length, carved by the same kind of glacier. In 1913 Congress let San Francisco dam it, over John Muir\'s objection, and since the O\'Shaughnessy Dam was completed in 1923 the lower valley has been a reservoir supplying drinking water to roughly 2.7 million people in the Bay Area. The walls, the domes, and the waterfalls above the waterline are still there. On a July Saturday you can hike here all day and see fewer than a hundred people.\n\n' +
      'It is its own corner of the park with its own rules. You reach it via Highway 120 and the Big Oak Flat Entrance, then a separate winding road, about 16 miles to the dam. From Yosemite Valley the drive is roughly an hour and forty-five minutes each way, which is why this works as a full day and not a half-day add-on. The access road is open roughly sunrise to sunset, with exact hours posted at the entrance and on the NPS Hetch Hetchy page, and it carries a 25-foot vehicle length limit. Arrive after the gate closes and you will be turned away.\n\n' +
      'The standard day: walk the quarter mile across the dam, through a hand-cut tunnel, then take the trail to the base of **Wapama Falls**, which drops over 1,000 feet down the north wall. About 5 miles round trip, roughly 700 feet of rolling gain, four to five hours with lunch at the falls. In spring, wispy Tueeulala Falls runs beside it. In high water the bridge below Wapama gets soaked and is sometimes closed, so check conditions first.\n\n' +
      'The area is open year-round, though snow can close the access road in winter; spring through early summer is prime, and October brings gold black oaks and empty trails. There is no food, no lodging, and no swimming or boating: this is a domestic water supply. Pack everything in.',
  },
  {
    id: 'eating-in-the-park',
    title: 'Eating in the park: the realistic tiers',
    order: 22,
    section: 'on-the-ground',
    teaser: 'A cooler covers most meals. Then the counters, the Curry Village pizza deck, and the Ahwahnee by reservation.',
    body:
      'Plan meals in four tiers, from what you brought to what you book.\n\n' +
      '**Tier one is your cooler.** Buy groceries in a gateway town, pack a cooler, and eat lunch on a granite slab next to the river. The Cascade Picnic Area has shade, tables, and its own stretch of the Merced; El Capitan Meadow has no tables and a view of El Capitan. It costs less than any counter in the park. The catch is the bear rules, which are law: food and anything scented goes in a steel food locker or your trunk, never loose in the car overnight, and a daypack with snacks stays within arm\'s reach. See the bear topic in this guide.\n\n' +
      '**Tier two is the counter.** Degnan\'s Kitchen in Yosemite Village sells sandwiches for under twenty dollars, and coffee and breakfast sandwiches from 7 a.m. The Village Store charges well above supermarket prices; do not plan to provision there.\n\n' +
      '**Tier three is the pizza deck.** The Curry Village pizza stop serves pizza and beer on a wooden deck under the Glacier Point Apron. Expect a line at dinner.\n\n' +
      '**Tier four is the Ahwahnee dining room,** covered at the Ahwahnee stop in this guide. It has moved to a prix fixe dinner format at special-occasion prices, reservations required, so it is a planned event rather than a spontaneous stop. Book ahead.\n\n' +
      'Outside the park, Mariposa and Oakhurst each have a brewery-restaurant.\n\n' +
      'When you need the specifics, every counter, dining room, bar, and grocery in the park, plus the gateway-town tables, is listed venue by venue with published hours in [Where to eat](/dining).',
  },
  {
    id: 'with-kids',
    title: 'Yosemite with kids: pace, water, and the badge',
    order: 23,
    section: 'on-the-ground',
    teaser: 'The Junior Ranger booklet, four walks that suit kids, river beaches, and a plan of three things, not eight.',
    body:
      'Arrive before 9 a.m., park once, let the kids set the pace, and make the visitor center your first stop.\n\n' +
      'At the desk, ask for a free **Junior Ranger booklet**: activities keyed to spots around the park, things to find, questions to answer. Kids who finish enough of it take the oath with a ranger and get a badge. Check the ranger program schedule there too; some free programs are built for kids and fit a late-afternoon gap. The programs list in this guide filters Junior Ranger and kids events for your trip dates. In summer there are daily Junior Ranger walks in the valley and a Junior Ranger talk at the Mariposa Grove, and the Happy Isles Art and Nature Center runs a free drop-in kids art studio most days.\n\n' +
      'The walks that actually work: **Lower Yosemite Fall** (1 mile, paved, stroller-friendly, misty in spring), **Cook\'s Meadow** (1 mile, paved, flat), **Mirror Lake** (2 miles on packed dirt, fine with a real-wheeled stroller, boulders and creek at the end), and **Bridalveil Fall** (half a mile, paved but steep in spots, carry the small ones). Skip the Mist Trail unless your kids are 12 and up and fit: it has 600 granite steps and cliff exposure.\n\n' +
      'Budget unstructured time at the water. By late July the Merced slows and Housekeeping Camp has the main family river beach, with the Cascade Picnic Area as the quieter option. Before mid-July the snowmelt current is dangerous: nothing above the knees, and never near water above a waterfall.\n\n' +
      'Short legs cover about half the distance you expect. Plan three things, not eight viewpoints. Know which stop you will cut, and keep the car or shuttle within reach.',
  },
  {
    id: 'non-hikers',
    title: 'The park without hiking',
    order: 24,
    section: 'on-the-ground',
    teaser: 'The valley loop, the pullouts, and the short paved paths reach most of the famous views without a trail.',
    body:
      'You do not have to hike to see Yosemite. The valley sits in a granite trough about a mile wide and seven miles long, and the roads pass within view of, or directly under, almost every famous feature in the park: Tunnel View, El Capitan, Bridalveil Fall, Yosemite Falls, Half Dome. Several can be photographed from the parking lot.\n\n' +
      'The core of it is the **valley loop by car**, three to four hours including stops. Tunnel View is a parking-lot overlook, no walking required. Valley View is a riverside pullout with a flat path of about thirty yards and benches. El Capitan Meadow is a roadside pullout where you stand at the meadow edge and look up; with binoculars you can sometimes pick out climbers on the wall. Cook\'s Meadow puts the reflected Yosemite Falls view within a hundred feet of the car. Sentinel Bridge is fifty feet of paved walking to the view of Half Dome over the Merced.\n\n' +
      'With a little walking:\n\n' +
      '- **Bridalveil Fall**: a paved quarter mile with a small grade to the lower viewing area.\n' +
      '- **Lower Yosemite Fall**: a one-mile paved loop to the base of the falls, one slight rise.\n' +
      '- **Cook\'s Meadow boardwalk**: a flat one-mile loop with benches at intervals.\n\n' +
      'Two longer drives: Glacier Point ends at a lot a few hundred yards from the overlook, on a paved path with a moderate descent, at 7,200 feet with Half Dome at eye level. On Tioga Road, Olmsted Point, the Tenaya Lake beach, and the Tuolumne Meadows pullouts are all reachable from the road shoulder or short paved paths. Both roads are seasonal; the Seasons topic covers the windows.\n\n' +
      'For weather days or slower pacing: the Yosemite Museum and the Ansel Adams Gallery are free to enter, and the Ahwahnee\'s Great Lounge is open to the public. For mixed-ability groups, plan low-energy mornings, one or two short walks separated by a long break, and one shared big-view moment, Glacier Point if the road is open, Tunnel View at sunset if it is not. Hikers in the group can be dropped at a trailhead early and picked up at noon.',
  },
  {
    id: 'stargazing',
    title: 'Stargazing: where and when to look up',
    order: 25,
    section: 'on-the-ground',
    teaser: 'The valley floor is a mediocre observatory. The rim and the high country are far darker. Plan around the moon.',
    body:
      'The valley is a poor place to stargaze. On the Bortle dark-sky scale, where 1 is the darkest natural sky and 9 is an inner city, most of the valley floor reads 3 or 4: lodging and parking lights plus glow from outside the park. The high country, Glacier Point, Tioga Road, Tuolumne Meadows, reads 2 and occasionally 1. At Bortle 4 you see roughly 2,000 stars and a faint Milky Way; at Bortle 2 you see closer to 6,000 and the Milky Way casts shadows.\n\n' +
      'The other variable is the **moon**. A full moon at a dark site is brighter than a new moon over the suburbs, and it washes out the Milky Way entirely. Plan around it: new-moon nights, or hours when the moon has set or not yet risen. The programs list in this guide carries the full-moon dates and the summer star-party season as calendar events, so you can lay your trip dates against them and add them to a trip plan.\n\n' +
      'Timing: the Milky Way\'s galactic core, the bright section everyone means, is visible roughly April through October and peaks June through August. For the densest view, aim for mid-July through mid-August in a new-moon week, when the core arches nearly overhead between about 11 p.m. and 3 a.m. In winter the core is below the horizon; you get Orion and the fainter northern arm instead.\n\n' +
      'The two drive-to spots: **Glacier Point**, at 7,200 feet with open horizons and a paved walk of a few hundred feet from the lot, hosts free public **star parties** on scheduled summer nights, astronomy clubs with telescopes, plus a ticketed concessioner-run sky program some weeks. The dates are published per season; the programs list in this guide carries them for your trip window. **Olmsted Point**, at 8,300 feet on Tioga Road, has flat granite slabs to lie on and very little nearby light. Tenaya Lake and the Tuolumne Meadows pullouts work too.\n\n' +
      'Two practical notes. Use a red headlamp setting after dark; white light ruins night vision, yours and everyone\'s nearby, for 20 to 30 minutes. And layer for cold: at these elevations on a clear summer night the temperature can be in the 40s by midnight, and sitting still chills you faster than hiking.',
  },
  {
    id: 'bear-viewing',
    title: 'Where to actually see a bear',
    order: 26,
    section: 'on-the-ground',
    teaser: 'Cook\'s Meadow right at sunset, the Crane Flat meadow, and how to watch a black bear without changing its evening.',
    body:
      'Yosemite holds a few hundred black bears, and most visitors never see one. They work the meadow edges at dawn and in the last hour of light: grass in spring, grubs out of downed logs in summer, acorns under the black oaks in fall. Go where the food is, at those hours.\n\n' +
      'The short list, in rough order of odds:\n\n' +
      '- **[Crane Flat](/stop/crane-flat-meadow)** is one of the most consistent bear areas in the park. The big meadow at the Tioga Road junction is ringed by forest, and bears come onto the open grass through spring and summer. Scan the far tree line from the meadow edge; binoculars turn a dark dot into the sighting.\n' +
      '- **[Cook\'s Meadow](/stop/cooks-meadow-loop) right at sunset** is the valley\'s best odds. Walk the boardwalk loop in the last light and watch the meadow edge and the black oaks, especially in fall when the acorns drop.\n' +
      '- **[El Capitan Meadow](/stop/el-capitan-meadow)** and the valley\'s western meadows work the same sunset window, with fewer people standing next to you.\n' +
      '- **The Tioga Road meadows**, Tuolumne Meadows included, produce steady sightings all summer; the road-shoulder pullouts are the viewing platform. [Wawona\'s meadow](/stop/wawona-meadow-loop) does the same for the south end of the park on summer evenings.\n\n' +
      'How to watch one. Stay at least 150 feet away, which is about half a football field; if the bear changes what it is doing because of you, you are too close, whatever the distance. Watch from the boardwalk, the road shoulder, or beside your car, never from inside the meadow. Never approach, never feed, never walk closer for a photo, and keep children beside you. And drive the posted limits at dawn and dusk: cars kill more of these bears than anything else. If you see people crowding a bear, report it to the Save-a-Bear line, 209/372-0322.\n\n' +
      'The food-storage rules that keep these bears wild are in [Bears, and the food rules](/essentials/bear-safety).',
  },
  {
    id: 'heat-safety',
    title: 'Heat: the valley floor in July and August',
    order: 41,
    section: 'safety',
    teaser: 'The valley is a granite box that hits 90 regularly in midsummer. The counters are an early start, more water than feels reasonable, and elevation.',
    body:
      'Yosemite Valley sits at about 4,000 feet, and it is hot in summer: a granite trough a mile wide with walls 3,000 to 4,000 feet high, no sea breeze, no relief until the sun drops behind the south rim. In July and August, highs reach 90 regularly and occasionally crack 100, and those are shade readings: granite in direct sun can hit 140 to 160 degrees and radiates heat at you from every direction on an exposed trail.\n\n' +
      '**Start before 7 a.m. and be off exposed sections by 10 or 11**. The trails that punish a late start most are the Four Mile Trail (south-facing, shadeless, the one the park service calls very dangerous and exposed), the Upper Yosemite Falls switchbacks above Columbia Rock, and the Mist Trail above the Vernal Fall footbridge, where the spray ends and 600 stone steps in direct sun begin.\n\n' +
      'The water math: the official guidance is one quart per hour of hiking in the heat; a full day on an exposed trail in July means 4 to 6 liters per person. Pair it with electrolytes, salty snacks or tablets, because drinking large amounts of plain water can dilute your blood sodium and produce symptoms that mimic heat exhaustion. By some estimates roughly a quarter of the park\'s nontraumatic search-and-rescue missions are dehydration or heat related.\n\n' +
      'Know the line between the two heat illnesses. **Heat exhaustion**: heavy sweating, nausea, dizziness, pale clammy skin. Shade, rest, water with electrolytes, recovery. **Heat stroke**: sweating stops, skin goes red and dry, confusion sets in. That is a 911 call. Cool the person aggressively, wet clothing, shade, fanning, and get help.\n\n' +
      'The valley itself offers two refuges: the shaded river corridor, which runs 10 to 15 degrees cooler than the open meadows, and the Merced itself, swimmable roughly mid-July through mid-September at Sentinel and Cathedral beaches. Do not swim in May or June, when snowmelt makes the river fast and dangerously cold, and never swim above a waterfall.\n\n' +
      'Or **go high**. Temperature drops about 3.5 degrees per thousand feet, so Tuolumne Meadows at 8,600 feet runs 18 to 20 degrees cooler than the valley: when the valley is 90, Tuolumne is 72. Glacier Point and Tenaya Lake sit in between.',
  },
  {
    id: 'smoke-season',
    title: 'Smoke season: reading the air, flexing the plan',
    order: 42,
    section: 'safety',
    teaser: 'Wildfire smoke overlaps the California summer most years. How to read the air quality index and what a smoke day does to the plan.',
    body:
      'Smoke season in California now runs roughly July through October most years, sometimes into June in dry years, and Yosemite sits in one of the most fire-prone regions in the West. Have a plan for a smoke day.\n\n' +
      'The valley is a deep granite trough: smoke pushed in on the prevailing summer winds pours in and settles, and cold air drainage at night pulls more down from the ridges, so the valley is often the worst air in the park. The high country above about 7,500 feet, Glacier Point and Tuolumne, is sometimes above the inversion layer holding the smoke down. On a day the valley reads Unhealthy, Tuolumne can read Moderate or even Good. Not always, but often enough that a high-elevation backup plan is the most useful smoke strategy.\n\n' +
      'The tool is the Air Quality Index. Check **airnow.gov** (and its fire and smoke map) plus the park\'s current conditions page on nps.gov the night before you drive in and again the morning of any big hike; readings can change in two hours. The working thresholds:\n\n' +
      '- **Under 100:** a normal trip with hazier vistas.\n' +
      '- **101 to 150:** short, low-effort activities like the meadow loops, Bridalveil, and the viewpoints, not a big ascent. Be more conservative with children, older adults, and anyone with a respiratory condition.\n' +
      '- **151 to 200:** drive to the high country or go indoors: the museum, the gallery, a long lunch.\n' +
      '- **Above 200:** consider rescheduling.\n\n' +
      'Tactics: mornings are usually cleaner than afternoons, since smoke often peaks late in the day as wind picks up. Wind direction matters more than fire distance: a fire 80 miles upwind is worse than one 20 miles downwind. Cancel the long exposed hikes first and keep the short walks. Pack a few N95 masks; they are not a shield but they cut the dose, and if anyone in the group uses a rescue inhaler, carry it.\n\n' +
      'Not all smoke means a wildfire emergency. The park also sets prescribed burns deliberately as forest management, and it announces them on the current conditions page. Either way, judge the day by the AQI reading, not by the smell.',
  },
  {
    id: 'quiet-trails',
    title: 'The quiet trails, and the ones we left out',
    order: 43,
    section: 'safety',
    teaser: 'What the Secret Guide trails are, what they are not, and why the closed routes in the park\'s history get named here but never mapped.',
    body:
      'The hidden trails in the Secret Guide are maintained, signed park trails. Every one of them appears on the official park map; what makes them hidden is traffic, not legality or condition. Less traffic also means less help: on the trail to Stanford Point or Rancheria Falls, the next hiker may be hours behind you. Carry more margin: the full day-pack list, more water than the mileage suggests, and someone at home who knows your trail and your turnaround time.\n\n' +
      'Creek fords change with the season. A crossing that is a rock-hop in August can be a fast, thigh-deep problem in June, and snowmelt water is cold enough to take your footing and your judgment at the same time. The rule: if moving water is over your knees, turn around.\n\n' +
      'Some stops carry a short Caution note. It names the specific thing that hurts people at that specific place, a slick lip above a cascade, an unrailed rim, a ford.\n\n' +
      'Finally, the routes left out. This guide names some closed routes, the Ledge Trail to Glacier Point, the Sierra Point overlook, Fern Ledge behind the upper fall, the descent of Tenaya Canyon, because you will hear about them. It gives directions to none of them. The park closed or abandoned those routes for cause, the cause being rockfall, exposure, and a fatality list that is still growing. Walk the maintained trail beside them.',
  },
  {
    id: 'safety-and-help',
    title: 'Safety and help: signal, the clinic, and the plan for before you lose both',
    order: 44,
    section: 'safety',
    teaser: 'Where the signal actually is, what 911 can and cannot reach, and the clinic that is not a hospital.',
    body:
      'Plan on having no cell signal for most of this trip. There is some coverage around Yosemite Village and parts of the valley floor, and travelers report occasional bars in Wawona and near the Tuolumne Meadows store, but none of it is reliable enough to build a plan around. Tioga Road, Hetch Hetchy Road, the Big Oak Flat and Highway 140 canyon stretches, and nearly every trail run long dead zones, often for the whole drive or the whole hike.\n\n' +
      'The emergency number is 911. A landline reaches dispatch where a cell carrier cannot: use a lodge room phone or a phone at a visitor center or ranger station. On a cell phone in the canyons a call can drop or never connect; do not assume a dialed call went through. If the call will not go, try texting 911, because SMS needs less signal than voice, though whether a text reaches dispatch depends on the center answering it. If neither goes out and the situation allows it, get to the nearest visitor center or ranger station in person, or send someone.\n\n' +
      'The Yosemite Medical Clinic, in Yosemite Village (209/372-4637), handles urgent care: sprains, cuts, altitude symptoms. It takes walk-ins on weekday early afternoons. It is a clinic, not a hospital, and it does not run its own emergency department. A serious injury or illness gets stabilized and sent out of the park to a hospital in one of the surrounding towns. Factor that drive into how far from the road you go.\n\n' +
      'Tell someone outside the park, or at least back at the room, which trail you are doing and when you expect to be down; search and rescue uses that. Download or screenshot the map or directions you need before you leave signal. And carry water and a headlamp on any afternoon hike, even a short one, in case the day runs long.\n\n' +
      'When it does go wrong, open [the Help card](/help): it reads your GPS position in the two forms a dispatcher and a rescue team use, names the nearest place in the guide to say out loud, and puts every number on this page one tap away. GPS needs no signal, so the position works in airplane mode; only the call itself needs a tower.',
    checklist: [
      { id: 'safety-signal-assumption', label: 'Assumed no cell signal past Yosemite Village and the valley floor' },
      { id: 'safety-plan-shared', label: 'Told someone your plan: trail, start time, expected return' },
      { id: 'safety-maps-saved', label: 'Maps and directions downloaded or screenshotted before losing signal' },
      { id: 'safety-water-headlamp', label: 'Water and a headlamp packed, even for a short afternoon hike' },
      { id: 'safety-landline-known', label: 'Know that a landline reaches 911 where a cell phone will not' },
    ],
  },

  // ── Know-before-you-go gaps (September 2026 content pass) ──────────────────
  // Sourced from nps.gov/yose, the Superintendent's Compendium (May 2026) and
  // the park's 2022 Accessibility Guide, read 2026-09-24. Year-specific facts
  // point at the page that carries them rather than freeze a date.

  {
    id: 'water-safety',
    title: 'Rivers and waterfalls: when to swim, where not to, and the rafting rule',
    order: 45,
    section: 'safety',
    teaser: 'Water accidents are the second most common cause of death in the park. When the Merced is safe, where swimming is banned, and the gauge the rafting rules read.',
    body:
      'Water-related accidents are the second most common cause of death in Yosemite, and 15 to 20 visitor rescues a year begin with someone in the water, on purpose or after one misstep on a rock beside it. The danger is cold and current, not swimming skill.\n\n' +
      '**Cold first.** The rivers are snowmelt. The park warns that strong swimmers can quickly become too weak from hypothermia to swim, and the air temperature says nothing about the water. **Current second.** A "slow" current in the mountains is usually faster than you can swim to shore, and submerged branches, old cables, and gaps between boulders can pin a person underwater. The pressure of even a gentle current is enough to hold you there.\n\n' +
      '**The season.** River swimming is a late-summer thing. In May and June the Merced runs fast and dangerously cold, and the park says to swim only in low water and to stay out of whitewater. The Valley beach season is roughly mid-July into September, as the [Heat](/essentials/heat-safety) topic has it; the changeover follows the snowpack, so judge by the water. Enter and leave the Merced only at sandy beaches, which protects the banks.\n\n' +
      '**Where people swim.** The Valley beaches, [Sentinel Beach](/stop/sentinel-beach-parking) and [Cathedral Beach](/stop/cathedral-beach-quiet-picnic) among them; the pools under the [Swinging Bridge](/stop/swinging-bridge-reflection) once the melt is past; the South Fork on the [Wawona Swinging Bridge](/hike/wawona-swinging-bridge) walk; and [Tenaya Lake](/stop/tenaya-lake), which stays cold all summer. The outdoor pools at Curry Village and Yosemite Valley Lodge are the warm-water option in summer; confirm they are open for your dates.\n\n' +
      '**Where swimming is illegal.** These are closures: Emerald Pool and the Silver Apron down to the brink of Vernal Fall; Hetch Hetchy Reservoir and the first mile of any stream flowing into it, [Rancheria Falls](/stop/rancheria-falls) included; Lake Eleanor when posted; the Dana Fork of the Tuolumne above the water intake; the Wawona water intake pool and 100 yards above it; and May Lake near the High Sierra Camp\'s water intake. If a sign says no swimming, the park means no wading either.\n\n' +
      '**Never above a brink.** Anywhere in the park, do not swim or wade upstream of a waterfall, however shallow and calm it looks. Visitors are swept over falls to their deaths this way, the park says, every year. On the [Mist Trail](/stop/mist-trail) that means the water above Vernal and Nevada Falls. At [Chilnualna Falls](/stop/chilnualna-falls) and [Rainbow Pool](/stop/rainbow-pool), read the stop\'s caution before you go near the water.\n\n' +
      '**If you go in.** Take the defensive position the park teaches: on your back, feet pointing downstream and at the surface, where you can see your toes.\n\n' +
      '**Rafting the Valley.** Put in at Stoneman Bridge near Curry Village and take out at Sentinel Beach, and nowhere between. That stretch is open to boats on days when the river gauge at Pohono Bridge reads below 7 feet at 8 a.m. Above 4 feet at 8 a.m., everyone aboard wears a life jacket; at 4 feet or lower each person must have one at hand, and children wear theirs regardless. Below El Capitan Bridge the Merced becomes Class III and IV water.\n\nThe concessioner rents four-person rafts at the Curry Village activities kiosk in a short early-summer season, typically June and July, when river level and temperature allow; it requires two capable paddlers per raft, one of them an adult, and turns away children under 50 pounds. The river line on this guide\'s Home page reads a different gauge, at Happy Isles, in cubic feet per second: use it for a sense of the river, and the posted ranger reading for the rule.\n\n' +
      '**Creek crossings on trail.** Cross at a wide, shallow spot that is not above rapids or falls. Unbuckle your hip belt, face upstream, and use a long stick for balance. Never tie yourself to a rope; the park says ropes drown people. The rule from [the quiet trails](/essentials/quiet-trails) stands: if moving water is over your knees, turn around. If someone does go in, [the Help card](/help) has the call.',
    checklist: [
      { id: 'water-season-check', label: 'River swim only after the melt: flow and posted closures checked that day' },
      { id: 'water-life-jackets', label: 'Life jackets for every child on or near moving water' },
      { id: 'water-shoes', label: 'Water shoes for polished rock and cobble' },
      { id: 'water-never-above-brink', label: 'Agreed as a group: no wading above any waterfall' },
      { id: 'water-buddy', label: 'One adult watching the water and nothing else' },
    ],
  },
  {
    id: 'accessibility',
    title: 'Accessibility: the free pass, the placard roads, and the paved Valley',
    order: 9,
    section: 'plan',
    teaser: 'A free lifetime pass, a placard that opens roads closed to other cars, lift-equipped shuttles, and the paved paths that reach the base of the falls.',
    body:
      'Two free errands at the gate.\n\n' +
      '**The Access Pass.** U.S. citizens and permanent residents with a permanent disability qualify for the Interagency Access Pass: free, for life, and good at every national park. It admits the holder and everyone in the same private vehicle and takes 50 percent off camping fees. It does not reduce wilderness permit fees or anything a concessioner charges. Every Yosemite entrance station and visitor center issues it at no charge; online it carries a $10 processing fee. Bring proof of eligibility.\n\n' +
      '**The placard roads.** Your own disability placard works here, and a visitor who is temporarily disabled, or who left the placard at home, can get a temporary one at any entrance station or visitor center. On the dashboard it opens the accessible parking spaces and a few paved roads closed to every other private car: the Happy Isles Loop Road, the road to Mirror Lake, and the Mariposa Grove Road up to the Grizzly Giant. Pedestrians, bikes, and shuttles share those roads, so hazard lights stay on and speed stays under 15 mph.\n\n' +
      '**Getting around the Valley.** The free Valley shuttle is fully accessible: every bus has a lift and tie-downs, and drivers help riders on and off. The size limit is a wheelchair 24 inches wide and 46 inches long. Park once in an accessible space and ride, the same advice [Getting around](/essentials/getting-around) gives everyone. YARTS buses from the gateway towns carry lifts too; call 877/989-2787 at least 48 hours ahead so a lift bus is on your run.\n\n' +
      '**Where the grades work.**\n\n' +
      '- **[Lower Yosemite Fall](/stop/lower-yosemite-fall):** the east side of the loop is wheelchair accessible all the way to the viewing area; the west side is mostly accessible, but its last 180 feet climb at 13.8 percent.\n' +
      '- **[Cook\'s Meadow](/stop/cooks-meadow-loop):** flat pavement and boardwalk.\n' +
      '- **[Mirror Lake](/stop/mirror-lake):** a paved mile of road from the shuttle stop; its last 1,000 feet run 6.6 to 10.6 percent. With a placard you can drive it.\n' +
      '- **[Mariposa Grove](/stop/mariposa-grove):** the Big Trees Loop is a flat 0.3 mile and wheelchair accessible. Placard holders may drive past the arrival area to a small lot near the Grizzly Giant (seven accessible spaces), then walk 0.1 mile on compressed dirt to the Grizzly Giant and the California Tunnel Tree.\n' +
      '- **[Glacier Point](/stop/glacier-point):** both paved paths to the overlook are steeper than an accessible grade in places; the restrooms and snack bar are accessible.\n' +
      '- **[Olmsted Point](/stop/olmsted-point),** up Tioga Road: a fully accessible viewing area with a bronze tactile map of Half Dome.\n\n' +
      '**Where they do not.** The Tuolumne Grove path climbs about a mile at 7.5 percent. The way down to Tenaya Lake\'s beach is soil trail, though a paved sidewalk runs along parts of the north shore. Hetch Hetchy\'s main lot has no designated accessible spaces because of its cross-slope; the backpackers\' campground lot has accessible parking and a restroom.\n\n' +
      '**Hearing and vision.** Sign language interpreting and assistive listening devices are free for every park program; request them through Yosemite Deaf Services and allow two weeks. The park brochure comes in Braille and as audio description in the UniDescription app, the Valley Visitor Center has tactile exhibits and a relief map of the Valley, and there is an adapted Junior Ranger handbook. The [programs list](/programs) marks the programs the Yosemite Guide prints as wheelchair accessible.\n\n' +
      '**Sleeping.** Most campgrounds have accessible sites. The pass buys the discount, not priority, so book any site like everyone else, then ask the campground office about an accessible one. For lodging, describe your needs when you reserve: Yosemite Valley Lodge has accessible rooms but no elevators, and Curry Village has accessible heated tent cabins.\n\n' +
      '**Altitude and heat.** Above 8,000 feet, which is most of Tioga Road, thin air brings fatigue and headaches; see [Lightning, altitude, and cold](/essentials/mountain-weather). The Valley in July is the [Heat](/essentials/heat-safety) topic. For anything seasonal, the park\'s Accessibility Coordinator is at 209/379-1035.',
    checklist: [
      { id: 'access-pass', label: 'Access Pass in hand, or proof of eligibility to get one at the gate' },
      { id: 'access-placard', label: 'Placard on the dash, or a temporary one from the entrance station' },
      { id: 'access-asl-request', label: 'Interpreter or listening device requested two weeks ahead, if needed' },
      { id: 'access-yarts-lift', label: 'YARTS lift bus requested 48 hours ahead, if riding' },
      { id: 'access-room-call', label: 'Accessible room or campsite confirmed with the lodge or campground office' },
    ],
  },
  {
    id: 'pets',
    title: 'Dogs in Yosemite: pavement, campgrounds, and one meadow loop',
    order: 10,
    section: 'plan',
    teaser: 'Leashed dogs may use paved roads and paths, most campgrounds, and the Wawona Meadow Loop. Not trails, not shuttles, not the Mariposa Grove.',
    body:
      'A dog\'s Yosemite is pavement, campgrounds, and one meadow in Wawona. Plan the trip around that, or plan the dog\'s days elsewhere, because the rules below are federal regulations.\n\n' +
      '**Where a leashed dog may go.** Developed areas, and fully paved roads, sidewalks, and bike paths unless a sign says otherwise. That includes several Valley walks: the paved [Bridalveil Fall](/stop/bridalveil-fall) trail, the [Lower Yosemite Fall](/stop/lower-yosemite-fall) trail, the paved path and boardwalks through [Cook\'s Meadow](/stop/cooks-meadow-loop), and the paved road to [Mirror Lake](/stop/mirror-lake), though not the unpaved trail around the lake. The one trail open to dogs is the [Wawona Meadow Loop](/stop/wawona-meadow-loop). The park\'s rulebook, the Superintendent\'s Compendium, also opens a few old roads to leashed dogs: Four Mile Road in Wawona, Eleven Mile and Chowchilla Mountain Roads, and Carlon Road plus the Tuolumne Grove Road between Hodgdon Meadow and the Tuolumne Grove parking lot.\n\n' +
      '**Where it may not.** Every other trail, including the trail to Vernal Fall. Wilderness and all undeveloped areas. All meadows, beaches, and waterways. Public buildings, the shuttle buses, and the lodging areas, Housekeeping Camp included. O\'Shaughnessy Dam. Unplowed roads under snow. Camp 4, every walk-in and group campsite, and all backpackers\' campgrounds. And the whole Mariposa Grove, the road up from the Welcome Plaza and the Washburn Trail included, so a sequoia day needs a different plan for the dog.\n\n' +
      'Three things catch people at the trailhead. Carrying the dog changes nothing: the park makes no exception for a pet in your arms, a carrier, a stroller, or a backpack. Pets are not allowed at [Dog Lake](/hike/dog-lake), despite the name. And the trail rule is neither new nor temporary: the Park Service has kept pets off trails for many years, for the sake of pets and wildlife.\n\n' +
      '**The rules that come with the yes.** A leash no longer than six feet, and a leashed dog is never left unattended, which rules out tying it to the picnic table while you walk to the restroom. Bag the waste and bin it. Pet food is bear food: store it in the food locker exactly as you store your own, under the rules in [Bears](/essentials/bear-safety). Rabies and distemper have been detected in park wildlife, so bring a dog whose vaccinations are current, and give wildlife extra room when the dog is with you.\n\n' +
      '**Heat and the car.** Summer heat and elevation work on a dog too. Carry water and snacks, and protect paws from hot pavement. Do not leave a dog in a parked car: under the park\'s rules, a pet left unattended or in violation of California\'s hot-car law can be impounded on the spot. The [Heat](/essentials/heat-safety) topic has the Valley numbers.\n\n' +
      '**Camping with a dog.** Dogs are allowed in every campground except Camp 4 and the group sites, leashed and never left tied up alone. See [Camping](/essentials/camping).\n\n' +
      '**Boarding.** The concessioner\'s kennel at the Valley stable, a June-to-September service, was listed closed when this guide went to press. Plan on boarding in a gateway town for any day built around a trail, and confirm before you count on anything inside the park.\n\n' +
      '**Service animals** are legally permitted anywhere visitors can go. Emotional support, therapy, and companion animals, and service animals in training, are not service animals here and follow the pet rules.\n\n' +
      'A dog suits a trip built on the Valley\'s paved paths, a Wawona meadow walk, and a campsite at the Pines or Wawona, not one centered on a trail, a sequoia grove, or the Mist Trail. Any visitor center hands out a B.A.R.K. Ranger pledge card for dogs.',
    checklist: [
      { id: 'pets-leash', label: 'Leash six feet or shorter', note: 'A retractable leash run out past six feet does not comply.' },
      { id: 'pets-vaccines', label: 'Rabies and distemper vaccinations current' },
      { id: 'pets-food-locker', label: 'Pet food planned into the food locker, never the car' },
      { id: 'pets-boarding', label: 'Boarding booked for trail and sequoia days' },
      { id: 'pets-water', label: 'Water and paw protection for hot pavement', season: 'Summer' },
    ],
  },
  {
    id: 'camping',
    title: 'Camping: the 13 campgrounds, the 7 a.m. clock, and the locker',
    order: 11,
    section: 'plan',
    teaser: 'Reservations drop at 7 a.m. Pacific and sell out in minutes. Which window each campground uses, what a site gives you, and the rules that end a stay.',
    body:
      'Yosemite has 13 campgrounds, and from April through October all of them run on reservations. The park\'s advice: do not arrive in that season without one, because no first-come campground is open and you will probably have to leave the park to sleep. Sleeping in a vehicle is legal only in a campsite you have registered for; not in a turnout, not in a trailhead lot.\n\n' +
      '**The three release windows.** Every reservation releases on Recreation.gov at 7 a.m. Pacific, and the popular ones sell out within minutes. Which window applies depends on the campground:\n\n' +
      '- **The 15th of the month:** Upper, Lower, and North Pines, Wawona, and Hodgdon Meadow. Each 15th opens a month of arrivals four months out: March 15 covers July 15 to August 14. The park calls this five months in advance, counting to the far end of the window.\n' +
      '- **Two weeks ahead, rolling daily:** Bridalveil Creek, Crane Flat, Tamarack Flat, White Wolf, Yosemite Creek, Porcupine Flat, and half of Tuolumne Meadows. The other half of Tuolumne releases on the 15th, one month before its arrival window opens.\n' +
      '- **One week ahead, rolling daily:** [Camp 4](/stop/camp-4), at $10 per person a night, during its reservation season. The rest of the year it is first-come at $10 a night.\n\n' +
      'Put your trip dates on [the trip board](/trip) and its dates panel does this arithmetic for you, with a calendar reminder for each release. Make the Recreation.gov account and save a card before release morning, and set your clock to the second.\n\n' +
      '**If you missed it.** Keep checking Recreation.gov; cancellations come back. The two-week campgrounds give a late planner a second chance. Only Upper Pines takes reservations all year; from late fall into spring Camp 4, Wawona, and Hodgdon Meadow go first-come, and they still fill on holidays and weekends. The campground status line is 209/372-0266. The Forest Service camps just outside the boundary, [Tioga Lake](/stop/tioga-lake-campground) and [Summerdale](/stop/summerdale-campground) among them, are the fallback the Secret Guide covers.\n\n' +
      '**What a site gives you.** Room for six people and two vehicles; a trailer that fits on the parking pad does not count as a vehicle. Most campgrounds charge $36 a night and the primitive ones less, as [What a trip costs](/essentials/budget) sets out. There are no hookups anywhere in the park. The dump station at Upper Pines runs all year, with summer stations near Wawona and Tuolumne Meadows when they are operating. The only showers in the park are at the Curry Village pool showerhouse, for a fee. At Tamarack Flat, Yosemite Creek, and Porcupine Flat, creek water must be boiled.\n\n**RV and trailer limits.** The Valley has only eight sites that take a 40-foot RV or a 35-foot trailer. On Glacier Point Road, the limit past the Sentinel Dome and Taft Point trailhead is 30 feet, with no trailers. On the road to [Hetch Hetchy](/essentials/hetch-hetchy) it is 25 feet long and 8 feet wide, mirror to mirror.\n\n' +
      '**The clock.** Check-in and checkout are noon. Arrive as late as you like, but check in before 10 a.m. the morning after your first night or the reservation is cancelled. Quiet hours run 10 p.m. to 6 a.m.; generators run only 7 to 9 a.m., noon to 2 p.m., and 5 to 7 p.m.\n\n**Fires and stay limits.** From May through September, wood fires in the Valley campgrounds and Hodgdon Meadow burn only from 5 to 10 p.m., and summer fire restrictions can go further, so check the current stage; stoves are allowed at any hour. Do not bring firewood from more than 50 miles away; stores near most campgrounds sell it. Between May 1 and September 15 each person may camp 14 nights in the park, only seven of them in the Valley or Wawona.\n\n' +
      '**The locker.** Every site has a steel food locker, and the food rules are law, with fines up to $5,000. Food means anything scented: toiletries, trash, and ice chests, even empty ones, even ones certified bear-resistant. Nothing stays in a pop-up or soft-sided camper; a hard-sided RV works only with windows, doors, and vents shut. Most campsite lockers measure 35 inches deep, 43 wide, and 28 high inside, so measure the cooler at home. Camp 4 sites have four lockers each. The rest of the discipline is in [Bears](/essentials/bear-safety), and the trunk load in [Pack the car](/essentials/pack-the-car).\n\n' +
      'Dogs are welcome in every campground but Camp 4 and the group sites; see [Dogs](/essentials/pets). Backpackers\' campgrounds run on a different system, the wilderness permit: see [Sleeping in the wilderness](/essentials/wilderness-permits).',
    checklist: [
      { id: 'camp-recgov-account', label: 'Recreation.gov account made and card saved before release morning' },
      { id: 'camp-release-date', label: 'Release date for your arrival read off the trip board\'s dates panel' },
      { id: 'camp-checkin-10am', label: 'Check-in planned before 10 a.m. the morning after night one' },
      { id: 'camp-locker-fit', label: 'Cooler measured against the locker', note: 'Most campsite lockers are 35 inches deep, 43 wide, 28 high inside.' },
      { id: 'camp-firewood-local', label: 'Firewood bought within 50 miles of camp' },
      { id: 'camp-fire-hours', label: 'Current fire restrictions checked on nps.gov/yose' },
    ],
  },
  {
    id: 'mountain-weather',
    title: 'Lightning, altitude, and cold: the high country\'s three hazards',
    order: 46,
    section: 'safety',
    teaser: 'Afternoon storms on bare granite, thin air above 8,000 feet, and summer nights near freezing in Tuolumne. Plus the one rule for rockfall on the Valley floor.',
    body:
      'Three high-country hazards surprise visitors: lightning, thin air, and cold.\n\n' +
      '**Lightning.** In July 1985 lightning at Half Dome killed two people and injured three more. Thunderstorms can come in any month but are most common June through September, and from July the summer monsoon carries moisture from the Gulf of California into the Sierra. They build in the afternoon as sun-warmed air rises off the ridges: towering cumulus first, then the anvil. The park\'s rule is to summit peaks before noon and be over the passes and off high open ground by then. That is why the [Half Dome](/essentials/half-dome-permits) cables, [Clouds Rest](/stop/clouds-rest-tenaya), [Mount Dana](/hike/mount-dana), and the [Cathedral Lakes](/stop/cathedral-lakes) all carry an early-start warning in this guide.\n\n' +
      'If you hear thunder, the storm is within about 10 miles; do not wait for it to come closer. There is no safe shelter outside. The only safe places are a substantial building or a hard-topped vehicle.\n\nIf you are caught out, get down off peaks, ridges, and viewpoints. Stay away from lone tall trees, water, and metal, and avoid shuttle stops, vault toilets, and open vehicles such as the tram. Spread the group at least 50 feet apart, so one strike cannot take everyone. In forest, get under the shortest trees you can find. As a last resort, crouch on your toes with your hands over your ears, touching the ground as little as possible, and do not lie flat. Wait 30 minutes after the last thunder. A lightning victim is safe to touch: start CPR if you are trained, and call 911.\n\n' +
      '**Altitude.** Tioga Road tops out at 9,945 feet at the pass, Tuolumne Meadows sits at 8,600, and Glacier Point at about 7,200. At or above 8,000 feet many people feel it as fatigue or a headache, and a few visitors every summer develop altitude sickness: a severe headache, nausea. The only treatment is to descend, immediately. Drink water and eat salty snacks on the way up.\n\n' +
      '**Cold.** The July day that averages a high of 89°F in the Valley averages a low of 39°F in Tuolumne Meadows, and the June and September lows there sit at freezing. Snow can fall in the high country in any month. Wet cotton on a windy ridge is how a day hike becomes hypothermia, and snowmelt water speeds it; see [Rivers and waterfalls](/essentials/water-safety). The park asks every hiker to carry extra food and water, rain gear, and warm clothing in case of a night out that was never planned. [The day pack](/essentials/day-pack) list covers it.\n\n' +
      '**Rockfall and trees.** The Valley walls shed rock: more than 1,000 rockfalls are on record in the past 150 years, and the talus piles at the base of every cliff are the evidence. If you see one from the Valley floor, move away from the cliff toward the center of the Valley. If you are at the foot of a cliff or a talus slope when rock comes down, get behind the largest boulder near you, then move away once it stops. Stay off closed trails. Report any rockfall you see or hear to 209/379-1420.\n\nTrees fail too, some with no visible defect, and several have seriously or fatally injured visitors here, so stay aware of what is overhead, especially away from developed areas.\n\n' +
      '**The habits.** Rangers do not keep track of overdue hikers; that job belongs to you and the person you told. Set a turnaround time, carry a headlamp on every hike, and treat any water from a creek or snowbank. If you are lost, stay put: any signal repeated three times is a distress call. When something does go wrong, [the Help card](/help) has your position and the numbers, and [Safety and help](/essentials/safety-and-help) has the rest.',
    checklist: [
      { id: 'wx-forecast', label: 'Afternoon thunderstorm chance checked the night before' },
      { id: 'wx-noon-summit', label: 'Summit or ridge planned for before noon' },
      { id: 'wx-warm-layer', label: 'Warm layer and shell packed for Tuolumne, even in July' },
      { id: 'wx-turnaround', label: 'Turnaround time set and shared' },
      { id: 'wx-water-treatment', label: 'Water treatment for anything drawn from a creek' },
    ],
  },
  {
    id: 'winter',
    title: 'Winter: chains, what stays open, and the snow days',
    order: 12,
    section: 'plan',
    teaser: 'The Valley and Wawona stay open all year. Tioga and most of Glacier Point Road do not. The chain rules in plain terms, Badger Pass, the rink, and the snowshoe routes.',
    body:
      'Yosemite Valley and Wawona stay reachable by car all year. Tioga Road closes, usually sometime in November, and after that no vehicle may travel between Crane Flat and Tioga Pass, Tuolumne Meadows included. Glacier Point Road closes around the same time; from mid-December into early April it is plowed only as far as the Badger Pass Ski Area. Winter days in the Valley and Wawona average 53°F and nights 28°F, and the holiday weeks still fill the lots. [Seasons and roads](/essentials/seasons-and-roads) has the whole-year picture.\n\n' +
      '**Chains, in plain terms.** When a chain control sign is up, federal rules inside the park and state law outside it require chains or cables, strictly enforced. Expect controls November through March, less often in October and April, rarely in September or May. They come most often on the Wawona Road (Highway 41), the Big Oak Flat Road (Highway 120 from the west), and the road to Badger Pass; least often on the El Portal Road (Highway 140), the Valley floor, and the Hetch Hetchy Road.\n\nWhenever controls are on, every vehicle must carry chains, four-wheel drive and rentals included. Cables and tire socks meet the law; plastic straps and other emergency devices do not. The signs come in three levels:\n\n' +
      '- **R-1:** chains on the drive wheels unless the vehicle weighs under 6,000 pounds, has snow tires (M+S, tread at least 6/32 inch) on at least two drive wheels, and is not towing.\n' +
      '- **R-2:** chains unless the vehicle weighs under 6,500 pounds, has four-wheel or all-wheel drive engaged, carries snow tires on all four wheels, and is not towing.\n' +
      '- **R-3:** chains on every vehicle. No exceptions.\n\n' +
      'Watch the weight line: the park notes that many electric trucks and some large electric SUVs weigh more than 6,000 pounds and need chains at R-1 even on snow tires. Rental cars are not exempt, rental companies generally do not supply chains, and almost nobody rents them, so buy a set that fits your tires at a gateway-town auto parts store or gas station; the Village Garage in the Valley and the Wawona gas station carry a limited selection.\n\nChain up at the sign\'s turnout and hold 25 mph in the control area. Skipping them risks a citation of up to $5,000, and a tow truck bringing chains costs a few hundred dollars and several hours, not covered by AAA. Current restrictions: 209/372-0200, then 1, 1, the recording park staff use; Caltrans covers the highways outside at 800/427-7623.\n\n' +
      '**The no-chains route.** Park at a YARTS stop on Highway 140, in Mariposa or El Portal, below wherever the chain control sits that day, and ride in. It runs all year; see [Getting around](/essentials/getting-around).\n\n' +
      '**Badger Pass.** California\'s oldest downhill ski area runs mid-December through March when conditions allow, five miles up Glacier Point Road from the Wawona Road, base at 7,200 feet. It has a snow tubing hill with rental tubes; sledding is not allowed. A free shuttle runs from the Valley whenever the ski area is open, and rangers may lead free snowshoe walks from Badger Pass, staffing and snow permitting.\n\n' +
      '**The routes.** Markers on trees can be buried, and old tracks may not go where you are going. Marked winter routes usually hold enough snow from mid-to-late December through mid-March. Past Badger Pass, Glacier Point Road is closed to cars and groomed: snowshoers keep to the edges, outside the classic ski tracks, and there is a pit toilet at Summit Meadow about a mile out. The ungroomed route to [Dewey Point](/hike/dewey-point) leads to the rim.\n\nNear [Crane Flat](/stop/crane-flat-meadow), ungroomed routes start around 6,200 feet at the Tuolumne and Merced Grove lots: Crane Flat Lookout is 1.5 miles one way, the Gin Flat Loop 6.25 miles round trip, and a snow play area takes the sleds.\n\nThe [Mariposa Grove](/stop/mariposa-grove) shuttle does not run from December 1 until at least mid-April, so the grove is then two miles each way and about 500 feet of climb on the Washburn Trail or the closed road, often snowy or icy.\n\n' +
      '**The rest of the season.** The outdoor rink at [Curry Village](/stop/curry-village) runs mid-November to mid-March, conditions permitting. The [programs list](/programs) carries the rink, the ski season, and the February firefall window as rows you can lay against your dates. Winter camping is Upper Pines on reservations plus first-come Camp 4, Wawona, and Hodgdon Meadow; see [Camping](/essentials/camping). The load is in the winter rows of the [packing checklist](/essentials/packing-checklist).',
    checklist: [
      { id: 'winter-chains-fit', label: 'Chains or cables that fit your tires, tried on once at home', season: 'Winter' },
      { id: 'winter-ev-weight', label: 'Vehicle weight checked against 6,000 lb', note: 'Electric trucks and large electric SUVs are often over it and need chains at R-1.', season: 'Winter' },
      { id: 'winter-road-line', label: 'Road recording checked: 209/372-0200, then 1, 1', season: 'Winter' },
      { id: 'winter-spikes', label: 'Traction spikes for icy paths', season: 'Winter' },
      { id: 'winter-gloves-kneeling', label: 'Gloves and a kneeling pad for chaining up', season: 'Winter' },
    ],
  },
  {
    id: 'park-rules',
    title: 'The rules that carry fines',
    order: 27,
    section: 'on-the-ground',
    teaser: 'No drones, no feeding anything, no sleeping in the car outside a campsite, no pine cones in the trunk. The regulations visitors break without knowing.',
    body:
      'The rules below are federal regulations, set out in the Code of Federal Regulations and in the Superintendent\'s Compendium the park reissues each year, and rangers write citations for them.\n\n' +
      '**Animals.** Feeding or approaching any animal in the park is illegal, birds and squirrels included. Within 50 yards of a bear is too close by regulation, and so is any distance at which your presence disturbs or displaces an animal. For other wildlife the Park Service\'s general guidance is 25 yards. Viewing wildlife with a spotlight or any artificial light is banned parkwide, and so is using a call or device to attract an animal. Food storage is law, with fines up to $5,000 and impoundment of the food or the car; the details are in [Bears](/essentials/bear-safety). Bear spray is not allowed in Yosemite: do not carry it or use it.\n\n' +
      '**The sky.** Launching, landing, or flying a drone inside the park is prohibited, model aircraft and quadcopters included, and the park does not issue drone permits. It gives two reasons: rescue helicopters, and nesting peregrine falcons. BASE jumping is prohibited. Hang gliding needs a permit.\n\n' +
      '**Taking things home.** Collecting plants is illegal, and the park names pine cones specifically. So is collecting reptiles or butterflies, picking up an arrowhead or any historic object, and possessing a metal detector.\n\n' +
      '**The car.** Sleeping in a vehicle is legal only in a registered campsite, nowhere else in the park. Park only on pavement unless a space is marked otherwise, and never drive into a meadow. Seat belts for everyone; child safety seats for children under six or under 60 pounds; helmets on motorcyclists.\n\n' +
      '**Bikes and e-bikes.** Paved roads and paved paths only: no unpaved trails, no meadows, no wilderness. Riders under 18 wear helmets, and the paved bike paths carry a 15 mph limit for everything on them. E-bikes with two or three wheels, working pedals, and a motor under 750 watts may go wherever a bicycle may. [Getting around](/essentials/getting-around) has the rentals and the bike share.\n\n' +
      '**Fire and smoking.** In summer the park steps through three fire-restriction stages by elevation: below 6,000 feet, below 8,000 feet, and parkwide. The current stage is posted on nps.gov/yose, and the stages restrict smoking as well as fires. Gas, liquid-fuel, propane, and alcohol stoves are allowed at every stage. Fireworks are always prohibited, and so is burning sequoia wood. Campground fire hours and the firewood rules are in [Camping](/essentials/camping).\n\n' +
      '**Trees, walls, and trails.** Climbing a giant sequoia is prohibited. Do not cut switchbacks, and do not build rock cairns or any other trail marker. Dogs stay off trails altogether; see [Dogs](/essentials/pets). In the wilderness, pack out toilet paper and keep soap out of the water, the biodegradable kind included; see [Sleeping in the wilderness](/essentials/wilderness-permits).\n\n' +
      '**Firearms and marijuana.** Anyone who may legally possess a firearm under federal, state, and local law may possess it in the park, except inside the facilities signed at their entrances; discharging a firearm for any reason is illegal. Marijuana, medical marijuana included, is prohibited here whatever California allows outside the boundary.\n\n' +
      '**Paying.** The park does not take cash for entrance fees; bring a card.\n\n' +
      'If you see something that could harm people or the park, note a description or a license plate and call or text 911.',
  },
  {
    id: 'wilderness-permits',
    title: 'Sleeping in the wilderness: permits, canisters, and the four-mile rule',
    order: 13,
    section: 'plan',
    teaser: 'Every night in the backcountry needs a permit. The 24-week lottery, the seven-day release, the canister, and where camping is banned.',
    body:
      'A day hike in Yosemite needs no permit, with one exception: the [Half Dome](/essentials/half-dome-permits) cables. A night out does. A wilderness permit is required for every overnight trip into the wilderness, in every month of the year; reservations exist only for trips from May through October.\n\n' +
      '**How the permits are divided.** Each trailhead has a daily quota, and a permit is tied to its entry trailhead and start date.\n\n' +
      '- **60 percent by weekly lottery, 24 weeks ahead.** From mid-November through early May the lottery runs every Sunday to Saturday on Recreation.gov, for start dates 24 weeks out. Results arrive the next Monday; accept and pay by Thursday or the reservation is cancelled. Whatever the lottery leaves opens first-come about 22 weeks ahead at 9 a.m. Pacific.\n' +
      '- **40 percent seven days ahead,** first-come on Recreation.gov at 7 a.m. Pacific. Popular trailheads go fast, and the last day to reserve is three days before the trip.\n' +
      '- **Walk-up.** Anything still unreserved is issued in person at a wilderness center on the start date only, and on most days there is little or nothing left.\n\n' +
      'The fee is $10 per application plus $5 per person on the permit, and neither is refundable. One lottery entry per week, and no more than six future reservations at a time. Put your start date on [the trip board](/trip) and its dates panel works out the lottery week and the seven-day morning.\n\n' +
      '**Picking it up.** The trip leader or the named alternate collects the permit in person at a wilderness center: the day before between 8 a.m. and 5 p.m., or the start day between 8 and 11 a.m., held until 5 p.m. if you flagged a late arrival on Recreation.gov. A reservation confirmation is not a permit, and there are no after-hours permits.\n\n' +
      '**Food: the canister.** An approved bear-resistant canister is required throughout the wilderness, and hanging food is no longer legal. Food means everything with a scent: trash, toiletries, sunscreen, medications. Overnight, keep the canister within sight and earshot of where you sleep. Any staffed wilderness station rents one for $5 a week with a $95 card deposit, no reservation needed: 12 inches tall, 8.8 inches across, 615 cubic inches. Return it clean, at any station, any hour, or by mail; a dirty one can cost a $15 fee. Bear spray is not allowed; see [Bears](/essentials/bear-safety).\n\n' +
      '**Where you may sleep.** Camp at least four trail miles from Yosemite Valley, Tuolumne Meadows, Glacier Point, Hetch Hetchy, and Wawona, and at least a mile from any road. Every camp sits at least 100 feet from water and from the trail, on an established site and a durable surface, never in a meadow.\n\nCamping is banned at Lukens Lake, in the Lost Lake basin, on top of Half Dome, and in the watersheds of the Dana Fork of the Tuolumne, Parker Pass Creek, Gaylor Creek, Elizabeth Creek, and Budd Creek. On the climb from Happy Isles, the Little Yosemite Valley campground is the only legal camp short of the Half Dome and Sunrise Creek trail junctions, and within a mile of a High Sierra Camp you use its campground. Groups top out at 15 people, or 8 for travel more than a quarter mile off trail.\n\n' +
      '**Fire and waste.** Fires only in existing rings, below 9,600 feet, and never on Half Dome, on beaches, or in the Cathedral Lakes basins; summer fire restrictions can close even those. Bury human waste 4 to 6 inches deep and 100 feet from water, trails, and camp, and pack out the toilet paper. Wash 100 feet from water, with no soap in it, biodegradable included. Treat all water and melted snow: boil it, use iodine, or use a Giardia-rated filter.\n\n' +
      '**The rule that ends a trip.** A permit covers one continuous trip. Riding in a car or a bus at any point ends it, and so does passing through Yosemite Valley mid-trip. Wilderness nights count toward the park\'s camping limit of 14 nights between May 1 and September 15.\n\n' +
      '**First nights out.** Three day hikes in this guide double as first overnights past the four-mile line: [Glen Aulin](/hike/glen-aulin) off Tioga Road, [Ostrander Lake](/stop/ostrander-lake) off Glacier Point Road, and [Rancheria Falls](/stop/rancheria-falls) at Hetch Hetchy. Check the creeks in [Rivers and waterfalls](/essentials/water-safety) and the storm pattern in [Lightning, altitude, and cold](/essentials/mountain-weather) before you pick a date.',
    checklist: [
      { id: 'wild-permit-pickup', label: 'Pickup time and wilderness center confirmed' },
      { id: 'wild-canister', label: 'Canister packed, or a rental planned ($95 card deposit)' },
      { id: 'wild-distance', label: 'First camp at least four trail miles out and 100 feet from water' },
      { id: 'wild-water-treatment', label: 'Water treatment packed' },
    ],
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
      'This is the single-day trail kit for the Valley or the high country, spring through fall. Most of it is small and stays in the pack between trips. The dresser-top version is the Packing checklist topic; this is the one to walk through the night before a real hike.\n\n' +
      'Three principles. Water and calories beyond what feels reasonable, because the climbs are steeper and the air drier than the trailhead suggests. Layers over jackets, because the valley floor and the rim can be twenty degrees apart on the same afternoon. And navigation that does not need a signal, because cell service dies past Crane Flat.\n\n' +
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
      { id: 'daypack-headlamp', label: 'Headlamp plus spare battery', note: 'Day hikes run past dark more often than planned.', group: 'Illumination' },
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
      { id: 'daypack-cash', label: 'Cash in small bills', note: 'Cards fail whenever the network drops, which in the park is often; cash never does.', group: 'Easily forgotten' },
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
      'Two Yosemite-specific rules shape the load. First, bear-locker discipline: everything with a scent, food, toothpaste, sunscreen, trash, goes in the campsite bear box, never in the car overnight. The trunk is not bear-proof. Second, firewood comes from near camp, not from home: the park asks that no firewood travel more than 50 miles, to keep forest pests out, and stores near most campgrounds sell it.\n\n' +
      'Nobody needs every item on every trip. Skim the groups that match your setup and check off as you load.',
    checklist: [
      { id: 'car-john-box', label: 'The camp box: one bin, always packed', note: 'A single durable storage box holding every camping essential you always bring: a double-burner stove, propane, a hatchet, paracord, firestarter, a flashlight, a spare headlamp and batteries, a lantern, a tarp, a deck of cards. Never unpack it between trips: load it once, store it loaded, grab it on the way out the door.', group: 'The John box' },
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
      { id: 'car-firewood', label: 'Firewood, bought near camp', note: 'The park asks that no firewood come from more than 50 miles away, to keep forest pests out. Stores near most campgrounds sell it.', group: 'Fire' },
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
      { id: 'car-shower-sandals', label: 'Shower sandals or flip-flops', note: 'The only showers in the park are at the Curry Village pool showerhouse.', group: 'Hygiene & sanitation' },
      { id: 'car-shower-coins', label: 'Quarters and small bills', note: 'The Curry Village showerhouse charges a fee; check how it takes payment when you arrive.', group: 'Hygiene & sanitation' },
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
      { id: 'car-swimwear', label: 'Swimwear', note: 'The Merced swimming holes are cold.', group: 'Clothing & footwear', season: 'Summer' },
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
    'Entrances, crowds, budgets, camping and wilderness permits, accessibility, dogs, winter, bears, water, weather, the rules that carry fines, and the packing checklists.',
}
