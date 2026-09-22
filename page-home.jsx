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
  <section className="hp-wrap hp-section" id="home-start-here" tabIndex={-1}>
    <HpHeading go={go} location="home_content" eyebrow="YOUR FIRST VISIT, MADE SIMPLE" title="Start here. The rest can wait." link={{ href: "/start-here", label: "All first-trip advice ↗" }} />
    <p className="hp-sub">The four reads that turn “where do we even begin?” into a plan.</p>
    <div className="hp-articles">
      <HomeLink go={go} location="home_content" className="hp-featured" href="/articles/first-time-yosemite-overwhelm">
        <div className="hp-photo">
          <ResponsiveImage image="/img/half-dome-valley-cumulus.jpg" alt="Half Dome above Yosemite Valley" sizes="(max-width: 760px) calc(100vw - 40px), 600px" />
          <span>READ THIS FIRST</span>
        </div>
        <div className="hp-cardbody">
          <p className="hp-eyebrow">01 / THE BIG PICTURE <span>6 MIN READ</span>
          </p>
          <h3>Your first Yosemite trip.<br />Let’s make it a good one.</h3>
          <p>What matters, what can wait, and the decisions to make before you book anything.</p>
          <b>Start with the essentials <span>↗</span>
          </b>
        </div>
      </HomeLink>
      <div className="hp-list">
        <HpRow go={go} location="home_content" href="/articles/yosemite-gateway-towns-compared" image="/img/lookout-point.jpg" alt="Forested Yosemite foothills" eyebrow="02 / YOUR HOME BASE" title="Where should you actually stay?" text="Five gateway towns. Very different trips." cta="Find your base" />
        <HpRow go={go} location="home_content" href="/articles/yosemite-in-one-or-two-days" image="/img/taft-point.jpg" alt="Taft Point granite overlook" eyebrow="03 / MAKE THE DAYS COUNT" title="One day or two? Here’s your plan." text="A little less rushing. A lot more Yosemite." cta="Build your itinerary" />
        <HpRow go={go} location="home_content" href="/articles/yosemite-without-reservations-2026" image="/img/arch-rock-entrance-yosemite.jpg" alt="Arch Rock entrance" eyebrow="04 / BEFORE YOU GO" title="Get the entry details sorted." text="Reservations, arrival strategy, and the way in." cta="Know before you go" />
      </div>
    </div>
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
