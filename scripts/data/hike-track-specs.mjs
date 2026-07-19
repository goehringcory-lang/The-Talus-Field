// =============================================================================
// Routing specs for scripts/gen-hike-tracks.mjs — one entry per hike in
// apps/guide/src/content/hikes.ts.
//
// A spec steers the router across the USGS/NPS trail network; it is NOT the
// track itself. The geometry always comes from the USGS National Map
// Transportation layer (NPS source data), so a coordinate here only needs to
// be close enough to snap to the right trail node (snap distances are
// reported and bounded). `start`/`via`/`end` are [lng, lat].
//
//   start  walking start (defaults to the hike's coord in hikes.ts; override
//          when parking and the walk start differ, e.g. Mariposa Grove).
//   via    ordered waypoints the route must pass through, used to force the
//          correct branch at junctions and the correct direction around loops.
//   end    walking end. Omitted for out-and-back (the stored line is the
//          outbound leg; the app mirrors it) and for loops (end = start).
//   maxSnapM       per-point snap ceiling in meters (default 120). A few
//                  destination coords sit on summits/overlooks a bit off the
//                  mapped trail end; the ceiling keeps a bad snap from
//                  silently routing somewhere else.
//   skip           hike has no mappable track; value is the reason string,
//                  shown in the report. No track file is emitted.
//   note           provenance/context for the report.
//
// Destination coords marked "stop pin" reuse verified pins from
// apps/guide/src/content/stops.ts. Others were placed on the target feature
// at map scale; the published-distance validation in the generator is the
// backstop that a wrong coord cannot pass.
// =============================================================================

export const HIKE_TRACK_SPECS = {
  // --- Yosemite Valley ------------------------------------------------------
  'lower-yosemite-fall': {
    // Loop through the base-of-fall footbridge, back down the west leg.
    via: [
      [-119.5931, 37.7493], // east leg of the loop
      [-119.5958, 37.7498], // base footbridge
    ],
    end: 'start',
    maxSnapM: 200,
  },
  'cooks-meadow': {
    // Sentinel Bridge lot, counterclockwise around the meadow boardwalk.
    via: [
      [-119.5915, 37.7452], // meadow-floor viewing ground (stop pin valley-ephemeral-falls)
      [-119.5945, 37.7459], // NW corner near Lower Yosemite Fall crosswalk
    ],
    end: 'start',
  },
  'bridalveil-fall': {
    via: [[-119.6486, 37.7178]], // viewing terrace at the base
  },
  'mirror-lake': {
    // Paved lane from shuttle stop 17 to the lake's south beach.
    via: [[-119.5497, 37.7488]],
  },
  'valley-loop-trail': {
    // Full loop, counterclockwise: west on the north side, around Pohono
    // Bridge, back east on the south side.
    via: [
      [-119.6446, 37.7254], // El Capitan Meadow, north side
      [-119.6661, 37.7167], // Pohono Bridge west turnaround
      [-119.6472, 37.7206], // south side near Bridalveil
      [-119.6020, 37.7339], // Four Mile trailhead stretch, Southside Dr
    ],
    end: 'start',
    maxSnapM: 300,
  },
  'artist-point': {
    skip: 'The direct connector from the Tunnel View lot to the old stagecoach grade is not in the USGS linework; the mapped detour via the Pohono junction runs well over the published 2-mile route, so no track can be verified.',
  },
  'inspiration-point': {
    start: [-119.6773, 37.7156], // Tunnel View lot (stop pin)
    via: [[-119.6880, 37.7120]], // old Inspiration Point clearing on the Pohono Trail
    maxSnapM: 250,
  },
  'columbia-rock': {
    via: [[-119.6021, 37.7455]], // railed Columbia Rock perch on the switchbacks
    maxSnapM: 250,
  },
  'vernal-fall-mist-trail': {
    via: [[-119.5437, 37.7274]], // brink of Vernal Fall
    maxSnapM: 200,
  },
  'nevada-fall': {
    // Lollipop: up the Mist Trail, down the John Muir Trail via Clark Point.
    via: [
      [-119.5437, 37.7274], // Vernal brink (Mist Trail up)
      [-119.5304, 37.7262], // top of the Mist Trail at the JMT junction
      [-119.5330, 37.7249], // Nevada Fall brink
      [-119.5480, 37.7267], // Clark Point (JMT down)
    ],
    end: 'start',
    maxSnapM: 200,
  },
  'upper-yosemite-fall': {
    via: [
      [-119.6021, 37.7455], // Columbia Rock
      [-119.5991, 37.7597], // top of the switchbacks at the rim junction
    ],
    maxSnapM: 300,
    note: 'The stored line ends at the rim junction; the short spur to the railed overlook at the brink is not in the USGS linework.',
  },
  'four-mile-trail': {
    start: [-119.6011, 37.7331], // trail's foot on Southside Drive
    end: [-119.5731, 37.7283], // Glacier Point (stop pin)
    maxSnapM: 150,
  },
  'half-dome': {
    // Mist Trail up, per the published 14.2 mi round trip.
    via: [
      [-119.5437, 37.7274], // Vernal brink
      [-119.5304, 37.7262], // Mist/JMT junction above Nevada Fall
      [-119.5165, 37.7328], // Little Yosemite Valley
      [-119.5333, 37.7454], // end of the mapped trail below the cables
    ],
    maxSnapM: 100,
    note: 'The mapped trail ends below the cable route; the cables and summit plateau are bare granite with no built trail.',
  },
  'eagle-peak': {
    via: [
      [-119.6021, 37.7455], // Columbia Rock
      [-119.5991, 37.7597], // rim junction at the top of the switchbacks
      [-119.6149, 37.7458], // Eagle Peak summit (stop pin)
    ],
    maxSnapM: 300,
  },
  'snow-creek-trail': {
    via: [
      [-119.5497, 37.7488], // Mirror Lake
      [-119.5375, 37.7560], // Snow Creek footbridge junction (stop pin)
      [-119.5395, 37.7685], // rim viewpoint across from Half Dome
    ],
    maxSnapM: 300,
  },

  // --- Glacier Point & Mariposa Grove --------------------------------------
  'mcgurk-meadow': {
    via: [[-119.6230, 37.6793]], // meadow edge by the collapsing cabin
    maxSnapM: 300,
  },
  'dewey-point': {
    skip: 'The USGS linework for the western Pohono Trail runs well south of the rim and never reaches Dewey Point, so no track can be verified against the published route.',
  },
  'taft-point': {
    via: [[-119.6055, 37.7127]], // Taft Point railing-free ledge
    maxSnapM: 250,
  },
  'sentinel-dome': {
    via: [[-119.5842, 37.7233]], // Sentinel Dome summit (stop pin)
    maxSnapM: 250,
  },
  'sentinel-taft-loop': {
    // Counterclockwise: Taft first, north on the Pohono Trail past Sentinel
    // Creek, then Sentinel Dome and back to the shared lot.
    via: [
      [-119.6055, 37.7127], // Taft Point
      [-119.5960, 37.7208], // Pohono Trail rim stretch
      [-119.5842, 37.7233], // Sentinel Dome summit
    ],
    end: 'start',
    maxSnapM: 250,
  },
  'illilouette-fall': {
    via: [[-119.5605, 37.7122]], // Panorama Trail footbridge above the fall
    maxSnapM: 200,
  },
  'panorama-trail': {
    via: [
      [-119.5605, 37.7122], // Illilouette bridge
      [-119.5389, 37.7213], // Panorama Point rim
      [-119.5301, 37.7245], // Nevada Fall brink
      [-119.5480, 37.7267], // Clark Point
    ],
    end: [-119.5580, 37.7322], // Happy Isles (stop pin)
    maxSnapM: 250,
  },
  'pohono-trail': {
    skip: 'The USGS linework for the Pohono Trail west of Taft Point runs well south of the rim and misses Dewey, Crocker, and Stanford Points, so no track can be verified against the published route.',
  },
  'mono-meadow': {
    skip: 'The USGS linework is missing the first half mile between the Glacier Point Road pullout and the meadow; a track that starts mid-trail would be a navigation hazard.',
  },
  'ostrander-lake': {
    via: [[-119.5514, 37.6337]], // Ostrander Lake outlet by the ski hut
    maxSnapM: 250,
  },
  'wawona-meadow-loop': {
    via: [
      [-119.6510, 37.5309], // south side of the meadow on the old road grade
      [-119.6403, 37.5313], // east turnaround
    ],
    end: 'start',
    maxSnapM: 250,
  },
  'wawona-swinging-bridge': {
    skip: 'The USGS linework carries only the short bridge access path from Chilnualna Falls Road; the river-road walk from Forest Drive is absent, so no track can be verified.',
  },
  'chilnualna-falls': {
    via: [[-119.6153, 37.5652]], // top of the falls where the trail meets the creek
    maxSnapM: 300,
  },
  'grizzly-giant-loop': {
    // The walk starts at the grove arrival area (the hike coord is the
    // Welcome Plaza parking, connected by shuttle).
    start: [-119.6035, 37.5140],
    via: [
      [-119.6008, 37.5117], // Grizzly Giant
      [-119.5950, 37.5158], // east leg junction
      [-119.6040, 37.5166], // Perimeter Trail return leg
    ],
    end: 'start',
    maxSnapM: 250,
  },
  'mariposa-grove-guardians-loop': {
    skip: 'The upper Mariposa Grove trails (Guardians loop, Wawona Point) are absent from the USGS linework north of the Grizzly Giant area, so no track can be verified.',
  },

  // --- Tuolumne Meadows & Tioga Road ----------------------------------------
  'tuolumne-grove': {
    // The lot sits at the south end of the old road grade.
    start: [-119.8054, 37.7582],
    via: [[-119.8057, 37.7685]], // Tunnel Tree in the grove
    maxSnapM: 200,
  },
  'lukens-lake': {
    // The signed trailhead pullout is on Tioga Road SSW of the hikes.ts
    // drive-to coord; the trail tops the rise and drops to the lake.
    start: [-119.6152, 37.8505],
    via: [[-119.6180, 37.8568]], // Lukens Lake south shore
    maxSnapM: 300,
  },
  'harden-lake': {
    // White Wolf to the lake on the Old Tioga Road grade; the walk starts
    // where the grade leaves the campground road.
    start: [-119.6493, 37.8724],
    via: [
      [-119.6558, 37.8853], // Old Tioga Road bend
      [-119.6706, 37.8874], // lake spur junction
    ],
    maxSnapM: 300,
  },
  'may-lake': {
    via: [[-119.4925, 37.8437]], // May Lake south shore at the High Sierra Camp
    maxSnapM: 250,
  },
  'mount-hoffmann': {
    via: [
      [-119.4925, 37.8437], // May Lake
      [-119.5027, 37.8459], // Mount Hoffmann summit
    ],
    maxSnapM: 400,
    note: 'The mapped trail fades below the summit block; the last stretch is a hands-on scramble with no built trail.',
  },
  'olmsted-point': {
    via: [[-119.4852, 37.8092]], // viewpoint dome below the pullout
    maxSnapM: 250,
  },
  'tenaya-lake-loop': {
    skip: 'The USGS shoreline linework has a quarter-mile gap at the southeast corner of the lake, so the loop cannot be closed and no track can be verified.',
  },
  'sunrise-lakes': {
    skip: 'The USGS linework climbs out of Tenaya Canyon on the longer Forsyth Trail dogleg, more than two miles over the signed route; the geometry cannot be verified against the published trail.',
  },
  'clouds-rest': {
    skip: 'The USGS linework climbs out of Tenaya Canyon on the longer Forsyth Trail dogleg, several miles over the signed route; the geometry cannot be verified against the published trail.',
  },
  'north-dome': {
    skip: 'The USGS linework runs a direct ridge alignment roughly three miles shorter than the signed Porcupine Creek route; the geometry cannot be verified against the published trail.',
  },
  'pothole-dome': {
    via: [[-119.3945, 37.8769]], // dome's west shoulder at the meadow edge
    maxSnapM: 350,
    note: 'The mapped trail ends where the open granite begins; the summit walk-up is unmarked slab.',
  },
  'soda-springs-parsons-lodge': {
    via: [[-119.3610, 37.8791]], // Parsons Lodge past the Soda Springs enclosure
    maxSnapM: 200,
  },
  'lembert-dome': {
    // Lollipop around the dome's north side to the saddle; the summit slab
    // has no built trail.
    via: [
      [-119.3428, 37.8829], // Dog Lake trail junction behind the dome
      [-119.3470, 37.8819], // saddle on the dome's NE shoulder
    ],
    end: 'start',
    maxSnapM: 300,
    note: 'Track ends at the NE-shoulder saddle; the final summit stretch is open granite with no mapped trail.',
  },
  'dog-lake': {
    via: [[-119.3438, 37.8908]], // Dog Lake west shore
    maxSnapM: 200,
  },
  'elizabeth-lake': {
    via: [[-119.3660, 37.8477]], // Elizabeth Lake under Unicorn Peak
    maxSnapM: 250,
  },
  'cathedral-lakes': {
    // The lower-lake spur is not in the USGS linework; the track runs the
    // JMT to upper Cathedral Lake, the same turnaround distance as the
    // published route to the lower lake.
    via: [[-119.4110, 37.8386]],
    maxSnapM: 500,
    note: 'The stored line follows the John Muir Trail to the upper lake; the half-mile spur to the lower lake is unmapped in the USGS linework.',
  },
  'glen-aulin': {
    via: [
      [-119.3651, 37.8788], // PCT junction behind Parsons Lodge
      [-119.4211, 37.9082], // PCT above White Cascade at Glen Aulin camp
    ],
    maxSnapM: 200,
  },
  'lyell-canyon': {
    // Flat JMT walk; published 8 mi round trip = 4 mi up-canyon turnaround.
    via: [[-119.2990, 37.8480]],
    maxSnapM: 800,
  },
  'mono-pass': {
    via: [[-119.2165, 37.8528]], // Mono Pass crest by the cabin ruins
    maxSnapM: 300,
  },
  'gaylor-lakes': {
    via: [
      [-119.2673, 37.9145], // middle Gaylor Lake
      [-119.2686, 37.9278], // Great Sierra Mine ghost site
    ],
    maxSnapM: 300,
  },
  'mount-dana': {
    skip: 'No constructed trail: the route above Dana Meadows is an unmaintained use path that NPS/USGS do not map. Publishing an approximate line for a 13,000 ft summit would be a navigation hazard.',
  },

  // --- Hetch Hetchy & Evergreen Road ---------------------------------------
  'lookout-point': {
    via: [[-119.8286, 37.9000]], // Lookout Point knob
    maxSnapM: 300,
  },
  'wapama-falls': {
    skip: 'The reservoir-shore trail from the dam to the Wapama footbridges is absent from the USGS linework (only the higher Beehive bench route is mapped), so no track can be verified.',
  },
  'rancheria-falls': {
    skip: 'The reservoir-shore trail past Wapama Falls is absent from the USGS linework (only the higher Beehive bench route is mapped), so no track can be verified.',
  },
  'poopenaut-valley': {
    // The mapped trail leaves Hetch Hetchy Road ~1.2 km west of the hikes.ts
    // drive-to coord and drops NW to the river.
    start: [-119.8146, 37.9102],
    via: [[-119.8200, 37.9192]], // Tuolumne River at the valley floor
    maxSnapM: 150,
  },
  'carlon-falls': {
    start: [-119.8615, 37.8144], // day-use area by the river bridge
    via: [[-119.8438, 37.8032]], // Carlon Falls pool, upstream on the South Fork
    maxSnapM: 200,
  },
  'merced-grove': {
    via: [[-119.8355, 37.7395]], // grove cabin among the big trees
    maxSnapM: 200,
  },
}
