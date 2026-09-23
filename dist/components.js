var {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;
var RESPONSIVE_WIDTHS = [400, 800, 1200, 1600];
var SIZES_HERO = "(max-width: 700px) 100vw, 700px";
var SIZES_BODY = SIZES_HERO;
var SIZES_CARD = "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 360px";
function slugifyImage(image) {
  var base = String(image).split("/").pop() || "";
  return base.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function ResponsiveImage({
  image,
  alt,
  sizes,
  widths,
  eager,
  className,
  style
}) {
  var isExternal = /^https?:/i.test(image);
  var loadProps = {
    loading: eager ? "eager" : "lazy",
    fetchpriority: eager ? "high" : "auto",
    decoding: eager ? "sync" : "async",
    referrerPolicy: "no-referrer"
  };
  if (isExternal) {
    return React.createElement("img", {
      className: className,
      src: image,
      alt: alt || "",
      style: style,
      ...loadProps
    });
  }
  var cleaned = image.replace(/^\//, "");
  var lastSlash = cleaned.lastIndexOf("/");
  var dir = lastSlash >= 0 ? cleaned.slice(0, lastSlash) : "";
  var respBase = `/${dir ? dir + "/" : ""}responsive/${slugifyImage(cleaned)}`;
  var ws = widths || RESPONSIVE_WIDTHS;
  var srcSet = ext => ws.map(w => `${respBase}-${w}.${ext} ${w}w`).join(", ");
  var sizesAttr = sizes || SIZES_HERO;
  return React.createElement("picture", null, React.createElement("source", {
    type: "image/avif",
    srcSet: srcSet("avif"),
    sizes: sizesAttr
  }), React.createElement("source", {
    type: "image/webp",
    srcSet: srcSet("webp"),
    sizes: sizesAttr
  }), React.createElement("img", {
    className: className,
    src: `/${cleaned}`,
    srcSet: srcSet("jpg"),
    sizes: sizesAttr,
    alt: alt || "",
    style: style,
    ...loadProps
  }));
}
function preloadResponsive(image, sizes) {
  if (!image || /^https?:/i.test(image)) return;
  var cleaned = image.replace(/^\//, "");
  var lastSlash = cleaned.lastIndexOf("/");
  var dir = lastSlash >= 0 ? cleaned.slice(0, lastSlash) : "";
  var respBase = `/${dir ? dir + "/" : ""}responsive/${slugifyImage(cleaned)}`;
  var id = `preload-${respBase}`;
  if (document.getElementById(id)) return;
  var link = document.createElement("link");
  link.id = id;
  link.rel = "preload";
  link.as = "image";
  link.type = "image/avif";
  link.setAttribute("imagesrcset", RESPONSIVE_WIDTHS.map(w => `${respBase}-${w}.avif ${w}w`).join(", "));
  link.setAttribute("imagesizes", sizes || SIZES_HERO);
  link.setAttribute("fetchpriority", "high");
  document.head.appendChild(link);
}
function Placeholder({
  caption,
  tag,
  size,
  style,
  motif,
  image,
  credit,
  natural,
  eager,
  sizes
}) {
  return React.createElement("div", {
    className: `placeholder ${size === "lg" ? "placeholder--lg" : ""} ${size === "sm" ? "placeholder--sm" : ""} ${image ? "placeholder--photo" : ""} ${natural ? "placeholder--natural" : ""}`,
    "data-tag": tag || "PLATE",
    style: style
  }, image && React.createElement(ResponsiveImage, {
    className: "placeholder__img",
    image: image,
    alt: caption || "",
    eager: eager,
    sizes: sizes || SIZES_HERO
  }), !image && motif && React.createElement("div", {
    className: "placeholder__motif"
  }, motif), credit && React.createElement("div", {
    className: "placeholder__credit"
  }, credit));
}
function MotifMountains() {
  return React.createElement("svg", {
    viewBox: "0 0 200 100",
    preserveAspectRatio: "none",
    width: "100%",
    height: "100%"
  }, React.createElement("path", {
    d: "M0,90 L40,40 L65,60 L95,20 L130,55 L160,35 L200,70 L200,100 L0,100 Z",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.2"
  }), React.createElement("path", {
    d: "M0,95 L25,75 L55,85 L80,70 L120,80 L150,65 L200,85 L200,100 L0,100 Z",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "0.8",
    opacity: "0.5"
  }));
}
function MotifSun() {
  return React.createElement("svg", {
    viewBox: "0 0 200 100",
    preserveAspectRatio: "none",
    width: "100%",
    height: "100%"
  }, React.createElement("circle", {
    cx: "160",
    cy: "38",
    r: "18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1"
  }), React.createElement("line", {
    x1: "0",
    y1: "78",
    x2: "200",
    y2: "78",
    stroke: "currentColor",
    strokeWidth: "0.8",
    opacity: "0.5"
  }));
}
function MotifTrees() {
  return React.createElement("svg", {
    viewBox: "0 0 200 100",
    preserveAspectRatio: "none",
    width: "100%",
    height: "100%"
  }, React.createElement("line", {
    x1: "20",
    y1: "20",
    x2: "20",
    y2: "92",
    stroke: "currentColor",
    strokeWidth: "1"
  }), React.createElement("line", {
    x1: "55",
    y1: "32",
    x2: "55",
    y2: "92",
    stroke: "currentColor",
    strokeWidth: "1"
  }), React.createElement("line", {
    x1: "88",
    y1: "14",
    x2: "88",
    y2: "92",
    stroke: "currentColor",
    strokeWidth: "1"
  }), React.createElement("line", {
    x1: "125",
    y1: "28",
    x2: "125",
    y2: "92",
    stroke: "currentColor",
    strokeWidth: "1"
  }), React.createElement("line", {
    x1: "162",
    y1: "20",
    x2: "162",
    y2: "92",
    stroke: "currentColor",
    strokeWidth: "1"
  }));
}
var WAITS_BASE = "https://npsvms-338365424831-us-west-1-an.s3.us-west-1.amazonaws.com/yose/transit-time/display/public/";
var WAITS_URL = WAITS_BASE + "waits.json";
var WAITS_PAGE_URL = WAITS_BASE + "index.html";
var WAITS_REFRESH_MS = 5 * 60 * 1000;
var WAITS_SHORT_NAMES = {
  "South Entrance Wait Time": "South",
  "Arch Rock Wait Time": "Arch Rock",
  "Big Oak Flat Wait Time": "Big Oak Flat"
};
function parseWaitsSummary(text) {
  var key = text.indexOf('"summary"');
  if (key === -1) return null;
  var start = text.indexOf("[", key);
  if (start === -1) return null;
  var depth = 0;
  for (var i = start; i < text.length; i++) {
    var ch = text[i];
    if (ch === "[") depth++;else if (ch === "]" && --depth === 0) {
      try {
        return JSON.parse(text.slice(start, i + 1));
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}
function waitClass(min) {
  if (min == null) return "nodata";
  if (min <= 5) return "good";
  if (min <= 15) return "moderate";
  return "long";
}
function formatWaitMinutes(min) {
  if (min < 60) return Math.round(min) + " min";
  var h = Math.floor(min / 60);
  return h + "h " + Math.round(min % 60) + "m";
}
var GATE_BOARD = [{
  key: "Arch Rock Wait Time",
  name: "Arch Rock",
  road: "Hwy 140 · west",
  note: "The El Portal road, and the way most trips come in. First to back up."
}, {
  key: "Big Oak Flat Wait Time",
  name: "Big Oak Flat",
  road: "Hwy 120 · west",
  note: "From Groveland and the north. Holds up better than 140 until mid-morning."
}, {
  key: "South Entrance Wait Time",
  name: "South",
  road: "Hwy 41 · Fish Camp",
  note: "Oakhurst and the south end. Also the gate for Mariposa Grove."
}];
var WAIT_TONE_LABEL = {
  good: "Short",
  moderate: "Moderate",
  long: "Long",
  nodata: "No reading"
};
function longestWait(summary) {
  if (!Array.isArray(summary)) return null;
  var worst = null;
  summary.forEach(pair => {
    if (!pair || pair.stale) return;
    var min = pair.current_wait_minutes;
    if (typeof min !== "number" || !isFinite(min)) return;
    if (!worst || min > worst.minutes) {
      worst = {
        name: WAITS_SHORT_NAMES[pair.pair_name] || String(pair.pair_name || "").replace(/\s*Wait Time$/i, "") || "Entrance",
        minutes: min,
        text: formatWaitMinutes(min),
        tone: waitClass(min)
      };
    }
  });
  return worst;
}
function GateReadout({
  waits
}) {
  var byKey = {};
  (waits || []).forEach(pair => {
    if (pair && pair.pair_name) byKey[pair.pair_name] = pair;
  });
  return React.createElement("ul", {
    className: "hp-gates"
  }, GATE_BOARD.map(gate => {
    var pair = byKey[gate.key];
    var raw = pair && !pair.stale ? pair.current_wait_minutes : null;
    var min = typeof raw === "number" && isFinite(raw) ? raw : null;
    var tone = waitClass(min);
    return React.createElement("li", {
      key: gate.key,
      className: `hp-gates__row hp-gates__row--${tone}`
    }, React.createElement("span", {
      className: "hp-gates__name"
    }, gate.name, React.createElement("small", null, gate.road)), React.createElement("span", {
      className: "hp-gates__read"
    }, min == null ? "—" : formatWaitMinutes(min), React.createElement("small", null, waits ? WAIT_TONE_LABEL[tone] : "\u00a0")));
  }));
}
function EntranceWaits({
  variant,
  onData
}) {
  var [waits, setWaits] = useState(null);
  var onDataRef = useRef(onData);
  useEffect(() => {
    onDataRef.current = onData;
  });
  useEffect(() => {
    var cancelled = false;
    var load = () => {
      fetch(WAITS_URL, {
        headers: {
          Range: "bytes=0-8191"
        }
      }).then(r => r.ok ? r.text() : Promise.reject(new Error("HTTP " + r.status))).then(text => {
        var summary = parseWaitsSummary(text);
        if (!cancelled && Array.isArray(summary) && summary.length) {
          setWaits(summary);
          if (onDataRef.current) onDataRef.current({
            summary,
            longest: longestWait(summary)
          });
        }
      }).catch(() => {});
    };
    load();
    var timer = setInterval(load, WAITS_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);
  if (variant === "menu") return React.createElement(GateReadout, {
    waits: waits
  });
  if (variant === "board") {
    var byKey = {};
    (waits || []).forEach(pair => {
      if (pair && pair.pair_name) byKey[pair.pair_name] = pair;
    });
    return React.createElement("div", {
      className: "gates",
      role: "region",
      "aria-label": "Live entrance station waits"
    }, GATE_BOARD.map(gate => {
      var pair = byKey[gate.key];
      var min = pair && !pair.stale ? pair.current_wait_minutes : null;
      var tone = waitClass(min);
      return React.createElement("a", {
        key: gate.key,
        className: `gate gate--${tone}`,
        href: WAITS_PAGE_URL,
        target: "_blank",
        rel: "noopener noreferrer"
      }, React.createElement("span", {
        className: "gate__name"
      }, gate.name), React.createElement("span", {
        className: "gate__road"
      }, gate.road), React.createElement("span", {
        className: "gate__read"
      }, React.createElement("span", {
        className: "gate__num"
      }, min == null ? "—" : Math.round(min)), min != null && React.createElement("span", {
        className: "gate__unit"
      }, "min"), React.createElement("span", {
        className: "gate__tone"
      }, WAIT_TONE_LABEL[tone])), React.createElement("span", {
        className: "gate__note"
      }, gate.note));
    }));
  }
  if (!waits) return React.createElement("span", {
    className: "masthead__waits masthead__waits--ph",
    "aria-hidden": "true"
  });
  return React.createElement("a", {
    className: "masthead__waits",
    href: WAITS_PAGE_URL,
    target: "_blank",
    rel: "noopener noreferrer",
    title: "Live entrance station wait times, National Park Service"
  }, React.createElement("span", {
    className: "masthead__waits-label"
  }, "Entrance waits"), waits.map((pair, i) => {
    var name = WAITS_SHORT_NAMES[pair.pair_name] || String(pair.pair_name || "").replace(/\s*Wait Time$/i, "") || "Entrance";
    var min = pair.stale ? null : pair.current_wait_minutes;
    return React.createElement(React.Fragment, {
      key: pair.pair_name || i
    }, i > 0 && React.createElement("span", {
      className: "masthead__weather-sep"
    }, "·"), React.createElement("span", {
      className: `masthead__wait masthead__wait--${waitClass(min)}`
    }, name, " ", min == null ? "n/a" : formatWaitMinutes(min)));
  }));
}
var PARKING_URL = "https://api.thetalusfieldjournal.com/api/parking";
var PARKING_REFRESH_MS = 5 * 60 * 1000;
var PARKING_STALE_MS = 60 * 60 * 1000;
var PARKING_STATUS_LABEL = {
  open: "Open",
  full: "Full",
  closed: "Closed"
};
function ParkingNow({
  variant,
  onData
}) {
  var [data, setData] = useState(null);
  var onDataRef = useRef(onData);
  useEffect(() => {
    onDataRef.current = onData;
  });
  useEffect(() => {
    var cancelled = false;
    var load = () => {
      fetch(PARKING_URL).then(r => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))).then(body => {
        if (!cancelled && body && Array.isArray(body.lots)) setData(body);
      }).catch(() => {});
    };
    load();
    var timer = setInterval(load, PARKING_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);
  var fetched = data && data.fetchedAt ? Date.parse(data.fetchedAt) : NaN;
  var fresh = isFinite(fetched) && Date.now() - fetched <= PARKING_STALE_MS;
  var lots = fresh ? data.lots.filter(l => l && PARKING_STATUS_LABEL[l.status]) : [];
  var openCount = lots.filter(l => l.status === "open").length;
  var lotCount = lots.length;
  var fetchedKey = isFinite(fetched) ? fetched : 0;
  useEffect(() => {
    if (!onDataRef.current) return;
    onDataRef.current(lotCount ? {
      open: openCount,
      total: lotCount,
      fetchedAt: fetchedKey
    } : null);
  }, [lotCount, openCount, fetchedKey]);
  if (!lots.length) return null;
  var ageMin = Math.max(0, Math.round((Date.now() - fetched) / 60000));
  var age = ageMin === 0 ? "just now" : ageMin + " min ago";
  if (variant === "board") {
    return React.createElement("div", {
      className: "lots",
      role: "region",
      "aria-label": "Live parking lot status"
    }, React.createElement("ul", {
      className: "lots__list"
    }, lots.map(l => React.createElement("li", {
      key: l.id || l.name,
      className: `lots__row lots__row--${l.status}`
    }, React.createElement("span", {
      className: "lots__name"
    }, l.name), React.createElement("span", {
      className: "lots__read"
    }, React.createElement("span", {
      className: "lots__status"
    }, PARKING_STATUS_LABEL[l.status]), typeof l.capacity === "number" && React.createElement("span", {
      className: "lots__cap"
    }, l.capacity, " spaces free"))))), React.createElement("p", {
      className: "lots__meta"
    }, "National Park Service, ", age, ". Text ", React.createElement("em", null, "ynptraffic"), " to 333111 for the park's own updates before you lose signal."));
  }
  return React.createElement("div", {
    className: "parking-now",
    role: "region",
    "aria-label": "Live parking lot status"
  }, React.createElement("ul", {
    className: "parking-now__list"
  }, lots.map(l => React.createElement("li", {
    key: l.id || l.name,
    className: `parking-now__row parking-now__row--${l.status}`
  }, React.createElement("span", {
    className: "parking-now__name"
  }, l.name), React.createElement("span", {
    className: "parking-now__status"
  }, PARKING_STATUS_LABEL[l.status]), typeof l.capacity === "number" && React.createElement("span", {
    className: "parking-now__cap"
  }, l.capacity, " spaces")))), React.createElement("p", {
    className: "parking-now__meta"
  }, "NPS, ", age, " · text ", React.createElement("em", null, "ynptraffic"), " to 333111 before you lose signal"));
}
window.ParkingNow = ParkingNow;
var rockfallReleased = false;
var ROCKFALL_SHAPES = ['<svg viewBox="0 0 20 20"><polygon points="3,7 11,2 18,6 16,15 6,17" fill="#cfccbd" stroke="#262b23" stroke-width="2" stroke-linejoin="round"/><polyline points="3,7 10,9 16,15" fill="none" stroke="#262b23" stroke-width="1.4"/><line x1="10" y1="9" x2="11" y2="2" stroke="#262b23" stroke-width="1.4"/></svg>', '<svg viewBox="0 0 20 20"><polygon points="10,1 18,8 13,18 4,14 2,6" fill="#b3b1a3" stroke="#262b23" stroke-width="2" stroke-linejoin="round"/><polyline points="2,6 9,9 13,18" fill="none" stroke="#262b23" stroke-width="1.4"/></svg>', '<svg viewBox="0 0 20 20"><polygon points="2,9 9,4 18,7 17,13 7,16" fill="#8f8e81" stroke="#262b23" stroke-width="2" stroke-linejoin="round"/><line x1="9" y1="4" x2="10" y2="15" stroke="#262b23" stroke-width="1.4"/></svg>', '<svg viewBox="0 0 20 20"><polygon points="4,5 14,3 17,10 12,17 3,13" fill="#4a5540" stroke="#262b23" stroke-width="2" stroke-linejoin="round"/><polyline points="4,5 10,10 12,17" fill="none" stroke="#262b23" stroke-width="1.4"/></svg>'];
function releaseRockfall(markEl) {
  if (rockfallReleased || !markEl) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof markEl.animate !== "function") return;
  rockfallReleased = true;
  var rect = markEl.getBoundingClientRect();
  var layer = document.createElement("div");
  layer.className = "rockfall";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  var count = 6 + Math.floor(Math.random() * 3);
  var live = count;
  var _loop = function () {
    var size = 7 + Math.random() * 9;
    var rock = document.createElement("div");
    rock.className = "rockfall__rock";
    rock.innerHTML = ROCKFALL_SHAPES[Math.floor(Math.random() * ROCKFALL_SHAPES.length)];
    var startY = rect.top + rect.height * (0.55 + Math.random() * 0.35);
    rock.style.left = `${rect.left + rect.width * (0.15 + Math.random() * 0.7)}px`;
    rock.style.top = `${startY}px`;
    rock.style.width = `${size}px`;
    rock.style.height = `${size}px`;
    layer.appendChild(rock);
    var fall = window.innerHeight - startY + size * 2;
    var drift = (Math.random() - 0.5) * 90;
    var hop = -(4 + Math.random() * 10);
    var spin = (Math.random() < 0.5 ? -1 : 1) * (140 + Math.random() * 420);
    var done = () => {
      rock.remove();
      if (--live === 0) layer.remove();
    };
    var anim = rock.animate([{
      transform: "translate(0, 0) rotate(0deg)"
    }, {
      transform: `translate(${drift * 0.2}px, ${hop}px) rotate(${spin * 0.12}deg)`,
      offset: 0.12
    }, {
      transform: `translate(${drift}px, ${fall}px) rotate(${spin}deg)`
    }], {
      duration: 900 + Math.random() * 700 + fall * 0.25,
      delay: Math.random() * 260,
      easing: "cubic-bezier(0.45, 0.05, 0.85, 0.5)",
      fill: "forwards"
    });
    anim.onfinish = done;
    anim.oncancel = done;
  };
  for (var i = 0; i < count; i++) {
    _loop();
  }
  setTimeout(() => {
    if (layer.parentNode) layer.remove();
  }, 5000);
}
var NAV_GROUPS = [{
  key: "plan",
  label: "Plan a trip",
  route: "planning",
  cta: "The Planning Guide →",
  blurb: "The trip, in the order the decisions actually come at you.",
  aside: {
    eyebrow: "Trip selector",
    title: "Five questions, one plan.",
    text: "When, how long, where you sleep, who is coming, and what matters most.",
    link: {
      key: "planning",
      hash: "trip-selector",
      label: "Start the selector"
    }
  },
  feature: "map",
  columns: [{
    heading: "Decide",
    links: [{
      key: "start-here",
      onHome: "home-start-here",
      label: "Start here",
      note: "Your first trip, the questions in order"
    }, {
      key: "planning",
      label: "The Planning Guide",
      note: "The whole archive, in trip order"
    }, {
      key: "itineraries",
      label: "Itineraries",
      note: "Half-day to three-day plans, in drive order"
    }, {
      key: "consult",
      label: "Trip consults",
      note: "Thirty minutes, one on one. Paid"
    }]
  }, {
    heading: "Book and get there",
    links: [{
      key: "stay",
      label: "Where to stay",
      note: "In-park lodging and the gateway towns"
    }, {
      key: "distances",
      label: "Drive times",
      note: "How far the Valley is from every gateway town"
    }, {
      key: "international",
      label: "Visiting from abroad",
      note: "The non-resident entrance fee, and the cheapest way in"
    }, {
      key: "checklist",
      label: "First-week checklist",
      note: "What to do in the week before you go"
    }, {
      key: "kit",
      label: "Kit",
      note: "What earns its place in the pack"
    }]
  }]
}, {
  key: "now",
  label: "Park now",
  route: "now",
  cta: "The Park Bulletin →",
  blurb: "What is open, what is on, and what the gates look like.",
  aside: {
    eyebrow: "Road alerts",
    title: "One email when a road changes.",
    text: "Tioga Road, Glacier Point Road, and the highways in, sent when an opening or a closure is confirmed.",
    link: {
      key: "conditions",
      hash: "road-alerts",
      label: "Get road alerts"
    }
  },
  feature: "waits",
  columns: [{
    heading: "Today",
    links: [{
      key: "now",
      label: "The Park Bulletin",
      note: "What is happening in the park right now"
    }, {
      key: "conditions",
      label: "Conditions",
      note: "Gates, lots, roads, and who to call"
    }, {
      key: "webcams",
      label: "Webcams",
      note: "The live views, and how to read them"
    }]
  }, {
    heading: "The calendar",
    links: [{
      key: "dates",
      label: "Dates that matter",
      note: "Lotteries, release mornings, road windows, as calendar files"
    }, {
      key: "tioga-opening",
      label: "Tioga Road opening",
      note: "When the high country actually opens"
    }, {
      key: "firefall",
      label: "Firefall",
      note: "Whether to plan a trip around Horsetail Fall"
    }, {
      key: "half-dome-lottery",
      label: "Half Dome lottery",
      note: "The permit odds, plainly"
    }]
  }]
}, {
  key: "map",
  label: "Map",
  route: "map"
}, {
  key: "read",
  label: "Read",
  route: "articles",
  cta: "All articles →",
  blurb: "The journal itself: everything published, by section.",
  feature: "newest",
  columns: [{
    heading: "Sections",
    links: [{
      key: "cat:planning",
      label: "Planning",
      note: "Permits, timing, transit, lodging"
    }, {
      key: "cat:trails",
      label: "Trails and hikes",
      note: "Routes and conditions, kept current"
    }, {
      key: "cat:wildlife",
      label: "Wildlife and nature",
      note: "What is moving and what is blooming"
    }, {
      key: "cat:seasonal",
      label: "Seasonal guides",
      note: "The park, month by month"
    }]
  }, {
    heading: "From the archive",
    links: [{
      href: "/archive/",
      label: "Nature Notes archive",
      note: "512 issues of the park's own bulletin"
    }, {
      key: "films",
      label: "Films",
      note: "The NPS Nature Notes film series, annotated"
    }, {
      key: "newsletter",
      onHome: "home-newsletter",
      label: "The Sunday Letter",
      note: "One short letter a week. Free"
    }, {
      key: "explore",
      label: "Everything on this site",
      note: "Every page, with a line on each"
    }]
  }]
}, {
  key: "guide",
  label: "Field Guide",
  route: "guide"
}];
window.NAV_GROUPS = NAV_GROUPS;
function HomeLink({
  go,
  href,
  location,
  children,
  ...props
}) {
  return React.createElement("a", {
    ...props,
    href: href,
    onClick: event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (/^(https?:|tel:|mailto:|\/archive\/)/.test(href)) return;
      if (window.track) window.track(href === "/guide" ? "guide_cta_click" : "cta_click", {
        location,
        target: href
      });
      if (href.startsWith("#")) {
        var section = document.getElementById(href.slice(1));
        if (!section) return;
        event.preventDefault();
        section.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start"
        });
        section.focus({
          preventScroll: true
        });
        return;
      }
      event.preventDefault();
      go(href.startsWith("/articles/") ? `a:${href.slice(10)}` : href.startsWith("/section/") ? `cat:${href.slice(9)}` : href.slice(1) || "home");
    }
  }, children);
}
var HOME_NAV = [{
  label: "Plan a trip",
  group: "plan"
}, {
  label: "Park now",
  group: "now"
}, {
  href: "/map",
  label: "Map"
}, {
  label: "Read",
  group: "read"
}];
var homeMenuCta = cta => `${(cta || "Open the section").replace(/\s*→\s*$/, "")} ↗`;
function navGroupOf(current) {
  if (!current || current === "home") return null;
  var g = NAV_GROUPS.find(group => group.columns && (group.route === current || group.columns.some(col => col.links.some(l => l.key === current))));
  return g ? g.key : null;
}
function NavMapFeature({
  link
}) {
  var pins = [[30, 78], [74, 58], [120, 68], [164, 36], [206, 48]];
  return React.createElement("div", {
    className: "hp-navfeat hp-navfeat--map"
  }, React.createElement("p", {
    className: "hp-menu__heading"
  }, "The trip map"), React.createElement("svg", {
    className: "hp-navfeat__art",
    viewBox: "0 0 236 104",
    "aria-hidden": "true",
    focusable: "false"
  }, React.createElement("path", {
    className: "hp-navfeat__contour",
    d: "M-6 80 C 30 64, 58 88, 96 70 S 170 30, 246 44"
  }), React.createElement("path", {
    className: "hp-navfeat__contour",
    d: "M-6 54 C 26 40, 64 60, 104 44 S 176 12, 246 22"
  }), React.createElement("path", {
    className: "hp-navfeat__contour",
    d: "M-6 100 C 40 88, 80 106, 128 92 S 196 66, 246 74"
  }), React.createElement("path", {
    className: "hp-navfeat__route",
    d: "M30 78 L 74 58 L 120 68 L 164 36 L 206 48"
  }), pins.map(([x, y]) => React.createElement("circle", {
    key: x,
    className: "hp-navfeat__pin",
    cx: x,
    cy: y,
    r: "5"
  }))), React.createElement("p", {
    className: "hp-navfeat__text"
  }, "Every pin in the park, assembled into a route you can share or open in the Field Guide."), link({
    key: "map",
    label: "Open the map ↗"
  }, "hp-link"));
}
function NavWaitsFeature({
  live,
  link
}) {
  return React.createElement("div", {
    className: "hp-navfeat hp-navfeat--waits"
  }, React.createElement("p", {
    className: "hp-menu__heading"
  }, "Entrance waits, live"), live ? React.createElement(EntranceWaits, {
    variant: "menu"
  }) : React.createElement(GateReadout, {
    waits: null
  }), React.createElement("p", {
    className: "hp-navfeat__text"
  }, "Read from the Park Service's own feed. A dash means no current reading."), link({
    key: "conditions",
    hash: "cond-waits",
    label: "Gates and lots on Conditions ↗"
  }, "hp-link"));
}
function NavNewestFeature({
  link
}) {
  var newest = (window.ARTICLES || []).slice().sort((a, b) => String(b.isoDate || "").localeCompare(String(a.isoDate || ""))).slice(0, 3);
  if (!newest.length) return null;
  return React.createElement("div", {
    className: "hp-menu__col hp-menu__col--newest"
  }, React.createElement("p", {
    className: "hp-menu__heading"
  }, "Newest"), newest.map(a => {
    var cat = window.findCategory ? window.findCategory(a.cat) : null;
    var note = [cat && cat.label, a.read].filter(Boolean).join(" · ");
    return link({
      key: `a:${a.slug}`,
      label: a.title,
      note
    }, "hp-menu__link");
  }));
}
var SEARCH_JUMPS = [{
  key: "now",
  title: "The Park Bulletin",
  kind: "Park now"
}, {
  key: "conditions",
  title: "Conditions",
  kind: "Park now"
}, {
  key: "map",
  title: "The trip map",
  kind: "Map"
}, {
  key: "stay",
  title: "Where to stay",
  kind: "Plan a trip"
}];
function MastheadSearch({
  go,
  location
}) {
  var [query, setQuery] = useState("");
  var [open, setOpen] = useState(false);
  var [active, setActive] = useState(-1);
  var [ready, setReady] = useState(false);
  var inputRef = useRef(null);
  var q = query.trim();
  var load = () => {
    if (typeof window.searchCatalog === "function") {
      setReady(true);
      return;
    }
    if (typeof window.ensureRoute !== "function") return;
    window.ensureRoute("search").then(() => setReady(typeof window.searchCatalog === "function")).catch(() => {});
  };
  var results = useMemo(() => {
    if (!q) return SEARCH_JUMPS;
    if (!ready || typeof window.searchCatalog !== "function") return [];
    var exact = window.searchCatalog(q, {
      limit: 6
    });
    return exact.length ? exact : window.searchCatalog(q, {
      fuzzy: true,
      limit: 6
    });
  }, [q, ready]);
  var options = q ? [...results, {
    all: true,
    key: "search"
  }] : results;
  var pathFor = r => r.all ? `/search?q=${encodeURIComponent(q)}` : r.path || (window.routeToPath ? window.routeToPath(r.key) : `/${r.key}`);
  var reset = () => {
    setOpen(false);
    setActive(-1);
    setQuery("");
    if (inputRef.current) inputRef.current.blur();
  };
  var toSearchPage = text => {
    var url = text ? `/search?q=${encodeURIComponent(text)}` : "/search";
    if (window.track) window.track("nav_search_submit", {
      location,
      has_query: text ? "1" : "0"
    });
    reset();
    if (window.location.pathname.replace(/\/+$/, "") === "/search") {
      window.location.assign(url);
      return;
    }
    window.history.pushState({
      route: "search"
    }, "", url);
    go("search");
  };
  var pick = (r, i, e) => {
    if (r.all) {
      toSearchPage(q);
      return;
    }
    var path = pathFor(r);
    if (window.track) window.track("nav_search_pick", {
      location,
      target: path,
      rank: String(i + 1),
      has_query: q ? "1" : "0"
    });
    reset();
    if (r.path) {
      window.location.assign(r.path);
      return;
    }
    if (e) e.preventDefault();
    go(r.key);
  };
  var onKeyDown = e => {
    var n = options.length;
    if (e.key === "ArrowDown" && n) {
      e.preventDefault();
      setOpen(true);
      setActive(i => (i + 1) % n);
    } else if (e.key === "ArrowUp" && n) {
      e.preventDefault();
      setOpen(true);
      setActive(i => i <= 0 ? n - 1 : i - 1);
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      } else if (inputRef.current) inputRef.current.blur();
    } else if (e.key === "Enter" && open && active >= 0 && options[active]) {
      e.preventDefault();
      pick(options[active], active);
    }
  };
  var showList = open && (options.length > 0 || q);
  var listId = "masthead-search-list";
  var optId = i => `masthead-search-opt-${i}`;
  return React.createElement("form", {
    className: "hp-search",
    role: "search",
    action: "/search",
    method: "get",
    onSubmit: e => {
      e.preventDefault();
      toSearchPage(q);
    },
    onBlur: e => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setOpen(false);
        setActive(-1);
      }
    }
  }, React.createElement("label", {
    className: "hp-search__field"
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "15",
    height: "15",
    "aria-hidden": "true",
    focusable: "false"
  }, React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "6.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }), React.createElement("line", {
    x1: "16",
    y1: "16",
    x2: "21",
    y2: "21",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  })), React.createElement("input", {
    ref: inputRef,
    id: "masthead-search",
    type: "search",
    name: "q",
    value: query,
    placeholder: "Search the journal",
    "aria-label": "Search the journal",
    autoComplete: "off",
    role: "combobox",
    "aria-autocomplete": "list",
    "aria-expanded": showList ? "true" : "false",
    "aria-controls": listId,
    "aria-activedescendant": showList && active >= 0 ? optId(active) : undefined,
    onFocus: () => {
      setOpen(true);
      load();
    },
    onChange: e => {
      setQuery(e.target.value);
      setOpen(true);
      setActive(-1);
    },
    onKeyDown: onKeyDown
  }), React.createElement("kbd", {
    "aria-hidden": "true"
  }, "/")), showList && React.createElement("div", {
    className: "hp-search__list",
    id: listId,
    role: "listbox",
    "aria-label": q ? `Results for ${q}` : "Jump to"
  }, !q && React.createElement("p", {
    className: "hp-search__head"
  }, "Jump to"), q && results.length === 0 && React.createElement("p", {
    className: "hp-search__empty"
  }, ready ? `Nothing in titles, sections or deks matches “${q}”. Search does not read article bodies.` : "Searching…"), options.map((r, i) => React.createElement("a", {
    key: r.all ? "all" : `${r.key || r.path}-${i}`,
    id: optId(i),
    role: "option",
    "aria-selected": i === active,
    tabIndex: -1,
    href: pathFor(r),
    className: ["hp-search__opt", r.all && "hp-search__all", i === active && "is-active"].filter(Boolean).join(" "),
    onMouseDown: e => e.preventDefault(),
    onMouseEnter: () => setActive(i),
    onClick: e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      pick(r, i, e);
    }
  }, r.all ? `All results for “${q}” ↗` : React.createElement(React.Fragment, null, React.createElement("span", {
    className: "hp-search__kind"
  }, r.kind), React.createElement("span", {
    className: "hp-search__title"
  }, r.title))))));
}
var NAV_HEADROOM_ROUTES = new Set(["stay"]);
function HomeMasthead({
  go,
  current = "home",
  route
}) {
  var home = current === "home";
  var location = home ? "home_navigation" : "site_navigation";
  var exact = route || current;
  var here = r => current === r ? "page" : undefined;
  var inGroup = navGroupOf(current);
  var [open, setOpen] = useState(null);
  var [pinned, setPinned] = useState(false);
  var [nowSeen, setNowSeen] = useState(false);
  var closeTimer = useRef(null);
  var blockRef = useRef(null);
  var headerRef = useRef(null);
  var navRef = useRef(null);
  var openMenu = (key, byHover) => {
    clearTimeout(closeTimer.current);
    setOpen(key);
    setPinned(!byHover);
    if (key === "now") setNowSeen(true);
  };
  var closeMenu = () => {
    clearTimeout(closeTimer.current);
    setOpen(null);
    setPinned(false);
  };
  var closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(null);
      setPinned(false);
    }, 400);
  };
  var fromMouse = e => e.pointerType === "mouse";
  var focusFirst = panelId => setTimeout(() => {
    var panel = document.getElementById(panelId);
    var first = panel && panel.querySelector("a[href]");
    if (first) first.focus();
  }, 0);
  var openRef = useRef(open);
  openRef.current = open;
  var closeRef = useRef(closeMenu);
  closeRef.current = closeMenu;
  React.useEffect(() => () => clearTimeout(closeTimer.current), []);
  React.useEffect(() => {
    if (!open) return undefined;
    var onKey = e => {
      if (e.key !== "Escape") return;
      var group = navRef.current && navRef.current.querySelector(`[data-menu="${open}"]`);
      if (group && group.contains(document.activeElement)) {
        var trigger = group.querySelector(".hp-menu__trigger");
        if (trigger) trigger.focus();
      }
      closeMenu();
    };
    var onDown = e => {
      if (navRef.current && !navRef.current.contains(e.target)) closeMenu();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);
  React.useEffect(() => {
    var block = blockRef.current;
    var header = headerRef.current;
    if (!block || !header || current === "map") return undefined;
    var root = document.documentElement;
    var phone = window.matchMedia("(max-width: 760px)");
    var stuck = false;
    var shown = false;
    var slotBottom = 0;
    var lastY = window.scrollY;
    var raf = 0;
    var headroom = () => phone.matches || NAV_HEADROOM_ROUTES.has(current);
    var setMode = () => root.setAttribute("data-nav-mode", headroom() ? "headroom" : "pinned");
    var measure = () => {
      slotBottom = block.offsetTop + block.offsetHeight;
    };
    var show = next => {
      if (next === shown) return;
      shown = next;
      block.classList.toggle("is-shown", next);
      if (next) root.setAttribute("data-nav-compact", "");else root.removeAttribute("data-nav-compact");
    };
    var stick = next => {
      if (next === stuck) return;
      if (openRef.current) closeRef.current();
      stuck = next;
      if (next) {
        block.style.height = `${block.offsetHeight}px`;
        block.classList.add("is-stuck");
      } else {
        show(false);
        block.classList.remove("is-stuck");
        block.style.height = "";
      }
    };
    var update = () => {
      raf = 0;
      var y = window.scrollY;
      var dy = y - lastY;
      if (Math.abs(dy) > 6) lastY = y;
      if (y <= slotBottom) {
        stick(false);
        return;
      }
      if (!stuck) {
        stick(true);
        raf = requestAnimationFrame(update);
        return;
      }
      if (!headroom() || openRef.current || header.contains(document.activeElement)) show(true);else if (dy < -6) show(true);else if (dy > 6) show(false);
    };
    var onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    var remeasure = () => {
      setMode();
      if (stuck) {
        block.classList.remove("is-stuck");
        block.style.height = "";
        measure();
        block.style.height = `${block.offsetHeight}px`;
        block.classList.add("is-stuck");
      } else {
        measure();
      }
      onScroll();
    };
    var onFocusIn = () => {
      if (stuck) show(true);
    };
    setMode();
    measure();
    update();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    window.addEventListener("resize", remeasure);
    header.addEventListener("focusin", onFocusIn);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure).catch(() => {});
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      header.removeEventListener("focusin", onFocusIn);
      block.classList.remove("is-stuck", "is-shown");
      block.style.height = "";
      root.removeAttribute("data-nav-compact");
      root.removeAttribute("data-nav-mode");
    };
  }, [current]);
  var follow = (key, hash) => {
    if (!hash) {
      go(key);
      return;
    }
    var jump = () => {
      var started = Date.now();
      var tick = () => {
        var el = document.getElementById(hash);
        if (el) {
          var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          el.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "start"
          });
          if (el.hasAttribute("tabindex")) el.focus({
            preventScroll: true
          });
          return;
        }
        if (Date.now() - started < 4000) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (exact === key) {
      jump();
      return;
    }
    go(key);
    jump();
  };
  var menuLink = (link, className) => {
    var {
      key,
      href,
      label,
      note
    } = link;
    var hash = home && link.onHome ? link.onHome : link.hash;
    var base = home && link.onHome ? "" : href || (window.routeToPath ? window.routeToPath(key) : `/${key}`);
    var path = hash ? `${base}#${hash}` : base;
    return React.createElement("a", {
      key: `${key || href}${hash ? `#${hash}` : ""}`,
      className: className,
      href: path,
      "aria-current": !href && !hash && key === exact ? "page" : undefined,
      onClick: e => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (window.track) window.track("cta_click", {
          location,
          target: path
        });
        closeMenu();
        if (href && !(home && link.onHome)) return;
        e.preventDefault();
        follow(home && link.onHome ? "home" : key, hash);
      }
    }, note ? React.createElement(React.Fragment, null, React.createElement("span", {
      className: "hp-menu__label"
    }, label), React.createElement("span", {
      className: "hp-menu__note"
    }, note)) : label);
  };
  var crumb = (() => {
    if (!route) return null;
    if (route.startsWith("a:")) {
      var a = (window.ARTICLES || []).find(x => x.slug === route.slice(2));
      var cat = a && window.findCategory ? window.findCategory(a.cat) : null;
      return cat ? [{
        key: "articles",
        label: "Read"
      }, {
        key: `cat:${cat.slug}`,
        label: cat.label
      }] : null;
    }
    if (route.startsWith("cat:")) return [{
      key: "articles",
      label: "Read"
    }];
    return null;
  })();
  return React.createElement("div", {
    className: "hp-design hp-navigation",
    ref: blockRef
  }, React.createElement("a", {
    className: "skip-link",
    href: "#main"
  }, "Skip to content"), React.createElement("div", {
    className: "hp-top"
  }, "AN INDEPENDENT GUIDE TO YOSEMITE", React.createElement("span", null, "Written here. Taken everywhere.")), React.createElement("header", {
    className: "hp-wrap hp-header",
    ref: headerRef
  }, React.createElement(HomeLink, {
    go: go,
    location: location,
    className: "hp-brand",
    href: "/",
    onClickCapture: e => releaseRockfall(e.currentTarget.querySelector("img"))
  }, React.createElement("img", {
    src: "/img/talus-field-mark-masthead.png?v=2",
    width: "214",
    height: "168",
    alt: ""
  }), React.createElement("span", null, "The Talus Field", React.createElement("small", null, "YOSEMITE, FROM THE INSIDE."))), crumb && React.createElement("p", {
    className: "hp-header__crumb"
  }, crumb.map(c => React.createElement(HomeLink, {
    key: c.key,
    go: go,
    location: location,
    href: window.routeToPath ? window.routeToPath(c.key) : `/${c.key}`
  }, c.label))), React.createElement("nav", {
    "aria-label": "Main navigation",
    ref: navRef
  }, HOME_NAV.map(item => {
    var g = item.group && NAV_GROUPS.find(group => group.key === item.group);
    if (!g || !g.columns) {
      return React.createElement(HomeLink, {
        key: item.href,
        go: go,
        location: location,
        href: item.href,
        "aria-current": here(item.href.slice(1))
      }, item.label);
    }
    var isOpen = open === g.key;
    var panelId = `hp-menu-${g.key}`;
    return (React.createElement("div", {
        key: g.key,
        "data-menu": g.key,
        className: ["hp-menu", isOpen && "is-open", inGroup === g.key && "is-current"].filter(Boolean).join(" "),
        onPointerEnter: e => {
          if (fromMouse(e)) openMenu(g.key, !(open && pinned));
        },
        onPointerLeave: e => {
          if (fromMouse(e) && !pinned) closeSoon();
        },
        onBlur: e => {
          if (isOpen && !e.currentTarget.contains(e.relatedTarget)) closeMenu();
        }
      }, React.createElement("button", {
        type: "button",
        className: "hp-menu__trigger",
        "aria-expanded": isOpen,
        "aria-controls": panelId,
        onClick: () => isOpen && pinned ? closeMenu() : openMenu(g.key, false),
        onKeyDown: e => {
          if (e.key !== "ArrowDown") return;
          e.preventDefault();
          openMenu(g.key, false);
          focusFirst(panelId);
        }
      }, React.createElement("span", null, item.label), React.createElement("svg", {
        viewBox: "0 0 10 6",
        width: "9",
        height: "6",
        "aria-hidden": "true",
        focusable: "false"
      }, React.createElement("path", {
        d: "M1 1l4 4 4-4",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.4",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }))), React.createElement("div", {
        className: "hp-menu__panel",
        id: panelId
      }, React.createElement("div", {
        className: "hp-menu__card"
      }, React.createElement("div", {
        className: "hp-menu__lede"
      }, React.createElement("p", {
        className: "hp-eyebrow hp-menu__eyebrow"
      }, g.label), g.blurb && React.createElement("p", {
        className: "hp-menu__blurb"
      }, g.blurb), menuLink({
        key: g.route,
        label: homeMenuCta(g.cta)
      }, "hp-link"), g.aside && React.createElement("div", {
        className: "hp-menu__aside"
      }, React.createElement("p", {
        className: "hp-menu__heading"
      }, g.aside.eyebrow), React.createElement("p", {
        className: "hp-menu__aside-title"
      }, g.aside.title), React.createElement("p", {
        className: "hp-menu__note"
      }, g.aside.text), menuLink({
        ...g.aside.link,
        label: `${g.aside.link.label} ↗`
      }, "hp-link"))), React.createElement("div", {
        className: "hp-menu__cols"
      }, g.columns.map(col => React.createElement("div", {
        key: col.heading,
        className: "hp-menu__col"
      }, React.createElement("p", {
        className: "hp-menu__heading"
      }, col.heading), col.links.map(link => menuLink(link, "hp-menu__link")))), g.feature === "map" && React.createElement(NavMapFeature, {
        link: menuLink
      }), g.feature === "waits" && React.createElement(NavWaitsFeature, {
        live: nowSeen,
        link: menuLink
      }), g.feature === "newest" && React.createElement(NavNewestFeature, {
        link: menuLink
      })))))
    );
  }), React.createElement(HomeLink, {
    go: go,
    location: location,
    className: "hp-nav__search",
    href: "/search",
    "aria-current": here("search")
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "13",
    height: "13",
    "aria-hidden": "true",
    focusable: "false"
  }, React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "6.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }), React.createElement("line", {
    x1: "16",
    y1: "16",
    x2: "21",
    y2: "21",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  })), React.createElement("span", null, "Search"))), React.createElement(MastheadSearch, {
    go: go,
    location: location
  }), React.createElement(HomeLink, {
    go: go,
    location: location,
    className: "hp-button",
    href: home ? "#field-guide" : "/guide",
    "aria-current": here("guide")
  }, "Get the app ↗")));
}
function HpHeading({
  go,
  location,
  eyebrow,
  title,
  link,
  id
}) {
  return React.createElement("div", {
    className: "hp-heading"
  }, React.createElement("div", null, eyebrow && React.createElement("p", {
    className: "hp-eyebrow"
  }, eyebrow), React.createElement("h2", {
    id: id
  }, title)), link && React.createElement(HomeLink, {
    go: go,
    location: location,
    className: "hp-link",
    href: link.href,
    ...(/^https?:/.test(link.href) ? {
      target: "_blank",
      rel: "noopener noreferrer"
    } : {})
  }, link.label));
}
function HpRow({
  go,
  location,
  href,
  image,
  alt,
  eyebrow,
  title,
  text,
  cta,
  sizes
}) {
  return React.createElement(HomeLink, {
    go: go,
    location: location,
    className: "hp-row",
    href: href
  }, image ? React.createElement(ResponsiveImage, {
    image: image,
    alt: alt || "",
    sizes: sizes || "(max-width: 760px) calc(100vw - 40px), 600px"
  }) : React.createElement("span", {
    className: "hp-row__blank",
    "aria-hidden": "true"
  }), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, eyebrow), React.createElement("h3", null, title), text && React.createElement("p", null, text), cta && React.createElement("b", null, cta, " ", React.createElement("span", null, "↗"))));
}
function HpCard({
  go,
  location,
  href,
  image,
  alt,
  eyebrow,
  title,
  text,
  sizes,
  children
}) {
  return React.createElement(HomeLink, {
    go: go,
    location: location,
    href: href
  }, image ? React.createElement(ResponsiveImage, {
    image: image,
    alt: alt || "",
    sizes: sizes || "(max-width: 760px) calc(100vw - 40px), 600px"
  }) : React.createElement("span", {
    className: "hp-card__blank",
    "aria-hidden": "true"
  }), React.createElement("p", {
    className: "hp-eyebrow"
  }, eyebrow), React.createElement("h3", null, title), children || React.createElement("p", null, text));
}
function HpArticleCard({
  article,
  go,
  location
}) {
  var cat = window.findCategory ? window.findCategory(article.cat) : null;
  return React.createElement(HpCard, {
    go: go,
    location: location,
    href: `/articles/${article.slug}`,
    image: article.image,
    alt: article.placeholder || "",
    eyebrow: React.createElement(React.Fragment, null, cat ? cat.label.toUpperCase() : "", React.createElement("span", null, article.read ? article.read.toUpperCase() : "")),
    title: article.title,
    text: React.createElement(React.Fragment, null, article.dek, " ↗"),
    sizes: "(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 45vw, 420px"
  });
}
function HpPageHead({
  go,
  crumbs,
  eyebrow,
  title,
  intro,
  actions,
  byline,
  aside,
  className,
  as: Tag = "section",
  children
}) {
  return React.createElement(Tag, {
    className: ["hp-pagehead", "hp-wrap", aside ? "hp-pagehead--split" : null, className].filter(Boolean).join(" ")
  }, React.createElement("div", {
    className: "hp-pagehead__copy"
  }, crumbs && React.createElement(Breadcrumbs, {
    go: go,
    trail: crumbs
  }), eyebrow && React.createElement("p", {
    className: "hp-eyebrow"
  }, eyebrow), React.createElement("h1", null, title), intro && React.createElement("p", {
    className: "hp-intro"
  }, intro), actions && React.createElement("div", {
    className: "hp-actions"
  }, actions), byline && React.createElement("p", {
    className: "hp-byline"
  }, byline), children), aside && React.createElement("div", {
    className: "hp-pagehead__aside"
  }, aside));
}
var HP_GUIDE_POINTS = [{
  mark: "↳",
  title: "Find your next stop.",
  text: "44 stops, arranged in driving order."
}, {
  mark: "⌁",
  title: "Choose a hike that fits your day.",
  text: "57 day hikes with GPS tracks."
}, {
  mark: "◎",
  title: "Bring a little local knowledge.",
  text: "50 Secret Guide entries to look beyond the obvious."
}];
function HpGuideBand({
  go,
  location,
  id,
  eyebrow = "THE TALUS FIELD GUIDE / THE OFFLINE APP",
  title,
  intro,
  points = HP_GUIDE_POINTS,
  heading = "h2",
  sample,
  children
}) {
  var H = heading;
  return React.createElement("section", {
    className: "hp-product",
    id: id,
    tabIndex: id ? -1 : undefined
  }, React.createElement("div", {
    className: "hp-wrap hp-product-grid"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, eyebrow), React.createElement(H, null, title), React.createElement("p", {
    className: "hp-intro"
  }, intro), points && React.createElement("ul", null, points.map(p => React.createElement("li", {
    key: p.title
  }, React.createElement("span", null, p.mark), React.createElement("div", null, React.createElement("strong", null, p.title), React.createElement("p", null, p.text))))), children || React.createElement(React.Fragment, null, React.createElement(HomeLink, {
    go: go,
    location: location,
    className: "hp-button hp-light",
    href: "/guide"
  }, "Get the Field Guide ", React.createElement("span", null, "$3.99 ↗")), React.createElement("p", {
    className: "hp-terms"
  }, "One payment · 18 months of access · 30-day guarantee")), sample && React.createElement("p", {
    className: "hp-terms hp-sample"
  }, "Not sure yet? Five entries are free to read, no email required:", " ", React.createElement("a", {
    href: `${GUIDE_PROMO_APP_BASE}/preview`,
    onClick: () => {
      if (window.track) window.track("guide_sample_click", {
        location
      });
    }
  }, "preview the guide ↗"))), React.createElement("div", {
    className: "hp-screens"
  }, React.createElement("div", {
    className: "hp-orbit"
  }), React.createElement("div", {
    className: "hp-phone hp-back"
  }, React.createElement("img", {
    src: "/img/guide/screens/hikes.v2.webp",
    alt: "Field Guide hiking screen",
    width: "640",
    height: "1385",
    loading: "lazy",
    decoding: "async"
  })), React.createElement("div", {
    className: "hp-phone hp-front"
  }, React.createElement("img", {
    src: "/img/guide/screens/front-page.v4.webp",
    alt: "Field Guide app with park information and daylight tools",
    width: "640",
    height: "1385",
    loading: "lazy",
    decoding: "async"
  })), React.createElement("div", {
    className: "hp-offline"
  }, "✓ \xA0 All set. Even off the grid.", React.createElement("small", null, "YOUR GUIDE WORKS OFFLINE")), React.createElement("p", {
    className: "hp-screen-note"
  }, "Actual screens from the Field Guide"))));
}
function HpPostcard({
  paper,
  stamp = "THE SUNDAY LETTER"
}) {
  return React.createElement("div", {
    className: "hp-paper"
  }, React.createElement("span", {
    className: "hp-stamp"
  }, "EL PORTAL, CA", React.createElement("br", null), stamp), React.createElement("div", null, paper || React.createElement(React.Fragment, null, "A field note", React.createElement("br", null), "for your", React.createElement("br", null), React.createElement("em", null, "next adventure."))), React.createElement("small", null, "From Yosemite, with perspective."));
}
function HpLetter({
  id,
  eyebrow,
  title,
  heading,
  blurb,
  location,
  tag,
  variant,
  cta = "Send me the letter ↗",
  terms = "Free to read. One letter a week. Unsubscribe whenever.",
  paper,
  stamp = "THE SUNDAY LETTER"
}) {
  return React.createElement("section", {
    className: "hp-letter hp-wrap hp-section",
    id: id,
    tabIndex: id ? -1 : undefined
  }, React.createElement(HpPostcard, {
    paper: paper,
    stamp: stamp
  }), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, eyebrow), React.createElement("h2", null, title), React.createElement(NewsletterInline, {
    heading: heading,
    blurb: blurb,
    location: location,
    tag: tag,
    variant: variant,
    cta: cta,
    modifier: "hp-newsletter",
    inputLabel: "Your email address"
  }), terms && React.createElement("p", {
    className: "hp-terms"
  }, terms)));
}
function Header({
  current,
  go,
  route
}) {
  return React.createElement(HomeMasthead, {
    go: go,
    current: current,
    route: route
  });
}
function BackToTop({
  current
}) {
  var ref = React.useRef(null);
  React.useEffect(() => {
    if (current === "map" || current === "guide") return;
    var raf = 0;
    var measure = () => {
      raf = 0;
      var el = ref.current;
      if (el) el.classList.toggle("is-visible", window.scrollY > window.innerHeight * 2);
    };
    var onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [current]);
  if (current === "map" || current === "guide") return null;
  var toTop = () => {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth"
    });
    var main = document.getElementById("main");
    if (main) main.focus({
      preventScroll: true
    });
  };
  return React.createElement("button", {
    type: "button",
    className: "totop",
    ref: ref,
    onClick: toTop,
    "aria-label": "Back to top",
    title: "Back to top"
  }, React.createElement("svg", {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, React.createElement("path", {
    d: "M8 13V3"
  }), React.createElement("path", {
    d: "M3.5 7.5 8 3l4.5 4.5"
  })));
}
function Footer({
  go
}) {
  var link = (route, label) => React.createElement("li", {
    key: route
  }, React.createElement("a", {
    href: window.routeToPath ? window.routeToPath(route) : `/${route}`,
    onClick: e => {
      e.preventDefault();
      if (route === "guide" && window.track) window.track("guide_cta_click", {
        location: "footer_guide_link"
      });
      go(route);
    }
  }, label));
  return React.createElement("footer", {
    className: "site-footer"
  }, React.createElement("div", {
    className: "wrap"
  }, React.createElement("div", {
    className: "site-footer__grid"
  }, React.createElement("div", {
    className: "site-footer__about"
  }, React.createElement("div", {
    className: "site-footer__masthead"
  }, "The Talus Field"), React.createElement("div", {
    className: "site-footer__sub"
  }, "A field journal of Yosemite"), React.createElement("p", null, "Notes on a single park, kept slowly. Updated when something is worth saying."), React.createElement("a", {
    className: "site-footer__index",
    href: "/explore",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "footer_index",
        target: "explore"
      });
      go("explore");
    }
  }, "Everything on this site →")), React.createElement("div", null, React.createElement("h4", null, "Plan a trip"), React.createElement("ul", null, link("start-here", "Start here"), link("planning", "The Planning Guide"), link("map", "The trip map"), link("itineraries", "Itineraries"), link("stay", "Where to stay"), link("distances", "Drive times"), link("international", "Visiting from abroad"), link("checklist", "First-week checklist"), link("kit", "Kit"), link("guide", "The Field Guide"))), React.createElement("div", null, React.createElement("h4", null, "Park now"), React.createElement("ul", null, link("now", "The Park Bulletin"), link("conditions", "Conditions"), link("webcams", "Webcams"), link("dates", "Dates that matter"))), React.createElement("div", null, React.createElement("h4", null, "Read"), React.createElement("ul", null, link("articles", "All articles"), window.CATEGORIES.map(c => React.createElement("li", {
    key: c.slug
  }, React.createElement("a", {
    href: `/section/${c.slug}`,
    onClick: e => {
      e.preventDefault();
      go(`cat:${c.slug}`);
    }
  }, c.label))), link("films", "Films"), React.createElement("li", null, React.createElement("a", {
    href: "/archive/"
  }, "Nature Notes archive")))), React.createElement("div", null, React.createElement("h4", null, "The journal"), React.createElement("ul", null, link("about", "About"), link("newsletter", "Newsletter"), link("contact", "Contact"), link("search", "Search"), link("places", "Directory")))), React.createElement("div", {
    className: "site-footer__disclosure"
  }, "Some links on this site are affiliate links. If you book or buy through one, The Talus Field may earn a small commission at no extra cost to you. ", React.createElement("a", {
    href: "/affiliate",
    onClick: e => {
      e.preventDefault();
      go("affiliate");
    }
  }, "Full disclosure here.")), React.createElement("div", {
    className: "site-footer__legal"
  }, React.createElement("div", null, "© ", new Date().getFullYear(), " The Talus Field. Independent. Not affiliated with the National Park Service."), React.createElement("div", null, React.createElement("a", {
    href: "/advertise",
    onClick: e => {
      e.preventDefault();
      go("advertise");
    }
  }, "Advertise"), React.createElement("a", {
    href: "/widget",
    onClick: e => {
      e.preventDefault();
      go("widget");
    }
  }, "Conditions widget"), React.createElement("a", {
    href: "/partners",
    onClick: e => {
      e.preventDefault();
      go("partners");
    }
  }, "Group codes"), React.createElement("a", {
    href: "/privacy",
    onClick: e => {
      e.preventDefault();
      go("privacy");
    }
  }, "Privacy"), React.createElement("a", {
    href: "/terms",
    onClick: e => {
      e.preventDefault();
      go("terms");
    }
  }, "Terms"), React.createElement("a", {
    href: "/affiliate",
    onClick: e => {
      e.preventDefault();
      go("affiliate");
    }
  }, "Affiliate")))));
}
function Breadcrumbs({
  trail,
  go
}) {
  return React.createElement("nav", {
    className: "crumbs",
    "aria-label": "Breadcrumb"
  }, React.createElement("ol", null, trail.map((c, i) => React.createElement("li", {
    key: i
  }, c.route != null ? React.createElement("a", {
    href: window.routeToPath ? window.routeToPath(c.route) : "/",
    onClick: e => {
      e.preventDefault();
      go(c.route);
    }
  }, c.label) : React.createElement("span", {
    "aria-current": "page"
  }, c.label)))));
}
window.Breadcrumbs = Breadcrumbs;
var KEEP_GOING = {
  articles: {
    links: [{
      key: "planning",
      label: "The Planning Guide",
      note: "The same archive, ordered for a real trip"
    }, {
      key: "search",
      label: "Search",
      note: "By title, section, or dek"
    }, {
      href: "/archive/",
      label: "Nature Notes archive",
      note: "The park's own bulletin, 512 issues"
    }, {
      key: "films",
      label: "Films",
      note: "The NPS Nature Notes series"
    }]
  },
  films: {
    links: [{
      href: "/archive/",
      label: "Nature Notes archive",
      note: "The print run the films are named for"
    }, {
      key: "cat:wildlife",
      label: "Wildlife and nature",
      note: "The written version"
    }, {
      key: "articles",
      label: "All articles",
      note: "Everything published, newest first"
    }]
  },
  now: {
    links: [{
      key: "conditions",
      label: "Conditions",
      note: "Webcams, entrance waits, forecasts"
    }, {
      key: "itineraries",
      label: "Itineraries",
      note: "A plan for the days you have"
    }, {
      key: "map",
      label: "The Map",
      note: "Build the route yourself"
    }]
  },
  search: {
    links: [{
      key: "articles",
      label: "All articles",
      note: "Everything published, newest first"
    }, {
      key: "planning",
      label: "The Planning Guide",
      note: "The whole archive, in trip order"
    }, {
      key: "explore",
      label: "Site index",
      note: "Every page on the site"
    }]
  },
  planning: {
    links: [{
      key: "checklist",
      label: "First-week checklist",
      note: "The week before you go, in order"
    }, {
      key: "stay",
      label: "Where to stay",
      note: "The decision with a deadline"
    }, {
      key: "itineraries",
      label: "Itineraries",
      note: "Plans in drive order"
    }, {
      key: "kit",
      label: "Kit",
      note: "What to actually pack"
    }]
  },
  checklist: {
    links: [{
      key: "kit",
      label: "Kit",
      note: "What goes in the pack"
    }, {
      key: "conditions",
      label: "Conditions",
      note: "Check it the morning you drive in"
    }, {
      key: "planning",
      label: "The Planning Guide",
      note: "The long version"
    }]
  },
  kit: {
    links: [{
      key: "checklist",
      label: "First-week checklist",
      note: "The week before you go, in order"
    }, {
      key: "planning",
      label: "The Planning Guide",
      note: "The whole archive, in trip order"
    }, {
      key: "cat:trails",
      label: "Trails and hikes",
      note: "Where the kit gets used"
    }]
  },
  itineraries: {
    links: [{
      key: "map",
      label: "The Map",
      note: "Change a plan, or build your own"
    }, {
      key: "stay",
      label: "Where to stay",
      note: "Book the nights the plan needs"
    }, {
      key: "conditions",
      label: "Conditions",
      note: "What is open on your dates"
    }]
  },
  conditions: {
    links: [{
      key: "now",
      label: "The Park Bulletin",
      note: "Closures, programs, hours, events"
    }, {
      key: "map",
      label: "The Map",
      note: "Turn conditions into a route"
    }, {
      key: "itineraries",
      label: "Itineraries",
      note: "Plans in drive order"
    }]
  },
  stay: {
    links: [{
      key: "distances",
      label: "Drive times",
      note: "How far each town is from the Valley"
    }, {
      key: "planning",
      label: "The Planning Guide",
      note: "Everything else the trip needs"
    }, {
      key: "itineraries",
      label: "Itineraries",
      note: "What to do from where you booked"
    }, {
      key: "checklist",
      label: "First-week checklist",
      note: "The week before you go, in order"
    }]
  },
  webcams: {
    links: [{
      key: "conditions",
      label: "Conditions",
      note: "Forecasts and live entrance waits"
    }, {
      key: "now",
      label: "The Park Bulletin",
      note: "What the park says about this week"
    }, {
      key: "tioga-opening",
      label: "Tioga Road opening",
      note: "The view the cameras do not cover"
    }, {
      key: "map",
      label: "The trip map",
      note: "Where the views actually are"
    }]
  },
  "start-here": {
    links: [{
      key: "planning",
      label: "The Planning Guide",
      note: "Five answers in, a plan out"
    }, {
      key: "stay",
      label: "Where to stay",
      note: "The first decision with a deadline"
    }, {
      key: "itineraries",
      label: "Itineraries",
      note: "Half-day to three-day plans, in drive order"
    }, {
      key: "conditions",
      label: "Conditions",
      note: "What is open on your dates"
    }]
  },
  dates: {
    links: [{
      key: "half-dome-lottery",
      label: "The Half Dome lottery",
      note: "The mechanics, the odds, what to climb instead"
    }, {
      key: "tioga-opening",
      label: "Tioga Road opening",
      note: "The window, watched from inside the park"
    }, {
      key: "planning",
      label: "The Planning Guide",
      note: "Five answers in, a plan out"
    }, {
      key: "guide",
      label: "The Field Guide",
      note: "These dates on your trip board, with reminders"
    }]
  },
  international: {
    links: [{
      key: "start-here",
      label: "Start here",
      note: "The first-trip questions, answered plainly"
    }, {
      key: "distances",
      label: "Drive times",
      note: "How far the Valley is from every gateway town"
    }, {
      key: "stay",
      label: "Where to stay",
      note: "In-park beds and the gateway towns, compared"
    }, {
      key: "dates",
      label: "Dates that matter",
      note: "Lotteries and release mornings, measured against your trip"
    }]
  },
  distances: {
    links: [{
      key: "stay",
      label: "Where to stay",
      note: "The beds at the end of each drive"
    }, {
      key: "conditions",
      label: "Conditions",
      note: "Entrance waits and road status now"
    }, {
      key: "tioga-opening",
      label: "Tioga Road opening",
      note: "When the east-side route comes back"
    }, {
      key: "planning",
      label: "The Planning Guide",
      note: "The rest of the trip, in order"
    }]
  },
  map: {
    links: [{
      key: "itineraries",
      label: "Itineraries",
      note: "Start from a plan instead"
    }, {
      key: "conditions",
      label: "Conditions",
      note: "Before you drive in"
    }, {
      key: "guide",
      label: "The Field Guide",
      note: "The same stops, offline"
    }]
  },
  consult: {
    links: [{
      key: "planning",
      label: "The Planning Guide",
      note: "The free version"
    }, {
      key: "guide",
      label: "The Field Guide",
      note: "The same park, offline and in your pocket"
    }, {
      key: "itineraries",
      label: "Itineraries",
      note: "Plans in drive order"
    }]
  },
  firefall: {
    links: [{
      key: "tioga-opening",
      label: "Tioga Road opening",
      note: "The other date people plan around"
    }, {
      key: "half-dome-lottery",
      label: "Half Dome lottery",
      note: "The permit odds, plainly"
    }, {
      key: "stay",
      label: "Where to stay",
      note: "February fills early"
    }, {
      key: "conditions",
      label: "Conditions",
      note: "Webcams, entrance waits, forecasts"
    }]
  },
  "tioga-opening": {
    links: [{
      key: "half-dome-lottery",
      label: "Half Dome lottery",
      note: "The permit odds, plainly"
    }, {
      key: "firefall",
      label: "Firefall",
      note: "Whether the light is worth the trip"
    }, {
      key: "itineraries",
      label: "Itineraries",
      note: "What the high country is worth"
    }, {
      key: "conditions",
      label: "Conditions",
      note: "Webcams, entrance waits, forecasts"
    }]
  },
  "half-dome-lottery": {
    links: [{
      key: "tioga-opening",
      label: "Tioga Road opening",
      note: "When the high country opens"
    }, {
      key: "firefall",
      label: "Firefall",
      note: "Whether the light is worth the trip"
    }, {
      key: "cat:trails",
      label: "Trails and hikes",
      note: "The rest of the park's big days"
    }, {
      key: "kit",
      label: "Kit",
      note: "What earns its place in the pack"
    }]
  },
  about: {
    links: [{
      key: "newsletter",
      label: "Newsletter",
      note: "One letter a week"
    }, {
      key: "articles",
      label: "All articles",
      note: "Everything published, newest first"
    }, {
      key: "contact",
      label: "Contact",
      note: "Trip questions, corrections, press"
    }]
  },
  places: {
    links: [{
      key: "stay",
      label: "Where to stay",
      note: "Lodging, covered properly"
    }, {
      key: "advertise",
      label: "Advertise",
      note: "For operators"
    }, {
      key: "about",
      label: "About the journal",
      note: "Who writes this, and why"
    }]
  },
  advertise: {
    links: [{
      key: "places",
      label: "The Directory",
      note: "The short list of operators worth knowing"
    }, {
      key: "partners",
      label: "Group codes",
      note: "The Field Guide, in packs"
    }, {
      key: "widget",
      label: "Conditions widget",
      note: "Free embed"
    }]
  },
  widget: {
    links: [{
      key: "partners",
      label: "Group codes",
      note: "The Field Guide in packs, for lodging"
    }, {
      key: "advertise",
      label: "Advertise",
      note: "What a listing is, and what disqualifies one"
    }, {
      key: "conditions",
      label: "Conditions",
      note: "The full page the widget summarizes"
    }]
  },
  partners: {
    links: [{
      key: "guide",
      label: "The Field Guide",
      note: "What your guests get"
    }, {
      key: "widget",
      label: "Conditions widget",
      note: "A free conditions embed for businesses"
    }, {
      key: "advertise",
      label: "Advertise",
      note: "What a listing is, and what disqualifies one"
    }]
  },
  guide: {
    links: [{
      key: "map",
      label: "The Map",
      note: "The free version, in the browser"
    }, {
      key: "planning",
      label: "The Planning Guide",
      note: "The whole archive, in trip order"
    }, {
      key: "partners",
      label: "Group codes",
      note: "For lodging and rental hosts"
    }]
  },
  newsletter: {
    links: [{
      key: "now",
      label: "The Park Bulletin",
      note: "The same board, without the wait"
    }, {
      key: "articles",
      label: "All articles",
      note: "Everything published, newest first"
    }, {
      key: "about",
      label: "About the journal",
      note: "Who writes this, and why"
    }]
  },
  contact: {
    links: [{
      key: "about",
      label: "About the journal",
      note: "Who writes this, and why"
    }, {
      key: "consult",
      label: "Trip consults",
      note: "For real trip questions"
    }, {
      key: "advertise",
      label: "Advertise",
      note: "For operators"
    }]
  },
  explore: {
    links: [{
      key: "search",
      label: "Search",
      note: "If you know what you are looking for"
    }, {
      key: "articles",
      label: "All articles",
      note: "Everything published, newest first"
    }, {
      key: "planning",
      label: "The Planning Guide",
      note: "The whole archive, in trip order"
    }]
  },
  notfound: {
    links: [{
      key: "explore",
      label: "Site index",
      note: "Every page on the site"
    }, {
      key: "articles",
      label: "All articles",
      note: "Everything published, newest first"
    }, {
      key: "search",
      label: "Search",
      note: "Titles, deks, and sections, as you type"
    }]
  }
};
function KeepGoing({
  route,
  go
}) {
  var entry = KEEP_GOING[route];
  if (!entry) return null;
  return React.createElement("section", {
    className: "keep-going",
    "aria-labelledby": "keep-going-heading"
  }, React.createElement("div", {
    className: "wrap"
  }, React.createElement("h2", {
    className: "keep-going__heading",
    id: "keep-going-heading"
  }, entry.heading || "Keep going"), React.createElement("div", {
    className: "keep-going__grid"
  }, entry.links.map(l => React.createElement("a", {
    key: l.key || l.href,
    className: "keep-going__card",
    href: l.href || (window.routeToPath ? window.routeToPath(l.key) : `/${l.key}`),
    onClick: e => {
      if (l.href) return;
      e.preventDefault();
      if (window.track) window.track("keep_going_click", {
        from: route,
        target: l.key
      });
      go(l.key);
    }
  }, React.createElement("span", {
    className: "keep-going__label"
  }, l.label), l.note && React.createElement("span", {
    className: "keep-going__note"
  }, l.note))))));
}
window.KeepGoing = KeepGoing;
window.KEEP_GOING = KEEP_GOING;
function ShareRow({
  title,
  slug
}) {
  var [copied, setCopied] = React.useState(false);
  var share = async () => {
    var url = `${window.SITE_ORIGIN || ""}${window.location.pathname}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
        if (window.track) window.track("article_share", {
          slug,
          method: "web-share"
        });
      } catch (_e) {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (window.track) window.track("article_share", {
        slug,
        method: "copy"
      });
    } catch (_e) {
      window.prompt("Copy this link:", url);
    }
  };
  return React.createElement("div", {
    className: "share-row"
  }, React.createElement("span", null, "Worth sending to your trip partner?"), React.createElement("button", {
    type: "button",
    className: "share-row__btn",
    onClick: share
  }, copied ? "Link copied" : "Share this article"));
}
window.ShareRow = ShareRow;
function AffiliateNote() {
  return React.createElement("p", {
    className: "article-aff-note"
  }, "Some links in this piece are affiliate links. If you buy or book through one, The Talus Field may earn a small commission at no extra cost to you. The recommendations do not change for it. ", React.createElement("a", {
    href: "/affiliate"
  }, "Full disclosure."));
}
window.AffiliateNote = AffiliateNote;
var EXPEDIA_SEARCH_BASE = "https://www.expedia.com/Hotel-Search?destination=";
function expediaSearchUrl(destination) {
  return EXPEDIA_SEARCH_BASE + encodeURIComponent(destination);
}
function AvailabilityLink({
  destination,
  children,
  list,
  slug,
  name,
  className,
  style
}) {
  var href = window.buildAffiliateLink ? window.buildAffiliateLink("expedia", expediaSearchUrl(destination)) : expediaSearchUrl(destination);
  return React.createElement("a", {
    className: ["aff-link", className].filter(Boolean).join(" "),
    href: href,
    target: "_blank",
    rel: "sponsored noopener noreferrer",
    "data-aff-network": "expedia",
    "data-aff-list": list || "page",
    "data-aff-item-slug": slug || "",
    "data-aff-name": name || destination + " lodging search",
    style: style
  }, children || `Check ${destination} availability →`);
}
function LodgingCta({
  destination,
  heading,
  note,
  list,
  slug,
  cta,
  stayLink,
  image,
  caption,
  credit
}) {
  return (React.createElement("aside", {
      className: "lodging-cta",
      "aria-label": "Lodging availability"
    }, image && React.createElement("figure", {
      className: "lodging-cta__figure"
    }, React.createElement(ResponsiveImage, {
      image: image,
      alt: caption || "",
      sizes: SIZES_CARD,
      className: "lodging-cta__img"
    }), caption && React.createElement("figcaption", {
      className: "lodging-cta__caption"
    }, caption, credit && React.createElement("span", {
      className: "lodging-cta__credit"
    }, credit))), React.createElement("h3", {
      className: "lodging-cta__head"
    }, heading || "Check what is actually available"), note && React.createElement("p", {
      className: "lodging-cta__note"
    }, note), React.createElement("p", {
      className: "lodging-cta__actions"
    }, React.createElement(AvailabilityLink, {
      destination: destination,
      list: list,
      slug: slug,
      className: "lodging-cta__link"
    }, cta || `Search ${destination} lodging →`), stayLink !== false && React.createElement("a", {
      className: "lodging-cta__secondary",
      href: "/stay"
    }, "Where to stay: every option compared")), React.createElement("p", {
      className: "lodging-cta__disclosure"
    }, "Availability links are affiliate links. The recommendations do not change for them. ", React.createElement("a", {
      href: "/affiliate"
    }, "Disclosure.")))
  );
}
function ExpediaBanner({
  list,
  slug
}) {
  var b = window.EXPEDIA_BANNER;
  if (!b || !b.img || !b.href) return null;
  return React.createElement("aside", {
    className: "expedia-banner"
  }, React.createElement("a", {
    href: b.href,
    target: "_blank",
    rel: "sponsored noopener noreferrer",
    "data-aff-network": "expedia",
    "data-aff-list": list || "banner",
    "data-aff-item-slug": slug || "",
    "data-aff-name": "Expedia banner"
  }, React.createElement("img", {
    src: b.img,
    alt: b.alt || "",
    loading: "lazy",
    width: b.width,
    height: b.height,
    referrerPolicy: "no-referrer"
  })), React.createElement("p", {
    className: "expedia-banner__disclosure"
  }, "Advertisement. Expedia is an affiliate partner of The Talus Field. ", React.createElement("a", {
    href: "/affiliate"
  }, "Disclosure.")));
}
Object.assign(window, {
  expediaSearchUrl,
  AvailabilityLink,
  LodgingCta,
  ExpediaBanner
});
var READ_LAST_KEY = "tfg.read.last";
var READ_DONE_KEY = "tfg.read.done";
var READ_DONE_CAP = 100;
var readHistory = {
  last() {
    var v = window.safeStorage.getJSON(READ_LAST_KEY);
    return v && typeof v.slug === "string" && typeof v.pct === "number" ? v : null;
  },
  setLast(slug, pct) {
    window.safeStorage.setJSON(READ_LAST_KEY, {
      slug,
      pct,
      at: new Date().toISOString()
    });
  },
  clearLast(slug) {
    var cur = this.last();
    if (cur && cur.slug === slug) window.safeStorage.remove(READ_LAST_KEY);
  },
  done() {
    var v = window.safeStorage.getJSON(READ_DONE_KEY);
    return new Set(Array.isArray(v) ? v : []);
  },
  markDone(slug) {
    var set = this.done();
    if (set.has(slug)) return;
    set.add(slug);
    window.safeStorage.setJSON(READ_DONE_KEY, Array.from(set).slice(-READ_DONE_CAP));
  }
};
window.readHistory = readHistory;
function trackNewsletterSubmit(location, tag, variant) {
  if (window.track) window.track("newsletter_signup", {
    location: location || "unknown",
    tag: tag || "",
    variant: variant || ""
  });
  window.safeStorage.set("tfg.nl.subscribed", "1");
}
window.trackNewsletterSubmit = trackNewsletterSubmit;
function trackNewsletterImpression(location, tag, variant) {
  if (window.track) window.track("newsletter_impression", {
    location: location || "unknown",
    tag: tag || "",
    variant: variant || ""
  });
}
window.trackNewsletterImpression = trackNewsletterImpression;
function abVariant(testKey) {
  var storeKey = "tfg.ab." + testKey;
  var existing = window.safeStorage.get(storeKey);
  if (existing === "a" || existing === "b") return existing;
  var assigned = Math.random() < 0.5 ? "a" : "b";
  if (!window.safeStorage.set(storeKey, assigned)) return "a";
  return assigned;
}
window.abVariant = abVariant;
function isSubscribed() {
  return window.safeStorage.get("tfg.nl.subscribed") === "1";
}
window.isSubscribed = isSubscribed;
function useNewsletterImpression(location, tag, enabled, variant) {
  var ref = useRef(null);
  var firedRef = useRef(false);
  useEffect(() => {
    if (enabled === false) return;
    var node = ref.current;
    if (!node) return;
    var fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      trackNewsletterImpression(location, tag, variant);
    };
    if (typeof IntersectionObserver === "undefined") {
      fire();
      return;
    }
    var io = new IntersectionObserver(entries => {
      for (var e of entries) {
        if (e.isIntersecting) {
          fire();
          io.disconnect();
          break;
        }
      }
    }, {
      threshold: 0.4
    });
    io.observe(node);
    return () => io.disconnect();
  }, [location, tag, enabled, variant]);
  return ref;
}
window.useNewsletterImpression = useNewsletterImpression;
function NewsletterInline({
  heading,
  blurb,
  location,
  tag,
  incentive,
  abTest,
  variant: variantProp,
  cta,
  modifier,
  inputLabel
}) {
  var [done, setDone] = useState(false);
  var subscribed = isSubscribed();
  var variant = abTest ? window.abVariant(abTest) : variantProp || "";
  var forceIncentive = abTest && variant === "b";
  var showIncentive = forceIncentive || incentive !== false && !blurb;
  var ref = useNewsletterImpression(location, tag, !subscribed && !done, variant);
  if (subscribed && !done) {
    return React.createElement("div", {
      className: ["nlbox", "nlbox--subscribed", modifier].filter(Boolean).join(" "),
      ref: ref
    }, React.createElement("p", {
      className: "nlbox__already"
    }, "You're on the list. ", React.createElement("a", {
      href: "/map"
    }, "The interactive map is open to you →")));
  }
  return React.createElement("div", {
    className: ["nlbox", modifier].filter(Boolean).join(" "),
    ref: ref
  }, React.createElement("h3", null, heading || "Sunday Field Notes"), React.createElement("p", null, showIncentive ? "Subscribe and unlock the interactive Yosemite map: vistas, trailheads, parking turnouts, places to eat, and a trip builder that saves on your device. A short note follows on Sundays." : blurb || "A short note on Sundays, when there is something to say."), inputLabel && !done && React.createElement("label", {
    htmlFor: `${location}-email`
  }, inputLabel), done ? React.createElement("p", {
    className: "nlbox__done"
  }, "You're in. ", React.createElement("a", {
    href: "/map"
  }, "The map is open to you →")) : React.createElement("form", {
    className: "nlbox__form",
    action: "https://buttondown.com/api/emails/embed-subscribe/goehring",
    method: "post",
    target: "buttondown-target",
    onSubmit: () => {
      trackNewsletterSubmit(location, tag, variant);
      setTimeout(() => setDone(true), 0);
    }
  }, React.createElement("input", {
    id: inputLabel ? `${location}-email` : undefined,
    type: "email",
    name: "email",
    "aria-label": inputLabel || "Email address",
    autoComplete: "email",
    placeholder: "you@email.com",
    required: true
  }), tag && React.createElement("input", {
    type: "hidden",
    name: "tag",
    value: tag
  }), React.createElement("input", {
    type: "hidden",
    name: "embed",
    value: "1"
  }), React.createElement("button", {
    type: "submit"
  }, cta || "Subscribe →")));
}
var EXIT_COOLDOWN_DAYS = 14;
function useModalFocus(active, initialSelector) {
  var dialogRef = useRef(null);
  useEffect(() => {
    if (!active || !dialogRef.current) return;
    var dialog = dialogRef.current;
    var opener = document.activeElement;
    var focusables = () => Array.from(dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    var initial = initialSelector && dialog.querySelector(initialSelector) || focusables()[0];
    if (initial) initial.focus();
    var onKey = e => {
      if (e.key !== "Tab") return;
      var els = focusables();
      if (!els.length) return;
      var first = els[0];
      var last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      if (opener && typeof opener.focus === "function" && document.contains(opener)) opener.focus();
    };
  }, [active, initialSelector]);
  return dialogRef;
}
function ExitIntentNewsletter({
  disabled
}) {
  var [open, setOpen] = useState(false);
  var firedRef = useRef(false);
  useEffect(() => {
    if (disabled) return;
    var suppressed = window.safeStorage.get("tfg.nl.subscribed") === "1";
    var seen = window.safeStorage.get("tfg.nl.exit.seen");
    if (seen) {
      var ageDays = (Date.now() - new Date(seen).getTime()) / 86400000;
      if (ageDays < EXIT_COOLDOWN_DAYS) suppressed = true;
    }
    if (suppressed) return;
    var reveal = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      window.safeStorage.set("tfg.nl.exit.seen", new Date().toISOString());
      if (window.track) window.track("newsletter_exit_intent_shown", {
        location: "article_exit_intent",
        tag: "exit-intent"
      });
      trackNewsletterImpression("article_exit_intent", "exit-intent");
      setOpen(true);
    };
    var onMouseOut = e => {
      if (e.clientY <= 0 && !e.relatedTarget) reveal();
    };
    var isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
    var mountedAt = Date.now();
    var onScroll = () => {
      if (Date.now() - mountedAt < 25000) return;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.6) reveal();
    };
    if (isTouch) {
      window.addEventListener("scroll", onScroll, {
        passive: true
      });
    } else {
      document.addEventListener("mouseout", onMouseOut);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [disabled]);
  useEffect(() => {
    if (!open) return;
    var onKey = e => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    var prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);
  var dialogRef = useModalFocus(open, ".nlmodal__close");
  if (!open) return null;
  return React.createElement("div", {
    className: "nlmodal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Subscribe to Sunday Field Notes"
  }, React.createElement("div", {
    className: "nlmodal__backdrop",
    onClick: () => setOpen(false)
  }), React.createElement("div", {
    className: "nlmodal__card",
    ref: dialogRef
  }, React.createElement("button", {
    type: "button",
    className: "nlmodal__close",
    "aria-label": "Close",
    onClick: () => setOpen(false)
  }, "✕"), React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "Before you go"), React.createElement("h3", null, "One letter a week. Sometimes none."), React.createElement("p", null, "Sunday Field Notes: what is open, what is blooming, and the occasional longer piece. Free, and you can leave anytime."), React.createElement("form", {
    className: "nlbox__form",
    action: "https://buttondown.com/api/emails/embed-subscribe/goehring",
    method: "post",
    target: "buttondown-target",
    onSubmit: () => {
      trackNewsletterSubmit("article_exit_intent", "exit-intent");
      setTimeout(() => setOpen(false), 0);
    }
  }, React.createElement("input", {
    type: "email",
    name: "email",
    "aria-label": "Email address",
    placeholder: "you@email.com",
    required: true
  }), React.createElement("input", {
    type: "hidden",
    name: "tag",
    value: "exit-intent"
  }), React.createElement("input", {
    type: "hidden",
    name: "embed",
    value: "1"
  }), React.createElement("button", {
    type: "submit"
  }, "Subscribe →"))));
}
function MapLightbox({
  src,
  alt,
  caption,
  onClose
}) {
  var MIN = 1,
    MAX = 6;
  var [scale, setScale] = useState(1);
  var [tx, setTx] = useState(0);
  var [ty, setTy] = useState(0);
  var [grabbing, setGrabbing] = useState(false);
  var dragRef = useRef(null);
  var pinchRef = useRef(null);
  var viewportRef = useRef(null);
  var clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  var reset = () => {
    setScale(1);
    setTx(0);
    setTy(0);
  };
  var zoomAt = (clientX, clientY, factor) => {
    setScale(prev => {
      var next = clamp(prev * factor, MIN, MAX);
      if (next === prev || !viewportRef.current) return next;
      var rect = viewportRef.current.getBoundingClientRect();
      var cx = clientX - rect.left - rect.width / 2;
      var cy = clientY - rect.top - rect.height / 2;
      var ratio = next / prev;
      setTx(t => t * ratio + cx * (1 - ratio));
      setTy(t => t * ratio + cy * (1 - ratio));
      if (next === 1) {
        setTx(0);
        setTy(0);
      }
      return next;
    });
  };
  var zoomCenter = factor => {
    if (!viewportRef.current) return;
    var r = viewportRef.current.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, factor);
  };
  useEffect(() => {
    var onKey = e => {
      if (e.key === "Escape") onClose();else if (e.key === "+" || e.key === "=") zoomCenter(1.4);else if (e.key === "-" || e.key === "_") zoomCenter(1 / 1.4);else if (e.key === "0") reset();
    };
    document.addEventListener("keydown", onKey);
    var prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  useEffect(() => {
    var el = viewportRef.current;
    if (!el) return;
    var handler = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.15 : 1 / 1.15);
    };
    el.addEventListener("wheel", handler, {
      passive: false
    });
    return () => el.removeEventListener("wheel", handler);
  }, []);
  var onMouseDown = e => {
    if (e.button !== 0 || scale === 1) return;
    dragRef.current = {
      x: e.clientX - tx,
      y: e.clientY - ty
    };
    setGrabbing(true);
  };
  var onMouseMove = e => {
    if (!dragRef.current) return;
    setTx(e.clientX - dragRef.current.x);
    setTy(e.clientY - dragRef.current.y);
  };
  var stopDrag = () => {
    dragRef.current = null;
    setGrabbing(false);
  };
  var onTouchStart = e => {
    if (e.touches.length === 2) {
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = {
        dist: Math.hypot(dx, dy),
        startScale: scale,
        cx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        cy: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
    } else if (e.touches.length === 1 && scale > 1) {
      dragRef.current = {
        x: e.touches[0].clientX - tx,
        y: e.touches[0].clientY - ty
      };
    }
  };
  var onTouchMove = e => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      var dist = Math.hypot(dx, dy);
      var target = clamp(pinchRef.current.startScale * (dist / pinchRef.current.dist), MIN, MAX);
      var factor = target / scale;
      if (factor !== 1) zoomAt(pinchRef.current.cx, pinchRef.current.cy, factor);
    } else if (e.touches.length === 1 && dragRef.current) {
      e.preventDefault();
      setTx(e.touches[0].clientX - dragRef.current.x);
      setTy(e.touches[0].clientY - dragRef.current.y);
    }
  };
  var onTouchEnd = e => {
    if (e.touches.length === 0) {
      pinchRef.current = null;
      dragRef.current = null;
    }
  };
  var onImageClick = e => {
    if (dragRef.current) return;
    if (scale === 1) zoomAt(e.clientX, e.clientY, 2);else reset();
  };
  var cursor = scale > 1 ? grabbing ? "grabbing" : "grab" : "zoom-in";
  var dialogRef = useModalFocus(true, ".lightbox__close");
  return React.createElement("div", {
    className: "lightbox",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": alt || caption || "Map"
  }, React.createElement("div", {
    className: "lightbox__backdrop",
    onClick: onClose
  }), React.createElement("div", {
    className: "lightbox__panel",
    ref: dialogRef
  }, React.createElement("div", {
    className: "lightbox__viewport",
    ref: viewportRef,
    onMouseDown: onMouseDown,
    onMouseMove: onMouseMove,
    onMouseUp: stopDrag,
    onMouseLeave: stopDrag,
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd,
    style: {
      cursor
    }
  }, React.createElement("img", {
    className: "lightbox__img",
    src: src,
    alt: alt || "",
    draggable: false,
    style: {
      transform: `translate(${tx}px, ${ty}px) scale(${scale})`
    },
    onClick: onImageClick
  })), React.createElement("div", {
    className: "lightbox__bar"
  }, caption && React.createElement("div", {
    className: "lightbox__caption"
  }, caption), React.createElement("div", {
    className: "lightbox__controls"
  }, React.createElement("button", {
    type: "button",
    onClick: () => zoomCenter(1 / 1.4),
    "aria-label": "Zoom out"
  }, "−"), React.createElement("button", {
    type: "button",
    onClick: reset,
    "aria-label": "Reset zoom"
  }, Math.round(scale * 100), "%"), React.createElement("button", {
    type: "button",
    onClick: () => zoomCenter(1.4),
    "aria-label": "Zoom in"
  }, "+"), React.createElement("button", {
    type: "button",
    className: "lightbox__close",
    onClick: onClose,
    "aria-label": "Close"
  }, "✕")))));
}
var WEBCAMS = [{
  label: "Half Dome",
  img: "ahwahnee2-t.jpg",
  href: "https://yosemite.org/webcams/half-dome/",
  alt: "Live view of Half Dome from Ahwahnee Meadow"
}, {
  label: "Yosemite Falls",
  img: "yosfalls-t.jpg",
  href: "https://yosemite.org/webcams/yosemite-falls/",
  alt: "Live view of Upper Yosemite Falls"
}, {
  label: "El Capitan",
  img: "turtleback-t.jpg",
  href: "https://yosemite.org/webcams/el-capitan/",
  alt: "Live view of El Capitan from Turtleback Dome"
}, {
  label: "Wawona",
  img: "wawona-t.jpg",
  href: "https://yosemite.org/webcams/wawona/",
  alt: "Live view of Wawona"
}];
function WebcamStrip({
  variant
}) {
  var camCacheBust = useMemo(() => Math.floor(Date.now() / 300000), []);
  var board = variant === "board";
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: board ? "cam-grid cam-grid--board" : "cam-grid"
  }, WEBCAMS.map(cam => React.createElement("a", {
    key: cam.img,
    className: "cam-tile",
    href: cam.href,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      textDecoration: "none",
      color: "inherit",
      display: "block"
    }
  }, React.createElement("span", {
    className: board ? "cam-tile__frame" : undefined
  }, React.createElement("img", {
    src: `https://pixelcaster.com/yosemite/webcams/${cam.img}?t=${camCacheBust}`,
    alt: cam.alt,
    loading: "lazy",
    decoding: "async",
    referrerPolicy: "no-referrer",
    onError: e => {
      var t = e.currentTarget.closest('.cam-tile');
      if (t) t.style.display = 'none';
    },
    style: {
      width: "100%",
      aspectRatio: board ? "5 / 3" : "3 / 2",
      objectFit: "cover",
      display: "block"
    }
  }), board && React.createElement("span", {
    className: "cam-tile__live"
  }, React.createElement("span", {
    className: "cam-tile__dot",
    "aria-hidden": "true"
  }), "Live")), board ? React.createElement("span", {
    className: "cam-tile__cap"
  }, React.createElement("span", {
    className: "cam-tile__label"
  }, cam.label), React.createElement("span", {
    className: "cam-tile__open"
  }, "Open camera ↗")) : React.createElement("div", {
    className: "mono",
    style: {
      marginTop: 10,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.18em",
      color: "var(--ink-2)",
      fontWeight: 700
    }
  }, cam.label)))), React.createElement("div", {
    className: "mono",
    style: {
      marginTop: 16,
      fontSize: 11,
      color: "var(--ink-3)",
      textAlign: "right"
    }
  }, "Live image · ", React.createElement("a", {
    href: "https://yosemite.org/webcams/",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: "inherit"
    }
  }, "Yosemite Conservancy / Pixelcaster")));
}
var GUIDE_PROMO_APP_BASE = typeof window !== "undefined" && window.GUIDE_APP_BASE || "https://guide.thetalusfieldjournal.com";
function GuidePromo({
  go,
  location,
  title,
  body,
  cta,
  sample = true,
  style
}) {
  return React.createElement("div", {
    style: style
  }, React.createElement("a", {
    className: "band-guide",
    href: "/guide",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("guide_cta_click", {
        location: location || "unknown"
      });
      if (go) go("guide");else window.location.href = "/guide";
    }
  }, React.createElement("div", {
    className: "band-guide__eyebrow"
  }, "The Field Guide · $3.99 · Offline app"), React.createElement("div", {
    className: "band-guide__title",
    style: {
      marginBottom: 10
    }
  }, title || "The park, in your pocket."), React.createElement("p", {
    className: "band-guide__body"
  }, body || "The app version of this journal: 50-plus stops with parking and timing notes, offline maps, a trip planner, and the secret guide. Works with no signal, which is most of the park. One purchase, eighteen months of access."), React.createElement("div", {
    className: "mono band-guide__cta"
  }, cta || "See the Field Guide →")), sample && React.createElement("p", {
    className: "band-guide__sample"
  }, "Not sure yet? Five entries are free to read, no email required:", " ", React.createElement("a", {
    href: `${GUIDE_PROMO_APP_BASE}/preview`,
    onClick: () => {
      if (window.track) window.track("guide_sample_click", {
        location: location || "unknown"
      });
    }
  }, "preview the guide →")));
}
Object.assign(window, {
  Placeholder,
  ResponsiveImage,
  preloadResponsive,
  SIZES_HERO,
  SIZES_BODY,
  SIZES_CARD,
  MotifMountains,
  MotifSun,
  MotifTrees,
  Header,
  Footer,
  BackToTop,
  NewsletterInline,
  ExitIntentNewsletter,
  MapLightbox,
  EntranceWaits,
  WebcamStrip,
  GuidePromo,
  HomeLink,
  HomeMasthead,
  HpHeading,
  HpRow,
  HpCard,
  HpArticleCard,
  HpPageHead,
  HpGuideBand,
  HpLetter,
  HpPostcard
});
