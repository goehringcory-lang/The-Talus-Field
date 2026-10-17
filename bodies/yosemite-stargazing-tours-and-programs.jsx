/* global React, EventIcon, ResponsiveImage */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// A feature article on the /firefall system, built like the Mist Trail and El
// Capitan pieces: the catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's full width, and every section below sits on the design's container
// (`hp-wrap`), alternating paper and the `ff-band` tint. The page-level `sg-*`
// rules are the `.sg-feature` layer in styles.css.
//
// Two rules hold it up.
//   1. Every price, date, time and policy is the operator's own, read on its
//      public page on October 17, 2026 (the sources list at the end): the
//      Conservancy's stargazing, naturalist-walk, FAQ, custom-adventure and
//      event pages; the Park Service's programs and stargazing pages and the
//      Yosemite Guide (Vol 51 Issue 8, September 23 to November 24, 2026); and
//      Yosemite Hospitality's naturalist-program and bus-tour pages. Where a
//      schedule is not posted, the page says so instead of guessing. Every
//      card, row and caption restates a sentence in this body.
//   2. These are seasonal schedules. When an operator posts the next season,
//      the program table, the facts row, the FAQ below and its mirror in
//      seo-data.json change together.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["yosemite-stargazing-tours-and-programs"] = function YosemiteStargazingToursBody() {
  const TOC = [
    ["#sec-0-the-conservancys-night-sky-program", "The Conservancy program"],
    ["#sec-1-under-the-milky-way-overnight", "Overnights and custom trips"],
    ["#sec-2-glacier-point-star-parties", "Glacier Point"],
    ["#sec-3-yosemite-hospitality-after-dark", "Yosemite Hospitality"],
    ["#sec-4-the-ranger-programs", "Ranger programs"],
    ["#sec-5-which-one-to-book", "Which one to book"],
    ["#stargazing-tours-questions", "Questions"],
  ];

  // seo-data.json `faq`, word for word.
  const FAQ = [
    ["Is there a stargazing tour in Yosemite?", "Yes. Yosemite Conservancy's Explore Yosemite's Night Sky is a guided stargazing program in Yosemite Valley, $25 a person, on Friday and Saturday nights through November 21, 2026. Yosemite Hospitality runs Walking Starry Skies and Yosemite After Dark in the Valley, $25 each, and in summer a seated night-sky program at Glacier Point."],
    ["Is there a Glacier Point stargazing tour?", "Not one with transportation. In summer, amateur astronomy clubs host star parties with telescopes at the Glacier Point Amphitheater on set weekends, and Yosemite Hospitality runs Glacier Point Starry Night Skies, a one-hour seated program for $25 on select weeknights. You drive yourself to both. The park lists Glacier Point as open roughly late May to November."],
    ["When are the Glacier Point star parties?", "In 2026 the park's Stars Over Yosemite series ran on Friday and Saturday nights from 8:30 p.m. on six weekends between July 3 and August 15, each hosted by a different astronomy club. Programs are canceled if the sky is overcast. The 2027 schedule is not posted yet."],
    ["How much does the Yosemite Conservancy night sky program cost?", "$25 a person. Children five and under attend free but need a waiver. Registration does not include the park's $35 vehicle entrance fee. A refund for a canceled booking comes as a Conservancy gift card, not cash."],
    ["Do Yosemite stargazing programs use telescopes?", "The Conservancy's Explore Yosemite's Night Sky does not: the naturalist points out stars and constellations with a laser. The Glacier Point star parties are the programs with telescopes, set up by the visiting astronomy clubs."],
    ["What is the best place to stargaze in Yosemite?", "The park lists Glacier Point and Washburn Point, Tenaya Lake and Olmsted Point on Tioga Road, Wawona Meadow, and in the Valley El Capitan Meadow, Cook's Meadow, Swinging Bridge and Tunnel View, where car lights and campfire haze can interfere. The darkest skies run from about an hour and a half after sunset to an hour and a half before sunrise, on nights without the moon."],
  ];

  // ── Every program on one table, from the sections below ───────────────────
  const PROGRAMS = [
    { name: "Explore Yosemite's Night Sky", who: "Yosemite Conservancy", where: "Yosemite Valley", when: "Fri and Sat through Nov 21, 2026", cost: "$25", scope: "No, a laser pointer" },
    { name: "Glacier Point star parties", who: "Astronomy clubs with the NPS", where: "Glacier Point Amphitheater", when: "Six summer weekends; 2027 not posted", cost: "No fee listed", scope: "Yes" },
    { name: "Glacier Point Starry Night Skies", who: "Yosemite Hospitality", where: "Glacier Point Amphitheater", when: "Summer, select weeknights", cost: "$25", scope: "Not stated" },
    { name: "Walking Starry Skies", who: "Yosemite Hospitality", where: "Cook's Meadow, from shuttle stop 6", when: "Su to Th this fall, 8 p.m.", cost: "$25", scope: "Not stated" },
    { name: "Yosemite After Dark", who: "Yosemite Hospitality", where: "Yosemite Valley Lodge Amphitheater", when: "Nightly, 7:30 p.m. this fall", cost: "$25", scope: "Not stated" },
    { name: "Moonlight Tram Tour", who: "Yosemite Hospitality", where: "Yosemite Valley Lodge", when: "Typically June to September, around the full moon", cost: "$41.25 adult, $28.25 child", scope: "No, a tram" },
  ];

  // ── The Conservancy's fall 2026 sessions, from its stargazing page ────────
  const SESSIONS = [
    { dates: "September 25 to October 10", time: "8 to 10 p.m.", glow: false },
    { dates: "October 16 to October 31", time: "7:30 to 9 p.m.", glow: true },
    { dates: "November 6 to November 21", time: "7 to 8:30 p.m.", glow: false },
  ];

  // ── Stars Over Yosemite 2026, from the park's programs page ───────────────
  const STAR_PARTIES = [
    ["July 3 and 4", "Santa Cruz Astronomy Club"],
    ["July 10 and 11", "San Jose Astronomical Association"],
    ["July 17 and 18", "MIRA"],
    ["July 31 and August 1", "Peninsula Astronomical Society"],
    ["August 7 and 8", "Mount Diablo Astronomical Society"],
    ["August 14 and 15", "Tri-Valley Stargazers"],
  ];

  return (
    <div className="sg-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="ticket" /><dt>The Conservancy program</dt><dd>$25 a person</dd></div>
          <div><EventIcon name="calendar" /><dt>This fall</dt><dd>Fridays and Saturdays through November 21</dd></div>
          <div><EventIcon name="eye" /><dt>Telescopes</dt><dd>Glacier Point star parties, summer</dd></div>
          <div><EventIcon name="car" /><dt>Park entry</dt><dd>Not included with the evening programs</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: who runs what, and the whole page in four lines. */}
      <section className="hp-wrap hp-section sg-open">
        <div className="ff-split">
          <div className="sg-prose">
            <p className="dropcap">
              Three organizations take people out under Yosemite's night sky, and they do it differently. Yosemite Conservancy, the park's nonprofit partner, runs a guided naturalist program in Yosemite Valley with no telescopes. The National Park Service hosts summer star parties at Glacier Point, where amateur astronomy clubs set up telescopes on the rim. Yosemite Hospitality, the park's lodging and tour concessioner, runs night walks in the Valley, a seated program at Glacier Point in summer, and a tram tour by moonlight.
            </p>

            <p>
              None of them is a bus ride to Glacier Point after dark. If you searched for a Glacier Point stargazing tour, that is the first thing to know: the Glacier Point programs are ones you drive to yourself, and the scheduled Glacier Point Tour bus is a daytime trip.
            </p>

            <p>
              This page is about the programs. For where to go on your own, which nights to pick and how to read the sky once you are there, read <a href="/articles/yosemite-stargazing-where-to-look-up">the stargazing guide</a>. Every price and date below is the operator's own, as posted on October 17, 2026; where a schedule is not posted yet, the page says so.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>In the Valley this fall: the Conservancy's Night Sky program, $25, Fridays and Saturdays.</li>
              <li>Telescopes: the Glacier Point star parties, on summer weekends only.</li>
              <li>Weeknights: Yosemite Hospitality's walks, $25.</li>
              <li>Book ahead, and pay park entry separately.</li>
            </ul>
            <a className="sg-short__link" href="#sec-5-which-one-to-book">Which one to book ↓</a>
          </aside>
        </div>

        <div className="sg-table-wrap">
          <table className="sg-compare">
            <caption>Every night-sky program in this piece, side by side</caption>
            <thead>
              <tr><th scope="col">Program</th><th scope="col">Run by</th><th scope="col">Where</th><th scope="col">When</th><th scope="col">Cost</th><th scope="col">Telescopes</th></tr>
            </thead>
            <tbody>
              {PROGRAMS.map((p) => (
                <tr key={p.name}>
                  <th scope="row">{p.name}</th><td>{p.who}</td><td>{p.where}</td><td>{p.when}</td><td>{p.cost}</td><td>{p.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ff-note">Prices are per person and do not include the park entrance fee. "Not stated" means the operator's page does not say. Schedules are the operators' current ones; the sections below have the detail and the sources.</p>
      </section>

      <section className="ff-band" id="sec-0-the-conservancys-night-sky-program" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">YOSEMITE CONSERVANCY</p>
              <h2>Explore Yosemite's Night Sky</h2>
              <div className="sg-prose">
                <p>
                  The Conservancy's stargazing program is the one most people mean when they ask about a stargazing tour in Yosemite. A Conservancy naturalist leads a group in Yosemite Valley, points out stars, planets and constellations with a laser, and talks through star science, meteors and meteorites, and the stories that cultures near and far have told about the sky. Registration is <strong>$25 a person</strong>.
                </p>

                <p>
                  There are no telescopes. The Conservancy's FAQ says so plainly, and describes the setting: you sit on tarps in a grassy field for an hour or more. That makes it a naked-eye program, closer to a guided tour of the sky than an observing session, and for most first-time stargazers it is the better introduction. You leave knowing how to find things on your own.
                </p>

                <p>
                  This fall it runs on <strong>Friday and Saturday nights</strong>, starting earlier as the nights lengthen. The posted dates end November 21, 2026. The Conservancy posts the schedule a season at a time, and as of October 17, 2026 no winter or 2027 dates are up. The page names Yosemite Valley as the location; the meeting details and what to bring come in the confirmation.
                </p>
              </div>
            </div>
            <div className="sg-sessions">
              <p className="hp-eyebrow">FALL 2026 SESSIONS</p>
              <ol className="ff-hours">
                {SESSIONS.map((s) => (
                  <li key={s.dates} className={s.glow ? "is-glow" : undefined}><span>{s.dates}</span><p>Fridays and Saturdays, {s.time}</p></li>
                ))}
              </ol>
              <p className="ff-note">From the Conservancy's stargazing page. The program page calls it a casual two-hour program; the later sessions are listed at an hour and a half.</p>
            </div>
          </div>

          <ul className="ff-rules sg-rules">
            <li>
              <EventIcon name="users" size={26} />
              <strong>Children</strong>
              <p>Five and under attend free and are not counted, but need a waiver under "minors". Whether a child will enjoy it "depends on the child", the FAQ says, and you may leave early.</p>
            </li>
            <li>
              <EventIcon name="cloud" size={26} />
              <strong>Weather and the moon</strong>
              <p>Light cloud or light rain may mean a modified program. Heavier weather cancels it by text or email. Near a full moon the naturalist works with the brighter constellations and the moon itself.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="ticket" size={26} />
              <strong>Refunds</strong>
              <p>No cash refunds for the Night Sky program. A refund comes as a Conservancy Outdoor Adventure gift card, good for a year after the program date.</p>
            </li>
            <li className="is-exception">
              <EventIcon name="check" size={26} />
              <strong>Access</strong>
              <p>Wheelchair access takes arrangement in advance: call 209-379-2647. No dogs on any program. Phones stay on silent.</p>
            </li>
          </ul>

          <p className="ff-alert">
            <EventIcon name="alert" />
            <span>
              <strong>Park entry is separate.</strong> The Conservancy's Outdoor and Custom Adventures include a gate pass for the program dates. The naturalist walks and Explore Yosemite's Night Sky do not, so you still pay the park's $35 vehicle fee or carry a pass, and the program page notes that any entrance reservation in force is not included either. <a href="/articles/yosemite-without-reservations-2026">The entry guide</a> has the current rules.
            </span>
          </p>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-1-under-the-milky-way-overnight" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">OVERNIGHTS AND CUSTOM TRIPS</p>
            <h2>Under the Milky Way, overnight</h2>
            <div className="sg-prose">
              <p>
                The Conservancy's longer night-sky trips are one-night backpacks in the high country. In 2026 the catalog carried <strong>Overnight Under the Milky Way: May Lake</strong> (July 14 and 15) and <strong>Overnight Under the Perseids Meteor Shower</strong> (August 14 and 15), each $199. The hike is about a mile from the May Lake Trailhead to camp, rated easy to intermediate, and after dark the naturalist uses a laser to pick out stars and constellations and tells the astronomy and the stories behind them.
              </p>

              <p>
                The fee covers the naturalist guide, a wilderness permit, park entry where needed and shared front-country tent camping after the trek. It does not cover gear or food: you bring your own tent, sleeping gear and simple meals. Both 2026 trips are past, and the 2027 dates are not posted.
              </p>

              <p>
                <strong>Custom Adventures</strong> are the Conservancy's private, naturalist-led outings built around your schedule. The posted prices are $500 for a half day and $850 for a full day, each a base price for up to four people, and a four-hour pre-packaged private tour of Yosemite Valley is $500 with $50 for each additional person. Meals, transportation and gratuities are not included; a gate pass for the program dates is. The Custom Adventures page does not list a night-sky option, so a private evening under the stars is something to ask about on the request form, not something the page promises. The Conservancy takes requests by form, at 415-434-1782, or at info@yosemite.org.
              </p>
            </div>
          </div>
          <div className="sg-cards">
            <article className="sg-card">
              <p className="hp-eyebrow">ONE-NIGHT BACKPACK</p>
              <h3>Overnight Under the Milky Way</h3>
              <dl>
                <div><dt>Trailhead</dt><dd>May Lake</dd></div>
                <div><dt>Hike to camp</dt><dd>About a mile</dd></div>
                <div><dt>2026 fee</dt><dd>$199</dd></div>
                <div><dt>Includes</dt><dd>Guide, wilderness permit, park entry</dd></div>
                <div><dt>2027 dates</dt><dd>Not posted</dd></div>
              </dl>
            </article>
            <article className="sg-card">
              <p className="hp-eyebrow">PRIVATE, UP TO FOUR PEOPLE</p>
              <h3>Custom Adventures</h3>
              <dl>
                <div><dt>Half day</dt><dd>$500</dd></div>
                <div><dt>Full day</dt><dd>$850</dd></div>
                <div><dt>Includes</dt><dd>Naturalist guide, gate pass</dd></div>
                <div><dt>Night sky</dt><dd>Not listed; ask</dd></div>
              </dl>
            </article>
          </div>
        </div>
      </section>

      <section className="ff-band" id="sec-2-glacier-point-star-parties" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">GLACIER POINT</p>
              <h2>The star parties, and the seated program</h2>
              <div className="sg-prose">
                <p>
                  The only programs in the park with telescopes are the summer star parties at <a href="/articles/glacier-point-how-to-visit">Glacier Point</a>. The Park Service calls the series Stars Over Yosemite. Amateur astronomy clubs host them in cooperation with the park at the Glacier Point Amphitheater, each club taking one Friday-and-Saturday weekend. You drop in any time after 8:30 p.m.; a night runs two to four hours depending on the host and the sky, and it is canceled if the sky is overcast. The park's page names no fee or reservation for them.
                </p>

                <p>
                  The 2026 series ran six weekends between July 3 and August 15. The 2027 schedule is not posted yet; when it is, it goes on the park's programs page, and the park's general line is 209-372-0200.
                </p>

                <p>
                  Yosemite Hospitality adds a smaller program on the same rim in summer: <strong>Glacier Point Starry Night Skies</strong>, a one-hour seated program with a naturalist at the Glacier Point Amphitheater, 9 to 10 p.m. on Sunday through Thursday nights in select weeks, $25. Transportation is not provided. Bring a flashlight, warm layers or a blanket; the concessioner warns that temperatures can approach freezing.
                </p>

                <p>
                  Both depend on the road. The park lists Glacier Point as open roughly late May to November, and the drive back down to the Valley is made in the dark. If you are planning a summer evening around one, <a href="/articles/glacier-point-road-open-2026">the Glacier Point Road guide</a> has the road's season and the drive.
                </p>
              </div>
            </div>
            <div>
              <figure className="sg-parties">
                <figcaption>Stars Over Yosemite, 2026</figcaption>
                <ol>
                  {STAR_PARTIES.map(([when, club]) => (
                    <li key={when}><span>{when}</span><strong>{club}</strong></li>
                  ))}
                </ol>
                <p className="ff-note">Friday and Saturday nights from 8:30 p.m., Glacier Point Amphitheater, from the park's programs page. Canceled if overcast. The 2027 schedule is not posted.</p>
              </figure>
              <p className="ff-alert sg-funding">
                <EventIcon name="eye" />
                <span>
                  The Conservancy also backs the park's own astronomy programs. Its 2025 night-sky project set out to expand ranger-led astronomy at Glacier Point, Tuolumne Meadows and Crane Flat, after the Park Service brought back its Glacier Point astronomy programming in 2024 and piloted similar programs in Tuolumne Meadows.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-3-yosemite-hospitality-after-dark" tabIndex={-1}>
        <p className="hp-eyebrow">YOSEMITE HOSPITALITY</p>
        <h2>Walks after dark, and a tram by moonlight</h2>
        <div className="ff-split">
          <div className="sg-prose">
            <p>
              The concessioner's night programs run from the Valley's lodges, and they cover the weeknights the Conservancy does not. All are booked through travelyosemite.com or at 888-413-8869, and its page says a cancellation 24 hours ahead gets a full refund; inside 24 hours the booking is forfeit. Wheelchair accommodations need advance notice by email to yh-interp@aramark.com.
            </p>

            <p>
              <strong>Walking Starry Skies</strong> is an hour of stargazing in Cook's Meadow with a Yosemite Hospitality guide, $25, meeting at shuttle stop 6. The concessioner lists it as a winter program and says it may not suit young children. This fall's Yosemite Guide prints it Sunday through Thursday at 8 p.m. through November 24, with no program November 9 or 10. In the week before a full moon, the moonlight cuts what you can see.
            </p>

            <p>
              <strong>Yosemite After Dark</strong> is a 90-minute night walk through the Valley's natural areas, more about the park at night than the sky, $25, from the Yosemite Valley Lodge Amphitheater. It runs daily, 8:30 p.m. in the warmer months and 7:30 p.m. in the colder ones, and is recommended for ages 11 and up. Flashlights are not provided for either walk, traction devices are recommended, and the concessioner says guests who arrive unprepared for the conditions may be asked to leave.
            </p>

            <p>
              The <strong>Moonlight Tram Tour</strong> is the opposite of stargazing: a two-hour open-air tram loop of the Valley under the full moon with a naturalist. It typically runs June to September, on the four nights before the full moon and the night of it, from Yosemite Valley Lodge, at $41.25 for adults and $28.25 for children 2 to 12. Tickets are picked up at the Lodge front desk at least 15 minutes before departure. The 2026 tours are done. If a full-moon night in spring is what you are after, <a href="/moonbow">the moonbow at Yosemite Falls</a> is the stranger sight.
            </p>
          </div>
          <div className="sg-cards">
            <article className="sg-card">
              <p className="hp-eyebrow">ONE HOUR, $25</p>
              <h3>Walking Starry Skies</h3>
              <dl>
                <div><dt>Where</dt><dd>Cook's Meadow, from shuttle stop 6</dd></div>
                <div><dt>This fall</dt><dd>Su to Th, 8 p.m., to Nov 24</dd></div>
                <div><dt>Ages</dt><dd>May not suit young children</dd></div>
              </dl>
            </article>
            <article className="sg-card">
              <p className="hp-eyebrow">90 MINUTES, $25</p>
              <h3>Yosemite After Dark</h3>
              <dl>
                <div><dt>Where</dt><dd>Yosemite Valley Lodge Amphitheater</dd></div>
                <div><dt>When</dt><dd>Daily, 7:30 p.m. in colder months</dd></div>
                <div><dt>Ages</dt><dd>11 and up recommended</dd></div>
              </dl>
            </article>
            <article className="sg-card">
              <p className="hp-eyebrow">TWO HOURS, BY TRAM</p>
              <h3>Moonlight Tram Tour</h3>
              <dl>
                <div><dt>Season</dt><dd>Typically June to September</dd></div>
                <div><dt>Nights</dt><dd>The four before the full moon, and the full moon</dd></div>
                <div><dt>Fare</dt><dd>$41.25 adult, $28.25 child</dd></div>
              </dl>
            </article>
          </div>
        </div>
      </section>

      <section className="ff-band" id="sec-4-the-ranger-programs" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">THE PARK SERVICE</p>
            <h2>The ranger programs</h2>
            <div className="sg-prose">
              <p>
                The Park Service's own night-sky programs are free and seasonal. Its stargazing page says summer night-sky programs run throughout the park, led by the Park Service, the Conservancy and Yosemite Hospitality, and that some need a reservation. The schedule lives in the park calendar and the current Yosemite Guide, not on the stargazing page.
              </p>

              <p>
                The edition in force now, September 23 to November 24, 2026, prints no ranger-led astronomy program; its night-sky programs are the Conservancy's and the concessioner's. For what is on this week, <a href="/now">the Park Bulletin</a> condenses the current Guide, and <a href="/articles/yosemite-ranger-programs">the ranger programs guide</a> covers the free schedule across the year.
              </p>
            </div>
          </div>
          <div className="sg-prose sg-ownway">
            <p className="hp-eyebrow">GOING ON YOUR OWN</p>
            <p>
              The park's stargazing page gives a short set of rules worth knowing whether or not you book anything. The darkest skies run from about an hour and a half after sunset to an hour and a half before sunrise. Plan around the moon: go before it rises or after it sets. Give your eyes 20 to 30 minutes to adjust, and use red light only, which means no white flashlights and no bright phone screens.
            </p>
            <p>
              Keep the noise down, keep food within arm's reach, and pack out your trash. Sleeping out is allowed only in a reserved campsite or on a wilderness permit. The park puts the Milky Way's core in easy view on moonless nights from July through October.
            </p>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="sec-5-which-one-to-book" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">WHICH ONE TO BOOK</p>
            <h2>Matching the program to the night</h2>
            <div className="sg-prose">
              <p>
                <strong>A first night under a dark sky, any season it runs:</strong> the Conservancy's Explore Yosemite's Night Sky. It is the one built around teaching you to read the sky, and the one that leaves you able to do it alone the next night.
              </p>

              <p>
                <strong>Planets and galaxies through a telescope:</strong> a Glacier Point star party, on a summer weekend, when the 2027 dates are posted. Dress for cold and bring a red light.
              </p>

              <p>
                <strong>A weeknight in the Valley:</strong> Walking Starry Skies or Yosemite After Dark. The first is the sky; the second is the park at night.
              </p>

              <p>
                <strong>The Milky Way from the high country, with someone else handling the permit:</strong> a Conservancy overnight, when the 2027 trips are posted.
              </p>

              <p>
                And if no program fits the dates, the sky is still there. The park's own list of stargazing spots runs from Glacier Point and Washburn Point to Tenaya Lake, Olmsted Point and Wawona Meadow, with El Capitan Meadow, Cook's Meadow, Swinging Bridge and Tunnel View in the Valley. <a href="/articles/yosemite-stargazing-where-to-look-up">The stargazing guide</a> covers which of those is darkest, when the Milky Way's core is up, and how not to ruin anyone else's night. Fall visitors should read <a href="/articles/yosemite-in-fall">the fall guide</a> for what else changes when the evenings get long.
              </p>
            </div>
          </div>
          <figure className="sg-photo">
            <ResponsiveImage image="img/campfire-half-dome-night.jpg" style={{ aspectRatio: "4 / 5" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="Half Dome lit by the moon at night, a few bright stars above it and firelight in the foreground" />
            <figcaption>Half Dome under a bright moon, when only the brightest stars show. Plan around the moon. Photo: alohaphotostudio / Pexels</figcaption>
          </figure>
        </div>
      </section>

      <section className="ff-band" id="stargazing-tours-questions" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">QUESTIONS</p>
              <h2>Stargazing tours, answered</h2>
              <div className="sg-sources">
                <h3>Sources</h3>
                <ul>
                  <li><a href="https://yosemite.org/experience/stargazing/" target="_blank" rel="noopener noreferrer">Stargazing Programs, Yosemite Conservancy</a></li>
                  <li><a href="https://yosemite.org/experience/naturalist-walks/" target="_blank" rel="noopener noreferrer">Naturalist Walks, Yosemite Conservancy</a></li>
                  <li><a href="https://yosemite.org/adventure-program-faqs/" target="_blank" rel="noopener noreferrer">Adventure program FAQs, Yosemite Conservancy</a></li>
                  <li><a href="https://yosemite.org/experience/custom-adventures/" target="_blank" rel="noopener noreferrer">Custom Adventures, Yosemite Conservancy</a></li>
                  <li><a href="https://yosemite.org/event/overnight-under-the-milky-way-may-lake/" target="_blank" rel="noopener noreferrer">Overnight Under the Milky Way: May Lake, Yosemite Conservancy</a></li>
                  <li><a href="https://yosemite.org/event/overnight-under-the-perseids-meteor-shower-3/" target="_blank" rel="noopener noreferrer">Overnight Under the Perseids Meteor Shower, Yosemite Conservancy</a></li>
                  <li><a href="https://yosemite.org/projects/yosemite-night-sky/" target="_blank" rel="noopener noreferrer">Yosemite's Night Skies project, Yosemite Conservancy</a></li>
                  <li><a href="https://www.nps.gov/yose/planyourvisit/programs.htm" target="_blank" rel="noopener noreferrer">Special Programs, NPS Yosemite</a></li>
                  <li><a href="https://www.nps.gov/yose/planyourvisit/stargazing.htm" target="_blank" rel="noopener noreferrer">Stargazing, NPS Yosemite</a></li>
                  <li><a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">The Yosemite Guide, NPS Yosemite</a></li>
                  <li><a href="https://www.travelyosemite.com/things-to-do/naturalist-walks-programs" target="_blank" rel="noopener noreferrer">Naturalist Walks and Programs, Yosemite Hospitality</a></li>
                  <li><a href="https://www.travelyosemite.com/things-to-do/guided-bus-tours/" target="_blank" rel="noopener noreferrer">Guided Bus Tours, Yosemite Hospitality</a></li>
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
        </div>
      </section>
    </div>
  );
};
