window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["when-to-visit-yosemite"] = function WhenToVisitYosemiteBody() {
  var TOC = [["#sec-0-the-throttle-is-gone", "The throttle is gone"], ["#sec-1-what-2026-looks-like-so-far", "2026 so far"], ["#sec-2-what-the-reservation-years-actually-did", "What reservations did"], ["#sec-3-how-i-built-the-forecast", "The projection"], ["#sec-4-the-crowd-calendar", "Crowd calendar"], ["#what-is-open-when", "What is open"], ["#sec-5-the-clock-beats-the-calendar", "The clock"], ["#sec-6-the-days-i-would-pick", "Days to pick"], ["#sec-7-what-could-bend-the-curve", "What could change"], ["#when-to-visit-questions", "Questions"]];
  var FAQ = [["Do I need a reservation to visit Yosemite in 2026?", "No. The Park Service stopped using a timed reservation system for 2026, and its entrance reservations page, updated February 18, says so. You still pay the entrance fee, but no timed-entry ticket is required, and the February firefall weekends ran without reservations too."], ["How busy will Yosemite be in 2026?", "Very. Through July the park logged 2,657,602 visits, 8 percent ahead of 2025, and June 2026 was the second-busiest June on record. If August through December match 2025, the year ends near 4.5 million visits; at this year's pace, near 4.6 million. Either would be the second-busiest year on record, behind 2016. That is the site's projection, not a Park Service number."], ["What is the best time to visit Yosemite in 2026?", "Midweek in October is the best window left: the Park Service's 15-year average for October is about 38 percent below July, and Tioga Road is usually open for most of the month. Early-November weekdays are quieter still, with short days. Check the conditions page first: the Mist Trail is partly closed on weekdays through October."], ["What time of day should I enter Yosemite to avoid traffic?", "Be through the gate before 8 a.m., before 7 on summer weekends, or arrive after 4 p.m. Valley parking has filled as early as 8 a.m. on peak days. In the Park Service's August survey, 91 percent of visitors had no entrance delay or waited less than 15 minutes. Text YNPTRAFFIC to 333111 for the park's live parking and traffic updates."], ["What are the worst days to visit Yosemite in 2026?", "The Park Service counts only two days of significant delays in 2026, both over Memorial Day weekend, and says Juneteenth and July 4 ran without significant delays. Summer Saturdays arriving after 8:30 a.m., Labor Day weekend and the holiday week in late December are still the days to plan around."], ["What was Yosemite's busiest year ever?", "2016, with 5,028,868 recreation visits. 2025 was the fourth-busiest at 4,278,413, behind 2016, 2019 and 2017, and 2026 is on pace to land second at roughly 4.5 to 4.6 million."]];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var AVG = [120827, 134729, 160225, 250943, 372595, 526209, 624559, 607000, 511200, 388581, 196374, 154033];
  var JULY = AVG[6];
  var INDEX = AVG.map(v => Math.round(v / JULY * 100));
  var YEARS = [{
    y: 2016,
    v: 5028868,
    rule: "No reservations. The record year."
  }, {
    y: 2017,
    v: 4336890,
    rule: "No reservations."
  }, {
    y: 2018,
    v: 4009436,
    rule: "No reservations."
  }, {
    y: 2019,
    v: 4422861,
    rule: "No reservations."
  }, {
    y: 2020,
    v: 2268313,
    rule: "Covid closure, then day-use limits."
  }, {
    y: 2021,
    v: 3287595,
    rule: "Day-use reservations, May 21 to September 30."
  }, {
    y: 2022,
    v: 3667550,
    rule: "Peak-hours reservations, 6 a.m. to 4 p.m., May 20 to September 30."
  }, {
    y: 2023,
    v: 3897070,
    rule: "None in summer. Three February weekends for the firefall."
  }, {
    y: 2024,
    v: 4121807,
    rule: "Peak Hours Plus, 5 a.m. to 4 p.m., April 13 to October 27."
  }, {
    y: 2025,
    v: 4278413,
    rule: "Peak hours, 6 a.m. to 2 p.m., June 15 to August 15 and two holiday weekends."
  }];
  var MAXY = 5100000;
  var SOFAR = [{
    p: "March",
    a: 225817,
    b: null,
    c: "+45%",
    n: "Busiest March since 2016"
  }, {
    p: "January to April",
    a: 836458,
    b: 739313,
    c: "+13%",
    n: "February +12%, April +2%"
  }, {
    p: "May",
    a: 532280,
    b: 497401,
    c: "+7%",
    n: "Worked out from the totals"
  }, {
    p: "June",
    a: 634508,
    b: 607410,
    c: "+4.5%",
    n: "Second-busiest June on record"
  }, {
    p: "July",
    a: 654356,
    b: 616551,
    c: "+6.1%",
    n: "Later summary: 665,877, +8%"
  }, {
    p: "January to July",
    a: 2657602,
    b: 2460675,
    c: "+8%",
    n: "Later summary: about 2.59 million, +9.5%"
  }];
  var JUNJUL = [{
    m: "June",
    rows: [["2024", 588251, "Peak Hours Plus"], ["2025", 607410, "Scaled back"], ["2026", 634508, "None"]]
  }, {
    m: "July",
    rows: [["2024", 596711, "Peak Hours Plus"], ["2025", 616551, "Scaled back"], ["2026", 654356, "None"]]
  }];
  var GATES = [["Tioga Pass", 21.5], ["South Entrance (Highway 41)", 10.1], ["Arch Rock (Highway 140)", 9.8], ["Big Oak Flat (Highway 120)", 6.6]];
  var YTD26 = 2657602;
  var REST25 = 4278413 - 2460675;
  var SCEN = [{
    g: 0,
    label: "August to December match 2025"
  }, {
    g: 4,
    label: "Four percent above 2025"
  }, {
    g: 8,
    label: "Eight percent above 2025, this year's pace"
  }].map(s => ({
    ...s,
    total: Math.round(YTD26 + REST25 * (1 + s.g / 100))
  }));
  var NEED_2019 = 4422861 - YTD26;
  var ROADS = [{
    name: "Tioga Road",
    note: "2026: opened May 15, the earliest in 16 years",
    s: "ccccvvoooowc"
  }, {
    name: "Glacier Point Road",
    note: "2026: opened May 9",
    s: "ccccvooooowc"
  }, {
    name: "Mariposa Grove Road and shuttle",
    note: "Closes about November 30; opens no earlier than April 15",
    s: "cccvoooooooc"
  }, {
    name: "Hetch Hetchy Road",
    note: "Open all year, sunrise to sunset",
    s: "oooooooooooo"
  }, {
    name: "Valley roads and Highways 41, 120, 140",
    note: "No seasonal closure; storms and chain rules still apply",
    s: "oooooooooooo"
  }];
  var STATE = {
    o: ["is-open", "Open", "open"],
    v: ["is-varies", "Opens when the snow allows", "opening season"],
    w: ["is-closing", "Usually closes in November", "usually closes"],
    c: ["is-closed", "Closed", "closed"]
  };
  var TIOGA = ROADS[0].s;
  var GLACIER = ROADS[1].s;
  var CLOCK = [["2022 peak hours", 6, 16, "6 a.m. to 4 p.m.", "is-nps"], ["2024 Peak Hours Plus", 5, 16, "5 a.m. to 4 p.m.", "is-nps"], ["2025 peak hours", 6, 14, "6 a.m. to 2 p.m.", "is-nps"], ["Talus Field: in before", 5, 8, "Through the gate by 8 a.m.", "is-pick"], ["Talus Field: or after", 16, 20, "After 4 p.m.", "is-pick"]];
  var AX0 = 5,
    AX1 = 20;
  var MCARD = [{
    t: "The quietest month by the Park Service's averages. The Valley is open and mostly empty, and chains ride in the car."
  }, {
    t: "Firefall month: Horsetail Fall can glow at sunset, February 10 to 26 in 2026, depending on weather and water flow. The park used staff, not reservations, to manage it.",
    y: "2026: February +12% on 2025."
  }, {
    t: "Waterfalls building against a fraction of summer's crowds. Spring break weeks fill the Valley lots.",
    y: "2026: 225,817 visits, up 45%, the busiest March since 2016."
  }, {
    t: "Full falls, light crowds. Tioga Road is still closed in most years, and the Mariposa Grove road opens no earlier than April 15.",
    y: "2026: April +2%."
  }, {
    t: "Peak waterfall month. Memorial Day weekend behaves like July: Valley parking has filled as early as 8 a.m.",
    y: "2026: Glacier Point Road opened May 9, Tioga Road May 15."
  }, {
    t: "Peak season. School breaks build the crowds, and the falls start to thin.",
    y: "2026: 634,508 visits, the second-busiest June on record."
  }, {
    t: "The busiest month on average. Every road is usually open, the Valley runs hot, and the big falls thin.",
    y: "2026: 654,356 visits, up 6.1%. July 4 and Juneteenth ran without significant delays."
  }, {
    t: "Nearly as busy as July. Smoke season starts to matter, and the falls are near dry."
  }, {
    t: "The split month. Labor Day weekend (September 5 to 7 in 2026) behaves like July; the days after it do not."
  }, {
    t: "The sleeper. Cooler days, fall color in the Valley, and the first storms. Tioga Road usually stays open for most of the month.",
    y: "2025: Tioga Road closed temporarily October 13 and reopened October 17.",
    next: true
  }, {
    t: "Quiet except for Thanksgiving week (November 26 in 2026). Days are short, and the high roads close.",
    next: true
  }, {
    t: "Quiet until the holiday week, when the lodges fill and the Valley loop slows.",
    next: true
  }];
  var fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  var pc = (v, max) => Math.max(0.6, v / max * 100).toFixed(2) + "%";
  function TypicalYear() {
    var label = "Column chart of average monthly visits to Yosemite, 2010 to 2024, on a scale where July is 100. " + MONTHS.map((m, i) => m + " " + INDEX[i] + " (" + fmt(AVG[i]) + " visits)").join(", ") + ". May through October carry nearly 75 percent of the year.";
    return React.createElement("figure", {
      className: "wv-fig"
    }, React.createElement("div", {
      className: "wv-cols",
      role: "img",
      "aria-label": label
    }, MONTHS.map((m, i) => React.createElement("div", {
      key: m,
      className: "wv-col" + (i >= 4 && i <= 9 ? " is-peak" : ""),
      "aria-hidden": "true"
    }, React.createElement("b", null, INDEX[i]), React.createElement("i", {
      style: {
        height: INDEX[i] + "%"
      }
    }), React.createElement("span", null, m)))), React.createElement("figcaption", null, "Average monthly visits, 2010 to 2024, on a scale where July (624,559) is 100. The darker bars, May through October, carry nearly 75 percent of the year. Source: National Park Service, Yosemite Visitation Statistics. Index: The Talus Field."));
  }
  function DecadeBars() {
    var flat = SCEN[0].total,
      fast = SCEN[2].total;
    var label = "Bar chart of Yosemite recreation visits by year. " + YEARS.map(r => r.y + ": " + fmt(r.v)).join("; ") + ". 2026 is projected between 4,475,340 and 4,620,759, which would rank second behind 2016.";
    return React.createElement("figure", {
      className: "wv-fig"
    }, React.createElement("ol", {
      className: "wv-hbars",
      role: "img",
      "aria-label": label
    }, YEARS.map(r => React.createElement("li", {
      key: r.y,
      "aria-hidden": "true"
    }, React.createElement("span", {
      className: "wv-hbars__y"
    }, r.y), React.createElement("span", {
      className: "wv-hbars__track"
    }, React.createElement("i", {
      style: {
        width: pc(r.v, MAXY)
      }
    })), React.createElement("b", {
      className: "wv-hbars__v"
    }, (r.v / 1e6).toFixed(2), "M"), React.createElement("small", null, r.rule))), React.createElement("li", {
      className: "is-proj",
      "aria-hidden": "true"
    }, React.createElement("span", {
      className: "wv-hbars__y"
    }, "2026"), React.createElement("span", {
      className: "wv-hbars__track"
    }, React.createElement("i", {
      className: "wv-hbars__ytd",
      style: {
        width: pc(YTD26, MAXY)
      }
    }), React.createElement("i", {
      className: "wv-hbars__proj",
      style: {
        left: pc(YTD26, MAXY),
        width: ((fast - YTD26) / MAXY * 100).toFixed(2) + "%"
      }
    }), React.createElement("i", {
      className: "wv-hbars__flat",
      style: {
        left: pc(YTD26, MAXY),
        width: ((flat - YTD26) / MAXY * 100).toFixed(2) + "%"
      }
    })), React.createElement("b", {
      className: "wv-hbars__v"
    }, "4.5 to 4.6M"), React.createElement("small", null, "No reservations. Solid: counted through July. Hatched: the site's projection."))), React.createElement("figcaption", null, "Recreation visits per year, in millions. Source: NPS Visitor Use Statistics for 2016 to 2025; reservation dates from the park's announcements; 2026 projection by The Talus Field (method below)."));
  }
  function JuneJuly() {
    var MAXJ = 700000;
    var label = "Bar chart of June and July visits in 2024, 2025 and 2026. June: 588,251, 607,410, 634,508. July: 596,711, 616,551, 654,356. Each year is higher than the last as reservation rules loosened.";
    return React.createElement("figure", {
      className: "wv-fig"
    }, React.createElement("div", {
      className: "wv-jj",
      role: "img",
      "aria-label": label
    }, JUNJUL.map(g => React.createElement("div", {
      key: g.m,
      className: "wv-jj__group",
      "aria-hidden": "true"
    }, React.createElement("h3", null, g.m), React.createElement("ol", null, g.rows.map(([y, v, rule]) => React.createElement("li", {
      key: y,
      className: y === "2026" ? "is-now" : ""
    }, React.createElement("span", {
      className: "wv-jj__y"
    }, y), React.createElement("span", {
      className: "wv-jj__track"
    }, React.createElement("i", {
      style: {
        width: pc(v, MAXJ)
      }
    })), React.createElement("b", null, fmt(v)), React.createElement("small", null, rule))))))), React.createElement("figcaption", null, "Recreation visits in the two peak months. 2024 ran Peak Hours Plus, 2025 a scaled-back version, 2026 nothing. Source: NPS Visitor Use Statistics as quoted in park reports."));
  }
  function GateGrowth() {
    var label = "Bar chart of visitation growth January to July 2026 over 2025 by entrance: " + GATES.map(([n, g]) => n + " up " + g + " percent").join("; ") + ". Hetch Hetchy was down.";
    return React.createElement("figure", {
      className: "wv-fig wv-fig--small"
    }, React.createElement("ol", {
      className: "wv-gates",
      role: "img",
      "aria-label": label
    }, GATES.map(([n, g]) => React.createElement("li", {
      key: n,
      "aria-hidden": "true"
    }, React.createElement("span", null, n), React.createElement("span", {
      className: "wv-gates__track"
    }, React.createElement("i", {
      style: {
        width: pc(g, 25)
      }
    })), React.createElement("b", null, "+", g, "%"))), React.createElement("li", {
      "aria-hidden": "true"
    }, React.createElement("span", null, "Hetch Hetchy"), React.createElement("span", {
      className: "wv-gates__track"
    }), React.createElement("b", null, "Down"))), React.createElement("figcaption", null, "Change in visitation by entrance, January to July 2026 against the same months of 2025, as reported September 1 from Park Service data (Sierra News Online). Not checked against the Park Service's own table."));
  }
  function RoadStrip() {
    var label = "Seasonal pattern of Yosemite's roads by month. Tioga Road: closed January to April, opens in May or June depending on snow, open July to October, usually closes in November, closed December. Glacier Point Road: closed January to April, opens in May, open June to October, usually closes in November. Mariposa Grove Road and shuttle: closed January to March, opens April 15 at the earliest, open through November, closed December. Hetch Hetchy Road, the Valley roads and the highways into the park have no seasonal closure.";
    return React.createElement("figure", {
      className: "wv-fig"
    }, React.createElement("div", {
      className: "wv-roads",
      role: "img",
      "aria-label": label
    }, React.createElement("div", {
      className: "wv-roads__head",
      "aria-hidden": "true"
    }, React.createElement("span", null), MONTHS.map(m => React.createElement("b", {
      key: m
    }, m[0]))), ROADS.map(r => React.createElement("div", {
      key: r.name,
      className: "wv-roads__row",
      "aria-hidden": "true"
    }, React.createElement("span", {
      className: "wv-roads__name"
    }, r.name, React.createElement("small", null, r.note)), React.createElement("span", {
      className: "wv-roads__cells"
    }, r.s.split("").map((c, i) => React.createElement("i", {
      key: i,
      className: STATE[c][0],
      title: FULL[i] + ": " + STATE[c][1]
    })))))), React.createElement("ul", {
      className: "wv-key",
      "aria-hidden": "true"
    }, React.createElement("li", {
      className: "is-open"
    }, "Open"), React.createElement("li", {
      className: "is-varies"
    }, "Opens when the snow allows"), React.createElement("li", {
      className: "is-closing"
    }, "Usually closes"), React.createElement("li", {
      className: "is-closed"
    }, "Closed")), React.createElement("figcaption", null, "The Park Service's seasonal pattern: Tioga and Glacier Point roads close from sometime in November to late May or early June; the Mariposa Grove road and shuttle close on or about November 30 and reopen no earlier than April 15. Road status changes with the weather, so check the conditions page the morning you drive in."));
  }
  function ClockChart() {
    var span = AX1 - AX0;
    var ticks = [5, 8, 11, 14, 17, 20];
    var hr = h => h === 12 ? "12p" : h > 12 ? h - 12 + "p" : h + "a";
    var label = "Chart of the hours the Park Service gated with reservations, 5 a.m. to 8 p.m. In 2022 reservations covered 6 a.m. to 4 p.m., in 2024 5 a.m. to 4 p.m., in 2025 6 a.m. to 2 p.m. The site's advice is to be through the gate before 8 a.m. or to arrive after 4 p.m.";
    return React.createElement("figure", {
      className: "wv-fig"
    }, React.createElement("div", {
      className: "wv-clock",
      role: "img",
      "aria-label": label
    }, CLOCK.map(([name, a, b, txt, cls]) => React.createElement("div", {
      key: name,
      className: "wv-clock__row",
      "aria-hidden": "true"
    }, React.createElement("span", {
      className: "wv-clock__name"
    }, name), React.createElement("span", {
      className: "wv-clock__track"
    }, React.createElement("i", {
      className: cls,
      style: {
        left: ((a - AX0) / span * 100).toFixed(2) + "%",
        width: ((b - a) / span * 100).toFixed(2) + "%"
      }
    }, React.createElement("em", null, txt))))), React.createElement("div", {
      className: "wv-clock__axis",
      "aria-hidden": "true"
    }, React.createElement("span", null), React.createElement("span", {
      className: "wv-clock__ticks"
    }, ticks.map(h => React.createElement("b", {
      key: h,
      style: {
        left: ((h - AX0) / span * 100).toFixed(2) + "%"
      }
    }, hr(h)))))), React.createElement("figcaption", null, "The grey bars are the hours the Park Service itself treated as over capacity when it ran reservations: 2022, 2024 and 2025. The green bars are this article's advice, not a Park Service rule. Hourly entrance counts are not published, so none are drawn."));
  }
  return React.createElement("div", {
    className: "wv-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "Reservations"), React.createElement("dd", null, "None in 2026")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "users"
  }), React.createElement("dt", null, "Through July"), React.createElement("dd", null, "2,657,602 visits, up 8%")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "Busiest month"), React.createElement("dd", null, "July, by the 15-year average")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("dt", null, "Best hour"), React.createElement("dd", null, "In before 8 a.m. or after 4 p.m."))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section wv-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "wv-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "Yosemite needs no reservation in 2026, and it is on pace for the second-busiest year on record. The park counted 2,657,602 visits through July, 8 percent ahead of 2025. So the question is no longer whether you can get in. It is which month, which day and which hour. The short answer: midweek in October is the best window left this year, and on any other trip, be through the gate before 8 a.m. or arrive after 4 p.m."), React.createElement("p", null, "In March, 225,817 people visited, 45 percent more than the March before and the busiest March since 2016. Memorial Day weekend showed what no throttle looks like: Valley parking filling as early as 8 a.m. and entrance waits that reports put past an hour. I made ", React.createElement("a", {
    href: "/articles/yosemite-needs-a-reservation-system"
  }, "my argument about whether this was a good idea"), " after that weekend. This piece answers the question that arrives in my inbox every week now: when should you actually come?"), React.createElement("p", null, "I went through the National Park Service's visitor use statistics: annual visits since 2016, the Park Service's 15-year monthly averages, and the 2026 counts as the park has published them. This edition was rebuilt on October 1, so the forecast looks at the months still ahead, then at 2027. Every figure is either a published number or arithmetic on published numbers, and anything that is my projection says so.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "calendar"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "No reservation is needed in 2026. The park manages traffic with staff, parking control and live information instead."), React.createElement("li", null, "July, August and June are the busiest months. January, February and December are the quietest."), React.createElement("li", null, "The best window left in 2026: midweek in October, then early-November weekdays."), React.createElement("li", null, "Any summer day: through the gate before 8 a.m., or after 4 p.m."), React.createElement("li", null, "Text YNPTRAFFIC to 333111 for live parking and traffic updates."))))), React.createElement("section", {
    className: "ff-band",
    id: "sec-0-the-throttle-is-gone",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE THROTTLE IS GONE"), React.createElement("h2", null, "Demand rose every year, with or without a gate"), React.createElement("p", {
    className: "ff-lede"
  }, "Yosemite has spent six years running an accidental experiment in demand management. Visitation has climbed every year since 2020, through every version of the rules. The reservation systems did not reduce the wish to be here. They moved it, spread it and metered it."), React.createElement(DecadeBars, null), React.createElement("div", {
    className: "wv-two"
  }, React.createElement("p", null, React.createElement("strong", null, "2024 was the broadest system."), " Peak Hours Plus required a reservation from 5 a.m. to 4 p.m., on weekends from April 13 to June 30, every day from July 1 to August 16, and on weekends again from August 17 to October 27. Entry after 4 p.m. needed none."), React.createElement("p", null, React.createElement("strong", null, "2025 was the scaled-back version."), " A reservation was required from 6 a.m. to 2 p.m. over Memorial Day weekend (May 24 to 26), every day from June 15 to August 15, and over Labor Day weekend (August 30 to September 1). Each cost $2 and was good for three days."), React.createElement("p", null, React.createElement("strong", null, "2026 has none."), " The Park Service said it would no longer use a timed reservation system, and for the first time in three years the February firefall weekends ran without one. It is managing the year with real-time traffic monitoring, active parking management and visitor information tools instead.")), React.createElement("p", {
    className: "ff-note"
  }, "2025 was the fourth-busiest year on record, behind 2016, 2019 and 2017. These are recreation visits, the series the Park Service publishes in its Visitor Use Statistics. The park's own statistics page prints a differently counted annual series (4,285,729 for 2024); nothing here mixes the two."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-1-what-2026-looks-like-so-far",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "2026 SO FAR"), React.createElement("h2", null, "Eight percent ahead, with spring leading"), React.createElement("p", {
    className: "ff-lede"
  }, "Through July the park logged 2,657,602 visits against 2,460,675 in the same months of 2025. The growth was not even. Spring jumped, and the peak months rose more modestly."), React.createElement("div", {
    className: "wv-prose"
  }, React.createElement("p", null, "March, the first full month after the no-reservation news, was up 45 percent, although the comparison flatters 2026 a little because storms held March 2025 down. February was up 12 percent and April up 2 percent. Headlines move visitation, and this year's headline was that Yosemite is open with no ticket required."), React.createElement("p", null, "June came in at 634,508 visits, the second-busiest June on record behind only 2016. July was 654,356 by the August reports, up 6.1 percent on July 2025. A Park Service summary published September 1 quotes July as 665,877, up 8 percent, and the first seven months as about 2.59 million, up 9.5 percent. The counts do not agree to the visit, so read them as eight to ten percent ahead, not as a decimal."))), React.createElement("div", {
    className: "wv-stack"
  }, React.createElement("div", {
    className: "wv-tablewrap"
  }, React.createElement("table", {
    className: "wv-table"
  }, React.createElement("caption", null, "Recreation visits, 2026 against 2025"), React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Period"), React.createElement("th", {
    scope: "col"
  }, "2026"), React.createElement("th", {
    scope: "col"
  }, "2025"), React.createElement("th", {
    scope: "col"
  }, "Change"))), React.createElement("tbody", null, SOFAR.map(r => React.createElement("tr", {
    key: r.p
  }, React.createElement("th", {
    scope: "row"
  }, r.p, React.createElement("small", null, r.n)), React.createElement("td", null, fmt(r.a)), React.createElement("td", null, r.b ? fmt(r.b) : "n/a"), React.createElement("td", null, React.createElement("b", null, r.c))))))), React.createElement("p", {
    className: "ff-note"
  }, "Sources: Park Service reports quoted in the press, August 23 and September 1, 2026. May is the January to July total minus the other rows. The March 2025 figure is not printed here because it was not published; 225,817 is 44.98 percent above it."))), React.createElement(GateGrowth, null)), React.createElement("section", {
    className: "ff-band",
    id: "sec-2-what-the-reservation-years-actually-did",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT THE RESERVATION YEARS DID"), React.createElement("h2", null, "Each loosening was followed by a busier summer"), React.createElement("p", {
    className: "ff-lede"
  }, "To see why 2026 summer set near-records, look at the two peak months under each rule. June and July rose in 2025 when the system was trimmed, and again in 2026 when it was removed."), React.createElement(JuneJuly, null), React.createElement("div", {
    className: "wv-two"
  }, React.createElement("p", null, React.createElement("strong", null, "The Park Service's own 2025 count."), " Visitation through August 2025 totaled 2,919,722, up seven percent on the same months of 2024 (2,727,496), and every month outpaced 2024 except February, when winter storms limited access."), React.createElement("p", null, React.createElement("strong", null, "What stayed manageable."), " The park counts only two days of significant delays in 2026, both over Memorial Day weekend, against more than 120 days of gridlock in past years. It credits digital passes, fast lanes at the entrances, added Valley parking, extra shuttles and published entrance wait times."), React.createElement("p", null, React.createElement("strong", null, "What the visitors said."), " In a Washington State University survey for the park, taken August 7 to 16 with 1,203 responses, 91 percent had no entrance delay or waited less than 15 minutes, 56 percent spent less time looking for parking than they expected, and 11 percent said parking took somewhat or much too long.")), React.createElement("p", {
    className: "ff-note"
  }, "A survey of ten August days is not a summer-long wait time. Memorial Day weekend is the counterexample, and holiday weekends are where a full road network binds."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-3-how-i-built-the-forecast",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE PROJECTION"), React.createElement("h2", null, "How I built it, and what it says"), React.createElement("p", {
    className: "ff-lede"
  }, "This is the site's projection, not a Park Service number. It rests on one count and one assumption, and it holds up across a wide range of the assumption."), React.createElement("ol", {
    className: "wv-steps"
  }, React.createElement("li", null, React.createElement("strong", null, "Start with what is counted."), " January to July 2026: ", fmt(YTD26), " visits."), React.createElement("li", null, React.createElement("strong", null, "Add the rest of 2025."), " The 2025 total (4,278,413) minus January to July 2025 (2,460,675) is ", fmt(REST25), " visits for August to December."), React.createElement("li", null, React.createElement("strong", null, "Scale it."), " Multiply that remainder by how much busier August to December 2026 runs than 2025. I show zero, four and eight percent; eight is the year-to-date pace.")), React.createElement("p", {
    className: "ff-note"
  }, "I no longer publish a month-by-month visit forecast. The first version of this article estimated months the Park Service had not yet reported, and some of those estimates were wrong once the real numbers arrived. The Park Service posts August to December as the months close; this page will take those instead.")), React.createElement("div", {
    className: "wv-stack"
  }, React.createElement("div", {
    className: "wv-tablewrap"
  }, React.createElement("table", {
    className: "wv-table wv-table--scen"
  }, React.createElement("caption", null, "Where 2026 ends, by scenario"), React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "August to December"), React.createElement("th", {
    scope: "col"
  }, "2026 total"), React.createElement("th", {
    scope: "col"
  }, "Rank"))), React.createElement("tbody", null, SCEN.map(s => React.createElement("tr", {
    key: s.g
  }, React.createElement("th", {
    scope: "row"
  }, s.label), React.createElement("td", null, fmt(s.total)), React.createElement("td", null, React.createElement("b", null, "2nd"))))))), React.createElement("ul", {
    className: "wv-rank"
  }, React.createElement("li", null, React.createElement("strong", null, "Second place holds"), " unless August to December comes in about 3 percent below 2025 or worse: 2019 (4,422,861) needs ", fmt(NEED_2019), " more visits after July, against ", fmt(REST25), " in the same months of 2025."), React.createElement("li", null, React.createElement("strong", null, "First place is out of reach."), " Beating 2016 (5,028,868) would take about 30 percent more than 2025 over those five months."))))), React.createElement("section", {
    className: "ff-band",
    id: "sec-4-the-crowd-calendar",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE CROWD CALENDAR"), React.createElement("h2", null, "Every month, on the Park Service's own averages"), React.createElement("p", {
    className: "ff-lede"
  }, "The best planning tool is the park's 15-year monthly average. July is the busiest month, August is nearly as busy, and the six months from May to October carry nearly three-quarters of the year. 2026 has run about eight percent above 2025, so read every bar as a little taller."), React.createElement(TypicalYear, null), React.createElement("p", {
    className: "ff-note"
  }, "The index and the cards below do not split weekdays from weekends. The Park Service does not publish a weekday series, and the first version of this article invented one."), React.createElement("ol", {
    className: "wv-months"
  }, MCARD.map((c, i) => React.createElement("li", {
    key: FULL[i],
    className: c.next ? "is-next" : "",
    style: {
      "--v": (INDEX[i] / 100).toFixed(2)
    }
  }, React.createElement("header", null, React.createElement("h3", null, FULL[i]), c.next ? React.createElement("span", {
    className: "wv-tag"
  }, "Still ahead in 2026") : null), React.createElement("p", {
    className: "wv-months__num"
  }, React.createElement("b", null, INDEX[i]), " on the July scale ", React.createElement("span", null, fmt(AVG[i]), " visits, 15-year average")), React.createElement("span", {
    className: "wv-meter",
    "aria-hidden": "true"
  }, React.createElement("i", null)), React.createElement("p", null, c.t), c.y ? React.createElement("p", {
    className: "wv-months__y"
  }, c.y) : null, React.createElement("p", {
    className: "wv-months__roads"
  }, "Tioga Road: ", STATE[TIOGA[i]][2], ". Glacier Point Road: ", STATE[GLACIER[i]][2], ".")))), React.createElement("p", {
    className: "ff-lede wv-after"
  }, "Two links go with the calendar. ", React.createElement("a", {
    href: "/articles/yosemite-in-june"
  }, "Low snowpack pushed the waterfall peak into May"), " this year, so the falls were past their best while the crowds were at theirs. And in September, ", React.createElement("a", {
    href: "/articles/yosemite-in-september-2026"
  }, "the concessions start closing around you"), ": summer weather and open high country, with the crowds thinned. December is also ", React.createElement("a", {
    href: "/articles/bracebridge-dinner-and-vintners-holidays"
  }, "the Bracebridge Dinner month at The Ahwahnee"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "what-is-open-when",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT IS OPEN, WHEN"), React.createElement("h2", null, "The roads decide more than the crowds do"), React.createElement("p", {
    className: "ff-lede"
  }, "A quiet month is no use if the road you came for is closed. The seasonal roads follow snow, not the calendar, and this year's openings were early."), React.createElement(RoadStrip, null), React.createElement("p", {
    className: "ff-note"
  }, "As the Park Service's conditions page read on October 1, 2026, Glacier Point Road was closed for smoke and firefighting, and the Mist Trail was open Friday to Sunday and holidays, and Monday to Thursday only from 3:30 p.m. to 7 a.m., through October. Both change, so check it before you drive.")), React.createElement("section", {
    className: "ff-band",
    id: "sec-5-the-clock-beats-the-calendar",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE CLOCK BEATS THE CALENDAR"), React.createElement("h2", null, "The hour you reach the gate matters most"), React.createElement("p", {
    className: "ff-lede"
  }, "The difference between a miserable Yosemite day and a great one is mostly when you reach the gate. The Park Service has published its own definition of over capacity three times, in the hours it gated."), React.createElement("div", {
    className: "wv-prose"
  }, React.createElement("p", null, "Every reservation system covered the same stretch of the day, from 5 or 6 in the morning to 2 or 4 in the afternoon. With no system in 2026, you enforce it on yourself. Valley parking fills early on peak days: reports put it as soon as 8 a.m. over Memorial Day weekend, and typically between 10 and 11 a.m. on summer Saturdays and holidays."))), React.createElement("ul", {
    className: "ff-rules wv-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "sun"
  }), React.createElement("strong", null, "Be through by 8"), React.createElement("p", null, "Before 7 on summer weekends. A Tuesday or Wednesday through the gate by 7:30 beats a Saturday.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("strong", null, "Or arrive after 4"), React.createElement("p", null, "Summer light lasts past 8. An evening visit with dinner outside the park beats a noon arrival.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no"
  }), React.createElement("strong", null, "Skip 9 to 2"), React.createElement("p", null, "On a summer weekend, the entrance lines form and the Valley lots close behind you.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "car"
  }), React.createElement("strong", null, "Stay parked"), React.createElement("p", null, "Use the shuttles and bikes. A Valley spot on a July Saturday is not worth gambling for twice.")))), React.createElement(ClockChart, null), React.createElement("p", {
    className: "ff-note"
  }, "Text ", React.createElement("strong", null, "YNPTRAFFIC"), " to ", React.createElement("strong", null, "333111"), " for the park's live parking and traffic updates, and check road and lot status before you commit to the drive. This is the same Highway 140 gate guidance I watch every morning from El Portal."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-6-the-days-i-would-pick",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE DAYS I WOULD PICK"), React.createElement("h2", null, "If I were planning from outside the area"), React.createElement("p", {
    className: "ff-lede"
  }, "Plan for ", React.createElement("a", {
    href: "/articles/yosemite-in-three-to-five-days"
  }, "enough days to give each part of the park its own day"), ", then choose in this order."), React.createElement("ol", {
    className: "wv-picks"
  }, React.createElement("li", null, React.createElement("span", null, "Best left in 2026"), React.createElement("strong", null, "Midweek in October"), React.createElement("p", null, "The 15-year average for October is 62 on the July scale, about 38 percent below July. Cooler days, quieter trails and ", React.createElement("a", {
    href: "/articles/yosemite-in-fall"
  }, "fall color in the Valley"), " by the back half of the month. Tioga Road usually stays open, but the first storm can close it: in 2025 the park closed it temporarily on October 13 and reopened it October 17. See also ", React.createElement("a", {
    href: "/articles/yosemite-in-october-2026"
  }, "Yosemite in October 2026"), ".")), React.createElement("li", null, React.createElement("span", null, "Quieter still"), React.createElement("strong", null, "Early November, midweek"), React.createElement("p", null, "November averages 31 on the July scale: the Valley close to empty, at the price of short days. Skip Thanksgiving week, and expect the high roads to close.")), React.createElement("li", null, React.createElement("span", null, "For 2027"), React.createElement("strong", null, "The days after Labor Day"), React.createElement("p", null, "September averages 82 on the July scale, and the Park Service gated Labor Day weekend in 2025, so plan around that weekend and take the days after it. The last week of September is also ", React.createElement("a", {
    href: "/articles/yosemite-facelift-volunteer-guide"
  }, "the Yosemite Facelift, the park's biggest volunteer cleanup"), " (September 23 to 27 in 2026), and it fits into a normal visit.")), React.createElement("li", null, React.createElement("span", null, "For 2027"), React.createElement("strong", null, "Spring, for the waterfalls"), React.createElement("p", null, "Waterfalls at full volume against a fraction of summer's crowds. But this year proved that spring is where new growth lands first: March was up 45 percent. Expect next March to look like this year's April.")), React.createElement("li", null, React.createElement("span", null, "If summer is what you have"), React.createElement("strong", null, "A Tuesday or Wednesday, in by 7:30"), React.createElement("p", null, "A well-run July weekday beats a badly run September Saturday. My ", React.createElement("a", {
    href: "/articles/yosemite-without-reservations-2026"
  }, "no-reservations strategy piece"), " covers the full playbook, and if it is your first visit, ", React.createElement("a", {
    href: "/articles/first-time-yosemite-overwhelm"
  }, "start here instead"), "."))), React.createElement("div", {
    className: "ff-alert wv-avoid"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("p", null, React.createElement("strong", null, "Days to plan around."), " Memorial Day weekend, the one weekend that backed up in 2026. Any summer Saturday arriving after 8:30 a.m. Labor Day weekend. The holiday week in late December if you are not staying in the park. The park says July 4 ran without significant delays this year, but a holiday Saturday is the day to leave the margin on."))), React.createElement("section", {
    className: "ff-band",
    id: "sec-7-what-could-bend-the-curve",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT COULD CHANGE"), React.createElement("h2", null, "What would bend the curve"), React.createElement("p", {
    className: "ff-lede"
  }, "Forecasts age badly in public, so here is what would change this one."), React.createElement("ul", {
    className: "ff-rules wv-bend"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "cloud"
  }), React.createElement("strong", null, "Smoke"), React.createElement("p", null, "A bad smoke season can erase an August, and fire can close a road: Glacier Point Road was closed for it on October 1.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "users"
  }), React.createElement("strong", null, "Coverage"), React.createElement("p", null, "If early-season chaos keeps making national news, some casual visitors will stay home, and fall comes in under the line.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("strong", null, "Policy"), React.createElement("p", null, "A shutdown, a flood or a reversal of the no-reservation decision would bend the curve. None is announced.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "check"
  }), React.createElement("strong", null, "The management"), React.createElement("p", null, "By the park's own count the toolkit held: two delay days all year, against more than 120 in past years."))), React.createElement("p", {
    className: "ff-lede wv-after"
  }, "None of that changes the planning logic. Demand for this park has risen every year since 2020, the gate is open in 2026, and the only variables you control are the month, the day and the hour. Choose all three on purpose. The park at 6:45 on a September morning is still the park that made the record books, minus the line to get in."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "when-to-visit-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "When to visit, answered"), React.createElement("div", {
    className: "wv-sources"
  }, React.createElement("h3", null, "Sources, read October 1, 2026"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/visitation.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Visitation statistics (monthly averages, 2010 to 2024), NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/management/statistics.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Park statistics, NPS Yosemite"), " and ", React.createElement("a", {
    href: "https://irma.nps.gov/STATS/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "NPS Visitor Use Statistics"), " (annual recreation visits 2016 to 2025, as compiled by ", React.createElement("a", {
    href: "http://www.nationalsitesguide.com/sites/yosemite/visitation/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "National Sites Guide"), ", since the NPS report viewer does not render in plain text)"), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/reservations.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Entrance reservations, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/news/more-visitors-less-waiting-yosemite-survey-shows-strong-peak-season-visitor-experience.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "More Visitors, Less Waiting: Yosemite Survey Shows Strong Peak-Season Visitor Experience, NPS, August 28, 2026")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/news/yosemite-national-park-reports-strong-summer-visitation-numbers.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite reports strong summer visitation numbers, NPS, September 4, 2025")), React.createElement("li", null, React.createElement("a", {
    href: "https://home.nps.gov/yose/learn/news/yosemite-national-park-announces-summer-reopenings-full-campground-access-and-early-tioga-road-opening.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Summer reopenings and early Tioga Road opening, NPS, May 13, 2026")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/wroads.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Winter road closures"), " and ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "current conditions, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://sierranewsonline.com/more-visitors-shorter-waits-yosemite-releases-new-summer-data/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Sierra News Online, September 1, 2026"), " (July count, entrance growth) and ", React.createElement("a", {
    href: "https://www.activenorcal.com/yosemite-says-its-traffic-problem-is-solved-the-internet-isnt-so-sure/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Active NorCal, August 23, 2026"), " (July count, parking) and ", React.createElement("a", {
    href: "https://www.activenorcal.com/yosemite-just-had-one-of-the-busiest-junes-in-its-history/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Active NorCal, July 12, 2026"), " (June and March)"), React.createElement("li", null, React.createElement("a", {
    href: "https://abc7news.com/post/what-know-before-going-yosemite-long-waits-packed-trails-crowds-surge-reservation-system-ends/19177255/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "ABC7, crowds after the reservation system ends"), " (monthly change, parking, the traffic text line) and ", React.createElement("a", {
    href: "https://www.islands.com/2077936/yosemite-famed-winter-firefall-free-without-reservatins-first-time-years",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Islands, the 2026 firefall without reservations")), React.createElement("li", null, "The 2021, 2022, 2024 and 2025 reservation dates and the October 13, 2025 Tioga Road closure are from the park's announcements of those years, as carried by Sierra Rec Magazine, Sierra Wave and the Sierra Times.")), React.createElement("p", {
    className: "ff-note"
  }, "Where two sources differ, the page says so. The July 2026 count, the year-to-date total and the entrance percentages are the ones to recheck when the Park Service posts August."))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))));
};
