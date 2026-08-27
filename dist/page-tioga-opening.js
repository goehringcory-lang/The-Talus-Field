var TIOGA_BULLETIN_URL = "/bulletin.json?v=8";
var OPENING_HISTORY = [{
  year: "2026",
  date: "May 15",
  note: "The earliest opening in sixteen years."
}];
var LONG_TERM_AVERAGE = "May 28";
function TiogaStatus() {
  var [row, setRow] = React.useState(null);
  var [edition, setEdition] = React.useState(null);
  React.useEffect(() => {
    var cancelled = false;
    fetch(TIOGA_BULLETIN_URL).then(r => r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))).then(data => {
      if (cancelled || !data) return;
      var areas = Array.isArray(data.areas) ? data.areas : [];
      var tioga = areas.find(a => /tioga/i.test(a.name || ""));
      if (tioga && tioga.chip) setRow(tioga);
      if (data.edition) setEdition(data.edition);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  if (!row) return null;
  var ended = edition && edition.end ? (() => {
    var end = new Date(edition.end + "T00:00:00");
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return !Number.isNaN(end.getTime()) && today > end;
  })() : false;
  return React.createElement("section", {
    style: {
      marginTop: 48,
      border: "1px solid var(--ink)",
      padding: "24px 28px"
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 10
    }
  }, "Tioga Road right now"), React.createElement("div", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 28,
      fontWeight: 500,
      lineHeight: 1.15,
      marginBottom: 10
    }
  }, row.chip), row.note && React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 16,
      color: "var(--ink-2)",
      lineHeight: 1.5,
      margin: "0 0 12px"
    }
  }, row.note), edition && edition.updated && React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      color: "var(--ink-3)",
      margin: 0
    }
  }, ended ? "Last edition, ended " : "Last checked ", ended ? edition.label : edition.updated));
}
function TiogaOpeningPage({
  go
}) {
  var goArticle = (e, slug) => {
    e.preventDefault();
    go(`a:${slug}`);
  };
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "Tioga opening"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Seasonal event · late spring"), React.createElement("h1", null, "The Tioga Road opening"), React.createElement("p", {
    className: "page-head__dek"
  }, "Every spring, plow crews cut Highway 120 out of the snowpack and the highest road in the park comes back. The opening date is not a date: it is announced only days ahead, it varies by weeks from year to year, and the first weekends are unlike any other time on the road. This page is the standing version: how the opening works, what is actually open in week one, and how to drive it well."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "How the opening works"), React.createElement("p", null, "Tioga Road closes with the first lasting snow, typically in November, and reopens when the plowing is done, full stop. The long-term average opening is the end of May. Light snow years have opened the gate in mid-May; heavy years push the opening into June and beyond. The park announces the date only once the crews are nearly through, usually with less than a week's notice, so a trip planned around \"Tioga will be open\" needs a backup plan below 8,000 feet."), React.createElement("p", null, "The second thing to know is the difference between \"the road is open\" and \"Tuolumne Meadows is open for the season.\" Opening weekend lives entirely in the first one. The store, the grill, the lodge, the campground, the wilderness center staffing: all of that comes online over the following weeks, on its own schedule. What you get in week one is the road itself, a ribbon of asphalt through snow walls, half-frozen lakes, and a high country still pulling itself out of winter. That is a spectacular thing to drive through, and a spectacular thing to be unprepared for."), React.createElement("h2", null, "When it has actually opened"), React.createElement("p", null, "The long-term average is ", LONG_TERM_AVERAGE, ", and the average is the least useful number here: the spread between a light year and a heavy one is measured in weeks, not days. These are the openings this journal has recorded."), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Year"), React.createElement("th", null, "Tioga Road opened"), React.createElement("th", null, "Note"))), React.createElement("tbody", null, OPENING_HISTORY.map(r => React.createElement("tr", {
    key: r.year
  }, React.createElement("td", null, React.createElement("strong", null, r.year)), React.createElement("td", null, r.date), React.createElement("td", null, r.note))), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Average")), React.createElement("td", null, LONG_TERM_AVERAGE), React.createElement("td", null, "The long-term mean, which almost no individual year matches.")))), React.createElement("p", null, "The National Park Service publishes the full year-by-year list on its own Tioga Road page, which is the source to check if you want the whole run rather than the recent years."), React.createElement("h2", null, "The self-sufficiency rules"), React.createElement("ol", null, React.createElement("li", null, React.createElement("strong", null, "Gas."), " Crane Flat is the last fuel on the west side, pay-at-pump. The next gas is Lee Vining, on the far side of the pass. Start full."), React.createElement("li", null, React.createElement("strong", null, "Water and food."), " In the early season there is no potable water and nothing to buy anywhere along the road. Bring all of both: two liters per person minimum if you are walking anywhere."), React.createElement("li", null, React.createElement("strong", null, "Weather."), " Tioga Pass tops out at 9,945 feet. Early-season mornings run to the 20s and 30s even when the Valley is mild, black ice forms at dawn and dusk, and afternoon storms build fast. Layers, sunglasses against snow glare, and chains in the trunk are the price of admission."), React.createElement("li", null, React.createElement("strong", null, "Signal."), " Cell service is essentially zero from Crane Flat to Lee Vining. Download offline maps before you leave the Valley.")), React.createElement("h2", null, "What the first weeks are for"), React.createElement("p", null, "The reliable early stops are the roadside ones: Olmsted Point for the back side of Half Dome (the half-mile slickrock trail usually dries fast), Tenaya Lake's east beach, the Tuolumne Meadows pullouts, and two short walks, Pothole Dome and the flat road out to Soda Springs. The famous trails above 8,500 feet, Cathedral Lakes, May Lake, Lembert Dome's summit, hold snow weeks longer than the road; walking them in June boots-deep is how meadows get scarred and ankles get broken. The early season rewards drivers, photographers, and modest walkers, not peak-baggers.")), React.createElement(TiogaStatus, null), React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "Check the current status"), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)"
    }
  }, "The current plowing and opening status lives on", " ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tioga.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "the NPS Tioga Road page"), ", and road conditions by phone or text: text \"ynptraffic\" to 333111. The week's park-wide picture, roads, closures, and hours, is condensed on", " ", React.createElement("a", {
    href: "/now",
    onClick: e => {
      e.preventDefault();
      go("now");
    }
  }, "the Park Bulletin"), ", and live webcams and forecasts are on", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "the conditions page"), ".")), React.createElement("section", {
    className: "prose",
    style: {
      marginTop: 48
    }
  }, React.createElement("h2", null, "The bigger day"), React.createElement("p", null, "The move that turns the opening into a full trip is crossing the pass: down 3,000 feet into the Mono Basin, where granite gives way to sagebrush and Mono Lake spreads out below with its tufa towers. Lee Vining, Tioga Lake, Ellery Lake, and the South Tufa boardwalk make the east side a destination, not a turnaround. The hour-by-hour version of that day, every stop, where to eat in Lee Vining, and what the meadows look like under snowmelt, is in", " ", React.createElement("a", {
    href: "/articles/tioga-road-opening-weekend-2026",
    onClick: e => goArticle(e, "tioga-road-opening-weekend-2026")
  }, React.createElement("strong", null, "the opening-weekend field guide →")))), React.createElement(LodgingCta, {
    destination: "Lee Vining, California",
    heading: "Where you sleep in week one",
    note: "Tuolumne Meadows Lodge and White Wolf open on the snowpack's schedule, often well after the road does, so the high country's own beds may not exist yet when the pass opens. Lee Vining is 30 minutes from Tuolumne Meadows on the east side; Groveland is the western equivalent.",
    list: "page_tioga",
    slug: "tioga-opening",
    cta: "Search Lee Vining lodging →"
  }), React.createElement(GuidePromo, {
    go: go,
    location: "tioga-opening",
    title: "Planning the high-country trip around it?",
    body: "The Field Guide app carries the Tioga Road stops with parking notes, offline maps for the stretch with no signal, and a day-by-day planner for the rest of the trip. One purchase, eighteen months of access.",
    style: {
      marginTop: 56,
      marginBottom: 40
    }
  }), React.createElement(NewsletterInline, {
    location: "tioga-opening",
    tag: "tioga-opening",
    heading: "The opening, watched from inside the park",
    blurb: "Sunday Field Notes carries the opening as it develops: plowing progress, the announcement when it lands, and what is actually open up high, week by week. One short letter a week. Free."
  })));
}
window.TiogaOpeningPage = TiogaOpeningPage;
