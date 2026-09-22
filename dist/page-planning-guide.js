var {
  useState: useStatePg,
  useRef: useRefPg,
  useEffect: useEffectPg
} = React;
var PLANNING_PARTS = [{
  part: "Part One · Before you book",
  eyebrow: "Part One",
  title: "Before you book",
  cols: 2,
  lodging: true,
  lede: "The decisions you make from your kitchen table, before the trip starts, are the ones that shape the whole experience. When you visit, where you base, whether the park is in smoke season, whether you have internalized that 2026 is different. Read these four before you put money down."
}, {
  part: "Part Two · Getting there and getting in",
  eyebrow: "Part Two",
  title: "Getting there and getting in",
  cols: 2,
  lede: "Five entrances, four highways, one seasonal pass that does not exist half the year, three parking lots that decide how the day goes, two bus systems that make the lots optional, and a permit system guarding the 95 percent of the park most visitors never see. The logistics of arrival, and the paperwork for going deeper."
}, {
  part: "Part Three · When you arrive",
  eyebrow: "Part Three",
  title: "When you arrive",
  cols: 3,
  lede: "What is in the car, who you are traveling with, whether everyone in your group can hike, and what you can still get today if you arrived with nothing booked. The pragmatic decisions that make a Yosemite day flow or stall. The cooler, the camp chair, the Junior Ranger booklet, the bridge view from a wheelchair, the dog."
}, {
  part: "Part Four · If you're hiking Half Dome",
  eyebrow: "Part Four",
  title: "If you're hiking Half Dome",
  cols: 3,
  lede: "Half Dome is on every Yosemite list. It also requires a permit lottery that most applicants do not win, and the standard approach is the Mist Trail, the most-hiked and most-injured trail in any national park. Three pieces on what the cables, the lottery, and the wet granite actually demand, and the better hike most visitors do not know about."
}, {
  part: "Part Five · The seasonal calendar",
  eyebrow: "Part Five",
  title: "The seasonal calendar",
  cols: 3,
  lede: "Yosemite has at least four seasons inside any given summer. Tioga Road opens, Glacier Point opens, the waterfalls peak and then dry, smoke comes in from somewhere else, and the Milky Way arrives. Knowing what is open and when changes the trip entirely."
}];
function planningPartSlugs(partLabel) {
  var entry = (window.PLANNING_SERIES || []).find(s => s.part === partLabel);
  return entry ? entry.slugs : [];
}
function PlanningGuide({
  go
}) {
  var filters = window.useIntentFilters();
  var resultsRef = useRefPg(null);
  var [jumped, setJumped] = useStatePg(false);
  var matches = window.filterArticlesByIntent(window.ARTICLES, filters.value);
  var filtering = filters.count > 0;
  var listing = filtering || filters.browse;
  useEffectPg(() => {
    if (!jumped) return;
    setJumped(false);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (resultsRef.current) resultsRef.current.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start"
    });
  }, [jumped]);
  var applyIntent = intent => {
    filters.apply(intent);
    setJumped(true);
  };
  var [pendingPart, setPendingPart] = useStatePg(null);
  useEffectPg(() => {
    if (pendingPart == null || listing) return;
    var el = document.getElementById(`part-${pendingPart}`);
    setPendingPart(null);
    if (!el) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start"
    });
    el.focus({
      preventScroll: true
    });
  }, [pendingPart, listing]);
  var jumpToPart = n => e => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (window.track) window.track("cta_click", {
      location: "planning_index",
      target: `#part-${n}`
    });
    if (listing) filters.clear();
    setPendingPart(n);
  };
  return React.createElement("div", {
    className: "page hp-design hp-planning"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "The Planning Guide"
    }],
    eyebrow: "THE PLANNING GUIDE",
    title: React.createElement(React.Fragment, null, "Yosemite,", React.createElement("br", null), "planned ", React.createElement("em", null, "properly.")),
    intro: "The questions that come up before, during, and after a Yosemite trip, answered in the order most visitors actually run into them. Drawn from the full archive of The Talus Field, organized to read like a guide rather than a search result.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "planning_hero",
      className: "hp-button",
      href: "#trip-selector"
    }, "Build a plan for your trip \xA0 ↓"), React.createElement("a", {
      className: "hp-link",
      href: "#part-1",
      onClick: jumpToPart(1)
    }, "Read the guide in order ↓")),
    byline: "Planning advice from inside the park, checked on foot.",
    aside: React.createElement("nav", {
      className: "hp-list hp-partindex",
      "aria-label": "The five parts"
    }, PLANNING_PARTS.map((p, i) => {
      var slugs = planningPartSlugs(p.part);
      var lead = slugs.map(s => window.findArticle(s)).find(a => a && a.image);
      var n = slugs.length;
      return React.createElement("a", {
        key: p.part,
        className: "hp-row",
        href: `#part-${i + 1}`,
        onClick: jumpToPart(i + 1)
      }, lead ? React.createElement(ResponsiveImage, {
        image: lead.image,
        alt: "",
        sizes: "136px"
      }) : React.createElement("span", {
        className: "hp-row__blank",
        "aria-hidden": "true"
      }), React.createElement("div", null, React.createElement("p", {
        className: "hp-eyebrow"
      }, String(i + 1).padStart(2, "0"), " / ", p.eyebrow.toUpperCase()), React.createElement("h3", null, p.title), React.createElement("b", null, n, " ", n === 1 ? "entry" : "entries", " ", React.createElement("span", null, "↓"))));
    }))
  }), React.createElement("section", {
    className: "hp-wrap hp-section hp-planning__selector",
    id: "trip-selector",
    tabIndex: -1
  }, React.createElement(window.TripSelector, {
    go: go,
    onApplyIntent: applyIntent
  })), React.createElement("section", {
    className: "hp-wrap hp-planning__filters",
    ref: resultsRef
  }, React.createElement(window.IntentFilters, {
    articles: window.ARTICLES,
    value: filters.value,
    onToggle: filters.toggle,
    onClear: filters.clear,
    onClearMonth: filters.clearMonth,
    onToggleBrowse: filters.toggleBrowse,
    browse: filters.browse,
    count: filters.count,
    resultCount: matches.length,
    note: "Drawn from the whole archive, not only the five parts below."
  })), listing ? React.createElement("section", {
    className: "hp-wrap hp-section hp-planning__results"
  }, matches.length > 0 ? React.createElement("div", {
    className: "hp-journal-grid"
  }, matches.map(a => React.createElement(HpArticleCard, {
    key: a.slug,
    article: a,
    go: go,
    location: "planning_list"
  }))) : React.createElement("p", {
    className: "hp-sub hp-planning__empty"
  }, "Nothing in the archive carries all of those at once", window.intentMonthOf(filters.value) ? `, in ${window.intentMonthLabel(window.intentMonthOf(filters.value))}` : "", ". Drop a filter and try again, or", " ", React.createElement("a", {
    href: "/search",
    onClick: e => {
      e.preventDefault();
      go("search");
    }
  }, "search the whole site"), "."), React.createElement("p", {
    className: "hp-planning__back"
  }, React.createElement("button", {
    type: "button",
    className: "hp-link",
    onClick: filters.clear
  }, filtering ? "Clear the filters to read the guide in order ↑" : "Back to the five-part guide ↑"))) : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "hp-wrap hp-planning__lead"
  }, React.createElement("p", null, "Yosemite in 2026 is a different park from Yosemite in 2024. The entrance reservation system is gone, the crowds are heavier, the gateway towns matter more, and the difference between a great trip and a frustrating one is almost always strategy, not luck. Here is the strategy, in five parts.")), PLANNING_PARTS.map((p, i) => {
    var items = planningPartSlugs(p.part).map(s => window.findArticle(s)).filter(Boolean);
    return React.createElement("section", {
      key: p.part,
      id: `part-${i + 1}`,
      tabIndex: -1,
      className: "hp-wrap hp-section hp-part"
    }, React.createElement(HpHeading, {
      eyebrow: `${String(i + 1).padStart(2, "0")} / ${p.eyebrow.toUpperCase()}`,
      title: p.title
    }), React.createElement("p", {
      className: "hp-sub"
    }, p.lede), React.createElement("div", {
      className: `hp-journal-grid${p.cols === 2 ? " hp-journal-grid--2" : ""}`
    }, items.map(a => React.createElement(HpArticleCard, {
      key: a.slug,
      article: a,
      go: go,
      location: "planning_part"
    }))), p.lodging && React.createElement("div", {
      className: "hp-part__lodging"
    }, React.createElement(LodgingCta, {
      destination: "Yosemite National Park",
      heading: "The booking with the earliest deadline",
      note: "In-park beds open 366 days ahead and gateway rooms fill six to twelve months out for summer dates. Everything else in this guide flexes; this one does not, which is why it belongs in Part One.",
      list: "page_planning",
      slug: "planning",
      cta: "See what is available on your dates →"
    })));
  }), React.createElement("section", {
    className: "hp-wrap hp-section hp-planning__takeaway"
  }, React.createElement(HpHeading, {
    go: go,
    location: "planning_hub",
    eyebrow: "THE TAKEAWAY",
    title: "Strategy beats research.",
    link: {
      href: "/articles",
      label: "Browse all entries ↗"
    }
  }), React.createElement("p", {
    className: "hp-sub"
  }, "Almost every \"Yosemite was crowded and frustrating\" story comes from a trip that was not planned around the park's actual rhythms. The articles above are how this site closes that gap. Read what is relevant. Skip what is not. Then pack the car.")), React.createElement(HpGuideBand, {
    go: go,
    location: "planning_hub",
    title: "Reading is planning. This is the trip.",
    intro: "The Field Guide app carries the same advice into the park: 50-plus stops with parking and timing notes, offline maps, a day-by-day planner, and the secret guide. Works with no signal, which is most of the park.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "ONE YOSEMITE EMAIL A WEEK",
    title: "Get the conditions before you go",
    heading: "Get the conditions before you go",
    blurb: "Reservation windows, road openings, what's booked out: one Yosemite email a week while you plan. Free.",
    location: "planning_hub",
    tag: "planning"
  })));
}
window.PlanningGuide = PlanningGuide;
