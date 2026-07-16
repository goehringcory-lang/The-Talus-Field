// Shared content for The Talus Field prototype.
// Articles are stored once and pulled by every page that needs them.
//
// NOTE: window.ARTICLES below is the single source of truth for the article
// catalog and core metadata. SEO enrichment that the browser does not need
// (keywords, wordCount, faq, trail facts) lives in /seo-data.json, keyed by
// slug, to keep this runtime file small.
//
// The mirror files consumed by crawlers — /articles.json (read by the Pages
// Function in /functions/_middleware.js), /sitemap.xml, /feed.xml, and the
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
  authorBio: "Yosemite naturalist and Conservancy interpreter, twenty seasons in the park. Writes from El Portal.",
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
// The Planning Guide's curated structure, mirrored from the hand-built parts
// in page-planning-guide.jsx (keep the two in sync when curation changes).
// Powers the "Part of the Yosemite Planning Guide" series band on member
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
    "yosemite-wilderness-permits-guide",
  ] },
  { part: "Part Three · When you arrive", slugs: [
    "pack-your-car-for-yosemite",
    "yosemite-with-kids-no-reservations-2026",
    "yosemite-for-non-hikers",
    "yosemite-accessibility-guide",
    "pets-in-yosemite",
    "yosemite-ranger-programs",
  ] },
  { part: "Part Four · If you're hiking Half Dome", slugs: [
    "half-dome-permit-lottery-2026",
    "so-you-want-to-hike-half-dome",
    "mist-trail-the-real-guide",
  ] },
  { part: "Part Five · The seasonal calendar", slugs: [
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
  "yosemite-waterfalls-guide": 1,
  "yosemite-photography-spots": 1,
  "horsetail-fall-firefall": 2,
  "yosemite-in-winter": 1,
  "where-to-stay-in-yosemite": 2,
  "yosemite-wildflowers-guide": 1,
  "watching-climbers-el-capitan": 1,
  "getting-to-yosemite": 1,
  "yosemite-wilderness-permits-guide": 1,
  "yosemite-accessibility-guide": 1,
  "pets-in-yosemite": 2,
  "yosemite-ranger-programs": 1,
  "yosemite-camping-complete-guide": 1,
  "where-to-propose-in-yosemite": 1,
  "yosemite-bears-safety-guide": 117,
  "yosemite-heat-safety-guide": 3,
  "when-to-visit-yosemite-2026-crowd-forecast": 2,
  "yosemite-trip-cost-budget-2026": 2,
  "yosemite-in-june-2026": 1,
  "cathedral-lakes-day-hike": 1,
  "yosemite-needs-a-reservation-system": 80,
  "memorial-day-skip-the-valley-go-high-2026": 80,
  "four-mile-up-panorama-down": 75,
  "yosemite-with-kids-no-reservations-2026": 77,
  "tioga-road-opening-weekend-2026": 76,
  "so-you-want-to-hike-half-dome": 75,
  "half-dome-permit-lottery-2026": 80,
  "glacier-point-road-open-2026": 77,
  "mist-trail-the-real-guide": 82,
  "first-time-yosemite-overwhelm": 82,
  "yosemite-without-reservations-2026": 81,
  "yosemite-during-smoke-season": 75,
  "yosemite-gateway-towns-compared": 82,
  "pack-your-car-for-yosemite": 81,
  "yosemite-for-non-hikers": 76,
  "yosemite-stargazing-where-to-look-up": 76,
  "hetch-hetchy-the-other-yosemite-valley": 76,
  "yosemite-glaciers-climate": 76,
  "giant-sequoias-fire-adaptation": 75,
  "bears-spring-emergence": 75,
  "water-ouzels-waterfalls": 75,
  "working-in-yosemite": 76,
  "yosemite-in-one-or-two-days": 80,
  "where-to-eat-yosemite": 81,
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
            { id: "overnight-pack:bear-canister", name: "Bear canister, required", note: "Yosemite rents Garcia jugs at the wilderness center cheaply but they are heavy. Upgrading to a BearVault 500, or a 450 for shorter trips, is worth it. All food, trash, and scented items go inside, and store it 50 feet or more from your tent.", aff: "#", articleSlug: "half-dome-permit-lottery-2026" },
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
    placeholder: "Tunnel View in autumn light, with El Capitan, Bridalveil Fall, and Half Dome in one frame",
    image: "img/tunnel-view-autumn-aniket-deole.jpg",
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
    isoModified: "2026-07-12",
    read: "8 min",
    placeholder: "El Capitan under fresh snow as a winter storm clears above the Valley floor",
    image: "img/el-capitan-winter.jpg",
  },
  {
    slug: "where-to-stay-in-yosemite",
    cat: "planning",
    title: "Where to Stay Inside Yosemite: Every In-Park Option, Honestly Ranked",
    dek: "Six in-park options, one concessioner, and almost nothing in common: the Ahwahnee's real value, the Lodge's unbeatable address, Curry Village's canvas tradeoffs, the Housekeeping Camp sleeper pick, and the 366-day booking game that decides all of it.",
    seoDek: "Every place to stay inside Yosemite, ranked: the Ahwahnee, Valley Lodge, Curry Village, Housekeeping Camp, the high-country camps, plus the 366-day booking strategy.",
    date: "July 12, 2026",
    isoDate: "2026-07-12",
    isoModified: "2026-07-14",
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
    isoModified: "2026-07-12",
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
    isoModified: "2026-07-11",
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
    isoModified: "2026-07-09",
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
    isoModified: "2026-07-10",
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
    placeholder: "Cars parked along the edge of a Yosemite Valley meadow on a crowded weekend",
    image: "img/cars-on-meadow-edge-cory-goehring.jpg",
    credit: "Photo: Cory Goehring",
  },
  {
    slug: "yosemite-trip-cost-budget-2026",
    cat: "planning",
    title: "What a Yosemite Trip Actually Costs in 2026",
    dek: "Entrance fees, lodging, food, gas, gear, and guided programs, with real 2026 numbers and three full trip totals: shoestring, comfortable mid-range, and splurge.",
    seoDek: "What a Yosemite trip costs in 2026: entrance fees, lodging, food, gas, and gear, with real budget, mid-range, and splurge totals.",
    date: "June 7, 2026",
    isoDate: "2026-06-07",
    isoModified: "2026-07-12",
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
    isoModified: "2026-06-02",
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
    placeholder: "A granite wall above a Yosemite Valley meadow",
    image: "img/yosemite-valley-winter-wall.jpg",
    credit: "Photo: Ahmed Radwan / Wikimedia Commons (CC0)",
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
    title: "Where to eat in and around Yosemite",
    dek: "Eight or nine restaurants worth knowing in and around Yosemite. The Half Dome pizza, the Mariposa brisket, the east-side coffee. Nothing else, and nothing chain.",
    seoDek: "Eight or nine restaurants worth knowing in and around Yosemite: the Half Dome pizza, the Mariposa brisket, the east-side coffee. No chains, no filler.",
    date: "May 19, 2026",
    isoDate: "2026-05-19",
    isoModified: "2026-05-19",
    read: "6 min",
    placeholder: "Meadow at the foot of Half Dome, the post-hike picnic spot",
    image: "img/half-dome-meadow-deer-johannes-andersson.jpg",
    credit: "Photo: Johannes Andersson / Unsplash",
  },
  {
    slug: "yosemite-in-one-or-two-days",
    cat: "planning",
    title: "One day in Yosemite: a minimalist itinerary for one or two days",
    dek: "One day in Yosemite is enough if you start early and do less. A deliberate one-or-two-day itinerary for 2026: the Valley waterfall sequence, what to skip, and what a second day above the floor earns you.",
    seoDek: "One day in Yosemite, done right: a 2026 itinerary for one or two days. The Valley waterfall sequence, what to skip, gas, parking, and a realistic hike.",
    date: "May 19, 2026",
    isoDate: "2026-05-19",
    isoModified: "2026-06-23",
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
    isoModified: "2026-05-14",
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
    slug: "half-dome-permit-lottery-2026",
    cat: "planning",
    title: "How the Half Dome permit lottery actually works",
    dek: "There are two lotteries, not one. The preseason in March and the daily lottery every day the cables are up. The real odds, the strategy that works, and what to do if you don't win.",
    seoDek: "Two Half Dome lotteries, not one: preseason in March and the daily during cables season. Real odds, the strategy that works, what to do if you lose.",
    date: "May 12, 2026",
    isoDate: "2026-05-12",
    isoModified: "2026-05-12",
    read: "13 min",
    placeholder: "Half Dome at alpenglow from Glacier Point",
    image: "img/half-dome-alpenglow-madhu-shesharam.jpg",
    credit: "Photo: Madhu Shesharam / Unsplash",
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
    placeholder: "The Wawona Tunnel Tree, Mariposa Grove (fell 1969)",
    image: "img/wawona-tunnel-tree-historic.jpg",
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
    isoModified: "2026-04-26",
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
    title: "Yosemite gateway towns compared: which one to base in",
    dek: "Pick the wrong gateway town and you'll burn hours of every day on the road. Pick the right one and the rest of the trip gets easier. A side-by-side from someone who's stayed in all five.",
    seoDek: "Pick the wrong Yosemite gateway and you'll burn hours on the road. A side-by-side of Mariposa, Oakhurst, Groveland, El Portal, Lee Vining.",
    date: "April 26, 2026",
    isoDate: "2026-04-26",
    isoModified: "2026-06-23",
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
    placeholder: "Half Dome in profile from Washburn Point under a gray sky",
    image: "img/washburn-point.jpg",
    credit: "Photo: Pavel Špindler / Wikimedia Commons (CC BY 3.0)",
  },
  {
    slug: "yosemite-without-reservations-2026",
    cat: "planning",
    title: "Yosemite without reservations in 2026: a real strategy for the year the cap came off",
    dek: "The reservation system was a throttle. With it gone in 2026, the park hasn't gotten easier. It's gotten harder. Here's the real strategy.",
    seoDek: "The reservation cap came off for 2026. The park didn't get easier, it got harder. A real strategy for visiting Yosemite without reservations.",
    date: "April 26, 2026",
    isoDate: "2026-04-26",
    isoModified: "2026-06-23",
    read: "8 min",
    placeholder: "Cathedral Rocks reflected in the Merced River at Cathedral Beach",
    image: "img/cathedral-beach-quiet-picnic.jpg",
    credit: "Photo: Todd Petrie / Wikimedia Commons (CC BY 2.0)",
  },
  {
    slug: "first-time-yosemite-overwhelm",
    cat: "planning",
    title: "If it's your first time in Yosemite, read this before you book anything",
    dek: "The bucket list isn't the problem. The strategy is. Three things turn a Yosemite visit from “we saw the things” into one of the best weeks of your life.",
    seoDek: "The bucket list isn't the problem, the strategy is. Three things that turn a first Yosemite visit from a checklist into the best week of your year.",
    date: "April 25, 2026",
    isoDate: "2026-04-25",
    isoModified: "2026-06-23",
    read: "6 min",
    placeholder: "Half Dome with the Nevada and Vernal falls, seen from the valley rim",
    image: "img/half-dome-valley-vista.jpg",
    credit: "Photo: Cam DiCecca / Wikimedia Commons (CC0)",
  },
];

// Curated onboarding row on the homepage. Order is the read order.
window.START_HERE = [
  "first-time-yosemite-overwhelm",
  "yosemite-without-reservations-2026",
  "yosemite-gateway-towns-compared",
  "yosemite-in-one-or-two-days",
];

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
