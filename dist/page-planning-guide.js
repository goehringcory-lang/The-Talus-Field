var {
  useState: useStatePg,
  useRef: useRefPg,
  useEffect: useEffectPg
} = React;
var PLANNING_PARTS = [{
  part: "Part One · Before you book",
  eyebrow: "Part one",
  title: "Before you book",
  blurb: "When, where to base, smoke season.",
  lede: "The decisions you make from your kitchen table, before the trip starts, are the ones that shape the whole experience. When you visit, where you base, whether the park is in smoke season. Read these before you put money down."
}, {
  part: "Part Two · Getting there and getting in",
  eyebrow: "Part two",
  title: "Getting there and getting in",
  blurb: "Entrances, parking, buses, permits.",
  lede: "Five entrances, four highways, one seasonal pass that does not exist half the year, three parking lots that decide how the day goes, two bus systems that make the lots optional, and a permit system guarding the 95 percent of the park most visitors never see."
}, {
  part: "Part Three · When you arrive",
  eyebrow: "Part three",
  title: "When you arrive",
  blurb: "The car, the kids, the dog, no bookings.",
  lede: "What is in the car, who you are traveling with, whether everyone in your group can hike, and what you can still get today if you arrived with nothing booked."
}, {
  part: "Part Four · If you're hiking Half Dome",
  eyebrow: "Part four",
  title: "If you're hiking Half Dome",
  blurb: "The lottery, the cables, the Mist Trail.",
  lede: "Half Dome requires a permit lottery that most applicants do not win, and the standard approach is the Mist Trail. What the cables, the lottery, and the wet granite actually demand, and the better hike most visitors do not know about."
}, {
  part: "Part Five · The seasonal calendar",
  eyebrow: "Part five",
  title: "The seasonal calendar",
  blurb: "Roads, falls, smoke, the Milky Way.",
  lede: "Tioga Road opens, Glacier Point opens, the waterfalls peak and then dry, smoke comes in from somewhere else, and the Milky Way arrives. Knowing what is open and when changes the trip entirely."
}];
function planningPartSlugs(partLabel) {
  var entry = (window.PLANNING_SERIES || []).find(s => s.part === partLabel);
  return entry ? entry.slugs : [];
}
var PG_MONTH_EXTRA = [{
  photo: "img/half-dome-winter-snow.jpg",
  alt: "Half Dome under winter snow",
  credit: "Photo: George Fiske / Wikimedia Commons (public domain)",
  falls: "Running low",
  fallsLine: "Winter flow. A storm can wake them for a day or two."
}, {
  photo: "img/horsetail-fall-firefall-glow.jpg",
  alt: "Horsetail Fall glowing at sunset on El Capitan",
  credit: "Photo: Barney Moss / Wikimedia Commons (CC BY 2.0)",
  falls: "Low, and Horsetail",
  fallsLine: "Horsetail Fall can glow at sunset in the second half of the month, if it has water and the western sky is clear."
}, {
  photo: "img/yosemite-valley-winter-wall.jpg",
  alt: "A granite wall of Yosemite Valley dusted with late-winter snow",
  credit: "Photo: Ahmed Radwan / Wikimedia Commons (CC0)",
  falls: "Starting to wake",
  fallsLine: "First runoff. Flow builds with every warm week."
}, {
  photo: "img/yosemite-falls-spring-blossoms-cory-goehring.jpg",
  alt: "Yosemite Falls behind spring blossoms on the Valley floor",
  credit: "Photo: Cory Goehring",
  falls: "Building by the week",
  fallsLine: "Full falls against half of summer's crowds."
}, {
  photo: "img/nevada-fall-liberty-cap-ryan-oconnor.jpg",
  alt: "Nevada Fall below Liberty Cap at spring flow",
  credit: "Photo: Ryan O'Connor / Unsplash",
  falls: "Peak flow",
  fallsLine: "The month the falls are loudest. The Mist Trail earns its name."
}, {
  photo: "img/half-dome-meadow-deer-johannes-andersson.jpg",
  alt: "A deer grazing a green meadow below Half Dome in early summer",
  credit: "Photo: Johannes Andersson / Unsplash",
  falls: "Strong, then easing",
  fallsLine: "Strong at the start of the month, thinning by the end."
}, {
  photo: "img/tenaya-lake.jpg",
  alt: "Tenaya Lake and granite domes along Tioga Road in summer",
  credit: "Photo: Michael Hogarth / Wikimedia Commons (public domain)",
  falls: "Thinning",
  fallsLine: "The big falls thin. Go up high, where the water is lakes."
}, {
  photo: "img/milky-way-sentinel-dome.jpg",
  alt: "The Milky Way over Sentinel Dome on a dark August night",
  credit: "Photo: Jackhen1992 / Wikimedia Commons (CC BY-SA 4.0)",
  falls: "A trickle",
  fallsLine: "Trade the falls for the darkest skies of the year."
}, {
  photo: "img/lyell-canyon.jpg",
  alt: "Lyell Canyon in the Tuolumne high country",
  credit: "Photo: mypubliclands / Wikimedia Commons (public domain)",
  falls: "At their lowest",
  fallsLine: "The year's low water. The high country is the draw."
}, {
  photo: "img/tunnel-view-autumn-aniket-deole.jpg",
  alt: "Tunnel View in autumn light",
  credit: "Photo: Aniket Deole / Unsplash",
  falls: "Low",
  fallsLine: "Low until the first real storms, possible late in the month."
}, {
  photo: "img/half-dome-valley-vista.jpg",
  alt: "Half Dome above a quiet Yosemite Valley in November",
  credit: "Photo: Cam DiCecca / Wikimedia Commons (CC0)",
  falls: "Low",
  fallsLine: "Short days and empty trails. Snow most years."
}, {
  photo: "img/half-dome-alpenglow-madhu-shesharam.jpg",
  alt: "Winter alpenglow on Half Dome at dusk",
  credit: "Photo: Madhu Shesharam / Unsplash",
  falls: "Low, until storms",
  fallsLine: "Snow when storms land, and chains in the car as a rule."
}];
var PG_GLACIER = ["Closed for the season. It reopens once plowing is done, usually in May.", "Closed for the season. It reopens once plowing is done, usually in May.", "Closed for the season. It reopens once plowing is done, usually in May.", "Closed for the season. It reopens once plowing is done, usually in May.", "Usually opens in May once plowing is done. Chains can still be required in the first weeks.", "Open. The only drive to Glacier Point, and day two of the two-day plan.", "Open. The only drive to Glacier Point, and day two of the two-day plan.", "Open. The only drive to Glacier Point, and day two of the two-day plan.", "Open. The only drive to Glacier Point, and day two of the two-day plan.", "Open. Go before the first storms that close it.", "Closed for the season with the snow.", "Closed for the season with the snow."];
var PG_TIOGA = ["Closed. Late May to mid-June is the usual opening range.", "Closed. Late May to mid-June is the usual opening range.", "Closed. Late May to mid-June is the usual opening range.", "Closed most years. Late May to mid-June is the usual opening range.", "Opens late May in some years, announced a day or two ahead.", "Open in most years by mid-June. The park posts plowing progress weekly.", "Open, with Tuolumne's shuttle and store running.", "Open, with Tuolumne's shuttle and store running.", "Open. Tuolumne's services close after mid-September: a day up high is self-supported.", "Open until the first storm that sticks. No services in Tuolumne.", "Closes with the first storm that sticks, usually in November.", "Closed for the season."];
var PG_HALFDOME = [["Cables down", "No permit is issued for a day outside the cables season."], ["Cables down", "No permit is issued for a day outside the cables season."], ["Lottery open", "Cables are down, but the preseason lottery for summer dates runs March 1 to 31."], ["Cables down", "Preseason results arrive by email in mid-April."], ["Cables up late May", "They go up the Friday before Memorial Day. Daily lottery two days ahead."], ["Cables up", "Daily lottery: apply two days ahead, midnight to 4 p.m. Pacific."], ["Cables up", "Daily lottery: apply two days ahead, midnight to 4 p.m. Pacific."], ["Cables up", "Daily lottery: apply two days ahead, midnight to 4 p.m. Pacific."], ["Cables up", "Daily lottery: apply two days ahead, midnight to 4 p.m. Pacific."], ["Cables up to mid-month", "Down the day after the second Monday in October."], ["Cables down", "No permit is issued for a day outside the cables season."], ["Cables down", "No permit is issued for a day outside the cables season."]];
var PG_WALK = ["Walk in", "No shuttle. The Washburn Trail is 2 miles and 500 feet up to the trees."];
var PG_SHUTTLE = ["Shuttle running", "Free from the Welcome Plaza to the grove."];
var PG_GROVE = [PG_WALK, PG_WALK, PG_WALK, ["Walk in to mid-April", "No shuttle until mid-April. The Washburn Trail is 2 miles and 500 feet up."], PG_SHUTTLE, PG_SHUTTLE, PG_SHUTTLE, PG_SHUTTLE, PG_SHUTTLE, PG_SHUTTLE, ["Shuttle, 8 to 3:30", "Reduced November service from the Welcome Plaza."], PG_WALK];
function pgParkMonthIndex() {
  try {
    return Number(new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      month: "numeric"
    }).format(new Date())) - 1;
  } catch (e) {
    return new Date().getMonth();
  }
}
function pgInitialMonth() {
  var months = window.TRIP_MONTHS || [];
  try {
    var stored = JSON.parse(window.safeStorage.get("tfg.trip.selector", "null") || "null");
    var i = stored && stored.when ? months.findIndex(m => m.key === stored.when) : -1;
    if (i >= 0) return i;
  } catch (e) {}
  return pgParkMonthIndex();
}
function pgMonth(i) {
  var months = window.TRIP_MONTHS;
  var m = months[i];
  return Object.assign({}, m, PG_MONTH_EXTRA[i], {
    glacierLine: PG_GLACIER[i],
    tiogaLine: PG_TIOGA[i],
    halfdome: PG_HALFDOME[i],
    grove: PG_GROVE[i],
    campBy: months[(i + 8) % 12].name + " 15",
    campEarly: months[(i + 7) % 12].name + " 15"
  });
}
var PG_STATUS = {
  open: {
    label: "Typically open",
    color: "var(--pg-open)"
  },
  closed: {
    label: "Closed",
    color: "var(--pg-closed)"
  },
  unsettled: {
    label: "Opening, not yet certain",
    color: "var(--pg-warn)"
  }
};
var PG_SEARCH_PLACES = [{
  id: "mariposa",
  dest: "Mariposa, California"
}, {
  id: "el-portal",
  dest: "El Portal, California"
}, {
  id: "groveland",
  dest: "Groveland, California"
}, {
  id: "oakhurst",
  dest: "Oakhurst, California"
}, {
  id: "park",
  dest: "Yosemite National Park"
}];
var PG_TOWNS = [{
  id: "el-portal",
  name: "El Portal",
  dest: "El Portal, California",
  road: "Highway 140 · year-round",
  drive: "25 to 35 min",
  bar: 29,
  photo: "img/el-portal-yosemite-valley-railroad-cars.jpg",
  alt: "Yosemite Valley Railroad cars at El Portal",
  credit: "Yosemite Park & Curry Co. / Wikimedia Commons (public domain)",
  line: "The closest beds outside the gate, on the river road that stays low all winter."
}, {
  id: "mariposa",
  name: "Mariposa",
  dest: "Mariposa, California",
  road: "Highway 140 · year-round",
  drive: "45 to 60 min",
  bar: 50,
  photo: "img/mariposa-county-courthouse.jpg",
  alt: "The 1854 Mariposa County Courthouse",
  credit: "Guywelch2000 / Wikimedia Commons (CC0)",
  line: "A real town with restaurants and the most rooms, on the corridor that rarely takes chains."
}, {
  id: "groveland",
  name: "Groveland",
  dest: "Groveland, California",
  road: "Highway 120 · chains common in winter",
  drive: "65 to 80 min",
  bar: 67,
  photo: "img/groveland-main-street-highway-120.jpg",
  alt: "Main Street in Groveland, which is Highway 120",
  credit: "Almonroth / Wikimedia Commons (CC BY-SA 3.0)",
  line: "Hetch Hetchy, the Tuolumne side, and Bay Area arrivals. Easier last-minute rooms in shoulder season."
}, {
  id: "oakhurst",
  name: "Oakhurst",
  dest: "Oakhurst, California",
  road: "Highway 41 · year-round",
  drive: "75 to 90 min · 20 to the Grove",
  bar: 75,
  photo: "img/oakhurst-highway-41-ken-lund.jpg",
  alt: "Highway 41 through downtown Oakhurst, with Deadwood Mountain behind",
  credit: "Ken Lund / Wikimedia Commons (CC BY-SA 2.0)",
  line: "The base for the Mariposa Grove and Glacier Point, with the Valley a longer day away."
}];
var PG_TRAVEL_YOSEMITE = "https://www.travelyosemite.com/lodging/";
var PG_IN_PARK = [{
  badge: "Top pick · a first trip",
  name: "Yosemite Valley Lodge",
  line: "Mid-range, and the best value for its location in the park."
}, {
  badge: "Cheapest roof in the Valley",
  name: "Curry Village",
  line: "Tent cabins and cabins below Glacier Point. Reduced in winter."
}, {
  badge: "The splurge",
  name: "The Ahwahnee",
  line: "The most expensive bed in the park, several times the Lodge rate."
}];
function pgIsoToday() {
  var d = new Date();
  var p = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function PgStaySearch() {
  var [place, setPlace] = useStatePg("mariposa");
  var [checkin, setCheckin] = useStatePg("");
  var [checkout, setCheckout] = useStatePg("");
  var [adults, setAdults] = useStatePg("2");
  var row = PG_SEARCH_PLACES.find(p => p.id === place) || PG_SEARCH_PLACES[0];
  var dated = !!(checkin && checkout && checkout > checkin);
  var url = window.expediaSearchUrl(row.dest) + "&adults=" + adults;
  if (dated) url += "&startDate=" + checkin + "&endDate=" + checkout + "&d1=" + checkin + "&d2=" + checkout;
  var search = {
    href: window.buildAffiliateLink ? window.buildAffiliateLink("expedia", url) : url
  };
  var today = pgIsoToday();
  return React.createElement("form", {
    className: "pg-search",
    onSubmit: e => e.preventDefault()
  }, React.createElement("label", {
    className: "pg-field pg-field--where"
  }, React.createElement("span", null, "Where"), React.createElement("select", {
    value: place,
    onChange: e => setPlace(e.target.value)
  }, PG_SEARCH_PLACES.map(p => React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.dest)))), React.createElement("label", {
    className: "pg-field"
  }, React.createElement("span", null, "Check in"), React.createElement("input", {
    type: "date",
    value: checkin,
    min: today,
    onChange: e => setCheckin(e.target.value)
  })), React.createElement("label", {
    className: "pg-field"
  }, React.createElement("span", null, "Check out"), React.createElement("input", {
    type: "date",
    value: checkout,
    min: checkin || today,
    onChange: e => setCheckout(e.target.value)
  })), React.createElement("label", {
    className: "pg-field pg-field--guests"
  }, React.createElement("span", null, "Guests"), React.createElement("select", {
    value: adults,
    onChange: e => setAdults(e.target.value)
  }, ["1", "2", "3", "4", "5", "6"].map(n => React.createElement("option", {
    key: n,
    value: n
  }, n, " ", n === "1" ? "adult" : "adults")))), React.createElement("a", {
    className: "aff-link pg-btn pg-btn--accent pg-search__go",
    href: search.href,
    target: "_blank",
    rel: "sponsored noopener",
    "data-aff-network": "expedia",
    "data-aff-list": "planning_search",
    "data-aff-item-slug": row.id,
    "data-aff-name": row.dest + " lodging search"
  }, "Search stays on Expedia ↗"));
}
function PgStatusText({
  state,
  className
}) {
  var s = PG_STATUS[state] || PG_STATUS.open;
  return React.createElement("p", {
    className: className,
    style: {
      color: s.color
    }
  }, s.label);
}
function PgAreaBadge({
  state,
  month,
  always
}) {
  if (always) return React.createElement("span", {
    className: "pg-badge pg-badge--ink"
  }, always);
  if (state === "closed") return React.createElement("span", {
    className: "pg-badge pg-badge--closed"
  }, "Road closed in ", month);
  if (state === "unsettled") return React.createElement("span", {
    className: "pg-badge pg-badge--warn"
  }, "Opening in ", month, ", some years");
  return React.createElement("span", {
    className: "pg-badge pg-badge--open"
  }, "Reachable in ", month);
}
var PG_TIOGA_LINE = "-10,290 40,215 110,165 180,158 300,165 318,230 360,262 405,276 470,258 520,228 565,205 610,160 650,125 700,110 760,110 790,117";
var PG_GLACIER_LINE = "42,701 85,638 183,652 239,659 296,631 310,581 313,504";
function PgCornersMap({
  month,
  tioga,
  glacier
}) {
  var road = (points, state) => React.createElement(React.Fragment, null, React.createElement("polyline", {
    points: points,
    className: "pg-map__road",
    style: {
      stroke: PG_STATUS[state].color
    }
  }), state === "closed" && React.createElement("polyline", {
    points: points,
    className: "pg-map__road-gap"
  }));
  var label = (x, y, w, text) => React.createElement("g", null, React.createElement("rect", {
    x: x,
    y: y,
    width: w,
    height: "60",
    rx: "30",
    className: "pg-map__tag"
  }), React.createElement("text", {
    x: x + 26,
    y: y + 40,
    className: "pg-map__tag-text"
  }, text));
  return React.createElement("div", {
    className: "pg-map"
  }, React.createElement("p", {
    className: "pg-kicker"
  }, "The four corners · roads in ", month), React.createElement("div", {
    className: "pg-map__frame"
  }, React.createElement(ResponsiveImage, {
    image: "img/nps-yosemite-four-corners-map.jpg",
    alt: "The official National Park Service map of Yosemite, cropped from Tuolumne Meadows south to the Mariposa Grove",
    sizes: "(max-width: 760px) 100vw, 440px",
    className: "pg-map__img"
  }), React.createElement("svg", {
    viewBox: "0 0 980 1200",
    role: "img",
    "aria-label": "Markers for Yosemite Valley, Glacier Point, the Mariposa Grove and Tuolumne Meadows, with Tioga Road and Glacier Point Road highlighted"
  }, road(PG_TIOGA_LINE, tioga), road(PG_GLACIER_LINE, glacier), React.createElement("circle", {
    cx: "282",
    cy: "455",
    r: "17",
    className: "pg-map__pin"
  }), React.createElement("circle", {
    cx: "313",
    cy: "504",
    r: "17",
    className: "pg-map__pin"
  }), React.createElement("circle", {
    cx: "225",
    cy: "1116",
    r: "17",
    className: "pg-map__pin"
  }), React.createElement("circle", {
    cx: "788",
    cy: "117",
    r: "17",
    className: "pg-map__pin"
  }), label(18, 330, 440, "1 · Yosemite Valley, the hub"), label(345, 530, 420, "2 · Glacier Point · 60 min"), label(262, 1080, 440, "3 · Mariposa Grove · 75 min"), label(470, 150, 500, "4 · Tuolumne Meadows · 90 min"))), React.createElement("div", {
    className: "pg-map__key"
  }, React.createElement("span", null, React.createElement("i", {
    style: {
      background: "var(--pg-open)"
    }
  }), "Seasonal road, open"), React.createElement("span", null, React.createElement("i", {
    style: {
      background: "var(--pg-closed)"
    }
  }), "Closed"), React.createElement("span", null, React.createElement("i", {
    style: {
      background: "var(--pg-warn)"
    }
  }), "Opening, uncertain")), React.createElement("p", {
    className: "pg-note"
  }, "Map: National Park Service (public domain). Drive times from the Valley, from the park's own table, one way, no traffic."));
}
var PG_AREAS = [{
  key: "valley",
  num: "01",
  kicker: "The hub · 4,000 ft",
  name: "Yosemite Valley",
  always: "Open all year",
  photo: "img/lower-yosemite-fall-footbridge.jpg",
  alt: "Lower Yosemite Fall from the footbridge",
  credit: "James St. John / Wikimedia Commons (CC BY 2.0)",
  body: "The valley floor and the walls around it: El Capitan, the falls, the meadows, the Mist Trail, most of the beds. Park once and ride the free shuttle.",
  give: "Give it: a full day, minimum"
}, {
  key: "glacier",
  num: "02",
  kicker: "The south rim · 7,214 ft",
  name: "Glacier Point",
  road: "glacier",
  photo: "img/half-dome-sunset-glacier-point-joshua-earle.jpg",
  alt: "Half Dome at sunset from Glacier Point",
  credit: "Joshua Earle / Unsplash",
  body: "The view that looks back down on everything you walked the day before: Half Dome, Nevada and Vernal Falls, the whole Valley. Taft Point and Sentinel Dome on the way.",
  give: "Give it: a half day, sunset if you can"
}, {
  key: "grove",
  num: "03",
  kicker: "The giant sequoias · South Entrance",
  name: "Mariposa Grove",
  always: "Hwy 41 open all year",
  photo: "img/mariposa-grove-grizzly-giant-nieves.jpg",
  alt: "The Grizzly Giant in the Mariposa Grove",
  credit: "Nieves / Pexels",
  body: "Five hundred giant sequoias, the Grizzly Giant among them, just inside the South Entrance. Pairs with Glacier Point on the same drive, or with a night in Oakhurst.",
  give: "Give it: three hours, with the walk"
}, {
  key: "tuolumne",
  num: "04",
  kicker: "The high country · 8,600 ft",
  name: "Tuolumne Meadows",
  road: "tioga",
  photo: "img/tenaya-lake.jpg",
  alt: "Tenaya Lake on Tioga Road",
  credit: "Michael Hogarth / Wikimedia Commons (public domain)",
  body: "Granite domes, subalpine lakes, a meadow the size of a town, and half the crowd. A different park, reached only on Tioga Road.",
  give: "Give it: a full day, west to east"
}];
var PG_COMPARE = [["Seasons, permits, lodging and trail articles", true, true, true], ["Road openings and booking windows, by email", false, true, "trip board"], ["A map of the main destinations", false, "31 pins", true], ["3D topographic map of the whole park, offline", false, false, true], ["44 stops in driving order, with parking and timing notes", false, false, true], ["57 day hikes with GPS tracks", false, false, true], ["This week's ranger and interpretive programs, by day and area", false, false, true], ["A day-by-day planner for your own trip", false, false, true], ["50 Secret Guide entries, beyond the obvious", false, false, true]];
function PgCell({
  value,
  product
}) {
  var cls = product ? "pg-compare__product" : undefined;
  if (value === false) return React.createElement("td", {
    className: cls
  }, React.createElement("span", {
    className: "pg-no",
    "aria-label": "Not included"
  }));
  return React.createElement("td", {
    className: cls
  }, React.createElement("span", {
    className: "pg-yes",
    "aria-label": "Included"
  }, "✓"), typeof value === "string" && React.createElement("span", {
    className: "pg-yes__note"
  }, " ", value));
}
function PlanningGuide({
  go
}) {
  var filters = window.useIntentFilters();
  var resultsRef = useRefPg(null);
  var [jumped, setJumped] = useStatePg(false);
  var [monthIndex, setMonthIndex] = useStatePg(pgInitialMonth);
  var [planDone, setPlanDone] = useStatePg(false);
  var [openPart, setOpenPart] = useStatePg(null);
  var [showFilters, setShowFilters] = useStatePg(false);
  var matches = window.filterArticlesByIntent(window.ARTICLES, filters.value);
  var filtering = filters.count > 0;
  var listing = filtering || filters.browse;
  var filtersOpen = showFilters || listing;
  var sel = pgMonth(monthIndex);
  var tioga = sel.tioga;
  var glacier = sel.glacier;
  useEffectPg(() => {
    if (!jumped) return;
    setJumped(false);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (resultsRef.current) resultsRef.current.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start"
    });
  }, [jumped]);
  var applyIntent = intent => {
    filters.apply(intent);
    setShowFilters(true);
    setJumped(true);
  };
  var togglePart = i => {
    if (window.track) window.track("cta_click", {
      location: "planning_index",
      target: `#part-${i + 1}`
    });
    setOpenPart(cur => cur === i ? null : i);
  };
  var part = openPart == null ? null : PLANNING_PARTS[openPart];
  var partItems = part ? planningPartSlugs(part.part).map(s => window.findArticle(s)).filter(Boolean) : [];
  return React.createElement("div", {
    className: "page hp-design hp-planning"
  }, React.createElement("section", {
    className: "hp-wrap pg-hero"
  }, React.createElement("div", {
    className: "pg-hero__copy"
  }, React.createElement("p", {
    className: "pg-crumbs"
  }, React.createElement("a", {
    href: "/",
    onClick: e => {
      e.preventDefault();
      go("home");
    }
  }, "Home"), " \xA0/\xA0 The Planning Guide"), React.createElement("p", {
    className: "pg-eyebrow"
  }, "The Planning Guide"), React.createElement("h1", {
    className: "pg-hero__title"
  }, "Yosemite,", React.createElement("br", null), "planned ", React.createElement("em", null, "properly.")), React.createElement("p", {
    className: "pg-hero__intro"
  }, "Four decisions, in the order the park makes you take them: when you go, which of its four corners you can reach, where you sleep, and what you do each day. Twenty minutes here saves a day of driving there."), React.createElement("div", {
    className: "pg-actions"
  }, React.createElement(HomeLink, {
    go: go,
    location: "planning_hero",
    className: "pg-btn pg-btn--ink",
    href: "#step-1"
  }, "Start with your month \xA0↓"), React.createElement(HomeLink, {
    go: go,
    location: "planning_hero",
    className: "pg-btn pg-btn--ghost",
    href: "#guide"
  }, "See the Field Guide · $3.99")), React.createElement("p", {
    className: "aff-disclosure pg-hero__aff"
  }, "Some links on this page are affiliate links. ", React.createElement("a", {
    href: "/affiliate"
  }, "How we choose them"), ".")), React.createElement("figure", {
    className: "pg-hero__figure"
  }, React.createElement(ResponsiveImage, {
    image: "img/tunnel-view-valley-spring.jpg",
    alt: "Tunnel View in spring: El Capitan, Bridalveil Fall and Half Dome above the Valley",
    sizes: "(max-width: 760px) 100vw, 680px",
    eager: true,
    className: "pg-hero__img"
  }), React.createElement("div", {
    className: "pg-steps"
  }, React.createElement("p", {
    className: "pg-kicker"
  }, "Your plan, in four steps"), React.createElement("ol", null, [["01", "Visit", "Your month sets the roads", "#step-1"], ["02", "Where", "The four corners", "#step-2"], ["03", "Sleep", "In the park or a gateway", "#step-3"], ["04", "Each day", "A plan, then the app", "#step-4"]].map(([n, t, d, href]) => React.createElement("li", {
    key: n
  }, React.createElement(HomeLink, {
    go: go,
    location: "planning_steps",
    href: href
  }, React.createElement("span", {
    className: "pg-stepnum"
  }, n), React.createElement("strong", null, t), React.createElement("span", null, d)))))), React.createElement("figcaption", {
    className: "pg-credit pg-credit--corner"
  }, "Kyle D / Wikimedia Commons (public domain)"))), React.createElement("section", {
    className: "pg-month",
    id: "step-1",
    tabIndex: -1
  }, React.createElement("div", {
    className: "pg-month__bg",
    "aria-hidden": "true"
  }, React.createElement(ResponsiveImage, {
    key: sel.photo,
    image: sel.photo,
    alt: "",
    sizes: "100vw",
    className: "pg-month__img"
  })), React.createElement("div", {
    className: "hp-wrap pg-month__inner"
  }, React.createElement("div", {
    className: "pg-head"
  }, React.createElement("div", null, React.createElement("p", {
    className: "pg-eyebrow pg-eyebrow--gold"
  }, "Step 01 · When are you going"), React.createElement("h2", {
    className: "pg-h2"
  }, "The month decides the park.")), React.createElement("p", {
    className: "pg-sub"
  }, "Two roads open and close with the snow, and they are the only way to two of the park's four corners. Pick your month and the rest of this page redraws around it.")), React.createElement("div", {
    className: "pg-months",
    role: "group",
    "aria-label": "Choose your month"
  }, window.TRIP_MONTHS.map((m, i) => React.createElement("button", {
    key: m.key,
    type: "button",
    className: "pg-monthbtn" + (i === monthIndex ? " is-on" : ""),
    "aria-pressed": i === monthIndex,
    onClick: () => setMonthIndex(i)
  }, m.label))), React.createElement("div", {
    className: "pg-month__row"
  }, React.createElement("div", {
    className: "pg-month__note"
  }, React.createElement("p", {
    className: "pg-eyebrow pg-eyebrow--gold"
  }, sel.name, " in Yosemite"), React.createElement("p", {
    className: "pg-month__lede"
  }, sel.note), React.createElement("a", {
    href: `/articles/${sel.read}`
  }, "Read the ", sel.name, " guide ↗")), React.createElement("div", {
    className: "pg-road"
  }, React.createElement("p", {
    className: "pg-kicker"
  }, "Glacier Point Road"), React.createElement(PgStatusText, {
    state: glacier,
    className: "pg-road__state"
  }), React.createElement("p", {
    className: "pg-road__line"
  }, sel.glacierLine)), React.createElement("div", {
    className: "pg-road"
  }, React.createElement("p", {
    className: "pg-kicker"
  }, "Tioga Road"), React.createElement(PgStatusText, {
    state: tioga,
    className: "pg-road__state"
  }), React.createElement("p", {
    className: "pg-road__line"
  }, sel.tiogaLine))), React.createElement("div", {
    className: "pg-facts"
  }, React.createElement("div", {
    className: "pg-fact"
  }, React.createElement("p", {
    className: "pg-fact__k"
  }, "Waterfalls"), React.createElement("p", {
    className: "pg-fact__v"
  }, sel.falls), React.createElement("p", {
    className: "pg-fact__d"
  }, sel.fallsLine)), React.createElement("div", {
    className: "pg-fact"
  }, React.createElement("p", {
    className: "pg-fact__k"
  }, "Half Dome"), React.createElement("p", {
    className: "pg-fact__v"
  }, sel.halfdome[0]), React.createElement("p", {
    className: "pg-fact__d"
  }, sel.halfdome[1])), React.createElement("div", {
    className: "pg-fact"
  }, React.createElement("p", {
    className: "pg-fact__k"
  }, "Mariposa Grove"), React.createElement("p", {
    className: "pg-fact__v"
  }, sel.grove[0]), React.createElement("p", {
    className: "pg-fact__d"
  }, sel.grove[1])), React.createElement("div", {
    className: "pg-fact"
  }, React.createElement("p", {
    className: "pg-fact__k"
  }, "Valley campsites"), React.createElement("p", {
    className: "pg-fact__v"
  }, "Book ", sel.campBy), React.createElement("p", {
    className: "pg-fact__d"
  }, "The Pines, Wawona and Hodgdon Meadow open at 7 a.m. Pacific for arrivals from the 15th. Arriving before the 15th? ", sel.campEarly, "."))), React.createElement("div", {
    className: "pg-month__foot"
  }, React.createElement("p", null, "Typical years only. For this week's status, ", React.createElement("a", {
    href: "/now"
  }, "the Park Bulletin"), " and ", React.createElement("a", {
    href: "/conditions#road-alerts"
  }, "road alerts by email"), ". Every deadline on ", React.createElement("a", {
    href: "/dates"
  }, "the dates page"), "."), React.createElement("p", {
    className: "pg-month__credit"
  }, sel.credit)))), React.createElement("section", {
    className: "pg-sand",
    id: "step-2",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap pg-section"
  }, React.createElement("div", {
    className: "pg-head"
  }, React.createElement("div", null, React.createElement("p", {
    className: "pg-eyebrow"
  }, "Step 02 · Where in the park"), React.createElement("h2", {
    className: "pg-h2"
  }, "One park, four places.", React.createElement("br", null), "Pick two, not four.")), React.createElement("p", {
    className: "pg-sub"
  }, "Yosemite is the size of Rhode Island and the corners are hours apart. Most frustrating trips try to see all of them in a day. Here is what each one is, how far it sits from the Valley, and whether your month can reach it.")), React.createElement("div", {
    className: "pg-corners"
  }, React.createElement(PgCornersMap, {
    month: sel.name,
    tioga: tioga,
    glacier: glacier
  }), React.createElement("div", {
    className: "pg-areas"
  }, PG_AREAS.map(a => React.createElement("article", {
    key: a.key,
    className: "pg-area"
  }, React.createElement("div", {
    className: "pg-area__media"
  }, React.createElement(ResponsiveImage, {
    image: a.photo,
    alt: a.alt,
    sizes: "(max-width: 760px) 92px, 400px",
    className: "pg-area__img"
  }), React.createElement(PgAreaBadge, {
    always: a.always,
    month: sel.name,
    state: a.road === "glacier" ? glacier : a.road === "tioga" ? tioga : "open"
  }), React.createElement("span", {
    className: "pg-credit pg-credit--corner"
  }, a.credit)), React.createElement("div", {
    className: "pg-area__body"
  }, React.createElement("p", {
    className: "pg-kicker"
  }, a.num, " · ", a.kicker), React.createElement("h3", null, a.name), React.createElement("p", {
    className: "pg-area__text"
  }, a.body), React.createElement("p", {
    className: "pg-area__give"
  }, a.give)))))), React.createElement("div", {
    className: "pg-ad"
  }, React.createElement("div", {
    className: "pg-ad__copy"
  }, React.createElement("p", {
    className: "pg-eyebrow pg-eyebrow--gold"
  }, "Inside the Field Guide · the 3D map"), React.createElement("h3", null, "See all four corners in 3D, on the real terrain."), React.createElement("p", null, "Tilt the park, then drop into it. Every viewpoint, trailhead, day hike and parking lot sits on the actual relief, with the trails colored by difficulty. Download a region before you leave and it all works with no signal."), React.createElement("div", {
    className: "pg-actions"
  }, React.createElement(HomeLink, {
    go: go,
    location: "planning_map_ad",
    className: "pg-btn pg-btn--light",
    href: "/guide"
  }, "Get the Field Guide \xA0", React.createElement("span", {
    className: "pg-price"
  }, "$3.99")), React.createElement("span", {
    className: "pg-ad__note"
  }, "Actual screens · Yosemite Valley, looking east"))), React.createElement("div", {
    className: "pg-ad__media"
  }, React.createElement("img", {
    src: "/img/guide/screens/map-3d-valley.v5.webp",
    alt: "The Field Guide's 3D map looking east up Yosemite Valley, with stop pins, Northside and Southside Drives, the Merced River and trails colored by difficulty",
    width: "1600",
    height: "663",
    loading: "lazy",
    decoding: "async",
    className: "pg-ad__wide"
  }), React.createElement("div", {
    className: "pg-ad__phone"
  }, React.createElement("img", {
    src: "/img/guide/screens/map-3d-phone.v5.webp",
    alt: "The same 3D map on a phone",
    width: "640",
    height: "1387",
    loading: "lazy",
    decoding: "async"
  })), React.createElement("span", {
    className: "pg-ad__tag"
  }, "3D · works offline"))), React.createElement("p", {
    className: "pg-note pg-note--body"
  }, "A fifth corner, Hetch Hetchy, has its own entrance and day-use hours. Open year-round and nearly empty. ", React.createElement("a", {
    href: "/articles/hetch-hetchy-the-other-yosemite-valley"
  }, "Read about Hetch Hetchy"), "."))), React.createElement("section", {
    className: "hp-wrap pg-section",
    id: "step-3",
    tabIndex: -1
  }, React.createElement("div", {
    className: "pg-head"
  }, React.createElement("div", null, React.createElement("p", {
    className: "pg-eyebrow"
  }, "Step 03 · Where you sleep"), React.createElement("h2", {
    className: "pg-h2"
  }, "Your bed sets your drive.")), React.createElement("p", {
    className: "pg-sub"
  }, "This is the booking with the earliest deadline. In-park beds open 366 days ahead and gateway rooms fill six to twelve months out for summer dates. Everything else in this guide flexes; this does not.")), React.createElement(PgStaySearch, null), React.createElement("div", {
    className: "pg-towns"
  }, React.createElement("div", {
    className: "pg-towns__head"
  }, React.createElement("h3", null, "Outside the gate: the gateway towns"), React.createElement("span", null, "Drive to the Valley floor, one way")), React.createElement("div", {
    className: "pg-towns__grid"
  }, PG_TOWNS.map(t => React.createElement("article", {
    key: t.id,
    className: "pg-town"
  }, React.createElement("figure", {
    className: "pg-town__media"
  }, React.createElement(ResponsiveImage, {
    image: t.photo,
    alt: t.alt,
    sizes: "(max-width: 760px) 100vw, 320px",
    className: "pg-town__img"
  }), React.createElement("figcaption", {
    className: "pg-credit pg-credit--corner"
  }, t.credit)), React.createElement("div", {
    className: "pg-town__body"
  }, React.createElement("h4", null, t.name), React.createElement("p", {
    className: "pg-town__road"
  }, t.road), React.createElement("div", {
    className: "pg-town__bar",
    "aria-hidden": "true"
  }, React.createElement("span", {
    style: {
      width: t.bar + "%"
    }
  })), React.createElement("p", {
    className: "pg-town__drive"
  }, t.drive), React.createElement("p", {
    className: "pg-town__line"
  }, t.line), React.createElement(AvailabilityLink, {
    destination: t.dest,
    list: "planning_town",
    slug: t.id,
    name: t.name + " lodging search",
    className: "pg-btn pg-btn--accent pg-town__go"
  }, "Search ", t.name, " ↗")))))), React.createElement("div", {
    className: "pg-inpark"
  }, React.createElement("figure", {
    className: "pg-inpark__media"
  }, React.createElement(ResponsiveImage, {
    image: "img/curry-village.jpg",
    alt: "Tent cabins at Curry Village",
    sizes: "(max-width: 760px) 100vw, 420px",
    className: "pg-inpark__img"
  }), React.createElement("figcaption", null, React.createElement("p", {
    className: "pg-inpark__title"
  }, "Inside the gate"), React.createElement("p", null, "Booked through the park's concessioner, never a third party."))), React.createElement("div", {
    className: "pg-inpark__list"
  }, PG_IN_PARK.map(p => React.createElement("div", {
    key: p.name,
    className: "pg-inpark__row"
  }, React.createElement("div", null, React.createElement("p", {
    className: "pg-inpark__badge"
  }, p.badge), React.createElement("p", {
    className: "pg-inpark__name"
  }, p.name)), React.createElement("p", {
    className: "pg-inpark__line"
  }, p.line), React.createElement("a", {
    className: "pg-btn pg-btn--ghost",
    href: PG_TRAVEL_YOSEMITE,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Check dates ↗"))), React.createElement("div", {
    className: "pg-inpark__foot"
  }, React.createElement("p", null, "Gone for your dates? Mariposa and El Portal hold the most rooms within an hour. ", React.createElement(AvailabilityLink, {
    destination: "Mariposa, California",
    list: "planning_in_park",
    slug: "mariposa",
    name: "Mariposa lodging search"
  }, "Search them ↗")), React.createElement("a", {
    href: "/stay",
    onClick: e => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      go("stay");
    }
  }, "The full lodging board →")))), React.createElement("p", {
    className: "pg-note"
  }, "Filled buttons search Expedia, and we may earn a commission at no cost to you. It never changes what we recommend: ", React.createElement("a", {
    href: "/affiliate"
  }, "the affiliate policy"), ".")), React.createElement("section", {
    className: "pg-sand",
    id: "step-4",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap pg-section"
  }, React.createElement("div", {
    className: "pg-head"
  }, React.createElement("div", null, React.createElement("p", {
    className: "pg-eyebrow"
  }, "Step 04 · What you do each day"), React.createElement("h2", {
    className: "pg-h2"
  }, "Five questions. One plan.")), React.createElement("p", {
    className: "pg-sub"
  }, "Answer all five and the page hands back a day-by-day route capped to what your month's roads allow, the five articles worth reading first, and when to be through the gate.")), React.createElement("div", {
    className: "pg-plan" + (planDone ? " is-done" : ""),
    id: "trip-selector"
  }, React.createElement("div", {
    className: "pg-plan__selector"
  }, React.createElement(window.TripSelector, {
    go: go,
    onApplyIntent: applyIntent,
    onComplete: setPlanDone
  })), !planDone && React.createElement("div", {
    className: "pg-plan__preview"
  }, React.createElement("div", {
    className: "pg-plan__top"
  }, React.createElement("p", {
    className: "pg-eyebrow"
  }, "Your plan"), React.createElement("span", null, sel.name, " · 2 days · first trip · views")), React.createElement("h3", null, "The Valley, then the rim"), React.createElement("div", {
    className: "pg-plan__days"
  }, React.createElement("div", null, React.createElement("span", {
    className: "pg-stepnum"
  }, "Day 1"), React.createElement("div", null, React.createElement("strong", null, "Yosemite Valley, west to east"), React.createElement("p", null, "Tunnel View, Bridalveil, the meadows, Lower Yosemite Fall. Park once."))), React.createElement("div", null, React.createElement("span", {
    className: "pg-stepnum"
  }, "Day 2"), React.createElement("div", null, React.createElement("strong", null, "Glacier Point Road, in trailhead order"), glacier === "closed" ? React.createElement("p", {
    className: "pg-plan__closed"
  }, "Glacier Point Road is closed in ", sel.name, ". Your second day stays on the Valley floor.") : React.createElement("p", null, "Taft Point, Sentinel Dome, then Glacier Point for the last light.")))), React.createElement("p", {
    className: "pg-plan__arrive"
  }, React.createElement("strong", null, "When to arrive."), " ", sel.arrive), React.createElement("div", {
    className: "pg-plan__upsell"
  }, React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true"
  }, React.createElement("rect", {
    x: "5",
    y: "10",
    width: "14",
    height: "10",
    rx: "2"
  }), React.createElement("path", {
    d: "M8 10 V7 a4 4 0 0 1 8 0 V10"
  })), React.createElement("div", null, React.createElement("p", {
    className: "pg-plan__upsell-t"
  }, "Where to park for each stop, which trailhead lot fills first, and the ranger programs on your dates."), React.createElement("p", {
    className: "pg-plan__upsell-d"
  }, "This plan opens in the Field Guide, stop by stop, on the 3D map.")), React.createElement(HomeLink, {
    go: go,
    location: "planning_plan",
    className: "pg-btn pg-btn--accent",
    href: "/guide"
  }, "Take it into the park · $3.99")))))), React.createElement("section", {
    className: "hp-wrap pg-section pg-compare",
    id: "compare"
  }, React.createElement("div", {
    className: "pg-center"
  }, React.createElement("p", {
    className: "pg-eyebrow"
  }, "Three ways to plan with us"), React.createElement("h2", {
    className: "pg-h2"
  }, "Read it free. Carry it for $3.99."), React.createElement("p", {
    className: "pg-sub"
  }, "Everything above stays free. The Field Guide is for the part of the trip that happens in the car, on the trail, and out of signal.")), React.createElement("div", {
    className: "pg-ways"
  }, React.createElement("div", {
    className: "pg-way"
  }, React.createElement("p", {
    className: "pg-eyebrow pg-eyebrow--muted"
  }, "Free"), React.createElement("h3", null, "The Planning Guide"), React.createElement("p", null, "This page and the articles behind it: seasons, permits, lodging, trails, getting in."), React.createElement(HomeLink, {
    go: go,
    location: "planning_compare",
    className: "pg-btn pg-btn--ghost",
    href: "#reading"
  }, "Keep reading ↓")), React.createElement("div", {
    className: "pg-way"
  }, React.createElement("p", {
    className: "pg-eyebrow pg-eyebrow--muted"
  }, "Free, with your email"), React.createElement("h3", null, "The Sunday Letter + the trip map"), React.createElement("p", null, "One email a week with road openings and reservation windows. Signing up unlocks the trip-planning map: 31 destinations to pin, a route you can share."), React.createElement(HomeLink, {
    go: go,
    location: "planning_compare",
    className: "pg-btn pg-btn--ghost",
    href: "#letter"
  }, "Sign up, unlock the map ↓")), React.createElement("div", {
    className: "pg-way pg-way--product"
  }, React.createElement("span", {
    className: "pg-way__flag"
  }, "For the trip itself"), React.createElement("p", {
    className: "pg-eyebrow"
  }, "$3.99 once · 18 months"), React.createElement("h3", null, "The Field Guide app"), React.createElement("p", null, "The whole park on a 3D topographic map, every stop with its parking, every hike with a GPS track, the week's ranger programs, all of it offline."), React.createElement(HomeLink, {
    go: go,
    location: "planning_compare",
    className: "pg-btn pg-btn--accent",
    href: "/guide"
  }, "Get the Field Guide · $3.99"))), React.createElement("div", {
    className: "pg-compare__scroll"
  }, React.createElement("table", {
    className: "pg-compare__table"
  }, React.createElement("caption", null, "What each one gives you"), React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, React.createElement("span", {
    className: "pg-vh"
  }, "Feature")), React.createElement("th", {
    scope: "col"
  }, "Planning Guide"), React.createElement("th", {
    scope: "col"
  }, "Letter + map"), React.createElement("th", {
    scope: "col",
    className: "pg-compare__product-h"
  }, "Field Guide"))), React.createElement("tbody", null, PG_COMPARE.map(([label, a, b, c]) => React.createElement("tr", {
    key: label
  }, React.createElement("th", {
    scope: "row"
  }, label), React.createElement(PgCell, {
    value: a
  }), React.createElement(PgCell, {
    value: b
  }), React.createElement(PgCell, {
    value: c,
    product: true
  }))), React.createElement("tr", {
    className: "pg-compare__price"
  }, React.createElement("th", {
    scope: "row"
  }, "Price"), React.createElement("td", null, "Free"), React.createElement("td", null, "Free"), React.createElement("td", {
    className: "pg-compare__product"
  }, "$3.99 once")))))), React.createElement("section", {
    className: "pg-guide",
    id: "guide",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap pg-guide__grid"
  }, React.createElement("div", {
    className: "pg-guide__copy"
  }, React.createElement("p", {
    className: "pg-eyebrow pg-eyebrow--gold"
  }, "The Talus Field Guide · the offline app"), React.createElement("h2", {
    className: "pg-h2"
  }, "This page is the plan.", React.createElement("br", null), "The app is the trip."), React.createElement("p", {
    className: "pg-guide__intro"
  }, "Most of the park has no signal. The Field Guide downloads before you leave and carries all four corners in your pocket: which lot to aim for, which hike fits the afternoon you have left, and what the rangers are leading tonight."), React.createElement("ul", null, React.createElement("li", null, React.createElement("span", null, "◭"), React.createElement("div", null, React.createElement("strong", null, "The park in 3D."), React.createElement("p", null, "Topographic terrain you can tilt, with every stop, trailhead and lot on it."))), React.createElement("li", null, React.createElement("span", null, "↳"), React.createElement("div", null, React.createElement("strong", null, "Find your next stop."), React.createElement("p", null, "44 stops, arranged in driving order, each with where to park."))), React.createElement("li", null, React.createElement("span", null, "⌁"), React.createElement("div", null, React.createElement("strong", null, "Choose a hike that fits your day."), React.createElement("p", null, "57 day hikes with GPS tracks."))), React.createElement("li", null, React.createElement("span", null, "◎"), React.createElement("div", null, React.createElement("strong", null, "Know what's on tonight."), React.createElement("p", null, "Ranger walks, talks and campfire programs, filtered to your day and area.")))), React.createElement("div", {
    className: "pg-actions"
  }, React.createElement(HomeLink, {
    go: go,
    location: "planning_hub",
    className: "pg-btn pg-btn--light pg-btn--big",
    href: "/guide"
  }, "Get the Field Guide \xA0", React.createElement("span", {
    className: "pg-price"
  }, "$3.99 ↗")), React.createElement("a", {
    className: "pg-guide__sample",
    href: `${GUIDE_PROMO_APP_BASE}/preview`,
    onClick: () => {
      if (window.track) window.track("guide_sample_click", {
        location: "planning_hub"
      });
    }
  }, "Read five entries free ↗")), React.createElement("p", {
    className: "pg-guide__terms"
  }, "One payment · 18 months of access · 30-day guarantee · works offline")), React.createElement("div", {
    className: "pg-guide__screens"
  }, React.createElement("div", {
    className: "pg-phone pg-phone--left"
  }, React.createElement("img", {
    src: "/img/guide/screens/programs.v7.webp",
    alt: "Field Guide programs screen",
    width: "640",
    height: "1385",
    loading: "lazy",
    decoding: "async"
  })), React.createElement("div", {
    className: "pg-phone pg-phone--mid"
  }, React.createElement("img", {
    src: "/img/guide/screens/region-plan.v7.webp",
    alt: "Field Guide region planner screen",
    width: "640",
    height: "1385",
    loading: "lazy",
    decoding: "async"
  })), React.createElement("div", {
    className: "pg-phone pg-phone--right"
  }, React.createElement("img", {
    src: "/img/guide/screens/stop.v7.webp",
    alt: "Field Guide stop screen with parking notes",
    width: "640",
    height: "1385",
    loading: "lazy",
    decoding: "async"
  })), React.createElement("div", {
    className: "pg-guide__offline"
  }, "✓ \xA0All set. Even off the grid.", React.createElement("small", null, "Your guide works offline"))))), React.createElement("section", {
    className: "hp-wrap pg-section pg-reading",
    id: "reading",
    tabIndex: -1
  }, React.createElement("div", {
    className: "pg-head"
  }, React.createElement("div", null, React.createElement("p", {
    className: "pg-eyebrow"
  }, "Go deeper · the reading guide"), React.createElement("h2", {
    className: "pg-h2"
  }, "Read it in the order the trip happens.")), React.createElement("button", {
    type: "button",
    className: "pg-textbtn",
    "aria-expanded": filtersOpen,
    onClick: () => {
      if (listing) filters.clear();
      setShowFilters(!filtersOpen);
    }
  }, filtersOpen ? "Close the filters ↑" : "Or filter every entry by who and what →")), React.createElement("div", {
    className: "pg-parts"
  }, PLANNING_PARTS.map((p, i) => {
    var n = planningPartSlugs(p.part).length;
    return React.createElement("button", {
      key: p.part,
      type: "button",
      className: "pg-part" + (openPart === i ? " is-open" : ""),
      "aria-expanded": openPart === i,
      "aria-controls": "pg-part-panel",
      onClick: () => togglePart(i)
    }, React.createElement("span", {
      className: "pg-stepnum"
    }, p.eyebrow), React.createElement("strong", null, p.title), React.createElement("span", {
      className: "pg-part__blurb"
    }, p.blurb), React.createElement("span", {
      className: "pg-part__n"
    }, n, " ", n === 1 ? "entry" : "entries", " ", openPart === i ? "↑" : "→"));
  })), part && React.createElement("div", {
    className: "pg-part__panel",
    id: "pg-part-panel"
  }, React.createElement("p", {
    className: "pg-sub"
  }, part.lede), React.createElement("div", {
    className: "hp-journal-grid"
  }, partItems.map(a => React.createElement(HpArticleCard, {
    key: a.slug,
    article: a,
    go: go,
    location: "planning_part"
  })))), filtersOpen && React.createElement("div", {
    className: "pg-filters",
    ref: resultsRef
  }, React.createElement(window.IntentFilters, {
    articles: window.ARTICLES,
    value: filters.value,
    onToggle: filters.toggle,
    onClear: filters.clear,
    onClearMonth: filters.clearMonth,
    onToggleBrowse: filters.toggleBrowse,
    browse: filters.browse,
    count: filters.count,
    resultCount: matches.length,
    note: "Drawn from every article, not only the five parts."
  }), listing && (matches.length > 0 ? React.createElement("div", {
    className: "hp-journal-grid pg-filters__results"
  }, matches.map(a => React.createElement(HpArticleCard, {
    key: a.slug,
    article: a,
    go: go,
    location: "planning_list"
  }))) : React.createElement("p", {
    className: "hp-sub pg-filters__empty"
  }, "Nothing in the archive carries all of those at once", window.intentMonthOf(filters.value) ? `, in ${window.intentMonthLabel(window.intentMonthOf(filters.value))}` : "", ". Drop a filter and try again, or", " ", React.createElement("a", {
    href: "/search",
    onClick: e => {
      e.preventDefault();
      go("search");
    }
  }, "search the whole site"), ".")))), React.createElement("section", {
    className: "hp-wrap pg-letter-wrap",
    id: "letter",
    tabIndex: -1
  }, React.createElement("div", {
    className: "pg-letter"
  }, React.createElement("div", {
    className: "pg-letter__copy"
  }, React.createElement("p", {
    className: "pg-eyebrow"
  }, "Not ready for the app? Start free."), React.createElement(NewsletterInline, {
    heading: "Get the Sunday Letter. Unlock the trip map.",
    blurb: "One Yosemite email a week: road openings, reservation windows, what's booked out, while you plan. Signing up opens the trip-planning map, 31 destinations you can pin into a route and share.",
    location: "planning_hub",
    tag: "planning",
    inputLabel: "Email address",
    cta: "Subscribe and open the map",
    modifier: "pg-nl"
  }), React.createElement("p", {
    className: "pg-note"
  }, "Free. One email a week. Unsubscribe in one click.")), React.createElement("div", {
    className: "pg-letter__map",
    "aria-hidden": "true"
  }, React.createElement(ResponsiveImage, {
    image: "img/nps-yosemite-valley-map.jpg",
    alt: "",
    sizes: "(max-width: 760px) 100vw, 560px",
    className: "pg-letter__img"
  }), React.createElement("div", {
    className: "pg-letter__lock"
  }, React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none"
  }, React.createElement("rect", {
    x: "5",
    y: "10",
    width: "14",
    height: "10",
    rx: "2"
  }), React.createElement("path", {
    d: "M8 10 V7 a4 4 0 0 1 8 0 V10"
  })), React.createElement("span", null, "The trip map opens when you subscribe"))))));
}
window.PlanningGuide = PlanningGuide;
