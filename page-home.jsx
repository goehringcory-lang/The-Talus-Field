/* global React, Header, Footer, ArticleCard, Placeholder, NewsletterInline,
   MotifMountains, MotifSun, MotifTrees, useNewsletterImpression, isSubscribed */
const { useMemo, useState } = React;

// ============================================================
// Above-the-fold hero capture. A single-field subscribe form leading with the
// free interactive map incentive, with the same impression tracking and
// subscribed-suppression as NewsletterInline (location "home_hero", tag "home").
// ============================================================
function HomeHeroCapture({ variant }) {
  const [done, setDone] = useState(false);
  const subscribed = isSubscribed();
  const ref = useNewsletterImpression("home_hero", "home", !subscribed && !done, variant);

  if (subscribed && !done) {
    return (
      <p className="hero__capture-note" ref={ref}>
        You're on the list. <a href="/map">The interactive map is open to you →</a>
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
    <div ref={ref}>
      <form
        className="hero__capture nlbox__form"
        action="https://buttondown.com/api/emails/embed-subscribe/goehring"
        method="post"
        target="buttondown-target"
        onSubmit={() => {
          if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("home_hero", "home", variant);
          setTimeout(() => setDone(true), 0);
        }}
      >
        <input type="email" name="email" aria-label="Email address" placeholder="you@email.com" required />
        <input type="hidden" name="tag" value="home" />
        <input type="hidden" name="embed" value="1" />
        <button type="submit">Unlock the map →</button>
      </form>
      <p className="hero__capture-note">Free interactive Yosemite map with a trip builder, plus a short note on Sundays.</p>
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

const WEBCAMS = [
  { label: "Half Dome",      img: "ahwahnee2-t.jpg",  href: "https://yosemite.org/webcams/half-dome/",      alt: "Live view of Half Dome from Ahwahnee Meadow" },
  { label: "Yosemite Falls", img: "yosfalls-t.jpg",   href: "https://yosemite.org/webcams/yosemite-falls/", alt: "Live view of Upper Yosemite Falls" },
  { label: "El Capitan",     img: "turtleback-t.jpg", href: "https://yosemite.org/webcams/el-capitan/",     alt: "Live view of El Capitan from Turtleback Dome" },
  { label: "Wawona",         img: "wawona-t.jpg",     href: "https://yosemite.org/webcams/wawona/",         alt: "Live view of Wawona" },
];

// ============================================================
// HOME
// ============================================================
function HomePage({ go }) {
  const recent = window.ARTICLES.slice(0, 6);
  const seasonal = window.byCategory("seasonal").slice(0, 2);
  const startHere = (window.START_HERE || [])
    .map(slug => window.findArticle(slug))
    .filter(Boolean);
  const camCacheBust = useMemo(() => Date.now(), []);

  // A/B buckets for the three home-page conversion tests. abVariant is sticky
  // per device, so these are stable across re-renders.
  const heroVariant = window.abVariant("hero_actions");
  const webcamVariant = window.abVariant("home_webcams");
  const calloutVariant = window.abVariant("callout_bands");

  const scrollToStartHere = (e) => {
    e.preventDefault();
    document.getElementById("start-here")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Live webcam strip. In control it sits directly under the hero; in the
  // home_webcams variant it moves below "Start Here" so the four off-site links
  // do not pull readers away before they reach the capture and onboarding row.
  const webcamsSection = (
    <section className="wrap" style={{ paddingTop: 64 }}>
      <div className="section-head">
        <h2>From the park, right now</h2>
        <a href="https://yosemite.org/webcams/" target="_blank" rel="noopener noreferrer">All cameras →</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
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
            <h1>Notes from the Field.</h1>
            <p className="hero__dek">
              A field journal of one national park. Trails, weather, what is open and what is not, and the occasional longer essay when something is worth sitting with.
            </p>
            {heroVariant === "b" ? (
              /* Variant b: lead with the email/map capture (the real goal), and
                 reduce the competing actions to a single quiet text link. */
              <>
                <HomeHeroCapture variant={heroVariant} />
                <div className="hero__cta" style={{ marginTop: 18 }}>
                  <a
                    href="#start-here"
                    onClick={scrollToStartHere}
                    style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-2)", textDecoration: "none", borderBottom: "1px solid var(--rule)", paddingBottom: 2 }}
                  >
                    First time in Yosemite? Start here →
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="hero__cta">
                  <a className="btn" href="#start-here" onClick={scrollToStartHere}>
                    First Time Visitor to Yosemite: Start Here <span className="btn__arrow">→</span>
                  </a>
                  <a className="btn btn--ghost" href="/checklist" onClick={(e) => { e.preventDefault(); go("checklist"); }}>
                    Free checklist
                  </a>
                  <a className="btn btn--ghost" href="/newsletter" onClick={(e) => { e.preventDefault(); go("newsletter"); }}>
                    Sunday Field Notes / The Map
                  </a>
                </div>
                <HomeHeroCapture variant={heroVariant} />
              </>
            )}
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

      <ResumeReading go={go} />

      {webcamVariant !== "b" && webcamsSection}

      {/* Start Here — curated onboarding row for first-time visitors */}
      {startHere.length > 0 && (
        <section id="start-here" className="wrap" style={{ paddingTop: 72, scrollMarginTop: 24 }}>
          <div style={{ marginBottom: 32 }}>
            <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>For first-time visitors</div>
            <h2 style={{ fontFamily: "var(--display)", fontSize: 44, lineHeight: 1.05, marginBottom: 12, fontWeight: 500, letterSpacing: "-0.01em", textTransform: "none" }}>Start here.</h2>
            <p style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 19, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: "60ch" }}>
              The four pieces to read before you book anything.
            </p>
          </div>
          <div
            className="start-here-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, rowGap: 40 }}
          >
            {startHere.map(a => <ArticleCard key={a.slug} article={a} go={go} />)}
          </div>
        </section>
      )}

      {webcamVariant === "b" && webcamsSection}

      {/* This Week — recent articles feed */}
      <section className="wrap" style={{ paddingTop: 80 }}>
        <div className="section-head">
          <h2>This Week</h2>
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

      {/* Map callout */}
      <section className="wrap" style={{ paddingTop: 80 }}>
        <a
          href="/map"
          onClick={(e) => { e.preventDefault(); go("map"); }}
          style={calloutVariant === "b" ? {
            /* callout_bands variant: the Map band is the only one of the three
               with a direct conversion path, so break the identical-band pattern
               with a tinted ground and a moss spine to stop the eye. */
            display: "block",
            textDecoration: "none",
            color: "inherit",
            border: "1px solid var(--ink)",
            borderLeft: "6px solid var(--moss)",
            background: "var(--paper-2)",
            padding: "36px 32px",
          } : {
            display: "block",
            textDecoration: "none",
            color: "inherit",
            borderTop: "2px solid var(--ink)",
            borderBottom: "2px solid var(--ink)",
            padding: "40px 0",
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
      </section>

      {/* Planning Guide hub callout */}
      <section className="wrap" style={{ paddingTop: 80 }}>
        <a
          href="/planning"
          onClick={(e) => { e.preventDefault(); go("planning"); }}
          style={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
            borderTop: "2px solid var(--ink)",
            borderBottom: "2px solid var(--ink)",
            padding: "40px 0",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "center" }}>
            <div>
              <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The Planning Guide</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 36, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.01em" }}>Yosemite, planned properly.</div>
            </div>
            <div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)", margin: 0, marginBottom: 16 }}>
                The full archive, organized for a real trip. Gateway towns, reservations, Half Dome, smoke season, the seasonal calendar. Read in the order you'll actually need them.
              </p>
              <div className="mono" style={{ color: "var(--moss)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em" }}>Read the guide →</div>
            </div>
          </div>
        </a>
      </section>

      {/* Kit callout */}
      <section className="wrap" style={{ paddingTop: 80 }}>
        <a
          href="/kit"
          onClick={(e) => { e.preventDefault(); go("kit"); }}
          style={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
            borderTop: "2px solid var(--ink)",
            borderBottom: "2px solid var(--ink)",
            padding: "40px 0",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "center" }}>
            <div>
              <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The Kit</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 36, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.01em" }}>What I carry.</div>
            </div>
            <div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)", margin: 0, marginBottom: 16 }}>
                Three lists for three trips. A day pack for the trail, an overnight pack for backcountry nights, and the car kit for everything in between. The actual gear, with the actual reasons.
              </p>
              <div className="mono" style={{ color: "var(--moss)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em" }}>See the kit →</div>
            </div>
          </div>
        </a>
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
          </div>
          <NewsletterInline location="home_strip" tag="home" />
        </div>
      </section>
    </div>
  );
}

window.HomePage = HomePage;
