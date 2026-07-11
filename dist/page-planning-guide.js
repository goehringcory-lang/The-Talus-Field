function PlanningGuide({
  go
}) {
  var find = slug => window.findArticle(slug);
  var firstTime = find("first-time-yosemite-overwhelm");
  var withoutReservations = find("yosemite-without-reservations-2026");
  var gateway = find("yosemite-gateway-towns-compared");
  var smoke = find("yosemite-during-smoke-season");
  var packCar = find("pack-your-car-for-yosemite");
  var withKids = find("yosemite-with-kids-no-reservations-2026");
  var nonHikers = find("yosemite-for-non-hikers");
  var halfDomePermit = find("half-dome-permit-lottery-2026");
  var soYouWantHalfDome = find("so-you-want-to-hike-half-dome");
  var mistTrail = find("mist-trail-the-real-guide");
  var tioga = find("tioga-road-opening-weekend-2026");
  var glacierPoint = find("glacier-point-road-open-2026");
  var stargazing = find("yosemite-stargazing-where-to-look-up");
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
  }, React.createElement("div", {
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
  }, "Yosemite in 2026 is a different park from Yosemite in 2024. The entrance reservation system is gone, the crowds are heavier, the gateway towns matter more, and the difference between a great trip and a frustrating one is almost always strategy, not luck. Here is the strategy, in four parts."), React.createElement("section", {
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
  }, "Part One"), React.createElement("h2", {
    style: sectionH2
  }, "Before you book"), React.createElement("p", {
    style: sectionLede
  }, "The decisions you make from your kitchen table, before the trip starts, are the ones that shape the whole experience. When you visit, where you base, whether the park is in smoke season, whether you have internalized that 2026 is different. Read these four before you put money down."), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 36,
      rowGap: 48
    }
  }, React.createElement(ArticleCard, {
    article: firstTime,
    go: go
  }), React.createElement(ArticleCard, {
    article: withoutReservations,
    go: go
  }), React.createElement(ArticleCard, {
    article: gateway,
    go: go
  }), React.createElement(ArticleCard, {
    article: smoke,
    go: go
  }))), React.createElement("section", {
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
  }, "Part Two"), React.createElement("h2", {
    style: sectionH2
  }, "When you arrive"), React.createElement("p", {
    style: sectionLede
  }, "What is in the car, who you are traveling with, whether everyone in your group can hike. The pragmatic decisions that make a Yosemite day flow or stall. The cooler, the camp chair, the Junior Ranger booklet, the bridge view from a wheelchair."), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 36,
      rowGap: 48
    }
  }, React.createElement(ArticleCard, {
    article: packCar,
    go: go
  }), React.createElement(ArticleCard, {
    article: withKids,
    go: go
  }), React.createElement(ArticleCard, {
    article: nonHikers,
    go: go
  }))), React.createElement("section", {
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
  }, "Part Three"), React.createElement("h2", {
    style: sectionH2
  }, "If you're hiking Half Dome"), React.createElement("p", {
    style: sectionLede
  }, "Half Dome is on every Yosemite list. It also requires a permit lottery that most applicants do not win, and the standard approach is the Mist Trail, the most-hiked and most-injured trail in any national park. Three pieces on what the cables, the lottery, and the wet granite actually demand, and the better hike most visitors do not know about."), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 36,
      rowGap: 48
    }
  }, React.createElement(ArticleCard, {
    article: halfDomePermit,
    go: go
  }), React.createElement(ArticleCard, {
    article: soYouWantHalfDome,
    go: go
  }), React.createElement(ArticleCard, {
    article: mistTrail,
    go: go
  }))), React.createElement("section", {
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
  }, "Part Four"), React.createElement("h2", {
    style: sectionH2
  }, "The seasonal calendar"), React.createElement("p", {
    style: sectionLede
  }, "Yosemite has at least four seasons inside any given summer. Tioga Road opens, Glacier Point opens, the waterfalls peak and then dry, smoke comes in from somewhere else, and the Milky Way arrives. Knowing what is open and when changes the trip entirely."), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 36,
      rowGap: 48
    }
  }, React.createElement(ArticleCard, {
    article: tioga,
    go: go
  }), React.createElement(ArticleCard, {
    article: glacierPoint,
    go: go
  }), React.createElement(ArticleCard, {
    article: stargazing,
    go: go
  }))), React.createElement("section", {
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
    heading: "Sunday Field Notes",
    blurb: "One Yosemite email a week, when there is something to say. Free."
  })))));
}
window.PlanningGuide = PlanningGuide;
