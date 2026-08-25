var TRAVEL_YOSEMITE = "https://www.travelyosemite.com/lodging/";
var IN_PARK = [{
  id: "ahwahnee",
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
  name: "Yosemite Valley Lodge",
  kind: "Hotel · Yosemite Valley · year-round",
  price: "Mid-range, and the best value-to-location ratio in the park",
  photo: "img/lower-yosemite-fall.jpg",
  caption: "Lower Yosemite Fall, directly across the road from the Lodge.",
  body: "Low-slung motel-style buildings, clean and functional rooms, a food court, a pool in summer. Nobody has described the architecture as memorable. What it has instead is a position across the road from Lower Yosemite Fall, on the shuttle loop, in the most convenient part of the Valley. In spring you can hear the waterfall from the grounds at night.",
  who: "Most first-time visitors with a hotel budget. This is the correct answer, full stop, and it books out accordingly."
}, {
  id: "curry-village",
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
  name: "Housekeeping Camp",
  kind: "Open-air units · Yosemite Valley · summer season",
  price: "Camping economics with a real bed",
  body: "The sleeper pick, and the one almost nobody outside of returning families has heard of. Three-walled concrete structures on the bank of the Merced River: a canvas roof, a curtain across the fourth wall, bunks and a double bed inside, and outside a covered patio with a table, a fire ring, and a bear box. You bring or rent bedding. Bathhouses are communal.",
  who: "A family of four who would otherwise be choosing between a motel outside the park and a campsite they failed to win.",
  tip: "You can cook your own meals over a fire, which no other lodging option in the Valley allows, and the river beach is steps away for the hot afternoons."
}, {
  id: "white-wolf",
  name: "White Wolf Lodge",
  kind: "Tent cabins · Tioga Road, 8,000 ft · summer only",
  price: "Modest, and hard to book for reasons of scarcity rather than price",
  body: "Canvas tent cabins with wood stoves, shared facilities, and a dining room that serves family-style meals, off Tioga Road at 8,000 feet. Small, short-season, and beloved by the people who know it.",
  who: "Hikers and returning visitors basing in the high country. This is not a base for a Valley trip; the Valley is well over an hour away."
}, {
  id: "tuolumne-lodge",
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
  name: "Mariposa",
  dest: "Mariposa, California",
  drive: "45 minutes to an hour to the Valley",
  road: "Highway 140, year-round",
  body: "The most full-service of the western gateways: a real downtown with restaurants, coffee, bookstores, the county museum, the 1854 courthouse, and lodging from highway chains to historic bed-and-breakfasts.",
  who: "The largest share of first-time visitors, families, anyone on a budget, and anyone visiting in shoulder season or winter when closer inventory disappears.",
  against: "Ninety minutes of round-trip driving a day that you would not be doing closer in, and earlier alarms for sunrise."
}, {
  id: "groveland",
  name: "Groveland",
  dest: "Groveland, California",
  drive: "65 to 80 minutes to the Valley",
  road: "Highway 120, chains common in winter",
  body: "The underrated one. A historic main street, the Groveland Hotel, the Iron Door Saloon (one of the oldest continuously operating saloons in California), and small-town character at a smaller scale than Mariposa.",
  who: "Hetch Hetchy, the Tuolumne side of the park, and Bay Area arrivals who do not want to drive all the way down to Mariposa. Easier last-minute bookings in shoulder season.",
  against: "Higher-elevation approach with winter chain controls, and the drive passes through the 2013 Rim Fire burn scar."
}, {
  id: "oakhurst",
  name: "Oakhurst",
  dest: "Oakhurst, California",
  drive: "75 to 90 minutes to the Valley, 20 minutes to the Mariposa Grove",
  road: "Highway 41, year-round",
  body: "The largest gateway by population and amenities, with more chain lodging and chain dining than the other gateways combined. It feels like a Central California town that happens to be near a national park rather than one that exists because of it.",
  who: "Trips centered on Wawona and the giant sequoias, and anyone driving up from Los Angeles or the southern Central Valley.",
  against: "The longest drive to the Valley of any gateway. Three hours of driving on a Valley day is significant. With the Wawona Hotel closed, summer rooms here are under more pressure than usual."
}, {
  id: "fish-camp",
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
  }, item.warn), !item.closed && React.createElement("a", {
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
  }, React.createElement("h3", {
    className: "stay-card__name"
  }, item.name), React.createElement("dl", {
    className: "stay-card__facts"
  }, React.createElement("div", null, React.createElement("dt", null, "Drive"), React.createElement("dd", null, item.drive)), React.createElement("div", null, React.createElement("dt", null, "Road"), React.createElement("dd", null, item.road))), React.createElement("p", {
    className: "stay-card__text"
  }, item.body), React.createElement("p", {
    className: "stay-card__who"
  }, React.createElement("strong", null, "Who it fits:"), " ", item.who), React.createElement("p", {
    className: "stay-card__against"
  }, React.createElement("strong", null, "The cost:"), " ", item.against), React.createElement(AvailabilityLink, {
    destination: item.dest,
    list: "stay_gateway",
    slug: item.id,
    name: item.name + " lodging search",
    className: "stay-card__avail"
  }, "See what ", item.name, " has on your dates →")));
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
  }, "Every bed in and around the park, sorted by what it actually is and who it actually fits. Staying inside the park changes a trip more than any other single decision, so that section comes first. If the park's inventory is gone, which for summer dates it usually is, the gateway towns below are the real decision, and they are not interchangeable."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("p", null, "The people sleeping in the Valley are standing under Yosemite Falls at seven in the morning with the mist still hanging and nobody around. The people sleeping in a gateway town are, at that moment, sitting in the entrance line. Both groups paid to visit Yosemite. Only one of them is in it when the park is at its best, which is the first two hours and the last two hours of the day."), React.createElement("p", null, "One piece of mechanics explains everything below it: every hotel, lodge, and tent cabin inside the boundary is run by a single park concessioner and books through one website, travelyosemite.com. There is no Marriott inside the park, no Airbnb, no boutique alternative. One operator, one inventory, one booking window. That is why the in-park cards below send you to the concessioner and the gateway cards send you to a live availability search: outside the boundary there are hundreds of properties and a real market, and inside it there is one."))), React.createElement("section", {
    className: "wrap",
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
    className: "wrap",
    style: {
      paddingTop: 72
    },
    id: "gateways"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "The gateway towns"), React.createElement("div", {
    className: "mono",
    style: {
      color: "var(--ink-3)"
    }
  }, GATEWAYS.length, " bases, four entrances")), React.createElement("p", {
    className: "wrap--narrow",
    style: {
      margin: "0 auto 28px",
      color: "var(--ink-2)"
    }
  }, "The four entrance stations sit at the cardinal points of the park and each has its town. The routes are not equal in distance or in character, and picking the wrong one costs you time and friction every day of the trip. The full comparison, with the case for and against each, is in", " ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "the gateway towns article"), "."), React.createElement("div", {
    className: "stay-grid"
  }, GATEWAYS.map(t => React.createElement(GatewayCard, {
    key: t.id,
    item: t
  }))), React.createElement(ExpediaBanner, {
    list: "stay_banner",
    slug: "stay"
  })), React.createElement("section", {
    className: "wrap wrap--narrow",
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
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 72
    },
    id: "booking"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "How the booking actually works")), React.createElement("section", {
    className: "prose"
  }, React.createElement("p", null, "In-park reservations open ", React.createElement("strong", null, "366 days in advance"), ", one year and a day ahead, on a rolling basis. For peak summer dates at the Valley properties, availability at the moment of release is measured in minutes. If your dates are fixed and in July, you set a reminder for the morning your window opens and you book at that moment, or you likely do not book at all."), React.createElement("p", null, "Missing the release is not the end, and this is the part most people never learn: ", React.createElement("strong", null, "rooms come back"), ". Cancellation policies mean people drop reservations continuously, with a distinct wave in the final weeks before any date as plans collapse. The strategy is unglamorous and it works: check the site daily, at varied times, in the four to six weeks before your trip. I have watched people assemble three-night Valley stays in June out of one-night cancellations."), React.createElement("p", null, "Gateway lodging fills six to twelve months ahead for summer and holiday weekends, but it behaves like a normal hotel market the rest of the year: rates move with the season and the day of the week, and the same room is a different price in October than in July."), React.createElement("p", null, "The other lever is the calendar.", " ", React.createElement("strong", null, "Winter is dramatically easier and cheaper."), " The seasonal operations close, but the Ahwahnee, the Lodge, and a reduced Curry Village run all year, rates drop, and midweek availability in January is a different universe from July."))), React.createElement("section", {
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
    href: "/itineraries",
    onClick: e => goRoute(e, "itineraries")
  }, "Itineraries"), React.createElement("span", null, "One, two, and three-day plans to hang the nights on."))), React.createElement("p", {
    className: "article-aff-note",
    style: {
      marginTop: 32
    }
  }, "The availability links on this page are affiliate links. If you book through one, The Talus Field may earn a small commission at no extra cost to you. Which property is recommended, and in what order, does not change for it: the Ahwahnee and the Wawona Hotel are here on their merits and the closed one carries no link at all.", " ", React.createElement("a", {
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
