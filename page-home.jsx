/* global React, Header, Footer, ArticleCard, Placeholder, NewsletterInline,
   WebcamStrip,
   MotifMountains, MotifSun, MotifTrees, useNewsletterImpression, isSubscribed */
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
// ============================================================
function HomeHeroCapture({ tripMonth }) {
  const [done, setDone] = useState(false);
  const subscribed = isSubscribed();
  const ref = useNewsletterImpression("home_hero", "home", !subscribed && !done);

  if (subscribed && !done) {
    return (
      <p className="hero__capture-note" ref={ref}>
        You're on the list. <a href="/map">The map's trip builder is open to you →</a>
      </p>
    );
  }

  if (done) {
    return (
      <p className="hero__capture-note" ref={ref}>
        You're in. <a href="/map">The trip builder is open to you →</a>
      </p>
    );
  }

  return (
    <div ref={ref}>
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
      <p className="hero__capture-note">What is open, what is booking out, and what the week looked like from inside the park. The map's trip builder comes with it.</p>
    </div>
  );
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
const HOME_BULLETIN_URL = "/bulletin.json?v=2";

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
// ============================================================
const MONTHS = [
  { key: "jan", label: "Jan", name: "January", note: "The quiet season. The Valley is open and mostly empty, the waterfalls run low, the high roads are closed, and chain rules come and go with the storms.", reads: ["yosemite-in-winter", "when-to-visit-yosemite-2026-crowd-forecast"] },
  { key: "feb", label: "Feb", name: "February", note: "Firefall month. For about two weeks Horsetail Fall can glow at sunset when sky, water, and angle all cooperate, and the rest of the park is still honest winter.", reads: ["horsetail-fall-firefall", "yosemite-in-winter"] },
  { key: "mar", label: "Mar", name: "March", note: "Late winter, first runoff. Storms still land, the falls start to wake, the crowds have not arrived, and the high roads stay closed.", reads: ["yosemite-in-winter", "yosemite-waterfalls-guide"] },
  { key: "apr", label: "Apr", name: "April", note: "The Valley greens up and the waterfalls build by the week. Dogwoods usually bloom late in the month. Tioga is still closed most years.", reads: ["yosemite-waterfalls-guide", "yosemite-wildflowers-guide"] },
  { key: "may", label: "May", name: "May", note: "Peak waterfall month and the last calmer weeks before summer. The high roads usually begin to open. Lodging books far ahead; day plans still work.", reads: ["yosemite-waterfalls-guide", "when-to-visit-yosemite-2026-crowd-forecast"] },
  { key: "jun", label: "Jun", name: "June", note: "Early summer. Strong falls at the start of the month, the high country opening, and school-break crowds building toward their peak.", reads: ["yosemite-in-june-2026", "yosemite-waterfalls-guide"] },
  { key: "jul", label: "Jul", name: "July", note: "Full summer. Every road is typically open, the Valley runs hot and busy, the big falls thin, and evenings in the high country are the move. Have a smoke plan.", reads: ["yosemite-heat-safety-guide", "yosemite-during-smoke-season"] },
  { key: "aug", label: "Aug", name: "August", note: "High summer. Hot in the Valley, settled weather up high, the falls at a trickle, and the darkest skies of the year for the Milky Way. Smoke is a real possibility.", reads: ["yosemite-stargazing-where-to-look-up", "yosemite-heat-safety-guide"] },
  { key: "sep", label: "Sep", name: "September", note: "The exhale. Crowds ease after Labor Day, the weather usually holds, the falls are at their lowest, and smoke can linger into fall.", reads: ["when-to-visit-yosemite-2026-crowd-forecast", "yosemite-during-smoke-season"] },
  { key: "oct", label: "Oct", name: "October", note: "Fall. Cooler days, color along the Merced, quieter trails, and the first real storms possible late in the month.", reads: ["yosemite-photography-spots", "yosemite-during-smoke-season"] },
  { key: "nov", label: "Nov", name: "November", note: "The shoulder. Short days, empty trails, the first lasting snow most years, and the high roads close for the season.", reads: ["yosemite-in-winter", "when-to-visit-yosemite-2026-crowd-forecast"] },
  { key: "dec", label: "Dec", name: "December", note: "Early winter. First snow when storms land, holiday crowds around the lodges midmonth onward, and chains in the car as a rule.", reads: ["yosemite-in-winter", "yosemite-photography-spots"] },
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
          <div className="month-planner__panel">
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
        )}
      </div>
    </section>
  );
}

// ============================================================
// Hero triage doors. One row per trip stage, above the capture: the visitor
// self-selects and routes themselves before the page asks for anything. Keys
// double as go() route keys, except "start-here", which scrolls to the
// answers row below. Clicks fire cta_click{location: "home_door", target}.
// ============================================================
const HERO_DOORS = [
  { key: "start-here", href: "#start-here", q: "First trip?", a: "Four answers before you book anything" },
  { key: "itineraries", href: "/itineraries", q: "Dates set?", a: "Itineraries, the map, and the checklist" },
  { key: "now", href: "/now", q: "There now, or going soon?", a: "One page, the whole park, right now" },
];

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

  const scrollToStartHere = (e) => {
    e.preventDefault();
    document.getElementById("start-here")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // The live webcam strip (shared WebcamStrip in components.jsx, also on
  // /conditions). Stays below "Start Here" (see call site): its four links
  // leave the site, so it must not pull readers away before the answers row
  // and the capture. The Bulletin teaser that used to render here moved up
  // under the utility row in the July 2026 user-journey pass.
  const parkThisWeekSection = (
    <section className="wrap" style={{ paddingTop: 64 }}>
      <div className="section-head">
        <h2>From the park, right now</h2>
        <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>Conditions and webcams →</a>
      </div>
      <WebcamStrip />
    </section>
  );

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="wrap hero__grid">
          <div>
            <div className="hero__kicker">
              <span className="dot"></span>
              <span>{(window.SITE && window.SITE.issue) || "Vol. III"}{window.SITE && window.SITE.issueDetail ? ` · ${window.SITE.issueDetail}` : ""}</span>
            </div>
            <h1>Yosemite, from the inside.</h1>
            <p className="hero__dek">
              Live conditions, real itineraries, and a map of every turnout, kept by a naturalist who has lived here twenty seasons. Essays for when the logistics are done.
            </p>
            {/* July 2026 user-journey pass: the hero leads with triage, not
                capture. Three self-selection doors, one per trip stage, so a
                task-mode planner routes themselves before the page asks for
                anything; the capture follows with the letter-forward promise.
                This deliberately supersedes the hero_actions A/B result (the
                capture-forward hero won on raw signups); the doors are judged
                on second-surface reach via cta_click{location: home_door}. */}
            <nav className="hero-doors" aria-label="Start from where you are">
              {HERO_DOORS.map((d) => (
                <a
                  key={d.key}
                  className="hero-door"
                  href={d.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.track) window.track("cta_click", { location: "home_door", target: d.key });
                    if (d.key === "start-here") scrollToStartHere(e);
                    else go(d.key);
                  }}
                >
                  <span className="hero-door__q">{d.q}</span>
                  <span className="hero-door__a">{d.a}</span>
                  <span className="hero-door__arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </nav>
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

      {/* Utility row: the four working tools, one line, directly under the
          hero. Text links, not cards; the hero capture stays the main event.
          A hand-drawn El Capitan vignette sits beside the bar, decorative
          line art in the house motif style. It fails soft: if the asset is
          missing the figure hides itself and the bar keeps its full width. */}
      <section className="wrap" style={{ paddingTop: 28 }}>
        <div className="home-plan">
          <nav className="home-utility" aria-label="Trip tools">
            <span className="home-utility__label">Plan your trip</span>
            {[
              ["map", "/map", "The Map"],
              ["itineraries", "/itineraries", "Itineraries"],
              ["planning", "/planning", "Planning Guide"],
              ["checklist", "/checklist", "Checklist"],
              ["conditions", "/conditions", "Conditions"],
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
          <figure className="home-plan__art" aria-hidden="true">
            <img
              src="img/el-capitan-line-sketch.jpg"
              alt=""
              loading="lazy"
              decoding="async"
              width="440"
              height="270"
              onError={(e) => {
                const fig = e.currentTarget.closest(".home-plan__art");
                if (fig) fig.style.display = "none";
              }}
            />
          </figure>
        </div>
      </section>

      <HomeMonthPlanner month={tripMonth} onSelect={selectTripMonth} go={go} />

      <ResumeReading go={go} />

      <HomeBulletin go={go} />

      {/* Start Here — the answers row. Curated onboarding for first-time
          visitors, framed as the questions everyone asks: task mode clicks
          questions, and the articles underneath do the depth conversion. */}
      {startHere.length > 0 && (
        <section id="start-here" className="wrap" style={{ paddingTop: 72, scrollMarginTop: 24 }}>
          <div style={{ marginBottom: 32 }}>
            <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>For first-time visitors</div>
            <h2 style={{ fontFamily: "var(--display)", fontSize: 44, lineHeight: 1.05, marginBottom: 12, fontWeight: 500, letterSpacing: "-0.01em", textTransform: "none" }}>Start here.</h2>
            <p style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 19, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: "60ch" }}>
              Four answers before you book anything.
            </p>
          </div>
          <div
            className="start-here-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, rowGap: 40 }}
          >
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

      {/* The webcams sit below Start Here so the four off-site links do not
          pull readers away before they reach the answers row and the capture.
          Was A/B tested (home_webcams); this position won and is now the
          default. */}
      {parkThisWeekSection}

      {/* Latest Entries — recent articles feed. Named to stay clear of the
          Park Bulletin teaser above. */}
      <section className="wrap" style={{ paddingTop: 80 }}>
        <div className="section-head">
          <h2>Latest Entries</h2>
          <a href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>All entries →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, rowGap: 48 }}>
          {recent.map(a => <ArticleCard key={a.slug} article={a} go={go} />)}
        </div>
      </section>

      {/* Sections row */}
      <section className="wrap" style={{ paddingTop: 80 }}>
        <div className="section-head">
          <h2>By Section</h2>
          <a href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>Everything →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid var(--ink)", borderLeft: "1px solid var(--ink)" }}>
          {window.CATEGORIES.map((c, i) => {
            const count = window.byCategory(c.slug).length;
            return (
              <a
                key={c.slug}
                href={`/section/${c.slug}`}
                onClick={(e) => { e.preventDefault(); go(`cat:${c.slug}`); }}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  borderRight: "1px solid var(--ink)",
                  borderBottom: "1px solid var(--ink)",
                  padding: 28,
                  display: "block",
                }}
              >
                <div className="mono" style={{ color: "var(--moss)", fontWeight: 700 }}>№ 0{i + 1}</div>
                <div style={{ fontFamily: "var(--display)", fontSize: 26, fontWeight: 500, margin: "16px 0 10px", letterSpacing: "-0.005em", lineHeight: 1.1 }}>{c.label}</div>
                <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15, color: "var(--ink-2)", lineHeight: 1.45, marginBottom: 20 }}>{c.blurb}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--ink-3)", fontWeight: 700 }}>{count} {count === 1 ? "Entry" : "Entries"} →</div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Go Deeper — the whole ways-to-take-it-further ladder in one labeled
          section instead of three identical stacked bands. Ordered by
          commitment: the free map first, the paid Field Guide app second, then
          the three quieter paths (free hub, paid consult, disclosed gear
          lists). Every offer is priced or labeled plainly; nothing is
          disguised as editorial. */}
      <section className="wrap" style={{ paddingTop: 80 }}>
        <div className="section-head">
          <h2>Go Deeper</h2>
        </div>

        {/* The Map: free, the softest on-ramp, so it leads. The tinted ground
            and moss spine treatment was A/B tested (callout_bands) and won. */}
        <a
          href="/map"
          onClick={(e) => { e.preventDefault(); go("map"); }}
          style={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
            border: "1px solid var(--ink)",
            borderLeft: "6px solid var(--moss)",
            background: "var(--paper-2)",
            padding: "36px 32px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "center" }}>
            <div>
              <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The Map · Free</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 36, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.01em" }}>Yosemite, on a map.</div>
            </div>
            <div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)", margin: 0, marginBottom: 16 }}>
                Every vista, trailhead, parking turnout, and meal in one interactive map. Browse it free. A newsletter signup unlocks the trip builder: tap pins to assemble a route, or load a suggested one-, two-, or three-day trip.
              </p>
              <div className="mono" style={{ color: "var(--moss)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em" }}>Open the map →</div>
            </div>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "center" }}>
            <div>
              <div className="band-guide__eyebrow">The Field Guide · $19</div>
              <div className="band-guide__title">The park, in your pocket.</div>
            </div>
            <div>
              <p className="band-guide__body">
                The app version of this journal: 50-plus stops with parking and timing notes, offline maps, a trip planner, and the secret guide. Works with no signal, which is most of the park. One purchase, eighteen months of access.
              </p>
              <div className="mono band-guide__cta">See the Field Guide →</div>
            </div>
          </div>
        </a>

        {/* The three quieter paths, one row: the free archive hub, the capped
            consult, and the disclosed gear lists. Compact cards, plain labels. */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 24 }}>
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
              href={`/${p.key}`}
              onClick={(e) => {
                e.preventDefault();
                if (window.track) window.track("cta_click", { location: "home_path", target: p.key });
                go(p.key);
              }}
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                border: "1px solid var(--ink)",
                padding: 28,
              }}
            >
              <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>{p.eyebrow}</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 26, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.005em", marginBottom: 10 }}>{p.title}</div>
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15, color: "var(--ink-2)", lineHeight: 1.45, margin: "0 0 18px" }}>{p.blurb}</p>
              <div className="mono" style={{ color: "var(--moss)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em" }}>{p.cta}</div>
            </a>
          ))}
        </div>
      </section>

      {/* About + Newsletter strip */}
      <section className="wrap" style={{ paddingTop: 96 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)", padding: "56px 0" }}>
          <div>
            <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>From the Editor</div>
            <h2 style={{ fontFamily: "var(--display)", fontSize: 38, marginBottom: 18, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.01em", textTransform: "none" }}>The same waterfall, again, in a different year.</h2>
            <p style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 19, color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 24 }}>
              The park looks like a single place from a postcard and like four different ones from a parking lot. This is a record of looking at it slowly.
            </p>
            <a className="btn btn--ghost" href="/about" onClick={(e) => { e.preventDefault(); go("about"); }}>
              About the editor →
            </a>
            <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6, margin: "20px 0 0" }}>
              The whole park fits on one page.{" "}
              <a
                href="/now"
                onClick={(e) => { e.preventDefault(); if (window.track) window.track("cta_click", { location: "home_strip_now" }); go("now"); }}
                style={{ color: "var(--ink-2)" }}
              >The Park Bulletin is current →</a>
            </p>
          </div>
          <NewsletterInline location="home_strip" tag="home" />
        </div>
      </section>
    </div>
  );
}

window.HomePage = HomePage;
