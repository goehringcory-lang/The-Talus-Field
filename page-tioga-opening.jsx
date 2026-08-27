/* global React, NewsletterInline, Breadcrumbs, GuidePromo, LodgingCta */

// =============================================================================
// TIOGA OPENING — `/tioga-opening` route. The second evergreen event page
// (MONETIZATION-IDEAS.md 4.3), following the /firefall pattern: a permanent
// URL that accrues rank every spring for "when does Tioga Road open," instead
// of a year-stamped slug that resets. The deep dive stays in the article
// (/articles/tioga-road-opening-weekend-2026); this page is the decision aid:
// how the opening works, what week one actually offers, and how to prepare.
// Facts come from the published article body; anything that changes annually
// (the date, service openings, reservation rules) points at the NPS sources
// instead of being quoted. Standing commitment: nothing on this page names a
// specific year.
// =============================================================================

// Same versioned bulletin URL as page-now.jsx's BULLETIN_URL and page-home.jsx's
// HOME_BULLETIN_URL. All three must carry the same number: /bulletin.json is
// served with a long TTL, so a page reading it under a stale ?v= shows the
// previous edition. check-asset-freshness.mjs parses this literal and fails the
// build if the three disagree, which is why it is written out in full rather
// than imported or composed.
const TIOGA_BULLETIN_URL = "/bulletin.json?v=8";

// Published opening dates, most recent first.
//
// SOURCING RULE, and the reason this table is short: every row must come from a
// published source, and the only Tioga opening dates this site has actually
// published are below. The National Park Service maintains the full year-by-year
// list at nps.gov/yose/planyourvisit/tiogaroad.htm; add rows from there, oldest
// first, and do not fill gaps from memory or from a search snippet. A wrong
// opening date on this page is worse than a short table, because the whole point
// of the page is that the date is the thing people get wrong.
const OPENING_HISTORY = [
  { year: "2026", date: "May 15", note: "The earliest opening in sixteen years." },
];
const LONG_TERM_AVERAGE = "May 28";

// The status band: the park's own current word on Tioga Road, lifted from the
// edition condensed in bulletin.json. Renders nothing at all until the fetch
// lands and nothing ever if it fails, because a road-status box that guesses is
// worse than no box: this page exists to stop people driving at a closed gate.
function TiogaStatus() {
  const [row, setRow] = React.useState(null);
  const [edition, setEdition] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch(TIOGA_BULLETIN_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))))
      .then((data) => {
        if (cancelled || !data) return;
        const areas = Array.isArray(data.areas) ? data.areas : [];
        const tioga = areas.find((a) => /tioga/i.test(a.name || ""));
        if (tioga && tioga.chip) setRow(tioga);
        if (data.edition) setEdition(data.edition);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!row) return null;

  // An edition past its end date is never presented as current: the chip stays
  // (it is still the last thing the park said) but the dateline says so.
  const ended =
    edition && edition.end
      ? (() => {
          const end = new Date(edition.end + "T00:00:00");
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return !Number.isNaN(end.getTime()) && today > end;
        })()
      : false;

  return (
    <section style={{ marginTop: 48, border: "1px solid var(--ink)", padding: "24px 28px" }}>
      <div className="eyebrow eyebrow--moss" style={{ marginBottom: 10 }}>
        Tioga Road right now
      </div>
      <div style={{ fontFamily: "var(--display)", fontSize: 28, fontWeight: 500, lineHeight: 1.15, marginBottom: 10 }}>
        {row.chip}
      </div>
      {row.note && (
        <p style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--ink-2)", lineHeight: 1.5, margin: "0 0 12px" }}>
          {row.note}
        </p>
      )}
      {edition && edition.updated && (
        <p className="mono" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-3)", margin: 0 }}>
          {ended ? "Last edition, ended " : "Last checked "}
          {ended ? edition.label : edition.updated}
        </p>
      )}
    </section>
  );
}

function TiogaOpeningPage({ go }) {
  const goArticle = (e, slug) => {
    e.preventDefault();
    go(`a:${slug}`);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "Tioga opening" }]} />
          <div className="eyebrow eyebrow--moss">Seasonal event · late spring</div>
          <h1>The Tioga Road opening</h1>
          <p className="page-head__dek">
            Every spring, plow crews cut Highway 120 out of the snowpack and the
            highest road in the park comes back. The opening date is not a date:
            it is announced only days ahead, it varies by weeks from year to
            year, and the first weekends are unlike any other time on the road.
            This page is the standing version: how the opening works, what is
            actually open in week one, and how to drive it well.
          </p>
        </div>
      </div>

      <div className="wrap wrap--narrow" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <section className="prose">
          <h2>How the opening works</h2>
          <p>
            Tioga Road closes with the first lasting snow, typically in
            November, and reopens when the plowing is done, full stop. The
            long-term average opening is the end of May. Light snow years have
            opened the gate in mid-May; heavy years push the opening into June
            and beyond. The park announces the date only once the crews are
            nearly through, usually with less than a week's notice, so a trip
            planned around "Tioga will be open" needs a backup plan below
            8,000 feet.
          </p>
          <p>
            The second thing to know is the difference between "the road is
            open" and "Tuolumne Meadows is open for the season." Opening
            weekend lives entirely in the first one. The store, the grill, the
            lodge, the campground, the wilderness center staffing: all of that
            comes online over the following weeks, on its own schedule. What
            you get in week one is the road itself, a ribbon of asphalt through
            snow walls, half-frozen lakes, and a high country still pulling
            itself out of winter. That is a spectacular thing to drive through,
            and a spectacular thing to be unprepared for.
          </p>

          <h2>When it has actually opened</h2>
          <p>
            The long-term average is {LONG_TERM_AVERAGE}, and the average is the
            least useful number here: the spread between a light year and a heavy
            one is measured in weeks, not days. These are the openings this
            journal has recorded.
          </p>
          <table>
            <thead>
              <tr><th>Year</th><th>Tioga Road opened</th><th>Note</th></tr>
            </thead>
            <tbody>
              {OPENING_HISTORY.map((r) => (
                <tr key={r.year}>
                  <td><strong>{r.year}</strong></td>
                  <td>{r.date}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Average</strong></td>
                <td>{LONG_TERM_AVERAGE}</td>
                <td>The long-term mean, which almost no individual year matches.</td>
              </tr>
            </tbody>
          </table>
          <p>
            The National Park Service publishes the full year-by-year list on its
            own Tioga Road page, which is the source to check if you want the
            whole run rather than the recent years.
          </p>

          <h2>The self-sufficiency rules</h2>
          <ol>
            <li>
              <strong>Gas.</strong> Crane Flat is the last fuel on the west
              side, pay-at-pump. The next gas is Lee Vining, on the far side of
              the pass. Start full.
            </li>
            <li>
              <strong>Water and food.</strong> In the early season there is no
              potable water and nothing to buy anywhere along the road. Bring
              all of both: two liters per person minimum if you are walking
              anywhere.
            </li>
            <li>
              <strong>Weather.</strong> Tioga Pass tops out at 9,945 feet.
              Early-season mornings run to the 20s and 30s even when the Valley
              is mild, black ice forms at dawn and dusk, and afternoon storms
              build fast. Layers, sunglasses against snow glare, and chains in
              the trunk are the price of admission.
            </li>
            <li>
              <strong>Signal.</strong> Cell service is essentially zero from
              Crane Flat to Lee Vining. Download offline maps before you leave
              the Valley.
            </li>
          </ol>

          <h2>What the first weeks are for</h2>
          <p>
            The reliable early stops are the roadside ones: Olmsted Point for
            the back side of Half Dome (the half-mile slickrock trail usually
            dries fast), Tenaya Lake's east beach, the Tuolumne Meadows
            pullouts, and two short walks, Pothole Dome and the flat road out
            to Soda Springs. The famous trails above 8,500 feet, Cathedral
            Lakes, May Lake, Lembert Dome's summit, hold snow weeks longer than
            the road; walking them in June boots-deep is how meadows get
            scarred and ankles get broken. The early season rewards drivers,
            photographers, and modest walkers, not peak-baggers.
          </p>
        </section>

        {/* The live layer. The status chip is read from bulletin.json's own
            Tioga row rather than written here, so it moves with each Guide
            edition instead of going stale between them, and it fails soft to
            the outbound links below if the fetch does not land. */}
        <TiogaStatus />

        <div style={{ marginTop: 32 }}>
          <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>Check the current status</div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)" }}>
            The current plowing and opening status lives on{" "}
            <a href="https://www.nps.gov/yose/planyourvisit/tioga.htm" target="_blank" rel="noopener noreferrer">the NPS Tioga Road page</a>,
            and road conditions by phone or text: text "ynptraffic" to 333111.
            The week's park-wide picture, roads, closures, and hours, is
            condensed on{" "}
            <a href="/now" onClick={(e) => { e.preventDefault(); go("now"); }}>the Park Bulletin</a>,
            and live webcams and forecasts are on{" "}
            <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>the conditions page</a>.
          </p>
        </div>

        <section className="prose" style={{ marginTop: 48 }}>
          <h2>The bigger day</h2>
          <p>
            The move that turns the opening into a full trip is crossing the
            pass: down 3,000 feet into the Mono Basin, where granite gives way
            to sagebrush and Mono Lake spreads out below with its tufa towers.
            Lee Vining, Tioga Lake, Ellery Lake, and the South Tufa boardwalk
            make the east side a destination, not a turnaround. The
            hour-by-hour version of that day, every stop, where to eat in Lee
            Vining, and what the meadows look like under snowmelt, is in{" "}
            <a href="/articles/tioga-road-opening-weekend-2026" onClick={(e) => goArticle(e, "tioga-road-opening-weekend-2026")}>
              <strong>the opening-weekend field guide →</strong>
            </a>
          </p>
        </section>

        {/* The purchase ask: a Tioga reader is planning a high-country day in
            a park with no signal past Crane Flat. */}
        {/* Early-season Tioga is an east-side trip as often as a Valley one,
            and the in-park high-country camps open late and unpredictably.
            Lee Vining is the bed that exists in week one. */}
        <LodgingCta
          destination="Lee Vining, California"
          heading="Where you sleep in week one"
          note="Tuolumne Meadows Lodge and White Wolf open on the snowpack's schedule, often well after the road does, so the high country's own beds may not exist yet when the pass opens. Lee Vining is 30 minutes from Tuolumne Meadows on the east side; Groveland is the western equivalent."
          list="page_tioga"
          slug="tioga-opening"
          cta="Search Lee Vining lodging →"
        />

        <GuidePromo
          go={go}
          location="tioga-opening"
          title="Planning the high-country trip around it?"
          body="The Field Guide app carries the Tioga Road stops with parking notes, offline maps for the stretch with no signal, and a day-by-day planner for the rest of the trip. One purchase, eighteen months of access."
          style={{ marginTop: 56, marginBottom: 40 }}
        />

        <NewsletterInline
          location="tioga-opening"
          tag="tioga-opening"
          heading="The opening, watched from inside the park"
          blurb="Sunday Field Notes carries the opening as it develops: plowing progress, the announcement when it lands, and what is actually open up high, week by week. One short letter a week. Free."
        />
      </div>
    </div>
  );
}

window.TiogaOpeningPage = TiogaOpeningPage;
