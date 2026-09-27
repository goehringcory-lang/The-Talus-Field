/* global React, HpPageHead, HpHeading, HomeLink, ResponsiveImage, WebcamStrip, AvailabilityLink, HpGuideBand, HpLetter */

// =============================================================================
// THE FIREFALL — `/firefall` route. The first evergreen event page
// (MONETIZATION-IDEAS.md 4.3): a permanent URL that accrues rank year over
// year for the park's most searched seasonal spike, instead of a year-stamped
// slug that resets every season.
//
// The September 2026 redesign made it the one-stop page for the whole
// February trip, in the order a reader plans it: book early (the window's
// dates are fixed by the sun, so rooms go on the dates, not the forecast),
// where to stay, whether it is on tonight (the two webcams and the weather
// sources, read for water and cloud), the dates, parking and the walk, the
// day hour by hour, what to bring, how the park has run it, photography, and
// the questions. The deep explainer stays in the article
// (/articles/horsetail-fall-firefall), which links back here.
//
// Three rules hold it up.
//   1. Years appear in exactly two places: the history ledger (FF_HISTORY),
//      which is past fact and cannot go stale, and the one "the rules change
//      every winter" note under the parking section. Everything else is
//      written so it stays true every February. When the park posts the
//      year's plan (usually January), re-read the NPS Horsetail Fall page and
//      the news release, extend FF_HISTORY, and check the parking section and
//      FF_FAQ against it; the FAQ is mirrored in edge/seo.js.
//   2. Every road and parking fact is the park's own: the pedestrian lane on
//      Northside Drive, the no-stopping zone from Lower Yosemite Fall to El
//      Capitan Crossover, Southside's no-stopping stretch, the after-sunset
//      closure, the placard exception. Sources are in the history ledger's
//      header comment and the NPS links on the page.
//   3. One colour means one action, as on /stay: the filled `.ff-book` is only
//      ever an Expedia availability search (a town, never a property), the
//      concessioner link is the outlined `.ff-ghost`, and the Patagonia picks
//      are the small outlined `.ff-gear__link`. Every affiliate link carries a
//      placement-level aff_list (firefall_urgency, firefall_town,
//      firefall_gear, page_firefall), inventoried in ARCHITECTURE.md.
// =============================================================================

// Gateways, closest first. Drive times mirror GATEWAYS in page-stay.jsx
// (themselves the published table in yosemite-gateway-towns-compared).
const FF_TOWNS = [
  {
    id: "el-portal",
    name: "El Portal",
    dest: "El Portal, California",
    drive: "25 to 35 min",
    road: "Highway 140, the winter road",
    tier: "Goes first",
    note: "The closest bed outside the boundary, and the first to fill. A room here on the Presidents' Day weekend is rare by late autumn.",
  },
  {
    id: "mariposa",
    name: "Midpines and Mariposa",
    dest: "Mariposa, California",
    drive: "45 to 60 min",
    road: "Highway 140, rain when others get snow",
    tier: "Fills next",
    note: "The deepest inventory on the road that stays open all winter, which is why most firefall visitors end up here. Book it when you book the dates.",
  },
  {
    id: "groveland",
    name: "Groveland",
    dest: "Groveland, California",
    drive: "65 to 80 min",
    road: "Highway 120, chains common",
    tier: "Later",
    note: "Often the easiest late booking, but the approach climbs into snow. Choose it with chains in the car and a flexible morning.",
  },
  {
    id: "oakhurst",
    name: "Fish Camp and Oakhurst",
    dest: "Oakhurst, California",
    drive: "75 to 90 min",
    road: "Highway 41, over Chinquapin",
    tier: "Later",
    note: "Plenty of rooms and the longest drive. After a storm the Wawona Road is the slowest way home in the dark.",
  },
];

// Patagonia search deep links (affiliate.js wraps them). Each line is the
// reason to carry the thing, not a product pitch.
const FF_GEAR = [
  { id: "insulated-jacket", what: "An insulated jacket", why: "You stand still for an hour or two at dusk. Synthetic fill keeps working if the snow is wet.", q: "nano puff", label: "Nano Puff" },
  { id: "down-layer", what: "A down layer for the walk out", why: "The temperature drops fast once the sun leaves the floor, and the walk back is after dark.", q: "down sweater", label: "Down Sweater" },
  { id: "warm-hat", what: "A warm hat", why: "The cheapest fix for a cold evening.", q: "beanie", label: "Beanies" },
  { id: "gloves", what: "Gloves you can work a camera in", why: "Thin liners under a warm mitt, or a glove with a fold-back finger.", q: "gloves", label: "Gloves" },
  { id: "base-layer", what: "A base layer", why: "Under everything, on the storm-week evenings.", q: "capilene thermal", label: "Capilene Thermal" },
  { id: "rain-shell", what: "A rain shell", why: "A storm is what fills the fall, and February is storm season.", q: "torrentshell", label: "Torrentshell" },
  { id: "fleece", what: "A fleece midlayer", why: "For the clear evenings when a puffy is too much on the walk in.", q: "better sweater", label: "Better Sweater" },
  { id: "snow-pants", what: "Snow pants", why: "For the years with snow on the viewing area. Sitting on snow soaks through anything else.", q: "snow pants", label: "Snow pants" },
];

const FF_KIT = [
  "A folding chair or an insulated pad",
  "A headlamp, with spare batteries",
  "A thermos and food; nothing is sold at the viewing area",
  "Traction for icy pavement",
  "Waterproof boots",
  "Chains in the car and a full tank; there is no gas in Yosemite Valley",
  "A trash bag: pack everything out",
  "A telephoto lens (100mm and longer) and a tripod",
  "Camera batteries kept warm in an inside pocket",
];

// The history ledger. Sources: NPS Horsetail Fall page and the park's news
// releases (the pedestrian lane, the no-stopping zones, the after-sunset
// closure, no reservation in 2026); the 2025 weekend dates from the park's
// reservation announcement (Feb 8–9, 15–17, 22–23); the 2022 crowd figure as
// reported by SFGate; the February 2026 snow closure as reported by the
// Deseret News. The 1968 and 1973 entries follow the article body.
const FF_HISTORY = [
  ["1968", "The other firefall ends", "The Park Service stops the man-made ember fall from Glacier Point, a summer tradition since the 1870s. The name stays with the park."],
  ["1973", "Galen Rowell's photograph", "Rowell scrambles into position and shoots the lit fall on film. It becomes the reference image, and for decades February stays an appointment for photographers only."],
  ["Mid-2010s", "The crowd arrives", "Social media carries the photographs. The dates are predictable and the viewing area is a flat walk from a road."],
  ["2022", "About 2,500 in one spot", "Nearly 2,500 people pack a single viewing area. Trampled vegetation, overwhelmed restrooms, and a road that cannot move."],
  ["2024 and 2025", "Reservations on the peak weekends", "An entry reservation on the three weekends around Presidents' Day, weekdays free. One lane of Northside Drive becomes a footpath, and no stopping from Lower Yosemite Fall to El Capitan Crossover."],
  ["2026", "No reservation, more rangers", "The park drops the reservation and manages the road instead: the pedestrian lane, the no-stopping zone, and a full Northside closure for about half an hour after sunset on busy weekends. A storm leaves about four feet of snow and a closure from February 19 to 21, in the middle of the window."],
];

const FF_WEATHER = [
  ["NWS point forecast, Yosemite Valley", "Sky cover and temperature for the Valley floor", "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936"],
  ["NWS hourly graph", "The sky-cover line at 5 p.m. is the number that matters", "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936&unit=0&lg=english&FcstType=graphical"],
  ["NWS Hanford forecast discussion", "The forecasters' own words on incoming storms and clearing", "https://forecast.weather.gov/product.php?site=HNX&issuedby=HNX&product=AFD"],
  ["GOES-West satellite, Pacific Southwest", "Watch the cloud deck over the Coast Ranges move", "https://www.star.nesdis.noaa.gov/GOES/sector.php?sat=G18&sector=psw"],
  ["Caltrans QuickMap", "Chain controls on Highways 140, 41 and 120", "https://quickmap.dot.ca.gov/"],
  ["NPS current conditions", "Road status, closures, and this year's rules", "https://www.nps.gov/yose/planyourvisit/conditions.htm"],
];

// Mirrored in edge/seo.js's "/firefall" faq (the JSON-LD). Change both.
const FF_FAQ = [
  ["When is the Yosemite firefall?", "Mid to late February, for about two weeks. The sun angle that lights Horsetail Fall runs from roughly the second week of February to the last, with the strongest color usually in the middle of the span. The glow itself lasts about ten minutes at sunset."],
  ["Do I need a reservation to see the firefall?", "It depends on the year. In 2024 and 2025 the park required an entry reservation on the three peak weekends; in 2026 it required none and managed traffic on the road instead. The park posts each year's rules on its Horsetail Fall page, usually in January."],
  ["Where do you park for the firefall?", "At Yosemite Falls parking, just west of Yosemite Valley Lodge. From there it is about 1.5 miles each way on a pedestrian lane on Northside Drive to the viewing area near El Capitan Picnic Area. If that lot is full, park at Yosemite Village or Curry Village and take the free Valley shuttle to Yosemite Falls."],
  ["Can someone drop me off near the viewing area?", "No. Parking, stopping and unloading passengers are prohibited between Lower Yosemite Fall and El Capitan Crossover, and on busy weekends Northside Drive can close completely for about half an hour after sunset. There is no loop to circle while you watch. Vehicles with a disability placard are the exception."],
  ["What time should I get there?", "At least an hour before sunset to watch, and by early afternoon on a promising weekend if you want a tripod spot. Allow 40 to 50 minutes for the 1.5-mile walk carrying a chair and gear."],
  ["What time does the firefall happen?", "In the last ten to fifteen minutes before sunset. In late February the sun sets over Yosemite Valley a little before 6 p.m.; the glow peaks just before and is gone within about ten minutes."],
  ["How do I know if Horsetail Fall is flowing?", "No gauge measures it. Look at the El Capitan webcam in the morning for a thin white streak on the east shoulder, and read the week: a storm that left snow on the rim, followed by afternoons above freezing, is the setup. A long cold, dry spell leaves it empty."],
  ["What if it is cloudy?", "A few high, thin clouds are fine and can deepen the color. A cloud bank on the western horizon at sunset cancels the show even under a clear sky overhead. Check the forecast's sky cover for the sunset hour, then the webcams in the afternoon."],
  ["Is February a quiet time to visit Yosemite?", "Not during the firefall window. The rest of the winter is quiet, but the window's dates are the same every year, so rooms inside the Valley go within days of release and the gateway towns fill closest first. Book a refundable room as early as you can."],
  ["Is the firefall worth it?", "Once, with the odds understood. Some years several evenings line up; some years it effectively does not happen. Plan a winter trip that is worth taking without it, and give yourself more than one evening."],
  ["Is it the same as the old Glacier Point firefall?", "No. From the 1870s until January 1968 a bonfire was pushed off Glacier Point on summer evenings. The Horsetail Fall firefall is natural sunset light on falling water, and nothing is lit."],
  ["Are there restrooms at the viewing area?", "Vault toilets, trash and recycling at El Capitan Picnic Area. Pack out everything else."],
];

// Relative sun-angle strength through February: a shape, not a forecast.
const FF_DAYS = Array.from({ length: 21 }, (_, i) => {
  const d = i + 8;
  const x = (d - 20.5) / 6.2;
  return { d, v: Math.max(0.08, Math.exp(-x * x)) };
});

function FfIcon({ name, size = 22 }) {
  const paths = {
    drop: <path d="M12 3c3 4.5 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.5 6-11z" />,
    cloud: <path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 11 3.5 3.5 0 0 0 7 18z" />,
    sun: <React.Fragment><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></React.Fragment>,
    walk: <React.Fragment><circle cx="13" cy="4" r="2" /><path d="M9 21l2-6 3 3v3M8 11l3-4 3 2 3 1M11 7l-1 5" /></React.Fragment>,
    car: <React.Fragment><path d="M4 16V11l2-5h12l2 5v5M4 16h16M4 16v2M20 16v2" /><circle cx="7.5" cy="13.5" r="1" /><circle cx="16.5" cy="13.5" r="1" /></React.Fragment>,
    bed: <React.Fragment><path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3" /><circle cx="7" cy="10.5" r="1.5" /></React.Fragment>,
    clock: <React.Fragment><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></React.Fragment>,
    therm: <path d="M14 14V5a2 2 0 0 0-4 0v9a4 4 0 1 0 4 0z" />,
    alert: <React.Fragment><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></React.Fragment>,
    no: <React.Fragment><circle cx="12" cy="12" r="9" /><path d="M6 6l12 12" /></React.Fragment>,
    pin: <React.Fragment><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></React.Fragment>,
    check: <path d="M4 12l5 5L20 6" />,
  };
  return (
    <svg className="ff-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}

function FfBook({ town, list, children }) {
  return (
    <AvailabilityLink destination={town.dest} list={list} slug={town.id} className="ff-book">
      {children || "See February availability ↗"}
    </AvailabilityLink>
  );
}

function FfSunChart() {
  const W = 630, H = 190, base = H - 24, bw = W / FF_DAYS.length;
  return (
    <svg className="ff-sun__chart" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label="Relative strength of the sun angle on Horsetail Fall through February: weak around the 8th, strongest from about the 17th to the 24th, fading by the 28th">
      <line x1="0" y1={base} x2={W} y2={base} className="ff-sun__axis" />
      {FF_DAYS.map((o, i) => {
        const h = Math.round(o.v * (base - 12));
        const cls = o.v > 0.75 ? "ff-sun__bar ff-sun__bar--peak" : o.v > 0.4 ? "ff-sun__bar ff-sun__bar--mid" : "ff-sun__bar";
        return (
          <g key={o.d}>
            <rect x={i * bw + 2} y={base - h} width={bw - 4} height={h} className={cls} />
            {o.d % 2 === 0 && <text x={i * bw + bw / 2} y={H - 6} textAnchor="middle" className="ff-sun__label">{o.d}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// Schematic of the Valley's one-way loop. Not to scale; west is left.
function FfRoadDiagram() {
  return (
    <svg className="ff-map__svg" viewBox="0 0 1000 420" role="img"
      aria-label="Schematic of the Yosemite Valley loop. Park at Yosemite Falls parking beside Yosemite Valley Lodge and walk west about 1.5 miles on the pedestrian lane on Northside Drive to the viewing area near El Capitan Picnic Area. No parking, stopping or drop-offs between Lower Yosemite Fall and El Capitan Crossover. No stopping on Southside Drive between El Capitan Crossover and Swinging Bridge. Overflow parking at Yosemite Village and Curry Village, with the free shuttle to Yosemite Falls.">
      <path d="M60 150 C 260 120, 520 120, 900 150" className="ff-map__road" />
      <path d="M60 290 C 260 320, 520 320, 900 290" className="ff-map__road" />
      <path d="M170 140 L 170 300" className="ff-map__road ff-map__road--cross" />
      <path d="M270 128 C 440 116, 600 118, 745 132" className="ff-map__walk" />
      <path d="M170 300 C 300 316, 440 318, 560 312" className="ff-map__nostop" />
      <text x="70" y="112" className="ff-map__roadname">NORTHSIDE DRIVE · ONE WAY WEST</text>
      <text x="70" y="352" className="ff-map__roadname">SOUTHSIDE DRIVE · ONE WAY EAST</text>
      <text x="182" y="262" className="ff-map__small">El Capitan Crossover</text>
      <circle cx="250" cy="130" r="16" className="ff-map__view" />
      <text x="250" y="135" textAnchor="middle" className="ff-map__viewmark">V</text>
      <text x="250" y="180" textAnchor="middle" className="ff-map__place">Viewing area</text>
      <text x="250" y="200" textAnchor="middle" className="ff-map__small">near El Capitan Picnic Area</text>
      <text x="250" y="216" textAnchor="middle" className="ff-map__small">vault toilets</text>
      <rect x="740" y="116" width="34" height="34" rx="3" className="ff-map__p" />
      <text x="757" y="139" textAnchor="middle" className="ff-map__pmark">P</text>
      <text x="757" y="180" textAnchor="middle" className="ff-map__place">Yosemite Falls parking</text>
      <text x="757" y="200" textAnchor="middle" className="ff-map__small">beside Yosemite Valley Lodge</text>
      <text x="510" y="78" textAnchor="middle" className="ff-map__walklabel">walk about 1.5 mi on the pedestrian lane · 40 to 50 min with gear</text>
      <rect x="330" y="146" width="340" height="30" rx="3" className="ff-map__ban" />
      <text x="500" y="166" textAnchor="middle" className="ff-map__banlabel">NO PARKING · NO STOPPING · NO DROP-OFFS</text>
      <text x="300" y="296" className="ff-map__nostoplabel">no stopping, El Cap Crossover to Swinging Bridge</text>
      <rect x="870" y="250" width="34" height="34" rx="3" className="ff-map__p" />
      <text x="887" y="273" textAnchor="middle" className="ff-map__pmark">P</text>
      <text x="860" y="362" textAnchor="end" className="ff-map__place">Overflow: Yosemite Village, Curry Village</text>
      <text x="860" y="382" textAnchor="end" className="ff-map__small">free shuttle to Yosemite Falls and Valley Lodge</text>
      <text x="40" y="412" className="ff-map__small">Schematic, not to scale. West is left. Stay on the pavement; the meadows are closed.</text>
    </svg>
  );
}

function FirefallPage({ go }) {
  const [elPortal, mariposa] = FF_TOWNS;
  const toc = [
    ["#firefall-book", "Book early"],
    ["#firefall-stay", "Where to stay"],
    ["#firefall-tonight", "Is it on tonight?"],
    ["#firefall-dates", "Dates and times"],
    ["#firefall-parking", "Parking and the walk"],
    ["#firefall-day", "Hour by hour"],
    ["#firefall-bring", "What to bring"],
    ["#firefall-history", "How the park has run it"],
    ["#firefall-photography", "Photography"],
    ["#firefall-faq", "Questions"],
  ];

  return (
    <div className="page hp-tool hp-firefall">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Firefall" }]}
        eyebrow="HORSETAIL FALL · EL CAPITAN · EVERY FEBRUARY"
        title="The Yosemite Firefall"
        intro="For about two weeks each February, the last light of the day can turn Horsetail Fall into a ribbon of orange on El Capitan. It is real, it is brief, and most evenings it does not happen. This page covers the whole trip: the dates, the odds, the rooms, the walk, the weather, and what to wear while you wait."
        actions={<React.Fragment>
          <HomeLink go={go} location="firefall_head" className="hp-button" href="#firefall-book">Find a February room <span>↓</span></HomeLink>
          <HomeLink go={go} location="firefall_head" className="hp-link" href="#firefall-tonight">Is it on tonight? ↓</HomeLink>
        </React.Fragment>}
        aside={
          <figure className="ff-hero">
            <ResponsiveImage image="img/horsetail-fall-firefall-glow.jpg" eager
              alt="Horsetail Fall glowing orange at sunset on the east face of El Capitan"
              sizes="(max-width: 760px) calc(100vw - 40px), 640px" />
            <figcaption>Photo: Barney Moss / Wikimedia Commons (CC BY 2.0)</figcaption>
          </figure>
        }
      />

      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><FfIcon name="sun" /><dt>The window</dt><dd>Mid to late February</dd></div>
          <div><FfIcon name="clock" /><dt>The glow</dt><dd>About ten minutes, at sunset</dd></div>
          <div><FfIcon name="walk" /><dt>The walk</dt><dd>1.5 miles each way, no drop-offs</dd></div>
          <div><FfIcon name="bed" /><dt>The rooms</dt><dd>Book months ahead, not weeks</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {toc.map(([href, label]) => (
            <HomeLink key={href} go={go} location="firefall_toc" href={href}>{label}</HomeLink>
          ))}
        </nav>
      </div>

      {/* Book early. The reader who waits for a forecast before looking for a
          bed is the reader who drives ninety minutes each way in chains. */}
      <section className="hp-wrap hp-section ff-book-early" id="firefall-book" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">BOOK BEFORE YOU KNOW THE FORECAST</p>
            <h2>February is not the slow season. Not these two weeks.</h2>
            <p className="ff-lede">The rest of the winter is quiet. The firefall window is not. The dates are set by the sun, so every photographer, every Presidents' Day family and everyone who saw the photograph last year is booking the same fourteen nights. Rooms inside the Valley go within days of release. The gateway towns follow, closest first.</p>
            <p className="ff-lede">Book the room when you pick the dates, on a rate you can cancel. Watch the weather in the last week, and let the room go if the forecast turns. The reverse, waiting for a good forecast before looking for a bed, is how people end up driving ninety minutes each way in chains.</p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><FfIcon name="alert" /> The short version</p>
            <ul>
              <li>Book a refundable room now.</li>
              <li>Plan for two or three evenings, not one.</li>
              <li>Weekdays over weekends, always.</li>
              <li>Stay on Highway 140 if you can: it gets rain when the others get snow.</li>
            </ul>
            <FfBook town={elPortal} list="firefall_urgency">Check El Portal availability ↗</FfBook>
            <p className="ff-disclosure">Availability search on Expedia. We may earn a commission if you book, at no cost to you. <a href="/affiliate">Disclosure.</a></p>
          </aside>
        </div>
        <ol className="ff-timeline">
          <li className="is-gone"><span>About a year out</span><strong>In-park rooms open</strong><p>Yosemite Valley Lodge, The Ahwahnee and Curry Village release on a rolling basis about 366 days ahead. The firefall weekends go almost at once.</p></li>
          <li className="is-gone"><span>Late summer to autumn</span><strong>El Portal fills</strong><p>The closest gateway goes first. The Presidents' Day weekend here is usually gone well before winter.</p></li>
          <li className="is-tight"><span>Autumn to January</span><strong>Mariposa and Midpines fill</strong><p>The window's dates are the same every year, so planners book on the dates, not the forecast.</p></li>
          <li className="is-open"><span>The final weeks</span><strong>Cancellations</strong><p>Check in-park availability daily for cancellations. Groveland and Oakhurst may still have rooms, with a longer drive and more snow.</p></li>
        </ol>
      </section>

      {/* Where to stay. The glow ends in the dark and everyone walks back to
          the same lots at once, so the page argues for the closest bed. */}
      <section className="ff-band" id="firefall-stay" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="WHERE TO STAY" title="Sleep as close to the walk as you can" />
          <p className="ff-lede ff-lede--intro">The glow ends in the dark. Then everyone walks 1.5 miles back to the same lots and drives out on the same road. Every mile closer you sleep is a mile you are not driving at night on a winter highway.</p>
          <div className="ff-stay">
            <article className="ff-inpark">
              <p className="hp-eyebrow">INSIDE THE PARK · BOOKS THROUGH THE CONCESSIONER</p>
              <h3>Yosemite Valley Lodge</h3>
              <p>The best-placed bed for the firefall: it sits beside Yosemite Falls parking, where the walk to El Capitan Picnic Area starts. You leave the car where it is and walk back to your room.</p>
              <dl>
                <div><dt>Also in the Valley</dt><dd>The Ahwahnee, Curry Village</dd></div>
                <div><dt>Opens</dt><dd>About 366 days ahead, on a rolling basis</dd></div>
                <div><dt>Firefall weekends</dt><dd>Gone within days of release</dd></div>
              </dl>
              <a className="ff-ghost" href="https://www.travelyosemite.com/lodging/" target="_blank" rel="noopener noreferrer">Check in-park rooms at Travel Yosemite ↗</a>
              <p className="ff-note">In-park rooms book only through the park concessioner. In the last two weeks, check daily for cancellations.</p>
            </article>
            <div className="ff-towns">
              {FF_TOWNS.map((t) => (
                <div className="ff-town" key={t.id}>
                  <div className="ff-town__name">
                    <h3>{t.name}</h3>
                    <p><strong>{t.drive}</strong> to the Valley · {t.road}</p>
                  </div>
                  <div className="ff-town__note">
                    <span className="ff-tier">{t.tier}</span>
                    <p>{t.note}</p>
                  </div>
                  <FfBook town={t} list="firefall_town" />
                </div>
              ))}
              <p className="ff-note"><strong>Camping:</strong> Upper Pines stays open all winter and takes reservations on Recreation.gov. Expect a night in the 20s after a clear firefall evening.</p>
              <p className="ff-note">The filled buttons search availability on Expedia; we may earn a commission. The recommendation is the same either way, and no link is to a specific property. <a href="/affiliate">How we handle affiliate links.</a> Every option compared: <HomeLink go={go} location="firefall_stay" href="/stay">where to stay</HomeLink>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Is it on tonight? The two conditions that change are checkable from
          anywhere with a signal: water (the El Capitan cam) and cloud (the
          Half Dome cam, the forecast, the satellite). */}
      <section className="hp-wrap hp-section ff-tonight" id="firefall-tonight" tabIndex={-1}>
        <div className="ff-split ff-split--end">
          <div>
            <p className="hp-eyebrow">IS IT ON TONIGHT?</p>
            <h2>Check the weather constantly. Then check it again.</h2>
            <p className="ff-lede">Two of the three conditions change by the hour: water in the fall and cloud on the western horizon. You can see both from anywhere with a signal. Check the night before, the morning of, and again in the early afternoon before you walk in. Expect little or no signal at the viewing area.</p>
          </div>
          <dl className="ff-conditions">
            <div><FfIcon name="drop" size={24} /><dt>Water</dt><dd>Changes daily</dd></div>
            <div><FfIcon name="cloud" size={24} /><dt>A clear west</dt><dd>Changes hourly</dd></div>
            <div><FfIcon name="sun" size={24} /><dt>Sun angle</dt><dd>Fixed: the dates</dd></div>
          </dl>
        </div>

        <WebcamStrip variant="board" only={["El Capitan", "Half Dome"]} />
        <div className="ff-camreads">
          <p><strong>El Capitan, from Turtleback Dome: your water check.</strong> Horsetail runs down the east shoulder of El Capitan. A thin white line there in the morning means the fall is flowing. Bare, dry rock means it is not, whatever the sky does.</p>
          <p><strong>Half Dome, from Ahwahnee Meadow: your cloud check.</strong> In the morning it shows whether the storm has cleared. By mid-afternoon it shows whether low cloud is settling over the Valley for the evening.</p>
        </div>

        <ol className="ff-checks">
          <li><FfIcon name="drop" /><strong>Morning: is there water?</strong><p>Open the El Capitan cam before 10 a.m. and look for the streak. The setup that fills the fall: snow on the rim from the last storm, then afternoons above freezing up top.</p></li>
          <li><FfIcon name="cloud" /><strong>Early afternoon: where is the cloud?</strong><p>Pull up the hourly sky cover for 5 to 6 p.m. and the satellite loop. The deck that ends the show usually sits over the Coast Ranges to the west, which nobody in the Valley can see.</p></li>
          <li><FfIcon name="sun" /><strong>Mid-afternoon: the sky over the Valley</strong><p>Low grey across the whole Half Dome frame means the sun will not reach the wall. Broken high cloud is fine.</p></li>
          <li><FfIcon name="clock" /><strong>An hour before sunset: stay or go</strong><p>Clear western horizon and a visible streak: stay. Solid overcast: go and eat, and watch the next evening, since tonight's storm may be tomorrow's water.</p></li>
        </ol>

        <div className="ff-clouds">
          <h3>Some clouds help. A lot of clouds end it.</h3>
          <ul>
            <li className="is-good"><span>Good</span><strong>Clear, or thin high cloud</strong><p>High, wispy cloud can catch the same light and deepen the color.</p></li>
            <li className="is-maybe"><span>Maybe</span><strong>Broken cloud, gaps to the west</strong><p>Wait. The sun can drop into a gap under the deck in the last minutes.</p></li>
            <li className="is-no"><span>No show</span><strong>A bank on the western horizon</strong><p>The light never reaches the cliff, even under blue sky overhead. This is the evening that fools people.</p></li>
            <li className="is-no"><span>No show</span><strong>Overcast or storm</strong><p>Nothing tonight, but it is filling the fall. The first clear evening after it is the one to be there for.</p></li>
          </ul>
        </div>

        <div className="ff-sources">
          <h3>Weather sources to keep open</h3>
          <ul>
            {FF_WEATHER.map(([t, d, h]) => (
              <li key={h}><a href={h} target="_blank" rel="noopener noreferrer"><strong>{t} ↗</strong><span>{d}</span></a></li>
            ))}
          </ul>
          <p className="ff-note">No gauge measures Horsetail Fall. The USGS gauge on the Merced River at Pohono Bridge is a rough proxy for how much the Valley's walls are shedding: a rising line after a storm is a good sign. <a href="https://waterdata.usgs.gov/monitoring-location/11266500/" target="_blank" rel="noopener noreferrer">Merced River at Pohono Bridge ↗</a> Every live feed on one page: <HomeLink go={go} location="firefall_tonight" href="/conditions">the conditions board</HomeLink>.</p>
        </div>
      </section>

      <section className="ff-band" id="firefall-dates" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">DATES AND TIMES</p>
            <h2>When the sun lines up</h2>
            <p className="ff-lede">The sun angle is the only one of the three conditions you can put in a calendar, and it is the same every year. The park posts the year's projected window in January; recent windows have run from about the 10th to the 26th.</p>
            <p className="ff-lede">The middle week gives the strongest color and the biggest crowd. The edges give a softer glow and more room. Two weekday evenings in the middle of the window beat one Saturday at the peak.</p>
          </div>
          <div>
            <figure className="ff-sun">
              <figcaption>Sun-angle strength through February (relative)</figcaption>
              <FfSunChart />
              <p className="ff-note">The shape, not a forecast. Water and cloud decide any given evening.</p>
            </figure>
            <dl className="ff-when">
              <div><dt>Window opens</dt><dd>About February 10</dd><p>Color is weak and brief.</p></div>
              <div><dt>Strongest color</dt><dd>About February 17 to 24</dd><p>Also the most crowded evenings, especially the Presidents' Day weekend.</p></div>
              <div><dt>Window closes</dt><dd>About February 26 to 28</dd><p>The angle slides off the fall.</p></div>
              <div><dt>The glow</dt><dd>A little before 6 p.m.</dd><p>The last ten to fifteen minutes before sunset.</p></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section ff-parking" id="firefall-parking" tabIndex={-1}>
        <HpHeading eyebrow="PARKING AND THE WALK" title="You park at Yosemite Falls, and you walk" />
        <p className="ff-lede ff-lede--intro">For several years the park has run the firefall the same basic way, reservation or not: the viewing area along Northside Drive has no parking at all, and one lane of the road becomes a footpath from Yosemite Falls parking. Plan the evening around that walk.</p>
        <figure className="ff-map"><FfRoadDiagram /></figure>
        <ul className="ff-rules">
          <li><FfIcon name="no" size={26} /><strong>No parking near the viewing area</strong><p>Parking, stopping and unloading passengers have been prohibited between Lower Yosemite Fall and El Capitan Crossover. Rangers enforce it.</p></li>
          <li><FfIcon name="car" size={26} /><strong>No drop-off and circle back</strong><p>There is nowhere to stop, the loop is long and one-way, and on busy weekends Northside Drive has closed entirely for about half an hour after sunset. Whoever drives walks too.</p></li>
          <li><FfIcon name="walk" size={26} /><strong>Everyone walks, carrying everything</strong><p>Chairs, tripods, cameras, the thermos, the kids. About 1.5 miles each way on the road, in snow some years, and back in the dark.</p></li>
          <li className="is-exception"><FfIcon name="pin" size={26} /><strong>The exception</strong><p>Vehicles with a disability placard have been allowed to stop in the restricted zone. Check the year's rules for where.</p></li>
        </ul>
        <p className="ff-alert"><FfIcon name="alert" /><span><strong>The rules change every winter.</strong> Reservations were required on peak weekends in 2024 and 2025 and dropped in 2026. The park publishes the year's plan on its <a href="https://www.nps.gov/yose/planyourvisit/horsetailfall.htm" target="_blank" rel="noopener noreferrer">Horsetail Fall page</a>, usually in January. Read it before you drive in.</span></p>
      </section>

      <section className="ff-band" id="firefall-day" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">THE DAY, HOUR BY HOUR</p>
            <h2>What time to get there</h2>
            <p className="ff-lede">A firefall evening takes the whole afternoon. Most of it is waiting in the cold for ten minutes of light, and the people who enjoy it planned for the waiting.</p>
            <figure className="ff-photo">
              <ResponsiveImage image="img/el-capitan-snow-spring.jpg" alt="El Capitan above snow on the Valley floor" sizes="(max-width: 760px) calc(100vw - 40px), 520px" />
              <figcaption>Photo: Anita Ritenour / Wikimedia Commons (CC BY 2.0)</figcaption>
            </figure>
          </div>
          <ol className="ff-hours">
            <li><span>The night before</span><p>Check the hourly sky cover for sunset and the storm track. Charge batteries. Pack the car.</p></li>
            <li><span>7 a.m.</span><p>El Capitan cam: is there a white line on the east shoulder? Half Dome cam: has the storm cleared?</p></li>
            <li><span>Morning</span><p>Drive in. Carry chains; after a storm they can be required on the approach roads and in the park. There is no gas in Yosemite Valley.</p></li>
            <li><span>Noon to 1 p.m.</span><p>Park at Yosemite Falls on a weekend; the lot fills in the early afternoon. Weekdays give you more slack.</p></li>
            <li><span>1:30 to 3 p.m.</span><p>Last forecast check while you have a signal. Walk the 1.5 miles. Photographers claim tripod spots now.</p></li>
            <li><span>4:30 p.m.</span><p>Casual viewers: be in place at least an hour before sunset. Put the layers on before you get cold, not after.</p></li>
            <li className="is-glow"><span>Just before sunset</span><p>The glow builds, peaks just before the sun sets, and is gone within about ten minutes.</p></li>
            <li><span>After sunset</span><p>Headlamps on. On busy weekends the road may stay closed for about half an hour. Walk out, then expect a slow line of cars leaving the Valley.</p></li>
          </ol>
        </div>
      </section>

      <section className="hp-wrap hp-section ff-bring" id="firefall-bring" tabIndex={-1}>
        <div className="ff-split ff-split--end">
          <div>
            <p className="hp-eyebrow">WHAT TO BRING</p>
            <h2>Dress for standing still, not for hiking</h2>
            <p className="ff-lede">February on the Valley floor at 4,000 feet can be two different trips. Pack for both until the last forecast, because the walk in happens in one and the walk out in the other.</p>
          </div>
          <div className="ff-weeks">
            <div><FfIcon name="sun" size={24} /><strong>A clear week</strong><p>Warm in the afternoon sun on the walk in, near freezing by the walk out. Layers you can take off and put back on.</p></div>
            <div><FfIcon name="therm" size={24} /><strong>A storm week</strong><p>Snow at the viewing area, the teens and twenties after dark, and chains on the drive in. Snow pants, and a pad under the chair.</p></div>
          </div>
        </div>
        <div className="ff-kit">
          <div className="ff-gear">
            <div className="ff-gear__head"><h3>The layers</h3><p>Picks from Patagonia</p></div>
            <ul>
              {FF_GEAR.map((g) => (
                <li key={g.id}>
                  <div><strong>{g.what}</strong><p>{g.why}</p></div>
                  <a className="ff-gear__link" href={window.buildAffiliateLink ? window.buildAffiliateLink("patagonia", `https://www.patagonia.com/search/?q=${g.q.replace(/ /g, "+")}`) : `https://www.patagonia.com/search/?q=${g.q.replace(/ /g, "+")}`}
                    target="_blank" rel="sponsored noopener"
                    data-aff-network="patagonia" data-aff-list="firefall_gear" data-aff-item-slug={g.id} data-aff-name={g.what}>{g.label} ↗</a>
                </li>
              ))}
            </ul>
            <p className="ff-note">Patagonia links are affiliate links; we may earn a commission. Any warm synthetic or down jacket does the same job. <a href="/affiliate">Our affiliate policy.</a></p>
          </div>
          <div className="ff-else">
            <h3>Everything else</h3>
            <ul>
              {FF_KIT.map((k) => <li key={k}><FfIcon name="check" size={18} />{k}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="ff-band" id="firefall-history" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="HOW THE PARK HAS RUN IT" title="From a photographers' secret to a managed event" />
          <p className="ff-lede ff-lede--intro">Recent years have each had a different rule on entry and the same rule on the road. What that means for planning: expect the walk, expect enforcement, and expect weather to take some of the window.</p>
          <ol className="ff-history">
            {FF_HISTORY.map(([year, title, text]) => (
              <li key={year}><span>{year}</span><strong>{title}</strong><p>{text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hp-wrap hp-section ff-split" id="firefall-photography" tabIndex={-1}>
        <div>
          <p className="hp-eyebrow">PHOTOGRAPHY</p>
          <h2>A thin ribbon on a huge wall</h2>
          <p className="ff-lede">The classic frames are shot at 100mm and longer, tight on the fall. The good light is dim light, so bring a tripod, expose for the orange, and let the wall go dark. Compose before it starts: ten minutes is not long. A phone renders the fall as a faint thread on a big grey cliff, so take one picture and then watch. More on where the same February light works: <HomeLink go={go} location="firefall_photo" href="/articles/yosemite-photography-spots">the photography guide</HomeLink>.</p>
        </div>
        <dl className="ff-photo-facts">
          <div><dt>Lens</dt><dd>100 to 400mm</dd></div>
          <div><dt>Support</dt><dd>Tripod, remote release</dd></div>
          <div><dt>Exposure</dt><dd>For the highlights</dd></div>
          <div><dt>Phone</dt><dd>Take one, then watch</dd></div>
        </dl>
      </section>

      <section className="ff-band" id="firefall-faq" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Firefall questions, answered</h2>
            <p className="ff-lede">The long version, with the history and the naturalist's case for February with or without the show: <HomeLink go={go} location="firefall_faq" href="/articles/horsetail-fall-firefall">the complete firefall guide</HomeLink>.</p>
            <div className="ff-closing">
              <p className="hp-eyebrow">STILL NO ROOM?</p>
              <h3>Search the whole Highway 140 corridor</h3>
              <p>El Portal, Midpines and Mariposa sit on the road that gets rain when the others get snow, and it is the corridor with year-round bus service into the park.</p>
              <FfBook town={mariposa} list="page_firefall">Search Highway 140 lodging ↗</FfBook>
            </div>
          </div>
          <div className="ff-faq">
            {FF_FAQ.map(([q, a], i) => (
              <details key={q} open={i < 2}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <HpGuideBand
        go={go}
        location="firefall"
        title="Planning the February trip around it?"
        intro="The Field Guide app carries the winter stops, parking notes for the viewing areas, offline maps for a park with no signal, and a day-by-day planner for the rest of the trip."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="February, watched from inside the park"
        heading="February, watched from inside the park"
        blurb="Sunday Field Notes carries the firefall window as it develops: water in the fall, the week's weather, and what the rules are this year."
        location="firefall"
        tag="firefall"
      />
    </div>
  );
}

window.FirefallPage = FirefallPage;
