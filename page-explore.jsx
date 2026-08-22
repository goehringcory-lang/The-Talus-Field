/* global React, Breadcrumbs, NewsletterInline */

// =============================================================================
// THE INDEX — `/explore`. One page that lists every reader-facing destination
// on the site, in the masthead's order (planning first, then the reading),
// each with a line saying what it is.
//
// Why it exists: the site now carries four article sections, a 512-issue
// transcribed archive, a film archive, a bulletin, a trip map, a planning
// guide, three dated-event pages, a paid app, and a handful of business
// pages. The nav simplification pass cut the masthead to the primary
// destinations precisely because no bar can hold all that without becoming
// a directory. This page is the directory: the one page a reader can land
// on and see the whole shape, and (with the footer and the hamburger's More
// section) where the secondary destinations stay reachable.
//
// It is NOT a sitemap dump and NOT a search. /articles is the article catalog
// and /search is the query box; this page indexes destinations and links out
// to both. Counts come from the catalog the browser already has
// (window.ARTICLES, window.NATURE_NOTES), so nothing here can go stale
// against the real content.
//
// One entry is deliberately not an SPA route: /archive is generated static
// HTML (scripts/gen-archive.mjs) served straight off the asset layer, so its
// link must be a plain href with no go() handler.
// =============================================================================

function ExploreSection({ eyebrow, title, dek, entries, go }) {
  return (
    <section className="wrap index-block">
      <div className="index-block__head">
        <div className="eyebrow eyebrow--moss">{eyebrow}</div>
        <h2 className="index-block__title">{title}</h2>
        {dek && <p className="index-block__dek">{dek}</p>}
      </div>
      <ul className="index-list">
        {entries.map((entry) => (
          <li key={entry.route || entry.href} className="index-list__item">
            <a
              className="index-list__link"
              href={entry.href || (window.routeToPath ? window.routeToPath(entry.route) : `/${entry.route}`)}
              onClick={(e) => {
                if (entry.href) return; // real navigation, not an SPA route
                e.preventDefault();
                if (window.track) window.track("index_click", { target: entry.route });
                go(entry.route);
              }}
            >
              <span className="index-list__name">{entry.name}</span>
              {entry.count && <span className="index-list__count">{entry.count}</span>}
            </a>
            <p className="index-list__note">{entry.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExplorePage({ go }) {
  const articles = window.ARTICLES || [];
  // NATURE_NOTES is an object ({ series, themes, episodes }), not an array —
  // the episode list is what the Films count below counts. Reading .length
  // off the object left the count permanently null, which was the whole
  // reason videos-data.js loads on this route.
  const films = (window.NATURE_NOTES && window.NATURE_NOTES.episodes) || [];
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  const sectionEntries = (window.CATEGORIES || []).map((c) => ({
    route: `cat:${c.slug}`,
    name: c.label,
    count: plural(window.byCategory(c.slug).length, "entry", "entries"),
    note: c.blurb,
  }));

  const reading = [
    {
      route: "articles",
      name: "All articles",
      count: plural(articles.length, "entry", "entries"),
      note: "The full catalog, newest first, filterable by section.",
    },
    ...sectionEntries,
    {
      route: "now",
      name: "The Park Bulletin",
      note: "Everything happening in the park right now on one board: closures, road and area status, free ranger programs, dated events, trail status, hours, transit, phone numbers. Rewritten for each edition of the park's own Yosemite Guide.",
    },
    {
      route: "films",
      name: "Films",
      count: films.length ? plural(films.length, "film", "films") : null,
      note: "The National Park Service's Yosemite Nature Notes film series, grouped by subject and annotated. Public domain, free to watch, most under ten minutes.",
    },
    {
      href: "/archive/",
      name: "The Nature Notes archive",
      count: "512 issues",
      note: "The park's own bulletin, Yosemite Nature Notes, transcribed from the scans: every issue from 1922 to 2003, roughly 1.87 million words, with year indexes and its own search-engine sitemap.",
    },
    {
      route: "search",
      name: "Search",
      note: "Titles, deks, and section names across the whole catalog, as you type. Article bodies are not indexed; the page says so rather than letting a miss read as an absence.",
    },
  ];

  const planning = [
    {
      route: "planning",
      name: "The Yosemite Planning Guide",
      note: "The archive reorganized for a real trip, in the order the decisions come: before you book, getting there and getting in, and what to do once you arrive.",
    },
    {
      route: "map",
      name: "The Map",
      note: "Every vista, trailhead, parking turnout, and meal in the park as a filterable pin. Tap to assemble a trip, share it as a link, or email it to yourself. Free; one newsletter signup opens it.",
    },
    {
      route: "itineraries",
      name: "Itineraries",
      note: "Half-day, one-day, two-day, and three-day plans in drive order, each one openable in the map as a working trip.",
    },
    {
      route: "stay",
      name: "Where to stay",
      note: "In-park lodging and the five gateway towns compared honestly, with drive times and the booking windows that actually matter.",
    },
    {
      route: "conditions",
      name: "Conditions",
      note: "Live park webcams, entrance wait times, and the three forecasts worth checking, on one bookmarkable page.",
    },
    {
      route: "checklist",
      name: "The first-week checklist",
      note: "What to do in the week before a Yosemite trip, in order, with the things that cannot be fixed on arrival marked as such.",
    },
    {
      route: "kit",
      name: "The Kit",
      note: "Three lists for three trips: day pack, overnight pack, car kit. The actual gear, the actual reasons, and a plain disclosure.",
    },
    {
      route: "consult",
      name: "Trip consults",
      note: "Paid one-on-one planning: thirty minutes with a naturalist who lives in the park, on your dates and your group.",
    },
  ];

  const events = [
    {
      route: "firefall",
      name: "Firefall",
      note: "Whether to plan a February trip around Horsetail Fall, what the odds actually are, and what to do with the trip if the light does not come.",
    },
    {
      route: "tioga-opening",
      name: "The Tioga Road opening",
      note: "When the high country actually opens, how the plowing schedule works, and what is worth doing in the first week it is passable.",
    },
    {
      route: "half-dome-lottery",
      name: "The Half Dome lottery",
      note: "How the cable permit lottery works, the preseason and daily odds, and what to climb instead when the draw goes against you.",
    },
  ];

  const guide = [
    {
      route: "guide",
      name: "The Field Guide",
      note: "The app version of this journal: stops with parking and timing notes, day hikes, a trip planner, and maps that work with no signal. One purchase, eighteen months of access.",
    },
    {
      route: "partners",
      name: "Group codes",
      note: "For gateway hotels, inns, and rental hosts: the Field Guide bought in packs, one code per guest.",
    },
  ];

  const journal = [
    { route: "about", name: "About the journal", note: "Who writes The Talus Field, from where, and on what standard." },
    { route: "newsletter", name: "Sunday Field Notes", note: "One short letter a week from inside the park. Free." },
    { route: "contact", name: "Contact", note: "Trip questions, corrections, press, or anything else." },
    { route: "places", name: "The Directory", note: "A deliberately short list of Yosemite-area operators worth recommending." },
    { route: "advertise", name: "Advertise", note: "What a directory listing is, what it costs, and what disqualifies an applicant." },
    { route: "widget", name: "The conditions widget", note: "A free embeddable box with live entrance waits and the Valley forecast, for gateway businesses. One script tag." },
    { route: "privacy", name: "Privacy", note: "What this site collects and what it does not." },
    { route: "terms", name: "Terms", note: "Content licensing and the usual limitations." },
    { route: "affiliate", name: "Affiliate disclosure", note: "How affiliate links work here, and the rule that the best recommendation stays top and linkless if it pays nothing." },
  ];

  return (
    <div className="page">
      <section className="page-head">
        <div className="wrap wrap--narrow">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "Site index" }]} />
          <div className="eyebrow eyebrow--moss">The Index</div>
          <h1>Everything on this site.</h1>
          <p className="page-head__dek">
            The whole journal on one page: what each destination is, and what it is for. If you already know what you are after, <a href="/search" onClick={(e) => { e.preventDefault(); go("search"); }}>search</a> is faster.
          </p>
        </div>
      </section>

      <ExploreSection
        go={go}
        eyebrow="Plan a Trip"
        title="The trip."
        dek="In roughly the order the decisions come at you."
        entries={planning}
      />

      <ExploreSection
        go={go}
        eyebrow="Explore Yosemite"
        title="The writing, and the record."
        dek="The journal itself, plus the park's own bulletin and film series."
        entries={reading}
      />

      <ExploreSection
        go={go}
        eyebrow="Dated events"
        title="The three dates people plan around."
        dek="Each page is a decision aid, not a calendar: whether the date is worth building a trip on, and what to do if it does not go your way."
        entries={events}
      />

      <ExploreSection
        go={go}
        eyebrow="The Field Guide"
        title="The paid app."
        dek="The offline half of this project, for the part of the park with no signal."
        entries={guide}
      />

      <ExploreSection
        go={go}
        eyebrow="The journal"
        title="Everything else."
        dek="Who keeps this, how to reach it, and the pages for businesses and lawyers."
        entries={journal}
      />

      <section className="wrap wrap--narrow" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <NewsletterInline location="explore" tag="explore" />
      </section>
    </div>
  );
}

window.ExplorePage = ExplorePage;
