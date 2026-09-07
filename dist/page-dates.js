var {
  useState: useStateD,
  useMemo: useMemoD
} = React;
var MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var DAY_MS = 86400000;
function parseIso(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  if (!m) return null;
  var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return isNaN(d.getTime()) ? null : d;
}
function isoOf(d) {
  return d.toISOString().slice(0, 10);
}
function addDays(d, n) {
  return new Date(d.getTime() + n * DAY_MS);
}
function longDate(d) {
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
function shortDate(d) {
  return `${MONTH_NAMES[d.getUTCMonth()].slice(0, 3)} ${d.getUTCDate()}`;
}
function cablesSeason(year) {
  var d = new Date(Date.UTC(year, 4, 31));
  while (d.getUTCDay() !== 1) d = addDays(d, -1);
  var up = addDays(d, -3);
  var oct = new Date(Date.UTC(year, 9, 1));
  while (oct.getUTCDay() !== 1) oct = addDays(oct, 1);
  var down = addDays(addDays(oct, 7), 1);
  return {
    up,
    down
  };
}
function releaseDateFor(arrival, monthsAhead) {
  var y = arrival.getUTCFullYear();
  var m = arrival.getUTCMonth();
  if (arrival.getUTCDate() < 15) m -= 1;
  m -= monthsAhead;
  while (m < 0) {
    m += 12;
    y -= 1;
  }
  return new Date(Date.UTC(y, m, 15));
}
function resolveRelative(items, start, end) {
  var out = [];
  var days = [];
  for (var d = start; d <= end && days.length < 31; d = addDays(d, 1)) days.push(d);
  items.forEach(it => {
    if (it.kind === "relative") {
      var targets = it.tag === "date-halfdome" ? days : [start];
      targets.forEach(t => {
        out.push({
          item: it,
          date: addDays(t, it.offsetDays),
          forDate: t
        });
      });
    } else if (it.kind === "release-15th") {
      out.push({
        item: it,
        date: releaseDateFor(start, it.monthsAhead),
        forDate: start
      });
    }
  });
  out.sort((a, b) => a.date - b.date);
  return out;
}
function icsFor(instances, verified) {
  var esc = s => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  var ymd = d => isoOf(d).replace(/-/g, "");
  var stamp = `${verified.replace(/-/g, "")}T000000Z`;
  var ev = instances.map(({
    item,
    date,
    forDate
  }) => ["BEGIN:VEVENT", `UID:${item.id}-${isoOf(forDate)}@dates.thetalusfieldjournal.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${ymd(date)}`, `DTEND;VALUE=DATE:${ymd(addDays(date, 1))}`, `SUMMARY:${esc(`Yosemite: ${item.title} (${item.time})`)}`, `DESCRIPTION:${esc(`${item.detail} For your ${longDate(forDate)} date. Source: ${item.source}. Verified ${verified}. The Talus Field, https://thetalusfieldjournal.com/dates`)}`, "URL:https://thetalusfieldjournal.com/dates", "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(`Yosemite: ${item.title}`)}`, "TRIGGER:-P1D", "END:VALARM", "END:VEVENT"].join("\r\n"));
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//The Talus Field//Yosemite Dates//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Yosemite dates for your trip", ...ev, "END:VCALENDAR", ""].join("\r\n");
}
function downloadText(filename, text) {
  var blob = new Blob([text], {
    type: "text/calendar;charset=utf-8"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
  if (window.track) window.track("dates_ics_download", {
    file: filename
  });
}
function fixedWindow(it, ruleYears) {
  if (it.kind === "annual") {
    var s = `${MONTH_NAMES[it.start.month - 1]} ${it.start.day}`;
    var e = `${MONTH_NAMES[it.end.month - 1]} ${it.end.day}`;
    return s === e ? s : `${s} to ${e}`;
  }
  if (it.kind === "rule") {
    return ruleYears.map(y => {
      var c = cablesSeason(y);
      return `${shortDate(c.up)} to ${shortDate(c.down)}, ${y}`;
    }).join("; ");
  }
  if (it.kind === "season") {
    var _s = parseIso(it.start);
    var _e = parseIso(it.end);
    return isoOf(_s) === isoOf(_e) ? longDate(_s) : `${longDate(_s)} to ${longDate(_e)}`;
  }
  return "";
}
var TAG_LABELS = {
  "date-halfdome": "Half Dome",
  "date-wilderness": "Wilderness permits",
  "date-camping": "Campgrounds",
  "date-roads": "Roads and seasons"
};
function DatesPage({
  go
}) {
  var table = window.DEADLINES || {
    items: [],
    verified: "",
    ruleYears: []
  };
  var items = table.items || [];
  var fixed = items.filter(it => it.kind === "annual" || it.kind === "rule" || it.kind === "season");
  var relative = items.filter(it => it.kind === "relative" || it.kind === "release-15th");
  var [startStr, setStartStr] = useStateD("");
  var [endStr, setEndStr] = useStateD("");
  var [interest, setInterest] = useStateD("date-halfdome");
  var start = parseIso(startStr);
  var end = parseIso(endStr) || start;
  var tripOk = start && end && end >= start && (end - start) / DAY_MS <= 30;
  var instances = useMemoD(() => tripOk ? resolveRelative(relative, start, end) : [], [tripOk, startStr, endStr, relative.length]);
  var today = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  var goRoute = (e, r) => {
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
      label: "Dates that matter"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Deadlines"), React.createElement("h1", null, "The Yosemite dates that matter"), React.createElement("p", {
    className: "page-head__dek"
  }, "The lotteries, the release mornings, and the road windows that decide a trip, in one table, each one a calendar file. Enter your dates and the ones measured from your trip resolve to real days."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "Measured from your trip"), React.createElement("p", null, "Most of what has to happen before a Yosemite trip is measured backwards from the day you arrive: a Half Dome day permit two days before, a wilderness permit twenty-four weeks before, a Pines campsite five months before. Put in your first and last day in the park and the table below turns those rules into dates."), React.createElement("div", {
    className: "dates__form",
    role: "group",
    "aria-label": "Your trip dates"
  }, React.createElement("label", null, React.createElement("span", null, "First day in the park"), React.createElement("input", {
    type: "date",
    value: startStr,
    onChange: e => setStartStr(e.target.value)
  })), React.createElement("label", null, React.createElement("span", null, "Last day"), React.createElement("input", {
    type: "date",
    value: endStr,
    min: startStr || undefined,
    onChange: e => setEndStr(e.target.value)
  })), tripOk && instances.length > 0 && React.createElement("button", {
    type: "button",
    className: "dates__btn",
    onClick: () => downloadText(`yosemite-dates-${isoOf(start)}.ics`, icsFor(instances, table.verified))
  }, "Add all ", instances.length, " to my calendar")), startStr && !tripOk && React.createElement("p", {
    className: "dates__hint"
  }, "Enter a first day, and a last day no more than a month after it."), tripOk && React.createElement("table", {
    className: "dates__table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Act by"), React.createElement("th", null, "What"), React.createElement("th", null, "For"), React.createElement("th", null))), React.createElement("tbody", null, instances.map(({
    item,
    date,
    forDate
  }, i) => {
    var past = date < today;
    return React.createElement("tr", {
      key: `${item.id}-${isoOf(forDate)}`,
      className: past ? "dates__row--past" : ""
    }, React.createElement("td", null, React.createElement("strong", null, longDate(date)), React.createElement("br", null), React.createElement("span", {
      className: "dates__time"
    }, item.time), past && React.createElement("span", {
      className: "dates__time"
    }, " · passed")), React.createElement("td", null, React.createElement("strong", null, item.title), React.createElement("p", null, item.detail, " ", React.createElement("a", {
      href: item.source,
      target: "_blank",
      rel: "noopener noreferrer"
    }, "NPS ↗"))), React.createElement("td", null, item.tag === "date-halfdome" && instances.filter(x => x.item.id === item.id).length > 1 ? `climbing ${shortDate(forDate)}` : `arriving ${shortDate(forDate)}`), React.createElement("td", null, React.createElement("button", {
      type: "button",
      className: "dates__btn dates__btn--small",
      onClick: () => downloadText(`yosemite-${item.id}-${isoOf(forDate)}.ics`, icsFor([{
        item,
        date,
        forDate
      }], table.verified)),
      "aria-label": `Add ${item.title} to calendar`
    }, "+ Calendar")));
  }))), !tripOk && React.createElement("ul", null, relative.map(it => React.createElement("li", {
    key: it.id
  }, React.createElement("strong", null, it.title, ":"), " ", it.kind === "relative" ? `${Math.abs(it.offsetDays) === 168 ? "24 weeks" : Math.abs(it.offsetDays) + " days"} before, ${it.time}.` : `the 15th of the month, ${it.monthsAhead} months ahead, ${it.time}.`, " ", it.detail, " ", React.createElement("a", {
    href: it.source,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "NPS ↗")))), React.createElement("h2", null, "Fixed windows"), React.createElement("p", null, "These do not move with your trip. The published ones are policy; the typical ones are what the park has done in recent years and does not promise, so the calendar entry covers the whole range and the park's own announcement settles the day."), React.createElement("table", {
    className: "dates__table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "When"), React.createElement("th", null, "What"), React.createElement("th", null))), React.createElement("tbody", null, fixed.map(it => React.createElement("tr", {
    key: it.id
  }, React.createElement("td", null, React.createElement("strong", null, fixedWindow(it, table.ruleYears || [])), React.createElement("br", null), React.createElement("span", {
    className: "dates__time"
  }, it.time), it.confidence === "typical" && React.createElement("span", {
    className: "dates__time"
  }, " · typical, not published")), React.createElement("td", null, React.createElement("strong", null, it.title), React.createElement("p", null, it.detail, " ", React.createElement("a", {
    href: it.source,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "NPS ↗"))), React.createElement("td", null, React.createElement("a", {
    className: "dates__btn dates__btn--small",
    href: `/ics/${it.id}.ics`,
    download: true,
    onClick: () => {
      if (window.track) window.track("dates_ics_download", {
        file: `${it.id}.ics`
      });
    }
  }, "+ Calendar")))))), React.createElement("p", null, React.createElement("a", {
    className: "dates__btn",
    href: "/ics/yosemite-dates.ics",
    download: true,
    onClick: () => {
      if (window.track) window.track("dates_ics_download", {
        file: "yosemite-dates.ics"
      });
    }
  }, "Add every fixed window to my calendar")), React.createElement("p", {
    className: "dates__hint"
  }, "Verified against the National Park Service pages linked above on ", table.verified, ". Each entry carries its source and that date. If a rule on this page disagrees with nps.gov, nps.gov is right and this page is behind; the", " ", React.createElement("a", {
    href: "/contact",
    onClick: e => goRoute(e, "contact")
  }, "contact page"), " reaches the editor."), React.createElement("h2", null, "What the dates mean"), React.createElement("p", null, "The Half Dome mechanics, the odds, and what to climb instead are on", " ", React.createElement("a", {
    href: "/half-dome-lottery",
    onClick: e => goRoute(e, "half-dome-lottery")
  }, "the Half Dome lottery page"), ". What you can still get holding no permit at all is in", " ", React.createElement("a", {
    href: "/articles/yosemite-walk-up-and-day-of-permits",
    onClick: e => goRoute(e, "a:yosemite-walk-up-and-day-of-permits")
  }, "the walk-up permits guide"), ", and the campground-by-campground picture is", " ", React.createElement("a", {
    href: "/articles/yosemite-camping-complete-guide",
    onClick: e => goRoute(e, "a:yosemite-camping-complete-guide")
  }, "the camping guide"), ". The road openings are watched from inside the park on", " ", React.createElement("a", {
    href: "/tioga-opening",
    onClick: e => goRoute(e, "tioga-opening")
  }, "the Tioga Road page"), ", and the Firefall on", " ", React.createElement("a", {
    href: "/firefall",
    onClick: e => goRoute(e, "firefall")
  }, "its own page"), ".")), React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "If release morning passes you by",
    note: "The Pines sites go in minutes on the 15th. A trip that misses the release still happens from a room in the gateway towns, and one availability search around the park shows what your dates still hold.",
    list: "page_dates",
    slug: "dates",
    cta: "Search lodging around Yosemite →"
  }), React.createElement(GuidePromo, {
    go: go,
    location: "dates",
    title: "In the Field Guide, these dates sit on your trip board",
    body: "Enter your trip once and the guide draws every deadline against it, reminds your phone the morning each one opens, and keeps working where the park has no signal. One purchase, eighteen months of access.",
    style: {
      marginTop: 56,
      marginBottom: 40
    }
  }), React.createElement("div", {
    className: "dates__interest"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Remind me"), React.createElement("p", {
    className: "dates__hint"
  }, "Pick what you are waiting on. The Sunday letter carries a dated nudge to the people who asked for that one, and nothing else."), React.createElement("div", {
    className: "dates__chips",
    role: "radiogroup",
    "aria-label": "What to remind you about"
  }, Object.keys(TAG_LABELS).map(t => React.createElement("button", {
    key: t,
    type: "button",
    role: "radio",
    "aria-checked": interest === t,
    className: `dates__chip${interest === t ? " is-on" : ""}`,
    onClick: () => setInterest(t)
  }, TAG_LABELS[t])))), React.createElement(NewsletterInline, {
    key: interest,
    location: "dates",
    tag: interest,
    heading: `${TAG_LABELS[interest]}: the nudge before the date`,
    blurb: "A short letter on Sundays, and a dated line the week a window you asked about opens. Free."
  })));
}
window.DatesPage = DatesPage;
