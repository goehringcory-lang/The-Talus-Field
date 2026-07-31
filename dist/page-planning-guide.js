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
  lede: "Five entrances, four highways, one seasonal pass that does not exist half the year, and a permit system guarding the 95 percent of the park most visitors never see. The logistics of arrival, and the paperwork for going deeper."
}, {
  part: "Part Three · When you arrive",
  eyebrow: "Part Three",
  title: "When you arrive",
  cols: 3,
  lede: "What is in the car, who you are traveling with, whether everyone in your group can hike. The pragmatic decisions that make a Yosemite day flow or stall. The cooler, the camp chair, the Junior Ranger booklet, the bridge view from a wheelchair, the dog."
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
  useEffectPg(() => {
    if (!jumped) return;
    setJumped(false);
    if (resultsRef.current) resultsRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [jumped]);
  var applyIntent = intent => {
    filters.apply(intent);
    setJumped(true);
  };
  var sectionH2 = {
    fontFamily: "var(--display)",
    fontSize: 40,
    fontWeight: 500,
    lineHeight: 1.1,
    marginBottom: 20,
    letterSpacing: "-0.01em"
  };
  var sectionLede = {
    fontFamily: "var(--serif)",
    fontSize: 19,
    lineHeight: 1.55,
    color: "var(--ink-1)",
    maxWidth: 760,
    marginBottom: 32
  };
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
      label: "The Planning Guide"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "The Planning Guide"), React.createElement("h1", null, "Yosemite, planned properly."), React.createElement("p", {
    className: "page-head__dek"
  }, "The questions that come up before, during, and after a Yosemite trip, answered in the order most visitors actually run into them. Drawn from the full archive of The Talus Field, organized to read like a guide rather than a search result."), React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      color: "var(--ink-3)",
      fontWeight: 700,
      marginTop: 12
    }
  }, "Planning advice from inside the park, checked on foot."))), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 40
    }
  }, React.createElement(window.TripSelector, {
    go: go,
    onApplyIntent: applyIntent
  })), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 48
    },
    ref: resultsRef
  }, React.createElement(window.IntentFilters, {
    articles: window.ARTICLES,
    value: filters.value,
    onToggle: filters.toggle,
    onClear: filters.clear,
    count: filters.count,
    resultCount: matches.length,
    note: "Drawn from the whole archive, not only the five parts below."
  })), filtering ? React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 40,
      paddingBottom: 96
    }
  }, matches.length > 0 ? React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 36,
      rowGap: 56
    }
  }, matches.map(a => React.createElement(ArticleCard, {
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
  }, "Nothing in the archive carries all of those at once. Drop a filter and try again, or", " ", React.createElement("a", {
    href: "/search",
    onClick: e => {
      e.preventDefault();
      go("search");
    }
  }, "search the whole site"), "."), React.createElement("p", {
    style: {
      marginTop: 40,
      fontFamily: "var(--sans)",
      fontSize: 14,
      color: "var(--ink-3)"
    }
  }, React.createElement("button", {
    type: "button",
    className: "linkish",
    onClick: filters.clear
  }, "Clear the filters to read the guide in order →"))) : React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 56
    }
  }, React.createElement("p", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 22,
      lineHeight: 1.5,
      color: "var(--ink-2)",
      maxWidth: 760,
      marginBottom: 56
    }
  }, "Yosemite in 2026 is a different park from Yosemite in 2024. The entrance reservation system is gone, the crowds are heavier, the gateway towns matter more, and the difference between a great trip and a frustrating one is almost always strategy, not luck. Here is the strategy, in five parts."), PLANNING_PARTS.map(p => {
    var items = planningPartSlugs(p.part).map(s => window.findArticle(s)).filter(Boolean);
    return React.createElement("section", {
      key: p.part,
      style: {
        paddingTop: 32,
        paddingBottom: 56,
        borderTop: "1px solid var(--rule)"
      }
    }, React.createElement("div", {
      className: "eyebrow eyebrow--moss",
      style: {
        marginTop: 32,
        marginBottom: 12
      }
    }, p.eyebrow), React.createElement("h2", {
      style: sectionH2
    }, p.title), React.createElement("p", {
      style: sectionLede
    }, p.lede), React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(${p.cols}, 1fr)`,
        gap: 36,
        rowGap: 48
      }
    }, items.map(a => React.createElement(ArticleCard, {
      key: a.slug,
      article: a,
      go: go
    }))), p.lodging && React.createElement("div", {
      style: {
        maxWidth: 760
      }
    }, React.createElement(LodgingCta, {
      destination: "Yosemite National Park",
      heading: "The booking with the earliest deadline",
      note: "In-park beds open 366 days ahead and gateway rooms fill six to twelve months out for summer dates. Everything else in this guide flexes; this one does not, which is why it belongs in Part One.",
      list: "page_planning",
      slug: "planning",
      cta: "See what is available on your dates →"
    })));
  }), React.createElement("section", {
    style: {
      paddingTop: 32,
      paddingBottom: 96,
      borderTop: "2px solid var(--ink)"
    }
  }, React.createElement("div", {
    style: {
      marginTop: 56,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 48,
      alignItems: "start"
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 14
    }
  }, "The takeaway"), React.createElement("h2", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.15,
      letterSpacing: "-0.01em",
      marginBottom: 16
    }
  }, "Strategy beats research."), React.createElement("p", {
    style: {
      fontFamily: "var(--display)",
      fontStyle: "italic",
      fontSize: 19,
      color: "var(--ink-2)",
      lineHeight: 1.5,
      marginBottom: 24
    }
  }, "Almost every \"Yosemite was crowded and frustrating\" story comes from a trip that was not planned around the park's actual rhythms. The articles above are how this site closes that gap. Read what is relevant. Skip what is not. Then pack the car."), React.createElement("a", {
    className: "btn btn--ghost",
    href: "/articles",
    onClick: e => {
      e.preventDefault();
      go("articles");
    }
  }, "Browse all entries →")), React.createElement(NewsletterInline, {
    location: "planning_hub",
    tag: "planning",
    heading: "Get the conditions before you go",
    blurb: "Reservation windows, road openings, what's booked out: one Yosemite email a week while you plan. Free."
  })), React.createElement(GuidePromo, {
    go: go,
    location: "planning_hub",
    title: "Reading is planning. This is the trip.",
    body: "The Field Guide app carries the same advice into the park: 50-plus stops with parking and timing notes, offline maps, a day-by-day planner, and the secret guide. Works with no signal, which is most of the park.",
    style: {
      maxWidth: 680,
      marginTop: 56
    }
  }))));
}
window.PlanningGuide = PlanningGuide;
