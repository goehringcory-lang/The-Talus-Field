var {
  useMemo,
  useState
} = React;
function HomeHeroCapture({
  tripMonth
}) {
  var [done, setDone] = useState(false);
  var subscribed = isSubscribed();
  var ref = useNewsletterImpression("home_hero", "home", !subscribed && !done);
  if (subscribed && !done) {
    return React.createElement("p", {
      className: "hero__capture-note",
      ref: ref
    }, "You're on the list. ", React.createElement("a", {
      href: "/map"
    }, "The map's trip builder is open to you →"));
  }
  if (done) {
    return React.createElement("p", {
      className: "hero__capture-note",
      ref: ref
    }, "You're in. ", React.createElement("a", {
      href: "/map"
    }, "The trip builder is open to you →"));
  }
  return React.createElement("div", {
    ref: ref
  }, React.createElement("form", {
    className: "hero__capture nlbox__form",
    action: "https://buttondown.com/api/emails/embed-subscribe/goehring",
    method: "post",
    target: "buttondown-target",
    onSubmit: () => {
      if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("home_hero", "home");
      setTimeout(() => setDone(true), 0);
    }
  }, React.createElement("input", {
    type: "email",
    name: "email",
    "aria-label": "Email address",
    placeholder: "you@email.com",
    required: true
  }), React.createElement("input", {
    type: "hidden",
    name: "tag",
    value: tripMonth ? `trip-${tripMonth}` : "home"
  }), React.createElement("input", {
    type: "hidden",
    name: "embed",
    value: "1"
  }), React.createElement("button", {
    type: "submit"
  }, "Get the Sunday letter →")), React.createElement("p", {
    className: "hero__capture-note"
  }, "What is open, what is booking out, and what the week looked like from inside the park. The map's trip builder comes with it."));
}
var RESUME_MAX_AGE_DAYS = 30;
function ResumeReading({
  go
}) {
  var last = React.useMemo(() => window.readHistory ? window.readHistory.last() : null, []);
  var article = last ? window.findArticle(last.slug) : null;
  var ageDays = last && last.at ? (Date.now() - new Date(last.at).getTime()) / 86400000 : 0;
  var show = Boolean(article) && ageDays < RESUME_MAX_AGE_DAYS;
  React.useEffect(() => {
    if (show && window.track) window.track("resume_shown", {
      slug: last.slug,
      percent: last.pct
    });
  }, [show]);
  if (!show) return null;
  var totalMin = parseInt(article.read, 10);
  var remaining = Number.isFinite(totalMin) ? `About ${Math.max(1, Math.round(totalMin * (100 - last.pct) / 100))} min left` : `${last.pct}% read`;
  return React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 40
    }
  }, React.createElement("a", {
    className: "resume-band",
    href: `/articles/${article.slug}`,
    onClick: e => {
      e.preventDefault();
      window.safeStorage.set("tfg.read.resume", article.slug);
      if (window.track) window.track("resume_click", {
        slug: article.slug,
        percent: last.pct
      });
      go(`a:${article.slug}`);
    }
  }, React.createElement("span", {
    className: "eyebrow eyebrow--moss"
  }, "Where you left off"), React.createElement("span", {
    className: "resume-band__title"
  }, article.title), React.createElement("span", {
    className: "resume-band__meta"
  }, remaining), React.createElement("span", {
    className: "mono resume-band__cta"
  }, "Keep reading →")));
}
var HOME_BULLETIN_URL = "/bulletin.json?v=2";
function HomeBulletin({
  go
}) {
  var [edition, setEdition] = React.useState(null);
  React.useEffect(() => {
    var cancelled = false;
    fetch(HOME_BULLETIN_URL).then(r => r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))).then(data => {
      var e = data && data.edition;
      if (!cancelled && e && e.label && e.lede) setEdition(e);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  if (!edition) return null;
  return React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 44
    }
  }, React.createElement("a", {
    className: "home-dispatch",
    href: "/now",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "home_dispatch"
      });
      go("now");
    }
  }, React.createElement("span", {
    className: "home-dispatch__date"
  }, "The Park Bulletin · covering ", edition.label), React.createElement("span", {
    className: "home-dispatch__title"
  }, "One page, the whole park, right now"), React.createElement("p", {
    className: "home-dispatch__excerpt"
  }, edition.lede), React.createElement("span", {
    className: "mono home-dispatch__cta"
  }, "Scan the bulletin →")));
}
var MONTHS = [{
  key: "jan",
  label: "Jan",
  name: "January",
  note: "The quiet season. The Valley is open and mostly empty, the waterfalls run low, the high roads are closed, and chain rules come and go with the storms.",
  reads: ["yosemite-in-winter", "when-to-visit-yosemite-2026-crowd-forecast"]
}, {
  key: "feb",
  label: "Feb",
  name: "February",
  note: "Firefall month. For about two weeks Horsetail Fall can glow at sunset when sky, water, and angle all cooperate, and the rest of the park is still honest winter.",
  reads: ["horsetail-fall-firefall", "yosemite-in-winter"]
}, {
  key: "mar",
  label: "Mar",
  name: "March",
  note: "Late winter, first runoff. Storms still land, the falls start to wake, the crowds have not arrived, and the high roads stay closed.",
  reads: ["yosemite-in-winter", "yosemite-waterfalls-guide"]
}, {
  key: "apr",
  label: "Apr",
  name: "April",
  note: "The Valley greens up and the waterfalls build by the week. Dogwoods usually bloom late in the month. Tioga is still closed most years.",
  reads: ["yosemite-waterfalls-guide", "yosemite-wildflowers-guide"]
}, {
  key: "may",
  label: "May",
  name: "May",
  note: "Peak waterfall month and the last calmer weeks before summer. The high roads usually begin to open. Lodging books far ahead; day plans still work.",
  reads: ["yosemite-waterfalls-guide", "when-to-visit-yosemite-2026-crowd-forecast"]
}, {
  key: "jun",
  label: "Jun",
  name: "June",
  note: "Early summer. Strong falls at the start of the month, the high country opening, and school-break crowds building toward their peak.",
  reads: ["yosemite-in-june-2026", "yosemite-waterfalls-guide"]
}, {
  key: "jul",
  label: "Jul",
  name: "July",
  note: "Full summer. Every road is typically open, the Valley runs hot and busy, the big falls thin, and evenings in the high country are the move. Have a smoke plan.",
  reads: ["yosemite-heat-safety-guide", "yosemite-during-smoke-season"]
}, {
  key: "aug",
  label: "Aug",
  name: "August",
  note: "High summer. Hot in the Valley, settled weather up high, the falls at a trickle, and the darkest skies of the year for the Milky Way. Smoke is a real possibility.",
  reads: ["yosemite-stargazing-where-to-look-up", "yosemite-heat-safety-guide"]
}, {
  key: "sep",
  label: "Sep",
  name: "September",
  note: "The exhale. Crowds ease after Labor Day, the weather usually holds, the falls are at their lowest, and smoke can linger into fall.",
  reads: ["when-to-visit-yosemite-2026-crowd-forecast", "yosemite-during-smoke-season"]
}, {
  key: "oct",
  label: "Oct",
  name: "October",
  note: "Fall. Cooler days, color along the Merced, quieter trails, and the first real storms possible late in the month.",
  reads: ["yosemite-photography-spots", "yosemite-during-smoke-season"]
}, {
  key: "nov",
  label: "Nov",
  name: "November",
  note: "The shoulder. Short days, empty trails, the first lasting snow most years, and the high roads close for the season.",
  reads: ["yosemite-in-winter", "when-to-visit-yosemite-2026-crowd-forecast"]
}, {
  key: "dec",
  label: "Dec",
  name: "December",
  note: "Early winter. First snow when storms land, holiday crowds around the lodges midmonth onward, and chains in the car as a rule.",
  reads: ["yosemite-in-winter", "yosemite-photography-spots"]
}];
function HomeMonthPlanner({
  month,
  onSelect,
  go
}) {
  var sel = MONTHS.find(m => m.key === month) || null;
  var reads = sel ? sel.reads.map(s => window.findArticle(s)).filter(Boolean) : [];
  var isCurrentMonth = Boolean(sel) && sel.name === new Date().toLocaleDateString("en-US", {
    month: "long"
  });
  var linkClick = (e, target, dest) => {
    e.preventDefault();
    if (window.track) window.track("cta_click", {
      location: "home_month",
      target
    });
    go(dest);
  };
  return React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 28
    }
  }, React.createElement("div", {
    className: "month-planner"
  }, React.createElement("div", {
    className: "month-planner__head"
  }, React.createElement("span", {
    className: "month-planner__label"
  }, "When are you going?"), React.createElement("div", {
    className: "month-planner__chips",
    role: "group",
    "aria-label": "Pick your trip month"
  }, MONTHS.map(m => React.createElement("button", {
    key: m.key,
    type: "button",
    className: "month-chip" + (m.key === month ? " month-chip--on" : ""),
    "aria-pressed": m.key === month,
    onClick: () => onSelect(m.key === month ? null : m.key)
  }, m.label)))), sel && React.createElement("div", {
    className: "month-planner__panel"
  }, React.createElement("p", {
    className: "month-planner__note"
  }, React.createElement("strong", null, sel.name, "."), " ", sel.note), React.createElement("div", {
    className: "month-planner__links"
  }, reads.map(a => React.createElement("a", {
    key: a.slug,
    href: `/articles/${a.slug}`,
    onClick: e => linkClick(e, a.slug, `a:${a.slug}`)
  }, a.title, " →")), React.createElement("a", {
    href: "/itineraries",
    onClick: e => linkClick(e, "itineraries", "itineraries")
  }, "Build the days: Itineraries →"), isCurrentMonth && React.createElement("a", {
    href: "/now",
    onClick: e => linkClick(e, "now", "now")
  }, "Going now: The Park Bulletin →")), React.createElement("p", {
    className: "month-planner__hint"
  }, "Typical season, not a forecast. The Bulletin and Conditions carry the current state."))));
}
var HERO_DOORS = [{
  key: "start-here",
  href: "#start-here",
  q: "First trip?",
  a: "Four answers before you book anything"
}, {
  key: "itineraries",
  href: "/itineraries",
  q: "Dates set?",
  a: "Itineraries, the map, and the checklist"
}, {
  key: "now",
  href: "/now",
  q: "There now, or going soon?",
  a: "One page, the whole park, right now"
}];
var START_HERE_QUESTIONS = {
  "first-time-yosemite-overwhelm": "First time, and it feels like a lot?",
  "yosemite-without-reservations-2026": "Do you need a reservation this year?",
  "yosemite-gateway-towns-compared": "Where should you actually stay?",
  "yosemite-in-one-or-two-days": "Only have a day or two?"
};
function HomePage({
  go
}) {
  var recent = window.ARTICLES.slice(0, 6);
  var startHere = (window.START_HERE || []).map(slug => window.findArticle(slug)).filter(Boolean);
  var [tripMonth, setTripMonth] = useState(() => {
    var v = window.safeStorage.get("tfg.trip.month", null);
    return MONTHS.some(m => m.key === v) ? v : null;
  });
  var selectTripMonth = key => {
    setTripMonth(key);
    if (key) window.safeStorage.set("tfg.trip.month", key);else window.safeStorage.remove("tfg.trip.month");
    if (window.track) window.track("trip_month_select", {
      month: key || "cleared"
    });
  };
  var scrollToStartHere = e => {
    e.preventDefault();
    document.getElementById("start-here")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  var parkThisWeekSection = React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 64
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "From the park, right now"), React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "Conditions and webcams →")), React.createElement(WebcamStrip, null));
  return React.createElement("div", {
    className: "page"
  }, React.createElement("section", {
    className: "hero"
  }, React.createElement("div", {
    className: "wrap hero__grid"
  }, React.createElement("div", null, React.createElement("div", {
    className: "hero__kicker"
  }, React.createElement("span", {
    className: "dot"
  }), React.createElement("span", null, window.SITE && window.SITE.issue || "Vol. III", window.SITE && window.SITE.issueDetail ? ` · ${window.SITE.issueDetail}` : "")), React.createElement("h1", null, "Yosemite, from the inside."), React.createElement("p", {
    className: "hero__dek"
  }, "Live conditions, real itineraries, and a map of every turnout, kept by a naturalist who has lived here twenty seasons. Essays for when the logistics are done."), React.createElement("nav", {
    className: "hero-doors",
    "aria-label": "Start from where you are"
  }, HERO_DOORS.map(d => React.createElement("a", {
    key: d.key,
    className: "hero-door",
    href: d.href,
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "home_door",
        target: d.key
      });
      if (d.key === "start-here") scrollToStartHere(e);else go(d.key);
    }
  }, React.createElement("span", {
    className: "hero-door__q"
  }, d.q), React.createElement("span", {
    className: "hero-door__a"
  }, d.a), React.createElement("span", {
    className: "hero-door__arrow",
    "aria-hidden": "true"
  }, "→")))), React.createElement(HomeHeroCapture, {
    tripMonth: tripMonth
  })), React.createElement(Placeholder, {
    caption: "El Capitan and Bridalveil at sunset",
    credit: "Rodrigo Soares / Unsplash",
    image: "img/valley-view-sunset-rodrigo-soares.jpg",
    tag: "PLATE I",
    size: "lg",
    natural: true,
    eager: true,
    motif: React.createElement(MotifMountains, null)
  }))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 28
    }
  }, React.createElement("nav", {
    className: "home-utility",
    "aria-label": "Trip tools"
  }, React.createElement("span", {
    className: "home-utility__label"
  }, "Plan your trip"), [["map", "/map", "The Map"], ["itineraries", "/itineraries", "Itineraries"], ["planning", "/planning", "Planning Guide"], ["checklist", "/checklist", "Checklist"], ["conditions", "/conditions", "Conditions"]].map(([key, href, label], i) => React.createElement(React.Fragment, {
    key: key
  }, i > 0 && React.createElement("span", {
    className: "home-utility__sep",
    "aria-hidden": "true"
  }, "·"), React.createElement("a", {
    href: href,
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("home_utility_click", {
        target: key
      });
      go(key);
    }
  }, label))))), React.createElement(HomeMonthPlanner, {
    month: tripMonth,
    onSelect: selectTripMonth,
    go: go
  }), React.createElement(ResumeReading, {
    go: go
  }), React.createElement(HomeBulletin, {
    go: go
  }), startHere.length > 0 && React.createElement("section", {
    id: "start-here",
    className: "wrap",
    style: {
      paddingTop: 72,
      scrollMarginTop: 24
    }
  }, React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 14
    }
  }, "For first-time visitors"), React.createElement("h2", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 44,
      lineHeight: 1.05,
      marginBottom: 12,
      fontWeight: 500,
      letterSpacing: "-0.01em",
      textTransform: "none"
    }
  }, "Start here."), React.createElement("p", {
    style: {
      fontFamily: "var(--display)",
      fontStyle: "italic",
      fontSize: 19,
      color: "var(--ink-2)",
      lineHeight: 1.5,
      maxWidth: "60ch"
    }
  }, "Four answers before you book anything.")), React.createElement("div", {
    className: "start-here-grid",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 32,
      rowGap: 40
    }
  }, startHere.map(a => React.createElement("div", {
    key: a.slug,
    className: "start-q"
  }, START_HERE_QUESTIONS[a.slug] && React.createElement("p", {
    className: "start-q__label"
  }, START_HERE_QUESTIONS[a.slug]), React.createElement(ArticleCard, {
    article: a,
    go: go
  }))))), parkThisWeekSection, React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 80
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Latest Entries"), React.createElement("a", {
    href: "/articles",
    onClick: e => {
      e.preventDefault();
      go("articles");
    }
  }, "All entries →")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 36,
      rowGap: 48
    }
  }, recent.map(a => React.createElement(ArticleCard, {
    key: a.slug,
    article: a,
    go: go
  })))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 80
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "By Section"), React.createElement("a", {
    href: "/articles",
    onClick: e => {
      e.preventDefault();
      go("articles");
    }
  }, "Everything →")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 0,
      borderTop: "1px solid var(--ink)",
      borderLeft: "1px solid var(--ink)"
    }
  }, window.CATEGORIES.map((c, i) => {
    var count = window.byCategory(c.slug).length;
    return React.createElement("a", {
      key: c.slug,
      href: `/section/${c.slug}`,
      onClick: e => {
        e.preventDefault();
        go(`cat:${c.slug}`);
      },
      style: {
        textDecoration: "none",
        color: "inherit",
        borderRight: "1px solid var(--ink)",
        borderBottom: "1px solid var(--ink)",
        padding: 28,
        display: "block"
      }
    }, React.createElement("div", {
      className: "mono",
      style: {
        color: "var(--moss)",
        fontWeight: 700
      }
    }, "№ 0", i + 1), React.createElement("div", {
      style: {
        fontFamily: "var(--display)",
        fontSize: 26,
        fontWeight: 500,
        margin: "16px 0 10px",
        letterSpacing: "-0.005em",
        lineHeight: 1.1
      }
    }, c.label), React.createElement("div", {
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 15,
        color: "var(--ink-2)",
        lineHeight: 1.45,
        marginBottom: 20
      }
    }, c.blurb), React.createElement("div", {
      style: {
        fontFamily: "var(--sans)",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: "var(--ink-3)",
        fontWeight: 700
      }
    }, count, " ", count === 1 ? "Entry" : "Entries", " →"));
  }))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 80
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Go Deeper")), React.createElement("a", {
    href: "/map",
    onClick: e => {
      e.preventDefault();
      go("map");
    },
    style: {
      display: "block",
      textDecoration: "none",
      color: "inherit",
      border: "1px solid var(--ink)",
      borderLeft: "6px solid var(--moss)",
      background: "var(--paper-2)",
      padding: "36px 32px"
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: 48,
      alignItems: "center"
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "The Map · Free"), React.createElement("div", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 36,
      fontWeight: 400,
      lineHeight: 1.1,
      letterSpacing: "-0.01em"
    }
  }, "Yosemite, on a map.")), React.createElement("div", null, React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 19,
      lineHeight: 1.5,
      color: "var(--ink-2)",
      margin: 0,
      marginBottom: 16
    }
  }, "Every vista, trailhead, parking turnout, and meal in one interactive map. Browse it free. A newsletter signup unlocks the trip builder: tap pins to assemble a route, or load a suggested one-, two-, or three-day trip."), React.createElement("div", {
    className: "mono",
    style: {
      color: "var(--moss)",
      fontWeight: 700,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.18em"
    }
  }, "Open the map →")))), React.createElement("a", {
    className: "band-guide",
    href: "/guide",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("guide_cta_click", {
        location: "home_band"
      });
      go("guide");
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: 48,
      alignItems: "center"
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "band-guide__eyebrow"
  }, "The Field Guide · $19"), React.createElement("div", {
    className: "band-guide__title"
  }, "The park, in your pocket.")), React.createElement("div", null, React.createElement("p", {
    className: "band-guide__body"
  }, "The app version of this journal: 50-plus stops with parking and timing notes, offline maps, a trip planner, and the secret guide. Works with no signal, which is most of the park. One purchase, eighteen months of access."), React.createElement("div", {
    className: "mono band-guide__cta"
  }, "See the Field Guide →")))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24,
      marginTop: 24
    }
  }, [{
    key: "planning",
    eyebrow: "The Planning Guide · Free",
    title: "Yosemite, planned properly.",
    blurb: "The full archive organized for a real trip: gateway towns, reservations, Half Dome, smoke season, in the order you'll need them.",
    cta: "Read the guide →"
  }, {
    key: "consult",
    eyebrow: "Field Consult · $95",
    title: "Your plan, thirty minutes.",
    blurb: "One on one with a naturalist who lives in the park: your dates, your group, your plan taken apart and put back together. Six a month.",
    cta: "Book a consult →"
  }, {
    key: "kit",
    eyebrow: "The Kit",
    title: "What I carry.",
    blurb: "Three lists for three trips: day pack, overnight pack, car kit. The actual gear, with the actual reasons, and a plain disclosure.",
    cta: "See the kit →"
  }].map(p => React.createElement("a", {
    key: p.key,
    href: `/${p.key}`,
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "home_path",
        target: p.key
      });
      go(p.key);
    },
    style: {
      display: "block",
      textDecoration: "none",
      color: "inherit",
      border: "1px solid var(--ink)",
      padding: 28
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, p.eyebrow), React.createElement("div", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 26,
      fontWeight: 500,
      lineHeight: 1.1,
      letterSpacing: "-0.005em",
      marginBottom: 10
    }
  }, p.title), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 15,
      color: "var(--ink-2)",
      lineHeight: 1.45,
      margin: "0 0 18px"
    }
  }, p.blurb), React.createElement("div", {
    className: "mono",
    style: {
      color: "var(--moss)",
      fontWeight: 700,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.18em"
    }
  }, p.cta))))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 96
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 48,
      alignItems: "center",
      borderTop: "2px solid var(--ink)",
      borderBottom: "2px solid var(--ink)",
      padding: "56px 0"
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 14
    }
  }, "From the Editor"), React.createElement("h2", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 38,
      marginBottom: 18,
      fontWeight: 400,
      lineHeight: 1.1,
      letterSpacing: "-0.01em",
      textTransform: "none"
    }
  }, "The same waterfall, again, in a different year."), React.createElement("p", {
    style: {
      fontFamily: "var(--display)",
      fontStyle: "italic",
      fontSize: 19,
      color: "var(--ink-2)",
      lineHeight: 1.5,
      marginBottom: 24
    }
  }, "The park looks like a single place from a postcard and like four different ones from a parking lot. This is a record of looking at it slowly."), React.createElement("a", {
    className: "btn btn--ghost",
    href: "/about",
    onClick: e => {
      e.preventDefault();
      go("about");
    }
  }, "About the editor →"), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      lineHeight: 1.6,
      margin: "20px 0 0"
    }
  }, "The whole park fits on one page.", " ", React.createElement("a", {
    href: "/now",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "home_strip_now"
      });
      go("now");
    },
    style: {
      color: "var(--ink-2)"
    }
  }, "The Park Bulletin is current →"))), React.createElement(NewsletterInline, {
    location: "home_strip",
    tag: "home"
  }))));
}
window.HomePage = HomePage;
