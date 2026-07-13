/* global React, ArticleCard, Breadcrumbs */
const { useState } = React;

function ArticlesIndex({ go, initialCat }) {
  const [active, setActive] = useState(initialCat || "all");
  const list = active === "all"
    ? window.ARTICLES
    : window.byCategory(active);

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap">
          <div className="eyebrow eyebrow--moss">Articles</div>
          <h1>Entries.</h1>
          <p className="page-head__dek">
            Every essay and trail report from The Talus Field, in reverse chronological order. Yosemite planning notes, trail conditions, wildlife and natural history, and seasonal guides. Filter by section, or read the whole thing.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderBottom: "1px solid var(--rule)", paddingBottom: 24 }}>
          <a href="/articles" className={`chip ${active === "all" ? "is-active" : ""}`}
            onClick={(e) => { e.preventDefault(); setActive("all"); }}>
            All ({window.ARTICLES.length})
          </a>
          {window.CATEGORIES.map(c => {
            const n = window.byCategory(c.slug).length;
            return (
              <a key={c.slug} href={`/section/${c.slug}`}
                className={`chip ${active === c.slug ? "is-active" : ""}`}
                onClick={(e) => { e.preventDefault(); setActive(c.slug); }}>
                {c.label} ({n})
              </a>
            );
          })}
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, rowGap: 56 }}>
          {list.map(a => <ArticleCard key={a.slug} article={a} go={go} />)}
        </div>
      </div>
    </div>
  );
}

function CategoryPage({ slug, go }) {
  const cat = window.findCategory(slug);
  if (!cat) return <div className="wrap" style={{ padding: 80 }}>Not found.</div>;
  const items = window.byCategory(slug);
  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap">
          <Breadcrumbs
            go={go}
            trail={[{ label: "Home", route: "home" }, { label: cat.label }]}
          />
          <div className="eyebrow eyebrow--moss">Section</div>
          <h1>{cat.label}</h1>
          <p className="page-head__dek">{cat.blurb}</p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 48 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, rowGap: 56 }}>
          {items.map(a => <ArticleCard key={a.slug} article={a} go={go} />)}
        </div>

        <div style={{ marginTop: 80, borderTop: "1px solid var(--rule)", paddingTop: 32, fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-3)" }}>
          <a href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }} style={{ color: "var(--ink-2)" }}>← Back to all articles</a>
        </div>
      </div>
    </div>
  );
}

window.ArticlesIndex = ArticlesIndex;
window.CategoryPage = CategoryPage;
