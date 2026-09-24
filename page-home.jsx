/* global React, HomeLink, ResponsiveImage, HpHeading, HpRow, HpCard, HpGuideBand, HpLetter */
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
      <div className="hp-actions">
        <HomeLink go={go} location="home_hero" className="hp-button" href="#home-start-here">Plan your first visit &nbsp; ↓</HomeLink>
        <HomeLink go={go} location="home_hero" className="hp-link" href="#field-guide">Meet your pocket guide ↗</HomeLink>
      </div>
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
  <HpLetter id="home-newsletter" eyebrow="A LITTLE YOSEMITE IN YOUR INBOX" title={<>The trip starts long<br />before the trailhead.</>} heading="The Sunday Letter" blurb="Know what’s open, what’s booking out, and what’s worth your time. The Sunday Letter brings the view from inside the park to your inbox, once a week." location="home_newsletter" tag="home" />
  <section className="hp-journal hp-wrap hp-section">
    <HpHeading go={go} location="home_content" eyebrow="GO A LITTLE DEEPER" title="Good trips begin with curiosity." link={{ href: "/articles", label: "Explore the journal ↗" }} />
    <div className="hp-journal-grid">
      <HpCard go={go} location="home_content" href="/articles/yosemite-in-fall" image="/img/tunnel-view-autumn-aniket-deole.jpg" alt="Autumn light over Yosemite" eyebrow="THE SEASONS" title="A quieter kind of Yosemite." text="A guide to visiting in fall. ↗" />
      <HpCard go={go} location="home_content" href="/articles/where-to-eat-yosemite" image="/img/ahwahnee-hotel.jpg" alt="The Ahwahnee hotel" eyebrow="BETWEEN ADVENTURES" title="A good day deserves a good meal." text="Where to eat in and around the park. ↗" />
      <HpCard go={go} location="home_content" href="/articles/tuolumne-meadows-in-a-day" image="/img/tuolumne-meadows-river-basiciggy.jpg" alt="River winding through Tuolumne Meadows" eyebrow="BEYOND THE VALLEY" title="Leave room for the high country." text="A day in Tuolumne Meadows. ↗" />
    </div>
  </section>
    </div>
  );
}
window.HomePage = HomePage;
window.HomeHero = HomeHero;
