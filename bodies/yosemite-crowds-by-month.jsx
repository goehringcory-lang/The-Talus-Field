/* global React, EventIcon */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// How busy Yosemite is, month by month, and where and when the crowd
// concentrates. Laid out on the /firefall system: its catalog entry carries a
// `feature` block (data.js), so page-article.jsx draws the full-width cover
// and hands this body the page's width. No page layer of its own: it borrows
// the shared `.ff-*` kit and the `.wv-prose` / `.wv-table` / `.wv-sources`
// pieces the when-to-visit feature already defines globally in styles.css.
//
// SOURCING. Every figure was read on its primary page on October 17, 2026,
// or is carried from when-to-visit-yosemite, which sources it:
//   - The monthly table: NPS Yosemite "Visitation Statistics", average monthly
//     visitation 2010 to 2024 (page updated November 19, 2025), numbers and
//     percentages exactly as printed. The July = 100 index is arithmetic on
//     those numbers. "Nearly 75% ... May through October" is the page's own.
//   - Where and when lots fill (Valley before 8 a.m., Glacier Point and
//     Tuolumne by 9 a.m. and up to two-hour Glacier Point delays, the
//     Mariposa Grove plaza by mid-day, Hetch Hetchy mid-morning to late
//     afternoon, about 30 minutes at the Tioga Pass entrance, Saturdays and
//     holiday weekends, the YNPTRAFFIC text line): NPS "Traffic and Parking".
//   - 2026: NPS reservations page (no timed reservation system in 2026) and
//     the NPS release of August 28, 2026 (two days of significant delays,
//     both Memorial Day weekend; gridlock days "once exceeded 120 annually";
//     the survey of 1,203 visitors, August 7 to 16; shuttles and Valley
//     parking added in late June).
//   - 2025 through August: NPS release of September 4, 2025.
//   - The reservation years 2021 to 2025, the annual totals (2016 record,
//     2025 fourth-busiest) and the June and July 2026 counts: as published
//     in when-to-visit-yosemite, which names the sources. The monthly counts
//     for 2025 itself are not quoted: the NPS report viewer does not render in
//     plain text, and the page says so rather than estimating.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["yosemite-crowds-by-month"] = function YosemiteCrowdsByMonthBody() {
  const TOC = [
    ["#ycm-calendar", "Month by month"],
    ["#ycm-days-hours", "Days and hours"],
    ["#ycm-where", "Where it concentrates"],
    ["#ycm-reservations", "Reservations, then and now"],
    ["#ycm-tactics", "How to beat it"],
    ["#ycm-questions", "Questions"],
  ];

  // NPS Yosemite "Visitation Statistics": average monthly visitation,
  // 2010 to 2024, and the share of the year the page prints beside each.
  const MONTHS = [
    { m: "January", v: 120827, s: 3, n: "The quietest month. The Valley is open; chains ride in the car." },
    { m: "February", v: 134729, s: 3, n: "Horsetail Fall weekends crowd the Valley at sunset; the rest is quiet." },
    { m: "March", v: 160225, s: 4, n: "Spring break weeks fill the Valley lots. Falls building." },
    { m: "April", v: 250943, s: 6, n: "Busy weekends, light weekdays. The high roads are still closed." },
    { m: "May", v: 372595, s: 9, n: "Peak falls. Memorial Day weekend behaves like July." },
    { m: "June", v: 526209, s: 13, n: "School is out. Peak season starts." },
    { m: "July", v: 624559, s: 15, n: "The busiest month. Every road usually open." },
    { m: "August", v: 607000, s: 15, n: "Nearly as busy as July. Smoke can matter." },
    { m: "September", v: 511200, s: 13, n: "Busy through Labor Day, then a real drop on weekdays." },
    { m: "October", v: 388581, s: 10, n: "Weekends still busy, weekdays easy. First storms." },
    { m: "November", v: 196374, s: 5, n: "Quiet except Thanksgiving week. High roads close." },
    { m: "December", v: 154033, s: 4, n: "Quiet until the holiday week." },
  ];
  const JULY = MONTHS[6].v;
  const level = (i) => (i >= 80 ? "Peak" : i >= 55 ? "Busy" : i >= 35 ? "Moderate" : "Quiet");

  const FAQ = [
    ["What is Yosemite's visitation by month?", "By the Park Service's averages for 2010 to 2024, July is the busiest month at 624,559 visits and August close behind at 607,000, each about 15 percent of the year. January is the quietest at 120,827, about 3 percent. Nearly 75 percent of visitors come from May through October."],
    ["What is the least crowded month to visit Yosemite?", "January, then February and December, by the Park Service's averages. Each draws about a fifth to a quarter of July's visits. For a quiet month with more of the park open, early November weekdays and the weekdays of October are the better trade: October averages 388,581 visits, about 62 percent of July."],
    ["Will Yosemite be crowded in 2026?", "Busier than 2025, with less waiting. There is no timed reservation system in 2026. Visits were running about 8 percent ahead of 2025 through July, but the Park Service counted only two days of significant traffic delays through late August, both on Memorial Day weekend. Saturdays and holiday weekends are still the days the Valley lots fill."],
    ["What time do Yosemite Valley parking lots fill?", "The Park Service says to arrive before 8 a.m., after which Valley parking is usually full from April through September and on spring and fall weekends. Glacier Point and Tuolumne Meadows: arrive by 9 a.m. The Mariposa Grove welcome plaza can fill by mid-day. Text YNPTRAFFIC to 333111 for the park's live updates."],
    ["What are the busiest days in Yosemite?", "Saturdays and holiday weekends, by the Park Service's own traffic page: Memorial Day, the Fourth of July, Labor Day, Thanksgiving week and the late-December holidays. Weekdays are less congested, though delays are possible on any day in summer."],
    ["Do I need a reservation to enter Yosemite in 2026?", "No. The Park Service says it will not use a timed reservation system in 2026, after requiring one in some form in 2021, 2022, 2024 and 2025. You still pay the entrance fee. Check nps.gov/yose before a 2027 trip; the park has not announced its plans for next year."],
  ];

  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="wv-feature ycm-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="users" /><dt>Busiest month</dt><dd>July, then August</dd></div>
          <div><EventIcon name="calendar" /><dt>Quietest month</dt><dd>January</dd></div>
          <div><EventIcon name="clock" /><dt>Valley lots fill</dt><dd>Arrive before 8 a.m.</dd></div>
          <div><EventIcon name="ticket" /><dt>2026 reservations</dt><dd>None required</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      <section className="hp-wrap hp-section">
        <div className="ff-split">
          <div className="wv-prose">
            <p>
              Yosemite is not crowded. Yosemite Valley is crowded, between about eight in the morning and four in the afternoon, on summer Saturdays, at a handful of trailheads. The rest of the park, and the rest of the clock, runs on a different number. The question "will it be crowded?" has three parts: which month, which day and hour, and which place.
            </p>
            <p>
              This is the month-by-month count from the Park Service's own visitation page, the days and hours its traffic page warns about, the places where the crowd actually piles up, the reservation years and what replaced them in 2026, and what to do about all of it. For the year-by-year numbers and this year's projection, read <a href="/articles/when-to-visit-yosemite">when to visit Yosemite</a>; this page is the crowd calendar.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="alert" /> The short version</p>
            <ul>
              <li>May through October carry nearly 75 percent of the year.</li>
              <li>July and August are the peak; January is the low.</li>
              <li>Saturdays and holiday weekends are the worst days.</li>
              <li>In the Valley, be parked before 8 a.m.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="ycm-calendar" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">YOSEMITE VISITATION BY MONTH</p>
              <h2>The crowd calendar, from the Park Service's count</h2>
              <div className="wv-prose">
                <p>
                  The Park Service publishes the average number of visitors to Yosemite in each month, across 2010 to 2024. That fifteen-year average is the fairest single picture of the year, because it smooths out the fire closures, the Covid year and the reservation summers. The shape is simple: a long climb from January to a July peak, a slow fall through September, then a cliff in November.
                </p>
                <p>
                  The last column puts each month on a scale where July is 100. The crowd label is mine, cut from that index: Peak at 80 and above, Busy from 55, Moderate from 35, Quiet below.
                </p>
                <p>
                  The averages understate the present. Recent summers have run above them: June 2026 came in at 634,508 visits and July at 654,356 by the reported Park Service counts, both above the fifteen-year average. Treat the table as the shape of the year and the recent counts as its height.
                </p>
              </div>
            </div>
            <div className="wv-tablewrap">
              <table className="wv-table">
                <caption>Average monthly visits, 2010 to 2024</caption>
                <thead><tr><th scope="col">Month</th><th scope="col">Visits</th><th scope="col">Share</th><th scope="col">July = 100</th></tr></thead>
                <tbody>
                  {MONTHS.map((r) => {
                    const idx = Math.round((r.v / JULY) * 100);
                    return (
                      <tr key={r.m}>
                        <th scope="row">{r.m}<small>{level(idx)}. {r.n}</small></th>
                        <td>{fmt(r.v)}</td>
                        <td>{r.s}%</td>
                        <td><b>{idx}</b></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="ff-note">Source: National Park Service, Yosemite Visitation Statistics, average monthly visitation 2010 to 2024. Index and crowd labels: The Talus Field. The month notes restate this site's seasonal guides: <a href="/articles/yosemite-in-fall">Yosemite in fall</a>, <a href="/articles/yosemite-in-winter">Yosemite in winter</a>.</p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ycm-days-hours" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">BUSIEST DAYS AND TIMES</p>
            <h2>The clock matters more than the calendar</h2>
            <div className="wv-prose">
              <p>
                A July Tuesday at 7 a.m. is quieter than an April Saturday at 11. The Park Service's traffic guidance applies from April through September and on spring and fall weekends, and it names <strong>Saturdays and holiday weekends</strong> as particularly busy. Weekdays are less congested, though it is careful to say delays are possible on any day.
              </p>
              <p>
                Within the day, the crowd is a block of hours. The Valley lots are usually full by <strong>8 a.m.</strong> in season, and on a weekend, the park warns, arriving after eight can mean several delays and then no parking at all. The day-trippers leave from mid-afternoon. Be through the gate early, or arrive after four and take the evening light.
              </p>
              <p>
                The holidays are the weekends that behave worst: Memorial Day, the Fourth of July, Labor Day, Thanksgiving week and the week between Christmas and New Year's. In 2026 the Park Service counted only two days of significant traffic delays through late August, and both were on Memorial Day weekend.
              </p>
            </div>
          </div>
          <ol className="ff-hours">
            <li><span>Before 8 a.m.</span><p>Valley parking still open. The window the Park Service names.</p></li>
            <li className="is-glow"><span>8 a.m. to mid-afternoon</span><p>Lots full in season; traffic backs up once they fill.</p></li>
            <li><span>Mid-afternoon on</span><p>Day visitors start leaving. Spaces turn over.</p></li>
            <li><span>After 4 p.m.</span><p>The second good window, and the best light.</p></li>
          </ol>
        </div>
      </section>

      <section className="ff-band" id="ycm-where" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">WHERE THE CROWD CONCENTRATES</p>
          <h2>Five places, five deadlines</h2>
          <p className="ff-lede ff-lede--intro">The Park Service's traffic page gives each crowded place its own warning. These are its words, reduced to the hour that matters.</p>
          <ul className="ff-rules">
            <li><EventIcon name="car" size={26} /><strong>Yosemite Valley: before 8 a.m.</strong><p>Parking is usually full after eight in season. Once the lots fill, traffic can back up for miles, and cars may be turned back near El Capitan. <a href="/articles/yosemite-valley-parking-guide">The parking guide</a> has the three day-use lots.</p></li>
            <li><EventIcon name="mountain" size={26} /><strong>Glacier Point: by 9 a.m.</strong><p>Delays can reach two hours. The road is open roughly late spring to fall; <a href="/articles/glacier-point-how-to-visit">how to visit Glacier Point</a>.</p></li>
            <li><EventIcon name="tree" size={26} /><strong>Mariposa Grove: by late morning</strong><p>The welcome plaza lot may fill by mid-day and close periodically. <a href="/articles/mariposa-grove-how-to-visit">How to visit the Mariposa Grove</a>.</p></li>
            <li><EventIcon name="lake" size={26} /><strong>Tuolumne Meadows: by 9 a.m.</strong><p>Parking is limited and roadside parking is prohibited. The Tioga Pass entrance runs an estimated 30-minute wait. <a href="/articles/tuolumne-meadows-in-a-day">Tuolumne Meadows in a day</a>.</p></li>
            <li><EventIcon name="drop" size={26} /><strong>Hetch Hetchy: early or late</strong><p>The lots may be full from mid-morning to late afternoon. The gate keeps daylight hours, so check them before a late arrival: <a href="/articles/hetch-hetchy-the-other-yosemite-valley">the other Yosemite Valley</a>.</p></li>
            <li><EventIcon name="signal" size={26} /><strong>Before you go: text the park</strong><p>When the park is extremely busy, text YNPTRAFFIC to 333111 for current traffic updates. Cell coverage in the park is patchy, so sign up before you lose it.</p></li>
          </ul>
          <p className="ff-note">Inside the Valley the crowd narrows further: Lower Yosemite Fall and the Mist Trail trailhead draw the most, and <a href="/articles/yosemite-without-reservations-2026">Yosemite without reservations</a> has the routes around them.</p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ycm-reservations" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">PEAK-HOURS RESERVATIONS</p>
            <h2>Five years of reservations, and a year without</h2>
            <div className="wv-prose">
              <p>
                From 2020 to 2025, Yosemite mostly managed its summer crowd with a ticket. The rules changed nearly every year, which is why so much of what is written about Yosemite crowds is out of date.
              </p>
              <p>
                <strong>2026 has none.</strong> The Park Service says it will no longer use a timed reservation system in 2026, after its evaluation of the 2025 season found that a season-wide requirement was not the most effective approach. In its place: real-time traffic monitoring and active parking management in the Valley. In late June it added shuttles and expanded Valley parking.
              </p>
              <p>
                The park's August 28 release makes the case that it worked. Gridlock days, it says, once exceeded 120 a year; in 2026 there were two. In a survey of 1,203 visitors in mid-August, 91 percent reported no entrance delay or a wait under 15 minutes. That is the park's own reading of its own policy, and it is preliminary.
              </p>
              <p>
                Whether 2027 brings a reservation back has not been announced. Check <a href="https://www.nps.gov/yose/planyourvisit/reservations.htm" target="_blank" rel="noopener noreferrer">the park's reservations page</a> before you plan next summer. The argument for bringing one back is in <a href="/articles/yosemite-needs-a-reservation-system">Yosemite needs a reservation system</a>.
              </p>
            </div>
          </div>
          <ol className="ff-timeline">
            <li><span>2021</span><strong>Day-use reservations</strong><p>May 21 to September 30.</p></li>
            <li><span>2022</span><strong>Peak hours, 6 a.m. to 4 p.m.</strong><p>May 20 to September 30.</p></li>
            <li><span>2023</span><strong>None in summer</strong><p>Three February weekends, for the firefall.</p></li>
            <li><span>2024</span><strong>Peak Hours Plus, 5 a.m. to 4 p.m.</strong><p>April 13 to October 27.</p></li>
            <li><span>2025</span><strong>Peak hours, 6 a.m. to 2 p.m.</strong><p>June 15 to August 15, plus Memorial Day and Labor Day weekends.</p></li>
            <li className="is-open"><span>2026</span><strong>No reservation</strong><p>Real-time traffic and parking management instead.</p></li>
          </ol>
        </div>
      </section>

      <section className="ff-band" id="ycm-tactics" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">HOW TO BEAT THE CROWDS</p>
              <h2>What actually works</h2>
              <div className="wv-prose">
                <p>
                  None of this is a secret, which is the point: the crowd is predictable, so it is avoidable. In rough order of how much each one buys you:
                </p>
                <p>
                  <strong>Go midweek.</strong> The single biggest lever. A Tuesday in July is a different park from a Saturday in July. <strong>Go in the shoulder.</strong> Late April and the weekdays of September and October keep most of the park open at a fraction of the peak; September's average is about 82 percent of July's, October's about 62.
                </p>
                <p>
                  <strong>Sleep inside or close.</strong> A bed in the Valley, or on Highway 140 in El Portal, puts you at the trailhead before the day visitors reach the gate. <a href="/articles/yosemite-gateway-towns-compared">The gateway towns</a> are ranked by drive time. <strong>Park once.</strong> Leave the car in the morning and ride <a href="/articles/yosemite-shuttle-and-yarts">the free Valley shuttle</a>, or skip the car entirely on YARTS. The Park Service's own advice is the same: park once for the length of your stay, and ride the bus in.
                </p>
                <p>
                  <strong>Go up, not in.</strong> When the Valley is full, Tioga Road and the high country absorb people far better, which is the case <a href="/articles/memorial-day-skip-the-valley-go-high-2026">the Memorial Day piece</a> makes. <strong>Bring the day with you.</strong> The park advises plenty of food and water, because a full lot means you may not get back to a store.
                </p>
              </div>
            </div>
            <aside className="ff-short" aria-label="The checklist">
              <p className="ff-short__head"><EventIcon name="check" /> The checklist</p>
              <ul>
                <li>A weekday, not a Saturday.</li>
                <li>Parked before 8 a.m., or arriving after 4 p.m.</li>
                <li>A bed in the park or on its edge.</li>
                <li>The shuttle once you are parked.</li>
                <li>The high country when the Valley is full.</li>
                <li>YNPTRAFFIC to 333111, saved before you lose signal.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ycm-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Yosemite crowds, answered</h2>
            <p className="ff-lede">What is open in each month, and what this year's count says about next: <a href="/articles/when-to-visit-yosemite">when to visit Yosemite</a>.</p>
            <div className="wv-sources">
              <h3>Sources, read October 17, 2026</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/visitation.htm" target="_blank" rel="noopener noreferrer">Visitation statistics (monthly averages, 2010 to 2024), NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/traffic.htm" target="_blank" rel="noopener noreferrer">Traffic and parking, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/reservations.htm" target="_blank" rel="noopener noreferrer">Entrance reservations, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/learn/news/more-visitors-less-waiting-yosemite-survey-shows-strong-peak-season-visitor-experience.htm" target="_blank" rel="noopener noreferrer">More Visitors, Less Waiting, NPS, August 28, 2026</a></li>
                <li><a href="https://www.nps.gov/yose/learn/news/yosemite-national-park-reports-strong-summer-visitation-numbers.htm" target="_blank" rel="noopener noreferrer">Yosemite reports strong summer visitation numbers, NPS, September 4, 2025</a></li>
                <li><a href="https://irma.nps.gov/STATS/" target="_blank" rel="noopener noreferrer">NPS Visitor Use Statistics</a></li>
                <li>The reservation years and the June and July 2026 counts: as published and sourced in <a href="/articles/when-to-visit-yosemite">when to visit Yosemite</a>.</li>
              </ul>
            </div>
          </div>
          <div className="ff-faq">
            {FAQ.map(([q, a], i) => (
              <details key={q} open={i < 2}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
