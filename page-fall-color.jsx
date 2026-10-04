/* global React, HpPageHead, HpHeading, HomeLink, ResponsiveImage, WebcamStrip, AvailabilityLink, HpGuideBand, HpLetter, AffiliateDisclosure, EventIcon, NatureNotesFilm */

// =============================================================================
// FALL COLOR — `/fall-color` route. The fourth evergreen event page (October
// 2026), built on /firefall's system: the `.hp-event` class, every `.ff-*`
// layout rule, EventIcon, the NPS-map overlay. A permanent URL for the
// autumn search spike ("yosemite fall colors", "when is peak fall color in
// yosemite"), which peaks every October and which the catalog answered only
// inside the month guides.
//
// Three rules hold it up.
//   1. No year in the copy outside the archive ledger (FC_ARCHIVE), which is
//      past fact. The timing is stated as the park states it and as the
//      standing pattern by elevation, never as a forecast for this autumn.
//   2. Every species, place and window is sourced. The species, colors,
//      places and the "late October, lingering until the first heavy storm or
//      hard frost" window are the NPS fall color page
//      (nps.gov/yose/learn/nature/fall-color.htm); "not known for spectacular
//      fall colors" and "showy around mid-October" are the NPS Visiting in
//      Fall page (planyourvisit/fall.htm), which is also the source for the
//      low waterfalls; the road closures are NPS winter roads
//      (planyourvisit/wroads.htm) and conditions.htm (no overnight parking
//      along Tioga or Glacier Point Road from October 15). Three facts are
//      secondary and say so on the page: the mid-elevation dogwoods turning
//      before the Valley (Michael Frye), the Cook's Meadow elm and the El
//      Capitan Meadow oaks (Flying Dawn Marie's color reports), and the Merced
//      canyon window (the Mariposa County tourism bureau). Nothing here names a
//      viewpoint the sources do not.
//   3. Affiliate links follow /firefall's colour rule: the filled `.ff-book`
//      is only ever an Expedia availability search for a town, never a
//      property. Placements: `fall_color_town` (the gateway rows) and
//      `page_fall_color` (the closing search), inventoried in ARCHITECTURE.md.
//      The FAQ is mirrored in edge/seo.js's "/fall-color" entry; change both.
// =============================================================================

// The standing pattern, top of the park to the bottom. Each row restates a
// source named in the header.
const FC_LADDER = [
  { cls: "is-gone", when: "Late September into October", where: "The high country", what: "Aspens along the Tioga Road near the Tuolumne Grove trailhead and the Yosemite Creek picnic area, past Summit Meadow on Glacier Point Road, and the grouseberry and whortleberry of Tuolumne going orange and red at ground level." },
  { cls: "is-tight", when: "Early to mid October", where: "The middle elevations", what: "Dogwoods at 5,000 to 6,000 feet on Highways 41 and 120 and in the Tuolumne Grove turn reds the Valley rarely shows, and turn first. Wawona's black oaks and dogwoods follow." },
  { cls: "is-open", when: "Mid October to early November", where: "Yosemite Valley", what: "Bigleaf maples and black oaks are showy from about mid-October; the Valley's color usually builds through late October and holds until the first heavy storm or hard frost." },
  { cls: "is-open", when: "Late October to mid November", where: "El Portal and the Merced canyon", what: "Willows, cottonwoods and poison oak along the river on Highway 140, the last band of the season below the park." },
];

// The trees, with the colour each one turns. `swatch` is drawn as a dot.
const FC_TREES = [
  { name: "Bigleaf maple", color: "Bright yellow", swatch: "#e2b42b", where: "Lines the creeks and the river along the Valley's south wall, from below Bridalveil Creek past Sentinel Creek to Happy Isles." },
  { name: "California black oak", color: "Orange-brown to golden yellow", swatch: "#c5822b", where: "The Valley meadows and Wawona, standing in the open where the light reaches them." },
  { name: "Pacific dogwood", color: "Reds, pinks and yellow", swatch: "#b8402a", where: "Under the conifers in the Valley and Wawona, and brightest at middle elevations." },
  { name: "Black and Fremont cottonwood", color: "Brilliant yellow", swatch: "#e8c843", where: "Along the Merced in the Valley and down the canyon at El Portal." },
  { name: "Quaking aspen", color: "Yellow", swatch: "#f0d24a", where: "Roadside stands on the Tioga Road and Glacier Point Road, the first to turn." },
  { name: "Poison oak", color: "Red to purple", swatch: "#7c2a3a", where: "Low-elevation slopes and the El Portal riverbank. Admire it from the trail." },
];

// The NPS Valley map, whole (img/nps-yosemite-valley-map.jpg, 2560 x 1000),
// so the overlay shares its pixel space. Each pin is a place one of the
// header's sources names; `at` is the point, `pin` where the marker sits when
// it would cover the map's own label, joined by a lead line.
const FC_PINS = [
  { n: 1, at: [550, 883], pin: [506, 947], label: "Bridalveil Creek: where the south-wall maples begin" },
  { n: 2, at: [1011, 653], label: "El Capitan Meadow: the black oaks" },
  { n: 3, at: [1395, 522], pin: [1472, 563], label: "Sentinel Creek and Sentinel Beach: maples along the south wall" },
  { n: 4, at: [1564, 381], pin: [1623, 432], label: "Yosemite Valley Chapel: the red sugar maple" },
  { n: 5, at: [1536, 301], label: "Cook's Meadow: the early-turning elm, Yosemite Falls behind" },
  { n: 6, at: [2083, 580], label: "Happy Isles: the east end of the maple strip" },
];

const FC_ELSEWHERE = [
  ["Wawona", "Black oaks and dogwoods, as in the Valley, on the road to the Mariposa Grove."],
  ["Glacier Point Road", "Deer brush goes yellow, and aspens stand past Summit Meadow and along the old road from Badger Pass to Bridalveil Creek Campground."],
  ["Tioga Road", "Aspen stands near the Tuolumne Grove trailhead and the Yosemite Creek picnic area. The road closes for the winter, usually sometime in November."],
  ["Tuolumne Meadows", "Low color: grouseberry and whortleberry in oranges and reds across the meadow edges."],
  ["El Portal", "Willows, cottonwoods and poison oak along the Merced, at the bottom of the season."],
];

const FC_SOURCES = [
  ["NPS fall color", "The park's own species list, places and timing", "https://www.nps.gov/yose/learn/nature/fall-color.htm"],
  ["NPS current conditions", "Road status, closures and smoke", "https://www.nps.gov/yose/planyourvisit/conditions.htm"],
  ["NPS winter roads", "When Tioga and Glacier Point roads close, and chain rules", "https://www.nps.gov/yose/planyourvisit/wroads.htm"],
  ["NWS point forecast, Yosemite Valley", "Overnight lows: a hard freeze ends the season", "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936"],
  ["Caltrans QuickMap", "Chain controls on Highways 140, 41 and 120", "https://quickmap.dot.ca.gov/"],
  ["Michael Frye's blog", "A Valley photographer's running notes on the color", "https://www.michaelfrye.com/"],
];

// Past fact from the park's own naturalists, the page's only dated copy.
const FC_ARCHIVE = [
  ["1929", "The elms go first", "At the end of September the first spangles of autumn color showed in the exotic elms along the village street, while the native trees held their green. The elm in Cook's Meadow still turns ahead of everything around it.", "/archive/1929/vol-8-no-11/"],
  ["1935", "Frost does not paint the leaves", "Junior Park Naturalist C. A. Wagner on the common belief: frost does not cause or enhance the color, it kills the leaves and so prevents it. His test still works: trees in warm, sunny places color brighter than trees in cool shade.", "/archive/1935/vol-14-no-11/"],
  ["1942", "Glorious in reds", "The Happy Isles nature walk: the dogwood, at its best with white blossoms in early spring, “is glorious in reds during the season of fall coloring.”", "/archive/1942/vol-21-no-1/"],
  ["1951", "“Nothing but rocks”", "Shirley Sargent was warned that fall was a terrible time to come: the falls dry, the river low. She arrived on October 19 to dogwood crimson-bright along the Merced, yellowing azaleas, oaks and maples, ferns like uncured tobacco leaves, and a Valley with almost no one in it.", "/archive/1951/vol-30-no-11/"],
];

const FC_TOWNS = [
  { id: "el-portal", name: "El Portal", dest: "El Portal, California", drive: "25 to 35 min", road: "Highway 140", note: "The closest beds outside the boundary, on the river where the season ends: willows and cottonwoods below the lodges." },
  { id: "mariposa", name: "Midpines and Mariposa", dest: "Mariposa, California", drive: "45 to 60 min", road: "Highway 140", note: "The deepest inventory on the road that stays open all winter, so a late-season storm does not strand the trip." },
  { id: "groveland", name: "Groveland", dest: "Groveland, California", drive: "65 to 80 min", road: "Highway 120", note: "The approach through Crane Flat and the Big Oak Flat Road, where the middle-elevation dogwoods turn first." },
  { id: "oakhurst", name: "Fish Camp and Oakhurst", dest: "Oakhurst, California", drive: "75 to 90 min", road: "Highway 41", note: "The Wawona Road: dogwoods on the climb and Wawona's oaks on the way in." },
];

// Mirrored in edge/seo.js's "/fall-color" faq (the JSON-LD). Change both.
const FC_FAQ = [
  ["When is peak fall color in Yosemite?", "In Yosemite Valley, usually late October into early November. The park's maples and black oaks are showy from about mid-October, and the Valley's color holds until the first heavy winter storm or hard frost, which in some years is early December. The high country turns weeks earlier."],
  ["Is Yosemite good for fall colors?", "In places. The park says it is not known for spectacular fall color, because most of its trees are evergreen. What it has is concentrated: maples along the south wall, black oaks in the meadows, dogwoods under the conifers, aspens up high. Against grey granite it reads brighter than the acreage suggests."],
  ["Where are the best fall colors in Yosemite Valley?", "The bigleaf maples along the south wall from below Bridalveil Creek past Sentinel Creek to Happy Isles, the black oaks in El Capitan Meadow, the sugar maple beside the Yosemite Valley Chapel, and the elm in Cook's Meadow, which turns first."],
  ["When do the aspens turn on Tioga Road?", "Late September through October, earliest of anything in the park. Look near the Tuolumne Grove trailhead and the Yosemite Creek picnic area. The road closes for the winter, usually sometime in November."],
  ["Are the waterfalls running in the fall?", "Barely. Yosemite Falls is often a trickle or dry from late summer until the autumn storms; Vernal, Nevada and Bridalveil run all year but slow to a trickle. A big early storm can bring them back for a few days."],
  ["What ends the fall color?", "A hard frost or the first heavy storm. Frost kills the leaves before they finish turning, and a windy storm strips what has turned. Clear, dry, cool days with nights above freezing make the best color."],
  ["Is October a good month to visit Yosemite?", "Yes, for the color, the light and the cooler walking weather, with the falls low and the high roads on borrowed time. From October 15 there is no overnight parking along the Tioga or Glacier Point roads."],
  ["Is the red tree by the Yosemite Chapel native?", "No. It is a sugar maple, planted, and the brightest red in the Valley. The native maple here is the bigleaf, which turns yellow."],
];

function FcValleyMap() {
  return (
    <div className="npsmap__frame">
      <img src="/img/nps-yosemite-valley-map.jpg" width="2560" height="1000" loading="lazy" decoding="async"
        alt="National Park Service map of Yosemite Valley from Valley View and Bridalveil Fall in the west to Happy Isles and Mirror Lake in the east." />
      <svg viewBox="0 0 2560 1000" role="img"
        aria-label={"Fall color markers on the map: " + FC_PINS.map((p) => `${p.n}, ${p.label}`).join("; ") + "."}>
        {FC_PINS.map((p) => {
          const [x, y] = p.pin || p.at;
          return (
            <g key={p.n}>
              {p.pin && <path d={`M${p.at[0]} ${p.at[1]} L ${x} ${y}`} className="npsmap__lead" />}
              <circle cx={x} cy={y} r="26" className="npsmap__pin npsmap__pin--rust" />
              <text x={x} y={y + 8} textAnchor="middle" className="npsmap__num fcol-num">{p.n}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function FcBook({ town, list, children }) {
  return (
    <AvailabilityLink destination={town.dest} list={list} slug={town.id} className="ff-book">
      {children || "See autumn availability ↗"}
    </AvailabilityLink>
  );
}

function FallColorPage({ go }) {
  const mariposa = FC_TOWNS[1];
  const toc = [
    ["#fall-color-when", "When it turns"],
    ["#fall-color-trees", "The trees"],
    ["#fall-color-where", "Where to look"],
    ["#fall-color-week", "Is it on this week?"],
    ["#fall-color-season", "What else autumn brings"],
    ["#fall-color-stay", "Where to stay"],
    ["#fall-color-archive", "From the archive"],
    ["#fall-color-faq", "Questions"],
  ];

  return (
    <div className="page hp-tool hp-event hp-fall-color">
      <div className="ff-cover fcol-cover">
        <ResponsiveImage image="img/yosemite-valley-black-oaks-autumn.jpg" eager className="ff-cover__img"
          alt="Black oaks gone gold and orange in a Yosemite Valley meadow beneath a granite wall"
          sizes="100vw" />
        <HpPageHead
          go={go}
          crumbs={[{ label: "Home", route: "home" }, { label: "Fall color" }]}
          eyebrow="MAPLES · BLACK OAKS · DOGWOODS · ASPENS · EVERY AUTUMN"
          title="Yosemite Fall Color"
          intro="Most of Yosemite is evergreen, so autumn here is not a hillside on fire. It is gold along the creeks, oaks going orange in the meadows, a red dogwood under a pine, and all of it against grey granite. This page covers when each band turns, where the park's own naturalists look, and what ends it."
          actions={<React.Fragment>
            <HomeLink go={go} location="fall_color_head" className="hp-button" href="#fall-color-when">When it turns <span>↓</span></HomeLink>
            <HomeLink go={go} location="fall_color_head" className="hp-link" href="#fall-color-where">Where to look ↓</HomeLink>
          </React.Fragment>}
        >
          <AffiliateDisclosure />
        </HpPageHead>
        <p className="ff-cover__credit">Photo: Bernard Spragg / Wikimedia Commons (CC0)</p>
      </div>

      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="calendar" /><dt>The Valley</dt><dd>Late October to early November</dd></div>
          <div><EventIcon name="mountain" /><dt>Up high</dt><dd>Weeks earlier, from late September</dd></div>
          <div><EventIcon name="drop" /><dt>The waterfalls</dt><dd>Low or dry</dd></div>
          <div><EventIcon name="therm" /><dt>The end</dt><dd>The first hard frost or big storm</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {toc.map(([href, label]) => (
            <HomeLink key={href} go={go} location="fall_color_toc" href={href}>{label}</HomeLink>
          ))}
        </nav>
      </div>

      <section className="hp-wrap hp-section" id="fall-color-when" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">WHEN IT TURNS</p>
            <h2>Read the elevation, not the calendar</h2>
            <p className="ff-lede">Color starts at the top of the park and walks down it. The aspens along the Tioga Road go first, in late September. The dogwoods at middle elevations follow. The Valley floor, at 4,000 feet, comes last of the park proper, and the canyon at El Portal after that.</p>
            <p className="ff-lede">The park puts the Valley's maples and black oaks at their showiest from about mid-October, with color usually arriving in late October and lingering until the first heavy winter storm or hard frost. A trip in the last week of October or the first of November catches the most of it in a typical year.</p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="alert" /> The short version</p>
            <ul>
              <li>For the Valley, aim at late October.</li>
              <li>For aspens, go early, before Tioga Road closes.</li>
              <li>Watch the overnight lows: a hard freeze ends it.</li>
              <li>Come for color and light, not waterfalls.</li>
            </ul>
            <FcBook town={mariposa} list="fall_color_town">Check Highway 140 availability ↗</FcBook>
            <p className="ff-disclosure">Availability search on Expedia. We may earn a commission if you book, at no cost to you. <a href="/affiliate">Disclosure.</a></p>
          </aside>
        </div>
        <ol className="ff-timeline fcol-ladder">
          {FC_LADDER.map((r) => (
            <li key={r.where} className={r.cls}><span>{r.when}</span><strong>{r.where}</strong><p>{r.what}</p></li>
          ))}
        </ol>
        <p className="ff-note">The middle-elevation dogwoods turning ahead of the Valley is a photographer's observation (Michael Frye); the El Portal window is the Mariposa County tourism bureau's. Everything else on this ladder is the National Park Service's own description.</p>
      </section>

      <section className="ff-band" id="fall-color-trees" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="THE TREES" title="Six that turn, among a forest that does not" />
          <p className="ff-lede ff-lede--intro">Ponderosa pine, incense cedar and Douglas fir keep the Valley green all winter. The color is in the broadleaf trees between them, and each has its own shade. Learn these six and the Valley reads like a key.</p>
          <ul className="fcol-trees">
            {FC_TREES.map((t) => (
              <li key={t.name}>
                <i className="fcol-swatch" style={{ background: t.swatch }} aria-hidden="true" />
                <strong>{t.name}</strong>
                <span>{t.color}</span>
                <p>{t.where}</p>
              </li>
            ))}
          </ul>
          <div className="ff-split fcol-why">
            <div>
              <h3>Why the leaves turn</h3>
              <p className="ff-lede">As the days shorten and the nights cool, the trees stop making chlorophyll, and the yellows that were in the leaf all summer show through. The reds are made new: sunny days and cool nights trap sugars in the leaf, and the leaf turns them into anthocyanin. That is why a dogwood in the sun goes redder than one in the shade, and why the best autumns are clear, dry and cool without freezing.</p>
            </div>
            <NatureNotesFilm
              id="fall-moments"
              title="Fall Moments"
              youtubeId="UzA-M8ASGqk"
              note="The park's own short on autumn in Yosemite: color, light, and the quiet that comes with them."
              location="fall_color"
            />
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="fall-color-where" tabIndex={-1}>
        <HpHeading eyebrow="WHERE TO LOOK" title="The Valley, stop by stop" />
        <p className="ff-lede ff-lede--intro">The park names one long band of color: the bigleaf maples along the riparian strip of the south wall, from below Bridalveil Creek past Sentinel Creek to Happy Isles. Southside Drive runs along most of it. Add the meadows and two planted trees, and a slow loop of the Valley floor takes in all of it.</p>
        <figure className="npsmap">
          <FcValleyMap />
          <figcaption>
            {FC_PINS.map((p) => <span key={p.n}><b>{p.n}</b> {p.label}</span>)}
            <span>The Cook's Meadow elm and the El Capitan Meadow oaks come from published color reports; the rest are the park's own. Map: National Park Service (public domain).</span>
          </figcaption>
        </figure>
        <div className="fcol-else">
          <h3>Outside the Valley</h3>
          <ul>
            {FC_ELSEWHERE.map(([place, text]) => (
              <li key={place}><EventIcon name="tree" size={20} /><div><strong>{place}</strong><p>{text}</p></div></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ff-band" id="fall-color-week" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split ff-split--end">
            <div>
              <p className="hp-eyebrow">IS IT ON THIS WEEK?</p>
              <h2>Watch the meadow, and the overnight low</h2>
              <p className="ff-lede">No gauge measures color, and the park does not publish a weekly report. Two things you can check from anywhere: the Half Dome camera, which looks across Ahwahnee Meadow and its oaks, and the forecast low for the Valley floor.</p>
            </div>
            <dl className="ff-conditions">
              <div><EventIcon name="sun" size={24} /><dt>Clear days</dt><dd>Build the reds</dd></div>
              <div><EventIcon name="therm" size={24} /><dt>Cool nights</dt><dd>Above freezing</dd></div>
              <div><EventIcon name="cloud" size={24} /><dt>A big storm</dt><dd>Strips the trees</dd></div>
            </dl>
          </div>
          <WebcamStrip variant="board" only={["Half Dome", "Yosemite Falls"]} />
          <div className="ff-camreads">
            <p><strong>Half Dome, from Ahwahnee Meadow: your color check.</strong> The foreground is meadow and black oak. Green crowns mean it is early; gold and rust mean it is on; bare branches mean the storm came first.</p>
            <p><strong>Yosemite Falls: your water check.</strong> In most autumns the fall is a dark stripe or a thread. A white plume means a storm has been through, which is good for the falls and often the end for the leaves.</p>
          </div>
          <div className="ff-clouds">
            <h3>What makes a good autumn, and what ends one</h3>
            <ul>
              <li className="is-good"><span>Good</span><strong>Clear, dry, cool</strong><p>Sunny days and cold nights above freezing are the recipe for the reds.</p></li>
              <li className="is-maybe"><span>Slow</span><strong>A warm spell</strong><p>Color stalls and the season runs late. The trees hold their green into November.</p></li>
              <li className="is-no"><span>Over</span><strong>A hard frost</strong><p>A freeze kills the leaf before it finishes turning. It browns and drops.</p></li>
              <li className="is-no"><span>Over</span><strong>The first big storm</strong><p>Wind and rain strip what has turned. The falls come back; the color goes.</p></li>
            </ul>
          </div>
          <div className="ff-sources">
            <h3>Sources to keep open</h3>
            <ul>
              {FC_SOURCES.map(([t, d, h]) => (
                <li key={h}><a href={h} target="_blank" rel="noopener noreferrer"><strong>{t} ↗</strong><span>{d}</span></a></li>
              ))}
            </ul>
            <p className="ff-note">Every live feed on one page: <HomeLink go={go} location="fall_color_week" href="/conditions">the conditions board</HomeLink>. The cameras and how to read them: <HomeLink go={go} location="fall_color_week" href="/webcams">the webcams</HomeLink>.</p>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="fall-color-season" tabIndex={-1}>
        <HpHeading eyebrow="WHAT ELSE AUTUMN BRINGS" title="Color, low water, and roads on borrowed time" />
        <ul className="ff-rules">
          <li><EventIcon name="drop" size={26} /><strong>The waterfalls are low</strong><p>Yosemite Falls is often a trickle or dry from late summer until the autumn storms. Vernal, Nevada and Bridalveil run all year, slowed to a trickle. <HomeLink go={go} location="fall_color_season" href="/articles/yosemite-waterfalls-guide">The waterfalls guide</HomeLink> has the year.</p></li>
          <li><EventIcon name="route" size={26} /><strong>The high roads close</strong><p>Tioga Road and Glacier Point Road close for snow, usually sometime in November. From October 15 there is no overnight parking along either. <HomeLink go={go} location="fall_color_season" href="/tioga-opening">How Tioga opens again</HomeLink>.</p></li>
          <li><EventIcon name="snow" size={26} /><strong>Chains in the car</strong><p>All park roads are subject to chain control from late fall. Carry chains after the first storm, and keep a full tank: there is no gas in Yosemite Valley.</p></li>
          <li className="is-exception"><EventIcon name="users" size={26} /><strong>Room to walk</strong><p>The summer crowd is gone, and the Valley Loop and the meadow boardwalks are easy going. <HomeLink go={go} location="fall_color_season" href="/articles/yosemite-in-fall">The fall guide</HomeLink> covers the rest of the season.</p></li>
        </ul>
        <p className="ff-alert"><EventIcon name="alert" /><span><strong>Smoke is part of autumn now.</strong> Prescribed burns and wildfire can close roads or haze the Valley for days in October. Check the park's <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">current conditions</a> before you drive, and see <HomeLink go={go} location="fall_color_season" href="/articles/yosemite-during-smoke-season">the smoke-season guide</HomeLink>.</span></p>
      </section>

      <section className="ff-band" id="fall-color-stay" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="WHERE TO STAY" title="Pick the road by the color it passes" />
          <p className="ff-lede ff-lede--intro">In autumn each gateway road climbs through a different band of the season, so the drive in is part of the trip. Inside the park, the Valley's lodging books through the concessioner about a year ahead.</p>
          <div className="ff-towns fcol-towns">
            {FC_TOWNS.map((t) => (
              <div className="ff-town" key={t.id}>
                <div className="ff-town__name">
                  <h3>{t.name}</h3>
                  <p><strong>{t.drive}</strong> to the Valley · {t.road}</p>
                </div>
                <div className="ff-town__note"><p>{t.note}</p></div>
                <FcBook town={t} list="fall_color_town" />
              </div>
            ))}
            <p className="ff-note">The filled buttons search availability on Expedia; we may earn a commission. No link is to a specific property. <a href="/affiliate">How we handle affiliate links.</a> In-park rooms: <a href="https://www.travelyosemite.com/lodging/" target="_blank" rel="noopener noreferrer">Travel Yosemite ↗</a>. Every option compared: <HomeLink go={go} location="fall_color_stay" href="/stay">where to stay</HomeLink>.</p>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="fall-color-archive" tabIndex={-1}>
        <HpHeading eyebrow="FROM THE NATURE NOTES ARCHIVE" title="The park's naturalists, watching the same trees" />
        <p className="ff-lede ff-lede--intro">The park's naturalists wrote about the autumn color for decades in Yosemite Nature Notes. The trees they named are the ones that still turn.</p>
        <ol className="ff-history">
          {FC_ARCHIVE.map(([year, title, text, href]) => (
            <li key={year}><span>{year}</span><strong>{title}</strong><p>{text} <a href={href}>Read the issue</a></p></li>
          ))}
        </ol>
      </section>

      <section className="ff-band" id="fall-color-faq" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Fall color questions, answered</h2>
            <p className="ff-lede">The whole season, beyond the leaves: <HomeLink go={go} location="fall_color_faq" href="/articles/yosemite-in-fall">Yosemite in fall</HomeLink>. Where to stand with a camera: <HomeLink go={go} location="fall_color_faq" href="/articles/yosemite-photography-spots">the photography guide</HomeLink>. Telling the trees apart: <HomeLink go={go} location="fall_color_faq" href="/articles/yosemite-trees-identification-guide">the tree guide</HomeLink>.</p>
            <div className="ff-closing">
              <p className="hp-eyebrow">PLANNING THE TRIP?</p>
              <h3>Search the Highway 140 corridor</h3>
              <p>El Portal, Midpines and Mariposa sit on the road that stays open all winter, so a November storm does not end the trip.</p>
              <FcBook town={mariposa} list="page_fall_color">Search Highway 140 lodging ↗</FcBook>
            </div>
          </div>
          <div className="ff-faq">
            {FC_FAQ.map(([q, a], i) => (
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
        location="fall_color"
        title="Taking the autumn trip?"
        intro="The Field Guide app carries the Valley stops with parking notes, offline maps for a park with no signal, and a day-by-day planner, so the slow loop of the meadows fits around everything else."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="The season, watched from inside the park"
        heading="The season, watched from inside the park"
        blurb="Sunday Field Notes follows the color down the mountain each autumn: what has turned, what the frost took, and what the park's naturalists wrote about the same weeks a century ago."
        location="fall_color"
        tag="fall-color"
      />
    </div>
  );
}

window.FallColorPage = FallColorPage;
