// =============================================================================
// WILDLIFE QUICK ID — "what did I see?" for the animals, birds, and trees a
// visitor actually encounters. Same content posture as stops.ts: a bundled,
// zod-validated TS seed that works offline and fails the build on a bad
// entry. Entries are identification aids, not an encyclopedia: the lookFor
// field is the one or two marks that settle it in the field, whereWhen is
// where a visitor plausibly crosses paths with it, and note is the single
// fact worth retelling at dinner. Safety text appears only where behavior
// matters (bears, lions, and the deer that injure more visitors than
// either); the full rules live in the bear-safety essentials topic, which
// /wildlife links rather than duplicates.
//
// Facts were drawn from NPS Yosemite species pages and cross-checked at
// authoring time (July 2026); anything uncertain was cut rather than hedged.
// =============================================================================

import { z } from 'zod'

export const WildlifeKind = z.enum(['mammal', 'bird', 'tree', 'other'])
export type WildlifeKindT = z.infer<typeof WildlifeKind>

export const WildlifeEntry = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  // Scientific name, for the reader who wants to look further.
  latin: z.string(),
  kind: WildlifeKind,
  // The one or two field marks that settle the identification.
  lookFor: z.string(),
  // Where and when a visitor plausibly encounters it.
  whereWhen: z.string(),
  // One fact worth retelling.
  note: z.string(),
  // Present only where behavior around the animal matters.
  safety: z.string().optional(),
})
export type WildlifeEntryT = z.infer<typeof WildlifeEntry>

export const KIND_LABELS: Record<WildlifeKindT, string> = {
  mammal: 'Mammals',
  bird: 'Birds',
  tree: 'Trees',
  other: 'Reptiles & amphibians',
}

const seed: WildlifeEntryT[] = [
  {
    id: 'black-bear',
    name: 'Black bear',
    latin: 'Ursus americanus',
    kind: 'mammal',
    lookFor:
      'Large animal (100-350 lbs) with fur that ranges from black to brown or cinnamon, rounded ears, short curved claws visible on the front feet.',
    whereWhen:
      'Forests and meadows from the Valley floor to the high country, present year-round though most visible spring through fall.',
    note:
      'Bears quickly learn to associate specific places and vehicles with food, returning repeatedly.',
    safety:
      'Food storage in bear-proof lockers or canisters is required by law throughout the park. Never approach a bear. If one approaches your food or campsite, make noise and act aggressively to drive it off. If you startle a bear at close range, back away slowly without running.',
  },
  {
    id: 'mule-deer',
    name: 'Mule deer',
    latin: 'Odocoileus hemionus',
    kind: 'mammal',
    lookFor:
      'Moderate ungulate (100-200 lbs), gray-brown or reddish coat, unusually large ears, white tail with black tip.',
    whereWhen:
      'Meadows, forest edges, and shrubby areas from the Valley floor into the high country, most active dawn and dusk.',
    note:
      'Mule deer injure more Yosemite visitors annually than any large predator, with habituated animals becoming especially unpredictable.',
    safety:
      'Do not approach or hand-feed. Habituated deer have kicked and gored visitors, especially in developed areas. Keep at least 25 yards distance.',
  },
  {
    id: 'coyote',
    name: 'Coyote',
    latin: 'Canis latrans',
    kind: 'mammal',
    lookFor:
      'Lean, dog-sized canine (25-35 lbs), grayish-russet fur, pointed muzzle, bushy tail held lower than a domestic dog\'s.',
    whereWhen:
      'Meadows, forest edges, open brushy areas from valley to high country, most active dawn and dusk.',
    note:
      'A single animal\'s diet spans mice, insects, berries, scavenged food, and occasionally young ungulates.',
  },
  {
    id: 'bobcat',
    name: 'Bobcat',
    latin: 'Lynx rufus',
    kind: 'mammal',
    lookFor:
      'Cat-sized predator (15-25 lbs), tan to reddish-brown coat marked with dark spots, short tufted ears, stubby tail black on top and white underneath.',
    whereWhen:
      'Brushy areas, woodlands, and rocky terrain from the Valley floor to mid-elevations, active mainly at dawn, dusk, and night. Rarely observed.',
    note:
      'Tracks show four toes in a tight, asymmetrical arc with no claw marks, since cats retract their claws when walking.',
  },
  {
    id: 'mountain-lion',
    name: 'Mountain lion',
    latin: 'Puma concolor',
    kind: 'mammal',
    lookFor:
      'Large, uniformly tan cat (65-180 lbs), long tail tipped in black, small rounded ears, lean facial profile.',
    whereWhen:
      'Forested canyons and remote backcountry at all elevations, primarily active at dawn, dusk, and night. Sightings are extremely rare.',
    note:
      'They hunt alone by ambush, and encounters are so rare that thousands of visitors pass a lifetime in Yosemite without seeing one.',
    safety:
      'If encountered, stand tall to appear larger, maintain eye contact, and do not run or turn your back. Back away slowly, and fight back if attacked.',
  },
  {
    id: 'yellow-bellied-marmot',
    name: 'Yellow-bellied marmot',
    latin: 'Marmota flaviventris',
    kind: 'mammal',
    lookFor:
      'Large ground squirrel (5-11 lbs), brown-yellow mottled fur, distinctly yellow-orange underside, loud sharp alarm whistle.',
    whereWhen:
      'Rocky meadows and talus slopes above 8,000 feet, active only during summer months, hibernating underground in winter.',
    note:
      'The alarm whistle warns other marmots in the colony of approaching predators such as coyotes and golden eagles.',
  },
  {
    id: 'pika',
    name: 'American pika',
    latin: 'Ochotona princeps',
    kind: 'mammal',
    lookFor:
      'Tiny rabbit-like animal (4-6 oz), gray fur, rounded ears, short legs, high-pitched nasal call more often heard than the animal seen.',
    whereWhen:
      'Rocky talus and boulder slopes above 8,000 feet, active during daylight and visible mainly in summer, since pikas remain active beneath the snow in winter rather than hibernating.',
    note:
      'Unlike marmots, pikas do not hibernate. They spend summer gathering dried vegetation into haypiles they eat under the snow.',
  },
  {
    id: 'california-ground-squirrel',
    name: 'California ground squirrel',
    latin: 'Otospermophilus beecheyi',
    kind: 'mammal',
    lookFor:
      'Medium ground squirrel (10-24 oz), mottled gray-brown coat flecked with white, with a lighter patch across each shoulder.',
    whereWhen:
      'Open rocky areas and grasslands from valley elevations to mid-slopes, active during daylight.',
    note:
      'They tail-flag rapidly when confronted with rattlesnakes, one of the few small mammals that actively challenge snakes rather than fleeing.',
  },
  {
    id: 'golden-mantled-ground-squirrel',
    name: 'Golden-mantled ground squirrel',
    latin: 'Callospermophilus lateralis',
    kind: 'mammal',
    lookFor:
      'Smaller ground squirrel than the California ground squirrel (4-8 oz), reddish-brown head and shoulders, white and black stripes along the body. The face has no stripes, which is the reliable way to tell it apart from a chipmunk.',
    whereWhen:
      'Forested clearings and campgrounds at mid to high elevations, active from spring through fall before hibernating for winter.',
    note:
      'Cheek pouches let them carry seeds and other food back to the burrow, where caches are eaten after they wake from hibernation.',
  },
  {
    id: 'gray-fox',
    name: 'Gray fox',
    latin: 'Urocyon cinereoargenteus',
    kind: 'mammal',
    lookFor:
      'Small fox (7-13 lbs), salt-and-pepper gray coat with rusty flanks and neck, distinctive black stripe down the spine to the black-tipped tail.',
    whereWhen:
      'Oak woodlands and brushy foothills at lower elevations, active mainly at dawn and dusk.',
    note:
      'The gray fox is the only canid in North America that regularly climbs trees, using semi-retractable claws and rotating wrists to grip branches.',
  },
  {
    id: 'stellers-jay',
    name: 'Steller\'s jay',
    latin: 'Cyanocitta stelleri',
    kind: 'bird',
    lookFor:
      'Bright blue body with black head, upper back, and wings. Prominent crest on the crown that lowers when the bird is relaxed. Larger than a robin.',
    whereWhen:
      'Coniferous forests throughout Yosemite from the valley floor to the upper montane zone, year-round. Common around campgrounds and other developed areas where food is available.',
    note:
      'Mimics red-tailed hawk calls to scare other birds and animals away from food sources, creating the impression of a predator nearby.',
  },
  {
    id: 'common-raven',
    name: 'Common raven',
    latin: 'Corvus corax',
    kind: 'bird',
    lookFor:
      'Entirely black with a heavy, thick bill and shaggy throat feathers. Substantially larger than a crow. Wedge-shaped tail visible in flight distinguishes it from the fan-shaped tail of a crow.',
    whereWhen:
      'Throughout Yosemite at all elevations year-round, especially around cliffs, open terrain, and developed areas.',
    note:
      'Ravens solve multi-step problems and have been observed sliding down snowy slopes and playing with objects, behavior consistent with high intelligence.',
  },
  {
    id: 'acorn-woodpecker',
    name: 'Acorn woodpecker',
    latin: 'Melanerpes formicivorus',
    kind: 'bird',
    lookFor:
      'Black and white head pattern with a red crown (more extensive in males, reduced in females), black back, and white rump. Small to medium woodpecker with a boldly patterned face.',
    whereWhen:
      'Oak woodlands and mixed oak-conifer forest at lower to middle elevations throughout Yosemite, below the higher-elevation conifer forests. Year-round resident.',
    note:
      'Drills rows of small holes into dead trees and wooden structures to create granaries, then wedges acorns into the holes as a food cache for winter.',
  },
  {
    id: 'peregrine-falcon',
    name: 'Peregrine falcon',
    latin: 'Falco peregrinus',
    kind: 'bird',
    lookFor:
      'Blue-gray upperparts, pale underparts finely barred with dark markings, and a bold black mustache mark below each eye on an otherwise pale face. Crow-sized, with long, pointed, swept-back wings built for speed.',
    whereWhen:
      'Nests on cliff faces in Yosemite Valley, including El Capitan, where climbing routes are seasonally closed to protect active nests. Uncommon but present year-round, most easily observed during the spring breeding season.',
    note:
      'Reaches speeds exceeding 200 mph in a hunting dive, the fastest recorded speed of any animal.',
  },
  {
    id: 'american-dipper',
    name: 'American dipper',
    latin: 'Cinclus mexicanus',
    kind: 'bird',
    lookFor:
      'Plain slate-gray body, stocky and short-tailed, somewhat smaller than a robin. Bobs constantly while perched on rocks. Found only in or at the edge of fast-moving water.',
    whereWhen:
      'Fast-moving mountain streams and rivers throughout Yosemite from the valley to high country. Year-round resident, though some birds shift to lower, ice-free elevations in winter.',
    note:
      'Forages by walking along stream bottoms underwater, the only North American songbird known to feed beneath the surface.',
  },
  {
    id: 'great-gray-owl',
    name: 'Great gray owl',
    latin: 'Strix nebulosa',
    kind: 'bird',
    lookFor:
      'Enormous facial disk with concentric gray rings, no ear tufts, and small yellow eyes visible at a distance. Much larger than a robin, with overall gray, mottled plumage.',
    whereWhen:
      'Meadow edges and coniferous forest at mid to upper elevations, most reliably around Yosemite Valley, Wawona, and Crane Flat. Extremely rare: Yosemite is a stronghold for a small, genetically distinct Sierra Nevada population. More often seen hunting in daylight during winter, when energy demands push it to hunt during the day as well as at night.',
    note:
      'Despite being one of the tallest owls in North America, it weighs less than the great horned owl, insulated by dense, fluffy plumage that traps heat.',
  },
  {
    id: 'clarks-nutcracker',
    name: 'Clark\'s nutcracker',
    latin: 'Nucifraga columbiana',
    kind: 'bird',
    lookFor:
      'Light gray body with contrasting black wings and white wing patches visible both perched and in flight. Jay-sized, stocky build with a harsh, loud call.',
    whereWhen:
      'High-elevation whitebark and lodgepole pine forests throughout Yosemite, year-round, especially conspicuous in late summer through fall when caching seeds.',
    note:
      'Caches thousands of pine seeds each fall and remembers their locations through winter. Unretrieved seeds germinate, contributing to reforesting the high country.',
  },
  {
    id: 'mountain-chickadee',
    name: 'Mountain chickadee',
    latin: 'Poecile gambeli',
    kind: 'bird',
    lookFor:
      'Gray back, white cheeks, black cap and bib, and a thin white eyebrow line above the eye, the field mark that separates it from the black-capped chickadee. Small, compact, and acrobatic.',
    whereWhen:
      'Coniferous forests from lower elevations to timberline throughout Yosemite, year-round resident.',
    note:
      'In Sierra winters, lowers its body temperature at night into a controlled torpor to conserve energy, an adaptation shared with other chickadee species for surviving cold nights.',
  },
  {
    id: 'western-tanager',
    name: 'Western tanager',
    latin: 'Piranga ludoviciana',
    kind: 'bird',
    lookFor:
      'Males bright yellow with a black back, black wings, and a red face. Females duller yellow-green with darker wings. Medium-sized songbird.',
    whereWhen:
      'Open coniferous and mixed forests throughout Yosemite. Summer breeder, arriving in April or May and departing by September.',
    note:
      'Unlike most tanagers, hunts flying insects on the wing like a flycatcher, and gathers at swarms of flying ants to feed.',
  },
  {
    id: 'red-tailed-hawk',
    name: 'Red-tailed hawk',
    latin: 'Buteo jamaicensis',
    kind: 'bird',
    lookFor:
      'Brown body with a rust-red tail visible when perched or soaring. Medium-sized hawk with a pale breast and a band of dark streaking across the belly.',
    whereWhen:
      'Open meadows, cliff edges, and grasslands throughout Yosemite, year-round. Hunts from dead snags and by soaring on thermals.',
    note:
      'Often perches on prominent dead snags overlooking open ground, dropping suddenly onto rodents or rabbits passing below.',
  },
  {
    id: 'giant-sequoia',
    name: 'Giant sequoia',
    latin: 'Sequoiadendron giganteum',
    kind: 'tree',
    lookFor:
      'The massive diameter (the largest trunks exceed 20 feet across at the base), reddish-brown fibrous bark, and small awl-shaped needles that spiral tightly around the branchlets identify the world\'s largest tree by volume.',
    whereWhen:
      'All three of the park\'s groves, 5,500 to 7,000 feet: the Mariposa Grove near the south entrance is the biggest and busiest, the Tuolumne and Merced groves near Crane Flat the quiet ones.',
    note:
      'The largest tree species by volume on earth, with some individual specimens exceeding 50,000 cubic feet of wood.',
  },
  {
    id: 'ponderosa-pine',
    name: 'Ponderosa pine',
    latin: 'Pinus ponderosa',
    kind: 'tree',
    lookFor:
      'Puzzle-piece bark in yellow, orange, and brown patches, long needles in bundles of three, and large cones with sharp prickles that point outward (the reverse of Jeffrey pine\'s gentler, inward-curving prickles). The warm bark smells like vanilla or turpentine.',
    whereWhen:
      'Valley floors and mid-elevation forests throughout Yosemite, 2,000 to 6,000 feet, on well-drained slopes.',
    note:
      'The ponderosa\'s thick insulating bark evolved to withstand the low-intensity fires that once swept through Sierra forests every 10 to 20 years.',
  },
  {
    id: 'incense-cedar',
    name: 'Incense-cedar',
    latin: 'Calocedrus decurrens',
    kind: 'tree',
    lookFor:
      'Feathery, flat-sprayed foliage resembling fern fronds, reddish-brown bark peeling in long vertical strips, and small cones shaped like a duck\'s bill when open.',
    whereWhen:
      'Mixed conifer forests throughout Yosemite, 3,000 to 7,000 feet, often alongside ponderosa and sugar pines.',
    note:
      'Despite cedar in its name, incense-cedar is a cypress, and the wood is aromatic.',
  },
  {
    id: 'california-black-oak',
    name: 'California black oak',
    latin: 'Quercus kelloggii',
    kind: 'tree',
    lookFor:
      'Deeply lobed leaves larger than any conifer needle, blackish bark furrowed into small blocks, and acorns roughly an inch long in shallow cups.',
    whereWhen:
      'Mid-elevation open forests and oak woodlands, 2,000 to 6,000 feet in the valley and foothills, turning gold to rust brown in autumn.',
    note:
      'California tribes harvested acorns as a staple carbohydrate, grinding them into flour after processing to remove tannins.',
  },
  {
    id: 'lodgepole-pine',
    name: 'Lodgepole pine',
    latin: 'Pinus contorta',
    kind: 'tree',
    lookFor:
      'Dense branching from base to crown forming a narrow columnar shape, short needles in tight pairs, and small cones that often persist on branches after opening.',
    whereWhen:
      'Middle- to high-elevation forests, 6,000 to 9,500 feet, forming dense stands in Tuolumne Meadows and the high country.',
    note:
      'Unlike the Rocky Mountain lodgepole pine, the Sierra Nevada variety\'s cones open at maturity rather than staying sealed by fire heat, but the tree\'s shade tolerance and fast growth still let it recolonize burned or disturbed ground quickly.',
  },
  {
    id: 'quaking-aspen',
    name: 'Quaking aspen',
    latin: 'Populus tremuloides',
    kind: 'tree',
    lookFor:
      'Smooth pale bark, round leaves on distinctly flattened petioles that quiver constantly in the breeze (a behavior that gives the tree its name), turning golden or orange in autumn.',
    whereWhen:
      'Mountain meadows and moist streamsides, 6,000 to 9,000 feet, particularly around Tuolumne Meadows and the high country, from late spring through fall.',
    note:
      'Aspen groves spread by root suckers, so a single grove is often one genetically identical clone, and the species includes some of the largest known clonal organisms on earth by biomass.',
  },
  {
    id: 'pacific-dogwood',
    name: 'Pacific dogwood',
    latin: 'Cornus nuttallii',
    kind: 'tree',
    lookFor:
      'Large white bracts surrounding tiny flowers, opposite oval leaves with curved parallel veins, bright red berries in fall, and smooth gray bark.',
    whereWhen:
      'Moist shaded mixed-conifer forests and meadow edges, 3,000 to 6,000 feet, blooming in spring and early summer.',
    note:
      'The provincial flower of British Columbia, and it often reflowers lightly in autumn.',
  },
  {
    id: 'jeffrey-pine',
    name: 'Jeffrey pine',
    latin: 'Pinus jeffreyi',
    kind: 'tree',
    lookFor:
      'Long needles in bundles of three, large cones with prickles that curve inward and feel smooth in the hand (ponderosa\'s point outward and prick), bark more uniformly reddish-brown than ponderosa\'s, and a vanilla or pineapple scent when the bark is scratched.',
    whereWhen:
      'Upper-elevation forests, 6,000 to 9,000 feet, favoring drier slopes and the eastern Sierra.',
    note:
      'Jeffrey pine replaces ponderosa on the drier east side of the Sierra crest, thriving where ponderosa would struggle.',
  },
  {
    id: 'northern-pacific-rattlesnake',
    name: 'Northern Pacific rattlesnake',
    latin: 'Crotalus oreganus',
    kind: 'other',
    lookFor:
      'Heavy-bodied snake with a broad triangular head, dark blotches down a gray-brown or olive back, and a segmented rattle at the tail tip. Young snakes carry a single small button and can rattle only faintly.',
    whereWhen:
      'Sunny, rocky slopes and talus below about 8,000 feet: the Hetch Hetchy trails, the canyon around Poopenaut Valley, and dry south-facing slopes park-wide. Most active in warm months, mornings and evenings in high summer.',
    note:
      'The park\'s only venomous snake, and a shy one: it rattles to avoid a confrontation, not to start it. The gopher snake, which is common here, mimics the look and even vibrates its tail in dry leaves, so a quiet snake is not automatically a safe one.',
    safety:
      'Give any rattlesnake at least a body length of room and walk around it; never handle one, living or dead. Watch where hands and feet land on rocky trails, keep children close in talus, and if a bite happens keep the limb still and get to medical care. Do not cut, suck, or ice a bite.',
  },
  {
    id: 'western-fence-lizard',
    name: 'Western fence lizard',
    latin: 'Sceloporus occidentalis',
    kind: 'other',
    lookFor:
      'Gray or tan lizard smaller than your hand, with spiny, keeled scales down the back. Males show bright blue patches on the throat and belly, most visible when the lizard does a push-up display on a rock or log; the flash of blue during the display is the field mark.',
    whereWhen:
      'Sun-warmed rocks, logs, fence posts, and tree bark from the Valley floor up into mixed-conifer forest, less common at higher, colder elevations. Active on warm, sunny days; inactive in cold weather.',
    note:
      'Only males carry the vivid blue throat and belly patches, flashed during push-up displays at rival males; females show little or no blue.',
  },
  {
    id: 'pacific-chorus-frog',
    name: 'Pacific chorus frog',
    latin: 'Pseudacris regilla',
    kind: 'other',
    lookFor:
      'Thumb-sized frog with a dark stripe running through each eye and small round toe pads on slender legs. Color ranges from tan to green to brown and can shift with temperature and humidity.',
    whereWhen:
      'Meadows, marshes, and seeps throughout Yosemite, from Valley wetlands to high-country tarns. Most vocal in late winter and spring, when males call from the water\'s edge at dusk and after dark.',
    note:
      'This is the species behind the two-part \'ribbit\' call used as the stock movie and TV frog sound, dubbed in regardless of the on-screen setting.',
  },
  {
    id: 'sierra-newt',
    name: 'Sierra newt',
    latin: 'Taricha sierrae',
    kind: 'other',
    lookFor:
      'Hand-length salamander with rough, warty brown or olive skin above and an orange to red belly that contrasts sharply with the dark back.',
    whereWhen:
      'Streams, ponds, and wet seeps at low to middle elevations on Yosemite\'s western slope, including the Valley and foothill areas. Most visible during and after rains, from fall through spring, when adults migrate to breeding water.',
    note:
      'The bright belly is a warning signal: the skin contains tetrodotoxin, the same toxin found in pufferfish.',
  },
]

export const WILDLIFE: WildlifeEntryT[] = z.array(WildlifeEntry).parse(seed)

{
  const ids = new Set<string>()
  for (const entry of WILDLIFE) {
    if (ids.has(entry.id)) throw new Error(`wildlife: duplicate id '${entry.id}'`)
    ids.add(entry.id)
  }
}

export function getWildlifeByKind(kind: WildlifeKindT): WildlifeEntryT[] {
  return WILDLIFE.filter((w) => w.kind === kind)
}
