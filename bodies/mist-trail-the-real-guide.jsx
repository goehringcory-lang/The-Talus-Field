/* global React, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

window.ARTICLE_BODIES["mist-trail-the-real-guide"] = function MistTrailBody() {
  // ── The four turnarounds, drawn from this article's own figures ───────────
  // Footbridge 0.8 mi / 400 ft; top of Vernal 1.2 mi / 1,000 ft (the 600 ft
  // staircase in 0.4 miles); top of Nevada 2.7 mi / 2,000 ft. The crowd
  // notes restate "The crowd question". Straight lines between the published
  // points: a shape, not a surveyed profile.
  const AXIS = { fontFamily: "var(--sans)", fontSize: 12.5, fill: "var(--ink-3)" };
  const LABEL = { fontFamily: "var(--sans)", fontSize: 13, fill: "var(--ink-2)" };
  const PLACE = { fontFamily: "var(--serif)", fontSize: 16, fill: "var(--ink)" };
  const CROWD = { fontFamily: "var(--sans)", fontSize: 12, fontStyle: "italic", fill: "var(--rust)" };
  const svgStyle = { width: "100%", height: "auto", display: "block" };

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
      <svg viewBox={`0 0 ${W} ${H}`} style={svgStyle} role="img"
        aria-label="The Mist Trail's four turnarounds, from the figures in this article. From Happy Isles at 4,000 feet: the Vernal Fall footbridge at 0.8 miles and 400 feet of gain, where the crowd is packed; the top of Vernal Fall at 1.2 miles and 1,000 feet, up a granite staircase that gains 600 feet in 0.4 miles in the mist zone; the top of Nevada Fall at 2.7 miles and 2,000 feet, which on a weekday can feel almost empty. The crowd thins as the trail climbs.">
        {[0, 500, 1000, 1500, 2000].map((f) => (
          <g key={f}>
            <line x1={L} x2={W - R} y1={y(f)} y2={y(f)} stroke="var(--rule-soft)" strokeWidth="1" />
            <text x={L - 8} y={y(f) + 4} textAnchor="end" style={AXIS}>{f === 0 ? "0" : f.toLocaleString("en-US")}</text>
          </g>
        ))}
        {[0, 0.5, 1, 1.5, 2, 2.5].map((m) => (
          <text key={m} x={x(m)} y={H - 24} textAnchor="middle" style={AXIS}>{m}</text>
        ))}
        <text x={L + pw / 2} y={H - 6} textAnchor="middle" style={AXIS}>miles from Happy Isles · feet gained</text>
        <rect x={x(0.8)} y={T} width={x(1.2) - x(0.8)} height={ph} fill="var(--moss)" opacity="0.10" />
        <text x={(x(0.8) + x(1.2)) / 2} y={T + 14} textAnchor="middle" style={LABEL}>the mist zone</text>
        <text x={(x(0.8) + x(1.2)) / 2} y={T + 30} textAnchor="middle" style={LABEL}>600 ft in 0.4 mi</text>
        <polygon points={`${x(0)},${y(0)} ${line} ${x(2.7)},${y(0)}`} fill="var(--moss)" opacity="0.12" />
        <polyline points={line} fill="none" stroke="var(--moss)" strokeWidth="2.6" strokeLinejoin="round" />
        {stops.map((st) => (
          <g key={st.name}>
            <circle cx={x(st.m)} cy={y(st.f)} r="5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
            <text x={x(st.m) + st.dx} y={y(st.f) + st.dy} textAnchor={st.anchor} style={PLACE}>{st.name}</text>
            <text x={x(st.m) + st.dx} y={y(st.f) + st.dy + 17} textAnchor={st.anchor} style={LABEL}>{st.sub}</text>
            {st.crowd && <text x={x(st.m) + st.dx} y={y(st.f) + st.dy + 33} textAnchor={st.anchor} style={CROWD}>{st.crowd}</text>}
          </g>
        ))}
      </svg>
    );
  }
  return (
    <>
      <p className="dropcap">
        The Mist Trail starts at Happy Isles in Yosemite Valley. Choose the Vernal Fall footbridge for a shorter hike, or continue up steep granite steps to Vernal Fall and Nevada Fall. Above the footbridge, expect a strenuous climb, wet footing during snowmelt, and exposed sections beside the waterfalls.
      </p>

      <p>
        <strong>Distances from Happy Isles:</strong> 1.6 miles round trip to the footbridge, 2.4 miles to the top of Vernal Fall, or 5.4 miles to the top of Nevada Fall. Allow 1 to 1.5 hours, about 3 hours, or 5 to 6 hours respectively. Parking adds walking distance. These are the <a href="https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm">NPS route estimates</a>.
      </p>

      <p>
        Check <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm">current trail closures</a> before choosing your route. The weekday repair detour described below affects the staircase to Vernal Fall through October 2026, subject to change.
      </p>

      <h2>What the Mist Trail actually is</h2>

      <p>
        The Mist Trail starts at Happy Isles, at the east end of Yosemite Valley, and climbs beside two waterfalls: Vernal Fall (317 feet) and Nevada Fall (594 feet). The full trail to the top of Nevada Fall is about 5.4 miles round trip with roughly 2,000 feet of elevation gain. If you only go to the Vernal Fall footbridge, where most families turn around, it's 1.6 miles round trip with about 400 feet of gain.
      </p>

      <p>You can stop at any of four natural turnarounds, and each one works as a full hike on its own.</p>

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
        <strong>The return via the John Muir Trail.</strong> From Nevada Fall, the JMT provides a longer descent with gentler grades than the Mist Trail stairs. Allow roughly 7 miles for the combined hike from Happy Isles, plus the walk to your parking space. Check closures before relying on either route.
      </p>

      <figure style={{ margin: "28px 0 32px" }}>
        <Turnarounds />
        <figcaption>
          The four turnarounds, from the figures above: straight lines between the published points, not a surveyed profile. The crowd notes are from the crowd section below. Coming down the John Muir Trail from the top of Nevada Fall makes a hike of roughly 7 miles from Happy Isles, plus the walk to your parking space.
        </figcaption>
      </figure>

      <p>
        Keep going past Nevada Fall and you're on the standard approach to Half Dome. If that's the plan, read the <a href="/half-dome-lottery">permit lottery guide</a> first, and <a href="/articles/so-you-want-to-hike-half-dome">the honest case for the cables</a> before you commit.
      </p>

      <h2>The wet granite reality</h2>

      <p>
        From mid-April to late June, the granite staircase below Vernal Fall is basically a waterfall of its own. Spray hits the trail the whole time. The steps, hundreds of them, carved and placed by the Civilian Conservation Corps in the 1930s, are wet, mossy in places, and uneven. Some are a foot tall. Some are two feet tall. Some are angled in ways that make your feet slide.
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

      <h2>You will get wet</h2>

      <p>
        In May and June, when the Merced River is running at full snowmelt volume, the spray zone below Vernal Fall feels like standing in a rainstorm for twenty minutes. Your clothes get soaked through. So does your phone, your camera and your pack.
      </p>

      <p>Here's how to deal with it.</p>

      <p>
        Put your phone in a ziplock bag. You can still shoot photos through it. A waterproof phone case is even better.
      </p>

      <p>
        Wear synthetic or wool, not cotton. Wet cotton gets heavy and cold and takes hours to dry. Pack a dry layer; drying time depends on the weather.
      </p>

      <p>
        A <a className="aff-link" href={window.buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=rain+jacket")} target="_blank" rel="sponsored noopener" data-aff-network="patagonia" data-aff-list="article_inline" data-aff-item-slug="mist-trail-the-real-guide" data-aff-name="Packable rain jacket">rain jacket</a> helps protect against spray and wind. In July and August, when the falls are lower, you might get misted rather than soaked. In May and June it keeps you warm on the way up, though you'll sweat under it.
      </p>

      <p>
        Pack a dry shirt in a ziplock and change at the top. Otherwise you shiver the rest of the way.
      </p>

      <h2>When to go</h2>

      <p>
        <strong>Peak waterfall (May through mid-June).</strong> Vernal Fall is thundering, the mist zone is intense, the granite is soaked, and Nevada Fall is at full power. This is the version people come for. It's also the most crowded and the most slippery.
      </p>

      <p>
        <strong>Mid-season (late June through July).</strong> The flow drops, the mist zone shrinks, and the stairs get drier and safer. Still beautiful, and the weekday crowds thin a little.
      </p>

      <p>
        <strong>Late season (August through October).</strong> Waterfall flow usually decreases and there is often less spray. The stairs remain steep and uneven; rain can make them slippery in any month.
      </p>

      <p>
        <strong>Getting to the trailhead.</strong> Happy Isles has no trailhead parking. Use <a href="/articles/yosemite-valley-parking-guide">Curry Village parking</a> and walk, or take the <a href="/articles/yosemite-shuttle-and-yarts">Valley shuttle</a> to stop 16. Start early for cooler conditions and fewer people, while observing any repair closures.
      </p>

      <p>
        <strong>2026 weekday restrictions.</strong> From July 27 through October, subject to change, repair work closes the section from the JMT junction above the footbridge to the top of Vernal Fall Monday through Thursday, 7 a.m. to 3:30 p.m. Follow the signed JMT detour. The section normally opens outside those hours when safe, and on Fridays, weekends and holidays. The JMT Ice Cut reopened July 27. Check the <a href="https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm">NPS detour notice</a> before setting out.
      </p>

      <h2>The safety talk</h2>

      <p>
        The internet makes this trail look like an easy walk. It isn't one.
      </p>

      <p>
        Choose a turnaround that matches your fitness and the conditions. Heat, a sustained climb, and a long descent can make this hike harder than its mileage suggests.
      </p>

      <p>
        The pools above Vernal Fall and Nevada Fall look calm and inviting. They aren't. The current is powerful, the granite is frictionless when wet, and the lip of the fall is just downstream. A slip beyond the railing can be fatal. The NPS signs are accurate.
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

      <p>
        <strong>Water:</strong> Carry 1 liter per person for the footbridge, 2 for Vernal Fall, and 3 to 4 for Nevada Fall, with more as conditions require. Drinking water is at Happy Isles and seasonally at the Vernal Fall footbridge, usually May through October. There is no drinking-water tap at Nevada Fall. Toilets are separate from water sources; bring enough if the footbridge tap is off.
      </p>

      <h2>The crowd question</h2>

      <p>
        Yes, it's crowded, especially on weekends from May through July. The Mist Trail is Yosemite's signature hike and it draws people from all over the world.
      </p>

      <p>
        The good news: the crowd thins fast as you climb. The footbridge is packed. The staircase is busy. The top of Vernal Fall has people. The section between Vernal and Nevada Falls is noticeably quieter. The top of Nevada Fall, on a weekday, can feel almost empty.
      </p>

      <p>
        For fewer people, aim for an early weekday start, but check the repair schedule first. Continuing to Nevada Fall adds distance and climbing; do it because you have the time and energy, not just to escape the crowd.
      </p>

      <h2>Is it worth it</h2>

      <p>
        Yes. In peak waterfall season the Mist Trail is one of the best day hikes in the United States.
      </p>

      <p>
        Prepare for a mountain hike: check closures, choose your turnaround, wear grippy shoes, and carry enough water. The waterfall views are worth taking time for, especially when the stairs are wet.
      </p>

      <p>
        So come ready. Read the <a href="/kit">day pack packing list</a>, and <a href="/articles/pack-your-car-for-yosemite">pack the car</a> the night before so the early start actually happens. Start early. Wear real shoes. Bring a ziplock for your phone and a dry shirt for the top.
      </p>

      <p>
        Then plan on getting soaked.
      </p>

      <AffiliateNote />
    </>
  );
};
