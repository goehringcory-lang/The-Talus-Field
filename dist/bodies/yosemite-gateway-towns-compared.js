window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
function townAvailability(town, dest) {
  return React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 14,
      color: "var(--ink-3)"
    }
  }, "Current rates and availability:", " ", React.createElement(AvailabilityLink, {
    destination: dest,
    list: "article_town",
    slug: "yosemite-gateway-towns-compared",
    name: town + " lodging search"
  }, town, " lodging →"));
}
var GATEWAY_TOWNS = {
  "el-portal": {
    name: "El Portal",
    href: "#sec-1-el-portal",
    dest: "El Portal, California"
  },
  "mariposa": {
    name: "Mariposa",
    href: "#sec-2-mariposa",
    dest: "Mariposa, California"
  },
  "oakhurst": {
    name: "Oakhurst",
    href: "#sec-3-oakhurst",
    dest: "Oakhurst, California"
  },
  "groveland": {
    name: "Groveland",
    href: "#sec-4-groveland",
    dest: "Groveland, California"
  },
  "lee-vining": {
    name: "Lee Vining",
    href: "#sec-5-lee-vining",
    dest: "Lee Vining, California"
  }
};
function TownFacts({
  rows
}) {
  return React.createElement("dl", {
    className: "town-facts"
  }, rows.map(([k, v]) => React.createElement(React.Fragment, {
    key: k
  }, React.createElement("dt", null, k), React.createElement("dd", null, v))));
}
var MAP_ROADS = [{
  d: "M138 478 C152 462 164 450 175 436 C200 398 232 356 258 329 C268 325 276 323 284 322 C306 317 330 305 346 288"
}, {
  d: "M18 238 C30 236 40 234 52 233 C95 231 130 260 160 252 C185 246 200 250 217 256 C228 264 240 274 250 282 C275 295 305 297 335 292"
}, {
  d: "M320 560 L320 530 C322 502 326 470 328 448 C328 440 328 432 328 426 C325 419 320 413 317 407 C312 385 320 365 325 350 C332 328 336 310 341 293"
}, {
  d: "M250 282 C300 258 360 240 400 228 C425 220 445 216 457 213 C475 207 490 200 500 192 C520 180 545 170 564 164",
  seasonal: true
}, {
  d: "M585 60 C578 95 570 130 564 164 C558 205 552 250 548 295"
}, {
  d: "M217 256 C225 225 240 195 256 171",
  minor: true
}];
var MAP_TOWN_POINTS = [{
  key: "el-portal",
  x: 258,
  y: 329,
  lx: 247,
  ly: 352,
  anchor: "end"
}, {
  key: "mariposa",
  x: 175,
  y: 436,
  lx: 175,
  ly: 456,
  anchor: "middle"
}, {
  key: "oakhurst",
  x: 320,
  y: 530,
  lx: 332,
  ly: 535,
  anchor: "start"
}, {
  key: "groveland",
  x: 52,
  y: 233,
  lx: 52,
  ly: 214,
  anchor: "middle"
}, {
  key: "lee-vining",
  x: 564,
  y: 164,
  lx: 564,
  ly: 146,
  anchor: "middle"
}];
var MAP_ENTRANCES = [{
  name: "Arch Rock",
  x: 284,
  y: 322,
  lx: 294,
  ly: 337,
  anchor: "start"
}, {
  name: "Big Oak Flat",
  x: 217,
  y: 256,
  lx: 209,
  ly: 250,
  anchor: "end"
}, {
  name: "South",
  x: 328,
  y: 426,
  lx: 321,
  ly: 442,
  anchor: "end"
}, {
  name: "Tioga Pass",
  x: 500,
  y: 192,
  lx: 507,
  ly: 184,
  anchor: "start"
}];
var MAP_POIS = [{
  name: "Yosemite Valley",
  x: 346,
  y: 288,
  lx: 358,
  ly: 293,
  anchor: "start",
  big: true
}, {
  name: "Tuolumne Meadows",
  x: 457,
  y: 213,
  lx: 457,
  ly: 200,
  anchor: "middle"
}, {
  name: "Wawona",
  x: 317,
  y: 407,
  lx: 308,
  ly: 404,
  anchor: "end"
}, {
  name: "Mariposa Grove",
  x: 345,
  y: 422,
  lx: 354,
  ly: 419,
  anchor: "start"
}, {
  name: "Hetch Hetchy",
  x: 256,
  y: 171,
  lx: 264,
  ly: 167,
  anchor: "start"
}];
var MAP_ROAD_LABELS = [{
  t: "140",
  x: 212,
  y: 391
}, {
  t: "120",
  x: 120,
  y: 250
}, {
  t: "41",
  x: 325,
  y: 489
}, {
  t: "395",
  x: 552,
  y: 262
}];
var MAP_HINTS = [{
  t: "to Merced",
  x: 126,
  y: 494,
  anchor: "middle"
}, {
  t: "to the Bay Area",
  x: 22,
  y: 256,
  anchor: "start"
}, {
  t: "to Fresno",
  x: 320,
  y: 574,
  anchor: "middle"
}, {
  t: "to Reno",
  x: 585,
  y: 48,
  anchor: "middle"
}, {
  t: "to Mammoth",
  x: 548,
  y: 310,
  anchor: "middle"
}];
function GatewayMap() {
  return React.createElement("figure", {
    className: "gwmap"
  }, React.createElement("div", {
    className: "gwmap__scroll"
  }, React.createElement("svg", {
    className: "gwmap__svg",
    viewBox: "0 0 640 584",
    xmlns: "http://www.w3.org/2000/svg"
  }, React.createElement("path", {
    className: "gwmap__park",
    d: "M212 303 L208 169 L274 82 L366 29 L458 70 L500 151 L500 192 L518 279 L490 372 L426 425 L329 436 L297 407 L288 355 L272 326 Z"
  }), React.createElement("text", {
    className: "gwmap__parkname",
    x: "366",
    y: "106",
    textAnchor: "middle"
  }, "YOSEMITE"), React.createElement("text", {
    className: "gwmap__parkname",
    x: "366",
    y: "122",
    textAnchor: "middle"
  }, "NATIONAL PARK"), MAP_ROADS.map((r, i) => React.createElement("path", {
    key: i,
    className: "gwmap__road" + (r.seasonal ? " gwmap__road--seasonal" : "") + (r.minor ? " gwmap__road--minor" : ""),
    d: r.d
  })), React.createElement("text", {
    className: "gwmap__roadname",
    x: "385",
    y: "218",
    textAnchor: "middle"
  }, "Tioga Road"), React.createElement("ellipse", {
    className: "gwmap__lake",
    cx: "612",
    cy: "132",
    rx: "24",
    ry: "19"
  }), React.createElement("text", {
    className: "gwmap__hint",
    x: "612",
    y: "164",
    textAnchor: "middle"
  }, "Mono Lake"), MAP_ROAD_LABELS.map(l => React.createElement("text", {
    key: l.t + l.x,
    className: "gwmap__roadnum",
    x: l.x,
    y: l.y,
    textAnchor: "middle"
  }, l.t)), MAP_HINTS.map(l => React.createElement("text", {
    key: l.t,
    className: "gwmap__hint",
    x: l.x,
    y: l.y,
    textAnchor: l.anchor
  }, l.t)), MAP_POIS.map(p => React.createElement("g", {
    key: p.name
  }, React.createElement("circle", {
    className: "gwmap__poi" + (p.big ? " gwmap__poi--big" : ""),
    cx: p.x,
    cy: p.y,
    r: p.big ? 4.5 : 3.5
  }), React.createElement("text", {
    className: "gwmap__poilbl" + (p.big ? " gwmap__poilbl--big" : ""),
    x: p.lx,
    y: p.ly,
    textAnchor: p.anchor
  }, p.name))), MAP_ENTRANCES.map(e => React.createElement("g", {
    key: e.name
  }, React.createElement("rect", {
    className: "gwmap__entr",
    x: e.x - 4,
    y: e.y - 4,
    width: "8",
    height: "8"
  }), React.createElement("text", {
    className: "gwmap__entrlbl",
    x: e.lx,
    y: e.ly,
    textAnchor: e.anchor
  }, e.name))), MAP_TOWN_POINTS.map(t => {
    var town = GATEWAY_TOWNS[t.key];
    return React.createElement("a", {
      key: t.key,
      href: town.href,
      className: "gwmap__town",
      "aria-label": town.name + ", jump to its section"
    }, React.createElement("title", null, "Jump to the " + town.name + " section"), React.createElement("circle", {
      className: "gwmap__townhit",
      cx: t.x,
      cy: t.y,
      r: "15"
    }), React.createElement("circle", {
      className: "gwmap__towndot",
      cx: t.x,
      cy: t.y,
      r: "5.5"
    }), React.createElement("text", {
      className: "gwmap__townlbl",
      x: t.lx,
      y: t.ly,
      textAnchor: t.anchor
    }, town.name));
  }), React.createElement("g", {
    className: "gwmap__compass"
  }, React.createElement("line", {
    x1: "28",
    y1: "66",
    x2: "28",
    y2: "46"
  }), React.createElement("path", {
    d: "M23 50 L28 38 L33 50 Z"
  })), React.createElement("g", {
    className: "gwmap__legend"
  }, React.createElement("circle", {
    className: "gwmap__towndot",
    cx: "22",
    cy: "514",
    r: "5"
  }), React.createElement("text", {
    x: "34",
    y: "518"
  }, "Gateway town, tap to jump"), React.createElement("rect", {
    className: "gwmap__entr",
    x: "18",
    y: "530",
    width: "8",
    height: "8"
  }), React.createElement("text", {
    x: "34",
    y: "538"
  }, "Park entrance"), React.createElement("line", {
    className: "gwmap__road gwmap__road--seasonal",
    x1: "16",
    y1: "554",
    x2: "30",
    y2: "554"
  }), React.createElement("text", {
    x: "34",
    y: "558"
  }, "Closed in winter")))), React.createElement("figcaption", null, "The five gateways, the entrances they serve, and the roads that decide everything. Distances are roughly to scale. Tap a town to jump to its section."));
}
var PICK_TRIP = [{
  key: "valley",
  label: "Yosemite Valley"
}, {
  key: "sequoias",
  label: "Sequoias and Wawona"
}, {
  key: "high",
  label: "The high country"
}, {
  key: "hetch",
  label: "Hetch Hetchy and the north"
}];
var PICK_WHEN = [{
  key: "summer",
  label: "June to October"
}, {
  key: "winter",
  label: "November to May"
}];
var PICK_PRIORITY = [{
  key: "close",
  label: "Shortest drive"
}, {
  key: "town",
  label: "A real town"
}, {
  key: "character",
  label: "Character"
}, {
  key: "chain",
  label: "Chain predictability"
}];
function pickTown(trip, when, priority) {
  if (trip === "high") {
    if (when === "winter") {
      return {
        key: "mariposa",
        why: "Tioga Road is closed from roughly November into late May, so there is no winter high-country base. If the trip moves to the Valley instead, Highway 140 is the reliable winter road and Mariposa is the best all-round base on it."
      };
    }
    return {
      key: "lee-vining",
      why: "Tuolumne Meadows is 30 minutes up Tioga Road and Mono Lake is next door. This is a high-country base, not a Valley base: the Valley is 90 minutes each way over a near-10,000-foot pass.",
      note: priority === "chain" ? "One expectation to manage: the motels here are small, independent, and booked early. There are no chains." : null
    };
  }
  if (trip === "sequoias") {
    return {
      key: "oakhurst",
      why: "The South Entrance is 20 to 25 minutes up Highway 41, the Mariposa Grove is immediately inside the gate, and Oakhurst has the deepest bench of rooms and services of any gateway.",
      note: when === "winter" ? "Highway 41 stays open in winter, and this side is the base for Badger Pass and sequoias in snow." : priority === "character" ? "Character is the one thing Oakhurst does not stock. Fish Camp, at the park line, trades services for setting." : null
    };
  }
  if (trip === "hetch") {
    return {
      key: "groveland",
      why: "Groveland is the only gateway that makes Hetch Hetchy convenient, and it is the natural base for the north end of the park on the Bay Area route.",
      note: when === "winter" ? "Carry chains: controls are routine on Highway 120 in winter, and Hetch Hetchy Road itself can close. Check before committing a day." : null
    };
  }
  if (priority === "close") {
    return {
      key: "el-portal",
      why: "The Valley is 25 to 35 minutes away and nothing else comes close." + (when === "winter" ? " Highway 140 is also the lowest and most reliable winter road." : " Roll out of bed at 5:30 and be at Tunnel View by 6:15."),
      note: "The trade: rooms price like in-park lodging and sell out early. If nothing is left, Mariposa is the fallback on the same road."
    };
  }
  if (priority === "character") {
    if (when === "winter") {
      return {
        key: "mariposa",
        why: "In winter the answer narrows to Highway 140, and Mariposa's gold-rush downtown carries the character brief while keeping the low, reliable road."
      };
    }
    return {
      key: "groveland",
      why: "A genuine historic main street, the Iron Door Saloon, and usually a lower bill than Mariposa. The price is a longer, higher drive: 65 to 80 minutes to the Valley."
    };
  }
  if (priority === "chain") {
    return {
      key: "mariposa",
      why: "Mariposa's highway strip has the chain hotels without Oakhurst's 75 to 90 minute Valley commute. Oakhurst has more of them, but three hours of driving a day is what booking there costs a Valley trip."
    };
  }
  return {
    key: "mariposa",
    why: "A real downtown, several price points, full supermarkets, and the year-round Highway 140 approach at 45 to 60 minutes. The default answer for a first Yosemite trip." + (when === "winter" ? " It is also the only gateway with year-round YARTS bus service into the park." : "")
  };
}
function PickerRow({
  label,
  options,
  value,
  onPick
}) {
  return React.createElement("div", {
    className: "town-picker__q"
  }, React.createElement("span", {
    className: "town-picker__qlabel"
  }, label), React.createElement("span", {
    className: "town-picker__chips",
    role: "group",
    "aria-label": label
  }, options.map(o => React.createElement("button", {
    key: o.key,
    type: "button",
    className: "town-picker__chip",
    "aria-pressed": value === o.key,
    onClick: () => onPick(value === o.key ? null : o.key)
  }, o.label))));
}
function TownPicker() {
  var [trip, setTrip] = React.useState(null);
  var [when, setWhen] = React.useState(null);
  var [priority, setPriority] = React.useState(null);
  var rec = trip && when && priority ? pickTown(trip, when, priority) : null;
  var town = rec ? GATEWAY_TOWNS[rec.key] : null;
  return React.createElement("aside", {
    className: "town-picker",
    "aria-label": "Gateway town decision aid"
  }, React.createElement("p", {
    className: "town-picker__head"
  }, "Which town fits your trip?"), React.createElement(PickerRow, {
    label: "The trip is mostly",
    options: PICK_TRIP,
    value: trip,
    onPick: setTrip
  }), React.createElement(PickerRow, {
    label: "The season",
    options: PICK_WHEN,
    value: when,
    onPick: setWhen
  }), React.createElement(PickerRow, {
    label: "What matters most",
    options: PICK_PRIORITY,
    value: priority,
    onPick: setPriority
  }), rec ? React.createElement("div", {
    className: "town-picker__result"
  }, React.createElement("p", {
    className: "town-picker__answer"
  }, "Base in ", React.createElement("strong", null, town.name), "."), React.createElement("p", {
    className: "town-picker__why"
  }, rec.note ? rec.why + " " + rec.note : rec.why), React.createElement("p", {
    className: "town-picker__links"
  }, React.createElement("a", {
    href: town.href
  }, "Read the ", town.name, " section ↓"), React.createElement(AvailabilityLink, {
    destination: town.dest,
    list: "article_picker",
    slug: "yosemite-gateway-towns-compared",
    name: town.name + " lodging search"
  }, "Check ", town.name, " rates →"))) : React.createElement("p", {
    className: "town-picker__hint"
  }, "Answer all three and the pick appears here. It follows the same reasoning as the article, it just gets there faster."));
}
window.ARTICLE_BODIES["yosemite-gateway-towns-compared"] = function YosemiteGatewayTownsComparedBody() {
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "dropcap"
  }, "The decision about which gateway town to base yourself in is more important than most planning guides admit. The five main gateway communities, ", React.createElement("strong", null, "El Portal, Mariposa, Oakhurst, Groveland, and Lee Vining"), ", are not interchangeable. They sit on different sides of the park, vary in distance from the Valley by an hour or more, have different lodging cultures, and serve different kinds of trips. Picking the wrong one costs you real time and friction every day of your visit. Picking the right one makes every day easier."), React.createElement("p", null, "I've stayed in all of them. I've watched first-time visitors make this decision well, and I've watched them make it badly. Here's what I'd tell you if you asked me which to pick."), React.createElement("h2", {
    id: "sec-0-the-geography-you-actually-need-to-know"
  }, "The geography you actually need to know"), React.createElement("p", null, "Yosemite has four entrance stations on the through-road system, one at each rough cardinal point, and each gateway town is associated with one of them. A fifth, the Hetch Hetchy entrance, is a dead end into one valley and serves no through route."), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "Arch Rock Entrance"), ", Highway 140 from the west: the most direct route to Yosemite Valley. ", React.createElement("strong", null, "El Portal"), " is at the gate, ", React.createElement("strong", null, "Mariposa"), " further down the road."), React.createElement("li", null, React.createElement("strong", null, "Big Oak Flat Entrance"), ", Highway 120 from the northwest: ", React.createElement("strong", null, "Groveland"), "."), React.createElement("li", null, React.createElement("strong", null, "South Entrance"), ", Highway 41 from the south: the route to Wawona and the Mariposa Grove. ", React.createElement("strong", null, "Oakhurst"), "."), React.createElement("li", null, React.createElement("strong", null, "Tioga Pass Entrance"), ", Highway 120 East from the east, open only in summer: ", React.createElement("strong", null, "Lee Vining"), ".")), React.createElement(GatewayMap, null), React.createElement("p", null, "The map is the argument: the four routes are not equal. Highway 140 is the lowest, most reliable, year-round road into the Valley. Highway 41 climbs and descends more and arrives via Wawona. Highway 120 from Groveland runs higher still, and Tioga Pass is shut for roughly half the year. The whole comparison, in one view:"), React.createElement("div", {
    className: "table-scroll"
  }, React.createElement("table", {
    className: "compare-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Town"), React.createElement("th", null, "Drive to the Valley"), React.createElement("th", null, "Highway"), React.createElement("th", null, "Elevation"), React.createElement("th", null, "Best for"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, "El Portal"), React.createElement("td", null, "25 to 35 min"), React.createElement("td", null, "140, year-round"), React.createElement("td", null, "about 1,900 ft"), React.createElement("td", null, "Sunrise starts, the shortest drive")), React.createElement("tr", null, React.createElement("td", null, "Mariposa"), React.createElement("td", null, "45 to 60 min"), React.createElement("td", null, "140, year-round"), React.createElement("td", null, "about 2,000 ft"), React.createElement("td", null, "Most first-timers, families, winter")), React.createElement("tr", null, React.createElement("td", null, "Groveland"), React.createElement("td", null, "65 to 80 min"), React.createElement("td", null, "120, chains common in winter"), React.createElement("td", null, "about 3,100 ft"), React.createElement("td", null, "Character, Hetch Hetchy, Bay Area route")), React.createElement("tr", null, React.createElement("td", null, "Oakhurst"), React.createElement("td", null, "75 to 90 min"), React.createElement("td", null, "41, year-round"), React.createElement("td", null, "about 2,300 ft"), React.createElement("td", null, "Wawona and the Mariposa Grove")), React.createElement("tr", null, React.createElement("td", null, "Lee Vining"), React.createElement("td", null, "90+ min, summer only"), React.createElement("td", null, "120 East over Tioga Pass"), React.createElement("td", null, "about 6,800 ft"), React.createElement("td", null, "The high country and Mono Lake"))))), React.createElement("p", null, "The elevation column is not trivia. It is the best single predictor of whether you will be putting chains on in February: El Portal and Mariposa sit low enough that winter storms usually arrive as rain, Groveland is a thousand feet higher and gets chain controls the Highway 140 towns do not, and Lee Vining's road into the park is shut half the year."), React.createElement("p", null, "One caveat on every drive time on this page: Yosemite Valley is about seven miles long, and a time quoted to the Valley means its west end, near Bridalveil Fall. Curry Village and the east-end trailheads are another fifteen or twenty minutes past that, plus parking. Budget for the end of the Valley you actually want. The legs the table does not cover (Oakhurst to the South Entrance, Groveland to Big Oak Flat, Lee Vining to Tuolumne Meadows) are collected on ", React.createElement("a", {
    href: "/distances"
  }, "the drive times page"), "."), React.createElement("p", null, "If you want the answer before the detail, it is one of these five:"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "El Portal"), " if the drive is the thing to shorten: first light in the Valley, or a winter trip on the lowest, most reliable road."), React.createElement("li", null, React.createElement("strong", null, "Mariposa"), " if you want a real town at the end of the day, more than one price point, and a year-round road. The default answer for a first trip."), React.createElement("li", null, React.createElement("strong", null, "Groveland"), " if you are coming from the Bay Area, want a smaller and cheaper town with more character than Oakhurst, or Hetch Hetchy is on the list."), React.createElement("li", null, React.createElement("strong", null, "Oakhurst"), " if the Mariposa Grove and Wawona are the point, you are driving up from Los Angeles or Fresno, or you want predictable chain lodging and a full-size supermarket."), React.createElement("li", null, React.createElement("strong", null, "Lee Vining"), " if Tioga Road is open and the high country is the trip. It is not a Valley base, and choosing it as one is the single most common mistake on this list.")), React.createElement(TownPicker, null), React.createElement("p", null, "Now the towns themselves."), React.createElement("h2", {
    id: "sec-1-el-portal"
  }, "El Portal"), React.createElement(TownFacts, {
    rows: [["Valley drive", "about 14 miles, 25 to 35 minutes"], ["Entrance", "Arch Rock, a few miles up the road"], ["Road", "Highway 140, open year-round"], ["Elevation", "about 1,900 feet, the lowest of the five"], ["The town", "a small park-adjacent settlement: riverside lodges, a market, a 24-hour gas station"]]
  }), React.createElement(Placeholder, {
    caption: "Highway 140 following the Merced River canyon toward the Arch Rock entrance, the road every El Portal morning starts on",
    image: "img/merced-canyon-road-cory-goehring.jpg",
    credit: "Photo: Cory Goehring",
    tag: "PLATE I",
    size: "lg",
    style: {
      aspectRatio: "16 / 10",
      margin: "32px 0"
    },
    motif: React.createElement(MotifMountains, null)
  }), React.createElement("p", null, "El Portal is the closest gateway to the Valley by a significant margin, and it exists because of Yosemite: a handful of lodges (the Yosemite View Lodge, the Cedar Lodge) along the Merced River, the gas station, a small market, and not much else. The lodging is priced like in-park lodging because the location is that good."), React.createElement("p", null, "Why people pick it:"), React.createElement("ul", null, React.createElement("li", null, "The shortest possible drive to anywhere in the Valley. Roll out of bed at 5:30 a.m. and be at Tunnel View by 6:15."), React.createElement("li", null, "The approach itself, up the Merced River canyon, is one of the most beautiful drives to any national park, and in spring the high water and wildflowers are their own attraction."), React.createElement("li", null, "Highway 140 is the lowest-elevation entry to the park and the most reliable in winter.")), React.createElement("p", null, "Why they regret it:"), React.createElement("ul", null, React.createElement("li", null, "Dining and shopping are minimal. You will drive to Mariposa for variety."), React.createElement("li", null, "Tiny inventory: it books up early and stays expensive all summer."), React.createElement("li", null, "The riverside lodges have river noise. A feature for some people, a bug for others.")), React.createElement("p", null, React.createElement("strong", null, "Services:"), " the gas station and market matter more than they look, because there is no gas station anywhere in Yosemite Valley; the in-park pumps are at Crane Flat and Wawona, both well off the Valley floor. Groceries here are convenience-store groceries, so buy the week's food in Mariposa on the way in."), React.createElement("p", null, React.createElement("strong", null, "Pick El Portal"), " if being inside the park as much as possible is the top priority: sunrise photography, peak-period crowd avoidance, a short Valley-focused trip, or any winter trip where road reliability matters. ", React.createElement("strong", null, "Skip it"), " if you want a choice of dinner, are booking late in summer, or are travelling with people who will be back at the room by mid-afternoon. There is very little to do in El Portal that is not the park."), townAvailability("El Portal", "El Portal, California"), React.createElement("h2", {
    id: "sec-2-mariposa"
  }, "Mariposa"), React.createElement(TownFacts, {
    rows: [["Valley drive", "about 45 miles, 45 minutes to an hour"], ["Entrance", "Arch Rock, via El Portal"], ["Road", "Highway 140, open year-round"], ["Elevation", "about 2,000 feet"], ["The town", "historic gold-rush county seat, the most full-service of the five"]]
  }), React.createElement("p", null, "Mariposa is the most complete of the western gateways: a real downtown with restaurants, bars, coffee, a couple of bookstores, the Mariposa Museum and History Center (genuinely worth a visit), the 1854 Mariposa County Courthouse (the oldest continuously operating courthouse west of the Rockies), and lodging from chain hotels on the highway to historic bed-and-breakfasts in town. It's also where a lot of ", React.createElement("a", {
    href: "/articles/working-in-yosemite"
  }, "people who work in the park"), " end up when they age out of in-park staff housing."), React.createElement("p", null, "Why people pick it:"), React.createElement("ul", null, React.createElement("li", null, "Real food, real coffee, multiple grocery stores, a real town."), React.createElement("li", null, "The widest range of price points of any gateway, budget motel to upscale country inn."), React.createElement("li", null, "Year-round access on the same beautiful Merced canyon route as El Portal, just longer.")), React.createElement("p", null, "Why they regret it:"), React.createElement("ul", null, React.createElement("li", null, "At least 90 minutes of round-trip driving per day, which means earlier wake-ups for sunrise and tighter evening returns."), React.createElement("li", null, "In summer traffic the drive can stretch well past the hour.")), React.createElement("p", null, React.createElement("strong", null, "Services:"), " the deepest of the five. Full-size supermarkets, a pharmacy, hardware, banks, and the last reliable place to fix a problem before you are an hour from anywhere. It is also the only gateway with year-round bus service into the park: YARTS runs the Highway 140 corridor from Merced and Mariposa all year, while the routes from the other towns run only in summer. If there is any chance you would rather not drive the canyon in the dark or in snow, no other town on this list can match that in January. Halfway to El Portal, the hamlet of Midpines splits the difference with a few camps and lodges (the Yosemite Bug among them) and no town attached."), React.createElement("p", null, React.createElement("strong", null, "Pick Mariposa"), " if you are most first-time visitors: families, anyone who values a real town in the evening, anyone on a budget, and anyone visiting in shoulder season or winter when El Portal and in-park rooms are gone."), townAvailability("Mariposa", "Mariposa, California"), React.createElement("h2", {
    id: "sec-3-oakhurst"
  }, "Oakhurst"), React.createElement(TownFacts, {
    rows: [["Valley drive", "about 50 miles, 75 to 90 minutes"], ["South Entrance", "about 14 miles, 20 to 25 minutes; the Mariposa Grove is immediately inside the gate, Wawona six miles on"], ["Road", "Highway 41, open year-round"], ["Elevation", "about 2,300 feet"], ["The town", "a regional commercial hub: chain hotels, chain dining, big-box services"]]
  }), React.createElement(Placeholder, {
    caption: "Giant sequoias in the Mariposa Grove, the reason to base on the Highway 41 side",
    image: "img/mariposa-grove.jpg",
    credit: "Photo: Dietmar Rabich / Wikimedia Commons (CC BY-SA 4.0)",
    tag: "PLATE II",
    size: "lg",
    style: {
      aspectRatio: "16 / 10",
      margin: "32px 0"
    },
    motif: React.createElement(MotifMountains, null)
  }), React.createElement("p", null, "Oakhurst is the largest gateway by population and amenities, with more chain lodging and chain dining than the other four combined. It feels like a regular Central California town that happens to be near a national park rather than a town that exists because of one."), React.createElement("p", null, "Why people pick it:"), React.createElement("ul", null, React.createElement("li", null, "Fast access to Wawona and the Mariposa Grove of giant sequoias."), React.createElement("li", null, "Predictable chain rooms at predictable prices, bookable late."), React.createElement("li", null, "The widest range of standard amenities of any gateway: chain supermarkets, national pharmacies, urgent care. The easiest of the five towns to fill a prescription or replace forgotten gear in.")), React.createElement("p", null, "Why they regret it:"), React.createElement("ul", null, React.createElement("li", null, "The longest Valley drive of any gateway. 75 to 90 minutes each way means three hours of driving on a Valley-focused day, and people underestimate it until the third morning."), React.createElement("li", null, "Less character than Mariposa or Groveland, if the gateway-town atmosphere is part of your trip."), React.createElement("li", null, "Highway 41 climbs over a ridge and descends into Wawona before reaching the Valley: longer and more winding than 140.")), React.createElement("p", null, React.createElement("strong", null, "The closer option on this corridor:"), " Fish Camp, twelve miles up the road at the park line, puts you four minutes from the South Entrance. It is the Tenaya resort complex and a few small inns at resort prices, trading Oakhurst's services for the setting."), React.createElement("p", null, React.createElement("strong", null, "Pick Oakhurst"), " if the itinerary centers on the Mariposa Grove and Wawona, if you want chain predictability, or if you are driving up from Los Angeles or Fresno, since it sits on the natural path. ", React.createElement("strong", null, "Skip it"), " if the trip is really a Yosemite Valley trip. Three hours a day in the car is the price."), townAvailability("Oakhurst", "Oakhurst, California"), React.createElement("p", null, "One current note for this side of the park: the Wawona Hotel, the historic in-park option just inside the South Entrance, has been closed since December 2024, and the Park Service has said it stays closed for this visitor season to complete electrical repairs and upgrades. No reopening date has been announced. That removes the in-park alternative on the Highway 41 corridor and puts more pressure on Oakhurst and Fish Camp rooms in summer. Book earlier than you think you need to."), React.createElement("h2", {
    id: "sec-4-groveland"
  }, "Groveland"), React.createElement(TownFacts, {
    rows: [["Valley drive", "about 41 miles, 65 to 80 minutes"], ["Entrance", "Big Oak Flat, about 24 miles, 30 to 40 winding minutes"], ["Road", "Highway 120, chain controls common in winter"], ["Elevation", "about 3,100 feet, the highest of the western gateways"], ["The town", "a small historic gold-rush main street with strong personality"]]
  }), React.createElement("p", null, "Groveland is the underrated gateway: a historic main street with the ", React.createElement("strong", null, "Groveland Hotel"), ", the ", React.createElement("strong", null, "Iron Door Saloon"), " (one of the oldest continuously operating saloons in California), and the kind of small-town character Mariposa has, at a smaller scale and with a different flavor."), React.createElement("p", null, "Why people pick it:"), React.createElement("ul", null, React.createElement("li", null, "A genuinely charming town that's worth time on its own. The Iron Door is a destination."), React.createElement("li", null, "Less crowded and often cheaper than Mariposa or El Portal, with easier last-minute rooms in shoulder seasons."), React.createElement("li", null, "The best position for Hetch Hetchy, the Tuolumne side of the park, and Tuolumne Meadows when Tioga Road is open.")), React.createElement("p", null, "Why they regret it:"), React.createElement("ul", null, React.createElement("li", null, "The drive to the Valley starts a thousand feet higher than the 140 towns, and chain controls are common in winter."), React.createElement("li", null, "The route passes through the 2013 Rim Fire burn scar, recovering but still visually different from the Highway 140 approach."), React.createElement("li", null, "Fewer total lodging options than Mariposa, and a town that closes early.")), React.createElement("p", null, React.createElement("strong", null, "Services:"), " a market rather than a supermarket, gas, and that is close to the list. Groveland is the last town of any size on Highway 120 before the entrance; the nearest in-park pumps are at Crane Flat. Fill the tank and the cooler here, or in Oakdale or Sonora on the way in from the Bay Area, before you start climbing."), React.createElement("p", null, React.createElement("strong", null, "If Hetch Hetchy is your reason:"), " the road in is open daylight hours only, so it is not a sunset destination, and vehicles over 25 feet are not allowed on it. From November through March it can close entirely or require chains, which is precisely the season a low-elevation reservoir hike sounds most appealing. Check before you commit a day."), React.createElement("p", null, React.createElement("strong", null, "Pick Groveland"), " for gateway-town character, for Hetch Hetchy and the northern park, or as the natural base on the route from the Bay Area. ", React.createElement("strong", null, "Skip it"), " for a deep-winter trip without snow-driving experience or chains in the trunk, or if you need real services at nine in the evening."), townAvailability("Groveland", "Groveland, California"), React.createElement("h2", {
    id: "sec-5-lee-vining"
  }, "Lee Vining"), React.createElement(TownFacts, {
    rows: [["Valley drive", "about 75 miles over Tioga Pass, 90 minutes minimum, summer only"], ["Tuolumne Meadows", "about 20 miles, 30 minutes"], ["Mono Lake", "5 minutes to the visitor center, 15 to South Tufa"], ["Road", "Highway 120 East over Tioga Pass, seasonal; US 395 year-round"], ["Elevation", "about 6,800 feet, and the pass above town just under 10,000"], ["The town", "a tiny eastern Sierra outpost between Mono Lake and the pass"]]
  }), React.createElement(Placeholder, {
    caption: "Tenaya Lake, on the Tioga Road between Lee Vining and the Valley",
    image: "img/tenaya-lake.jpg",
    credit: "Photo: Michael Hogarth / Wikimedia Commons (public domain)",
    tag: "PLATE III",
    size: "lg",
    style: {
      aspectRatio: "16 / 10",
      margin: "32px 0"
    },
    motif: React.createElement(MotifMountains, null)
  }), React.createElement("p", null, "Lee Vining is the only east-side gateway, and it is not a substitute for the western towns. It is a different kind of trip. Tuolumne Meadows is 30 minutes away when Tioga Road is open (typically late May or June through October or early November; the Park Service opened it on May 15 in 2026, the earliest in sixteen years, and it is open now), while the Valley is over an hour and a half each way. Lodging is a few small motels (the ", React.createElement("strong", null, "Yosemite Gateway Motel"), ", the ", React.createElement("strong", null, "El Mono Motel"), ", an inn or two). Dining is thin but includes the famously good Whoa Nellie Deli at the Mobil station, which is genuinely some of the best food in the eastern Sierra."), React.createElement("p", null, "Why people pick it:"), React.createElement("ul", null, React.createElement("li", null, "Direct access to Tuolumne Meadows and the high country in season, with far fewer crowds."), React.createElement("li", null, "Mono Lake next door, and an entirely different landscape: sagebrush, alkali, the Mono Basin, unlike anything west of the park."), React.createElement("li", null, "A natural stop on a longer eastern Sierra trip (Mammoth Lakes, Bishop, Death Valley).")), React.createElement("p", null, "Why they regret it:"), React.createElement("ul", null, React.createElement("li", null, "When Tioga Pass is closed there is no crossing at all: the drive around the south end of the Sierra turns 90 minutes into most of a day. The Park Service publishes the detour, and it is the first thing to read if your dates are anywhere near the shoulders."), React.createElement("li", null, "Limited rooms and food, so you book early and pay a summer premium."), React.createElement("li", null, "The Valley run crosses a near-10,000-foot pass, punishing in bad weather.")), React.createElement("p", null, React.createElement("strong", null, "Services:"), " thin, and seasonal on top of thin. The Tioga Gas Mart, which is also the Whoa Nellie Deli, runs roughly late April to late October, so the town's best-known meal is not available on a winter Mono Lake trip. Groceries are a small market; the nearest full supermarket is in Mammoth Lakes, about 30 miles south. Fuel on 395 is reliable but expensive, so fill up in Bishop or Bridgeport if you pass through either."), React.createElement("p", null, React.createElement("strong", null, "Pick Lee Vining"), " if the high country is the trip (Tuolumne, Cathedral Lakes, Mount Dana, the Tioga Road itself), or if you are combining Yosemite with Mono Lake and the eastern Sierra. ", React.createElement("strong", null, "Skip it"), " if your itinerary names Yosemite Falls, Half Dome, or Tunnel View. Those are Valley sights, three hours round trip from here over a pass that is not open when you are likely to want it."), townAvailability("Lee Vining", "Lee Vining, California"), React.createElement("h2", {
    id: "sec-6-the-decision-matrix-in-plain-english"
  }, "The decision matrix in plain English"), React.createElement("p", null, "Here's how I'd actually advise:"), React.createElement("p", null, React.createElement("strong", null, "You want sunrise in the Valley every day."), " El Portal."), React.createElement("p", null, React.createElement("strong", null, "You want a balanced trip with comfort and value."), " Mariposa."), React.createElement("p", null, React.createElement("strong", null, "Your itinerary is mostly Wawona and the Mariposa Grove."), " Oakhurst."), React.createElement("p", null, React.createElement("strong", null, "You want gateway-town character without the Mariposa price."), " Groveland."), React.createElement("p", null, React.createElement("strong", null, "You're focused on the high country, or combining with Mono Lake."), " Lee Vining."), React.createElement("p", null, React.createElement("strong", null, "You're visiting in winter."), " El Portal or Mariposa. The other gateways have road-access challenges."), React.createElement("p", null, React.createElement("strong", null, "You have one day and you want the Valley."), " El Portal, and accept the price. The drive you save is a meaningful fraction of the only day you have."), React.createElement("p", null, React.createElement("strong", null, "You would rather not drive at all."), " Mariposa or Merced, and take YARTS. It is the only corridor with year-round service."), React.createElement("p", null, React.createElement("strong", null, "You're travelling with a large RV or a trailer."), " Mariposa or Oakhurst, on the wider approaches. Rule out Hetch Hetchy Road, which bans anything over 25 feet."), React.createElement("p", null, React.createElement("strong", null, "You're flying into San Francisco."), " Groveland or Mariposa is on the way."), React.createElement("p", null, React.createElement("strong", null, "You're flying into Fresno."), " Oakhurst or Mariposa is on the way."), React.createElement("p", null, React.createElement("strong", null, "You're flying into Reno or driving from Las Vegas."), " Lee Vining is the natural east-side base."), React.createElement("h2", {
    id: "sec-7-what-each-town-looks-like-in-winter"
  }, "What each town looks like in winter"), React.createElement("p", null, "Most gateway comparisons are written for July and quietly stop being true in December. The honest winter version:"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "El Portal and Mariposa."), " Highway 140 stays open, it is the lowest-elevation approach, and storms there more often fall as rain than snow. Year-round YARTS service runs this corridor, so it is the one base where not driving is a real option. This is the winter answer."), React.createElement("li", null, React.createElement("strong", null, "Groveland."), " Highway 120 stays open to the park, but you are starting a thousand feet higher and chain controls are routine. Hetch Hetchy Road may be closed or chain-controlled from November through March. Workable, with chains and a plan."), React.createElement("li", null, React.createElement("strong", null, "Oakhurst."), " Highway 41 stays open. The town is fine in winter; the two-hour reality of a Valley day is the constraint, not the weather. If your winter trip is Badger Pass or the sequoias in snow, this side works well."), React.createElement("li", null, React.createElement("strong", null, "Lee Vining."), " Tioga Road is closed and there is no way into the park from here. The town largely shuts down, the Whoa Nellie Deli with it. Come for a frozen Mono Lake if you want, but do not come for Yosemite.")), React.createElement("h2", {
    id: "sec-8-practical-notes"
  }, "Practical notes"), React.createElement("p", null, "A few things that aren't obvious until you've done the trip."), React.createElement("p", null, React.createElement("strong", null, "Distance affects more than driving time."), " The further your gateway, the earlier you leave to beat the crowds: a 60-minute drive at 5:30 a.m. is easier than a 90-minute drive at 4:30. The Park Service is not requiring a season-wide vehicle reservation for 2026 and is managing peak days with traffic monitoring and active parking control in the Valley instead, which is good news for spontaneity and bad news for anyone arriving at ten. Every mile between your room and the entrance station is a mile you make up before the lots fill."), React.createElement("p", null, React.createElement("strong", null, "Gas."), " There is no gas station in Yosemite Valley. The in-park pumps are at Crane Flat, year-round with pay-at-the-pump around the clock, and at Wawona, where the store keeps daytime hours but the pumps also take a card overnight. Outside the park, the El Portal station is the last stop on Highway 140. Arriving in the Valley on a quarter tank is a bad plan in any season and a genuinely bad one in winter, when engines idle in stopped traffic."), React.createElement("p", null, React.createElement("strong", null, "Groceries."), " Mariposa and Oakhurst have full-size supermarkets. Groveland has a market. El Portal and Lee Vining have convenience-scale markets and nothing more. Whichever town you pick, do the real shop in Mariposa or Oakhurst on the way in, because in-park food is limited, expensive, and keeps shorter hours than you expect. See ", React.createElement("a", {
    href: "/articles/pack-your-car-for-yosemite"
  }, "how to pack your car for a Yosemite trip"), "."), React.createElement("p", null, React.createElement("strong", null, "Cell service."), " Patchy in all five gateways and unreliable to nonexistent through most of the park, including long stretches of the approach roads. Download the offline map for the whole region before you leave the gateway town, screenshot your reservation details, and agree on a meeting point with anyone you might get separated from. Do not rely on real-time navigation past the entrance station."), React.createElement("p", null, React.createElement("strong", null, "You can arrive without a car, from one town."), " YARTS runs the Highway 140 corridor from Merced and Mariposa all year. The routes from Sonora and Groveland on 120, from Oakhurst on 41, and from Mammoth Lakes and Lee Vining on 395 are summer-only. A car-free trip narrows the gateway choice to one corridor for most of the year."), React.createElement("p", null, React.createElement("strong", null, "Reservations book out fast."), " In summer and on holiday weekends, gateway lodging fills six to twelve months in advance. Plan early or be willing to flex on town."), React.createElement("p", null, React.createElement("strong", null, "Check current status the week you travel."), " Road, chain-control, and closure status changes faster than any lodging comparison. The ", React.createElement("a", {
    href: "/now"
  }, "Park Bulletin"), " condenses the current edition of park status, roads, hours, and trail conditions onto one page."), React.createElement("h2", {
    id: "sec-9-the-takeaway"
  }, "The takeaway"), React.createElement("p", null, "The right gateway town depends on your trip, not on which town has the best reviews. Mariposa is the safest first-timer's choice. El Portal is the strongest if you can get a room. Groveland is the underrated pick for character without the crowd. Oakhurst is for the southern-entrance trip. Lee Vining is the east-side experience that most western visitors never see."), React.createElement("p", null, "Pick based on your trip's center of gravity. If your trip is mostly Yosemite Valley, base in the west. If it's mostly the high country, consider the east. If it's the giant sequoias, go south. That's the decision. Make it once, well, and the rest of your trip gets easier."), React.createElement("p", null, "If you are still working out how to approach the park, start with the ", React.createElement("a", {
    href: "/articles/first-time-yosemite-overwhelm"
  }, "first-timer's guide"), ", read ", React.createElement("a", {
    href: "/articles/yosemite-without-reservations-2026"
  }, "what changed for 2026"), " before you book, and see ", React.createElement("a", {
    href: "/articles/yosemite-in-one-or-two-days"
  }, "how to spend one or two days"), " once your base is set."), React.createElement(LodgingCta, {
    destination: "Mariposa, California",
    heading: "Made the call?",
    note: "Mariposa is the safest first-timer's pick, so it is the default here, but the town-by-town links above go straight to whichever one you picked. Whatever the town, the inventory is what it is on your dates and no comparison table can tell you that part.",
    list: "article_cta",
    slug: "yosemite-gateway-towns-compared",
    cta: "Search Mariposa lodging →"
  }), React.createElement("p", null, "The in-park options, the five towns above, and Fish Camp all sit on one page at ", React.createElement("a", {
    href: "/stay"
  }, "where to stay"), ", if you would rather scan than read."), React.createElement(AffiliateNote, null), React.createElement("h3", null, "Sources"), React.createElement("ul", {
    style: {
      fontSize: 14
    }
  }, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tiogaclosed.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Driving Directions when the Tioga Road is Closed, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tiogaopen.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tioga and Glacier Point Roads Opening & Closing Dates, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hours.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Operating Hours & Seasons, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/news/yosemite-national-park-will-not-require-vehicle-reservations-in-2026.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite National Park will not require vehicle reservations in 2026, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/news/wawona-hotel-to-remain-closed-for-upcoming-visitor-season.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Wawona Hotel to Remain Closed for Upcoming Visitor Season, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/places/000/crane-flat-gas-station.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Crane Flat Gas Station, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/places/000/wawona-gas-station.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Wawona Gas Station, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hh.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Hetch Hetchy, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite Area Regional Transportation System (YARTS)")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.visittuolumne.com/big-oak-flat-entrance-yosemite-national-park",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Big Oak Flat Entrance, Visit Tuolumne County")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yosemitethisyear.com/maps-directions",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Maps and directions, Visit Yosemite Madera County")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yosemite.com/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Visit Mariposa County (regional tourism)"))));
};
