var BULLETIN_URL = "/bulletin.json?v=16";
var BT_PARK_TZ = "America/Los_Angeles";
var BT_DAY_CODES = ["su", "mo", "tu", "we", "th", "fr", "sa"];
function btIsoValid(iso) {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return !Number.isNaN(new Date(iso + "T12:00:00Z").getTime());
}
function btIsoDate(iso) {
  return new Date(iso + "T12:00:00Z");
}
function btIsoAdd(iso, days) {
  var d = btIsoDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function btIsoDiff(a, b) {
  return Math.round((btIsoDate(a) - btIsoDate(b)) / 86400000);
}
function btDayCode(iso) {
  return BT_DAY_CODES[btIsoDate(iso).getUTCDay()];
}
function btParkToday() {
  try {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: BT_PARK_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    var get = type => parts.find(p => p.type === type).value;
    return `${get("year")}-${get("month")}-${get("day")}`;
  } catch (e) {
    var d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
}
function btFormat(iso, opts) {
  if (!btIsoValid(iso)) return iso || "";
  return btIsoDate(iso).toLocaleDateString("en-US", Object.assign({
    timeZone: "UTC"
  }, opts));
}
var bulletinDate = iso => btFormat(iso, {
  month: "long",
  day: "numeric",
  year: "numeric"
});
var btShortDate = iso => btFormat(iso, {
  month: "short",
  day: "numeric"
});
var btDayDate = iso => btFormat(iso, {
  weekday: "short",
  month: "short",
  day: "numeric"
});
var btLongDay = iso => btFormat(iso, {
  weekday: "long",
  month: "long",
  day: "numeric"
});
var btWeekday = iso => btFormat(iso, {
  weekday: "long"
});
function btEditionProgress(edition, today) {
  if (!btIsoValid(edition.start) || !btIsoValid(edition.end)) return null;
  var day = btIsoDiff(today, edition.start) + 1;
  var total = btIsoDiff(edition.end, edition.start) + 1;
  if (day < 1 || day > total) return null;
  return {
    day,
    total
  };
}
function btEditionEnded(edition, today) {
  return btIsoValid(edition.end) && today > edition.end;
}
function btParseTime(s) {
  if (typeof s !== "string") return 1440;
  var t = s.trim().toLowerCase();
  if (t === "noon") return 720;
  var m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (!m) return 1440;
  return (Number(m[1]) % 12 + (m[3] === "pm" ? 12 : 0)) * 60 + (m[2] ? Number(m[2]) : 0);
}
function btRunsOn(p, iso) {
  if (!p) return false;
  if (Array.isArray(p.except) && p.except.indexOf(iso) >= 0) return false;
  if (Array.isArray(p.dates)) return p.dates.indexOf(iso) >= 0;
  if (p.from && iso < p.from) return false;
  if (p.until && iso > p.until) return false;
  if (p.days === "daily") return true;
  return Array.isArray(p.days) && p.days.indexOf(btDayCode(iso)) >= 0;
}
function btScheduleDays(edition, today) {
  if (!btIsoValid(edition.start) || !btIsoValid(edition.end) || edition.start > edition.end) return [today];
  var first = today;
  if (today < edition.start) first = edition.start;
  if (today > edition.end) first = btIsoAdd(edition.end, -6) < edition.start ? edition.start : btIsoAdd(edition.end, -6);
  var out = [];
  for (var i = 0; i < 7; i++) {
    var iso = btIsoAdd(first, i);
    if (iso > edition.end) break;
    out.push(iso);
  }
  return out;
}
var BT_DAY_PARTS = [{
  name: "Morning",
  range: "Before noon",
  from: 0,
  to: 720,
  empty: "Nothing listed this morning."
}, {
  name: "Afternoon",
  range: "Noon to 5 pm",
  from: 720,
  to: 1020,
  empty: "Nothing listed this afternoon."
}, {
  name: "Evening",
  range: "5 pm on",
  from: 1020,
  to: 1441,
  empty: "Nothing listed this evening."
}];
function btProgramOn(p, iso, today) {
  var t = btParseTime(p.time);
  var detail = p.detailByDay && p.detailByDay[btDayCode(iso)] || p.detail || "";
  var tags = [];
  if (p.tag) tags.push(p.tag);
  if (Array.isArray(p.dates) && p.dates.length === 1) {
    var evening = t >= 1020 && t < 1440;
    tags.push(iso === today ? evening ? "Tonight only" : "Today only" : evening ? "One night only" : "One day only");
  } else if (p.until && p.until === iso && !Array.isArray(p.dates)) {
    tags.push("Last day");
  }
  return Object.assign({}, p, {
    t,
    detail,
    tags
  });
}
var BT_KIND_LABEL = {
  closes: "Closes",
  ends: "Ends",
  hours: "Hours",
  opens: "Opens",
  event: "Event"
};
var BT_COMING_SHOWN = 6;
function btRelDay(diff) {
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  return "";
}
function btSplitChanges(changes, today) {
  var upcoming = [];
  var closed = [];
  var hours = [];
  var group = (list, key, label) => {
    var g = list.find(x => x.key === key);
    if (!g) {
      g = {
        key,
        label,
        items: []
      };
      list.push(g);
    }
    return g;
  };
  var dated = changes.map((c, i) => ({
    c,
    i
  })).filter(x => x.c && x.c.what && btIsoValid(x.c.date)).sort((a, b) => a.c.date < b.c.date ? -1 : a.c.date > b.c.date ? 1 : a.i - b.i).map(x => x.c);
  for (var c of dated) {
    if (c.date >= today) {
      upcoming.push(Object.assign({}, c, {
        label: c.when || btDayDate(c.date),
        rel: c.when ? "" : btRelDay(btIsoDiff(c.date, today))
      }));
    } else if (c.kind === "closes" || c.kind === "ends") {
      group(closed, c.when || c.date, c.when || btShortDate(c.date)).items.push(c);
    } else if (c.kind === "hours") {
      group(hours, c.date, btShortDate(c.date)).items.push(c);
    }
  }
  for (var _c of changes) {
    if (_c && _c.what && !_c.date && _c.when && (_c.kind === "closes" || _c.kind === "ends")) {
      group(closed, `w:${_c.when}`, _c.when).items.push(_c);
    }
  }
  return {
    upcoming,
    closed,
    hours
  };
}
function btHoursToday(it, today) {
  var note = it.note ? [it.note] : [];
  if (btIsoValid(it.closes) && today > it.closes) {
    return {
      hours: "Closed",
      note: [`closed after ${btShortDate(it.closes)}`].concat(note).join("; "),
      closed: true
    };
  }
  var hours = it.hours;
  if (it.then && btIsoValid(it.then.from)) {
    if (today >= it.then.from) {
      hours = it.then.hours;
      note.push(`since ${btShortDate(it.then.from)}`);
    } else {
      note.push(`${it.then.hours} from ${btShortDate(it.then.from)}`);
    }
  }
  if (btIsoValid(it.closes)) note.push(`last day ${btShortDate(it.closes)}`);
  return {
    hours,
    note: note.join("; "),
    closed: false
  };
}
var BULLETIN_ICONS = {
  dot: React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3",
    fill: "currentColor",
    stroke: "none"
  }),
  alert: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M12 3.4 21.2 20H2.8z"
  }), React.createElement("path", {
    d: "M12 9.8v4.6"
  }), React.createElement("circle", {
    cx: "12",
    cy: "17.3",
    r: "0.95",
    fill: "currentColor",
    stroke: "none"
  })),
  check: React.createElement("path", {
    d: "m4.6 12.4 5 5.2L19.6 6.6"
  }),
  chevron: React.createElement("path", {
    d: "m5.6 9.4 6.4 6.2 6.4-6.2"
  }),
  x: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "m6.4 6.4 11.2 11.2"
  }), React.createElement("path", {
    d: "M17.6 6.4 6.4 17.6"
  })),
  clock: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8.6"
  }), React.createElement("path", {
    d: "M12 6.6V12l3.7 2.3"
  })),
  calendar: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "3.2",
    y: "5",
    width: "17.6",
    height: "15.8",
    rx: "2.2"
  }), React.createElement("path", {
    d: "M3.2 10.2h17.6"
  }), React.createElement("path", {
    d: "M8 3v4.2M16 3v4.2"
  })),
  road: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M6.4 20.8 9.6 3.2"
  }), React.createElement("path", {
    d: "m17.6 20.8-3.2-17.6"
  }), React.createElement("path", {
    d: "M12 5.6v2.8M12 10.6v2.8M12 15.6v2.8"
  })),
  route: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M4 20.6h6.4a3.3 3.3 0 0 0 0-6.6H7.6a3.3 3.3 0 0 1 0-6.6h8.6"
  }), React.createElement("path", {
    d: "m12.9 4.4 3.1 3-3.1 3"
  })),
  valley: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M2.2 19.8 8.2 3.6l3.2 16.2"
  }), React.createElement("path", {
    d: "M21.8 19.8 15.8 5.2l-3.2 14.6"
  }), React.createElement("path", {
    d: "M2.2 19.8h19.6"
  })),
  mountain: React.createElement("path", {
    d: "M2.6 19.4 9 7.6l3.6 6.2 2.4-3.4 6.4 9z"
  }),
  tree: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M12 2.6 6.6 10.8h3.2L4.8 17.6h14.4l-5-6.8h3.2z"
  }), React.createElement("path", {
    d: "M12 17.6v3.8"
  })),
  water: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M2.6 8q3.1-2.8 6.2 0t6.2 0 6.2 0"
  }), React.createElement("path", {
    d: "M2.6 13q3.1-2.8 6.2 0t6.2 0 6.2 0"
  }), React.createElement("path", {
    d: "M2.6 18q3.1-2.8 6.2 0t6.2 0 6.2 0"
  })),
  fuel: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M4.4 20.8V5.4a2.2 2.2 0 0 1 2.2-2.2h5.2a2.2 2.2 0 0 1 2.2 2.2v15.4"
  }), React.createElement("path", {
    d: "M3 20.8h13.2"
  }), React.createElement("path", {
    d: "M6.8 6.8h5v3.8h-5z"
  }), React.createElement("path", {
    d: "M14 9.4h2.6a2 2 0 0 1 2 2v5.4a1.6 1.6 0 0 0 3.2 0V10l-2.4-2.6"
  })),
  pin: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M12 21.2s6.8-7.4 6.8-11.6a6.8 6.8 0 1 0-13.6 0c0 4.2 6.8 11.6 6.8 11.6z"
  }), React.createElement("circle", {
    cx: "12",
    cy: "9.4",
    r: "2.4"
  })),
  bus: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "3.2",
    y: "4",
    width: "17.6",
    height: "11.6",
    rx: "2.2"
  }), React.createElement("path", {
    d: "M3.2 10.4h17.6"
  }), React.createElement("path", {
    d: "M6.6 15.6v1.4M17.4 15.6v1.4"
  }), React.createElement("circle", {
    cx: "7.6",
    cy: "18.6",
    r: "1.9"
  }), React.createElement("circle", {
    cx: "16.4",
    cy: "18.6",
    r: "1.9"
  })),
  bike: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "5.8",
    cy: "16.6",
    r: "4.1"
  }), React.createElement("circle", {
    cx: "18.2",
    cy: "16.6",
    r: "4.1"
  }), React.createElement("path", {
    d: "M5.8 16.6 9.8 8.4h4.6l3.8 8.2"
  }), React.createElement("path", {
    d: "M8.6 8.4H12"
  })),
  plug: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M9 3.2v4.6M15 3.2v4.6"
  }), React.createElement("path", {
    d: "M6.6 7.8h10.8v3.4a5.4 5.4 0 0 1-10.8 0z"
  }), React.createElement("path", {
    d: "M12 16.6v4.2"
  })),
  parking: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "3.4",
    y: "3.4",
    width: "17.2",
    height: "17.2",
    rx: "3"
  }), React.createElement("path", {
    d: "M9.8 17.4V7.6h3.4a2.9 2.9 0 0 1 0 5.8H9.8"
  })),
  signpost: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M6.4 3.2v17.6"
  }), React.createElement("path", {
    d: "M6.4 5.8h10.8l3 3.4-3 3.4H6.4z"
  })),
  info: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8.6"
  }), React.createElement("path", {
    d: "M12 11v6"
  }), React.createElement("circle", {
    cx: "12",
    cy: "7.6",
    r: "0.95",
    fill: "currentColor",
    stroke: "none"
  })),
  fork: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M7 3.2v4.6a2.3 2.3 0 0 0 4.6 0V3.2"
  }), React.createElement("path", {
    d: "M9.3 8.4v12.4"
  }), React.createElement("path", {
    d: "M16.6 3.2c2.4 1.6 2.4 7.2 0 8.8v8.8"
  })),
  bag: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M5.6 8h12.8l1 12.8H4.6z"
  }), React.createElement("path", {
    d: "M9 8V6.2a3 3 0 0 1 6 0V8"
  })),
  gear: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3.4"
  }), React.createElement("path", {
    d: "M12 3.4V6M12 18v2.6M20.6 12H18M6 12H3.4M18.1 5.9l-1.8 1.8M7.7 16.3l-1.8 1.8M18.1 18.1l-1.8-1.8M7.7 7.7 5.9 5.9"
  })),
  bed: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M3 20V9.2"
  }), React.createElement("path", {
    d: "M3 13.6h18V20"
  }), React.createElement("path", {
    d: "M21 20H3"
  }), React.createElement("circle", {
    cx: "7.4",
    cy: "11.2",
    r: "1.9"
  }), React.createElement("path", {
    d: "M10.4 13.6a2.8 2.8 0 0 1 2.8-2.8H21"
  })),
  phone: React.createElement("path", {
    d: "M6.6 3.4h3.2l1.6 4-2.2 1.6a12.4 12.4 0 0 0 6.2 6.2l1.6-2.2 4 1.6v3.2a2 2 0 0 1-2.2 2C11.2 19 5 12.8 4.6 5.6a2 2 0 0 1 2-2.2z"
  }),
  camera: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: "2.8",
    y: "6.6",
    width: "18.4",
    height: "13",
    rx: "2.4"
  }), React.createElement("circle", {
    cx: "12",
    cy: "13.2",
    r: "3.8"
  }), React.createElement("path", {
    d: "m8.4 6.6 1.4-2.6h4.4l1.4 2.6"
  })),
  wheelchair: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "11.4",
    cy: "4.2",
    r: "1.9",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("path", {
    d: "M11.4 7.4v5h5l2.4 6.2"
  }), React.createElement("path", {
    d: "M16.6 12.8a6.1 6.1 0 1 1-7.6-3.2"
  })),
  family: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "8.4",
    cy: "7",
    r: "3"
  }), React.createElement("path", {
    d: "M3.4 20.6a5 5 0 0 1 10 0"
  }), React.createElement("circle", {
    cx: "17",
    cy: "11",
    r: "2.3"
  }), React.createElement("path", {
    d: "M13.4 20.6a3.6 3.6 0 0 1 7.2 0"
  })),
  bear: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "6.6",
    cy: "6.8",
    r: "2.6"
  }), React.createElement("circle", {
    cx: "17.4",
    cy: "6.8",
    r: "2.6"
  }), React.createElement("circle", {
    cx: "12",
    cy: "13.4",
    r: "6.8"
  }), React.createElement("circle", {
    cx: "12",
    cy: "16.2",
    r: "2.4"
  }), React.createElement("circle", {
    cx: "9.6",
    cy: "11.8",
    r: "0.85",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("circle", {
    cx: "14.4",
    cy: "11.8",
    r: "0.85",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("circle", {
    cx: "12",
    cy: "14.8",
    r: "0.8",
    fill: "currentColor",
    stroke: "none"
  })),
  paw: React.createElement(React.Fragment, null, React.createElement("ellipse", {
    cx: "7.2",
    cy: "10",
    rx: "1.9",
    ry: "2.4",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("ellipse", {
    cx: "11",
    cy: "7.6",
    rx: "1.9",
    ry: "2.5",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("ellipse", {
    cx: "15",
    cy: "7.8",
    rx: "1.9",
    ry: "2.5",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("ellipse", {
    cx: "18.4",
    cy: "10.6",
    rx: "1.9",
    ry: "2.3",
    fill: "currentColor",
    stroke: "none"
  }), React.createElement("path", {
    d: "M12.6 13.2c3 0 5.4 2 5.4 4.4 0 1.9-1.7 3-3.4 2.5a7.6 7.6 0 0 0-4 0c-1.7.5-3.4-.6-3.4-2.5 0-2.4 2.4-4.4 5.4-4.4z",
    fill: "currentColor",
    stroke: "none"
  })),
  binoculars: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "6.8",
    cy: "15.4",
    r: "4.2"
  }), React.createElement("circle", {
    cx: "17.2",
    cy: "15.4",
    r: "4.2"
  }), React.createElement("path", {
    d: "M10.4 13.6h3.2"
  }), React.createElement("path", {
    d: "M5.2 11.6 6.2 5.4h3.4l1 6.4"
  }), React.createElement("path", {
    d: "M18.8 11.6 17.8 5.4h-3.4l-1 6.4"
  })),
  bolt: React.createElement("path", {
    d: "M13.4 2.4 5.6 13.6h5L9.2 21.6l8.4-11.4h-5.2z"
  }),
  flame: React.createElement("path", {
    d: "M12 21.4c3.6 0 6.4-2.6 6.4-6.1 0-4.9-4.4-6.6-3.4-13.1-4.2 2-6.8 5.4-6.8 9 0 1.4.4 2.4.9 3.1a3.1 3.1 0 0 1-1.6-2.5c-1.1 1.4-1.9 2.6-1.9 4.2 0 3.2 2.8 5.4 6.4 5.4z"
  }),
  sun: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4.2"
  }), React.createElement("path", {
    d: "M12 2.6V5M12 19v2.4M21.4 12H19M5 12H2.6M18.6 5.4l-1.7 1.7M7.1 16.9l-1.7 1.7M18.6 18.6l-1.7-1.7M7.1 7.1 5.4 5.4"
  })),
  prohibited: React.createElement(React.Fragment, null, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8.6"
  }), React.createElement("path", {
    d: "m6 6 12 12"
  })),
  tent: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M3.4 20.6 13.6 3.4"
  }), React.createElement("path", {
    d: "M20.6 20.6 10.4 3.4"
  }), React.createElement("path", {
    d: "M15.4 20.6 12 14.4l-3.4 6.2"
  }), React.createElement("path", {
    d: "M2.2 20.6h19.6"
  })),
  wifi: React.createElement(React.Fragment, null, React.createElement("path", {
    d: "M3.4 9.2a12.6 12.6 0 0 1 17.2 0"
  }), React.createElement("path", {
    d: "M6.8 12.9a8 8 0 0 1 10.4 0"
  }), React.createElement("path", {
    d: "M9.9 16.4a3.6 3.6 0 0 1 4.2 0"
  }), React.createElement("circle", {
    cx: "12",
    cy: "19.6",
    r: "1.2",
    fill: "currentColor",
    stroke: "none"
  }))
};
var AREA_ICONS = [[/hetch hetchy/i, "water"], [/^gas\b|fuel/i, "fuel"], [/grove|crane flat/i, "tree"], [/glacier point/i, "mountain"], [/road|tioga|highway/i, "road"], [/valley/i, "valley"]];
var HOURS_ICONS = [[/information|visitor|welcome/i, "info"], [/eat|food|dining|restaurant/i, "fork"], [/store|shop|market/i, "bag"], [/service/i, "gear"]];
var TRANSIT_ICONS = [[/bike|bicycle/i, "bike"], [/charg|\bev\b/i, "plug"], [/hiker/i, "route"], [/shuttle|bus|yarts|transit/i, "bus"]];
var ESSENTIAL_ICONS = [[/bear/i, "bear"], [/lightning|thunder|storm/i, "bolt"], [/smoke|fire/i, "flame"], [/wildlife|animal/i, "binoculars"], [/heat|water|hydrat/i, "sun"], [/parking/i, "parking"], [/pets|dogs/i, "paw"], [/rules|prohibit|regulation/i, "prohibited"], [/camp/i, "tent"], [/navigation|gps|direction/i, "signpost"], [/wifi|internet|cell|signal/i, "wifi"], [/lodging|hotel|lodge/i, "bed"]];
var CHIP_ICONS = {
  open: "check",
  warn: "alert",
  closed: "x"
};
function iconFor(table, name, fallback) {
  var text = String(name || "");
  for (var i = 0; i < table.length; i++) {
    if (table[i][0].test(text)) return table[i][1];
  }
  return fallback;
}
function BulletinIcon({
  name,
  className,
  label
}) {
  var shape = BULLETIN_ICONS[name] || BULLETIN_ICONS.dot;
  return React.createElement("svg", {
    className: className ? `bicon ${className}` : "bicon",
    viewBox: "0 0 24 24",
    role: label ? "img" : undefined,
    "aria-hidden": label ? undefined : "true",
    focusable: "false"
  }, label ? React.createElement("title", null, label) : null, shape);
}
function BulletinChip({
  tone,
  children
}) {
  var t = CHIP_ICONS[tone] ? tone : "open";
  return React.createElement("span", {
    className: `bulletin-chip bulletin-chip--${t}`
  }, React.createElement(BulletinIcon, {
    name: CHIP_ICONS[t],
    className: "bulletin-chip__icon"
  }), children);
}
function BulletinSection({
  id,
  title,
  dek,
  children
}) {
  return React.createElement("section", {
    id: id,
    className: "bulletin-section",
    "aria-labelledby": `${id}-title`
  }, React.createElement("div", {
    className: "bulletin-section__head"
  }, React.createElement("h2", {
    id: `${id}-title`
  }, title), dek ? React.createElement("p", null, dek) : null), children);
}
function hintFrom(names, max) {
  var list = (names || []).filter(Boolean);
  if (list.length === 0) return "";
  var cap = max || 4;
  var shown = list.slice(0, cap).join(" · ");
  return list.length > cap ? `${shown} · and more` : shown;
}
function BulletinFold({
  title,
  icon,
  count,
  hint,
  children
}) {
  return React.createElement("details", {
    className: "bulletin-fold"
  }, React.createElement("summary", {
    className: "bulletin-fold__head"
  }, React.createElement(BulletinIcon, {
    name: icon || "dot",
    className: "bulletin-fold__icon"
  }), React.createElement("h3", {
    className: "bulletin-fold__title"
  }, title), count ? React.createElement("span", {
    className: "bulletin-fold__count mono"
  }, count) : null, hint ? React.createElement("span", {
    className: "bulletin-fold__hint"
  }, hint) : null, React.createElement(BulletinIcon, {
    name: "chevron",
    className: "bulletin-fold__chev"
  })), React.createElement("div", {
    className: "bulletin-fold__body"
  }, children));
}
function BulletinEditionCard({
  edition,
  today
}) {
  var progress = btEditionProgress(edition, today);
  var ended = btEditionEnded(edition, today);
  return React.createElement("aside", {
    className: "bulletin-edition",
    "aria-label": "This edition"
  }, React.createElement("div", {
    className: "bulletin-kicker"
  }, "This edition"), React.createElement("div", {
    className: "bulletin-edition__label"
  }, edition.label), progress && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "bulletin-edition__bar",
    role: "progressbar",
    "aria-label": "Edition progress",
    "aria-valuemin": 1,
    "aria-valuemax": progress.total,
    "aria-valuenow": progress.day,
    "aria-valuetext": `Day ${progress.day} of ${progress.total}`
  }, React.createElement("span", {
    style: {
      width: `${Math.round(progress.day / progress.total * 100)}%`
    }
  })), React.createElement("div", {
    className: "bulletin-edition__meta mono"
  }, React.createElement("span", null, "Day ", progress.day, " of ", progress.total), React.createElement("span", null, "Ends ", btDayDate(edition.end)))), ended && React.createElement("div", {
    className: "bulletin-edition__meta mono"
  }, React.createElement("span", null, "Ended ", btDayDate(edition.end))), React.createElement("p", {
    className: "bulletin-edition__source"
  }, "Updated ", React.createElement("time", {
    dateTime: edition.updated
  }, bulletinDate(edition.updated)), " from the National Park Service Yosemite Guide.", " ", edition.sourceUrl ? React.createElement("a", {
    href: edition.sourceUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The full Guide on nps.gov ↗") : null));
}
function BulletinHeadlines({
  headlines
}) {
  var LiveNow = typeof window !== "undefined" ? window.LiveNow : null;
  return React.createElement(React.Fragment, null, headlines.length > 0 && React.createElement("div", {
    className: "bulletin-headlines"
  }, headlines.map((h, i) => React.createElement("div", {
    className: `bulletin-headline bulletin-headline--${CHIP_ICONS[h.tone] ? h.tone : "open"}`,
    key: i
  }, React.createElement("div", {
    className: "bulletin-headline__label"
  }, React.createElement(BulletinIcon, {
    name: h.icon || "dot",
    className: "bulletin-headline__icon"
  }), h.label), React.createElement("div", {
    className: "bulletin-headline__status"
  }, h.status), React.createElement("p", null, h.text)))), React.createElement("div", {
    className: "bulletin-live"
  }, React.createElement(ParkingNow, null), LiveNow ? React.createElement(LiveNow, null) : null));
}
function PastGroups({
  groups
}) {
  return React.createElement("div", {
    className: "bulletin-past"
  }, groups.map(g => React.createElement("div", {
    className: "bulletin-past__row",
    key: g.key
  }, React.createElement("div", {
    className: "bulletin-past__when mono"
  }, g.label), React.createElement("ul", null, g.items.map((c, i) => React.createElement("li", {
    key: i
  }, c.what, c.detail ? React.createElement("span", {
    className: "bulletin-past__detail"
  }, " ", c.detail) : null))))));
}
function btWideScreen() {
  try {
    return window.matchMedia("(min-width: 881px)").matches;
  } catch (e) {
    return true;
  }
}
function BulletinChanges({
  changes,
  today
}) {
  var {
    upcoming,
    closed,
    hours
  } = React.useMemo(() => btSplitChanges(changes, today), [changes, today]);
  var [showAll, setShowAll] = React.useState(false);
  var [pastOpen, setPastOpen] = React.useState(btWideScreen);
  var shown = showAll ? upcoming : upcoming.slice(0, BT_COMING_SHOWN);
  var closedCount = closed.reduce((n, g) => n + g.items.length, 0);
  var hoursCount = hours.reduce((n, g) => n + g.items.length, 0);
  return React.createElement("div", {
    className: "bulletin-changes"
  }, React.createElement("div", {
    className: "bulletin-changes__next"
  }, React.createElement("h3", {
    className: "bulletin-subhead"
  }, React.createElement(BulletinIcon, {
    name: "calendar",
    className: "bulletin-subhead__icon"
  }), "Coming up"), upcoming.length > 0 ? React.createElement("ol", {
    className: "bulletin-ledger"
  }, shown.map((c, i) => React.createElement("li", {
    className: "bulletin-ledger__row",
    key: i
  }, React.createElement("div", {
    className: "bulletin-ledger__when mono"
  }, c.label, c.rel ? React.createElement("span", null, c.rel) : null), React.createElement("div", {
    className: "bulletin-ledger__body"
  }, React.createElement("div", {
    className: "bulletin-ledger__what"
  }, React.createElement("span", {
    className: `bulletin-kind bulletin-kind--${c.kind}`
  }, BT_KIND_LABEL[c.kind] || c.kind), c.what), c.detail ? React.createElement("p", null, c.detail) : null)))) : React.createElement("p", {
    className: "bulletin-empty"
  }, "Nothing else is dated in this edition."), upcoming.length > BT_COMING_SHOWN && React.createElement("button", {
    type: "button",
    className: "bulletin-more",
    "aria-expanded": showAll,
    onClick: () => setShowAll(!showAll)
  }, showAll ? "Show fewer" : `Show ${upcoming.length - BT_COMING_SHOWN} more`, React.createElement(BulletinIcon, {
    name: "chevron",
    className: showAll ? "bulletin-more__chev is-up" : "bulletin-more__chev"
  }))), closedCount + hoursCount > 0 && React.createElement("details", {
    className: "bulletin-changes__past",
    open: pastOpen,
    onToggle: e => setPastOpen(e.currentTarget.open)
  }, React.createElement("summary", {
    className: "bulletin-changes__summary"
  }, React.createElement("h3", {
    className: "bulletin-subhead bulletin-subhead--closed"
  }, React.createElement(BulletinIcon, {
    name: "x",
    className: "bulletin-subhead__icon"
  }), "Already closed"), React.createElement("span", {
    className: "bulletin-fold__count mono"
  }, closedCount + hoursCount), React.createElement(BulletinIcon, {
    name: "chevron",
    className: "bulletin-fold__chev"
  })), closedCount > 0 && React.createElement(PastGroups, {
    groups: closed
  }), hoursCount > 0 && React.createElement(React.Fragment, null, React.createElement("h4", {
    className: "bulletin-subhead bulletin-subhead--warn"
  }, React.createElement(BulletinIcon, {
    name: "clock",
    className: "bulletin-subhead__icon"
  }), "Hours changed"), React.createElement(PastGroups, {
    groups: hours
  }))));
}
var BT_FILTERS = [{
  key: "free",
  label: "Free",
  test: p => !p.fee
}, {
  key: "allAges",
  label: "All ages",
  icon: "family",
  test: p => p.allAges
}, {
  key: "access",
  label: "Wheelchair accessible",
  icon: "wheelchair",
  test: p => p.access
}];
function ProgramMarks({
  p
}) {
  return React.createElement("div", {
    className: "bulletin-prog__meta"
  }, p.where ? React.createElement("span", null, p.where) : null, p.fee ? React.createElement("span", {
    className: "bulletin-prog__fee"
  }, "Paid") : null, p.allAges ? React.createElement("span", {
    className: "bulletin-prog__mark"
  }, React.createElement(BulletinIcon, {
    name: "family",
    className: "bulletin-mark"
  }), "All ages") : null, p.access ? React.createElement("span", {
    className: "bulletin-prog__mark"
  }, React.createElement(BulletinIcon, {
    name: "wheelchair",
    className: "bulletin-mark"
  }), "Accessible") : null);
}
function BulletinSchedule({
  data,
  edition,
  today
}) {
  var days = React.useMemo(() => btScheduleDays(edition, today), [edition, today]);
  var areaList = data.programAreas;
  var [dayIdx, setDayIdx] = React.useState(0);
  var [areaKey, setAreaKey] = React.useState(areaList.length ? areaList[0].key : "");
  var [on, setOn] = React.useState({
    free: false,
    allAges: false,
    access: false
  });
  var iso = days[Math.min(dayIdx, days.length - 1)];
  var active = BT_FILTERS.filter(f => on[f.key]);
  var pass = p => btRunsOn(p, iso) && active.every(f => f.test(p));
  var area = areaList.find(a => a.key === areaKey) || areaList[0];
  if (!area) return null;
  var byTime = (a, b) => a.t - b.t || String(a.title).localeCompare(String(b.title));
  var rows = data.programs.filter(p => p.area === area.key && pass(p)).map(p => btProgramOn(p, iso, today)).sort(byTime);
  var parkwide = data.programs.filter(p => p.area === "parkwide" && pass(p)).map(p => btProgramOn(p, iso, today));
  var count = key => data.programs.filter(p => p.area === key && pass(p)).length;
  return React.createElement("div", {
    className: "bulletin-schedule"
  }, React.createElement("div", {
    className: "bulletin-schedule__controls"
  }, React.createElement("div", {
    className: "bulletin-days",
    role: "group",
    "aria-label": "Day"
  }, days.map((d, i) => {
    var kicker = d === today ? "Today" : d === btIsoAdd(today, 1) ? "Tomorrow" : btWeekday(d);
    return React.createElement("button", {
      type: "button",
      key: d,
      className: i === dayIdx ? "bulletin-day is-on" : "bulletin-day",
      "aria-pressed": i === dayIdx,
      onClick: () => setDayIdx(i)
    }, React.createElement("span", {
      className: "bulletin-day__kicker"
    }, kicker), React.createElement("span", {
      className: "bulletin-day__date"
    }, btShortDate(d)));
  })), React.createElement("div", {
    className: "bulletin-filters",
    role: "group",
    "aria-label": "Show only"
  }, React.createElement("span", {
    className: "bulletin-filters__label"
  }, "Show only"), BT_FILTERS.map(f => React.createElement("button", {
    type: "button",
    key: f.key,
    className: on[f.key] ? "bulletin-filter is-on" : "bulletin-filter",
    "aria-pressed": !!on[f.key],
    onClick: () => setOn(Object.assign({}, on, {
      [f.key]: !on[f.key]
    }))
  }, f.icon ? React.createElement(BulletinIcon, {
    name: f.icon,
    className: "bulletin-filter__icon"
  }) : null, f.label)))), React.createElement("div", {
    className: "bulletin-areatabs",
    role: "group",
    "aria-label": "Area"
  }, areaList.map(a => React.createElement("button", {
    type: "button",
    key: a.key,
    className: a.key === area.key ? "bulletin-areatab is-on" : "bulletin-areatab",
    "aria-pressed": a.key === area.key,
    onClick: () => setAreaKey(a.key)
  }, React.createElement("span", {
    className: "bulletin-areatab__full"
  }, a.name), React.createElement("span", {
    className: "bulletin-areatab__short",
    "aria-hidden": "true"
  }, a.short), React.createElement("span", {
    className: "bulletin-areatab__count mono"
  }, count(a.key))))), React.createElement("p", {
    className: "bulletin-schedule__status mono",
    "aria-live": "polite"
  }, btLongDay(iso), " · ", area.name, " · ", rows.length === 1 ? "1 listing" : `${rows.length} listings`), parkwide.length > 0 && React.createElement("ul", {
    className: "bulletin-parkwide"
  }, parkwide.map((p, i) => React.createElement("li", {
    key: i
  }, React.createElement("span", {
    className: "bulletin-kind bulletin-kind--event"
  }, "Parkwide"), React.createElement("strong", null, p.title), p.time ? ` ${p.time}.` : "", p.detail ? ` ${p.detail}` : ""))), rows.length === 0 && active.length > 0 ? React.createElement("p", {
    className: "bulletin-empty"
  }, "Nothing in ", area.name, " on ", btLongDay(iso), " matches ", active.map(f => f.label.toLowerCase()).join(" and "), ".", " ", React.createElement("button", {
    type: "button",
    className: "bulletin-linkbutton",
    onClick: () => setOn({
      free: false,
      allAges: false,
      access: false
    })
  }, "Clear the filters")) : React.createElement("div", {
    className: "bulletin-parts"
  }, BT_DAY_PARTS.map(part => {
    var list = rows.filter(r => r.t >= part.from && r.t < part.to);
    return React.createElement("div", {
      className: "bulletin-part",
      key: part.name
    }, React.createElement("div", {
      className: "bulletin-part__head"
    }, React.createElement("h3", null, part.name), React.createElement("span", {
      className: "mono"
    }, part.range)), list.length === 0 ? React.createElement("p", {
      className: "bulletin-part__empty"
    }, part.empty) : React.createElement("ul", {
      className: "bulletin-progs"
    }, list.map((p, i) => React.createElement("li", {
      className: "bulletin-prog",
      key: `${p.title}-${p.time}-${i}`
    }, React.createElement("span", {
      className: "bulletin-prog__time mono"
    }, p.time), React.createElement("div", {
      className: "bulletin-prog__body"
    }, p.tags.length > 0 && React.createElement("div", {
      className: "bulletin-prog__tags"
    }, p.tags.map(t => React.createElement("span", {
      className: "bulletin-tag",
      key: t
    }, t))), React.createElement("div", {
      className: "bulletin-prog__title"
    }, p.title), p.detail ? React.createElement("p", {
      className: "bulletin-prog__detail"
    }, p.detail) : null, React.createElement(ProgramMarks, {
      p: p
    }))))));
  })), area.notes && area.notes.length > 0 && React.createElement("div", {
    className: "bulletin-areanotes"
  }, React.createElement("h3", {
    className: "bulletin-subhead"
  }, "Also in ", area.name), React.createElement("ul", null, area.notes.map((n, i) => React.createElement("li", {
    key: i
  }, React.createElement("strong", null, n.h), " ", n.t)))), data.programsNote ? React.createElement("p", {
    className: "bulletin-note"
  }, data.programsNote) : null);
}
function BulletinTrails({
  trails,
  note
}) {
  var check = trails.filter(t => t.tone !== "open");
  var usual = trails.filter(t => t.tone === "open");
  return React.createElement(React.Fragment, null, check.length > 0 && React.createElement(React.Fragment, null, React.createElement("h3", {
    className: "bulletin-subhead"
  }, React.createElement(BulletinIcon, {
    name: "alert",
    className: "bulletin-subhead__icon"
  }), "Check before you go"), React.createElement("ul", {
    className: "bulletin-trails"
  }, check.map(t => React.createElement("li", {
    className: "bulletin-trail",
    key: t.name
  }, React.createElement("div", {
    className: "bulletin-trail__name"
  }, React.createElement("strong", null, t.name), t.start ? React.createElement("span", null, t.start) : null), React.createElement("div", {
    className: "bulletin-trail__chip"
  }, React.createElement(BulletinChip, {
    tone: t.tone
  }, t.chip)), React.createElement("div", {
    className: "bulletin-trail__dist"
  }, String(t.distance || "").split(" · ").filter(Boolean).map(d => React.createElement("span", {
    key: d
  }, d))), React.createElement("p", {
    className: "bulletin-trail__note"
  }, t.note))))), usual.length > 0 && React.createElement(React.Fragment, null, React.createElement("h3", {
    className: "bulletin-subhead bulletin-subhead--open"
  }, React.createElement(BulletinIcon, {
    name: "check",
    className: "bulletin-subhead__icon"
  }), "Open as usual"), React.createElement("ul", {
    className: "bulletin-usual"
  }, usual.map(t => React.createElement("li", {
    key: t.name
  }, React.createElement("div", {
    className: "bulletin-usual__name"
  }, React.createElement("strong", null, t.name), t.chip && t.chip !== "Open" ? React.createElement(BulletinChip, {
    tone: "open"
  }, t.chip) : null), t.distance || t.start ? React.createElement("div", {
    className: "bulletin-usual__meta mono"
  }, [t.distance, t.start].filter(Boolean).join(" · ")) : null, React.createElement("p", null, t.note))))), note ? React.createElement("p", {
    className: "bulletin-note"
  }, note) : null);
}
function BulletinReference({
  data,
  today
}) {
  var pinned = data.numbers.slice(0, 4);
  var places = data.hours.reduce((n, g) => n + (g.items && g.items.length || 0), 0);
  return React.createElement(React.Fragment, null, pinned.length > 0 && React.createElement("dl", {
    className: "bulletin-keynums"
  }, pinned.map(n => React.createElement("div", {
    key: n.label
  }, React.createElement("dt", null, n.label), React.createElement("dd", {
    className: "mono"
  }, n.value)))), React.createElement("div", {
    className: "bulletin-folds"
  }, data.hours.length > 0 && React.createElement(BulletinFold, {
    title: "Hours",
    icon: "clock",
    count: `${places} places`,
    hint: hintFrom(data.hours.map(g => g.group), 4)
  }, React.createElement("div", {
    className: "bulletin-hours-groups"
  }, data.hours.map(g => React.createElement("div", {
    className: "bulletin-hours-group",
    key: g.group
  }, React.createElement("h4", {
    className: "bulletin-subhead"
  }, React.createElement(BulletinIcon, {
    name: iconFor(HOURS_ICONS, g.group, "clock"),
    className: "bulletin-subhead__icon"
  }), g.group), React.createElement("table", {
    className: "bulletin-hours"
  }, React.createElement("tbody", null, (g.items || []).map(it => {
    var now = btHoursToday(it, today);
    return React.createElement("tr", {
      key: it.name,
      className: now.closed ? "is-closed" : undefined
    }, React.createElement("td", null, it.name, now.note ? React.createElement("span", {
      className: "bulletin-hours__note"
    }, " · ", now.note) : null), React.createElement("td", {
      className: "mono"
    }, now.hours));
  }))))))), data.transit.length > 0 && React.createElement(BulletinFold, {
    title: "Getting around",
    icon: "bus",
    count: `${data.transit.length} ways`,
    hint: hintFrom(data.transit.map(t => t.name), 4)
  }, React.createElement("div", {
    className: "bulletin-defs"
  }, data.transit.map(t => {
    var ended = btIsoValid(t.until) && today > t.until;
    return React.createElement("div", {
      className: "bulletin-def",
      key: t.name
    }, React.createElement(BulletinIcon, {
      name: iconFor(TRANSIT_ICONS, t.name, "route"),
      className: "bulletin-def__icon"
    }), React.createElement("p", null, React.createElement("strong", null, t.name, "."), " ", btIsoValid(t.until) ? React.createElement("span", {
      className: ended ? "bulletin-flag bulletin-flag--closed" : "bulletin-flag"
    }, ended ? `Ended ${btShortDate(t.until)}` : `Through ${btShortDate(t.until)}`) : null, " ", t.note));
  }))), data.essentials.length > 0 && React.createElement(BulletinFold, {
    title: "Know before you go",
    icon: "alert",
    count: `${data.essentials.length} rules`,
    hint: hintFrom(data.essentials.map(e => e.title), 5)
  }, React.createElement("div", {
    className: "bulletin-defs"
  }, data.essentials.map(e => React.createElement("div", {
    className: "bulletin-def",
    key: e.title
  }, React.createElement(BulletinIcon, {
    name: iconFor(ESSENTIAL_ICONS, e.title, "info"),
    className: "bulletin-def__icon"
  }), React.createElement("p", null, React.createElement("strong", null, e.title, "."), " ", e.text))))), data.numbers.length > 0 && React.createElement(BulletinFold, {
    title: "Every phone number",
    icon: "phone",
    count: `${data.numbers.length} numbers`,
    hint: hintFrom(data.numbers.slice(4).map(n => n.label), 3)
  }, React.createElement("table", {
    className: "bulletin-hours bulletin-numbers"
  }, React.createElement("tbody", null, data.numbers.map(n => React.createElement("tr", {
    key: n.label
  }, React.createElement("td", null, n.label), React.createElement("td", {
    className: "mono"
  }, n.value))))))));
}
var BULLETIN_ARRAYS = ["headlines", "changes", "areas", "programAreas", "programs", "trails", "hours", "transit", "essentials", "numbers"];
function BulletinPage({
  go
}) {
  var [data, setData] = React.useState(null);
  var [state, setState] = React.useState("loading");
  var today = React.useMemo(btParkToday, []);
  React.useEffect(() => {
    var cancelled = false;
    fetch(BULLETIN_URL).then(r => r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))).then(json => {
      if (cancelled) return;
      if (json && json.edition) {
        var safe = Object.assign({}, json);
        for (var k of BULLETIN_ARRAYS) {
          if (!Array.isArray(safe[k])) safe[k] = [];
        }
        setData(safe);
        setState("ready");
      } else {
        setState("error");
      }
    }).catch(err => {
      console.error("BulletinPage: bulletin unavailable", err);
      if (!cancelled) setState("error");
    });
    return () => {
      cancelled = true;
    };
  }, []);
  var toConditions = e => {
    e.preventDefault();
    go("conditions");
  };
  var edition = data ? data.edition : null;
  var ended = edition ? btEditionEnded(edition, today) : false;
  var sections = data ? [{
    id: "bulletin-now",
    label: "Right now",
    show: data.headlines.length > 0
  }, {
    id: "bulletin-changing",
    label: "What's changing",
    show: data.changes.length > 0
  }, {
    id: "bulletin-on",
    label: "What's on",
    show: data.programs.length > 0 && data.programAreas.length > 0
  }, {
    id: "bulletin-roads",
    label: "Roads & areas",
    show: data.areas.length > 0
  }, {
    id: "bulletin-trails",
    label: "Trails",
    show: data.trails.length > 0
  }, {
    id: "bulletin-details",
    label: "Hours, transit & numbers",
    show: true
  }].filter(s => s.show) : [];
  var tones = data ? ["open", "warn", "closed"].map(t => data.areas.filter(a => a.tone === t).length) : [0, 0, 0];
  var areaDek = [tones[0] ? `${tones[0]} open` : "", tones[1] ? `${tones[1]} with limits` : "", tones[2] ? `${tones[2]} closed` : ""].filter(Boolean).join(", ");
  var trailCheck = data ? data.trails.filter(t => t.tone !== "open").length : 0;
  var trailUsual = data ? data.trails.length - trailCheck : 0;
  return React.createElement("div", {
    className: "page bulletin"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "The Park Bulletin"
    }],
    eyebrow: "ONE PAGE, THE WHOLE PARK",
    title: "The Park Bulletin",
    intro: "What is different in Yosemite right now: what is open, what is on today, and what changes next. Rebuilt for each edition of the park's printed Yosemite Guide."
  }), React.createElement("div", {
    className: "hp-wrap bulletin-body"
  }, state === "loading" && React.createElement("p", {
    className: "bulletin-loading"
  }, "Loading the current edition…"), state === "error" && React.createElement("p", {
    className: "bulletin-loading"
  }, "The bulletin didn't load. The live layer still works:", " ", React.createElement("a", {
    href: "/conditions",
    onClick: toConditions
  }, "webcams, entrance waits, and forecasts"), "."), state === "ready" && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "bulletin-top"
  }, edition.lede ? React.createElement("p", {
    className: "bulletin-lede"
  }, edition.lede) : React.createElement("div", null), React.createElement(BulletinEditionCard, {
    edition: edition,
    today: today
  })), (ended || edition.notice) && React.createElement("p", {
    className: "bulletin-notice"
  }, React.createElement(BulletinIcon, {
    name: "alert",
    className: "bulletin-notice__icon"
  }), React.createElement("span", null, edition.notice || `This edition of the Yosemite Guide ended ${bulletinDate(edition.end)}, and the next one is being condensed now. Dates below may have passed; hours and phone numbers usually hold between editions.`, " ", "The ", React.createElement("a", {
    href: "/conditions",
    onClick: toConditions
  }, "live layer"), " (webcams, entrance waits, forecasts) stays current.")), React.createElement("nav", {
    className: "bulletin-jump",
    "aria-label": "On this page"
  }, React.createElement("div", {
    className: "bulletin-jump__links"
  }, sections.map(s => React.createElement("a", {
    href: `#${s.id}`,
    key: s.id
  }, s.label))), React.createElement("span", {
    className: "bulletin-jump__date mono"
  }, btLongDay(today))), data.headlines.length > 0 && React.createElement(BulletinSection, {
    id: "bulletin-now",
    title: "Right now",
    dek: "What this edition most wants you to know."
  }, React.createElement(BulletinHeadlines, {
    headlines: data.headlines
  })), data.changes.length > 0 && React.createElement(BulletinSection, {
    id: "bulletin-changing",
    title: "What's changing",
    dek: "The season, in order: what comes next, and what has already gone."
  }, React.createElement(BulletinChanges, {
    changes: data.changes,
    today: today
  })), data.programs.length > 0 && data.programAreas.length > 0 && React.createElement(BulletinSection, {
    id: "bulletin-on",
    title: "What's on",
    dek: "Programs, walks, talks, and dated events, by day and by area."
  }, React.createElement(BulletinSchedule, {
    data: data,
    edition: edition,
    today: today
  })), data.areas.length > 0 && React.createElement(BulletinSection, {
    id: "bulletin-roads",
    title: "Roads & areas",
    dek: areaDek ? `${areaDek}.` : null
  }, React.createElement("div", {
    className: "bulletin-areas"
  }, data.areas.map(a => React.createElement("article", {
    className: "bulletin-area",
    key: a.name
  }, React.createElement("div", {
    className: "bulletin-area__head"
  }, React.createElement(BulletinIcon, {
    name: iconFor(AREA_ICONS, a.name, "pin"),
    className: "bulletin-area__icon"
  }), React.createElement("h3", null, a.name), React.createElement(BulletinChip, {
    tone: a.tone
  }, a.chip)), React.createElement("p", null, a.note))))), data.trails.length > 0 && React.createElement(BulletinSection, {
    id: "bulletin-trails",
    title: "Trails right now",
    dek: `${trailCheck} to check before you go, ${trailUsual} open as usual.`
  }, React.createElement(BulletinTrails, {
    trails: data.trails,
    note: data.trailsNote
  })), React.createElement(BulletinSection, {
    id: "bulletin-details",
    title: "Hours, transit & numbers",
    dek: "These change little between editions, so they sit folded. Open the one you need."
  }, React.createElement(BulletinReference, {
    data: data,
    today: today
  })), React.createElement("p", {
    className: "bulletin-source"
  }, edition.source, " ", edition.sourceUrl ? React.createElement("a", {
    href: edition.sourceUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The full Guide is on nps.gov ↗") : null)), React.createElement("p", {
    className: "bulletin-conditions"
  }, "Webcams, entrance waits, and forecasts are one page away:", " ", React.createElement("a", {
    href: "/conditions",
    onClick: toConditions
  }, "the conditions page →"))), React.createElement(HpGuideBand, {
    go: go,
    location: "now",
    title: "The Bulletin covers the week. This covers the trip.",
    intro: "The Field Guide app: 50-plus stops with parking and timing notes, offline maps, a trip planner, and the secret guide. Works with no signal, which is most of the park. One purchase, eighteen months of access.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "When the next edition drops, hear about it",
    heading: "When the next edition drops, hear about it",
    blurb: "The Sunday letter carries what changed on this board, plus whatever else the week earned. Free.",
    location: "now",
    tag: "now"
  }));
}
window.BulletinPage = BulletinPage;
