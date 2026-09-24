// =============================================================================
// DRIVE TIMES: the park's own published driving times, laid out as the road
// network they describe.
//
// Source: nps.gov/yose/planyourvisit/driving.htm, "Driving Times Within and
// Near Yosemite" and the "More Driving Times" table under it (page last
// updated January 8, 2026; read September 24, 2026). Every `minutes` below is
// the park's figure from Yosemite Valley, as printed, and the park's caveat
// travels with it: "Times are approximate, assume good conditions, and no
// stops." No figure in this file comes from memory or a maps app. Re-check the
// page on each Yosemite Guide edition turn, the way dining hours and the Help
// card's numbers are re-checked.
//
// Why a tree. Inside the park the roads branch and never rejoin: three spokes
// leave the Valley's west end (El Portal Road, Big Oak Flat Road, Wawona
// Road), Tioga Road leaves Big Oak Flat Road at Crane Flat, Glacier Point Road
// leaves Wawona Road at Chinquapin, and Evergreen and Hetch Hetchy roads leave
// Big Oak Flat Road just outside its entrance. On a tree there is exactly one
// route between two points, so a drive between any two places the park lists
// is their two Valley times less twice the time to where their roads part:
// Glacier Point to the Mariposa Grove is (60 - 30) + (75 - 30) through
// Chinquapin. The trip board used to price that leg, and the Valley to Glacier
// Point, from straight-line distance, which put Glacier Point fifteen minutes
// above a Valley that the park says is an hour away by road.
//
// `at` names the guide entry whose coordinate stands for the point, so this
// file adds no coordinates of its own: `amenity:` ids are content/amenities.ts
// pins, `stop:` ids content/stops.ts, `hike:` ids content/hikes.ts, and
// `secret:` ids content/secret-spots.ts. Branch points with no published
// place of their own carry no `at` and are never an anchor.
// =============================================================================

export type DriveNodeId =
  | 'valley'
  | 'west-end'
  | 'bridalveil-fall'
  | 'tunnel-view'
  | 'chinquapin'
  | 'badger-pass'
  | 'bridalveil-creek'
  | 'glacier-point'
  | 'wawona'
  | 'south-entrance'
  | 'mariposa-grove'
  | 'arch-rock'
  | 'el-portal'
  | 'foresta'
  | 'crane-flat'
  | 'tuolumne-grove'
  | 'merced-grove'
  | 'big-oak-flat-entrance'
  | 'hetch-hetchy'
  | 'tamarack-flat'
  | 'white-wolf'
  | 'yosemite-creek-campground'
  | 'porcupine-flat'
  | 'may-lake'
  | 'tenaya-lake'
  | 'tuolumne-meadows'
  | 'tioga-pass'

export type DriveNode = {
  id: DriveNodeId
  // The row as the park prints it, so a re-check can find it on the page.
  row: string
  // Minutes from Yosemite Valley, as published.
  minutes: number
  // The next point toward the Valley on the same road; null only for the root.
  parent: DriveNodeId | null
  // The guide entry whose coordinate places this point (see header).
  at?: string
  // A point at the end of a side road claims only the entries standing at it.
  // May Lake's lot is two miles up a spur from Tioga Road, and nearest by
  // straight line it would otherwise claim Olmsted Point, which is on the
  // highway and ten minutes closer to the Valley.
  anchorWithinMi?: number
}

export const DRIVE_TIMES_SOURCE = {
  url: 'https://www.nps.gov/yose/planyourvisit/driving.htm',
  updated: 'January 8, 2026',
  checked: '2026-09-24',
}

export const DRIVE_NODES: DriveNode[] = [
  // The Valley itself: the park's reference point for every row below.
  { id: 'valley', row: 'Yosemite Valley', minutes: 0, parent: null, at: 'amenity:valley-welcome-center' },
  // Where the three spokes leave the Valley floor. The park prints the Big
  // Oak Flat and El Portal junction at 10 minutes and the Bridalveil Fall lot,
  // at the foot of Wawona Road, at the same 10; the two sit about a mile and a
  // half apart on the Valley's west end and are treated as one branch point.
  { id: 'west-end', row: 'Big Oak Flat/El Portal Roads junction', minutes: 10, parent: 'valley' },

  // Wawona Road (Highway 41) and Glacier Point Road.
  { id: 'bridalveil-fall', row: 'Bridalveil Fall parking', minutes: 10, parent: 'west-end', at: 'stop:bridalveil-fall' },
  { id: 'tunnel-view', row: 'Tunnel View', minutes: 15, parent: 'bridalveil-fall', at: 'stop:tunnel-view' },
  { id: 'chinquapin', row: 'Chinquapin', minutes: 30, parent: 'tunnel-view', at: 'stop:glacier-point-road-drive' },
  { id: 'badger-pass', row: 'Badger Pass', minutes: 45, parent: 'chinquapin', at: 'amenity:badger-pass' },
  { id: 'bridalveil-creek', row: 'Bridalveil Creek Campground', minutes: 45, parent: 'badger-pass', at: 'amenity:bridalveil-creek-campground' },
  { id: 'glacier-point', row: 'Glacier Point', minutes: 60, parent: 'bridalveil-creek', at: 'stop:glacier-point' },
  { id: 'wawona', row: 'Wawona', minutes: 45, parent: 'chinquapin', at: 'amenity:wawona-visitor-center' },
  { id: 'south-entrance', row: 'South Entrance', minutes: 60, parent: 'wawona', at: 'amenity:south-entrance' },
  { id: 'mariposa-grove', row: 'Mariposa Grove', minutes: 75, parent: 'south-entrance', at: 'amenity:grizzly-giant' },

  // El Portal Road (Highway 140).
  { id: 'arch-rock', row: 'Arch Rock Entrance Station', minutes: 20, parent: 'west-end', at: 'amenity:arch-rock-entrance' },
  { id: 'el-portal', row: 'El Portal', minutes: 30, parent: 'arch-rock', at: 'amenity:el-portal-gas' },

  // Big Oak Flat Road (Highway 120 west), Hetch Hetchy, and Tioga Road.
  { id: 'foresta', row: 'Foresta', minutes: 25, parent: 'west-end', at: 'secret:foresta-barns-loop' },
  { id: 'crane-flat', row: 'Crane Flat', minutes: 30, parent: 'west-end', at: 'amenity:crane-flat-gas' },
  { id: 'tuolumne-grove', row: 'Tuolumne Grove', minutes: 30, parent: 'crane-flat', at: 'hike:tuolumne-grove' },
  { id: 'merced-grove', row: 'Merced Grove', minutes: 40, parent: 'crane-flat', at: 'stop:merced-grove' },
  { id: 'big-oak-flat-entrance', row: 'Big Oak Flat Entrance Station', minutes: 45, parent: 'merced-grove', at: 'amenity:big-oak-flat-entrance' },
  { id: 'hetch-hetchy', row: 'Hetch Hetchy parking', minutes: 75, parent: 'big-oak-flat-entrance', at: 'amenity:hetch-hetchy-dam-lot' },
  { id: 'tamarack-flat', row: 'Tamarack Flat Campground', minutes: 45, parent: 'crane-flat', at: 'amenity:tamarack-flat-campground', anchorWithinMi: 1 },
  { id: 'white-wolf', row: 'White Wolf', minutes: 60, parent: 'tamarack-flat', at: 'stop:white-wolf' },
  { id: 'yosemite-creek-campground', row: 'Yosemite Creek Campground', minutes: 75, parent: 'white-wolf', at: 'amenity:yosemite-creek-campground', anchorWithinMi: 1 },
  { id: 'porcupine-flat', row: 'Porcupine Flat Campground', minutes: 70, parent: 'white-wolf', at: 'amenity:porcupine-flat-campground' },
  { id: 'may-lake', row: 'May Lake parking', minutes: 80, parent: 'porcupine-flat', at: 'stop:may-lake', anchorWithinMi: 1 },
  { id: 'tenaya-lake', row: 'Tenaya Lake', minutes: 75, parent: 'porcupine-flat', at: 'stop:tenaya-lake' },
  { id: 'tuolumne-meadows', row: 'Tuolumne Meadows', minutes: 90, parent: 'tenaya-lake', at: 'amenity:tuolumne-meadows-visitor-center' },
  { id: 'tioga-pass', row: 'Tioga Pass', minutes: 105, parent: 'tuolumne-meadows', at: 'amenity:tioga-pass-entrance' },
]

// Which points an entry may anchor to, by the region it sits in. Anchoring is
// nearest point by straight line, and the region fence is what makes that
// safe: Glacier Point is a mile from the Valley floor as the raven flies and
// an hour away by road, so a Valley stop must never be able to pick it.
export const REGION_DRIVE_NODES: Record<'valley' | 'glacier-mariposa' | 'tuolumne' | 'hetch-hetchy', DriveNodeId[]> = {
  valley: ['valley', 'bridalveil-fall', 'tunnel-view'],
  'glacier-mariposa': ['chinquapin', 'badger-pass', 'bridalveil-creek', 'glacier-point', 'wawona', 'south-entrance', 'mariposa-grove'],
  tuolumne: ['crane-flat', 'tuolumne-grove', 'tamarack-flat', 'white-wolf', 'yosemite-creek-campground', 'porcupine-flat', 'may-lake', 'tenaya-lake', 'tuolumne-meadows', 'tioga-pass'],
  'hetch-hetchy': ['crane-flat', 'merced-grove', 'big-oak-flat-entrance', 'hetch-hetchy'],
}

// Secret spots carry no region, so each names its point by hand: the place a
// car stops for it. Union Point is a mile from Glacier Point and three hours
// from it on foot; the reader drives to the Valley's Four Mile trailhead, so
// it anchors to the Valley. A new secret spot with a coordinate fails
// driveTimes.test.ts until it is added here.
export const SECRET_SPOT_DRIVE_NODE: Record<string, DriveNodeId> = {
  'fern-spring': 'bridalveil-fall',
  'happy-isles-ouzel-watch': 'valley',
  'el-cap-meadow-after-dark': 'valley',
  'olmsted-point-at-night': 'tenaya-lake',
  'tuolumne-grove-old-road': 'tuolumne-grove',
  'pothole-dome-sunset': 'tuolumne-meadows',
  'cathedral-beach-quiet-picnic': 'valley',
  'sentinel-beach-parking': 'valley',
  'el-cap-crossover-parking': 'valley',
  'sentinel-dome-overflow': 'glacier-point',
  'foresta-barns-loop': 'foresta',
  'foresta-forest-service-camping': 'foresta',
  'little-nellie-falls': 'foresta',
  'inspiration-point': 'tunnel-view',
  'hidden-lake': 'tenaya-lake',
  'swinging-bridge-reflection': 'valley',
  'siesta-lake': 'white-wolf',
  'wawona-point': 'mariposa-grove',
  'union-point': 'valley',
  bennettville: 'tioga-pass',
  'valley-trailhead-parking': 'valley',
  'tenaya-lake-lots': 'tenaya-lake',
  'yosemite-creek-campground': 'yosemite-creek-campground',
  'tioga-lake-campground': 'tioga-pass',
  'summerdale-campground': 'south-entrance',
  'yosemite-falls-moonbow': 'valley',
  'glacier-point-star-party': 'glacier-point',
  'great-gray-owl-dusk': 'crane-flat',
}
