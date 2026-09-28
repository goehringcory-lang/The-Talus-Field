/* global React, NatureNotesFilm */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

window.ARTICLE_BODIES["giant-sequoias-fire-adaptation"] = function GiantSequoiasFireBody() {
  // ── Two forests ───────────────────────────────────────────────────────────
  // Every step is this article's own ("How fire kills what sequoias escape"
  // and "What changed, and why it matters"). A diagram of the argument, not
  // of any one grove.
  const HEAD = { fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, letterSpacing: 1.4 };
  const TITLE = { fontFamily: "var(--serif)", fontSize: 17, fill: "var(--ink)" };
  const LINE = { fontFamily: "var(--sans)", fontSize: 13, fill: "var(--ink-2)" };
  const svgStyle = { width: "100%", height: "auto", display: "block" };
  const COLS = [
    {
      head: "WITH FIRE", sub: "a ground fire every 10 to 30 years", tone: "var(--moss)",
      steps: [
        ["A low fire creeps through", "brush, fallen logs, lower branches"],
        ["Competitors die or weaken", "white fir, incense cedar"],
        ["Bare mineral soil and light", "what a sequoia seed needs"],
        ["The sequoia takes a scar", "and seedlings fill the opening"],
      ],
    },
    {
      head: "WITHOUT FIRE", sub: "a century of suppression", tone: "var(--rust)",
      steps: [
        ["White fir fills the understory", "shade-tolerant, growing taller"],
        ["Fuel piles up", "dead wood, needles, small branches"],
        ["The canopy closes", "seedlings starve for light"],
        ["The next fire burns hotter", "a grove in slow decline"],
      ],
    },
  ];

  function TwoForests() {
    const W = 680, H = 440, colW = 316, gap = W - colW * 2, T = 64, boxH = 62, step = 82;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={svgStyle} role="img"
        aria-label="Two forests side by side. With fire, a ground fire every ten to thirty years: a low fire creeps through brush and fallen logs; competitors such as white fir and incense cedar die or weaken; the fire leaves bare mineral soil and light, which a sequoia seed needs; the sequoia takes a scar and seedlings fill the opening. Without fire, after a century of suppression: shade-tolerant white fir fills the understory; fuel piles up; the canopy closes and seedlings starve for light; the next fire burns hotter, and the grove is in slow decline. Restoration burns, planned for weather that keeps them low-intensity, turn the second forest back toward the first.">
        {COLS.map((c, ci) => {
          const x = ci * (colW + gap);
          return (
            <g key={c.head}>
              <text x={x} y={20} style={{ ...HEAD, fill: c.tone }}>{c.head}</text>
              <text x={x} y={42} style={LINE}>{c.sub}</text>
              {c.steps.map(([t, n], i) => {
                const y = T + i * step;
                return (
                  <g key={t}>
                    <rect x={x} y={y} width={colW} height={boxH} rx="3" fill="none" stroke={c.tone} strokeWidth={i === 3 ? 2.2 : 1.2} />
                    <text x={x + 14} y={y + 26} style={TITLE}>{t}</text>
                    <text x={x + 14} y={y + 46} style={LINE}>{n}</text>
                    {i < 3 && <path d={`M${x + colW / 2} ${y + boxH + 3} v${step - boxH - 6} m-5 -6 l5 6 l5 -6`} fill="none" stroke="var(--ink-3)" strokeWidth="1.4" />}
                  </g>
                );
              })}
            </g>
          );
        })}
        <path d={`M${W - colW / 2} ${T + 3 * step + boxH + 4} v28 H${colW / 2} v-26 m-6 8 l6 -8 l6 8`} fill="none" stroke="var(--moss)" strokeWidth="1.6" strokeDasharray="5 4" />
        <text x={W / 2} y={T + 3 * step + boxH + 52} textAnchor="middle" style={{ ...LINE, fill: "var(--ink)" }}>Restoration burns: planned for weather that keeps them low-intensity</text>
      </svg>
    );
  }
  return (
    <>
      <p className="dropcap">
        Walk into the Mariposa Grove on a quiet morning and run your hands across the trunk of a fire-scarred sequoia. The bark is a record of the fires the tree survived. Some of these scars date back centuries. Some mark fires that burned centuries before that. The bark beneath your palm is blackened in places, thick with the residue of heat that would have killed any other tree on the Sierra Nevada.
      </p>

      <p>The giant sequoia's advantage is that the fire that kills its competitors spares it.</p>

      <p>
        Fire scars on old sequoias read like tree rings in reverse. The park's naturalists were reading them a century ago. "Scars of the Giant Sequoia," in <em>Nature Notes</em> Vol. 8, No. 4 (1929), reports that every mature tree in the Mariposa Grove had been "burned well into the heartwood at the base of their massive trunks," and that the grove's most prominent trees were the most severely burned of all, "probably because they have witnessed a greater number of fires during the centuries before the less affected trees sprouted into existence." Fire scarring, in other words, tracked a tree's age rather than its bad luck. The tree is adapted so thoroughly that fire works in its favor.
      </p>

      <h2>The chemistry of survival</h2>

      <p>
        Giant sequoia bark contains a substance called tannin, present in concentrations high enough to make the wood itself quite resistant to flame. More important, the bark is thick. By the time a sequoia has grown to what we might call mature (three centuries, give or take), its bark can be two feet deep. It's so loose and fibrous that it barely conducts heat inward. A fire roars across the surface, chars the outer layer, and that charring actually insulates the living wood beneath it from the heat of the blaze.
      </p>

      <p>
        Compare this to a white fir or sugar pine. Those trees have thinner, tighter bark, poor insulation, and less tannin. When a ground fire passes through (and it will pass through; fire is a recurring event in this forest), it only takes ten or twenty minutes of sustained heat to kill the cambium layer under the bark. The tree dies.
      </p>

      <p>
        The sequoia, meanwhile, experiences those same twenty minutes of heat and sustains a scar. The wood chars, yes. The bark darkens. But the living tissue survives. A year later, the tree will have compartmentalized the wound and resumed growth. By the time that same sequoia has lived for a thousand years, it may carry the scars of five or six separate burns across its trunk.
      </p>

      <p>
        This is the result of selection. The trees that couldn't survive fire didn't become dominant in the mixed forest of the Sierra Nevada high country. The ones that could did.
      </p>

      <h2>How fire kills what sequoias escape</h2>

      <p>
        The forest ecology of Yosemite is legible if you understand that fire is not a disturbance to be prevented but a part of the system's normal operation. Where a meadow holds no trees, it is often because fire repeatedly cleared competing species from space that would otherwise fill with white fir and incense cedar.
      </p>

      <p>
        When a fire burns through a mixed coniferous forest, the outcome depends on the fire's intensity and duration, but also on which trees are present. A low-intensity fire, creeping through the understory at ground level, will pass beneath the canopy of tall conifers, consuming brush and fallen logs and the lower branches of smaller trees. In a forest without sequoias, white fir and Douglas-fir can survive this kind of fire, though often with damage. The fire also creates ideal conditions for sequoia seedlings. Sequoia seeds are no bigger than an oat seed. They need bare mineral soil to establish. They need light, which fire provides by removing competing vegetation. They don't need deep soil. A sequoia can grow in the ash-enriched soil immediately following a burn.
      </p>

      <p>
        The trees that were killed or damaged by that fire were competing for the same space. They are gone now, or weakened. The sequoia grows into that opening, unchallenged.
      </p>

      <p>
        In a fire-suppressed forest, the opposite occurs. Without periodic burning, shade-tolerant conifers like white fir gradually colonize the understory. They grow taller. They accumulate more fuel. The canopy closes, and sequoia seedlings are starved of the light they need. They never establish. A sequoia grove without fire is a sequoia grove in slow decline.
      </p>

      <figure style={{ margin: "30px 0 34px" }}>
        <TwoForests />
        <figcaption style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", marginTop: 10 }}>
          The same grove under two fire regimes, drawn from this article's account. A diagram of the argument, not of any one grove.
        </figcaption>
      </figure>

      <p>
        The dynamic shows up wherever a grove has burned and then been left alone: seedlings and saplings come up thickest in the openings a fire has cleared, on the bare mineral soil it exposed. Those young trees are the forest regenerating as it had for thousands of years before the suppression era.
      </p>

      <h2>Reading fire history in bark</h2>

      <p>
        Stand in front of a heavily scarred sequoia and you're looking at a tree that has faced multiple fires and survived them all. The scars don't heal seamlessly. A fire scar creates a permanent wound, an open place in the bark where the wood is exposed. That wound doesn't close over. Instead, the tree grows around it, and with each passing year, the bark on either side of the scar advances toward center, but never quite reaches it. The result is a scar that remains visible for centuries.
      </p>

      <p>
        Dating these scars is possible, though it requires patience. You count the rings in the wood surrounding the scar, but more usefully, you observe the scar's shape and depth. Scars from fires that burned cooler or for shorter durations are shallow. Scars from intense, long-duration fires are deep, sometimes penetrating several feet into the sapwood. A fire-scarred sequoia that's two thousand years old might carry eight or ten distinct scars, each one corresponding to a fire that the tree survived while nearly everything around it did not.
      </p>

      <p>
        This is how we know that fire frequency in Yosemite has changed. Trees that germinated in the 1600s grew in a forest that burned roughly every ten to thirty years. Trees that germinated in the 1900s grew in a forest where fire suppression had become official policy. The ring patterns shift. The scar patterns shift. The composition of the forest itself shifts.
      </p>

      <h2>What changed, and why it matters</h2>

      <p>
        For about a hundred and fifty years, the policy governing Yosemite National Park was clear: prevent fire at all costs. This made intuitive sense to early park managers. Fire was dangerous. Fire destroyed trees. And for a sequoia grove, which exists in the western imagination as a kind of cathedral, the idea of letting the cathedral burn was unthinkable.
      </p>

      <p>The policy did not account for the fact that the groves had been burning regularly for two thousand years.</p>

      <p>
        In the absence of fire, the forest changed. Shade-tolerant species colonized the understory. Fuel accumulated on the ground: dead wood, needles, smaller branches. The forest became denser, darker. Sequoia seedlings couldn't find the light they needed. And simultaneously, if a fire did occur despite prevention efforts, it would be hotter, longer, and more devastating than the low-intensity fires that had shaped this ecosystem for millennia. (This is the chain of consequence behind <a href="/articles/yosemite-during-smoke-season">the smoke seasons</a> California now sees most years: a century of suppression created the fuel load for the megafires that put gauze over the sky every summer.)
      </p>

      <p>
        The shift in understanding began slowly, with observations like those recorded in 1929, and has continued since. Today, land managers in Yosemite accept fire as a necessity. Restoration burns are now part of the standard practice in groves like Mariposa, Tuolumne, and Merced. These burns are carefully planned, timed for weather conditions that keep them low-intensity, and intended to mimic the fire regimes that shaped these forests before fire suppression began.
      </p>

      <p>The burns return the conditions the sequoias evolved under.</p>

      <NatureNotesFilm id="giant-sequoias" title="Giant Sequoias" youtubeId="dVx4XdT7qrk" episode={34}
        note="The Park Service on a tree built to survive almost anything, and on the changing climate now testing the design." location="article" />

      <h2>The practical reading</h2>

      <p>
        If you hike into a sequoia grove (or visit via the <a href="/articles/yosemite-for-non-hikers">accessible lower loop</a> in the Mariposa Grove, whose shuttle, parking and trails are covered in <a href="/articles/mariposa-grove-how-to-visit">the guide to visiting the grove</a>), take time to find a heavily scarred tree and place your hand against the bark. That char is old. That blackness has been there for centuries, protecting the wood beneath it. The scar will probably be slightly depressed, outlined by rings of new bark that the tree grew after the fire passed. If the scar is deep, you can sometimes work your fingers into it. You're reading a specific moment in the tree's life when fire came and the tree lived.
      </p>

      <p>
        Count the scars if you can. Try to gauge which ones are oldest (they're usually the deepest, the most weathered, the most integrated into the tree's form). Then consider which trees on the slope below did not survive that fire, and why this one did.
      </p>

      <p>
        The sequoia doesn't call attention to its scars. It carries them. The forest's largest trees are exceptional because of the fires they endure.
      </p>

      <h3>Further reading</h3>
      <ul style={{ fontSize: 14 }}>
        <li><em>Nature Notes</em> Vol. 8, No. 4 (1929). "Scars of the Giant Sequoia": fire damage at the base of the Mariposa Grove's named trees, including the Corridor Tree and the Grizzly Giant. <a href="/archive/1929/vol-8-no-4/">Read it in the archive</a>.</li>
        <li>Park historical documentation on the transition from fire suppression policy to active restoration burning in Yosemite's sequoia groves.</li>
        <li><em>Sequoiadendron giganteum</em> fire adaptation literature, available through the park's reference library.</li>
      </ul>
    </>
  );
};
