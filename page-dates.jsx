/* global React, NewsletterInline, Breadcrumbs, GuidePromo, DEADLINES */

// =============================================================================
// DATES — `/dates` route. The dates that decide a Yosemite trip, in one table,
// each one downloadable as a calendar file (FEATURE-RESEARCH-2026-09.md,
// feature 1).
//
// Why this page exists. People pay Outdoor Status $49 a year for Recreation.gov
// cancellation texts and Campnab up to $50 a month for the same on campsites;
// nobody publishes the calendar those services are watching. The Half Dome
// pages were the site's most-searched surface with the worst click-through,
// because a page that answers the question gives the reader nothing to keep.
// A calendar file is the thing to keep.
//
// SOURCING. Every row is window.DEADLINES, generated from
// scripts/data/deadlines.json by scripts/gen-dates-ics.mjs, and every row
// carries the NPS page it was read from and the date it was verified. This
// file holds the resolver functions (which the generator does not need) and
// the rendering; it holds no dates of its own. The Field Guide draws the same
// table against a buyer's trip board (apps/guide/src/content/deadlines.ts) and
// scripts/check-deadlines.mjs asserts the two copies agree.
//
// Two kinds of row. Fixed windows (kinds `annual`, `rule`, `season`) ship as
// static .ics files under /ics/, written by the generator. Trip-relative rows
// (`relative`, `release-15th`) depend on the reader's own dates, so the page
// asks for a trip start and end and builds those calendar files in the
// browser, deterministically, with the same VALARM the static files carry.
// Nothing here reads today's date except to dim what has passed.
// =============================================================================

const { useState: useStateD, useMemo: useMemoD } = React;

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_MS = 86400000;

// ---- calendar-date helpers. All arithmetic in UTC on YYYY-MM-DD strings so a
// reader's browser timezone can never move a deadline across midnight.
function parseIso(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
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

// Half Dome cables: the Friday before Memorial Day (last Monday in May) to the
// day after the second Monday in October. Mirrors gen-dates-ics.mjs.
function cablesSeason(year) {
  let d = new Date(Date.UTC(year, 4, 31));
  while (d.getUTCDay() !== 1) d = addDays(d, -1);
  const up = addDays(d, -3);
  let oct = new Date(Date.UTC(year, 9, 1));
  while (oct.getUTCDay() !== 1) oct = addDays(oct, 1);
  const down = addDays(addDays(oct, 7), 1);
  return { up, down };
}

// The campground rule: on the 15th at 7 a.m. Pacific, `monthsAhead` months
// before the arrival month, covering arrivals from the 15th of the target
// month through the 14th of the month after. An arrival on the 3rd therefore
// belongs to the previous month's release.
function releaseDateFor(arrival, monthsAhead) {
  let y = arrival.getUTCFullYear();
  let m = arrival.getUTCMonth(); // 0-based
  if (arrival.getUTCDate() < 15) m -= 1;
  m -= monthsAhead;
  while (m < 0) { m += 12; y -= 1; }
  return new Date(Date.UTC(y, m, 15));
}

// Resolve the trip-relative rows for a trip. Half Dome rows apply to every day
// of the trip (the reader may climb on any of them); campground rows to the
// arrival day; wilderness rows to the start day. Returns dated instances,
// soonest first.
function resolveRelative(items, start, end) {
  const out = [];
  const days = [];
  for (let d = start; d <= end && days.length < 31; d = addDays(d, 1)) days.push(d);
  items.forEach((it) => {
    if (it.kind === "relative") {
      const targets = it.tag === "date-halfdome" ? days : [start];
      targets.forEach((t) => {
        out.push({ item: it, date: addDays(t, it.offsetDays), forDate: t });
      });
    } else if (it.kind === "release-15th") {
      out.push({ item: it, date: releaseDateFor(start, it.monthsAhead), forDate: start });
    }
  });
  out.sort((a, b) => a.date - b.date);
  return out;
}

// One VEVENT per instance, all-day, VALARM the day before. UIDs are stable per
// (row, trip day) so a re-import updates rather than duplicates.
function icsFor(instances, verified) {
  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const ymd = (d) => isoOf(d).replace(/-/g, "");
  const stamp = `${verified.replace(/-/g, "")}T000000Z`;
  const ev = instances.map(({ item, date, forDate }) => [
    "BEGIN:VEVENT",
    `UID:${item.id}-${isoOf(forDate)}@dates.thetalusfieldjournal.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${ymd(date)}`,
    `DTEND;VALUE=DATE:${ymd(addDays(date, 1))}`,
    `SUMMARY:${esc(`Yosemite: ${item.title} (${item.time})`)}`,
    `DESCRIPTION:${esc(`${item.detail} For your ${longDate(forDate)} date. Source: ${item.source}. Verified ${verified}. The Talus Field, https://thetalusfieldjournal.com/dates`)}`,
    "URL:https://thetalusfieldjournal.com/dates",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(`Yosemite: ${item.title}`)}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "END:VEVENT",
  ].join("\r\n"));
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//The Talus Field//Yosemite Dates//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Yosemite dates for your trip", ...ev, "END:VCALENDAR", ""].join("\r\n");
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
  if (window.track) window.track("dates_ics_download", { file: filename });
}

// The fixed window a row describes, for the table. Annual rows print month and
// day; the cables rule prints the years the generator wrote; season rows print
// their own dates and year.
function fixedWindow(it, ruleYears) {
  if (it.kind === "annual") {
    const s = `${MONTH_NAMES[it.start.month - 1]} ${it.start.day}`;
    const e = `${MONTH_NAMES[it.end.month - 1]} ${it.end.day}`;
    return s === e ? s : `${s} to ${e}`;
  }
  if (it.kind === "rule") {
    return ruleYears.map((y) => { const c = cablesSeason(y); return `${shortDate(c.up)} to ${shortDate(c.down)}, ${y}`; }).join("; ");
  }
  if (it.kind === "season") {
    const s = parseIso(it.start); const e = parseIso(it.end);
    return isoOf(s) === isoOf(e) ? longDate(s) : `${longDate(s)} to ${longDate(e)}`;
  }
  return "";
}

const TAG_LABELS = {
  "date-halfdome": "Half Dome",
  "date-wilderness": "Wilderness permits",
  "date-camping": "Campgrounds",
  "date-roads": "Roads and seasons",
};

function DatesPage({ go }) {
  const table = window.DEADLINES || { items: [], verified: "", ruleYears: [] };
  const items = table.items || [];
  const fixed = items.filter((it) => it.kind === "annual" || it.kind === "rule" || it.kind === "season");
  const relative = items.filter((it) => it.kind === "relative" || it.kind === "release-15th");

  const [startStr, setStartStr] = useStateD("");
  const [endStr, setEndStr] = useStateD("");
  const [interest, setInterest] = useStateD("date-halfdome");
  const start = parseIso(startStr);
  const end = parseIso(endStr) || start;
  const tripOk = start && end && end >= start && (end - start) / DAY_MS <= 30;
  const instances = useMemoD(() => (tripOk ? resolveRelative(relative, start, end) : []), [tripOk, startStr, endStr, relative.length]);
  const today = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));

  const goRoute = (e, r) => { e.preventDefault(); go(r); };

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "Dates that matter" }]} />
          <div className="eyebrow eyebrow--moss">Deadlines</div>
          <h1>The Yosemite dates that matter</h1>
          <p className="page-head__dek">
            The lotteries, the release mornings, and the road windows that decide
            a trip, in one table, each one a calendar file. Enter your dates and
            the ones measured from your trip resolve to real days.
          </p>
        </div>
      </div>

      <div className="wrap wrap--narrow" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <section className="prose">
          <h2>Measured from your trip</h2>
          <p>
            Most of what has to happen before a Yosemite trip is measured
            backwards from the day you arrive: a Half Dome day permit two days
            before, a wilderness permit twenty-four weeks before, a Pines
            campsite five months before. Put in your first and last day in the
            park and the table below turns those rules into dates.
          </p>
          <div className="dates__form" role="group" aria-label="Your trip dates">
            <label>
              <span>First day in the park</span>
              <input type="date" value={startStr} onChange={(e) => setStartStr(e.target.value)} />
            </label>
            <label>
              <span>Last day</span>
              <input type="date" value={endStr} min={startStr || undefined} onChange={(e) => setEndStr(e.target.value)} />
            </label>
            {tripOk && instances.length > 0 && (
              <button type="button" className="dates__btn" onClick={() => downloadText(`yosemite-dates-${isoOf(start)}.ics`, icsFor(instances, table.verified))}>
                Add all {instances.length} to my calendar
              </button>
            )}
          </div>
          {startStr && !tripOk && (
            <p className="dates__hint">Enter a first day, and a last day no more than a month after it.</p>
          )}
          {tripOk && (
            <table className="dates__table">
              <thead>
                <tr><th>Act by</th><th>What</th><th>For</th><th></th></tr>
              </thead>
              <tbody>
                {instances.map(({ item, date, forDate }, i) => {
                  const past = date < today;
                  return (
                    <tr key={`${item.id}-${isoOf(forDate)}`} className={past ? "dates__row--past" : ""}>
                      <td><strong>{longDate(date)}</strong><br /><span className="dates__time">{item.time}</span>{past && <span className="dates__time"> · passed</span>}</td>
                      <td>
                        <strong>{item.title}</strong>
                        <p>{item.detail} <a href={item.source} target="_blank" rel="noopener noreferrer">NPS ↗</a></p>
                      </td>
                      <td>{item.tag === "date-halfdome" && instances.filter((x) => x.item.id === item.id).length > 1 ? `climbing ${shortDate(forDate)}` : `arriving ${shortDate(forDate)}`}</td>
                      <td>
                        <button type="button" className="dates__btn dates__btn--small" onClick={() => downloadText(`yosemite-${item.id}-${isoOf(forDate)}.ics`, icsFor([{ item, date, forDate }], table.verified))} aria-label={`Add ${item.title} to calendar`}>
                          + Calendar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!tripOk && (
            <ul>
              {relative.map((it) => (
                <li key={it.id}>
                  <strong>{it.title}:</strong>{" "}
                  {it.kind === "relative"
                    ? `${Math.abs(it.offsetDays) === 168 ? "24 weeks" : Math.abs(it.offsetDays) + " days"} before, ${it.time}.`
                    : `the 15th of the month, ${it.monthsAhead} months ahead, ${it.time}.`}{" "}
                  {it.detail}{" "}
                  <a href={it.source} target="_blank" rel="noopener noreferrer">NPS ↗</a>
                </li>
              ))}
            </ul>
          )}

          <h2>Fixed windows</h2>
          <p>
            These do not move with your trip. The published ones are policy; the
            typical ones are what the park has done in recent years and does not
            promise, so the calendar entry covers the whole range and the park's
            own announcement settles the day.
          </p>
          <table className="dates__table">
            <thead>
              <tr><th>When</th><th>What</th><th></th></tr>
            </thead>
            <tbody>
              {fixed.map((it) => (
                <tr key={it.id}>
                  <td>
                    <strong>{fixedWindow(it, table.ruleYears || [])}</strong><br />
                    <span className="dates__time">{it.time}</span>
                    {it.confidence === "typical" && <span className="dates__time"> · typical, not published</span>}
                  </td>
                  <td>
                    <strong>{it.title}</strong>
                    <p>{it.detail} <a href={it.source} target="_blank" rel="noopener noreferrer">NPS ↗</a></p>
                  </td>
                  <td>
                    <a className="dates__btn dates__btn--small" href={`/ics/${it.id}.ics`} download onClick={() => { if (window.track) window.track("dates_ics_download", { file: `${it.id}.ics` }); }}>
                      + Calendar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            <a className="dates__btn" href="/ics/yosemite-dates.ics" download onClick={() => { if (window.track) window.track("dates_ics_download", { file: "yosemite-dates.ics" }); }}>
              Add every fixed window to my calendar
            </a>
          </p>
          <p className="dates__hint">
            Verified against the National Park Service pages linked above on {table.verified}. Each entry carries its source and that date. If a rule on this page disagrees with nps.gov, nps.gov is right and this page is behind; the{" "}
            <a href="/contact" onClick={(e) => goRoute(e, "contact")}>contact page</a> reaches the editor.
          </p>

          <h2>What the dates mean</h2>
          <p>
            The Half Dome mechanics, the odds, and what to climb instead are on{" "}
            <a href="/half-dome-lottery" onClick={(e) => goRoute(e, "half-dome-lottery")}>the Half Dome lottery page</a>.
            What you can still get holding no permit at all is in{" "}
            <a href="/articles/yosemite-walk-up-and-day-of-permits" onClick={(e) => goRoute(e, "a:yosemite-walk-up-and-day-of-permits")}>the walk-up permits guide</a>,
            and the campground-by-campground picture is{" "}
            <a href="/articles/yosemite-camping-complete-guide" onClick={(e) => goRoute(e, "a:yosemite-camping-complete-guide")}>the camping guide</a>.
            The road openings are watched from inside the park on{" "}
            <a href="/tioga-opening" onClick={(e) => goRoute(e, "tioga-opening")}>the Tioga Road page</a>, and the Firefall on{" "}
            <a href="/firefall" onClick={(e) => goRoute(e, "firefall")}>its own page</a>.
          </p>
        </section>

        <GuidePromo
          go={go}
          location="dates"
          title="In the Field Guide, these dates sit on your trip board"
          body="Enter your trip once and the guide draws every deadline against it, reminds your phone the morning each one opens, and keeps working where the park has no signal. One purchase, eighteen months of access."
          style={{ marginTop: 56, marginBottom: 40 }}
        />

        <div className="dates__interest">
          <div className="eyebrow eyebrow--moss">Remind me</div>
          <p className="dates__hint">Pick what you are waiting on. The Sunday letter carries a dated nudge to the people who asked for that one, and nothing else.</p>
          <div className="dates__chips" role="radiogroup" aria-label="What to remind you about">
            {Object.keys(TAG_LABELS).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={interest === t}
                className={`dates__chip${interest === t ? " is-on" : ""}`}
                onClick={() => setInterest(t)}
              >
                {TAG_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
        <NewsletterInline
          key={interest}
          location="dates"
          tag={interest}
          heading={`${TAG_LABELS[interest]}: the nudge before the date`}
          blurb="A short letter on Sundays, and a dated line the week a window you asked about opens. Free."
        />
      </div>
    </div>
  );
}

window.DatesPage = DatesPage;
