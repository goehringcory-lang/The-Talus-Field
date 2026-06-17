window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["when-to-visit-yosemite-2026-crowd-forecast"] = function WhenToVisitYosemite2026CrowdForecastBody() {
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var Y2024 = [110, 130, 150, 245, 365, 588, 597, 540, 505, 430, 250, 210];
  var Y2025 = [148, 120, 156, 315, 400, 607, 628, 545, 500, 415, 245, 200];
  var Y2026_ACTUAL = [155, 140, 226, 315];
  var Y2026_PROJ = [460, 650, 665, 585, 550, 455, 265, 215];
  var Y2026 = Y2026_ACTUAL.concat(Y2026_PROJ);
  var CROWD = [{
    wd: 16,
    we: 23,
    note: null
  }, {
    wd: 16,
    we: 23,
    note: "Firefall"
  }, {
    wd: 23,
    we: 34,
    note: null
  }, {
    wd: 33,
    we: 49,
    note: null
  }, {
    wd: 47,
    we: 69,
    note: "Memorial Day"
  }, {
    wd: 68,
    we: 100,
    note: null
  }, {
    wd: 68,
    we: 100,
    note: "July 4"
  }, {
    wd: 60,
    we: 88,
    note: null
  }, {
    wd: 58,
    we: 85,
    note: "Labor Day"
  }, {
    wd: 46,
    we: 68,
    note: null
  }, {
    wd: 28,
    we: 41,
    note: "Thanksgiving"
  }, {
    wd: 22,
    we: 32,
    note: "Holidays"
  }];
  var HOURLY = [4, 10, 22, 42, 70, 92, 100, 95, 85, 72, 58, 45, 32, 20, 12, 6];
  var HOUR_LABELS = ["5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p"];
  var AXIS = {
    fontFamily: "var(--sans)",
    fontSize: 13,
    fill: "var(--ink-3)"
  };
  var LEGEND = {
    fontFamily: "var(--sans)",
    fontSize: 13.5,
    fill: "var(--ink-2)"
  };
  var svgStyle = {
    width: "100%",
    height: "auto",
    display: "block"
  };
  var SOURCE_NOTE = "Source: NPS Visitor Use Statistics; 2026 figures preliminary. Months without a published figure are estimated from NPS period totals and rounded. Projection: The Talus Field.";
  function ForecastChart() {
    var W = 680,
      H = 350,
      L = 44,
      R = 10,
      T = 34,
      B = 26;
    var plotW = W - L - R,
      plotH = H - T - B,
      MAX = 700;
    var band = plotW / 12,
      barW = band * 0.62;
    var x = i => L + i * band + band / 2;
    var y = v => T + plotH - v / MAX * plotH;
    var line2025 = Y2025.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: svgStyle,
      role: "img",
      "aria-label": "Bar chart of monthly Yosemite visitation in 2026. January through April are actual preliminary figures, peaking at 315,000 in April. May through December are projected, peaking at 665,000 in July. A reference line shows 2025 actuals running below the 2026 bars in nearly every month."
    }, React.createElement("defs", null, React.createElement("pattern", {
      id: "tfProjHatch",
      patternUnits: "userSpaceOnUse",
      width: "6",
      height: "6"
    }, React.createElement("path", {
      d: "M0 6 L6 0",
      stroke: "var(--moss)",
      strokeWidth: "1.1"
    }))), [0, 175, 350, 525, 700].map(v => React.createElement("g", {
      key: v
    }, React.createElement("line", {
      x1: L,
      x2: W - R,
      y1: y(v),
      y2: y(v),
      stroke: "var(--rule-soft)",
      strokeWidth: "1"
    }), React.createElement("text", {
      x: L - 6,
      y: y(v) + 4,
      textAnchor: "end",
      style: AXIS
    }, v === 0 ? "0" : v + "k"))), Y2026.map((v, i) => React.createElement("rect", {
      key: i,
      x: x(i) - barW / 2,
      y: y(v),
      width: barW,
      height: T + plotH - y(v),
      fill: i < 4 ? "var(--moss)" : "url(#tfProjHatch)",
      stroke: "var(--moss)",
      strokeWidth: i < 4 ? 0 : 1.3
    })), React.createElement("polyline", {
      points: line2025,
      fill: "none",
      stroke: "var(--ink)",
      strokeWidth: "1.8"
    }), Y2025.map((v, i) => React.createElement("circle", {
      key: i,
      cx: x(i),
      cy: y(v),
      r: "2.6",
      fill: "var(--ink)"
    })), MONTHS.map((m, i) => React.createElement("text", {
      key: m,
      x: x(i),
      y: H - 8,
      textAnchor: "middle",
      style: AXIS
    }, m[0])), React.createElement("g", null, React.createElement("rect", {
      x: L,
      y: 10,
      width: 13,
      height: 13,
      fill: "var(--moss)"
    }), React.createElement("text", {
      x: L + 19,
      y: 21,
      style: LEGEND
    }, "2026 actual"), React.createElement("rect", {
      x: L + 118,
      y: 10,
      width: 13,
      height: 13,
      fill: "url(#tfProjHatch)",
      stroke: "var(--moss)",
      strokeWidth: "1.3"
    }), React.createElement("text", {
      x: L + 137,
      y: 21,
      style: LEGEND
    }, "2026 projected"), React.createElement("line", {
      x1: L + 268,
      x2: L + 296,
      y1: 16.5,
      y2: 16.5,
      stroke: "var(--ink)",
      strokeWidth: "1.8"
    }), React.createElement("circle", {
      cx: L + 282,
      cy: 16.5,
      r: "2.6",
      fill: "var(--ink)"
    }), React.createElement("text", {
      x: L + 302,
      y: 21,
      style: LEGEND
    }, "2025 actual")));
  }
  function ThreeYearChart() {
    var W = 680,
      H = 350,
      L = 44,
      R = 10,
      T = 34,
      B = 26;
    var plotW = W - L - R,
      plotH = H - T - B,
      MAX = 700;
    var x = i => L + i / 11 * plotW;
    var y = v => T + plotH - v / MAX * plotH;
    var pts = (arr, from, to) => arr.slice(from, to + 1).map((v, j) => `${x(from + j)},${y(v)}`).join(" ");
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: svgStyle,
      role: "img",
      "aria-label": "Line chart comparing monthly Yosemite visitation in 2024, 2025, and 2026. The 2024 line, a full reservation year, tops out near 597,000 in July. The 2025 line, a scaled-back reservation year, reaches 628,000. The 2026 line runs highest, with a projected July of about 665,000."
    }, [0, 175, 350, 525, 700].map(v => React.createElement("g", {
      key: v
    }, React.createElement("line", {
      x1: L,
      x2: W - R,
      y1: y(v),
      y2: y(v),
      stroke: "var(--rule-soft)",
      strokeWidth: "1"
    }), React.createElement("text", {
      x: L - 6,
      y: y(v) + 4,
      textAnchor: "end",
      style: AXIS
    }, v === 0 ? "0" : v + "k"))), React.createElement("polyline", {
      points: pts(Y2024, 0, 11),
      fill: "none",
      stroke: "var(--gold)",
      strokeWidth: "1.8"
    }), React.createElement("polyline", {
      points: pts(Y2025, 0, 11),
      fill: "none",
      stroke: "var(--ink-3)",
      strokeWidth: "1.8"
    }), React.createElement("polyline", {
      points: pts(Y2026, 0, 4),
      fill: "none",
      stroke: "var(--moss)",
      strokeWidth: "2.6"
    }), React.createElement("polyline", {
      points: pts(Y2026, 4, 11),
      fill: "none",
      stroke: "var(--moss)",
      strokeWidth: "2.6",
      strokeDasharray: "7 5"
    }), React.createElement("circle", {
      cx: x(2),
      cy: y(Y2026[2]),
      r: "3.4",
      fill: "var(--moss)"
    }), React.createElement("text", {
      x: x(2) + 8,
      y: y(Y2026[2]) - 8,
      style: {
        ...LEGEND,
        fill: "var(--moss)",
        fontWeight: 600
      }
    }, "Mar: +45%"), MONTHS.map((m, i) => React.createElement("text", {
      key: m,
      x: x(i),
      y: H - 8,
      textAnchor: "middle",
      style: AXIS
    }, m[0])), React.createElement("g", null, React.createElement("line", {
      x1: L,
      x2: L + 26,
      y1: 16.5,
      y2: 16.5,
      stroke: "var(--gold)",
      strokeWidth: "1.8"
    }), React.createElement("text", {
      x: L + 32,
      y: 21,
      style: LEGEND
    }, "2024 (full reservations)"), React.createElement("line", {
      x1: L + 210,
      x2: L + 236,
      y1: 16.5,
      y2: 16.5,
      stroke: "var(--ink-3)",
      strokeWidth: "1.8"
    }), React.createElement("text", {
      x: L + 242,
      y: 21,
      style: LEGEND
    }, "2025 (scaled back)"), React.createElement("line", {
      x1: L + 400,
      x2: L + 426,
      y1: 16.5,
      y2: 16.5,
      stroke: "var(--moss)",
      strokeWidth: "2.6"
    }), React.createElement("text", {
      x: L + 432,
      y: 21,
      style: LEGEND
    }, "2026 (none)")));
  }
  function CrowdCalendar() {
    var headStyle = {
      fontFamily: "var(--sans)",
      fontSize: 12,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--ink-3)",
      paddingBottom: 4
    };
    var monthStyle = {
      ...headStyle,
      paddingBottom: 0,
      alignSelf: "center",
      textAlign: "right",
      paddingRight: 8,
      whiteSpace: "nowrap"
    };
    var bar = v => React.createElement("div", {
      style: {
        position: "relative",
        background: "var(--paper-2)",
        height: 24
      }
    }, React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: v + "%",
        background: "var(--moss)"
      }
    }), React.createElement("span", {
      style: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "var(--mono)",
        fontSize: 12,
        lineHeight: 1,
        ...(v >= 20 ? {
          right: 100 - v + "%",
          paddingRight: 5,
          color: "var(--paper)"
        } : {
          left: v + "%",
          paddingLeft: 5,
          color: "var(--ink)"
        })
      }
    }, v));
    return React.createElement("div", {
      role: "img",
      "aria-label": "Crowd calendar for 2026, one row per month with weekday and weekend bars. Crowd pressure on a 0 to 100 scale, where 100 is a projected July weekend. Weekends run roughly 45 percent above weekdays all year. June and July weekends score 100, September weekends 85, October weekends 68, and January weekdays 16. Markers flag holiday spikes in February, May, July, September, November, and December."
    }, React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "auto 1fr 1fr",
        gap: "3px 6px"
      }
    }, React.createElement("div", {
      style: headStyle
    }), React.createElement("div", {
      style: headStyle
    }, "Weekday"), React.createElement("div", {
      style: headStyle
    }, "Weekend"), CROWD.map((c, i) => React.createElement(React.Fragment, {
      key: MONTHS[i]
    }, React.createElement("div", {
      style: monthStyle
    }, MONTHS[i], c.note ? React.createElement("span", {
      style: {
        color: "var(--rust)"
      }
    }, " ▲") : null), bar(c.wd), bar(c.we)))), React.createElement("div", {
      style: {
        fontFamily: "var(--sans)",
        fontSize: 12,
        color: "var(--ink-3)",
        marginTop: 8,
        lineHeight: 1.45
      }
    }, "Crowd pressure, 0 to 100. 100 = a projected July 2026 weekend day. ▲ marks a holiday spike above the bar's value: firefall weekends in February, Memorial Day in May, July 4, Labor Day in September, Thanksgiving week in November, and the holiday week in December."));
  }
  function HourlyChart() {
    var W = 680,
      H = 320,
      L = 40,
      R = 10,
      T = 30,
      B = 28;
    var plotW = W - L - R,
      plotH = H - T - B;
    var x = i => L + i / (HOURLY.length - 1) * plotW;
    var y = v => T + plotH - v / 100 * plotH;
    var line = HOURLY.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    var area = `${L},${T + plotH} ${line} ${W - R},${T + plotH}`;
    var bandStyle = {
      fontFamily: "var(--sans)",
      fontSize: 13,
      fill: "var(--ink-2)",
      fontWeight: 600
    };
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: svgStyle,
      role: "img",
      "aria-label": "Curve of inbound vehicle volume by hour on a busy summer day. Volume climbs steeply from 7 a.m., peaks between 9 a.m. and 2 p.m., and falls off through the evening. Shaded windows mark the quiet periods before 8 a.m. and after 4 p.m."
    }, React.createElement("rect", {
      x: x(0),
      y: T,
      width: x(3) - x(0),
      height: plotH,
      fill: "var(--gold)",
      opacity: "0.14"
    }), React.createElement("rect", {
      x: x(11),
      y: T,
      width: x(15) - x(11),
      height: plotH,
      fill: "var(--gold)",
      opacity: "0.14"
    }), React.createElement("polygon", {
      points: area,
      fill: "var(--moss)",
      opacity: "0.14"
    }), React.createElement("polyline", {
      points: line,
      fill: "none",
      stroke: "var(--moss)",
      strokeWidth: "2.4"
    }), React.createElement("line", {
      x1: L,
      x2: W - R,
      y1: T + plotH,
      y2: T + plotH,
      stroke: "var(--rule)",
      strokeWidth: "1"
    }), React.createElement("line", {
      x1: x(4),
      x2: x(9),
      y1: T + 12,
      y2: T + 12,
      stroke: "var(--ink-3)",
      strokeWidth: "1"
    }), React.createElement("line", {
      x1: x(4),
      x2: x(4),
      y1: T + 8,
      y2: T + 16,
      stroke: "var(--ink-3)",
      strokeWidth: "1"
    }), React.createElement("line", {
      x1: x(9),
      x2: x(9),
      y1: T + 8,
      y2: T + 16,
      stroke: "var(--ink-3)",
      strokeWidth: "1"
    }), React.createElement("text", {
      x: (x(4) + x(9)) / 2,
      y: T + 30,
      textAnchor: "middle",
      style: {
        ...AXIS,
        fontSize: 13.5
      }
    }, "busiest entry, 9a to 2p"), React.createElement("text", {
      x: (x(0) + x(3)) / 2,
      y: T + plotH - 12,
      textAnchor: "middle",
      style: bandStyle
    }, "in before 8"), React.createElement("text", {
      x: (x(11) + x(15)) / 2,
      y: T + plotH - 12,
      textAnchor: "middle",
      style: bandStyle
    }, "after 4"), HOUR_LABELS.map((h, i) => i % 2 === 0 ? React.createElement("text", {
      key: h,
      x: x(i),
      y: H - 8,
      textAnchor: "middle",
      style: AXIS
    }, h) : null));
  }
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "dropcap"
  }, "In March, 225,817 people visited Yosemite. That is 45 percent more than the March before it and the busiest March this park has seen since 2016. Nobody who lives here was surprised. The National Park Service announced in late December that the entrance reservation system would not return in 2026, and the visiting public heard it as an open gate. Through April, the park has logged 836,458 visits against 739,313 over the same months last year. Then Memorial Day arrived and gave us the preview: 90-minute entrance lines, the Curry Village lot full by 8:30 in the morning, cars parked on the meadow edges because there was nowhere else to put them."), React.createElement("p", null, "I made ", React.createElement("a", {
    href: "/articles/yosemite-needs-a-reservation-system"
  }, "my argument about whether this was a good idea"), " after that weekend. This piece is not that argument. This is the practical question that lands in my inbox every week now: with no reservation system and visitation climbing, when should you actually come?"), React.createElement("p", null, "To answer it properly I went through the National Park Service's visitor use statistics: monthly visitation for the past decade, the year-to-date numbers for 2026, and the gate-by-gate traffic reporting the park publishes in its press releases. Then I built a month-by-month forecast for the rest of 2026. The numbers, the method, and the charts are all below, and so are the specific days I would pick."), React.createElement("h2", null, "The throttle is gone"), React.createElement("p", null, "Some history, because the data makes no sense without it. Yosemite has spent six years running an accidental experiment in demand management:"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "2020:"), " Covid day-use limits. Visitation collapsed to 2.3 million."), React.createElement("li", null, React.createElement("strong", null, "2021:"), " Day-use reservations all summer. 3.3 million."), React.createElement("li", null, React.createElement("strong", null, "2022:"), " Peak-hours reservations, late May through September. 3.7 million."), React.createElement("li", null, React.createElement("strong", null, "2023:"), " No reservations at all, a record Sierra snowpack notwithstanding. 3.9 million."), React.createElement("li", null, React.createElement("strong", null, "2024:"), " The broadest system yet: reservations 5 a.m. to 4 p.m. on at least some days from mid-April through late October. 4.12 million."), React.createElement("li", null, React.createElement("strong", null, "2025:"), " A scaled-back version, 6 a.m. to 2 p.m. from June 15 through August 15 plus the Memorial Day and Labor Day weekends. 4.28 million, the fourth-busiest year ever recorded here."), React.createElement("li", null, React.createElement("strong", null, "2026:"), " Nothing. No reservation for the gates, and for the first time in years, none for the Horsetail Fall firefall crowds in February either.")), React.createElement("p", null, "Notice the direction of that visitation column. Even with throttles in place, demand has climbed every single year since 2020. The reservation systems never reduced the desire to be here. They moved it, spread it, and metered it. What 2026 removes is the metering, in a year when the underlying demand is the highest it has been since the 2016 record of just over 5 million visits."), React.createElement("h2", null, "What 2026 looks like so far"), React.createElement("p", null, "Here is the year so far, with my projection for the months ahead, plotted against what 2025 actually did."), React.createElement("figure", null, React.createElement(ForecastChart, null), React.createElement("figcaption", null, "Yosemite monthly recreation visits, 2026 actual and projected, in thousands. The line is 2025. ", SOURCE_NOTE)), React.createElement("p", null, "The year-to-date math is simple and striking. Through April, 2026 is running 13 percent ahead of 2025. The growth is not evenly spread. January and February ran modestly ahead of last year. March, the first full month after the no-reservation announcement made national news, exploded: up 45 percent, although that comparison flatters 2026 a little because storms held down March 2025. April landed in line with a strong 2025 April. The lesson of the spring is that headlines move visitation, and the headline this year is that Yosemite is open, no ticket required."), React.createElement("p", null, "My projection for the rest of the year puts 2026 at roughly 4.6 to 4.7 million total visits. If that holds, 2026 becomes the second-busiest year in the park's recorded history, behind only 2016 and ahead of 2019 and 2017. July alone projects to about 665,000 visits, which would be the biggest single month here in nearly a decade."), React.createElement("h2", null, "What the reservation years actually did"), React.createElement("p", null, "To see why I expect summer to set near-records, look at what the throttles did to the shape of the last two summers."), React.createElement("figure", null, React.createElement(ThreeYearChart, null), React.createElement("figcaption", null, "Monthly recreation visits in thousands: 2024 under the broadest reservation system, 2025 under the scaled-back one, 2026 with none. The 2026 dashed segment is projected. ", SOURCE_NOTE)), React.createElement("p", null, "In 2024, with reservations covering 5 a.m. to 4 p.m. across most of the season, July topped out at 596,711. In 2025, with the requirement trimmed to 6 a.m. to 2 p.m. and only eight weeks of coverage, July rose to 628,400 and June to 607,410. Every loosening of the valve has produced more volume, immediately. The park's own August 2025 reporting showed the surge arriving on every road: visitation through the Highway 140 gate at El Portal and the Highway 41 gate at Wawona up about 8 percent year over year, and up more than 10 percent on Highway 120 from the west."), React.createElement("p", null, "2026 removes the valve entirely in a year that was already pacing at record demand. That is the basis of the dashed line above, and it is why the people who study this park's traffic were not surprised by Memorial Day weekend. The only force left to cap a July Saturday is the road network itself: when the Valley loop saturates, the line simply backs up outside the gates, which is exactly what the two-to-three-hour afternoon delays the park now warns about look like in practice."), React.createElement("h2", null, "How I built the forecast"), React.createElement("p", null, "The method is deliberately simple, and I would rather show it to you than hide it. I took 2025's monthly actuals as the base. For each remaining month of 2026, I applied a growth rate anchored to what 2026 has already demonstrated: the 13 percent year-to-date pace, damped hard in June, July, and August. The damping matters. March can absorb a 45 percent jump because March has empty road. July cannot, because July was already operating near the ceiling of what the park's entrances, lots, and Valley loop can physically process in a day. For the peak months I assumed 6 to 7 percent growth, which is roughly what the system demonstrated it could swallow when the 2025 restrictions came off in mid-August. Shoulder months got 10 to 15 percent, because that is where the headroom is and where displaced summer visitors tend to land."), React.createElement("p", null, "Honest caveats: the 2026 figures are preliminary and the Park Service revises them. A bad smoke season can erase an August. A government shutdown, a Merced River flood, a midsummer policy reversal would all bend the curve. This is a forecast built on five months of data, not a promise. But the direction is not in doubt, and the direction is up."), React.createElement("h2", null, "The crowd calendar"), React.createElement("p", null, "The forecast turns into a usable plan when you break it into days. The grid below is my crowd-pressure index for 2026: projected visits per day, split by weekday and weekend, scaled so that 100 equals a peak July weekend."), React.createElement("figure", null, React.createElement(CrowdCalendar, null), React.createElement("figcaption", null, "Crowd pressure by month and day type, 2026. Index derived from actual and projected monthly visitation; weekend days in Yosemite run roughly 45 percent busier than weekdays. ", SOURCE_NOTE)), React.createElement("p", null, "Read it month by month, with the second half of the year in mind:"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "June:"), " Peak season arrived early this year. ", React.createElement("a", {
    href: "/articles/yosemite-in-june-2026"
  }, "Low snowpack pushed the waterfall peak into May"), ", so the falls are already past their best while the crowds are at theirs. A June weekday scores 68; a weekend, 100. Come midweek or not at all."), React.createElement("li", null, React.createElement("strong", null, "July:"), " The projected biggest month in a decade, and July 4 lands on a Saturday, the single worst arrival day of 2026. The week after the holiday, midweek, is merely very busy rather than impossible."), React.createElement("li", null, React.createElement("strong", null, "August:"), " Slightly softer than July, with two asterisks: smoke season is real here in late August, and the falls will be near dry."), React.createElement("li", null, React.createElement("strong", null, "September:"), " The split month. Labor Day weekend (September 5 to 7) behaves like July. The Tuesday after it is a different park: summer weather, open high country, and weekday pressure that drops by a third."), React.createElement("li", null, React.createElement("strong", null, "October:"), " The sleeper, and my answer when people ask for the best remaining window of 2026. Weekday pressure falls to 46, Tioga Road usually stays open most of the month, and the light gets good."), React.createElement("li", null, React.createElement("strong", null, "November:"), " Quiet except for Thanksgiving week, which fills lodging months out. A weekday score of 28 means empty trails by summer standards."), React.createElement("li", null, React.createElement("strong", null, "December through February:"), " The quietest quarter, with two spikes: the holiday week, and the firefall window in mid-to-late February, which now runs without reservations and concentrates thousands of photographers on Northside Drive at sunset."), React.createElement("li", null, React.createElement("strong", null, "March through May (for 2027 planners):"), " Spring is the value play, waterfalls at full volume against half-of-summer crowds, but this year proved spring is where the new growth lands first. Expect next March to look like this year's April.")), React.createElement("h2", null, "The clock beats the calendar"), React.createElement("p", null, "Here is the part the monthly numbers hide: the difference between a miserable Yosemite day and a great one is mostly the hour you reach the gate. The park's traffic guidance is blunt about the shape of the day, and it matches what I see on Highway 140 every morning."), React.createElement("figure", null, React.createElement(HourlyChart, null), React.createElement("figcaption", null, "Relative inbound vehicle volume by hour on a busy summer day, stylized from NPS traffic guidance. The busiest entry window runs roughly 9 a.m. to 2 p.m.; afternoon delays can reach two to three hours on peak weekends. ", SOURCE_NOTE)), React.createElement("p", null, "It is no accident that every reservation system this park has run gated the same hours. The 2024 system covered 5 a.m. to 4 p.m.; 2025 covered 6 a.m. to 2 p.m. The Park Service has effectively published its own definition of when Yosemite is over capacity, twice. With no system in 2026, you enforce it on yourself:"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "Be through the gate before 8 a.m."), " Before 7 is better on summer weekends. Lots in the Valley fill by mid-morning; on Memorial Day weekend the Curry Village lot was full at 8:30 a.m."), React.createElement("li", null, React.createElement("strong", null, "Or arrive after 4 p.m."), " Summer light lasts past 8. An evening Valley visit with dinner outside the park beats a noon arrival in every measurable way."), React.createElement("li", null, React.createElement("strong", null, "Never plan to arrive between 9 a.m. and 2 p.m. on a summer weekend."), " That is the window where the two-to-three-hour entrance delays live."), React.createElement("li", null, React.createElement("strong", null, "Once parked, stay parked."), " Use the shuttles and bikes; a parking spot in the Valley on a July Saturday is not a thing to gamble twice."), React.createElement("li", null, React.createElement("strong", null, "Text ", React.createElement("em", null, "ynptraffic"), " to 333111"), " for the park's live parking and traffic updates, and check road and lot status before you commit to the drive.")), React.createElement("h2", null, "The days I would pick"), React.createElement("p", null, "If I were planning a 2026 trip from outside the area, in order of preference:"), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "Tuesday through Thursday, September 8 to 30."), " The best all-around window left this year. Summer conditions, the full park open, crowd pressure down a third from July, and the falls do not matter because you came for granite and high country."), React.createElement("li", null, React.createElement("strong", null, "Midweek in October."), " Nearly as good, cooler, quieter, with fall color in the Valley by the back half of the month. Watch for the first Tioga-closing storm, usually November but occasionally late October."), React.createElement("li", null, React.createElement("strong", null, "Midweek in early November, before Thanksgiving."), " The Valley to yourself at the price of short days."), React.createElement("li", null, React.createElement("strong", null, "Summer, if summer is what you have:"), " any Tuesday or Wednesday, through the gate before 7:30 a.m. A well-executed July weekday beats a badly executed September Saturday. My ", React.createElement("a", {
    href: "/articles/yosemite-without-reservations-2026"
  }, "no-reservations strategy piece"), " covers the full playbook, and if it is your first visit, ", React.createElement("a", {
    href: "/articles/first-time-yosemite-overwhelm"
  }, "start here instead"), "."), React.createElement("li", null, React.createElement("strong", null, "The days to avoid entirely:"), " July 3 to 5, every summer Saturday arriving after 8:30 a.m., Labor Day weekend, and the holiday week in December if you are not staying in the park.")), React.createElement("h2", null, "What could bend the curve"), React.createElement("p", null, "Forecasts age badly in public, so let me say what would change this one. If the early-season chaos keeps producing national coverage, some fraction of casual visitors will self-select out and the summer numbers come in under my line. If smoke closes the air in August, that month craters. And if the gridlock gets bad enough, the park retains the authority to manage entries again; the Park Service has said it will manage 2026 with staffed intersections, parking management, and real-time traffic monitoring instead, but that toolkit has limits a busy Saturday will find quickly."), React.createElement("p", null, "None of that changes the planning logic. Demand for this park rises every year the gate is open, the gate is wide open in 2026, and the only variables you control are the month, the day, and the hour. Choose all three on purpose. The park at 6:45 on a September morning is still the same park that made the record books, minus the line to get in."));
};
