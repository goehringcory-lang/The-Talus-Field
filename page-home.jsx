/* global React, HomeLink, ResponsiveImage, HpHeading, HpCard, HpGuideBand, HpLetter */
// The approved visitor-first homepage, and the source of truth for the design
// system (the Hp* components in components.jsx). Its sections are built from the
// shared Hp* components, which the pages rebuilt on the system reuse; only the
// hero, the featured card and the utility strip are this page's own. HomeHero
// also renders into index.html's pre-JavaScript shell; keep its first render
// independent of browser state.
function HomeHero({ go }) {
  return (
    <>
  <section className="hp-hero hp-wrap">
    <div>
      <p className="hp-eyebrow">✳ &nbsp; LESS GUESSWORK. MORE YOSEMITE.</p>
      <h1>A remarkable place.<br />A better way<br />to <em>be there.</em>
      </h1>
      <p className="hp-intro">Your first Yosemite trip doesn’t need to feel like homework. Get local advice on where to stay, what to see, and how to make the most of your days.</p>
      {/* Two literal doors (UX audit, October 2026): the free first-trip page
          and the paid offline guide, each straight to its own page rather
          than a jump down this one. The terms line reads GUIDE_TERMS, which
          carries no date, so the shell's year guard stays satisfied. */}
      <div className="hp-actions">
        <HomeLink go={go} location="home_hero" className="hp-button" href="/start-here">Plan my first visit, free &nbsp; ↗</HomeLink>
        <HomeLink go={go} location="home_hero" className="hp-link" href="/guide">Explore the offline Field Guide ↗</HomeLink>
      </div>
      <p className="hp-byline hp-hero-terms">The Field Guide: {(window.GUIDE_TERMS && window.GUIDE_TERMS.price) || "$3.99"} once, 18 months, works with no signal.</p>
      <p className="hp-byline">Independent advice. Twenty seasons of paying attention.</p>
    </div>
    <figure>
      <ResponsiveImage image="/img/valley-view-sunset-rodrigo-soares.jpg" alt="El Capitan and Bridalveil Fall above the Merced River at sunset" sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 50vw, 630px" eager />
      <div className="hp-caption">Less time figuring it out.<br />
        <em>More time looking up.</em>
      </div>
      <figcaption>01 / YOSEMITE VALLEY <span>Rodrigo Soares / Unsplash</span>
      </figcaption>
    </figure>
  </section>
    </>
  );
}
function HomePage({ go }) {
  return (
    <div className="page hp-design">
  <HomeHero go={go} />
  <div className="hp-utility hp-wrap">
    <span className="hp-eyebrow">BEFORE YOU HEAD IN</span>
    <HomeLink go={go} location="home_content" href="/conditions">Roads &amp; conditions ↗</HomeLink>
    <HomeLink go={go} location="home_content" href="/articles/yosemite-without-reservations-2026">Entry &amp; reservations ↗</HomeLink>
    <HomeLink go={go} location="home_content" href="/articles/yosemite-shuttle-and-yarts">Getting around ↗</HomeLink>
  </div>
  {/* Start Here is one door, not a reading list: the whole card is a single
      link to /start-here, which carries the four articles this block used to
      list and everything around them. The four lines below name the page's
      own sections, in its order; change them when that page changes. */}
  <section className="hp-wrap hp-section" id="home-start-here" tabIndex={-1}>
    <HpHeading go={go} location="home_content" eyebrow="YOUR FIRST VISIT, MADE SIMPLE" title="Start here. The rest can wait." />
    <HomeLink go={go} location="home_content" className="hp-door" href="/start-here">
      <div className="hp-photo">
        <ResponsiveImage image="/img/half-dome-valley-cumulus.jpg" alt="Half Dome above Yosemite Valley" sizes="(max-width: 760px) calc(100vw - 40px), 600px" />
        <span>READ THIS FIRST</span>
      </div>
      <div className="hp-door__body">
        <p className="hp-eyebrow">THE FIRST-TRIP PAGE</p>
        <h3>Everything a first visit needs,<br />on one page.</h3>
        <p className="hp-door__intro">Where to begin, what to see, and how to shape the days, in the order the decisions come.</p>
        <ul className="hp-door__list">
          <li>The short answers: reservations, fees, how many days</li>
          <li>The four places worth the drive, on the park map</li>
          <li>One-, two- and three-day plans, in drive order</li>
          <li>The questions everyone asks, and five first-trip mistakes</li>
        </ul>
        <b>Open the first-trip page <span>↗</span></b>
      </div>
    </HomeLink>
  </section>
  <HpGuideBand go={go} location="home_content" id="field-guide" title={<>You’ve done the reading.<br />Now take the guide.</>} intro="The practical side of a great Yosemite trip, all in your pocket. Download before you go. Keep exploring when the signal disappears." />
  <HpLetter id="home-newsletter" eyebrow="A LITTLE YOSEMITE IN YOUR INBOX" title={<>The trip starts long<br />before the trailhead.</>} heading="The Sunday Letter" blurb="Know what’s open, what’s booking up, and what’s worth your time. One letter a week, from inside the park." location="home_newsletter" tag="home" />
  {/* The six most-sought pages, picked from Search Console (the three months
      to October 1, 2026) and the affiliate markup each page carries, not from
      the catalog: gateway towns (6,291 impressions, 64 clicks), the Half Dome
      lottery (5,069 with the retired dated slug), camping, non-hikers and the
      crowd forecast (each about 1,500), and where to stay, the in-park lodging
      page. Five of the six carry disclosed lodging links. Hand-written
      on purpose, like the rest of the page; re-curate from a fresh export. */}
  <section className="hp-journal hp-wrap hp-section">
    <HpHeading go={go} location="home_content" eyebrow="WHAT VISITORS ASK FIRST" title="The questions that bring people here." link={{ href: "/articles", label: "Explore the journal ↗" }} />
    <div className="hp-journal-grid">
      <HpCard go={go} location="home_content" href="/articles/yosemite-gateway-towns-compared" image="/img/mariposa-mural.jpg" alt="A mural in Mariposa, the gateway town on Highway 140" eyebrow="WHERE TO STAY" title="Mariposa, Oakhurst or Groveland?" text="The gateway towns compared, drive by drive. ↗" />
      <HpCard go={go} location="home_content" href="/half-dome-lottery" image="/img/half-dome-alpenglow-madhu-shesharam.jpg" alt="Half Dome in alpenglow" eyebrow="PERMITS" title="The Half Dome lottery, decoded." text="Both lotteries, the odds, and when to apply. ↗" />
      <HpCard go={go} location="home_content" href="/articles/yosemite-camping-complete-guide" image="/img/camp-ahwahnee-sentinel-rock.jpg" alt="A hand-colored postcard of a tent camp beneath Sentinel Rock" eyebrow="CAMPING" title="Thirteen campgrounds, one guide." text="How to get a site, and where to go when they are full. ↗" />
      <HpCard go={go} location="home_content" href="/articles/when-to-visit-yosemite" image="/img/vernal-fall-high-water.jpg" alt="Vernal Fall at high water in late spring" eyebrow="WHEN TO GO" title="The best time to visit, by the data." text="A month-by-month crowd forecast. ↗" />
      <HpCard go={go} location="home_content" href="/articles/yosemite-for-non-hikers" image="/img/tunnel-view-valley-spring.jpg" alt="Tunnel View: El Capitan, Bridalveil Fall and Half Dome" eyebrow="NO HIKING REQUIRED" title="The whole park, without a trail." text="A complete visit for non-hikers. ↗" />
      <HpCard go={go} location="home_content" href="/articles/where-to-stay-in-yosemite" image="/img/ahwahnee-hotel.jpg" alt="The Ahwahnee hotel" eyebrow="INSIDE THE PARK" title="Every bed inside the boundary." text="In-park lodging, ranked, and how booking works. ↗" />
    </div>
  </section>
    </div>
  );
}
window.HomePage = HomePage;
window.HomeHero = HomeHero;
