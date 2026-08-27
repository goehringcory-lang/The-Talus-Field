var BULLETIN_URL = "/bulletin.json?v=8";
function bulletinDate(iso) {
  var d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function editionProgress(edition) {
  var start = new Date(edition.start + "T00:00:00");
  var end = new Date(edition.end + "T00:00:00");
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  var day = Math.round((today - start) / 86400000) + 1;
  var total = Math.round((end - start) / 86400000) + 1;
  if (day < 1 || day > total) return null;
  return {
    day,
    total
  };
}
function editionEnded(edition) {
  var end = new Date(edition.end + "T00:00:00");
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(end.getTime()) && today > end;
}
function isPastEvent(ev) {
  if (!ev.end) return false;
  var end = new Date(ev.end + "T23:59:59");
  return !Number.isNaN(end.getTime()) && end < new Date();
}
var BULLETIN_ICONS = {
  dot: React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3",
    fill: "currentColor",
    stroke: "none"
  }),
  alert: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M12 3.4 21.2 20H2.8z"
  }), React.createElement("path", {
    d: "M12 9.8v4.6"
  }), React.createElement("circle", {
    cx: "12",
    cy: "17.3",
    r: "0.95",
    fill: "currentColor",
    stroke: "none"
  })),
  check: React.createElement("path", {
    d: "m4.6 12.4 5 5.2L19.6 6.6"
  }),
  chevron: React.createElement("path", {
    d: "m5.6 9.4 6.4 6.2 6.4-6.2"
  }),
  x: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "m6.4 6.4 11.2 11.2"
  }), React.createElement("path", {
    d: "M17.6 6.4 6.4 17.6"
  })),
  clock: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8.6"
  }), React.createElement("path", {
    d: "M12 6.6V12l3.7 2.3"
  })),
  calendar: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "3.2",
    y: "5",
    width: "17.6",
    height: "15.8",
    rx: "2.2"
  }), React.createElement("path", {
    d: "M3.2 10.2h17.6"
  }), React.createElement("path", {
    d: "M8 3v4.2M16 3v4.2"
  })),
  road: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M6.4 20.8 9.6 3.2"
  }), React.createElement("path", {
    d: "m17.6 20.8-3.2-17.6"
  }), React.createElement("path", {
    d: "M12 5.6v2.8M12 10.6v2.8M12 15.6v2.8"
  })),
  route: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M4 20.6h6.4a3.3 3.3 0 0 0 0-6.6H7.6a3.3 3.3 0 0 1 0-6.6h8.6"
  }), React.createElement("path", {
    d: "m12.9 4.4 3.1 3-3.1 3"
  })),
  valley: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M2.2 19.8 8.2 3.6l3.2 16.2"
  }), React.createElement("path", {
    d: "M21.8 19.8 15.8 5.2l-3.2 14.6"
  }), React.createElement("path", {
    d: "M2.2 19.8h19.6"
  })),
  mountain: React.createElement("path", {
    d: "M2.6 19.4 9 7.6l3.6 6.2 2.4-3.4 6.4 9z"
  }),
  tree: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M12 2.6 6.6 10.8h3.2L4.8 17.6h14.4l-5-6.8h3.2z"
  }), React.createElement("path", {
    d: "M12 17.6v3.8"
  })),
  water: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M2.6 8q3.1-2.8 6.2 0t6.2 0 6.2 0"
  }), React.createElement("path", {
    d: "M2.6 13q3.1-2.8 6.2 0t6.2 0 6.2 0"
  }), React.createElement("path", {
    d: "M2.6 18q3.1-2.8 6.2 0t6.2 0 6.2 0"
  })),
  fuel: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M4.4 20.8V5.4a2.2 2.2 0 0 1 2.2-2.2h5.2a2.2 2.2 0 0 1 2.2 2.2v15.4"
  }), React.createElement("path", {
    d: "M3 20.8h13.2"
  }), React.createElement("path", {
    d: "M6.8 6.8h5v3.8h-5z"
  }), React.createElement("path", {
    d: "M14 9.4h2.6a2 2 0 0 1 2 2v5.4a1.6 1.6 0 0 0 3.2 0V10l-2.4-2.6"
  })),
  pin: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M12 21.2s6.8-7.4 6.8-11.6a6.8 6.8 0 1 0-13.6 0c0 4.2 6.8 11.6 6.8 11.6z"
  }), React.createElement("circle", {
    cx: "12",
    cy: "9.4",
    r: "2.4"
  })),
  bus: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "3.2",
    y: "4",
    width: "17.6",
    height: "11.6",
    rx: "2.2"
  }), React.createElement("path", {
    d: "M3.2 10.4h17.6"
  }), React.createElement("path", {
    d: "M6.6 15.6v1.4M17.4 15.6v1.4"
  }), React.createElement("circle", {
    cx: "7.6",
    cy: "18.6",
    r: "1.9"
  }), React.createElement("circle", {
    cx: "16.4",
    cy: "18.6",
    r: "1.9"
  })),
  bike: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "5.8",
    cy: "16.6",
    r: "4.1"
  }), React.createElement("circle", {
    cx: "18.2",
    cy: "16.6",
    r: "4.1"
  }), React.createElement("path", {
    d: "M5.8 16.6 9.8 8.4h4.6l3.8 8.2"
  }), React.createElement("path", {
    d: "M8.6 8.4H12"
  })),
  plug: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M9 3.2v4.6M15 3.2v4.6"
  }), React.createElement("path", {
    d: "M6.6 7.8h10.8v3.4a5.4 5.4 0 0 1-10.8 0z"
  }), React.createElement("path", {
    d: "M12 16.6v4.2"
  })),
  parking: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "3.4",
    y: "3.4",
    width: "17.2",
    height: "17.2",
    rx: "3"
  }), React.createElement("path", {
    d: "M9.8 17.4V7.6h3.4a2.9 2.9 0 0 1 0 5.8H9.8"
  })),
  signpost: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M6.4 3.2v17.6"
  }), React.createElement("path", {
    d: "M6.4 5.8h10.8l3 3.4-3 3.4H6.4z"
  })),
  info: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8.6"
  }), React.createElement("path", {
    d: "M12 11v6"
  }), React.createElement("circle", {
    cx: "12",
    cy: "7.6",
    r: "0.95",
    fill: "currentColor",
    stroke: "none"
  })),
  fork: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M7 3.2v4.6a2.3 2.3 0 0 0 4.6 0V3.2"
  }), React.createElement("path", {
    d: "M9.3 8.4v12.4"
  }), React.createElement("path", {
    d: "M16.6 3.2c2.4 1.6 2.4 7.2 0 8.8v8.8"
  })),
  bag: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M5.6 8h12.8l1 12.8H4.6z"
  }), React.createElement("path", {
    d: "M9 8V6.2a3 3 0 0 1 6 0V8"
  })),
  gear: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3.4"
  }), React.createElement("path", {
    d: "M12 3.4V6M12 18v2.6M20.6 12H18M6 12H3.4M18.1 5.9l-1.8 1.8M7.7 16.3l-1.8 1.8M18.1 18.1l-1.8-1.8M7.7 7.7 5.9 5.9"
  })),
  bed: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M3 20V9.2"
  }), React.createElement("path", {
    d: "M3 13.6h18V20"
  }), React.createElement("path", {
    d: "M21 20H3"
  }), React.createElement("circle", {
    cx: "7.4",
    cy: "11.2",
    r: "1.9"
  }), React.createElement("path", {
    d: "M10.4 13.6a2.8 2.8 0 0 1 2.8-2.8H21"
  })),
  phone: React.createElement("path", {
    d: "M6.6 3.4h3.2l1.6 4-2.2 1.6a12.4 12.4 0 0 0 6.2 6.2l1.6-2.2 4 1.6v3.2a2 2 0 0 1-2.2 2C11.2 19 5 12.8 4.6 5.6a2 2 0 0 1 2-2.2z"
  }),
  camera: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "2.8",
    y: "6.6",
    width: "18.4",
    height: "13",
    rx: "2.4"
  }), React.createElement("circle", {
    cx: "12",
    cy: "13.2",
    r: "3.8"
  }), React.createElement("path", {
    d: "m8.4 6.6 1.4-2.6h4.4l1.4 2.6"
  })),
  wheelchair: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "11.4",
    cy: "4.2",
    r: "1.9",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("path", {
    d: "M11.4 7.4v5h5l2.4 6.2"
  }), React.createElement("path", {
    d: "M16.6 12.8a6.1 6.1 0 1 1-7.6-3.2"
  })),
  family: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "8.4",
    cy: "7",
    r: "3"
  }), React.createElement("path", {
    d: "M3.4 20.6a5 5 0 0 1 10 0"
  }), React.createElement("circle", {
    cx: "17",
    cy: "11",
    r: "2.3"
  }), React.createElement("path", {
    d: "M13.4 20.6a3.6 3.6 0 0 1 7.2 0"
  })),
  bear: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "6.6",
    cy: "6.8",
    r: "2.6"
  }), React.createElement("circle", {
    cx: "17.4",
    cy: "6.8",
    r: "2.6"
  }), React.createElement("circle", {
    cx: "12",
    cy: "13.4",
    r: "6.8"
  }), React.createElement("circle", {
    cx: "12",
    cy: "16.2",
    r: "2.4"
  }), React.createElement("circle", {
    cx: "9.6",
    cy: "11.8",
    r: "0.85",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("circle", {
    cx: "14.4",
    cy: "11.8",
    r: "0.85",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("circle", {
    cx: "12",
    cy: "14.8",
    r: "0.8",
    fill: "currentColor",
    stroke: "none"
  })),
  paw: React.createElement(React.Fragment, null, React.createElement("ellipse", {
    cx: "7.2",
    cy: "10",
    rx: "1.9",
    ry: "2.4",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("ellipse", {
    cx: "11",
    cy: "7.6",
    rx: "1.9",
    ry: "2.5",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("ellipse", {
    cx: "15",
    cy: "7.8",
    rx: "1.9",
    ry: "2.5",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("ellipse", {
    cx: "18.4",
    cy: "10.6",
    rx: "1.9",
    ry: "2.3",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("path", {
    d: "M12.6 13.2c3 0 5.4 2 5.4 4.4 0 1.9-1.7 3-3.4 2.5a7.6 7.6 0 0 0-4 0c-1.7.5-3.4-.6-3.4-2.5 0-2.4 2.4-4.4 5.4-4.4z",
    fill: "currentColor",
    stroke: "none"
  })),
  binoculars: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "6.8",
    cy: "15.4",
    r: "4.2"
  }), React.createElement("circle", {
    cx: "17.2",
    cy: "15.4",
    r: "4.2"
  }), React.createElement("path", {
    d: "M10.4 13.6h3.2"
  }), React.createElement("path", {
    d: "M5.2 11.6 6.2 5.4h3.4l1 6.4"
  }), React.createElement("path", {
    d: "M18.8 11.6 17.8 5.4h-3.4l-1 6.4"
  })),
  bolt: React.createElement("path", {
    d: "M13.4 2.4 5.6 13.6h5L9.2 21.6l8.4-11.4h-5.2z"
  }),
  flame: React.createElement("path", {
    d: "M12 21.4c3.6 0 6.4-2.6 6.4-6.1 0-4.9-4.4-6.6-3.4-13.1-4.2 2-6.8 5.4-6.8 9 0 1.4.4 2.4.9 3.1a3.1 3.1 0 0 1-1.6-2.5c-1.1 1.4-1.9 2.6-1.9 4.2 0 3.2 2.8 5.4 6.4 5.4z"
  }),
  sun: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4.2"
  }), React.createElement("path", {
    d: "M12 2.6V5M12 19v2.4M21.4 12H19M5 12H2.6M18.6 5.4l-1.7 1.7M7.1 16.9l-1.7 1.7M18.6 18.6l-1.7-1.7M7.1 7.1 5.4 5.4"
  })),
  prohibited: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8.6"
  }), React.createElement("path", {
    d: "m6 6 12 12"
  })),
  tent: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M3.4 20.6 13.6 3.4"
  }), React.createElement("path", {
    d: "M20.6 20.6 10.4 3.4"
  }), React.createElement("path", {
    d: "M15.4 20.6 12 14.4l-3.4 6.2"
  }), React.createElement("path", {
    d: "M2.2 20.6h19.6"
  })),
  wifi: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M3.4 9.2a12.6 12.6 0 0 1 17.2 0"
  }), React.createElement("path", {
    d: "M6.8 12.9a8 8 0 0 1 10.4 0"
  }), React.createElement("path", {
    d: "M9.9 16.4a3.6 3.6 0 0 1 4.2 0"
  }), React.createElement("circle", {
    cx: "12",
    cy: "19.6",
    r: "1.2",
    fill: "currentColor",
    stroke: "none"
  }))
};
var AREA_ICONS = [[/hetch hetchy/i, "water"], [/^gas\b|fuel/i, "fuel"], [/grove|crane flat/i, "tree"], [/glacier point/i, "mountain"], [/road|tioga|highway/i, "road"], [/valley/i, "valley"]];
var ELSEWHERE_ICONS = [[/tuolumne|tioga/i, "mountain"], [/grove|wawona|crane flat/i, "tree"], [/glacier point/i, "mountain"]];
var HOURS_ICONS = [[/information|visitor|welcome/i, "info"], [/eat|food|dining|restaurant/i, "fork"], [/store|shop|market/i, "bag"], [/service/i, "gear"]];
var TRANSIT_ICONS = [[/bike|bicycle/i, "bike"], [/charg|\bev\b/i, "plug"], [/hiker/i, "route"], [/shuttle|bus|yarts|transit/i, "bus"]];
var ESSENTIAL_ICONS = [[/bear/i, "bear"], [/lightning|thunder|storm/i, "bolt"], [/smoke|fire/i, "flame"], [/wildlife|animal/i, "binoculars"], [/heat|water|hydrat/i, "sun"], [/parking/i, "parking"], [/pets|dogs/i, "paw"], [/rules|prohibit|regulation/i, "prohibited"], [/camp/i, "tent"], [/navigation|gps|direction/i, "signpost"], [/wifi|internet|cell|signal/i, "wifi"], [/lodging|hotel|lodge/i, "bed"]];
var CHIP_ICONS = {
  open: "check",
  warn: "alert",
  closed: "x"
};
function iconFor(table, name, fallback) {
  var text = String(name || "");
  for (var i = 0; i < table.length; i++) {
    if (table[i][0].test(text)) return table[i][1];
  }
  return fallback;
}
function BulletinIcon({
  name,
  className,
  label
}) {
  var shape = BULLETIN_ICONS[name] || BULLETIN_ICONS.dot;
  return React.createElement("svg", {
    className: className ? `bicon ${className}` : "bicon",
    viewBox: "0 0 24 24",
    role: label ? "img" : undefined,
    "aria-hidden": label ? undefined : "true",
    focusable: "false"
  }, label ? React.createElement("title", null, label) : null, shape);
}
function BulletinChip({
  tone,
  children
}) {
  var t = tone || "open";
  return React.createElement("span", {
    className: `bulletin-chip bulletin-chip--${t}`
  }, React.createElement(BulletinIcon, {
    name: CHIP_ICONS[t] || "dot",
    className: "bulletin-chip__icon"
  }), children);
}
function BulletinCard({
  title,
  icon,
  wide,
  children
}) {
  return React.createElement("section", {
    className: wide ? "bulletin-card bulletin-card--wide" : "bulletin-card"
  }, React.createElement("h2", {
    className: "eyebrow eyebrow--moss bulletin-card__head"
  }, React.createElement(BulletinIcon, {
    name: icon || "dot",
    className: "bulletin-card__icon"
  }), title), children);
}
function hintFrom(names, max) {
  var list = (names || []).filter(Boolean);
  if (list.length === 0) return "";
  var cap = max || 4;
  var shown = list.slice(0, cap).join(" · ");
  return list.length > cap ? `${shown} · and more` : shown;
}
function BulletinFold({
  title,
  icon,
  hint,
  children
}) {
  return React.createElement("details", {
    className: "bulletin-fold"
  }, React.createElement("summary", {
    className: "bulletin-fold__head"
  }, React.createElement(BulletinIcon, {
    name: icon || "dot",
    className: "bulletin-card__icon"
  }), React.createElement("span", {
    className: "bulletin-fold__title"
  }, title), hint ? React.createElement("span", {
    className: "bulletin-fold__hint"
  }, hint) : null, React.createElement(BulletinIcon, {
    name: "chevron",
    className: "bulletin-fold__chev"
  })), React.createElement("div", {
    className: "bulletin-fold__body"
  }, children));
}
function alertParts(a) {
  if (typeof a === "string") return {
    text: a,
    icon: null
  };
  return {
    text: a && a.text || "",
    icon: a && a.icon || null
  };
}
function BulletinPage({
  go
}) {
  var [data, setData] = React.useState(null);
  var [state, setState] = React.useState("loading");
  React.useEffect(() => {
    var cancelled = false;
    fetch(BULLETIN_URL).then(r => r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))).then(json => {
      if (cancelled) return;
      if (json && json.edition) {
        var arrays = ["alerts", "areas", "valleyDay", "elsewhere", "events", "trails", "hours", "transit", "essentials", "numbers"];
        var safe = {
          ...json
        };
        for (var k of arrays) {
          if (!Array.isArray(safe[k])) safe[k] = [];
        }
        setData(safe);
        setState("ready");
      } else {
        setState("error");
      }
    }).catch(err => {
      console.error("BulletinPage: bulletin unavailable", err);
      if (!cancelled) setState("error");
    });
    return () => {
      cancelled = true;
    };
  }, []);
  var edition = data ? data.edition : null;
  var progress = edition ? editionProgress(edition) : null;
  var marked = data && data.valleyDay ? {
    access: data.valleyDay.some(p => p.access),
    allAges: data.valleyDay.some(p => p.allAges)
  } : {
    access: false,
    allAges: false
  };
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "The Park Bulletin"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "One page, the whole park"), React.createElement("h1", null, "The Park Bulletin"), React.createElement("p", {
    className: "page-head__dek"
  }, "What is different in Yosemite right now, on one page: what changed, what's open, the daily programs, the dated events, and the trails. Hours, transit and phone numbers sit folded at the bottom. Rebuilt for each edition of the park's printed Yosemite Guide."), edition && React.createElement("p", {
    className: "bulletin-edition mono"
  }, React.createElement("span", {
    className: "bulletin-edition__label"
  }, "Covering ", edition.label), progress && React.createElement("span", null, " · day ", progress.day, " of ", progress.total), !progress && editionEnded(edition) && React.createElement("span", null, " · this edition has ended"), React.createElement("span", null, " · updated ", React.createElement("time", {
    dateTime: edition.updated
  }, bulletinDate(edition.updated)))))), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 36,
      paddingBottom: 64
    }
  }, state === "loading" && React.createElement("p", {
    style: {
      color: "var(--ink-3)",
      fontStyle: "italic"
    }
  }, "Loading the current edition…"), state === "error" && React.createElement("p", {
    style: {
      color: "var(--ink-3)"
    }
  }, "The bulletin didn't load. The live layer still works:", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "webcams, entrance waits, and forecasts"), "."), state === "ready" && React.createElement(React.Fragment, null, editionEnded(edition) && React.createElement("p", {
    className: "bulletin-stale"
  }, React.createElement(BulletinIcon, {
    name: "alert",
    className: "bulletin-stale__icon"
  }), React.createElement("span", null, "This edition of the Yosemite Guide ended ", bulletinDate(edition.end), ", and the next one is being condensed now. The dated events below are over. Hours and phone numbers usually hold between editions; the", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "live layer"), " ", "(webcams, entrance waits, forecasts) stays current.")), edition.lede && React.createElement("p", {
    className: "bulletin-lede"
  }, edition.lede), data.alerts && data.alerts.length > 0 && React.createElement("section", {
    className: "bulletin-alerts"
  }, React.createElement("h2", {
    className: "eyebrow eyebrow--moss bulletin-card__head"
  }, React.createElement(BulletinIcon, {
    name: "alert",
    className: "bulletin-card__icon"
  }), "Changed this edition"), React.createElement("ul", null, data.alerts.map((a, i) => {
    var alert = alertParts(a);
    return React.createElement("li", {
      key: i
    }, React.createElement(BulletinIcon, {
      name: alert.icon || "dot",
      className: "bulletin-alerts__icon"
    }), React.createElement("span", null, alert.text));
  }))), React.createElement(BulletinCard, {
    title: "Roads & areas",
    icon: "road",
    wide: true
  }, React.createElement("div", {
    className: "bulletin-status bulletin-status--marked"
  }, data.areas.map(area => React.createElement("div", {
    className: "bulletin-status__row",
    key: area.name
  }, React.createElement("div", {
    className: "bulletin-status__name"
  }, React.createElement("span", {
    className: "bulletin-status__label"
  }, React.createElement(BulletinIcon, {
    name: iconFor(AREA_ICONS, area.name, "pin"),
    className: "bulletin-status__icon"
  }), React.createElement("strong", null, area.name)), React.createElement(BulletinChip, {
    tone: area.tone
  }, area.chip)), React.createElement("p", null, area.note))))), React.createElement("div", {
    className: "bulletin-grid"
  }, React.createElement(BulletinCard, {
    title: "The Valley, by the clock",
    icon: "clock"
  }, React.createElement("table", {
    className: "bulletin-clock"
  }, React.createElement("tbody", null, data.valleyDay.map((p, i) => React.createElement("tr", {
    key: i,
    className: p.fee ? "bulletin-clock__row bulletin-clock__row--fee" : "bulletin-clock__row"
  }, React.createElement("td", {
    className: "bulletin-clock__time mono"
  }, p.time), React.createElement("td", {
    className: "bulletin-clock__what"
  }, React.createElement("span", {
    className: "bulletin-clock__title"
  }, p.title, p.fee ? " ($)" : ""), React.createElement("span", {
    className: "bulletin-clock__meta"
  }, p.days, p.where ? ` · ${p.where}` : "", p.note ? ` · ${p.note}` : "", (p.allAges || p.access) && React.createElement("span", {
    className: "bulletin-clock__marks"
  }, p.allAges && React.createElement(BulletinIcon, {
    name: "family",
    className: "bulletin-mark",
    label: "All ages"
  }), p.access && React.createElement(BulletinIcon, {
    name: "wheelchair",
    className: "bulletin-mark",
    label: "Wheelchair accessible"
  })))))))), (marked.access || marked.allAges) && React.createElement("p", {
    className: "bulletin-legend"
  }, marked.allAges && React.createElement("span", null, React.createElement(BulletinIcon, {
    name: "family",
    className: "bulletin-mark"
  }), " all ages"), marked.access && React.createElement("span", null, React.createElement(BulletinIcon, {
    name: "wheelchair",
    className: "bulletin-mark"
  }), " wheelchair accessible"), React.createElement("span", null, "($) paid or ticketed")), data.valleyDayNote && React.createElement("p", {
    className: "bulletin-note"
  }, data.valleyDayNote)), React.createElement("div", {
    className: "bulletin-stack"
  }, data.elsewhere.map(sec => React.createElement(BulletinCard, {
    title: sec.area,
    icon: iconFor(ELSEWHERE_ICONS, sec.area, "pin"),
    key: sec.area
  }, React.createElement("ul", {
    className: "bulletin-list"
  }, sec.items.map((item, i) => React.createElement("li", {
    key: i
  }, item))))))), React.createElement(BulletinCard, {
    title: "On the calendar this edition",
    icon: "calendar",
    wide: true
  }, React.createElement("div", {
    className: "bulletin-events"
  }, data.events.map((ev, i) => React.createElement("div", {
    className: isPastEvent(ev) ? "bulletin-event is-past" : "bulletin-event",
    key: i
  }, React.createElement("span", {
    className: "bulletin-event__date mono"
  }, ev.dates), React.createElement("div", null, React.createElement("span", {
    className: "bulletin-event__title"
  }, ev.title), React.createElement("span", {
    className: "bulletin-event__meta"
  }, ev.where, ev.note ? ` · ${ev.note}` : ""))))), data.eventsNote && React.createElement("p", {
    className: "bulletin-note"
  }, data.eventsNote)), React.createElement(BulletinCard, {
    title: "Trails right now",
    icon: "route",
    wide: true
  }, React.createElement("div", {
    className: "bulletin-status"
  }, data.trails.map(t => React.createElement("div", {
    className: "bulletin-status__row",
    key: t.name
  }, React.createElement("div", {
    className: "bulletin-status__name"
  }, React.createElement("span", {
    className: "bulletin-status__label"
  }, React.createElement("strong", null, t.name)), React.createElement(BulletinChip, {
    tone: t.tone
  }, t.chip)), React.createElement("p", null, t.note)))), data.trailsNote && React.createElement("p", {
    className: "bulletin-note"
  }, data.trailsNote)), React.createElement("section", {
    className: "bulletin-ref"
  }, React.createElement("h2", {
    className: "eyebrow eyebrow--moss bulletin-ref__head"
  }, React.createElement(BulletinIcon, {
    name: "info",
    className: "bulletin-card__icon"
  }), "The standing details"), React.createElement("p", {
    className: "bulletin-ref__dek"
  }, "Hours, transit, safety, and phone numbers. These change little between editions, so they sit folded: open the one you need."), React.createElement(BulletinFold, {
    title: "Hours",
    icon: "clock",
    hint: hintFrom(data.hours.map(g => g.group), 4)
  }, data.hours.map(g => React.createElement("div", {
    className: "bulletin-ref__group",
    key: g.group
  }, React.createElement("div", {
    className: "bulletin-subhead"
  }, React.createElement(BulletinIcon, {
    name: iconFor(HOURS_ICONS, g.group, "clock"),
    className: "bulletin-subhead__icon"
  }), g.group), React.createElement("table", {
    className: "bulletin-hours"
  }, React.createElement("tbody", null, g.items.map(it => React.createElement("tr", {
    key: it.name
  }, React.createElement("td", null, it.name, it.note ? React.createElement("span", {
    className: "bulletin-hours__note"
  }, " · ", it.note) : null), React.createElement("td", {
    className: "mono"
  }, it.hours)))))))), React.createElement(BulletinFold, {
    title: "Getting around",
    icon: "bus",
    hint: hintFrom(data.transit.map(t => t.name), 4)
  }, React.createElement("div", {
    className: "bulletin-defs"
  }, data.transit.map(t => React.createElement("div", {
    className: "bulletin-def",
    key: t.name
  }, React.createElement(BulletinIcon, {
    name: iconFor(TRANSIT_ICONS, t.name, "route"),
    className: "bulletin-def__icon"
  }), React.createElement("p", null, React.createElement("strong", null, t.name, "."), " ", t.note))))), React.createElement(BulletinFold, {
    title: "Know before you go",
    icon: "alert",
    hint: hintFrom(data.essentials.map(e => e.title), 5)
  }, React.createElement("div", {
    className: "bulletin-defs"
  }, data.essentials.map(e => React.createElement("div", {
    className: "bulletin-def",
    key: e.title
  }, React.createElement(BulletinIcon, {
    name: iconFor(ESSENTIAL_ICONS, e.title, "info"),
    className: "bulletin-def__icon"
  }), React.createElement("p", null, React.createElement("strong", null, e.title, "."), " ", e.text))))), React.createElement(BulletinFold, {
    title: "By phone",
    icon: "phone",
    hint: hintFrom(data.numbers.map(n => n.label), 3)
  }, React.createElement("table", {
    className: "bulletin-hours bulletin-numbers"
  }, React.createElement("tbody", null, data.numbers.map(n => React.createElement("tr", {
    key: n.label
  }, React.createElement("td", null, n.label), React.createElement("td", {
    className: "mono"
  }, n.value))))))), React.createElement("p", {
    className: "bulletin-source"
  }, edition.source, " ", React.createElement("a", {
    href: edition.sourceUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The full Guide is on nps.gov ↗"))), React.createElement("div", {
    style: {
      marginTop: 48
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss bulletin-card__head",
    style: {
      marginBottom: 12
    }
  }, React.createElement(BulletinIcon, {
    name: "camera",
    className: "bulletin-card__icon"
  }), "The park live"), React.createElement(WebcamStrip, null), React.createElement("div", {
    style: {
      marginTop: 16,
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)"
    }
  }, "More live sources, one page:", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "webcams, entrance waits, and forecasts →"))), React.createElement(GuidePromo, {
    go: go,
    location: "now",
    title: "The Bulletin covers the week. This covers the trip.",
    body: "The Field Guide app: 50-plus stops with parking and timing notes, offline maps, a trip planner, and the secret guide. Works with no signal, which is most of the park. One purchase, eighteen months of access.",
    style: {
      marginTop: 56
    }
  }), React.createElement(NewsletterInline, {
    location: "now",
    tag: "now",
    heading: "When the next edition drops, hear about it",
    blurb: "The Sunday letter carries what changed on this board, plus whatever else the week earned. Free."
  })));
}
window.BulletinPage = BulletinPage;
