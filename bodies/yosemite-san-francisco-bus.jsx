/* global React, EventIcon, ResponsiveImage */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// San Francisco to Yosemite, and back, without a car: BART or the Amtrak
// connecting bus, the Gold Runner (the San Joaquins) to Merced, and YARTS up
// Highway 140. Laid out on the /firefall system from the start, as the
// airport and car-free pieces are: its catalog entry carries a `feature`
// block (data.js), so page-article.jsx draws the full-width cover and hands
// this body the page's width. The page-level `sfb-*` rules are the
// `.sfb-feature` layer in styles.css.
//
// SOURCING. Every figure was re-read on its primary page on October 17,
// 2026 (the pages listed under Sources):
//   - The rail legs: Amtrak's Gold Runner route page (Richmond is a station;
//     "bus connections to San Francisco are made at Emeryville"), its
//     Emeryville station page (Amtrak Connection bus to downtown San
//     Francisco), BART's Richmond station page (served by the San Joaquin)
//     and Amtrak's November 3, 2025 release (San Joaquins renamed Gold Runner).
//   - The through ticket and the admission claim: Amtrak's Yosemite page (the
//     Merced bus is Amtrak Connection Route 15, run by YARTS; "the (shuttle)
//     bus ride and admission to the park are included").
//   - YARTS Highway 140: stops, the winter timetable October 1, 2026 to May
//     28, 2027, the 7:13 a.m. first arrival (run 140-1, 4:00 a.m. from
//     Merced), the four holidays and their 2026-27 dates. "Three to four
//     hours" is computed from that timetable (3h13 to 3h55, by run).
//   - Fares, the child and reduced-fare rules, the $2.50 online fee and the
//     $1 surcharge, the entrance-fee disclaimer: YARTS tickets and fares, and
//     how to ride (walk-ons, bags, bikes, service animals, Recreation.gov).
//     The current fares page does not say which cards or cash the driver
//     takes, so this page does not either.
//   - The summer routes, their 2026 dates, stops and fares: the YARTS
//     Highway 41, Highway 120 and Highway 395/120E pages.
//   - Entrance fees and no cash: NPS fees. 195 miles and four to five hours:
//     NPS driving. Shuttle hours: NPS public transportation.
//   - The concessioner's tours, prices and the 2026 season (Grand Tour May 9
//     to October 12; the Glacier Point Tour's last day October 12):
//     travelyosemite.com guided bus tours, read October 17, 2026.
// Amtrak's train fares and the end-to-end timetable from San Francisco are
// not quoted: Amtrak prices by date, and the connections change with each
// timetable. The page says so rather than printing a number.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["yosemite-san-francisco-bus"] = function YosemiteSanFranciscoBusBody() {
  const TOC = [
    ["#sfb-the-route", "The route"],
    ["#sfb-yarts-routes", "The four YARTS routes"],
    ["#sfb-going-home", "Yosemite to San Francisco"],
    ["#sfb-fares", "Fares and the entrance fee"],
    ["#sfb-tours", "Tours instead"],
    ["#sfb-drive-instead", "When to drive"],
    ["#sfb-questions", "Questions"],
  ];

  // The four YARTS corridors, the year-round one first. Seasons and fares
  // are the ones this site publishes from YARTS (see the sourcing note).
  const ROUTES = [
    {
      key: "140", name: "Highway 140", from: "From Merced", season: "All year", year: true,
      stops: "Merced Airport, Merced Transpo and the Merced Amtrak station, then Catheys Valley, Mariposa, Midpines and El Portal, up the Merced River canyon",
      fare: "$22 one way, $44 round trip, adult",
      note: "The route that meets the train. The only one that runs in winter.",
    },
    {
      key: "41", name: "Highway 41", from: "From Fresno", season: "Summer: May 22 to September 25 in 2026",
      stops: "Fresno, Coarsegold and Oakhurst, then Fish Camp, the Mariposa Grove and Wawona",
      fare: "$20 one way, $40 round trip, adult",
      note: "The south side. Fresno is a Gold Runner station too, but the train from the Bay reaches Merced first.",
    },
    {
      key: "120w", name: "Highway 120 west", from: "From Sonora", season: "Summer: May 22 to September 30 in 2026",
      stops: "Sonora and Jamestown, Groveland and Buck Meadows, Big Oak Flat and Crane Flat",
      fare: "$22 one way, $44 round trip, adult",
      note: "The shortest road from San Francisco, but no train meets it.",
    },
    {
      key: "120e", name: "Highway 120 east", from: "From Mammoth Lakes, on Highway 395", season: "Summer: July 1 to September 30 in 2026",
      stops: "Mammoth Lakes, June Lake and Lee Vining, over Tioga Pass to Tuolumne Meadows, White Wolf and Crane Flat",
      fare: "$30 one way, $60 round trip, adult",
      note: "The east side. Useful from San Francisco only on a loop trip.",
    },
  ];

  const FAQ = [
    ["Is there a bus from San Francisco to Yosemite?", "Not a direct one on public transit. The scheduled route is three legs: BART to Richmond, or Amtrak's connecting bus from San Francisco to Emeryville; the Amtrak Gold Runner train, long known as the San Joaquins, to Merced; then the YARTS bus up Highway 140 into Yosemite Valley. It runs all year, and Amtrak sells the train and the YARTS bus as one ticket."],
    ["How long does the bus take from Merced to Yosemite Valley?", "About three to four hours on the YARTS winter timetable, which runs from October 1, 2026 to May 28, 2027, depending on the run. The bus calls at Catheys Valley, Mariposa, Midpines and El Portal on the way up the Merced River canyon and stops at Yosemite Valley Lodge, Yosemite Village and Curry Village."],
    ["How much is the YARTS bus from Merced to Yosemite?", "YARTS lists $22 one way and $44 round trip for an adult between Merced and Yosemite Valley, and reduced fares of $11 and $22. Children 5 and under ride free, and one child aged 6 to 12 rides free with each paid adult. Online tickets carry a $2.50 fee each way, the posted fares leave out a $1 surcharge per person, and walk-ons ride as space allows."],
    ["Does YARTS run all year?", "Only the Highway 140 route, from Merced. The Highway 41 route from Fresno, Highway 120 west from Sonora and Highway 120 east from Mammoth Lakes are summer services. YARTS does not run on Thanksgiving, Christmas, New Year's Day or Easter."],
    ["How do I get from Yosemite to San Francisco by bus?", "The same three legs in reverse: YARTS from the Valley down Highway 140 to the Merced Amtrak station, the Gold Runner train to Richmond or Emeryville, then BART from Richmond or Amtrak's connecting bus from Emeryville into San Francisco. Book it as one Amtrak ticket so the bus and train are planned to connect, and check the current timetable before you choose a bus."],
    ["Does the bus fare include the Yosemite entrance fee?", "The official sources disagree. YARTS says entrance and non-resident fees are not included in its ticket prices, while Amtrak's Yosemite page says its tickets include admission. Plan to pay: the per-person pass is $20 for seven days, people 15 and under are free, non-US residents 16 and over pay $100 more, and the park does not accept cash."],
  ];

  return (
    <div className="sfb-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="route" /><dt>The way in</dt><dd>BART, train to Merced, YARTS</dd></div>
          <div><EventIcon name="clock" /><dt>Merced to the Valley</dt><dd>3 to 4 hours by bus</dd></div>
          <div><EventIcon name="ticket" /><dt>YARTS from Merced</dt><dd>$22 one way, $44 round trip</dd></div>
          <div><EventIcon name="snow" /><dt>In winter</dt><dd>Highway 140 only</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening, and the whole piece in four lines beside it. */}
      <section className="hp-wrap hp-section sfb-open">
        <div className="ff-split">
          <div className="sfb-prose">
            <p className="dropcap">
              Ask where the bus to San Francisco leaves from and the answer disappoints a little: there is no bus from Yosemite to San Francisco. There is a bus to Merced, a train from Merced to the Bay, and a short hop from the train into the city, and the three together make one of the better ways in and out of this park. Nothing about it is direct, but all of it is scheduled, and none of it involves a parking lot.
            </p>
            <p>
              This is the route as it works now, in both directions: which train, which bus, what the posted fares are, which of the four YARTS routes run in which season, and where the official sources stop agreeing with each other. Where a schedule or price is not posted, I say so rather than guess.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="alert" /> The short version</p>
            <ul>
              <li>BART to Richmond, train to Merced, YARTS to the Valley.</li>
              <li>Buy it as one Amtrak ticket.</li>
              <li>October to May, only the Merced bus runs.</li>
              <li>Budget for the entrance fee anyway.</li>
            </ul>
          </aside>
        </div>
      </section>

      {/* The route: three legs and the free shuttle at the end. */}
      <section className="ff-band" id="sfb-the-route" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE ROUTE</p>
              <h2>San Francisco to Yosemite, in three legs</h2>
              <div className="sfb-prose">
                <p>
                  The train does not reach San Francisco itself, so the trip starts on the east side of the Bay. Amtrak's Central Valley line, the <strong>Gold Runner</strong>, called the San Joaquins until November 2025, stops at the <strong>Richmond</strong> BART station, and Amtrak runs connecting buses between downtown San Francisco and its station at <strong>Emeryville</strong>. Either way you board the same train south to Merced.
                </p>
                <p>
                  At the Merced station you change to the <strong>YARTS</strong> bus. YARTS is the Yosemite Area Regional Transportation System, a public transit agency, not a tour company, and Amtrak sells its Merced bus as its own connection, Route 15, which is why the train and the bus can be booked as one ticket rather than two. The bus climbs Highway 140 through Catheys Valley, Mariposa, Midpines and El Portal and sets down at <strong>Yosemite Valley Lodge</strong>, <strong>Yosemite Village</strong> and <strong>Curry Village</strong>, all on the free Valley shuttle.
                </p>
                <p>
                  The bus leg alone takes about three to four hours on the winter timetable, depending on the run. Add the train and the ride across the Bay and it is most of a day, so plan the first afternoon in the Valley, not the first morning. Book Yosemite as the destination on Amtrak's site and the itinerary it returns, train and bus together, is the timetable to trust, not this page.
                </p>
              </div>
            </div>
            <figure className="sfb-photo">
              <ResponsiveImage image="img/yarts-bus-bridalveil.jpg" style={{ aspectRatio: "3 / 2" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
                alt="A YARTS coach on Southside Drive in Yosemite Valley below Bridalveil Fall in winter" />
              <figcaption>The year-round bus, in the Valley in winter. Photo: YARTS</figcaption>
            </figure>
          </div>

          <ol className="ff-timeline sfb-legs">
            <li className="is-open"><span>Leg one</span><strong>Across the Bay</strong><p>BART to Richmond, where the Amtrak train stops at the same station, or Amtrak's connecting bus from San Francisco to Emeryville.</p></li>
            <li className="is-open"><span>Leg two</span><strong>Gold Runner to Merced</strong><p>Amtrak's Central Valley train, south from Richmond or Emeryville to the Merced station.</p></li>
            <li className="is-open"><span>Leg three</span><strong>YARTS up Highway 140</strong><p>From the Merced Amtrak station, through Mariposa and El Portal, into the Valley. All year but four holidays.</p></li>
            <li className="is-open"><span>In the Valley</span><strong>The free shuttle</strong><p>From the bus stop to wherever you are sleeping or walking, 7 a.m. to 10 p.m. No ticket.</p></li>
          </ol>
          <p className="ff-note">Flying into SFO or Oakland instead of starting in the city: the same route works from the airport, and <a href="/articles/best-airport-for-yosemite">the airport guide</a> weighs it against a rental car.</p>
        </div>
      </section>

      {/* The four YARTS routes, and which months each one runs. */}
      <section className="hp-wrap hp-section" id="sfb-yarts-routes" tabIndex={-1}>
        <p className="hp-eyebrow">YOSEMITE BUS ROUTES</p>
        <h2>Four YARTS routes, one of them all year</h2>
        <p className="ff-lede ff-lede--intro">YARTS runs full-size coaches into Yosemite Valley on four corridors. From San Francisco only one is practical without a car, because only one meets the train, but the other three matter if your trip is a loop or starts somewhere else.</p>
        <div className="sfb-routes">
          {ROUTES.map((r) => (
            <article key={r.key} className={"sfb-route" + (r.year ? " is-year" : "")}>
              <p className="sfb-route__season">{r.season}</p>
              <h3>{r.name}</h3>
              <p className="sfb-route__from">{r.from}</p>
              <dl>
                <div><dt>Calls at</dt><dd>{r.stops}</dd></div>
                <div><dt>Fare</dt><dd>{r.fare}</dd></div>
              </dl>
              <p className="sfb-route__note">{r.note}</p>
            </article>
          ))}
        </div>
        <p className="ff-alert"><EventIcon name="alert" /><span><strong>The 2026 summer routes have ended.</strong> Highway 41 finished on September 25, Highway 120 west and Highway 120 east on September 30. Check YARTS for next summer's dates; until those routes run, from San Francisco, the Merced bus is the whole system. Every corridor on the park map, with its stops in order: <a href="/articles/yosemite-shuttle-and-yarts">the shuttle and YARTS guide</a>.</span></p>
      </section>

      {/* The return trip: the same legs, with the things that go wrong. */}
      <section className="ff-band" id="sfb-going-home" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">YOSEMITE TO SAN FRANCISCO</p>
              <h2>Going home is the same trip backwards, with less slack</h2>
              <div className="sfb-prose">
                <p>
                  Out of the park, you board YARTS at one of its three Valley stops, ride down the canyon to the Merced station, take the train north, and get off at Richmond for BART or at Emeryville for the connecting bus into San Francisco. The difference is the clock. On the way in, a late bus costs you an hour of afternoon. On the way out, it can cost you a train, so pick a bus that leaves you a margin at Merced, and buy the through ticket so the two legs are planned to connect.
                </p>
                <p>
                  The winter timetable runs from <strong>October 1, 2026 to May 28, 2027</strong>. Its first run leaves Merced at 4 a.m. and reaches Yosemite Valley Lodge at 7:13. I am not printing the rest of the times here because they change with each timetable; read them on the YARTS Highway 140 page the week you travel.
                </p>
              </div>
            </div>
            <ul className="ff-rules sfb-rules">
              <li><EventIcon name="no" size={26} /><strong>Four days with no bus</strong><p>YARTS does not run on Thanksgiving, Christmas, New Year's Day or Easter: this season, November 26, December 25, January 1 and March 28, 2027.</p></li>
              <li><EventIcon name="ticket" size={26} /><strong>Walk-ons ride if there is room</strong><p>Booking is optional and walk-ons ride first come, first served. On a summer weekend, a reservation is cheap insurance.</p></li>
              <li><EventIcon name="users" size={26} /><strong>Bags yes, pets no</strong><p>YARTS takes backpacks of any size. Bikes ride underneath, disassembled, as space allows, never guaranteed. Only service animals ride.</p></li>
              <li><EventIcon name="route" size={26} /><strong>If Highway 140 closes</strong><p>Rockfall and storms close the canyon road some years. Read the closure before you travel: <a href="/articles/highway-140-closed-yosemite">Highway 140 closed</a>.</p></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Fares, and the entrance fee nobody agrees about. */}
      <section className="hp-wrap hp-section" id="sfb-fares" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">FARES AND THE ENTRANCE FEE</p>
            <h2>What the bus costs, and what it may not cover</h2>
            <div className="sfb-prose">
              <p>
                The YARTS fare from Merced is posted and simple. The Amtrak fare is not something I can print: Amtrak prices the train by date and by how early you book, so search your own dates on its site. The through ticket to Yosemite includes the YARTS leg.
              </p>
              <p>
                Then the entrance fee, the one question a car-free visitor cannot get a straight answer to. <strong>YARTS says its fares do not include it</strong>: Park Service gate fees and non-resident fees are the rider's to pay, and can be paid on Recreation.gov. <strong>Amtrak's Yosemite page says its tickets include admission.</strong> Two official sources, two answers. Budget for the fee, and if you are waved through, treat it as a refund. The pass for anyone arriving by bus is <strong>$20 per person</strong>, good for seven days; people 15 and under are free, and non-US residents 16 and over pay <strong>$100 more</strong> unless they carry an annual or America the Beautiful pass. The park does not take cash, so buy it before you board.
              </p>
            </div>
          </div>
          <article className="ff-inpark">
            <p className="hp-eyebrow">YARTS · HIGHWAY 140 · ALL YEAR</p>
            <h3>Merced to Yosemite Valley</h3>
            <dl>
              <div><dt>Adult</dt><dd>$22 one way, $44 round trip</dd></div>
              <div><dt>Reduced</dt><dd>$11 one way, $22 round trip</dd></div>
              <div><dt>Children</dt><dd>5 and under free; one child 6 to 12 free with each paid adult</dd></div>
              <div><dt>Fees</dt><dd>$1 surcharge per person; $2.50 per one-way ticket bought online</dd></div>
              <div><dt>Entrance pass</dt><dd>$20 per person, seven days, card only</dd></div>
            </dl>
            <p className="ff-note">Reduced fares cover children 6 to 17 beyond the one free child, riders 62 and over and veterans with ID, and riders with disabilities. Walk-ons pay on board; the YARTS fares page does not list the payment methods, so check it before you travel. What the whole week costs, the fee worked through for a family and for visitors from abroad: <a href="/articles/yosemite-trip-cost-budget">the trip-cost breakdown</a>.</p>
          </article>
        </div>
      </section>

      {/* Tours: the concessioner's from the Valley, and the ones from the city. */}
      <section className="ff-band" id="sfb-tours" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">TOURS INSTEAD</p>
              <h2>When someone else should do the driving</h2>
              <div className="sfb-prose">
                <p>
                  The bus gets you to the Valley floor and stops there. If the trip is a day or two and you want Glacier Point or the giant sequoias too, the park concessioner runs guided tours from <strong>Yosemite Valley Lodge</strong>, which is a YARTS stop, so the two fit together. The year-round one is the two-hour <strong>Valley Floor Tour</strong>. The <strong>Glacier Point Tour</strong> and the eight-hour <strong>Grand Tour</strong>, which adds the Mariposa Grove, run only while Glacier Point Road is open; in 2026 the Grand Tour ran May 9 to October 12, and both ended for the year on October 12. Book ahead at travelyosemite.com, and ask for an accessible vehicle when you book, not when you arrive.
                </p>
                <p>
                  Private companies also sell day tours from San Francisco. I do not review them and do not quote their prices. Before you book one, do the arithmetic: the Park Service puts the Bay Area at 195 miles and four to five hours from the park by car, so a day trip is eight or more hours in a seat for a few hours in the park.
                </p>
              </div>
            </div>
            <div className="sfb-tours">
              <div className="sfb-tour">
                <p className="sfb-tour__season">All year, conditions permitting</p>
                <h3>Valley Floor Tour</h3>
                <p>Two hours from Yosemite Valley Lodge, open-air tram from mid-April to mid-October, heated motor coach the rest of the year. $41.25 adult, $28.25 child 2 to 12.</p>
              </div>
              <div className="sfb-tour">
                <p className="sfb-tour__season">While Glacier Point Road is open</p>
                <h3>Glacier Point Tour</h3>
                <p>Four hours round trip, from 8:30 a.m. and 1:30 p.m. $72.50 adult and $50.50 child round trip; one way, $28.50 and $18.25, which is how hikers walk down. Ended for 2026 on October 12.</p>
              </div>
              <div className="sfb-tour">
                <p className="sfb-tour__season">May 9 to October 12 in 2026</p>
                <h3>Grand Tour</h3>
                <p>About eight hours, lunch included: the Valley, Glacier Point and the Mariposa Grove. $141 adult, $71 child 2 to 12.</p>
              </div>
              <p className="ff-note">Fares as the concessioner listed them on October 17, 2026. Every tour, with the departure times and the moonlight one: <a href="/articles/yosemite-for-non-hikers">Yosemite for non-hikers</a>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* When the car is still the answer. */}
      <section className="hp-wrap hp-section" id="sfb-drive-instead" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">WHEN TO DRIVE INSTEAD</p>
            <h2>The bus is a Valley tool</h2>
            <div className="sfb-prose">
              <p>
                YARTS serves a corridor, not the park. If the plan is Glacier Point on Tuesday, Tuolumne Meadows on Wednesday and Hetch Hetchy on Thursday, you need a car, and from San Francisco the drive is shorter than the train and bus. It is also cheaper for a group: the entrance fee is $35 a car for seven days if you drive in, against $20 a head on the bus, before the bus fares.
              </p>
              <p>
                For one or two people sleeping in the Valley, the bus wins: no chains to fit in winter, nobody driving four hours and then hiking, and no hunt for a space at eleven in the morning. If you do drive, <a href="/articles/yosemite-day-trip-from-bay-area">the day trip from the Bay Area</a> has the roads and the hours, and <a href="/articles/yosemite-valley-parking-guide">the parking guide</a> has the hours the lots fill.
              </p>
            </div>
          </div>
          <div className="sfb-choose">
            <div className="sfb-choose__col">
              <p className="sfb-choose__head"><EventIcon name="route" size={24} /> Take the train and bus if</p>
              <ul>
                <li>It is one or two of you, on a Valley trip.</li>
                <li>You are sleeping in the Valley or on Highway 140.</li>
                <li>It is winter, and chains are the part you dread.</li>
              </ul>
            </div>
            <div className="sfb-choose__col sfb-choose__col--car">
              <p className="sfb-choose__head"><EventIcon name="car" size={24} /> Drive if</p>
              <ul>
                <li>There are three or more of you.</li>
                <li>The trip includes Glacier Point, Tuolumne or Hetch Hetchy.</li>
                <li>You want to be at a trailhead before the first bus arrives.</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="ff-note">The rest of the car-free trip, the bike path, the bins and the propane included: <a href="/articles/sustainable-yosemite-car-free-zero-waste">Yosemite without a car</a>. Built around the shuttle line: <a href="/articles/yosemite-in-one-or-two-days">Yosemite in one or two days</a>.</p>
      </section>

      <section className="ff-band" id="sfb-questions" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>The bus to Yosemite, answered</h2>
            <p className="ff-lede">Every road into the park, and why the phone's route is not to be trusted: <a href="/articles/getting-to-yosemite">getting to Yosemite</a>.</p>
            <div className="sfb-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/publictransportation.htm" target="_blank" rel="noopener noreferrer">Public transportation, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/fees.htm" target="_blank" rel="noopener noreferrer">Entrance fees, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/driving.htm" target="_blank" rel="noopener noreferrer">Driving distances and times, NPS Yosemite</a></li>
                <li><a href="https://www.yarts.com/tickets-and-fares/" target="_blank" rel="noopener noreferrer">Tickets and fares, YARTS</a></li>
                <li><a href="https://www.yarts.com/plan-your-trip/how-to-ride/" target="_blank" rel="noopener noreferrer">How to ride, YARTS</a></li>
                <li><a href="https://www.yarts.com/bus_routes/highway-140/" target="_blank" rel="noopener noreferrer">Highway 140 route, YARTS</a></li>
                <li><a href="https://www.yarts.com/bus_routes/highway-41/" target="_blank" rel="noopener noreferrer">Highway 41 route, YARTS</a></li>
                <li><a href="https://www.yarts.com/bus_routes/highway-120/" target="_blank" rel="noopener noreferrer">Highway 120 route, YARTS</a></li>
                <li><a href="https://www.yarts.com/bus_routes/highway-395-120e/" target="_blank" rel="noopener noreferrer">Highway 395/120E route, YARTS</a></li>
                <li><a href="https://www.amtrak.com/san-joaquins/yosemite-national-park" target="_blank" rel="noopener noreferrer">Yosemite by train, Amtrak</a></li>
                <li><a href="https://www.amtrak.com/routes/san-joaquins-train" target="_blank" rel="noopener noreferrer">Gold Runner route, Amtrak</a></li>
                <li><a href="https://www.amtrak.com/stations/emy" target="_blank" rel="noopener noreferrer">Emeryville station, Amtrak</a></li>
                <li><a href="https://media.amtrak.com/2025/11/amtrak-san-joaquins-becomes-gold-runner-marking-a-new-era-for-california-passenger-rail/" target="_blank" rel="noopener noreferrer">San Joaquins becomes Gold Runner, Amtrak, November 3, 2025</a></li>
                <li><a href="https://www.bart.gov/stations/rich" target="_blank" rel="noopener noreferrer">Richmond station, BART</a></li>
                <li><a href="https://www.travelyosemite.com/things-to-do/guided-bus-tours/" target="_blank" rel="noopener noreferrer">Guided bus tours, Yosemite Hospitality</a></li>
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
