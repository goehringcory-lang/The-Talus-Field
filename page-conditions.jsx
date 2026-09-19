/* global React, WebcamStrip, EntranceWaits, ParkingNow, NewsletterInline, GuidePromo, Breadcrumbs */

// =============================================================================
// CONDITIONS — `/conditions` route. The bookmarkable "is it worth driving in
// today" page, laid out as a station board: the answer at the top, then every
// reading below it with its source and its age.
//
// Three rules hold the page up.
//
// (1) NOTHING ON THIS PAGE ASSERTS A CONDITION THE SITE HAS NOT READ. The two
//     live feeds are the NPS entrance waits and the NPS parking lots, both
//     mounted through the shared components in their `variant="board"` form
//     and both silent rather than wrong when the feed is. Everything else here
//     is either a standing fact (an elevation, a phone number, which road a
//     gate sits on) or a link to whoever does know. That is why the roads
//     block is a list of sources and not a table of statuses: a hardcoded
//     "Tioga Road: open" is correct for about six months a year and is the
//     exact failure this site exists to prevent.
//
// (2) The readout plate at the top does not fetch anything. It is fed by the
//     `onData` digests the two feed components already produce, so the page
//     shows one reading per feed, not two requests per feed.
//
// (3) The elevation chart is drawn from the elevations, which are facts, not
//     from temperatures, which the editorial site does not carry. The API
//     Worker's /api/weather could fill these cards with live highs and lows,
//     but its four spots are the Field Guide's regions (Valley, Glacier Point,
//     Tuolumne, Hetch Hetchy) and adopting them would drop Wawona from this
//     page. That is an editorial call, not a rendering one.
//
// Every link out is external and measured by the delegated outbound_click
// listener in app.jsx, so there is no tracking markup here.
// =============================================================================

const { useState, useMemo, useCallback } = React;

// The three point forecasts, in the order the elevation chart draws them:
// the two 4,000-foot stations, then the high country that is the whole reason
// this section exists. Notes are the page's existing published copy.
const CONDITIONS_FORECASTS = [
  {
    label: "Yosemite Valley",
    elevationFt: 4000,
    note: "The floor: most lodging, most trailheads, most of your walking.",
    href: "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936",
  },
  {
    label: "Wawona",
    elevationFt: 4000,
    note: "The south end of the park, near Mariposa Grove.",
    href: "https://forecast.weather.gov/MapClick.php?lat=37.5341&lon=-119.6315",
  },
  {
    label: "Tuolumne Meadows",
    elevationFt: 8600,
    note: "The high country runs 15 to 25 degrees colder than the Valley.",
    href: "https://forecast.weather.gov/MapClick.php?lat=37.8731&lon=-119.3503",
  },
];

// Top of the chart. Tioga Pass, the highest gate in the park, is just under
// 10,000 feet, so a 10,000-foot ceiling puts every station on the scale with
// the Valley still tall enough to read.
const ELEVATION_CEILING_FT = 10000;

// ── The live readout ────────────────────────────────────────────────────────
// One plate, two readings, fed by the digests the feed components hand up.
// Each row appears only once its own feed has answered; when neither has, the
// plate keeps the date and says plainly that it has nothing, because an empty
// dashboard that looks populated is worse than one that admits it is empty.
function ConditionsReadout({ waits, lots }) {
  const today = useMemo(() => {
    try {
      return new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
    } catch (e) {
      return "";
    }
  }, []);

  const rows = [];
  if (waits && waits.longest) {
    rows.push({
      key: "waits",
      label: "Longest gate wait",
      value: waits.longest.text,
      detail: waits.longest.name,
      tone: waits.longest.tone,
    });
  }
  if (lots && lots.total) {
    rows.push({
      key: "lots",
      label: "Lots open",
      value: `${lots.open} of ${lots.total}`,
      detail: lots.open === 0 ? "All full" : null,
      tone: lots.open === 0 ? "long" : "good",
    });
  }

  return (
    <aside className="readout" aria-label="Live readings">
      <div className="readout__top">
        <span className="eyebrow readout__eyebrow">Live readings</span>
        <span className="readout__pulse"><span className="readout__dot" aria-hidden="true" />Now</span>
      </div>
      {today && <div className="readout__date">{today}</div>}
      {rows.length ? (
        <ul className="readout__list">
          {rows.map((row) => (
            <li key={row.key} className="readout__row">
              <span className="readout__label">
                {row.label}
                {row.detail && <span className="readout__detail">{row.detail}</span>}
              </span>
              <span className={`readout__value readout__value--${row.tone}`}>{row.value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="readout__quiet">The park's live feeds are quiet right now. Everything below still links straight to the source.</p>
      )}
      <p className="readout__foot">National Park Service. Both readings refresh every five minutes.</p>
    </aside>
  );
}

function ConditionsPage({ go }) {
  const [waits, setWaits] = useState(null);
  const [lots, setLots] = useState(null);
  // Stable identities: the feed components hold these in a ref and call them
  // from an effect, so a new function every render would be harmless but
  // pointless churn.
  const onWaits = useCallback((digest) => setWaits(digest), []);
  const onLots = useCallback((digest) => setLots(digest), []);

  return (
    <div className="page page--conditions">
      <div className="page-head page-head--split">
        <div className="wrap cond-head">
          <div className="cond-head__lede">
            <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "Conditions" }]} />
            <div className="eyebrow eyebrow--moss">Conditions</div>
            <h1>The park, right now.</h1>
            <p className="page-head__dek">
              Live webcams, entrance waits, and the forecasts that matter, on one page. Check it the morning you drive in, not the week before: Yosemite changes faster than a booking window.
            </p>
          </div>
          <ConditionsReadout waits={waits} lots={lots} />
        </div>
      </div>

      <div className="wrap cond-body">
        {/* Entrance waits. The board variant of the shared component: one
            column block per gate, with the wait set large enough to read at
            arm's length. Three gates, because three is what the NPS feed
            publishes. */}
        <section className="cond-section">
          <div className="section-head">
            <h2>Entrance waits</h2>
            <a href="/planning" onClick={(e) => { e.preventDefault(); go("planning"); }}>Why the mornings matter →</a>
          </div>
          <p className="cond-lede">
            Live wait estimates from the National Park Service, refreshed every few minutes. Summer mornings the arch at Highway 140 backs up first; by ten, all of them do. If the numbers below are already climbing at eight, you wanted to be inside an hour ago.
          </p>
          <EntranceWaits variant="board" onData={onWaits} />
        </section>

        {/* Webcams. The strongest argument on the page is a picture of the
            weather, so the board variant runs them two up instead of four. */}
        <section className="cond-section">
          <div className="section-head">
            <h2>Webcams</h2>
            <a href="/webcams" onClick={(e) => { e.preventDefault(); go("webcams"); }}>All cameras, and how to read them →</a>
          </div>
          <WebcamStrip variant="board" />
        </section>

        {/* Forecasts. The elevation chart is the point: two stations share the
            valley floor and one sits nearly a mile above them, which is the
            whole reason a single forecast for "Yosemite" is useless. */}
        <section className="cond-section">
          <div className="section-head">
            <h2>Forecasts</h2>
            <a href="https://www.weather.gov/hnx/" target="_blank" rel="noopener noreferrer">National Weather Service ↗</a>
          </div>
          <p className="cond-lede">
            The park spans 9,000 feet of elevation, so one forecast is never enough. These are National Weather Service point forecasts for the three places most trips actually go.
          </p>

          <div className="elev">
            <div className="elev__plot" aria-hidden="true">
              <span className="elev__grid" style={{ bottom: "20%" }}><i>2,000 ft</i></span>
              <span className="elev__grid" style={{ bottom: "40%" }}><i>4,000 ft</i></span>
              <span className="elev__grid" style={{ bottom: "60%" }}><i>6,000 ft</i></span>
              <span className="elev__grid" style={{ bottom: "80%" }}><i>8,000 ft</i></span>
              <div className="elev__bars">
                {CONDITIONS_FORECASTS.map((f) => (
                  <div key={f.label} className="elev__col">
                    <div
                      className={`elev__bar${f.elevationFt >= 6000 ? " elev__bar--high" : ""}`}
                      style={{ height: `${(f.elevationFt / ELEVATION_CEILING_FT) * 100}%` }}
                    >
                      <span className="elev__ft">{f.elevationFt.toLocaleString()} ft</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="elev__cards">
              {CONDITIONS_FORECASTS.map((f) => (
                <div key={f.label} className="fc">
                  <div className={`fc__name${f.elevationFt >= 6000 ? " fc__name--high" : ""}`}>{f.label}</div>
                  <p className="fc__note">{f.note}</p>
                  <a className="fc__link" href={f.href} target="_blank" rel="noopener noreferrer">Point forecast ↗</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parking and the sources for everything this page cannot read. */}
        <div className="cond-split">
          <section>
            <div className="section-head">
              <h2>Parking lots</h2>
            </div>
            <p className="cond-lede">
              With no entry reservation in 2026, the Valley's lots are what ration a summer day: on the first busy Saturday of the season all Valley parking was full before noon. Be through the gate before 8 a.m. or after 4 p.m. on a summer weekend. Live lot status from the National Park Service appears here when the park publishes it.
            </p>
            <ParkingNow variant="board" onData={onLots} />
          </section>

          <section>
            <div className="section-head">
              <h2>Roads and closures</h2>
            </div>
            <p className="cond-lede">
              Road status changes faster than any page can promise, this one included, so nothing here claims to know whether a gate is open. These three do.
            </p>
            <ul className="conditions__list">
              <li className="conditions__row">
                <a href="/now" onClick={(e) => { e.preventDefault(); go("now"); }}>The Park Bulletin</a>
                <span>Our own board: road and area status, alerts, and the free-program clock, rewritten each time the park publishes a new Yosemite Guide.</span>
              </li>
              <li className="conditions__row">
                <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">NPS current conditions ↗</a>
                <span>Road status, chain controls, trail closures, and campground status. The authoritative page.</span>
              </li>
              <li className="conditions__row">
                <a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">The Yosemite Guide ↗</a>
                <span>The park's own seasonal newspaper: shuttle maps, program schedules, hours.</span>
              </li>
            </ul>
            <p className="cond-note">
              For how conditions shape a plan, the{" "}
              <a href="/planning" onClick={(e) => { e.preventDefault(); go("planning"); }}>planning guide</a>{" "}
              covers the seasonal calendar, and the{" "}
              <a href="/itineraries" onClick={(e) => { e.preventDefault(); go("itineraries"); }}>itineraries</a>{" "}
              adjust to what is open.
            </p>
          </section>
        </div>

        {/* The recorded line. It outranks every website in winter and spring,
            including this one, so it gets the weight that says so. */}
        <a className="dialplate" href="tel:+12093720200">
          <span className="dialplate__copy">
            <span className="eyebrow eyebrow--moss">When the web is wrong</span>
            <span className="dialplate__say">
              In winter and spring, call the recorded road line before trusting any website, including this one. It is read out by the people standing at the gates.
            </span>
          </span>
          <span className="dialplate__num">
            <span className="dialplate__digits">209-372-0200</span>
            <span className="dialplate__label">NPS recorded road line</span>
          </span>
        </a>

        {/* The two asks, side by side and made once each, in the homepage's
            order: the paid thing first, the free one second. The 680px cap
            they used to carry was right for the old single narrow column and
            left both of them stranded against the left edge of this one. */}
        <div className="cond-asks">
          {/* The honest angle here is that this page, like most of the
              internet, stops working past the entrance station. */}
          <GuidePromo
            go={go}
            location="conditions"
            title="Past the entrance, this page stops loading."
            body="Most of the park has no signal. The Field Guide app is built for exactly that: offline maps, 50-plus stops with parking and timing notes, and a trip planner that works from the trailhead."
          />
          <NewsletterInline
            location="conditions"
            tag="alert-roads"
            heading="Email me when a road changes"
            blurb="One email when Tioga Road, Glacier Point Road, or a highway into the park opens or closes, sent to the people who asked for it. The Sunday note carries the rest of the week from inside the park. Free."
          />
        </div>
      </div>
    </div>
  );
}

window.ConditionsPage = ConditionsPage;
