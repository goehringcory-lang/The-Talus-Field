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
var ITIN_DAY_NOTES = [[/Glacier Point Road/i, "Glacier Point is about 30 miles and an hour from Yosemite Valley."], [/Tioga Road/i, "Tuolumne Meadows is roughly 55 to 60 miles from the Valley, about an hour and a half each way."]];
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
function itinProject(points, W, H, pad) {
  var lons = points.map(p => p.coord[0]);
  var lats = points.map(p => p.coord[1]);
  var midLat = (Math.min(...lats) + Math.max(...lats)) / 2 * (Math.PI / 180);
  var k = Math.cos(midLat);
  var minX = Math.min(...lons) * k,
    maxX = Math.max(...lons) * k;
  var minY = Math.min(...lats),
    maxY = Math.max(...lats);
  var spanX = Math.max(maxX - minX, 0.004),
    spanY = Math.max(maxY - minY, 0.004);
  var s = Math.min((W - pad * 2) / spanX, (H - pad * 2) / spanY);
  var offX = (W - spanX * s) / 2,
    offY = (H - spanY * s) / 2;
  return c => [offX + (c[0] * k - minX) * s, offY + (maxY - c[1]) * s];
}
function ItinDayMap({
  stops,
  label
}) {
  var W = 420,
    H = 260,
    R = 11;
  var project = itinProject(stops, W, H, 36);
  var clamp = (v, max) => Math.max(R + 3, Math.min(max - R - 3, v));
  var placed = [];
  var marks = stops.map((st, i) => {
    var [x, y] = project(st.coord);
    var mx = x,
      my = y,
      tries = 0;
    while (placed.some(([px, py]) => Math.hypot(px - mx, py - my) < R * 2 + 2) && tries < 12) {
      var a = tries * 137.5 * Math.PI / 180;
      mx = x + Math.cos(a) * (R * 2.4 + tries * 2);
      my = y + Math.sin(a) * (R * 2.4 + tries * 2);
      tries++;
    }
    mx = clamp(mx, W);
    my = clamp(my, H);
    placed.push([mx, my]);
    return {
      i,
      x,
      y,
      mx,
      my
    };
  });
  var line = marks.map(m => `${m.x.toFixed(1)},${m.y.toFixed(1)}`).join(" ");
  return React.createElement("svg", {
    className: "itin-map__svg",
    viewBox: `0 0 ${W} ${H}`,
    role: "img",
    "aria-label": `${label}: ${stops.length} stops in drive order, ${stops.map((s, i) => `${i + 1}, ${s.name}`).join("; ")}.`
  }, React.createElement("rect", {
    x: "0",
    y: "0",
    width: W,
    height: H,
    className: "itin-map__ground"
  }), React.createElement("polyline", {
    points: line,
    className: "itin-map__route"
  }), marks.map(m => React.createElement("g", {
    key: m.i
  }, (m.mx !== m.x || m.my !== m.y) && React.createElement("line", {
    x1: m.x,
    y1: m.y,
    x2: m.mx,
    y2: m.my,
    className: "itin-map__leader"
  }), React.createElement("circle", {
    cx: m.x,
    cy: m.y,
    r: "2.5",
    className: "itin-map__true"
  }), React.createElement("circle", {
    cx: m.mx,
    cy: m.my,
    r: R,
    className: "itin-map__pin" + (m.i === 0 ? " is-first" : "")
  }), React.createElement("text", {
    x: m.mx,
    y: m.my + 4,
    textAnchor: "middle",
    className: "itin-map__num"
  }, m.i + 1))), React.createElement("g", {
    className: "itin-map__north",
    transform: `translate(${W - 22},24)`
  }, React.createElement("path", {
    d: "M0 -12 L5 4 L0 1 L-5 4 Z"
  }), React.createElement("text", {
    y: "18",
    textAnchor: "middle"
  }, "N")));
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
  var all = regions.flatMap(r => r.stops);
  if (all.length < 3) return null;
  var W = 1000,
    H = 540;
  var project = itinProject(all, W, H, 140);
  return React.createElement("svg", {
    className: "itin-overview__svg",
    viewBox: `0 0 ${W} ${H}`,
    role: "img",
    "aria-label": "Overview map of the stops the plans use: the Yosemite Valley floor in the middle, Glacier Point Road's stops to the south, and Tioga Road's stops running north-east from the Tuolumne Grove to Gaylor Lake near Tioga Pass. Lines join the stops in drive order and are not the roads."
  }, React.createElement("rect", {
    x: "0",
    y: "0",
    width: W,
    height: H,
    className: "itin-map__ground"
  }), regions.map(r => {
    if (!r.stops.length) return null;
    var pts = r.stops.map(s => project(s.coord));
    var xs = pts.map(p => p[0]),
      ys = pts.map(p => p[1]);
    var mid = pts[Math.floor(pts.length / 2)];
    var at = {
      valley: [Math.max(...xs) + 26, (Math.min(...ys) + Math.max(...ys)) / 2 + 4, "start"],
      "glacier-point": [(Math.min(...xs) + Math.max(...xs)) / 2, Math.max(...ys) + 48, "middle"],
      tuolumne: [mid[0], mid[1] - 52, "middle"]
    }[r.key];
    var ends = r.key === "tuolumne" ? [[0, "end", -12], [r.stops.length - 1, "start", 12]] : [];
    return React.createElement("g", {
      key: r.key,
      className: "itin-overview__region itin-overview__region--" + r.key
    }, React.createElement("polyline", {
      points: pts.map(p => p.map(v => v.toFixed(1)).join(",")).join(" "),
      className: "itin-overview__route"
    }), pts.map((p, i) => React.createElement("circle", {
      key: i,
      cx: p[0],
      cy: p[1],
      r: "9",
      className: "itin-overview__pt"
    })), React.createElement("text", {
      x: at[0],
      y: at[1],
      textAnchor: at[2],
      className: "itin-overview__label"
    }, ITIN_REGION_LABEL[r.key]), React.createElement("text", {
      x: at[0],
      y: at[1] + 28,
      textAnchor: at[2],
      className: "itin-overview__sub"
    }, r.stops.length, " stops"), ends.map(([i, anchor, dx]) => React.createElement("text", {
      key: i,
      x: pts[i][0] + dx * 1.6,
      y: pts[i][1] + 8,
      textAnchor: anchor,
      className: "itin-overview__end"
    }, r.stops[i].name.replace(/ Trailhead$/, ""))));
  }), React.createElement("g", {
    className: "itin-map__north",
    transform: "translate(40,44)"
  }, React.createElement("path", {
    d: "M0 -16 L7 6 L0 2 L-7 6 Z"
  }), React.createElement("text", {
    y: "24",
    textAnchor: "middle"
  }, "N")));
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
  }, "The Valley is open all year, so the half-day and one-day plans work in any month. Day two needs Glacier Point Road and day three needs Tioga Road, and both close for winter. The grid reads the same month table the trip selector uses, so the two cannot disagree."), React.createElement("ul", {
    className: "itin-legend"
  }, React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null), "Works"), React.createElement("li", {
    className: "is-unsettled"
  }, React.createElement("span", null), "The road usually opens this month; check first"), React.createElement("li", {
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
  }, "Drawn from the stops' own coordinates on the map. Lines join the stops in drive order; they are not the roads.")))), ordered.map((it, n) => React.createElement("section", {
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
      label: day.name
    })) : React.createElement("div", {
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
