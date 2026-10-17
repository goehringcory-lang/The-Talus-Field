/* global React, EventIcon, ResponsiveImage, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// The October 2026 feature redesign, on the /firefall system like the El
// Capitan piece: the catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's full width, and every section below sits on the design's container
// (`hp-wrap`), alternating paper and the `ff-band` tint. The page-level
// `mt-*` rules are the `.mt-feature` layer in styles.css.
//
// Three rules hold it up.
//   1. Every paragraph the article carried before the redesign is still here,
//      in the same order; nothing was trimmed on the theory that a picture
//      says it. Every card, figure, label and caption restates a sentence in
//      this body, so the graphics add no fact of their own.
//   2. The section ids are the anchors the old layout generated at runtime
//      (`sec-<h2 index>-<slug40>`), pinned by hand so the deep links search
//      already carries keep landing on the same content.
//   3. The map is the National Park Service's own Valley map, cropped
//      (img/nps-mist-trail-map.jpg, 700 x 380, from the 2560 x 1000
//      img/nps-yosemite-valley-map.jpg at +1860+430), with the five markers
//      and the weekday repair section drawn on top in the crop's pixel space.
//      Each marker sits on the NPS map's own symbol or trail line: the
//      Curry Village trailhead parking P, the Happy Isles trailhead
//      restrooms, the Mist Trail's crossing of the Merced below Vernal Fall,
//      the fall symbol at Vernal, and the fall symbol at Nevada (the crop's
//      right edge, where the Valley map ends). The repair section follows
//      the map's trail line from the JMT junction above the footbridge to
//      the top of Vernal Fall.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["mist-trail-the-real-guide"] = function MistTrailBody() {
  const TOC = [
    ["#sec-0-what-the-mist-trail-actually-is", "The turnarounds"],
    ["#sec-1-the-wet-granite-reality", "The granite"],
    ["#sec-2-you-will-get-wet", "Getting wet"],
    ["#sec-3-when-to-go", "When to go"],
    ["#sec-4-the-safety-talk", "Safety"],
    ["#sec-5-the-crowd-question", "Crowds"],
    ["#sec-6-is-it-worth-it", "Is it worth it"],
    ["#mist-trail-questions", "Questions"],
  ];

  // seo-data.json `faq`, word for word.
  const FAQ = [
    ["How long is the Mist Trail in Yosemite?", "From Happy Isles, the round trip is 1.6 miles to Vernal Fall footbridge, 2.4 miles to the top of Vernal Fall, or 5.4 miles to the top of Nevada Fall. Parking adds walking distance."],
    ["How hard is the Mist Trail?", "The footbridge hike is moderate, with about 400 feet of climbing. The routes to the tops of Vernal Fall and Nevada Fall are strenuous, gaining about 1,000 and 2,000 feet respectively. Expect steep, uneven steps beyond the footbridge."],
    ["How long does the Mist Trail take?", "Allow 1 to 1.5 hours for the footbridge, about 3 hours for Vernal Fall, or 5 to 6 hours for Nevada Fall, plus time to get to and from Happy Isles. A John Muir Trail return is longer."],
    ["Where can I get drinking water on the Mist Trail?", "Drinking water is at Happy Isles and seasonally at Vernal Fall footbridge, usually May through October. There is no drinking-water tap at Nevada Fall. Carry enough if the footbridge tap is off."],
    ["Is the Mist Trail closed for repairs in 2026?", "From July 27 through October, subject to change, the section from the JMT junction above Vernal Fall footbridge to the top of Vernal Fall closes Monday through Thursday, 7 a.m. to 3:30 p.m. Follow the signed JMT detour and check the NPS notice before hiking."],
    ["Can kids hike the Mist Trail?", "Choose a turnaround that matches their fitness and the conditions. The paved footbridge route still climbs about 400 feet. Beyond it, steep, uneven and often wet steps require balance and steady footing. Stay behind railings and do not swim or wade above the falls."],
  ];

  // ── The turnarounds, as cards ─────────────────────────────────────────────
  // Round trips, gains and times from the opening paragraphs (the NPS route
  // estimates); water from the safety section; crowds from the crowd section.
  const TURNS = [
    { n: 1, name: "The Vernal Fall footbridge", line: "Paved, a moderate grade, a clear look at Vernal Fall.",
      rt: "1.6 miles", gain: "About 400 ft", time: "1 to 1.5 hours", water: "1 liter per person", crowd: "Packed" },
    { n: 2, name: "The top of Vernal Fall", line: "The granite staircase beside the fall, and the mist.",
      rt: "2.4 miles", gain: "About 1,000 ft", time: "About 3 hours", water: "2 liters per person", crowd: "Has people" },
    { n: 3, name: "The top of Nevada Fall", line: "594 feet of whitewater, Liberty Cap and Half Dome behind you.",
      rt: "5.4 miles", gain: "About 2,000 ft", time: "5 to 6 hours", water: "3 to 4 liters per person", crowd: "Can feel almost empty on a weekday" },
  ];

  // ── The four turnarounds, drawn from this article's own figures ───────────
  // Footbridge 0.8 mi / 400 ft; top of Vernal 1.2 mi / 1,000 ft (the 600 ft
  // staircase in 0.4 miles); top of Nevada 2.7 mi / 2,000 ft. The crowd
  // notes restate "The crowd question". Straight lines between the published
  // points: a shape, not a surveyed profile.
  function Turnarounds() {
    const W = 680, H = 350, L = 56, R = 30, T = 34, B = 46;
    const pw = W - L - R, ph = H - T - B;
    const x = (mi) => L + (mi / 2.7) * pw;
    const y = (ft) => T + ph - (ft / 2000) * ph;
    const pts = [[0, 0], [0.8, 400], [1.2, 1000], [2.7, 2000]];
    const line = pts.map(([m, f]) => `${x(m)},${y(f)}`).join(" ");
    const stops = [
      { m: 0, f: 0, name: "Happy Isles", sub: "start, 4,000 ft", crowd: "", dx: 12, dy: -64, anchor: "start" },
      { m: 0.8, f: 400, name: "Vernal Fall footbridge", sub: "0.8 mi · 400 ft", crowd: "packed", dx: 10, dy: 30, anchor: "start" },
      { m: 1.2, f: 1000, name: "Top of Vernal Fall", sub: "1.2 mi · 1,000 ft", crowd: "has people", dx: -12, dy: -40, anchor: "end" },
      { m: 2.7, f: 2000, name: "Top of Nevada Fall", sub: "2.7 mi · 2,000 ft", crowd: "can feel almost empty on a weekday", dx: -8, dy: 95, anchor: "end" },
    ];
    return (
      <svg className="mt-profile__svg" viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label="The Mist Trail's four turnarounds, from the figures in this article. From Happy Isles at 4,000 feet: the Vernal Fall footbridge at 0.8 miles and 400 feet of gain, where the crowd is packed; the top of Vernal Fall at 1.2 miles and 1,000 feet, up a granite staircase that gains 600 feet in 0.4 miles in the mist zone; the top of Nevada Fall at 2.7 miles and 2,000 feet, which on a weekday can feel almost empty. The crowd thins as the trail climbs.">
        {[0, 500, 1000, 1500, 2000].map((f) => (
          <g key={f}>
            <line x1={L} x2={W - R} y1={y(f)} y2={y(f)} className="mt-profile__grid" />
            <text x={L - 8} y={y(f) + 4} textAnchor="end" className="mt-profile__axis">{f === 0 ? "0" : f.toLocaleString("en-US")}</text>
          </g>
        ))}
        {[0, 0.5, 1, 1.5, 2, 2.5].map((m) => (
          <text key={m} x={x(m)} y={H - 24} textAnchor="middle" className="mt-profile__axis">{m}</text>
        ))}
        <text x={L + pw / 2} y={H - 6} textAnchor="middle" className="mt-profile__axis">miles from Happy Isles · feet gained</text>
        <rect x={x(0.8)} y={T} width={x(1.2) - x(0.8)} height={ph} className="mt-profile__mist" />
        <text x={(x(0.8) + x(1.2)) / 2} y={T + 14} textAnchor="middle" className="mt-profile__label">the mist zone</text>
        <text x={(x(0.8) + x(1.2)) / 2} y={T + 30} textAnchor="middle" className="mt-profile__label">600 ft in 0.4 mi</text>
        <polygon points={`${x(0)},${y(0)} ${line} ${x(2.7)},${y(0)}`} className="mt-profile__area" />
        <polyline points={line} className="mt-profile__line" />
        {stops.map((st) => (
          <g key={st.name}>
            <circle cx={x(st.m)} cy={y(st.f)} r="5" className="mt-profile__dot" />
            <text x={x(st.m) + st.dx} y={y(st.f) + st.dy} textAnchor={st.anchor} className="mt-profile__place">{st.name}</text>
            <text x={x(st.m) + st.dx} y={y(st.f) + st.dy + 17} textAnchor={st.anchor} className="mt-profile__label">{st.sub}</text>
            {st.crowd && <text x={x(st.m) + st.dx} y={y(st.f) + st.dy + 33} textAnchor={st.anchor} className="mt-profile__crowd">{st.crowd}</text>}
          </g>
        ))}
      </svg>
    );
  }

  // ── The crop of the NPS Valley map: the trailhead to Nevada Fall ──────────
  function RouteMap() {
    return (
      <figure className="npsmap mt-map">
        <div className="npsmap__frame">
          <img src="/img/nps-mist-trail-map.jpg" width="700" height="380" loading="lazy" decoding="async"
            alt="National Park Service map of the east end of Yosemite Valley: Curry Village and its trailhead parking, the Happy Isles trailhead, the Mist Trail along the Merced River to Vernal Fall, Emerald Pool and the Silver Apron, the John Muir Trail past Clark Point, and Nevada Fall at the map's edge." />
          <svg viewBox="0 0 700 380" aria-hidden="true" focusable="false">
            <path d="M395 277 L 450 275 L 490 262 L 505 250" className="npsmap__ban" />
            {[[1, 113, 92], [2, 230, 148], [3, 362, 276], [4, 505, 247], [5, 672, 310]].map(([n, cx, cy]) => (
              <g key={n}>
                <circle cx={cx} cy={cy} r="14" className={"npsmap__pin " + (n <= 2 ? "npsmap__pin--ink" : "npsmap__pin--rust")} />
                <text x={cx} y={cy + 5} textAnchor="middle" className="npsmap__num">{n}</text>
              </g>
            ))}
          </svg>
        </div>
        <figcaption>
          <span><b>1</b> Curry Village trailhead parking</span>
          <span><b>2</b> Happy Isles trailhead, shuttle stop 16</span>
          <span><b>3</b> Vernal Fall footbridge</span>
          <span><b>4</b> Top of Vernal Fall</span>
          <span><b>5</b> Top of Nevada Fall</span>
          <span><i className="npsmap__key npsmap__key--ban" aria-hidden="true" /> Weekday repair section, 2026</span>
          <span>Map: National Park Service (public domain), cropped.</span>
        </figcaption>
      </figure>
    );
  }

  // ── The season, from "When to go" ─────────────────────────────────────────
  const SEASONS = [
    { when: "May through mid-June", name: "Peak waterfall", cls: "is-peak",
      text: "The falls at full power and the granite soaked. The most crowded and the most slippery." },
    { when: "Late June through July", name: "Mid-season", cls: "is-mid",
      text: "Less mist, drier and safer stairs, and slightly thinner weekday crowds." },
    { when: "August through October", name: "Late season", cls: "is-late",
      text: "Often less spray. The stairs are still steep, and rain makes them slippery in any month." },
  ];

  return (
    <div className="mt-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="route" /><dt>To Nevada Fall</dt><dd>5.4 miles round trip</dd></div>
          <div><EventIcon name="mountain" /><dt>The climb</dt><dd>About 2,000 feet</dd></div>
          <div><EventIcon name="pin" /><dt>The start</dt><dd>Happy Isles, shuttle stop 16</dd></div>
          <div><EventIcon name="drop" /><dt>The mist</dt><dd>Heaviest in May and June</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the three choices, and the whole page in four lines. */}
      <section className="hp-wrap hp-section mt-open">
        <div className="ff-split">
          <div className="mt-prose">
            <p className="dropcap">
              The Mist Trail starts at Happy Isles in Yosemite Valley. Choose the Vernal Fall footbridge for a shorter hike, or continue up steep granite steps to Vernal Fall and Nevada Fall. Above the footbridge, expect a strenuous climb, wet footing during snowmelt, and exposed sections beside the waterfalls.
            </p>

            <p>
              <strong>Distances from Happy Isles:</strong> 1.6 miles round trip to the footbridge, 2.4 miles to the top of Vernal Fall, or 5.4 miles to the top of Nevada Fall. Allow 1 to 1.5 hours, about 3 hours, or 5 to 6 hours respectively. Parking adds walking distance. These are the <a href="https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm">NPS route estimates</a>.
            </p>

            <p>
              Check <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm">current trail closures</a> before choosing your route. The weekday repair detour described below affects the staircase to Vernal Fall through October 2026, subject to change.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>Pick a turnaround: the footbridge, Vernal Fall, or Nevada Fall.</li>
              <li>Wear shoes with real tread. The steps are wet and uneven.</li>
              <li>Put your phone in a ziplock and pack a dry shirt.</li>
              <li>Stay behind the railings. Never wade or swim above the falls.</li>
            </ul>
            <a className="mt-short__link" href="#sec-4-the-safety-talk">How much water to carry ↓</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="sec-0-what-the-mist-trail-actually-is" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">WHAT THE MIST TRAIL ACTUALLY IS</p>
              <h2>Two waterfalls, four turnarounds</h2>
              <div className="mt-prose">
                <p>
                  The Mist Trail starts at Happy Isles, at the east end of Yosemite Valley, and climbs beside two waterfalls: Vernal Fall (317 feet) and Nevada Fall (594 feet). The full trail to the top of Nevada Fall is about 5.4 miles round trip with roughly 2,000 feet of elevation gain. If you only go to the Vernal Fall footbridge, where most families turn around, it's 1.6 miles round trip with about 400 feet of gain.
                </p>

                <p>You can stop at any of four natural turnarounds, and each one works as a full hike on its own.</p>
              </div>
            </div>
            <RouteMap />
          </div>

          <div className="mt-turns">
            {TURNS.map((t) => (
              <article key={t.n} className="mt-turn">
                <p className="mt-turn__num">{t.n + 2}</p>
                <h3>{t.name}</h3>
                <p className="mt-turn__line">{t.line}</p>
                <dl>
                  <div><dt>Round trip</dt><dd>{t.rt}</dd></div>
                  <div><dt>Climb</dt><dd>{t.gain}</dd></div>
                  <div><dt>Allow</dt><dd>{t.time}</dd></div>
                  <div><dt>Water</dt><dd>{t.water}</dd></div>
                  <div><dt>Crowd</dt><dd>{t.crowd}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <p className="ff-note">The numbers match the map: 3, 4 and 5. Times are the NPS route estimates from Happy Isles; parking adds walking distance.</p>

          <div className="ff-split mt-turns__prose">
            <div className="mt-prose">
              <p>
                <strong>The Vernal Fall footbridge</strong> (0.8 miles from Happy Isles, 400 ft gain). Paved trail, a moderate grade, and a clear look at Vernal Fall from the bridge. Most families with young kids turn around here, and it's worth the walk even if you go no farther.
              </p>

              <p>
                <strong>The top of Vernal Fall</strong> (about 1.2 miles from Happy Isles, 1,000 ft gain). This is where the trail earns the "mist" in its name. You climb a granite staircase right next to the fall, and when it's running at peak volume (May and June), you get drenched. The granite steps are wet, steep, and uneven. A metal railing is bolted into the rock on the exposed side. At the top there's an emerald pool above the fall and a view down the canyon.
              </p>

              <p>
                <strong>The top of Nevada Fall</strong> (2.7 miles from Happy Isles, 2,000 ft gain). Past Vernal, the trail heads through forest and up the Merced River canyon to the base of Nevada Fall, then to its top. Up there you're looking down 594 feet of whitewater with Liberty Cap and Half Dome standing behind you, one of the most dramatic views in the park.
              </p>

              <p>
                <strong>The return via the John Muir Trail.</strong> From Nevada Fall, the JMT provides a longer descent with gentler grades than the Mist Trail stairs. Allow roughly 5.8 miles for the loop from Happy Isles, by the printed Yosemite Guide's count, plus the walk to your parking space. Check closures before relying on either route.
              </p>
            </div>
            <div>
              <figure className="mt-profile">
                <figcaption>The climb, turnaround by turnaround</figcaption>
                <Turnarounds />
                <p className="ff-note">
                  The four turnarounds, from the figures above: straight lines between the published points, not a surveyed profile. The crowd notes are from the crowd section below. Coming down the John Muir Trail from the top of Nevada Fall makes a loop of about 5.8 miles from Happy Isles, by the printed Yosemite Guide's count, plus the walk to your parking space.
                </p>
              </figure>
              <p className="ff-alert mt-halfdome">
                <EventIcon name="dome" />
                <span>
                  Keep going past Nevada Fall and you're on the standard approach to Half Dome. If that's the plan, read the <a href="/half-dome-lottery">permit lottery guide</a> first, and <a href="/articles/so-you-want-to-hike-half-dome">the honest case for the cables</a> before you commit.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-1-the-wet-granite-reality" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE WET GRANITE REALITY</p>
            <h2>Over 600 steps, and all of them wet</h2>
            <div className="mt-prose">
              <p>
                From mid-April to late June, the granite staircase below Vernal Fall is basically a waterfall of its own. Spray hits the trail the whole time. The steps, over 600 of them on the stretch to the top of Vernal Fall by the Park Service's count, are wet, mossy in places, and uneven. Some are a foot tall. Some are two feet tall. Some are angled in ways that make your feet slide.
              </p>

              <p>
                Wet steps and loose rock make slipping a concern. Slow down, leave room for other hikers, and use the railings where provided.
              </p>

              <p>
                <strong>Wear hiking boots or trail shoes with good tread.</strong> Running shoes with worn-out soles are a slip waiting to happen. Flip-flops, sandals, and fashion sneakers are dangerous on wet granite. I've watched people go down hard on these stairs in shoes that had no business being on a wet rock face.
              </p>

              <p>
                Wear footwear with good traction that you have already walked in comfortably. Price alone does not tell you how a shoe will grip wet rock.
              </p>
            </div>
            <ul className="mt-shoes">
              <li className="is-yes"><EventIcon name="check" /><span><strong>Boots or trail shoes</strong> with good tread, already walked in</span></li>
              <li className="is-no"><EventIcon name="no" /><span><strong>Running shoes</strong> with worn-out soles</span></li>
              <li className="is-no"><EventIcon name="no" /><span><strong>Flip-flops, sandals, fashion sneakers</strong></span></li>
            </ul>
          </div>
          <figure className="mt-photo">
            <ResponsiveImage image="img/vernal-fall-high-water.jpg" style={{ aspectRatio: "2000 / 3000" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="Vernal Fall at high water in late spring, white spray filling the granite gorge below it" />
            <figcaption>Vernal Fall at high water, the season the staircase beside it runs wet. Photo: Brandon Raines / Pexels</figcaption>
          </figure>
        </div>
      </section>

      <section className="ff-band" id="sec-2-you-will-get-wet" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">YOU WILL GET WET</p>
            <h2>Twenty minutes in a rainstorm</h2>
            <div className="mt-prose">
              <p>
                In May and June, when the Merced River is running at full snowmelt volume, the spray zone below Vernal Fall feels like standing in a rainstorm for twenty minutes. Your clothes get soaked through. So does your phone, your camera and your pack.
              </p>

              <p>Here's how to deal with it.</p>
            </div>
          </div>
          <div className="mt-wet">
            <div>
              <EventIcon name="signal" />
              <strong>The phone</strong>
              <p>
                Put your phone in a ziplock bag. You can still shoot photos through it. A waterproof phone case is even better.
              </p>
            </div>
            <div>
              <EventIcon name="therm" />
              <strong>The clothes</strong>
              <p>
                Wear synthetic or wool, not cotton. Wet cotton gets heavy and cold and takes hours to dry. Pack a dry layer; drying time depends on the weather.
              </p>
            </div>
            <div>
              <EventIcon name="cloud" />
              <strong>The shell</strong>
              <p>
                A <a className="aff-link" href={window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=rain+jacket")} target="_blank" rel="sponsored noopener" data-aff-network="patagonia" data-aff-list="article_inline" data-aff-item-slug="mist-trail-the-real-guide" data-aff-name="Packable rain jacket">rain jacket</a> helps protect against spray and wind. In July and August, when the falls are lower, you might get misted rather than soaked. In May and June it keeps you warm on the way up, though you'll sweat under it.
              </p>
            </div>
            <div>
              <EventIcon name="sun" />
              <strong>The top</strong>
              <p>
                Pack a dry shirt in a ziplock and change at the top. Otherwise you shiver the rest of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-3-when-to-go" tabIndex={-1}>
        <p className="hp-eyebrow">WHEN TO GO</p>
        <h2>The falls decide the trail</h2>
        <ol className="mt-seasons">
          {SEASONS.map((s) => (
            <li key={s.name} className={s.cls}>
              <span>{s.when}</span>
              <strong>{s.name}</strong>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="ff-split mt-when">
          <div className="mt-prose">
            <p>
              <strong>Peak waterfall (May through mid-June).</strong> Vernal Fall is thundering, the mist zone is intense, the granite is soaked, and Nevada Fall is at full power. This is the version people come for. It's also the most crowded and the most slippery.
            </p>

            <p>
              <strong>Mid-season (late June through July).</strong> The flow drops, the mist zone shrinks, and the stairs get drier and safer. Still beautiful, and the weekday crowds thin a little.
            </p>

            <p>
              <strong>Late season (August through October).</strong> Waterfall flow usually decreases and there is often less spray. The stairs remain steep and uneven; rain can make them slippery in any month.
            </p>
          </div>
          <div className="mt-getting">
            <article className="ff-inpark">
              <p className="hp-eyebrow">GETTING TO THE TRAILHEAD</p>
              <h3>Park at Curry Village, or ride</h3>
              <p>
                Happy Isles has no trailhead parking. Use <a href="/articles/yosemite-valley-parking-guide">Curry Village parking</a> and walk, or take the <a href="/articles/yosemite-shuttle-and-yarts">Valley shuttle</a> to stop 16. Start early for cooler conditions and fewer people, while observing any repair closures.
              </p>
            </article>
            <div className="ff-alert">
              <EventIcon name="alert" />
              <p>
                <strong>2026 weekday restrictions.</strong> From July 27 through October, subject to change, repair work closes the section from the JMT junction above the footbridge to the top of Vernal Fall Monday through Thursday, 7 a.m. to 3:30 p.m. Follow the signed JMT detour. The section normally opens outside those hours when safe, and on Fridays, weekends and holidays. The JMT Ice Cut reopened July 27. Check the <a href="https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm">NPS detour notice</a> before setting out.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ff-band" id="sec-4-the-safety-talk" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE SAFETY TALK</p>
              <h2>Not an easy walk</h2>
              <div className="mt-prose">
                <p>
                  The internet makes this trail look like an easy walk. It isn't one.
                </p>

                <p>
                  Choose a turnaround that matches your fitness and the conditions. Heat, a sustained climb, and a long descent can make this hike harder than its mileage suggests.
                </p>

                <p>
                  The pools above Vernal Fall and Nevada Fall look calm and inviting. They aren't. The current is powerful, the granite is slick when wet, and the lip of the fall is just downstream. A slip beyond the railing can be fatal. The NPS signs are accurate.
                </p>

                <p>
                  Stay behind the railings. Don't wade. Don't swim in the pools above the falls. Don't walk on the wet granite near the edge "for a photo." This is the single most important safety rule on this trail, and it's the rule that, when broken, has killed people. Swimming in the Emerald Pool and the Silver Apron is prohibited; <a href="/articles/swimming-in-the-merced">the swimming guide</a> lays out where in this park you may and may not get in the water, and what the Park Service has documented happening here.
                </p>

                <p>
                  Carry a headlamp, food, and enough water for the whole hike. Turn around before fatigue or daylight makes the descent difficult.
                </p>

                <p>
                  For a shorter option, turn around at the footbridge. Even that route climbs about 400 feet; the paved surface does not make it a flat walk. Beyond it, the stairs require balance and steady footing, especially for children.
                </p>
              </div>
            </div>
            <div className="mt-water">
              <p className="hp-eyebrow">WATER, PER PERSON</p>
              <ol className="mt-water__list">
                <li><span>Footbridge</span><strong>1 liter</strong><i style={{ "--l": 1 }} /></li>
                <li><span>Top of Vernal Fall</span><strong>2 liters</strong><i style={{ "--l": 2 }} /></li>
                <li><span>Top of Nevada Fall</span><strong>3 to 4 liters</strong><i style={{ "--l": 4 }} /></li>
              </ol>
              <p className="mt-water__text">
                <strong>Water:</strong> Carry 1 liter per person for the footbridge, 2 for Vernal Fall, and 3 to 4 for Nevada Fall, with more as conditions require. Drinking water is at Happy Isles and seasonally at the Vernal Fall footbridge, usually May through October. There is no drinking-water tap at Nevada Fall. Toilets are separate from water sources; bring enough if the footbridge tap is off.
              </p>
            </div>
          </div>

          <ul className="ff-rules mt-rules">
            <li>
              <EventIcon name="no" size={26} />
              <strong>Stay behind the railings.</strong>
              <p>A slip beyond the railing can be fatal. Don't walk on the wet granite near the edge for a photo.</p>
            </li>
            <li>
              <EventIcon name="lake" size={26} />
              <strong>Don't wade or swim above the falls.</strong>
              <p>The current is powerful and the lip of the fall is just downstream. Swimming in the Emerald Pool and the Silver Apron is prohibited.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="check" size={26} />
              <strong>Carry a headlamp, food and water.</strong>
              <p>Enough for the whole hike. There is no drinking-water tap at Nevada Fall.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="clock" size={26} />
              <strong>Turn around in time.</strong>
              <p>Before fatigue or daylight makes the descent difficult. The footbridge is a full hike on its own.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-5-the-crowd-question" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE CROWD QUESTION</p>
            <h2>The crowd thins as you climb</h2>
            <div className="mt-prose">
              <p>
                Yes, it's crowded, especially on weekends from May through July. The Mist Trail is Yosemite's signature hike and it draws people from all over the world. <a href="/articles/when-to-visit-yosemite">The park-wide crowd calendar</a> has the month-by-month numbers.
              </p>

              <p>
                The good news: the crowd thins fast as you climb. The footbridge is packed. The staircase is busy. The top of Vernal Fall has people. The section between Vernal and Nevada Falls is noticeably quieter. The top of Nevada Fall, on a weekday, can feel almost empty.
              </p>

              <p>
                For fewer people, aim for an early weekday start, but check the repair schedule first. Continuing to Nevada Fall adds distance and climbing; do it because you have the time and energy, not just to escape the crowd.
              </p>
            </div>
          </div>
          <div>
            <h3 className="mt-crowd__head">From the bottom up</h3>
            <ol className="ff-hours mt-crowd">
              <li className="is-glow"><span>The footbridge</span><p>Packed.</p></li>
              <li className="is-glow"><span>The staircase</span><p>Busy.</p></li>
              <li><span>The top of Vernal Fall</span><p>Has people.</p></li>
              <li><span>Vernal to Nevada</span><p>Noticeably quieter.</p></li>
              <li><span>The top of Nevada Fall</span><p>On a weekday, can feel almost empty.</p></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="ff-band" id="sec-6-is-it-worth-it" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">IS IT WORTH IT</p>
            <h2>Yes, and plan on getting soaked</h2>
            <div className="mt-prose">
              <p>
                Yes. In peak waterfall season the Mist Trail is one of the best day hikes in the United States.
              </p>

              <p>
                Prepare for a mountain hike: check closures, choose your turnaround, wear grippy shoes, and carry enough water. The waterfall views are worth taking time for, especially when the stairs are wet.
              </p>

              <p>
                So come ready. Read the <a href="/kit">day pack packing list</a>, and <a href="/articles/pack-your-car-for-yosemite">pack the car</a> the night before so the early start actually happens. Start early. Wear real shoes. Bring a ziplock for your phone and a dry shirt for the top.
              </p>

              <p className="mt-signoff">
                Then plan on getting soaked.
              </p>
            </div>
          </div>
          <figure className="mt-photo">
            <ResponsiveImage image="img/happy-isles-ouzel-watch.jpg" style={{ aspectRatio: "1600 / 1232" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="The rapids of the Merced River at Happy Isles, where the Mist Trail starts" />
            <figcaption>The Merced at Happy Isles, where the trail starts. Photo: George Fiske / Wikimedia Commons (public domain)</figcaption>
          </figure>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="mist-trail-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Mist Trail questions, answered</h2>
            <div className="mt-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm" target="_blank" rel="noopener noreferrer">Vernal and Nevada Falls, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">Current conditions, NPS Yosemite</a></li>
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

      <div className="hp-wrap mt-end">
        <AffiliateNote />
      </div>
    </div>
  );
};
