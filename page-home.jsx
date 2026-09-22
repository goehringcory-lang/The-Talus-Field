/* global React, HomeLink, ResponsiveImage, NewsletterInline */
// The approved visitor-first homepage. HomeHero also renders into index.html's
// pre-JavaScript shell; keep its first render independent of browser state.
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
    <div className="hp-heading">
      <div>
        <p className="hp-eyebrow">YOUR FIRST VISIT, MADE SIMPLE</p>
        <h2>Start here. The rest can wait.</h2>
      </div>
      <HomeLink go={go} location="home_content" className="hp-link" href="/start-here">All first-trip advice ↗</HomeLink>
    </div>
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
        <HomeLink go={go} location="home_content" className="hp-row" href="/articles/yosemite-gateway-towns-compared">
          <ResponsiveImage image="/img/lookout-point.jpg" alt="Forested Yosemite foothills" sizes="(max-width: 760px) calc(100vw - 40px), 600px" />
          <div>
            <p className="hp-eyebrow">02 / YOUR HOME BASE</p>
            <h3>Where should you actually stay?</h3>
            <p>Five gateway towns. Very different trips.</p>
            <b>Find your base <span>↗</span>
            </b>
          </div>
        </HomeLink>
        <HomeLink go={go} location="home_content" className="hp-row" href="/articles/yosemite-in-one-or-two-days">
          <ResponsiveImage image="/img/taft-point.jpg" alt="Taft Point granite overlook" sizes="(max-width: 760px) calc(100vw - 40px), 600px" />
          <div>
            <p className="hp-eyebrow">03 / MAKE THE DAYS COUNT</p>
            <h3>One day or two? Here’s your plan.</h3>
            <p>A little less rushing. A lot more Yosemite.</p>
            <b>Build your itinerary <span>↗</span>
            </b>
          </div>
        </HomeLink>
        <HomeLink go={go} location="home_content" className="hp-row" href="/articles/yosemite-without-reservations-2026">
          <ResponsiveImage image="/img/arch-rock-entrance-yosemite.jpg" alt="Arch Rock entrance" sizes="(max-width: 760px) calc(100vw - 40px), 600px" />
          <div>
            <p className="hp-eyebrow">04 / BEFORE YOU GO</p>
            <h3>Get the entry details sorted.</h3>
            <p>Reservations, arrival strategy, and the way in.</p>
            <b>Know before you go <span>↗</span>
            </b>
          </div>
        </HomeLink>
      </div>
    </div>
  </section>
  <section className="hp-product" id="field-guide" tabIndex={-1}>
    <div className="hp-wrap hp-product-grid">
      <div>
        <p className="hp-eyebrow">THE TALUS FIELD GUIDE / THE OFFLINE APP</p>
        <h2>You’ve done the reading.<br />Now take the guide.</h2>
        <p className="hp-intro">The practical side of a great Yosemite trip, all in your pocket. Download before you go. Keep exploring when the signal disappears.</p>
        <ul>
          <li>
            <span>↳</span>
            <div>
              <strong>Find your next stop.</strong>
              <p>44 stops, arranged in driving order.</p>
            </div>
          </li>
          <li>
            <span>⌁</span>
            <div>
              <strong>Choose a hike that fits your day.</strong>
              <p>57 day hikes with GPS tracks.</p>
            </div>
          </li>
          <li>
            <span>◎</span>
            <div>
              <strong>Bring a little local knowledge.</strong>
              <p>50 Secret Guide entries to look beyond the obvious.</p>
            </div>
          </li>
        </ul>
        <HomeLink go={go} location="home_content" className="hp-button hp-light" href="/guide">Get the Field Guide <span>$3.99 ↗</span>
        </HomeLink>
        <p className="hp-terms">One payment · 18 months of access · 30-day guarantee</p>
      </div>
      <div className="hp-screens">
        <div className="hp-orbit">
        </div>
        <div className="hp-phone hp-back">
          <img src="/img/guide/screens/hikes.v2.webp" alt="Field Guide hiking screen" width="640" height="1385" loading="lazy" decoding="async" />
        </div>
        <div className="hp-phone hp-front">
          <img src="/img/guide/screens/front-page.v4.webp" alt="Field Guide app with park information and daylight tools" width="640" height="1385" loading="lazy" decoding="async" />
        </div>
        <div className="hp-offline">✓ &nbsp; All set. Even off the grid.<small>YOUR GUIDE WORKS OFFLINE</small>
        </div>
        <p className="hp-screen-note">Actual screens from the Field Guide</p>
      </div>
    </div>
  </section>
  <section className="hp-letter hp-wrap hp-section" id="home-newsletter" tabIndex={-1}>
    <div className="hp-paper">
      <span className="hp-stamp">EL PORTAL, CA<br />THE SUNDAY LETTER</span>
      <div>A field note<br />for your<br />
        <em>next adventure.</em>
      </div>
      <small>From Yosemite, with perspective.</small>
    </div>
    <div>
      <p className="hp-eyebrow">A LITTLE YOSEMITE IN YOUR INBOX</p>
      <h2>The trip starts long<br />before the trailhead.</h2>
      <NewsletterInline heading="The Sunday Letter" blurb="Know what’s open, what’s booking out, and what’s worth your time. The Sunday Letter brings the view from inside the park to your inbox, once a week." location="home_newsletter" tag="home" cta="Send me the letter ↗" modifier="hp-newsletter" inputLabel="Your email address" />
      <p className="hp-terms">Free to read. One letter a week. Unsubscribe whenever.</p>
    </div>
  </section>
  <section className="hp-journal hp-wrap hp-section">
    <div className="hp-heading">
      <div>
        <p className="hp-eyebrow">GO A LITTLE DEEPER</p>
        <h2>Good trips begin with curiosity.</h2>
      </div>
      <HomeLink go={go} location="home_content" className="hp-link" href="/articles">Explore the journal ↗</HomeLink>
    </div>
    <div className="hp-journal-grid">
      <HomeLink go={go} location="home_content" href="/articles/yosemite-in-fall">
        <ResponsiveImage image="/img/tunnel-view-autumn-aniket-deole.jpg" alt="Autumn light over Yosemite" sizes="(max-width: 760px) calc(100vw - 40px), 600px" />
        <p className="hp-eyebrow">THE SEASONS</p>
        <h3>A quieter kind of Yosemite.</h3>
        <p>A guide to visiting in fall. ↗</p>
      </HomeLink>
      <HomeLink go={go} location="home_content" href="/articles/where-to-eat-yosemite">
        <ResponsiveImage image="/img/ahwahnee-hotel.jpg" alt="The Ahwahnee hotel" sizes="(max-width: 760px) calc(100vw - 40px), 600px" />
        <p className="hp-eyebrow">BETWEEN ADVENTURES</p>
        <h3>A good day deserves a good meal.</h3>
        <p>Where to eat in and around the park. ↗</p>
      </HomeLink>
      <HomeLink go={go} location="home_content" href="/articles/tuolumne-meadows-in-a-day">
        <ResponsiveImage image="/img/tuolumne-meadows-river-basiciggy.jpg" alt="River winding through Tuolumne Meadows" sizes="(max-width: 760px) calc(100vw - 40px), 600px" />
        <p className="hp-eyebrow">BEYOND THE VALLEY</p>
        <h3>Leave room for the high country.</h3>
        <p>A day in Tuolumne Meadows. ↗</p>
      </HomeLink>
    </div>
  </section>
    </div>
  );
}
window.HomePage = HomePage;
window.HomeHero = HomeHero;
