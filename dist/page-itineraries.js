var {
  useEffect: useEffectIt,
  useState: useStateIt
} = React;
var ITIN_NEEDS = {
  "1day": [],
  halfday: [],
  "2day": ["glacier"],
  "3day": ["glacier", "tioga"]
};
var ITIN_DAY_NOTES = [[/Glacier Point Road/i, "Glacier Point is about 30 miles and an hour from Yosemite Valley."], [/Tioga Road/i, "Tuolumne Meadows is roughly 55 to 60 miles from the Valley, about an hour and a half each way. This day only exists once Tioga Road is open, which in some years is not until late June or early July."]];
var ITIN_CAT_ICON = {
  vista: "eye",
  hike: "walk",
  eat: "food",
  picnic: "tree",
  swim: "drop",
  camp: "bed"
};
var ITIN_REGION_LABEL = {
  valley: "Yosemite Valley",
  "glacier-point": "Glacier Point Road",
  tuolumne: "Tioga Road"
};
var ITIN_PARK = {
  image: "img/nps-itineraries-map.jpg",
  w: 1400,
  h: 780,
  ox: 100,
  oy: 700,
  X: [2094.704440463671, 96.25567209789192, 247530.04319206357],
  Y: [-49.91832268440772, -2750.1330479076214, 99047.14030276223]
};
var ITIN_VALLEY = {
  image: "img/nps-yosemite-valley-map.jpg",
  w: 2560,
  h: 1000,
  ox: 0,
  oy: 0,
  X: [14276.700726584826, 710.8186467358179, 1682159.7744080413],
  Y: [396.87060490014903, -20040.32805507032, 804187.4599845853]
};
var ITIN_ROAD_TIOGA = "117,494 128,495 149,492 170,485 187,468 204,452 224,439 239,420 249,399 263,379 277,361 295,342 311,327 327,310 341,290 358,274 377,259 395,246 417,239 440,231 450,215 459,217 478,231 502,240 528,242 550,246 568,257 589,273 597,294 601,314 620,328 642,333 665,330 688,327 714,330 739,334 761,334 783,322 809,311 829,298 843,280 857,258 878,241 896,224 908,205 924,185 949,171 973,164 995,168 1020,176 1046,178 1070,174 1092,166 1114,161 1138,158 1165,157 1188,158 1211,159 1236,149 1260,138 1275,118 1281,94 1284,71 1287,49 1291,31 1292,27";
var ITIN_ROAD_GLACIER = "426,715 449,717 470,720 495,722 522,724 544,718 567,702 577,683 580,659 579,634 583,616 592,595 595,579";
var ITIN_SEASONAL = "#b8590f";
function itinXY(base, coord) {
  return [base.X[0] * coord[0] + base.X[1] * coord[1] + base.X[2] - base.ox, base.Y[0] * coord[0] + base.Y[1] * coord[1] + base.Y[2] - base.oy];
}
function ItinRoads({
  k,
  sw
}) {
  return React.createElement("g", {
    className: "itin-map__roads",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, [ITIN_ROAD_TIOGA, ITIN_ROAD_GLACIER].map((pts, i) => React.createElement("g", {
    key: i
  }, React.createElement("polyline", {
    points: pts,
    stroke: "#fff",
    strokeOpacity: "0.85",
    strokeWidth: sw + 2 * k
  }), React.createElement("polyline", {
    points: pts,
    stroke: ITIN_SEASONAL,
    strokeWidth: sw,
    strokeDasharray: `${sw * 2.2} ${sw * 1.4}`
  }))));
}
function ItinDayMap({
  stops,
  label,
  valley
}) {
  var base = valley ? ITIN_VALLEY : ITIN_PARK;
  var pts = stops.map(st => itinXY(base, st.coord));
  var inMap = pts.filter(([x, y]) => x >= 0 && y >= 0 && x <= base.w && y <= base.h);
  var fitPts = inMap.length ? inMap : pts;
  var xs = fitPts.map(p => p[0]),
    ys = fitPts.map(p => p[1]);
  var ASPECT = 420 / 260;
  var minX = Math.min(...xs),
    maxX = Math.max(...xs),
    minY = Math.min(...ys),
    maxY = Math.max(...ys);
  var pad = Math.max(maxX - minX, (maxY - minY) * ASPECT) * 0.14 + 30;
  minX -= pad;
  maxX += pad;
  minY -= pad;
  maxY += pad;
  var vw = maxX - minX,
    vh = maxY - minY;
  if (vw / vh < ASPECT) {
    var nw = vh * ASPECT;
    minX -= (nw - vw) / 2;
    vw = nw;
  } else {
    var nh = vw / ASPECT;
    minY -= (nh - vh) / 2;
    vh = nh;
  }
  if (vw > base.w) {
    vw = base.w;
    vh = vw / ASPECT;
  }
  if (vh > base.h) {
    vh = base.h;
    vw = vh * ASPECT;
  }
  minX = Math.max(0, Math.min(base.w - vw, minX));
  minY = Math.max(0, Math.min(base.h - vh, minY));
  var k = vw / 420,
    R = 11 * k;
  var placed = [];
  var marks = pts.map(([x, y], i) => {
    var mx = x,
      my = y,
      tries = 0;
    while (placed.some(([px, py]) => Math.hypot(px - mx, py - my) < R * 2 + 2 * k) && tries < 12) {
      var a = tries * 137.5 * Math.PI / 180;
      mx = x + Math.cos(a) * (R * 2.4 + tries * 2 * k);
      my = y + Math.sin(a) * (R * 2.4 + tries * 2 * k);
      tries++;
    }
    if (x < 0 || y < 0 || x > base.w || y > base.h) {
      mx = minX + R + 3 * k;
      my = Math.max(0, Math.min(base.h, y));
    }
    mx = Math.max(minX + R + 3 * k, Math.min(minX + vw - R - 3 * k, mx));
    my = Math.max(minY + R + 3 * k, Math.min(minY + vh - R - 3 * k, my));
    placed.push([mx, my]);
    return {
      i,
      x,
      y,
      mx,
      my,
      off: x < 0 || y < 0 || x > base.w || y > base.h
    };
  });
  return React.createElement("svg", {
    className: "itin-map__svg",
    viewBox: `${minX.toFixed(1)} ${minY.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`,
    role: "img",
    "aria-label": `${label}, on the National Park Service map: ${stops.length} stops in drive order, ${stops.map((s, i) => `${i + 1}, ${s.name}`).join("; ")}.`
  }, React.createElement("image", {
    href: `/${base.image}`,
    x: "0",
    y: "0",
    width: base.w,
    height: base.h,
    preserveAspectRatio: "none"
  }), !valley && React.createElement(ItinRoads, {
    k: k,
    sw: 3 * k
  }), marks.map(m => React.createElement("g", {
    key: m.i
  }, (m.mx !== m.x || m.my !== m.y) && React.createElement("line", {
    x1: m.x,
    y1: m.y,
    x2: m.mx,
    y2: m.my,
    className: "itin-map__leader",
    style: {
      strokeWidth: k
    }
  }), !m.off && React.createElement("circle", {
    cx: m.x,
    cy: m.y,
    r: 2.5 * k,
    className: "itin-map__true"
  }), React.createElement("circle", {
    cx: m.mx,
    cy: m.my,
    r: R,
    className: "itin-map__pin" + (m.i === 0 ? " is-first" : ""),
    style: {
      strokeWidth: 2 * k
    }
  }), React.createElement("text", {
    x: m.mx,
    y: m.my + 4 * k,
    textAnchor: "middle",
    className: "itin-map__num",
    style: {
      fontSize: 11 * k
    }
  }, m.i + 1), m.off && React.createElement("text", {
    x: m.mx - R,
    y: m.my - R - 5 * k,
    className: "itin-map__off",
    style: {
      fontSize: 10 * k,
      strokeWidth: 3 * k
    }
  }, "west, off this map"))));
}
function ItinOverview({
  stopsById
}) {
  var regions = [{
    key: "valley",
    ids: window.getItineraryStopIds ? window.getItineraryStopIds("1day") : []
  }, {
    key: "glacier-point",
    ids: ((window.ITINERARIES || []).find(i => i.id === "2day") || {
      days: []
    }).days.slice(1).flatMap(d => d.stopIds)
  }, {
    key: "tuolumne",
    ids: ((window.ITINERARIES || []).find(i => i.id === "3day") || {
      days: []
    }).days.slice(2).flatMap(d => d.stopIds)
  }].map(r => ({
    ...r,
    stops: r.ids.map(id => stopsById[id]).filter(s => s && s.coord)
  }));
  if (regions.flatMap(r => r.stops).length < 3) return null;
  var k = 1400 / 1000;
  var at = {
    valley: [790, 585, "start"],
    "glacier-point": [548, 700, "start"],
    tuolumne: [900, 150, "middle"]
  };
  return React.createElement("svg", {
    className: "itin-overview__svg",
    viewBox: "0 0 1400 780",
    role: "img",
    "aria-label": "The stops the plans use, on the National Park Service map of Yosemite: the Yosemite Valley floor in the middle, Glacier Point Road's stops to the south, and Tioga Road's stops running north-east from the Tuolumne Grove to Gaylor Lake near Tioga Pass. Both seasonal roads are highlighted."
  }, React.createElement("image", {
    href: `/${ITIN_PARK.image}`,
    x: "0",
    y: "0",
    width: "1400",
    height: "780"
  }), React.createElement(ItinRoads, {
    k: k,
    sw: 5 * k
  }), regions.map(r => {
    if (!r.stops.length) return null;
    var a = at[r.key];
    return React.createElement("g", {
      key: r.key,
      className: "itin-overview__region itin-overview__region--" + r.key
    }, r.stops.map((s, i) => {
      var [x, y] = itinXY(ITIN_PARK, s.coord);
      return React.createElement("circle", {
        key: i,
        cx: x,
        cy: y,
        r: 7 * k,
        className: "itin-overview__pt"
      });
    }), React.createElement("text", {
      x: a[0],
      y: a[1],
      textAnchor: a[2],
      className: "itin-overview__label",
      style: {
        fontSize: 38 * k
      }
    }, ITIN_REGION_LABEL[r.key]), React.createElement("text", {
      x: a[0],
      y: a[1] + 28 * k,
      textAnchor: a[2],
      className: "itin-overview__sub",
      style: {
        fontSize: 20 * k
      }
    }, r.stops.length, " stops"));
  }));
}
function ItinMonths({
  itineraries
}) {
  var months = window.TRIP_MONTHS;
  if (!Array.isArray(months) || months.length !== 12) return null;
  var status = (it, m) => {
    var need = ITIN_NEEDS[it.id] || [];
    var vals = need.map(road => m[road]);
    if (vals.includes("closed")) return "closed";
    if (vals.includes("unsettled")) return "unsettled";
    return "open";
  };
  var word = {
    open: "Works",
    unsettled: "Check the road",
    closed: "Road closed"
  };
  return React.createElement("div", {
    className: "itin-months",
    role: "region",
    "aria-label": "Which plan works in which month",
    tabIndex: 0
  }, React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, React.createElement("span", {
    className: "fj-sr"
  }, "Plan")), months.map(m => React.createElement("th", {
    key: m.key,
    scope: "col",
    title: m.name
  }, m.label)))), React.createElement("tbody", null, itineraries.map(it => React.createElement("tr", {
    key: it.id
  }, React.createElement("th", {
    scope: "row"
  }, React.createElement("a", {
    href: `#${it.id}`
  }, it.label), React.createElement("small", null, it.title)), months.map(m => {
    var s = status(it, m);
    return React.createElement("td", {
      key: m.key,
      className: "is-" + s
    }, React.createElement("span", {
      "aria-label": `${m.name}: ${word[s]}`,
      title: `${m.name}: ${word[s]}`
    }));
  }))))));
}
function ItinerariesPage({
  go
}) {
  var [stopsById, setStopsById] = useStateIt(null);
  useEffectIt(() => {
    var cancelled = false;
    fetch(window.POINTS_URL).then(r => r.ok ? r.json() : null).then(data => {
      if (cancelled || !data) return;
      var byId = {};
      (data.features || []).forEach(f => {
        byId[f.properties.id] = {
          ...f.properties,
          coord: f.geometry && f.geometry.coordinates
        };
      });
      setStopsById(byId);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  var itineraries = window.ITINERARIES || [];
  var ordered = ["halfday", "1day", "2day", "3day"].map(id => itineraries.find(i => i.id === id)).filter(Boolean);
  var tripUrl = it => {
    var ids = window.getItineraryStopIds ? window.getItineraryStopIds(it.id) : [];
    return `/map?trip=${ids.join(",")}`;
  };
  var dayNote = name => {
    var hit = ITIN_DAY_NOTES.find(([re]) => re.test(name));
    return hit ? hit[1] : null;
  };
  var uniqueStops = new Set(itineraries.flatMap(it => it.days.flatMap(d => d.stopIds))).size;
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-itin"
  }, React.createElement("div", {
    className: "ff-cover itin-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/tunnel-view-valley-spring.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "Yosemite Valley from Tunnel View in spring: El Capitan, Bridalveil Fall and Half Dome",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Itineraries"
    }],
    eyebrow: "ITINERARIES · HALF A DAY TO THREE DAYS",
    title: "Yosemite, in day-sized pieces.",
    intro: "Four plans built from the map's curated pins, ordered the way you would actually drive them. Pick the one that matches your time, open it on the map, and adjust from there. None of this requires a reservation; all of it fits in a normal day.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "itineraries_head",
      className: "hp-button",
      href: "#itin-choose"
    }, "Choose a plan ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "itineraries_head",
      className: "hp-link",
      href: "#itin-months"
    }, "Which month works ↓"))
  }, React.createElement(AffiliateDisclosure, null)), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: Kyle D / Wikimedia Commons (public domain)")), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "route"
  }), React.createElement("dt", null, "The plans"), React.createElement("dd", null, itineraries.length, ", half a day to three days")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "pin"
  }), React.createElement("dt", null, "The stops"), React.createElement("dd", null, uniqueStops, " curated pins")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "car"
  }), React.createElement("dt", null, "The order"), React.createElement("dd", null, "West to east, as you drive")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "Reservations"), React.createElement("dd", null, "None of it needs one")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "itin-choose",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "CHOOSE BY TIME",
    title: "How long do you have?"
  }), React.createElement("ol", {
    className: "itin-choose"
  }, ordered.map(it => React.createElement("li", {
    key: it.id
  }, React.createElement("a", {
    href: `#${it.id}`,
    onClick: e => {
      var el = document.getElementById(it.id);
      if (!el) return;
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "itineraries_choose",
        target: `#${it.id}`
      });
      el.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
      el.focus({
        preventScroll: true
      });
    }
  }, React.createElement("span", {
    className: "itin-choose__label"
  }, it.label), React.createElement("strong", null, it.title), React.createElement("p", null, it.dek), React.createElement("span", {
    className: "itin-choose__meta"
  }, it.days.reduce((n, d) => n + d.stopIds.length, 0), " stops · ", it.days.length, " ", it.days.length === 1 ? "day" : "days", " ↓")))))), React.createElement("section", {
    className: "ff-band",
    id: "itin-months",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHICH MONTH WORKS"), React.createElement("h2", null, "The roads decide how many days you get"), React.createElement("p", {
    className: "ff-lede"
  }, "The Valley is open all year, so the half-day and one-day plans work in any month. Day two needs Glacier Point Road and day three needs Tioga Road, and both close for winter. Tioga Road, Highway 120 across the middle of the park, is the one to doubt: it has opened anywhere from late April to early July, and in a heavy snow year it is still closed for much of June. Treat day three as a plan you confirm the week you go. The grid reads the same month table the trip selector uses, so the two cannot disagree."), React.createElement("ul", {
    className: "itin-legend"
  }, React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null), "Works"), React.createElement("li", {
    className: "is-unsettled"
  }, React.createElement("span", null), "A road may not be open yet; check first"), React.createElement("li", {
    className: "is-closed"
  }, React.createElement("span", null), "A road the plan needs is closed")), React.createElement("p", {
    className: "ff-note"
  }, "Road status now: ", React.createElement(HomeLink, {
    go: go,
    location: "itineraries_months",
    href: "/conditions"
  }, "the conditions board"), ". How the high road opens: ", React.createElement(HomeLink, {
    go: go,
    location: "itineraries_months",
    href: "/tioga-opening"
  }, "the Tioga Road opening"), ". A plan built around your month and your party: ", React.createElement(HomeLink, {
    go: go,
    location: "itineraries_months",
    href: "/planning"
  }, "the trip selector"), ".")), React.createElement(ItinMonths, {
    itineraries: ordered
  }))), React.createElement("section", {
    className: "hp-wrap hp-section itin-ground"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE GROUND THEY COVER"), React.createElement("h2", null, "Three roads, one park"), React.createElement("p", {
    className: "ff-lede"
  }, "Every plan starts on the Valley floor. The longer ones climb out of it: south and up to the rim on Glacier Point Road, then north-east over the high country on Tioga Road. Each is its own day, because each is its own drive."), React.createElement(NatureNotesFilm, {
    id: "one-day-in-yosemite",
    title: "One Day in Yosemite",
    youtubeId: "7QLVMwyxU_Q",
    location: "itineraries_film",
    note: "Thirty filmmakers spread across the park on one June day to record the people who visit and work in it. The day you are planning, seen from everywhere at once."
  })), React.createElement("figure", {
    className: "itin-overview"
  }, stopsById ? React.createElement(ItinOverview, {
    stopsById: stopsById
  }) : React.createElement("div", {
    className: "itin-overview__wait"
  }), React.createElement("figcaption", {
    className: "ff-note"
  }, "Map: National Park Service (public domain), with the stops plotted from their coordinates. The dashed lines are Tioga Road and Glacier Point Road, the two roads that close for winter and can open late.")))), ordered.map((it, n) => React.createElement("section", {
    key: it.id,
    id: it.id,
    tabIndex: -1,
    className: "itin-plan" + (n % 2 === 0 ? " ff-band" : "")
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "itin-plan__head"
  }, React.createElement("div", null, React.createElement(HpHeading, {
    eyebrow: (it.label || "").toUpperCase(),
    title: it.title
  }), React.createElement("p", {
    className: "ff-lede"
  }, it.dek)), React.createElement("p", {
    className: "itin-plan__season"
  }, React.createElement(EventIcon, {
    name: it.id === "1day" || it.id === "halfday" ? "sun" : "snow"
  }), it.season)), it.days.map(day => {
    var first = ordered.slice(0, n).find(o => o.days.some(d => d.name.replace(/^Day \d+: /, "") === day.name.replace(/^Day \d+: /, "") && d.stopIds.join() === day.stopIds.join()));
    if (first) {
      var names = day.stopIds.map(id => stopsById && stopsById[id] ? stopsById[id].name : id.replace(/-/g, " "));
      return React.createElement("div", {
        key: day.name,
        className: "itin-day itin-day--same"
      }, React.createElement("h3", null, day.name), React.createElement("p", {
        className: "ff-lede"
      }, "The same ", day.stopIds.length, " stops as ", React.createElement("a", {
        href: `#${first.id}`
      }, first.title.toLowerCase()), ": ", names[0], " to ", names[names.length - 1], "."));
    }
    var stops = day.stopIds.map(id => stopsById && stopsById[id] || {
      id,
      name: id.replace(/-/g, " ")
    });
    var mapped = stops.filter(s => s.coord);
    var note = dayNote(day.name);
    return React.createElement("div", {
      key: day.name,
      className: "itin-day"
    }, React.createElement("div", {
      className: "itin-day__map"
    }, React.createElement("h3", null, day.name), note && React.createElement("p", {
      className: "ff-note itin-day__note"
    }, React.createElement(EventIcon, {
      name: "car",
      size: 16
    }), note), mapped.length === stops.length && mapped.length > 1 ? React.createElement("figure", null, React.createElement(ItinDayMap, {
      stops: mapped,
      label: day.name,
      valley: mapped.every(s => s.region === "valley")
    }), React.createElement("figcaption", {
      className: "ff-note itin-map__credit"
    }, "Map: National Park Service (public domain)")) : React.createElement("div", {
      className: "itin-day__wait"
    })), React.createElement("ol", {
      className: "itin-day__stops"
    }, stops.map((st, i) => React.createElement("li", {
      key: st.id
    }, React.createElement("span", {
      className: "itin-day__num"
    }, i + 1), React.createElement("div", null, React.createElement("strong", null, st.name, st.category && React.createElement(EventIcon, {
      name: ITIN_CAT_ICON[st.category] || "pin",
      size: 16,
      className: "itin-day__cat"
    })), st.blurb && React.createElement("p", null, st.blurb))))));
  }), React.createElement("a", {
    className: "hp-button itin-plan__open",
    href: tripUrl(it),
    onClick: () => {
      if (window.track) window.track("itinerary_open_map", {
        itinerary: it.id
      });
    }
  }, "Open this trip on the map →")))), React.createElement("section", {
    className: "hp-wrap hp-section itin-after"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "AFTER THE PLAN"), React.createElement("h2", null, "Starting points, not homework"), React.createElement("p", {
    className: "ff-lede"
  }, "The ", React.createElement(HomeLink, {
    go: go,
    location: "itineraries_after",
    href: "/map"
  }, "full map"), " has every pin, and the trip builder saves whatever you assemble on your own device. For the reasoning behind the stops, start with ", React.createElement(HomeLink, {
    go: go,
    location: "itineraries_after",
    href: "/planning"
  }, "the planning guide"), ".")), React.createElement("aside", {
    className: "ff-closing",
    "aria-label": "Lodging availability"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "EVERY PLAN ABOVE NEEDS A NIGHT BETWEEN THE DAYS"), React.createElement("p", null, "These are built on early starts, which is a lodging decision before it is an itinerary decision: a bed in the Valley or in El Portal buys the first two hours of the day, and Oakhurst costs you them. The full comparison of every in-park and gateway option is one page over."), React.createElement(AvailabilityLink, {
    destination: "Yosemite National Park",
    list: "page_itineraries",
    slug: "itineraries",
    className: "ff-book"
  }, "See what is available on your dates ↗"), React.createElement("p", {
    className: "ff-note"
  }, "Availability search on Expedia; we may earn a commission, and the advice is the same either way. ", React.createElement("a", {
    href: "/affiliate"
  }, "Disclosure."), " Every option compared: ", React.createElement(HomeLink, {
    go: go,
    location: "itineraries_stay",
    href: "/stay"
  }, "where to stay"), ".")))), React.createElement(HpGuideBand, {
    go: go,
    location: "itineraries",
    title: "These plans, offline, in the park.",
    intro: "The Field Guide app carries the same curated stops with parking and timing notes, offline maps that keep working in the dead zones between them, and a day-by-day planner.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Get the conditions before you go",
    heading: "Get the conditions before you go",
    blurb: "Roads open and close, trails change, and the plans above age with them. One Sunday email carries what changed.",
    location: "itineraries",
    tag: "itineraries"
  }));
}
window.ItinerariesPage = ItinerariesPage;
