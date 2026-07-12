// =============================================================================
// ITINERARIES — curated, ordered day plans over the map's pins.
// Single source of truth for the /itineraries page and the map's suggested-
// trip quick picks (page-map.jsx QUICK_PICKS reads this). Stop ids reference
// points.geojson; the order is the drive order, west to east along each road,
// so a plan loads onto the map as a route you can actually run in a day.
// Editing a plan: change the stopIds here, run the compile step, bump the
// shared ?v=, and update the hand-maintained /itineraries JSON-LD in
// edge/seo.js if a title or dek changed.
// =============================================================================

window.ITINERARIES = [
  {
    id: "1day",
    label: "1 day",
    title: "One day in the Valley",
    dek: "The Valley floor, west to east, morning to dinner. Arrive early, park once if you can, and let the day move at walking pace between the famous walls.",
    season: "Open all year. Waterfalls peak in late spring; the river swim belongs to summer.",
    days: [
      {
        name: "Yosemite Valley, west to east",
        stopIds: [
          "cascade-picnic-area",
          "el-capitan-meadow",
          "el-capitan-bridge",
          "sentinel-bridge-south",
          "degnans-deli",
          "church-bowl-indian-creek",
          "ahwahnee",
          "housekeeping-camp-swimming",
          "curry-village-pizza-deck",
        ],
      },
    ],
  },
  {
    id: "2day",
    label: "2 days",
    title: "The Valley, then the rim",
    dek: "Day one on the Valley floor. Day two up Glacier Point Road, stopping in trailhead order, for the views that look back down on everything you walked the day before.",
    season: "Glacier Point Road closes in winter. Check road status before planning day two.",
    days: [
      {
        name: "Day 1: Yosemite Valley, west to east",
        stopIds: [
          "cascade-picnic-area",
          "el-capitan-meadow",
          "el-capitan-bridge",
          "sentinel-bridge-south",
          "degnans-deli",
          "church-bowl-indian-creek",
          "ahwahnee",
          "housekeeping-camp-swimming",
          "curry-village-pizza-deck",
        ],
      },
      {
        name: "Day 2: Glacier Point Road, in trailhead order",
        stopIds: [
          "mcgurk-meadow",
          "taft-point",
          "sentinel-dome",
          "washburn-point",
        ],
      },
    ],
  },
  {
    id: "3day",
    label: "3 days",
    title: "Valley, rim, and high country",
    dek: "The two-day plan, then a third day on Tioga Road, west to east toward the pass. The high country is a different park: granite domes, subalpine lakes, and half the crowd.",
    season: "Tioga Road opens late spring at the earliest and closes with the first serious snow. The third day only exists while it is open.",
    days: [
      {
        name: "Day 1: Yosemite Valley, west to east",
        stopIds: [
          "cascade-picnic-area",
          "el-capitan-meadow",
          "el-capitan-bridge",
          "sentinel-bridge-south",
          "degnans-deli",
          "church-bowl-indian-creek",
          "ahwahnee",
          "housekeeping-camp-swimming",
          "curry-village-pizza-deck",
        ],
      },
      {
        name: "Day 2: Glacier Point Road, in trailhead order",
        stopIds: [
          "mcgurk-meadow",
          "taft-point",
          "sentinel-dome",
          "washburn-point",
        ],
      },
      {
        name: "Day 3: Tioga Road, west to east",
        stopIds: [
          "tuolumne-grove",
          "lukens-lake",
          "may-lake",
          "pothole-dome",
          "lembert-dome",
          "gaylor-lake",
        ],
      },
    ],
  },
  {
    id: "halfday",
    label: "Half day",
    title: "Arriving at two",
    dek: "The honest plan for a late arrival: skip the trailheads, take the meadows and the river, and end at the pizza deck while the light is still on the walls.",
    season: "Works spring through fall. In winter, trade the swim for the meadow walks.",
    days: [
      {
        name: "An afternoon on the Valley floor",
        stopIds: [
          "el-capitan-meadow",
          "sentinel-bridge-south",
          "ahwahnee",
          "housekeeping-camp-swimming",
          "curry-village-pizza-deck",
        ],
      },
    ],
  },
];

// Flat, ordered id list for one itinerary: what the map's quick picks load.
window.getItineraryStopIds = function (itineraryId) {
  const it = (window.ITINERARIES || []).find((x) => x.id === itineraryId);
  if (!it) return [];
  const out = [];
  it.days.forEach((d) => d.stopIds.forEach((id) => { if (!out.includes(id)) out.push(id); }));
  return out;
};
