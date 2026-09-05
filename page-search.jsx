/* global React, ArticleCard, GuidePromo, NewsletterInline, Breadcrumbs */

// =============================================================================
// SEARCH — `/search` route. The journal's own search, over the catalog the
// browser already has: window.ARTICLES (loaded eagerly in data.js) plus the
// standing pages and sections. No index file to fetch, no third-party search
// widget, no network round trip — results appear as the reader types.
//
// Scope, stated plainly: this searches titles, deks, and section names, NOT
// article bodies. Bodies live in bodies/*.jsx and are lazy-loaded one at a
// time (see BODY_VERSIONS in data.js); pulling all of them down to build a
// full-text index would cost more than the feature is worth, and shipping a
// prebuilt index would be a fourth generated mirror to keep fresh. The page
// says so rather than letting a reader assume a body-text miss means the
// article doesn't exist.
//
// The query lives in ?q= so a search is shareable and survives a reload. It is
// written with replaceState, not pushState: typing eight characters should not
// bury the previous page under eight history entries.
// =============================================================================

const { useCallback, useEffect, useMemo, useRef, useState } = React;

// Standing pages worth finding by name. Hand-maintained on purpose — this is
// the site's own table of contents, not a crawl, and a stale entry here is a
// broken result. Keep in step with STATIC_ROUTE_KEYS in app.jsx.
//
// An entry carries either a `route` (an SPA route key, navigated with go) or a
// `path` (a real URL, navigated by the browser). The Nature Notes archive is
// the only `path` entry: it is generated static HTML, not an SPA route, so it
// must never get a go() handler.
const SEARCH_PAGES = [
  { route: "articles", title: "All articles", dek: "Every article the journal has published, newest first, with section chips and the trip filters.", kind: "Page" },
  { route: "explore", title: "Site index", dek: "Every destination on The Talus Field on one page, grouped and described: sections, the archive, the films, the trip tools, and the Field Guide.", kind: "Page" },
  { route: "now", title: "The Park Bulletin", dek: "Everything happening in the park right now: alerts, road and area status, free programs, dated events, trail status, hours, transit, phone numbers.", kind: "Page" },
  { route: "planning", title: "The Yosemite Planning Guide", dek: "The full planning sequence: reservations, permits, timing, transit, lodging, and what to do when the thing you wanted is booked.", kind: "Page" },
  { route: "start-here", title: "Start here", dek: "The first-trip questions answered plainly: reservations, when to go, how many days, where to stay, which entrance, and permits, each linking its full guide.", kind: "Page" },
  { route: "itineraries", title: "Itineraries", dek: "Half-day, one-day, two-day, and three-day plans in drive order, each one openable in the trip map.", kind: "Page" },
  { route: "conditions", title: "Conditions", dek: "Live webcams, entrance waits, and the three forecasts that matter, on one page.", kind: "Page" },
  { route: "stay", title: "Where to stay", dek: "In-park lodging and the gateway towns by road corridor: named lodges, drive times, which corridor fits which season, and what to do when the thing you wanted is full.", kind: "Page" },
  { route: "webcams", title: "Yosemite webcams", dek: "The live cameras worth checking before you drive in: Half Dome, Yosemite Falls, El Capitan and Wawona, what each shows, and how to read them.", kind: "Page" },
  { route: "distances", title: "Yosemite drive times", dek: "How far the Valley is from El Portal, Mariposa, Groveland, Oakhurst and Lee Vining: miles, drive times, entrances and what the season does to each route.", kind: "Page" },
  { path: "/archive/", title: "The Nature Notes archive", dek: "The park's own bulletin, Yosemite Nature Notes: 512 issues transcribed from the scans, with year indexes.", kind: "Archive" },
  { route: "tioga-opening", title: "The Tioga Road opening", dek: "When the high country actually opens, how the plowing works, and what is worth doing the first week it is passable.", kind: "Page" },
  { route: "half-dome-lottery", title: "The Half Dome lottery", dek: "How the cable permit lottery works, the real odds, and what to climb instead.", kind: "Page" },
  { route: "partners", title: "Group codes", dek: "The Field Guide in packs for hotels, inns, and rental hosts: one code per guest.", kind: "Page" },
  { route: "widget", title: "The conditions widget", dek: "A free embeddable box with live entrance waits and the Valley forecast, for gateway businesses.", kind: "Page" },
  { route: "advertise", title: "Advertise", dek: "What a directory listing is, what it costs, and what disqualifies an applicant.", kind: "Page" },
  { route: "map", title: "Trip planner map", dek: "Every pin in the park, filterable by category, assembled into a trip you can share or email to yourself.", kind: "Page" },
  { route: "checklist", title: "First-week checklist", dek: "What to do in the week before a Yosemite trip, in order.", kind: "Page" },
  { route: "kit", title: "Kit", dek: "The gear that actually earns its place in a Yosemite pack, and what to leave home.", kind: "Page" },
  { route: "films", title: "Films", dek: "The NPS Yosemite Nature Notes series, annotated: the best natural-history films made about this park.", kind: "Page" },
  { route: "firefall", title: "Firefall", dek: "Whether to plan a trip around Horsetail Fall, and what the odds actually are.", kind: "Page" },
  { route: "guide", title: "The Field Guide app", dek: "The offline field guide: regions, stops with parking and timing notes, day hikes, a trip planner, and maps that work with no signal.", kind: "Page" },
  { route: "consult", title: "Trip consults", dek: "Paid one-on-one help planning a Yosemite trip.", kind: "Page" },
  { route: "places", title: "Directory", dek: "Gateway towns, lodging, and the businesses worth knowing about on the way in.", kind: "Page" },
  { route: "newsletter", title: "Sunday Field Notes", dek: "One short letter a week from inside the park. Free.", kind: "Page" },
  { route: "contact", title: "Contact", dek: "Reach the journal.", kind: "Page" },
  { route: "about", title: "About the journal", dek: "Who writes The Talus Field and why.", kind: "Page" },
];

// --- Matching ---------------------------------------------------------------

// Fold accents and punctuation so "O'Shaughnessy" matches "oshaughnessy" and
// "Cook's Meadow" matches "cooks meadow".
function normalize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(query) {
  const normalized = normalize(query);
  return normalized ? normalized.split(" ").filter(Boolean) : [];
}

// Field weights. Title dominates because a reader searching "firefall" wants
// the firefall piece, not the six articles that mention it in a dek.
const FIELDS = [
  { key: "title", weight: 10 },
  { key: "section", weight: 4 },
  { key: "dek", weight: 3 },
  { key: "seoDek", weight: 2 },
  { key: "slug", weight: 2 },
];

// Every token must appear somewhere (AND), so a two-word query narrows instead
// of widening. A token matching the START of a word scores full weight; a
// match mid-word scores a third, which keeps "hike" ranking "Hiking Half Dome"
// above a piece that merely says "backpacking".
function scoreEntry(entry, tokens) {
  let total = 0;
  for (const token of tokens) {
    let best = 0;
    for (const field of FIELDS) {
      const haystack = entry.normalized[field.key];
      if (!haystack) continue;
      const at = haystack.indexOf(token);
      if (at === -1) continue;
      const atWordStart = at === 0 || haystack[at - 1] === " ";
      best = Math.max(best, atWordStart ? field.weight : field.weight / 3);
    }
    if (best === 0) return 0; // this token matched nothing: drop the entry
    total += best;
  }
  // The whole query IS the title ("trails", "firefall", "kit"): that entry
  // is the answer, ahead of every article whose title merely starts with
  // the word. This is what puts the Trails section first for /section/trailz
  // on the 404 page, and the Kit page first for "kit" here.
  if (entry.normalized.title === tokens.join(" ")) total += 5;
  return total;
}

function buildIndex() {
  const entries = [];

  for (const article of window.ARTICLES || []) {
    const cat = window.findCategory ? window.findCategory(article.cat) : null;
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
        slug: normalize(article.slug),
      },
    });
  }

  for (const cat of window.CATEGORIES || []) {
    entries.push({
      type: "section",
      key: `cat:${cat.slug}`,
      title: cat.label,
      dek: cat.blurb,
      kind: "Section",
      sortDate: "",
      normalized: {
        title: normalize(cat.label),
        section: normalize("section"),
        dek: normalize(cat.blurb),
        seoDek: "",
        slug: normalize(cat.slug),
      },
    });
  }

  for (const page of SEARCH_PAGES) {
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
        slug: normalize(page.route || page.path),
      },
    });
  }

  return entries;
}

// --- Nearest-word fallback ----------------------------------------------------

// Every word that appears in a title, section name or slug. Deks are left
// out on purpose: a correction should land on a name the reader could have
// meant, and the deks would offer "the" and "before" as neighbours.
function vocabulary(index) {
  const words = new Set();
  for (const entry of index) {
    for (const key of ["title", "section", "slug"]) {
      for (const w of (entry.normalized[key] || "").split(" ")) if (w.length >= 4) words.add(w);
    }
  }
  return Array.from(words);
}

// Optimal string alignment distance (Levenshtein plus adjacent swaps), capped
// so a hopeless pair stops early. Two edits cover the typos search logs show
// ("lotery", "hetch hetchey", "mariposia"); a swap covers "yoesmite".
function editDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev2 = [], prev = [], cur = [];
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    for (let j = 0; j <= b.length; j++) { prev2[j] = prev[j]; prev[j] = cur[j]; }
  }
  return prev[b.length];
}

// A token that matches nothing anywhere in the index is replaced by its
// nearest vocabulary word, when one is close enough: one edit for a short
// word, two for five letters and up. Returns the corrected token list and
// whether anything changed, so the page can say "showing results for".
function correctTokens(index, vocab, tokens) {
  let changed = false;
  const out = tokens.map((token) => {
    if (token.length < 4) return token;
    if (index.some((entry) => scoreEntry(entry, [token]) > 0)) return token;
    const max = token.length >= 5 ? 2 : 1;
    // Nearest first; among equally near words ("trail" and "trails" for
    // "trailz"), the one more of the catalog answers to.
    const hits = (w) => index.reduce((n, entry) => n + (scoreEntry(entry, [w]) > 0 ? 1 : 0), 0);
    let best = null, bestD = max + 1, bestHits = 0;
    for (const w of vocab) {
      const d = editDistance(token, w, max);
      if (d > max) continue;
      const h = d <= bestD ? hits(w) : 0;
      if (d < bestD || (d === bestD && h > bestHits)) { best = w; bestD = d; bestHits = h; }
    }
    if (best) { changed = true; return best; }
    return token;
  });
  return { tokens: out, changed };
}

// The matcher, exposed for the rest of the site. The not-found page calls it
// with the dead path so it can offer the closest real pages; anything else
// that wants the site's own idea of "closest to these words" should go
// through here rather than reimplementing the weights. Results carry the
// same shape the page renders (key, title, dek, kind, path).
let sharedIndex = null;
let sharedVocab = null;
function searchCatalog(query, { fuzzy = false, limit = 60 } = {}) {
  if (!sharedIndex) { sharedIndex = buildIndex(); sharedVocab = vocabulary(sharedIndex); }
  let tokens = tokenize(query);
  if (tokens.length === 0) return [];
  if (fuzzy) tokens = correctTokens(sharedIndex, sharedVocab, tokens).tokens;
  return sharedIndex
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || (b.entry.sortDate || "").localeCompare(a.entry.sortDate || ""))
    .slice(0, limit)
    .map(({ entry }) => ({
      key: entry.key,
      path: entry.path || null,
      title: entry.type === "article" ? entry.article.title : entry.title,
      dek: entry.type === "article" ? (entry.article.seoDek || entry.article.dek) : entry.dek,
      kind: entry.type === "article" ? "Article" : entry.kind,
    }));
}
window.searchCatalog = searchCatalog;

// --- Result rendering -------------------------------------------------------

// Bold the matched runs so a reader can see WHY a result came back. Splits on
// the original text (not the normalized copy) so casing and punctuation are
// preserved; falls back to the plain string if anything looks off.
function Highlight({ text, tokens }) {
  if (!text) return null;
  if (tokens.length === 0) return text;
  const pattern = tokens
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length)
    .join("|");
  let parts;
  try {
    parts = text.split(new RegExp(`(${pattern})`, "gi"));
  } catch {
    return text;
  }
  return parts.map((part, i) =>
    tokens.includes(normalize(part)) ? <mark key={i}>{part}</mark> : part
  );
}

function PageResult({ entry, tokens, go }) {
  // entry.path is a real URL (the generated archive), so the browser navigates
  // it; everything else is an SPA route key handed to go().
  const href = entry.path || (window.routeToPath ? window.routeToPath(entry.key) : `/${entry.key}`);
  return (
    <a
      className="search-result"
      href={href}
      onClick={(e) => { if (entry.path) return; e.preventDefault(); go(entry.key); }}
    >
      <div className="search-result__kind">{entry.kind}</div>
      <div className="search-result__title">
        <Highlight text={entry.title} tokens={tokens} />
      </div>
      <div className="search-result__dek">
        <Highlight text={entry.dek} tokens={tokens} />
      </div>
    </a>
  );
}

// --- Page -------------------------------------------------------------------

function readQueryParam() {
  try {
    return new URLSearchParams(window.location.search).get("q") || "";
  } catch {
    return "";
  }
}

function SearchPage({ go }) {
  const [query, setQuery] = useState(readQueryParam);
  const inputRef = useRef(null);

  // Built once: the catalog is static for the life of the page.
  const index = useMemo(buildIndex, []);
  const vocab = useMemo(() => vocabulary(index), [index]);
  const typed = useMemo(() => tokenize(query), [query]);

  // A word that matches nothing is swapped for its nearest neighbour in the
  // catalog's own vocabulary (correctTokens), so "half dome lotery" finds
  // the lottery piece instead of an empty page, and the status line says
  // which word was read differently. Only whole misses are corrected: a
  // word that matches anything at all is taken as meant.
  const corrected = useMemo(() => correctTokens(index, vocab, typed), [index, vocab, typed]);
  const tokens = corrected.tokens;

  const results = useMemo(() => {
    if (tokens.length === 0) return [];
    return index
      .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
      .filter((r) => r.score > 0)
      .sort((a, b) =>
        b.score - a.score ||
        // Same relevance: newest article first, and dateless pages last.
        (b.entry.sortDate || "").localeCompare(a.entry.sortDate || "")
      )
      .slice(0, 60);
  }, [index, tokens]);

  // Mirror the query into ?q= so a result list is shareable and survives a
  // reload. replaceState, not pushState: one history entry for the whole
  // session of typing, so Back leaves the search rather than rewinding it.
  useEffect(() => {
    const next = query ? `/search?q=${encodeURIComponent(query)}` : "/search";
    if (window.location.pathname + window.location.search !== next) {
      window.history.replaceState({ route: "search" }, "", next);
    }
  }, [query]);

  // Land with the cursor in the field: nobody arrives here to read. Pointer
  // devices only: on a phone this pops the keyboard over the results before
  // the reader has seen them, and after an SPA navigation app.jsx has just
  // put focus on <main> so the new page is announced; stealing it here on a
  // touch device silences that for no gain.
  // The "/" shortcut (app.jsx) arrives with data-search-focus set on <html>:
  // an explicit keystroke asked for the field, on any device.
  // Deferred a frame: after an SPA navigation app.jsx parks focus on <main>
  // from an effect that runs after this one (parent effects run last), and
  // a synchronous focus here was being taken straight back.
  useEffect(() => {
    const asked = document.documentElement.hasAttribute("data-search-focus");
    document.documentElement.removeAttribute("data-search-focus");
    const fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!asked && !fine) return;
    const raf = requestAnimationFrame(() => { if (inputRef.current) inputRef.current.focus(); });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Arrow keys walk the results. Down from the field lands on the first
  // result; Up and Down move between them; Up from the first, or Escape
  // anywhere in the list, returns to the field with the query intact. The
  // results are ordinary links, so Enter is the browser's own follow.
  const resultsRef = useRef(null);
  const resultLinks = () =>
    resultsRef.current
      ? Array.from(resultsRef.current.querySelectorAll("a.search-result, .search-articles a.card"))
      : [];
  const onFieldKey = (e) => {
    if (e.key !== "ArrowDown") return;
    const first = resultLinks()[0];
    if (first) { e.preventDefault(); first.focus(); }
  };
  const onResultsKey = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Escape") return;
    const links = resultLinks();
    const i = links.indexOf(document.activeElement);
    if (i === -1) return;
    e.preventDefault();
    if (e.key === "Escape" || (e.key === "ArrowUp" && i === 0)) { inputRef.current && inputRef.current.focus(); return; }
    const next = links[e.key === "ArrowDown" ? Math.min(i + 1, links.length - 1) : i - 1];
    if (next) next.focus();
  };

  const clear = useCallback(() => {
    setQuery("");
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const articleResults = results.filter((r) => r.entry.type === "article");
  const otherResults = results.filter((r) => r.entry.type !== "article");

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "Search" }]} />
          <div className="eyebrow eyebrow--moss">Search</div>
          <h1>Find it.</h1>
          <p className="page-head__dek">
            Every article, section, and page in the journal. Results narrow as you type.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32 }}>
        <form
          className="search-form"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="search-form__label" htmlFor="site-search">
            Search The Talus Field
          </label>
          <div className="search-form__row">
            <input
              id="site-search"
              ref={inputRef}
              className="search-form__input"
              type="search"
              value={query}
              autoComplete="off"
              placeholder="Half Dome permits, firefall, when to see the falls…"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onFieldKey}
              aria-keyshortcuts="/"
            />
            {query && (
              <button type="button" className="search-form__clear" onClick={clear}>
                Clear
              </button>
            )}
          </div>
          <p className="kbd-hint">
            <kbd>/</kbd> opens search from any page. <kbd>↓</kbd> <kbd>↑</kbd> move through the results, <kbd>Esc</kbd> returns to the field.
          </p>
        </form>

        <div className="search-status" role="status" aria-live="polite">
          {tokens.length === 0
            ? ""
            : results.length === 0
              ? `Nothing matches "${query}".`
              : corrected.changed
                ? `${results.length} result${results.length === 1 ? "" : "s"} for "${tokens.join(" ")}" (read from "${query}").`
                : `${results.length} result${results.length === 1 ? "" : "s"} for "${query}".`}
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 96 }} ref={resultsRef} onKeyDown={onResultsKey}>
        {tokens.length === 0 && (
          <div className="search-browse">
            <h2 className="search-browse__head">Or start from a section</h2>
            <div className="search-browse__chips">
              {(window.CATEGORIES || []).map((c) => (
                <a
                  key={c.slug}
                  href={`/section/${c.slug}`}
                  className="chip"
                  onClick={(e) => { e.preventDefault(); go(`cat:${c.slug}`); }}
                >
                  {c.label}
                </a>
              ))}
              <a
                href="/articles"
                className="chip"
                onClick={(e) => { e.preventDefault(); go("articles"); }}
              >
                All articles
              </a>
            </div>
          </div>
        )}

        {tokens.length > 0 && results.length === 0 && (
          <p className="search-empty">
            Try fewer words, or a place name. This searches headlines, summaries, and section
            names, not the full text of every article, so something mentioned once inside a piece
            may not surface here. The{" "}
            <a href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>
              full article list
            </a>{" "}
            is short enough to scan.
          </p>
        )}

        {otherResults.length > 0 && (
          <section style={{ marginBottom: articleResults.length > 0 ? 56 : 0 }}>
            <div className="section-head">
              <h2>Pages and sections</h2>
            </div>
            <div className="search-results">
              {otherResults.map(({ entry }) => (
                <PageResult key={entry.key} entry={entry} tokens={tokens} go={go} />
              ))}
            </div>
          </section>
        )}

        {articleResults.length > 0 && (
          <section>
            <div className="section-head">
              <h2>Articles</h2>
            </div>
            <div className="search-articles">
              {articleResults.map(({ entry }) => (
                <ArticleCard key={entry.key} article={entry.article} go={go} />
              ))}
            </div>
          </section>
        )}

        {tokens.length > 0 && results.length > 0 && (
          <p className="search-scope-note">
            Headlines, summaries, and section names are searched. Full article text is not.
          </p>
        )}

        {tokens.length === 0 && (
          <>
            <GuidePromo
              go={go}
              location="search"
              title="Looking for something in the park, not the archive?"
              body="The Field Guide app carries the stops, the hikes, and the maps offline, with a planner that turns your dates into a schedule. $3.99 for eighteen months."
              style={{ maxWidth: 680, marginTop: 72, marginBottom: 56 }}
            />
            <div style={{ maxWidth: 680 }}>
              <NewsletterInline
                location="search"
                tag="search"
                heading="One letter a week"
                blurb="Sunday Field Notes: what opened, what closed, and what the week ahead looks like from inside the park. Free."
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.SearchPage = SearchPage;
