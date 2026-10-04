function HomeHero({
  go
}) {
  return React.createElement(React.Fragment, null, React.createElement("section", {
    className: "hp-hero hp-wrap"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "✳ \xA0 LESS GUESSWORK. MORE YOSEMITE."), React.createElement("h1", null, "A remarkable place.", React.createElement("br", null), "A better way", React.createElement("br", null), "to ", React.createElement("em", null, "be there.")), React.createElement("p", {
    className: "hp-intro"
  }, "Your first Yosemite trip doesn’t need to feel like homework. Get local advice on where to stay, what to see, and how to make the most of your days."), React.createElement("div", {
    className: "hp-actions"
  }, React.createElement(HomeLink, {
    go: go,
    location: "home_hero",
    className: "hp-button",
    href: "/start-here"
  }, "Plan my first visit, free \xA0 ↗"), React.createElement(HomeLink, {
    go: go,
    location: "home_hero",
    className: "hp-link",
    href: "/guide"
  }, "Explore the offline Field Guide ↗")), React.createElement("p", {
    className: "hp-byline hp-hero-terms"
  }, "The Field Guide: ", window.GUIDE_TERMS && window.GUIDE_TERMS.price || "$3.99", " once, 18 months, works with no signal."), React.createElement("p", {
    className: "hp-byline"
  }, "Independent advice. Twenty seasons of paying attention.")), React.createElement("figure", null, React.createElement(ResponsiveImage, {
    image: "/img/valley-view-sunset-rodrigo-soares.jpg",
    alt: "El Capitan and Bridalveil Fall above the Merced River at sunset",
    sizes: "(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 50vw, 630px",
    eager: true
  }), React.createElement("div", {
    className: "hp-caption"
  }, "Less time figuring it out.", React.createElement("br", null), React.createElement("em", null, "More time looking up.")), React.createElement("figcaption", null, "01 / YOSEMITE VALLEY ", React.createElement("span", null, "Rodrigo Soares / Unsplash")))));
}
function HomePage({
  go
}) {
  return React.createElement("div", {
    className: "page hp-design"
  }, React.createElement(HomeHero, {
    go: go
  }), React.createElement("div", {
    className: "hp-utility hp-wrap"
  }, React.createElement("span", {
    className: "hp-eyebrow"
  }, "BEFORE YOU HEAD IN"), React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    href: "/conditions"
  }, "Roads & conditions ↗"), React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    href: "/articles/yosemite-without-reservations-2026"
  }, "Entry & reservations ↗"), React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    href: "/articles/yosemite-shuttle-and-yarts"
  }, "Getting around ↗")), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "home-start-here",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    go: go,
    location: "home_content",
    eyebrow: "YOUR FIRST VISIT, MADE SIMPLE",
    title: "Start here. The rest can wait."
  }), React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    className: "hp-door",
    href: "/start-here"
  }, React.createElement("div", {
    className: "hp-photo"
  }, React.createElement(ResponsiveImage, {
    image: "/img/half-dome-valley-cumulus.jpg",
    alt: "Half Dome above Yosemite Valley",
    sizes: "(max-width: 760px) calc(100vw - 40px), 600px"
  }), React.createElement("span", null, "READ THIS FIRST")), React.createElement("div", {
    className: "hp-door__body"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE FIRST-TRIP PAGE"), React.createElement("h3", null, "Everything a first visit needs,", React.createElement("br", null), "on one page."), React.createElement("p", {
    className: "hp-door__intro"
  }, "Where to begin, what to see, and how to shape the days, in the order the decisions come."), React.createElement("ul", {
    className: "hp-door__list"
  }, React.createElement("li", null, "The short answers: reservations, fees, how many days"), React.createElement("li", null, "The four places worth the drive, on the park map"), React.createElement("li", null, "One-, two- and three-day plans, in drive order"), React.createElement("li", null, "The questions everyone asks, and five first-trip mistakes")), React.createElement("b", null, "Open the first-trip page ", React.createElement("span", null, "↗"))))), React.createElement(HpGuideBand, {
    go: go,
    location: "home_content",
    id: "field-guide",
    title: React.createElement(React.Fragment, null, "You’ve done the reading.", React.createElement("br", null), "Now take the guide."),
    intro: "The practical side of a great Yosemite trip, all in your pocket. Download before you go. Keep exploring when the signal disappears."
  }), React.createElement(HpLetter, {
    id: "home-newsletter",
    eyebrow: "A LITTLE YOSEMITE IN YOUR INBOX",
    title: React.createElement(React.Fragment, null, "The trip starts long", React.createElement("br", null), "before the trailhead."),
    heading: "The Sunday Letter",
    blurb: "Know what’s open, what’s booking up, and what’s worth your time. One letter a week, from inside the park.",
    location: "home_newsletter",
    tag: "home"
  }), React.createElement("section", {
    className: "hp-journal hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    go: go,
    location: "home_content",
    eyebrow: "WHAT VISITORS ASK FIRST",
    title: "The questions that bring people here.",
    link: {
      href: "/articles",
      label: "Explore the journal ↗"
    }
  }), React.createElement("div", {
    className: "hp-journal-grid"
  }, React.createElement(HpCard, {
    go: go,
    location: "home_content",
    href: "/articles/yosemite-gateway-towns-compared",
    image: "/img/mariposa-mural.jpg",
    alt: "A mural in Mariposa, the gateway town on Highway 140",
    eyebrow: "WHERE TO STAY",
    title: "Mariposa, Oakhurst or Groveland?",
    text: "The gateway towns compared, drive by drive. ↗"
  }), React.createElement(HpCard, {
    go: go,
    location: "home_content",
    href: "/half-dome-lottery",
    image: "/img/half-dome-alpenglow-madhu-shesharam.jpg",
    alt: "Half Dome in alpenglow",
    eyebrow: "PERMITS",
    title: "The Half Dome lottery, decoded.",
    text: "Both lotteries, the odds, and when to apply. ↗"
  }), React.createElement(HpCard, {
    go: go,
    location: "home_content",
    href: "/articles/yosemite-camping-complete-guide",
    image: "/img/camp-ahwahnee-sentinel-rock.jpg",
    alt: "A hand-colored postcard of a tent camp beneath Sentinel Rock",
    eyebrow: "CAMPING",
    title: "Thirteen campgrounds, one guide.",
    text: "How to get a site, and where to go when they are full. ↗"
  }), React.createElement(HpCard, {
    go: go,
    location: "home_content",
    href: "/articles/when-to-visit-yosemite",
    image: "/img/vernal-fall-high-water.jpg",
    alt: "Vernal Fall at high water in late spring",
    eyebrow: "WHEN TO GO",
    title: "The best time to visit, by the data.",
    text: "A month-by-month crowd forecast. ↗"
  }), React.createElement(HpCard, {
    go: go,
    location: "home_content",
    href: "/articles/yosemite-for-non-hikers",
    image: "/img/tunnel-view-valley-spring.jpg",
    alt: "Tunnel View: El Capitan, Bridalveil Fall and Half Dome",
    eyebrow: "NO HIKING REQUIRED",
    title: "The whole park, without a trail.",
    text: "A complete visit for non-hikers. ↗"
  }), React.createElement(HpCard, {
    go: go,
    location: "home_content",
    href: "/articles/where-to-stay-in-yosemite",
    image: "/img/ahwahnee-hotel.jpg",
    alt: "The Ahwahnee hotel",
    eyebrow: "INSIDE THE PARK",
    title: "Every bed inside the boundary.",
    text: "In-park lodging, ranked, and how booking works. ↗"
  }))));
}
window.HomePage = HomePage;
window.HomeHero = HomeHero;
