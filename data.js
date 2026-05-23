// Shared content for The Talus Field prototype.
// Articles are stored once and pulled by every page that needs them.
//
// NOTE: Article and category metadata is mirrored in /articles.json and
// /categories.json so the Cloudflare Pages Function in /functions/_middleware.js
// can inject per-route SEO into the static HTML before any JS executes.
// When you add or edit an article here, update articles.json (and feed.xml +
// sitemap.xml) to match. Bump isoModified when an article is meaningfully
// revised so Google sees the update.

window.SITE = {
  brand: "The Talus Field",
  tagline: "Yosemite, written by someone who lives here",
  authorName: "Cory Goehring",
  authorBio: "Writes from El Portal, California.",
  email: "Goehring.cory@gmail.com",
  // Masthead issue label. One source of truth — Header and HomePage both read this.
  issue: "Vol. III · No. 19",
  issueDetail: "The May Issue",
};

window.CATEGORIES = [
  { slug: "planning",   label: "Planning",            blurb: "Permits, timing, transit, lodging." },
  { slug: "trails",     label: "Trails and Hikes",    blurb: "Routes and conditions, kept current." },
  { slug: "wildlife",   label: "Wildlife and Nature", blurb: "What is moving and what is blooming." },
  { slug: "seasonal",   label: "Seasonal Guides",     blurb: "The park, month by month." },
];

// ============================================================
// Article bodies are loaded on demand (see window.loadArticleBody below) instead
// of all 23 transpiling on every page. This map is the slug -> cache-buster
// version, the equivalent of the old ?v=N on each <script> in index.html. Bump a
// slug's number when you edit its bodies/<slug>.jsx file. scripts/check-cache-busters.sh
// verifies this map stays in sync with the files in bodies/.
// ============================================================
window.BODY_VERSIONS = {
  "memorial-day-skip-the-valley-go-high-2026": 77,
  "four-mile-up-panorama-down": 75,
  "yosemite-with-kids-no-reservations-2026": 75,
  "tioga-road-opening-weekend-2026": 75,
  "so-you-want-to-hike-half-dome": 75,
  "half-dome-permit-lottery-2026": 75,
  "glacier-point-road-open-2026": 75,
  "mist-trail-the-real-guide": 75,
  "first-time-yosemite-overwhelm": 75,
  "yosemite-without-reservations-2026": 75,
  "yosemite-during-smoke-season": 75,
  "yosemite-gateway-towns-compared": 75,
  "pack-your-car-for-yosemite": 75,
  "yosemite-for-non-hikers": 75,
  "yosemite-stargazing-where-to-look-up": 75,
  "hetch-hetchy-the-other-yosemite-valley": 75,
  "yosemite-glaciers-climate": 75,
  "giant-sequoias-fire-adaptation": 75,
  "bears-spring-emergence": 75,
  "water-ouzels-waterfalls": 75,
  "working-in-yosemite": 75,
  "yosemite-in-one-or-two-days": 77,
  "where-to-eat-yosemite": 79,
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
  const url = `/bodies/${slug}.jsx${v ? `?v=${v}` : ""}`;
  const p = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to load body "${slug}": ${r.status}`);
      return r.text();
    })
    .then((src) => {
      // Must match index.html's data-presets: react,env. The env preset downlevels
      // const/let to var; without it a body declaring a top-level const would collide
      // with the globally-scoped declarations from the page scripts and fail to inject.
      const { code } = window.Babel.transform(src, { presets: ["react", "env"], filename: `${slug}.jsx` });
      const script = document.createElement("script");
      script.textContent = code;
      document.body.appendChild(script);
      return window.ARTICLE_BODIES[slug] || null;
    })
    .catch((err) => {
      delete window.__bodyPromises[slug];
      throw err;
    });
  window.__bodyPromises[slug] = p;
  return p;
};

// Kit. Gear lists. Affiliate links go here, not in articles.
window.KIT = {
  intro: "What I actually carry. Lists I would have wanted on my first trip and still pull up before a long day. The links go to the products themselves; some are affiliate links, which means a small commission if you buy through them at no extra cost to you. The disclosure page explains the rules I keep for it.",
  lists: [
    {
      slug: "day-pack",
      title: "Day pack",
      summary: "For a single day on the trail in the Valley or the high country. Spring through fall.",
      icon: "I",
      image: "img/day-pack-flat-lay.jpg",
      imageCredit: "Photo: Muhammad Masood / Unsplash",
      items: [
        { name: "20–25L pack with a hip belt", note: "Hip belt matters more than the brand. Look for one that sits on your iliac crest, not your waist.", aff: "#", affNetwork: "" },
        { name: "2L water reservoir + 1L bottle", note: "Reservoir for steady sipping, bottle for filtering refills. Both, not either.", aff: "#", affNetwork: "" },
        { name: "Squeeze water filter", note: "The Sawyer kind. Cheap, fast, and keeps working when the temperature drops.", aff: "#", affNetwork: "" },
        { name: "Wide-brim sun hat", note: "Granite reflects. A baseball cap is not enough above 7,000 feet.", aff: "#", affNetwork: "" },
        { name: "Sun shirt, long sleeve", note: "I wear one even in heat. UPF 50, light color, hood if you can find it.", aff: "#", affNetwork: "" },
        { name: "Headlamp + spare battery", note: "Day hikes turn into night hikes more often than you would think.", aff: "#", affNetwork: "" },
        { name: "Patagonia Nano Puff", note: "The Valley is warm at 10am and 40°F at the rim by 3pm. The Nano Puff packs to nothing and the synthetic insulation still works if it gets wet.", aff: "#", affNetwork: "", articleSlug: "memorial-day-skip-the-valley-go-high-2026" },
        { name: "First aid kit, small", note: "Blister care is what you actually use. Everything else is reassurance.", aff: "#", affNetwork: "" },
        { name: "Trail snacks (twice what you think)", note: "Calories matter more than weight up here. Bring real food.", aff: "#", affNetwork: "" },
      ],
    },
    {
      slug: "overnight-pack",
      title: "Overnight backpack",
      summary: "For one to four nights in the backcountry. Add to, do not replace, the day pack list.",
      icon: "II",
      items: [
        { name: "55–65L pack", note: "Bigger than you need is worse than tighter than you want. Resist the temptation.", aff: "#", affNetwork: "" },
        { name: "Bear canister (required)", note: "Yosemite rents Garcia jugs at the wilderness center for cheap, but they're heavy. I recommend upgrading to a BearVault 500, or a BearVault 450 for shorter trips.", aff: "#", affNetwork: "", articleSlug: "half-dome-permit-lottery-2026" },
        { name: "Three-season tent", note: "Freestanding, two doors, under three pounds if you can afford it.", aff: "#", affNetwork: "" },
        { name: "20°F sleeping bag", note: "High country gets cold. A 30°F bag is not enough above 8,000 feet.", aff: "#", affNetwork: "" },
        { name: "Inflatable sleeping pad, R 4+", note: "Insulation matters more than thickness. Cold ground will steal heat all night.", aff: "#", affNetwork: "" },
        { name: "Stove + 4oz canister", note: "Per two days, per person. Bring one extra.", aff: "#", affNetwork: "" },
        { name: "Lightweight cookpot", note: "750ml is enough for one. 1.3L for two.", aff: "#", affNetwork: "" },
        { name: "Insulated puffy jacket", note: "Synthetic if you might get it wet, down if you trust your weather window.", aff: "#", affNetwork: "" },
        { name: "Camp shoes", note: "Cheap foam sandals. Worth their weight every single night.", aff: "#", affNetwork: "" },
        { name: "Camping shovel (yes, the poop shovel)", note: "You know what this is for. Always practice Leave No Trace: dig a 6-to-8-inch cathole 200 feet from water and trail, do your business, bury it. Pack a double-lined Ziploc to carry your TP back out. Or, if you want to be a real outdoor junkie: just use rocks. No, seriously. You can just use rocks.", aff: "#", affNetwork: "" },
      ],
    },
    {
      slug: "car-trip",
      title: "Car trip",
      summary: "What to keep in the trunk for any Yosemite drive. Adds peace of mind, takes no thought.",
      icon: "III",
      essay: {
        slug: "pack-your-car-for-yosemite",
        title: "How to pack your car for a Yosemite trip",
        blurb: "The full essay behind this list. Why each item earns its space, the small tactics that change the math on your trip, and the bear rules that apply to your car too.",
      },
      items: [
        { name: "The John box", note: "Named after my friend John, who came up with the idea. The John box is a single durable storage box that holds every camping essential you ever bring: double-burner Coleman stove, propane, hatchet, paracord, firestarter, flashlight, spare headlamp and batteries, a lantern, a tarp, even a deck of playing cards. Mine doubles as a camp chair and a small table. The whole point is that you don't unpack it between trips. You load it once, store it loaded, and grab it on the way out the door. You'll never forget the propane again. If you'd rather skip the build, John sells a premade version with everything you need to survive and thrive in the wild: myjonbox.com.", aff: "https://www.myjonbox.com/", affLabel: "Visit", affNetwork: "none" },
        { name: "Tire chains (Nov through April)", note: "Required by California law during chain controls, and the rangers do check. Practice once at home.", aff: "#", affNetwork: "" },
        { name: "Jumper cables or a portable jump pack", note: "The pack is better. Cell service is unreliable past Crane Flat.", aff: "#", affNetwork: "" },
        { name: "5 gallons of water", note: "Not for drinking. For radiators, for hand-washing, for the unexpected.", aff: "#", affNetwork: "" },
        { name: "Cooler with ice", note: "Bear-aware: nothing with a smell stays in the car overnight. The lockers exist for a reason.", aff: "#", affNetwork: "" },
        { name: "Folding camp chairs", note: "You will use them more than anything else you bring.", aff: "#", affNetwork: "" },
        { name: "Paper map of the park", note: "The official Yosemite Guide map. Cell coverage is poor and the park is large.", aff: "#", affNetwork: "" },
        { name: "Headlamp (one per person)", note: "Vault toilets at midnight are not the place to share.", aff: "#", affNetwork: "" },
        { name: "Trash bags, contractor weight", note: "For wet gear, for actual trash, for sitting on damp rocks.", aff: "#", affNetwork: "" },
        { name: "Reusable shopping bag of granola bars", note: "There is one grocery store in the Valley and the line is long.", aff: "#", affNetwork: "" },
      ],
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

window.ARTICLES = [
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
    title: "One day or two in Yosemite: a minimalist itinerary",
    dek: "One day in Yosemite is enough. Two days is enough plus the part where you slow down. The honest version of what a short Valley visit actually buys you in 2026.",
    date: "May 19, 2026",
    isoDate: "2026-05-19",
    isoModified: "2026-05-19",
    read: "9 min",
    placeholder: "Tunnel View on an autumn morning, before the lot fills",
    image: "img/tunnel-view-autumn-aniket-deole.jpg",
    credit: "Photo: Aniket Deole / Unsplash",
  },
  {
    slug: "four-mile-up-panorama-down",
    cat: "trails",
    title: "My favorite day hike in Yosemite: Four Mile up, Panorama down",
    dek: "Up the Four Mile Trail to Glacier Point, down the Panorama Trail past Illilouette and Nevada Falls. A 13-mile loop that climbs 3,200 feet and gives you back the whole park. The logistics that make it work.",
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
    placeholder: "Toddler on the Lower Yosemite Fall boardwalk, Upper Yosemite Fall behind",
    image: "img/kid-yosemite-falls-boardwalk.jpg",
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
    image: "img/TMweb.webp",
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
    placeholder: "Wildflowers in a Yosemite Valley meadow, late spring",
    image: "img/wildflowers.jpg",
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
    placeholder: "Lower Yosemite Fall in May, peak flow",
    image: "img/lower-yosemite-fall.jpg",
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
    placeholder: "Tuolumne Meadows, the head of Lyell Canyon",
    image: "img/tuolumne-meadows.jpg",
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
    title: "Yosemite gateway towns compared: Mariposa, Oakhurst, Groveland, El Portal, and Lee Vining",
    dek: "Pick the wrong gateway town and you'll burn hours of every day on the road. Pick the right one and the rest of the trip gets easier. A side-by-side from someone who's stayed in all five.",
    seoDek: "Pick the wrong Yosemite gateway and you'll burn hours on the road. A side-by-side of Mariposa, Oakhurst, Groveland, El Portal, Lee Vining.",
    date: "April 26, 2026",
    isoDate: "2026-04-26",
    isoModified: "2026-04-26",
    read: "9 min",
    placeholder: "El Portal, dusk on the Merced",
    image: "img/lower-yosemite-fall.jpg",
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
    placeholder: "Half Dome through summer haze",
    image: "img/half-dome.jpg",
  },
  {
    slug: "yosemite-without-reservations-2026",
    cat: "planning",
    title: "Yosemite without reservations in 2026: a real strategy for the year the cap came off",
    dek: "The reservation system was a throttle. With it gone in 2026, the park hasn't gotten easier. It's gotten harder. Here's the real strategy.",
    date: "April 26, 2026",
    isoDate: "2026-04-26",
    isoModified: "2026-04-26",
    read: "8 min",
    placeholder: "Cathedral Rocks rising above the Merced River, Yosemite Valley",
    image: "img/cathedral-rocks.jpg",
  },
  {
    slug: "first-time-yosemite-overwhelm",
    cat: "planning",
    title: "If it's your first time in Yosemite, read this before you book anything",
    dek: "The bucket list isn't the problem. The strategy is. Three things turn a Yosemite visit from “we saw the things” into one of the best weeks of your life.",
    date: "April 25, 2026",
    isoDate: "2026-04-25",
    isoModified: "2026-04-25",
    read: "6 min",
    placeholder: "Tunnel View at first light, May",
    image: "img/tunnel-view.jpg",
  },
];

// Curated onboarding row on the homepage. Order is the read order.
window.START_HERE = [
  "first-time-yosemite-overwhelm",
  "yosemite-without-reservations-2026",
  "yosemite-gateway-towns-compared",
  "yosemite-with-kids-no-reservations-2026",
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
