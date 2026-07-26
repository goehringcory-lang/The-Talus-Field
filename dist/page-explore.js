function ExploreSection({
  eyebrow,
  title,
  dek,
  entries,
  go
}) {
  return React.createElement("section", {
    className: "wrap index-block"
  }, React.createElement("div", {
    className: "index-block__head"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, eyebrow), React.createElement("h2", {
    className: "index-block__title"
  }, title), dek && React.createElement("p", {
    className: "index-block__dek"
  }, dek)), React.createElement("ul", {
    className: "index-list"
  }, entries.map(entry => React.createElement("li", {
    key: entry.route || entry.href,
    className: "index-list__item"
  }, React.createElement("a", {
    className: "index-list__link",
    href: entry.href || (window.routeToPath ? window.routeToPath(entry.route) : `/${entry.route}`),
    onClick: e => {
      if (entry.href) return;
      e.preventDefault();
      if (window.track) window.track("index_click", {
        target: entry.route
      });
      go(entry.route);
    }
  }, React.createElement("span", {
    className: "index-list__name"
  }, entry.name), entry.count && React.createElement("span", {
    className: "index-list__count"
  }, entry.count)), React.createElement("p", {
    className: "index-list__note"
  }, entry.note)))));
}
function ExplorePage({
  go
}) {
  var articles = window.ARTICLES || [];
  var films = window.NATURE_NOTES || [];
  var plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  var sectionEntries = (window.CATEGORIES || []).map(c => ({
    route: `cat:${c.slug}`,
    name: c.label,
    count: plural(window.byCategory(c.slug).length, "entry", "entries"),
    note: c.blurb
  }));
  var reading = [{
    route: "articles",
    name: "All articles",
    count: plural(articles.length, "entry", "entries"),
    note: "The full catalog, newest first, filterable by section."
  }, ...sectionEntries, {
    route: "now",
    name: "The Park Bulletin",
    note: "Everything happening in the park right now on one board: closures, road and area status, free ranger programs, dated events, trail status, hours, transit, phone numbers. Rewritten for each edition of the park's own Yosemite Guide."
  }, {
    route: "films",
    name: "Films",
    count: films.length ? plural(films.length, "film", "films") : null,
    note: "The National Park Service's Yosemite Nature Notes film series, grouped by subject and annotated. Public domain, free to watch, most under ten minutes."
  }, {
    href: "/archive/",
    name: "The Nature Notes archive",
    count: "512 issues",
    note: "The park's own bulletin, Yosemite Nature Notes, transcribed from the scans: every issue from 1922 to 2003, roughly 1.87 million words, with year indexes and its own search-engine sitemap."
  }, {
    route: "search",
    name: "Search",
    note: "Titles, deks, and section names across the whole catalog, as you type. Article bodies are not indexed; the page says so rather than letting a miss read as an absence."
  }];
  var planning = [{
    route: "planning",
    name: "The Yosemite Planning Guide",
    note: "The archive reorganized for a real trip, in the order the decisions come: before you book, getting there and getting in, and what to do once you arrive."
  }, {
    route: "map",
    name: "The Map",
    note: "Every vista, trailhead, parking turnout, and meal in the park as a filterable pin. Tap to assemble a trip, share it as a link, or email it to yourself. Free; one newsletter signup opens it."
  }, {
    route: "itineraries",
    name: "Itineraries",
    note: "Half-day, one-day, two-day, and three-day plans in drive order, each one openable in the map as a working trip."
  }, {
    route: "stay",
    name: "Where to stay",
    note: "In-park lodging and the five gateway towns compared honestly, with drive times and the booking windows that actually matter."
  }, {
    route: "conditions",
    name: "Conditions",
    note: "Live park webcams, entrance wait times, and the three forecasts worth checking, on one bookmarkable page."
  }, {
    route: "checklist",
    name: "The first-week checklist",
    note: "What to do in the week before a Yosemite trip, in order, with the things that cannot be fixed on arrival marked as such."
  }, {
    route: "kit",
    name: "The Kit",
    note: "Three lists for three trips: day pack, overnight pack, car kit. The actual gear, the actual reasons, and a plain disclosure."
  }, {
    route: "consult",
    name: "Trip consults",
    note: "Paid one-on-one planning: thirty minutes with a naturalist who lives in the park, on your dates and your group."
  }];
  var events = [{
    route: "firefall",
    name: "Firefall",
    note: "Whether to plan a February trip around Horsetail Fall, what the odds actually are, and what to do with the trip if the light does not come."
  }, {
    route: "tioga-opening",
    name: "The Tioga Road opening",
    note: "When the high country actually opens, how the plowing schedule works, and what is worth doing in the first week it is passable."
  }, {
    route: "half-dome-lottery",
    name: "The Half Dome lottery",
    note: "How the cable permit lottery works, the preseason and daily odds, and what to climb instead when the draw goes against you."
  }];
  var guide = [{
    route: "guide",
    name: "The Field Guide",
    note: "The app version of this journal: stops with parking and timing notes, day hikes, a trip planner, and maps that work with no signal. One purchase, eighteen months of access."
  }, {
    route: "partners",
    name: "Group codes",
    note: "For gateway hotels, inns, and rental hosts: the Field Guide bought in packs, one code per guest."
  }];
  var journal = [{
    route: "about",
    name: "About the journal",
    note: "Who writes The Talus Field, from where, and on what standard."
  }, {
    route: "newsletter",
    name: "Sunday Field Notes",
    note: "One short letter a week from inside the park. Free."
  }, {
    route: "contact",
    name: "Contact",
    note: "Trip questions, corrections, press, or anything else."
  }, {
    route: "places",
    name: "The Directory",
    note: "A deliberately short list of Yosemite-area operators worth recommending."
  }, {
    route: "advertise",
    name: "Advertise",
    note: "What a directory listing is, what it costs, and what disqualifies an applicant."
  }, {
    route: "widget",
    name: "The conditions widget",
    note: "A free embeddable box with live entrance waits and the Valley forecast, for gateway businesses. One script tag."
  }, {
    route: "privacy",
    name: "Privacy",
    note: "What this site collects and what it does not."
  }, {
    route: "terms",
    name: "Terms",
    note: "Content licensing and the usual limitations."
  }, {
    route: "affiliate",
    name: "Affiliate disclosure",
    note: "How affiliate links work here, and the rule that the best recommendation stays top and linkless if it pays nothing."
  }];
  return React.createElement("div", {
    className: "page"
  }, React.createElement("section", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "Site index"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "The Index"), React.createElement("h1", null, "Everything on this site."), React.createElement("p", {
    className: "page-head__dek"
  }, "The whole journal on one page: what each destination is, and what it is for. If you already know what you are after, ", React.createElement("a", {
    href: "/search",
    onClick: e => {
      e.preventDefault();
      go("search");
    }
  }, "search"), " is faster."))), React.createElement(ExploreSection, {
    go: go,
    eyebrow: "Read",
    title: "The writing, and the record.",
    dek: "The journal itself, plus the park's own bulletin and film series.",
    entries: reading
  }), React.createElement(ExploreSection, {
    go: go,
    eyebrow: "Plan",
    title: "The trip.",
    dek: "In roughly the order the decisions come at you.",
    entries: planning
  }), React.createElement(ExploreSection, {
    go: go,
    eyebrow: "Dated events",
    title: "The three dates people plan around.",
    dek: "Each page is a decision aid, not a calendar: whether the date is worth building a trip on, and what to do if it does not go your way.",
    entries: events
  }), React.createElement(ExploreSection, {
    go: go,
    eyebrow: "The Field Guide",
    title: "The paid app.",
    dek: "The offline half of this project, for the part of the park with no signal.",
    entries: guide
  }), React.createElement(ExploreSection, {
    go: go,
    eyebrow: "The journal",
    title: "Everything else.",
    dek: "Who keeps this, how to reach it, and the pages for businesses and lawyers.",
    entries: journal
  }), React.createElement("section", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 24,
      paddingBottom: 40
    }
  }, React.createElement(NewsletterInline, {
    location: "explore",
    tag: "explore"
  })));
}
window.ExplorePage = ExplorePage;
