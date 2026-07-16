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
function Header({
  current,
  go
}) {
  var navGroups = [{
    key: "read",
    label: "Read",
    route: "articles",
    items: [["articles", "All articles"], ["cat:planning", "Planning"], ["cat:trails", "Trails and hikes"], ["cat:wildlife", "Wildlife and nature"], ["cat:seasonal", "Seasonal guides"], ["now", "This week in the park"], ["films", "Films"]]
  }, {
    key: "plan",
    label: "Plan",
    route: "planning",
    items: [["planning", "The Planning Guide"], ["itineraries", "Itineraries"], ["conditions", "Conditions"], ["checklist", "First-week checklist"], ["kit", "Kit"], ["firefall", "Firefall"], ["consult", "Trip consults"]]
  }, {
    key: "guide",
    label: "Field Guide",
    route: "guide"
  }, {
    key: "about",
    label: "About",
    route: "about",
    align: "right",
    items: [["about", "About the journal"], ["newsletter", "Newsletter"], ["contact", "Contact"], ["places", "Directory"], ["advertise", "Advertise"], ["widget", "Conditions widget"]]
  }];
  var isGroupActive = g => {
    if (current === g.route) return true;
    if (g.items && g.items.some(([key]) => key === current)) return true;
    if (g.key === "read" && (current.startsWith("a:") || current.startsWith("cat:"))) return true;
    return false;
  };
  var [menuOpen, setMenuOpen] = React.useState(false);
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
  var renderLink = (key, label, {
    baseClass,
    role,
    onNavigate
  } = {}) => React.createElement("a", {
    key: key,
    role: role,
    href: window.routeToPath ? window.routeToPath(key) : `/${key}`,
    className: [baseClass, current === key && "is-active"].filter(Boolean).join(" "),
    onClick: e => {
      e.preventDefault();
      if (onNavigate) onNavigate();
      if (key === "guide" && window.track) window.track("guide_cta_click", {
        location: "masthead_nav"
      });
      go(key);
    }
  }, label);
  var todayFull = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  var todayShort = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
  return React.createElement("header", {
    className: "masthead"
  }, React.createElement("div", {
    className: "masthead__top"
  }, React.createElement("div", {
    className: "masthead__dateline"
  }, React.createElement("span", {
    className: "masthead__vol"
  }, window.SITE && window.SITE.issue || "Vol. III"), React.createElement("span", {
    className: "masthead__date masthead__date--full"
  }, todayFull), React.createElement("span", {
    className: "masthead__date masthead__date--short"
  }, todayShort)), React.createElement("div", {
    className: "masthead__utility"
  }, React.createElement("a", {
    className: "masthead__guide",
    href: "/now",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "masthead_now"
      });
      go("now");
    }
  }, "This week"), React.createElement("div", {
    className: "masthead__weather"
  }, React.createElement("span", {
    className: "masthead__weather-label"
  }, "Conditions"), React.createElement("a", {
    href: "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Valley"), React.createElement("span", {
    className: "masthead__weather-sep"
  }, "·"), React.createElement("a", {
    href: "https://forecast.weather.gov/MapClick.php?lat=37.8731&lon=-119.3503",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tuolumne"), React.createElement("span", {
    className: "masthead__weather-sep"
  }, "·"), React.createElement("a", {
    href: "https://forecast.weather.gov/MapClick.php?lat=37.5341&lon=-119.6315",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Wawona")), React.createElement(EntranceWaits, null), React.createElement("a", {
    className: "masthead__guide",
    href: "https://www.nps.gov/yose/planyourvisit/guide.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite Guide ↗"))), React.createElement("div", {
    className: "masthead__main"
  }, React.createElement("a", {
    className: "brand-block",
    href: "/",
    onClick: e => {
      e.preventDefault();
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
    if (!g.items) {
      return React.createElement("div", {
        key: g.key,
        className: "nav__group"
      }, renderLink(g.route, g.label, {
        baseClass: "nav__link"
      }));
    }
    return React.createElement("div", {
      key: g.key,
      className: "nav__group"
    }, React.createElement("a", {
      href: window.routeToPath ? window.routeToPath(g.route) : `/${g.route}`,
      className: ["nav__link", "nav__group-trigger", isGroupActive(g) && "is-active"].filter(Boolean).join(" "),
      "aria-haspopup": "true",
      onClick: e => {
        e.preventDefault();
        go(g.route);
      }
    }, g.label, React.createElement("span", {
      className: "nav__caret",
      "aria-hidden": "true"
    }, "▾")), React.createElement("div", {
      className: ["nav__dropdown", g.align === "right" && "nav__dropdown--right"].filter(Boolean).join(" ")
    }, React.createElement("div", {
      className: "nav__dropdown-inner"
    }, g.items.map(([key, label]) => renderLink(key, label, {
      baseClass: "nav__dropdown-link"
    })))));
  }), React.createElement("a", {
    className: "nav__primary",
    href: window.routeToPath ? window.routeToPath("map") : "/map",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "masthead_cta",
        target: "map"
      });
      go("map");
    }
  }, "The Map"), React.createElement("div", {
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
  }, navGroups.map(g => React.createElement("div", {
    key: g.key,
    className: "nav__menu-group"
  }, g.items ? React.createElement(React.Fragment, null, React.createElement("div", {
    className: "nav__menu-label"
  }, g.label), g.items.map(([key, label]) => renderLink(key, label, {
    role: "menuitem",
    onNavigate: () => setMenuOpen(false)
  }))) : renderLink(g.route, g.label, {
    role: "menuitem",
    onNavigate: () => setMenuOpen(false)
  }))))))));
}
function Footer({
  go
}) {
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
  }, "A field journal of Yosemite"), React.createElement("p", null, "Notes on a single park, kept slowly. Updated when something is worth saying.")), React.createElement("div", null, React.createElement("h4", null, "Sections"), React.createElement("ul", null, window.CATEGORIES.map(c => React.createElement("li", {
    key: c.slug
  }, React.createElement("a", {
    href: `/section/${c.slug}`,
    onClick: e => {
      e.preventDefault();
      go(`cat:${c.slug}`);
    }
  }, c.label))))), React.createElement("div", null, React.createElement("h4", null, "Site"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "/about",
    onClick: e => {
      e.preventDefault();
      go("about");
    }
  }, "About")), React.createElement("li", null, React.createElement("a", {
    href: "/articles",
    onClick: e => {
      e.preventDefault();
      go("articles");
    }
  }, "All articles")), React.createElement("li", null, React.createElement("a", {
    href: "/kit",
    onClick: e => {
      e.preventDefault();
      go("kit");
    }
  }, "Kit")), React.createElement("li", null, React.createElement("a", {
    href: "/films",
    onClick: e => {
      e.preventDefault();
      go("films");
    }
  }, "Films")), React.createElement("li", null, React.createElement("a", {
    href: "/places",
    onClick: e => {
      e.preventDefault();
      go("places");
    }
  }, "Directory")), React.createElement("li", null, React.createElement("a", {
    href: "/map",
    onClick: e => {
      e.preventDefault();
      go("map");
    }
  }, "The Map")), React.createElement("li", null, React.createElement("a", {
    href: "/itineraries",
    onClick: e => {
      e.preventDefault();
      go("itineraries");
    }
  }, "Itineraries")), React.createElement("li", null, React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "Conditions")), React.createElement("li", null, React.createElement("a", {
    href: "/now",
    onClick: e => {
      e.preventDefault();
      go("now");
    }
  }, "This week in the park")), React.createElement("li", null, React.createElement("a", {
    href: "/guide",
    onClick: e => {
      e.preventDefault();
      window.track && window.track("guide_cta_click", {
        location: "footer_guide_link"
      });
      go("guide");
    }
  }, "Field Guide")), React.createElement("li", null, React.createElement("a", {
    href: "/newsletter",
    onClick: e => {
      e.preventDefault();
      go("newsletter");
    }
  }, "Newsletter")), React.createElement("li", null, React.createElement("a", {
    href: "/contact",
    onClick: e => {
      e.preventDefault();
      go("contact");
    }
  }, "Contact")))), React.createElement("div", null, React.createElement("h4", null, "Legal"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "/privacy",
    onClick: e => {
      e.preventDefault();
      go("privacy");
    }
  }, "Privacy")), React.createElement("li", null, React.createElement("a", {
    href: "/terms",
    onClick: e => {
      e.preventDefault();
      go("terms");
    }
  }, "Terms")), React.createElement("li", null, React.createElement("a", {
    href: "/affiliate",
    onClick: e => {
      e.preventDefault();
      go("affiliate");
    }
  }, "Affiliate disclosure")), React.createElement("li", null, React.createElement("a", {
    href: "/contact",
    onClick: e => {
      e.preventDefault();
      go("contact");
    }
  }, "Contact"))))), React.createElement("div", {
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
  }, "Some links in this piece are affiliate links to Patagonia. If you buy through one, The Talus Field may earn a small commission at no extra cost to you. ", React.createElement("a", {
    href: "/affiliate"
  }, "Full disclosure."));
}
window.AffiliateNote = AffiliateNote;
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
  var camCacheBust = useMemo(() => Date.now(), []);
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
  WebcamStrip
});
