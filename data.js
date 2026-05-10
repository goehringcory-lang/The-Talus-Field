// Shared content for The Talus Field prototype.
// Articles are stored once and pulled by every page that needs them.
//
// NOTE: Article and category metadata is mirrored in /articles.json and
// /categories.json so the Cloudflare Pages Function in /functions/_middleware.js
// can inject per-route SEO into the static HTML before any JS executes.
// When you add or edit an article here, update articles.json (and feed.xml +
// sitemap.xml) to match.

window.SITE = {
  brand: "The Talus Field",
  tagline: "Yosemite, written by someone who lives here",
  authorName: "Cory Goehring",
  authorBio: "Writes from El Portal, California.",
  email: "Cory@thetalusfieldjournal.com",
};

window.CATEGORIES = [
  { slug: "planning",   label: "Planning",            blurb: "Permits, timing, transit, lodging." },
  { slug: "trails",     label: "Trails and Hikes",    blurb: "Routes and conditions, kept current." },
  { slug: "wildlife",   label: "Wildlife and Nature", blurb: "What is moving and what is blooming." },
  { slug: "seasonal",   label: "Seasonal Guides",     blurb: "The park, month by month." },
];

// Kit. Gear lists. Affiliate links go here, not in articles.
window.KIT = {
  intro: "What I actually carry. Lists I would have wanted on my first trip and still pull up before a long day. The links go to the products themselves; some are affiliate links, which means a small commission if you buy through them at no cost to you. The disclosure page explains the rules I keep for it.",
  lists: [
    {
      slug: "day-pack",
      title: "Day pack",
      summary: "For a single day on the trail in the Valley or the high country. Spring through fall.",
      icon: "I",
      image: "img/day-pack-flat-lay.jpg",
      imageCredit: "Photo: Muhammad Masood / Unsplash",
      items: [
        { name: "20–25L pack with a hip belt", note: "Hip belt matters more than the brand. Look for one that sits on your iliac crest, not your waist.", aff: "#" },
        { name: "2L water reservoir + 1L bottle", note: "Reservoir for steady sipping, bottle for filtering refills. Both, not either.", aff: "#" },
        { name: "Squeeze water filter", note: "The Sawyer kind. Cheap, fast, and keeps working when the temperature drops.", aff: "#" },
        { name: "Wide-brim sun hat", note: "Granite reflects. A baseball cap is not enough above 7,000 feet.", aff: "#" },
        { name: "Sun shirt, long sleeve", note: "I wear one even in heat. UPF 50, light color, hood if you can find it.", aff: "#" },
        { name: "Headlamp + spare battery", note: "Day hikes turn into night hikes more often than you would think.", aff: "#" },
        { name: "Patagonia Nano Puff", note: "The Valley is warm at 10am and 40°F at the rim by 3pm. The Nano Puff packs to nothing and the synthetic insulation still works if it gets wet.", aff: "#" },
        { name: "First aid kit, small", note: "Blister care is what you actually use. Everything else is reassurance.", aff: "#" },
        { name: "Trail snacks (twice what you think)", note: "Calories matter more than weight up here. Bring real food.", aff: "#" },
      ],
    },
    {
      slug: "overnight-pack",
      title: "Overnight backpack",
      summary: "For one to four nights in the backcountry. Add to, do not replace, the day pack list.",
      icon: "II",
      items: [
        { name: "55–65L pack", note: "Bigger than you need is worse than tighter than you want. Resist the temptation.", aff: "#" },
        { name: "Bear canister (required)", note: "Yosemite rents Garcia jugs at the wilderness center for cheap, but they're heavy. I recommend upgrading to a BearVault 500, or a BearVault 450 for shorter trips.", aff: "#" },
        { name: "Three-season tent", note: "Freestanding, two doors, under three pounds if you can afford it.", aff: "#" },
        { name: "20°F sleeping bag", note: "High country gets cold. A 30°F bag is not enough above 8,000 feet.", aff: "#" },
        { name: "Inflatable sleeping pad, R 4+", note: "Insulation matters more than thickness. Cold ground will steal heat all night.", aff: "#" },
        { name: "Stove + 4oz canister", note: "Per two days, per person. Bring one extra.", aff: "#" },
        { name: "Lightweight cookpot", note: "750ml is enough for one. 1.3L for two.", aff: "#" },
        { name: "Insulated puffy jacket", note: "Synthetic if you might get it wet, down if you trust your weather window.", aff: "#" },
        { name: "Camp shoes", note: "Cheap foam sandals. Worth their weight every single night.", aff: "#" },
        { name: "Camping shovel (yes, the poop shovel)", note: "You know what this is for. Always practice Leave No Trace: dig a 6-to-8-inch cathole 200 feet from water and trail, do your business, bury it. Pack a double-lined Ziploc to carry your TP back out. Or, if you want to be a real outdoor junkie: just use rocks. No, seriously. You can just use rocks.", aff: "#" },
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
        { name: "The John box", note: "Named after my friend John, who came up with the idea. The John box is a single durable storage box that holds every camping essential you ever bring: double-burner Coleman stove, propane, hatchet, paracord, firestarter, flashlight, spare headlamp and batteries, a lantern, a tarp, even a deck of playing cards. Mine doubles as a camp chair and a small table. The whole point is that you don't unpack it between trips. You load it once, store it loaded, and grab it on the way out the door. You'll never forget the propane again. If you'd rather skip the build, John sells a premade version with everything you need to survive and thrive in the wild: myjonbox.com.", aff: "https://www.myjonbox.com/" },
        { name: "Tire chains (Nov through April)", note: "Required by California law during chain controls, and the rangers do check. Practice once at home.", aff: "#" },
        { name: "Jumper cables or a portable jump pack", note: "The pack is better. Cell service is unreliable past Crane Flat.", aff: "#" },
        { name: "5 gallons of water", note: "Not for drinking. For radiators, for hand-washing, for the unexpected.", aff: "#" },
        { name: "Cooler with ice", note: "Bear-aware: nothing with a smell stays in the car overnight. The lockers exist for a reason.", aff: "#" },
        { name: "Folding camp chairs", note: "You will use them more than anything else you bring.", aff: "#" },
        { name: "Paper map of the park", note: "The official Yosemite Guide map. Cell coverage is poor and the park is large.", aff: "#" },
        { name: "Headlamp (one per person)", note: "Vault toilets at midnight are not the place to share.", aff: "#" },
        { name: "Trash bags, contractor weight", note: "For wet gear, for actual trash, for sitting on damp rocks.", aff: "#" },
        { name: "Reusable shopping bag of granola bars", note: "There is one grocery store in the Valley and the line is long.", aff: "#" },
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
    slug: "working-in-yosemite",
    cat: "planning",
    title: "So you want to work in Yosemite",
    dek: "Most jobs in Yosemite aren't ranger jobs. The work is hospitality, the housing starts in a tent cabin, and the closest grocery store is an hour away. The honest version of what it's like to live here, before you sign anything.",
    date: "May 8, 2026",
    read: "10 min",
    placeholder: "Valley meadow, late spring",
    image: "img/wildflowers.jpg",
  },
  {
    slug: "water-ouzels-waterfalls",
    cat: "wildlife",
    title: "How water ouzels live inside a waterfall",
    dek: "A robin-sized bird walks directly into Yosemite Falls and stays there. The water ouzel is the most specialized animal in the high country, and its presence tells you the stream is healthy.",
    date: "May 8, 2026",
    read: "7 min",
    placeholder: "Lower Yosemite Fall in May, peak flow",
    image: "img/lower-yosemite-fall.jpg",
  },
  {
    slug: "bears-spring-emergence",
    cat: "wildlife",
    title: "Why a Yosemite bear in April is more dangerous than one in August",
    dek: "A bear emerging from a winter den has lost a third of its body weight, has a digestive system that's barely awake, and is metabolically desperate. That's why spring, not summer, is the dangerous season.",
    date: "May 8, 2026",
    read: "8 min",
    placeholder: "Black bear foraging at meadow margin",
    image: "img/black-bear.jpg",
  },
  {
    slug: "yosemite-glaciers-climate",
    cat: "wildlife",
    title: "Yosemite's disappearing glaciers, and what they record",
    dek: "A ranger built a cairn at the toe of Mount Lyell Glacier in 1933. That cairn is now four hundred feet from the ice. The retreat is also a record of climate, written into the High Sierra in something like real time.",
    date: "May 8, 2026",
    read: "8 min",
    placeholder: "Tuolumne Meadows, the head of Lyell Canyon",
    image: "img/tuolumne-meadows.jpg",
  },
  {
    slug: "giant-sequoias-fire-adaptation",
    cat: "wildlife",
    title: "Why giant sequoias thrive where other trees burn",
    dek: "The same fires that kill every other tree in the Sierra are the ones the giant sequoia depends on. Two-foot bark, embedded tannins, and a seedling ecology that fails without burning.",
    date: "May 8, 2026",
    read: "7 min",
    placeholder: "Mariposa Grove, fire-scarred sequoia",
  },
  {
    slug: "hetch-hetchy-the-other-yosemite-valley",
    cat: "trails",
    title: "Hetch Hetchy: the Yosemite Valley you didn't know you skipped",
    dek: "Same elevation. Same length. Same kind of granite. Carved by the same kind of glacier as the famous one, and still mostly empty of visitors. Why almost no one goes, and why you should.",
    date: "April 27, 2026",
    read: "10 min",
    placeholder: "Wapama Falls in spring snowmelt",
    image: "img/vernal-fall.jpg",
  },
  {
    slug: "yosemite-stargazing-where-to-look-up",
    cat: "seasonal",
    title: "Yosemite stargazing: where to look up, and when",
    dek: "On a moonless August night at Olmsted Point, the Milky Way doesn't look like a thin band. It casts shadows. Where to go, when to go, and how to see the sky the way our ancestors did.",
    date: "April 27, 2026",
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
    date: "April 26, 2026",
    read: "8 min",
    placeholder: "Tunnel View from the overlook parking",
    image: "img/tunnel-view.jpg",
  },
  {
    slug: "pack-your-car-for-yosemite",
    cat: "planning",
    title: "How to pack your car for a Yosemite trip",
    dek: "Nobody writes about packing the car. But the car is the base camp for most Yosemite trips, and what's in it decides whether a flat tire is an inconvenience or a crisis.",
    date: "April 26, 2026",
    read: "12 min",
    placeholder: "Loaded car at a trailhead pullout",
    image: "img/cathedral-rocks.jpg",
  },
  {
    slug: "yosemite-gateway-towns-compared",
    cat: "planning",
    title: "Yosemite gateway towns compared: Mariposa, Oakhurst, Groveland, El Portal, and Lee Vining",
    dek: "Pick the wrong gateway town and you'll burn hours of every day on the road. Pick the right one and the rest of the trip gets easier. A side-by-side from someone who's stayed in all five.",
    date: "April 26, 2026",
    read: "9 min",
    placeholder: "El Portal, dusk on the Merced",
    image: "img/lower-yosemite-fall.jpg",
  },
  {
    slug: "yosemite-during-smoke-season",
    cat: "seasonal",
    title: "Yosemite during smoke season: how to actually plan around it",
    dek: "Smoke season in California now runs July through October. The question isn't whether your trip will overlap with it. It's whether you have a plan for when it does.",
    date: "April 26, 2026",
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
    read: "8 min",
    placeholder: "Cathedral Rocks from the Valley floor",
    image: "img/cathedral-rocks.jpg",
  },
  {
    slug: "first-time-yosemite-overwhelm",
    cat: "planning",
    title: "If it's your first time in Yosemite, read this before you book anything",
    dek: "The bucket list isn't the problem. The strategy is. Three things turn a Yosemite visit from “we saw the things” into one of the best weeks of your life.",
    date: "April 25, 2026",
    read: "6 min",
    feature: true,
    placeholder: "Tunnel View at first light, May",
    image: "img/tunnel-view.jpg",
  },
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
