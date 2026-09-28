/* global React, NatureNotesFilm, EventIcon, ResponsiveImage */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// The September 2026 feature redesign. This body renders on the /firefall
// system rather than in the 680px reading column: its catalog entry carries a
// `feature` block (data.js), so page-article.jsx draws the full-width photo
// cover and hands this body the page's full width, and every section below
// sits on the design's container (`hp-wrap`), alternating paper and the
// `ff-band` tint. The page-level `ec-*` rules are the `.ec-feature` layer in
// styles.css.
//
// Three rules hold it up.
//   1. Every paragraph the article carried before the redesign is still here,
//      regrouped; nothing was trimmed on the theory that a picture says it.
//      Every figure, label and caption restates a sentence in this body, so
//      the graphics add no fact of their own.
//   2. The section ids are the anchors the old layout generated at runtime
//      (`sec-<h2 index>-<slug40>`), pinned by hand so the deep links search
//      already carries keep landing on the same content.
//   3. The map is the National Park Service's own Valley map, cropped
//      (img/nps-el-capitan-map.jpg, 760 x 380, from the 2560 x 1000
//      img/nps-yosemite-valley-map.jpg at +600+440), with the two markers
//      drawn on top in the crop's pixel space. The bridge marker sits where
//      the NPS map draws the crossover crossing the Merced; the meadow marker
//      sits on Northside Drive just west of it, where the Yosemite Guide
//      places the meadow ("west side of the El Capitan bridge").
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["watching-climbers-el-capitan"] = function WatchingClimbersElCapitanBody() {
  const TOC = [
    ["#sec-0-the-wall", "The wall"],
    ["#sec-1-where-to-watch", "Where to watch"],
    ["#sec-2-what-you-re-actually-looking-at", "What you're seeing"],
    ["#sec-3-how-this-rock-got-famous", "Four ascents"],
    ["#sec-4-ask-a-climber", "Ask a Climber"],
    ["#sec-5-camp-4-the-clubhouse", "Camp 4"],
    ["#sec-6-when-the-show-runs", "When to go"],
    ["#sec-7-spectator-etiquette", "Etiquette"],
    ["#sec-8-the-raven-and-the-human", "The raven"],
    ["#el-capitan-questions", "Questions"],
  ];

  const FAQ = [
    ["Where is the best place to watch climbers on El Capitan?", "El Capitan Meadow, on Northside Drive directly beneath the wall, is the classic spot: pull fully off the road into the marked turnouts and bring binoculars. El Capitan Bridge offers a second, more oblique angle with the Merced River in the foreground. Both are flat, roadside viewpoints that require no hiking."],
    ["What is the Ask a Climber program in Yosemite?", "Ask a Climber is a free park program where climbing rangers set up spotting scopes at El Capitan Meadow or El Capitan Bridge in season, point out parties on the wall, and answer questions about how big-wall climbing works. The exact schedule varies by year, so check the Yosemite Guide for current times."],
    ["How long does it take to climb El Capitan?", "Most parties spend several days on multi-day routes like The Nose, hauling bags of water, food, and gear up the wall and sleeping on ledges or hanging portaledges. The first ascent of The Nose in 1958 took Warren Harding's team 47 days of climbing spread across a year and a half; in 2018 Alex Honnold and Tommy Caldwell climbed the same route in under two hours."],
    ["When is the best time of year to see climbers on El Capitan?", "Spring (roughly April through early June) and fall (September through October). The wall faces the sun and bakes in midsummer, so few parties climb in July and August, and winter storms make the wall genuinely hazardous."],
    ["Why are there lights on El Capitan at night?", "Those are climbers' headlamps. Parties on multi-day routes sleep on the wall, on natural ledges or hanging portaledges, and at dusk their headlamps come on as they cook dinner and sort gear. Watching the wall light up from El Capitan Meadow is one of the best free evening shows in the park. Never shine a light at climbers from below; it ruins their night vision while they are managing ropes in the dark."],
    ["Why is Camp 4 in Yosemite famous?", "Camp 4, the walk-in campground below the Valley's north wall, was the base camp of Yosemite climbing through its golden age, where the techniques and gear of modern big-wall climbing were worked out. It was added to the National Register of Historic Places in 2003."],
  ];

  // ── The scale: a red dot on a wall with nothing to measure it by ──────────
  // "A human being on El Capitan is smaller than the period at the end of this
  // sentence held at arm's length. Through binoculars, a red dot resolves into
  // a person." The wall is a generic granite face, not a drawing of the route.
  function ScaleFigure() {
    return (
      <svg className="ec-scale__svg" viewBox="0 0 520 560" role="img"
        aria-label="A 3,000-foot granite wall with a single red dot high on the face. Unaided, the dot is all you can see. Through binoculars, shown in a circle, it resolves into a climber on a rope, with a crack system beside them.">
        <defs>
          <linearGradient id="ec-granite" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d9d4c6" />
            <stop offset="1" stopColor="#a9a597" />
          </linearGradient>
          <clipPath id="ec-lens"><circle cx="378" cy="176" r="104" /></clipPath>
        </defs>
        {/* The wall and the Valley floor. */}
        <path d="M70 520 L96 300 C 104 190, 132 96, 180 48 L 214 36 C 250 40, 282 60, 300 92 L 332 196 L 356 360 L 372 520 Z" fill="url(#ec-granite)" />
        <path d="M180 48 C 188 150, 196 300, 210 520" className="ec-scale__crack" />
        <path d="M250 60 C 262 180, 276 320, 300 520" className="ec-scale__crack" />
        <path d="M40 520 H 480" className="ec-scale__floor" />
        {/* The ruler. */}
        <path d="M40 40 V 520 M34 40 H 46 M34 520 H 46" className="ec-scale__rule" />
        <text x="30" y="288" transform="rotate(-90 30 288)" textAnchor="middle" className="ec-scale__rulelabel">ABOUT 3,000 FEET</text>
        {/* The climber, unaided. */}
        <circle cx="222" cy="190" r="2.2" className="ec-scale__dot" />
        <path d="M226 188 L 290 170" className="ec-scale__lead" />
        {/* Through binoculars. */}
        <circle cx="378" cy="176" r="108" className="ec-scale__lensring" />
        <g clipPath="url(#ec-lens)">
          <rect x="270" y="68" width="216" height="216" fill="#c9c4b5" />
          <path d="M318 68 C 330 130, 336 200, 350 290" className="ec-scale__bigcrack" />
          <path d="M300 250 L 470 236" className="ec-scale__ledge" />
          <path d="M352 290 L 356 206" className="ec-scale__rope" />
          <circle cx="360" cy="150" r="9" className="ec-scale__person" />
          <path d="M360 160 L 358 196 M358 176 L 342 158 M358 172 L 378 160 M358 196 L 346 222 M358 196 L 372 220" className="ec-scale__limbs" />
          <path d="M356 206 L 358 184" className="ec-scale__rope" />
        </g>
        <text x="378" y="316" textAnchor="middle" className="ec-scale__label">Through binoculars: a person</text>
        <text x="378" y="336" textAnchor="middle" className="ec-scale__note">and the whole wall recalibrates</text>
        <circle cx="382" cy="414" r="4" className="ec-scale__dot" />
        <text x="394" y="420" className="ec-scale__label">Unaided</text>
        <text x="378" y="442" className="ec-scale__note">a red dot on the face,</text>
        <text x="378" y="460" className="ec-scale__note">if you find it at all</text>
      </svg>
    );
  }

  // ── The crop of the NPS Valley map, with the two viewpoints ───────────────
  function WhereMap() {
    return (
      <figure className="ec-map">
        <div className="ec-map__frame">
          <img src="/img/nps-el-capitan-map.jpg" width="760" height="380" loading="lazy" decoding="async"
            alt="National Park Service map of the west end of Yosemite Valley: El Capitan above Northside Drive, with El Capitan Meadow marked on Northside Drive just west of El Capitan Bridge, and the bridge marked where the crossover road crosses the Merced River." />
          <svg viewBox="0 0 760 380" aria-hidden="true" focusable="false">
            <path d="M272 266 L 250 236" className="ec-map__lead" />
            <circle cx="250" cy="236" r="14" className="ec-map__pin" />
            <text x="250" y="241" textAnchor="middle" className="ec-map__num">1</text>
            <path d="M309 274 L 336 248" className="ec-map__lead" />
            <circle cx="336" cy="248" r="14" className="ec-map__pin" />
            <text x="336" y="253" textAnchor="middle" className="ec-map__num">2</text>
          </svg>
        </div>
        <figcaption>
          <span><b>1</b> El Capitan Meadow</span>
          <span><b>2</b> El Capitan Bridge</span>
          <span>Northside Drive runs one way, west. Map: National Park Service (public domain), cropped.</span>
        </figcaption>
      </figure>
    );
  }

  // ── A party on the wall ────────────────────────────────────────────────────
  // The logistics train the binoculars pick out, labelled in the body's words.
  function PartyFigure() {
    return (
      <svg className="ec-party__svg" viewBox="0 0 490 600" role="img"
        aria-label="A diagram of a climbing party on a big wall. At the top, the leader inches up a crack system. Below, the belayer pays out rope from an anchor, with the haul bag, a heavy duffel of water, food and gear, hanging beside the anchor to be winched up pitch by pitch. Lower on the wall, a portaledge, a collapsible cot, hangs from a single anchor point against the bare face.">
        <g transform="translate(-120 0)">
          <rect x="150" y="0" width="200" height="600" rx="2" className="ec-party__rock" />
          <path d="M232 0 C 238 120, 228 220, 240 330 C 248 420, 236 520, 244 600" className="ec-party__crack" />
          {/* The leader. */}
          <path d="M240 212 L 240 90" className="ec-party__rope" />
          <circle cx="244" cy="78" r="8" className="ec-party__body" />
          <path d="M244 86 L 242 116 M242 98 L 230 84 M242 96 L 256 104 M242 116 L 232 136 M242 116 L 254 134" className="ec-party__limbs" />
          {/* The anchor, the belayer and the haul bag. */}
          <circle cx="240" cy="222" r="5" className="ec-party__anchor" />
          <circle cx="262" cy="236" r="7" className="ec-party__body" />
          <path d="M262 243 L 262 268 M262 252 L 246 232 M262 268 L 254 288 M262 268 L 272 286" className="ec-party__limbs" />
          <path d="M240 227 L 212 262" className="ec-party__rope" />
          <path d="M196 262 h 32 l 4 58 c 0 10 -40 10 -40 0 z" className="ec-party__pig" />
          {/* A portaledge, lower on the wall. */}
          <circle cx="236" cy="420" r="5" className="ec-party__anchor" />
          <path d="M236 425 L 196 470 M236 425 L 300 470 M236 425 L 214 470 M236 425 L 282 470" className="ec-party__sling" />
          <rect x="192" y="468" width="112" height="12" rx="2" className="ec-party__ledge" />
        </g>
        {/* Labels, in the body's words. */}
        <path d="M136 80 H 240" className="ec-party__lead" />
        <text x="250" y="86" className="ec-party__label">The leader</text>
        <text x="250" y="108" className="ec-party__note">inching up a crack system</text>
        <path d="M152 240 H 240" className="ec-party__lead" />
        <text x="250" y="236" className="ec-party__label">The belayer</text>
        <text x="250" y="258" className="ec-party__note">paying out rope</text>
        <text x="250" y="278" className="ec-party__note">from an anchor</text>
        <path d="M120 312 H 240" className="ec-party__lead" />
        <text x="250" y="318" className="ec-party__label">The haul bag</text>
        <text x="250" y="340" className="ec-party__note">water, food and gear,</text>
        <text x="250" y="360" className="ec-party__note">winched up pitch by pitch.</text>
        <text x="250" y="380" className="ec-party__note">Climbers call it a pig.</text>
        <path d="M188 474 H 240" className="ec-party__lead" />
        <text x="250" y="480" className="ec-party__label">A portaledge</text>
        <text x="250" y="502" className="ec-party__note">a collapsible cot, hung</text>
        <text x="250" y="522" className="ec-party__note">from a single anchor point</text>
      </svg>
    );
  }

  // ── The season: twelve months, the two windows ─────────────────────────────
  // Straight from "When the show runs": April to early June and September to
  // October are reliable, July and August thin, winter worse. The months
  // outside both are marked as outside the windows, not as empty.
  const MONTHS = [
    ["Jan", "off"], ["Feb", "off"], ["Mar", "off"], ["Apr", "on"], ["May", "on"], ["Jun", "part"],
    ["Jul", "thin"], ["Aug", "thin"], ["Sep", "on"], ["Oct", "on"], ["Nov", "off"], ["Dec", "off"],
  ];

  // ── Six clocks on the same 3,000 feet ─────────────────────────────────────
  // Every duration is the body's: a raven clears the rim in about a minute,
  // the 2018 speed record on The Nose was under two hours, Freerider free solo
  // under four, a party takes three days ("the humans will take three days"),
  // the Dawn Wall 19 days on the wall, the first ascent 47 days of climbing.
  // Log scale, labelled as one: on a straight line the raven is invisible.
  const CLOCKS = [
    ["A raven, riding the updraft", "about a minute", 1],
    ["The Nose speed record, 2018", "under two hours", 120],
    ["Freerider, free solo, 2017", "under four hours", 240],
    ["A party on The Nose", "about three days", 3 * 1440],
    ["The Dawn Wall, 2015", "19 days on the wall", 19 * 1440],
    ["The first ascent, 1958", "47 days of climbing", 47 * 1440],
  ];
  function ClocksFigure() {
    const W = 620, L = 196, R = 16, row = 50, top = 34, H = top + CLOCKS.length * row + 40;
    const lo = Math.log10(0.5), hi = Math.log10(47 * 1440 * 1.15);
    const x = (min) => L + ((Math.log10(min) - lo) / (hi - lo)) * (W - L - R);
    const ticks = [[1, "1 min"], [60, "1 hour"], [1440, "1 day"], [10080, "1 week"]];
    return (
      <svg className="ec-clocks__svg" viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="Time taken to cover the same 3,000 feet of El Capitan, on a logarithmic scale: a raven, about a minute; the 2018 speed record on The Nose, under two hours; the 2017 free solo of Freerider, under four hours; a party on The Nose, about three days; the 2015 Dawn Wall free climb, 19 days on the wall; the 1958 first ascent, 47 days of climbing.">
        {ticks.map(([m, t]) => (
          <g key={t}>
            <line x1={x(m)} x2={x(m)} y1={top - 12} y2={H - 30} className="ec-clocks__grid" />
            <text x={x(m)} y={H - 12} textAnchor="middle" className="ec-clocks__tick">{t}</text>
          </g>
        ))}
        {CLOCKS.map(([name, label, min], i) => {
          const y = top + i * row;
          const end = x(min);
          // Long bars carry their value inside, in paper; short ones beside.
          const inside = end - L > 170;
          return (
            <g key={name}>
              <text x={L - 14} y={y + 15} textAnchor="end" className="ec-clocks__name">{name}</text>
              <rect x={L} y={y} width={Math.max(4, end - L)} height="22" rx="2" className={i === 0 ? "ec-clocks__bar ec-clocks__bar--raven" : "ec-clocks__bar"} />
              <text x={inside ? end - 10 : end + 8} y={y + 16} textAnchor={inside ? "end" : "start"} className={inside ? "ec-clocks__val ec-clocks__val--in" : "ec-clocks__val"}>{label}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div className="ec-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="mountain" /><dt>The wall</dt><dd>About 3,000 vertical feet</dd></div>
          <div><EventIcon name="pin" /><dt>Where to stand</dt><dd>El Capitan Meadow, Northside Drive</dd></div>
          <div><EventIcon name="calendar" /><dt>The season</dt><dd>April to early June, September and October</dd></div>
          <div><EventIcon name="eye" /><dt>What to bring</dt><dd>Binoculars, the one thing that matters</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the story, and the whole page in four lines beside it. */}
      <section className="hp-wrap hp-section ec-open">
        <div className="ff-split">
          <div className="ec-prose">
            <p className="dropcap">
              The first time I really understood <strong>El Capitan</strong>, I wasn't looking at the rock. It was a September evening in my second season here, and I had stopped in El Capitan Meadow to watch the last light leave the Valley. As the wall went from gold to gray to black, small points of light began to appear on it, scattered across the face like early stars. Headlamps. There were people up there, a dozen or more, cooking dinner and settling into their hanging camps two thousand feet off the deck, and they would still be there in the morning, and the morning after that. I had driven past the wall a hundred times by then without noticing them.
            </p>

            <p>Twenty seasons later, I still stop. Watching climbers on El Capitan is the best free spectator sport in the National Park system, and most visitors drive past it without knowing the show is on.</p>

            <p>This is how to watch it: where to stand, what you're seeing, the history behind the rock, and how to behave as a spectator.</p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="eye" /> The short version</p>
            <ul>
              <li>Stand in El Capitan Meadow, on Northside Drive beneath the wall.</li>
              <li>Bring binoculars. Without them you cannot pick out the climbers.</li>
              <li>Come in spring or fall, and stay for the headlamps.</li>
              <li>Park fully off the road. Never shine a light at the wall.</li>
            </ul>
            <a className="ec-short__link" href="/map?trip=el-capitan-meadow,el-capitan-bridge">Both viewpoints on the Valley map ↗</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="sec-0-the-wall" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">THE WALL</p>
            <h2>Three thousand feet, and nothing to measure it by</h2>
            <div className="ec-prose">
              <p>
                El Capitan rises about <strong>3,000 vertical feet</strong> from the Valley floor, a single unbroken sweep of granite, the largest exposed granite monolith of its kind. The numbers do little for your sense of scale, because there is nothing on the face to measure against: no trees, no buildings, only rock and sky.
              </p>

              <p>
                Finding a climber on it fixes that. Unaided, you almost certainly can't; a human being on El Capitan is smaller than the period at the end of this sentence held at arm's length. Through binoculars, a red dot resolves into a person, and then the person recalibrates the whole wall. The ledge that looked like a scratch is a feature the size of a parking lot. The crack system that looked like a hairline is wide enough to swallow a body.
              </p>
            </div>
            <NatureNotesFilm id="granite" title="Granite" youtubeId="Y5RQp77uVPA" episode={20}
              note="What the wall is made of: the cliffs and domes are one body of rock, cooled underground and exhumed." location="article" />
          </div>
          <figure className="ec-scale">
            <ScaleFigure />
            <figcaption>A drawing, not to scale: at the real scale the dot would be too small to print.</figcaption>
          </figure>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-1-where-to-watch" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">WHERE TO WATCH</p>
            <h2>El Capitan Meadow, or the bridge</h2>
            <div className="ec-prose">
              <p>
                <strong>El Capitan Meadow</strong>, on Northside Drive directly beneath the wall, is the classic gallery. The meadow gives you the full face at a viewing angle steep enough to feel it and far enough back to see all of it. Pull <strong>fully off the road</strong> into the marked turnouts; Northside Drive is a busy one-way corridor, and a half-parked car here is both a hazard and a citation. Bring binoculars. They are the one piece of equipment that matters; without them you cannot pick out the climbers.
              </p>

              <p>
                The second angle is from <strong>El Capitan Bridge</strong>, where the road crosses the Merced. The bridge view is more oblique and adds the river in the foreground, and in spring it puts the wall's reflection at your feet. Photographers tend to prefer it; spectators tracking a specific party tend to prefer the meadow. Both are flat and roadside, which puts El Capitan viewing firmly on the short list of <a href="/articles/yosemite-for-non-hikers">great Yosemite experiences that require no hiking at all</a>. Both spots are pinned on <a href="/map">our interactive Valley map</a> if you're building a driving day around them.
              </p>
            </div>
          </div>
          <WhereMap />
        </div>

        <div className="ec-spots">
          <div className="ec-spot">
            <p className="ec-spot__num">1</p>
            <h3>El Capitan Meadow</h3>
            <p className="ec-spot__line">The classic gallery, directly beneath the wall.</p>
            <dl>
              <div><dt>The view</dt><dd>The full face, steep enough to feel it, far enough back to see all of it</dd></div>
              <div><dt>Best for</dt><dd>Tracking a specific party</dd></div>
              <div><dt>Parking</dt><dd>The marked turnouts on Northside Drive, fully off the road</dd></div>
              <div><dt>The walk</dt><dd>None: flat and roadside</dd></div>
            </dl>
          </div>
          <div className="ec-spot">
            <p className="ec-spot__num">2</p>
            <h3>El Capitan Bridge</h3>
            <p className="ec-spot__line">The second angle, where the road crosses the Merced.</p>
            <dl>
              <div><dt>The view</dt><dd>More oblique, with the river in the foreground</dd></div>
              <div><dt>Best for</dt><dd>Photographers, and the wall's reflection in spring</dd></div>
              <div><dt>The walk</dt><dd>None: flat and roadside</dd></div>
            </dl>
          </div>
          <div className="ec-spot ec-spot--bring">
            <EventIcon name="eye" size={28} />
            <h3>Binoculars</h3>
            <p className="ec-spot__line">The one piece of equipment that matters.</p>
            <p className="ec-spot__text">Without them you cannot pick out the climbers. Through them, a red dot on the face resolves into a person.</p>
          </div>
        </div>
      </section>

      <section id="sec-2-what-you-re-actually-looking-at" tabIndex={-1}>
        <div className="ff-band">
          <div className="hp-wrap hp-section ff-split">
            <div>
              <p className="hp-eyebrow">WHAT YOU'RE ACTUALLY LOOKING AT</p>
              <h2>A small vertical expedition</h2>
              <div className="ec-prose">
                <p>
                  Most parties on El Capitan are climbing multi-day routes, and the most famous of these is <strong>The Nose</strong>, the great prow where the southwest and southeast faces meet. A typical ascent takes several days. The climbers you're watching are running a small vertical expedition. Through binoculars you can pick out the whole logistics train: the leader inching up a crack system, the belayer paying out rope from an anchor, and below them the <strong>haul bags</strong>, heavy duffels of water, food, and gear that get winched up the wall pitch by pitch and that climbers, with reason, call pigs.
                </p>

                <p>
                  At night the climbers sleep where they stop, on natural ledges if the route offers one, and otherwise on <strong>portaledges</strong>: collapsible cots that hang from a single anchor point against the bare face. Through a spotting scope in the late afternoon you can watch a team assemble one.
                </p>
              </div>
            </div>
            <figure className="ec-party">
              <figcaption>What the binoculars pick out</figcaption>
              <PartyFigure />
              <p className="ff-note">A diagram, not to scale.</p>
            </figure>
          </div>
        </div>

        {/* The dusk plate: the photograph the opening paragraph describes. */}
        <div className="ec-dusk">
          <ResponsiveImage image="img/el-capitan-headlamps-night.jpg" className="ec-dusk__img" sizes="100vw" style={{ aspectRatio: "1600 / 1067" }}
            alt="El Capitan at twilight under a violet sky, with climbers' headlamps showing as points of light across the face" />
          <div className="hp-wrap ec-dusk__copy">
            <p className="hp-eyebrow">AT DUSK</p>
            <p className="ec-dusk__text">
              At dusk, the headlamps come on, and the dark wall becomes a constellation of climbers cooking, sorting gear, and settling in. It is one of the best free evening shows in the park, and it pairs naturally with the Valley's other after-dark spectacle; on a moonless night you can watch the wall's lights come out and then <a href="/articles/yosemite-stargazing-where-to-look-up">stay for the real stars</a>.
            </p>
            <blockquote className="ec-dusk__quote">The wall at dusk is a neighborhood turning its lights on, hung sideways in the sky.</blockquote>
          </div>
          <p className="ff-cover__credit">Photo: C-M / Wikimedia Commons (CC BY-SA 4.0)</p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-3-how-this-rock-got-famous" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">HOW THIS ROCK GOT FAMOUS</p>
            <h2>Four ascents, sixty years</h2>
            <p className="ff-lede">
              Four ascents account for most of the rock's fame.
            </p>
          </div>
          <figure className="ec-frost">
            <ResponsiveImage image="img/el-capitan-climbers-on-the-nose.jpg" style={{ aspectRatio: "1600 / 1059" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="Black and white photograph looking down from high on The Nose: two climbers at a ledge camp on the granite, ropes running past them, the Valley forest far below" />
            <figcaption>Royal Robbins and Chuck Pratt at Camp VI, day six of the second ascent of The Nose, September 1960, two years after Harding. Photo: Tom Frost / Wikimedia Commons (CC BY 3.0)</figcaption>
          </figure>
        </div>
        <ol className="ec-ascents">
          <li>
            <span className="ec-ascents__year">1958</span>
            <span className="ec-ascents__time">47 days</span>
            <p>
              Warren Harding's team makes the first ascent of The Nose, an effort totaling <strong>47 days</strong> of climbing, spread across a year and a half of sieging the wall with fixed ropes. At the time, the idea that the face could be climbed at all was not widely accepted. The final push ended with Harding drilling bolts through the night to top out. Everything that follows starts here.
            </p>
          </li>
          <li>
            <span className="ec-ascents__year">2015</span>
            <span className="ec-ascents__time">19 days</span>
            <p>
              Tommy Caldwell and Kevin Jorgeson complete the first free climb of the <strong>Dawn Wall</strong>, ascending one of the blankest sections of the face using ropes only for safety, never for progress, over 19 days of living on the wall. The attempt drew a global audience; for a couple of weeks in January, the crowd in El Capitan Meadow included network news crews.
            </p>
          </li>
          <li>
            <span className="ec-ascents__year">2017</span>
            <span className="ec-ascents__time">Under 4 hours</span>
            <p>
              Alex Honnold free solos <strong>Freerider</strong>: no rope, no partner, no protection, roughly 3,000 feet of granite in under four hours. The ascent was filmed and released as <strong>Free Solo</strong>, which won the Academy Award for Best Documentary Feature. It remains the most widely seen piece of media ever made about this wall, and it is why a meaningful fraction of the people standing in the meadow now know what a crimp is.
            </p>
          </li>
          <li>
            <span className="ec-ascents__year">2018</span>
            <span className="ec-ascents__time">Under 2 hours</span>
            <p>
              Honnold and Caldwell, roped this time, set a speed record on The Nose of <strong>under two hours</strong>. Harding's 47 days to less than two hours, on the same line of weakness up the same rock, sums up sixty years of change in American climbing.
            </p>
          </li>
        </ol>
      </section>

      <section className="ff-band" id="sec-4-ask-a-climber" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">ASK A CLIMBER</p>
            <h2>A ranger, a spotting scope, and every question you have</h2>
            <div className="ec-prose">
              <p>
                In season, the park runs a program built precisely for the person standing in the meadow squinting upward: <strong>Ask a Climber</strong>. Climbing rangers set up <strong>spotting scopes</strong> at El Capitan Meadow or El Capitan Bridge and spend the afternoon pointing out parties on the wall, explaining what the climbers are doing, and answering everything from "how do they go to the bathroom" (there is a container system, and packing it out is mandatory) to real questions about route history. Through the scopes, a red dot becomes a recognizable person.
              </p>

              <p>
                The exact schedule varies by year and staffing, so <strong>check the Yosemite Guide</strong>, the park's printed and online program listing, for current times. It belongs on the same short list as the evening amphitheater talks in our <a href="/articles/yosemite-ranger-programs">guide to the park's free ranger programs</a>: no ticket, no reservation, and better than most things people pay for.
              </p>
            </div>
          </div>
          <div className="ec-program">
            <article className="ff-inpark">
              <p className="hp-eyebrow">A FREE PARK PROGRAM · IN SEASON</p>
              <h3>Ask a Climber</h3>
              <dl>
                <div><dt>Where</dt><dd>El Capitan Meadow or El Capitan Bridge</dd></div>
                <div><dt>Who</dt><dd>The park's climbing rangers</dd></div>
                <div><dt>What</dt><dd>Spotting scopes on the wall, all afternoon</dd></div>
                <div><dt>Cost</dt><dd>Free. No ticket, no reservation</dd></div>
                <div><dt>Times</dt><dd>Vary by year and staffing</dd></div>
              </dl>
              <a className="ff-ghost" href="/now">This edition's times, on the Park Bulletin</a>
              <p className="ff-note">The Park Bulletin carries the current Yosemite Guide's program schedule, day by day. The park's own listing: <a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">the Yosemite Guide</a>.</p>
            </article>
            <p className="ec-asked">
              <span>The question everyone asks</span>
              How do they go to the bathroom? There is a container system, and packing it out is mandatory.
            </p>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-5-camp-4-the-clubhouse" tabIndex={-1}>
        <div className="ff-split ec-camp4">
          <figure className="ec-camp4__photo">
            <ResponsiveImage image="img/camp-4-kiosk.jpg" style={{ aspectRatio: "1600 / 1561" }} sizes="(max-width: 880px) calc(100vw - 40px), 600px"
              alt="The Camp 4 kiosk and its notice board" />
            <figcaption>Photo: Almonroth / Wikimedia Commons (CC BY-SA 3.0)</figcaption>
          </figure>
          <div>
            <p className="hp-eyebrow">CAMP 4, THE CLUBHOUSE</p>
            <h2>Where modern big-wall climbing was worked out</h2>
            <div className="ec-prose">
              <p>
                The culture you're watching on the wall has a home address. <strong>Camp 4</strong>, the walk-in campground below the Valley's north wall, was the base camp of Yosemite climbing through its golden age, the gravel lot where the techniques, the gear, and the arguments that produced modern big-wall climbing were worked out between ascents. In 2003 it was added to the <strong>National Register of Historic Places</strong>, a designation usually reserved for battlefields and courthouses, granted here to a campground on the strength of what got invented in it. The boulders at its edge still have climbers on them most afternoons. If you want to stay there, or anywhere else in the park, see our <a href="/articles/yosemite-camping-complete-guide">complete camping guide</a>; Camp 4 operates on its own reservation system and fills instantly.
              </p>
            </div>
            <dl className="ec-camp4__facts">
              <div><dt>Listed</dt><dd>National Register of Historic Places, 2003</dd></div>
              <div><dt>Booking</dt><dd>Its own reservation system. Fills instantly</dd></div>
              <div><dt>Afternoons</dt><dd>Climbers on the boulders at its edge</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="ff-band" id="sec-6-when-the-show-runs" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">WHEN THE SHOW RUNS</p>
            <h2>Spring and fall, and stay until dark</h2>
            <div className="ec-prose">
              <p>
                Climbing on El Capitan is a <strong>spring and fall</strong> sport. The wall faces the sun, and in midsummer the granite bakes; the sustained heat makes multi-day ascents somewhere between miserable and dangerous, so July and August afternoons are thin. Winter is worse: storms arrive fast, and a wall that sheds water and ice onto climbers who cannot retreat quickly is a hazardous place. So the reliable spectating windows are roughly <strong>April through early June</strong> and <strong>September through October</strong>, when the meadow fills with tourists looking up and the wall fills with parties. You may see climbers in other months, but those are the reliable ones.
              </p>
            </div>
            <figure className="ec-months">
              <figcaption>The spectating year</figcaption>
              <ol>
                {MONTHS.map(([m, s]) => <li key={m} className={"is-" + s}><span>{m}</span></li>)}
              </ol>
              <ul className="ec-months__key">
                <li className="is-on">Reliable</li>
                <li className="is-part">Early June only</li>
                <li className="is-thin">Thin: the granite bakes</li>
                <li className="is-off">Outside the windows; winter is worse</li>
              </ul>
            </figure>
          </div>
          <div>
            <h3 className="ec-evening__head">An evening in the meadow</h3>
            <ol className="ff-hours">
              <li><span>Afternoon</span><p>In season, climbing rangers at the scopes, pointing out parties on the wall.</p></li>
              <li><span>Late afternoon</span><p>Through a spotting scope, watch a team assemble a portaledge.</p></li>
              <li><span>Sunset</span><p>The wall goes from gold to gray to black.</p></li>
              <li className="is-glow"><span>Dusk</span><p>The headlamps come on, scattered across the face like early stars.</p></li>
              <li><span>A moonless night</span><p>Stay for the real stars.</p></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-7-spectator-etiquette" tabIndex={-1}>
        <p className="hp-eyebrow">SPECTATOR ETIQUETTE</p>
        <h2>Three rules, all easy</h2>
        <ul className="ff-rules ec-rules">
          <li>
            <EventIcon name="car" size={26} />
            <strong>Park fully off the road.</strong>
            <p>Covered above, worth repeating. The turnouts along Northside Drive exist for exactly this.</p>
          </li>
          <li>
            <EventIcon name="no" size={26} />
            <strong>Stay off the meadow where it's signed.</strong>
            <p>El Capitan Meadow's turf is fragile and has been loved half to death; the park has restoration areas fenced or signed, and the viewing is exactly as good from the roadside and the designated paths.</p>
          </li>
          <li>
            <EventIcon name="alert" size={26} />
            <strong>Never shine a light at the wall after dark.</strong>
            <p>A powerful flashlight or car spotlight aimed at climbers ruins their night vision at the precise moment they are managing ropes and anchors in the dark, and dazzling someone two thousand feet up a cliff is a hazard.</p>
          </li>
        </ul>
      </section>

      <section className="ff-band" id="sec-8-the-raven-and-the-human" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">THE RAVEN AND THE HUMAN</p>
            <h2>The naturalist's case for an evening in the meadow</h2>
            <div className="ec-prose">
              <p>
                Here is the naturalist's case for spending an evening in that meadow. Watch a party high on The Nose for a while, moving at their patient, invisible pace, and then wait for a raven to pass. It will leave the forest by the river, ride the updraft along the face, and clear the summit rim in about a minute, without a wingbeat that looks like effort. The humans will take three days to cover the same ground, hauling their water behind them.
              </p>

              <p>
                The comparison is the point. Nothing else in the Valley shows what 3,000 feet of granite means, because nothing else puts a human body on it for scale and shows the days of work that body needs to climb it.
              </p>

              <p className="ec-signoff">That's the show. Bring binoculars, stay for the headlamps.</p>
            </div>
          </div>
          <figure className="ec-clocks">
            <figcaption>Six clocks on the same 3,000 feet</figcaption>
            <ClocksFigure />
            <p className="ff-note">Logarithmic scale: each gridline is a bigger unit of time, which is the only way the raven's minute and Harding's 47 days fit on one chart.</p>
          </figure>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="el-capitan-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>El Capitan questions, answered</h2>
            <div className="ec-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/climbing.htm" target="_blank" rel="noopener noreferrer">Climbing, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/camp4.htm" target="_blank" rel="noopener noreferrer">Camp 4, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">The Yosemite Guide, NPS Yosemite</a></li>
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
      </section>
    </div>
  );
};
