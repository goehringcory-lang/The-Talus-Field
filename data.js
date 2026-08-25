// Shared content for The Talus Field prototype.
// Articles are stored once and pulled by every page that needs them.
//
// NOTE: window.ARTICLES below is the single source of truth for the article
// catalog and core metadata. SEO enrichment that the browser does not need
// (keywords, wordCount, faq, trail facts) lives in /seo-data.json, keyed by
// slug, to keep this runtime file small.
//
// The mirror files consumed by crawlers — /articles.json (read by the Pages
// Worker in /edge/seo.js), /sitemap.xml, /feed.xml, and the
// article list in /llms.txt — are GENERATED from data.js + seo-data.json. Do
// not hand-edit them. When you add or edit an article:
//   1. edit window.ARTICLES here (and its bodies/<slug>.jsx),
//   2. add any enrichment to seo-data.json,
//   3. run `npm --prefix scripts run seo` (and commit the regenerated files).
// Bump isoModified when an article is meaningfully revised so Google and AI
// answer engines see the update. `npm --prefix scripts run seo:check` fails if
// the mirrors are stale.

// Masthead issue label. The month name tracks the current date so the
// "The June Issue" label rolls over automatically each month.
const ISSUE_MONTH = new Date().toLocaleDateString("en-US", { month: "long" });

window.SITE = {
  brand: "The Talus Field",
  tagline: "Yosemite, written by someone who lives here",
  authorName: "Cory Goehring",
  authorBio: "Yosemite naturalist, twenty seasons in the park. Writes from El Portal.",
  email: "cory@thetalusfieldjournal.com",
  // Masthead issue label. One source of truth — Header and HomePage both read this.
  issue: "Vol. III · No. 19",
  issueDetail: `The ${ISSUE_MONTH} Issue`,
};

window.CATEGORIES = [
  { slug: "planning",   label: "Planning",            blurb: "Permits, timing, transit, lodging." },
  { slug: "trails",     label: "Trails and Hikes",    blurb: "Routes and conditions, kept current." },
  { slug: "wildlife",   label: "Wildlife and Nature", blurb: "What is moving and what is blooming." },
  { slug: "seasonal",   label: "Seasonal Guides",     blurb: "The park, month by month." },
];

// ============================================================
// The Planning Guide's curated structure. THIS is the membership: /planning
// renders its five parts from this table (PLANNING_PARTS in
// page-planning-guide.jsx owns only the copy — eyebrow, title, lede, column
// count — and looks its slugs up here by exact `part` label). Adding an article
// to a part means editing it here and nowhere else.
// It also powers the "Part of the Yosemite Planning Guide" series band on member
// articles: a search lander on one cluster piece learns it is inside a
// structured multi-part guide and gets prev/next pathways through the part.
// ============================================================
window.PLANNING_SERIES = [
  { part: "Part One · Before you book", slugs: [
    "first-time-yosemite-overwhelm",
    "yosemite-without-reservations-2026",
    "yosemite-gateway-towns-compared",
    "yosemite-during-smoke-season",
  ] },
  { part: "Part Two · Getting there and getting in", slugs: [
    "getting-to-yosemite",
    "yosemite-valley-parking-guide",
    "yosemite-shuttle-and-yarts",
    "yosemite-wilderness-permits-guide",
  ] },
  { part: "Part Three · When you arrive", slugs: [
    "pack-your-car-for-yosemite",
    "yosemite-walk-up-and-day-of-permits",
    "yosemite-with-kids-no-reservations-2026",
    "yosemite-for-non-hikers",
    "yosemite-accessibility-guide",
    "pets-in-yosemite",
    "yosemite-ranger-programs",
  ] },
  // The lottery mechanics used to be the first slug here. They live on the
  // evergreen /half-dome-lottery page now (the dated article was retired into
  // it in August 2026 and 301s there), and a standing page cannot be a series
  // member: PLANNING_SERIES membership drives the prev/next band on article
  // pages. Both pieces below link to it.
  { part: "Part Four · If you're hiking Half Dome", slugs: [
    "so-you-want-to-hike-half-dome",
    "mist-trail-the-real-guide",
  ] },
  { part: "Part Five · The seasonal calendar", slugs: [
    "yosemite-in-fall",
    "tioga-road-opening-weekend-2026",
    "glacier-point-road-open-2026",
    "yosemite-stargazing-where-to-look-up",
  ] },
];

// The series membership for one slug: { part, prev, next } or null.
window.planningSeriesFor = function (slug) {
  for (const section of window.PLANNING_SERIES) {
    const i = section.slugs.indexOf(slug);
    if (i === -1) continue;
    return {
      part: section.part,
      prev: i > 0 ? section.slugs[i - 1] : null,
      next: i < section.slugs.length - 1 ? section.slugs[i + 1] : null,
    };
  }
  return null;
};

// ============================================================
// Article bodies are loaded on demand (see window.loadArticleBody below) instead
// of all 23 transpiling on every page. This map is the slug -> cache-buster
// version, the equivalent of the old ?v=N on each <script> in index.html. Bump a
// slug's number when you edit its bodies/<slug>.jsx file. scripts/check-cache-busters.sh
// verifies this map stays in sync with the files in bodies/.
// ============================================================
window.BODY_VERSIONS = {
  "yosemite-fire-restrictions-explained": 2,
  "yosemite-in-three-to-five-days": 2,
  "yosemite-winter-hikes": 1,
  "camping-in-yosemite-first-time": 1,
  "first-yosemite-backpacking-trip": 2,
  "yosemite-day-trip-from-bay-area": 1,
  "mariposa-grove-how-to-visit": 1,
  "tuolumne-meadows-in-a-day": 2,
  "swimming-in-the-merced": 1,
  "yosemite-valley-parking-guide": 1,
  "yosemite-shuttle-and-yarts": 2,
  "yosemite-walk-up-and-day-of-permits": 2,
  "yosemite-in-fall": 2,
  "yosemite-tunnel-trees": 1,
  "yosemite-wildlife-viewing-guide": 1,
  "showy-milkweed-yosemite-valley": 3,
  "yosemite-connecting-to-traditions": 1,
  "yosemite-waterfalls-guide": 2,
  "yosemite-photography-spots": 2,
  "horsetail-fall-firefall": 2,
  "yosemite-in-winter": 6,
  "where-to-stay-in-yosemite": 8,
  "yosemite-wildflowers-guide": 2,
  "watching-climbers-el-capitan": 1,
  "getting-to-yosemite": 6,
  "yosemite-wilderness-permits-guide": 3,
  "yosemite-accessibility-guide": 2,
  "pets-in-yosemite": 3,
  "yosemite-ranger-programs": 2,
  "yosemite-camping-complete-guide": 9,
  "where-to-propose-in-yosemite": 2,
  "yosemite-bears-safety-guide": 117,
  "yosemite-heat-safety-guide": 4,
  "when-to-visit-yosemite-2026-crowd-forecast": 3,
  "yosemite-trip-cost-budget-2026": 7,
  "yosemite-in-june-2026": 3,
  "cathedral-lakes-day-hike": 2,
  "yosemite-needs-a-reservation-system": 80,
  "memorial-day-skip-the-valley-go-high-2026": 81,
  "four-mile-up-panorama-down": 75,
  "yosemite-with-kids-no-reservations-2026": 79,
  "tioga-road-opening-weekend-2026": 77,
  "so-you-want-to-hike-half-dome": 76,
  "glacier-point-road-open-2026": 77,
  "mist-trail-the-real-guide": 84,
  "first-time-yosemite-overwhelm": 86,
  "yosemite-without-reservations-2026": 84,
  "yosemite-during-smoke-season": 75,
  "yosemite-gateway-towns-compared": 91,
  "pack-your-car-for-yosemite": 82,
  "yosemite-for-non-hikers": 80,
  "yosemite-stargazing-where-to-look-up": 77,
  "hetch-hetchy-the-other-yosemite-valley": 76,
  "yosemite-glaciers-climate": 76,
  "giant-sequoias-fire-adaptation": 75,
  "bears-spring-emergence": 75,
  "water-ouzels-waterfalls": 75,
  "working-in-yosemite": 76,
  "yosemite-in-one-or-two-days": 85,
  "where-to-eat-yosemite": 82,
  "yosemite-in-march": 2,
};

// Fetch a single article body, Babel-transform it in the browser, and run it so
// it registers itself on window.ARTICLE_BODIES[slug]. Returns a promise resolving
// to the body component (or null if it 404s / fails to register). Memoized per
// slug so concurrent/repeat calls share one request.
window.loadArticleBody = function loadArticleBody(slug) {
  window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
  if (window.ARTICLE_BODIES[slug]) return Promise.resolve(window.ARTICLE_BODIES[slug]);
  window.__bodyPromises = window.__bodyPromises || {};
  if (window.__bodyPromises[slug]) return window.__bodyPromises[slug];

  const v = window.BODY_VERSIONS && window.BODY_VERSIONS[slug];
  // Bodies are precompiled to plain JS under /dist/bodies by
  // scripts/gen-compiled.mjs (same block-scoping downlevel as the page scripts),
  // so we inject them directly with no in-browser Babel transform.
  const url = `/dist/bodies/${slug}.js${v ? `?v=${v}` : ""}`;
  const p = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to load body "${slug}": ${r.status}`);
      return r.text();
    })
    .then((code) => {
      const script = document.createElement("script");
      script.textContent = code;
      document.body.appendChild(script);
      const body = window.ARTICLE_BODIES[slug] || null;
      if (!body) {
        console.error(`loadArticleBody: bodies/${slug}.jsx loaded but did not register window.ARTICLE_BODIES["${slug}"]`);
      }
      return body;
    })
    .catch((err) => {
      // Surfaces both fetch failures (404 from a stale BODY_VERSIONS entry)
      // and Babel syntax errors; without this the page only shows the
      // "coming soon" fallback with no trace of why.
      console.error(`loadArticleBody: article body "${slug}" failed`, err);
      delete window.__bodyPromises[slug];
      throw err;
    });
  window.__bodyPromises[slug] = p;
  return p;
};

// Kit. Three packing checklists (day pack, overnight, car) that page-kit.jsx
// renders as interactive, localStorage-backed checkboxes grouped by category.
// Each item carries an aff field. "#" is the dormant placeholder; a real
// patagonia.pxf.io URL (built via window.buildPatagoniaAffiliateLink in
// affiliate.js) makes KitPage render a tracked "Shop Patagonia" affiliate CTA
// for that item. recommendations[] below is retained but is not rendered by
// KitPage (the directory moved to page-places.jsx).
window.KIT = {
  intro: "Three packing checklists for a Yosemite trip: a day pack, what an overnight adds to it, and the full car load. Tick items off as you plan and pack.",
  lists: [
    {
      slug: "day-pack",
      title: "Day pack",
      icon: "I",
      summary: "For a single day on the trail in the Valley or the high country. Spring through fall.",
      // Optional per-list flat lay, rendered by KitPage under the list header
      // and hidden in the print stylesheet. A list without a photo renders
      // none. Variants come from scripts/gen-responsive-images.mjs.
      photo: {
        image: "img/day-pack-flat-lay.jpg",
        alt: "The day pack list laid out in rows on a granite slab: an olive day pack, a folded Yosemite park map, a compass, a phone, a satellite messenger, a power bank, a wide-brim sun hat, a hydration reservoir and bottle, a squeeze filter, a sun shirt, sunscreen, sunglasses, an insulated vest, a rain shell, a beanie, gloves, wool socks, a neck gaiter, a headlamp, a first aid kit, tape, a multi-tool, paracord, bars and jerky and trail mix, an emergency bivy, a whistle, a head net, repellent, a trowel, trekking poles, a foam sit pad, a dry bag, cash, and hiking boots.",
        caption: "The day pack list, laid out before it goes in the pack.",
      },
      groups: [
        {
          id: "navigation",
          title: "Navigation",
          items: [
            { id: "day-pack:pack", name: "20–25L pack with a hip belt", note: "Hip belt matters more than the brand. It should sit on your iliac crest, not your waist.", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=daypack") },
            { id: "day-pack:paper-map", name: "Paper map of the park", note: "Cell service dies past Crane Flat. A physical map does not need a signal.", aff: "#" },
            { id: "day-pack:compass", name: "Baseplate compass", note: "Paired with the paper map, it is useful when the phone is dead or lost.", aff: "#" },
            { id: "day-pack:offline-maps", name: "Downloaded offline maps", note: "Gaia or Maps.me. Download the tile set at home before you leave; the park has no reliable data connection.", aff: "#" },
            { id: "day-pack:inreach", name: "Garmin inReach Mini or similar satellite messenger", note: "Two-way texting and SOS when there is no cell signal, which is most of the high country.", aff: "#" },
            { id: "day-pack:power-bank", name: "Power bank, 10,000 mAh", note: "Backup for phone navigation and the satellite messenger. Charge it the night before.", aff: "#" }
          ]
        },
        {
          id: "sun-protection",
          title: "Sun protection",
          items: [
            { id: "day-pack:sun-hat", name: "Wide-brim sun hat", note: "Granite reflects. A baseball cap is not enough above 7,000 feet.", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=sun+hat") },
            { id: "day-pack:sun-shirt", name: "Long-sleeve sun shirt, UPF 50", note: "Light color, hood if you can find it. Wear it even in heat.", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=sun+hoody") },
            { id: "day-pack:sunscreen", name: "Sunscreen, SPF 50, reef-safe", note: "Reapply every two hours at elevation.", aff: "#" },
            { id: "day-pack:sunglasses", name: "Polarized sunglasses, UV400", note: "Polarized lenses cut glare off granite and water.", aff: "#" },
            { id: "day-pack:lip-balm", name: "SPF lip balm", note: "Lips chap and burn faster than skin at elevation.", aff: "#" }
          ]
        },
        {
          id: "clothing-insulation",
          title: "Clothing & insulation",
          items: [
            { id: "day-pack:insulated-jacket", name: "Patagonia Nano Puff, or any packable insulated jacket", note: "The Valley is warm at 10am and 40°F at the rim by 3pm. Synthetic insulation still works if it gets wet.", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=nano+puff"), articleSlug: "memorial-day-skip-the-valley-go-high-2026" },
            { id: "day-pack:rain-shell", name: "Packable rain shell with taped seams", note: "Afternoon thunderstorms are common in summer high country.", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=rain+jacket") },
            { id: "day-pack:beanie", name: "Warm beanie", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=beanie") },
            { id: "day-pack:gloves", name: "Lightweight gloves", note: "Worth carrying for Tuolumne.", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=lightweight+gloves") },
            { id: "day-pack:extra-socks", name: "Extra wool or synthetic socks", note: "Wet socks cause blisters. A dry pair costs almost no weight.", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=hiking+socks") },
            { id: "day-pack:buff", name: "Buff or neck gaiter", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=neck+gaiter") }
          ]
        },
        {
          id: "illumination",
          title: "Illumination",
          items: [
            { id: "day-pack:headlamp", name: "Headlamp plus spare battery", note: "Day hikes turn into night hikes more often than you would think.", aff: "#" }
          ]
        },
        {
          id: "first-aid",
          title: "First aid",
          items: [
            { id: "day-pack:first-aid-kit", name: "Small first aid kit", note: "Blister care is what you actually use.", aff: "#" },
            { id: "day-pack:leukotape", name: "Leukotape or moleskin", note: "Apply before hot spots form.", aff: "#" },
            { id: "day-pack:ibuprofen", name: "Ibuprofen", aff: "#" },
            { id: "day-pack:antihistamine", name: "Antihistamine", aff: "#" },
            { id: "day-pack:tweezers", name: "Tweezers", aff: "#" },
            { id: "day-pack:prescription-meds", name: "Personal prescription meds", aff: "#" }
          ]
        },
        {
          id: "fire",
          title: "Fire",
          items: [
            { id: "day-pack:lighter", name: "Lighter or waterproof matches", note: "Emergency fire only. Campfires are banned above 9,600 feet.", aff: "#" }
          ]
        },
        {
          id: "tools-repair",
          title: "Tools & repair",
          items: [
            { id: "day-pack:knife", name: "Small folding knife or multi-tool", aff: "#" },
            { id: "day-pack:duct-tape", name: "Duct tape, short strip", aff: "#" },
            { id: "day-pack:paracord", name: "10 to 15 feet of paracord", aff: "#" }
          ]
        },
        {
          id: "food-water",
          title: "Food & water",
          items: [
            { id: "day-pack:reservoir", name: "2L reservoir plus 1L bottle", note: "Reservoir for steady sipping, bottle for filtering refills. Both, not either.", aff: "#" },
            { id: "day-pack:water-filter", name: "Squeeze water filter", note: "The Sawyer kind. Cheap, fast, and keeps working when the temperature drops.", aff: "#" },
            { id: "day-pack:electrolytes", name: "Electrolyte tabs or powder", aff: "#" },
            { id: "day-pack:trail-snacks", name: "Trail snacks, twice what you think", note: "Calories matter more than weight up here. Bring real food: bars, nuts, jerky, dried fruit, hard candy.", aff: "#" },
            { id: "day-pack:emergency-food", name: "Extra emergency food, one meal", aff: "#" }
          ]
        },
        {
          id: "emergency",
          title: "Emergency",
          items: [
            { id: "day-pack:bivy", name: "Emergency bivy or space blanket", aff: "#" },
            { id: "day-pack:whistle", name: "Pealess whistle", aff: "#" }
          ]
        },
        {
          id: "easily-forgotten",
          title: "Easily forgotten",
          items: [
            { id: "day-pack:head-net", name: "Over-the-head mosquito head net", note: "Meadows and creek crossings in spring and early summer can be dense with mosquitoes.", aff: "#" },
            { id: "day-pack:insect-repellent", name: "DEET or picaridin insect repellent", aff: "#" },
            { id: "day-pack:hand-sanitizer", name: "Hand sanitizer", aff: "#" },
            { id: "day-pack:trowel", name: "Trowel, TP, and Ziploc", note: "For catholes on longer day hikes.", aff: "#" },
            { id: "day-pack:trekking-poles", name: "Trekking poles", note: "They reduce knee stress on steep descents.", aff: "#" },
            { id: "day-pack:sit-pad", name: "Packable foam sit pad", aff: "#" },
            { id: "day-pack:dry-bag", name: "Small dry bag for phone and electronics", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=black+hole+dry+bag") },
            { id: "day-pack:cash", name: "Cash in small bills", note: "Parking is cash-only at several trailheads.", aff: "#" },
            { id: "day-pack:footwear", name: "Hiking boots or trail runners", note: "Road sneakers do not grip wet granite.", aff: "#" }
          ]
        }
      ]
    },
    {
      slug: "overnight-pack",
      title: "Overnight backpack",
      icon: "II",
      summary: "For one to four nights in the backcountry. This adds to the day pack list, it does not replace it.",
      groups: [
        {
          id: "carry-sleep",
          title: "Carry & sleep system",
          items: [
            { id: "overnight-pack:pack", name: "55 to 65L pack", note: "Bigger than you need is worse than tighter than you want.", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=backpacking+pack") },
            { id: "overnight-pack:tent", name: "Three-season tent", note: "Freestanding, two doors, under three pounds if you can afford it.", aff: "#" },
            { id: "overnight-pack:footprint", name: "Tent footprint", aff: "#" },
            { id: "overnight-pack:stakes", name: "Extra tent stakes", note: "Longer stakes hold in sandy, rocky soil.", aff: "#" },
            { id: "overnight-pack:guyline", name: "Guy-line cord", aff: "#" },
            { id: "overnight-pack:sleeping-bag", name: "20°F sleeping bag", note: "A 30°F bag is not enough above 8,000 feet.", aff: "#" },
            { id: "overnight-pack:sleeping-pad", name: "Inflatable pad, R-value 4 or higher", note: "Cold ground steals heat all night.", aff: "#" },
            { id: "overnight-pack:pillow", name: "Compressible camp pillow", aff: "#" },
            { id: "overnight-pack:bag-liner", name: "Sleeping bag liner", note: "It adds 5 to 15°F of warmth.", aff: "#" },
            { id: "overnight-pack:stuff-sacks", name: "Dry bags and stuff sacks", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=black+hole+cube") }
          ]
        },
        {
          id: "kitchen-water",
          title: "Kitchen & water",
          items: [
            { id: "overnight-pack:stove", name: "Stove plus 4oz canister", note: "Figure one canister per two days, per person. Bring one extra.", aff: "#" },
            { id: "overnight-pack:cookpot", name: "Lightweight cookpot", note: "750ml for one, 1.3L for two.", aff: "#" },
            { id: "overnight-pack:spork", name: "Long spork", aff: "#" },
            { id: "overnight-pack:backup-lighter", name: "Lighter plus backup", note: "Carry two. They vanish and they fail.", aff: "#" },
            { id: "overnight-pack:mug", name: "Insulated mug", aff: "#" },
            { id: "overnight-pack:collapsible-bottles", name: "Collapsible water bottles or bladder", aff: "#" },
            { id: "overnight-pack:coffee", name: "Electrolyte packets or instant coffee", aff: "#" },
            { id: "overnight-pack:odor-bags", name: "Food and odor-proof bags", aff: "#" },
            { id: "overnight-pack:camp-soap", name: "Biodegradable camp soap", note: "Wash dishes 200 feet from water.", aff: "#" },
            { id: "overnight-pack:dish-rag", name: "Small sponge or dish rag", aff: "#" }
          ]
        },
        {
          id: "bear-permits",
          title: "Bear canister & permits",
          items: [
            { id: "overnight-pack:bear-canister", name: "Bear canister, required", note: "Yosemite rents Garcia jugs at the wilderness center cheaply but they are heavy. Upgrading to a BearVault 500, or a 450 for shorter trips, is worth it. All food, trash, and scented items go inside, and store it 50 feet or more from your tent.", aff: "#", articleSlug: "so-you-want-to-hike-half-dome" },
            { id: "overnight-pack:wilderness-permit", name: "Wilderness permit, required year-round", note: "Carry a physical or digital copy. It specifies your trailhead and entry date, and it covers the use of a backpacking stove in the park.", aff: "#" }
          ]
        },
        {
          id: "clothing-additions",
          title: "Clothing additions",
          items: [
            { id: "overnight-pack:puffy", name: "Insulated puffy jacket", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=down+jacket") },
            { id: "overnight-pack:base-layers", name: "Warm base layers for sleep", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=base+layer") },
            { id: "overnight-pack:warm-hat-gloves", name: "Warm hat and light gloves", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=fleece+gloves") },
            { id: "overnight-pack:dry-socks", name: "Extra dry socks", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=hiking+socks") },
            { id: "overnight-pack:camp-shoes", name: "Camp shoes", note: "Cheap foam sandals. Worth their weight every single night.", aff: "#" }
          ]
        },
        {
          id: "lnt-hygiene",
          title: "Leave No Trace & hygiene",
          items: [
            { id: "overnight-pack:shovel", name: "Camping shovel, the poop shovel", note: "You know what this is for. Practice Leave No Trace: dig a 6-to-8-inch cathole 200 feet from water and trail, do your business, bury it. Pack a double-lined Ziploc to carry your TP back out. Or, if you want to be a real outdoor junkie, just use rocks. No, seriously. You can just use rocks.", aff: "#" },
            { id: "overnight-pack:hand-sanitizer", name: "Hand sanitizer", aff: "#" },
            { id: "overnight-pack:toothbrush", name: "Toothbrush and small toothpaste", note: "Spit 200 feet from water.", aff: "#" },
            { id: "overnight-pack:wet-wipes", name: "Wet wipes", aff: "#" },
            { id: "overnight-pack:pack-towel", name: "Small pack towel", aff: "#" },
            { id: "overnight-pack:blister-kit", name: "Blister kit with Leukotape", aff: "#" },
            { id: "overnight-pack:menstrual-supplies", name: "Menstrual supplies and pack-out bag", aff: "#" }
          ]
        },
        {
          id: "electronics-nav",
          title: "Electronics & navigation",
          items: [
            { id: "overnight-pack:power-bank", name: "Power bank with cables", note: "There is no cell service in the backcountry.", aff: "#" },
            { id: "overnight-pack:satellite-messenger", name: "Satellite messenger or PLB", note: "A Garmin inReach or SPOT works. A PLB needs no subscription.", aff: "#" },
            { id: "overnight-pack:spare-headlamp", name: "Extra headlamp batteries or spare headlamp", aff: "#" }
          ]
        },
        {
          id: "repair-safety-comfort",
          title: "Repair, safety & comfort",
          items: [
            { id: "overnight-pack:head-net", name: "Mosquito head net", note: "June through mid-August, the lakes and meadows are brutal.", aff: "#" },
            { id: "overnight-pack:patch-kit", name: "Tent and pad patch kit", aff: "#" },
            { id: "overnight-pack:repair-tape", name: "Duct tape or repair tape", aff: "#" },
            { id: "overnight-pack:paracord", name: "Paracord", aff: "#" },
            { id: "overnight-pack:multi-tool", name: "Multi-tool or knife", aff: "#" },
            { id: "overnight-pack:whistle", name: "Whistle", aff: "#" },
            { id: "overnight-pack:bivy", name: "Emergency bivy", aff: "#" },
            { id: "overnight-pack:earplugs", name: "Earplugs and eye mask", aff: "#" }
          ]
        }
      ]
    },
    {
      slug: "car-trip",
      title: "Car trip",
      icon: "III",
      summary: "The full trunk load for any Yosemite drive. Pack it once, leave it packed.",
      essay: {
        slug: "pack-your-car-for-yosemite",
        title: "How to pack your car for a Yosemite trip",
        blurb: "The full essay behind this list. Why each item earns its space, the small tactics that change the math on your trip, and the bear rules that apply to your car too.",
      },
      groups: [
        {
          id: "john-box",
          title: "The John box",
          items: [
            { id: "car-trip:john-box", name: "The John box", note: "Named after my friend John, who came up with the idea. The John box is a single durable storage box that holds every camping essential you ever bring: a double-burner Coleman stove, propane, a hatchet, paracord, firestarter, a flashlight, a spare headlamp and batteries, a lantern, a tarp, even a deck of playing cards. Mine doubles as a camp chair and a small table. The whole point is that you don't unpack it between trips. You load it once, store it loaded, and grab it on the way out the door. You'll never forget the propane again. If you'd rather skip the build, John sells a premade version with everything you need to survive and thrive in the wild.", link: { href: "https://www.myjonbox.com/", label: "myjonbox.com" } }
          ]
        },
        {
          id: "shelter-sleep",
          title: "Shelter & sleep",
          items: [
            { id: "car-trip:tent", name: "Tent sized for the group plus one", aff: "#" },
            { id: "car-trip:footprint", name: "Tent footprint or ground cloth", aff: "#" },
            { id: "car-trip:stakes", name: "Extra tent stakes", note: "Rocky Sierra soil bends cheap ones.", aff: "#" },
            { id: "car-trip:mallet", name: "Mallet or rubber hammer", aff: "#" },
            { id: "car-trip:sleeping-bag", name: "Sleeping bag, one per person", note: "Rate it to at least 20°F.", aff: "#" },
            { id: "car-trip:sleeping-pad", name: "Sleeping pad or air mattress", aff: "#" },
            { id: "car-trip:pillow", name: "Pillow, one per person", aff: "#" },
            { id: "car-trip:blankets", name: "Extra blankets", note: "One wool blanket per tent.", aff: "#" },
            { id: "car-trip:tarp-primary", name: "Tarp", aff: "#" },
            { id: "car-trip:tarp-extra", name: "Extra tarp", note: "Stage it separately so you always have a spare.", aff: "#" },
            { id: "car-trip:canopy", name: "Pop-up shade canopy", note: "Eight hours of August sun makes this mandatory.", aff: "#" },
            { id: "car-trip:canopy-stakes", name: "Canopy stakes and guy lines", aff: "#" },
            { id: "car-trip:tent-repair", name: "Tent repair kit", aff: "#" }
          ]
        },
        {
          id: "kitchen-cooking",
          title: "Kitchen & cooking",
          items: [
            { id: "car-trip:stove", name: "Double-burner propane stove", aff: "#" },
            { id: "car-trip:windscreen", name: "Stove windscreen", note: "Sierra afternoons are windy.", aff: "#" },
            { id: "car-trip:spare-propane", name: "Spare standard 1 lb propane canister", note: "Always carry one extra.", aff: "#" },
            { id: "car-trip:little-kamper", name: "Little Kamper refillable 1 lb propane", note: "A DOT-certified refillable canister sold at the Village Store and other in-park locations on an exchange model. Buy one, then swap empties for full ones. The park disposes of roughly 24,000 single-use cylinders left at campsites every year, so this is the responsible alternative.", aff: "#" },
            { id: "car-trip:adapter-hose", name: "1 lb-to-bulk-tank adapter hose", note: "Cheaper fuel on longer trips.", aff: "#" },
            { id: "car-trip:skillet", name: "Cast iron skillet, 10 to 12 inch", aff: "#" },
            { id: "car-trip:pot", name: "Pot with lid, 4 quart", aff: "#" },
            { id: "car-trip:saucepan", name: "Saucepan, 2 quart", aff: "#" },
            { id: "car-trip:kettle", name: "Kettle or percolator", aff: "#" },
            { id: "car-trip:dutch-oven", name: "Dutch oven, optional", aff: "#" },
            { id: "car-trip:grate", name: "Portable grilling grate", note: "Campsite grates vary.", aff: "#" },
            { id: "car-trip:pot-gripper", name: "Pot gripper or handle", aff: "#" },
            { id: "car-trip:cutting-board", name: "Thin flexible cutting board", note: "It rolls flat and rinses in seconds.", aff: "#" },
            { id: "car-trip:chef-knife", name: "Chef knife in a sheath", aff: "#" },
            { id: "car-trip:paring-knife", name: "Paring knife", aff: "#" },
            { id: "car-trip:spatula", name: "Metal spatula", aff: "#" },
            { id: "car-trip:tongs", name: "Long-handled tongs", aff: "#" },
            { id: "car-trip:wooden-spoon", name: "Wooden spoon", aff: "#" },
            { id: "car-trip:ladle", name: "Ladle", aff: "#" },
            { id: "car-trip:whisk", name: "Whisk", aff: "#" },
            { id: "car-trip:serving-spoon", name: "Large serving spoon", aff: "#" },
            { id: "car-trip:can-opener", name: "Can opener", aff: "#" },
            { id: "car-trip:bottle-opener", name: "Bottle opener or wine key", aff: "#" },
            { id: "car-trip:mixing-bowl", name: "Collapsible mixing bowl", aff: "#" },
            { id: "car-trip:measuring-cups", name: "Measuring cups", aff: "#" },
            { id: "car-trip:plates", name: "Unbreakable plates, one per person", aff: "#" },
            { id: "car-trip:bowls", name: "Unbreakable bowls, one per person", aff: "#" },
            { id: "car-trip:mugs", name: "Insulated mugs, one per person", aff: "#" },
            { id: "car-trip:utensils", name: "Eating utensils, one set per person", aff: "#" },
            { id: "car-trip:foil", name: "Heavy-duty aluminum foil", aff: "#" },
            { id: "car-trip:ziploc-bags", name: "Ziploc bags, quart and gallon", aff: "#" },
            { id: "car-trip:spice-kit", name: "Spice kit", note: "Salt, pepper, garlic, paprika, red pepper, olive oil.", aff: "#" },
            { id: "car-trip:cooking-oil", name: "Cooking oil in a squeeze bottle", aff: "#" },
            { id: "car-trip:dish-soap", name: "Biodegradable dish soap", aff: "#" },
            { id: "car-trip:sponge", name: "Sponge or scrubber", aff: "#" },
            { id: "car-trip:wash-basin", name: "Collapsible wash basin", note: "A two-basin wash and rinse uses less water.", aff: "#" },
            { id: "car-trip:dish-towels", name: "Dish towels", aff: "#" },
            { id: "car-trip:paper-towels", name: "Paper towels", aff: "#" },
            { id: "car-trip:food-containers", name: "Reusable food containers", aff: "#" },
            { id: "car-trip:kitchen-trash-bags", name: "Kitchen trash bags", aff: "#" },
            { id: "car-trip:kitchen-lighter", name: "Lighter, keep two", aff: "#" },
            { id: "car-trip:kitchen-matches", name: "Waterproof matches, backup", aff: "#" }
          ]
        },
        {
          id: "water",
          title: "Water",
          items: [
            { id: "car-trip:water-jug-5gal", name: "5 gallon jug with a spigot", note: "Not for drinking. For radiators, hand-washing, the unexpected.", aff: "#" },
            { id: "car-trip:water-jug-2gal", name: "2 gallon collapsible jug", aff: "#" },
            { id: "car-trip:water-filter", name: "Water filter", note: "The Sawyer kind, as a backup if the spigot is closed.", aff: "#" },
            { id: "car-trip:purification-tablets", name: "Purification tablets, backup", aff: "#" },
            { id: "car-trip:bottles", name: "Reusable bottles, one per person", aff: "#" },
            { id: "car-trip:tumbler", name: "Insulated tumbler, one per person", aff: "#" }
          ]
        },
        {
          id: "fire",
          title: "Fire",
          items: [
            { id: "car-trip:firewood", name: "Firewood, bought in-park", note: "California invasive-pest rules apply and rangers enforce them at checkpoints. Buy it locally.", aff: "#" },
            { id: "car-trip:kindling", name: "Kindling", aff: "#" },
            { id: "car-trip:fatwood", name: "Fatwood or fire-starting sticks", aff: "#" },
            { id: "car-trip:firestarter-cubes", name: "Firestarter cubes", aff: "#" },
            { id: "car-trip:newspaper", name: "Newspaper, backup tinder", aff: "#" },
            { id: "car-trip:long-lighter", name: "Long-reach lighter", aff: "#" },
            { id: "car-trip:fire-matches", name: "Waterproof matches", aff: "#" },
            { id: "car-trip:fire-gloves", name: "Leather fire gloves", aff: "#" },
            { id: "car-trip:coal-shovel", name: "Small metal shovel or trowel", note: "For spreading coals and smothering the fire.", aff: "#" },
            { id: "car-trip:water-bucket", name: "Metal water bucket", note: "Full extinguishment is required before you leave a fire.", aff: "#" },
            { id: "car-trip:roasting-sticks", name: "Telescoping roasting sticks", aff: "#" },
            { id: "car-trip:campfire-hours", name: "Valley campfire hours awareness", note: "Campfires in Valley campgrounds are restricted to certain evening hours, and high-country wilderness fires are banned above 9,600 feet. Propane stoves stay legal during fire bans.", aff: "#" }
          ]
        },
        {
          id: "tools-repair",
          title: "Tools & repair",
          items: [
            { id: "car-trip:hatchet", name: "Hatchet", aff: "#" },
            { id: "car-trip:folding-saw", name: "Folding saw", note: "Cuts what the hatchet bounces off.", aff: "#" },
            { id: "car-trip:work-gloves", name: "Work gloves", aff: "#" },
            { id: "car-trip:paracord-50", name: "Paracord, 50 feet", aff: "#" },
            { id: "car-trip:bank-line-100", name: "Additional paracord or bank line, 100 feet", aff: "#" },
            { id: "car-trip:bungees", name: "Assorted bungee cords", aff: "#" },
            { id: "car-trip:carabiners", name: "Utility carabiners", aff: "#" },
            { id: "car-trip:duct-tape", name: "Duct tape, full roll", aff: "#" },
            { id: "car-trip:zip-ties", name: "Assorted zip ties", aff: "#" },
            { id: "car-trip:multi-tool", name: "Multi-tool", aff: "#" },
            { id: "car-trip:toolkit", name: "Small toolkit", note: "Screwdrivers, a wrench, pliers.", aff: "#" },
            { id: "car-trip:pole-sleeve", name: "Tent pole repair sleeve", aff: "#" },
            { id: "car-trip:seam-sealer", name: "Seam sealer", aff: "#" },
            { id: "car-trip:gear-ties", name: "Gear ties", aff: "#" },
            { id: "car-trip:cable-locks", name: "Cable locks", note: "Secure gear to the rack or table.", aff: "#" },
            { id: "car-trip:needle-thread", name: "Heavy-duty needle and thread", aff: "#" }
          ]
        },
        {
          id: "lighting-power",
          title: "Lighting & power",
          items: [
            { id: "car-trip:headlamp", name: "Headlamp, one per person", note: "Vault toilets at midnight are not the place to share.", aff: "#" },
            { id: "car-trip:spare-headlamp", name: "Spare headlamp with fresh batteries", aff: "#" },
            { id: "car-trip:batteries", name: "Extra batteries, AA and AAA", aff: "#" },
            { id: "car-trip:lantern", name: "LED lantern", aff: "#" },
            { id: "car-trip:flashlight", name: "Handheld flashlight", aff: "#" },
            { id: "car-trip:power-bank", name: "Power bank, 20,000 mAh", note: "Cell service is unreliable past Crane Flat.", aff: "#" },
            { id: "car-trip:car-charger", name: "Multi-port car USB charger", aff: "#" },
            { id: "car-trip:string-lights", name: "String lights, battery or solar", aff: "#" },
            { id: "car-trip:solar-lantern", name: "Collapsible solar lantern", aff: "#" },
            { id: "car-trip:candles", name: "Candles in a covered holder", aff: "#" }
          ]
        },
        {
          id: "comfort-camp",
          title: "Comfort & camp setup",
          items: [
            { id: "car-trip:folding-chairs", name: "Standard folding camp chairs, one per person", note: "You will use them more than anything else you bring.", aff: "#" },
            { id: "car-trip:packable-chairs", name: "Packable backpacking-style camp chairs, one or two extra", note: "Folds to the size of a water bottle and goes in the John box.", aff: "#" },
            { id: "car-trip:camp-table", name: "Small folding camp table", note: "Keeps the picnic table from becoming a staging area.", aff: "#" },
            { id: "car-trip:hammock", name: "Hammock with tree-friendly straps", aff: "#" },
            { id: "car-trip:outdoor-rug", name: "Outdoor rug or foam mat", aff: "#" },
            { id: "car-trip:clothesline", name: "Clothesline, 20 feet", aff: "#" },
            { id: "car-trip:clothespins", name: "Clothespins", aff: "#" },
            { id: "car-trip:broom", name: "Whisk broom and dustpan", aff: "#" },
            { id: "car-trip:backup-pillow", name: "Inflatable backup pillow", aff: "#" },
            { id: "car-trip:quilt", name: "Packable quilt or outdoor blanket", aff: "#" },
            { id: "car-trip:tote-bags", name: "Tote bags for grocery and bear-locker runs", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=tote") }
          ]
        },
        {
          id: "safety-first-aid",
          title: "Safety & first aid",
          items: [
            { id: "car-trip:first-aid-kit", name: "Comprehensive first aid kit", note: "Blister treatment, moleskin, a SAM splint, an ace bandage, antiseptic, gauze, tape, and OTC meds. Note that bear spray is not permitted in Yosemite. Do not bring it.", aff: "#" },
            { id: "car-trip:tweezers", name: "Dedicated tweezers", aff: "#" },
            { id: "car-trip:whistle", name: "Whistle, one per person", aff: "#" },
            { id: "car-trip:jump-pack", name: "Lithium jump pack", note: "Better than cables. Cell service is unreliable past Crane Flat.", aff: "#" },
            { id: "car-trip:jumper-cables", name: "Jumper cables, backup", aff: "#" },
            { id: "car-trip:road-flares", name: "Road flares or reflective triangles", aff: "#" },
            { id: "car-trip:fire-extinguisher", name: "Small ABC fire extinguisher", aff: "#" },
            { id: "car-trip:tire-chains", name: "Tire chains, November through April", note: "Required during chain controls and rangers check. Practice once at home.", aff: "#" },
            { id: "car-trip:tire-gauge", name: "Tire pressure gauge", aff: "#" },
            { id: "car-trip:car-kit", name: "Basic car kit", note: "Spare, jack, lug wrench.", aff: "#" },
            { id: "car-trip:mylar-blankets", name: "Mylar emergency blankets", aff: "#" },
            { id: "car-trip:sunscreen", name: "Sunscreen, SPF 50", aff: "#" },
            { id: "car-trip:insect-repellent", name: "Insect repellent, DEET or picaridin", aff: "#" },
            { id: "car-trip:tick-check", name: "Tick-check reminder", note: "Yosemite has Lyme-carrying ticks.", aff: "#" }
          ]
        },
        {
          id: "hygiene-sanitation",
          title: "Hygiene & sanitation",
          items: [
            { id: "car-trip:toilet-paper", name: "Extra toilet paper", aff: "#" },
            { id: "car-trip:hand-wash-station", name: "Portable hand-wash station", aff: "#" },
            { id: "car-trip:hand-sanitizer", name: "Hand sanitizer, large", aff: "#" },
            { id: "car-trip:wet-wipes", name: "Wet or baby wipes", aff: "#" },
            { id: "car-trip:camp-soap", name: "Biodegradable camp soap", note: "Keep it 200 feet from water.", aff: "#" },
            { id: "car-trip:shampoo", name: "Travel shampoo and conditioner", aff: "#" },
            { id: "car-trip:towels", name: "Quick-dry towels, one per person", aff: "#" },
            { id: "car-trip:toiletries", name: "Toiletries kit", note: "Toothbrush, paste, floss, deodorant, lip balm, feminine items. All in the bear locker overnight.", aff: "#" },
            { id: "car-trip:mirror", name: "Small mirror", aff: "#" },
            { id: "car-trip:shower-sandals", name: "Shower sandals or flip-flops", note: "Curry Village and Housekeeping showers require them.", aff: "#" },
            { id: "car-trip:shower-coins", name: "Quarters and small bills", note: "For the coin showers.", aff: "#" },
            { id: "car-trip:contractor-bags", name: "Contractor trash bags", aff: "#" },
            { id: "car-trip:recycling-bag", name: "Recycling bag", aff: "#" },
            { id: "car-trip:grey-water", name: "Grey-water container", note: "Do not dump dishwater on the ground.", aff: "#" },
            { id: "car-trip:wag-bags", name: "WAG bags for remote sites", aff: "#" }
          ]
        },
        {
          id: "food-camp-kitchen",
          title: "Food & camp kitchen",
          items: [
            { id: "car-trip:cooler", name: "Cooler with ice", note: "Bear-aware: nothing with a scent stays in the car overnight.", aff: "#" },
            { id: "car-trip:second-cooler", name: "Second cooler or dry-goods bin", aff: "#" },
            { id: "car-trip:block-ice", name: "Block ice", note: "It lasts longer. Freeze it in a cleaned jug.", aff: "#" },
            { id: "car-trip:dry-goods-bin", name: "Dry-goods bin with a lid", aff: "#" },
            { id: "car-trip:coffee-setup", name: "Coffee setup", note: "Pour-over or percolator, grounds, filters, a manual grinder.", aff: "#" },
            { id: "car-trip:creamer", name: "Shelf-stable creamer", aff: "#" },
            { id: "car-trip:tea-cocoa", name: "Tea and cocoa packets", aff: "#" },
            { id: "car-trip:condiments", name: "Condiment packets", aff: "#" },
            { id: "car-trip:oil-butter", name: "Cooking oil and butter, sealed", aff: "#" },
            { id: "car-trip:snack-bag", name: "Snack bag", note: "Granola, trail mix, jerky, dried fruit. There is one grocery store in the Valley and the line is long.", aff: "#" },
            { id: "car-trip:smores-kit", name: "S'mores kit, boxed together", aff: "#" },
            { id: "car-trip:meal-plan", name: "Printed meal plan", aff: "#" },
            { id: "car-trip:paper-plates", name: "Small supply of paper plates and cups", aff: "#" },
            { id: "car-trip:napkins", name: "Napkins", aff: "#" }
          ]
        },
        {
          id: "clothing-footwear",
          title: "Clothing & footwear",
          items: [
            { id: "car-trip:base-layers", name: "Moisture-wicking base layers", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=base+layer") },
            { id: "car-trip:mid-layer", name: "Mid-layer fleece or down", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=fleece") },
            { id: "car-trip:outer-jacket", name: "Insulated outer jacket", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=insulated+jacket") },
            { id: "car-trip:rain-jacket", name: "Packable rain jacket", note: "Summer afternoon thunderstorms are not rare.", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=rain+jacket") },
            { id: "car-trip:rain-pants", name: "Rain pants", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=rain+pants") },
            { id: "car-trip:hiking-pants", name: "Zip-off hiking pants", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=hiking+pants") },
            { id: "car-trip:camp-pants", name: "Camp pants or shorts", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=pants") },
            { id: "car-trip:tshirts", name: "T-shirts", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=t-shirt") },
            { id: "car-trip:sun-shirt", name: "Long-sleeve UPF 50 sun shirt", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=sun+hoody") },
            { id: "car-trip:beanie", name: "Beanie", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=beanie") },
            { id: "car-trip:sun-hat", name: "Wide-brim sun hat", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=sun+hat") },
            { id: "car-trip:gloves", name: "Lightweight gloves", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=lightweight+gloves") },
            { id: "car-trip:boots", name: "Broken-in hiking boots", aff: "#" },
            { id: "car-trip:camp-shoes", name: "Camp shoes or sandals", aff: "#" },
            { id: "car-trip:socks", name: "Extra socks, two pairs per day", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=hiking+socks") },
            { id: "car-trip:swimwear", name: "Swimwear", note: "The Merced swimming holes are real, cold, and worth it.", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=boardshorts") },
            { id: "car-trip:underwear", name: "Underwear, plus extras", aff: window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=underwear") },
            { id: "car-trip:sleepwear", name: "Dedicated sleepwear", aff: "#" },
            { id: "car-trip:gaiters", name: "Low gaiters", aff: "#" }
          ]
        },
        {
          id: "yosemite-specific",
          title: "Yosemite-specific",
          items: [
            { id: "car-trip:permit-confirmation", name: "Printed campsite and permit confirmation", note: "Include your Half Dome confirmation if you have one.", aff: "#" },
            { id: "car-trip:park-map", name: "Paper park map", aff: "#" },
            { id: "car-trip:bear-locker-discipline", name: "Bear-locker discipline", note: "All food and scented items, including deodorant, toothpaste, chapstick, sunscreen, and trash, go in the bear box. The trunk is not bear-proof.", aff: "#" },
            { id: "car-trip:offline-app", name: "Offline NPS app, downloaded", aff: "#" },
            { id: "car-trip:park-pass", name: "Park entrance receipt or America the Beautiful pass", note: "Keep it on the dashboard.", aff: "#" }
          ]
        }
      ]
    },
  ],
  recommendations: {
    intro: "A short list of places I have actually stayed at and guides I have actually hired. Updated once a year. Some links are affiliate; the recommendations are not.",
    lodging: [
      { name: "The Ahwahnee", area: "Yosemite Valley", note: "Splurge. Worth it for the dining hall alone, even if you do not stay.", aff: "#" },
      { name: "Yosemite Valley Lodge", area: "Yosemite Valley", note: "The most practical Valley lodging if you want to walk to Lower Falls.", aff: "#" },
      { name: "Rush Creek Lodge", area: "Highway 120, west entrance", note: "Outside the park, fifteen minutes from the gate. Better food than anything inside.", aff: "#" },
      { name: "Tuolumne Meadows Lodge", area: "Tioga Road, summer only", note: "Canvas tent cabins. Reserve the day reservations open or you will not get one.", aff: "#" },
    ],
    guides: [
      { name: "Yosemite Mountaineering School", area: "Climbing instruction", note: "The school the rangers send people to. Beginner to advanced.", aff: "#" },
      { name: "Yosemite Conservancy field seminars", area: "Naturalist-led, multi-day", note: "Photography, geology, birding. The teachers are working scientists.", aff: "#" },
    ],
  },
};

// Flattened, in-order view of every checklist item per list. The kit JSON-LD in
// app.jsx reads list.allItems; KitPage itself renders from list.groups directly.
window.KIT.lists.forEach((l) => {
  l.allItems = (l.groups || []).flatMap((g) => g.items || []);
});

window.ARTICLES = [
  {
    slug: "yosemite-fire-restrictions-explained",
    cat: "planning",
    title: "Yosemite fire restrictions, explained: what's banned, what still works, and how to check before you go",
    dek: "Stage 1 fire restrictions are in effect below 8,000 feet, and the notice on the fire ring doesn't explain the rest of it. What's actually banned, what still works, why the elevation line moves, and when restrictions like this one usually lift.",
    seoDek: "Yosemite's Stage 1 fire restrictions, explained: what's banned below 8,000 feet, what still works, and how to check before your trip.",
    date: "August 24, 2026",
    isoDate: "2026-08-24",
    isoModified: "2026-08-24",
    read: "8 min",
    placeholder: "A campfire burning at night below Half Dome",
    image: "img/campfire-half-dome-night.jpg",
    credit: "Photo: alohaphotostudio / Pexels",
  },
  {
    slug: "yosemite-in-three-to-five-days",
    cat: "planning",
    title: "Yosemite in three to five days: one park per day",
    dek: "The third day is the first one that is not triage. Yosemite is four parks wearing one name, the Valley, the rim, the high country, and the far corners, and a three-to-five-day trip works by giving each one its own day. The order that survives the roads, the winter version, and the day with nothing on it.",
    seoDek: "A Yosemite itinerary for 3, 4, or 5 days: the Valley, Glacier Point, the Tioga high country, and Hetch Hetchy, one park per day, plus the winter version.",
    date: "August 23, 2026",
    isoDate: "2026-08-23",
    isoModified: "2026-08-23",
    read: "13 min",
    placeholder: "Half Dome and the Merced canyon staircase from Washburn Point on the rim day",
    image: "img/washburn-point.jpg",
    credit: "Photo: Pavel Špindler / Wikimedia Commons (CC BY 3.0)",
  },
  {
    slug: "yosemite-winter-hikes",
    cat: "trails",
    title: "Winter hiking in Yosemite: the trails that stay open",
    dek: "Two thirds of the trail map closes when the snow settles in, and nothing at the gate tells you which trails are in the surviving third. The winter inventory: the Valley floor loops, Columbia Rock, the Mist Trail's winter route, Hetch Hetchy, the sequoias on foot, and the cleats that make it all walkable.",
    seoDek: "What you can actually hike in Yosemite in winter: Valley floor trails, Columbia Rock, the Vernal Fall winter route, Hetch Hetchy, Wawona, and what is closed.",
    date: "August 23, 2026",
    isoDate: "2026-08-23",
    isoModified: "2026-08-23",
    read: "10 min",
    placeholder: "A walker crossing a snow-patched Yosemite Valley meadow below Cathedral Rocks",
    image: "img/yosemite-valley-winter-wall.jpg",
    credit: "Photo: Ahmed Radwan / Wikimedia Commons (CC0)",
  },
  {
    slug: "yosemite-in-march",
    cat: "seasonal",
    title: "Yosemite in March: A Tale of Two Seasons",
    dek: "One March is spring: 70 degrees in the Valley, waterfalls waking up, poppies in the canyon. The other is the biggest winter month of the year, the one the Sierra named. You cannot pick which one you get, but you can plan a trip that works in either. Here is how.",
    seoDek: "Yosemite in March: weather, what is open and closed, chain rules, waterfalls and frazil ice, the foothill bloom, spring break crowds, and planning for both.",
    date: "August 20, 2026",
    isoDate: "2026-08-20",
    isoModified: "2026-08-20",
    read: "12 min",
    placeholder: "El Capitan above the Merced River as the Valley floor leafs out in spring",
    image: "img/el-capitan-winter.jpg",
  },
  {
    slug: "camping-in-yosemite-first-time",
    cat: "planning",
    title: "Camping in Yosemite for the First Time",
    dek: "The reservation is the part everyone plans for. Nobody prepares you for four o'clock on the first afternoon: a site smaller than the photo, a steel box your cooler will not fit inside, and three hours of daylight. What a night in a Yosemite campground is actually like.",
    seoDek: "First time camping in Yosemite? What the campground is really like: the bear box, the cold you did not pack for, quiet hours, and what goes wrong.",
    date: "August 7, 2026",
    isoDate: "2026-08-07",
    isoModified: "2026-08-07",
    read: "13 min",
    placeholder: "A dog standing beside an orange tent at a forested campsite on the Yosemite Valley floor",
    image: "img/campground-tent-dog-andrei-serikov.jpg",
    credit: "Photo: Andrei Serikov / Pexels",
  },
  {
    slug: "first-yosemite-backpacking-trip",
    cat: "trails",
    title: "Your First Yosemite Backpacking Trip: What the Permit Doesn't Tell You",
    dek: "The permit prints a trailhead and a date. It says nothing about how much snow is still on the pass, how high the creek is running at four in the afternoon, or which week the mosquitoes reach your meadow. The conditions the paperwork leaves out.",
    seoDek: "Planning a first Yosemite backpacking trip: lingering snow, creek crossings, mosquito timing, altitude, bear canister rules, and four beginner routes that work.",
    date: "August 7, 2026",
    isoDate: "2026-08-07",
    isoModified: "2026-08-07",
    read: "15 min",
    placeholder: "A backpacking tent pitched on granite at first light, alpenglow on the spires above camp",
    image: "img/backcountry-camp-alpenglow-stephen-leonardi.jpg",
    credit: "Photo: Stephen Leonardi / Pexels",
  },
  {
    slug: "yosemite-day-trip-from-bay-area",
    cat: "planning",
    title: "Yosemite as a Day Trip From the Bay Area: The Honest Math",
    dek: "Nine hours of driving buys seven hours in the park in June and five in December, and the Valley lots are full before a driver who left San Francisco at five can arrive. When the day trip works, when it does not, and the one-day plan that produces a good day instead of a frantic one.",
    seoDek: "Yosemite as a day trip from San Francisco or San Jose: real drive times, daylight math, parking, the one-day Valley plan that works, and the train alternative.",
    date: "August 7, 2026",
    isoDate: "2026-08-07",
    isoModified: "2026-08-07",
    read: "13 min",
    placeholder: "A visitor at a paved Yosemite overlook, the northwest face of Half Dome across the canyon behind",
    image: "img/half-dome-overlook-day-visitor-stephen-leonardi.jpg",
    credit: "Photo: Stephen Leonardi / Pexels",
  },
  {
    slug: "swimming-in-the-merced",
    cat: "seasonal",
    title: "Swimming in the Merced",
    dek: "The river is the best thing about a hot Yosemite afternoon, and the Park Service pulls fifteen to twenty people out of it in a normal season. The difference is mostly the calendar. When it is safe, where to get in, where swimming is flatly prohibited, and how to read the flow before you go.",
    seoDek: "When it is safe to swim in the Merced River in Yosemite, the best beaches, the places swimming is prohibited, cold water shock, and how to check the flow.",
    date: "August 7, 2026",
    isoDate: "2026-08-07",
    isoModified: "2026-08-07",
    read: "13 min",
    placeholder: "A low, clear stretch of the Merced River in Yosemite Valley in late summer",
    image: "img/merced-river-swimming-hole-robert-schrader.jpg",
    credit: "Photo: Robert Schrader / Pexels",
  },
  {
    slug: "tuolumne-meadows-in-a-day",
    cat: "planning",
    title: "Tuolumne Meadows in a day",
    dek: "The high country is not a scenic detour on the way to Mono Lake. A day in Tuolumne for people who are not peak-baggers: the drive, what is actually open in 2026, the short walks that pay, the altitude, and the afternoon storm that ends the day early.",
    seoDek: "How to spend a day in Tuolumne Meadows: the Tioga Road drive, what is open in 2026, easy walks for families and non-hikers, altitude, and thunderstorms.",
    date: "August 7, 2026",
    isoDate: "2026-08-07",
    isoModified: "2026-08-07",
    read: "14 min",
    placeholder: "The Tuolumne River winding through Tuolumne Meadows below the high country domes",
    image: "img/tuolumne-meadows-river-basiciggy.jpg",
    credit: "Photo: basiciggy / Pexels",
  },
  {
    slug: "mariposa-grove-how-to-visit",
    cat: "planning",
    title: "Mariposa Grove: how to visit",
    dek: "You cannot drive to the trees, and have not been able to since 2018. The free shuttle, the parking two miles down the hill, the four walks in order of ambition, the dog rule that catches everyone out, and what the restoration actually changed.",
    seoDek: "How to visit Yosemite's Mariposa Grove: the free shuttle, where to park, the four trails, accessible access, winter on foot, and the rules that surprise people.",
    date: "August 7, 2026",
    isoDate: "2026-08-07",
    isoModified: "2026-08-07",
    read: "12 min",
    placeholder: "The Grizzly Giant standing above the loop trail in the Mariposa Grove",
    image: "img/mariposa-grove-grizzly-giant-nieves.jpg",
    credit: "Photo: Nieves / Pexels",
  },
  {
    slug: "yosemite-valley-parking-guide",
    cat: "planning",
    title: "Parking in Yosemite Valley: Where the Lots Are, When They Fill, and What to Do at Eleven",
    dek: "The most-asked question in the park, answered properly. The three day-use lots and what each is actually for, why most famous trailheads have no parking at all, what the Park Service says about when they fill, and the five moves that still work once you have lost the race.",
    seoDek: "Where to park in Yosemite Valley: the three day-use lots, when parking fills, what to do when the lots are full, accessible and RV parking, and the 2026 rules.",
    date: "August 6, 2026",
    isoDate: "2026-08-06",
    isoModified: "2026-08-06",
    read: "9 min",
    placeholder: "Cars parked along the edge of a Yosemite Valley meadow on a crowded weekend",
    image: "img/cars-on-meadow-edge-cory-goehring.jpg",
    credit: "Photo: Cory Goehring",
  },
  {
    slug: "yosemite-shuttle-and-yarts",
    cat: "planning",
    title: "The Valley Shuttle and YARTS: Yosemite's Two Buses, and When Each One Beats Driving",
    dek: "One is free and only exists inside Yosemite Valley. The other carries you from an Amtrak platform in Merced to a curb in front of the Lodge. Routes, hours, headways and fares for both, the entrance-fee question nobody has settled, and the honest cases where driving still wins.",
    seoDek: "Yosemite Valley shuttle routes, hours and frequency, plus YARTS bus routes and fares from Merced, Fresno, Sonora and Mammoth, and when the bus beats driving.",
    date: "August 5, 2026",
    isoDate: "2026-08-05",
    isoModified: "2026-08-07",
    read: "8 min",
    placeholder: "A YARTS coach stopped on Southside Drive below Bridalveil Fall, public transit running into Yosemite Valley in winter",
    image: "img/yarts-bus-bridalveil.jpg",
    credit: "Photo: YARTS",
  },
  {
    slug: "yosemite-walk-up-and-day-of-permits",
    cat: "planning",
    title: "Walk-Up and Day-Of Permits: What You Can Still Get Today",
    dek: "Every permit guide is written for someone planning six months out. This one is for the visitor already inside the park holding nothing: what needs no permit at all, the wilderness release and the three-day wall, the Half Dome daily lottery, and how to find a bed tonight.",
    seoDek: "Walk-up and same-day Yosemite permits: what needs no permit, the last-minute wilderness release, the Half Dome daily lottery, and day-of camping options.",
    date: "August 4, 2026",
    isoDate: "2026-08-04",
    isoModified: "2026-08-04",
    read: "9 min",
    placeholder: "Half Dome above the Yosemite Valley floor, the one hike in the park with no walk-up permit option",
    image: "img/half-dome-valley-vista.jpg",
    credit: "Photo: Cam DiCecca / Wikimedia Commons (CC0)",
  },
  {
    slug: "yosemite-in-fall",
    cat: "seasonal",
    title: "Yosemite in Fall: What Closes, When, and What You Get Instead",
    dek: "September through November is the season I recommend most and people book least, because the waterfalls are gone. Here is the trade laid out honestly: the crowd numbers, the closures in the order they happen, when the black oaks actually turn, and the two animals that make autumn a different park.",
    seoDek: "Yosemite in fall: how September, October and November compare, when fall color peaks, when the Half Dome cables and Tioga Road close, and which week to pick.",
    date: "August 2, 2026",
    isoDate: "2026-08-02",
    isoModified: "2026-08-02",
    read: "9 min",
    placeholder: "Tunnel View in autumn, with fresh snow on the high rims above fall color on the Valley floor",
    image: "img/tunnel-view-autumn-aniket-deole.jpg",
    credit: "Photo: Aniket Deole / Unsplash",
  },
  {
    slug: "yosemite-tunnel-trees",
    cat: "wildlife",
    title: "From the Archive: the year Yosemite measured a hole in a sequoia to the half inch",
    dek: "In April 1929 the park's own bulletin ran a proud accounting of its three tunnel trees: who cut them, what they were paid, and how well the photographs were selling. The first in an occasional series reading the Nature Notes archive.",
    seoDek: "Yosemite's three tunnel trees, from the park's own 1929 bulletin: the Dead Giant, the California Tree, the Wawona Tree, and what you can still walk through.",
    date: "July 26, 2026",
    isoDate: "2026-07-26",
    isoModified: "2026-07-26",
    read: "8 min",
    placeholder: "A historic photograph of a stagecoach and horse team standing inside the tunnel cut through the base of the Wawona Tunnel Tree in the Mariposa Grove",
    image: "img/wawona-tunnel-tree-historic.jpg",
  },
  {
    slug: "yosemite-wildlife-viewing-guide",
    cat: "wildlife",
    title: "Where the Animals Actually Are: A Naturalist's Guide to Watching Wildlife in Yosemite",
    dek: "Yosemite's wildlife is not hiding, it is on a schedule most visitors never match. Twenty seasons of watching, condensed: the two principles that decide every sighting, the Valley's deer, coyotes, and bobcats, the high-country pika and marmots, and the rules that double as technique.",
    seoDek: "Where to see wildlife in Yosemite: bears, mule deer, coyotes, bobcats, marmots, pika, and great gray owls, plus the best times, places, and viewing rules.",
    date: "July 18, 2026",
    isoDate: "2026-07-18",
    isoModified: "2026-07-18",
    read: "10 min",
    placeholder: "Mule deer grazing a Yosemite meadow at golden hour beneath Half Dome",
    image: "img/half-dome-meadow-deer-johannes-andersson.jpg",
    credit: "Photo: Johannes Andersson / Unsplash",
  },
  {
    slug: "showy-milkweed-yosemite-valley",
    cat: "wildlife",
    title: "Showy milkweed is blooming in Yosemite Valley, and the monarchs depend on it",
    dek: "Out in the Valley meadows right now, Cook's Meadow among the best of them, showy milkweed is holding up fist-sized clusters of dusty pink flowers. A naturalist on the strangest flower in the park, the monarch that cannot live without it, and why it should be left standing.",
    seoDek: "Showy milkweed (Asclepias speciosa) is blooming in Yosemite Valley in July. How to identify it, the monarchs that depend on it, and where to see it.",
    date: "July 17, 2026",
    isoDate: "2026-07-17",
    isoModified: "2026-07-17",
    read: "7 min",
    placeholder: "A nature-journal illustration of showy milkweed, Asclepias speciosa, with its pink flower umbels, felted leaves, seed pod, and a monarch butterfly and caterpillar",
    image: "img/showy-milkweed-nature-journal.jpg",
    credit: "Illustration: field nature journal",
  },
  {
    slug: "yosemite-connecting-to-traditions",
    cat: "seasonal",
    title: "Connecting to Traditions: Meet Yosemite's Indigenous Artists This Summer and Fall",
    dek: "The Yosemite Museum's free Connecting to Traditions series runs July through October: basket weaving, beadwork, acorn, and stone tool knapping, demonstrated by members of the tribes who have tended this land for thousands of years. The full schedule, and why it is the best free hour in the park.",
    seoDek: "Yosemite's free Connecting to Traditions demonstrations, July to October 2026: basket weaving, beadwork, acorn, and knapping at the Yosemite Museum.",
    date: "July 16, 2026",
    isoDate: "2026-07-16",
    isoModified: "2026-07-16",
    read: "3 min",
    placeholder: "The Connecting to Traditions cultural demonstration program flyer, a partially woven Native basket above the summer and fall schedule",
    image: "img/connecting-to-traditions-flyer.jpg",
  },
  {
    slug: "yosemite-waterfalls-guide",
    cat: "trails",
    title: "The Waterfalls of Yosemite: What's Flowing, and When",
    dek: "Yosemite's waterfalls are snowmelt events, not permanent features, and the internet's photos never say what month they were taken. Which falls run all year, which vanish by August, and the month-by-month schedule nobody puts on the poster.",
    seoDek: "Yosemite waterfalls by season: when Yosemite Falls, Bridalveil, Vernal, Nevada, Ribbon, and Wapama actually flow, which dry up by August, and the best months.",
    date: "July 12, 2026",
    isoDate: "2026-07-12",
    isoModified: "2026-07-12",
    read: "8 min",
    placeholder: "Upper Yosemite Fall at full spring flow, the 1,430-foot free leap of the tallest waterfall in North America",
    image: "img/upper-yosemite-fall-jesse-callahan.jpg",
  },
  {
    slug: "yosemite-photography-spots",
    cat: "planning",
    title: "Where to Photograph Yosemite: The Spots, the Light, and When to Be There",
    dek: "The famous spots are famous because they work. Tunnel View to Olmsted Point, eight proven vantage points, the hour that makes each one, and why a clearing storm beats any blue sky in the park.",
    seoDek: "Yosemite photography guide: Tunnel View, Valley View, Glacier Point, and five more proven spots, plus the best light, seasons, firefall, and moonbow timing.",
    date: "July 12, 2026",
    isoDate: "2026-07-12",
    isoModified: "2026-07-12",
    read: "8 min",
    placeholder: "Half Dome at eye level from the Valley rim in late golden-hour light",
    image: "img/half-dome-golden-hour-clouds.jpg",
    credit: "Photo: Katie Mukhina / Pexels",
  },
  {
    slug: "horsetail-fall-firefall",
    cat: "seasonal",
    title: "Horsetail Fall: How the February Firefall Actually Works",
    dek: "For two weeks in February, a thin seasonal waterfall on El Capitan glows like lava at sunset, when three conditions all cooperate. The physics, the odds, the Galen Rowell history, the crowd rules, and why a failed evening still isn't a wasted one.",
    seoDek: "How the Yosemite firefall works: when Horsetail Fall glows in February, the three conditions required, viewing at El Capitan Picnic Area, and honest odds.",
    date: "July 12, 2026",
    isoDate: "2026-07-12",
    isoModified: "2026-07-16",
    read: "7 min",
    placeholder: "Horsetail Fall glowing orange at sunset on the east shoulder of El Capitan",
    image: "img/horsetail-fall-firefall-cedric-letsch.jpg",
  },
  {
    slug: "yosemite-in-winter",
    cat: "seasonal",
    title: "Yosemite in Winter: The Season the Crowds Forget",
    dek: "The Valley stays open all year, and almost nobody comes. What actually closes, the chain rules explained plainly, Badger Pass and the Dewey Point snowshoe, the rink under Half Dome, and why clearing storms are the photographs of the year.",
    seoDek: "Yosemite in winter: what's open and closed, Highway 140 and chain control explained, Badger Pass, Dewey Point snowshoeing, the Curry Village rink, and firefall.",
    date: "July 12, 2026",
    isoDate: "2026-07-12",
    isoModified: "2026-08-06",
    read: "8 min",
    placeholder: "Half Dome in fresh snow as a winter storm tears apart above it",
    image: "img/half-dome-winter-storm.jpg",
  },
  {
    slug: "where-to-stay-in-yosemite",
    cat: "planning",
    title: "Where to Stay Inside Yosemite: Every In-Park Option, Honestly Ranked",
    dek: "Six in-park options, one concessioner, and almost nothing in common: the Ahwahnee's real value, the Lodge's unbeatable address, Curry Village's canvas tradeoffs, the Housekeeping Camp sleeper pick, and the 366-day booking game that decides all of it.",
    seoDek: "Every place to stay inside Yosemite, ranked: the Ahwahnee, Valley Lodge, Curry Village, Housekeeping Camp, high-country camps, and the 366-day booking game.",
    date: "July 12, 2026",
    isoDate: "2026-07-12",
    isoModified: "2026-08-01",
    read: "8 min",
    placeholder: "Yosemite Valley at sunset, home to the Ahwahnee, Valley Lodge, Curry Village, and Housekeeping Camp",
    image: "img/valley-view-sunset-rodrigo-soares.jpg",
  },
  {
    slug: "yosemite-wildflowers-guide",
    cat: "wildlife",
    title: "Yosemite Wildflowers: A Bloom Calendar That Climbs the Mountain",
    dek: "Spring in Yosemite climbs 8,000 feet in five months, from canyon poppies in March to Tuolumne paintbrush in August. Where to stand at every elevation as the bloom moves uphill, and why the meadows get all the flowers.",
    seoDek: "Yosemite wildflowers by month and elevation: Merced canyon poppies, Valley dogwood and azalea, McGurk Meadow lupine, and Tuolumne's short alpine summer.",
    date: "July 12, 2026",
    isoDate: "2026-07-12",
    isoModified: "2026-07-12",
    read: "7 min",
    placeholder: "Midsummer wildflowers crowding a Yosemite meadow as the bloom nears the top of its climb",
    image: "img/wildflowers.jpg",
  },
  {
    slug: "watching-climbers-el-capitan",
    cat: "planning",
    title: "Watching Climbers on El Capitan: A Spectator's Guide to the Biggest Wall in America",
    dek: "Three thousand feet of granite, climbers who live on it for days, and headlamps that turn the wall into a constellation at dusk. Where to stand, what the binoculars reveal, the Ask a Climber scopes, and why the meadow is the best free show in the park.",
    seoDek: "How to watch climbers on El Capitan: El Capitan Meadow and Bridge viewpoints, the Ask a Climber program, dusk headlamps, Nose history, and best seasons.",
    date: "July 12, 2026",
    isoDate: "2026-07-12",
    isoModified: "2026-07-12",
    read: "7 min",
    placeholder: "El Capitan's 3,000-foot southwest face in afternoon light, seen from the Valley floor",
    image: "img/yosemite-valley-granite-summer-cory-goehring.jpg",
    credit: "Photo: Cory Goehring",
  },
  {
    slug: "getting-to-yosemite",
    cat: "planning",
    title: "Getting to Yosemite: Five Entrances, and How to Pick the Right One",
    dek: "Yosemite has five entrances and they are nothing alike. Which highway fits which trip, real drive times, why your phone's routing cannot be trusted, what winter chain control means, and the YARTS bus that solves parking entirely.",
    seoDek: "How to get to Yosemite: all five entrances compared, drive times from San Francisco and Fresno, winter chain rules, GPS warnings, and YARTS bus routes.",
    date: "July 12, 2026",
    isoDate: "2026-07-12",
    isoModified: "2026-08-07",
    read: "7 min",
    placeholder: "Highway 140 following the Merced River canyon toward the Arch Rock entrance",
    image: "img/merced-canyon-road-cory-goehring.jpg",
    credit: "Photo: Cory Goehring",
  },
  {
    slug: "yosemite-wilderness-permits-guide",
    cat: "planning",
    title: "The Yosemite Wilderness Permit, Explained",
    dek: "Ninety-five percent of Yosemite is wilderness, and sleeping in it takes a permit most visitors never figure out. The 24-week lottery, the seven-day release, the Half Dome add-on, and the strategy that actually gets you out there.",
    seoDek: "How Yosemite wilderness permits work in 2026: the 24-week Recreation.gov lottery, the 7-day release, fees, the Half Dome add-on, and a strategy that works.",
    date: "July 11, 2026",
    isoDate: "2026-07-11",
    isoModified: "2026-08-07",
    read: "6 min",
    placeholder: "The Tuolumne high country under afternoon light, most of it a day's walk from any road",
    image: "img/tuolumne-high-country-cory-goehring.jpg",
    credit: "Photo: Cory Goehring",
  },
  {
    slug: "yosemite-accessibility-guide",
    cat: "planning",
    title: "An Accessible Yosemite: What Works, and How to Plan for It",
    dek: "The best view in Yosemite Valley is from a flat, paved loop. Wheelchair-accessible trails, the accessible Valley shuttle, Deaf services, the free Access Pass, and the planning arithmetic the brochures soften.",
    seoDek: "Accessible Yosemite: wheelchair-friendly trails, the accessible Valley shuttle, ASL and Deaf services, the free Access Pass, and honest planning advice.",
    date: "July 10, 2026",
    isoDate: "2026-07-10",
    isoModified: "2026-07-10",
    read: "6 min",
    placeholder: "Lower Yosemite Fall at peak flow above the paved, accessible loop trail",
    image: "img/lower-yosemite-fall.jpg",
  },
  {
    slug: "pets-in-yosemite",
    cat: "planning",
    title: "Bringing a Dog to Yosemite: The Rules, the Two Trails, and an Honest Answer",
    dek: "Yosemite is one of the least dog-friendly parks in the country, by design, and nobody tells you before the drive. Where a leashed dog can actually go, the two legal trails, campground rules, and when to leave the dog home.",
    seoDek: "Are dogs allowed in Yosemite? The leash rules, the only two trails that allow pets, which campgrounds work, and an honest take on bringing the dog at all.",
    date: "July 9, 2026",
    isoDate: "2026-07-09",
    isoModified: "2026-08-01",
    read: "5 min",
    placeholder: "The Wawona Meadow, home to one of the park's two dog-legal trails",
    image: "img/wawona-meadow-loop.jpg",
    credit: "Photo: C.C. Pierce / Wikimedia Commons (public domain)",
  },
  {
    slug: "yosemite-ranger-programs",
    cat: "planning",
    title: "The Best Thing in Yosemite Is Free: Ranger Programs and the Junior Ranger Badge",
    dek: "Guided walks, evening amphitheater programs, and a badge ceremony performed with complete seriousness for five-year-olds and forty-five-year-olds alike. How to find the schedule and which program to pick if you only attend one.",
    seoDek: "Yosemite's free ranger programs: guided walks, evening amphitheater talks, the Junior Ranger badge, and how to find the schedule in the Yosemite Guide.",
    date: "July 8, 2026",
    isoDate: "2026-07-08",
    isoModified: "2026-07-08",
    read: "5 min",
    placeholder: "A child on the Lower Yosemite Fall boardwalk, Upper Yosemite Fall behind",
    image: "img/kid-yosemite-falls-boardwalk.jpg",
  },
  {
    slug: "yosemite-camping-complete-guide",
    cat: "planning",
    title: "The Dirt on Camping in Yosemite: All 13 Campgrounds",
    dek: "Thirteen campgrounds, three booking windows, and a bear box you will come to respect. Twenty years of sleeping on this ground: how to get a site when they vanish in minutes, which campgrounds are worth it, and where to go when everything is full.",
    seoDek: "Camping in Yosemite in 2026? All 13 campgrounds, reservation tips, cancellation tricks, and bear safety from a park naturalist who lives here.",
    date: "July 10, 2026",
    isoDate: "2026-07-10",
    isoModified: "2026-08-07",
    read: "21 min",
    // INTERIM HERO. The intended hero is the public-domain Detroit Publishing
    // Co. postcard "Camp Ahwahnee, Sentinel Rock" (a tent camp on the Valley
    // floor, ca. early 1900s). Its pixels could not be fetched in the authoring
    // environment, so a repo image stands in. To swap: add the postcard at
    // img/camp-ahwahnee-sentinel-rock.jpg, replace the three active fields below
    // with the three commented postcard fields, then run
    // `npm --prefix scripts run images && npm --prefix scripts run seo`.
    // placeholder: "A hand-colored postcard of a tent camp on the meadow floor beneath Sentinel Rock in Yosemite Valley",
    // image: "img/camp-ahwahnee-sentinel-rock.jpg",
    // credit: "Detroit Publishing Co. postcard, early 1900s. Public domain.",
    placeholder: "Half Dome under a star-filled night sky above Yosemite Valley",
    image: "img/half-dome-starry-night-casey-horner.jpg",
    credit: "Photo: Casey Horner / Unsplash",
  },
  {
    slug: "where-to-propose-in-yosemite",
    cat: "planning",
    title: "Where to Propose in Yosemite: What Twenty Years of Watching Taught Me",
    dek: "A naturalist who has watched hundreds of proposals on which Yosemite spots actually work, which famous overlooks are too crowded to bother with, the regulations nobody mentions, and why the simplest moments are the ones that land.",
    seoDek: "A Yosemite naturalist's guide to the best proposal spots. Which locations work, which are too crowded, and what makes the moment land.",
    date: "June 24, 2026",
    isoDate: "2026-06-24",
    isoModified: "2026-06-24",
    read: "20 min",
    placeholder: "A lavender wreath hanging from a wooden post above a blooming lavender field",
    image: "img/lavender-wreath-proposal-cory-goehring.jpg",
    credit: "Photo: Cory Goehring",
  },
  {
    slug: "yosemite-bears-safety-guide",
    cat: "wildlife",
    title: "The Bear Spray You Packed for Yosemite Is Illegal",
    dek: "Bear spray is illegal in Yosemite, and so is most of what you think you know about bears. A naturalist debunks six myths and explains what actually keeps you safe.",
    seoDek: "Bear spray is banned in Yosemite. So is most of what you think you know about bears. A naturalist's guide to six myths and what actually keeps you safe.",
    date: "June 16, 2026",
    isoDate: "2026-06-16",
    isoModified: "2026-06-16",
    read: "16 min",
    placeholder: "A brown-phase black bear foraging at the edge of a Yosemite roadside",
    image: "img/black-bear-roadside.jpg",
    credit: "Photo: Cory Goehring",
  },
  {
    slug: "yosemite-heat-safety-guide",
    cat: "seasonal",
    title: "Yosemite Heat Safety: A Naturalist's Survival Guide",
    dek: "Yosemite Valley is a granite oven in July and August. A naturalist on which trails will cook you, the water math, where to swim safely, and how to escape the heat uphill.",
    seoDek: "How hot does Yosemite get in summer? A naturalist's guide to which trails to avoid, where to swim, and how to stay safe in Yosemite Valley heat.",
    date: "June 16, 2026",
    isoDate: "2026-06-16",
    isoModified: "2026-06-16",
    read: "16 min",
    placeholder: "Tenaya Lake, high-country water on a hot afternoon",
    image: "img/tenaya-lake.jpg",
    credit: "Photo: Michael Hogarth / Wikimedia Commons (public domain)",
  },
  {
    slug: "when-to-visit-yosemite-2026-crowd-forecast",
    cat: "planning",
    title: "When to Visit Yosemite in 2026: What the Traffic Data Says",
    dek: "The reservation system is gone and the park is pacing toward its second-busiest year ever. A decade of NPS visitation data, a month-by-month forecast for the rest of 2026, and the days that still work.",
    seoDek: "Yosemite has no reservation system in 2026 and is pacing toward its second-busiest year ever. NPS data, a month-by-month forecast, and the best days to visit.",
    date: "June 11, 2026",
    isoDate: "2026-06-11",
    isoModified: "2026-06-11",
    read: "11 min",
    placeholder: "Vernal Fall at high water in late spring, the start of the park's heaviest months",
    image: "img/vernal-fall-high-water.jpg",
    credit: "Photo: Brandon Raines / Pexels",
  },
  {
    slug: "yosemite-trip-cost-budget-2026",
    cat: "planning",
    title: "What a Yosemite Trip Actually Costs in 2026",
    dek: "Entrance fees, lodging, food, gas, gear, and guided programs, with real 2026 numbers and three full trip totals: shoestring, comfortable mid-range, and splurge.",
    seoDek: "What a Yosemite trip costs in 2026: entrance fees, lodging, food, gas, and gear, with real budget, mid-range, and splurge totals.",
    date: "June 7, 2026",
    isoDate: "2026-06-07",
    isoModified: "2026-08-01",
    read: "10 min",
    placeholder: "The Ahwahnee under snow, the park's most expensive lodging",
    image: "img/ahwahnee-hotel.jpg",
    credit: "Photo: Chris Dunstan / Wikimedia Commons (public domain)",
  },
  {
    slug: "yosemite-in-june-2026",
    cat: "seasonal",
    title: "Yosemite in June 2026: Two Junes, One Month",
    dek: "Low snowpack pushed everything earlier and the reservation system is gone. The waterfalls, the road openings, the crowds, the bears, and how to plan for the June you are actually getting.",
    seoDek: "A Yosemite naturalist breaks down June 2026 conditions: low snowpack, no reservations, early waterfall peak, Tioga Road open, and how to plan around all of it.",
    date: "June 2, 2026",
    isoDate: "2026-06-02",
    isoModified: "2026-08-06",
    read: "10 min",
    placeholder: "Upper Yosemite Fall framed by spring blossoms from the Valley floor",
    image: "img/yosemite-falls-spring-blossoms-cory-goehring.jpg",
    credit: "Photo: Cory Goehring",
  },
  {
    slug: "cathedral-lakes-day-hike",
    cat: "trails",
    title: "Cathedral Lakes: the high-country day hike worth driving up for",
    dek: "The standard high-country day hike out of Tuolumne Meadows, and it still earns the listing. Trail distance, elevation, the best months, what to actually look at, and how to do Lower and Upper Cathedral Lakes well.",
    seoDek: "Cathedral Lakes is the best day hike in Tuolumne Meadows. Trail distance, elevation, best months, and how to hike Lower and Upper Cathedral Lakes in Yosemite.",
    date: "June 2, 2026",
    isoDate: "2026-06-02",
    isoModified: "2026-06-02",
    read: "12 min",
    placeholder: "Cathedral Peak reflected in Lower Cathedral Lake",
    image: "img/cathedral-lakes.jpg",
    credit: "Photo: Steve Dunleavy / Wikimedia Commons (CC BY 2.0)",
  },
  {
    slug: "yosemite-needs-a-reservation-system",
    cat: "planning",
    title: "Yosemite needs a reservation system",
    dek: "Dropping the reservation system fails the park on both halves of its mission: this Memorial Day weekend, visitors couldn't recreate and the meadows took the damage. A naturalist's case for bringing it back.",
    seoDek: "Without a reservation system, Memorial Day 2026 left Yosemite Valley gridlocked and its meadows damaged. Why the park needs timed entry back.",
    date: "May 26, 2026",
    isoDate: "2026-05-26",
    isoModified: "2026-05-26",
    read: "10 min",
    placeholder: "A split-rail fence along a Yosemite Valley meadow below Cathedral Rocks at dusk",
    image: "img/cathedral-rocks-meadow-fence.jpg",
    credit: "Photo: Q W / Pexels",
  },
  {
    slug: "memorial-day-skip-the-valley-go-high-2026",
    cat: "seasonal",
    title: "So you decided to come to Yosemite on Memorial Day. What are you thinking?",
    dek: "Yosemite Valley will be a parking lot on Memorial Day weekend 2026. With Tioga Road and Glacier Point Road both open early, the move is to skip the Valley and spend the weekend 4,000 feet up in the high country.",
    seoDek: "Yosemite Valley will be gridlock on Memorial Day weekend 2026. Tioga Road and Glacier Point Road are open early. Skip the Valley, go to the high country.",
    date: "May 20, 2026",
    isoDate: "2026-05-20",
    isoModified: "2026-05-20",
    read: "7 min",
    placeholder: "Half Dome from a Glacier Point Road overlook",
    image: "img/half-dome-glacier-point-road-josh-carter.jpg",
    credit: "Photo: Josh Carter / Unsplash",
  },
  {
    slug: "where-to-eat-yosemite",
    cat: "planning",
    title: "Where to Eat in Yosemite: Every Area, and What Closes When",
    dek: "Where the food actually is, area by area: the Valley's five kitchens, the seasonal grill on Tioga Road, the gateway towns worth the drive, and the places that have no restaurant at all.",
    seoDek: "Restaurants in Yosemite Valley, Wawona, Tuolumne and the gateway towns, with prices, seasons and reservations. From a resident who eats in them.",
    date: "May 19, 2026",
    isoDate: "2026-05-19",
    isoModified: "2026-08-25",
    read: "9 min",
    placeholder: "The Merced River at Cathedral Beach, one of the Valley's picnic areas",
    image: "img/cathedral-beach-quiet-picnic.jpg",
    credit: "Photo: Todd Petrie / Wikimedia Commons (CC BY 2.0)",
  },
  {
    slug: "yosemite-in-one-or-two-days",
    cat: "planning",
    title: "One day in Yosemite: a minimalist itinerary for one or two days",
    dek: "One day in Yosemite is enough if you start early and do less. A deliberate one-or-two-day itinerary for 2026: the Valley waterfall sequence, what to skip, and what a second day above the floor earns you.",
    seoDek: "One day in Yosemite, done right: a 2026 itinerary for one or two days. The Valley waterfall sequence, what to skip, gas, parking, and a realistic hike.",
    date: "May 19, 2026",
    isoDate: "2026-05-19",
    isoModified: "2026-08-07",
    read: "16 min",
    placeholder: "The cliff edge at Taft Point, El Capitan across the valley",
    image: "img/taft-point.jpg",
    credit: "Photo: Cam Adams / Wikimedia Commons (CC0)",
    faq: [
      {
        q: "How many days do you need in Yosemite?",
        a: "One full day, started early, covers the Valley highlights. A second day adds Glacier Point, Mariposa Grove, or Tioga Road above the Valley floor. Beyond two days you are into backcountry and repeat-visit territory.",
      },
      {
        q: "Do I need a reservation to enter Yosemite in 2026?",
        a: "No. Yosemite has no day-use or peak-hours reservation in 2026. You still need a valid entrance pass ($35 per vehicle for seven days), and international visitors pay a $100 per-person surcharge (age 16 and older) since January 1, 2026.",
      },
      {
        q: "When do the Yosemite waterfalls run?",
        a: "Spring snowmelt is the engine, and the peak is roughly April through June. By late summer the falls are low to dry, and a few stop entirely.",
      },
      {
        q: "Is Glacier Point Road open?",
        a: "Yes. It reopened for the season on May 9, 2026, and closes again on September 8 for continued construction. There is no water at the overlook, so fill your bottles before you drive up.",
      },
      {
        q: "Is Tioga Road open?",
        a: "Yes. It opened on May 15, 2026, the gateway to the high country and Tuolumne Meadows. It closes again with the first heavy snow in fall.",
      },
      {
        q: "Where do I get gas in Yosemite?",
        a: "Not in Yosemite Valley; there are no pumps there. In-park gas is at Crane Flat and Wawona, and outside the park you can fill at El Portal, Oakhurst, or Lee Vining.",
      },
      {
        q: "Is the Mist Trail open in 2026?",
        a: "Mostly. Trail work closes sections of it Monday through Thursday, 7 a.m. to 3:30 p.m., into late October 2026, with a detour via the John Muir Trail. Friday through Sunday it runs normally, and the Vernal Fall footbridge stays the reliable short option.",
      },
      {
        q: "Can I leave food in my car in Yosemite?",
        a: "Out of sight, windows closed, in daylight only, and never overnight. The fines for improper food storage run up to $5,000. When in doubt, use the bear lockers at the trailheads.",
      },
      {
        q: "Is the Wawona Hotel open?",
        a: "No. It has been closed since December 2024 for a condition assessment, and there is no announced reopening date.",
      },
    ],
  },
  {
    slug: "four-mile-up-panorama-down",
    cat: "trails",
    title: "My favorite day hike in Yosemite: Four Mile up, Panorama down",
    dek: "Up the Four Mile Trail to Glacier Point, down the Panorama Trail past Illilouette and Nevada Falls. A 13-mile loop that climbs 3,200 feet and gives you back the whole park. The logistics that make it work.",
    seoDek: "Four Mile Trail up to Glacier Point, Panorama Trail down past Nevada Fall. A 13-mile loop, 3,200 feet of climb, and the logistics that make it work.",
    date: "May 17, 2026",
    isoDate: "2026-05-17",
    isoModified: "2026-05-17",
    read: "13 min",
    placeholder: "Looking up the Four Mile Trail toward Glacier Point",
    image: "img/960px-Four_Mile_Trailhead_with_constrast_mask.jpg",
    credit: "Photo: Alex / Wikimedia Commons (CC BY 3.0)",
  },
  {
    slug: "yosemite-with-kids-no-reservations-2026",
    cat: "planning",
    title: "Your last-minute Yosemite trip with kids: a naturalist's honest guide",
    dek: "A senior Yosemite naturalist's honest guide to visiting with kids in 2026, no advance reservations needed. Kid-friendly hikes, timing tricks, YARTS bus tips, and what most families get wrong.",
    seoDek: "A senior naturalist's guide to Yosemite with kids in 2026, no reservations needed. Kid-friendly hikes, timing, YARTS, and what families get wrong.",
    date: "May 14, 2026",
    isoDate: "2026-05-14",
    isoModified: "2026-08-06",
    read: "16 min",
    placeholder: "Giant sequoias in the Mariposa Grove, a family favorite",
    image: "img/mariposa-grove.jpg",
    credit: "Photo: Dietmar Rabich / Wikimedia Commons (CC BY-SA 4.0)",
  },
  {
    slug: "tioga-road-opening-weekend-2026",
    cat: "seasonal",
    title: "Tioga Road opens May 15: a plan for opening weekend",
    dek: "Tioga Road and Tioga Pass open Friday, May 15, well ahead of the long-term average. What's open in Tuolumne Meadows, the road conditions, the short hikes that actually work in mid-May, and how to make a day of it east to Lee Vining and Mono Lake.",
    seoDek: "Tioga Road opens May 15, 2026. What's open in Tuolumne Meadows, road conditions, short hikes for mid-May, and a day east to Lee Vining and Mono Lake.",
    date: "May 13, 2026",
    isoDate: "2026-05-13",
    isoModified: "2026-05-13",
    read: "11 min",
    placeholder: "Tuolumne Meadows in early season, Tioga Road",
    image: "img/tuolumne-meadows.jpg",
  },
  {
    slug: "so-you-want-to-hike-half-dome",
    cat: "trails",
    title: "So you want to hike Half Dome",
    dek: "The honest case for the cables, and the better hike most visitors don't know about: Clouds Rest, a thousand feet higher than Half Dome, with bigger views and no permit required.",
    seoDek: "The honest case for the Half Dome cables, and the better hike most miss: Clouds Rest, a thousand feet higher, with bigger views and no permit.",
    date: "May 12, 2026",
    isoDate: "2026-05-12",
    isoModified: "2026-05-12",
    read: "17 min",
    placeholder: "Half Dome rising 4,800 feet from the Yosemite Valley floor",
    image: "img/half-dome.jpg",
  },
  {
    slug: "glacier-point-road-open-2026",
    cat: "seasonal",
    title: "Glacier Point Road is open: a plan for the early season",
    dek: "The road climbs seventeen miles to a viewpoint at 7,200 feet that puts you at eye level with Half Dome. What is open at the top, what is not, and how to think about the first weeks of the 2026 season.",
    seoDek: "Seventeen miles to a 7,200-foot viewpoint at eye level with Half Dome. What is open at the top, what is not, and how to plan early-season 2026.",
    date: "May 11, 2026",
    isoDate: "2026-05-11",
    isoModified: "2026-05-11",
    read: "9 min",
    placeholder: "Half Dome at sunset, from Glacier Point",
    image: "img/half-dome-sunset-glacier-point-joshua-earle.jpg",
    credit: "Photo: Joshua Earle / Unsplash",
  },
  {
    slug: "mist-trail-the-real-guide",
    cat: "trails",
    title: "The Mist Trail: everything the internet isn't telling you",
    dek: "The most hiked trail in any national park generates more questions than every other Yosemite trail combined. The honest answers about shoes, water, when to go, and whether you can actually die out there.",
    seoDek: "The most hiked trail in any national park. The honest answers about shoes, water, when to go, and whether you can actually die out there.",
    date: "May 11, 2026",
    isoDate: "2026-05-11",
    isoModified: "2026-05-11",
    read: "12 min",
    placeholder: "Nevada Fall and Liberty Cap from the John Muir Trail",
    image: "img/nevada-fall-liberty-cap-ryan-oconnor.jpg",
    credit: "Photo: Ryan O'Connor / Unsplash",
  },
  {
    slug: "working-in-yosemite",
    cat: "planning",
    title: "So you want to work in Yosemite",
    dek: "Most jobs in Yosemite aren't ranger jobs. The work is hospitality, the housing starts in a tent cabin, and the closest grocery store is an hour away. The honest version of what it's like to live here, before you sign anything.",
    seoDek: "Most jobs in Yosemite aren't ranger jobs. The work is hospitality, housing starts in a tent cabin, the grocery store is an hour away. The honest version.",
    date: "May 8, 2026",
    isoDate: "2026-05-08",
    isoModified: "2026-05-08",
    read: "10 min",
    placeholder: "Employee cabins at Curry Village, where much of the park's seasonal staff lives",
    image: "img/curry-village.jpg",
    credit: "Photo: US National Park Service / Wikimedia Commons (public domain)",
  },
  {
    slug: "water-ouzels-waterfalls",
    cat: "wildlife",
    title: "How water ouzels live inside a waterfall",
    dek: "A robin-sized bird walks directly into Yosemite Falls and stays there. The water ouzel is the most specialized animal in the high country, and its presence tells you the stream is healthy.",
    seoDek: "A robin-sized bird walks directly into Yosemite Falls and stays there. The water ouzel is the most specialized animal in the high country.",
    date: "May 8, 2026",
    isoDate: "2026-05-08",
    isoModified: "2026-05-08",
    read: "7 min",
    placeholder: "The rapids of the Merced River at Happy Isles, prime water-ouzel habitat",
    image: "img/happy-isles-ouzel-watch.jpg",
    credit: "Photo: George Fiske / Wikimedia Commons (public domain)",
  },
  {
    slug: "bears-spring-emergence",
    cat: "wildlife",
    title: "Why a Yosemite bear in April is more dangerous than one in August",
    dek: "A bear emerging from a winter den has lost a third of its body weight, has a digestive system that's barely awake, and is metabolically desperate. That's why spring, not summer, is the dangerous season.",
    seoDek: "A Yosemite bear emerging from its winter den has lost a third of its weight and is metabolically desperate. Spring, not summer, is the dangerous season.",
    date: "May 8, 2026",
    isoDate: "2026-05-08",
    isoModified: "2026-05-08",
    read: "8 min",
    placeholder: "Black bear foraging at meadow margin",
    image: "img/black-bear.jpg",
  },
  {
    slug: "yosemite-glaciers-climate",
    cat: "wildlife",
    title: "Yosemite's disappearing glaciers, and what they record",
    dek: "A ranger built a cairn at the toe of Mount Lyell Glacier in 1933. That cairn is now four hundred feet from the ice. The retreat is also a record of climate, written into the High Sierra in something like real time.",
    seoDek: "A ranger built a cairn at the toe of Mount Lyell Glacier in 1933. It's now four hundred feet from the ice. The retreat is a record of climate.",
    date: "May 8, 2026",
    isoDate: "2026-05-08",
    isoModified: "2026-05-08",
    read: "8 min",
    placeholder: "A high-country river cascade in the Merced watershed",
    image: "img/lyell-canyon.jpg",
    credit: "Photo: mypubliclands / Wikimedia Commons (public domain)",
  },
  {
    slug: "giant-sequoias-fire-adaptation",
    cat: "wildlife",
    title: "Why giant sequoias thrive where other trees burn",
    dek: "The same fires that kill every other tree in the Sierra are the ones the giant sequoia depends on. Two-foot bark, embedded tannins, and a seedling ecology that fails without burning.",
    seoDek: "The fires that kill every other Sierra tree are the ones giant sequoias depend on. Two-foot bark, embedded tannins, seedlings that need burning.",
    date: "May 8, 2026",
    isoDate: "2026-05-08",
    isoModified: "2026-05-08",
    read: "7 min",
    placeholder: "Giant sequoias along the trail into the Merced Grove",
    image: "img/merced-grove-sequoias.jpg",
    credit: "Photo: Darold Massaro / Wikimedia Commons (CC0)",
  },
  {
    slug: "hetch-hetchy-the-other-yosemite-valley",
    cat: "trails",
    title: "Hetch Hetchy: the Yosemite Valley you didn't know you skipped",
    dek: "Same elevation. Same length. Same kind of granite. Carved by the same kind of glacier as the famous one, and still mostly empty of visitors. Why almost no one goes, and why you should.",
    seoDek: "Same elevation, same length, same granite as Yosemite Valley. Carved by the same glaciers and still mostly empty. Why no one goes, and why you should.",
    date: "April 27, 2026",
    isoDate: "2026-04-27",
    isoModified: "2026-04-27",
    read: "10 min",
    placeholder: "Wapama Falls in spring snowmelt",
    image: "img/vernal-fall.jpg",
  },
  {
    slug: "yosemite-stargazing-where-to-look-up",
    cat: "seasonal",
    title: "Yosemite stargazing: where to look up, and when",
    dek: "On a moonless August night at Olmsted Point, the Milky Way doesn't look like a thin band. It casts shadows. Where to go, when to go, and how to see the sky the way our ancestors did.",
    seoDek: "On a moonless August night at Olmsted Point, the Milky Way casts shadows. Where to go, when to go, and how to see Yosemite the way the ancients did.",
    date: "April 27, 2026",
    isoDate: "2026-04-27",
    isoModified: "2026-04-27",
    read: "10 min",
    placeholder: "Milky Way over Sentinel Dome, July",
    image: "img/milky-way-sentinel-dome.jpg",
    credit: "Photo: Jackhen1992 / Wikimedia Commons (CC BY-SA 4.0)",
  },
  {
    slug: "yosemite-for-non-hikers",
    cat: "planning",
    title: "Yosemite for non-hikers: the park you can experience without a trail",
    dek: "Yosemite is built for non-hikers more thoroughly than almost any park in the country. A complete visit is possible without ever putting on hiking boots. Here's how to plan one.",
    seoDek: "Yosemite is built for non-hikers more thoroughly than almost any national park. A complete visit without ever putting on hiking boots. Plan one.",
    date: "April 26, 2026",
    isoDate: "2026-04-26",
    isoModified: "2026-08-06",
    read: "8 min",
    placeholder: "Tunnel View from the overlook parking",
    image: "img/tunnel-view.jpg",
  },
  {
    slug: "pack-your-car-for-yosemite",
    cat: "planning",
    title: "How to pack your car for a Yosemite trip",
    dek: "Nobody writes about packing the car. But the car is the base camp for most Yosemite trips, and what's in it decides whether a flat tire is an inconvenience or a crisis.",
    seoDek: "Nobody writes about packing the car. But the car is the base camp for most Yosemite trips, and what's in it decides crisis from inconvenience.",
    date: "April 26, 2026",
    isoDate: "2026-04-26",
    isoModified: "2026-04-26",
    read: "12 min",
    placeholder: "Cathedral Rocks across the Yosemite Valley, from a roadside pullout",
    image: "img/cathedral-rocks.jpg",
  },
  {
    slug: "yosemite-gateway-towns-compared",
    cat: "planning",
    title: "Mariposa or Oakhurst or Groveland: Which Yosemite Gateway to Book",
    dek: "Pick the wrong gateway town and you'll burn hours of every day on the road. Pick the right one and the rest of the trip gets easier. A side-by-side from someone who's stayed in all five.",
    seoDek: "Mariposa, Oakhurst, Groveland, El Portal and Lee Vining compared: drive times, winter access, what each town has, and which to book. From El Portal.",
    date: "April 26, 2026",
    isoDate: "2026-04-26",
    isoModified: "2026-08-25",
    read: "9 min",
    placeholder: "Looking down the Hetch Hetchy canyon from Lookout Point",
    image: "img/lookout-point.jpg",
    credit: "Photo: KatieRound / Wikimedia Commons (CC BY-SA 4.0)",
  },
  {
    slug: "yosemite-during-smoke-season",
    cat: "seasonal",
    title: "Yosemite during smoke season: how to actually plan around it",
    dek: "Smoke season in California now runs July through October. The question isn't whether your trip will overlap with it. It's whether you have a plan for when it does.",
    seoDek: "Smoke season in California now runs July through October. The question isn't whether your Yosemite trip overlaps. It's whether you have a plan.",
    date: "April 26, 2026",
    isoDate: "2026-04-26",
    isoModified: "2026-04-26",
    read: "7 min",
    placeholder: "Nevada Fall and the Merced canyon under haze at last light",
    image: "img/nevada-fall-canyon-haze.jpg",
    credit: "Photo: Sideesh Balasubramani / Pexels",
  },
  {
    slug: "yosemite-without-reservations-2026",
    cat: "planning",
    title: "Yosemite without reservations in 2026: a real strategy for the year the cap came off",
    dek: "The reservation system was a throttle. With it gone in 2026, the park hasn't gotten easier. It's gotten harder. Here's the real strategy.",
    seoDek: "The reservation cap came off for 2026. The park didn't get easier, it got harder. A real strategy for visiting Yosemite without reservations.",
    date: "April 26, 2026",
    isoDate: "2026-04-26",
    isoModified: "2026-08-06",
    read: "8 min",
    placeholder: "Mist on a Yosemite Valley wall above a talus slope on a quiet morning",
    image: "img/talus-flows-yosemite.jpg",
  },
  {
    slug: "first-time-yosemite-overwhelm",
    cat: "planning",
    title: "If it's your first time in Yosemite, read this before you book anything",
    dek: "The bucket list isn't the problem. The strategy is. Three things turn a Yosemite visit from “we saw the things” into one of the best weeks of your life.",
    seoDek: "The bucket list isn't the problem, the strategy is. Three things that turn a first Yosemite visit from a checklist into the best week of your year.",
    date: "April 25, 2026",
    isoDate: "2026-04-25",
    isoModified: "2026-08-07",
    read: "6 min",
    placeholder: "Half Dome down the length of Yosemite Valley under summer cumulus",
    image: "img/half-dome-valley-cumulus.jpg",
    credit: "Photo: elijahjcobb / Pexels",
  },
];

// Curated onboarding row on the homepage. Order is the read order.
window.START_HERE = [
  "first-time-yosemite-overwhelm",
  "yosemite-without-reservations-2026",
  "yosemite-gateway-towns-compared",
  "yosemite-in-one-or-two-days",
];

// Related reading, hand-curated per article.
//
// The related rail used to pick same-section pieces in catalog order, filtered
// by what the reader had already finished. A crawler has no read history, so
// every article in a section produced the same three links, and the site's
// whole internal link graph funnelled onto a handful of early-catalog pieces:
// Search Console counted 1,557 internal links reaching 33 pages, of which only
// five were articles. Sixty-six articles received no contextual link at all.
//
// Curation here is by topic, not recency, and it feeds three places at once:
// the rail readers see, the "Related reading" block the Worker injects for
// crawlers, and the `related` field in articles.json. Rules: 4 to 6 entries,
// every slug real, no self-reference. gen-seo-artifacts.mjs enforces all three
// and fails the build otherwise, because a dead entry here is a dead link on a
// published page.
//
// An article with no entry falls back to relatedFor's rotation below, which is
// a legitimate outcome rather than an omission: the natural-history essays sit
// in a small section where "the rest of the section" is the honest answer.
// Curate a piece when it earns real search impressions, when it anchors a
// cluster, or when it is the destination that needs the equity.
window.RELATED = {
  // Lodging and gateway towns
  "yosemite-gateway-towns-compared": ["where-to-stay-in-yosemite", "yosemite-camping-complete-guide", "where-to-eat-yosemite", "yosemite-trip-cost-budget-2026", "getting-to-yosemite"],
  "where-to-stay-in-yosemite": ["yosemite-gateway-towns-compared", "yosemite-camping-complete-guide", "yosemite-trip-cost-budget-2026", "yosemite-without-reservations-2026", "where-to-eat-yosemite"],
  "yosemite-camping-complete-guide": ["camping-in-yosemite-first-time", "where-to-stay-in-yosemite", "yosemite-gateway-towns-compared", "first-yosemite-backpacking-trip", "yosemite-trip-cost-budget-2026"],
  "camping-in-yosemite-first-time": ["yosemite-camping-complete-guide", "yosemite-bears-safety-guide", "pack-your-car-for-yosemite", "where-to-stay-in-yosemite", "pets-in-yosemite"],
  "yosemite-trip-cost-budget-2026": ["where-to-stay-in-yosemite", "yosemite-gateway-towns-compared", "yosemite-camping-complete-guide", "where-to-eat-yosemite", "getting-to-yosemite"],

  // Food
  "where-to-eat-yosemite": ["yosemite-gateway-towns-compared", "where-to-stay-in-yosemite", "yosemite-camping-complete-guide", "yosemite-trip-cost-budget-2026", "yosemite-in-one-or-two-days", "pack-your-car-for-yosemite"],

  // Getting there and getting around
  "getting-to-yosemite": ["yosemite-shuttle-and-yarts", "yosemite-valley-parking-guide", "yosemite-gateway-towns-compared", "yosemite-day-trip-from-bay-area", "pack-your-car-for-yosemite"],
  "yosemite-shuttle-and-yarts": ["getting-to-yosemite", "yosemite-valley-parking-guide", "yosemite-for-non-hikers", "yosemite-accessibility-guide", "yosemite-day-trip-from-bay-area"],
  "yosemite-valley-parking-guide": ["getting-to-yosemite", "yosemite-shuttle-and-yarts", "yosemite-without-reservations-2026", "yosemite-in-one-or-two-days", "mist-trail-the-real-guide"],
  "yosemite-day-trip-from-bay-area": ["yosemite-in-one-or-two-days", "getting-to-yosemite", "yosemite-valley-parking-guide", "yosemite-for-non-hikers", "when-to-visit-yosemite-2026-crowd-forecast"],
  "pack-your-car-for-yosemite": ["yosemite-bears-safety-guide", "camping-in-yosemite-first-time", "getting-to-yosemite", "yosemite-valley-parking-guide", "first-time-yosemite-overwhelm"],

  // Permits
  "yosemite-wilderness-permits-guide": ["first-yosemite-backpacking-trip", "yosemite-walk-up-and-day-of-permits", "so-you-want-to-hike-half-dome", "yosemite-camping-complete-guide", "mist-trail-the-real-guide"],
  "yosemite-walk-up-and-day-of-permits": ["yosemite-wilderness-permits-guide", "so-you-want-to-hike-half-dome", "first-yosemite-backpacking-trip", "yosemite-without-reservations-2026", "mist-trail-the-real-guide"],
  "so-you-want-to-hike-half-dome": ["mist-trail-the-real-guide", "yosemite-wilderness-permits-guide", "cathedral-lakes-day-hike", "four-mile-up-panorama-down", "yosemite-heat-safety-guide"],
  "first-yosemite-backpacking-trip": ["yosemite-wilderness-permits-guide", "yosemite-bears-safety-guide", "cathedral-lakes-day-hike", "yosemite-camping-complete-guide", "yosemite-walk-up-and-day-of-permits"],

  // Trails
  "mist-trail-the-real-guide": ["yosemite-waterfalls-guide", "so-you-want-to-hike-half-dome", "four-mile-up-panorama-down", "yosemite-heat-safety-guide", "yosemite-valley-parking-guide"],
  "four-mile-up-panorama-down": ["mist-trail-the-real-guide", "yosemite-photography-spots", "so-you-want-to-hike-half-dome", "yosemite-waterfalls-guide", "glacier-point-road-open-2026"],
  "cathedral-lakes-day-hike": ["tuolumne-meadows-in-a-day", "tioga-road-opening-weekend-2026", "so-you-want-to-hike-half-dome", "first-yosemite-backpacking-trip", "yosemite-wildflowers-guide"],
  "tuolumne-meadows-in-a-day": ["cathedral-lakes-day-hike", "tioga-road-opening-weekend-2026", "yosemite-wildflowers-guide", "yosemite-stargazing-where-to-look-up", "memorial-day-skip-the-valley-go-high-2026"],
  "hetch-hetchy-the-other-yosemite-valley": ["yosemite-waterfalls-guide", "yosemite-without-reservations-2026", "yosemite-in-march", "yosemite-wildflowers-guide", "yosemite-glaciers-climate"],
  "yosemite-winter-hikes": ["yosemite-in-winter", "horsetail-fall-firefall", "yosemite-waterfalls-guide", "yosemite-for-non-hikers", "yosemite-photography-spots"],
  "yosemite-waterfalls-guide": ["mist-trail-the-real-guide", "when-to-visit-yosemite-2026-crowd-forecast", "hetch-hetchy-the-other-yosemite-valley", "yosemite-photography-spots", "water-ouzels-waterfalls", "yosemite-in-march"],

  // Who the trip is for
  "yosemite-for-non-hikers": ["yosemite-accessibility-guide", "yosemite-shuttle-and-yarts", "yosemite-photography-spots", "yosemite-in-one-or-two-days", "watching-climbers-el-capitan", "pets-in-yosemite"],
  "yosemite-accessibility-guide": ["yosemite-for-non-hikers", "yosemite-shuttle-and-yarts", "mariposa-grove-how-to-visit", "yosemite-valley-parking-guide", "yosemite-ranger-programs"],
  "yosemite-with-kids-no-reservations-2026": ["yosemite-ranger-programs", "yosemite-for-non-hikers", "swimming-in-the-merced", "yosemite-bears-safety-guide", "camping-in-yosemite-first-time"],
  "pets-in-yosemite": ["yosemite-for-non-hikers", "yosemite-accessibility-guide", "yosemite-camping-complete-guide", "yosemite-gateway-towns-compared", "yosemite-valley-parking-guide"],

  // First trips and timing
  "first-time-yosemite-overwhelm": ["yosemite-in-one-or-two-days", "when-to-visit-yosemite-2026-crowd-forecast", "yosemite-gateway-towns-compared", "yosemite-without-reservations-2026", "pack-your-car-for-yosemite"],
  "yosemite-in-one-or-two-days": ["yosemite-in-three-to-five-days", "first-time-yosemite-overwhelm", "yosemite-valley-parking-guide", "where-to-eat-yosemite", "yosemite-day-trip-from-bay-area", "where-to-propose-in-yosemite"],
  "yosemite-in-three-to-five-days": ["yosemite-in-one-or-two-days", "tuolumne-meadows-in-a-day", "mist-trail-the-real-guide", "yosemite-gateway-towns-compared", "when-to-visit-yosemite-2026-crowd-forecast"],
  "when-to-visit-yosemite-2026-crowd-forecast": ["yosemite-without-reservations-2026", "yosemite-in-fall", "yosemite-in-june-2026", "yosemite-gateway-towns-compared", "yosemite-in-march", "memorial-day-skip-the-valley-go-high-2026"],
  "yosemite-without-reservations-2026": ["when-to-visit-yosemite-2026-crowd-forecast", "yosemite-valley-parking-guide", "yosemite-walk-up-and-day-of-permits", "hetch-hetchy-the-other-yosemite-valley", "first-time-yosemite-overwhelm"],

  // Seasonal
  "yosemite-in-june-2026": ["when-to-visit-yosemite-2026-crowd-forecast", "yosemite-waterfalls-guide", "tioga-road-opening-weekend-2026", "yosemite-heat-safety-guide", "bears-spring-emergence"],
  "yosemite-in-fall": ["when-to-visit-yosemite-2026-crowd-forecast", "yosemite-in-winter", "yosemite-photography-spots", "yosemite-during-smoke-season", "so-you-want-to-hike-half-dome"],
  "yosemite-in-winter": ["yosemite-winter-hikes", "horsetail-fall-firefall", "when-to-visit-yosemite-2026-crowd-forecast", "yosemite-in-march", "yosemite-photography-spots"],
  "yosemite-in-march": ["yosemite-in-winter", "yosemite-waterfalls-guide", "bears-spring-emergence", "horsetail-fall-firefall", "when-to-visit-yosemite-2026-crowd-forecast"],
  "tioga-road-opening-weekend-2026": ["cathedral-lakes-day-hike", "tuolumne-meadows-in-a-day", "memorial-day-skip-the-valley-go-high-2026", "yosemite-stargazing-where-to-look-up", "when-to-visit-yosemite-2026-crowd-forecast"],
  "glacier-point-road-open-2026": ["four-mile-up-panorama-down", "yosemite-photography-spots", "yosemite-stargazing-where-to-look-up", "when-to-visit-yosemite-2026-crowd-forecast", "yosemite-for-non-hikers"],
  "yosemite-heat-safety-guide": ["swimming-in-the-merced", "mist-trail-the-real-guide", "when-to-visit-yosemite-2026-crowd-forecast", "yosemite-during-smoke-season", "yosemite-waterfalls-guide"],
  "yosemite-during-smoke-season": ["yosemite-heat-safety-guide", "yosemite-fire-restrictions-explained", "when-to-visit-yosemite-2026-crowd-forecast", "yosemite-in-fall", "giant-sequoias-fire-adaptation"],
  "yosemite-fire-restrictions-explained": ["yosemite-during-smoke-season", "yosemite-camping-complete-guide", "giant-sequoias-fire-adaptation", "camping-in-yosemite-first-time", "yosemite-heat-safety-guide"],
  "memorial-day-skip-the-valley-go-high-2026": ["tioga-road-opening-weekend-2026", "tuolumne-meadows-in-a-day", "when-to-visit-yosemite-2026-crowd-forecast", "hetch-hetchy-the-other-yosemite-valley", "cathedral-lakes-day-hike"],
  "swimming-in-the-merced": ["yosemite-heat-safety-guide", "yosemite-with-kids-no-reservations-2026", "mist-trail-the-real-guide", "yosemite-waterfalls-guide", "yosemite-in-june-2026"],
  "horsetail-fall-firefall": ["yosemite-in-winter", "yosemite-photography-spots", "yosemite-winter-hikes", "when-to-visit-yosemite-2026-crowd-forecast", "yosemite-in-march"],
  "yosemite-stargazing-where-to-look-up": ["tuolumne-meadows-in-a-day", "glacier-point-road-open-2026", "yosemite-photography-spots", "tioga-road-opening-weekend-2026", "yosemite-in-fall"],

  // Doing and seeing
  "yosemite-photography-spots": ["yosemite-stargazing-where-to-look-up", "horsetail-fall-firefall", "four-mile-up-panorama-down", "yosemite-waterfalls-guide", "yosemite-in-fall", "watching-climbers-el-capitan"],
  "watching-climbers-el-capitan": ["yosemite-for-non-hikers", "yosemite-photography-spots", "yosemite-valley-parking-guide", "where-to-propose-in-yosemite", "yosemite-ranger-programs"],
  "mariposa-grove-how-to-visit": ["giant-sequoias-fire-adaptation", "yosemite-accessibility-guide", "yosemite-gateway-towns-compared", "yosemite-for-non-hikers", "yosemite-tunnel-trees"],
  "yosemite-ranger-programs": ["yosemite-with-kids-no-reservations-2026", "yosemite-wildlife-viewing-guide", "yosemite-for-non-hikers", "yosemite-stargazing-where-to-look-up", "yosemite-accessibility-guide"],
  "where-to-propose-in-yosemite": ["yosemite-photography-spots", "yosemite-for-non-hikers", "where-to-eat-yosemite", "where-to-stay-in-yosemite", "yosemite-in-one-or-two-days"],
  "working-in-yosemite": ["yosemite-ranger-programs", "yosemite-gateway-towns-compared", "yosemite-connecting-to-traditions", "yosemite-needs-a-reservation-system", "yosemite-in-winter"],
  "yosemite-needs-a-reservation-system": ["when-to-visit-yosemite-2026-crowd-forecast", "yosemite-without-reservations-2026", "yosemite-valley-parking-guide", "working-in-yosemite", "yosemite-glaciers-climate"],

  // Natural history
  "yosemite-bears-safety-guide": ["bears-spring-emergence", "yosemite-wildlife-viewing-guide", "camping-in-yosemite-first-time", "pack-your-car-for-yosemite", "yosemite-camping-complete-guide"],
  "bears-spring-emergence": ["yosemite-bears-safety-guide", "yosemite-wildlife-viewing-guide", "yosemite-in-march", "camping-in-yosemite-first-time", "yosemite-wildflowers-guide"],
  "yosemite-wildlife-viewing-guide": ["yosemite-bears-safety-guide", "bears-spring-emergence", "water-ouzels-waterfalls", "yosemite-ranger-programs", "yosemite-stargazing-where-to-look-up"],
  "yosemite-wildflowers-guide": ["showy-milkweed-yosemite-valley", "yosemite-wildlife-viewing-guide", "tuolumne-meadows-in-a-day", "yosemite-in-june-2026", "giant-sequoias-fire-adaptation"],
  "giant-sequoias-fire-adaptation": ["mariposa-grove-how-to-visit", "yosemite-tunnel-trees", "yosemite-during-smoke-season", "yosemite-fire-restrictions-explained", "yosemite-glaciers-climate"],
  "yosemite-glaciers-climate": ["yosemite-waterfalls-guide", "giant-sequoias-fire-adaptation", "cathedral-lakes-day-hike", "yosemite-wildlife-viewing-guide", "tuolumne-meadows-in-a-day"],
  "water-ouzels-waterfalls": ["yosemite-waterfalls-guide", "yosemite-wildlife-viewing-guide", "mist-trail-the-real-guide", "swimming-in-the-merced", "showy-milkweed-yosemite-valley"],
  "yosemite-tunnel-trees": ["giant-sequoias-fire-adaptation", "mariposa-grove-how-to-visit", "yosemite-connecting-to-traditions", "yosemite-glaciers-climate", "yosemite-needs-a-reservation-system"],
  "showy-milkweed-yosemite-valley": ["yosemite-wildflowers-guide", "yosemite-wildlife-viewing-guide", "water-ouzels-waterfalls", "swimming-in-the-merced", "giant-sequoias-fire-adaptation"],
  "yosemite-connecting-to-traditions": ["yosemite-tunnel-trees", "yosemite-ranger-programs", "working-in-yosemite", "mariposa-grove-how-to-visit", "yosemite-wildlife-viewing-guide"],
};

// How many links a related block carries. Five is the working number: enough
// to spread equity past the two or three obvious neighbours, few enough that
// the block stays a deliberate list rather than a dump of the section.
window.RELATED_COUNT = 5;

// The related set for an article: its curated list when it has one, otherwise a
// deterministic rotation.
//
// The rotation starts at the article's OWN position in its section and walks
// forward, wrapping. That is the whole point: a plain "first N of the section"
// fallback is what funnelled every uncurated article onto the same handful of
// early-catalog pieces. Starting from self means each article points at a
// different window, so the links spread across the catalog instead of piling
// up. Short sections top up from the rest of the catalog, in category order, so
// the block is never half empty.
//
// Deterministic by construction: no dates, no randomness, no read history. The
// same slug in gives the same list out, in the browser and in the generator
// that mirrors it into articles.json, which is what lets one implementation
// serve both.
window.relatedFor = function relatedFor(slug, count) {
  const n = count || window.RELATED_COUNT;
  const curated = (window.RELATED && window.RELATED[slug]) || null;
  if (curated && curated.length) return curated.slice(0, n);

  const self = window.findArticle(slug);
  if (!self) return [];
  const section = window.ARTICLES.filter((a) => a.cat === self.cat);
  const start = section.findIndex((a) => a.slug === slug);
  const out = [];
  for (let i = 1; i < section.length && out.length < n; i++) {
    out.push(section[(start + i) % section.length].slug);
  }
  if (out.length < n) {
    const seen = new Set([slug, ...out]);
    for (const a of window.ARTICLES) {
      if (out.length >= n) break;
      if (!seen.has(a.slug)) { out.push(a.slug); seen.add(a.slug); }
    }
  }
  return out;
};

// Helpers
window.byCategory = function(slug) {
  return window.ARTICLES.filter(a => a.cat === slug);
};
window.findArticle = function(slug) {
  return window.ARTICLES.find(a => a.slug === slug);
};
window.findCategory = function(slug) {
  return window.CATEGORIES.find(c => c.slug === slug);
};
