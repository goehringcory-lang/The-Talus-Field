/* global React, EventIcon, ResponsiveImage, AvailabilityLink, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Flying in: which airport, and how to get from it to the park. Written for
// the visitor from abroad who lands at SFO or LAX and has never driven in
// California, and laid out on the /firefall system from the start: its
// catalog entry carries a `feature` block (data.js), so page-article.jsx
// draws the full-width cover and hands this body the page's width. The
// page-level `fly-*` rules are the `.fly-feature` layer in styles.css.
//
// SOURCING (read October 3, 2026). Every figure is one of these, and the
// comment beside each table names which:
//   - Drive distances and times to Yosemite Valley from San Francisco,
//     Sacramento, Reno and Los Angeles: the NPS "Driving Distances and Times"
//     page (nps.gov/yose/planyourvisit/driving.htm), which also carries the
//     "road sign beats GPS" line and the October-to-April chain window.
//   - Fresno and Merced to the Valley (94 miles, 2 h 15; 81 miles, 2 h), and
//     Fresno to the South Entrance (about 1 h 15): NPS figures already quoted
//     in yosemite-from-los-angeles and getting-to-yosemite.
//   - YARTS: the Highway 140 and Highway 41 route pages on yarts.com (stops,
//     the 2026 Highway 41 season May 22 to September 25, the $20 / $40 Fresno
//     fares, the $22 / $44 Merced fares), as yosemite-shuttle-and-yarts and
//     yosemite-from-los-angeles already publish them.
//   - Amtrak: the San Joaquins, BART at Richmond, the Thruway bus from Los
//     Angeles to Bakersfield, and the four to four and a half hours from the
//     Bay, as yosemite-day-trip-from-bay-area and yosemite-from-los-angeles
//     publish them.
//   - Fresno's nonstops (San Francisco and Los Angeles among them): the
//     airport's own route list. Merced's Contour Airlines regional jet service
//     from LAX began July 1, 2026 (KMPH, July 2, 2026).
//   - The license rule: the California DMV's visitor rule (a visitor 18 or
//     older with a valid license from home may drive; an International
//     Driving Permit is a translation, not a license).
//   - Entrance fees, the card-only gate, the $100 non-resident fee, the gas
//     stations inside the park, and the rental-chains problem: already
//     published in getting-to-yosemite, yosemite-from-los-angeles and on
//     /international.
// Anything priced by a rental company (daily rates, young-driver fees,
// one-way drop fees) is described and never quoted: it changes by the week.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["best-airport-for-yosemite"] = function BestAirportForYosemiteBody() {
  const TOC = [
    ["#sec-0-pick-the-airport", "The airports"],
    ["#sec-1-rent-a-car-usually", "Car or train and bus"],
    ["#sec-2-the-car-free-way-in", "The car-free way in"],
    ["#sec-3-driving-here-on-a-license-from-home", "Driving here"],
    ["#sec-4-the-first-day", "The first day"],
    ["#sec-5-one-way-in-another-way-out", "One way in, another out"],
    ["#best-airport-questions", "Questions"],
  ];

  // The airports, closest to the Valley first. `hours` drives the chart; the
  // printed `time` is the source's own wording. NPS figures throughout; the
  // Bay Area row is the park's 4 to 5 hours, so it draws as a range.
  const AIRPORTS = [
    {
      code: "MCE", name: "Merced", full: "Merced Yosemite Regional Airport",
      miles: "81 mi", time: "About 2 hours", hours: [2, 2], chart: "2 h",
      road: "Highway 140 to the Arch Rock Entrance, the all-weather road",
      flights: "A 30-seat regional jet from LAX and Las Vegas, Contour Airlines, since July 2026.",
      transit: "YARTS runs up Highway 140 every day of the year from Merced's transit center and Amtrak station.",
      verdict: "The closest runway, if the one flight suits you.",
    },
    {
      code: "FAT", name: "Fresno", full: "Fresno Yosemite International Airport",
      miles: "94 mi", time: "About 2 hours 15 min", hours: [2.25, 2.25], chart: "2 h 15",
      road: "Highway 41 to the South Entrance, about 1 hour 15 min, then an hour to the Valley",
      flights: "Nonstops from SFO and LAX, and from Denver, Dallas, Phoenix, Seattle and other US hubs.",
      transit: "In summer, the YARTS Highway 41 bus leaves from the airport itself. The rest of the year, a car.",
      verdict: "The closest real airport. Fly here on a connection if you can.",
    },
    {
      code: "SMF", name: "Sacramento", full: "Sacramento International Airport",
      miles: "176 mi", time: "About 4 hours", hours: [4, 4], chart: "4 h",
      road: "South through the Central Valley to Highway 120 or 140",
      flights: "Mostly domestic. Worth pricing against SFO.",
      transit: "The San Joaquins train runs from Sacramento to Merced, where YARTS takes over.",
      verdict: "A quieter airport than SFO, the same drive.",
    },
    {
      code: "SFO", name: "San Francisco", full: "San Francisco International Airport, with Oakland (OAK) and San Jose (SJC)",
      miles: "195 mi", time: "4 to 5 hours", hours: [4, 5], chart: "4 to 5 h",
      road: "Highway 120 through Groveland, or 140 through Mariposa in winter",
      flights: "The most long-haul flights into Northern California. Oakland and San Jose are the same drive.",
      transit: "BART to Richmond, the San Joaquins to Merced, YARTS into the Valley. Four to four and a half hours, all year.",
      verdict: "The usual answer for a visitor from abroad.",
    },
    {
      code: "RNO", name: "Reno", full: "Reno-Tahoe International Airport",
      miles: "218 mi", time: "About 5 hours, June to October", hours: [5, 5], chart: "5 h",
      road: "US 395 and Tioga Pass when the pass is open; 315 miles and 5½ hours around it when it is not",
      flights: "Mostly domestic connections.",
      transit: "No practical connection.",
      verdict: "Only for a summer trip that starts on the east side.",
    },
    {
      code: "LAX", name: "Los Angeles", full: "Los Angeles International Airport",
      miles: "313 mi", time: "About 6 hours; plan on 7", hours: [6, 7], chart: "6 to 7 h",
      road: "I-5, Highway 99 and Highway 41 through Fresno to the South Entrance",
      flights: "The most long-haul flights into the state.",
      transit: "A Thruway bus to Bakersfield, the train to Merced, YARTS. A long day of connections.",
      verdict: "Fly on to Fresno or Merced, or drive up and sleep in Oakhurst.",
    },
  ];

  // Gateway towns for the first night, closest to the Valley first. Drive
  // times are GATEWAYS in page-stay.jsx, the published table in
  // yosemite-gateway-towns-compared.
  const TOWNS = [
    { id: "mariposa", name: "Mariposa and Midpines", dest: "Mariposa, California", drive: "45 to 60 min", from: "From SFO in winter, or off the Merced flight", road: "Highway 140, the road that stays open" },
    { id: "groveland", name: "Groveland", dest: "Groveland, California", drive: "65 to 80 min", from: "From SFO, Oakland, San Jose or Sacramento, spring to autumn", road: "Highway 120, the shorter line from the Bay" },
    { id: "oakhurst", name: "Oakhurst and Fish Camp", dest: "Oakhurst, California", drive: "75 to 90 min", from: "From LAX or Fresno", road: "Highway 41, the South Entrance and the Mariposa Grove" },
  ];

  const FAQ = [
    ["What is the best airport to fly into for Yosemite?", "Fresno Yosemite International is the closest major airport, about 94 miles and two hours fifteen minutes from Yosemite Valley, with nonstops from SFO and LAX. For a visitor from abroad, San Francisco is usually the practical answer: the most long-haul flights, and 195 miles and four to five hours to the Valley by the park's own figures."],
    ["Is it better to fly into SFO or LAX for Yosemite?", "SFO, unless the trip also includes Southern California. The park puts San Francisco at 195 miles and four to five hours from Yosemite Valley and Los Angeles at 313 miles and six hours, which in practice is seven. From LAX, the better move is often a connecting flight to Fresno or Merced."],
    ["Can you get to Yosemite from SFO without a car?", "Yes, all year. Take BART to Richmond, the Amtrak San Joaquins train to Merced, and the YARTS bus up Highway 140 into Yosemite Valley. Amtrak sells the train and the bus as one ticket. Allow four to four and a half hours from the Bay Area, and plan the trip around the Valley, because the bus serves one corridor, not the whole park."],
    ["Do I need a rental car for Yosemite?", "Not for one or two people on a Valley trip: the YARTS bus and the free Valley shuttle cover it. Yes for a family, for any trip that includes Glacier Point, Tuolumne Meadows or Hetch Hetchy, and for anyone sleeping off the bus routes. Four round-trip bus fares from Merced cost several times what the gate charges one car."],
    ["Can I drive in California with a foreign driver's license?", "Yes. California lets a visitor aged 18 or older drive on a valid license from home. An International Driving Permit is not a license; it is a translation carried beside one. Get one before you leave if your license is not in English, because rental desks set their own rules and many ask for it."],
    ["Do rental cars need snow chains for Yosemite?", "From roughly October through April, chains can be required on any road into the park, and every car must carry them when they are, rentals and four-wheel drives included. Rental cars do not come with chains and many rental contracts forbid fitting them. Buy a set in the city before you drive up, or come in on Highway 140, which needs them least, or take the YARTS bus."],
    ["How far is Fresno airport from Yosemite?", "About 94 miles and two hours fifteen minutes to Yosemite Valley, and about an hour and a quarter to the South Entrance on Highway 41. In summer the YARTS Highway 41 bus leaves from the airport; the 2026 season ran May 22 to September 25."],
  ];

  // ── Hours to the Valley, by airport ──────────────────────────────────────
  // A data chart of the table above (one series, one hue, every value printed
  // beside its bar), not a map: CLAUDE.md's map rule covers drawn geography.
  function DriveChart() {
    const W = 620, L = 128, R = 92, row = 44, top = 18, H = top + AIRPORTS.length * row + 34;
    const max = 7;
    const x = (h) => L + (h / max) * (W - L - R);
    return (
      <svg className="fly-chart__svg" viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="Driving time to Yosemite Valley by airport, from the National Park Service's figures: Merced about 2 hours, Fresno about 2 hours 15 minutes, Sacramento about 4 hours, San Francisco 4 to 5 hours, Reno about 5 hours in summer, Los Angeles about 6 hours, 7 in practice.">
        {[0, 2, 4, 6].map((h) => (
          <g key={h}>
            <line x1={x(h)} x2={x(h)} y1={top - 6} y2={H - 26} className="fly-chart__grid" />
            <text x={x(h)} y={H - 8} textAnchor="middle" className="fly-chart__tick">{h === 0 ? "0" : `${h} h`}</text>
          </g>
        ))}
        {AIRPORTS.map((a, i) => {
          const y = top + i * row;
          const [lo, hi] = a.hours;
          return (
            <g key={a.code}>
              <text x={L - 12} y={y + 19} textAnchor="end" className="fly-chart__name">{a.name}</text>
              <rect x={L} y={y + 6} width={x(lo) - L} height={18} rx={4} className="fly-chart__bar" />
              {hi > lo && <rect x={x(lo) + 2} y={y + 6} width={x(hi) - x(lo) - 2} height={18} rx={4} className="fly-chart__bar fly-chart__bar--range" />}
              <text x={x(hi) + 8} y={y + 20} className="fly-chart__val">{a.chart}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  function TownBook({ town, children }) {
    return (
      <AvailabilityLink destination={town.dest} list="article_town" slug="best-airport-for-yosemite" className="ff-book">
        {children || `Search ${town.name.split(" and ")[0]} ↗`}
      </AvailabilityLink>
    );
  }

  return (
    <div className="fly-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="pin" /><dt>Closest big airport</dt><dd>Fresno, 94 miles</dd></div>
          <div><EventIcon name="car" /><dt>From SFO</dt><dd>195 miles, 4 to 5 hours</dd></div>
          <div><EventIcon name="clock" /><dt>From LAX</dt><dd>313 miles, plan on 7 hours</dd></div>
          <div><EventIcon name="route" /><dt>Without a car</dt><dd>Train and bus, every day</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening, and the whole piece in four lines beside it. */}
      <section className="hp-wrap hp-section fly-open">
        <div className="ff-split">
          <div className="fly-prose">
            <p className="dropcap">
              A good share of the people I meet at the Valley visitor center started the trip on another continent. They landed at <strong>San Francisco</strong> or <strong>Los Angeles</strong> the day before, picked up a car they had never driven, on the other side of the road from home in some cases, and drove four to seven hours to a park whose size nobody had quite explained. Most of them got here fine. A few were turned around at a chain-control checkpoint in a car with no chains, or found out on the first morning that the bus they had planned the week around does not go to Glacier Point.
            </p>
            <p>
              The airport you land at decides the first day of the trip, and the way you leave it decides most of the rest. This is the version I give at the desk: which airport, how far each one really is, when a rental car is the right answer (most of the time), when the train and bus beat it, and what a visitor from abroad needs to know before taking the keys.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="alert" /> The short version</p>
            <ul>
              <li>Land at SFO, or connect on to Fresno if you can.</li>
              <li>Rent a car unless it is one or two of you on a Valley-only trip.</li>
              <li>Do not drive to the park the evening you land.</li>
              <li>October to April, carry chains or take Highway 140.</li>
            </ul>
            <TownBook town={TOWNS[1]}>Search Groveland, on the road from SFO ↗</TownBook>
            <p className="ff-disclosure">Availability search on Expedia. We may earn a commission if you book, at no cost to you. <a href="/affiliate">Disclosure.</a></p>
          </aside>
        </div>
      </section>

      {/* The airports. Six rows, closest first, with the chart beside them. */}
      <section className="ff-band" id="sec-0-pick-the-airport" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">PICK THE AIRPORT</p>
              <h2>The closest runway is rarely the one you land on</h2>
              <div className="fly-prose">
                <p>
                  Yosemite has no airport of its own and none of the big international ones is close. <strong>Fresno</strong> is the nearest airport with real service, about 94 miles and two hours fifteen minutes from the Valley. <strong>San Francisco</strong> and <strong>Los Angeles</strong> are where most flights from abroad land, at four to five hours and six to seven hours respectively by the park's own figures, before you add a stop for food or a line at the gate.
                </p>
                <p>
                  The trick most visitors miss: the long-haul flight decides the city, but it does not have to decide the airport. Fresno has nonstops from both SFO and LAX, and a connection that costs an hour in the air saves three or four on the road. It also puts you on the side of the park with the giant sequoias, which is a fine first morning.
                </p>
              </div>
            </div>
            <figure className="fly-chart">
              <figcaption>Hours to Yosemite Valley, by car</figcaption>
              <DriveChart />
              <p className="ff-note">National Park Service figures, to the Valley floor in clear conditions. The darker bar is the low end; the lighter, the high end of a range. From Reno, summer only, over Tioga Pass.</p>
            </figure>
          </div>

          <div className="fly-airports">
            {AIRPORTS.map((a) => (
              <article key={a.code} className="fly-airport">
                <p className="fly-airport__code">{a.code}</p>
                <div className="fly-airport__head">
                  <h3>{a.name}</h3>
                  <p>{a.full}</p>
                </div>
                <dl>
                  <div><dt>To the Valley</dt><dd><strong>{a.miles}</strong> · {a.time}</dd></div>
                  <div><dt>The road</dt><dd>{a.road}</dd></div>
                  <div><dt>Flights</dt><dd>{a.flights}</dd></div>
                  <div><dt>Without a car</dt><dd>{a.transit}</dd></div>
                </dl>
                <p className="fly-airport__verdict">{a.verdict}</p>
              </article>
            ))}
          </div>
          <p className="ff-note">Every entrance and its road, and why your phone's route is not to be trusted: <a href="/articles/getting-to-yosemite">getting to Yosemite</a>. The drive from the gateway towns to the Valley, mile by mile: <a href="/distances">the drive-time table</a>.</p>
        </div>
      </section>

      {/* Car or train and bus: the decision, as two columns of conditions. */}
      <section className="hp-wrap hp-section" id="sec-1-rent-a-car-usually" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">CAR, OR TRAIN AND BUS</p>
            <h2>Rent a car, usually</h2>
            <div className="fly-prose">
              <p>
                There is a real public-transport route into Yosemite, and I recommend it to the right people. But the park is the size of a small country, the bus serves one road through it, and the sights a first visit is built around are spread across four corners: the Valley, Glacier Point an hour above it, the Mariposa Grove more than an hour south, and Tuolumne Meadows an hour and a half east over Tioga Road in summer. A car is what joins them.
              </p>
              <p>
                It is also usually cheaper. The entrance fee is charged <strong>per car</strong> if you drive in, $35 for seven days, and per person if you arrive on foot or by bus. Bus fares are per person too: a round trip from Merced is $44 for an adult, so four adults pay $176 before the gate. The $100 non-resident fee is charged per person aged 16 and older either way, so it does not change the answer; <a href="/international">the international visitors page</a> works out the cheapest way to pay it.
              </p>
            </div>
          </div>
          <div className="fly-choose">
            <div className="fly-choose__col fly-choose__col--car">
              <p className="fly-choose__head"><EventIcon name="car" size={24} /> Rent a car if</p>
              <ul>
                <li>There are three or more of you.</li>
                <li>The trip includes Glacier Point, Tuolumne, Hetch Hetchy or the Mariposa Grove outside summer.</li>
                <li>You are sleeping off the bus routes, or arriving after the last bus.</li>
                <li>You want sunrise starts, or to move when the light is good.</li>
              </ul>
            </div>
            <div className="fly-choose__col">
              <p className="fly-choose__head"><EventIcon name="route" size={24} /> Take the train and bus if</p>
              <ul>
                <li>It is one or two of you, on a Valley trip.</li>
                <li>You are sleeping in the Valley or on Highway 140.</li>
                <li>It is winter and you would rather not fit chains on a car you met yesterday.</li>
                <li>Driving on the right after a long flight is the part you dread.</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="ff-alert"><EventIcon name="alert" /><span><strong>Park once.</strong> A car does not mean driving all day. Valley parking fills early on summer weekends, so leave the car where you slept or at the first lot you find, and ride the free Valley shuttle. <a href="/articles/yosemite-valley-parking-guide">The parking guide</a> has the hours that work.</span></p>
      </section>

      {/* The car-free way in, from each of the three airports that have one. */}
      <section className="ff-band" id="sec-2-the-car-free-way-in" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE CAR-FREE WAY IN</p>
              <h2>Train, then bus, from the Bay</h2>
              <div className="fly-prose">
                <p>
                  From San Francisco the route is three legs, and it runs every day of the year. The San Joaquins train does not reach the city itself, so you start on BART. Amtrak sells the train and the YARTS bus as one ticket to Yosemite, and the bus is timed to meet the trains at Merced. Allow four to four and a half hours from the Bay, which is no faster than driving and a good deal more restful.
                </p>
                <p>
                  The bus drops you at Yosemite Valley Lodge, Yosemite Village or Curry Village, all on the free Valley shuttle. Whether the bus fare also covers your entrance fee is something the park's pages and YARTS' own currently answer differently, so budget for it; <a href="/articles/yosemite-shuttle-and-yarts">the shuttle and YARTS guide</a> sets out both positions and the timetable.
                </p>
              </div>
            </div>
            <figure className="fly-photo">
              <ResponsiveImage image="img/yarts-bus-merced-amtrak.jpg" style={{ aspectRatio: "1600 / 794" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
                alt="Passengers with bicycles and bags boarding a green YARTS coach at the Merced Amtrak station" />
              <figcaption>The YARTS coach meeting the train at Merced. Photo: RickyCourtney / Wikimedia Commons (CC BY-SA 3.0)</figcaption>
            </figure>
          </div>

          <ol className="ff-timeline fly-legs">
            <li className="is-open"><span>Leg one</span><strong>BART to Richmond</strong><p>From the station at SFO's international terminal, usually with a change of line in Oakland. From Oakland's airport, the BART connector joins the same network.</p></li>
            <li className="is-open"><span>Leg two</span><strong>San Joaquins to Merced</strong><p>Amtrak's Central Valley train, south from Richmond. From Sacramento, board at the city's Amtrak station.</p></li>
            <li className="is-open"><span>Leg three</span><strong>YARTS up Highway 140</strong><p>From the Merced Amtrak station, through Mariposa and El Portal, into the Valley. $22 one way, $44 round trip for an adult.</p></li>
            <li className="is-open"><span>In the Valley</span><strong>The free shuttle</strong><p>From the bus stop to wherever you are sleeping or walking. No ticket.</p></li>
          </ol>

          <div className="fly-routes">
            <div>
              <h3>From LAX</h3>
              <p>The same idea and a longer day: an Amtrak Thruway bus from Union Station to Bakersfield, the San Joaquins north to Merced, then YARTS. Most visitors are better served by the short flight to Fresno or Merced.</p>
            </div>
            <div>
              <h3>From Fresno, in summer</h3>
              <p>The YARTS Highway 41 bus leaves from the airport itself and calls at Oakhurst, the Mariposa Grove and Wawona on the way to the Valley. $20 one way. The 2026 season ran May 22 to September 25; outside it, Fresno means a car.</p>
            </div>
            <div>
              <h3>From Merced's airport</h3>
              <p>YARTS leaves from Merced's transit center and its Amtrak station all year, and calls at the airport on some runs. Check the timetable against your flight before counting on it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Driving here: the rule cards. Each restates a source named above. */}
      <section className="hp-wrap hp-section" id="sec-3-driving-here-on-a-license-from-home" tabIndex={-1}>
        <p className="hp-eyebrow">DRIVING HERE ON A LICENSE FROM HOME</p>
        <h2>What the rental desk will not tell you</h2>
        <p className="ff-lede ff-lede--intro">None of this is difficult. All of it is easier to learn at home than at a counter after an eleven-hour flight.</p>
        <ul className="ff-rules fly-rules">
          <li className="is-exception"><EventIcon name="id" size={26} /><strong>Your license works</strong><p>California lets a visitor aged 18 or older drive on a valid license from home. No local license is needed for a holiday.</p></li>
          <li className="is-exception"><EventIcon name="ticket" size={26} /><strong>The permit is a translation</strong><p>An International Driving Permit is not a license; it is carried beside one. Get it at home if your license is not in English. Rental desks set their own rules, and many ask for it.</p></li>
          <li><EventIcon name="ticket" size={26} /><strong>A credit card, in the driver's name</strong><p>Rental desks want one. So does the park: the entrance stations take cards only, no cash.</p></li>
          <li><EventIcon name="users" size={26} /><strong>Under 25 costs more</strong><p>The large rental companies add a daily charge for younger drivers, and some vehicle classes are off limits. Check before you book, not at the counter.</p></li>
          <li><EventIcon name="snow" size={26} /><strong>Chains, October to April</strong><p>When chain controls are posted, every car must carry chains, four-wheel drives and rentals included. Rentals come without them and many contracts forbid fitting them. Buy a set in the city, or come in on Highway 140.</p></li>
          <li><EventIcon name="fuel" size={26} /><strong>No gas in the Valley</strong><p>Fill up before the mountains. Inside the park there is fuel only at Wawona, Crane Flat and El Portal. Pumps often ask for a US ZIP code; with a foreign card, pay inside first.</p></li>
          <li><EventIcon name="signal" size={26} /><strong>Believe the road signs</strong><p>Phone signal dies before the park boundary, and the park itself warns that a GPS route can be wrong. Download offline maps the night before, and when the sign and the app disagree, follow the sign.</p></li>
          <li><EventIcon name="route" size={26} /><strong>Small rules that differ</strong><p>Speeds are in miles per hour. A right turn on a red light is legal after a full stop unless a sign forbids it. At a four-way stop, whoever stopped first goes first.</p></li>
        </ul>
      </section>

      {/* The first day, hour by hour, and the three towns that make it work. */}
      <section className="ff-band" id="sec-4-the-first-day" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE FIRST DAY</p>
              <h2>Do not drive to the park the evening you land</h2>
              <div className="fly-prose">
                <p>
                  The most dangerous part of a Yosemite trip for a visitor from abroad is not a trail. It is the last two hours of the drive in, on a mountain road in the dark, with a body that thinks it is three in the morning. Every approach to the Valley ends in a long climb with curves, rockfall and deer, and on Highways 41 and 120 the climb runs into snow for much of the year.
                </p>
                <p>
                  If you land after midday, sleep near the airport and drive in the next morning. Then sleep the second night in a gateway town on your road, and reach the gate before 8 a.m. the morning after, when the entrance line and the Valley lots are still empty. In 2026 there is no entry reservation to hold, so the hour you arrive is the whole strategy.
                </p>
              </div>
            </div>
            <ol className="ff-hours">
              <li><span>Landing day</span><p>Immigration, customs, the rental car. Sleep near the airport.</p></li>
              <li><span>Next morning</span><p>Leave after the rush hour. Buy chains in the city in the cold months, and food for a cooler; the Valley's is limited and busy at lunch.</p></li>
              <li><span>Midday</span><p>Fill the tank in the Central Valley, before the climb.</p></li>
              <li><span>Afternoon</span><p>Check in at a gateway town. If there is light left, drive in after 4 p.m., when the gate is quiet, for the evening.</p></li>
              <li className="is-glow"><span>Day two, before 8 a.m.</span><p>Through the gate before the line forms, and parked before the lots fill.</p></li>
            </ol>
          </div>

          <div className="ff-towns fly-towns">
            {TOWNS.map((t) => (
              <div className="ff-town" key={t.id}>
                <div className="ff-town__name">
                  <h3>{t.name}</h3>
                  <p><strong>{t.drive}</strong> to the Valley · {t.road}</p>
                </div>
                <div className="ff-town__note">
                  <span className="ff-tier">{t.from}</span>
                </div>
                <TownBook town={t} />
              </div>
            ))}
            <p className="ff-note">The filled buttons search availability on Expedia; we may earn a commission. The recommendation is the same either way, and no link is to a specific property. <a href="/affiliate">How we handle affiliate links.</a> Every town compared, with its season and its road: <a href="/articles/yosemite-gateway-towns-compared">the gateway towns compared</a>. Beds inside the park open about a year ahead: <a href="/stay">where to stay</a>.</p>
          </div>
        </div>
      </section>

      {/* One-way rentals: the loop most visitors from abroad actually drive. */}
      <section className="hp-wrap hp-section" id="sec-5-one-way-in-another-way-out" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">ONE WAY IN, ANOTHER WAY OUT</p>
            <h2>San Francisco in, Los Angeles out</h2>
            <div className="fly-prose">
              <p>
                A lot of visitors from abroad are not making a Yosemite trip at all. They are making a California trip with Yosemite in the middle, and the natural shape is to fly into one city and out of the other. It works well, and it costs a one-way drop fee that varies by company and season, so price the car before you price the flights around it.
              </p>
              <p>
                Coming from the north, enter on Highway 120 or 140 and leave on Highway 41: through the Wawona Tunnel and past Tunnel View, the Mariposa Grove at the South Entrance, Oakhurst for the night, then Fresno and Highway 99 south. <a href="/articles/yosemite-from-los-angeles">The Los Angeles drive</a> covers that road in both directions, the Grapevine and the winter fog included.
              </p>
            </div>
          </div>
          <div className="fly-loop">
            <div className="fly-loop__way">
              <p className="fly-loop__season">All year</p>
              <h3>Out the south side</h3>
              <p>Highway 41 to Fresno, then south. About six hours from the Valley to Los Angeles.</p>
            </div>
            <div className="fly-loop__way">
              <p className="fly-loop__season">Summer only</p>
              <h3>Over Tioga Pass</h3>
              <p>East over the pass, then south down US 395 past Mammoth Lakes and Lone Pine. Longer and slower, and superb. The road is typically open from late May or June into November; check <a href="/tioga-opening">the Tioga Road page</a> before you book a route that needs it.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ff-band" id="best-airport-questions" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Flying in, answered</h2>
            <p className="ff-lede">What a week costs once you have landed, flights aside: <a href="/articles/yosemite-trip-cost-budget">the trip-cost breakdown</a>. The entrance fee for a visitor from abroad, and a calculator for the cheapest way to pay it: <a href="/international">visiting from abroad</a>.</p>
            <div className="ff-closing">
              <p className="hp-eyebrow">LANDING AT LAX?</p>
              <h3>Sleep in Oakhurst</h3>
              <p>An Oakhurst or Fish Camp bed turns the push from Los Angeles into an afternoon drive and a morning at the gate before the line forms.</p>
              <TownBook town={TOWNS[2]}>Search Oakhurst lodging ↗</TownBook>
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

      <div className="hp-wrap fly-end">
        <AffiliateNote />
      </div>
    </div>
  );
};
