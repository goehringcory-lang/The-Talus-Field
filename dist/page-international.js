var {
  useState: useStateI,
  useMemo: useMemoI
} = React;
var MODE_LABELS = {
  car: "Car or camper van",
  motorcycle: "Motorcycle",
  foot: "On foot, bicycle, or the YARTS bus"
};
function money(n) {
  return "$" + n.toLocaleString("en-US");
}
function FeeCalculator() {
  var F = window.FEES;
  var [adults, setAdults] = useStateI(2);
  var [children, setChildren] = useStateI(0);
  var [mode, setMode] = useStateI("car");
  var [vehicles, setVehicles] = useStateI(1);
  var [entries, setEntries] = useStateI(1);
  var result = useMemoI(() => window.calcEntryFees({
    adults,
    children,
    mode,
    vehicles,
    entries
  }), [adults, children, mode, vehicles, entries]);
  var best = result.options.find(o => o.id === result.best);
  var num = (v, set, lo, hi) => React.createElement("input", {
    type: "number",
    min: lo,
    max: hi,
    value: v,
    onChange: e => set(Math.max(lo, Math.min(hi, Number(e.target.value) || lo)))
  });
  return React.createElement("div", {
    className: "feecalc",
    role: "region",
    "aria-label": "Entrance fee calculator"
  }, React.createElement("div", {
    className: "feecalc__form"
  }, React.createElement("label", null, React.createElement("span", null, "People 16 and older"), num(adults, setAdults, 1, 12)), React.createElement("label", null, React.createElement("span", null, "Children under 16"), num(children, setChildren, 0, 12)), React.createElement("label", null, React.createElement("span", null, "How you enter"), React.createElement("select", {
    value: mode,
    onChange: e => setMode(e.target.value)
  }, window.FEE_MODES.map(m => React.createElement("option", {
    key: m,
    value: m
  }, MODE_LABELS[m])))), mode !== "foot" && React.createElement("label", null, React.createElement("span", null, mode === "car" ? "Cars" : "Motorcycles"), num(vehicles, setVehicles, 1, 4)), React.createElement("label", null, React.createElement("span", null, "Separate entries in the next 12 months"), num(entries, setEntries, 1, 6), React.createElement("small", null, "At Yosemite or any of the other ten surcharge parks. A week in Yosemite is one entry; Yosemite, then a night in Fresno, then Sequoia is two."))), React.createElement("div", {
    className: "feecalc__options"
  }, result.options.map(o => React.createElement("div", {
    key: o.id,
    className: `feecalc__option${o.id === result.best ? " is-best" : ""}`
  }, React.createElement("div", {
    className: "feecalc__option-head"
  }, React.createElement("span", {
    className: "feecalc__option-label"
  }, o.label), React.createElement("span", {
    className: "feecalc__option-total"
  }, money(o.total))), React.createElement("ul", null, o.lines.map((l, i) => React.createElement("li", {
    key: i
  }, React.createElement("span", null, l.label), React.createElement("span", null, money(l.amount))))), React.createElement("p", null, o.note), o.id === result.best && result.savings > 0 && React.createElement("p", {
    className: "feecalc__saves"
  }, "Saves ", money(result.savings), " against paying at the gate."), o.id === result.best && result.savings === 0 && React.createElement("p", {
    className: "feecalc__saves"
  }, "The cheapest way in for this party", result.options.length > 1 && result.options.every(x => x.total === o.total) ? "; the options cost the same" : "", ".")))), React.createElement("p", {
    className: "feecalc__note"
  }, "Children under ", F.perPersonFreeUnder, " pay nothing and owe no non-resident fee. Figures from the National Park Service fee pages, verified ", F.verified, "; the pass rule for passengers follows the park's own wording and the Yosemite Conservancy's 2026 summary, linked below. The gate is card only."));
}
function InternationalPage({
  go
}) {
  var F = window.FEES;
  var goA = (e, slug) => {
    e.preventDefault();
    go(`a:${slug}`);
  };
  var goR = (e, r) => {
    e.preventDefault();
    go(r);
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
      label: "Visiting from abroad"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "International visitors"), React.createElement("h1", null, "Yosemite for visitors from outside the United States"), React.createElement("p", {
    className: "page-head__dek"
  }, "Since January 1, 2026, a visitor who does not live in the United States pays more to enter Yosemite, and the rules are easy to get wrong. What the fee is, the cheapest way to pay it, and the handful of things about this park that surprise people who have driven in other countries."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "The 2026 non-resident fee"), React.createElement("p", null, "Every visitor pays the entrance fee: ", money(F.vehicle), " per car for seven days, ", money(F.motorcycle), " per motorcycle, ", money(F.perPerson), " per person on foot, by bicycle or by bus, children under ", F.perPersonFreeUnder, " free. On top of that, since January 1, 2026, a visitor who is not a US citizen or resident pays a non-resident fee of ", money(F.surcharge), " per person aged ", F.surchargeAgeFrom, " and older, unless that person is covered by an annual pass. It applies at eleven parks: ", F.surchargeParks.slice(0, -1).join(", "), " and ", F.surchargeParks.slice(-1)[0], ". The fee-free days the park publishes each year are now for US residents only; a non-resident pays the full amount on those days too."), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "What"), React.createElement("th", null, "Price"), React.createElement("th", null, "Who it covers"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, "Entrance, private vehicle"), React.createElement("td", null, money(F.vehicle)), React.createElement("td", null, "The car and everyone in it, seven days")), React.createElement("tr", null, React.createElement("td", null, "Entrance, motorcycle"), React.createElement("td", null, money(F.motorcycle)), React.createElement("td", null, "Seven days")), React.createElement("tr", null, React.createElement("td", null, "Entrance, per person"), React.createElement("td", null, money(F.perPerson)), React.createElement("td", null, "On foot, bicycle or bus; under ", F.perPersonFreeUnder, " free")), React.createElement("tr", null, React.createElement("td", null, "Non-resident fee"), React.createElement("td", null, money(F.surcharge), " per person"), React.createElement("td", null, "Age ", F.surchargeAgeFrom, " and older, each entry, unless holding a pass")), React.createElement("tr", null, React.createElement("td", null, "Non-resident annual pass"), React.createElement("td", null, money(F.nonResidentAnnual)), React.createElement("td", null, "The holder's vehicle and its occupants, twelve months, every federal fee site; no non-resident fee")), React.createElement("tr", null, React.createElement("td", null, "Annual pass, US residents"), React.createElement("td", null, money(F.residentAnnual)), React.createElement("td", null, "Residents only")), React.createElement("tr", null, React.createElement("td", null, "Yosemite annual pass"), React.createElement("td", null, money(F.yosemiteAnnual)), React.createElement("td", null, "US citizens and residents only")))), React.createElement("p", {
    className: "dates__hint"
  }, "Sources: ", React.createElement("a", {
    href: F.sources.yosemite,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite fees and passes, NPS ↗"), ",", " ", React.createElement("a", {
    href: F.sources.passes,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "America the Beautiful passes, NPS ↗"), ",", " ", React.createElement("a", {
    href: F.sources.conservancy,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Know before you go 2026, Yosemite Conservancy ↗"), ". Verified ", F.verified, "."), React.createElement("h2", null, "The cheapest way in"), React.createElement("p", null, "The arithmetic turns on one comparison: the non-resident fee is charged per person and per entry, and the non-resident annual pass is charged once per car. One adult in one car for one week pays", " ", money(F.vehicle + F.surcharge), " at the gate and should. Three adults in the same car pay ", money(F.vehicle + 3 * F.surcharge), " at the gate and ", money(F.nonResidentAnnual), " with a pass. Anyone touring two of the eleven parks should buy the pass before the first gate."), React.createElement(FeeCalculator, null), React.createElement("p", null, "Buy the pass online at Recreation.gov before you fly, or at the entrance station; a digital pass shown on a phone is accepted. Passes and entrance fees are card only at every Yosemite gate, no cash. The car's driver should hold the pass, and every adult in the car should have identification, since residency is what the surcharge turns on."), React.createElement("h2", null, "What else is different here"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "No reservation is needed to enter in 2026."), " You pay at the gate and drive in. What rations a summer day now is parking, which is solved by being through the entrance before 8 a.m. or after 4 p.m. The full picture is in", " ", React.createElement("a", {
    href: "/articles/yosemite-without-reservations-2026",
    onClick: e => goA(e, "yosemite-without-reservations-2026")
  }, "the no-reservations strategy"), "."), React.createElement("li", null, React.createElement("strong", null, "The park is the size of a small country and most of it has no mobile signal."), " Download maps before the gate. The drive from the Valley to Tuolumne Meadows is an hour and a half; Glacier Point is an hour;", " ", React.createElement("a", {
    href: "/distances",
    onClick: e => goR(e, "distances")
  }, "the drive-time table"), " has the rest."), React.createElement("li", null, React.createElement("strong", null, "Two of the three mountain roads close for half the year."), " ", "Tioga Road and Glacier Point Road are shut by snow from roughly November to late May, and the dates move every year. Plan a winter or spring trip around the Valley, and check", " ", React.createElement("a", {
    href: "/tioga-opening",
    onClick: e => goR(e, "tioga-opening")
  }, "the Tioga Road page"), " before counting on the high country."), React.createElement("li", null, React.createElement("strong", null, "Chains are the law, including in a rental car."), " From autumn to spring, every vehicle must carry tire chains when chain controls are posted, and rental agreements often forbid fitting them. Read the winter section of", " ", React.createElement("a", {
    href: "/articles/getting-to-yosemite",
    onClick: e => goA(e, "getting-to-yosemite")
  }, "getting to Yosemite"), " before you book a car."), React.createElement("li", null, React.createElement("strong", null, "You can do this without a car."), " Amtrak to Merced and the YARTS bus into the Valley run year-round, and a free shuttle covers the Valley floor.", " ", React.createElement("a", {
    href: "/articles/yosemite-shuttle-and-yarts",
    onClick: e => goA(e, "yosemite-shuttle-and-yarts")
  }, "The shuttle and YARTS guide"), " explains the timetable, and whether the fare covers the entrance fee, which two official sources disagree on."), React.createElement("li", null, React.createElement("strong", null, "Beds inside the park sell out a year ahead."), " The gateway towns are the realistic base for a trip planned months out rather than a year out;", " ", React.createElement("a", {
    href: "/stay",
    onClick: e => goR(e, "stay")
  }, "where to stay"), " compares them by road corridor."), React.createElement("li", null, React.createElement("strong", null, "Bears are real and the rules carry fines."), " No food or anything scented left in a car overnight, anywhere in the park.", " ", React.createElement("a", {
    href: "/articles/yosemite-bears-safety-guide",
    onClick: e => goA(e, "yosemite-bears-safety-guide")
  }, "The bears guide"), " covers what that means in practice."), React.createElement("li", null, React.createElement("strong", null, "Half Dome needs a permit won by lottery, and it fills."), " ", "Everything else on the trail network needs nothing.", " ", React.createElement("a", {
    href: "/dates",
    onClick: e => goR(e, "dates")
  }, "The dates page"), " has the lottery windows measured against your trip.")), React.createElement("h2", null, "What a week costs, all in"), React.createElement("p", null, "The entrance fee is the smallest line. Lodging, fuel, food and the drive from the airport are the budget, and", " ", React.createElement("a", {
    href: "/articles/yosemite-trip-cost-budget-2026",
    onClick: e => goA(e, "yosemite-trip-cost-budget-2026")
  }, "the trip-cost breakdown"), " ", "prices a week three ways. A first visit with a few days to spend follows", " ", React.createElement("a", {
    href: "/articles/yosemite-in-three-to-five-days",
    onClick: e => goA(e, "yosemite-in-three-to-five-days")
  }, "the three-to-five-day plan"), ", and the questions every first-time visitor asks are answered on", " ", React.createElement("a", {
    href: "/start-here",
    onClick: e => goR(e, "start-here")
  }, "Start here"), ".")), React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "Book the bed before the flight",
    note: "In-park rooms open a year ahead and gateway rooms fill months out for summer. One availability search around the park shows what your dates still hold.",
    list: "page_international",
    slug: "international",
    cta: "Search lodging around Yosemite →"
  }), React.createElement(GuidePromo, {
    go: go,
    location: "international",
    title: "The park, offline, in your pocket",
    body: "No roaming plan reaches most of Yosemite. The Field Guide app downloads the maps, the parking notes and the day planner to your phone before the gate, in plain English. One purchase, eighteen months of access.",
    style: {
      marginTop: 56,
      marginBottom: 40
    }
  }), React.createElement(NewsletterInline, {
    location: "international",
    tag: "international",
    heading: "What changed since you read this",
    blurb: "Fees, road openings and the park's rules move between the day you book and the day you land. One short letter on Sundays, from inside the park. Free."
  })));
}
window.InternationalPage = InternationalPage;
