var {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} = React;
var SEARCH_PAGES = [{
  route: "articles",
  title: "All articles",
  dek: "Every article the journal has published, newest first, with section chips and the trip filters.",
  kind: "Page"
}, {
  route: "explore",
  title: "Site index",
  dek: "Every destination on The Talus Field on one page, grouped and described: sections, the archive, the films, the trip tools, and the Field Guide.",
  kind: "Page"
}, {
  route: "now",
  title: "The Park Bulletin",
  dek: "Everything happening in the park right now: alerts, road and area status, free programs, dated events, trail status, hours, transit, phone numbers.",
  kind: "Page"
}, {
  route: "planning",
  title: "The Yosemite Planning Guide",
  dek: "The full planning sequence: reservations, permits, timing, transit, lodging, and what to do when the thing you wanted is booked.",
  kind: "Page"
}, {
  route: "start-here",
  title: "Start here",
  dek: "The first-trip questions answered plainly: reservations, when to go, how many days, where to stay, which entrance, and permits, each linking its full guide.",
  kind: "Page"
}, {
  route: "itineraries",
  title: "Itineraries",
  dek: "Half-day, one-day, two-day, and three-day plans in drive order, each one openable in the trip map.",
  kind: "Page"
}, {
  route: "conditions",
  title: "Conditions",
  dek: "Live webcams, entrance waits, and the three forecasts that matter, on one page.",
  kind: "Page"
}, {
  route: "stay",
  title: "Where to stay",
  dek: "In-park lodging and the gateway towns by road corridor: named lodges, drive times, which corridor fits which season, and what to do when the thing you wanted is full.",
  kind: "Page"
}, {
  route: "webcams",
  title: "Yosemite webcams",
  dek: "The live cameras worth checking before you drive in: Half Dome, Yosemite Falls, El Capitan and Wawona, what each shows, and how to read them.",
  kind: "Page"
}, {
  route: "distances",
  title: "Yosemite drive times",
  dek: "How far the Valley is from El Portal, Mariposa, Groveland, Oakhurst and Lee Vining: miles, drive times, entrances and what the season does to each route.",
  kind: "Page"
}, {
  path: "/archive/",
  title: "The Nature Notes archive",
  dek: "The park's own bulletin, Yosemite Nature Notes: 512 issues transcribed from the scans, with year indexes.",
  kind: "Archive"
}, {
  route: "tioga-opening",
  title: "The Tioga Road opening",
  dek: "When the high country actually opens, how the plowing works, and what is worth doing the first week it is passable.",
  kind: "Page"
}, {
  route: "half-dome-lottery",
  title: "The Half Dome lottery",
  dek: "How the cable permit lottery works, the real odds, and what to climb instead.",
  kind: "Page"
}, {
  route: "partners",
  title: "Group codes",
  dek: "The Field Guide in packs for hotels, inns, and rental hosts: one code per guest.",
  kind: "Page"
}, {
  route: "widget",
  title: "The conditions widget",
  dek: "A free embeddable box with live entrance waits and the Valley forecast, for gateway businesses.",
  kind: "Page"
}, {
  route: "advertise",
  title: "Advertise",
  dek: "What a directory listing is, what it costs, and what disqualifies an applicant.",
  kind: "Page"
}, {
  route: "map",
  title: "Trip planner map",
  dek: "Every pin in the park, filterable by category, assembled into a trip you can share or email to yourself.",
  kind: "Page"
}, {
  route: "checklist",
  title: "First-week checklist",
  dek: "What to do in the week before a Yosemite trip, in order.",
  kind: "Page"
}, {
  route: "kit",
  title: "Kit",
  dek: "The gear that actually earns its place in a Yosemite pack, and what to leave home.",
  kind: "Page"
}, {
  route: "films",
  title: "Films",
  dek: "The NPS Yosemite Nature Notes series, annotated: the best natural-history films made about this park.",
  kind: "Page"
}, {
  route: "firefall",
  title: "Firefall",
  dek: "Whether to plan a trip around Horsetail Fall, and what the odds actually are.",
  kind: "Page"
}, {
  route: "guide",
  title: "The Field Guide app",
  dek: "The offline field guide: regions, stops with parking and timing notes, day hikes, a trip planner, and maps that work with no signal.",
  kind: "Page"
}, {
  route: "consult",
  title: "Trip consults",
  dek: "Paid one-on-one help planning a Yosemite trip.",
  kind: "Page"
}, {
  route: "places",
  title: "Directory",
  dek: "Gateway towns, lodging, and the businesses worth knowing about on the way in.",
  kind: "Page"
}, {
  route: "newsletter",
  title: "Sunday Field Notes",
  dek: "One short letter a week from inside the park. Free.",
  kind: "Page"
}, {
  route: "contact",
  title: "Contact",
  dek: "Reach the journal.",
  kind: "Page"
}, {
  route: "about",
  title: "About the journal",
  dek: "Who writes The Talus Field and why.",
  kind: "Page"
}];
function normalize(text) {
  return (text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}
function tokenize(query) {
  var normalized = normalize(query);
  return normalized ? normalized.split(" ").filter(Boolean) : [];
}
var FIELDS = [{
  key: "title",
  weight: 10
}, {
  key: "section",
  weight: 4
}, {
  key: "dek",
  weight: 3
}, {
  key: "seoDek",
  weight: 2
}, {
  key: "slug",
  weight: 2
}];
function scoreEntry(entry, tokens) {
  var total = 0;
  for (var token of tokens) {
    var best = 0;
    for (var field of FIELDS) {
      var haystack = entry.normalized[field.key];
      if (!haystack) continue;
      var at = haystack.indexOf(token);
      if (at === -1) continue;
      var atWordStart = at === 0 || haystack[at - 1] === " ";
      best = Math.max(best, atWordStart ? field.weight : field.weight / 3);
    }
    if (best === 0) return 0;
    total += best;
  }
  if (entry.normalized.title === tokens.join(" ")) total += 5;
  return total;
}
function buildIndex() {
  var entries = [];
  for (var article of window.ARTICLES || []) {
    var cat = window.findCategory ? window.findCategory(article.cat) : null;
    entries.push({
      type: "article",
      key: `a:${article.slug}`,
      article,
      sortDate: article.isoDate || "",
      normalized: {
        title: normalize(article.title),
        section: normalize(cat ? cat.label : ""),
        dek: normalize(article.dek),
        seoDek: normalize(article.seoDek),
        slug: normalize(article.slug)
      }
    });
  }
  for (var _cat of window.CATEGORIES || []) {
    entries.push({
      type: "section",
      key: `cat:${_cat.slug}`,
      title: _cat.label,
      dek: _cat.blurb,
      kind: "Section",
      sortDate: "",
      normalized: {
        title: normalize(_cat.label),
        section: normalize("section"),
        dek: normalize(_cat.blurb),
        seoDek: "",
        slug: normalize(_cat.slug)
      }
    });
  }
  for (var page of SEARCH_PAGES) {
    entries.push({
      type: "page",
      key: page.route || page.path,
      path: page.path || null,
      title: page.title,
      dek: page.dek,
      kind: page.kind,
      sortDate: "",
      normalized: {
        title: normalize(page.title),
        section: "",
        dek: normalize(page.dek),
        seoDek: "",
        slug: normalize(page.route || page.path)
      }
    });
  }
  return entries;
}
function vocabulary(index) {
  var words = new Set();
  for (var entry of index) {
    for (var key of ["title", "section", "slug"]) {
      for (var w of (entry.normalized[key] || "").split(" ")) if (w.length >= 4) words.add(w);
    }
  }
  return Array.from(words);
}
function editDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  var prev2 = [],
    prev = [],
    cur = [];
  for (var j = 0; j <= b.length; j++) prev[j] = j;
  for (var i = 1; i <= a.length; i++) {
    cur[0] = i;
    var rowMin = i;
    for (var _j = 1; _j <= b.length; _j++) {
      var cost = a[i - 1] === b[_j - 1] ? 0 : 1;
      var v = Math.min(prev[_j] + 1, cur[_j - 1] + 1, prev[_j - 1] + cost);
      if (i > 1 && _j > 1 && a[i - 1] === b[_j - 2] && a[i - 2] === b[_j - 1]) v = Math.min(v, prev2[_j - 2] + 1);
      cur[_j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    for (var _j2 = 0; _j2 <= b.length; _j2++) {
      prev2[_j2] = prev[_j2];
      prev[_j2] = cur[_j2];
    }
  }
  return prev[b.length];
}
function correctTokens(index, vocab, tokens) {
  var changed = false;
  var out = tokens.map(token => {
    if (token.length < 4) return token;
    if (index.some(entry => scoreEntry(entry, [token]) > 0)) return token;
    var max = token.length >= 5 ? 2 : 1;
    var hits = w => index.reduce((n, entry) => n + (scoreEntry(entry, [w]) > 0 ? 1 : 0), 0);
    var best = null,
      bestD = max + 1,
      bestHits = 0;
    for (var w of vocab) {
      var d = editDistance(token, w, max);
      if (d > max) continue;
      var h = d <= bestD ? hits(w) : 0;
      if (d < bestD || d === bestD && h > bestHits) {
        best = w;
        bestD = d;
        bestHits = h;
      }
    }
    if (best) {
      changed = true;
      return best;
    }
    return token;
  });
  return {
    tokens: out,
    changed
  };
}
var sharedIndex = null;
var sharedVocab = null;
function searchCatalog(query, {
  fuzzy = false,
  limit = 60
} = {}) {
  if (!sharedIndex) {
    sharedIndex = buildIndex();
    sharedVocab = vocabulary(sharedIndex);
  }
  var tokens = tokenize(query);
  if (tokens.length === 0) return [];
  if (fuzzy) tokens = correctTokens(sharedIndex, sharedVocab, tokens).tokens;
  return sharedIndex.map(entry => ({
    entry,
    score: scoreEntry(entry, tokens)
  })).filter(r => r.score > 0).sort((a, b) => b.score - a.score || (b.entry.sortDate || "").localeCompare(a.entry.sortDate || "")).slice(0, limit).map(({
    entry
  }) => ({
    key: entry.key,
    path: entry.path || null,
    title: entry.type === "article" ? entry.article.title : entry.title,
    dek: entry.type === "article" ? entry.article.seoDek || entry.article.dek : entry.dek,
    kind: entry.type === "article" ? "Article" : entry.kind
  }));
}
window.searchCatalog = searchCatalog;
function Highlight({
  text,
  tokens
}) {
  if (!text) return null;
  if (tokens.length === 0) return text;
  var pattern = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((a, b) => b.length - a.length).join("|");
  var parts;
  try {
    parts = text.split(new RegExp(`(${pattern})`, "gi"));
  } catch {
    return text;
  }
  return parts.map((part, i) => tokens.includes(normalize(part)) ? React.createElement("mark", {
    key: i
  }, part) : part);
}
function PageResult({
  entry,
  tokens,
  go
}) {
  var href = entry.path || (window.routeToPath ? window.routeToPath(entry.key) : `/${entry.key}`);
  return React.createElement("a", {
    className: "search-result",
    href: href,
    onClick: e => {
      if (entry.path) return;
      e.preventDefault();
      go(entry.key);
    }
  }, React.createElement("div", {
    className: "search-result__kind"
  }, entry.kind), React.createElement("div", {
    className: "search-result__title"
  }, React.createElement(Highlight, {
    text: entry.title,
    tokens: tokens
  })), React.createElement("div", {
    className: "search-result__dek"
  }, React.createElement(Highlight, {
    text: entry.dek,
    tokens: tokens
  })));
}
function readQueryParam() {
  try {
    return new URLSearchParams(window.location.search).get("q") || "";
  } catch {
    return "";
  }
}
function SearchPage({
  go
}) {
  var [query, setQuery] = useState(readQueryParam);
  var inputRef = useRef(null);
  var index = useMemo(buildIndex, []);
  var vocab = useMemo(() => vocabulary(index), [index]);
  var typed = useMemo(() => tokenize(query), [query]);
  var corrected = useMemo(() => correctTokens(index, vocab, typed), [index, vocab, typed]);
  var tokens = corrected.tokens;
  var results = useMemo(() => {
    if (tokens.length === 0) return [];
    return index.map(entry => ({
      entry,
      score: scoreEntry(entry, tokens)
    })).filter(r => r.score > 0).sort((a, b) => b.score - a.score || (b.entry.sortDate || "").localeCompare(a.entry.sortDate || "")).slice(0, 60);
  }, [index, tokens]);
  useEffect(() => {
    var next = query ? `/search?q=${encodeURIComponent(query)}` : "/search";
    if (window.location.pathname + window.location.search !== next) {
      window.history.replaceState({
        route: "search"
      }, "", next);
    }
  }, [query]);
  useEffect(() => {
    var asked = document.documentElement.hasAttribute("data-search-focus");
    document.documentElement.removeAttribute("data-search-focus");
    var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!asked && !fine) return;
    var raf = requestAnimationFrame(() => {
      if (inputRef.current) inputRef.current.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  var resultsRef = useRef(null);
  var resultLinks = () => resultsRef.current ? Array.from(resultsRef.current.querySelectorAll("a.search-result, .search-articles a.card")) : [];
  var onFieldKey = e => {
    if (e.key !== "ArrowDown") return;
    var first = resultLinks()[0];
    if (first) {
      e.preventDefault();
      first.focus();
    }
  };
  var onResultsKey = e => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Escape") return;
    var links = resultLinks();
    var i = links.indexOf(document.activeElement);
    if (i === -1) return;
    e.preventDefault();
    if (e.key === "Escape" || e.key === "ArrowUp" && i === 0) {
      inputRef.current && inputRef.current.focus();
      return;
    }
    var next = links[e.key === "ArrowDown" ? Math.min(i + 1, links.length - 1) : i - 1];
    if (next) next.focus();
  };
  var clear = useCallback(() => {
    setQuery("");
    if (inputRef.current) inputRef.current.focus();
  }, []);
  var articleResults = results.filter(r => r.entry.type === "article");
  var otherResults = results.filter(r => r.entry.type !== "article");
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
      label: "Search"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Search"), React.createElement("h1", null, "Find it."), React.createElement("p", {
    className: "page-head__dek"
  }, "Every article, section, and page in the journal. Results narrow as you type."))), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 32
    }
  }, React.createElement("form", {
    className: "search-form",
    role: "search",
    onSubmit: e => e.preventDefault()
  }, React.createElement("label", {
    className: "search-form__label",
    htmlFor: "site-search"
  }, "Search The Talus Field"), React.createElement("div", {
    className: "search-form__row"
  }, React.createElement("input", {
    id: "site-search",
    ref: inputRef,
    className: "search-form__input",
    type: "search",
    value: query,
    autoComplete: "off",
    placeholder: "Half Dome permits, firefall, when to see the falls…",
    onChange: e => setQuery(e.target.value),
    onKeyDown: onFieldKey,
    "aria-keyshortcuts": "/"
  }), query && React.createElement("button", {
    type: "button",
    className: "search-form__clear",
    onClick: clear
  }, "Clear")), React.createElement("p", {
    className: "kbd-hint"
  }, React.createElement("kbd", null, "/"), " opens search from any page. ", React.createElement("kbd", null, "↓"), " ", React.createElement("kbd", null, "↑"), " move through the results, ", React.createElement("kbd", null, "Esc"), " returns to the field.")), React.createElement("div", {
    className: "search-status",
    role: "status",
    "aria-live": "polite"
  }, tokens.length === 0 ? "" : results.length === 0 ? `Nothing matches "${query}".` : corrected.changed ? `${results.length} result${results.length === 1 ? "" : "s"} for "${tokens.join(" ")}" (read from "${query}").` : `${results.length} result${results.length === 1 ? "" : "s"} for "${query}".`)), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 24,
      paddingBottom: 96
    },
    ref: resultsRef,
    onKeyDown: onResultsKey
  }, tokens.length === 0 && React.createElement("div", {
    className: "search-browse"
  }, React.createElement("h2", {
    className: "search-browse__head"
  }, "Or start from a section"), React.createElement("div", {
    className: "search-browse__chips"
  }, (window.CATEGORIES || []).map(c => React.createElement("a", {
    key: c.slug,
    href: `/section/${c.slug}`,
    className: "chip",
    onClick: e => {
      e.preventDefault();
      go(`cat:${c.slug}`);
    }
  }, c.label)), React.createElement("a", {
    href: "/articles",
    className: "chip",
    onClick: e => {
      e.preventDefault();
      go("articles");
    }
  }, "All articles"))), tokens.length > 0 && results.length === 0 && React.createElement("p", {
    className: "search-empty"
  }, "Try fewer words, or a place name. This searches headlines, summaries, and section names, not the full text of every article, so something mentioned once inside a piece may not surface here. The", " ", React.createElement("a", {
    href: "/articles",
    onClick: e => {
      e.preventDefault();
      go("articles");
    }
  }, "full article list"), " ", "is short enough to scan."), otherResults.length > 0 && React.createElement("section", {
    style: {
      marginBottom: articleResults.length > 0 ? 56 : 0
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Pages and sections")), React.createElement("div", {
    className: "search-results"
  }, otherResults.map(({
    entry
  }) => React.createElement(PageResult, {
    key: entry.key,
    entry: entry,
    tokens: tokens,
    go: go
  })))), articleResults.length > 0 && React.createElement("section", null, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Articles")), React.createElement("div", {
    className: "search-articles"
  }, articleResults.map(({
    entry
  }) => React.createElement(ArticleCard, {
    key: entry.key,
    article: entry.article,
    go: go
  })))), tokens.length > 0 && results.length > 0 && React.createElement("p", {
    className: "search-scope-note"
  }, "Headlines, summaries, and section names are searched. Full article text is not."), tokens.length === 0 && React.createElement(React.Fragment, null, React.createElement(GuidePromo, {
    go: go,
    location: "search",
    title: "Looking for something in the park, not the archive?",
    body: "The Field Guide app carries the stops, the hikes, and the maps offline, with a planner that turns your dates into a schedule. $3.99 for eighteen months.",
    style: {
      maxWidth: 680,
      marginTop: 72,
      marginBottom: 56
    }
  }), React.createElement("div", {
    style: {
      maxWidth: 680
    }
  }, React.createElement(NewsletterInline, {
    location: "search",
    tag: "search",
    heading: "One letter a week",
    blurb: "Sunday Field Notes: what opened, what closed, and what the week ahead looks like from inside the park. Free."
  })))));
}
window.SearchPage = SearchPage;
