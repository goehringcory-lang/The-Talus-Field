function AdvertisePage({
  go
}) {
  var toContact = e => {
    e.preventDefault();
    go("contact");
  };
  return React.createElement("div", {
    className: "page hp-advertise"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Advertise"
    }],
    className: "fj-head fj-topo",
    eyebrow: "FOR OPERATORS",
    title: "List your business on The Talus Field.",
    intro: "The Talus Field is read by people planning a Yosemite trip: the readers about to book a room, hire a guide or buy a tour. If you run a lodge, an inn, a guiding service, an outfitter, a transportation company or another Yosemite-adjacent business, a listing in The Directory puts you in front of that reader at the moment they decide.",
    actions: React.createElement(React.Fragment, null, React.createElement("a", {
      className: "hp-button",
      href: "/contact",
      onClick: toContact
    }, "Inquire about a listing"), React.createElement(HomeLink, {
      go: go,
      location: "advertise",
      className: "hp-link",
      href: "/media-kit"
    }, "Read the media kit ↗")),
    aside: React.createElement(FjCard, {
      eyebrow: "A LISTING, IN FOUR LINES",
      stamp: React.createElement(React.Fragment, null, "Every paid", React.createElement("br", null), "placement", React.createElement("br", null), "labeled"),
      rows: [{
        label: "Placement",
        value: "Twelve months, renewable"
      }, {
        label: "Tiers",
        value: "Standard and featured"
      }, {
        label: "Reviewed",
        value: "Before it goes live"
      }, {
        label: "Rate",
        value: "From $300 a year"
      }]
    })
  }), React.createElement("section", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "places-pitch"
  }, React.createElement("div", {
    className: "places-pitch__grid"
  }, React.createElement("div", null, React.createElement("h2", null, "What a listing includes"), React.createElement("ul", null, React.createElement("li", null, "Your business name, area, and a short editorial blurb"), React.createElement("li", null, "A direct outbound link to your booking page"), React.createElement("li", null, "A place in the relevant category (Lodging, Guides & instruction, or a category added later)"), React.createElement("li", null, "For featured listings, a photo, a logo and an extended description"), React.createElement("li", null, "Twelve months of placement, renewable"))), React.createElement("div", null, React.createElement("h2", null, "What I won't do"), React.createElement("ul", null, React.createElement("li", null, "List businesses I'd talk a friend out of using"), React.createElement("li", null, "Hide that a listing is sponsored. Every paid placement is labeled"), React.createElement("li", null, "Let payment override the editorial tone of the blurb"), React.createElement("li", null, "Take placements from operators with active permit or safety violations")))), React.createElement("div", {
    className: "places-pitch__tiers"
  }, React.createElement("div", {
    className: "places-pitch__tier"
  }, React.createElement("div", {
    className: "places-pitch__tier-eyebrow"
  }, "Standard listing"), React.createElement("div", {
    className: "places-pitch__tier-summary"
  }, "Name, area, blurb, outbound link in the relevant category."), React.createElement("div", {
    className: "places-pitch__tier-meta"
  }, "Twelve months · $300 a year")), React.createElement("div", {
    className: "places-pitch__tier places-pitch__tier--featured"
  }, React.createElement("div", {
    className: "places-pitch__tier-eyebrow"
  }, "Featured listing"), React.createElement("div", {
    className: "places-pitch__tier-summary"
  }, "Standard, plus a photo, an extended description, and priority position within the category."), React.createElement("div", {
    className: "places-pitch__tier-meta"
  }, "Twelve months · $600 a year"))), React.createElement("a", {
    className: "places-pitch__cta",
    href: "/contact",
    onClick: toContact
  }, "Inquire about a listing →"), React.createElement("p", {
    className: "places-pitch__fineprint"
  }, "Sponsorship of the Sunday letter and custom packages are priced on inquiry. Every paid placement is reviewed before it goes live, and a listing can be removed at the editor's discretion if the business stops meeting the standard. The ", React.createElement("a", {
    href: "/affiliate",
    onClick: e => {
      e.preventDefault();
      go("affiliate");
    }
  }, "full advertising and affiliate policy"), " is on the disclosure page; readership, reach and timing are in ", React.createElement(HomeLink, {
    go: go,
    location: "advertise",
    href: "/media-kit"
  }, "the media kit"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section hp-advertise__why fj-split"
  }, React.createElement("div", null, React.createElement(HpHeading, {
    title: "Why a directory placement works"
  }), React.createElement("div", {
    className: "fj-ledger",
    "aria-hidden": "true"
  }, React.createElement("div", null, React.createElement("span", null, "A search-engine ad"), React.createElement("b", null, "A colder audience, at many times the cost")), React.createElement("div", null, React.createElement("span", null, "A social post"), React.createElement("b", null, "Larger, and less qualified")), React.createElement("div", {
    className: "is-ours"
  }, React.createElement("span", null, "The directory"), React.createElement("b", null, "A moment of decision")))), React.createElement("div", {
    className: "hp-advertise__copy"
  }, React.createElement("p", {
    className: "hp-sub"
  }, "Readers here are not browsing. They have decided to come to the park and are working out how to do it well, which means a place to sleep, a guide to hire, a class to take, a route to drive. A search-engine ad reaches a colder audience at a multiple of what a year here costs. A social post reaches a larger audience that is less qualified and mostly does not convert."), React.createElement("p", {
    className: "hp-sub"
  }, "A listing appears at the moment of decision, on a site the reader already trusts for straight answers. That is the placement."), React.createElement("p", {
    className: "hp-sub"
  }, "If your business fits, and you would send a friend to it, write to ", React.createElement("a", {
    className: "hp-inline",
    href: "mailto:cory@thetalusfieldjournal.com"
  }, "cory@thetalusfieldjournal.com"), " or use ", React.createElement("a", {
    className: "hp-inline",
    href: "/contact",
    onClick: toContact
  }, "the contact form"), ". I read every inquiry."))), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Sunday Field Notes",
    heading: "Sunday Field Notes",
    blurb: "A letter from inside Yosemite on Sundays: what the park is doing this week and why, set beside what its naturalists wrote down in the same weeks a century ago."
  }));
}
window.AdvertisePage = AdvertisePage;
