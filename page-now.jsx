/* global React, HpPageHead, HpGuideBand, HpLetter, ParkingNow */

// =============================================================================
// THE PARK BULLETIN, `/now`. One page, the whole park, right now: the site's
// condensation of the current NPS Yosemite Guide edition (published on a
// rotating ~5-week schedule). Content lives in /bulletin.json, rewritten once
// per Guide edition; its __comment is the field reference and
// scripts/check-bulletin.mjs is the guard.
//
// THE SEPTEMBER 2026 REDESIGN. The page used to print the edition the way the
// Guide prints it: ten paragraphs of alerts, a program clock where every row
// carried its own day codes and date bounds in its title ("from Sep 4", "Su W
// F"), three cards of prose for the rest of the park, and a calendar where half
// the rows had already happened. Every answer was on the page, but a reader had
// to do the date arithmetic themselves to find it. The redesign moves that
// arithmetic into the page, and the page now answers in the order a visitor
// asks:
//
//   1. Right now: two to four headline tiles, written by the editor
//      (`headlines`), plus the live layer (parking, and river and air when that
//      component is on the site).
//   2. What's changing: one dated ledger (`changes`) split at today into
//      "Coming up" and "Already closed". A row moves from one to the other on
//      its own date, so a five-week-old file still reads correctly.
//   3. What's on: every program and dated event (`programs`) filtered to one
//      day and one area, grouped morning / afternoon / evening, with the
//      Guide's own free, all-ages and accessible marks as filters.
//   4. Roads & areas and trails, with the trails split into the ones to check
//      before you go and the ones open as usual.
//   5. The standing reference, folded (THE FOLD, below), with the first four
//      phone numbers pinned above it.
//
// Every date is read against today in Yosemite (btParkToday), not the reader's
// own clock: a visitor planning from Berlin at breakfast wants the park's day.
//
// BULLETIN_URL carries its own cache-buster, like POINTS_URL on the map page:
// bump the ?v= when bulletin.json changes, or readers behind the CDN keep the
// last edition. HOME_BULLETIN_URL (page-home.jsx) and TIOGA_BULLETIN_URL
// (page-tioga-opening.jsx) share the number; check-asset-freshness.mjs fails
// the build if the three disagree.
// =============================================================================
const BULLETIN_URL = "/bulletin.json?v=17";

// ---- Dates, in park time -----------------------------------------------------
// ISO strings (YYYY-MM-DD) throughout: they compare correctly as strings, and
// doing the arithmetic in UTC noon keeps a DST transition from moving a day.
//
// Every top-level helper here carries a `bt` / `BT_` prefix, because the page
// bundles are classic scripts sharing one global scope: the first build of this
// page named a helper `shortDate`, page-dates.js (prefetched on the reader's
// first interaction) declares its own, and the schedule crashed on the first
// click. A generic name at the top level of a page file is a collision waiting
// for the next page.
const BT_PARK_TZ = "America/Los_Angeles";
const BT_DAY_CODES = ["su", "mo", "tu", "we", "th", "fr", "sa"];

function btIsoValid(iso) {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return !Number.isNaN(new Date(iso + "T12:00:00Z").getTime());
}

function btIsoDate(iso) {
  return new Date(iso + "T12:00:00Z");
}

function btIsoAdd(iso, days) {
  const d = btIsoDate(iso);
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
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: BT_PARK_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type).value;
    return `${get("year")}-${get("month")}-${get("day")}`;
  } catch (e) {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
}

function btFormat(iso, opts) {
  if (!btIsoValid(iso)) return iso || "";
  return btIsoDate(iso).toLocaleDateString("en-US", Object.assign({ timeZone: "UTC" }, opts));
}
// "September 16, 2026"
const bulletinDate = (iso) => btFormat(iso, { month: "long", day: "numeric", year: "numeric" });
// "Sep 20"
const btShortDate = (iso) => btFormat(iso, { month: "short", day: "numeric" });
// "Sun, Sep 20"
const btDayDate = (iso) => btFormat(iso, { weekday: "short", month: "short", day: "numeric" });
// "Sunday, September 20"
const btLongDay = (iso) => btFormat(iso, { weekday: "long", month: "long", day: "numeric" });
// "Sunday"
const btWeekday = (iso) => btFormat(iso, { weekday: "long" });

// Day N of M through the edition window; null outside it (or on bad dates).
function btEditionProgress(edition, today) {
  if (!btIsoValid(edition.start) || !btIsoValid(edition.end)) return null;
  const day = btIsoDiff(today, edition.start) + 1;
  const total = btIsoDiff(edition.end, edition.start) + 1;
  if (day < 1 || day > total) return null;
  return { day, total };
}

// True once today is past the edition window. The standing commitment on
// this page: a stale edition never renders as current without saying so.
function btEditionEnded(edition, today) {
  return btIsoValid(edition.end) && today > edition.end;
}

// ---- Programs ----------------------------------------------------------------
// "8:30 am" / "Noon" to minutes after midnight. check-bulletin.mjs refuses a
// time this cannot read, so the fallback (sort last) is for a hand edit that
// has not been through the check yet.
function btParseTime(s) {
  if (typeof s !== "string") return 1440;
  const t = s.trim().toLowerCase();
  if (t === "noon") return 720;
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (!m) return 1440;
  return ((Number(m[1]) % 12) + (m[3] === "pm" ? 12 : 0)) * 60 + (m[2] ? Number(m[2]) : 0);
}

// Does a program row run on this date? `dates` is an explicit list and wins;
// otherwise `from` / `until` bound the run and `days` picks the weekdays.
// `except` removes single dates either way. check-bulletin.mjs mirrors this
// rule to prove every row appears at least once in the edition window: change
// both together.
function btRunsOn(p, iso) {
  if (!p) return false;
  if (Array.isArray(p.except) && p.except.indexOf(iso) >= 0) return false;
  if (Array.isArray(p.dates)) return p.dates.indexOf(iso) >= 0;
  if (p.from && iso < p.from) return false;
  if (p.until && iso > p.until) return false;
  if (p.days === "daily") return true;
  return Array.isArray(p.days) && p.days.indexOf(btDayCode(iso)) >= 0;
}

// The days the schedule offers: today through the end of the edition, at most
// a week. Before the edition starts it offers the first week; after it ends,
// the last week, under the stale-edition note, so the page still shows what
// the Guide printed rather than an empty picker.
function btScheduleDays(edition, today) {
  if (!btIsoValid(edition.start) || !btIsoValid(edition.end) || edition.start > edition.end) return [today];
  let first = today;
  if (today < edition.start) first = edition.start;
  if (today > edition.end) first = btIsoAdd(edition.end, -6) < edition.start ? edition.start : btIsoAdd(edition.end, -6);
  const out = [];
  for (let i = 0; i < 7; i++) {
    const iso = btIsoAdd(first, i);
    if (iso > edition.end) break;
    out.push(iso);
  }
  return out;
}

const BT_DAY_PARTS = [
  { name: "Morning", range: "Before noon", from: 0, to: 720, empty: "Nothing listed this morning." },
  { name: "Afternoon", range: "Noon to 5 pm", from: 720, to: 1020, empty: "Nothing listed this afternoon." },
  { name: "Evening", range: "5 pm on", from: 1020, to: 1441, empty: "Nothing listed this evening." },
];

// A row as it reads on one date: that day's detail, and the labels the date
// itself implies. A one-date row is a one-off; the last day of a bounded run
// says so. The editor's own `tag` ("Exhibit") rides alongside.
function btProgramOn(p, iso, today) {
  const t = btParseTime(p.time);
  const detail = (p.detailByDay && p.detailByDay[btDayCode(iso)]) || p.detail || "";
  const tags = [];
  if (p.tag) tags.push(p.tag);
  if (Array.isArray(p.dates) && p.dates.length === 1) {
    const evening = t >= 1020 && t < 1440;
    tags.push(iso === today ? (evening ? "Tonight only" : "Today only") : (evening ? "One night only" : "One day only"));
  } else if (p.until && p.until === iso && !Array.isArray(p.dates)) {
    tags.push("Last day");
  }
  return Object.assign({}, p, { t, detail, tags });
}

// ---- Changes -----------------------------------------------------------------
const BT_KIND_LABEL = { closes: "Closes", ends: "Ends", hours: "Hours", opens: "Opens", event: "Event" };
const BT_COMING_SHOWN = 6;

function btRelDay(diff) {
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  return "";
}

// Split the ledger at today. A dated row on or after today is coming up; a
// past closes / ends row lists under "Already closed", a past hours row under
// "Hours changed", and a past opens / event row drops off (the schedule
// carries what opened, and an event that happened is not news). Undated rows
// are season-long closures, grouped under their own `when`.
function btSplitChanges(changes, today) {
  const upcoming = [];
  const closed = [];
  const hours = [];
  const group = (list, key, label) => {
    let g = list.find((x) => x.key === key);
    if (!g) {
      g = { key, label, items: [] };
      list.push(g);
    }
    return g;
  };
  const dated = changes
    .map((c, i) => ({ c, i }))
    .filter((x) => x.c && x.c.what && btIsoValid(x.c.date))
    .sort((a, b) => (a.c.date < b.c.date ? -1 : a.c.date > b.c.date ? 1 : a.i - b.i))
    .map((x) => x.c);
  for (const c of dated) {
    if (c.date >= today) {
      upcoming.push(Object.assign({}, c, { label: c.when || btDayDate(c.date), rel: c.when ? "" : btRelDay(btIsoDiff(c.date, today)) }));
    } else if (c.kind === "closes" || c.kind === "ends") {
      group(closed, c.when || c.date, c.when || btShortDate(c.date)).items.push(c);
    } else if (c.kind === "hours") {
      group(hours, c.date, btShortDate(c.date)).items.push(c);
    }
  }
  for (const c of changes) {
    if (c && c.what && !c.date && c.when && (c.kind === "closes" || c.kind === "ends")) {
      group(closed, `w:${c.when}`, c.when).items.push(c);
    }
  }
  return { upcoming, closed, hours };
}

// ---- Hours -------------------------------------------------------------------
// A row as it reads today. `closes` is the last open day; `then` is the hours
// from a date on. Both are restated in the note, so the reader can see why the
// row reads the way it does.
function btHoursToday(it, today) {
  const note = it.note ? [it.note] : [];
  if (btIsoValid(it.closes) && today > it.closes) {
    return { hours: "Closed", note: [`closed after ${btShortDate(it.closes)}`].concat(note).join("; "), closed: true };
  }
  let hours = it.hours;
  if (it.then && btIsoValid(it.then.from)) {
    if (today >= it.then.from) {
      hours = it.then.hours;
      note.push(`since ${btShortDate(it.then.from)}`);
    } else {
      note.push(`${it.then.hours} from ${btShortDate(it.then.from)}`);
    }
  }
  if (btIsoValid(it.closes)) note.push(`last day ${btShortDate(it.closes)}`);
  return { hours, note: note.join("; "), closed: false };
}

// =============================================================================
// THE ICON SET (August 2026). The bulletin is the densest page on the site: a
// whole Guide edition on one screen, and before this it was eleven stacked
// blocks of grey text that a reader had to read in order to find the one line
// they came for. The icons are a wayfinding layer, not decoration, and they
// follow three rules.
//
// (1) An icon may only restate something the data already says. Every mark on
//     this page is resolved from a field bulletin.json already carries: the
//     status chips from `tone`, the program marks from the Guide's own
//     `access` / `allAges` symbols, the section marks from the row's own name.
//     Nothing here decides that a road is closed or a program is accessible;
//     the JSON does, and the icon repeats it in a second channel.
// (2) An unmatched row gets the neutral `dot`, never a guess. bulletin.json is
//     rewritten by hand every five weeks, so the name tables below WILL meet
//     rows they do not know. A missing mark reads as "unmarked", which is
//     true; a wrong mark reads as a fact, which would not be.
// (3) Geometry only. Every path here is stroke-less and fill-less markup;
//     `.bicon` in styles.css supplies fill, stroke, and width from
//     `currentColor`, so an icon takes the colour of the row it sits in and
//     all four themes follow with no per-theme rule. The exceptions are the
//     shapes that must read solid at 17px (dots, pads, heads), which carry
//     their own fill/stroke attributes: a presentation attribute on the
//     element beats a value inherited from the parent's CSS.
// =============================================================================
const BULLETIN_ICONS = {
  // The neutral mark: what an unmatched row gets.
  dot: <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />,

  alert: (
    <React.Fragment>
      <path d="M12 3.4 21.2 20H2.8z" />
      <path d="M12 9.8v4.6" />
      <circle cx="12" cy="17.3" r="0.95" fill="currentColor" stroke="none" />
    </React.Fragment>
  ),
  check: <path d="m4.6 12.4 5 5.2L19.6 6.6" />,
  chevron: <path d="m5.6 9.4 6.4 6.2 6.4-6.2" />,
  x: (
    <React.Fragment>
      <path d="m6.4 6.4 11.2 11.2" />
      <path d="M17.6 6.4 6.4 17.6" />
    </React.Fragment>
  ),

  clock: (
    <React.Fragment>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 6.6V12l3.7 2.3" />
    </React.Fragment>
  ),
  calendar: (
    <React.Fragment>
      <rect x="3.2" y="5" width="17.6" height="15.8" rx="2.2" />
      <path d="M3.2 10.2h17.6" />
      <path d="M8 3v4.2M16 3v4.2" />
    </React.Fragment>
  ),

  // Places. One shape per kind of place the bulletin reports on.
  road: (
    <React.Fragment>
      <path d="M6.4 20.8 9.6 3.2" />
      <path d="m17.6 20.8-3.2-17.6" />
      <path d="M12 5.6v2.8M12 10.6v2.8M12 15.6v2.8" />
    </React.Fragment>
  ),
  route: (
    <React.Fragment>
      <path d="M4 20.6h6.4a3.3 3.3 0 0 0 0-6.6H7.6a3.3 3.3 0 0 1 0-6.6h8.6" />
      <path d="m12.9 4.4 3.1 3-3.1 3" />
    </React.Fragment>
  ),
  valley: (
    <React.Fragment>
      <path d="M2.2 19.8 8.2 3.6l3.2 16.2" />
      <path d="M21.8 19.8 15.8 5.2l-3.2 14.6" />
      <path d="M2.2 19.8h19.6" />
    </React.Fragment>
  ),
  mountain: <path d="M2.6 19.4 9 7.6l3.6 6.2 2.4-3.4 6.4 9z" />,
  tree: (
    <React.Fragment>
      <path d="M12 2.6 6.6 10.8h3.2L4.8 17.6h14.4l-5-6.8h3.2z" />
      <path d="M12 17.6v3.8" />
    </React.Fragment>
  ),
  water: (
    <React.Fragment>
      <path d="M2.6 8q3.1-2.8 6.2 0t6.2 0 6.2 0" />
      <path d="M2.6 13q3.1-2.8 6.2 0t6.2 0 6.2 0" />
      <path d="M2.6 18q3.1-2.8 6.2 0t6.2 0 6.2 0" />
    </React.Fragment>
  ),
  fuel: (
    <React.Fragment>
      <path d="M4.4 20.8V5.4a2.2 2.2 0 0 1 2.2-2.2h5.2a2.2 2.2 0 0 1 2.2 2.2v15.4" />
      <path d="M3 20.8h13.2" />
      <path d="M6.8 6.8h5v3.8h-5z" />
      <path d="M14 9.4h2.6a2 2 0 0 1 2 2v5.4a1.6 1.6 0 0 0 3.2 0V10l-2.4-2.6" />
    </React.Fragment>
  ),
  pin: (
    <React.Fragment>
      <path d="M12 21.2s6.8-7.4 6.8-11.6a6.8 6.8 0 1 0-13.6 0c0 4.2 6.8 11.6 6.8 11.6z" />
      <circle cx="12" cy="9.4" r="2.4" />
    </React.Fragment>
  ),

  // Getting around.
  bus: (
    <React.Fragment>
      <rect x="3.2" y="4" width="17.6" height="11.6" rx="2.2" />
      <path d="M3.2 10.4h17.6" />
      <path d="M6.6 15.6v1.4M17.4 15.6v1.4" />
      <circle cx="7.6" cy="18.6" r="1.9" />
      <circle cx="16.4" cy="18.6" r="1.9" />
    </React.Fragment>
  ),
  bike: (
    <React.Fragment>
      <circle cx="5.8" cy="16.6" r="4.1" />
      <circle cx="18.2" cy="16.6" r="4.1" />
      <path d="M5.8 16.6 9.8 8.4h4.6l3.8 8.2" />
      <path d="M8.6 8.4H12" />
    </React.Fragment>
  ),
  plug: (
    <React.Fragment>
      <path d="M9 3.2v4.6M15 3.2v4.6" />
      <path d="M6.6 7.8h10.8v3.4a5.4 5.4 0 0 1-10.8 0z" />
      <path d="M12 16.6v4.2" />
    </React.Fragment>
  ),
  parking: (
    <React.Fragment>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="3" />
      <path d="M9.8 17.4V7.6h3.4a2.9 2.9 0 0 1 0 5.8H9.8" />
    </React.Fragment>
  ),
  signpost: (
    <React.Fragment>
      <path d="M6.4 3.2v17.6" />
      <path d="M6.4 5.8h10.8l3 3.4-3 3.4H6.4z" />
    </React.Fragment>
  ),

  // Hours and services.
  info: (
    <React.Fragment>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 11v6" />
      <circle cx="12" cy="7.6" r="0.95" fill="currentColor" stroke="none" />
    </React.Fragment>
  ),
  fork: (
    <React.Fragment>
      <path d="M7 3.2v4.6a2.3 2.3 0 0 0 4.6 0V3.2" />
      <path d="M9.3 8.4v12.4" />
      <path d="M16.6 3.2c2.4 1.6 2.4 7.2 0 8.8v8.8" />
    </React.Fragment>
  ),
  bag: (
    <React.Fragment>
      <path d="M5.6 8h12.8l1 12.8H4.6z" />
      <path d="M9 8V6.2a3 3 0 0 1 6 0V8" />
    </React.Fragment>
  ),
  gear: (
    <React.Fragment>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3.4V6M12 18v2.6M20.6 12H18M6 12H3.4M18.1 5.9l-1.8 1.8M7.7 16.3l-1.8 1.8M18.1 18.1l-1.8-1.8M7.7 7.7 5.9 5.9" />
    </React.Fragment>
  ),
  bed: (
    <React.Fragment>
      <path d="M3 20V9.2" />
      <path d="M3 13.6h18V20" />
      <path d="M21 20H3" />
      <circle cx="7.4" cy="11.2" r="1.9" />
      <path d="M10.4 13.6a2.8 2.8 0 0 1 2.8-2.8H21" />
    </React.Fragment>
  ),
  phone: (
    <path d="M6.6 3.4h3.2l1.6 4-2.2 1.6a12.4 12.4 0 0 0 6.2 6.2l1.6-2.2 4 1.6v3.2a2 2 0 0 1-2.2 2C11.2 19 5 12.8 4.6 5.6a2 2 0 0 1 2-2.2z" />
  ),
  camera: (
    <React.Fragment>
      <rect x="2.8" y="6.6" width="18.4" height="13" rx="2.4" />
      <circle cx="12" cy="13.2" r="3.8" />
      <path d="m8.4 6.6 1.4-2.6h4.4l1.4 2.6" />
    </React.Fragment>
  ),

  // The Guide's own program symbols.
  wheelchair: (
    <React.Fragment>
      <circle cx="11.4" cy="4.2" r="1.9" fill="currentColor" stroke="none" />
      <path d="M11.4 7.4v5h5l2.4 6.2" />
      <path d="M16.6 12.8a6.1 6.1 0 1 1-7.6-3.2" />
    </React.Fragment>
  ),
  family: (
    <React.Fragment>
      <circle cx="8.4" cy="7" r="3" />
      <path d="M3.4 20.6a5 5 0 0 1 10 0" />
      <circle cx="17" cy="11" r="2.3" />
      <path d="M13.4 20.6a3.6 3.6 0 0 1 7.2 0" />
    </React.Fragment>
  ),

  // Know before you go.
  bear: (
    <React.Fragment>
      <circle cx="6.6" cy="6.8" r="2.6" />
      <circle cx="17.4" cy="6.8" r="2.6" />
      <circle cx="12" cy="13.4" r="6.8" />
      <circle cx="12" cy="16.2" r="2.4" />
      <circle cx="9.6" cy="11.8" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="14.4" cy="11.8" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.8" r="0.8" fill="currentColor" stroke="none" />
    </React.Fragment>
  ),
  paw: (
    <React.Fragment>
      <ellipse cx="7.2" cy="10" rx="1.9" ry="2.4" fill="currentColor" stroke="none" />
      <ellipse cx="11" cy="7.6" rx="1.9" ry="2.5" fill="currentColor" stroke="none" />
      <ellipse cx="15" cy="7.8" rx="1.9" ry="2.5" fill="currentColor" stroke="none" />
      <ellipse cx="18.4" cy="10.6" rx="1.9" ry="2.3" fill="currentColor" stroke="none" />
      <path
        d="M12.6 13.2c3 0 5.4 2 5.4 4.4 0 1.9-1.7 3-3.4 2.5a7.6 7.6 0 0 0-4 0c-1.7.5-3.4-.6-3.4-2.5 0-2.4 2.4-4.4 5.4-4.4z"
        fill="currentColor"
        stroke="none"
      />
    </React.Fragment>
  ),
  binoculars: (
    <React.Fragment>
      <circle cx="6.8" cy="15.4" r="4.2" />
      <circle cx="17.2" cy="15.4" r="4.2" />
      <path d="M10.4 13.6h3.2" />
      <path d="M5.2 11.6 6.2 5.4h3.4l1 6.4" />
      <path d="M18.8 11.6 17.8 5.4h-3.4l-1 6.4" />
    </React.Fragment>
  ),
  bolt: <path d="M13.4 2.4 5.6 13.6h5L9.2 21.6l8.4-11.4h-5.2z" />,
  flame: (
    <path d="M12 21.4c3.6 0 6.4-2.6 6.4-6.1 0-4.9-4.4-6.6-3.4-13.1-4.2 2-6.8 5.4-6.8 9 0 1.4.4 2.4.9 3.1a3.1 3.1 0 0 1-1.6-2.5c-1.1 1.4-1.9 2.6-1.9 4.2 0 3.2 2.8 5.4 6.4 5.4z" />
  ),
  sun: (
    <React.Fragment>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6V5M12 19v2.4M21.4 12H19M5 12H2.6M18.6 5.4l-1.7 1.7M7.1 16.9l-1.7 1.7M18.6 18.6l-1.7-1.7M7.1 7.1 5.4 5.4" />
    </React.Fragment>
  ),
  prohibited: (
    <React.Fragment>
      <circle cx="12" cy="12" r="8.6" />
      <path d="m6 6 12 12" />
    </React.Fragment>
  ),
  tent: (
    <React.Fragment>
      <path d="M3.4 20.6 13.6 3.4" />
      <path d="M20.6 20.6 10.4 3.4" />
      <path d="M15.4 20.6 12 14.4l-3.4 6.2" />
      <path d="M2.2 20.6h19.6" />
    </React.Fragment>
  ),
  wifi: (
    <React.Fragment>
      <path d="M3.4 9.2a12.6 12.6 0 0 1 17.2 0" />
      <path d="M6.8 12.9a8 8 0 0 1 10.4 0" />
      <path d="M9.9 16.4a3.6 3.6 0 0 1 4.2 0" />
      <circle cx="12" cy="19.6" r="1.2" fill="currentColor" stroke="none" />
    </React.Fragment>
  ),
};

// Name tables. Each is an ordered list of [pattern, icon]; the first match
// wins and an unmatched name falls through to the section's neutral default.
// Order matters where a name could match twice: "Tioga Road & Tuolumne
// Meadows" is a road before it is a meadow.
const AREA_ICONS = [
  [/hetch hetchy/i, "water"],
  [/^gas\b|fuel/i, "fuel"],
  [/grove|crane flat/i, "tree"],
  [/glacier point/i, "mountain"],
  [/road|tioga|highway/i, "road"],
  [/valley/i, "valley"],
];

const HOURS_ICONS = [
  [/information|visitor|welcome/i, "info"],
  [/eat|food|dining|restaurant/i, "fork"],
  [/store|shop|market/i, "bag"],
  [/service/i, "gear"],
];

const TRANSIT_ICONS = [
  [/bike|bicycle/i, "bike"],
  [/charg|\bev\b/i, "plug"],
  [/hiker/i, "route"],
  [/shuttle|bus|yarts|transit/i, "bus"],
];

const ESSENTIAL_ICONS = [
  [/bear/i, "bear"],
  [/lightning|thunder|storm/i, "bolt"],
  [/smoke|fire/i, "flame"],
  [/wildlife|animal/i, "binoculars"],
  [/heat|water|hydrat/i, "sun"],
  [/parking/i, "parking"],
  [/pets|dogs/i, "paw"],
  [/rules|prohibit|regulation/i, "prohibited"],
  [/camp/i, "tent"],
  [/navigation|gps|direction/i, "signpost"],
  [/wifi|internet|cell|signal/i, "wifi"],
  [/lodging|hotel|lodge/i, "bed"],
];

// Chips already carry the status in a word and a colour; the mark is the third
// channel, and it is read straight off `tone` rather than off the chip's text,
// which is free copy ("Sunrise – sunset", "Weekday closures", "Dry").
const CHIP_ICONS = { open: "check", warn: "alert", closed: "x" };

function iconFor(table, name, fallback) {
  const text = String(name || "");
  for (let i = 0; i < table.length; i++) {
    if (table[i][0].test(text)) return table[i][1];
  }
  return fallback;
}

// An icon is decorative by default (aria-hidden) because the text beside it
// always says the same thing. Pass `label` where the mark IS the content.
function BulletinIcon({ name, className, label }) {
  const shape = BULLETIN_ICONS[name] || BULLETIN_ICONS.dot;
  return (
    <svg
      className={className ? `bicon ${className}` : "bicon"}
      viewBox="0 0 24 24"
      role={label ? "img" : undefined}
      aria-hidden={label ? undefined : "true"}
      focusable="false"
    >
      {label ? <title>{label}</title> : null}
      {shape}
    </svg>
  );
}

function BulletinChip({ tone, children }) {
  const t = CHIP_ICONS[tone] ? tone : "open";
  return (
    <span className={`bulletin-chip bulletin-chip--${t}`}>
      <BulletinIcon name={CHIP_ICONS[t]} className="bulletin-chip__icon" />
      {children}
    </span>
  );
}

function BulletinSection({ id, title, dek, children }) {
  return (
    <section id={id} className="bulletin-section" aria-labelledby={`${id}-title`}>
      <div className="bulletin-section__head">
        <h2 id={`${id}-title`}>{title}</h2>
        {dek ? <p>{dek}</p> : null}
      </div>
      {children}
    </section>
  );
}

// =============================================================================
// THE FOLD (August 2026 simplification, kept by the redesign). Hours, transit,
// know-before-you-go and the full phone list are standing reference,
// near-identical from edition to edition, and they sit under closed <details>
// so the edition-specific board is the page. Nothing is cut: <details> keeps
// every row in the DOM, which is also why the crawler prose in edge/seo.js is
// unaffected. The summary hint follows the icon rule: it may only restate what
// the JSON already carries, so it is built from the row names themselves.
// =============================================================================
function hintFrom(names, max) {
  const list = (names || []).filter(Boolean);
  if (list.length === 0) return "";
  const cap = max || 4;
  // Middot, not a comma: several row labels carry their own commas
  // ("Emergency, call or text"), and a comma-joined list reads as more rows.
  const shown = list.slice(0, cap).join(" · ");
  return list.length > cap ? `${shown} · and more` : shown;
}

function BulletinFold({ title, icon, count, hint, children }) {
  return (
    <details className="bulletin-fold">
      <summary className="bulletin-fold__head">
        <BulletinIcon name={icon || "dot"} className="bulletin-fold__icon" />
        <h3 className="bulletin-fold__title">{title}</h3>
        {count ? <span className="bulletin-fold__count mono">{count}</span> : null}
        {hint ? <span className="bulletin-fold__hint">{hint}</span> : null}
        <BulletinIcon name="chevron" className="bulletin-fold__chev" />
      </summary>
      <div className="bulletin-fold__body">{children}</div>
    </details>
  );
}

function BulletinEditionCard({ edition, today }) {
  const progress = btEditionProgress(edition, today);
  const ended = btEditionEnded(edition, today);
  return (
    <aside className="bulletin-edition" aria-label="This edition">
      <div className="bulletin-kicker">This edition</div>
      <div className="bulletin-edition__label">{edition.label}</div>
      {progress && (
        <React.Fragment>
          <div
            className="bulletin-edition__bar"
            role="progressbar"
            aria-label="Edition progress"
            aria-valuemin={1}
            aria-valuemax={progress.total}
            aria-valuenow={progress.day}
            aria-valuetext={`Day ${progress.day} of ${progress.total}`}
          >
            <span style={{ width: `${Math.round((progress.day / progress.total) * 100)}%` }} />
          </div>
          <div className="bulletin-edition__meta mono">
            <span>Day {progress.day} of {progress.total}</span>
            <span>Ends {btDayDate(edition.end)}</span>
          </div>
        </React.Fragment>
      )}
      {ended && (
        <div className="bulletin-edition__meta mono">
          <span>Ended {btDayDate(edition.end)}</span>
        </div>
      )}
      <p className="bulletin-edition__source">
        Updated <time dateTime={edition.updated}>{bulletinDate(edition.updated)}</time> from the
        National Park Service Yosemite Guide.{" "}
        {edition.sourceUrl ? (
          <a href={edition.sourceUrl} target="_blank" rel="noopener noreferrer">The full Guide on nps.gov ↗</a>
        ) : null}
      </p>
    </aside>
  );
}

// ---- Right now ---------------------------------------------------------------
function BulletinHeadlines({ headlines }) {
  // The live layer rides under the tiles. ParkingNow is shared with
  // /conditions; LiveNow (river flow and air, /api/flow and /api/air) is read
  // off window so this page works whether or not that component has shipped.
  // Both render nothing when their feed is silent, so the row collapses.
  const LiveNow = typeof window !== "undefined" ? window.LiveNow : null;
  return (
    <React.Fragment>
      {headlines.length > 0 && (
        <div className="bulletin-headlines">
          {headlines.map((h, i) => (
            <div className={`bulletin-headline bulletin-headline--${CHIP_ICONS[h.tone] ? h.tone : "open"}`} key={i}>
              <div className="bulletin-headline__label">
                <BulletinIcon name={h.icon || "dot"} className="bulletin-headline__icon" />
                {h.label}
              </div>
              <div className="bulletin-headline__status">{h.status}</div>
              <p>{h.text}</p>
            </div>
          ))}
        </div>
      )}
      <div className="bulletin-live">
        <ParkingNow />
        {LiveNow ? <LiveNow /> : null}
      </div>
    </React.Fragment>
  );
}

// ---- What's changing ---------------------------------------------------------
function PastGroups({ groups }) {
  return (
    <div className="bulletin-past">
      {groups.map((g) => (
        <div className="bulletin-past__row" key={g.key}>
          <div className="bulletin-past__when mono">{g.label}</div>
          <ul>
            {g.items.map((c, i) => (
              <li key={i}>
                {c.what}
                {c.detail ? <span className="bulletin-past__detail"> {c.detail}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function btWideScreen() {
  try {
    return window.matchMedia("(min-width: 881px)").matches;
  } catch (e) {
    return true;
  }
}

function BulletinChanges({ changes, today }) {
  const { upcoming, closed, hours } = React.useMemo(() => btSplitChanges(changes, today), [changes, today]);
  const [showAll, setShowAll] = React.useState(false);
  // The "already happened" column is open beside the ledger on a wide screen
  // and folded under it on a phone, where it would push the schedule a full
  // screen down. It is a <details> either way: the fold hides, never drops.
  const [pastOpen, setPastOpen] = React.useState(btWideScreen);
  const shown = showAll ? upcoming : upcoming.slice(0, BT_COMING_SHOWN);
  const closedCount = closed.reduce((n, g) => n + g.items.length, 0);
  const hoursCount = hours.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="bulletin-changes">
      <div className="bulletin-changes__next">
        <h3 className="bulletin-subhead">
          <BulletinIcon name="calendar" className="bulletin-subhead__icon" />
          Coming up
        </h3>
        {upcoming.length > 0 ? (
          <ol className="bulletin-ledger">
            {shown.map((c, i) => (
              <li className="bulletin-ledger__row" key={i}>
                <div className="bulletin-ledger__when mono">
                  {c.label}
                  {c.rel ? <span>{c.rel}</span> : null}
                </div>
                <div className="bulletin-ledger__body">
                  <div className="bulletin-ledger__what">
                    <span className={`bulletin-kind bulletin-kind--${c.kind}`}>{BT_KIND_LABEL[c.kind] || c.kind}</span>
                    {c.what}
                  </div>
                  {c.detail ? <p>{c.detail}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="bulletin-empty">Nothing else is dated in this edition.</p>
        )}
        {upcoming.length > BT_COMING_SHOWN && (
          <button type="button" className="bulletin-more" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show fewer" : `Show ${upcoming.length - BT_COMING_SHOWN} more`}
            <BulletinIcon name="chevron" className={showAll ? "bulletin-more__chev is-up" : "bulletin-more__chev"} />
          </button>
        )}
      </div>

      {closedCount + hoursCount > 0 && (
        <details className="bulletin-changes__past" open={pastOpen} onToggle={(e) => setPastOpen(e.currentTarget.open)}>
          <summary className="bulletin-changes__summary">
            <h3 className="bulletin-subhead bulletin-subhead--closed">
              <BulletinIcon name="x" className="bulletin-subhead__icon" />
              Already closed
            </h3>
            <span className="bulletin-fold__count mono">{closedCount + hoursCount}</span>
            <BulletinIcon name="chevron" className="bulletin-fold__chev" />
          </summary>
          {closedCount > 0 && <PastGroups groups={closed} />}
          {hoursCount > 0 && (
            <React.Fragment>
              <h4 className="bulletin-subhead bulletin-subhead--warn">
                <BulletinIcon name="clock" className="bulletin-subhead__icon" />
                Hours changed
              </h4>
              <PastGroups groups={hours} />
            </React.Fragment>
          )}
        </details>
      )}
    </div>
  );
}

// ---- What's on ---------------------------------------------------------------
const BT_FILTERS = [
  { key: "free", label: "Free", test: (p) => !p.fee },
  { key: "allAges", label: "All ages", icon: "family", test: (p) => p.allAges },
  { key: "access", label: "Wheelchair accessible", icon: "wheelchair", test: (p) => p.access },
];

function ProgramMarks({ p }) {
  return (
    <div className="bulletin-prog__meta">
      {p.where ? <span>{p.where}</span> : null}
      {p.fee ? <span className="bulletin-prog__fee">Paid</span> : null}
      {p.allAges ? (
        <span className="bulletin-prog__mark">
          <BulletinIcon name="family" className="bulletin-mark" />
          All ages
        </span>
      ) : null}
      {p.access ? (
        <span className="bulletin-prog__mark">
          <BulletinIcon name="wheelchair" className="bulletin-mark" />
          Accessible
        </span>
      ) : null}
    </div>
  );
}

function BulletinSchedule({ data, edition, today }) {
  const days = React.useMemo(() => btScheduleDays(edition, today), [edition, today]);
  const areaList = data.programAreas;
  const [dayIdx, setDayIdx] = React.useState(0);
  const [areaKey, setAreaKey] = React.useState(areaList.length ? areaList[0].key : "");
  const [on, setOn] = React.useState({ free: false, allAges: false, access: false });

  const iso = days[Math.min(dayIdx, days.length - 1)];
  const active = BT_FILTERS.filter((f) => on[f.key]);
  const pass = (p) => btRunsOn(p, iso) && active.every((f) => f.test(p));
  const area = areaList.find((a) => a.key === areaKey) || areaList[0];
  if (!area) return null;

  const byTime = (a, b) => a.t - b.t || String(a.title).localeCompare(String(b.title));
  const rows = data.programs.filter((p) => p.area === area.key && pass(p)).map((p) => btProgramOn(p, iso, today)).sort(byTime);
  const parkwide = data.programs.filter((p) => p.area === "parkwide" && pass(p)).map((p) => btProgramOn(p, iso, today));
  const count = (key) => data.programs.filter((p) => p.area === key && pass(p)).length;

  return (
    <div className="bulletin-schedule">
      <div className="bulletin-schedule__controls">
        <div className="bulletin-days" role="group" aria-label="Day">
          {days.map((d, i) => {
            const kicker = d === today ? "Today" : d === btIsoAdd(today, 1) ? "Tomorrow" : btWeekday(d);
            return (
              <button
                type="button"
                key={d}
                className={i === dayIdx ? "bulletin-day is-on" : "bulletin-day"}
                aria-pressed={i === dayIdx}
                onClick={() => setDayIdx(i)}
              >
                <span className="bulletin-day__kicker">{kicker}</span>
                <span className="bulletin-day__date">{btShortDate(d)}</span>
              </button>
            );
          })}
        </div>
        <div className="bulletin-filters" role="group" aria-label="Show only">
          <span className="bulletin-filters__label">Show only</span>
          {BT_FILTERS.map((f) => (
            <button
              type="button"
              key={f.key}
              className={on[f.key] ? "bulletin-filter is-on" : "bulletin-filter"}
              aria-pressed={!!on[f.key]}
              onClick={() => setOn(Object.assign({}, on, { [f.key]: !on[f.key] }))}
            >
              {f.icon ? <BulletinIcon name={f.icon} className="bulletin-filter__icon" /> : null}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bulletin-areatabs" role="group" aria-label="Area">
        {areaList.map((a) => (
          <button
            type="button"
            key={a.key}
            className={a.key === area.key ? "bulletin-areatab is-on" : "bulletin-areatab"}
            aria-pressed={a.key === area.key}
            onClick={() => setAreaKey(a.key)}
          >
            <span className="bulletin-areatab__full">{a.name}</span>
            <span className="bulletin-areatab__short" aria-hidden="true">{a.short}</span>
            <span className="bulletin-areatab__count mono">{count(a.key)}</span>
          </button>
        ))}
      </div>

      <p className="bulletin-schedule__status mono" aria-live="polite">
        {btLongDay(iso)} · {area.name} · {rows.length === 1 ? "1 listing" : `${rows.length} listings`}
      </p>

      {parkwide.length > 0 && (
        <ul className="bulletin-parkwide">
          {parkwide.map((p, i) => (
            <li key={i}>
              <span className="bulletin-kind bulletin-kind--event">Parkwide</span>
              <strong>{p.title}</strong>
              {p.time ? ` ${p.time}.` : ""}
              {p.detail ? ` ${p.detail}` : ""}
            </li>
          ))}
        </ul>
      )}

      {rows.length === 0 && active.length > 0 ? (
        <p className="bulletin-empty">
          Nothing in {area.name} on {btLongDay(iso)} matches {active.map((f) => f.label.toLowerCase()).join(" and ")}.{" "}
          <button type="button" className="bulletin-linkbutton" onClick={() => setOn({ free: false, allAges: false, access: false })}>
            Clear the filters
          </button>
        </p>
      ) : (
        <div className="bulletin-parts">
          {BT_DAY_PARTS.map((part) => {
            const list = rows.filter((r) => r.t >= part.from && r.t < part.to);
            return (
              <div className="bulletin-part" key={part.name}>
                <div className="bulletin-part__head">
                  <h3>{part.name}</h3>
                  <span className="mono">{part.range}</span>
                </div>
                {list.length === 0 ? (
                  <p className="bulletin-part__empty">{part.empty}</p>
                ) : (
                  <ul className="bulletin-progs">
                    {list.map((p, i) => (
                      <li className="bulletin-prog" key={`${p.title}-${p.time}-${i}`}>
                        <span className="bulletin-prog__time mono">{p.time}</span>
                        <div className="bulletin-prog__body">
                          {p.tags.length > 0 && (
                            <div className="bulletin-prog__tags">
                              {p.tags.map((t) => <span className="bulletin-tag" key={t}>{t}</span>)}
                            </div>
                          )}
                          <div className="bulletin-prog__title">{p.title}</div>
                          {p.detail ? <p className="bulletin-prog__detail">{p.detail}</p> : null}
                          <ProgramMarks p={p} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      {area.notes && area.notes.length > 0 && (
        <div className="bulletin-areanotes">
          <h3 className="bulletin-subhead">Also in {area.name}</h3>
          <ul>
            {area.notes.map((n, i) => (
              <li key={i}>
                <strong>{n.h}</strong> {n.t}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.programsNote ? <p className="bulletin-note">{data.programsNote}</p> : null}
    </div>
  );
}

// ---- Trails ------------------------------------------------------------------
function BulletinTrails({ trails, note }) {
  const check = trails.filter((t) => t.tone !== "open");
  const usual = trails.filter((t) => t.tone === "open");
  return (
    <React.Fragment>
      {check.length > 0 && (
        <React.Fragment>
          <h3 className="bulletin-subhead">
            <BulletinIcon name="alert" className="bulletin-subhead__icon" />
            Check before you go
          </h3>
          <ul className="bulletin-trails">
            {check.map((t) => (
              <li className="bulletin-trail" key={t.name}>
                <div className="bulletin-trail__name">
                  <strong>{t.name}</strong>
                  {t.start ? <span>{t.start}</span> : null}
                </div>
                <div className="bulletin-trail__chip">
                  <BulletinChip tone={t.tone}>{t.chip}</BulletinChip>
                </div>
                <div className="bulletin-trail__dist">
                  {String(t.distance || "").split(" · ").filter(Boolean).map((d) => <span key={d}>{d}</span>)}
                </div>
                <p className="bulletin-trail__note">{t.note}</p>
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
      {usual.length > 0 && (
        <React.Fragment>
          <h3 className="bulletin-subhead bulletin-subhead--open">
            <BulletinIcon name="check" className="bulletin-subhead__icon" />
            Open as usual
          </h3>
          <ul className="bulletin-usual">
            {usual.map((t) => (
              <li key={t.name}>
                <div className="bulletin-usual__name">
                  <strong>{t.name}</strong>
                  {t.chip && t.chip !== "Open" ? <BulletinChip tone="open">{t.chip}</BulletinChip> : null}
                </div>
                {t.distance || t.start ? (
                  <div className="bulletin-usual__meta mono">{[t.distance, t.start].filter(Boolean).join(" · ")}</div>
                ) : null}
                <p>{t.note}</p>
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
      {note ? <p className="bulletin-note">{note}</p> : null}
    </React.Fragment>
  );
}

// ---- The standing reference ---------------------------------------------------
function BulletinReference({ data, today }) {
  const pinned = data.numbers.slice(0, 4);
  const places = data.hours.reduce((n, g) => n + ((g.items && g.items.length) || 0), 0);
  return (
    <React.Fragment>
      {pinned.length > 0 && (
        <dl className="bulletin-keynums">
          {pinned.map((n) => (
            <div key={n.label}>
              <dt>{n.label}</dt>
              <dd className="mono">{n.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="bulletin-folds">
        {data.hours.length > 0 && (
          <BulletinFold title="Hours" icon="clock" count={`${places} places`} hint={hintFrom(data.hours.map((g) => g.group), 4)}>
            <div className="bulletin-hours-groups">
              {data.hours.map((g) => (
                <div className="bulletin-hours-group" key={g.group}>
                  <h4 className="bulletin-subhead">
                    <BulletinIcon name={iconFor(HOURS_ICONS, g.group, "clock")} className="bulletin-subhead__icon" />
                    {g.group}
                  </h4>
                  <table className="bulletin-hours">
                    <tbody>
                      {(g.items || []).map((it) => {
                        const now = btHoursToday(it, today);
                        return (
                          <tr key={it.name} className={now.closed ? "is-closed" : undefined}>
                            <td>
                              {it.name}
                              {now.note ? <span className="bulletin-hours__note"> · {now.note}</span> : null}
                            </td>
                            <td className="mono">{now.hours}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </BulletinFold>
        )}

        {data.transit.length > 0 && (
          <BulletinFold title="Getting around" icon="bus" count={`${data.transit.length} ways`} hint={hintFrom(data.transit.map((t) => t.name), 4)}>
            <div className="bulletin-defs">
              {data.transit.map((t) => {
                const ended = btIsoValid(t.until) && today > t.until;
                return (
                  <div className="bulletin-def" key={t.name}>
                    <BulletinIcon name={iconFor(TRANSIT_ICONS, t.name, "route")} className="bulletin-def__icon" />
                    <p>
                      <strong>{t.name}.</strong>{" "}
                      {btIsoValid(t.until) ? (
                        <span className={ended ? "bulletin-flag bulletin-flag--closed" : "bulletin-flag"}>
                          {ended ? `Ended ${btShortDate(t.until)}` : `Through ${btShortDate(t.until)}`}
                        </span>
                      ) : null}{" "}
                      {t.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </BulletinFold>
        )}

        {data.essentials.length > 0 && (
          <BulletinFold title="Know before you go" icon="alert" count={`${data.essentials.length} rules`} hint={hintFrom(data.essentials.map((e) => e.title), 5)}>
            <div className="bulletin-defs">
              {data.essentials.map((e) => (
                <div className="bulletin-def" key={e.title}>
                  <BulletinIcon name={iconFor(ESSENTIAL_ICONS, e.title, "info")} className="bulletin-def__icon" />
                  <p><strong>{e.title}.</strong> {e.text}</p>
                </div>
              ))}
            </div>
          </BulletinFold>
        )}

        {data.numbers.length > 0 && (
          <BulletinFold title="Every phone number" icon="phone" count={`${data.numbers.length} numbers`} hint={hintFrom(data.numbers.slice(4).map((n) => n.label), 3)}>
            <table className="bulletin-hours bulletin-numbers">
              <tbody>
                {data.numbers.map((n) => (
                  <tr key={n.label}>
                    <td>{n.label}</td>
                    <td className="mono">{n.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </BulletinFold>
        )}
      </div>
    </React.Fragment>
  );
}

// ---- The page ------------------------------------------------------------------
const BULLETIN_ARRAYS = [
  "headlines", "changes", "areas", "programAreas", "programs",
  "trails", "hours", "transit", "essentials", "numbers",
];

function BulletinPage({ go }) {
  const [data, setData] = React.useState(null);
  const [state, setState] = React.useState("loading");
  const today = React.useMemo(btParkToday, []);

  React.useEffect(() => {
    let cancelled = false;
    fetch(BULLETIN_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))))
      .then((json) => {
        if (cancelled) return;
        if (json && json.edition) {
          // Normalize once at the door: bulletin.json is rewritten by hand
          // every ~5 weeks, and the render below maps these arrays unguarded.
          // A missing section renders as empty, which is true, rather than
          // white-screening the page.
          const safe = Object.assign({}, json);
          for (const k of BULLETIN_ARRAYS) {
            if (!Array.isArray(safe[k])) safe[k] = [];
          }
          setData(safe);
          setState("ready");
        } else {
          setState("error");
        }
      })
      .catch((err) => {
        console.error("BulletinPage: bulletin unavailable", err);
        if (!cancelled) setState("error");
      });
    return () => { cancelled = true; };
  }, []);

  const toConditions = (e) => {
    e.preventDefault();
    go("conditions");
  };
  const edition = data ? data.edition : null;
  const ended = edition ? btEditionEnded(edition, today) : false;
  const sections = data
    ? [
        { id: "bulletin-now", label: "Right now", show: data.headlines.length > 0 },
        { id: "bulletin-changing", label: "What's changing", show: data.changes.length > 0 },
        { id: "bulletin-on", label: "What's on", show: data.programs.length > 0 && data.programAreas.length > 0 },
        { id: "bulletin-roads", label: "Roads & areas", show: data.areas.length > 0 },
        { id: "bulletin-trails", label: "Trails", show: data.trails.length > 0 },
        { id: "bulletin-details", label: "Hours, transit & numbers", show: true },
      ].filter((s) => s.show)
    : [];
  const tones = data
    ? ["open", "warn", "closed"].map((t) => data.areas.filter((a) => a.tone === t).length)
    : [0, 0, 0];
  const areaDek = [
    tones[0] ? `${tones[0]} open` : "",
    tones[1] ? `${tones[1]} with limits` : "",
    tones[2] ? `${tones[2]} closed` : "",
  ].filter(Boolean).join(", ");
  const trailCheck = data ? data.trails.filter((t) => t.tone !== "open").length : 0;
  const trailUsual = data ? data.trails.length - trailCheck : 0;

  return (
    <div className="page bulletin">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "The Park Bulletin" }]}
        eyebrow="ONE PAGE, THE WHOLE PARK"
        title="The Park Bulletin"
        intro="What is different in Yosemite right now: what is open, what is on today, and what changes next. Rebuilt for each edition of the park's printed Yosemite Guide."
      />

      <div className="hp-wrap bulletin-body">
        {state === "loading" && <p className="bulletin-loading">Loading the current edition…</p>}
        {state === "error" && (
          <p className="bulletin-loading">
            The bulletin didn't load. The live layer still works:{" "}
            <a href="/conditions" onClick={toConditions}>webcams, entrance waits, and forecasts</a>.
          </p>
        )}

        {state === "ready" && (
          <React.Fragment>
            <div className="bulletin-top">
              {edition.lede ? <p className="bulletin-lede">{edition.lede}</p> : <div />}
              <BulletinEditionCard edition={edition} today={today} />
            </div>

            {/* The stale-edition note, ahead of everything else on the page:
                carrying an ended edition without saying so is worse than
                carrying none. `edition.notice` is the editor's own sentence
                (the routine's stale note goes there) and replaces the default. */}
            {(ended || edition.notice) && (
              <p className="bulletin-notice">
                <BulletinIcon name="alert" className="bulletin-notice__icon" />
                <span>
                  {edition.notice ||
                    `This edition of the Yosemite Guide ended ${bulletinDate(edition.end)}, and the next one is being condensed now. Dates below may have passed; hours and phone numbers usually hold between editions.`}{" "}
                  The <a href="/conditions" onClick={toConditions}>live layer</a> (webcams, entrance waits, forecasts) stays current.
                </span>
              </p>
            )}

            <nav className="bulletin-jump" aria-label="On this page">
              <div className="bulletin-jump__links">
                {sections.map((s) => <a href={`#${s.id}`} key={s.id}>{s.label}</a>)}
              </div>
              <span className="bulletin-jump__date mono">{btLongDay(today)}</span>
            </nav>

            {data.headlines.length > 0 && (
              <BulletinSection id="bulletin-now" title="Right now" dek="What this edition most wants you to know.">
                <BulletinHeadlines headlines={data.headlines} />
              </BulletinSection>
            )}

            {data.changes.length > 0 && (
              <BulletinSection id="bulletin-changing" title="What's changing" dek="The season, in order: what comes next, and what has already gone.">
                <BulletinChanges changes={data.changes} today={today} />
              </BulletinSection>
            )}

            {data.programs.length > 0 && data.programAreas.length > 0 && (
              <BulletinSection id="bulletin-on" title="What's on" dek="Programs, walks, talks, and dated events, by day and by area.">
                <BulletinSchedule data={data} edition={edition} today={today} />
              </BulletinSection>
            )}

            {data.areas.length > 0 && (
              <BulletinSection id="bulletin-roads" title="Roads & areas" dek={areaDek ? `${areaDek}.` : null}>
                <div className="bulletin-areas">
                  {data.areas.map((a) => (
                    <article className="bulletin-area" key={a.name}>
                      <div className="bulletin-area__head">
                        <BulletinIcon name={iconFor(AREA_ICONS, a.name, "pin")} className="bulletin-area__icon" />
                        <h3>{a.name}</h3>
                        <BulletinChip tone={a.tone}>{a.chip}</BulletinChip>
                      </div>
                      <p>{a.note}</p>
                    </article>
                  ))}
                </div>
              </BulletinSection>
            )}

            {data.trails.length > 0 && (
              <BulletinSection
                id="bulletin-trails"
                title="Trails right now"
                dek={`${trailCheck} to check before you go, ${trailUsual} open as usual.`}
              >
                <BulletinTrails trails={data.trails} note={data.trailsNote} />
              </BulletinSection>
            )}

            <BulletinSection
              id="bulletin-details"
              title="Hours, transit & numbers"
              dek="These change little between editions, so they sit folded. Open the one you need."
            >
              <BulletinReference data={data} today={today} />
            </BulletinSection>

            <p className="bulletin-source">
              {edition.source}{" "}
              {edition.sourceUrl ? (
                <a href={edition.sourceUrl} target="_blank" rel="noopener noreferrer">The full Guide is on nps.gov ↗</a>
              ) : null}
            </p>
          </React.Fragment>
        )}

        <p className="bulletin-conditions">
          Webcams, entrance waits, and forecasts are one page away:{" "}
          <a href="/conditions" onClick={toConditions}>the conditions page →</a>
        </p>

      </div>

      {/* The purchase ask: Bulletin readers are inside a trip window,
          checking the park before they drive in. */}
      <HpGuideBand
        go={go}
        location="now"
        title="The Bulletin covers the week. This covers the trip."
        intro="The Field Guide app: 50-plus stops with parking and timing notes, offline maps, a trip planner, and the secret guide. Works with no signal, which is most of the park. One purchase, eighteen months of access."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="When the next edition drops, hear about it"
        heading="When the next edition drops, hear about it"
        blurb="The Sunday letter carries what changed on this board, plus whatever else the week earned. Free."
        location="now"
        tag="now"
      />
    </div>
  );
}

window.BulletinPage = BulletinPage;
