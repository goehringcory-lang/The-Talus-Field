/* global React, NatureNotesFilm, EventIcon, ResponsiveImage, AffiliateNote, AvailabilityLink, LodgingCta */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// The October 2026 feature redesign, on the El Capitan article's recipe.
// This body renders on the /firefall system rather than in the 680px reading
// column: its catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's width. Every section sits on `hp-wrap`, alternating paper and the
// `ff-band` tint. The page's own pieces are the `.nh-*` layer in styles.css.
//
// Four rules hold it up.
//   1. Every fact the article carried before the redesign is still here
//      unless a primary source contradicted it, regrouped, and the copy
//      follows docs/voice-guide.md: the answer first, plain words. Every
//      card, bar and chip restates a sentence in this body. Corrections made
//      on October 1, 2026, against the sources listed at the foot: the free
//      Valley shuttle runs year-round (the old text said seasonal); Bridalveil
//      Fall's western trail IS wheelchair accessible (the old text said the
//      Park Service did not call it so); the Bridalveil trail reopened in
//      June 2023, not fall 2023; the Lower Yosemite Fall loop is 1 mile, not
//      1.1; the Mariposa Grove has no tram (the FAQ said it did); the grove
//      road closes to cars from the end of November, not December; the old
//      "26-mile" Valley Floor Tour figure is gone, because no primary page
//      states it; Tioga Pass is 9,945 feet, not "Valley elevation to 10,000";
//      the Tuolumne "tour" is a one-way hikers bus; and ranger programs are
//      not all free, since some partner programs sell tickets.
//   2. The section ids are the anchors the old layout generated at runtime
//      (`sec-<h2 index>-<slug40>`), pinned by hand so the deep links search
//      already carries keep landing on the same content.
//   3. The one map is the National Park Service's own: the whole Valley map
//      (img/nps-yosemite-valley-map.jpg, 2560 x 1000, public domain), with
//      HTML pins in percent of the image so they keep their size on a phone.
//      The pins were placed by eye against the map's own labels and icons,
//      not from coordinates; the map carries its own one-way arrows, so
//      nothing is drawn on it but the numbers. It scrolls sideways on a
//      phone, because 2,560 pixels of map shrunk to 350 is not readable.
//   4. Nothing on the page reads today's hours. The fall 2026 Yosemite Guide
//      dates are stated as that edition's, and the Park Bulletin carries the
//      rest.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["yosemite-for-non-hikers"] = function YosemiteForNonHikersBody() {
  const TOC = [
    ["#sec-0-why-yosemite-is-built-for-this", "Why it works"],
    ["#sec-1-a-word-about-the-word-accessible", "Paved or accessible"],
    ["#nh-walks", "How far each walk is"],
    ["#sec-2-before-you-go-the-logistics-that-actuall", "Before you go"],
    ["#sec-3-the-valley-by-car-what-you-actually-stop", "The Valley loop"],
    ["#sec-4-two-low-effort-day-plans", "Two day plans"],
    ["#sec-5-glacier-point-and-tioga-road", "Glacier Point and Tioga Road"],
    ["#sec-6-mariposa-grove-which-is-the-best-accessi", "Mariposa Grove"],
    ["#sec-7-let-someone-else-drive", "Tours"],
    ["#sec-8-cultural-and-indoor-sites", "Indoors"],
    ["#sec-9-ranger-programs-which-are-free-and-mostl", "Ranger programs"],
    ["#nh-by-need", "Pick by need"],
    ["#sec-10-what-changes-by-season", "Seasons"],
    ["#nh-weather", "Bad weather and smoke"],
    ["#sec-11-wildlife-and-photography-from-accessible", "Wildlife and photos"],
    ["#sec-12-multi-generational-trips", "Families"],
    ["#sec-13-the-takeaway", "The takeaway"],
    ["#nh-questions", "Questions"],
  ];

  const FAQ = [
    ["Is Yosemite worth visiting if you don't hike?",
      "Yes. Tunnel View, Valley View, El Capitan Meadow and Olmsted Point are roadside stops, and Glacier Point is a short paved path from a parking lot. Bridalveil Fall and Lower Yosemite Fall are short paved walks, the Mariposa Grove has a 0.3-mile level loop, and the free Valley shuttle and the Valley Floor Tour need no walking at all."],
    ["What can you see in Yosemite without hiking?",
      "El Capitan, Half Dome, Yosemite Falls and Cathedral Rocks from the Valley loop roads; Tunnel View and Valley View from the pavement; Bridalveil Fall on a 0.5-mile round-trip paved trail with about 80 feet of climb, whose western trail is wheelchair accessible; Lower Yosemite Fall on a 1-mile paved loop whose east side is wheelchair accessible (the fall is often dry from late July or August through October); Glacier Point by a short paved path from the parking lot; Olmsted Point from its parking area; and the Mariposa Grove on the 0.3-mile Big Trees Loop."],
    ["Are there guided tours in Yosemite for non-hikers?",
      "Yes. The Valley Floor Tour is a two-hour tour, led by a naturalist or ranger, on an open-air tram in the warm months and a heated bus in the cold ones, and it runs year-round, conditions permitting. The Glacier Point Tour is four hours and runs while Glacier Point Road is open. The Grand Tour is about eight hours, with lunch, and combines the Valley, Glacier Point and the Mariposa Grove. All leave from Yosemite Valley Lodge and book through the concessioner at travelyosemite.com or the Lodge front desk. The Mariposa Grove has no tram; a free shuttle runs from the Welcome Plaza while the road is open."],
    ["Is Glacier Point accessible without hiking?",
      "Yes. Glacier Point Road is open to cars from about late May through October or November, and the drive from the Valley takes about an hour. A short paved path leads from the parking lot to the overlook, and the Park Service lists it as wheelchair accessible; its older accessibility guide notes that some sections are steeper than an accessible grade. The Glacier Point Tour bus also goes there while the road is open."],
    ["Can you visit Yosemite by bus or train?",
      "Yes. Amtrak runs to Merced, where the YARTS Highway 140 bus leaves for Yosemite Valley year-round, about two and a half hours end to end. YARTS's Highway 41, Highway 120 and Highway 395 routes run in summer only. Budget for the park entrance fee, because the Park Service and YARTS disagree about whether the fare covers it."],
    ["Does the Yosemite Valley shuttle run in winter, and can it carry a wheelchair?",
      "The free Valley shuttle runs daily, year-round, from 7 a.m. to 10 p.m. Every bus has a wheelchair lift and tie-downs. The Park Service gives the maximum wheelchair size as 24 inches wide by 46 inches long."],
    ["Do I need a reservation to enter Yosemite?",
      "Not in 2026. The Park Service says a reservation is not required to enter. You pay the entrance fee, $35 a vehicle for seven days, at the gate. Valley parking is the limit: the Park Service says lots are usually full after 9 a.m."],
  ];

  // ── The Valley on the NPS's own map ────────────────────────────────────────
  // Positions in the map's pixels (2560 x 1000), placed by eye against the
  // map's labels. Numbers 1 to 9 are the loop in driving order: Southside
  // Drive east, then Northside Drive west. A and B are side trips off it.
  const MAP_W = 2560, MAP_H = 1000;
  const PINS = [
    { n: "1", at: [125, 850], name: "Tunnel View" },
    { n: "2", at: [547, 878], name: "Bridalveil Fall" },
    { n: "3", at: [960, 748], name: "Cathedral Beach" },
    { n: "4", at: [1582, 320], name: "Sentinel Bridge" },
    { n: "5", at: [1672, 268], name: "Cook's Meadow" },
    { n: "6", at: [1740, 205], name: "Yosemite Village" },
    { n: "7", at: [1528, 270], name: "Lower Yosemite Fall" },
    { n: "8", at: [1062, 642], name: "El Capitan Meadow" },
    { n: "9", at: [352, 818], name: "Valley View" },
    { n: "A", at: [1872, 280], name: "The Ahwahnee", side: true },
    { n: "B", at: [2090, 578], name: "Happy Isles", side: true },
  ];
  const pct = (x, y, w, h) => ({ left: (x / w) * 100 + "%", top: (y / h) * 100 + "%" });

  function ValleyMap() {
    return (
      <figure className="nh-map">
        <div className="nh-map__scroll" role="region" tabIndex={0} aria-label="Map of Yosemite Valley. On a phone it scrolls sideways.">
          <div className="nh-map__frame">
            <ResponsiveImage image="img/nps-yosemite-valley-map.jpg" className="nh-map__img" sizes="(max-width: 1100px) 980px, 1240px" style={{ aspectRatio: "2560 / 1000" }}
              alt="National Park Service map of Yosemite Valley from Tunnel View on the west to Happy Isles on the east, with one-way Southside Drive running east and one-way Northside Drive running west. Nine stops are numbered in driving order: Tunnel View, Bridalveil Fall, Cathedral Beach, Sentinel Bridge, Cook's Meadow, Yosemite Village, Lower Yosemite Fall, El Capitan Meadow and Valley View. The Ahwahnee and Happy Isles are marked as side trips." />
            <div className="nh-map__layer" aria-hidden="true">
              {PINS.map((p) => (
                <span key={p.n} className={"nh-pin" + (p.side ? " is-side" : "")} style={pct(p.at[0], p.at[1], MAP_W, MAP_H)}><b>{p.n}</b></span>
              ))}
            </div>
          </div>
        </div>
        <figcaption>
          <ol className="nh-map__key">
            {PINS.filter((p) => !p.side).map((p) => <li key={p.n}><b>{p.n}</b> {p.name}</li>)}
            {PINS.filter((p) => p.side).map((p) => <li key={p.n} className="is-side"><b>{p.n}</b> {p.name}, a side trip</li>)}
          </ol>
          <span className="nh-map__note">Southside Drive runs east, deeper into the Valley. Northside Drive runs west, back out. Swipe the map sideways on a phone. Pins are approximate. Map: National Park Service (public domain).</span>
        </figcaption>
      </figure>
    );
  }

  // ── How far each walk is ───────────────────────────────────────────────────
  // [name, what is printed, miles for the bar (the printed number, not the
  // whole walk), tone, note]. Tone: wc is the Park Service's own wheelchair
  // accessible label, grade is paved with a steeper stretch, plain is a
  // surface the Park Service does not rate, rough is dirt or not accessible.
  const WALKS = [
    ["Tunnel View", "Short paved walk", null, "wc", "Accessible parking, wheelchair access to the viewpoint, and a bronze tactile model of the Valley nearby."],
    ["Valley View", "A short riverside path", null, "plain", "A pullout on Northside Drive, then level ground to the riverbank."],
    ["El Capitan Meadow", "Car to meadow edge", null, "plain", "Roadside pullouts on Northside Drive and flat ground to the edge."],
    ["Sentinel Bridge", "Lot to the bridge", null, "plain", "A short paved walk onto the bridge, with railings."],
    ["Cook's Meadow loop", "1 mile loop", 1, "plain", "The Guide's description: flat pavement and boardwalk. Walk as much of it as you like."],
    ["Bridalveil Fall", "0.5 mile round trip", 0.5, "wc", "About 80 feet of climb. The western trail is wheelchair accessible; a steeper path climbs closer."],
    ["Lower Yosemite Fall, east leg", "0.6 mile one way", 0.6, "wc", "Paved and wheelchair accessible, and the leg that reaches the base of the fall."],
    ["Lower Yosemite Fall, west leg", "0.5 mile one way", 0.5, "grade", "Mostly accessible, with a short steep grade near the viewing area: the last 180 feet are at 13.8 percent."],
    ["Glacier Point overlook", "About 300 yards each way", 0.17, "wc", "Paved. The Park Service lists it as wheelchair accessible; its older guide notes some sections steeper than an accessible grade."],
    ["Big Trees Loop", "0.3 mile loop", 0.3, "wc", "Level boardwalk and firm surface in the Mariposa Grove, with benches."],
    ["Grizzly Giant, from the placard lot", "0.1 mile one way", 0.1, "wc", "Placard vehicles only. A section of the trail is wheelchair accessible; the surface is compressed dirt."],
    ["Olmsted Point, out to the point", "0.25 mile one way", 0.25, "rough", "Short and hilly. The paved walkways by the parking area are accessible; the trail to the point is not."],
  ];
  const TONES = {
    wc: "Wheelchair accessible, per the Park Service",
    grade: "Paved, with a steeper stretch",
    plain: "Flat, but not rated by the Park Service",
    rough: "Hilly or uneven",
  };

  // ── The nine loop stops, in driving order ──────────────────────────────────
  function Stop({ n, name, effort, tone, children, link }) {
    return (
      <article className="nh-stop">
        <p className="nh-stop__head"><span className="nh-stop__num">{n}</span>{name}</p>
        <p className="nh-stop__text">{children}</p>
        <p className="nh-stop__chips">
          <span className={"nh-chip is-" + (tone || "plain")}>{effort}</span>
          {link}
        </p>
      </article>
    );
  }

  // ── The by-need list ──────────────────────────────────────────────────────
  const NEEDS = [
    ["eye", "I want a view and nothing else", ["Tunnel View", "Valley View", "El Capitan Meadow", "Olmsted Point, from the parking area", "Glacier Point, by a short paved path"]],
    ["drop", "I want a waterfall", ["Bridalveil Fall, 0.5 mile round trip", "Lower Yosemite Fall, a 1-mile loop or its east leg", "Yosemite Falls from the Valley roads and Cook's Meadow", "Spring is the season; both falls thin or dry out later"]],
    ["clock", "I want to sit down", ["The free Valley shuttle, ridden as a loop", "The Valley Floor Tour", "The park film in the Exploration Center theater", "The Ahwahnee, the bar and the patio"]],
    ["id", "I want to learn something", ["Yosemite Exploration Center", "Yosemite Museum and the reconstructed Indian Village of Ahwahnee", "The Ansel Adams Gallery", "Happy Isles Art and Nature Center, for children"]],
    ["tree", "I want trees", ["Big Trees Loop in the Mariposa Grove, 0.3 mile and level", "The Grizzly Giant, if you have a placard", "Black oaks and meadows on the Valley floor, in October"]],
    ["route", "I want to move, but not walk", ["The Valley bike paths: more than 11 miles of paved path, with rentals through late October", "Cycling the loop roads", "The Glacier Point Tour bus, with no driving"]],
  ];

  // ── Seasons ────────────────────────────────────────────────────────────────
  const SEASONS = [
    ["snow", "Winter", "December to March",
      "Glacier Point, Tioga and Mariposa Grove roads are closed to cars. The Valley roads stay open and the Valley shuttle keeps running. Tire chains may be required. The Valley Floor Tour runs on a heated bus. This is the season for the indoor list."],
    ["drop", "Spring", "April to early June",
      "The best season for this trip. The falls run at their peak, the meadows green up, and Bridalveil and Lower Yosemite Fall are worth the walk. The high-country roads are closed or just opening."],
    ["sun", "Summer", "Late June to August",
      "Everything is open, including Glacier Point Road, Tioga Road and the grove shuttle. Valley lots fill by 9 a.m., the shuttle is crowded and the Valley floor is hot. The high country is cooler. Lower Yosemite Fall is often dry from late July or August."],
    ["tree", "Fall", "September to November",
      "The quietest good season. The falls are low or dry, the meadows go gold and crowds thin after Labor Day. Glacier Point Road and Tioga Road stay open into October or November, then close in the first serious storm."],
  ];

  return (
    <div className="nh-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="car" /><dt>Most of the views</dt><dd>From a car or a short paved path</dd></div>
          <div><EventIcon name="walk" /><dt>Longest walk in the Valley loop</dt><dd>One mile, on pavement</dd></div>
          <div><EventIcon name="ticket" /><dt>Entry in 2026</dt><dd>No reservation. $35 a car</dd></div>
          <div><EventIcon name="clock" /><dt>Parking</dt><dd>Valley lots are full after 9 a.m.</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the answer, and the whole page in five lines beside it. */}
      <section className="hp-wrap hp-section nh-open">
        <div className="ff-split">
          <div className="nh-prose">
            <p className="dropcap">
              You do not have to hike to see Yosemite. The Valley loop road, a few bridges and meadow boardwalks, and a handful of short paved paths reach most of what hikers see: Tunnel View, El Capitan, Half Dome, two waterfalls, Glacier Point and the giant sequoias.
            </p>
            <p>
              A lot of people who would love Yosemite never go because they think you have to hike to "really" see it. Hiking is part of the park for many visitors, but it is not the only way in. Yosemite is built for non-hikers more thoroughly than almost any national park, and a non-hiker can have a complete visit without putting on boots. I have watched grandparents in their eighties call it the best trip of their lives without walking more than half a mile in a day. I have watched parents with toddlers show them things they will remember twenty years later.
            </p>
            <p>This guide is for the people who skip the trails:</p>
            <ul className="nh-who">
              <li>Seniors and people with mobility limits.</li>
              <li>Visitors with strollers and very young children.</li>
              <li>People recovering from injury or surgery.</li>
              <li>People who just don't like hiking. This is allowed. It is a reasonable life choice.</li>
              <li>People with very limited time who want the highlights.</li>
              <li>People with respiratory or cardiac conditions who can't do exertion.</li>
              <li>Wheelchair users. The Park Service publishes a detailed accessibility guide, linked under Sources. This article complements it, it does not replace it.</li>
            </ul>
            <p>
              What follows is what I would tell a friend in any of those groups who asked whether to go at all. The answer is yes. Here is what to do when you get there.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>Drive the Valley loop. Stop at Tunnel View, Sentinel Bridge, Cook's Meadow, El Capitan Meadow and Valley View.</li>
              <li>Add Glacier Point: about an hour from the Valley, then a short paved path.</li>
              <li>Sit among sequoias: a free shuttle and a 0.3-mile level loop.</li>
              <li>Park before 9 a.m. Hang your placard if you have one.</li>
              <li>Pace it: one drive, one sit-down meal, one big view.</li>
            </ul>
            <a className="nh-short__link" href="#sec-3-the-valley-by-car-what-you-actually-stop">The Valley loop, stop by stop</a>
          </aside>
        </div>
      </section>

      {/* The Valley is built for this: the effort ladder. */}
      <section className="ff-band" id="sec-0-why-yosemite-is-built-for-this" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">WHY YOSEMITE IS BUILT FOR THIS</p>
              <h2>The roads were designed to deliver the park</h2>
              <div className="nh-prose">
                <p>
                  Yosemite Valley sits at about 4,000 feet in a granite trough seven miles long and one mile across at its widest. The roads that loop around it pass within view of, or directly under, almost every well-known feature in the park. <strong>Tunnel View, El Capitan, Bridalveil Fall, Cathedral Rocks, Cook's Meadow, Yosemite Falls, Half Dome, Sentinel Rock and the Royal Arches</strong> can all be seen from a car. Many can be seen without getting out. Several can be photographed from the parking lot.
                </p>
                <p>
                  The free shuttle connects most of the major points in the Valley, and every bus carries a wheelchair lift and tie-downs. The drive up to <strong>Glacier Point</strong> ends at a parking lot a short paved path from one of the great viewpoints in any national park. The drive on <strong>Tioga Road</strong> through the high country is one of the great scenic drives in the United States, with stops along the shoulder.
                </p>
                <p>
                  A non-hiker is not getting a watered-down Yosemite. They are getting Yosemite as the road system was designed to deliver it. The trails are an addition, not the substitute.
                </p>
              </div>
            </div>
            <figure className="nh-photo">
              <ResponsiveImage image="img/yosemite-shuttle-half-dome.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 600px" style={{ aspectRatio: "4 / 3" }}
                alt="A free Yosemite shuttle bus on the Valley road with Half Dome and the granite wall behind it" />
              <figcaption>The free Valley shuttle. Every bus has a wheelchair lift. Photo: Pi.1415926535 / Wikimedia Commons (CC BY-SA 4.0)</figcaption>
            </figure>
          </div>

          <h3 className="nh-subhead">Three levels of effort</h3>
          <ol className="nh-ladder">
            <li className="is-1">
              <EventIcon name="car" size={26} />
              <span>Level 1</span>
              <strong>From the car</strong>
              <p>El Capitan, Cathedral Rocks, Sentinel Rock, Half Dome, the Royal Arches and Yosemite Falls, seen from the Valley loop roads.</p>
            </li>
            <li className="is-2">
              <EventIcon name="eye" size={26} />
              <span>Level 2</span>
              <strong>Step out, a few yards</strong>
              <p>Tunnel View, Valley View, El Capitan Meadow, Sentinel Bridge, and Olmsted Point from its parking area.</p>
            </li>
            <li className="is-3">
              <EventIcon name="walk" size={26} />
              <span>Level 3</span>
              <strong>A short paved path</strong>
              <p>Bridalveil Fall, Lower Yosemite Fall, Cook's Meadow, the Glacier Point overlook and the Big Trees Loop. None is longer than a mile.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* Two words that are not the same word. */}
      <section className="hp-wrap hp-section" id="sec-1-a-word-about-the-word-accessible" tabIndex={-1}>
        <p className="hp-eyebrow">A WORD ABOUT THE WORD "ACCESSIBLE"</p>
        <h2>Paved is a surface. Accessible is a grade.</h2>
        <p className="ff-lede">
          This article uses two different words on purpose, and the difference is not pedantry. If you are planning around a wheelchair, a walker or a heart condition, treat "paved" as a warning rather than a promise.
        </p>
        <div className="nh-defs">
          <div>
            <EventIcon name="route" size={26} />
            <strong>Paved</strong>
            <p>The surface is asphalt or boardwalk rather than dirt and rock. It says nothing about grade. Some paved paths climb enough that a manual wheelchair user cannot push up them and a person with a cardiac limit should not try.</p>
          </div>
          <div>
            <EventIcon name="check" size={26} />
            <strong>Wheelchair accessible</strong>
            <p>The Park Service's own label, applied narrowly. In the Valley it covers the east leg of the Lower Yosemite Fall loop, the western trail to the base of Bridalveil Fall, the Big Trees Loop in the Mariposa Grove and the path from the Glacier Point lot to the overlook.</p>
          </div>
          <div>
            <EventIcon name="alert" size={26} />
            <strong>Where the two part</strong>
            <p>Lower Yosemite Fall's west leg is mostly accessible, but the last 180 feet run at a 13.8 percent slope. The short, steep spur above Bridalveil Fall's viewing area is paved too, and it is not for everyone.</p>
          </div>
        </div>
        <p className="ff-note">
          Where I know which label applies, I say so below. Where a surface is only paved, I say that instead. Read the <a href="https://www.nps.gov/yose/planyourvisit/accessibility.htm" target="_blank" rel="noopener noreferrer">Park Service accessibility page</a> and <a href="/articles/yosemite-accessibility-guide">our accessibility guide</a> before you commit to anything.
        </p>
      </section>

      {/* How far each walk is, on one scale. */}
      <section className="ff-band" id="nh-walks" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">HOW FAR EACH WALK IS</p>
          <h2>Every walk on this page, on one scale</h2>
          <p className="ff-lede">
            Each bar is the distance the Park Service prints, on a scale of zero to one mile. Stops with no printed distance show a label instead, because nobody has measured the walk from the pullout to the railing.
          </p>
          <ul className="nh-walks">
            {WALKS.map(([name, printed, miles, tone, note]) => (
              <li key={name} className={"is-" + tone}>
                <div className="nh-walks__name">
                  <strong>{name}</strong>
                  <span>{printed}</span>
                </div>
                <div className="nh-walks__bar" role="img" aria-label={miles != null ? printed + " on a scale of zero to one mile" : printed + ", no distance printed"}>
                  {miles != null ? <i style={{ width: Math.max(miles * 100, 4) + "%" }} /> : <i className="is-none" />}
                </div>
                <div className="nh-walks__note">
                  <b className={"nh-chip is-" + tone}>{TONES[tone]}</b>
                  <p>{note}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="ff-note">Sources: the Park Service's trail pages and Yosemite Guide for the lengths, and its 2022 accessibility guide for the Glacier Point path, the Lower Yosemite Fall west leg and the Grizzly Giant trail. Surfaces and closures change, so check the current Guide.</p>
        </div>
      </section>

      {/* Before you go. */}
      <section className="hp-wrap hp-section" id="sec-2-before-you-go-the-logistics-that-actuall" tabIndex={-1}>
        <p className="hp-eyebrow">BEFORE YOU GO: THE LOGISTICS THAT ACTUALLY MATTER</p>
        <h2>Parking is the real constraint</h2>
        <p className="ff-lede">
          There is no entry reservation in 2026, so the limit has moved from the gate to the parking lot. For a group that cannot walk far, a full lot is not an inconvenience. It is the end of the plan.
        </p>
        <ul className="ff-rules nh-rules">
          <li>
            <EventIcon name="ticket" size={26} />
            <strong>Reservations</strong>
            <p>The Park Service says a reservation is not required to enter Yosemite in 2026. You drive up, pay the $35 vehicle fee, valid seven days, and go in. Entrance stations take cards only. That is a change from 2024 and 2025.</p>
          </li>
          <li>
            <EventIcon name="car" size={26} />
            <strong>Parking</strong>
            <p>The Park Service says to arrive before 9 a.m. for Valley day-use, because lots are usually full after that, and to keep your space once you find one. Or arrive in late afternoon and make sunset the point of the day. No source publishes when spaces free up, so that one is a bet. <a href="/articles/yosemite-valley-parking-guide">The parking guide</a> has the lots.</p>
          </li>
          <li className="is-exception">
            <EventIcon name="id" size={26} />
            <strong>Accessibility placards</strong>
            <p>Bring yours and hang it. A temporary placard is available at entrance stations and visitor centers. In Yosemite a placard does more than grant parking. It opens roads that are closed to other cars: <a href="/articles/mariposa-grove-how-to-visit">the Mariposa Grove Road to the Grizzly Giant parking area</a>, the Happy Isles Loop Road and the road to Mirror Lake. Drive them under 15 mph with hazard lights on, because walkers and bikes share them. In February, vehicles with a placard may also drive to El Capitan Picnic Area when Northside Drive is closed for Horsetail Fall.</p>
          </li>
          <li>
            <EventIcon name="route" size={26} />
            <strong>The free shuttle</strong>
            <p>Two routes run in the Valley: the Valleywide Shuttle, which serves the whole Valley including lodging, food and trailheads, and the East Valley Shuttle, limited to the eastern end. Both run daily, year-round, from 7 a.m. to 10 p.m. Every bus has a lift and tie-downs. The maximum wheelchair size is 24 inches wide by 46 inches long. Riding the loop and getting off nowhere is a decent low-effort tour of the Valley.</p>
          </li>
          <li>
            <EventIcon name="users" size={26} />
            <strong>Wheelchair and scooter rental</strong>
            <p>The Guide lists ADA bicycles, scooters and wheelchairs at the Yosemite Valley Lodge bike stand, 209/372-1208, open when conditions allow and closed in late fall. The Park Service's 2022 accessibility guide also lists wheelchairs at the Lodge front desk year-round, 209/372-1274, and says the stock is two manual wheelchairs and two scooters. Reserve by phone, and confirm before you count on it.</p>
          </li>
          <li>
            <EventIcon name="signal" size={26} />
            <strong>Getting there without driving</strong>
            <p>YARTS, the regional bus, runs into the Valley from the gateway towns. Highway 140 from Merced and Mariposa runs year-round. The Highway 41, 120 and 395 routes are summer only. Whether the fare covers the entrance fee is unsettled, with the Park Service and YARTS saying opposite things, so <a href="/articles/yosemite-shuttle-and-yarts">budget for the gate</a>.</p>
          </li>
        </ul>
      </section>

      {/* The Valley loop. */}
      <section className="ff-band" id="sec-3-the-valley-by-car-what-you-actually-stop" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">THE VALLEY BY CAR: WHAT YOU ACTUALLY STOP AT</p>
          <h2>Nine stops, in the one direction the road runs</h2>
          <p className="ff-lede">
            The Valley floor is a one-way loop. <strong>Southside Drive carries traffic east, deeper into the Valley. Northside Drive carries traffic west, back out.</strong> You cannot turn around for a stop you missed without driving the loop again, which costs twenty minutes or more in summer traffic. Plan the stops in order.
          </p>
          <ValleyMap />
          <p className="nh-lead">
            The itinerary runs west to east on Southside Drive, then east to west on Northside Drive. It takes three to four hours including lunch, and it includes most of the famous views in the Valley.
          </p>
          <div className="nh-stops">
            <Stop n="1" name="Tunnel View" effort="A short paved walk" tone="wc">
              If you come in on Highway 41 from Wawona, you pass it on the way down. Parking lots sit on both sides of the road, the view is straight off the pavement and there are no stairs. If you park on the far side, you cross Wawona Road on foot, so cross with care. This is the postcard composition: El Capitan on the left, Bridalveil Fall on the right, Half Dome at the back. The Park Service says it is at its best at sunset or after a storm. Give it ten minutes. The light changes it completely.
            </Stop>
            <Stop n="2" name="Bridalveil Fall" effort="0.5 mile round trip" tone="wc">
              The parking area is at the west end of Southside Drive, just past the Wawona Road junction. The trail was rebuilt and reopened in June 2023 with new parking, boardwalk and a much larger viewing area. You walk about half a mile round trip on pavement, with roughly 80 feet of climb, in about 20 minutes. The Park Service says the western trail to the base is wheelchair accessible, and the Guide describes a gentle incline to an accessible viewing area, with a steeper path to a closer view. Take the viewing area and skip the steep spur. There is no drinking water and no shuttle. Best in May and June, when the fall is loud and the spray reaches the trail. By late summer it can be a trickle.
            </Stop>
            <Stop n="3" name="Cathedral Beach and Sentinel Beach picnic areas" effort="Car to a table" tone="plain">
              Both are on Southside Drive, both riverside, both with parking near the tables. You walk from the car to a table, or a short sandy path to the water. These are the best lunch stops in the Valley for a group that does not want to queue in Yosemite Village, and the upstream view of Half Dome from the riverbank is one of the quiet pleasures of the park. The Park Service's older accessibility guide notes that much of the Sentinel Beach parking is uneven and has no designated accessible spaces.
            </Stop>
            <Stop n="4" name="Sentinel Bridge" effort="A short level walk" tone="plain">
              This is where Sentinel Drive crosses the Merced, between Southside Drive and the Village. The Park Service calls it famous for Half Dome reflected in the river. You walk a short level stretch onto the bridge, which has railings the whole way. The view east from the middle, Half Dome standing over the water, is one of the most photographed compositions in Yosemite and the highest reward for the least effort in the Valley.
            </Stop>
            <Stop n="5" name="Cook's Meadow" effort="1 mile loop, flat" tone="plain">
              The Yosemite Guide describes the loop as a relaxing stroll of one mile on flat pavement and boardwalk, with views of Yosemite Falls, Half Dome and the Merced, and early morning and dusk the best times for birds. Walk as much or as little as you like. The reflected Yosemite Falls view that people come for does not need the whole loop. This is the stop I send people to when they have one hour and one working knee.
            </Stop>
            <Stop n="6" name="Yosemite Village" effort="Everything close and level" tone="plain">
              Food, restrooms, the Exploration Center, the museum, the gallery and the store sit close together on level ground. <a href="#sec-8-cultural-and-indoor-sites">Covered below.</a>
            </Stop>
            <Stop n="7" name="Lower Yosemite Fall" effort="1 mile loop, or the east leg" tone="wc">
              The trailhead is across from Yosemite Valley Lodge on the Northside Drive side, at shuttle stop 6. There is no parking at the trailhead. The full loop is 1 mile with about 50 feet of elevation change, roughly half an hour. The <strong>east leg is paved and wheelchair accessible</strong>, 0.6 mile from the shuttle stop, and it reaches the bridge at the base of the fall. Take the east leg out and back if the loop is too much. In spring the bridge gets wet from spray. The fall is often dry from late July or August through October, so check before you go.
            </Stop>
            <Stop n="8" name="El Capitan Meadow" effort="Car to meadow edge" tone="plain" link={<a className="nh-chip nh-chip--link" href="/map?stop=el-capitan-meadow">See it on the trip map</a>}>
              Roadside pullouts on Northside Drive give a view straight up the wall. You walk from the car to the meadow edge, on flat ground, as far as you like. Bring binoculars: in climbing season you can pick out climbers as slow white specks, with haul bags hanging below them, a thing most people have never seen. <a href="/articles/watching-climbers-el-capitan">The climbers guide</a> says when. The fall 2026 Guide marks the shuttle stop here as temporarily closed, so plan to drive.
            </Stop>
            <Stop n="9" name="Valley View" effort="A short riverside path" tone="plain">
              A riverside pullout on Northside Drive at the west end, sometimes called Gates of the Valley, looking east up the Valley. You walk a short, flat path to the riverbank, where boulders and benches wait. Bridalveil Fall, El Capitan and Cathedral Rocks sit in one frame with the Merced in the foreground. It is the last thing you see on the way out, and I think it beats Tunnel View in the late afternoon.
            </Stop>
          </div>
          <figure className="nh-photo nh-photo--wide">
            <ResponsiveImage image="img/valley-view-sunset-rodrigo-soares.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 1100px" style={{ aspectRatio: "16 / 7", objectPosition: "50% 45%" }}
              alt="Valley View at sunset: the Merced River in the foreground, El Capitan lit orange on the left and Cathedral Rocks with Bridalveil Fall on the right" />
            <figcaption>Valley View at sunset. Photo: Rodrigo Soares / Unsplash</figcaption>
          </figure>
          <div className="nh-sides">
            <div>
              <p className="hp-eyebrow">SIDE TRIP A</p>
              <strong>The Ahwahnee</strong>
              <p>Pin A on the map. The hotel's ground floor has an accessible dining room, bar, gift shop and patio, with valet parking and accessible spaces. <a href="#sec-8-cultural-and-indoor-sites">More below.</a></p>
            </div>
            <div>
              <p className="hp-eyebrow">SIDE TRIP B</p>
              <strong>Happy Isles</strong>
              <p>Pin B. The Happy Isles Loop Road is closed to private cars except those with a disability placard. Everyone else takes shuttle stop 16 to the Art and Nature Center, a children's exhibit about 100 yards from the stop, open weekdays until mid-October in the fall 2026 Guide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Two day plans. */}
      <section className="hp-wrap hp-section" id="sec-4-two-low-effort-day-plans" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">TWO LOW-EFFORT DAY PLANS</p>
            <h2>One drive, one meal sitting down, one big view</h2>
            <div className="nh-prose">
              <p>
                The framework under both plans is the same: one drive, one meal sitting down, one big view, and nothing scheduled tightly. The failure mode for this kind of trip is not doing too little. It is stacking three stops onto a group that had energy for two.
              </p>
              <p className="nh-plan__label"><strong>The half day, almost no walking.</strong></p>
              <ul className="nh-plan">
                <li>Tunnel View, ten minutes.</li>
                <li>Bridalveil Fall parking: as much of the paved trail as the grade allows, or skip it and look up at the fall from the lot.</li>
                <li>Lunch at the Cathedral Beach or Sentinel Beach picnic area.</li>
                <li>Sentinel Bridge, for the Half Dome view.</li>
                <li>Cook's Meadow, the first stretch of boardwalk.</li>
                <li>Out on Northside Drive with a stop at El Capitan Meadow and a last stop at Valley View.</li>
              </ul>
              <p>Total walking: under a mile, all of it optional, none of it steep.</p>
            </div>
          </div>
          <div>
            <p className="nh-plan__label"><strong>The full day, one big view.</strong></p>
            <ol className="ff-hours nh-hours">
              <li>
                <span>By 9 a.m.</span>
                <p>Be in the Valley before the lots fill. Do the Valley loop above, ending with lunch in the Village or at a picnic area.</p>
              </li>
              <li>
                <span>Early afternoon</span>
                <p>Drive up to Glacier Point, about an hour each way from the Valley, then the paved path to the overlook.</p>
              </li>
              <li className="is-glow">
                <span>Sunset</span>
                <p>An hour at the railing. If you can stay for it, drive down in the dark.</p>
              </li>
              <li>
                <span>If the road is closed</span>
                <p>Substitute Tunnel View at sunset and do not count it a downgrade.</p>
              </li>
            </ol>
            <p className="ff-note">Total walking: the Valley stops plus about 300 yards of paved path each way at Glacier Point.</p>
          </div>
        </div>
      </section>

      {/* Glacier Point and Tioga Road. */}
      <section className="ff-band" id="sec-5-glacier-point-and-tioga-road" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">GLACIER POINT AND TIOGA ROAD</p>
          <h2>Two scenic drives that deliver views you cannot get from the floor</h2>
          <div className="nh-pair">
            <article className="nh-drive">
              <header>
                <EventIcon name="mountain" size={26} />
                <h3><a href="/articles/glacier-point-road-open-2026">Glacier Point Road</a></h3>
              </header>
              <dl className="nh-drive__facts">
                <div><dt>Season</dt><dd>Open to cars about late May through October or November, depending on snow</dd></div>
                <div><dt>The drive</dt><dd>About an hour from the Valley: 9 miles south on Wawona Road, then 16 on Glacier Point Road</dd></div>
                <div><dt>The walk</dt><dd>A short paved path, about 300 yards each way</dd></div>
                <div><dt>Height</dt><dd>About 3,200 feet above the Valley floor</dd></div>
              </dl>
              <p>
                The path is a descent going out and a climb coming back, so budget more time for the return than the distance suggests. The Park Service lists the path as wheelchair accessible. The point stands about 3,200 feet directly above Curry Village, with Half Dome across the gap at eye level and the high country behind it. The Guide lists a gift shop with snacks, and the Park Service's older guide lists accessible restrooms and a bronze tactile relief model of the park's geology on the terrace below the gift shop. Sunset from the railing is the best hour a non-hiker can spend in Yosemite. Vehicles over 30 feet are not allowed past the Sentinel Dome trailhead. See <a href="/articles/glacier-point-how-to-visit">the Glacier Point guide</a> for the details.
              </p>
            </article>
            <article className="nh-drive">
              <header>
                <EventIcon name="route" size={26} />
                <h3>Tioga Road</h3>
              </header>
              <dl className="nh-drive__facts">
                <div><dt>Season</dt><dd>Open about May or June to November, depending on snow</dd></div>
                <div><dt>The drive</dt><dd>39 miles across the park, climbing from 6,200 feet to nearly 10,000</dd></div>
                <div><dt>The high point</dt><dd>Tioga Pass, at 9,945 feet</dd></div>
                <div><dt>Services</dt><dd>Very few or none in the fall</dd></div>
              </dl>
              <p>
                The drive is the experience, and the elevation is worth flagging: if altitude is a medical issue for anyone in the car, Tuolumne Meadows at 8,600 feet will be felt. <a href="/articles/tuolumne-meadows-in-a-day">A full day in Tuolumne</a> is worth planning rather than driving through, and that guide is built around the short walks rather than the summits.
              </p>
            </article>
          </div>

          <h3 className="nh-subhead">Stops worth making on Tioga Road</h3>
          <ul className="nh-tioga">
            <li>
              <strong>Olmsted Point</strong>
              <span>8,400 feet</span>
              <p>A parking lot view back into the head of Tenaya Canyon, including the back side of Half Dome. The paved walkways by the lot are wheelchair accessible, and a bronze tactile model of Half Dome stands there. The short, hilly 0.25-mile walk out to the point is not accessible. At night it is also the best <a href="/articles/yosemite-stargazing-where-to-look-up">stargazing pullout</a> in the park.</p>
            </li>
            <li>
              <strong>Tenaya Lake</strong>
              <span>About 8,150 feet</span>
              <p>A glacier-carved lake with a granite shoreline and several parking areas. The east end has accessible parking, an accessible vault toilet and a paved path to open views. The route to the beach is a soil trail and is not wheelchair accessible. It is the easiest place in the high country to sit by water.</p>
            </li>
            <li>
              <strong>Tuolumne Meadows</strong>
              <span>8,600 feet</span>
              <p>A broad alpine meadow with pullouts along its length, and the visitor center in summer. Many of the meadow views need no walking at all.</p>
            </li>
          </ul>
          <p className="ff-note">
            If you do not want to drive Tioga Road yourself, a summer-only bus, the Meadows Hikers Bus, runs one way from the Valley to Tuolumne Meadows in about two and a half to three hours, and the YARTS Highway 120 East route covers the same road on a short summer season. The fall 2026 Guide says the summer service has ended. Check dates rather than assuming.
          </p>
        </div>
      </section>

      {/* Mariposa Grove. */}
      <section className="hp-wrap hp-section" id="sec-6-mariposa-grove-which-is-the-best-accessi" tabIndex={-1}>
        <div className="ff-split">
          <figure className="nh-photo">
            <ResponsiveImage image="img/mariposa-grove-giants-trail.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 600px" style={{ aspectRatio: "4 / 5", objectPosition: "50% 40%" }}
              alt="Giant sequoias with red-brown trunks beside the trail in the Mariposa Grove, a visitor standing small at the base for scale" />
            <figcaption>The Mariposa Grove. Photo: Justin Vidamo / Wikimedia Commons (CC BY 2.0)</figcaption>
          </figure>
          <div>
            <p className="hp-eyebrow">MARIPOSA GROVE</p>
            <h2>The best accessible walk in the park</h2>
            <div className="nh-prose">
              <p>
                For a non-hiker, the grove of giant sequoias near the south entrance is the most rewarding place in Yosemite that is not a viewpoint. It reopened in June 2018 after a restoration that moved parking away from the trees and put visitors on good surfaces.
              </p>
            </div>
            <ol className="nh-steps">
              <li><span>1</span><div><strong>Park at the Welcome Plaza</strong><p>It is near the south entrance, with about 300 spaces. It may fill by late morning, so arrive by mid-morning.</p></div></li>
              <li><span>2</span><div><strong>Ride the free shuttle</strong><p>It runs about every 15 minutes and is wheelchair accessible. It carries you about two miles up to the arrival area and trailhead. There is no tram. The 2026 shuttle runs through November 30, with shorter hours after September 23.</p></div></li>
              <li><span>3</span><div><strong>Walk the Big Trees Loop</strong><p>A 0.3-mile loop of 30 to 45 minutes, level and wheelchair accessible, with boardwalk over the wet ground, benches and interpretive panels. It passes the Fallen Monarch. It puts you among mature giant sequoias, which you cannot fake with a viewpoint.</p></div></li>
            </ol>
            <div className="nh-prose">
              <p>
                <strong>If you have a placard.</strong> Vehicles with a disability placard may drive the Mariposa Grove Road past the shuttle to the Grizzly Giant parking area, from which a short trail, 0.1 mile one way over compressed dirt, reaches the Grizzly Giant, the largest tree in the grove. This is the single biggest practical benefit of the placard anywhere in Yosemite. Only placard vehicles may use that road while it is open.
              </p>
              <p>
                <strong>In winter,</strong> the Mariposa Grove Road closes to cars from the end of November until at least April 1, and the shuttle stops with it. You can still get in on foot, by a two-mile hike each way on the road or the Washburn Trail, with about 500 feet of climb. For most non-hikers, winter is the season to skip the grove. <a href="/articles/mariposa-grove-how-to-visit">The grove guide</a> has the rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tours. */}
      <section className="ff-band" id="sec-7-let-someone-else-drive" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">LET SOMEONE ELSE DRIVE</p>
          <h2>Guided tours solve parking, one-way roads and the driving</h2>
          <p className="ff-lede">
            The park concessioner runs guided bus and tram tours out of Yosemite Valley Lodge. Book ahead, and say what you need when you book rather than when you arrive. Fares below are as the concessioner listed them on October 1, 2026.
          </p>
          <ul className="nh-tours">
            <li>
              <p className="nh-tours__kind">Year-round</p>
              <h3>Valley Floor Tour</h3>
              <dl>
                <div><dt>Length</dt><dd>Two hours</dd></div>
                <div><dt>Vehicle</dt><dd>Open-air tram in the warm months, heated bus in the cold</dd></div>
                <div><dt>Departs</dt><dd>Yosemite Valley Lodge, 10, 11, 1 and 2 daily; 10 and 1 only from November 1</dd></div>
                <div><dt>Fare</dt><dd>$41.25 adult, $28.25 child 2 to 12</dd></div>
              </dl>
              <p>The core one: a naturalist or ranger takes you around the Valley and narrates.</p>
            </li>
            <li>
              <p className="nh-tours__kind">While Glacier Point Road is open</p>
              <h3>Glacier Point Tour</h3>
              <dl>
                <div><dt>Length</dt><dd>Four hours round trip</dd></div>
                <div><dt>Vehicle</dt><dd>Enclosed motor coach</dd></div>
                <div><dt>Departs</dt><dd>8:30 a.m. and 1:30 p.m. daily, until mid-October</dd></div>
                <div><dt>Fare</dt><dd>$72.50 adult round trip, $28.50 one way</dd></div>
              </dl>
              <p>The standard way to reach Glacier Point without driving the mountain road. One-way tickets are drop-off only, with no pickup at the point.</p>
            </li>
            <li>
              <p className="nh-tours__kind">Late spring to mid-October</p>
              <h3>Grand Tour</h3>
              <dl>
                <div><dt>Length</dt><dd>About eight hours, lunch included</dd></div>
                <div><dt>Route</dt><dd>The Valley, Glacier Point and the Mariposa Grove</dd></div>
                <div><dt>Departs</dt><dd>Yosemite Valley Lodge, 8 a.m. daily</dd></div>
                <div><dt>Fare</dt><dd>$141 adult, $71 child 2 to 12</dd></div>
              </dl>
              <p>For a visitor with one day and no interest in driving, the most park you can see from a seat.</p>
            </li>
            <li>
              <p className="nh-tours__kind">Summer, a few nights a month</p>
              <h3>Moonlight Tour</h3>
              <dl>
                <div><dt>Length</dt><dd>Two hours</dd></div>
                <div><dt>Vehicle</dt><dd>Open-air tram, with a naturalist</dd></div>
                <div><dt>Departs</dt><dd>9 to 9:30 p.m., varies by month</dd></div>
                <div><dt>Fare</dt><dd>$41.25 adult, $28.25 child</dd></div>
              </dl>
              <p>Runs the nights before the full moon, typically June through September.</p>
            </li>
          </ul>
          <div className="nh-callout">
            <EventIcon name="users" size={26} />
            <p>
              <strong>Accessibility on tours.</strong> Ask for an ADA accommodation when you reserve, at travelyosemite.com or 888/413-8869. The Park Service's older guide gives the wheelchair limit on shuttle and tour buses as 24 by 46 inches and 750 pounds, and says an accessible vehicle can be arranged with 24 hours' notice. The Meadows Hikers Bus, a one-way ride to Tuolumne, is not a narrated tour and is summer only.
            </p>
          </div>
        </div>
      </section>

      {/* Cultural and indoor sites. */}
      <section className="hp-wrap hp-section" id="sec-8-cultural-and-indoor-sites" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">CULTURAL AND INDOOR SITES</p>
            <h2>More indoors than people realize</h2>
            <div className="nh-prose">
              <p>For variety, weather days or slower-paced visitors, Yosemite has more indoor and cultural content than people expect. Most of it is in Yosemite Village, within a few level minutes of the rest.</p>
            </div>
            <ul className="nh-indoor">
              <li>
                <strong>Yosemite Exploration Center</strong>
                <span>Open 9 a.m. to 5 p.m. daily, year-round</span>
                <p>The Valley's main visitor center, formerly the Valley Visitor Center. Interactive exhibits, tactile panels, a Yosemite Conservancy bookstore, and a theater behind it that shows the park films on the hour and half hour. The Park Service says the films are open captioned, with audio description and listening devices on request. Twenty-odd minutes in a seat is useful in the middle of a day for a group that is pacing itself.</p>
              </li>
              <li>
                <strong>Yosemite Museum</strong>
                <span>Hours shorten in late October</span>
                <p>Exhibits on the human and natural history of the park, including the Indian Cultural Exhibit, a recreated umacha, or cedar bark house, in front, and <a href="/articles/yosemite-connecting-to-traditions">demonstrations of traditional crafts</a> when staff are available. Behind it, the reconstructed Indian Village of Ahwahnee has a short, partly paved loop through cedar bark homes. No separate admission is listed.</p>
              </li>
              <li>
                <strong>The Ansel Adams Gallery</strong>
                <span>Open daily, 10 a.m. to 5 p.m. from October 1</span>
                <p>A working photography gallery in the Village Mall with original prints by Adams and work by contemporary photographers. The main floor is reached by a ramp at the front. It also runs photo walks and classes.</p>
              </li>
              <li>
                <strong>The Pioneer Yosemite History Center, Wawona</strong>
                <span>Outdoor exhibits open daily in the fall Guide</span>
                <p>An outdoor cluster of historic buildings you can walk at your own pace, a natural pairing with the Mariposa Grove since both sit at the south end of the park.</p>
              </li>
              <li>
                <strong>The Ahwahnee</strong>
                <span>A National Historic Landmark</span>
                <p>The ground floor has an accessible dining room, bar, gift shop and patio. The hotel's page does not say who may sit in the Great Lounge, so ask at the front desk. The dining room asks for appropriate attire at dinner, and <a href="/articles/where-to-eat-yosemite">the dining guide</a> covers it. The bar is casual. The building is a destination in its own right and the best place in the park to spend an hour doing nothing.</p>
              </li>
            </ul>
          </div>
          <figure className="nh-photo">
            <ResponsiveImage image="img/ahwahnee-great-lounge.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 560px" style={{ aspectRatio: "4 / 3" }}
              alt="The Ahwahnee's Great Lounge from above: chandeliers, tall leaded windows, and sofas around low tables" />
            <figcaption>The Great Lounge at The Ahwahnee. Photo: David Berry / Wikimedia Commons (CC BY 2.0)</figcaption>
          </figure>
        </div>
      </section>

      {/* Ranger programs. */}
      <section className="ff-band" id="sec-9-ranger-programs-which-are-free-and-mostl" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">RANGER PROGRAMS</p>
            <h2>Many are free, and many are sitting down</h2>
            <div className="nh-prose">
              <p>
                The Park Service and the park's partners run walks, talks and evening programs through the season, and a large share are stationary: an amphitheater talk, a film in the Exploration Center theater, an evening program at a campground or the Valley Lodge. Most are free. A few from the concessioner, such as the night walk and the moonlight tram, sell tickets, and the Guide marks which.
              </p>
              <p>
                The Guide marks the programs that are held in a wheelchair-accessible place. Schedules change constantly and are published in the current <em>Yosemite Guide</em>, which you are handed at the entrance station. Read it in the car before you plan the day. We keep the current edition condensed on <a href="/now">the Park Bulletin</a>, including the free-program clock and what is running this week.
              </p>
            </div>
          </div>
          <div className="nh-callout nh-callout--stack">
            <EventIcon name="calendar" size={26} />
            <p><strong>Easy to attend.</strong> An evening program is a seat and about 30 minutes. From November 1 the fall Guide lists a free naturalist program nightly at 8 p.m. in the Valley Lodge Cliff Room. Until October 30 it lists a free, leisurely guided walk from the Lodge amphitheater, Monday through Saturday at 9:30 a.m., 1 to 1.5 hours.</p>
            <a className="ff-ghost" href="/now">This edition's times, on the Park Bulletin</a>
          </div>
        </div>
      </section>

      {/* Pick by need. */}
      <section className="hp-wrap hp-section" id="nh-by-need" tabIndex={-1}>
        <p className="hp-eyebrow">PICK BY NEED</p>
        <h2>What to do, by what you want</h2>
        <p className="ff-lede">Start from what the day is for. Every item is covered above.</p>
        <ul className="nh-needs">
          {NEEDS.map(([icon, head, items]) => (
            <li key={head}>
              <EventIcon name={icon} size={26} />
              <strong>{head}</strong>
              <ul>
                {items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* Seasons. */}
      <section className="ff-band" id="sec-10-what-changes-by-season" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">WHAT CHANGES BY SEASON</p>
          <h2>A non-hiker's day is made of roads, and the roads close</h2>
          <p className="ff-lede">
            Season matters more for a non-hiker than for a hiker, because the itinerary is almost entirely roads. The Valley is open all year. Glacier Point and Tioga roads usually close sometime in November.
          </p>
          <ul className="nh-seasons">
            {SEASONS.map(([icon, name, months, text]) => (
              <li key={name}>
                <EventIcon name={icon} size={26} />
                <span>{months}</span>
                <strong>{name}</strong>
                <p>{text}</p>
              </li>
            ))}
          </ul>
          <div className="nh-callout">
            <EventIcon name="alert" size={26} />
            <p>
              <strong>February's Horsetail Fall rule.</strong> In mid to late February the Horsetail Fall light event brings crowds and a specific access rule. One lane of Northside Drive closes to cars so people can walk it, and general visitors park at Yosemite Falls parking and walk about 1.5 miles each way to the viewing area near El Capitan Picnic Area. Vehicles with a disability placard may drive to El Capitan Picnic Area and park in the turnouts. If you cannot walk three miles round trip in the cold at dusk, the placard is the difference between going and not going. <a href="/articles/horsetail-fall-firefall">The Horsetail guide</a> has the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Bad weather and smoke. */}
      <section className="hp-wrap hp-section" id="nh-weather" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">BAD WEATHER, SMOKE AND A CLOSED ROAD</p>
            <h2>Have a roof on the list</h2>
            <div className="nh-prose">
              <p>
                A road closes or a storm comes in and the plan needs a second half. Every item on this list is level ground in or beside Yosemite Village, and the Valley is open all year.
              </p>
              <p>
                When the air is bad from smoke, a windshield tour is a worse bet than a roof. <a href="/articles/yosemite-during-smoke-season">The smoke guide</a> covers how to read the air, and <a href="/articles/wildfire-in-yosemite-during-your-trip">the wildfire guide</a> covers what changes on the roads.
              </p>
            </div>
            <ul className="nh-fallback">
              <li><EventIcon name="id" size={22} /> <span>The Exploration Center, and the park film in its theater.</span></li>
              <li><EventIcon name="camera" size={22} /> <span>The Ansel Adams Gallery.</span></li>
              <li><EventIcon name="users" size={22} /> <span>The Yosemite Museum and the Indian Village of Ahwahnee.</span></li>
              <li><EventIcon name="bed" size={22} /> <span>The Ahwahnee's public rooms, and its bar.</span></li>
              <li><EventIcon name="route" size={22} /> <span>The Valley Floor Tour, which runs year-round, conditions permitting, on a heated bus in the cold months.</span></li>
              <li><EventIcon name="route" size={22} /> <span>A lap on the free shuttle, which runs every day of the year.</span></li>
              <li><EventIcon name="mountain" size={22} /> <span>If Glacier Point Road is closed, Tunnel View at sunset.</span></li>
            </ul>
          </div>
          <figure className="nh-photo">
            <ResponsiveImage image="img/tunnel-view-ferguson-fire-smoke.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 560px" style={{ aspectRatio: "4 / 3" }}
              alt="Visitors at a stone-walled overlook on Tunnel View in a haze of wildfire smoke, El Capitan faint in the distance" />
            <figcaption>Tunnel View in wildfire smoke, a stand-in photograph from a past fire. Photo: USDA Forest Service Region 5 / Wikimedia Commons (CC BY 2.0)</figcaption>
          </figure>
        </div>
      </section>

      {/* Wildlife and photography. */}
      <section className="ff-band" id="sec-11-wildlife-and-photography-from-accessible" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">WILDLIFE AND PHOTOGRAPHY FROM ACCESSIBLE SPOTS</p>
          <h2>The best-known photographs are taken without a trail</h2>
          <p className="ff-lede">
            Some of the best wildlife viewing in Yosemite is from places that need minimal walking. A photographer who never takes a trail can produce a complete portfolio.
          </p>
          <ul className="nh-wild">
            <li><EventIcon name="eye" size={24} /><strong>El Capitan Meadow at sunrise</strong><p>Park, walk to the meadow edge, sit. Bears, deer and, in fall, migrating songbirds all use this area. Bring binoculars.</p></li>
            <li><EventIcon name="tree" size={24} /><strong>Cook's Meadow</strong><p>Birds, deer and the occasional bear, best in early morning and around dusk, the Guide says. The boardwalk gives you a flat surface to walk slowly. There is nothing wrong with going a hundred feet and standing still for twenty minutes. Standing still is how you see things.</p></li>
            <li><EventIcon name="mountain" size={24} /><strong>The pullouts along Tioga Road in summer</strong><p>Marmots on the granite, mule deer in the meadows, sometimes black bears at meadow edges.</p></li>
            <li><EventIcon name="lake" size={24} /><strong>The Merced River</strong><p>Mergansers, kingfishers and herons in the warmer months, best seen from the bridges or the riverbank picnic areas.</p></li>
          </ul>
          <p className="nh-lead">
            For photography, the classic views are all reachable without hiking: Tunnel View, Valley View, Sentinel Bridge, Cook's Meadow and Glacier Point. The best-known Yosemite photographs are mostly taken from these places.
          </p>
          <NatureNotesFilm id="one-day-in-yosemite" title="One Day in Yosemite" youtubeId="7QLVMwyxU_Q" episode={null}
            note="On June 26, 2012, thirty filmmakers spread across the park to record a single day of the people who visit and work in it." location="article" />
        </div>
      </section>

      {/* Multi-generational trips. */}
      <section className="hp-wrap hp-section" id="sec-12-multi-generational-trips" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">MULTI-GENERATIONAL TRIPS</p>
            <h2>A family with a mix of abilities</h2>
            <div className="nh-prose">
              <p>The most common version of the non-hiker trip is a family with a mix of abilities. Here is the framework I have watched work over and over.</p>
            </div>
            <ol className="nh-rules5">
              <li><strong>Stay in or near the Valley.</strong> Do not base in Wawona or Oakhurst if anyone has limited mobility. The drive adds friction, and the friction compounds across a week. Yosemite Valley Lodge is the best of the in-park options for this trip: flat ground between the rooms, the shuttle stop and the food. It books through the concessioner at travelyosemite.com, not through anybody's search. When the in-park inventory is gone, <AvailabilityLink destination="El Portal, California" list="article_inline" slug="yosemite-for-non-hikers" name="El Portal lodging search">El Portal is the closest place outside the boundary</AvailabilityLink>, about a half hour of flat highway from the Valley floor.</li>
              <li><strong>Build in low-energy mornings and big-vista afternoons.</strong> Late starts are fine. Sunset is the best part of the day for everyone.</li>
              <li><strong>Plan one or two short walks a day, separated by a long break.</strong> A morning at Cook's Meadow, lunch sitting down, an afternoon drive to Glacier Point, dinner. Don't pack the day.</li>
              <li><strong>Pick one big "view day."</strong> Glacier Point if the road is open. The Mariposa Grove if you are staying at the south end. Tunnel View at sunset if neither is available. Make it the highlight everyone shares.</li>
              <li><strong>Let the hikers take a half day to themselves.</strong> Drop them at the Mist Trail trailhead early and pick them up at noon, or put them on the shuttle and let them find their own way back. Everyone gets what they want, and nobody spends the day being quietly resented.</li>
            </ol>
            <p className="ff-note">Traveling with small children? <a href="/articles/yosemite-with-kids-no-reservations-2026">The kids guide</a> uses the same stops.</p>
          </div>
          <div className="nh-cta">
            <LodgingCta
              destination="El Portal, California"
              heading="Distance from the Valley is the whole trip"
              note="For a group with limited mobility, the base is the single decision that decides how the week goes, and the ranking here does not move for anyone's inventory: in-park first, then El Portal, then Mariposa. What no article can tell you is which of those has a room on your dates, which is a two-minute question."
              list="article_cta"
              slug="yosemite-for-non-hikers"
              cta="Search lodging near the Valley →"
            />
          </div>
        </div>
      </section>

      {/* The takeaway. */}
      <section className="ff-band" id="sec-13-the-takeaway" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">THE TAKEAWAY</p>
          <h2>That is a real visit. That is the park.</h2>
          <div className="nh-prose nh-prose--wide">
            <p>
              You do not have to hike to see Yosemite. You probably knew that, but you may have been told otherwise often enough to wonder. The version of the park that is available from the road, the bridges, the meadow boardwalks, the sequoia loop and the lobby of The Ahwahnee is the same Yosemite the hikers are seeing. It is just delivered differently.
            </p>
          </div>
          <ol className="nh-plan5">
            <li><span>Drive</span><strong>The Valley loop, in the one direction it runs</strong></li>
            <li><span>Stop</span><strong>Tunnel View, Sentinel Bridge, Cook's Meadow, El Capitan Meadow, Valley View</strong></li>
            <li><span>Go up</span><strong>Glacier Point, if the road is open, and the grove shuttle</strong></li>
            <li><span>Sit</span><strong>In The Ahwahnee's public rooms, with a coffee</strong></li>
            <li><span>Walk</span><strong>As far up the Bridalveil path as the grade allows, and no further</strong></li>
            <li><span>Eat</span><strong>Lunch at a riverside picnic table</strong></li>
          </ol>
          <p className="nh-further">
            For a longer plan, see <a href="/articles/yosemite-in-one-or-two-days">One day or two in Yosemite</a>, <a href="/articles/yosemite-accessibility-guide">the accessibility guide</a> and <a href="/articles/yosemite-valley-parking-guide">the Valley parking guide</a>.
          </p>
        </div>
      </section>

      {/* Questions and sources. */}
      <section className="hp-wrap hp-section" id="nh-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Yosemite without a trail, answered</h2>
            <div className="nh-sources">
              <h3>Sources</h3>
              <p className="nh-sources__note">All read October 1, 2026.</p>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/accessibility.htm" target="_blank" rel="noopener noreferrer">Accessibility, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/upload/access2022.pdf" target="_blank" rel="noopener noreferrer">Yosemite Accessibility Guide, Summer 2022, NPS</a> (older; used for the Glacier Point path, the Lower Yosemite Fall legs, the Grizzly Giant trail, placards, rentals and tour buses)</li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">Yosemite Guide, September 23 to November 24, 2026, NPS</a> (shuttle hours, Mariposa Grove shuttle, Exploration Center, Museum, Gallery, Glacier Point, programs, Cook's Meadow, tours, bike rentals)</li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/yv.htm" target="_blank" rel="noopener noreferrer">Yosemite Valley, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/glacierpoint.htm" target="_blank" rel="noopener noreferrer">Glacier Point, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/publictransportation.htm" target="_blank" rel="noopener noreferrer">Public transportation and shuttles, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/bridalveilfalltrail.htm" target="_blank" rel="noopener noreferrer">Bridalveil Fall Trail, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/lowerfalltrail.htm" target="_blank" rel="noopener noreferrer">Lower Yosemite Fall Trail, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/mg.htm" target="_blank" rel="noopener noreferrer">Mariposa Grove of Giant Sequoias, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/horsetailfall.htm" target="_blank" rel="noopener noreferrer">Horsetail Fall, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/places/000/olmsted-point.htm" target="_blank" rel="noopener noreferrer">Olmsted Point</a>, <a href="https://www.nps.gov/places/000/tunnel-view.htm" target="_blank" rel="noopener noreferrer">Tunnel View</a> and <a href="https://www.nps.gov/places/000/tenaya-lake.htm" target="_blank" rel="noopener noreferrer">Tenaya Lake</a>, NPS</li>
                <li><a href="https://www.nps.gov/places/yosemite-exploration-center.htm" target="_blank" rel="noopener noreferrer">Yosemite Exploration Center, NPS</a></li>
                <li><a href="https://home.nps.gov/yose/planyourvisit/permitsandreservations.htm" target="_blank" rel="noopener noreferrer">Permits and reservations, NPS Yosemite</a> and <a href="https://www.nps.gov/yose/planyourvisit/fees.htm" target="_blank" rel="noopener noreferrer">Fees and passes</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/tours.htm" target="_blank" rel="noopener noreferrer">Tours, NPS Yosemite</a> and <a href="https://www.travelyosemite.com/things-to-do/guided-bus-tours" target="_blank" rel="noopener noreferrer">guided bus and tram tours, Yosemite Hospitality</a></li>
                <li><a href="https://www.anseladams.com/" target="_blank" rel="noopener noreferrer">The Ansel Adams Gallery</a></li>
                <li><a href="https://www.yarts.com/" target="_blank" rel="noopener noreferrer">YARTS, Yosemite Area Regional Transportation System</a></li>
                <li><a href="https://www.nps.gov/yose/getinvolved/bridalveilea.htm" target="_blank" rel="noopener noreferrer">Bridalveil Fall Rehabilitation Project, NPS</a></li>
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
