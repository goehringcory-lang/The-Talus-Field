function ChecklistPage({
  go
}) {
  var sectionStyle = {
    marginBottom: 40,
    paddingBottom: 24,
    borderBottom: "1px solid var(--rule)"
  };
  var sectionLabel = {
    fontFamily: "var(--sans)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontWeight: 700,
    color: "var(--moss)",
    marginBottom: 6
  };
  var sectionTitle = {
    fontFamily: "var(--display)",
    fontSize: 28,
    fontWeight: 500,
    lineHeight: 1.15,
    letterSpacing: "-0.005em",
    marginBottom: 18
  };
  var item = {
    display: "block",
    fontFamily: "var(--serif)",
    fontSize: 17,
    lineHeight: 1.5,
    color: "var(--ink-1)",
    padding: "8px 0",
    cursor: "pointer"
  };
  var cb = {
    marginRight: 12,
    transform: "translateY(2px)",
    accentColor: "var(--moss)"
  };
  var note = {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 15,
    color: "var(--ink-2)",
    lineHeight: 1.5,
    marginTop: 4,
    marginLeft: 28
  };
  var A = ({
    r,
    children
  }) => React.createElement("a", {
    href: r.startsWith("a:") ? `/articles/${r.slice(2)}` : `/${r}`,
    onClick: e => {
      e.preventDefault();
      go(r);
    }
  }, children);
  return React.createElement("div", {
    className: "page page-checklist"
  }, React.createElement("style", null, `
        @media print {
          header, footer, .tweaks-panel, .page-head__dek + *, .nlbox { display: none !important; }
          .page-checklist { padding: 0 !important; }
          .page-checklist .page-head { padding: 0 !important; margin-bottom: 16pt !important; }
          .page-checklist h1 { font-size: 22pt !important; }
          .page-checklist .checklist-section { page-break-inside: avoid; }
          body { background: white !important; color: black !important; }
          a { color: black !important; text-decoration: none !important; }
        }
      `), React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "The First-Week Checklist"), React.createElement("h1", null, "Yosemite, in one printable page."), React.createElement("p", {
    className: "page-head__dek"
  }, "A condensed action list for planning a Yosemite trip in 2026, drawn from the full archive of The Talus Field. Print it, check things off, take it in the car. The longer essays behind each line are linked throughout, and collected at the bottom."), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      marginTop: 14
    }
  }, "Tip: ", React.createElement("strong", null, "Cmd+P"), " (or Ctrl+P) for a clean print version."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 56,
      paddingBottom: 80
    }
  }, React.createElement("section", {
    className: "checklist-section",
    style: sectionStyle
  }, React.createElement("div", {
    style: sectionLabel
  }, "I · Window of arrival"), React.createElement("h2", {
    style: sectionTitle
  }, "When to come"), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Late May to early June for ", React.createElement(A, {
    r: "a:mist-trail-the-real-guide"
  }, "peak waterfalls"), " and ", React.createElement(A, {
    r: "a:memorial-day-skip-the-valley-go-high-2026"
  }, "high country"), " still snowy."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "September to October for low crowds and golden light."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Avoid July and August weekends. Heat plus crowds plus possible smoke."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement(A, {
    r: "a:yosemite-during-smoke-season"
  }, "Smoke season"), " runs roughly July through October. Build a contingency."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "2026 note: ", React.createElement(A, {
    r: "a:yosemite-without-reservations-2026"
  }, "no entrance reservation is required"), ". A standard pass is all you need.")), React.createElement("section", {
    className: "checklist-section",
    style: sectionStyle
  }, React.createElement("div", {
    style: sectionLabel
  }, "II · What to book in advance"), React.createElement("h2", {
    style: sectionTitle
  }, "The non-flexible reservations"), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "In-park lodging: 6 to 12 months ahead (Ahwahnee, Valley Lodge, Curry Village)."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Gateway-town lodging"), ": 1 to 3 months ahead for summer dates."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement(A, {
    r: "a:half-dome-permit-lottery-2026"
  }, "Half Dome preseason lottery"), ": apply March 1 to 31 on Recreation.gov."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement(A, {
    r: "a:tioga-road-opening-weekend-2026"
  }, "Tuolumne Meadows"), " campground: opens on Recreation.gov in advance; books fast."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement(A, {
    r: "a:yosemite-wilderness-permits-guide"
  }, "Wilderness permits"), " for overnight trips: apply 24 weeks ahead via Recreation.gov.")), React.createElement("section", {
    className: "checklist-section",
    style: sectionStyle
  }, React.createElement("div", {
    style: sectionLabel
  }, "III · What not to book"), React.createElement("h2", {
    style: sectionTitle
  }, "Common mistakes"), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Don't lock a ", React.createElement(A, {
    r: "a:first-time-yosemite-overwhelm"
  }, "rigid day-by-day itinerary"), ". Weather and ", React.createElement(A, {
    r: "a:yosemite-during-smoke-season"
  }, "smoke"), " flex everything."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Don't pay third-party sites for \"Yosemite passes.\" ", React.createElement(A, {
    r: "a:yosemite-without-reservations-2026"
  }, "Pay $35 at the gate"), " or use America the Beautiful. (International visitors: a $100 per-person surcharge applies in 2026.)"), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Don't book Curry Village if you want quiet sleep. It's loud."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Don't book ", React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Oakhurst"), " if you're focused on the Valley. The drive is the longest of any gateway.")), React.createElement("section", {
    className: "checklist-section",
    style: sectionStyle
  }, React.createElement("div", {
    style: sectionLabel
  }, "IV · Gateway choice"), React.createElement("h2", {
    style: sectionTitle
  }, "Pick your base"), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement("strong", null, React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "El Portal")), ": closest to the Valley (25-30 min). Limited dining, year-round access."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement("strong", null, React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Mariposa")), ": 45 min from the Valley. Full service, best first-timer pick."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement("strong", null, React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Oakhurst")), ": closest to Mariposa Grove. Long drive to the Valley."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement("strong", null, React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Groveland")), ": Bay Area approach, near ", React.createElement(A, {
    r: "a:hetch-hetchy-the-other-yosemite-valley"
  }, "Hetch Hetchy"), "."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement("strong", null, React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Lee Vining")), ": east side; ", React.createElement(A, {
    r: "a:tioga-road-opening-weekend-2026"
  }, "Tuolumne and Mono Lake"), ". Summer only.")), React.createElement("section", {
    className: "checklist-section",
    style: sectionStyle
  }, React.createElement("div", {
    style: sectionLabel
  }, "V · What to pack"), React.createElement("h2", {
    style: sectionTitle
  }, "The car kit"), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Day pack with 2 liters water plus a bottle for the trail."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Hiking shoes with real tread. Sneakers slip on ", React.createElement(A, {
    r: "a:mist-trail-the-real-guide"
  }, "Mist Trail"), " granite."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Layers. The ", React.createElement(A, {
    r: "a:memorial-day-skip-the-valley-go-high-2026"
  }, "daily temperature swing"), " is 30 to 40 degrees."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Headlamp plus a spare battery."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement(A, {
    r: "a:pack-your-car-for-yosemite"
  }, "Tire chains"), ", November through April. Practice once at home."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Cooler. ", React.createElement(A, {
    r: "a:where-to-eat-yosemite"
  }, "Valley food"), " is limited and overpriced."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "5 gallons of water (not for drinking, for radiators, rinsing, the unexpected)."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Paper park map (cell service dies past Crane Flat)."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Sunscreen and a wide-brim hat. UV at elevation is brutal."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "A credit or debit card for the gate (the entrance stations are cashless) or your ", React.createElement(A, {
    r: "a:yosemite-without-reservations-2026"
  }, "America the Beautiful pass"), "."), React.createElement("p", {
    style: note
  }, "Bear spray is not permitted in Yosemite. Don't bring it.")), React.createElement("section", {
    className: "checklist-section",
    style: sectionStyle
  }, React.createElement("div", {
    style: sectionLabel
  }, "VI · What to skip"), React.createElement("h2", {
    style: sectionTitle
  }, "Don't try to do too much"), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Don't try to \"do\" Tunnel View, ", React.createElement(A, {
    r: "a:glacier-point-road-open-2026"
  }, "Glacier Point"), ", ", React.createElement(A, {
    r: "a:giant-sequoias-fire-adaptation"
  }, "Mariposa Grove"), ", and ", React.createElement(A, {
    r: "a:tioga-road-opening-weekend-2026"
  }, "Tuolumne"), " in one day. Pick two."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Don't drive Mariposa Grove to Tuolumne ", React.createElement(A, {
    r: "a:yosemite-in-one-or-two-days"
  }, "in a single day"), " if anyone in your group fatigues."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Don't hit ", React.createElement(A, {
    r: "a:yosemite-for-non-hikers"
  }, "Lower Yosemite Fall"), " between 11 AM and 3 PM. Come early or after 5 PM."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Don't expect to swim in the Merced before mid-July. ", React.createElement(A, {
    r: "a:mist-trail-the-real-guide"
  }, "The current is dangerous"), ".")), React.createElement("section", {
    className: "checklist-section",
    style: {
      ...sectionStyle,
      borderBottom: "2px solid var(--ink)"
    }
  }, React.createElement("div", {
    style: sectionLabel
  }, "VII · The non-negotiables"), React.createElement("h2", {
    style: sectionTitle
  }, "If you remember nothing else"), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), React.createElement(A, {
    r: "a:yosemite-without-reservations-2026"
  }, "Be in the park by 6:30 AM"), " on any peak day. The day's quality is decided before 9."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Every scented item in the ", React.createElement(A, {
    r: "a:bears-spring-emergence"
  }, "bear box"), " when you leave the car. Trunk is not bear-proof."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Print the ", React.createElement(A, {
    r: "a:half-dome-permit-lottery-2026"
  }, "Half Dome permit"), " if you have one. No cell service at the subdome."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Have a Plan B for every major stop. Parking, weather, and ", React.createElement(A, {
    r: "a:yosemite-during-smoke-season"
  }, "smoke"), " will kill at least one Plan A."), React.createElement("label", {
    style: item
  }, React.createElement("input", {
    type: "checkbox",
    style: cb
  }), "Pack out everything you bring in. ", React.createElement(A, {
    r: "a:yosemite-needs-a-reservation-system"
  }, "Yosemite is loved enough already"), ".")), React.createElement("section", {
    style: {
      marginTop: 56,
      marginBottom: 56
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 14
    }
  }, "The longer essays"), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 17,
      lineHeight: 1.6,
      color: "var(--ink-2)",
      marginBottom: 12
    }
  }, "Each line on this checklist is condensed from a longer piece. If you want the reasoning behind any of them:"), React.createElement("ul", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 16,
      lineHeight: 1.7,
      color: "var(--ink-1)",
      paddingLeft: 20
    }
  }, React.createElement("li", null, React.createElement("a", {
    href: "/articles/first-time-yosemite-overwhelm",
    onClick: e => {
      e.preventDefault();
      go("a:first-time-yosemite-overwhelm");
    }
  }, "If it's your first time in Yosemite, read this before you book anything")), React.createElement("li", null, React.createElement("a", {
    href: "/articles/yosemite-without-reservations-2026",
    onClick: e => {
      e.preventDefault();
      go("a:yosemite-without-reservations-2026");
    }
  }, "Yosemite without reservations in 2026")), React.createElement("li", null, React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared",
    onClick: e => {
      e.preventDefault();
      go("a:yosemite-gateway-towns-compared");
    }
  }, "Yosemite gateway towns compared")), React.createElement("li", null, React.createElement("a", {
    href: "/articles/pack-your-car-for-yosemite",
    onClick: e => {
      e.preventDefault();
      go("a:pack-your-car-for-yosemite");
    }
  }, "How to pack your car for a Yosemite trip")), React.createElement("li", null, React.createElement("a", {
    href: "/articles/half-dome-permit-lottery-2026",
    onClick: e => {
      e.preventDefault();
      go("a:half-dome-permit-lottery-2026");
    }
  }, "How the Half Dome permit lottery actually works")), React.createElement("li", null, React.createElement("a", {
    href: "/articles/yosemite-during-smoke-season",
    onClick: e => {
      e.preventDefault();
      go("a:yosemite-during-smoke-season");
    }
  }, "Yosemite during smoke season")), React.createElement("li", null, React.createElement("a", {
    href: "/planning",
    onClick: e => {
      e.preventDefault();
      go("planning");
    }
  }, "The full Yosemite Planning Guide")))), React.createElement(GuidePromo, {
    go: go,
    location: "checklist",
    title: "The checklist rides along.",
    body: "The Field Guide app packs a night-before checklist next to 50-plus stops with parking and timing notes, offline maps, and a trip planner. Everything this page prepares you for, on your phone, with no signal required.",
    style: {
      marginBottom: 56
    }
  }), React.createElement("div", {
    className: "checklist-section"
  }, React.createElement(NewsletterInline, {
    location: "checklist",
    tag: "checklist",
    heading: "Want updates through the season?",
    blurb: "One Yosemite email a week, when there is something to say. Free. Subscribers hear about updates to this checklist first."
  }))));
}
window.ChecklistPage = ChecklistPage;
