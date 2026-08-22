/* global React, WebcamStrip, NewsletterInline, Breadcrumbs, GuidePromo */

// =============================================================================
// THE PARK BULLETIN — `/now` route. One page, the whole park, right now: the
// site's condensation of the current NPS Yosemite Guide edition (published on
// a rotating ~5-week schedule) into a single scannable board. What changed,
// what's open, the free-program clock, the dated events, trails, hours,
// transit, and the numbers that matter. Content lives in /bulletin.json,
// rewritten once per Guide edition; see its __comment for the workflow.
//
// BULLETIN_URL carries its own cache-buster, like POINTS_URL on the map page:
// bump the ?v= when bulletin.json changes, or readers behind the CDN keep the
// last edition. Keep HOME_BULLETIN_URL in page-home.jsx on the same number.
// =============================================================================
const BULLETIN_URL = "/bulletin.json?v=6";

function bulletinDate(iso) {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Day N of M through the edition window; null outside it (or on bad dates).
function editionProgress(edition) {
  const start = new Date(edition.start + "T00:00:00");
  const end = new Date(edition.end + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const day = Math.floor((today - start) / 86400000) + 1;
  const total = Math.floor((end - start) / 86400000) + 1;
  if (day < 1 || day > total) return null;
  return { day, total };
}

// True once today is past the edition window. The standing commitment on
// this page: a stale edition never renders as current without saying so.
function editionEnded(edition) {
  const end = new Date(edition.end + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(end.getTime()) && today > end;
}

function isPastEvent(ev) {
  if (!ev.end) return false;
  const end = new Date(ev.end + "T23:59:59");
  return !Number.isNaN(end.getTime()) && end < new Date();
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

const ELSEWHERE_ICONS = [
  [/tuolumne|tioga/i, "mountain"],
  [/grove|wawona|crane flat/i, "tree"],
  [/glacier point/i, "mountain"],
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
// always says the same thing. Pass `label` for the two places where the mark
// IS the content: the Guide's program symbols on the clock rows.
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
  const t = tone || "open";
  return (
    <span className={`bulletin-chip bulletin-chip--${t}`}>
      <BulletinIcon name={CHIP_ICONS[t] || "dot"} className="bulletin-chip__icon" />
      {children}
    </span>
  );
}

function BulletinCard({ title, icon, wide, children }) {
  return (
    <section className={wide ? "bulletin-card bulletin-card--wide" : "bulletin-card"}>
      <h2 className="eyebrow eyebrow--moss bulletin-card__head">
        <BulletinIcon name={icon || "dot"} className="bulletin-card__icon" />
        {title}
      </h2>
      {children}
    </section>
  );
}

// An alert is either a plain string or { text, icon }. The icon is the
// editor's own reading of what the alert already says, and it is optional:
// an untagged alert takes the neutral mark rather than a guess.
function alertParts(a) {
  if (typeof a === "string") return { text: a, icon: null };
  return { text: (a && a.text) || "", icon: (a && a.icon) || null };
}

function BulletinPage({ go }) {
  const [data, setData] = React.useState(null);
  const [state, setState] = React.useState("loading");

  React.useEffect(() => {
    let cancelled = false;
    fetch(BULLETIN_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))))
      .then((json) => {
        if (cancelled) return;
        if (json && json.edition) {
          setData(json);
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

  const edition = data ? data.edition : null;
  const progress = edition ? editionProgress(edition) : null;
  const marked = data && data.valleyDay
    ? { access: data.valleyDay.some((p) => p.access), allAges: data.valleyDay.some((p) => p.allAges) }
    : { access: false, allAges: false };

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "The Park Bulletin" }]} />
          <div className="eyebrow eyebrow--moss">One page, the whole park</div>
          <h1>The Park Bulletin</h1>
          <p className="page-head__dek">
            Everything happening in Yosemite right now, on one scannable page:
            what changed, what's open, the daily programs, the dated events, and
            the hours and numbers that matter. Rebuilt for each edition of the
            park's printed Yosemite Guide.
          </p>
          {edition && (
            <p className="bulletin-edition mono">
              <span className="bulletin-edition__label">Covering {edition.label}</span>
              {progress && <span> · day {progress.day} of {progress.total}</span>}
              {!progress && editionEnded(edition) && <span> · this edition has ended</span>}
              <span> · updated <time dateTime={edition.updated}>{bulletinDate(edition.updated)}</time></span>
            </p>
          )}
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 64 }}>
        {state === "loading" && (
          <p style={{ color: "var(--ink-3)", fontStyle: "italic" }}>Loading the current edition…</p>
        )}
        {state === "error" && (
          <p style={{ color: "var(--ink-3)" }}>
            The bulletin didn't load. The live layer still works:{" "}
            <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>webcams, entrance waits, and forecasts</a>.
          </p>
        )}

        {state === "ready" && (
          <React.Fragment>
            {/* The stale-edition note, ahead of everything else on the page:
                carrying an ended edition without saying so is worse than
                carrying none. */}
            {editionEnded(edition) && (
              <p className="bulletin-stale">
                <BulletinIcon name="alert" className="bulletin-stale__icon" />
                <span>
                  This edition of the Yosemite Guide ended {bulletinDate(edition.end)}, and the next
                  one is being condensed now. The dated events below are over. Hours and phone
                  numbers usually hold between editions; the{" "}
                  <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>live layer</a>{" "}
                  (webcams, entrance waits, forecasts) stays current.
                </span>
              </p>
            )}
            {edition.lede && <p className="bulletin-lede">{edition.lede}</p>}

            {/* What changed: the read-this-first band. */}
            {data.alerts && data.alerts.length > 0 && (
              <section className="bulletin-alerts">
                <h2 className="eyebrow eyebrow--moss bulletin-card__head">
                  <BulletinIcon name="alert" className="bulletin-card__icon" />
                  Changed this edition
                </h2>
                <ul>
                  {data.alerts.map((a, i) => {
                    const alert = alertParts(a);
                    return (
                      <li key={i}>
                        <BulletinIcon name={alert.icon || "dot"} className="bulletin-alerts__icon" />
                        <span>{alert.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* The status board. */}
            <BulletinCard title="Roads & areas" icon="road" wide>
              <div className="bulletin-status bulletin-status--marked">
                {data.areas.map((area) => (
                  <div className="bulletin-status__row" key={area.name}>
                    <div className="bulletin-status__name">
                      <span className="bulletin-status__label">
                        <BulletinIcon name={iconFor(AREA_ICONS, area.name, "pin")} className="bulletin-status__icon" />
                        <strong>{area.name}</strong>
                      </span>
                      <BulletinChip tone={area.tone}>{area.chip}</BulletinChip>
                    </div>
                    <p>{area.note}</p>
                  </div>
                ))}
              </div>
            </BulletinCard>

            <div className="bulletin-grid">
              {/* The free-program clock. */}
              <BulletinCard title="The Valley, by the clock" icon="clock">
                <table className="bulletin-clock">
                  <tbody>
                    {data.valleyDay.map((p, i) => (
                      <tr key={i} className={p.fee ? "bulletin-clock__row bulletin-clock__row--fee" : "bulletin-clock__row"}>
                        <td className="bulletin-clock__time mono">{p.time}</td>
                        <td className="bulletin-clock__what">
                          <span className="bulletin-clock__title">{p.title}{p.fee ? " ($)" : ""}</span>
                          <span className="bulletin-clock__meta">
                            {p.days}{p.where ? ` · ${p.where}` : ""}{p.note ? ` · ${p.note}` : ""}
                            {/* The Guide's own per-program symbols, carried as
                                symbols. True-only: an unmarked program is one
                                the Guide did not mark, not one it ruled out, so
                                there is nothing to render in the false case.
                                These are the one place on the page where the
                                mark IS the content, so each carries a label. */}
                            {(p.allAges || p.access) && (
                              <span className="bulletin-clock__marks">
                                {p.allAges && <BulletinIcon name="family" className="bulletin-mark" label="All ages" />}
                                {p.access && <BulletinIcon name="wheelchair" className="bulletin-mark" label="Wheelchair accessible" />}
                              </span>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(marked.access || marked.allAges) && (
                  <p className="bulletin-legend">
                    {marked.allAges && (
                      <span><BulletinIcon name="family" className="bulletin-mark" /> all ages</span>
                    )}
                    {marked.access && (
                      <span><BulletinIcon name="wheelchair" className="bulletin-mark" /> wheelchair accessible</span>
                    )}
                    <span>($) paid or ticketed</span>
                  </p>
                )}
                {data.valleyDayNote && <p className="bulletin-note">{data.valleyDayNote}</p>}
              </BulletinCard>

              {/* Beyond the Valley, one card per area. */}
              <div className="bulletin-stack">
                {data.elsewhere.map((sec) => (
                  <BulletinCard title={sec.area} icon={iconFor(ELSEWHERE_ICONS, sec.area, "pin")} key={sec.area}>
                    <ul className="bulletin-list">
                      {sec.items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </BulletinCard>
                ))}
              </div>
            </div>

            {/* Dated events, past ones dimmed as the edition ages. */}
            <BulletinCard title="On the calendar this edition" icon="calendar" wide>
              <div className="bulletin-events">
                {data.events.map((ev, i) => (
                  <div className={isPastEvent(ev) ? "bulletin-event is-past" : "bulletin-event"} key={i}>
                    <span className="bulletin-event__date mono">{ev.dates}</span>
                    <div>
                      <span className="bulletin-event__title">{ev.title}</span>
                      <span className="bulletin-event__meta">
                        {ev.where}{ev.note ? ` · ${ev.note}` : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {data.eventsNote && <p className="bulletin-note">{data.eventsNote}</p>}
            </BulletinCard>

            <div className="bulletin-grid">
              {/* Trails as a status list, not a guidebook. */}
              <BulletinCard title="Trails right now" icon="route">
                <div className="bulletin-status">
                  {data.trails.map((t) => (
                    <div className="bulletin-status__row" key={t.name}>
                      <div className="bulletin-status__name">
                        <span className="bulletin-status__label">
                          <strong>{t.name}</strong>
                        </span>
                        <BulletinChip tone={t.tone}>{t.chip}</BulletinChip>
                      </div>
                      <p>{t.note}</p>
                    </div>
                  ))}
                </div>
                {data.trailsNote && <p className="bulletin-note">{data.trailsNote}</p>}
              </BulletinCard>

              <div className="bulletin-stack">
                {data.hours.map((g) => (
                  <BulletinCard title={g.group} icon={iconFor(HOURS_ICONS, g.group, "clock")} key={g.group}>
                    <table className="bulletin-hours">
                      <tbody>
                        {g.items.map((it) => (
                          <tr key={it.name}>
                            <td>{it.name}{it.note ? <span className="bulletin-hours__note"> · {it.note}</span> : null}</td>
                            <td className="mono">{it.hours}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </BulletinCard>
                ))}
              </div>
            </div>

            <div className="bulletin-grid">
              <BulletinCard title="Getting around" icon="bus">
                <div className="bulletin-defs">
                  {data.transit.map((t) => (
                    <div className="bulletin-def" key={t.name}>
                      <BulletinIcon name={iconFor(TRANSIT_ICONS, t.name, "route")} className="bulletin-def__icon" />
                      <p><strong>{t.name}.</strong> {t.note}</p>
                    </div>
                  ))}
                </div>
              </BulletinCard>

              <BulletinCard title="Know before you go" icon="alert">
                <div className="bulletin-defs">
                  {data.essentials.map((e) => (
                    <div className="bulletin-def" key={e.title}>
                      <BulletinIcon name={iconFor(ESSENTIAL_ICONS, e.title, "info")} className="bulletin-def__icon" />
                      <p><strong>{e.title}.</strong> {e.text}</p>
                    </div>
                  ))}
                </div>
                <div className="bulletin-subhead">
                  <BulletinIcon name="phone" className="bulletin-subhead__icon" />
                  By phone
                </div>
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
              </BulletinCard>
            </div>

            <p className="bulletin-source">
              {edition.source}{" "}
              <a href={edition.sourceUrl} target="_blank" rel="noopener noreferrer">The full Guide is on nps.gov ↗</a>
            </p>
          </React.Fragment>
        )}

        {/* The live layer: same webcams the masthead and /conditions use. */}
        <div style={{ marginTop: 48 }}>
          <div className="eyebrow eyebrow--moss bulletin-card__head" style={{ marginBottom: 12 }}>
            <BulletinIcon name="camera" className="bulletin-card__icon" />
            The park live
          </div>
          <WebcamStrip />
          <div style={{ marginTop: 16, fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)" }}>
            More live sources, one page:{" "}
            <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>
              webcams, entrance waits, and forecasts →
            </a>
          </div>
        </div>

        {/* The purchase ask: Bulletin readers are inside a trip window,
            checking the park before they drive in. */}
        <GuidePromo
          go={go}
          location="now"
          title="The Bulletin covers the week. This covers the trip."
          body="The Field Guide app: 50-plus stops with parking and timing notes, offline maps, a trip planner, and the secret guide. Works with no signal, which is most of the park. One purchase, eighteen months of access."
          style={{ marginTop: 56 }}
        />

        <NewsletterInline
          location="now"
          tag="now"
          heading="When the next edition drops, hear about it"
          blurb="The Sunday letter carries what changed on this board, plus whatever else the week earned. Free."
        />
      </div>
    </div>
  );
}

window.BulletinPage = BulletinPage;
