/* global React, Header, Footer, ArticleCard, Placeholder, NewsletterInline,
   MotifMountains, MotifSun, MotifTrees, useNewsletterImpression, isSubscribed,
   LodgingCta */
const { useMemo, useState } = React;

// ============================================================
// Above-the-fold hero capture. A single-field subscribe form promising the
// Sunday letter, with the map's trip builder as the bundled unlock, and the
// same impression tracking and subscribed-suppression as NewsletterInline
// (location "home_hero", tag "home"). The map view itself is free since the
// gate rework; the builder is what a signup actually unlocks, so the copy
// says that plainly. Buttondown's embed form takes ONE tag per submission
// (multiple hidden inputs behave like radio buttons — see newsletterTag in
// page-article.jsx), so when the month planner has a selection the
// trip-<month> intent tag replaces the placement tag: the segmentation is
// what the tag is for, and GA4 still carries the placement via
// trackNewsletterSubmit.
// July 2026 prominence pass: the capture renders as a framed, moss-spined
// unit (.hero__capture-box) with the promise copy above the field and a
// solid submit button, instead of the old borderless one-liner. The nav
// simplification pass then made the plan/conditions buttons the hero's
// primary ask, so the capture sits last in the column on every viewport
// (the old ≤720px reorder above the doors is gone).
// ============================================================
function HomeHeroCapture({ tripMonth }) {
  const [done, setDone] = useState(false);
  const subscribed = isSubscribed();
  const ref = useNewsletterImpression("home_hero", "home", !subscribed && !done);

  if (subscribed && !done) {
    return (
      <p className="hero__capture-note" ref={ref}>
        You're on the list. <a href="/map">The trip planner map is open to you →</a>
      </p>
    );
  }

  if (done) {
    return (
      <p className="hero__capture-note" ref={ref}>
        You're in. <a href="/map">The map is open to you →</a>
      </p>
    );
  }

  return (
    <div className="hero__capture-box" ref={ref}>
      <div className="eyebrow eyebrow--moss">The Sunday Letter · Free</div>
      <p className="hero__capture-lede">What is open, what is booking out, and what the week looked like from inside the park. The interactive trip planner map comes with it.</p>
      <form
        className="hero__capture nlbox__form"
        action="https://buttondown.com/api/emails/embed-subscribe/goehring"
        method="post"
        target="buttondown-target"
        onSubmit={() => {
          if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("home_hero", "home");
          setTimeout(() => setDone(true), 0);
        }}
      >
        <input type="email" name="email" aria-label="Email address" placeholder="you@email.com" required />
        <input type="hidden" name="tag" value={tripMonth ? `trip-${tripMonth}` : "home"} />
        <input type="hidden" name="embed" value="1" />
        <button type="submit">Get the Sunday letter →</button>
      </form>
    </div>
  );
}

// ============================================================
// Hero audience links. One compact link per trip stage, under the primary
// buttons: the visitor self-selects and routes themselves. Keys double as
// go() route keys, except "start-here", which scrolls to the answers row
// below. Clicks fire cta_click{location: "home_door", target} — the same
// event the old full-width triage doors fired, so the trend line survives
// the redesign.
// ============================================================
const HERO_DOORS = [
  { key: "start-here", href: "#start-here", label: "First visit" },
  { key: "itineraries", href: "/itineraries", label: "Dates already set" },
  { key: "now", href: "/now", label: "In the park now" },
];

// ============================================================
// The hero: everything above the fold. Split out of HomePage as its own
// component because it is ALSO rendered offline into the static shell baked
// into index.html (scripts/gen-home-shell.mjs), which is what paints before
// any JavaScript runs. Two rules follow from that:
//
//   1. Its first render must not depend on anything the generator cannot
//      supply: no fetches, no storage reads beyond isSubscribed() (which
//      reads false in the generator, the correct first-visit state), no
//      route state beyond the `go` handler, which the generator stubs.
//   2. Nothing date-derived may be baked in. The generator blanks the one
//      date-derived slot below (the issue detail in the kicker) to a
//      stable-height placeholder and lets React fill it on boot; index.html
//      is cached hard, so a baked month name would go stale. The
//      `data-shell-blank` attribute marks the slot for the generator, which
//      fails loudly if it disappears.
//
// Keeping the markup identical between the shell and this component is what
// keeps CLS at zero when React replaces the shell.
// ============================================================
function HomeHero({ tripMonth, go, onStartHere }) {
  return (
    <section className="hero">
      <div className="wrap hero__grid">
        <div>
          <div className="hero__kicker">
            <span className="dot"></span>
            <span data-shell-blank="issue">
              {(window.SITE && window.SITE.issue) || "Vol. III"}
              {window.SITE && window.SITE.issueDetail ? ` · ${window.SITE.issueDetail}` : ""}
            </span>
          </div>
          <h1>Yosemite, from the inside.</h1>
          <p className="hero__dek">
            Build a realistic Yosemite itinerary with current conditions, resident-tested stops and an offline field guide.
          </p>
          {/* Nav simplification pass: one unmistakable primary action. Two
              buttons (plan, then conditions), three compact audience links
              for readers who already know their stage, then the Field Guide
              card so the paid product is introduced where the planning
              starts, then the capture. This supersedes the triage-doors
              layout (which itself superseded the hero_actions A/B result);
              the buttons are judged on cta_click{location: home_hero}. */}
          <div className="hero__cta">
            <a
              className="btn"
              href="/planning"
              onClick={(e) => {
                e.preventDefault();
                if (window.track) window.track("cta_click", { location: "home_hero", target: "planning" });
                go("planning");
              }}
            >Plan my Yosemite trip <span className="btn__arrow">→</span></a>
            <a
              className="btn btn--ghost"
              href="/conditions"
              onClick={(e) => {
                e.preventDefault();
                if (window.track) window.track("cta_click", { location: "home_hero", target: "conditions" });
                go("conditions");
              }}
            >Check today's conditions</a>
          </div>
          <nav className="hero-audience" aria-label="Start from where you are">
            {HERO_DOORS.map((d) => (
              <a
                key={d.key}
                className="hero-audience__link"
                href={d.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (window.track) window.track("cta_click", { location: "home_door", target: d.key });
                  if (d.key === "start-here") onStartHere();
                  else go(d.key);
                }}
              >
                {d.label} <span aria-hidden="true">→</span>
              </a>
            ))}
          </nav>
          {/* The paid product, introduced where the free planning starts.
              Price stated plainly per house style; the live number renders
              on /guide. */}
          <a
            className="hero-guide"
            href="/guide"
            onClick={(e) => {
              e.preventDefault();
              if (window.track) window.track("guide_cta_click", { location: "home_hero" });
              go("guide");
            }}
          >
            <span className="eyebrow eyebrow--moss">The Field Guide · Offline app</span>
            <span className="hero-guide__title">Take the guide offline</span>
            <p className="hero-guide__body">Every major park region, 57 hikes, GPS locations, local tactics and an offline topo map.</p>
            <span className="mono hero-guide__cta">See the Field Guide · $3.99 →</span>
          </a>
          <HomeHeroCapture tripMonth={tripMonth} />
        </div>
        <Placeholder
          caption={"El Capitan and Bridalveil at sunset"}
          credit={"Rodrigo Soares / Unsplash"}
          image="img/valley-view-sunset-rodrigo-soares.jpg"
          tag="PLATE I"
          size="lg"
          natural
          eager
          motif={<MotifMountains />}
        />
      </div>
    </section>
  );
}

// ============================================================
// Below-the-fold mount gate. Everything under the Start Here row renders only
// once it is within 600px of the viewport. The homepage's problem was never
// bytes, it was main-thread time: the July 2026 measurement had the homepage
// at ~1.7s TBT against ~150ms on an article page, from mounting six article
// cards, four section tiles, five Go Deeper surfaces, and their images in one
// synchronous pass. Gating the mount moves that work off the critical path.
//
// Fails open: no IntersectionObserver (or no ref) renders immediately, so a
// browser without it sees the whole page as before. The placeholder reserves
// `minHeight` and the 600px margin means the swap happens below the viewport,
// so nothing visible shifts. `render` is a function, not children, so the
// deferred subtree is not even constructed until it is needed.
//
// Deliberately NOT applied to the hero, the Bulletin band, the month planner,
// or the Start Here row: those are above the fold or are the target of the
// first hero door, which scrolls to #start-here.
// ============================================================
function DeferredSection({ minHeight, render }) {
  const [shown, setShown] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (shown) return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  if (shown) return render();
  return <div ref={ref} aria-hidden="true" style={{ minHeight }} />;
}

// ============================================================
// Resume band. Renders only when a recent article was left unfinished
// (tfg.read.last, written by the article page's progress tracker) and the
// piece still exists in the catalog. One quiet line under the hero: the
// cheapest engagement win on the page is a returning reader with an open
// thread. Clicking sets the one-shot tfg.read.resume flag so the article
// page jumps back to the saved depth.
// ============================================================
const RESUME_MAX_AGE_DAYS = 30;

function ResumeReading({ go }) {
  const last = React.useMemo(() => (window.readHistory ? window.readHistory.last() : null), []);
  const article = last ? window.findArticle(last.slug) : null;
  const ageDays = last && last.at ? (Date.now() - new Date(last.at).getTime()) / 86400000 : 0;
  const show = Boolean(article) && ageDays < RESUME_MAX_AGE_DAYS;

  React.useEffect(() => {
    if (show && window.track) window.track("resume_shown", { slug: last.slug, percent: last.pct });
  }, [show]);

  if (!show) return null;

  // "About n min left" from the catalog's read estimate; falls back to the
  // saved depth when the estimate does not parse.
  const totalMin = parseInt(article.read, 10);
  const remaining = Number.isFinite(totalMin)
    ? `About ${Math.max(1, Math.round(totalMin * (100 - last.pct) / 100))} min left`
    : `${last.pct}% read`;

  return (
    <section className="wrap" style={{ paddingTop: 40 }}>
      <a
        className="resume-band"
        href={`/articles/${article.slug}`}
        onClick={(e) => {
          e.preventDefault();
          window.safeStorage.set("tfg.read.resume", article.slug);
          if (window.track) window.track("resume_click", { slug: article.slug, percent: last.pct });
          go(`a:${article.slug}`);
        }}
      >
        <span className="eyebrow eyebrow--moss">Where you left off</span>
        <span className="resume-band__title">{article.title}</span>
        <span className="resume-band__meta">{remaining}</span>
        <span className="mono resume-band__cta">Keep reading →</span>
      </a>
    </section>
  );
}

// ============================================================
// Park Bulletin teaser. Pulls the current /now edition onto the homepage so
// the page opens like a field notebook: dated, current, written from inside
// the park. Since the July 2026 user-journey pass it renders as its own band
// directly under the utility row: recency is the proof a cold planner trusts,
// so it belongs in the first two viewports, while the webcam strip (four
// off-site links) stays below Start Here. The retention loop starts here
// (home → /now → the Sunday letter's concrete promise). Fails quiet: any
// fetch or shape problem and the band renders nothing.
// Keep the ?v= in sync with BULLETIN_URL in page-now.jsx when bulletin.json
// changes. The .home-dispatch class names carry over from the dispatch era.
// ============================================================
const HOME_BULLETIN_URL = "/bulletin.json?v=5";

function HomeBulletin({ go }) {
  const [edition, setEdition] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch(HOME_BULLETIN_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))))
      .then((data) => {
        const e = data && data.edition;
        if (!cancelled && e && e.label && e.lede) setEdition(e);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!edition) return null;

  // Same commitment as /now: an ended edition is never presented as current.
  // The band stays (it is the door to the bulletin, which carries its own
  // fuller note), but the dateline says so.
  const endDate = new Date(edition.end + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ended = !Number.isNaN(endDate.getTime()) && today > endDate;

  return (
    <section className="wrap" style={{ paddingTop: 44 }}>
      <a
        className="home-dispatch"
        href="/now"
        onClick={(e) => {
          e.preventDefault();
          if (window.track) window.track("cta_click", { location: "home_dispatch" });
          go("now");
        }}
      >
        <span className="home-dispatch__date">
          The Park Bulletin · covering {edition.label}
          {ended ? " · this edition has ended" : ""}
        </span>
        <span className="home-dispatch__title">One page, the whole park, right now</span>
        <p className="home-dispatch__excerpt">{edition.lede}</p>
        <span className="mono home-dispatch__cta">Scan the bulletin →</span>
      </a>
    </section>
  );
}

// ============================================================
// Month planner. "When are you going?" chip row that persists tfg.trip.month
// (owned by HomePage so the hero capture can tag signups trip-<month>), plus
// a typical-season line and two matched reads per month. The copy is
// deliberately typical-season and hedged, in the spirit of the PWA's
// `typical` confidence label: the Bulletin and Conditions carry the current
// state, this carries what a month is usually like. Reads resolve through
// findArticle so a retired slug simply drops out; selecting the current
// calendar month adds a Bulletin link. Chip taps fire
// trip_month_select{month}; panel links fire cta_click{location: home_month}.
// Each month carries a matching plate from the existing library (lazy-loaded,
// so unselected months cost nothing); credits follow the data.js strings for
// the same files, and images with no credit there render without one.
// ============================================================
const MONTHS = [
  { key: "jan", label: "Jan", name: "January", note: "The quiet season. The Valley is open and mostly empty, the waterfalls run low, the high roads are closed, and chain rules come and go with the storms.", reads: ["yosemite-in-winter", "when-to-visit-yosemite-2026-crowd-forecast"], image: "img/el-capitan-winter.jpg", alt: "El Capitan under fresh snow as a winter storm clears above the Valley floor" },
  { key: "feb", label: "Feb", name: "February", note: "Firefall month. For about two weeks Horsetail Fall can glow at sunset when sky, water, and angle all cooperate, and the rest of the park is still honest winter.", reads: ["horsetail-fall-firefall", "yosemite-in-winter"], image: "img/horsetail-fall-firefall-cedric-letsch.jpg", alt: "Horsetail Fall glowing orange at sunset on the east shoulder of El Capitan", credit: "Cedric Letsch / Unsplash" },
  { key: "mar", label: "Mar", name: "March", note: "Late winter, first runoff. Storms still land, the falls start to wake, the crowds have not arrived, and the high roads stay closed.", reads: ["yosemite-in-winter", "yosemite-waterfalls-guide"], image: "img/yosemite-valley-winter-wall.jpg", alt: "A granite wall of Yosemite Valley dusted with late-winter snow", credit: "Ahmed Radwan / Wikimedia Commons (CC0)" },
  { key: "apr", label: "Apr", name: "April", note: "The Valley greens up and the waterfalls build by the week. Dogwoods usually bloom late in the month. Tioga is still closed most years.", reads: ["yosemite-waterfalls-guide", "yosemite-wildflowers-guide"], image: "img/yosemite-falls-spring-blossoms-cory-goehring.jpg", alt: "Yosemite Falls behind spring blossoms on the Valley floor", credit: "Cory Goehring" },
  { key: "may", label: "May", name: "May", note: "Peak waterfall month and the last calmer weeks before summer. The high roads usually begin to open. Lodging books far ahead; day plans still work.", reads: ["yosemite-waterfalls-guide", "when-to-visit-yosemite-2026-crowd-forecast"], image: "img/upper-yosemite-fall-jesse-callahan.jpg", alt: "Upper Yosemite Fall at full spring flow", credit: "Jesse Callahan / Unsplash" },
  { key: "jun", label: "Jun", name: "June", note: "Early summer. Strong falls at the start of the month, the high country opening, and school-break crowds building toward their peak.", reads: ["yosemite-in-june-2026", "yosemite-waterfalls-guide"], image: "img/half-dome-meadow-deer-johannes-andersson.jpg", alt: "A deer grazing a green meadow below Half Dome in early summer", credit: "Johannes Andersson / Unsplash" },
  { key: "jul", label: "Jul", name: "July", note: "Full summer. Every road is typically open, the Valley runs hot and busy, the big falls thin, and evenings in the high country are the move. Have a smoke plan.", reads: ["yosemite-heat-safety-guide", "yosemite-during-smoke-season"], image: "img/tenaya-lake.jpg", alt: "Tenaya Lake and granite domes along Tioga Road in summer", credit: "Michael Hogarth / Wikimedia Commons (public domain)" },
  { key: "aug", label: "Aug", name: "August", note: "High summer. Hot in the Valley, settled weather up high, the falls at a trickle, and the darkest skies of the year for the Milky Way. Smoke is a real possibility.", reads: ["yosemite-stargazing-where-to-look-up", "yosemite-heat-safety-guide"], image: "img/milky-way-sentinel-dome.jpg", alt: "The Milky Way over Sentinel Dome on a dark August night", credit: "Jackhen1992 / Wikimedia Commons (CC BY-SA 4.0)" },
  { key: "sep", label: "Sep", name: "September", note: "The exhale. Crowds ease after Labor Day, the weather usually holds, the falls are at their lowest, and smoke can linger into fall.", reads: ["when-to-visit-yosemite-2026-crowd-forecast", "yosemite-during-smoke-season"], image: "img/tuolumne-meadows.jpg", alt: "Tuolumne Meadows in golden late-season light" },
  { key: "oct", label: "Oct", name: "October", note: "Fall. Cooler days, color along the Merced, quieter trails, and the first real storms possible late in the month.", reads: ["yosemite-photography-spots", "yosemite-during-smoke-season"], image: "img/tunnel-view-autumn-aniket-deole.jpg", alt: "Tunnel View in autumn light, with El Capitan, Bridalveil Fall, and Half Dome in one frame", credit: "Aniket Deole / Unsplash" },
  { key: "nov", label: "Nov", name: "November", note: "The shoulder. Short days, empty trails, the first lasting snow most years, and the high roads close for the season.", reads: ["yosemite-in-winter", "when-to-visit-yosemite-2026-crowd-forecast"], image: "img/half-dome-valley-vista.jpg", alt: "Half Dome above a quiet Yosemite Valley in the November shoulder season", credit: "Cam DiCecca / Wikimedia Commons (CC0)" },
  { key: "dec", label: "Dec", name: "December", note: "Early winter. First snow when storms land, holiday crowds around the lodges midmonth onward, and chains in the car as a rule.", reads: ["yosemite-in-winter", "yosemite-photography-spots"], image: "img/half-dome-alpenglow-madhu-shesharam.jpg", alt: "Winter alpenglow on Half Dome at dusk", credit: "Madhu Shesharam / Unsplash" },
];

function HomeMonthPlanner({ month, onSelect, go }) {
  const sel = MONTHS.find((m) => m.key === month) || null;
  const reads = sel ? sel.reads.map((s) => window.findArticle(s)).filter(Boolean) : [];
  const isCurrentMonth = Boolean(sel) && sel.name === new Date().toLocaleDateString("en-US", { month: "long" });

  const linkClick = (e, target, dest) => {
    e.preventDefault();
    if (window.track) window.track("cta_click", { location: "home_month", target });
    go(dest);
  };

  return (
    <section className="wrap" style={{ paddingTop: 28 }}>
      <div className="month-planner">
        <div className="month-planner__head">
          <span className="month-planner__label">When are you going?</span>
          <div className="month-planner__chips" role="group" aria-label="Pick your trip month">
            {MONTHS.map((m) => (
              <button
                key={m.key}
                type="button"
                className={"month-chip" + (m.key === month ? " month-chip--on" : "")}
                aria-pressed={m.key === month}
                onClick={() => onSelect(m.key === month ? null : m.key)}
              >{m.label}</button>
            ))}
          </div>
        </div>
        {sel && (
          <div className="month-planner__panel" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 36, alignItems: "start" }}>
            <div>
              <p className="month-planner__note"><strong>{sel.name}.</strong> {sel.note}</p>
              <div className="month-planner__links">
                {reads.map((a) => (
                  <a key={a.slug} href={`/articles/${a.slug}`} onClick={(e) => linkClick(e, a.slug, `a:${a.slug}`)}>
                    {a.title} →
                  </a>
                ))}
                <a href="/itineraries" onClick={(e) => linkClick(e, "itineraries", "itineraries")}>Build the days: Itineraries →</a>
                {isCurrentMonth && (
                  <a href="/now" onClick={(e) => linkClick(e, "now", "now")}>Going now: The Park Bulletin →</a>
                )}
              </div>
              <p className="month-planner__hint">Typical season, not a forecast. The Bulletin and Conditions carry the current state.</p>
            </div>
            <Placeholder
              caption={sel.alt}
              image={sel.image}
              credit={sel.credit}
              tag={sel.label.toUpperCase()}
              size="sm"
              sizes="(max-width: 720px) 100vw, 320px"
              style={{ aspectRatio: "4/3" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

// Section plates for the By Section grid, keyed by category slug. Reuses
// images already in the library (and their data.js credits); a slug with no
// entry renders its tile text-only, same as before.
const SECTION_IMAGES = {
  planning: { image: "img/tunnel-view.jpg", alt: "Tunnel View, with El Capitan, Bridalveil Fall, and Half Dome in one frame" },
  trails: { image: "img/taft-point.jpg", alt: "The unfenced granite overhang at Taft Point above Yosemite Valley", credit: "Cam Adams / Wikimedia Commons (CC0)" },
  wildlife: { image: "img/black-bear.jpg", alt: "A black bear moving through a Yosemite meadow" },
  seasonal: { image: "img/wildflowers.jpg", alt: "Midsummer wildflowers crowding a Yosemite meadow" },
};

// Question labels for the Start Here row, keyed by START_HERE slug. Task-mode
// visitors click questions, not essay titles, so each card leads with the
// question its article answers, in the visitor's words. A slug with no entry
// renders its card alone.
const START_HERE_QUESTIONS = {
  "first-time-yosemite-overwhelm": "First time, and it feels like a lot?",
  "yosemite-without-reservations-2026": "Do you need a reservation this year?",
  "yosemite-gateway-towns-compared": "Where should you actually stay?",
  "yosemite-in-one-or-two-days": "Only have a day or two?",
};

// ============================================================
// HOME
// ============================================================
function HomePage({ go }) {
  const recent = window.ARTICLES.slice(0, 6);
  const startHere = (window.START_HERE || [])
    .map(slug => window.findArticle(slug))
    .filter(Boolean);

  // Trip month, owned here so the planner (which writes it) and the hero
  // capture (which tags signups trip-<month>) share one value. Persisted via
  // safeStorage; an unknown stored value reads as unset.
  const [tripMonth, setTripMonth] = useState(() => {
    const v = window.safeStorage.get("tfg.trip.month", null);
    return MONTHS.some((m) => m.key === v) ? v : null;
  });
  const selectTripMonth = (key) => {
    setTripMonth(key);
    if (key) window.safeStorage.set("tfg.trip.month", key);
    else window.safeStorage.remove("tfg.trip.month");
    if (window.track) window.track("trip_month_select", { month: key || "cleared" });
  };

  const scrollToStartHere = () => {
    document.getElementById("start-here")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page">
      <HomeHero tripMonth={tripMonth} go={go} onStartHere={scrollToStartHere} />

      {/* Utility row: the working tools that have no other home on this page,
          one line, directly under the hero. Text links, not cards. Trimmed in
          the July 2026 repetition pass: Itineraries lives in the hero's
          audience links and the Map has the bottom nav tab and the Go Deeper
          band, so listing them here was the third mention of each. */}
      <section className="wrap" style={{ paddingTop: 28 }}>
        <nav className="home-utility" aria-label="Trip tools">
          <span className="home-utility__label">Plan your trip</span>
          {[
            ["planning", "/planning", "Planning Guide"],
            ["stay", "/stay", "Where to stay"],
            ["checklist", "/checklist", "Checklist"],
            ["conditions", "/conditions", "Conditions and webcams"],
          ].map(([key, href, label], i) => (
            <React.Fragment key={key}>
              {i > 0 && <span className="home-utility__sep" aria-hidden="true">·</span>}
              <a
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  if (window.track) window.track("home_utility_click", { target: key });
                  go(key);
                }}
              >{label}</a>
            </React.Fragment>
          ))}
        </nav>
      </section>

      <ResumeReading go={go} />

      {/* The Bulletin band carries the page's recency proof, so it sits in the
          first two viewports, ahead of the month planner. (Before the July 2026
          repetition pass the code had it below the planner while the comment on
          HomeBulletin claimed otherwise.) */}
      <HomeBulletin go={go} />

      <HomeMonthPlanner month={tripMonth} onSelect={selectTripMonth} go={go} />

      {/* Start Here — the answers row. Curated onboarding for first-time
          visitors, framed as the questions everyone asks: task mode clicks
          questions, and the articles underneath do the depth conversion.
          Mounts eagerly, unlike everything below it: the first hero door
          scrolls to this section, so it has to exist before the click. */}
      {startHere.length > 0 && (
        <section id="start-here" className="wrap" style={{ paddingTop: 72, scrollMarginTop: 24 }}>
          <div style={{ marginBottom: 32 }}>
            <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>For first-time visitors</div>
            <h2 className="home-section__title">Start here.</h2>
            <p className="home-section__dek">
              Four answers before you book anything.
            </p>
          </div>
          <div className="start-here-grid">
            {startHere.map(a => (
              <div key={a.slug} className="start-q">
                {START_HERE_QUESTIONS[a.slug] && (
                  <p className="start-q__label">{START_HERE_QUESTIONS[a.slug]}</p>
                )}
                <ArticleCard article={a} go={go} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lodging band. Sits under Start Here because "where do we sleep" is
          the question a first-time planner asks immediately after the four
          answers above, and it is the only trip decision with a hard deadline
          attached. Deferred like everything below the Start Here boundary, so
          it costs nothing at first paint. */}
      <DeferredSection
        minHeight={320}
        render={() => (
          <section className="wrap wrap--narrow" style={{ paddingTop: 72 }}>
            <div className="section-head">
              <h2>Where to stay</h2>
              <a href="/stay" onClick={(e) => { e.preventDefault(); go("stay"); }}>The whole board →</a>
            </div>
            <LodgingCta
              destination="Yosemite National Park"
              heading="The decision with a deadline"
              note="Inside the park there is one operator and one inventory, opening 366 days ahead. Outside it there are five gateway towns whose drive times to the Valley differ by more than an hour. Both are covered, honestly, on one page."
              list="page_home"
              slug="home"
              cta="See what is available on your dates →"
            />
          </section>
        )}
      />

      {/* The live webcam strip that used to sit here was removed in the July
          2026 repetition pass: it was one "what's happening now" surface too
          many, and the only one whose four links leave the site. It still
          renders on /conditions, which the hero button and the utility row
          above both link to. */}

      {/* Latest Entries — recent articles feed. Named to stay clear of the
          Park Bulletin teaser above. */}
      <DeferredSection
        minHeight={880}
        render={() => (
          <section className="wrap" style={{ paddingTop: 80 }}>
            <div className="section-head">
              <h2>Latest Entries</h2>
              <a href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>All entries →</a>
            </div>
            <div className="home-cards">
              {recent.map(a => <ArticleCard key={a.slug} article={a} go={go} />)}
            </div>
          </section>
        )}
      />

      {/* Sections row */}
      <DeferredSection
        minHeight={720}
        render={() => (
          <section className="wrap" style={{ paddingTop: 80 }}>
            <div className="section-head">
              <h2>By Section</h2>
              <a href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>Everything →</a>
            </div>
            <div className="home-sections">
              {window.CATEGORIES.map((c, i) => {
                const count = window.byCategory(c.slug).length;
                const plate = SECTION_IMAGES[c.slug];
                return (
                  <a
                    key={c.slug}
                    className="home-section-tile"
                    href={`/section/${c.slug}`}
                    onClick={(e) => { e.preventDefault(); go(`cat:${c.slug}`); }}
                  >
                    {plate && (
                      <Placeholder
                        caption={plate.alt}
                        image={plate.image}
                        credit={plate.credit}
                        tag={c.label.split(" ")[0]}
                        size="sm"
                        sizes="(max-width: 720px) 50vw, 280px"
                        style={{ aspectRatio: "3/2", marginBottom: 20 }}
                      />
                    )}
                    <div className="mono home-section-tile__num">№ 0{i + 1}</div>
                    <div className="home-section-tile__label">{c.label}</div>
                    <div className="home-section-tile__blurb">{c.blurb}</div>
                    <div className="home-section-tile__count">{count} {count === 1 ? "Entry" : "Entries"} →</div>
                  </a>
                );
              })}
            </div>
          </section>
        )}
      />

      {/* Go Deeper — the whole ways-to-take-it-further ladder in one labeled
          section instead of three identical stacked bands. Ordered by
          commitment: the free map first, the paid Field Guide app second, then
          the three quieter paths (free hub, paid consult, disclosed gear
          lists). Every offer is priced or labeled plainly; nothing is
          disguised as editorial. */}
      <DeferredSection
        minHeight={1200}
        render={() => (
          <section className="wrap" style={{ paddingTop: 80 }}>
            <div className="section-head">
              <h2>Go Deeper</h2>
            </div>

            {/* The Map: free, the softest on-ramp, so it leads. The tinted
                ground and moss spine treatment was A/B tested (callout_bands)
                and won. This is the homepage's one persuasive pitch for the
                map; the Plan a Trip dropdown and the bottom nav's Map tab are
                the navigational ones. */}
            <a
              className="band-map"
              href="/map"
              onClick={(e) => {
                e.preventDefault();
                if (window.track) window.track("cta_click", { location: "home_band", target: "map" });
                go("map");
              }}
            >
              <div className="home-band__grid">
                <div>
                  <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The Map · Free</div>
                  <div className="band-map__title">Yosemite, on a map.</div>
                </div>
                <div>
                  <p className="band-map__body">
                    Every vista, trailhead, parking turnout, and meal in one interactive map. The same free signup as the Sunday letter opens it: tap pins to assemble a route, or load a suggested one-, two-, or three-day trip.
                  </p>
                  <div className="mono band-map__cta">Open the map →</div>
                </div>
                <Placeholder
                  caption="NPS map of Yosemite showing park roads and campgrounds"
                  image="img/yosemite-park-map.jpg"
                  credit="NPS"
                  tag="MAP"
                  size="sm"
                  sizes="(max-width: 720px) 100vw, 300px"
                  style={{ aspectRatio: "4/3" }}
                />
              </div>
            </a>

            {/* The Field Guide: the paid product, on sale, in the inverted-ink
                plate treatment so the one purchase ask on the page reads as a
                deliberate object, not a third identical band. Price is stated
                plainly per house style; the live number renders on /guide. */}
            <a
              className="band-guide"
              href="/guide"
              onClick={(e) => {
                e.preventDefault();
                if (window.track) window.track("guide_cta_click", { location: "home_band" });
                go("guide");
              }}
            >
              <div className="home-band__grid">
                <div>
                  <div className="band-guide__eyebrow">The Field Guide · $3.99</div>
                  <div className="band-guide__title">The park, in your pocket.</div>
                </div>
                <div>
                  <p className="band-guide__body">
                    The app version of this journal: 50-plus stops with parking and timing notes, offline maps, a trip planner, and the secret guide. Works with no signal, which is most of the park. One purchase, eighteen months of access.
                  </p>
                  <div className="mono band-guide__cta">See the Field Guide →</div>
                </div>
                <Placeholder
                  caption="The Milky Way over Half Dome on a moonless night, far from any signal"
                  image="img/half-dome-starry-night-casey-horner.jpg"
                  credit="Casey Horner / Unsplash"
                  tag="PLATE II"
                  size="sm"
                  sizes="(max-width: 720px) 100vw, 300px"
                  style={{ aspectRatio: "4/3" }}
                />
              </div>
            </a>

            {/* The three quieter paths, one row: the free archive hub, the
                capped consult, and the disclosed gear lists. Compact cards,
                plain labels. */}
            <div className="home-paths">
              {[
                {
                  key: "planning",
                  eyebrow: "The Planning Guide · Free",
                  title: "Yosemite, planned properly.",
                  blurb: "The full archive organized for a real trip: gateway towns, reservations, Half Dome, smoke season, in the order you'll need them.",
                  cta: "Read the guide →",
                },
                {
                  key: "consult",
                  eyebrow: "Field Consult · $95",
                  title: "Your plan, thirty minutes.",
                  blurb: "One on one with a naturalist who lives in the park: your dates, your group, your plan taken apart and put back together. Six a month.",
                  cta: "Book a consult →",
                },
                {
                  key: "kit",
                  eyebrow: "The Kit",
                  title: "What I carry.",
                  blurb: "Three lists for three trips: day pack, overnight pack, car kit. The actual gear, with the actual reasons, and a plain disclosure.",
                  cta: "See the kit →",
                },
              ].map((p) => (
                <a
                  key={p.key}
                  className="home-path"
                  href={`/${p.key}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.track) window.track("cta_click", { location: "home_path", target: p.key });
                    go(p.key);
                  }}
                >
                  <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>{p.eyebrow}</div>
                  <div className="home-path__title">{p.title}</div>
                  <p className="home-path__blurb">{p.blurb}</p>
                  <div className="mono home-path__cta">{p.cta}</div>
                </a>
              ))}
            </div>
          </section>
        )}
      />

      {/* About + Newsletter strip. The plate is the editor's own frame of the
          Tuolumne high country, which is the claim the copy makes. */}
      <DeferredSection
        minHeight={620}
        render={() => (
          <section className="wrap" style={{ paddingTop: 96 }}>
            <div className="home-editor">
              <Placeholder
                caption="The Tuolumne high country, photographed by the editor"
                image="img/tuolumne-high-country-cory-goehring.jpg"
                credit="Cory Goehring"
                tag="PLATE III"
                size="sm"
                sizes="(max-width: 720px) 100vw, 340px"
                style={{ aspectRatio: "4/5" }}
              />
              <div>
                <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>From the Editor</div>
                <h2 className="home-editor__title">The same waterfall, again, in a different year.</h2>
                <p className="home-editor__dek">
                  The park looks like a single place from a postcard and like four different ones from a parking lot. This is a record of looking at it slowly.
                </p>
                <a className="btn btn--ghost" href="/about" onClick={(e) => { e.preventDefault(); go("about"); }}>
                  About the editor →
                </a>
              </div>
              <NewsletterInline location="home_strip" tag="home" />
            </div>
          </section>
        )}
      />
    </div>
  );
}

window.HomePage = HomePage;
// Exported for scripts/gen-home-shell.mjs, which renders this component (and
// the masthead) into the static above-the-fold shell baked into index.html.
window.HomeHero = HomeHero;
