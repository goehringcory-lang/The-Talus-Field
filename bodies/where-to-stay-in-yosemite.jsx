/* global React, EventIcon, ResponsiveImage, AffiliateNote, AvailabilityLink, LodgingCta */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// The October 2026 rebuild: every place to sleep inside the boundary, on the
// feature layout (the where-to-eat article's recipe). The catalog entry
// carries a `feature` block (data.js), so page-article.jsx draws the photo
// cover and hands this body the page's width. Sections alternate paper and
// the `ff-band` tint. The page's own pieces are the `.wts-*` layer in
// styles.css; the park map, the prose, the filter chips and the table reuse
// the `.eat-*` pieces from the dining article rather than restating them.
//
// Five rules hold it up.
//   1. Every fact is from the concessioner's property pages, the Park
//      Service, or Yosemite Conservancy, read October 1, 2026 and listed under
//      Sources. History that only secondary sources carry (room counts, the
//      2008 rockfall's unit numbers, the 2016 to 2019 names) is said as
//      history, never as a current booking fact.
//   2. The section ids sec-0 to sec-6 are the anchors the old article
//      generated at runtime, pinned so /stay's "more" links and the deep
//      links search carries keep landing on the same property.
//   3. In-park rooms book through the concessioner, never through an
//      affiliate link, as on /stay. The only affiliate links are the gateway
//      searches for a reader who finds the park full.
//   4. Dated facts (2026 season dates, the lottery windows) carry their year.
//      The evergreen refresh rolls them; nothing here reads the clock.
//   5. The map is the National Park Service's own (/stay's crop of
//      img/nps-yosemite-park-map.jpg at +0+560, 1760 x 1410); pins come from
//      the park map's linear fit (longitude -119.90668 + 0.00046877 per
//      pixel, latitude 38.20044 - 0.00037108 per pixel, then less 560).
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["where-to-stay-in-yosemite"] = function WhereToStayInYosemiteBody() {
  const TY = "https://www.travelyosemite.com/lodging/";

  const TOC = [
    ["#inside-the-boundary", "Every bed"],
    ["#sec-0-the-ahwahnee-the-splurge-and-when-it-ear", "The Ahwahnee"],
    ["#sec-1-yosemite-valley-lodge-the-location-is-th", "Valley Lodge"],
    ["#sec-2-curry-village-canvas-bear-boxes-and-prox", "Curry Village"],
    ["#sec-3-housekeeping-camp-the-sleeper-pick", "Housekeeping Camp"],
    ["#sec-4-the-high-country-white-wolf-and-tuolumne", "Tuolumne and White Wolf"],
    ["#high-sierra-camps", "High Sierra Camps"],
    ["#wawona-hotel", "The Wawona Hotel"],
    ["#winter-huts", "Winter huts"],
    ["#private-homes", "Private cabins"],
    ["#sec-5-how-the-booking-actually-works", "Booking"],
    ["#compare", "The table"],
    ["#where-to-stay-questions", "Questions"],
  ];

  const FAQ = [
    ["How do you book lodging inside Yosemite?", "Every hotel, lodge and tent cabin inside the park is run by one concessioner, Yosemite Hospitality, and books through travelyosemite.com. Reservations open 366 days in advance on a rolling basis. The first night is charged at booking and refunded if you cancel at least seven days before arrival. The Park Service says cancelled rooms reappear in the morning, so check then."],
    ["Is the Ahwahnee worth the price?", "It costs several times the rate of Yosemite Valley Lodge, and the rooms themselves are nice hotel rooms, not extraordinary ones. The money buys the public spaces, the address under the Royal Arches, and the occasion. It is worth it for a milestone trip; if you will only use the room to sleep, the Lodge delivers the same park for a fraction of the cost."],
    ["What is the cheapest roofed place to sleep in Yosemite Valley?", "The canvas tent cabins at Curry Village. They have real beds but no plumbing, the showers and bathrooms are shared, canvas walls carry every sound, and everything with a scent goes in the steel bear locker outside. The unheated tents have a light and no outlet; the heated ones have one outlet and heat from the Tuesday after Labor Day to the Friday before Memorial Day."],
    ["What is Housekeeping Camp?", "266 three-walled units with canvas roofs on the Merced River in Yosemite Valley. Each sleeps up to six on a bunk bed and a double bed, and has a covered patio, a table, a fire ring and a bear locker. Bring bedding or rent a bed pack. It runs spring to fall: April 3 to October 12 in 2026. It is the only Valley lodging where you can cook over a fire, between 5 and 10 p.m."],
    ["Is the Wawona Hotel open?", "No. It has been closed since December 2, 2024, for a condition assessment the Park Service ordered after a roof replacement turned up problems, and every building in the complex is closed. There is no reopening date."],
    ["Is White Wolf Lodge open?", "No. The Park Service ordered it closed for the 2026 season because of severely damaged sewer lines, and no reopening date has been announced. Tuolumne Meadows Lodge is the high country's tent-cabin option; its 2026 season ran June 5 to September 13."],
    ["Can I bring my dog to lodging in Yosemite?", "Not to the concessioner's lodging: the Ahwahnee, Yosemite Valley Lodge, Curry Village, Housekeeping Camp and Tuolumne Meadows Lodge allow service animals only. The Redwoods in Yosemite, private cabins in Wawona inside the park, offers pet-friendly cabins."],
    ["What if Yosemite lodging is sold out for my dates?", "Rooms come back. Cancellations reappear every morning, and there is a wave of them in the final weeks before any date. Check daily in the four to six weeks before the trip. If nothing turns up, El Portal on Highway 140 is the nearest gateway with rooms, 25 to 35 minutes from the Valley."],
    ["When is it easiest to get a room inside Yosemite?", "Winter. The Ahwahnee, Yosemite Valley Lodge and a reduced Curry Village run all year, rates drop, and midweek availability in January is far better than in July. The concessioner's winter offers put the floor at the Ahwahnee from $389, the Lodge from $172 and Curry Village from $95 a night on select dates."],
    ["Is Yosemite West inside the park?", "No. Yosemite West is a private enclave of vacation homes just outside the park's southern boundary, reached through the park on Wawona Road. It has no restaurant, store, gas station or shuttle."],
  ];

  // ── The map: where each bed is ────────────────────────────────────────────
  // Tones reuse the dining map's key: full (year-round), seasonal (summer
  // only), store (lottery: the camps and the huts), none (closed), town (a
  // private rental). Crop pixels, from the fit in rule 5.
  const MAP_W = 1760, MAP_H = 1410;
  const SPOTS = [
    { at: [686, 659], side: "t", tone: "full", name: "Yosemite Valley", note: "Four properties, three year-round" },
    { at: [710, 706], side: "b", tone: "store", name: "Glacier Point Ski Hut", note: "Winter, guided" },
    { at: [768, 969], side: "r", tone: "store", name: "Ostrander Ski Hut", note: "Winter lottery" },
    { at: [1205, 318], side: "r", tone: "seasonal", name: "Tuolumne Meadows Lodge", note: "June to September" },
    { at: [548, 331], side: "t", tone: "none", name: "White Wolf Lodge", note: "Closed" },
    { at: [1043, 222], side: "u", tone: "store", name: "Glen Aulin", note: "High Sierra Camp" },
    { at: [886, 402], side: "l", tone: "store", name: "May Lake", note: "High Sierra Camp" },
    { at: [1000, 499], side: "l", tone: "store", name: "Sunrise", note: "High Sierra Camp" },
    { at: [1199, 530], side: "r", tone: "store", name: "Vogelsang", note: "High Sierra Camp" },
    { at: [1072, 684], side: "r", tone: "store", name: "Merced Lake", note: "High Sierra Camp" },
    { at: [537, 1230], side: "l", tone: "none", name: "Wawona Hotel", note: "Closed" },
    { at: [563, 1211], side: "r", tone: "town", name: "The Redwoods", note: "Private cabins" },
  ];
  const TONES = [
    ["full", "Year-round"],
    ["seasonal", "Summer only"],
    ["store", "By lottery or guided trip"],
    ["none", "Closed"],
    ["town", "Private rentals"],
  ];
  const pct = (x, y) => ({ left: (x / MAP_W) * 100 + "%", top: (y / MAP_H) * 100 + "%" });

  function LodgingMap() {
    return (
      <figure className="eat-map eat-map--park">
        <div className="eat-map__frame">
          <ResponsiveImage image="img/nps-yosemite-stay-map.jpg" className="eat-map__img" sizes="(max-width: 880px) 100vw, 620px" style={{ aspectRatio: "1760 / 1410" }}
            alt="National Park Service map of Yosemite, cropped from Hetch Hetchy south to the Mariposa Grove, marking every place to sleep inside the park: the four Yosemite Valley properties, Tuolumne Meadows Lodge, the closed White Wolf Lodge and Wawona Hotel, the five High Sierra Camps, the Glacier Point and Ostrander ski huts, and the private cabins of The Redwoods in Wawona." />
          <div className="eat-map__layer" aria-hidden="true">
            {SPOTS.map((s) => (
              <span key={s.name} className={"eat-spot eat-spot--" + s.side + " is-" + s.tone} style={pct(s.at[0], s.at[1])}>
                <i /><b>{s.name}</b><small>{s.note}</small>
              </span>
            ))}
          </div>
        </div>
        <figcaption>
          <ul className="eat-key">
            {TONES.map(([t, label]) => <li key={t} className={"is-" + t}>{label}</li>)}
          </ul>
          <span>Map: National Park Service (public domain), cropped. Camp pins are approximate.</span>
        </figcaption>
      </figure>
    );
  }

  // ── The status board ──────────────────────────────────────────────────────
  // [name, where, status, season line, section anchor]. `status` picks the
  // chip: open, seasonal, lottery, closed, private.
  const BOARD = [
    ["The Ahwahnee", "Yosemite Valley", "open", "Year-round", "#sec-0-the-ahwahnee-the-splurge-and-when-it-ear"],
    ["Yosemite Valley Lodge", "Yosemite Valley", "open", "Year-round", "#sec-1-yosemite-valley-lodge-the-location-is-th"],
    ["Curry Village", "Yosemite Valley", "open", "Year-round, reduced in winter", "#sec-2-curry-village-canvas-bear-boxes-and-prox"],
    ["Housekeeping Camp", "Yosemite Valley", "seasonal", "April 3 to October 12, 2026", "#sec-3-housekeeping-camp-the-sleeper-pick"],
    ["Tuolumne Meadows Lodge", "Tioga Road, 8,700 ft", "seasonal", "June 5 to September 13, 2026", "#sec-4-the-high-country-white-wolf-and-tuolumne"],
    ["High Sierra Camps", "The backcountry", "lottery", "July 3 to September 9, 2026; three of five ran in 2025", "#high-sierra-camps"],
    ["Ostrander Ski Hut", "Off Glacier Point Road, 8,500 ft", "lottery", "December 23, 2026 to April 4, 2027", "#winter-huts"],
    ["Glacier Point Ski Hut", "Glacier Point", "closed", "Did not open in winter 2025 to 2026", "#winter-huts"],
    ["White Wolf Lodge", "Tioga Road, 8,000 ft", "closed", "Closed for the 2026 season", "#sec-4-the-high-country-white-wolf-and-tuolumne"],
    ["Wawona Hotel", "Wawona", "closed", "Closed since December 2, 2024", "#wawona-hotel"],
    ["The Redwoods in Yosemite", "Wawona", "private", "Private cabins, booked direct", "#private-homes"],
  ];
  const STATUS = { open: "Open", seasonal: "Seasonal", lottery: "Lottery", closed: "Closed", private: "Private" };

  // ── The comparison table, as data ─────────────────────────────────────────
  // [name, group, where, beds, bath, heat and power, food on site, price].
  // `price` restates the section's own words; nothing here is a rate.
  const TABLE = [
    ["The Ahwahnee", "valley", "Valley, east end", "Hotel rooms, cottages, suites", "Private", "Full", "Dining room, bar", "The most in the park"],
    ["Yosemite Valley Lodge", "valley", "Valley, by Yosemite Falls", "Hotel, bunk and family rooms", "Private", "Full", "Base Camp Eatery, Mountain Room", "Mid-range"],
    ["Curry Village: Stoneman rooms", "valley", "Valley, below Glacier Point", "Motel rooms", "Private", "Full", "Pizza deck, pavilion, taqueria", "Low to mid"],
    ["Curry Village: cabins", "valley", "Valley, below Glacier Point", "Wood cabins", "Private, or shared", "Full", "Pizza deck, pavilion, taqueria", "Low to mid"],
    ["Curry Village: tent cabins", "valley", "Valley, below Glacier Point", "Canvas tents, real beds", "Shared", "Heated tents have one outlet", "Pizza deck, pavilion, taqueria", "The lowest roof in the Valley"],
    ["Housekeeping Camp", "valley", "Valley, on the Merced", "Bunk and double bed, sleeps 6", "Shared", "Lights and outlets", "Your own, over the fire ring", "Low, plus bedding"],
    ["Tuolumne Meadows Lodge", "high", "Tioga Road, 8,700 ft", "Canvas tents, up to 4", "Shared", "Wood stove, no electricity", "Dining tent, by reservation", "Modest"],
    ["High Sierra Camps", "high", "Backcountry, on foot", "Canvas tents", "Shared", "Varies by camp", "Dinner and breakfast included", "Per person, meals included"],
    ["Ostrander Ski Hut", "high", "Ski in, 10 to 12 miles", "Bunks", "Shared", "Hut", "Bring your own", "By lottery"],
    ["The Redwoods in Yosemite", "private", "Wawona", "Private cabins and homes", "Private", "Full", "Your own kitchen", "Varies by cabin"],
  ];
  const FILTERS = [["all", "Everything"], ["valley", "Yosemite Valley"], ["high", "High country"], ["private", "Private"]];
  const [group, setGroup] = React.useState("all");
  const rows = TABLE.filter((r) => group === "all" || r[1] === group);

  // A key-value strip of one property's facts.
  function Facts({ items }) {
    return (
      <dl className="wts-facts">
        {items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    );
  }
  function Photo({ image, ratio, alt, credit, focus, sizes }) {
    return (
      <figure className="wts-photo">
        <ResponsiveImage image={image} alt={alt} sizes={sizes || "(max-width: 880px) calc(100vw - 40px), 600px"} style={{ aspectRatio: ratio, objectPosition: focus || undefined }} />
        <figcaption>{credit}</figcaption>
      </figure>
    );
  }

  return (
    <div className="eat-feature wts-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="bed" /><dt>Bookable all year</dt><dd>Three properties, all in the Valley</dd></div>
          <div><EventIcon name="calendar" /><dt>Reservations open</dt><dd>366 days ahead, on a rolling basis</dd></div>
          <div><EventIcon name="ticket" /><dt>At booking</dt><dd>First night due, refundable to 7 days out</dd></div>
          <div><EventIcon name="clock" /><dt>Check in, check out</dt><dd>4 p.m. and 11 a.m., everywhere</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the answer, and the ranking beside it. */}
      <section className="hp-wrap hp-section eat-open">
        <div className="ff-split">
          <div className="eat-prose">
            <p className="dropcap">
              The question I field more than any other, after twenty seasons of living and working in this park, is some version of "where should we stay?" My first answer is that <strong>staying inside the park changes the trip</strong> in a way no other single decision does. The people sleeping in the Valley are standing under Yosemite Falls at seven in the morning with the mist still hanging and nobody around. The people sleeping in a gateway town are, at that same moment, sitting in the entrance line. Only one group is in the park for the first two hours and the last two hours of the day, which are its best.
            </p>
            <p>
              One piece of mechanics first: every hotel, lodge and tent cabin inside Yosemite is run by a single <strong>park concessioner</strong>, Yosemite Hospitality, and all of it books through one website, <a href={TY} target="_blank" rel="noopener noreferrer">travelyosemite.com</a>. There is no chain hotel inside the park. The exceptions are a lottery for the backcountry camps, a lottery for a ski hut run by Yosemite Conservancy, and a set of private cabins on old land claims in Wawona.
            </p>
            <p>
              Below: every bed inside the boundary on one map, each property in turn with what the room actually has, the two that are closed and why, how the booking works, and a table.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="bed" /> The short version</p>
            <ul>
              <li>A first trip: Yosemite Valley Lodge.</li>
              <li>A family that half-camps: Housekeeping Camp.</li>
              <li>Hikers on a budget: a Curry Village tent.</li>
              <li>An occasion: the Ahwahnee.</li>
              <li>A high-country trip: Tuolumne Meadows Lodge, in summer.</li>
            </ul>
            <a className="eat-short__link" href={TY} target="_blank" rel="noopener noreferrer">Check in-park rooms at Travel Yosemite ↗</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="inside-the-boundary" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">EVERY BED INSIDE THE BOUNDARY</p>
              <h2>Eleven places, and three of them are shut</h2>
              <div className="eat-prose">
                <p>
                  Four of the park's properties are in <strong>Yosemite Valley</strong>, and three of those run all year. The rest are seasonal, lotteried or closed. <strong>Tuolumne Meadows Lodge</strong> runs for about three summer months. The <strong>High Sierra Camps</strong> and the <strong>Ostrander Ski Hut</strong> go by lottery. The <strong>Wawona Hotel</strong> and <strong>White Wolf Lodge</strong> are closed with no reopening date, and the Glacier Point Ski Hut did not open last winter.
                </p>
              </div>
            </div>
            <LodgingMap />
          </div>
          <ul className="wts-board">
            {BOARD.map(([name, where, status, season, href]) => (
              <li key={name} className={"is-" + status}>
                <span className={"wts-status wts-status--" + status}>{STATUS[status]}</span>
                <a href={href}><strong>{name}</strong></a>
                <span className="wts-board__where">{where}</span>
                <span className="wts-board__season">{season}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-0-the-ahwahnee-the-splurge-and-when-it-ear" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE AHWAHNEE</p>
            <h2>The splurge, and when it earns it</h2>
            <div className="eat-prose">
              <p>
                <strong>The Ahwahnee</strong> opened in 1927, designed by Gilbert Stanley Underwood, and is a <strong>National Historic Landmark</strong>, a federal designation. The Great Lounge with its floor-to-ceiling windows, the stenciled beams, the stone fireplaces, the dining room with its 34-foot ceiling: this is one of the great park lodges in the national system, in the same conversation as Old Faithful Inn and the Grand Canyon's El Tovar. The building sits under the Royal Arches at the quiet east end of the Valley, and at dusk Half Dome turns pink above the meadow outside the front door. The Park Service calls it the park's only luxury hotel.
              </p>
              <p>
                The rooms come in three kinds: rooms in the main building, in standard, classic and view grades; cottages in the trees beside it; and a set of named suites. They are nice hotel rooms, not extraordinary ones, and you are paying <strong>several times the rate of Yosemite Valley Lodge</strong> for them. What the money buys is the public spaces, the address, and the feeling of the place: afternoon light in the Great Lounge, a drink by the fire after a day on the trails, dinner in a dining room that requires you to look up. The outdoor pool is heated and open all year.
              </p>
              <p>
                If you will use those things, if you are marking an anniversary or a retirement or <a href="/articles/where-to-propose-in-yosemite">a once-in-a-lifetime trip</a>, the Ahwahnee is worth it. If you plan to leave at dawn and return at dark, it is not, and the Lodge will make you just as happy for a fraction of the cost. The compromise I recommend constantly: stay somewhere cheaper and come to the Ahwahnee for <a href="/articles/where-to-eat-yosemite#ahwahnee-dining-room">dinner or a drink</a>. The Great Lounge does not check room keys. A hotel reservation does not hold you a dinner table, though; book that separately. From 2016 to 2019 the hotel was called the Majestic Yosemite Hotel while the old names were tied up in a dispute with the previous concessioner, which is why some guidebooks and old reviews use it.
              </p>
            </div>
            <Facts items={[
              ["Season", "Year-round"],
              ["Rooms", "Main building, cottages, suites; accessible rooms in several grades"],
              ["Pool", "Outdoor, heated, all year, 9 a.m. to dusk"],
              ["Wi-Fi", "Hotel guests only, and limited"],
              ["On site", "Dining room, bar, gift shop"],
            ]} />
          </div>
          <div className="wts-photos">
            <Photo image="img/ahwahnee-hotel.jpg" ratio="1600 / 1200" alt="The Ahwahnee in winter, its stone and timber front below the Valley's north wall" credit="The Ahwahnee. Photo: Chris Dunstan / Wikimedia Commons (public domain)" />
            <Photo image="img/ahwahnee-great-lounge.jpg" ratio="1600 / 1200" alt="The Ahwahnee's Great Lounge from above: chandeliers, tall leaded windows, and sofas around low tables" credit="The Great Lounge. Photo: David Berry / Wikimedia Commons (CC BY 2.0)" />
          </div>
        </div>
      </section>

      <section className="ff-band" id="sec-1-yosemite-valley-lodge-the-location-is-th" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <Photo image="img/yosemite-valley-lodge-entrance.jpg" ratio="1600 / 1200" alt="The front entrance of Yosemite Valley Lodge under tall pines" credit="Yosemite Valley Lodge. Photo: Rennett Stowe / Wikimedia Commons (CC BY 2.0)" />
          <div>
            <p className="hp-eyebrow">YOSEMITE VALLEY LODGE</p>
            <h2>The location is the product</h2>
            <div className="eat-prose">
              <p>
                <strong>Yosemite Valley Lodge</strong> is the park's standard hotel: 245 rooms in low-slung motel-style buildings, including bunk rooms and family rooms, clean and functional, with a food court, a steakhouse and a pool in summer. Nobody has ever described the architecture as memorable. What it has instead is a position directly across the road from <strong>Lower Yosemite Fall</strong>, on the shuttle loop, walking distance to the falls trail and an easy ride to everything else. In spring you can hear the waterfall from the grounds at night.
              </p>
              <blockquote className="wts-quote">You are not buying the room. You are buying the two hours a day the day-trippers never see.</blockquote>
              <p>
                For most first-time visitors with a hotel budget, this is the answer, and it books out accordingly. Among the roofed options it ranks first for value: not the cheapest or the grandest, but the best balance of location, comfort and price. The accessible rooms have widened doors and grab bars, and roll-in showers on request. If it is gone for your dates, El Portal is the nearest gateway, 25 to 35 minutes out, and <AvailabilityLink destination="El Portal, California" list="article_inline" slug="where-to-stay-in-yosemite" name="El Portal availability search">a search there</AvailabilityLink> shows what is left.
              </p>
            </div>
            <Facts items={[
              ["Season", "Year-round"],
              ["Pool", "Memorial Day to Labor Day, weather permitting"],
              ["On site", "Base Camp Eatery, the Mountain Room, Starbucks, bike rental in season, a tour desk"],
              ["Free for guests", "Parking and Wi-Fi"],
            ]} />
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-2-curry-village-canvas-bear-boxes-and-prox" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">CURRY VILLAGE</p>
            <h2>Canvas, bear lockers, and proximity</h2>
            <div className="eat-prose">
              <p>
                <strong>Curry Village</strong> has been putting visitors in tents at the base of Glacier Point since 1899. Today it is a dense grid of <strong>canvas tent cabins</strong> (wood frame, canvas walls and roof, real beds, no plumbing), a smaller number of wood cabins, some with a private bath, and the <strong>Stoneman</strong> rooms, motel rooms with their own bathrooms. The tents are the cheapest roofed beds in Yosemite Valley, and the tradeoffs follow from the canvas. You will hear your neighbors, and they will hear you. Quiet hours run 10 p.m. to 6 a.m. for that reason.
              </p>
              <p>
                The heat question decides the tent. An <strong>unheated tent</strong> has an electric light and no outlet, and it is cold in spring and fall. A <strong>heated tent</strong> has one outlet and heat from the Tuesday after Labor Day to the Friday before Memorial Day, and the heated ones go first. The shower houses are open around the clock. Wi-Fi is in the guest lounge, not the tents.
              </p>
              <p>
                And you must use the <strong>bear locker</strong>. Every tent has a steel food locker outside, and everything with a scent, food, toothpaste, sunscreen, the gum in your daypack, goes in it, every time, because canvas is not a barrier a bear respects. Staff repeat this rule at check-in.
              </p>
              <p>
                What you get in exchange is the best cheap address in the Valley: shuttle stop, <a href="/articles/where-to-eat-yosemite#sec-1-where-to-eat-in-yosemite-valley">pizza deck</a>, mountaineering shop, the <a href="/articles/mist-trail-the-real-guide">Mist Trail</a> trailhead a short walk away, and Half Dome over the whole compound. Families and hikers who treat the tent as a place to sleep tend to love it. People expecting a quiet hotel at a discount write the bad reviews. Know which one you are before you book.
              </p>
              <p>
                Two pieces of history explain the place. In October 2008 a rockfall off Glacier Point hit the back of the village, and the park closed the units under the cliff for good, roughly a third of the camp, which is why the grid stops where it does. From 2016 to 2019 it was called Half Dome Village, during the same naming dispute that renamed the Ahwahnee. The outdoor ice rink, skated since 1928, is closed until the 2026 to 2027 season, with no opening date set.
              </p>
            </div>
          </div>
          <div>
            <Photo image="img/curry-village.jpg" ratio="1600 / 1072" focus="50% 60%" alt="Wooden cabins at Curry Village among pines and granite boulders" credit="Curry Village cabins. Photo: US National Park Service / Wikimedia Commons (public domain)" />
            <table className="wts-units">
              <caption>The four kinds of room at Curry Village</caption>
              <thead>
                <tr><th scope="col">Room</th><th scope="col">Bath</th><th scope="col">Power and heat</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">Unheated tent</th><td>Shared</td><td>A light, no outlet, no heat</td></tr>
                <tr><th scope="row">Heated tent</th><td>Shared</td><td>One outlet; heat from September to May</td></tr>
                <tr><th scope="row">Cabin</th><td>Private or shared</td><td>Full</td></tr>
                <tr><th scope="row">Stoneman room</th><td>Private</td><td>Full; one to three double beds</td></tr>
              </tbody>
            </table>
            <Facts items={[
              ["Season", "Year-round, reduced in winter"],
              ["Pool", "Memorial Day to Labor Day, 11 a.m. to 6 p.m."],
              ["Bikes", "Rental, spring to fall"],
            ]} />
          </div>
        </div>
      </section>

      <section className="ff-band" id="sec-3-housekeeping-camp-the-sleeper-pick" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <Photo image="img/housekeeping-camp-yosemite.jpg" ratio="1600 / 1071" alt="A Housekeeping Camp unit: concrete walls, a canvas roof over the patio, a table and folding chairs, pines behind" credit="A Housekeeping Camp unit. Photo: advencap / Wikimedia Commons (CC BY-SA 2.0)" />
          <div>
            <p className="hp-eyebrow">HOUSEKEEPING CAMP</p>
            <h2>The sleeper pick</h2>
            <div className="eat-prose">
              <p>
                <strong>Housekeeping Camp</strong> is the option almost nobody outside of returning families has heard of, and it is the one I recommend most often to people who want to half-camp. Its 266 units are <strong>three-walled concrete structures</strong> on the bank of the <strong>Merced River</strong>: concrete on three sides, a canvas roof, a curtain across the fourth wall, a bunk bed and a double bed inside, electric lights and an outlet, and outside a covered patio with a table, a fire ring and a bear locker. A unit sleeps up to six, with room for two extra cots. You bring bedding, or rent a <strong>bed pack</strong> at the office: $15 a night for a double, $9 for a single.
              </p>
              <p>
                It is austere, but you can cook your own meals over a fire, which no other lodging in the Valley allows (fires between 5 and 10 p.m.), the river beach is steps away for the hot afternoons, and the place feels like a family summer camp. The camp has the Valley's laundromat and a shower house with soap and towels. For a family of four on a budget who would otherwise be choosing between a motel outside the park and <a href="/articles/yosemite-camping-complete-guide">a campsite they failed to win</a>, Housekeeping Camp splits the difference: camping's economics and campfires with a real bed and no tent to pitch.
              </p>
            </div>
            <Facts items={[
              ["Season", "April 3 to October 12, 2026"],
              ["Showers", "7 a.m. to 10 p.m."],
              ["Laundry", "8 a.m. to 10 p.m."],
              ["Store", "Groceries, snacks and camp supplies, closes with the camp"],
            ]} />
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-4-the-high-country-white-wolf-and-tuolumne" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE HIGH COUNTRY: TUOLUMNE AND WHITE WOLF</p>
            <h2>One tent camp open, one closed</h2>
            <div className="eat-prose">
              <p>
                <strong>Tuolumne Meadows Lodge</strong> is 69 canvas tent cabins at 8,700 feet, near the meadows and the Dana Fork of the Tuolumne River, about 50 miles from the Valley. Each tent has a wood stove with free firewood and no electricity (a solar lantern is provided), sleeps up to four, and comes with sheets, pillows and towels. Showers and restrooms are shared. Dinner is in the riverside dining tent, and dinner reservations are required and taken only in person at the lodge. Its 2026 season ran June 5 to September 13, conditions permitting, which means snow decides the opening and the fall decides the close. A night up here under that sky is one of the best sleeps the park sells.
              </p>
              <p>
                <strong>White Wolf Lodge</strong>, off Tioga Road at 8,000 feet, is closed. The Park Service ordered it shut for the 2026 season because of severely damaged sewer lines, and has not announced a reopening. It was 24 canvas tents and four wood cabins with private baths, about 30 miles from the Valley. The campground beside it stayed open without drinking water.
              </p>
              <p>
                Neither is a base for a Valley trip; the Valley is an hour and a half or more away. They are bases for the high country itself. <a href="/articles/tuolumne-meadows-in-a-day">The Tuolumne Meadows day guide</a> and <a href="/articles/cathedral-lakes-day-hike">the Cathedral Lakes hike</a> are the trip a night at Tuolumne suits. If the lodge is out of season or full, Lee Vining is 30 minutes from the meadows, over Tioga Pass.
              </p>
            </div>
          </div>
          <div>
            <Photo image="img/tuolumne-meadows-lembert-dome.jpg" ratio="1600 / 1067" alt="Lembert Dome above Tuolumne Meadows, with hikers on the granite in the foreground" credit="Lembert Dome, Tuolumne Meadows. Photo: Pacific Southwest Region USFWS / Wikimedia Commons (public domain)" />
            <div className="wts-closed">
              <p className="wts-closed__head"><EventIcon name="no" size={22} /> White Wolf Lodge</p>
              <p>Closed for the 2026 season by Park Service order: damaged sewer lines. No reopening date.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ff-band" id="high-sierra-camps" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <Photo image="img/glen-aulin-tent-cabin.jpg" ratio="1600 / 1200" alt="A white canvas tent cabin at Glen Aulin High Sierra Camp, with a wood stovepipe, among lodgepole pines and granite" credit="A tent cabin at Glen Aulin. Photo: Lela Getzler / Wikimedia Commons (CC BY 2.0)" />
          <div>
            <p className="hp-eyebrow">THE HIGH SIERRA CAMPS</p>
            <h2>A bed and dinner, six to ten miles from the road</h2>
            <div className="eat-prose">
              <p>
                Five tent camps sit in the backcountry above Tuolumne, six to ten miles apart on foot: <strong>Glen Aulin</strong>, <strong>May Lake</strong>, <strong>Sunrise</strong>, <strong>Vogelsang</strong> at about 10,200 feet and <strong>Merced Lake</strong> at about 7,300. You walk in with a daypack instead of a tent and a stove; the camp has the canvas tent, the bed, dinner and breakfast. A box lunch is extra ($20 for an adult and $10 for a child, cash only). There are unguided stays and guided trips of five or seven days, which run $1,403 for an adult and $970 for a child with lodging, meals and the guide.
              </p>
              <p>
                Two caveats. The camps do not all open: in 2025 only Glen Aulin, May Lake and Sunrise operated, and Vogelsang and Merced Lake stayed closed. And they go by <strong>lottery</strong>, not by the 366-day window. The 2026 season, July 3 to September 9, is sold out; the concessioner says the 2027 lottery opens in fall 2026. Winners are told by email and have seven days to pay. If you want a backcountry night and lose, <a href="/articles/yosemite-wilderness-permits-guide">a wilderness permit</a> and your own tent is the other way in.
              </p>
            </div>
            <a className="ff-ghost wts-ghost" href="https://www.travelyosemite.com/lodging/high-sierra-camps/high-sierra-camp-lottery" target="_blank" rel="noopener noreferrer">The High Sierra Camp lottery ↗</a>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="wawona-hotel" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE WAWONA HOTEL</p>
            <h2>Closed, with no date to reopen</h2>
            <div className="eat-prose">
              <p>
                The <strong>Wawona Hotel</strong>, near the South Entrance and the Mariposa Grove, has been <strong>closed since December 2, 2024</strong>. A roof replacement turned up problems, and the Park Service ordered a comprehensive condition assessment of the buildings. Every building in the complex is closed to the public, the main building, the cottages and the pool included, and there is no anticipated reopening date. The park's printed guide calls it closed for renovation. Either way, it is not bookable, and its dining room is closed with it.
              </p>
              <p>
                It is a loss worth knowing about. The site has housed travelers since 1856, when it was a stage stop; the main building, with its white verandas, went up in 1879, and the hotel is a National Historic Landmark. From 2016 to 2019 it was called Big Trees Lodge. With it closed there is no concessioner bed on the Highway 41 side of the park, which puts more pressure on Fish Camp and Oakhurst in summer (<a href="/articles/yosemite-gateway-towns-compared">the gateway towns compared</a>) and makes the private cabins below the only in-park beds near the grove.
              </p>
            </div>
            <div className="wts-closed">
              <p className="wts-closed__head"><EventIcon name="no" size={22} /> Wawona Hotel</p>
              <p>Closed since December 2, 2024, for a condition assessment. No reopening date. Check the <a href="https://www.nps.gov/places/000/wawona-hotel.htm" target="_blank" rel="noopener noreferrer">Park Service notice</a> for news.</p>
            </div>
          </div>
          <Photo image="img/wawona-hotel.jpg" ratio="1600 / 1032" alt="A white two-story Wawona Hotel building wrapped in verandas, behind a lawn and an oak" credit="The Wawona Hotel. Photo: Rennett Stowe / Wikimedia Commons (CC BY 2.0)" />
        </div>
      </section>

      <section className="ff-band" id="winter-huts" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">WINTER HUTS</p>
          <h2>Two huts you ski to, one of them dark</h2>
          <div className="wts-huts">
            <article className="ff-inpark">
              <p className="hp-eyebrow">YOSEMITE CONSERVANCY · BY LOTTERY</p>
              <h3>Ostrander Ski Hut</h3>
              <p>A stone hut at 8,500 feet above Ostrander Lake, ten to twelve or more miles each way on skis or snowshoes with 2,500 feet of climbing. Yosemite Conservancy runs it, not the concessioner, and the space goes by lottery.</p>
              <dl>
                <div><dt>Season</dt><dd>December 23, 2026 to April 4, 2027, subject to change</dd></div>
                <div><dt>Lottery</dt><dd>October 12 to 18, 2026; one application a person, up to ten dates</dd></div>
                <div><dt>Results</dt><dd>By October 23; payment due December 1</dd></div>
                <div><dt>Leftovers</dt><dd>First come, from 9 a.m. December 1, 2026</dd></div>
              </dl>
              <a className="ff-ghost" href="https://yosemite.org/experience/ostrander-ski-hut/" target="_blank" rel="noopener noreferrer">Ostrander at Yosemite Conservancy ↗</a>
            </article>
            <article className="ff-inpark">
              <p className="hp-eyebrow">THE CONCESSIONER · GUIDED</p>
              <h3>Glacier Point Ski Hut</h3>
              <p>A guided overnight: a 10.5-mile ski in to a hut that sleeps up to 20, minimum age 14 with an adult. It did not open for the 2025 to 2026 season because it had no power, and nothing has been announced for this winter.</p>
              <a className="ff-ghost" href="https://www.travelyosemite.com/lodging/glacier-point-ski-hut/" target="_blank" rel="noopener noreferrer">Glacier Point Ski Hut ↗</a>
            </article>
          </div>
          <p className="ff-note">Both routes run through the Glacier Point Road area. Check the park's <a href="https://www.nps.gov/yose/learn/management/closures.htm" target="_blank" rel="noopener noreferrer">closures page</a> before you apply and again before you go.</p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="private-homes" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">PRIVATE CABINS INSIDE THE PARK</p>
            <h2>Wawona's cabins, and the enclave that is not in the park</h2>
            <div className="eat-prose">
              <p>
                Parts of Wawona are private inholdings, land that stayed in private hands when the park took in the area, and on them sits <strong>The Redwoods in Yosemite</strong>: more than 120 cabins and homes on Chilnualna Falls Road, rented through the company's own site rather than the concessioner. You get a kitchen, which matters here, because the nearest groceries are the <a href="/articles/where-to-eat-yosemite#groceries-and-supplies">Wawona Store</a> and the nearest restaurants are in Fish Camp. It is also the one in-park lodging with pet-friendly cabins; the concessioner's properties take service animals only. With the hotel closed, it is the only bed inside the boundary near the <a href="/articles/mariposa-grove-how-to-visit">Mariposa Grove</a>.
              </p>
              <p>
                <strong>Yosemite West</strong> is the place people mistake for this. It is a private enclave of vacation homes on a ridge just <strong>outside</strong> the southern boundary, reached through the park on Wawona Road, and listings often sell it as "in Yosemite." It has no restaurant, store, gas station or shuttle, so shop before you arrive. It is a fine base for the south end. It is not inside the park.
              </p>
            </div>
          </div>
          <ul className="wts-compare">
            <li>
              <strong>The Redwoods in Yosemite</strong>
              <span>Inside the park, Wawona</span>
              <span>Private cabins, booked direct</span>
              <span>Pet-friendly cabins offered</span>
            </li>
            <li className="is-out">
              <strong>Yosemite West</strong>
              <span>Outside the boundary, off Wawona Road</span>
              <span>Private vacation homes</span>
              <span>No restaurant, store or gas</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="ff-band" id="sec-5-how-the-booking-actually-works" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">HOW THE BOOKING ACTUALLY WORKS</p>
              <h2>Book at 366 days, or check every morning</h2>
              <div className="eat-prose">
                <p>
                  Everything the concessioner runs books through travelyosemite.com, and reservations open <strong>366 days in advance</strong>, a year and a day ahead, on a rolling basis. For peak summer dates at the Valley properties, availability at the moment of release is measured in minutes. If your dates are fixed and in July, set a reminder for the morning your window opens, and book then.
                </p>
                <p>
                  Missing the release is not the end: <strong>rooms come back</strong>. Cancellations come in continuously, with a distinct wave in the final weeks before any date as plans collapse, and the Park Service says they become available in the morning. Check daily, in the morning, in the four to six weeks before your trip. I have watched people assemble three-night Valley stays in June out of one-night cancellations.
                </p>
                <p>
                  The other lever is the calendar. <strong>Winter is far easier and cheaper.</strong> The seasonal operations close, but the Ahwahnee, the Lodge and a reduced Curry Village run all year. The concessioner's winter offers put the floor at the Ahwahnee from $389, the Lodge from $172 and Curry Village from $95 a night, on select dates with holiday blackouts; <a href="/articles/yosemite-in-winter">the winter guide</a> has the codes and the dates. Entry itself needs no timed reservation in 2026 (<a href="/articles/yosemite-without-reservations-2026">what changed this year</a>).
                </p>
              </div>
            </div>
            <ol className="wts-steps">
              <li><span>366 days out</span><strong>The date opens</strong><p>On travelyosemite.com, one date at a time.</p></li>
              <li><span>At booking</span><strong>The first night is charged</strong><p>To a card, as the deposit.</p></li>
              <li><span>7 days out</span><strong>Last day for a refund</strong><p>Cancel by then and the deposit comes back.</p></li>
              <li><span>Every morning</span><strong>Cancellations reappear</strong><p>Check then, most of all in the last six weeks.</p></li>
              <li><span>Arrival</span><strong>Check in at 4 p.m.</strong><p>Every guest gets a parking pass. Check out by 11 a.m.</p></li>
            </ol>
          </div>
          <ul className="ff-rules wts-rules">
            <li><EventIcon name="no" size={26} /><strong>Pets</strong><p>Service animals only, at every concessioner property.</p></li>
            <li><EventIcon name="no" size={26} /><strong>Smoking</strong><p>Not allowed in any room or tent.</p></li>
            <li className="is-exception"><EventIcon name="car" size={26} /><strong>Parking</strong><p>A pass with the room, so the car can stay put.</p></li>
            <li className="is-exception"><EventIcon name="signal" size={26} /><strong>Wi-Fi</strong><p>Free for guests at the Lodge; limited at the Ahwahnee; the lounge only at Curry. <a href="/articles/cell-service-in-yosemite">Cell service</a> is its own story.</p></li>
          </ul>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="compare" tabIndex={-1}>
        <p className="hp-eyebrow">EVERY OPTION, SIDE BY SIDE</p>
        <h2>The table</h2>
        <div className="eat-filter" role="group" aria-label="Show lodging in">
          {FILTERS.map(([k, label]) => (
            <button key={k} type="button" className={"eat-filter__chip" + (group === k ? " is-on" : "")} aria-pressed={group === k} onClick={() => setGroup(k)}>
              {label}
            </button>
          ))}
        </div>
        <div className="eat-table-wrap">
          <table className="eat-table wts-table">
            <thead>
              <tr>
                <th scope="col">Where to sleep</th>
                <th scope="col">Where</th>
                <th scope="col">Beds</th>
                <th scope="col">Bath</th>
                <th scope="col">Heat and power</th>
                <th scope="col">Food</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, , where, beds, bath, power, food, price]) => (
                <tr key={name}>
                  <th scope="row" data-label="Where to sleep">{name}</th>
                  <td data-label="Where">{where}</td>
                  <td data-label="Beds">{beds}</td>
                  <td data-label="Bath">{bath}</td>
                  <td data-label="Heat and power">{power}</td>
                  <td data-label="Food">{food}</td>
                  <td data-label="Price">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ff-note">
          The Wawona Hotel and White Wolf Lodge are left off because they are closed. Prices are the shape, not a rate: the concessioner's rates move with the date, and its <a href="https://www.travelyosemite.com/special-offers/specials-packages" target="_blank" rel="noopener noreferrer">specials page</a> carries the current offers.
        </p>
      </section>

      <section className="ff-band" id="sec-6-the-alternative-for-honesty-s-sake" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">THE ALTERNATIVE, FOR HONESTY'S SAKE</p>
            <h2>If you can get a bed inside the boundary, get it</h2>
            <div className="eat-prose">
              <p>
                None of this means in-park lodging is the only defensible choice. If the inventory is gone or the rates are indefensible for your budget, the <a href="/articles/yosemite-gateway-towns-compared">gateway towns</a> are a real option with real tradeoffs, mostly measured in windshield time, and camping remains the cheapest way to sleep in the park if you can win a site. For the full arithmetic of what each approach does to a trip budget, I've run the numbers <a href="/articles/yosemite-trip-cost-budget">separately</a>. When you want the raw view, <AvailabilityLink destination="Yosemite National Park" list="article_inline" slug="where-to-stay-in-yosemite" name="Gateway availability search">one availability search around the park</AvailabilityLink> shows what the gateway towns have left on your dates.
              </p>
              <p>
                But rank them like this: Valley Lodge for most first-timers, Housekeeping Camp for families who half-camp, Curry Village for hikers on a budget, the Ahwahnee when the occasion justifies it, Tuolumne for people whose trip is the high country. Then set the reminder for 366 days out, and if you miss it, start checking every morning. Every option above, plus the gateway towns and Fish Camp on one page, is at <a href="/stay">where to stay</a>.
              </p>
            </div>
          </div>
          <div className="wts-cta">
            <LodgingCta
              destination="Yosemite National Park"
              heading="Before you rearrange the trip"
              note="The ranking above does not change with anyone's inventory. What it cannot tell you is what is left on your specific dates, which is a two-minute question and worth answering before you decide the park is full."
              list="article_cta"
              slug="where-to-stay-in-yosemite"
              cta="Search lodging around Yosemite →"
            />
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="where-to-stay-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Sleeping in Yosemite, answered</h2>
            <div className="eat-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.travelyosemite.com/lodging/" target="_blank" rel="noopener noreferrer">Lodging, and each property's page, Travel Yosemite (Yosemite Hospitality)</a></li>
                <li><a href="https://www.travelyosemite.com/plan/policies-information" target="_blank" rel="noopener noreferrer">Policies and information, Travel Yosemite</a></li>
                <li><a href="https://www.travelyosemite.com/lodging/high-sierra-camps/trips" target="_blank" rel="noopener noreferrer">High Sierra Camps, Travel Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/lodging.htm" target="_blank" rel="noopener noreferrer">Lodging, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/reservehelp.htm" target="_blank" rel="noopener noreferrer">Reservation help, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/places/000/wawona-hotel.htm" target="_blank" rel="noopener noreferrer">Wawona Hotel, NPS</a></li>
                <li><a href="https://yosemite.org/experience/ostrander-ski-hut/" target="_blank" rel="noopener noreferrer">Ostrander Ski Hut, Yosemite Conservancy</a></li>
                <li><a href="https://redwoodsinyosemite.com/" target="_blank" rel="noopener noreferrer">The Redwoods in Yosemite</a></li>
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
        <AffiliateNote />
      </section>
    </div>
  );
};
