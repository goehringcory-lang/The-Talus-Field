// =============================================================================
// Routing specs for apps/guide/scripts/gen-backpacking-routes.ts: one entry
// per trip in apps/guide/src/content/backpacking.ts.
//
// Same idea as hike-track-specs.mjs: a spec steers the shared router across
// the USGS/NPS trail network (or OpenStreetMap's, with `source: 'osm'`); it is
// not the route. The route starts at the trip's trailhead coord and ends at
// its exit (one-way), back at the start (loop, lollipop), or, for an
// out-and-back, at `turnaround` and back the same way. `via` forces the right
// branch at junctions and the direction of a loop. Every coordinate is a
// junction or feature from the trip's research (OSM, USGS GNIS, NPS), cited
// in backpacking.ts or here.
//
//   via          ordered [lng, lat] waypoints between the start and the end
//   turnaround   out-and-back only: the far end
//   source       'osm' to route over OpenStreetMap linework
//   maxSnapM     per-point snap ceiling (default 120 m)
//   gainDef      'oneWay' when the published climbing counts one direction
//   sideTrips    { id: { from, to } } walked there and back from camp
// =============================================================================

export const BACKPACKING_ROUTE_SPECS = {
  'may-lake-overnight': {
    // OSM: the May Lake Trail meets the Glen Aulin trail at the lake's
    // southeast corner, beside the backpackers' camp.
    turnaround: [-119.49112, 37.8441],
    maxSnapM: 150,
  },
  'glen-aulin-waterwheel': {
    // OSM junctions (research, Oct 2026): the stables-road gate, the PCT
    // behind Parsons Lodge, the Young Lakes junction, the first footbridge,
    // the White Cascade bridge, the camp, then down-canyon to Waterwheel.
    via: [
      [-119.35836, 37.87885],
      [-119.367, 37.87897],
      [-119.38075, 37.88855],
      [-119.41288, 37.90114],
      [-119.42036, 37.90916],
      [-119.41847, 37.90972],
    ],
    turnaround: [-119.45879, 37.92773],
    maxSnapM: 200,
  },
  'ostrander-lake': {
    // OSM: the junction with the trail from the west, the shoulder above
    // the lake, then the north shore by the ski hut (the day hike's spec
    // ends 770 m short of the hut; this one does not).
    via: [
      [-119.5869, 37.63842],
      [-119.5495, 37.6301],
    ],
    turnaround: [-119.54975, 37.62678],
    maxSnapM: 200,
  },
  'little-yosemite-half-dome': {
    // Mist Trail up (Vernal brink, the junction above Nevada Fall), camp,
    // then the John Muir Trail down (Nevada Fall footbridge, Clark Point).
    // OSM and the NPS-placed junctions from the research pass.
    via: [
      [-119.5437, 37.7274],
      [-119.53038, 37.72614],
      [-119.51453, 37.73295],
      [-119.5331, 37.7248],
      [-119.5449, 37.72503],
    ],
    maxSnapM: 150,
    sideTrips: {
      // Camp to the end of the mapped trail at the foot of the cables.
      'half-dome-summit': { from: [-119.51453, 37.73295], to: [-119.5333, 37.7454] },
    },
  },
  'young-lakes': {
    // OSM junctions: in by Dog Lake (the Dog Lake junction, Dingley Creek,
    // the junction with the Young Lakes Trail), to the end of the maintained
    // trail at Lower Young Lake, back to that junction, then out by the
    // Young Lakes Trail, the PCT, Soda Springs and the stables road.
    via: [
      [-119.34625, 37.88848],
      [-119.3564, 37.91854],
      [-119.36729, 37.92843],
      [-119.34485, 37.93775],
      [-119.36729, 37.92843],
      [-119.38199, 37.90063],
      [-119.38075, 37.88855],
      [-119.36604, 37.87864],
      [-119.35821, 37.87881],
    ],
    // OSM: the USGS line stops short of the maintained trail's end on the
    // lake's north shore (152 m from the water); OSM carries it to the lake.
    source: 'osm',
    maxSnapM: 150,
  },
  'ten-lakes': {
    // OSM: the White Wolf junction, Halfmoon Meadow, the Grant Lakes
    // junction, the pass, then down to the use trail at the first lake.
    via: [
      [-119.56795, 37.87788],
      [-119.54627, 37.89549],
      [-119.53915, 37.90092],
      [-119.53709, 37.90236],
    ],
    // Past the use trail to the first lake, on to the basin floor at the
    // largest lower lake (OSM 'Ten Lakes', relation 12528389).
    turnaround: [-119.52696, 37.9031],
    // OSM: the USGS line misses the use trail down to the first lake.
    source: 'osm',
    gainDef: 'oneWay',
    maxSnapM: 150,
  },
  'lyell-canyon': {
    // OSM: the Dana Fork bridge, Twin Bridges, the JMT junction from the
    // lodge, the Rafferty Creek junction, the Ireland Creek junction, to the
    // head of the canyon floor.
    via: [
      [-119.33532, 37.87586],
      [-119.33285, 37.86969],
      [-119.33362, 37.86875],
      [-119.32312, 37.8669],
      [-119.27966, 37.82551],
    ],
    turnaround: [-119.26176, 37.79196],
    source: 'osm',
    maxSnapM: 150,
    sideTrips: {
      'donohue-pass': { from: [-119.26176, 37.79196], to: [-119.24849, 37.76021], source: 'osm' },
    },
  },
  'grand-canyon-tuolumne': {
    // OSM, east to west: the Glen Aulin trip's junctions to camp, then the
    // canyon trail (Waterwheel, Return Creek, the top of the Muir Gorge
    // bypass, Register Creek, the Pate Valley bridges), the climb (Morrison
    // Creek, the junction at the top), Harden Lake and the old road grade.
    via: [
      [-119.35836, 37.87885],
      [-119.367, 37.87897],
      [-119.38075, 37.88855],
      [-119.41285, 37.9012],
      [-119.42032, 37.90925],
      [-119.41974, 37.90981],
      [-119.43176, 37.91447],
      [-119.45896, 37.92809],
      [-119.46602, 37.93213],
      [-119.52449, 37.9367],
      [-119.53307, 37.94007],
      [-119.59332, 37.93201],
      [-119.63221, 37.91194],
      [-119.65717, 37.90134],
      [-119.6732, 37.89545],
      [-119.66327, 37.88839],
    ],
    source: 'osm',
    maxSnapM: 150,
  },
  'cathedral-to-valley': {
    // OSM: the JMT from the visitor center lot, down the Lower Cathedral
    // spur to camp and back, over Cathedral Pass, Sunrise, down Sunrise
    // Creek, Little Yosemite Valley, and out by the Mist Trail.
    via: [
      [-119.38173, 37.87205],
      [-119.40416, 37.86244],
      [-119.41488, 37.85156],
      [-119.42245, 37.84638],
      [-119.41488, 37.85156],
      [-119.41489, 37.83465],
      [-119.42934, 37.81215],
      [-119.43384, 37.79427],
      [-119.45299, 37.7653],
      [-119.4787, 37.75739],
      [-119.5037, 37.74421],
      [-119.51273, 37.74507],
      [-119.5152, 37.73242],
      [-119.53038, 37.72614],
      [-119.5437, 37.7274],
      [-119.55155, 37.72599],
    ],
    source: 'osm',
    maxSnapM: 150,
  },
  'vogelsang-merced-lake-valley': {
    // OSM: Lyell Fork footbridges, Rafferty junction, Tuolumne Pass, the
    // Vogelsang camp, Vogelsang Pass, Lewis Creek, Florence Creek, the Lewis
    // and Fletcher junction, Merced Lake camp, Echo Valley, both Merced
    // bridges, Little Yosemite Valley, and out by the Mist Trail.
    via: [
      [-119.33296, 37.86961],
      [-119.32312, 37.8669],
      [-119.34017, 37.80465],
      [-119.3441, 37.797],
      [-119.34072, 37.77966],
      [-119.33782, 37.77412],
      [-119.35479, 37.75592],
      [-119.38729, 37.74397],
      [-119.40704, 37.74062],
      [-119.4363, 37.7466],
      [-119.44609, 37.74128],
      [-119.46128, 37.74404],
      [-119.5152, 37.73242],
      [-119.53038, 37.72614],
      [-119.5437, 37.7274],
      [-119.55155, 37.72599],
    ],
    source: 'osm',
    maxSnapM: 150,
  },
}
