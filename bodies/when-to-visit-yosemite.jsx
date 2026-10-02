/* global React, EventIcon */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// The October 2026 feature redesign, on the El Capitan / where-to-eat recipe.
// This body renders on the /firefall system rather than in the 680px reading
// column: its catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's width. Every section sits on `hp-wrap`, alternating paper and the
// `ff-band` tint. The page's own pieces are the `.wv-*` layer in styles.css.
//
// Five rules hold it up.
//   1. Every number is a published figure or arithmetic on published figures.
//      The first build of this article carried a month-by-month series, a
//      weekday/weekend crowd index and an hourly traffic curve that were
//      estimates ("stylized"); the redesign dropped all three, because a chart
//      that looks measured and is not is the failure this site avoids. What
//      replaced them: the Park Service's own 2010 to 2024 monthly averages
//      (the crowd calendar), the annual recreation visits 2016 to 2025, the
//      reservation windows the Park Service actually enforced (the clock), and
//      a projection that shows its arithmetic.
//   2. The projection is the site's, labelled as such, and built only from the
//      year-to-date count and the remainder of 2025 (annual total minus the
//      January to July count the 2026 reports quote). It is a range, not a
//      point, and the ranking claim rests on a threshold anyone can check.
//   3. The section ids are the anchors the old layout generated at runtime
//      (`sec-<h2 index>-<slug40>`), pinned by hand so the deep links search
//      already carries keep landing on the same content.
//   4. No map: the page is about when, not where. (A map would start from the
//      NPS crops in img/, never a drawing.)
//   5. Nothing here reads today's road status. The road strip restates the
//      Park Service's seasonal pattern and the 2026 opening dates.
//
// Facts corrected in the redesign (old claim, new claim): 2023 had no
// reservations at all, but the park did require them on three February
// weekends; 2025 (4.28M) was not "the highest demand since 2016", it was the
// fourth-busiest year behind 2016, 2019 and 2017; July 4 2026 was not the
// worst day of the year, the park reports it ran without significant delays
// and counts only two delay days all year, both Memorial Day weekend; the
// "30 minutes on average, an hour at worst" wait figures and the Highway 140,
// 41 and 120 percentages attributed to the park were not in its releases and
// are gone; the park-survey figure (91 percent waited under 15 minutes) and
// the entrance-by-entrance growth through July replace them.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["when-to-visit-yosemite"] = function WhenToVisitYosemiteBody() {
  const TOC = [
    ["#sec-0-the-throttle-is-gone", "The throttle is gone"],
    ["#sec-1-what-2026-looks-like-so-far", "2026 so far"],
    ["#sec-2-what-the-reservation-years-actually-did", "What reservations did"],
    ["#sec-3-how-i-built-the-forecast", "The projection"],
    ["#sec-4-the-crowd-calendar", "Crowd calendar"],
    ["#what-is-open-when", "What is open"],
    ["#sec-5-the-clock-beats-the-calendar", "The clock"],
    ["#sec-6-the-days-i-would-pick", "Days to pick"],
    ["#sec-7-what-could-bend-the-curve", "What could change"],
    ["#when-to-visit-questions", "Questions"],
  ];

  const FAQ = [
    ["Do I need a reservation to visit Yosemite in 2026?", "No. The Park Service stopped using a timed reservation system for 2026, and its entrance reservations page, updated February 18, says so. You still pay the entrance fee, but no timed-entry ticket is required, and the February firefall weekends ran without reservations too."],
    ["How busy will Yosemite be in 2026?", "Very. Through July the park logged 2,657,602 visits, 8 percent ahead of 2025, and June 2026 was the second-busiest June on record. If August through December match 2025, the year ends near 4.5 million visits; at this year's pace, near 4.6 million. Either would be the second-busiest year on record, behind 2016. That is the site's projection, not a Park Service number."],
    ["What is the best time to visit Yosemite in 2026?", "Midweek in October is the best window left: the Park Service's 15-year average for October is about 38 percent below July, and Tioga Road is usually open for most of the month. Early-November weekdays are quieter still, with short days. Check the conditions page first: the Mist Trail is partly closed on weekdays through October."],
    ["What time of day should I enter Yosemite to avoid traffic?", "Be through the gate before 8 a.m., before 7 on summer weekends, or arrive after 4 p.m. Valley parking has filled as early as 8 a.m. on peak days. In the Park Service's August survey, 91 percent of visitors had no entrance delay or waited less than 15 minutes. Text YNPTRAFFIC to 333111 for the park's live parking and traffic updates."],
    ["What are the worst days to visit Yosemite in 2026?", "The Park Service counts only two days of significant delays in 2026, both over Memorial Day weekend, and says Juneteenth and July 4 ran without significant delays. Summer Saturdays arriving after 8:30 a.m., Labor Day weekend and the holiday week in late December are still the days to plan around."],
    ["What was Yosemite's busiest year ever?", "2016, with 5,028,868 recreation visits. 2025 was the fourth-busiest at 4,278,413, behind 2016, 2019 and 2017, and 2026 is on pace to land second at roughly 4.5 to 4.6 million."],
  ];

  // ── Data ──────────────────────────────────────────────────────────────────
  // NPS Yosemite "Visitation Statistics" page: average monthly visitation,
  // 2010 to 2024 (page updated November 19, 2025).
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const AVG = [120827, 134729, 160225, 250943, 372595, 526209, 624559, 607000, 511200, 388581, 196374, 154033];
  const JULY = AVG[6];
  const INDEX = AVG.map((v) => Math.round((v / JULY) * 100));

  // Annual recreation visits, NPS Visitor Use Statistics. 2016 to 2025, with
  // the reservation rule that year (dates from the park's own announcements).
  const YEARS = [
    { y: 2016, v: 5028868, rule: "No reservations. The record year." },
    { y: 2017, v: 4336890, rule: "No reservations." },
    { y: 2018, v: 4009436, rule: "No reservations." },
    { y: 2019, v: 4422861, rule: "No reservations." },
    { y: 2020, v: 2268313, rule: "Covid closure, then day-use limits." },
    { y: 2021, v: 3287595, rule: "Day-use reservations, May 21 to September 30." },
    { y: 2022, v: 3667550, rule: "Peak-hours reservations, 6 a.m. to 4 p.m., May 20 to September 30." },
    { y: 2023, v: 3897070, rule: "None in summer. Three February weekends for the firefall." },
    { y: 2024, v: 4121807, rule: "Peak Hours Plus, 5 a.m. to 4 p.m., April 13 to October 27." },
    { y: 2025, v: 4278413, rule: "Peak hours, 6 a.m. to 2 p.m., June 15 to August 15 and two holiday weekends." },
  ];
  const MAXY = 5100000;

  // 2026 so far against 2025, from the park's reports. May is worked out from
  // the other published totals, which the table says.
  const SOFAR = [
    { p: "March", a: 225817, b: null, c: "+45%", n: "Busiest March since 2016" },
    { p: "January to April", a: 836458, b: 739313, c: "+13%", n: "February +12%, April +2%" },
    { p: "May", a: 532280, b: 497401, c: "+7%", n: "Worked out from the totals" },
    { p: "June", a: 634508, b: 607410, c: "+4.5%", n: "Second-busiest June on record" },
    { p: "July", a: 654356, b: 616551, c: "+6.1%", n: "Later summary: 665,877, +8%" },
    { p: "January to July", a: 2657602, b: 2460675, c: "+8%", n: "Later summary: about 2.59 million, +9.5%" },
  ];

  const JUNJUL = [
    { m: "June", rows: [["2024", 588251, "Peak Hours Plus"], ["2025", 607410, "Scaled back"], ["2026", 634508, "None"]] },
    { m: "July", rows: [["2024", 596711, "Peak Hours Plus"], ["2025", 616551, "Scaled back"], ["2026", 654356, "None"]] },
  ];

  // Reported entrance-by-entrance growth, January to July 2026 over 2025.
  const GATES = [
    ["Tioga Pass", 21.5],
    ["South Entrance (Highway 41)", 10.1],
    ["Arch Rock (Highway 140)", 9.8],
    ["Big Oak Flat (Highway 120)", 6.6],
  ];

  // The projection: January to July 2026 count, plus August to December 2025
  // (annual 2025 minus the January to July 2025 count), scaled.
  const YTD26 = 2657602;
  const REST25 = 4278413 - 2460675;
  const SCEN = [
    { g: 0, label: "August to December match 2025" },
    { g: 4, label: "Four percent above 2025" },
    { g: 8, label: "Eight percent above 2025, this year's pace" },
  ].map((s) => ({ ...s, total: Math.round(YTD26 + REST25 * (1 + s.g / 100)) }));
  const NEED_2019 = 4422861 - YTD26;

  // Road seasons. State per month: o open, v varies, w closing, c closed.
  const ROADS = [
    { name: "Tioga Road", note: "2026: opened May 15, the earliest in 16 years", s: "ccccvvoooowc" },
    { name: "Glacier Point Road", note: "2026: opened May 9", s: "ccccvooooowc" },
    { name: "Mariposa Grove Road and shuttle", note: "Closes about November 30; opens no earlier than April 15", s: "cccvoooooooc" },
    { name: "Hetch Hetchy Road", note: "Open all year, sunrise to sunset", s: "oooooooooooo" },
    { name: "Valley roads and Highways 41, 120, 140", note: "No seasonal closure; storms and chain rules still apply", s: "oooooooooooo" },
  ];
  const STATE = { o: ["is-open", "Open", "open"], v: ["is-varies", "Opens when the snow allows", "opening season"], w: ["is-closing", "Usually closes in November", "usually closes"], c: ["is-closed", "Closed", "closed"] };
  const TIOGA = ROADS[0].s;
  const GLACIER = ROADS[1].s;

  // Reservation windows the Park Service enforced, hours on a 5 a.m. to 8 p.m. axis.
  const CLOCK = [
    ["2022 peak hours", 6, 16, "6 a.m. to 4 p.m.", "is-nps"],
    ["2024 Peak Hours Plus", 5, 16, "5 a.m. to 4 p.m.", "is-nps"],
    ["2025 peak hours", 6, 14, "6 a.m. to 2 p.m.", "is-nps"],
    ["Talus Field: in before", 5, 8, "Through the gate by 8 a.m.", "is-pick"],
    ["Talus Field: or after", 16, 20, "After 4 p.m.", "is-pick"],
  ];
  const AX0 = 5, AX1 = 20;

  // Month cards: what each month decides, in the Park Service's words or the
  // articles this site publishes. `next` marks the months still ahead on
  // October 1, 2026.
  const MCARD = [
    { t: "The quietest month by the Park Service's averages. The Valley is open and mostly empty, and chains ride in the car." },
    { t: "Firefall month: Horsetail Fall can glow at sunset, February 10 to 26 in 2026, depending on weather and water flow. The park used staff, not reservations, to manage it.", y: "2026: February +12% on 2025." },
    { t: "Waterfalls building against a fraction of summer's crowds. Spring break weeks fill the Valley lots.", y: "2026: 225,817 visits, up 45%, the busiest March since 2016." },
    { t: "Full falls, light crowds. Tioga Road is still closed in most years, and the Mariposa Grove road opens no earlier than April 15.", y: "2026: April +2%." },
    { t: "Peak waterfall month. Memorial Day weekend behaves like July: Valley parking has filled as early as 8 a.m.", y: "2026: Glacier Point Road opened May 9, Tioga Road May 15." },
    { t: "Peak season. School breaks build the crowds, and the falls start to thin.", y: "2026: 634,508 visits, the second-busiest June on record." },
    { t: "The busiest month on average. Every road is usually open, the Valley runs hot, and the big falls thin.", y: "2026: 654,356 visits, up 6.1%. July 4 and Juneteenth ran without significant delays." },
    { t: "Nearly as busy as July. Smoke season starts to matter, and the falls are near dry." },
    { t: "The split month. Labor Day weekend (September 5 to 7 in 2026) behaves like July; the days after it do not." },
    { t: "The sleeper. Cooler days, fall color in the Valley, and the first storms. Tioga Road usually stays open for most of the month.", y: "2025: Tioga Road closed temporarily October 13 and reopened October 17.", next: true },
    { t: "Quiet except for Thanksgiving week (November 26 in 2026). Days are short, and the high roads close.", next: true },
    { t: "Quiet until the holiday week, when the lodges fill and the Valley loop slows.", next: true },
  ];

  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const pc = (v, max) => Math.max(0.6, (v / max) * 100).toFixed(2) + "%";

  // ── Charts ────────────────────────────────────────────────────────────────
  function TypicalYear() {
    const label = "Column chart of average monthly visits to Yosemite, 2010 to 2024, on a scale where July is 100. " +
      MONTHS.map((m, i) => m + " " + INDEX[i] + " (" + fmt(AVG[i]) + " visits)").join(", ") + ". May through October carry nearly 75 percent of the year.";
    return (
      <figure className="wv-fig">
        <div className="wv-cols" role="img" aria-label={label}>
          {MONTHS.map((m, i) => (
            <div key={m} className={"wv-col" + (i >= 4 && i <= 9 ? " is-peak" : "")} aria-hidden="true">
              <b>{INDEX[i]}</b>
              <i style={{ height: INDEX[i] + "%" }} />
              <span>{m}</span>
            </div>
          ))}
        </div>
        <figcaption>
          Average monthly visits, 2010 to 2024, on a scale where July (624,559) is 100. The darker bars, May through October, carry nearly 75 percent of the year. Source: National Park Service, Yosemite Visitation Statistics. Index: The Talus Field.
        </figcaption>
      </figure>
    );
  }

  function DecadeBars() {
    const flat = SCEN[0].total, fast = SCEN[2].total;
    const label = "Bar chart of Yosemite recreation visits by year. " +
      YEARS.map((r) => r.y + ": " + fmt(r.v)).join("; ") +
      ". 2026 is projected between 4,475,340 and 4,620,759, which would rank second behind 2016.";
    return (
      <figure className="wv-fig">
        <ol className="wv-hbars" role="img" aria-label={label}>
          {YEARS.map((r) => (
            <li key={r.y} aria-hidden="true">
              <span className="wv-hbars__y">{r.y}</span>
              <span className="wv-hbars__track"><i style={{ width: pc(r.v, MAXY) }} /></span>
              <b className="wv-hbars__v">{(r.v / 1e6).toFixed(2)}M</b>
              <small>{r.rule}</small>
            </li>
          ))}
          <li className="is-proj" aria-hidden="true">
            <span className="wv-hbars__y">2026</span>
            <span className="wv-hbars__track">
              <i className="wv-hbars__ytd" style={{ width: pc(YTD26, MAXY) }} />
              <i className="wv-hbars__proj" style={{ left: pc(YTD26, MAXY), width: (((fast - YTD26) / MAXY) * 100).toFixed(2) + "%" }} />
              <i className="wv-hbars__flat" style={{ left: pc(YTD26, MAXY), width: (((flat - YTD26) / MAXY) * 100).toFixed(2) + "%" }} />
            </span>
            <b className="wv-hbars__v">4.5 to 4.6M</b>
            <small>No reservations. Solid: counted through July. Hatched: the site's projection.</small>
          </li>
        </ol>
        <figcaption>
          Recreation visits per year, in millions. Source: NPS Visitor Use Statistics for 2016 to 2025; reservation dates from the park's announcements; 2026 projection by The Talus Field (method below).
        </figcaption>
      </figure>
    );
  }

  function JuneJuly() {
    const MAXJ = 700000;
    const label = "Bar chart of June and July visits in 2024, 2025 and 2026. June: 588,251, 607,410, 634,508. July: 596,711, 616,551, 654,356. Each year is higher than the last as reservation rules loosened.";
    return (
      <figure className="wv-fig">
        <div className="wv-jj" role="img" aria-label={label}>
          {JUNJUL.map((g) => (
            <div key={g.m} className="wv-jj__group" aria-hidden="true">
              <h3>{g.m}</h3>
              <ol>
                {g.rows.map(([y, v, rule]) => (
                  <li key={y} className={y === "2026" ? "is-now" : ""}>
                    <span className="wv-jj__y">{y}</span>
                    <span className="wv-jj__track"><i style={{ width: pc(v, MAXJ) }} /></span>
                    <b>{fmt(v)}</b>
                    <small>{rule}</small>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <figcaption>
          Recreation visits in the two peak months. 2024 ran Peak Hours Plus, 2025 a scaled-back version, 2026 nothing. Source: NPS Visitor Use Statistics as quoted in park reports.
        </figcaption>
      </figure>
    );
  }

  function GateGrowth() {
    const label = "Bar chart of visitation growth January to July 2026 over 2025 by entrance: " +
      GATES.map(([n, g]) => n + " up " + g + " percent").join("; ") + ". Hetch Hetchy was down.";
    return (
      <figure className="wv-fig wv-fig--small">
        <ol className="wv-gates" role="img" aria-label={label}>
          {GATES.map(([n, g]) => (
            <li key={n} aria-hidden="true">
              <span>{n}</span>
              <span className="wv-gates__track"><i style={{ width: pc(g, 25) }} /></span>
              <b>+{g}%</b>
            </li>
          ))}
          <li aria-hidden="true"><span>Hetch Hetchy</span><span className="wv-gates__track" /><b>Down</b></li>
        </ol>
        <figcaption>
          Change in visitation by entrance, January to July 2026 against the same months of 2025, as reported September 1 from Park Service data (Sierra News Online). Not checked against the Park Service's own table.
        </figcaption>
      </figure>
    );
  }

  function RoadStrip() {
    const label = "Seasonal pattern of Yosemite's roads by month. Tioga Road: closed January to April, opens in May or June depending on snow, open July to October, usually closes in November, closed December. Glacier Point Road: closed January to April, opens in May, open June to October, usually closes in November. Mariposa Grove Road and shuttle: closed January to March, opens April 15 at the earliest, open through November, closed December. Hetch Hetchy Road, the Valley roads and the highways into the park have no seasonal closure.";
    return (
      <figure className="wv-fig">
        <div className="wv-roads" role="img" aria-label={label}>
          <div className="wv-roads__head" aria-hidden="true">
            <span />
            {MONTHS.map((m) => <b key={m}>{m[0]}</b>)}
          </div>
          {ROADS.map((r) => (
            <div key={r.name} className="wv-roads__row" aria-hidden="true">
              <span className="wv-roads__name">{r.name}<small>{r.note}</small></span>
              <span className="wv-roads__cells">
                {r.s.split("").map((c, i) => <i key={i} className={STATE[c][0]} title={FULL[i] + ": " + STATE[c][1]} />)}
              </span>
            </div>
          ))}
        </div>
        <ul className="wv-key" aria-hidden="true">
          <li className="is-open">Open</li>
          <li className="is-varies">Opens when the snow allows</li>
          <li className="is-closing">Usually closes</li>
          <li className="is-closed">Closed</li>
        </ul>
        <figcaption>
          The Park Service's seasonal pattern: Tioga and Glacier Point roads close from sometime in November to late May or early June; the Mariposa Grove road and shuttle close on or about November 30 and reopen no earlier than April 15. Road status changes with the weather, so check the conditions page the morning you drive in.
        </figcaption>
      </figure>
    );
  }

  function ClockChart() {
    const span = AX1 - AX0;
    const ticks = [5, 8, 11, 14, 17, 20];
    const hr = (h) => (h === 12 ? "12p" : h > 12 ? h - 12 + "p" : h + "a");
    const label = "Chart of the hours the Park Service gated with reservations, 5 a.m. to 8 p.m. In 2022 reservations covered 6 a.m. to 4 p.m., in 2024 5 a.m. to 4 p.m., in 2025 6 a.m. to 2 p.m. The site's advice is to be through the gate before 8 a.m. or to arrive after 4 p.m.";
    return (
      <figure className="wv-fig">
        <div className="wv-clock" role="img" aria-label={label}>
          {CLOCK.map(([name, a, b, txt, cls]) => (
            <div key={name} className="wv-clock__row" aria-hidden="true">
              <span className="wv-clock__name">{name}</span>
              <span className="wv-clock__track">
                <i className={cls} style={{ left: (((a - AX0) / span) * 100).toFixed(2) + "%", width: (((b - a) / span) * 100).toFixed(2) + "%" }}><em>{txt}</em></i>
              </span>
            </div>
          ))}
          <div className="wv-clock__axis" aria-hidden="true">
            <span />
            <span className="wv-clock__ticks">
              {ticks.map((h) => <b key={h} style={{ left: (((h - AX0) / span) * 100).toFixed(2) + "%" }}>{hr(h)}</b>)}
            </span>
          </div>
        </div>
        <figcaption>
          The grey bars are the hours the Park Service itself treated as over capacity when it ran reservations: 2022, 2024 and 2025. The green bars are this article's advice, not a Park Service rule. Hourly entrance counts are not published, so none are drawn.
        </figcaption>
      </figure>
    );
  }

  // ── Article ───────────────────────────────────────────────────────────────
  return (
    <div className="wv-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="ticket" /><dt>Reservations</dt><dd>None in 2026</dd></div>
          <div><EventIcon name="users" /><dt>Through July</dt><dd>2,657,602 visits, up 8%</dd></div>
          <div><EventIcon name="calendar" /><dt>Busiest month</dt><dd>July, by the 15-year average</dd></div>
          <div><EventIcon name="clock" /><dt>Best hour</dt><dd>In before 8 a.m. or after 4 p.m.</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the answer, and the whole page in six lines beside it. */}
      <section className="hp-wrap hp-section wv-open">
        <div className="ff-split">
          <div className="wv-prose">
            <p className="dropcap">
              Yosemite needs no reservation in 2026, and it is on pace for the second-busiest year on record. The park counted 2,657,602 visits through July, 8 percent ahead of 2025. So the question is no longer whether you can get in. It is which month, which day and which hour. The short answer: midweek in October is the best window left this year, and on any other trip, be through the gate before 8 a.m. or arrive after 4 p.m.
            </p>
            <p>
              In March, 225,817 people visited, 45 percent more than the March before and the busiest March since 2016. Memorial Day weekend showed what no throttle looks like: Valley parking filling as early as 8 a.m. and entrance waits that reports put past an hour. I made <a href="/articles/yosemite-needs-a-reservation-system">my argument about whether this was a good idea</a> after that weekend. This piece answers the question that arrives in my inbox every week now: when should you actually come?
            </p>
            <p>
              I went through the National Park Service's visitor use statistics: annual visits since 2016, the Park Service's 15-year monthly averages, and the 2026 counts as the park has published them. This edition was rebuilt on October 1, so the forecast looks at the months still ahead, then at 2027. Every figure is either a published number or arithmetic on published numbers, and anything that is my projection says so.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="calendar" /> The short version</p>
            <ul>
              <li>No reservation is needed in 2026. The park manages traffic with staff, parking control and live information instead.</li>
              <li>July, August and June are the busiest months. January, February and December are the quietest.</li>
              <li>The best window left in 2026: midweek in October, then early-November weekdays.</li>
              <li>Any summer day: through the gate before 8 a.m., or after 4 p.m.</li>
              <li>Text YNPTRAFFIC to 333111 for live parking and traffic updates.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="sec-0-the-throttle-is-gone" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">THE THROTTLE IS GONE</p>
          <h2>Demand rose every year, with or without a gate</h2>
          <p className="ff-lede">
            Yosemite has spent six years running an accidental experiment in demand management. Visitation has climbed every year since 2020, through every version of the rules. The reservation systems did not reduce the wish to be here. They moved it, spread it and metered it.
          </p>
          <DecadeBars />
          <div className="wv-two">
            <p>
              <strong>2024 was the broadest system.</strong> Peak Hours Plus required a reservation from 5 a.m. to 4 p.m., on weekends from April 13 to June 30, every day from July 1 to August 16, and on weekends again from August 17 to October 27. Entry after 4 p.m. needed none.
            </p>
            <p>
              <strong>2025 was the scaled-back version.</strong> A reservation was required from 6 a.m. to 2 p.m. over Memorial Day weekend (May 24 to 26), every day from June 15 to August 15, and over Labor Day weekend (August 30 to September 1). Each cost $2 and was good for three days.
            </p>
            <p>
              <strong>2026 has none.</strong> The Park Service said it would no longer use a timed reservation system, and for the first time in three years the February firefall weekends ran without one. It is managing the year with real-time traffic monitoring, active parking management and visitor information tools instead.
            </p>
          </div>
          <p className="ff-note">
            2025 was the fourth-busiest year on record, behind 2016, 2019 and 2017. These are recreation visits, the series the Park Service publishes in its Visitor Use Statistics. The park's own statistics page prints a differently counted annual series (4,285,729 for 2024); nothing here mixes the two.
          </p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-1-what-2026-looks-like-so-far" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">2026 SO FAR</p>
            <h2>Eight percent ahead, with spring leading</h2>
            <p className="ff-lede">
              Through July the park logged 2,657,602 visits against 2,460,675 in the same months of 2025. The growth was not even. Spring jumped, and the peak months rose more modestly.
            </p>
            <div className="wv-prose">
              <p>
                March, the first full month after the no-reservation news, was up 45 percent, although the comparison flatters 2026 a little because storms held March 2025 down. February was up 12 percent and April up 2 percent. Headlines move visitation, and this year's headline was that Yosemite is open with no ticket required.
              </p>
              <p>
                June came in at 634,508 visits, the second-busiest June on record behind only 2016. July was 654,356 by the August reports, up 6.1 percent on July 2025. A Park Service summary published September 1 quotes July as 665,877, up 8 percent, and the first seven months as about 2.59 million, up 9.5 percent. The counts do not agree to the visit, so read them as eight to ten percent ahead, not as a decimal.
              </p>
            </div>
          </div>
          <div className="wv-stack">
            <div className="wv-tablewrap">
              <table className="wv-table">
                <caption>Recreation visits, 2026 against 2025</caption>
                <thead><tr><th scope="col">Period</th><th scope="col">2026</th><th scope="col">2025</th><th scope="col">Change</th></tr></thead>
                <tbody>
                  {SOFAR.map((r) => (
                    <tr key={r.p}>
                      <th scope="row">{r.p}<small>{r.n}</small></th>
                      <td>{fmt(r.a)}</td>
                      <td>{r.b ? fmt(r.b) : "n/a"}</td>
                      <td><b>{r.c}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ff-note">
              Sources: Park Service reports quoted in the press, August 23 and September 1, 2026. May is the January to July total minus the other rows. The March 2025 figure is not printed here because it was not published; 225,817 is 44.98 percent above it.
            </p>
          </div>
        </div>
        <GateGrowth />
      </section>

      <section className="ff-band" id="sec-2-what-the-reservation-years-actually-did" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">WHAT THE RESERVATION YEARS DID</p>
          <h2>Each loosening was followed by a busier summer</h2>
          <p className="ff-lede">
            To see why 2026 summer set near-records, look at the two peak months under each rule. June and July rose in 2025 when the system was trimmed, and again in 2026 when it was removed.
          </p>
          <JuneJuly />
          <div className="wv-two">
            <p>
              <strong>The Park Service's own 2025 count.</strong> Visitation through August 2025 totaled 2,919,722, up seven percent on the same months of 2024 (2,727,496), and every month outpaced 2024 except February, when winter storms limited access.
            </p>
            <p>
              <strong>What stayed manageable.</strong> The park counts only two days of significant delays in 2026, both over Memorial Day weekend, against more than 120 days of gridlock in past years. It credits digital passes, fast lanes at the entrances, added Valley parking, extra shuttles and published entrance wait times.
            </p>
            <p>
              <strong>What the visitors said.</strong> In a Washington State University survey for the park, taken August 7 to 16 with 1,203 responses, 91 percent had no entrance delay or waited less than 15 minutes, 56 percent spent less time looking for parking than they expected, and 11 percent said parking took somewhat or much too long.
            </p>
          </div>
          <p className="ff-note">A survey of ten August days is not a summer-long wait time. Memorial Day weekend is the counterexample, and holiday weekends are where a full road network binds.</p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-3-how-i-built-the-forecast" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE PROJECTION</p>
            <h2>How I built it, and what it says</h2>
            <p className="ff-lede">
              This is the site's projection, not a Park Service number. It rests on one count and one assumption, and it holds up across a wide range of the assumption.
            </p>
            <ol className="wv-steps">
              <li><strong>Start with what is counted.</strong> January to July 2026: {fmt(YTD26)} visits.</li>
              <li><strong>Add the rest of 2025.</strong> The 2025 total (4,278,413) minus January to July 2025 (2,460,675) is {fmt(REST25)} visits for August to December.</li>
              <li><strong>Scale it.</strong> Multiply that remainder by how much busier August to December 2026 runs than 2025. I show zero, four and eight percent; eight is the year-to-date pace.</li>
            </ol>
            <p className="ff-note">
              I no longer publish a month-by-month visit forecast. The first version of this article estimated months the Park Service had not yet reported, and some of those estimates were wrong once the real numbers arrived. The Park Service posts August to December as the months close; this page will take those instead.
            </p>
          </div>
          <div className="wv-stack">
            <div className="wv-tablewrap">
              <table className="wv-table wv-table--scen">
                <caption>Where 2026 ends, by scenario</caption>
                <thead><tr><th scope="col">August to December</th><th scope="col">2026 total</th><th scope="col">Rank</th></tr></thead>
                <tbody>
                  {SCEN.map((s) => (
                    <tr key={s.g}>
                      <th scope="row">{s.label}</th>
                      <td>{fmt(s.total)}</td>
                      <td><b>2nd</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="wv-rank">
              <li><strong>Second place holds</strong> unless August to December comes in about 3 percent below 2025 or worse: 2019 (4,422,861) needs {fmt(NEED_2019)} more visits after July, against {fmt(REST25)} in the same months of 2025.</li>
              <li><strong>First place is out of reach.</strong> Beating 2016 (5,028,868) would take about 30 percent more than 2025 over those five months.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="ff-band" id="sec-4-the-crowd-calendar" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">THE CROWD CALENDAR</p>
          <h2>Every month, on the Park Service's own averages</h2>
          <p className="ff-lede">
            The best planning tool is the park's 15-year monthly average. July is the busiest month, August is nearly as busy, and the six months from May to October carry nearly three-quarters of the year. 2026 has run about eight percent above 2025, so read every bar as a little taller.
          </p>
          <TypicalYear />
          <p className="ff-note">The index and the cards below do not split weekdays from weekends. The Park Service does not publish a weekday series, and the first version of this article invented one.</p>

          <ol className="wv-months">
            {MCARD.map((c, i) => (
              <li key={FULL[i]} className={c.next ? "is-next" : ""} style={{ "--v": (INDEX[i] / 100).toFixed(2) }}>
                <header>
                  <h3>{FULL[i]}</h3>
                  {c.next ? <span className="wv-tag">Still ahead in 2026</span> : null}
                </header>
                <p className="wv-months__num"><b>{INDEX[i]}</b> on the July scale <span>{fmt(AVG[i])} visits, 15-year average</span></p>
                <span className="wv-meter" aria-hidden="true"><i /></span>
                <p>{c.t}</p>
                {c.y ? <p className="wv-months__y">{c.y}</p> : null}
                <p className="wv-months__roads">
                  Tioga Road: {STATE[TIOGA[i]][2]}. Glacier Point Road: {STATE[GLACIER[i]][2]}.
                </p>
              </li>
            ))}
          </ol>
          <p className="ff-lede wv-after">
            Two links go with the calendar. <a href="/articles/yosemite-in-june">Low snowpack pushed the waterfall peak into May</a> this year, so the falls were past their best while the crowds were at theirs. And in September, <a href="/articles/yosemite-in-september-2026">the concessions start closing around you</a>: summer weather and open high country, with the crowds thinned. December is also <a href="/articles/bracebridge-dinner-and-vintners-holidays">the Bracebridge Dinner month at The Ahwahnee</a>.
          </p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="what-is-open-when" tabIndex={-1}>
        <p className="hp-eyebrow">WHAT IS OPEN, WHEN</p>
        <h2>The roads decide more than the crowds do</h2>
        <p className="ff-lede">
          A quiet month is no use if the road you came for is closed. The seasonal roads follow snow, not the calendar, and this year's openings were early.
        </p>
        <RoadStrip />
        <p className="ff-note">
          As the Park Service's conditions page read on October 1, 2026, Glacier Point Road was closed for smoke and firefighting, and the Mist Trail was open Friday to Sunday and holidays, and Monday to Thursday only from 3:30 p.m. to 7 a.m., through October. Both change, so check it before you drive.
        </p>
      </section>

      <section className="ff-band" id="sec-5-the-clock-beats-the-calendar" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE CLOCK BEATS THE CALENDAR</p>
              <h2>The hour you reach the gate matters most</h2>
              <p className="ff-lede">
                The difference between a miserable Yosemite day and a great one is mostly when you reach the gate. The Park Service has published its own definition of over capacity three times, in the hours it gated.
              </p>
              <div className="wv-prose">
                <p>
                  Every reservation system covered the same stretch of the day, from 5 or 6 in the morning to 2 or 4 in the afternoon. With no system in 2026, you enforce it on yourself. Valley parking fills early on peak days: reports put it as soon as 8 a.m. over Memorial Day weekend, and typically between 10 and 11 a.m. on summer Saturdays and holidays.
                </p>
              </div>
            </div>
            <ul className="ff-rules wv-rules">
              <li><EventIcon name="sun" /><strong>Be through by 8</strong><p>Before 7 on summer weekends. A Tuesday or Wednesday through the gate by 7:30 beats a Saturday.</p></li>
              <li><EventIcon name="clock" /><strong>Or arrive after 4</strong><p>Summer light lasts past 8. An evening visit with dinner outside the park beats a noon arrival.</p></li>
              <li><EventIcon name="no" /><strong>Skip 9 to 2</strong><p>On a summer weekend, the entrance lines form and the Valley lots close behind you.</p></li>
              <li><EventIcon name="car" /><strong>Stay parked</strong><p>Use the shuttles and bikes. A Valley spot on a July Saturday is not worth gambling for twice.</p></li>
            </ul>
          </div>
          <ClockChart />
          <p className="ff-note">
            Text <strong>YNPTRAFFIC</strong> to <strong>333111</strong> for the park's live parking and traffic updates, and check road and lot status before you commit to the drive. This is the same Highway 140 gate guidance I watch every morning from El Portal.
          </p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-6-the-days-i-would-pick" tabIndex={-1}>
        <p className="hp-eyebrow">THE DAYS I WOULD PICK</p>
        <h2>If I were planning from outside the area</h2>
        <p className="ff-lede">
          Plan for <a href="/articles/yosemite-in-three-to-five-days">enough days to give each part of the park its own day</a>, then choose in this order.
        </p>
        <ol className="wv-picks">
          <li>
            <span>Best left in 2026</span>
            <strong>Midweek in October</strong>
            <p>The 15-year average for October is 62 on the July scale, about 38 percent below July. Cooler days, quieter trails and <a href="/articles/yosemite-in-fall">fall color in the Valley</a> by the back half of the month. Tioga Road usually stays open, but the first storm can close it: in 2025 the park closed it temporarily on October 13 and reopened it October 17. See also <a href="/articles/yosemite-in-october-2026">Yosemite in October 2026</a>.</p>
          </li>
          <li>
            <span>Quieter still</span>
            <strong>Early November, midweek</strong>
            <p>November averages 31 on the July scale: the Valley close to empty, at the price of short days. Skip Thanksgiving week, and expect the high roads to close.</p>
          </li>
          <li>
            <span>For 2027</span>
            <strong>The days after Labor Day</strong>
            <p>September averages 82 on the July scale, and the Park Service gated Labor Day weekend in 2025, so plan around that weekend and take the days after it. The last week of September is also <a href="/articles/yosemite-facelift-volunteer-guide">the Yosemite Facelift, the park's biggest volunteer cleanup</a> (September 23 to 27 in 2026), and it fits into a normal visit.</p>
          </li>
          <li>
            <span>For 2027</span>
            <strong>Spring, for the waterfalls</strong>
            <p>Waterfalls at full volume against a fraction of summer's crowds. But this year proved that spring is where new growth lands first: March was up 45 percent. Expect next March to look like this year's April.</p>
          </li>
          <li>
            <span>If summer is what you have</span>
            <strong>A Tuesday or Wednesday, in by 7:30</strong>
            <p>A well-run July weekday beats a badly run September Saturday. My <a href="/articles/yosemite-without-reservations-2026">no-reservations strategy piece</a> covers the full playbook, and if it is your first visit, <a href="/articles/first-time-yosemite-overwhelm">start here instead</a>.</p>
          </li>
        </ol>
        <div className="ff-alert wv-avoid">
          <EventIcon name="alert" />
          <p><strong>Days to plan around.</strong> Memorial Day weekend, the one weekend that backed up in 2026. Any summer Saturday arriving after 8:30 a.m. Labor Day weekend. The holiday week in late December if you are not staying in the park. The park says July 4 ran without significant delays this year, but a holiday Saturday is the day to leave the margin on.</p>
        </div>
      </section>

      <section className="ff-band" id="sec-7-what-could-bend-the-curve" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">WHAT COULD CHANGE</p>
          <h2>What would bend the curve</h2>
          <p className="ff-lede">
            Forecasts age badly in public, so here is what would change this one.
          </p>
          <ul className="ff-rules wv-bend">
            <li><EventIcon name="cloud" /><strong>Smoke</strong><p>A bad smoke season can erase an August, and fire can close a road: Glacier Point Road was closed for it on October 1.</p></li>
            <li><EventIcon name="users" /><strong>Coverage</strong><p>If early-season chaos keeps making national news, some casual visitors will stay home, and fall comes in under the line.</p></li>
            <li><EventIcon name="alert" /><strong>Policy</strong><p>A shutdown, a flood or a reversal of the no-reservation decision would bend the curve. None is announced.</p></li>
            <li><EventIcon name="check" /><strong>The management</strong><p>By the park's own count the toolkit held: two delay days all year, against more than 120 in past years.</p></li>
          </ul>
          <p className="ff-lede wv-after">
            None of that changes the planning logic. Demand for this park has risen every year since 2020, the gate is open in 2026, and the only variables you control are the month, the day and the hour. Choose all three on purpose. The park at 6:45 on a September morning is still the park that made the record books, minus the line to get in.
          </p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="when-to-visit-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>When to visit, answered</h2>
            <div className="wv-sources">
              <h3>Sources, read October 1, 2026</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/visitation.htm" target="_blank" rel="noopener noreferrer">Visitation statistics (monthly averages, 2010 to 2024), NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/learn/management/statistics.htm" target="_blank" rel="noopener noreferrer">Park statistics, NPS Yosemite</a> and <a href="https://irma.nps.gov/STATS/" target="_blank" rel="noopener noreferrer">NPS Visitor Use Statistics</a> (annual recreation visits 2016 to 2025, as compiled by <a href="http://www.nationalsitesguide.com/sites/yosemite/visitation/" target="_blank" rel="noopener noreferrer">National Sites Guide</a>, since the NPS report viewer does not render in plain text)</li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/reservations.htm" target="_blank" rel="noopener noreferrer">Entrance reservations, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/learn/news/more-visitors-less-waiting-yosemite-survey-shows-strong-peak-season-visitor-experience.htm" target="_blank" rel="noopener noreferrer">More Visitors, Less Waiting: Yosemite Survey Shows Strong Peak-Season Visitor Experience, NPS, August 28, 2026</a></li>
                <li><a href="https://www.nps.gov/yose/learn/news/yosemite-national-park-reports-strong-summer-visitation-numbers.htm" target="_blank" rel="noopener noreferrer">Yosemite reports strong summer visitation numbers, NPS, September 4, 2025</a></li>
                <li><a href="https://home.nps.gov/yose/learn/news/yosemite-national-park-announces-summer-reopenings-full-campground-access-and-early-tioga-road-opening.htm" target="_blank" rel="noopener noreferrer">Summer reopenings and early Tioga Road opening, NPS, May 13, 2026</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/wroads.htm" target="_blank" rel="noopener noreferrer">Winter road closures</a> and <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">current conditions, NPS Yosemite</a></li>
                <li><a href="https://sierranewsonline.com/more-visitors-shorter-waits-yosemite-releases-new-summer-data/" target="_blank" rel="noopener noreferrer">Sierra News Online, September 1, 2026</a> (July count, entrance growth) and <a href="https://www.activenorcal.com/yosemite-says-its-traffic-problem-is-solved-the-internet-isnt-so-sure/" target="_blank" rel="noopener noreferrer">Active NorCal, August 23, 2026</a> (July count, parking) and <a href="https://www.activenorcal.com/yosemite-just-had-one-of-the-busiest-junes-in-its-history/" target="_blank" rel="noopener noreferrer">Active NorCal, July 12, 2026</a> (June and March)</li>
                <li><a href="https://abc7news.com/post/what-know-before-going-yosemite-long-waits-packed-trails-crowds-surge-reservation-system-ends/19177255/" target="_blank" rel="noopener noreferrer">ABC7, crowds after the reservation system ends</a> (monthly change, parking, the traffic text line) and <a href="https://www.islands.com/2077936/yosemite-famed-winter-firefall-free-without-reservatins-first-time-years" target="_blank" rel="noopener noreferrer">Islands, the 2026 firefall without reservations</a></li>
                <li>The 2021, 2022, 2024 and 2025 reservation dates and the October 13, 2025 Tioga Road closure are from the park's announcements of those years, as carried by Sierra Rec Magazine, Sierra Wave and the Sierra Times.</li>
              </ul>
              <p className="ff-note">Where two sources differ, the page says so. The July 2026 count, the year-to-date total and the entrance percentages are the ones to recheck when the Park Service posts August.</p>
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
