function StartHerePage({
  go
}) {
  var goArticle = (e, slug) => {
    e.preventDefault();
    go(`a:${slug}`);
  };
  var goRoute = (e, route) => {
    e.preventDefault();
    go(route);
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
      label: "Start here"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "For first-time visitors"), React.createElement("h1", null, "Planning your first trip to Yosemite? Start here."), React.createElement("p", {
    className: "page-head__dek"
  }, "The questions everyone asks before a first visit, answered plainly by a naturalist who has worked in this park for close to two decades. Each answer links the full guide behind it. Read this page in five minutes, then go deep only where your trip needs it."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "Do you need a reservation to get in?"), React.createElement("p", null, "No. There is no day-use or peak-hours entry reservation for 2026; the timed-entry systems that ran from 2020 through 2025 are gone. You pay at the gate and drive in. What rations your visit now is not paperwork, it is parking and entrance lines, which are harder problems than a reservation and ones you solve by arriving early. One thing did change at the gate: as of January 1, 2026, international visitors pay a $100 surcharge per person age 16 and older on top of the standard entrance fee. The full picture, and the strategy for a park with no throttle, is in", " ", React.createElement("a", {
    href: "/articles/yosemite-without-reservations-2026",
    onClick: e => goArticle(e, "yosemite-without-reservations-2026")
  }, "the no-reservations guide to 2026"), "."), React.createElement("h2", null, "When should you go?"), React.createElement("p", null, "If the dates are yours to choose: Tuesday through Thursday, September 8 to 30, is the best all-around window left this year. Summer conditions, the full park open, crowd pressure down a third from July. Midweek October is nearly as good, cooler and quieter, with fall color in the Valley by the back half of the month. If summer is what you have, come midweek and be through the gate before 7:30 a.m.; a well-executed July weekday beats a badly executed September Saturday. The days to avoid entirely: July 3 to 5, every summer Saturday arriving after 8:30 a.m., and Labor Day weekend. The month-by-month numbers behind those picks are in", " ", React.createElement("a", {
    href: "/articles/when-to-visit-yosemite-2026-crowd-forecast",
    onClick: e => goArticle(e, "when-to-visit-yosemite-2026-crowd-forecast")
  }, "the 2026 crowd forecast"), "."), React.createElement("h2", null, "How many days do you need?"), React.createElement("p", null, "Fewer than you fear. One day is enough if you arrive at sunrise, do three things well, and treat the early alarm as the price of admission. Two days is the same trip with room to breathe and one earned view from above the Valley floor. The third day is the first one you do not have to defend: nothing on it is your only chance, and the trip can absorb weather and wrong turns. Plan a short trip with", " ", React.createElement("a", {
    href: "/articles/yosemite-in-one-or-two-days",
    onClick: e => goArticle(e, "yosemite-in-one-or-two-days")
  }, "the one-and-two-day guide"), " ", "and a longer one with", " ", React.createElement("a", {
    href: "/articles/yosemite-in-three-to-five-days",
    onClick: e => goArticle(e, "yosemite-in-three-to-five-days")
  }, "the three-to-five-day guide"), "."), React.createElement("h2", null, "Where should you stay?"), React.createElement("p", null, "Inside the park if you can get a bed, because the park is at its best in the first two hours and last two hours of the day. In-park lodging is one operator and one inventory, opening 366 days ahead. Outside the park are five gateway towns whose drives to the Valley differ by more than an hour: El Portal is 25 to 35 minutes out, Mariposa 45 to 60 and the safest first-timer's pick, and Oakhurst, 75 to 90 minutes from the Valley, is the wrong base for a Valley trip and the right one for the sequoias. The honest comparison is", " ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared",
    onClick: e => goArticle(e, "yosemite-gateway-towns-compared")
  }, "the gateway towns guide"), "; the full lodging picture, in-park and out, is on", " ", React.createElement("a", {
    href: "/stay",
    onClick: e => goRoute(e, "stay")
  }, "the where-to-stay page"), ", and every drive time is in one table on", " ", React.createElement("a", {
    href: "/distances",
    onClick: e => goRoute(e, "distances")
  }, "the distances page"), ". If you are camping,", " ", React.createElement("a", {
    href: "/articles/camping-in-yosemite-first-time",
    onClick: e => goArticle(e, "camping-in-yosemite-first-time")
  }, "the first-time camping guide"), " ", "covers the reservation windows that actually matter."), React.createElement("h2", null, "Which entrance do you use?"), React.createElement("p", null, "Yosemite has five entrances and they are nothing alike. The right one depends on where you are coming from, what month it is, and what you want to see first, not on which gate is nearest your hotel. Arch Rock on Highway 140 is the all-weather route: the lowest elevation of any approach, the least snow and chain control in winter, and the fastest way into Yosemite Valley. The full geography lesson, entrance by entrance, is in", " ", React.createElement("a", {
    href: "/articles/getting-to-yosemite",
    onClick: e => goArticle(e, "getting-to-yosemite")
  }, "getting to Yosemite"), ", and once you are in,", " ", React.createElement("a", {
    href: "/articles/yosemite-valley-parking-guide",
    onClick: e => goArticle(e, "yosemite-valley-parking-guide")
  }, "the Valley parking guide"), " ", "is the difference between a morning in the park and a morning circling lots."), React.createElement("h2", null, "What about permits?"), React.createElement("p", null, "The permit anxiety around Yosemite is wildly out of proportion to the permit reality. Every trail in the park is open to a day hiker without a permit, with exactly one exception: Half Dome, which has its own lottery. Ranger programs are free with no reservation, and none of the big set pieces, the Mariposa Grove, Glacier Point, Tunnel View, the waterfalls, is ticketed. What you can still get today, standing in the park holding nothing, is the whole subject of", " ", React.createElement("a", {
    href: "/articles/yosemite-walk-up-and-day-of-permits",
    onClick: e => goArticle(e, "yosemite-walk-up-and-day-of-permits")
  }, "the walk-up and day-of permits guide"), "; the one famous exception is explained on", " ", React.createElement("a", {
    href: "/half-dome-lottery",
    onClick: e => goRoute(e, "half-dome-lottery")
  }, "the Half Dome lottery page"), "."), React.createElement("h2", null, "What should you actually do?"), React.createElement("p", null, "The famous list, Tunnel View, Cook's Meadow, Glacier Point, the Mariposa Grove, Tuolumne Meadows, is right; those places earned their fame. What most guides do not tell you is that most people visit them in the worst possible way, at the most crowded hour, and the fix is timing rather than a better list.", " ", React.createElement("a", {
    href: "/articles/first-time-yosemite-overwhelm",
    onClick: e => goArticle(e, "first-time-yosemite-overwhelm")
  }, "The first-timer's guide"), " ", "is the strategy in full. When you are ready to put stops in an order,", " ", React.createElement("a", {
    href: "/itineraries",
    onClick: e => goRoute(e, "itineraries")
  }, "the itineraries"), " ", "are half-day to three-day plans in drive order, and", " ", React.createElement("a", {
    href: "/map",
    onClick: e => goRoute(e, "map")
  }, "the trip map"), " ", "lets you build your own."), React.createElement("h2", null, "Where to go from here"), React.createElement("p", null, "The five-question trip selector at the top of", " ", React.createElement("a", {
    href: "/planning",
    onClick: e => goRoute(e, "planning")
  }, "the Planning Guide"), " ", "turns your dates, party, and priorities into a read list and a day plan; it is the fastest route from this page to a plan that fits your trip. What a trip costs is in", " ", React.createElement("a", {
    href: "/articles/yosemite-trip-cost-budget-2026",
    onClick: e => goArticle(e, "yosemite-trip-cost-budget-2026")
  }, "the budget breakdown"), ". And in the week before you drive in, check", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => goRoute(e, "conditions")
  }, "current conditions"), " ", "and", " ", React.createElement("a", {
    href: "/now",
    onClick: e => goRoute(e, "now")
  }, "the Park Bulletin"), " ", "for what is actually open on your dates.")), React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "The first decision with a deadline",
    note: "Where you sleep decides what your mornings look like. In-park beds open 366 days ahead and the closest gateway rooms go next; the later you book, the longer your drive.",
    list: "page_start_here",
    slug: "start-here",
    cta: "See what is available on your dates →"
  }), React.createElement(GuidePromo, {
    go: go,
    location: "start-here",
    title: "The first trip is the one that needs a guide",
    body: "The Field Guide app carries 57 hikes with parking and timing notes, offline maps for a park with no cell service, and the local tactics for every major region. One purchase, eighteen months of access.",
    style: {
      marginTop: 56,
      marginBottom: 40
    }
  }), React.createElement(NewsletterInline, {
    location: "start-here",
    tag: "start-here",
    heading: "The Sunday Letter",
    blurb: "What is open, what is booking out, and what the week looked like from inside the park. One letter a week while you plan. Free."
  })));
}
window.StartHerePage = StartHerePage;
