/* global React, NewsletterInline, Breadcrumbs, GuidePromo, LodgingCta */

// =============================================================================
// DISTANCES — `/distances` route. The drive-time matrix.
//
// Why this page exists. The gateway-towns article ranks in the top three for
// the pure-distance queries ("groveland to yosemite" at 3.2, "oakhurst to
// yosemite" at 2.8) and earns zero clicks on them, because the answer is one
// number and the search result already shows it. You cannot win that click
// with prose. You can win it by holding something a snippet cannot: the whole
// matrix at once, so a reader comparing two towns, or checking whether a base
// works for both the Valley and the Grove, has to open the page.
//
// SOURCING. Every figure here is quoted from the published body of
// /articles/yosemite-gateway-towns-compared, which is the canonical source for
// the site's drive times. Do not add a row from memory or from a maps app: an
// invented number here contradicts the article and both of them are wrong from
// then on. Where the article gives a range, keep the range; where it does not
// give a pair at all, the cell says so rather than guessing.
//
// The same numbers are mirrored in page-stay.jsx's GATEWAYS and in edge/seo.js's
// /stay hub prose. Those three drifted once (El Portal read 25 to 30 in two of
// them and 25 to 35 in the article) and were reconciled to the article in
// August 2026. Change the article first, then all three.
// =============================================================================

// Distance to Yosemite Valley, from each gateway town. Quoted from the article's
// per-town stat blocks.
const TO_VALLEY = [
  { town: "El Portal", miles: "about 14", time: "25 to 35 min", highway: "140", season: "Year-round", elevation: "about 1,900 ft" },
  { town: "Mariposa", miles: "about 45", time: "45 to 60 min", highway: "140", season: "Year-round", elevation: "about 2,000 ft" },
  { town: "Groveland", miles: "about 41", time: "65 to 80 min", highway: "120", season: "Chain controls common in winter", elevation: "about 3,100 ft" },
  { town: "Oakhurst", miles: "about 50", time: "75 to 90 min", highway: "41", season: "Year-round", elevation: "about 2,300 ft" },
  { town: "Lee Vining", miles: "about 75", time: "90 min minimum", highway: "120 East over Tioga Pass", season: "Only while Tioga Pass is open", elevation: "about 6,800 ft" },
];

// The pairings the article states outright. A town with no published figure for
// a destination gets an honest blank rather than an estimate.
const OTHER_LEGS = [
  { from: "Oakhurst", to: "South Entrance", detail: "about 14 miles, 20 to 25 minutes. The Mariposa Grove welcome plaza is immediately inside the gate; Wawona itself is another six miles on." },
  { from: "Groveland", to: "Big Oak Flat Entrance", detail: "about 24 miles, 30 to 40 minutes on a winding road." },
  { from: "Lee Vining", to: "Tuolumne Meadows", detail: "about 20 miles, 30 minutes, while Tioga Pass is open." },
  { from: "Lee Vining", to: "Mono Lake", detail: "about 5 minutes to the visitor center, 15 to the South Tufa boardwalk." },
  { from: "El Portal", to: "Arch Rock Entrance", detail: "the entrance El Portal mornings start on, and the reason the town's drive is the shortest of the five." },
];

function DistancesPage({ go }) {
  const goArticle = (e, slug) => {
    e.preventDefault();
    go(`a:${slug}`);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "Distances" }]} />
          <div className="eyebrow eyebrow--moss">Drive times</div>
          <h1>How far is Yosemite from anywhere?</h1>
          <p className="page-head__dek">
            Every gateway town, its drive to Yosemite Valley, the entrance it
            uses, and what the season does to it. The numbers are the ones from
            the gateway towns guide, in one table, so you can compare two towns
            instead of looking up one.
          </p>
        </div>
      </div>

      <div className="wrap wrap--narrow" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <section className="prose">
          <h2>Gateway towns to Yosemite Valley</h2>
          <p>
            Drive times are to the west end of Yosemite Valley in ordinary
            conditions. Add 15 to 20 minutes to reach Curry Village at the east
            end, and add more than you think for summer afternoons, when the
            Valley loop road is the slowest few miles of the trip.
          </p>
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>Miles to the Valley</th>
                <th>Drive time</th>
                <th>Highway</th>
                <th>Season</th>
                <th>Town elevation</th>
              </tr>
            </thead>
            <tbody>
              {TO_VALLEY.map((r) => (
                <tr key={r.town}>
                  <td><strong>{r.town}</strong></td>
                  <td>{r.miles} miles</td>
                  <td>{r.time}</td>
                  <td>{r.highway}</td>
                  <td>{r.season}</td>
                  <td>{r.elevation}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>The other legs worth knowing</h2>
          <p>
            The Valley is not the only destination, and for some trips it is not
            even the main one. A base that is far from the Valley can be close to
            the thing you actually came for.
          </p>
          <ul>
            {OTHER_LEGS.map((l) => (
              <li key={`${l.from}-${l.to}`}>
                <strong>{l.from} to {l.to}:</strong> {l.detail}
              </li>
            ))}
          </ul>
          <p>
            Oakhurst is the clearest case. It is the longest drive to the Valley
            of the four year-round towns, and the shortest to the Mariposa Grove
            by a wide margin. If the sequoias are the trip, the table above is
            reading the wrong destination.
          </p>

          <h2>What the numbers do not say</h2>
          <p>
            <strong>Season changes the answer more than distance does.</strong>{" "}
            Lee Vining is 75 miles from the Valley for roughly half the year and
            unreachable from it for the other half, because Tioga Pass closes.
            Groveland is a thousand feet higher than the Highway 140 towns and
            gets chain controls they do not. The Highway 140 corridor through
            Mariposa and El Portal is the lowest and most reliable route in, and
            in a bad winter that matters more than any of the mileages here. The
            full picture is in{" "}
            <a href="/tioga-opening">the Tioga Road opening page</a> and in{" "}
            <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>current conditions</a>.
          </p>
          <p>
            <strong>Entrance queues are not drive time.</strong> On a peak
            summer morning the wait at a gate can add half an hour that no
            mileage predicts. Live entrance waits are on{" "}
            <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>the conditions page</a>.
          </p>
          <p>
            <strong>Once you are in, you are still driving.</strong> The Valley
            to Glacier Point is roughly an hour when the road is open, the Valley
            to Tuolumne Meadows is an hour and a half, and Hetch Hetchy is a dead
            end that serves no through route. A day that crosses the park is a
            driving day, which is the thing most itineraries get wrong.
          </p>

          <h2>So which town?</h2>
          <p>
            Distance is one input and usually not the deciding one. What a town
            has, what it costs, what it is like in winter, and which part of the
            park it opens onto matter more than fifteen minutes of highway. That
            argument is the whole of{" "}
            <a href="/articles/yosemite-gateway-towns-compared" onClick={(e) => goArticle(e, "yosemite-gateway-towns-compared")}>
              the gateway towns comparison
            </a>
            , which is where these numbers come from. The lodging itself is on{" "}
            <a href="/stay" onClick={(e) => { e.preventDefault(); go("stay"); }}>the where-to-stay page</a>, and
            what a trip costs is in{" "}
            <a href="/articles/yosemite-trip-cost-budget-2026" onClick={(e) => goArticle(e, "yosemite-trip-cost-budget-2026")}>
              the budget breakdown
            </a>
            . If you are coming from further out, <a href="/articles/getting-to-yosemite" onClick={(e) => goArticle(e, "getting-to-yosemite")}>getting to Yosemite</a>{" "}
            covers the airports and the long approaches.
          </p>
        </section>

        <LodgingCta
          destination="Yosemite National Park"
          heading="Book the drive you want"
          note="The difference between a 25-minute morning and a 90-minute one is decided months earlier, when you pick the town. Availability moves fastest for the closest beds."
          list="page_distances"
          slug="distances"
          cta="Search lodging by town →"
        />

        <GuidePromo
          go={go}
          location="distances"
          title="The drive is only the first part"
          body="The Field Guide app carries the trailhead parking notes, offline maps for a park with no cell service, and a day planner that knows how long it really takes to cross the park. One purchase, eighteen months of access."
          style={{ marginTop: 56, marginBottom: 40 }}
        />

        <NewsletterInline
          location="distances"
          tag="distances"
          heading="Road status, Sundays"
          blurb="Tioga and Glacier Point open late and close early, and chain controls arrive without much notice. One short letter a week with what the roads are doing. Free."
        />
      </div>
    </div>
  );
}

window.DistancesPage = DistancesPage;
