/* global React, HpPageHead, HpArticleCard */

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

// The section chip mirrors to ?section= with replaceState, same contract as
// the intent filters (whose writer starts from the current query string, so
// the two never clobber each other): a filtered view is a shareable link and
// survives reload, without one history entry per chip tap.
function readSectionFromUrl() {
  const raw = (new URLSearchParams(window.location.search).get("section") || "").trim();
  return window.CATEGORIES.some((c) => c.slug === raw) ? raw : "all";
}

function writeSectionToUrl(slug) {
  const params = new URLSearchParams(window.location.search);
  if (slug && slug !== "all") params.set("section", slug);
  else params.delete("section");
  const qs = params.toString();
  window.history.replaceState(window.history.state, "", window.location.pathname + (qs ? "?" + qs : ""));
}

function ArticlesIndex({ go, initialCat }) {
  const [active, setActive] = useState(() => initialCat || readSectionFromUrl());
  const filters = window.useIntentFilters();
  const pickSection = (slug) => {
    setActive(slug);
    writeSectionToUrl(slug);
  };

  const inSection = active === "all" ? window.ARTICLES : window.byCategory(active);
  const list = window.filterArticlesByIntent(inSection, filters.value);

  return (
    <div className="page hp-index">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Articles" }]}
        eyebrow="ARTICLES"
        title="Entries."
        intro="Every essay and trail report from The Talus Field, in reverse chronological order. Yosemite planning notes, trail conditions, wildlife and natural history, and seasonal guides. Filter by section or by what you actually need, or read the whole thing."
      />

      <section className="hp-wrap hp-index__filters">
        <div className="hp-index__sections">
          <a href="/articles" className={`chip ${active === "all" ? "is-active" : ""}`}
            aria-current={active === "all" ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); pickSection("all"); }}>
            All ({window.ARTICLES.length})
          </a>
          {window.CATEGORIES.map(c => {
            const n = window.byCategory(c.slug).length;
            return (
              <a key={c.slug} href={`/section/${c.slug}`}
                className={`chip ${active === c.slug ? "is-active" : ""}`}
                aria-current={active === c.slug ? "true" : undefined}
                onClick={(e) => { e.preventDefault(); pickSection(c.slug); }}>
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
          onClearMonth={filters.clearMonth}
          count={filters.count}
          resultCount={list.length}
          note={active === "all" ? "" : `Within ${window.findCategory(active).label}.`}
        />
      </section>

      <section className="hp-wrap hp-section hp-index__list">
        {list.length > 0 ? (
          <div className="hp-journal-grid">
            {list.map(a => <HpArticleCard key={a.slug} article={a} go={go} location="articles_list" />)}
          </div>
        ) : (
          <p className="hp-sub hp-index__empty">
            Nothing here carries all of those at once. Drop a filter, or{" "}
            <button type="button" className="hp-link" onClick={filters.clear}>clear them all</button>.
          </p>
        )}
      </section>
    </div>
  );
}

function CategoryPage({ slug, go }) {
  const cat = window.findCategory(slug);
  if (!cat) return <div className="hp-wrap hp-section">Not found.</div>;
  const items = window.byCategory(slug);
  return (
    <div className="page hp-index">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: cat.label }]}
        eyebrow="SECTION"
        title={cat.label}
        intro={cat.blurb}
      />

      <section className="hp-wrap hp-section hp-index__list">
        <div className="hp-journal-grid">
          {items.map(a => <HpArticleCard key={a.slug} article={a} go={go} location="section_list" />)}
        </div>

        <p className="hp-index__back">
          <a className="hp-link" href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>← Back to all articles</a>
        </p>
      </section>
    </div>
  );
}

window.ArticlesIndex = ArticlesIndex;
window.CategoryPage = CategoryPage;
