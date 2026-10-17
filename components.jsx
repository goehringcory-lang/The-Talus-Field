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
// NAV_GROUPS is the site's map of primary destinations, and its six labels
// (Plan, Hikes & permits, Conditions, Seasons, Map, Library) are the site's
// one navigation vocabulary: HomeMasthead draws them in that order on every
// route, the phone Menu sheet lists them in the same order, the footer heads
// its columns with them, and /explore sections itself by them. Five groups
// are menus; Map is a plain link. Subscribe (the Sunday Letter) and the Field
// Guide link sit to the right of the labels. The secondary destinations
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
// Sunday Letter is a section of the homepage itself). Start here deliberately
// carries no `onHome`: it always opens the /start-here page, even from "/",
// where the homepage's own "Plan your first visit" button is the in-page jump.
// `route` is the group's landing page: the panel's first link (its `cta`)
// and the phone sheet's "More" link, so no column repeats it, and no link
// appears twice in one group. The label itself opens the panel rather than
// navigating. `aside` is a small block under the panel's lede, and `feature`
// names the panel's third track (NavWaitsFeature, NavNewestFeature below).
// `quick: true` marks the three or four links the phone Menu sheet lists
// under the group's label. A group with no `columns` renders as a plain link.
// A link with `aff` instead of a key is an affiliate link out of the site
// (the bookshelf on Bookshop.org): the masthead mints it from that network's
// registry entry in affiliate.js with the full affiliate markup, and its
// `note` carries the disclosure, since a menu has no page head to put one in.
//
// Two rules for the copy: keep a `note` to one short line, and keep years
// out of all of it. The masthead is baked into index.html's static home shell
// by scripts/gen-home-shell.mjs, which rejects anything date-derived because
// that file is cached hard. For the same reason nothing in this table may be
// computed from the catalog (the generator renders with an empty
// window.ARTICLES, so a live count would bake as zero and then shift on
// boot). The Library panel's Newest column is the one thing the masthead
// reads from the catalog, at render: the shell bakes it empty, which is safe
// only because every panel is closed at first paint.
const NAV_GROUPS = [
  {
    key: "plan",
    label: "Plan",
    route: "planning",
    cta: "The Planning Guide →",
    blurb: "The trip, in the order the decisions actually come at you.",
    aside: {
      eyebrow: "Trip selector",
      title: "Five questions, one plan.",
      text: "When, how long, where you sleep, who is coming, and what matters most.",
      link: { key: "planning", hash: "trip-selector", label: "Start the selector" },
    },
    columns: [
      {
        heading: "Decide",
        links: [
          { key: "start-here", label: "Start here", note: "Your first trip, the questions in order", quick: true },
          { key: "itineraries", label: "Itineraries", note: "Half-day to three-day plans, in drive order", quick: true },
          { key: "checklist", label: "First-week checklist", note: "What to do in the week before you go" },
          { key: "kit", label: "Kit", note: "What earns its place in the pack" },
          { key: "consult", label: "Trip consults", note: "Thirty minutes, one on one. Paid" },
        ],
      },
      {
        heading: "Stay and eat",
        links: [
          { key: "stay", label: "Where to stay", note: "In-park lodging and the gateway towns", quick: true },
          { key: "a:yosemite-camping-complete-guide", label: "Camping", note: "All thirteen campgrounds, and how to get a site" },
          { key: "a:where-to-eat-yosemite", label: "Where to eat", note: "Restaurants, groceries and picnic spots, by area" },
        ],
      },
      {
        heading: "Getting here",
        links: [
          { key: "distances", label: "Drive times", note: "How far the Valley is from every gateway town" },
          { key: "a:best-airport-for-yosemite", label: "Flying in", note: "Which airport, and the drive or bus from it" },
          { key: "international", label: "Visiting from abroad", note: "The non-resident entrance fee, and the cheapest way in" },
        ],
      },
    ],
  },
  {
    key: "hikes",
    label: "Hikes & permits",
    route: "cat:trails",
    cta: "All trails and hikes →",
    blurb: "The day hikes worth the drive, and the permit that decides the big one.",
    columns: [
      {
        heading: "Permits",
        links: [
          { key: "half-dome-lottery", label: "Half Dome lottery", note: "The permit odds, plainly", quick: true },
        ],
      },
      {
        heading: "Day hikes",
        links: [
          { key: "a:mist-trail-the-real-guide", label: "Mist Trail", note: "Vernal and Nevada Falls, and where to turn around", quick: true },
          { key: "a:cathedral-lakes-day-hike", label: "Cathedral Lakes", note: "The high-country day out of Tuolumne", quick: true },
          { key: "a:yosemite-falls-trail", label: "Yosemite Falls Trail", note: "Columbia Rock, the top, and the loop below" },
          { key: "a:clouds-rest-hike", label: "Clouds Rest", note: "Higher than Half Dome, and no lottery" },
        ],
      },
      {
        heading: "Gear",
        links: [
          { key: "kit", label: "Kit", note: "The day pack, the overnight pack, the car kit" },
        ],
      },
    ],
  },
  {
    // What it is like in there right now: the live pages only. The dated
    // decisions people plan around are under Seasons.
    key: "conditions",
    label: "Conditions",
    route: "conditions",
    cta: "Conditions and road alerts →",
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
          { key: "now", label: "The Park Bulletin", note: "What is happening in the park right now", quick: true },
          { key: "webcams", label: "Webcams", note: "The live views, and how to read them", quick: true },
          { key: "tioga-opening", label: "Tioga Road opening", note: "When the high country actually opens", quick: true },
        ],
      },
    ],
  },
  {
    key: "seasons",
    label: "Seasons",
    route: "cat:seasonal",
    cta: "Seasonal guides →",
    blurb: "The dates people plan a trip around, and the park month by month.",
    columns: [
      {
        heading: "The calendar",
        links: [
          { key: "dates", label: "Dates that matter", note: "Lotteries, release mornings, road windows, for your calendar", quick: true },
        ],
      },
      {
        heading: "The events",
        links: [
          { key: "fall-color", label: "Fall color", note: "When and where the leaves turn", quick: true },
          { key: "firefall", label: "Firefall", note: "Whether to plan a trip around Horsetail Fall", quick: true },
          { key: "moonbow", label: "Moonbow", note: "Rainbows by moonlight at Yosemite Falls" },
          { key: "frazil-ice", label: "Frazil ice", note: "The mornings the creek runs white" },
        ],
      },
    ],
  },
  { key: "map", label: "Map", route: "map" },
  {
    key: "library",
    label: "Library",
    route: "articles",
    cta: "All articles →",
    blurb: "The journal itself, everything published by section, and the park's own record.",
    aside: {
      eyebrow: "Search",
      title: "Looking for one thing?",
      text: "Titles, sections and summaries, as you type.",
      link: { key: "search", label: "Search the site" },
    },
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
        heading: "The record",
        links: [
          { href: "/archive/", label: "Nature Notes archive", note: "512 issues of the park's own bulletin", quick: true },
          { key: "films", label: "Films", note: "The NPS Nature Notes film series, annotated", quick: true },
          { key: "newsletter", onHome: "home-newsletter", label: "The Sunday Letter", note: "One short letter a week, and the past letters", quick: true },
          { aff: "bookshop", label: "Books ↗", note: "The bookshelf: the field guides I recommend, on Bookshop.org. Affiliate link" },
          { key: "explore", label: "Everything on this site", note: "Every page, with a line on each" },
        ],
      },
    ],
  },
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

// The masthead's labels, in the order a visit runs: plan it, pick the hikes,
// check the park, pick the season, find it on the map, read. Five are menus
// built from NAV_GROUPS (the panel is the group's lede, its `columns` and its
// `feature`); Map is a plain link. The same words, in the same order, head
// the phone Menu sheet's groups, the footer's columns and /explore's sections.
const HOME_NAV = [
  { label: "Plan", group: "plan" },
  { label: "Hikes & permits", group: "hikes" },
  { label: "Conditions", group: "conditions" },
  { label: "Seasons", group: "seasons" },
  { href: "/map", label: "Map" },
  { label: "Library", group: "library" },
];

// Where the masthead's Subscribe button goes: the homepage's own letter
// section on "/", the signup page everywhere else.
const SUBSCRIBE_HREF = { home: "#home-newsletter", other: "/newsletter" };

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

// The Conditions panel's third track: the entrance waits, read from the Park
// Service's feed. `live` mounts the feed the first time the panel opens, so a
// page view that never opens the menu never fetches it; until then (and in
// the static shell) the rows hold dashes.
function NavWaitsFeature({ live, link }) {
  return (
    <div className="hp-navfeat hp-navfeat--waits">
      <p className="hp-menu__heading">Entrance waits, live</p>
      {live ? <EntranceWaits variant="menu" /> : <GateReadout waits={null} />}
      <p className="hp-navfeat__text">Posted by the National Park Service. A dash means no wait is posted right now.</p>
      {link({ key: "conditions", hash: "cond-waits", label: "Gates and lots on Conditions ↗" }, "hp-link")}
    </div>
  );
}

// The Library panel's third track: the three newest entries. The only part
// of the masthead read from the catalog; the static shell renders it empty.
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
  { key: "now", title: "The Park Bulletin", kind: "Conditions" },
  { key: "conditions", title: "Conditions", kind: "Conditions" },
  { key: "map", title: "The trip map", kind: "Map" },
  { key: "stay", title: "Where to stay", kind: "Plan" },
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
      aria-label="Search the journal"
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
              {r.all ? `All results for “${q}” ↗` : (
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
// The phone Menu sheet (approved by Cory, October 2026). Below 880px the
// labels and their panels are not drawn; the row is the mark, Search,
// Subscribe and a Menu button, which opens NavSheet: a full-height dialog
// listing the six groups, each with its `quick` links and a "More" link to
// its landing page, then the Field Guide and the bookshelf. The button
// carries aria-expanded and aria-controls; the sheet is role="dialog"
// aria-modal="true" with a label, takes focus when it opens, keeps Tab
// inside itself, closes on Escape (focus back on the button), on taking a
// link and on growing past 880px, and locks the page's scroll while open.
// The sheet's element is always in the markup (empty and hidden while
// closed) so aria-controls always names something; it carries the dialog
// role only while open, because app.jsx's "/" shortcut stands down whenever
// a modal dialog is in the document.
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
  const [sheet, setSheet] = useState(false);
  const closeTimer = useRef(null);
  const blockRef = useRef(null);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const sheetRef = useRef(null);
  const menuButtonRef = useRef(null);

  const openMenu = (key, byHover) => {
    clearTimeout(closeTimer.current);
    setOpen(key);
    setPinned(!byHover);
    if (key === "conditions") setNowSeen(true);
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

  // The Menu sheet's dialog contract: focus in, Tab kept inside, Escape out
  // with focus back on the button, the page's scroll locked, and closed again
  // if the window grows past the phone layout.
  const closeSheet = (restore) => {
    setSheet(false);
    if (restore && menuButtonRef.current) menuButtonRef.current.focus();
  };
  React.useEffect(() => {
    if (!sheet) return undefined;
    const node = sheetRef.current;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const focusables = () => (node
      ? Array.from(node.querySelectorAll('a[href], button:not([disabled])')).filter((el) => el.offsetParent !== null || el === document.activeElement)
      : []);
    const first = focusables()[0];
    if (first) first.focus();
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); closeSheet(true); return; }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const head = items[0];
      const tail = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === head || !node.contains(document.activeElement))) {
        e.preventDefault();
        tail.focus();
      } else if (!e.shiftKey && (document.activeElement === tail || !node.contains(document.activeElement))) {
        e.preventDefault();
        head.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 880px)");
    const onWide = () => { if (wide.matches) closeSheet(false); };
    document.addEventListener("keydown", onKey);
    if (wide.addEventListener) wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (wide.removeEventListener) wide.removeEventListener("change", onWide);
      root.style.overflow = prevOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [sheet]);

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
  // do, and leave the panel open. The phone Menu sheet draws its links with
  // the same renderer and its own `where` (GA4 location, aff_list).
  const menuLink = (link, className, where) => {
    const { key, href, label, note } = link;
    const loc = where ? where.location : location;
    const done = () => { closeMenu(); setSheet(false); };
    // An affiliate link out of the site. Literal target and rel, which is
    // what check-affiliate-links.mjs reads; app.jsx's delegated listener
    // fires affiliate_click from the data attributes. The shell generator
    // loads affiliate.js, so the baked href is the real one.
    if (link.aff) {
      return (
        <a
          key={`aff:${link.aff}`}
          className={className}
          href={window.buildAffiliateLink ? window.buildAffiliateLink(link.aff) : "/kit"}
          target="_blank"
          rel="sponsored noopener"
          data-aff-network={link.aff}
          data-aff-list={where ? where.affList : "nav_menu"}
          data-aff-item-slug="bookshelf"
          data-aff-name="Naturalist's bookshelf"
          onClick={done}
        >
          <span className="hp-menu__label">{label}</span>
          <span className="hp-menu__note">{note}</span>
        </a>
      );
    }
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
          if (window.track) window.track(path === "/guide" ? "guide_cta_click" : "cta_click", { location: loc, target: path });
          done();
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
      return cat ? [{ key: "articles", label: "Library" }, { key: `cat:${cat.slug}`, label: cat.label }] : null;
    }
    if (route.startsWith("cat:")) return [{ key: "articles", label: "Library" }];
    return null;
  })();

  return (
    // The whole block is the banner landmark: the tagline strip used to sit
    // outside any landmark (axe "region") above an inner <header>.
    <div className="hp-design hp-navigation" ref={blockRef} role="banner">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="hp-top">
        AN INDEPENDENT GUIDE TO YOSEMITE
        <span>Written here. Taken everywhere.</span>
      </div>
      <div className="hp-wrap hp-header" ref={headerRef}>
        <HomeLink go={go} location={location} className="hp-brand" href="/"
          onClickCapture={(e) => releaseRockfall(e.currentTarget.querySelector("img"))}>
          <picture>
            <source type="image/webp" srcSet="/img/talus-field-mark-masthead.webp?v=1" />
            <img src="/img/talus-field-mark-masthead.png?v=2" width="214" height="168" alt="" />
          </picture>
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
                          {menuLink({ ...g.aside.link, label: `${g.aside.link.label} ↗` }, "hp-link")}
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
                      {g.feature === "waits" && <NavWaitsFeature live={nowSeen} link={menuLink} />}
                      {g.feature === "newest" && <NavNewestFeature link={menuLink} />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
        <MastheadSearch go={go} location={location} />
        {/* Search as a link, for widths where the box gives way (and the
            phone row, where it is one of the row's three controls). */}
        <HomeLink go={go} location={location} className="hp-nav__search" href="/search" aria-current={here("search")}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Search</span>
        </HomeLink>
        <HomeLink go={go} location={location} className="hp-header__guide" href={home ? "#field-guide" : "/guide"} aria-current={here("guide")}>Field Guide</HomeLink>
        <HomeLink go={go} location={location} className="hp-button hp-header__subscribe" href={home ? SUBSCRIBE_HREF.home : SUBSCRIBE_HREF.other} aria-current={here("newsletter")}>Subscribe</HomeLink>
        <button
          type="button"
          className="hp-header__menu"
          ref={menuButtonRef}
          aria-expanded={sheet}
          aria-controls="hp-sheet"
          aria-haspopup="dialog"
          onClick={() => {
            closeMenu();
            if (!sheet && window.track) window.track("nav_menu_open", { location });
            setSheet(!sheet);
          }}
        >
          <svg viewBox="0 0 16 12" width="16" height="12" aria-hidden="true" focusable="false">
            <path d="M1 1h14M1 6h14M1 11h14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>Menu</span>
        </button>
      </div>
      <NavSheet
        open={sheet}
        sheetRef={sheetRef}
        home={home}
        link={menuLink}
        onClose={() => closeSheet(true)}
      />
    </div>
  );
}

// The phone Menu sheet (HomeMasthead above has its dialog contract). The
// six groups in the masthead's order, each with its `quick` links and a
// "More" link to its landing page (Map is one link), then the Field Guide and
// the bookshelf. Rendered empty while closed: the desktop panels already
// carry every link for a crawler, and the static shell stays small.
function NavSheet({ open, sheetRef, home, link, onClose }) {
  const where = { location: "mobile_navigation", affList: "nav_sheet" };
  return (
    <div
      className={["hp-sheet", open && "is-open"].filter(Boolean).join(" ")}
      id="hp-sheet"
      ref={sheetRef}
      hidden={!open}
      {...(open ? { role: "dialog", "aria-modal": "true", "aria-label": "Site menu" } : {})}
    >
      {open && (
        <div className="hp-sheet__inner">
          <div className="hp-sheet__top">
            <p className="hp-sheet__title">Menu</p>
            <button type="button" className="hp-sheet__close" onClick={onClose}>
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
                <path d="M1 1l10 10M11 1L1 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span>Close</span>
            </button>
          </div>
          {HOME_NAV.map((item) => {
            const g = item.group && NAV_GROUPS.find((group) => group.key === item.group);
            if (!g || !g.columns) {
              return (
                <div key={item.href} className="hp-sheet__group hp-sheet__group--link">
                  {link({ key: item.href.slice(1), label: item.label }, "hp-sheet__head", where)}
                </div>
              );
            }
            const quick = g.columns.flatMap((col) => col.links).filter((l) => l.quick);
            return (
              <section key={g.key} className="hp-sheet__group">
                <h2 className="hp-sheet__label">{item.label}</h2>
                {quick.map((l) => link({ ...l, note: undefined }, "hp-sheet__link", where))}
                {link({ key: g.route, label: `More: ${homeMenuCta(g.cta)}` }, "hp-sheet__more", where)}
              </section>
            );
          })}
          <div className="hp-sheet__foot">
            {link({ key: "guide", ...(home ? { onHome: "field-guide" } : {}), label: "Field Guide" }, "hp-sheet__link", where)}
            {link({ aff: "bookshop", label: "Books ↗", note: "The field guides I recommend, on Bookshop.org. Affiliate link" }, "hp-sheet__link hp-sheet__books", where)}
          </div>
        </div>
      )}
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
      title={article.title} text={<React.Fragment>{article.dek} ↗</React.Fragment>} sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 45vw, 420px" />
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

// The Field Guide's terms, stated one way everywhere the site sells it (the
// UX and sales audit, October 2026, found the buy box, the bands, the FAQ and
// /terms each saying it differently). Static on purpose: the bands bake into
// the home shell and the prerendered pages, so they cannot wait on an API.
// Checkout itself charges GUIDE_PRICE_CENTS from workers/wrangler.toml, and
// Stripe shows the buyer that amount before they pay; `price` is the display
// copy and must change with it. `refund` restates /terms section 1 (page-legal.jsx)
// and must not promise more than it does. page-guide.jsx, page-planning-guide.jsx,
// the /guide FAQ (mirrored in app.jsx and edge/seo.js) read or restate these.
const GUIDE_TERMS = {
  priceCents: 399,
  price: "$3.99",
  months: 18,
  short: "One payment · 18 months of access · No automatic renewal",
  updates: "Updates included during your access period",
  refund: "Refunded in full within 30 days if it does not work as described",
  refundShort: "30-day refund if it does not work as described",
};
window.GUIDE_TERMS = GUIDE_TERMS;

// The three benefit lines the homepage prints for the Field Guide. Literal
// copy, like everything on the homepage: edit here when the guide changes.
const HP_GUIDE_POINTS = [
  { mark: "↳", title: "Find your next stop.", text: "44 stops, arranged in driving order." },
  { mark: "△", title: "Choose a hike that fits your day.", text: "57 day hikes with GPS tracks." },
  { mark: "◎", title: "Bring a little local knowledge.", text: "70 Secret Guide entries to look beyond the obvious." },
];

// The Field Guide band: the dark section with the two phone captures. One per
// page ("nothing is asked for twice"). `children` replaces the default buy
// link and terms (the /guide page puts its own checkout button there);
// `points={null}` drops the benefit lines; `sample` adds the free-preview line.
// The guide band's denominator. guide_cta_click says how many readers clicked
// a placement; without a matching view count nobody can tell a placement that
// converts from one nobody scrolls to (the article_end band sits below the
// related rail). Fires guide_band_impression once per mount, the first time
// the band is 40% visible, with the caller's `location`, the same rule
// useNewsletterImpression uses for the letter units.
function useGuideBandImpression(location) {
  const ref = useRef(null);
  const firedRef = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      if (window.track) window.track("guide_band_impression", { location: location || "unknown" });
    };
    if (typeof IntersectionObserver === "undefined") { fire(); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { fire(); io.disconnect(); break; }
      }
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, [location]);
  return ref;
}

function HpGuideBand({ go, location, id, eyebrow = "THE TALUS FIELD GUIDE / THE OFFLINE APP", title, intro, points = HP_GUIDE_POINTS, heading = "h2", sample, children }) {
  const H = heading;
  const ref = useGuideBandImpression(location);
  return (
    <section className="hp-product" id={id} tabIndex={id ? -1 : undefined} ref={ref}>
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
            <HomeLink go={go} location={location} className="hp-button hp-light" href="/guide">Get the offline Field Guide <span>{GUIDE_TERMS.price} ↗</span>
            </HomeLink>
            <p className="hp-terms">{GUIDE_TERMS.short} · {GUIDE_TERMS.refundShort}</p>
            <p className="hp-terms hp-owner">Already bought it?{" "}
              <a href={`${GUIDE_PROMO_APP_BASE}/`} onClick={() => { if (window.track) window.track("guide_open_click", { location }); }}>Open your guide ↗</a>
            </p>
          </React.Fragment>}
          {sample && (
            <p className="hp-terms hp-sample">Not sure yet? Five entries are free to read, no email required:{" "}
              <a href={`${GUIDE_PROMO_APP_BASE}/preview`} onClick={() => { if (window.track) window.track("guide_sample_click", { location }); }}>preview the guide ↗</a>
            </p>
          )}
        </div>
        <div className="hp-screens">
          <div className="hp-orbit">
          </div>
          <div className="hp-phone hp-back">
            <img src="/img/guide/screens/regions.v7.webp" alt="Field Guide regions screen: four photo cards, one for each region of the park" width="640" height="1385" loading="lazy" decoding="async" />
          </div>
          <div className="hp-phone hp-front">
            <img src="/img/guide/screens/front-page.v7.webp" alt="Field Guide front page with the valley forecast, the day's light and live gate waits" width="640" height="1385" loading="lazy" decoding="async" />
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
// section's h2 stands in for it); `paper` is the postcard's line; `children`
// sit between the h2 and the form (/dates puts its reminder chips there).
function HpLetter({ id, eyebrow, title, heading, blurb, location, tag, variant, send, cta = "Send me the letter ↗", terms = "Free to read. One letter a week. Unsubscribe whenever.", paper, stamp = "THE SUNDAY LETTER", children }) {
  return (
    <section className="hp-letter hp-wrap hp-section" id={id} tabIndex={id ? -1 : undefined}>
      <HpPostcard paper={paper} stamp={stamp} />
      <div>
        <p className="hp-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {children}
        <NewsletterInline heading={heading} blurb={blurb} location={location} tag={tag} variant={variant} send={send} cta={cta} modifier="hp-newsletter" inputLabel="Your email address" />
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
  // The full map of the site. The columns carry the masthead's six labels in
  // the masthead's order (Plan, Hikes & permits, Conditions, Seasons, Map,
  // Library), so a reader who learned where something lives in the menus
  // finds it under the same heading here. Under the grid, the Tools line
  // (the map, the Field Guide, the conditions widget); the journal's own
  // pages sit under the about block, and the business and legal pages in the
  // bar at the foot. Hand-kept, not derived from NAV_GROUPS: the footer lists
  // more than the menus do. scripts/gen-archive.mjs mirrors it (siteFooter).
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
  const inline = (route, label) => (
    <a
      key={route}
      href={window.routeToPath ? window.routeToPath(route) : `/${route}`}
      onClick={(e) => {
        e.preventDefault();
        if (route === "guide" && window.track) window.track("guide_cta_click", { location: "footer_guide_link" });
        go(route);
      }}
    >{label}</a>
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
            <p className="site-footer__journal">{inline("about", "About")} · {inline("contact", "Contact")}</p>
          </div>
          <div>
            <h2>Plan</h2>
            <ul>
              {link("start-here", "Start here")}
              {link("planning", "The Planning Guide")}
              {link("itineraries", "Itineraries")}
              {link("stay", "Where to stay")}
              {link("a:yosemite-camping-complete-guide", "Camping")}
              {link("a:where-to-eat-yosemite", "Where to eat")}
              {link("distances", "Drive times")}
              {link("a:best-airport-for-yosemite", "Flying in")}
              {link("international", "Visiting from abroad")}
              {link("checklist", "First-week checklist")}
              {link("kit", "Kit")}
              {link("consult", "Trip consults")}
            </ul>
          </div>
          <div>
            <h2>Hikes &amp; permits</h2>
            <ul>
              {link("half-dome-lottery", "Half Dome lottery")}
              {link("a:mist-trail-the-real-guide", "Mist Trail")}
              {link("a:cathedral-lakes-day-hike", "Cathedral Lakes")}
              {link("a:yosemite-falls-trail", "Yosemite Falls Trail")}
              {link("a:clouds-rest-hike", "Clouds Rest")}
              {link("cat:trails", "All trails and hikes")}
            </ul>
          </div>
          <div>
            <h2>Conditions</h2>
            <ul>
              {link("conditions", "Conditions and road alerts")}
              {link("now", "The Park Bulletin")}
              {link("webcams", "Webcams")}
              {link("tioga-opening", "Tioga Road opening")}
            </ul>
          </div>
          <div>
            <h2>Seasons</h2>
            <ul>
              {link("dates", "Dates that matter")}
              {link("fall-color", "Fall color")}
              {link("firefall", "Firefall")}
              {link("moonbow", "Moonbow")}
              {link("frazil-ice", "Frazil ice")}
              {link("cat:seasonal", "Seasonal guides")}
            </ul>
          </div>
          <div>
            <h2>Map</h2>
            <ul>
              {link("map", "The trip map")}
            </ul>
          </div>
          <div>
            <h2>Library</h2>
            <ul>
              {link("articles", "All articles")}
              {link("cat:planning", "Planning")}
              {link("cat:trails", "Trails and hikes")}
              {link("cat:wildlife", "Wildlife and nature")}
              {link("cat:seasonal", "Seasonal guides")}
              {/*
                /archive is generated static HTML (scripts/gen-archive.mjs), not an
                SPA route, so this link must be a real navigation — no go() handler.
              */}
              <li><a href="/archive/">Nature Notes archive</a></li>
              {link("films", "Films")}
              {link("newsletter", "The Sunday Letter")}
              {link("search", "Search")}
            </ul>
          </div>
        </div>
        <p className="site-footer__tools">
          <span>Tools</span>
          {inline("map", "Map")}
          {inline("guide", "Field Guide")}
          {inline("widget", "Conditions widget")}
        </p>
        <div className="site-footer__disclosure">
          Some links on this site are affiliate links. If you book or buy through one, The Talus Field may earn a small commission at no extra cost to you. <a href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>Full disclosure here.</a>
        </div>
        {/* The business and legal pages. Sitewide footer links are the
            site's most plentiful internal links, and /advertise, /widget,
            /partners, /privacy and /terms were each collecting 31 to 65 of
            them, more than any article except the gateway hub; they sit in
            this bar, out of the columns, so they no longer outrank the
            writing for the site's own link equity. /explore lists them too. */}
        <div className="site-footer__legal">
          <div>© {new Date().getFullYear()} The Talus Field. Independent. Not affiliated with the National Park Service.</div>
          <div>
            <a href="/places" onClick={(e) => { e.preventDefault(); go("places"); }}>Directory</a>
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
    { key: "planning", label: "The Planning Guide", note: "Every article, ordered for a real trip" },
    { key: "search", label: "Search", note: "By title, section, or summary" },
    { href: "/archive/", label: "Nature Notes archive", note: "The park's naturalist newsletter, from 1922" },
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
    { key: "planning", label: "The Planning Guide", note: "Every article, in trip order" },
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
    { key: "planning", label: "The Planning Guide", note: "Every article, in trip order" },
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
    { key: "a:wildfire-in-yosemite-during-your-trip", label: "A fire near your trip", note: "What closes, and what to do with the bookings" },
  ] },
  stay: { links: [
    { key: "distances", label: "Drive times", note: "How far each town is from the Valley" },
    { key: "planning", label: "The Planning Guide", note: "Everything else the trip needs" },
    { key: "itineraries", label: "Itineraries", note: "What to do from where you booked" },
    { key: "checklist", label: "First-week checklist", note: "The week before you go, in order" },
  ] },
  webcams: { links: [
    { key: "conditions", label: "Conditions", note: "Forecasts and live entrance waits" },
    { key: "now", label: "The Park Bulletin", note: "What is open and on in the park now" },
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
    { key: "conditions", label: "Conditions", note: "What is open on your dates" },
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
    { key: "stay", label: "Where to stay", note: "The nights the trip needs" },
  ] },
  consult: { links: [
    { key: "planning", label: "The Planning Guide", note: "The free version" },
    { key: "guide", label: "The Field Guide", note: "The same park, offline and in your pocket" },
    { key: "itineraries", label: "Itineraries", note: "Plans in drive order" },
  ] },

  // --- The event pages, which are each other's best next link ---
  firefall: { links: [
    { key: "tioga-opening", label: "Tioga Road opening", note: "The other date people plan around" },
    { key: "half-dome-lottery", label: "Half Dome lottery", note: "The permit odds, plainly" },
    { key: "stay", label: "Where to stay", note: "February fills early" },
    { key: "conditions", label: "Conditions", note: "Webcams, entrance waits, forecasts" },
  ] },
  "tioga-opening": { links: [
    { key: "half-dome-lottery", label: "Half Dome lottery", note: "The permit odds, plainly" },
    { key: "firefall", label: "Firefall", note: "Whether the light is worth the trip" },
    { key: "a:tioga-road-stop-by-stop", label: "Tioga Road, stop by stop", note: "Every turnout from Crane Flat to the pass" },
    { key: "conditions", label: "Conditions", note: "Webcams, entrance waits, forecasts" },
  ] },
  "half-dome-lottery": { links: [
    { key: "tioga-opening", label: "Tioga Road opening", note: "When the high country opens" },
    { key: "firefall", label: "Firefall", note: "Whether the light is worth the trip" },
    { key: "cat:trails", label: "Trails and hikes", note: "The rest of the park's big days" },
    { key: "kit", label: "Kit", note: "What earns its place in the pack" },
  ] },
  "fall-color": { links: [
    { key: "a:yosemite-in-fall", label: "Yosemite in fall", note: "The rest of the season, beyond the leaves" },
    { key: "tioga-opening", label: "Tioga Road", note: "The high road, before it closes for snow" },
    { key: "firefall", label: "Firefall", note: "The next light people plan around" },
    { key: "stay", label: "Where to stay", note: "Every gateway road, compared" },
  ] },
  moonbow: { links: [
    { key: "frazil-ice", label: "Frazil ice", note: "The same creek on a freezing morning" },
    { key: "a:yosemite-waterfalls-guide", label: "The waterfalls guide", note: "How much water, month by month" },
    { key: "firefall", label: "Firefall", note: "The other light show on a waterfall" },
    { key: "stay", label: "Where to stay", note: "Close enough to walk home" },
  ] },
  "frazil-ice": { links: [
    { key: "moonbow", label: "Moonbow", note: "The same falls on full-moon nights" },
    { key: "a:yosemite-in-march", label: "Yosemite in March", note: "The month it most often starts" },
    { key: "firefall", label: "Firefall", note: "February's light on Horsetail Fall" },
    { key: "conditions", label: "Conditions", note: "Webcams, forecasts and closures" },
  ] },

  // --- The journal ---
  about: { links: [
    { key: "start-here", label: "Start here", note: "The first-trip questions, answered plainly" },
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
    { key: "planning", label: "The Planning Guide", note: "Every article, in trip order" },
    { key: "partners", label: "Group codes", note: "For lodging and rental hosts" },
  ] },
  newsletter: { links: [
    { key: "now", label: "The Park Bulletin", note: "Closures, programs and hours" },
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
    { key: "planning", label: "The Planning Guide", note: "Every article, in trip order" },
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

// The disclosure a reader meets before the first affiliate link: one line
// under the byline of an article flagged `aff: true` in window.ARTICLES
// (page-article.jsx), and in the HpPageHead of a standing page that carries
// affiliate links. AffiliateNote above still closes the body; this is the
// half the FTC cares about most, because it comes first. `children` replaces
// the default sentence when a page needs to name its program.
function AffiliateDisclosure({ children }) {
  return (
    <p className="aff-disclosure">
      {children || "This page has affiliate links. If you buy or book through one, The Talus Field may earn a commission at no extra cost to you, and the recommendations do not change for it."}{" "}
      <a href="/affiliate">How that works.</a>
    </p>
  );
}
window.AffiliateDisclosure = AffiliateDisclosure;

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

// A single disclosed availability link. `destination` is what the network
// searches ("Mariposa, California"); `name` is what GA4 records. `network` is
// "expedia" (the default, and the only network behind a filled booking
// button) or "stay22", an Allez roam search of the same place that compares
// booking sites; `campaign` tags a Stay22 click by placement and defaults to
// the aff_list value.
function AvailabilityLink({ destination, children, list, slug, name, className, style, network = "expedia", campaign }) {
  const stay22 = network === "stay22";
  let href;
  if (stay22) {
    href = window.stay22SearchUrl ? window.stay22SearchUrl(destination, campaign || list) : "https://www.booking.com/searchresults.html?ss=" + encodeURIComponent(destination);
  } else {
    href = window.buildAffiliateLink
      ? window.buildAffiliateLink("expedia", expediaSearchUrl(destination))
      : expediaSearchUrl(destination);
  }
  return (
    <a
      className={["aff-link", className].filter(Boolean).join(" ")}
      href={href}
      target="_blank"
      rel="sponsored noopener"
      data-aff-network={stay22 ? "stay22" : "expedia"}
      data-aff-list={list || "page"}
      data-aff-item-slug={slug || ""}
      data-aff-name={name || destination + (stay22 ? " booking-site comparison" : " lodging search")}
      style={style}
    >
      {children || (stay22 ? `Compare booking sites for ${destination} ↗` : `Check ${destination} availability →`)}
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
        rel="sponsored noopener"
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

// ============================================================
// Gear links: AffLink and RecommendedCard
// ============================================================
// AffLink is the inline affiliate anchor for anything that is not a lodging
// search (AvailabilityLink covers those). `network` names an entry in
// window.AFFILIATES; pass either the destination `url` or, for Patagonia, a
// category query `q`, which becomes the same /search/?q= URL the kit and
// /firefall link. Categories rather than products, because /affiliate
// promises fifty miles on any piece of gear the site names (CLAUDE.md,
// affiliate rules). Mirrored in scripts/gen-prerender.mjs.
function patagoniaSearchUrl(q) {
  return "https://www.patagonia.com/search/?q=" + encodeURIComponent(q).replace(/%20/g, "+");
}

function AffLink({ network = "patagonia", url, q, list, slug, name, className, children }) {
  const dest = url || (q ? patagoniaSearchUrl(q) : "");
  const href = window.buildAffiliateLink ? window.buildAffiliateLink(network, dest) : dest;
  return (
    <a
      className={["aff-link", className].filter(Boolean).join(" ")}
      href={href}
      target="_blank"
      rel="sponsored noopener"
      data-aff-network={network}
      data-aff-list={list || "page"}
      data-aff-item-slug={slug || ""}
      data-aff-name={name || q || dest}
    >{children}</a>
  );
}

// The small "what to bring" box: two to four items, each a line of advice the
// page already gives plus, where a joined program carries the category, one
// link. An item with no `q`/`url` renders linkless, which is the /affiliate
// guardrail in miniature (the best recommendation stays, unlinked). Carries
// its own disclosure line, like LodgingCta, so it stays honest wherever it is
// dropped. Item ids become the GA4 aff_item_slug. Any markup change here must
// be hand-mirrored in scripts/gen-prerender.mjs.
function RecommendedCard({ heading, note, items, list, slug, network = "patagonia", source = "Patagonia", disclosure }) {
  const linked = (items || []).some((it) => it.q || it.url);
  return (
    <aside className="rec-card" aria-label={heading || "What to bring"}>
      <h3 className="rec-card__head">{heading || "What to bring"}</h3>
      {note && <p className="rec-card__note">{note}</p>}
      <ul className="rec-card__list">
        {(items || []).map((it) => (
          <li key={it.id} className="rec-card__item">
            <span className="rec-card__text">
              <strong className="rec-card__what">{it.what}</strong>
              {it.why && <span className="rec-card__why">{it.why}</span>}
            </span>
            {(it.q || it.url) && (
              <AffLink
                network={it.network || network}
                q={it.q}
                url={it.url}
                list={list}
                slug={(slug ? slug + ":" : "") + it.id}
                name={it.what}
                className="rec-card__link"
              >{it.label || source} ↗</AffLink>
            )}
          </li>
        ))}
      </ul>
      {linked && (
        <p className="rec-card__disclosure">
          {disclosure || `${source} links are affiliate links. Any equivalent does the same job, and the list does not change for them.`} <a href="/affiliate">Disclosure.</a>
        </p>
      )}
    </aside>
  );
}

// The bookshelf: the owner's list of recommended field guides and
// natural-history books on Bookshop.org (window.BOOKSHOP_LIST_URL in
// affiliate.js). One boxed, disclosed link to the whole list, drawn as a
// RecommendedCard so it reads as the same family as the gear box. It links
// the list, never a title, so the copy names no book the list might drop.
// Not in the gen-prerender.mjs sandbox: page-article.jsx and /kit mount it,
// no article body does.
function BookshelfCard({ list, slug, heading, note }) {
  return (
    <RecommendedCard
      heading={heading || "The bookshelf"}
      note={note || "The field guides and natural-history books I recommend for Yosemite, kept as one list."}
      network="bookshop"
      source="Bookshop.org"
      disclosure="This is an affiliate link. The list does not change for it."
      list={list}
      slug={slug}
      items={[{
        id: "bookshelf",
        what: "Yosemite field guides: a naturalist's bookshelf",
        why: "Sold through Bookshop.org, which supports independent bookstores.",
        url: window.buildAffiliateLink ? window.buildAffiliateLink("bookshop") : "",
        label: "See the list on Bookshop.org",
      }]}
    />
  );
}

Object.assign(window, { expediaSearchUrl, AvailabilityLink, LodgingCta, ExpediaBanner, patagoniaSearchUrl, AffLink, RecommendedCard, BookshelfCard });

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
// Newsletter signup (shared)
// Every form subscribes through the API Worker (/api/subscribe), which calls
// Buttondown's API and answers with a real status. Until October 2026 the
// forms POSTed to Buttondown's embed-subscribe endpoint in a hidden iframe;
// from early September Buttondown answered those with a Cloudflare Turnstile
// "Verify Your Subscription" page that a hidden frame can neither show nor
// complete, so no signup reached the list for a month while every form said
// it had (the embed's `tag` field never reached a subscriber record either).
// The embed endpoint survives as the fallback: when the Worker cannot say
// yes, the form turns into a plain POST to Buttondown in a new tab, where a
// human passes the check, so no failure on our side loses a signup.
// The GA4 `newsletter_signup` event and the local "subscribed" flag fire only
// on a confirmed signup or a press of that fallback button.
// ============================================================
const NL_API_BASE = (typeof window !== "undefined" && window.GUIDE_API_BASE) || "https://api.thetalusfieldjournal.com";
const NL_BUTTONDOWN_ACTION = "https://buttondown.com/api/emails/embed-subscribe/goehring";
window.NL_BUTTONDOWN_ACTION = NL_BUTTONDOWN_ACTION;

// What the reader is told after a signup. The Worker subscribes single
// opt-in (type "regular"), so a confirmed signup has no step left. The tab
// line is for the fallback, where Buttondown's own page finishes the job.
const NL_CONFIRM_LINE = "You are on the list. The next Sunday letter comes to you.";
const NL_TAB_LINE = "One step left: finish in the Buttondown tab that just opened. If it asks, press Verify and Subscribe, or the letter never starts.";
// A signup that also asked for a printable (NewsletterForm `send`) and the
// Worker reports it mailed.
const NL_SENT_LINE = "Sent. Look for it in your inbox. You are on the list for Sunday Field Notes too.";
function nlDoneLine(mode) { return mode === "tab" ? NL_TAB_LINE : mode === "sent" ? NL_SENT_LINE : NL_CONFIRM_LINE; }
window.NL_CONFIRM_LINE = NL_CONFIRM_LINE;
window.nlDoneLine = nlDoneLine;

// POST one signup to the Worker. Resolves to "ok", "sent" (on the list, and
// the printable named by `send` was mailed), "invalid" (the reader can fix
// the address), "rate" (too many tries), "blocked" (Buttondown's firewall
// refused the address: the Worker's 502 carries code "subscriber_blocked",
// and the embed form may still take it from a human), or "fallback"
// (anything else, including a timeout or the Worker being unreachable).
// Never rejects.
function subscribeNewsletter({ email, tag, website, location, send }) {
  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), 10000) : null;
  return fetch(`${NL_API_BASE}/api/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, tag: tag || "", website: website || "", referrer: window.location.href, ...(send ? { send } : {}) }),
    signal: ctrl ? ctrl.signal : undefined,
  })
    .then((r) => {
      if (r.status === 400) return "invalid";
      if (r.status === 429) return "rate";
      if (!r.ok) return r.json().then((j) => (j && j.code === "subscriber_blocked" ? "blocked" : "fallback"), () => "fallback");
      return r.json().then((j) => (send && j && j.sent ? "sent" : "ok"), () => "ok");
    })
    .catch(() => "fallback")
    .then((result) => {
      if (timer) clearTimeout(timer);
      if (window.track) window.track("newsletter_signup_result", { location: location || "unknown", tag: tag || "", result });
      return result;
    });
}
window.subscribeNewsletter = subscribeNewsletter;

const NL_STATUS_COPY = {
  invalid: "That address did not take. Check it and try again.",
  rate: "Too many tries from this connection. Try again in an hour.",
  fallback: "Our signup did not answer. Press the button again to finish on Buttondown; it opens in a new tab.",
  blocked: "Buttondown could not accept that address here. Press the button again to finish on Buttondown; it opens in a new tab.",
};

// The one signup form. Renders the email field, the hidden tag, a honeypot
// and the button, plus a status line under the form. `onDone(mode)` fires
// once the reader is on the list ("api") or has been handed to Buttondown's
// tab ("tab"), with the address as its second argument (a gate that also
// emails something needs it); the caller swaps in its own done state,
// usually nlDoneLine.
// `onFallback(result, email)` is optional: when given, a "fallback",
// "blocked" or "rate" result goes to the caller instead of turning the
// button into the Buttondown step, with no newsletter_signup event and no
// subscribed flag, since nobody joined. The map gate uses it to open the
// map anyway and offer the Buttondown step itself; every other form keeps
// the press-again-to-finish behaviour.
// `className` defaults to the shared nlbox__form; `inputId` pairs the field
// with a visible <label> the caller renders.
function NewsletterForm({ location, tag, variant = "", cta = "Subscribe →", send, onDone, onFallback, className = "nlbox__form", inputId, inputLabel, placeholder = "you@email.com", inputRef, autoFocus }) {
  const [status, setStatus] = useState("idle"); // idle | sending | invalid | rate | fallback | blocked
  const handoff = status === "fallback" || status === "blocked";
  const finish = (mode, email) => {
    trackNewsletterSubmit(location, tag, variant);
    if (onDone) setTimeout(() => onDone(mode, email), 0);
  };
  const onSubmit = (e) => {
    if (handoff) {
      // Let the native POST go to Buttondown in a new tab: this press is the
      // user gesture a new tab needs, which an async fetch result is not.
      if (window.track) window.track("newsletter_signup_result", { location: location || "unknown", tag: tag || "", result: "tab" });
      finish("tab", String(new FormData(e.currentTarget).get("email") || "").trim());
      return;
    }
    e.preventDefault();
    if (status === "sending") return;
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    setStatus("sending");
    subscribeNewsletter({ email, tag, website: String(data.get("website") || ""), location, send })
      .then((result) => {
        if (result === "ok") finish("api", email);
        else if (result === "sent") finish("sent", email);
        else if (onFallback && result !== "invalid") { setStatus("idle"); onFallback(result, email); }
        else setStatus(result);
      });
  };
  const note = NL_STATUS_COPY[status];
  return (
    <>
      <form className={className} action={NL_BUTTONDOWN_ACTION} method="post" target="_blank" rel="noopener" onSubmit={onSubmit}>
        <input ref={inputRef} id={inputId} type="email" name="email" aria-label={inputLabel || "Email address"} autoComplete="email" placeholder={placeholder} required autoFocus={autoFocus} aria-invalid={status === "invalid" || undefined} />
        {tag && <input type="hidden" name="tag" value={tag} />}
        <input type="hidden" name="embed" value="1" />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="nlbox__hp" />
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Joining…" : handoff ? "Finish on Buttondown →" : cta}
        </button>
      </form>
      {note && <p className="nlbox__note" role="status">{note}</p>}
    </>
  );
}
window.NewsletterForm = NewsletterForm;

// ============================================================
// SoftGate: a teaser gate for the extras the letter unlocks (the rest of a
// trip plan, the deadline calendar, an article's bonus section). Three rules,
// each the difference between a gate and a wall:
// (1) it never hides published text: `teaser` is a separate, decorative
//     preview (aria-hidden, faded), and `children` are not rendered at all
//     until the gate opens, so nothing sits in the DOM that a reader cannot
//     see (which search engines read as cloaking);
// (2) "No thanks, show me" always opens it, and that answer is remembered
//     per gate on this device (tfg.gate.<gateKey>), so a reader is asked once;
// (3) it fails open: a subscribed device, or one whose storage is
//     unavailable (private mode), never sees it, the same rule as the map.
// `onUnlock(mode, email)` runs after a signup, before the children render;
// `doneText` replaces the confirmation line after a confirmed signup.
// ============================================================
function nlStorageWorks() {
  // safeStorage.get returns its fallback only when storage itself throws.
  return window.safeStorage.get(NL_SUBSCRIBED_KEY, "__unavailable") !== "__unavailable";
}
function gateIsOpen(gateKey) {
  return !nlStorageWorks() || isSubscribed() || window.safeStorage.get(`tfg.gate.${gateKey}`) === "skip";
}
window.gateIsOpen = gateIsOpen;

function SoftGate({ gateKey, location, tag, heading, blurb, cta = "Unlock →", skipLabel = "No thanks, show me", teaser, onUnlock, doneText, children, className }) {
  const [open, setOpen] = useState(() => gateIsOpen(gateKey));
  const [done, setDone] = useState(null);
  const ref = useNewsletterImpression(location, tag, !open);
  // A signup in another unit, or a skip of a gate sharing this key, opens
  // this one too: two gates on one page should not ask twice.
  useEffect(() => {
    if (open) return;
    const recheck = () => { if (gateIsOpen(gateKey)) setOpen(true); };
    window.addEventListener("tfg:gates", recheck);
    return () => window.removeEventListener("tfg:gates", recheck);
  }, [open, gateKey]);
  if (open) {
    return (
      <>
        {done && <p className="nlbox__done softgate__done" role="status">{done === "api" && doneText ? doneText : nlDoneLine(done)}</p>}
        {children}
      </>
    );
  }
  const skip = () => {
    window.safeStorage.set(`tfg.gate.${gateKey}`, "skip");
    if (window.track) window.track("newsletter_gate_skip", { location, tag: tag || "" });
    setOpen(true);
    try { window.dispatchEvent(new Event("tfg:gates")); } catch (_e) { /* see trackNewsletterSubmit */ }
  };
  return (
    <div className={["softgate", className].filter(Boolean).join(" ")} ref={ref}>
      {teaser && <div className="softgate__teaser" aria-hidden="true">{teaser}</div>}
      <div className="nlbox softgate__card">
        <h3>{heading}</h3>
        {blurb && <p>{blurb}</p>}
        <NewsletterForm
          location={location}
          tag={tag}
          cta={cta}
          onDone={(mode, email) => {
            if (onUnlock) onUnlock(mode, email);
            setDone(mode);
            setOpen(true);
          }}
        />
        <button type="button" className="softgate__skip" onClick={skip}>{skipLabel}</button>
      </div>
    </div>
  );
}
window.SoftGate = SoftGate;

// The subscribed flag's value. "1" was written by the hidden-iframe forms,
// which from early September 2026 never reached Buttondown, so a device
// carrying it may never have subscribed and would otherwise never be asked
// again. Those devices are migrated once: the map unlock they were promised
// is kept (tfg.map.unlocked), and the newsletter flag is cleared so the asks
// return. Only a submit through the new-tab forms writes "2".
const NL_SUBSCRIBED_KEY = "tfg.nl.subscribed";
const NL_SUBSCRIBED_VALUE = "2";
if (window.safeStorage.get(NL_SUBSCRIBED_KEY) === "1") {
  window.safeStorage.set("tfg.map.unlocked", "1");
  window.safeStorage.remove(NL_SUBSCRIBED_KEY);
}

function trackNewsletterSubmit(location, tag, variant) {
  if (window.track) window.track("newsletter_signup", { location: location || "unknown", tag: tag || "", variant: variant || "" });
  window.safeStorage.set(NL_SUBSCRIBED_KEY, NL_SUBSCRIBED_VALUE);
  // Lets every SoftGate already on the page open with this signup.
  try { window.dispatchEvent(new Event("tfg:gates")); } catch (_e) { /* old browsers: gates open on next mount */ }
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
// nl_valueprop (nlValueProp below) is the one live test; run at most one at a
// time (CONVERSION-STRATEGY R12).
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

// nl_valueprop: the one live test (ARCHITECTURE.md, tfg.ab.<test>). It covers
// all four newsletter placements (article_end, article_mid,
// article_exit_intent, scroll_bar) so a visitor meets one framing everywhere.
// Arm "a" is the standing copy, arm "b" the concrete-utility copy. Call it
// lazily, at render or when a hook opens, never at module load. It folds in
// the retired article_end_copy test: a device already bucketed there keeps its
// arm (seeded once into the new key) and the old key is removed. A subscribed
// visitor with no bucket is not assigned one. Falls open to "a" when storage
// is unavailable or absent (the prerender sandbox).
function nlValueProp() {
  const store = window.safeStorage;
  if (!store) return "a";
  const legacy = store.get("tfg.ab.article_end_copy");
  if (legacy !== null && legacy !== undefined) {
    // Only drop the old key once its arm is safely under the new one: a write
    // that fails (a full quota) must not cost the device its bucket.
    let carried = true;
    if ((legacy === "a" || legacy === "b") && store.get("tfg.ab.nl_valueprop") === null) {
      carried = store.set("tfg.ab.nl_valueprop", legacy);
    }
    if (!carried) return legacy;
    store.remove("tfg.ab.article_end_copy");
  }
  const existing = store.get("tfg.ab.nl_valueprop");
  if (existing === "a" || existing === "b") return existing;
  if (isSubscribed()) return "a";
  return abVariant("nl_valueprop");
}
window.nlValueProp = nlValueProp;
// The value that rides on the GA4 `variant` param: nl_valueprop:a / nl_valueprop:b.
function nlValuePropVariant(arm) { return "nl_valueprop:" + (arm === "b" ? "b" : "a"); }
window.nlValuePropVariant = nlValuePropVariant;

// Single read-path for the subscribed flag. Reads through window.safeStorage,
// which returns null when storage is unavailable, so this is false in private
// mode just as before.
function isSubscribed() {
  return window.safeStorage.get(NL_SUBSCRIBED_KEY) === NL_SUBSCRIBED_VALUE;
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
// HpLetter is the one caller: it passes the copy, the button label, the
// `hp-newsletter` modifier, the visible input label, and `variant` when the
// caller runs a copy test (nl_valueprop:a / nl_valueprop:b), so each arm's rate is sliceable.
// `send` names a printable for the Worker to mail with the signup (see
// PRINTABLES in workers/src/lib/email.ts); a subscribed device still sees the
// soft state, so the caller keeps its own way to the printable on the page.
// The recent Sunday letters, from the Worker's /api/letters (Buttondown's
// public archive, read through its RSS). One request per page view at most,
// shared by every unit that asks, and an empty list on any failure: the
// signup never waits on it and a dead feed renders nothing.
let lettersPromise = null;
function loadRecentLetters() {
  if (!lettersPromise) {
    lettersPromise = fetch(`${NL_API_BASE}/api/letters`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => (j && Array.isArray(j.letters) ? j.letters.filter((l) => l && l.title && /^https:\/\/buttondown\.com\//.test(l.url)) : []))
      .catch(() => []);
  }
  return lettersPromise;
}
window.loadRecentLetters = loadRecentLetters;

function useRecentLetters(ref) {
  const [letters, setLetters] = useState([]);
  useEffect(() => {
    let live = true;
    const load = () => loadRecentLetters().then((list) => { if (live) setLetters(list); });
    const node = ref && ref.current;
    // Units sit low on most pages: wait until one is near the screen.
    if (!node || typeof IntersectionObserver === "undefined") { load(); return () => { live = false; }; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); load(); }
    }, { rootMargin: "400px 0px" });
    io.observe(node);
    return () => { live = false; io.disconnect(); };
  }, []);
  return letters;
}
window.useRecentLetters = useRecentLetters;

// A sample of the thing being asked for, under the form: the latest letter's
// title, linked to the public archive. People sign up for a letter they have
// read far more readily than for a description of one.
function LatestLetter({ location }) {
  const ref = useRef(null);
  const letters = useRecentLetters(ref);
  const latest = letters[0];
  return (
    <p className="nlbox__latest" ref={ref}>
      {latest && (
        <>
          <span className="nlbox__latest-label">Last Sunday's letter: </span>
          <a
            href={latest.url}
            target="_blank"
            rel="noopener"
            onClick={() => { if (window.track) window.track("newsletter_sample_click", { location: location || "unknown" }); }}
          >{latest.title} ↗</a>
        </>
      )}
    </p>
  );
}
window.LatestLetter = LatestLetter;

function NewsletterInline({ heading, blurb, location, tag, variant = "", cta, modifier, inputLabel, send }) {
  const [done, setDone] = useState(null); // null | "api" | "tab"
  const subscribed = isSubscribed();
  // Only count an impression when an actual ask is on screen, not the
  // subscribed soft state or the post-submit confirmation.
  const ref = useNewsletterImpression(location, tag, !subscribed && !done, variant);

  if (subscribed && !done) {
    return (
      <div className={["nlbox", "nlbox--subscribed", modifier].filter(Boolean).join(" ")} ref={ref}>
        <p className="nlbox__already">You signed up on this device. <a href="/map">The interactive map is open to you →</a></p>
      </div>
    );
  }

  return (
    <div className={["nlbox", modifier].filter(Boolean).join(" ")} ref={ref}>
      <h3>{heading || "Sunday Field Notes"}</h3>
      <p>{blurb || "A letter from inside Yosemite on Sundays: what the park is doing this week and why, set beside what its naturalists wrote down in the same weeks a century ago."}</p>
      {inputLabel && !done && <label htmlFor={`${location}-email`}>{inputLabel}</label>}
      {done ? (
        <p className="nlbox__done" role="status">
          {nlDoneLine(done)} <a href="/map">The map is already open to you →</a>
        </p>
      ) : (
        <NewsletterForm
          location={location}
          tag={tag}
          variant={variant}
          cta={cta}
          send={send}
          inputId={inputLabel ? `${location}-email` : undefined}
          inputLabel={inputLabel}
          onDone={setDone}
        />
      )}
      {!done && <LatestLetter location={location} />}
    </div>
  );
}

// ============================================================
// Growth hooks: the exit-intent modal, the scroll bar (NewsletterBar) and the
// mid-article banner (page-article.jsx) all offer Sunday Field Notes, and they
// share three things defined here.
// (1) Copy that names the page, its section and the season (nlHookCopy), so
//     no hook says the same generic sentence. Every line is true of the real
//     letter (a weekly Sunday letter about the park right now); none promises
//     a feature or a count. The nl_valueprop B tables are the one exception to
//     "no road status": their concrete-utility framing (what's open, what's
//     booked out) is the experiment, and the letter must carry it if B wins.
// (2) A per-session lock: whichever of the exit modal and the scroll bar
//     shows first suppresses the other until the tab closes (sessionStorage,
//     with an in-memory fallback where storage is blocked). The mid-article
//     banner sits in the text and is not part of the lock.
// (3) The routes on which neither popup may appear: pages that already carry
//     their own signup or gate, and the paid product's pages.
// ============================================================
const NL_HOOK_SESSION_KEY = "tfg.nl.hook.session";
function nlHookSessionGet() {
  try { return window.sessionStorage.getItem(NL_HOOK_SESSION_KEY) || window.__tfgNlHook || null; }
  catch (_e) { return window.__tfgNlHook || null; }
}
function nlHookSessionSet(who) {
  window.__tfgNlHook = who;
  try { window.sessionStorage.setItem(NL_HOOK_SESSION_KEY, who); } catch (_e) { /* the memory flag covers this page load */ }
}
// Days since an ISO timestamp kept under `key`; Infinity when absent or unreadable.
function nlDaysSince(key) {
  const raw = window.safeStorage.get(key);
  const t = raw ? new Date(raw).getTime() : NaN;
  return Number.isFinite(t) ? (Date.now() - t) / 86400000 : Infinity;
}
const NL_POPUP_EXCLUDED = new Set([
  "newsletter", "contact", "privacy", "terms", "affiliate", "films",
  // their own email gate or signup, or a form the reader is in the middle of
  "map", "itineraries", "checklist", "dates", "consult", "widget", "partners", "search", "kit",
  // the paid product: its pages sell, and one ask per page holds
  "guide", "notfound",
]);
const NL_BAR_ROUTES = new Set([
  "articles", "planning", "conditions", "stay", "webcams", "distances", "start-here",
  "firefall", "tioga-opening", "half-dome-lottery", "fall-color", "moonbow", "frazil-ice",
]);
function nlRouteCat(route) {
  if (route && route.startsWith("a:")) { const a = window.findArticle && window.findArticle(route.slice(2)); return a ? a.cat : ""; }
  if (route && route.startsWith("cat:")) return route.slice(4);
  return "";
}
window.nlPopupAllowed = (route) => !NL_POPUP_EXCLUDED.has(route);
window.nlBarAllowed = (route) => !!route && (route.startsWith("a:") || route.startsWith("cat:") || NL_BAR_ROUTES.has(route));

function nlSeason(date) {
  const m = (date || new Date()).getMonth(); // 0 = January
  return m <= 1 || m === 11 ? "winter" : m <= 4 ? "spring" : m <= 7 ? "summer" : "fall";
}
window.nlSeason = nlSeason;
// What the letter is following in each season, in the plain terms the park's
// own calendar gives it. Closes a blurb.
const NL_SEASON_LINE = {
  winter: "Right now that means snow, storms and the quiet valley floor.",
  spring: "Right now that means snowmelt and rising water.",
  summer: "Right now that means the high country and the long days.",
  fall: "Right now that means shorter days and the turn of the leaves.",
};
const NL_LETTER_TAIL = "Free, and you can leave anytime.";
// Per section: [heading, blurb] for the mid-article banner and the exit modal,
// and the scroll bar's single line (`{s}` is the season word).
const NL_HOOK_CAT = {
  planning: {
    mid: ["Plans change with the season", "Sunday Field Notes is a free weekly letter on what the park is doing right now, so a plan made today is read against the week you actually drive in."],
    exit: ["Before you lock in the plan", "Sunday Field Notes is a weekly letter on what Yosemite is doing this week and why, so the trip you are planning is read against the season it lands in."],
    bar: "Planning a {s} trip? Sunday Field Notes is a free weekly letter on the park right now.",
  },
  trails: {
    mid: ["Before the next hike", "A free Sunday letter on how the park is behaving this week, from the gauges to the snowline, set beside what its naturalists wrote down in the same weeks a century ago."],
    exit: ["Take the trail notes with you", "Sunday Field Notes follows what the park is doing this week, from creek flow to the snowline, so the next trail you pick is one you read about first."],
    bar: "Hiking this {s}? Sunday Field Notes covers how the park is behaving this week. Free.",
  },
  wildlife: {
    mid: ["Who is moving this week", "A free Sunday letter that watches the park's wildlife and plants week by week, with the science behind what you are seeing and the naturalists' notes from a century ago."],
    exit: ["More like this, on Sundays", "Sunday Field Notes is a naturalist's letter: one seasonal observation a week, with the mechanism, the species and the numbers behind it."],
    bar: "Who is moving in the park this {s}? Sunday Field Notes, free, once a week.",
  },
  seasonal: {
    mid: ["Follow the season as it turns", "A free Sunday letter that tracks the park week by week, so the month you are reading about is the month you see."],
    exit: ["Keep up with the season", "Sunday Field Notes follows the park as the seasons turn: what the river is doing, what is in bloom and what the naturalists recorded in the same weeks a century ago."],
    bar: "Following the {s}? Sunday Field Notes is the free weekly letter on the park right now.",
  },
};
// Standing pages that have a subject of their own.
const NL_HOOK_ROUTE = {
  planning: {
    exit: ["Before you book anything", "Sunday Field Notes is a weekly letter on what Yosemite is doing this week and why. It reads the season the trip lands in."],
    bar: "Planning a Yosemite trip? Sunday Field Notes is a free weekly letter on the park right now.",
  },
  conditions: {
    exit: ["Conditions change weekly", "Sunday Field Notes puts the week in one letter: the gauges, the snow, the season, and what the naturalists recorded in the same weeks a century ago."],
    bar: "Conditions change by the week. Sunday Field Notes puts the week in one letter. Free.",
  },
  stay: {
    exit: ["Before you book a bed", "Sunday Field Notes is a free weekly letter on what the park is doing, so the dates you choose match the season you will find."],
    bar: "Choosing where to stay? Sunday Field Notes is a free weekly letter on the park right now.",
  },
  webcams: {
    exit: ["Seen enough for today?", "Sunday Field Notes is the weekly letter on what the park is doing and why: the water, the snow and the season, written on Sundays."],
    bar: "Watching the park on camera? Sunday Field Notes explains the week. Free.",
  },
};
const NL_HOOK_DEFAULT = {
  mid: ["Sunday Field Notes", "A free letter from inside the park on Sundays: what Yosemite is doing this week and why."],
  exit: ["A letter from inside the park, on Sundays.", "Sunday Field Notes: what Yosemite is doing this week and why, from the river gauges to the oaks, set beside what its naturalists wrote down in the same weeks a century ago. Free, and you can leave anytime."],
  bar: "Sunday Field Notes: a free weekly letter from inside Yosemite.",
};
// B arm of the nl_valueprop test: the same tables keyed the same way, in the
// concrete-utility register of END_NEWSLETTER_OFFER_B (what's open, what's
// booked out, what changed this week, the Sunday before you go). Lengths track
// the A copy so nothing reflows. The claims are the experiment's (see the
// growth-hooks note above), not yet a description of every letter.
const NL_HOOK_CAT_B = {
  planning: {
    mid: ["What's open the week you go", "Sunday Field Notes is a free weekly letter on what's open, what's booked out and what changed this week, so a plan made today holds up the Sunday before you go."],
    exit: ["Check the plan the Sunday before", "Sunday Field Notes is a weekly letter on what's open, what's booked out and what changed this week, so the trip you are planning is checked against the week it lands in."],
    bar: "Planning a {s} trip? Get what's open and booked out, the Sunday before you go. Free.",
  },
  trails: {
    mid: ["Trail status before you drive in", "A free Sunday letter on what's open and what changed on the trails this week, from creek flow to the snowline, so you read it before the next hike."],
    exit: ["Trail status, every Sunday", "Sunday Field Notes covers what's open and what changed on the trails this week, from creek flow to the snowline, so you know before you pick the next one."],
    bar: "Hiking this {s}? Sunday Field Notes covers what's open and what changed this week. Free.",
  },
  wildlife: {
    mid: ["What's out there this week", "A free Sunday letter on what the park's wildlife and plants are doing this week and what changed since last Sunday, so you know what to look for before you go."],
    exit: ["What's moving, on Sundays", "Sunday Field Notes is a weekly letter on what the park's wildlife and plants are doing this week and what changed since the last one, read before you go."],
    bar: "What's moving in the park this {s}? Get this week's changes on Sunday. Free.",
  },
  seasonal: {
    mid: ["Time it to the season", "A free Sunday letter on what's flowing, what's open and what changed this week, so the month you are reading about is the month you see."],
    exit: ["Know what's open this season", "Sunday Field Notes follows the season week by week: what the river is doing, what is open and what changed since last Sunday, read the Sunday before you go."],
    bar: "Following the {s}? Get what's open and what changed, every Sunday. Free.",
  },
};
const NL_HOOK_ROUTE_B = {
  planning: {
    exit: ["Check what's open before you book", "Sunday Field Notes is a weekly letter on what's open, what's booked out and what changed this week. Read it the Sunday before you go."],
    bar: "Planning a Yosemite trip? Get what's open and booked out, the Sunday before you go. Free.",
  },
  conditions: {
    exit: ["What changed this week", "Sunday Field Notes puts the week in one letter: what's open, what's closed, the gauges and the snow, and what changed since last Sunday."],
    bar: "Conditions change by the week. Get what's open and what changed on Sunday. Free.",
  },
  stay: {
    exit: ["What's booked out, before you book", "Sunday Field Notes is a free weekly letter on what's open and what's booked out, so the dates you choose match the week you will find."],
    bar: "Choosing where to stay? Get what's open and what's booked out on Sunday. Free.",
  },
  webcams: {
    exit: ["What the cameras can't tell you", "Sunday Field Notes is the weekly letter on what's open, what changed and what the park is doing this week, written on Sundays."],
    bar: "Watching the park on camera? Sunday Field Notes says what changed this week. Free.",
  },
};
const NL_HOOK_DEFAULT_B = {
  mid: ["What's open this week", "A free letter on Sundays: what's open, what's booked out and what changed in Yosemite this week."],
  exit: ["What's open, the Sunday before you go.", "Sunday Field Notes: what's open, what's booked out and what changed in Yosemite this week, from the roads to the river gauges. Free, and you can leave anytime."],
  bar: "Sunday Field Notes: what's open in Yosemite this week, free, every Sunday.",
};
// kind: "mid" | "exit" | "bar". Returns { heading, blurb } (bar: { line }).
// `catOverride` lets an article page pass its own section. `variant` is the
// nl_valueprop arm ("a" control, the default; "b" concrete utility); callers
// resolve it with nlValueProp() and pass it, so this stays pure.
function nlHookCopy(kind, route, catOverride, variant) {
  const isB = variant === "b";
  const catTable = isB ? NL_HOOK_CAT_B : NL_HOOK_CAT;
  const routeTable = isB ? NL_HOOK_ROUTE_B : NL_HOOK_ROUTE;
  const defaults = isB ? NL_HOOK_DEFAULT_B : NL_HOOK_DEFAULT;
  const cat = catOverride || nlRouteCat(route);
  const s = nlSeason();
  const byCat = catTable[cat] || null;
  const byRoute = (!byCat && routeTable[route]) || null;
  if (kind === "bar") {
    const line = (byCat && byCat.bar) || (byRoute && byRoute.bar) || defaults.bar;
    return { line: line.replace("{s}", s) };
  }
  const specific = (byCat && byCat[kind]) || (byRoute && byRoute[kind]);
  if (!specific) return { heading: defaults[kind][0], blurb: defaults[kind][1] };
  const blurb = specific[1] + " " + NL_SEASON_LINE[s] + (kind === "exit" ? " " + NL_LETTER_TAIL : "");
  return { heading: specific[0], blurb };
}
window.nlHookCopy = nlHookCopy;
// Compound Buttondown tag, the same shape as the end-of-article unit's: the
// placement and, on an article, its section in one value.
function nlHookTag(placement, cat) { return cat ? `${placement}-${cat}` : placement; }
window.nlHookTag = nlHookTag;

// ============================================================
// Exit-intent newsletter modal, mounted once in app.jsx. Desktop only: the
// trigger is the cursor leaving through the top of the window, toward the
// browser chrome. Touch devices get no exit popup (the scroll bar below is
// their hook); there is no scroll or back-button fallback. Rules: not before
// 20 seconds on the page, once per 14 days (tfg.nl.exit.seen), once per
// session and never after the scroll bar has shown this session, never once
// subscribed (tfg.nl.subscribed), never on NL_POPUP_EXCLUDED routes. The copy
// follows the page (nlHookCopy). location and tag are unchanged, so the
// placement keeps its analytics history.
// ============================================================
const EXIT_COOLDOWN_DAYS = 14;
const EXIT_MIN_DWELL_MS = 20000;

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

function ExitIntentNewsletter({ disabled, route }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(null); // null | "api" | "tab"
  const firedRef = useRef(false);
  const copyRef = useRef(null); // the copy is chosen once, at the moment it opens
  const variantRef = useRef(""); // the nl_valueprop value, chosen with the copy

  // `route` is in the deps so the dwell clock restarts on each SPA navigation:
  // 20 seconds on the page the reader is leaving, not on the site.
  useEffect(() => {
    if (disabled || firedRef.current) return;
    // Desktop pointers only. A touch device has no exit signal worth the name.
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const mountedAt = Date.now();

    const onMouseOut = (e) => {
      if (firedRef.current || !(e.clientY <= 0 && !e.relatedTarget)) return;
      if (Date.now() - mountedAt < EXIT_MIN_DWELL_MS) return;
      // Re-read every gate at the moment of exit: the reader may have
      // subscribed, or the scroll bar may have shown, since this page loaded.
      if (isSubscribed() || nlDaysSince("tfg.nl.exit.seen") < EXIT_COOLDOWN_DAYS) return;
      if (nlHookSessionGet()) return; // the bar (or this modal) already showed this session
      firedRef.current = true;
      nlHookSessionSet("exit");
      window.safeStorage.set("tfg.nl.exit.seen", new Date().toISOString());
      const arm = nlValueProp();
      variantRef.current = nlValuePropVariant(arm);
      copyRef.current = nlHookCopy("exit", route, undefined, arm);
      if (window.track) window.track("newsletter_exit_intent_shown", { location: "article_exit_intent", tag: "exit-intent", variant: variantRef.current });
      trackNewsletterImpression("article_exit_intent", "exit-intent", variantRef.current);
      setOpen(true);
    };

    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, [disabled, route]);

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

  // Land on Close, not the email input: this modal interrupts, and the reader
  // should choose to type.
  const dialogRef = useModalFocus(open, ".nlmodal__close");

  if (!open) return null;
  const copy = copyRef.current || nlHookCopy("exit", route);

  return (
    <div className="nlmodal" role="dialog" aria-modal="true" aria-label="Subscribe to Sunday Field Notes">
      <div className="nlmodal__backdrop" onClick={() => setOpen(false)} />
      <div className="nlmodal__card" ref={dialogRef}>
        <button type="button" className="nlmodal__close" aria-label="Close" onClick={() => setOpen(false)}>✕</button>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>Before you go</div>
        <h3>{copy.heading}</h3>
        <p>{copy.blurb}</p>
        {done ? (
          <p className="nlbox__done" role="status">{nlDoneLine(done)}</p>
        ) : (
          <>
            <NewsletterForm location="article_exit_intent" tag="exit-intent" variant={variantRef.current} onDone={setDone} />
            <LatestLetter location="article_exit_intent" />
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// NewsletterBar: the slim scroll-depth signup bar, mounted once in app.jsx
// beside ExitIntentNewsletter and independent of the masthead. It is fixed to
// the bottom edge and enters with a transform, so it never moves content (no
// CLS). Why the bottom: the top edge already belongs to the compact bar and,
// on /stay, to the booking bar; the bottom belongs to the thumb, which is
// where a phone reader taps. On a phone it is one compact row (the line, a
// "Sign up" button, a close) and the email field opens inside the same fixed
// box on tap, so it never covers more than one row until asked. It parks out
// of sight while a page's own letter unit is on screen or the reader is at
// the foot of the page, so it never doubles an ask or sits over the footer.
// Rules: only on NL_BAR_ROUTES, article and section pages (nlBarAllowed);
// after 50% scroll depth and 15 seconds on the page; not subscribed; not
// within 14 days of a dismissal (tfg.nl.bar.dismissed) or 3 days of the last
// time it showed (tfg.nl.bar.seen); not after the exit modal showed this
// session; and not at all where storage is blocked, because the caps could not
// be kept. location scroll_bar, tag scroll-bar.
// ============================================================
const BAR_DISMISS_DAYS = 14;
const BAR_REPEAT_DAYS = 3;
const BAR_MIN_DWELL_MS = 15000;
const BAR_SCROLL_DEPTH = 0.5;

function NewsletterBar({ route }) {
  const allowed = window.nlBarAllowed(route);
  const [phase, setPhase] = useState("idle"); // idle | shown | closed
  const [entered, setEntered] = useState(false);
  const [parked, setParked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState(null);
  const copyRef = useRef(null);
  const variantRef = useRef(""); // the nl_valueprop value, chosen with the copy
  const barRef = useRef(null);
  const inputWrapRef = useRef(null);
  const shownRef = useRef(false);

  // Trigger: scroll depth plus dwell, armed afresh for each page.
  useEffect(() => {
    if (!allowed || shownRef.current || phase !== "idle") return;
    if (!nlStorageWorks()) return; // the caps could not be kept, so do not ask
    if (isSubscribed()) return;
    const mountedAt = Date.now();
    let raf = 0;
    const check = () => {
      raf = 0;
      if (shownRef.current || Date.now() - mountedAt < BAR_MIN_DWELL_MS) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // A page shorter than two screens has no depth worth reading as intent.
      if (max < window.innerHeight || window.scrollY / max < BAR_SCROLL_DEPTH) return;
      if (isSubscribed() || nlHookSessionGet()) return;
      if (nlDaysSince("tfg.nl.bar.dismissed") < BAR_DISMISS_DAYS || nlDaysSince("tfg.nl.bar.seen") < BAR_REPEAT_DAYS) return;
      shownRef.current = true;
      nlHookSessionSet("bar");
      window.safeStorage.set("tfg.nl.bar.seen", new Date().toISOString());
      const arm = nlValueProp();
      variantRef.current = nlValuePropVariant(arm);
      copyRef.current = nlHookCopy("bar", route, undefined, arm);
      if (window.track) window.track("newsletter_bar_shown", { location: "scroll_bar", tag: "scroll-bar", variant: variantRef.current });
      trackNewsletterImpression("scroll_bar", "scroll-bar", variantRef.current);
      setPhase("shown");
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    // The dwell timer also checks once, for a reader who scrolled first and stopped.
    const timer = setTimeout(onScroll, BAR_MIN_DWELL_MS + 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [allowed, route, phase]);

  // Entrance: mount off-screen, then add the class a frame later so the
  // transform transition runs.
  useEffect(() => {
    if (phase !== "shown") return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Leaving an allowed page (SPA navigation to a checkout-like or excluded
  // route) removes the bar rather than carrying it along.
  useEffect(() => {
    if (phase === "shown" && !allowed) setPhase("closed");
  }, [allowed, phase]);

  // Park while a letter unit is on screen or the reader is at the page foot.
  useEffect(() => {
    if (phase !== "shown") return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      let hide = max > 0 && max - window.scrollY < 120;
      if (!hide) {
        const units = document.querySelectorAll(".nlbox, .softgate, .hp-letter, .nlmid");
        for (const u of units) {
          const r = u.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) { hide = true; break; }
        }
      }
      setParked(hide);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [phase]);

  // Tells BackToTop's stylesheet rule to ride above the bar while it is up.
  const visible = phase === "shown" && entered && !parked;
  useEffect(() => {
    if (!visible) return;
    document.documentElement.setAttribute("data-nl-bar", "");
    return () => document.documentElement.removeAttribute("data-nl-bar");
  }, [visible]);

  const dismiss = (how) => {
    if (!done) window.safeStorage.set("tfg.nl.bar.dismissed", new Date().toISOString());
    if (window.track) window.track("newsletter_bar_dismiss", { location: "scroll_bar", tag: "scroll-bar", how, variant: variantRef.current });
    setPhase("closed");
  };

  // Escape dismisses when focus is in the bar or nowhere in particular; with
  // focus in a menu or dialog Escape belongs to that.
  useEffect(() => {
    if (phase !== "shown") return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      const active = document.activeElement;
      const inBar = barRef.current && barRef.current.contains(active);
      if (inBar || !active || active === document.body) dismiss("escape");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // A signed-up reader sees the confirmation for a few seconds, then it goes.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setPhase("closed"), 6000);
    return () => clearTimeout(t);
  }, [done]);

  if (phase !== "shown") return null;
  const copy = copyRef.current || nlHookCopy("bar", route);
  const open = () => {
    setExpanded(true);
    if (window.track) window.track("newsletter_bar_expand", { location: "scroll_bar", tag: "scroll-bar", variant: variantRef.current });
    // The field exists only once expanded; focus it on the next frame.
    requestAnimationFrame(() => {
      const input = inputWrapRef.current && inputWrapRef.current.querySelector("input[type=email]");
      if (input) input.focus();
    });
  };

  return (
    <div
      ref={barRef}
      className={["nlbar", entered && !parked ? "is-in" : "", expanded ? "is-expanded" : ""].filter(Boolean).join(" ")}
      role="region"
      aria-label="Subscribe to Sunday Field Notes"
    >
      <div className="nlbar__inner">
        {done ? (
          <p className="nlbar__text nlbar__done" role="status">{nlDoneLine(done)}</p>
        ) : (
          <>
            <p className="nlbar__text">{copy.line}</p>
            <button type="button" className="nlbar__open" aria-expanded={expanded} onClick={open}>Sign up</button>
            <div className="nlbar__form" ref={inputWrapRef}>
              <NewsletterForm location="scroll_bar" tag="scroll-bar" variant={variantRef.current} cta="Subscribe →" className="nlbar__fields" onDone={setDone} />
            </div>
          </>
        )}
        <button type="button" className="nlbar__close" aria-label="Close the Sunday Field Notes signup" onClick={() => dismiss("close")}>✕</button>
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
  const draggedRef = useRef(false);
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
    dragRef.current = { x: e.clientX - tx, y: e.clientY - ty, sx: e.clientX, sy: e.clientY };
    draggedRef.current = false;
    setGrabbing(true);
  };
  const onMouseMove = (e) => {
    if (!dragRef.current) return;
    if (Math.abs(e.clientX - dragRef.current.sx) + Math.abs(e.clientY - dragRef.current.sy) > 3) draggedRef.current = true;
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
    // mouseup ends the drag (clearing dragRef) before the click fires, so the
    // pan is remembered separately; otherwise every pan ends by resetting zoom.
    if (draggedRef.current) { draggedRef.current = false; return; }
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
  // `optIn`: rendered only when named in `only` (/webcams' high-country section),
  // so the default strip on the homepage, /conditions and /webcams stays four.
  { label: "High Sierra",    img: "sentinel-t.jpg",   href: "https://yosemite.org/webcams/high-sierra/",    alt: "Live view east from about 8,000 feet toward Half Dome, Clouds Rest and the Tuolumne high country", optIn: true },
];

// `variant="board"` is the /conditions treatment: two large tiles per row with
// the caption on a rule under each, and a standing LIVE mark over the frame.
// The mark carries no timestamp on purpose. Nothing here reads the capture
// time off the camera, and a clock drawn from the reader's own device would be
// asserting a freshness this component has not checked. Default is the four-up
// strip, which /webcams still mounts. `only` is an optional list of labels
// that picks cameras and sets their order (/firefall shows El Capitan, its
// water check, then Half Dome, its cloud check); omitted, the four non-`optIn`
// cameras render.
function WebcamStrip({ variant, only }) {
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
        {(only ? only.map((l) => WEBCAMS.find((c) => c.label === l)).filter(Boolean) : WEBCAMS.filter((c) => !c.optIn)).map(cam => (
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
                <span className="cam-tile__open">Open camera ↗</span>
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
// The field-journal kit (September 2026 text-page pass, DESIGN_AUDIT.md).
// The pieces the prose pages share so a long page reads like the homepage
// rather than a single column: a numbered section index, a figure strip, a
// pull quote, a ridgeline divider and an index-card aside. Every class is
// `fj-` and new, because /styles.css is also the Nature Notes archive's
// stylesheet and nothing here may reach it.
// ============================================================

// The headings the index lists and the numerals count. One selector for
// both, so the index's "03" and the heading's "03" can never disagree.
// data-fj-skip keeps a heading out (a card's own h2 inside the column).
const FJ_HEADINGS = ".prose h2:not([data-fj-skip]), .fj-h";

function fjSlug(text) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "section";
}
const fjPad = (n) => String(n).padStart(2, "0");
const FJ_ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

// The reading column with its section index. From 1100px the index is a
// sticky rail on the left with scroll-spy; below that it is an "On this
// page" disclosure over the text. Headings keep any id they already carry
// (pages are deep-linked); the others get one from their text. `numbered`
// sets the CSS-counter numeral over each heading.
function FjLayout({ children, numbered = true, marks = "numeric", label = "On this page", className }) {
  const colRef = React.useRef(null);
  const [items, setItems] = React.useState([]);
  const [active, setActive] = React.useState(null);

  React.useLayoutEffect(() => {
    const col = colRef.current;
    if (!col) return undefined;
    const heads = Array.from(col.querySelectorAll(FJ_HEADINGS));
    const taken = new Set();
    setItems(heads.map((h) => {
      if (!h.id) {
        let id = "s-" + fjSlug(h.textContent);
        for (let n = 2; taken.has(id) || document.getElementById(id); n++) id = "s-" + fjSlug(h.textContent) + "-" + n;
        h.id = id;
      }
      taken.add(h.id);
      // A heading that numbers itself ("3. How we use it") lends its number
      // to the index numeral instead of printing it twice.
      const text = h.textContent.trim();
      const own = /^(\d+)\.\s+(.*)$/.exec(text);
      return own ? { id: h.id, label: own[2], num: +own[1] } : { id: h.id, label: text };
    }));
    let raf = 0;
    const spy = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let current = null;
      for (const h of heads) { if (h.getBoundingClientRect().top <= line) current = h.id; else break; }
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(spy); };
    spy();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // In-page jumps scroll without touching the router: a bare "#id" click
  // would fire popstate, which app.jsx treats as a navigation.
  const jump = (e, id) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    try { history.replaceState(history.state, "", "#" + id); } catch (err) { /* sandboxed frames */ }
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };
  const list = (
    <ol>
      {items.map((it, i) => (
        <li key={it.id}>
          <a href={"#" + it.id} aria-current={active === it.id ? "location" : undefined} onClick={(e) => jump(e, it.id)}>
            {marks !== "none" && <span aria-hidden="true">{marks === "roman" ? FJ_ROMAN[i] || i + 1 : fjPad(it.num || i + 1)}</span>}{it.label}
          </a>
        </li>
      ))}
    </ol>
  );
  const many = items.length > 2;

  return (
    <div className={["hp-wrap", "fj-layout", numbered ? "fj-numbered" : null, className].filter(Boolean).join(" ")}>
      <nav className="fj-index" aria-label={label}>
        {many && <React.Fragment><p className="hp-eyebrow">{label}</p>{list}</React.Fragment>}
      </nav>
      <div className="fj-column" ref={colRef}>
        {many && (
          <details className="fj-toc">
            <summary><span className="hp-eyebrow">{label}</span><span className="fj-toc__count">{items.length} sections</span></summary>
            {list}
          </details>
        )}
        {children}
      </div>
    </div>
  );
}

// A strip of figures: a big serif value over a tracked label. The values
// restate what the page already prints; `tone="ink"` is the dark band.
function FjFacts({ items, tone, className, label }) {
  return (
    <dl className={["fj-facts", tone ? "fj-facts--" + tone : null, className].filter(Boolean).join(" ")} aria-label={label}>
      {items.map((it) => (
        <div key={it.label}>
          <dt>{it.label}</dt>
          <dd>{it.value}{it.note && <small>{it.note}</small>}</dd>
        </div>
      ))}
    </dl>
  );
}

// A pull quote: a sentence the page already says, set large. Hidden from
// assistive tech, which has just read it in the text. `side` hangs it in the
// right margin on wide screens.
function FjPull({ children, cite, side }) {
  return (
    <div className={"fj-pull" + (side ? " fj-pull--side" : "")} aria-hidden="true">
      <p>{children}</p>
      {cite && <span>{cite}</span>}
    </div>
  );
}

// The section divider: Half Dome's profile on a ridgeline, between rules.
function FjRidge() {
  return (
    <div className="fj-ridge" aria-hidden="true">
      <svg viewBox="0 0 240 48" width="240" height="48" focusable="false">
        <path className="fj-ridge__far" d="M0 46 L30 40 L52 42 L70 34 L88 38 L100 32 L112 36 L124 30" />
        <path className="fj-ridge__dome" d="M84 46 L98 40 L110 32 C 116 20, 128 9, 144 7 C 156 6, 164 9, 167 15 L 168 46 Z" />
        <path className="fj-ridge__far" d="M168 30 L180 33 L192 28 L206 36 L222 38 L240 46" />
        <path className="fj-ridge__cables" d="M121 23 C 128 15, 136 10, 144 9" />
      </svg>
    </div>
  );
}

// The field card: an index card for a head's aside. `rows` are label and
// value pairs from the page's own copy; `stamp` is the round postmark.
function FjCard({ eyebrow, title, rows, stamp, foot, children, className }) {
  return (
    <div className={["fj-card", className].filter(Boolean).join(" ")}>
      {stamp && <span className="fj-card__stamp" aria-hidden="true">{stamp}</span>}
      {eyebrow && <p className="hp-eyebrow">{eyebrow}</p>}
      {title && <p className="fj-card__title">{title}</p>}
      {rows && (
        <dl>
          {rows.map((r) => (
            <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>
          ))}
        </dl>
      )}
      {children}
      {foot && <p className="fj-card__foot">{foot}</p>}
    </div>
  );
}

// The head's photo plate, with the homepage figure's caption line, and an
// optional field card laid over its lower corner (`card`). The image is the
// page's LCP, so it loads eagerly.
function FjPlate({ image, alt, label, credit, card, className }) {
  return (
    <div className={["fj-headart", card ? "fj-headart--card" : null, className].filter(Boolean).join(" ")}>
      <figure className="fj-plate">
        <ResponsiveImage image={image} alt={alt} eager sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 50vw, 620px" />
        {(label || credit) && <figcaption>{label}{credit && <span>{credit}</span>}</figcaption>}
      </figure>
      {card}
    </div>
  );
}

// Steps as a numbered timeline down a rule: `steps` are {title, text}.
function FjSteps({ steps, className }) {
  return (
    <ol className={["fj-steps", className].filter(Boolean).join(" ")}>
      {steps.map((s, i) => (
        <li key={i}>
          <span className="fj-steps__n" aria-hidden="true">{fjPad(i + 1)}</span>
          <div>{s.title && <strong>{s.title}</strong>}{s.text && <p>{s.text}</p>}</div>
        </li>
      ))}
    </ol>
  );
}

// ============================================================
// The Field Guide app's origin, for HpGuideBand's free-preview line.
// ============================================================
const GUIDE_PROMO_APP_BASE =
  (typeof window !== "undefined" && window.GUIDE_APP_BASE) ||
  "https://guide.thetalusfieldjournal.com";


// ============================================================
// Yosemite Nature Notes films. A click-to-load facade: only the
// YouTube thumbnail (i.ytimg.com, covered by img-src) loads until the
// reader presses play, then a youtube-nocookie.com iframe (frame-src)
// replaces it. No YouTube script runs before that click. Shared by
// /films, the event pages and article bodies (moved here from
// page-films.jsx in the September 2026 visual pass).
//
// `ep` needs { id, title, youtubeId }. A youtubeId must be one already
// verified in videos-data.js; never type a new one from memory.
// ============================================================
function FilmEmbed({ ep, location }) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef(null);

  // After the swap, move focus into the player so a keyboard user who
  // activated the facade button is not left focused on a removed element.
  useEffect(() => {
    if (playing && frameRef.current) frameRef.current.focus();
  }, [playing]);

  if (playing) {
    return (
      <div className="film__frame">
        <iframe
          ref={frameRef}
          src={`https://www.youtube-nocookie.com/embed/${ep.youtubeId}?autoplay=1&rel=0`}
          title={`Yosemite Nature Notes: ${ep.title}`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="film__facade"
      onClick={() => {
        if (window.track) window.track("film_play", { film_id: ep.id, film_title: ep.title, location: location || "films" });
        setPlaying(true);
      }}
    >
      {/* Named by a hidden line rather than aria-label, so nothing visible is
          left out of the name. */}
      <span className="hp-sr-only">Play film: {ep.title}</span>
      {/* hqdefault is 4:3 with letterbox bars; the 16:9 facade crops them via object-fit. */}
      <img
        className="film__thumb"
        src={`https://i.ytimg.com/vi/${ep.youtubeId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
      <span className="film__play" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="56" height="56">
          <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M26 21 L46 32 L26 43 Z" fill="currentColor" />
        </svg>
      </span>
    </button>
  );
}

// One film as a captioned figure, for a page section or an article body.
// The caption names the series and the Park Service, since the films are
// theirs and the note under them is ours. Mirrored as a static stub in
// scripts/gen-prerender.mjs (a link to the watch page, no iframe).
function NatureNotesFilm({ id, title, youtubeId, episode, note, location, className }) {
  const ep = { id, title, youtubeId };
  return (
    <figure className={["nn-film", className].filter(Boolean).join(" ")}>
      <FilmEmbed ep={ep} location={location || "article"} />
      <figcaption className="nn-film__cap">
        <span className="nn-film__kicker">
          Yosemite Nature Notes{episode != null ? ` · Episode ${episode}` : ""}
        </span>
        <strong className="nn-film__title">{title}</strong>
        {note && <span className="nn-film__note">{note}</span>}
        <span className="nn-film__credit">
          Film: National Park Service. Nothing loads from YouTube until you press play.
        </span>
      </figcaption>
    </figure>
  );
}


// ============================================================
// Event-page icons (September 2026 visual pass). The line set the
// /firefall redesign drew as FfIcon, shared so /tioga-opening,
// /half-dome-lottery and /itineraries speak the same visual language.
// Stroke only, currentColor, drawn on a 24px grid to survive 18px.
// Rendered with the `ff-icon` class, which the .hp-event layer sizes.
// ============================================================
const EVENT_ICON_PATHS = {
  drop: <path d="M12 3c3 4.5 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.5 6-11z" />,
  cloud: <path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 11 3.5 3.5 0 0 0 7 18z" />,
  sun: <React.Fragment><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></React.Fragment>,
  walk: <React.Fragment><circle cx="13" cy="4" r="2" /><path d="M9 21l2-6 3 3v3M8 11l3-4 3 2 3 1M11 7l-1 5" /></React.Fragment>,
  car: <React.Fragment><path d="M4 16V11l2-5h12l2 5v5M4 16h16M4 16v2M20 16v2" /><circle cx="7.5" cy="13.5" r="1" /><circle cx="16.5" cy="13.5" r="1" /></React.Fragment>,
  bed: <React.Fragment><path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3" /><circle cx="7" cy="10.5" r="1.5" /></React.Fragment>,
  clock: <React.Fragment><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></React.Fragment>,
  therm: <path d="M14 14V5a2 2 0 0 0-4 0v9a4 4 0 1 0 4 0z" />,
  alert: <React.Fragment><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></React.Fragment>,
  no: <React.Fragment><circle cx="12" cy="12" r="9" /><path d="M6 6l12 12" /></React.Fragment>,
  pin: <React.Fragment><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></React.Fragment>,
  check: <path d="M4 12l5 5L20 6" />,
  fuel: <React.Fragment><path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14M5 10h10" /><path d="M15 8l3 3v6a1.5 1.5 0 0 0 3 0V9l-3-3" /></React.Fragment>,
  snow: <React.Fragment><path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17" /><path d="M9.5 3.5L12 5l2.5-1.5M9.5 20.5L12 19l2.5 1.5" /></React.Fragment>,
  signal: <React.Fragment><path d="M4 20h.01M9 20v-4M14 20v-8M19 20V8" /><path d="M3 3l18 18" /></React.Fragment>,
  food: <React.Fragment><path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v5a2 2 0 0 0 4 0V3" /><path d="M17 21V3c-2 1.5-3 4-3 7v4h3" /></React.Fragment>,
  ticket: <React.Fragment><path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 0 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 1 0-4V6H3z" /><path d="M14 6v12" strokeDasharray="2 2" /></React.Fragment>,
  calendar: <React.Fragment><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></React.Fragment>,
  mountain: <path d="M2 20l7-12 4 6 3-4 6 10z" />,
  dome: <React.Fragment><path d="M3 20h18" /><path d="M5 20c0-8 3-13 8-13 3 0 5 3 5 6v7" /></React.Fragment>,
  id: <React.Fragment><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M6 16c.6-1.5 1.8-2 3-2s2.4.5 3 2M14 10h4M14 13h3" /></React.Fragment>,
  route: <React.Fragment><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7" /></React.Fragment>,
  camera: <React.Fragment><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></React.Fragment>,
  users: <React.Fragment><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.3" /><path d="M16 14.2c2.7.4 5 2.6 5 5.8" /></React.Fragment>,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  lake: <React.Fragment><path d="M3 15c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M3 19c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" /><path d="M5 12l4-6 3 4 2-2 4 4" /></React.Fragment>,
  eye: <React.Fragment><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /></React.Fragment>,
  tree: <React.Fragment><path d="M12 3l6 9h-3l4 6H5l4-6H6z" /><path d="M12 18v3" /></React.Fragment>,
};
function EventIcon({ name, size = 22, className }) {
  return (
    <svg className={["ff-icon", className].filter(Boolean).join(" ")} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {EVENT_ICON_PATHS[name] || <circle cx="12" cy="12" r="3" />}
    </svg>
  );
}

// Expose
Object.assign(window, {
  Placeholder, ResponsiveImage, preloadResponsive,
  SIZES_HERO, SIZES_CARD,
  MotifMountains, MotifSun, MotifTrees,
  Header, Footer, BackToTop, NewsletterInline, NewsletterForm, SoftGate, ExitIntentNewsletter, NewsletterBar, MapLightbox,
  EntranceWaits, WebcamStrip, FilmEmbed, NatureNotesFilm, EventIcon,
  HomeLink, HomeMasthead, HpHeading, HpRow, HpCard, HpArticleCard, HpPageHead, HpGuideBand, HpLetter, HpPostcard,
  FjLayout, FjFacts, FjPull, FjRidge, FjCard, FjSteps, FjPlate,
});

// "October 10, 2026" for a YYYY-MM-DD string, read as a calendar date (noon
// UTC, formatted in UTC, so no reader's timezone moves it a day). Verified
// and checked stamps printed the raw ISO date ("Verified 2026-10-10") in
// reader copy. Anything that is not an ISO date passes through.
function hpLongDate(iso) {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
window.hpLongDate = hpLongDate;
