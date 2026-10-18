/* global React, EventIcon, ResponsiveImage, LodgingCta, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Easy hikes in Yosemite Valley (October 2026), built on the Mist Trail
// feature layout: the catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's full width. Every section sits on the design's container
// (`hp-wrap`), alternating paper and the `ff-band` tint, and uses the shared
// `.ff-*` kit; the page-level `ez-*` rules are the `.ez-feature` layer in
// styles.css.
//
// It is the family and distance piece. yosemite-for-non-hikers is the
// no-hiking day (roadside views, the drive, mobility), and
// yosemite-winter-hikes is the snow-season inventory; this one is the four
// short Valley walks measured for a family: how far, how long, where the
// toilets and the water are, what a stroller can do, and how to string them
// into a day.
//
// Two rules hold it up.
//   1. Every distance, time, climb, stop number and rule restates the sources
//      listed at the foot of the page: the Park Service's trail pages, its
//      trailhead and place pages, its Valley day-hikes table and transit
//      page, and the Yosemite Guide for September 23 to November 24, 2026.
//      Where two Park Service pages disagree (the Mirror Lake loop is 5 miles
//      on the trail page and 4.5 in the Guide), the page prints both.
//   2. The cards, lists and tables restate sentences in the prose beside
//      them, so the graphics add no fact of their own.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["easy-hikes-yosemite-valley"] = function EasyHikesYosemiteValleyBody() {
  const TOC = [
    ["#ez-compare", "The four, compared"],
    ["#ez-map", "Where they are"],
    ["#ez-lower-fall", "Lower Yosemite Fall"],
    ["#ez-cooks", "Cook's Meadow"],
    ["#ez-bridalveil", "Bridalveil Fall"],
    ["#ez-mirror", "Mirror Lake"],
    ["#ez-days", "A family day"],
    ["#ez-seasons", "Seasons"],
    ["#ez-questions", "Questions"],
  ];

  // seo-data.json `faq`, word for word.
  const FAQ = [
    ["What are the easiest hikes in Yosemite Valley?", "The Park Service rates four Valley walks easy or close to it: Bridalveil Fall, 0.5 mile round trip with about 80 feet of climb; Lower Yosemite Fall, a 1-mile loop with about 50 feet; Cook's Meadow, a flat 1-mile loop; and Mirror Lake, 2 miles round trip to the lake with 100 feet, rated easy to moderate."],
    ["Which Yosemite Valley trails are good for strollers?", "The Park Service allows strollers on the Lower Yosemite Fall loop, on the Cook's Meadow loop, and on the first paved mile of the Mirror Lake trail. Bridalveil Fall's page does not mention strollers; the paved trail has a wheelchair-accessible platform about halfway up, and the grade steepens beyond it."],
    ["How long does the Lower Yosemite Fall walk take?", "About 30 minutes for the 1-mile loop, by the Park Service's estimate. It starts at Valleywide shuttle stop 6. There is no parking at the trailhead; use the Yosemite Village or Yosemite Falls parking areas."],
    ["Does Mirror Lake have water in it?", "Only part of the year. The Park Service says Mirror Lake has little water much of the year and is fullest in spring and early summer, when snowmelt fills Tenaya Creek. The Yosemite Guide marks it dry in summer and fall."],
    ["Can you take the shuttle to Bridalveil Fall?", "No. The Park Service says shuttle service is not available to the Bridalveil Fall area. Drive to the Bridalveil Fall parking area on Wawona Road, which often fills quickly in summer, or park along Southside Drive and walk about 0.75 mile round trip."],
    ["Is Lower Yosemite Fall dry in fall?", "Often. The Park Service says the fall is often dry from late July or August through October. Bridalveil Fall flows year-round, so it is the surer waterfall walk late in the year."],
  ];

  // ── The four walks, from the sections below ───────────────────────────────
  // [name, anchor, distance, miles for the bar, time, climb, rating, stroller]
  const WALKS = [
    ["Bridalveil Fall", "#ez-bridalveil", "0.5 mi round trip", 0.5, "20 min", "About 80 ft", "Easy", "Not addressed; paved, steeper past the platform"],
    ["Lower Yosemite Fall", "#ez-lower-fall", "1 mi loop", 1, "30 min", "About 50 ft", "Easy", "Allowed"],
    ["Cook's Meadow", "#ez-cooks", "1 mi loop", 1, "30 min", "Flat", "Easy", "Allowed"],
    ["Mirror Lake, to the lake", "#ez-mirror", "2 mi round trip", 2, "1 hr", "100 ft", "Easy to moderate", "First paved mile only"],
    ["Mirror Lake, the loop", "#ez-mirror", "5 mi loop (4.5 in the Guide)", 5, "2 to 3 hr", "200 ft", "Easy to moderate", "No, past the paved mile"],
  ];

  // ── The practical grid, from each walk's section ──────────────────────────
  const BASICS = [
    { name: "Lower Yosemite Fall", start: "Shuttle stop 6", park: "Yosemite Village or Yosemite Falls lots", loo: "On the western trail, with a family restroom", water: "Fountain and bottle filler near the western restrooms" },
    { name: "Cook's Meadow", start: "Shuttle stop 5, or cross the road from stop 6", park: "Yosemite Village or Yosemite Falls lots; a few spaces at Sentinel Bridge", loo: "None on the walk; at the visitor center or Lower Yosemite Fall", water: "None listed on the walk" },
    { name: "Bridalveil Fall", start: "Bridalveil Fall parking area, Wawona Road. No shuttle", park: "Its own lot, which often fills in summer", loo: "In the parking area, with a family restroom", water: "None listed" },
    { name: "Mirror Lake", start: "Shuttle stop 17", park: "None at the trailhead; nearest is Curry Village", loo: "Vault toilets at about 0.5 mile and at the lake", water: "None at the trailhead or on the trail" },
  ];

  // ── The Valley on the Park Service's own map ──────────────────────────────
  // Positions in the map's pixels (2560 x 1000), placed by eye against the
  // map's labels, as on the non-hikers piece.
  const MAP_W = 2560, MAP_H = 1000;
  const PINS = [
    { n: "1", at: [547, 878], name: "Bridalveil Fall, its lot on Wawona Road" },
    { n: "2", at: [1528, 270], name: "Lower Yosemite Fall, shuttle stop 6" },
    { n: "3", at: [1672, 268], name: "Cook's Meadow, from stop 5 or 6" },
    { n: "4", at: [2265, 232], name: "Mirror Lake, from shuttle stop 17" },
    { n: "A", at: [2090, 590], name: "Happy Isles, stop 16, for the Vernal Fall footbridge", side: true },
  ];
  const pct = (x, y) => ({ left: (x / MAP_W) * 100 + "%", top: (y / MAP_H) * 100 + "%" });

  // ── The day plans, from "A family day" ────────────────────────────────────
  const DAYS = [
    { name: "One stop, two walks", miles: "2 miles", text: "Ride to stop 6. Walk the Lower Yosemite Fall loop, then cross the road into Cook's Meadow and walk its loop. Restrooms and water are on the fall's western trail." },
    { name: "The waterfall morning", miles: "1.5 miles", text: "Bridalveil Fall first, by car, before its lot fills. Then park at Yosemite Falls or Yosemite Village for the Lower Yosemite Fall loop." },
    { name: "The long one", miles: "2 miles", text: "Shuttle to stop 17 and walk the paved road to Mirror Lake and back. Strollers and bikes are allowed on the paved mile. Carry all the water you need." },
  ];

  // ── The year, from "Seasons" ──────────────────────────────────────────────
  const SEASONS = [
    { when: "Spring and early summer", name: "Everything is running", cls: "is-peak",
      text: "Both falls at full flow and Mirror Lake at its fullest. Expect spray, and at Bridalveil it can stop you short of the end of the trail." },
    { when: "Late July or August to October", name: "The dry stretch", cls: "is-mid",
      text: "Lower Yosemite Fall is often dry and the Guide marks Mirror Lake dry. Bridalveil Fall flows year-round, so it is the surer waterfall." },
    { when: "Winter", name: "Ice on the pavement", cls: "is-late",
      text: "Icy patches on the climb to the Lower Yosemite Fall footbridge, very slick conditions at Bridalveil, slippery boardwalk at Cook's Meadow." },
  ];

  return (
    <div className="ez-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="walk" /><dt>Shortest</dt><dd>Bridalveil Fall, 0.5 mile round trip</dd></div>
          <div><EventIcon name="drop" /><dt>The classic</dt><dd>Lower Yosemite Fall, a 1-mile loop</dd></div>
          <div><EventIcon name="lake" /><dt>Longest</dt><dd>Mirror Lake, 2 miles to the lake and back</dd></div>
          <div><EventIcon name="route" /><dt>Getting there</dt><dd>Free shuttle, 7 am to 10 pm, all year</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: what the four are, and the page in four lines. */}
      <section className="hp-wrap hp-section ez-open">
        <div className="ff-split">
          <div className="ez-prose">
            <p className="dropcap">
              Four walks on the floor of Yosemite Valley carry the Park Service's easy rating, or close to it, and between them they reach the base of two waterfalls, the middle of the Valley's best-known meadow and a seasonal lake under Half Dome. The shortest is half a mile. The longest is two miles if you turn around at the lake. Three of them start at a free shuttle stop.
            </p>

            <p>
              This page measures them for a family: the distance, the Park Service's time estimate, the climb, what a stroller is allowed to do, where the toilets and the drinking water are, and how to fit two or three into a day without a car. If nobody in your group wants to walk at all, <a href="/articles/yosemite-for-non-hikers">Yosemite for non-hikers</a> is the better guide; it builds the day around the roadside views.
            </p>

            <p>
              Distances, times and rules here come from the Park Service's trail pages and the current Yosemite Guide. Trails close for ice, rockfall and repair. Check the park's conditions page on the morning you go.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>Under an hour: Bridalveil Fall, Lower Yosemite Fall or Cook's Meadow.</li>
              <li>Lower Yosemite Fall and Cook's Meadow share shuttle stop 6. Do both for 2 miles.</li>
              <li>No shuttle goes to Bridalveil Fall. Drive, early in summer.</li>
              <li>Mirror Lake has no drinking water and is dry by late summer.</li>
            </ul>
            <a className="ez-short__link" href="#ez-compare">The four, side by side ↓</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="ez-compare" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">THE FOUR, COMPARED</p>
          <h2>How far, how long, how much climb</h2>
          <div className="ez-prose ez-lede">
            <p>
              The bars are drawn to one scale: the full track is 5 miles, and each tick is a mile. Times are the Park Service's estimates for walking the trail, not for stopping at the bottom of a waterfall with a five-year-old, so add for that. The rating column is the one on the Park Service's <a href="https://www.nps.gov/yose/planyourvisit/valleyhikes.htm" target="_blank" rel="noopener noreferrer">Valley day-hikes table</a>.
            </p>
          </div>
          <ul className="ez-walks">
            {WALKS.map(([name, href, dist, miles, time, climb, rating, stroller]) => (
              <li key={name}>
                <div className="ez-walks__name">
                  <strong><a href={href}>{name}</a></strong>
                  <span>{dist}</span>
                </div>
                <div className="ez-walks__bar" aria-hidden="true"><i style={{ width: (miles / 5) * 100 + "%" }} /></div>
                <dl className="ez-walks__facts">
                  <div><dt>Time</dt><dd>{time}</dd></div>
                  <div><dt>Climb</dt><dd>{climb}</dd></div>
                  <div><dt>Rating</dt><dd>{rating}</dd></div>
                  <div><dt>Stroller</dt><dd>{stroller}</dd></div>
                </dl>
              </li>
            ))}
          </ul>

          <h3 className="ez-sub">Where each one starts, and what is there</h3>
          <div className="ez-basics" role="region" tabIndex={0} aria-label="Trailheads, parking, restrooms and water for each walk">
            <table>
              <thead>
                <tr><th scope="col">Walk</th><th scope="col">Start</th><th scope="col">Parking</th><th scope="col">Restrooms</th><th scope="col">Water</th></tr>
              </thead>
              <tbody>
                {BASICS.map((b) => (
                  <tr key={b.name}><th scope="row">{b.name}</th><td>{b.start}</td><td>{b.park}</td><td>{b.loo}</td><td>{b.water}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ez-map" tabIndex={-1}>
        <p className="hp-eyebrow">WHERE THEY ARE</p>
        <h2>Three on the shuttle, one by car</h2>
        <figure className="ez-map">
          <div className="ez-map__scroll" role="region" tabIndex={0} aria-label="Map of Yosemite Valley. On a phone it scrolls sideways.">
            <div className="ez-map__frame">
              <ResponsiveImage image="img/nps-yosemite-valley-map.jpg" className="ez-map__img" sizes="(max-width: 1100px) 980px, 1240px" style={{ aspectRatio: "2560 / 1000" }}
                alt="National Park Service map of Yosemite Valley from Tunnel View on the west to Happy Isles on the east. Four walks are numbered: Bridalveil Fall at the west end off Wawona Road, Lower Yosemite Fall and Cook's Meadow in the middle of the Valley near Yosemite Village, and Mirror Lake at the east end below Half Dome. Happy Isles is marked as a side trip." />
              <div className="ez-map__layer" aria-hidden="true">
                {PINS.map((p) => (
                  <span key={p.n} className={"ez-pin" + (p.side ? " is-side" : "")} style={pct(p.at[0], p.at[1])}><b>{p.n}</b></span>
                ))}
              </div>
            </div>
          </div>
          <figcaption>
            <ol className="ez-map__key">
              {PINS.map((p) => <li key={p.n} className={p.side ? "is-side" : undefined}><b>{p.n}</b> {p.name}</li>)}
            </ol>
            <span className="ez-map__note">Pins are approximate. Swipe the map sideways on a phone. Map: National Park Service (public domain).</span>
          </figcaption>
        </figure>
        <div className="ff-split ez-after-map">
          <div className="ez-prose">
            <p>
              The free Valley shuttle runs daily, all year, from 7 am to 10 pm, the Guide says. The Park Service's transit page puts the Valleywide buses 12 to 22 minutes apart and the East Valley buses 8 to 12 minutes apart, and the park describes the shuttle as fully accessible. Lower Yosemite Fall is stop 6, Cook's Meadow starts at stop 5 or across the road from stop 6, and Mirror Lake is stop 17. <a href="/articles/yosemite-shuttle-and-yarts">The shuttle guide</a> covers the routes in full.
            </p>
            <p>
              Bridalveil Fall is the exception: the Park Service says no shuttle serves it. It sits at the west end of the Valley, beside Wawona Road, and you pass it driving in on Highway 41. For where to leave the car for the other three, <a href="/articles/yosemite-valley-parking-guide">the Valley parking guide</a> has the lots and when they fill.
            </p>
          </div>
          <p className="ff-alert ez-alert">
            <EventIcon name="car" />
            <span>
              <strong>Park once.</strong> None of the three shuttle walks has parking at its trailhead. The Guide's advice is to find a space in one of the three hubs, Curry Village, Yosemite Village or Yosemite Falls, keep it, and walk, bike or ride from there.
            </span>
          </p>
        </div>
      </section>

      <section className="ff-band" id="ez-lower-fall" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">1 MILE LOOP · 30 MINUTES · ABOUT 50 FEET</p>
            <h2>Lower Yosemite Fall</h2>
            <div className="ez-prose">
              <p>
                The obvious first walk, and the one the Park Service rates easy: a paved 1-mile loop with about 50 feet of climb to the base of the lower fall, about 30 minutes. It starts at shuttle stop 6. There is no parking at the trailhead; the Yosemite Village and Yosemite Falls lots are the nearest. You can also walk the bike path from the Valley Visitor Center, which adds about half a mile.
              </p>
              <p>
                <strong>Two legs, not one.</strong> The east side of the loop, 0.6 mile one way from the shuttle stop, is wheelchair accessible when it is clear of ice and snow, and it crosses several braided streams before the viewing area. The west side is about 0.5 mile one way and mostly accessible, but its last 180 feet climb at a 13.8 percent grade near the viewing area. Halfway along the west side is a bronze relief model of the Yosemite Falls area that children can put their hands on.
              </p>
              <p>
                <strong>For a family.</strong> Strollers and leashed pets are allowed; bikes are not, and there are racks nearby. The restrooms are on the western trail only, across from Yosemite Valley Lodge, and include an accessible family restroom. A drinking fountain and a bottle filling station are nearby. There is no other water on the loop.
              </p>
              <p>
                <strong>The rule that matters.</strong> Stay on the pavement and behind the barriers. The Park Service says the rocks above the footbridge are slippery even when dry, and scrambling off the trail has caused serious injuries. The <a href="/articles/yosemite-accessibility-guide">accessibility guide</a> has more on the east leg for a wheelchair.
              </p>
            </div>
          </div>
          <figure className="ez-photo">
            <ResponsiveImage image="img/lower-yosemite-fall-footbridge.jpg" style={{ aspectRatio: "1600 / 1064" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="Lower Yosemite Fall seen from the paved loop trail near the footbridge" />
            <figcaption>Lower Yosemite Fall from the loop. The Park Service says it is often dry from late July or August through October. Photo: James St. John / Wikimedia Commons (CC BY 2.0)</figcaption>
          </figure>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ez-cooks" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">1 MILE LOOP · 30 MINUTES · FLAT</p>
            <h2>Cook's Meadow</h2>
            <div className="ez-prose">
              <p>
                The flattest of the four: a 1-mile loop of pavement and boardwalk across the meadow in the middle of the Valley, about 30 minutes, with Yosemite Falls, Half Dome and the Merced River in view. The Park Service starts it at the Valley Visitor Center, shuttle stop 5; from stop 6 you cross the road into the meadow. Parking is at Yosemite Village and Yosemite Falls, and the Sentinel Bridge area has a few spaces and works as a midpoint.
              </p>
              <p>
                <strong>For a family.</strong> It is wheelchair accessible when not covered in snow, and strollers, leashed pets and bikes are all allowed; the Park Service asks that everyone stay on the path. There are no restrooms along the walk. Use the ones at the visitor center or at Lower Yosemite Fall before you start.
              </p>
              <p>
                <strong>What to look for.</strong> The Guide says to look and listen for birds and other wildlife in early morning and around dusk. Keep food within arm's reach, the Park Service says, and do not feed anything. In wet weather, frost or snow, the boardwalk is slippery.
              </p>
              <p>
                Because it shares stop 6 with Lower Yosemite Fall, this is the second half of the easiest two-walk outing in the park, below.
              </p>
            </div>
          </div>
          <figure className="ez-photo">
            <ResponsiveImage image="img/half-dome-meadow-deer-johannes-andersson.jpg" style={{ aspectRatio: "3 / 4" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="Mule deer grazing in a Yosemite Valley meadow below Half Dome" />
            <figcaption>Deer in a Valley meadow below Half Dome. Early morning and dusk are the hours the Guide gives for wildlife on the Cook's Meadow loop. Photo: Johannes Andersson / Unsplash</figcaption>
          </figure>
        </div>
      </section>

      <section className="ff-band" id="ez-bridalveil" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">0.5 MILE ROUND TRIP · 20 MINUTES · ABOUT 80 FEET</p>
              <h2>Bridalveil Fall</h2>
              <div className="ez-prose">
                <p>
                  The shortest of the four: 0.5 mile round trip from the Bridalveil Fall parking area on Wawona Road, about 80 feet of climb, about 20 minutes. The other way in is from roadside parking on Southside Drive, on a paved trail that follows the old carriage road, about 0.75 mile round trip with a gentle incline. The Park Service finished a rehabilitation of the area in fall 2024, aimed at restrooms, parking congestion and an accessible path to the viewing platform.
                </p>
                <p>
                  <strong>No shuttle.</strong> The Park Service says shuttle service is not available to the Bridalveil Fall area, and the parking area often fills quickly in summer. Come early, or stop on the way into the Valley.
                </p>
                <p>
                  <strong>For a family.</strong> The restrooms are in the parking area, and they include a family restroom. A wheelchair-accessible viewing platform sits about halfway up from the main lot; past it, the trail is still paved but steeper and not wheelchair accessible. The Park Service's trail page does not address strollers, so plan on pushing one up a grade or leaving it at the platform. Leashed pets are allowed.
                </p>
                <p>
                  <strong>Expect to get wet.</strong> The fall runs all year, and in spring and early summer the Park Service says the spray can be so strong you cannot easily reach the end of the trail. The rocks above the platform are slippery even when dry; stay behind the barriers. In winter, expect ice.
                </p>
              </div>
            </div>
            <div>
              <ol className="ff-hours ez-sched">
                <li className="is-glow"><span>From the Wawona Road lot</span><p>0.5 mile round trip, gentle incline. Restrooms in the lot.</p></li>
                <li><span>From Southside Drive</span><p>About 0.75 mile round trip, on the old carriage road.</p></li>
                <li><span>Halfway up</span><p>The wheelchair-accessible viewing platform.</p></li>
                <li><span>Past the platform</span><p>Paved, steeper, not wheelchair accessible.</p></li>
              </ol>
              <p className="ff-alert ez-alert">
                <EventIcon name="no" />
                <span>
                  <strong>No shuttle to Bridalveil.</strong> It is the one walk on this page you have to drive to, and its lot often fills in summer.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ez-mirror" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">2 MILES ROUND TRIP · 1 HOUR · 100 FEET</p>
            <h2>Mirror Lake</h2>
            <div className="ez-prose">
              <p>
                The longest of the four, and the only one the Park Service rates easy to moderate. From shuttle stop 17 it is 2 miles round trip on a paved road to the lake, about 100 feet of climb, about an hour. The Valleywide and East Valley shuttles both stop there. There is no parking at the trailhead; the nearest is at Curry Village. Vehicles with a valid disability placard may drive the paved road to the front of the lake, the Guide says.
              </p>
              <p>
                <strong>The loop.</strong> Past the lake an unpaved trail circles it: 5 miles and 200 feet of climb on the Park Service's trail page, 4.5 miles in the current Guide, either way 2 to 3 hours. The south side is slick in winter and early spring, and the creek crossings that look easy can sweep a hiker into whitewater when the water is high. With small children, the lake is the turnaround.
              </p>
              <p>
                <strong>For a family.</strong> Strollers, bikes and leashed pets are allowed on the first paved mile only. You can ride a bike to the end of the pavement and walk from there. Vault toilets are about half a mile in and at the lake, and there are no others. There is no drinking water at the trailhead or on the trail, so fill bottles before you get on the shuttle.
              </p>
              <p>
                <strong>When there is a lake.</strong> The Park Service says Mirror Lake has little water much of the year and is fullest in spring and early summer, when snowmelt fills Tenaya Creek. The Guide marks it dry in summer and fall. Late in the year it is a walk to a sandy meadow under Half Dome, which children may like just as well.
              </p>
            </div>
          </div>
          <figure className="ez-photo">
            <ResponsiveImage image="img/mirror-lake-mount-watkins.jpg" style={{ aspectRatio: "1600 / 1068" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="Mount Watkins reflected in the still water of Mirror Lake" />
            <figcaption>Mirror Lake in spring, with Mount Watkins in the water. By late summer the lake is mostly gone. Photo: Mutineer / Wikimedia Commons (CC0)</figcaption>
          </figure>
        </div>
      </section>

      <section className="ff-band" id="ez-days" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">A FAMILY DAY</p>
          <h2>Two or three walks, one parking space</h2>
          <ol className="ez-days">
            {DAYS.map((d) => (
              <li key={d.name}>
                <span>{d.miles}</span>
                <strong>{d.name}</strong>
                <p>{d.text}</p>
              </li>
            ))}
          </ol>
          <div className="ff-split ez-days__prose">
            <div className="ez-prose">
              <p>
                <strong>The easiest pairing.</strong> Lower Yosemite Fall and Cook's Meadow both work from shuttle stop 6, and the two loops add up to 2 miles. Do the fall first, use the restrooms and the water on its western trail, then cross the road for the meadow, which has neither.
              </p>
              <p>
                <strong>All four in a day</strong> is 4.5 miles of walking if you turn around at Mirror Lake, plus a drive to Bridalveil Fall. It is possible, but with young children two is a full day once you count the shuttle waits and the time spent at the bottom of each fall.
              </p>
              <p>
                <strong>The Junior Ranger badge.</strong> The handbook is free at every park visitor center, for ages 4 to 12. To earn the badge, a child completes the activities, attends a ranger-led program and shows the booklet to a ranger at a visitor center. For this edition the Guide lists a ranger Discovery Walk, an easy walk at 10:30 am on Tuesday, Wednesday, Thursday and Saturday from the museum in Yosemite Village (stop 5), and a 15-minute family talk, Yosemite Nature in a Nutshell, at 2 pm daily at the Welcome Center (stop 2). Programs change with each Guide, so check the current one; <a href="/articles/yosemite-ranger-programs">the ranger programs guide</a> covers the rest. For a full family itinerary with the food and the bears, see <a href="/articles/yosemite-with-kids-no-reservations-2026">Yosemite with kids</a>.
              </p>
              <p>
                <strong>One step up.</strong> When the four are not enough, the next walk is the first stretch of the Mist Trail to the Vernal Fall footbridge: 1.6 miles round trip from Happy Isles, shuttle stop 16, with 400 feet of climb and 1 to 1.5 hours by the Park Service's estimate. That is real uphill, eight times the climb of Lower Yosemite Fall. <a href="/articles/mist-trail-the-real-guide">The Mist Trail guide</a> has the turnarounds.
              </p>
            </div>
            <ul className="ff-rules ez-pack">
              <li className="is-exception">
                <EventIcon name="drop" size={26} />
                <strong>Fill bottles at the fall.</strong>
                <p>Lower Yosemite Fall's western trail has a fountain and a bottle filler. Mirror Lake has no water at all.</p>
              </li>
              <li className="is-exception">
                <EventIcon name="users" size={26} />
                <strong>Use the family restrooms.</strong>
                <p>At the Lower Yosemite Fall trailhead and in the Bridalveil Fall lot.</p>
              </li>
              <li className="is-exception">
                <EventIcon name="no" size={26} />
                <strong>Stay off the wet rock.</strong>
                <p>At both falls the rocks above the viewing area are slippery even when dry.</p>
              </li>
              <li className="is-exception">
                <EventIcon name="food" size={26} />
                <strong>Food within arm's reach.</strong>
                <p>The Park Service's rule on the meadow loop, and everywhere else.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="ez-seasons" tabIndex={-1}>
        <p className="hp-eyebrow">SEASONS</p>
        <h2>The trails are open all year. The water is not.</h2>
        <ol className="ez-seasons">
          {SEASONS.map((s) => (
            <li key={s.name} className={s.cls}>
              <span>{s.when}</span>
              <strong>{s.name}</strong>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="ff-split ez-when">
          <div className="ez-prose">
            <p>
              <strong>Spring and early summer.</strong> Everything is running. The Park Service says to expect to get wet at both falls, and Mirror Lake is at its fullest. <a href="/articles/yosemite-waterfalls-guide">The waterfalls guide</a> explains why the flow peaks when it does and how to read the year's snowpack.
            </p>
            <p>
              <strong>Late summer and fall.</strong> Lower Yosemite Fall is often dry from late July or August through October, and the Guide marks both it and Mirror Lake dry in summer and fall. The walks are still worth doing for the granite and the shade, but if the waterfall is the point, Bridalveil Fall flows year-round.
            </p>
            <p>
              <strong>Winter.</strong> Lower Yosemite Fall and Cook's Meadow are open all year, and Bridalveil Fall is reachable all year. Expect ice on the short climb to the Lower Yosemite Fall footbridge, very slick conditions at Bridalveil, slippery boardwalk at Cook's Meadow and a slick south side on the Mirror Lake loop. <a href="/articles/yosemite-winter-hikes">The winter hikes guide</a> covers which other trails stay open and what to put on your shoes.
            </p>
          </div>
          <div className="ez-stay">
            {/* The in-park lodges book through the concessioner and are named
                without a link; the availability search is for when they are
                full. */}
            <LodgingCta
              destination="Yosemite National Park"
              heading="Sleep close to the shuttle"
              note="Three of these walks start at a Valley shuttle stop, so a bed in the Valley turns the day into a car-free one. Yosemite Valley Lodge sits across the road from the Lower Yosemite Fall restrooms and books through Yosemite Hospitality, as does Curry Village, the nearest parking to the Mirror Lake trailhead. When the park is full, a search shows what is left within driving distance."
              list="article_cta"
              slug="easy-hikes-yosemite-valley"
              cta="Search lodging around Yosemite →"
            />
          </div>
        </div>
      </section>

      <section className="ff-band" id="ez-questions" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Easy Valley hikes, answered</h2>
            <div className="ez-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/valleyhikes.htm" target="_blank" rel="noopener noreferrer">Yosemite Valley Day Hikes, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/lowerfalltrail.htm" target="_blank" rel="noopener noreferrer">Lower Yosemite Fall Trail, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/places/000/lower-yosemite-fall-trailhead.htm" target="_blank" rel="noopener noreferrer">Lower Yosemite Fall Trailhead, NPS</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/cooksmeadowtrail.htm" target="_blank" rel="noopener noreferrer">Cook's Meadow Loop, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/bridalveilfalltrail.htm" target="_blank" rel="noopener noreferrer">Bridalveil Fall Trail, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/places/000/bridalveil-fall.htm" target="_blank" rel="noopener noreferrer">Bridalveil Fall, NPS</a></li>
                <li><a href="https://www.nps.gov/yose/getinvolved/bridalveilea.htm" target="_blank" rel="noopener noreferrer">Bridalveil Fall Rehabilitation Project, NPS</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/mirrorlaketrail.htm" target="_blank" rel="noopener noreferrer">Mirror Lake Trail, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm" target="_blank" rel="noopener noreferrer">Vernal and Nevada Fall Trails, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/publictransportation.htm" target="_blank" rel="noopener noreferrer">Public transportation, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/thingstodo/becomejrranger.htm" target="_blank" rel="noopener noreferrer">Become a Yosemite Junior Ranger, NPS</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">Yosemite Guide, September 23 to November 24, 2026, NPS</a></li>
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

      <div className="hp-wrap ez-end">
        <AffiliateNote />
      </div>
    </div>
  );
};
