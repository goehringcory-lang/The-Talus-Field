/* global React, HpPageHead, HpHeading, HomeLink, ResponsiveImage, WebcamStrip, AvailabilityLink, HpGuideBand, HpLetter, AffiliateDisclosure, EventIcon, NatureNotesFilm */

// =============================================================================
// FRAZIL ICE — `/frazil-ice` route. The sixth evergreen event page (October
// 2026), on /firefall's system (`.hp-event`, the `.ff-*` layout rules,
// EventIcon, the NPS-map overlay). The park's strangest small phenomenon,
// which the catalog mentioned only in passing (the winter and March guides),
// and which the National Park Service's own Nature Notes film shows better
// than any photograph: the film is the centerpiece, near the top.
//
// Three rules hold it up.
//   1. No year in the copy outside the record (FZ_RECORD), which is past fact.
//   2. Every fact is sourced. The National Park Service frazil ice page
//      (nps.gov/yose/planyourvisit/frazilice.htm): the definition, the
//      places (Yosemite Creek below Lower Yosemite Fall, Ribbon and Sentinel
//      creeks), the seasons (fall, winter or spring with high flow and
//      sub-freezing nights; most often April, sometimes March and May), the
//      "usually before 9 am", and the producer's 2009 and 2010 counts. The
//      Yosemite Falls page: the ice cone, "sometimes exceeding 300 feet,"
//      "usually melted by mid-April." The mechanism, the warm-spell-then-
//      cold-snap setup, the April 1953 flood and the depths come from Yosemite
//      Nature Notes, April 1954 (Donald E. McHenry) and Vol. 40 No. 2, 1961
//      (Fran Hubbard and C. Frank Brockman), both linked on the page. The
//      trapped-beneath warning and the 2023 closure are the park rangers'
//      post as reported by Advnture; the 2017 trail closure is the San
//      Francisco Chronicle's report. The page says which is which.
//   3. One affiliate placement, the closing El Portal search
//      (`page_frazil_ice`, inventoried in ARCHITECTURE.md): the reader has
//      to be at the creek before 9 a.m., so the one useful lodging fact is
//      where to sleep. The FAQ is mirrored in edge/seo.js's "/frazil-ice"
//      entry; change both.
// =============================================================================

const FZ_PINS = [
  { n: 1, at: [440, 188], pin: [505, 150], label: "Yosemite Creek just below Lower Yosemite Fall: where frazil ice is most famously seen" },
  { n: 2, at: [452, 276], pin: [405, 300], label: "Yosemite Creek at Northside Drive: where the April 1953 flow crossed the road" },
  { n: 3, at: [468, 272], pin: [520, 250], label: "Lower Yosemite Fall trailhead and shuttle stop: watch from the paved loop" },
  { n: 4, at: [428, 48], pin: [380, 66], label: "Upper Yosemite Fall: the ice cone at its base, and the source of the mist" },
];
function FzCreekMap() {
  return (
    <div className="npsmap__frame">
      <img src="/img/nps-yosemite-falls-creek-map.jpg" width="960" height="560" loading="lazy" decoding="async"
        alt="National Park Service map of the Yosemite Falls area: Upper and Lower Yosemite Fall, Yosemite Creek running south past the Lower Yosemite Fall Trail to Yosemite Valley Lodge, Yosemite Village and Sentinel Bridge." />
      <svg viewBox="0 0 960 560" role="img"
        aria-label={"Markers on the map: " + FZ_PINS.map((p) => `${p.n}, ${p.label}`).join("; ") + "."}>
        {FZ_PINS.map((p) => {
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

// The record. Past fact, and the page's only dated copy.
const FZ_RECORD = [
  ["1932", "The first photographs", "Ralph H. Anderson photographs frazil ice at the base of Lower Yosemite Fall on April 21. The park's photo archive still holds the prints.", "https://npgallery.nps.gov/AssetDetail/b70a2c29395c49b8b3db8ff59cd7e056", "The photograph ↗"],
  ["1953", "The creek leaves its bed", "April 10, after a warm spell and three nights in the twenties. By noon the jammed ice had lifted Yosemite Creek out of its channel and sent it across the highway toward the lodge cottages. A footbridge was lifted off its foundations; crews used a dragline, a fire pump and, by one account, explosives. A worker who tried to cross on snowshoes sank in and was pulled out; a deer was found drowned.", "/archive/1954/vol-33-no-4/", "Read the issue"],
  ["1954", "A bridge disappears", "In March the ice engulfed the footbridge near Lower Yosemite Fall so completely that no part of it showed. The park naturalist logged the temperatures: the forties while the falls rose, then 20 degrees on the day the flow peaked.", "/archive/1954/vol-33-no-4/", "Read the issue"],
  ["1961", "More than 20 feet deep", "Nature Notes reports the ice along Yosemite Creek has at times stood more than 20 feet deep, that trails must be reopened with snow equipment, and that the banks can hold it for weeks.", "http://www.yosemite.ca.us/library/yosemite_nature_notes/40/40-2.pdf", "The issue ↗"],
  ["2009 to 2010", "The film", "Producer Steven M. Bumgardner counts about seven events on Yosemite Creek in 2009, mostly in April, and 20 or 30 in 2010, in April, May and even early June, and makes Yosemite Nature Notes episode 9.", "https://www.nps.gov/yose/planyourvisit/frazilice.htm", "The NPS page ↗"],
  ["2017 and 2023", "Closed trails", "In early 2017 the slush flooded the Lower Yosemite Fall Trail and it closed, as reported by the San Francisco Chronicle. In January 2023 rangers posted video of ice over the bridge and trail and closed the area until it melted.", "https://www.advnture.com/news/video-shows-dangerous-lava-like-frazil-ice-at-yosemite-national-park", "The report ↗"],
];

// Mirrored in edge/seo.js's "/frazil-ice" faq (the JSON-LD). Change both.
const FZ_FAQ = [
  ["What is frazil ice?", "Slush made from waterfall mist. On cold mornings when a creek is running high, mist from the fall freezes into tiny ice crystals that float down the creek, so the channel seems to be full of slush rather than water. In Yosemite it can pile up, dam the creek, and move like slow lava."],
  ["When can you see frazil ice in Yosemite?", "Most often in spring, especially April, and sometimes in March and May. It can happen in fall or winter too, whenever the waterfalls carry a lot of water and the Valley drops below freezing overnight. It is weather-driven and hard to predict more than a day ahead."],
  ["What time of day does frazil ice happen?", "In the morning, usually before 9 a.m., after a night below freezing. As the sun warms the Valley, the flow eases."],
  ["Where is the best place to see frazil ice?", "Yosemite Creek just below Lower Yosemite Fall, from the paved Lower Yosemite Fall loop and its bridges. The park also lists Ribbon Creek and Sentinel Creek."],
  ["Is frazil ice dangerous?", "Yes. It looks like snow you could walk on, but it is slush over moving water, and people and animals can sink in and be trapped beneath it. It can dam a creek and send the water somewhere new without warning. Watch from the trail, and stay off the ice and the banks."],
  ["Is frazil ice the same as the ice cone?", "No. The ice cone is the mound of frozen spray and fallen ice that builds at the base of Upper Yosemite Fall in winter, sometimes more than 300 feet tall, usually melted by mid-April. Frazil ice forms in the creek below the Lower Fall."],
  ["How do I know if frazil ice is happening?", "Watch for the setup: a warm spell that swells Yosemite Falls, then a clear night that drops well below freezing. Check the Yosemite Falls camera for a big white column, and the forecast low for the Valley floor. Then be at the creek early."],
  ["Is there a video of Yosemite frazil ice?", "Yes. The National Park Service's Yosemite Nature Notes episode 9, Frazil Ice, filmed the flows on Yosemite Creek. It is embedded on this page."],
];

function FrazilIcePage({ go }) {
  const toc = [
    ["#frazil-film", "The film"],
    ["#frazil-what", "What it is"],
    ["#frazil-when", "When"],
    ["#frazil-where", "Where to watch"],
    ["#frazil-safety", "Stay off it"],
    ["#frazil-record", "The record"],
    ["#frazil-faq", "Questions"],
  ];
  const elPortal = { id: "el-portal", dest: "El Portal, California" };

  return (
    <div className="page hp-tool hp-event hp-frazil-ice">
      <div className="ff-cover fz-cover">
        <ResponsiveImage image="img/frazil-ice-yosemite-creek-nps.jpg" eager className="ff-cover__img"
          alt="Frazil ice choking Yosemite Creek: white slush filling the channel between banks of piled ice"
          sizes="100vw" />
        <HpPageHead
          go={go}
          crumbs={[{ label: "Home", route: "home" }, { label: "Frazil ice" }]}
          eyebrow="YOSEMITE CREEK · COLD SPRING MORNINGS · BEFORE 9 A.M."
          title="Frazil Ice in Yosemite"
          intro="On some spring mornings Yosemite Creek runs white. The mist from the falls has frozen in the night into crystals, the crystals have packed into slush, and the slush is moving down the channel like wet concrete, piling up, damming, and spilling over its banks. This page covers what it is, when the conditions line up, where to watch it, and why you never step on it."
          actions={<React.Fragment>
            <HomeLink go={go} location="frazil_head" className="hp-button" href="#frazil-film">Watch the film <span>↓</span></HomeLink>
            <HomeLink go={go} location="frazil_head" className="hp-link" href="#frazil-when">When it happens ↓</HomeLink>
          </React.Fragment>}
        >
          <AffiliateDisclosure />
        </HpPageHead>
        <p className="ff-cover__credit">Photo: National Park Service (public domain)</p>
      </div>

      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="calendar" /><dt>The season</dt><dd>Spring, mostly April</dd></div>
          <div><EventIcon name="clock" /><dt>The hour</dt><dd>Morning, before 9 a.m.</dd></div>
          <div><EventIcon name="pin" /><dt>The place</dt><dd>Yosemite Creek, below the Lower Fall</dd></div>
          <div><EventIcon name="no" /><dt>The rule</dt><dd>Never walk on it</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {toc.map(([href, label]) => (
            <HomeLink key={href} go={go} location="frazil_toc" href={href}>{label}</HomeLink>
          ))}
        </nav>
      </div>

      {/* The film first: a moving slurry is the one thing a photograph cannot
          show, and the park filmed it at the creek this page sends people to. */}
      <section className="hp-wrap hp-section fz-film" id="frazil-film" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE FILM</p>
            <h2>Watch the creek move</h2>
            <p className="ff-lede">The National Park Service filmed the flows on Yosemite Creek for Yosemite Nature Notes, and the footage does what no still can: the slush slides, stalls, builds a dam, and breaks through. The producer counted about seven events while making it in one spring and twenty or thirty the next.</p>
            <p className="ff-lede">Seven and a half minutes, and the easiest way to see frazil ice without standing beside a freezing creek at dawn.</p>
          </div>
          <NatureNotesFilm
            id="frazil-ice"
            title="Frazil Ice"
            youtubeId="9V9p4mFEYXc"
            episode={9}
            note="Slush from the falls moving down Yosemite Creek on cold spring mornings, filmed by the park."
            location="frazil_ice"
            className="fz-film__nn"
          />
        </div>
      </section>

      <section className="ff-band" id="frazil-what" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">WHAT IT IS</p>
            <h2>Waterfall mist, frozen, then poured</h2>
            <p className="ff-lede">The park's definition: on some mornings, when the creeks are running relatively high but the temperature is below freezing, a creek may seem to be full of slush rather than water. That is frazil ice. It forms when waterfall mist freezes, then floats down the creek.</p>
            <p className="ff-lede">The word comes from the French for cinders. The crystals start as thin flat discs, grow to about a tenth of an inch across, and stick to anything just below freezing: a rock, a bridge pier, each other. In the churning water below a big fall the whole creek can turn to a spongy mass that dams itself, rises, and breaks out somewhere new.</p>
            <p className="ff-note">The mechanism and the measurements are from Yosemite Nature Notes, 1954 and 1961; the definition is the National Park Service's.</p>
          </div>
          <ol className="ff-hours fz-steps">
            <li><span>The day before</span><p>A warm spell melts snow fast and Yosemite Falls swells.</p></li>
            <li><span>The night</span><p>A clear sky, and the temperature drops sharply below freezing.</p></li>
            <li><span>In the fall</span><p>Spray freezes into crystals as it descends.</p></li>
            <li><span>In the creek</span><p>The churning water below the Lower Fall drives the crystals under and through; they grip the rocks and each other.</p></li>
            <li className="is-glow"><span>Dawn to 9 a.m.</span><p>Slush packs the channel, dams, spills, and moves downstream like slow lava.</p></li>
            <li><span>Mid-morning</span><p>The sun warms the Valley and the flow eases. The banks can hold the ice for days.</p></li>
          </ol>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="frazil-when" tabIndex={-1}>
        <div className="ff-split ff-split--end">
          <div>
            <p className="hp-eyebrow">WHEN</p>
            <h2>A spring morning after a warm spell</h2>
            <p className="ff-lede">The park says frazil ice can come in fall, winter or spring, whenever the falls carry relatively high flow and the Valley drops below freezing overnight. It comes most often in spring, especially April, sometimes in March and May. It cannot be booked: it is weather, a day or two of warning at best.</p>
          </div>
          <dl className="ff-conditions">
            <div><EventIcon name="drop" size={24} /><dt>High water</dt><dd>A warm spell first</dd></div>
            <div><EventIcon name="therm" size={24} /><dt>A hard night</dt><dd>Well below freezing</dd></div>
            <div><EventIcon name="clock" size={24} /><dt>Early</dt><dd>Before 9 a.m.</dd></div>
          </dl>
        </div>
        <ol className="ff-timeline">
          <li className="is-tight"><span>Winter</span><strong>Possible</strong><p>When storms or a thaw bring the falls up and the nights stay cold. Two of the recent reported events came in January and February.</p></li>
          <li className="is-tight"><span>March</span><strong>Sometimes</strong><p>The falls are building, the nights still freeze.</p></li>
          <li className="is-open"><span>April</span><strong>Most often</strong><p>Big water from the melt and frosty clear nights: the classic month.</p></li>
          <li className="is-tight"><span>May and early June</span><strong>In a big year</strong><p>Only with high flow and a late cold snap.</p></li>
        </ol>
        <WebcamStrip variant="board" only={["Yosemite Falls", "Half Dome"]} />
        <ol className="ff-checks">
          <li><EventIcon name="drop" /><strong>Days before: the falls</strong><p>A warm spell after snow, and the Yosemite Falls camera showing a thick white column.</p></li>
          <li><EventIcon name="therm" /><strong>The evening: the low</strong><p>A clear night forecast well below freezing on the Valley floor. The 1953 flow followed nights of 24, 23 and 27 degrees.</p></li>
          <li><EventIcon name="clock" /><strong>Dawn: be there</strong><p>The flow is usually done by 9 a.m. Park at Yosemite Falls and walk the paved loop.</p></li>
          <li><EventIcon name="eye" /><strong>On arrival: look, from the path</strong><p>A white, slow-moving creek, ice heaped on the banks, the bridges rimmed in slush.</p></li>
        </ol>
        <div className="ff-sources">
          <h3>Sources to keep open</h3>
          <ul>
            <li><a href="https://www.nps.gov/yose/planyourvisit/frazilice.htm" target="_blank" rel="noopener noreferrer"><strong>NPS: Frazil ice ↗</strong><span>The park's own page on it</span></a></li>
            <li><a href="https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936" target="_blank" rel="noopener noreferrer"><strong>NWS point forecast, Yosemite Valley ↗</strong><span>The overnight low is the number that matters</span></a></li>
            <li><a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer"><strong>NPS current conditions ↗</strong><span>Trail and road closures, including Lower Yosemite Fall</span></a></li>
          </ul>
          <p className="ff-note">Every live feed on one page: <HomeLink go={go} location="frazil_when" href="/conditions">the conditions board</HomeLink>.</p>
        </div>
      </section>

      <section className="ff-band" id="frazil-where" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="WHERE TO WATCH" title="Yosemite Creek, from the paved loop" />
          <p className="ff-lede ff-lede--intro">The park's most famous place for it is Yosemite Creek just below Lower Yosemite Fall, where the Lower Yosemite Fall loop crosses and follows the creek. It also forms on Ribbon Creek and Sentinel Creek, and in principle below any Valley waterfall with enough water on a hard morning.</p>
          <figure className="npsmap">
            <FzCreekMap />
            <figcaption>
              {FZ_PINS.map((p) => <span key={p.n}><b>{p.n}</b> {p.label}</span>)}
              <span>Map: National Park Service (public domain), cropped.</span>
            </figcaption>
          </figure>
          <div className="ff-split fz-cone">
            <div>
              <h3>Not the ice cone</h3>
              <p className="ff-lede">The ice cone is a different thing a little higher up. Through the winter, frozen spray and ice falling from the rim build a mound at the base of Upper Yosemite Fall, sometimes more than 300 feet tall, usually melted by mid-April. When the creek below runs white in spring, people have long said the cone has "gone out." The park's naturalists corrected that in 1954: the slush is frazil ice, made fresh in the creek.</p>
            </div>
            <p className="ff-note">Look for the cone from the Valley floor below Upper Yosemite Fall in winter and early spring. A 1937 park survey, worked against a photograph from John Muir's day, put that cone at 322 feet. Sources: the NPS Yosemite Falls page; Yosemite Nature Notes, 1954 and 1961.</p>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="frazil-safety" tabIndex={-1}>
        <HpHeading eyebrow="STAY OFF IT" title="It looks like snow. It is slush over moving water." />
        <ul className="ff-rules">
          <li><EventIcon name="no" size={26} /><strong>It will not hold you</strong><p>Rangers: it is not a solid surface, and falling in and becoming trapped beneath it is a serious hazard. In 1953 a worker on snowshoes sank in and had to be pulled out.</p></li>
          <li><EventIcon name="alert" size={26} /><strong>The creek can move</strong><p>Packed ice dams the channel and the water breaks out somewhere new, suddenly. In 1953 it crossed the road and ran toward the lodge.</p></li>
          <li><EventIcon name="route" size={26} /><strong>Trails and bridges close</strong><p>When ice covers the bridge and trail, the park closes the area until it melts and is checked. Obey the closures.</p></li>
          <li className="is-exception"><EventIcon name="eye" size={26} /><strong>Watch from the path</strong><p>The paved loop and its bridges, when open, give the view. Keep children and dogs well back from the banks.</p></li>
        </ul>
        <p className="ff-alert"><EventIcon name="alert" /><span><strong>Icy pavement.</strong> The same mornings that make frazil ice glaze the trail and the bridges. Wear shoes with grip, and carry traction if you have it. Check <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">current conditions</a> before you go.</span></p>
      </section>

      <section className="ff-band" id="frazil-record" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="THE RECORD" title="Ninety years of white mornings" />
          <p className="ff-lede ff-lede--intro">The park's naturalists have photographed, measured and fought frazil ice since the 1930s. The biggest flows rearranged the creek; most just turn it white for a morning.</p>
          <ol className="ff-history">
            {FZ_RECORD.map(([year, title, text, href, linkLabel]) => (
              <li key={year}><span>{year}</span><strong>{title}</strong><p>{text} <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{linkLabel}</a></p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hp-wrap hp-section ff-split" id="frazil-faq" tabIndex={-1}>
        <div>
          <p className="hp-eyebrow">QUESTIONS</p>
          <h2>Frazil ice questions, answered</h2>
          <p className="ff-lede">The rest of early spring: <HomeLink go={go} location="frazil_faq" href="/articles/yosemite-in-march">Yosemite in March</HomeLink> and <HomeLink go={go} location="frazil_faq" href="/articles/yosemite-in-winter">Yosemite in winter</HomeLink>. The falls through the year: <HomeLink go={go} location="frazil_faq" href="/articles/yosemite-waterfalls-guide">the waterfalls guide</HomeLink>. The same creek on full-moon nights: <HomeLink go={go} location="frazil_faq" href="/moonbow">the moonbow</HomeLink>.</p>
          <div className="ff-closing">
            <p className="hp-eyebrow">BE THERE BY DAWN</p>
            <h3>Sleep close to the creek</h3>
            <p>The flow is usually over by 9 a.m. Yosemite Valley Lodge is beside the trailhead; outside the park, El Portal is 25 to 35 minutes away on the road that stays open all winter.</p>
            <AvailabilityLink destination={elPortal.dest} list="page_frazil_ice" slug={elPortal.id} className="ff-book">Search El Portal lodging ↗</AvailabilityLink>
            <p className="ff-disclosure fz-disclosure">Availability search on Expedia; we may earn a commission. <a href="/affiliate">Disclosure.</a></p>
          </div>
        </div>
        <div className="ff-faq">
          {FZ_FAQ.map(([q, a], i) => (
            <details key={q} open={i < 2}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <HpGuideBand
        go={go}
        location="frazil_ice"
        title="Out early on a cold spring morning?"
        intro="The Field Guide app carries the Valley's spring stops and waterfall walks with parking notes, and offline maps that work at the creek, where the signal does not."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="Spring, watched from inside the park"
        heading="Spring, watched from inside the park"
        blurb="Sunday Field Notes follows the water each spring: the falls, the cold mornings that turn the creek white, and what the park's naturalists recorded in the same weeks a century ago."
        location="frazil_ice"
        tag="frazil-ice"
      />
    </div>
  );
}

window.FrazilIcePage = FrazilIcePage;
