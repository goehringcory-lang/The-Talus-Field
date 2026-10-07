var TIOGA_BULLETIN_URL = "/bulletin.json?v=18";
var OPENING_HISTORY = [{
  year: "2026",
  date: "May 15",
  note: "The earliest opening since 2015."
}];
var LONG_TERM_AVERAGE = "May 28";
function TiogaStatus() {
  var [row, setRow] = React.useState(null);
  var [edition, setEdition] = React.useState(null);
  React.useEffect(() => {
    var cancelled = false;
    fetch(TIOGA_BULLETIN_URL).then(r => r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))).then(data => {
      if (cancelled || !data) return;
      var areas = Array.isArray(data.areas) ? data.areas : [];
      var tioga = areas.find(a => /tioga/i.test(a.name || ""));
      if (tioga && tioga.chip) setRow(tioga);
      if (data.edition) setEdition(data.edition);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  if (!row) return null;
  var ended = edition && edition.end ? (() => {
    var end = new Date(edition.end + "T00:00:00");
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return !Number.isNaN(end.getTime()) && today > end;
  })() : false;
  return React.createElement("section", {
    className: "fj-status",
    "aria-labelledby": "tg-status-chip"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "Tioga Road right now"), React.createElement("h3", {
    className: "fj-status__chip",
    id: "tg-status-chip"
  }, row.chip), row.note && React.createElement("p", {
    className: "fj-status__note"
  }, row.note), edition && edition.updated && React.createElement("p", {
    className: "fj-status__stamp"
  }, ended ? "Last edition, ended " : "Last checked ", ended ? edition.label : edition.updated));
}
var TIOGA_AXIS_START = {
  month: 4,
  day: 1
};
var TIOGA_AXIS_DAYS = 61;
function tiogaOffset(label) {
  var m = /^(May|June|Jun)\s+(\d{1,2})$/.exec(String(label).trim());
  if (!m) return null;
  var day = parseInt(m[2], 10) + (m[1] === "May" ? 0 : 31) - TIOGA_AXIS_START.day;
  return Math.max(0, Math.min(TIOGA_AXIS_DAYS - 1, day)) / (TIOGA_AXIS_DAYS - 1);
}
var tiogaEdge = x => x < 0.08 ? " is-start" : x > 0.92 ? " is-end" : "";
function TiogaStrip() {
  var avg = tiogaOffset(LONG_TERM_AVERAGE);
  return React.createElement("figure", {
    className: "tg-strip",
    "aria-hidden": "true"
  }, React.createElement("p", {
    className: "hp-eyebrow fj-chart-title"
  }, "Recorded openings, May 1 to June 30"), React.createElement("div", {
    className: "tg-strip__axis"
  }, React.createElement("span", {
    className: "tg-strip__snow"
  }), avg != null && React.createElement("span", {
    className: "tg-strip__avg" + tiogaEdge(avg),
    style: {
      left: `${avg * 100}%`
    }
  }, React.createElement("b", null, LONG_TERM_AVERAGE), React.createElement("small", null, "Long-term average")), OPENING_HISTORY.map((r, i) => {
    var x = tiogaOffset(r.date);
    return x == null ? null : React.createElement("span", {
      key: r.year,
      className: "tg-strip__year" + (i % 2 ? " is-alt" : "") + tiogaEdge(x),
      style: {
        left: `${x * 100}%`
      }
    }, React.createElement("b", null, r.date), React.createElement("small", null, r.year));
  })), React.createElement("div", {
    className: "tg-strip__months"
  }, React.createElement("span", null, "May 1"), React.createElement("span", null, "June 1"), React.createElement("span", null, "June 30")));
}
var TIOGA_STOPS = [{
  name: "Crane Flat",
  ft: 6200,
  mi: 0,
  note: "Last gas, pay at pump",
  x: 145,
  y: 630
}, {
  name: "White Wolf",
  ft: 8000,
  x: 400,
  y: 325
}, {
  name: "Olmsted Point",
  ft: 8400,
  x: 786,
  y: 488
}, {
  name: "Tenaya Lake",
  ft: 8150,
  x: 835,
  y: 425
}, {
  name: "Tuolumne Meadows",
  ft: 8600,
  mi: 39,
  x: 1090,
  y: 320
}, {
  name: "Tioga Pass",
  ft: 9945,
  mi: 47,
  note: "The park's east gate",
  x: 1295,
  y: 192
}, {
  name: "Lee Vining",
  ft: 6800,
  mi: 59,
  note: "Next gas",
  x: 1540,
  y: 95
}];
function TiogaRoadMap() {
  return React.createElement("div", {
    className: "npsmap__frame"
  }, React.createElement("img", {
    src: "/img/nps-tioga-road-map.jpg",
    width: "1600",
    height: "760",
    loading: "lazy",
    decoding: "async",
    alt: "National Park Service map of Tioga Road from Crane Flat in the west, past White Wolf, Olmsted Point, Tenaya Lake and Tuolumne Meadows, to Tioga Pass and Lee Vining in the east."
  }), React.createElement("svg", {
    viewBox: "0 0 1600 760",
    role: "img",
    "aria-label": "Numbered pins on the map, west to east: Crane Flat at 6,200 feet, the last gas; White Wolf at about 8,000 feet; Olmsted Point at about 8,400 feet; Tenaya Lake at 8,150 feet; Tuolumne Meadows at 8,600 feet, 39 miles from Crane Flat; Tioga Pass at 9,945 feet, about 47 miles from Crane Flat; then a drop of more than 3,000 feet in twelve miles to Lee Vining, about 6,800 feet, the next gas."
  }, TIOGA_STOPS.map((t, i) => React.createElement("g", {
    key: t.name
  }, React.createElement("circle", {
    className: "npsmap__pin npsmap__pin--ink",
    cx: t.x,
    cy: t.y,
    r: "26",
    strokeWidth: "6"
  }), React.createElement("text", {
    className: "npsmap__num",
    x: t.x,
    y: t.y + 9,
    textAnchor: "middle",
    style: {
      fontSize: 28
    }
  }, i + 1)))));
}
var TIOGA_FAQ = [["When does Tioga Road open?", "There is no fixed date: the road opens when plow crews finish, and the park announces it only days ahead. The long-term average opening is the end of May; light snow years have opened in mid-May, and heavy years push the opening into June or later. It closes with the first lasting snow, typically in November."], ["Is there gas, food, or water on Tioga Road?", "Crane Flat, at the road's west end, has pay-at-pump gas; the next fuel is Lee Vining on the east side of the pass. In the early season there is no potable water and nothing to buy along the road, and services at Tuolumne Meadows come online weeks after the road opens. Bring everything."], ["How long does it take to drive Tioga Road?", "About 39 miles from Crane Flat to Tuolumne Meadows and about 47 to the Tioga Pass entrance station, roughly 90 minutes one way without stops. With Olmsted Point, Tenaya Lake, and Tuolumne Meadows it is a full day, and adding Lee Vining and Mono Lake makes it a long one."], ["Do I need a reservation to drive Tioga Road?", "A standard park entrance pass is required. Whether a day-use reservation system also applies changes year to year; check the NPS Yosemite site for the current season's rules before you commit."]];
var TIOGA_TOWNS = [{
  id: "lee-vining",
  name: "Lee Vining",
  dest: "Lee Vining, California",
  where: "East side, below the pass",
  note: "The bed that exists in week one. Thirty minutes from Tuolumne Meadows, with gas, food and Mono Lake on the doorstep.",
  tier: "Week one"
}, {
  id: "groveland",
  name: "Groveland",
  dest: "Groveland, California",
  where: "Highway 120 west",
  note: "The western equivalent, on the same highway before the Big Oak Flat entrance. The start of the day if you drive the road west to east.",
  tier: "West side"
}];
function TiogaOpeningPage({
  go
}) {
  var toc = [["#tioga-how", "How it opens"], ["#tioga-week-one", "Week one"], ["#tioga-road", "The road"], ["#tioga-history", "When it opened"], ["#tioga-rules", "Bring everything"], ["#tioga-day", "The day"], ["#tioga-stay", "Where to sleep"], ["#tioga-faq", "Questions"]];
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-tioga-opening"
  }, React.createElement("div", {
    className: "ff-cover tg-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/tenaya-lake.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "Tenaya Lake below the granite domes along Tioga Road",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Tioga opening"
    }],
    eyebrow: "HIGHWAY 120 · TIOGA PASS · LATE SPRING",
    title: "The Tioga Road opening",
    intro: "Every spring, plow crews cut Highway 120 out of the snowpack and the highest road in the park comes back. The opening date is not a date: it is announced only days ahead, it varies by weeks from year to year, and the first weekends are unlike any other time on the road. Below: how the opening works, what is actually open in week one, and how to drive it well.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "tioga_head",
      className: "hp-button",
      href: "#tioga-week-one"
    }, "What is open in week one ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "tioga_head",
      className: "hp-link",
      href: "#tioga-road"
    }, "The road, mile by mile ↓"))
  }, React.createElement(AffiliateDisclosure, null)), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: Michael Hogarth / Wikimedia Commons (public domain)")), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "Opens, on average"), React.createElement("dd", null, LONG_TERM_AVERAGE)), React.createElement("div", null, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("dt", null, "Notice"), React.createElement("dd", null, "Less than a week")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "mountain"
  }), React.createElement("dt", null, "Tioga Pass"), React.createElement("dd", null, "9,945 feet")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "fuel"
  }), React.createElement("dt", null, "No gas"), React.createElement("dd", null, "Crane Flat to Lee Vining"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(HomeLink, {
    key: href,
    go: go,
    location: "tioga_toc",
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "tioga-how",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HOW THE OPENING WORKS"), React.createElement("h2", null, "The road opens when the plowing is done. Full stop."), React.createElement("p", {
    className: "ff-lede"
  }, "Tioga Road closes with the first lasting snow, typically in November, and reopens when the plowing is done. The long-term average opening is the end of May. Light snow years have opened the gate in mid-May; heavy years push the opening into June and beyond."), React.createElement("p", {
    className: "ff-lede"
  }, "The park announces the date only once the crews are nearly through, usually with less than a week's notice, so a trip planned around \"Tioga will be open\" needs a backup plan below 8,000 feet."), React.createElement(NatureNotesFilm, {
    id: "winter-in-tuolumne-meadows",
    title: "Winter in Tuolumne Meadows",
    youtubeId: "tXAL7fPDaJE",
    episode: 37,
    location: "tioga_film",
    note: "What the plows are digging out of: two rangers who ski the high country all winter, at 8,600 feet, while the road is under snow."
  })), React.createElement("div", {
    className: "tg-side"
  }, React.createElement(TiogaStatus, null), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "The date is announced days ahead, not months."), React.createElement("li", null, "Opening day is the road, not the services."), React.createElement("li", null, "Start full at Crane Flat. Carry all the water and food."), React.createElement("li", null, "Expect snow walls, ice at dawn and no signal.")), React.createElement("p", {
    className: "ff-disclosure"
  }, "Current status: ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/seasonal.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "the NPS Tioga Road page ↗"), ", or text \"ynptraffic\" to 333111."))))), React.createElement("section", {
    className: "ff-band",
    id: "tioga-week-one",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "WHAT IS OPEN IN WEEK ONE",
    title: "The road opens first. The meadows follow, weeks later."
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "Opening weekend lives entirely in \"the road is open\", not in \"Tuolumne Meadows is open for the season\". What you get in week one is the road itself: a ribbon of asphalt through snow walls, half-frozen lakes, and a high country still pulling itself out of winter. The store, the grill, the lodge, the campground and the wilderness center staffing come online over the following weeks, on their own schedule."), React.createElement("ol", {
    className: "ff-timeline tg-ladder"
  }, React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "Opening day"), React.createElement("strong", null, "The road"), React.createElement("p", null, "Tioga Road and the Tioga Pass entrance station, Olmsted Point and the major pullouts, Tenaya Lake parking, the Tuolumne Meadows pullouts, vault toilets, and Crane Flat gas, 24 hours, pay at the pump.")), React.createElement("li", {
    className: "is-tight"
  }, React.createElement("span", null, "Late May"), React.createElement("strong", null, "Visitor centers staffed"), React.createElement("p", null, "The Tuolumne Meadows Visitor Center and Wilderness Center have limited or no staffing until late May.")), React.createElement("li", {
    className: "is-tight"
  }, React.createElement("span", null, "June and July"), React.createElement("strong", null, "Lodge, grill, campground"), React.createElement("p", null, "In a recent season the lodge opened in early June, the grill in mid-June, and the campground on July 1, reservable on Recreation.gov.")), React.createElement("li", {
    className: "is-gone"
  }, React.createElement("span", null, "Later in summer"), React.createElement("strong", null, "Store and post office"), React.createElement("p", null, "The last of Tuolumne to come online. Until then there is nothing to buy anywhere along the road."))), React.createElement("ul", {
    className: "tg-never"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "drop"
  }), React.createElement("span", null, React.createElement("strong", null, "No potable water"), " anywhere along the road in week one.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "fuel"
  }), React.createElement("span", null, React.createElement("strong", null, "No gas at Tuolumne Meadows."), " The station has been out of operation for several years.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "signal"
  }), React.createElement("span", null, React.createElement("strong", null, "No cell service"), " from Crane Flat to Lee Vining. Download offline maps in the Valley."))), React.createElement("div", {
    className: "tg-stops"
  }, React.createElement("div", {
    className: "tg-stops__go"
  }, React.createElement("h3", null, "What the first weeks are for"), React.createElement("p", {
    className: "ff-note tg-stops__lede"
  }, "The reliable early stops are the roadside ones. The early season rewards drivers, photographers and modest walkers, not peak-baggers."), React.createElement("ul", null, React.createElement("li", null, React.createElement(EventIcon, {
    name: "eye",
    size: 24
  }), React.createElement("div", null, React.createElement("strong", null, "Olmsted Point"), React.createElement("p", null, "The back side of Half Dome. The half-mile slickrock trail usually dries fast, even with snow in the shaded hollows."))), React.createElement("li", null, React.createElement(EventIcon, {
    name: "lake",
    size: 24
  }), React.createElement("div", null, React.createElement("strong", null, "Tenaya Lake, the east beach"), React.createElement("p", null, "Ice-rimmed, with open water in the middle. A short, easy walk to the sand; an hour is enough."))), React.createElement("li", null, React.createElement(EventIcon, {
    name: "tree",
    size: 24
  }), React.createElement("div", null, React.createElement("strong", null, "Tuolumne Meadows pullouts"), React.createElement("p", null, "Look from the edge. Do not walk across the meadow: a boot print in May is still a scar in August."))), React.createElement("li", null, React.createElement(EventIcon, {
    name: "dome",
    size: 24
  }), React.createElement("div", null, React.createElement("strong", null, "Pothole Dome"), React.createElement("p", null, "A one-mile round trip up polished granite at the meadow's west end. Wet approach, dry rock."))), React.createElement("li", null, React.createElement(EventIcon, {
    name: "walk",
    size: 24
  }), React.createElement("div", null, React.createElement("strong", null, "Soda Springs"), React.createElement("p", null, "1.4 miles round trip on a flat dirt road from the Lembert Dome parking area, with the river running hard."))))), React.createElement("div", {
    className: "tg-stops__wait"
  }, React.createElement("h3", null, "Wait for later"), React.createElement("p", {
    className: "ff-note tg-stops__lede"
  }, "The famous trails above 8,500 feet hold snow weeks longer than the road. Walking them boots-deep is how meadows get scarred and ankles get broken."), React.createElement("ul", null, ["Cathedral Lakes", "May Lake", "Lukens Lake", "Lembert Dome's summit"].map(t => React.createElement("li", {
    key: t
  }, React.createElement(EventIcon, {
    name: "snow",
    size: 20
  }), t))))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "tioga-road",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "THE ROAD, WEST TO EAST",
    title: "From 6,200 feet to 9,945, then down to the desert"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "Tioga Road climbs from Crane Flat to the pass over roughly 47 miles, then drops more than 3,000 feet in twelve miles into the Mono Basin, where granite gives way to sagebrush. Allow about 90 minutes one way without stops. With the stops, it is a full day."), React.createElement("figure", {
    className: "npsmap tg-map"
  }, React.createElement(TiogaRoadMap, null), React.createElement("figcaption", null, TIOGA_STOPS.map((t, i) => React.createElement("span", {
    key: t.name
  }, React.createElement("b", null, i + 1), " ", t.name, ", ", t.ft.toLocaleString("en-US"), " ft", t.mi != null ? t.mi === 0 ? "" : `, mile ${t.mi} from Crane Flat` : "", t.note ? `. ${t.note}` : "")), React.createElement("span", null, "Above about 8,500 feet, trails hold snow for weeks after the road opens. There is no gas, water or cell signal between Crane Flat and Lee Vining. Elevations and distances are the figures on this page and in the opening-weekend article; White Wolf, Olmsted Point and Tenaya Lake are listed in order between the placed stops. Map: National Park Service (public domain), cropped.")))), React.createElement("section", {
    className: "ff-band",
    id: "tioga-history",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHEN IT HAS ACTUALLY OPENED"), React.createElement("h2", null, "The average is the least useful number here"), React.createElement("p", {
    className: "ff-lede"
  }, "The long-term average is ", LONG_TERM_AVERAGE, ", and almost no individual year matches it: the spread between a light year and a heavy one is measured in weeks, not days. These are the openings this journal has recorded."), React.createElement("p", {
    className: "ff-note"
  }, "The National Park Service publishes the full year-by-year list on ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/seasonal.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "its Tioga Road page"), ", which is the source to check for the whole run.")), React.createElement("div", null, React.createElement(TiogaStrip, null), React.createElement("div", {
    className: "prose tg-table",
    role: "region",
    "aria-label": "Recorded Tioga Road openings",
    tabIndex: 0
  }, React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Year"), React.createElement("th", null, "Tioga Road opened"), React.createElement("th", null, "Note"))), React.createElement("tbody", null, OPENING_HISTORY.map(r => React.createElement("tr", {
    key: r.year
  }, React.createElement("td", null, React.createElement("strong", null, r.year)), React.createElement("td", null, r.date), React.createElement("td", null, r.note))), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Average")), React.createElement("td", null, LONG_TERM_AVERAGE), React.createElement("td", null, "The long-term mean, which almost no individual year matches.")))))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "tioga-rules",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE SELF-SUFFICIENCY RULES"), React.createElement("h2", null, "Pack like you are heading into the backcountry")), React.createElement("p", {
    className: "ff-lede"
  }, "Even if you are only driving up for the day. There is nothing to buy along Tioga Road in the first weeks, no potable water, and no signal to call for help with.")), React.createElement("ul", {
    className: "ff-rules tg-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "fuel",
    size: 26
  }), React.createElement("strong", null, "Gas"), React.createElement("p", null, "Crane Flat is the last fuel on the west side, pay at the pump. The next gas is Lee Vining, on the far side of the pass. Start full.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "drop",
    size: 26
  }), React.createElement("strong", null, "Water and food"), React.createElement("p", null, "In the early season there is no potable water and nothing to buy anywhere along the road. Bring all of both: two liters per person minimum if you are walking anywhere.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "therm",
    size: 26
  }), React.createElement("strong", null, "Weather"), React.createElement("p", null, "Early-season mornings run to the 20s and 30s even when the Valley is mild. Black ice forms at dawn and dusk, and afternoon storms build fast.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "signal",
    size: 26
  }), React.createElement("strong", null, "Signal"), React.createElement("p", null, "Cell service is essentially zero from Crane Flat to Lee Vining. Download offline maps before you leave the Valley."))), React.createElement("div", {
    className: "ff-else tg-pack"
  }, React.createElement("h3", null, "In the car and the pack"), React.createElement("ul", null, ["Chains in the trunk and a full tank", "Waterproof hiking boots; every trail has wet or snowy sections", "Microspikes for any shaded snow patch", "Trekking poles for slush, mud and slick granite", "A puffy jacket and a shell; the day swings 30 to 40 degrees", "Sunglasses and sunscreen for snow glare at altitude", "All the water and food for the day", "Offline maps, downloaded in the Valley"].map(k => React.createElement("li", {
    key: k
  }, React.createElement(EventIcon, {
    name: "check",
    size: 18
  }), k))), React.createElement("p", {
    className: "ff-note"
  }, "Bears are out of their dens and active in the meadows at first and last light. Use the trailhead lockers, even for snacks left in the car. The full lists: ", React.createElement(HomeLink, {
    go: go,
    location: "tioga_kit",
    href: "/kit"
  }, "the day pack and car kit"), "."))), React.createElement("section", {
    className: "ff-band",
    id: "tioga-day",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE BIGGER DAY"), React.createElement("h2", null, "Cross the pass"), React.createElement("p", {
    className: "ff-lede"
  }, "The move that turns the opening into a full trip is crossing the pass: down into the Mono Basin, where Mono Lake spreads out below with its tufa towers. Lee Vining, Tioga Lake, Ellery Lake and the South Tufa boardwalk make the east side a destination, not a turnaround."), React.createElement("figure", {
    className: "ff-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/tuolumne-meadows-lembert-dome.jpg",
    alt: "Lembert Dome above the edge of Tuolumne Meadows",
    sizes: "(max-width: 880px) calc(100vw - 40px), 520px"
  }), React.createElement("figcaption", null, "Lembert Dome from Tuolumne Meadows. Photo: Pacific Southwest Region USFWS / Wikimedia Commons (public domain)")), React.createElement("p", {
    className: "ff-note"
  }, "Every stop, where to eat in Lee Vining, and what the meadows look like under snowmelt: ", React.createElement(HomeLink, {
    go: go,
    location: "tioga_article",
    href: "/articles/tioga-road-opening-weekend"
  }, "the opening-weekend field guide"), ". Every turnout from Crane Flat to the pass, and the history under the road: ", React.createElement(HomeLink, {
    go: go,
    location: "tioga_article",
    href: "/articles/tioga-road-stop-by-stop"
  }, "Tioga Road, stop by stop"), ".")), React.createElement("ol", {
    className: "ff-hours"
  }, React.createElement("li", null, React.createElement("span", null, "Before 8 a.m."), React.createElement("p", null, "Through the gate and climbing. Early beats the congestion and the full lots, and sunrise at Olmsted Point is shared with almost no one.")), React.createElement("li", null, React.createElement("span", null, "Olmsted Point"), React.createElement("p", null, "Half Dome's broad back side, Clouds Rest to its left, and glacial erratics scattered on the slickrock. Shoes with grip, and sunglasses.")), React.createElement("li", null, React.createElement("span", null, "Ten minutes east"), React.createElement("p", null, "Tenaya Lake's east beach, ice along the shaded shore and Tenaya Peak in the open water.")), React.createElement("li", null, React.createElement("span", null, "Late morning"), React.createElement("p", null, "Tuolumne Meadows from the pullouts, then Pothole Dome or the flat walk to Soda Springs.")), React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "Tioga Pass, 9,945 feet"), React.createElement("p", null, "Tioga Lake just below the pass with Mount Dana in it, Ellery Lake a mile farther, then the Mono Lake Vista Point as the basin opens.")), React.createElement("li", null, React.createElement("span", null, "Afternoon"), React.createElement("p", null, "Lunch in Lee Vining, then south on 395 to the South Tufa boardwalk, about ten miles all told. Nesting California gulls in May.")), React.createElement("li", null, React.createElement("span", null, "The drive home"), React.createElement("p", null, "Back over the pass before dark, or a bed on the east side. Black ice returns at dusk."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "tioga-stay",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "WHERE YOU SLEEP IN WEEK ONE",
    title: "The high country's own beds may not exist yet"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "Tuolumne Meadows Lodge and White Wolf open on the snowpack's schedule, often well after the road does, so the high country's own beds may not be open when the pass is. Sleep at one end of the road and drive it toward the other."), React.createElement("div", {
    className: "ff-towns tg-towns"
  }, TIOGA_TOWNS.map(t => React.createElement("div", {
    className: "ff-town",
    key: t.id
  }, React.createElement("div", {
    className: "ff-town__name"
  }, React.createElement("h3", null, t.name), React.createElement("p", null, React.createElement("strong", null, t.where))), React.createElement("div", {
    className: "ff-town__note"
  }, React.createElement("span", {
    className: "ff-tier"
  }, t.tier), React.createElement("p", null, t.note)), React.createElement(AvailabilityLink, {
    destination: t.dest,
    list: "page_tioga",
    slug: t.id,
    className: "ff-book"
  }, "Search ", t.name, " lodging ↗"))), React.createElement("p", {
    className: "ff-note"
  }, "The filled buttons search availability on Expedia; we may earn a commission. The recommendation is the same either way, and no link is to a specific property. ", React.createElement("a", {
    href: "/affiliate"
  }, "How we handle affiliate links."), " Every option compared: ", React.createElement(HomeLink, {
    go: go,
    location: "tioga_stay",
    href: "/stay"
  }, "where to stay"), "."))), React.createElement("section", {
    className: "ff-band",
    id: "tioga-faq",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Tioga Road questions, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "The week's park-wide picture, roads, closures and hours, is on ", React.createElement(HomeLink, {
    go: go,
    location: "tioga_faq",
    href: "/now"
  }, "the Park Bulletin"), ", and live webcams and forecasts are on ", React.createElement(HomeLink, {
    go: go,
    location: "tioga_faq",
    href: "/conditions"
  }, "the conditions page"), ". Road conditions by phone or text: text \"ynptraffic\" to 333111.")), React.createElement("div", {
    className: "ff-faq"
  }, TIOGA_FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement(HpGuideBand, {
    go: go,
    location: "tioga-opening",
    title: "Planning the high-country trip around it?",
    intro: "The Field Guide app carries the Tioga Road stops with parking notes, offline maps for the stretch with no signal, and a day-by-day planner for the rest of the trip.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "ROAD ALERTS / FREE",
    title: "Email me the day it opens",
    heading: "Email me the day it opens",
    blurb: "One email the day the park announces Tioga Road is open, and one when it closes for the season, sent to the people who asked for it. Sunday Field Notes carries the plowing progress in between.",
    location: "tioga-opening",
    tag: "alert-tioga",
    cta: "Email me ↗",
    terms: "Only when Tioga Road opens or closes. Unsubscribe whenever.",
    stamp: "ROAD ALERTS",
    paper: React.createElement(React.Fragment, null, "Tioga opens.", React.createElement("br", null), "Tioga closes.", React.createElement("br", null), React.createElement("em", null, "You hear once."))
  }));
}
window.TiogaOpeningPage = TiogaOpeningPage;
