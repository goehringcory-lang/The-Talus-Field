// =============================================================================
// The entries companion mode is not allowed to announce.
//
// The content files mark a coordinate's provenance in a comment on its own
// line (`// TODO: verify on the ground`, `// TODO verify`, `// TODO: verify (`):
// a pullout nobody has stood at, a feature no source pins, a user-supplied
// reading. That is the right place for the mark, because the coordinate's
// story belongs next to the coordinate, but a comment does not survive
// compilation, so nothing at runtime can read it. This file is the runtime
// mirror: the ids whose coord line carries the mark, by collection, and the
// test beside it (unverified.test.ts) parses the three seed files and fails
// the moment the two disagree. Add an id here when you add the mark there,
// and remove it only with the mark, which means only after a real field visit.
//
// Why it matters here and nowhere else: the map draws an unverified pin and
// the reader compares it with the ground; the compass points at one and the
// reader walks the last stretch by eye. Companion mode announces "you are at
// Ribbon Fall" as the car passes the wrong pullout, and the passenger has no
// way to know. So the rule is skip, never caveat: an unverified entry is not
// in the companion's catalog at all.
//
// A hike's status follows its pin: a hike is verified only when its coord
// line carries no mark AND its coordinate is exactly a verified stop's, which
// is what "same pin as stop X" in hikes.ts means. Every hike without a stop
// link is a web-derived trailhead approximation (hikes.ts header) and stays
// here until ground-truthed, so today no stop-less hike reaches the screen;
// the mechanism is in place for the day one does.
// =============================================================================

/** Core and hidden stops (stops.ts) plus secret spots (secret-spots.ts). */
export const UNVERIFIED_STOP_IDS: ReadonlySet<string> = new Set([
  'lower-yosemite-fall',
  'valley-view',
  'old-big-oak-flat-road',
  'old-road-trailhead-pullout',
  'rainbow-view-old-road',
  'ribbon-fall-base',
  'camp-4',
  'yosemite-village',
  'artist-point',
  'three-chutes-falls',
  'glacier-point-road-drive',
  'mariposa-grove',
  'wawona-hotel-history-center',
  'bridalveil-creek-trail',
  'wawona-meadow-loop',
  'crane-flat-meadow',
  'white-wolf',
  'tuolumne-meadows-grill',
  'north-dome-indian-rock',
  'carlon-falls',
  'evergreen-lodge',
  'poopenaut-valley',
  'rainbow-pool',
  'happy-isles-ouzel-watch',
  'cathedral-beach-quiet-picnic',
  'sentinel-beach-parking',
  'sentinel-dome-overflow',
  'foresta-barns-loop',
  'foresta-forest-service-camping',
  'little-nellie-falls',
  'inspiration-point',
  'hidden-lake',
])

/** Day hikes (hikes.ts). Ids can coincide with stop ids, hence two sets. */
export const UNVERIFIED_HIKE_IDS: ReadonlySet<string> = new Set([
  'lower-yosemite-fall',
  'valley-loop-trail',
  'artist-point',
  'columbia-rock',
  'upper-yosemite-fall',
  'eagle-peak',
  'mono-meadow',
  'wawona-meadow-loop',
  'wawona-swinging-bridge',
  'grizzly-giant-loop',
  'mariposa-grove-guardians-loop',
  'tuolumne-grove',
  'lukens-lake',
  'harden-lake',
  'north-dome',
  'pothole-dome',
  'elizabeth-lake',
  'mount-dana',
  'poopenaut-valley',
  'carlon-falls',
])

/** The marker as the content files write it; the test uses the same pattern. */
export const UNVERIFIED_MARK = /TODO:?\s*verify/i
