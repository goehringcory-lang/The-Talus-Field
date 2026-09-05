/* global React */
const { useState, useEffect, useMemo, useRef } = React;

// ============================================================
// Responsive images. Variants are pre-generated offline by
// scripts/gen-responsive-images.mjs into a sibling responsive/ folder
// (AVIF + WebP + JPEG at 400/800/1200/1600). This helper derives the
// URLs from the original image path with no manifest — keep slugify()
// in sync with the script. External URLs (webcams, Unsplash) have no
// variants and fall back to a plain <img>.
// ============================================================
const RESPONSIVE_WIDTHS = [400, 800, 1200, 1600];
// sizes presets for the three image contexts on the site.
const SIZES_HERO = "(max-width: 700px) 100vw, 700px";
const SIZES_BODY = SIZES_HERO;
const SIZES_CARD = "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 360px";

function slugifyImage(image) {
  const base = String(image).split("/").pop() || "";
  return base
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ResponsiveImage({ image, alt, sizes, widths, eager, className, style }) {
  const isExternal = /^https?:/i.test(image);
  const loadProps = {
    loading: eager ? "eager" : "lazy",
    fetchpriority: eager ? "high" : "auto",
    decoding: eager ? "sync" : "async",
    referrerPolicy: "no-referrer",
  };

  if (isExternal) {
    return (
      <img className={className} src={image} alt={alt || ""} style={style} {...loadProps} />
    );
  }

  const cleaned = image.replace(/^\//, "");
  const lastSlash = cleaned.lastIndexOf("/");
  const dir = lastSlash >= 0 ? cleaned.slice(0, lastSlash) : "";
  const respBase = `/${dir ? dir + "/" : ""}responsive/${slugifyImage(cleaned)}`;
  const ws = widths || RESPONSIVE_WIDTHS;
  const srcSet = (ext) => ws.map((w) => `${respBase}-${w}.${ext} ${w}w`).join(", ");
  const sizesAttr = sizes || SIZES_HERO;

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizesAttr} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizesAttr} />
      <img
        className={className}
        src={`/${cleaned}`}
        srcSet={srcSet("jpg")}
        sizes={sizesAttr}
        alt={alt || ""}
        style={style}
        {...loadProps}
      />
    </picture>
  );
}

// Inject a <link rel="preload"> for an eager (LCP) image's responsive srcset so
// the browser fetches it before React mounts the <picture>. No-op for external
// images. Mirrors the setLink pattern in app.jsx.
function preloadResponsive(image, sizes) {
  if (!image || /^https?:/i.test(image)) return;
  const cleaned = image.replace(/^\//, "");
  const lastSlash = cleaned.lastIndexOf("/");
  const dir = lastSlash >= 0 ? cleaned.slice(0, lastSlash) : "";
  const respBase = `/${dir ? dir + "/" : ""}responsive/${slugifyImage(cleaned)}`;
  const id = `preload-${respBase}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "preload";
  link.as = "image";
  link.type = "image/avif";
  link.setAttribute(
    "imagesrcset",
    RESPONSIVE_WIDTHS.map((w) => `${respBase}-${w}.avif ${w}w`).join(", ")
  );
  link.setAttribute("imagesizes", sizes || SIZES_HERO);
  link.setAttribute("fetchpriority", "high");
  document.head.appendChild(link);
}

// NOTE: Placeholder / ResponsiveImage / Motif* below are stubbed for crawler
// prerender in scripts/gen-prerender.mjs. If their rendered markup changes,
// update those stubs; `npm --prefix scripts run prerender:check` guards drift.
// ============================================================
// Photo placeholder. Nature-journal treatment.
// Pass eager={true} for the LCP image on a page (page hero / article hero)
// so it loads with priority instead of being deprioritized as lazy.
// ============================================================
function Placeholder({ caption, tag, size, style, motif, image, credit, natural, eager, sizes }) {
  return (
    <div
      className={`placeholder ${size === "lg" ? "placeholder--lg" : ""} ${size === "sm" ? "placeholder--sm" : ""} ${image ? "placeholder--photo" : ""} ${natural ? "placeholder--natural" : ""}`}
      data-tag={tag || "PLATE"}
      style={style}
    >
      {image && (
        <ResponsiveImage
          className="placeholder__img"
          image={image}
          alt={caption || ""}
          eager={eager}
          sizes={sizes || SIZES_HERO}
        />
      )}
      {!image && motif && <div className="placeholder__motif">{motif}</div>}
      {/* Photo captions removed site-wide; `caption` is kept only to feed the image alt above (accessibility + SEO), not rendered as a visible description. Tag and credit remain. */}
      {credit && <div className="placeholder__credit">{credit}</div>}
    </div>
  );
}

// A few simple decorative motifs done in plain SVG (rectangles + circles only,
// per the rule). These are just barely-there silhouette suggestions, not illustrations.
function MotifMountains() {
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" width="100%" height="100%">
      <path d="M0,90 L40,40 L65,60 L95,20 L130,55 L160,35 L200,70 L200,100 L0,100 Z"
        fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M0,95 L25,75 L55,85 L80,70 L120,80 L150,65 L200,85 L200,100 L0,100 Z"
        fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}
function MotifSun() {
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" width="100%" height="100%">
      <circle cx="160" cy="38" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="78" x2="200" y2="78" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}
function MotifTrees() {
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" width="100%" height="100%">
      <line x1="20" y1="20" x2="20" y2="92" stroke="currentColor" strokeWidth="1" />
      <line x1="55" y1="32" x2="55" y2="92" stroke="currentColor" strokeWidth="1" />
      <line x1="88" y1="14" x2="88" y2="92" stroke="currentColor" strokeWidth="1" />
      <line x1="125" y1="28" x2="125" y2="92" stroke="currentColor" strokeWidth="1" />
      <line x1="162" y1="20" x2="162" y2="92" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// ============================================================
// Entrance wait times. The NPS publishes live waits for the three
// drive-in entrances (Arch Rock / 140, Big Oak Flat / 120, South / 41)
// as a public S3 JSON feed. waits.json is ~1 MB because weeks of
// history follow the summary array, so we fetch only the first 8 KB
// via a Range request (the bucket's CORS allows the Range header) and
// bracket-match the summary out of the truncated JSON. Fails quiet:
// any fetch or parse problem and the page renders without it.
// Only consumer since the nav simplification pass: /conditions
// (page-conditions.jsx). The .masthead__waits* class names date from
// its old slot in the masthead's utility bar and are load-bearing
// there via .conditions__waits — rename both together or neither.
// ============================================================
const WAITS_BASE = "https://npsvms-338365424831-us-west-1-an.s3.us-west-1.amazonaws.com/yose/transit-time/display/public/";
const WAITS_URL = WAITS_BASE + "waits.json";
const WAITS_PAGE_URL = WAITS_BASE + "index.html";
const WAITS_REFRESH_MS = 5 * 60 * 1000;
// Short labels for the waits line; unknown pairs fall back to the
// pair_name with its " Wait Time" suffix stripped.
const WAITS_SHORT_NAMES = {
  "South Entrance Wait Time": "South",
  "Arch Rock Wait Time": "Arch Rock",
  "Big Oak Flat Wait Time": "Big Oak Flat",
};

function parseWaitsSummary(text) {
  const key = text.indexOf('"summary"');
  if (key === -1) return null;
  const start = text.indexOf("[", key);
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === "[") depth++;
    else if (ch === "]" && --depth === 0) {
      try { return JSON.parse(text.slice(start, i + 1)); } catch (e) { return null; }
    }
  }
  return null;
}

// Thresholds are the NPS display page's own: ≤5 good, ≤15 moderate.
function waitClass(min) {
  if (min == null) return "nodata";
  if (min <= 5) return "good";
  if (min <= 15) return "moderate";
  return "long";
}

function formatWaitMinutes(min) {
  if (min < 60) return Math.round(min) + " min";
  const h = Math.floor(min / 60);
  return h + "h " + Math.round(min % 60) + "m";
}

function EntranceWaits() {
  const [waits, setWaits] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch(WAITS_URL, { headers: { Range: "bytes=0-8191" } })
        .then((r) => (r.ok ? r.text() : Promise.reject(new Error("HTTP " + r.status))))
        .then((text) => {
          const summary = parseWaitsSummary(text);
          if (!cancelled && Array.isArray(summary) && summary.length) setWaits(summary);
        })
        .catch(() => {});
    };
    load();
    const timer = setInterval(load, WAITS_REFRESH_MS);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  // Reserve the slot while the live NPS data is in flight (or never arrives) so
  // the page does not shift when the waits populate after first paint. The
  // placeholder carries the same .masthead__waits min-width as the filled
  // state; it is empty and hidden from assistive tech.
  if (!waits) return <span className="masthead__waits masthead__waits--ph" aria-hidden="true" />;
  return (
    <a
      className="masthead__waits"
      href={WAITS_PAGE_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="Live entrance station wait times, National Park Service"
    >
      <span className="masthead__waits-label">Entrance waits</span>
      {waits.map((pair, i) => {
        const name = WAITS_SHORT_NAMES[pair.pair_name]
          || String(pair.pair_name || "").replace(/\s*Wait Time$/i, "")
          || "Entrance";
        const min = pair.stale ? null : pair.current_wait_minutes;
        return (
          <React.Fragment key={pair.pair_name || i}>
            {i > 0 && <span className="masthead__weather-sep">·</span>}
            <span className={`masthead__wait masthead__wait--${waitClass(min)}`}>
              {name} {min == null ? "n/a" : formatWaitMinutes(min)}
            </span>
          </React.Fragment>
        );
      })}
    </a>
  );
}

// ============================================================
// Masthead rockfall. The first click on the talus mark each visit
// shakes a few small rocks loose; they tumble off the logo and fall
// down the viewport, then clean up after themselves. Pure garnish:
// skipped for reduced-motion readers, silent when the Web Animations
// API is missing, and it never re-fires until the next full page load.
// ============================================================
let rockfallReleased = false;

// Small faceted blocks echoing the mark's illustration: angular stone
// fills under the same heavy ink outline. The palette is fixed on
// purpose, matching the logo image, which also ignores the site theme.
const ROCKFALL_SHAPES = [
  '<svg viewBox="0 0 20 20"><polygon points="3,7 11,2 18,6 16,15 6,17" fill="#cfccbd" stroke="#262b23" stroke-width="2" stroke-linejoin="round"/><polyline points="3,7 10,9 16,15" fill="none" stroke="#262b23" stroke-width="1.4"/><line x1="10" y1="9" x2="11" y2="2" stroke="#262b23" stroke-width="1.4"/></svg>',
  '<svg viewBox="0 0 20 20"><polygon points="10,1 18,8 13,18 4,14 2,6" fill="#b3b1a3" stroke="#262b23" stroke-width="2" stroke-linejoin="round"/><polyline points="2,6 9,9 13,18" fill="none" stroke="#262b23" stroke-width="1.4"/></svg>',
  '<svg viewBox="0 0 20 20"><polygon points="2,9 9,4 18,7 17,13 7,16" fill="#8f8e81" stroke="#262b23" stroke-width="2" stroke-linejoin="round"/><line x1="9" y1="4" x2="10" y2="15" stroke="#262b23" stroke-width="1.4"/></svg>',
  '<svg viewBox="0 0 20 20"><polygon points="4,5 14,3 17,10 12,17 3,13" fill="#4a5540" stroke="#262b23" stroke-width="2" stroke-linejoin="round"/><polyline points="4,5 10,10 12,17" fill="none" stroke="#262b23" stroke-width="1.4"/></svg>',
];

function releaseRockfall(markEl) {
  if (rockfallReleased || !markEl) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof markEl.animate !== "function") return;
  rockfallReleased = true;

  const rect = markEl.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.className = "rockfall";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const count = 6 + Math.floor(Math.random() * 3);
  let live = count;
  for (let i = 0; i < count; i++) {
    const size = 7 + Math.random() * 9;
    const rock = document.createElement("div");
    rock.className = "rockfall__rock";
    rock.innerHTML = ROCKFALL_SHAPES[Math.floor(Math.random() * ROCKFALL_SHAPES.length)];
    // Start along the lower half of the mark, where the pile sits.
    const startY = rect.top + rect.height * (0.55 + Math.random() * 0.35);
    rock.style.left = `${rect.left + rect.width * (0.15 + Math.random() * 0.7)}px`;
    rock.style.top = `${startY}px`;
    rock.style.width = `${size}px`;
    rock.style.height = `${size}px`;
    layer.appendChild(rock);

    const fall = window.innerHeight - startY + size * 2;
    const drift = (Math.random() - 0.5) * 90;
    const hop = -(4 + Math.random() * 10);
    const spin = (Math.random() < 0.5 ? -1 : 1) * (140 + Math.random() * 420);
    const done = () => { rock.remove(); if (--live === 0) layer.remove(); };
    const anim = rock.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)" },
        { transform: `translate(${drift * 0.2}px, ${hop}px) rotate(${spin * 0.12}deg)`, offset: 0.12 },
        { transform: `translate(${drift}px, ${fall}px) rotate(${spin}deg)` },
      ],
      {
        duration: 900 + Math.random() * 700 + fall * 0.25,
        delay: Math.random() * 260,
        easing: "cubic-bezier(0.45, 0.05, 0.85, 0.5)",
        fill: "forwards",
      }
    );
    anim.onfinish = done;
    anim.oncancel = done;
  }
  // Backstop in case finish events never fire (e.g. a hidden tab).
  setTimeout(() => { if (layer.parentNode) layer.remove(); }, 5000);
}

// ============================================================
// Masthead
// ============================================================
// The site's map, in two tables. NAV_GROUPS is the masthead bar: the few
// things a first-time visitor needs, and nothing they have to learn first.
// NAV_SECONDARY is everything else a returning reader might want: it renders
// in the hamburger's More section and (with the footer and /explore) is the
// only home those destinations get. Every reader-facing route lives in
// exactly one of the two tables, with two exceptions: legal pages stay
// footer-only, and /explore is the index itself, carried by the hamburger's
// closing "Everything on this site" line and the footer rather than a table
// entry (/explore lists the legal pages too).
//
// Shape: a group is { key, label, route, blurb, columns } where each column is
// { heading, links } and a link is { key } for an SPA route or { href } for a
// real navigation (the generated /archive pages are not SPA routes, so they
// must never carry a go() handler). `route` is where the group label itself
// navigates. A group with no `columns` renders as a plain top-level link.
//
// Two rules for `note` copy, and they bind both tables: keep it to one short
// line, and keep years out of it. The masthead is baked into index.html's
// static home shell by scripts/gen-home-shell.mjs, which rejects anything
// date-derived because that file is cached hard. For the same reason nothing
// here may be computed from the catalog (the generator renders with an empty
// window.ARTICLES, so a live count would bake as zero and then shift on boot).
const NAV_GROUPS = [
  {
    key: "plan",
    label: "Plan a Trip",
    route: "planning",
    cta: "The Planning Guide →",
    blurb: "The trip, in the order the decisions actually come at you.",
    columns: [
      {
        heading: "Before you book",
        links: [
          { key: "start-here", label: "Start here", note: "Your first trip, the questions in order" },
          { key: "planning", label: "The Planning Guide", note: "The whole archive, in trip order" },
          { key: "stay", label: "Where to stay", note: "In-park lodging and the gateway towns" },
          { key: "itineraries", label: "Itineraries", note: "Half-day to three-day plans, in drive order" },
          { key: "consult", label: "Trip consults", note: "Thirty minutes, one on one. Paid" },
        ],
      },
      {
        heading: "Before you drive in",
        links: [
          { key: "map", label: "The trip map", note: "Every pin in the park, assembled into a route" },
          { key: "distances", label: "Drive times", note: "How far the Valley is from every gateway town" },
          { key: "webcams", label: "Webcams", note: "The live views, and how to read them" },
          { key: "checklist", label: "First-week checklist", note: "What to do in the week before you go" },
          { key: "kit", label: "Kit", note: "What earns its place in the pack" },
        ],
      },
      {
        heading: "Dated events",
        links: [
          { key: "firefall", label: "Firefall", note: "Whether to plan a trip around Horsetail Fall" },
          { key: "tioga-opening", label: "Tioga Road opening", note: "When the high country actually opens" },
          { key: "half-dome-lottery", label: "Half Dome lottery", note: "The permit odds, plainly" },
        ],
      },
    ],
  },
  // Conditions left the Plan dropdown for the bar itself: "is the road open,
  // what's the weather" is the question most visits start with, and it should
  // not cost a hover to answer.
  { key: "conditions", label: "Conditions", route: "conditions" },
  {
    // Keeps the key "read": isGroupActive's a:/cat: special case and the
    // footer both lean on it.
    key: "read",
    label: "Explore Yosemite",
    route: "articles",
    cta: "All articles →",
    blurb: "The journal itself: everything published, by section.",
    columns: [
      {
        heading: "The journal",
        links: [
          { key: "articles", label: "All articles", note: "Everything published, newest first" },
          { key: "now", label: "The Park Bulletin", note: "What is happening in the park right now" },
        ],
      },
      {
        heading: "Sections",
        links: [
          { key: "cat:planning", label: "Planning", note: "Permits, timing, transit, lodging" },
          { key: "cat:trails", label: "Trails and hikes", note: "Routes and conditions, kept current" },
          { key: "cat:wildlife", label: "Wildlife and nature", note: "What is moving and what is blooming" },
          { key: "cat:seasonal", label: "Seasonal guides", note: "The park, month by month" },
        ],
      },
    ],
  },
  { key: "guide", label: "Field Guide", route: "guide" },
];

// Everything that left the masthead bar in the simplification pass. Same link
// shape and the same copy rules as NAV_GROUPS; rendered by the hamburger's
// More section, mirrored by the footer and /explore, never by the bar itself.
const NAV_SECONDARY = [
  { key: "about", label: "About the journal", note: "Who writes this, and why" },
  { key: "newsletter", label: "Newsletter", note: "One short letter a week. Free" },
  { key: "films", label: "Films", note: "The NPS Nature Notes film series, annotated" },
  { href: "/archive/", label: "Nature Notes archive", note: "512 issues of the park's own bulletin" },
  { key: "places", label: "Directory", note: "The short list of operators worth knowing" },
  { key: "advertise", label: "Advertise", note: "What a listing is, and what disqualifies one" },
  { key: "widget", label: "Conditions widget", note: "A free embed for gateway businesses" },
  { key: "partners", label: "Group codes", note: "The Field Guide in packs, for lodging" },
  { key: "contact", label: "Contact", note: "Trip questions, corrections, press" },
];

// Flattened once for the active-group test.
function navGroupLinks(group) {
  return (group.columns || []).flatMap((col) => col.links);
}

window.NAV_GROUPS = NAV_GROUPS;
window.NAV_SECONDARY = NAV_SECONDARY;
window.navGroupLinks = navGroupLinks;

function Header({ current, go }) {
  const navGroups = NAV_GROUPS;

  // A group lights up when the reader is on its landing route or any of its
  // member pages; article and section routes belong to Read.
  const isGroupActive = (g) => {
    if (current === g.route) return true;
    if (navGroupLinks(g).some((l) => l.key === current)) return true;
    if (g.key === "read" && (current.startsWith("a:") || current.startsWith("cat:"))) return true;
    return false;
  };

  // Which mega panel is being held open past the pointer leaving it. CSS
  // :hover already opens and closes these on its own, and the hover bar under
  // the panel (styles.css) now keeps the whole reach from a trigger down to
  // any link inside the panel within the group, so this delay only has to
  // cover the hairline seam between the trigger row and that bar, plus a
  // pointer that clips the edge of the panel on its way to a link. Nothing
  // here can open a panel, so a JS failure degrades to plain hover rather
  // than to a dead menu.
  const [openGroup, setOpenGroup] = React.useState(null);
  // The group whose panel has been closed by taking one of its links. CSS
  // :hover alone would keep the panel up over the page the reader just asked
  // for, since the pointer is still inside it at that moment, so this beats
  // the hover rule until the pointer leaves and comes back.
  const [dismissedGroup, setDismissedGroup] = React.useState(null);
  const openTimer = React.useRef(null);
  const holdGroup = (key) => {
    clearTimeout(openTimer.current);
    setDismissedGroup(null);
    setOpenGroup(key);
  };
  const releaseGroup = () => {
    clearTimeout(openTimer.current);
    // Nothing to hold open if the panel was already dismissed; running the
    // delay would flash it back for a beat on the way out.
    if (dismissedGroup) { setDismissedGroup(null); setOpenGroup(null); return; }
    openTimer.current = setTimeout(() => setOpenGroup(null), 420);
  };
  const dismissGroup = (key, e) => {
    clearTimeout(openTimer.current);
    setOpenGroup(null);
    setDismissedGroup(key);
    // A mouse click leaves focus on the link, and :focus-within would hold the
    // panel open for good. Only pointer activations blur (detail is 0 for a
    // keyboard Enter, where dropping focus would strand the reader).
    if (e && e.detail > 0 && e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
  };
  React.useEffect(() => () => clearTimeout(openTimer.current), []);
  React.useEffect(() => {
    if (!openGroup) return;
    const onKey = (e) => { if (e.key === "Escape") dismissGroup(openGroup); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openGroup]);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuQuery, setMenuQuery] = React.useState("");
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  const closeMenu = () => { setMenuOpen(false); setMenuQuery(""); };

  // Search from the hamburger. The menu is the only nav on phones, so the
  // search box lives at the top of it rather than costing a tap through a
  // dropdown. Submitting hands the query to /search via ?q=, which that page
  // already reads on load.
  const submitMenuSearch = (e) => {
    e.preventDefault();
    const q = menuQuery.trim();
    closeMenu();
    if (window.track) window.track("nav_search_submit", { location: "menu", has_query: q ? "1" : "0" });
    if (!q) { go("search"); return; }
    const url = `/search?q=${encodeURIComponent(q)}`;
    // SearchPage reads ?q= once, at mount, so the query has to be on the URL
    // before the route commits. go() only pushes when the pathname changes, so
    // pushing here leaves the query string intact. Already on /search there is
    // no remount to hang the new query on, so that one case takes a real
    // navigation rather than silently doing nothing.
    if (window.location.pathname.replace(/\/+$/, "") === "/search") {
      window.location.assign(url);
      return;
    }
    window.history.pushState({ route: "search" }, "", url);
    go("search");
  };

  // One renderer for every nav link in the masthead. `href`-style entries are
  // real navigations (the generated archive pages), so they keep the browser's
  // default behaviour and never call go().
  const renderLink = (link, { baseClass, noteClass, onNavigate } = {}) => {
    const { key, href, label, note } = link;
    const isExternalPath = !!href;
    const body = note
      ? (
        <React.Fragment>
          <span className="nav__link-label">{label}</span>
          <span className={noteClass || "nav__link-note"}>{note}</span>
        </React.Fragment>
      )
      : label;
    return (
      <a
        key={key || href}
        href={isExternalPath ? href : (window.routeToPath ? window.routeToPath(key) : `/${key}`)}
        className={[baseClass, !isExternalPath && current === key && "is-active"].filter(Boolean).join(" ")}
        aria-current={!isExternalPath && current === key ? "page" : undefined}
        onClick={(e) => {
          if (onNavigate) onNavigate(e);
          if (isExternalPath) return; // real navigation; let the browser take it
          e.preventDefault();
          if (key === "guide" && window.track) window.track("guide_cta_click", { location: "masthead_nav" });
          go(key);
        }}
      >{body}</a>
    );
  };

  const renderPlainLink = (key, label, opts) => renderLink({ key, label }, opts);

  // The masthead used to open with a utility bar: dateline, Bulletin link,
  // three NWS forecasts, live entrance waits, the NPS Yosemite Guide. The
  // simplification pass removed the whole strip; /conditions carries the
  // forecasts and waits now, and the Bulletin lives in Explore Yosemite and
  // the bottom nav's Now tab.
  return (
    <React.Fragment>
    {/* First focusable element on every page; #main carries tabIndex={-1} in
        app.jsx so the fragment jump also moves focus. Bakes into the static
        home shell like the rest of the Header. */}
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="masthead">
      <div className="masthead__main">
        <a
          className="brand-block"
          href="/"
          onClick={(e) => { e.preventDefault(); releaseRockfall(e.currentTarget.querySelector(".brand__mark")); go("home"); }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {/* Own ?v= counter, like points.geojson: /img/* is served immutable
              for 30 days (_headers), so a repeat visitor would keep the old
              mark for a month without one. Bump when the mark is replaced. */}
          {/* alt="": the link's visible .brand text already names the site, so
              alt text here would announce "The Talus Field" twice on the first
              link of every page. */}
          {/* The masthead-sized cut of the mark (gen-brand-icons.mjs), not the
              805 x 622 master: the master is 567 KB and this is drawn 56 px
              tall. width/height are the file's intrinsic pixels so the box
              holds its aspect ratio before the bytes arrive; the CSS height
              still governs the drawn size. */}
          <img className="brand__mark" src="/img/talus-field-mark-masthead.png?v=2" alt="" width="214" height="168" loading="eager" />
          <span className="brand-block__text">
            <span className="brand">The Talus Field</span>
            <span className="brand__sub">A field journal of Yosemite</span>
          </span>
        </a>
        <nav className="nav" aria-label="Main">
          {navGroups.map((g) => {
            if (!g.columns) {
              return (
                <div key={g.key} className="nav__group">
                  {renderPlainLink(g.route, g.label, { baseClass: "nav__link" })}
                </div>
              );
            }
            return (
              // position: static on a mega group hands the panel's containing
              // block to .masthead__main, so it spans the full masthead width
              // and cannot overflow the viewport at any desktop size.
              <div
                key={g.key}
                className={[
                  "nav__group",
                  "nav__group--mega",
                  openGroup === g.key && "is-open",
                  dismissedGroup === g.key && "is-dismissed",
                ].filter(Boolean).join(" ")}
                onMouseEnter={() => holdGroup(g.key)}
                onMouseLeave={releaseGroup}
                onFocus={() => holdGroup(g.key)}
                onBlur={releaseGroup}
              >
                <a
                  href={window.routeToPath ? window.routeToPath(g.route) : `/${g.route}`}
                  className={["nav__link", "nav__group-trigger", isGroupActive(g) && "is-active"].filter(Boolean).join(" ")}
                  onClick={(e) => { e.preventDefault(); dismissGroup(g.key, e); go(g.route); }}
                >
                  {g.label}
                </a>
                {/* The caret is a real disclosure button, not decoration inside
                    the link: Enter on the link navigates, so the link cannot
                    also be the thing that expands and collapses the panel.
                    aria-expanded lives here. Collapsing goes through the same
                    dismissGroup path as taking a link, so the panel stays down
                    against :hover/:focus-within until the pointer or focus
                    leaves the group and comes back. */}
                <button
                  type="button"
                  className="nav__caret"
                  aria-expanded={openGroup === g.key}
                  aria-label={`${g.label} menu`}
                  onClick={(e) => {
                    if (openGroup === g.key) dismissGroup(g.key, e);
                    else holdGroup(g.key);
                  }}
                >▾</button>
                {/* Opened by CSS (:hover / :focus-within), so hover and
                    keyboard tabbing both work with no state to desync; the
                    is-open class above only holds it open a beat longer. */}
                <div className="nav__dropdown nav__dropdown--mega">
                  <div className="nav__dropdown-inner">
                    <div className="nav__dropdown-lede">
                      <div className="nav__dropdown-title">{g.label}</div>
                      {g.blurb && <p className="nav__dropdown-blurb">{g.blurb}</p>}
                      {renderPlainLink(g.route, g.cta || "Open the section →", { baseClass: "nav__dropdown-all", onNavigate: (e) => dismissGroup(g.key, e) })}
                    </div>
                    <div className="nav__dropdown-cols">
                      {g.columns.map((col) => (
                        <div key={col.heading} className="nav__dropdown-col">
                          <div className="nav__dropdown-heading">{col.heading}</div>
                          {col.links.map((link) => renderLink(link, { baseClass: "nav__dropdown-link", onNavigate: (e) => dismissGroup(g.key, e) }))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Search. Was the eighth item inside the Read dropdown, which put
              the site's own index three interactions deep on a site whose
              content no longer fits in a menu. It is a top-level destination
              now, and the hamburger carries a real query box. */}
          <a
            className={["nav__search", current === "search" && "is-active"].filter(Boolean).join(" ")}
            href={window.routeToPath ? window.routeToPath("search") : "/search"}
            aria-label="Search the journal"
            onClick={(e) => {
              e.preventDefault();
              if (window.track) window.track("cta_click", { location: "masthead_search", target: "search" });
              go("search");
            }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="nav__search-label">Search</span>
          </a>

          {/* The standalone "The Map" CTA (the A/B-tested mobile_cta winner)
              left the bar in the simplification pass: its job, a visible path
              to the funnel when the inline nav collapses, moved to the bottom
              nav's Map tab. */}
          <div className="nav__menu-wrap" ref={menuRef}>
            <button
              type="button"
              className="nav__menu-toggle"
              aria-expanded={menuOpen}
              aria-label="Menu"
              onClick={() => setMenuOpen(o => !o)}
            >
              <span className="nav__menu-bars" aria-hidden="true">
                <span></span><span></span><span></span>
              </span>
            </button>
            {menuOpen && (
              <div className="nav__menu">
                <form className="nav__menu-search" role="search" onSubmit={submitMenuSearch}>
                  <input
                    type="search"
                    name="q"
                    value={menuQuery}
                    onChange={(e) => setMenuQuery(e.target.value)}
                    placeholder="Search the journal"
                    aria-label="Search the journal"
                    autoComplete="off"
                  />
                  <button type="submit" aria-label="Search">
                    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
                      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </form>
                {navGroups.map((g) => (
                  <div key={g.key} className="nav__menu-group">
                    {g.columns ? (
                      <React.Fragment>
                        <div className="nav__menu-label">
                          {renderPlainLink(g.route, g.label, { baseClass: "nav__menu-label-link", onNavigate: closeMenu })}
                        </div>
                        {g.columns.map((col) => (
                          <React.Fragment key={col.heading}>
                            <div className="nav__menu-sublabel">{col.heading}</div>
                            {col.links.map((link) => renderLink(link, { onNavigate: closeMenu, noteClass: "nav__menu-note" }))}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ) : (
                      renderPlainLink(g.route, g.label, { onNavigate: closeMenu })
                    )}
                  </div>
                ))}
                <div className="nav__menu-group">
                  <div className="nav__menu-sublabel">More</div>
                  {NAV_SECONDARY.map((link) => renderLink(link, { onNavigate: closeMenu, noteClass: "nav__menu-note" }))}
                </div>
                <div className="nav__menu-group">
                  {renderPlainLink("explore", "Everything on this site →", { baseClass: "nav__menu-index", onNavigate: closeMenu })}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
    <BottomNav current={current} go={go} />
    </React.Fragment>
  );
}

// ============================================================
// Bottom navigation (phones). The inline nav collapses into the hamburger at
// 880px, which left the hamburger as the only way anywhere; this keeps the
// four highest-value destinations one thumb away on every page. Rendered by
// Header so it ships in the static home shell and paints before React boots.
// Shell-safe by construction: no browser APIs, no dates, nothing computed
// from the catalog. Hidden by returning null (not CSS) on the two surfaces
// that own their bottom edge, the map's bottom sheet and the guide page's
// buy bar, so a direct load of either never flashes it.
// ============================================================
const BOTTOM_NAV = [
  { key: "planning", label: "Plan" },
  { key: "now", label: "Now" },
  { key: "map", label: "Map" },
  { key: "articles", label: "Read" },
];

function BottomNav({ current, go }) {
  if (current === "map" || current === "guide") return null;
  const isActive = (key) => {
    if (key === "articles") return current === "articles" || current.startsWith("a:") || current.startsWith("cat:");
    if (key === "planning") return ["planning", "itineraries", "stay", "checklist", "kit"].includes(current);
    return current === key;
  };
  return (
    <nav className="bottomnav" aria-label="Quick navigation">
      {BOTTOM_NAV.map((t) => (
        <a
          key={t.key}
          className={["bottomnav__item", isActive(t.key) && "is-active"].filter(Boolean).join(" ")}
          aria-current={isActive(t.key) ? "page" : undefined}
          href={window.routeToPath ? window.routeToPath(t.key) : `/${t.key}`}
          onClick={(e) => {
            e.preventDefault();
            if (window.track) window.track("cta_click", { location: "bottom_nav", target: t.key });
            go(t.key);
          }}
        >{t.label}</a>
      ))}
    </nav>
  );
}

// ============================================================
// Site footer
// ============================================================
function Footer({ go }) {
  // The full map of the site in three columns. Since the nav simplification
  // pass the masthead bar carries only the primary destinations, so the
  // footer (with the hamburger's More section and /explore) is where the
  // secondary ones - films, the archive, the business pages - stay reachable.
  const link = (route, label) => (
    <li key={route}>
      <a
        href={window.routeToPath ? window.routeToPath(route) : `/${route}`}
        onClick={(e) => {
          e.preventDefault();
          if (route === "guide" && window.track) window.track("guide_cta_click", { location: "footer_guide_link" });
          go(route);
        }}
      >{label}</a>
    </li>
  );
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div className="site-footer__about">
            <div className="site-footer__masthead">The Talus Field</div>
            <div className="site-footer__sub">A field journal of Yosemite</div>
            <p>Notes on a single park, kept slowly. Updated when something is worth saying.</p>
            <a
              className="site-footer__index"
              href="/explore"
              onClick={(e) => { e.preventDefault(); if (window.track) window.track("cta_click", { location: "footer_index", target: "explore" }); go("explore"); }}
            >Everything on this site →</a>
          </div>
          <div>
            <h4>Read</h4>
            <ul>
              {link("articles", "All articles")}
              {window.CATEGORIES.map(c => (
                <li key={c.slug}>
                  <a href={`/section/${c.slug}`} onClick={(e) => { e.preventDefault(); go(`cat:${c.slug}`); }}>{c.label}</a>
                </li>
              ))}
              {link("now", "The Park Bulletin")}
              {link("films", "Films")}
              {/*
                /archive is generated static HTML (scripts/gen-archive.mjs), not an
                SPA route, so this link must be a real navigation — no go() handler.
              */}
              <li><a href="/archive/">Nature Notes archive</a></li>
            </ul>
          </div>
          <div>
            <h4>Plan</h4>
            <ul>
              {link("start-here", "Start here")}
              {link("planning", "The Planning Guide")}
              {link("map", "The Map")}
              {link("itineraries", "Itineraries")}
              {link("distances", "Drive times")}
              {link("webcams", "Webcams")}
              {link("stay", "Where to stay")}
              {link("conditions", "Conditions")}
              {link("checklist", "First-week checklist")}
              {link("kit", "Kit")}
              {link("guide", "The Field Guide")}
            </ul>
          </div>
          {/* Reader destinations only. The business and legal pages moved to
              the legal bar below: sitewide footer links are the site's most
              plentiful internal links, and /advertise, /widget, /partners,
              /privacy and /terms were each collecting 31 to 65 of them, more
              than any article except the gateway hub. They stay reachable
              (nothing is dropped, and NAV_SECONDARY still carries them) but
              they no longer outrank the writing for the site's own link
              equity. */}
          <div>
            <h4>The journal</h4>
            <ul>
              {link("about", "About")}
              {link("newsletter", "Newsletter")}
              {link("contact", "Contact")}
              {link("search", "Search")}
              {link("places", "Directory")}
            </ul>
          </div>
        </div>
        <div className="site-footer__disclosure">
          Some links on this site are affiliate links. If you book or buy through one, The Talus Field may earn a small commission at no extra cost to you. <a href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>Full disclosure here.</a>
        </div>
        <div className="site-footer__legal">
          <div>© {new Date().getFullYear()} The Talus Field. Independent. Not affiliated with the National Park Service.</div>
          <div>
            <a href="/advertise" onClick={(e) => { e.preventDefault(); go("advertise"); }}>Advertise</a>
            <a href="/widget" onClick={(e) => { e.preventDefault(); go("widget"); }}>Conditions widget</a>
            <a href="/partners" onClick={(e) => { e.preventDefault(); go("partners"); }}>Group codes</a>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); go("privacy"); }}>Privacy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); go("terms"); }}>Terms</a>
            <a href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>Affiliate</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// Breadcrumbs. The visible counterpart of the BreadcrumbList JSON-LD that
// edge/seo.js and app.jsx emit: Google increasingly cross-checks breadcrumb
// rich results against on-page navigation, and the links add crawl paths.
// `trail` is an array of { label, route }; the last item (no route) is the
// current page.
// ============================================================
function Breadcrumbs({ trail, go }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((c, i) => (
          <li key={i}>
            {c.route != null ? (
              <a
                href={window.routeToPath ? window.routeToPath(c.route) : "/"}
                onClick={(e) => { e.preventDefault(); go(c.route); }}
              >{c.label}</a>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
window.Breadcrumbs = Breadcrumbs;

// ============================================================
// Keep going. The standing pages used to end in nothing: a reader who finished
// /conditions or /firefall had the masthead and the footer and no sense of
// what sat next to the page they were on. This is the curated answer — three
// or four onward links per route, chosen for what a reader on that page
// actually wants next, mounted once in app.jsx rather than pasted into
// twenty page components.
//
// Rules: a route not listed here renders nothing (silence beats a generic
// "related pages" strip), a link is { key } for an SPA route or { href } for a
// real navigation, and no route lists itself.
// ============================================================
const KEEP_GOING = {
  // --- Reading surfaces ---
  articles: { links: [
    { key: "planning", label: "The Planning Guide", note: "The same archive, ordered for a real trip" },
    { key: "search", label: "Search", note: "By title, section, or dek" },
    { href: "/archive/", label: "Nature Notes archive", note: "The park's own bulletin, 512 issues" },
    { key: "films", label: "Films", note: "The NPS Nature Notes series" },
  ] },
  films: { links: [
    { href: "/archive/", label: "Nature Notes archive", note: "The print run the films are named for" },
    { key: "cat:wildlife", label: "Wildlife and nature", note: "The written version" },
    { key: "articles", label: "All articles", note: "Everything published, newest first" },
  ] },
  now: { links: [
    { key: "conditions", label: "Conditions", note: "Webcams, entrance waits, forecasts" },
    { key: "itineraries", label: "Itineraries", note: "A plan for the days you have" },
    { key: "map", label: "The Map", note: "Build the route yourself" },
  ] },
  search: { links: [
    { key: "articles", label: "All articles", note: "Everything published, newest first" },
    { key: "planning", label: "The Planning Guide", note: "The whole archive, in trip order" },
    { key: "explore", label: "Site index", note: "Every page on the site" },
  ] },

  // --- Planning surfaces ---
  planning: { links: [
    { key: "checklist", label: "First-week checklist", note: "The week before you go, in order" },
    { key: "stay", label: "Where to stay", note: "The decision with a deadline" },
    { key: "itineraries", label: "Itineraries", note: "Plans in drive order" },
    { key: "kit", label: "Kit", note: "What to actually pack" },
  ] },
  checklist: { links: [
    { key: "kit", label: "Kit", note: "What goes in the pack" },
    { key: "conditions", label: "Conditions", note: "Check it the morning you drive in" },
    { key: "planning", label: "The Planning Guide", note: "The long version" },
  ] },
  kit: { links: [
    { key: "checklist", label: "First-week checklist", note: "The week before you go, in order" },
    { key: "planning", label: "The Planning Guide", note: "The whole archive, in trip order" },
    { key: "cat:trails", label: "Trails and hikes", note: "Where the kit gets used" },
  ] },
  itineraries: { links: [
    { key: "map", label: "The Map", note: "Change a plan, or build your own" },
    { key: "stay", label: "Where to stay", note: "Book the nights the plan needs" },
    { key: "conditions", label: "Conditions", note: "What is open on your dates" },
  ] },
  conditions: { links: [
    { key: "now", label: "The Park Bulletin", note: "Closures, programs, hours, events" },
    { key: "map", label: "The Map", note: "Turn conditions into a route" },
    { key: "itineraries", label: "Itineraries", note: "Plans in drive order" },
  ] },
  stay: { links: [
    { key: "distances", label: "Drive times", note: "How far each town is from the Valley" },
    { key: "planning", label: "The Planning Guide", note: "Everything else the trip needs" },
    { key: "itineraries", label: "Itineraries", note: "What to do from where you booked" },
    { key: "checklist", label: "First-week checklist", note: "The week before you go, in order" },
  ] },
  webcams: { links: [
    { key: "conditions", label: "Conditions", note: "Forecasts and live entrance waits" },
    { key: "now", label: "The Park Bulletin", note: "What the park says about this week" },
    { key: "tioga-opening", label: "Tioga Road opening", note: "The view the cameras do not cover" },
    { key: "map", label: "The trip map", note: "Where the views actually are" },
  ] },
  "start-here": { links: [
    { key: "planning", label: "The Planning Guide", note: "Five answers in, a plan out" },
    { key: "stay", label: "Where to stay", note: "The first decision with a deadline" },
    { key: "itineraries", label: "Itineraries", note: "Half-day to three-day plans, in drive order" },
    { key: "conditions", label: "Conditions", note: "What is open on your dates" },
  ] },
  distances: { links: [
    { key: "stay", label: "Where to stay", note: "The beds at the end of each drive" },
    { key: "conditions", label: "Conditions", note: "Entrance waits and road status now" },
    { key: "tioga-opening", label: "Tioga Road opening", note: "When the east-side route comes back" },
    { key: "planning", label: "The Planning Guide", note: "The rest of the trip, in order" },
  ] },
  map: { links: [
    { key: "itineraries", label: "Itineraries", note: "Start from a plan instead" },
    { key: "conditions", label: "Conditions", note: "Before you drive in" },
    { key: "guide", label: "The Field Guide", note: "The same stops, offline" },
  ] },
  consult: { links: [
    { key: "planning", label: "The Planning Guide", note: "The free version" },
    { key: "guide", label: "The Field Guide", note: "The same park, offline and in your pocket" },
    { key: "itineraries", label: "Itineraries", note: "Plans in drive order" },
  ] },

  // --- The three dated-event pages, which are each other's best next link ---
  firefall: { links: [
    { key: "tioga-opening", label: "Tioga Road opening", note: "The other date people plan around" },
    { key: "half-dome-lottery", label: "Half Dome lottery", note: "The permit odds, plainly" },
    { key: "stay", label: "Where to stay", note: "February fills early" },
    { key: "conditions", label: "Conditions", note: "Webcams, entrance waits, forecasts" },
  ] },
  "tioga-opening": { links: [
    { key: "half-dome-lottery", label: "Half Dome lottery", note: "The permit odds, plainly" },
    { key: "firefall", label: "Firefall", note: "Whether the light is worth the trip" },
    { key: "itineraries", label: "Itineraries", note: "What the high country is worth" },
    { key: "conditions", label: "Conditions", note: "Webcams, entrance waits, forecasts" },
  ] },
  "half-dome-lottery": { links: [
    { key: "tioga-opening", label: "Tioga Road opening", note: "When the high country opens" },
    { key: "firefall", label: "Firefall", note: "Whether the light is worth the trip" },
    { key: "cat:trails", label: "Trails and hikes", note: "The rest of the park's big days" },
    { key: "kit", label: "Kit", note: "What earns its place in the pack" },
  ] },

  // --- The journal ---
  about: { links: [
    { key: "newsletter", label: "Newsletter", note: "One letter a week" },
    { key: "articles", label: "All articles", note: "Everything published, newest first" },
    { key: "contact", label: "Contact", note: "Trip questions, corrections, press" },
  ] },
  places: { links: [
    { key: "stay", label: "Where to stay", note: "Lodging, covered properly" },
    { key: "advertise", label: "Advertise", note: "For operators" },
    { key: "about", label: "About the journal", note: "Who writes this, and why" },
  ] },
  advertise: { links: [
    { key: "places", label: "The Directory", note: "The short list of operators worth knowing" },
    { key: "partners", label: "Group codes", note: "The Field Guide, in packs" },
    { key: "widget", label: "Conditions widget", note: "Free embed" },
  ] },
  widget: { links: [
    { key: "partners", label: "Group codes", note: "The Field Guide in packs, for lodging" },
    { key: "advertise", label: "Advertise", note: "What a listing is, and what disqualifies one" },
    { key: "conditions", label: "Conditions", note: "The full page the widget summarizes" },
  ] },
  partners: { links: [
    { key: "guide", label: "The Field Guide", note: "What your guests get" },
    { key: "widget", label: "Conditions widget", note: "A free conditions embed for businesses" },
    { key: "advertise", label: "Advertise", note: "What a listing is, and what disqualifies one" },
  ] },
  guide: { links: [
    { key: "map", label: "The Map", note: "The free version, in the browser" },
    { key: "planning", label: "The Planning Guide", note: "The whole archive, in trip order" },
    { key: "partners", label: "Group codes", note: "For lodging and rental hosts" },
  ] },
  newsletter: { links: [
    { key: "now", label: "The Park Bulletin", note: "The same board, without the wait" },
    { key: "articles", label: "All articles", note: "Everything published, newest first" },
    { key: "about", label: "About the journal", note: "Who writes this, and why" },
  ] },
  contact: { links: [
    { key: "about", label: "About the journal", note: "Who writes this, and why" },
    { key: "consult", label: "Trip consults", note: "For real trip questions" },
    { key: "advertise", label: "Advertise", note: "For operators" },
  ] },
  explore: { links: [
    { key: "search", label: "Search", note: "If you know what you are looking for" },
    { key: "articles", label: "All articles", note: "Everything published, newest first" },
    { key: "planning", label: "The Planning Guide", note: "The whole archive, in trip order" },
  ] },
  notfound: { links: [
    { key: "explore", label: "Site index", note: "Every page on the site" },
    { key: "articles", label: "All articles", note: "Everything published, newest first" },
    { key: "search", label: "Search", note: "Titles, deks, and sections, as you type" },
  ] },
};

function KeepGoing({ route, go }) {
  const entry = KEEP_GOING[route];
  if (!entry) return null;
  return (
    <section className="keep-going" aria-labelledby="keep-going-heading">
      <div className="wrap">
        <h2 className="keep-going__heading" id="keep-going-heading">{entry.heading || "Keep going"}</h2>
        <div className="keep-going__grid">
          {entry.links.map((l) => (
            <a
              key={l.key || l.href}
              className="keep-going__card"
              href={l.href || (window.routeToPath ? window.routeToPath(l.key) : `/${l.key}`)}
              onClick={(e) => {
                if (l.href) return; // real navigation (the generated archive)
                e.preventDefault();
                if (window.track) window.track("keep_going_click", { from: route, target: l.key });
                go(l.key);
              }}
            >
              <span className="keep-going__label">{l.label}</span>
              {l.note && <span className="keep-going__note">{l.note}</span>}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
window.KeepGoing = KeepGoing;
window.KEEP_GOING = KEEP_GOING;

// ============================================================
// Share row. The quiet article share affordance: native share sheet where
// the platform has one, copy-link everywhere else. Fires article_share so
// the referral loop is finally measurable (the map's trip links have had
// this for months; articles had nothing).
// ============================================================
function ShareRow({ title, slug }) {
  const [copied, setCopied] = React.useState(false);
  const share = async () => {
    const url = `${window.SITE_ORIGIN || ""}${window.location.pathname}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        if (window.track) window.track("article_share", { slug, method: "web-share" });
      } catch (_e) { /* reader dismissed the sheet; not a share */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (window.track) window.track("article_share", { slug, method: "copy" });
    } catch (_e) {
      window.prompt("Copy this link:", url);
    }
  };
  return (
    <div className="share-row" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)" }}>
      <span>Worth sending to your trip partner?</span>
      <button
        type="button"
        onClick={share}
        style={{
          font: "inherit", color: "var(--moss)", background: "none",
          border: "1px solid var(--rule)", padding: "6px 14px", cursor: "pointer",
        }}
      >{copied ? "Link copied" : "Share this article"}</button>
    </div>
  );
}
window.ShareRow = ShareRow;

// ============================================================
// Affiliate note
// ============================================================
// End-of-article disclosure for any body that carries inline affiliate
// links, per the convention stated on the /affiliate page. The /affiliate
// href is a plain link: app.jsx's document-level click handler turns plain
// same-origin links into SPA navigations, the same way it handles the
// /articles/* links inside bodies. Rendered as the last element of a body.
function AffiliateNote() {
  return (
    <p className="article-aff-note">
      Some links in this piece are affiliate links. If you buy or book through one, The Talus Field may earn a small commission at no extra cost to you. The recommendations do not change for it. <a href="/affiliate">Full disclosure.</a>
    </p>
  );
}
window.AffiliateNote = AffiliateNote;

// ============================================================
// Lodging availability links (MONETIZATION-IDEAS.md 3.1)
// ============================================================
// One builder for every Expedia link on the site. Before this existed the
// markup was copy-pasted per article body, so the network name, the rel
// attributes, and the GA4 payload could drift link by link; now a body, a
// standing page, and the map sidebar all mint the same thing.
//
// Two properties worth keeping:
//
//   1. It fails soft, like affiliate.js: with an empty EXPEDIA_CAMREF this
//      renders a plain outbound Expedia search, so nothing here breaks if the
//      program ever lapses.
//   2. It searches a *destination*, never a specific property ID. A hotel ID
//      is a fact that can go stale silently (a property renames, delists, or
//      closes and the link starts selling something else); a destination
//      search answers the only question the link is for, which is "what is
//      actually left on my dates". The recommendation next to the link is
//      editorial and comes from the article body.
//
// The guardrail published on /affiliate holds everywhere these render: the
// best recommendation stays the recommendation, linkless, if it is not
// bookable through a program. The Ahwahnee link does not make the Ahwahnee a
// better hotel, and the Wawona Hotel, closed for renovation, carries no link
// at all.
const EXPEDIA_SEARCH_BASE = "https://www.expedia.com/Hotel-Search?destination=";

function expediaSearchUrl(destination) {
  return EXPEDIA_SEARCH_BASE + encodeURIComponent(destination);
}

// A single disclosed availability link. `destination` is what Expedia
// searches ("Mariposa, California"); `name` is what GA4 records.
function AvailabilityLink({ destination, children, list, slug, name, className, style }) {
  const href = window.buildAffiliateLink
    ? window.buildAffiliateLink("expedia", expediaSearchUrl(destination))
    : expediaSearchUrl(destination);
  return (
    <a
      className={["aff-link", className].filter(Boolean).join(" ")}
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      data-aff-network="expedia"
      data-aff-list={list || "page"}
      data-aff-item-slug={slug || ""}
      data-aff-name={name || destination + " lodging search"}
      style={style}
    >
      {children || `Check ${destination} availability →`}
    </a>
  );
}

// The boxed version, for the end of a section that has just told the reader
// where to sleep. Carries its own one-line disclosure so it stays honest
// wherever it is dropped, including pages with no AffiliateNote at the end.
// The optional photo slot (image/caption/credit) follows the /stay card rule:
// only a photo that shows the place the link searches, never stock mood. Any
// markup change here must be hand-mirrored in scripts/gen-prerender.mjs.
function LodgingCta({ destination, heading, note, list, slug, cta, stayLink, image, caption, credit }) {
  return (
    // aria-label: this aside also mounts inside the homepage rail's labeled
    // aside, and an unnamed complementary landmark inside a named one reads
    // as noise in a screen reader's landmark list.
    <aside className="lodging-cta" aria-label="Lodging availability">
      {image && (
        <figure className="lodging-cta__figure">
          <ResponsiveImage image={image} alt={caption || ""} sizes={SIZES_CARD} className="lodging-cta__img" />
          {caption && (
            <figcaption className="lodging-cta__caption">
              {caption}
              {credit && <span className="lodging-cta__credit">{credit}</span>}
            </figcaption>
          )}
        </figure>
      )}
      {/* h3, not a div: heading navigation has to reach the offer. */}
      <h3 className="lodging-cta__head">{heading || "Check what is actually available"}</h3>
      {note && <p className="lodging-cta__note">{note}</p>}
      <p className="lodging-cta__actions">
        <AvailabilityLink
          destination={destination}
          list={list}
          slug={slug}
          className="lodging-cta__link"
        >{cta || `Search ${destination} lodging →`}</AvailabilityLink>
        {stayLink !== false && (
          <a className="lodging-cta__secondary" href="/stay">Where to stay: every option compared</a>
        )}
      </p>
      <p className="lodging-cta__disclosure">
        Availability links are affiliate links. The recommendations do not change for them. <a href="/affiliate">Disclosure.</a>
      </p>
    </aside>
  );
}

// Expedia-supplied banner creative, labeled as what it is. Fail-soft: renders
// nothing until both fields of window.EXPEDIA_BANNER (affiliate.js) are pasted
// in from the creator portal. One placement on /stay; it is not a component to
// scatter (MONETIZATION-IDEAS.md rules out display-ad walls, and one disclosed
// affiliate unit on the lodging board is the whole exception).
function ExpediaBanner({ list, slug }) {
  const b = window.EXPEDIA_BANNER;
  if (!b || !b.img || !b.href) return null;
  return (
    <aside className="expedia-banner">
      <a
        href={b.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        data-aff-network="expedia"
        data-aff-list={list || "banner"}
        data-aff-item-slug={slug || ""}
        data-aff-name="Expedia banner"
      >
        <img src={b.img} alt={b.alt || ""} loading="lazy" width={b.width} height={b.height} referrerPolicy="no-referrer" />
      </a>
      <p className="expedia-banner__disclosure">
        Advertisement. Expedia is an affiliate partner of The Talus Field. <a href="/affiliate">Disclosure.</a>
      </p>
    </aside>
  );
}

Object.assign(window, { expediaSearchUrl, AvailabilityLink, LodgingCta, ExpediaBanner });

// ============================================================
// Read history. The article page's progress tracker (page-article.jsx) writes
// two keys through safeStorage: tfg.read.last, the most recent piece left
// unfinished, and tfg.read.done, slugs read to roughly the end (capped). The
// home page reads them for the resume band; the article page reads done() to
// rank its related rail unread-first. Fails quiet everywhere: no storage means
// no history, no resume band, and the untouched default related order.
// ============================================================
const READ_LAST_KEY = "tfg.read.last";
const READ_DONE_KEY = "tfg.read.done";
const READ_DONE_CAP = 100;

const readHistory = {
  last() {
    const v = window.safeStorage.getJSON(READ_LAST_KEY);
    return v && typeof v.slug === "string" && typeof v.pct === "number" ? v : null;
  },
  setLast(slug, pct) {
    window.safeStorage.setJSON(READ_LAST_KEY, { slug, pct, at: new Date().toISOString() });
  },
  clearLast(slug) {
    const cur = this.last();
    if (cur && cur.slug === slug) window.safeStorage.remove(READ_LAST_KEY);
  },
  done() {
    const v = window.safeStorage.getJSON(READ_DONE_KEY);
    return new Set(Array.isArray(v) ? v : []);
  },
  markDone(slug) {
    const set = this.done();
    if (set.has(slug)) return;
    set.add(slug);
    window.safeStorage.setJSON(READ_DONE_KEY, Array.from(set).slice(-READ_DONE_CAP));
  },
};
window.readHistory = readHistory;

// ============================================================
// Article card
// ============================================================
// `onNav` (optional) fires just before navigation so a surface can tag the
// click (e.g. the related rail's related_click event) without every card
// paying for it.
function ArticleCard({ article, go, size, onNav }) {
  const cat = window.findCategory(article.cat);
  return (
    <a
      className="card"
      href={`/articles/${article.slug}`}
      onClick={(e) => { e.preventDefault(); if (onNav) onNav(article); go(`a:${article.slug}`); }}
    >
      <Placeholder
        caption={article.placeholder}
        image={article.image}
        tag={cat.label.split(" ")[0]}
        size={size === "sm" ? "sm" : null}
        sizes={SIZES_CARD}
        style={{ aspectRatio: size === "wide" ? "16/9" : "4/3" }}
        motif={
          article.cat === "trails" ? <MotifMountains /> :
          article.cat === "wildlife" ? <MotifTrees /> :
          article.cat === "seasonal" ? <MotifSun /> : null
        }
      />
      <div style={{ marginTop: 14 }}>
        <div className="card__cat">{cat.label}</div>
        <div className="card__title">{article.title}</div>
        {size !== "sm" && <div className="card__dek">{article.dek}</div>}
        <div className="card__meta">
          <span>{article.date}</span>
          <span>{article.read}</span>
        </div>
      </div>
    </a>
  );
}

// ============================================================
// Newsletter submit side-effects (shared)
// The subscribe forms POST into a hidden iframe (target="buttondown-target",
// declared in index.html) so the page never navigates and no popup opens.
// Buttondown never reports back to the page, so the conversion event and the
// local "subscribed" flag fire optimistically on submit. The map and guide
// gates layer their own unlock on top of this. Exposed on window so page-level
// forms (map gate, guide, newsletter page) can reuse the exact same behavior.
// ============================================================
function trackNewsletterSubmit(location, tag, variant) {
  if (window.track) window.track("newsletter_signup", { location: location || "unknown", tag: tag || "", variant: variant || "" });
  window.safeStorage.set("tfg.nl.subscribed", "1");
}
window.trackNewsletterSubmit = trackNewsletterSubmit;

// Impression counterpart to trackNewsletterSubmit. Fires when a newsletter unit
// scrolls into view so GA4 can compute a view -> signup rate per placement
// (same `location` as the matching submit). No localStorage side effect.
// `variant` is the A/B bucket (see abVariant) so view->signup is computable per arm.
function trackNewsletterImpression(location, tag, variant) {
  if (window.track) window.track("newsletter_impression", { location: location || "unknown", tag: tag || "", variant: variant || "" });
}
window.trackNewsletterImpression = trackNewsletterImpression;

// ============================================================
// Lightweight A/B bucketing. No third-party tool: assign a sticky 50/50 bucket
// per device, persisted through window.safeStorage, and tag it onto the GA4
// `variant` param of the matching impression/signup events so each test's
// view->signup rate is sliceable per arm. Fails OPEN to "a" (control) when
// storage is unavailable, mirroring the map gate, so a private-mode visitor
// always sees the safe variant and never a half-applied experiment.
// ============================================================
function abVariant(testKey) {
  const storeKey = "tfg.ab." + testKey;
  const existing = window.safeStorage.get(storeKey);
  if (existing === "a" || existing === "b") return existing;
  const assigned = Math.random() < 0.5 ? "a" : "b";
  // set() returns false when storage is unavailable; in that case we cannot make
  // the bucket sticky, so fall open to control rather than reshuffle every render.
  if (!window.safeStorage.set(storeKey, assigned)) return "a";
  return assigned;
}
window.abVariant = abVariant;

// Single read-path for the subscribed flag. Reads through window.safeStorage,
// which returns null when storage is unavailable, so this is false in private
// mode just as before.
function isSubscribed() {
  return window.safeStorage.get("tfg.nl.subscribed") === "1";
}
window.isSubscribed = isSubscribed;

// Fire-once impression hook. Returns a ref to spread onto a unit's outer node;
// the impression fires the first time that node is 40% visible, then the
// observer disconnects. Pass enabled={false} to skip firing (e.g. when the unit
// is rendering its already-subscribed soft state) so conversion-rate
// denominators only count real asks. Falls back to firing immediately where
// IntersectionObserver is unavailable.
function useNewsletterImpression(location, tag, enabled, variant) {
  const ref = useRef(null);
  const firedRef = useRef(false);
  useEffect(() => {
    if (enabled === false) return;
    const node = ref.current;
    if (!node) return;
    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      trackNewsletterImpression(location, tag, variant);
    };
    if (typeof IntersectionObserver === "undefined") { fire(); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { fire(); io.disconnect(); break; }
      }
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, [location, tag, enabled, variant]);
  return ref;
}
window.useNewsletterImpression = useNewsletterImpression;

// ============================================================
// Inline newsletter box. `location` is the unique GA4 identifier for the
// placement; `tag` is the Buttondown segmentation tag for that source.
// ============================================================
// `cta` overrides the button label and `modifier` appends a class to the box,
// both optional and both defaulting to the shipped look, so every existing call
// site is unchanged. The homepage rail uses them to render the letter as a
// framed unit with a solid button.
function NewsletterInline({ heading, blurb, location, tag, incentive, abTest, variant: variantProp, cta, modifier }) {
  const [done, setDone] = useState(false);
  const subscribed = isSubscribed();
  // Optional A/B. Either the component self-buckets (abTest = test key) and
  // bucket "b" forces the map-first incentive copy over the caller's blurb, or
  // the caller controls the copy itself and just passes `variant` for tagging.
  // Either way variant is tagged onto the GA4 events for per-arm rates.
  const variant = abTest ? window.abVariant(abTest) : (variantProp || "");
  const forceIncentive = abTest && variant === "b";
  // Lead with the interactive-map incentive by default, but never override a
  // caller's explicit blurb (so existing per-placement copy is untouched)
  // unless the A/B bucket says to.
  const showIncentive = forceIncentive || (incentive !== false && !blurb);
  // Only count an impression when an actual ask is on screen, not the
  // subscribed soft state or the post-submit confirmation.
  const ref = useNewsletterImpression(location, tag, !subscribed && !done, variant);

  if (subscribed && !done) {
    return (
      <div className={["nlbox", "nlbox--subscribed", modifier].filter(Boolean).join(" ")} ref={ref}>
        <p className="nlbox__already">You're on the list. <a href="/map">The interactive map is open to you →</a></p>
      </div>
    );
  }

  return (
    <div className={["nlbox", modifier].filter(Boolean).join(" ")} ref={ref}>
      <h3>{heading || "Sunday Field Notes"}</h3>
      <p>{showIncentive
          ? "Subscribe and unlock the interactive Yosemite map: vistas, trailheads, parking turnouts, places to eat, and a trip builder that saves on your device. A short note follows on Sundays."
          : (blurb || "A short note on Sundays, when there is something to say.")}</p>
      {done ? (
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, color: "var(--moss)", margin: 0, padding: "8px 0" }}>
          You're in. <a href="/map">The map is open to you →</a>
        </p>
      ) : (
        <form
          className="nlbox__form"
          action="https://buttondown.com/api/emails/embed-subscribe/goehring"
          method="post"
          target="buttondown-target"
          onSubmit={() => { trackNewsletterSubmit(location, tag, variant); setTimeout(() => setDone(true), 0); }}
        >
          <input type="email" name="email" aria-label="Email address" placeholder="you@email.com" required />
          {tag && <input type="hidden" name="tag" value={tag} />}
          <input type="hidden" name="embed" value="1" />
          <button type="submit">{cta || "Subscribe →"}</button>
        </form>
      )}
    </div>
  );
}

// ============================================================
// Exit-intent newsletter modal. Article pages mount one of these. It shows at
// most once per 14 days (tfg.nl.exit.seen) and never once subscribed
// (tfg.nl.subscribed). Desktop trigger is the cursor leaving toward the
// browser chrome; touch devices have no exit signal, so they fall back to a
// scroll-depth + dwell heuristic.
// ============================================================
const EXIT_COOLDOWN_DAYS = 14;

// ============================================================
// Modal focus management, shared by the exit-intent modal and the map
// lightbox. role="dialog" promises AT a contained surface; this delivers the
// keyboard half: focus moves into the dialog on open, Tab cycles inside it,
// and focus returns to the opener on close. Returns a ref for the dialog's
// card/panel element. `initialSelector` picks the control to land on first
// (defaults to the dialog's first focusable).
// ============================================================
function useModalFocus(active, initialSelector) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!active || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    const focusables = () => Array.from(dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
    const initial = (initialSelector && dialog.querySelector(initialSelector)) || focusables()[0];
    if (initial) initial.focus();
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    dialog.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      if (opener && typeof opener.focus === "function" && document.contains(opener)) opener.focus();
    };
  }, [active, initialSelector]);
  return dialogRef;
}

function ExitIntentNewsletter({ disabled }) {
  const [open, setOpen] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (disabled) return;
    let suppressed = window.safeStorage.get("tfg.nl.subscribed") === "1";
    const seen = window.safeStorage.get("tfg.nl.exit.seen");
    if (seen) {
      const ageDays = (Date.now() - new Date(seen).getTime()) / 86400000;
      if (ageDays < EXIT_COOLDOWN_DAYS) suppressed = true;
    }
    if (suppressed) return;

    const reveal = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      window.safeStorage.set("tfg.nl.exit.seen", new Date().toISOString());
      if (window.track) window.track("newsletter_exit_intent_shown", { location: "article_exit_intent", tag: "exit-intent" });
      trackNewsletterImpression("article_exit_intent", "exit-intent");
      setOpen(true);
    };

    const onMouseOut = (e) => { if (e.clientY <= 0 && !e.relatedTarget) reveal(); };

    const isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
    const mountedAt = Date.now();
    const onScroll = () => {
      if (Date.now() - mountedAt < 25000) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.6) reveal();
    };

    if (isTouch) {
      window.addEventListener("scroll", onScroll, { passive: true });
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
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Land on Close, not the email input: this modal interrupts, and focusing
  // the input would raise the keyboard on the touch (scroll-triggered) path.
  const dialogRef = useModalFocus(open, ".nlmodal__close");

  if (!open) return null;

  return (
    <div className="nlmodal" role="dialog" aria-modal="true" aria-label="Subscribe to Sunday Field Notes">
      <div className="nlmodal__backdrop" onClick={() => setOpen(false)} />
      <div className="nlmodal__card" ref={dialogRef}>
        <button type="button" className="nlmodal__close" aria-label="Close" onClick={() => setOpen(false)}>✕</button>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>Before you go</div>
        <h3>One letter a week. Sometimes none.</h3>
        <p>Sunday Field Notes: what is open, what is blooming, and the occasional longer piece. Free, and you can leave anytime.</p>
        <form
          className="nlbox__form"
          action="https://buttondown.com/api/emails/embed-subscribe/goehring"
          method="post"
          target="buttondown-target"
          onSubmit={() => { trackNewsletterSubmit("article_exit_intent", "exit-intent"); setTimeout(() => setOpen(false), 0); }}
        >
          <input type="email" name="email" aria-label="Email address" placeholder="you@email.com" required />
          <input type="hidden" name="tag" value="exit-intent" />
          <input type="hidden" name="embed" value="1" />
          <button type="submit">Subscribe →</button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// MapLightbox. Click-to-expand modal with pan + zoom (mouse wheel,
// drag, touch pinch). Self-contained, no external libraries.
// ============================================================
function MapLightbox({ src, alt, caption, onClose }) {
  const MIN = 1, MAX = 6;
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [grabbing, setGrabbing] = useState(false);
  const dragRef = useRef(null);
  const pinchRef = useRef(null);
  const viewportRef = useRef(null);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const reset = () => { setScale(1); setTx(0); setTy(0); };

  const zoomAt = (clientX, clientY, factor) => {
    setScale(prev => {
      const next = clamp(prev * factor, MIN, MAX);
      if (next === prev || !viewportRef.current) return next;
      const rect = viewportRef.current.getBoundingClientRect();
      const cx = clientX - rect.left - rect.width / 2;
      const cy = clientY - rect.top - rect.height / 2;
      const ratio = next / prev;
      setTx(t => t * ratio + cx * (1 - ratio));
      setTy(t => t * ratio + cy * (1 - ratio));
      if (next === 1) { setTx(0); setTy(0); }
      return next;
    });
  };

  const zoomCenter = (factor) => {
    if (!viewportRef.current) return;
    const r = viewportRef.current.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, factor);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") zoomCenter(1.4);
      else if (e.key === "-" || e.key === "_") zoomCenter(1 / 1.4);
      else if (e.key === "0") reset();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Native, non-passive wheel listener so preventDefault works in all browsers.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.15 : 1 / 1.15);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const onMouseDown = (e) => {
    if (e.button !== 0 || scale === 1) return;
    dragRef.current = { x: e.clientX - tx, y: e.clientY - ty };
    setGrabbing(true);
  };
  const onMouseMove = (e) => {
    if (!dragRef.current) return;
    setTx(e.clientX - dragRef.current.x);
    setTy(e.clientY - dragRef.current.y);
  };
  const stopDrag = () => { dragRef.current = null; setGrabbing(false); };

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = {
        dist: Math.hypot(dx, dy),
        startScale: scale,
        cx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        cy: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    } else if (e.touches.length === 1 && scale > 1) {
      dragRef.current = { x: e.touches[0].clientX - tx, y: e.touches[0].clientY - ty };
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const target = clamp(pinchRef.current.startScale * (dist / pinchRef.current.dist), MIN, MAX);
      const factor = target / scale;
      if (factor !== 1) zoomAt(pinchRef.current.cx, pinchRef.current.cy, factor);
    } else if (e.touches.length === 1 && dragRef.current) {
      e.preventDefault();
      setTx(e.touches[0].clientX - dragRef.current.x);
      setTy(e.touches[0].clientY - dragRef.current.y);
    }
  };
  const onTouchEnd = (e) => {
    if (e.touches.length === 0) { pinchRef.current = null; dragRef.current = null; }
  };

  const onImageClick = (e) => {
    if (dragRef.current) return;
    if (scale === 1) zoomAt(e.clientX, e.clientY, 2);
    else reset();
  };

  const cursor = scale > 1 ? (grabbing ? "grabbing" : "grab") : "zoom-in";

  // Mounted only while open, so the hook is unconditionally active.
  const dialogRef = useModalFocus(true, ".lightbox__close");

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt || caption || "Map"}>
      <div className="lightbox__backdrop" onClick={onClose} />
      <div className="lightbox__panel" ref={dialogRef}>
        <div
          className="lightbox__viewport"
          ref={viewportRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ cursor }}
        >
          <img
            className="lightbox__img"
            src={src}
            alt={alt || ""}
            draggable={false}
            style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
            onClick={onImageClick}
          />
        </div>
        <div className="lightbox__bar">
          {caption && <div className="lightbox__caption">{caption}</div>}
          <div className="lightbox__controls">
            <button type="button" onClick={() => zoomCenter(1 / 1.4)} aria-label="Zoom out">−</button>
            <button type="button" onClick={reset} aria-label="Reset zoom">{Math.round(scale * 100)}%</button>
            <button type="button" onClick={() => zoomCenter(1.4)} aria-label="Zoom in">+</button>
            <button type="button" className="lightbox__close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Live webcam strip (Yosemite Conservancy / Pixelcaster). Shared by the
// homepage and /conditions. The cache-bust timestamp is fixed per mount so
// the four thumbnails come from the same moment; a failed cam hides its own
// tile. Every link is external and opens in a new tab, so the delegated
// outbound_click listener in app.jsx measures the strip with no markup here.
// ============================================================
const WEBCAMS = [
  { label: "Half Dome",      img: "ahwahnee2-t.jpg",  href: "https://yosemite.org/webcams/half-dome/",      alt: "Live view of Half Dome from Ahwahnee Meadow" },
  { label: "Yosemite Falls", img: "yosfalls-t.jpg",   href: "https://yosemite.org/webcams/yosemite-falls/", alt: "Live view of Upper Yosemite Falls" },
  { label: "El Capitan",     img: "turtleback-t.jpg", href: "https://yosemite.org/webcams/el-capitan/",     alt: "Live view of El Capitan from Turtleback Dome" },
  { label: "Wawona",         img: "wawona-t.jpg",     href: "https://yosemite.org/webcams/wawona/",         alt: "Live view of Wawona" },
];

function WebcamStrip() {
  // Bucket the cache-buster to five minutes instead of the exact millisecond.
  // Per-render Date.now() made every one of these four third-party images a
  // guaranteed cold fetch on every visit and every remount; the cameras
  // themselves refresh on the order of minutes, so a five-minute bucket is as
  // fresh in practice and lets the browser cache do its job in between.
  const camCacheBust = useMemo(() => Math.floor(Date.now() / 300000), []);
  return (
    <>
      <div className="cam-grid">
        {WEBCAMS.map(cam => (
          <a
            key={cam.img}
            className="cam-tile"
            href={cam.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <img
              src={`https://pixelcaster.com/yosemite/webcams/${cam.img}?t=${camCacheBust}`}
              alt={cam.alt}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => { const t = e.currentTarget.closest('.cam-tile'); if (t) t.style.display = 'none'; }}
              style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover", display: "block" }}
            />
            <div className="mono" style={{ marginTop: 10, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--ink-2)", fontWeight: 700 }}>
              {cam.label}
            </div>
          </a>
        ))}
      </div>
      <div className="mono" style={{ marginTop: 16, fontSize: 11, color: "var(--ink-3)", textAlign: "right" }}>
        Live image · <a href="https://yosemite.org/webcams/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>Yosemite Conservancy / Pixelcaster</a>
      </div>
    </>
  );
}

// ============================================================
// Field Guide promo band. The one reusable purchase ask for
// editorial pages: the homepage's inverted-ink plate (.band-guide
// styles), stacked single-column for 680px article columns, with
// copy tailored per page by the caller. Fires guide_cta_click with
// a per-placement location so each surface measures separately;
// the optional sample line points at the app's free preview and
// fires guide_sample_click, same as the /guide page's sample links.
// ============================================================
const GUIDE_PROMO_APP_BASE =
  (typeof window !== "undefined" && window.GUIDE_APP_BASE) ||
  "https://guide.thetalusfieldjournal.com";

function GuidePromo({ go, location, title, body, cta, sample = true, style }) {
  return (
    <div style={style}>
      <a
        className="band-guide"
        href="/guide"
        onClick={(e) => {
          e.preventDefault();
          if (window.track) window.track("guide_cta_click", { location: location || "unknown" });
          if (go) go("guide"); else window.location.href = "/guide";
        }}
      >
        <div className="band-guide__eyebrow">The Field Guide · $3.99 · Offline app</div>
        <div className="band-guide__title" style={{ marginBottom: 10 }}>
          {title || "The park, in your pocket."}
        </div>
        <p className="band-guide__body">
          {body || "The app version of this journal: 50-plus stops with parking and timing notes, offline maps, a trip planner, and the secret guide. Works with no signal, which is most of the park. One purchase, eighteen months of access."}
        </p>
        <div className="mono band-guide__cta">{cta || "See the Field Guide →"}</div>
      </a>
      {sample && (
        <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6, margin: "10px 0 0" }}>
          Not sure yet? Five entries are free to read, no email required:{" "}
          <a
            href={`${GUIDE_PROMO_APP_BASE}/preview`}
            onClick={() => { if (window.track) window.track("guide_sample_click", { location: location || "unknown" }); }}
            style={{ color: "var(--ink-2)" }}
          >preview the guide →</a>
        </p>
      )}
    </div>
  );
}

// Expose
Object.assign(window, {
  Placeholder, ResponsiveImage, preloadResponsive,
  SIZES_HERO, SIZES_BODY, SIZES_CARD,
  MotifMountains, MotifSun, MotifTrees,
  Header, Footer, ArticleCard, NewsletterInline, ExitIntentNewsletter, MapLightbox,
  EntranceWaits, WebcamStrip, GuidePromo,
});
