var {
  useState
} = React;
function readSectionFromUrl() {
  var raw = (new URLSearchParams(window.location.search).get("section") || "").trim();
  return window.CATEGORIES.some(c => c.slug === raw) ? raw : "all";
}
function writeSectionToUrl(slug) {
  var params = new URLSearchParams(window.location.search);
  if (slug && slug !== "all") params.set("section", slug);else params.delete("section");
  var qs = params.toString();
  window.history.replaceState(window.history.state, "", window.location.pathname + (qs ? "?" + qs : ""));
}
function ArticlesIndex({
  go,
  initialCat
}) {
  var [active, setActive] = useState(() => initialCat || readSectionFromUrl());
  var filters = window.useIntentFilters();
  var pickSection = slug => {
    setActive(slug);
    writeSectionToUrl(slug);
  };
  var inSection = active === "all" ? window.ARTICLES : window.byCategory(active);
  var list = window.filterArticlesByIntent(inSection, filters.value);
  return React.createElement("div", {
    className: "page hp-index"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Articles"
    }],
    eyebrow: "ARTICLES",
    title: "Entries.",
    intro: "Every essay and trail report from The Talus Field, in reverse chronological order. Yosemite planning notes, trail conditions, wildlife and natural history, and seasonal guides. Filter by section or by what you actually need, or read the whole thing."
  }), React.createElement("section", {
    className: "hp-wrap hp-index__filters"
  }, React.createElement("div", {
    className: "hp-index__sections"
  }, React.createElement("a", {
    href: "/articles",
    className: `chip ${active === "all" ? "is-active" : ""}`,
    "aria-current": active === "all" ? "true" : undefined,
    onClick: e => {
      e.preventDefault();
      pickSection("all");
    }
  }, "All (", window.ARTICLES.length, ")"), window.CATEGORIES.map(c => {
    var n = window.byCategory(c.slug).length;
    return React.createElement("a", {
      key: c.slug,
      href: `/section/${c.slug}`,
      className: `chip ${active === c.slug ? "is-active" : ""}`,
      "aria-current": active === c.slug ? "true" : undefined,
      onClick: e => {
        e.preventDefault();
        pickSection(c.slug);
      }
    }, c.label, " (", n, ")");
  })), React.createElement(window.IntentFilters, {
    articles: inSection,
    value: filters.value,
    onToggle: filters.toggle,
    onClear: filters.clear,
    onClearMonth: filters.clearMonth,
    count: filters.count,
    resultCount: list.length,
    note: active === "all" ? "" : `Within ${window.findCategory(active).label}.`
  })), React.createElement("section", {
    className: "hp-wrap hp-section hp-index__list"
  }, list.length > 0 ? React.createElement("div", {
    className: "hp-journal-grid"
  }, list.map(a => React.createElement(HpArticleCard, {
    key: a.slug,
    article: a,
    go: go,
    location: "articles_list"
  }))) : React.createElement("p", {
    className: "hp-sub hp-index__empty"
  }, "Nothing here carries all of those at once. Drop a filter, or", " ", React.createElement("button", {
    type: "button",
    className: "hp-link",
    onClick: filters.clear
  }, "clear them all"), ".")));
}
function CategoryPage({
  slug,
  go
}) {
  var cat = window.findCategory(slug);
  if (!cat) return React.createElement("div", {
    className: "hp-wrap hp-section"
  }, "Not found.");
  var items = window.byCategory(slug);
  return React.createElement("div", {
    className: "page hp-index"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: cat.label
    }],
    eyebrow: "SECTION",
    title: cat.label,
    intro: cat.blurb
  }), React.createElement("section", {
    className: "hp-wrap hp-section hp-index__list"
  }, React.createElement("div", {
    className: "hp-journal-grid"
  }, items.map(a => React.createElement(HpArticleCard, {
    key: a.slug,
    article: a,
    go: go,
    location: "section_list"
  }))), React.createElement("p", {
    className: "hp-index__back"
  }, React.createElement("a", {
    className: "hp-link",
    href: "/articles",
    onClick: e => {
      e.preventDefault();
      go("articles");
    }
  }, "← Back to all articles"))));
}
window.ArticlesIndex = ArticlesIndex;
window.CategoryPage = CategoryPage;
