window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["where-to-eat-yosemite"] = function WhereToEatYosemiteBody() {
  var TOC = [["#sec-0-is-there-food-in-yosemite-national-park", "Food in the park"], ["#sec-1-where-to-eat-in-yosemite-valley", "The Valley"], ["#sec-2-wawona-fish-camp-and-the-south-end-of-th", "Wawona and Fish Camp"], ["#sec-3-tuolumne-meadows-and-the-high-country", "Tuolumne"], ["#sec-4-yosemite-west-restaurants-there-are-none", "Yosemite West"], ["#sec-5-restaurants-near-yosemite-the-gateway-to", "Gateway towns"], ["#sec-6-everything-that-exists-by-area", "Every kitchen"], ["#sec-7-the-short-version-by-area", "The table"], ["#sec-8-can-you-bring-your-own-food-into-yosemit", "Your own food"], ["#sec-9-what-closes-and-when", "What closes"], ["#where-to-eat-questions", "Questions"]];
  var FAQ = [["Where can I get a quick meal in Yosemite Valley?", "Curry Village Pizza Deck, Base Camp Eatery at Yosemite Valley Lodge, and Degnan's Kitchen in Yosemite Village are convenient options. Check current hours before relying on an early breakfast or late dinner."], ["Where can I book a sit-down dinner in Yosemite Valley?", "The Mountain Room at Yosemite Valley Lodge and The Ahwahnee Dining Room are options. Book ahead and check the concessioner's current menus, prices, and reservation details."], ["Are there restaurants in Yosemite West?", "No. Yosemite West has no restaurant, store, gas station, or shuttle. Shop before arriving. Yosemite Valley is roughly forty minutes each way, or Wawona is about half an hour south."], ["Is there food at Tuolumne Meadows in fall?", "Service is seasonal. The concessioner's 2026 schedule lists September 13 as the lodge dining room's last day and September 20 for the grill. Pack lunch for a Tioga Road day; an open road does not mean an open kitchen."], ["Is the Wawona Hotel dining room open?", "The Wawona Hotel and its dining room are closed for a condition assessment. Check the NPS hotel notice for reopening updates. The Wawona General Store is a grocery and picnic-supply option."], ["Where should I eat near Yosemite?", "Choose restaurants near your route or lodging. The guide recommends 1850, Smokin Oak BBQ, and Tacos Sonora in Mariposa; South Gate Brewing Company and The Elderberry House in Oakhurst; and Latte Da Cafe in Lee Vining. Check current hours before making a special trip."]];
  var PARK_W = 1760,
    PARK_H = 1410;
  var PARK_SPOTS = [{
    at: [686, 659],
    side: "r",
    tone: "full",
    name: "Yosemite Valley",
    note: "Counters, decks and dining rooms"
  }, {
    at: [1169, 321],
    side: "b",
    tone: "seasonal",
    name: "Tuolumne Meadows",
    note: "Store, grill, lodge. Closes in September"
  }, {
    at: [231, 646],
    side: "r",
    tone: "store",
    name: "Crane Flat",
    note: "Small market"
  }, {
    at: [263, 856],
    side: "t",
    tone: "town",
    name: "El Portal",
    note: "A market and four restaurants"
  }, {
    at: [426, 921],
    side: "r",
    tone: "none",
    name: "Yosemite West",
    note: "No restaurant, no store, no gas"
  }, {
    at: [536, 1229],
    side: "t",
    tone: "store",
    name: "Wawona",
    note: "General store. Hotel dining closed"
  }, {
    at: [563, 1335],
    side: "r",
    tone: "town",
    name: "Fish Camp",
    note: "Embers, Jackalopes, two markets"
  }, {
    at: [1648, 95],
    side: "l",
    tone: "town",
    name: "Lee Vining",
    note: "Latte Da Cafe"
  }, {
    at: [16, 905],
    side: "d",
    tone: "town",
    name: "Mariposa",
    note: "Highway 140, off the map"
  }, {
    at: [16, 470],
    side: "r",
    tone: "town",
    name: "Groveland",
    note: "Highway 120, off the map"
  }, {
    at: [575, 1392],
    side: "ul",
    tone: "town",
    name: "Oakhurst",
    note: "Highway 41, off the map"
  }];
  var TONES = [["full", "Most choice"], ["seasonal", "Summer only"], ["store", "A store, not a kitchen"], ["none", "Nothing at all"], ["town", "Gateway town with restaurants"]];
  var pct = (x, y, w, h) => ({
    left: x / w * 100 + "%",
    top: y / h * 100 + "%"
  });
  function ParkFoodMap() {
    return React.createElement("figure", {
      className: "eat-map eat-map--park"
    }, React.createElement("div", {
      className: "eat-map__frame"
    }, React.createElement(ResponsiveImage, {
      image: "img/nps-yosemite-stay-map.jpg",
      className: "eat-map__img",
      sizes: "(max-width: 880px) 100vw, 620px",
      style: {
        aspectRatio: "1760 / 1410"
      },
      alt: "National Park Service map of Yosemite, cropped from Hetch Hetchy south to the Mariposa Grove, marking where food is: Yosemite Valley has the most, Tuolumne Meadows is open in summer only, Crane Flat and Wawona have stores, Yosemite West has nothing, and El Portal, Fish Camp, Lee Vining, Mariposa, Groveland and Oakhurst are gateway towns with restaurants."
    }), React.createElement("div", {
      className: "eat-map__layer",
      "aria-hidden": "true"
    }, PARK_SPOTS.map(s => React.createElement("span", {
      key: s.name,
      className: "eat-spot eat-spot--" + s.side + " is-" + s.tone,
      style: pct(s.at[0], s.at[1], PARK_W, PARK_H)
    }, React.createElement("i", null), React.createElement("b", null, s.name), React.createElement("small", null, s.note))))), React.createElement("figcaption", null, React.createElement("ul", {
      className: "eat-key"
    }, TONES.map(([t, label]) => React.createElement("li", {
      key: t,
      className: "is-" + t
    }, label))), React.createElement("span", null, "Map: National Park Service (public domain), cropped.")));
  }
  var VALLEY_W = 840,
    VALLEY_H = 500;
  var VALLEY_PINS = [{
    n: "1",
    at: [600, 372],
    name: "Curry Village"
  }, {
    n: "2",
    at: [176, 272],
    name: "Yosemite Valley Lodge"
  }, {
    n: "3",
    at: [385, 145],
    name: "Yosemite Village"
  }, {
    n: "4",
    at: [563, 175],
    name: "The Ahwahnee"
  }];
  function ValleyFoodMap() {
    return React.createElement("figure", {
      className: "eat-map eat-map--valley"
    }, React.createElement("div", {
      className: "eat-map__frame"
    }, React.createElement("img", {
      src: "/img/nps-valley-dining-map.jpg",
      width: "840",
      height: "500",
      loading: "lazy",
      decoding: "async",
      className: "eat-map__img",
      alt: "National Park Service map of the east end of Yosemite Valley with the four places to eat marked: Curry Village on the south side, Yosemite Valley Lodge to the west below Yosemite Falls, Yosemite Village beside the visitor center, and The Ahwahnee to the east."
    }), React.createElement("div", {
      className: "eat-map__layer",
      "aria-hidden": "true"
    }, VALLEY_PINS.map(p => React.createElement("span", {
      key: p.n,
      className: "eat-pin",
      style: pct(p.at[0], p.at[1], VALLEY_W, VALLEY_H)
    }, React.createElement("b", null, p.n))))), React.createElement("figcaption", null, VALLEY_PINS.map(p => React.createElement("span", {
      key: p.n,
      className: "eat-map__num"
    }, React.createElement("b", null, p.n), " ", p.name)), React.createElement("span", null, "Map: National Park Service (public domain), cropped.")));
  }
  function Price({
    n
  }) {
    return React.createElement("span", {
      className: "eat-price",
      role: "img",
      "aria-label": "Price " + "$".repeat(n) + " of $$$$"
    }, [1, 2, 3, 4].map(i => React.createElement("span", {
      key: i,
      className: i <= n ? "is-on" : undefined,
      "aria-hidden": "true"
    }, "$")));
  }
  function Cluster({
    n,
    name,
    photo,
    ratio,
    alt,
    credit,
    focus,
    children
  }) {
    return React.createElement("article", {
      className: "eat-cluster"
    }, photo ? React.createElement("figure", {
      className: "eat-cluster__photo"
    }, React.createElement(ResponsiveImage, {
      image: photo,
      alt: alt,
      sizes: "(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 46vw, 560px",
      style: {
        aspectRatio: ratio,
        objectPosition: focus || undefined
      }
    }), React.createElement("figcaption", null, credit)) : null, React.createElement("div", {
      className: "eat-cluster__body"
    }, React.createElement("p", {
      className: "eat-cluster__head"
    }, React.createElement("span", {
      className: "eat-cluster__num"
    }, n), name), React.createElement("ul", {
      className: "eat-kitchens"
    }, children)));
  }
  function Kitchen({
    name,
    meal,
    price,
    res,
    pick,
    children
  }) {
    return React.createElement("li", {
      className: "eat-kitchen" + (pick ? " is-pick" : "")
    }, React.createElement("div", {
      className: "eat-kitchen__top"
    }, React.createElement("h3", null, name), pick && React.createElement("span", {
      className: "eat-badge"
    }, pick)), React.createElement("p", null, children), (meal || price || res) && React.createElement("p", {
      className: "eat-kitchen__chips"
    }, meal && React.createElement("span", {
      className: "eat-chip"
    }, meal), price ? React.createElement(Price, {
      n: price
    }) : null, res && React.createElement("span", {
      className: "eat-chip eat-chip--res is-" + res.toLowerCase().split(" ")[0]
    }, res === "No" ? "No reservations" : "Reservations: " + res.toLowerCase())));
  }
  var TABLE = [["Curry Village Pizza Deck", "Yosemite Valley", "valley", "Lunch, dinner", 2, "Most of the year", "No"], ["Base Camp Eatery", "Yosemite Valley", "valley", "All three", 2, "Year-round", "No"], ["Degnan's Kitchen", "Yosemite Valley", "valley", "Breakfast, lunch", 1, "Year-round", "No"], ["Meadow Grill Taqueria", "Yosemite Valley", "valley", "Lunch, dinner", 1, "Summer", "No"], ["The Mountain Room", "Yosemite Valley", "valley", "Dinner", 3, "Most of the year", "Advised"], ["The Ahwahnee Dining Room", "Yosemite Valley", "valley", "Check current menu", 4, "Year-round", "Required"], ["Wawona General Store", "Wawona", "south", "Groceries, sandwiches", 1, "Year-round", "No"], ["Embers at Tenaya Lodge", "Fish Camp", "south", "Dinner", 3, "Year-round", "Advised"], ["Tuolumne store and grill", "Tioga Road", "tioga", "Counter", 1, "Summer, closes September", "No"], ["Tuolumne Meadows Lodge", "Tioga Road", "tioga", "Breakfast, dinner", 2, "Summer, closes September", "Required for dinner"], ["1850 Restaurant & Brewing", "Mariposa", "towns", "Dinner", 2, "Year-round, closed Mon and Tue", "No"], ["Smokin Oak BBQ", "Mariposa", "towns", "Lunch, dinner", 2, "Year-round, closed Mon and Tue", "No"], ["Tacos Sonora", "Mariposa", "towns", "Lunch", 1, "Year-round, closed Sun", "No"], ["Cedar House Restaurant", "El Portal", "towns", "Dinner", 2, "Year-round", "No"], ["June Bug Cafe", "Midpines", "towns", "Breakfast, dinner", 2, "Year-round", "No"], ["South Gate Brewing Co.", "Oakhurst", "towns", "Dinner", 2, "Year-round, open daily", "No"], ["The Elderberry House", "Oakhurst", "towns", "Check current menu", 4, "Year-round", "Required"], ["Latte Da Cafe", "Lee Vining", "towns", "Breakfast, coffee", 1, "Seasonal", "No"]];
  var TABLE_FILTERS = [["all", "Everywhere"], ["valley", "The Valley"], ["south", "Wawona and Fish Camp"], ["tioga", "Tioga Road"], ["towns", "Gateway towns"]];
  var [area, setArea] = React.useState("all");
  var rows = TABLE.filter(r => area === "all" || r[2] === area);
  var ROSTER = [{
    area: "Mariposa",
    items: ["1850", "Alley", "California Commissary", "Castillo's", "Charles Street", "Cinnamon Roll Bakery", "Don Rubens Mexican", "Falaf-a-lot at Grove House", "Fredrick's of Savourys", "Gold Cup Creamery", "Grove House", "Happy Burger", "Hideout", "High Country Cafe", "Jantz Bakery", "Little Shop of Ramen", "Local Grape", "Miners Roadhouse 140", "Nayos Mexican Food", "Pizza Factory", "Pony Expresso", "the Senior Center", "Smokin' Oak BBQ", "Starbucks", "Sticks Coffee House", "Subway", "Twisted Cedar"],
    extra: ["Pioneer Market Deli", "Short Stop Sandwich", "Stage Stop Deli", "Take and Bake"],
    extraLabel: "Mainly takeout"
  }, {
    area: "Yosemite Valley",
    items: ["Seven Tents Pavilion", "Bar 1899", "Coffee Corner", "the pizza counter", "the Taqueria at Meadow Grill", "Degnan's Kitchen", "the Village Grill", "Base Camp Eatery", "Starbucks", "the Mountain Room and its lounge", "the Ahwahnee dining room and bar"],
    note: "Five at Curry Village, two in Yosemite Village, three at the Lodge, and The Ahwahnee. More than it feels like when you're standing in line at one of them."
  }, {
    area: "El Portal",
    items: ["Canyon Bar", "Cedar House Restaurant", "River Restaurant", "Parkside Pizza"]
  }, {
    area: "Highway 140",
    items: ["the Chevron (Catheys Valley)", "June Bug Cafe at the Yosemite Bug (Midpines)", "Bootjack Market", "Sierra Cider", "Steve's Sportsman's Cafe"],
    note: "Catheys Valley has the Chevron, and that's the whole list, which is worth knowing at 10 p.m. The June Bug is the one stop on this stretch people drive to on purpose. The last three are up Triangle Road in Bootjack."
  }, {
    area: "Highway 132, Coulterville",
    items: ["Copperpot Cafe", "Coulter Cafe", "Main Street Deli", "Cerritos Goods (takeout)"],
    note: "Coulterville and Greeley Hill, on the road toward the Big Oak Flat entrance from the north. Four places across two villages is the whole supply on it."
  }, {
    area: "Tuolumne and the south",
    items: ["Tuolumne Lodge", "Wawona General Store", "Embers", "Jackalopes", "Pine Tree Market", "Fish Camp General Store"],
    note: "Tuolumne Lodge is on Tioga Road and the Wawona store at the south end. The last four are over the Madera County line in Fish Camp; Embers and Jackalopes are at Tenaya Lodge."
  }];
  var TRUCKS = ["All About the Wurst", "Birrieria El Campeon", "Dixon's Fixin's", "Fishworks", "L & J Mexican Food", "the Lemon Drop Trailer", "Mariposa Sips & Sweets", "Sal's Taco Truck", "the Tacos Sonora truck", "Yosemite Pizza"];
  var DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  function Week({
    closed,
    label,
    notes
  }) {
    return React.createElement("div", {
      className: "eat-week"
    }, React.createElement("ol", {
      "aria-label": label
    }, DAYS.map(d => React.createElement("li", {
      key: d,
      className: closed.indexOf(d) >= 0 ? "is-closed" : undefined
    }, React.createElement("span", null, d), notes && notes[d] ? React.createElement("small", null, notes[d]) : null))));
  }
  function TownPick({
    name,
    week,
    weekLabel,
    weekNotes,
    meta,
    children
  }) {
    return React.createElement("article", {
      className: "eat-pick"
    }, React.createElement("h4", null, name), meta && React.createElement("p", {
      className: "eat-pick__meta"
    }, meta), React.createElement("p", {
      className: "eat-pick__text"
    }, children), week && React.createElement(Week, {
      closed: week,
      label: weekLabel,
      notes: weekNotes
    }));
  }
  return React.createElement("div", {
    className: "eat-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "food"
  }), React.createElement("dt", null, "Most choice"), React.createElement("dd", null, "Yosemite Valley, by a long way")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "car"
  }), React.createElement("dt", null, "Anywhere else"), React.createElement("dd", null, "Plan on a drive or a cooler")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("dt", null, "After 9 p.m."), React.createElement("dd", null, "Assume every kitchen is shut")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "Before you go"), React.createElement("dd", null, "Check hours in the Park Bulletin"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section eat-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "For a quick meal in Yosemite Valley, go to the Curry Village Pizza Deck, Base Camp Eatery or Degnan's Kitchen. For a sit-down dinner, book the Mountain Room or The Ahwahnee. Outside the Valley, eat near your route or pack a cooler, because seasonal kitchens close while the roads are still open."), React.createElement("p", null, "I live in El Portal and eat at the places on this page. These are my own picks. No restaurant paid to be here, and none of the restaurant links earn anything. Hours move with the season, so check ", React.createElement("a", {
    href: "/now"
  }, "current dining hours in the Park Bulletin"), " before you make a special trip."), React.createElement("p", null, "Below: what each part of the park has, the Valley's kitchens one by one, the gateway towns, the full county list, a table, and what closes when.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "food"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "After a hike: pizza on the Curry Village deck."), React.createElement("li", null, "A dinner to remember: the Mountain Room or The Ahwahnee. Book ahead."), React.createElement("li", null, "A Tioga Road day: pack lunch. Tuolumne closes in September."), React.createElement("li", null, "Staying in Yosemite West: shop before you arrive. There is nothing there."), React.createElement("li", null, "Every other lunch: a sandwich on a granite slab by the river.")), React.createElement("a", {
    className: "eat-short__link",
    href: "/now"
  }, "What's open this edition, on the Park Bulletin ↗")))), React.createElement("section", {
    className: "ff-band",
    id: "sec-0-is-there-food-in-yosemite-national-park",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "IS THERE FOOD IN YOSEMITE?"), React.createElement("h2", null, "Yes, and almost all of it is in the Valley"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Yosemite Valley"), " has the park's only real cluster of food: counters, decks and dining rooms in Yosemite Village, at Yosemite Valley Lodge and around Curry Village. Leave the Valley and the choices thin out fast. ", React.createElement("strong", null, "Wawona"), " has a general store. ", React.createElement("strong", null, "Tuolumne Meadows"), ", up on Tioga Road, has a seasonal store and grill and the dining tent at Tuolumne Meadows Lodge, and all of them close in September. ", React.createElement("strong", null, "Crane Flat"), " and ", React.createElement("strong", null, "El Portal"), " have small markets. ", React.createElement("strong", null, "Yosemite West"), " has vacation rentals and nothing else: no restaurant, no store, no gas.")), React.createElement("div", {
    className: "eat-rules"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "Staying outside the Valley?"), React.createElement("p", null, "Plan on a drive or a cooler.")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock",
    size: 26
  }), React.createElement("strong", null, "Arriving after about 9 p.m.?"), React.createElement("p", null, "Assume everything is shut. This is a national park, not a town, and the kitchens keep park hours.")))), React.createElement(ParkFoodMap, null))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-1-where-to-eat-in-yosemite-valley",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHERE TO EAT IN YOSEMITE VALLEY"), React.createElement("h2", null, "Four clusters, one Valley"), React.createElement("p", {
    className: "ff-lede"
  }, "The Valley's food sits in four places: Curry Village, Yosemite Valley Lodge, Yosemite Village and The Ahwahnee. Pick by what you need, then head to the cluster that has it."), React.createElement("dl", {
    className: "eat-need"
  }, React.createElement("div", null, React.createElement("dt", null, "After a hike"), React.createElement("dd", null, "Curry Village Pizza Deck")), React.createElement("div", null, React.createElement("dt", null, "Everyone wants something different"), React.createElement("dd", null, "Base Camp Eatery")), React.createElement("div", null, React.createElement("dt", null, "You forgot lunch"), React.createElement("dd", null, "Degnan's Kitchen")), React.createElement("div", null, React.createElement("dt", null, "Hot food near a trailhead"), React.createElement("dd", null, "Meadow Grill Taqueria")), React.createElement("div", null, React.createElement("dt", null, "Coffee before the Mist Trail"), React.createElement("dd", null, "Coffee Corner")), React.createElement("div", null, React.createElement("dt", null, "Dinner facing Yosemite Falls"), React.createElement("dd", null, "The Mountain Room")), React.createElement("div", null, React.createElement("dt", null, "A special occasion"), React.createElement("dd", null, "The Ahwahnee Dining Room")), React.createElement("div", null, React.createElement("dt", null, "The shortest coffee line"), React.createElement("dd", null, "Starbucks, at Base Camp")))), React.createElement(ValleyFoodMap, null)), React.createElement("div", {
    className: "eat-clusters"
  }, React.createElement(Cluster, {
    n: "1",
    name: "Curry Village",
    photo: "img/curry-village.jpg",
    ratio: "1600 / 1072",
    focus: "50% 60%",
    alt: "Wooden cabins at Curry Village among pines and granite boulders",
    credit: "Curry Village cabins. Photo: US National Park Service / Wikimedia Commons (public domain)"
  }, React.createElement(Kitchen, {
    name: "Pizza Deck",
    meal: "Lunch, dinner",
    price: 2,
    res: "No",
    pick: "My first pick"
  }, "Pizza on an outdoor deck facing Glacier Point Apron, and my first stop after a hike. Expect a line on summer evenings. The menu changes, so check it when you arrive; the Half Dome pizza is my pick when they have it."), React.createElement(Kitchen, {
    name: "Meadow Grill Taqueria",
    meal: "Lunch, dinner",
    price: 1,
    res: "No"
  }, "Tacos and burritos at the counter by the Village Store, beside the deck, with outdoor seating. It is the shortest path from a trailhead to a hot meal on the Valley floor, and usually the first Valley kitchen to close when summer ends."), React.createElement(Kitchen, {
    name: "Coffee Corner"
  }, "Opens early. It is why you don't have to drive to Yosemite Village for coffee before a Mist Trail start."), React.createElement(Kitchen, {
    name: "Bar 1899"
  }, "The small indoor bar."), React.createElement(Kitchen, {
    name: "Seven Tents Pavilion"
  }, "The big buffet hall, mostly for the tent-cabin guests."), React.createElement("li", {
    className: "eat-kitchens__note"
  }, "Four operations share one compound, and people lump them together. That is why most visitors think Curry Village has a pizza deck and nothing else. All four are seasonal to some degree.")), React.createElement(Cluster, {
    n: "2",
    name: "Yosemite Valley Lodge",
    photo: "img/yosemite-valley-lodge-entrance.jpg",
    ratio: "1600 / 1200",
    alt: "The front entrance of Yosemite Valley Lodge under tall pines",
    credit: "Yosemite Valley Lodge. Photo: Rennett Stowe / Wikimedia Commons (CC BY 2.0)"
  }, React.createElement(Kitchen, {
    name: "Base Camp Eatery",
    meal: "All three",
    price: 2,
    res: "No"
  }, "Counter service for breakfast, lunch or dinner, with seating inside and out. Useful when your group wants different meals from one stop. Check ", React.createElement("a", {
    href: "https://www.travelyosemite.com/dining/yosemite-valley-lodge"
  }, "the lodge's dining hours"), " before you count on an early breakfast or a late dinner."), React.createElement(Kitchen, {
    name: "The Mountain Room",
    meal: "Dinner",
    price: 3,
    res: "Advised",
    pick: "The view"
  }, "The Valley's sit-down dinner short of The Ahwahnee: a real dining room with a wall of glass facing Yosemite Falls. Book in summer, and time it for the falls, because the view is the reason to go."), React.createElement(Kitchen, {
    name: "Starbucks"
  }, "Inside Base Camp Eatery since 2018, and no food decision the park has made drew more letters. It's a Starbucks. When the Degnan's counter is twenty deep, it has the shortest line in the Valley, and that's the whole case for it.")), React.createElement(Cluster, {
    n: "3",
    name: "Yosemite Village"
  }, React.createElement(Kitchen, {
    name: "Degnan's Kitchen",
    meal: "Breakfast, lunch",
    price: 1,
    res: "No"
  }, "Sandwiches, coffee and food to carry out. If you forgot lunch, ", React.createElement("a", {
    href: "/map?stop=degnans-deli"
  }, "Degnan's"), " is the fallback. Check current hours, and don't assume the upstairs Loft is open."), React.createElement(Kitchen, {
    name: "Village Grill"
  }, "On the county list, in Yosemite Village.")), React.createElement(Cluster, {
    n: "4",
    name: "The Ahwahnee",
    photo: "img/ahwahnee-hotel.jpg",
    ratio: "1600 / 1200",
    alt: "The Ahwahnee hotel in winter, its stone and timber front below the Valley's north wall",
    credit: "The Ahwahnee. Photo: Chris Dunstan / Wikimedia Commons (public domain)"
  }, React.createElement(Kitchen, {
    name: "The Ahwahnee Dining Room",
    meal: "Check current menu",
    price: 4,
    res: "Required",
    pick: "Special occasion"
  }, "My pick for a special-occasion meal in the Valley. Book ahead, and check the ", React.createElement("a", {
    href: "https://www.travelyosemite.com/dining/yosemite-dining-experience"
  }, "concessioner's current menu, prices and reservation details"), ". The tall windows and granite piers are part of the reason to come, so give the meal time."), React.createElement(Kitchen, {
    name: "The bar"
  }, "On the county list, with the dining room.")))), React.createElement("section", {
    className: "ff-band",
    id: "sec-2-wawona-fish-camp-and-the-south-end-of-th",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WAWONA, FISH CAMP AND THE SOUTH END"), React.createElement("h2", null, "A store in the park, dinner two miles past the gate"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "The ", React.createElement("strong", null, "Wawona General Store"), " is a grocery and picnic-supply stop near the Mariposa Grove. ", React.createElement("strong", null, "The Wawona Hotel and its dining room are closed"), " for a condition assessment. That is a closure, not a short break. Check ", React.createElement("a", {
    href: "https://www.nps.gov/places/000/wawona-hotel.htm"
  }, "the NPS hotel notice"), " for news of a reopening."), React.createElement("p", null, "Two miles south of the gate, ", React.createElement("strong", null, "Fish Camp"), " covers what Wawona does not, and it is closer than most people staying at the south end realize. ", React.createElement("strong", null, "Embers"), " at Tenaya Lodge is the sit-down dinner and the nearest real restaurant to the Mariposa Grove. ", React.createElement("strong", null, "Jackalopes"), ", the bar in the same building, takes walk-ins when Embers is booked. The ", React.createElement("strong", null, "Pine Tree Market"), " and the ", React.createElement("strong", null, "Fish Camp General Store"), " cover groceries and a sandwich. Past that, you're driving to Oakhurst, fifteen more minutes down Highway 41."))), React.createElement("div", null, React.createElement("h3", {
    className: "eat-subhead"
  }, "Down Highway 41, north to south"), React.createElement("ol", {
    className: "eat-road"
  }, React.createElement("li", null, React.createElement("span", null, "Wawona"), React.createElement("strong", null, "Wawona General Store"), React.createElement("p", null, "Groceries, sandwiches, picnic supplies.")), React.createElement("li", {
    className: "is-closed"
  }, React.createElement("span", null, "Wawona"), React.createElement("strong", null, "Wawona Hotel dining room"), React.createElement("p", null, "Closed for a condition assessment.")), React.createElement("li", {
    className: "is-gate"
  }, React.createElement("span", null, "The South Entrance"), React.createElement("strong", null, "You leave the park")), React.createElement("li", null, React.createElement("span", null, "Fish Camp, 2 miles on"), React.createElement("strong", null, "Embers, at Tenaya Lodge"), React.createElement("p", null, "Sit-down dinner. Reservations advised.")), React.createElement("li", null, React.createElement("span", null, "Same building"), React.createElement("strong", null, "Jackalopes"), React.createElement("p", null, "The bar. Takes walk-ins when Embers is booked.")), React.createElement("li", null, React.createElement("span", null, "Fish Camp"), React.createElement("strong", null, "Pine Tree Market, Fish Camp General Store"), React.createElement("p", null, "Groceries and a sandwich.")), React.createElement("li", null, React.createElement("span", null, "15 minutes more"), React.createElement("strong", null, "Oakhurst"), React.createElement("p", null, "The next food. See the gateway towns below.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-3-tuolumne-meadows-and-the-high-country",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split eat-tuol"
  }, React.createElement("figure", {
    className: "eat-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/tuolumne-meadows-lembert-dome.jpg",
    sizes: "(max-width: 880px) calc(100vw - 40px), 600px",
    style: {
      aspectRatio: "1600 / 1067"
    },
    alt: "Lembert Dome above Tuolumne Meadows, with hikers on the granite in the foreground"
  }), React.createElement("figcaption", null, "Lembert Dome, Tuolumne Meadows. Photo: Pacific Southwest Region USFWS / Wikimedia Commons (public domain)")), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "TUOLUMNE MEADOWS AND THE HIGH COUNTRY"), React.createElement("h2", null, "Pack lunch. An open road is not an open kitchen"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "Tuolumne Meadows food service is seasonal, and its kitchens don't all close on the same day. The concessioner's ", React.createElement("a", {
    href: "https://www.travelyosemite.com/dining/tuolumne-meadows-lodge"
  }, "2026 schedule"), " lists September 13 as the lodge dining room's last day and September 20 as the grill's. See ", React.createElement("a", {
    href: "/articles/tuolumne-meadows-in-a-day"
  }, "the Tuolumne Meadows day guide"), " for the rest of the trip.")), React.createElement("ol", {
    className: "eat-cooler"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "food",
    size: 24
  }), React.createElement("strong", null, "Buy food on the way"), React.createElement("p", null, "At Crane Flat going up, or in Lee Vining coming over.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "dome",
    size: 24
  }), React.createElement("strong", null, "Eat it on a granite slab"), React.createElement("p", null, "The high country is a cooler day.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "check",
    size: 24
  }), React.createElement("strong", null, "Count anything open as a bonus"), React.createElement("p", null, "At 8,600 feet, an open kitchen is luck, not a plan.")))))), React.createElement("section", {
    className: "ff-band",
    id: "sec-4-yosemite-west-restaurants-there-are-none",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "eat-none"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YOSEMITE WEST RESTAURANTS"), React.createElement("h2", null, "There are none"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "Yosemite West is a housing tract inside the park boundary off Wawona Road, and it is almost all vacation rentals. The listings sell the location and skip the logistics, so guests are often caught short. A rental kitchen only helps if you bring the groceries. Shop before you arrive."))), React.createElement("ul", {
    className: "eat-none__list",
    "aria-label": "What Yosemite West does not have"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 28
  }), "No restaurant"), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 28
  }), "No store"), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 28
  }), "No gas station"), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 28
  }), "No shuttle")), React.createElement("dl", {
    className: "eat-none__drive"
  }, React.createElement("div", null, React.createElement("dt", null, "Nearest food"), React.createElement("dd", null, "Yosemite Valley"), React.createElement("p", null, "Roughly 40 minutes each way")), React.createElement("div", null, React.createElement("dt", null, "Or"), React.createElement("dd", null, "Wawona"), React.createElement("p", null, "About half an hour south")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-5-restaurants-near-yosemite-the-gateway-to",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "RESTAURANTS NEAR YOSEMITE"), React.createElement("h2", null, "The gateway towns, and the one place to eat in each"), React.createElement("p", {
    className: "ff-lede"
  }, "Where to base yourself is a bigger question than where to eat, and ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "the gateway towns comparison"), " answers it. This is the food half."), React.createElement("div", {
    className: "eat-towns"
  }, React.createElement("article", {
    className: "eat-town"
  }, React.createElement("figure", {
    className: "eat-town__photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/mariposa-county-courthouse.jpg",
    alt: "The white wooden Mariposa County Courthouse, built in 1854, behind a lawn",
    sizes: "(max-width: 760px) calc(100vw - 40px), 360px",
    style: {
      aspectRatio: "1600 / 1200"
    }
  }), React.createElement("figcaption", null, "Mariposa County Courthouse. Photo: Guywelch2000 / Wikimedia Commons (CC0)")), React.createElement("div", {
    className: "eat-town__body"
  }, React.createElement("p", {
    className: "eat-town__road"
  }, "Highway 140 · the western gateway"), React.createElement("h3", null, "Mariposa"), React.createElement("p", {
    className: "eat-town__line"
  }, "The most restaurants, the most parking, and a downtown you would walk after dinner. Three are worth planning around."), React.createElement("div", {
    className: "eat-picks"
  }, React.createElement(TownPick, {
    name: "1850 Restaurant & Brewing Co.",
    meta: "Dinner · $$",
    week: ["Mon", "Tue"],
    weekLabel: "1850: closed Monday and Tuesday"
  }, "The sit-down dinner in town. Wood-fired pizza, a good burger, a short list of house-brewed beers, and a patio that fills on summer evenings. Service can drag when the room is full. The food is worth the wait."), React.createElement(TownPick, {
    name: "Smokin Oak BBQ",
    meta: "Lunch, dinner · $$",
    week: ["Mon", "Tue"],
    weekLabel: "Smokin Oak BBQ: closed Monday and Tuesday"
  }, "Opened late in 2024, with the Twisted Cedar Tap House next door since early 2025, pouring mead, beer and cider. Brisket cooked the right number of hours, served on butcher paper. The sides are solid; get the slaw. Go at lunch. By 7 p.m. the brisket is often gone and you're on to the pulled pork, which is also fine."), React.createElement(TownPick, {
    name: "Tacos Sonora",
    meta: "Lunch · $ · 5034 Coakley Circle",
    week: ["Sun"],
    weekLabel: "Tacos Sonora: weekdays until 7 p.m., Saturday until 4 p.m., closed Sunday",
    weekNotes: {
      Mon: "to 7",
      Tue: "to 7",
      Wed: "to 7",
      Thu: "to 7",
      Fri: "to 7",
      Sat: "to 4"
    }
  }, "A taco truck parked for good. Fast and cheap: two carne asada tacos and a horchata, no frills, no table. A good stop after a hike.")))), React.createElement("article", {
    className: "eat-town"
  }, React.createElement("div", {
    className: "eat-town__mark"
  }, React.createElement(EventIcon, {
    name: "pin",
    size: 30
  }), React.createElement("span", null, "Last stop before Arch Rock")), React.createElement("div", {
    className: "eat-town__body"
  }, React.createElement("p", {
    className: "eat-town__road"
  }, "Highway 140 · at the park line"), React.createElement("h3", null, "El Portal"), React.createElement("p", {
    className: "eat-town__line"
  }, "More than its size suggests, and 25 minutes closer than Mariposa on a night the Valley kitchens have shut."), React.createElement("div", {
    className: "eat-picks"
  }, React.createElement(TownPick, {
    name: "Four restaurants, open to everyone",
    meta: "Dinner · $$"
  }, "The ", React.createElement("strong", null, "Cedar House Restaurant"), " and the ", React.createElement("strong", null, "Canyon Bar"), " at the Yosemite View Lodge, the ", React.createElement("strong", null, "River Restaurant"), " at the Cedar Lodge, and ", React.createElement("strong", null, "Parkside Pizza"), ". None is worth driving out of the park for, which is the only reason none made the list above. All four serve the public, not just lodge guests."), React.createElement(TownPick, {
    name: "The market",
    meta: "Groceries · fuel"
  }, "Where I shop, and the last fuel and groceries before the gate.")))), React.createElement("article", {
    className: "eat-town"
  }, React.createElement("figure", {
    className: "eat-town__photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/oakhurst-highway-41-ken-lund.jpg",
    alt: "Highway 41 through Oakhurst, with shops along the road and a forested ridge behind",
    sizes: "(max-width: 760px) calc(100vw - 40px), 360px",
    style: {
      aspectRatio: "1920 / 951",
      objectPosition: "50% 70%"
    }
  }), React.createElement("figcaption", null, "Highway 41, Oakhurst. Photo: Ken Lund / Wikimedia Commons (CC BY-SA 2.0)")), React.createElement("div", {
    className: "eat-town__body"
  }, React.createElement("p", {
    className: "eat-town__road"
  }, "Highway 41 · the southern gateway"), React.createElement("h3", null, "Oakhurst"), React.createElement("p", {
    className: "eat-town__line"
  }, "The largest gateway town, and more chain restaurants than the others combined. Skip those."), React.createElement("div", {
    className: "eat-picks"
  }, React.createElement(TownPick, {
    name: "South Gate Brewing Company",
    meta: "Dinner · $$ · open daily",
    week: [],
    weekLabel: "South Gate Brewing: open daily"
  }, "The default dinner after the park for anyone based in Oakhurst, Bass Lake or Fish Camp. Wood-fired pizza with the dough stretched to order, fish and chips in their Blonde Ale batter, a long list of their own beers, and enough seats to take a Saturday night without a two-hour wait. The vegan and gluten-free dishes are real dishes. If you're in Oakhurst asking where to eat, this is the answer."), React.createElement(TownPick, {
    name: "The Elderberry House at Chateau du Sureau",
    meta: "Prix fixe · $$$$ · reservations required well ahead"
  }, "The fine-dining choice, and the only restaurant in the region that is a destination on its own. Erna Kubin-Clanin opened it in 1984, and the kitchen still serves a multi-course prix fixe (one set menu, one set price) that changes daily, with optional wine pairings from a serious cellar. Well over $100 a person before wine. This is the anniversary dinner, or the last night.")))), React.createElement("article", {
    className: "eat-town"
  }, React.createElement("div", {
    className: "eat-town__mark"
  }, React.createElement(EventIcon, {
    name: "route",
    size: 30
  }), React.createElement("span", null, "Over Tioga Pass")), React.createElement("div", {
    className: "eat-town__body"
  }, React.createElement("p", {
    className: "eat-town__road"
  }, "US 395 · the eastern gateway"), React.createElement("h3", null, "Lee Vining"), React.createElement("p", {
    className: "eat-town__line"
  }, "The first real coffee on the route, in either direction."), React.createElement("div", {
    className: "eat-picks"
  }, React.createElement(TownPick, {
    name: "Latte Da Cafe",
    meta: "Breakfast, coffee · $ · seasonal"
  }, "The east-side breakfast and coffee stop, whether you're crossing Tioga Pass from Mammoth or Bishop or coming down from Lake Tahoe. Pastries are baked in house and the drip coffee is good. Park behind the building, walk in, eat outside.")))), React.createElement("article", {
    className: "eat-town"
  }, React.createElement("figure", {
    className: "eat-town__photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/groveland-main-street-highway-120.jpg",
    alt: "Main Street in Groveland, which is Highway 120, lined with historic storefronts",
    sizes: "(max-width: 760px) calc(100vw - 40px), 360px",
    style: {
      aspectRatio: "1600 / 1067"
    }
  }), React.createElement("figcaption", null, "Main Street, Groveland. Photo: Almonroth / Wikimedia Commons (CC BY-SA 3.0)")), React.createElement("div", {
    className: "eat-town__body"
  }, React.createElement("p", {
    className: "eat-town__road"
  }, "Highway 120 · the Big Oak Flat side"), React.createElement("h3", null, "Groveland"), React.createElement("p", {
    className: "eat-town__line"
  }, "A historic main street with the Iron Door Saloon on it, and enough places to eat for a two-night stay."), React.createElement("p", {
    className: "eat-town__aside"
  }, "It's missing from the county list below because it's in Tuolumne County, not because there's nothing there."))))), React.createElement("section", {
    className: "ff-band",
    id: "sec-6-everything-that-exists-by-area",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "EVERYTHING THAT EXISTS, BY AREA"), React.createElement("h2", null, "The county's own list"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "The picks above are opinions. This is the August 2026 revision of the Mariposa eating-out list, a single sheet kept current in the county and handed out at visitor desks and lodge counters. It records what exists and roughly where. No hours, no prices, no judgment, and being on it is not a recommendation from anybody, including me. It does one thing a review list can't: it tells you a town of four hundred people has a cafe in it at all. Names are printed as the sheet prints them where a business's own spelling is unclear."))), React.createElement("p", {
    className: "ff-alert eat-caveat"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("span", null, React.createElement("strong", null, "What it leaves out."), " The sheet covers Mariposa County plus Fish Camp, so Oakhurst, Bass Lake, Groveland and Lee Vining are absent: they are in Madera, Tuolumne and Mono counties. It also lists a few places not aimed at visitors, the Senior Center being the obvious one."))), React.createElement("div", {
    className: "eat-roster"
  }, ROSTER.map(r => React.createElement("article", {
    key: r.area,
    className: "eat-roster__area"
  }, React.createElement("p", {
    className: "eat-roster__count"
  }, r.items.length + (r.extra ? r.extra.length : 0)), React.createElement("h3", null, r.area), React.createElement("ul", {
    className: "eat-roster__names"
  }, r.items.map(n => React.createElement("li", {
    key: n
  }, n))), r.extra && React.createElement(React.Fragment, null, React.createElement("p", {
    className: "eat-roster__label"
  }, r.extraLabel), React.createElement("ul", {
    className: "eat-roster__names"
  }, r.extra.map(n => React.createElement("li", {
    key: n
  }, n)))), r.note && React.createElement("p", {
    className: "eat-roster__note"
  }, r.note))), React.createElement("article", {
    className: "eat-roster__area eat-roster__area--trucks"
  }, React.createElement("p", {
    className: "eat-roster__count"
  }, TRUCKS.length), React.createElement("h3", null, "Trucks and pop-ups"), React.createElement("ul", {
    className: "eat-roster__names"
  }, TRUCKS.map(n => React.createElement("li", {
    key: n
  }, n))), React.createElement("p", {
    className: "eat-roster__note"
  }, "The part of the food scene no visitor finds by searching. Trucks move, so a name is all you get here. Look at the county fairgrounds, the Saturday farmers market and the brewery patios, in that order.")), React.createElement("article", {
    className: "eat-roster__area eat-roster__area--catering"
  }, React.createElement("p", {
    className: "eat-roster__count"
  }, "15"), React.createElement("h3", null, "Caterers"), React.createElement("p", {
    className: "eat-roster__note"
  }, "The same sheet has a catering column: fifteen operators working the county. It's the answer nobody has when a group trip turns into dinner for twenty or a small wedding turns real. If that's your trip, ", React.createElement("a", {
    href: "/articles/where-to-propose-in-yosemite"
  }, "the proposal guide"), " covers the venue half."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-7-the-short-version-by-area",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE SHORT VERSION, BY AREA"), React.createElement("h2", null, "Every pick in one table"), React.createElement("div", {
    className: "eat-filter",
    role: "group",
    "aria-label": "Show restaurants in"
  }, TABLE_FILTERS.map(([k, label]) => React.createElement("button", {
    key: k,
    type: "button",
    className: "eat-filter__chip" + (area === k ? " is-on" : ""),
    "aria-pressed": area === k,
    onClick: () => setArea(k)
  }, label))), React.createElement("div", {
    className: "eat-table-wrap"
  }, React.createElement("table", {
    className: "eat-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Where"), React.createElement("th", {
    scope: "col"
  }, "Area"), React.createElement("th", {
    scope: "col"
  }, "Meal"), React.createElement("th", {
    scope: "col"
  }, "Price"), React.createElement("th", {
    scope: "col"
  }, "Season"), React.createElement("th", {
    scope: "col"
  }, "Reservations"))), React.createElement("tbody", null, rows.map(([name, where,, meal, price, season, res]) => React.createElement("tr", {
    key: name
  }, React.createElement("th", {
    scope: "row",
    "data-label": "Where"
  }, name), React.createElement("td", {
    "data-label": "Area"
  }, where), React.createElement("td", {
    "data-label": "Meal"
  }, meal), React.createElement("td", {
    "data-label": "Price"
  }, React.createElement(Price, {
    n: price
  })), React.createElement("td", {
    "data-label": "Season"
  }, React.createElement("span", {
    className: "eat-season" + (/Summer|Seasonal/.test(season) ? " is-summer" : "")
  }, season)), React.createElement("td", {
    "data-label": "Reservations"
  }, React.createElement("span", {
    className: "eat-chip eat-chip--res is-" + res.toLowerCase().split(" ")[0]
  }, res))))))), React.createElement("p", {
    className: "ff-note"
  }, "Hours and closing days move with the season and with staffing, and the concessioner's hours in the park change more than the towns' do. ", React.createElement("a", {
    href: "/now"
  }, "The Park Bulletin"), " carries what is open in the current ", React.createElement("em", null, "Yosemite Guide"), " edition. Read the table as the general shape, not today's schedule.")), React.createElement("section", {
    className: "ff-band",
    id: "sec-8-can-you-bring-your-own-food-into-yosemit",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "CAN YOU BRING YOUR OWN FOOD?"), React.createElement("h2", null, "Yes, and on most trips you should"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "Nothing limits bringing food into the park: no inspection at the gate, no rule against a cooler. The rule that does exist is about ", React.createElement("strong", null, "storage"), ", and it is federal law, not advice. To a bear, food means anything with a scent. ", React.createElement("a", {
    href: "/articles/yosemite-bears-safety-guide"
  }, "The bear guide"), " covers what happens when people get this wrong, and ", React.createElement("a", {
    href: "/articles/pack-your-car-for-yosemite"
  }, "the packing piece"), " covers the cooler."))), React.createElement(NatureNotesFilm, {
    id: "black-bears",
    title: "Black Bears",
    youtubeId: "ijIePq9gGfo",
    episode: 26,
    note: "The animal the storage rule is written for.",
    location: "article"
  })), React.createElement("ul", {
    className: "ff-rules eat-bear"
  }, React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "users",
    size: 26
  }), React.createElement("strong", null, "By day"), React.createElement("p", null, "Food stays within arm's reach.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "bed",
    size: 26
  }), React.createElement("strong", null, "At night"), React.createElement("p", null, "Food goes into a bear locker.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "Never"), React.createElement("p", null, "In a car overnight, or in a truck bed.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "alert",
    size: 26
  }), React.createElement("strong", null, "What counts as food"), React.createElement("p", null, "Anything with a scent, which includes trash, sunscreen and toothpaste."))))), React.createElement("div", {
    className: "eat-slab"
  }, React.createElement(ResponsiveImage, {
    image: "img/cathedral-beach-quiet-picnic.jpg",
    className: "eat-slab__img",
    sizes: "100vw",
    style: {
      aspectRatio: "1600 / 1067"
    },
    alt: "The Merced River at Cathedral Beach, still and green, reflecting Cathedral Rocks and the pines"
  }), React.createElement("div", {
    className: "hp-wrap eat-slab__copy"
  }, React.createElement("blockquote", {
    className: "eat-slab__quote"
  }, "The best lunch in Yosemite is a sandwich you made in a parking lot, eaten on a granite slab beside the Merced."), React.createElement("p", {
    className: "eat-slab__text"
  }, "It costs four dollars and saves you an hour in line.")), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Cathedral Beach. Photo: Todd Petrie / Wikimedia Commons (CC BY 2.0)")), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-9-what-closes-and-when",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT CLOSES, AND WHEN"), React.createElement("h2", null, "Check each kitchen on its own"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "Valley restaurants change their hours as the season winds down, and the high country shuts completely. Check ", React.createElement("a", {
    href: "https://www.travelyosemite.com/dining/yosemite-dining-experience"
  }, "Yosemite Hospitality's dining pages"), " and the ", React.createElement("a", {
    href: "/now"
  }, "Park Bulletin"), " shortly before your visit. ", React.createElement("a", {
    href: "/articles/yosemite-in-winter"
  }, "The winter guide"), " has the rest of the cold-season picture."))), React.createElement("div", {
    className: "eat-winter"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "OCTOBER TO MAY"), React.createElement("div", {
    className: "eat-winter__grid"
  }, React.createElement("div", {
    className: "is-open"
  }, React.createElement("strong", null, "The Valley"), React.createElement("p", null, "Keeps a real core open: Degnan's, Base Camp and the hotel dining rooms among them.")), React.createElement("div", {
    className: "is-closed"
  }, React.createElement("strong", null, "The high country"), React.createElement("p", null, "Nothing at all. Tioga Road is closed anyway."))), React.createElement("p", {
    className: "ff-note"
  }, "Check what is actually open before you plan a meal around it."))), React.createElement("ol", {
    className: "ff-timeline eat-timeline"
  }, React.createElement("li", {
    className: "is-gone"
  }, React.createElement("span", null, "Sep 13, 2026"), React.createElement("strong", null, "Tuolumne Meadows Lodge"), React.createElement("p", null, "The dining room's last day on the published schedule.")), React.createElement("li", {
    className: "is-gone"
  }, React.createElement("span", null, "Sep 20, 2026"), React.createElement("strong", null, "Tuolumne grill"), React.createElement("p", null, "The grill's last day on the published schedule.")), React.createElement("li", {
    className: "is-tight"
  }, React.createElement("span", null, "As summer ends"), React.createElement("strong", null, "Meadow Grill Taqueria"), React.createElement("p", null, "Usually the first Valley kitchen to close.")), React.createElement("li", {
    className: "is-tight"
  }, React.createElement("span", null, "Through the fall"), React.createElement("strong", null, "Valley hours"), React.createElement("p", null, "Restaurants change their hours as the season winds down.")))), React.createElement("section", {
    className: "ff-band",
    id: "sec-10-the-takeaway",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE TAKEAWAY"), React.createElement("h2", null, "Food is not the point of a Yosemite trip"), React.createElement("ol", {
    className: "eat-plan"
  }, React.createElement("li", null, React.createElement("span", null, "Every day"), React.createElement("strong", null, "Pack a cooler")), React.createElement("li", null, React.createElement("span", null, "One night"), React.createElement("strong", null, "Pizza at Curry Village")), React.createElement("li", null, React.createElement("span", null, "One night"), React.createElement("strong", null, "Brisket in Mariposa")), React.createElement("li", null, React.createElement("span", null, "One morning"), React.createElement("strong", null, "Coffee in Lee Vining")), React.createElement("li", null, React.createElement("span", null, "Every other lunch"), React.createElement("strong", null, "A granite slab next to the river"))), React.createElement("p", {
    className: "eat-further"
  }, "For where to base yourself, see ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "Yosemite gateway towns compared"), " and ", React.createElement("a", {
    href: "/articles/where-to-stay-in-yosemite"
  }, "the lodging guide"), ". For one-day and two-day plans, see ", React.createElement("a", {
    href: "/articles/yosemite-in-one-or-two-days"
  }, "One day or two in Yosemite"), ". For what a trip really costs, see ", React.createElement("a", {
    href: "/articles/yosemite-trip-cost-budget-2026"
  }, "the budget breakdown"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "where-to-eat-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Eating in Yosemite, answered"), React.createElement("div", {
    className: "eat-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/dining/yosemite-dining-experience",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Dining in Yosemite, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/dining/tuolumne-meadows-lodge",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tuolumne Meadows Lodge dining, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/places/000/wawona-hotel.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Wawona Hotel, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "/now"
  }, "The Park Bulletin, this edition's hours"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))));
};
