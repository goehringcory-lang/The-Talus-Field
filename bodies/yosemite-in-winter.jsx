/* global React, AffiliateNote, LodgingCta, NatureNotesFilm */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

window.ARTICLE_BODIES["yosemite-in-winter"] = function YosemiteInWinterBody() {
  // ── Explainer graphic (September 2026 visual pass). Every fact in it is
  // stated in the body below; the figcaption says so.
  const SVG_STYLE = { width: "100%", height: "auto", display: "block" };
  const T_HEAD = { fontFamily: "var(--sans)", fontSize: 12.5, fontWeight: 600, letterSpacing: 1.1, fill: "var(--rust)" };
  const T_BODY = { fontFamily: "var(--sans)", fontSize: 14, fill: "var(--ink)" };
  const T_SOFT = { fontFamily: "var(--sans)", fontSize: 13, fill: "var(--ink-2)" };
  const T_BIG = { fontFamily: "var(--serif)", fontSize: 19, fill: "var(--ink)" };

  // The chain-control grid: the three levels against three kinds of car.
  // "Carry" is the rule that catches people: an exempt vehicle still needs
  // chains on board whenever control is in effect inside the park.
  function ChainGrid() {
    const W = 600, LX = 96, CW = (W - LX) / 3, TOP = 78, RH = 92;
    const cols = [["No snow tires", "any drive"], ["Snow tires", "no 4WD or AWD"], ["Snow tires", "4WD or AWD"]];
    const rows = [
      { lvl: "R1", sub: "chains unless snow tires", cells: ["on", "carry", "carry"] },
      { lvl: "R2", sub: "unless 4WD/AWD + snow tires", cells: ["on", "on", "carry"] },
      { lvl: "R3", sub: "chains on everything", cells: ["on", "on", "on"] },
    ];
    const LABEL = { on: ["Chains on", "mounted"], carry: ["Carry chains", "in the car"] };
    return (
      <svg viewBox={`0 0 ${W} ${TOP + rows.length * RH + 62}`} style={SVG_STYLE} role="img"
        aria-label="Chain control in Yosemite, by level and vehicle. R1: chains are required unless the vehicle has snow tires, so a car without snow tires mounts chains, and any car with snow tires carries them. R2: chains are required unless the vehicle has four-wheel or all-wheel drive with snow tires, so only a 4WD or AWD vehicle with snow tires may carry rather than mount them. R3: chains on everything, no exceptions; in practice roads usually close before R3 is posted. Whenever chain control is in effect inside the park, every vehicle must carry chains, even one exempt from putting them on.">
        {cols.map(([a, b], i) => (
          <g key={a + b}>
            <text x={LX + i * CW + CW / 2} y="30" textAnchor="middle" style={{ ...T_BODY, fontWeight: 600 }}>{a}</text>
            <text x={LX + i * CW + CW / 2} y="50" textAnchor="middle" style={T_SOFT}>{b}</text>
          </g>
        ))}
        {rows.map((r, j) => {
          const y = TOP + j * RH;
          return (
            <g key={r.lvl}>
              <text x="0" y={y + 44} style={{ fontFamily: "var(--serif)", fontSize: 32, fill: "var(--ink)" }}>{r.lvl}</text>
              {r.cells.map((c, i) => {
                const x = LX + i * CW;
                const on = c === "on";
                return (
                  <g key={i}>
                    <rect x={x + 5} y={y + 5} width={CW - 10} height={RH - 30} rx="3"
                      fill={on ? "var(--rust)" : "var(--paper-2)"} stroke={on ? "var(--rust)" : "var(--moss)"} strokeWidth="1.5" />
                    <text x={x + CW / 2} y={y + 32} textAnchor="middle" style={{ ...T_BODY, fontWeight: 600, fill: on ? "var(--paper)" : "var(--moss)" }}>{LABEL[c][0]}</text>
                    <text x={x + CW / 2} y={y + 51} textAnchor="middle" style={{ ...T_SOFT, fill: on ? "var(--paper)" : "var(--ink-2)" }}>{LABEL[c][1]}</text>
                  </g>
                );
              })}
              <text x={LX + 5} y={y + RH - 8} style={{ ...T_SOFT, fontSize: 12.5, fontStyle: "italic" }}>{r.lvl}: {r.sub}{r.lvl === "R3" ? "; roads usually close first" : ""}</text>
            </g>
          );
        })}
        <text x="0" y={TOP + rows.length * RH + 24} style={T_HEAD}>THE RULE THAT CATCHES PEOPLE</text>
        <text x="0" y={TOP + rows.length * RH + 46} style={T_BODY}>Inside the park, every vehicle carries chains whenever control is on.</text>
      </svg>
    );
  }

  return (
    <>
      <p className="dropcap">
        I live in El Portal, two thousand feet below the Valley floor in the Merced River canyon, and for twenty seasons I have watched the same thing happen every November. The park empties. The tour buses stop coming. The trailhead lots that required a 6 a.m. arrival in July sit half full at noon. And then, some night in late November or December, a storm comes through, the clouds pull apart the next morning, and Yosemite Valley is standing there under fresh snow with almost nobody looking at it. Most visitors plan around summer and skip these months, which is why they are empty.
      </p>

      <p>
        This is a practical guide to Yosemite in winter: what is actually open, how to drive in without drama, what there is to do, and the costs of the season.
      </p>

      <h2>What's open, what's closed</h2>

      <p>
        The most important fact of winter planning is a simple one: <strong>Yosemite Valley is open year-round</strong>. The Valley floor sits at about 4,000 feet, low enough that snow falls, sticks for a while, and usually melts back off the roads within days. Plowed roads reach Yosemite Valley, Wawona, Hetch Hetchy, and Badger Pass all winter. Lodging, food service, the visitor center, and the shuttle keep running. Winter closes the high country, not the park.
      </p>

      <p>
        <strong>Tioga Road</strong>, the high crossing through Tuolumne Meadows, closes with the first serious snow, typically in November, and does not reopen until late May or later, depending on the snowpack. <strong>Glacier Point Road</strong> closes on roughly the same schedule beyond the Badger Pass turnoff. If your mental map of Yosemite includes Olmsted Point, Tenaya Lake, or the drive-up view from Glacier Point, subtract them from a winter trip. They are under snow, and the only way to reach them is on skis or snowshoes.
      </p>

      <p>
        The <strong>Mariposa Grove</strong> splits the difference. The road up to the grove closes for the season, but the grove itself stays open. You walk, snowshoe, or ski the closed road, roughly two miles each way from the Welcome Plaza, and the reward is giant sequoias holding snow on their branches with a fraction of the summer crowd. Few visitors see sequoias in snow.
      </p>

      <h2>Driving in: the canyon road and the chain rules</h2>

      <p>
        It is the road past my house, but <strong>Highway 140</strong> through the Merced River canyon is the lowest and most reliable winter approach to the park. It follows the river up from Mariposa at canyon-bottom elevations, which means it takes rain when the higher entrances are taking snow. Storms still close it occasionally, and chain control still reaches it, but on an average winter day it is the entrance with the least weather on it. The other approaches, Highway 41 from Oakhurst and Highway 120 from Groveland, both climb well over 5,000 feet before dropping to the Valley and carry chain control more often. The full entrance-by-entrance comparison is in <a href="/articles/getting-to-yosemite">the entrances guide</a>; the winter summary is: take 140 if you can.
      </p>

      <p>
        <strong>Chain control</strong> is the part of winter driving that surprises first-time visitors, so here it is. When conditions warrant, Caltrans and the park post chain requirements at checkpoints, in three levels. <strong>R1</strong> means chains are required unless you have snow tires. <strong>R2</strong> means chains are required unless you have four-wheel or all-wheel drive with snow tires. <strong>R3</strong> means chains on everything, no exceptions, and in practice roads usually just close before R3 is posted.
      </p>

      <p>
        The detail that catches people: whenever chain control is in effect inside the park, <strong>you must carry chains even if your vehicle is exempt from putting them on</strong>. A 4WD truck with snow tires can drive through R2 without chains mounted, but the driver still needs a set in the vehicle, and rangers do check at the checkpoints. Rental-car agreements almost universally prohibit chains, which is a problem between you and the rental company, not one the checkpoint will solve for you. Chains can be bought or rented in the gateway towns, Mariposa, Oakhurst, Groveland, and shops along 140 will often rent a set and take it back on your way out. Practice putting them on once in a dry parking lot, not for the first time in a snowbank at night. The <a href="/articles/pack-your-car-for-yosemite">winter car kit</a> covers the rest of what should be in the trunk.
      </p>

      <figure>
        <ChainGrid />
        <figcaption>Chain control by level and vehicle, drawn from the rules in this article. Rental agreements almost universally prohibit chains, which is between you and the rental company.</figcaption>
      </figure>


      <blockquote>The checkpoint does not care what your all-wheel-drive badge says. Carry the chains.</blockquote>

      <h2>Badger Pass, the small ski area that stayed small</h2>

      <p>
        <strong>Badger Pass Ski Area</strong>, on the open lower stretch of Glacier Point Road, is one of the oldest ski areas in California, operating since the 1930s, and it has stayed deliberately small: a handful of lifts, a modest vertical, gentle terrain, a day lodge. Nobody flies in for it. It is a family-scaled hill where lessons are cheap by ski-industry standards, kids learn without being run over, and the lift line conversation is about the park rather than the snow report. If your measure of a ski area is terrain steepness, go to Tahoe. If your measure is teaching a seven-year-old to snowplow inside a national park, Badger is close to ideal.
      </p>

      <p>
        Badger matters even if you never ride a lift, because it is the <strong>trailhead for the winter high country</strong>. The closed section of Glacier Point Road becomes a groomed ski track, and the marked winter routes into the Glacier Point backcountry all start from the Badger parking lot. Rentals for skis and snowshoes are available at the lodge. It is the only place in the park with real winter infrastructure.
      </p>

      <h2>Snowshoeing: Dewey Point and the ranger walks</h2>

      <p>
        The signature winter day trip in Yosemite is <strong>Dewey Point</strong>. From Badger Pass you follow the groomed road, then a marked snow route through the forest to the Valley rim, and the trees open onto a straight-down view of the Valley with El Capitan across it. It runs about seven miles round trip depending on the route variant, an honest half-day on snowshoes for a reasonably fit party. In July, Dewey Point is a viewpoint. In February it is a snowbound one few people reach.
      </p>

      <p>
        For a gentler entry, the park offers <strong>ranger-led snowshoe walks</strong> from Badger Pass through the winter season, typically two hours through the woods near the ski area, with snowshoes provided for a small fee. They are good value, with the ranger stopping to point out marten tracks and explain how a fir survives under ten feet of snow. Check the current Yosemite Guide or the <a href="/conditions">conditions page</a> for schedules before you drive up.
      </p>

      <h2>The rink under Half Dome</h2>

      <p>
        The <strong>Curry Village ice rink</strong> is an outdoor rink on the Valley floor where you skate loops while Half Dome stands overhead in winter light, with a fire pit at the edge for the between-sessions thaw. Skating has been happening at Curry Village for roughly a century, and it remains cheap, low-key, and better at dusk than at any other hour, when the granite goes pink and the rink lights come on. It is the rare Yosemite activity that works with small children, bad knees, and no planning.
      </p>

      <h2>The photography season</h2>

      <p>
        The strongest case for winter needs no infrastructure: <strong>clearing storms are the best photographic conditions Yosemite offers</strong>, and winter is when they happen. A storm breaks up over the Valley, fog tears off the walls, snow outlines every ledge on El Capitan, and for an hour or two the place looks the way it did in the photographs that made it famous. Residents watch the radar and drive up for the clearing, and you can do a modest version of the same thing: if the forecast shows a storm ending mid-morning, be at Tunnel View when it does. Where to stand and when is covered in <a href="/articles/yosemite-photography-spots">the photography guide</a>.
      </p>

      <p>
        And February brings the park's oddest scheduled event. For about two weeks in the middle of the month, when the angle of sunset is right and the fall is running and the sky cooperates, <strong>Horsetail Fall</strong> on the east shoulder of El Capitan lights up orange at the last minute of the day and appears, briefly, to be on fire. The firefall draws real crowds, and drew a February weekend reservation requirement for four straight years before the park dropped it for 2026, which makes it the exception to everything else in this article; the full logistics are in <a href="/firefall">the Horsetail Fall guide</a>, and <a href="/firefall">the firefall page</a> carries whatever rules the park sets for the current season.
      </p>

      <h2>The honest part</h2>

      <p>
        The days are short: the sun clears the Valley rim late and drops behind it early, and the deep sections of the floor hold shade, and therefore <strong>black ice</strong>, all day. The paths around Curry Village and the base of the falls glaze over and stay glazed. Traction cleats for your boots cost little and prevent the most common winter injury in the park, a fall on a paved path. Valley <strong>inversions</strong> park cold air and fog on the floor for days at a time, so a gray, raw morning in the Valley is often a blue one at Badger Pass, a thousand-plus feet higher.
      </p>

      <p>
        In exchange: the crowds are gone in a way no summer strategy can simulate. Lodging that books out months ahead in July has winter availability at winter prices, and the trade-offs between staying in the park and staying down the canyon are laid out in <a href="/articles/where-to-stay-in-yosemite">the lodging guide</a>. You will often have viewpoints to yourself.
      </p>

      <p>
        For once, the numbers. The concessioner's own winter promotions, as published on its specials page this September, put a floor under the season: <strong>the Ahwahnee from $389</strong> on select two-night stays (code WINTER2027, suites excluded), <strong>Yosemite Valley Lodge as low as $172</strong> on stays of two nights or more (code WNTRYVL), and <strong>Curry Village as low as $95 a night</strong> (code WNTR26). All three run on select dates from late November through March 25, Curry Village from December 13, and all three carry the same two blackout windows, which tell you exactly when the park expects a crowd: <a href="/articles/yosemite-in-december">the December holiday week</a>, December 23 through January 2, and February 12 through 20, the firefall's peak and Presidents' Day weekend. The first night is due at booking and refundable up to seven days out. Rates move with the date, so treat these as the low end rather than a promise, and check <a href="https://www.travelyosemite.com/special-offers/specials-packages" target="_blank" rel="noopener noreferrer">the specials page</a> for what is actually on offer when you book.
      </p>

      <p>
        The waterfalls, mostly asleep since August, begin to come back in late winter as early melt and rain reach the Merced. By <a href="/articles/yosemite-in-march">March</a>, Yosemite Falls is a waterfall again rather than a stain, and the whole hydrological year described in <a href="/articles/yosemite-waterfalls-guide">the waterfalls guide</a> starts over. Late winter also brings one of the park's oddest small phenomena: on the coldest early-spring mornings, Yosemite Creek can run with <strong>frazil ice</strong>, a slush of ice crystals that moves down the channel like slow lava and piles into banks of white. It is a niche thing to chase, and it marks the end of the quiet season.
      </p>

      <NatureNotesFilm
        id="frazil-ice"
        title="Frazil Ice"
        youtubeId="9V9p4mFEYXc"
        episode={9}
        note="The park filmed the slush on Yosemite Creek, which is the easiest way to see it without standing beside the creek on a freezing spring morning."
        location="article"
      />


      <h2>The takeaway</h2>

      <p>
        Come up 140 with chains in the trunk. Stay two nights in or near the Valley. Skate at dusk, snowshoe to Dewey Point or walk into the Mariposa Grove, and watch the weather for a clearing storm. If it is February, look at Horsetail Fall like everyone else, then notice that the other twenty-seven days of the month you have the place nearly to yourself.
      </p>

      <p>Twenty seasons in, winter is still the season I recommend first.</p>

      <LodgingCta
        destination="Yosemite National Park"
        heading="Winter is when the rooms exist"
        note="This is the one season where the advice is not 'book a year out'. The seasonal operations close, rates drop, and midweek availability in January is a different universe from July. A search on your dates is the fastest way to see that for yourself."
        list="article_cta"
        slug="yosemite-in-winter"
        cta="Search winter lodging around Yosemite →"
      />

      <AffiliateNote />

      <h3>Sources</h3>
      <ul style={{ fontSize: 14 }}>
        <li><a href="https://www.nps.gov/yose/planyourvisit/winter.htm" target="_blank" rel="noopener noreferrer">Winter in Yosemite, NPS Yosemite</a></li>
        <li><a href="https://www.nps.gov/yose/planyourvisit/tirechains.htm" target="_blank" rel="noopener noreferrer">Tire Chain Requirements, NPS Yosemite</a></li>
        <li><a href="https://www.travelyosemite.com/winter/badger-pass-ski-area" target="_blank" rel="noopener noreferrer">Badger Pass Ski Area, Travel Yosemite</a></li>
        <li><a href="https://www.nps.gov/yose/planyourvisit/seasonal.htm" target="_blank" rel="noopener noreferrer">Seasonal Road Closures, NPS Yosemite</a></li>
        <li><a href="https://www.travelyosemite.com/special-offers/specials-packages" target="_blank" rel="noopener noreferrer">Specials &amp; Packages, Travel Yosemite (winter 2026-27 lodging promotions, as published September 2026)</a></li>
      </ul>
    </>
  );
};
