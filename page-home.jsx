/* global React, Header, Footer, ArticleCard, Placeholder, NewsletterInline,
   MotifMountains, MotifSun, MotifTrees */

// ============================================================
// HOME
// ============================================================
function HomePage({ go }) {
  const featured = window.ARTICLES.find(a => a.feature);
  const latest = window.ARTICLES.filter(a => a !== featured).slice(0, 6);
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

      {/* Featured */}
      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="section-head">
          <h2>This Week</h2>
          <a href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>All entries →</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "start" }}>
          <a
            className="card"
            href={`/articles/${featured.slug}`}
            onClick={(e) => { e.preventDefault(); go(`a:${featured.slug}`); }}
          >
            <Placeholder
              caption={featured.placeholder}
              image={featured.image}
              tag="FEATURE"
              size="lg"
              style={{ aspectRatio: "16 / 10" }}
              motif={<MotifMountains />}
            />
            <div style={{ marginTop: 18 }}>
              <div className="card__cat">{window.findCategory(featured.cat).label}</div>
              <div className="card__title" style={{ fontFamily: "var(--display)", fontSize: 40, marginBottom: 12, lineHeight: 1.05, fontWeight: 500 }}>{featured.title}</div>
              <div className="card__dek" style={{ fontSize: 19 }}>{featured.dek}</div>
              <div className="card__meta">
                <span>{featured.date}</span>
                <span>{featured.read}</span>
                <span>by {window.SITE.authorName}</span>
              </div>
            </div>
          </a>

          <div>
            <div className="eyebrow eyebrow--moss" style={{ marginBottom: 16 }}>Also this week</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {latest.slice(0, 4).map(a => (
                <li key={a.slug} style={{ borderTop: "1px solid var(--rule)", padding: "16px 0" }}>
                  <a
                    href={`/articles/${a.slug}`}
                    onClick={(e) => { e.preventDefault(); go(`a:${a.slug}`); }}
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                    <div className="card__cat" style={{ fontSize: 9, marginBottom: 6 }}>{window.findCategory(a.cat).label}</div>
                    <div style={{ fontFamily: "var(--display)", fontSize: 19, fontWeight: 500, lineHeight: 1.2, marginBottom: 6 }}>{a.title}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", fontWeight: 600 }}>{a.date} · {a.read}</div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
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

      {/* Latest grid */}
      <section className="wrap" style={{ paddingTop: 80 }}>
        <div className="section-head">
          <h2>The Archive</h2>
          <a href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>Browse all →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, rowGap: 48 }}>
          {latest.map(a => <ArticleCard key={a.slug} article={a} go={go} />)}
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
          </div>
          <NewsletterInline />
        </div>
      </section>
    </div>
  );
}

window.HomePage = HomePage;
