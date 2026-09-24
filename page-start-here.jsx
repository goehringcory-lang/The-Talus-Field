/* global React, HpPageHead, HpHeading, HpArticleCard, HpGuideBand, HpLetter, HomeLink, ResponsiveImage, LodgingCta */

// =============================================================================
// START HERE — `/start-here` route. The first-time visitor hub.
//
// Why this page exists. "Start Here" was a homepage block at `/#start-here`:
// four question links and no URL of its own, so the query family it answers
// ("first trip to Yosemite, where do I start") had nothing indexable to land
// on. This page is the orientation desk as a real page. It is triage, not an
// essay; the essay for people who feel the scale of the place is
// first-time-yosemite-overwhelm, which this page links first and does not
// replace.
//
// THE SEPTEMBER 2026 REDESIGN. The page used to be eight prose answers in a
// reading column, which asked a first-time visitor to read before they could
// see anything. It is now built to be scanned, top to bottom: the short
// answers in one strip; the four places that earned their fame (the Valley,
// Glacier Point, the Mariposa Grove, Tuolumne Meadows) pinned on the official
// NPS park map and then one block each, photo, four bullets in the order to
// do them, four facts; the one-, two- and three-day plans; the four Start
// Here articles; and the six questions, two lines each, with the five
// first-trip mistakes under them. Four rules hold it up.
//   1. The four places are the list the first-timer's guide calls right
//      ("those places earned their fame") minus Tunnel View and Cook's
//      Meadow, which are stops inside the Valley block, not places of their
//      own. The bullets follow that guide's order and hour.
//   2. The itineraries are read from window.ITINERARIES, the same table
//      /itineraries and the map's quick picks read (itineraries-data.js is in
//      this route's PAGE_MODULES entry for that reason), and the stop names
//      from points.geojson, exactly as page-itineraries.jsx resolves them. A
//      day that repeats an earlier plan's day collapses to one line instead of
//      printing nine stops a second and third time. Nothing about a plan is
//      restated in this file.
//   3. The article cards are window.START_HERE resolved through the catalog,
//      so a retitled article or a new photo reaches this page on its own.
//   4. Nothing here asserts a condition the site has not read. The place
//      blocks carry each road's season, never its status this week; the map
//      key sends the reader to the Park Bulletin for that. A hardcoded "open"
//      is right for about half the year.
//
// The map is the NPS park map (public domain, the National Park Maps
// restoration on Wikimedia Commons, File:NPS_yosemite-map.jpg). The pins are
// percentages of that image, measured off its own labels; a different map
// file means re-measuring them.
//
// SOURCING. Every fact here is quoted from the published body of the article
// its block links: the Valley sequence from yosemite-in-one-or-two-days and
// first-time-yosemite-overwhelm; Glacier Point from glacier-point-how-to-visit
// and yosemite-in-three-to-five-days; the grove from
// mariposa-grove-how-to-visit; Tuolumne from yosemite-in-three-to-five-days;
// the 2026 reservation status and fees from
// yosemite-without-reservations-2026; the drive times to the gateway towns
// from yosemite-gateway-towns-compared (the canonical source, mirrored on
// /distances and /stay). Do not add a number from memory; change the article
// first, then this page. The edge FAQ for this route (edge/seo.js) quotes the
// same answers; change both together.
//
// The homepage Start Here block stays (it is the on-site funnel) and links
// here for the full set; window.START_HERE in data.js curates both.
//
// Page bundles share one global scope, so every top-level name in this file
// carries a START_ / Start prefix.
// =============================================================================

const { useEffect: useEffectStart, useState: useStateStart } = React;

const START_LOCATION = "start-here";

const START_FACTS = [
  { label: "Reservation", value: "None needed in 2026" },
  { label: "Entrance", value: "$35 per car, 7 days" },
  { label: "Days", value: "Two is the honest minimum" },
  { label: "Best window", value: "Late May to June, then September and October" },
  { label: "Arrive", value: "Through the gate before 8 a.m." },
];

const START_NPS_MAP = {
  image: "img/nps-yosemite-park-map.jpg",
  alt: "The official National Park Service map of Yosemite National Park, with Yosemite Valley, Glacier Point, the Mariposa Grove and Tuolumne Meadows marked 1 to 4",
  credit: "Map: National Park Service (public domain), restoration by National Park Maps. Numbered pins added.",
  source: "https://www.nps.gov/yose/planyourvisit/maps.htm",
};

const START_PLACES = [
  {
    id: "place-valley",
    n: "1",
    name: "Yosemite Valley",
    pin: [28.4, 63.2],
    drive: "Start here",
    season: "Open all year",
    image: "img/yosemite-falls-spring-blossoms-cory-goehring.jpg",
    alt: "Upper Yosemite Fall framed by spring blossoms from the Valley floor",
    credit: "Cory Goehring",
    line: "The canyon floor. You stand at the bottom and look up.",
    dos: [
      "Tunnel View at first light, then Bridalveil Fall",
      "The Lower Yosemite Fall loop and Cook's Meadow before the lots fill at mid-morning",
      "A slow hour on a rock by the Merced",
      "Back to Valley View or Tunnel View for last light",
    ],
    facts: [
      ["Getting in", "Arch Rock on Hwy 140, the all-weather route"],
      ["Best hour", "Through the gate before 8 a.m., or after 4 p.m."],
      ["Waterfalls", "Peak in May, mostly dry by August"],
      ["Closest accommodations", "El Portal, 25 to 35 minutes. Mariposa, 45 to 60."],
    ],
    link: { href: "/articles/yosemite-in-one-or-two-days", label: "One day in Yosemite: the Valley sequence" },
  },
  {
    id: "place-glacier-point",
    n: "2",
    name: "Glacier Point",
    pin: [37.1, 65.0],
    drive: "About an hour from the Valley",
    season: "Glacier Point Road closes for winter",
    image: "img/half-dome-sunset-glacier-point-joshua-earle.jpg",
    alt: "Half Dome at sunset from Glacier Point",
    credit: "Joshua Earle / Unsplash",
    line: "The same canyon from the top edge, at eye level with Half Dome.",
    dos: [
      "Washburn Point first, for Vernal and Nevada Falls stacked in their staircase",
      "Glacier Point itself: a 0.3-mile paved walk to the 7,200-foot overlook",
      "Sentinel Dome and Taft Point from one trailhead, about 2.2 miles round trip each",
      "Late afternoon puts the light on Half Dome rather than behind it",
    ],
    facts: [
      ["From the Valley", "About 30 miles, an hour each way"],
      ["Season", "Most openings fall in May; closes after the first big snow"],
      ["Parking", "The lot fills by mid-morning in summer"],
      ["In winter", "Skis or snowshoes from Badger Pass only"],
    ],
    link: { href: "/articles/glacier-point-how-to-visit", label: "Glacier Point: how to visit" },
  },
  {
    id: "place-mariposa-grove",
    n: "3",
    name: "Mariposa Grove",
    pin: [31.1, 94.5],
    drive: "About an hour from the Valley",
    season: "Open all year; the grove road closes to cars in winter",
    image: "img/mariposa-grove-grizzly-giant-nieves.jpg",
    alt: "The Grizzly Giant in the Mariposa Grove",
    credit: "Nieves / Pexels",
    line: "Giant sequoias that have been growing since before the Roman Empire.",
    dos: [
      "Park at the Welcome Plaza by the South Entrance; the free shuttle covers the last two miles",
      "The Grizzly Giant Loop, about two miles among the oldest trees",
      "Take the first shuttle of the morning or the last hour before it stops, never noon",
      "In winter, walk the closed grove road two quiet miles up",
    ],
    facts: [
      ["From the Valley", "About an hour each way"],
      ["Shuttle", "Free, no ticket, about every 15 minutes"],
      ["Pair it with", "The Wawona Meadow Loop, a flat 3.5 miles"],
      ["Closest accommodations", "Oakhurst: right for the grove, wrong for the Valley"],
    ],
    link: { href: "/articles/mariposa-grove-how-to-visit", label: "Mariposa Grove: how to visit" },
  },
  {
    id: "place-tuolumne",
    n: "4",
    name: "Tuolumne Meadows",
    pin: [61.2, 44.1],
    drive: "About 1.5 hours, closer to 2 in July",
    season: "Tioga Road closes for winter",
    image: "img/tuolumne-meadows-lembert-dome.jpg",
    alt: "Tuolumne Meadows with Lembert Dome behind",
    credit: "Pacific Southwest Region USFWS / Wikimedia Commons (public domain)",
    line: "The high country: open granite and meadow at 8,600 feet, and half the crowd.",
    dos: [
      "Olmsted Point for the back of Half Dome, then the shore of Tenaya Lake",
      "Pothole Dome, a mile round trip at the meadow's west end",
      "Soda Springs and Parsons Memorial Lodge, a flat mile and a half",
      "Lembert Dome, 2.8 miles and 850 feet, for the earned view",
    ],
    facts: [
      ["From the Valley", "55 to 60 miles, 1.5 hours each way, closer to 2 in July"],
      ["Season", "Tioga Road opens late May or June, closes with the first serious snow"],
      ["Weather", "Off the open granite before the afternoon thunderheads"],
      ["Give it", "Its own day. It deserves more than a drive-through."],
    ],
    link: { href: "/articles/tuolumne-meadows-in-a-day", label: "Tuolumne Meadows in a day" },
  },
];

// Which plans this page shows, and the guide each one points to. The plans
// themselves are window.ITINERARIES (rule 2 above).
const START_PLAN_IDS = [
  { id: "1day", guide: { href: "/articles/yosemite-in-one-or-two-days", label: "The one-and-two-day guide" } },
  { id: "2day", guide: { href: "/articles/yosemite-in-one-or-two-days", label: "The one-and-two-day guide" } },
  { id: "3day", guide: { href: "/articles/yosemite-in-three-to-five-days", label: "The three-to-five-day guide" } },
];

const START_ANSWERS = [
  {
    q: "Do I need a reservation?",
    lines: ["No. There is no entry reservation in 2026, on any date.", "$35 per car for seven days. Visitors who are not U.S. residents add $100 each, age 16 and up."],
    link: { href: "/articles/yosemite-without-reservations-2026", label: "The 2026 reservation guide" },
  },
  {
    q: "When should I go?",
    lines: ["Late May through June, for the waterfalls and every road open.", "September and October: thinner crowds, low gold light, dry falls."],
    link: { href: "/articles/when-to-visit-yosemite-2026-crowd-forecast", label: "The crowd forecast" },
  },
  {
    q: "How many days?",
    lines: ["Two full days is the honest minimum.", "Three sees the park's range, from the canyon floor to alpine meadow."],
    link: { href: "/articles/yosemite-in-three-to-five-days", label: "The three-to-five-day guide" },
  },
  {
    q: "Where should I stay?",
    lines: ["In the park if you can: beds open 366 days ahead.", "Otherwise Mariposa, the safest first-timer's town, 45 to 60 minutes out."],
    link: { href: "/articles/yosemite-gateway-towns-compared", label: "The gateway towns compared" },
  },
  {
    q: "Which entrance?",
    lines: ["Five gates, nothing alike. Pick by month and by your first stop.", "Arch Rock on Hwy 140 is the all-weather way into the Valley."],
    link: { href: "/articles/getting-to-yosemite", label: "Getting to Yosemite" },
  },
  {
    q: "What about permits?",
    lines: ["Every day hike is permit-free, with one exception: Half Dome.", "Glacier Point, the grove and the waterfalls are not ticketed."],
    link: { href: "/articles/yosemite-walk-up-and-day-of-permits", label: "Walk-up and day-of permits" },
  },
];

const START_MISTAKES = [
  { title: "Arriving at ten", text: "Valley lots fill by late morning, and by 8 a.m. on summer weekends." },
  { title: "Trusting the phone", text: "Service is mostly gone past the gates. Download offline maps in town." },
  { title: "A quarter tank", text: "No gas in the Valley. The pumps are at Crane Flat and Wawona." },
  { title: "Food in the car", text: "Bears open cars. Daylight only, out of sight, never overnight." },
  { title: "Doing too much", text: "Three things well beats seven from the driver's seat." },
];

const START_THEN = [
  { href: "/articles/yosemite-in-three-to-five-days", label: "Three to five days" },
  { href: "/articles/when-to-visit-yosemite-2026-crowd-forecast", label: "The crowd forecast" },
  { href: "/articles/yosemite-valley-parking-guide", label: "The Valley parking guide" },
  { href: "/articles/camping-in-yosemite-first-time", label: "First-time camping" },
];

// A stop's display name before points.geojson arrives: its id, spaced.
const startStopName = (id, byId) =>
  (byId && byId[id] && byId[id].name) || id.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

function StartPlacesMap({ go }) {
  return (
    <div className="start-map">
      <figure className="start-map__figure">
        <div className="start-map__frame">
          <ResponsiveImage image={START_NPS_MAP.image} alt={START_NPS_MAP.alt}
            sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 55vw, 700px" />
          {START_PLACES.map((p) => (
            <a key={p.id} className="start-map__pin" href={`#${p.id}`}
              style={{ left: `${p.pin[0]}%`, top: `${p.pin[1]}%` }}
              aria-label={`${p.n}. ${p.name}`}
              onClick={(e) => {
                const el = document.getElementById(p.id);
                if (!el) return;
                e.preventDefault();
                el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
              }}>{p.n}</a>
          ))}
        </div>
        <figcaption>{START_NPS_MAP.credit}</figcaption>
      </figure>
      <div className="start-map__key">
        <p className="hp-eyebrow">THE OFFICIAL PARK MAP</p>
        <ol>
          {START_PLACES.map((p) => (
            <li key={p.id}>
              <span className="start-num" aria-hidden="true">{p.n}</span>
              <span>
                <strong>{p.name}</strong>
                <b>{p.drive}</b>
                <small>{p.season}</small>
              </span>
            </li>
          ))}
        </ol>
        <p className="start-map__note">
          The red notes on the map mark where Tioga Road and Glacier Point Road
          close for winter. What is open this week is on{" "}
          <HomeLink go={go} location={START_LOCATION} href="/now">the Park Bulletin</HomeLink>.
        </p>
        <div className="start-map__links">
          <a className="hp-link" href={START_NPS_MAP.source} target="_blank" rel="noopener noreferrer">The full-size map at nps.gov ↗</a>
          <HomeLink go={go} location={START_LOCATION} className="hp-link" href="/map">Build your own route on the trip map ↗</HomeLink>
        </div>
      </div>
    </div>
  );
}

function StartPlace({ place, flip, go }) {
  return (
    <section className={`start-place${flip ? " start-place--flip" : ""}`} id={place.id} aria-labelledby={`${place.id}-h`} tabIndex={-1}>
      <figure className="start-place__photo">
        <ResponsiveImage image={place.image} alt={place.alt}
          sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 50vw, 620px" />
        <figcaption>Photo: {place.credit}</figcaption>
      </figure>
      <div className="start-place__body">
        <p className="start-place__meta">
          <span className="start-num" aria-hidden="true">{place.n}</span>
          <span className="start-chip">{place.season}</span>
        </p>
        <h3 id={`${place.id}-h`}>{place.name}</h3>
        <p className="start-place__line">{place.line}</p>
        <p className="hp-eyebrow start-place__label">WHAT TO DO, IN ORDER</p>
        <ul className="start-bullets">
          {place.dos.map((d) => <li key={d}>{d}</li>)}
        </ul>
        <dl className="start-place__facts">
          {place.facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <HomeLink go={go} location={START_LOCATION} className="hp-link" href={place.link.href}>{place.link.label} ↗</HomeLink>
      </div>
    </section>
  );
}

function StartPlan({ plan, guide, earlier, byId, go }) {
  const ids = window.getItineraryStopIds ? window.getItineraryStopIds(plan.id) : [];
  return (
    <article className="start-plan">
      <p className="start-plan__len">{plan.label}</p>
      <h3>{plan.title}</h3>
      <p className="start-plan__dek">{plan.dek}</p>
      <div className="start-plan__days">
        {plan.days.map((day) => {
          const key = day.stopIds.join(",");
          const label = day.name.replace(/,\s.*$/, "");
          if (earlier.has(key)) {
            return (
              <p key={day.name} className="start-plan__repeat">
                <span>{label}</span>
                <em>as in the plan before</em>
              </p>
            );
          }
          return (
            <div key={day.name} className="start-plan__day">
              <p className="start-plan__dayname">{day.name}</p>
              <ol>
                {day.stopIds.map((id) => <li key={id}>{startStopName(id, byId)}</li>)}
              </ol>
            </div>
          );
        })}
      </div>
      <p className="start-plan__season"><strong>Season.</strong> {plan.season}</p>
      <a className="hp-button start-plan__map" href={`/map?trip=${ids.join(",")}`}
        onClick={() => { if (window.track) window.track("cta_click", { location: START_LOCATION, target: "/map", plan: plan.id }); }}>
        Open this plan on the trip map <span>↗</span>
      </a>
      <HomeLink go={go} location={START_LOCATION} className="hp-link" href={guide.href}>{guide.label} ↗</HomeLink>
    </article>
  );
}

function StartHerePage({ go }) {
  // Stop names come from the same geojson the map uses (rule 2). The plans
  // render without it, so a failed fetch leaves spaced ids, not an error.
  const [stopsById, setStopsById] = useStateStart(null);
  useEffectStart(() => {
    let cancelled = false;
    if (!window.POINTS_URL) return undefined;
    fetch(window.POINTS_URL)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const byId = {};
        (data.features || []).forEach((f) => { byId[f.properties.id] = f.properties; });
        setStopsById(byId);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const itineraries = window.ITINERARIES || [];
  const plans = START_PLAN_IDS
    .map((p) => ({ ...p, plan: itineraries.find((it) => it.id === p.id) }))
    .filter((p) => p.plan);
  const halfDay = itineraries.find((it) => it.id === "halfday");

  const articles = (window.START_HERE || [])
    .map((slug) => (window.ARTICLES || []).find((a) => a.slug === slug))
    .filter(Boolean);

  // The head's photograph is the Valley's first stop, not the Valley block's.
  const hero = {
    image: "img/tunnel-view-valley-spring.jpg",
    alt: "Yosemite Valley from Tunnel View in spring",
    credit: "Kyle D / Wikimedia Commons (public domain)",
  };

  return (
    <div className="page hp-start">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Start here" }]}
        eyebrow="FOR FIRST-TIME VISITORS"
        title="Planning your first trip to Yosemite? Start here."
        intro="The four places worth the drive, a plan for one, two or three days, and the answers every first-timer needs, from a naturalist who has worked in this park for close to two decades. Five minutes here, then go deep only where your trip needs it."
        actions={<React.Fragment>
          <HomeLink go={go} location={START_LOCATION} className="hp-button" href="#places">See the four places <span>↓</span></HomeLink>
          <HomeLink go={go} location={START_LOCATION} className="hp-link" href="#itineraries">Pick an itinerary ↓</HomeLink>
        </React.Fragment>}
        aside={
          <figure className="start-hero">
            <ResponsiveImage image={hero.image} alt={hero.alt} eager
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 50vw, 660px" />
            <figcaption><span>Tunnel View, the first stop of a first morning</span><span>{hero.credit}</span></figcaption>
          </figure>
        }
      />

      <div className="hp-wrap">
        <dl className="start-facts" aria-label="The short answers">
          {START_FACTS.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        <nav className="start-jump" aria-label="On this page">
          <span>On this page</span>
          <HomeLink go={go} location={START_LOCATION} href="#places">01 The four places</HomeLink>
          <HomeLink go={go} location={START_LOCATION} href="#itineraries">02 One, two or three days</HomeLink>
          <HomeLink go={go} location={START_LOCATION} href="#reading">03 Read these first</HomeLink>
          <HomeLink go={go} location={START_LOCATION} href="#answers">04 Quick answers</HomeLink>
        </nav>
      </div>

      <section className="hp-wrap start-section" id="places" tabIndex={-1} aria-labelledby="places-h">
        <HpHeading id="places-h" eyebrow="01 / THE FOUR PLACES" title="Four places that earned their fame" />
        <p className="start-lede">
          Yosemite is four parks wearing one name. The Valley is a canyon you
          look up from; the rim looks down into it; the high country is open
          granite at 8,600 feet; the sequoias stand in the far south. They are
          an hour or more apart, in directions that point away from each other,
          so give each one its own day.
        </p>
        <StartPlacesMap go={go} />
        <div className="start-places">
          {START_PLACES.map((p, i) => <StartPlace key={p.id} place={p} flip={i % 2 === 1} go={go} />)}
        </div>
      </section>

      {plans.length > 0 && (
        <section className="start-band" id="itineraries" tabIndex={-1} aria-labelledby="itineraries-h">
          <div className="hp-wrap">
            <HpHeading id="itineraries-h" eyebrow="02 / ITINERARIES" title="One, two or three days" />
            <p className="start-lede">
              Each plan is the site's own, in drive order, west to east along
              each road, so it loads onto the trip map as a route you can
              actually run. Every longer plan starts with the shorter one.
            </p>
            <div className="start-plans">
              {plans.map((p, i) => {
                const earlier = new Set();
                plans.slice(0, i).forEach((prev) => prev.plan.days.forEach((d) => earlier.add(d.stopIds.join(","))));
                return <StartPlan key={p.id} plan={p.plan} guide={p.guide} earlier={earlier} byId={stopsById} go={go} />;
              })}
            </div>
            <div className="start-halfday">
              {halfDay && <p><strong>Arriving late?</strong> {halfDay.dek}</p>}
              <HomeLink go={go} location={START_LOCATION} className="hp-link" href="/itineraries">Every plan, the half day included ↗</HomeLink>
            </div>
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="hp-wrap start-section" id="reading" tabIndex={-1} aria-labelledby="reading-h">
          <HpHeading id="reading-h" eyebrow="03 / START HERE READING" title="Read these four first" />
          <p className="start-lede">The long answers behind this page, in the order most first-timers need them.</p>
          <div className="hp-journal-grid start-reads">
            {articles.map((a) => <HpArticleCard key={a.slug} article={a} go={go} location={START_LOCATION} />)}
          </div>
          <nav className="start-then" aria-label="Further reading">
            <span>Then</span>
            {START_THEN.map((l) => <HomeLink key={l.href} go={go} location={START_LOCATION} className="hp-link" href={l.href}>{l.label} ↗</HomeLink>)}
          </nav>
        </section>
      )}

      <section className="hp-wrap start-section" id="answers" tabIndex={-1} aria-labelledby="answers-h">
        <HpHeading id="answers-h" eyebrow="04 / QUICK ANSWERS" title="The six questions everyone asks" />
        <div className="start-answers">
          {START_ANSWERS.map((a) => (
            <div key={a.q} className="start-answer">
              <h3>{a.q}</h3>
              <ul className="start-bullets">
                {a.lines.map((l) => <li key={l}>{l}</li>)}
              </ul>
              <HomeLink go={go} location={START_LOCATION} className="hp-link" href={a.link.href}>{a.link.label} ↗</HomeLink>
            </div>
          ))}
        </div>
        <div className="start-mistakes">
          <h3>Five mistakes that spoil first trips</h3>
          <ol>
            {START_MISTAKES.map((m, i) => (
              <li key={m.title}>
                <span aria-hidden="true">{i + 1}</span>
                <strong>{m.title}</strong>
                <p>{m.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <LodgingCta
          destination="Yosemite National Park"
          heading="The first decision with a deadline"
          note="Where you sleep decides what your mornings look like. In-park beds open 366 days ahead and the closest gateway rooms go next; the later you book, the longer your drive."
          list="page_start_here"
          slug="start-here"
          cta="See what is available on your dates →"
        />
      </section>

      <HpGuideBand
        go={go}
        location={START_LOCATION}
        title="The first trip is the one that needs a guide"
        intro="The Field Guide app carries 57 hikes with parking and timing notes, offline maps for a park with no cell service, and the local tactics for every major region. One purchase, eighteen months of access."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="The Sunday Letter"
        heading="The Sunday Letter"
        blurb="What is open, what is booking out, and what the week looked like from inside the park. One letter a week while you plan. Free."
        location={START_LOCATION}
        tag="start-here"
      />
    </div>
  );
}

window.StartHerePage = StartHerePage;
