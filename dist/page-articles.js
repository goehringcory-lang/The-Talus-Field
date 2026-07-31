var {
  useState
} = React;
function ArticlesIndex({
  go,
  initialCat
}) {
  var [active, setActive] = useState(initialCat || "all");
  var filters = window.useIntentFilters();
  var inSection = active === "all" ? window.ARTICLES : window.byCategory(active);
  var list = window.filterArticlesByIntent(inSection, filters.value);
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Articles"), React.createElement("h1", null, "Entries."), React.createElement("p", {
    className: "page-head__dek"
  }, "Every essay and trail report from The Talus Field, in reverse chronological order. Yosemite planning notes, trail conditions, wildlife and natural history, and seasonal guides. Filter by section or by what you actually need, or read the whole thing."))), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 32,
      paddingBottom: 8
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      paddingBottom: 24
    }
  }, React.createElement("a", {
    href: "/articles",
    className: `chip ${active === "all" ? "is-active" : ""}`,
    onClick: e => {
      e.preventDefault();
      setActive("all");
    }
  }, "All (", window.ARTICLES.length, ")"), window.CATEGORIES.map(c => {
    var n = window.byCategory(c.slug).length;
    return React.createElement("a", {
      key: c.slug,
      href: `/section/${c.slug}`,
      className: `chip ${active === c.slug ? "is-active" : ""}`,
      onClick: e => {
        e.preventDefault();
        setActive(c.slug);
      }
    }, c.label, " (", n, ")");
  })), React.createElement(window.IntentFilters, {
    articles: inSection,
    value: filters.value,
    onToggle: filters.toggle,
    onClear: filters.clear,
    count: filters.count,
    resultCount: list.length,
    note: active === "all" ? "" : `Within ${window.findCategory(active).label}.`
  })), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 40
    }
  }, list.length > 0 ? React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 36,
      rowGap: 56
    }
  }, list.map(a => React.createElement(ArticleCard, {
    key: a.slug,
    article: a,
    go: go
  }))) : React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 19,
      lineHeight: 1.55,
      color: "var(--ink-2)",
      maxWidth: 640
    }
  }, "Nothing here carries all of those at once. Drop a filter, or", " ", React.createElement("button", {
    type: "button",
    className: "linkish",
    onClick: filters.clear
  }, "clear them all"), ".")));
}
function CategoryPage({
  slug,
  go
}) {
  var cat = window.findCategory(slug);
  if (!cat) return React.createElement("div", {
    className: "wrap",
    style: {
      padding: 80
    }
  }, "Not found.");
  var items = window.byCategory(slug);
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: cat.label
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Section"), React.createElement("h1", null, cat.label), React.createElement("p", {
    className: "page-head__dek"
  }, cat.blurb))), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 48
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 36,
      rowGap: 56
    }
  }, items.map(a => React.createElement(ArticleCard, {
    key: a.slug,
    article: a,
    go: go
  }))), React.createElement("div", {
    style: {
      marginTop: 80,
      borderTop: "1px solid var(--rule)",
      paddingTop: 32,
      fontFamily: "var(--sans)",
      fontSize: 14,
      color: "var(--ink-3)"
    }
  }, React.createElement("a", {
    href: "/articles",
    onClick: e => {
      e.preventDefault();
      go("articles");
    },
    style: {
      color: "var(--ink-2)"
    }
  }, "← Back to all articles"))));
}
window.ArticlesIndex = ArticlesIndex;
window.CategoryPage = CategoryPage;
