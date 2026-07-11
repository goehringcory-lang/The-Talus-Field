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
// any fetch or parse problem and the masthead renders without it.
// ============================================================
const WAITS_BASE = "https://npsvms-338365424831-us-west-1-an.s3.us-west-1.amazonaws.com/yose/transit-time/display/public/";
const WAITS_URL = WAITS_BASE + "waits.json";
const WAITS_PAGE_URL = WAITS_BASE + "index.html";
const WAITS_REFRESH_MS = 5 * 60 * 1000;
// Short labels for the masthead; unknown pairs fall back to the
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
  // the sticky masthead does not shift when the waits populate after first paint.
  // The placeholder carries the same .masthead__waits min-width as the filled
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
// Masthead
// ============================================================
function Header({ current, go }) {
  const primaryNavItems = [
    ["articles", "Articles"],
    ["kit", "Kit"],
    ["films", "Films"],
    ["places", "Directory"],
    ["about", "About"],
  ];
  const overflowNavItems = [
    ["newsletter", "Newsletter"],
    ["contact", "Contact"],
  ];
  const navItems = [...primaryNavItems, ...overflowNavItems];

  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  // A/B (mobile_cta): bucket "b" shows a persistent "The Map" CTA in the
  // masthead. On mobile the inline nav collapses to the hamburger, leaving no
  // visible path to the funnel; this fills that gap. The map is browsable free
  // and its trip builder is the newsletter gate, so it is the softest on-ramp.
  const [ctaVariant] = React.useState(() => window.abVariant("mobile_cta"));
  React.useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  const renderLink = (key, label, { baseClass, role, onNavigate } = {}) => (
    <a
      key={key}
      role={role}
      href={window.routeToPath ? window.routeToPath(key) : `/${key}`}
      className={[baseClass, current === key && "is-active"].filter(Boolean).join(" ")}
      onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate(); go(key); }}
    >{label}</a>
  );

  const todayFull = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  const todayShort = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric"
  });
  return (
    <header className="masthead">
      <div className="masthead__top">
        <div className="masthead__dateline">
          <span className="masthead__vol">{(window.SITE && window.SITE.issue) || "Vol. III"}</span>
          <span className="masthead__date masthead__date--full">{todayFull}</span>
          <span className="masthead__date masthead__date--short">{todayShort}</span>
        </div>
        <div className="masthead__utility">
          <div className="masthead__weather">
            <span className="masthead__weather-label">Conditions</span>
            <a href="https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936" target="_blank" rel="noopener noreferrer">Valley</a>
            <span className="masthead__weather-sep">·</span>
            <a href="https://forecast.weather.gov/MapClick.php?lat=37.8731&lon=-119.3503" target="_blank" rel="noopener noreferrer">Tuolumne</a>
            <span className="masthead__weather-sep">·</span>
            <a href="https://forecast.weather.gov/MapClick.php?lat=37.5341&lon=-119.6315" target="_blank" rel="noopener noreferrer">Wawona</a>
          </div>
          <EntranceWaits />
          <a className="masthead__guide" href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">Yosemite Guide ↗</a>
        </div>
      </div>
      <div className="masthead__main">
        <a
          className="brand-block"
          href="/"
          onClick={(e) => { e.preventDefault(); go("home"); }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <img className="brand__mark" src="img/talus-field-mark.png" alt="The Talus Field" loading="eager" />
          <span className="brand-block__text">
            <span className="brand">The Talus Field</span>
            <span className="brand__sub">A field journal of Yosemite</span>
          </span>
        </a>
        <nav className="nav">
          {primaryNavItems.map(([key, label]) => renderLink(key, label, { baseClass: "nav__link" }))}

          {ctaVariant === "b" && (
            <a
              className="nav__primary"
              href={window.routeToPath ? window.routeToPath("map") : "/map"}
              onClick={(e) => {
                e.preventDefault();
                if (window.track) window.track("cta_click", { location: "masthead_cta", target: "map", variant: ctaVariant });
                go("map");
              }}
            >The Map</a>
          )}

          <div className="nav__menu-wrap" ref={menuRef}>
            <button
              type="button"
              className="nav__menu-toggle"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="Menu"
              onClick={() => setMenuOpen(o => !o)}
            >
              <span className="nav__menu-bars" aria-hidden="true">
                <span></span><span></span><span></span>
              </span>
            </button>
            {menuOpen && (
              <div className="nav__menu" role="menu">
                {navItems.map(([key, label]) => renderLink(key, label, { role: "menuitem", onNavigate: () => setMenuOpen(false) }))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

// ============================================================
// Site footer
// ============================================================
function Footer({ go }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div className="site-footer__about">
            <div className="site-footer__masthead">The Talus Field</div>
            <div className="site-footer__sub">A field journal of Yosemite</div>
            <p>Notes on a single park, kept slowly. Updated when something is worth saying.</p>
          </div>
          <div>
            <h4>Sections</h4>
            <ul>
              {window.CATEGORIES.map(c => (
                <li key={c.slug}>
                  <a href={`/section/${c.slug}`} onClick={(e) => { e.preventDefault(); go(`cat:${c.slug}`); }}>{c.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Site</h4>
            <ul>
              <li><a href="/about" onClick={(e) => { e.preventDefault(); go("about"); }}>About</a></li>
              <li><a href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>All articles</a></li>
              <li><a href="/kit" onClick={(e) => { e.preventDefault(); go("kit"); }}>Kit</a></li>
              <li><a href="/films" onClick={(e) => { e.preventDefault(); go("films"); }}>Films</a></li>
              <li><a href="/places" onClick={(e) => { e.preventDefault(); go("places"); }}>Directory</a></li>
              <li><a href="/map" onClick={(e) => { e.preventDefault(); go("map"); }}>The Map</a></li>
              {/* GUIDE-LAUNCH: restore the Field Guide footer link here:
                  <li><a href="/guide" onClick={(e) => { e.preventDefault(); window.track && window.track("guide_cta_click", { location: "footer_guide_link" }); go("guide"); }}>Field Guide</a></li> */}
              <li><a href="/newsletter" onClick={(e) => { e.preventDefault(); go("newsletter"); }}>Newsletter</a></li>
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="/privacy" onClick={(e) => { e.preventDefault(); go("privacy"); }}>Privacy</a></li>
              <li><a href="/terms" onClick={(e) => { e.preventDefault(); go("terms"); }}>Terms</a></li>
              <li><a href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>Affiliate disclosure</a></li>
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__disclosure">
          Some links on this site are affiliate links. If you book or buy through one, The Talus Field may earn a small commission at no extra cost to you. <a href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>Full disclosure here.</a>
        </div>
        <div className="site-footer__legal">
          <div>© 2026 The Talus Field. Independent. Not affiliated with the National Park Service.</div>
          <div>
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
// Affiliate note
// ============================================================
// End-of-article disclosure for any body that carries inline affiliate
// links, per the convention stated on the /affiliate page. The /affiliate
// href is a plain link; the app.jsx SPA router intercepts it like the
// /articles/* links inside bodies. Rendered as the last element of a body.
function AffiliateNote() {
  return (
    <p className="article-aff-note">
      Some links in this piece are affiliate links to Patagonia. If you buy through one, The Talus Field may earn a small commission at no extra cost to you. <a href="/affiliate">Full disclosure.</a>
    </p>
  );
}
window.AffiliateNote = AffiliateNote;

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
function NewsletterInline({ heading, blurb, location, tag, incentive, abTest, variant: variantProp }) {
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
      <div className="nlbox nlbox--subscribed" ref={ref}>
        <p className="nlbox__already">You're on the list. <a href="/map">The interactive map is open to you →</a></p>
      </div>
    );
  }

  return (
    <div className="nlbox" ref={ref}>
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
          <button type="submit">Subscribe →</button>
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

function ExitIntentNewsletter({ disabled }) {
  const [open, setOpen] = useState(false);
  // A/B (exit_copy): bucket "b" leads with the free-map unlock, the strongest
  // reason to subscribe, instead of the low-urgency cadence framing. Read once
  // on mount so the impression and the rendered copy use the same arm.
  const [variant] = useState(() => window.abVariant("exit_copy"));
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
      if (window.track) window.track("newsletter_exit_intent_shown", { location: "article_exit_intent", tag: "exit-intent", variant });
      trackNewsletterImpression("article_exit_intent", "exit-intent", variant);
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
  }, [disabled, variant]);

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

  if (!open) return null;

  return (
    <div className="nlmodal" role="dialog" aria-modal="true" aria-label="Subscribe to Sunday Field Notes">
      <div className="nlmodal__backdrop" onClick={() => setOpen(false)} />
      <div className="nlmodal__card">
        <button type="button" className="nlmodal__close" aria-label="Close" onClick={() => setOpen(false)}>✕</button>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>Before you go</div>
        {variant === "b" ? (
          <>
            <h3>The interactive map is free for subscribers.</h3>
            <p>Subscribe and the trip builder opens right away: vistas, trailheads, parking turnouts, and places to eat on one map. A short note follows on Sundays.</p>
          </>
        ) : (
          <>
            <h3>One letter a week. Sometimes none.</h3>
            <p>Sunday Field Notes: what is open, what is blooming, and the occasional longer piece. Free, and you can leave anytime.</p>
          </>
        )}
        <form
          className="nlbox__form"
          action="https://buttondown.com/api/emails/embed-subscribe/goehring"
          method="post"
          target="buttondown-target"
          onSubmit={() => { trackNewsletterSubmit("article_exit_intent", "exit-intent", variant); setTimeout(() => setOpen(false), 0); }}
        >
          <input type="email" name="email" placeholder="you@email.com" required />
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

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt || caption || "Map"}>
      <div className="lightbox__backdrop" onClick={onClose} />
      <div className="lightbox__panel">
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

// Expose
Object.assign(window, {
  Placeholder, ResponsiveImage, preloadResponsive,
  SIZES_HERO, SIZES_BODY, SIZES_CARD,
  MotifMountains, MotifSun, MotifTrees,
  Header, Footer, ArticleCard, NewsletterInline, ExitIntentNewsletter, MapLightbox,
});
