function AdvertisePage({
  go
}) {
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
    eyebrow: "FOR OPERATORS",
    title: "List your business on The Talus Field.",
    intro: "The Talus Field is read by people actively planning a Yosemite trip. The audience that's about to book lodging, hire a guide, or buy a tour. If you operate a lodge, an inn, a guiding service, an outfitter, a transportation company, or any other Yosemite-adjacent business, a placement in The Directory puts you in front of the right reader at the right moment."
  }), React.createElement("section", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "places-pitch"
  }, React.createElement("div", {
    className: "places-pitch__grid"
  }, React.createElement("div", null, React.createElement("h2", null, "What a listing includes"), React.createElement("ul", null, React.createElement("li", null, "Your business name, area, and a short editorial blurb"), React.createElement("li", null, "A direct outbound link to your booking page"), React.createElement("li", null, "Inclusion in the relevant category (Lodging, Guides & instruction, or a future category we add)"), React.createElement("li", null, "Optional photo, logo, and an extended description for featured listings"), React.createElement("li", null, "Twelve months of placement, renewable"))), React.createElement("div", null, React.createElement("h2", null, "What I won't do"), React.createElement("ul", null, React.createElement("li", null, "List businesses I'd talk a friend out of using"), React.createElement("li", null, "Hide that a listing is sponsored. Every paid placement is labeled"), React.createElement("li", null, "Let payment override the editorial tone of the blurb"), React.createElement("li", null, "Take placements from operators with active permit or safety violations")))), React.createElement("div", {
    className: "places-pitch__tiers"
  }, React.createElement("div", {
    className: "places-pitch__tier"
  }, React.createElement("div", {
    className: "places-pitch__tier-eyebrow"
  }, "Standard listing"), React.createElement("div", {
    className: "places-pitch__tier-summary"
  }, "Name, area, blurb, outbound link in the relevant category."), React.createElement("div", {
    className: "places-pitch__tier-meta"
  }, "Twelve months · Inquire for current rate")), React.createElement("div", {
    className: "places-pitch__tier places-pitch__tier--featured"
  }, React.createElement("div", {
    className: "places-pitch__tier-eyebrow"
  }, "Featured listing"), React.createElement("div", {
    className: "places-pitch__tier-summary"
  }, "Standard, plus a photo, an extended description, and priority position within the category."), React.createElement("div", {
    className: "places-pitch__tier-meta"
  }, "Twelve months · Inquire for current rate"))), React.createElement("a", {
    className: "places-pitch__cta",
    href: "/contact",
    onClick: e => {
      e.preventDefault();
      go("contact");
    }
  }, "Inquire about a listing →"), React.createElement("p", {
    className: "places-pitch__fineprint"
  }, "All paid placements are reviewed before they go live. Listings can be removed at the editor's discretion if a business stops meeting basic standards. The ", React.createElement("a", {
    href: "/affiliate",
    onClick: e => {
      e.preventDefault();
      go("affiliate");
    }
  }, "full advertising and affiliate policy"), " is on the disclosure page."))), React.createElement("section", {
    className: "hp-wrap hp-section hp-advertise__why"
  }, React.createElement(HpHeading, {
    title: "Why a directory placement works"
  }), React.createElement("div", {
    className: "hp-advertise__copy"
  }, React.createElement("p", {
    className: "hp-sub"
  }, "The visitors reading The Talus Field are not casual browsers. They've already decided to come to the park. They're working out how to do it well, which means they're looking for a place to sleep, a guide to hire, a class to take, a route to drive. A search-engine ad reaches a colder audience and costs a multiple of what a year of placement here costs. A social post reaches a larger but less qualified audience that mostly will not convert."), React.createElement("p", {
    className: "hp-sub"
  }, "The directory shows up in a moment of decision, on a site the reader already trusts to give them straight answers. That's the placement."), React.createElement("p", {
    className: "hp-sub"
  }, "If you're an operator who fits, and you'd be willing to send a friend to your business, write to ", React.createElement("a", {
    className: "hp-inline",
    href: "mailto:cory@thetalusfieldjournal.com"
  }, "cory@thetalusfieldjournal.com"), " or use ", React.createElement("a", {
    className: "hp-inline",
    href: "/contact",
    onClick: e => {
      e.preventDefault();
      go("contact");
    }
  }, "the contact form"), ". I read every inquiry."))), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Sunday Field Notes",
    heading: "Sunday Field Notes",
    blurb: "A short note on Sundays, when there is something to say."
  }));
}
window.AdvertisePage = AdvertisePage;
