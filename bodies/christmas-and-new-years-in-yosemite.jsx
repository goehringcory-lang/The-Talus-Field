/* global React, EventIcon, ResponsiveImage, LodgingCta, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Christmas and New Year's in Yosemite (October 2026), built on the Mist Trail
// feature layout: the catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's full width. Every section sits on the design's container
// (`hp-wrap`), alternating paper and the `ff-band` tint, and uses the shared
// `.ff-*` kit; the page-level `cny-*` rules are the `.cny-feature` layer in
// styles.css.
//
// Two rules hold it up.
//   1. Every date, price, time, phone number and rule restates the sources
//      listed at the foot of the page: Yosemite Hospitality's Bracebridge,
//      New Year's Eve, Curry Village, ice rink, Badger Pass and offers pages,
//      the Park Service's winter, chains, fees, hours, lodging, campgrounds,
//      transportation and conditions pages, and Caltrans' chain-control page.
//      The chapel's holiday times come from this site's worship guide, whose
//      source page would not load this run, so the page says so. The Badger
//      Pass record for the last two winters comes from press reports of the
//      operators' own announcements, and is marked as such. Nothing is added
//      from memory.
//   2. The cards, lists and tables restate sentences in the prose beside
//      them, so the graphics add no fact of their own.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["christmas-and-new-years-in-yosemite"] = function ChristmasAndNewYearsInYosemiteBody() {
  const TOC = [
    ["#cny-calendar", "The calendar"],
    ["#cny-crowds", "The crowd"],
    ["#cny-lodging", "Where to sleep"],
    ["#cny-open", "What is open"],
    ["#cny-badger", "Badger Pass"],
    ["#cny-chains", "Chains"],
    ["#cny-plan", "Three plans"],
    ["#cny-questions", "Questions"],
  ];

  // seo-data.json `faq`, word for word.
  const FAQ = [
    ["Is Yosemite open on Christmas Day?", "Yes. The Park Service says Yosemite is open 24 hours a day, 365 days a year. Yosemite Valley and Wawona are reachable by car all year, though Tioga Road and most of Glacier Point Road are closed by snow, and chains may be required on any day."],
    ["What is there to do in Yosemite for New Year's Eve?", "Yosemite Hospitality lists two parties on December 31, 2026: the Ahwahnee's New Year's Eve Dinner Dance, 8:30 pm to 12:30 am, $299 for adults and $149 for children, and a party in the Mountain Room at Yosemite Valley Lodge, 6 pm to 12:30 am, $75 for adults and $40 for children under 12, with tickets sold on site the day of the party."],
    ["When is the Bracebridge Dinner in 2026?", "Yosemite Hospitality lists eight nights at the Ahwahnee: December 8, 10, 12, 14, 16, 18, 20 and 22, 2026. There is no performance on Christmas Eve or Christmas Day. As of mid-October, December 12 was marked sold out."],
    ["Will Badger Pass be open for Christmas?", "Nobody knows yet. The concessioner describes the season as mid-December to mid-March, conditions permitting, but Badger Pass did not open at all in the 2024 to 2025 winter and opened on January 16 in 2026. No 2026 to 2027 opening date had been announced as of October 18, 2026. Call the Snow Phone, 209-372-1000."],
    ["Do I need chains to visit Yosemite at Christmas?", "You must carry them. When chain controls are in effect in the park, every vehicle must have chains in it, including four-wheel drives and rental cars, and failing to put them on when required can bring a citation of up to $5,000. The park strongly recommends chains from November through March."],
    ["Is Curry Village open over Christmas?", "Yosemite Hospitality says Curry Village will not be open from November 29 through December 10, 2026, which leaves it open for the holiday weeks. Its heated tent cabins have heat in winter but no plumbing."],
  ];

  // ── The holiday calendar, from "The calendar" ─────────────────────────────
  const CALENDAR = [
    { day: "December 8 to 22", what: "The Bracebridge Dinner at the Ahwahnee, on alternate nights: December 8, 10, 12, 14, 16, 18, 20 and 22." },
    { day: "Mid-December", what: "The published start of the Badger Pass season and the plowed road to it, conditions permitting." },
    { day: "December 24", what: "Christmas Eve service at the Yosemite Valley Chapel, 4 to 5 pm, by the chapel's listing.", glow: true },
    { day: "December 25", what: "The park is open, as on every day of the year." },
    { day: "December 31, 6 pm", what: "New Year's Eve in the Mountain Room, Yosemite Valley Lodge. Tickets on site that day." },
    { day: "December 31, 8:30 pm", what: "The Ahwahnee's New Year's Eve Dinner Dance, to 12:30 am.", glow: true },
    { day: "December 31, 10 pm", what: "New Year's Watch Night service, with communion, at the chapel." },
  ];

  // ── The two parties, from "The calendar" ──────────────────────────────────
  const PARTIES = [
    { name: "The Ahwahnee's New Year's Eve Dinner Dance", where: "The Ahwahnee", when: "8:30 pm to 12:30 am",
      price: "$299 adults, $149 children", inc: "A coursed meal, a live band, a champagne toast, party favors, a take-home champagne glass and a portrait",
      book: "Not yet on sale in mid-October; 888-413-8869" },
    { name: "New Year's Eve at Yosemite Valley Lodge", where: "The Mountain Room", when: "6 pm to 12:30 am",
      price: "$75 adults, $40 children under 12", inc: "Food all night, a live band from 9 pm to midnight, a champagne toast",
      book: "Tickets on site the day of the party" },
  ];

  // ── Badger Pass, from "Badger Pass timing" ────────────────────────────────
  const BADGER = [
    { when: "The published season", name: "Mid-December to mid-March", cls: "is-peak",
      text: "Conditions permitting, lifts 9 am to 4 pm. The road is plowed to the ski area from mid-December through early April." },
    { when: "2024 to 2025", name: "Never opened", cls: "is-mid",
      text: "Announced February 11, 2025: too little snow early enough in the season. Season passes were refunded." },
    { when: "2025 to 2026", name: "January 16 to March 18", cls: "is-late",
      text: "The lifts opened January 16, 2026, after a planned January 9 Nordic opening, and closed March 18, about 60 days in all." },
  ];

  return (
    <div className="cny-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="food" /><dt>Bracebridge</dt><dd>December 8 to 22, alternate nights</dd></div>
          <div><EventIcon name="calendar" /><dt>New Year's Eve</dt><dd>Two parties, the Ahwahnee and the Lodge</dd></div>
          <div><EventIcon name="snow" /><dt>Badger Pass</dt><dd>Mid-December at the earliest, not promised</dd></div>
          <div><EventIcon name="car" /><dt>Chains</dt><dd>Every vehicle must carry them</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: what the fortnight is, and the whole page in four lines. */}
      <section className="hp-wrap hp-section cny-open">
        <div className="ff-split">
          <div className="cny-prose">
            <p className="dropcap">
              The two weeks around Christmas and New Year's are the one stretch of the Yosemite winter that behaves like summer. The Park Service says the park "may be very busy during winter holidays, especially in late December and early January," with traffic congestion and limited parking. The difference from summer is everything else: short days, a park mostly under snow, two roads closed, chains in the trunk, and a ski area that opens when the storms decide.
            </p>

            <p>
              What the season does offer is a small, fixed calendar. The Bracebridge Dinner runs at the Ahwahnee on the evenings before Christmas, the chapel holds a Christmas Eve service, and New Year's Eve has two parties in the Valley. Around those, it is the winter park: the Valley floor, Tunnel View, the ice rink at Curry Village, and Badger Pass if there is snow.
            </p>

            <p>
              Every date and price below comes from the concessioner's or the Park Service's own pages, read in October 2026. Several of them change before December. Confirm with the source before you build a trip on one.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>Book the room first. In-park lodging opens 366 days ahead, and the Park Service names holidays as the time to book early.</li>
              <li>Bracebridge ends December 22. Nothing is staged on Christmas Eve or Christmas Day.</li>
              <li>Do not plan Christmas around Badger Pass. It opened in mid-January last winter and not at all the winter before.</li>
              <li>Carry chains in every vehicle, rentals included.</li>
            </ul>
            <a className="cny-short__link" href="#cny-calendar">The fortnight, date by date ↓</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="cny-calendar" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE CALENDAR</p>
              <h2>What happens, and on which night</h2>
              <div className="cny-prose">
                <p>
                  <strong>The Bracebridge Dinner.</strong> The Ahwahnee's Old English dinner pageant runs on eight nights in 2026, by Yosemite Hospitality's ticket page: December 8, 10, 12, 14, 16, 18, 20 and 22. The last performance is three days before Christmas. In mid-October the page marked December 12 sold out and December 8 and 18 almost sold out, and the December 12 lodging packages were gone at all three hotels. Pre-dinner festivities in the Great Lounge run from 4 to 6 pm, gratuity is included in the ticket, and the page asks for at least a dark suit or cocktail dress, and no costumes. The page prints no ticket price. What it is and whether it is worth it are in <a href="/articles/bracebridge-dinner-and-vintners-holidays">the Bracebridge Dinner and Vintners' Holidays guide</a>.
                </p>

                <p>
                  <strong>Christmas Eve and Christmas Day.</strong> The Yosemite Valley Chapel lists a Christmas Eve service from 4 to 5 pm, as recorded in our guide to <a href="/articles/worship-in-yosemite">worship in Yosemite</a>; the chapel's own service page would not load for us this week, so confirm with the church office at 209-372-4831. On Christmas Day itself, nothing is staged. The park is open, as it is every day: the Park Service says Yosemite is open 24 hours a day, 365 days a year. The concessioner's holiday events page lists Thanksgiving, Vintners' Holidays, the Bracebridge Dinner and New Year's Eve, and no Christmas Day dinner. If you want a table on December 25, ask the restaurant when you book the room.
                </p>

                <p>
                  <strong>New Year's Eve.</strong> Two parties, both on December 31. The Ahwahnee's New Year's Eve Dinner Dance runs from 8:30 pm to 12:30 am, at $299 for adults and $149 for children, with a coursed meal, a live band, a champagne toast, party favors, a champagne glass to take home and a portrait; elegant attire is encouraged. In mid-October the Mariposa County visitors bureau listing said bookings would open soon, and the menu was marked coming soon. The cheaper night is in the Mountain Room at Yosemite Valley Lodge, from 6 pm to 12:30 am, at $75 for adults and $40 for children under 12, with food all night, a band from 9 pm to midnight and a champagne toast. Its tickets are sold on site the day of the party. The chapel's Watch Night service, with communion, starts at 10 pm.
                </p>
              </div>
            </div>
            <div>
              <h3 className="cny-sched__head">The fortnight, by the published calendars</h3>
              <ol className="ff-hours cny-sched">
                {CALENDAR.map((c) => (
                  <li key={c.day} className={c.glow ? "is-glow" : undefined}>
                    <span>{c.day}</span>
                    <p>{c.what}</p>
                  </li>
                ))}
              </ol>
              <p className="ff-alert cny-alert">
                <EventIcon name="no" />
                <span>
                  <strong>No Bracebridge at Christmas.</strong> The 2026 run ends on December 22. A trip booked for Christmas week to see it arrives too late.
                </span>
              </p>
            </div>
          </div>

          <div className="cny-parties">
            {PARTIES.map((p) => (
              <article key={p.name} className="cny-party">
                <p className="cny-party__when">December 31 · {p.when}</p>
                <h3>{p.name}</h3>
                <dl>
                  <div><dt>Where</dt><dd>{p.where}</dd></div>
                  <div><dt>Price</dt><dd>{p.price}</dd></div>
                  <div><dt>Includes</dt><dd>{p.inc}</dd></div>
                  <div><dt>Booking</dt><dd>{p.book}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="cny-crowds" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE CROWD</p>
            <h2>The busiest week of the winter</h2>
            <div className="cny-prose">
              <p>
                The Park Service's winter page puts it plainly: late December and early January are when the winter park is busiest, with traffic congestion and limited parking possible. The Valley's lots behave more like a summer weekend than a winter weekday that week. Arrive early, park once, and use the free shuttle; the park lists the Valleywide route every 12 to 22 minutes from 7 am to 10 pm. <a href="/articles/yosemite-valley-parking-guide">The parking guide</a> covers which lots fill first.
              </p>

              <p>
                <strong>The fee.</strong> A private vehicle pays $35 at the gate, valid for seven consecutive days. Visitors who are not US residents, aged 16 and older, pay a further $100 each unless they enter on an annual or America the Beautiful pass. None of the park's 2026 fee-free days falls in December or January. The fee page we read says nothing of an entry reservation for this winter, so check the park's alerts before you go.
              </p>

              <p>
                <strong>The hotel company's calendar says the same thing.</strong> Its current winter offers (Ahwahnee rooms from $389 on select two-night stays, Yosemite Valley Lodge from $172 for two nights or more, Curry Village from $95 a night) print no dates on the offers page. Last winter's Ahwahnee offer, as listed by the Mariposa County visitors bureau, blacked out December 10, 2025, through January 3, 2026. Expect the holidays to sell at full price, and read the terms of this winter's offers before you count on one.
              </p>
            </div>
          </div>
          <figure className="cny-photo">
            <ResponsiveImage image="img/ahwahnee-great-lounge-evening.jpg" style={{ aspectRatio: "1600 / 1064" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="The Ahwahnee's Great Lounge in the evening, its tall windows and timbered ceiling lit from inside" />
            <figcaption>The Ahwahnee's Great Lounge, where the Bracebridge evening begins. Photo: Jerrye and Roy Klotz / Wikimedia Commons (CC BY-SA 3.0)</figcaption>
          </figure>
        </div>
      </section>

      <section className="ff-band" id="cny-lodging" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">WHERE TO SLEEP</p>
              <h2>Book the room before anything else</h2>
              <div className="cny-prose">
                <p>
                  The Park Service says in-park lodging reservations open 366 days ahead and are strongly recommended, "especially from spring through fall and during holidays." For a holiday trip, that makes the room the first booking and everything else the second. If your dates are already sold out, cancellations are the route in; check back often.
                </p>

                <p>
                  <strong>The Ahwahnee and Yosemite Valley Lodge</strong> are open all year, and they hold the two New Year's Eve parties. <strong>Curry Village</strong> closes early in the season, from November 29 through December 10, 2026, by the concessioner's page, and is open again for the holidays. Its heated tent cabins have heat from the Tuesday after Labor Day to the Friday before Memorial Day, and one electrical outlet, but no plumbing, so the bathroom is a walk on what may be an icy path. <strong>The Wawona Hotel</strong> is closed for a condition assessment with no reopening date, and Housekeeping Camp is a seasonal operation. The full comparison is in <a href="/articles/where-to-stay-in-yosemite">where to stay in Yosemite</a>.
                </p>

                <p>
                  <strong>Camping.</strong> The park lists four campgrounds open all year: Upper Pines, Camp 4, Wawona and Hodgdon Meadow. Upper Pines books five months ahead on the 15th, so holiday dates went on sale in summer, and by now a site is a cancellation. Plan on nights below freezing and a tent that can take snow.
                </p>

                <p>
                  <strong>Outside the park.</strong> Highway 140 through Mariposa and El Portal is the one approach the YARTS bus runs all year, which is a reason to look there first in winter. The town-by-town picture is on <a href="/stay">the lodging board</a>.
                </p>
              </div>
            </div>
            <div>
              <figure className="cny-photo">
                <ResponsiveImage image="img/curry-village.jpg" style={{ aspectRatio: "1600 / 1072" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
                  alt="Cabins at Curry Village under the trees on the Yosemite Valley floor" />
                <figcaption>Curry Village, closed November 29 to December 10, 2026, and open for the holidays. Photo: US National Park Service / Wikimedia Commons (public domain)</figcaption>
              </figure>
              <article className="ff-inpark cny-book">
                <p className="hp-eyebrow">IN-PARK LODGING</p>
                <h3>Over the holidays</h3>
                <dl>
                  <div><dt>The Ahwahnee</dt><dd>Open all year</dd></div>
                  <div><dt>Yosemite Valley Lodge</dt><dd>Open all year</dd></div>
                  <div><dt>Curry Village</dt><dd>Closed Nov 29 to Dec 10, then open</dd></div>
                  <div><dt>Wawona Hotel</dt><dd>Closed, no reopening date</dd></div>
                  <div><dt>Window</dt><dd>366 days ahead</dd></div>
                </dl>
                <p className="ff-note">Book through Yosemite Hospitality at travelyosemite.com or 888-413-8869.</p>
              </article>
            </div>
          </div>

          <div className="cny-stay">
            {/* The in-park hotels are the recommendation and book through
                Yosemite Hospitality, so they are named without a link; the
                availability search is for when they are full. */}
            <LodgingCta
              destination="Yosemite National Park"
              heading="When the Valley is full for the holidays"
              note="The Ahwahnee, Yosemite Valley Lodge and Curry Village book through Yosemite Hospitality, a year and a day ahead, and holiday dates go first. If yours are gone, a search shows what is left within driving distance."
              list="article_cta"
              slug="christmas-and-new-years-in-yosemite"
              cta="Search lodging around Yosemite →"
            />
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="cny-open" tabIndex={-1}>
        <p className="hp-eyebrow">WHAT IS OPEN</p>
        <h2>The holiday park is the Valley and Wawona</h2>
        <div className="ff-split">
          <div className="cny-prose">
            <p>
              <strong>Open by car.</strong> The Park Service says Yosemite Valley and Wawona are accessible by car all year. Those two are the holiday trip.
            </p>

            <p>
              <strong>Closed.</strong> Tioga Road is closed, usually by sometime in November. Glacier Point Road is closed past Badger Pass: from mid-December through early April the park plows it only as far as the ski area, so the drive-up view from Glacier Point is not part of a holiday visit. The Mariposa Grove road usually opens sometime in April; in winter the grove is a walk, by the two-mile Washburn Trail from the Welcome Plaza. <a href="/articles/mariposa-grove-how-to-visit">The Mariposa Grove guide</a> has the walk-in plan.
            </p>

            <p>
              <strong>The ice rink.</strong> The Curry Village rink is the winter activity that needs no snow. Its page lists daily sessions from noon to 2:30 pm, 3:30 to 6 pm and 7 to 9:30 pm, with an extra 8:30 to 11 am session on weekends and holidays. In mid-October the page said the 2026 to 2027 opening date was still to be determined, and it printed no prices; the rink's line is 209-372-8210.
            </p>

            <p>
              <strong>The trails.</strong> The park says some Valley trails are often accessible in winter. The winter closures of the steeper routes vary from year to year; <a href="/articles/yosemite-in-december">the December guide</a> has the record, and the conditions page the week you go is the only reliable word.
            </p>
          </div>
          <ul className="ff-rules cny-status">
            <li className="is-exception">
              <EventIcon name="check" size={26} />
              <strong>Yosemite Valley and Wawona.</strong>
              <p>Reachable by car all year.</p>
            </li>
            <li>
              <EventIcon name="no" size={26} />
              <strong>Tioga Road.</strong>
              <p>Closed, usually by sometime in November.</p>
            </li>
            <li>
              <EventIcon name="no" size={26} />
              <strong>Glacier Point.</strong>
              <p>Road plowed only to Badger Pass, mid-December through early April.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="walk" size={26} />
              <strong>Mariposa Grove.</strong>
              <p>On foot, two miles by the Washburn Trail.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="ff-band" id="cny-badger" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">BADGER PASS TIMING</p>
          <h2>Mid-December on paper, January in the last two winters</h2>
          <ol className="cny-seasons">
            {BADGER.map((s) => (
              <li key={s.when} className={s.cls}>
                <span>{s.when}</span>
                <strong>{s.name}</strong>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="ff-split cny-when">
            <div className="cny-prose">
              <p>
                The concessioner describes the Badger Pass downhill season as mid-December to mid-March, depending on conditions, with the lifts running daily from 9 am to 4 pm. The Park Service plows Glacier Point Road to the ski area from mid-December through early April, and its free shuttle from the Valley runs whenever the ski area's facilities are open, typically mid-December through March.
              </p>

              <p>
                "Depending on conditions" has decided the last two holiday seasons. In the 2024 to 2025 winter Badger Pass never opened: on February 11, 2025, the park's announcement, as reported by KMPH, said it would not open "due to a lack of snow early enough in the season." In the 2025 to 2026 winter the alpine area opened on January 16, 2026, and closed for the season on March 18, after about 60 days of operation, as reported in the ski press at the time. Neither winter had the hill running at Christmas.
              </p>

              <p>
                <strong>No 2026 to 2027 opening date had been announced as of October 18, 2026.</strong> Treat skiing at Christmas as a bonus, not the reason for the trip. To check, call the Snow Phone at 209-372-1000 for conditions and ski area information; the concessioner's downhill page also lists 209-372-8430. Everything else about the hill, the lessons and the huts is in <a href="/articles/badger-pass-ski-area">the Badger Pass guide</a>.
              </p>
            </div>
            <figure className="cny-photo">
              <ResponsiveImage image="img/half-dome-winter-snow.jpg" style={{ aspectRatio: "1600 / 1247" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
                alt="Half Dome under snow above a snow-covered Yosemite Valley, in an early photograph" />
              <figcaption>Half Dome in a snow year. Whether the holidays have one is the storms' decision. Photo: George Fiske / Wikimedia Commons (public domain)</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="cny-chains" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">CHAINS</p>
            <h2>Carry them, whatever you drive</h2>
            <div className="cny-prose">
              <p>
                The park strongly recommends carrying chains from November through March. The rule that catches holiday drivers is that when chain controls are in effect, "all vehicles must have tire chains in possession," even a vehicle the sign exempts from putting them on. Rental cars are not exempt, the park says, even with all-season tires. Failing to put chains on when required can bring a citation of up to $5,000.
              </p>

              <p>
                <strong>The three levels.</strong> Under R1, a car or pickup under 6,000 pounds with snow tires on at least two drive wheels, not towing, may go without mounting chains. Under R2, a four-wheel or all-wheel drive vehicle under 6,500 pounds, with snow tires on all four wheels and the drive engaged, not towing, may go without. Under R3, everyone chains up. Caltrans notes that a highway is often closed before R3 is imposed, and that the speed limit with chains required is 25 or 30 miles an hour.
              </p>

              <p>
                <strong>Before you drive in.</strong> The park's road line is 209-372-0200, then 1, then 1. Outside the park, Caltrans' highway line is 800-427-7623, and its QuickMap shows chain controls in real time. Caltrans also warns that chain installers at the checkpoints are not allowed to sell or rent chains, so buy them before you leave. Route choice is in <a href="/articles/getting-to-yosemite">the entrances guide</a>, and the full winter driving picture is in <a href="/articles/yosemite-in-winter">the winter guide</a>.
              </p>
            </div>
          </div>
          <div>
            <ul className="ff-rules cny-levels">
              <li>
                <EventIcon name="car" size={26} />
                <strong>R1</strong>
                <p>Chains on, except cars and pickups under 6,000 lb with snow tires on two drive wheels.</p>
              </li>
              <li>
                <EventIcon name="car" size={26} />
                <strong>R2</strong>
                <p>Chains on, except 4WD or AWD under 6,500 lb with snow tires on all four.</p>
              </li>
              <li>
                <EventIcon name="no" size={26} />
                <strong>R3</strong>
                <p>Chains on every vehicle. No exceptions.</p>
              </li>
              <li className="is-exception">
                <EventIcon name="alert" size={26} />
                <strong>Always</strong>
                <p>Chains in the vehicle under any control, rentals included. Up to $5,000.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="ff-band" id="cny-plan" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">THREE PLANS</p>
          <h2>Which holiday you book decides the trip</h2>
          <div className="ff-split">
            <div className="cny-prose">
              <p>
                <strong>The week before Christmas.</strong> If the Bracebridge Dinner is the point, come between December 8 and 22 and stay the night; the drive out after a late dinner is a dark winter road. Curry Village reopens after December 10. The holiday crowd has mostly not arrived, which is the case <a href="/articles/yosemite-in-december">the December guide</a> makes for the middle of the month.
              </p>

              <p>
                <strong>Christmas week.</strong> The quietest of the three for events: the chapel on Christmas Eve, the rink, and the Valley floor on foot or by shuttle. Book the room first, eat where you sleep on Christmas Day, and keep Badger Pass as a maybe.
              </p>

              <p>
                <strong>New Year's.</strong> Pick a party before you pick a hotel. The Ahwahnee's dinner dance is the formal evening; the Mountain Room is the walk-up one. Both are in the Valley, so a Valley room means no driving after midnight. The Park Service names early January, not only late December, as the busy stretch, so be parked early on New Year's Day.
              </p>

              <p>
                Visiting earlier in the season? <a href="/articles/thanksgiving-in-yosemite">The Thanksgiving guide</a> covers the other holiday weekend, with its own road record and dinners.
              </p>
            </div>
            <figure className="cny-photo">
              <ResponsiveImage image="img/yosemite-valley-snow-fiske.jpg" style={{ aspectRatio: "1600 / 1233" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
                alt="Yosemite Valley under snow, the trees and cliffs white, in an early photograph" />
              <figcaption>The Valley in snow, the holiday trip's whole territory. Photo: George Fiske / Wikimedia Commons (public domain)</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="cny-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>The holidays in Yosemite, answered</h2>
            <div className="cny-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.travelyosemite.com/things-to-do/specialty-events/food-and-wine-events/bracebridge-dinner" target="_blank" rel="noopener noreferrer">The Bracebridge Dinner, Yosemite Hospitality</a></li>
                <li><a href="https://www.travelyosemite.com/things-to-do/specialty-events/holiday-events/new-years-eve" target="_blank" rel="noopener noreferrer">New Year's Eve, Yosemite Hospitality</a></li>
                <li><a href="https://www.travelyosemite.com/things-to-do/specialty-events/holiday-events" target="_blank" rel="noopener noreferrer">Holiday events, Yosemite Hospitality</a></li>
                <li><a href="https://www.yosemitethisyear.com/eventdetail/18868/new-years-eve-dinner-dance" target="_blank" rel="noopener noreferrer">New Year's Eve Dinner Dance, Mariposa County visitors bureau</a></li>
                <li><a href="https://www.travelyosemite.com/lodging/curry-village/" target="_blank" rel="noopener noreferrer">Curry Village, Yosemite Hospitality</a></li>
                <li><a href="https://www.travelyosemite.com/winter/curry-village-ice-skating-rink/" target="_blank" rel="noopener noreferrer">Curry Village Ice Skating Rink, Yosemite Hospitality</a></li>
                <li><a href="https://www.travelyosemite.com/winter/badger-pass-ski-area/downhill-skiing-snowboarding/" target="_blank" rel="noopener noreferrer">Badger Pass downhill, Yosemite Hospitality</a></li>
                <li><a href="https://www.travelyosemite.com/special-offers/specials-packages" target="_blank" rel="noopener noreferrer">Specials and packages, Yosemite Hospitality</a></li>
                <li><a href="https://www.travelyosemite.com/lodging/wawona-hotel/" target="_blank" rel="noopener noreferrer">Wawona Hotel, Yosemite Hospitality</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/winter.htm" target="_blank" rel="noopener noreferrer">Winter, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/tirechains.htm" target="_blank" rel="noopener noreferrer">Tire chains, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/fees.htm" target="_blank" rel="noopener noreferrer">Fees, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/hours.htm" target="_blank" rel="noopener noreferrer">Operating hours, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/lodging.htm" target="_blank" rel="noopener noreferrer">Lodging, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/campgrounds.htm" target="_blank" rel="noopener noreferrer">Campgrounds, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/publictransportation.htm" target="_blank" rel="noopener noreferrer">Public transportation, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">Current conditions, NPS Yosemite</a></li>
                <li><a href="https://dot.ca.gov/travel/winter-driving-tips/chain-controls" target="_blank" rel="noopener noreferrer">Chain controls, Caltrans</a></li>
                <li><a href="https://kmph.com/news/local/badger-pass-ski-area-cancels-season-due-to-lack-of-snow" target="_blank" rel="noopener noreferrer">"Badger Pass Ski Area cancels season due to lack of snow," KMPH</a></li>
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

      <div className="hp-wrap cny-end">
        <AffiliateNote />
      </div>
    </div>
  );
};
