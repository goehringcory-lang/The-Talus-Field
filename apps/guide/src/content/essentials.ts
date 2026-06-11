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
    id: 'entrances-and-reservations',
    title: 'Entrances, fees, and the reservation question',
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
]

export const ESSENTIALS: EssentialTopicT[] = EssentialTopics.parse(seed).sort(
  (a, b) => a.order - b.order,
)

export const ESSENTIALS_META = {
  title: 'Know before you go',
  teaser:
    'Entrances, the shuttle, bears, cell coverage, seasonal roads, and the packing checklist. The logistics layer under the whole trip.',
}
