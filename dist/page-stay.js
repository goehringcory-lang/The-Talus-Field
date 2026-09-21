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
  photo: "img/yosemite-valley-lodge-entrance.jpg",
  caption: "The Lodge entrance at dusk. Lower Yosemite Fall is directly across the road.",
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
  photo: "img/tuolumne-meadows-lembert-dome.jpg",
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
var STAY_HERO = {
  image: "img/half-dome-alpenglow-madhu-shesharam.jpg",
  alt: "Half Dome in alpenglow, seen from Glacier Point",
  credit: "Photo: Madhu Shesharam / Unsplash"
};
var STAY_SEARCH_PLACES = [{
  id: "park",
  dest: "Yosemite National Park",
  label: "Around the whole park"
}, {
  id: "el-portal",
  dest: "El Portal, California",
  label: "El Portal · Highway 140, closest"
}, {
  id: "mariposa",
  dest: "Mariposa, California",
  label: "Mariposa · Highway 140"
}, {
  id: "groveland",
  dest: "Groveland, California",
  label: "Groveland · Highway 120"
}, {
  id: "fish-camp",
  dest: "Fish Camp, California",
  label: "Fish Camp · Highway 41"
}, {
  id: "oakhurst",
  dest: "Oakhurst, California",
  label: "Oakhurst · Highway 41"
}, {
  id: "lee-vining",
  dest: "Lee Vining, California",
  label: "Lee Vining · Tioga Pass, seasonal"
}];
var STAY_PICKS = [{
  id: "valley",
  label: "Closest to the Valley",
  town: "El Portal",
  road: "Highway 140 · open year-round",
  drive: "25 to 35 minutes to the Valley",
  why: "The closest gateway by a significant margin. You can roll out of bed at 5:30 and be at Tunnel View by 6:15.",
  cost: "Limited dining, limited inventory, and lodging priced like in-park lodging because the location is that good.",
  dest: "El Portal, California",
  cta: "See what El Portal has on your dates"
}, {
  id: "value",
  label: "A real town, on a budget",
  town: "Mariposa",
  road: "Highway 140 · open year-round",
  drive: "45 minutes to an hour to the Valley",
  why: "The most full-service of the western gateways: a real downtown, and lodging from highway chains to historic bed-and-breakfasts.",
  cost: "Ninety minutes of round-trip driving a day that you would not be doing closer in, and earlier alarms for sunrise.",
  dest: "Mariposa, California",
  cta: "See what Mariposa has on your dates"
}, {
  id: "reach",
  label: "Valley, Hetch Hetchy and Tuolumne",
  town: "Groveland",
  road: "Highway 120 · chains common in winter",
  drive: "65 to 80 minutes to the Valley",
  why: "With Tioga Road open, this is the only corridor that puts Yosemite Valley, Hetch Hetchy, and Tuolumne Meadows all within reach of one morning's drive.",
  cost: "A higher-elevation approach with winter chain controls, through the 2013 Rim Fire burn scar.",
  dest: "Groveland, California",
  cta: "See what Groveland has on your dates"
}, {
  id: "sequoias",
  label: "Giant sequoias first",
  town: "Fish Camp",
  road: "Highway 41 · open year-round",
  drive: "About 2 miles to the South Entrance",
  why: "The closest bed to the Mariposa Grove and the South Entrance, which matters on a sequoia-first trip with an early start.",
  cost: "No real services, nothing to do in the evening, and the Valley is still most of the Oakhurst drive away.",
  dest: "Fish Camp, California",
  cta: "See what Fish Camp has on your dates"
}, {
  id: "high",
  label: "High country and Mono Lake",
  town: "Lee Vining",
  road: "Tioga Pass · seasonal",
  drive: "30 minutes to Tuolumne Meadows",
  why: "The only east-side gateway, and a base for the high country, Mono Lake, and the eastern Sierra rather than a substitute for the western towns.",
  cost: "Reachable from the park only while Tioga Pass is open, and ninety minutes minimum to the Valley.",
  dest: "Lee Vining, California",
  cta: "See what Lee Vining has on your dates"
}, {
  id: "winter",
  label: "A winter trip",
  town: "Highway 140",
  road: "El Portal and Mariposa · open year-round",
  drive: "the winter answer",
  why: "It runs along the canyon bottom and takes rain on the days Highway 41 and Highway 120 take snow, and it is the only corridor with year-round bus service into the park.",
  cost: "Tioga Pass is closed, so the east side is out entirely.",
  dest: "Mariposa, California",
  cta: "Search Highway 140 lodging"
}];
var CORRIDOR_EXTRAS = {
  "corridor-140": {
    num: "140",
    road: "Highway 140",
    title: "The Merced canyon",
    dest: "Mariposa, California",
    cta: "Search all of Highway 140",
    photoFrom: "el-portal"
  },
  "corridor-120": {
    num: "120",
    road: "Highway 120 west",
    title: "Big Oak Flat",
    dest: "Groveland, California",
    cta: "Search all of Highway 120"
  },
  "corridor-41": {
    num: "41",
    road: "Highway 41",
    title: "The south",
    dest: "Oakhurst, California",
    cta: "Search all of Highway 41",
    photoFrom: "fish-camp"
  },
  "corridor-395": {
    num: "395",
    road: "US 395",
    title: "Tioga Road east",
    dest: "Lee Vining, California",
    cta: "Search the east side",
    photoFrom: "lee-vining"
  }
};
var SEASON_ANSWERS = {
  "season-winter": "Base on Highway 140.",
  "season-spring": "A Valley trip. Stay close.",
  "season-summer": "Highway 120 is the strongest base.",
  "season-fall": "The season worth booking."
};
var Arrow = () => React.createElement("span", {
  className: "stay-book__arrow",
  "aria-hidden": "true"
}, "↗");
function BookButton({
  destination,
  list,
  slug,
  name,
  children,
  size
}) {
  return React.createElement(AvailabilityLink, {
    destination: destination,
    list: list,
    slug: slug,
    name: name || destination + " lodging search",
    className: ["stay-book", size && "stay-book--" + size].filter(Boolean).join(" ")
  }, React.createElement("span", null, children), React.createElement(Arrow, null));
}
function isoToday() {
  var d = new Date();
  var p = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function StaySearch() {
  var [place, setPlace] = React.useState("park");
  var [checkin, setCheckin] = React.useState("");
  var [checkout, setCheckout] = React.useState("");
  var row = STAY_SEARCH_PLACES.find(p => p.id === place) || STAY_SEARCH_PLACES[0];
  var url = window.expediaSearchUrl(row.dest);
  if (checkin && checkout && checkout > checkin) {
    url += "&startDate=" + checkin + "&endDate=" + checkout + "&d1=" + checkin + "&d2=" + checkout;
  }
  var href = window.buildAffiliateLink ? window.buildAffiliateLink("expedia", url) : url;
  return React.createElement("section", {
    className: "stay-search",
    "aria-labelledby": "stay-search-h"
  }, React.createElement("div", {
    className: "stay-search__head"
  }, React.createElement("h2", {
    id: "stay-search-h",
    className: "stay-search__title"
  }, "See what is open on your dates"), React.createElement("span", {
    className: "stay-search__sub"
  }, "Live rates and availability, searched on Expedia")), React.createElement("div", {
    className: "stay-search__fields"
  }, React.createElement("label", {
    className: "stay-field"
  }, React.createElement("span", {
    className: "stay-field__label"
  }, "Where"), React.createElement("select", {
    value: place,
    onChange: e => setPlace(e.target.value)
  }, STAY_SEARCH_PLACES.map(p => React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.label)))), React.createElement("label", {
    className: "stay-field"
  }, React.createElement("span", {
    className: "stay-field__label"
  }, "Check in"), React.createElement("input", {
    type: "date",
    value: checkin,
    min: isoToday(),
    onChange: e => setCheckin(e.target.value)
  })), React.createElement("label", {
    className: "stay-field"
  }, React.createElement("span", {
    className: "stay-field__label"
  }, "Check out"), React.createElement("input", {
    type: "date",
    value: checkout,
    min: checkin || isoToday(),
    onChange: e => setCheckout(e.target.value)
  })), React.createElement("a", {
    className: "aff-link stay-book stay-book--search",
    href: href,
    target: "_blank",
    rel: "sponsored noopener noreferrer",
    "data-aff-network": "expedia",
    "data-aff-list": "stay_search",
    "data-aff-item-slug": row.id,
    "data-aff-name": row.dest + " lodging search"
  }, React.createElement("span", null, "Search availability"), React.createElement(Arrow, null))), React.createElement("div", {
    className: "stay-search__foot"
  }, React.createElement("p", null, "Opens Expedia in a new tab. These are affiliate links: if you book through one, The Talus Field may earn a commission at no extra cost to you. What is recommended, and in what order, does not change for it. ", React.createElement("a", {
    href: "/affiliate"
  }, "Full disclosure.")), React.createElement("ul", {
    className: "stay-search__facts"
  }, React.createElement("li", null, GATEWAYS.length, " gateway towns"), React.createElement("li", null, CORRIDORS.length, " roads in"), React.createElement("li", null, "1 operator inside the park"))));
}
function RoadSchematic() {
  return React.createElement("figure", {
    className: "stay-map"
  }, React.createElement("svg", {
    viewBox: "0 0 640 530",
    role: "img",
    "aria-label": "Schematic of the four roads into Yosemite and the towns on each, with drive times to Yosemite Valley"
  }, React.createElement("path", {
    className: "stay-map__park",
    d: "M200,185 C210,100 300,50 400,70 C470,80 515,95 530,128 C565,200 520,300 450,360 C400,410 360,430 322,425 C290,420 270,350 262,296 C250,250 205,230 200,185 Z"
  }), React.createElement("text", {
    className: "stay-map__parkname",
    x: "392",
    y: "222"
  }, "YOSEMITE NATIONAL PARK"), React.createElement("path", {
    className: "stay-map__minor",
    d: "M200,185 Q215,140 268,112"
  }), React.createElement("path", {
    className: "stay-map__road stay-map__road--seasonal",
    d: "M250,212 Q340,150 470,150 L530,128 L575,112"
  }), React.createElement("path", {
    className: "stay-map__road",
    d: "M330,270 Q290,250 250,212 L200,185 Q140,160 90,150"
  }), React.createElement("path", {
    className: "stay-map__road",
    d: "M330,270 L262,296 L235,305 Q170,320 110,360"
  }), React.createElement("path", {
    className: "stay-map__road",
    d: "M330,270 Q350,330 325,385 L322,425 L320,445 L300,495"
  }), React.createElement("g", {
    className: "stay-map__gate"
  }, React.createElement("rect", {
    x: "195",
    y: "180",
    width: "10",
    height: "10"
  }), React.createElement("rect", {
    x: "257",
    y: "291",
    width: "10",
    height: "10"
  }), React.createElement("rect", {
    x: "317",
    y: "420",
    width: "10",
    height: "10"
  }), React.createElement("rect", {
    x: "525",
    y: "123",
    width: "10",
    height: "10"
  })), React.createElement("g", {
    className: "stay-map__place"
  }, React.createElement("circle", {
    cx: "268",
    cy: "112",
    r: "4"
  }), React.createElement("circle", {
    cx: "470",
    cy: "150",
    r: "4"
  }), React.createElement("circle", {
    cx: "325",
    cy: "385",
    r: "4"
  }), React.createElement("circle", {
    cx: "330",
    cy: "270",
    r: "9"
  })), React.createElement("circle", {
    className: "stay-map__ring",
    cx: "330",
    cy: "270",
    r: "14"
  }), React.createElement("g", {
    className: "stay-map__town"
  }, React.createElement("circle", {
    cx: "235",
    cy: "305",
    r: "7"
  }), React.createElement("circle", {
    cx: "110",
    cy: "360",
    r: "7"
  }), React.createElement("circle", {
    cx: "90",
    cy: "150",
    r: "7"
  }), React.createElement("circle", {
    cx: "320",
    cy: "445",
    r: "7"
  }), React.createElement("circle", {
    cx: "300",
    cy: "495",
    r: "7"
  }), React.createElement("circle", {
    cx: "575",
    cy: "112",
    r: "7"
  })), React.createElement("g", {
    className: "stay-map__label"
  }, React.createElement("text", {
    className: "stay-map__valley",
    x: "352",
    y: "266"
  }, "YOSEMITE VALLEY"), React.createElement("text", {
    className: "stay-map__note",
    x: "352",
    y: "282"
  }, "every drive time is to here"), React.createElement("text", {
    className: "stay-map__note",
    x: "280",
    y: "100"
  }, "Hetch Hetchy"), React.createElement("text", {
    className: "stay-map__note",
    x: "470",
    y: "172",
    textAnchor: "middle"
  }, "Tuolumne Meadows"), React.createElement("text", {
    className: "stay-map__note",
    x: "340",
    y: "389"
  }, "Wawona · Mariposa Grove"), React.createElement("text", {
    className: "stay-map__name",
    x: "222",
    y: "284",
    textAnchor: "end"
  }, "El Portal"), React.createElement("text", {
    className: "stay-map__note",
    x: "222",
    y: "298",
    textAnchor: "end"
  }, "25 to 35 min"), React.createElement("text", {
    className: "stay-map__name",
    x: "110",
    y: "388",
    textAnchor: "middle"
  }, "Mariposa"), React.createElement("text", {
    className: "stay-map__note",
    x: "110",
    y: "404",
    textAnchor: "middle"
  }, "45 to 60 min"), React.createElement("text", {
    className: "stay-map__name",
    x: "90",
    y: "122",
    textAnchor: "middle"
  }, "Groveland"), React.createElement("text", {
    className: "stay-map__note",
    x: "90",
    y: "138",
    textAnchor: "middle"
  }, "65 to 80 min"), React.createElement("text", {
    className: "stay-map__name",
    x: "338",
    y: "449"
  }, "Fish Camp"), React.createElement("text", {
    className: "stay-map__note",
    x: "338",
    y: "465"
  }, "2 miles to the South Entrance"), React.createElement("text", {
    className: "stay-map__name",
    x: "318",
    y: "499"
  }, "Oakhurst"), React.createElement("text", {
    className: "stay-map__note",
    x: "318",
    y: "515"
  }, "75 to 90 min"), React.createElement("text", {
    className: "stay-map__name",
    x: "622",
    y: "86",
    textAnchor: "end"
  }, "Lee Vining"), React.createElement("text", {
    className: "stay-map__note",
    x: "622",
    y: "100",
    textAnchor: "end"
  }, "90 min minimum")), React.createElement("g", {
    className: "stay-map__shield"
  }, React.createElement("rect", {
    x: "152",
    y: "318",
    width: "34",
    height: "18"
  }), React.createElement("text", {
    x: "169",
    y: "331",
    textAnchor: "middle"
  }, "140"), React.createElement("rect", {
    x: "128",
    y: "146",
    width: "34",
    height: "18"
  }), React.createElement("text", {
    x: "145",
    y: "159",
    textAnchor: "middle"
  }, "120"), React.createElement("rect", {
    x: "330",
    y: "330",
    width: "28",
    height: "18"
  }), React.createElement("text", {
    x: "344",
    y: "343",
    textAnchor: "middle"
  }, "41"), React.createElement("rect", {
    x: "350",
    y: "138",
    width: "92",
    height: "18"
  }), React.createElement("text", {
    x: "396",
    y: "151",
    textAnchor: "middle"
  }, "TIOGA · SEASONAL"))), React.createElement("figcaption", null, "A schematic, not a map to scale. Filled dots are the gateway towns, squares are the four entrance stations, and the dashed road closes for winter."));
}
function StayPicker() {
  var [picked, setPicked] = React.useState("valley");
  var sel = STAY_PICKS.find(p => p.id === picked) || STAY_PICKS[0];
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "stay-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Start here"), React.createElement("h2", {
    className: "stay-h2"
  }, "Choose the road first. The town comes after.")), React.createElement("p", {
    className: "stay-head__note"
  }, "The road decides the drive you make twice a day, what else is reachable from the room, and in winter whether you are driving in rain or over a pass. What matters most on this trip?")), React.createElement("div", {
    className: "stay-decide"
  }, React.createElement(RoadSchematic, null), React.createElement("div", {
    className: "stay-picker"
  }, React.createElement("div", {
    className: "stay-picker__chips",
    role: "group",
    "aria-label": "What matters most on this trip"
  }, STAY_PICKS.map(p => React.createElement("button", {
    key: p.id,
    type: "button",
    className: "stay-chip" + (p.id === picked ? " is-on" : ""),
    "aria-pressed": p.id === picked,
    onClick: () => setPicked(p.id)
  }, p.label))), React.createElement("div", {
    className: "stay-plate stay-picker__result",
    "aria-live": "polite"
  }, React.createElement("div", {
    className: "stay-picker__top"
  }, React.createElement("span", {
    className: "stay-plate__eyebrow"
  }, "Your base"), React.createElement("span", {
    className: "stay-picker__road"
  }, sel.road)), React.createElement("div", {
    className: "stay-picker__town"
  }, React.createElement("span", null, sel.town), React.createElement("em", null, sel.drive)), React.createElement("p", {
    className: "stay-picker__why"
  }, sel.why), React.createElement("p", {
    className: "stay-picker__cost"
  }, React.createElement("strong", null, "The cost:"), " ", sel.cost), React.createElement(BookButton, {
    destination: sel.dest,
    list: "stay_picker",
    slug: sel.id,
    size: "lg"
  }, sel.cta), React.createElement("p", {
    className: "stay-plate__fine"
  }, "Searches the town on Expedia, never one property, because that is the search that answers what is left. Affiliate link.")))));
}
function StayFigure({
  item,
  className
}) {
  if (!item.photo) return null;
  return React.createElement("figure", {
    className: ["stay-card__figure", className].filter(Boolean).join(" ")
  }, React.createElement(ResponsiveImage, {
    image: item.photo,
    alt: item.caption,
    sizes: SIZES_CARD,
    className: "stay-card__img"
  }), React.createElement("figcaption", {
    className: "stay-card__caption"
  }, item.caption, item.credit && React.createElement("span", {
    className: "stay-card__credit"
  }, item.credit)));
}
function StayCard({
  item,
  lead
}) {
  var cls = ["stay-card", lead ? "stay-card--lead" : "stay-card--compact", item.closed && "stay-card--closed"];
  return React.createElement("article", {
    className: cls.filter(Boolean).join(" ")
  }, lead && React.createElement(StayFigure, {
    item: item
  }), React.createElement("div", {
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
  }, item.warn), React.createElement("div", {
    className: "stay-card__actions"
  }, !item.closed && React.createElement("a", {
    className: "stay-ghost",
    href: TRAVEL_YOSEMITE,
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("span", null, "Book at travelyosemite.com"), React.createElement(Arrow, null)), item.more && React.createElement("a", {
    className: "stay-card__more",
    href: item.more
  }, "The longer version →"))));
}
function GatewayCard({
  item
}) {
  return React.createElement("article", {
    className: "stay-town"
  }, React.createElement("h4", {
    className: "stay-town__name"
  }, item.name), React.createElement("dl", {
    className: "stay-town__facts"
  }, React.createElement("dt", null, "Drive"), React.createElement("dd", {
    className: "stay-town__drive"
  }, item.drive), React.createElement("dt", null, "Road"), React.createElement("dd", null, item.road)), React.createElement("p", {
    className: "stay-town__text"
  }, item.body), React.createElement("p", {
    className: "stay-town__note"
  }, React.createElement("strong", null, "Who it fits:"), " ", item.who), React.createElement("p", {
    className: "stay-town__note"
  }, React.createElement("strong", null, "The cost:"), " ", item.against), React.createElement("div", {
    className: "stay-town__actions"
  }, React.createElement(BookButton, {
    destination: item.dest,
    list: "stay_gateway",
    slug: item.id,
    name: item.name + " lodging search"
  }, "See what ", item.name, " has on your dates"), item.article && React.createElement("a", {
    className: "stay-card__more",
    href: item.article
  }, "The full chapter on ", item.name, " →")));
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
  }, "What ", item.town, " has on your dates ↗"));
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
  var extra = CORRIDOR_EXTRAS[corridor.id] || {};
  var lead = extra.photoFrom && towns.find(t => t.id === extra.photoFrom);
  var solo = towns.length === 1;
  var stays = props.length > 0 && React.createElement("div", {
    className: "stay-props-wrap"
  }, React.createElement("div", {
    className: "stay-props__head"
  }, React.createElement("span", {
    className: "stay-props__label"
  }, "Named stays on this road"), React.createElement("span", {
    className: "stay-props__lead"
  }, "The links search the town, not the property, because that is the search that answers what is left.")), React.createElement("div", {
    className: "stay-props"
  }, props.map(([id, p]) => React.createElement(PropertyRow, {
    key: id,
    id: id,
    item: p
  }))));
  return React.createElement("div", {
    className: "stay-corridor" + (solo ? " stay-corridor--solo" : ""),
    id: corridor.id
  }, React.createElement("div", {
    className: "stay-corridor__top"
  }, React.createElement("div", {
    className: "stay-corridor__side"
  }, React.createElement("div", {
    className: "stay-corridor__head"
  }, React.createElement("span", {
    className: "stay-corridor__num",
    "aria-hidden": "true"
  }, extra.num), React.createElement("div", null, React.createElement("h3", null, React.createElement("span", {
    className: "stay-sr"
  }, extra.road, ": "), extra.title || corridor.name), React.createElement("div", {
    className: "stay-corridor__kicker"
  }, corridor.kicker))), React.createElement("p", {
    className: "stay-corridor__verdict"
  }, corridor.verdict), React.createElement("div", {
    className: "stay-corridor__intro"
  }, (CORRIDOR_INTROS[corridor.id] || (() => null))()), lead && React.createElement(StayFigure, {
    item: lead,
    className: "stay-corridor__figure"
  }), extra.dest && React.createElement(BookButton, {
    destination: extra.dest,
    list: "stay_corridor",
    slug: corridor.id
  }, extra.cta)), React.createElement("div", {
    className: "stay-corridor__towns"
  }, towns.map(t => React.createElement(GatewayCard, {
    key: t.id,
    item: t
  })), solo && stays)), !solo && stays);
}
function SeasonCard({
  item
}) {
  return React.createElement("article", {
    className: "stay-season"
  }, React.createElement("h3", {
    className: "stay-season__name"
  }, item.name), React.createElement("div", {
    className: "stay-season__span"
  }, item.span), SEASON_ANSWERS[item.id] && React.createElement("p", {
    className: "stay-season__answer"
  }, SEASON_ANSWERS[item.id]), React.createElement("p", {
    className: "stay-season__text"
  }, item.body), React.createElement(BookButton, {
    destination: item.dest,
    list: "stay_season",
    slug: item.id,
    name: item.name + " lodging search",
    size: "sm"
  }, item.cta.replace(/\s*→$/, "")));
}
function StayPage({
  go
}) {
  var goRoute = (e, route) => {
    e.preventDefault();
    go(route);
  };
  var valley = IN_PARK.slice(0, 3);
  var others = IN_PARK.slice(3);
  return React.createElement("div", {
    className: "page stay-page"
  }, React.createElement("header", {
    className: "stay-hero"
  }, React.createElement(ResponsiveImage, {
    image: STAY_HERO.image,
    alt: STAY_HERO.alt,
    sizes: "100vw",
    eager: true,
    className: "stay-hero__img"
  }), React.createElement("div", {
    className: "stay-hero__scrim",
    "aria-hidden": "true"
  }), React.createElement("div", {
    className: "wrap stay-hero__inner"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "Where to stay"
    }]
  }), React.createElement("div", {
    className: "stay-hero__eyebrow"
  }, "Lodging · the whole board"), React.createElement("h1", null, "Where to Stay in Yosemite"), React.createElement("p", {
    className: "stay-hero__dek"
  }, "Every bed in and around the park, sorted by what it is and who it fits. Pick the road, then the town, then see what is actually left on your dates.")), React.createElement("div", {
    className: "stay-hero__credit"
  }, STAY_HERO.credit)), React.createElement("div", {
    className: "wrap stay-search-wrap"
  }, React.createElement(StaySearch, null), React.createElement("nav", {
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
    id: "decide"
  }, React.createElement(StayPicker, null)), React.createElement("section", {
    className: "wrap stay-section stay-band",
    id: "in-park"
  }, React.createElement("div", {
    className: "stay-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "First choice · ", IN_PARK.filter(p => !p.closed).length, " bookable, ", IN_PARK.filter(p => p.closed).length, " closed"), React.createElement("h2", {
    className: "stay-h2"
  }, "Inside the park")), React.createElement("p", {
    className: "stay-head__note"
  }, "The people sleeping in the Valley are standing under Yosemite Falls at seven in the morning with nobody around. The people sleeping in a gateway town are, at that moment, sitting in the entrance line. One concessioner runs every bed inside the boundary and books it at travelyosemite.com. We earn nothing on these links, and they still come first.")), React.createElement("div", {
    className: "stay-grid stay-grid--lead"
  }, valley.map(p => React.createElement(StayCard, {
    key: p.id,
    item: p,
    lead: true
  }))), React.createElement("div", {
    className: "stay-grid stay-grid--compact"
  }, others.map(p => React.createElement(StayCard, {
    key: p.id,
    item: p
  }))), React.createElement("aside", {
    className: "stay-plate stay-fallback",
    "aria-label": "Lodging availability"
  }, React.createElement("div", {
    className: "stay-fallback__main"
  }, React.createElement("div", {
    className: "stay-plate__eyebrow"
  }, "In-park inventory gone for your dates?"), React.createElement("h2", {
    className: "stay-fallback__title"
  }, "For summer it usually is. Hold a room outside, then watch for one inside."), React.createElement("ol", {
    className: "stay-fallback__steps"
  }, React.createElement("li", null, React.createElement("span", null, "01"), "Search the boundary for your dates. Filter for free cancellation, and read the rate's terms before you book."), React.createElement("li", null, React.createElement("span", null, "02"), "Check travelyosemite.com daily in the four to six weeks before the trip. Rooms come back."), React.createElement("li", null, React.createElement("span", null, "03"), "If the Valley comes through, take it. If not, you already have a bed and a plan."))), React.createElement("div", {
    className: "stay-fallback__ask"
  }, React.createElement("p", null, "The two-minute version of finding out what is actually left."), React.createElement(BookButton, {
    destination: "Yosemite National Park",
    list: "stay_in_park_fallback",
    slug: "in-park-fallback",
    size: "lg"
  }, "Search lodging around Yosemite"), React.createElement("span", {
    className: "stay-fallback__fine"
  }, "On Expedia, in a new tab. Affiliate link.")))), React.createElement("section", {
    className: "wrap stay-section",
    id: "gateways"
  }, React.createElement("div", {
    className: "stay-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Outside the park · ", CORRIDORS.length, " corridors, ", GATEWAYS.length, " towns"), React.createElement("h2", {
    className: "stay-h2"
  }, "Road by road, town by town")), React.createElement("p", {
    className: "stay-head__note"
  }, "Four entrance stations sit at the corners of the park, each on its own road, each with its towns. Outside the boundary there are hundreds of properties and a real market, which is why these cards send you to a live availability search. The full comparison is in", " ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "the gateway towns article"), ".")), CORRIDORS.map(c => React.createElement(React.Fragment, {
    key: c.id
  }, React.createElement(CorridorSection, {
    corridor: c,
    towns: c.towns.map(id => GATEWAYS.find(t => t.id === id)).filter(Boolean)
  }), c.id === "corridor-120" && React.createElement(ExpediaBanner, {
    list: "stay_banner",
    slug: "stay"
  })))), React.createElement("section", {
    className: "stay-section stay-seasons-band",
    id: "seasons"
  }, React.createElement("div", {
    className: "wrap"
  }, React.createElement("div", {
    className: "stay-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Four seasons, four answers"), React.createElement("h2", {
    className: "stay-h2"
  }, "When to stay where")), React.createElement("p", {
    className: "stay-head__note"
  }, "The corridor that is right in July is not the one that is right in January, because the roads change and so does what is open at the end of them. This is the same four corridors read against the calendar.")), React.createElement("div", {
    className: "stay-seasons"
  }, SEASONS.map(s => React.createElement(SeasonCard, {
    key: s.id,
    item: s
  }))))), React.createElement("section", {
    className: "wrap stay-section",
    id: "booking"
  }, React.createElement("h2", {
    className: "stay-h2"
  }, "How the booking actually works"), React.createElement("div", {
    className: "stay-facts"
  }, React.createElement("div", {
    className: "stay-fact"
  }, React.createElement("div", {
    className: "stay-fact__big"
  }, "366 days"), React.createElement("p", null, "In-park reservations open one year and a day ahead, on a rolling basis. For peak summer dates at the Valley properties, availability at the moment of release is measured in minutes. Set a reminder for the morning your window opens.")), React.createElement("div", {
    className: "stay-fact"
  }, React.createElement("div", {
    className: "stay-fact__big"
  }, "Rooms come back"), React.createElement("p", null, "People drop reservations continuously, with a distinct wave in the final weeks before any date. Check daily, at varied times, in the four to six weeks before your trip. I have watched people assemble three-night Valley stays in June out of one-night cancellations.")), React.createElement("div", {
    className: "stay-fact"
  }, React.createElement("div", {
    className: "stay-fact__big"
  }, "6 to 12 months"), React.createElement("p", null, "How far ahead gateway lodging fills for summer and holiday weekends. The rest of the year it behaves like a normal hotel market: the same room is a different price in October than in July.")), React.createElement("div", {
    className: "stay-fact",
    id: "camping"
  }, React.createElement("div", {
    className: "stay-fact__big"
  }, "Camping"), React.createElement("p", null, "The park's campgrounds release on Recreation.gov five months ahead, and the popular Valley loops are gone in minutes. The whole system is in", " ", React.createElement("a", {
    href: "/articles/yosemite-camping-complete-guide"
  }, "the camping guide"), ". When the site or the weather falls through,", " ", React.createElement(AvailabilityLink, {
    destination: "Mariposa, California",
    list: "stay_camping_fallback",
    slug: "camping-fallback",
    name: "Mariposa lodging search"
  }, "search Mariposa for a roof tonight ↗"))))), React.createElement("section", {
    className: "wrap stay-section"
  }, React.createElement("aside", {
    className: "stay-closing",
    "aria-label": "Lodging availability"
  }, React.createElement(StayFigure, {
    item: IN_PARK.find(p => p.id === "tuolumne-lodge"),
    className: "stay-closing__figure"
  }), React.createElement("div", {
    className: "stay-closing__body"
  }, React.createElement("h2", {
    className: "stay-closing__title"
  }, "You know the road now. The only open question is your dates."), React.createElement("p", null, "One search around the boundary shows every town on this page at once, with live rates. Booking through it costs you nothing extra and helps keep this site written from inside the park."), React.createElement("div", {
    className: "stay-closing__row"
  }, React.createElement(BookButton, {
    destination: "Yosemite National Park",
    list: "stay_closing",
    slug: "closing",
    size: "lg"
  }, "Search every Yosemite gateway"), React.createElement("span", {
    className: "stay-closing__fine"
  }, "On Expedia · affiliate link"))))), React.createElement("section", {
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
