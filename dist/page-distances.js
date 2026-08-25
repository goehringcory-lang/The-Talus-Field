var TO_VALLEY = [{
  town: "El Portal",
  miles: "about 14",
  time: "25 to 35 min",
  highway: "140",
  season: "Year-round",
  elevation: "about 1,900 ft"
}, {
  town: "Mariposa",
  miles: "about 45",
  time: "45 to 60 min",
  highway: "140",
  season: "Year-round",
  elevation: "about 2,000 ft"
}, {
  town: "Groveland",
  miles: "about 41",
  time: "65 to 80 min",
  highway: "120",
  season: "Chain controls common in winter",
  elevation: "about 3,100 ft"
}, {
  town: "Oakhurst",
  miles: "about 50",
  time: "75 to 90 min",
  highway: "41",
  season: "Year-round",
  elevation: "about 2,300 ft"
}, {
  town: "Lee Vining",
  miles: "about 75",
  time: "90 min minimum",
  highway: "120 East over Tioga Pass",
  season: "Only while Tioga Pass is open",
  elevation: "about 6,800 ft"
}];
var OTHER_LEGS = [{
  from: "Oakhurst",
  to: "South Entrance",
  detail: "about 14 miles, 20 to 25 minutes. The Mariposa Grove welcome plaza is immediately inside the gate; Wawona itself is another six miles on."
}, {
  from: "Groveland",
  to: "Big Oak Flat Entrance",
  detail: "about 24 miles, 30 to 40 minutes on a winding road."
}, {
  from: "Lee Vining",
  to: "Tuolumne Meadows",
  detail: "about 20 miles, 30 minutes, while Tioga Pass is open."
}, {
  from: "Lee Vining",
  to: "Mono Lake",
  detail: "about 5 minutes to the visitor center, 15 to the South Tufa boardwalk."
}, {
  from: "El Portal",
  to: "Arch Rock Entrance",
  detail: "the entrance El Portal mornings start on, and the reason the town's drive is the shortest of the five."
}];
function DistancesPage({
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
      label: "Distances"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Drive times"), React.createElement("h1", null, "How far is Yosemite from anywhere?"), React.createElement("p", {
    className: "page-head__dek"
  }, "Every gateway town, its drive to Yosemite Valley, the entrance it uses, and what the season does to it. The numbers are the ones from the gateway towns guide, in one table, so you can compare two towns instead of looking up one."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "Gateway towns to Yosemite Valley"), React.createElement("p", null, "Drive times are to the west end of Yosemite Valley in ordinary conditions. Add 15 to 20 minutes to reach Curry Village at the east end, and add more than you think for summer afternoons, when the Valley loop road is the slowest few miles of the trip."), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "From"), React.createElement("th", null, "Miles to the Valley"), React.createElement("th", null, "Drive time"), React.createElement("th", null, "Highway"), React.createElement("th", null, "Season"), React.createElement("th", null, "Town elevation"))), React.createElement("tbody", null, TO_VALLEY.map(r => React.createElement("tr", {
    key: r.town
  }, React.createElement("td", null, React.createElement("strong", null, r.town)), React.createElement("td", null, r.miles, " miles"), React.createElement("td", null, r.time), React.createElement("td", null, r.highway), React.createElement("td", null, r.season), React.createElement("td", null, r.elevation))))), React.createElement("h2", null, "The other legs worth knowing"), React.createElement("p", null, "The Valley is not the only destination, and for some trips it is not even the main one. A base that is far from the Valley can be close to the thing you actually came for."), React.createElement("ul", null, OTHER_LEGS.map(l => React.createElement("li", {
    key: `${l.from}-${l.to}`
  }, React.createElement("strong", null, l.from, " to ", l.to, ":"), " ", l.detail))), React.createElement("p", null, "Oakhurst is the clearest case. It is the longest drive to the Valley of the four year-round towns, and the shortest to the Mariposa Grove by a wide margin. If the sequoias are the trip, the table above is reading the wrong destination."), React.createElement("h2", null, "What the numbers do not say"), React.createElement("p", null, React.createElement("strong", null, "Season changes the answer more than distance does."), " ", "Lee Vining is 75 miles from the Valley for roughly half the year and unreachable from it for the other half, because Tioga Pass closes. Groveland is a thousand feet higher than the Highway 140 towns and gets chain controls they do not. The Highway 140 corridor through Mariposa and El Portal is the lowest and most reliable route in, and in a bad winter that matters more than any of the mileages here. The full picture is in", " ", React.createElement("a", {
    href: "/tioga-opening"
  }, "the Tioga Road opening page"), " and in", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "current conditions"), "."), React.createElement("p", null, React.createElement("strong", null, "Entrance queues are not drive time."), " On a peak summer morning the wait at a gate can add half an hour that no mileage predicts. Live entrance waits are on", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "the conditions page"), "."), React.createElement("p", null, React.createElement("strong", null, "Once you are in, you are still driving."), " The Valley to Glacier Point is roughly an hour when the road is open, the Valley to Tuolumne Meadows is an hour and a half, and Hetch Hetchy is a dead end that serves no through route. A day that crosses the park is a driving day, which is the thing most itineraries get wrong."), React.createElement("h2", null, "So which town?"), React.createElement("p", null, "Distance is one input and usually not the deciding one. What a town has, what it costs, what it is like in winter, and which part of the park it opens onto matter more than fifteen minutes of highway. That argument is the whole of", " ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared",
    onClick: e => goArticle(e, "yosemite-gateway-towns-compared")
  }, "the gateway towns comparison"), ", which is where these numbers come from. The lodging itself is on", " ", React.createElement("a", {
    href: "/stay",
    onClick: e => {
      e.preventDefault();
      go("stay");
    }
  }, "the where-to-stay page"), ", and what a trip costs is in", " ", React.createElement("a", {
    href: "/articles/yosemite-trip-cost-budget-2026",
    onClick: e => goArticle(e, "yosemite-trip-cost-budget-2026")
  }, "the budget breakdown"), ". If you are coming from further out, ", React.createElement("a", {
    href: "/articles/getting-to-yosemite",
    onClick: e => goArticle(e, "getting-to-yosemite")
  }, "getting to Yosemite"), " ", "covers the airports and the long approaches.")), React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "Book the drive you want",
    note: "The difference between a 25-minute morning and a 90-minute one is decided months earlier, when you pick the town. Availability moves fastest for the closest beds.",
    list: "page_distances",
    slug: "distances",
    cta: "Search lodging by town →"
  }), React.createElement(GuidePromo, {
    go: go,
    location: "distances",
    title: "The drive is only the first part",
    body: "The Field Guide app carries the trailhead parking notes, offline maps for a park with no cell service, and a day planner that knows how long it really takes to cross the park. One purchase, eighteen months of access.",
    style: {
      marginTop: 56,
      marginBottom: 40
    }
  }), React.createElement(NewsletterInline, {
    location: "distances",
    tag: "distances",
    heading: "Road status, Sundays",
    blurb: "Tioga and Glacier Point open late and close early, and chain controls arrive without much notice. One short letter a week with what the roads are doing. Free."
  })));
}
window.DistancesPage = DistancesPage;
