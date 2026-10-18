/* global React, EventIcon, ResponsiveImage, LodgingCta, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Worship in Yosemite (October 2026), built on the Mist Trail feature
// layout: the catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's full width. Every section sits on the design's container
// (`hp-wrap`), alternating paper and the `ff-band` tint, and uses the shared
// `.ff-*` kit; the page-level `wy-*` rules are the `.wy-feature` layer in
// styles.css.
//
// Two rules hold it up.
//   1. Every time, fee, phone number and rule restates the sources listed at
//      the foot of the page: the Yosemite Valley Chapel's own service page,
//      the Park Service's chapel history and weddings pages, the Church of
//      Jesus Christ's ward page, and Yosemite Hospitality's weddings page.
//      The Catholic schedule comes only from directory listings that
//      disagree on the place, so the page says so and sends the reader to
//      the parish. Nothing is added from memory.
//   2. The cards, lists and tables restate sentences in the prose beside
//      them, so the graphics add no fact of their own.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["worship-in-yosemite"] = function WorshipInYosemiteBody() {
  const TOC = [
    ["#wy-chapel", "The chapel"],
    ["#wy-campgrounds", "Campgrounds"],
    ["#wy-congregations", "Other congregations"],
    ["#wy-easter", "Easter and holidays"],
    ["#wy-seasons", "Seasons"],
    ["#wy-weddings", "Weddings"],
    ["#wy-etiquette", "Etiquette"],
    ["#wy-questions", "Questions"],
  ];

  // seo-data.json `faq`, word for word.
  const FAQ = [
    ["Are there church services in Yosemite?", "Yes. Yosemite Community Church, a nondenominational congregation, meets at the Yosemite Valley Chapel every Sunday: 9:15 am all year, plus 11 am from Memorial Day to Labor Day. Confirm times with the chapel at 209-372-4831 or in the current Yosemite Guide."],
    ["Is there an Easter sunrise service in Yosemite?", "Yes. The chapel lists an Easter sunrise service at 7 am at Lower Pines Campground in Yosemite Valley, weather permitting, then Easter services at 9:15 and 11 am. There is no Easter sunrise service at Glacier Point: Glacier Point Road is normally closed by snow from November through late May or June."],
    ["Is there a Catholic Mass in Yosemite?", "Directory listings show Our Lady of the Snows, a mission of Our Lady of the Sierra Parish in Oakhurst, with Sunday Mass at 10 am, served by visiting priests. The listings disagree on where it meets, so confirm the time and place with the parish in Oakhurst before you go."],
    ["Can you get married in Yosemite?", "Yes, with a National Park Service special use permit, which is required for any wedding or commitment ceremony anywhere in the park. The application fee is $150 and nonrefundable. Apply up to one year ahead and more than 21 days before the date. The permit does not reserve a site."],
    ["How do you book a wedding at the Yosemite Valley Chapel?", "The Yosemite Community Church secretary schedules every ceremony in the chapel, at 209-372-4831. An outside officiant is allowed. You still need the Park Service's special use permit."],
    ["Are there church services at Yosemite campgrounds?", "The chapel lists Sunday services at 9 am in summer at Lower Pines, Wawona, White Wolf and Tuolumne campgrounds. Confirm with the chapel before you go."],
  ];

  // ── The congregations, from "Other congregations" and the chapel section ──
  const CONGS = [
    { name: "Yosemite Community Church", where: "Yosemite Valley Chapel, Yosemite Valley", when: "Sunday 9:15 am all year; 11 am also in summer",
      who: "Nondenominational", status: "Listed by the church", cls: "is-verified" },
    { name: "Summer campground services", where: "Lower Pines, Wawona, White Wolf and Tuolumne campgrounds", when: "Sunday 9 am, summer",
      who: "Listed by the chapel", status: "Confirm with the chapel", cls: "is-confirm" },
    { name: "Our Lady of the Snows", where: "Yosemite Valley; listings disagree on the building", when: "Sunday Mass 10 am, per listings",
      who: "Catholic, a mission of Our Lady of the Sierra Parish, Oakhurst", status: "Confirm with the parish", cls: "is-confirm" },
    { name: "Yosemite Ward", where: "49967 Rd 427, Oakhurst, outside the park", when: "Sunday 10 am",
      who: "The Church of Jesus Christ of Latter-day Saints", status: "Listed by the church", cls: "is-verified" },
  ];

  // ── The chapel's calendar, from "Easter and the holidays" ─────────────────
  const EASTER = [
    { day: "Maundy Thursday", time: "7 pm", where: "The chapel" },
    { day: "Good Friday", time: "12:15 pm and 7 pm", where: "The chapel" },
    { day: "Easter sunrise", time: "7 am", where: "Lower Pines Campground, weather permitting", glow: true },
    { day: "Easter Day", time: "9:15 am and 11 am", where: "The chapel" },
  ];

  // ── The season, from "Seasons" ────────────────────────────────────────────
  const SEASONS = [
    { when: "Memorial Day to Labor Day", name: "Summer", cls: "is-peak",
      text: "Two Sunday services at the chapel, 9:15 and 11 am, and the summer campground services at 9 am." },
    { when: "Labor Day to Memorial Day", name: "The rest of the year", cls: "is-mid",
      text: "One Sunday service at the chapel, 9:15 am, with Children's Church and nursery." },
    { when: "Holidays", name: "Special services", cls: "is-late",
      text: "Easter week, Marriage Renewal Sunday in May, Thanksgiving, Christmas Eve and New Year's Watch Night." },
  ];

  // ── Where it happens, from every section above ────────────────────────────
  const PLACES = [
    ["Yosemite Valley Chapel", "Old Village, Yosemite Valley", "Sunday services, Bible study, holiday services, chapel weddings"],
    ["Lower Pines Campground", "Yosemite Valley", "Easter sunrise service; summer Sunday campground service"],
    ["Wawona, White Wolf and Tuolumne campgrounds", "Outside the Valley", "Summer Sunday campground services"],
    ["The Ahwahnee", "Yosemite Valley", "Weddings and receptions through Yosemite Hospitality"],
    ["Oakhurst", "Outside the park", "The Latter-day Saints ward; the Catholic parish that runs the Valley mission"],
  ];

  return (
    <div className="wy-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="calendar" /><dt>The chapel</dt><dd>Built 1879, the Valley's oldest structure</dd></div>
          <div><EventIcon name="clock" /><dt>Sunday</dt><dd>9:15 am all year, 11 am in summer</dd></div>
          <div><EventIcon name="sun" /><dt>Easter sunrise</dt><dd>7 am, Lower Pines Campground</dd></div>
          <div><EventIcon name="id" /><dt>Weddings</dt><dd>NPS permit, $150 application</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: what exists, and the whole page in four lines. */}
      <section className="hp-wrap hp-section wy-open">
        <div className="ff-split">
          <div className="wy-prose">
            <p className="dropcap">
              The Yosemite Valley Chapel, built in 1879, is the oldest structure in Yosemite Valley. It is home to Yosemite Community Church, a nondenominational congregation that holds a service every Sunday morning, all year. In summer the church also lists Sunday services at four campgrounds.
            </p>

            <p>
              Beyond the chapel, a Catholic mission in the Valley appears in directory listings, and the nearest Latter-day Saints ward meets outside the park in Oakhurst. We could not verify regularly scheduled services for any other faith inside the park.
            </p>

            <p>
              Times below come from each congregation's own page or, where marked, from secondary listings. They change. Confirm with the source before you plan a morning around one.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>Sunday at the chapel: 9:15 am all year, 11 am too from Memorial Day to Labor Day.</li>
              <li>Easter sunrise: 7 am at Lower Pines Campground, weather permitting.</li>
              <li>There is no Easter sunrise service at Glacier Point.</li>
              <li>Any wedding anywhere in the park needs an NPS permit.</li>
            </ul>
            <a className="wy-short__link" href="#wy-easter">Easter week, service by service ↓</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="wy-chapel" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">THE CHAPEL</p>
              <h2>Sunday at the Yosemite Valley Chapel</h2>
              <div className="wy-prose">
                <p>
                  Yosemite Community Church is nondenominational, and its website puts the policy in one line: "Everyone and all denominations are welcome." The pastor is Brent Moore. The church office is at 209-372-4831.
                </p>

                <p>
                  <strong>Sunday services.</strong> From Memorial Day to Labor Day there are two, at 9:15 and 11 am. The rest of the year there is one, at 9:15 am. The 9:15 service offers Children's Church and a nursery. Services are livestreamed on the chapel's Facebook page and on Zoom, for anyone who cannot get to the Valley.
                </p>

                <p>
                  <strong>During the week.</strong> A Bible study meets Thursdays at 7 pm; the church says to contact the chapel for the location. The Park Service notes that Alcoholics Anonymous meetings are held at the chapel regularly.
                </p>

                <p>
                  The Park Service says the chapel operates year-round, with services every Sunday morning and on some holidays, and points visitors to the chapel's website or the current Yosemite Guide for times. That is the right order of trust: the church's page first, the printed guide second, and this article third.
                </p>
              </div>
            </div>
            <div>
              <h3 className="wy-sched__head">The chapel's week</h3>
              <ol className="ff-hours wy-sched">
                <li className="is-glow"><span>Sunday, summer</span><p>9:15 am and 11 am. Memorial Day to Labor Day.</p></li>
                <li className="is-glow"><span>Sunday, the rest of the year</span><p>9:15 am.</p></li>
                <li><span>Sunday, 9:15 am</span><p>Children's Church and nursery.</p></li>
                <li><span>Thursday</span><p>Bible study, 7 pm. Ask the chapel where.</p></li>
                <li><span>Anywhere</span><p>Livestream on Facebook and Zoom.</p></li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="wy-history" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE BUILDING</p>
            <h2>The oldest structure in the Valley</h2>
            <div className="wy-prose">
              <p>
                The chapel went up in the summer of 1879, paid for by the California State Sunday School Association, which had applied in 1878 to build an "undenominational" chapel. San Francisco architect Charles Geddes designed it, and Samuel Thomson is believed to have been the contractor. It is New England in style and seats 250. Its first services were purportedly held on June 7, 1879.
              </p>

              <p>
                It did not start where it stands. The chapel was built near the present Four Mile Trailhead and moved in 1901 to its current site in the Old Village. The Park Service acquired it in 1927. In 1965 its foundation was raised three feet against flooding, and the 1997 flood damaged it anyway; it was restored. In 1973 it became the first structure in the park listed on the National Register of Historic Places.
              </p>

              <p>
                There were plans for something bigger. In 1926 a larger church was proposed near the Ahwahnee; it was downgraded to an outdoor "Church Bowl." During the Second World War, when the Navy ran a hospital in the Ahwahnee, the hotel had two improvised chapels, one of them in the bar.
              </p>
            </div>
          </div>
          <ol className="wy-timeline">
            <li><span>1878</span><p>Application for an "undenominational" chapel.</p></li>
            <li><span>1879</span><p>Built near today's Four Mile Trailhead. First services purportedly June 7.</p></li>
            <li><span>1901</span><p>Moved to its present site in the Old Village.</p></li>
            <li><span>1926</span><p>A larger church near the Ahwahnee becomes an outdoor "Church Bowl."</p></li>
            <li><span>1927</span><p>The Park Service acquires the chapel.</p></li>
            <li><span>1965</span><p>Foundation raised three feet against flooding.</p></li>
            <li><span>1973</span><p>The first structure in the park on the National Register.</p></li>
            <li><span>1997</span><p>Damaged in the flood, then restored.</p></li>
          </ol>
        </div>
      </section>

      <section className="ff-band" id="wy-campgrounds" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">CAMPGROUNDS AND OUTDOOR SERVICES</p>
            <h2>Sunday at 9, under the trees</h2>
            <div className="wy-prose">
              <p>
                In summer the chapel lists Sunday services at 9 am at four campgrounds: Lower Pines in the Valley, Wawona, White Wolf and Tuolumne. A separate directory listing labels these as services of A Christian Ministry in the National Parks, running Memorial Day to Labor Day. We could confirm the times only from the chapel's listing, so call the chapel before you count on one.
              </p>

              <p>
                Lower Pines is also where the chapel holds its Easter sunrise service. If you are camping, <a href="/articles/yosemite-camping-complete-guide">the camping guide</a> covers how the Valley campgrounds book, and the <a href="/articles/wawona-yosemite-guide">Wawona guide</a> covers what else is at the park's south end.
              </p>
            </div>
          </div>
          <figure className="wy-photo">
            <ResponsiveImage image="img/upper-pines-campground.jpg" style={{ aspectRatio: "1600 / 900" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="The forest at Upper Pines Campground on the Yosemite Valley floor, tall trees over open ground" />
            <figcaption>Upper Pines Campground on the Valley floor. The services the chapel lists meet at Lower Pines, Wawona, White Wolf and Tuolumne. Photo: Andrew Burnham / Wikimedia Commons (CC BY-SA 3.0)</figcaption>
          </figure>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="wy-congregations" tabIndex={-1}>
        <p className="hp-eyebrow">OTHER CONGREGATIONS</p>
        <h2>Who else meets, and how sure we are</h2>
        <div className="wy-congs">
          {CONGS.map((c) => (
            <article key={c.name} className={"wy-cong " + c.cls}>
              <p className="wy-cong__status">{c.status}</p>
              <h3>{c.name}</h3>
              <dl>
                <div><dt>Who</dt><dd>{c.who}</dd></div>
                <div><dt>Where</dt><dd>{c.where}</dd></div>
                <div><dt>When</dt><dd>{c.when}</dd></div>
              </dl>
            </article>
          ))}
        </div>

        <div className="ff-split wy-congs__prose">
          <div className="wy-prose">
            <p>
              <strong>Catholic.</strong> Directory listings show Our Lady of the Snows, a Catholic mission in Yosemite Valley, as a mission of Our Lady of the Sierra Parish in Oakhurst, in the Diocese of Fresno. They show Sunday Mass at 10 am year-round, said by visiting priests, and one secondary listing shows a summer Saturday Mass at 6 pm at Lower Pines. The listings disagree about where in the Valley the Sunday Mass meets. Confirm the time and the place with Our Lady of the Sierra Parish in Oakhurst before you go.
            </p>

            <p>
              <strong>Latter-day Saints.</strong> The Yosemite Ward meets in Oakhurst, at 49967 Rd 427, on Sundays at 10 am. That is outside the park. The church's page lists an hour of sacrament meeting and an hour of gospel study, says no RSVP is required, and describes the dress as "Sunday best, but you can also come as you are." We found no Latter-day Saints unit inside the park.
            </p>

            <p>
              <strong>Everyone else.</strong> We could not verify regularly scheduled services for any other faith inside the park. If your tradition is not listed here, ask your own congregation about communities outside the park before you go; <a href="/articles/yosemite-gateway-towns-compared">the gateway towns compared</a> lays out where each town sits.
            </p>
          </div>
          <p className="ff-alert wy-alert">
            <EventIcon name="alert" />
            <span>
              <strong>The Catholic schedule is the least certain thing on this page.</strong> It rests on directory listings, not the parish's own page, and those listings conflict on the location. Call Our Lady of the Sierra Parish in Oakhurst first.
            </span>
          </p>
        </div>
      </section>

      <section className="ff-band" id="wy-easter" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">EASTER AND THE HOLIDAYS</p>
              <h2>Easter sunrise is at Lower Pines, not Glacier Point</h2>
              <div className="wy-prose">
                <p>
                  The Easter sunrise service in Yosemite that we could verify is the chapel's: 7 am at Lower Pines Campground in Yosemite Valley, weather permitting. The chapel's Easter Day services follow at 9:15 and 11 am.
                </p>

                <p>
                  There is no Easter sunrise service at Glacier Point. The Park Service says Glacier Point Road is normally closed by snow from sometime in November through late May or June, so in a normal year the road is shut at Easter, and no source we checked lists a service there. <a href="/articles/glacier-point-how-to-visit">The Glacier Point guide</a> covers when and how you can get up there.
                </p>

                <p>
                  The rest of Holy Week at the chapel: Maundy Thursday at 7 pm, and Good Friday at 12:15 pm and 7 pm.
                </p>

                <p>
                  <strong>The rest of the year's special services.</strong> Marriage Renewal Sunday falls on the first Sunday in May, at 9:15 and 11 am. Thanksgiving Day has a 10 am service, which pairs with <a href="/articles/thanksgiving-in-yosemite">a Thanksgiving trip</a>. Christmas Eve runs 4 to 5 pm, and the New Year's Watch Night service, with communion, starts at 10 pm.
                </p>
              </div>
            </div>
            <div>
              <h3 className="wy-sched__head">Holy Week, by the chapel's calendar</h3>
              <ol className="ff-hours wy-sched">
                {EASTER.map((e) => (
                  <li key={e.day} className={e.glow ? "is-glow" : undefined}>
                    <span>{e.day}</span>
                    <p>{e.time}. {e.where}.</p>
                  </li>
                ))}
              </ol>
              <p className="ff-alert wy-alert">
                <EventIcon name="no" />
                <span>
                  <strong>No Glacier Point sunrise service.</strong> Glacier Point Road is normally closed by snow from sometime in November through late May or June. The Easter sunrise service is in the Valley, at Lower Pines.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="wy-seasons" tabIndex={-1}>
        <p className="hp-eyebrow">SEASONS</p>
        <h2>What changes with the calendar</h2>
        <ol className="wy-seasons">
          {SEASONS.map((s) => (
            <li key={s.name} className={s.cls}>
              <span>{s.when}</span>
              <strong>{s.name}</strong>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="ff-split wy-when">
          <div className="wy-prose">
            <p>
              <strong>Summer (Memorial Day to Labor Day).</strong> The chapel holds two Sunday services, at 9:15 and 11 am, and lists its campground services at 9 am. This is the fullest schedule of the year.
            </p>

            <p>
              <strong>The rest of the year.</strong> One Sunday service at the chapel, at 9:15 am, with Children's Church and nursery. The campground services are a summer listing.
            </p>

            <p>
              <strong>Holidays.</strong> Easter week, Marriage Renewal Sunday on the first Sunday in May, Thanksgiving Day, Christmas Eve and New Year's Watch Night each have their own service times, listed in the section above.
            </p>
          </div>
          <div>
            <h3 className="wy-sched__head">Where services happen</h3>
            <table className="wy-places">
              <thead>
                <tr><th scope="col">Place</th><th scope="col">Where</th><th scope="col">What</th></tr>
              </thead>
              <tbody>
                {PLACES.map(([place, where, what]) => (
                  <tr key={place}><th scope="row">{place}</th><td>{where}</td><td>{what}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="ff-band" id="wy-weddings" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">WEDDINGS AND CEREMONIES</p>
              <h2>Every ceremony needs a permit</h2>
              <div className="wy-prose">
                <p>
                  Any wedding or commitment ceremony anywhere in Yosemite needs a special use permit from the Park Service. The application fee is $150 and nonrefundable. Outdoor events of 30 to 50 or more people also pay $50 an hour for an event monitor; that charge does not apply inside Yosemite Hospitality's facilities. Apply up to a year ahead and more than 21 days before the date, by mailing the original application with a check or money order, not cash, to Special Park Uses, PO Box 700, El Portal, CA 95318. The Special Park Uses office is at 209-379-1434.
                </p>

                <p>
                  The permit does not reserve a site or keep other visitors away, and it covers up to two hours. No permits are issued for holidays or holiday weekends. The Park Service advises avoiding busy sites and going early, late or on a weekday. Entrance fees are not waived for guests.
                </p>

                <p>
                  <strong>At the chapel.</strong> The Yosemite Community Church secretary schedules every ceremony in the chapel, at 209-372-4831. An outside officiant is allowed.
                </p>

                <p>
                  <strong>At the Ahwahnee.</strong> Yosemite Hospitality runs weddings at its venues; the Ahwahnee takes up to 120 guests across several room and patio arrangements. It books 14 months ahead. Food and drink must be bought on site, minimums apply, and there is a customary 20 percent service charge. Quiet hours are 9 pm throughout Yosemite Valley; at the Ahwahnee, dancing is allowed only in the Winter Club Room, and there is no amplified music outdoors. Its own FAQ says you will still need the Park Service's ceremony permit.
                </p>

                <p>
                  <strong>What can go wrong.</strong> The Park Service lists smoke, most common in August and September, road closures, and spring floods, often in May. Engaged first? <a href="/articles/where-to-propose-in-yosemite">The proposal guide</a> covers the question before this one.
                </p>
              </div>
            </div>
            <div>
              <figure className="wy-photo">
                <ResponsiveImage image="img/ahwahnee-hotel.jpg" style={{ aspectRatio: "1600 / 1200" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
                  alt="The Ahwahnee in winter, its stone and timber front below the Valley's north wall" />
                <figcaption>The Ahwahnee, which takes weddings of up to 120 guests. Photo: Chris Dunstan / Wikimedia Commons (public domain)</figcaption>
              </figure>
              <article className="ff-inpark wy-permit">
                <p className="hp-eyebrow">THE PERMIT</p>
                <h3>Special Park Uses</h3>
                <dl>
                  <div><dt>Application fee</dt><dd>$150, nonrefundable</dd></div>
                  <div><dt>Event monitor</dt><dd>$50 an hour, larger outdoor events</dd></div>
                  <div><dt>When to apply</dt><dd>Up to a year ahead, more than 21 days before</dd></div>
                  <div><dt>Length</dt><dd>Up to two hours</dd></div>
                  <div><dt>Phone</dt><dd>209-379-1434</dd></div>
                </dl>
                <p className="ff-note">Check or money order with the original application, mailed to Special Park Uses, PO Box 700, El Portal, CA 95318.</p>
              </article>
            </div>
          </div>

          <ul className="ff-rules wy-rules">
            <li>
              <EventIcon name="no" size={26} />
              <strong>No releases, no decorations.</strong>
              <p>No rice, birdseed, butterflies or balloons; no arches, signs, chairs or tables. Handheld bouquets are fine, and picnic table decorations in picnic areas.</p>
            </li>
            <li>
              <EventIcon name="no" size={26} />
              <strong>No amplified sound.</strong>
              <p>No amplified music or PA. The noise limit is 60 decibels at 50 feet. No drones.</p>
            </li>
            <li>
              <EventIcon name="tree" size={26} />
              <strong>Not at the sequoias.</strong>
              <p>No ceremonies around the bases of sequoias. Meadows and riparian areas are restricted.</p>
            </li>
            <li>
              <EventIcon name="no" size={26} />
              <strong>No receptions in picnic areas.</strong>
              <p>No formal receptions in picnic or day-use areas. No horse carriages or hot air balloons.</p>
            </li>
          </ul>

          <div className="wy-stay">
            {/* The Ahwahnee and the in-park lodges are the recommendation and
                book through Yosemite Hospitality, so they are named without a
                link; the availability search is for guests when they are
                full. */}
            <LodgingCta
              destination="Yosemite National Park"
              heading="Rooms for the guests"
              note="Book in-park rooms through Yosemite Hospitality, which says its lodging opens a year and a day ahead. For a wedding or a holiday weekend that is the first place to look. When the park is full, a search shows what is left within driving distance."
              list="article_cta"
              slug="worship-in-yosemite"
              cta="Search lodging around Yosemite →"
            />
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="wy-etiquette" tabIndex={-1}>
        <p className="hp-eyebrow">ETIQUETTE</p>
        <h2>Visiting a service, or passing a ceremony</h2>
        <div className="ff-split">
          <div className="wy-prose">
            <p>
              <strong>Confirm before you go.</strong> Every schedule here can change, the Easter sunrise service is weather permitting, and the campground and Catholic times rest on listings. Call the congregation, or check the current Yosemite Guide.
            </p>

            <p>
              <strong>Come as a guest.</strong> The chapel welcomes everyone and all denominations, and the Oakhurst ward asks no RSVP. If you bring children to the chapel, the 9:15 service has Children's Church and a nursery.
            </p>

            <p>
              <strong>Keep a backup.</strong> If weather cancels the sunrise service at Lower Pines, the chapel's 9:15 and 11 am Easter services still stand. If you cannot get to the Valley at all, the chapel livestreams on Facebook and Zoom.
            </p>

            <p>
              <strong>Mind the hour.</strong> Yosemite Hospitality lists quiet hours of 9 pm throughout Yosemite Valley.
            </p>

            <p>
              <strong>At someone else's wedding.</strong> A ceremony permit does not reserve a viewpoint or exclude other visitors, so you are not obliged to leave. Giving a couple room for a few minutes costs nothing. If you are a guest, leave the rice, birdseed and balloons at home; the park bans them.
            </p>
          </div>
          <ul className="ff-rules wy-manners">
            <li className="is-exception">
              <EventIcon name="clock" size={26} />
              <strong>Call ahead.</strong>
              <p>The chapel is at 209-372-4831.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="users" size={26} />
              <strong>All are welcome.</strong>
              <p>The chapel is nondenominational and says so.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="cloud" size={26} />
              <strong>Weather permitting.</strong>
              <p>The sunrise service can be called off. The chapel services stand.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="eye" size={26} />
              <strong>Give a couple room.</strong>
              <p>Their permit does not close the spot. Courtesy does the rest.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="ff-band" id="wy-questions" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Worship in Yosemite, answered</h2>
            <div className="wy-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="http://www.yosemitevalleychapel.org/services.htm" target="_blank" rel="noopener noreferrer">Services, Yosemite Valley Chapel</a></li>
                <li><a href="https://www.nps.gov/yose/learn/historyculture/chapel.htm" target="_blank" rel="noopener noreferrer">Yosemite Valley Chapel history, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/places/000/yosemite-chapel.htm" target="_blank" rel="noopener noreferrer">Yosemite Chapel, NPS</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/weddings.htm" target="_blank" rel="noopener noreferrer">Weddings, NPS Yosemite</a></li>
                <li><a href="https://www.travelyosemite.com/group-travel/weddings" target="_blank" rel="noopener noreferrer">Weddings, Yosemite Hospitality</a></li>
                <li><a href="https://local.churchofjesuschrist.org/en/units/us/ca/yosemite-ward" target="_blank" rel="noopener noreferrer">Yosemite Ward, The Church of Jesus Christ of Latter-day Saints</a></li>
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

      <div className="hp-wrap wy-end">
        <AffiliateNote />
      </div>
    </div>
  );
};
