// DRAFT, NOT PUBLISHED. Proposed catalog entries for yosemite-in-february.
// Nothing here is loaded by the site. Copy each block into its real file only
// when publishing (see docs/drafts/README.md).

// ── 1. window.ARTICLES (data.js), inserted at the top of the array ──────────
const ARTICLE = {
  slug: "yosemite-in-february",
  aff: true, // the body carries LodgingCta + AffiliateNote
  cat: "seasonal",
  title: "Yosemite in February: The Firefall Weeks, the Quiet Weeks, and What Is Actually Open",
  seoTitle: "Yosemite in February: Weather, Firefall Weeks, Badger Pass, What's Open",
  dek: "February is two trips with a fence between them: quiet weeks at winter rates on either side, and a stretch in the middle when the firefall and Presidents' Day weekend land together and the hotels stop discounting. The weather in numbers, what is open, Badger Pass's recent seasons, the chain rules, the campground calendar, and how to pick your half.",
  seoDek: "Yosemite in February: weather, what's open, firefall-week crowds and Presidents' Day, Badger Pass odds, chain rules, winter rates, and camping.",
  date: "TODO",        // "Month D, YYYY" on the publish day
  isoDate: "TODO",     // "YYYY-MM-DD"
  isoModified: "TODO", // same as isoDate
  read: "8 min",       // TODO: recompute as wordCount / 260 at publish
  placeholder: "Fresh snow on the Yosemite Valley floor after a winter storm, in a George Fiske photograph",
  image: "img/yosemite-valley-snow-fiske.jpg",
  credit: "Photo: George Fiske / Wikimedia Commons (public domain)",
  // NOTE: this photo is already the hero of yosemite-winter-hikes. Every winter
  // photo in img/ is already some article's hero; the owner may prefer a new
  // licensed February image (see SOURCES.md).
};

// ── 2. window.BODY_VERSIONS (data.js) ───────────────────────────────────────
//   "yosemite-in-february": 1,

// ── 3. window.RELATED (data.js) ─────────────────────────────────────────────
const RELATED_ROW = {
  "yosemite-in-february": ["horsetail-fall-firefall", "yosemite-in-winter", "yosemite-in-january", "yosemite-in-march", "yosemite-winter-hikes", "mariposa-grove-how-to-visit"],
};
// Suggested inbound edits (owner's call; each list must stay 4 to 6 long):
//   "yosemite-in-january": replace "where-to-stay-in-yosemite" with "yosemite-in-february"
//   "yosemite-in-march":   replace "yosemite-in-december" with "yosemite-in-february"
//   "horsetail-fall-firefall": add "yosemite-in-february" if its row has room

// ── 4. intent-data.js ───────────────────────────────────────────────────────
//   window.ARTICLE_INTENT:
//     "yosemite-in-february": { stage: ["before-booking", "dates-set"], who: [], topic: ["conditions", "transportation", "lodging", "camping"] },
//   window.ARTICLE_MONTHS:
//     "yosemite-in-february": ["feb"],

// ── 5. seo-data.json enrichment ─────────────────────────────────────────────
// Every FAQ answer restates the body; nothing here is new.
const SEO_DATA = {
  "yosemite-in-february": {
    wordCount: "TODO", // about 2,150 by hand count; compute from the prerendered fragment at publish
    keywords: [
      "yosemite in february",
      "visiting yosemite in february",
      "yosemite february weather",
      "is yosemite open in february",
      "yosemite presidents day weekend",
      "yosemite firefall crowds",
      "badger pass february",
      "yosemite chains february",
      "camping in yosemite in february",
      "yosemite winter lodging deals february",
    ],
    faq: [
      {
        q: "What is the weather like in Yosemite in February?",
        a: "The Park Service's 1991 to 2020 normals for Yosemite Valley give February an average high of 51°F and an average low of 30°F, with 6.5 inches of precipitation, which makes it the second wettest month of the year in the Valley, behind January. A Valley storm can arrive as rain or snow; Tuolumne Meadows averages a February high of 39°F and a low of 12°F.",
      },
      {
        q: "Is Yosemite open in February?",
        a: "Yes. Yosemite Valley and Wawona are reachable by car all year. Tioga Road is closed, Glacier Point Road is plowed only as far as the Badger Pass Ski Area from mid-December through early April, and the Mariposa Grove is open on foot by the Washburn Trail, a two-mile route with 500 feet of elevation gain.",
      },
      {
        q: "When is Yosemite busiest in February?",
        a: "In the middle of the month. The Park Service gives the firefall's window as mid to late February, Presidents' Day falls on Monday, February 15, 2027, and the concessioner blacks out its Yosemite Valley Lodge winter rate from February 12 through 20, 2027. Either side of that window the winter rates are in force.",
      },
      {
        q: "Do you need a reservation for the firefall?",
        a: "Not in 2026: the park required no reservation for the park or the Horsetail Fall area in February 2026, and it has published no rules for 2027 yet. In 2026 it prohibited parking and stopping on Northside Drive between Lower Yosemite Fall and the El Capitan Crossover, and viewers walked 1.5 miles each way from Yosemite Falls parking to the viewing area near the El Capitan Picnic Area.",
      },
      {
        q: "Is Badger Pass open in February?",
        a: "February is inside its published season, mid-December to mid-March, conditions permitting, and the tubing hill's anticipated dates are January through March. It is not a promise: Badger Pass did not open at all in the 2024 to 2025 season, and in 2025 to 2026 the lifts opened on January 16 and the area closed on March 18. Call the Snow Phone, 209/372-1000, before you drive up.",
      },
      {
        q: "Do you need chains to drive to Yosemite in February?",
        a: "Carry them. The park says to expect chain requirements from November through March, and whenever a chain control is in effect every vehicle must have chains or cables in it, four-wheel drives and rentals included. Highway 140 needs chains less often than Highway 41, Highway 120 from the west, and Badger Pass Road. The road-conditions line is 209/372-0200, then 1, then 1.",
      },
      {
        q: "Can you camp in Yosemite in February?",
        a: "Yes. Upper Pines is on reservations all year: arrivals from January 15 through February 14 open on September 15, and arrivals from February 15 through March 14 open on October 15, at 7 a.m. Pacific. Camp 4, Wawona, and Hodgdon Meadow are first come, first served in winter and can fill on holidays and weekends.",
      },
    ],
  },
};
