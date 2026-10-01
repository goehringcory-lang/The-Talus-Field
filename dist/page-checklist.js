function CheckSheet({
  label,
  title,
  children
}) {
  var ref = React.useRef(null);
  var [done, setDone] = React.useState(0);
  var [total, setTotal] = React.useState(0);
  var count = () => {
    var boxes = ref.current ? ref.current.querySelectorAll('input[type="checkbox"]') : [];
    setTotal(boxes.length);
    setDone(Array.from(boxes).filter(b => b.checked).length);
  };
  React.useLayoutEffect(count, []);
  return React.createElement("section", {
    className: "checklist-section fj-sheet" + (total && done === total ? " is-done" : ""),
    ref: ref,
    onChange: count
  }, React.createElement("div", {
    className: "fj-sheet__head"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, label), total > 0 && React.createElement("span", {
    className: "fj-sheet__tally",
    "aria-hidden": "true"
  }, done, " / ", total)), React.createElement("h2", {
    className: "fj-h fj-sheet__title"
  }, title), children);
}
function ChecklistPage({
  go
}) {
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
          header, footer, .hp-navigation, .hp-checklist__tip, .hp-product, .hp-letter, .nlbox { display: none !important; }
          .page-checklist { padding: 0 !important; }
          .page-checklist .hp-pagehead { padding: 0 !important; margin-bottom: 16pt !important; }
          .page-checklist h1 { font-size: 22pt !important; }
          .page-checklist .checklist-section { break-inside: auto; page-break-inside: auto; }
          body { background: white !important; color: black !important; }
          a { color: black !important; text-decoration: none !important; }
        }
      `), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "First-week checklist"
    }],
    className: "fj-head fj-topo",
    eyebrow: "THE FIRST-WEEK CHECKLIST",
    title: "Yosemite, in one printable page.",
    intro: "A condensed action list for planning a Yosemite trip in 2026, drawn from the full archive of The Talus Field. Print it, check things off, take it in the car. The longer essays behind each line are linked throughout, and collected at the bottom.",
    aside: React.createElement(FjCard, {
      eyebrow: "THE CHECKLIST, IN FOUR LINES",
      rows: [{
        label: "Sheets",
        value: "Seven, I to VII"
      }, {
        label: "Format",
        value: "One printable page"
      }, {
        label: "Lines",
        value: "Thirty-nine"
      }, {
        label: "Behind each line",
        value: "A longer essay, linked"
      }]
    })
  }, React.createElement("p", {
    className: "hp-byline hp-checklist__tip"
  }, "Tip: ", React.createElement("strong", null, "Cmd+P"), " (or Ctrl+P) for a clean print version.")), React.createElement(FjLayout, {
    numbered: false,
    marks: "roman",
    label: "The sheets"
  }, React.createElement(CheckSheet, {
    label: "I · Window of arrival",
    title: "When to come"
  }, React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Late May to early June for ", React.createElement(A, {
    r: "a:mist-trail-the-real-guide"
  }, "peak waterfalls"), " and ", React.createElement(A, {
    r: "a:memorial-day-skip-the-valley-go-high-2026"
  }, "high country"), " still snowy."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "September to October for low crowds and golden light."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Avoid July and August weekends. Heat plus crowds plus possible smoke."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement(A, {
    r: "a:yosemite-during-smoke-season"
  }, "Smoke season"), " runs roughly July through October. Build a contingency."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "2026 note: ", React.createElement(A, {
    r: "a:yosemite-without-reservations-2026"
  }, "no entrance reservation is required"), ". A standard pass is all you need.")), React.createElement(CheckSheet, {
    label: "II · What to book in advance",
    title: "The non-flexible reservations"
  }, React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "In-park lodging: 6 to 12 months ahead (Ahwahnee, Valley Lodge, Curry Village). ", React.createElement(A, {
    r: "stay"
  }, "Every option compared"), "."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Gateway-town lodging"), ": 1 to 3 months ahead for summer dates."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement(A, {
    r: "half-dome-lottery"
  }, "Half Dome preseason lottery"), ": apply March 1 to 31 on Recreation.gov."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement(A, {
    r: "a:tioga-road-opening-weekend"
  }, "Tuolumne Meadows"), " campground: opens on Recreation.gov in advance; books fast."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement(A, {
    r: "a:yosemite-wilderness-permits-guide"
  }, "Wilderness permits"), " for overnight trips: apply 24 weeks ahead via Recreation.gov.")), React.createElement(CheckSheet, {
    label: "III · What not to book",
    title: "Common mistakes"
  }, React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Don't lock a ", React.createElement(A, {
    r: "a:first-time-yosemite-overwhelm"
  }, "rigid day-by-day itinerary"), ". Weather and ", React.createElement(A, {
    r: "a:yosemite-during-smoke-season"
  }, "smoke"), " flex everything."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Don't pay third-party sites for \"Yosemite passes.\" ", React.createElement(A, {
    r: "a:yosemite-without-reservations-2026"
  }, "Pay $35 at the gate"), " or use America the Beautiful. (International visitors: a $100 per-person surcharge applies in 2026.)"), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Don't book Curry Village if you want quiet sleep. It's loud."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Don't book ", React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Oakhurst"), " if you're focused on the Valley. The drive is the longest of any gateway.")), React.createElement(CheckSheet, {
    label: "IV · Gateway choice",
    title: "Pick your base"
  }, React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement("strong", null, React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "El Portal")), ": closest to the Valley (25-30 min). Limited dining, year-round access."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement("strong", null, React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Mariposa")), ": 45 min from the Valley. Full service, best first-timer pick."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement("strong", null, React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Oakhurst")), ": closest to Mariposa Grove. Long drive to the Valley."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement("strong", null, React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Groveland")), ": Bay Area approach, near ", React.createElement(A, {
    r: "a:hetch-hetchy-the-other-yosemite-valley"
  }, "Hetch Hetchy"), "."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement("strong", null, React.createElement(A, {
    r: "a:yosemite-gateway-towns-compared"
  }, "Lee Vining")), ": east side; ", React.createElement(A, {
    r: "a:tioga-road-opening-weekend"
  }, "Tuolumne and Mono Lake"), ". Summer only."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Checked availability on your actual dates: ", React.createElement(A, {
    r: "stay"
  }, "the lodging board"), " has a live search per town.")), React.createElement(CheckSheet, {
    label: "V · What to pack",
    title: "The car kit"
  }, React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Day pack with 2 liters water plus a bottle for the trail."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Hiking shoes with real tread. Sneakers slip on ", React.createElement(A, {
    r: "a:mist-trail-the-real-guide"
  }, "Mist Trail"), " granite."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Layers. The ", React.createElement(A, {
    r: "a:memorial-day-skip-the-valley-go-high-2026"
  }, "daily temperature swing"), " is 30 to 40 degrees."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Headlamp plus a spare battery."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement(A, {
    r: "a:pack-your-car-for-yosemite"
  }, "Tire chains"), ", November through April. Practice once at home."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Cooler. ", React.createElement(A, {
    r: "a:where-to-eat-yosemite"
  }, "Valley food"), " is limited and overpriced."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "5 gallons of water (not for drinking, for radiators, rinsing, the unexpected)."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Paper park map (cell service dies past Crane Flat)."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Sunscreen and a wide-brim hat. UV at elevation is brutal."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "A credit or debit card for the gate (the entrance stations are cashless) or your ", React.createElement(A, {
    r: "a:yosemite-without-reservations-2026"
  }, "America the Beautiful pass"), "."), React.createElement("p", {
    className: "fj-sheet__note"
  }, "Bear spray is not permitted in Yosemite. Don't bring it.")), React.createElement(CheckSheet, {
    label: "VI · What to skip",
    title: "Don't try to do too much"
  }, React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Don't try to \"do\" Tunnel View, ", React.createElement(A, {
    r: "a:glacier-point-road-open-2026"
  }, "Glacier Point"), ", ", React.createElement(A, {
    r: "a:giant-sequoias-fire-adaptation"
  }, "Mariposa Grove"), ", and ", React.createElement(A, {
    r: "a:tioga-road-opening-weekend"
  }, "Tuolumne"), " in one day. Pick two."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Don't drive Mariposa Grove to Tuolumne ", React.createElement(A, {
    r: "a:yosemite-in-one-or-two-days"
  }, "in a single day"), " if anyone in your group fatigues."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Don't hit ", React.createElement(A, {
    r: "a:yosemite-for-non-hikers"
  }, "Lower Yosemite Fall"), " between 11 AM and 3 PM. Come early or after 5 PM."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Don't expect to swim in the Merced before mid-July. ", React.createElement(A, {
    r: "a:mist-trail-the-real-guide"
  }, "The current is dangerous"), ".")), React.createElement(CheckSheet, {
    label: "VII · The non-negotiables",
    title: "If you remember nothing else"
  }, React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), React.createElement(A, {
    r: "a:yosemite-without-reservations-2026"
  }, "Be in the park by 6:30 AM"), " on any peak day. The day's quality is decided before 9."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Every scented item in the ", React.createElement(A, {
    r: "a:yosemite-bears-safety-guide"
  }, "bear box"), " when you leave the car. Trunk is not bear-proof."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Print the ", React.createElement(A, {
    r: "half-dome-lottery"
  }, "Half Dome permit"), " if you have one. No cell service at the subdome."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Have a Plan B for every major stop. Parking, weather, and ", React.createElement(A, {
    r: "a:yosemite-during-smoke-season"
  }, "smoke"), " will kill at least one Plan A."), React.createElement("label", {
    className: "fj-check"
  }, React.createElement("input", {
    type: "checkbox"
  }), "Pack out everything you bring in. ", React.createElement(A, {
    r: "a:yosemite-needs-a-reservation-system"
  }, "Yosemite is loved enough already"), ".")), React.createElement("section", {
    className: "fj-essays"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE LONGER ESSAYS"), React.createElement("p", {
    className: "hp-sub"
  }, "Each line on this checklist is condensed from a longer piece. If you want the reasoning behind any of them:"), React.createElement("ul", {
    className: "relrail hp-checklist__essays"
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
    href: "/half-dome-lottery",
    onClick: e => {
      e.preventDefault();
      go("half-dome-lottery");
    }
  }, "The Half Dome lottery: calendar, odds, and strategy")), React.createElement("li", null, React.createElement("a", {
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
  }, "The full Yosemite Planning Guide"))))), React.createElement(HpGuideBand, {
    go: go,
    location: "checklist",
    title: "The checklist rides along.",
    intro: "The Field Guide app packs a night-before checklist next to every stop with parking and timing notes, offline maps, and a trip planner. Everything this page prepares you for, on your phone, with no signal required.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Want updates through the season?",
    heading: "Want updates through the season?",
    blurb: "Subscribers hear about updates to this checklist first.",
    location: "checklist",
    tag: "checklist"
  }));
}
window.ChecklistPage = ChecklistPage;
