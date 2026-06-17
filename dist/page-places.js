function PlacesPage({
  go
}) {
  var regions = [{
    key: "valley",
    name: "Yosemite Valley",
    note: "The headline mile. Granite walls, the river, the falls that everyone came for.",
    image: "img/tunnel-view.jpg"
  }, {
    key: "glacier-mariposa",
    name: "Glacier Point & Mariposa",
    note: "The south rim and the sequoias. The view down into the Valley, and the largest trees on earth.",
    image: "img/half-dome.jpg"
  }, {
    key: "tuolumne",
    name: "Tuolumne Meadows",
    note: "Above 8,000 feet, summer only. Domes, lakes, and the Sierra crest.",
    image: "img/tuolumne-meadows.jpg"
  }];
  var categories = [{
    name: "Lodging",
    note: "Lodges, inns, and small hotels inside the park or within an hour of a gate. Family-run preferred."
  }, {
    name: "Guides & instruction",
    note: "Climbing schools, hiking guides, naturalist programs. Permitted, insured, and not running on charisma alone."
  }, {
    name: "Outfitters",
    note: "Gear rental and resupply for travelers who flew in or forgot the one important thing."
  }, {
    name: "Tours & transportation",
    note: "Drivers, shuttles, and scheduled tours that move readers between the Valley, the high country, and the gateway towns."
  }, {
    name: "Vacation rentals",
    note: "Independently operated houses and cabins in the gateway towns. Owners who answer their own phone."
  }];
  return React.createElement("div", {
    className: "page"
  }, React.createElement("section", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "The Directory"), React.createElement("h1", null, "A short list, mostly empty."), React.createElement("p", {
    className: "page-head__dek"
  }, "This page lists businesses I would recommend to a friend visiting Yosemite. At the moment it lists one organization, and that organization is not a business. The rest of the slots are open. Most operators who inquire will not fill them."))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 56
    }
  }, React.createElement("div", {
    className: "region-triptych"
  }, regions.map(r => React.createElement("figure", {
    key: r.key,
    className: "region-tile"
  }, React.createElement("div", {
    className: "region-tile__frame"
  }, React.createElement("img", {
    className: "region-tile__img",
    src: r.image,
    alt: r.name,
    loading: "lazy",
    referrerPolicy: "no-referrer"
  })), React.createElement("figcaption", null, React.createElement("div", {
    className: "region-tile__eyebrow"
  }, "Region"), React.createElement("div", {
    className: "region-tile__name"
  }, r.name), React.createElement("div", {
    className: "region-tile__note"
  }, r.note)))))), React.createElement("section", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 72
    }
  }, React.createElement("h2", {
    className: "places-standard__heading"
  }, "The standard."), React.createElement("p", {
    className: "places-standard__body"
  }, "Twenty seasons in this park have left me with a short list of operators I would put a friend in front of, and a much longer list of ones I would not. The Directory is the short list, written down. I am not in a hurry to fill it. Every name that appears here will be one I have used, or one whose work I have watched closely enough to vouch for. Readers should treat the absence of a listing as neither endorsement nor warning. It means I have not vouched yet."), React.createElement("p", {
    className: "places-standard__body"
  }, "A directory of forty lodges is not a directory, it is a phone book. This one will stay small.")), React.createElement("section", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 64
    }
  }, React.createElement("div", {
    className: "conservancy"
  }, React.createElement("div", {
    className: "conservancy__eyebrow"
  }, "Currently listed"), React.createElement("h2", {
    className: "conservancy__name"
  }, "Yosemite Conservancy"), React.createElement("p", {
    className: "conservancy__body"
  }, "The park's official nonprofit partner. They fund research, restoration, and other park projects, and run a calendar of naturalist-led programs in multi-day Yosemite field school format taught by expert naturalists. They are not a commercial operator and they are not paying for placement. I recommend them without reservation."), React.createElement("a", {
    className: "conservancy__link",
    href: "https://yosemite.org",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "yosemite.org ↗"))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 80
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Categories"), React.createElement("div", {
    className: "mono",
    style: {
      color: "var(--ink-3)"
    }
  }, categories.length, " sections, building")), React.createElement("ul", {
    className: "dir-cats"
  }, categories.map(c => React.createElement("li", {
    key: c.name,
    className: "dir-cats__item"
  }, React.createElement("div", {
    className: "dir-cats__name"
  }, c.name), React.createElement("div", {
    className: "dir-cats__note"
  }, c.note), React.createElement("div", {
    className: "dir-cats__status"
  }, "Accepting inquiries"))))), React.createElement("section", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 72,
      paddingBottom: 96
    }
  }, React.createElement("p", {
    className: "dir-cta__body"
  }, "If you operate a Yosemite-adjacent business and you believe you meet the standard above, the listing product, what a placement includes, and what disqualifies an applicant are described on a separate page. Most inquiries are declined. The ones that are not tend to come from operators who already know why they belong here."), React.createElement("a", {
    className: "dir-cta__link",
    href: "/advertise",
    onClick: e => {
      e.preventDefault();
      go("advertise");
    }
  }, "Read about a listing →")));
}
window.PlacesPage = PlacesPage;
