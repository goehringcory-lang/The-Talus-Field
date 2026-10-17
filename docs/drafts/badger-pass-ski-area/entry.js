// DRAFT, NOT PUBLISHED. Proposed catalog entries for badger-pass-ski-area.
// Nothing here is loaded by the site. Copy each block into its real file only
// when publishing (see docs/drafts/README.md).

// ── 1. window.ARTICLES (data.js), inserted at the top of the array ──────────
const ARTICLE = {
  slug: "badger-pass-ski-area",
  aff: true, // the body carries LodgingCta + AffiliateNote
  cat: "seasonal",
  title: "Badger Pass Ski Area: Is It Open, What It Costs, and How the Season Really Works",
  seoTitle: "Badger Pass Ski Area, Yosemite: Season, Tickets, Tubing, Lessons, Shuttle",
  dek: "California's oldest downhill ski area is ten runs, five lifts, and a tubing hill that runs on natural snow, and in the last two winters it opened late once and not at all once. How to check whether it is open, the drive and the free shuttle, the posted ticket and lesson prices, the tubing rules, the Nordic center and the 21-mile track to Glacier Point, and the two huts.",
  seoDek: "Badger Pass Ski Area in Yosemite: season dates and how to check if it's open, tickets, lessons, tubing, cross-country, the free shuttle, and huts.",
  date: "TODO",
  isoDate: "TODO",
  isoModified: "TODO",
  read: "8 min", // TODO: recompute as wordCount / 260 at publish
  placeholder: "Mount Clark under snow from Glacier Point Road, beyond the Badger Pass Ski Area",
  image: "img/clark-range-view-glacier-point-road.jpg",
  credit: "Photo: Justin Johnsen / Wikimedia Commons (CC BY-SA 4.0)",
  // NOTE: no photo of the ski area itself exists in img/. This one is also used
  // as a plate in the snowshoeing draft and as an existing hero elsewhere. A
  // licensed photo of the Badger Pass lodge or lifts would be a better hero
  // (see SOURCES.md); if one is added, run `npm --prefix scripts run images`.
};

// ── 2. window.BODY_VERSIONS (data.js) ───────────────────────────────────────
//   "badger-pass-ski-area": 1,

// ── 3. window.RELATED (data.js) ─────────────────────────────────────────────
const RELATED_ROW = {
  "badger-pass-ski-area": ["yosemite-in-winter", "glacier-point-how-to-visit", "yosemite-in-january", "yosemite-winter-hikes", "where-to-stay-in-yosemite", "yosemite-in-march"],
};
// When the sibling drafts publish, swap in "snowshoeing-in-yosemite" and
// "yosemite-in-february" for the last two.
// Suggested inbound edits (owner's call; each list must stay 4 to 6 long):
//   "yosemite-in-winter":         replace "bracebridge-dinner-and-vintners-holidays" with "badger-pass-ski-area"
//   "glacier-point-how-to-visit": add "badger-pass-ski-area" if its row has room

// ── 4. intent-data.js ───────────────────────────────────────────────────────
//   window.ARTICLE_INTENT:
//     "badger-pass-ski-area": { stage: ["dates-set", "in-park"], who: ["families"], topic: ["conditions", "transportation"] },
//   window.ARTICLE_MONTHS (the published season, mid-December to mid-March):
//     "badger-pass-ski-area": ["dec", "jan", "feb", "mar"],

// ── 5. seo-data.json enrichment ─────────────────────────────────────────────
// Keyword note: "badger pass tubing" and "badger pass ski season" sit today on
// yosemite-in-january, and "badger pass opening" on yosemite-in-december. Move
// them here at publish so two pages do not compete for the same query.
const SEO_DATA = {
  "badger-pass-ski-area": {
    wordCount: "TODO", // about 2,100 by hand count; compute at publish
    keywords: [
      "badger pass ski area",
      "is badger pass open",
      "badger pass opening",
      "badger pass ski season",
      "badger pass tubing",
      "badger pass lift tickets",
      "badger pass ski lessons",
      "yosemite ski and snowboard area",
      "badger pass shuttle",
      "skiing in yosemite",
    ],
    faq: [
      {
        q: "Is Badger Pass open?",
        a: "Its published season is mid-December to mid-March, conditions permitting, with lifts running daily from 9 a.m. to 4 p.m., but the opening date is set by the snow. It did not open at all in the 2024 to 2025 season, and in 2025 to 2026 the lifts opened on January 16 and the area closed on March 18. The 2026 to 2027 opening date has not been announced. Check the Snow Phone, 209/372-1000.",
      },
      {
        q: "Is Badger Pass the same as the Yosemite Ski & Snowboard Area?",
        a: "Yes. The park used the name Yosemite Ski & Snowboard Area from 2016 during a trademark dispute with a former concessioner, Delaware North. The dispute was settled in July 2019 and the original name, Badger Pass Ski Area, came back.",
      },
      {
        q: "How much are lift tickets at Badger Pass?",
        a: "The concessioner's posted prices are $79 for an adult all-day ticket and $59.50 for a child 7 to 12, $72 and $46.50 for a half day, and $35 and $17.50 for the lower lifts only. Children 6 and under ski free with a paying adult. It has not published a 2026 to 2027 price list, so treat these as last season's figures.",
      },
      {
        q: "How does tubing at Badger Pass work?",
        a: "The tubing hill's anticipated dates are January through March, weather permitting, because it is built entirely from natural snow. Sessions run 11 a.m. to 1 p.m. and 1:30 to 3:30 p.m., at $30 per person for two hours, for riders at least 42 inches tall. There is no conveyor; you carry the tube up. Sledding is not allowed at Badger Pass; the park's snow play area is at Crane Flat.",
      },
      {
        q: "Is there a shuttle to Badger Pass?",
        a: "Yes. The free Badger Pass shuttle runs from Yosemite Valley whenever the ski area's facilities are open, typically mid-December through March. The morning shuttle reaches Badger Pass at about 9:30 a.m.",
      },
      {
        q: "Can you ski to Glacier Point in winter?",
        a: "Yes. Beyond Badger Pass, Glacier Point Road is closed to cars and groomed in part for skiing and snowshoeing, 10.5 miles one way to Glacier Point, a 21-mile round trip. The Glacier Point Ski Hut did not open in 2025 to 2026 and had posted nothing about 2026 to 2027.",
      },
      {
        q: "Are there ski lessons for beginners at Badger Pass?",
        a: "Yes. The Guaranteed Learn to Ski or Snowboard package is $154 for adults and $140 for children 7 to 12, with rental, helmet, a beginner lift ticket, and two group lessons, and a free return lesson if you do not ride the beginner run on the first day. Badger Pups lessons for ages 4 to 6 are $100 for one or $130 for two.",
      },
    ],
  },
};
