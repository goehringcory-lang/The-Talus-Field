/* global React, EventIcon, ResponsiveImage, LodgingCta, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Sentinel Dome and Taft Point (October 2026), built on the Mist Trail
// feature layout: the catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's full width. Every section sits on the design's container
// (`hp-wrap`), alternating paper and the `ff-band` tint, and uses the shared
// `.ff-*` kit; the page-level `sd-*` rules are the `.sd-feature` layer in
// styles.css.
//
// Three rules hold it up.
//   1. Every distance, gain, time, date and rule restates the sources listed
//      at the foot of the page: the Park Service's trailhead page, its
//      Glacier Point Road day-hike page, its Pohono Trail page, its current
//      conditions page, its public transportation page, the July 15 to
//      August 18, 2026 Yosemite Guide, and the park's two October 2018
//      releases on Taft Point. Where the park's own pages disagree (the
//      printed Guide's distances against the web pages'), the page prints
//      both and says so. Nothing is added from memory.
//   2. The cards, lists and tables restate sentences in the prose beside
//      them, so the graphics add no fact of their own.
//   3. No map: the rule is that a map starts from the NPS map, and no crop
//      of this end of Glacier Point Road exists yet. The trip-planner link
//      places the trailhead instead.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["sentinel-dome-and-taft-point"] = function SentinelDomeTaftPointBody() {
  const TOC = [
    ["#sd-trailhead", "The trailhead"],
    ["#sd-sentinel", "Sentinel Dome"],
    ["#sd-taft", "Taft Point"],
    ["#sd-safety", "Safety at the rim"],
    ["#sd-both", "Doing both"],
    ["#sd-season", "Seasons"],
    ["#sd-light", "Sunrise and sunset"],
    ["#sd-questions", "Questions"],
  ];

  // seo-data.json `faq`, word for word.
  const FAQ = [
    ["How long is the Sentinel Dome hike?", "The Park Service's trailhead page lists Sentinel Dome at 2 miles round trip with 400 feet of elevation gain, one to two hours. The printed Yosemite Guide for summer 2026 gives 1.8 miles round trip from the same trailhead."],
    ["How long is the Taft Point hike?", "The Park Service lists Taft Point at 2.2 miles round trip with about 200 feet of elevation gain on the return, one to two hours. The printed Yosemite Guide for summer 2026 gives 2.4 miles round trip."],
    ["Is Taft Point dangerous?", "The trail is easy; the edge is not. The Fissures beside Taft Point are fractures in the granite with drops the park puts at up to 2,000 feet, and railings stand at only part of the overlook. Two visitors died in a fall of about 800 feet from Taft Point in October 2018. Stay back from any edge without a railing."],
    ["Can you do Sentinel Dome and Taft Point together?", "Yes. Both trails start from the same lot on Glacier Point Road, so you can walk one, come back, and walk the other, about 4.2 miles by the park's web figures. The park also says the two can be joined by the Pohono Trail into a longer loop; it did not publish a loop distance on the pages read for this article."],
    ["When can you hike Sentinel Dome and Taft Point?", "When Glacier Point Road is open to cars, which the Park Service puts at approximately late May through October or November, depending on conditions. The park says to expect trails to be snowy or wet in early spring. In winter the road is groomed for skiing beyond Badger Pass."],
    ["Are dogs allowed at Sentinel Dome or Taft Point?", "No. The Park Service says pets and bicycles are not allowed on these hiking trails."],
  ];

  // ── The two hikes, as cards, from the two hike sections ───────────────────
  const HIKES = [
    { id: "sd-sentinel", name: "Sentinel Dome", line: "A wide trail across open granite to a dome with a 360-degree view.",
      rt: "2 miles (Guide: 1.8)", gain: "400 ft, on the way up", time: "1 to 2 hours", ground: "Open granite, little shade", hazard: "Lightning" },
    { id: "sd-taft", name: "Taft Point", line: "Forest and meadow to the rim of Yosemite Valley.",
      rt: "2.2 miles (Guide: 2.4)", gain: "About 200 ft, on the way back", time: "1 to 2 hours", ground: "Forest and meadow", hazard: "Unrailed edges, the Fissures" },
  ];

  // ── The season, from "When the road is open" ──────────────────────────────
  const SEASONS = [
    { when: "Approximately late May", name: "The road opens", cls: "is-mid",
      text: "Glacier Point Road opens to cars when the snow allows. Expect snowy or wet trails in early spring." },
    { when: "Summer into fall", name: "The hiking season", cls: "is-peak",
      text: "Both trails open. Stay off the dome in any thunderstorm." },
    { when: "October or November", name: "The road closes", cls: "is-late",
      text: "Closed to cars with the snow. In winter the road beyond Badger Pass is groomed for skiing." },
  ];

  return (
    <div className="sd-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="dome" /><dt>Sentinel Dome</dt><dd>2 miles round trip, 400 ft</dd></div>
          <div><EventIcon name="eye" /><dt>Taft Point</dt><dd>2.2 miles round trip, 200 ft</dd></div>
          <div><EventIcon name="pin" /><dt>The start</dt><dd>One lot on Glacier Point Road</dd></div>
          <div><EventIcon name="calendar" /><dt>The season</dt><dd>Late May to Oct or Nov</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: one lot, two short walks, and the one warning. */}
      <section className="hp-wrap hp-section sd-open">
        <div className="ff-split">
          <div className="sd-prose">
            <p className="dropcap">
              Two of the shortest walks in Yosemite with a rim view at the end start from the same parking lot on Glacier Point Road. One goes up, to the bare top of Sentinel Dome and a view in every direction. The other goes out, through forest and meadow to Taft Point, where the Valley wall drops away at your feet and a crack in the granite beside you drops further. Each takes one to two hours by the Park Service's estimate. Most people who have the morning do both.
            </p>

            <p>
              <strong>The numbers, from the park's trailhead page:</strong> Sentinel Dome is 2 miles round trip with 400 feet of elevation gain. Taft Point is 2.2 miles round trip with 200 feet of gain, on the way back. The printed Yosemite Guide for July 15 to August 18, 2026 gives 1.8 and 2.4 miles for the same walks. The park's web pages and its newspaper have disagreed for a while; neither difference changes the hike.
            </p>

            <p>
              Neither trail is hard. What decides the day is the road, which is open only part of the year, and the edges, which are not fenced. As of October 18, 2026 the park's conditions page lists Glacier Point Road as open, asks drivers to watch for firefighters on it, and bans overnight parking on the road and in its lots. Check <a href="/now">the Park Bulletin</a> on the morning you go.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>Park once, at the shared trailhead on Glacier Point Road.</li>
              <li>Sentinel first if storms are possible: it is the one to be off in a thunderstorm.</li>
              <li>At Taft Point, stay back from every edge without a railing.</li>
              <li>Carry water. The park lists pit toilets at the lot, not a tap.</li>
            </ul>
            <a className="sd-short__link" href="#sd-safety">Safety at Taft Point ↓</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="sd-trailhead" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE TRAILHEAD</p>
              <h2>One lot, short of the end of the road</h2>
              <div className="sd-prose">
                <p>
                  The Sentinel Dome and Taft Point trailhead is a parking area on Glacier Point Road, short of the road's end at Glacier Point. The Yosemite Guide's directions to the point are to drive south from Yosemite Valley on the Wawona Road for 9 miles, turn left onto Glacier Point Road, and follow it for 16 miles; it puts the whole drive at about an hour. The Guide also sets the road's one size rule here: <strong>trailers and vehicles over 30 feet are not permitted past the Sentinel Dome trailhead</strong>, so for a large RV this lot is the end of the drive.
                </p>

                <p>
                  The park's page for the trailhead lists a restroom, and says pit toilets are at the parking area. It mentions no drinking water. The Park Service describes water at Glacier Point itself as typically available from late spring to early fall, which is a drive further and not guaranteed at either end of the season, so fill bottles before you leave the Valley.
                </p>

                <p>
                  There is no shuttle between Yosemite Valley and Glacier Point, the park says, and the concessioner's Glacier Point Tour bus does not stop at other trailheads, so it will not drop you here. In summer 2026, <a href="/articles/glacier-point-how-to-visit">the Glacier Point guide</a> describes a lot-full rule that parked late arrivals at Badger Pass and ran a free shuttle with a stop at this trailhead. That rule was not on the park pages read for this article in October, so confirm with the park before a summer trip whether it runs. Overnight parking on Glacier Point Road beyond Badger Pass is prohibited every year from October 15 until the road reopens in spring, the park's parking page says, so a car left at this lot for a night on the rim in late fall is a car in violation.
                </p>
              </div>
            </div>
            <div>
              <h3 className="sd-sched__head">The trailhead, at a glance</h3>
              <ol className="ff-hours sd-at">
                <li className="is-glow"><span>Getting there</span><p>Glacier Point Road, about an hour from the Valley.</p></li>
                <li><span>Size limit</span><p>Nothing over 30 feet, and no trailers, past this lot.</p></li>
                <li><span>Facilities</span><p>Pit toilets at the parking area.</p></li>
                <li><span>Water</span><p>None listed. Bring it.</p></li>
                <li><span>Not allowed</span><p>Pets and bicycles on the trails.</p></li>
                <li><span>Overnight</span><p>No overnight parking beyond Badger Pass from October 15 until the road reopens.</p></li>
              </ol>
            </div>
          </div>

          <div className="sd-hikes">
            {HIKES.map((h) => (
              <article key={h.id} className="sd-hike">
                <h3><a href={"#" + h.id}>{h.name}</a></h3>
                <p className="sd-hike__line">{h.line}</p>
                <dl>
                  <div><dt>Round trip</dt><dd>{h.rt}</dd></div>
                  <div><dt>Climb</dt><dd>{h.gain}</dd></div>
                  <div><dt>Allow</dt><dd>{h.time}</dd></div>
                  <div><dt>Ground</dt><dd>{h.ground}</dd></div>
                  <div><dt>The hazard</dt><dd>{h.hazard}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <p className="ff-note">Distances, gains and times are the Park Service's trailhead page; the figures in parentheses are the printed Yosemite Guide, July 15 to August 18, 2026.</p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sd-sentinel" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">SENTINEL DOME</p>
            <h2>Up, to a view in every direction</h2>
            <div className="sd-prose">
              <p>
                The Sentinel Dome trail runs northeast from the lot, and the park describes it as a wide trail that crosses mostly open granite with little shade. That last part matters more than the 400 feet of gain: on a clear summer afternoon there is nowhere on the walk to get out of the sun, so a hat and water earn their place even on a hike of two miles.
              </p>

              <p>
                The last stretch is the dome itself. The Park Service's phrase is to "scramble up the side of the granite dome," and that is accurate: the trail gives way to bare rock for the last part of the climb. At the top the park promises a 360-degree view of Yosemite, and the dome delivers it: the high country and the Valley in the same turn of the head.
              </p>

              <p>
                Footing on the dome is the whole technical question. Granite with a dusting of grit or a skin of water is slick, and coming down the slab takes more care than going up it. Shoes with tread are enough; sandals are not.
              </p>
            </div>
            <div className="ff-alert sd-alert">
              <EventIcon name="bolt" />
              <p>
                <strong>Stay off domes during thunderstorms.</strong> That is the Park Service's one standing instruction for Sentinel Dome. A bare summit is the high point for some distance around. If you hear thunder or see a storm building, go down, and save the dome for another day.
              </p>
            </div>
          </div>
          <figure className="sd-photo">
            <ResponsiveImage image="img/milky-way-sentinel-dome.jpg" style={{ aspectRatio: "1600 / 2400" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="The Milky Way over the bare granite of Sentinel Dome on a July night" />
            <figcaption>The Milky Way over Sentinel Dome in July. Photo: Jackhen1992 / Wikimedia Commons (CC BY-SA 4.0)</figcaption>
          </figure>
        </div>
      </section>

      <section className="ff-band" id="sd-taft" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">TAFT POINT</p>
            <h2>Out, to the edge of the Valley</h2>
            <div className="sd-prose">
              <p>
                The Taft Point trail heads west from the same lot, and the Park Service describes it simply: follow the trail through forest and meadow to the rim of Yosemite Valley. It is the easier walk of the two. The trail loses height on the way out, and the park counts the 200 feet of gain on the return, so the climb comes when you are walking back to the car.
              </p>

              <p>
                Taft Point is one of the south rim's viewpoints along the Pohono Trail, which the park lists east to west as Roosevelt Point, Taft Point, Dewey Point, Crocker Point and Stanford Point. The trees end and the rim begins without much warning. That is the point, and the hazard.
              </p>

              <p>
                Beside the point are the Fissures: fractures in the granite at the rim. The park's warning on its trailhead page is to use caution around them, because they <strong>include drops of up to 2,000 feet</strong>.
              </p>
            </div>
          </div>
          <figure className="sd-photo">
            <ResponsiveImage image="img/taft-point.jpg" style={{ aspectRatio: "1600 / 1064" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="The cliff edge at Taft Point, with El Capitan across Yosemite Valley" />
            <figcaption>The edge at Taft Point, El Capitan across the Valley. Photo: Cam Adams / Wikimedia Commons (CC0)</figcaption>
          </figure>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sd-safety" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">SAFETY AT THE RIM</p>
            <h2>An easy trail to a hard edge</h2>
            <div className="sd-prose">
              <p>
                Taft Point has a railing, and it does not run along the whole overlook. Railings stand at only part of it, as the news coverage of the 2018 deaths noted, and the Fissures and most of the rim on either side have none. The view does not need you any closer than the railing puts you.
              </p>

              <p>
                On October 25, 2018 the Park Service announced that a man and a woman had died in an apparent fall from Taft Point. Its follow-up the next day said the two had fallen about 800 feet below the point, into very steep terrain, and that rangers recovered them by technical climbing and rappelling with a California Highway Patrol helicopter. The park said the incident was under investigation and released no cause.
              </p>

              <p>
                The rules that follow are not the park's words, but they are what the park's warning means on the ground. Treat any edge without a railing as a drop, because at Taft Point it is one. Do not step across the Fissures or stand in them for a photograph. Keep children within arm's reach from the moment the trees thin out; the rim arrives quickly. Wind, wet rock and the end of the day all make the edge worse, and a headlamp on the way back is the park's own advice for anyone out at sunset.
              </p>
            </div>
          </div>
          <ul className="ff-rules sd-rules">
            <li>
              <EventIcon name="no" size={26} />
              <strong>No edge without a railing.</strong>
              <p>The Fissures include drops of up to 2,000 feet. Railings cover only part of the overlook.</p>
            </li>
            <li>
              <EventIcon name="bolt" size={26} />
              <strong>Off the dome in a storm.</strong>
              <p>The Park Service's own rule for Sentinel Dome and every dome.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="users" size={26} />
              <strong>Hold on to the children.</strong>
              <p>The trees thin and the rim arrives with little warning.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="clock" size={26} />
              <strong>A light for the way back.</strong>
              <p>The park's advice for a sunset or full-moon walk.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="ff-band" id="sd-both" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">DOING BOTH</p>
            <h2>Two out-and-backs, or one loop on the Pohono</h2>
            <div className="sd-prose">
              <p>
                <strong>Two out-and-backs from the lot.</strong> Walk one trail, return to the car, walk the other. By the park's web figures that is 4.2 miles and 600 feet of climbing in all, and the lot in the middle is a place to refill from the car and use the toilets. Sentinel first is the better order when the sky might build: the exposed hike is done before the afternoon, and the walk with the shade is the second one.
              </p>

              <p>
                <strong>The loop.</strong> The Park Service says the two trails can be joined into a longer loop on the Pohono Trail, which runs along the south rim between them. The park pages read for this article did not give a loop distance, so take a map and the park's word for it rather than a number from here. The Pohono as a whole is a different undertaking: the park lists it at 12.5 miles one way from Glacier Point to Tunnel View, eight to ten hours, with a 2,800-foot net descent, several moderate and steep climbs along the way, and several unbridged stream crossings that can run high in late spring and early summer. There is no shuttle back to Glacier Point from the Valley or Tunnel View.
              </p>

              <p>
                <strong>Then Glacier Point.</strong> The point is a short drive further, and after the two hikes the paved walk to the overlook is the easy end of the day. <a href="/articles/yosemite-for-non-hikers">The non-hiker's guide</a> treats Glacier Point as a day on its own for anyone in the group who would rather wait out the hikes; <a href="/map">the trip-planner map</a> places the trailhead and the point on the road.
              </p>
            </div>
          </div>
          <figure className="sd-photo">
            <ResponsiveImage image="img/clark-range-view-glacier-point-road.jpg" style={{ aspectRatio: "1600 / 1116" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="Mount Clark under snow, seen from Glacier Point Road" />
            <figcaption>Mount Clark under snow from Glacier Point Road. Photo: Justin Johnsen / Wikimedia Commons (CC BY-SA 4.0)</figcaption>
          </figure>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sd-season" tabIndex={-1}>
        <p className="hp-eyebrow">WHEN THE ROAD IS OPEN</p>
        <h2>The road sets the season</h2>
        <ol className="sd-seasons">
          {SEASONS.map((s) => (
            <li key={s.name} className={s.cls}>
              <span>{s.when}</span>
              <strong>{s.name}</strong>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="ff-split sd-when">
          <div className="sd-prose">
            <p>
              The trailhead is reachable by car only when Glacier Point Road is open, and the Park Service puts that at approximately late May through October or November, depending on conditions. Its day-hike page says to expect the trails to be snowy or wet in early spring, which on Sentinel Dome means a slick slab and on the Taft Point trail means wet meadow. In the first weeks after the road opens, <a href="/articles/glacier-point-road-open-2026">the early-season guide</a> covers what is and is not running at the top.
            </p>

            <p>
              The other end of the season is a weather call. The road closes to cars when the snow makes it, and from mid to late December through March, when Badger Pass is operating, the Park Service grooms the road beyond the ski area for skiing; the trailhead is then a ski trip, not a drive.
            </p>

            <p>
              As of mid-October 2026 the park lists a fire closure covering the area east of the Wawona Road and south of Glacier Point Road. Both of these trails run north from the road, toward the rim, but closures move: read the conditions page and the closure map before you go.
            </p>
          </div>
          <div className="sd-stay">
            {/* The in-park lodges book through Yosemite Hospitality and are
                named without a link; the availability search is for when the
                park is full. */}
            <LodgingCta
              destination="Yosemite National Park"
              heading="A bed for the early start"
              note="Sunrise on Sentinel Dome means driving Glacier Point Road in the dark, about an hour from the Valley by the Yosemite Guide's count, and there is no overnight parking on the road. In-park rooms book through Yosemite Hospitality. When the park is full, a search shows what is left within driving distance."
              list="article_cta"
              slug="sentinel-dome-and-taft-point"
              cta="Search lodging around Yosemite →"
            />
          </div>
        </div>
      </section>

      <section className="ff-band" id="sd-light" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">SUNRISE AND SUNSET</p>
            <h2>The light, and the walk back in the dark</h2>
            <div className="sd-prose">
              <p>
                Both places are on the photographer's list for the hour at either end of the day, and <a href="/articles/yosemite-photography-spots">the photography guide</a> sets them beside the park's other viewpoints by time of day. The view from Sentinel Dome turns all the way around, so it works at either end. Taft Point faces across the Valley toward El Capitan.
              </p>

              <p>
                The Park Service's advice for a sunset or full-moon hike on either trail is short: bring a flashlight or headlamp. The walk back from Taft Point is the uphill part, and it is through forest, where the dark comes earlier than it does on the rim. The drive down Glacier Point Road afterward is an hour in the dark.
              </p>

              <p>
                After dark the same rule holds at the edge, with less to see it by. Stay well back from the rim at Taft Point and the Fissures, and come down off Sentinel Dome while you can still see the slab.
              </p>
            </div>
          </div>
          <div className="ff-inpark sd-pack">
            <p className="hp-eyebrow">WHAT TO CARRY</p>
            <h3>For two short walks</h3>
            <p>
              Water, because the park lists none at the lot. A hat for the open granite on Sentinel. Shoes with tread for the slab. A layer for the rim. A headlamp if you will be out at sunset. <a href="/kit">The day pack list</a> has the rest.
            </p>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sd-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Sentinel Dome and Taft Point, answered</h2>
            <div className="sd-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.nps.gov/places/000/sentinel-dome-and-taft-point-trailhead.htm" target="_blank" rel="noopener noreferrer">Sentinel Dome and Taft Point Trailhead, NPS</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/glacierhikes.htm" target="_blank" rel="noopener noreferrer">Day Hikes along the Glacier Point Road, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/places/000/panorama-and-pohono-trailheads.htm" target="_blank" rel="noopener noreferrer">Panorama and Pohono Trailheads, NPS</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">Current conditions, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/glacierpoint.htm" target="_blank" rel="noopener noreferrer">Glacier Point, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/thparking.htm" target="_blank" rel="noopener noreferrer">Tioga and Glacier Point Road parking, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/publictransportation.htm" target="_blank" rel="noopener noreferrer">Public transportation, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">The Yosemite Guide, July 15 to August 18, 2026, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/learn/news/two-visitors-fall-from-taft-point-in-yosemite-national-park.htm" target="_blank" rel="noopener noreferrer">Two visitors fall from Taft Point, NPS, October 25, 2018</a></li>
                <li><a href="https://www.nps.gov/yose/learn/news/recovery-operation-completed-for-two-visitors-who-fell-from-taft-point-in-yosemite-national-park.htm" target="_blank" rel="noopener noreferrer">Recovery operation completed, NPS, October 26, 2018</a></li>
                <li><a href="https://www.cbsnews.com/sacramento/news/yosemite-taft-point-couple-falls" target="_blank" rel="noopener noreferrer">Taft Point coverage, CBS Sacramento, 2018</a></li>
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

      <div className="hp-wrap sd-end">
        <AffiliateNote />
      </div>
    </div>
  );
};
