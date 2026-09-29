/* global React, NatureNotesFilm, EventIcon, ResponsiveImage */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// The September 2026 feature redesign, on the El Capitan article's recipe.
// This body renders on the /firefall system rather than in the 680px reading
// column: its catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's width. Every section sits on `hp-wrap`, alternating paper and the
// `ff-band` tint. The page's own pieces are the `.eat-*` layer in styles.css.
//
// Four rules hold it up.
//   1. Every fact the article carried before the redesign is still here,
//      regrouped, and the copy follows docs/voice-guide.md: the answer first,
//      plain words, no new facts. Every card, chip, label and caption restates
//      a sentence in this body. One contradiction was settled rather than
//      carried: the old table said South Gate Brewing closes Tuesdays while
//      its paragraph said "open daily"; the paragraph was right.
//   2. The section ids are the anchors the old layout generated at runtime
//      (`sec-<h2 index>-<slug40>`), pinned by hand so the deep links search
//      already carries keep landing on the same content.
//   3. Both maps are the National Park Service's own. The park map is /stay's
//      crop (img/nps-yosemite-stay-map.jpg, 1760 x 1410, cut from
//      img/nps-yosemite-park-map.jpg at +0+560); the pins are that page's
//      town positions plus Crane Flat, Yosemite West, Wawona and Tuolumne
//      Meadows from the park map's linear fit (NPS_MAP_BOUNDS in
//      page-map.jsx). The Valley map is img/nps-valley-dining-map.jpg
//      (840 x 500, cut from img/nps-yosemite-valley-map.jpg at +1300+100),
//      pinned from points.geojson through the /itineraries affine fit and
//      nudged onto the NPS map's own building marks. Pins and labels are HTML
//      in percent of the crop, so the labels keep their size on a phone.
//   4. Nothing on the page reads today's hours. It says where food is and
//      what closes, and sends the reader to the Park Bulletin for the rest.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["where-to-eat-yosemite"] = function WhereToEatYosemiteBody() {
  const TOC = [
    ["#sec-0-is-there-food-in-yosemite-national-park", "Food in the park"],
    ["#sec-1-where-to-eat-in-yosemite-valley", "The Valley"],
    ["#sec-2-wawona-fish-camp-and-the-south-end-of-th", "Wawona and Fish Camp"],
    ["#sec-3-tuolumne-meadows-and-the-high-country", "Tuolumne"],
    ["#sec-4-yosemite-west-restaurants-there-are-none", "Yosemite West"],
    ["#sec-5-restaurants-near-yosemite-the-gateway-to", "Gateway towns"],
    ["#sec-6-everything-that-exists-by-area", "Every kitchen"],
    ["#sec-7-the-short-version-by-area", "The table"],
    ["#sec-8-can-you-bring-your-own-food-into-yosemit", "Your own food"],
    ["#sec-9-what-closes-and-when", "What closes"],
    ["#where-to-eat-questions", "Questions"],
  ];

  const FAQ = [
    ["Where can I get a quick meal in Yosemite Valley?", "Curry Village Pizza Deck, Base Camp Eatery at Yosemite Valley Lodge, and Degnan's Kitchen in Yosemite Village are convenient options. Check current hours before relying on an early breakfast or late dinner."],
    ["Where can I book a sit-down dinner in Yosemite Valley?", "The Mountain Room at Yosemite Valley Lodge and The Ahwahnee Dining Room are options. Book ahead and check the concessioner's current menus, prices, and reservation details."],
    ["Are there restaurants in Yosemite West?", "No. Yosemite West has no restaurant, store, gas station, or shuttle. Shop before arriving. Yosemite Valley is roughly forty minutes each way, or Wawona is about half an hour south."],
    ["Is there food at Tuolumne Meadows in fall?", "Service is seasonal. The concessioner's 2026 schedule lists September 13 as the lodge dining room's last day and September 20 for the grill. Pack lunch for a Tioga Road day; an open road does not mean an open kitchen."],
    ["Is the Wawona Hotel dining room open?", "The Wawona Hotel and its dining room are closed for a condition assessment. Check the NPS hotel notice for reopening updates. The Wawona General Store is a grocery and picnic-supply option."],
    ["Where should I eat near Yosemite?", "Choose restaurants near your route or lodging. The guide recommends 1850, Smokin Oak BBQ, and Tacos Sonora in Mariposa; South Gate Brewing Company and The Elderberry House in Oakhurst; and Latte Da Cafe in Lee Vining. Check current hours before making a special trip."],
  ];

  // ── The park, by how much food each place has ─────────────────────────────
  // Positions in the stay crop's pixels (1760 x 1410). `tone` is the key:
  // full (the Valley), seasonal (Tuolumne), store (a market and little else),
  // none (Yosemite West), town (a gateway with restaurants). `side` is where
  // the label sits. Three towns are off the map's edge; `off` says so.
  const PARK_W = 1760, PARK_H = 1410;
  const PARK_SPOTS = [
    { at: [686, 659], side: "r", tone: "full", name: "Yosemite Valley", note: "Counters, decks and dining rooms" },
    { at: [1169, 321], side: "b", tone: "seasonal", name: "Tuolumne Meadows", note: "Store, grill, lodge. Closes in September" },
    { at: [231, 646], side: "r", tone: "store", name: "Crane Flat", note: "Small market" },
    { at: [263, 856], side: "t", tone: "town", name: "El Portal", note: "A market and four restaurants" },
    { at: [426, 921], side: "r", tone: "none", name: "Yosemite West", note: "No restaurant, no store, no gas" },
    { at: [536, 1229], side: "t", tone: "store", name: "Wawona", note: "General store. Hotel dining closed" },
    { at: [563, 1335], side: "r", tone: "town", name: "Fish Camp", note: "Embers, Jackalopes, two markets" },
    { at: [1648, 95], side: "l", tone: "town", name: "Lee Vining", note: "Latte Da Cafe" },
    { at: [16, 905], side: "d", tone: "town", name: "Mariposa", note: "Highway 140, off the map" },
    { at: [16, 470], side: "r", tone: "town", name: "Groveland", note: "Highway 120, off the map" },
    { at: [575, 1392], side: "ul", tone: "town", name: "Oakhurst", note: "Highway 41, off the map" },
  ];
  const TONES = [
    ["full", "Most choice"],
    ["seasonal", "Summer only"],
    ["store", "A store, not a kitchen"],
    ["none", "Nothing at all"],
    ["town", "Gateway town with restaurants"],
  ];
  const pct = (x, y, w, h) => ({ left: (x / w) * 100 + "%", top: (y / h) * 100 + "%" });

  function ParkFoodMap() {
    return (
      <figure className="eat-map eat-map--park">
        <div className="eat-map__frame">
          <ResponsiveImage image="img/nps-yosemite-stay-map.jpg" className="eat-map__img" sizes="(max-width: 880px) 100vw, 620px" style={{ aspectRatio: "1760 / 1410" }}
            alt="National Park Service map of Yosemite, cropped from Hetch Hetchy south to the Mariposa Grove, marking where food is: Yosemite Valley has the most, Tuolumne Meadows is open in summer only, Crane Flat and Wawona have stores, Yosemite West has nothing, and El Portal, Fish Camp, Lee Vining, Mariposa, Groveland and Oakhurst are gateway towns with restaurants." />
          <div className="eat-map__layer" aria-hidden="true">
            {PARK_SPOTS.map((s) => (
              <span key={s.name} className={"eat-spot eat-spot--" + s.side + " is-" + s.tone} style={pct(s.at[0], s.at[1], PARK_W, PARK_H)}>
                <i /><b>{s.name}</b><small>{s.note}</small>
              </span>
            ))}
          </div>
        </div>
        <figcaption>
          <ul className="eat-key">
            {TONES.map(([t, label]) => <li key={t} className={"is-" + t}>{label}</li>)}
          </ul>
          <span>Map: National Park Service (public domain), cropped.</span>
        </figcaption>
      </figure>
    );
  }

  // ── The Valley's four food clusters ────────────────────────────────────────
  // Crop pixels (840 x 500). Numbered in the order the cards below run.
  const VALLEY_W = 840, VALLEY_H = 500;
  const VALLEY_PINS = [
    { n: "1", at: [600, 372], name: "Curry Village" },
    { n: "2", at: [176, 272], name: "Yosemite Valley Lodge" },
    { n: "3", at: [385, 145], name: "Yosemite Village" },
    { n: "4", at: [563, 175], name: "The Ahwahnee" },
  ];
  function ValleyFoodMap() {
    return (
      <figure className="eat-map eat-map--valley">
        <div className="eat-map__frame">
          <img src="/img/nps-valley-dining-map.jpg" width="840" height="500" loading="lazy" decoding="async" className="eat-map__img"
            alt="National Park Service map of the east end of Yosemite Valley with the four places to eat marked: Curry Village on the south side, Yosemite Valley Lodge to the west below Yosemite Falls, Yosemite Village beside the visitor center, and The Ahwahnee to the east." />
          <div className="eat-map__layer" aria-hidden="true">
            {VALLEY_PINS.map((p) => (
              <span key={p.n} className="eat-pin" style={pct(p.at[0], p.at[1], VALLEY_W, VALLEY_H)}><b>{p.n}</b></span>
            ))}
          </div>
        </div>
        <figcaption>
          {VALLEY_PINS.map((p) => <span key={p.n} className="eat-map__num"><b>{p.n}</b> {p.name}</span>)}
          <span>Map: National Park Service (public domain), cropped.</span>
        </figcaption>
      </figure>
    );
  }

  // A dollar ladder: the table's price, drawn as four marks.
  function Price({ n }) {
    return (
      <span className="eat-price" role="img" aria-label={"Price " + "$".repeat(n) + " of $$$$"}>
        {[1, 2, 3, 4].map((i) => <span key={i} className={i <= n ? "is-on" : undefined} aria-hidden="true">$</span>)}
      </span>
    );
  }

  // ── One Valley cluster: a photograph (when the repo has one of the place),
  // then each kitchen as a row with its chips. ─────────────────────────────
  function Cluster({ n, name, photo, ratio, alt, credit, focus, children }) {
    return (
      <article className="eat-cluster">
        {photo ? (
          <figure className="eat-cluster__photo">
            <ResponsiveImage image={photo} alt={alt} sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 46vw, 560px" style={{ aspectRatio: ratio, objectPosition: focus || undefined }} />
            <figcaption>{credit}</figcaption>
          </figure>
        ) : null}
        <div className="eat-cluster__body">
          <p className="eat-cluster__head"><span className="eat-cluster__num">{n}</span>{name}</p>
          <ul className="eat-kitchens">{children}</ul>
        </div>
      </article>
    );
  }
  function Kitchen({ name, meal, price, res, pick, children }) {
    return (
      <li className={"eat-kitchen" + (pick ? " is-pick" : "")}>
        <div className="eat-kitchen__top">
          <h3>{name}</h3>
          {pick && <span className="eat-badge">{pick}</span>}
        </div>
        <p>{children}</p>
        {(meal || price || res) && (
          <p className="eat-kitchen__chips">
            {meal && <span className="eat-chip">{meal}</span>}
            {price ? <Price n={price} /> : null}
            {res && <span className={"eat-chip eat-chip--res is-" + res.toLowerCase().split(" ")[0]}>{res === "No" ? "No reservations" : "Reservations: " + res.toLowerCase()}</span>}
          </p>
        )}
      </li>
    );
  }

  // ── The short version, as data ─────────────────────────────────────────────
  // [where, area, group, meal, price, season, reservations]. `group` drives
  // the filter chips only.
  const TABLE = [
    ["Curry Village Pizza Deck", "Yosemite Valley", "valley", "Lunch, dinner", 2, "Most of the year", "No"],
    ["Base Camp Eatery", "Yosemite Valley", "valley", "All three", 2, "Year-round", "No"],
    ["Degnan's Kitchen", "Yosemite Valley", "valley", "Breakfast, lunch", 1, "Year-round", "No"],
    ["Meadow Grill Taqueria", "Yosemite Valley", "valley", "Lunch, dinner", 1, "Summer", "No"],
    ["The Mountain Room", "Yosemite Valley", "valley", "Dinner", 3, "Most of the year", "Advised"],
    ["The Ahwahnee Dining Room", "Yosemite Valley", "valley", "Check current menu", 4, "Year-round", "Required"],
    ["Wawona General Store", "Wawona", "south", "Groceries, sandwiches", 1, "Year-round", "No"],
    ["Embers at Tenaya Lodge", "Fish Camp", "south", "Dinner", 3, "Year-round", "Advised"],
    ["Tuolumne store and grill", "Tioga Road", "tioga", "Counter", 1, "Summer, closes September", "No"],
    ["Tuolumne Meadows Lodge", "Tioga Road", "tioga", "Breakfast, dinner", 2, "Summer, closes September", "Required for dinner"],
    ["1850 Restaurant & Brewing", "Mariposa", "towns", "Dinner", 2, "Year-round, closed Mon and Tue", "No"],
    ["Smokin Oak BBQ", "Mariposa", "towns", "Lunch, dinner", 2, "Year-round, closed Mon and Tue", "No"],
    ["Tacos Sonora", "Mariposa", "towns", "Lunch", 1, "Year-round, closed Sun", "No"],
    ["Cedar House Restaurant", "El Portal", "towns", "Dinner", 2, "Year-round", "No"],
    ["June Bug Cafe", "Midpines", "towns", "Breakfast, dinner", 2, "Year-round", "No"],
    ["South Gate Brewing Co.", "Oakhurst", "towns", "Dinner", 2, "Year-round, open daily", "No"],
    ["The Elderberry House", "Oakhurst", "towns", "Check current menu", 4, "Year-round", "Required"],
    ["Latte Da Cafe", "Lee Vining", "towns", "Breakfast, coffee", 1, "Seasonal", "No"],
  ];
  const TABLE_FILTERS = [["all", "Everywhere"], ["valley", "The Valley"], ["south", "Wawona and Fish Camp"], ["tioga", "Tioga Road"], ["towns", "Gateway towns"]];
  const [area, setArea] = React.useState("all");
  const rows = TABLE.filter((r) => area === "all" || r[2] === area);

  // ── The roster: the Mariposa County sheet, by area ─────────────────────────
  const ROSTER = [
    { area: "Mariposa", items: ["1850", "Alley", "California Commissary", "Castillo's", "Charles Street", "Cinnamon Roll Bakery", "Don Rubens Mexican", "Falaf-a-lot at Grove House", "Fredrick's of Savourys", "Gold Cup Creamery", "Grove House", "Happy Burger", "Hideout", "High Country Cafe", "Jantz Bakery", "Little Shop of Ramen", "Local Grape", "Miners Roadhouse 140", "Nayos Mexican Food", "Pizza Factory", "Pony Expresso", "the Senior Center", "Smokin' Oak BBQ", "Starbucks", "Sticks Coffee House", "Subway", "Twisted Cedar"],
      extra: ["Pioneer Market Deli", "Short Stop Sandwich", "Stage Stop Deli", "Take and Bake"], extraLabel: "Mainly takeout" },
    { area: "Yosemite Valley", items: ["Seven Tents Pavilion", "Bar 1899", "Coffee Corner", "the pizza counter", "the Taqueria at Meadow Grill", "Degnan's Kitchen", "the Village Grill", "Base Camp Eatery", "Starbucks", "the Mountain Room and its lounge", "the Ahwahnee dining room and bar"],
      note: "Five at Curry Village, two in Yosemite Village, three at the Lodge, and The Ahwahnee. More than it feels like when you're standing in line at one of them." },
    { area: "El Portal", items: ["Canyon Bar", "Cedar House Restaurant", "River Restaurant", "Parkside Pizza"] },
    { area: "Highway 140", items: ["the Chevron (Catheys Valley)", "June Bug Cafe at the Yosemite Bug (Midpines)", "Bootjack Market", "Sierra Cider", "Steve's Sportsman's Cafe"],
      note: "Catheys Valley has the Chevron, and that's the whole list, which is worth knowing at 10 p.m. The June Bug is the one stop on this stretch people drive to on purpose. The last three are up Triangle Road in Bootjack." },
    { area: "Highway 132, Coulterville", items: ["Copperpot Cafe", "Coulter Cafe", "Main Street Deli", "Cerritos Goods (takeout)"],
      note: "Coulterville and Greeley Hill, on the road toward the Big Oak Flat entrance from the north. Four places across two villages is the whole supply on it." },
    { area: "Tuolumne and the south", items: ["Tuolumne Lodge", "Wawona General Store", "Embers", "Jackalopes", "Pine Tree Market", "Fish Camp General Store"],
      note: "Tuolumne Lodge is on Tioga Road and the Wawona store at the south end. The last four are over the Madera County line in Fish Camp; Embers and Jackalopes are at Tenaya Lodge." },
  ];
  const TRUCKS = ["All About the Wurst", "Birrieria El Campeon", "Dixon's Fixin's", "Fishworks", "L & J Mexican Food", "the Lemon Drop Trailer", "Mariposa Sips & Sweets", "Sal's Taco Truck", "the Tacos Sonora truck", "Yosemite Pizza"];

  // ── A week, with the closed days struck ────────────────────────────────────
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  function Week({ closed, label, notes }) {
    return (
      <div className="eat-week">
        <ol aria-label={label}>
          {DAYS.map((d) => (
            <li key={d} className={closed.indexOf(d) >= 0 ? "is-closed" : undefined}>
              <span>{d}</span>
              {notes && notes[d] ? <small>{notes[d]}</small> : null}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // ── The gateway picks, town by town ─────────────────────────────────────────
  function TownPick({ name, week, weekLabel, weekNotes, meta, children }) {
    return (
      <article className="eat-pick">
        <h4>{name}</h4>
        {meta && <p className="eat-pick__meta">{meta}</p>}
        <p className="eat-pick__text">{children}</p>
        {week && <Week closed={week} label={weekLabel} notes={weekNotes} />}
      </article>
    );
  }

  return (
    <div className="eat-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="food" /><dt>Most choice</dt><dd>Yosemite Valley, by a long way</dd></div>
          <div><EventIcon name="car" /><dt>Anywhere else</dt><dd>Plan on a drive or a cooler</dd></div>
          <div><EventIcon name="clock" /><dt>After 9 p.m.</dt><dd>Assume every kitchen is shut</dd></div>
          <div><EventIcon name="calendar" /><dt>Before you go</dt><dd>Check hours in the Park Bulletin</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the answer, and the whole page in five lines beside it. */}
      <section className="hp-wrap hp-section eat-open">
        <div className="ff-split">
          <div className="eat-prose">
            <p className="dropcap">
              For a quick meal in Yosemite Valley, go to the Curry Village Pizza Deck, Base Camp Eatery or Degnan's Kitchen. For a sit-down dinner, book the Mountain Room or The Ahwahnee. Outside the Valley, eat near your route or pack a cooler, because seasonal kitchens close while the roads are still open.
            </p>

            <p>
              I live in El Portal and eat at the places on this page. These are my own picks. No restaurant paid to be here, and none of the restaurant links earn anything. Hours move with the season, so check <a href="/now">current dining hours in the Park Bulletin</a> before you make a special trip.
            </p>

            <p>Below: what each part of the park has, the Valley's kitchens one by one, the gateway towns, the full county list, a table, and what closes when.</p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="food" /> The short version</p>
            <ul>
              <li>After a hike: pizza on the Curry Village deck.</li>
              <li>A dinner to remember: the Mountain Room or The Ahwahnee. Book ahead.</li>
              <li>A Tioga Road day: pack lunch. Tuolumne closes in September.</li>
              <li>Staying in Yosemite West: shop before you arrive. There is nothing there.</li>
              <li>Every other lunch: a sandwich on a granite slab by the river.</li>
            </ul>
            <a className="eat-short__link" href="/now">What's open this edition, on the Park Bulletin ↗</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="sec-0-is-there-food-in-yosemite-national-park" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">IS THERE FOOD IN YOSEMITE?</p>
            <h2>Yes, and almost all of it is in the Valley</h2>
            <div className="eat-prose">
              <p>
                <strong>Yosemite Valley</strong> has the park's only real cluster of food: counters, decks and dining rooms in Yosemite Village, at Yosemite Valley Lodge and around Curry Village. Leave the Valley and the choices thin out fast. <strong>Wawona</strong> has a general store. <strong>Tuolumne Meadows</strong>, up on Tioga Road, has a seasonal store and grill and the dining tent at Tuolumne Meadows Lodge, and all of them close in September. <strong>Crane Flat</strong> and <strong>El Portal</strong> have small markets. <strong>Yosemite West</strong> has vacation rentals and nothing else: no restaurant, no store, no gas.
              </p>
            </div>
            <div className="eat-rules">
              <div>
                <EventIcon name="car" size={26} />
                <strong>Staying outside the Valley?</strong>
                <p>Plan on a drive or a cooler.</p>
              </div>
              <div>
                <EventIcon name="clock" size={26} />
                <strong>Arriving after about 9 p.m.?</strong>
                <p>Assume everything is shut. This is a national park, not a town, and the kitchens keep park hours.</p>
              </div>
            </div>
          </div>
          <ParkFoodMap />
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-1-where-to-eat-in-yosemite-valley" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">WHERE TO EAT IN YOSEMITE VALLEY</p>
            <h2>Four clusters, one Valley</h2>
            <p className="ff-lede">
              The Valley's food sits in four places: Curry Village, Yosemite Valley Lodge, Yosemite Village and The Ahwahnee. Pick by what you need, then head to the cluster that has it.
            </p>
            <dl className="eat-need">
              <div><dt>After a hike</dt><dd>Curry Village Pizza Deck</dd></div>
              <div><dt>Everyone wants something different</dt><dd>Base Camp Eatery</dd></div>
              <div><dt>You forgot lunch</dt><dd>Degnan's Kitchen</dd></div>
              <div><dt>Hot food near a trailhead</dt><dd>Meadow Grill Taqueria</dd></div>
              <div><dt>Coffee before the Mist Trail</dt><dd>Coffee Corner</dd></div>
              <div><dt>Dinner facing Yosemite Falls</dt><dd>The Mountain Room</dd></div>
              <div><dt>A special occasion</dt><dd>The Ahwahnee Dining Room</dd></div>
              <div><dt>The shortest coffee line</dt><dd>Starbucks, at Base Camp</dd></div>
            </dl>
          </div>
          <ValleyFoodMap />
        </div>

        <div className="eat-clusters">
          <Cluster n="1" name="Curry Village" photo="img/curry-village.jpg" ratio="1600 / 1072" focus="50% 60%"
            alt="Wooden cabins at Curry Village among pines and granite boulders"
            credit="Curry Village cabins. Photo: US National Park Service / Wikimedia Commons (public domain)">
            <Kitchen name="Pizza Deck" meal="Lunch, dinner" price={2} res="No" pick="My first pick">
              Pizza on an outdoor deck facing Glacier Point Apron, and my first stop after a hike. Expect a line on summer evenings. The menu changes, so check it when you arrive; the Half Dome pizza is my pick when they have it.
            </Kitchen>
            <Kitchen name="Meadow Grill Taqueria" meal="Lunch, dinner" price={1} res="No">
              Tacos and burritos at the counter by the Village Store, beside the deck, with outdoor seating. It is the shortest path from a trailhead to a hot meal on the Valley floor, and usually the first Valley kitchen to close when summer ends.
            </Kitchen>
            <Kitchen name="Coffee Corner">
              Opens early. It is why you don't have to drive to Yosemite Village for coffee before a Mist Trail start.
            </Kitchen>
            <Kitchen name="Bar 1899">The small indoor bar.</Kitchen>
            <Kitchen name="Seven Tents Pavilion">The big buffet hall, mostly for the tent-cabin guests.</Kitchen>
            <li className="eat-kitchens__note">
              Four operations share one compound, and people lump them together. That is why most visitors think Curry Village has a pizza deck and nothing else. All four are seasonal to some degree.
            </li>
          </Cluster>

          <Cluster n="2" name="Yosemite Valley Lodge" photo="img/yosemite-valley-lodge-entrance.jpg" ratio="1600 / 1200"
            alt="The front entrance of Yosemite Valley Lodge under tall pines"
            credit="Yosemite Valley Lodge. Photo: Rennett Stowe / Wikimedia Commons (CC BY 2.0)">
            <Kitchen name="Base Camp Eatery" meal="All three" price={2} res="No">
              Counter service for breakfast, lunch or dinner, with seating inside and out. Useful when your group wants different meals from one stop. Check <a href="https://www.travelyosemite.com/dining/yosemite-valley-lodge">the lodge's dining hours</a> before you count on an early breakfast or a late dinner.
            </Kitchen>
            <Kitchen name="The Mountain Room" meal="Dinner" price={3} res="Advised" pick="The view">
              The Valley's sit-down dinner short of The Ahwahnee: a real dining room with a wall of glass facing Yosemite Falls. Book in summer, and time it for the falls, because the view is the reason to go.
            </Kitchen>
            <Kitchen name="Starbucks">
              Inside Base Camp Eatery since 2018, and no food decision the park has made drew more letters. It's a Starbucks. When the Degnan's counter is twenty deep, it has the shortest line in the Valley, and that's the whole case for it.
            </Kitchen>
          </Cluster>

          <Cluster n="3" name="Yosemite Village">
            <Kitchen name="Degnan's Kitchen" meal="Breakfast, lunch" price={1} res="No">
              Sandwiches, coffee and food to carry out. If you forgot lunch, <a href="/map?stop=degnans-deli">Degnan's</a> is the fallback. Check current hours, and don't assume the upstairs Loft is open.
            </Kitchen>
            <Kitchen name="Village Grill">On the county list, in Yosemite Village.</Kitchen>
          </Cluster>

          <Cluster n="4" name="The Ahwahnee" photo="img/ahwahnee-hotel.jpg" ratio="1600 / 1200"
            alt="The Ahwahnee hotel in winter, its stone and timber front below the Valley's north wall"
            credit="The Ahwahnee. Photo: Chris Dunstan / Wikimedia Commons (public domain)">
            <Kitchen name="The Ahwahnee Dining Room" meal="Check current menu" price={4} res="Required" pick="Special occasion">
              My pick for a special-occasion meal in the Valley. Book ahead, and check the <a href="https://www.travelyosemite.com/dining/yosemite-dining-experience">concessioner's current menu, prices and reservation details</a>. The tall windows and granite piers are part of the reason to come, so give the meal time.
            </Kitchen>
            <Kitchen name="The bar">On the county list, with the dining room.</Kitchen>
          </Cluster>
        </div>
      </section>

      <section className="ff-band" id="sec-2-wawona-fish-camp-and-the-south-end-of-th" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">WAWONA, FISH CAMP AND THE SOUTH END</p>
            <h2>A store in the park, dinner two miles past the gate</h2>
            <div className="eat-prose">
              <p>
                The <strong>Wawona General Store</strong> is a grocery and picnic-supply stop near the Mariposa Grove. <strong>The Wawona Hotel and its dining room are closed</strong> for a condition assessment. That is a closure, not a short break. Check <a href="https://www.nps.gov/places/000/wawona-hotel.htm">the NPS hotel notice</a> for news of a reopening.
              </p>
              <p>
                Two miles south of the gate, <strong>Fish Camp</strong> covers what Wawona does not, and it is closer than most people staying at the south end realize. <strong>Embers</strong> at Tenaya Lodge is the sit-down dinner and the nearest real restaurant to the Mariposa Grove. <strong>Jackalopes</strong>, the bar in the same building, takes walk-ins when Embers is booked. The <strong>Pine Tree Market</strong> and the <strong>Fish Camp General Store</strong> cover groceries and a sandwich. Past that, you're driving to Oakhurst, fifteen more minutes down Highway 41.
              </p>
            </div>
          </div>
          <div>
            <h3 className="eat-subhead">Down Highway 41, north to south</h3>
            <ol className="eat-road">
              <li><span>Wawona</span><strong>Wawona General Store</strong><p>Groceries, sandwiches, picnic supplies.</p></li>
              <li className="is-closed"><span>Wawona</span><strong>Wawona Hotel dining room</strong><p>Closed for a condition assessment.</p></li>
              <li className="is-gate"><span>The South Entrance</span><strong>You leave the park</strong></li>
              <li><span>Fish Camp, 2 miles on</span><strong>Embers, at Tenaya Lodge</strong><p>Sit-down dinner. Reservations advised.</p></li>
              <li><span>Same building</span><strong>Jackalopes</strong><p>The bar. Takes walk-ins when Embers is booked.</p></li>
              <li><span>Fish Camp</span><strong>Pine Tree Market, Fish Camp General Store</strong><p>Groceries and a sandwich.</p></li>
              <li><span>15 minutes more</span><strong>Oakhurst</strong><p>The next food. See the gateway towns below.</p></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-3-tuolumne-meadows-and-the-high-country" tabIndex={-1}>
        <div className="ff-split eat-tuol">
          <figure className="eat-photo">
            <ResponsiveImage image="img/tuolumne-meadows-lembert-dome.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 600px" style={{ aspectRatio: "1600 / 1067" }}
              alt="Lembert Dome above Tuolumne Meadows, with hikers on the granite in the foreground" />
            <figcaption>Lembert Dome, Tuolumne Meadows. Photo: Pacific Southwest Region USFWS / Wikimedia Commons (public domain)</figcaption>
          </figure>
          <div>
            <p className="hp-eyebrow">TUOLUMNE MEADOWS AND THE HIGH COUNTRY</p>
            <h2>Pack lunch. An open road is not an open kitchen</h2>
            <div className="eat-prose">
              <p>
                Tuolumne Meadows food service is seasonal, and its kitchens don't all close on the same day. The concessioner's <a href="https://www.travelyosemite.com/dining/tuolumne-meadows-lodge">2026 schedule</a> lists September 13 as the lodge dining room's last day and September 20 as the grill's. See <a href="/articles/tuolumne-meadows-in-a-day">the Tuolumne Meadows day guide</a> for the rest of the trip.
              </p>
            </div>
            <ol className="eat-cooler">
              <li><EventIcon name="food" size={24} /><strong>Buy food on the way</strong><p>At Crane Flat going up, or in Lee Vining coming over.</p></li>
              <li><EventIcon name="dome" size={24} /><strong>Eat it on a granite slab</strong><p>The high country is a cooler day.</p></li>
              <li><EventIcon name="check" size={24} /><strong>Count anything open as a bonus</strong><p>At 8,600 feet, an open kitchen is luck, not a plan.</p></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="ff-band" id="sec-4-yosemite-west-restaurants-there-are-none" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="eat-none">
            <div>
              <p className="hp-eyebrow">YOSEMITE WEST RESTAURANTS</p>
              <h2>There are none</h2>
              <div className="eat-prose">
                <p>
                  Yosemite West is a housing tract inside the park boundary off Wawona Road, and it is almost all vacation rentals. The listings sell the location and skip the logistics, so guests are often caught short. A rental kitchen only helps if you bring the groceries. Shop before you arrive.
                </p>
              </div>
            </div>
            <ul className="eat-none__list" aria-label="What Yosemite West does not have">
              <li><EventIcon name="no" size={28} />No restaurant</li>
              <li><EventIcon name="no" size={28} />No store</li>
              <li><EventIcon name="no" size={28} />No gas station</li>
              <li><EventIcon name="no" size={28} />No shuttle</li>
            </ul>
            <dl className="eat-none__drive">
              <div><dt>Nearest food</dt><dd>Yosemite Valley</dd><p>Roughly 40 minutes each way</p></div>
              <div><dt>Or</dt><dd>Wawona</dd><p>About half an hour south</p></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-5-restaurants-near-yosemite-the-gateway-to" tabIndex={-1}>
        <p className="hp-eyebrow">RESTAURANTS NEAR YOSEMITE</p>
        <h2>The gateway towns, and the one place to eat in each</h2>
        <p className="ff-lede">Where to base yourself is a bigger question than where to eat, and <a href="/articles/yosemite-gateway-towns-compared">the gateway towns comparison</a> answers it. This is the food half.</p>

        <div className="eat-towns">
          <article className="eat-town">
            <figure className="eat-town__photo">
              <ResponsiveImage image="img/mariposa-county-courthouse.jpg" alt="The white wooden Mariposa County Courthouse, built in 1854, behind a lawn" sizes="(max-width: 760px) calc(100vw - 40px), 360px" style={{ aspectRatio: "1600 / 1200" }} />
              <figcaption>Mariposa County Courthouse. Photo: Guywelch2000 / Wikimedia Commons (CC0)</figcaption>
            </figure>
            <div className="eat-town__body">
              <p className="eat-town__road">Highway 140 · the western gateway</p>
              <h3>Mariposa</h3>
              <p className="eat-town__line">The most restaurants, the most parking, and a downtown you would walk after dinner. Three are worth planning around.</p>
              <div className="eat-picks">
                <TownPick name="1850 Restaurant & Brewing Co." meta="Dinner · $$" week={["Mon", "Tue"]} weekLabel="1850: closed Monday and Tuesday">
                  The sit-down dinner in town. Wood-fired pizza, a good burger, a short list of house-brewed beers, and a patio that fills on summer evenings. Service can drag when the room is full. The food is worth the wait.
                </TownPick>
                <TownPick name="Smokin Oak BBQ" meta="Lunch, dinner · $$" week={["Mon", "Tue"]} weekLabel="Smokin Oak BBQ: closed Monday and Tuesday">
                  Opened late in 2024, with the Twisted Cedar Tap House next door since early 2025, pouring mead, beer and cider. Brisket cooked the right number of hours, served on butcher paper. The sides are solid; get the slaw. Go at lunch. By 7 p.m. the brisket is often gone and you're on to the pulled pork, which is also fine.
                </TownPick>
                <TownPick name="Tacos Sonora" meta="Lunch · $ · 5034 Coakley Circle" week={["Sun"]} weekLabel="Tacos Sonora: weekdays until 7 p.m., Saturday until 4 p.m., closed Sunday" weekNotes={{ Mon: "to 7", Tue: "to 7", Wed: "to 7", Thu: "to 7", Fri: "to 7", Sat: "to 4" }}>
                  A taco truck parked for good. Fast and cheap: two carne asada tacos and a horchata, no frills, no table. A good stop after a hike.
                </TownPick>
              </div>
            </div>
          </article>

          <article className="eat-town">
            <div className="eat-town__mark"><EventIcon name="pin" size={30} /><span>Last stop before Arch Rock</span></div>
            <div className="eat-town__body">
              <p className="eat-town__road">Highway 140 · at the park line</p>
              <h3>El Portal</h3>
              <p className="eat-town__line">More than its size suggests, and 25 minutes closer than Mariposa on a night the Valley kitchens have shut.</p>
              <div className="eat-picks">
                <TownPick name="Four restaurants, open to everyone" meta="Dinner · $$">
                  The <strong>Cedar House Restaurant</strong> and the <strong>Canyon Bar</strong> at the Yosemite View Lodge, the <strong>River Restaurant</strong> at the Cedar Lodge, and <strong>Parkside Pizza</strong>. None is worth driving out of the park for, which is the only reason none made the list above. All four serve the public, not just lodge guests.
                </TownPick>
                <TownPick name="The market" meta="Groceries · fuel">
                  Where I shop, and the last fuel and groceries before the gate.
                </TownPick>
              </div>
            </div>
          </article>

          <article className="eat-town">
            <figure className="eat-town__photo">
              <ResponsiveImage image="img/oakhurst-highway-41-ken-lund.jpg" alt="Highway 41 through Oakhurst, with shops along the road and a forested ridge behind" sizes="(max-width: 760px) calc(100vw - 40px), 360px" style={{ aspectRatio: "1920 / 951", objectPosition: "50% 70%" }} />
              <figcaption>Highway 41, Oakhurst. Photo: Ken Lund / Wikimedia Commons (CC BY-SA 2.0)</figcaption>
            </figure>
            <div className="eat-town__body">
              <p className="eat-town__road">Highway 41 · the southern gateway</p>
              <h3>Oakhurst</h3>
              <p className="eat-town__line">The largest gateway town, and more chain restaurants than the others combined. Skip those.</p>
              <div className="eat-picks">
                <TownPick name="South Gate Brewing Company" meta="Dinner · $$ · open daily" week={[]} weekLabel="South Gate Brewing: open daily">
                  The default dinner after the park for anyone based in Oakhurst, Bass Lake or Fish Camp. Wood-fired pizza with the dough stretched to order, fish and chips in their Blonde Ale batter, a long list of their own beers, and enough seats to take a Saturday night without a two-hour wait. The vegan and gluten-free dishes are real dishes. If you're in Oakhurst asking where to eat, this is the answer.
                </TownPick>
                <TownPick name="The Elderberry House at Chateau du Sureau" meta="Prix fixe · $$$$ · reservations required well ahead">
                  The fine-dining choice, and the only restaurant in the region that is a destination on its own. Erna Kubin-Clanin opened it in 1984, and the kitchen still serves a multi-course prix fixe (one set menu, one set price) that changes daily, with optional wine pairings from a serious cellar. Well over $100 a person before wine. This is the anniversary dinner, or the last night.
                </TownPick>
              </div>
            </div>
          </article>

          <article className="eat-town">
            <div className="eat-town__mark"><EventIcon name="route" size={30} /><span>Over Tioga Pass</span></div>
            <div className="eat-town__body">
              <p className="eat-town__road">US 395 · the eastern gateway</p>
              <h3>Lee Vining</h3>
              <p className="eat-town__line">The first real coffee on the route, in either direction.</p>
              <div className="eat-picks">
                <TownPick name="Latte Da Cafe" meta="Breakfast, coffee · $ · seasonal">
                  The east-side breakfast and coffee stop, whether you're crossing Tioga Pass from Mammoth or Bishop or coming down from Lake Tahoe. Pastries are baked in house and the drip coffee is good. Park behind the building, walk in, eat outside.
                </TownPick>
              </div>
            </div>
          </article>

          <article className="eat-town">
            <figure className="eat-town__photo">
              <ResponsiveImage image="img/groveland-main-street-highway-120.jpg" alt="Main Street in Groveland, which is Highway 120, lined with historic storefronts" sizes="(max-width: 760px) calc(100vw - 40px), 360px" style={{ aspectRatio: "1600 / 1067" }} />
              <figcaption>Main Street, Groveland. Photo: Almonroth / Wikimedia Commons (CC BY-SA 3.0)</figcaption>
            </figure>
            <div className="eat-town__body">
              <p className="eat-town__road">Highway 120 · the Big Oak Flat side</p>
              <h3>Groveland</h3>
              <p className="eat-town__line">A historic main street with the Iron Door Saloon on it, and enough places to eat for a two-night stay.</p>
              <p className="eat-town__aside">It's missing from the county list below because it's in Tuolumne County, not because there's nothing there.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="ff-band" id="sec-6-everything-that-exists-by-area" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">EVERYTHING THAT EXISTS, BY AREA</p>
              <h2>The county's own list</h2>
              <div className="eat-prose">
                <p>
                  The picks above are opinions. This is the August 2026 revision of the Mariposa eating-out list, a single sheet kept current in the county and handed out at visitor desks and lodge counters. It records what exists and roughly where. No hours, no prices, no judgment, and being on it is not a recommendation from anybody, including me. It does one thing a review list can't: it tells you a town of four hundred people has a cafe in it at all. Names are printed as the sheet prints them where a business's own spelling is unclear.
                </p>
              </div>
            </div>
            <p className="ff-alert eat-caveat">
              <EventIcon name="alert" />
              <span><strong>What it leaves out.</strong> The sheet covers Mariposa County plus Fish Camp, so Oakhurst, Bass Lake, Groveland and Lee Vining are absent: they are in Madera, Tuolumne and Mono counties. It also lists a few places not aimed at visitors, the Senior Center being the obvious one.</span>
            </p>
          </div>

          <div className="eat-roster">
            {ROSTER.map((r) => (
              <article key={r.area} className="eat-roster__area">
                <p className="eat-roster__count">{r.items.length + (r.extra ? r.extra.length : 0)}</p>
                <h3>{r.area}</h3>
                <ul className="eat-roster__names">
                  {r.items.map((n) => <li key={n}>{n}</li>)}
                </ul>
                {r.extra && (
                  <React.Fragment>
                    <p className="eat-roster__label">{r.extraLabel}</p>
                    <ul className="eat-roster__names">{r.extra.map((n) => <li key={n}>{n}</li>)}</ul>
                  </React.Fragment>
                )}
                {r.note && <p className="eat-roster__note">{r.note}</p>}
              </article>
            ))}
            <article className="eat-roster__area eat-roster__area--trucks">
              <p className="eat-roster__count">{TRUCKS.length}</p>
              <h3>Trucks and pop-ups</h3>
              <ul className="eat-roster__names">{TRUCKS.map((n) => <li key={n}>{n}</li>)}</ul>
              <p className="eat-roster__note">
                The part of the food scene no visitor finds by searching. Trucks move, so a name is all you get here. Look at the county fairgrounds, the Saturday farmers market and the brewery patios, in that order.
              </p>
            </article>
            <article className="eat-roster__area eat-roster__area--catering">
              <p className="eat-roster__count">15</p>
              <h3>Caterers</h3>
              <p className="eat-roster__note">
                The same sheet has a catering column: fifteen operators working the county. It's the answer nobody has when a group trip turns into dinner for twenty or a small wedding turns real. If that's your trip, <a href="/articles/where-to-propose-in-yosemite">the proposal guide</a> covers the venue half.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-7-the-short-version-by-area" tabIndex={-1}>
        <p className="hp-eyebrow">THE SHORT VERSION, BY AREA</p>
        <h2>Every pick in one table</h2>
        <div className="eat-filter" role="group" aria-label="Show restaurants in">
          {TABLE_FILTERS.map(([k, label]) => (
            <button key={k} type="button" className={"eat-filter__chip" + (area === k ? " is-on" : "")} aria-pressed={area === k} onClick={() => setArea(k)}>
              {label}
            </button>
          ))}
        </div>
        <div className="eat-table-wrap">
          <table className="eat-table">
            <thead>
              <tr>
                <th scope="col">Where</th>
                <th scope="col">Area</th>
                <th scope="col">Meal</th>
                <th scope="col">Price</th>
                <th scope="col">Season</th>
                <th scope="col">Reservations</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, where, , meal, price, season, res]) => (
                <tr key={name}>
                  <th scope="row" data-label="Where">{name}</th>
                  <td data-label="Area">{where}</td>
                  <td data-label="Meal">{meal}</td>
                  <td data-label="Price"><Price n={price} /></td>
                  <td data-label="Season"><span className={"eat-season" + (/Summer|Seasonal/.test(season) ? " is-summer" : "")}>{season}</span></td>
                  <td data-label="Reservations"><span className={"eat-chip eat-chip--res is-" + res.toLowerCase().split(" ")[0]}>{res}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ff-note">
          Hours and closing days move with the season and with staffing, and the concessioner's hours in the park change more than the towns' do. <a href="/now">The Park Bulletin</a> carries what is open in the current <em>Yosemite Guide</em> edition. Read the table as the general shape, not today's schedule.
        </p>
      </section>

      <section className="ff-band" id="sec-8-can-you-bring-your-own-food-into-yosemit" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">CAN YOU BRING YOUR OWN FOOD?</p>
              <h2>Yes, and on most trips you should</h2>
              <div className="eat-prose">
                <p>
                  Nothing limits bringing food into the park: no inspection at the gate, no rule against a cooler. The rule that does exist is about <strong>storage</strong>, and it is federal law, not advice. To a bear, food means anything with a scent. <a href="/articles/yosemite-bears-safety-guide">The bear guide</a> covers what happens when people get this wrong, and <a href="/articles/pack-your-car-for-yosemite">the packing piece</a> covers the cooler.
                </p>
              </div>
            </div>
            <NatureNotesFilm id="black-bears" title="Black Bears" youtubeId="ijIePq9gGfo" episode={26}
              note="The animal the storage rule is written for." location="article" />
          </div>
          <ul className="ff-rules eat-bear">
            <li className="is-exception">
              <EventIcon name="users" size={26} />
              <strong>By day</strong>
              <p>Food stays within arm's reach.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="bed" size={26} />
              <strong>At night</strong>
              <p>Food goes into a bear locker.</p>
            </li>
            <li>
              <EventIcon name="car" size={26} />
              <strong>Never</strong>
              <p>In a car overnight, or in a truck bed.</p>
            </li>
            <li>
              <EventIcon name="alert" size={26} />
              <strong>What counts as food</strong>
              <p>Anything with a scent, which includes trash, sunscreen and toothpaste.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* The page's thesis, on the hero's river. */}
      <div className="eat-slab">
        <ResponsiveImage image="img/cathedral-beach-quiet-picnic.jpg" className="eat-slab__img" sizes="100vw" style={{ aspectRatio: "1600 / 1067" }}
          alt="The Merced River at Cathedral Beach, still and green, reflecting Cathedral Rocks and the pines" />
        <div className="hp-wrap eat-slab__copy">
          <blockquote className="eat-slab__quote">
            The best lunch in Yosemite is a sandwich you made in a parking lot, eaten on a granite slab beside the Merced.
          </blockquote>
          <p className="eat-slab__text">It costs four dollars and saves you an hour in line.</p>
        </div>
        <p className="ff-cover__credit">Cathedral Beach. Photo: Todd Petrie / Wikimedia Commons (CC BY 2.0)</p>
      </div>

      <section className="hp-wrap hp-section" id="sec-9-what-closes-and-when" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">WHAT CLOSES, AND WHEN</p>
            <h2>Check each kitchen on its own</h2>
            <div className="eat-prose">
              <p>
                Valley restaurants change their hours as the season winds down, and the high country shuts completely. Check <a href="https://www.travelyosemite.com/dining/yosemite-dining-experience">Yosemite Hospitality's dining pages</a> and the <a href="/now">Park Bulletin</a> shortly before your visit. <a href="/articles/yosemite-in-winter">The winter guide</a> has the rest of the cold-season picture.
              </p>
            </div>
          </div>
          <div className="eat-winter">
            <p className="hp-eyebrow">OCTOBER TO MAY</p>
            <div className="eat-winter__grid">
              <div className="is-open">
                <strong>The Valley</strong>
                <p>Keeps a real core open: Degnan's, Base Camp and the hotel dining rooms among them.</p>
              </div>
              <div className="is-closed">
                <strong>The high country</strong>
                <p>Nothing at all. Tioga Road is closed anyway.</p>
              </div>
            </div>
            <p className="ff-note">Check what is actually open before you plan a meal around it.</p>
          </div>
        </div>
        <ol className="ff-timeline eat-timeline">
          <li className="is-gone"><span>Sep 13, 2026</span><strong>Tuolumne Meadows Lodge</strong><p>The dining room's last day on the published schedule.</p></li>
          <li className="is-gone"><span>Sep 20, 2026</span><strong>Tuolumne grill</strong><p>The grill's last day on the published schedule.</p></li>
          <li className="is-tight"><span>As summer ends</span><strong>Meadow Grill Taqueria</strong><p>Usually the first Valley kitchen to close.</p></li>
          <li className="is-tight"><span>Through the fall</span><strong>Valley hours</strong><p>Restaurants change their hours as the season winds down.</p></li>
        </ol>
      </section>

      <section className="ff-band" id="sec-10-the-takeaway" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">THE TAKEAWAY</p>
          <h2>Food is not the point of a Yosemite trip</h2>
          <ol className="eat-plan">
            <li><span>Every day</span><strong>Pack a cooler</strong></li>
            <li><span>One night</span><strong>Pizza at Curry Village</strong></li>
            <li><span>One night</span><strong>Brisket in Mariposa</strong></li>
            <li><span>One morning</span><strong>Coffee in Lee Vining</strong></li>
            <li><span>Every other lunch</span><strong>A granite slab next to the river</strong></li>
          </ol>
          <p className="eat-further">
            For where to base yourself, see <a href="/articles/yosemite-gateway-towns-compared">Yosemite gateway towns compared</a> and <a href="/articles/where-to-stay-in-yosemite">the lodging guide</a>. For one-day and two-day plans, see <a href="/articles/yosemite-in-one-or-two-days">One day or two in Yosemite</a>. For what a trip really costs, see <a href="/articles/yosemite-trip-cost-budget-2026">the budget breakdown</a>.
          </p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="where-to-eat-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Eating in Yosemite, answered</h2>
            <div className="eat-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.travelyosemite.com/dining/yosemite-dining-experience" target="_blank" rel="noopener noreferrer">Dining in Yosemite, Yosemite Hospitality</a></li>
                <li><a href="https://www.travelyosemite.com/dining/tuolumne-meadows-lodge" target="_blank" rel="noopener noreferrer">Tuolumne Meadows Lodge dining, Yosemite Hospitality</a></li>
                <li><a href="https://www.nps.gov/places/000/wawona-hotel.htm" target="_blank" rel="noopener noreferrer">Wawona Hotel, NPS</a></li>
                <li><a href="/now">The Park Bulletin, this edition's hours</a></li>
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
