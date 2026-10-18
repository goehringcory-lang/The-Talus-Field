/* global React, EventIcon, ResponsiveImage, LodgingCta, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Yosemite campground reservations (October 2026), built on the Mist Trail
// feature layout: the catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's full width. Every section sits on the design's container
// (`hp-wrap`), alternating paper and the `ff-band` tint, and uses the shared
// `.ff-*` kit; the page-level `cr-*` rules are the `.cr-feature` layer in
// styles.css.
//
// Three rules hold it up.
//   1. Every window, date, fee, limit and phone number restates the sources
//      listed at the foot of the page, read October 18, 2026: the Park
//      Service's campground table, its reservations, Camp 4, no-reservation,
//      regulations, lodging and lottery pages, and Recreation.gov's Upper
//      Pines and North Pines pages, its reservation tips and its policies.
//      Where two official pages disagree (Camp 4's season, "PT" against
//      "PST"), the page says so. Nothing is added from memory.
//   2. The release calendar is arithmetic on Recreation.gov's own example
//      ("on January 15, arrival dates for the period May 15 to June 14 become
//      available"), the same rule the camping guide's picker uses. It says
//      which arrival dates open, not which campgrounds will be open on them:
//      the 2027 season dates are not published.
//   3. The cards, lists and tables restate sentences in the prose beside
//      them, so the graphics add no fact of their own.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["yosemite-campground-reservations"] = function YosemiteCampgroundReservationsBody() {
  const TOC = [
    ["#cr-windows", "The four windows"],
    ["#cr-calendar", "Release calendar"],
    ["#cr-morning", "Release morning"],
    ["#cr-rules", "After you book"],
    ["#cr-first-come", "First-come sites"],
    ["#cr-full", "When it is full"],
    ["#cr-lottery", "The lottery"],
    ["#cr-questions", "Questions"],
  ];

  // seo-data.json `faq`, word for word.
  const FAQ = [
    ["When do Yosemite campground reservations open?", "Upper Pines, Lower Pines, North Pines, Wawona and Hodgdon Meadow release on Recreation.gov five months ahead, on the 15th of each month, one block of arrival dates at a time: on January 15, arrivals from May 15 to June 14 open. Half of Tuolumne Meadows releases two months ahead on the 15th. Crane Flat, Bridalveil Creek, Tamarack Flat, White Wolf, Yosemite Creek, Porcupine Flat and the other half of Tuolumne release two weeks ahead on a rolling daily window, and Camp 4 one week ahead."],
    ["What time do Yosemite campsites go on sale?", "7 am Pacific time. The Park Service says all non-lottery reservations are released at 7 am Pacific and sell out within minutes. Log in to Recreation.gov before then; you must be logged in to add a site to your cart."],
    ["How many Yosemite campground reservations can I make at once?", "Two. The Park Service says you may make only two reservations per website visit or phone call. Recreation.gov holds a site in your cart for 15 minutes, and asks you not to log in to the same account in more than one browser, tab or window."],
    ["Are there first-come, first-served campgrounds in Yosemite?", "Only from late fall to early spring. The Park Service says no first-come campgrounds are open from mid-April through October. In the off-season, Camp 4, Hodgdon Meadow and Wawona run first-come, first-served, and they can fill early on weekends and holidays. The campground status line is 209/372-0266."],
    ["What does it cost to cancel a Yosemite campsite?", "Per Recreation.gov's Upper Pines page: $10 more than 48 hours before arrival; $10 plus the first night's fee within 48 hours; a one-night reservation has no $10 fee but is not refundable inside 48 hours; and a no-show pays a $20 fee and loses the first night."],
    ["Is there a Yosemite campground lottery for 2027?", "None was announced as of October 18, 2026. North Pines ran a one-time Early Access Lottery for the 2026 season, with a $10 application fee, and the Park Service said it may consider expanding the idea to other campgrounds. Check the park's lottery page and the campground's Recreation.gov page before planning a release morning."],
  ];

  // ── The four windows, from the NPS campground table (2026) ────────────────
  const WINDOWS = [
    { lead: "5 months", name: "On the 15th", cls: "is-hard",
      camps: "Upper Pines, Lower Pines, North Pines, Wawona, Hodgdon Meadow",
      text: "One block of arrival dates, the 15th through the 14th, opens at 7 am Pacific on the 15th, five months out." },
    { lead: "2 months", name: "On the 15th", cls: "is-mid",
      camps: "Half of Tuolumne Meadows",
      text: "Half the sites release two months ahead, on the 15th." },
    { lead: "2 weeks", name: "Rolling, daily", cls: "is-soft",
      camps: "Crane Flat, Bridalveil Creek, Tamarack Flat, White Wolf, Yosemite Creek, Porcupine Flat, the other half of Tuolumne",
      text: "A new day opens every morning at 7 am Pacific." },
    { lead: "1 week", name: "Rolling, daily", cls: "is-soft",
      camps: "Camp 4, in its reservation season",
      text: "Seven days ahead, $10 a person a night." },
  ];

  // ── The thirteen, as the NPS table prints them for 2026 ───────────────────
  // [name, window, 2026 season, sites, fee]
  const CAMPS = [
    ["Upper Pines", "5 months", "All year", 236, "$36"],
    ["Lower Pines", "5 months", "Apr 21 to Oct 19", 74, "$36"],
    ["North Pines", "5 months (2026: lottery first)", "Apr 21 to Oct 26", 81, "$36"],
    ["Wawona", "5 months", "All year; reserved Apr 15 to Oct 26 (Loop A to Nov 29)", 95, "$36"],
    ["Hodgdon Meadow", "5 months", "All year; reserved Apr 15 to Oct 26", 100, "$36"],
    ["Tuolumne Meadows", "Half 2 months, half 2 weeks", "Jul 1 to Sep 27", 289, "$36"],
    ["Crane Flat", "2 weeks", "May 21 to Oct 12", 148, "$36"],
    ["Bridalveil Creek", "2 weeks", "Jul 3 to Aug 14, closed early", 110, "$36"],
    ["White Wolf", "2 weeks", "Jul 2 to Sep 14", 68, "$28"],
    ["Tamarack Flat", "2 weeks", "Jun 22 to Oct 12", 52, "$24"],
    ["Yosemite Creek", "2 weeks", "Jul 1 to Sep 7", 74, "$24"],
    ["Porcupine Flat", "2 weeks", "Jun 23 to Oct 11", 55, "$24"],
    ["Camp 4", "1 week", "All year; reserved Apr 15 to Nov 29", 61, "$10 a person"],
  ];

  // ── The next eight release mornings ───────────────────────────────────────
  // Recreation.gov's example, rolled forward: each 15th opens arrivals from
  // the 15th of the month four months later through the 14th of the next.
  const RELEASES = [
    ["Sun, Nov 15, 2026", "Mar 15 to Apr 14, 2027"],
    ["Tue, Dec 15, 2026", "Apr 15 to May 14, 2027"],
    ["Fri, Jan 15, 2027", "May 15 to Jun 14, 2027"],
    ["Mon, Feb 15, 2027", "Jun 15 to Jul 14, 2027", true],
    ["Mon, Mar 15, 2027", "Jul 15 to Aug 14, 2027", true],
    ["Thu, Apr 15, 2027", "Aug 15 to Sep 14, 2027", true],
    ["Sat, May 15, 2027", "Sep 15 to Oct 14, 2027"],
    ["Tue, Jun 15, 2027", "Oct 15 to Nov 14, 2027"],
  ];

  // ── What cancelling costs, per Recreation.gov (Upper Pines) ───────────────
  const CANCEL = [
    ["More than 48 hours out", "$10 transaction fee"],
    ["Within 48 hours", "$10 plus the first night"],
    ["One-night stay, within 48 hours", "No $10 fee, no refund"],
    ["No-show", "$20 plus the first night"],
  ];

  return (
    <div className="cr-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="calendar" /><dt>Valley release</dt><dd>The 15th, five months ahead</dd></div>
          <div><EventIcon name="clock" /><dt>On sale</dt><dd>7 am Pacific, gone in minutes</dd></div>
          <div><EventIcon name="route" /><dt>High country</dt><dd>Two weeks ahead, every morning</dd></div>
          <div><EventIcon name="ticket" /><dt>Per visit</dt><dd>Two reservations, 15-minute cart</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the answer, and the whole page in four lines. */}
      <section className="hp-wrap hp-section cr-open">
        <div className="ff-split">
          <div className="cr-prose">
            <p className="dropcap">
              Every reservable campsite in Yosemite books on Recreation.gov, and the ones most people want go on sale at 7 am Pacific on the 15th of the month, five months ahead. The Park Service's own word for them is "extremely difficult to get," and it says they sell out within minutes.
            </p>

            <p>
              That is one door of four. The high-country campgrounds open a new day every morning, two weeks out. Half of Tuolumne Meadows opens two months out. Camp 4 opens one week out. From late fall to early spring, three campgrounds drop reservations altogether and go first-come, first-served.
            </p>

            <p>
              This page is the mechanics: which campground sits behind which door, the next eight release mornings, what to do in the minutes around 7:00, the rules that come with the site, and the ways in once it is gone. For the campgrounds themselves, site by site, read <a href="/articles/yosemite-camping-complete-guide">the complete Yosemite camping guide</a>.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>The Pines, Wawona and Hodgdon Meadow: the 15th, 7 am Pacific, five months ahead.</li>
              <li>Want mid-July to mid-August 2027? Your morning is March 15.</li>
              <li>Two reservations per visit. Log in early, one tab.</li>
              <li>Missed it: the two-week campgrounds open a day every morning at 7.</li>
              <li>No first-come camping from mid-April through October.</li>
            </ul>
            <a className="cr-short__link" href="#cr-calendar">Find your release morning ↓</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="cr-windows" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">THE FOUR WINDOWS</p>
          <h2>Which campground opens when</h2>
          <ol className="cr-windows">
            {WINDOWS.map((w) => (
              <li key={w.lead} className={w.cls}>
                <span>{w.lead}</span>
                <strong>{w.name}</strong>
                <p className="cr-windows__camps">{w.camps}</p>
                <p>{w.text}</p>
              </li>
            ))}
          </ol>

          <div className="ff-split cr-after">
            <div className="cr-prose">
              <p>
                <strong>Five months, on the 15th.</strong> Upper Pines, Lower Pines and North Pines on the Valley floor, plus Wawona and Hodgdon Meadow, release one block of arrival dates at a time. Recreation.gov's Upper Pines page gives the example: "on January 15, arrival dates for the period May 15 to June 14 become available to reserve." So the block runs from the 15th to the 14th, and it opens on the 15th four months before its first night.
              </p>

              <p>
                <strong>Two months, on the 15th.</strong> Half the sites at Tuolumne Meadows, the park's biggest campground at 289 sites, release this way. The Park Service's table lists Tuolumne as "2 months ahead on 15th and 14 days ahead." Its Recreation.gov page does not spell out the split, so check the campground's own page for the exact block.
              </p>

              <p>
                <strong>Two weeks, rolling.</strong> Crane Flat, Bridalveil Creek, Tamarack Flat, White Wolf, Yosemite Creek, Porcupine Flat and the other half of Tuolumne open two weeks ahead, one new day every morning. They sit between 6,200 and 8,600 feet, and in 2026 they opened between May 21 and July 3, so their seasons are short and move every year.
              </p>

              <p>
                <strong>One week, rolling.</strong> Camp 4, a walk-in, tents-only campground in Yosemite Valley, releases one week before arrival during its reservation season. It costs $10 a person a night, and up to six people can be registered for a site per reservation transaction.
              </p>

              <p>
                The Park Service says all non-lottery reservations release at 7 am Pacific. Recreation.gov's Yosemite pages print the same hour as both "PT" and "PST." Read it as 7 am on the clock in California that morning.
              </p>
            </div>
            <div className="cr-tablewrap">
              <h3 className="cr-head">All thirteen, as the Park Service lists them for 2026</h3>
              <table className="cr-table">
                <thead>
                  <tr><th scope="col">Campground</th><th scope="col">Window</th><th scope="col">2026 season</th><th scope="col">Sites</th><th scope="col">Night</th></tr>
                </thead>
                <tbody>
                  {CAMPS.map(([name, win, season, sites, fee]) => (
                    <tr key={name}><th scope="row">{name}</th><td>{win}</td><td>{season}</td><td>{sites}</td><td>{fee}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="ff-note">The park sets the seasons each year, and the 2027 dates were not published when this was written. Bridalveil Creek closed early in 2026 after a lightning strike.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="cr-calendar" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE RELEASE CALENDAR</p>
            <h2>Count back to the 15th, four months before the block</h2>
            <div className="cr-prose">
              <p>
                Find the block your first night falls in, then go back to the 15th four months before the block starts. A first night on the 1st to the 14th belongs to the block that began the month before. A trip from July 10 to 13, 2027 sits in the June 15 to July 14 block, so it opens on February 15. A trip from July 16 to 19 sits in the next block and opens on March 15.
              </p>

              <p>
                There is no earlier door. The block is set by your arrival date, so if a stay starts on the 14th, it opens a month before a stay that starts on the 15th. If you can slide a trip by a day or two across that line, you choose which morning you compete on.
              </p>

              <p>
                The calendar says which arrival dates open, not which campgrounds will be open on them. Lower and North Pines opened April 21 in 2026, and Wawona and Hodgdon Meadow took reservations from April 15; if 2027 runs the same way, the November 15 morning is an Upper Pines morning only. The three that open summer arrivals are February 15, March 15 and April 15. The <a href="/dates">park dates table</a> carries the same rule.
              </p>
            </div>
          </div>
          <div>
            <h3 className="cr-head">The next eight release mornings, 7 am Pacific</h3>
            <ol className="ff-hours cr-cal">
              {RELEASES.map(([day, opens, glow]) => (
                <li key={day} className={glow ? "is-glow" : undefined}>
                  <span>{day}</span>
                  <p>Arrivals {opens}.</p>
                </li>
              ))}
            </ol>
            <p className="ff-note">Worked from Recreation.gov's example for the five-month campgrounds. Highlighted: the summer blocks. Confirm the on-sale date on the campground's Recreation.gov page.</p>
          </div>
        </div>
      </section>

      <section className="ff-band" id="cr-morning" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">RELEASE MORNING</p>
              <h2>The work is done before 7:00</h2>
              <div className="cr-prose">
                <p>
                  Recreation.gov publishes its own tips for popular campgrounds, and they line up with the Park Service's. Make the account ahead of time. Log in "well before the sale begins"; on the Yosemite pages you cannot add a site to your cart without being logged in. Synchronize your clock to the Recreation.gov clock, which it links as Coordinated Universal Time.
                </p>

                <p>
                  Then one tab. Recreation.gov says plainly: "Do NOT log in to multiple browsers, multiple tabs, or multiple windows using the same account." Once you click Add to Cart, the site is locked in your cart for 15 minutes, which is enough time to check out and not enough to keep browsing.
                </p>

                <p>
                  The Park Service caps you at two reservations per website visit or phone call. Know which two before the clock turns, and have fallback dates written down. Recreation.gov also suggests trips that skip a Friday and Saturday night, and shoulder seasons, where you can.
                </p>

                <p>
                  For a first trip, decide on a campground before you decide on a site. <a href="/articles/camping-in-yosemite-first-time">What a first night in a Yosemite campground is actually like</a> covers what you are booking: the bear locker, the neighbors and the arrival hour.
                </p>
              </div>
            </div>
            <div>
              <h3 className="cr-head">The morning, step by step</h3>
              <ol className="ff-hours cr-steps">
                <li><span>Days before</span><p>Create the Recreation.gov account. Pick the campground, the dates, and two fallbacks.</p></li>
                <li><span>The night before</span><p>Open the campground's page and confirm its on-sale date and time.</p></li>
                <li><span>Well before 7</span><p>Log in. Sync to the Recreation.gov clock. One browser, one tab.</p></li>
                <li className="is-glow"><span>7:00 Pacific</span><p>Add a site that fits your party. It is held for 15 minutes. Check out.</p></li>
                <li><span>The limit</span><p>Two reservations per visit. Then you are done for the morning.</p></li>
                <li><span>If you miss</span><p>Set an Availability Alert on the campground and turn to the rolling windows.</p></li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="cr-rules" tabIndex={-1}>
        <p className="hp-eyebrow">AFTER YOU BOOK</p>
        <h2>The rules that come with the site</h2>
        <ul className="ff-rules cr-rules">
          <li>
            <EventIcon name="users" size={26} />
            <strong>Six people, two vehicles.</strong>
            <p>A maximum of six people, children included, and two motor vehicles per site. Some sites take only one vehicle; the site details on Recreation.gov say which.</p>
          </li>
          <li>
            <EventIcon name="clock" size={26} />
            <strong>Noon, and 10 am.</strong>
            <p>Check-in and checkout are at noon. Check in at the campground kiosk before 10 am the morning after your first night, or the reservation is cancelled.</p>
          </li>
          <li>
            <EventIcon name="calendar" size={26} />
            <strong>Thirty nights a year.</strong>
            <p>From May 1 to September 15, the limit is 14 nights, and only seven of those in Yosemite Valley or Wawona.</p>
          </li>
          <li>
            <EventIcon name="no" size={26} />
            <strong>No resale.</strong>
            <p>Recreation.gov says resale or auction of advance reservations is prohibited.</p>
          </li>
        </ul>

        <div className="ff-split cr-after">
          <div className="cr-prose">
            <p>
              <strong>Arriving late.</strong> Recreation.gov's Upper Pines page says a late arrival should call 209/372-8502, and that the reservation may be cancelled if the campground does not hear from you within 24 hours of your arrival date. An after-hours arrival signs in and returns to the kiosk the next morning to finish check-in.
            </p>

            <p>
              <strong>Sleeping in the car.</strong> The Park Service does not allow it anywhere in the park except a campsite you are registered for, and not along the side of the road. Camp 4 is walk-in and tents only, so not there either.
            </p>

            <p>
              <strong>The gate.</strong> The campsite does not cover the park entrance fee, which Recreation.gov notes is charged per vehicle and separately.
            </p>

            <p>
              <strong>Quiet hours</strong> run 10 pm to 6 am, and generators may run only from 7 to 9 am, noon to 2 pm, and 5 to 7 pm.
            </p>
          </div>
          <div className="cr-policy">
            <h3 className="cr-head">What cancelling costs</h3>
            <dl>
              {CANCEL.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <p className="ff-note">From Recreation.gov's Upper Pines and North Pines pages. Terms are set per campground; confirm them on your own reservation.</p>
          </div>
        </div>
      </section>

      <section className="ff-band" id="cr-first-come" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">FIRST-COME, FIRST-SERVED</p>
              <h2>Only in the cold months</h2>
              <div className="cr-prose">
                <p>
                  From mid-April through October, the Park Service says, "There are no first-come, first-served campgrounds open." Its advice for those months is blunt: "Do not arrive at Yosemite without a reservation." The only move then is to watch Recreation.gov for cancellations.
                </p>

                <p>
                  Three campgrounds go first-come in the off-season. Hodgdon Meadow and Wawona are first-come, first-served from late October through early April. Camp 4 is first-come from mid-November through mid-April, the Park Service says, "usually until sometime in April," and its fee drops to $10 a night. All three can fill early on weekends and holidays, and Camp 4 "may fill early in the morning every day in spring and fall if weather is nice."
                </p>

                <p>
                  <strong>This fall, the dates are later than usual.</strong> For 2026 the park extended Camp 4's reservation season to November 29 (the last reserved night is November 28) and Wawona's Loop A to November 29. Hodgdon Meadow's reservations ran through October 26, and Wawona's Loops B and C close for the season on October 26. The park's general reservations page still prints an older Camp 4 season, so the campground pages are the ones to trust. Call the campground status line, 209/372-0266, before you drive up on a hunch.
                </p>
              </div>
            </div>
            <div>
              <figure className="cr-photo">
                <ResponsiveImage image="img/camp-4-kiosk.jpg" style={{ aspectRatio: "1600 / 1561" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
                  alt="The Camp 4 kiosk and its notice board in Yosemite Valley" />
                <figcaption>The Camp 4 kiosk. Reserved one week ahead from April 15 to November 29 in 2026, first-come the rest of the year. Photo: Almonroth / Wikimedia Commons (CC BY-SA 3.0)</figcaption>
              </figure>
              <ol className="ff-hours cr-fcfs">
                <li><span>Hodgdon Meadow</span><p>First-come from late October to early April.</p></li>
                <li><span>Wawona</span><p>First-come from late October to early April. Loop A reserved to Nov 29 in 2026.</p></li>
                <li><span>Camp 4</span><p>First-come from mid-November to mid-April. Reserved to Nov 29 in 2026.</p></li>
                <li className="is-glow"><span>Everything else</span><p>Reservation only, or closed for winter.</p></li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="cr-full" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">WHEN IT IS SOLD OUT</p>
            <h2>The other doors</h2>
            <div className="cr-prose">
              <p>
                <strong>The rolling campgrounds.</strong> A sold-out 15th is not the end of summer. Every morning at 7, the two-week campgrounds open another day, from Crane Flat to the high-country half of Tuolumne Meadows. Their seasons are short, and the campgrounds sit between 6,200 and 8,600 feet.
              </p>

              <p>
                <strong>Cancellations.</strong> Recreation.gov's Availability Alerts send an email or notification when a site you are watching opens. Cancelling costs $10 until 48 hours before arrival. Flexible dates matter more than any tool: one fixed weekend is a long shot, a free week is not.
              </p>

              <p>
                <strong>Camp 4.</strong> One week out, every day, in its reservation season, and first-come in the cold months.
              </p>

              <p>
                <strong>A roof instead.</strong> Housekeeping Camp and Curry Village are not campgrounds. They are lodging run by the park's concessioner, Yosemite Hospitality, which takes its own reservations, and the Park Service says in-park lodging is available 366 days in advance. That is seven months before the campgrounds' first door. <a href="/articles/housekeeping-camp-vs-curry-village">Housekeeping Camp against Curry Village</a> compares the two canvas-roofed Valley stays.
              </p>

              <p>
                <strong>A wilderness permit.</strong> A night in the backcountry runs on its own quota and its own calendar; <a href="/articles/yosemite-wilderness-permits-guide">the wilderness permit guide</a> covers it.
              </p>
            </div>
          </div>
          <div>
            <figure className="cr-photo">
              <ResponsiveImage image="img/tuolumne-meadows-late-summer.jpg" style={{ aspectRatio: "1600 / 1068" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
                alt="Tuolumne Meadows in late summer, dry grass and lodgepole pines below granite domes" />
              <figcaption>Tuolumne Meadows, the park's largest campground, half on the two-month window and half on the two-week one. Photo: Dsdugan / Wikimedia Commons (CC0)</figcaption>
            </figure>
            <div className="cr-stay">
              {/* The campgrounds and the in-park lodges are the recommendation
                  and book through Recreation.gov and Yosemite Hospitality, so
                  they are named without a link; the availability search is for
                  the night the park is full. */}
              <LodgingCta
                destination="Yosemite National Park"
                heading="When every campsite is gone"
                note="Watch Recreation.gov for cancellations first, and look at Yosemite Hospitality's tent cabins, which open a year ahead. If you still have nowhere to sleep, a search shows the rooms left within driving distance of the gates."
                list="article_cta"
                slug="yosemite-campground-reservations"
                cta="Search lodging around Yosemite →"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="ff-band" id="cr-lottery" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">THE LOTTERY</p>
            <h2>North Pines tried one, once</h2>
            <div className="cr-prose">
              <p>
                For the 2026 season, North Pines ran what the Park Service called a "one-time early access lottery." Applications ran November 24 to December 14, 2025, with a nonrefundable $10 fee, one application per person. Results came out December 22. Winners got a time slot between January 2 and February 1, 2026, to make one reservation, one continuous stay in one site, capped at seven nights, at $36 a night.
              </p>

              <p>
                What the winners did not take went back into the ordinary releases, starting with the February 15 on-sale. Sites at risk of flooding were held back until the park judged the risk low.
              </p>

              <p>
                As of October 18, 2026, we found no announcement of a lottery for 2027, at North Pines or anywhere else. The Park Service said it "may consider expanding it to other campgrounds" depending on visitor feedback. Last year's application window opened in late November, so check <a href="https://www.nps.gov/yose/planyourvisit/lottery-pilot.htm" target="_blank" rel="noopener noreferrer">the park's lottery page</a> and the campground's Recreation.gov page this November before you count on the 15th.
              </p>
            </div>
          </div>
          <article className="ff-inpark cr-lot">
            <p className="hp-eyebrow">2026 PILOT</p>
            <h3>North Pines Early Access Lottery</h3>
            <dl>
              <div><dt>Applications</dt><dd>Nov 24 to Dec 14, 2025</dd></div>
              <div><dt>Fee</dt><dd>$10, nonrefundable</dd></div>
              <div><dt>Results</dt><dd>Dec 22, 2025</dd></div>
              <div><dt>Winners booked</dt><dd>Jan 2 to Feb 1, 2026</dd></div>
              <div><dt>Stay</dt><dd>One site, up to seven nights</dd></div>
              <div><dt>2027</dt><dd>Not announced as of Oct 18, 2026</dd></div>
            </dl>
          </article>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="cr-questions" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Yosemite campground reservations, answered</h2>
            <div className="cr-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/campgrounds.htm" target="_blank" rel="noopener noreferrer">Campgrounds, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/camping.htm" target="_blank" rel="noopener noreferrer">Campground Reservations, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/camp4.htm" target="_blank" rel="noopener noreferrer">Camp 4, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/nrcamping.htm" target="_blank" rel="noopener noreferrer">Camping Without a Reservation, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/campregs.htm" target="_blank" rel="noopener noreferrer">Campground Regulations, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/lottery-pilot.htm" target="_blank" rel="noopener noreferrer">North Pines Early Access Lottery, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/lodging.htm" target="_blank" rel="noopener noreferrer">Lodging, NPS Yosemite</a></li>
                <li><a href="https://www.recreation.gov/camping/campgrounds/232447" target="_blank" rel="noopener noreferrer">Upper Pines Campground, Recreation.gov</a></li>
                <li><a href="https://www.recreation.gov/camping/campgrounds/232449" target="_blank" rel="noopener noreferrer">North Pines Campground, Recreation.gov</a></li>
                <li><a href="https://www.recreation.gov/articles/list/tips-for-making-campsite-reservations-at-popular-locations/281" target="_blank" rel="noopener noreferrer">Tips for Making Campsite Reservations at Popular Locations, Recreation.gov</a></li>
                <li><a href="https://www.recreation.gov/rules-reservation-policies" target="_blank" rel="noopener noreferrer">Rules and Reservation Policies, Recreation.gov</a></li>
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

      <div className="hp-wrap cr-end">
        <AffiliateNote />
      </div>
    </div>
  );
};
