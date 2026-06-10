/* global React, ReactDOM, Placeholder, NewsletterInline, ArticleCard, MotifMountains, preloadResponsive, SIZES_HERO */

function ArticlePage({ slug, go }) {
  const article = window.findArticle(slug);

  // Article bodies load on demand (data.js#loadArticleBody) rather than all 23
  // transpiling up front. Hold the resolved component and a status for the
  // loading / coming-soon states.
  const [Body, setBody] = React.useState(() => (window.ARTICLE_BODIES || {})[slug] || null);
  const [bodyState, setBodyState] = React.useState(
    () => ((window.ARTICLE_BODIES || {})[slug] ? "ready" : "loading")
  );

  // Mid-article newsletter unit lives in a DOM node injected into the rendered
  // body (see effect below); proseRef locates the body, midHost is the portal
  // target once it exists.
  const proseRef = React.useRef(null);
  const [midHost, setMidHost] = React.useState(null);

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

  // Inject a mid-article newsletter unit. Article bodies are opaque <Body/>
  // fragments; once "ready" their block-level elements are direct children of
  // .prose, so we insert a host node after the middle block and portal the unit
  // into it. The data-nl-mid guard plus teardown on slug/body change keep it
  // idempotent across SPA article-to-article navigation. Short articles (fewer
  // than 8 blocks) skip it so they are not interrupted and so mid and end units
  // never collide.
  React.useEffect(() => {
    setMidHost(null);
    if (bodyState !== "ready") return;
    let host = null;
    const raf = requestAnimationFrame(() => {
      const prose = proseRef.current;
      if (!prose || prose.querySelector("[data-nl-mid]")) return;
      const blocks = Array.from(prose.children).filter(
        (el) => !el.classList.contains("statblock") && !el.hasAttribute("data-nl-mid")
      );
      if (blocks.length < 8) return;
      const anchor = blocks[Math.floor(blocks.length / 2)];
      if (!anchor) return;
      host = document.createElement("div");
      host.setAttribute("data-nl-mid", "1");
      anchor.insertAdjacentElement("afterend", host);
      setMidHost(host);
    });
    // Remove the injected host on slug/body change before React re-renders the
    // body, so the foreign node never interleaves with reconciliation and no
    // empty host is orphaned into the next article.
    return () => {
      cancelAnimationFrame(raf);
      if (host && host.parentNode) host.parentNode.removeChild(host);
    };
  }, [bodyState, slug, Body]);

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
          <div className="prose" ref={proseRef}>
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

          {midHost && ReactDOM.createPortal(
            <NewsletterInline
              location="article_mid"
              tag="article-mid"
              heading="Keep reading next week"
              blurb="Sunday Field Notes: one short letter, only when there is something worth saying."
            />,
            midHost
          )}

          {/* Map CTA. Points readers at the interactive map (browsable free;
              the trip builder is behind the newsletter signup). */}
          <a
            href="/map"
            onClick={(e) => { e.preventDefault(); go("map"); }}
            style={{
              display: "block", textDecoration: "none", color: "inherit",
              border: "1px solid var(--ink)", padding: "24px 28px", marginTop: 40,
            }}
          >
            <div className="eyebrow eyebrow--moss" style={{ marginBottom: 8 }}>The Map · Free</div>
            <div style={{ fontFamily: "var(--display)", fontSize: 24, fontWeight: 500, lineHeight: 1.15, marginBottom: 6 }}>
              Plan it on the interactive map.
            </div>
            <p style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5, margin: 0 }}>
              Every vista, trailhead, parking turnout, and meal worth the stop, on one map. Browse it free, then build a trip from the pins.
            </p>
            <div className="mono" style={{ color: "var(--moss)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", marginTop: 12 }}>Open the map →</div>
          </a>

          <NewsletterInline
            location="article_end"
            tag="article-end"
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
