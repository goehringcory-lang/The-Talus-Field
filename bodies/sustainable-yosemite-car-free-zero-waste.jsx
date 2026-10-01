/* global React, EventIcon, ResponsiveImage */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// A feature article on the /firefall system (the El Capitan recipe): the
// catalog entry carries a `feature` block (data.js), so page-article.jsx draws
// the full-width photo cover and hands this body the page's width. Sections
// sit on `hp-wrap`, alternating paper and the `ff-band` tint; the page's own
// pieces are the `.sv-*` layer at the end of styles.css.
//
// Three rules hold it up.
//   1. Every figure is quoted from a primary page read on October 1, 2026 and
//      listed under Sources: the NPS public transportation, fees, biking,
//      bears, campground regulations, Mariposa Grove, EV charging, climate
//      response and Zero Landfill pages; YARTS' fares, how-to-ride and
//      Highway 140 pages; Amtrak's Yosemite page; the Yosemite Conservancy's
//      sustainability and Bike Share pages; and the concessioner's biking page
//      and plastics announcement. Every card, chip and caption restates a
//      sentence in this body; the graphics add no fact of their own.
//   2. Two sources disagree about the entrance fee on YARTS (YARTS says it is
//      not in the fare, Amtrak says its through tickets include admission).
//      The page says so and gives the conservative advice, as the shuttle and
//      YARTS article does, rather than picking a winner.
//   3. The map is the National Park Service's own Valley map, the crop the
//      dining article uses (img/nps-valley-dining-map.jpg, 840 x 500, cut
//      from img/nps-yosemite-valley-map.jpg at +1300+100), with that
//      article's pin positions for the lodge, the village and Curry Village.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["sustainable-yosemite-car-free-zero-waste"] = function SustainableYosemiteBody() {
  const TOC = [
    ["#why-the-car", "Why the car"],
    ["#train-and-bus", "Train and bus"],
    ["#entrance-fee", "The entrance fee"],
    ["#in-the-park", "Getting around"],
    ["#by-bike", "By bike"],
    ["#zero-waste", "Zero waste"],
    ["#propane-and-fire", "Propane and fire"],
    ["#if-you-drive", "If you drive"],
    ["#the-kit", "The kit"],
    ["#sustainable-yosemite-questions", "Questions"],
  ];

  const FAQ = [
    ["Can you get to Yosemite without a car?", "Yes. Take Amtrak's Gold Runner to Merced and transfer to the YARTS bus on Highway 140, which runs year-round to Yosemite Valley and connects with the trains at the Merced Amtrak station. In summer YARTS also runs from Fresno, Sonora and Mammoth Lakes. Inside the Valley the shuttle is free, and there are about 12 miles of paved bike paths."],
    ["How much is the YARTS bus from Merced to Yosemite Valley?", "YARTS lists $22 one way and $44 round trip for an adult between Merced and Yosemite Valley, with reduced fares of $11 and $22. Children 5 and under ride free, and one child aged 6 to 12 rides free with each paid adult. Booking online adds a small fee."],
    ["Does the YARTS fare include the Yosemite entrance fee?", "The sources disagree. YARTS says gate and non-resident fees are not included in its ticket prices and can be paid to the Park Service on Recreation.gov, while Amtrak's Yosemite page says its tickets include admission. Plan to pay: the per-person pass is $20 for seven days, people 15 and under are free, and the park does not accept cash."],
    ["Is there a bike share in Yosemite?", "Yes. The Yosemite Conservancy and the Park Service run a free Bike Share in Yosemite Valley with 50 bikes, usually available between June and October. You unlock a bike with the LINKA GO app, rides last up to two hours, and you must start and end at a Bike Share hub. For longer rides, the concessioner rents bikes at Yosemite Valley Lodge, Curry Village and Yosemite Village."],
    ["Does Yosemite recycle?", "Yes. At Park Service sites recycling is mixed, so everything recyclable goes in one bin unless it is labeled otherwise. Styrofoam, bubble wrap, plastic bags and unlabeled plastic are not recyclable there. Treat trash and recycling like food: keep it in your food locker or use a bear-proof bin."],
    ["Can I recycle propane canisters in Yosemite?", "Empty canisters go to the park's recycling areas, and around 24,000 are collected each year. A better answer is a refillable canister: the Village Store, Curry Village Gift Shop, Mountain Shop, Wawona Store and El Portal Market sell them, and you can exchange an empty for a full one at a lower price."],
    ["Are there EV chargers in Yosemite?", "Yes. The park lists chargers in Yosemite Valley, Wawona, El Portal and Tuolumne Meadows, all with J1772 connectors. In the Valley they include Curry Village, Yosemite Falls parking, Yosemite Valley Lodge and The Ahwahnee."],
  ];

  // ── The Valley: where the bus sets down, the bikes and the propane ────────
  // Crop pixels (840 x 500), the dining article's pin positions. Each line in
  // the key restates this body: YARTS stops at all three; the concessioner's
  // rental stands are at all three; the refillable canisters are sold at the
  // Village Store and the Curry Village Gift Shop; the Bike Share's blue bikes
  // sit in the Yosemite Village area.
  const PINS = [
    { n: "1", x: 176, y: 272, name: "Yosemite Valley Lodge", what: "YARTS stop, bike rental, EV chargers" },
    { n: "2", x: 385, y: 145, name: "Yosemite Village", what: "YARTS stop, bike rental, Bike Share, refillable propane" },
    { n: "3", x: 600, y: 372, name: "Curry Village", what: "YARTS stop, bike rental, refillable propane, EV chargers" },
  ];
  function CarFreeValleyMap() {
    return (
      <figure className="npsmap sv-map">
        <div className="npsmap__frame">
          <img src="/img/nps-valley-dining-map.jpg" width="840" height="500" loading="lazy" decoding="async"
            alt="National Park Service map of the east end of Yosemite Valley with three places marked: Yosemite Valley Lodge to the west below Yosemite Falls, Yosemite Village beside the visitor center, and Curry Village on the south side. YARTS stops and bike rentals are at all three." />
          <svg viewBox="0 0 840 500" aria-hidden="true" focusable="false">
            {PINS.map((p) => (
              <g key={p.n}>
                <circle className="npsmap__pin npsmap__pin--rust" cx={p.x} cy={p.y} r="15" />
                <text className="npsmap__num" x={p.x} y={p.y + 6} textAnchor="middle">{p.n}</text>
              </g>
            ))}
          </svg>
        </div>
        <figcaption>
          {PINS.map((p) => <span key={p.n}><b className="sv-map__num">{p.n}</b> {p.name}: {p.what}</span>)}
          <span>Map: National Park Service (public domain), cropped.</span>
        </figcaption>
      </figure>
    );
  }

  // ── The park's footprint, in the Park Service's own figures ──────────────
  const STATS = [
    ["Over 60%", "of the park's carbon footprint is individual vehicles"],
    ["80 million", "miles driven by visitors inside Yosemite every year"],
    ["3,200 tons", "of trash thrown away in the park every year"],
    ["Almost 50 miles", "each way, by truck, to the Mariposa County Landfill"],
  ];

  return (
    <div className="sv-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="route" /><dt>The way in</dt><dd>Amtrak to Merced, then YARTS</dd></div>
          <div><EventIcon name="ticket" /><dt>The bus fare</dt><dd>$22 each way from Merced</dd></div>
          <div><EventIcon name="clock" /><dt>In the Valley</dt><dd>A free shuttle, 7 a.m. to 10 p.m.</dd></div>
          <div><EventIcon name="check" /><dt>The bins</dt><dd>One bin for all recycling</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening, and the whole page in five lines beside it. */}
      <section className="hp-wrap hp-section sv-open">
        <div className="ff-split">
          <div className="sv-prose">
            <p className="dropcap">
              The greenest thing most visitors can do in Yosemite is the one they rarely consider: <strong>leave the car at home</strong>. Not because a single car matters much on its own, but because the Park Service's own accounting says private vehicles are the largest part of the park's carbon footprint, and the trash a visit leaves behind travels by truck to a landfill outside the park. Both have workable answers, and none of them requires giving anything up.
            </p>

            <p>There is a train to Merced and a public bus from the station to the Valley floor. Inside the Valley there is a free shuttle, twelve miles of paved bike path and a free bike share. The bins take recycling, the stores sell refillable propane, and the water bottle you already own is the most useful piece of zero-waste kit you can carry.</p>

            <p>This is the whole plan: how to get in without driving, how to get around once you are here, what goes in which bin, and what to do if you have to drive anyway.</p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>Ride Amtrak to Merced and YARTS to the Valley. It runs all year.</li>
              <li>Buy your entrance pass before you board. The park takes no cash.</li>
              <li>Use the free shuttle and the bike paths, not a car.</li>
              <li>Carry a bottle, containers and a bag for your own trash.</li>
              <li>Buy a refillable propane canister instead of a disposable one.</li>
            </ul>
            <a className="sv-short__link" href="#train-and-bus">The train and bus, step by step</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="why-the-car" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">WHY THE CAR</p>
              <h2>The footprint is the drive, and the trash</h2>
              <div className="sv-prose">
                <p>
                  The Park Service is plain about where the park's emissions come from. Visitors collectively drive <strong>over 80 million miles inside Yosemite</strong> every year, and individual vehicles account for <strong>over 60 percent of the park's carbon footprint</strong>. They also bring the noise, the congestion and the long lines at the entrance stations that make a summer Saturday in the Valley feel like a commute.
                </p>
                <p>
                  The second number is trash. People throw away <strong>over 3,200 tons</strong> of it in Yosemite every year, and every pound leaves the park by truck: almost 50 miles to the Mariposa County Landfill from the Valley, about 90 from Tuolumne Meadows. The Yosemite Conservancy puts the scale another way: in 2019, trash from Yosemite was nearly a quarter of the solid waste that reached the county landfill. The park recycles almost 980 tons a year, and the recycling program is older than most visitors, started in 1975 with aluminum, glass and paper.
                </p>
                <p>
                  Neither problem is solved by a visitor feeling bad about it. Both are solved, a little, by the visitor who arrives on a bus and leaves with less in the bin.
                </p>
              </div>
            </div>
            <div className="sv-stats">
              <p className="hp-eyebrow">THE PARK'S OWN FIGURES</p>
              <dl>
                {STATS.map(([n, label]) => (
                  <div key={n}><dt>{n}</dt><dd>{label}</dd></div>
                ))}
              </dl>
              <p className="ff-note">Figures from the Park Service's climate response page. The landfill trip is about 90 miles from Tuolumne Meadows.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="train-and-bus" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">GETTING THERE</p>
            <h2>Amtrak to Merced, YARTS to the Valley</h2>
            <div className="sv-prose">
              <p>
                The car-free route into Yosemite starts on a train. Amtrak's <strong>Gold Runner</strong>, the Central Valley line long known as the San Joaquins, stops at the Merced station. There you transfer to the Amtrak connection bus, which Amtrak lists as Route 15 and which is run by <strong>YARTS</strong>, the Yosemite Area Regional Transportation System. It goes straight to Yosemite Valley. Mariposa County's visitor bureau notes that you can book the whole trip at once, train and bus together, rather than buying two tickets.
              </p>
              <p>
                You can also ride YARTS on its own. The <strong>Highway 140</strong> route is the only one that runs all year. It picks up at Merced Airport, Merced Transpo and the Merced Amtrak station, then climbs through Mariposa, Midpines and El Portal along the Merced River canyon. In the Valley it stops at Yosemite Valley Lodge, Yosemite Village and Curry Village. The winter timetable, which began October 1, 2026 and runs to May 28, 2027, makes the Merced to Valley trip in about three hours. There is no service on Thanksgiving, Christmas, New Year's Day or Easter.
              </p>
              <p>
                In summer three more routes run: Highway 41 from Fresno through Oakhurst and Fish Camp, Highway 120 west from Sonora through Groveland, and Highway 120 east from Mammoth Lakes, June Lake and Lee Vining over Tioga Pass. The <a href="/articles/yosemite-shuttle-and-yarts">full guide to the shuttle and YARTS</a> covers every corridor, and the <a href="/articles/getting-to-yosemite">guide to getting to Yosemite</a> weighs the bus against the drive from each direction.
              </p>
            </div>
          </div>
          <figure className="sv-photo">
            <ResponsiveImage image="img/yarts-bus-merced-amtrak.jpg" style={{ aspectRatio: "1600 / 794" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="Passengers with bicycles and bags boarding a green YARTS coach at the Merced Amtrak station" />
            <figcaption>Amtrak connection passengers boarding a YARTS coach at the Merced station. Photo: RickyCourtney / Wikimedia Commons (CC BY-SA 3.0)</figcaption>
          </figure>
        </div>

        <div className="sv-ride">
          <article className="ff-inpark">
            <p className="hp-eyebrow">YARTS · HIGHWAY 140 · ALL YEAR</p>
            <h3>Merced to Yosemite Valley</h3>
            <dl>
              <div><dt>Adult</dt><dd>$22 one way, $44 round trip</dd></div>
              <div><dt>Reduced</dt><dd>$11 one way, $22 round trip</dd></div>
              <div><dt>Children</dt><dd>5 and under free; one child 6 to 12 free with each paid adult</dd></div>
              <div><dt>Pay</dt><dd>Online, or on board by card or exact cash</dd></div>
              <div><dt>Booking</dt><dd>Optional. Walk-ons ride first come, first served</dd></div>
            </dl>
            <p className="ff-note">Reduced fares cover ages 6 to 17, riders 62 and over, veterans and riders with disabilities. Booking online adds a small fee. Fares from the <a href="https://www.yarts.com/tickets-and-fares/" target="_blank" rel="noopener noreferrer">YARTS fares page</a>.</p>
          </article>
          <ul className="ff-rules sv-rules">
            <li className="is-exception">
              <EventIcon name="users" size={26} />
              <strong>Bags are welcome.</strong>
              <p>YARTS takes backpacks of any size. Pack light anyway: the park says luggage storage is not available in Yosemite.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="route" size={26} />
              <strong>Bikes go underneath.</strong>
              <p>In the storage bays under the bus, as space allows, first come, first served, and disassembled. Not in the cabin, and never guaranteed.</p>
            </li>
            <li>
              <EventIcon name="no" size={26} />
              <strong>No pets.</strong>
              <p>Only service animals ride YARTS, and pets are not allowed on the Mariposa Grove shuttle either.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="ff-band" id="entrance-fee" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">THE ENTRANCE FEE</p>
            <h2>Two official sources, two answers</h2>
            <div className="sv-prose">
              <p>
                Whether the bus fare covers park admission is the one question a car-free visitor cannot get a straight answer to. <strong>YARTS says it does not</strong>: its rider page says Park Service gate fees and non-resident fees are not included in YARTS ticket prices and can be paid to the Park Service through Recreation.gov. YARTS also says it does not require the fees as a condition of booking or boarding. <strong>Amtrak's Yosemite page says the opposite</strong>, that its tickets to Yosemite include the bus ride and admission to the park.
              </p>
              <p>
                The safe plan is to pay. The per-person entrance pass, for anyone arriving on foot, by bicycle, on a horse or in a non-commercial bus or van, is <strong>$20</strong> and is good for seven consecutive days. People 15 and under are free. Non-US residents 16 and over pay an <strong>additional $100</strong> per person unless they hold an annual or America the Beautiful pass, which settles the question for everyone who carries one. Buy the pass before you board, because <strong>the park does not accept cash</strong>.
              </p>
              <p>
                One thing you do not need: a reservation. Yosemite is not using a timed entry reservation system in 2026.
              </p>
            </div>
          </div>
          <div className="sv-fee">
            <div className="ff-alert">
              <EventIcon name="alert" />
              <p><strong>Budget the fee.</strong> YARTS tells its riders the entrance fee is theirs to pay. If you are waved through on an Amtrak ticket, treat it as a refund.</p>
            </div>
            <dl className="sv-fee__table">
              <div><dt>Per person, 16 and over</dt><dd>$20 for seven days</dd></div>
              <div><dt>15 and under</dt><dd>Free</dd></div>
              <div><dt>Non-US residents, 16 and over</dt><dd>$100 more, per person</dd></div>
              <div><dt>Annual or America the Beautiful pass</dt><dd>Covers it</dd></div>
              <div><dt>Cash</dt><dd>Not accepted</dd></div>
            </dl>
            <p className="ff-note">The trip-cost guide works through the fee for a family and for overseas visitors: <a href="/articles/yosemite-trip-cost-budget">what a Yosemite trip costs</a>.</p>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="in-the-park" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">GETTING AROUND</p>
            <h2>The free shuttle, and the buses beyond the Valley</h2>
            <div className="sv-prose">
              <p>
                Once you are on the Valley floor, the <strong>Yosemite Valley shuttle is free</strong>: no ticket, no pass. Two routes run from 7 a.m. to 10 p.m. The <strong>Valleywide</strong> route stops at the lodges, food service, campgrounds and trailheads, and the Park Service says a bus arrives every 12 to 22 minutes. The <strong>East Valley</strong> route covers the campgrounds and trailheads at the east end, every 8 to 12 minutes. That is the bus for Happy Isles, the Mist Trail and the Pines campgrounds. Since YARTS sets down at the lodge, the village and Curry Village, all of them on the shuttle line, you can arrive by bus and never need anything else.
              </p>
              <p>
                Beyond the Valley the choices narrow. The <strong>Mariposa Grove shuttle</strong> is free and runs from the Welcome Plaza near the South Entrance about every 15 minutes in season, which this year ends November 30 at the latest. In winter a free shuttle runs between the Valley and Badger Pass whenever the ski area is open, typically mid-December through March. The hikers' bus to Tuolumne Meadows and the Glacier Point tour are fee-based and summer only. For a trip that stays in the Valley, the free shuttle and a bike cover almost everything; the <a href="/articles/yosemite-valley-parking-guide">Valley parking guide</a> explains why a driver ends up doing the same thing after parking once.
              </p>
            </div>
          </div>
          <CarFreeValleyMap />
        </div>
      </section>

      <section className="ff-band" id="by-bike" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">BY BIKE</p>
              <h2>Twelve miles of path, and fifty free bikes</h2>
              <div className="sv-prose">
                <p>
                  The Valley floor is flat, and the Park Service counts <strong>over 12 miles of paved bike paths</strong> on it, with a 15 mph speed limit. A bike reaches the meadows, the bridges and the trailheads faster than the shuttle on a busy afternoon, and it parks anywhere.
                </p>
                <p>
                  The <strong>Yosemite Bike Share</strong> is free. The Yosemite Conservancy and the Park Service launched it in 2018, and the Conservancy has since tripled the fleet. There are <strong>50 bikes</strong>, usually available between June and October, with dates that vary each year. Download the LINKA GO app, create an account, and scan the QR code on the bike to unlock it. Rides last up to <strong>two hours</strong>, and you must start and end at a designated Bike Share hub; look for the blue bikes in the Yosemite Village area.
                </p>
                <p>
                  For a longer ride or a child's bike, the concessioner rents bikes at <strong>Yosemite Valley Lodge, Curry Village and Yosemite Village</strong>, roughly from early April to late October as conditions allow. A standard bike is $48 for a full day and $36.50 for a half day, and bikes with a child trailer are available.
                </p>
              </div>
            </div>
            <figure className="sv-photo">
              <ResponsiveImage image="img/yosemite-valley-bike-path.jpg" style={{ aspectRatio: "1600 / 1200" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
                alt="A paved bike path running beside the road across the Yosemite Valley floor, with granite cliffs on the left and Half Dome in the distance" />
              <figcaption>A Valley bike path in October. Photo: Vulturesong / Wikimedia Commons (CC0)</figcaption>
            </figure>
          </div>

          <ul className="ff-rules sv-rules sv-rules--four">
            <li>
              <EventIcon name="alert" size={26} />
              <strong>Helmets under 18.</strong>
              <p>Required by law for riders under 18. A rental comes with one.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="bolt" size={26} />
              <strong>E-bikes are allowed.</strong>
              <p>With fully operable pedals and a motor under 750 watts, wherever a bicycle may go.</p>
            </li>
            <li>
              <EventIcon name="no" size={26} />
              <strong>No riding off the pavement.</strong>
              <p>No off-trail riding and no mountain biking. Bikes stay on paved paths and roads.</p>
            </li>
            <li>
              <EventIcon name="route" size={26} />
              <strong>Scooters stay on paths.</strong>
              <p>Electric scooters are allowed on the bike paths but not on park roads.</p>
            </li>
          </ul>
          <p className="ff-note">In the Mariposa Grove, bikes are allowed only on the grove road between the Welcome Plaza and the Grizzly Giant, when the road is open. Rules from the Park Service's biking page; Bike Share details from the Conservancy.</p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="zero-waste" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">ZERO WASTE</p>
            <h2>What goes in which bin</h2>
            <div className="sv-prose">
              <p>
                The first rule is the oldest one: bring less packaging into the park. Carry a refillable water bottle, decant snacks into reusable containers at home, and pack a bag for your own trash. Water bottle <strong>refill stations</strong> were among the first projects of the park's zero-landfill work, and there is one at The Depot, the Conservancy bookstore at the Mariposa Grove Welcome Plaza.
              </p>
              <p>
                At Park Service sites (campgrounds, visitor centers, the museum, bus stops and day-use picnic areas) <strong>recycling is mixed</strong>: everything recyclable goes in one bin unless it is labeled otherwise. Some things never belong there. <strong>Styrofoam, bubble wrap, plastic bags and unlabeled plastic</strong> are not recyclable in the park's system. At the hotels and restaurants, bins are separated, and food scraps go in the organic waste cans. Organics matter here: a 2015 waste audit found 684.8 tons of organic material going to the landfill every year, 32 percent of the park's landfill waste.
              </p>
              <p>
                In Yosemite, trash is also a bear problem. The Park Service's rule is to <strong>treat trash and recycling like food</strong>: keep it in your food locker or put it in a bear-proof bin, never on the picnic table. Improper food storage can bring a fine of up to $5,000, and the <a href="/articles/yosemite-bears-safety-guide">bear safety guide</a> explains why a bear that learns a bin is an easy meal rarely unlearns it. Backpackers carry all food, trash and toiletries in a bear-resistant container and pack every bit of it out, the rule the <a href="/articles/yosemite-wilderness-permits-guide">wilderness permits guide</a> covers in full.
              </p>
              <p>
                The concessioner has done part of the work already. Yosemite Hospitality says it replaced single-use plastic bottles with glass or aluminum across its stores and restaurants in December 2023 and moved its grab-and-go food to compostable packaging. A refillable bottle still beats all of it.
              </p>
            </div>
          </div>
          <figure className="sv-photo">
            <ResponsiveImage image="img/bear-resistant-recycling-upper-pines.jpg" style={{ aspectRatio: "1600 / 1200" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="A green bear-resistant recycling container beside a brown trash container in Upper Pines Campground" />
            <figcaption>A bear-resistant recycling bin in Upper Pines Campground. Photo: Mx. Granger / Wikimedia Commons (CC0)</figcaption>
          </figure>
        </div>

        <div className="sv-bins">
          <div className="sv-bin sv-bin--yes">
            <p className="sv-bin__head"><EventIcon name="check" /> The recycling bin</p>
            <p>Some plastics, paper, cardboard, glass and metals. At Park Service sites, all in one bin.</p>
          </div>
          <div className="sv-bin sv-bin--food">
            <p className="sv-bin__head"><EventIcon name="food" /> The organics can</p>
            <p>Food scraps, where the hotels and restaurants provide one.</p>
          </div>
          <div className="sv-bin sv-bin--no">
            <p className="sv-bin__head"><EventIcon name="no" /> Never in recycling</p>
            <p>Styrofoam, bubble wrap, plastic bags, unlabeled plastic.</p>
          </div>
          <div className="sv-bin sv-bin--bear">
            <p className="sv-bin__head"><EventIcon name="alert" /> Never left out</p>
            <p>Trash and recycling go in the food locker or a bear-proof bin.</p>
          </div>
        </div>
      </section>

      <section className="ff-band" id="propane-and-fire" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <figure className="sv-photo sv-photo--tall">
            <ResponsiveImage image="img/propane-canister-recycling-yosemite.jpg" style={{ aspectRatio: "1600 / 2133" }} sizes="(max-width: 880px) calc(100vw - 40px), 420px"
              alt="A green collection bin for empty propane canisters on a concrete pad among the pines of a Yosemite Valley campground" />
            <figcaption>A propane canister recycling bin in a Valley campground. Photo: Mx. Granger / Wikimedia Commons (CC0)</figcaption>
          </figure>
          <div>
            <p className="hp-eyebrow">PROPANE AND FIRE</p>
            <h2>Refill the canister, buy the firewood here</h2>
            <div className="sv-prose">
              <p>
                The one-pound green propane cylinder is the campground's signature piece of waste. Around <strong>24,000 used cylinders</strong> are collected in the park's recycling areas every year, the Conservancy says, and an unknown number go in the trash. If you use one, put the empty in a canister recycling bin, never the trash.
              </p>
              <p>
                Better, skip the disposable. Refillable canisters from Little Kamper are sold at <strong>the Village Store, the Curry Village Gift Shop, the Mountain Shop, the Wawona Store and the El Portal Market</strong>, and an empty can be exchanged for a full one at a lower price. It is the single easiest swap in this whole guide for anyone cooking at a campsite.
              </p>
              <p>
                Firewood has a rule of its own. The park asks you not to bring firewood from more than <strong>50 miles away</strong>, because it carries forest pests, and you can buy it at the stores near most campgrounds. Outside the Valley, below 9,600 feet, you may gather dead and down wood under six inches across, but not pine cones, needles or sequoia wood. The <a href="/articles/yosemite-camping-complete-guide">camping guide</a> covers the rest of campground life, and the <a href="/articles/yosemite-fire-restrictions-explained">fire restrictions guide</a> covers when fires are allowed at all.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="if-you-drive" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">IF YOU DRIVE</p>
            <h2>Park once, fill the seats, plug in</h2>
            <div className="sv-prose">
              <p>
                A car is still the right tool for some trips: a family of four, where per-person bus fares add up against one vehicle pass; a dawn start before the first bus arrives; a trip that spreads from Glacier Point to Tuolumne. If you drive, drive less inside the park. Park once in the Valley and use the shuttle and the bike paths, fill every seat, and stay inside the park or close to it rather than commuting from a distant town each day.
              </p>
              <p>
                An electric car has more options than most drivers expect. The Park Service lists <strong>chargers in Yosemite Valley, Wawona, El Portal and Tuolumne Meadows</strong>, all with J1772 connectors and all level 2. Among the Valley's chargers are 20 at Curry Village, 10 at the Yosemite Falls parking area, 8 at Yosemite Valley Lodge and 6 at The Ahwahnee; the Wawona Store has 24 and the El Portal Market 2. A level 2 charger is slow, so plug in where you plan to spend the day. The Conservancy is working with the Park Service on more chargers in the Valley and Wawona.
              </p>
            </div>
          </div>
          <dl className="sv-chargers">
            <div><dt>Wawona Store</dt><dd>24</dd></div>
            <div><dt>Curry Village</dt><dd>20</dd></div>
            <div><dt>Yosemite Falls parking</dt><dd>10</dd></div>
            <div><dt>Yosemite Valley Lodge</dt><dd>8</dd></div>
            <div><dt>The Ahwahnee</dt><dd>6</dd></div>
            <div><dt>El Portal Market</dt><dd>2</dd></div>
            <p className="ff-note">Level 2 chargers by location, from the Park Service's EV charging pages. Tuolumne Meadows also has chargers; the park had not published the count.</p>
          </dl>
        </div>
      </section>

      <section className="ff-band" id="the-kit" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">THE KIT</p>
          <h2>Six things that keep a trip out of the bin</h2>
          <ul className="ff-rules sv-rules sv-rules--three">
            <li className="is-exception">
              <EventIcon name="drop" size={26} />
              <strong>A water bottle.</strong>
              <p>Fill it at a refill station. The stores sell drinks in glass and aluminum now; a bottle you own beats both.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="food" size={26} />
              <strong>Containers and a cutlery set.</strong>
              <p>Decant snacks at home and carry a fork, so the takeout counter costs nothing but food.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="check" size={26} />
              <strong>A bag for your own trash.</strong>
              <p>On the trail, everything you carry in, you carry out. At camp, it lives in the food locker.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="fuel" size={26} />
              <strong>A refillable propane canister.</strong>
              <p>Sold at the Village Store, Curry Village, the Mountain Shop, Wawona and El Portal, and an empty trades for a full one at a lower price.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="ticket" size={26} />
              <strong>Your entrance pass, on your phone.</strong>
              <p>Bought on Recreation.gov before you board, because the gate takes no cash.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="route" size={26} />
              <strong>A light pack.</strong>
              <p>The bus takes any size of backpack, and the park has no luggage storage. Pack for the shuttle, not the trunk.</p>
            </li>
          </ul>
          <p className="ff-note">The <a href="/kit">packing checklists</a> cover the rest of the gear for each season.</p>
        </div>
      </section>

      <section className="hp-wrap hp-section sv-close">
        <div className="sv-prose">
          <p>
            None of this is a sacrifice. The bus from Merced spares you the drive and the hunt for a parking space. On a busy afternoon a bike often beats the car across the Valley. The work behind the scenes, the bins and the compost and the zero-landfill effort that began in 2015 and that the Park Service, the concessioner and the Conservancy now run together, only works if visitors put things in the right place. That part is yours. For a first trip built around the shuttle line, start with the <a href="/articles/yosemite-in-one-or-two-days">one or two day plan</a> and leave the car at the station.
          </p>
        </div>
      </section>

      <section className="ff-band" id="sustainable-yosemite-questions" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Car-free and zero-waste Yosemite, answered</h2>
            <div className="sv-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/publictransportation.htm" target="_blank" rel="noopener noreferrer">Public transportation, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/fees.htm" target="_blank" rel="noopener noreferrer">Entrance fees, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/biking.htm" target="_blank" rel="noopener noreferrer">Biking, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/getinvolved/zlf.htm" target="_blank" rel="noopener noreferrer">Recycling and zero landfill, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/learn/nature/ccparkresponse.htm" target="_blank" rel="noopener noreferrer">The park's climate response, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/bears.htm" target="_blank" rel="noopener noreferrer">Bears and food storage, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/campregs.htm" target="_blank" rel="noopener noreferrer">Campground regulations, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/mg.htm" target="_blank" rel="noopener noreferrer">Mariposa Grove, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/ev-charging.htm" target="_blank" rel="noopener noreferrer">EV charging, NPS Yosemite</a></li>
                <li><a href="https://www.yarts.com/tickets-and-fares/" target="_blank" rel="noopener noreferrer">Tickets and fares, YARTS</a></li>
                <li><a href="https://www.yarts.com/plan-your-trip/how-to-ride/" target="_blank" rel="noopener noreferrer">How to ride, YARTS</a></li>
                <li><a href="https://www.yarts.com/bus_routes/highway-140/" target="_blank" rel="noopener noreferrer">Highway 140 route, YARTS</a></li>
                <li><a href="https://www.amtrak.com/san-joaquins/yosemite-national-park" target="_blank" rel="noopener noreferrer">Yosemite by train, Amtrak</a></li>
                <li><a href="https://yosemite.org/impact/sustainability/" target="_blank" rel="noopener noreferrer">Sustainability, Yosemite Conservancy</a></li>
                <li><a href="https://yosemite.org/yosemite-bike-share/" target="_blank" rel="noopener noreferrer">Yosemite Bike Share, Yosemite Conservancy</a></li>
                <li><a href="https://www.travelyosemite.com/things-to-do/biking/" target="_blank" rel="noopener noreferrer">Bike rentals, Yosemite Hospitality</a></li>
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
