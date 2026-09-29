var {
  useState,
  useMemo,
  useCallback,
  useRef: useRefC,
  useLayoutEffect: useLayoutEffectC
} = React;
var CONDITIONS_FORECASTS = [{
  label: "Wawona",
  elevationFt: 4000,
  note: "The south end of the park, near Mariposa Grove.",
  lat: 37.5341,
  lon: -119.6315
}, {
  label: "Yosemite Valley",
  elevationFt: 4000,
  note: "The floor: most lodging, most trailheads, most of your walking.",
  lat: 37.7456,
  lon: -119.5936
}, {
  label: "Tuolumne Meadows",
  elevationFt: 8600,
  note: "The high country runs 15 to 25 degrees colder than the Valley.",
  lat: 37.8731,
  lon: -119.3503
}];
var CONDITIONS_TIOGA_FT = 9945;
var CONDITIONS_MAP_PINS = [{
  x: 594,
  y: 1762
}, {
  x: 541,
  y: 1263
}, {
  x: 1193,
  y: 846
}];
var CONDITIONS_MAP_PASS = {
  x: 1395,
  y: 752
};
var CONDITIONS_ELEV_WIDE_MIN = 900;
function conditionsForecastUrl(f) {
  return `https://forecast.weather.gov/MapClick.php?lat=${f.lat}&lon=${f.lon}`;
}
function conditionsCoords(f) {
  return `${f.lat.toFixed(2)}° N · ${Math.abs(f.lon).toFixed(2)}° W`;
}
function ConditionsElevation() {
  var ref = useRefC(null);
  var [width, setWidth] = useState(() => typeof window === "undefined" ? 1136 : Math.min(1280, Math.max(280, window.innerWidth - 64)));
  useLayoutEffectC(() => {
    var el = ref.current;
    if (!el) return undefined;
    var read = () => {
      var w = Math.round(el.getBoundingClientRect().width);
      if (w > 0) setWidth(w);
    };
    read();
    if (typeof ResizeObserver === "function") {
      var ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  var mode = width >= CONDITIONS_ELEV_WIDE_MIN ? "wide" : "compact";
  var riseFt = CONDITIONS_FORECASTS[2].elevationFt - CONDITIONS_FORECASTS[0].elevationFt;
  var summary = `The park map with the three forecast points marked: ${CONDITIONS_FORECASTS.map((f, i) => `${i + 1}, ${f.label} at ${f.elevationFt.toLocaleString("en-US")} feet`).join("; ")}. ` + `Tioga Pass tops the road at ${CONDITIONS_TIOGA_FT.toLocaleString("en-US")} feet.`;
  return React.createElement("div", {
    className: `elev elev--${mode}`,
    ref: ref
  }, React.createElement("figure", {
    className: "npsmap"
  }, React.createElement("div", {
    className: "npsmap__frame"
  }, React.createElement(ResponsiveImage, {
    image: "img/nps-yosemite-park-map.jpg",
    alt: "The National Park Service's official map of Yosemite National Park.",
    sizes: "(max-width: 760px) 100vw, 720px"
  }), React.createElement("svg", {
    viewBox: "0 0 1920 1970",
    role: "img",
    "aria-label": summary
  }, CONDITIONS_MAP_PINS.map((pt, i) => React.createElement("g", {
    key: CONDITIONS_FORECASTS[i].label
  }, React.createElement("circle", {
    className: `npsmap__pin ${CONDITIONS_FORECASTS[i].elevationFt >= 6000 ? "npsmap__pin--rust" : "npsmap__pin--ink"}`,
    cx: pt.x,
    cy: pt.y,
    r: "38",
    strokeWidth: "8"
  }), React.createElement("text", {
    className: "npsmap__num",
    x: pt.x,
    y: pt.y + 16,
    textAnchor: "middle",
    style: {
      fontSize: 44
    }
  }, i + 1))), React.createElement("path", {
    className: "npsmap__pin npsmap__pin--ink",
    d: `M ${CONDITIONS_MAP_PASS.x} ${CONDITIONS_MAP_PASS.y - 40} L ${CONDITIONS_MAP_PASS.x + 40} ${CONDITIONS_MAP_PASS.y + 30} L ${CONDITIONS_MAP_PASS.x - 40} ${CONDITIONS_MAP_PASS.y + 30} Z`,
    strokeWidth: "8",
    strokeLinejoin: "round"
  }))), React.createElement("figcaption", null, CONDITIONS_FORECASTS.map((f, i) => React.createElement("span", {
    key: f.label
  }, React.createElement("b", null, i + 1), " ", f.label, ", ", f.elevationFt.toLocaleString("en-US"), " ft")), React.createElement("span", null, "▲ Tioga Pass, ", CONDITIONS_TIOGA_FT.toLocaleString("en-US"), " ft, the top of the road. Tuolumne Meadows sits ", riseFt.toLocaleString("en-US"), " ft above the Wawona and Valley stations. Map: National Park Service (public domain)."))), React.createElement("div", {
    className: "elev__cards"
  }, CONDITIONS_FORECASTS.map((f, i) => {
    var hi = f.elevationFt >= 6000;
    return React.createElement("article", {
      key: f.label,
      className: `fc${hi ? " fc--high" : ""}`
    }, React.createElement("div", {
      className: "fc__meta"
    }, React.createElement("span", {
      className: "fc__num"
    }, "0", i + 1), React.createElement("span", {
      className: "fc__coords"
    }, conditionsCoords(f))), React.createElement("div", {
      className: "fc__head"
    }, React.createElement("h3", {
      className: "fc__name"
    }, f.label), React.createElement("div", {
      className: "fc__elev"
    }, React.createElement("span", {
      className: "fc__ft"
    }, f.elevationFt.toLocaleString("en-US")), React.createElement("span", {
      className: "fc__unit"
    }, "ft"))), React.createElement("p", {
      className: "fc__note"
    }, f.note), React.createElement("a", {
      className: "fc__link",
      href: conditionsForecastUrl(f),
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Point forecast", React.createElement("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 12 12",
      "aria-hidden": "true"
    }, React.createElement("path", {
      d: "M3 9 L9 3 M4.5 3 H9 V7.5"
    }))));
  })));
}
function ConditionsReadout({
  waits,
  lots
}) {
  var today = useMemo(() => {
    try {
      return new Date().toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long"
      });
    } catch (e) {
      return "";
    }
  }, []);
  var rows = [];
  if (waits && waits.longest) {
    rows.push({
      key: "waits",
      label: "Longest gate wait",
      value: waits.longest.text,
      detail: waits.longest.name,
      tone: waits.longest.tone
    });
  }
  if (lots && lots.total) {
    rows.push({
      key: "lots",
      label: "Lots open",
      value: `${lots.open} of ${lots.total}`,
      detail: lots.open === 0 ? "All full" : null,
      tone: lots.open === 0 ? "long" : "good"
    });
  }
  return React.createElement("aside", {
    className: "readout",
    "aria-label": "Live readings"
  }, React.createElement("div", {
    className: "readout__top"
  }, React.createElement("span", {
    className: "eyebrow readout__eyebrow"
  }, "Live readings"), React.createElement("span", {
    className: "readout__pulse"
  }, React.createElement("span", {
    className: "readout__dot",
    "aria-hidden": "true"
  }), "Now")), today && React.createElement("div", {
    className: "readout__date"
  }, today), rows.length ? React.createElement("ul", {
    className: "readout__list"
  }, rows.map(row => React.createElement("li", {
    key: row.key,
    className: "readout__row"
  }, React.createElement("span", {
    className: "readout__label"
  }, row.label, row.detail && React.createElement("span", {
    className: "readout__detail"
  }, row.detail)), React.createElement("span", {
    className: `readout__value readout__value--${row.tone}`
  }, row.value)))) : React.createElement("p", {
    className: "readout__quiet"
  }, "No live numbers from the park right now. Everything below still links straight to the park's own pages."), React.createElement("p", {
    className: "readout__foot"
  }, "National Park Service. Both readings refresh every five minutes."));
}
var COND_SEASON_KIT = [{
  id: "winter",
  months: [12, 1, 2, 3],
  label: "Winter",
  items: [{
    id: "traction",
    what: "Traction cleats for your boots",
    why: "They prevent the most common winter injury in the park, a fall on a paved path."
  }, {
    id: "chains",
    what: "Chains in the trunk",
    why: "When chain control is posted, every vehicle must carry them, four-wheel drives and rentals included."
  }, {
    id: "insulated-jacket",
    what: "An insulated jacket",
    why: "Synthetic fill keeps working if the snow is wet.",
    q: "insulated jacket"
  }, {
    id: "warm-hat",
    what: "A warm hat",
    why: "The cheapest fix for a cold evening.",
    q: "beanie"
  }]
}, {
  id: "spring",
  months: [4, 5],
  label: "Spring",
  items: [{
    id: "rain-shell",
    what: "A rain jacket",
    why: "In May and June it keeps you warm on the Mist Trail, where the spray is heaviest.",
    q: "rain jacket"
  }, {
    id: "puffy",
    what: "A puffy for the high roads",
    why: "When Tioga opens, temperatures swing 30 to 40 degrees between dawn and afternoon.",
    q: "insulated jacket"
  }, {
    id: "boots",
    what: "Waterproof boots",
    why: "High trails stay wet, muddy, or partly snow-covered into early summer."
  }]
}, {
  id: "summer",
  months: [6, 7, 8, 9],
  label: "Summer",
  items: [{
    id: "sun-hat",
    what: "A wide-brim sun hat",
    why: "Granite reflects. A baseball cap is not enough above 7,000 feet.",
    q: "sun hat"
  }, {
    id: "sun-shirt",
    what: "A long-sleeve sun shirt",
    why: "Light color, hood if you can find it. Wear it even in heat.",
    q: "sun hoody"
  }, {
    id: "rain-shell",
    what: "A packable rain shell",
    why: "Afternoon thunderstorms are common in the summer high country.",
    q: "rain jacket"
  }, {
    id: "water",
    what: "Water, more than you think",
    why: "Two liters a person is a floor at elevation. The Four Mile and Yosemite Falls trails have none."
  }]
}, {
  id: "autumn",
  months: [10, 11],
  label: "Autumn",
  items: [{
    id: "fleece",
    what: "A warm layer",
    why: "High points run 15 to 20 degrees cooler than the Valley floor, and windier.",
    q: "fleece"
  }, {
    id: "headlamp",
    what: "A headlamp",
    why: "The days shorten fast; a hike that finished at dusk in September finishes in the dark."
  }, {
    id: "chains",
    what: "Chains, from late October",
    why: "Storms are possible from late October, and chain control means every vehicle carries them."
  }]
}];
function condParkMonth() {
  try {
    return Number(new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      month: "numeric"
    }).format(new Date()));
  } catch (_e) {
    return new Date().getMonth() + 1;
  }
}
function CondSeasonKit() {
  var month = condParkMonth();
  var season = COND_SEASON_KIT.find(x => x.months.indexOf(month) !== -1) || COND_SEASON_KIT[2];
  return React.createElement("div", {
    className: "cond-kit"
  }, React.createElement(RecommendedCard, {
    heading: "What " + season.label.toLowerCase() + " calls for",
    note: "Dress for the highest point of your day, not the Valley floor.",
    items: season.items,
    list: "conditions_season_kit",
    slug: season.id
  }));
}
function ConditionsPage({
  go
}) {
  var [waits, setWaits] = useState(null);
  var [lots, setLots] = useState(null);
  var onWaits = useCallback(digest => setWaits(digest), []);
  var onLots = useCallback(digest => setLots(digest), []);
  return React.createElement("div", {
    className: "page hp-design hp-conditions"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Conditions"
    }],
    eyebrow: "CONDITIONS / LIVE FROM THE PARK",
    title: React.createElement(React.Fragment, null, "The park,", React.createElement("br", null), React.createElement("em", null, "right now.")),
    intro: "Live webcams, entrance waits, and the forecasts that matter, on one page. Check it the morning you drive in, not the week before. Roads and crowds change faster than your plans do.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "conditions_hero",
      className: "hp-button",
      href: "#cond-waits"
    }, "Entrance waits \xA0 ↓"), React.createElement(HomeLink, {
      go: go,
      location: "conditions_hero",
      className: "hp-link",
      href: "#cond-roads"
    }, "Roads and closures ↓")),
    aside: React.createElement(ConditionsReadout, {
      waits: waits,
      lots: lots
    })
  }, React.createElement(AffiliateDisclosure, null, "The seasonal gear list under the forecasts has Patagonia affiliate links. If you buy through one, The Talus Field may earn a commission at no extra cost to you.")), React.createElement("section", {
    className: "hp-wrap hp-section cond-section",
    id: "cond-waits",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    go: go,
    location: "conditions",
    eyebrow: "01 / AT THE GATES",
    title: "Entrance waits",
    link: {
      href: "/planning",
      label: "Why the mornings matter ↗"
    }
  }), React.createElement("p", {
    className: "hp-sub"
  }, "Live wait estimates from the National Park Service, refreshed every few minutes. Summer mornings the arch at Highway 140 backs up first; by ten, all of them do. If the numbers below are already climbing at eight, you wanted to be inside an hour ago."), React.createElement(EntranceWaits, {
    variant: "board",
    onData: onWaits
  })), React.createElement("section", {
    className: "hp-wrap hp-section cond-section"
  }, React.createElement(HpHeading, {
    go: go,
    location: "conditions",
    eyebrow: "02 / SEE IT FOR YOURSELF",
    title: "Webcams",
    link: {
      href: "/webcams",
      label: "All cameras, and how to read them ↗"
    }
  }), React.createElement(WebcamStrip, {
    variant: "board"
  })), React.createElement("section", {
    className: "hp-wrap hp-section cond-section"
  }, React.createElement(HpHeading, {
    go: go,
    location: "conditions",
    eyebrow: "03 / THREE ELEVATIONS",
    title: "Forecasts",
    link: {
      href: "https://www.weather.gov/hnx/",
      label: "National Weather Service ↗"
    }
  }), React.createElement("p", {
    className: "hp-sub"
  }, "The park spans 9,000 feet of elevation, so one forecast is never enough. These are National Weather Service point forecasts for the three places most trips actually go."), React.createElement(ConditionsElevation, null), React.createElement(CondSeasonKit, null)), React.createElement("div", {
    className: "hp-wrap hp-section cond-section cond-split"
  }, React.createElement("section", null, React.createElement(HpHeading, {
    eyebrow: "04 / THE VALLEY LOTS",
    title: "Parking lots"
  }), React.createElement("p", {
    className: "hp-sub"
  }, "With no entry reservation in 2026, the Valley's lots are what ration a summer day: on the first busy Saturday of the season all Valley parking was full before noon. Be through the gate before 8 a.m. or after 4 p.m. on a summer weekend. Live lot status from the National Park Service appears here when the park publishes it."), React.createElement(ParkingNow, {
    variant: "board",
    onData: onLots
  })), React.createElement("section", {
    id: "cond-roads",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "05 / SOURCES, NOT GUESSES",
    title: "Roads and closures"
  }), React.createElement("p", {
    className: "hp-sub"
  }, "Road status changes faster than any page can promise. For whether a gate is open right now, check these three."), React.createElement("ul", {
    className: "conditions__list"
  }, React.createElement("li", {
    className: "conditions__row"
  }, React.createElement("a", {
    href: "/now",
    onClick: e => {
      e.preventDefault();
      go("now");
    }
  }, "The Park Bulletin"), React.createElement("span", null, "Our own board: road and area status, alerts, and the free-program clock, rewritten each time the park publishes a new Yosemite Guide.")), React.createElement("li", {
    className: "conditions__row"
  }, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "NPS current conditions ↗"), React.createElement("span", null, "Road status, chain controls, trail closures, and campground status. The authoritative page.")), React.createElement("li", {
    className: "conditions__row"
  }, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/guide.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The Yosemite Guide ↗"), React.createElement("span", null, "The park's own seasonal newspaper: shuttle maps, program schedules, hours."))), React.createElement("p", {
    className: "cond-note"
  }, "For how conditions shape a plan, the", " ", React.createElement("a", {
    href: "/planning",
    onClick: e => {
      e.preventDefault();
      go("planning");
    }
  }, "planning guide"), " ", "covers the seasonal calendar, and the", " ", React.createElement("a", {
    href: "/itineraries",
    onClick: e => {
      e.preventDefault();
      go("itineraries");
    }
  }, "itineraries"), " ", "adjust to what is open."))), React.createElement("div", {
    className: "hp-wrap cond-dial"
  }, React.createElement("a", {
    className: "dialplate",
    href: "tel:+12093720200"
  }, React.createElement("span", {
    className: "dialplate__copy"
  }, React.createElement("span", {
    className: "hp-eyebrow"
  }, "When the web is wrong"), React.createElement("span", {
    className: "dialplate__say"
  }, "In winter and spring, call the recorded road line before trusting any website, including this one. It is read out by the people standing at the gates.")), React.createElement("span", {
    className: "dialplate__num"
  }, React.createElement("span", {
    className: "dialplate__digits"
  }, "209-372-0200"), React.createElement("span", {
    className: "dialplate__label"
  }, "NPS recorded road line")))), React.createElement(HpGuideBand, {
    go: go,
    location: "conditions",
    title: "Past the entrance, this page stops loading.",
    intro: "Most of the park has no signal. The Field Guide app is built for exactly that: offline maps, every stop with parking and timing notes, and a trip planner that works from the trailhead.",
    sample: true
  }), React.createElement(HpLetter, {
    id: "road-alerts",
    eyebrow: "ROAD ALERTS / FREE",
    title: "Email me when a road changes",
    heading: "Email me when a road changes",
    blurb: "One email when Tioga Road, Glacier Point Road, or a highway into the park opens or closes, sent to the people who asked for it. Sunday Field Notes carries the rest of the week from inside the park.",
    location: "conditions",
    tag: "alert-roads",
    cta: "Email me ↗",
    terms: "Only when a road changes. Unsubscribe whenever.",
    stamp: "ROAD ALERTS",
    paper: React.createElement(React.Fragment, null, "Roads open.", React.createElement("br", null), "Roads close.", React.createElement("br", null), React.createElement("em", null, "You hear once."))
  }));
}
window.ConditionsPage = ConditionsPage;
