/* global React, EventIcon, ResponsiveImage, LodgingCta, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Yosemite in May (October 2026), the evergreen month guide, built on the
// Mist Trail feature layout: the catalog entry carries a `feature` block
// (data.js), so page-article.jsx draws the full-width photo cover and hands
// this body the page's full width. Every section sits on the design's
// container (`hp-wrap`), alternating paper and the `ff-band` tint, and uses
// the shared `.ff-*` kit; the page-level `ym-*` rules are the `.ym-feature`
// layer in styles.css.
//
// Two rules hold it up.
//   1. Every date, fee, distance, time and rule restates the sources listed
//      at the foot of the page: the Park Service's weather, spring, waterfall,
//      Mist Trail, water safety, Half Dome, permit, fee, reservation, traffic,
//      camping, campground, road and Mariposa Grove pages, its historic
//      road-opening dataset and its May 13, 2026 release, Yosemite
//      Hospitality's lodging pages, and YARTS' route pages. The 2026 dates are
//      what happened in 2026, labeled as such; what May of another year will
//      bring is hedged, because the park says it cannot be predicted. Nothing
//      is added from memory.
//   2. The cards, lists and tables restate sentences in the prose beside
//      them, so the graphics add no fact of their own.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["yosemite-in-may"] = function YosemiteInMayBody() {
  const TOC = [
    ["#ym-waterfalls", "Waterfalls"],
    ["#ym-roads", "The high roads"],
    ["#ym-weather", "Weather"],
    ["#ym-crowds", "Crowds and Memorial Day"],
    ["#ym-halfdome", "Half Dome"],
    ["#ym-sleep", "Where to sleep"],
    ["#ym-weeks", "Week by week"],
    ["#ym-questions", "Questions"],
  ];

  // seo-data.json `faq`, word for word.
  const FAQ = [
    ["Is May a good time to visit Yosemite?", "For waterfalls, yes. The Park Service says the waterfalls are usually at their best in mid to late May, and the Valley averages a high of 71°F and a low of 45°F. The trade is that Tioga Road and Glacier Point Road may still be closed by snow, and Memorial Day weekend is one of the busiest of the year."],
    ["Is Tioga Road open in May?", "Sometimes. The Park Service says Tioga Road is typically open from late May or June, and that predicting the opening is not possible, even in late spring. In the twelve seasons from 2015 to 2026 it opened in May seven times, in June twice and in July three times. In 2026 it opened May 15."],
    ["Is Glacier Point Road open in May?", "Usually by sometime in May, but not always. The Park Service gives late May as the approximate opening to cars. In its records it opened in May in 2017, 2019, 2024 and 2025, and on May 9 in 2026; in other years it opened earlier, later, or not at all because of construction."],
    ["Are the Half Dome cables up in May?", "Usually for the last few days of the month. The Park Service says the cables usually go up the Friday before Memorial Day, subject to conditions, and a permit is required. In 2026 Half Dome opened May 15."],
    ["What is the weather like in Yosemite in May?", "In Yosemite Valley the 1991 to 2020 May averages are a high of 71°F, a low of 45°F and 1.9 inches of precipitation. Tuolumne Meadows averages a high of 54°F and a low of 27°F. The park says tire chains are sometimes required even in spring."],
    ["Do you need a reservation to enter Yosemite in May?", "Not in 2026: the Park Service announced it would not use a timed reservation system that year. Check the park's reservations page for any later year before you go. The entrance fee is $35 per private vehicle, good for seven days."],
  ];

  // ── The road record, from "The high roads" (the NPS historic dataset and,
  //    for 2026, the park's own road updates) ────────────────────────────────
  const ROADS = [
    ["2015", "May 4", "March 28"],
    ["2016", "May 18", "April 19"],
    ["2017", "June 29", "May 11"],
    ["2018", "May 21", "April 28"],
    ["2019", "July 1", "May 10"],
    ["2020", "June 15", "June 11"],
    ["2021", "May 27", "April 30"],
    ["2022", "May 27", "Did not open (road project)"],
    ["2023", "July 22", "July 15 (construction)"],
    ["2024", "June 10", "May 14"],
    ["2025", "May 26", "May 10"],
    ["2026", "May 15", "May 9"],
  ];

  // ── The month, from "Week by week" ────────────────────────────────────────
  const WEEKS = [
    { when: "Early May", name: "The falls build", cls: "is-peak",
      text: "The Valley trails are usually clear of snow by sometime in May. The high roads may or may not be open; most years Tioga is not yet." },
    { when: "Mid to late May", name: "Peak water", cls: "is-mid",
      text: "The Park Service says the waterfalls are usually at their best in mid to late May. Redbud and dogwood tend to bloom this month." },
    { when: "Memorial Day weekend", name: "Summer arrives", cls: "is-late",
      text: "The Half Dome cables usually go up the Friday before. Saturdays and holiday weekends are the park's busiest days; the lots are usually full by 8 am." },
  ];

  // ── Campgrounds open in May, from "Where to sleep" (2026, tentative) ──────
  const CAMPS = [
    ["Upper Pines", "Yosemite Valley", "All year"],
    ["Lower Pines", "Yosemite Valley", "April 21 to October 19"],
    ["North Pines", "Yosemite Valley", "April 21 to October 26"],
    ["Camp 4", "Yosemite Valley", "All year"],
    ["Wawona", "South, on Highway 41", "All year"],
    ["Hodgdon Meadow", "Big Oak Flat entrance", "All year"],
    ["Crane Flat", "Big Oak Flat Road", "May 21 to October 12"],
  ];

  return (
    <div className="ym-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="therm" /><dt>The Valley in May</dt><dd>Average 71°F high, 45°F low</dd></div>
          <div><EventIcon name="drop" /><dt>Waterfalls</dt><dd>Usually at their best mid to late May</dd></div>
          <div><EventIcon name="route" /><dt>Tioga Road</dt><dd>Open in May in 7 of the last 12 years</dd></div>
          <div><EventIcon name="dome" /><dt>Half Dome cables</dt><dd>Usually up the Friday before Memorial Day</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the month in three paragraphs and four lines. */}
      <section className="hp-wrap hp-section ym-open">
        <div className="ff-split">
          <div className="ym-prose">
            <p className="dropcap">
              May is the waterfall month. The Park Service says Yosemite's waterfalls are usually at their best in mid to late May, when the snow above the Valley rim is melting fastest, and the Valley floor is green, mild and mostly clear of snow. It is the month most people picture when they picture Yosemite.
            </p>

            <p>
              It is also a month of two parks. The Valley is open and running at full volume. The high country above it is still coming out of winter: Tioga Road and Glacier Point Road open when the plows finish, and the park says plainly that it cannot predict when that will be, even in late spring. Some years both are open by mid-May. Some years Tioga stays shut into July.
            </p>

            <p>
              And it ends with Memorial Day weekend, when summer arrives all at once. Plan the month around the water, keep the high country as a bonus, and treat the last weekend as a different trip.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>Waterfalls: usually at their best in mid to late May.</li>
              <li>Tioga and Glacier Point roads: open some Mays, not others. Check before you build a day on them.</li>
              <li>Valley weather: about 71°F by day, 45°F at night. Tuolumne is near freezing at night.</li>
              <li>Memorial Day weekend: be through the gate before 8 am, or skip the Valley that day.</li>
            </ul>
            <a className="ym-short__link" href="#ym-roads">Every Tioga opening since 2015 ↓</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="ym-waterfalls" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE WATERFALLS</p>
              <h2>The month the water peaks</h2>
              <div className="ym-prose">
                <p>
                  The Park Service puts it two ways. Its waterfall page says peak runoff typically happens in May or June; its spring page narrows that to mid to late May. Either way, May is the month to be standing under Yosemite Falls, 2,425 feet from the rim to the Valley floor, which by the park's own description is often a trickle or dry by August. The size of the show depends on the winter: a deep snowpack runs the falls hard into June, a thin one peaks early and fades. <a href="/articles/yosemite-waterfalls-guide">The waterfalls guide</a> goes fall by fall.
                </p>

                <p>
                  <strong>The Mist Trail is at its wettest.</strong> The park warns of "slippery footing and a tremendous amount of waterfall spray in spring and early summer." The Vernal Fall footbridge is 1.6 miles round trip from the trailhead, about an hour to an hour and a half, with 400 feet of climbing; the top of Vernal Fall is 2.4 miles round trip and about three hours, up more than 600 steps. Bring a rain shell for the spray. <a href="/articles/mist-trail-the-real-guide">The Mist Trail guide</a> has every turnaround.
                </p>

                <p>
                  <strong>The river is at its most dangerous.</strong> The Park Service says creeks and rivers tend to reach peak runoff in May or June, and that swimming at Emerald Pool and the Silver Apron above Vernal Fall is illegal because of the current. Sixteen people died in Yosemite's creeks and rivers between 2002 and 2011, by its count. Stay behind the railings and off the wet rock at the water's edge.
                </p>

                <p>
                  <strong>Beyond the Valley.</strong> The park calls Hetch Hetchy "an ideal place for thundering spring waterfalls and wildflower displays." Its road is open only from sunrise to sunset, vehicles longer than 25 feet are not allowed, and the lot typically fills at midday on weekends. <a href="/articles/hetch-hetchy-the-other-yosemite-valley">The Hetch Hetchy guide</a> covers the walk to the falls. On the Valley floor, the park says redbud and dogwood tend to bloom in May.
                </p>
              </div>
            </div>
            <figure className="ym-photo">
              <ResponsiveImage image="img/vernal-fall-high-water.jpg" style={{ aspectRatio: "2000 / 3000" }} sizes="(max-width: 880px) calc(100vw - 40px), 480px"
                alt="Vernal Fall in high water, white spray filling the granite gorge below it" />
              <figcaption>Vernal Fall in high water. In spring the Mist Trail beside it earns its name. Photo: Brandon Raines / Pexels</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ym-roads" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">TIOGA ROAD AND GLACIER POINT ROAD</p>
            <h2>The high roads open when the snow says so</h2>
            <div className="ym-prose">
              <p>
                <strong>Tioga Road.</strong> The Park Service says Tioga Road is typically open to vehicles from late May or June until sometime in November. Plowing begins on or about April 15 and usually takes one to two months, and the park says that predicting the opening "is not possible, even in late spring." Its own record bears that out. In the twelve seasons from 2015 to 2026, Tioga opened in May seven times, in June twice and in July three times, in the big snow years of 2017, 2019 and 2023. In 2026 it opened Friday, May 15, at 8 am, the plan for which is in <a href="/articles/tioga-road-opening-weekend">our Tioga Road opening weekend guide</a>.
              </p>

              <p>
                <strong>Glacier Point Road.</strong> The park gives the road's season as approximately late May through October or November. In practice it has often opened sooner: in March or April in four of the last twelve years, and in May in five, including May 9 in 2026. In the other three it opened in June, in July after construction, or not at all during a road project. <a href="/articles/glacier-point-road-open-2026">Our early-season Glacier Point plan</a> covers what is open at the top in the first weeks, when drinking water may not be on yet.
              </p>

              <p>
                <strong>Open does not mean summer.</strong> A road open in May reaches country that is still in winter. Tuolumne Meadows averages a May high of 54°F and a low of 27°F, and the park says most of Yosemite remains snowy through May and into June. In 2026 the park put vault and portable toilets along Tioga Road at the opening, but no drinking water. Plan short walks on the high roads, not the classic high-country hikes.
              </p>

              <p>
                For the current state of both roads, check <a href="/tioga-opening">our Tioga opening page</a> and the Park Service's conditions page, the night before you drive up.
              </p>
            </div>
          </div>
          <div>
            <h3 className="ym-sched__head">Opening day, by year</h3>
            <table className="ym-roads">
              <thead>
                <tr><th scope="col">Year</th><th scope="col">Tioga Road</th><th scope="col">Glacier Point Road</th></tr>
              </thead>
              <tbody>
                {ROADS.map(([year, tioga, gp]) => (
                  <tr key={year} className={/^May/.test(tioga) ? "is-may" : undefined}>
                    <th scope="row">{year}</th><td>{tioga}</td><td>{gp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="ff-note ym-roads__note">Park Service historic road data for 2015 to 2025; the park's road updates for 2026. Shaded rows: Tioga open in May. In 2019 Tioga opened June 21 for limited hours and without restriction on July 1.</p>
          </div>
        </div>
      </section>

      <section className="ff-band" id="ym-weather" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">WEATHER AND WHAT TO BRING</p>
            <h2>Warm days, cold nights, and chains in the trunk</h2>
            <div className="ym-prose">
              <p>
                The Park Service's 1991 to 2020 averages put a May day in Yosemite Valley, at 4,000 feet, at a high of 71°F and a low of 45°F, with 1.9 inches of precipitation for the month. That sits between April (63°F and 38°F, 3.2 inches) and June (81°F and 51°F, half an inch). Tuolumne Meadows, at 8,600 feet, averages 54°F and 27°F in May.
              </p>

              <p>
                <strong>Pack for both.</strong> A warm afternoon on the Valley floor and a freezing night in a campground are the same day in May. Bring layers, a rain shell for the falls, and real shoes for wet granite.
              </p>

              <p>
                <strong>Carry chains.</strong> The park says tire chains are sometimes required even in spring, and that when they are, you should carry them and know how to use them whatever you drive.
              </p>

              <p>
                <strong>Ticks.</strong> The park's advice is to walk down the middle of trails, since ticks wait on plants for a host to pass.
              </p>
            </div>
          </div>
          <table className="ym-temps">
            <caption>Monthly averages, 1991 to 2020 (NPS)</caption>
            <thead>
              <tr><th scope="col">Place</th><th scope="col">Month</th><th scope="col">High</th><th scope="col">Low</th><th scope="col">Precip.</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Yosemite Valley</th><td>April</td><td>63°F</td><td>38°F</td><td>3.2 in</td></tr>
              <tr className="is-may"><th scope="row">Yosemite Valley</th><td>May</td><td>71°F</td><td>45°F</td><td>1.9 in</td></tr>
              <tr><th scope="row">Yosemite Valley</th><td>June</td><td>81°F</td><td>51°F</td><td>0.5 in</td></tr>
              <tr className="is-may"><th scope="row">Tuolumne Meadows</th><td>May</td><td>54°F</td><td>27°F</td><td>1.7 in</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ym-crowds" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">CROWDS AND MEMORIAL DAY</p>
            <h2>A calm month with a crowded last weekend</h2>
            <div className="ym-prose">
              <p>
                <strong>Getting in.</strong> In 2026 the Park Service announced it would not use a timed reservation system, so a car needed only the entrance fee: $35 per private vehicle, good for seven consecutive days, or $20 per person, with those 15 and younger free. Non-US residents 16 and older also pay a $100 nonresident fee, waived with an annual or America the Beautiful pass. The entrance stations do not take cash. Whether a reservation returns for a later May is the park's call each year; check its reservations page before you go.
              </p>

              <p>
                <strong>Parking.</strong> The park's traffic page names Saturdays and holiday weekends as particularly busy and advises arriving before 8 am, after which parking is usually full. Its other line is the one to remember: if you find a space, leave the car there, because you will not find another. Text ynptraffic to 333111 for the park's traffic updates.
              </p>

              <p>
                <strong>Memorial Day weekend.</strong> The Monday holiday is the month's crowd. If you have that weekend and the high roads are open, our <a href="/articles/memorial-day-skip-the-valley-go-high-2026">Memorial Day plan</a> makes the case for spending the busiest hours above the Valley instead of in it.
              </p>

              <p>
                <strong>Without a car.</strong> YARTS' summer service starts late in May: in 2026 its Highway 41 route ran from May 22 and its Highway 120 West route from May 22. The Highway 395 route over Tioga Pass started July 1, not when the road opened. In the Mariposa Grove, the 2026 shuttle ran from May 3, 8 am to 7 pm; without it, the grove is a two-mile hike each way. <a href="/articles/mariposa-grove-how-to-visit">The Mariposa Grove guide</a> has the rest.
              </p>
            </div>
          </div>
          <div>
            <h3 className="ym-sched__head">A May Saturday, by the park's clock</h3>
            <ol className="ff-hours ym-sched">
              <li className="is-glow"><span>Before 8 am</span><p>Through the gate and parked. After this, the park says, parking is usually full.</p></li>
              <li><span>Once parked</span><p>Stay parked. The park says you will not find another space.</p></li>
              <li><span>Midday</span><p>Hetch Hetchy's lot typically fills on weekends.</p></li>
              <li><span>Any time</span><p>Text ynptraffic to 333111 for traffic updates.</p></li>
            </ol>
            <p className="ff-alert ym-alert">
              <EventIcon name="alert" />
              <span>
                <strong>Plan for the weekend, not the month.</strong> The park names Saturdays and holiday weekends as its busiest days. A Tuesday in early May and the Saturday of Memorial Day weekend are different trips.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="ff-band" id="ym-halfdome" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">HALF DOME</p>
            <h2>The cables usually go up at the end of the month</h2>
            <div className="ym-prose">
              <p>
                The Park Service says the Half Dome cables usually go up the Friday before Memorial Day, subject to conditions, and come down the day after the second Monday in October. In 2026 the park opened the hike on May 15, earlier than that. Either way, most of May falls before the cables, and a May trip built around Half Dome is a bet on the last week.
              </p>

              <p>
                A permit is required whenever the cables are up. The preseason lottery runs March 1 to 31; the daily lottery takes applications two days before the hike, from midnight to 4 pm Pacific, with results that night. Each application is $10, and each permit $10 a person, charged only when one is issued. The hike is 14 to 16 miles round trip with 4,800 feet of climbing, 10 to 12 hours for most people. <a href="/articles/so-you-want-to-hike-half-dome">Our Half Dome guide</a> makes the case for and against, and <a href="/half-dome-lottery">the lottery page</a> has the calendar.
              </p>

              <p>
                If the cables are down or the permit does not come, the waterfalls are the better May day anyway: the top of Nevada Fall is 5.4 miles round trip on the Mist Trail, five to six hours with 2,000 feet of climbing.
              </p>
            </div>
          </div>
          <figure className="ym-photo">
            <ResponsiveImage image="img/half-dome-permit-trail-sign.jpg" style={{ aspectRatio: "1600 / 1200" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="A trail sign on the Half Dome route stating that a permit is required to continue" />
            <figcaption>The permit sign on the Half Dome trail. Photo: Peter Maiwald / Wikimedia Commons (CC0)</figcaption>
          </figure>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ym-sleep" tabIndex={-1}>
        <p className="hp-eyebrow">WHERE TO SLEEP</p>
        <h2>Most of the park's beds are open; the high country's are not</h2>
        <div className="ff-split">
          <div className="ym-prose">
            <p>
              <strong>Campgrounds.</strong> The Valley's reservable campgrounds release sites five months ahead, on the 15th of each month at 7 am Pacific, and the park says they sell out within minutes. By the park's tentative 2026 dates, the Valley, Wawona and Hodgdon Meadow campgrounds were open through May, and Crane Flat opened May 21. The high-country campgrounds were not: Tuolumne Meadows, White Wolf, Yosemite Creek, Porcupine Flat and Tamarack Flat all opened in late June or July.
            </p>

            <p>
              <strong>Lodging.</strong> Yosemite Hospitality's 2026 seasons put Housekeeping Camp open from April 3 and Tuolumne Meadows Lodge from June 5, so the Tuolumne lodge is not a May option. Curry Village's heated tents keep the heat on until the Friday before Memorial Day. The concessioner's lodging list shows White Wolf Lodge and the Wawona Hotel as closed; the Wawona Hotel closed for a Park Service condition assessment. Check the concessioner's own calendar for how far ahead each property books. <a href="/articles/where-to-stay-in-yosemite">Where to stay in Yosemite</a> compares every option.
            </p>
          </div>
          <div>
            <h3 className="ym-sched__head">Campgrounds open in May (2026, tentative)</h3>
            <table className="ym-camps">
              <thead>
                <tr><th scope="col">Campground</th><th scope="col">Where</th><th scope="col">2026 season</th></tr>
              </thead>
              <tbody>
                {CAMPS.map(([name, where, season]) => (
                  <tr key={name}><th scope="row">{name}</th><td>{where}</td><td>{season}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ym-stay">
          {/* The in-park rooms book through Yosemite Hospitality and the
              campgrounds through Recreation.gov, so both are named without a
              link; the availability search is for when they are full. */}
          <LodgingCta
            destination="Yosemite National Park"
            heading="Rooms for a waterfall month"
            note={
              <>
                May's beds fill around the weekends, Memorial Day above all. Search the in-park rooms first; when they are gone, Mariposa and El Portal on Highway 140 are the low road in. <a href="/articles/yosemite-gateway-towns-compared">The gateway towns comparison</a> weighs all five.
              </>
            }
            list="article_cta"
            slug="yosemite-in-may"
            cta="Search May lodging around Yosemite →"
          />
        </div>
      </section>

      <section className="ff-band" id="ym-weeks" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">WEEK BY WEEK</p>
          <h2>Three Mays in one month</h2>
          <ol className="ym-weeks">
            {WEEKS.map((w) => (
              <li key={w.name} className={w.cls}>
                <span>{w.when}</span>
                <strong>{w.name}</strong>
                <p>{w.text}</p>
              </li>
            ))}
          </ol>

          <div className="ff-split ym-when">
            <div className="ym-prose">
              <p>
                <strong>Early May.</strong> The park says the Valley trails are usually snow-free by sometime in May, and weekdays are the calm side of the month. The high roads are the open question; in most of the last twelve years Tioga was still closed in the first week.
              </p>

              <p>
                <strong>Mid to late May.</strong> The water peaks. If you can choose only one week for waterfalls, this is the one the Park Service points to. In a warm, early year, the high roads may open now too.
              </p>

              <p>
                <strong>Memorial Day weekend.</strong> The cables usually go up on the Friday, in 2026 YARTS started its Highway 41 and 120 West summer routes that Friday too, and the Valley lots fill early. After it, <a href="/articles/yosemite-in-june">June</a> is early summer.
              </p>
            </div>
            <p className="ff-alert ym-alert">
              <EventIcon name="snow" />
              <span>
                <strong>Every road date here is a past year's.</strong> The park says it cannot predict the high roads' opening, even in late spring. Check its conditions page the week you go.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ym-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Yosemite in May, answered</h2>
            <div className="ym-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/spring.htm" target="_blank" rel="noopener noreferrer">Spring, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/weather.htm" target="_blank" rel="noopener noreferrer">Weather, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/waterfalls.htm" target="_blank" rel="noopener noreferrer">Waterfalls, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm" target="_blank" rel="noopener noreferrer">Vernal and Nevada Falls, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/watersafety.htm" target="_blank" rel="noopener noreferrer">Water safety, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/tioga.htm" target="_blank" rel="noopener noreferrer">Tioga Road, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/seasonal.htm" target="_blank" rel="noopener noreferrer">Seasonal roads and historic opening dates, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/glacierpoint.htm" target="_blank" rel="noopener noreferrer">Glacier Point, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/learn/news/yosemite-national-park-announces-summer-reopenings-full-campground-access-and-early-tioga-road-opening.htm" target="_blank" rel="noopener noreferrer">Summer reopenings, NPS news release, May 13, 2026</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/halfdome.htm" target="_blank" rel="noopener noreferrer">Half Dome, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/hdpermits.htm" target="_blank" rel="noopener noreferrer">Half Dome permits, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/fees.htm" target="_blank" rel="noopener noreferrer">Fees and passes, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/reservations.htm" target="_blank" rel="noopener noreferrer">Reservations, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/traffic.htm" target="_blank" rel="noopener noreferrer">Traffic, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/camping.htm" target="_blank" rel="noopener noreferrer">Camping, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/campgrounds.htm" target="_blank" rel="noopener noreferrer">Campground dates, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/mg.htm" target="_blank" rel="noopener noreferrer">Mariposa Grove, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/hetchhetchy.htm" target="_blank" rel="noopener noreferrer">Hetch Hetchy, NPS Yosemite</a></li>
                <li><a href="https://www.travelyosemite.com/lodging/" target="_blank" rel="noopener noreferrer">Lodging, Yosemite Hospitality</a></li>
                <li><a href="https://www.yarts.com/bus_routes/highway-41/" target="_blank" rel="noopener noreferrer">Highway 41 route, YARTS</a></li>
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

      <div className="hp-wrap ym-end">
        <AffiliateNote />
      </div>
    </div>
  );
};
