/* global React, EventIcon, ResponsiveImage, LodgingCta, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Yosemite, Sequoia and Kings Canyon in one trip (October 2026), built on the
// Mist Trail feature layout: the catalog entry carries a `feature` block
// (data.js), so page-article.jsx draws the full-width photo cover and hands
// this body the page's full width. Every section sits on the design's
// container (`hp-wrap`), alternating paper and the `ff-band` tint, and uses
// the shared `.ff-*` kit; the page-level `ys-*` rules are the `.ys-feature`
// layer in styles.css.
//
// Two rules hold it up.
//   1. Every distance, drive time, fee, date and rule restates the sources
//      listed at the foot of the page: Yosemite's driving and fees pages, its
//      reservations and Mariposa Grove pages, and Sequoia and Kings Canyon's
//      directions, driving directions, fees, conditions, hours, FAQ, summer
//      drives, Kings Canyon, lodging and park shuttle pages, plus the parks'
//      2025-2026 winter Trip Planner. Yosemite's table of drive times to
//      Sequoia and Kings Canyon does not name its starting point, and the page
//      says so. The pass arithmetic is ours, from those published fees.
//   2. The cards, lists and tables restate sentences in the prose beside
//      them, so the graphics add no fact of their own.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["yosemite-sequoia-kings-canyon-trip"] = function YosemiteSequoiaKingsCanyonTripBody() {
  const TOC = [
    ["#ys-route", "The route"],
    ["#ys-drives", "Drive times"],
    ["#ys-passes", "Passes"],
    ["#ys-plans", "Itineraries"],
    ["#ys-seasons", "Seasons"],
    ["#ys-stay", "Where to sleep"],
    ["#ys-arrive", "Flying in"],
    ["#ys-questions", "Questions"],
  ];

  // seo-data.json `faq`, word for word.
  const FAQ = [
    ["How far is Sequoia National Park from Yosemite?", "Yosemite's own driving table gives about 150 miles and 3 hours 30 minutes to Grant Grove in Kings Canyon by Highway 41, and about 175 miles and 4 hours to Lodgepole and Giant Forest in Sequoia by Highways 41 and 180. The table does not name its starting point. No road crosses the Sierra through Sequoia and Kings Canyon, so every route runs south through the Fresno area."],
    ["Does one pass cover Yosemite, Sequoia and Kings Canyon?", "No single park pass does. Yosemite's $35 vehicle pass covers Yosemite for seven days. Sequoia and Kings Canyon share one $35 vehicle pass, good for one to seven days in both parks. The $80 America the Beautiful annual pass covers all three, and it waives the $100 per-person nonresident fee at both."],
    ["Can you visit Sequoia as a day trip from Yosemite?", "Not sensibly. By the Park Service's figures the round trip to Giant Forest is about eight hours of driving before you walk to a single tree. Plan at least one night on the Sequoia and Kings Canyon side."],
    ["How many days do you need for Yosemite, Sequoia and Kings Canyon?", "Four days is the shortest trip we would plan: two in Yosemite and two in Sequoia and Kings Canyon, with the long drive between them on day three. Five or six days adds Cedar Grove, the canyon floor of Kings Canyon, from May to early or mid-November."],
    ["Is the Generals Highway open in winter?", "The stretch between Sequoia and Kings Canyon is usually closed from early January to mid-March, and whenever snow makes it impassable. The detour from Giant Forest to Grant Grove then runs about 118 miles and 3 hours by Highways 198, 216, 63 and 180. Chains can be required on park roads at any time."],
    ["Which park should you visit first?", "Coming from San Francisco or Sacramento, see Yosemite first and leave by Highway 41 south. Coming from Los Angeles, enter Sequoia at Ash Mountain on Highway 198, drive north through Kings Canyon, and finish in Yosemite. Either way you drive the long middle leg only once."],
  ];

  // ── The drive table, from "Drive times" ─────────────────────────────────
  const FROM_YOSEMITE = [
    { to: "Grant Grove, Kings Canyon", by: "Highway 41", time: "3 h 30 min", dist: "150 mi" },
    { to: "Lodgepole and Giant Forest, Sequoia", by: "Highways 41 and 180", time: "4 h", dist: "175 mi" },
    { to: "Cedar Grove, Kings Canyon", by: "Highway 41", time: "4 h", dist: "180 mi" },
  ];

  const INSIDE = [
    { leg: "Ash Mountain entrance to Lodgepole", time: "About 1 hour", note: "The Generals Highway climbs from the foothills to the sequoia groves." },
    { leg: "Foothills Visitor Center to Giant Forest Museum", time: "60 minutes, 16 mi", note: "The winter Trip Planner's figure." },
    { leg: "Giant Forest Museum to the Sherman Tree", time: "10 minutes, 2 mi", note: "The same table." },
    { leg: "Lodgepole to Grant Grove", time: "45 minutes to an hour", note: "Generals Highway, mostly at one elevation." },
    { leg: "Grant Grove to Cedar Grove and Roads End", time: "45 minutes to an hour", note: "Highway 180 into the canyon, May to early or mid-November." },
    { leg: "The whole Generals Highway, entrance to entrance", time: "At least 2 hours", note: "The parks' own advice, with no side trips." },
  ];

  // ── The passes, from "Passes" ──────────────────────────────────────────
  const PASSES = [
    { name: "Yosemite vehicle pass", price: "$35", note: "Seven consecutive days, Yosemite only" },
    { name: "Sequoia and Kings Canyon vehicle pass", price: "$35", note: "One to seven days, both parks" },
    { name: "America the Beautiful, residents", price: "$80", note: "A year, every national park" },
    { name: "America the Beautiful, nonresidents", price: "$250", note: "A year; waives the $100 nonresident fee" },
  ];

  // ── The seasons, from "Seasons" ────────────────────────────────────────
  const SEASONS = [
    { when: "Late May or June to October", name: "Everything open", cls: "is-peak",
      text: "Tioga Road is open, Cedar Grove is open, and the Generals Highway joins the two southern parks. The only window when a loop can include all of it." },
    { when: "November and December", name: "Closing up", cls: "is-mid",
      text: "Tioga Road closes, Cedar Grove closes in early or mid-November, and the Mariposa Grove shuttle stops by November 30. The Generals Highway usually stays open." },
    { when: "Early January to mid-March", name: "Two separate trips", cls: "is-late",
      text: "The Generals Highway between the parks is usually closed. Giant Forest to Grant Grove becomes a 118-mile, three-hour detour." },
  ];

  const OPEN = [
    ["Tioga Road (Yosemite)", "Late May or June through October", "Yosemite driving page"],
    ["Mariposa Grove shuttle (Yosemite)", "No earlier than April 15 to November 30 at the latest", "Mariposa Grove page"],
    ["Cedar Grove road (Kings Canyon)", "Typically May through early to mid-November", "Conditions and hours pages"],
    ["Generals Highway between the parks", "Usually closed early January to mid-March", "Winter Trip Planner"],
    ["Moro Rock and Crescent Meadow Road (Sequoia)", "Closed to vehicles when snow makes it impassable", "Winter Trip Planner"],
    ["Free Sequoia shuttles", "May 22 to September 7 in 2026, plus some holiday dates", "Park shuttles page"],
  ];

  return (
    <div className="ys-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="route" /><dt>Yosemite to Grant Grove</dt><dd>About 150 mi, 3 h 30 min</dd></div>
          <div><EventIcon name="ticket" /><dt>Entrance</dt><dd>$35 Yosemite, $35 Sequoia and Kings Canyon</dd></div>
          <div><EventIcon name="id" /><dt>One card for all three</dt><dd>America the Beautiful, $80</dd></div>
          <div><EventIcon name="snow" /><dt>Winter</dt><dd>The road between the southern parks closes early Jan to mid-March</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the shape of the trip, and the whole page in four lines. */}
      <section className="hp-wrap hp-section ys-open">
        <div className="ff-split">
          <div className="ys-prose">
            <p className="dropcap">
              Yosemite, Sequoia and Kings Canyon sit on the same side of the same mountain range, and on a map they look like one trip. They can be, if you plan around three facts. The drive between them is three and a half to four hours. They are two park systems with two entrance passes. And the road that joins the two southern parks closes for part of every winter.
            </p>

            <p>
              Sequoia and Kings Canyon are two national parks run as one, with one fee and one set of rangers. Sequoia holds Giant Forest and the General Sherman Tree, which the Park Service calls the largest living specimen on earth. Kings Canyon holds Grant Grove and, down Highway 180, Cedar Grove and the canyon itself.
            </p>

            <p>
              The figures below come from the Park Service's own pages for both parks. Drive times assume good conditions and no stops. Roads in the southern parks are under construction this fall, so check current conditions the week you go.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>Four days minimum: two in Yosemite, two in Sequoia and Kings Canyon.</li>
              <li>Drive the long leg once. Enter one end, leave by the other.</li>
              <li>Two $35 passes, or one $80 America the Beautiful card.</li>
              <li>No gas and no cell service inside Sequoia and Kings Canyon.</li>
            </ul>
            <a className="ys-short__link" href="#ys-plans">The itineraries, day by day ↓</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="ys-route" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE ROUTE</p>
              <h2>Every route runs through Fresno</h2>
              <div className="ys-prose">
                <p>
                  "No roads cross the mountains west-to-east through Sequoia and Kings Canyon National Parks," the Park Service says. There is no back way from Yosemite's high country or from Highway 395. The link between the parks is Highway 41 south out of Yosemite's South Entrance, through Oakhurst to the Fresno area, then Highway 180 east to the Big Stump entrance of Kings Canyon.
                </p>

                <p>
                  The parks have three entrances. <strong>Big Stump</strong>, on Highway 180 from Fresno, is the Kings Canyon gate and the one you use coming from Yosemite. <strong>Ash Mountain</strong>, on Highway 198 at Three Rivers, is the Sequoia gate and the one you use from Visalia and Los Angeles. <strong>Lookout Point</strong> serves Mineral King, a remote area at the end of its own road; leave it for another trip.
                </p>

                <p>
                  Inside, the <strong>Generals Highway</strong> joins the two. It runs from Ash Mountain up to Giant Forest and Lodgepole in Sequoia, then north to Grant Grove in Kings Canyon, where it meets Highway 180. That makes a one-way trip easy: come in at one gate, drive the Generals Highway, leave by the other. From San Francisco, do Yosemite first and enter at Big Stump; from Los Angeles, start at Ash Mountain and finish in Yosemite.
                </p>

                <p>
                  <strong>The long vehicle rule.</strong> The Generals Highway between Ash Mountain and Giant Forest is narrow and steep. The parks advise against vehicles over 24 feet from the Foothills Visitor Center to Potwisha Campground and over 22 feet from Potwisha to the Giant Forest Museum. The Moro Rock and Crescent Meadow road is a hard 22-foot limit. In an RV or with a trailer, use Highway 180, which the parks call the preferred route for longer vehicles, and come and go by Big Stump.
                </p>

                <p>
                  <strong>Map apps.</strong> The parks warn that GPS can route drivers around entrance stations onto remote roads. Avoid any route that puts you on unpaved road, and turn off "avoid tolls," which the parks say gives the most direct, safe route.
                </p>
              </div>
            </div>
            <div>
              <figure className="ys-photo">
                <ResponsiveImage image="img/oakhurst-highway-41-ken-lund.jpg" style={{ aspectRatio: "1920 / 951", objectPosition: "50% 70%" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
                  alt="Highway 41 through Oakhurst, with shops along the road and a forested ridge behind" />
                <figcaption>Highway 41 through Oakhurst, the road south from Yosemite toward Fresno and the southern parks. Photo: Ken Lund / Wikimedia Commons (CC BY-SA 2.0)</figcaption>
              </figure>
              <p className="ff-alert ys-alert">
                <EventIcon name="fuel" />
                <span>
                  <strong>Fill up before Big Stump or Ash Mountain.</strong> There are no gas stations, charging stations or repair shops inside Sequoia and Kings Canyon. Gas may be sold in the national forest at Hume Lake; call ahead at (559) 305-7770.
                </span>
              </p>
              <p className="ff-alert ys-alert">
                <EventIcon name="signal" />
                <span>
                  <strong>No signal.</strong> The parks say there is no cell service throughout, and recommend printed maps for directions. A 911 call can still go through on any network.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ys-drives" tabIndex={-1}>
        <p className="hp-eyebrow">DRIVE TIMES</p>
        <h2>The legs, by the Park Service's clock</h2>
        <div className="ff-split">
          <div className="ys-prose">
            <p>
              <strong>Yosemite to the southern parks.</strong> Yosemite's driving page carries a table of drive times to Sequoia and Kings Canyon: about 150 miles and 3 hours 30 minutes to Grant Grove by Highway 41, about 175 miles and 4 hours to Lodgepole and Giant Forest by Highways 41 and 180, and about 180 miles and 4 hours to Cedar Grove. The table does not say where it starts; its other rows read like times from Yosemite Valley. From the Valley to the South Entrance is a little more than an hour by the same page, so most of that leg is the run south of the park.
            </p>

            <p>
              <strong>Inside Sequoia and Kings Canyon.</strong> The parks give an hour from the Ash Mountain entrance to Lodgepole, 45 minutes to an hour from Lodgepole to Grant Grove, and 45 minutes to an hour from Grant Grove down Highway 180 to Cedar Grove and Roads End. To drive the Generals Highway gate to gate, they say, allow at least two hours; Cedar Grove adds "quite a bit more." Their figures from Ash Mountain to Cedar Grove run three to three and a half hours, depending on the page.
            </p>

            <p>
              <strong>This fall.</strong> The parks' conditions page, updated October 13, 2026, reports delays of up to 30 minutes on the Generals Highway between Highway 180 and Giant Forest, including the Sherman Tree area. Build it in. The in-park road line is (559) 565-3341, press 1, then 1 again; Caltrans covers the highways outside at (800) 427-7623.
            </p>

            <p>
              <strong>Never as a day trip.</strong> Put the numbers together and Giant Forest and back from Yosemite is about eight hours of driving before you have walked anywhere. Our <a href="/articles/yosemite-gateway-towns-compared">gateway towns comparison</a> makes the same call from the town side: sleep on the Sequoia side at least one night.
            </p>
          </div>
          <div>
            <h3 className="ys-sched__head">From Yosemite, per Yosemite's table</h3>
            <table className="ys-table">
              <thead>
                <tr><th scope="col">To</th><th scope="col">Route</th><th scope="col">Time</th><th scope="col">Miles</th></tr>
              </thead>
              <tbody>
                {FROM_YOSEMITE.map((r) => (
                  <tr key={r.to}><th scope="row">{r.to}</th><td>{r.by}</td><td>{r.time}</td><td>{r.dist}</td></tr>
                ))}
              </tbody>
            </table>
            <h3 className="ys-sched__head ys-sched__head--gap">Inside Sequoia and Kings Canyon</h3>
            <ol className="ff-hours ys-legs">
              {INSIDE.map((l) => (
                <li key={l.leg}>
                  <span>{l.leg}</span>
                  <p><strong>{l.time}.</strong> {l.note}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="ff-band" id="ys-passes" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">ENTRANCE PASSES</p>
              <h2>Two passes, or one card</h2>
              <div className="ys-prose">
                <p>
                  <strong>Yosemite.</strong> A private vehicle pays $35, good for seven consecutive days. A motorcycle is $30, and anyone on foot, bicycle or a non-commercial bus is $20 a person; 15 and under are free. Yosemite is not using a timed-entry reservation in 2026, the park announced in February.
                </p>

                <p>
                  <strong>Sequoia and Kings Canyon.</strong> One pass covers both parks: $35 for a private vehicle, good for one to seven days; $30 for a motorcycle; $20 a person on foot or bicycle, with under-16s free. The same pass covers the Hume Lake area of Sequoia National Forest and Giant Sequoia National Monument. The entrance stations take cards only. If you only have cash, the parks say you can buy the $35 vehicle pass at Sequoia Parks Conservancy stores before you enter.
                </p>

                <p>
                  <strong>The card that covers all three.</strong> The America the Beautiful annual pass is $80 for U.S. residents and $250 for nonresidents, and it covers every national park for a year. Each park also sells its own $70 annual pass, which is no use to you at the other.
                </p>

                <p>
                  <strong>Visitors from outside the U.S.</strong> Both parks now charge nonresidents 16 and older a $100 per-person fee on top of the standard entrance fee, and both waive it for anyone with an America the Beautiful pass. That changes the arithmetic sharply. Two nonresident adults in one car would pay $35 plus $200 at Yosemite and the same again at Sequoia and Kings Canyon, $470 in all, against $250 for the nonresident card. Yosemite's page says the fee does not apply to anyone admitted with the pass; confirm at the gate how that works for your group. Our <a href="/articles/yosemite-trip-cost-budget">trip cost breakdown</a> works through the rest of the budget.
                </p>

                <p>
                  <strong>For one U.S. carload</strong>, the two vehicle passes come to $70, and the $80 card pays off only if you will enter another fee park within the year. That is a closer call than it looks: a third park on the drive home, or a second trip, settles it.
                </p>
              </div>
            </div>
            <div>
              <article className="ff-inpark ys-passcard">
                <p className="hp-eyebrow">WHAT YOU PAY</p>
                <h3>The passes, side by side</h3>
                <dl>
                  {PASSES.map((p) => (
                    <div key={p.name}><dt>{p.name}</dt><dd><strong>{p.price}</strong> · {p.note}</dd></div>
                  ))}
                </dl>
                <p className="ff-note">Nonresidents 16 and older pay $100 each at each park on top of the entrance fee, unless they hold an America the Beautiful pass.</p>
              </article>
              <p className="ff-alert ys-alert">
                <EventIcon name="ticket" />
                <span>
                  <strong>Cards only at the southern gates.</strong> Sequoia and Kings Canyon's entrance stations are cashless. Carry a card, or buy a pass ahead.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ys-plans" tabIndex={-1}>
        <p className="hp-eyebrow">ITINERARIES</p>
        <h2>Four days, six days, and the winter version</h2>
        <div className="ys-plans">
          <article className="ys-plan">
            <p className="ys-plan__len">Four days</p>
            <h3>The one-way loop</h3>
            <ol>
              <li><strong>Day 1.</strong> Yosemite Valley.</li>
              <li><strong>Day 2.</strong> The rim or the high country, as the season allows.</li>
              <li><strong>Day 3.</strong> South to the Mariposa Grove, then Highway 41 and Highway 180 to Grant Grove.</li>
              <li><strong>Day 4.</strong> The Generals Highway to Giant Forest and the Sherman Tree; leave by Ash Mountain.</li>
            </ol>
          </article>
          <article className="ys-plan">
            <p className="ys-plan__len">Five or six days</p>
            <h3>Add the canyon</h3>
            <ol>
              <li><strong>Days 1 to 3.</strong> Yosemite at the pace of our three-day plan.</li>
              <li><strong>Day 4.</strong> South via the Mariposa Grove to Grant Grove.</li>
              <li><strong>Day 5.</strong> Highway 180 down to Cedar Grove and Roads End, May to mid-November.</li>
              <li><strong>Day 6.</strong> Giant Forest; leave by Ash Mountain.</li>
            </ol>
          </article>
          <article className="ys-plan is-winter">
            <p className="ys-plan__len">Early January to mid-March</p>
            <h3>The winter version</h3>
            <ol>
              <li><strong>Days 1 and 2.</strong> The Valley and the grove on foot.</li>
              <li><strong>Day 3.</strong> Choose one southern park. Grant Grove from Big Stump, or Giant Forest from Ash Mountain.</li>
              <li><strong>Day 4.</strong> The same side again. The road between them is closed.</li>
            </ol>
          </article>
        </div>

        <div className="ff-split ys-plans__prose">
          <div className="ys-prose">
            <p>
              <strong>Four days.</strong> Spend the first two in Yosemite the way <a href="/articles/yosemite-in-three-to-five-days">our three-to-five-day plan</a> lays out its opening: the Valley on day one, then the Glacier Point rim or Tioga Road on day two, depending on which road is open. On day three, leave south. The <a href="/articles/mariposa-grove-how-to-visit">Mariposa Grove</a> sits just inside the South Entrance, and it is the right warm-up for the bigger groves: park at the Welcome Plaza, which has about 300 spaces and may fill by late morning, and take the shuttle, or walk the two miles up. Then drive on to Grant Grove for the General Grant Tree and the night. On day four, take the Generals Highway south to Giant Forest, see the Sherman Tree, and leave by Ash Mountain and Highway 198.
            </p>

            <p>
              <strong>Five or six days.</strong> Give Yosemite a third day, and give Kings Canyon one of its own. Highway 180 below Grant Grove drops into the canyon, the Park Service says, past Junction View, Grizzly Falls and Roaring River Falls to Zumwalt Meadow and Roads End, with its river trails and Muir Rock. The road to Cedar Grove is typically open from May through early to mid-November, so this version is a summer and early fall trip.
            </p>

            <p>
              <strong>Winter.</strong> From early January to mid-March the Generals Highway between the parks is usually closed. Treat Sequoia and Kings Canyon as two destinations and pick one. Grant Grove is the shorter drive from Yosemite. Giant Forest is a long way around: the detour from Grant Grove is about 118 miles and three hours. In Yosemite, the Mariposa Grove road is closed to cars from late November until at least April 1 and the shuttle does not run from December 1 until at least April 15, so the grove is a two-mile walk each way, on snow or ice some days. Sequoia and Kings Canyon say chains can be required on park roads at any time; carry them, and read Yosemite's own chain rules before a winter trip.
            </p>
          </div>
          <figure className="ys-photo">
            <ResponsiveImage image="img/mariposa-grove-grizzly-giant-nieves.jpg" style={{ aspectRatio: "4 / 5", objectPosition: "50% 40%" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="The Grizzly Giant, a giant sequoia in Yosemite's Mariposa Grove, its massive trunk rising above the forest floor" />
            <figcaption>The Grizzly Giant in the Mariposa Grove, on the way out of Yosemite toward the southern parks. Photo: Nieves / Pexels</figcaption>
          </figure>
        </div>
      </section>

      <section className="ff-band" id="ys-seasons" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">SEASONS</p>
          <h2>The calendar decides how much you can link</h2>
          <ol className="ys-seasons">
            {SEASONS.map((s) => (
              <li key={s.name} className={s.cls}>
                <span>{s.when}</span>
                <strong>{s.name}</strong>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="ff-split ys-when">
            <div className="ys-prose">
              <p>
                <strong>Late May or June to October.</strong> Yosemite's Tioga Road is open from late May or June through October, depending on conditions, and Cedar Grove's road is open from May. This is the only stretch when one trip can take in the Valley, the high country, both southern parks and the canyon. It is also when the free Sequoia shuttles run in Giant Forest and Lodgepole; in 2026 the summer service ran May 22 to September 7. There are no shuttles in Kings Canyon.
              </p>

              <p>
                <strong>November and December.</strong> Tioga Road closes, Cedar Grove closes in early or mid-November, and the Mariposa Grove shuttle stops by November 30 at the latest. The Generals Highway usually stays open through December, so the four-day loop still works, shorter and colder. Sequoia runs free holiday shuttles on a few dates, from 10 am to 4:30 pm.
              </p>

              <p>
                <strong>Early January to mid-March.</strong> The Generals Highway between the parks is usually closed, and it can close at other times when snow makes it impassable. The parks say that when chain controls are on, speed limits drop to 25 mph and travel takes much longer than their tables show.
              </p>

              <p>
                <strong>Spring.</strong> The road between the parks reopens around mid-March, the Mariposa Grove shuttle starts no earlier than April 15, and Cedar Grove opens in May. Every one of these dates moves with the snow; the parks say so on each page.
              </p>
            </div>
            <div>
              <h3 className="ys-sched__head">What is open when</h3>
              <table className="ys-table ys-table--open">
                <thead>
                  <tr><th scope="col">Road or service</th><th scope="col">Typical season</th><th scope="col">Source</th></tr>
                </thead>
                <tbody>
                  {OPEN.map(([what, when, src]) => (
                    <tr key={what}><th scope="row">{what}</th><td>{when}</td><td>{src}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ys-stay" tabIndex={-1}>
        <p className="hp-eyebrow">WHERE TO SLEEP</p>
        <h2>Three beds, and where to put them</h2>
        <div className="ff-split">
          <div className="ys-prose">
            <p>
              <strong>In Yosemite.</strong> For a trip that leaves by the South Entrance, the south side of the park and the towns on Highway 41 cut the most driving off day three. Our <a href="/articles/yosemite-gateway-towns-compared">gateway towns comparison</a> names Oakhurst as the pivot between the parks; the <a href="/articles/where-to-stay-in-yosemite">where to stay guide</a> covers the in-park options.
            </p>

            <p>
              <strong>In Kings Canyon.</strong> Grant Grove has the John Muir Lodge, 36 rooms, usually open spring through fall, and the Grant Grove Cabins at 6,500 feet. Cedar Grove Lodge, 21 rooms at 4,600 feet, is generally open spring through fall, with the canyon road. All three book through the parks' lodging operator at visitsequoia.com or (866) 807-3598.
            </p>

            <p>
              <strong>In Sequoia.</strong> Wuksachi Lodge, 102 rooms at 7,050 feet near Giant Forest, books the same way. The parks recommend reserving rooms well ahead, and campsites through Recreation.gov. Below the Ash Mountain gate, Three Rivers is the town at the Sequoia end of the trip, and Visalia, 36 miles and about 45 minutes from the entrance, is the larger one.
            </p>

            <p>
              <strong>The order that works.</strong> On the four-day loop: two nights in or near Yosemite, one in Grant Grove, then drive out. On the six-day version, a second Kings Canyon night lets you do Cedar Grove without driving it twice in a day.
            </p>
          </div>
          <div className="ys-stay">
            {/* The in-park lodges in both parks book with their own operators,
                so they are named without a link; the availability search is
                for the towns on either end when they are full. */}
            <LodgingCta
              destination="Sequoia National Park"
              heading="Rooms at the Sequoia end"
              note="The in-park lodges in Grant Grove, Cedar Grove and Giant Forest book through visitsequoia.com and are the first place to look. When they are full, a search shows what is left in Three Rivers, Visalia and along Highway 180."
              list="article_cta"
              slug="yosemite-sequoia-kings-canyon-trip"
              cta="Search lodging near Sequoia →"
            />
          </div>
        </div>
      </section>

      <section className="ff-band" id="ys-arrive" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">FLYING IN</p>
            <h2>Fresno sits in the middle</h2>
            <div className="ys-prose">
              <p>
                Fresno Yosemite International is the one airport between all three parks. The southern parks put it 1¼ hours from the Kings Canyon entrance on Highway 180 and 1¾ hours from the Sequoia entrance on Highway 198. Yosemite's driving page puts Fresno 94 miles and 2 hours 15 minutes from the Valley by Highway 41. Visalia's small airport is an hour from the Sequoia entrance.
              </p>

              <p>
                From the big coastal airports, the parks give 250 miles and 4 hours 30 minutes from San Francisco to Big Stump and 225 miles and 4 hours from the Los Angeles area to Ash Mountain. Yosemite's page gives San Francisco to Yosemite by Highway 120 at 195 miles and 4 hours. Flying into one coast city and out of the other turns the loop into a straight line; <a href="/articles/best-airport-for-yosemite">our airport guide</a> compares them.
              </p>

              <p>
                Amtrak stops in Fresno and Hanford; the parks put each about an hour and 45 minutes from an entrance. Without a car, the paid Sequoia Shuttle runs from Visalia to Giant Forest in summer by reservation at sequoiashuttle.com. There is no public link between Yosemite and the southern parks that we could find on either park's pages; plan on a car.
              </p>
            </div>
          </div>
          <ul className="ff-rules ys-rules">
            <li className="is-exception">
              <EventIcon name="fuel" size={26} />
              <strong>Gas outside.</strong>
              <p>None inside Sequoia and Kings Canyon. Fill in Oakhurst, Fresno or Three Rivers.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="signal" size={26} />
              <strong>Print the map.</strong>
              <p>No cell service in the southern parks.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="snow" size={26} />
              <strong>Carry chains.</strong>
              <p>They can be required on park roads at any time it snows.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="car" size={26} />
              <strong>Long rig, Highway 180.</strong>
              <p>The 22-foot advisory below Giant Forest. Use Big Stump.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ys-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Yosemite, Sequoia and Kings Canyon, answered</h2>
            <div className="ys-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/driving.htm" target="_blank" rel="noopener noreferrer">Driving times and directions, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/fees.htm" target="_blank" rel="noopener noreferrer">Entrance fees, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/reservations.htm" target="_blank" rel="noopener noreferrer">Reservations, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/mg.htm" target="_blank" rel="noopener noreferrer">Mariposa Grove, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/seki/planyourvisit/driving-directions.htm" target="_blank" rel="noopener noreferrer">Driving directions, NPS Sequoia and Kings Canyon</a></li>
                <li><a href="https://www.nps.gov/seki/planyourvisit/directions.htm" target="_blank" rel="noopener noreferrer">Directions and transportation, NPS Sequoia and Kings Canyon</a></li>
                <li><a href="https://www.nps.gov/seki/planyourvisit/fees.htm" target="_blank" rel="noopener noreferrer">Fees and passes, NPS Sequoia and Kings Canyon</a></li>
                <li><a href="https://www.nps.gov/seki/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">Current conditions, NPS Sequoia and Kings Canyon</a></li>
                <li><a href="https://www.nps.gov/seki/planyourvisit/driveviewsum.htm" target="_blank" rel="noopener noreferrer">Summer drives and viewpoints, NPS Sequoia and Kings Canyon</a></li>
                <li><a href="https://www.nps.gov/seki/faqs.htm" target="_blank" rel="noopener noreferrer">Frequently asked questions, NPS Sequoia and Kings Canyon</a></li>
                <li><a href="https://www.nps.gov/seki/planyourvisit/hours.htm" target="_blank" rel="noopener noreferrer">Operating hours and seasons, NPS Sequoia and Kings Canyon</a></li>
                <li><a href="https://www.nps.gov/seki/planyourvisit/kings-canyon-national-park.htm" target="_blank" rel="noopener noreferrer">Kings Canyon National Park, NPS Sequoia and Kings Canyon</a></li>
                <li><a href="https://www.nps.gov/seki/planyourvisit/parktransit.htm" target="_blank" rel="noopener noreferrer">Park shuttles, NPS Sequoia and Kings Canyon</a></li>
                <li><a href="https://www.nps.gov/seki/planyourvisit/lodging.htm" target="_blank" rel="noopener noreferrer">Lodging, NPS Sequoia and Kings Canyon</a></li>
                <li><a href="https://www.nps.gov/seki/learn/news/upload/Trip_Planner_2025-2026_Winter_2025-12-09_for_web.pdf" target="_blank" rel="noopener noreferrer">Winter Trip Planner 2025-2026, NPS Sequoia and Kings Canyon (PDF)</a></li>
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

      <div className="hp-wrap ys-end">
        <AffiliateNote />
      </div>
    </div>
  );
};
