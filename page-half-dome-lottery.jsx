/* global React, HpPageHead, HpHeading, HomeLink, ResponsiveImage, AvailabilityLink, HpGuideBand, HpLetter, FjPull, AffiliateDisclosure, EventIcon, NatureNotesFilm */

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
//
// The September 2026 visual pass rebuilt it on /firefall's system (the
// `.hp-event` class, the `.ff-*` layout rules, EventIcon) without dropping a
// sentence: every paragraph above the pass is still on the page, regrouped
// into sections a reader can scan. Four pictures carry what the prose argues:
// the daily cap split (HdCap), the season calendar (HdSeason), the published
// odds (LotteryOdds, unchanged), and the arithmetic of repeated daily
// entries (HdTries). Each reads numbers the page already states; HdTries
// computes 1 - (1 - p)^n from the published weekday rate, which is the page's
// own "about a two in three chance" worked out one entry at a time.
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

// The published odds, drawn: a hundred applications as a ten-by-ten field of
// dots, the winners filled. Reads the same LOTTERY_SEASONS row the table
// prints, so the two cannot disagree; the table stays the accessible record
// and this figure is hidden from assistive tech.
function LotteryOdds({ season }) {
  const draws = [
    { label: "Preseason lottery", rate: season.preseasonRate },
    { label: "Daily lottery, weekday", rate: season.dailyWeekday },
    { label: "Daily lottery, weekend", rate: season.dailyWeekend },
  ];
  return (
    <figure className="hd-odds" aria-hidden="true">
      <p className="hp-eyebrow fj-chart-title">The published odds, {season.season} season</p>
      <div className="hd-odds__grids">
        {draws.map((d) => {
          const n = parseInt(d.rate, 10) || 0;
          return (
            <div key={d.label} className="hd-odds__draw">
              <div className="hd-odds__dots">
                {Array.from({ length: 100 }, (_, i) => <i key={i} className={i < n ? "is-won" : undefined} />)}
              </div>
              <strong>{d.rate}</strong>
              <span>{d.label}</span>
            </div>
          );
        })}
      </div>
      <figcaption>Of every hundred applications in the {season.season} season, the filled dots drew a permit. National Park Service figures.</figcaption>
    </figure>
  );
}

// The daily cap as the page states it: 300 through the checkpoint, roughly 225
// day hikers from the two lotteries and 75 backpackers from the wilderness
// permit system.
function HdCap() {
  return (
    <figure className="hd-cap">
      <p className="hp-eyebrow fj-chart-title">Through the subdome checkpoint, each day the cables are up</p>
      <div className="hd-cap__bar" role="img" aria-label="A maximum of 300 hikers a day: roughly 225 day hikers through the two lotteries and 75 backpackers through the wilderness permit system.">
        <span className="hd-cap__day" style={{ flexBasis: "75%" }}><b>~225</b> day hikers<small>The two lotteries on this page</small></span>
        <span className="hd-cap__wild" style={{ flexBasis: "25%" }}><b>75</b> backpackers<small>Wilderness permits</small></span>
      </div>
      <p className="ff-note">300 a day in all. An overnight that includes Half Dome wants a wilderness permit with the Half Dome add-on, not a lottery permit.</p>
    </figure>
  );
}

// The season on one axis, March to October. Positions are by month, and the
// two cable dates are drawn as the rule the page states (the Friday before
// Memorial Day, the day after the second Monday in October), not as a year's
// dates.
const HD_MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
function HdSeason() {
  const W = 1000, L = 20, R = 20, col = (W - L - R) / 8;
  const x = (m) => L + m * col; // m in months from March 1
  const rows = [
    { y: 70, from: 0, to: 1, cls: "hd-season__bar--apply", label: "Preseason applications: all of March, Eastern time" },
    { y: 118, from: 1.4, to: 1.62, cls: "hd-season__bar--result", label: "Results by email, mid-April" },
    { y: 166, from: 2.78, to: 7.45, cls: "hd-season__bar--cables", label: "Cables up: Friday before Memorial Day to the day after the second Monday in October" },
    { y: 214, from: 2.78, to: 7.45, cls: "hd-season__bar--daily", label: "Daily lottery: every day the cables are up" },
    { y: 262, from: 5.7, to: 7.45, cls: "hd-season__bar--best", label: "Best odds of the year: late-season weekdays" },
  ];
  return (
    <svg className="hd-season__svg" viewBox={`0 0 ${W} 300`} role="img"
      aria-label="The Half Dome permit season, March to October. Preseason lottery applications run through all of March, Eastern time. Results arrive by email in mid-April. The cables typically go up the Friday before Memorial Day and come down the day after the second Monday in October. The daily lottery runs every day the cables are up. The best odds of the year are weekdays from late August through the October takedown.">
      {HD_MONTHS.map((m, i) => (
        <g key={m}>
          <line x1={x(i)} x2={x(i)} y1={30} y2={286} className="hd-season__grid" />
          <text x={x(i) + col / 2} y={20} textAnchor="middle" className="hd-season__month">{m}</text>
        </g>
      ))}
      <line x1={x(8)} x2={x(8)} y1={30} y2={286} className="hd-season__grid" />
      {rows.map((r) => (
        <g key={r.label}>
          <rect x={x(r.from)} y={r.y - 22} width={x(r.to) - x(r.from)} height={16} rx="3" className={"hd-season__bar " + r.cls} />
          <text x={r.from > 4 ? x(r.to) : x(r.from)} y={r.y + 12} textAnchor={r.from > 4 ? "end" : "start"} className="hd-season__label">{r.label}</text>
        </g>
      ))}
    </svg>
  );
}

// Five daily-lottery entries at the published weekday rate. Each draw is
// independent, so the chance of at least one win after n entries is
// 1 - (1 - p)^n. The page's own sentence is the n = 5 bar.
function HdTries({ rate }) {
  const p = (parseInt(rate, 10) || 0) / 100;
  const tries = [1, 2, 3, 4, 5].map((n) => ({ n, v: 1 - Math.pow(1 - p, n) }));
  return (
    <figure className="hd-tries">
      <p className="hp-eyebrow fj-chart-title">Chance of at least one win, daily lottery, weekday entries at {rate}</p>
      <ol className="hd-tries__bars" aria-label={tries.map((t) => `${t.n} ${t.n === 1 ? "entry" : "entries"}: about ${Math.round(t.v * 100)}%`).join("; ")}>
        {tries.map((t) => (
          <li key={t.n}>
            <span className="hd-tries__track"><span className="hd-tries__fill" style={{ height: `${Math.round(t.v * 100)}%` }} /></span>
            <b>{Math.round(t.v * 100)}%</b>
            <small>{t.n} {t.n === 1 ? "entry" : "entries"}</small>
          </li>
        ))}
      </ol>
      <figcaption className="ff-note">Each draw is independent, so the chances compound: at the published {rate}, five weekday entries come to about {Math.round(tries[4].v * 100)}%, a little better than the two in three that the one-in-five rule of thumb gives. Worked from the National Park Service's published weekday rate; an individual season can run better or worse.</figcaption>
    </figure>
  );
}

function HalfDomeLotteryPage({ go }) {
  const season = LOTTERY_SEASONS[0];
  const toc = [
    ["#hd-season", "The season"],
    ["#hd-lotteries", "Two lotteries"],
    ["#hd-application", "The application"],
    ["#hd-odds", "The odds"],
    ["#hd-strategy", "What works"],
    ["#hd-win", "If you win"],
    ["#hd-lose", "If you do not"],
    ["#hd-fine-print", "Fine print"],
  ];

  return (
    <div className="page hp-tool hp-event hp-half-dome-lottery">
      <div className="ff-cover hd-cover">
        <ResponsiveImage image="img/half-dome-alpenglow-madhu-shesharam.jpg" eager className="ff-cover__img"
          alt="Half Dome glowing in alpenglow above Tenaya Canyon" sizes="100vw" />
        <HpPageHead
          go={go}
          crumbs={[{ label: "Home", route: "home" }, { label: "Half Dome lottery" }]}
          eyebrow="PERMIT SEASON · APPLICATIONS OPEN IN MARCH"
          title="The Half Dome lottery"
          intro="Most people think there is one Half Dome lottery, that it happens in March, and that losing it ends the year. All three are wrong. There are two lotteries, the second one runs every day the cables are up, and the strategy for each is different. This page is the honest version: the calendar, the published odds, the strategy, and what to do when the answer is no."
          actions={<React.Fragment>
            <HomeLink go={go} location="half_dome_head" className="hp-button" href="#hd-lotteries">The two lotteries <span>↓</span></HomeLink>
            <HomeLink go={go} location="half_dome_head" className="hp-link" href="#hd-odds">The published odds ↓</HomeLink>
          </React.Fragment>}
        >
          <AffiliateDisclosure />
        </HpPageHead>
        <p className="ff-cover__credit">Photo: Madhu Shesharam / Unsplash</p>
      </div>

      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="dome" /><dt>Cables</dt><dd>Last 400 vertical feet</dd></div>
          <div><EventIcon name="users" /><dt>Daily cap</dt><dd>300 hikers</dd></div>
          <div><EventIcon name="ticket" /><dt>Lotteries</dt><dd>Two: March, and daily</dd></div>
          <div><EventIcon name="route" /><dt>Round trip</dt><dd>14 to 16 miles</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {toc.map(([href, label]) => (
            <HomeLink key={href} go={go} location="half_dome_toc" href={href}>{label}</HomeLink>
          ))}
        </nav>
      </div>

      <section className="hp-wrap hp-section" id="hd-season" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE SEASON</p>
            <h2>A permit for the last 400 feet</h2>
            <p className="ff-lede">Half Dome has steel cables bolted into the granite for the last 400 vertical feet of the climb. They typically go up the Friday before Memorial Day and come down the day after the second Monday in October, shifting with snow on the route, crew availability and weather. While they are up, a permit is required past the base of the subdome, not just on the cables themselves.</p>
            <p className="ff-lede">The checkpoint sits at the base of the subdome steps, staffed by rangers who check the permit, a government-issued photo ID and the confirmation email. Everyone in the group has to be there together.</p>
            <NatureNotesFilm
              id="half-dome"
              title="Half Dome"
              youtubeId="ihNpkUp5JdM"
              episode={4}
              location="half_dome_film"
              note="The rock, the cables and the climb, from the Park Service's own film series: what the permit is for, before you spend March trying to get one."
            />
          </div>
          <div className="hd-side">
            <HdCap />
            <aside className="ff-short hd-law" aria-label="No permit, no summit">
              <p className="ff-short__head"><EventIcon name="no" /> No permit means you turn around</p>
              <p>This is federal law rather than a suggestion: ascending the subdome or the cables without one violates 36 CFR 1.6 and carries a fine of up to $5,000 and up to six months in jail. Rangers check every group. The lotteries stay lotteries.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="ff-band" id="hd-lotteries" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="TWO LOTTERIES, NOT ONE" title="March is the first chance, not the only one" />
          <div className="hd-pair">
            <article className="hd-lottery">
              <p className="hp-eyebrow"><EventIcon name="calendar" size={18} /> THE PRESEASON LOTTERY</p>
              <h3>Apply in March</h3>
              <p>Applications on Recreation.gov through the month of March (Eastern time), results emailed in mid-April. Up to six people and seven ranked date choices per application, one application per person, and an alternate trip leader you can only name during the window.</p>
              <dl>
                <div><dt>Window</dt><dd>All of March, Eastern time</dd></div>
                <div><dt>Results</dt><dd>By email, mid-April</dd></div>
                <div><dt>Group</dt><dd>Up to six</dd></div>
                <div><dt>Dates</dt><dd>Up to seven, ranked</dd></div>
                <div><dt>Alternate</dt><dd>Named only during the window</dd></div>
              </dl>
            </article>
            <article className="hd-lottery hd-lottery--daily">
              <p className="hp-eyebrow"><EventIcon name="clock" size={18} /> THE DAILY LOTTERY</p>
              <h3>Apply two days out, all season</h3>
              <p>The one almost nobody talks about, running every day the cables are up. Apply on Recreation.gov two days before your hike date, between midnight and 4 p.m. Pacific; results arrive late that evening. It distributes the permits preseason winners cancel or fail to use, and in the most recent season the park has published it drew more applications than the preseason lottery itself.</p>
              <ol className="hd-clock">
                <li><span>Two days before</span><strong>Apply, midnight to 4 p.m. Pacific</strong></li>
                <li><span>That evening</span><strong>Results arrive, late</strong></li>
                <li><span>Hike day</span><strong>The permit is good midnight to 11:59 p.m.</strong></li>
              </ol>
            </article>
          </div>
          <figure className="hd-season">
            <HdSeason />
            <figcaption className="ff-note">The season as the rules describe it, not a given year's dates. The park posts each season's dates on its permit page.</figcaption>
          </figure>
          <p className="ff-lede hd-fees">Both charge a non-refundable application fee per application, not per person, plus a per-person recreation fee if you win. Current amounts are on the NPS permit page linked below; in the 2024 season both were $10, so a group of four that applied and won paid $50 in total.</p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="hd-application" tabIndex={-1}>
        <HpHeading eyebrow="WHAT THE PRESEASON APPLICATION ASKS FOR" title="Four fields, and each one can sink you" />
        <ul className="ff-rules hd-fields">
          <li><EventIcon name="users" size={26} /><strong>Group size</strong><p>Up to six people on one application. Everyone hikes together, and the permit holder or the alternate has to be at the checkpoint with the whole group.</p></li>
          <li><EventIcon name="calendar" size={26} /><strong>Date choices</strong><p>Up to seven dates or date ranges, ranked. The system tries your highest-preference date first and works down the list, so the order genuinely matters.</p></li>
          <li><EventIcon name="id" size={26} /><strong>Permit holder and alternate</strong><p>Name both. One of the two must be physically present with a photo ID matching the permit. An alternate can only be added during the application window, and they have to hold a Recreation.gov account and accept the role within 72 hours of being added. Miss that and they are not on the permit. Once the window closes, neither name can be changed.</p></li>
          <li className="is-warn"><EventIcon name="alert" size={26} /><strong>One application per person</strong><p>Each person can appear as holder or alternate on exactly one preseason application. Show up on two and all of them are cancelled without a refund.</p></li>
        </ul>
      </section>

      <section className="ff-band" id="hd-odds" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="THE PUBLISHED ODDS" title="Read the application rate, not the date-choice rate" />
          <p className="ff-lede ff-lede--intro">These are the National Park Service's own figures for the seasons it has published. Read the application rate, not the date-choice rate, as your odds of hiking: most applications list several dates and only one of them can be filled.</p>
          <LotteryOdds season={season} />
          <div className="prose hd-table fj-tablewrap" role="region" aria-label="Published lottery statistics" tabIndex={0}>
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
          </div>
          <div className="ff-split hd-spread">
            <p className="ff-lede">The spread inside those averages is where the strategy lives. Saturday is the most requested day of the week, drawing about 21% of all preseason applications in 2024. Weekday odds in the daily lottery ran roughly half again better than weekend odds that season, 22% against 14%, and late-season weekdays, late August through the October takedown, are the best draw of the year.</p>
            <p className="ff-lede">Counted by individual date choice rather than by application, the preseason numbers look far worse, about 1.0% for a weekday choice and 0.8% for a weekend one, which is the same fact stated a different way.</p>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="hd-strategy" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">WHAT ACTUALLY WORKS</p>
            <h2>Seven dates, two lotteries, no Saturdays</h2>
            <HdTries rate={season.dailyWeekday} />
          </div>
          <ol className="hd-steps">
            <li><strong>Use all seven date choices</strong><p>In the preseason application, front-load the unpopular ones: a Tuesday in September as your first choice beats a Saturday in July. One fixed date means you get the published odds and nothing better; seven spread across the season is seven rolls inside one application.</p></li>
            <li><strong>Enter both lotteries</strong><p>Plan the trip so the hike falls mid-visit rather than on day one, then run the daily lottery every eligible day. Each draw is independent, so five weekday attempts at roughly one-in-five odds work out to about a two in three chance of winning at least once.</p></li>
            <li><strong>Avoid Saturday</strong><p>Sunday is second worst. Monday through Thursday draw the fewest preseason applications, 12 to 13% each in 2024, and weekdays draw better odds in the daily lottery.</p></li>
            <li><strong>Split groups larger than six</strong><p>Across two applications with two different permit holders; they are entered independently. Name an alternate on every preseason application, and have them accept the role before the window closes, or a sick permit holder on hike day ends the trip for everyone.</p></li>
            <li><strong>Have the no-permit plan ready</strong><p>A wilderness permit through Little Yosemite Valley can carry a Half Dome add-on from a separate allocation, and Clouds Rest, higher than Half Dome with a bigger view and no permit at all, is the better hike for most people anyway.</p></li>
          </ol>
        </div>
      </section>

      <section className="ff-band" id="hd-win" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">IF YOU WIN</p>
            <h2>The day is 10 to 12 hours. Start before dawn.</h2>
            <p className="ff-lede">The hike is 14 to 16 miles round trip with 4,800 feet of gain and takes most people 10 to 12 hours, so a 5 a.m. start, earlier if you can, is what gets you up and down before afternoon thunderstorms.</p>
            <p className="ff-lede">Watch the forecast obsessively in the days before. Nearly every fatal fall from the cables has happened on wet rock. If rain is coming, cancel: the per-person recreation fee is fully refundable until 11:59 p.m. Pacific the day before your date, and refundable outright if the cables are not up.</p>
            <FjPull cite="If you win">Sunk cost is a bad reason to be on wet granite at 45 degrees.</FjPull>
          </div>
          <ol className="ff-hours">
            <li><span>Before you leave the Valley</span><p>Download or print the confirmation email. Cell service is unreliable at the subdome checkpoint, and the permit is valid for a single day, midnight to 11:59 p.m., with no multi-day option for day hikers. Bring the photo ID that matches the name on it.</p></li>
            <li><span>5 a.m., or earlier</span><p>Start at Happy Isles.</p></li>
            <li><span>The subdome steps</span><p>Rangers check the permit, the photo ID and the confirmation, with the whole group there together.</p></li>
            <li className="is-glow"><span>3:30 p.m.</span><p>Set a turnaround time and keep it: not on the summit by 3:30 p.m. means turn around, whatever the day has cost you.</p></li>
            <li><span>The way down</span><p>You do not want to be on the cables in a lightning storm, or coming down <HomeLink go={go} location="half_dome_win" href="/articles/mist-trail-the-real-guide">the Mist Trail</HomeLink> in the dark without a headlamp.</p></li>
          </ol>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="hd-lose" tabIndex={-1}>
        <HpHeading eyebrow="IF YOU DO NOT WIN" title="The year is not over" />
        <ul className="ff-rules hd-lose">
          <li><EventIcon name="ticket" size={26} /><strong>Run the daily lottery every day of the trip</strong><p>Each application is an independent chance, and five eligible weekday mornings is a genuinely good position to be in.</p></li>
          <li className="is-no"><EventIcon name="no" size={26} /><strong>Do not go anyway</strong><p>Rangers are at the checkpoint, they check every group, and the citation follows you home.</p></li>
          <li><EventIcon name="bed" size={26} /><strong>Consider the backpacker route</strong><p>A wilderness permit for a trip through Little Yosemite Valley can carry a Half Dome add-on from an allocation the day-hiker lottery does not touch. It means an overnight, a bear canister and wilderness gear, but it is a legitimate path to the cables. Apply through <HomeLink go={go} location="half_dome_lose" href="/articles/yosemite-wilderness-permits-guide">the wilderness permit system</HomeLink>, not this lottery.</p></li>
          <li><EventIcon name="mountain" size={26} /><strong>Hike Clouds Rest instead</strong><p>The summit is 9,926 feet, more than a thousand feet higher than Half Dome, with no permit required and bigger views in every direction. On a Tuesday in June you might have it to yourself.</p></li>
          <li><EventIcon name="calendar" size={26} /><strong>Come back late season, midweek</strong><p>The best daily lottery odds of the year are weekdays in September and early October: the cables are still up, the crowds have thinned and the fall light is extraordinary.</p></li>
        </ul>
      </section>

      <section className="ff-band" id="hd-fine-print" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">FEES, CANCELLATION AND THE FINE PRINT</p>
            <h2>What is refundable, and what is not</h2>
            <p className="ff-lede">The application fee is non-refundable in every case; it is the cost of entering. The per-person recreation fee is refundable if you cancel by 11:59 p.m. Pacific the day before your hike date, or if the cables are not up on your date, which happens with early-season snow and late-season weather. Cancel or reduce group size through the Recreation.gov account or by phone.</p>
            <p className="ff-lede">In the daily lottery there is no alternate, only a permit holder, and a win charges the card on file automatically. A declined card forfeits the permit. Permits cannot be resold or auctioned, and any attempt to resell one voids it. A day-hiker permit includes no camping anywhere along the route.</p>
          </div>
          <div className="hd-side">
            {/* The live layer: rules and fees change annually; the sources don't. */}
            <aside className="ff-closing hd-rules">
              <p className="hp-eyebrow">THE CURRENT YEAR'S RULES</p>
              <p>Dates, fees, and any rule changes for the current season: <a href="https://www.nps.gov/yose/planyourvisit/hdpermits.htm" target="_blank" rel="noopener noreferrer">the NPS Half Dome permits page</a> and <a href="https://www.recreation.gov/permits/234652" target="_blank" rel="noopener noreferrer">the Recreation.gov lottery page</a>. The wilderness office answers permit questions at 209-372-0826, weekday mornings and afternoons in season. The week's park-wide picture is on <HomeLink go={go} location="half_dome_rules" href="/now">the Park Bulletin</HomeLink>.</p>
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/hdpermits.htm" target="_blank" rel="noopener noreferrer">Half Dome Permits, NPS ↗</a></li>
                <li><a href="https://www.recreation.gov/permits/234652" target="_blank" rel="noopener noreferrer">Half Dome Permits, Recreation.gov ↗</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/hdpermitsapps.htm" target="_blank" rel="noopener noreferrer">Half Dome Permit Lottery Statistics, NPS ↗</a></li>
              </ul>
            </aside>
            {/* A permit day is a pre-dawn start after a 14-to-16-hour day, which
                makes the night before and the night after a real planning
                problem, not an afterthought. The filled button is only ever an
                Expedia search, as on /firefall. */}
            <aside className="ff-closing hd-stay" aria-label="Lodging availability">
              <p className="hp-eyebrow">THE NIGHT BEFORE, AND THE NIGHT AFTER</p>
              <p>The hike wants a pre-dawn start and gives back a fourteen-to-sixteen-hour day. Driving in from Oakhurst at 3 a.m. and back out at 10 p.m. is how a permit gets wasted. A bed in the Valley or in El Portal is the difference, and the permit date is known far enough ahead to book one.</p>
              <AvailabilityLink destination="Yosemite National Park" list="page_half_dome" slug="half-dome-lottery" className="ff-book">Search lodging near the trailhead ↗</AvailabilityLink>
              <p className="ff-note">Availability search on Expedia; we may earn a commission, and the advice is the same either way. <a href="/affiliate">Disclosure.</a> Every option compared: <HomeLink go={go} location="half_dome_stay" href="/stay">where to stay</HomeLink>.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section hd-related">
        <p className="hp-eyebrow">RELATED READING</p>
        <p className="ff-lede">Before you decide the cables are the goal at all, read <HomeLink go={go} location="half_dome_related" href="/articles/so-you-want-to-hike-half-dome">So You Want to Hike Half Dome</HomeLink>, which includes the case for Clouds Rest. The approach is <HomeLink go={go} location="half_dome_related" href="/articles/mist-trail-the-real-guide">the Mist Trail</HomeLink>, and every other permit the park runs is in <HomeLink go={go} location="half_dome_related" href="/articles/yosemite-wilderness-permits-guide">the wilderness permits guide</HomeLink>. If you arrived without any permit at all, there is <HomeLink go={go} location="half_dome_related" href="/articles/yosemite-walk-up-and-day-of-permits">a guide to walk-up and day-of permits</HomeLink>. Gear lives in <HomeLink go={go} location="half_dome_related" href="/kit">the day pack list</HomeLink>: the short version is a gallon of water, grippy gloves you pack back out, a headlamp, and a hard turnaround time.</p>
      </section>

      <HpGuideBand
        go={go}
        location="half-dome-lottery"
        title="Planning the trip around a permit day?"
        intro="The Field Guide app carries the trailhead parking notes, offline maps for a park with no signal, and a day-by-day planner that flexes when the lottery says Tuesday instead of Saturday."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="The permit calendar, in your inbox"
        heading="The permit calendar, in your inbox"
        blurb="Sunday Field Notes flags the lottery calendar as it comes: when the March window opens, when results land, and when the late-season odds turn favorable."
        location="half-dome-lottery"
        tag="half-dome-lottery"
      />
    </div>
  );
}

window.HalfDomeLotteryPage = HalfDomeLotteryPage;
