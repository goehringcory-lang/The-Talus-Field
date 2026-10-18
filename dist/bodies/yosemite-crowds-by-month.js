window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["yosemite-crowds-by-month"] = function YosemiteCrowdsByMonthBody() {
  var TOC = [["#ycm-calendar", "Month by month"], ["#ycm-days-hours", "Days and hours"], ["#ycm-where", "Where it concentrates"], ["#ycm-reservations", "Reservations, then and now"], ["#ycm-tactics", "How to beat it"], ["#ycm-questions", "Questions"]];
  var MONTHS = [{
    m: "January",
    v: 120827,
    s: 3,
    n: "The quietest month. The Valley is open; chains ride in the car."
  }, {
    m: "February",
    v: 134729,
    s: 3,
    n: "Horsetail Fall weekends crowd the Valley at sunset; the rest is quiet."
  }, {
    m: "March",
    v: 160225,
    s: 4,
    n: "Spring break weeks fill the Valley lots. Falls building."
  }, {
    m: "April",
    v: 250943,
    s: 6,
    n: "Busy weekends, light weekdays. The high roads are still closed."
  }, {
    m: "May",
    v: 372595,
    s: 9,
    n: "Peak falls. Memorial Day weekend behaves like July."
  }, {
    m: "June",
    v: 526209,
    s: 13,
    n: "School is out. Peak season starts."
  }, {
    m: "July",
    v: 624559,
    s: 15,
    n: "The busiest month. Every road usually open."
  }, {
    m: "August",
    v: 607000,
    s: 15,
    n: "Nearly as busy as July. Smoke can matter."
  }, {
    m: "September",
    v: 511200,
    s: 13,
    n: "Busy through Labor Day, then a real drop on weekdays."
  }, {
    m: "October",
    v: 388581,
    s: 10,
    n: "Weekends still busy, weekdays easy. First storms."
  }, {
    m: "November",
    v: 196374,
    s: 5,
    n: "Quiet except Thanksgiving week. High roads close."
  }, {
    m: "December",
    v: 154033,
    s: 4,
    n: "Quiet until the holiday week."
  }];
  var JULY = MONTHS[6].v;
  var level = i => i >= 80 ? "Peak" : i >= 55 ? "Busy" : i >= 35 ? "Moderate" : "Quiet";
  var FAQ = [["What is Yosemite's visitation by month?", "By the Park Service's averages for 2010 to 2024, July is the busiest month at 624,559 visits and August close behind at 607,000, each about 15 percent of the year. January is the quietest at 120,827, about 3 percent. Nearly 75 percent of visitors come from May through October."], ["What is the least crowded month to visit Yosemite?", "January, then February and December, by the Park Service's averages. Each draws about a fifth to a quarter of July's visits. For a quiet month with more of the park open, early November weekdays and the weekdays of October are the better trade: October averages 388,581 visits, about 62 percent of July."], ["Will Yosemite be crowded in 2026?", "Busier than 2025, with less waiting. There is no timed reservation system in 2026. Visits were running about 8 percent ahead of 2025 through July, but the Park Service counted only two days of significant traffic delays through late August, both on Memorial Day weekend. Saturdays and holiday weekends are still the days the Valley lots fill."], ["What time do Yosemite Valley parking lots fill?", "The Park Service says to arrive before 8 a.m., after which Valley parking is usually full from April through September and on spring and fall weekends. Glacier Point and Tuolumne Meadows: arrive by 9 a.m. The Mariposa Grove welcome plaza can fill by mid-day. Text YNPTRAFFIC to 333111 for the park's live updates."], ["What are the busiest days in Yosemite?", "Saturdays and holiday weekends, by the Park Service's own traffic page: Memorial Day, the Fourth of July, Labor Day, Thanksgiving week and the late-December holidays. Weekdays are less congested, though delays are possible on any day in summer."], ["Do I need a reservation to enter Yosemite in 2026?", "No. The Park Service says it will not use a timed reservation system in 2026, after requiring one in some form in 2021, 2022, 2024 and 2025. You still pay the entrance fee. Check nps.gov/yose before a 2027 trip; the park has not announced its plans for next year."]];
  var fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return React.createElement("div", {
    className: "wv-feature ycm-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "users"
  }), React.createElement("dt", null, "Busiest month"), React.createElement("dd", null, "July, then August")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "Quietest month"), React.createElement("dd", null, "January")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("dt", null, "Valley lots fill"), React.createElement("dd", null, "Arrive before 8 a.m.")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "2026 reservations"), React.createElement("dd", null, "None required"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "wv-prose"
  }, React.createElement("p", null, "Yosemite is not crowded. Yosemite Valley is crowded, between about eight in the morning and four in the afternoon, on summer Saturdays, at a handful of trailheads. The rest of the park, and the rest of the clock, runs on a different number. The question \"will it be crowded?\" has three parts: which month, which day and hour, and which place."), React.createElement("p", null, "This is the month-by-month count from the Park Service's own visitation page, the days and hours its traffic page warns about, the places where the crowd actually piles up, the reservation years and what replaced them in 2026, and what to do about all of it. For the year-by-year numbers and this year's projection, read ", React.createElement("a", {
    href: "/articles/when-to-visit-yosemite"
  }, "when to visit Yosemite"), "; this page is the crowd calendar.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "May through October carry nearly 75 percent of the year."), React.createElement("li", null, "July and August are the peak; January is the low."), React.createElement("li", null, "Saturdays and holiday weekends are the worst days."), React.createElement("li", null, "In the Valley, be parked before 8 a.m."))))), React.createElement("section", {
    className: "ff-band",
    id: "ycm-calendar",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YOSEMITE VISITATION BY MONTH"), React.createElement("h2", null, "The crowd calendar, from the Park Service's count"), React.createElement("div", {
    className: "wv-prose"
  }, React.createElement("p", null, "The Park Service publishes the average number of visitors to Yosemite in each month, across 2010 to 2024. That fifteen-year average is the fairest single picture of the year, because it smooths out the fire closures, the Covid year and the reservation summers. The shape is simple: a long climb from January to a July peak, a slow fall through September, then a cliff in November. If your dates are in the peak, ", React.createElement("a", {
    href: "/articles/yosemite-in-july-and-august"
  }, "Yosemite in July and August"), " covers the heat, the high country and the smoke that come with it."), React.createElement("p", null, "The last column puts each month on a scale where July is 100. The crowd label is mine, cut from that index: Peak at 80 and above, Busy from 55, Moderate from 35, Quiet below."), React.createElement("p", null, "The averages understate the present. Recent summers have run above them: June 2026 came in at 634,508 visits and July at 654,356 by the reported Park Service counts, both above the fifteen-year average. Treat the table as the shape of the year and the recent counts as its height."))), React.createElement("div", {
    className: "wv-tablewrap"
  }, React.createElement("table", {
    className: "wv-table"
  }, React.createElement("caption", null, "Average monthly visits, 2010 to 2024"), React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Month"), React.createElement("th", {
    scope: "col"
  }, "Visits"), React.createElement("th", {
    scope: "col"
  }, "Share"), React.createElement("th", {
    scope: "col"
  }, "July = 100"))), React.createElement("tbody", null, MONTHS.map(r => {
    var idx = Math.round(r.v / JULY * 100);
    return React.createElement("tr", {
      key: r.m
    }, React.createElement("th", {
      scope: "row"
    }, r.m, React.createElement("small", null, level(idx), ". ", r.n)), React.createElement("td", null, fmt(r.v)), React.createElement("td", null, r.s, "%"), React.createElement("td", null, React.createElement("b", null, idx)));
  }))))), React.createElement("p", {
    className: "ff-note"
  }, "Source: National Park Service, Yosemite Visitation Statistics, average monthly visitation 2010 to 2024. Index and crowd labels: The Talus Field. The month notes restate this site's seasonal guides: ", React.createElement("a", {
    href: "/articles/yosemite-in-fall"
  }, "Yosemite in fall"), ", ", React.createElement("a", {
    href: "/articles/yosemite-in-winter"
  }, "Yosemite in winter"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ycm-days-hours",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "BUSIEST DAYS AND TIMES"), React.createElement("h2", null, "The clock matters more than the calendar"), React.createElement("div", {
    className: "wv-prose"
  }, React.createElement("p", null, "A July Tuesday at 7 a.m. is quieter than an April Saturday at 11. The Park Service's traffic guidance applies from April through September and on spring and fall weekends, and it names ", React.createElement("strong", null, "Saturdays and holiday weekends"), " as particularly busy. Weekdays are less congested, though it is careful to say delays are possible on any day."), React.createElement("p", null, "Within the day, the crowd is a block of hours. The Valley lots are usually full by ", React.createElement("strong", null, "8 a.m."), " in season, and on a weekend, the park warns, arriving after eight can mean several delays and then no parking at all. The day-trippers leave from mid-afternoon. Be through the gate early, or arrive after four and take the evening light."), React.createElement("p", null, "The holidays are the weekends that behave worst: Memorial Day, the Fourth of July, Labor Day, Thanksgiving week and the week between Christmas and New Year's. In 2026 the Park Service counted only two days of significant traffic delays through late August, and both were on Memorial Day weekend."))), React.createElement("ol", {
    className: "ff-hours"
  }, React.createElement("li", null, React.createElement("span", null, "Before 8 a.m."), React.createElement("p", null, "Valley parking still open. The window the Park Service names.")), React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "8 a.m. to mid-afternoon"), React.createElement("p", null, "Lots full in season; traffic backs up once they fill.")), React.createElement("li", null, React.createElement("span", null, "Mid-afternoon on"), React.createElement("p", null, "Day visitors start leaving. Spaces turn over.")), React.createElement("li", null, React.createElement("span", null, "After 4 p.m."), React.createElement("p", null, "The second good window, and the best light."))))), React.createElement("section", {
    className: "ff-band",
    id: "ycm-where",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHERE THE CROWD CONCENTRATES"), React.createElement("h2", null, "Five places, five deadlines"), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "The Park Service's traffic page gives each crowded place its own warning. These are its words, reduced to the hour that matters."), React.createElement("ul", {
    className: "ff-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "Yosemite Valley: before 8 a.m."), React.createElement("p", null, "Parking is usually full after eight in season. Once the lots fill, traffic can back up for miles, and cars may be turned back near El Capitan. ", React.createElement("a", {
    href: "/articles/yosemite-valley-parking-guide"
  }, "The parking guide"), " has the three day-use lots.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "mountain",
    size: 26
  }), React.createElement("strong", null, "Glacier Point: by 9 a.m."), React.createElement("p", null, "Delays can reach two hours. The road is open roughly late spring to fall; ", React.createElement("a", {
    href: "/articles/glacier-point-how-to-visit"
  }, "how to visit Glacier Point"), ".")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "tree",
    size: 26
  }), React.createElement("strong", null, "Mariposa Grove: by late morning"), React.createElement("p", null, "The welcome plaza lot may fill by mid-day and close periodically. ", React.createElement("a", {
    href: "/articles/mariposa-grove-how-to-visit"
  }, "How to visit the Mariposa Grove"), ".")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "lake",
    size: 26
  }), React.createElement("strong", null, "Tuolumne Meadows: by 9 a.m."), React.createElement("p", null, "Parking is limited and roadside parking is prohibited. The Tioga Pass entrance runs an estimated 30-minute wait. ", React.createElement("a", {
    href: "/articles/tuolumne-meadows-in-a-day"
  }, "Tuolumne Meadows in a day"), ".")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "drop",
    size: 26
  }), React.createElement("strong", null, "Hetch Hetchy: early or late"), React.createElement("p", null, "The lots may be full from mid-morning to late afternoon. The gate keeps daylight hours, so check them before a late arrival: ", React.createElement("a", {
    href: "/articles/hetch-hetchy-the-other-yosemite-valley"
  }, "the other Yosemite Valley"), ".")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "signal",
    size: 26
  }), React.createElement("strong", null, "Before you go: text the park"), React.createElement("p", null, "When the park is extremely busy, text YNPTRAFFIC to 333111 for current traffic updates. Cell coverage in the park is patchy, so sign up before you lose it."))), React.createElement("p", {
    className: "ff-note"
  }, "Inside the Valley the crowd narrows further: Lower Yosemite Fall and the Mist Trail trailhead draw the most, and ", React.createElement("a", {
    href: "/articles/yosemite-without-reservations-2026"
  }, "Yosemite without reservations"), " has the routes around them."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ycm-reservations",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "PEAK-HOURS RESERVATIONS"), React.createElement("h2", null, "Five years of reservations, and a year without"), React.createElement("div", {
    className: "wv-prose"
  }, React.createElement("p", null, "From 2020 to 2025, Yosemite mostly managed its summer crowd with a ticket. The rules changed nearly every year, which is why so much of what is written about Yosemite crowds is out of date."), React.createElement("p", null, React.createElement("strong", null, "2026 has none."), " The Park Service says it will no longer use a timed reservation system in 2026, after its evaluation of the 2025 season found that a season-wide requirement was not the most effective approach. In its place: real-time traffic monitoring and active parking management in the Valley. In late June it added shuttles and expanded Valley parking."), React.createElement("p", null, "The park's August 28 release makes the case that it worked. Gridlock days, it says, once exceeded 120 a year; in 2026 there were two. In a survey of 1,203 visitors in mid-August, 91 percent reported no entrance delay or a wait under 15 minutes. That is the park's own reading of its own policy, and it is preliminary."), React.createElement("p", null, "Whether 2027 brings a reservation back has not been announced. Check ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/reservations.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "the park's reservations page"), " before you plan next summer. The argument for bringing one back is in ", React.createElement("a", {
    href: "/articles/yosemite-needs-a-reservation-system"
  }, "Yosemite needs a reservation system"), "."))), React.createElement("ol", {
    className: "ff-timeline"
  }, React.createElement("li", null, React.createElement("span", null, "2021"), React.createElement("strong", null, "Day-use reservations"), React.createElement("p", null, "May 21 to September 30.")), React.createElement("li", null, React.createElement("span", null, "2022"), React.createElement("strong", null, "Peak hours, 6 a.m. to 4 p.m."), React.createElement("p", null, "May 20 to September 30.")), React.createElement("li", null, React.createElement("span", null, "2023"), React.createElement("strong", null, "None in summer"), React.createElement("p", null, "Three February weekends, for the firefall.")), React.createElement("li", null, React.createElement("span", null, "2024"), React.createElement("strong", null, "Peak Hours Plus, 5 a.m. to 4 p.m."), React.createElement("p", null, "April 13 to October 27.")), React.createElement("li", null, React.createElement("span", null, "2025"), React.createElement("strong", null, "Peak hours, 6 a.m. to 2 p.m."), React.createElement("p", null, "June 15 to August 15, plus Memorial Day and Labor Day weekends.")), React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "2026"), React.createElement("strong", null, "No reservation"), React.createElement("p", null, "Real-time traffic and parking management instead."))))), React.createElement("section", {
    className: "ff-band",
    id: "ycm-tactics",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HOW TO BEAT THE CROWDS"), React.createElement("h2", null, "What actually works"), React.createElement("div", {
    className: "wv-prose"
  }, React.createElement("p", null, "None of this is a secret, which is the point: the crowd is predictable, so it is avoidable. In rough order of how much each one buys you:"), React.createElement("p", null, React.createElement("strong", null, "Go midweek."), " The single biggest lever. A Tuesday in July is a different park from a Saturday in July. ", React.createElement("strong", null, "Go in the shoulder."), " Late April and the weekdays of September and October keep most of the park open at a fraction of the peak; September's average is about 82 percent of July's, October's about 62."), React.createElement("p", null, React.createElement("strong", null, "Sleep inside or close."), " A bed in the Valley, or on Highway 140 in El Portal, puts you at the trailhead before the day visitors reach the gate. ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "The gateway towns"), " are ranked by drive time. ", React.createElement("strong", null, "Park once."), " Leave the car in the morning and ride ", React.createElement("a", {
    href: "/articles/yosemite-shuttle-and-yarts"
  }, "the free Valley shuttle"), ", or skip the car entirely on YARTS. The Park Service's own advice is the same: park once for the length of your stay, and ride the bus in."), React.createElement("p", null, React.createElement("strong", null, "Go up, not in."), " When the Valley is full, Tioga Road and the high country absorb people far better, which is the case ", React.createElement("a", {
    href: "/articles/memorial-day-skip-the-valley-go-high-2026"
  }, "the Memorial Day piece"), " makes. ", React.createElement("strong", null, "Bring the day with you."), " The park advises plenty of food and water, because a full lot means you may not get back to a store."))), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The checklist"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The checklist"), React.createElement("ul", null, React.createElement("li", null, "A weekday, not a Saturday."), React.createElement("li", null, "Parked before 8 a.m., or arriving after 4 p.m."), React.createElement("li", null, "A bed in the park or on its edge."), React.createElement("li", null, "The shuttle once you are parked."), React.createElement("li", null, "The high country when the Valley is full."), React.createElement("li", null, "YNPTRAFFIC to 333111, saved before you lose signal.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ycm-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Yosemite crowds, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "What is open in each month, and what this year's count says about next: ", React.createElement("a", {
    href: "/articles/when-to-visit-yosemite"
  }, "when to visit Yosemite"), "."), React.createElement("div", {
    className: "wv-sources"
  }, React.createElement("h3", null, "Sources, read October 17, 2026"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/visitation.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Visitation statistics (monthly averages, 2010 to 2024), NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/traffic.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Traffic and parking, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/reservations.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Entrance reservations, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/news/more-visitors-less-waiting-yosemite-survey-shows-strong-peak-season-visitor-experience.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "More Visitors, Less Waiting, NPS, August 28, 2026")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/news/yosemite-national-park-reports-strong-summer-visitation-numbers.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite reports strong summer visitation numbers, NPS, September 4, 2025")), React.createElement("li", null, React.createElement("a", {
    href: "https://irma.nps.gov/STATS/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "NPS Visitor Use Statistics")), React.createElement("li", null, "The reservation years and the June and July 2026 counts: as published and sourced in ", React.createElement("a", {
    href: "/articles/when-to-visit-yosemite"
  }, "when to visit Yosemite"), ".")))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))));
};
