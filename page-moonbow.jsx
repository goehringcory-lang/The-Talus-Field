/* global React, HpPageHead, HpHeading, HomeLink, ResponsiveImage, WebcamStrip, AvailabilityLink, HpGuideBand, HpLetter, AffiliateDisclosure, EventIcon, NatureNotesFilm */

// =============================================================================
// MOONBOW — `/moonbow` route. The fifth evergreen event page (October 2026),
// on /firefall's system (`.hp-event`, the `.ff-*` layout rules, EventIcon,
// the NPS-map overlay). A permanent URL for the spring search spike
// ("yosemite moonbow", "moonbow dates"), which every April sends readers to
// a photographer's timetable and a few news pieces.
//
// Three rules hold it up.
//   1. No year is written into the copy outside the archive ledger
//      (MB_ARCHIVE), which is past fact. The one dated element is computed:
//      MbNights works out the full moons of the coming April to June in the
//      reader's browser (Meeus, Astronomical Algorithms, ch. 49, the main
//      periodic terms; checked against the published 2026 full moons to the
//      minute), so the page is never wrong about a season it was not edited
//      for. It prints dates only, never clock times: the bow's hour depends
//      on the fall, the vantage and the moon's height, and no source the page
//      trusts publishes a standing table of them.
//   2. Every fact is sourced. The National Park Service: the moonbow "when
//      waterfall flow is especially high, generally in April and May," and
//      "highly dependent on water flow, clear skies, and angle of the moon"
//      (the Lower Yosemite Fall trailhead and Yosemite Falls pages); the
//      shuttle's 7 a.m. to 10 p.m. hours; the one-mile paved loop. The
//      geometry (42 degrees, the moon behind you, the bow sinking as the moon
//      climbs) is Gary Hart's and Atmospheric Optics'; the six conditions are
//      the Texas State team's (Sky & Telescope, May 2007); the five-night
//      window and the 50-minutes-later rule are QT Luong's; the etiquette is
//      Brian Hawkins' (yosemitemoonbow.com), not park rules, and the page
//      says so. Exposure examples are Hart's and Michael Frye's.
//   3. Affiliate links follow /firefall's colour rule. Placements:
//      `moonbow_town` (the gateway rows), `moonbow_gear` (the Patagonia picks)
//      and `page_moonbow` (the closing search), inventoried in
//      ARCHITECTURE.md. The FAQ is mirrored in edge/seo.js's "/moonbow"
//      entry; change both.
// =============================================================================

// Full moon instant (ms since epoch, UTC) for lunation k + 0.5.
function mbFullMoonMs(k) {
  const T = k / 1236.85, r = Math.PI / 180, s = Math.sin;
  const M = (2.5534 + 29.1053567 * k - 0.0000014 * T * T) * r;
  const Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T * T) * r;
  const F = (160.7108 + 390.67050284 * k - 0.0016118 * T * T) * r;
  const Om = (124.7746 - 1.56375588 * k + 0.0020672 * T * T) * r;
  const E = 1 - 0.002516 * T;
  const jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T
    - 0.40614 * s(Mp) + 0.17302 * E * s(M) + 0.01614 * s(2 * Mp) + 0.01043 * s(2 * F)
    + 0.00734 * E * s(Mp - M) - 0.00514 * E * s(Mp + M) + 0.00209 * E * E * s(2 * M)
    - 0.00111 * s(Mp - 2 * F) - 0.00057 * s(Mp + 2 * F) + 0.00056 * E * s(2 * Mp + M)
    - 0.00042 * s(3 * Mp) + 0.00042 * E * s(M + 2 * F) + 0.00038 * E * s(M - 2 * F)
    - 0.00024 * E * s(2 * Mp - M) - 0.00017 * s(Om);
  return (jde - 2440587.5) * 86400000 - 69000; // TT to UTC, near enough
}

// The full moons of the next April-to-June season, in Pacific dates. Before
// July the season is this year's (with the moons already past dropped);
// from July on it is next year's.
function mbSeason(now) {
  const pt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", year: "numeric", month: "numeric", day: "numeric" });
  const parts = (ms) => {
    const o = {};
    pt.formatToParts(new Date(ms)).forEach((p) => { o[p.type] = Number(p.value); });
    return o;
  };
  const today = parts(now);
  const year = today.month >= 7 ? today.year + 1 : today.year;
  const k0 = Math.floor((year - 2000) * 12.3685) - 1;
  const out = [];
  for (let k = k0; k < k0 + 8; k++) {
    const ms = mbFullMoonMs(k + 0.5);
    const d = parts(ms);
    if (d.year !== year || d.month < 4 || d.month > 6) continue;
    if (ms + 3 * 86400000 < now) continue;
    out.push(ms);
  }
  return { year, moons: out };
}

const MB_DAY = 86400000;
function mbFmt(ms, opts) {
  return new Intl.DateTimeFormat("en-US", Object.assign({ timeZone: "America/Los_Angeles" }, opts)).format(new Date(ms));
}

function MbNights() {
  const [now] = React.useState(() => Date.now());
  const { year, moons } = mbSeason(now);
  if (!moons.length) return null;
  return (
    <div className="mb-nights">
      <p className="mb-nights__head"><EventIcon name="calendar" /> The full moons, spring {year}</p>
      <ol>
        {moons.map((ms) => (
          <li key={ms}>
            <span>{mbFmt(ms, { month: "long" })}</span>
            <strong>{mbFmt(ms, { month: "long", day: "numeric" })}</strong>
            <p>Best nights about {mbFmt(ms - 2 * MB_DAY, { month: "short", day: "numeric" })} to {mbFmt(ms + 2 * MB_DAY, { month: "short", day: "numeric" })}</p>
          </li>
        ))}
      </ol>
      <p className="ff-note">Full-moon dates computed for Pacific time. Whether a night delivers depends on the water and the sky; nightly times by vantage point are published each spring at <a href="https://www.yosemitemoonbow.com/" target="_blank" rel="noopener noreferrer">yosemitemoonbow.com ↗</a>.</p>
    </div>
  );
}

// The geometry, drawn from the viewer's side: the bow is a circle 42 degrees
// around the point directly opposite the moon. With the moon low behind you
// that point sits just below the horizon and the top of the circle stands in
// the spray; with the moon above 42 degrees the whole circle is underground.
function MbGeoPanel({ x, cy, title, note, visible }) {
  const cx = x + 150, hz = 150, r = 112;
  const id = `mb-clip-${x}`;
  return (
    <g>
      <clipPath id={id}><rect x={x} y="0" width="300" height={hz} /></clipPath>
      <rect x={cx - 34} y="26" width="68" height={hz - 26} className="mb-geo__fall" />
      <circle cx={cx} cy={cy} r={r} className="mb-geo__ghost" />
      {visible && <circle cx={cx} cy={cy} r={r} className="mb-geo__bow" clipPath={`url(#${id})`} />}
      <line x1={x + 10} y1={hz} x2={x + 290} y2={hz} className="mb-geo__ground" />
      <path d={`M${cx - 6} ${cy - 6} l12 12 M${cx + 6} ${cy - 6} l-12 12`} className="mb-geo__mark" />
      <text x={cx + 12} y={cy + 4} className="mb-geo__label">Opposite the moon</text>
      <text x={x + 10} y="18" className="mb-geo__title">{title}</text>
      <text x={x + 10} y={hz + 24} className="mb-geo__label">{note}</text>
    </g>
  );
}
function MbGeometry() {
  return (
    <svg className="mb-geo" viewBox="0 0 620 300" role="img"
      aria-label="Two views toward the waterfall with the moon behind you. Left: the moon is low, the point opposite it sits just below the horizon, and the top of the moonbow's circle stands in the spray. Right: the moon is above 42 degrees, the point opposite it is far below the horizon, and the whole circle is underground, so there is no bow.">
      <MbGeoPanel x={0} cy={190} title="Moon low behind you" note="The bow stands in the spray" visible />
      <MbGeoPanel x={320} cy={290} title="Moon above 42°" note="The bow is below the ground" visible={false} />
    </svg>
  );
}

// Upper and Lower Yosemite Fall on the National Park Service's Valley map:
// img/nps-yosemite-falls-creek-map.jpg (960 x 560), cut from
// img/nps-yosemite-valley-map.jpg at +1060+0, shared with /frazil-ice.
const MB_PINS = [
  { n: 1, at: [440, 188], pin: [505, 150], label: "The footbridge at the base of Lower Yosemite Fall: the classic moonbow, and the crowd" },
  { n: 2, at: [515, 290], label: "Cook's Meadow: Upper Yosemite Fall's bow, with room to spread out" },
  { n: 3, at: [468, 272], label: "Lower Yosemite Fall trailhead, restrooms and shuttle stop" },
  { n: 4, at: [428, 48], pin: [380, 66], label: "Upper Yosemite Fall" },
];
function MbFallsMap() {
  return (
    <div className="npsmap__frame">
      <img src="/img/nps-yosemite-falls-creek-map.jpg" width="960" height="560" loading="lazy" decoding="async"
        alt="National Park Service map of the Yosemite Falls area: Upper and Lower Yosemite Fall, Yosemite Creek, the Lower Yosemite Fall Trail, Yosemite Village, Yosemite Valley Lodge and Sentinel Bridge." />
      <svg viewBox="0 0 960 560" role="img"
        aria-label={"Markers on the map: " + MB_PINS.map((p) => `${p.n}, ${p.label}`).join("; ") + "."}>
        {MB_PINS.map((p) => {
          const [x, y] = p.pin || p.at;
          return (
            <g key={p.n}>
              {p.pin && <path d={`M${p.at[0]} ${p.at[1]} L ${x} ${y}`} className="npsmap__lead" />}
              <circle cx={x} cy={y} r="15" className={"npsmap__pin " + (p.n === 1 ? "npsmap__pin--rust" : "npsmap__pin--ink")} />
              <text x={x} y={y + 5} textAnchor="middle" className="npsmap__num">{p.n}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const MB_GEAR = [
  { id: "rain-shell", what: "A rain shell", why: "In a big water year the spray at the footbridge soaks everyone standing on it.", q: "torrentshell", label: "Torrentshell" },
  { id: "insulated-jacket", what: "A warm layer", why: "You stand still for an hour at night at 4,000 feet, damp.", q: "nano puff", label: "Nano Puff" },
  { id: "warm-hat", what: "A warm hat", why: "The cheapest fix for a cold, wet wait.", q: "beanie", label: "Beanies" },
];

const MB_KIT = [
  "A red headlamp, or a white one you keep pointed at the ground",
  "A tripod, if you want the color the eye cannot see",
  "A lens cloth, and a plastic bag for the camera between frames",
  "Shoes with grip: the bridge and the rocks are wet",
  "Your own ride back: the Valley shuttle stops at 10 p.m.",
];

// Past fact from the park's naturalists and its most famous resident.
const MB_ARCHIVE = [
  ["1870s", "“A wild bath in lunar bows”", "John Muir crept behind Upper Yosemite Fall on a moonlit night, was battered by the falling column, and ran home toward morning “better, not worse for my wild bath in lunar bows.” Nature Notes reprinted the passage from The Yosemite in 1941.", "/archive/1941/vol-20-no-8/"],
  ["1934", "The bow that did not come", "On June 28 a naturalist-led party of two hundred climbed the Yosemite Falls Trail at midnight. “The expected lunar rainbow at the base of the upper Yosemite Fall did not materialize.” The spray made up for it.", "/archive/1934/vol-13-no-10/"],
  ["1937", "Only when the moon is full", "Helen Sharsmith on the conditions: only when the moon is full or nearly so is there light enough, and only when the falls are in flood does the bow show in full. Her season: May, June, or even July.", "/archive/1937/vol-16-no-6/"],
  ["1938", "The lunar bow in Yosemite Fall", "Ranger-naturalist H. E. Perry at the base of the Lower Fall: a band that looks white, then, as you keep watching, shows its spectrum colors, fading when the mist thins and returning with it.", "/archive/1938/vol-17-no-10/"],
  ["2007", "Six conditions", "A Texas State University team publishes the requirements in Sky & Telescope: clear sky, abundant mist, a dark sky, bright moonlight, moonlight not blocked by the cliffs, and the right geometry. Prediction tables follow.", "https://digital.library.txst.edu/handle/10877/3191"],
];

const MB_TOWNS = [
  { id: "el-portal", name: "El Portal", dest: "El Portal, California", drive: "25 to 35 min", road: "Highway 140", note: "The closest beds outside the park, which matters when the bow is still on after the last shuttle." },
  { id: "mariposa", name: "Midpines and Mariposa", dest: "Mariposa, California", drive: "45 to 60 min", road: "Highway 140", note: "The deepest inventory, and an hour's drive home in the dark." },
  { id: "groveland", name: "Groveland", dest: "Groveland, California", drive: "65 to 80 min", road: "Highway 120", note: "Further, with a mountain road after midnight. Pick it for the rest of the trip, not the moonbow." },
];

// Mirrored in edge/seo.js's "/moonbow" faq (the JSON-LD). Change both.
const MB_FAQ = [
  ["When can you see a moonbow in Yosemite?", "On clear nights around the full moon, from about April into June, while Yosemite Falls is running high. The park says generally April and May; in a big snow year the falls carry the season into June. The usable window is the full moon and about two nights either side."],
  ["Where do you see the moonbow in Yosemite?", "Most often at Lower Yosemite Fall, from the footbridge at its base, a short walk on the paved loop from the Lower Yosemite Fall trailhead. Upper Yosemite Fall makes its own bow, seen from Cook's Meadow. In some years it forms at Glacier Point, once the road is open."],
  ["What time does the moonbow appear?", "It depends on the night, the fall and where you stand. The bow forms when the moon is low enough, below about 42 degrees, behind you, and it comes about 50 minutes later each night, as the moon rises later. Nightly times by vantage point are published each spring at yosemitemoonbow.com."],
  ["Can you see the colors with the naked eye?", "Mostly not. To the eye a moonbow is a silver or grey arc, because moonlight is too faint for the eye's color vision; keep watching and some people see faint color. A camera on a tripod records the full spectrum."],
  ["Is it crowded?", "At Lower Yosemite Fall on a clear full-moon weekend, yes: photographers, tripods and a lot of people on one bridge. Cook's Meadow has more room. Weeknights and the earlier full moons are quieter."],
  ["Do I need a flashlight?", "To walk in and out, a headlamp, ideally with a red mode. At the bridge, turn it off or point it at the ground, and turn off your camera's flash. The light ruins the view and the long exposures around you."],
  ["Will I get wet?", "In a big water year, very. The spray at the base of Lower Yosemite Fall soaks the bridge. Bring a rain shell and protect the camera."],
  ["How do I get back to my car?", "The Valley shuttle runs until about 10 p.m., often before the bow is done. Park at the Yosemite Falls lot or stay within walking distance, and carry a headlamp for the walk out."],
];

function MbBook({ town, list, children }) {
  return (
    <AvailabilityLink destination={town.dest} list={list} slug={town.id} className="ff-book">
      {children || "See spring availability ↗"}
    </AvailabilityLink>
  );
}

function MoonbowPage({ go }) {
  const [elPortal] = MB_TOWNS;
  const toc = [
    ["#moonbow-when", "When"],
    ["#moonbow-how", "How it works"],
    ["#moonbow-where", "Where to stand"],
    ["#moonbow-tonight", "Is it on tonight?"],
    ["#moonbow-night", "The night"],
    ["#moonbow-stay", "Where to stay"],
    ["#moonbow-archive", "From the archive"],
    ["#moonbow-faq", "Questions"],
  ];
  const gearHref = (q) => {
    const u = `https://www.patagonia.com/search/?q=${q.replace(/ /g, "+")}`;
    return window.buildAffiliateLink ? window.buildAffiliateLink("patagonia", u) : u;
  };

  return (
    <div className="page hp-tool hp-event hp-moonbow">
      <div className="ff-cover mb-cover">
        <ResponsiveImage image="img/moonbow-lower-yosemite-fall-inaglory.jpg" eager className="ff-cover__img"
          alt="A moonbow arcing through the spray of Lower Yosemite Fall under a starry night sky"
          sizes="100vw" />
        <HpPageHead
          go={go}
          crumbs={[{ label: "Home", route: "home" }, { label: "Moonbow" }]}
          eyebrow="LOWER YOSEMITE FALL · FULL MOONS · APRIL TO JUNE"
          title="The Yosemite Moonbow"
          intro="On clear spring nights around the full moon, the spray of Yosemite Falls can hold a rainbow made of moonlight. To the eye it is a pale silver arch; to a camera it is every color. It needs high water, a clear sky, and a moon low behind you. This page covers the nights, the geometry, where to stand, and how to behave on a crowded bridge in the dark."
          actions={<React.Fragment>
            <HomeLink go={go} location="moonbow_head" className="hp-button" href="#moonbow-when">The next full moons <span>↓</span></HomeLink>
            <HomeLink go={go} location="moonbow_head" className="hp-link" href="#moonbow-where">Where to stand ↓</HomeLink>
          </React.Fragment>}
        >
          <AffiliateDisclosure />
        </HpPageHead>
        <p className="ff-cover__credit">Photo: Brocken Inaglory / Wikimedia Commons (CC BY-SA 3.0)</p>
      </div>

      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="calendar" /><dt>The season</dt><dd>April into June, high water</dd></div>
          <div><EventIcon name="eye" /><dt>The nights</dt><dd>Full moon, two either side</dd></div>
          <div><EventIcon name="pin" /><dt>The spot</dt><dd>Lower Yosemite Fall footbridge</dd></div>
          <div><EventIcon name="cloud" /><dt>The catch</dt><dd>Clear sky, and a low moon</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {toc.map(([href, label]) => (
            <HomeLink key={href} go={go} location="moonbow_toc" href={href}>{label}</HomeLink>
          ))}
        </nav>
      </div>

      <section className="hp-wrap hp-section" id="moonbow-when" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">WHEN</p>
            <h2>Five nights a month, three months a year</h2>
            <p className="ff-lede">The park's own line: when waterfall flow is especially high, generally in April and May, the full moon on the waterfall mist can make a moonbow, and whether it shows depends on the water, the sky and the angle of the moon. The usable nights are the full moon and about two on either side, while there is still enough moonlight to make a bow.</p>
            <p className="ff-lede">The early full moons, in April and early May, are the surest and the least crowded. June works in a big snow year, when the falls are still roaring. In a dry year the season can end with May.</p>
          </div>
          <MbNights />
        </div>
        <ol className="ff-timeline">
          <li className="is-tight"><span>April</span><strong>The falls build</strong><p>Snowmelt brings Yosemite Falls up. The first full moon of good water often has the bridge nearly to itself.</p></li>
          <li className="is-open"><span>Late April to May</span><strong>The heart of it</strong><p>The most water and the most reliable bows. From late May the crowds build.</p></li>
          <li className="is-tight"><span>June</span><strong>A big year only</strong><p>Worth it while the fall is still going strong. The nights are short and the bow comes late.</p></li>
          <li className="is-gone"><span>July on</span><strong>Over</strong><p>Yosemite Falls dwindles through summer and is often a trickle or dry by August.</p></li>
        </ol>
      </section>

      <section className="ff-band" id="moonbow-how" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">HOW IT WORKS</p>
            <h2>A rainbow, by moonlight, with the same rules</h2>
            <p className="ff-lede">A moonbow is a rainbow lit by the moon instead of the sun. The light enters the spray, bends and reflects inside the drops, and comes back to you as an arc 42 degrees around the point directly opposite the moon. Your shadow points at the center of it.</p>
            <p className="ff-lede">That geometry decides the hour. The moon has to be behind you and low: the higher it climbs, the lower the bow sits, and once the moon is above 42 degrees the bow drops below the ground. It needs a bright moon, because moonlight is far fainter than sunlight, which is also why the eye sees it as silver.</p>
            <MbGeometry />
          </div>
          <div>
            <dl className="ff-when">
              <div><dt>Water</dt><dd>High flow, heavy spray</dd><p>The bow lives in the mist. No mist, no bow.</p></div>
              <div><dt>Moon</dt><dd>Full or nearly full</dd><p>About two nights either side of full.</p></div>
              <div><dt>Height</dt><dd>Below about 42°</dd><p>And not hidden behind the Valley's walls.</p></div>
              <div><dt>Sky</dt><dd>Clear and dark</dd><p>A cloud over the moon switches it off.</p></div>
              <div><dt>Timing</dt><dd>About 50 min later each night</dd><p>The moon rises later every evening.</p></div>
            </dl>
            <NatureNotesFilm
              id="moonbows"
              title="Moonbows"
              youtubeId="W6KMnPzZ0Eo"
              episode={15}
              note="The park's own film on the full-moon nights at the base of Yosemite Falls."
              location="moonbow"
            />
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="moonbow-where" tabIndex={-1}>
        <HpHeading eyebrow="WHERE TO STAND" title="The footbridge, or the meadow" />
        <p className="ff-lede ff-lede--intro">Most people see their first moonbow from the footbridge at the base of Lower Yosemite Fall, a short walk up the paved loop from the trailhead. Upper Yosemite Fall throws its own bow higher on the wall, and Cook's Meadow is the place to watch it, with room for a tripod and a view of both falls.</p>
        <figure className="npsmap">
          <MbFallsMap />
          <figcaption>
            {MB_PINS.map((p) => <span key={p.n}><b>{p.n}</b> {p.label}</span>)}
            <span>The trail loop is about a mile, paved, and its east side is wheelchair accessible. Map: National Park Service (public domain), cropped.</span>
          </figcaption>
        </figure>
        <ul className="ff-rules">
          <li><EventIcon name="pin" size={26} /><strong>Lower Yosemite Fall</strong><p>The classic: close, loud, wet, and the bow often right in front of you. On a clear full-moon weekend, also the crowd.</p></li>
          <li><EventIcon name="eye" size={26} /><strong>Cook's Meadow</strong><p>For Upper Yosemite Fall's bow. Further away and quieter, with the whole wall in view. Stay on the boardwalk and the paths.</p></li>
          <li><EventIcon name="mountain" size={26} /><strong>Glacier Point</strong><p>Some years, once the road opens, a brief window of about a quarter hour a night. A long dark drive for it.</p></li>
          <li className="is-exception"><EventIcon name="drop" size={26} /><strong>Other falls</strong><p>The park says moonbows can form on many of its waterfalls. Yosemite Falls is the one with a paved path, a parking lot and a view from below.</p></li>
        </ul>
      </section>

      <section className="ff-band" id="moonbow-tonight" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split ff-split--end">
            <div>
              <p className="hp-eyebrow">IS IT ON TONIGHT?</p>
              <h2>Water in the morning, sky in the evening</h2>
              <p className="ff-lede">The moon's date is fixed. The other two conditions are not. Check the falls in daylight on the Yosemite Falls camera: a full white column means spray. Check the sky in the afternoon: high cloud over the moon at the wrong hour is the usual way a night fails.</p>
            </div>
            <dl className="ff-conditions">
              <div><EventIcon name="drop" size={24} /><dt>Water</dt><dd>Changes by the week</dd></div>
              <div><EventIcon name="cloud" size={24} /><dt>Cloud</dt><dd>Changes by the hour</dd></div>
              <div><EventIcon name="calendar" size={24} /><dt>The moon</dt><dd>Fixed: the dates</dd></div>
            </dl>
          </div>
          <WebcamStrip variant="board" only={["Yosemite Falls", "Half Dome"]} />
          <div className="ff-camreads">
            <p><strong>Yosemite Falls: your water check.</strong> In daylight, a thick white column with spray billowing at the base is moonbow water. A thin ribbon is a weak bow or none.</p>
            <p><strong>Half Dome: your sky check.</strong> Clear blue in the late afternoon is a good start. A lid of cloud over the Valley means stay in, and try the next night.</p>
          </div>
          <div className="ff-clouds">
            <h3>What makes the night</h3>
            <ul>
              <li className="is-good"><span>Good</span><strong>Clear sky, big water</strong><p>Everything lines up. Get there early on a weekend; the bridge fills.</p></li>
              <li className="is-maybe"><span>Maybe</span><strong>Thin, moving cloud</strong><p>The bow comes and goes as cloud crosses the moon. Wait it out.</p></li>
              <li className="is-no"><span>No show</span><strong>Overcast</strong><p>No moonlight, no bow, however full the moon or the fall.</p></li>
              <li className="is-no"><span>No show</span><strong>A trickle of water</strong><p>Late in a dry year the spray is too thin to hold an arc.</p></li>
            </ul>
          </div>
          <p className="ff-note">Live feeds on one page: <HomeLink go={go} location="moonbow_tonight" href="/conditions">the conditions board</HomeLink>. How much water the falls are carrying this year: <HomeLink go={go} location="moonbow_tonight" href="/articles/yosemite-waterfalls-guide">the waterfalls guide</HomeLink>.</p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="moonbow-night" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE NIGHT</p>
            <h2>Keep it dark, and keep it dry</h2>
            <p className="ff-lede">A moonbow night is a few hundred people in the dark on a wet bridge, half of them running long exposures. The etiquette is simple and it is not park policy, just what makes the night work: no flash, no white light pointed at the fall, and no walking through somebody's tripod legs.</p>
            <figure className="ff-photo mb-photo">
              <ResponsiveImage image="img/moonbow-lower-yosemite-fall-wakabayashi.jpg" alt="A long exposure of Lower Yosemite Fall by moonlight, with a moonbow across the spray at its base" sizes="(max-width: 760px) calc(100vw - 40px), 520px" />
              <figcaption>The camera sees the colors; the eye sees silver. Photo: Ted Wakabayashi / Wikimedia Commons (public domain)</figcaption>
            </figure>
          </div>
          <div>
            <ul className="ff-rules mb-rules">
              <li><EventIcon name="no" size={26} /><strong>No flash, no white light</strong><p>Use a red headlamp, or point a white one at the ground. One flashlight on the spray ruins every exposure on the bridge.</p></li>
              <li><EventIcon name="drop" size={26} /><strong>It is wet</strong><p>In a big year the spray drenches people and cameras. The bridge and rocks are slick.</p></li>
              <li><EventIcon name="clock" size={26} /><strong>The shuttle stops at 10</strong><p>The Valley shuttle runs from 7 a.m. to 10 p.m. Park at Yosemite Falls, or stay within walking distance.</p></li>
              <li className="is-exception"><EventIcon name="camera" size={26} /><strong>Take one, then watch</strong><p>Hart has shot it at 30 seconds, f/4, ISO 800; Frye at 20 seconds, f/4, ISO 6400. A tripod is the whole trick.</p></li>
            </ul>
          </div>
        </div>
        <div className="ff-kit">
          <div className="ff-gear">
            <div className="ff-gear__head"><h3>For the spray</h3><p>Picks from Patagonia</p></div>
            <ul>
              {MB_GEAR.map((g) => (
                <li key={g.id}>
                  <div><strong>{g.what}</strong><p>{g.why}</p></div>
                  <a className="ff-gear__link" href={gearHref(g.q)}
                    target="_blank" rel="sponsored noopener"
                    data-aff-network="patagonia" data-aff-list="moonbow_gear" data-aff-item-slug={g.id} data-aff-name={g.what}>{g.label} ↗</a>
                </li>
              ))}
            </ul>
            <p className="ff-note">Patagonia links are affiliate links; we may earn a commission. Any shell and warm layer do the same job. <a href="/affiliate">Our affiliate policy.</a></p>
          </div>
          <div className="ff-else">
            <h3>Everything else</h3>
            <ul>
              {MB_KIT.map((k) => <li key={k}><EventIcon name="check" size={18} />{k}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="ff-band" id="moonbow-stay" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="WHERE TO STAY" title="Sleep close enough to walk home" />
          <p className="ff-lede ff-lede--intro">The bow often outlasts the last shuttle, and the drive out of the Valley at midnight is long and dark. Yosemite Valley Lodge sits across the road from the Lower Yosemite Fall trailhead, which is the best-placed bed for a moonbow night; it books through the park concessioner about a year ahead.</p>
          <div className="ff-towns">
            {MB_TOWNS.map((t) => (
              <div className="ff-town" key={t.id}>
                <div className="ff-town__name">
                  <h3>{t.name}</h3>
                  <p><strong>{t.drive}</strong> to the Valley · {t.road}</p>
                </div>
                <div className="ff-town__note"><p>{t.note}</p></div>
                <MbBook town={t} list="moonbow_town" />
              </div>
            ))}
            <p className="ff-note">The filled buttons search availability on Expedia; we may earn a commission. No link is to a specific property. <a href="/affiliate">How we handle affiliate links.</a> In-park rooms: <a href="https://www.travelyosemite.com/lodging/" target="_blank" rel="noopener noreferrer">Travel Yosemite ↗</a>. Every option compared: <HomeLink go={go} location="moonbow_stay" href="/stay">where to stay</HomeLink>.</p>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="moonbow-archive" tabIndex={-1}>
        <HpHeading eyebrow="FROM THE NATURE NOTES ARCHIVE" title="A century of full-moon nights" />
        <p className="ff-lede ff-lede--intro">The park's naturalists were writing up the lunar bow long before anyone published a timetable. Their conditions are the same ones on this page.</p>
        <ol className="ff-history">
          {MB_ARCHIVE.map(([year, title, text, href]) => (
            <li key={year}><span>{year}</span><strong>{title}</strong><p>{text} <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{href.startsWith("http") ? "The paper ↗" : "Read the issue"}</a></p></li>
          ))}
        </ol>
      </section>

      <section className="ff-band" id="moonbow-faq" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Moonbow questions, answered</h2>
            <p className="ff-lede">The rest of the spring, by day: <HomeLink go={go} location="moonbow_faq" href="/articles/yosemite-waterfalls-guide">the waterfalls guide</HomeLink>. The night sky when the moon is not full: <HomeLink go={go} location="moonbow_faq" href="/articles/yosemite-stargazing-where-to-look-up">stargazing in Yosemite</HomeLink>. Cold spring mornings at the same creek: <HomeLink go={go} location="moonbow_faq" href="/frazil-ice">frazil ice</HomeLink>.</p>
            <div className="ff-closing">
              <p className="hp-eyebrow">PLANNING A FULL-MOON TRIP?</p>
              <h3>Search El Portal first</h3>
              <p>The closest beds outside the park, 25 to 35 minutes from the Yosemite Falls lot on the road that stays open all year.</p>
              <MbBook town={elPortal} list="page_moonbow">Search El Portal lodging ↗</MbBook>
            </div>
          </div>
          <div className="ff-faq">
            {MB_FAQ.map(([q, a], i) => (
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
        location="moonbow"
        title="Making a spring trip of it?"
        intro="The Field Guide app carries the Valley's spring stops, the waterfall walks with parking notes, offline maps for a park with no signal, and a day-by-day planner around the full-moon nights."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="Spring, watched from inside the park"
        heading="Spring, watched from inside the park"
        blurb="Sunday Field Notes follows the water each spring: how high the falls are running, what the full moon will find, and what the park's naturalists saw in the same weeks a century ago."
        location="moonbow"
        tag="moonbow"
      />
    </div>
  );
}

window.MoonbowPage = MoonbowPage;
