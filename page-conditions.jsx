/* global React, WebcamStrip, EntranceWaits, NewsletterInline, GuidePromo */

// =============================================================================
// CONDITIONS — `/conditions` route. The bookmarkable "is it worth driving in
// today" page: live webcams (shared WebcamStrip), live entrance waits (shared
// EntranceWaits), the three NWS point forecasts from the masthead, and the
// NPS current-conditions page. Everything here links out; the delegated
// outbound_click listener in app.jsx measures all of it with no markup here.
// =============================================================================

const CONDITIONS_FORECASTS = [
  {
    label: "Yosemite Valley",
    note: "4,000 ft. The floor: most lodging, most trailheads, most of your walking.",
    href: "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936",
  },
  {
    label: "Tuolumne Meadows",
    note: "8,600 ft. The high country runs 15 to 25 degrees colder than the Valley.",
    href: "https://forecast.weather.gov/MapClick.php?lat=37.8731&lon=-119.3503",
  },
  {
    label: "Wawona",
    note: "4,000 ft. The south end of the park, near Mariposa Grove.",
    href: "https://forecast.weather.gov/MapClick.php?lat=37.5341&lon=-119.6315",
  },
];

function ConditionsPage({ go }) {
  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap">
          <div className="eyebrow eyebrow--moss">Conditions</div>
          <h1>The park, right now.</h1>
          <p className="page-head__dek">
            Live webcams, entrance waits, and the forecasts that matter, on one page. Check it the morning you drive in, not the week before: Yosemite changes faster than a booking window.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 48 }}>
        {/* Webcams */}
        <section style={{ marginBottom: 64 }}>
          <div className="section-head">
            <h2>Webcams</h2>
            <a href="https://yosemite.org/webcams/" target="_blank" rel="noopener noreferrer">All cameras →</a>
          </div>
          <WebcamStrip />
        </section>

        {/* Entrance waits */}
        <section style={{ marginBottom: 64, maxWidth: 680 }}>
          <div className="section-head">
            <h2>Entrance waits</h2>
          </div>
          <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, color: "var(--ink-1)", marginBottom: 16 }}>
            Live wait estimates from the National Park Service, refreshed every few minutes. Summer mornings the arch at Highway 140 backs up first; by ten, all of them do. If the numbers below are already climbing at eight, you wanted to be inside an hour ago.
          </p>
          <div className="conditions__waits">
            <EntranceWaits />
          </div>
        </section>

        {/* Forecasts */}
        <section style={{ marginBottom: 64, maxWidth: 680 }}>
          <div className="section-head">
            <h2>Forecasts</h2>
          </div>
          <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, color: "var(--ink-1)", marginBottom: 20 }}>
            The park spans 9,000 feet of elevation, so one forecast is never enough. These are National Weather Service point forecasts for the three places most trips actually go.
          </p>
          <ul className="conditions__list">
            {CONDITIONS_FORECASTS.map((f) => (
              <li key={f.label} className="conditions__row">
                <a href={f.href} target="_blank" rel="noopener noreferrer">{f.label} ↗</a>
                <span>{f.note}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Official sources */}
        <section style={{ marginBottom: 64, maxWidth: 680 }}>
          <div className="section-head">
            <h2>Roads and closures</h2>
          </div>
          <ul className="conditions__list">
            <li className="conditions__row">
              <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">NPS current conditions ↗</a>
              <span>Road status, chain controls, trail closures, and campground status. The authoritative page.</span>
            </li>
            <li className="conditions__row">
              <a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">The Yosemite Guide ↗</a>
              <span>The park's own seasonal newspaper: shuttle maps, program schedules, hours.</span>
            </li>
          </ul>
          <p style={{ fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.6, color: "var(--ink-2)", marginTop: 20 }}>
            In winter and spring, call the recorded road line at 209-372-0200 before trusting any website, including this one. For how conditions shape a plan, the{" "}
            <a href="/planning" onClick={(e) => { e.preventDefault(); go("planning"); }}>planning guide</a>{" "}
            covers the seasonal calendar, and the{" "}
            <a href="/itineraries" onClick={(e) => { e.preventDefault(); go("itineraries"); }}>itineraries</a>{" "}
            adjust to what is open.
          </p>
        </section>

        {/* The purchase ask: the honest angle here is that this page, like
            most of the internet, stops working past the entrance station. */}
        <GuidePromo
          go={go}
          location="conditions"
          title="Past the entrance, this page stops loading."
          body="Most of the park has no signal. The Field Guide app is built for exactly that: offline maps, 50-plus stops with parking and timing notes, and a trip planner that works from the trailhead."
          style={{ maxWidth: 680, marginBottom: 56 }}
        />

        <div style={{ maxWidth: 680, marginBottom: 96 }}>
          <NewsletterInline
            location="conditions"
            tag="conditions"
            heading="Conditions change weekly"
            blurb="The Sunday note carries what matters: what opened, what closed, what the week ahead looks like from inside the park. Free."
          />
        </div>
      </div>
    </div>
  );
}

window.ConditionsPage = ConditionsPage;
