var TRAVEL_YOSEMITE = "https://www.travelyosemite.com/lodging/";
var IN_PARK = [{
  id: "ahwahnee",
  more: "/articles/where-to-stay-in-yosemite#sec-0-the-ahwahnee-the-splurge-and-when-it-ear",
  name: "The Ahwahnee",
  kind: "Hotel · Yosemite Valley · year-round",
  price: "The most expensive bed in the park, several times the Lodge rate",
  photo: "img/ahwahnee-hotel.jpg",
  caption: "The Ahwahnee under snow, at the quiet east end of the Valley.",
  credit: "Photo: Chris Dunstan / Wikimedia Commons (public domain)",
  body: "Opened in 1927 and a National Historic Landmark, which is a category of building rather than a marketing phrase. The rooms are nice hotel rooms, not extraordinary ones. What the money buys is the public space: the Great Lounge with its floor-to-ceiling windows, the stone fireplaces, the dining room with the 34-foot ceiling, and the walk out the front door at dusk with Half Dome going pink above the meadow.",
  who: "An anniversary, a retirement, a once-in-a-lifetime trip. Not a room to sleep in between dawn starts.",
  tip: "The compromise I recommend constantly: stay somewhere cheaper and come here for a meal or a drink. The Great Lounge does not check room keys."
}, {
  id: "valley-lodge",
  more: "/articles/where-to-stay-in-yosemite#sec-1-yosemite-valley-lodge-the-location-is-th",
  name: "Yosemite Valley Lodge",
  kind: "Hotel · Yosemite Valley · year-round",
  price: "Mid-range, and the best value-to-location ratio in the park",
  photo: "img/lower-yosemite-fall.jpg",
  caption: "Lower Yosemite Fall, directly across the road from the Lodge.",
  body: "Low-slung motel-style buildings, clean and functional rooms, a food court, a pool in summer. Nobody has described the architecture as memorable. What it has instead is a position across the road from Lower Yosemite Fall, on the shuttle loop, in the most convenient part of the Valley. In spring you can hear the waterfall from the grounds at night.",
  who: "Most first-time visitors with a hotel budget. This is the correct answer, full stop, and it books out accordingly."
}, {
  id: "curry-village",
  more: "/articles/where-to-stay-in-yosemite#sec-2-curry-village-canvas-bear-boxes-and-prox",
  name: "Curry Village",
  kind: "Tent cabins and cabins · Yosemite Valley · reduced in winter",
  price: "The cheapest roofed beds in Yosemite Valley",
  photo: "img/curry-village.jpg",
  caption: "Cabins at Curry Village, under the base of Glacier Point.",
  credit: "Photo: US National Park Service / Wikimedia Commons (public domain)",
  body: "Putting visitors in tents at the base of Glacier Point since 1899. A dense grid of canvas tent cabins (wood frame, canvas walls and roof, real beds, no plumbing) plus a smaller number of hard-sided cabins, some with private baths. You will hear your neighbors. Unheated tents are genuinely cold in spring and fall, and the heated ones go first. Bathrooms and showers are in shared bathhouses, a walk away in the dark.",
  who: "Hikers and families on a budget who treat the tent as a place to sleep. People expecting a quiet hotel at a discount write the bad reviews.",
  tip: "Everything with a scent goes in the bear box outside, every time. Canvas is not a barrier a bear respects, and this is the one rule the staff will repeat to you at check-in."
}, {
  id: "housekeeping-camp",
  more: "/articles/where-to-stay-in-yosemite#sec-3-housekeeping-camp-the-sleeper-pick",
  name: "Housekeeping Camp",
  kind: "Open-air units · Yosemite Valley · summer season",
  price: "Camping economics with a real bed",
  body: "The sleeper pick, and the one almost nobody outside of returning families has heard of. Three-walled concrete structures on the bank of the Merced River: a canvas roof, a curtain across the fourth wall, bunks and a double bed inside, and outside a covered patio with a table, a fire ring, and a bear box. You bring or rent bedding. Bathhouses are communal.",
  who: "A family of four who would otherwise be choosing between a motel outside the park and a campsite they failed to win.",
  tip: "You can cook your own meals over a fire, which no other lodging option in the Valley allows, and the river beach is steps away for the hot afternoons."
}, {
  id: "white-wolf",
  more: "/articles/where-to-stay-in-yosemite#sec-4-the-high-country-white-wolf-and-tuolumne",
  name: "White Wolf Lodge",
  kind: "Tent cabins · Tioga Road, 8,000 ft · summer only",
  price: "Modest, and hard to book for reasons of scarcity rather than price",
  body: "Canvas tent cabins with wood stoves, shared facilities, and a dining room that serves family-style meals, off Tioga Road at 8,000 feet. Small, short-season, and beloved by the people who know it.",
  who: "Hikers and returning visitors basing in the high country. This is not a base for a Valley trip; the Valley is well over an hour away."
}, {
  id: "tuolumne-lodge",
  more: "/articles/where-to-stay-in-yosemite#sec-4-the-high-country-white-wolf-and-tuolumne",
  name: "Tuolumne Meadows Lodge",
  kind: "Tent cabins · Tuolumne Meadows, 8,700 ft · summer only",
  price: "Modest, when it operates at all",
  photo: "img/tuolumne-meadows.jpg",
  caption: "Tuolumne Meadows, early season. The lodge sits near the meadows and the river.",
  body: "The same arrangement as White Wolf, higher and further east: canvas tent cabins, wood stoves, shared facilities, a dining room. A night up here under that sky is one of the best sleeps the park sells.",
  who: "The high country itself, for people whose trip is the high country.",
  warn: "This one operates on the park's schedule, not yours. Openings depend on snowpack, and the lodge has sat out recent seasons during construction in the meadows area. Verify it is actually operating for your year before you plan around it."
}, {
  id: "wawona-hotel",
  more: "/articles/yosemite-gateway-towns-compared#sec-3-oakhurst",
  name: "The Wawona Hotel",
  kind: "Historic hotel · Highway 41, near the South Entrance",
  price: "Not bookable",
  photo: "img/wawona-meadow-loop.jpg",
  caption: "The Wawona Meadow, across the road from the hotel, photographed between 1900 and 1930.",
  credit: "Photo: C.C. Pierce / Wikimedia Commons (public domain)",
  closed: true,
  body: "The historic in-park option just inside the South Entrance has been closed since December 2024 and remains closed for renovation this season.",
  who: "Nobody, this year. It is listed here because its absence is the fact that matters: it removes the in-park alternative on the Highway 41 corridor and puts more pressure on Oakhurst rooms in summer."
}];
var GATEWAYS = [{
  id: "el-portal",
  article: "/articles/yosemite-gateway-towns-compared#sec-1-el-portal",
  name: "El Portal",
  dest: "El Portal, California",
  drive: "25 to 35 minutes to the Valley",
  road: "Highway 140, year-round",
  photo: "img/merced-canyon-road-cory-goehring.jpg",
  caption: "Highway 140 following the Merced River canyon toward the Arch Rock entrance.",
  credit: "Photo: Cory Goehring",
  body: "The closest gateway by a significant margin, and essentially a park-adjacent settlement: a handful of lodges along the river, a 24-hour gas station, a small market, and not much else. Lodging is priced like in-park lodging because the location is that good.",
  who: "Anyone whose top priority is being inside the park as much as possible. You can roll out of bed at 5:30 and be at Tunnel View by 6:15.",
  against: "Limited dining, limited inventory, and river noise at the lodges, which is a feature for some people and a bug for others."
}, {
  id: "mariposa",
  article: "/articles/yosemite-gateway-towns-compared#sec-2-mariposa",
  name: "Mariposa",
  dest: "Mariposa, California",
  drive: "45 minutes to an hour to the Valley",
  road: "Highway 140, year-round",
  body: "The most full-service of the western gateways: a real downtown with restaurants, coffee, bookstores, the county museum, the 1854 courthouse, and lodging from highway chains to historic bed-and-breakfasts.",
  who: "The largest share of first-time visitors, families, anyone on a budget, and anyone visiting in shoulder season or winter when closer inventory disappears.",
  against: "Ninety minutes of round-trip driving a day that you would not be doing closer in, and earlier alarms for sunrise."
}, {
  id: "groveland",
  article: "/articles/yosemite-gateway-towns-compared#sec-4-groveland",
  name: "Groveland",
  dest: "Groveland, California",
  drive: "65 to 80 minutes to the Valley",
  road: "Highway 120, chains common in winter",
  body: "The underrated one. A historic main street, the Groveland Hotel, the Iron Door Saloon (one of the oldest continuously operating saloons in California), and small-town character at a smaller scale than Mariposa.",
  who: "Hetch Hetchy, the Tuolumne side of the park, and Bay Area arrivals who do not want to drive all the way down to Mariposa. Easier last-minute bookings in shoulder season.",
  against: "Higher-elevation approach with winter chain controls, and the drive passes through the 2013 Rim Fire burn scar."
}, {
  id: "oakhurst",
  article: "/articles/yosemite-gateway-towns-compared#sec-3-oakhurst",
  name: "Oakhurst",
  dest: "Oakhurst, California",
  drive: "75 to 90 minutes to the Valley, 20 minutes to the Mariposa Grove",
  road: "Highway 41, year-round",
  body: "The largest gateway by population and amenities, with more chain lodging and chain dining than the other gateways combined. It feels like a Central California town that happens to be near a national park rather than one that exists because of it.",
  who: "Trips centered on Wawona and the giant sequoias, and anyone driving up from Los Angeles or the southern Central Valley.",
  against: "The longest drive to the Valley of any gateway. Three hours of driving on a Valley day is significant. With the Wawona Hotel closed, summer rooms here are under more pressure than usual."
}, {
  id: "fish-camp",
  article: "/articles/yosemite-gateway-towns-compared#sec-3-oakhurst",
  name: "Fish Camp",
  dest: "Fish Camp, California",
  drive: "About 2 miles to the South Entrance",
  road: "Highway 41, year-round",
  photo: "img/mariposa-grove.jpg",
  caption: "Giant sequoias in the Mariposa Grove, a short drive up Highway 41 from Fish Camp.",
  credit: "Photo: Dietmar Rabich / Wikimedia Commons (CC BY-SA 4.0)",
  body: "Not a town so much as a cluster of lodging on the highway just south of the park boundary. There are no real services here, so provision in Oakhurst on the way up.",
  who: "The closest bed to the Mariposa Grove and the South Entrance, which matters on a sequoia-first trip with an early start.",
  against: "Nothing to do in the evening, and the Valley is still most of the Oakhurst drive away."
}, {
  id: "lee-vining",
  article: "/articles/yosemite-gateway-towns-compared#sec-5-lee-vining",
  name: "Lee Vining",
  dest: "Lee Vining, California",
  drive: "90 minutes minimum to the Valley, 30 to Tuolumne Meadows",
  road: "Highway 120 East over Tioga Pass, seasonal",
  photo: "img/tenaya-lake.jpg",
  caption: "Tenaya Lake, on the Tioga Road between Lee Vining and the Valley.",
  credit: "Photo: Michael Hogarth / Wikimedia Commons (public domain)",
  body: "The only east-side gateway, and a different kind of trip rather than a substitute for the western towns. A tiny Highway 395 town next to Mono Lake, with limited lodging, limited dining, and the famously good deli at the Mobil station.",
  who: "The high country, Mono Lake, and anyone combining Yosemite with the eastern Sierra, Mammoth, or Death Valley.",
  against: "Reachable from the park only while Tioga Pass is open. In winter the detour around the south end of the Sierra is roughly six hours."
}];
var CORRIDORS = [{
  id: "corridor-140",
  name: "Highway 140 · the Merced canyon",
  kicker: "Arch Rock entrance · open year-round",
  verdict: "The all-season corridor, and the winter answer",
  towns: ["el-portal", "mariposa"],
  props: ["yosemite-view-lodge", "cedar-lodge", "autocamp-yosemite", "yosemite-bug"]
}, {
  id: "corridor-120",
  name: "Highway 120 west · Big Oak Flat",
  kicker: "Big Oak Flat entrance · open year-round, chains common in winter",
  verdict: "The summer answer, and the only base that reaches all three parks",
  towns: ["groveland"],
  props: ["rush-creek-lodge", "evergreen-lodge", "firefall-ranch", "groveland-hotel"]
}, {
  id: "corridor-41",
  name: "Highway 41 · the south",
  kicker: "South entrance · open year-round",
  verdict: "The sequoia corridor, fast to Wawona and slow to the Valley",
  towns: ["oakhurst", "fish-camp"],
  props: ["tenaya-lodge"]
}, {
  id: "corridor-395",
  name: "Tioga Road east · US 395",
  kicker: "Tioga Pass entrance · seasonal",
  verdict: "High-country months only, and not a Valley base",
  towns: ["lee-vining"],
  props: ["yosemite-gateway-motel", "el-mono-motel"]
}];
var PROPERTIES = {
  "yosemite-view-lodge": {
    name: "Yosemite View Lodge",
    where: "El Portal · on the Merced River",
    dest: "El Portal, California",
    town: "El Portal",
    body: "The big one on this corridor: a few hundred rooms strung along the river a couple of miles outside the Arch Rock entrance, about half of them with river views. Closest inventory of any size to the Valley, and priced accordingly."
  },
  "cedar-lodge": {
    name: "Cedar Lodge",
    where: "El Portal · seven miles further west",
    dest: "El Portal, California",
    town: "El Portal",
    body: "The other large motel on Highway 140, a few miles down the canyon from Yosemite View. Further out, generally cheaper, and the fallback when the closer one is gone."
  },
  "autocamp-yosemite": {
    name: "AutoCamp Yosemite",
    where: "Midpines · Highway 140",
    dest: "Midpines, California",
    town: "Midpines",
    body: "Airstream trailers, canvas tents, and cabins on a large property between Mariposa and El Portal. A design-led take on camping for people who do not want to pitch anything."
  },
  "yosemite-bug": {
    name: "Yosemite Bug Rustic Mountain Resort",
    where: "Midpines · Highway 140",
    dest: "Midpines, California",
    town: "Midpines",
    body: "The range here is unusually wide, from dorm bunks to private cabins, and the June Bug Cafe is a genuine destination rather than a lodge dining room. The budget answer on this corridor."
  },
  "rush-creek-lodge": {
    name: "Rush Creek Lodge",
    where: "Highway 120 · half a mile from the entrance",
    dest: "Groveland, California",
    town: "Groveland",
    body: "Twenty wooded acres essentially at the Big Oak Flat gate, which is as close as this corridor gets without being inside the park. A resort rather than a motel, with the prices that implies."
  },
  "evergreen-lodge": {
    name: "Evergreen Lodge",
    where: "Evergreen Road · toward Hetch Hetchy",
    dest: "Groveland, California",
    town: "Groveland",
    body: "The historic sister property to Rush Creek, about seven miles on down the Hetch Hetchy road. If Hetch Hetchy is the reason for the trip, this is the closest bed to it."
  },
  "firefall-ranch": {
    name: "Firefall Ranch",
    where: "Highway 120 · between Groveland and the gate",
    dest: "Groveland, California",
    town: "Groveland",
    body: "Cottages and villas spread across a large meadow property on the old stagecoach route, and the newest of the three lodges on this stretch of road."
  },
  "groveland-hotel": {
    name: "The Groveland Hotel",
    where: "Groveland · main street",
    dest: "Groveland, California",
    town: "Groveland",
    body: "The in-town option, on the historic main street and a short walk from the Iron Door Saloon. Further from the gate than the highway lodges, and the one that puts you in a town in the evening."
  },
  "tenaya-lodge": {
    name: "Tenaya Lodge at Yosemite",
    where: "Fish Camp · two miles from the South Entrance",
    dest: "Fish Camp, California",
    town: "Fish Camp",
    body: "A full resort on seventy-five acres just outside the park line, and effectively what Fish Camp is. The closest substantial lodging to the Mariposa Grove."
  },
  "yosemite-gateway-motel": {
    name: "Yosemite Gateway Motel",
    where: "Lee Vining · US 395",
    dest: "Lee Vining, California",
    town: "Lee Vining",
    body: "One of the small motels that make up most of Lee Vining's inventory, on the highway above Mono Lake. Rooms here are few and go at a summer premium."
  },
  "el-mono-motel": {
    name: "El Mono Motel",
    where: "Lee Vining · US 395",
    dest: "Lee Vining, California",
    town: "Lee Vining",
    body: "The other long-standing small motel in town, attached to a cafe. Same caveat as everything on this corridor: reachable from the park only while Tioga Pass is open."
  }
};
var SEASONS = [{
  id: "season-winter",
  name: "Winter",
  span: "December through March",
  body: "Highway 140 is the base. It runs along the canyon bottom and takes rain on the days Highway 41 and Highway 120 take snow, and it is the only corridor with year-round bus service into the park. Inside the boundary this is the easy season: the seasonal operations close, but the Ahwahnee, the Lodge, and a reduced Curry Village run all year, and midweek availability in January is a different universe from July. Tioga Pass is closed, so the east side is out entirely.",
  dest: "Mariposa, California",
  cta: "Search Highway 140 lodging →"
}, {
  id: "season-spring",
  name: "Spring",
  span: "April through May",
  body: "Peak waterfall weeks, and the last calm booking window before summer. The high roads are still closed for most of it and open on the snowpack's schedule rather than the calendar's, so this is a Valley trip: stay on Highway 140, which keeps you closest to it, and treat any Tioga or Glacier Point plan as unsettled until the park says otherwise.",
  dest: "El Portal, California",
  cta: "Search El Portal lodging →"
}, {
  id: "season-summer",
  name: "Summer",
  span: "June through August",
  body: "Everything is open and everything is booked. In-park rooms went at the 366-day release and gateway rooms fill six to twelve months ahead, so the corridor choice is the real decision. Highway 120 is the strongest base of the four: with Tioga Road open it is the only corridor that puts Yosemite Valley, Hetch Hetchy, and Tuolumne Meadows all within reach of one morning's drive. If the high country is the whole trip, the east side is closer still.",
  dest: "Groveland, California",
  cta: "Search Highway 120 lodging →"
}, {
  id: "season-fall",
  name: "Fall",
  span: "September through November",
  body: "The season worth booking and the one people skip, because the waterfalls are down to a trickle. Crowds ease after Labor Day, Tioga Road typically holds into October, and the cancellation-watch strategy has its best odds of the year. Late in the season the high roads start closing again, so check what is open before committing to a base east of the Valley.",
  dest: "Yosemite National Park",
  cta: "Search park-area lodging →"
}];
function StayCard({
  item
}) {
  return React.createElement("article", {
    className: ["stay-card", item.closed && "stay-card--closed"].filter(Boolean).join(" ")
  }, item.photo && React.createElement("figure", {
    className: "stay-card__figure"
  }, React.createElement(ResponsiveImage, {
    image: item.photo,
    alt: item.caption,
    sizes: SIZES_CARD,
    className: "stay-card__img"
  }), React.createElement("figcaption", {
    className: "stay-card__caption"
  }, item.caption, item.credit && React.createElement("span", {
    className: "stay-card__credit"
  }, item.credit))), React.createElement("div", {
    className: "stay-card__body"
  }, React.createElement("div", {
    className: "stay-card__kind"
  }, item.kind), React.createElement("h3", {
    className: "stay-card__name"
  }, item.name), React.createElement("p", {
    className: "stay-card__price"
  }, item.price), React.createElement("p", {
    className: "stay-card__text"
  }, item.body), React.createElement("p", {
    className: "stay-card__who"
  }, React.createElement("strong", null, "Who it fits:"), " ", item.who), item.tip && React.createElement("p", {
    className: "stay-card__tip"
  }, item.tip), item.warn && React.createElement("p", {
    className: "stay-card__warn"
  }, item.warn), item.more && React.createElement("a", {
    className: "stay-card__more",
    href: item.more
  }, "The longer version →"), !item.closed && React.createElement("a", {
    className: "stay-card__book",
    href: TRAVEL_YOSEMITE,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Book at travelyosemite.com ↗")));
}
function GatewayCard({
  item
}) {
  return React.createElement("article", {
    className: "stay-card stay-card--town"
  }, item.photo && React.createElement("figure", {
    className: "stay-card__figure"
  }, React.createElement(ResponsiveImage, {
    image: item.photo,
    alt: item.caption,
    sizes: SIZES_CARD,
    className: "stay-card__img"
  }), React.createElement("figcaption", {
    className: "stay-card__caption"
  }, item.caption, item.credit && React.createElement("span", {
    className: "stay-card__credit"
  }, item.credit))), React.createElement("div", {
    className: "stay-card__body"
  }, React.createElement("h4", {
    className: "stay-card__name"
  }, item.name), React.createElement("dl", {
    className: "stay-card__facts"
  }, React.createElement("div", null, React.createElement("dt", null, "Drive"), React.createElement("dd", null, item.drive)), React.createElement("div", null, React.createElement("dt", null, "Road"), React.createElement("dd", null, item.road))), React.createElement("p", {
    className: "stay-card__text"
  }, item.body), React.createElement("p", {
    className: "stay-card__who"
  }, React.createElement("strong", null, "Who it fits:"), " ", item.who), React.createElement("p", {
    className: "stay-card__against"
  }, React.createElement("strong", null, "The cost:"), " ", item.against), item.article && React.createElement("a", {
    className: "stay-card__more",
    href: item.article
  }, "The full chapter on ", item.name, " →"), React.createElement(AvailabilityLink, {
    destination: item.dest,
    list: "stay_gateway",
    slug: item.id,
    name: item.name + " lodging search",
    className: "stay-card__avail"
  }, "See what ", item.name, " has on your dates →")));
}
function PropertyRow({
  item,
  id
}) {
  return React.createElement("div", {
    className: "stay-prop"
  }, React.createElement("div", {
    className: "stay-prop__name"
  }, item.name), React.createElement("div", {
    className: "stay-prop__where"
  }, item.where), React.createElement("p", {
    className: "stay-prop__text"
  }, item.body), React.createElement(AvailabilityLink, {
    destination: item.dest,
    list: "stay_property",
    slug: id,
    name: item.name + " · " + item.town + " lodging search",
    className: "stay-prop__avail"
  }, "What ", item.town, " has on your dates →"));
}
var GATEWAY_ARTICLE = "/articles/yosemite-gateway-towns-compared";
var CORRIDOR_INTROS = {
  "corridor-140": () => React.createElement("p", null, "The lowest road into the park and the most reliable one. It follows the Merced River canyon rather than climbing a ridge, which is why it takes rain on the days the other two western corridors take snow, and why it is the corridor to book if your dates are anywhere between December and March. It is also the only one with year-round bus service into the Valley. In summer it is simply the shortest drive, which is a different argument for the same road.", " ", React.createElement("a", {
    href: GATEWAY_ARTICLE + "#sec-7-what-each-town-looks-like-in-winter"
  }, "What each town looks like in winter"), " ", "goes through it town by town, and", " ", React.createElement("a", {
    href: "/articles/yosemite-in-winter"
  }, "the winter guide"), " covers the chain rules that come with the season."),
  "corridor-120": () => React.createElement("p", null, "The summer base, and the one people underrate. With Tioga Road open this is the only corridor that puts Yosemite Valley, Hetch Hetchy, and Tuolumne Meadows all within reach of one morning's drive, which is the argument for it in a sentence. The catch is elevation: the approach starts a thousand feet above the Highway 140 towns, chain controls are routine in winter, and the road in from the Bay Area is the natural one.", " ", React.createElement("a", {
    href: GATEWAY_ARTICLE + "#sec-4-groveland"
  }, "The Groveland chapter"), " ", "has the full case, and", " ", React.createElement("a", {
    href: "/tioga-opening"
  }, "when Tioga Road opens"), " is the fact this whole corridor's summer depends on."),
  "corridor-41": () => React.createElement("p", null, "The sequoia side. From here the Mariposa Grove and Wawona are close and the Valley is not: seventy-five to ninety minutes each way, which is three hours of driving on a Valley day and the single thing people underestimate about this corridor. In winter it is the Badger Pass side of the park, the road to the only downhill ski area in Yosemite. With the Wawona Hotel closed there is no in-park alternative on this road, so summer rooms carry more pressure than they used to.", " ", React.createElement("a", {
    href: GATEWAY_ARTICLE + "#sec-3-oakhurst"
  }, "The Oakhurst chapter"), " ", "covers the tradeoff in full."),
  "corridor-395": () => React.createElement("p", null, "The east side is a different trip rather than a substitute for the western towns. Tuolumne Meadows is half an hour away and the Valley is ninety minutes over a pass just under 10,000 feet, so this is a base for the high country, Mono Lake, and the eastern Sierra. It also exists seasonally: when Tioga Pass closes there is no crossing at all, and the detour around the south end of the range turns that ninety minutes into most of a day.", " ", React.createElement("a", {
    href: GATEWAY_ARTICLE + "#sec-5-lee-vining"
  }, "The Lee Vining chapter"), " ", "says who should pick it, and", " ", React.createElement("a", {
    href: "/tioga-opening"
  }, "the Tioga Road page"), " tracks the gate.")
};
function CorridorSection({
  corridor,
  towns
}) {
  var props = (corridor.props || []).map(id => [id, PROPERTIES[id]]).filter(p => p[1]);
  return React.createElement("div", {
    className: "stay-corridor",
    id: corridor.id
  }, React.createElement("div", {
    className: "stay-corridor__head"
  }, React.createElement("h3", null, corridor.name), React.createElement("div", {
    className: "stay-corridor__kicker"
  }, corridor.kicker)), React.createElement("p", {
    className: "stay-corridor__verdict"
  }, corridor.verdict), React.createElement("div", {
    className: "stay-corridor__intro"
  }, (CORRIDOR_INTROS[corridor.id] || (() => null))()), React.createElement("div", {
    className: "stay-grid"
  }, towns.map(t => React.createElement(GatewayCard, {
    key: t.id,
    item: t
  }))), props.length > 0 && React.createElement("div", {
    className: "stay-props-wrap"
  }, React.createElement("p", {
    className: "stay-props__lead"
  }, "Named stays on this corridor. The links search the town, not the property, because that is the search that answers what is left."), React.createElement("div", {
    className: "stay-props"
  }, props.map(([id, p]) => React.createElement(PropertyRow, {
    key: id,
    id: id,
    item: p
  })))));
}
function SeasonCard({
  item
}) {
  return React.createElement("div", {
    className: "stay-season"
  }, React.createElement("h3", {
    className: "stay-season__name"
  }, item.name), React.createElement("div", {
    className: "stay-season__span"
  }, item.span), React.createElement("p", {
    className: "stay-season__text"
  }, item.body), React.createElement(AvailabilityLink, {
    destination: item.dest,
    list: "stay_season",
    slug: item.id,
    name: item.name + " lodging search",
    className: "stay-season__avail"
  }, item.cta));
}
function StayPage({
  go
}) {
  var goRoute = (e, route) => {
    e.preventDefault();
    go(route);
  };
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "Where to stay"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Lodging · the whole board"), React.createElement("h1", null, "Where to Stay in Yosemite"), React.createElement("p", {
    className: "page-head__dek"
  }, "Every bed in and around the park, sorted by what it actually is and who it actually fits. Staying inside the park changes a trip more than any other single decision, so that comes first. If the park's inventory is gone, which for summer dates it usually is, the real decision is not which town but which road: four corridors reach Yosemite, they are not interchangeable, and which one fits depends on the season you are going."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("p", null, "The people sleeping in the Valley are standing under Yosemite Falls at seven in the morning with the mist still hanging and nobody around. The people sleeping in a gateway town are, at that moment, sitting in the entrance line. Both groups paid to visit Yosemite. Only one of them is in it when the park is at its best, which is the first two hours and the last two hours of the day."), React.createElement("p", null, "One piece of mechanics explains everything below it: every hotel, lodge, and tent cabin inside the boundary is run by a single park concessioner and books through one website, travelyosemite.com. There is no Marriott inside the park, no Airbnb, no boutique alternative. One operator, one inventory, one booking window. That is why the in-park cards below send you to the concessioner and the gateway cards send you to a live availability search: outside the boundary there are hundreds of properties and a real market, and inside it there is one.")), React.createElement("nav", {
    className: "stay-jump",
    "aria-label": "On this page"
  }, React.createElement("a", {
    href: "#in-park"
  }, "In the park"), React.createElement("a", {
    href: "#corridor-140"
  }, "Highway 140"), React.createElement("a", {
    href: "#corridor-120"
  }, "Highway 120"), React.createElement("a", {
    href: "#corridor-41"
  }, "Highway 41"), React.createElement("a", {
    href: "#corridor-395"
  }, "Tioga & 395"), React.createElement("a", {
    href: "#seasons"
  }, "When to stay where"), React.createElement("a", {
    href: "#camping"
  }, "Camping"), React.createElement("a", {
    href: "#booking"
  }, "Booking"))), React.createElement("section", {
    className: "wrap stay-section",
    style: {
      paddingTop: 56
    },
    id: "in-park"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Inside the park"), React.createElement("div", {
    className: "mono",
    style: {
      color: "var(--ink-3)"
    }
  }, IN_PARK.filter(p => !p.closed).length, " bookable, 1 closed")), React.createElement("div", {
    className: "stay-grid"
  }, IN_PARK.map(p => React.createElement(StayCard, {
    key: p.id,
    item: p
  }))), React.createElement("div", {
    className: "wrap--narrow",
    style: {
      margin: "0 auto",
      paddingTop: 32
    }
  }, React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "In-park inventory gone for your dates?",
    note: "It usually is, for anything in summer. A search around the park boundary is the two-minute version of finding out what is actually left before you start rearranging the trip.",
    list: "stay_in_park_fallback",
    slug: "in-park-fallback",
    cta: "Search lodging around Yosemite →",
    stayLink: false
  }))), React.createElement("section", {
    className: "wrap stay-section",
    style: {
      paddingTop: 72
    },
    id: "gateways"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Outside the park, by corridor"), React.createElement("div", {
    className: "mono",
    style: {
      color: "var(--ink-3)"
    }
  }, CORRIDORS.length, " corridors · ", GATEWAYS.length, " towns")), React.createElement("p", {
    className: "wrap--narrow",
    style: {
      margin: "0 auto 28px",
      color: "var(--ink-2)"
    }
  }, "Four entrance stations sit at the corners of the park, each on its own road, each with its towns. Choose the road first: it decides the drive you make twice a day, it decides what else is reachable from the room, and in winter it decides whether you are driving in rain or over a pass. The town comes after that. The full comparison, with the case for and against each, is in", " ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "the gateway towns article"), "."), CORRIDORS.map(c => React.createElement(CorridorSection, {
    key: c.id,
    corridor: c,
    towns: c.towns.map(id => GATEWAYS.find(t => t.id === id)).filter(Boolean)
  })), React.createElement(ExpediaBanner, {
    list: "stay_banner",
    slug: "stay"
  })), React.createElement("section", {
    className: "wrap stay-section",
    style: {
      paddingTop: 72
    },
    id: "seasons"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "When to stay where"), React.createElement("div", {
    className: "mono",
    style: {
      color: "var(--ink-3)"
    }
  }, "four seasons, four answers")), React.createElement("p", {
    className: "wrap--narrow",
    style: {
      margin: "0 auto 28px",
      color: "var(--ink-2)"
    }
  }, "The corridor that is right in July is not the one that is right in January, because the roads change and so does what is open at the end of them. This is the same four corridors read against the calendar."), React.createElement("div", {
    className: "stay-seasons"
  }, SEASONS.map(s => React.createElement(SeasonCard, {
    key: s.id,
    item: s
  })))), React.createElement("section", {
    className: "wrap wrap--narrow stay-section",
    style: {
      paddingTop: 72
    },
    id: "camping"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Camping")), React.createElement("section", {
    className: "prose"
  }, React.createElement("p", null, "Camping remains the cheapest way to sleep in the park if you can win a site, and winning one is a scheduled event rather than a search: the park's campgrounds release on Recreation.gov five months ahead, and the popular Valley loops are gone in minutes. The whole system, including the walk-in options and the reservation strategy that actually works, is in", " ", React.createElement("a", {
    href: "/articles/yosemite-camping-complete-guide"
  }, "the camping guide"), "."), React.createElement("p", null, "The private campgrounds, ranch sites, and canvas-tent operations outside the park cluster around Mariposa, Groveland, and Fish Camp, and that inventory never appears on Recreation.gov, which is exactly why it survives after the federal campgrounds sell out.")), React.createElement(LodgingCta, {
    destination: "Mariposa, California",
    heading: "If the trip has collapsed into 'we need a roof tonight'",
    note: "Every camper eventually has the night when the weather or the reservation falls through. A live search of the nearest gateway is faster than driving the highway looking for vacancy signs.",
    list: "stay_camping_fallback",
    slug: "camping-fallback",
    cta: "Search Mariposa lodging →",
    stayLink: false
  })), React.createElement("section", {
    className: "wrap wrap--narrow stay-section",
    style: {
      paddingTop: 72
    },
    id: "booking"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "How the booking actually works")), React.createElement("section", {
    className: "prose"
  }, React.createElement("p", null, "In-park reservations open ", React.createElement("strong", null, "366 days in advance"), ", one year and a day ahead, on a rolling basis. For peak summer dates at the Valley properties, availability at the moment of release is measured in minutes. If your dates are fixed and in July, you set a reminder for the morning your window opens and you book at that moment, or you likely do not book at all."), React.createElement("p", null, "Missing the release is not the end, and this is the part most people never learn: ", React.createElement("strong", null, "rooms come back"), ". Cancellation policies mean people drop reservations continuously, with a distinct wave in the final weeks before any date as plans collapse. The strategy is unglamorous and it works: check the site daily, at varied times, in the four to six weeks before your trip. I have watched people assemble three-night Valley stays in June out of one-night cancellations."), React.createElement("p", null, "Gateway lodging fills six to twelve months ahead for summer and holiday weekends, but it behaves like a normal hotel market the rest of the year: rates move with the season and the day of the week, and the same room is a different price in October than in July."), React.createElement("p", null, "The other lever is the calendar, and it is the strongest one on this page. Which corridor and which season line up is covered in", " ", React.createElement("a", {
    href: "#seasons"
  }, "when to stay where"), ", above."))), React.createElement("section", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 64,
      paddingBottom: 24
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "The longer versions")), React.createElement("ul", {
    className: "stay-links"
  }, React.createElement("li", null, React.createElement("a", {
    href: "/articles/where-to-stay-in-yosemite"
  }, "Where to stay in Yosemite"), React.createElement("span", null, "The in-park options ranked, and the argument for each.")), React.createElement("li", null, React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "The gateway towns compared"), React.createElement("span", null, "Five towns, the drive times, and who should pick which.")), React.createElement("li", null, React.createElement("a", {
    href: "/articles/yosemite-camping-complete-guide"
  }, "The complete camping guide"), React.createElement("span", null, "Every campground, the release calendar, and the strategy.")), React.createElement("li", null, React.createElement("a", {
    href: "/articles/yosemite-trip-cost-budget-2026"
  }, "What a Yosemite trip costs"), React.createElement("span", null, "The arithmetic of each lodging approach across a whole trip.")), React.createElement("li", null, React.createElement("a", {
    href: "/articles/getting-to-yosemite"
  }, "Getting to Yosemite"), React.createElement("span", null, "The four entrances and the roads that reach them.")), React.createElement("li", null, React.createElement("a", {
    href: "/articles/where-to-eat-yosemite"
  }, "Where to eat"), React.createElement("span", null, "Dinner in the park and town by town, and what closes when.")), React.createElement("li", null, React.createElement("a", {
    href: "/itineraries",
    onClick: e => goRoute(e, "itineraries")
  }, "Itineraries"), React.createElement("span", null, "One, two, and three-day plans to hang the nights on."))), React.createElement("p", {
    className: "article-aff-note",
    style: {
      marginTop: 32
    }
  }, "The availability links on this page are affiliate links. If you book through one, The Talus Field may earn a small commission at no extra cost to you. Which property is recommended, and in what order, does not change for it: the Ahwahnee and the Wawona Hotel are here on their merits and the closed one carries no link at all, the in-park cards send you to the concessioner and earn nothing, and the named lodges in the corridor lists are described because the gateway reporting already covers them. Those links search the town rather than the property, which is the search that answers what is left on your dates.", " ", React.createElement("a", {
    href: "/affiliate"
  }, "Full disclosure."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingBottom: 8
    }
  }, React.createElement(GuidePromo, {
    go: go,
    location: "stay",
    title: "Booked the beds. Now the days.",
    body: "The Field Guide app carries the stops, the parking notes, offline maps for a park with no signal, and a day-by-day planner that knows how long the drives actually take. One purchase, eighteen months of access.",
    style: {
      marginTop: 40,
      marginBottom: 40
    }
  }), React.createElement(NewsletterInline, {
    location: "stay",
    tag: "lodging",
    heading: "Rooms come back. Someone has to be watching.",
    blurb: "Sunday Field Notes carries what is opening, closing, and quietly becoming available in the park, written from inside it. One short letter a week. Free."
  })));
}
window.StayPage = StayPage;
