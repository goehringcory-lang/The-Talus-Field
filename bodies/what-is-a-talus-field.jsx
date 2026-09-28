/* global React, Placeholder, MotifMountains, NatureNotesFilm */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

window.ARTICLE_BODIES["what-is-a-talus-field"] = function WhatIsATalusFieldBody() {
  // ── Explainer graphic (September 2026 visual pass). Every fact in it is
  // stated in the body below; the figcaption says so.
  const SVG_STYLE = { width: "100%", height: "auto", display: "block" };
  const T_HEAD = { fontFamily: "var(--sans)", fontSize: 12.5, fontWeight: 600, letterSpacing: 1.1, fill: "var(--rust)" };
  const T_BODY = { fontFamily: "var(--sans)", fontSize: 14, fill: "var(--ink)" };
  const T_SOFT = { fontFamily: "var(--sans)", fontSize: 13, fill: "var(--ink-2)" };
  const T_BIG = { fontFamily: "var(--serif)", fontSize: 19, fill: "var(--ink)" };

  // A cross-section of a Valley wall and the talus at its foot. The slope is
  // drawn at about 32 degrees, inside the 30 to 35 the body gives; everything
  // else is schematic.
  function TalusSection() {
    const W = 600, H = 470, BASE = 430;
    // Blocks along the slope: [x, y, size, fresh]. Hand-placed, angular.
    const blocks = [
      [214, 272, 16, 1], [236, 288, 12, 1], [226, 312, 20, 0], [256, 306, 14, 1], [250, 334, 18, 0],
      [278, 330, 12, 0], [274, 358, 22, 0], [302, 356, 16, 0], [298, 384, 18, 0], [326, 378, 14, 0],
      [322, 404, 20, 0], [350, 398, 12, 0], [352, 418, 14, 0], [376, 412, 16, 0], [400, 422, 12, 0],
      [230, 364, 16, 0], [262, 392, 20, 0], [240, 404, 22, 0], [290, 414, 16, 0], [216, 418, 14, 0],
    ];
    const poly = (x, y, s) => `${x},${y} ${x + s},${y - s * 0.25} ${x + s * 1.1},${y + s * 0.6} ${x + s * 0.2},${y + s * 0.8}`;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={SVG_STYLE} role="img"
        aria-label="Cross-section of a talus field. A granite cliff on the left is cut by joints, the fracture planes where water freezes, expands and wedges blocks loose, and it sheds curved exfoliation sheets from its face. A block falls from the cliff and lands on the slope below. The slope of broken, angular blocks stands at the angle of repose, about 30 to 35 degrees for Sierra granite. Pale, unlichened blocks near the top are recent rockfall and the least trustworthy footing; grey-green lichened blocks are decades old. At the foot of the slope the flat meadow soil begins.">
        {/* The cliff */}
        <path d={`M0 20 L188 20 C 196 120, 200 200, 208 262 L 208 ${BASE} L 0 ${BASE} Z`} fill="var(--paper-2)" stroke="var(--ink-3)" strokeWidth="1.5" />
        {[[0, 70, 150, 90], [0, 130, 170, 150], [20, 200, 190, 212], [0, 262, 120, 280]].map(([a, b, c, d]) => (
          <line key={b} x1={a} y1={b} x2={c} y2={d} stroke="var(--ink-3)" strokeWidth="1.2" />
        ))}
        {[[60, 20, 70, 130], [120, 90, 128, 210]].map(([a, b, c, d]) => (
          <line key={a} x1={a} y1={b} x2={c} y2={d} stroke="var(--ink-3)" strokeWidth="1.2" />
        ))}
        {/* An exfoliation sheet peeling off the face */}
        <path d="M176 40 C 186 90, 190 130, 192 170" fill="none" stroke="var(--rust)" strokeWidth="3" />
        {/* The falling block */}
        <path d="M196 120 C 230 150, 250 200, 258 250" fill="none" stroke="var(--ink-3)" strokeWidth="1.3" strokeDasharray="4 5" />
        <polygon points={poly(252, 244, 14)} fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.3" />
        {/* The slope and its blocks */}
        <path d={`M208 262 L 486 ${BASE} L 208 ${BASE} Z`} fill="var(--paper-2)" />
        {blocks.map(([x, y, s, fresh], i) => (
          <polygon key={i} points={poly(x, y, s)} fill={fresh ? "var(--paper)" : "var(--moss)"} fillOpacity={fresh ? 1 : 0.35} stroke="var(--ink)" strokeWidth="1" />
        ))}
        <line x1="208" y1="262" x2="486" y2={BASE} stroke="var(--ink)" strokeWidth="1.5" />
        {/* Meadow floor and the angle */}
        <line x1="208" y1={BASE} x2={W} y2={BASE} stroke="var(--ink)" strokeWidth="1.5" />
        <path d={`M 426 ${BASE} A 60 60 0 0 1 435 ${BASE - 31}`} fill="none" stroke="var(--rust)" strokeWidth="2" />
        <text x="500" y={BASE - 12} style={{ ...T_BODY, fontWeight: 600, fill: "var(--rust)" }}>30 to 35°</text>
        <text x="496" y={BASE + 24} style={T_SOFT}>meadow soil</text>
        <text x="236" y={BASE + 24} style={T_SOFT}>the talus field</text>
        {/* Labels, right of the cliff */}
        <text x="300" y="40" style={T_HEAD}>JOINTS</text>
        <text x="300" y="60" style={T_SOFT}>Water works in, freezes, expands:</text>
        <text x="300" y="78" style={T_SOFT}>a slow wedge.</text>
        <text x="300" y="106" style={T_HEAD}>EXFOLIATION</text>
        <text x="300" y="126" style={T_SOFT}>Granite sheds in curved sheets.</text>
        <text x="300" y="154" style={T_HEAD}>ROCKFALL</text>
        <text x="300" y="174" style={T_SOFT}>Recorded every year. A block</text>
        <text x="300" y="192" style={T_SOFT}>fell, hit, and stopped: angular.</text>
        <text x="300" y="220" style={T_HEAD}>THE ANGLE OF REPOSE</text>
        <text x="300" y="240" style={T_SOFT}>The steepest slope loose rock holds.</text>
        <g>
          <rect x="300" y="256" width="14" height="14" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1" />
          <text x="322" y="268" style={T_SOFT}>pale, unlichened: recent</text>
          <rect x="300" y="280" width="14" height="14" fill="var(--moss)" fillOpacity="0.35" stroke="var(--ink)" strokeWidth="1" />
          <text x="322" y="292" style={T_SOFT}>grey-green lichen: decades</text>
        </g>
      </svg>
    );
  }

  return (
    <>
      <p className="dropcap">
        Walk to the base of almost any cliff in Yosemite Valley and the ground changes under you. The flat meadow soil gives way to a slope of broken rock: blocks the size of dinner plates, blocks the size of cars, piled at an angle that feels deliberate and is not. That slope is a talus field. It is the most common landform in the Valley that visitors never learn the name of, and it is the thing this journal is named after.
      </p>

      <h2>What a talus field is</h2>

      <p>
        A <strong>talus field</strong> is an accumulation of rock fragments at the base of a cliff, built by repeated rockfall over a long time. The individual pieces are talus; the slope they form is a talus field, sometimes called a talus slope or a scree slope. Geologists distinguish talus (coarse, angular, block-sized) from scree (finer, gravel-sized), though in ordinary speech the words are used interchangeably and nobody minds.
      </p>

      <p>
        The defining feature is the angle. Loose angular rock piles up until it reaches the steepest slope it can hold without sliding, and then it stops. That limit is the <strong>angle of repose</strong>, and for Sierra granite blocks it lands somewhere between about 30 and 35 degrees. Every talus field you have ever seen is sitting at roughly the same angle, which is why they all look related from across a valley. Friction sets that shape.
      </p>

      <p>
        The blocks are angular rather than rounded because they have not travelled far or been worked by water. A river cobble is smooth because it has been tumbled for miles. A talus block fell, hit, and stopped. The sharp edges show the rock has not moved far from where it broke off.
      </p>

      <h2>How Yosemite builds them</h2>

      <p>
        Yosemite makes talus faster than most landscapes, because it has more cliff than most landscapes. The Valley's walls were steepened by glaciers that have since gone, and steep granite without ice to support it sheds rock.
      </p>

      <p>
        The mechanism is mostly water and cold. Rain and snowmelt work into the joints, the natural fracture planes that run through granite in sheets and blocks. Water expands when it freezes, so a wet joint in a freezing night is a slow wedge. Do that a few thousand times and a block that was part of the cliff becomes a block resting against it. Then some ordinary morning, it is not resting against anything.
      </p>

      <p>
        The other mechanism is the granite's own habit of shedding in curved sheets, exfoliation, which is why Half Dome and Royal Arches look the way they do. A sheet lets go, and what lands below is a fresh apron of pale rock that has not weathered yet. You can date a rockfall roughly by colour: bright white scars and light blocks are recent, and the grey-green of lichen takes decades to arrive.
      </p>

      <figure>
        <TalusSection />
        <figcaption>How a talus field is built, drawn from this article. Schematic, not to scale; the slope is drawn inside the 30 to 35 degrees Sierra granite holds.</figcaption>
      </figure>


      <p>
        Rockfall is not a historical event in this park. It is a current one. The Park Service records rockfalls every year, and the talus below <a href="/articles/watching-climbers-el-capitan">El Capitan</a> and the Rhombus Wall and the Glacier Point Apron is still being added to. <a href="/articles/yosemite-glaciers-climate">The glaciers</a> did the carving; the rockfall does the ongoing demolition.
      </p>

      <NatureNotesFilm
        id="rock-fall"
        title="Rock Fall"
        youtubeId="H0YhlqP1BgE"
        episode={10}
        note="The Park Service's film on the process that builds every talus slope in the Valley, and so the one this journal is named for."
        location="article"
      />


      <h2>Where to see one</h2>

      <p>
        You will not have to look. From the Valley floor the talus is the skirt at the bottom of every wall, most obviously below the Rhombus Wall east of Camp 4, below the Glacier Point Apron behind Half Dome Village, and along the base of the north wall between the Three Brothers and Yosemite Falls. The road and the bike paths run across old talus in several places without announcing it.
      </p>

      <p>
        The one to walk is the approach to <a href="/articles/mist-trail-the-real-guide">the Mist Trail</a> and the lower Yosemite Falls trail, both of which cross talus that has been improved into a staircase. If you want the untouched version, look up at the base of Middle Cathedral from the meadow across the road: acres of angular blocks at the same tidy angle, with pines growing out of the gaps.
      </p>

      <p>
        Higher up, talus becomes habitat. The blocky slopes above 8,000 feet along <a href="/tioga-opening">Tioga Road</a> are where pikas live, in the cold air spaces between rocks, and where marmots sun themselves on the flat tops. A talus field in the high country is not empty ground. It is an address.
      </p>

      <h2>Walking on talus</h2>

      <p>
        Talus is stable until it is not, and the failure mode is a block rolling under your weight with a tonne of rock stacked above it. Three rules from people who spend time on it. Step on the tops of blocks rather than the gaps, because a foot wedged between two rocks is how ankles break. Move one at a time in a group, or spread out sideways rather than climbing in a line, so nothing anyone dislodges is heading for a friend. And treat fresh, pale, unlichened rock as the least trustworthy surface on the slope: it is there because that part of the mountain moved recently.
      </p>

      <p>
        Nothing in the Valley requires you to cross untracked talus, which is worth knowing before someone suggests a shortcut. The maintained trails that cross it have already done the hard part.
      </p>

      <h2>Why the journal is called The Talus Field</h2>

      <p>
        Because a talus field is what accumulates. No single rockfall builds one. Each block arrives on its own schedule, from a cliff that looks permanent and is not, and the pile at the bottom is the record of every one of them. Stand on it and you are standing on a few hundred thousand years of small events that nobody was there to see.
      </p>

      <p>
        That is what a field journal is for. One entry is a note about a road opening or a bear in a parking lot or the week the dogwoods came out. None of them is the park. Enough of them, kept honestly over enough seasons, start to describe a place that is changing faster than it looks like it is.
      </p>

      <p>
        It also happens to be the landform I can see from the house. That is the other half of the answer, and the more truthful one.
      </p>

      <h3>Sources</h3>
      <ul style={{ fontSize: 14 }}>
        <li>National Park Service, Yosemite: rockfall monitoring and geology programs.</li>
        <li>Huber, N. King, <em>The Geologic Story of Yosemite National Park</em>, U.S. Geological Survey Bulletin 1595.</li>
        <li>Field observation, El Portal and Yosemite Valley.</li>
      </ul>
    </>
  );
};
