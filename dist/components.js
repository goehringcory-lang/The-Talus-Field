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
function EntranceWaits() {
  var [waits, setWaits] = useState(null);
  useEffect(() => {
    var cancelled = false;
    var load = () => {
      fetch(WAITS_URL, {
        headers: {
          Range: "bytes=0-8191"
        }
      }).then(r => r.ok ? r.text() : Promise.reject(new Error("HTTP " + r.status))).then(text => {
        var summary = parseWaitsSummary(text);
        if (!cancelled && Array.isArray(summary) && summary.length) setWaits(summary);
      }).catch(() => {});
    };
    load();
    var timer = setInterval(load, WAITS_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);
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
  label: "Plan a Trip",
  route: "planning",
  cta: "The Planning Guide →",
  blurb: "The trip, in the order the decisions actually come at you.",
  columns: [{
    heading: "Before you book",
    links: [{
      key: "planning",
      label: "The Planning Guide",
      note: "The whole archive, in trip order"
    }, {
      key: "stay",
      label: "Where to stay",
      note: "In-park lodging and the gateway towns"
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
    heading: "Before you drive in",
    links: [{
      key: "map",
      label: "The trip map",
      note: "Every pin in the park, assembled into a route"
    }, {
      key: "checklist",
      label: "First-week checklist",
      note: "What to do in the week before you go"
    }, {
      key: "kit",
      label: "Kit",
      note: "What earns its place in the pack"
    }]
  }, {
    heading: "Dated events",
    links: [{
      key: "firefall",
      label: "Firefall",
      note: "Whether to plan a trip around Horsetail Fall"
    }, {
      key: "tioga-opening",
      label: "Tioga Road opening",
      note: "When the high country actually opens"
    }, {
      key: "half-dome-lottery",
      label: "Half Dome lottery",
      note: "The permit odds, plainly"
    }]
  }]
}, {
  key: "conditions",
  label: "Conditions",
  route: "conditions"
}, {
  key: "read",
  label: "Explore Yosemite",
  route: "articles",
  cta: "All articles →",
  blurb: "The journal itself: everything published, by section.",
  columns: [{
    heading: "The journal",
    links: [{
      key: "articles",
      label: "All articles",
      note: "Everything published, newest first"
    }, {
      key: "now",
      label: "The Park Bulletin",
      note: "What is happening in the park right now"
    }]
  }, {
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
  }]
}, {
  key: "guide",
  label: "Field Guide",
  route: "guide"
}];
var NAV_SECONDARY = [{
  key: "about",
  label: "About the journal",
  note: "Who writes this, and why"
}, {
  key: "newsletter",
  label: "Newsletter",
  note: "One short letter a week. Free"
}, {
  key: "films",
  label: "Films",
  note: "The NPS Nature Notes film series, annotated"
}, {
  href: "/archive/",
  label: "Nature Notes archive",
  note: "512 issues of the park's own bulletin"
}, {
  key: "places",
  label: "Directory",
  note: "The short list of operators worth knowing"
}, {
  key: "advertise",
  label: "Advertise",
  note: "What a listing is, and what disqualifies one"
}, {
  key: "widget",
  label: "Conditions widget",
  note: "A free embed for gateway businesses"
}, {
  key: "partners",
  label: "Group codes",
  note: "The Field Guide in packs, for lodging"
}, {
  key: "contact",
  label: "Contact",
  note: "Trip questions, corrections, press"
}];
function navGroupLinks(group) {
  return (group.columns || []).flatMap(col => col.links);
}
window.NAV_GROUPS = NAV_GROUPS;
window.NAV_SECONDARY = NAV_SECONDARY;
window.navGroupLinks = navGroupLinks;
function Header({
  current,
  go
}) {
  var navGroups = NAV_GROUPS;
  var isGroupActive = g => {
    if (current === g.route) return true;
    if (navGroupLinks(g).some(l => l.key === current)) return true;
    if (g.key === "read" && (current.startsWith("a:") || current.startsWith("cat:"))) return true;
    return false;
  };
  var [openGroup, setOpenGroup] = React.useState(null);
  var [dismissedGroup, setDismissedGroup] = React.useState(null);
  var openTimer = React.useRef(null);
  var holdGroup = key => {
    clearTimeout(openTimer.current);
    setDismissedGroup(null);
    setOpenGroup(key);
  };
  var releaseGroup = () => {
    clearTimeout(openTimer.current);
    if (dismissedGroup) {
      setDismissedGroup(null);
      setOpenGroup(null);
      return;
    }
    openTimer.current = setTimeout(() => setOpenGroup(null), 420);
  };
  var dismissGroup = (key, e) => {
    clearTimeout(openTimer.current);
    setOpenGroup(null);
    setDismissedGroup(key);
    if (e && e.detail > 0 && e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
  };
  React.useEffect(() => () => clearTimeout(openTimer.current), []);
  React.useEffect(() => {
    if (!openGroup) return;
    var onKey = e => {
      if (e.key === "Escape") dismissGroup(openGroup);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openGroup]);
  var [menuOpen, setMenuOpen] = React.useState(false);
  var [menuQuery, setMenuQuery] = React.useState("");
  var menuRef = React.useRef(null);
  React.useEffect(() => {
    if (!menuOpen) return;
    var onDoc = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    var onKey = e => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);
  var closeMenu = () => {
    setMenuOpen(false);
    setMenuQuery("");
  };
  var submitMenuSearch = e => {
    e.preventDefault();
    var q = menuQuery.trim();
    closeMenu();
    if (window.track) window.track("nav_search_submit", {
      location: "menu",
      has_query: q ? "1" : "0"
    });
    if (!q) {
      go("search");
      return;
    }
    var url = `/search?q=${encodeURIComponent(q)}`;
    if (window.location.pathname.replace(/\/+$/, "") === "/search") {
      window.location.assign(url);
      return;
    }
    window.history.pushState({
      route: "search"
    }, "", url);
    go("search");
  };
  var renderLink = (link, {
    baseClass,
    noteClass,
    role,
    onNavigate
  } = {}) => {
    var {
      key,
      href,
      label,
      note
    } = link;
    var isExternalPath = !!href;
    var body = note ? React.createElement(React.Fragment, null, React.createElement("span", {
      className: "nav__link-label"
    }, label), React.createElement("span", {
      className: noteClass || "nav__link-note"
    }, note)) : label;
    return React.createElement("a", {
      key: key || href,
      role: role,
      href: isExternalPath ? href : window.routeToPath ? window.routeToPath(key) : `/${key}`,
      className: [baseClass, !isExternalPath && current === key && "is-active"].filter(Boolean).join(" "),
      onClick: e => {
        if (onNavigate) onNavigate(e);
        if (isExternalPath) return;
        e.preventDefault();
        if (key === "guide" && window.track) window.track("guide_cta_click", {
          location: "masthead_nav"
        });
        go(key);
      }
    }, body);
  };
  var renderPlainLink = (key, label, opts) => renderLink({
    key,
    label
  }, opts);
  return React.createElement(React.Fragment, null, React.createElement("header", {
    className: "masthead"
  }, React.createElement("div", {
    className: "masthead__main"
  }, React.createElement("a", {
    className: "brand-block",
    href: "/",
    onClick: e => {
      e.preventDefault();
      releaseRockfall(e.currentTarget.querySelector(".brand__mark"));
      go("home");
    },
    style: {
      textDecoration: "none",
      color: "inherit"
    }
  }, React.createElement("img", {
    className: "brand__mark",
    src: "/img/talus-field-mark.png",
    alt: "The Talus Field",
    loading: "eager"
  }), React.createElement("span", {
    className: "brand-block__text"
  }, React.createElement("span", {
    className: "brand"
  }, "The Talus Field"), React.createElement("span", {
    className: "brand__sub"
  }, "A field journal of Yosemite"))), React.createElement("nav", {
    className: "nav"
  }, navGroups.map(g => {
    if (!g.columns) {
      return React.createElement("div", {
        key: g.key,
        className: "nav__group"
      }, renderPlainLink(g.route, g.label, {
        baseClass: "nav__link"
      }));
    }
    return (React.createElement("div", {
        key: g.key,
        className: ["nav__group", "nav__group--mega", openGroup === g.key && "is-open", dismissedGroup === g.key && "is-dismissed"].filter(Boolean).join(" "),
        onMouseEnter: () => holdGroup(g.key),
        onMouseLeave: releaseGroup
      }, React.createElement("a", {
        href: window.routeToPath ? window.routeToPath(g.route) : `/${g.route}`,
        className: ["nav__link", "nav__group-trigger", isGroupActive(g) && "is-active"].filter(Boolean).join(" "),
        "aria-haspopup": "true",
        onClick: e => {
          e.preventDefault();
          dismissGroup(g.key, e);
          go(g.route);
        }
      }, g.label, React.createElement("span", {
        className: "nav__caret",
        "aria-hidden": "true"
      }, "▾")), React.createElement("div", {
        className: "nav__dropdown nav__dropdown--mega"
      }, React.createElement("div", {
        className: "nav__dropdown-inner"
      }, React.createElement("div", {
        className: "nav__dropdown-lede"
      }, React.createElement("div", {
        className: "nav__dropdown-title"
      }, g.label), g.blurb && React.createElement("p", {
        className: "nav__dropdown-blurb"
      }, g.blurb), renderPlainLink(g.route, g.cta || "Open the section →", {
        baseClass: "nav__dropdown-all",
        onNavigate: e => dismissGroup(g.key, e)
      })), React.createElement("div", {
        className: "nav__dropdown-cols"
      }, g.columns.map(col => React.createElement("div", {
        key: col.heading,
        className: "nav__dropdown-col"
      }, React.createElement("div", {
        className: "nav__dropdown-heading"
      }, col.heading), col.links.map(link => renderLink(link, {
        baseClass: "nav__dropdown-link",
        onNavigate: e => dismissGroup(g.key, e)
      }))))))))
    );
  }), React.createElement("a", {
    className: ["nav__search", current === "search" && "is-active"].filter(Boolean).join(" "),
    href: window.routeToPath ? window.routeToPath("search") : "/search",
    "aria-label": "Search the journal",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "masthead_search",
        target: "search"
      });
      go("search");
    }
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
  })), React.createElement("span", {
    className: "nav__search-label"
  }, "Search")), React.createElement("div", {
    className: "nav__menu-wrap",
    ref: menuRef
  }, React.createElement("button", {
    type: "button",
    className: "nav__menu-toggle",
    "aria-haspopup": "true",
    "aria-expanded": menuOpen,
    "aria-label": "Menu",
    onClick: () => setMenuOpen(o => !o)
  }, React.createElement("span", {
    className: "nav__menu-bars",
    "aria-hidden": "true"
  }, React.createElement("span", null), React.createElement("span", null), React.createElement("span", null))), menuOpen && React.createElement("div", {
    className: "nav__menu",
    role: "menu"
  }, React.createElement("form", {
    className: "nav__menu-search",
    role: "search",
    onSubmit: submitMenuSearch
  }, React.createElement("input", {
    type: "search",
    name: "q",
    value: menuQuery,
    onChange: e => setMenuQuery(e.target.value),
    placeholder: "Search the journal",
    "aria-label": "Search the journal",
    autoComplete: "off"
  }), React.createElement("button", {
    type: "submit",
    "aria-label": "Search"
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
  })))), navGroups.map(g => React.createElement("div", {
    key: g.key,
    className: "nav__menu-group"
  }, g.columns ? React.createElement(React.Fragment, null, React.createElement("div", {
    className: "nav__menu-label"
  }, renderPlainLink(g.route, g.label, {
    baseClass: "nav__menu-label-link",
    role: "menuitem",
    onNavigate: closeMenu
  })), g.columns.map(col => React.createElement(React.Fragment, {
    key: col.heading
  }, React.createElement("div", {
    className: "nav__menu-sublabel"
  }, col.heading), col.links.map(link => renderLink(link, {
    role: "menuitem",
    onNavigate: closeMenu,
    noteClass: "nav__menu-note"
  }))))) : renderPlainLink(g.route, g.label, {
    role: "menuitem",
    onNavigate: closeMenu
  }))), React.createElement("div", {
    className: "nav__menu-group"
  }, React.createElement("div", {
    className: "nav__menu-sublabel"
  }, "More"), NAV_SECONDARY.map(link => renderLink(link, {
    role: "menuitem",
    onNavigate: closeMenu,
    noteClass: "nav__menu-note"
  }))), React.createElement("div", {
    className: "nav__menu-group"
  }, renderPlainLink("explore", "Everything on this site →", {
    baseClass: "nav__menu-index",
    role: "menuitem",
    onNavigate: closeMenu
  }))))))), React.createElement(BottomNav, {
    current: current,
    go: go
  }));
}
var BOTTOM_NAV = [{
  key: "planning",
  label: "Plan"
}, {
  key: "now",
  label: "Now"
}, {
  key: "map",
  label: "Map"
}, {
  key: "articles",
  label: "Read"
}];
function BottomNav({
  current,
  go
}) {
  if (current === "map" || current === "guide") return null;
  var isActive = key => {
    if (key === "articles") return current === "articles" || current.startsWith("a:") || current.startsWith("cat:");
    if (key === "planning") return ["planning", "itineraries", "stay", "checklist", "kit"].includes(current);
    return current === key;
  };
  return React.createElement("nav", {
    className: "bottomnav",
    "aria-label": "Quick navigation"
  }, BOTTOM_NAV.map(t => React.createElement("a", {
    key: t.key,
    className: ["bottomnav__item", isActive(t.key) && "is-active"].filter(Boolean).join(" "),
    "aria-current": isActive(t.key) ? "page" : undefined,
    href: window.routeToPath ? window.routeToPath(t.key) : `/${t.key}`,
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "bottom_nav",
        target: t.key
      });
      go(t.key);
    }
  }, t.label)));
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
  }, "Everything on this site →")), React.createElement("div", null, React.createElement("h4", null, "Read"), React.createElement("ul", null, link("articles", "All articles"), window.CATEGORIES.map(c => React.createElement("li", {
    key: c.slug
  }, React.createElement("a", {
    href: `/section/${c.slug}`,
    onClick: e => {
      e.preventDefault();
      go(`cat:${c.slug}`);
    }
  }, c.label))), link("now", "The Park Bulletin"), link("films", "Films"), React.createElement("li", null, React.createElement("a", {
    href: "/archive/"
  }, "Nature Notes archive")))), React.createElement("div", null, React.createElement("h4", null, "Plan"), React.createElement("ul", null, link("planning", "The Planning Guide"), link("map", "The Map"), link("itineraries", "Itineraries"), link("stay", "Where to stay"), link("conditions", "Conditions"), link("checklist", "First-week checklist"), link("kit", "Kit"), link("guide", "The Field Guide"))), React.createElement("div", null, React.createElement("h4", null, "The journal"), React.createElement("ul", null, link("about", "About"), link("newsletter", "Newsletter"), link("contact", "Contact"), link("search", "Search"), link("places", "Directory"), link("advertise", "Advertise"), link("widget", "Conditions widget"), link("partners", "Group codes"), link("privacy", "Privacy"), link("terms", "Terms"), link("affiliate", "Affiliate disclosure")))), React.createElement("div", {
    className: "site-footer__disclosure"
  }, "Some links on this site are affiliate links. If you book or buy through one, The Talus Field may earn a small commission at no extra cost to you. ", React.createElement("a", {
    href: "/affiliate",
    onClick: e => {
      e.preventDefault();
      go("affiliate");
    }
  }, "Full disclosure here.")), React.createElement("div", {
    className: "site-footer__legal"
  }, React.createElement("div", null, "© 2026 The Talus Field. Independent. Not affiliated with the National Park Service."), React.createElement("div", null, React.createElement("a", {
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
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 20,
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)"
    }
  }, React.createElement("span", null, "Worth sending to your trip partner?"), React.createElement("button", {
    type: "button",
    onClick: share,
    style: {
      font: "inherit",
      color: "var(--moss)",
      background: "none",
      border: "1px solid var(--rule)",
      padding: "6px 14px",
      cursor: "pointer"
    }
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
  stayLink
}) {
  return React.createElement("aside", {
    className: "lodging-cta"
  }, React.createElement("div", {
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
  }, "Disclosure.")));
}
Object.assign(window, {
  expediaSearchUrl,
  AvailabilityLink,
  LodgingCta
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
function ArticleCard({
  article,
  go,
  size,
  onNav
}) {
  var cat = window.findCategory(article.cat);
  return React.createElement("a", {
    className: "card",
    href: `/articles/${article.slug}`,
    onClick: e => {
      e.preventDefault();
      if (onNav) onNav(article);
      go(`a:${article.slug}`);
    }
  }, React.createElement(Placeholder, {
    caption: article.placeholder,
    image: article.image,
    tag: cat.label.split(" ")[0],
    size: size === "sm" ? "sm" : null,
    sizes: SIZES_CARD,
    style: {
      aspectRatio: size === "wide" ? "16/9" : "4/3"
    },
    motif: article.cat === "trails" ? React.createElement(MotifMountains, null) : article.cat === "wildlife" ? React.createElement(MotifTrees, null) : article.cat === "seasonal" ? React.createElement(MotifSun, null) : null
  }), React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, React.createElement("div", {
    className: "card__cat"
  }, cat.label), React.createElement("div", {
    className: "card__title"
  }, article.title), size !== "sm" && React.createElement("div", {
    className: "card__dek"
  }, article.dek), React.createElement("div", {
    className: "card__meta"
  }, React.createElement("span", null, article.date), React.createElement("span", null, article.read))));
}
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
  variant: variantProp
}) {
  var [done, setDone] = useState(false);
  var subscribed = isSubscribed();
  var variant = abTest ? window.abVariant(abTest) : variantProp || "";
  var forceIncentive = abTest && variant === "b";
  var showIncentive = forceIncentive || incentive !== false && !blurb;
  var ref = useNewsletterImpression(location, tag, !subscribed && !done, variant);
  if (subscribed && !done) {
    return React.createElement("div", {
      className: "nlbox nlbox--subscribed",
      ref: ref
    }, React.createElement("p", {
      className: "nlbox__already"
    }, "You're on the list. ", React.createElement("a", {
      href: "/map"
    }, "The interactive map is open to you →")));
  }
  return React.createElement("div", {
    className: "nlbox",
    ref: ref
  }, React.createElement("h3", null, heading || "Sunday Field Notes"), React.createElement("p", null, showIncentive ? "Subscribe and unlock the interactive Yosemite map: vistas, trailheads, parking turnouts, places to eat, and a trip builder that saves on your device. A short note follows on Sundays." : blurb || "A short note on Sundays, when there is something to say."), done ? React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 17,
      color: "var(--moss)",
      margin: 0,
      padding: "8px 0"
    }
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
    type: "email",
    name: "email",
    "aria-label": "Email address",
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
  }, "Subscribe →")));
}
var EXIT_COOLDOWN_DAYS = 14;
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
    className: "nlmodal__card"
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
  return React.createElement("div", {
    className: "lightbox",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": alt || caption || "Map"
  }, React.createElement("div", {
    className: "lightbox__backdrop",
    onClick: onClose
  }), React.createElement("div", {
    className: "lightbox__panel"
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
function WebcamStrip() {
  var camCacheBust = useMemo(() => Math.floor(Date.now() / 300000), []);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "cam-grid",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 32
    }
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
      aspectRatio: "3 / 2",
      objectFit: "cover",
      display: "block"
    }
  }), React.createElement("div", {
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
var GUIDE_PROMO_APP_BASE = typeof window !== "undefined" && window.GUIDE_APP_BASE || "https://talus-field-guide.pages.dev";
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
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      lineHeight: 1.6,
      margin: "10px 0 0"
    }
  }, "Not sure yet? Five entries are free to read, no email required:", " ", React.createElement("a", {
    href: `${GUIDE_PROMO_APP_BASE}/preview`,
    onClick: () => {
      if (window.track) window.track("guide_sample_click", {
        location: location || "unknown"
      });
    },
    style: {
      color: "var(--ink-2)"
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
  ArticleCard,
  NewsletterInline,
  ExitIntentNewsletter,
  MapLightbox,
  EntranceWaits,
  WebcamStrip,
  GuidePromo
});
