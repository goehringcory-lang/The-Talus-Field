/* global React, NatureNotesFilm, EventIcon, ResponsiveImage, AffiliateNote, AvailabilityLink, LodgingCta */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// The October 2026 feature redesign, on the where-to-eat recipe. This body
// renders on the /firefall system rather than in the 680px reading column:
// its catalog entry carries a `feature` block (data.js), so page-article.jsx
// draws the full-width photo cover and hands this body the page's width.
// Every section sits on `hp-wrap`, alternating paper and the `ff-band` tint.
// The page's own pieces are the `.cg-*` layer in styles.css.
//
// Five rules hold it up.
//   1. Every fact the article carried before the redesign that survived a
//      fact check is still here, regrouped, in the voice guide's words.
//      Every card, chip and chart restates a sentence in this body or a
//      figure on the NPS campground pages, read October 1, 2026, all listed
//      under Sources.
//   2. The section ids are the anchors the old layout generated at runtime
//      (`sec-<h2 index>-<slug40>`), pinned by hand so the deep links search
//      already carries keep landing on the same content. New sections carry
//      ids of their own.
//   3. Both maps are the National Park Service's own. The park map is /stay's
//      crop (img/nps-yosemite-stay-map.jpg, 1760 x 1410); the Valley map is
//      img/nps-valley-dining-map.jpg (840 x 500, cut from
//      img/nps-yosemite-valley-map.jpg at +1300+100). Pins are placed on the
//      NPS map's own tent symbols, and are HTML in percent of the crop so
//      the labels keep their size on a phone.
//   4. Season dates, site counts, elevations and fees in the table and the
//      season chart are the NPS campground table's, for the 2026 season. The
//      park changes them each year, and the page says so beside them.
//   5. The October 2026 fact check corrected: the release calendar (each
//      15th opens arrivals four months later, so January 15 opens May 15 to
//      June 14, not June 15 to July 14), the stay limits, the pet rule (only
//      Camp 4 and group sites bar pets), the food rule (a closed car is
//      allowed by day, never at night), the check-in deadline, the Tuolumne
//      site count, three elevations, two drive times, the shower and
//      firewood copy, and the BLM campground (reservations required).
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["yosemite-camping-complete-guide"] = function YosemiteCampingCompleteGuideBody() {
  const TOC = [
    ["#sec-0-yosemite-camping-reservations-the-realit", "Booking windows"],
    ["#release-day", "Release day"],
    ["#what-it-costs", "Costs"],
    ["#sec-1-the-cancellation-game", "Cancellations"],
    ["#all-13-campgrounds", "All 13 compared"],
    ["#sec-2-the-valley-campgrounds", "The Valley"],
    ["#sec-3-the-road-out-of-the-valley", "West and south"],
    ["#sec-4-the-high-country", "The high country"],
    ["#sec-5-the-primitive-ones", "The primitive ones"],
    ["#sec-6-yosemite-bear-safety-food-storage-rules-", "Bears and food"],
    ["#sec-7-yosemite-camping-tips-what-to-actually-b", "Rules and gear"],
    ["#sec-8-what-to-do-when-yosemite-campgrounds-are", "When it is full"],
    ["#sec-9-shoulder-season-and-off-season-camping", "Shoulder season"],
    ["#sec-10-a-few-things-people-never-mention", "Small things"],
    ["#camping-questions", "Questions"],
  ];

  const FAQ = [
    ["How do I get a camping reservation in Yosemite?", "Everything books through Recreation.gov, in four windows. Upper, Lower and North Pines, Wawona and Hodgdon Meadow release five months ahead on the 15th at 7 a.m. Pacific, one block of arrival dates at a time, and they sell out within minutes. Crane Flat, Bridalveil Creek, Tamarack Flat, White Wolf, Yosemite Creek, Porcupine Flat and half of Tuolumne Meadows release two weeks ahead on a rolling daily window; the other half of Tuolumne releases two months ahead on the 15th. Camp 4 releases one week ahead. Make your account ahead of time, decide your campground and dates, and check out the moment booking opens. You can make only two reservations per website visit or phone call."],
    ["How much does it cost to camp in Yosemite?", "Upper, Lower and North Pines, Wawona, Hodgdon Meadow, Crane Flat, Bridalveil Creek and Tuolumne Meadows are $36 a night. White Wolf is $28. Tamarack Flat, Yosemite Creek and Porcupine Flat are $24. Camp 4 is $10 per person per night. Add the park entrance fee, $35 per vehicle and good for seven days. There are no hookups anywhere in the park."],
    ["How do I get a Yosemite campsite when everything is sold out?", "Check Recreation.gov each morning at 7 for the two-week campgrounds, set cancellation alerts (Campflare and Outdoorithm have free plans, Campnab is paid), and stay flexible on dates. In the author's experience cancellations cluster in the two weeks before arrival; that pattern is not a Park Service figure. If you can take any three nights in a two-week range, your odds improve a great deal. Other doors: Camp 4's one-week window, first-come camping from late October to early April, a wilderness permit, national forest land outside the park, and private campgrounds."],
    ["What are the food storage rules at Yosemite campgrounds?", "Every campground has food lockers, and all food goes in them: food, drinks, coolers, toiletries, trash and unwashed cooking gear. Keep the locker latched even while you are at your site. By day food may ride in a car with the windows closed; after dark it goes in the locker, and never in a pickup bed. Poor storage can mean impounded food or car, removal from the campsite and a fine of up to $5,000, and bears that get human food often end up being killed."],
    ["Are there showers at Yosemite campgrounds?", "No. None of the campgrounds has showers. Curry Village has pay showers that are open 24 hours and do not require a room there; the Park Service lists the fee only as small and says to ask at the front desk. Housekeeping Camp, which is not a campground, has shower houses for its own guests."],
    ["Which Yosemite campground is best?", "It depends on what you want. Crane Flat is the all-round pick: 17 miles and about 30 minutes from the Valley, cooler and quieter, with flush toilets and drinking water. For the classic Valley trip, book Upper Pines or North Pines and look for sites near the Merced River. For solitude, Tamarack Flat and Yosemite Creek trade amenities for room."],
    ["When can you camp in the Yosemite high country?", "After the Tioga Road opens, and then on each campground's own schedule. In 2026 the road opened May 15, the earliest in 16 years, and the campgrounds opened between May 21 (Crane Flat) and July 2 (White Wolf), with Tuolumne Meadows on July 1. Dates move every year. Average lows at Tuolumne Meadows run 32 to 39 degrees from June through September, so bring a sleeping bag rated to 20 degrees."],
    ["Can I camp in Yosemite without a reservation?", "Only in the off-season. Camp 4, Hodgdon Meadow and Wawona run first-come, first-served from late October to early April (Camp 4 usually until sometime in April), and they can fill on holidays and weekends. In peak season the Park Service says not to arrive without a reservation. You may not sleep in a car or RV anywhere except a campsite you are registered for. Call 209/372-0266 for current status."],
  ];

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // ── The release-day picker ────────────────────────────────────────────────
  // Recreation.gov's own example: on January 15, arrivals May 15 to June 14
  // open. So a block of arrivals (the 15th to the 14th) opens on the 15th
  // four months before it starts. Arrival on the 15th or later in a month
  // sits in the block that starts that month; arrival on the 1st to the 14th
  // sits in the block that started the month before.
  const [arrMonth, setArrMonth] = React.useState(7);
  const [arrLate, setArrLate] = React.useState(false);
  const blockStart = arrLate ? arrMonth : arrMonth - 1;
  const releaseIdx = blockStart - 4;
  const releaseMonth = MONTHS[(releaseIdx + 12) % 12];
  const startName = MONTHS[(blockStart + 12) % 12];
  const endName = MONTHS[(blockStart + 13) % 12];

  // ── The campgrounds, as the NPS table prints them for 2026 ───────────────
  // [id, name, group, sites, elevation, fee, window, season, water, rv, firstCome]
  const CAMPS = [
    ["upper-pines", "Upper Pines", "valley", 236, 4000, 36, "5 months", "All year", "Tap", "35 ft RV, 24 ft trailer", ""],
    ["lower-pines", "Lower Pines", "valley", 74, 4000, 36, "5 months", "Apr 21 to Oct 19", "Tap", "40 ft RV, 35 ft trailer", ""],
    ["north-pines", "North Pines", "valley", 81, 4000, 36, "5 months", "Apr 21 to Oct 26", "Tap", "40 ft RV, 35 ft trailer (8 sites)", ""],
    ["camp-4", "Camp 4", "valley", 61, 4000, 10, "1 week", "All year", "Tap", "Walk-in, tents only", "First-come outside Apr 15 to Nov 29"],
    ["wawona", "Wawona", "south", 95, 4000, 36, "5 months", "All year", "Tap", "35 ft RV, 35 ft trailer", "First-come late Oct to early Apr"],
    ["bridalveil", "Bridalveil Creek", "south", 110, 7200, 36, "2 weeks", "Jul 3 to Aug 14", "Tap", "35 ft RV, 24 ft trailer", ""],
    ["hodgdon", "Hodgdon Meadow", "west", 100, 4900, 36, "5 months", "All year", "Tap", "35 ft RV, 30 ft trailer", "First-come late Oct to early Apr"],
    ["crane-flat", "Crane Flat", "west", 148, 6200, 36, "2 weeks", "May 21 to Oct 12", "Tap", "35 ft RV, 35 ft trailer", ""],
    ["tamarack", "Tamarack Flat", "tioga", 52, 6300, 24, "2 weeks", "Jun 22 to Oct 12", "Creek, boil", "No RVs or trailers", ""],
    ["white-wolf", "White Wolf", "tioga", 68, 8000, 28, "2 weeks", "Jul 2 to Sep 14", "None in 2026", "27 ft RV, 24 ft trailer", ""],
    ["yosemite-creek", "Yosemite Creek", "tioga", 74, 7700, 24, "2 weeks", "Jul 1 to Sep 7", "Creek, boil", "RVs not recommended", ""],
    ["porcupine", "Porcupine Flat", "tioga", 55, 8100, 24, "2 weeks", "Jun 23 to Oct 11", "Creek, boil", "24 ft RV (4 sites)", ""],
    ["tuolumne", "Tuolumne Meadows", "tioga", 289, 8600, 36, "2 months and 2 weeks", "Jul 1 to Sep 27", "Tap", "35 ft RV, 24 ft trailer", ""],
  ];
  const GROUPS = [["all", "Everywhere"], ["valley", "The Valley"], ["south", "South: Wawona and Glacier Point Road"], ["west", "West: Highway 120"], ["tioga", "Tioga Road"]];
  const GROUP_NAMES = { valley: "Valley", south: "South", west: "West", tioga: "Tioga Road" };
  const SORTS = [["name", "Name"], ["sites", "Most sites"], ["elev", "Lowest elevation"], ["fee", "Lowest fee"]];
  const [group, setGroup] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("name");
  const rows = CAMPS.filter((c) => group === "all" || c[2] === group).slice().sort((a, b) => {
    if (sortBy === "sites") return b[3] - a[3];
    if (sortBy === "elev") return a[4] - b[4] || a[1].localeCompare(b[1]);
    if (sortBy === "fee") return a[5] - b[5] || a[1].localeCompare(b[1]);
    return a[1].localeCompare(b[1]);
  });
  const feeText = (c) => (c[0] === "camp-4" ? "$10 per person" : "$" + c[5]);
  const fmtFt = (n) => n.toLocaleString("en-US") + " ft";

  // ── The park map: where the other eight sit ─────────────────────────────
  // Crop pixels (1760 x 1410), on the NPS map's own campground symbols.
  const PARK_W = 1760, PARK_H = 1410;
  const PARK_SPOTS = [
    { at: [90, 533], side: "r", tone: "west", name: "Hodgdon Meadow", note: "4,900 ft" },
    { at: [193, 665], side: "r", tone: "west", name: "Crane Flat", note: "6,200 ft" },
    { at: [374, 634], side: "r", tone: "tioga", name: "Tamarack Flat", note: "6,300 ft" },
    { at: [513, 331], side: "r", tone: "tioga", name: "White Wolf", note: "8,000 ft" },
    { at: [666, 470], side: "l", tone: "tioga", name: "Yosemite Creek", note: "7,700 ft" },
    { at: [736, 481], side: "r", tone: "tioga", name: "Porcupine Flat", note: "8,100 ft" },
    { at: [1183, 313], side: "b", tone: "tioga", name: "Tuolumne Meadows", note: "8,600 ft" },
    { at: [638, 880], side: "r", tone: "south", name: "Bridalveil Creek", note: "7,200 ft" },
    { at: [453, 1214], side: "l", tone: "south", name: "Wawona", note: "4,000 ft" },
    { at: [690, 712], side: "r", tone: "valley", name: "Yosemite Valley", note: "Four campgrounds, 4,000 ft" },
  ];
  const TONES = [["valley", "The Valley"], ["south", "South"], ["west", "Highway 120"], ["tioga", "Tioga Road"]];
  const pct = (x, y, w, h) => ({ left: (x / w) * 100 + "%", top: (y / h) * 100 + "%" });

  function ParkCampMap() {
    return (
      <figure className="cg-map cg-map--park">
        <div className="cg-map__frame">
          <ResponsiveImage image="img/nps-yosemite-stay-map.jpg" className="cg-map__img" sizes="(max-width: 880px) 100vw, 640px" style={{ aspectRatio: "1760 / 1410" }}
            alt="National Park Service map of Yosemite with the campgrounds marked: Hodgdon Meadow and Crane Flat on the west side, Tamarack Flat, White Wolf, Yosemite Creek, Porcupine Flat and Tuolumne Meadows along the Tioga Road, Bridalveil Creek on Glacier Point Road, Wawona in the south, and the four Valley campgrounds in Yosemite Valley." />
          <div className="cg-map__layer" aria-hidden="true">
            {PARK_SPOTS.map((s) => (
              <span key={s.name} className={"cg-spot cg-spot--" + s.side + " is-" + s.tone} style={pct(s.at[0], s.at[1], PARK_W, PARK_H)}>
                <i /><b>{s.name}</b><small>{s.note}</small>
              </span>
            ))}
          </div>
        </div>
        <figcaption>
          <ul className="cg-key">
            {TONES.map(([t, label]) => <li key={t} className={"is-" + t}>{label}</li>)}
          </ul>
          <span>Map: National Park Service (public domain), cropped. Housekeeping Camp is not one of the 13.</span>
        </figcaption>
      </figure>
    );
  }

  // The Valley's five places to sleep on the ground, numbered. Crop pixels
  // (840 x 500) from the NPS Valley map's own tent symbols.
  const VALLEY_W = 840, VALLEY_H = 500;
  const VALLEY_PINS = [
    { n: "1", at: [79, 261], name: "Camp 4" },
    { n: "2", at: [451, 255], name: "Housekeeping Camp" },
    { n: "3", at: [675, 230], name: "North Pines" },
    { n: "4", at: [669, 288], name: "Lower Pines" },
    { n: "5", at: [744, 363], name: "Upper Pines" },
  ];
  function ValleyCampMap() {
    return (
      <figure className="cg-map cg-map--valley">
        <div className="cg-map__frame">
          <img src="/img/nps-valley-dining-map.jpg" width="840" height="500" loading="lazy" decoding="async" className="cg-map__img"
            alt="National Park Service map of the east end of Yosemite Valley with the places to camp marked: Camp 4 to the west below Yosemite Falls, Housekeeping Camp beside the Merced River, and North Pines, Lower Pines and Upper Pines at the east end near Happy Isles." />
          <div className="cg-map__layer" aria-hidden="true">
            {VALLEY_PINS.map((p) => (
              <span key={p.n} className="cg-pin" style={pct(p.at[0], p.at[1], VALLEY_W, VALLEY_H)}><b>{p.n}</b></span>
            ))}
          </div>
        </div>
        <figcaption>
          {VALLEY_PINS.map((p) => <span key={p.n} className="cg-map__num"><b>{p.n}</b> {p.name}</span>)}
          <span>Map: National Park Service (public domain), cropped.</span>
        </figcaption>
      </figure>
    );
  }

  // ── The season chart: 2026 dates from the NPS table ─────────────────────
  // [id, label, [[kind, m1, d1, m2, d2]...], caption]. `res` is a reserved
  // stretch, `fcfs` first-come.
  const CUM = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const doy = (m, d) => CUM[m - 1] + d;
  const SEASONS = [
    ["Upper Pines", [["res", 1, 1, 12, 31]], "All year, reservations"],
    ["Lower Pines", [["res", 4, 21, 10, 19]], "Apr 21 to Oct 19"],
    ["North Pines", [["res", 4, 21, 10, 26]], "Apr 21 to Oct 26"],
    ["Camp 4", [["fcfs", 1, 1, 4, 14], ["res", 4, 15, 11, 29], ["fcfs", 11, 30, 12, 31]], "Reserved Apr 15 to Nov 29; first-come otherwise"],
    ["Wawona", [["fcfs", 1, 1, 4, 14], ["res", 4, 15, 10, 26], ["fcfs", 10, 27, 12, 31]], "Reserved Apr 15 to Oct 26; first-come otherwise"],
    ["Hodgdon Meadow", [["fcfs", 1, 1, 4, 14], ["res", 4, 15, 10, 26], ["fcfs", 10, 27, 12, 31]], "Reserved Apr 15 to Oct 26; first-come otherwise"],
    ["Crane Flat", [["res", 5, 21, 10, 12]], "May 21 to Oct 12"],
    ["Tamarack Flat", [["res", 6, 22, 10, 12]], "Jun 22 to Oct 12"],
    ["Porcupine Flat", [["res", 6, 23, 10, 11]], "Jun 23 to Oct 11"],
    ["Tuolumne Meadows", [["res", 7, 1, 9, 27]], "Jul 1 to Sep 27"],
    ["Yosemite Creek", [["res", 7, 1, 9, 7]], "Jul 1 to Sep 7"],
    ["White Wolf", [["res", 7, 2, 9, 14]], "Jul 2 to Sep 14"],
    ["Bridalveil Creek", [["res", 7, 3, 8, 14]], "Jul 3 to Aug 14, closed early"],
  ];
  const MONTH_ABBR = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  // ── Valley and Tuolumne nights, June to September (NPS averages) ─────────
  const NIGHTS = [["June", 51, 33], ["July", 57, 39], ["August", 57, 37], ["September", 51, 32]];

  // ── Food locker openings, in inches (NPS) ───────────────────────────────
  const LOCKERS = [
    { w: 43, h: 28, d: 35, name: "Most campgrounds", note: "35 deep, 43 wide, 28 high" },
    { w: 45, h: 18, d: 33, name: "Yosemite Creek, Porcupine Flat", note: "33 deep, 45 wide, 18 high" },
    { w: 49, h: 17, d: 17, name: "White Wolf (shared)", note: "17 deep, 49 wide, 17 high" },
  ];

  // One campground card. `chips` are short facts, `pick` a badge.
  function Camp({ id, name, pick, chips, children }) {
    return (
      <article className={"cg-camp" + (pick ? " is-pick" : "")} id={id}>
        <div className="cg-camp__top">
          <h3>{name}</h3>
          {pick && <span className="cg-badge">{pick}</span>}
        </div>
        <p className="cg-camp__chips">
          {chips.map((c) => <span key={c} className="cg-chip">{c}</span>)}
        </p>
        <div className="cg-camp__text">{children}</div>
      </article>
    );
  }

  return (
    <div className="cg-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="bed" /><dt>Campgrounds</dt><dd>13 in the park, $24 to $36 a night</dd></div>
          <div><EventIcon name="calendar" /><dt>Valley sites</dt><dd>Release 5 months ahead, 15th, 7 a.m.</dd></div>
          <div><EventIcon name="clock" /><dt>High country</dt><dd>Release 2 weeks ahead, daily</dd></div>
          <div><EventIcon name="alert" /><dt>Bear lockers</dt><dd>Every scented item, fines to $5,000</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the answer, and the whole page in five lines beside it. */}
      <section className="hp-wrap hp-section cg-open">
        <div className="ff-split">
          <div className="cg-prose">
            <p className="dropcap">
              To camp in Yosemite, book on Recreation.gov. The Valley, Wawona and Hodgdon Meadow release their sites five months ahead on the 15th at 7 a.m. Pacific, and the good dates sell out within minutes. The other campgrounds, mostly on the Tioga Road, open on a rolling window two weeks ahead, and Camp 4 opens one week ahead. There are 13 campgrounds, no hookups anywhere, and a bear locker at every one.
            </p>
            <p>
              The smell is what you notice first. Not pine, exactly, though there is pine. It is the specific mix of sun-warmed incense-cedar bark, woodsmoke from a neighbor's morning fire, and the mineral tang of the Merced River thirty feet from your tent. At site 207 in Upper Pines, you can hear the river before you unzip your rain fly. By 6 a.m. the Steller's jays are already working the campground, hopping from bear box to picnic table in that strutting, entitled way they have, looking for the crumb you forgot. Half Dome is pink in the early light above the trees. You are in one of the most famous landscapes on the planet, sleeping on dirt, and it costs thirty-six dollars.
            </p>
            <p>
              The reality involves a reservation system that tests your patience, a bear storage rule that tests your organization, and a neighbor with a generator that tests your commitment to nonviolence. The dirt is worth it. I have lived in this park for close to two decades, and the campground version of Yosemite is the truest one. The lodge guests see the waterfalls. The campers hear the owls.
            </p>
            <p>Below: how to book, what it costs, how to get a site when they are gone, all 13 campgrounds on a map and in a table, then the rules, the bears and where to go when it is full.</p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="bed" /> The short version</p>
            <ul>
              <li>Valley, Wawona and Hodgdon Meadow: book on the 15th, five months ahead, at 7 a.m. Pacific.</li>
              <li>Missed it: the two-week campgrounds open a night every morning at 7.</li>
              <li>Everything with a scent goes in the locker. Fines run to $5,000.</li>
              <li>No hookups, and no showers at the campgrounds. Curry Village has pay showers.</li>
              <li>Full: Camp 4, a wilderness permit, national forest land, or a town.</li>
            </ul>
            <a className="cg-short__link" href="https://www.recreation.gov" target="_blank" rel="noopener noreferrer">Recreation.gov, where every site books ↗</a>
          </aside>
        </div>
      </section>

      {/* The booking windows and the release calendar. */}
      <section className="ff-band" id="sec-0-yosemite-camping-reservations-the-realit" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">YOSEMITE CAMPING RESERVATIONS: THE REALITY</p>
              <h2>Everything books on Recreation.gov, in four windows</h2>
              <p className="ff-lede">
                Getting a summer site takes the focus of buying tickets for a band that should be playing stadiums but insists on clubs. The windows decide which campgrounds you can fight for, and when.
              </p>
              <ol className="cg-windows">
                <li>
                  <span className="cg-windows__lead">5 months</span>
                  <strong>The Pines, Wawona, Hodgdon Meadow</strong>
                  <p>Upper Pines, Lower Pines, North Pines, Wawona and Hodgdon Meadow. On the 15th of each month at 7 a.m. Pacific, one block of arrival dates opens, from the 15th through the 14th. These sell out within minutes.</p>
                </li>
                <li>
                  <span className="cg-windows__lead">2 months</span>
                  <strong>Half of Tuolumne Meadows</strong>
                  <p>Half the sites release two months ahead, on the 15th.</p>
                </li>
                <li>
                  <span className="cg-windows__lead">2 weeks</span>
                  <strong>The rolling campgrounds</strong>
                  <p>Crane Flat, Bridalveil Creek, Tamarack Flat, White Wolf, Yosemite Creek, Porcupine Flat and the other half of Tuolumne Meadows. A new night opens every day at 7 a.m. Pacific. The competition is lighter because these sit outside the Valley, higher up, with fewer amenities. Many people do not know they exist.</p>
                </li>
                <li>
                  <span className="cg-windows__lead">1 week</span>
                  <strong>Camp 4</strong>
                  <p>The walk-in climbers' camp releases seven days ahead, daily, at 7 a.m. Pacific. Same drill.</p>
                </li>
              </ol>
              <p className="ff-note">The Park Service says reservations are required from about April through October and are extremely difficult to get, and that you may make only two reservations per website visit or phone call.</p>
            </div>
            <div className="cg-picker">
              <p className="cg-picker__head"><EventIcon name="calendar" /> Find your release day</p>
              <p className="cg-picker__label" id="cg-arr-label">The month you want to arrive</p>
              <div className="cg-picker__months" role="group" aria-labelledby="cg-arr-label">
                {MONTHS.map((m, i) => (
                  <button key={m} type="button" className={"cg-pickbtn" + (arrMonth === i ? " is-on" : "")} aria-pressed={arrMonth === i} onClick={() => setArrMonth(i)}>{m.slice(0, 3)}</button>
                ))}
              </div>
              <p className="cg-picker__label" id="cg-half-label">Which part of the month</p>
              <div className="cg-picker__halves" role="group" aria-labelledby="cg-half-label">
                <button type="button" className={"cg-pickbtn" + (!arrLate ? " is-on" : "")} aria-pressed={!arrLate} onClick={() => setArrLate(false)}>1st to 14th</button>
                <button type="button" className={"cg-pickbtn" + (arrLate ? " is-on" : "")} aria-pressed={arrLate} onClick={() => setArrLate(true)}>15th to the end</button>
              </div>
              <p className="cg-picker__answer" aria-live="polite">
                <span>Your door opens</span>
                <strong>{releaseMonth} 15, 7 a.m. Pacific</strong>
                <em>{releaseIdx < 0 ? "In the calendar year before your trip. " : ""}That release covers arrivals from {startName} 15 through {endName} 14. The Pines, Wawona and Hodgdon Meadow only.</em>
              </p>
            </div>
          </div>

          <h3 className="cg-subhead">The release calendar</h3>
          <div className="cg-cal">
            <ol aria-label="Release dates and the arrival dates each one opens">
              {MONTHS.map((m, i) => {
                const s = (i + 4) % 12;
                return (
                  <li key={m}>
                    <span>{m} 15</span>
                    <strong>{MONTHS[s].slice(0, 3)} 15 to {MONTHS[(s + 1) % 12].slice(0, 3)} 14</strong>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="ff-note">Worked from Recreation.gov's own example: on January 15, arrivals from May 15 to June 14 open. If you want the second week of August, your date is March 15, and there is no earlier door. The <a href="/dates">dates table</a> carries the same rule.</p>

          <div className="ff-alert cg-lottery">
            <EventIcon name="ticket" />
            <span><strong>One 2026 wrinkle.</strong> North Pines ran a one-time Early Access Lottery for the 2026 season. Applications ran November 24 to December 14, 2025, results went out December 22, and winners booked January 2 to February 1. Whatever they did not claim went back into the ordinary five-month releases from the February 15 on-sale. The Park Service said it may consider expanding the lottery to other campgrounds, so check the campground's page on Recreation.gov before you plan a release morning.</span>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="release-day" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">RELEASE DAY, STEP BY STEP</p>
            <h2>The reservation is decided in the two minutes around 7:00</h2>
            <p className="ff-lede">
              Almost all of the work that decides the outcome happens before then.
            </p>
            <div className="cg-prose">
              <p>
                The campground's page on Recreation.gov states its own on-sale date and time. It is the authoritative version, and everything else, including this page, is a summary of it. If you are visiting for the first time, the <a href="/articles/first-time-yosemite-overwhelm">first-timer's guide</a> covers the broader logistics, and <a href="/articles/camping-in-yosemite-first-time">what your first night in one of these campgrounds is actually like</a> covers the rest. Camping adds its own layer, and the reservation system is the first gate.
              </p>
            </div>
          </div>
          <ol className="ff-hours cg-steps">
            <li>
              <span>The week before</span>
              <p>Create the Recreation.gov account, confirm the email address and save a payment method. An account made at 6:58 a.m. will ask you to verify an email at 7:01.</p>
            </li>
            <li>
              <span>The night before</span>
              <p>Write down the campground, the arrival date, the nights and two fallback date ranges. Open the campground's page and confirm its on-sale time.</p>
            </li>
            <li>
              <span>Five minutes out</span>
              <p>Log in and load the campground page with your dates entered. Use one tab. A second tab racing the first does not double your odds.</p>
            </li>
            <li className="is-glow">
              <span>At 7:00</span>
              <p>Refresh once. Take the first available site that fits your party and go straight to checkout. Skip the site photos and the loop comparisons. A site you are holding beats a better one you lost while reading, and you can move later if a cancellation opens something nicer.</p>
            </li>
            <li>
              <span>If the page stalls</span>
              <p>A busy on-sale can leave you on a spinner. Wait it out. A reload throws away a request that may have been about to succeed.</p>
            </li>
            <li>
              <span>If you miss</span>
              <p>Stay on the page ten more minutes. Sites that go into a cart and never get paid for return to the pool, so a campground that reads sold out at 7:03 is not always sold out at 7:12. After that, the cancellation game is the whole strategy.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* What it costs: the four prices, and the gate. */}
      <section className="ff-band" id="what-it-costs" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">WHAT IT COSTS</p>
          <h2>$36, $28, $24, or $10 a head</h2>
          <p className="ff-lede">There are no hookups anywhere in the park, not electric, water or sewer. Sewage goes to a dump station, and the park has three: the Valley, Wawona and Tuolumne Meadows.</p>
          <ul className="cg-fees">
            <li className="cg-fee">
              <span className="cg-fee__price">$36</span>
              <strong>a night, per site</strong>
              <p>Upper, Lower and North Pines, Wawona, Hodgdon Meadow, Crane Flat, Bridalveil Creek, Tuolumne Meadows.</p>
            </li>
            <li className="cg-fee">
              <span className="cg-fee__price">$28</span>
              <strong>a night, per site</strong>
              <p>White Wolf, reduced because there is no drinking water there in 2026.</p>
            </li>
            <li className="cg-fee">
              <span className="cg-fee__price">$24</span>
              <strong>a night, per site</strong>
              <p>The primitive three: Tamarack Flat, Yosemite Creek, Porcupine Flat.</p>
            </li>
            <li className="cg-fee">
              <span className="cg-fee__price">$10</span>
              <strong>a night, per person</strong>
              <p>Camp 4, in the reservation season and the first-come season alike.</p>
            </li>
          </ul>
          <h3 className="cg-subhead">And to get in</h3>
          <dl className="cg-gate">
            <div><dt>Car</dt><dd>$35 <small>a vehicle, seven days</small></dd></div>
            <div><dt>Motorcycle</dt><dd>$30 <small>seven days</small></dd></div>
            <div><dt>On foot or by bike</dt><dd>$20 <small>a person, under 16 free</small></dd></div>
            <div><dt>Non-resident, 16 and older</dt><dd>+$100 <small>a person, since Jan 1, 2026</small></dd></div>
          </dl>
          <p className="ff-note">The entrance fee is separate from the campsite. A U.S. resident's America the Beautiful annual pass is $80 and covers the entrance fee, paying for itself on the third entry of the year. A non-resident's is $250 and also waives the $100 fee. Budget for a mixed group before you reach the gate. The campsite itself is capped at six people and two vehicles, and trailers that fit on the parking pad do not count as vehicles.</p>
        </div>
      </section>

      {/* The cancellation game. */}
      <section className="hp-wrap hp-section" id="sec-1-the-cancellation-game" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE CANCELLATION GAME</p>
            <h2>You missed 7 a.m. Cancellations are the next door</h2>
            <div className="cg-prose">
              <p>
                The campground you wanted is sold out for every date in July. People's plans change, and they give sites back all the time.
              </p>
              <p>
                You are not going to sit refreshing Recreation.gov every thirty seconds. That is what cancellation alert tools are for. <strong>Campflare</strong> and <strong>Outdoorithm</strong> both watch Recreation.gov for openings at campgrounds you name and send a notification, and both have free plans. <strong>Campnab</strong> is paid and scans faster, which matters when a site stays open for seconds. Pricing for all three changes, so read their pages.
              </p>
              <p>
                My advice: set alerts on at least two services, check Recreation.gov by hand at the moments below, and be flexible on dates. If you are locked into one weekend, your odds are slim. If you can camp any three nights in a two-week range, they improve a great deal.
              </p>
              <p>
                The <a href="/articles/yosemite-without-reservations-2026">2026 season dropped the vehicle entry reservation requirement</a> that was in place for several years. That is good news for day visitors. It changes nothing about campground reservations, and those are still the bottleneck.
              </p>
            </div>
          </div>
          <div>
            <ol className="cg-waves" aria-label="When cancellations tend to arrive">
              <li><span>About 14 days out</span><strong>The first wave</strong><p>Optimistic bookers get realistic about their schedules.</p></li>
              <li><span>3 to 5 days out</span><strong>The second wave</strong><p>Work conflicts, forecasts, and cold feet about bears.</p></li>
              <li><span>The day before</span><strong>The last wave</strong><p>People who cannot make it. These can drop at any hour.</p></li>
            </ol>
            <p className="ff-note">The waves are my own pattern from years of watching the site, not a Park Service figure.</p>
            <div className="cg-policy">
              <p className="cg-policy__head">What cancelling costs, per Recreation.gov (Upper Pines)</p>
              <dl>
                <div><dt>More than 48 hours out</dt><dd>$10 transaction fee</dd></div>
                <div><dt>Within 48 hours</dt><dd>$10 plus the first night</dd></div>
                <div><dt>No-show</dt><dd>$20 plus the first night</dd></div>
              </dl>
              <p className="ff-note">One-night stays pay no extra $10 but get no refund. The terms are set per campground and they change, so confirm them on your own reservation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* All 13: the two maps, the table, the season chart. */}
      <section className="ff-band" id="all-13-campgrounds" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">ALL 13 CAMPGROUNDS</p>
          <h2>On one map and in one table</h2>
          <p className="ff-lede">
            The Park Service lists 13. Four are in the Valley, two to the south, two on the Highway 120 side, and five along the Tioga Road. Figures below are the Park Service's table for the 2026 season, read October 1, 2026. Seasons, water and closures change every year.
          </p>
          <div className="ff-split cg-maps">
            <ParkCampMap />
            <div>
              <ValleyCampMap />
              <p className="ff-note">Housekeeping Camp, number 2, is canvas-roofed shelters booked through the park concessioner, not a Park Service campground, so it is not one of the 13.</p>
            </div>
          </div>

          <h3 className="cg-subhead" id="campground-table">Sort and filter</h3>
          <div className="cg-filter" role="group" aria-label="Show campgrounds in">
            {GROUPS.map(([k, label]) => (
              <button key={k} type="button" className={"cg-filter__chip" + (group === k ? " is-on" : "")} aria-pressed={group === k} onClick={() => setGroup(k)}>{label}</button>
            ))}
          </div>
          <div className="cg-filter cg-filter--sort" role="group" aria-label="Sort campgrounds by">
            <span>Sort by</span>
            {SORTS.map(([k, label]) => (
              <button key={k} type="button" className={"cg-filter__chip" + (sortBy === k ? " is-on" : "")} aria-pressed={sortBy === k} onClick={() => setSortBy(k)}>{label}</button>
            ))}
          </div>
          <div className="cg-table-wrap">
            <table className="cg-table">
              <thead>
                <tr>
                  <th scope="col">Campground</th>
                  <th scope="col">Area</th>
                  <th scope="col">Sites</th>
                  <th scope="col">Elevation</th>
                  <th scope="col">Fee</th>
                  <th scope="col">Books</th>
                  <th scope="col">2026 season</th>
                  <th scope="col">Water</th>
                  <th scope="col">Largest rig</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c[0]}>
                    <th scope="row" data-label="Campground">{c[1]}</th>
                    <td data-label="Area">{GROUP_NAMES[c[2]]}</td>
                    <td data-label="Sites">{c[3]}</td>
                    <td data-label="Elevation">{fmtFt(c[4])}</td>
                    <td data-label="Fee">{feeText(c)}</td>
                    <td data-label="Books"><span className={"cg-chip cg-chip--win is-" + c[6].split(" ")[0] + "-" + (c[6].split(" ")[1] || "")}>{c[6]} ahead</span></td>
                    <td data-label="2026 season">{c[7]}{c[10] ? <small className="cg-table__sub">{c[10]}</small> : null}</td>
                    <td data-label="Water"><span className={"cg-water" + (c[8] === "None in 2026" ? " is-none" : c[8] === "Tap" ? "" : " is-creek")}>{c[8]}</span></td>
                    <td data-label="Largest rig">{c[9]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ff-note">Sites and elevations are the Park Service's rounded numbers. Tuolumne Meadows shows 289 campsites on the Park Service's table; its 2025 reopening release counted 336 sites in all, with backpacker, group and horse sites. Bridalveil Creek closed for the season on August 14, 2026, after a lightning strike damaged its water system and restrooms. Group and horse sites exist at several campgrounds and book separately.</p>

          <h3 className="cg-subhead" id="season-chart">When each one is open, 2026</h3>
          <div className="cg-chart">
            <div className="cg-chart__head" aria-hidden="true">
              <span />
              <div className="cg-chart__months">{MONTH_ABBR.map((m, i) => <span key={i}>{m}</span>)}</div>
              <span />
            </div>
            <ul className="cg-chart__rows">
              {SEASONS.map(([name, segs, cap]) => (
                <li key={name}>
                  <span className="cg-chart__name">{name}</span>
                  <div className="cg-chart__track" aria-hidden="true">
                    {segs.map((s, i) => {
                      const a = doy(s[1], s[2]) - 1;
                      const b = doy(s[3], s[4]);
                      return <i key={i} className={"cg-bar is-" + s[0]} style={{ left: (a / 365) * 100 + "%", width: ((b - a) / 365) * 100 + "%" }} />;
                    })}
                  </div>
                  <span className="cg-chart__cap">{cap}</span>
                </li>
              ))}
            </ul>
            <p className="cg-chart__legend">
              <span className="is-res">Reservations</span>
              <span className="is-fcfs">First-come, first-served</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Valley. */}
      <section className="hp-wrap hp-section" id="sec-2-the-valley-campgrounds" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE VALLEY CAMPGROUNDS</p>
            <h2>Flat, forested, and everything within shuttle distance</h2>
            <div className="cg-prose">
              <p>
                The Valley is the center of gravity. It sits at about 4,000 feet, flat, forested with black oak and ponderosa pine, flanked by granite walls that catch the last light and throw it back in shades you did not know rock could produce. The three Pines campgrounds, Camp 4 and Housekeeping Camp are all here.
              </p>
              <p>
                The free Valley shuttle serves them: stop 15 is Upper Pines, stop 18 is Lower Pines, stop 12 is Housekeeping Camp, and Camp 4 is near stop 7 at Yosemite Valley Lodge. Use it. Parking at trailheads in peak hours is a competitive sport.
              </p>
            </div>
          </div>
          <figure className="cg-photo">
            <ResponsiveImage image="img/upper-pines-campground.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 600px" style={{ aspectRatio: "1600 / 900" }}
              alt="The forest at Upper Pines Campground on the Yosemite Valley floor, tall trees over open ground" />
            <figcaption>Upper Pines Campground. Photo: Andrew Burnham / Wikimedia Commons (CC BY-SA 3.0)</figcaption>
          </figure>
        </div>

        <div className="cg-camps">
          <Camp id="upper-pines" name="Upper Pines" pick="The classic" chips={["236 sites", "$36", "5-month window", "Open all year"]}>
            <p>The largest Valley campground, and the one most people picture. Tap water, food lockers, a picnic table and a fire ring.</p>
            <p>It is loud. Two hundred and thirty-six sites in one forest means you hear your neighbors, their kids and the crinkle of their packaging during quiet hours, 10 p.m. to 6 a.m. The sites nearest the Merced River are the ones locals pick, because you can fall asleep to moving water; the Recreation.gov map shows which they are. Generator hours are 7 to 9 a.m., noon to 2 p.m. and 5 to 7 p.m., and if you are in a tent next to an RV, those hours will define your morning.</p>
            <p>Upper Pines is open all year. In winter it is a different world: snow on the ground and silence except for the river.</p>
          </Camp>
          <Camp id="lower-pines" name="Lower Pines" chips={["74 sites", "$36", "5-month window", "Apr 21 to Oct 19 in 2026"]}>
            <p>Smaller, with the same general character as Upper Pines, and the shuttle stops here too. It feels calmer because there are fewer people, but the sites are still close together.</p>
          </Camp>
          <Camp id="north-pines" name="North Pines" pick="For hikers" chips={["81 sites", "$36", "5-month window", "Apr 21 to Oct 26 in 2026"]}>
            <p>The best-placed of the three for hikers, near the road to Mirror Lake and the east-end trailheads, which means you can roll out of your sleeping bag and be on the trail in minutes. The trail to <a href="/articles/so-you-want-to-hike-half-dome">Half Dome</a> starts at Happy Isles, a short walk or shuttle ride east. Sites along the river have more breathing room and the Merced is constant. North Pines fills with serious hikers and climbers in peak season.</p>
          </Camp>
          <Camp id="camp-4" name="Camp 4" pick="Climbers' camp" chips={["61 sites", "$10 a person", "1-week window", "No pets"]}>
            <p>This is not for people who want a quiet family night. Camp 4 is a walk-in, shared campsite, tents only, listed on the National Register of Historic Places in 2003 for its place in the history of rock climbing.</p>
            <p>You carry your gear from the parking area and share a site with strangers. The sites sit close together in a way that makes Upper Pines look spacious. The crowd skews young, fit and climbing-oriented, though anyone can book. Camp 4 is loud, social and raw. If that sounds terrible, it is not for you.</p>
            <p>In 2026, reservations run from April 15 through November 29, one week ahead on a rolling daily window, and during peak season it sells out at 7 a.m. like everything else. Outside those dates it goes first-come, first-served, which makes winter one of the easier ways to camp in the Valley.</p>
          </Camp>
          <Camp id="housekeeping-camp" name="Housekeeping Camp" pick="Not a campground" chips={["266 units", "Sleeps up to 6", "Apr 3 to Oct 12 in 2026", "No pets"]}>
            <p>Canvas-roofed shelters, each with a bunk bed and a double bed, a table, chairs and electric outlets, on the bank of the Merced. It has its own shower houses for guests, and you can bring a sleeping bag or rent a bed pack.</p>
            <p>It books through Yosemite Hospitality, like the park's lodges, not Recreation.gov, with a first-night deposit and its own prices. It suits families and people who want the atmosphere without sleeping on the ground, and when tent camping is sold out, it is a separate inventory worth checking.</p>
          </Camp>
          <figure className="cg-photo cg-photo--camp4">
            <ResponsiveImage image="img/housekeeping-camp-yosemite.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 420px" style={{ aspectRatio: "1600 / 1071" }}
              alt="A Housekeeping Camp unit: concrete walls, a canvas roof over the patio, a table and folding chairs, pines behind" />
            <figcaption>A Housekeeping Camp unit. Photo: advencap / Wikimedia Commons (CC BY-SA 2.0)</figcaption>
          </figure>
        </div>
      </section>

      {/* West and south. */}
      <section className="ff-band" id="sec-3-the-road-out-of-the-valley" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">THE ROAD OUT OF THE VALLEY</p>
          <h2>The Valley gets the attention. These get the peace</h2>
          <p className="ff-lede">If you value quiet over proximity, consider these three. All have tap water, and all sit lower than the high country, so none gets Tuolumne's cold.</p>
          <div className="cg-camps cg-camps--three">
            <Camp id="wawona" name="Wawona" pick="Underrated" chips={["95 sites", "$36", "5-month window", "27 miles, about 45 min to the Valley"]}>
              <p>Ninety-five sites at 4,000 feet at the south end of the park, near the Mariposa Grove of Giant Sequoias, which means you can walk among the largest trees on earth without fighting Valley traffic. Flush toilets, drinking water and a food locker at each site, and the gentle South Fork of the Merced runs alongside.</p>
              <p>It books on the five-month window and fills quickly, but not as fast as the Valley campgrounds. In 2026, Loops B and C are reserved through October 26 and Loop A through November 29, then it goes first-come, first-served. The drive into the Valley is the trade-off: plan your Valley days carefully.</p>
            </Camp>
            <Camp id="hodgdon" name="Hodgdon Meadow" pick="Late arrivals" chips={["100 sites", "$36", "5-month window", "25 miles, about 45 min to the Valley"]}>
              <p>One hundred sites at about 4,900 feet, half a mile inside the Big Oak Flat entrance on the park's west side. Flush toilets, drinking water, paved parking spurs and a locker at every site. Reservations run through October 26 in 2026, then it goes first-come, first-served until early April.</p>
              <p>It is the first campground you reach coming from the Bay Area on Highway 120, which makes it a strong option if you arrive late and do not want to drive another hour into the Valley in the dark. The caveat is the road: it sits close to Highway 120, so choose sites farther from it.</p>
            </Camp>
            <Camp id="crane-flat" name="Crane Flat" pick="The Swiss Army knife" chips={["148 sites", "$36", "2-week window", "17 miles, about 30 min to the Valley"]}>
              <p>One hundred and forty-eight sites at about 6,200 feet, near the junction of Big Oak Flat Road and the Tioga Road. It is cooler and quieter than the Valley and sits at the crossroads of the park. The best campground in Yosemite depends on what you value, but Crane Flat is the all-round answer.</p>
              <p>It books on the two-week rolling window, so the competition is less frantic. Flush toilets and drinking water, with a small gas station and store at the junction. The forest is thick, the sites are separated, and on a clear night the sky is noticeably better than from the Valley floor. For <a href="/articles/yosemite-stargazing-where-to-look-up">stargazing conditions</a>, elevation and distance from the Valley's light make a real difference. In 2026 it ran May 21 to October 12.</p>
            </Camp>
          </div>
        </div>
      </section>

      {/* The high country. */}
      <section className="hp-wrap hp-section" id="sec-4-the-high-country" tabIndex={-1}>
        <div className="ff-split">
          <figure className="cg-photo">
            <ResponsiveImage image="img/tuolumne-meadows-late-summer.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 600px" style={{ aspectRatio: "1600 / 1068" }}
              alt="Tuolumne Meadows with its grasses gone gold and the high peaks beyond" />
            <figcaption>Tuolumne Meadows in late summer. Photo: Dsdugan / Wikimedia Commons (CC0)</figcaption>
          </figure>
          <div>
            <p className="hp-eyebrow">THE HIGH COUNTRY</p>
            <h2>A different experience entirely</h2>
            <div className="cg-prose">
              <p>
                The Tioga Road opens in late May or June in most years, and a heavy winter or a late storm can push it later. In 2026 it opened on May 15, the earliest in sixteen years. The road opening is not the campground opening. The high country campgrounds come online on their own dates, mostly from late June, once water and sanitation are running, and July is the honest planning assumption for most of them.
              </p>
              <p>
                The air is thinner here and the nights are colder. The landscape shifts from the Valley's granite-and-forest drama to something more exposed and alpine, more honest about what the Sierra Nevada actually is.
              </p>
            </div>
          </div>
        </div>

        <div className="cg-cold">
          <p className="cg-cold__head"><EventIcon name="therm" /> Average nighttime lows, in degrees Fahrenheit</p>
          <ul aria-label="Average lows in Yosemite Valley and Tuolumne Meadows, June to September">
            {NIGHTS.map(([m, v, t]) => (
              <li key={m}>
                <span className="cg-cold__month">{m}</span>
                <div className="cg-cold__bars" aria-hidden="true">
                  <i className="is-valley" style={{ width: (v / 60) * 100 + "%" }} />
                  <i className="is-tuol" style={{ width: (t / 60) * 100 + "%" }} />
                </div>
                <span className="cg-cold__nums"><b>{v}</b> Valley <b>{t}</b> Tuolumne</span>
              </li>
            ))}
          </ul>
          <p className="ff-note">National Park Service averages for Yosemite Valley (4,000 feet) and Tuolumne Meadows (8,600 feet). Averages, not floors: a clear night runs colder. Bring a sleeping bag rated to at least 20 degrees and a warm layer you can sleep in. People who pack for the Valley's warm nights and drive up to Tuolumne are consistently, memorably cold.</p>
        </div>

        <div className="cg-camps cg-camps--three">
          <Camp id="tuolumne" name="Tuolumne Meadows" pick="The crown jewel" chips={["289 sites", "$36", "2-month and 2-week windows", "Jul 1 to Sep 27 in 2026"]}>
            <p>The largest campground in the park, at 8,600 feet. It reopened on August 1, 2025, after a three-year, $26 million rehabilitation that closed it from 2022, with rebuilt restrooms and new water and sewer systems. Twenty-nine of the sites are new hike-in sites, the closest thing to backcountry camping you can do with a car in the lot. The meadows stretch wide and golden, the Tuolumne River winds through them, and the granite domes are smoother and rounder than the Valley's cliffs.</p>
            <p>Half the sites book on the two-month window, released on the 15th, and half on the two-week rolling window. Expect more competition than the site count suggests: several years of people who wanted Tuolumne and could not have it are pointed at the same inventory. The two-month window is a smaller crowd than the Valley's five-month scramble, but not an empty one. The Tuolumne Meadows store and grill are nearby in season.</p>
            <p>It is the staging area for the park's best backcountry: Cathedral Lakes, Lyell Canyon, the Pacific Crest Trail. <a href="/articles/hetch-hetchy-the-other-yosemite-valley">Hetch Hetchy</a> is also reachable from the Tioga corridor.</p>
          </Camp>
          <Camp id="white-wolf" name="White Wolf" chips={["68 sites", "$28", "2-week window", "Jul 2 to Sep 14 in 2026"]}>
            <p>Sixty-eight sites at 8,000 feet, reached by a spur road off the Tioga Road. It has long been one of the park's quieter campgrounds, in dense lodgepole pine where the light comes through in long golden shafts in the evening.</p>
            <p>For 2026, White Wolf has portable toilets and no drinking water, because of sewer system problems. Bring your own water or a reliable filter, and expect shared food lockers. It changes the character of the place, and it also keeps the crowds thinner. The season is short and the dates move, and the park treats them as tentative until the road is open and the facilities are ready. Do not book flights around them.</p>
          </Camp>
          <Camp id="bridalveil-creek" name="Bridalveil Creek" chips={["110 sites", "$36", "2-week window", "Jul 3 to Aug 14 in 2026"]}>
            <p>One hundred and ten sites at 7,200 feet on Glacier Point Road. It is named for Bridalveil Creek, which runs nearby, not for Bridalveil Fall, which is in the Valley, thousands of feet below. The confusion is common.</p>
            <p>It is a strong base for the <a href="/articles/four-mile-up-panorama-down">Four Mile and Panorama trails</a> from Glacier Point: camp at elevation, drive to Glacier Point, and hike down into the Valley. Restrooms and tap water, a two-week window, and cold nights that are not Tuolumne-cold. The 2026 season ended on August 14, after a lightning strike damaged the water system and restrooms.</p>
          </Camp>
        </div>
      </section>

      {/* The primitive ones. */}
      <section className="ff-band" id="sec-5-the-primitive-ones" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">THE PRIMITIVE ONES</p>
          <h2>Twenty-four dollars, a vault toilet, and room</h2>
          <p className="ff-lede">No flush toilets. No drinking water: creek water has to be boiled or treated. Access roads that most RVs should skip. They are the best-kept camping secret in Yosemite, and the people who know them tend not to advertise.</p>
          <div className="cg-camps cg-camps--three">
            <Camp id="tamarack-flat" name="Tamarack Flat" pick="Rarely full" chips={["52 sites", "$24", "2-week window", "6,300 ft", "No RVs"]}>
              <p>Reached by a 3-mile narrow, single-lane road with many hairpin turns off the Tioga Road. No RVs or trailers, vault toilets, food lockers and no cell reception. The road filters out most casual campers, and what remains is a quiet campground in a pine-and-fir forest.</p>
              <p>The sites are spread out, and you can find the kind of privacy where you cannot see another tent from yours. If you <a href="/articles/pack-your-car-for-yosemite">pack your car properly</a> with water and supplies, it is a revelation.</p>
            </Camp>
            <Camp id="yosemite-creek" name="Yosemite Creek" chips={["74 sites", "$24", "2-week window", "7,700 ft", "RVs not recommended"]}>
              <p>Down a rough dirt road off the Tioga Road, one of the most remote campgrounds in the park you can still drive to. Vault toilets and no drinking water. A seasonal creek runs through it.</p>
              <p>The road is slow. The payoff is a campground that feels like backcountry without the backpack, with real distance between sites. It is reservation-only, with no first-come sites.</p>
            </Camp>
            <Camp id="porcupine-flat" name="Porcupine Flat" pick="When all else is full" chips={["55 sites", "$24", "2-week window", "8,100 ft", "No cell service"]}>
              <p>Right on the Tioga Road, about 30 minutes west of Tuolumne Meadows and more than an hour from the Valley. Vault toilets, no drinking water, and Porcupine Creek as the only water source. Only four sites take a 24-foot RV.</p>
              <p>It is one of the last campgrounds to fill on any given night. It is functional more than beautiful, but it is a campsite in Yosemite, and when everything else is taken, that counts for a great deal.</p>
            </Camp>
          </div>
        </div>
      </section>

      {/* Bears and food. */}
      <section className="hp-wrap hp-section" id="sec-6-yosemite-bear-safety-food-storage-rules-" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">YOSEMITE BEAR SAFETY: FOOD STORAGE RULES THAT MATTER</p>
            <h2>The locker is the campground rule. The canister is the backcountry rule</h2>
            <div className="cg-prose">
              <p>
                Yosemite's black bears are not theoretical. They are around the campgrounds all season, and they know what a cooler looks like and what a scented candle smells like. They are better at food storage than most of the people reading this.
              </p>
              <p>
                Every campground has food lockers, and you must store all your food in them, 24 hours a day. "Food" means any scented item, whatever the packaging: canned goods, drinks, soap, cosmetics, toiletries, trash, ice chests and unwashed cooking utensils. Rangers enforce it. Failure to store food properly can mean impounded food or car, removal from your campsite and a fine of up to $5,000. More importantly, bears that get human food often lose their fear of people and end up being killed to protect people. Lazy food storage can kill a bear.
              </p>
              <p>
                At camp the protocol is simple. Cook and eat at your picnic table. Clean up right away. Put everything back in the locker and latch it before you walk away, every time, even if you are only going to the bathroom. Bears may come into a campsite while you are standing in it, and they need minutes, not hours.
              </p>
            </div>
          </div>
          <NatureNotesFilm id="black-bears" title="Black Bears" youtubeId="ijIePq9gGfo" episode={26}
            note="The animal the storage rule is written for." location="article" />
        </div>

        <ul className="ff-rules cg-bear">
          <li className="is-exception">
            <EventIcon name="bed" size={26} />
            <strong>In your campsite</strong>
            <p>Food, drinks, coolers, toiletries and trash go in the locker, closed and latched, even while you are at your site.</p>
          </li>
          <li className="is-exception">
            <EventIcon name="car" size={26} />
            <strong>In a car, by day</strong>
            <p>Food may stay inside a car with the windows closed during daylight. After dark it goes in a locker.</p>
          </li>
          <li>
            <EventIcon name="no" size={26} />
            <strong>Never</strong>
            <p>In a pickup truck bed or on the outside of a vehicle, at any hour.</p>
          </li>
          <li>
            <EventIcon name="alert" size={26} />
            <strong>The penalty</strong>
            <p>Impounded food or car, removal from the campsite, and a fine of up to $5,000.</p>
          </li>
        </ul>

        <div className="ff-split cg-lockers-wrap">
          <div>
            <h3 className="cg-subhead">How big is the locker?</h3>
            <p className="cg-prose-p">Most campground lockers are 35 inches deep, 43 wide and 28 high. Two campgrounds have shorter ones, and White Wolf's are shared. Drawn to scale, front openings only:</p>
            <ul className="cg-lockers" aria-label="Food locker sizes in inches">
              {LOCKERS.map((l) => (
                <li key={l.name}>
                  <div className="cg-lockers__box" style={{ width: l.w * 2.6 + "px", height: l.h * 2.6 + "px" }} aria-hidden="true" />
                  <strong>{l.name}</strong>
                  <span>{l.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="cg-prose">
            <p>
              The backcountry rule is a bear canister. Allowed bear-resistant canisters are required throughout the Yosemite Wilderness. The Park Service rents them for $5 a week with a $95 deposit by credit card, at wilderness permit stations: Yosemite Valley year-round, and Wawona, Tuolumne Meadows and Big Oak Flat in summer. If your camping trip has a night in the wilderness attached to it, sort out the canister before you are at the trailhead.
            </p>
            <p>
              At night, if you hear a bear in the campground, make noise. Bang pots. Yell. Do not approach it, do not feed it, and do not take a selfie with it. I have watched people do all three, and each time I felt a specific kind of exhaustion that is hard to describe. Raccoons, jays and squirrels go after the same things, and the same lockers keep them out. A raccoon will unzip a tent pocket for a tube of toothpaste.
            </p>
          </div>
        </div>
      </section>

      {/* Rules and gear. */}
      <section className="ff-band" id="sec-7-yosemite-camping-tips-what-to-actually-b" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">YOSEMITE CAMPING TIPS: WHAT TO ACTUALLY BRING</p>
          <h2>The numbers that govern a campsite, and the gear that catches people out</h2>
          <ul className="cg-nums">
            <li><span>10 p.m. to 6 a.m.</span><strong>Quiet hours</strong><p>Variably enforced. If a neighbor's kids are screaming at 10:30, your options are a polite request, earplugs or the host. The second works.</p></li>
            <li><span>7 to 9, noon to 2, 5 to 7</span><strong>Generator hours</strong><p>Morning, midday and evening, and no other time.</p></li>
            <li><span>Noon</span><strong>Check-in and checkout</strong><p>Late arrivals should call ahead. Check in by the morning after your first night, 10 a.m. on the rules page and noon on the FAQ, or the whole reservation is forfeited. Aim for the earlier one.</p></li>
            <li><span>6 people, 2 vehicles</span><strong>Per campsite</strong><p>Trailers do not count against the vehicle limit if they fit on the parking pad.</p></li>
            <li><span>14 nights</span><strong>May 1 to Sep 15</strong><p>Only seven of them may be in Yosemite Valley or Wawona.</p></li>
            <li><span>30 nights</span><strong>A calendar year</strong><p>The limit for camping in the park.</p></li>
          </ul>

          <div className="cg-tips">
            <article>
              <EventIcon name="drop" size={26} />
              <strong>Bring more water than you think</strong>
              <p>The developed campgrounds have tap water, but the primitive ones do not, and White Wolf has none in 2026. Even where there is a tap, it can be a walk from your site. Bring containers and fill them when you arrive.</p>
            </article>
            <article>
              <EventIcon name="therm" size={26} />
              <strong>Bring warm layers in any season</strong>
              <p>Valley summer lows average 51 to 57 degrees. Tuolumne's average 32 to 39. People consistently under-pack for Yosemite nights.</p>
            </article>
            <article>
              <EventIcon name="bolt" size={26} />
              <strong>Bring a headlamp</strong>
              <p>You need both hands free when you are working a locker latch in the dark.</p>
            </article>
            <article>
              <EventIcon name="tree" size={26} />
              <strong>Firewood: buy it or gather it</strong>
              <p>Do not bring firewood from more than 50 miles away, because it spreads forest pests. Gathering is limited to dead and downed wood under six inches across, below 9,600 feet, and not in Yosemite Valley outside campground boundaries. In the Valley, the Village Store sells firewood. From May through September, fires in the Valley and at Hodgdon Meadow are allowed only from 5 to 10 p.m.</p>
            </article>
            <article>
              <EventIcon name="drop" size={26} />
              <strong>Showers: none at the campgrounds</strong>
              <p>The nearest are at Curry Village, open 24 hours for a small fee, and you do not need to be a guest. Ask at the front desk. The line in peak season can stretch past the point where a shower feels worth waiting for. Baby wipes are not glamorous, but they are honest.</p>
            </article>
            <article>
              <EventIcon name="signal" size={26} />
              <strong>Cell service: do not count on it</strong>
              <p>Tamarack Flat and Porcupine Flat list no cell reception at all. Download your maps before you drive up, and read it as a problem or a gift, as you like.</p>
            </article>
            <article>
              <EventIcon name="no" size={26} />
              <strong>Pets: allowed, with limits</strong>
              <p>Pets may stay in every campground except Camp 4 and the group sites, on a leash, and never left unattended. Trails and buildings are another matter, and <a href="/articles/pets-in-yosemite">the pets guide</a> has the rules. It limits your day a good deal, so plan for it.</p>
            </article>
            <article>
              <EventIcon name="check" size={26} />
              <strong>Checking in</strong>
              <p>Check in at the campground kiosk when you arrive. If you arrive after hours, finish check-in the next morning, and tell the park if you will be late.</p>
            </article>
          </div>
          <p className="ff-note">If you are thinking about gear more broadly, the <a href="/articles/pack-your-car-for-yosemite">car packing guide</a> covers the full list. These are the items that catch people off guard.</p>
        </div>
      </section>

      {/* When it is full: the ladder. */}
      <section className="hp-wrap hp-section" id="sec-8-what-to-do-when-yosemite-campgrounds-are" tabIndex={-1}>
        <p className="hp-eyebrow">WHAT TO DO WHEN YOSEMITE CAMPGROUNDS ARE FULL</p>
        <h2>It is July and everything is booked. Work down this ladder</h2>
        <p className="ff-lede">
          The cancellation alerts have gone silent. Being shut out of Yosemite campgrounds does not mean being shut out of Yosemite. It means being creative about where you sleep. One rule stays fixed: you may not sleep in your car or RV anywhere except a campsite you are registered for.
        </p>
        <ol className="cg-ladder">
          <li>
            <span className="cg-ladder__n">1</span>
            <div>
              <strong>Check the rolling windows every morning</strong>
              <p>At 7 a.m. a new night opens at the two-week campgrounds, and Camp 4 opens a week out. Stay flexible on dates and keep the alerts running.</p>
              <p className="cg-ladder__meta"><span className="cg-chip">In the park</span><span className="cg-chip">Reservation</span></p>
            </div>
          </li>
          <li>
            <span className="cg-ladder__n">2</span>
            <div>
              <strong>Housekeeping Camp and the lodges</strong>
              <p>Housekeeping Camp runs on a different inventory, and the park's lodges and hotels sometimes have last-minute availability, particularly midweek.</p>
              <p className="cg-ladder__meta"><span className="cg-chip">In the park</span><span className="cg-chip">Concessioner</span></p>
            </div>
          </li>
          <li>
            <span className="cg-ladder__n">3</span>
            <div>
              <strong>Walk in through the wilderness desk</strong>
              <p>The park's backpackers campgrounds are a separate inventory, and you cannot book them directly. A wilderness permit holder may spend the night before a trip and the night after it in one, for $8 a person. They are in the Valley (open with North Pines), at Tuolumne Meadows and White Wolf in summer, and at Hetch Hetchy all year. Permits move on their own schedule: 60 percent release by lottery 24 weeks ahead and the rest a week ahead on Recreation.gov, entirely apart from the campground scramble that just defeated you.</p>
              <p>This is not a loophole. It is a real trip with a pack on it, and the food rule is stricter: a bear canister you carry, not a locker. For a party that can walk, it is often the shortest path from no reservation to sleeping inside the park. The <a href="/articles/yosemite-wilderness-permits-guide">wilderness permits guide</a> covers the system.</p>
              <p className="cg-ladder__meta"><span className="cg-chip">In the park</span><span className="cg-chip">$8 a person</span><span className="cg-chip">Permit needed</span></p>
            </div>
          </li>
          <li>
            <span className="cg-ladder__n">4</span>
            <div>
              <strong>Camp in the off-season without a reservation</strong>
              <p>Late October to early April, Camp 4, Hodgdon Meadow and Wawona go first-come, first-served. They can fill on holidays and weekends, and the park's status line is 209/372-0266. In peak season, the Park Service says not to arrive without a reservation.</p>
              <p className="cg-ladder__meta"><span className="cg-chip">In the park</span><span className="cg-chip">First-come</span></p>
            </div>
          </li>
          <li>
            <span className="cg-ladder__n">5</span>
            <div>
              <strong>National forest land</strong>
              <p>Yosemite is ringed by Sierra National Forest to the south and Stanislaus National Forest to the north, where the competition is a fraction and some camping is free. Dispersed camping means no services at all: no water, toilets, tables or trash pickup, and a California campfire permit if you want a fire.</p>
              <p><strong>Hardin Flat Road</strong>, off Highway 120 west of the Big Oak Flat entrance, is a dispersed area on the Stanislaus's Highway 120 corridor, just outside the park. <strong>Goat Meadow</strong>, off Mt. Raymond Road near Fish Camp, is the southern equivalent, rough and without amenities. There are no lockers, so plan your food storage before you go.</p>
              <p className="cg-ladder__meta"><span className="cg-chip">Outside</span><span className="cg-chip">Free</span><span className="cg-chip">No services</span></p>
            </div>
          </li>
          <li>
            <span className="cg-ladder__n">6</span>
            <div>
              <strong>BLM land on the Merced River</strong>
              <p>The Bureau of Land Management runs campgrounds on the Merced River along Highway 140 west of El Portal, Railroad Flat among them, a short morning drive into the park. Sites are $20 a night, and reservations are required, so this is not a walk-up fallback.</p>
              <p className="cg-ladder__meta"><span className="cg-chip">Outside</span><span className="cg-chip">$20 a site</span><span className="cg-chip">Reservation</span></p>
            </div>
          </li>
          <li>
            <span className="cg-ladder__n">7</span>
            <div>
              <strong>Private land</strong>
              <p>The private campgrounds, ranch sites and canvas-tent operations outside the park cluster around Mariposa, Groveland and Fish Camp. That inventory never appears on Recreation.gov, which is exactly why it survives after the federal campgrounds sell out. <a className="aff-link" href={window.buildAffiliateLink("hipcamp", "https://www.hipcamp.com/")} target="_blank" rel="sponsored noopener" data-aff-network="hipcamp" data-aff-list="article_inline" data-aff-item-slug="yosemite-camping-complete-guide" data-aff-name="Hipcamp private camping">Hipcamp</a> is where most of it lives. Search the gateway town closest to your entrance, read the access notes carefully, because some sites are a rough dirt road from the highway, and check the cancellation policy before you commit.</p>
              <p className="cg-ladder__meta"><span className="cg-chip">Outside</span><span className="cg-chip">Prices vary</span></p>
            </div>
          </li>
          <li>
            <span className="cg-ladder__n">8</span>
            <div>
              <strong>A roof in a gateway town</strong>
              <p>The <a href="/articles/yosemite-gateway-towns-compared">gateway towns</a> each have a character. El Portal is closest to the Valley, Mariposa has more services, Groveland is quieter, and Fish Camp puts you near the Mariposa Grove. If the trip has collapsed into "we need a roof tonight," <AvailabilityLink destination="Mariposa, California" list="article_inline" slug="yosemite-camping-complete-guide" name="Mariposa lodging search">a live search of Mariposa motels</AvailabilityLink> is the two-minute version of that decision.</p>
              <p className="cg-ladder__meta"><span className="cg-chip">Outside</span><span className="cg-chip">A bed</span></p>
            </div>
          </li>
        </ol>
      </section>

      {/* Shoulder season and off-season. */}
      <section className="ff-band" id="sec-9-shoulder-season-and-off-season-camping" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">SHOULDER SEASON AND OFF-SEASON CAMPING</p>
          <h2>Yosemite in the shoulder season is better than Yosemite in July</h2>
          <p className="ff-lede">The crowds thin and the light softens. The <a href="/articles/water-ouzels-waterfalls">waterfalls</a>, which can be a trickle by August, are thundering in May and again after the autumn rains.</p>
          <div className="cg-seasons">
            <article>
              <p className="cg-seasons__when">May and early June</p>
              <h3>Peak waterfalls</h3>
              <p>The Valley campgrounds are open and bookable, and midweek availability is often findable without the 7 a.m. scramble. Nights are cool, and the high country is still under snow. The Tioga Road typically opens in late May or June, and the campgrounds along it lag the road by weeks. Plan as if Tuolumne, White Wolf and everything on that corridor is unavailable, and treat an early opening as a bonus.</p>
            </article>
            <article>
              <p className="cg-seasons__when">September and early October</p>
              <h3>The golden weeks</h3>
              <p>The black oaks turn yellow and the crowds drop. The Valley campgrounds are still running but easier to book. The high country campgrounds start closing, in 2026 from September 7 (Yosemite Creek) and September 14 (White Wolf) through October 12 (Crane Flat, Tamarack Flat), but the weather at elevation is often spectacular: clear, cool and dry. The best camping weather Yosemite offers.</p>
            </article>
            <article>
              <p className="cg-seasons__when">Late October through March</p>
              <h3>The off-season</h3>
              <p>Upper Pines is open all year. Wawona and Hodgdon Meadow run first-come, first-served from late October to early April, and Camp 4 is first-come outside its reservation season. You can often drive in and find a site without advance planning. Valley lows average 28 to 30 degrees in December through February, most of the park is under snow from about November through May, and winter camping is beautiful and cold. If you have a four-season tent and a bag rated to 15 degrees, it will rearrange your understanding of the place.</p>
            </article>
            <article className="is-warn">
              <p className="cg-seasons__when">August and September</p>
              <h3>Smoke season</h3>
              <p>During <a href="/articles/yosemite-during-smoke-season">smoke season</a>, which has increasingly reached August and September, campground air can deteriorate fast. Check AirNow.gov before booking and monitor conditions during your stay. Camping in heavy smoke is unpleasant at best and dangerous for people with respiratory conditions.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Small things. */}
      <section className="hp-wrap hp-section" id="sec-10-a-few-things-people-never-mention" tabIndex={-1}>
        <p className="hp-eyebrow">A FEW THINGS PEOPLE NEVER MENTION</p>
        <h2>Small things that decide a night</h2>
        <ul className="ff-rules cg-small">
          <li>
            <EventIcon name="users" size={26} />
            <strong>The bathrooms</strong>
            <p>They are cleaned regularly, but by evening on a summer Saturday they are what they are. Bring your own toilet paper as backup.</p>
          </li>
          <li>
            <EventIcon name="clock" size={26} />
            <strong>Quiet hours</strong>
            <p>10 p.m. to 6 a.m. Earplugs are cheaper than a confrontation, and the campground host is the reliable second step.</p>
          </li>
          <li>
            <EventIcon name="route" size={26} />
            <strong>The free shuttle</strong>
            <p>It stops at the Valley campgrounds, and parking at trailheads is a competitive sport. If you want to hike the <a href="/articles/mist-trail-the-real-guide">Mist Trail</a> from your campsite, the shuttle is how. <a href="/articles/yosemite-for-non-hikers">Non-hikers</a> can have an exceptional camping trip without summiting anything.</p>
          </li>
          <li>
            <EventIcon name="ticket" size={26} />
            <strong>Half Dome</strong>
            <p>The <a href="/half-dome-lottery">Half Dome permit lottery</a> is a separate system. Having a campsite does not give you a Half Dome permit.</p>
          </li>
        </ul>
      </section>

      {/* The close: the sky, the sleep, and the night the plan fails. */}
      <div className="cg-slab">
        <ResponsiveImage image="img/milky-way-sentinel-dome.jpg" className="cg-slab__img" sizes="100vw" style={{ aspectRatio: "16 / 10" }}
          alt="The Milky Way arching over Sentinel Dome, a dark sky full of stars above the dome's rounded granite" />
        <div className="hp-wrap cg-slab__copy" id="sec-11-what-the-dirt-teaches-you" tabIndex={-1}>
          <h2 className="cg-slab__title">What the dirt teaches you</h2>
          <blockquote className="cg-slab__quote">
            The reservation is hard to get. The bear locker is awkward to load. The shower situation is suboptimal. None of that matters at 10:01 p.m., when quiet hours begin and the campground finally sounds like the wilderness it was built inside.
          </blockquote>
          <p className="cg-slab__text">
            There is a moment on the second night of every camping trip when the campground stops being a logistics problem and starts being a place. The fire has burned down to coals. The generator-hour people are asleep. The river is the loudest thing for a mile. In the Valley, the granite walls are a shade of gray that has no name, holding the last light while the sky behind them goes black and fills with stars. You are not visiting Yosemite. You are in it. The ground under your sleeping pad is the same granite that Ahwahneechee families managed with fire for centuries, that John Muir walked, that was here when the glaciers carved the Valley and will be here long after every reservation system has been replaced by something equally frustrating. The ground is hard. The stars are close. You sleep well.
          </p>
        </div>
        <p className="ff-cover__credit">The Milky Way over Sentinel Dome. Photo: Jackhen1992 / Wikimedia Commons (CC BY-SA 4.0)</p>
      </div>

      <section className="hp-wrap hp-section" id="camping-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Camping in Yosemite, answered</h2>
            <div className="cg-lodging">
              <LodgingCta
                destination="Groveland, California"
                heading="For the night the campground plan fails"
                note="A storm, a closure, or a reservation that never materialized. Every camper eventually has this night, and the fastest version of solving it is a live search of the nearest gateway rather than driving the highway looking for vacancy signs. Groveland here; the other towns are one page over."
                list="article_cta"
                slug="yosemite-camping-complete-guide"
                cta="Search Groveland lodging →"
              />
            </div>
            <div className="cg-sources">
              <h3>Sources, all read October 1, 2026</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/campgrounds.htm" target="_blank" rel="noopener noreferrer">Campgrounds, NPS Yosemite</a> (sites, elevations, fees, 2026 seasons, windows)</li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/camping.htm" target="_blank" rel="noopener noreferrer">Campground reservations, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/campingfaq.htm" target="_blank" rel="noopener noreferrer">Campground reservations FAQ, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/campregs.htm" target="_blank" rel="noopener noreferrer">Campground regulations, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/nrcamping.htm" target="_blank" rel="noopener noreferrer">Camping without a reservation, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/camp4.htm" target="_blank" rel="noopener noreferrer">Camp 4, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/lottery-pilot.htm" target="_blank" rel="noopener noreferrer">North Pines Early Access Lottery, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/lockers.htm" target="_blank" rel="noopener noreferrer">Bearproof food lockers, NPS Yosemite</a> and <a href="https://www.nps.gov/yose/planyourvisit/bears.htm" target="_blank" rel="noopener noreferrer">Bears and food storage</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/bearcanrentals.htm" target="_blank" rel="noopener noreferrer">Renting a bear canister, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/bpcamp.htm" target="_blank" rel="noopener noreferrer">Backpackers campgrounds</a> and <a href="https://www.nps.gov/yose/planyourvisit/wpres.htm" target="_blank" rel="noopener noreferrer">wilderness permit reservations, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/fees.htm" target="_blank" rel="noopener noreferrer">Fees, NPS Yosemite</a>, <a href="https://www.nps.gov/aboutus/nonresident-fees.htm" target="_blank" rel="noopener noreferrer">nonresident fees</a> and <a href="https://www.nps.gov/planyourvisit/passes.htm" target="_blank" rel="noopener noreferrer">entrance passes, NPS</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/weather.htm" target="_blank" rel="noopener noreferrer">Weather, NPS Yosemite</a> (the average lows)</li>
                <li><a href="https://www.nps.gov/yose/learn/news/yosemite-national-park-announces-reopening-of-tuolumne-meadows-campground-following-major-rehabilitation-project.htm" target="_blank" rel="noopener noreferrer">Tuolumne Meadows Campground reopening, NPS news release</a></li>
                <li><a href="https://www.nps.gov/yose/learn/news/yosemite-national-park-announces-summer-reopenings-full-campground-access-and-early-tioga-road-opening.htm" target="_blank" rel="noopener noreferrer">Summer reopenings and the Tioga Road, NPS news release</a></li>
                <li><a href="https://www.nps.gov/places/000/curry-village.htm" target="_blank" rel="noopener noreferrer">Curry Village, NPS</a> (showers)</li>
                <li><a href="https://www.recreation.gov/camping/campgrounds/232447" target="_blank" rel="noopener noreferrer">Upper Pines Campground, Recreation.gov</a> (the release example and the cancellation fees)</li>
                <li><a href="https://www.recreation.gov/camping/campgrounds/232452" target="_blank" rel="noopener noreferrer">Crane Flat</a>, <a href="https://www.recreation.gov/camping/campgrounds/232446" target="_blank" rel="noopener noreferrer">Wawona</a>, <a href="https://www.recreation.gov/camping/campgrounds/232451" target="_blank" rel="noopener noreferrer">Hodgdon Meadow</a>, <a href="https://www.recreation.gov/camping/campgrounds/10083845" target="_blank" rel="noopener noreferrer">Tamarack Flat</a>, <a href="https://www.recreation.gov/camping/campgrounds/10083831" target="_blank" rel="noopener noreferrer">Porcupine Flat</a> and <a href="https://www.recreation.gov/camping/campgrounds/10083840" target="_blank" rel="noopener noreferrer">Yosemite Creek</a>, Recreation.gov</li>
                <li><a href="https://www.travelyosemite.com/lodging/housekeeping-camp/" target="_blank" rel="noopener noreferrer">Housekeeping Camp, Yosemite Hospitality</a></li>
                <li><a href="https://www.blm.gov/visit/railroad-flat-campground" target="_blank" rel="noopener noreferrer">Railroad Flat Campground, Bureau of Land Management</a></li>
                <li><a href="https://www.fs.usda.gov/r05/stanislaus/recreation/campgrounds-highway-120-corridor" target="_blank" rel="noopener noreferrer">Highway 120 corridor, Stanislaus National Forest</a> and <a href="https://www.fs.usda.gov/r05/stanislaus/permits/campfire-permits" target="_blank" rel="noopener noreferrer">campfire permits</a></li>
                <li><a href="https://www.nps.gov/places/000/valleywide-shuttle-stop-15-upper-pines-campground.htm" target="_blank" rel="noopener noreferrer">Valley shuttle stop 15, Upper Pines</a>, <a href="https://www.nps.gov/places/000/valley-shuttle-stop-18-lower-pines-campground.htm" target="_blank" rel="noopener noreferrer">stop 18, Lower Pines</a> and <a href="https://www.nps.gov/places/000/valleywide-shuttle-stop-12-yosemite-conservation-heritage-center-housekeeping-camp.htm" target="_blank" rel="noopener noreferrer">stop 12, Housekeeping Camp</a></li>
                <li><a href="/dates">The dates table</a>, this site</li>
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
