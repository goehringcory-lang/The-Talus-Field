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
    href: "#home-start-here"
  }, "Plan your first visit \xA0 ↓"), React.createElement(HomeLink, {
    go: go,
    location: "home_hero",
    className: "hp-link",
    href: "#field-guide"
  }, "Meet your pocket guide ↗")), React.createElement("p", {
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
    title: "Start here. The rest can wait.",
    link: {
      href: "/start-here",
      label: "All first-trip advice ↗"
    }
  }), React.createElement("p", {
    className: "hp-sub"
  }, "The four reads that turn “where do we even begin?” into a plan."), React.createElement("div", {
    className: "hp-articles"
  }, React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    className: "hp-featured",
    href: "/articles/first-time-yosemite-overwhelm"
  }, React.createElement("div", {
    className: "hp-photo"
  }, React.createElement(ResponsiveImage, {
    image: "/img/half-dome-valley-cumulus.jpg",
    alt: "Half Dome above Yosemite Valley",
    sizes: "(max-width: 760px) calc(100vw - 40px), 600px"
  }), React.createElement("span", null, "READ THIS FIRST")), React.createElement("div", {
    className: "hp-cardbody"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "01 / THE BIG PICTURE ", React.createElement("span", null, "6 MIN READ")), React.createElement("h3", null, "Your first Yosemite trip.", React.createElement("br", null), "Let’s make it a good one."), React.createElement("p", null, "What matters, what can wait, and the decisions to make before you book anything."), React.createElement("b", null, "Start with the essentials ", React.createElement("span", null, "↗")))), React.createElement("div", {
    className: "hp-list"
  }, React.createElement(HpRow, {
    go: go,
    location: "home_content",
    href: "/articles/yosemite-gateway-towns-compared",
    image: "/img/lookout-point.jpg",
    alt: "Forested Yosemite foothills",
    eyebrow: "02 / YOUR HOME BASE",
    title: "Where should you actually stay?",
    text: "Five gateway towns. Very different trips.",
    cta: "Find your base"
  }), React.createElement(HpRow, {
    go: go,
    location: "home_content",
    href: "/articles/yosemite-in-one-or-two-days",
    image: "/img/taft-point.jpg",
    alt: "Taft Point granite overlook",
    eyebrow: "03 / MAKE THE DAYS COUNT",
    title: "One day or two? Here’s your plan.",
    text: "A little less rushing. A lot more Yosemite.",
    cta: "Build your itinerary"
  }), React.createElement(HpRow, {
    go: go,
    location: "home_content",
    href: "/articles/yosemite-without-reservations-2026",
    image: "/img/arch-rock-entrance-yosemite.jpg",
    alt: "Arch Rock entrance",
    eyebrow: "04 / BEFORE YOU GO",
    title: "Get the entry details sorted.",
    text: "Reservations, arrival strategy, and the way in.",
    cta: "Know before you go"
  })))), React.createElement(HpGuideBand, {
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
    blurb: "Know what’s open, what’s booking out, and what’s worth your time. The Sunday Letter brings the view from inside the park to your inbox, once a week.",
    location: "home_newsletter",
    tag: "home"
  }), React.createElement("section", {
    className: "hp-journal hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    go: go,
    location: "home_content",
    eyebrow: "GO A LITTLE DEEPER",
    title: "Good trips begin with curiosity.",
    link: {
      href: "/articles",
      label: "Explore the journal ↗"
    }
  }), React.createElement("div", {
    className: "hp-journal-grid"
  }, React.createElement(HpCard, {
    go: go,
    location: "home_content",
    href: "/articles/yosemite-in-fall",
    image: "/img/tunnel-view-autumn-aniket-deole.jpg",
    alt: "Autumn light over Yosemite",
    eyebrow: "THE SEASONS",
    title: "A quieter kind of Yosemite.",
    text: "A guide to visiting in fall. ↗"
  }), React.createElement(HpCard, {
    go: go,
    location: "home_content",
    href: "/articles/where-to-eat-yosemite",
    image: "/img/ahwahnee-hotel.jpg",
    alt: "The Ahwahnee hotel",
    eyebrow: "BETWEEN ADVENTURES",
    title: "A good day deserves a good meal.",
    text: "Where to eat in and around the park. ↗"
  }), React.createElement(HpCard, {
    go: go,
    location: "home_content",
    href: "/articles/tuolumne-meadows-in-a-day",
    image: "/img/tuolumne-meadows-river-basiciggy.jpg",
    alt: "River winding through Tuolumne Meadows",
    eyebrow: "BEYOND THE VALLEY",
    title: "Leave room for the high country.",
    text: "A day in Tuolumne Meadows. ↗"
  }))));
}
window.HomePage = HomePage;
window.HomeHero = HomeHero;
