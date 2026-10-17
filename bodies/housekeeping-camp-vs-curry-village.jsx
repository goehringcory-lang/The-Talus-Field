/* global React, EventIcon, ResponsiveImage */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Housekeeping Camp or Curry Village: the two canvas-roofed places to sleep
// on the east end of the Valley floor, compared. Laid out on the /firefall
// system from the start, like the airport and Mist Trail pieces: its catalog
// entry carries a `feature` block (data.js), so page-article.jsx draws the
// full-width cover and hands this body the page's width. The page's own
// pieces are the `.hk-*` layer in styles.css; the rest is the shared `.ff-*`
// kit and the `.npsmap` pattern.
//
// SOURCING. Every fact below was read against its primary page on October
// 17, 2026, and the Sources list at the foot names each one:
//   - travelyosemite.com's Housekeeping Camp and Curry Village pages and its
//     policies page: units, beds, power, bed packs, fire hours, lockers,
//     shower and laundry hours, the 2026 season, the November 29 to December
//     10, 2026 Curry closure, heat dates, quiet hours, Wi-Fi, pool, deposit,
//     the seven-day cancellation rule and Housekeeping's $15 fee, pets, and
//     the "only accommodations in Yosemite where outdoor cooking is
//     permitted" line.
//   - The Yosemite Guide, September 23 to November 24, 2026 (Vol. 51 Issue
//     8, the PDF on nps.gov/yose): every Curry Village kitchen hour, the
//     Housekeeping store's October 12 close, the laundry, shuttle stops 12,
//     14 and 19, the Mountaineering School and bike stand closing October 25,
//     the ice rink's November 13 opening, Meadow Grill closed for the season,
//     and the food-storage rules.
//   - nps.gov: the lodging page (366 days ahead, Yosemite Hospitality), the
//     reservations help page (cancellations appear in the morning), the
//     camping page (13 campgrounds, Recreation.gov), the Housekeeping Camp
//     and Curry Village place pages (three-sided concrete, two lockers, guest
//     showers; 1899 and the Currys), the bears page (the $5,000 fine), and
//     the October 2008 rockfall release (233 units, about a third).
//   - yarts.com's Highway 140 route page: the Curry Village stop.
//   - The 2016 to 2019 Half Dome Village name: the NPS lodging page confirms
//     the return to Curry Village; the years are from the press coverage of
//     the 2019 trademark settlement. Said as history, never a booking fact.
//   Nightly rates are not printed. The concessioner prices by the date and
//   posts no standing rate. Dated facts carry their year; nothing reads the
//   clock.
//
// The map is the National Park Service's own: the east-Valley crop the dining
// and camping guides use (img/nps-valley-dining-map.jpg, 840 x 500), with the
// pins at the same crop pixels those two articles place them.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["housekeeping-camp-vs-curry-village"] = function HousekeepingCampVsCurryVillageBody() {
  const TY = "https://www.travelyosemite.com/lodging/";

  const TOC = [
    ["#side-by-side", "Side by side"],
    ["#housekeeping-camp", "Housekeeping Camp"],
    ["#curry-village", "Curry Village"],
    ["#the-seasons", "The seasons"],
    ["#the-food", "The food"],
    ["#the-bears", "The bears"],
    ["#what-it-costs", "What it costs"],
    ["#who-should-book-which", "Who books which"],
    ["#housekeeping-vs-curry-questions", "Questions"],
  ];

  // [row, Housekeeping Camp, Curry Village]. Every cell restates a section
  // below.
  const COMPARE = [
    ["What you sleep in", "A three-sided concrete unit, canvas roof, privacy curtain", "A canvas tent cabin, a wood cabin with bath, or a Stoneman motel room"],
    ["Beds", "A set of twin bunks and a double bed; two cots make six. Bring bedding or rent a bed pack", "Real beds, with linens"],
    ["Power", "Electric lights and outlets", "Unheated tent: a light, no outlet. Heated tent: one outlet. Cabins and rooms: lights, outlets, heat"],
    ["Bathroom", "Shared shower house for guests, with soap and towels", "Shared for the tents; private in the cabins with bath and the Stoneman rooms"],
    ["Cooking", "Your own, over the unit's fire ring; wood fires 5 to 10 p.m.", "None at the unit. Kitchens and a grocery in the compound"],
    ["Bear locker", "Two at every unit", "One at every tent cabin"],
    ["Season", "Spring to fall: April 3 to October 12 in 2026", "Year-round; closed November 29 to December 10, 2026"],
    ["Pets", "Service animals only", "Service animals only"],
    ["Book at", "travelyosemite.com", "travelyosemite.com"],
  ];

  // The east-Valley crop (840 x 500), pins at the crop pixels the dining and
  // camping guides use.
  const PINS = [
    { n: "1", at: [451, 255], tone: "rust", name: "Housekeeping Camp, on the Merced" },
    { n: "2", at: [600, 372], tone: "rust", name: "Curry Village, below Glacier Point" },
    { n: "3", at: [385, 145], tone: "ink", name: "Yosemite Village and the Village Store" },
  ];

  // Curry Village's kitchens, with the hours the current Yosemite Guide
  // prints (the September 23 to November 24, 2026 edition).
  const KITCHENS = [
    ["Seven Tents Pavilion", "Breakfast 7 to 10 a.m., dinner 5:30 to 8:30 p.m.", "Homestyle meals, indoor seating."],
    ["Pizza Deck", "11 a.m. to 10 p.m.; noon to 9 p.m. from October 26", "Pizza, salad and garlic bread, outdoor seating."],
    ["Coffee Corner", "6 a.m. to 2 p.m.; 6:30 to 11 a.m. from October 26", "Peet's coffee and a light breakfast, early enough for a trail start."],
    ["Bar 1899", "11:30 a.m. to 10 p.m.; 4 to 9 p.m. from October 25", "Craft beer, cocktails and light entrées, inside and out."],
    ["Gift & Grocery", "8 a.m. to 8 p.m.", "Gifts and grocery essentials."],
  ];

  const FAQ = [
    ["What is the difference between Housekeeping Camp and Curry Village?", "Housekeeping Camp is 266 three-sided concrete units with canvas roofs on the Merced River, each with a set of twin bunks, a double bed, a covered patio, a fire ring and bear lockers; you bring bedding and cook your own meals. Curry Village is canvas tent cabins, wood cabins with bath and Stoneman motel rooms with made-up beds, shared bathrooms for the tents, and its own kitchens and grocery in the compound. Housekeeping Camp is open spring to fall only; Curry Village runs most of the year."],
    ["Is Housekeeping Camp open in winter?", "No. It runs spring to fall, and its 2026 season was April 3 to October 12. Its store closed with the camp on October 12, 2026. In winter, Curry Village's heated tent cabins are the nearest equivalent on the Valley floor."],
    ["Can you cook at Housekeeping Camp?", "Yes. Each unit has a fire ring with a grill grate, and wood fires are allowed from 5 to 10 p.m. The concessioner says its units are the only accommodations in Yosemite where outdoor cooking is permitted. Curry Village has no cooking at the units; you eat at its kitchens or buy food at its grocery."],
    ["Do you need to bring bedding to Housekeeping Camp?", "Yes, or rent a bed pack: $15 a night for a double (two blankets, two sheets, two pillows) and $9 for a single."],
    ["What food is there at Curry Village?", "The September 23 to November 24, 2026 Yosemite Guide lists four kitchens and a store: the Seven Tents Pavilion for breakfast and dinner, the Pizza Deck, the Coffee Corner, Bar 1899 and the Gift & Grocery. The Meadow Grill taqueria and Jennie's Ice Cream are summer counters, listed as closed for the season. Hours change through the year; the current Yosemite Guide prints them."],
    ["Was Curry Village called Half Dome Village?", "Yes, from 2016 to 2019, during the trademark dispute with the park's former concessioner that also renamed the Ahwahnee. It has been Curry Village again since 2019, though some older pages and photos still use the other name."],
    ["How do you book Housekeeping Camp or Curry Village?", "Both are run by the park concessioner, Yosemite Hospitality, and book through travelyosemite.com. Reservations open 366 days ahead. The first night is charged at booking and refunded if you cancel at least seven days before arrival; Housekeeping Camp keeps a $15 fee on those cancellations."],
  ];

  // ── The map: the two camps and the store between them ──────────────────────
  function CampsMap() {
    return (
      <figure className="npsmap hk-map">
        <div className="npsmap__frame">
          <img src="/img/nps-valley-dining-map.jpg" width="840" height="500" loading="lazy" decoding="async"
            alt="National Park Service map of the east end of Yosemite Valley, with Housekeeping Camp marked on the Merced River, Curry Village marked on the south side of the Valley below Glacier Point, and Yosemite Village to the northwest." />
          <svg viewBox="0 0 840 500" aria-hidden="true" focusable="false">
            {PINS.map((p) => (
              <g key={p.n}>
                <circle cx={p.at[0]} cy={p.at[1]} r="16" className={"npsmap__pin npsmap__pin--" + p.tone} />
                <text x={p.at[0]} y={p.at[1] + 5} textAnchor="middle" className="npsmap__num">{p.n}</text>
              </g>
            ))}
          </svg>
        </div>
        <figcaption>
          {PINS.map((p) => <span key={p.n}><b>{p.n}</b> {p.name}</span>)}
          <span>Map: National Park Service (public domain), cropped.</span>
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="hk-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="calendar" /><dt>Housekeeping Camp</dt><dd>Spring to fall only</dd></div>
          <div><EventIcon name="bed" /><dt>Curry Village</dt><dd>Open most of the year</dd></div>
          <div><EventIcon name="food" /><dt>Cook your own</dt><dd>Housekeeping Camp only</dd></div>
          <div><EventIcon name="ticket" /><dt>Both book</dt><dd>travelyosemite.com, 366 days out</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening, and the whole comparison in four lines beside it. */}
      <section className="hp-wrap hp-section hk-open">
        <div className="ff-split">
          <div className="hk-prose">
            <p className="dropcap">
              <strong>Housekeeping Camp</strong> and <strong>Curry Village</strong> sit a short way apart on the east end of the Valley floor. Both put canvas over most of their guests and a steel bear locker beside them, both are run by the same concessioner, and both book on the same website. They are not the same kind of night.
            </p>
            <p>
              Housekeeping Camp is a seasonal river camp where you bring your own bedding and cook dinner over your own fire. Curry Village is a village of tent cabins, cabins and motel rooms with made-up beds, a pizza deck, a dining hall and a grocery, open most of the year. Pick by how you want to eat, what month you are coming, and how much of camping you actually want to do.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="alert" /> The short version</p>
            <ul>
              <li>Cooking your own, with a fire and a river beach: Housekeeping Camp.</li>
              <li>A made-up bed and someone else's pizza: Curry Village.</li>
              <li>Mid-October to March: Curry Village. Housekeeping Camp is closed.</li>
              <li>At either one, everything with a scent goes in the bear locker.</li>
            </ul>
            <a className="hk-short__link" href="#side-by-side">The two side by side ↓</a>
          </aside>
        </div>
      </section>

      {/* The table and the map. */}
      <section className="ff-band" id="side-by-side" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">SIDE BY SIDE</p>
              <h2>Two canvas roofs, two different trips</h2>
              <div className="hk-prose">
                <p>
                  Both are on the Valley floor's east end, on the free shuttle loop. Housekeeping Camp is on the bank of the <strong>Merced River</strong>, west of Curry Village, at shuttle stop 12. Curry Village sits against the south wall, below Glacier Point, at stops 14 and 19, and the <a href="/articles/mist-trail-the-real-guide">Mist Trail</a> starts one stop on, at Happy Isles. The YARTS bus from Merced stops at Curry Village.
                </p>
                <p>
                  Neither is a campground. The Park Service's 13 campgrounds book through Recreation.gov and are a separate system; <a href="/articles/yosemite-camping-complete-guide">the camping guide</a> covers those. These two are concessioner lodging, which means a roof, a bed and a front desk, and a price that moves with the date.
                </p>
              </div>
            </div>
            <CampsMap />
          </div>

          <div className="hk-compare-wrap">
            <table className="hk-compare">
              <caption>Housekeeping Camp and Curry Village, row by row</caption>
              <thead>
                <tr><th scope="col"><span className="hp-sr-only">Feature</span></th><th scope="col">Housekeeping Camp</th><th scope="col">Curry Village</th></tr>
              </thead>
              <tbody>
                {COMPARE.map(([row, hk, cv]) => (
                  <tr key={row}><th scope="row">{row}</th><td>{hk}</td><td>{cv}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ff-note">From the concessioner's property pages and the Park Service, read October 17, 2026; season dates are 2026's. The full list of beds inside the park, the Ahwahnee to the High Sierra Camps: <a href="/articles/where-to-stay-in-yosemite">where to stay in Yosemite</a>.</p>
        </div>
      </section>

      {/* Housekeeping Camp. */}
      <section className="hp-wrap hp-section" id="housekeeping-camp" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">HOUSEKEEPING CAMP</p>
            <h2>Half camping, on the river</h2>
            <div className="hk-prose">
              <p>
                Housekeeping Camp is <strong>266 units</strong>, each a three-sided concrete structure with a canvas roof and a privacy curtain across the open side. Inside there is a set of twin bunks and a double bed, a table, chairs and a mirror, electric lights and outlets. The covered patio has a fire ring with a grill grate, and each unit has two bear lockers of different sizes. A unit sleeps up to six with two cots added.
              </p>
              <p>
                You bring your own bedding, or rent a <strong>bed pack</strong>: $15 a night for a double (two blankets, two sheets, two pillows), $9 for a single. You cook your own meals over the fire ring, and wood fires are allowed from 5 to 10 p.m. The concessioner calls these the only accommodations in Yosemite where outdoor cooking is permitted. The Merced's sandy beaches are at the edge of the camp for the hot afternoons, and the place feels like a family summer camp.
              </p>
              <p>
                It is austere. The walls are concrete, the curtain is a curtain, there is no door to lock, and the neighbors are close. The camp has a laundry room, a guests-only shower house with soap and towels, and a small store with groceries and camp supplies. It suits people who want to half-camp: camping's campfire and cooler, with a bed frame and no tent to pitch.
              </p>
            </div>
          </div>
          <div className="hk-unit">
            <p className="hp-eyebrow">ONE UNIT</p>
            <dl>
              <div><dt>Walls</dt><dd>Concrete on three sides, a curtain on the fourth</dd></div>
              <div><dt>Roof</dt><dd>Canvas, over the room and the patio</dd></div>
              <div><dt>Beds</dt><dd>Twin bunks and a double bed; up to six with two cots</dd></div>
              <div><dt>Power</dt><dd>Electric lights and outlets</dd></div>
              <div><dt>Outside</dt><dd>A fire ring with a grill grate and two bear lockers</dd></div>
              <div><dt>Bedding</dt><dd>Bring it, or rent a bed pack: $15 double, $9 single</dd></div>
              <div><dt>Showers</dt><dd>7 a.m. to 10 p.m., guests only</dd></div>
              <div><dt>Laundry</dt><dd>8 a.m. to 10 p.m.</dd></div>
            </dl>
            <p className="ff-note">Shower hours are the concessioner's; laundry hours are the September 23 to November 24, 2026 Yosemite Guide's, which still lists the laundry after the camp's store closed on October 12, 2026.</p>
          </div>
        </div>
      </section>

      {/* Curry Village. */}
      <section className="ff-band" id="curry-village" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <figure className="hk-photo">
              <ResponsiveImage image="img/curry-village.jpg" style={{ aspectRatio: "1600 / 1072" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
                alt="Wooden cabins at Curry Village among pines and granite boulders" />
              <figcaption>Cabins at Curry Village. Photo: US National Park Service / Wikimedia Commons (public domain)</figcaption>
            </figure>
            <div>
              <p className="hp-eyebrow">CURRY VILLAGE</p>
              <h2>A village of canvas under Glacier Point</h2>
              <div className="hk-prose">
                <p>
                  Curry Village has taken guests at the base of Glacier Point since 1899, when David and Jennie Curry, two former schoolteachers, founded it. Today it is mostly <strong>canvas tent cabins</strong> (canvas walls and roof, real beds, no plumbing), with <strong>wood cabins</strong> that have their own bath and electric heat, and the <strong>Stoneman</strong> rooms, motel rooms with private bathrooms and one to three double beds.
                </p>
                <p>
                  The heat question decides the tent. An <strong>unheated tent</strong> has electric light and no outlet, and it is cold in spring and fall. A <strong>heated tent</strong> has one outlet, and the concessioner runs the heat from the Tuesday after Labor Day to the Friday before Memorial Day. The shower house is open around the clock, Wi-Fi is in the guest lounge rather than the tents, and quiet hours run 10 p.m. to 6 a.m., because canvas carries every sound in both directions.
                </p>
                <p>
                  Around the tents is the rest of the village: the kitchens, a pool from Memorial Day to Labor Day, a bike stand from spring to fall, the Mountain Shop, and the Yosemite Mountaineering School's guided hikes and climbing classes (the bike stand and the school both closed for 2026 on October 25). In winter there is an outdoor ice rink, which the current Yosemite Guide lists as opening November 13, 2026, if conditions allow.
                </p>
              </div>
            </div>
          </div>
          <table className="hk-rooms">
            <caption>The four kinds of room at Curry Village</caption>
            <thead>
              <tr><th scope="col">Room</th><th scope="col">Bath</th><th scope="col">Power and heat</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Unheated tent</th><td>Shared</td><td>A light, no outlet, no heat</td></tr>
              <tr><th scope="row">Heated tent</th><td>Shared</td><td>One outlet; heat from September to May</td></tr>
              <tr><th scope="row">Cabin with bath</th><td>Private</td><td>Lights, outlets, electric heater</td></tr>
              <tr><th scope="row">Stoneman room</th><td>Private</td><td>Lights, outlets, heat; one to three double beds</td></tr>
            </tbody>
          </table>
          <p className="ff-alert"><EventIcon name="alert" /><span><strong>The name.</strong> From 2016 to 2019 the place was called <strong>Half Dome Village</strong>, during the trademark dispute with the park's former concessioner that also renamed the Ahwahnee. It has been Curry Village again since 2019, but some older pages and photo captions still carry the other name. They are the same place. And the village stops where it does for a reason: after rockfalls off Glacier Point on October 7 and 8, 2008, the Park Service permanently closed 233 units under the cliff, about a third of what the village offered visitors. <a href="/articles/yosemite-rockfall">The rockfall article</a> tells that story.</span></p>
        </div>
      </section>

      {/* The seasons: the first thing that decides it. */}
      <section className="hp-wrap hp-section" id="the-seasons" tabIndex={-1}>
        <p className="hp-eyebrow">THE SEASONS</p>
        <h2>The calendar decides before you do</h2>
        <div className="ff-split">
          <div className="hk-prose">
            <p>
              For half the year there is no choice to make. Housekeeping Camp runs <strong>spring to fall</strong>: its 2026 season was April 3 to October 12. Curry Village runs <strong>most of the year</strong>, with one gap: in 2026 the concessioner lists it as not open from November 29 through December 10.
            </p>
            <p>
              This piece prints only the 2026 dates. Check the concessioner's <a href={TY + "housekeeping-camp/"} target="_blank" rel="noopener noreferrer">Housekeeping Camp page</a> for the 2027 season before you plan an April trip around it: the opening date is the concessioner's to set, and the Park Service describes the season only as approximately mid-April to early October, conditions permitting.
            </p>
          </div>
          <ol className="hk-seasons">
            <li className="is-hk"><span>Housekeeping Camp</span><strong>April 3 to October 12, 2026</strong><p>Spring to fall. The store closes with the camp.</p></li>
            <li className="is-cv"><span>Curry Village</span><strong>Most of the year</strong><p>Not open November 29 to December 10, 2026.</p></li>
            <li className="is-heat"><span>Curry's heated tents</span><strong>Heat from September to May</strong><p>The Tuesday after Labor Day to the Friday before Memorial Day.</p></li>
          </ol>
        </div>
        <p className="ff-note">Coming in the cold months? <a href="/articles/yosemite-in-winter">Yosemite in winter</a> has the roads, the chains and what stays open.</p>
      </section>

      {/* The food: the second thing that decides it. */}
      <section className="ff-band" id="the-food" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE FOOD</p>
              <h2>Your own fire, or the pizza deck</h2>
              <div className="hk-prose">
                <p>
                  At <strong>Housekeeping Camp</strong> you are the kitchen. Bring a cooler, a pan and the food for the trip, and cook over the fire ring between 5 and 10 p.m. The camp store sells groceries while the camp is open, and the <strong>Village Store</strong> in Yosemite Village carries the park's largest selection of groceries. The kitchens at Curry Village are an easy walk or a shuttle ride when nobody wants to cook.
                </p>
                <p>
                  <strong>Curry Village</strong> is the other way round. There is no cooking at the tents, and the compound's kitchens feed you instead: four on the current Guide's list, and a grocery. The Pizza Deck is the obvious stop after a hike, and the Coffee Corner opens early enough for a trail start, which saves the drive to Yosemite Village for coffee. Hours shrink after the summer, so read them against the date you arrive; the current Guide's are beside this paragraph. The Meadow Grill taqueria and Jennie's Ice Cream are summer counters, and the current edition lists both as closed for the season.
                </p>
              </div>
            </div>
            <div>
              <h3 className="hk-kitchens__head">Curry Village, by the current Yosemite Guide</h3>
              <ol className="ff-hours hk-kitchens">
                {KITCHENS.map(([name, hours, note]) => (
                  <li key={name}><span>{name}</span><p><strong>{hours}</strong> {note}</p></li>
                ))}
              </ol>
              <p className="ff-note">The September 23 to November 24, 2026 edition. The Park Bulletin carries every hour in the park as it reads today: <a href="/now">the Park Bulletin</a>.</p>
            </div>
          </div>
          <p className="ff-note">Every kitchen in the park, from the Ahwahnee's dining room to the Tuolumne grill, and where to buy groceries: <a href="/articles/where-to-eat-yosemite">where to eat in Yosemite</a>.</p>
        </div>
      </section>

      {/* The bears: the rule both share. */}
      <section className="hp-wrap hp-section" id="the-bears" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE BEARS</p>
            <h2>The locker is not optional at either</h2>
            <div className="hk-prose">
              <p>
                Canvas is not a barrier a bear respects, and concrete with a curtain is not much better. The Park Service requires every Housekeeping Camp guest and every Curry Village tent-cabin guest to keep all food in the lockers provided, and never to keep food, drinks, toiletries or trash in a tent or tent cabin. To a bear, food includes trash, recycling, toiletries, soap, unwashed dishes and anything else with a scent, and coolers count even when empty. Guests in Curry's hard-sided cabins and Stoneman rooms may keep food inside the room.
              </p>
              <p>
                The car is not the answer. After dark, nothing with a scent stays in a vehicle, trunk included, and by day food, drinks and coolers stay hidden from sight with the windows closed. A violation can bring a fine of up to $5,000. Housekeeping Camp asks more of you here, because you arrive with a cooler and a week of groceries; plan where it all goes before you unload. <a href="/articles/yosemite-bears-safety-guide">The bear guide</a> lists what counts as food and why the rule exists.
              </p>
            </div>
          </div>
          <ul className="ff-rules hk-rules">
            <li><EventIcon name="no" size={26} /><strong>In the locker</strong><p>All food and drinks, coolers even when empty, trash, recycling, toiletries, soap, unwashed dishes.</p></li>
            <li><EventIcon name="car" size={26} /><strong>Not in the car</strong><p>Nothing with a scent after dark, and nothing in view by day.</p></li>
            <li className="is-exception"><EventIcon name="clock" size={26} /><strong>Every time</strong><p>Close and latch it whenever you leave the unit, even for a few minutes.</p></li>
            <li className="is-exception"><EventIcon name="ticket" size={26} /><strong>Up to $5,000</strong><p>The fine for a storage violation, with food or a car liable to be impounded.</p></li>
          </ul>
        </div>
      </section>

      {/* What it costs: described, never quoted. */}
      <section className="ff-band" id="what-it-costs" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">WHAT IT COSTS</p>
            <h2>Priced by the night you search</h2>
            <div className="hk-prose">
              <p>
                This piece does not print nightly rates, because the concessioner posts no standing price for either place: the booking page shows the price for the night and room type you search. What it does post: occupancy over two adults costs extra at Curry Village ($17.50 per added person 13 and older in a tent, $14 in a cabin, $9.75 in a Stoneman room, plus tax), Housekeeping Camp's bed packs are $15 and $9 a night, and lodging tax and assessments add about 13.7 percent to the room (a 12 percent occupancy tax, a 1.5 percent tourism district assessment and a 0.2 percent state tourism fee).
              </p>
              <p>
                Count the whole trip, not the night. A Housekeeping Camp family that cooks its own meals spends very little on food once the cooler is packed. A Curry Village family eats at the kitchens, which is the convenience it is paying for. <a href="/articles/yosemite-trip-cost-budget">The trip-cost breakdown</a> runs the full numbers for a week.
              </p>
            </div>
          </div>
          <ol className="ff-timeline hk-steps">
            <li className="is-open"><span>366 days out</span><strong>The date opens</strong><p>On travelyosemite.com, or by phone at 888/413-8869.</p></li>
            <li className="is-open"><span>At booking</span><strong>The first night is charged</strong><p>A deposit of the first night, when you pay by card.</p></li>
            <li className="is-open"><span>Seven days out</span><strong>The last refundable cancellation</strong><p>Cancel at least seven days before arrival and the deposit comes back, less a $15 fee at Housekeeping Camp.</p></li>
            <li className="is-open"><span>Any morning</span><strong>Check again</strong><p>The Park Service says lodging cancellations are common and appear in the morning.</p></li>
          </ol>
        </div>
      </section>

      {/* Who should book which. */}
      <section className="hp-wrap hp-section" id="who-should-book-which" tabIndex={-1}>
        <p className="hp-eyebrow">WHO SHOULD BOOK WHICH</p>
        <h2>Pick by how you want to eat</h2>
        <div className="hk-choose">
          <div className="hk-choose__col hk-choose__col--hk">
            <p className="hk-choose__head"><EventIcon name="food" size={24} /> Book Housekeeping Camp if</p>
            <ul>
              <li>You are a family or a group of up to six who would rather cook than queue.</li>
              <li>You want a campfire and a river beach, and no tent to pitch.</li>
              <li>You could not get a campground reservation and want the next thing to it.</li>
              <li>Your trip falls between early April and mid-October, by 2026's dates.</li>
            </ul>
          </div>
          <div className="hk-choose__col">
            <p className="hk-choose__head"><EventIcon name="bed" size={24} /> Book Curry Village if</p>
            <ul>
              <li>You want a made-up bed and someone else to make dinner.</li>
              <li>You are hiking, and the room is a place to sleep between trails.</li>
              <li>You are coming in late fall or winter: book a heated tent, or a cabin.</li>
              <li>You want a private bathroom: a cabin with bath or a Stoneman room.</li>
            </ul>
          </div>
        </div>
        <div className="hk-prose hk-who">
          <p>
            Two warnings, one for each. Curry Village is not a quiet hotel at a discount: the canvas is thin and the village is busy, and it works best for families and hikers who treat the tent as a place to sleep. Housekeeping Camp is not a cabin: it is concrete, canvas and a curtain, and it rewards the visitor who arrives packed like a camper. If you are first-time campers, <a href="/articles/camping-in-yosemite-first-time">the first-time camping guide</a> is a good test of whether you want the fire ring. Neither place takes pets beyond service animals; <a href="/articles/pets-in-yosemite">the pets guide</a> has what does.
          </p>
          <p>
            If both are full, rooms come back. The Park Service's advice is to check the concessioner's site every morning. If nothing turns up, <a href="/stay">the lodging page</a> has the gateway towns and their drive times.
          </p>
        </div>
      </section>

      <section className="ff-band" id="housekeeping-vs-curry-questions" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Housekeeping Camp and Curry Village, answered</h2>
            <p className="ff-lede">Getting around once you are parked: <a href="/articles/yosemite-valley-parking-guide">the Valley parking guide</a> and <a href="/articles/yosemite-shuttle-and-yarts">the shuttle and YARTS guide</a>.</p>
            <div className="hk-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href={TY + "housekeeping-camp/"} target="_blank" rel="noopener noreferrer">Housekeeping Camp, Travel Yosemite (Yosemite Hospitality)</a></li>
                <li><a href={TY + "curry-village/"} target="_blank" rel="noopener noreferrer">Curry Village, Travel Yosemite (Yosemite Hospitality)</a></li>
                <li><a href="https://www.travelyosemite.com/plan/policies-information" target="_blank" rel="noopener noreferrer">Policies and information, Travel Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/upload/Yosemite-Guide-51-8-508V1.pdf" target="_blank" rel="noopener noreferrer">Yosemite Guide, September 23 to November 24, 2026, NPS</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/lodging.htm" target="_blank" rel="noopener noreferrer">Lodging, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/reservehelp.htm" target="_blank" rel="noopener noreferrer">Reservations help, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/places/000/housekeeping-camp.htm" target="_blank" rel="noopener noreferrer">Housekeeping Camp, NPS</a></li>
                <li><a href="https://www.nps.gov/places/000/curry-village.htm" target="_blank" rel="noopener noreferrer">Curry Village, NPS</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/camping.htm" target="_blank" rel="noopener noreferrer">Camping, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/bears.htm" target="_blank" rel="noopener noreferrer">Bears and food storage, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/learn/news/cvrockfall.htm" target="_blank" rel="noopener noreferrer">Curry Village rockfall closures, NPS (2008)</a></li>
                <li><a href="https://www.yarts.com/bus_routes/highway-140/" target="_blank" rel="noopener noreferrer">Highway 140 route, YARTS</a></li>
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
