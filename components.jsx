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

// The three gates the NPS feed actually covers, in the order a reader meets
// them driving in from the west. Tioga Pass is deliberately absent: the feed
// publishes no wait for it, and a fourth card that could never fill would read
// as a broken sensor rather than as a gate nobody measures. The notes are
// standing facts about each road, not conditions, so they never go stale.
const GATE_BOARD = [
  {
    key: "Arch Rock Wait Time",
    name: "Arch Rock",
    road: "Hwy 140 · west",
    note: "The El Portal road, and the way most trips come in. First to back up.",
  },
  {
    key: "Big Oak Flat Wait Time",
    name: "Big Oak Flat",
    road: "Hwy 120 · west",
    note: "From Groveland and the north. Holds up better than 140 until mid-morning.",
  },
  {
    key: "South Entrance Wait Time",
    name: "South",
    road: "Hwy 41 · Fish Camp",
    note: "Oakhurst and the south end. Also the gate for Mariposa Grove.",
  },
];

const WAIT_TONE_LABEL = { good: "Short", moderate: "Moderate", long: "Long", nodata: "No reading" };

// Reduce the raw summary to the one figure a reader scanning the top of the
// page wants: the worst gate right now. Returns null when nothing is readable,
// so callers render nothing rather than a zero.
function longestWait(summary) {
  if (!Array.isArray(summary)) return null;
  let worst = null;
  summary.forEach((pair) => {
    if (!pair || pair.stale) return;
    const min = pair.current_wait_minutes;
    if (typeof min !== "number" || !isFinite(min)) return;
    if (!worst || min > worst.minutes) {
      worst = {
        name: WAITS_SHORT_NAMES[pair.pair_name]
          || String(pair.pair_name || "").replace(/\s*Wait Time$/i, "")
          || "Entrance",
        minutes: min,
        text: formatWaitMinutes(min),
        tone: waitClass(min),
      };
    }
  });
  return worst;
}

// The masthead's Park now panel draws the same feed as three rows, one per
// gate (EntranceWaits `variant="menu"`). `waits` is null while the feed is in
// flight, and the rows hold a bare dash; once it has answered, a gate with no
// fresh reading says so in the feed's own words, as the /conditions board
// does. Nothing here is a guess.
function GateReadout({ waits }) {
  const byKey = {};
  (waits || []).forEach((pair) => { if (pair && pair.pair_name) byKey[pair.pair_name] = pair; });
  return (
    <ul className="hp-gates">
      {GATE_BOARD.map((gate) => {
        const pair = byKey[gate.key];
        const raw = pair && !pair.stale ? pair.current_wait_minutes : null;
        const min = typeof raw === "number" && isFinite(raw) ? raw : null;
        const tone = waitClass(min);
        return (
          <li key={gate.key} className={`hp-gates__row hp-gates__row--${tone}`}>
            <span className="hp-gates__name">{gate.name}<small>{gate.road}</small></span>
            <span className="hp-gates__read">
              {min == null ? "—" : formatWaitMinutes(min)}
              <small>{waits ? WAIT_TONE_LABEL[tone] : "\u00a0"}</small>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// `variant="board"` is the /conditions treatment: one column block per gate
// with the wait set large. The default is the original inline strip, which
// /webcams still mounts. `onData` hands the page a digest so the reading can
// also appear in the page's live readout without a second fetch of the feed.
function EntranceWaits({ variant, onData }) {
  const [waits, setWaits] = useState(null);
  const onDataRef = useRef(onData);
  useEffect(() => { onDataRef.current = onData; });

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch(WAITS_URL, { headers: { Range: "bytes=0-8191" } })
        .then((r) => (r.ok ? r.text() : Promise.reject(new Error("HTTP " + r.status))))
        .then((text) => {
          const summary = parseWaitsSummary(text);
          if (!cancelled && Array.isArray(summary) && summary.length) {
            setWaits(summary);
            if (onDataRef.current) onDataRef.current({ summary, longest: longestWait(summary) });
          }
        })
        .catch(() => {});
    };
    load();
    const timer = setInterval(load, WAITS_REFRESH_MS);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  if (variant === "menu") return <GateReadout waits={waits} />;

  if (variant === "board") {
    const byKey = {};
    (waits || []).forEach((pair) => { if (pair && pair.pair_name) byKey[pair.pair_name] = pair; });
    return (
      <div className="gates" role="region" aria-label="Live entrance station waits">
        {GATE_BOARD.map((gate) => {
          const pair = byKey[gate.key];
          const min = pair && !pair.stale ? pair.current_wait_minutes : null;
          const tone = waitClass(min);
          return (
            <a
              key={gate.key}
              className={`gate gate--${tone}`}
              href={WAITS_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="gate__name">{gate.name}</span>
              <span className="gate__road">{gate.road}</span>
              <span className="gate__read">
                <span className="gate__num">{min == null ? "—" : Math.round(min)}</span>
                {min != null && <span className="gate__unit">min</span>}
                <span className="gate__tone">{WAIT_TONE_LABEL[tone]}</span>
              </span>
              <span className="gate__note">{gate.note}</span>
            </a>
          );
        })}
      </div>
    );
  }

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
// Live parking-lot status (FEATURE-RESEARCH-2026-09.md, feature 3).
// Reads the API Worker's /api/parking, a proxy of the NPS API's
// `parkinglots` feed for Yosemite, under the same posture as the
// entrance waits: never an error, nothing rendered when the feed is
// silent, and nothing rendered past 60 minutes of staleness, because a
// stale "open" is worse than no reading. Every rendered cell carries
// its source and age ("NPS, 14 min ago"). Two pages mount it,
// /conditions and /now; the PWA carries its own cell.
// ============================================================
const PARKING_URL = "https://api.thetalusfieldjournal.com/api/parking";
const PARKING_REFRESH_MS = 5 * 60 * 1000;
const PARKING_STALE_MS = 60 * 60 * 1000;
const PARKING_STATUS_LABEL = { open: "Open", full: "Full", closed: "Closed" };

// `variant="board"` is the /conditions treatment: the same rows, ruled and
// scaled up for a page column rather than a card. `onData` hands the page a
// digest (how many lots are open, and the reading's age) so the live readout
// at the top can quote it without fetching the feed a second time. Both are
// opt-in, so /now keeps exactly the markup it has today. Note there is no
// fill meter in either variant: the feed carries a lot's free spaces but not
// its total, so a bar would be drawing a ratio the data does not contain.
function ParkingNow({ variant, onData }) {
  const [data, setData] = useState(null);
  const onDataRef = useRef(onData);
  useEffect(() => { onDataRef.current = onData; });

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch(PARKING_URL)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
        .then((body) => { if (!cancelled && body && Array.isArray(body.lots)) setData(body); })
        .catch(() => {});
    };
    load();
    const timer = setInterval(load, PARKING_REFRESH_MS);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  const fetched = data && data.fetchedAt ? Date.parse(data.fetchedAt) : NaN;
  const fresh = isFinite(fetched) && Date.now() - fetched <= PARKING_STALE_MS;
  const lots = fresh ? data.lots.filter((l) => l && PARKING_STATUS_LABEL[l.status]) : [];

  // Report upward on every render that changes the digest, not inside the
  // fetch, so the 60-minute staleness cutoff governs the readout too. The
  // dependency is a normalized number: `fetched` is NaN while the feed is
  // silent, and NaN never equals itself, so it would re-fire on every render.
  const openCount = lots.filter((l) => l.status === "open").length;
  const lotCount = lots.length;
  const fetchedKey = isFinite(fetched) ? fetched : 0;
  useEffect(() => {
    if (!onDataRef.current) return;
    onDataRef.current(lotCount ? { open: openCount, total: lotCount, fetchedAt: fetchedKey } : null);
  }, [lotCount, openCount, fetchedKey]);

  if (!lots.length) return null;
  const ageMin = Math.max(0, Math.round((Date.now() - fetched) / 60000));
  const age = ageMin === 0 ? "just now" : ageMin + " min ago";

  if (variant === "board") {
    return (
      <div className="lots" role="region" aria-label="Live parking lot status">
        <ul className="lots__list">
          {lots.map((l) => (
            <li key={l.id || l.name} className={`lots__row lots__row--${l.status}`}>
              <span className="lots__name">{l.name}</span>
              <span className="lots__read">
                <span className="lots__status">{PARKING_STATUS_LABEL[l.status]}</span>
                {typeof l.capacity === "number" && <span className="lots__cap">{l.capacity} spaces free</span>}
              </span>
            </li>
          ))}
        </ul>
        <p className="lots__meta">National Park Service, {age}. Text <em>ynptraffic</em> to 333111 for the park's own updates before you lose signal.</p>
      </div>
    );
  }

  return (
    <div className="parking-now" role="region" aria-label="Live parking lot status">
      <ul className="parking-now__list">
        {lots.map((l) => (
          <li key={l.id || l.name} className={`parking-now__row parking-now__row--${l.status}`}>
            <span className="parking-now__name">{l.name}</span>
            <span className="parking-now__status">{PARKING_STATUS_LABEL[l.status]}</span>
            {typeof l.capacity === "number" && <span className="parking-now__cap">{l.capacity} spaces</span>}
          </li>
        ))}
      </ul>
      <p className="parking-now__meta">NPS, {age} · text <em>ynptraffic</em> to 333111 before you lose signal</p>
    </div>
  );
}
window.ParkingNow = ParkingNow;

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
// Masthead menus
// ============================================================
// NAV_GROUPS is the site's map of primary destinations, and its four words
// (Plan a trip, Park now, Map, Read) are the site's one navigation
// vocabulary: HomeMasthead draws them in that order on every route, the
// footer heads its columns with them, and /explore sections itself by them.
// Three groups are menus (Plan a trip, Park now, Read), Map is a plain link,
// and the Field Guide is the masthead's button. The secondary destinations
// (About, Contact, Directory, the business pages) live in the footer and on
// /explore.
//
// Shape: a group is { key, label, route, cta, blurb, aside, feature, columns }
// where each column is { heading, links } and a link is { key } for an SPA
// route or { href } for a real navigation (the generated /archive pages are
// not SPA routes, so they must never carry a go() handler). A link may add a
// `hash`, the id of a section on its page, which the masthead scrolls to once
// the route has drawn, and `onHome`, the id of the homepage section that
// answers it, which the link jumps to instead when the reader is on "/" (the
// Sunday Letter and Start here are sections of the homepage itself). `route` is the group's landing page, the first link in
// its panel; the label itself opens the panel rather than navigating. `aside`
// is a small block under the panel's lede, and `feature` names the panel's
// third track (NavMapFeature, NavWaitsFeature, NavNewestFeature below). A
// group with no `columns` renders as a plain link.
//
// Two rules for the copy: keep a `note` to one short line, and keep years
// out of all of it. The masthead is baked into index.html's static home shell
// by scripts/gen-home-shell.mjs, which rejects anything date-derived because
// that file is cached hard. For the same reason nothing in this table may be
// computed from the catalog (the generator renders with an empty
// window.ARTICLES, so a live count would bake as zero and then shift on
// boot). The Read panel's Newest column is the one thing the masthead reads
// from the catalog, at render: the shell bakes it empty, which is safe only
// because every panel is closed at first paint.
const NAV_GROUPS = [
  {
    key: "plan",
    label: "Plan a trip",
    route: "planning",
    cta: "The Planning Guide →",
    blurb: "The trip, in the order the decisions actually come at you.",
    aside: {
      eyebrow: "Trip selector",
      title: "Five questions, one plan.",
      text: "When, how long, where you sleep, who is coming, and what matters most.",
      link: { key: "planning", hash: "trip-selector", label: "Start the selector" },
    },
    feature: "map",
    columns: [
      {
        heading: "Decide",
        links: [
          { key: "start-here", onHome: "home-start-here", label: "Start here", note: "Your first trip, the questions in order" },
          { key: "planning", label: "The Planning Guide", note: "The whole archive, in trip order" },
          { key: "itineraries", label: "Itineraries", note: "Half-day to three-day plans, in drive order" },
          { key: "consult", label: "Trip consults", note: "Thirty minutes, one on one. Paid" },
        ],
      },
      {
        heading: "Book and get there",
        links: [
          { key: "stay", label: "Where to stay", note: "In-park lodging and the gateway towns" },
          { key: "distances", label: "Drive times", note: "How far the Valley is from every gateway town" },
          { key: "international", label: "Visiting from abroad", note: "The non-resident entrance fee, and the cheapest way in" },
          { key: "checklist", label: "First-week checklist", note: "What to do in the week before you go" },
          { key: "kit", label: "Kit", note: "What earns its place in the pack" },
        ],
      },
    ],
  },
  {
    // Everything that answers "what is it like in there right now, and what
    // is coming": the live pages, and the dated decisions people plan around.
    key: "now",
    label: "Park now",
    route: "now",
    cta: "The Park Bulletin →",
    blurb: "What is open, what is on, and what the gates look like.",
    aside: {
      eyebrow: "Road alerts",
      title: "One email when a road changes.",
      text: "Tioga Road, Glacier Point Road, and the highways in, sent when an opening or a closure is confirmed.",
      link: { key: "conditions", hash: "road-alerts", label: "Get road alerts" },
    },
    feature: "waits",
    columns: [
      {
        heading: "Today",
        links: [
          { key: "now", label: "The Park Bulletin", note: "What is happening in the park right now" },
          { key: "conditions", label: "Conditions", note: "Gates, lots, roads, and who to call" },
          { key: "webcams", label: "Webcams", note: "The live views, and how to read them" },
        ],
      },
      {
        heading: "The calendar",
        links: [
          { key: "dates", label: "Dates that matter", note: "Lotteries, release mornings, road windows, as calendar files" },
          { key: "tioga-opening", label: "Tioga Road opening", note: "When the high country actually opens" },
          { key: "firefall", label: "Firefall", note: "Whether to plan a trip around Horsetail Fall" },
          { key: "half-dome-lottery", label: "Half Dome lottery", note: "The permit odds, plainly" },
        ],
      },
    ],
  },
  { key: "map", label: "Map", route: "map" },
  {
    // Keeps the key "read": navGroupOf and the footer lean on it.
    key: "read",
    label: "Read",
    route: "articles",
    cta: "All articles →",
    blurb: "The journal itself: everything published, by section.",
    feature: "newest",
    columns: [
      {
        heading: "Sections",
        links: [
          { key: "cat:planning", label: "Planning", note: "Permits, timing, transit, lodging" },
          { key: "cat:trails", label: "Trails and hikes", note: "Routes and conditions, kept current" },
          { key: "cat:wildlife", label: "Wildlife and nature", note: "What is moving and what is blooming" },
          { key: "cat:seasonal", label: "Seasonal guides", note: "The park, month by month" },
        ],
      },
      {
        heading: "From the archive",
        links: [
          { href: "/archive/", label: "Nature Notes archive", note: "512 issues of the park's own bulletin" },
          { key: "films", label: "Films", note: "The NPS Nature Notes film series, annotated" },
          { key: "newsletter", onHome: "home-newsletter", label: "The Sunday Letter", note: "One short letter a week. Free" },
          { key: "explore", label: "Everything on this site", note: "Every page, with a line on each" },
        ],
      },
    ],
  },
  { key: "guide", label: "Field Guide", route: "guide" },
];

window.NAV_GROUPS = NAV_GROUPS;

// Links on the design-system pages (the homepage and the pages rebuilt on it)
// keep native modified-click behavior and use the existing SPA router for plain
// clicks. Section links retain meaningful no-JavaScript hrefs. An external,
// tel: or /archive/ href is a real navigation: it is left to the browser, and
// outbound clicks are measured by app.jsx's delegated listener.
function HomeLink({ go, href, location, children, ...props }) {
  return <a {...props} href={href} onClick={(event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (/^(https?:|tel:|mailto:|\/archive\/)/.test(href)) return;
    if (window.track) window.track(href === "/guide" ? "guide_cta_click" : "cta_click", { location, target: href });
    if (href.startsWith("#")) {
      const section = document.getElementById(href.slice(1));
      if (!section) return;
      event.preventDefault();
      section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      section.focus({ preventScroll: true });
      return;
    }
    event.preventDefault();
    go(href.startsWith("/articles/") ? `a:${href.slice(10)}`
      : href.startsWith("/section/") ? `cat:${href.slice(9)}`
      : (href.slice(1) || "home"));
  }}>{children}</a>;
}

// ============================================================
// THE DESIGN SYSTEM. The September 2026 homepage introduced it and the design
// rollout took it to every route: Header draws HomeMasthead everywhere, app.jsx
// renders every page inside a `<main class="hp-design">` root, and the pages
// are built from the components below, whose styles live in the design block
// of styles.css.
// ============================================================

// The masthead's links, in the order a visit runs: plan it, check the park,
// find it on the map, read. Three are menus built from NAV_GROUPS (the panel
// is the group's lede, its `columns` and its `feature`); Map is a plain link.
// The same words head the footer's columns and /explore's sections.
const HOME_NAV = [
  { label: "Plan a trip", group: "plan" },
  { label: "Park now", group: "now" },
  { href: "/map", label: "Map" },
  { label: "Read", group: "read" },
];

// A panel's landing link reads like the homepage's other text links, which
// end in ↗ rather than →.
const homeMenuCta = (cta) => `${(cta || "Open the section").replace(/\s*→\s*$/, "")} ↗`;

// The menu group holding the page the reader is on, so its trigger can say
// so. app.jsx passes "articles" for every article and section route.
function navGroupOf(current) {
  if (!current || current === "home") return null;
  const g = NAV_GROUPS.find((group) => group.columns && (group.route === current
    || group.columns.some((col) => col.links.some((l) => l.key === current))));
  return g ? g.key : null;
}

// The Plan a trip panel's third track: the trip map, the tool most planning
// pages end in. The drawing is a schematic of a route between pins, not a
// map of anywhere.
function NavMapFeature({ link }) {
  const pins = [[30, 78], [74, 58], [120, 68], [164, 36], [206, 48]];
  return (
    <div className="hp-navfeat hp-navfeat--map">
      <p className="hp-menu__heading">The trip map</p>
      <svg className="hp-navfeat__art" viewBox="0 0 236 104" aria-hidden="true" focusable="false">
        <path className="hp-navfeat__contour" d="M-6 80 C 30 64, 58 88, 96 70 S 170 30, 246 44" />
        <path className="hp-navfeat__contour" d="M-6 54 C 26 40, 64 60, 104 44 S 176 12, 246 22" />
        <path className="hp-navfeat__contour" d="M-6 100 C 40 88, 80 106, 128 92 S 196 66, 246 74" />
        <path className="hp-navfeat__route" d="M30 78 L 74 58 L 120 68 L 164 36 L 206 48" />
        {pins.map(([x, y]) => <circle key={x} className="hp-navfeat__pin" cx={x} cy={y} r="5" />)}
      </svg>
      <p className="hp-navfeat__text">Every pin in the park, assembled into a route you can share or open in the Field Guide.</p>
      {link({ key: "map", label: "Open the map ↗" }, "hp-link")}
    </div>
  );
}

// The Park now panel's third track: the entrance waits, read from the Park
// Service's feed. `live` mounts the feed the first time the panel opens, so a
// page view that never opens the menu never fetches it; until then (and in
// the static shell) the rows hold dashes.
function NavWaitsFeature({ live, link }) {
  return (
    <div className="hp-navfeat hp-navfeat--waits">
      <p className="hp-menu__heading">Entrance waits, live</p>
      {live ? <EntranceWaits variant="menu" /> : <GateReadout waits={null} />}
      <p className="hp-navfeat__text">Read from the Park Service's own feed. A dash means no current reading.</p>
      {link({ key: "conditions", hash: "cond-waits", label: "Gates and lots on Conditions ↗" }, "hp-link")}
    </div>
  );
}

// The Read panel's third track: the three newest entries. The only part of
// the masthead read from the catalog; the static shell renders it empty.
function NavNewestFeature({ link }) {
  const newest = (window.ARTICLES || [])
    .slice()
    .sort((a, b) => String(b.isoDate || "").localeCompare(String(a.isoDate || "")))
    .slice(0, 3);
  if (!newest.length) return null;
  return (
    <div className="hp-menu__col hp-menu__col--newest">
      <p className="hp-menu__heading">Newest</p>
      {newest.map((a) => {
        const cat = window.findCategory ? window.findCategory(a.cat) : null;
        const note = [cat && cat.label, a.read].filter(Boolean).join(" · ");
        return link({ key: `a:${a.slug}`, label: a.title, note }, "hp-menu__link");
      })}
    </div>
  );
}

// What the search box offers before anything is typed: the four pages most
// visits are after, so the box is a way in even for a reader with no query.
const SEARCH_JUMPS = [
  { key: "now", title: "The Park Bulletin", kind: "Park now" },
  { key: "conditions", title: "Conditions", kind: "Park now" },
  { key: "map", title: "The trip map", kind: "Map" },
  { key: "stay", title: "Where to stay", kind: "Plan a trip" },
];

// The masthead's search box. Results come from window.searchCatalog, the
// matcher /search and the 404 page use, which lives in the search bundle: it
// is loaded the first time the box takes focus, never at boot. Enter on a
// highlighted result opens it; Enter otherwise, or the last row, hands the
// query to /search. Below 1000px the box gives way to the nav's Search link.
function MastheadSearch({ go, location }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [ready, setReady] = useState(false);
  const inputRef = useRef(null);
  const q = query.trim();

  const load = () => {
    if (typeof window.searchCatalog === "function") { setReady(true); return; }
    if (typeof window.ensureRoute !== "function") return;
    window.ensureRoute("search")
      .then(() => setReady(typeof window.searchCatalog === "function"))
      .catch(() => {});
  };

  const results = useMemo(() => {
    if (!q) return SEARCH_JUMPS;
    if (!ready || typeof window.searchCatalog !== "function") return [];
    // Exact words first; the nearest-word correction only when they find
    // nothing, so a typo still lands without widening a good query.
    const exact = window.searchCatalog(q, { limit: 6 });
    return exact.length ? exact : window.searchCatalog(q, { fuzzy: true, limit: 6 });
  }, [q, ready]);
  const options = q ? [...results, { all: true, key: "search" }] : results;

  const pathFor = (r) => (r.all
    ? `/search?q=${encodeURIComponent(q)}`
    : (r.path || (window.routeToPath ? window.routeToPath(r.key) : `/${r.key}`)));

  const reset = () => {
    setOpen(false);
    setActive(-1);
    setQuery("");
    if (inputRef.current) inputRef.current.blur();
  };

  // /search reads ?q= when it mounts, so the query goes on the URL before the
  // route commits (go() only pushes when the pathname changes). Already on
  // /search there is no mount to hang it on, so that case navigates for real.
  const toSearchPage = (text) => {
    const url = text ? `/search?q=${encodeURIComponent(text)}` : "/search";
    if (window.track) window.track("nav_search_submit", { location, has_query: text ? "1" : "0" });
    reset();
    if (window.location.pathname.replace(/\/+$/, "") === "/search") { window.location.assign(url); return; }
    window.history.pushState({ route: "search" }, "", url);
    go("search");
  };

  const pick = (r, i, e) => {
    if (r.all) { toSearchPage(q); return; }
    const path = pathFor(r);
    if (window.track) window.track("nav_search_pick", { location, target: path, rank: String(i + 1), has_query: q ? "1" : "0" });
    reset();
    if (r.path) { window.location.assign(r.path); return; }
    if (e) e.preventDefault();
    go(r.key);
  };

  const onKeyDown = (e) => {
    const n = options.length;
    if (e.key === "ArrowDown" && n) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % n);
    } else if (e.key === "ArrowUp" && n) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i <= 0 ? n - 1 : i - 1));
    } else if (e.key === "Escape") {
      if (open) { e.preventDefault(); setOpen(false); setActive(-1); } else if (inputRef.current) inputRef.current.blur();
    } else if (e.key === "Enter" && open && active >= 0 && options[active]) {
      e.preventDefault();
      pick(options[active], active);
    }
  };

  const showList = open && (options.length > 0 || q);
  const listId = "masthead-search-list";
  const optId = (i) => `masthead-search-opt-${i}`;
  return (
    <form
      className="hp-search"
      role="search"
      action="/search"
      method="get"
      onSubmit={(e) => { e.preventDefault(); toSearchPage(q); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { setOpen(false); setActive(-1); } }}
    >
      <label className="hp-search__field">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          id="masthead-search"
          type="search"
          name="q"
          value={query}
          placeholder="Search the journal"
          aria-label="Search the journal"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList ? "true" : "false"}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? optId(active) : undefined}
          onFocus={() => { setOpen(true); load(); }}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
          onKeyDown={onKeyDown}
        />
        <kbd aria-hidden="true">/</kbd>
      </label>
      {showList && (
        <div className="hp-search__list" id={listId} role="listbox" aria-label={q ? `Results for ${q}` : "Jump to"}>
          {!q && <p className="hp-search__head">Jump to</p>}
          {q && results.length === 0 && (
            <p className="hp-search__empty">
              {ready ? `Nothing in titles, sections or deks matches “${q}”. Search does not read article bodies.` : "Searching…"}
            </p>
          )}
          {options.map((r, i) => (
            <a
              key={r.all ? "all" : `${r.key || r.path}-${i}`}
              id={optId(i)}
              role="option"
              aria-selected={i === active}
              tabIndex={-1}
              href={pathFor(r)}
              className={["hp-search__opt", r.all && "hp-search__all", i === active && "is-active"].filter(Boolean).join(" ")}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={(e) => {
                if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                pick(r, i, e);
              }}
            >
              {r.all ? `All results for “${q}” ↗` : (
                <React.Fragment>
                  <span className="hp-search__kind">{r.kind}</span>
                  <span className="hp-search__title">{r.title}</span>
                </React.Fragment>
              )}
            </a>
          ))}
        </div>
      )}
    </form>
  );
}

// Routes that pin a bar of their own to the top of the window (/stay's
// booking bar). On them the compact bar behaves as it does on phones, showing
// on a scroll up only, and the page's bar drops beneath it while it shows.
const NAV_HEADROOM_ROUTES = new Set(["stay"]);

// The masthead on every route. A menu label is a button that opens its
// panel: a click, a tap, Enter or Space opens and pins it, a mouse resting on
// the label opens it too (hover belongs to pointerType "mouse" only, since a
// touch also fires pointerenter and would open a panel under the finger), and
// clicking a hover-opened label pins it rather than closing it. The panel's
// first link is the group's landing page. ArrowDown on a label moves into the
// panel; Escape, a press outside the nav, or taking a link closes it. Every
// panel is in the markup, hidden, from the static shell onward, so the menus'
// links are in the HTML a crawler reads for "/".
//
// The compact bar. Once the reader scrolls past the bottom of the masthead's
// own slot, the header leaves the flow for a fixed, one-row version of itself
// (.is-stuck), so the navigation, the search box and the app button are
// never a scroll to the top away. The slot keeps its height while the header
// is out of it, so nothing on the page moves. Above 760px the bar is
// "pinned": it shows for as long as the masthead is out of view. On phones,
// and on NAV_HEADROOM_ROUTES, it is "headroom": it shows on a scroll up and
// gets out of the way on a scroll down. An open panel or focus inside it
// keeps it shown. The state is classes on the block and two attributes on
// <html> (data-nav-mode, which sets the in-page jump offset, and
// data-nav-compact, which lowers the reading bar and /stay's bar under it),
// never React state, so a scroll does not re-render the masthead. Off on
// /map, whose page is the map.
//
// On the homepage the static shell (scripts/gen-home-shell.mjs) bakes this
// render, so the render itself must stay free of browser state; everything
// that reads the window happens in effects and handlers.
function HomeMasthead({ go, current = "home", route }) {
  const home = current === "home";
  const location = home ? "home_navigation" : "site_navigation";
  const exact = route || current;
  const here = (r) => (current === r ? "page" : undefined);
  const inGroup = navGroupOf(current);
  const [open, setOpen] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [nowSeen, setNowSeen] = useState(false);
  const closeTimer = useRef(null);
  const blockRef = useRef(null);
  const headerRef = useRef(null);
  const navRef = useRef(null);

  const openMenu = (key, byHover) => {
    clearTimeout(closeTimer.current);
    setOpen(key);
    setPinned(!byHover);
    if (key === "now") setNowSeen(true);
  };
  const closeMenu = () => { clearTimeout(closeTimer.current); setOpen(null); setPinned(false); };
  const closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => { setOpen(null); setPinned(false); }, 400);
  };
  const fromMouse = (e) => e.pointerType === "mouse";
  const focusFirst = (panelId) => setTimeout(() => {
    const panel = document.getElementById(panelId);
    const first = panel && panel.querySelector("a[href]");
    if (first) first.focus();
  }, 0);

  // The compact bar's scroll handler lives outside React state, so it reads
  // the open menu and the closer through refs.
  const openRef = useRef(open);
  openRef.current = open;
  const closeRef = useRef(closeMenu);
  closeRef.current = closeMenu;

  React.useEffect(() => () => clearTimeout(closeTimer.current), []);
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      // Focus goes back to the label only if it was inside the menu, so
      // Escape on a panel opened by hovering does not move the reader's focus.
      const group = navRef.current && navRef.current.querySelector(`[data-menu="${open}"]`);
      if (group && group.contains(document.activeElement)) {
        const trigger = group.querySelector(".hp-menu__trigger");
        if (trigger) trigger.focus();
      }
      closeMenu();
    };
    const onDown = (e) => { if (navRef.current && !navRef.current.contains(e.target)) closeMenu(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  React.useEffect(() => {
    const block = blockRef.current;
    const header = headerRef.current;
    if (!block || !header || current === "map") return undefined;
    const root = document.documentElement;
    const phone = window.matchMedia("(max-width: 760px)");
    let stuck = false;
    let shown = false;
    let slotBottom = 0;
    let lastY = window.scrollY;
    let raf = 0;

    const headroom = () => phone.matches || NAV_HEADROOM_ROUTES.has(current);
    const setMode = () => root.setAttribute("data-nav-mode", headroom() ? "headroom" : "pinned");
    const measure = () => { slotBottom = block.offsetTop + block.offsetHeight; };
    const show = (next) => {
      if (next === shown) return;
      shown = next;
      block.classList.toggle("is-shown", next);
      if (next) root.setAttribute("data-nav-compact", "");
      else root.removeAttribute("data-nav-compact");
    };
    const stick = (next) => {
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
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const dy = y - lastY;
      if (Math.abs(dy) > 6) lastY = y;
      if (y <= slotBottom) { stick(false); return; }
      if (!stuck) {
        // Draw the bar off-screen first so it slides in rather than appearing.
        stick(true);
        raf = requestAnimationFrame(update);
        return;
      }
      if (!headroom() || openRef.current || header.contains(document.activeElement)) show(true);
      else if (dy < -6) show(true);
      else if (dy > 6) show(false);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    // A new width can change the masthead's height, and the slot can only be
    // measured with the header back in it.
    const remeasure = () => {
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
    const onFocusIn = () => { if (stuck) show(true); };

    setMode();
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
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

  // A link into a section of a page (road alerts on /conditions, the trip
  // selector on /planning). go() scrolls a new route to the top, so the jump
  // waits for the section to exist; on its own page it jumps at once.
  const follow = (key, hash) => {
    if (!hash) { go(key); return; }
    const jump = () => {
      const started = Date.now();
      const tick = () => {
        const el = document.getElementById(hash);
        if (el) {
          const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
          if (el.hasAttribute("tabindex")) el.focus({ preventScroll: true });
          return;
        }
        if (Date.now() - started < 4000) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (exact === key) { jump(); return; }
    go(key);
    jump();
  };

  // One renderer for every link inside a panel. A `key` is an SPA route and an
  // `href` is a real navigation (the generated archive pages), which never
  // calls go(); modified clicks keep the browser's own behaviour, as HomeLink's
  // do, and leave the panel open.
  const menuLink = (link, className) => {
    const { key, href, label, note } = link;
    // On "/" a link with `onHome` is a jump to that section of the homepage.
    const hash = home && link.onHome ? link.onHome : link.hash;
    const base = home && link.onHome ? "" : (href || (window.routeToPath ? window.routeToPath(key) : `/${key}`));
    const path = hash ? `${base}#${hash}` : base;
    return (
      <a
        key={`${key || href}${hash ? `#${hash}` : ""}`}
        className={className}
        href={path}
        aria-current={!href && !hash && key === exact ? "page" : undefined}
        onClick={(e) => {
          if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          if (window.track) window.track("cta_click", { location, target: path });
          closeMenu();
          if (href && !(home && link.onHome)) return;
          e.preventDefault();
          follow(home && link.onHome ? "home" : key, hash);
        }}
      >
        {note ? (
          <React.Fragment>
            <span className="hp-menu__label">{label}</span>
            <span className="hp-menu__note">{note}</span>
          </React.Fragment>
        ) : label}
      </a>
    );
  };

  // Where the reader is, for the compact bar: an article's section, or the
  // journal on a section page. Shown only in the bar, and only where it fits.
  const crumb = (() => {
    if (!route) return null;
    if (route.startsWith("a:")) {
      const a = (window.ARTICLES || []).find((x) => x.slug === route.slice(2));
      const cat = a && window.findCategory ? window.findCategory(a.cat) : null;
      return cat ? [{ key: "articles", label: "Read" }, { key: `cat:${cat.slug}`, label: cat.label }] : null;
    }
    if (route.startsWith("cat:")) return [{ key: "articles", label: "Read" }];
    return null;
  })();

  return (
    <div className="hp-design hp-navigation" ref={blockRef}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="hp-top">
        AN INDEPENDENT GUIDE TO YOSEMITE
        <span>Written here. Taken everywhere.</span>
      </div>
      <header className="hp-wrap hp-header" ref={headerRef}>
        <HomeLink go={go} location={location} className="hp-brand" href="/"
          onClickCapture={(e) => releaseRockfall(e.currentTarget.querySelector("img"))}>
          <img src="/img/talus-field-mark-masthead.png?v=2" width="214" height="168" alt="" />
          <span>The Talus Field<small>YOSEMITE, FROM THE INSIDE.</small></span>
        </HomeLink>
        {crumb && (
          <p className="hp-header__crumb">
            {crumb.map((c) => (
              <HomeLink key={c.key} go={go} location={location}
                href={window.routeToPath ? window.routeToPath(c.key) : `/${c.key}`}>{c.label}</HomeLink>
            ))}
          </p>
        )}
        <nav aria-label="Main navigation" ref={navRef}>
          {HOME_NAV.map((item) => {
            const g = item.group && NAV_GROUPS.find((group) => group.key === item.group);
            if (!g || !g.columns) {
              return <HomeLink key={item.href} go={go} location={location} href={item.href} aria-current={here(item.href.slice(1))}>{item.label}</HomeLink>;
            }
            const isOpen = open === g.key;
            const panelId = `hp-menu-${g.key}`;
            return (
              // position: static on the group (styles.css) hands the panel's
              // containing block to the header, so the panel spans the header's
              // full width rather than the width of one label.
              <div
                key={g.key}
                data-menu={g.key}
                className={["hp-menu", isOpen && "is-open", inGroup === g.key && "is-current"].filter(Boolean).join(" ")}
                onPointerEnter={(e) => { if (fromMouse(e)) openMenu(g.key, !(open && pinned)); }}
                onPointerLeave={(e) => { if (fromMouse(e) && !pinned) closeSoon(); }}
                onBlur={(e) => { if (isOpen && !e.currentTarget.contains(e.relatedTarget)) closeMenu(); }}
              >
                <button
                  type="button"
                  className="hp-menu__trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => (isOpen && pinned ? closeMenu() : openMenu(g.key, false))}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowDown") return;
                    e.preventDefault();
                    openMenu(g.key, false);
                    focusFirst(panelId);
                  }}
                >
                  <span>{item.label}</span>
                  <svg viewBox="0 0 10 6" width="9" height="6" aria-hidden="true" focusable="false">
                    <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="hp-menu__panel" id={panelId}>
                  <div className="hp-menu__card">
                    <div className="hp-menu__lede">
                      <p className="hp-eyebrow hp-menu__eyebrow">{g.label}</p>
                      {g.blurb && <p className="hp-menu__blurb">{g.blurb}</p>}
                      {menuLink({ key: g.route, label: homeMenuCta(g.cta) }, "hp-link")}
                      {g.aside && (
                        <div className="hp-menu__aside">
                          <p className="hp-menu__heading">{g.aside.eyebrow}</p>
                          <p className="hp-menu__aside-title">{g.aside.title}</p>
                          <p className="hp-menu__note">{g.aside.text}</p>
                          {menuLink({ ...g.aside.link, label: `${g.aside.link.label} ↗` }, "hp-link")}
                        </div>
                      )}
                    </div>
                    <div className="hp-menu__cols">
                      {g.columns.map((col) => (
                        <div key={col.heading} className="hp-menu__col">
                          <p className="hp-menu__heading">{col.heading}</p>
                          {col.links.map((link) => menuLink(link, "hp-menu__link"))}
                        </div>
                      ))}
                      {g.feature === "map" && <NavMapFeature link={menuLink} />}
                      {g.feature === "waits" && <NavWaitsFeature live={nowSeen} link={menuLink} />}
                      {g.feature === "newest" && <NavNewestFeature link={menuLink} />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Search as a link, for widths where the box below gives way. */}
          <HomeLink go={go} location={location} className="hp-nav__search" href="/search" aria-current={here("search")}>
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Search</span>
          </HomeLink>
        </nav>
        <MastheadSearch go={go} location={location} />
        <HomeLink go={go} location={location} className="hp-button" href={home ? "#field-guide" : "/guide"} aria-current={here("guide")}>Get the app ↗</HomeLink>
      </header>
    </div>
  );
}

// Section heading: eyebrow, h2, and an optional link set against the right edge.
function HpHeading({ go, location, eyebrow, title, link, id }) {
  return (
    <div className="hp-heading">
      <div>
        {eyebrow && <p className="hp-eyebrow">{eyebrow}</p>}
        <h2 id={id}>{title}</h2>
      </div>
      {link && (
        <HomeLink go={go} location={location} className="hp-link" href={link.href}
          {...(/^https?:/.test(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{link.label}</HomeLink>
      )}
    </div>
  );
}

// A photo row: thumbnail, eyebrow, h3, one line, and a call to action.
function HpRow({ go, location, href, image, alt, eyebrow, title, text, cta, sizes }) {
  return (
    <HomeLink go={go} location={location} className="hp-row" href={href}>
      {image ? <ResponsiveImage image={image} alt={alt || ""} sizes={sizes || "(max-width: 760px) calc(100vw - 40px), 600px"} /> : <span className="hp-row__blank" aria-hidden="true" />}
      <div>
        <p className="hp-eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
        {text && <p>{text}</p>}
        {cta && <b>{cta} <span>↗</span>
        </b>}
      </div>
    </HomeLink>
  );
}

// A journal card: photo, eyebrow, h3, one line. `children` replaces the line.
function HpCard({ go, location, href, image, alt, eyebrow, title, text, sizes, children }) {
  return (
    <HomeLink go={go} location={location} href={href}>
      {image ? <ResponsiveImage image={image} alt={alt || ""} sizes={sizes || "(max-width: 760px) calc(100vw - 40px), 600px"} /> : <span className="hp-card__blank" aria-hidden="true" />}
      <p className="hp-eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      {children || <p>{text}</p>}
    </HomeLink>
  );
}

// An article from the catalog as a journal card. The data-driven twin of the
// homepage's hand-written cards, for pages that list the catalog.
function HpArticleCard({ article, go, location }) {
  const cat = window.findCategory ? window.findCategory(article.cat) : null;
  return (
    <HpCard go={go} location={location} href={`/articles/${article.slug}`} image={article.image}
      alt={article.placeholder || ""}
      eyebrow={<React.Fragment>{cat ? cat.label.toUpperCase() : ""}<span>{article.read ? article.read.toUpperCase() : ""}</span></React.Fragment>}
      title={article.title} text={<React.Fragment>{article.dek} ↗</React.Fragment>} sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 45vw, 420px" />
  );
}

// The page head for an interior design page: breadcrumbs, eyebrow, h1, intro,
// up to two actions and a byline on the left; an optional aside on the right.
// `children` follow the byline in the copy column (the article's author line
// and series band); `as` swaps the element (an article's head is a <header>).
function HpPageHead({ go, crumbs, eyebrow, title, intro, actions, byline, aside, className, as: Tag = "section", children }) {
  return (
    <Tag className={["hp-pagehead", "hp-wrap", aside ? "hp-pagehead--split" : null, className].filter(Boolean).join(" ")}>
      <div className="hp-pagehead__copy">
        {crumbs && <Breadcrumbs go={go} trail={crumbs} />}
        {eyebrow && <p className="hp-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {intro && <p className="hp-intro">{intro}</p>}
        {actions && <div className="hp-actions">{actions}</div>}
        {byline && <p className="hp-byline">{byline}</p>}
        {children}
      </div>
      {aside && <div className="hp-pagehead__aside">{aside}</div>}
    </Tag>
  );
}

// The three benefit lines the homepage prints for the Field Guide. Literal
// copy, like everything on the homepage: edit here when the guide changes.
const HP_GUIDE_POINTS = [
  { mark: "↳", title: "Find your next stop.", text: "44 stops, arranged in driving order." },
  { mark: "⌁", title: "Choose a hike that fits your day.", text: "57 day hikes with GPS tracks." },
  { mark: "◎", title: "Bring a little local knowledge.", text: "50 Secret Guide entries to look beyond the obvious." },
];

// The Field Guide band: the dark section with the two phone captures. One per
// page ("nothing is asked for twice"). `children` replaces the default buy
// link and terms (the /guide page puts its own checkout button there);
// `points={null}` drops the benefit lines; `sample` adds the free-preview line.
function HpGuideBand({ go, location, id, eyebrow = "THE TALUS FIELD GUIDE / THE OFFLINE APP", title, intro, points = HP_GUIDE_POINTS, heading = "h2", sample, children }) {
  const H = heading;
  return (
    <section className="hp-product" id={id} tabIndex={id ? -1 : undefined}>
      <div className="hp-wrap hp-product-grid">
        <div>
          <p className="hp-eyebrow">{eyebrow}</p>
          <H>{title}</H>
          <p className="hp-intro">{intro}</p>
          {points && <ul>
            {points.map((p) => (
              <li key={p.title}>
                <span>{p.mark}</span>
                <div>
                  <strong>{p.title}</strong>
                  <p>{p.text}</p>
                </div>
              </li>
            ))}
          </ul>}
          {children || <React.Fragment>
            <HomeLink go={go} location={location} className="hp-button hp-light" href="/guide">Get the Field Guide <span>$3.99 ↗</span>
            </HomeLink>
            <p className="hp-terms">One payment · 18 months of access · 30-day guarantee</p>
          </React.Fragment>}
          {sample && (
            <p className="hp-terms hp-sample">Not sure yet? Five entries are free to read, no email required:{" "}
              <a href={`${GUIDE_PROMO_APP_BASE}/preview`} onClick={() => { if (window.track) window.track("guide_sample_click", { location }); }}>preview the guide ↗</a>
            </p>
          )}
        </div>
        <div className="hp-screens">
          <div className="hp-orbit">
          </div>
          <div className="hp-phone hp-back">
            <img src="/img/guide/screens/hikes.v2.webp" alt="Field Guide hiking screen" width="640" height="1385" loading="lazy" decoding="async" />
          </div>
          <div className="hp-phone hp-front">
            <img src="/img/guide/screens/front-page.v4.webp" alt="Field Guide app with park information and daylight tools" width="640" height="1385" loading="lazy" decoding="async" />
          </div>
          <div className="hp-offline">✓ &nbsp; All set. Even off the grid.<small>YOUR GUIDE WORKS OFFLINE</small>
          </div>
          <p className="hp-screen-note">Actual screens from the Field Guide</p>
        </div>
      </div>
    </section>
  );
}

// The letter's postcard, on its own for a page that carries its own form
// (/newsletter). `paper` is the card's line, `stamp` the postmark's second line.
function HpPostcard({ paper, stamp = "THE SUNDAY LETTER" }) {
  return (
    <div className="hp-paper">
      <span className="hp-stamp">EL PORTAL, CA<br />{stamp}</span>
      <div>{paper || <React.Fragment>A field note<br />for your<br />
        <em>next adventure.</em>
      </React.Fragment>}</div>
      <small>From Yosemite, with perspective.</small>
    </div>
  );
}

// The letter: the postcard beside the Sunday Letter form. `heading` and
// `blurb` are NewsletterInline's (the heading is visually hidden, since the
// section's h2 stands in for it); `paper` is the postcard's line.
function HpLetter({ id, eyebrow, title, heading, blurb, location, tag, variant, cta = "Send me the letter ↗", terms = "Free to read. One letter a week. Unsubscribe whenever.", paper, stamp = "THE SUNDAY LETTER" }) {
  return (
    <section className="hp-letter hp-wrap hp-section" id={id} tabIndex={id ? -1 : undefined}>
      <HpPostcard paper={paper} stamp={stamp} />
      <div>
        <p className="hp-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <NewsletterInline heading={heading} blurb={blurb} location={location} tag={tag} variant={variant} cta={cta} modifier="hp-newsletter" inputLabel="Your email address" />
        {terms && <p className="hp-terms">{terms}</p>}
      </div>
    </section>
  );
}

// The masthead on every route is the homepage's (HomeMasthead above). The
// legacy masthead (mega dropdowns, hamburger with its query box, scroll-hide
// on phones) and the phone BottomNav retired with the September 2026 design
// rollout; Header stays as the name app.jsx and the shell generator render.
// `route` is the exact route key (an article's "a:<slug>" where `current`
// says "articles"), for the compact bar's crumb and the panels' current link.
function Header({ current, go, route }) {
  return <HomeMasthead go={go} current={current} route={route} />;
}

// ============================================================
// Back to top. Appears once the reader is two viewports down any scrolling
// page, and never on the map or the guide, whose bottom edges belong to the
// sheet and the buy bar. Visibility is a class written through a ref from a
// rAF-throttled scroll listener (no React state, no re-render per scroll).
// The click honors prefers-reduced-motion and hands focus to <main>, so a
// keyboard reader lands where the page starts rather than on a button that
// has just faded out from under them.
// ============================================================
function BackToTop({ current }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (current === "map" || current === "guide") return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = ref.current;
      if (el) el.classList.toggle("is-visible", window.scrollY > window.innerHeight * 2);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [current]);
  if (current === "map" || current === "guide") return null;
  const toTop = () => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    const main = document.getElementById("main");
    if (main) main.focus({ preventScroll: true });
  };
  return (
    <button type="button" className="totop" ref={ref} onClick={toTop} aria-label="Back to top" title="Back to top">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 13V3" />
        <path d="M3.5 7.5 8 3l4.5 4.5" />
      </svg>
    </button>
  );
}

// ============================================================
// Site footer
// ============================================================
function Footer({ go }) {
  // The full map of the site. The columns carry the masthead's words (Plan a
  // trip, Park now, Read) plus the journal's own pages, so a reader who
  // learned where something lives in the menus finds it under the same
  // heading here. The secondary destinations (films, the archive, the
  // business pages) stay reachable here and on /explore.
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
            <h4>Plan a trip</h4>
            <ul>
              {link("start-here", "Start here")}
              {link("planning", "The Planning Guide")}
              {link("map", "The trip map")}
              {link("itineraries", "Itineraries")}
              {link("stay", "Where to stay")}
              {link("distances", "Drive times")}
              {link("international", "Visiting from abroad")}
              {link("checklist", "First-week checklist")}
              {link("kit", "Kit")}
              {link("guide", "The Field Guide")}
            </ul>
          </div>
          <div>
            <h4>Park now</h4>
            <ul>
              {link("now", "The Park Bulletin")}
              {link("conditions", "Conditions")}
              {link("webcams", "Webcams")}
              {link("dates", "Dates that matter")}
            </ul>
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
              {link("films", "Films")}
              {/*
                /archive is generated static HTML (scripts/gen-archive.mjs), not an
                SPA route, so this link must be a real navigation — no go() handler.
              */}
              <li><a href="/archive/">Nature Notes archive</a></li>
            </ul>
          </div>
          {/* Reader destinations only. The business and legal pages moved to
              the legal bar below: sitewide footer links are the site's most
              plentiful internal links, and /advertise, /widget, /partners,
              /privacy and /terms were each collecting 31 to 65 of them, more
              than any article except the gateway hub. They stay reachable
              (nothing is dropped, and /explore lists them too) but
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
  dates: { links: [
    { key: "half-dome-lottery", label: "The Half Dome lottery", note: "The mechanics, the odds, what to climb instead" },
    { key: "tioga-opening", label: "Tioga Road opening", note: "The window, watched from inside the park" },
    { key: "planning", label: "The Planning Guide", note: "Five answers in, a plan out" },
    { key: "guide", label: "The Field Guide", note: "These dates on your trip board, with reminders" },
  ] },
  international: { links: [
    { key: "start-here", label: "Start here", note: "The first-trip questions, answered plainly" },
    { key: "distances", label: "Drive times", note: "How far the Valley is from every gateway town" },
    { key: "stay", label: "Where to stay", note: "In-park beds and the gateway towns, compared" },
    { key: "dates", label: "Dates that matter", note: "Lotteries and release mornings, measured against your trip" },
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
    <div className="share-row">
      <span>Worth sending to your trip partner?</span>
      <button type="button" className="share-row__btn" onClick={share}>{copied ? "Link copied" : "Share this article"}</button>
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
function NewsletterInline({ heading, blurb, location, tag, incentive, abTest, variant: variantProp, cta, modifier, inputLabel }) {
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
      {inputLabel && !done && <label htmlFor={`${location}-email`}>{inputLabel}</label>}
      {done ? (
        <p className="nlbox__done">
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
          <input id={inputLabel ? `${location}-email` : undefined} type="email" name="email" aria-label={inputLabel || "Email address"} autoComplete="email" placeholder="you@email.com" required />
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

// `variant="board"` is the /conditions treatment: two large tiles per row with
// the caption on a rule under each, and a standing LIVE mark over the frame.
// The mark carries no timestamp on purpose. Nothing here reads the capture
// time off the camera, and a clock drawn from the reader's own device would be
// asserting a freshness this component has not checked. Default is the four-up
// strip, which /webcams and /firefall still mount.
function WebcamStrip({ variant }) {
  // Bucket the cache-buster to five minutes instead of the exact millisecond.
  // Per-render Date.now() made every one of these four third-party images a
  // guaranteed cold fetch on every visit and every remount; the cameras
  // themselves refresh on the order of minutes, so a five-minute bucket is as
  // fresh in practice and lets the browser cache do its job in between.
  const camCacheBust = useMemo(() => Math.floor(Date.now() / 300000), []);
  const board = variant === "board";
  return (
    <>
      <div className={board ? "cam-grid cam-grid--board" : "cam-grid"}>
        {WEBCAMS.map(cam => (
          <a
            key={cam.img}
            className="cam-tile"
            href={cam.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <span className={board ? "cam-tile__frame" : undefined}>
              <img
                src={`https://pixelcaster.com/yosemite/webcams/${cam.img}?t=${camCacheBust}`}
                alt={cam.alt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => { const t = e.currentTarget.closest('.cam-tile'); if (t) t.style.display = 'none'; }}
                style={{ width: "100%", aspectRatio: board ? "5 / 3" : "3 / 2", objectFit: "cover", display: "block" }}
              />
              {board && <span className="cam-tile__live"><span className="cam-tile__dot" aria-hidden="true" />Live</span>}
            </span>
            {board ? (
              <span className="cam-tile__cap">
                <span className="cam-tile__label">{cam.label}</span>
                <span className="cam-tile__open">Open camera ↗</span>
              </span>
            ) : (
              <div className="mono" style={{ marginTop: 10, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--ink-2)", fontWeight: 700 }}>
                {cam.label}
              </div>
            )}
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
        <p className="band-guide__sample">
          Not sure yet? Five entries are free to read, no email required:{" "}
          <a
            href={`${GUIDE_PROMO_APP_BASE}/preview`}
            onClick={() => { if (window.track) window.track("guide_sample_click", { location: location || "unknown" }); }}
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
  Header, Footer, BackToTop, NewsletterInline, ExitIntentNewsletter, MapLightbox,
  EntranceWaits, WebcamStrip, GuidePromo,
  HomeLink, HomeMasthead, HpHeading, HpRow, HpCard, HpArticleCard, HpPageHead, HpGuideBand, HpLetter, HpPostcard,
});
