/* global React, ArticleCard, GuidePromo, NewsletterInline */

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
const SEARCH_PAGES = [
  { route: "now", title: "The Park Bulletin", dek: "Everything happening in the park right now: alerts, road and area status, free programs, dated events, trail status, hours, transit, phone numbers.", kind: "Page" },
  { route: "planning", title: "The Yosemite Planning Guide", dek: "The full planning sequence: reservations, permits, timing, transit, lodging, and what to do when the thing you wanted is booked.", kind: "Page" },
  { route: "itineraries", title: "Itineraries", dek: "Half-day, one-day, two-day, and three-day plans in drive order, each one openable in the trip map.", kind: "Page" },
  { route: "conditions", title: "Conditions", dek: "Live webcams, entrance waits, and the three forecasts that matter, on one page.", kind: "Page" },
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
      key: page.route,
      title: page.title,
      dek: page.dek,
      kind: page.kind,
      sortDate: "",
      normalized: {
        title: normalize(page.title),
        section: "",
        dek: normalize(page.dek),
        seoDek: "",
        slug: normalize(page.route),
      },
    });
  }

  return entries;
}

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
  const href = window.routeToPath ? window.routeToPath(entry.key) : `/${entry.key}`;
  return (
    <a
      className="search-result"
      href={href}
      onClick={(e) => { e.preventDefault(); go(entry.key); }}
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
  const tokens = useMemo(() => tokenize(query), [query]);

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

  // Land with the cursor in the field: nobody arrives here to read.
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

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
            />
            {query && (
              <button type="button" className="search-form__clear" onClick={clear}>
                Clear
              </button>
            )}
          </div>
        </form>

        <div className="search-status" role="status" aria-live="polite">
          {tokens.length === 0
            ? ""
            : results.length === 0
              ? `Nothing matches "${query}".`
              : `${results.length} result${results.length === 1 ? "" : "s"} for "${query}".`}
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 96 }}>
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
              body="The Field Guide app carries the stops, the hikes, and the maps offline, with a planner that turns your dates into a schedule. $19 for eighteen months."
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
