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
// Masthead
// ============================================================
function Header({ current, go }) {
  const primaryNavItems = [
    ["articles", "Articles"],
    ["kit", "Kit"],
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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  return (
    <header className="masthead">
      <div className="masthead__top">
        <div>
          <span>{(window.SITE && window.SITE.issue) || "Vol. III"}</span>
          <span>{today}</span>
        </div>
        <div className="masthead__weather">
          <span className="masthead__weather-label">Conditions</span>
          <a href="https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936" target="_blank" rel="noopener noreferrer"><span className="masthead__weather-cityfull">Yosemite </span>Valley</a>
          <span className="masthead__weather-sep">·</span>
          <a href="https://forecast.weather.gov/MapClick.php?lat=37.8731&lon=-119.3503" target="_blank" rel="noopener noreferrer">Tuolumne<span className="masthead__weather-cityfull"> Meadows</span></a>
          <span className="masthead__weather-sep">·</span>
          <a href="https://forecast.weather.gov/MapClick.php?lat=37.5341&lon=-119.6315" target="_blank" rel="noopener noreferrer">Wawona</a>
          <span className="masthead__paper">
            <span className="masthead__paper-label">Current issue</span>
            <a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">Yosemite Guide ↗</a>
          </span>
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
              <li><a href="/places" onClick={(e) => { e.preventDefault(); go("places"); }}>Directory</a></li>
              <li><a href="/guide" onClick={(e) => { e.preventDefault(); window.track && window.track("guide_cta_click", { location: "footer_guide_link" }); go("guide"); }}>Field Guide</a></li>
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
// Article card
// ============================================================
function ArticleCard({ article, go, size }) {
  const cat = window.findCategory(article.cat);
  return (
    <a
      className="card"
      href={`/articles/${article.slug}`}
      onClick={(e) => { e.preventDefault(); go(`a:${article.slug}`); }}
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
function trackNewsletterSubmit(location, tag) {
  if (window.track) window.track("newsletter_signup", { location: location || "unknown", tag: tag || "" });
  try { window.localStorage.setItem("tfg.nl.subscribed", "1"); } catch (_e) {}
}
window.trackNewsletterSubmit = trackNewsletterSubmit;

// Impression counterpart to trackNewsletterSubmit. Fires when a newsletter unit
// scrolls into view so GA4 can compute a view -> signup rate per placement
// (same `location` as the matching submit). No localStorage side effect.
function trackNewsletterImpression(location, tag) {
  if (window.track) window.track("newsletter_impression", { location: location || "unknown", tag: tag || "" });
}
window.trackNewsletterImpression = trackNewsletterImpression;

// Single read-path for the subscribed flag. localStorage can throw in private
// mode, so it is always wrapped.
function isSubscribed() {
  try { return window.localStorage.getItem("tfg.nl.subscribed") === "1"; } catch (_e) { return false; }
}
window.isSubscribed = isSubscribed;

// Fire-once impression hook. Returns a ref to spread onto a unit's outer node;
// the impression fires the first time that node is 40% visible, then the
// observer disconnects. Pass enabled={false} to skip firing (e.g. when the unit
// is rendering its already-subscribed soft state) so conversion-rate
// denominators only count real asks. Falls back to firing immediately where
// IntersectionObserver is unavailable.
function useNewsletterImpression(location, tag, enabled) {
  const ref = useRef(null);
  const firedRef = useRef(false);
  useEffect(() => {
    if (enabled === false) return;
    const node = ref.current;
    if (!node) return;
    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      trackNewsletterImpression(location, tag);
    };
    if (typeof IntersectionObserver === "undefined") { fire(); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { fire(); io.disconnect(); break; }
      }
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, [location, tag, enabled]);
  return ref;
}
window.useNewsletterImpression = useNewsletterImpression;

// ============================================================
// Inline newsletter box. `location` is the unique GA4 identifier for the
// placement; `tag` is the Buttondown segmentation tag for that source.
// ============================================================
function NewsletterInline({ heading, blurb, location, tag, incentive }) {
  const [done, setDone] = useState(false);
  const subscribed = isSubscribed();
  // Lead with the map-planner incentive by default, but never override a
  // caller's explicit blurb (so existing per-placement copy is untouched).
  const showIncentive = incentive !== false && !blurb;
  // Only count an impression when an actual ask is on screen, not the
  // subscribed soft state or the post-submit confirmation.
  const ref = useNewsletterImpression(location, tag, !subscribed && !done);

  if (subscribed && !done) {
    return (
      <div className="nlbox nlbox--subscribed" ref={ref}>
        <p className="nlbox__already">You're on the list. The map planner is in your inbox.</p>
      </div>
    );
  }

  return (
    <div className="nlbox" ref={ref}>
      <h3>{heading || "Sunday Field Notes"}</h3>
      <p>{showIncentive
          ? "Subscribe and get the free printable map planner: parking turnouts, the major stops, and room to mark your own. A short note follows on Sundays."
          : (blurb || "A short note on Sundays, when there is something to say.")}</p>
      {done ? (
        <p style={{ fontFamily: "var(--serif)", fontSize: 17, color: "var(--moss)", margin: 0, padding: "8px 0" }}>
          The map planner is on its way once you confirm. Check your inbox.
        </p>
      ) : (
        <form
          className="nlbox__form"
          action="https://buttondown.com/api/emails/embed-subscribe/goehring"
          method="post"
          target="buttondown-target"
          onSubmit={() => { trackNewsletterSubmit(location, tag); setTimeout(() => setDone(true), 0); }}
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
  const firedRef = useRef(false);

  useEffect(() => {
    if (disabled) return;
    let suppressed = false;
    try {
      if (window.localStorage.getItem("tfg.nl.subscribed") === "1") suppressed = true;
      const seen = window.localStorage.getItem("tfg.nl.exit.seen");
      if (seen) {
        const ageDays = (Date.now() - new Date(seen).getTime()) / 86400000;
        if (ageDays < EXIT_COOLDOWN_DAYS) suppressed = true;
      }
    } catch (_e) {}
    if (suppressed) return;

    const reveal = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      try { window.localStorage.setItem("tfg.nl.exit.seen", new Date().toISOString()); } catch (_e) {}
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

  if (!open) return null;

  return (
    <div className="nlmodal" role="dialog" aria-modal="true" aria-label="Subscribe to Sunday Field Notes">
      <div className="nlmodal__backdrop" onClick={() => setOpen(false)} />
      <div className="nlmodal__card">
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
