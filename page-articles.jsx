/* global React, HpPageHead, HpArticleCard, HomeLink, ResponsiveImage, HpGuideBand, HpLetter */

// =============================================================================
// ARTICLES — `/articles` (the full index) and `/section/:slug`.
//
// The index carries two independent narrowings that compose: the section chips
// (which part of the journal a piece belongs to) and the intent filters from
// intent.jsx (which reader, at which stage, asking which question). Section is
// the editorial taxonomy; intent is the visitor's. A reader browsing "Planning"
// and a reader who needs "camping, week before arrival" are different people,
// and the page now serves both without either having to read 48 titles.
// =============================================================================

const { useState } = React;

// The section chip mirrors to ?section= with replaceState, same contract as
// the intent filters (whose writer starts from the current query string, so
// the two never clobber each other): a filtered view is a shareable link and
// survives reload, without one history entry per chip tap.
function readSectionFromUrl() {
  const raw = (new URLSearchParams(window.location.search).get("section") || "").trim();
  return window.CATEGORIES.some((c) => c.slug === raw) ? raw : "all";
}

function writeSectionToUrl(slug) {
  const params = new URLSearchParams(window.location.search);
  if (slug && slug !== "all") params.set("section", slug);
  else params.delete("section");
  const qs = params.toString();
  window.history.replaceState(window.history.state, "", window.location.pathname + (qs ? "?" + qs : ""));
}

function ArticlesIndex({ go, initialCat }) {
  const [active, setActive] = useState(() => initialCat || readSectionFromUrl());
  const filters = window.useIntentFilters();
  const pickSection = (slug) => {
    setActive(slug);
    writeSectionToUrl(slug);
  };

  const inSection = active === "all" ? window.ARTICLES : window.byCategory(active);
  const list = window.filterArticlesByIntent(inSection, filters.value);

  return (
    <div className="page hp-index">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Articles" }]}
        eyebrow="ARTICLES"
        title="Entries."
        intro="Every essay and trail report from The Talus Field, in reverse chronological order. Yosemite planning notes, trail conditions, wildlife and natural history, and seasonal guides. Filter by section or by what you actually need, or read the whole thing."
      />

      <section className="hp-wrap hp-index__filters">
        <div className="hp-index__sections">
          <a href="/articles" className={`chip ${active === "all" ? "is-active" : ""}`}
            aria-current={active === "all" ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); pickSection("all"); }}>
            All ({window.ARTICLES.length})
          </a>
          {window.CATEGORIES.map(c => {
            const n = window.byCategory(c.slug).length;
            return (
              <a key={c.slug} href={`/section/${c.slug}`}
                className={`chip ${active === c.slug ? "is-active" : ""}`}
                aria-current={active === c.slug ? "true" : undefined}
                onClick={(e) => { e.preventDefault(); pickSection(c.slug); }}>
                {c.label} ({n})
              </a>
            );
          })}
        </div>

        {/* Counts inside the intent bar are scoped to the chosen section, so a
            chip never promises entries the section filter has already removed. */}
        <window.IntentFilters
          articles={inSection}
          value={filters.value}
          onToggle={filters.toggle}
          onClear={filters.clear}
          onClearMonth={filters.clearMonth}
          count={filters.count}
          resultCount={list.length}
          note={active === "all" ? "" : `Within ${window.findCategory(active).label}.`}
        />
      </section>

      <section className="hp-wrap hp-section hp-index__list">
        {list.length > 0 ? (
          <div className="hp-journal-grid">
            {list.map(a => <HpArticleCard key={a.slug} article={a} go={go} location="articles_list" />)}
          </div>
        ) : (
          <p className="hp-sub hp-index__empty">
            Nothing here carries all of those at once. Drop a filter, or{" "}
            <button type="button" className="hp-link" onClick={filters.clear}>clear them all</button>.
          </p>
        )}
      </section>
    </div>
  );
}

// =============================================================================
// /section/planning — the how-to page (October 2026). The other three sections
// stay a card grid; Planning is where a reader arrives asking "how do I book a
// campsite / get a permit / pack / drive in", so it answers those in order on
// /firefall's event system (`hp-event` + the `.ff-*` rules) and ends with the
// whole section as a filterable list. Every figure restates a published
// article, named at its block: yosemite-camping-complete-guide and
// camping-in-yosemite-first-time (the booking windows, the site, the clock, the
// bear box, the cold), yosemite-wilderness-permits-guide (quota, lottery,
// pickup, riders, rules), pack-your-car-for-yosemite and the checklist lists in
// data.js (the kits), getting-to-yosemite and the three drive articles (the
// roads). Change the article, change the line here. Every top-level name
// carries a `Ps`/`PS_` prefix: page bundles share one global scope.
// =============================================================================

const PS_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// The five-month window: arrivals in month M open on the 15th of M minus five.
const psReleaseMonth = (i) => (i + 7) % 12;

// The kits. Car camping mixes the car-trip checklist with the two camping
// articles' own advice; backpacking and the day hike are cut from the
// overnight-pack and day-pack checklists. The full lists live on /checklist.
const PS_PACKS = {
  car: {
    label: "Car camping",
    side: { eyebrow: "THE CAR IS BASE CAMP", title: "Pack the car, not just the tent", text: "A cooler kept shut and shaded holds ice three to four days in summer; one opened every half hour lasts about eight hours. Bring a rigid water jug, four to seven gallons, square with a spigot so it doesn't tip.", cta: "How to pack the car", href: "/articles/pack-your-car-for-yosemite" },
    groups: [
      { title: "Shelter and sleep", items: [["Tent sized for the group plus one"], ["Footprint, extra stakes, a mallet"], ["Sleeping bag, one per person", "20 degrees is never wrong here"], ["Closed-cell foam pad under the air pad", "The cold comes from below"]] },
      { title: "Kitchen", items: [["Double-burner propane stove"], ["A spare 1 lb propane canister"], ["Cast iron skillet and a lidded pot"], ["A cooler that fits the bear box", "Older boxes: about 18 inches tall"]] },
      { title: "Camp", items: [["Headlamp and a spare battery"], ["Earplugs", "Quiet hours are 10 p.m. to 6 a.m."], ["Baby wipes and a gallon jug", "No showers in any campground"], ["Warm hat to sleep in"]] },
      { title: "The car itself", items: [["Spare tire, practiced at home"], ["Chains, November through March", "Required when chain control is up"], ["A full tank on Tioga Road", "No gas between Lee Vining and Crane Flat"], ["Offline maps and a screenshot of the reservation"]] },
    ],
  },
  backpack: {
    label: "Backpacking",
    side: { eyebrow: "TWO THINGS ARE REQUIRED", title: "The permit and the canister", text: "An approved bear canister carries everything with a scent, toothpaste included, and you can rent one at a wilderness center. The permit itself is collected in person on your start day.", cta: "The overnight checklist", href: "/checklist" },
    groups: [
      { title: "Required", items: [["Bear canister", "Rent at a wilderness center"], ["Wilderness permit", "Collected in person, 8 to 11 a.m."]] },
      { title: "Carry and sleep", items: [["55 to 65L pack"], ["Three-season tent and footprint"], ["20°F sleeping bag"], ["Inflatable pad, R-value 4 or higher"]] },
      { title: "Kitchen and water", items: [["Stove plus a 4 oz canister"], ["Lightweight cookpot and a long spork"], ["Squeeze water filter"], ["Odor-proof food bags"]] },
      { title: "Clothing and navigation", items: [["Insulated puffy and warm sleep layers"], ["Warm hat, light gloves, dry socks"], ["Paper map and a baseplate compass"], ["Satellite messenger", "No signal on any trail"]] },
    ],
  },
  day: {
    label: "Day hike",
    side: { eyebrow: "BEFORE YOU LEAVE THE CAR", title: "Twice the snacks you think", text: "Most of the park has no signal, and the Valley's food stops thin out fast once you leave the floor. Carry the water, the map and a warm layer even when the trailhead is hot.", cta: "The day-pack checklist", href: "/checklist" },
    groups: [
      { title: "Carry", items: [["20 to 25L pack with a hip belt"], ["2L reservoir plus a 1L bottle"], ["Trail snacks, twice what you think"]] },
      { title: "Navigation", items: [["Paper map of the park"], ["Downloaded offline maps"], ["Power bank, 10,000 mAh"]] },
      { title: "Weather", items: [["Packable rain shell with taped seams"], ["Packable insulated jacket"], ["Wide-brim hat and SPF 50"]] },
      { title: "Just in case", items: [["Headlamp plus spare battery"], ["Small first aid kit and moleskin"], ["Emergency bivy or space blanket"]] },
    ],
  },
};

// The list's topic chips: the `topic` facet of window.ARTICLE_INTENT, the
// same tags the /articles intent filters read, in this page's order.
const PS_TOPICS = [
  ["all", "All"], ["camping", "Camping"], ["permits", "Permits"], ["transportation", "Getting there"],
  ["lodging", "Lodging"], ["food", "Food"], ["trails", "Trails"], ["conditions", "Conditions"],
];

// The list opens on the how-to pieces this page is about; everything else in
// the section follows in catalog order, so a new article appears on its own.
const PS_FIRST = [
  "camping-in-yosemite-first-time", "yosemite-camping-complete-guide", "yosemite-wilderness-permits-guide",
  "yosemite-walk-up-and-day-of-permits", "pack-your-car-for-yosemite", "getting-to-yosemite",
  "first-time-yosemite-overwhelm", "yosemite-without-reservations-2026",
];

const PS_FAQ = [
  ["How do I get a campsite in Yosemite?", "Everything books through Recreation.gov in three windows. The Valley campgrounds, Wawona and Hodgdon Meadow release five months ahead on the 15th at 7 a.m. Pacific, and the good dates go in three to five minutes. Six higher campgrounds release on a rolling 14 days, and Camp 4 seven days ahead.", "/articles/yosemite-camping-complete-guide", "All 13 campgrounds"],
  ["Do I need a permit to backpack in Yosemite?", "Yes, year-round, for any overnight in the wilderness. Sixty percent of each trailhead's quota goes by weekly lottery on Recreation.gov 24 weeks ahead; the other 40 percent opens seven days ahead at 7 a.m. Pacific. Day hikes need no permit, except Half Dome.", "/articles/yosemite-wilderness-permits-guide", "The permit walkthrough"],
  ["Do I need a bear canister?", "For any overnight trip in the wilderness, yes: an approved canister, carrying everything with a scent. In a campground, the site's steel food locker does the job, and everything scented goes in it, including the empty cooler.", "/articles/camping-in-yosemite-first-time", "Camping for the first time"],
  ["Are there showers in Yosemite campgrounds?", "No, at no campground in the park. The nearest public showers are at Curry Village, about five dollars, with a long line in peak season. There are no hookups at any site either.", "/articles/camping-in-yosemite-first-time", "What the site has and doesn't"],
  ["Which entrance should I use?", "For a Valley-focused visit, or any trip from November through March, the Arch Rock Entrance on Highway 140 through Mariposa. Highway 120 suits the high country and Hetch Hetchy, Highway 41 Fresno arrivals and the Mariposa Grove.", "/articles/getting-to-yosemite", "The five entrances"],
  ["Do I need a reservation to enter the park in 2026?", "No. There is no day-use, timed-entry or peak-hours reservation in 2026. You need a standard entrance pass, $35 per vehicle for seven days. Camping and in-park lodging still need booking.", "/articles/yosemite-without-reservations-2026", "The plan without one"],
];

// Line icons at the page's weight. The shared EventIcon set has no tent,
// canister or pack, so these carry their own paths.
const PS_ICON_PATHS = {
  tent: <path d="M3 20 L12 5 L21 20 Z M12 5 V20 M9 20 L12 14 L15 20" />,
  calendar: <React.Fragment><rect x="3" y="5" width="18" height="16" rx="1" /><path d="M3 10 H21 M8 3 V7 M16 3 V7" /></React.Fragment>,
  timer: <React.Fragment><circle cx="12" cy="13" r="8" /><path d="M12 9 V13 L15 15 M9 2 H15" /></React.Fragment>,
  canister: <React.Fragment><rect x="6" y="3" width="12" height="18" rx="5" /><path d="M6 9 H18 M6 15 H18" /></React.Fragment>,
  hiker: <React.Fragment><circle cx="13" cy="4" r="2" /><path d="M9 21 L11 14 L14 16 V21 M11 14 L12 8 L16 11 L18 10 M12 8 L9 10 L8 13" /><rect x="5" y="8" width="4" height="7" rx="1" /></React.Fragment>,
  lodge: <path d="M3 20 V9 L12 4 L21 9 V20 M3 20 H21 M9 20 V14 H15 V20" />,
  car: <React.Fragment><path d="M4 16 V12 L6 7 H18 L20 12 V16 Z M4 16 V19 M20 16 V19" /><circle cx="8" cy="13" r="1" /><circle cx="16" cy="13" r="1" /></React.Fragment>,
  pin: <React.Fragment><path d="M12 21 C12 21 5 14 5 9 A7 7 0 0 1 19 9 C19 14 12 21 12 21 Z" /><circle cx="12" cy="9" r="2.5" /></React.Fragment>,
  signal: <path d="M5 20 V16 M10 20 V12 M15 20 V8 M20 20 V4" />,
  chains: <React.Fragment><circle cx="7" cy="12" r="3" /><circle cx="17" cy="12" r="3" /><path d="M10 12 H14" /></React.Fragment>,
  tire: <React.Fragment><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></React.Fragment>,
  yes: <path d="M5 12 L10 17 L19 7" />,
  no: <path d="M6 6 L18 18 M18 6 L6 18" />,
  info: <React.Fragment><circle cx="12" cy="12" r="9" /><path d="M12 7 V13 M12 16.5 V17" /></React.Fragment>,
};
function PsIcon({ name, size = 26, className }) {
  return (
    <svg className={["ps-icon", className].filter(Boolean).join(" ")} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PS_ICON_PATHS[name]}
    </svg>
  );
}

function psFirstSentence(text) {
  const m = String(text || "").match(/^.*?[.?!](?=\s|$)/);
  return m ? m[0] : text;
}

function PlanningSectionPage({ go }) {
  const [arrive, setArrive] = useState(6);
  const [pack, setPack] = useState("car");
  const [topic, setTopic] = useState("all");

  const L = (location, href, children, className) => (
    <HomeLink go={go} location={location} href={href} className={className}>{children}</HomeLink>
  );

  const release = PS_MONTHS[psReleaseMonth(arrive)];
  const kit = PS_PACKS[pack];

  // The whole section, live from the catalog, the how-to pieces first.
  const intent = window.ARTICLE_INTENT || {};
  const all = window.byCategory("planning");
  const rank = (a) => { const i = PS_FIRST.indexOf(a.slug); return i === -1 ? PS_FIRST.length : i; };
  const entries = all
    .map((a, i) => ({ a, i, topics: (intent[a.slug] && intent[a.slug].topic) || [] }))
    .sort((x, y) => rank(x.a) - rank(y.a) || x.i - y.i);
  const topicLabel = Object.fromEntries(PS_TOPICS);
  const tagged = (e, k) => k === "all" || e.topics.includes(k);
  const shown = entries.filter((e) => tagged(e, topic));

  const toc = [
    ["#ps-paths", "Your kind of trip"],
    ["#ps-reserve", "Book a campsite"],
    ["#ps-first-night", "The first night"],
    ["#ps-wilderness", "Wilderness permits"],
    ["#ps-pack", "What to pack"],
    ["#ps-drive", "Plan the drive"],
    ["#ps-every-entry", "Every entry"],
    ["#ps-questions", "Questions"],
  ];

  return (
    <div className="page hp-tool hp-event hp-section-planning">
      <div className="ff-cover ps-cover">
        <ResponsiveImage image="img/campground-tent-dog-andrei-serikov.jpg" eager className="ff-cover__img"
          alt="A tent pitched in a Yosemite campground among pines, a dog resting beside it" sizes="100vw" />
        <HpPageHead
          go={go}
          crumbs={[{ label: "Home", route: "home" }, { label: "Read", route: "articles" }, { label: "Planning" }]}
          eyebrow="SECTION · PLANNING · HOW-TO GUIDES"
          title="Plan a Yosemite trip, step by step"
          intro="How to book a campsite on the release morning, spend a first night in a campground without the usual mistakes, get a wilderness permit on Recreation.gov, pack for the trip you actually booked, and choose the road in. Every step is drawn from a longer article, linked where it applies."
          actions={<React.Fragment>
            {L("section_planning_head", "#ps-paths", <React.Fragment>Choose your kind of trip <span>↓</span></React.Fragment>, "hp-button")}
            {L("section_planning_head", "#ps-reserve", "Book a campsite ↓", "hp-link")}
          </React.Fragment>}
        />
        <p className="ff-cover__credit">Photo: Andrei Serikov / Pexels</p>
      </div>

      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><PsIcon name="tent" className="ff-icon" /><dt>Campsites</dt><dd>Five months out, the 15th, 7 a.m.</dd></div>
          <div><PsIcon name="calendar" className="ff-icon" /><dt>Wilderness permits</dt><dd>Lottery 24 weeks out</dd></div>
          <div><PsIcon name="timer" className="ff-icon" /><dt>The second chance</dt><dd>Seven days out, 7 a.m.</dd></div>
          <div><PsIcon name="canister" className="ff-icon" /><dt>Overnight in wilderness</dt><dd>Bear canister, required</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {toc.map(([href, label]) => <React.Fragment key={href}>{L("section_planning_toc", href, label)}</React.Fragment>)}
        </nav>
      </div>

      {/* Four trips, four calendars. */}
      <section className="hp-wrap hp-section" id="ps-paths" tabIndex={-1}>
        <div className="ff-split ff-split--end">
          <div>
            <p className="hp-eyebrow">START WITH THE KIND OF TRIP</p>
            <h2>Four trips, four different sets of deadlines</h2>
          </div>
          <p className="ff-lede ps-flush">A campsite, a wilderness permit and a room each open on their own calendar, and each fails in its own way. Pick the one you're planning and start there.</p>
        </div>
        <div className="ps-paths">
          {[
            ["tent", "CAR CAMPING", "A first campground trip", "Book on the release morning, then learn the bear box, the cold and the campground clock before you arrive.", "#ps-reserve", "Steps 1 to 4 ↓"],
            ["hiker", "BACKPACKING", "A night in the wilderness", "A trailhead and a start date on Recreation.gov, a bear canister, and a pickup morning at a wilderness center.", "#ps-wilderness", "The permit calendar ↓"],
            ["lodge", "ROOMS", "A lodge or a gateway town", "In-park rooms book through the concessioner up to 366 days out. The gateway towns are a drive away, and the drive is the decision.", "/stay", "The lodging board →"],
            ["car", "DAY TRIP", "In and out by car", "No reservation needed to enter in 2026. The plan is the road, the hour you arrive, and what's in the trunk.", "#ps-drive", "Plan the drive ↓"],
          ].map(([icon, k, t, d, href, cta]) => (
            <HomeLink key={t} go={go} location="section_planning" href={href} className="ps-path">
              <PsIcon name={icon} size={34} />
              <span className="ps-path__k">{k}</span>
              <span className="ps-path__t">{t}</span>
              <span className="ps-path__d">{d}</span>
              <span className="ps-path__go">{cta}</span>
            </HomeLink>
          ))}
        </div>
      </section>

      {/* How to book a campsite: yosemite-camping-complete-guide. */}
      <section className="ff-band" id="ps-reserve" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">HOW TO BOOK A CAMPSITE</p>
              <h2>The release morning is won the night before</h2>
              <p className="ff-lede">Every campground in the park books through Recreation.gov. The popular ones open five months ahead, on the 15th of the month at 7 a.m. Pacific, one calendar month of arrivals at a time, and the good dates go in three to five minutes.</p>
            </div>
            <figure className="ps-photo">
              <ResponsiveImage image="img/camp-4-kiosk.jpg" alt="The registration kiosk at Camp 4 in Yosemite Valley" sizes="(max-width: 880px) 100vw, 560px" />
              <figcaption>Camp 4's kiosk. Photo: Almonroth / Wikimedia Commons (CC BY-SA 3.0)</figcaption>
            </figure>
          </div>

          <ol className="ps-steps">
            <li><span className="ps-steps__when">A week before</span><strong>Set up the account</strong><p>Create the Recreation.gov account, confirm the email address, and save a payment method to it. None of that should happen at 7:01.</p></li>
            <li><span className="ps-steps__when">The night before</span><strong>Read the campground's page</strong><p>Open its Seasons and Fees tab. Check the open dates and the window it uses, then pick three acceptable sites or loops, not one.</p></li>
            <li><span className="ps-steps__when">7:00 a.m. Pacific</span><strong>Book the first site that works</strong><p>A site you are holding is worth more than a better one you lost while reading about it. You can move later if something better opens.</p></li>
            <li><span className="ps-steps__when">Missed it</span><strong>Play the cancellations</strong><p>People cancel in waves. Set alerts on two free services (Campflare, Outdoorithm), check by hand in the peak windows, and stay flexible on dates.</p></li>
          </ol>

          <div className="ps-calc">
            <div className="ps-calc__pick">
              <p className="ps-label">When do you arrive?</p>
              <div className="ps-months" role="group" aria-label="Arrival month">
                {PS_MONTHS.map((m, i) => (
                  <button key={m} type="button" className={"ps-choice" + (i === arrive ? " is-on" : "")} aria-pressed={i === arrive} onClick={() => setArrive(i)}>{m.slice(0, 3)}</button>
                ))}
              </div>
              <p className="ff-note">For the five-month campgrounds: the three Valley Pines, Wawona and Hodgdon Meadow. Check the campground's own page first; seasons and windows change.</p>
            </div>
            <div className="ps-calc__out" aria-live="polite">
              <small>Arriving any day in {PS_MONTHS[arrive]}</small>
              <span className="ps-calc__big">Book on {release} 15</span>
              <span className="ps-calc__time">7:00 a.m. Pacific, on Recreation.gov</span>
              <p>{arrive < 5
                ? "That's the previous year: the release is five months ahead, one calendar month of arrivals at a time. Be logged in by 6:55."
                : "Five months ahead, one calendar month of arrivals at a time. Be logged in by 6:55, with three acceptable sites picked."}</p>
            </div>
          </div>

          <ul className="ps-windows" aria-label="The three booking windows">
            <li><b>Five months</b><span>The Valley campgrounds, Wawona and Hodgdon Meadow, on the 15th at 7 a.m. Pacific. $36 a night.</span></li>
            <li><b>Fourteen days</b><span>Six higher campgrounds on a rolling window: a new night every morning at 7 a.m.</span></li>
            <li><b>Seven days</b><span>Camp 4, the walk-in climbers' camp, rolling daily. $10 a person a night.</span></li>
          </ul>
          <p className="ff-note">Every campground, its window and its catch: {L("section_planning", "/articles/yosemite-camping-complete-guide", "the dirt on all 13 campgrounds")}. Every release on one subscribable calendar: {L("section_planning", "/dates", "the deadline table")}. No site at all: {L("section_planning", "/articles/yosemite-walk-up-and-day-of-permits", "what you can still get today")}.</p>
        </div>
      </section>

      {/* The first night: camping-in-yosemite-first-time. */}
      <section className="hp-wrap hp-section" id="ps-first-night" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">YOUR FIRST NIGHT IN A CAMPGROUND</p>
            <h2>It's a village with trees in it. Plan for that.</h2>
            <p className="ff-lede">The three Valley campgrounds hold roughly 380 sites on a floor a mile wide. You will hear your neighbors. What catches first-timers isn't the reservation. It's arriving at four o'clock with three hours of daylight and a list nobody handed you.</p>
            <p className="ff-note">The whole first night, from someone who has watched twenty years of them: {L("section_planning", "/articles/camping-in-yosemite-first-time", "camping in Yosemite for the first time")}.</p>
          </div>
          <div className="ps-inv">
            <div>
              <h3>What the site has</h3>
              <ul>
                {["A numbered dirt or gravel pad", "A picnic table", "A steel fire ring with a grate", "A metal food locker, the bear box", "Flush toilets and water in the Valley"].map((t) => (
                  <li key={t}><PsIcon name="yes" size={16} className="ps-yes" />{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>What it doesn't</h3>
              <ul>
                {[["Showers.", "None in any campground. Curry Village, about $5."], ["Hookups.", "No power, water or sewer at any pad."], ["Signal.", "A pleasant accident, not infrastructure."], ["Water, sometimes.", "Some primitive camps on Tioga Road have none."]].map(([b, t]) => (
                  <li key={b}><PsIcon name="no" size={16} className="ps-no" /><span><b>{b}</b> {t}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="ps-clock" role="img" aria-label="The campground day: quiet hours 10 p.m. to 6 a.m., generator hours 7 to 9, noon to 2 and 5 to 7, check-in and check-out around noon">
          <p className="hp-eyebrow">THE CLOCK NOBODY POSTS AT THE ENTRANCE</p>
          <div className="ps-clock__bar" aria-hidden="true">
            <span className="ps-seg ps-seg--quiet" style={{ left: "0%", width: "25%" }}>Quiet hours</span>
            <span className="ps-seg ps-seg--gen" style={{ left: "29.17%", width: "8.33%" }}>Generators</span>
            <span className="ps-seg ps-seg--gen" style={{ left: "50%", width: "8.33%" }}>Generators</span>
            <span className="ps-seg ps-seg--check" style={{ left: "50%" }} />
            <span className="ps-seg ps-seg--gen" style={{ left: "70.83%", width: "8.33%" }}>Generators</span>
            <span className="ps-seg ps-seg--quiet" style={{ left: "91.67%", width: "8.33%" }}>Quiet</span>
          </div>
          <div className="ps-clock__ticks" aria-hidden="true">
            <span style={{ left: "0%" }}>Midnight</span><span style={{ left: "25%" }}>6 a.m.</span><span style={{ left: "50%" }}>Noon</span><span style={{ left: "75%" }}>6 p.m.</span><span className="ps-clock__end" style={{ left: "100%" }}>Midnight</span>
          </div>
          <div className="ps-clock__key" aria-hidden="true">
            <span><i className="ps-key--quiet" />Quiet hours, 10 p.m. to 6 a.m.</span>
            <span><i className="ps-key--gen" />Generator hours: 7 to 9, noon to 2, 5 to 7</span>
            <span><i className="ps-key--check" />Check-in and check-out, around noon</span>
          </div>
        </div>

        <div className="ps-tips">
          <div className="ps-tip">
            <p className="ps-tip__n">18<small>inches</small></p>
            <h3>Measure the cooler against the box</h3>
            <div className="ps-box" aria-hidden="true">
              <div style={{ height: 78 }}>NEWER · 28 IN</div>
              <div style={{ height: 50 }}>OLDER · 18 IN</div>
            </div>
            <p>Newer lockers are about 35 by 43 by 28 inches inside. The older ones at some higher campgrounds have about 18 inches of height, and a tall upright cooler won't go in. Everything with a smell goes in, toothpaste and the empty cooler included. Latch it every time: fines run to $5,000.</p>
          </div>
          <div className="ps-tip">
            <p className="ps-tip__n">8,600<small>feet</small></p>
            <h3>Pack for your campground's elevation</h3>
            <p>The Valley sits near 4,000 feet, Tuolumne near 8,600, and a July night there can drop into the high thirties. Look up your campground, not the park, and read the forecast low as optimistic. A 20-degree bag is never wrong here.</p>
          </div>
          <div className="ps-tip">
            <p className="ps-tip__n">2<small>pads</small></p>
            <h3>The cold comes from underneath</h3>
            <p>Most people who are cold at night are losing heat to the ground, not through the bag. A cheap closed-cell foam pad under an air pad fixes more cold nights than a warmer bag. Sleep in a warm hat. Bring earplugs.</p>
          </div>
        </div>
        <p className="ff-note">Bears and what to do when you meet one: {L("section_planning", "/articles/yosemite-bears-safety-guide", "Yosemite bear safety")}. When the campfire is allowed: {L("section_planning", "/articles/yosemite-fire-restrictions-explained", "fire restrictions, explained")}.</p>
      </section>

      {/* Wilderness permits: yosemite-wilderness-permits-guide. */}
      <section className="ff-band" id="ps-wilderness" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">HOW TO GET A WILDERNESS PERMIT</p>
              <h2>You're reserving a trailhead and a start date</h2>
              <p className="ff-lede">A permit is required year-round for any night in the Yosemite Wilderness, which is 95 percent of the park. It is not a campsite: there are no assigned sites. The park caps how many people start from each trailhead each day, and Recreation.gov hands that quota out two ways.</p>
              <div className="ps-quota" role="img" aria-label="One trailhead's daily quota: 60 percent by weekly lottery, 40 percent released seven days ahead">
                <div className="ps-quota__bar" aria-hidden="true">
                  <div className="ps-quota__lottery"><b>60%</b>Weekly lottery, 24 weeks out</div>
                  <div className="ps-quota__release"><b>40%</b>Released 7 days out</div>
                </div>
                <p className="ff-note">One trailhead's daily quota, as the article draws it.</p>
              </div>
            </div>
            <figure className="ps-photo ps-photo--tall">
              <ResponsiveImage image="img/john-muir-trail-backpacker-yosemite.jpg" alt="A backpacker on the John Muir Trail in Yosemite's high country" sizes="(max-width: 880px) 100vw, 560px" />
              <figcaption>Photo: Kaitymh / Wikimedia Commons (CC BY-SA 4.0)</figcaption>
            </figure>
          </div>

          <ol className="ps-steps">
            <li><span className="ps-steps__when">24 weeks out</span><strong>Enter the weekly lottery</strong><p>Applications for a Sunday-to-Saturday week of start dates open on a Sunday, close Saturday, and run the next day. $10 to apply, $5 a person if you win. List alternate trailheads and dates: that is where most of the winning happens.</p></li>
            <li><span className="ps-steps__when">7 days out, 7 a.m.</span><strong>Or take the release</strong><p>The other 40 percent goes online first come, first served. Famous trailheads go in minutes; the ones two drainages over linger for days. Have second and third choices written down.</p></li>
            <li><span className="ps-steps__when">Start day, 8 to 11 a.m.</span><strong>Collect it in person</strong><p>A reservation isn't the permit. Pick it up at a wilderness center: Yosemite Valley, Tuolumne Meadows, Big Oak Flat, Wawona or Hetch Hetchy, seasonally. Ask for a late-arrival hold and pickup runs to 5 p.m.</p></li>
            <li><span className="ps-steps__when">At the counter</span><strong>Ask the ranger everything</strong><p>Water sources, snow on the passes, which bear is working which drainage, and where to park overnight. It is the best trail beta in the park, and it's free.</p></li>
          </ol>

          <div className="ps-riders">
            <div><h3>Half Dome, as an add-on</h3><p>If your route passes it, request Half Dome on the permit for $10 a person, under its own daily cap. A two-night Little Yosemite Valley trip is the sane way onto the cables.</p></div>
            <div><h3>A bed the night before</h3><p>The permit lets you sleep in a backpackers' campground the night before you start and the night you come out, no reservation. It solves the dawn start.</p></div>
            <div><h3>Better odds, off the Valley</h3><p>Start from Tuolumne or Hetch Hetchy, where quotas are friendlier, and start midweek. A Tuesday quota is a different universe from a Saturday one.</p></div>
          </div>

          <ul className="ps-rules" aria-label="The rules that come with the permit">
            <li><b>A bear canister</b><span>Required for every overnight. Not a hang. Rent one at a wilderness center.</span></li>
            <li><b>Four miles out</b><span>Camp at least four miles from any road or developed area, away from water and trails.</span></li>
            <li><b>No fires above 9,600 ft</b><span>And whatever the season's restrictions add below it.</span></li>
            <li><b>15 on trail, 8 off</b><span>Group-size caps, enforced.</span></li>
          </ul>
          <p className="ps-callout"><PsIcon name="info" size={20} /><span><strong>Day hikes need no permit,</strong> with one exception: Half Dome runs its own lottery, on {L("section_planning", "/half-dome-lottery", "the Half Dome lottery page")}. The full permit walkthrough: {L("section_planning", "/articles/yosemite-wilderness-permits-guide", "Yosemite wilderness permits, explained")}.</span></p>
        </div>
      </section>

      {/* What to pack: the checklist lists and pack-your-car-for-yosemite. */}
      <section className="hp-wrap hp-section" id="ps-pack" tabIndex={-1}>
        <div className="ff-split ff-split--end">
          <div>
            <p className="hp-eyebrow">WHAT TO PACK</p>
            <h2>Pack for the trip you booked</h2>
          </div>
          <p className="ff-lede ps-flush">A campground, a backpacking route and a day on the trails call for three different kits. The highlights of each are below; the full lists, with boxes to tick, are on the checklist page.</p>
        </div>
        <div className="ps-tabs" role="group" aria-label="Choose a packing list">
          {Object.keys(PS_PACKS).map((k) => (
            <button key={k} type="button" className={"ps-choice ps-tab" + (k === pack ? " is-on" : "")} aria-pressed={k === pack} onClick={() => setPack(k)}>{PS_PACKS[k].label}</button>
          ))}
        </div>
        <div className="ps-packwrap">
          <div className="ps-pack">
            {kit.groups.map((g) => (
              <div className="ps-pack__g" key={g.title}>
                <h4>{g.title}</h4>
                <ul>
                  {g.items.map(([name, note]) => (
                    <li key={name}><i aria-hidden="true" /><span>{name}{note && <em>{note}</em>}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <aside className="ps-packside">
            <p className="hp-eyebrow">{kit.side.eyebrow}</p>
            <h3>{kit.side.title}</h3>
            <p>{kit.side.text}</p>
            {L("section_planning", kit.side.href, <React.Fragment>{kit.side.cta} <span>→</span></React.Fragment>, "hp-button")}
          </aside>
        </div>
      </section>

      {/* The drive: getting-to-yosemite and the three drive articles. */}
      <section className="ff-band" id="ps-drive" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">HOW TO PLAN THE DRIVE</p>
          <h2>Pick the highway from a map, not the phone</h2>
          <p className="ff-lede">The worst hour of many trips happens before the park: an app that routes up a forest road, an entrance chosen for the hotel instead of the first stop, chains discovered at 6,000 feet in November. Choose the entrance for the trip, then drive to it.</p>
          <div className="ps-entrances">
            {[
              ["Hwy 140", "Arch Rock · Mariposa", "The all-weather road", "Lowest elevation, least snow and chain control, fastest to the Valley. From San Francisco, about 3 hours 45 minutes.", "A Valley trip, and any trip November through March", "/articles/getting-to-yosemite"],
              ["Hwy 120", "Big Oak Flat · Groveland", "The northern approach", "About four hours from the Bay Area, and the natural route to the high country, Hetch Hetchy and the Tuolumne Grove.", "Tioga Road trips and the north side", "/articles/getting-to-yosemite"],
              ["Hwy 41", "South · Oakhurst", "The southern approach", "Fresno is the closest major airport, about an hour and a quarter to this gate. The Mariposa Grove is just inside.", "Flying into Fresno, basing in Oakhurst", "/articles/getting-to-yosemite"],
              ["Tioga", "East · Lee Vining", "The seasonal door to the high country", "Reno is about three hours away, Mammoth Lakes under one. Closed in winter, and no gas between Lee Vining and Crane Flat.", "East-side trips, in season only", "/tioga-opening"],
              ["Hetch Hetchy", "Evergreen Road", "A dead end, on purpose", "Daylight hours only, and it connects to nothing else in the park. To reach the Valley you drive back out.", "The reservoir and its trails, nothing else", "/articles/getting-to-yosemite"],
            ].map(([hw, where, t, d, use, href]) => (
              <HomeLink key={hw} go={go} location="section_planning" href={href} className="ps-entrance">
                <span className="ps-entrance__hw">{hw}<small>{where}</small></span>
                <span className="ps-entrance__body"><span className="ps-entrance__t">{t}</span><span className="ps-entrance__d">{d}</span></span>
                <span className="ps-entrance__for"><b>Use it for</b>{use}</span>
              </HomeLink>
            ))}
          </div>

          <div className="ff-split ps-drive-split">
            <ul className="ps-drules">
              <li><PsIcon name="pin" size={20} /><span><b>Aim the phone at the entrance station,</b> not a lodge name. When the app and the highway signs disagree, believe the signs.</span></li>
              <li><PsIcon name="signal" size={20} /><span><b>Download the maps before you leave.</b> Cell service dies well before the park boundary on every approach.</span></li>
              <li><PsIcon name="chains" size={20} /><span><b>Carry chains, November through March.</b> When chain control goes up the law requires them, even in four-wheel drive on snow tires.</span></li>
              <li><PsIcon name="tire" size={20} /><span><b>Practice a tire change at home.</b> It decides whether a flat at Crane Flat is twenty minutes or three hours.</span></li>
            </ul>
            <div>
              <p className="hp-eyebrow">THE LONG DRIVES</p>
              <div className="ps-drives">
                {[
                  ["From Los Angeles", "313 miles, six hours", "The Park Service's number, and the Oakhurst overnight that makes the trip work.", "Where to break it →", "/articles/yosemite-from-los-angeles"],
                  ["From Las Vegas", "400 miles over Tioga Pass", "Or 495 miles and up to ten hours when the pass is shut. The calendar picks the road.", "The pass that decides →", "/articles/yosemite-from-las-vegas"],
                  ["From San Francisco, for the day", "Nine hours of driving", "Buys seven hours in the park in June and five in December.", "The honest math →", "/articles/yosemite-day-trip-from-bay-area"],
                ].map(([from, num, d, cta, href]) => (
                  <HomeLink key={from} go={go} location="section_planning" href={href} className="ps-drive">
                    <span className="ps-drive__from">{from}</span>
                    <span className="ps-drive__num">{num}</span>
                    <small>{d}</small>
                    <span className="ps-drive__go">{cta}</span>
                  </HomeLink>
                ))}
              </div>
            </div>
          </div>
          <p className="ff-note">Drive times between any two points in and around the park: {L("section_planning", "/distances", "the distance table")}. Road closed on the way in: {L("section_planning", "/articles/highway-140-closed-yosemite", "Highway 140 closed")}. Today's roads and entrance waits: {L("section_planning", "/conditions", "the conditions board")}.</p>
        </div>
      </section>

      {/* Every entry: the whole section, live from the catalog. */}
      <section className="hp-wrap hp-section" id="ps-every-entry" tabIndex={-1}>
        <div className="ff-split ff-split--end">
          <div>
            <p className="hp-eyebrow">EVERY ENTRY</p>
            <h2>The whole section, by topic</h2>
          </div>
          <p className="ff-lede ps-flush">All {entries.length} planning articles. Pick a topic to narrow the list; an article can answer more than one.</p>
        </div>
        <div className="ps-filters" role="group" aria-label="Filter by topic">
          {PS_TOPICS.map(([k, label]) => (
            <button key={k} type="button" className={"ps-choice ps-chip" + (k === topic ? " is-on" : "")} aria-pressed={k === topic} onClick={() => setTopic(k)}>
              {label} <span>{entries.filter((e) => tagged(e, k)).length}</span>
            </button>
          ))}
        </div>
        <p className="ps-count" aria-live="polite">{topic === "all"
          ? `Showing all ${shown.length} entries.`
          : `Showing ${shown.length} of ${entries.length} entries tagged ${topicLabel[topic].toLowerCase()}.`}</p>
        <div className="ps-list">
          {shown.map((e, i) => (
            <HomeLink key={e.a.slug} go={go} location="section_list" href={`/articles/${e.a.slug}`} className="ps-row">
              <span className="ps-row__n">{String(i + 1).padStart(2, "0")}</span>
              <span className="ps-row__body"><span className="ps-row__t">{e.a.title}</span><span className="ps-row__d">{psFirstSentence(e.a.dek)}</span></span>
              <span className="ps-row__k">{e.topics.length ? e.topics.map((k) => topicLabel[k] || k).join(" · ") : "Essay"}</span>
              <span className="ps-row__r">{e.a.read} read</span>
            </HomeLink>
          ))}
        </div>
      </section>

      <section className="ff-band" id="ps-questions" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Planning questions, answered</h2>
            <p className="ff-lede">The ones readers ask most, answered the way the articles answer them.</p>
            <div className="ff-closing">
              <p className="hp-eyebrow">NOT SURE WHERE TO START?</p>
              <h3>Five questions, one plan</h3>
              <p>Month, days, where you're sleeping, who's coming and what matters most. The trip planner returns a read list and a day plan capped to what the month's roads allow.</p>
              {L("section_planning", "/planning", <React.Fragment>Open the trip planner <span>→</span></React.Fragment>, "hp-button")}
            </div>
          </div>
          <div className="ff-faq">
            {PS_FAQ.map(([q, a, href, label], i) => (
              <details key={q} open={i < 2}>
                <summary>{q}</summary>
                <p>{a} {L("section_planning", href, label)}.</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <HpGuideBand
        go={go}
        location="section_planning"
        title="The plan, in your pocket where there's no signal"
        intro="The Field Guide app carries the stops, the hikes and the deadlines for your dates, with offline maps for a park that has no signal past the gate."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="The release dates, before they arrive"
        heading="The release dates, before they arrive"
        blurb="One letter a week from inside Yosemite: what the season is doing, which roads moved, and the booking window coming up next."
        location="section_planning"
        tag="planning"
      />
    </div>
  );
}

function CategoryPage({ slug, go }) {
  const cat = window.findCategory(slug);
  if (!cat) return <div className="hp-wrap hp-section">Not found.</div>;
  if (slug === "planning") return <PlanningSectionPage go={go} />;
  const items = window.byCategory(slug);
  return (
    <div className="page hp-index">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: cat.label }]}
        eyebrow="SECTION"
        title={cat.label}
        intro={cat.blurb}
      />

      <section className="hp-wrap hp-section hp-index__list">
        <div className="hp-journal-grid">
          {items.map(a => <HpArticleCard key={a.slug} article={a} go={go} location="section_list" />)}
        </div>

        <p className="hp-index__back">
          <a className="hp-link" href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>← Back to all articles</a>
        </p>
      </section>
    </div>
  );
}

window.ArticlesIndex = ArticlesIndex;
window.CategoryPage = CategoryPage;
