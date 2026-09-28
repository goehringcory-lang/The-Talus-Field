/* global React, Placeholder, MotifMountains, NatureNotesFilm */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

window.ARTICLE_BODIES["yosemite-wilderness-permits-guide"] = function YosemiteWildernessPermitsGuideBody() {
  // ── Explainer graphic (September 2026 visual pass). Every fact in it is
  // stated in the body below; the figcaption says so.
  const SVG_STYLE = { width: "100%", height: "auto", display: "block" };
  const T_HEAD = { fontFamily: "var(--sans)", fontSize: 12.5, fontWeight: 600, letterSpacing: 1.1, fill: "var(--rust)" };
  const T_BODY = { fontFamily: "var(--sans)", fontSize: 14, fill: "var(--ink)" };
  const T_SOFT = { fontFamily: "var(--sans)", fontSize: 13, fill: "var(--ink-2)" };
  const T_BIG = { fontFamily: "var(--serif)", fontSize: 19, fill: "var(--ink)" };

  // The permit calendar: how one trailhead's daily quota is split, and the
  // three dates that matter. Vertical so it stays legible on a phone.
  function PermitCalendar() {
    const W = 600, H = 500;
    const steps = [
      { y: 150, head: "24 WEEKS BEFORE THE START DATE", lines: ["The weekly lottery on Recreation.gov: 60 percent", "Applications open Sunday, close Saturday, process the day after", "$10 to apply, plus $5 per person if you win"] },
      { y: 270, head: "7 DAYS BEFORE, AT 7 A.M. PACIFIC", lines: ["The other 40 percent goes online", "First come, first served", "Famous trailheads go in minutes; others linger for days"] },
      { y: 390, head: "THE START DATE", lines: ["Collect the permit at a wilderness center, 8 to 11 a.m.", "A late-arrival hold extends pickup to 5 p.m.", "Uncollected, it can go to the next person in line"] },
    ];
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={SVG_STYLE} role="img"
        aria-label="How a Yosemite wilderness permit is allocated. Each trailhead's daily quota is split: 60 percent by weekly lottery, 40 percent released seven days out. Twenty-four weeks before the start date, the lottery runs on Recreation.gov; applications for a weekly window open on a Sunday, close the following Saturday and process the day after; it costs $10 to apply plus $5 per person if you win. Seven days before the start date, at 7 a.m. Pacific, the remaining 40 percent goes online first come, first served. On the start date the permit is collected at a wilderness center between 8 and 11 a.m., or by 5 p.m. with a late-arrival hold, or it can be released to the next person in line.">
        <text x="0" y="18" style={T_HEAD}>ONE TRAILHEAD'S DAILY QUOTA</text>
        <rect x="0" y="32" width="360" height="48" fill="var(--moss)" />
        <rect x="360" y="32" width="240" height="48" fill="var(--paper-2)" stroke="var(--moss)" strokeWidth="1.5" />
        <text x="16" y="62" style={{ ...T_BODY, fill: "var(--paper)", fontWeight: 600 }}>60% · weekly lottery</text>
        <text x="376" y="62" style={{ ...T_BODY, fontWeight: 600 }}>40% · seven-day release</text>
        <line x1="24" y1="126" x2="24" y2="444" stroke="var(--rule-soft)" strokeWidth="2" />
        {steps.map((s, i) => (
          <g key={s.head}>
            <circle cx="24" cy={s.y - 5} r="9" fill={i === 2 ? "var(--rust)" : i === 0 ? "var(--moss)" : "var(--paper)"} stroke="var(--moss)" strokeWidth="2" />
            <text x="50" y={s.y} style={T_HEAD}>{s.head}</text>
            {s.lines.map((l, j) => (
              <text key={l} x="50" y={s.y + 24 + j * 21} style={j === 0 ? { ...T_BODY, fontWeight: 600 } : T_SOFT}>{l}</text>
            ))}
          </g>
        ))}
        <text x="50" y="492" style={{ ...T_SOFT, fontStyle: "italic" }}>Up to six future reservations at a time. Time axis not to scale.</text>
      </svg>
    );
  }

  return (
    <>
      <p className="dropcap">
        Ninety-five percent of Yosemite is designated wilderness. Most visitors never touch it. The five percent they do visit (the Valley floor, the Glacier Point corridor, the roadside of Tioga) absorbs millions of people a year, while a ten-minute walk past any trailhead sign the crowd thins to nothing and the park becomes what it was before the crowds existed. The price of admission to that version of Yosemite, if you want to sleep in it, is a wilderness permit. The system that hands them out is fair, cheap, and thoroughly confusing the first time you meet it. This is the walkthrough I wish someone had given me.
      </p>

      <h2>First, what the permit is and is not</h2>

      <p>
        A wilderness permit is required year-round for any overnight stay in the Yosemite Wilderness. Day hikes do not need one, with the single famous exception of <a href="/half-dome-lottery">Half Dome, which runs its own permit lottery</a>. The permit is not a campsite reservation; there are no assigned sites out there. What you are reserving is a trailhead and a start date. The park caps how many overnight hikers can begin at each trailhead each day (the quota), and once you are through the gate you camp where regulations allow and walk where your legs take you. Everything in the system exists to meter that first day, because the first day is what concentrates people.
      </p>

      <NatureNotesFilm
        id="wilderness"
        title="Wilderness"
        youtubeId="hKyfyYDgxeA"
        episode={3}
        note="The Park Service's own film on the ninety-five percent of Yosemite a wilderness permit opens."
        location="article"
      />


      <h2>The two ways to get one</h2>

      <p>
        <strong>The lottery, 24 weeks out.</strong> Sixty percent of each trailhead's daily quota is awarded by weekly lottery on Recreation.gov, run 24 weeks ahead of the start date. Applications for a given Sunday-through-Saturday window of start dates open on a Sunday, close the following Saturday, and process the day after. You get one application per weekly window, you can list alternate trailheads and dates on it (do this; it is where most of the winning happens), and the fee structure is $10 to apply plus $5 per person if you win. You can hold up to six future reservations at a time. Applying feels like buying a raffle ticket because that is what it is: popular trailheads (Happy Isles, Cathedral Lakes, anything that touches the John Muir Trail) go badly oversubscribed, while trailheads two drainages over often go unclaimed the same week.
      </p>

      <p>
        <strong>The seven-day release.</strong> The remaining 40 percent of every quota goes online at 7 a.m. Pacific exactly seven days before the start date, first come, first served. This is the realistic second chance, and for flexible hikers it is often the better first chance: no lottery, no waiting weeks for results, just a calendar alarm and a fast click. Famous trailheads disappear in the first minutes. Everything else lingers, sometimes for days. If your plan is "somewhere quiet in the high country next weekend" rather than "the exact classic route," the seven-day release will almost always feed you.
      </p>

      <figure>
        <PermitCalendar />
        <figcaption>The permit calendar, drawn from the figures in this article. Schematic, not to scale.</figcaption>
      </figure>


      <blockquote>The trailhead is the reservation. Flexibility about the trailhead is the whole strategy.</blockquote>

      <Placeholder
        caption="The Tuolumne high country, where a permit trades a parking lot for a watershed"
        image="img/tuolumne-high-country-cory-goehring.jpg"
        credit="Photo: Cory Goehring"
        tag="PLATE I"
        size="lg"
        style={{ aspectRatio: "16 / 10", margin: "32px 0" }}
        motif={<MotifMountains />}
      />

      <h2>What the permit comes with</h2>

      <p>
        Three riders on the permit are worth knowing about before you apply, because they change trip math.
      </p>

      <p>
        <strong>Half Dome, for backpackers.</strong> If your route plausibly passes Half Dome, you can request Half Dome access as an add-on to a wilderness permit for $10 per person, subject to its own daily cap. For a lot of hikers this is the sane way onto the cables: the day-hiker lottery odds stay grim, while a two-night Little Yosemite Valley itinerary carries you past the same crowds at a walking pace. <a href="/articles/so-you-want-to-hike-half-dome">Whether you should want the cables at all</a> is a separate conversation.
      </p>

      <p>
        <strong>The backpackers' campgrounds.</strong> A wilderness permit lets you spend the night before your start date and the night after you exit in a backpackers' campground (there are several, including one in the Valley) for a small per-person fee, no reservation needed. This quietly solves the hardest logistics problem in the park: where to legally sleep the night before a dawn start, in a place where <a href="/articles/yosemite-camping-complete-guide">regular campsites vanish minutes after release</a>.
      </p>

      <p>
        <strong>A parking answer.</strong> Overnight lots exist at or near the major trailheads, and the permit is what makes leaving a car there legal. Ask where to park when you pick the permit up; the answer varies by trailhead and season.
      </p>

      <h2>The rules that ride along</h2>

      <p>
        An approved bear-resistant food canister is required for overnight trips in the Yosemite Wilderness, full stop. Not a hang, not a locked trunk at the trailhead: a canister, carrying everything with a scent, from the food to the toothpaste. Rentals are cheap at wilderness centers if you do not own one. Camp at least four miles from any road or developed area and away from water and trails per the regulations you will get with the permit; fires are banned above 9,600 feet; and the group-size caps (15 on trail, 8 off-trail) are enforced. None of this is bureaucratic decoration. The canister rule in particular is a large part of why <a href="/articles/yosemite-bears-safety-guide">Yosemite's bears</a> have been steadily unlearning humans-as-food-source for two decades.
      </p>

      <h2>Picking up the permit</h2>

      <p>
        A reservation is not the permit itself. You collect the physical permit at a wilderness center (Yosemite Valley, Tuolumne Meadows, Big Oak Flat, Wawona, or Hetch Hetchy, seasonally) on the same day between 8 and 11 a.m., unless you have asked Recreation.gov to hold it for a late arrival, which extends the pickup to 5 p.m., or it can be released to the next person in line. The pickup conversation with the ranger is short and worth having: current water sources, snow lingering on passes, which bear has been working which drainage, <a href="/articles/first-yosemite-backpacking-trip">the exact conditions a first trip needs to plan around</a>. It is the best trail beta in the park and it costs nothing.
      </p>

      <h2>An honest strategy, in order</h2>

      <ol>
        <li>Decide how attached you are to a specific route. If the answer is "very," enter the 24-week lottery with every plausible alternate listed. If the answer is "not very," skip straight to the seven-day release and aim off-peak.</li>
        <li>Set the 7 a.m. alarm for seven days before your ideal start, with second and third trailhead choices already written down.</li>
        <li>Consider starting from Tuolumne or Hetch Hetchy rather than the Valley. The quotas are friendlier, the trailheads are higher or quieter, and the first day is better walking.</li>
        <li>Book midweek starts. A Tuesday quota is a different universe from a Saturday quota.</li>
        <li>If everything fails, remember the walk-in truth: unclaimed quota exists most days at less famous trailheads, and the rangers at the wilderness centers know where it is.</li>
      </ol>

      <p>
        The permit system looks like a wall from the outside. It is actually a door with five handles, and only the most photogenic one is ever locked. The park behind it is 1,100 square miles of granite and silence that most of the four million annual visitors will never see. Ten dollars and a calendar alarm is a reasonable cover charge.
      </p>
    </>
  );
};
