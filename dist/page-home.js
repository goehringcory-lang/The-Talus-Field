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
  }, React.createElement("div", {
    className: "hp-heading"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YOUR FIRST VISIT, MADE SIMPLE"), React.createElement("h2", null, "Start here. The rest can wait.")), React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    className: "hp-link",
    href: "/start-here"
  }, "All first-trip advice ↗")), React.createElement("p", {
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
  }, React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    className: "hp-row",
    href: "/articles/yosemite-gateway-towns-compared"
  }, React.createElement(ResponsiveImage, {
    image: "/img/lookout-point.jpg",
    alt: "Forested Yosemite foothills",
    sizes: "(max-width: 760px) calc(100vw - 40px), 600px"
  }), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "02 / YOUR HOME BASE"), React.createElement("h3", null, "Where should you actually stay?"), React.createElement("p", null, "Five gateway towns. Very different trips."), React.createElement("b", null, "Find your base ", React.createElement("span", null, "↗")))), React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    className: "hp-row",
    href: "/articles/yosemite-in-one-or-two-days"
  }, React.createElement(ResponsiveImage, {
    image: "/img/taft-point.jpg",
    alt: "Taft Point granite overlook",
    sizes: "(max-width: 760px) calc(100vw - 40px), 600px"
  }), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "03 / MAKE THE DAYS COUNT"), React.createElement("h3", null, "One day or two? Here’s your plan."), React.createElement("p", null, "A little less rushing. A lot more Yosemite."), React.createElement("b", null, "Build your itinerary ", React.createElement("span", null, "↗")))), React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    className: "hp-row",
    href: "/articles/yosemite-without-reservations-2026"
  }, React.createElement(ResponsiveImage, {
    image: "/img/arch-rock-entrance-yosemite.jpg",
    alt: "Arch Rock entrance",
    sizes: "(max-width: 760px) calc(100vw - 40px), 600px"
  }), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "04 / BEFORE YOU GO"), React.createElement("h3", null, "Get the entry details sorted."), React.createElement("p", null, "Reservations, arrival strategy, and the way in."), React.createElement("b", null, "Know before you go ", React.createElement("span", null, "↗"))))))), React.createElement("section", {
    className: "hp-product",
    id: "field-guide",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-product-grid"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE TALUS FIELD GUIDE / THE OFFLINE APP"), React.createElement("h2", null, "You’ve done the reading.", React.createElement("br", null), "Now take the guide."), React.createElement("p", {
    className: "hp-intro"
  }, "The practical side of a great Yosemite trip, all in your pocket. Download before you go. Keep exploring when the signal disappears."), React.createElement("ul", null, React.createElement("li", null, React.createElement("span", null, "↳"), React.createElement("div", null, React.createElement("strong", null, "Find your next stop."), React.createElement("p", null, "44 stops, arranged in driving order."))), React.createElement("li", null, React.createElement("span", null, "⌁"), React.createElement("div", null, React.createElement("strong", null, "Choose a hike that fits your day."), React.createElement("p", null, "57 day hikes with GPS tracks."))), React.createElement("li", null, React.createElement("span", null, "◎"), React.createElement("div", null, React.createElement("strong", null, "Bring a little local knowledge."), React.createElement("p", null, "50 Secret Guide entries to look beyond the obvious.")))), React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    className: "hp-button hp-light",
    href: "/guide"
  }, "Get the Field Guide ", React.createElement("span", null, "$3.99 ↗")), React.createElement("p", {
    className: "hp-terms"
  }, "One payment · 18 months of access · 30-day guarantee")), React.createElement("div", {
    className: "hp-screens"
  }, React.createElement("div", {
    className: "hp-orbit"
  }), React.createElement("div", {
    className: "hp-phone hp-back"
  }, React.createElement("img", {
    src: "/img/guide/screens/hikes.v2.webp",
    alt: "Field Guide hiking screen",
    width: "640",
    height: "1385",
    loading: "lazy",
    decoding: "async"
  })), React.createElement("div", {
    className: "hp-phone hp-front"
  }, React.createElement("img", {
    src: "/img/guide/screens/front-page.v4.webp",
    alt: "Field Guide app with park information and daylight tools",
    width: "640",
    height: "1385",
    loading: "lazy",
    decoding: "async"
  })), React.createElement("div", {
    className: "hp-offline"
  }, "✓ \xA0 All set. Even off the grid.", React.createElement("small", null, "YOUR GUIDE WORKS OFFLINE")), React.createElement("p", {
    className: "hp-screen-note"
  }, "Actual screens from the Field Guide")))), React.createElement("section", {
    className: "hp-letter hp-wrap hp-section",
    id: "home-newsletter",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-paper"
  }, React.createElement("span", {
    className: "hp-stamp"
  }, "EL PORTAL, CA", React.createElement("br", null), "THE SUNDAY LETTER"), React.createElement("div", null, "A field note", React.createElement("br", null), "for your", React.createElement("br", null), React.createElement("em", null, "next adventure.")), React.createElement("small", null, "From Yosemite, with perspective.")), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "A LITTLE YOSEMITE IN YOUR INBOX"), React.createElement("h2", null, "The trip starts long", React.createElement("br", null), "before the trailhead."), React.createElement(NewsletterInline, {
    heading: "The Sunday Letter",
    blurb: "Know what’s open, what’s booking out, and what’s worth your time. The Sunday Letter brings the view from inside the park to your inbox, once a week.",
    location: "home_newsletter",
    tag: "home",
    cta: "Send me the letter ↗",
    modifier: "hp-newsletter",
    inputLabel: "Your email address"
  }), React.createElement("p", {
    className: "hp-terms"
  }, "Free to read. One letter a week. Unsubscribe whenever."))), React.createElement("section", {
    className: "hp-journal hp-wrap hp-section"
  }, React.createElement("div", {
    className: "hp-heading"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "GO A LITTLE DEEPER"), React.createElement("h2", null, "Good trips begin with curiosity.")), React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    className: "hp-link",
    href: "/articles"
  }, "Explore the journal ↗")), React.createElement("div", {
    className: "hp-journal-grid"
  }, React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    href: "/articles/yosemite-in-fall"
  }, React.createElement(ResponsiveImage, {
    image: "/img/tunnel-view-autumn-aniket-deole.jpg",
    alt: "Autumn light over Yosemite",
    sizes: "(max-width: 760px) calc(100vw - 40px), 600px"
  }), React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE SEASONS"), React.createElement("h3", null, "A quieter kind of Yosemite."), React.createElement("p", null, "A guide to visiting in fall. ↗")), React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    href: "/articles/where-to-eat-yosemite"
  }, React.createElement(ResponsiveImage, {
    image: "/img/ahwahnee-hotel.jpg",
    alt: "The Ahwahnee hotel",
    sizes: "(max-width: 760px) calc(100vw - 40px), 600px"
  }), React.createElement("p", {
    className: "hp-eyebrow"
  }, "BETWEEN ADVENTURES"), React.createElement("h3", null, "A good day deserves a good meal."), React.createElement("p", null, "Where to eat in and around the park. ↗")), React.createElement(HomeLink, {
    go: go,
    location: "home_content",
    href: "/articles/tuolumne-meadows-in-a-day"
  }, React.createElement(ResponsiveImage, {
    image: "/img/tuolumne-meadows-river-basiciggy.jpg",
    alt: "River winding through Tuolumne Meadows",
    sizes: "(max-width: 760px) calc(100vw - 40px), 600px"
  }), React.createElement("p", {
    className: "hp-eyebrow"
  }, "BEYOND THE VALLEY"), React.createElement("h3", null, "Leave room for the high country."), React.createElement("p", null, "A day in Tuolumne Meadows. ↗")))));
}
window.HomePage = HomePage;
window.HomeHero = HomeHero;
