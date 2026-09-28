/* global React, ResponsiveImage, HomeLink, HpArticleCard, AvailabilityLink, NewsletterInline, GUIDE_PROMO_APP_BASE */

// =============================================================================
// THE PLANNING GUIDE — `/planning`.
//
// The September 2026 redesign turned the five-part reading list into a guided
// page: four decisions, in the order the park makes a visitor take them, and a
// clear line between what is free and what the Field Guide sells. Top to
// bottom:
//
//   Step 01, the month. Twelve buttons over a banner photograph for the month.
//     The road states come from window.TRIP_MONTHS (intent-data.js), never
//     restated here; the four headline tiles restate the deadline table in
//     scripts/data/deadlines.json (Half Dome cables and lotteries, the grove
//     shuttle, the road windows, the campground 15th rule) and the month notes.
//     A change to either source means editing the tables below by hand.
//   Step 02, the four corners. The official NPS park map, cropped, with the
//     four areas and the two seasonal roads drawn as a layer on top (CLAUDE.md:
//     maps start from the NPS map, never a drawing), then the four area cards
//     and the Field Guide's 3D map, shown in real captures.
//   Step 03, where to sleep. A dated Expedia search, the four gateway towns on
//     /stay's 0 to 120 minute drive scale, and the in-park beds, which book
//     through the concessioner. Filled buttons are always an Expedia search.
//   Step 04, the five-question trip selector (intent.jsx), with a sample plan
//     beside it until the reader has answered all five.
//   Then three ways to plan (free, free with an email, $3.99), the Field Guide
//   band, the reading guide, and the Sunday letter.
//
// The reading guide's five parts own their copy (PLANNING_PARTS) but not their
// membership: the slugs come from window.PLANNING_SERIES in data.js, which the
// article pages read for their series band, and scripts/check-intent-tags.mjs
// fails if a part label stops resolving. A part opens its entries in place.
// "Filter every entry" opens the intent filters, whose "Every entry" row lists
// the whole catalog; the trip selector's hand-off opens them too.
//
// Every top-level name carries a `pg` prefix: page bundles are classic scripts
// sharing one global scope (see the bulletin note in CLAUDE.md).
// =============================================================================

const { useState: useStatePg, useRef: useRefPg, useEffect: useEffectPg } = React;

const PLANNING_PARTS = [
  {
    part: "Part One · Before you book",
    eyebrow: "Part one",
    title: "Before you book",
    blurb: "When, where to base, smoke season.",
    lede: "The decisions you make from your kitchen table, before the trip starts, are the ones that shape the whole experience. When you visit, where you base, whether the park is in smoke season. Read these before you put money down.",
  },
  {
    part: "Part Two · Getting there and getting in",
    eyebrow: "Part two",
    title: "Getting there and getting in",
    blurb: "Entrances, parking, buses, permits.",
    lede: "Five entrances, four highways, one seasonal pass that does not exist half the year, three parking lots that decide how the day goes, two bus systems that make the lots optional, and a permit system guarding the 95 percent of the park most visitors never see.",
  },
  {
    part: "Part Three · When you arrive",
    eyebrow: "Part three",
    title: "When you arrive",
    blurb: "The car, the kids, the dog, no bookings.",
    lede: "What is in the car, who you are traveling with, whether everyone in your group can hike, and what you can still get today if you arrived with nothing booked.",
  },
  {
    part: "Part Four · If you're hiking Half Dome",
    eyebrow: "Part four",
    title: "If you're hiking Half Dome",
    blurb: "The lottery, the cables, the Mist Trail.",
    lede: "Half Dome requires a permit lottery that most applicants do not win, and the standard approach is the Mist Trail. What the cables, the lottery, and the wet granite actually demand, and the better hike most visitors do not know about.",
  },
  {
    part: "Part Five · The seasonal calendar",
    eyebrow: "Part five",
    title: "The seasonal calendar",
    blurb: "Roads, falls, smoke, the Milky Way.",
    lede: "Tioga Road opens, Glacier Point opens, the waterfalls peak and then dry, smoke comes in from somewhere else, and the Milky Way arrives. Knowing what is open and when changes the trip entirely.",
  },
];

function planningPartSlugs(partLabel) {
  const entry = (window.PLANNING_SERIES || []).find((s) => s.part === partLabel);
  return entry ? entry.slugs : [];
}

// ---------------------------------------------------------------------------
// Step 01: the month. Keyed by TRIP_MONTHS order (jan first).
// ---------------------------------------------------------------------------

// The banner photograph and the waterfall line for each month. The photos are
// the set the retired homepage month planner used, with a stand-in where that
// file is not in the repo; the falls lines restate TRIP_MONTHS' notes.
const PG_MONTH_EXTRA = [
  { photo: "img/half-dome-winter-snow.jpg", alt: "Half Dome under winter snow", credit: "Photo: George Fiske / Wikimedia Commons (public domain)", falls: "Running low", fallsLine: "Winter flow. A storm can wake them for a day or two." },
  { photo: "img/horsetail-fall-firefall-glow.jpg", alt: "Horsetail Fall glowing at sunset on El Capitan", credit: "Photo: Barney Moss / Wikimedia Commons (CC BY 2.0)", falls: "Low, and Horsetail", fallsLine: "Horsetail Fall can glow at sunset in the second half of the month, if it has water and the western sky is clear." },
  { photo: "img/yosemite-valley-winter-wall.jpg", alt: "A granite wall of Yosemite Valley dusted with late-winter snow", credit: "Photo: Ahmed Radwan / Wikimedia Commons (CC0)", falls: "Starting to wake", fallsLine: "First runoff. Flow builds with every warm week." },
  { photo: "img/yosemite-falls-spring-blossoms-cory-goehring.jpg", alt: "Yosemite Falls behind spring blossoms on the Valley floor", credit: "Photo: Cory Goehring", falls: "Building by the week", fallsLine: "Full falls against half of summer's crowds." },
  { photo: "img/nevada-fall-liberty-cap-ryan-oconnor.jpg", alt: "Nevada Fall below Liberty Cap at spring flow", credit: "Photo: Ryan O'Connor / Unsplash", falls: "Peak flow", fallsLine: "The month the falls are loudest. The Mist Trail earns its name." },
  { photo: "img/half-dome-meadow-deer-johannes-andersson.jpg", alt: "A deer grazing a green meadow below Half Dome in early summer", credit: "Photo: Johannes Andersson / Unsplash", falls: "Strong, then easing", fallsLine: "Strong at the start of the month, thinning by the end." },
  { photo: "img/tenaya-lake.jpg", alt: "Tenaya Lake and granite domes along Tioga Road in summer", credit: "Photo: Michael Hogarth / Wikimedia Commons (public domain)", falls: "Thinning", fallsLine: "The big falls thin. Go up high, where the water is lakes." },
  { photo: "img/milky-way-sentinel-dome.jpg", alt: "The Milky Way over Sentinel Dome on a dark August night", credit: "Photo: Jackhen1992 / Wikimedia Commons (CC BY-SA 4.0)", falls: "A trickle", fallsLine: "Trade the falls for the darkest skies of the year." },
  { photo: "img/lyell-canyon.jpg", alt: "Lyell Canyon in the Tuolumne high country", credit: "Photo: mypubliclands / Wikimedia Commons (public domain)", falls: "At their lowest", fallsLine: "The year's low water. The high country is the draw." },
  { photo: "img/tunnel-view-autumn-aniket-deole.jpg", alt: "Tunnel View in autumn light", credit: "Photo: Aniket Deole / Unsplash", falls: "Low", fallsLine: "Low until the first real storms, possible late in the month." },
  { photo: "img/half-dome-valley-vista.jpg", alt: "Half Dome above a quiet Yosemite Valley in November", credit: "Photo: Cam DiCecca / Wikimedia Commons (CC0)", falls: "Low", fallsLine: "Short days and empty trails. Snow most years." },
  { photo: "img/half-dome-alpenglow-madhu-shesharam.jpg", alt: "Winter alpenglow on Half Dome at dusk", credit: "Photo: Madhu Shesharam / Unsplash", falls: "Low, until storms", fallsLine: "Snow when storms land, and chains in the car as a rule." },
];

// The second line of each road tile, restating deadlines.json's
// glacier-point-open, tioga-open, tioga-close and tuolumne-shuttle rows.
const PG_GLACIER = [
  "Closed for the season. It reopens once plowing is done, usually in May.",
  "Closed for the season. It reopens once plowing is done, usually in May.",
  "Closed for the season. It reopens once plowing is done, usually in May.",
  "Closed for the season. It reopens once plowing is done, usually in May.",
  "Usually opens in May once plowing is done. Chains can still be required in the first weeks.",
  "Open. The only drive to Glacier Point, and day two of the two-day plan.",
  "Open. The only drive to Glacier Point, and day two of the two-day plan.",
  "Open. The only drive to Glacier Point, and day two of the two-day plan.",
  "Open. The only drive to Glacier Point, and day two of the two-day plan.",
  "Open. Go before the first storms that close it.",
  "Closed for the season with the snow.",
  "Closed for the season with the snow.",
];
const PG_TIOGA = [
  "Closed. Late May to mid-June is the usual opening range.",
  "Closed. Late May to mid-June is the usual opening range.",
  "Closed. Late May to mid-June is the usual opening range.",
  "Closed most years. Late May to mid-June is the usual opening range.",
  "Opens late May in some years, announced a day or two ahead.",
  "Open in most years by mid-June. The park posts plowing progress weekly.",
  "Open, with Tuolumne's shuttle and store running.",
  "Open, with Tuolumne's shuttle and store running.",
  "Open. Tuolumne's services close after mid-September: a day up high is self-supported.",
  "Open until the first storm that sticks. No services in Tuolumne.",
  "Closes with the first storm that sticks, usually in November.",
  "Closed for the season.",
];
// deadlines.json: halfdome-preseason, halfdome-daily, halfdome-cables.
const PG_HALFDOME = [
  ["Cables down", "No permit is issued for a day outside the cables season."],
  ["Cables down", "No permit is issued for a day outside the cables season."],
  ["Lottery open", "Cables are down, but the preseason lottery for summer dates runs March 1 to 31."],
  ["Cables down", "Preseason results arrive by email in mid-April."],
  ["Cables up late May", "They go up the Friday before Memorial Day. Daily lottery two days ahead."],
  ["Cables up", "Daily lottery: apply two days ahead, midnight to 4 p.m. Pacific."],
  ["Cables up", "Daily lottery: apply two days ahead, midnight to 4 p.m. Pacific."],
  ["Cables up", "Daily lottery: apply two days ahead, midnight to 4 p.m. Pacific."],
  ["Cables up", "Daily lottery: apply two days ahead, midnight to 4 p.m. Pacific."],
  ["Cables up to mid-month", "Down the day after the second Monday in October."],
  ["Cables down", "No permit is issued for a day outside the cables season."],
  ["Cables down", "No permit is issued for a day outside the cables season."],
];
// deadlines.json: grove-shuttle (May to October; reduced November service;
// none December to mid-April, when the Washburn Trail is the way in).
const PG_WALK = ["Walk in", "No shuttle. The Washburn Trail is 2 miles and 500 feet up to the trees."];
const PG_SHUTTLE = ["Shuttle running", "Free from the Welcome Plaza to the grove."];
const PG_GROVE = [
  PG_WALK, PG_WALK, PG_WALK,
  ["Walk in to mid-April", "No shuttle until mid-April. The Washburn Trail is 2 miles and 500 feet up."],
  PG_SHUTTLE, PG_SHUTTLE, PG_SHUTTLE, PG_SHUTTLE, PG_SHUTTLE, PG_SHUTTLE,
  ["Shuttle, 8 to 3:30", "Reduced November service from the Welcome Plaza."],
  PG_WALK,
];

// The park's month index, 0 to 11 (America/Los_Angeles, like /stay).
function pgParkMonthIndex() {
  try {
    return Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", month: "numeric" }).format(new Date())) - 1;
  } catch (e) {
    return new Date().getMonth();
  }
}

// A month the reader already gave the trip selector wins over today's.
function pgInitialMonth() {
  const months = window.TRIP_MONTHS || [];
  try {
    const stored = JSON.parse(window.safeStorage.get("tfg.trip.selector", "null") || "null");
    const i = stored && stored.when ? months.findIndex((m) => m.key === stored.when) : -1;
    if (i >= 0) return i;
  } catch (e) { /* fall through */ }
  return pgParkMonthIndex();
}

function pgMonth(i) {
  const months = window.TRIP_MONTHS;
  const m = months[i];
  // The campground 15th rule: each 15th opens arrivals four months later.
  return Object.assign({}, m, PG_MONTH_EXTRA[i], {
    glacierLine: PG_GLACIER[i],
    tiogaLine: PG_TIOGA[i],
    halfdome: PG_HALFDOME[i],
    grove: PG_GROVE[i],
    campBy: months[(i + 8) % 12].name + " 15",
    campEarly: months[(i + 7) % 12].name + " 15",
  });
}

const PG_STATUS = {
  open: { label: "Typically open", color: "var(--pg-open)" },
  closed: { label: "Closed", color: "var(--pg-closed)" },
  unsettled: { label: "Opening, not yet certain", color: "var(--pg-warn)" },
};

// ---------------------------------------------------------------------------
// Step 03: lodging. Drive ranges restate GATEWAYS in page-stay.jsx, drawn on
// its 0 to 120 minute scale.
// ---------------------------------------------------------------------------

const PG_SEARCH_PLACES = [
  { id: "mariposa", dest: "Mariposa, California" },
  { id: "el-portal", dest: "El Portal, California" },
  { id: "groveland", dest: "Groveland, California" },
  { id: "oakhurst", dest: "Oakhurst, California" },
  { id: "park", dest: "Yosemite National Park" },
];

const PG_TOWNS = [
  { id: "el-portal", name: "El Portal", dest: "El Portal, California", road: "Highway 140 · year-round", drive: "25 to 35 min", bar: 29,
    photo: "img/el-portal-yosemite-valley-railroad-cars.jpg", alt: "Yosemite Valley Railroad cars at El Portal", credit: "Yosemite Park & Curry Co. / Wikimedia Commons (public domain)",
    line: "The closest beds outside the gate, on the river road that stays low all winter." },
  { id: "mariposa", name: "Mariposa", dest: "Mariposa, California", road: "Highway 140 · year-round", drive: "45 to 60 min", bar: 50,
    photo: "img/mariposa-county-courthouse.jpg", alt: "The 1854 Mariposa County Courthouse", credit: "Guywelch2000 / Wikimedia Commons (CC0)",
    line: "A real town with restaurants and the most rooms, on the corridor that rarely takes chains." },
  { id: "groveland", name: "Groveland", dest: "Groveland, California", road: "Highway 120 · chains common in winter", drive: "65 to 80 min", bar: 67,
    photo: "img/groveland-main-street-highway-120.jpg", alt: "Main Street in Groveland, which is Highway 120", credit: "Almonroth / Wikimedia Commons (CC BY-SA 3.0)",
    line: "Hetch Hetchy, the Tuolumne side, and Bay Area arrivals. Easier last-minute rooms in shoulder season." },
  { id: "oakhurst", name: "Oakhurst", dest: "Oakhurst, California", road: "Highway 41 · year-round", drive: "75 to 90 min · 20 to the Grove", bar: 75,
    photo: "img/oakhurst-highway-41-ken-lund.jpg", alt: "Highway 41 through downtown Oakhurst, with Deadwood Mountain behind", credit: "Ken Lund / Wikimedia Commons (CC BY-SA 2.0)",
    line: "The base for the Mariposa Grove and Glacier Point, with the Valley a longer day away." },
];

// In-park beds book through the concessioner, never a third party (/stay's
// rule). Badges and price lines restate IN_PARK in page-stay.jsx.
const PG_TRAVEL_YOSEMITE = "https://www.travelyosemite.com/lodging/";
const PG_IN_PARK = [
  { badge: "Top pick · a first trip", name: "Yosemite Valley Lodge", line: "Mid-range, and the best value for its location in the park." },
  { badge: "Cheapest roof in the Valley", name: "Curry Village", line: "Tent cabins and cabins below Glacier Point. Reduced in winter." },
  { badge: "The splurge", name: "The Ahwahnee", line: "The most expensive bed in the park, several times the Lodge rate." },
];

function pgIsoToday() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

// The dated search. Like /stay's, dates ride along only as a valid pair.
function PgStaySearch() {
  const [place, setPlace] = useStatePg("mariposa");
  const [checkin, setCheckin] = useStatePg("");
  const [checkout, setCheckout] = useStatePg("");
  const [adults, setAdults] = useStatePg("2");
  const row = PG_SEARCH_PLACES.find((p) => p.id === place) || PG_SEARCH_PLACES[0];
  const dated = !!(checkin && checkout && checkout > checkin);
  let url = window.expediaSearchUrl(row.dest) + "&adults=" + adults;
  if (dated) url += "&startDate=" + checkin + "&endDate=" + checkout + "&d1=" + checkin + "&d2=" + checkout;
  const search = { href: window.buildAffiliateLink ? window.buildAffiliateLink("expedia", url) : url };
  const today = pgIsoToday();
  return (
    <form className="pg-search" onSubmit={(e) => e.preventDefault()}>
      <label className="pg-field pg-field--where">
        <span>Where</span>
        <select value={place} onChange={(e) => setPlace(e.target.value)}>
          {PG_SEARCH_PLACES.map((p) => <option key={p.id} value={p.id}>{p.dest}</option>)}
        </select>
      </label>
      <label className="pg-field">
        <span>Check in</span>
        <input type="date" value={checkin} min={today} onChange={(e) => setCheckin(e.target.value)} />
      </label>
      <label className="pg-field">
        <span>Check out</span>
        <input type="date" value={checkout} min={checkin || today} onChange={(e) => setCheckout(e.target.value)} />
      </label>
      <label className="pg-field pg-field--guests">
        <span>Guests</span>
        <select value={adults} onChange={(e) => setAdults(e.target.value)}>
          {["1", "2", "3", "4", "5", "6"].map((n) => <option key={n} value={n}>{n} {n === "1" ? "adult" : "adults"}</option>)}
        </select>
      </label>
      <a
        className="aff-link pg-btn pg-btn--accent pg-search__go"
        href={search.href}
        target="_blank"
        rel="sponsored noopener"
        data-aff-network="expedia"
        data-aff-list="planning_search"
        data-aff-item-slug={row.id}
        data-aff-name={row.dest + " lodging search"}
      >Search stays on Expedia ↗</a>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Small pieces.
// ---------------------------------------------------------------------------

function PgStatusText({ state, className }) {
  const s = PG_STATUS[state] || PG_STATUS.open;
  return <p className={className} style={{ color: s.color }}>{s.label}</p>;
}

// The area card's photo badge: always-open roads say so, seasonal ones read
// the month.
function PgAreaBadge({ state, month, always }) {
  if (always) return <span className="pg-badge pg-badge--ink">{always}</span>;
  if (state === "closed") return <span className="pg-badge pg-badge--closed">Road closed in {month}</span>;
  if (state === "unsettled") return <span className="pg-badge pg-badge--warn">Opening in {month}, some years</span>;
  return <span className="pg-badge pg-badge--open">Reachable in {month}</span>;
}

// The four corners on the official NPS map. The crop is img/nps-yosemite-
// four-corners-map.jpg (980 x 1200, cut from img/nps-yosemite-park-map.jpg at
// +380+770), so the overlay shares its pixel space. The road lines trace the
// map's own Tioga Road and Glacier Point Road.
const PG_TIOGA_LINE = "-10,290 40,215 110,165 180,158 300,165 318,230 360,262 405,276 470,258 520,228 565,205 610,160 650,125 700,110 760,110 790,117";
const PG_GLACIER_LINE = "42,701 85,638 183,652 239,659 296,631 310,581 313,504";

function PgCornersMap({ month, tioga, glacier }) {
  const road = (points, state) => (
    <React.Fragment>
      <polyline points={points} className="pg-map__road" style={{ stroke: PG_STATUS[state].color }} />
      {state === "closed" && <polyline points={points} className="pg-map__road-gap" />}
    </React.Fragment>
  );
  const label = (x, y, w, text) => (
    <g>
      <rect x={x} y={y} width={w} height="60" rx="30" className="pg-map__tag" />
      <text x={x + 26} y={y + 40} className="pg-map__tag-text">{text}</text>
    </g>
  );
  return (
    <div className="pg-map">
      <p className="pg-kicker">The four corners · roads in {month}</p>
      <div className="pg-map__frame">
        <ResponsiveImage image="img/nps-yosemite-four-corners-map.jpg" alt="The official National Park Service map of Yosemite, cropped from Tuolumne Meadows south to the Mariposa Grove" sizes="(max-width: 760px) 100vw, 440px" className="pg-map__img" />
        <svg viewBox="0 0 980 1200" role="img" aria-label="Markers for Yosemite Valley, Glacier Point, the Mariposa Grove and Tuolumne Meadows, with Tioga Road and Glacier Point Road highlighted">
          {road(PG_TIOGA_LINE, tioga)}
          {road(PG_GLACIER_LINE, glacier)}
          <circle cx="282" cy="455" r="17" className="pg-map__pin" />
          <circle cx="313" cy="504" r="17" className="pg-map__pin" />
          <circle cx="225" cy="1116" r="17" className="pg-map__pin" />
          <circle cx="788" cy="117" r="17" className="pg-map__pin" />
          {label(18, 330, 440, "1 · Yosemite Valley, the hub")}
          {label(345, 530, 420, "2 · Glacier Point · 60 min")}
          {label(262, 1080, 440, "3 · Mariposa Grove · 75 min")}
          {label(470, 150, 500, "4 · Tuolumne Meadows · 90 min")}
        </svg>
      </div>
      <div className="pg-map__key">
        <span><i style={{ background: "var(--pg-open)" }} />Seasonal road, open</span>
        <span><i style={{ background: "var(--pg-closed)" }} />Closed</span>
        <span><i style={{ background: "var(--pg-warn)" }} />Opening, uncertain</span>
      </div>
      <p className="pg-note">Map: National Park Service (public domain). Drive times from the Valley, from the park's own table, one way, no traffic.</p>
    </div>
  );
}

const PG_AREAS = [
  { key: "valley", num: "01", kicker: "The hub · 4,000 ft", name: "Yosemite Valley", always: "Open all year",
    photo: "img/lower-yosemite-fall-footbridge.jpg", alt: "Lower Yosemite Fall from the footbridge", credit: "James St. John / Wikimedia Commons (CC BY 2.0)",
    body: "The valley floor and the walls around it: El Capitan, the falls, the meadows, the Mist Trail, most of the beds. Park once and ride the free shuttle.",
    give: "Give it: a full day, minimum" },
  { key: "glacier", num: "02", kicker: "The south rim · 7,214 ft", name: "Glacier Point", road: "glacier",
    photo: "img/half-dome-sunset-glacier-point-joshua-earle.jpg", alt: "Half Dome at sunset from Glacier Point", credit: "Joshua Earle / Unsplash",
    body: "The view that looks back down on everything you walked the day before: Half Dome, Nevada and Vernal Falls, the whole Valley. Taft Point and Sentinel Dome on the way.",
    give: "Give it: a half day, sunset if you can" },
  { key: "grove", num: "03", kicker: "The giant sequoias · South Entrance", name: "Mariposa Grove", always: "Hwy 41 open all year",
    photo: "img/mariposa-grove-grizzly-giant-nieves.jpg", alt: "The Grizzly Giant in the Mariposa Grove", credit: "Nieves / Pexels",
    body: "Five hundred giant sequoias, the Grizzly Giant among them, just inside the South Entrance. Pairs with Glacier Point on the same drive, or with a night in Oakhurst.",
    give: "Give it: three hours, with the walk" },
  { key: "tuolumne", num: "04", kicker: "The high country · 8,600 ft", name: "Tuolumne Meadows", road: "tioga",
    photo: "img/tenaya-lake.jpg", alt: "Tenaya Lake on Tioga Road", credit: "Michael Hogarth / Wikimedia Commons (public domain)",
    body: "Granite domes, subalpine lakes, a meadow the size of a town, and half the crowd. A different park, reached only on Tioga Road.",
    give: "Give it: a full day, west to east" },
];

// The comparison table's rows: [label, guide, letter, field guide]. true is a
// tick, false a rule, a string is a tick with a note.
const PG_COMPARE = [
  ["Seasons, permits, lodging and trail articles", true, true, true],
  ["Road openings and booking windows, by email", false, true, "trip board"],
  ["A map of the main destinations", false, "31 pins", true],
  ["3D topographic map of the whole park, offline", false, false, true],
  ["44 stops in driving order, with parking and timing notes", false, false, true],
  ["57 day hikes with GPS tracks", false, false, true],
  ["This week's ranger and interpretive programs, by day and area", false, false, true],
  ["A day-by-day planner for your own trip", false, false, true],
  ["50 Secret Guide entries, beyond the obvious", false, false, true],
];

function PgCell({ value, product }) {
  const cls = product ? "pg-compare__product" : undefined;
  if (value === false) return <td className={cls}><span className="pg-no" aria-label="Not included" /></td>;
  return (
    <td className={cls}>
      <span className="pg-yes" aria-label="Included">✓</span>
      {typeof value === "string" && <span className="pg-yes__note"> {value}</span>}
    </td>
  );
}

// ---------------------------------------------------------------------------
// The page.
// ---------------------------------------------------------------------------

function PlanningGuide({ go }) {
  const filters = window.useIntentFilters();
  const resultsRef = useRefPg(null);
  const [jumped, setJumped] = useStatePg(false);
  const [monthIndex, setMonthIndex] = useStatePg(pgInitialMonth);
  const [planDone, setPlanDone] = useStatePg(false);
  const [openPart, setOpenPart] = useStatePg(null);
  const [showFilters, setShowFilters] = useStatePg(false);

  const matches = window.filterArticlesByIntent(window.ARTICLES, filters.value);
  const filtering = filters.count > 0;
  const listing = filtering || filters.browse;
  const filtersOpen = showFilters || listing;

  const sel = pgMonth(monthIndex);
  const tioga = sel.tioga;
  const glacier = sel.glacier;

  // A hand-off from the trip selector ("show all N entries that fit this trip")
  // sets the filters and then moves the reader to the results.
  useEffectPg(() => {
    if (!jumped) return;
    setJumped(false);
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [jumped]);

  const applyIntent = (intent) => {
    filters.apply(intent);
    setShowFilters(true);
    setJumped(true);
  };

  const togglePart = (i) => {
    if (window.track) window.track("cta_click", { location: "planning_index", target: `#part-${i + 1}` });
    setOpenPart((cur) => (cur === i ? null : i));
  };

  const part = openPart == null ? null : PLANNING_PARTS[openPart];
  const partItems = part ? planningPartSlugs(part.part).map((s) => window.findArticle(s)).filter(Boolean) : [];

  return (
    <div className="page hp-design hp-planning">

      {/* ============ HERO ============ */}
      <section className="hp-wrap pg-hero">
        <div className="pg-hero__copy">
          <p className="pg-crumbs">
            <a href="/" onClick={(e) => { e.preventDefault(); go("home"); }}>Home</a> &nbsp;/&nbsp; The Planning Guide
          </p>
          <p className="pg-eyebrow">The Planning Guide</p>
          <h1 className="pg-hero__title">Yosemite,<br />planned <em>properly.</em></h1>
          <p className="pg-hero__intro">Four decisions, in the order the park makes you take them: when you go, which of its four corners you can reach, where you sleep, and what you do each day. Twenty minutes here saves a day of driving there.</p>
          <div className="pg-actions">
            <HomeLink go={go} location="planning_hero" className="pg-btn pg-btn--ink" href="#step-1">Start with your month &nbsp;↓</HomeLink>
            <HomeLink go={go} location="planning_hero" className="pg-btn pg-btn--ghost" href="#guide">See the Field Guide · $3.99</HomeLink>
          </div>
          <p className="aff-disclosure pg-hero__aff">Some links on this page are affiliate links. <a href="/affiliate">How we choose them</a>.</p>
        </div>
        <figure className="pg-hero__figure">
          <ResponsiveImage image="img/tunnel-view-valley-spring.jpg" alt="Tunnel View in spring: El Capitan, Bridalveil Fall and Half Dome above the Valley" sizes="(max-width: 760px) 100vw, 680px" eager className="pg-hero__img" />
          <div className="pg-steps">
            <p className="pg-kicker">Your plan, in four steps</p>
            <ol>
              {[["01", "Visit", "Your month sets the roads", "#step-1"], ["02", "Where", "The four corners", "#step-2"], ["03", "Sleep", "In the park or a gateway", "#step-3"], ["04", "Each day", "A plan, then the app", "#step-4"]].map(([n, t, d, href]) => (
                <li key={n}>
                  <HomeLink go={go} location="planning_steps" href={href}>
                    <span className="pg-stepnum">{n}</span><strong>{t}</strong><span>{d}</span>
                  </HomeLink>
                </li>
              ))}
            </ol>
          </div>
          <figcaption className="pg-credit pg-credit--corner">Kyle D / Wikimedia Commons (public domain)</figcaption>
        </figure>
      </section>

      {/* ============ STEP 01 · MONTH ============ */}
      <section className="pg-month" id="step-1" tabIndex={-1}>
        <div className="pg-month__bg" aria-hidden="true">
          <ResponsiveImage key={sel.photo} image={sel.photo} alt="" sizes="100vw" className="pg-month__img" />
        </div>
        <div className="hp-wrap pg-month__inner">
          <div className="pg-head">
            <div>
              <p className="pg-eyebrow pg-eyebrow--gold">Step 01 · When are you going</p>
              <h2 className="pg-h2">The month decides the park.</h2>
            </div>
            <p className="pg-sub">Two roads open and close with the snow, and they are the only way to two of the park's four corners. Pick your month and the rest of this page redraws around it.</p>
          </div>
          <div className="pg-months" role="group" aria-label="Choose your month">
            {window.TRIP_MONTHS.map((m, i) => (
              <button key={m.key} type="button" className={"pg-monthbtn" + (i === monthIndex ? " is-on" : "")} aria-pressed={i === monthIndex} onClick={() => setMonthIndex(i)}>{m.label}</button>
            ))}
          </div>
          <div className="pg-month__row">
            <div className="pg-month__note">
              <p className="pg-eyebrow pg-eyebrow--gold">{sel.name} in Yosemite</p>
              <p className="pg-month__lede">{sel.note}</p>
              <a href={`/articles/${sel.read}`}>Read the {sel.name} guide ↗</a>
            </div>
            <div className="pg-road">
              <p className="pg-kicker">Glacier Point Road</p>
              <PgStatusText state={glacier} className="pg-road__state" />
              <p className="pg-road__line">{sel.glacierLine}</p>
            </div>
            <div className="pg-road">
              <p className="pg-kicker">Tioga Road</p>
              <PgStatusText state={tioga} className="pg-road__state" />
              <p className="pg-road__line">{sel.tiogaLine}</p>
            </div>
          </div>
          <div className="pg-facts">
            <div className="pg-fact"><p className="pg-fact__k">Waterfalls</p><p className="pg-fact__v">{sel.falls}</p><p className="pg-fact__d">{sel.fallsLine}</p></div>
            <div className="pg-fact"><p className="pg-fact__k">Half Dome</p><p className="pg-fact__v">{sel.halfdome[0]}</p><p className="pg-fact__d">{sel.halfdome[1]}</p></div>
            <div className="pg-fact"><p className="pg-fact__k">Mariposa Grove</p><p className="pg-fact__v">{sel.grove[0]}</p><p className="pg-fact__d">{sel.grove[1]}</p></div>
            <div className="pg-fact"><p className="pg-fact__k">Valley campsites</p><p className="pg-fact__v">Book {sel.campBy}</p><p className="pg-fact__d">The Pines, Wawona and Hodgdon Meadow open at 7 a.m. Pacific for arrivals from the 15th. Arriving before the 15th? {sel.campEarly}.</p></div>
          </div>
          <div className="pg-month__foot">
            <p>Typical years only. For this week's status, <a href="/now">the Park Bulletin</a> and <a href="/conditions#road-alerts">road alerts by email</a>. Every deadline on <a href="/dates">the dates page</a>.</p>
            <p className="pg-month__credit">{sel.credit}</p>
          </div>
        </div>
      </section>

      {/* ============ STEP 02 · FOUR CORNERS ============ */}
      <section className="pg-sand" id="step-2" tabIndex={-1}>
        <div className="hp-wrap pg-section">
          <div className="pg-head">
            <div>
              <p className="pg-eyebrow">Step 02 · Where in the park</p>
              <h2 className="pg-h2">One park, four places.<br />Pick two, not four.</h2>
            </div>
            <p className="pg-sub">Yosemite is the size of Rhode Island and the corners are hours apart. Most frustrating trips try to see all of them in a day. Here is what each one is, how far it sits from the Valley, and whether your month can reach it.</p>
          </div>

          <div className="pg-corners">
            <PgCornersMap month={sel.name} tioga={tioga} glacier={glacier} />
            <div className="pg-areas">
              {PG_AREAS.map((a) => (
                <article key={a.key} className="pg-area">
                  <div className="pg-area__media">
                    <ResponsiveImage image={a.photo} alt={a.alt} sizes="(max-width: 760px) 92px, 400px" className="pg-area__img" />
                    <PgAreaBadge always={a.always} month={sel.name} state={a.road === "glacier" ? glacier : a.road === "tioga" ? tioga : "open"} />
                    <span className="pg-credit pg-credit--corner">{a.credit}</span>
                  </div>
                  <div className="pg-area__body">
                    <p className="pg-kicker">{a.num} · {a.kicker}</p>
                    <h3>{a.name}</h3>
                    <p className="pg-area__text">{a.body}</p>
                    <p className="pg-area__give">{a.give}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* The 3D map, in real captures from the Field Guide. */}
          <div className="pg-ad">
            <div className="pg-ad__copy">
              <p className="pg-eyebrow pg-eyebrow--gold">Inside the Field Guide · the 3D map</p>
              <h3>See all four corners in 3D, on the real terrain.</h3>
              <p>Tilt the park, then drop into it. Every viewpoint, trailhead, day hike and parking lot sits on the actual relief, with the trails colored by difficulty. Download a region before you leave and it all works with no signal.</p>
              <div className="pg-actions">
                <HomeLink go={go} location="planning_map_ad" className="pg-btn pg-btn--light" href="/guide">Get the Field Guide &nbsp;<span className="pg-price">$3.99</span></HomeLink>
                <span className="pg-ad__note">Actual screens · Yosemite Valley, looking east</span>
              </div>
            </div>
            <div className="pg-ad__media">
              <img src="/img/guide/screens/map-3d-valley.v5.webp" alt="The Field Guide's 3D map looking east up Yosemite Valley, with stop pins, Northside and Southside Drives, the Merced River and trails colored by difficulty" width="1600" height="663" loading="lazy" decoding="async" className="pg-ad__wide" />
              <div className="pg-ad__phone"><img src="/img/guide/screens/map-3d-phone.v5.webp" alt="The same 3D map on a phone" width="640" height="1387" loading="lazy" decoding="async" /></div>
              <span className="pg-ad__tag">3D · works offline</span>
            </div>
          </div>
          <p className="pg-note pg-note--body">A fifth corner, Hetch Hetchy, has its own entrance and day-use hours. Open year-round and nearly empty. <a href="/articles/hetch-hetchy-the-other-yosemite-valley">Read about Hetch Hetchy</a>.</p>
        </div>
      </section>

      {/* ============ STEP 03 · WHERE TO STAY ============ */}
      <section className="hp-wrap pg-section" id="step-3" tabIndex={-1}>
        <div className="pg-head">
          <div>
            <p className="pg-eyebrow">Step 03 · Where you sleep</p>
            <h2 className="pg-h2">Your bed sets your drive.</h2>
          </div>
          <p className="pg-sub">This is the booking with the earliest deadline. In-park beds open 366 days ahead and gateway rooms fill six to twelve months out for summer dates. Everything else in this guide flexes; this does not.</p>
        </div>

        <PgStaySearch />

        <div className="pg-towns">
          <div className="pg-towns__head"><h3>Outside the gate: the gateway towns</h3><span>Drive to the Valley floor, one way</span></div>
          <div className="pg-towns__grid">
            {PG_TOWNS.map((t) => (
              <article key={t.id} className="pg-town">
                <figure className="pg-town__media">
                  <ResponsiveImage image={t.photo} alt={t.alt} sizes="(max-width: 760px) 100vw, 320px" className="pg-town__img" />
                  <figcaption className="pg-credit pg-credit--corner">{t.credit}</figcaption>
                </figure>
                <div className="pg-town__body">
                  <h4>{t.name}</h4>
                  <p className="pg-town__road">{t.road}</p>
                  <div className="pg-town__bar" aria-hidden="true"><span style={{ width: t.bar + "%" }} /></div>
                  <p className="pg-town__drive">{t.drive}</p>
                  <p className="pg-town__line">{t.line}</p>
                  <AvailabilityLink destination={t.dest} list="planning_town" slug={t.id} name={t.name + " lodging search"} className="pg-btn pg-btn--accent pg-town__go">
                    Search {t.name} ↗
                  </AvailabilityLink>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="pg-inpark">
          <figure className="pg-inpark__media">
            <ResponsiveImage image="img/curry-village.jpg" alt="Tent cabins at Curry Village" sizes="(max-width: 760px) 100vw, 420px" className="pg-inpark__img" />
            <figcaption>
              <p className="pg-inpark__title">Inside the gate</p>
              <p>Booked through the park's concessioner, never a third party.</p>
            </figcaption>
          </figure>
          <div className="pg-inpark__list">
            {PG_IN_PARK.map((p) => (
              <div key={p.name} className="pg-inpark__row">
                <div><p className="pg-inpark__badge">{p.badge}</p><p className="pg-inpark__name">{p.name}</p></div>
                <p className="pg-inpark__line">{p.line}</p>
                <a className="pg-btn pg-btn--ghost" href={PG_TRAVEL_YOSEMITE} target="_blank" rel="noopener noreferrer">Check dates ↗</a>
              </div>
            ))}
            <div className="pg-inpark__foot">
              <p>Gone for your dates? Mariposa and El Portal hold the most rooms within an hour. <AvailabilityLink destination="Mariposa, California" list="planning_in_park" slug="mariposa" name="Mariposa lodging search">Search them ↗</AvailabilityLink></p>
              <a href="/stay" onClick={(e) => { if (e.button !== 0 || e.metaKey || e.ctrlKey) return; e.preventDefault(); go("stay"); }}>The full lodging board →</a>
            </div>
          </div>
        </div>
        <p className="pg-note">Filled buttons search Expedia, and we may earn a commission at no cost to you. It never changes what we recommend: <a href="/affiliate">the affiliate policy</a>.</p>
      </section>

      {/* ============ STEP 04 · EACH DAY ============ */}
      <section className="pg-sand" id="step-4" tabIndex={-1}>
        <div className="hp-wrap pg-section">
          <div className="pg-head">
            <div>
              <p className="pg-eyebrow">Step 04 · What you do each day</p>
              <h2 className="pg-h2">Five questions. One plan.</h2>
            </div>
            <p className="pg-sub">Answer all five and the page hands back a day-by-day route capped to what your month's roads allow, the five articles worth reading first, and when to be through the gate.</p>
          </div>
          <div className={"pg-plan" + (planDone ? " is-done" : "")} id="trip-selector">
            <div className="pg-plan__selector">
              <window.TripSelector go={go} onApplyIntent={applyIntent} onComplete={setPlanDone} />
            </div>
            {!planDone && (
              <div className="pg-plan__preview">
                <div className="pg-plan__top"><p className="pg-eyebrow">Your plan</p><span>{sel.name} · 2 days · first trip · views</span></div>
                <h3>The Valley, then the rim</h3>
                <div className="pg-plan__days">
                  <div><span className="pg-stepnum">Day 1</span><div><strong>Yosemite Valley, west to east</strong><p>Tunnel View, Bridalveil, the meadows, Lower Yosemite Fall. Park once.</p></div></div>
                  <div><span className="pg-stepnum">Day 2</span><div><strong>Glacier Point Road, in trailhead order</strong>
                    {glacier === "closed"
                      ? <p className="pg-plan__closed">Glacier Point Road is closed in {sel.name}. Your second day stays on the Valley floor.</p>
                      : <p>Taft Point, Sentinel Dome, then Glacier Point for the last light.</p>}
                  </div></div>
                </div>
                <p className="pg-plan__arrive"><strong>When to arrive.</strong> {sel.arrive}</p>
                <div className="pg-plan__upsell">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10 V7 a4 4 0 0 1 8 0 V10" /></svg>
                  <div><p className="pg-plan__upsell-t">Where to park for each stop, which trailhead lot fills first, and the ranger programs on your dates.</p><p className="pg-plan__upsell-d">This plan opens in the Field Guide, stop by stop, on the 3D map.</p></div>
                  <HomeLink go={go} location="planning_plan" className="pg-btn pg-btn--accent" href="/guide">Take it into the park · $3.99</HomeLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ THREE WAYS ============ */}
      <section className="hp-wrap pg-section pg-compare" id="compare">
        <div className="pg-center">
          <p className="pg-eyebrow">Three ways to plan with us</p>
          <h2 className="pg-h2">Read it free. Carry it for $3.99.</h2>
          <p className="pg-sub">Everything above stays free. The Field Guide is for the part of the trip that happens in the car, on the trail, and out of signal.</p>
        </div>
        <div className="pg-ways">
          <div className="pg-way">
            <p className="pg-eyebrow pg-eyebrow--muted">Free</p>
            <h3>The Planning Guide</h3>
            <p>This page and the articles behind it: seasons, permits, lodging, trails, getting in.</p>
            <HomeLink go={go} location="planning_compare" className="pg-btn pg-btn--ghost" href="#reading">Keep reading ↓</HomeLink>
          </div>
          <div className="pg-way">
            <p className="pg-eyebrow pg-eyebrow--muted">Free, with your email</p>
            <h3>The Sunday Letter + the trip map</h3>
            <p>One email a week with road openings and reservation windows. Signing up unlocks the trip-planning map: 31 destinations to pin, a route you can share.</p>
            <HomeLink go={go} location="planning_compare" className="pg-btn pg-btn--ghost" href="#letter">Sign up, unlock the map ↓</HomeLink>
          </div>
          <div className="pg-way pg-way--product">
            <span className="pg-way__flag">For the trip itself</span>
            <p className="pg-eyebrow">$3.99 once · 18 months</p>
            <h3>The Field Guide app</h3>
            <p>The whole park on a 3D topographic map, every stop with its parking, every hike with a GPS track, the week's ranger programs, all of it offline.</p>
            <HomeLink go={go} location="planning_compare" className="pg-btn pg-btn--accent" href="/guide">Get the Field Guide · $3.99</HomeLink>
          </div>
        </div>
        <div className="pg-compare__scroll">
          <table className="pg-compare__table">
            <caption>What each one gives you</caption>
            <thead><tr><th scope="col"><span className="pg-vh">Feature</span></th><th scope="col">Planning Guide</th><th scope="col">Letter + map</th><th scope="col" className="pg-compare__product-h">Field Guide</th></tr></thead>
            <tbody>
              {PG_COMPARE.map(([label, a, b, c]) => (
                <tr key={label}><th scope="row">{label}</th><PgCell value={a} /><PgCell value={b} /><PgCell value={c} product /></tr>
              ))}
              <tr className="pg-compare__price"><th scope="row">Price</th><td>Free</td><td>Free</td><td className="pg-compare__product">$3.99 once</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ FIELD GUIDE BAND ============ */}
      <section className="pg-guide" id="guide" tabIndex={-1}>
        <div className="hp-wrap pg-guide__grid">
          <div className="pg-guide__copy">
            <p className="pg-eyebrow pg-eyebrow--gold">The Talus Field Guide · the offline app</p>
            <h2 className="pg-h2">This page is the plan.<br />The app is the trip.</h2>
            <p className="pg-guide__intro">Most of the park has no signal. The Field Guide downloads before you leave and carries all four corners in your pocket: which lot to aim for, which hike fits the afternoon you have left, and what the rangers are leading tonight.</p>
            <ul>
              <li><span>◭</span><div><strong>The park in 3D.</strong><p>Topographic terrain you can tilt, with every stop, trailhead and lot on it.</p></div></li>
              <li><span>↳</span><div><strong>Find your next stop.</strong><p>44 stops, arranged in driving order, each with where to park.</p></div></li>
              <li><span>⌁</span><div><strong>Choose a hike that fits your day.</strong><p>57 day hikes with GPS tracks.</p></div></li>
              <li><span>◎</span><div><strong>Know what's on tonight.</strong><p>Ranger walks, talks and campfire programs, filtered to your day and area.</p></div></li>
            </ul>
            <div className="pg-actions">
              <HomeLink go={go} location="planning_hub" className="pg-btn pg-btn--light pg-btn--big" href="/guide">Get the Field Guide &nbsp;<span className="pg-price">$3.99 ↗</span></HomeLink>
              <a className="pg-guide__sample" href={`${GUIDE_PROMO_APP_BASE}/preview`} onClick={() => { if (window.track) window.track("guide_sample_click", { location: "planning_hub" }); }}>Read five entries free ↗</a>
            </div>
            <p className="pg-guide__terms">One payment · 18 months of access · 30-day guarantee · works offline</p>
          </div>
          <div className="pg-guide__screens">
            <div className="pg-phone pg-phone--left"><img src="/img/guide/screens/programs.v5.webp" alt="Field Guide programs screen" width="640" height="1385" loading="lazy" decoding="async" /></div>
            <div className="pg-phone pg-phone--mid"><img src="/img/guide/screens/region-plan.v5.webp" alt="Field Guide region planner screen" width="640" height="1385" loading="lazy" decoding="async" /></div>
            <div className="pg-phone pg-phone--right"><img src="/img/guide/screens/stop.v5.webp" alt="Field Guide stop screen with parking notes" width="640" height="1385" loading="lazy" decoding="async" /></div>
            <div className="pg-guide__offline">✓ &nbsp;All set. Even off the grid.<small>Your guide works offline</small></div>
          </div>
        </div>
      </section>

      {/* ============ READING GUIDE ============ */}
      <section className="hp-wrap pg-section pg-reading" id="reading" tabIndex={-1}>
        <div className="pg-head">
          <div>
            <p className="pg-eyebrow">Go deeper · the reading guide</p>
            <h2 className="pg-h2">Read it in the order the trip happens.</h2>
          </div>
          <button type="button" className="pg-textbtn" aria-expanded={filtersOpen} onClick={() => { if (listing) filters.clear(); setShowFilters(!filtersOpen); }}>
            {filtersOpen ? "Close the filters ↑" : "Or filter every entry by who and what →"}
          </button>
        </div>
        <div className="pg-parts">
          {PLANNING_PARTS.map((p, i) => {
            const n = planningPartSlugs(p.part).length;
            return (
              <button key={p.part} type="button" className={"pg-part" + (openPart === i ? " is-open" : "")} aria-expanded={openPart === i} aria-controls="pg-part-panel" onClick={() => togglePart(i)}>
                <span className="pg-stepnum">{p.eyebrow}</span>
                <strong>{p.title}</strong>
                <span className="pg-part__blurb">{p.blurb}</span>
                <span className="pg-part__n">{n} {n === 1 ? "entry" : "entries"} {openPart === i ? "↑" : "→"}</span>
              </button>
            );
          })}
        </div>
        {part && (
          <div className="pg-part__panel" id="pg-part-panel">
            <p className="pg-sub">{part.lede}</p>
            <div className="hp-journal-grid">
              {partItems.map((a) => <HpArticleCard key={a.slug} article={a} go={go} location="planning_part" />)}
            </div>
          </div>
        )}

        {filtersOpen && (
          <div className="pg-filters" ref={resultsRef}>
            <window.IntentFilters
              articles={window.ARTICLES}
              value={filters.value}
              onToggle={filters.toggle}
              onClear={filters.clear}
              onClearMonth={filters.clearMonth}
              onToggleBrowse={filters.toggleBrowse}
              browse={filters.browse}
              count={filters.count}
              resultCount={matches.length}
              note="Drawn from every article, not only the five parts."
            />
            {listing && (matches.length > 0 ? (
              <div className="hp-journal-grid pg-filters__results">
                {matches.map((a) => <HpArticleCard key={a.slug} article={a} go={go} location="planning_list" />)}
              </div>
            ) : (
              <p className="hp-sub pg-filters__empty">
                Nothing in the archive carries all of those at once
                {window.intentMonthOf(filters.value) ? `, in ${window.intentMonthLabel(window.intentMonthOf(filters.value))}` : ""}
                . Drop a filter and try again, or{" "}
                <a href="/search" onClick={(e) => { e.preventDefault(); go("search"); }}>search the whole site</a>.
              </p>
            ))}
          </div>
        )}
      </section>

      {/* ============ LETTER + MAP ============ */}
      <section className="hp-wrap pg-letter-wrap" id="letter" tabIndex={-1}>
        <div className="pg-letter">
          <div className="pg-letter__copy">
            <p className="pg-eyebrow">Not ready for the app? Start free.</p>
            <NewsletterInline
              heading="Get the Sunday Letter. Unlock the trip map."
              blurb="One Yosemite email a week: road openings, reservation windows, what's booked out, while you plan. Signing up opens the trip-planning map, 31 destinations you can pin into a route and share."
              location="planning_hub"
              tag="planning"
              inputLabel="Email address"
              cta="Subscribe and open the map"
              modifier="pg-nl"
            />
            <p className="pg-note">Free. One email a week. Unsubscribe in one click.</p>
          </div>
          <div className="pg-letter__map" aria-hidden="true">
            <ResponsiveImage image="img/nps-yosemite-valley-map.jpg" alt="" sizes="(max-width: 760px) 100vw, 560px" className="pg-letter__img" />
            <div className="pg-letter__lock">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10 V7 a4 4 0 0 1 8 0 V10" /></svg>
              <span>The trip map opens when you subscribe</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

window.PlanningGuide = PlanningGuide;
