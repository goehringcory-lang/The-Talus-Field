/* global React, Placeholder, NewsletterInline, ArticleCard, MotifMountains, preloadResponsive, SIZES_HERO */

function ArticlePage({ slug, go }) {
  const article = window.findArticle(slug);

  // Article bodies load on demand (data.js#loadArticleBody) rather than all 23
  // transpiling up front. Hold the resolved component and a status for the
  // loading / coming-soon states.
  const [Body, setBody] = React.useState(() => (window.ARTICLE_BODIES || {})[slug] || null);
  const [bodyState, setBodyState] = React.useState(
    () => ((window.ARTICLE_BODIES || {})[slug] ? "ready" : "loading")
  );

  React.useEffect(() => {
    let cancelled = false;
    const existing = (window.ARTICLE_BODIES || {})[slug];
    if (existing) {
      setBody(() => existing);
      setBodyState("ready");
      return;
    }
    setBody(null);
    setBodyState("loading");
    window
      .loadArticleBody(slug)
      .then((fn) => {
        if (cancelled) return;
        if (fn) { setBody(() => fn); setBodyState("ready"); }
        else setBodyState("missing");
      })
      .catch(() => { if (!cancelled) setBodyState("missing"); });
    return () => { cancelled = true; };
  }, [slug]);

  // Preload the hero's responsive srcset so the LCP image fetches before the
  // <picture> mounts.
  React.useEffect(() => {
    if (article && article.image) preloadResponsive(article.image, SIZES_HERO);
  }, [slug]);

  if (!article) return <div className="wrap" style={{ padding: 80 }}>Not found.</div>;
  const cat = window.findCategory(article.cat);
  const related = window.ARTICLES.filter(a => a.slug !== slug && a.cat === article.cat).slice(0, 3);

  return (
    <div className="page">
      <article>
        {/* Article hero */}
        <header className="wrap wrap--narrow" style={{ paddingTop: 64, paddingBottom: 32 }}>
          <div className="eyebrow eyebrow--moss" style={{ marginBottom: 18 }}>
            <a href={`/section/${cat.slug}`} onClick={(e) => { e.preventDefault(); go(`cat:${cat.slug}`); }}
              style={{ color: "var(--moss)", textDecoration: "none" }}>
              {cat.label}
            </a>
          </div>
          <h1 style={{ marginBottom: 24 }}>{article.title}</h1>
          <p style={{ fontSize: 22, color: "var(--ink-2)", lineHeight: 1.45, fontFamily: "var(--serif)", marginBottom: 32 }}>
            {article.dek}
          </p>
          <address style={{ display: "flex", gap: 18, alignItems: "center", fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", padding: "14px 0", fontStyle: "normal" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--paper-2)", border: "1px solid var(--rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--serif)", fontWeight: 600, color: "var(--ink-2)" }}>CG</div>
            <div>
              <div style={{ color: "var(--ink)", fontWeight: 500 }}>
                By <a
                  href="/about"
                  rel="author"
                  onClick={(e) => { e.preventDefault(); go("about"); }}
                  style={{ color: "inherit", textDecoration: "none", borderBottom: "1px solid var(--rule)" }}
                >{window.SITE.authorName}</a>
              </div>
              <div>{window.SITE.authorBio}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <time dateTime={article.isoModified || article.isoDate}>{article.date}</time>
              <div>{article.read} read</div>
            </div>
          </address>
        </header>

        <div className="wrap wrap--narrow" style={{ paddingBottom: 32 }}>
          <Placeholder
            caption={article.placeholder}
            image={article.image}
            credit={article.credit}
            tag="PLATE I"
            size="lg"
            natural
            eager
            motif={<MotifMountains />}
          />
        </div>

        {/* Body */}
        <div className="wrap wrap--read">
          <div className="prose">
            {article.cat === "planning" && (
              <div className="statblock">
                <div className="statblock__item"><span className="label">Best for</span><span className="val">First visits</span></div>
                <div className="statblock__item"><span className="label">Reading time</span><span className="val">{article.read}</span></div>
                <div className="statblock__item"><span className="label">Updated</span><span className="val">{article.date}</span></div>
                <div className="statblock__item"><span className="label">Section</span><span className="val">{cat.label}</span></div>
              </div>
            )}

            {bodyState === "ready" && Body ? <Body /> :
             bodyState === "loading" ? (
              <p style={{ color: "var(--ink-3)", fontStyle: "italic" }}>Loading…</p>
            ) : (
              <p style={{ color: "var(--ink-3)", fontStyle: "italic" }}>This article is coming soon.</p>
            )}
          </div>

          <NewsletterInline
            heading="Sunday Field Notes"
            blurb="One letter a week. If you found this useful, you'll probably like the rest."
          />
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="wrap" style={{ paddingTop: 48, paddingBottom: 32 }}>
          <div className="section-head">
            <h2>More from {cat.label}</h2>
            <a href={`/section/${cat.slug}`} onClick={(e) => { e.preventDefault(); go(`cat:${cat.slug}`); }}>All in {cat.label} →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
            {related.map(a => <ArticleCard key={a.slug} article={a} go={go} />)}
          </div>
        </section>
      )}
    </div>
  );
}

window.ArticlePage = ArticlePage;
