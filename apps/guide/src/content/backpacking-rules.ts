// =============================================================================
// The wilderness rules every backpacking trip carries (/backpacking, and the
// foot of each trip page). Quoted or closely paraphrased from the park's own
// pages and the Superintendent's Compendium (signed May 27, 2026), each with
// its source. Checked October 19, 2026; re-read on the fact audit's rotation,
// like dining hours, because the permit mechanics move most years.
//
// Two places where the park's pages disagree, and which wins here:
//   - Waste depth: wildregs.htm says 4 to 6 inches, the Compendium and the
//     Yosemite Guide say at least 6. The Compendium is the enforceable text.
//   - Canisters: required everywhere in the wilderness, except that the
//     Compendium excuses a backpacker who sleeps only at a High Sierra Camp
//     backpackers' camp or Little Yosemite Valley, where lockers stand. Every
//     trip here passes somewhere without one, so carry it.
// =============================================================================

export type BackpackRule = { id: string; title: string; text: string; source: string }

const WILDREGS = 'https://www.nps.gov/yose/planyourvisit/wildregs.htm'
const COMPENDIUM = 'https://www.nps.gov/yose/learn/management/upload/yose-compendium.pdf'
const PERMITS = 'https://www.nps.gov/yose/planyourvisit/wildpermits.htm'
const WPRES = 'https://www.nps.gov/yose/planyourvisit/wpres.htm'

export const BACKPACK_RULES: BackpackRule[] = [
  {
    id: 'permit',
    title: 'The permit',
    text:
      'A wilderness permit is required for every night out, all year. Sixty percent of each trailhead’s quota goes by weekly lottery on Recreation.gov 24 weeks ahead, and the other forty percent opens at 7 a.m. Pacific seven days before the start date. Each application costs $10, plus $5 a person, neither refunded. From about November through April no reservation or fee is needed: you self-register at the station nearest the trailhead.',
    source: WPRES,
  },
  {
    id: 'pickup',
    title: 'Picking it up',
    text:
      'Collect the permit in person at a wilderness permit station, from 8 a.m. to 5 p.m. the day before, or 8 to 11 a.m. on the start day (later only with a late-arrival hold set up in advance). The permit names one trailhead and one start date; a vehicle or bus ride part way through voids it.',
    source: 'https://www.nps.gov/yose/planyourvisit/wildfaq.htm',
  },
  {
    id: 'distance',
    title: 'Where you may sleep',
    text:
      'At least four trail miles from Yosemite Valley, Tuolumne Meadows, Glacier Point, Hetch Hetchy and Wawona, and a mile from any road (the May Lake backpackers’ camp is the named exception). At least 100 feet from water and from the trail, on a site that has been used before, on rock, sand or dirt and never in a meadow. The first night must be on the same side of the road as the trailhead.',
    source: WILDREGS,
  },
  {
    id: 'designated',
    title: 'Designated camps',
    text:
      'Within a mile of a High Sierra Camp (May Lake, Glen Aulin, Sunrise, Vogelsang, Merced Lake) you sleep in its backpackers’ camp, and between Happy Isles and the Half Dome and Sunrise Creek junctions only at the Little Yosemite Valley campground. No camping at all at Lukens Lake, in the Lost Lake basin, on top of Half Dome, or in the Dana Fork, Parker Pass, Gaylor, Elizabeth and Budd Creek drainages.',
    source: WILDREGS,
  },
  {
    id: 'food',
    title: 'Food',
    text:
      'An approved bear-resistant canister holds every bit of food, trash and anything scented, and sleeps within sight and earshot of you. Hanging food is illegal here, and so is bear spray. The park rents canisters at its permit stations for $5 a week.',
    source: 'https://www.nps.gov/yose/planyourvisit/bearcanisters.htm',
  },
  {
    id: 'fire',
    title: 'Fire',
    text:
      'Campfires only in existing rings, below 9,600 feet, and 100 feet from water and trail; never on Half Dome or in the Cathedral Lakes basins. At Little Yosemite Valley and the High Sierra Camps, only in the communal rings (Vogelsang has none). Seasonal restrictions tighten this, often banning wood fires below 8,000 feet; gas and alcohol stoves stay legal.',
    source: 'https://www.nps.gov/yose/planyourvisit/firerestrictions.htm',
  },
  {
    id: 'water',
    title: 'Water',
    text:
      'Treat every source, snowmelt included: boil it, or use a filter rated for Giardia or a chemical treatment. Wash at least 100 feet from water, and keep all soap out of it, biodegradable soap included.',
    source: 'https://www.nps.gov/yose/planyourvisit/wilderness_safety.htm',
  },
  {
    id: 'waste',
    title: 'Waste',
    text:
      'Bury human waste at least six inches deep and 100 feet from water, trails and camp; pack out toilet paper. Near Hetch Hetchy Reservoir the distance is 300 feet.',
    source: COMPENDIUM,
  },
  {
    id: 'group',
    title: 'Group size and the rest',
    text:
      'Fifteen people at most, eight for travel more than a quarter mile off trail. No pets, wheels, motors or drones in the wilderness. Fourteen nights a year in the park from May 1 to September 15, wilderness nights included.',
    source: WILDREGS,
  },
  {
    id: 'parking',
    title: 'October 15',
    text:
      'From October 15 until the roads reopen, no vehicle may be left unattended from sunset to sunrise on Tioga Road or Glacier Point Road or at their trailheads, so every overnight from those roads ends then, whatever the weather.',
    source: COMPENDIUM,
  },
]

export const BACKPACK_RULES_SOURCE = { label: 'NPS wilderness permits', url: PERMITS }
