/* global React, Header, Footer, ArticleCard, Placeholder, NewsletterInline,
   MotifMountains, MotifSun, MotifTrees */

// ============================================================
// HOME
// ============================================================
function HomePage({ go }) {
  const recent = window.ARTICLES.slice(0, 6);
  const seasonal = window.byCategory("seasonal").slice(0, 2);

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
            <div className="hero__cta">
              <a className="btn" href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>
                Start reading <span className="btn__arrow">→</span>
              </a>
              <a className="btn btn--ghost" href="/map" onClick={(e) => { e.preventDefault(); go("map"); }}>
                Open the map
              </a>
              <a className="btn btn--ghost" href="/checklist" onClick={(e) => { e.preventDefault(); go("checklist"); }}>
                Free checklist
              </a>
              <a className="btn btn--ghost" href="/newsletter" onClick={(e) => { e.preventDefault(); go("newsletter"); }}>
                Sunday Field Notes
              </a>
            </div>
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

      {/* This Week — recent articles feed */}
      <section className="wrap" style={{ paddingTop: 56 }}>
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
              <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The Map</div>
              <div style={{ fontFamily: "var(--display)", fontSize: 36, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.01em" }}>Yosemite, on a map.</div>
            </div>
            <div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)", margin: 0, marginBottom: 16 }}>
                Every vista, trailhead, parking turnout, and meal in one interactive map. Build a trip by tapping pins, or load a suggested one-, two-, or three-day route.
              </p>
              <div className="mono" style={{ color: "var(--moss)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em" }}>Open the planner →</div>
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
          <NewsletterInline />
        </div>
      </section>
    </div>
  );
}

window.HomePage = HomePage;
