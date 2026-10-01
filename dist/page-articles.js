var {
  useState
} = React;
function readSectionFromUrl() {
  var raw = (new URLSearchParams(window.location.search).get("section") || "").trim();
  return window.CATEGORIES.some(c => c.slug === raw) ? raw : "all";
}
function writeSectionToUrl(slug) {
  var params = new URLSearchParams(window.location.search);
  if (slug && slug !== "all") params.set("section", slug);else params.delete("section");
  var qs = params.toString();
  window.history.replaceState(window.history.state, "", window.location.pathname + (qs ? "?" + qs : ""));
}
function ArticlesIndex({
  go,
  initialCat
}) {
  var [active, setActive] = useState(() => initialCat || readSectionFromUrl());
  var filters = window.useIntentFilters();
  var pickSection = slug => {
    setActive(slug);
    writeSectionToUrl(slug);
  };
  var inSection = active === "all" ? window.ARTICLES : window.byCategory(active);
  var list = window.filterArticlesByIntent(inSection, filters.value);
  return React.createElement("div", {
    className: "page hp-index"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Articles"
    }],
    eyebrow: "ARTICLES",
    title: "Entries.",
    intro: "Every essay and trail report from The Talus Field, in reverse chronological order. Yosemite planning notes, trail conditions, wildlife and natural history, and seasonal guides. Filter by section or by what you actually need, or read the whole thing."
  }), React.createElement("section", {
    className: "hp-wrap hp-index__filters"
  }, React.createElement("div", {
    className: "hp-index__sections"
  }, React.createElement("a", {
    href: "/articles",
    className: `chip ${active === "all" ? "is-active" : ""}`,
    "aria-current": active === "all" ? "true" : undefined,
    onClick: e => {
      e.preventDefault();
      pickSection("all");
    }
  }, "All (", window.ARTICLES.length, ")"), window.CATEGORIES.map(c => {
    var n = window.byCategory(c.slug).length;
    return React.createElement("a", {
      key: c.slug,
      href: `/section/${c.slug}`,
      className: `chip ${active === c.slug ? "is-active" : ""}`,
      "aria-current": active === c.slug ? "true" : undefined,
      onClick: e => {
        e.preventDefault();
        pickSection(c.slug);
      }
    }, c.label, " (", n, ")");
  })), React.createElement(window.IntentFilters, {
    articles: inSection,
    value: filters.value,
    onToggle: filters.toggle,
    onClear: filters.clear,
    onClearMonth: filters.clearMonth,
    count: filters.count,
    resultCount: list.length,
    note: active === "all" ? "" : `Within ${window.findCategory(active).label}.`
  })), React.createElement("section", {
    className: "hp-wrap hp-section hp-index__list"
  }, list.length > 0 ? React.createElement("div", {
    className: "hp-journal-grid"
  }, list.map(a => React.createElement(HpArticleCard, {
    key: a.slug,
    article: a,
    go: go,
    location: "articles_list"
  }))) : React.createElement("p", {
    className: "hp-sub hp-index__empty"
  }, "Nothing here carries all of those at once. Drop a filter, or", " ", React.createElement("button", {
    type: "button",
    className: "hp-link",
    onClick: filters.clear
  }, "clear them all"), ".")));
}
var PS_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var psReleaseMonth = i => (i + 7) % 12;
var PS_PACKS = {
  car: {
    label: "Car camping",
    side: {
      eyebrow: "THE CAR IS BASE CAMP",
      title: "Pack the car, not just the tent",
      text: "A cooler kept shut and shaded holds ice three to four days in summer; one opened every half hour lasts about eight hours. Bring a rigid water jug, four to seven gallons, square with a spigot so it doesn't tip.",
      cta: "How to pack the car",
      href: "/articles/pack-your-car-for-yosemite"
    },
    groups: [{
      title: "Shelter and sleep",
      items: [["Tent sized for the group plus one"], ["Footprint, extra stakes, a mallet"], ["Sleeping bag, one per person", "20 degrees is never wrong here"], ["Closed-cell foam pad under the air pad", "The cold comes from below"]]
    }, {
      title: "Kitchen",
      items: [["Double-burner propane stove"], ["A spare 1 lb propane canister"], ["Cast iron skillet and a lidded pot"], ["A cooler that fits the bear box", "Older boxes: about 18 inches tall"]]
    }, {
      title: "Camp",
      items: [["Headlamp and a spare battery"], ["Earplugs", "Quiet hours are 10 p.m. to 6 a.m."], ["Baby wipes and a gallon jug", "No showers in any campground"], ["Warm hat to sleep in"]]
    }, {
      title: "The car itself",
      items: [["Spare tire, practiced at home"], ["Chains, November through March", "Required when chain control is up"], ["A full tank on Tioga Road", "No gas between Lee Vining and Crane Flat"], ["Offline maps and a screenshot of the reservation"]]
    }]
  },
  backpack: {
    label: "Backpacking",
    side: {
      eyebrow: "TWO THINGS ARE REQUIRED",
      title: "The permit and the canister",
      text: "An approved bear canister carries everything with a scent, toothpaste included, and you can rent one at a wilderness center. The permit itself is collected in person on your start day.",
      cta: "The overnight checklist",
      href: "/checklist"
    },
    groups: [{
      title: "Required",
      items: [["Bear canister", "Rent at a wilderness center"], ["Wilderness permit", "Collected in person, 8 to 11 a.m."]]
    }, {
      title: "Carry and sleep",
      items: [["55 to 65L pack"], ["Three-season tent and footprint"], ["20°F sleeping bag"], ["Inflatable pad, R-value 4 or higher"]]
    }, {
      title: "Kitchen and water",
      items: [["Stove plus a 4 oz canister"], ["Lightweight cookpot and a long spork"], ["Squeeze water filter"], ["Odor-proof food bags"]]
    }, {
      title: "Clothing and navigation",
      items: [["Insulated puffy and warm sleep layers"], ["Warm hat, light gloves, dry socks"], ["Paper map and a baseplate compass"], ["Satellite messenger", "No signal on any trail"]]
    }]
  },
  day: {
    label: "Day hike",
    side: {
      eyebrow: "BEFORE YOU LEAVE THE CAR",
      title: "Twice the snacks you think",
      text: "Most of the park has no signal, and the Valley's food stops thin out fast once you leave the floor. Carry the water, the map and a warm layer even when the trailhead is hot.",
      cta: "The day-pack checklist",
      href: "/checklist"
    },
    groups: [{
      title: "Carry",
      items: [["20 to 25L pack with a hip belt"], ["2L reservoir plus a 1L bottle"], ["Trail snacks, twice what you think"]]
    }, {
      title: "Navigation",
      items: [["Paper map of the park"], ["Downloaded offline maps"], ["Power bank, 10,000 mAh"]]
    }, {
      title: "Weather",
      items: [["Packable rain shell with taped seams"], ["Packable insulated jacket"], ["Wide-brim hat and SPF 50"]]
    }, {
      title: "Just in case",
      items: [["Headlamp plus spare battery"], ["Small first aid kit and moleskin"], ["Emergency bivy or space blanket"]]
    }]
  }
};
var PS_TOPICS = [["all", "All"], ["camping", "Camping"], ["permits", "Permits"], ["transportation", "Getting there"], ["lodging", "Lodging"], ["food", "Food"], ["trails", "Trails"], ["conditions", "Conditions"]];
var PS_FIRST = ["camping-in-yosemite-first-time", "yosemite-camping-complete-guide", "yosemite-wilderness-permits-guide", "yosemite-walk-up-and-day-of-permits", "pack-your-car-for-yosemite", "getting-to-yosemite", "first-time-yosemite-overwhelm", "yosemite-without-reservations-2026"];
var PS_FAQ = [["How do I get a campsite in Yosemite?", "Everything books through Recreation.gov in three windows. The Valley campgrounds, Wawona and Hodgdon Meadow release five months ahead on the 15th at 7 a.m. Pacific, and the good dates go in three to five minutes. Six higher campgrounds release on a rolling 14 days, and Camp 4 seven days ahead.", "/articles/yosemite-camping-complete-guide", "All 13 campgrounds"], ["Do I need a permit to backpack in Yosemite?", "Yes, year-round, for any overnight in the wilderness. Sixty percent of each trailhead's quota goes by weekly lottery on Recreation.gov 24 weeks ahead; the other 40 percent opens seven days ahead at 7 a.m. Pacific. Day hikes need no permit, except Half Dome.", "/articles/yosemite-wilderness-permits-guide", "The permit walkthrough"], ["Do I need a bear canister?", "For any overnight trip in the wilderness, yes: an approved canister, carrying everything with a scent. In a campground, the site's steel food locker does the job, and everything scented goes in it, including the empty cooler.", "/articles/camping-in-yosemite-first-time", "Camping for the first time"], ["Are there showers in Yosemite campgrounds?", "No, at no campground in the park. The nearest public showers are at Curry Village, about five dollars, with a long line in peak season. There are no hookups at any site either.", "/articles/camping-in-yosemite-first-time", "What the site has and doesn't"], ["Which entrance should I use?", "For a Valley-focused visit, or any trip from November through March, the Arch Rock Entrance on Highway 140 through Mariposa. Highway 120 suits the high country and Hetch Hetchy, Highway 41 Fresno arrivals and the Mariposa Grove.", "/articles/getting-to-yosemite", "The five entrances"], ["Do I need a reservation to enter the park in 2026?", "No. There is no day-use, timed-entry or peak-hours reservation in 2026. You need a standard entrance pass, $35 per vehicle for seven days. Camping and in-park lodging still need booking.", "/articles/yosemite-without-reservations-2026", "The plan without one"]];
var PS_ICON_PATHS = {
  tent: React.createElement("path", {
    d: "M3 20 L12 5 L21 20 Z M12 5 V20 M9 20 L12 14 L15 20"
  }),
  calendar: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "16",
    rx: "1"
  }), React.createElement("path", {
    d: "M3 10 H21 M8 3 V7 M16 3 V7"
  })),
  timer: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "13",
    r: "8"
  }), React.createElement("path", {
    d: "M12 9 V13 L15 15 M9 2 H15"
  })),
  canister: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "6",
    y: "3",
    width: "12",
    height: "18",
    rx: "5"
  }), React.createElement("path", {
    d: "M6 9 H18 M6 15 H18"
  })),
  hiker: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "13",
    cy: "4",
    r: "2"
  }), React.createElement("path", {
    d: "M9 21 L11 14 L14 16 V21 M11 14 L12 8 L16 11 L18 10 M12 8 L9 10 L8 13"
  }), React.createElement("rect", {
    x: "5",
    y: "8",
    width: "4",
    height: "7",
    rx: "1"
  })),
  lodge: React.createElement("path", {
    d: "M3 20 V9 L12 4 L21 9 V20 M3 20 H21 M9 20 V14 H15 V20"
  }),
  car: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M4 16 V12 L6 7 H18 L20 12 V16 Z M4 16 V19 M20 16 V19"
  }), React.createElement("circle", {
    cx: "8",
    cy: "13",
    r: "1"
  }), React.createElement("circle", {
    cx: "16",
    cy: "13",
    r: "1"
  })),
  pin: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M12 21 C12 21 5 14 5 9 A7 7 0 0 1 19 9 C19 14 12 21 12 21 Z"
  }), React.createElement("circle", {
    cx: "12",
    cy: "9",
    r: "2.5"
  })),
  signal: React.createElement("path", {
    d: "M5 20 V16 M10 20 V12 M15 20 V8 M20 20 V4"
  }),
  chains: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "7",
    cy: "12",
    r: "3"
  }), React.createElement("circle", {
    cx: "17",
    cy: "12",
    r: "3"
  }), React.createElement("path", {
    d: "M10 12 H14"
  })),
  tire: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8"
  }), React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  })),
  yes: React.createElement("path", {
    d: "M5 12 L10 17 L19 7"
  }),
  no: React.createElement("path", {
    d: "M6 6 L18 18 M18 6 L6 18"
  }),
  info: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), React.createElement("path", {
    d: "M12 7 V13 M12 16.5 V17"
  }))
};
function PsIcon({
  name,
  size = 26,
  className
}) {
  return React.createElement("svg", {
    className: ["ps-icon", className].filter(Boolean).join(" "),
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, PS_ICON_PATHS[name]);
}
function psFirstSentence(text) {
  var m = String(text || "").match(/^.*?[.?!](?=\s|$)/);
  return m ? m[0] : text;
}
function PlanningSectionPage({
  go
}) {
  var [arrive, setArrive] = useState(6);
  var [pack, setPack] = useState("car");
  var [topic, setTopic] = useState("all");
  var L = (location, href, children, className) => React.createElement(HomeLink, {
    go: go,
    location: location,
    href: href,
    className: className
  }, children);
  var release = PS_MONTHS[psReleaseMonth(arrive)];
  var kit = PS_PACKS[pack];
  var intent = window.ARTICLE_INTENT || {};
  var all = window.byCategory("planning");
  var rank = a => {
    var i = PS_FIRST.indexOf(a.slug);
    return i === -1 ? PS_FIRST.length : i;
  };
  var entries = all.map((a, i) => ({
    a,
    i,
    topics: intent[a.slug] && intent[a.slug].topic || []
  })).sort((x, y) => rank(x.a) - rank(y.a) || x.i - y.i);
  var topicLabel = Object.fromEntries(PS_TOPICS);
  var tagged = (e, k) => k === "all" || e.topics.includes(k);
  var shown = entries.filter(e => tagged(e, topic));
  var toc = [["#ps-paths", "Your kind of trip"], ["#ps-reserve", "Book a campsite"], ["#ps-first-night", "The first night"], ["#ps-wilderness", "Wilderness permits"], ["#ps-pack", "What to pack"], ["#ps-drive", "Plan the drive"], ["#ps-every-entry", "Every entry"], ["#ps-questions", "Questions"]];
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-section-planning"
  }, React.createElement("div", {
    className: "ff-cover ps-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/campground-tent-dog-andrei-serikov.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "A tent pitched in a Yosemite campground among pines, a dog resting beside it",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Read",
      route: "articles"
    }, {
      label: "Planning"
    }],
    eyebrow: "SECTION · PLANNING · HOW-TO GUIDES",
    title: "Plan a Yosemite trip, step by step",
    intro: "How to book a campsite on the release morning, spend a first night in a campground without the usual mistakes, get a wilderness permit on Recreation.gov, pack for the trip you actually booked, and choose the road in. Every step is drawn from a longer article, linked where it applies.",
    actions: React.createElement(React.Fragment, null, L("section_planning_head", "#ps-paths", React.createElement(React.Fragment, null, "Choose your kind of trip ", React.createElement("span", null, "↓")), "hp-button"), L("section_planning_head", "#ps-reserve", "Book a campsite ↓", "hp-link"))
  }), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: Andrei Serikov / Pexels")), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(PsIcon, {
    name: "tent",
    className: "ff-icon"
  }), React.createElement("dt", null, "Campsites"), React.createElement("dd", null, "Five months out, the 15th, 7 a.m.")), React.createElement("div", null, React.createElement(PsIcon, {
    name: "calendar",
    className: "ff-icon"
  }), React.createElement("dt", null, "Wilderness permits"), React.createElement("dd", null, "Lottery 24 weeks out")), React.createElement("div", null, React.createElement(PsIcon, {
    name: "timer",
    className: "ff-icon"
  }), React.createElement("dt", null, "The second chance"), React.createElement("dd", null, "Seven days out, 7 a.m.")), React.createElement("div", null, React.createElement(PsIcon, {
    name: "canister",
    className: "ff-icon"
  }), React.createElement("dt", null, "Overnight in wilderness"), React.createElement("dd", null, "Bear canister, required"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(React.Fragment, {
    key: href
  }, L("section_planning_toc", href, label))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ps-paths",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "START WITH THE KIND OF TRIP"), React.createElement("h2", null, "Four trips, four different sets of deadlines")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, "A campsite, a wilderness permit and a room each open on their own calendar, and each fails in its own way. Pick the one you're planning and start there.")), React.createElement("div", {
    className: "ps-paths"
  }, [["tent", "CAR CAMPING", "A first campground trip", "Book on the release morning, then learn the bear box, the cold and the campground clock before you arrive.", "#ps-reserve", "Steps 1 to 4 ↓"], ["hiker", "BACKPACKING", "A night in the wilderness", "A trailhead and a start date on Recreation.gov, a bear canister, and a pickup morning at a wilderness center.", "#ps-wilderness", "The permit calendar ↓"], ["lodge", "ROOMS", "A lodge or a gateway town", "In-park rooms book through the concessioner up to 366 days out. The gateway towns are a drive away, and the drive is the decision.", "/stay", "The lodging board →"], ["car", "DAY TRIP", "In and out by car", "No reservation needed to enter in 2026. The plan is the road, the hour you arrive, and what's in the trunk.", "#ps-drive", "Plan the drive ↓"]].map(([icon, k, t, d, href, cta]) => React.createElement(HomeLink, {
    key: t,
    go: go,
    location: "section_planning",
    href: href,
    className: "ps-path"
  }, React.createElement(PsIcon, {
    name: icon,
    size: 34
  }), React.createElement("span", {
    className: "ps-path__k"
  }, k), React.createElement("span", {
    className: "ps-path__t"
  }, t), React.createElement("span", {
    className: "ps-path__d"
  }, d), React.createElement("span", {
    className: "ps-path__go"
  }, cta))))), React.createElement("section", {
    className: "ff-band",
    id: "ps-reserve",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HOW TO BOOK A CAMPSITE"), React.createElement("h2", null, "The release morning is won the night before"), React.createElement("p", {
    className: "ff-lede"
  }, "Every campground in the park books through Recreation.gov. The popular ones open five months ahead, on the 15th of the month at 7 a.m. Pacific, one calendar month of arrivals at a time, and the good dates go in three to five minutes.")), React.createElement("figure", {
    className: "ps-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/camp-4-kiosk.jpg",
    alt: "The registration kiosk at Camp 4 in Yosemite Valley",
    sizes: "(max-width: 880px) 100vw, 560px"
  }), React.createElement("figcaption", null, "Camp 4's kiosk. Photo: Almonroth / Wikimedia Commons (CC BY-SA 3.0)"))), React.createElement("ol", {
    className: "ps-steps"
  }, React.createElement("li", null, React.createElement("span", {
    className: "ps-steps__when"
  }, "A week before"), React.createElement("strong", null, "Set up the account"), React.createElement("p", null, "Create the Recreation.gov account, confirm the email address, and save a payment method to it. None of that should happen at 7:01.")), React.createElement("li", null, React.createElement("span", {
    className: "ps-steps__when"
  }, "The night before"), React.createElement("strong", null, "Read the campground's page"), React.createElement("p", null, "Open its Seasons and Fees tab. Check the open dates and the window it uses, then pick three acceptable sites or loops, not one.")), React.createElement("li", null, React.createElement("span", {
    className: "ps-steps__when"
  }, "7:00 a.m. Pacific"), React.createElement("strong", null, "Book the first site that works"), React.createElement("p", null, "A site you are holding is worth more than a better one you lost while reading about it. You can move later if something better opens.")), React.createElement("li", null, React.createElement("span", {
    className: "ps-steps__when"
  }, "Missed it"), React.createElement("strong", null, "Play the cancellations"), React.createElement("p", null, "People cancel in waves. Set alerts on two free services (Campflare, Outdoorithm), check by hand in the peak windows, and stay flexible on dates."))), React.createElement("div", {
    className: "ps-calc"
  }, React.createElement("div", {
    className: "ps-calc__pick"
  }, React.createElement("p", {
    className: "ps-label"
  }, "When do you arrive?"), React.createElement("div", {
    className: "ps-months",
    role: "group",
    "aria-label": "Arrival month"
  }, PS_MONTHS.map((m, i) => React.createElement("button", {
    key: m,
    type: "button",
    className: "ps-choice" + (i === arrive ? " is-on" : ""),
    "aria-pressed": i === arrive,
    onClick: () => setArrive(i)
  }, m.slice(0, 3)))), React.createElement("p", {
    className: "ff-note"
  }, "For the five-month campgrounds: the three Valley Pines, Wawona and Hodgdon Meadow. Check the campground's own page first; seasons and windows change.")), React.createElement("div", {
    className: "ps-calc__out",
    "aria-live": "polite"
  }, React.createElement("small", null, "Arriving any day in ", PS_MONTHS[arrive]), React.createElement("span", {
    className: "ps-calc__big"
  }, "Book on ", release, " 15"), React.createElement("span", {
    className: "ps-calc__time"
  }, "7:00 a.m. Pacific, on Recreation.gov"), React.createElement("p", null, arrive < 5 ? "That's the previous year: the release is five months ahead, one calendar month of arrivals at a time. Be logged in by 6:55." : "Five months ahead, one calendar month of arrivals at a time. Be logged in by 6:55, with three acceptable sites picked."))), React.createElement("ul", {
    className: "ps-windows",
    "aria-label": "The three booking windows"
  }, React.createElement("li", null, React.createElement("b", null, "Five months"), React.createElement("span", null, "The Valley campgrounds, Wawona and Hodgdon Meadow, on the 15th at 7 a.m. Pacific. $36 a night.")), React.createElement("li", null, React.createElement("b", null, "Fourteen days"), React.createElement("span", null, "Six higher campgrounds on a rolling window: a new night every morning at 7 a.m.")), React.createElement("li", null, React.createElement("b", null, "Seven days"), React.createElement("span", null, "Camp 4, the walk-in climbers' camp, rolling daily. $10 a person a night."))), React.createElement("p", {
    className: "ff-note"
  }, "Every campground, its window and its catch: ", L("section_planning", "/articles/yosemite-camping-complete-guide", "the dirt on all 13 campgrounds"), ". Every release on one subscribable calendar: ", L("section_planning", "/dates", "the deadline table"), ". No site at all: ", L("section_planning", "/articles/yosemite-walk-up-and-day-of-permits", "what you can still get today"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ps-first-night",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YOUR FIRST NIGHT IN A CAMPGROUND"), React.createElement("h2", null, "It's a village with trees in it. Plan for that."), React.createElement("p", {
    className: "ff-lede"
  }, "The three Valley campgrounds hold roughly 380 sites on a floor a mile wide. You will hear your neighbors. What catches first-timers isn't the reservation. It's arriving at four o'clock with three hours of daylight and a list nobody handed you."), React.createElement("p", {
    className: "ff-note"
  }, "The whole first night, from someone who has watched twenty years of them: ", L("section_planning", "/articles/camping-in-yosemite-first-time", "camping in Yosemite for the first time"), ".")), React.createElement("div", {
    className: "ps-inv"
  }, React.createElement("div", null, React.createElement("h3", null, "What the site has"), React.createElement("ul", null, ["A numbered dirt or gravel pad", "A picnic table", "A steel fire ring with a grate", "A metal food locker, the bear box", "Flush toilets and water in the Valley"].map(t => React.createElement("li", {
    key: t
  }, React.createElement(PsIcon, {
    name: "yes",
    size: 16,
    className: "ps-yes"
  }), t)))), React.createElement("div", null, React.createElement("h3", null, "What it doesn't"), React.createElement("ul", null, [["Showers.", "None in any campground. Curry Village, about $5."], ["Hookups.", "No power, water or sewer at any pad."], ["Signal.", "A pleasant accident, not infrastructure."], ["Water, sometimes.", "Some primitive camps on Tioga Road have none."]].map(([b, t]) => React.createElement("li", {
    key: b
  }, React.createElement(PsIcon, {
    name: "no",
    size: 16,
    className: "ps-no"
  }), React.createElement("span", null, React.createElement("b", null, b), " ", t))))))), React.createElement("div", {
    className: "ps-clock",
    role: "img",
    "aria-label": "The campground day: quiet hours 10 p.m. to 6 a.m., generator hours 7 to 9, noon to 2 and 5 to 7, check-in and check-out around noon"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE CLOCK NOBODY POSTS AT THE ENTRANCE"), React.createElement("div", {
    className: "ps-clock__bar",
    "aria-hidden": "true"
  }, React.createElement("span", {
    className: "ps-seg ps-seg--quiet",
    style: {
      left: "0%",
      width: "25%"
    }
  }, "Quiet hours"), React.createElement("span", {
    className: "ps-seg ps-seg--gen",
    style: {
      left: "29.17%",
      width: "8.33%"
    }
  }, "Generators"), React.createElement("span", {
    className: "ps-seg ps-seg--gen",
    style: {
      left: "50%",
      width: "8.33%"
    }
  }, "Generators"), React.createElement("span", {
    className: "ps-seg ps-seg--check",
    style: {
      left: "50%"
    }
  }), React.createElement("span", {
    className: "ps-seg ps-seg--gen",
    style: {
      left: "70.83%",
      width: "8.33%"
    }
  }, "Generators"), React.createElement("span", {
    className: "ps-seg ps-seg--quiet",
    style: {
      left: "91.67%",
      width: "8.33%"
    }
  }, "Quiet")), React.createElement("div", {
    className: "ps-clock__ticks",
    "aria-hidden": "true"
  }, React.createElement("span", {
    style: {
      left: "0%"
    }
  }, "Midnight"), React.createElement("span", {
    style: {
      left: "25%"
    }
  }, "6 a.m."), React.createElement("span", {
    style: {
      left: "50%"
    }
  }, "Noon"), React.createElement("span", {
    style: {
      left: "75%"
    }
  }, "6 p.m."), React.createElement("span", {
    className: "ps-clock__end",
    style: {
      left: "100%"
    }
  }, "Midnight")), React.createElement("div", {
    className: "ps-clock__key",
    "aria-hidden": "true"
  }, React.createElement("span", null, React.createElement("i", {
    className: "ps-key--quiet"
  }), "Quiet hours, 10 p.m. to 6 a.m."), React.createElement("span", null, React.createElement("i", {
    className: "ps-key--gen"
  }), "Generator hours: 7 to 9, noon to 2, 5 to 7"), React.createElement("span", null, React.createElement("i", {
    className: "ps-key--check"
  }), "Check-in and check-out, around noon"))), React.createElement("div", {
    className: "ps-tips"
  }, React.createElement("div", {
    className: "ps-tip"
  }, React.createElement("p", {
    className: "ps-tip__n"
  }, "18", React.createElement("small", null, "inches")), React.createElement("h3", null, "Measure the cooler against the box"), React.createElement("div", {
    className: "ps-box",
    "aria-hidden": "true"
  }, React.createElement("div", {
    style: {
      height: 78
    }
  }, "NEWER · 28 IN"), React.createElement("div", {
    style: {
      height: 50
    }
  }, "OLDER · 18 IN")), React.createElement("p", null, "Newer lockers are about 35 by 43 by 28 inches inside. The older ones at some higher campgrounds have about 18 inches of height, and a tall upright cooler won't go in. Everything with a smell goes in, toothpaste and the empty cooler included. Latch it every time: fines run to $5,000.")), React.createElement("div", {
    className: "ps-tip"
  }, React.createElement("p", {
    className: "ps-tip__n"
  }, "8,600", React.createElement("small", null, "feet")), React.createElement("h3", null, "Pack for your campground's elevation"), React.createElement("p", null, "The Valley sits near 4,000 feet, Tuolumne near 8,600, and a July night there can drop into the high thirties. Look up your campground, not the park, and read the forecast low as optimistic. A 20-degree bag is never wrong here.")), React.createElement("div", {
    className: "ps-tip"
  }, React.createElement("p", {
    className: "ps-tip__n"
  }, "2", React.createElement("small", null, "pads")), React.createElement("h3", null, "The cold comes from underneath"), React.createElement("p", null, "Most people who are cold at night are losing heat to the ground, not through the bag. A cheap closed-cell foam pad under an air pad fixes more cold nights than a warmer bag. Sleep in a warm hat. Bring earplugs."))), React.createElement("p", {
    className: "ff-note"
  }, "Bears and what to do when you meet one: ", L("section_planning", "/articles/yosemite-bears-safety-guide", "Yosemite bear safety"), ". When the campfire is allowed: ", L("section_planning", "/articles/yosemite-fire-restrictions-explained", "fire restrictions, explained"), ".")), React.createElement("section", {
    className: "ff-band",
    id: "ps-wilderness",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HOW TO GET A WILDERNESS PERMIT"), React.createElement("h2", null, "You're reserving a trailhead and a start date"), React.createElement("p", {
    className: "ff-lede"
  }, "A permit is required year-round for any night in the Yosemite Wilderness, which is 95 percent of the park. It is not a campsite: there are no assigned sites. The park caps how many people start from each trailhead each day, and Recreation.gov hands that quota out two ways."), React.createElement("div", {
    className: "ps-quota",
    role: "img",
    "aria-label": "One trailhead's daily quota: 60 percent by weekly lottery, 40 percent released seven days ahead"
  }, React.createElement("div", {
    className: "ps-quota__bar",
    "aria-hidden": "true"
  }, React.createElement("div", {
    className: "ps-quota__lottery"
  }, React.createElement("b", null, "60%"), "Weekly lottery, 24 weeks out"), React.createElement("div", {
    className: "ps-quota__release"
  }, React.createElement("b", null, "40%"), "Released 7 days out")), React.createElement("p", {
    className: "ff-note"
  }, "One trailhead's daily quota, as the article draws it."))), React.createElement("figure", {
    className: "ps-photo ps-photo--tall"
  }, React.createElement(ResponsiveImage, {
    image: "img/john-muir-trail-backpacker-yosemite.jpg",
    alt: "A backpacker on the John Muir Trail in Yosemite's high country",
    sizes: "(max-width: 880px) 100vw, 560px"
  }), React.createElement("figcaption", null, "Photo: Kaitymh / Wikimedia Commons (CC BY-SA 4.0)"))), React.createElement("ol", {
    className: "ps-steps"
  }, React.createElement("li", null, React.createElement("span", {
    className: "ps-steps__when"
  }, "24 weeks out"), React.createElement("strong", null, "Enter the weekly lottery"), React.createElement("p", null, "Applications for a Sunday-to-Saturday week of start dates open on a Sunday, close Saturday, and run the next day. $10 to apply, $5 a person if you win. List alternate trailheads and dates: that is where most of the winning happens.")), React.createElement("li", null, React.createElement("span", {
    className: "ps-steps__when"
  }, "7 days out, 7 a.m."), React.createElement("strong", null, "Or take the release"), React.createElement("p", null, "The other 40 percent goes online first come, first served. Famous trailheads go in minutes; the ones two drainages over linger for days. Have second and third choices written down.")), React.createElement("li", null, React.createElement("span", {
    className: "ps-steps__when"
  }, "Start day, 8 to 11 a.m."), React.createElement("strong", null, "Collect it in person"), React.createElement("p", null, "A reservation isn't the permit. Pick it up at a wilderness center: Yosemite Valley, Tuolumne Meadows, Big Oak Flat, Wawona or Hetch Hetchy, seasonally. Ask for a late-arrival hold and pickup runs to 5 p.m.")), React.createElement("li", null, React.createElement("span", {
    className: "ps-steps__when"
  }, "At the counter"), React.createElement("strong", null, "Ask the ranger everything"), React.createElement("p", null, "Water sources, snow on the passes, which bear is working which drainage, and where to park overnight. It is the best trail beta in the park, and it's free."))), React.createElement("div", {
    className: "ps-riders"
  }, React.createElement("div", null, React.createElement("h3", null, "Half Dome, as an add-on"), React.createElement("p", null, "If your route passes it, request Half Dome on the permit for $10 a person, under its own daily cap. A two-night Little Yosemite Valley trip is the sane way onto the cables.")), React.createElement("div", null, React.createElement("h3", null, "A bed the night before"), React.createElement("p", null, "The permit lets you sleep in a backpackers' campground the night before you start and the night you come out, no reservation. It solves the dawn start.")), React.createElement("div", null, React.createElement("h3", null, "Better odds, off the Valley"), React.createElement("p", null, "Start from Tuolumne or Hetch Hetchy, where quotas are friendlier, and start midweek. A Tuesday quota is a different universe from a Saturday one."))), React.createElement("ul", {
    className: "ps-rules",
    "aria-label": "The rules that come with the permit"
  }, React.createElement("li", null, React.createElement("b", null, "A bear canister"), React.createElement("span", null, "Required for every overnight. Not a hang. Rent one at a wilderness center.")), React.createElement("li", null, React.createElement("b", null, "Four miles out"), React.createElement("span", null, "Camp at least four miles from any road or developed area, away from water and trails.")), React.createElement("li", null, React.createElement("b", null, "No fires above 9,600 ft"), React.createElement("span", null, "And whatever the season's restrictions add below it.")), React.createElement("li", null, React.createElement("b", null, "15 on trail, 8 off"), React.createElement("span", null, "Group-size caps, enforced."))), React.createElement("p", {
    className: "ps-callout"
  }, React.createElement(PsIcon, {
    name: "info",
    size: 20
  }), React.createElement("span", null, React.createElement("strong", null, "Day hikes need no permit,"), " with one exception: Half Dome runs its own lottery, on ", L("section_planning", "/half-dome-lottery", "the Half Dome lottery page"), ". The full permit walkthrough: ", L("section_planning", "/articles/yosemite-wilderness-permits-guide", "Yosemite wilderness permits, explained"), ".")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ps-pack",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT TO PACK"), React.createElement("h2", null, "Pack for the trip you booked")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, "A campground, a backpacking route and a day on the trails call for three different kits. The highlights of each are below; the full lists, with boxes to tick, are on the checklist page.")), React.createElement("div", {
    className: "ps-tabs",
    role: "group",
    "aria-label": "Choose a packing list"
  }, Object.keys(PS_PACKS).map(k => React.createElement("button", {
    key: k,
    type: "button",
    className: "ps-choice ps-tab" + (k === pack ? " is-on" : ""),
    "aria-pressed": k === pack,
    onClick: () => setPack(k)
  }, PS_PACKS[k].label))), React.createElement("div", {
    className: "ps-packwrap"
  }, React.createElement("div", {
    className: "ps-pack"
  }, kit.groups.map(g => React.createElement("div", {
    className: "ps-pack__g",
    key: g.title
  }, React.createElement("h4", null, g.title), React.createElement("ul", null, g.items.map(([name, note]) => React.createElement("li", {
    key: name
  }, React.createElement("i", {
    "aria-hidden": "true"
  }), React.createElement("span", null, name, note && React.createElement("em", null, note)))))))), React.createElement("aside", {
    className: "ps-packside"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, kit.side.eyebrow), React.createElement("h3", null, kit.side.title), React.createElement("p", null, kit.side.text), L("section_planning", kit.side.href, React.createElement(React.Fragment, null, kit.side.cta, " ", React.createElement("span", null, "→")), "hp-button")))), React.createElement("section", {
    className: "ff-band",
    id: "ps-drive",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HOW TO PLAN THE DRIVE"), React.createElement("h2", null, "Pick the highway from a map, not the phone"), React.createElement("p", {
    className: "ff-lede"
  }, "The worst hour of many trips happens before the park: an app that routes up a forest road, an entrance chosen for the hotel instead of the first stop, chains discovered at 6,000 feet in November. Choose the entrance for the trip, then drive to it."), React.createElement("div", {
    className: "ps-entrances"
  }, [["Hwy 140", "Arch Rock · Mariposa", "The all-weather road", "Lowest elevation, least snow and chain control, fastest to the Valley. From San Francisco, about 3 hours 45 minutes.", "A Valley trip, and any trip November through March", "/articles/getting-to-yosemite"], ["Hwy 120", "Big Oak Flat · Groveland", "The northern approach", "About four hours from the Bay Area, and the natural route to the high country, Hetch Hetchy and the Tuolumne Grove.", "Tioga Road trips and the north side", "/articles/getting-to-yosemite"], ["Hwy 41", "South · Oakhurst", "The southern approach", "Fresno is the closest major airport, about an hour and a quarter to this gate. The Mariposa Grove is just inside.", "Flying into Fresno, basing in Oakhurst", "/articles/getting-to-yosemite"], ["Tioga", "East · Lee Vining", "The seasonal door to the high country", "Reno is about three hours away, Mammoth Lakes under one. Closed in winter, and no gas between Lee Vining and Crane Flat.", "East-side trips, in season only", "/tioga-opening"], ["Hetch Hetchy", "Evergreen Road", "A dead end, on purpose", "Daylight hours only, and it connects to nothing else in the park. To reach the Valley you drive back out.", "The reservoir and its trails, nothing else", "/articles/getting-to-yosemite"]].map(([hw, where, t, d, use, href]) => React.createElement(HomeLink, {
    key: hw,
    go: go,
    location: "section_planning",
    href: href,
    className: "ps-entrance"
  }, React.createElement("span", {
    className: "ps-entrance__hw"
  }, hw, React.createElement("small", null, where)), React.createElement("span", {
    className: "ps-entrance__body"
  }, React.createElement("span", {
    className: "ps-entrance__t"
  }, t), React.createElement("span", {
    className: "ps-entrance__d"
  }, d)), React.createElement("span", {
    className: "ps-entrance__for"
  }, React.createElement("b", null, "Use it for"), use)))), React.createElement("div", {
    className: "ff-split ps-drive-split"
  }, React.createElement("ul", {
    className: "ps-drules"
  }, React.createElement("li", null, React.createElement(PsIcon, {
    name: "pin",
    size: 20
  }), React.createElement("span", null, React.createElement("b", null, "Aim the phone at the entrance station,"), " not a lodge name. When the app and the highway signs disagree, believe the signs.")), React.createElement("li", null, React.createElement(PsIcon, {
    name: "signal",
    size: 20
  }), React.createElement("span", null, React.createElement("b", null, "Download the maps before you leave."), " Cell service dies well before the park boundary on every approach.")), React.createElement("li", null, React.createElement(PsIcon, {
    name: "chains",
    size: 20
  }), React.createElement("span", null, React.createElement("b", null, "Carry chains, November through March."), " When chain control goes up the law requires them, even in four-wheel drive on snow tires.")), React.createElement("li", null, React.createElement(PsIcon, {
    name: "tire",
    size: 20
  }), React.createElement("span", null, React.createElement("b", null, "Practice a tire change at home."), " It decides whether a flat at Crane Flat is twenty minutes or three hours."))), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE LONG DRIVES"), React.createElement("div", {
    className: "ps-drives"
  }, [["From Los Angeles", "313 miles, six hours", "The Park Service's number, and the Oakhurst overnight that makes the trip work.", "Where to break it →", "/articles/yosemite-from-los-angeles"], ["From Las Vegas", "400 miles over Tioga Pass", "Or 495 miles and up to ten hours when the pass is shut. The calendar picks the road.", "The pass that decides →", "/articles/yosemite-from-las-vegas"], ["From San Francisco, for the day", "Nine hours of driving", "Buys seven hours in the park in June and five in December.", "The honest math →", "/articles/yosemite-day-trip-from-bay-area"]].map(([from, num, d, cta, href]) => React.createElement(HomeLink, {
    key: from,
    go: go,
    location: "section_planning",
    href: href,
    className: "ps-drive"
  }, React.createElement("span", {
    className: "ps-drive__from"
  }, from), React.createElement("span", {
    className: "ps-drive__num"
  }, num), React.createElement("small", null, d), React.createElement("span", {
    className: "ps-drive__go"
  }, cta)))))), React.createElement("p", {
    className: "ff-note"
  }, "Drive times between any two points in and around the park: ", L("section_planning", "/distances", "the distance table"), ". Road closed on the way in: ", L("section_planning", "/articles/highway-140-closed-yosemite", "Highway 140 closed"), ". Today's roads and entrance waits: ", L("section_planning", "/conditions", "the conditions board"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ps-every-entry",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "EVERY ENTRY"), React.createElement("h2", null, "The whole section, by topic")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, "All ", entries.length, " planning articles. Pick a topic to narrow the list; an article can answer more than one.")), React.createElement("div", {
    className: "ps-filters",
    role: "group",
    "aria-label": "Filter by topic"
  }, PS_TOPICS.map(([k, label]) => React.createElement("button", {
    key: k,
    type: "button",
    className: "ps-choice ps-chip" + (k === topic ? " is-on" : ""),
    "aria-pressed": k === topic,
    onClick: () => setTopic(k)
  }, label, " ", React.createElement("span", null, entries.filter(e => tagged(e, k)).length)))), React.createElement("p", {
    className: "ps-count",
    "aria-live": "polite"
  }, topic === "all" ? `Showing all ${shown.length} entries.` : `Showing ${shown.length} of ${entries.length} entries tagged ${topicLabel[topic].toLowerCase()}.`), React.createElement("div", {
    className: "ps-list"
  }, shown.map((e, i) => React.createElement(HomeLink, {
    key: e.a.slug,
    go: go,
    location: "section_list",
    href: `/articles/${e.a.slug}`,
    className: "ps-row"
  }, React.createElement("span", {
    className: "ps-row__n"
  }, String(i + 1).padStart(2, "0")), React.createElement("span", {
    className: "ps-row__body"
  }, React.createElement("span", {
    className: "ps-row__t"
  }, e.a.title), React.createElement("span", {
    className: "ps-row__d"
  }, psFirstSentence(e.a.dek))), React.createElement("span", {
    className: "ps-row__k"
  }, e.topics.length ? e.topics.map(k => topicLabel[k] || k).join(" · ") : "Essay"), React.createElement("span", {
    className: "ps-row__r"
  }, e.a.read, " read"))))), React.createElement("section", {
    className: "ff-band",
    id: "ps-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Planning questions, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "The ones readers ask most, answered the way the articles answer them."), React.createElement("div", {
    className: "ff-closing"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "NOT SURE WHERE TO START?"), React.createElement("h3", null, "Five questions, one plan"), React.createElement("p", null, "Month, days, where you're sleeping, who's coming and what matters most. The trip planner returns a read list and a day plan capped to what the month's roads allow."), L("section_planning", "/planning", React.createElement(React.Fragment, null, "Open the trip planner ", React.createElement("span", null, "→")), "hp-button"))), React.createElement("div", {
    className: "ff-faq"
  }, PS_FAQ.map(([q, a, href, label], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a, " ", L("section_planning", href, label), ".")))))), React.createElement(HpGuideBand, {
    go: go,
    location: "section_planning",
    title: "The plan, in your pocket where there's no signal",
    intro: "The Field Guide app carries the stops, the hikes and the deadlines for your dates, with offline maps for a park that has no signal past the gate.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "The release dates, before they arrive",
    heading: "The release dates, before they arrive",
    blurb: "One letter a week from inside Yosemite: what the season is doing, which roads moved, and the booking window coming up next.",
    location: "section_planning",
    tag: "planning"
  }));
}
var SX_KEYS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
function sxParkMonth() {
  try {
    var m = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      month: "numeric"
    }).format(new Date());
    return Number(m) - 1;
  } catch (e) {
    return new Date().getMonth();
  }
}
var SX_ICON_PATHS = {
  calendar: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "16",
    rx: "1"
  }), React.createElement("path", {
    d: "M3 10 H21 M8 3 V7 M16 3 V7"
  })),
  road: React.createElement("path", {
    d: "M8 3 L5 21 M16 3 L19 21 M12 4 V8 M12 11 V15 M12 18 V21"
  }),
  book: React.createElement("path", {
    d: "M4 4 H10 A2 2 0 0 1 12 6 V20 A2 2 0 0 0 10 18 H4 Z M20 4 H14 A2 2 0 0 0 12 6 V20 A2 2 0 0 1 14 18 H20 Z"
  }),
  mountain: React.createElement("path", {
    d: "M2 20 L9 7 L13 14 L16 10 L22 20 Z"
  }),
  gain: React.createElement("path", {
    d: "M3 20 H21 M3 20 L9 12 L13 15 L20 5 M15 5 H20 V10"
  }),
  clock: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), React.createElement("path", {
    d: "M12 7 V12 L15 14"
  })),
  paw: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "6",
    cy: "10",
    r: "2"
  }), React.createElement("circle", {
    cx: "10",
    cy: "6",
    r: "2"
  }), React.createElement("circle", {
    cx: "14",
    cy: "6",
    r: "2"
  }), React.createElement("circle", {
    cx: "18",
    cy: "10",
    r: "2"
  }), React.createElement("path", {
    d: "M8 18 C8 14 10 13 12 13 C14 13 16 14 16 18 C16 20 14 20 12 19 C10 20 8 20 8 18 Z"
  })),
  flower: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2.5"
  }), React.createElement("path", {
    d: "M12 9.5 C10 6 11 3 12 3 C13 3 14 6 12 9.5 M14.5 12 C18 10 21 11 21 12 C21 13 18 14 14.5 12 M12 14.5 C14 18 13 21 12 21 C11 21 10 18 12 14.5 M9.5 12 C6 14 3 13 3 12 C3 11 6 10 9.5 12"
  })),
  eye: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M2 12 C5 6 19 6 22 12 C19 18 5 18 2 12 Z"
  }), React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  })),
  permit: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "5",
    y: "3",
    width: "14",
    height: "18",
    rx: "1"
  }), React.createElement("path", {
    d: "M9 8 H15 M9 12 H15 M9 16 H12"
  }))
};
function SxIcon({
  name,
  size = 26,
  className
}) {
  return React.createElement("svg", {
    className: ["ps-icon", className].filter(Boolean).join(" "),
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, SX_ICON_PATHS[name]);
}
var sxArticle = slug => (window.ARTICLES || []).find(a => a.slug === slug);
var sxFirst = text => {
  var s = String(text || "");
  var m = s.match(/^.*?[.?!](?=\s|$)/);
  if (!m) return s;
  if (m[0].length >= 45) return m[0];
  var m2 = s.match(/^.*?[.?!]\s+.*?[.?!](?=\s|$)/);
  return m2 ? m2[0] : m[0];
};
var sxCredit = a => a && a.credit ? a.credit.replace(/^(Photo|Illustration): /, "") : "";
function SxEveryEntry({
  slugCat,
  groups,
  go,
  location,
  id,
  lede
}) {
  var [pick, setPick] = useState("all");
  var all = window.byCategory(slugCat);
  var inGroup = (a, k) => k === "all" || (groups.find(g => g[0] === k) || [0, 0, []])[2].includes(a.slug);
  var shown = all.filter(a => inGroup(a, pick));
  var labels = a => groups.filter(g => g[2].includes(a.slug)).map(g => g[1]).join(" · ");
  return React.createElement("section", {
    className: "hp-wrap hp-section",
    id: id,
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "EVERY ENTRY"), React.createElement("h2", null, "The whole section")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, lede.replace("{n}", all.length))), React.createElement("div", {
    className: "ps-filters",
    role: "group",
    "aria-label": "Filter the section"
  }, [["all", "All"], ...groups.map(g => [g[0], g[1]])].map(([k, label]) => React.createElement("button", {
    key: k,
    type: "button",
    className: "ps-choice ps-chip" + (k === pick ? " is-on" : ""),
    "aria-pressed": k === pick,
    onClick: () => setPick(k)
  }, label, " ", React.createElement("span", null, all.filter(a => inGroup(a, k)).length)))), React.createElement("p", {
    className: "ps-count",
    "aria-live": "polite"
  }, pick === "all" ? `Showing all ${shown.length} entries.` : `Showing ${shown.length} of ${all.length} entries.`), React.createElement("div", {
    className: "ps-list"
  }, shown.map((a, i) => React.createElement(HomeLink, {
    key: a.slug,
    go: go,
    location: "section_list",
    href: `/articles/${a.slug}`,
    className: "ps-row"
  }, React.createElement("span", {
    className: "ps-row__n"
  }, String(i + 1).padStart(2, "0")), React.createElement("span", {
    className: "ps-row__body"
  }, React.createElement("span", {
    className: "ps-row__t"
  }, a.title), React.createElement("span", {
    className: "ps-row__d"
  }, sxFirst(a.dek))), React.createElement("span", {
    className: "ps-row__k"
  }, labels(a) || "Essay"), React.createElement("span", {
    className: "ps-row__r"
  }, a.read, " read")))));
}
var SX_SEASONS = [{
  key: "winter",
  label: "Winter",
  months: "December to February",
  lead: "yosemite-in-winter",
  slugs: ["yosemite-in-winter", "horsetail-fall-firefall", "bracebridge-dinner-and-vintners-holidays", "yosemite-winter-hikes"]
}, {
  key: "spring",
  label: "Spring",
  months: "March to May",
  lead: "yosemite-in-march",
  slugs: ["yosemite-in-march", "yosemite-waterfalls-guide", "tioga-road-opening-weekend", "glacier-point-road-open-2026", "memorial-day-skip-the-valley-go-high-2026"]
}, {
  key: "summer",
  label: "Summer",
  months: "June to August",
  lead: "yosemite-in-june",
  slugs: ["yosemite-in-june", "swimming-in-the-merced", "yosemite-heat-safety-guide", "yosemite-stargazing-where-to-look-up", "yosemite-during-smoke-season"]
}, {
  key: "fall",
  label: "Fall",
  months: "September to November",
  lead: "yosemite-in-fall",
  slugs: ["yosemite-in-fall", "yosemite-in-september-2026", "yosemite-in-october-2026", "yosemite-connecting-to-traditions"]
}];
var SX_ROAD_LABEL = {
  open: "Open",
  closed: "Closed",
  unsettled: "Varies"
};
var SX_ROAD_LONG = {
  open: "usually open",
  closed: "closed",
  unsettled: "the date moves with the snowpack"
};
function SeasonalSectionPage({
  go
}) {
  var months = window.TRIP_MONTHS || [];
  var [m, setM] = useState(sxParkMonth);
  var L = (location, href, children, className) => React.createElement(HomeLink, {
    go: go,
    location: location,
    href: href,
    className: className
  }, children);
  var tm = months[m] || months[0];
  var windows = window.ARTICLE_MONTHS || {};
  var readFirst = tm && sxArticle(tm.read);
  var alsoNow = (window.ARTICLES || []).filter(a => a.slug !== (tm && tm.read) && (windows[a.slug] || []).includes(tm && tm.key)).slice(0, 5);
  var season = s => s.slugs.map(sxArticle).filter(Boolean);
  var lead = sxArticle("yosemite-in-fall");
  var groups = SX_SEASONS.map(s => [s.key, s.label, s.slugs]);
  var toc = [["#sx-month", "Pick your month"], ["#sx-roads", "The two roads"], ["#sx-seasons", "Four seasons"], ["#sx-every-entry", "Every entry"]];
  var n = window.byCategory("seasonal").length;
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-section-seasonal"
  }, React.createElement("div", {
    className: "ff-cover sx-cover"
  }, React.createElement(ResponsiveImage, {
    image: lead.image,
    eager: true,
    className: "ff-cover__img",
    alt: "Tunnel View in autumn, the Valley's granite walls under yellow leaves",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Read",
      route: "articles"
    }, {
      label: "Seasonal Guides"
    }],
    eyebrow: "SECTION · SEASONAL GUIDES · MONTH BY MONTH",
    title: "Yosemite, month by month",
    intro: "The park in January is not the park in July. Pick the month you are coming and see what the roads are doing, what the month is like, and which guide to read first. Every month is drawn from a longer piece, linked where it applies.",
    actions: React.createElement(React.Fragment, null, L("section_seasonal_head", "#sx-month", React.createElement(React.Fragment, null, "Pick your month ", React.createElement("span", null, "↓")), "hp-button"), L("section_seasonal_head", "#sx-seasons", "Browse the four seasons ↓", "hp-link"))
  }), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: ", sxCredit(lead))), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(SxIcon, {
    name: "calendar",
    className: "ff-icon"
  }), React.createElement("dt", null, "Months covered"), React.createElement("dd", null, "All twelve")), React.createElement("div", null, React.createElement(SxIcon, {
    name: "road",
    className: "ff-icon"
  }), React.createElement("dt", null, "Roads that decide the month"), React.createElement("dd", null, "Tioga and Glacier Point")), React.createElement("div", null, React.createElement(SxIcon, {
    name: "book",
    className: "ff-icon"
  }), React.createElement("dt", null, "Seasonal guides"), React.createElement("dd", null, n, " to read"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(React.Fragment, {
    key: href
  }, L("section_seasonal_toc", href, label))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sx-month",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHEN ARE YOU COMING?"), React.createElement("h2", null, "What the month decides")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, "Two roads open and close with the season and they set the shape of a trip. The rest of the month's character follows from the snow, and each month below opens on the piece that covers it.")), React.createElement("div", {
    className: "ps-calc"
  }, React.createElement("div", {
    className: "ps-calc__pick"
  }, React.createElement("p", {
    className: "ps-label"
  }, "Which month?"), React.createElement("div", {
    className: "ps-months",
    role: "group",
    "aria-label": "Month of your visit"
  }, months.map((x, i) => React.createElement("button", {
    key: x.key,
    type: "button",
    className: "ps-choice" + (i === m ? " is-on" : ""),
    "aria-pressed": i === m,
    onClick: () => setM(i)
  }, x.label))), React.createElement("p", {
    className: "ff-note"
  }, "It opens on the park's current month. Road status is the month's usual pattern; the park sets the real dates each year, so check the ", L("section_seasonal", "/conditions", "conditions board"), " before you drive.")), React.createElement("div", {
    className: "ps-calc__out",
    "aria-live": "polite"
  }, React.createElement("small", null, "Yosemite in"), React.createElement("span", {
    className: "ps-calc__big"
  }, tm.name), React.createElement("span", {
    className: "ps-calc__time"
  }, "Tioga Road: ", SX_ROAD_LABEL[tm.tioga], " · Glacier Point Road: ", SX_ROAD_LABEL[tm.glacier]), React.createElement("p", null, tm.note))), React.createElement("div", {
    className: "ff-split sx-month-read"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "READ FIRST FOR ", tm.name.toUpperCase()), readFirst && React.createElement(HomeLink, {
    go: go,
    location: "section_seasonal",
    href: `/articles/${readFirst.slug}`,
    className: "ps-drive"
  }, React.createElement("span", {
    className: "ps-drive__from"
  }, readFirst.read, " read"), React.createElement("span", {
    className: "ps-drive__num"
  }, readFirst.title), React.createElement("small", null, sxFirst(readFirst.dek)), React.createElement("span", {
    className: "ps-drive__go"
  }, "Read the guide →"))), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "ARRIVING IN ", tm.name.toUpperCase()), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, tm.arrive), alsoNow.length > 0 && React.createElement(React.Fragment, null, React.createElement("p", {
    className: "hp-eyebrow sx-gap"
  }, "ALSO IN SEASON"), React.createElement("ul", {
    className: "sx-links"
  }, alsoNow.map(a => React.createElement("li", {
    key: a.slug
  }, L("section_seasonal", `/articles/${a.slug}`, a.title)))))))), React.createElement("section", {
    className: "ff-band",
    id: "sx-roads",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE TWO ROADS"), React.createElement("h2", null, "Which of the park's roads are open, by month")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, "Tioga Road crosses the high country to the east side and Glacier Point Road climbs to the viewpoint. Everything else in the park is open all year. Amber means the date moves with the snowpack, so no claim is made for that month.")), React.createElement("div", {
    className: "sx-roads",
    role: "table",
    "aria-label": "Road status by month"
  }, React.createElement("div", {
    className: "sx-roads__head",
    role: "row"
  }, React.createElement("span", {
    role: "columnheader",
    className: "sx-roads__road"
  }), months.map(x => React.createElement("span", {
    role: "columnheader",
    key: x.key
  }, x.label))), [["tioga", "Tioga Road", "/tioga-opening"], ["glacier", "Glacier Point Road", "/articles/glacier-point-road-open-2026"]].map(([k, label, href]) => React.createElement("div", {
    className: "sx-roads__row",
    role: "row",
    key: k
  }, React.createElement("span", {
    role: "rowheader",
    className: "sx-roads__road"
  }, L("section_seasonal", href, label)), months.map(x => React.createElement("span", {
    role: "cell",
    key: x.key,
    className: "sx-cell sx-cell--" + x[k] + (x.key === tm.key ? " is-now" : ""),
    title: `${label}, ${x.name}: ${SX_ROAD_LONG[x[k]]}`
  }, React.createElement("b", null, SX_ROAD_LABEL[x[k]])))))), React.createElement("p", {
    className: "ff-note"
  }, "The month you picked is outlined. When each road actually opens: ", L("section_seasonal", "/tioga-opening", "Tioga Road opening"), ". Every park deadline on one calendar: ", L("section_seasonal", "/dates", "the dates table"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sx-seasons",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "FOUR SEASONS"), React.createElement("h2", null, "The guides, by season")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, "Some of these are written for one year's conditions and say so in the title. The evergreen piece for a season is the first link in its column.")), React.createElement("div", {
    className: "sx-seasons"
  }, SX_SEASONS.map(s => {
    var a = sxArticle(s.lead);
    return React.createElement("article", {
      className: "sx-season",
      key: s.key
    }, React.createElement("figure", {
      className: "ps-photo"
    }, React.createElement(ResponsiveImage, {
      image: a.image,
      alt: a.title,
      sizes: "(max-width: 880px) 100vw, 300px"
    }), React.createElement("figcaption", null, sxCredit(a))), React.createElement("p", {
      className: "hp-eyebrow"
    }, s.months.toUpperCase()), React.createElement("h3", null, s.label), React.createElement("ul", {
      className: "sx-links"
    }, season(s).map(x => React.createElement("li", {
      key: x.slug
    }, L("section_seasonal", `/articles/${x.slug}`, x.title)))));
  }))), React.createElement(SxEveryEntry, {
    slugCat: "seasonal",
    groups: groups,
    go: go,
    location: "section_list",
    id: "sx-every-entry",
    lede: "All {n} seasonal guides, read live from the catalog. Pick a season to narrow the list; a piece that spans two shows under both."
  }), React.createElement("section", {
    className: "ff-band"
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "NOT SURE WHICH MONTH?"), React.createElement("h2", null, "Let the trip planner pick the reads"), React.createElement("p", {
    className: "ff-lede"
  }, "Five questions, one plan: month, days, where you are sleeping, who is coming and what matters most. It returns a read list and a day plan capped to what that month's roads allow.")), React.createElement("div", {
    className: "ff-closing"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE TRIP PLANNER"), React.createElement("h3", null, "Five questions, one plan"), React.createElement("p", null, "The planner reads the same month table as this page, so the plan never routes a January visitor over a closed road."), L("section_seasonal", "/planning", React.createElement(React.Fragment, null, "Open the trip planner ", React.createElement("span", null, "→")), "hp-button")))), React.createElement(HpGuideBand, {
    go: go,
    location: "section_seasonal",
    title: "The season in your pocket, where there's no signal",
    intro: "The Field Guide app carries the stops, the hikes and the deadlines for your dates, with offline maps for a park that has no signal past the gate.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "What the park is doing this week",
    heading: "What the park is doing this week",
    blurb: "One letter a week from inside Yosemite: what the season is doing, which roads moved, and what to book next.",
    location: "section_seasonal",
    tag: "seasonal"
  }));
}
var SX_HIKES = [{
  slug: "hetch-hetchy-the-other-yosemite-valley",
  name: "Wapama Falls, Hetch Hetchy",
  dist: "About 5 miles round trip",
  gainText: "500 ft",
  gain: 500,
  level: "Moderate"
}, {
  slug: "cathedral-lakes-day-hike",
  name: "Cathedral Lakes",
  dist: "9 to 10.5 miles round trip",
  gainText: "1,000 to 1,400 ft",
  gain: 1400,
  level: "Moderate to strenuous"
}, {
  slug: "mist-trail-the-real-guide",
  name: "Mist Trail to Nevada Fall",
  dist: "5.4 miles round trip",
  gainText: "2,000 ft",
  gain: 2000,
  level: "Strenuous"
}, {
  slug: "clouds-rest-hike",
  name: "Clouds Rest",
  dist: "14 miles round trip",
  gainText: "2,300 ft",
  gain: 2300,
  level: "Strenuous",
  note: "No permit required"
}, {
  slug: "yosemite-falls-trail",
  name: "Yosemite Falls, from Camp 4",
  dist: "7.2 miles round trip",
  gainText: "2,700 ft",
  gain: 2700,
  level: "Strenuous"
}, {
  slug: "four-mile-up-panorama-down",
  name: "Four Mile and Panorama",
  dist: "13 to 14 miles between trailheads",
  gainText: "About 4,000 ft",
  gain: 4000,
  level: "Strenuous"
}, {
  slug: "so-you-want-to-hike-half-dome",
  name: "Half Dome, by the cables",
  dist: "14 to 16 miles round trip",
  gainText: "4,800 ft",
  gain: 4800,
  level: "Strenuous",
  note: "Permit required"
}];
var SX_EFFORT = [["any", "Any effort"], ["moderate", "Moderate"], ["strenuous", "Strenuous"]];
var SX_TRAIL_GROUPS = [["valley", "Valley", ["yosemite-falls-trail", "mist-trail-the-real-guide", "four-mile-up-panorama-down", "so-you-want-to-hike-half-dome", "yosemite-waterfalls-guide"]], ["high", "High country", ["clouds-rest-hike", "cathedral-lakes-day-hike"]], ["north", "Hetch Hetchy", ["hetch-hetchy-the-other-yosemite-valley"]], ["off", "Overnight and winter", ["first-yosemite-backpacking-trip", "yosemite-winter-hikes"]]];
function TrailsSectionPage({
  go
}) {
  var [effort, setEffort] = useState("any");
  var [month, setMonth] = useState(-1);
  var L = (location, href, children, className) => React.createElement(HomeLink, {
    go: go,
    location: location,
    href: href,
    className: className
  }, children);
  var months = window.TRIP_MONTHS || [];
  var windows = window.ARTICLE_MONTHS || {};
  var key = month >= 0 ? months[month].key : null;
  var season = slug => !key || !windows[slug] ? null : windows[slug].includes(key) ? "in" : "out";
  var fits = h => effort === "any" || (effort === "moderate" ? /^Moderate/.test(h.level) : h.level === "Strenuous");
  var rows = SX_HIKES.filter(fits);
  var lead = sxArticle("mist-trail-the-real-guide");
  var hd = SX_HIKES.find(h => h.slug === "so-you-want-to-hike-half-dome");
  var cr = SX_HIKES.find(h => h.slug === "clouds-rest-hike");
  var toc = [["#sx-compare", "Compare the hikes"], ["#sx-versus", "Half Dome or Clouds Rest"], ["#sx-kinds", "Other kinds of day"], ["#sx-every-entry", "Every entry"]];
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-section-trails"
  }, React.createElement("div", {
    className: "ff-cover sx-cover"
  }, React.createElement(ResponsiveImage, {
    image: lead.image,
    eager: true,
    className: "ff-cover__img",
    alt: "Nevada Fall and Liberty Cap seen from the trail above the Merced River",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Read",
      route: "articles"
    }, {
      label: "Trails and Hikes"
    }],
    eyebrow: "SECTION · TRAILS AND HIKES · PICK A HIKE",
    title: "Pick a Yosemite hike",
    intro: "Seven of the park's best-known hikes side by side: how far, how much climbing, how hard, and which ones need a permit. Choose by effort and by the month you are going, then open the full guide for the route.",
    actions: React.createElement(React.Fragment, null, L("section_trails_head", "#sx-compare", React.createElement(React.Fragment, null, "Compare the hikes ", React.createElement("span", null, "↓")), "hp-button"), L("section_trails_head", "#sx-versus", "Half Dome or Clouds Rest ↓", "hp-link"))
  }), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: ", sxCredit(lead))), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(SxIcon, {
    name: "mountain",
    className: "ff-icon"
  }), React.createElement("dt", null, "Half Dome"), React.createElement("dd", null, "4,800 ft of climbing, permit required")), React.createElement("div", null, React.createElement(SxIcon, {
    name: "gain",
    className: "ff-icon"
  }), React.createElement("dt", null, "Clouds Rest"), React.createElement("dd", null, "14 miles, no permit required")), React.createElement("div", null, React.createElement(SxIcon, {
    name: "clock",
    className: "ff-icon"
  }), React.createElement("dt", null, "Mist Trail to Nevada Fall"), React.createElement("dd", null, "5.4 miles, 2,000 ft")), React.createElement("div", null, React.createElement(SxIcon, {
    name: "permit",
    className: "ff-icon"
  }), React.createElement("dt", null, "Overnight trips"), React.createElement("dd", null, "A wilderness permit, year-round"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(React.Fragment, {
    key: href
  }, L("section_trails_toc", href, label))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sx-compare",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "COMPARE THE HIKES"), React.createElement("h2", null, "How far, how much climbing, how hard")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, "Every bar is on one scale, from no climbing to Half Dome's 4,800 feet. Distance is the article's own figure, and some are one way and some round trip, so read the line, not just the number.")), React.createElement("div", {
    className: "ps-filters",
    role: "group",
    "aria-label": "Effort"
  }, SX_EFFORT.map(([k, label]) => React.createElement("button", {
    key: k,
    type: "button",
    className: "ps-choice ps-chip" + (k === effort ? " is-on" : ""),
    "aria-pressed": k === effort,
    onClick: () => setEffort(k)
  }, label))), React.createElement("div", {
    className: "ps-filters",
    role: "group",
    "aria-label": "Month of your visit"
  }, React.createElement("button", {
    type: "button",
    className: "ps-choice ps-chip" + (month === -1 ? " is-on" : ""),
    "aria-pressed": month === -1,
    onClick: () => setMonth(-1)
  }, "Any month"), months.map((x, i) => React.createElement("button", {
    key: x.key,
    type: "button",
    className: "ps-choice ps-chip" + (month === i ? " is-on" : ""),
    "aria-pressed": month === i,
    onClick: () => setMonth(i)
  }, x.label))), React.createElement("p", {
    className: "ps-count",
    "aria-live": "polite"
  }, rows.length === 0 ? "No hikes match." : `${rows.length} ${rows.length === 1 ? "hike" : "hikes"}${month >= 0 ? `, marked for ${months[month].name}` : ""}.`, " Hikes with a published season window are dimmed when they are out of season; a hike with no window is never dimmed, because that means the article names none, not that the trail is open."), React.createElement("div", {
    className: "sx-hikes"
  }, rows.map(h => {
    var a = sxArticle(h.slug);
    var st = season(h.slug);
    return React.createElement(HomeLink, {
      key: h.slug,
      go: go,
      location: "section_trails",
      href: `/articles/${h.slug}`,
      className: "sx-hike" + (st === "out" ? " is-out" : "")
    }, React.createElement("span", {
      className: "sx-hike__name"
    }, h.name, React.createElement("small", null, h.dist)), React.createElement("span", {
      className: "sx-hike__why"
    }, a ? sxFirst(a.dek) : ""), React.createElement("span", {
      className: "sx-hike__gain",
      "aria-label": `${h.gainText} of climbing`
    }, React.createElement("span", {
      className: "sx-bar"
    }, React.createElement("i", {
      style: {
        width: `${Math.round(h.gain / 4800 * 100)}%`
      }
    })), React.createElement("b", null, h.gainText)), React.createElement("span", {
      className: "sx-hike__tag"
    }, React.createElement("span", {
      className: "sx-level sx-level--" + (h.level === "Strenuous" ? "hard" : "mod")
    }, h.level), h.note && React.createElement("span", {
      className: "sx-note"
    }, h.note), st === "in" && React.createElement("span", {
      className: "sx-season-tag sx-season-tag--in"
    }, "In season"), st === "out" && React.createElement("span", {
      className: "sx-season-tag"
    }, "Out of season")));
  })), React.createElement("p", {
    className: "ff-note"
  }, "Drive times to the trailhead: ", L("section_trails", "/distances", "the distance table"), ". Trail and road status today: ", L("section_trails", "/conditions", "the conditions board"), ". The Half Dome permit lottery: ", L("section_trails", "/half-dome-lottery", "how it works"), ".")), React.createElement("section", {
    className: "ff-band",
    id: "sx-versus",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE BIG DAY"), React.createElement("h2", null, "Half Dome or Clouds Rest")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, "Both are all-day, strenuous climbs. One needs a permit and a pair of gloves for the cables. The other is higher, and it needs neither.")), React.createElement("div", {
    className: "sx-vs"
  }, [[hd, "The one everyone has heard of", ["A permit from the lottery", "Cables for the last stretch", "14 to 16 miles and 4,800 ft"]], [cr, "The one most visitors skip", ["No permit required", "No cables, a granite spine to finish", "14 miles and 2,300 ft, from the Sunrise Lakes trailhead"]]].map(([h, k, items]) => {
    var a = sxArticle(h.slug);
    return React.createElement(HomeLink, {
      key: h.slug,
      go: go,
      location: "section_trails",
      href: `/articles/${h.slug}`,
      className: "sx-vs__card"
    }, React.createElement("span", {
      className: "sx-vs__k"
    }, k), React.createElement("span", {
      className: "sx-vs__t"
    }, h.name), React.createElement("ul", null, items.map(t => React.createElement("li", {
      key: t
    }, React.createElement(SxIcon, {
      name: "mountain",
      size: 16
    }), t))), React.createElement("span", {
      className: "sx-vs__d"
    }, a ? sxFirst(a.dek) : ""), React.createElement("span", {
      className: "sx-vs__go"
    }, "Read the guide →"));
  })))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sx-kinds",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "NOT A SUMMIT DAY?"), React.createElement("h2", null, "Other kinds of day on the trail")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, "Waterfalls that are only running part of the year, a trail that stays open in winter, and the trip that begins with a permit.")), React.createElement("div", {
    className: "ps-paths sx-paths"
  }, [["yosemite-waterfalls-guide", "flower", "WATERFALLS", "What is actually running"], ["yosemite-winter-hikes", "mountain", "WINTER", "The trails that stay open"], ["first-yosemite-backpacking-trip", "permit", "OVERNIGHT", "A first backpacking trip"]].map(([slug, icon, k, t]) => {
    var a = sxArticle(slug);
    return React.createElement(HomeLink, {
      key: slug,
      go: go,
      location: "section_trails",
      href: `/articles/${slug}`,
      className: "ps-path"
    }, React.createElement(SxIcon, {
      name: icon,
      size: 34
    }), React.createElement("span", {
      className: "ps-path__k"
    }, k), React.createElement("span", {
      className: "ps-path__t"
    }, t), React.createElement("span", {
      className: "ps-path__d"
    }, a ? sxFirst(a.dek) : ""), React.createElement("span", {
      className: "ps-path__go"
    }, "Read the guide →"));
  }))), React.createElement(SxEveryEntry, {
    slugCat: "trails",
    groups: SX_TRAIL_GROUPS,
    go: go,
    location: "section_list",
    id: "sx-every-entry",
    lede: "All {n} trail guides, read live from the catalog. Pick an area to narrow the list."
  }), React.createElement(HpGuideBand, {
    go: go,
    location: "section_trails",
    title: "The trail, in your pocket where there's no signal",
    intro: "The Field Guide app carries the hikes, the stops and the deadlines for your dates, with offline maps for a park that has no signal on any trail.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Which trails are open this week",
    heading: "Which trails are open this week",
    blurb: "One letter a week from inside Yosemite: what the season is doing, which trails and roads moved, and the permit window coming up next.",
    location: "section_trails",
    tag: "trails"
  }));
}
var SX_BLOOM = [{
  band: "High country",
  feet: "8,000 to 10,000 ft",
  from: 5,
  to: 6,
  what: "Tuolumne Meadows"
}, {
  band: "Middle elevations",
  feet: "6,000 to 8,000 ft",
  from: 3,
  to: 5,
  what: "McGurk Meadow, Crane Flat, lupine"
}, {
  band: "Valley floor",
  feet: "About 4,000 ft",
  from: 2,
  to: 4,
  what: "Dogwood, meadow flowers, azalea"
}, {
  band: "Foothills",
  feet: "1,500 to 3,000 ft",
  from: 0,
  to: 2,
  what: "Redbud, then poppies"
}];
var SX_BLOOM_MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
var SX_WILD_GROUPS = [["animals", "Animals", ["yosemite-wildlife-viewing-guide", "water-ouzels-waterfalls", "showy-milkweed-yosemite-valley"]], ["bears", "Bears", ["yosemite-bears-safety-guide", "is-bear-spray-allowed-in-yosemite"]], ["plants", "Plants and trees", ["yosemite-wildflowers-guide", "giant-sequoias-fire-adaptation", "yosemite-tunnel-trees"]], ["land", "Rock and ice", ["what-is-a-talus-field", "yosemite-glaciers-climate"]]];
function WildlifeSectionPage({
  go
}) {
  var L = (location, href, children, className) => React.createElement(HomeLink, {
    go: go,
    location: location,
    href: href,
    className: className
  }, children);
  var lead = sxArticle("yosemite-wildlife-viewing-guide");
  var card = (slug, icon, k, t, cta) => {
    var a = sxArticle(slug);
    return React.createElement(HomeLink, {
      key: slug,
      go: go,
      location: "section_wildlife",
      href: `/articles/${slug}`,
      className: "ps-path"
    }, React.createElement(SxIcon, {
      name: icon,
      size: 34
    }), React.createElement("span", {
      className: "ps-path__k"
    }, k), React.createElement("span", {
      className: "ps-path__t"
    }, t), React.createElement("span", {
      className: "ps-path__d"
    }, a ? sxFirst(a.dek) : ""), React.createElement("span", {
      className: "ps-path__go"
    }, cta));
  };
  var toc = [["#sx-schedule", "The animals' schedule"], ["#sx-bears", "Bears"], ["#sx-bloom", "The bloom"], ["#sx-land", "The ground beneath"], ["#sx-every-entry", "Every entry"]];
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-section-wildlife"
  }, React.createElement("div", {
    className: "ff-cover sx-cover"
  }, React.createElement(ResponsiveImage, {
    image: lead.image,
    eager: true,
    className: "ff-cover__img",
    alt: "A mule deer grazing in a Valley meadow with Half Dome behind it",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Read",
      route: "articles"
    }, {
      label: "Wildlife and Nature"
    }],
    eyebrow: "SECTION · WILDLIFE AND NATURE · WHO LIVES HERE",
    title: "Wildlife and nature in Yosemite",
    intro: "When to look for the animals, what to do about the bears, where the flowers are in any given month, and the rock, ice and trees that explain the place. Every answer is drawn from a longer piece, linked where it applies.",
    actions: React.createElement(React.Fragment, null, L("section_wildlife_head", "#sx-schedule", React.createElement(React.Fragment, null, "When to look ", React.createElement("span", null, "↓")), "hp-button"), L("section_wildlife_head", "#sx-bears", "Bear safety ↓", "hp-link"))
  }), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: ", sxCredit(lead))), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(SxIcon, {
    name: "paw",
    className: "ff-icon"
  }), React.createElement("dt", null, "Vertebrate species"), React.createElement("dd", null, "About 400")), React.createElement("div", null, React.createElement(SxIcon, {
    name: "eye",
    className: "ff-icon"
  }), React.createElement("dt", null, "Distance from a bear"), React.createElement("dd", null, "50 yards minimum")), React.createElement("div", null, React.createElement(SxIcon, {
    name: "paw",
    className: "ff-icon"
  }), React.createElement("dt", null, "Black bears in the park"), React.createElement("dd", null, "300 to 500, no grizzlies")), React.createElement("div", null, React.createElement(SxIcon, {
    name: "flower",
    className: "ff-icon"
  }), React.createElement("dt", null, "The bloom"), React.createElement("dd", null, "Climbs about 1,000 ft a month"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(React.Fragment, {
    key: href
  }, L("section_wildlife_toc", href, label))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sx-schedule",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHEN AND WHERE TO LOOK"), React.createElement("h2", null, "The animals are on a schedule. Match it."), React.createElement("p", {
    className: "ff-lede"
  }, "Yosemite's wildlife is not hiding. About 400 vertebrate species live here, roughly 90 mammals and over 260 birds, and a good number spend their days within a few hundred yards of a road. What keeps most visitors from seeing them is that most visitors are moving, and at the wrong hours."), React.createElement("p", {
    className: "ff-note"
  }, "The whole protocol, animal by animal and meadow by meadow: ", L("section_wildlife", "/articles/yosemite-wildlife-viewing-guide", "Yosemite wildlife: what lives here, and where to see it"), ".")), React.createElement("ul", {
    className: "ps-drules"
  }, React.createElement("li", null, React.createElement(SxIcon, {
    name: "clock",
    size: 20
  }), React.createElement("span", null, React.createElement("b", null, "Go at the edges of the day."), " Most of the park's mammals are active in the low light around sunrise and sunset. A meadow full of deer at 6:30 a.m. is empty by 10.")), React.createElement("li", null, React.createElement(SxIcon, {
    name: "eye",
    size: 20
  }), React.createElement("span", null, React.createElement("b", null, "Walk the boundary, not the middle."), " Animals feed on one side of a meadow's edge and take cover on the other. Look along the seam.")), React.createElement("li", null, React.createElement(SxIcon, {
    name: "paw",
    size: 20
  }), React.createElement("span", null, React.createElement("b", null, "Drive slowly at dawn and dusk."), " The red bear signs along the park roads each mark a spot where a car killed a bear.")))), React.createElement("div", {
    className: "ps-tips"
  }, React.createElement("div", {
    className: "ps-tip"
  }, React.createElement("p", {
    className: "ps-tip__n"
  }, "50", React.createElement("small", null, "yards")), React.createElement("h3", null, "From a bear, minimum"), React.createElement("p", null, "It is the park requirement, and it is measured from the bear, not from your comfort. If a bear changes its behavior because of you, you are too close, whatever the distance.")), React.createElement("div", {
    className: "ps-tip"
  }, React.createElement("p", {
    className: "ps-tip__n"
  }, "25", React.createElement("small", null, "yards")), React.createElement("h3", null, "From a deer"), React.createElement("p", null, "Deer injure more visitors in Yosemite than bears do, because people treat a wild animal with antlers like a petting-zoo resident. Photograph them from the trail.")), React.createElement("div", {
    className: "ps-tip"
  }, React.createElement("p", {
    className: "ps-tip__n"
  }, "8", React.createElement("small", null, "animals")), React.createElement("h3", null, "Who you will actually see"), React.createElement("p", null, "Mule deer, coyote, black bear, Steller's jay, acorn woodpecker, Douglas squirrel, and at altitude the yellow-bellied marmot and the pika. That is most of it.")))), React.createElement("section", {
    className: "ff-band",
    id: "sx-bears",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "BEARS"), React.createElement("h2", null, "Every bear here is a black bear")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, "Somewhere between 300 and 500 of them. There have been no grizzlies in California for over a century, which is why most of the bear advice on the internet is written for the wrong park.")), React.createElement("div", {
    className: "ps-riders"
  }, React.createElement("div", null, React.createElement("h3", null, "Bear spray is illegal"), React.createElement("p", null, "It is classified as a weapon in the Superintendent's Compendium. Possession and use are both prohibited, and it is not needed for black bears.")), React.createElement("div", null, React.createElement("h3", null, "Do not play dead"), React.createElement("p", null, "That is advice for grizzlies. With a black bear that will not leave, make yourself large, shout, and if it makes contact, fight back.")), React.createElement("div", null, React.createElement("h3", null, "Your voice is the tool"), React.createElement("p", null, "The park's Bear Team says it plainly: your voice is your most effective tool. The guide has the specifics."))), React.createElement("div", {
    className: "ps-paths sx-paths"
  }, card("yosemite-bears-safety-guide", "paw", "THE GUIDE", "What to do when you see a bear", "Read the bear guide →"), card("is-bear-spray-allowed-in-yosemite", "permit", "THE RULE", "Is bear spray allowed?", "Read the answer →"), card("yosemite-wildlife-viewing-guide", "eye", "VIEWING", "How far to stay from any animal", "Read the protocol →")), React.createElement("p", {
    className: "ff-note"
  }, "Storing food in a campground, and the locker that comes with it: ", L("section_wildlife", "/articles/camping-in-yosemite-first-time", "camping in Yosemite for the first time"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sx-bloom",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE BLOOM"), React.createElement("h2", null, "In Yosemite, the bloom is not a date. It is an elevation."), React.createElement("p", {
    className: "ff-lede"
  }, "Spring starts in the Merced River canyon in February and takes five months to climb the mountain, at very roughly a thousand feet a month. Something is in flower somewhere in or near the park from February through August. You just have to drive to the right altitude."), React.createElement("p", {
    className: "ff-note"
  }, "Where to stand when it passes, band by band: ", L("section_wildlife", "/articles/yosemite-wildflowers-guide", "Yosemite wildflowers: the bloom calendar climbs the mountain"), ".")), React.createElement("div", {
    className: "sx-bloom",
    role: "img",
    "aria-label": "The bloom by elevation. " + SX_BLOOM.map(b => `${b.band}, ${b.feet}: ${SX_BLOOM_MONTHS[b.from]} to ${SX_BLOOM_MONTHS[b.to]}, ${b.what}.`).join(" ")
  }, React.createElement("div", {
    className: "sx-bloom__head",
    "aria-hidden": "true"
  }, React.createElement("span", null), React.createElement("span", {
    className: "sx-bloom__months"
  }, SX_BLOOM_MONTHS.map(x => React.createElement("span", {
    key: x
  }, x)))), SX_BLOOM.map(b => React.createElement("div", {
    className: "sx-bloom__row",
    key: b.band,
    "aria-hidden": "true"
  }, React.createElement("span", {
    className: "sx-bloom__band"
  }, React.createElement("b", null, b.band), b.feet, React.createElement("em", null, b.what)), React.createElement("span", {
    className: "sx-bloom__track"
  }, React.createElement("i", {
    style: {
      gridColumn: `${b.from + 1} / ${b.to + 2}`
    }
  })))), React.createElement("p", {
    className: "ff-note"
  }, "The bands and months are the guide's own, and approximate. A wet or dry year moves every one of them.")))), React.createElement("section", {
    className: "ff-band",
    id: "sx-land",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE GROUND BENEATH"), React.createElement("h2", null, "Rock, ice and the oldest trees")), React.createElement("p", {
    className: "ff-lede ps-flush"
  }, "The natural-history essays: the landform the Valley is built on, the glaciers that carved it and are now leaving, and the trees that need fire.")), React.createElement("div", {
    className: "ps-paths sx-paths"
  }, card("what-is-a-talus-field", "mountain", "LANDFORM", "What is a talus field?", "Read the essay →"), card("yosemite-glaciers-climate", "gain", "ICE", "The disappearing glaciers", "Read the essay →"), card("giant-sequoias-fire-adaptation", "flower", "TREES", "Why sequoias thrive in fire", "Read the essay →")))), React.createElement(SxEveryEntry, {
    slugCat: "wildlife",
    groups: SX_WILD_GROUPS,
    go: go,
    location: "section_list",
    id: "sx-every-entry",
    lede: "All {n} wildlife and nature pieces, read live from the catalog. Pick a subject to narrow the list."
  }), React.createElement(HpGuideBand, {
    go: go,
    location: "section_wildlife",
    title: "The park's stops and hikes, offline",
    intro: "The Field Guide app carries the meadows, the trails and the viewpoints, with offline maps for a park that has no signal past the gate.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "What the park's naturalists are seeing",
    heading: "What the park's naturalists are seeing",
    blurb: "One letter a week from inside Yosemite: what is in bloom, what is moving, and what the park's own naturalists recorded in these same weeks.",
    location: "section_wildlife",
    tag: "wildlife"
  }));
}
function CategoryPage({
  slug,
  go
}) {
  var cat = window.findCategory(slug);
  if (!cat) return React.createElement("div", {
    className: "hp-wrap hp-section"
  }, "Not found.");
  if (slug === "planning") return React.createElement(PlanningSectionPage, {
    go: go
  });
  if (slug === "seasonal") return React.createElement(SeasonalSectionPage, {
    go: go
  });
  if (slug === "trails") return React.createElement(TrailsSectionPage, {
    go: go
  });
  if (slug === "wildlife") return React.createElement(WildlifeSectionPage, {
    go: go
  });
  var items = window.byCategory(slug);
  return React.createElement("div", {
    className: "page hp-index"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: cat.label
    }],
    eyebrow: "SECTION",
    title: cat.label,
    intro: cat.blurb
  }), React.createElement("section", {
    className: "hp-wrap hp-section hp-index__list"
  }, React.createElement("div", {
    className: "hp-journal-grid"
  }, items.map(a => React.createElement(HpArticleCard, {
    key: a.slug,
    article: a,
    go: go,
    location: "section_list"
  }))), React.createElement("p", {
    className: "hp-index__back"
  }, React.createElement("a", {
    className: "hp-link",
    href: "/articles",
    onClick: e => {
      e.preventDefault();
      go("articles");
    }
  }, "← Back to all articles"))));
}
window.ArticlesIndex = ArticlesIndex;
window.CategoryPage = CategoryPage;
