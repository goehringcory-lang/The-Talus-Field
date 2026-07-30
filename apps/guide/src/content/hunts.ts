// =============================================================================
// JUNIOR NATURALIST HUNTS — one find-it list per region, for the kid in the
// back seat. These are deliberately NOT a new state system: every item is a
// checklist item in the same shape as EssentialTopic.checklist, so it rides
// the shared tfg.checklist id→checked map and ChecklistBlock renders it
// unchanged. Ids are prefixed `hunt-<region>-` to satisfy the global-id rule
// in content/schema.ts.
//
// Two content rules. Every item must be findable by a child without leaving
// the paved or well-worn path a family is already on, which is why the items
// lean on things the guide's own stop prose already promises (a dipper at
// Happy Isles, acorn granaries on a black oak, glacial polish at Olmsted).
// And nothing asks a child to touch, collect, feed, or approach anything: the
// hunt is looking, which is also the park rule.
//
// Facts behind the items come from the guide's existing stop, hike, and
// wildlife content. Anything a child could not plausibly spot in one visit
// belongs in the wildlife guide, not here.
// =============================================================================

import { z } from 'zod'
import { RegionEnum } from './schema'

export const HuntItem = z.object({
  id: z.string().regex(/^hunt-[a-z-]+-[a-z0-9-]+$/),
  label: z.string(),
  note: z.string().optional(),
  group: z.string().optional(),
})
export type HuntItemT = z.infer<typeof HuntItem>

export const Hunt = z.object({
  region: RegionEnum,
  title: z.string(),
  intro: z.string(),
  items: z.array(HuntItem).min(4),
})
export type HuntT = z.infer<typeof Hunt>

const seed: HuntT[] = [
  {
    region: 'valley',
    title: 'In the Valley',
    intro:
      'The Valley holds water, rock, and life to find on every path you walk.',
    items: [
      {
        id: 'hunt-valley-yosemite-falls-mist',
        label:
          'A waterfall wrapped in its own cloud of mist',
        note:
          'The falling water breaks into spray that rises like fog, thickest in May and June when snowmelt peaks.',
      },
      {
        id: 'hunt-valley-mule-deer-meadow',
        label:
          'A large gray deer with big ears grazing in an open meadow',
        note:
          'Look early in the morning or at dusk, when mule deer come out to graze the valley\'s open meadows.',
      },
      {
        id: 'hunt-valley-ponderosa-puzzle',
        label:
          'A giant pine whose bark looks like golden puzzle pieces',
        note:
          'Only ponderosa pine has this puzzle-piece bark, and on a warm day it carries a faint vanilla scent.',
      },
      {
        id: 'hunt-valley-stellars-jay',
        label:
          'A bright blue bird with a spiky crown on its head',
        note:
          'Steller\'s jays are loud, bold, and often perch nearby watching for a dropped snack.',
      },
      {
        id: 'hunt-valley-mirror-lake-reflection',
        label:
          'A lake so still it looks like a mirror and reflects the cliffs and sky perfectly',
        note:
          'Go on a spring morning before the breeze picks up; by late summer the lake shrinks to meadow and the reflection is gone.',
      },
      {
        id: 'hunt-valley-el-capitan-climbers',
        label:
          'Tiny climbers clinging to the sheer granite face of El Capitan',
        note:
          'Pull off at El Capitan Meadow and look up: climbing parties spend days on the wall, so binoculars help you spot them.',
      },
      {
        id: 'hunt-valley-acorn-storage',
        label:
          'An old oak tree covered in thousands of small holes, each one holding an acorn',
        note:
          'Acorn woodpeckers drill these granary holes in valley black oaks, and a single tree can hold tens of thousands of acorns.',
      },
      {
        id: 'hunt-valley-river-beach-sand',
        label:
          'A beach of pale granite sand and smooth pebbles along the river\'s edge',
        note:
          'Thousands of years of the Merced tumbling granite fragments have worn the pebbles pale and smooth.',
      },
    ],
  },
  {
    region: 'glacier-mariposa',
    title: 'Granite Peaks and Groves',
    intro:
      'Look for giant trees, granite cracks, and forest secrets in this high region where stone and forest meet.',
    items: [
      {
        id: 'hunt-glacier-mariposa-giant-sequoia',
        label:
          'A tree so wide you can\'t wrap your arms around it',
        note:
          'Giant sequoias grow naturally only in a narrow band of the western Sierra Nevada, and the oldest known trees are more than 3,000 years old.',
      },
      {
        id: 'hunt-glacier-mariposa-taft-point-fissures',
        label:
          'Cracks in solid granite you can see through',
        note:
          'At Taft Point, these joints in the granite have been widened by frost and weathering over thousands of years.',
      },
      {
        id: 'hunt-glacier-mariposa-tunnel-tree',
        label:
          'A living tree with a tunnel cut through it that you can walk inside',
        note:
          'The California Tunnel Tree stands just past the Grizzly Giant on the Mariposa Grove loop.',
      },
      {
        id: 'hunt-glacier-mariposa-manzanita-bark',
        label:
          'A shrub with bark peeling away in red and tan strips',
        note:
          'As manzanita sheds its old bark, smooth red bark is revealed underneath.',
      },
      {
        id: 'hunt-glacier-mariposa-sentinel-dome',
        label:
          'A dome of bare granite rising above the surrounding trees',
        note:
          'Sentinel Dome\'s bare granite summit is reached from a trailhead near mile 13 of Glacier Point Road.',
      },
      {
        id: 'hunt-glacier-mariposa-meadow-wildflowers',
        label:
          'Wildflowers scattered across an open meadow like paint splashes',
        note:
          'McGurk Meadow\'s wildflowers bloom in early summer, just after the snow melts.',
      },
      {
        id: 'hunt-glacier-mariposa-mica-sparkles',
        label:
          'Flecks of crystal that sparkle in the gray granite',
        note:
          'Granite contains mica, a mineral that breaks into thin sheets and catches the light.',
      },
      {
        id: 'hunt-glacier-mariposa-fire-scar',
        label:
          'A tree with a dark scar running up its trunk from the ground',
        note:
          'A sequoia\'s thick bark protects it from fire, and the black scar left behind is part of the tree\'s health record, not damage.',
      },
    ],
  },
  {
    region: 'tuolumne',
    title: 'High Country Finds',
    intro:
      'The high meadows and granite peaks of Tuolumne hold surprises for those who look carefully: ancient glacial marks, hardy alpine plants, and the wildlife that thrives at 8,600 feet.',
    items: [
      {
        id: 'hunt-tuolumne-glacial-polish',
        label:
          'Smooth granite that shines like glass',
        note:
          'Glaciers slid over this rock for thousands of years, polishing it smooth at Olmsted Point and along Tenaya Lake\'s south shore.',
      },
      {
        id: 'hunt-tuolumne-erratic-boulder',
        label:
          'A giant boulder resting on bare granite',
        note:
          'Glaciers carried these boulders from elsewhere in the Sierra and left them scattered across the open rock at Olmsted Point when the ice melted.',
      },
      {
        id: 'hunt-tuolumne-marmots',
        label:
          'A brown, furry animal about the size of a house cat, sunning on a rock',
        note:
          'Yellow-bellied marmots are common on the granite around Tuolumne Meadows, especially in early morning and late afternoon.',
      },
      {
        id: 'hunt-tuolumne-nutcracker',
        label:
          'A gray bird with black wings and white wing patches, working the pines',
        note:
          'Clark\'s nutcracker caches thousands of pine seeds each fall and remembers where it put them.',
      },
      {
        id: 'hunt-tuolumne-lodgepole-pines',
        label:
          'Thin, straight pine trees growing close together',
        note:
          'Lodgepole pines get their name from their arrow-straight trunks, once used across the West to build lodges and tipis.',
      },
      {
        id: 'hunt-tuolumne-wildflowers',
        label:
          'Bright pink, yellow, or white flowers among the meadow grass',
        note:
          'Peak wildflower season in the Tuolumne high country runs from July into August.',
      },
      {
        id: 'hunt-tuolumne-soda-springs',
        label:
          'A spring where water bubbles up from underground',
        note:
          'This natural spring bubbles up from the meadow, carbonated by dissolved minerals in the rock below.',
      },
      {
        id: 'hunt-tuolumne-tenaya-reflection',
        label:
          'See the mountains mirrored in Tenaya Lake\'s still water',
        note:
          'On calm mornings, Tenaya Lake reflects Polly Dome and the granite peaks around it like a mirror.',
      },
    ],
  },
  {
    region: 'hetch-hetchy',
    title: 'Around the Reservoir',
    intro:
      'Discover waterfalls, giant sequoias, and granite domes in the Hetch Hetchy region.',
    items: [
      {
        id: 'hunt-hetch-hetchy-tueeulala-falls',
        label:
          'A thin, wispy waterfall streaking down a granite wall, gone by midsummer',
        note:
          'Watch for this delicate waterfall along the Wapama Falls trail in May and June, before it dries up for the year.',
      },
      {
        id: 'hunt-hetch-hetchy-carlon-falls',
        label:
          'A waterfall that falls into a clear pool',
        note:
          'A nearly flat trail just under four miles round trip follows the river to the base of this year-round waterfall.',
      },
      {
        id: 'hunt-hetch-hetchy-massive-dam',
        label:
          'A giant concrete wall built to hold back a lake',
        note:
          'This dam holds back the reservoir and was completed in 1923, then raised further in 1938.',
      },
      {
        id: 'hunt-hetch-hetchy-kolana-rock',
        label:
          'A tall, pointed granite dome rising straight across the water',
        note:
          'Look east from the middle of the dam walk to see this granite dome standing above the south shore of the reservoir.',
      },
      {
        id: 'hunt-hetch-hetchy-dam-seam',
        label:
          'A line across the face of the dam where two different pours meet',
        note:
          'The dam went up in 1923 and was raised in 1938, and the seam between the two is visible from the upstream side.',
      },
      {
        id: 'hunt-hetch-hetchy-cliff-tunnel',
        label:
          'A tunnel cut by hand straight through a granite cliff',
        note:
          'The quarter-mile walk across the dam is flat and paved, and it ends at this tunnel in the far wall.',
      },
      {
        id: 'hunt-hetch-hetchy-puzzle-bark',
        label:
          'A tall tree with bark that looks like a jigsaw puzzle',
        note:
          'Along the Carlon Falls trail, ponderosa pines have puzzle-piece bark that smells faintly of vanilla on a warm day.',
      },
      {
        id: 'hunt-hetch-hetchy-ancient-giant',
        label:
          'A tree so enormous it takes several people holding hands to circle it',
        note:
          'The giant sequoias at Merced Grove can live thousands of years, so some were already ancient when your great-grandparents were born.',
      },
    ],
  },
]

export const HUNTS: HuntT[] = z.array(Hunt).parse(seed)

// Global-uniqueness check across every hunt, because the check-off map is one
// flat namespace shared with the packing and night-before lists.
{
  const ids = new Set<string>()
  for (const hunt of HUNTS) {
    for (const item of hunt.items) {
      if (ids.has(item.id)) throw new Error(`hunts: duplicate item id '${item.id}'`)
      ids.add(item.id)
    }
  }
}

export function getHuntByRegion(region: string): HuntT | undefined {
  return HUNTS.find((h) => h.region === region)
}

export function allHuntItemIds(): string[] {
  return HUNTS.flatMap((h) => h.items.map((i) => i.id))
}
