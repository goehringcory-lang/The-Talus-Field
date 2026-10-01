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
//   5. The October 2026 deepening (the Ahwahnee dining room, groceries, the
//      places with little or no food, dietary needs, picnic areas, the
//      Highway 120 lodges and Lee Vining) is sourced from the concessioner's
//      dining and shopping pages, the Yosemite Guide for September 23 to
//      November 24, 2026, the NPS picnic, closure and Mariposa Grove pages,
//      and the restaurants' own sites, read October 1, 2026, all listed under
//      Sources. It also corrected four claims: Yosemite West is outside the
//      boundary, the Ahwahnee's dinner reservations are strongly recommended
//      rather than required, Seven Tents serves plated meals rather than a
//      buffet, and the Pizza Deck runs January through November.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["where-to-eat-yosemite"] = function WhereToEatYosemiteBody() {
  const TOC = [
    ["#sec-0-is-there-food-in-yosemite-national-park", "Food in the park"],
    ["#sec-1-where-to-eat-in-yosemite-valley", "The Valley"],
    ["#ahwahnee-dining-room", "The Ahwahnee"],
    ["#groceries-and-supplies", "Groceries"],
    ["#sec-2-wawona-fish-camp-and-the-south-end-of-th", "Wawona and Fish Camp"],
    ["#sec-3-tuolumne-meadows-and-the-high-country", "Tuolumne"],
    ["#sec-4-yosemite-west-restaurants-there-are-none", "No kitchen"],
    ["#sec-5-restaurants-near-yosemite-the-gateway-to", "Gateway towns"],
    ["#sec-6-everything-that-exists-by-area", "Every kitchen"],
    ["#sec-7-the-short-version-by-area", "The table"],
    ["#dietary-needs", "Dietary needs"],
    ["#picnic-areas", "Picnic areas"],
    ["#sec-8-can-you-bring-your-own-food-into-yosemit", "Your own food"],
    ["#sec-9-what-closes-and-when", "What closes"],
    ["#where-to-eat-questions", "Questions"],
  ];

  const FAQ = [
    ["Where can I get a quick meal in Yosemite Valley?", "Curry Village Pizza Deck, Base Camp Eatery at Yosemite Valley Lodge, and Degnan's Kitchen in Yosemite Village are convenient options. Check current hours before relying on an early breakfast or late dinner."],
    ["Where can I book a sit-down dinner in Yosemite Valley?", "The Mountain Room at Yosemite Valley Lodge and The Ahwahnee Dining Room are options. Both take reservations on OpenTable, and the Ahwahnee also by phone at 209/372-1489. A room at the hotel does not hold you a table, so book dinner separately."],
    ["Is there a dress code at the Ahwahnee Dining Room?", "At dinner, yes. The hotel asks for long pants and a collared shirt, or a dress, skirt, or long pants with a blouse, and no hiking clothes, shorts, T-shirts, tank tops, flip-flops or baseball caps. Breakfast, lunch and Sunday brunch are casual."],
    ["Where can I buy groceries in Yosemite?", "The Village Store in Yosemite Village has the park's largest selection, including meat, produce, ice and firewood. Curry Village has a grocery that stays open in winter, and there are smaller stores at Housekeeping Camp, Wawona, Crane Flat and, in summer, Tuolumne Meadows."],
    ["Are there restaurants in Yosemite West?", "No. Yosemite West, a private enclave just outside the park's southern boundary, has no restaurant, store, gas station, or shuttle. Shop before arriving. Yosemite Valley is roughly forty minutes each way, or Wawona is about half an hour south."],
    ["Is there food at Tuolumne Meadows in fall?", "Service is seasonal. The concessioner's 2026 schedule lists September 13 as the lodge dining room's last day and September 20 for the grill. Pack lunch for a Tioga Road day; an open road does not mean an open kitchen."],
    ["Is the Wawona Hotel dining room open?", "The Wawona Hotel and its dining room are closed for a condition assessment. Check the NPS hotel notice for reopening updates. The Wawona General Store is a grocery and picnic-supply option."],
    ["Where should I eat near Yosemite?", "Choose restaurants near your route or lodging. The guide recommends 1850, Smokin Oak BBQ, and Tacos Sonora in Mariposa; South Gate Brewing Company and The Elderberry House in Oakhurst; and Latte Da Cafe in Lee Vining. On Highway 120, Rush Creek Lodge and Evergreen Lodge have full restaurants a few miles from the Big Oak Flat entrance. Check current hours before making a special trip."],
    ["Do Yosemite picnic areas have water?", "Mostly not. The Park Service says only Lower Yosemite Fall and Church Bowl have drinking water and flush toilets; the other picnic areas have tables, vault toilets and, at most, grills. Bring water, and keep food within arm's reach."],
  ];

  // ── The park, by how much food each place has ─────────────────────────────
  // Positions in the stay crop's pixels (1760 x 1410). `tone` is the key:
  // full (the Valley), seasonal (Tuolumne), store (a market and little else),
  // none (Yosemite West), town (a gateway with restaurants). `side` is where
  // the label sits. Three towns are off the map's edge; `off` says so.
  const PARK_W = 1760, PARK_H = 1410;
  const PARK_SPOTS = [
    { at: [686, 659], side: "t", tone: "full", name: "Yosemite Valley", note: "Counters, decks and dining rooms" },
    { at: [710, 706], side: "b", tone: "store", name: "Glacier Point", note: "Snack stand, summer and fall" },
    { at: [520, 889], side: "r", tone: "seasonal", name: "Badger Pass", note: "A grill, in ski season" },
    { at: [1169, 321], side: "b", tone: "seasonal", name: "Tuolumne Meadows", note: "Store, grill, lodge. Closes in September" },
    { at: [231, 646], side: "r", tone: "store", name: "Crane Flat", note: "Small market" },
    { at: [263, 856], side: "t", tone: "town", name: "El Portal", note: "A market and four restaurants" },
    { at: [426, 921], side: "b", tone: "none", name: "Yosemite West", note: "Outside the park. No food at all" },
    { at: [536, 1229], side: "t", tone: "store", name: "Wawona", note: "General store. Hotel dining closed" },
    { at: [563, 1335], side: "r", tone: "town", name: "Fish Camp", note: "Embers, Jackalopes, two markets" },
    { at: [1648, 95], side: "l", tone: "town", name: "Lee Vining", note: "Whoa Nellie Deli, Latte Da Cafe" },
    { at: [16, 905], side: "d", tone: "town", name: "Mariposa", note: "Highway 140, off the map" },
    { at: [16, 470], side: "r", tone: "town", name: "Groveland", note: "Highway 120: Rush Creek, Evergreen" },
    { at: [575, 1392], side: "ul", tone: "town", name: "Oakhurst", note: "Highway 41, off the map" },
  ];
  const TONES = [
    ["full", "Most choice"],
    ["seasonal", "Seasonal only"],
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
            alt="National Park Service map of Yosemite, cropped from Hetch Hetchy south to the Mariposa Grove, marking where food is: Yosemite Valley has the most, Tuolumne Meadows is open in summer only and Badger Pass in ski season, Crane Flat and Wawona have stores and Glacier Point a snack stand, Yosemite West has nothing, and El Portal, Fish Camp, Lee Vining, Mariposa, Groveland and Oakhurst are gateway towns with restaurants." />
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
    ["Curry Village Pizza Deck", "Yosemite Valley", "valley", "Lunch, dinner", 2, "January to November", "No"],
    ["Seven Tents Pavilion", "Yosemite Valley", "valley", "Breakfast, dinner", 2, "Year-round", "No"],
    ["Base Camp Eatery", "Yosemite Valley", "valley", "All three", 2, "Year-round", "No"],
    ["Degnan's Kitchen", "Yosemite Valley", "valley", "Breakfast, lunch", 1, "Year-round", "No"],
    ["Village Grill", "Yosemite Valley", "valley", "Lunch, dinner", 1, "Summer into fall", "No"],
    ["Meadow Grill Taqueria", "Yosemite Valley", "valley", "Lunch, dinner", 1, "Summer", "No"],
    ["The Mountain Room", "Yosemite Valley", "valley", "Dinner", 3, "Most of the year", "Advised"],
    ["The Ahwahnee Dining Room", "Yosemite Valley", "valley", "All three, Sunday brunch", 4, "Year-round", "Strongly recommended"],
    ["Wawona General Store", "Wawona", "south", "Groceries, sandwiches", 1, "Year-round", "No"],
    ["Glacier Point snack stand", "Glacier Point", "south", "Snacks", 1, "Summer and fall", "No"],
    ["Badger Pass Skiers Grill", "Glacier Point Road", "south", "Breakfast, lunch", 1, "Ski season, when it opens", "No"],
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
    ["Whoa Nellie Deli", "Lee Vining", "towns", "All three", 2, "Seasonal", "No"],
    ["Yosemite Restaurant, Rush Creek Lodge", "Highway 120", "towns", "All three", 3, "Year-round", "Recommended"],
    ["Evergreen Lodge Restaurant", "Highway 120", "towns", "All three", 3, "Year-round", "Recommended"],
    ["Iron Door Saloon", "Groveland", "towns", "Lunch, dinner", 2, "Year-round", "No"],
  ];
  const TABLE_FILTERS = [["all", "Everywhere"], ["valley", "The Valley"], ["south", "The south end and Glacier Point"], ["tioga", "Tioga Road"], ["towns", "Gateway towns"]];
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

  // ── Picnic areas, from the NPS list ─────────────────────────────────────────
  // [area, [[name, note]]]. A note restates the page's own exception.
  const PICNICS = [
    ["Yosemite Valley", [["Lower Yosemite Fall", "Drinking water, flush toilets, no grills"], ["Church Bowl", "Drinking water, flush toilets"], ["Cathedral Beach", "Not wheelchair accessible"], ["Sentinel Beach"], ["Swinging Bridge"], ["El Capitan"], ["The Cascades", "At the west end"]]],
    ["Wawona", [["Yosemite History Center", "Across from the Wawona Store"], ["South of Wawona Campground"], ["Mariposa Grove Road", "Disability placard holders only"]]],
    ["Tioga Road", [["Tenaya Lake"], ["Yosemite Creek", "No grills"], ["Lembert Dome", "No grills"]]],
  ];

  // ── The stores, as data ────────────────────────────────────────────────────
  // [name, where, what it sells, season, tone]. `tone` marks a seasonal store
  // (summer) or one outside the park (out). Offerings are the concessioner's
  // own lists; seasons are the Yosemite Guide's.
  const STORES = [
    ["Village Store", "Yosemite Village", "The largest grocery in the park: meat, produce, camping supplies, ice, firewood, an ATM.", "Year-round"],
    ["Curry Village Gift & Grocery", "Curry Village", "Groceries, camp supplies and an ATM, beside the gift shop.", "Year-round"],
    ["Housekeeping Camp store", "Housekeeping Camp", "Groceries, snacks and camping supplies.", "Closes with the camp in October", "summer"],
    ["Yosemite Valley Lodge gift shop", "Yosemite Valley Lodge", "Snacks, drinks and convenience items. Not a grocery.", "Year-round"],
    ["The Ahwahnee Sweet Shop", "The Ahwahnee", "Snacks, sweets and wine.", "Year-round"],
    ["Mountain Shop", "Curry Village", "Climbing and hiking gear, and dehydrated food for the trail.", "Year-round"],
    ["Wawona Store", "Wawona", "Groceries, camping and fishing supplies, maps and wine.", "Year-round"],
    ["Crane Flat Gas & Grocery", "Big Oak Flat Road", "A small store at the gas station. The pumps take cards around the clock all year.", "Store closes in late October", "summer"],
    ["Tuolumne Meadows Store", "Tioga Road", "Groceries, snacks and camping supplies.", "Summer only", "summer"],
    ["El Portal Market", "El Portal, outside the park", "Limited groceries and gifts, and Wi-Fi.", "Year-round", "out"],
  ];

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
              Pizza on an outdoor deck facing Glacier Point Apron, and my first stop after a hike. Expect a line on summer evenings. The menu changes, so check it when you arrive; the Half Dome pizza is my pick when they have it. The deck runs January through November and over the holidays; in winter, order the same pizza inside at Seven Tents.
            </Kitchen>
            <Kitchen name="Meadow Grill Taqueria" meal="Lunch, dinner" price={1} res="No">
              Tacos and burritos at the counter by the Village Store, beside the deck, with outdoor seating. It is the shortest path from a trailhead to a hot meal on the Valley floor, and usually the first Valley kitchen to close when summer ends.
            </Kitchen>
            <Kitchen name="Coffee Corner">
              Peet's coffee and a light breakfast, and it opens early. It is why you don't have to drive to Yosemite Village for coffee before a Mist Trail start.
            </Kitchen>
            <Kitchen name="Bar 1899">Craft beer, cocktails and light plates, with seats inside and out. Its hours shrink in winter.</Kitchen>
            <Kitchen name="Seven Tents Pavilion" meal="Breakfast, dinner" price={2} res="No">The big indoor dining hall: hearty, homestyle plates, recently renovated, and the warm place to eat pizza once the deck closes for the winter.</Kitchen>
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
              The Valley's sit-down dinner short of The Ahwahnee: an upscale casual steakhouse with a wall of glass facing Yosemite Falls. Book on OpenTable in summer, and time it for the falls, because the view is the reason to go. The lounge next door, with a fireplace and a patio, pours beer and cocktails with light plates and needs no booking.
            </Kitchen>
            <Kitchen name="Starbucks">
              Inside Base Camp Eatery since 2018, and no food decision the park has made drew more letters. It's a Starbucks. When the Degnan's counter is twenty deep, it has the shortest line in the Valley, and that's the whole case for it.
            </Kitchen>
          </Cluster>

          <Cluster n="3" name="Yosemite Village">
            <Kitchen name="Degnan's Kitchen" meal="Breakfast, lunch" price={1} res="No">
              Peet's coffee, sandwiches and grab-and-go food, with indoor seating, Wi-Fi and, in winter, a fire. If you forgot lunch, <a href="/map?stop=degnans-deli">Degnan's</a> is the fallback. Check current hours; the upstairs Loft is not on the current listings.
            </Kitchen>
            <Kitchen name="Village Grill" meal="Lunch, dinner" price={1} res="No">Burgers, grilled sandwiches, veggie options and soft serve, with a big outdoor seating area. Summer into fall only; it closes in late October.</Kitchen>
          </Cluster>

          <Cluster n="4" name="The Ahwahnee" photo="img/ahwahnee-hotel.jpg" ratio="1600 / 1200"
            alt="The Ahwahnee hotel in winter, its stone and timber front below the Valley's north wall"
            credit="The Ahwahnee. Photo: Chris Dunstan / Wikimedia Commons (public domain)">
            <Kitchen name="The Ahwahnee Dining Room" meal="All three, and Sunday brunch" price={4} res="Strongly recommended" pick="Special occasion">
              My pick for a special-occasion meal in the Valley. Dinner is a prix fixe of five or seven courses with a dress code; breakfast, lunch and brunch are casual. <a href="#ahwahnee-dining-room">The whole picture is below.</a> The tall windows and granite piers are part of the reason to come, so give the meal time.
            </Kitchen>
            <Kitchen name="The Ahwahnee Bar">Craft cocktails, wine, appetizers and lighter plates, without the dinner's dress code or price.</Kitchen>
          </Cluster>
        </div>
      </section>

      {/* The Ahwahnee's dining room, the one Valley meal with rules. */}
      <section className="ff-band" id="ahwahnee-dining-room" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <figure className="eat-photo">
            <ResponsiveImage image="img/ahwahnee-dining-room.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 600px" style={{ aspectRatio: "1600 / 1200" }}
              alt="The Ahwahnee dining room: a long hall of white-clothed tables under timber trusses and iron chandeliers, with tall windows along one wall" />
            <figcaption>The Ahwahnee Dining Room. Photo: Amadscientist / Wikimedia Commons (CC BY-SA 3.0)</figcaption>
          </figure>
          <div>
            <p className="hp-eyebrow">THE AHWAHNEE DINING ROOM</p>
            <h2>One room, four meals, and a dress code at dinner</h2>
            <div className="eat-prose">
              <p>
                The room is 130 feet long with a 34-foot ceiling of timber trusses, granite piers between the windows and iron chandeliers, and it is open to anyone, not just hotel guests. A room at the hotel does not hold you a table, though, and dinner fills: book on OpenTable or at 209/372-1489, and do it when you book the trip.
              </p>
            </div>
            <dl className="eat-meals">
              <div><dt>Breakfast</dt><dd>A buffet, or order from the menu. Casual.</dd></div>
              <div><dt>Lunch</dt><dd>Midday into the afternoon. Casual.</dd></div>
              <div><dt>Dinner</dt><dd>A prix fixe of five or seven courses, with wine pairings. Dress code.</dd></div>
              <div><dt>Sunday brunch</dt><dd>Runs from breakfast into the afternoon. Casual.</dd></div>
            </dl>
            <blockquote className="eat-dress">
              <p>"Long pants and a shirt with a collar, or a dress, skirt, or long pants with a blouse. Please refrain from wearing hiking attire, shorts, T-shirts, tank tops, flip-flops, and baseball caps."</p>
              <cite>The dinner dress code, as the hotel publishes it</cite>
            </blockquote>
            <div className="eat-prose">
              <p>
                That rules out the clothes most people pack for Yosemite, so bring one outfit for it. Dinner without the dress code or the price is the <strong>Ahwahnee Bar</strong> next door: cocktails, wine, appetizers and lighter plates. Afternoon tea in the lounge is for hotel guests only. The kitchen publishes a vegan menu and a children's menu. On holidays the room books separately: Thanksgiving 2026 is November 26, noon to 8 p.m., $165 for an adult and $82.50 for a child with tax and tip included, booked at 888/413-8869. <a href="/articles/bracebridge-dinner-and-vintners-holidays">The Bracebridge Dinner</a> in December is its own event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Groceries: what each store in and around the park sells. */}
      <section className="hp-wrap hp-section" id="groceries-and-supplies" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">GROCERIES AND SUPPLIES</p>
            <h2>Where to buy the sandwich makings</h2>
            <div className="eat-prose">
              <p>
                The cooler lunch this page keeps recommending needs a store, and the park has more of them than restaurants. The <strong>Village Store</strong> in Yosemite Village is the one to plan around: the park's largest stock of groceries, including meat and produce, plus camping supplies, ice, firewood and an ATM. Everything else is smaller, and several close with their season. Prices are park prices, so the big shop happens in Mariposa, Oakhurst or Groveland on the way in. Hours change with the <em>Yosemite Guide</em> edition; the <a href="/now">Park Bulletin</a> carries them.
              </p>
            </div>
          </div>
          <figure className="eat-photo">
            <ResponsiveImage image="img/yosemite-village-store.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 600px" style={{ aspectRatio: "1600 / 1200" }}
              alt="The Village Store in Yosemite Village: a timber building with a peaked roof and its name over the door, maples turning yellow in front" />
            <figcaption>The Village Store. Photo: Rennett Stowe / Wikimedia Commons (CC BY 2.0)</figcaption>
          </figure>
        </div>
        <ul className="eat-stores">
          {STORES.map(([name, where, sells, season, tone]) => (
            <li key={name} className={tone ? "is-" + tone : undefined}>
              <p className="eat-stores__where">{where}</p>
              <h3>{name}</h3>
              <p>{sells}</p>
              <p className="eat-stores__season">{season}</p>
            </li>
          ))}
        </ul>
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
                  Yosemite West is a private enclave just outside the park's southern boundary, reached through the park on Wawona Road, and it is almost all vacation rentals. The listings sell the location and skip the logistics, so guests are often caught short. A rental kitchen only helps if you bring the groceries. Shop before you arrive.
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
          <h3 className="eat-subhead eat-subhead--rule">Four more places to bring lunch to</h3>
          <ul className="eat-nofood">
            <li>
              <EventIcon name="eye" size={26} />
              <strong>Glacier Point</strong>
              <p>A gift shop and snack stand, and nothing more. It closes for the winter in late October, and the road it sits on closes with the snow. There is no designated picnic area at the point.</p>
            </li>
            <li>
              <EventIcon name="snow" size={26} />
              <strong>Badger Pass</strong>
              <p>In ski season, the Skiers Grill and, Friday to Sunday and on holidays, the Snowflake Room. The season depends on snow and does not happen every year: the area did not open in the 2024 to 2025 winter.</p>
            </li>
            <li>
              <EventIcon name="tree" size={26} />
              <strong>The Mariposa Grove</strong>
              <p>No food at the welcome plaza or in the grove. Drinking water is at the welcome plaza all year and at the arrival area in summer. The nearest food is the Wawona Store, or Fish Camp.</p>
            </li>
            <li>
              <EventIcon name="lake" size={26} />
              <strong>Hetch Hetchy</strong>
              <p>No services of any kind. Evergreen Lodge, a mile outside the Hetch Hetchy entrance, is the nearest meal.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-5-restaurants-near-yosemite-the-gateway-to" tabIndex={-1}>
        <p className="hp-eyebrow">RESTAURANTS NEAR YOSEMITE</p>
        <h2>The gateway towns, and where to eat in each</h2>
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
              <p className="eat-town__line">The first real coffee on the route, in either direction. The chamber's list adds Nicely's, Bodie Mike's BBQ, the Mono Cone and the Mono Market.</p>
              <div className="eat-picks">
                <TownPick name="Latte Da Cafe" meta="Breakfast, coffee · $ · seasonal">
                  The east-side breakfast and coffee stop, whether you're crossing Tioga Pass from Mammoth or Bishop or coming down from Lake Tahoe. Pastries are baked in house and the drip coffee is good. Park behind the building, walk in, eat outside.
                </TownPick>
                <TownPick name="Whoa Nellie Deli" meta="All day · $$ · seasonal · at the Mobil, Highway 120 and US 395">
                  A full kitchen inside the Tioga Gas Mart, at the bottom of the pass, cooking since 1996 and known for its fish tacos. It is the first real meal off Tioga Road coming east and the last one going west. Like most of Lee Vining, it keeps the pass's season.
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
              <h3>Groveland, and the two lodges near the gate</h3>
              <p className="eat-town__line">A historic main street with enough places to eat for a two-night stay, and two lodge kitchens close enough to the park to eat at after a day in it.</p>
              <div className="eat-picks">
                <TownPick name="Yosemite Restaurant, Rush Creek Lodge" meta="All three · $$$ · reservations on OpenTable">
                  1.7 miles from the Big Oak Flat entrance, about five minutes. The restaurant and the tavern beside it serve the same menu, and the lodge's general store does lattes, breakfast and trail food.
                </TownPick>
                <TownPick name="Evergreen Lodge" meta="All three · $$$ · reservations on OpenTable">
                  Off Evergreen Road, seven miles from the Big Oak Flat entrance and one from the Hetch Hetchy entrance, which makes it the meal for a Hetch Hetchy day. The tavern serves the restaurant's menu under a covered patio.
                </TownPick>
                <TownPick name="Iron Door Saloon" meta="Lunch, dinner · $$ · Main Street, Groveland">
                  A building that went up before 1852 and became a saloon in 1896, with food, live music most weekends and karaoke on Thursdays. Groveland is a long half hour from the gate, so this is a dinner for people staying in town.
                </TownPick>
              </div>
              <p className="eat-town__aside">Groveland is missing from the county list below because it's in Tuolumne County, not because there's nothing there.</p>
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

      <section className="ff-band" id="dietary-needs" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">DIETARY NEEDS</p>
          <h2>Vegan, gluten-free and allergies, kitchen by kitchen</h2>
          <p className="ff-lede">The concessioner publishes no park-wide allergen guide, so the answer lives on each kitchen's own menu. Four of them say something useful.</p>
          <ul className="ff-rules eat-diet">
            <li className="is-exception"><EventIcon name="food" size={26} /><strong>The Ahwahnee</strong><p>A separate vegan menu and a children's menu, and the dining room takes requests.</p></li>
            <li className="is-exception"><EventIcon name="food" size={26} /><strong>Pizza Deck</strong><p>Vegan cheese and a gluten-free crust, the crust in medium only, each for a few dollars more.</p></li>
            <li className="is-exception"><EventIcon name="food" size={26} /><strong>The Mountain Room</strong><p>Allergen marks on the printed menu for the major allergens, and a vegan stew. Tell the server.</p></li>
            <li className="is-exception"><EventIcon name="food" size={26} /><strong>Seven Tents</strong><p>Dishes made without gluten are marked, with a warning that the kitchen is open and cross-contact is possible.</p></li>
          </ul>
          <p className="ff-note">At the counters, Base Camp, Degnan's and the grills, ask before you order. For a serious allergy the Village Store is the fallback that lets you read every label.</p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="picnic-areas" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">PICNIC AREAS</p>
            <h2>Where the granite slab has a table</h2>
            <div className="eat-prose">
              <p>
                The park's picnic areas are first come, first served, open dawn to dusk, and come with tables, vault toilets and trash and recycling, and most have grills. Two things catch people out. Only <strong>Lower Yosemite Fall</strong> and <strong>Church Bowl</strong> have drinking water and flush toilets, so carry water to the rest. And in Yosemite Valley a grill fire is legal only between 5 and 10 p.m., inside the grill, and only when the park's fire restrictions allow it (<a href="/articles/yosemite-fire-restrictions-explained">what the restrictions mean</a>). Food stays within arm's reach the whole time; the rule is below.
              </p>
            </div>
          </div>
          <div>
            {PICNICS.map(([area, list]) => (
              <div key={area} className="eat-picnic">
                <h3 className="eat-subhead">{area}</h3>
                <ul>
                  {list.map(([name, note]) => <li key={name}><strong>{name}</strong>{note ? <span>{note}</span> : null}</li>)}
                </ul>
              </div>
            ))}
            <p className="ff-note">The Park Service lists no picnic area at Glacier Point or Hetch Hetchy.</p>
          </div>
        </div>
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
                <p>Keeps a real core open: Degnan's, Base Camp and the hotel dining rooms among them. The pizza moves inside to Seven Tents, and the Village Store and Curry Village grocery stay open.</p>
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
          <li className="is-tight"><span>Oct 12, 2026</span><strong>Housekeeping Camp store</strong><p>Closes with the camp.</p></li>
          <li className="is-tight"><span>Late October</span><strong>Village Grill, Glacier Point, Crane Flat</strong><p>The grill, the snack stand and the Crane Flat store close for the winter.</p></li>
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
            For where to base yourself, see <a href="/articles/yosemite-gateway-towns-compared">Yosemite gateway towns compared</a> and <a href="/articles/where-to-stay-in-yosemite">every place to sleep inside the park</a>. For one-day and two-day plans, see <a href="/articles/yosemite-in-one-or-two-days">One day or two in Yosemite</a>. For what a trip really costs, see <a href="/articles/yosemite-trip-cost-budget">the budget breakdown</a>.
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
                <li><a href="https://www.travelyosemite.com/dining/the-ahwahnee-dining-room" target="_blank" rel="noopener noreferrer">The Ahwahnee Dining Room, Yosemite Hospitality</a></li>
                <li><a href="https://www.travelyosemite.com/things-to-do/shopping-supplies-groceries" target="_blank" rel="noopener noreferrer">Shopping, supplies and groceries, Yosemite Hospitality</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">Yosemite Guide, September 23 to November 24, 2026, NPS</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/picnic.htm" target="_blank" rel="noopener noreferrer">Picnic areas, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/mg.htm" target="_blank" rel="noopener noreferrer">Mariposa Grove, NPS Yosemite</a></li>
                <li><a href="https://www.rushcreeklodge.com/dine/restaurant/" target="_blank" rel="noopener noreferrer">Rush Creek Lodge dining</a> and <a href="https://www.evergreenlodge.com/dine/restaurant/" target="_blank" rel="noopener noreferrer">Evergreen Lodge dining</a></li>
                <li><a href="https://www.whoanelliedeli.com/info" target="_blank" rel="noopener noreferrer">Whoa Nellie Deli</a> and <a href="https://www.leevining.com/dining" target="_blank" rel="noopener noreferrer">Lee Vining Chamber of Commerce dining list</a></li>
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
