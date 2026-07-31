/* global React, ArticleCard, Breadcrumbs */

// =============================================================================
// ARTICLES — `/articles` (the full index) and `/section/:slug`.
//
// The index carries two independent narrowings that compose: the section chips
// (which part of the journal a piece belongs to) and the intent filters from
// intent.jsx (which reader, at which stage, asking which question). Section is
// the editorial taxonomy; intent is the visitor's. A reader browsing "Planning"
// and a reader who needs "camping, week before arrival" are different people,
// and the page now serves both without either having to read 48 titles.
// =============================================================================

const { useState } = React;

function ArticlesIndex({ go, initialCat }) {
  const [active, setActive] = useState(initialCat || "all");
  const filters = window.useIntentFilters();

  const inSection = active === "all" ? window.ARTICLES : window.byCategory(active);
  const list = window.filterArticlesByIntent(inSection, filters.value);

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap">
          <div className="eyebrow eyebrow--moss">Articles</div>
          <h1>Entries.</h1>
          <p className="page-head__dek">
            Every essay and trail report from The Talus Field, in reverse chronological order. Yosemite planning notes, trail conditions, wildlife and natural history, and seasonal guides. Filter by section or by what you actually need, or read the whole thing.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 24 }}>
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

        {/* Counts inside the intent bar are scoped to the chosen section, so a
            chip never promises entries the section filter has already removed. */}
        <window.IntentFilters
          articles={inSection}
          value={filters.value}
          onToggle={filters.toggle}
          onClear={filters.clear}
          count={filters.count}
          resultCount={list.length}
          note={active === "all" ? "" : `Within ${window.findCategory(active).label}.`}
        />
      </div>

      <div className="wrap" style={{ paddingTop: 40 }}>
        {list.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, rowGap: 56 }}>
            {list.map(a => <ArticleCard key={a.slug} article={a} go={go} />)}
          </div>
        ) : (
          <p style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.55, color: "var(--ink-2)", maxWidth: 640 }}>
            Nothing here carries all of those at once. Drop a filter, or{" "}
            <button type="button" className="linkish" onClick={filters.clear}>clear them all</button>.
          </p>
        )}
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
