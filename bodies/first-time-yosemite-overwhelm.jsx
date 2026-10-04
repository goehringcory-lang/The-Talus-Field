/* global React, EventIcon, ResponsiveImage, AffiliateNote, LodgingCta */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// The October 2026 feature redesign, on the El Capitan article's recipe.
// This body renders on the /firefall system rather than in the 680px reading
// column: its catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's width. Every section sits on `hp-wrap`, alternating paper and the
// `ff-band` tint. The page's own pieces are the `.ft-*` layer in styles.css.
//
// Four rules hold it up.
//   1. Every fact the article carried before the redesign is still here
//      unless a primary source contradicted it, regrouped, and the copy
//      follows docs/voice-guide.md: the answer first, plain words, the
//      author's own voice kept. Every card, bar and chip restates a sentence
//      in this body. Corrections made on October 4, 2026, against the
//      sources listed at the foot: the Mist Trail closure is Monday to
//      Thursday, 7 a.m. to 3:30 p.m., not all day; only the three Pines
//      campgrounds in the Valley release on the 15th (Camp 4 releases a week
//      ahead); and the park did not run a summer reservation system in 2023,
//      so "the timed-entry systems of 2020 through 2025" became "in most
//      summers from 2020 through 2025". The "as I write this in late
//      September" paragraph now names the fall 2026 Yosemite Guide edition.
//   2. The section ids are the anchors the old layout pinned
//      (`sec-<h2 index>-<slug40>`), so the deep links search already carries
//      keep landing on the same content. New sections take `ft-` ids.
//   3. The one map is the National Park Service's own: the /stay crop of the
//      park map (img/nps-yosemite-stay-map.jpg, 1760 x 1410, public domain),
//      with HTML pins in percent of the image at the coordinates /stay uses
//      (STAY_MAP_TOWNS in page-stay.jsx). Mariposa and Oakhurst are off the
//      map, so their pins sit where their highway leaves it, nudged a few
//      pixels inside the frame so the whole pin draws.
//   4. Nothing on the page reads today's conditions. The fall 2026 Guide
//      facts are stated as that edition's, and the Park Bulletin carries the
//      rest.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["first-time-yosemite-overwhelm"] = function FirstTimeYosemiteBody() {
  const TOC = [
    ["#ft-timing", "Timing"],
    ["#sec-0-research-the-real-kind", "Three things"],
    ["#sec-3-three-questions-before-you-book-anything", "Three questions"],
    ["#sec-4-how-many-days-do-you-need-in-yosemite", "How many days"],
    ["#sec-5-the-best-time-to-visit-yosemite-for-a-first-trip", "Best month"],
    ["#sec-6-where-should-you-stay-in-yosemite-for-the-first-time", "Where to stay"],
    ["#sec-7-what-to-see-in-yosemite-the-first-time-in-the-right-order", "What to see, in order"],
    ["#sec-8-what-it-costs-to-get-in", "Fees and reservations"],
    ["#sec-9-first-time-mistakes-to-avoid", "Mistakes"],
    ["#sec-10-common-questions", "Questions"],
  ];

  const FAQ = [
    ["What should I figure out before planning a Yosemite trip?",
      "Three things, before you book anything: what season you are visiting and what is open then, which two of granite, waterfalls, old-growth, high country, and solitude matter most to you, and what your backup plan is when the park does not cooperate."],
    ["How long should I spend in Yosemite for a first trip?",
      "Two full days at minimum. Three to four is better, giving you the Valley properly and one full day elsewhere at Glacier Point, the Mariposa Grove, or on Tioga Road. A single day works if you start early and stay in the Valley."],
    ["What month is best for visiting Yosemite for the first time?",
      "Late May and June for peak waterfalls with every road usually open; September and October for thin crowds and low gold light. July and August are hot and crowded. April has waterfalls and fewer people but Tioga Road and Glacier Point Road are usually still closed."],
    ["Do I need a reservation to enter Yosemite in 2026?",
      "No. There is no day-use or timed-entry reservation in 2026. You need a standard entrance pass, $35 per vehicle for seven days."],
    ["Where should I stay in Yosemite for the first time?",
      "Mariposa is the most practical first-timer choice: 45 minutes to an hour from the Valley, a real downtown, and the year-round Highway 140 road. El Portal is closer but smaller and more expensive. In-park lodging books 366 days ahead and fills fast for summer."],
    ["How much driving is involved in a Yosemite trip?",
      "More than most people expect. A gateway town to the Valley is 25 to 90 minutes each way, and Glacier Point Road or Tioga Road each add an hour or more inside the park."],
    ["Is there an extra fee for international visitors in 2026?",
      "Yes. Since January 1, 2026, visitors who are not U.S. residents pay a $100 surcharge per person age 16 and older on top of the standard entrance fee. A $250 nonresident annual pass waives it. U.S. residents are unaffected."],
  ];

  // ── Same place, two ways ───────────────────────────────────────────────────
  // [place, icon, the usual way, the better way]. Both halves restate the
  // essay and the "in the right order" section below.
  const TWO_WAYS = [
    ["Tunnel View", "eye",
      "One in the afternoon in July. The lot is full, the overlook is three-deep, and the photo goes over a stranger's shoulder.",
      "First light, the first stop of the day. At the right hour in the right month you can have it nearly to yourself."],
    ["Glacier Point", "mountain",
      "Driven during a smoke event, with Half Dome seen through gauze.",
      "Late afternoon on a second day, when the light is on Half Dome rather than behind it. In smoke, drive Tioga Road instead."],
    ["The Mist Trail", "walk",
      "Hiked in a conga line, as a first-morning warm-up.",
      "Treated as what it is, a real climb of about 1,000 feet on wet granite steps, and kept off the first morning."],
    ["The Mariposa Grove", "tree",
      "The busiest hour of the busiest day, never once alone beside a 2,500-year-old tree.",
      "The first shuttle of the morning or the last hour before it stops. Never at noon."],
  ];

  // ── Pick two ──────────────────────────────────────────────────────────────
  const WANTS = [
    ["mountain", "Granite"],
    ["drop", "Waterfalls"],
    ["tree", "Old-growth"],
    ["route", "High country"],
    ["eye", "Wilderness solitude"],
  ];

  // ── The best time, month by month ─────────────────────────────────────────
  // Tone: best, good, valley (the high roads usually closed), hot, winter.
  // Every label restates the "best time" section's paragraph.
  const MONTHS = [
    ["Jan", "winter", "Winter"],
    ["Feb", "winter", "Winter"],
    ["Mar", "winter", "Winter"],
    ["Apr", "valley", "Falls, Valley only"],
    ["May", "best", "Best, late May"],
    ["Jun", "best", "Best"],
    ["Jul", "hot", "Hot, crowded"],
    ["Aug", "hot", "Hot, crowded"],
    ["Sep", "good", "Second best"],
    ["Oct", "good", "Second best"],
    ["Nov", "valley", "High roads close"],
    ["Dec", "winter", "Winter"],
  ];
  const MONTH_KEY = {
    best: "Falls at or near peak, every road usually open",
    good: "Thin crowds, low gold light, every road still open, little water in the falls",
    hot: "Hot and the most crowded; the relief is elevation",
    valley: "The high roads are usually closed: a Valley trip",
    winter: "Its own park, quiet: the Valley, Wawona and Hetch Hetchy",
  };

  // ── Where to stay, on the NPS's own map ───────────────────────────────────
  // The /stay crop (1760 x 1410) and its town coordinates (page-stay.jsx).
  const MAP_W = 1760, MAP_H = 1410;
  const PINS = [
    { n: "V", at: [690, 647], name: "Yosemite Valley", valley: true },
    { n: "1", at: [283, 858], name: "El Portal" },
    { n: "2", at: [30, 905], name: "Mariposa, off the map on Highway 140" },
    { n: "3", at: [575, 1380], name: "Oakhurst, off the map on Highway 41" },
    { n: "4", at: [1648, 95], name: "Lee Vining, over Tioga Road" },
  ];
  const pct = (x, y) => ({ left: (x / MAP_W) * 100 + "%", top: (y / MAP_H) * 100 + "%" });

  // [pin, town, low, high (minutes to the Valley), road, verdict, tone].
  // Lee Vining has no upper bound: it is a high-country base.
  const TOWNS = [
    ["1", "El Portal", 25, 35, "Highway 140", "Closer, and priced like it", "good"],
    ["2", "Mariposa", 45, 60, "Highway 140, the year-round road", "The default for a first trip", "best"],
    ["3", "Oakhurst", 75, 90, "Highway 41", "Right for the Mariposa Grove, wrong for a Valley trip", "warn"],
    ["4", "Lee Vining", 90, null, "Tioga Road, closed in winter", "A high-country base, not a Valley base", "bad"],
  ];
  const SCALE = 120;

  function StayMap() {
    return (
      <figure className="ft-map">
        <div className="ft-map__frame">
          <ResponsiveImage image="img/nps-yosemite-stay-map.jpg" className="ft-map__img" sizes="(max-width: 880px) calc(100vw - 40px), 560px" style={{ aspectRatio: "1760 / 1410" }}
            alt="National Park Service map of Yosemite, cropped from Hetch Hetchy south to the Mariposa Grove. Yosemite Valley is marked V. El Portal is pin 1, just west of the park on Highway 140. Mariposa, pin 2, and Oakhurst, pin 3, are off the map, where Highways 140 and 41 leave it. Lee Vining, pin 4, is at the top right, east of Tioga Pass." />
          <div className="ft-map__layer" aria-hidden="true">
            {PINS.map((p) => (
              <span key={p.n} className={"ft-pin" + (p.valley ? " is-valley" : "")} style={pct(p.at[0], p.at[1])}><b>{p.n}</b></span>
            ))}
          </div>
        </div>
        <figcaption>
          <ol className="ft-map__key">
            {PINS.map((p) => <li key={p.n} className={p.valley ? "is-valley" : ""}><b>{p.n}</b> {p.name}</li>)}
          </ol>
          <span>Pins are approximate. Map: National Park Service (public domain), cropped.</span>
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="ft-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="calendar" /><dt>A first trip needs</dt><dd>Two full days, three or four if you can</dd></div>
          <div><EventIcon name="drop" /><dt>Best months</dt><dd>Late May and June, then Sep and Oct</dd></div>
          <div><EventIcon name="ticket" /><dt>Entry in 2026</dt><dd>No reservation. $35 a car</dd></div>
          <div><EventIcon name="bed" /><dt>Book first</dt><dd>Where you sleep</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the list, and the whole page in five lines beside it. */}
      <section className="hp-wrap hp-section ft-open">
        <div className="ff-split">
          <div className="ft-prose">
            <p className="dropcap">
              Somewhere on the internet there is a guide (probably half a dozen) telling you that on your first trip to Yosemite you need to see Tunnel View, Cook's Meadow, Glacier Point, the Mariposa Grove, and Tuolumne Meadows. Maybe Half Dome. Maybe El Capitan. The list is always pretty much the same.
            </p>
            <p>I'm not going to argue with the list.</p>
            <p>
              Those places are on every list for a reason. Tunnel View is the view that helped build the modern conservation movement. El Capitan is roughly three thousand feet of unbroken granite you can stand at the base of and crane your neck back until it hurts. The Mariposa Grove is where giant sequoias have been growing since before the Roman Empire. Cook's Meadow holds one of the most photographed compositions in American landscape photography, and Glacier Point puts you at about 7,200 feet looking straight down into the Valley with Half Dome at eye level. Tuolumne Meadows in late June will change your idea of what a high-altitude meadow looks like.
            </p>
            <p>
              These places earned their fame. Don't skip them. I'm a senior naturalist who has worked in this park for close to two decades, and I still pull over at Tunnel View almost every time I drive past.
            </p>
            <p className="ft-turn">What most guides leave out is timing.</p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>Give it two full days. Three or four leaves room for the plan to change.</li>
              <li>Come in late May or June. September and October are the second-best answer.</li>
              <li>Book the bed first: in the park 366 days out, or Mariposa.</li>
              <li>Be through the gate before 8 a.m. Tunnel View first.</li>
              <li>No entry reservation in 2026. $35 a car, cards only.</li>
            </ul>
            <a className="ft-short__link" href="#sec-3-three-questions-before-you-book-anything">Three questions before you book</a>
          </aside>
        </div>
      </section>

      {/* Timing: the same four places, two ways. */}
      <section className="ff-band" id="ft-timing" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE BUSIEST VERSION OF THE BUSIEST PLACES</p>
              <h2>The list is right. The hour is wrong.</h2>
              <div className="ft-prose">
                <p>
                  Most people visit these places the worst way they could. They arrive at Tunnel View at one in the afternoon in July, find the lot full and the overlook three-deep, take a photo over a stranger's shoulder, and leave. They drive Glacier Point Road during a smoke event and see Half Dome through gauze. They hike the Mist Trail in a conga line. They walk through the Mariposa Grove at the busiest hour of the busiest day and never once stand alone next to a 2,500-year-old tree.
                </p>
                <p>
                  Then they go home and tell their friends Yosemite was beautiful, but crowded. And it was. They visited the busiest version of the busiest places at the busiest time.
                </p>
              </div>
              <blockquote className="ft-quote">The bucket list isn't the problem. The strategy is.</blockquote>
            </div>
            <figure className="ft-photo">
              <ResponsiveImage image="img/tunnel-view-autumn-aniket-deole.jpg" sizes="(max-width: 880px) calc(100vw - 40px), 560px" style={{ aspectRatio: "4 / 3" }}
                alt="Tunnel View in autumn: El Capitan on the left, Bridalveil Fall on the right, and fresh snow on Half Dome and the peaks at the far end of the Valley" />
              <figcaption>Tunnel View, the stop most first trips get wrong by a few hours. Photo: Aniket Deole / Unsplash</figcaption>
            </figure>
          </div>

          <h3 className="ft-subhead">Same place, two ways</h3>
          <ul className="ft-ways">
            {TWO_WAYS.map(([place, icon, usual, better]) => (
              <li key={place}>
                <p className="ft-ways__head"><EventIcon name={icon} size={24} /> {place}</p>
                <div className="ft-ways__usual">
                  <span>The usual way</span>
                  <p>{usual}</p>
                </div>
                <div className="ft-ways__better">
                  <span>The better way</span>
                  <p>{better}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="ff-note">
            Each "better way" is the order and the hour laid out <a href="#sec-7-what-to-see-in-yosemite-the-first-time-in-the-right-order">further down</a>.
          </p>
        </div>
      </section>

      {/* The three things. Each keeps its own h2 and pinned id. */}
      <section className="hp-wrap hp-section ft-three">
        <p className="hp-eyebrow">THREE THINGS</p>
        <p className="ff-lede">
          In my experience, three things turn a Yosemite visit from "we saw the things" into "that was one of the best weeks of my life."
        </p>

        <article className="ft-thing" id="sec-0-research-the-real-kind" tabIndex={-1}>
          <p className="ft-thing__num" aria-hidden="true">1</p>
          <div className="ft-thing__body">
            <h2>Research, the real kind</h2>
            <div className="ft-prose">
              <p>
                The first is <strong>research</strong>. Not the first three results on Google. Yosemite's seasons work differently than almost anywhere else in the United States. None of what follows is a secret. But a trip planned around it and a trip that ignores it are two different trips.
              </p>
              <p>
                The same holds for a single week. The fall 2026 Yosemite Guide, the park's own newspaper for September 23 to November 24, is a good example: none of what it says is on the standard bucket list, and all of it decides what a good day looks like. The <a href="/now">Park Bulletin</a> tracks what's current in the park (closures, hours, trail status) so you don't have to dig for it.
              </p>
            </div>
          </div>
          <div className="ft-ledgers">
            <div className="ft-ledger">
              <p className="ft-ledger__head"><EventIcon name="calendar" size={20} /> Every year</p>
              <ul>
                <li><strong>Tioga Road</strong>, the highway to Tuolumne, opens in late May or early June, and in heavy snow years not until July.</li>
                <li><strong>The waterfalls</strong> peak in May and are mostly dry by August.</li>
                <li><strong>High-country wildflowers</strong> can bloom six weeks after the Valley floor's.</li>
                <li><strong>Smoke</strong> from regional fires can hide the views for weeks at a time.</li>
              </ul>
            </div>
            <div className="ft-ledger ft-ledger--now">
              <p className="ft-ledger__head"><EventIcon name="alert" size={20} /> The fall 2026 Guide</p>
              <ul>
                <li><strong>The Mist Trail</strong>, the most hiked trail in the park, is closed for repairs Monday through Thursday, 7 a.m. to 3:30 p.m., through the end of October.</li>
                <li><strong>Yosemite Falls</strong> is down to a late-season trickle, and <strong>Mirror Lake</strong> is a meadow.</li>
                <li><strong>Bridalveil Fall</strong> is still worth the stop.</li>
                <li><strong>Tioga Road and Glacier Point Road</strong> are open until the first serious snow closes them for winter.</li>
              </ul>
            </div>
          </div>
        </article>

        <article className="ft-thing" id="sec-1-knowing-what-you-actually-want" tabIndex={-1}>
          <p className="ft-thing__num" aria-hidden="true">2</p>
          <div className="ft-thing__body">
            <h2>Knowing what you actually want</h2>
            <div className="ft-prose">
              <p>
                The second is <strong>knowing what you actually want.</strong> A lot of first-time visitors arrive with a kind of unspoken plan to "see Yosemite," which is a little like booking a trip to "see California." You don't need to know everything about the park to plan a good trip. You do need to know something about yourself.
              </p>
            </div>
          </div>
          <div className="ft-asks">
            <p className="ft-asks__head">Ask yourself</p>
            <ul>
              <li>Are you here for granite and waterfalls?</li>
              <li>Are you here to walk in old-growth forest?</li>
              <li>Do you want quiet alpine lakes you have to earn?</li>
              <li>Do you want to drive to your views, or hike to them?</li>
              <li>Are you bringing kids who can't go more than two miles?</li>
            </ul>
          </div>
        </article>

        <article className="ft-thing" id="sec-2-being-willing-to-flex" tabIndex={-1}>
          <p className="ft-thing__num" aria-hidden="true">3</p>
          <div className="ft-thing__body">
            <h2>Being willing to flex</h2>
            <div className="ft-prose">
              <p>
                The third is <strong>being willing to flex.</strong> The best decision I've seen first-time visitors make comes two days into a five-day trip. They realize the Yosemite they planned for isn't the one they're getting, and they change the plan. Yosemite rewards adaptability. The trip you plan from your kitchen table is rarely the trip the park is going to give you.
              </p>
            </div>
          </div>
          <ul className="ft-swaps">
            <li>
              <span className="ft-swaps__if">Crowds heavier than expected?</span>
              <span className="ft-swaps__from">Vernal Fall</span>
              <span className="ft-swaps__arrow" aria-hidden="true">→</span>
              <span className="ft-swaps__to">Wapama Falls</span>
            </li>
            <li>
              <span className="ft-swaps__if">Smoke rolling in from the west?</span>
              <span className="ft-swaps__from">Glacier Point</span>
              <span className="ft-swaps__arrow" aria-hidden="true">→</span>
              <span className="ft-swaps__to">Tioga Pass</span>
            </li>
          </ul>
        </article>
      </section>

      {/* The pitch. */}
      <section className="ff-band ft-pitch">
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">WHAT THIS SITE IS FOR</p>
              <h2>This site is for the people willing to do all three</h2>
              <div className="ft-prose">
                <p>
                  What I hope to do here is explain Yosemite as it actually works, which takes more room than most guides have. You can check off the El Capitan box and the Half Dome box and the Mariposa Grove box and feel great about it. You should. But the reason to do the work (the research, the self-knowledge, the flexibility) is that a little effort turns the same trip into something else.
                </p>
              </div>
            </div>
            <div>
              <ul className="ft-cans">
                <li>You can stand at Tunnel View at the right hour, in the right month, and have it nearly to yourself.</li>
                <li>You can walk into a sequoia grove with no one in earshot.</li>
                <li>You can hike a trail two miles off the standard list and not see another human all afternoon.</li>
                <li>You can see one of the busiest national parks in the country the way it's meant to be seen. Quiet, wild, weird, alive.</li>
              </ul>
              <p className="ft-signoff">That's the whole pitch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Three questions. */}
      <section className="hp-wrap hp-section" id="sec-3-three-questions-before-you-book-anything" tabIndex={-1}>
        <p className="hp-eyebrow">BEFORE YOU BOOK ANYTHING</p>
        <h2>Three questions, before you book anything</h2>
        <p className="ff-lede">
          Before you book anything (a hotel in Mariposa, <a href="/articles/camping-in-yosemite-first-time">a campsite in the Valley</a>, a Glacier Point tour, a seat on YARTS, the regional bus into the park), sit with three questions.
        </p>
        <ol className="ft-questions">
          <li>
            <span className="ft-questions__num">1</span>
            <strong>What season are you actually planning to visit, and do you know what's open and what isn't in that season?</strong>
            <a href="#sec-5-the-best-time-to-visit-yosemite-for-a-first-trip">The year, month by month</a>
          </li>
          <li>
            <span className="ft-questions__num">2</span>
            <strong>Which two matter most to you?</strong>
            <span className="ft-wants">
              {WANTS.map(([icon, label]) => <span key={label} className="ft-want"><EventIcon name={icon} size={16} /> {label}</span>)}
            </span>
            <p>You can have all of them on one trip, but the order you visit them in matters.</p>
          </li>
          <li>
            <span className="ft-questions__num">3</span>
            <strong>What's your plan if your plan doesn't work?</strong>
            <a href="/now">What's open in the park this week</a>
          </li>
        </ol>
        <div className="ft-prose ft-prose--wide ft-after">
          <p>
            Answer those three, and we can build the rest of the trip together. Skip them, and you'll have the same forgettable trip everyone else is having.
          </p>
          <p>
            The good news is that the work pays off. Yosemite is the birthplace of the national park idea. I've spent twenty years trying to explain what it's like to stand in it at the right time, and I haven't quite managed it. The next best thing I can do is help you plan a trip where you have a real shot at finding out yourself. That's what this whole site is for.
          </p>
          <p>
            What follows is the practical half: the questions every first-time visitor asks, in the order they come up, with the short answer here and the long answer one link away.
          </p>
        </div>
      </section>

      {/* How many days. */}
      <section className="ff-band" id="sec-4-how-many-days-do-you-need-in-yosemite" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">HOW LONG</p>
          <h2>How many days do you need in Yosemite the first time?</h2>
          <p className="ff-lede">
            Two full days is the honest minimum for a first visit. The second day is where the trip stops being a checklist.
          </p>
          <ol className="ft-days">
            <li>
              <span className="ft-days__n">1 day</span>
              <strong>The Valley, properly</strong>
              <p>Started at sunrise: Tunnel View, Bridalveil Fall, the Lower Yosemite Fall loop, Cook's Meadow, and an hour on a rock by the Merced.</p>
              <span className="ft-days__chip is-warn">Only if you're in by 8 a.m.</span>
            </li>
            <li className="is-pick">
              <span className="ft-days__n">2 days</span>
              <strong>The minimum</strong>
              <p>A second day leaves the Valley floor for Glacier Point, the Mariposa Grove, or Tioga Road.</p>
              <span className="ft-days__chip is-best">The honest minimum</span>
            </li>
            <li>
              <span className="ft-days__n">3 to 4 days</span>
              <strong>Room to change the plan</strong>
              <p>All of that without watching the clock, and still one day left for the plan to change.</p>
              <span className="ft-days__chip is-good">Better</span>
            </li>
          </ol>
          <div className="ft-prose ft-prose--wide ft-after">
            <p>
              Is one day enough? Yes, if you are in the park by 8 a.m. and willing to do less than the lists say. The one-day trips people regret are the ones that arrive at noon, circle the lots, and try to add Glacier Point. A day trip from San Francisco is possible, but the drive is four hours each way. Run <a href="/articles/yosemite-day-trip-from-bay-area">the daylight arithmetic</a> before you commit to it.
            </p>
            <p>
              <a href="/articles/yosemite-in-one-or-two-days">One day in Yosemite</a> lays out the short version stop by stop, and <a href="/articles/yosemite-in-three-to-five-days">three to five days</a> covers the longer one.
            </p>
          </div>
        </div>
      </section>

      {/* The best time. */}
      <section className="hp-wrap hp-section" id="sec-5-the-best-time-to-visit-yosemite-for-a-first-trip" tabIndex={-1}>
        <p className="hp-eyebrow">WHEN TO GO</p>
        <h2>The best time to visit Yosemite for a first trip</h2>
        <p className="ff-lede">
          Late May through June, if you can choose freely. The waterfalls are at or near their peak, the Valley is green, and in most years Glacier Point Road and Tioga Road have opened by then, so the whole park is on the menu.
        </p>
        <figure className="ft-months">
          <figcaption>A first trip, month by month</figcaption>
          <ol>
            {MONTHS.map(([m, tone, label]) => (
              <li key={m} className={"is-" + tone}>
                <span className="ft-months__m">{m}</span>
                <span className="ft-months__bar" aria-hidden="true" />
                <span className="ft-months__label">{label}</span>
              </li>
            ))}
          </ol>
          <dl className="ft-months__key">
            {["best", "good", "hot", "valley", "winter"].map((k) => (
              <div key={k} className={"is-" + k}><dt><i aria-hidden="true" /></dt><dd>{MONTH_KEY[k]}</dd></div>
            ))}
          </dl>
        </figure>
        <div className="ft-prose ft-prose--wide ft-after">
          <p>
            In 2026 the two high roads opened early, Glacier Point Road on May 9 and Tioga Road on May 15. September and October are the second-best answer: crowds thin, the light goes low and gold, every road is still open, and the only thing missing is water in the falls. July and August are hot and the most crowded, and the relief is elevation. April has the falls and fewer people, but the high roads are usually still closed, so a first trip in April is a Valley trip. Winter is its own park, quiet and lovely, but the Valley, Wawona, and Hetch Hetchy are all of it.
          </p>
          <p>
            <a href="/articles/when-to-visit-yosemite">The crowd forecast</a> ranks every month, and the <a href="/planning">trip selector</a> will cap an itinerary to the roads your month allows.
          </p>
        </div>
      </section>

      {/* Where to stay. */}
      <section className="ff-band" id="sec-6-where-should-you-stay-in-yosemite-for-the-first-time" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">WHERE TO SLEEP</p>
          <h2>Where should you stay in Yosemite for the first time?</h2>
          <p className="ff-lede">
            Inside the park if you can get a room, and for most people that is the catch. Whichever you pick, book before you plan anything else.
          </p>
          <ul className="ft-windows">
            <li>
              <EventIcon name="bed" size={24} />
              <span>In-park lodging</span>
              <strong>366 days ahead</strong>
              <p>Yosemite Valley Lodge, Curry Village, and The Ahwahnee book through travelyosemite.com. Summer dates go on the first morning.</p>
            </li>
            <li>
              <EventIcon name="calendar" size={24} />
              <span>Valley campsites</span>
              <strong>The 15th, 7 a.m. Pacific</strong>
              <p>Upper, Lower and North Pines open on Recreation.gov up to five months out, and they go in minutes. <a href="/dates">The dates page</a> works out your release day.</p>
            </li>
            <li>
              <EventIcon name="pin" size={24} />
              <span>Gateway towns</span>
              <strong>Six to twelve months out</strong>
              <p>If neither works, and for a first trip they usually don't, the answer is a gateway town, one of the small towns just outside the park entrances. For summer, their rooms fill six to twelve months out.</p>
            </li>
          </ul>

          <div className="ff-split ft-stay">
            <StayMap />
            <div>
              <h3 className="ft-subhead ft-subhead--tight">Which town matters more than any hotel review</h3>
              <p className="ft-small">They sit on different sides of the park, and their drives to the Valley differ by an hour or more. Each bar is the drive to the Valley, on a scale of zero to two hours.</p>
              <ul className="ft-towns">
                {TOWNS.map(([n, town, lo, hi, road, verdict, tone]) => (
                  <li key={town} className={"is-" + tone}>
                    <div className="ft-towns__name">
                      <b>{n}</b>
                      <div>
                        <strong>{town}</strong>
                        <span>{road}</span>
                      </div>
                    </div>
                    <div className="ft-towns__bar" role="img" aria-label={hi ? `${lo} to ${hi} minutes to the Valley` : `${lo} minutes at a minimum to the Valley`}>
                      <i style={{ left: (lo / SCALE) * 100 + "%", width: ((hi || SCALE) - lo) / SCALE * 100 + "%" }} className={hi ? "" : "is-open"} />
                    </div>
                    <p className="ft-towns__time">{hi ? `${lo} to ${hi} min` : `${lo} min or more`}</p>
                    <p className="ft-towns__verdict">{verdict}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ff-split ft-stay-end">
            <div className="ft-prose">
              <p>
                The short version: <strong>Mariposa</strong> is the default for a first trip, a real town on Highway 140, the year-round road, 45 minutes to an hour from the Valley. <strong>El Portal</strong> is closer, about 25 to 35 minutes, and priced like it. <strong>Oakhurst</strong> is right for the Mariposa Grove and wrong for a Valley trip, at 75 to 90 minutes each way. <strong>Lee Vining</strong> is a high-country base, not a Valley base, and picking it for a Valley trip is the most common mistake I see.
              </p>
              <p>
                <a href="/articles/yosemite-gateway-towns-compared">Where to stay near Yosemite</a> compares all five, and <a href="/articles/where-to-stay-in-yosemite">the in-park lodging guide</a> covers the other side of the boundary.
              </p>
            </div>
            <div className="ft-cta">
              <LodgingCta
                destination="Yosemite National Park"
                heading="The decision to make first"
                note="Of everything on this page, lodging is the only piece with a deadline attached: in-park beds open 366 days ahead and gateway rooms fill six to twelve months out for summer. Knowing what is actually left on your dates is what turns the rest of this from theory into a plan."
                list="article_cta"
                slug="first-time-yosemite-overwhelm"
                cta="See what is available on your dates →"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What to see, in order. */}
      <section className="hp-wrap hp-section" id="sec-7-what-to-see-in-yosemite-the-first-time-in-the-right-order" tabIndex={-1}>
        <p className="hp-eyebrow">WHAT TO SEE</p>
        <h2>What to see in Yosemite the first time, in the right order</h2>
        <p className="ff-lede">
          The list at the top of this piece is the right list. What changes the trip is the order and the hour.
        </p>
        <div className="ft-order">
          <div>
            <p className="ft-order__day">Day one: the Valley</p>
            <ol className="ff-hours">
              <li className="is-glow"><span>First light</span><p>Tunnel View.</p></li>
              <li><span>Then</span><p>Bridalveil Fall.</p></li>
              <li><span>Before mid-morning</span><p>The Lower Yosemite Fall loop and Cook's Meadow, before the lots fill.</p></li>
            </ol>
          </div>
          <div>
            <p className="ft-order__day">Day two: above the floor</p>
            <ol className="ff-hours">
              <li><span>First shuttle, or the last hour</span><p>The Mariposa Grove. Never at noon.</p></li>
              <li className="is-glow"><span>Late afternoon</span><p>Glacier Point, when the light is on Half Dome rather than behind it.</p></li>
            </ol>
          </div>
          <div>
            <p className="ft-order__day">A day of its own, if Tioga is open</p>
            <ol className="ff-hours">
              <li><span>Two hours from the Valley</span><p>Tuolumne Meadows, which deserves more than a drive-through.</p></li>
            </ol>
          </div>
        </div>
        <p className="ft-small ft-after">
          That sequence is the backbone of the <a href="/itineraries">one-, two-, and three-day itineraries</a> on this site, and the <a href="/map">trip map</a> lets you rearrange it to fit your dates.
        </p>

        <h3 className="ft-subhead">Two things first-timers assume they can do, and often cannot</h3>
        <div className="ft-cannot">
          <div>
            <EventIcon name="dome" size={26} />
            <strong>Half Dome</strong>
            <p>It needs a permit while the cables are up, won by lottery in March or in a small daily lottery two days ahead. Read <a href="/articles/so-you-want-to-hike-half-dome">the Half Dome guide</a> before you promise anyone the summit.</p>
          </div>
          <div>
            <EventIcon name="walk" size={26} />
            <strong>The Mist Trail</strong>
            <p>The park's most popular hike is a real climb of about 1,000 feet on wet granite steps, not a stroll to a viewpoint.</p>
          </div>
        </div>
        <p className="ft-signoff ft-signoff--small">Both are worth doing. Neither belongs on a first morning.</p>
      </section>

      {/* Fees and reservations. */}
      <section className="ff-band" id="sec-8-what-it-costs-to-get-in" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">FEES AND RESERVATIONS</p>
          <h2>What it costs to get in, and whether you need a reservation</h2>
          <p className="ff-lede">
            You do not need a reservation to enter Yosemite in 2026. The summer reservation systems the park ran in most years from 2020 through 2025 are gone, and the Park Service now handles peak days by watching traffic and controlling parking. What you need is an entrance pass.
          </p>
          <ul className="ft-fees">
            <li><span>Per car, seven days</span><strong>$35</strong></li>
            <li><span>Per person on foot or bike</span><strong>$20</strong></li>
            <li><span>America the Beautiful annual pass</span><strong>$80</strong><p>Worth it if you will visit more than one park this year.</p></li>
            <li className="is-extra"><span>Non-U.S. residents, age 16 and up</span><strong>+$100</strong><p>A surcharge per person since January 1, 2026, or $250 for a nonresident annual pass that waives it.</p></li>
          </ul>
          <div className="ff-split ft-fees-after">
            <div className="ft-prose">
              <p>
                Buy the pass on Recreation.gov before you arrive and you'll get through the gate faster. The entrance stations take cards, not cash. <a href="/international">The international visitor page</a> does the surcharge arithmetic for your party.
              </p>
              <p>
                <a href="/articles/yosemite-without-reservations-2026">The 2026 reservation guide</a> has the full picture, including how to plan for a park with no cap on visitors.
              </p>
            </div>
            <div className="ft-still">
              <p className="ft-still__head"><EventIcon name="ticket" size={20} /> Still needs its own reservation or permit</p>
              <ul>
                <li>Camping</li>
                <li>In-park lodging</li>
                <li>Half Dome</li>
                <li>Overnight wilderness trips</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mistakes. */}
      <section className="hp-wrap hp-section" id="sec-9-first-time-mistakes-to-avoid" tabIndex={-1}>
        <p className="hp-eyebrow">MISTAKES</p>
        <h2>First-time mistakes to avoid</h2>
        <ul className="ff-rules ft-rules">
          <li>
            <EventIcon name="clock" size={26} />
            <strong>Arriving at ten</strong>
            <p>Valley lots fill by late morning on ordinary days and by 8 a.m. on summer weekends. Be through the gate before 8, or come after 4 p.m. <a href="/articles/yosemite-valley-parking-guide">The parking guide</a> explains what to do once the lots are full.</p>
          </li>
          <li>
            <EventIcon name="signal" size={26} />
            <strong>Trusting the phone</strong>
            <p>Cell service is patchy in the gateway towns and mostly gone past the entrance stations, and GPS sends people onto closed roads. Download offline maps before you leave town and follow the signs. <a href="/articles/cell-service-in-yosemite">Cell service in Yosemite</a> has the carrier-by-carrier truth.</p>
          </li>
          <li>
            <EventIcon name="fuel" size={26} />
            <strong>Arriving on a quarter tank</strong>
            <p>There is no gas in Yosemite Valley. The in-park pumps are at Crane Flat and Wawona; fill up in the gateway town.</p>
          </li>
          <li>
            <EventIcon name="food" size={26} />
            <strong>Leaving food in the car</strong>
            <p>If it stays in the car at all: out of sight, windows closed, daylight only, never overnight. Bears open cars, and the citation runs up to $5,000. <a href="/articles/yosemite-bears-safety-guide">The bear guide</a> covers the rest.</p>
          </li>
          <li>
            <EventIcon name="snow" size={26} />
            <strong>Planning Glacier Point or Tioga in April</strong>
            <p>Both roads close for the winter and reopen when plowing finishes, usually late May into June. Check the <a href="/now">Park Bulletin</a> for the current status before you build a day around either.</p>
          </li>
          <li>
            <EventIcon name="car" size={26} />
            <strong>Doing too much</strong>
            <p>Three things well beats seven things from the driver's seat. This is the whole argument of the essay above, and it spoils more first trips than all the other mistakes together.</p>
          </li>
        </ul>
      </section>

      {/* Questions, where to start, and sources. */}
      <section className="ff-band" id="sec-10-common-questions" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">QUESTIONS</p>
              <h2>Common questions</h2>
              <div className="ft-start">
                <h3>If you want a place to start</h3>
                <ol>
                  <li><a href="/articles/yosemite-without-reservations-2026">What changed in 2026</a> is the most important context for any first trip this year.</li>
                  <li><a href="/stay">Decide where you are sleeping</a> before anything else, because it shapes every day of the trip and the good options go first.</li>
                  <li>Once you know roughly how long you have, <a href="/articles/yosemite-in-one-or-two-days">one or two days in Yosemite</a> turns the strategy into an itinerary.</li>
                  <li>The site's <a href="/map">map</a> lays out where everything sits while you decide.</li>
                  <li><a href="/articles/pack-your-car-for-yosemite">Pack the car</a> like the trip depends on it, because it does.</li>
                </ol>
                <p className="ft-signoff">Let's plan a good one.</p>
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
          <div className="ft-sources">
            <h3>Sources</h3>
            <p className="ft-sources__note">Dated facts read October 4, 2026.</p>
            <ul>
              <li><a href="https://www.nps.gov/yose/planyourvisit/permitsandreservations.htm" target="_blank" rel="noopener noreferrer">Permits and reservations, NPS Yosemite</a> ("A reservation is not required to enter Yosemite in 2026")</li>
              <li><a href="https://www.nps.gov/yose/planyourvisit/fees.htm" target="_blank" rel="noopener noreferrer">Fees and passes, NPS Yosemite</a> (entrance passes, the nonresident fee, cards only)</li>
              <li><a href="https://www.nps.gov/yose/planyourvisit/lodging.htm" target="_blank" rel="noopener noreferrer">Lodging, NPS Yosemite</a> (366 days in advance)</li>
              <li><a href="https://www.nps.gov/yose/planyourvisit/camping.htm" target="_blank" rel="noopener noreferrer">Camping, NPS Yosemite</a> (the 15th-of-the-month release)</li>
              <li><a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">Yosemite Guide, September 23 to November 24, 2026, NPS</a> (the Mist Trail repair closure)</li>
              <li><a href="https://www.nps.gov/yose/planyourvisit/tiogaopen.htm" target="_blank" rel="noopener noreferrer">Tioga Road opening dates</a> and <a href="https://www.nps.gov/yose/planyourvisit/glacierpoint.htm" target="_blank" rel="noopener noreferrer">Glacier Point</a>, NPS Yosemite (the 2026 openings)</li>
              <li><a href="https://www.nps.gov/yose/planyourvisit/hdpermits.htm" target="_blank" rel="noopener noreferrer">Half Dome permits, NPS Yosemite</a></li>
            </ul>
          </div>
          <AffiliateNote />
        </div>
      </section>
    </div>
  );
};
