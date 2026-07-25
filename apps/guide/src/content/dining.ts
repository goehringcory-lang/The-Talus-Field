// =============================================================================
// DINING — the where-to-eat directory behind /dining.
//
// Two layers. In-park venues carry the hours the park publishes: transcribe
// them from the current NPS Yosemite Guide edition (the same source as the
// editorial bulletin.json) and update DINING_HOURS_SOURCE when a new edition
// lands. Gateway-town venues deliberately carry NO clock hours: small-town
// kitchens change their days and hours too often to freeze here, so those
// entries keep to day patterns (closed Mondays, dinner only) that shift
// slowly, and leave the clock to a phone call.
//
// Facts were compiled July 2026 from the printed Yosemite Guide,
// travelyosemite.com, nps.gov, and the venues' own listings. Closure notes
// (Wawona Hotel, White Wolf) match the park's published status; re-check both
// each season. Coordinates reuse the guide's verified stop pins where a venue
// shares one; the rest are map-pin approximations, not survey points.
// Descriptions are original house copy. Validated at module load, same as
// stops.
// =============================================================================

import { z } from 'zod'
import { DiningVenues, type DiningArea, type DiningKind, type DiningVenueT } from './schema'

// The Yosemite Guide edition the in-park hours below were transcribed from.
// Rewrite the hours and this stamp together, per edition, roughly every five
// weeks in season.
export const DINING_HOURS_SOURCE = {
  edition: 'July 15 – August 18, 2026',
  url: 'https://www.nps.gov/yose/planyourvisit/guide.htm',
}

export const DINING_KIND_LABEL: Record<DiningKind, string> = {
  'sit-down': 'Sit-down',
  counter: 'Counter',
  snack: 'Snacks',
  coffee: 'Coffee',
  bar: 'Bar',
  grocery: 'Grocery',
}

// In-park section headers, in region order. The note renders under the header.
export const DINING_AREAS: { id: DiningArea; title: string; note?: string }[] = [
  {
    id: 'valley',
    title: 'Yosemite Valley',
    note:
      'Everything below sits in one of four clusters, Yosemite Village, the Ahwahnee, Yosemite Valley Lodge, and Curry Village, all on the free shuttle loop. Nothing here needs the car once you are parked.',
  },
  {
    id: 'glacier-mariposa',
    title: 'Glacier Point & Wawona',
    note:
      'Thin on purpose: this is picnic country. Pack the cooler before you drive up, and treat what follows as backup rather than plan.',
  },
  {
    id: 'tuolumne',
    title: 'Tuolumne Meadows & the Highway 120 corridor',
    note:
      'Open roughly June through October with Tioga Road. Between Crane Flat and Lee Vining this is every calorie on the road, so the store and grill matter more than they would anywhere else.',
  },
  {
    id: 'hetch-hetchy',
    title: 'Hetch Hetchy corridor',
    note:
      'There is no food service at Hetch Hetchy itself: no snack bar at the dam, nothing at the entrance station. Everything you eat comes in with you or from Evergreen Road on the way.',
  },
]

// Gateway corridors, in the order the entrances usually get used. `route`
// renders as the small line under the town header.
export const GATEWAY_TOWNS: { name: string; route: string }[] = [
  { name: 'El Portal & Midpines', route: 'Highway 140, outside the Arch Rock Entrance' },
  { name: 'Mariposa', route: 'Highway 140, 45 minutes to an hour from the Valley' },
  { name: 'Groveland & Buck Meadows', route: 'Highway 120 west, outside the Big Oak Flat Entrance' },
  { name: 'Oakhurst', route: 'Highway 41, 40 minutes south of the South Entrance' },
  { name: 'Fish Camp', route: 'Highway 41, two miles from the South Entrance' },
  { name: 'Lee Vining', route: 'Highway 120 east at US 395, below Tioga Pass' },
]

type DiningInput = z.input<typeof DiningVenues>[number]

const seed: DiningInput[] = [
  // ---------------------------------------------------------------------------
  // Yosemite Valley
  // ---------------------------------------------------------------------------
  {
    id: 'coffee-corner',
    name: 'Coffee Corner',
    area: 'valley',
    place: 'Curry Village',
    kind: 'coffee',
    price: '$',
    order: 1,
    hours: '6 – 2',
    coord: [-119.5726, 37.7377], // shared Curry Village pin (stops.ts)
    description:
      'Coffee, pastries, and oatmeal from 6 a.m. inside Seven Tents Pavilion, which makes it the earliest breakfast in the east Valley and the right first stop before the Mist Trail. Expect a line from 7.',
  },
  {
    id: 'lodge-starbucks',
    name: 'Starbucks',
    area: 'valley',
    place: 'Yosemite Valley Lodge',
    kind: 'coffee',
    price: '$',
    order: 2,
    hours: '6:30 – 6:30',
    coord: [-119.6012, 37.7414], // shared Lodge pin (points.geojson)
    description:
      'A full Starbucks next to Base Camp Eatery, the only chain in the park. The one food counter in the Valley where you know the menu before you walk in.',
  },
  {
    id: 'degnans-kitchen',
    name: "Degnan's Kitchen",
    area: 'valley',
    place: 'Yosemite Village',
    kind: 'counter',
    price: '$$',
    order: 3,
    hours: '7 – 6',
    hoursNote: 'limited service 11 – 11:30 while the line switches to lunch',
    coord: [-119.5853, 37.7481],
    description:
      'Proper deli sandwiches, breakfast items, and espresso in the old Degnan family store, and the best cheap move in the Valley. A 7 a.m. breakfast sandwich here beats every buffet in the park on price and speed, and the made-to-order sandwich is the trail lunch.',
  },
  {
    id: 'loft-at-degnans',
    name: "The Loft at Degnan's",
    area: 'valley',
    place: 'Yosemite Village, above Degnan\'s Kitchen',
    kind: 'counter',
    price: '$$',
    order: 4,
    hoursNote:
      'runs limited weekend afternoons in recent seasons and is not listed in the current Guide; check the door',
    coord: [-119.5853, 37.7481], // shared Degnan's pin
    description:
      'The A-frame room upstairs: pizzas, rice bowls, and local beer under the big beams when it operates, which lately is weekends only. A find when open, never the plan.',
  },
  {
    id: 'base-camp-eatery',
    name: 'Base Camp Eatery',
    area: 'valley',
    place: 'Yosemite Valley Lodge',
    kind: 'counter',
    price: '$$',
    order: 5,
    hours: '6:30 – 10:30, 11 – 9',
    coord: [-119.6012, 37.7414],
    description:
      'The park\'s food court: breakfast until 10:30, then burgers, pizza, salads, and rice bowls from self-order kiosks. Not memorable, reliably open, and the widest menu for a family that cannot agree.',
  },
  {
    id: 'village-grill',
    name: 'Village Grill',
    area: 'valley',
    place: 'Yosemite Village',
    kind: 'counter',
    price: '$$',
    order: 6,
    hours: '11 – 6',
    season: 'Spring to fall',
    coord: [-119.5853, 37.7481], // shared Village pin
    description:
      'Burgers, grilled sandwiches, and fries eaten on a big outdoor deck in the Village. Fine fuel at lunch if you are already there; closes with the season.',
  },
  {
    id: 'meadow-grill',
    name: 'Meadow Grill Taqueria',
    area: 'valley',
    place: 'Curry Village',
    kind: 'counter',
    price: '$$',
    order: 7,
    hours: '11 – 8',
    season: 'Spring to fall',
    coord: [-119.5735, 37.7383],
    description:
      'Tacos, burrito bowls, and quesadillas from the stand at the edge of the Curry Village lot. The fastest hot dinner in the east Valley when the Pizza Deck line has gone long.',
  },
  {
    id: 'curry-pizza-deck',
    name: 'Pizza Deck',
    area: 'valley',
    place: 'Curry Village',
    kind: 'counter',
    price: '$$',
    order: 8,
    hours: '11 – 10',
    coord: [-119.5726, 37.7377],
    stopId: 'curry-village-pizza',
    description:
      'Pizza and pitchers on a wooden deck under the Glacier Point Apron, and the one restaurant in the park worth going out of your way for. There is almost always a line at dinner; the line is part of it.',
  },
  {
    id: 'bar-1899',
    name: 'Bar 1899',
    area: 'valley',
    place: 'Curry Village',
    kind: 'bar',
    price: '$$',
    order: 9,
    hours: '11:30 – 10',
    coord: [-119.5726, 37.7377],
    description:
      'The Curry Village bar, named for the camp\'s founding year: draft beer, cocktails, and bar food beside the Pizza Deck. Where the deck crowd migrates when the evening cools.',
  },
  {
    id: 'seven-tents',
    name: 'Seven Tents Pavilion',
    area: 'valley',
    place: 'Curry Village',
    kind: 'counter',
    price: '$$',
    order: 10,
    hours: '7 – 10, 5:30 – 8:30',
    coord: [-119.5726, 37.7377],
    description:
      'The big rebuilt Curry Village dining hall, named for the camp\'s original seven tents: all-you-can-eat breakfast and dinner buffets. Volume and convenience for camp guests, not a destination.',
  },
  {
    id: 'jennies-ice-cream',
    name: "Jennie's Ice Cream",
    area: 'valley',
    place: 'Curry Village',
    kind: 'snack',
    price: '$',
    order: 11,
    hours: '11 – 8:30',
    coord: [-119.5726, 37.7377],
    description:
      'Scoops named for Jennie Curry, at the end of a hot afternoon on the shuttle loop. Does exactly one job.',
  },
  {
    id: 'mountain-room',
    name: 'Mountain Room Restaurant',
    area: 'valley',
    place: 'Yosemite Valley Lodge',
    kind: 'sit-down',
    price: '$$$',
    order: 12,
    hours: '5 – 10',
    hoursNote: 'last seating 9:30',
    reservations:
      'Reservations are accepted and worth making for a window table; walk-ins wait at the door. In spring the view of Yosemite Falls does most of the work.',
    coord: [-119.6012, 37.7414],
    description:
      'Steaks, trout, and California standards behind a two-story window aimed at Yosemite Falls. The best proper dinner in the park that does not require planning your evening around it.',
  },
  {
    id: 'mountain-room-lounge',
    name: 'Mountain Room Lounge',
    area: 'valley',
    place: 'Yosemite Valley Lodge',
    kind: 'bar',
    price: '$$',
    order: 13,
    hours: '4:30 – 10',
    hoursNote: 'from noon Sa Su',
    coord: [-119.6012, 37.7414],
    description:
      'The Lodge bar: a big open fireplace, beer and cocktails, and a short food menu. Buy a s\'mores kit and use the fire; it is the Valley\'s most dependable bad-weather afternoon.',
  },
  {
    id: 'ahwahnee-dining-room',
    name: 'The Ahwahnee Dining Room',
    area: 'valley',
    place: 'The Ahwahnee',
    kind: 'sit-down',
    price: '$$$$',
    order: 14,
    hours: '7 – 10, 11:30 – 3, 5:30 – 9',
    hoursNote: 'Sunday brunch 7 – 3',
    reservations:
      'Dinner is prix fixe, reserved ahead, with a dress expectation of roughly collared-shirt level. Breakfast and lunch are far easier to get into and buy the same room for a fraction of the bill.',
    coord: [-119.5743, 37.7462], // shared Ahwahnee pin (stops.ts)
    stopId: 'ahwahnee-hotel',
    description:
      'The grandest dining room in any national park, sugar-pine trestles and stone under 34-foot ceilings, serving hotel food at special-occasion prices. Go once, for the room.',
  },
  {
    id: 'ahwahnee-bar',
    name: 'The Ahwahnee Bar',
    area: 'valley',
    place: 'The Ahwahnee',
    kind: 'bar',
    price: '$$$',
    order: 15,
    hours: '11:30 – 11',
    coord: [-119.5743, 37.7462],
    stopId: 'ahwahnee-hotel',
    description:
      'The smart move at the Ahwahnee: cocktails and a real small-plates menu, no reservation and no dress code, with the Great Lounge and its fireplaces a room away. The hotel experience at bar prices.',
  },
  {
    id: 'ahwahnee-sweet-shop',
    name: 'Ahwahnee Sweet Shop',
    area: 'valley',
    place: 'The Ahwahnee',
    kind: 'snack',
    price: '$',
    order: 16,
    hours: '7 – 10',
    coord: [-119.5743, 37.7462],
    description:
      'Espresso, pastries, and packaged sweets off the hotel lobby. The quiet morning coffee in the east Valley when the Curry line is around the corner.',
  },
  {
    id: 'village-store',
    name: 'Village Store',
    area: 'valley',
    place: 'Yosemite Village',
    kind: 'grocery',
    price: '$$',
    order: 17,
    hours: '8 – 10',
    coord: [-119.5853, 37.7481], // shared Village pin
    description:
      'The biggest grocery in the park: produce, cooler staples, beer, firewood, and a large souvenir floor. Prices run well above a supermarket, so provision outside and use this for what you forgot.',
  },
  {
    id: 'curry-grocery',
    name: 'Curry Village Gift & Grocery',
    area: 'valley',
    place: 'Curry Village',
    kind: 'grocery',
    price: '$$',
    order: 18,
    hours: '8 – 10',
    coord: [-119.5726, 37.7377],
    description:
      'Camp-scale groceries, snacks, and beer at the east end of the shuttle loop. Smaller than the Village Store, closer to the tents.',
  },
  {
    id: 'housekeeping-store',
    name: 'Housekeeping Camp Store',
    area: 'valley',
    place: 'Housekeeping Camp',
    kind: 'grocery',
    price: '$$',
    order: 19,
    hours: '8 – 8',
    season: 'Spring to fall',
    coord: [-119.5834, 37.7412],
    description:
      'The small store on the river side of the camp: ice, firewood, s\'mores inventory, and enough grocery basics to save a trip to the Village. The laundry next door runs later.',
  },

  // ---------------------------------------------------------------------------
  // Glacier Point & Wawona
  // ---------------------------------------------------------------------------
  {
    id: 'glacier-point-snacks',
    name: 'Glacier Point Snack Stand',
    area: 'glacier-mariposa',
    place: 'Glacier Point, at the gift shop',
    kind: 'snack',
    price: '$',
    order: 1,
    hours: '9 – 7',
    season: 'Road season',
    coord: [-119.5731, 37.7283], // shared Glacier Point pin (stops.ts)
    description:
      'Grab-and-go sandwiches, snacks, ice cream, and drinks at the gift shop behind the most famous view in the park. Enough for lunch on the terrace, nothing more. Closes with Glacier Point Road.',
  },
  // The Wawona Hotel Dining Room is deliberately not listed: it has been
  // closed with the hotel since December 2024 (structural condition
  // assessment, no reopening date), and the golf-shop snack stand is dark
  // with it. If the hotel reopens, restore it here from travelyosemite.com.
  {
    id: 'wawona-store',
    name: 'Wawona Store & Pioneer Gift Shop',
    area: 'glacier-mariposa',
    place: 'Wawona, Highway 41 at Forest Drive',
    kind: 'grocery',
    price: '$$',
    order: 2,
    hours: '8 – 8',
    coord: [-119.6556, 37.5384],
    description:
      'Groceries, grab-and-go food, ice, and firewood at the south end of the park, still open through the hotel closure. The provisioning stop for the Mariposa Grove and the last easy food until Oakhurst going south.',
  },
  {
    id: 'pine-tree-market',
    name: 'Pine Tree Market',
    area: 'glacier-mariposa',
    place: 'Chilnualna Falls Road, Wawona',
    kind: 'grocery',
    price: '$$',
    order: 3,
    hours: '8 – 6',
    hoursNote: 'independent store; hours are the market\'s own, not the park\'s',
    coord: [-119.6428, 37.5417],
    description:
      'The independent full grocery tucked into the Wawona community: real produce, a meat counter, and staples. The best actual grocery inside the park boundary, and most visitors never learn it exists.',
  },

  // ---------------------------------------------------------------------------
  // Tuolumne Meadows & the Highway 120 corridor
  // ---------------------------------------------------------------------------
  {
    id: 'crane-flat-store',
    name: 'Crane Flat Gas & Grocery',
    area: 'tuolumne',
    place: 'Crane Flat, Big Oak Flat Road at Tioga Road',
    kind: 'grocery',
    price: '$$',
    order: 1,
    hours: '8 – 5',
    hoursNote: 'pumps take cards 24 hours',
    coord: [-119.8007, 37.7552],
    description:
      'The gas-station store at the foot of Tioga Road: snacks, drinks, ice, firewood, and coffee. Top off the tank and the cooler here; the next services eastbound are Tuolumne Meadows, 39 slow miles up.',
  },
  {
    id: 'tuolumne-grill',
    name: 'Tuolumne Meadows Grill',
    area: 'tuolumne',
    place: 'Tuolumne Meadows Store complex, Tioga Road',
    kind: 'counter',
    price: '$',
    order: 2,
    hours: '8 – 6',
    season: 'Tioga Road season',
    hoursNote: '2026 season May 30 to September 20, conditions permitting',
    coord: [-119.3590, 37.8741], // shared Tuolumne grill/store pin (stops.ts)
    stopId: 'tuolumne-meadows-grill',
    description:
      'Burgers, breakfast, and soft-serve from a walk-up window at 8,600 feet, eaten at picnic tables full of hikers and climbers. Back in full operation after the meadows rehabilitation years, and still the unofficial living room of the high country.',
  },
  {
    id: 'tuolumne-store',
    name: 'Tuolumne Meadows Store',
    area: 'tuolumne',
    place: 'Tioga Road, Tuolumne Meadows',
    kind: 'grocery',
    price: '$$',
    order: 3,
    hours: '8 – 8',
    season: 'Tioga Road season',
    coord: [-119.3590, 37.8741],
    description:
      'The canvas-sided general store that provisions the entire high country: groceries, camp fuel, beer, and a post office window where thru-hikers collect resupply boxes. Everything a Tuolumne day forgets to pack.',
  },
  {
    id: 'tuolumne-lodge-dining',
    name: 'Tuolumne Meadows Lodge Dining Tent',
    area: 'tuolumne',
    place: 'Tuolumne Meadows Lodge Road',
    kind: 'sit-down',
    price: '$$',
    order: 4,
    season: 'Tioga Road season',
    hoursNote: '2026 season June 5 to September 13; meals run in fixed seatings',
    reservations:
      'Dinner is by reservation through the lodge (209/372-8413) and open to non-guests when there is room; breakfast is first-come.',
    coord: [-119.3520, 37.8778],
    description:
      'Family-style breakfast and dinner in a canvas dining tent by the Dana Fork, shared tables and all. The most sociable dinner in the park, and the only table service east of the Valley.',
  },
  {
    id: 'white-wolf-dining',
    name: 'White Wolf Lodge',
    area: 'tuolumne',
    place: 'White Wolf, off Tioga Road',
    kind: 'sit-down',
    price: '$$',
    order: 5,
    closed:
      'The lodge, store, and dining room are closed for the 2026 season for sewer-line repairs. When operating, it runs a counter window, a tiny store, and family-style dinners like a smaller Tuolumne Lodge.',
    coord: [-119.6497, 37.8523],
    description:
      'The little 1920s lodge halfway up Tioga Road, ordinarily the only food between Crane Flat and the meadows.',
  },

  // ---------------------------------------------------------------------------
  // Hetch Hetchy corridor
  // ---------------------------------------------------------------------------
  {
    id: 'evergreen-lodge-dining',
    name: 'Evergreen Lodge Restaurant & Tavern',
    area: 'hetch-hetchy',
    place: 'Evergreen Road, a mile before Camp Mather',
    kind: 'sit-down',
    price: '$$$',
    order: 1,
    reservations: 'Dinner reservations recommended in summer; the tavern and its deck are walk-in.',
    coord: [-119.8530, 37.8680], // shared Evergreen Lodge pin (stops.ts)
    stopId: 'evergreen-lodge',
    description:
      'The 1921 lodge on the Hetch Hetchy road: a proper restaurant, a century-old tavern with a deck under the pines, and breakfast through dinner daily in season. The only reliable food and drink on the corridor; time the dam trip so this is the reward on the way out.',
  },
  {
    id: 'evergreen-general-store',
    name: 'Evergreen Lodge General Store',
    area: 'hetch-hetchy',
    place: 'Evergreen Lodge',
    kind: 'grocery',
    price: '$$',
    order: 2,
    coord: [-119.8530, 37.8680],
    stopId: 'evergreen-lodge',
    description:
      'Sandwiches, coffee, ice, and forgotten sunscreen. The last provisions before the dead-end road to the dam, where there is nothing.',
  },

  // ---------------------------------------------------------------------------
  // Gateway towns
  // ---------------------------------------------------------------------------
  {
    id: 'el-portal-market',
    name: 'El Portal Market',
    area: 'gateway',
    town: 'El Portal & Midpines',
    place: 'Highway 140, El Portal',
    kind: 'grocery',
    price: '$$',
    order: 1,
    hours: '9 – 7',
    description:
      'The closest grocery to the Arch Rock Entrance, fifteen minutes from the Valley floor, with gas next door. Small but real: cooler staples, beer, and ice at prices gentler than the Village Store.',
  },
  {
    id: 'yosemite-view-dining',
    name: 'Yosemite View Lodge Restaurant & Pizza Bar',
    area: 'gateway',
    town: 'El Portal & Midpines',
    place: 'Highway 140, two miles from the Arch Rock Entrance',
    kind: 'sit-down',
    price: '$$$',
    order: 2,
    description:
      'The riverside hotel\'s two options: a sit-down dining room over the Merced and a casual pizza and beer bar. Useful precisely because it is there, open latish, and five minutes from the gate.',
  },
  {
    id: 'june-bug-cafe',
    name: 'June Bug Cafe',
    area: 'gateway',
    town: 'El Portal & Midpines',
    place: 'Yosemite Bug Rustic Mountain Resort, Midpines',
    kind: 'sit-down',
    price: '$$',
    order: 3,
    coord: [-119.9331, 37.5757],
    description:
      'The hostel kitchen that outcooks most restaurants on the corridor: scratch-made, hiker-sized plates at communal tables, with vegetarians treated as people. Worth the ten-minute detour off 140.',
  },
  {
    id: 'happy-burger',
    name: 'Happy Burger Diner',
    area: 'gateway',
    town: 'Mariposa',
    place: 'Highway 140 at 12th Street, Mariposa',
    kind: 'counter',
    price: '$',
    order: 1,
    hoursNote: 'open early to evening, daily',
    coord: [-119.9650, 37.4866],
    description:
      'A gold-rush-town diner claiming the largest menu in the Sierra, burgers through burritos through pie, with a patio and milkshakes. The reliable family stop on the 140 corridor.',
  },
  {
    id: 'eighteen-fifty',
    name: '1850 Restaurant & Brewery',
    area: 'gateway',
    town: 'Mariposa',
    place: 'Highway 140, Mariposa',
    kind: 'sit-down',
    price: '$$$',
    order: 2,
    hoursNote: 'closed Mondays',
    coord: [-119.9663, 37.4859],
    description:
      'Mariposa\'s brewery restaurant, named for the county\'s founding year: house beers, smoked meats, and serious burgers. The first-choice proper dinner on the 140 side.',
  },
  {
    id: 'charles-street',
    name: 'Charles Street Dinner House',
    area: 'gateway',
    town: 'Mariposa',
    place: 'Highway 140 at 7th Street, Mariposa',
    kind: 'sit-down',
    price: '$$$',
    order: 3,
    hoursNote: 'dinner only',
    coord: [-119.9670, 37.4849],
    description:
      'Old-school steak-and-seafood dinner house in a historic downtown building, run the same way for decades. Where Mariposa goes for anniversaries.',
  },
  {
    id: 'fredricks-of-savourys',
    name: "Fredrick's of Savourys",
    area: 'gateway',
    town: 'Mariposa',
    place: 'Highway 140, Mariposa',
    kind: 'sit-down',
    price: '$$$',
    order: 4,
    hoursNote: 'dinner only, closed Wednesdays',
    coord: [-119.9673, 37.4846],
    description:
      'The small dinner bistro long known as Savoury\'s, renamed under new ownership: a short, changing menu in a black-and-white room. It fills in summer; call ahead.',
  },
  {
    id: 'sugar-pine-cafe',
    name: 'Sugar Pine Cafe',
    area: 'gateway',
    town: 'Mariposa',
    place: 'Highway 140, Mariposa',
    kind: 'counter',
    price: '$$',
    order: 5,
    hoursNote: 'breakfast and lunch',
    coord: [-119.9660, 37.4855],
    description:
      'Breakfast and lunch in a restored 1940s diner: eggs, biscuits, sandwiches, and pastry. The morning stop before the hour drive up to the Valley.',
  },
  {
    id: 'iron-door',
    name: 'Iron Door Saloon & Grill',
    area: 'gateway',
    town: 'Groveland & Buck Meadows',
    place: 'Main Street, Groveland',
    kind: 'bar',
    price: '$$',
    order: 1,
    coord: [-120.2320, 37.8385],
    description:
      'Claims to be the oldest continuously operating saloon in California, pouring since the 1850s, with dollar bills on the ceiling and a full grill menu. The obligatory 120-corridor stop, and a decent burger besides.',
  },
  {
    id: 'firefall-coffee',
    name: 'Firefall Coffee Roasting Co.',
    area: 'gateway',
    town: 'Groveland & Buck Meadows',
    place: 'Main Street, Groveland',
    kind: 'coffee',
    price: '$',
    order: 2,
    hoursNote: 'mornings to mid-afternoon',
    coord: [-120.2325, 37.8386],
    description:
      'The local roaster on Main Street: espresso, pastries, and light breakfast from 7 a.m. The right coffee before the last hour of Highway 120.',
  },
  {
    id: 'priest-station',
    name: 'Priest Station Cafe',
    area: 'gateway',
    town: 'Groveland & Buck Meadows',
    place: 'Highway 120 at Old Priest Grade',
    kind: 'sit-down',
    price: '$$',
    order: 3,
    coord: [-120.2565, 37.8098],
    description:
      'Burgers and comfort plates on a deck hanging over the edge of Priest Grade, run by descendants of the 1855 stage stop\'s founders. The view down the canyon is the reason to time a meal here.',
  },
  {
    id: 'buck-meadows-restaurant',
    name: 'Buck Meadows Restaurant & Bar',
    area: 'gateway',
    town: 'Groveland & Buck Meadows',
    place: 'Highway 120, Buck Meadows',
    kind: 'sit-down',
    price: '$$',
    order: 4,
    description:
      'Roadhouse portions twenty minutes from the Big Oak Flat Entrance: burgers, steaks, and pie in a room full of people who just left the park. The last full menu before the gate.',
  },
  {
    id: 'rush-creek-dining',
    name: 'Rush Creek Lodge Restaurant & Tavern',
    area: 'gateway',
    town: 'Groveland & Buck Meadows',
    place: 'Highway 120, half a mile from the Big Oak Flat Entrance',
    kind: 'sit-down',
    price: '$$$',
    order: 5,
    reservations: 'Restaurant reservations recommended in summer; the tavern serves lunch through late evening, walk-in.',
    coord: [-119.9370, 37.8110],
    description:
      'The polished sibling of the Evergreen Lodge, minutes from the gate: a restaurant, a lively tavern, a firepit terrace, and a general store below. The best-executed dinner on the 120 side.',
  },
  {
    id: 'south-gate-brewing',
    name: 'South Gate Brewing Company',
    area: 'gateway',
    town: 'Oakhurst',
    place: 'Highway 41, Oakhurst',
    kind: 'sit-down',
    price: '$$',
    order: 1,
    coord: [-119.6486, 37.3405],
    description:
      'Oakhurst\'s brewpub: house beers, wood-fired pizzas, and burgers in a room that fills by 6 on summer nights. The default good dinner on the southern corridor.',
  },
  {
    id: 'elderberry-house',
    name: 'The Elderberry House',
    area: 'gateway',
    town: 'Oakhurst',
    place: 'Château du Sureau, Highway 41, Oakhurst',
    kind: 'sit-down',
    price: '$$$$',
    order: 2,
    hoursNote: 'dinner Wednesday through Sunday',
    reservations: 'Reservations essentially required; nothing about the room is casual.',
    coord: [-119.6560, 37.3364],
    description:
      'Erna Kubin-Clanin\'s famed estate restaurant at a Relais & Châteaux inn, improbably parked in a Sierra foothill town: multi-course European-Californian tasting menus and a deep cellar. The one true special-occasion meal within an hour of the park.',
  },
  {
    id: 'jackalopes',
    name: "Jackalope's Bar & Grill",
    area: 'gateway',
    town: 'Fish Camp',
    place: 'Tenaya at Yosemite, Highway 41, Fish Camp',
    kind: 'sit-down',
    price: '$$$',
    order: 1,
    coord: [-119.6318, 37.4635],
    description:
      'The casual all-day room at the big Tenaya resort, two miles from the South Entrance: burgers, salads, and a bar that stays open after the park empties. The resort also runs a deli and a main three-meal restaurant, so nobody leaves unfed.',
  },
  {
    id: 'embers-tenaya',
    name: 'Embers',
    area: 'gateway',
    town: 'Fish Camp',
    place: 'Tenaya at Yosemite, Highway 41, Fish Camp',
    kind: 'sit-down',
    price: '$$$$',
    order: 2,
    hoursNote: 'dinner only; seasonal nights vary',
    reservations: 'Reservations recommended.',
    coord: [-119.6320, 37.4633],
    description:
      'Tenaya\'s fine-dining room: steaks, seafood, and California wine in a lodge setting. The dress-up dinner south of the park while Wawona\'s dining room is dark.',
  },
  {
    id: 'narrow-gauge-inn',
    name: 'Narrow Gauge Inn Restaurant',
    area: 'gateway',
    town: 'Fish Camp',
    place: 'Highway 41, Fish Camp',
    kind: 'sit-down',
    price: '$$$',
    order: 3,
    season: 'Seasonal',
    hoursNote: 'dinner, typically closed early in the week; call first',
    coord: [-119.6300, 37.4560],
    description:
      'A creaky mountain dining room and buffalo-head bar at the century-old inn beside the Sugar Pine Railroad. Seasonal, dinner-oriented, and worth confirming before counting on it.',
  },
  {
    id: 'whoa-nellie-deli',
    name: 'Whoa Nellie Deli',
    area: 'gateway',
    town: 'Lee Vining',
    place: 'Tioga Gas Mart, Highway 120 at US 395',
    kind: 'counter',
    price: '$$',
    order: 1,
    season: 'Tioga season',
    coord: [-119.1201, 37.9600],
    description:
      'The famous one: fish tacos, buffalo meatloaf, and mango margaritas inside a gas station at the foot of Tioga Pass, with Mono Lake out the window. Closes with the pass; every eastbound crossing should end here at least once.',
  },
  {
    id: 'mono-cone',
    name: 'Mono Cone',
    area: 'gateway',
    town: 'Lee Vining',
    place: 'US 395, Lee Vining',
    kind: 'snack',
    price: '$',
    order: 2,
    season: 'Summer',
    coord: [-119.1213, 37.9573],
    description:
      'A walk-up burger-and-soft-serve shack that has fed 395 travelers for generations. Line out front, cones the size of the drive you just did.',
  },
  {
    id: 'nicelys',
    name: "Nicely's",
    area: 'gateway',
    town: 'Lee Vining',
    place: 'US 395, Lee Vining',
    kind: 'sit-down',
    price: '$$',
    order: 3,
    coord: [-119.1210, 37.9580],
    description:
      'The 1965 diner at the center of Lee Vining: big breakfasts, patty melts, and pie, and the only restaurant in town that stays open through winter. The morning move before driving up the pass.',
  },
  {
    id: 'latte-da',
    name: 'Latte Da Coffee Cafe',
    area: 'gateway',
    town: 'Lee Vining',
    place: 'El Mono Motel, US 395, Lee Vining',
    kind: 'coffee',
    price: '$',
    order: 4,
    season: 'Summer',
    coord: [-119.1207, 37.9585],
    description:
      'Espresso and baked goods out of the 1920s El Mono Motel office, in a garden with Mono Lake light. The correct coffee before Tioga Pass.',
  },
]

export const DINING: DiningVenueT[] = DiningVenues.parse(seed)

// Venues for one in-park area, curation order.
export function getDiningByArea(area: DiningArea): DiningVenueT[] {
  return DINING.filter((v) => v.area === area).sort((a, b) => a.order - b.order)
}

// Venues for one gateway town, curation order.
export function getDiningByTown(town: string): DiningVenueT[] {
  return DINING.filter((v) => v.area === 'gateway' && v.town === town).sort(
    (a, b) => a.order - b.order,
  )
}

// Every gateway venue's town must exist in GATEWAY_TOWNS, or the venue would
// silently never render. Checked at module load like the schema parse.
const knownTowns = new Set(GATEWAY_TOWNS.map((t) => t.name))
for (const v of DINING) {
  if (v.area === 'gateway' && v.town && !knownTowns.has(v.town)) {
    throw new Error(`dining venue '${v.id}' has unknown town '${v.town}'`)
  }
}
