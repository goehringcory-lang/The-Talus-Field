/* global React, HpPageHead, HpHeading, HomeLink, ResponsiveImage, AvailabilityLink, HpGuideBand, HpLetter, AffiliateDisclosure, EventIcon, NatureNotesFilm */

// =============================================================================
// TIOGA OPENING — `/tioga-opening` route. The second evergreen event page
// (MONETIZATION-IDEAS.md 4.3), following the /firefall pattern: a permanent
// URL that accrues rank every spring for "when does Tioga Road open," instead
// of a year-stamped slug that resets. The deep dive stays in the article
// (/articles/tioga-road-opening-weekend); this page is the decision aid:
// how the opening works, what week one actually offers, and how to prepare.
// Facts come from the published article body; anything that changes annually
// (the date, service openings, reservation rules) points at the NPS sources
// instead of being quoted. Standing commitment: nothing on this page names a
// specific year, except the recorded openings in OPENING_HISTORY, which are
// past fact and cannot go stale.
//
// The September 2026 visual pass rebuilt it on /firefall's system (the
// `.hp-event` class, the `.ff-*` layout rules, EventIcon): a full-width cover,
// a fact row and a jump list, then the page in the order a reader plans the
// day. Three pictures carry what the prose used to: the services ladder (the
// road opens first, the meadows weeks later), the road map (TiogaRoadMap,
// Crane Flat to Lee Vining), and the recorded openings strip. Every figure on
// them is already published in the opening-weekend article or on this page;
// the map's caption says which points carry a published distance and which
// are only in order. The FAQ is mirrored in edge/seo.js's
// "/tioga-opening" faq; change both.
// =============================================================================

// Same versioned bulletin URL as page-now.jsx's BULLETIN_URL and page-home.jsx's
// HOME_BULLETIN_URL. All three must carry the same number: /bulletin.json is
// served with a long TTL, so a page reading it under a stale ?v= shows the
// previous edition. check-asset-freshness.mjs parses this literal and fails the
// build if the three disagree, which is why it is written out in full rather
// than imported or composed.
const TIOGA_BULLETIN_URL = "/bulletin.json?v=19";

// Published opening dates, most recent first.
//
// SOURCING RULE, and the reason this table is short: every row must come from a
// published source, and the only Tioga opening dates this site has actually
// published are below. The National Park Service maintains the full year-by-year
// list at nps.gov/yose/planyourvisit/seasonal.htm; add rows from there, oldest
// first, and do not fill gaps from memory or from a search snippet. A wrong
// opening date on this page is worse than a short table, because the whole point
// of the page is that the date is the thing people get wrong.
const OPENING_HISTORY = [
  { year: "2026", date: "May 15", note: "The earliest opening since 2015." },
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
    <section className="fj-status" aria-labelledby="tg-status-chip">
      <p className="hp-eyebrow">
        Tioga Road right now
      </p>
      <h3 className="fj-status__chip" id="tg-status-chip">
        {row.chip}
      </h3>
      {row.note && (
        <p className="fj-status__note">
          {row.note}
        </p>
      )}
      {edition && edition.updated && (
        <p className="fj-status__stamp">
          {ended ? "Last edition, ended " : "Last checked "}
          {ended ? edition.label : edition.updated}
        </p>
      )}
    </section>
  );
}

// The opening dates on one late-spring axis, May 1 to June 30: each recorded
// year a tick, the long-term average a dashed line. Reads OPENING_HISTORY and
// LONG_TERM_AVERAGE, the same values the table prints; the table stays the
// accessible record and this figure is hidden from assistive tech.
const TIOGA_AXIS_START = { month: 4, day: 1 }; // May 1 (0-based month)
const TIOGA_AXIS_DAYS = 61;                     // through June 30
function tiogaOffset(label) {
  const m = /^(May|June|Jun)\s+(\d{1,2})$/.exec(String(label).trim());
  if (!m) return null;
  const day = parseInt(m[2], 10) + (m[1] === "May" ? 0 : 31) - TIOGA_AXIS_START.day;
  return Math.max(0, Math.min(TIOGA_AXIS_DAYS - 1, day)) / (TIOGA_AXIS_DAYS - 1);
}
// Labels near either end of the axis hang inward instead of past the card.
const tiogaEdge = (x) => (x < 0.08 ? " is-start" : x > 0.92 ? " is-end" : "");
function TiogaStrip() {
  const avg = tiogaOffset(LONG_TERM_AVERAGE);
  return (
    <figure className="tg-strip" aria-hidden="true">
      <p className="hp-eyebrow fj-chart-title">Recorded openings, May 1 to June 30</p>
      <div className="tg-strip__axis">
        <span className="tg-strip__snow" />
        {avg != null && (
          <span className={"tg-strip__avg" + tiogaEdge(avg)} style={{ left: `${avg * 100}%` }}>
            <b>{LONG_TERM_AVERAGE}</b><small>Long-term average</small>
          </span>
        )}
        {OPENING_HISTORY.map((r, i) => {
          const x = tiogaOffset(r.date);
          return x == null ? null : (
            <span key={r.year} className={"tg-strip__year" + (i % 2 ? " is-alt" : "") + tiogaEdge(x)} style={{ left: `${x * 100}%` }}>
              <b>{r.date}</b><small>{r.year}</small>
            </span>
          );
        })}
      </div>
      <div className="tg-strip__months"><span>May 1</span><span>June 1</span><span>June 30</span></div>
    </figure>
  );
}

// Along the road, west to east, on the National Park Service's own map. The
// crop is img/nps-tioga-road-map.jpg (1600 x 760, cut from
// img/nps-yosemite-park-map.jpg at +100+560), so each pin shares its pixel
// space and sits on the map's own label for that place. Elevations and the
// three published distances (Crane Flat to Tuolumne Meadows 39 miles, to the
// pass about 47, and a drop of more than 3,000 feet in twelve miles to the
// Mono Basin) come from the opening-weekend article and the site's published
// elevations (Olmsted Point is given as 8,300 to 8,500 feet across the site;
// the list uses the middle). `mi` is printed only where the site publishes it.
const TIOGA_STOPS = [
  { name: "Crane Flat", ft: 6200, mi: 0, note: "Last gas, pay at pump", x: 145, y: 630 },
  { name: "White Wolf", ft: 8000, x: 400, y: 325 },
  { name: "Olmsted Point", ft: 8400, x: 786, y: 488 },
  { name: "Tenaya Lake", ft: 8150, x: 835, y: 425 },
  { name: "Tuolumne Meadows", ft: 8600, mi: 39, x: 1090, y: 320 },
  { name: "Tioga Pass", ft: 9945, mi: 47, note: "The park's east gate", x: 1295, y: 192 },
  { name: "Lee Vining", ft: 6800, mi: 59, note: "Next gas", x: 1540, y: 95 },
];

function TiogaRoadMap() {
  return (
    <div className="npsmap__frame">
      <img src="/img/nps-tioga-road-map.jpg" width="1600" height="760" loading="lazy" decoding="async"
        alt="National Park Service map of Tioga Road from Crane Flat in the west, past White Wolf, Olmsted Point, Tenaya Lake and Tuolumne Meadows, to Tioga Pass and Lee Vining in the east." />
      <svg viewBox="0 0 1600 760" role="img"
        aria-label="Numbered pins on the map, west to east: Crane Flat at 6,200 feet, the last gas; White Wolf at about 8,000 feet; Olmsted Point at about 8,400 feet; Tenaya Lake at 8,150 feet; Tuolumne Meadows at 8,600 feet, 39 miles from Crane Flat; Tioga Pass at 9,945 feet, about 47 miles from Crane Flat; then a drop of more than 3,000 feet in twelve miles to Lee Vining, about 6,800 feet, the next gas.">
        {TIOGA_STOPS.map((t, i) => (
          <g key={t.name}>
            <circle className="npsmap__pin npsmap__pin--ink" cx={t.x} cy={t.y} r="26" strokeWidth="6" />
            <text className="npsmap__num" x={t.x} y={t.y + 9} textAnchor="middle" style={{ fontSize: 28 }}>{i + 1}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Mirrored in edge/seo.js's "/tioga-opening" faq (the JSON-LD). Change both.
const TIOGA_FAQ = [
  ["When does Tioga Road open?", "There is no fixed date: the road opens when plow crews finish, and the park announces it only days ahead. The long-term average opening is the end of May; light snow years have opened in mid-May, and heavy years push the opening into June or later. It closes with the first lasting snow, typically in November."],
  ["Is there gas, food, or water on Tioga Road?", "Crane Flat, at the road's west end, has pay-at-pump gas; the next fuel is Lee Vining on the east side of the pass. In the early season there is no potable water and nothing to buy along the road, and services at Tuolumne Meadows come online weeks after the road opens. Bring everything."],
  ["How long does it take to drive Tioga Road?", "About 39 miles from Crane Flat to Tuolumne Meadows and about 47 to the Tioga Pass entrance station, roughly 90 minutes one way without stops. With Olmsted Point, Tenaya Lake, and Tuolumne Meadows it is a full day, and adding Lee Vining and Mono Lake makes it a long one."],
  ["Do I need a reservation to drive Tioga Road?", "A standard park entrance pass is required. Whether a day-use reservation system also applies changes year to year; check the NPS Yosemite site for the current season's rules before you commit."],
];

const TIOGA_TOWNS = [
  { id: "lee-vining", name: "Lee Vining", dest: "Lee Vining, California", where: "East side, below the pass", note: "The bed that exists in week one. Thirty minutes from Tuolumne Meadows, with gas, food and Mono Lake on the doorstep.", tier: "Week one" },
  { id: "groveland", name: "Groveland", dest: "Groveland, California", where: "Highway 120 west", note: "The western equivalent, on the same highway before the Big Oak Flat entrance. The start of the day if you drive the road west to east.", tier: "West side" },
];

function TiogaOpeningPage({ go }) {
  const toc = [
    ["#tioga-how", "How it opens"],
    ["#tioga-week-one", "Week one"],
    ["#tioga-road", "The road"],
    ["#tioga-history", "When it opened"],
    ["#tioga-rules", "Bring everything"],
    ["#tioga-day", "The day"],
    ["#tioga-stay", "Where to sleep"],
    ["#tioga-faq", "Questions"],
  ];

  return (
    <div className="page hp-tool hp-event hp-tioga-opening">
      <div className="ff-cover tg-cover">
        <ResponsiveImage image="img/tenaya-lake.jpg" eager className="ff-cover__img"
          alt="Tenaya Lake below the granite domes along Tioga Road" sizes="100vw" />
        <HpPageHead
          go={go}
          crumbs={[{ label: "Home", route: "home" }, { label: "Tioga opening" }]}
          eyebrow="HIGHWAY 120 · TIOGA PASS · LATE SPRING"
          title="The Tioga Road opening"
          intro="Every spring, plow crews cut Highway 120 out of the snowpack and the highest road in the park comes back. The opening date is not a date: it is announced only days ahead, it varies by weeks from year to year, and the first weekends are unlike any other time on the road. Below: how the opening works, what is actually open in week one, and how to drive it well."
          actions={<React.Fragment>
            <HomeLink go={go} location="tioga_head" className="hp-button" href="#tioga-week-one">What is open in week one <span>↓</span></HomeLink>
            <HomeLink go={go} location="tioga_head" className="hp-link" href="#tioga-road">The road, mile by mile ↓</HomeLink>
          </React.Fragment>}
        >
          <AffiliateDisclosure />
        </HpPageHead>
        <p className="ff-cover__credit">Photo: Michael Hogarth / Wikimedia Commons (public domain)</p>
      </div>

      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="calendar" /><dt>Opens, on average</dt><dd>{LONG_TERM_AVERAGE}</dd></div>
          <div><EventIcon name="alert" /><dt>Notice</dt><dd>Less than a week</dd></div>
          <div><EventIcon name="mountain" /><dt>Tioga Pass</dt><dd>9,945 feet</dd></div>
          <div><EventIcon name="fuel" /><dt>No gas</dt><dd>Crane Flat to Lee Vining</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {toc.map(([href, label]) => (
            <HomeLink key={href} go={go} location="tioga_toc" href={href}>{label}</HomeLink>
          ))}
        </nav>
      </div>

      {/* How the opening works. The live chip is read from bulletin.json's own
          Tioga row rather than written here, so it moves with each Guide
          edition instead of going stale between them; it renders nothing if
          the fetch does not land, and the short version stands without it. */}
      <section className="hp-wrap hp-section" id="tioga-how" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">HOW THE OPENING WORKS</p>
            <h2>The road opens when the plowing is done. Full stop.</h2>
            <p className="ff-lede">Tioga Road closes with the first lasting snow, typically in November, and reopens when the plowing is done. The long-term average opening is the end of May. Light snow years have opened the gate in mid-May; heavy years push the opening into June and beyond.</p>
            <p className="ff-lede">The park announces the date only once the crews are nearly through, usually with less than a week's notice, so a trip planned around "Tioga will be open" needs a backup plan below 8,000 feet.</p>
            <NatureNotesFilm
              id="winter-in-tuolumne-meadows"
              title="Winter in Tuolumne Meadows"
              youtubeId="tXAL7fPDaJE"
              episode={37}
              location="tioga_film"
              note="What the plows are digging out of: two rangers who ski the high country all winter, at 8,600 feet, while the road is under snow."
            />
          </div>
          <div className="tg-side">
            <TiogaStatus />
            <aside className="ff-short" aria-label="The short version">
              <p className="ff-short__head"><EventIcon name="alert" /> The short version</p>
              <ul>
                <li>The date is announced days ahead, not months.</li>
                <li>Opening day is the road, not the services.</li>
                <li>Start full at Crane Flat. Carry all the water and food.</li>
                <li>Expect snow walls, ice at dawn and no signal.</li>
              </ul>
              <p className="ff-disclosure">Current status: <a href="https://www.nps.gov/yose/planyourvisit/seasonal.htm" target="_blank" rel="noopener noreferrer">the NPS Tioga Road page ↗</a>, or text "ynptraffic" to 333111.</p>
            </aside>
          </div>
        </div>
      </section>

      {/* Week one. The difference between "the road is open" and "Tuolumne
          Meadows is open for the season" is the page's most useful fact, so
          it gets the ladder. Relative timings only: the actual dates move
          every season, and the article carries the dated version. */}
      <section className="ff-band" id="tioga-week-one" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="WHAT IS OPEN IN WEEK ONE" title="The road opens first. The meadows follow, weeks later." />
          <p className="ff-lede ff-lede--intro">Opening weekend lives entirely in "the road is open", not in "Tuolumne Meadows is open for the season". What you get in week one is the road itself: a ribbon of asphalt through snow walls, half-frozen lakes, and a high country still pulling itself out of winter. The store, the grill, the lodge, the campground and the wilderness center staffing come online over the following weeks, on their own schedule.</p>
          <ol className="ff-timeline tg-ladder">
            <li className="is-open"><span>Opening day</span><strong>The road</strong><p>Tioga Road and the Tioga Pass entrance station, Olmsted Point and the major pullouts, Tenaya Lake parking, the Tuolumne Meadows pullouts, vault toilets, and Crane Flat gas, 24 hours, pay at the pump.</p></li>
            <li className="is-tight"><span>Late May</span><strong>Visitor centers staffed</strong><p>The Tuolumne Meadows Visitor Center and Wilderness Center have limited or no staffing until late May.</p></li>
            <li className="is-tight"><span>June and July</span><strong>Lodge, grill, campground</strong><p>In a recent season the lodge opened in early June, the grill in mid-June, and the campground on July 1, reservable on Recreation.gov.</p></li>
            <li className="is-gone"><span>Later in summer</span><strong>Store and post office</strong><p>The last of Tuolumne to come online. Until then there is nothing to buy anywhere along the road.</p></li>
          </ol>
          <ul className="tg-never">
            <li><EventIcon name="drop" /><span><strong>No potable water</strong> anywhere along the road in week one.</span></li>
            <li><EventIcon name="fuel" /><span><strong>No gas at Tuolumne Meadows.</strong> The station has been out of operation for several years.</span></li>
            <li><EventIcon name="signal" /><span><strong>No cell service</strong> from Crane Flat to Lee Vining. Download offline maps in the Valley.</span></li>
          </ul>

          <div className="tg-stops">
            <div className="tg-stops__go">
              <h3>What the first weeks are for</h3>
              <p className="ff-note tg-stops__lede">The reliable early stops are the roadside ones. The early season rewards drivers, photographers and modest walkers, not peak-baggers.</p>
              <ul>
                <li><EventIcon name="eye" size={24} /><div><strong>Olmsted Point</strong><p>The back side of Half Dome. The half-mile slickrock trail usually dries fast, even with snow in the shaded hollows.</p></div></li>
                <li><EventIcon name="lake" size={24} /><div><strong>Tenaya Lake, the east beach</strong><p>Ice-rimmed, with open water in the middle. A short, easy walk to the sand; an hour is enough.</p></div></li>
                <li><EventIcon name="tree" size={24} /><div><strong>Tuolumne Meadows pullouts</strong><p>Look from the edge. Do not walk across the meadow: a boot print in May is still a scar in August.</p></div></li>
                <li><EventIcon name="dome" size={24} /><div><strong>Pothole Dome</strong><p>A one-mile round trip up polished granite at the meadow's west end. Wet approach, dry rock.</p></div></li>
                <li><EventIcon name="walk" size={24} /><div><strong>Soda Springs</strong><p>1.4 miles round trip on a flat dirt road from the Lembert Dome parking area, with the river running hard.</p></div></li>
              </ul>
            </div>
            <div className="tg-stops__wait">
              <h3>Wait for later</h3>
              <p className="ff-note tg-stops__lede">The famous trails above 8,500 feet hold snow weeks longer than the road. Walking them boots-deep is how meadows get scarred and ankles get broken.</p>
              <ul>
                {["Cathedral Lakes", "May Lake", "Lukens Lake", "Lembert Dome's summit"].map((t) => (
                  <li key={t}><EventIcon name="snow" size={20} />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="tioga-road" tabIndex={-1}>
        <HpHeading eyebrow="THE ROAD, WEST TO EAST" title="From 6,200 feet to 9,945, then down to the desert" />
        <p className="ff-lede ff-lede--intro">Tioga Road climbs from Crane Flat to the pass over roughly 47 miles, then drops more than 3,000 feet in twelve miles into the Mono Basin, where granite gives way to sagebrush. Allow about 90 minutes one way without stops. With the stops, it is a full day.</p>
        <figure className="npsmap tg-map">
          <TiogaRoadMap />
          <figcaption>
            {TIOGA_STOPS.map((t, i) => (
              <span key={t.name}><b>{i + 1}</b> {t.name}, {t.ft.toLocaleString("en-US")} ft{t.mi != null ? (t.mi === 0 ? "" : `, mile ${t.mi} from Crane Flat`) : ""}{t.note ? `. ${t.note}` : ""}</span>
            ))}
            <span>Above about 8,500 feet, trails hold snow for weeks after the road opens. There is no gas, water or cell signal between Crane Flat and Lee Vining. Elevations and distances are the figures on this page and in the opening-weekend article; White Wolf, Olmsted Point and Tenaya Lake are listed in order between the placed stops. Map: National Park Service (public domain), cropped.</span>
          </figcaption>
        </figure>
      </section>

      <section className="ff-band" id="tioga-history" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">WHEN IT HAS ACTUALLY OPENED</p>
            <h2>The average is the least useful number here</h2>
            <p className="ff-lede">The long-term average is {LONG_TERM_AVERAGE}, and almost no individual year matches it: the spread between a light year and a heavy one is measured in weeks, not days. These are the openings this journal has recorded.</p>
            <p className="ff-note">The National Park Service publishes the full year-by-year list on <a href="https://www.nps.gov/yose/planyourvisit/seasonal.htm" target="_blank" rel="noopener noreferrer">its Tioga Road page</a>, which is the source to check for the whole run.</p>
          </div>
          <div>
            <TiogaStrip />
            <div className="prose tg-table" role="region" aria-label="Recorded Tioga Road openings" tabIndex={0}>
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
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="tioga-rules" tabIndex={-1}>
        <div className="ff-split ff-split--end">
          <div>
            <p className="hp-eyebrow">THE SELF-SUFFICIENCY RULES</p>
            <h2>Pack like you are heading into the backcountry</h2>
          </div>
          <p className="ff-lede">Even if you are only driving up for the day. There is nothing to buy along Tioga Road in the first weeks, no potable water, and no signal to call for help with.</p>
        </div>
        <ul className="ff-rules tg-rules">
          <li><EventIcon name="fuel" size={26} /><strong>Gas</strong><p>Crane Flat is the last fuel on the west side, pay at the pump. The next gas is Lee Vining, on the far side of the pass. Start full.</p></li>
          <li><EventIcon name="drop" size={26} /><strong>Water and food</strong><p>In the early season there is no potable water and nothing to buy anywhere along the road. Bring all of both: two liters per person minimum if you are walking anywhere.</p></li>
          <li><EventIcon name="therm" size={26} /><strong>Weather</strong><p>Early-season mornings run to the 20s and 30s even when the Valley is mild. Black ice forms at dawn and dusk, and afternoon storms build fast.</p></li>
          <li><EventIcon name="signal" size={26} /><strong>Signal</strong><p>Cell service is essentially zero from Crane Flat to Lee Vining. Download offline maps before you leave the Valley.</p></li>
        </ul>
        <div className="ff-else tg-pack">
          <h3>In the car and the pack</h3>
          <ul>
            {[
              "Chains in the trunk and a full tank",
              "Waterproof hiking boots; every trail has wet or snowy sections",
              "Microspikes for any shaded snow patch",
              "Trekking poles for slush, mud and slick granite",
              "A puffy jacket and a shell; the day swings 30 to 40 degrees",
              "Sunglasses and sunscreen for snow glare at altitude",
              "All the water and food for the day",
              "Offline maps, downloaded in the Valley",
            ].map((k) => <li key={k}><EventIcon name="check" size={18} />{k}</li>)}
          </ul>
          <p className="ff-note">Bears are out of their dens and active in the meadows at first and last light. Use the trailhead lockers, even for snacks left in the car. The full lists: <HomeLink go={go} location="tioga_kit" href="/kit">the day pack and car kit</HomeLink>.</p>
        </div>
      </section>

      <section className="ff-band" id="tioga-day" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">THE BIGGER DAY</p>
            <h2>Cross the pass</h2>
            <p className="ff-lede">The move that turns the opening into a full trip is crossing the pass: down into the Mono Basin, where Mono Lake spreads out below with its tufa towers. Lee Vining, Tioga Lake, Ellery Lake and the South Tufa boardwalk make the east side a destination, not a turnaround.</p>
            <figure className="ff-photo">
              <ResponsiveImage image="img/tuolumne-meadows-lembert-dome.jpg" alt="Lembert Dome above the edge of Tuolumne Meadows" sizes="(max-width: 880px) calc(100vw - 40px), 520px" />
              <figcaption>Lembert Dome from Tuolumne Meadows. Photo: Pacific Southwest Region USFWS / Wikimedia Commons (public domain)</figcaption>
            </figure>
            <p className="ff-note">Every stop, where to eat in Lee Vining, and what the meadows look like under snowmelt: <HomeLink go={go} location="tioga_article" href="/articles/tioga-road-opening-weekend">the opening-weekend field guide</HomeLink>. Every turnout from Crane Flat to the pass, and the history under the road: <HomeLink go={go} location="tioga_article" href="/articles/tioga-road-stop-by-stop">Tioga Road, stop by stop</HomeLink>.</p>
          </div>
          <ol className="ff-hours">
            <li><span>Before 8 a.m.</span><p>Through the gate and climbing. Early beats the congestion and the full lots, and sunrise at Olmsted Point is shared with almost no one.</p></li>
            <li><span>Olmsted Point</span><p>Half Dome's broad back side, Clouds Rest to its left, and glacial erratics scattered on the slickrock. Shoes with grip, and sunglasses.</p></li>
            <li><span>Ten minutes east</span><p>Tenaya Lake's east beach, ice along the shaded shore and Tenaya Peak in the open water.</p></li>
            <li><span>Late morning</span><p>Tuolumne Meadows from the pullouts, then Pothole Dome or the flat walk to Soda Springs.</p></li>
            <li className="is-glow"><span>Tioga Pass, 9,945 feet</span><p>Tioga Lake just below the pass with Mount Dana in it, Ellery Lake a mile farther, then the Mono Lake Vista Point as the basin opens.</p></li>
            <li><span>Afternoon</span><p>Lunch in Lee Vining, then south on 395 to the South Tufa boardwalk, about ten miles all told. Nesting California gulls in May.</p></li>
            <li><span>The drive home</span><p>Back over the pass before dark, or a bed on the east side. Black ice returns at dusk.</p></li>
          </ol>
        </div>
      </section>

      {/* Where to sleep. Early-season Tioga is an east-side trip as often as a
          Valley one, and the in-park high-country beds open late and
          unpredictably. The filled button is only ever an Expedia town search,
          as on /firefall; both rows carry page_tioga with a per-town slug. */}
      <section className="hp-wrap hp-section" id="tioga-stay" tabIndex={-1}>
        <HpHeading eyebrow="WHERE YOU SLEEP IN WEEK ONE" title="The high country's own beds may not exist yet" />
        <p className="ff-lede ff-lede--intro">Tuolumne Meadows Lodge and White Wolf open on the snowpack's schedule, often well after the road does, so the high country's own beds may not be open when the pass is. Sleep at one end of the road and drive it toward the other.</p>
        <div className="ff-towns tg-towns">
          {TIOGA_TOWNS.map((t) => (
            <div className="ff-town" key={t.id}>
              <div className="ff-town__name">
                <h3>{t.name}</h3>
                <p><strong>{t.where}</strong></p>
              </div>
              <div className="ff-town__note">
                <span className="ff-tier">{t.tier}</span>
                <p>{t.note}</p>
              </div>
              <AvailabilityLink destination={t.dest} list="page_tioga" slug={t.id} className="ff-book">Search {t.name} lodging ↗</AvailabilityLink>
            </div>
          ))}
          <p className="ff-note">The filled buttons search availability on Expedia; we may earn a commission. The recommendation is the same either way, and no link is to a specific property. <a href="/affiliate">How we handle affiliate links.</a> Every option compared: <HomeLink go={go} location="tioga_stay" href="/stay">where to stay</HomeLink>.</p>
        </div>
      </section>

      <section className="ff-band" id="tioga-faq" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Tioga Road questions, answered</h2>
            <p className="ff-lede">The week's park-wide picture, roads, closures and hours, is on <HomeLink go={go} location="tioga_faq" href="/now">the Park Bulletin</HomeLink>, and live webcams and forecasts are on <HomeLink go={go} location="tioga_faq" href="/conditions">the conditions page</HomeLink>. Road conditions by phone or text: text "ynptraffic" to 333111.</p>
          </div>
          <div className="ff-faq">
            {TIOGA_FAQ.map(([q, a], i) => (
              <details key={q} open={i < 2}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <HpGuideBand
        go={go}
        location="tioga-opening"
        title="Planning the high-country trip around it?"
        intro="The Field Guide app carries the Tioga Road stops with parking notes, offline maps for the stretch with no signal, and a day-by-day planner for the rest of the trip."
        sample
      />
      <HpLetter
        eyebrow="ROAD ALERTS / FREE"
        title="Email me the day it opens"
        heading="Email me the day it opens"
        blurb="One email the day the park announces Tioga Road is open, and one when it closes for the season, sent to the people who asked for it. Sunday Field Notes carries the plowing progress in between."
        location="tioga-opening"
        tag="alert-tioga"
        cta="Email me ↗"
        terms="Only when Tioga Road opens or closes. Unsubscribe whenever."
        stamp="ROAD ALERTS"
        paper={<>Tioga opens.<br />Tioga closes.<br /><em>You hear once.</em></>}
      />
    </div>
  );
}

window.TiogaOpeningPage = TiogaOpeningPage;
