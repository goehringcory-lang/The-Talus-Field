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
var CONDITIONS_ELEV_LAYOUTS = {
  wide: {
    width: 1136,
    top: -28,
    base: 300,
    pxPerFt: 0.035,
    start: [64, 246],
    path: [[[110, 242], [150, 232], [181, 230]], [[230, 227], [280, 162], [330, 160]], [[390, 158], [480, 228], [568, 230]], [[620, 231], [640, 170], [680, 154]], [[740, 130], [800, 86], [860, 80]], [[900, 76], [930, 71], [955, 69]], [[1010, 64], [1060, 30], [1090, 22]], [[1110, 18], [1125, 24], [1136, 30]]],
    highFrom: 5,
    stationX: [181, 568, 955],
    passX: 1090,
    grid: [{
      ft: 10000,
      label: "10,000 ft"
    }, {
      ft: 8000,
      label: "8,000 ft"
    }, {
      ft: 6000,
      label: "6,000 ft"
    }, {
      ft: 4000,
      label: "4,000 ft"
    }, {
      ft: 2000,
      label: "2,000 ft"
    }],
    tag: {
      w: 88,
      h: 22,
      top: [150, 150, 26],
      text: (i, f) => `0${i + 1} · ${f.elevationFt.toLocaleString("en-US")}`
    },
    pinR: 6,
    tri: 6,
    passLabel: `Tioga Pass ${CONDITIONS_TIOGA_FT.toLocaleString("en-US")} ft`,
    passLabelDx: -14,
    passLabelY: -8,
    bracketX: 905,
    note: {
      side: "left",
      w: 174,
      h: 54,
      y: 168,
      big: 196,
      small: [214],
      smallText: ["15 to 25 degrees colder"]
    }
  },
  compact: {
    width: 358,
    top: -14,
    base: 170,
    pxPerFt: 0.02,
    start: [22, 136],
    path: [[[36, 134], [46, 131], [56, 130]], [[74, 128], [90, 92], [104, 91]], [[124, 90], [142, 129], [158, 130]], [[172, 131], [180, 100], [192, 92]], [[214, 78], [240, 50], [258, 46]], [[268, 43], [275, 40], [282, 38]], [[300, 34], [320, 16], [334, 11]], [[342, 9], [350, 12], [358, 15]]],
    highFrom: 5,
    stationX: [56, 158, 282],
    passX: 334,
    grid: [{
      ft: 10000,
      label: ""
    }, {
      ft: 8000,
      label: "8k"
    }, {
      ft: 6000,
      label: "6k"
    }, {
      ft: 4000,
      label: "4k"
    }, {
      ft: 2000,
      label: "2k ft"
    }],
    tag: {
      w: 24,
      h: 16,
      top: [70, 70, 7],
      text: i => `0${i + 1}`
    },
    pinR: 4.5,
    tri: 5,
    passLabel: `Tioga Pass ${CONDITIONS_TIOGA_FT.toLocaleString("en-US")}`,
    passLabelDx: -10,
    passLabelY: 0,
    bracketX: 246,
    note: {
      side: "right",
      w: 80,
      h: 50,
      y: 72,
      big: 91,
      small: [104, 115],
      smallText: ["15 to 25°", "colder"]
    }
  }
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
  var L = CONDITIONS_ELEV_LAYOUTS[mode];
  var s = width / L.width;
  var X = x => +(x * s).toFixed(1);
  var Y = ft => +(L.base - (ft - 2000) * L.pxPerFt).toFixed(1);
  var pt = ([x, y]) => `${X(x)} ${y}`;
  var segs = from => L.path.slice(from).map(seg => `C ${seg.map(pt).join(", ")}`).join(" ");
  var line = `M ${pt(L.start)} ${segs(0)}`;
  var high = `M ${pt(L.path[L.highFrom - 1][2])} ${segs(L.highFrom)}`;
  var [lowF,, highF] = CONDITIONS_FORECASTS;
  var floorY = Y(lowF.elevationFt);
  var highY = Y(highF.elevationFt);
  var riseFt = highF.elevationFt - lowF.elevationFt;
  var bx = X(L.bracketX);
  var n = L.note;
  var noteX = n.side === "left" ? bx - 13 - n.w : bx + 7;
  var noteTextX = n.side === "left" ? bx - 15 : bx + 12;
  var noteAnchor = n.side === "left" ? "end" : "start";
  var passX = X(L.passX);
  var passY = Y(CONDITIONS_TIOGA_FT);
  var height = L.base - L.top;
  var summary = `Elevation profile along the park roads: ${CONDITIONS_FORECASTS.map(f => `${f.label} at ${f.elevationFt.toLocaleString("en-US")} feet`).join(", ")}. ` + `Tuolumne Meadows sits ${riseFt.toLocaleString("en-US")} feet above the Valley, and Tioga Pass tops the road at ${CONDITIONS_TIOGA_FT.toLocaleString("en-US")} feet.`;
  return React.createElement("div", {
    className: `elev elev--${mode}`,
    ref: ref
  }, React.createElement("div", {
    className: "elev__caption"
  }, React.createElement("span", {
    className: "elev__title"
  }, mode === "wide" ? "Elevation along the park roads, Wawona to Tioga Pass" : "Elevation, Wawona to Tioga Pass"), React.createElement("span", {
    className: "elev__scale"
  }, "Station heights to scale. Terrain between them is schematic.")), React.createElement("svg", {
    className: "elev__svg",
    viewBox: `0 ${L.top} ${width} ${height}`,
    width: width,
    height: height,
    role: "img",
    "aria-label": summary
  }, React.createElement("defs", null, React.createElement("pattern", {
    id: "cond-elev-hatch",
    width: "6",
    height: "6",
    patternUnits: "userSpaceOnUse",
    patternTransform: "rotate(45)"
  }, React.createElement("line", {
    className: "elev__hatch",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "6"
  }))), L.grid.map(g => React.createElement("g", {
    key: g.ft
  }, g.ft !== 2000 && React.createElement("line", {
    className: "elev__gridline",
    x1: "0",
    y1: Y(g.ft),
    x2: width,
    y2: Y(g.ft)
  }), g.label && React.createElement("text", {
    className: "elev__gridlabel",
    x: "0",
    y: Y(g.ft) - 6
  }, g.label))), React.createElement("path", {
    className: "elev__fill",
    d: `${line} L ${width} ${L.base} L ${X(L.start[0])} ${L.base} Z`
  }), React.createElement("line", {
    className: "elev__datum",
    x1: X(L.start[0]),
    y1: floorY,
    x2: width,
    y2: floorY
  }), React.createElement("path", {
    className: "elev__line",
    d: line
  }), React.createElement("path", {
    className: "elev__line elev__line--high",
    d: high
  }), React.createElement("line", {
    className: "elev__baseline",
    x1: "0",
    y1: L.base,
    x2: width,
    y2: L.base
  }), CONDITIONS_FORECASTS.map((f, i) => React.createElement("line", {
    key: f.label,
    className: "elev__drop",
    x1: X(L.stationX[i]),
    y1: Y(f.elevationFt),
    x2: X(L.stationX[i]),
    y2: L.base
  })), React.createElement("g", {
    className: "elev__dim"
  }, React.createElement("line", {
    x1: bx,
    y1: highY,
    x2: bx,
    y2: floorY
  }), React.createElement("line", {
    x1: bx - 8,
    y1: highY,
    x2: bx + 8,
    y2: highY
  }), React.createElement("line", {
    x1: bx - 8,
    y1: floorY,
    x2: bx + 8,
    y2: floorY
  })), React.createElement("rect", {
    className: "elev__plate",
    x: noteX,
    y: n.y,
    width: n.w,
    height: n.h
  }), React.createElement("text", {
    className: "elev__rise",
    x: noteTextX,
    y: n.big,
    textAnchor: noteAnchor
  }, "+", riseFt.toLocaleString("en-US"), " ft"), n.smallText.map((t, i) => React.createElement("text", {
    key: t,
    className: "elev__risenote",
    x: noteTextX,
    y: n.small[i],
    textAnchor: noteAnchor
  }, t)), React.createElement("path", {
    className: "elev__pass",
    d: `M ${passX} ${passY - L.tri} L ${passX + L.tri} ${passY + L.tri * 0.7} L ${passX - L.tri} ${passY + L.tri * 0.7} Z`
  }), React.createElement("text", {
    className: "elev__passlabel",
    x: passX + L.passLabelDx,
    y: L.passLabelY,
    textAnchor: "end"
  }, L.passLabel), CONDITIONS_FORECASTS.map((f, i) => {
    var x = X(L.stationX[i]);
    var y = Y(f.elevationFt);
    var hi = f.elevationFt >= 6000;
    return React.createElement("g", {
      key: f.label,
      className: `elev__station${hi ? " elev__station--high" : ""}`
    }, React.createElement("line", {
      className: "elev__stem",
      x1: x,
      y1: L.tag.top[i] + L.tag.h,
      x2: x,
      y2: y - L.pinR
    }), React.createElement("rect", {
      className: "elev__tag",
      x: x - L.tag.w / 2,
      y: L.tag.top[i],
      width: L.tag.w,
      height: L.tag.h,
      rx: L.tag.h / 2
    }), React.createElement("text", {
      className: "elev__tagtext",
      x: x,
      y: L.tag.top[i] + L.tag.h / 2 + 3.5,
      textAnchor: "middle"
    }, L.tag.text(i, f)), React.createElement("circle", {
      className: "elev__pin",
      cx: x,
      cy: y,
      r: L.pinR
    }));
  })), React.createElement("div", {
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
  }, "The park's live feeds are quiet right now. Everything below still links straight to the source."), React.createElement("p", {
    className: "readout__foot"
  }, "National Park Service. Both readings refresh every five minutes."));
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
    intro: "Live webcams, entrance waits, and the forecasts that matter, on one page. Check it the morning you drive in, not the week before: Yosemite changes faster than a booking window.",
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
  }), React.createElement("section", {
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
  }, "The park spans 9,000 feet of elevation, so one forecast is never enough. These are National Weather Service point forecasts for the three places most trips actually go."), React.createElement(ConditionsElevation, null)), React.createElement("div", {
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
  }, "Road status changes faster than any page can promise, this one included, so nothing here claims to know whether a gate is open. These three do."), React.createElement("ul", {
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
    intro: "Most of the park has no signal. The Field Guide app is built for exactly that: offline maps, 50-plus stops with parking and timing notes, and a trip planner that works from the trailhead.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "ROAD ALERTS / FREE",
    title: "Email me when a road changes",
    heading: "Email me when a road changes",
    blurb: "One email when Tioga Road, Glacier Point Road, or a highway into the park opens or closes, sent to the people who asked for it. The Sunday note carries the rest of the week from inside the park. Free.",
    location: "conditions",
    tag: "alert-roads",
    cta: "Email me ↗",
    terms: "Only when a road changes. Unsubscribe whenever.",
    stamp: "ROAD ALERTS",
    paper: React.createElement(React.Fragment, null, "Roads open.", React.createElement("br", null), "Roads close.", React.createElement("br", null), React.createElement("em", null, "You hear once."))
  }));
}
window.ConditionsPage = ConditionsPage;
