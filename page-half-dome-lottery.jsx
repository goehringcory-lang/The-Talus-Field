/* global React, NewsletterInline, Breadcrumbs, GuidePromo, LodgingCta */

// =============================================================================
// HALF DOME LOTTERY — `/half-dome-lottery` route. The third evergreen event
// page (MONETIZATION-IDEAS.md 4.3), following the /firefall pattern: a
// permanent URL for the park's most searched permit question, instead of a
// year-stamped slug that resets every March.
//
// This page is the whole thing. It used to be the short version, with the
// mechanics living in /articles/half-dome-permit-lottery-2026, and the two
// competed: Search Console showed the pair splitting 1,925 impressions and 9
// clicks, both stuck just below the fold and Google confidently picking
// neither. The article was retired into this page in August 2026 and 301s here
// (see REDIRECTS in edge/seo.js). Its content came with it, so nothing below
// may be trimmed on the assumption that a longer version exists elsewhere:
// this is the longer version.
//
// Standing commitment, amended in that merge: no copy on this page names a
// CURRENT year or promises anything about a season yet to happen, so it never
// needs re-slugging or a spring rewrite. Dated facts about seasons that have
// already happened are the exception and belong here, clearly labeled by
// season, because "what were the odds" is a question with a real answer and
// four of the queries this page ranks for ask it directly. The published
// statistics table is meant to grow a row per season, not to be rewritten.
//
// Anything that changes annually (dates, fees, rule changes) stays pointed at
// NPS and Recreation.gov rather than stated here.
// =============================================================================

// Published NPS lottery statistics, most recent season first. Every figure is
// from the NPS Half Dome permit statistics page cited in Sources; add a row
// when the park publishes the next season, and do not interpolate a season it
// has not published.
const LOTTERY_SEASONS = [
  {
    season: "2024",
    preseasonApps: "35,289",
    preseasonRate: "22%",
    dailyApps: "35,561",
    dailyRate: "19%",
    dailyWeekday: "22%",
    dailyWeekend: "14%",
  },
];

function HalfDomeLotteryPage({ go }) {
  const goArticle = (e, slug) => {
    e.preventDefault();
    go(`a:${slug}`);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "Half Dome lottery" }]} />
          <div className="eyebrow eyebrow--moss">Permit season · applications open in March</div>
          <h1>The Half Dome lottery</h1>
          <p className="page-head__dek">
            Most people think there is one Half Dome lottery, that it happens in
            March, and that losing it ends the year. All three are wrong. There
            are two lotteries, the second one runs every day the cables are up,
            and the strategy for each is different. This page is the honest
            version: the calendar, the published odds, the strategy, and what to
            do when the answer is no.
          </p>
        </div>
      </div>

      <div className="wrap wrap--narrow" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <section className="prose">
          <h2>The season</h2>
          <p>
            Half Dome has steel cables bolted into the granite for the last 400
            vertical feet of the climb. They typically go up the Friday before
            Memorial Day and come down the day after the second Monday in
            October, shifting with snow on the route, crew availability and
            weather. While they are up, a permit is required past the base of
            the subdome, not just on the cables themselves.
          </p>
          <p>
            The checkpoint sits at the base of the subdome steps, staffed by
            rangers who check the permit, a government-issued photo ID and the
            confirmation email. Everyone in the group has to be there together.
            A maximum of 300 hikers a day go through: roughly 225 day hikers via
            the two lotteries below, and 75 backpackers via the separate
            wilderness permit system. If your trip is an overnight that includes
            Half Dome, you want a wilderness permit with the Half Dome add-on,
            not a day-hiker lottery permit.
          </p>
          <p>
            No permit means you turn around, and this is federal law rather than
            a suggestion: ascending the subdome or the cables without one
            violates 36 CFR 1.6 and carries a fine of up to $5,000 and up to six
            months in jail. Rangers check every group. The lotteries stay
            lotteries.
          </p>

          <h2>Two lotteries, not one</h2>
          <ol>
            <li>
              <strong>The preseason lottery.</strong> Applications on
              Recreation.gov through the month of March (Eastern time), results
              emailed in mid-April. Up to six people and seven ranked date
              choices per application, one application per person, and an
              alternate trip leader you can only name during the window.
            </li>
            <li>
              <strong>The daily lottery.</strong> The one almost nobody talks
              about, running every day the cables are up. Apply on
              Recreation.gov two days before your hike date, between midnight
              and 4 p.m. Pacific; results arrive late that evening. It
              distributes the permits preseason winners cancel or fail to use,
              and in the most recent season the park has published it drew more
              applications than the preseason lottery itself.
            </li>
          </ol>
          <p>
            Both charge a non-refundable application fee per application, not
            per person, plus a per-person recreation fee if you win. Current
            amounts are on the NPS permit page linked below; in the 2024 season
            both were $10, so a group of four that applied and won paid $50 in
            total.
          </p>

          <h2>What the preseason application asks for</h2>
          <p>
            <strong>Group size.</strong> Up to six people on one application.
            Everyone hikes together, and the permit holder or the alternate has
            to be at the checkpoint with the whole group.
          </p>
          <p>
            <strong>Date choices.</strong> Up to seven dates or date ranges,
            ranked. The system tries your highest-preference date first and
            works down the list, so the order genuinely matters.
          </p>
          <p>
            <strong>Permit holder and alternate.</strong> Name both. One of the
            two must be physically present with a photo ID matching the permit.
            An alternate can only be added during the application window, and
            they have to hold a Recreation.gov account and accept the role
            within 72 hours of being added. Miss that and they are not on the
            permit. Once the window closes, neither name can be changed.
          </p>
          <p>
            <strong>One application per person.</strong> Each person can appear
            as holder or alternate on exactly one preseason application. Show up
            on two and all of them are cancelled without a refund.
          </p>

          <h2>The published odds</h2>
          <p>
            These are the National Park Service's own figures for the seasons it
            has published. Read the application rate, not the date-choice rate,
            as your odds of hiking: most applications list several dates and
            only one of them can be filled.
          </p>
          <table>
            <thead>
              <tr>
                <th>Season</th>
                <th>Preseason applications</th>
                <th>Preseason success</th>
                <th>Daily applications</th>
                <th>Daily success</th>
                <th>Daily, weekday</th>
                <th>Daily, weekend</th>
              </tr>
            </thead>
            <tbody>
              {LOTTERY_SEASONS.map((s) => (
                <tr key={s.season}>
                  <td><strong>{s.season}</strong></td>
                  <td>{s.preseasonApps}</td>
                  <td>{s.preseasonRate}</td>
                  <td>{s.dailyApps}</td>
                  <td>{s.dailyRate}</td>
                  <td>{s.dailyWeekday}</td>
                  <td>{s.dailyWeekend}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            The spread inside those averages is where the strategy lives.
            Saturday is the most requested day of the week, drawing about 21% of
            all preseason applications in 2024. Weekday odds in the daily
            lottery ran roughly half again better than weekend odds that season,
            22% against 14%, and late-season weekdays, late August through the
            October takedown, are the best draw of the year. Counted by
            individual date choice rather than by application, the preseason
            numbers look far worse, about 1.0% for a weekday choice and 0.8% for
            a weekend one, which is the same fact stated a different way.
          </p>

          <h2>What actually works</h2>
          <ol>
            <li>
              <strong>Use all seven date choices</strong> in the preseason
              application, and front-load the unpopular ones: a Tuesday in
              September as your first choice beats a Saturday in July. One fixed
              date means you get the published odds and nothing better; seven
              spread across the season is seven rolls inside one application.
            </li>
            <li>
              <strong>Enter both lotteries.</strong> Plan the trip so the hike
              falls mid-visit rather than on day one, then run the daily lottery
              every eligible day. Each draw is independent, so five weekday
              attempts at roughly one-in-five odds work out to about a two in
              three chance of winning at least once.
            </li>
            <li>
              <strong>Avoid Saturday.</strong> Sunday is second worst. Tuesday
              through Thursday are the least competitive days in both lotteries.
            </li>
            <li>
              <strong>Split groups larger than six</strong> across two
              applications with two different permit holders; they are entered
              independently. Name an alternate on every preseason application,
              and have them accept the role before the window closes, or a sick
              permit holder on hike day ends the trip for everyone.
            </li>
            <li>
              <strong>Have the no-permit plan ready.</strong> A wilderness
              permit through Little Yosemite Valley can carry a Half Dome add-on
              from a separate allocation, and Clouds Rest, higher than Half Dome
              with a bigger view and no permit at all, is the better hike for
              most people anyway.
            </li>
          </ol>

          <h2>If you win</h2>
          <p>
            Download or print the confirmation email before you leave the
            Valley. Cell service is unreliable at the subdome checkpoint, around
            8,000 feet on the trail, and the permit is valid for a single day,
            midnight to 11:59 p.m., with no multi-day option for day hikers.
            Bring the photo ID that matches the name on it.
          </p>
          <p>
            Start at Happy Isles before dawn. The hike is 14 to 16 miles round
            trip with 4,800 feet of gain and takes most people 10 to 12 hours,
            so a 5 a.m. start, earlier if you can, is what gets you up and down
            before afternoon thunderstorms. Set a turnaround time and keep it:
            not on the summit by 3:30 p.m. means turn around, whatever the day
            has cost you. You do not want to be on the cables in a lightning
            storm, or coming down{" "}
            <a href="/articles/mist-trail-the-real-guide" onClick={(e) => goArticle(e, "mist-trail-the-real-guide")}>
              the Mist Trail
            </a>{" "}
            in the dark without a headlamp.
          </p>
          <p>
            Watch the forecast obsessively in the days before. Nearly every
            fatal fall from the cables has happened on wet rock. If rain is
            coming, cancel: the per-person recreation fee is fully refundable
            until 11:59 p.m. Pacific the day before your date, and refundable
            outright if the cables are not up. Sunk cost is a bad reason to be
            on wet granite at 45 degrees.
          </p>

          <h2>If you do not win</h2>
          <p>
            <strong>Run the daily lottery every day of the trip.</strong> Each
            application is an independent chance, and five eligible weekday
            mornings is a genuinely good position to be in.
          </p>
          <p>
            <strong>Do not go anyway.</strong> Rangers are at the checkpoint,
            they check every group, and the citation follows you home.
          </p>
          <p>
            <strong>Consider the backpacker route.</strong> A wilderness permit
            for a trip through Little Yosemite Valley can carry a Half Dome
            add-on from an allocation the day-hiker lottery does not touch. It
            means an overnight, a bear canister and wilderness gear, but it is a
            legitimate path to the cables. Apply through{" "}
            <a href="/articles/yosemite-wilderness-permits-guide" onClick={(e) => goArticle(e, "yosemite-wilderness-permits-guide")}>
              the wilderness permit system
            </a>
            , not this lottery.
          </p>
          <p>
            <strong>Hike Clouds Rest instead.</strong> The summit is 9,926 feet,
            more than a thousand feet higher than Half Dome, with no permit
            required and bigger views in every direction. On a Tuesday in June
            you might have it to yourself.
          </p>
          <p>
            <strong>Come back late season, midweek.</strong> The best daily
            lottery odds of the year are weekdays in September and early
            October: the cables are still up, the crowds have thinned and the
            fall light is extraordinary.
          </p>

          <h2>Fees, cancellation and the fine print</h2>
          <p>
            The application fee is non-refundable in every case; it is the cost
            of entering. The per-person recreation fee is refundable if you
            cancel by 11:59 p.m. Pacific the day before your hike date, or if
            the cables are not up on your date, which happens with early-season
            snow and late-season weather. Cancel or reduce group size through
            the Recreation.gov account or by phone.
          </p>
          <p>
            In the daily lottery there is no alternate, only a permit holder,
            and a win charges the card on file automatically. A declined card
            forfeits the permit. Permits cannot be resold or auctioned, and any
            attempt to resell one voids it. A day-hiker permit includes no
            camping anywhere along the route.
          </p>
        </section>

        {/* The live layer: rules and fees change annually; the sources don't. */}
        <div style={{ marginTop: 48 }}>
          <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The current year's rules</div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)" }}>
            Dates, fees, and any rule changes for the current season:{" "}
            <a href="https://www.nps.gov/yose/planyourvisit/hdpermits.htm" target="_blank" rel="noopener noreferrer">the NPS Half Dome permits page</a>{" "}
            and{" "}
            <a href="https://www.recreation.gov/permits/234652" target="_blank" rel="noopener noreferrer">the Recreation.gov lottery page</a>.
            The wilderness office answers permit questions at 209-372-0826, weekday mornings and afternoons in season.
            The week's park-wide picture is on{" "}
            <a href="/now" onClick={(e) => { e.preventDefault(); go("now"); }}>the Park Bulletin</a>.
          </p>
        </div>

        <section className="prose" style={{ marginTop: 48 }}>
          <h2>Related reading</h2>
          <p>
            Before you decide the cables are the goal at all, read{" "}
            <a href="/articles/so-you-want-to-hike-half-dome" onClick={(e) => goArticle(e, "so-you-want-to-hike-half-dome")}>
              So You Want to Hike Half Dome
            </a>
            , which includes the case for Clouds Rest. The approach is{" "}
            <a href="/articles/mist-trail-the-real-guide" onClick={(e) => goArticle(e, "mist-trail-the-real-guide")}>
              the Mist Trail
            </a>
            , and every other permit the park runs is in{" "}
            <a href="/articles/yosemite-wilderness-permits-guide" onClick={(e) => goArticle(e, "yosemite-wilderness-permits-guide")}>
              the wilderness permits guide
            </a>
            . If you arrived without any permit at all, there is{" "}
            <a href="/articles/yosemite-walk-up-and-day-of-permits" onClick={(e) => goArticle(e, "yosemite-walk-up-and-day-of-permits")}>
              a guide to walk-up and day-of permits
            </a>
            . Gear lives in{" "}
            <a href="/kit" onClick={(e) => { e.preventDefault(); go("kit"); }}>the day pack list</a>:
            the short version is a gallon of water, grippy gloves you pack back
            out, a headlamp, and a hard turnaround time.
          </p>
          <h3>Sources</h3>
          <ul style={{ fontSize: 14 }}>
            <li><a href="https://www.nps.gov/yose/planyourvisit/hdpermits.htm" target="_blank" rel="noopener noreferrer">Half Dome Permits, NPS</a></li>
            <li><a href="https://www.recreation.gov/permits/234652" target="_blank" rel="noopener noreferrer">Half Dome Permits, Recreation.gov</a></li>
            <li><a href="https://www.nps.gov/yose/planyourvisit/hdpermitsapps.htm" target="_blank" rel="noopener noreferrer">Half Dome Permit Lottery Statistics, NPS</a></li>
          </ul>
        </section>

        {/* A permit day is a pre-dawn start after a 14-to-16-hour day, which
            makes the night before and the night after a real planning
            problem, not an afterthought. */}
        <LodgingCta
          destination="Yosemite National Park"
          heading="The night before, and the night after"
          note="The hike wants a pre-dawn start and gives back a fourteen-to-sixteen-hour day. Driving in from Oakhurst at 3 a.m. and back out at 10 p.m. is how a permit gets wasted. A bed in the Valley or in El Portal is the difference, and the permit date is known far enough ahead to book one."
          list="page_half_dome"
          slug="half-dome-lottery"
          cta="Search lodging near the trailhead →"
        />

        {/* The purchase ask: a lottery reader is planning the whole trip
            around one permit day, usually months out. */}
        <GuidePromo
          go={go}
          location="half-dome-lottery"
          title="Planning the trip around a permit day?"
          body="The Field Guide app carries the trailhead parking notes, offline maps for a park with no signal, and a day-by-day planner that flexes when the lottery says Tuesday instead of Saturday. One purchase, eighteen months of access."
          style={{ marginTop: 56, marginBottom: 40 }}
        />

        <NewsletterInline
          location="half-dome-lottery"
          tag="half-dome-lottery"
          heading="The permit calendar, in your inbox"
          blurb="Sunday Field Notes flags the lottery calendar as it comes: when the March window opens, when results land, and when the late-season odds turn favorable. One short letter a week. Free."
        />
      </div>
    </div>
  );
}

window.HalfDomeLotteryPage = HalfDomeLotteryPage;
