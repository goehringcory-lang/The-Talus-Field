// DRAFT, NOT PUBLISHED. Proposed catalog entries for snowshoeing-in-yosemite.
// Nothing here is loaded by the site. Copy each block into its real file only
// when publishing (see docs/drafts/README.md).

// ── 1. window.ARTICLES (data.js), inserted at the top of the array ──────────
const ARTICLE = {
  slug: "snowshoeing-in-yosemite",
  // no aff flag: the body carries no affiliate markup
  cat: "trails",
  title: "Snowshoeing in Yosemite: Badger Pass, Crane Flat, the Mariposa Grove, and the Ranger Walks",
  seoTitle: "Snowshoeing in Yosemite: Where to Go, Ranger Walks, Rentals, Safety",
  dek: "The park marks winter routes in three places, and none of them is the Valley floor. Badger Pass and the road to Dewey Point, the quiet routes at Crane Flat, the Washburn Trail into the sequoias, the free ranger walks and the guided ones, where to rent, the permit and camping rules, and a 1933 snowshoe trip that came back counting tracks.",
  seoDek: "Snowshoeing in Yosemite: Badger Pass and Dewey Point, Crane Flat, the Mariposa Grove, free ranger walks, guided hikes, rentals, and safety rules.",
  date: "TODO",
  isoDate: "TODO",
  isoModified: "TODO",
  read: "8 min", // TODO: recompute as wordCount / 260 at publish
  placeholder: "Snow on the high country beyond Badger Pass, with Mount Clark above Glacier Point Road",
  image: "img/clark-range-view-glacier-point-road.jpg",
  credit: "Photo: Justin Johnsen / Wikimedia Commons (CC BY-SA 4.0)",
  // NOTE: the badger-pass-ski-area draft proposes the same photo. If both
  // publish, give one of them a new licensed image (see SOURCES.md).
};

// ── 2. window.BODY_VERSIONS (data.js) ───────────────────────────────────────
//   "snowshoeing-in-yosemite": 1,

// ── 3. window.RELATED (data.js) ─────────────────────────────────────────────
const RELATED_ROW = {
  "snowshoeing-in-yosemite": ["yosemite-in-winter", "yosemite-winter-hikes", "mariposa-grove-how-to-visit", "glacier-point-how-to-visit", "giant-sequoias-fire-adaptation", "yosemite-ranger-programs"],
};
// When the sibling drafts publish, swap "badger-pass-ski-area" in for
// "giant-sequoias-fire-adaptation".
// Suggested inbound edits (owner's call; each list must stay 4 to 6 long):
//   "yosemite-winter-hikes":       add or swap in "snowshoeing-in-yosemite"
//   "mariposa-grove-how-to-visit": add "snowshoeing-in-yosemite" if its row has room

// ── 4. intent-data.js ───────────────────────────────────────────────────────
//   window.ARTICLE_INTENT:
//     "snowshoeing-in-yosemite": { stage: ["dates-set", "in-park"], who: ["families", "backpacking"], topic: ["trails", "permits"] },
//   window.ARTICLE_MONTHS (the body's window, mid to late December through mid-March):
//     "snowshoeing-in-yosemite": ["dec", "jan", "feb", "mar"],

// ── 5. seo-data.json enrichment ─────────────────────────────────────────────
// Keyword note: "dewey point snowshoe" sits today on yosemite-in-winter. Leave
// it there or move it here at publish; do not list it on both.
const SEO_DATA = {
  "snowshoeing-in-yosemite": {
    wordCount: "TODO", // about 2,150 by hand count; compute at publish
    keywords: [
      "snowshoeing in yosemite",
      "yosemite snowshoe trails",
      "ranger led snowshoe walk yosemite",
      "dewey point snowshoe",
      "snowshoe rental yosemite",
      "crane flat snowshoe",
      "mariposa grove snowshoe",
      "badger pass snowshoeing",
      "yosemite winter camping permit",
    ],
    faq: [
      {
        q: "Where can you snowshoe in Yosemite?",
        a: "The park marks winter routes in three places: Badger Pass on Glacier Point Road, at a base of 7,200 feet and the largest marked network; Crane Flat on the Big Oak Flat Road, at about 6,200 feet; and the Mariposa Grove, at about 5,100 feet, where snow is less reliable. The Valley floor's snow melts within days and leaves ice, which calls for traction cleats, not snowshoes.",
      },
      {
        q: "Are ranger-led snowshoe walks free?",
        a: "Yes. The Park Service says rangers may lead free snowshoe walks from Badger Pass from mid-December through March, conditions and staffing permitting, and lists them on the park calendar when they run.",
      },
      {
        q: "How long is the Dewey Point snowshoe?",
        a: "Seven to eight miles round trip from the Badger Pass area, depending on whether you take the Meadow route or the Ridge route, both ungroomed. The guided version from the Yosemite Mountaineering School is about eight miles and all day, $125 including rentals, for ages 14 and up with an adult.",
      },
      {
        q: "Where can you rent snowshoes in Yosemite?",
        a: "At the Badger Pass Nordic center, first come, first served, open daily from 8:30 a.m. to 4 p.m. in season. The concessioner's pages list $26.50 or $30 for a full day and $24 for a half day. The park lists no rentals at Crane Flat or the Mariposa Grove.",
      },
      {
        q: "When is there enough snow to snowshoe in Yosemite?",
        a: "The park says its marked winter routes generally have enough snow from mid to late December through mid-March, and that this varies from year to year. The Badger Pass Nordic center did not open in 2024 to 2025 and opened on January 9 in 2025 to 2026.",
      },
      {
        q: "Do you need a permit to snowshoe in Yosemite?",
        a: "Not for a day trip. An overnight trip needs a free wilderness permit picked up at the station closest to your starting point, such as the Badger Pass Ranger Station; reservations are not available from November through April. Winter campers must be at least a mile from a plowed road and a mile and a half from the ski area boundary.",
      },
    ],
  },
};
