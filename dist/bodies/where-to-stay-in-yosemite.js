window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["where-to-stay-in-yosemite"] = function WhereToStayInYosemiteBody() {
  var TY = "https://www.travelyosemite.com/lodging/";
  var TOC = [["#inside-the-boundary", "Every bed"], ["#sec-0-the-ahwahnee-the-splurge-and-when-it-ear", "The Ahwahnee"], ["#sec-1-yosemite-valley-lodge-the-location-is-th", "Valley Lodge"], ["#sec-2-curry-village-canvas-bear-boxes-and-prox", "Curry Village"], ["#sec-3-housekeeping-camp-the-sleeper-pick", "Housekeeping Camp"], ["#sec-4-the-high-country-white-wolf-and-tuolumne", "Tuolumne and White Wolf"], ["#high-sierra-camps", "High Sierra Camps"], ["#wawona-hotel", "The Wawona Hotel"], ["#winter-huts", "Winter huts"], ["#private-homes", "Private cabins"], ["#sec-5-how-the-booking-actually-works", "Booking"], ["#compare", "The table"], ["#where-to-stay-questions", "Questions"]];
  var FAQ = [["How do you book lodging inside Yosemite?", "Every hotel, lodge and tent cabin inside the park is run by one concessioner, Yosemite Hospitality, and books through travelyosemite.com. Reservations open 366 days in advance on a rolling basis. The first night is charged at booking and refunded if you cancel at least seven days before arrival. The Park Service says cancelled rooms reappear in the morning, so check then."], ["Is the Ahwahnee worth the price?", "It costs several times the rate of Yosemite Valley Lodge, and the rooms themselves are nice hotel rooms, not extraordinary ones. The money buys the public spaces, the address under the Royal Arches, and the occasion. It is worth it for a milestone trip; if you will only use the room to sleep, the Lodge delivers the same park for a fraction of the cost."], ["What is the cheapest roofed place to sleep in Yosemite Valley?", "The canvas tent cabins at Curry Village. They have real beds but no plumbing, the showers and bathrooms are shared, canvas walls carry every sound, and everything with a scent goes in the steel bear locker outside. The unheated tents have a light and no outlet; the heated ones have one outlet and heat from the Tuesday after Labor Day to the Friday before Memorial Day."], ["What is Housekeeping Camp?", "266 three-walled units with canvas roofs on the Merced River in Yosemite Valley. Each sleeps up to six on a bunk bed and a double bed, and has a covered patio, a table, a fire ring and a bear locker. Bring bedding or rent a bed pack. It runs spring to fall: April 3 to October 12 in 2026. It is the only Valley lodging where you can cook over a fire, between 5 and 10 p.m."], ["Is the Wawona Hotel open?", "No. It has been closed since December 2, 2024, for a condition assessment the Park Service ordered after a roof replacement turned up problems, and every building in the complex is closed. There is no reopening date."], ["Is White Wolf Lodge open?", "No. The Park Service ordered it closed for the 2026 season because of severely damaged sewer lines, and no reopening date has been announced. Tuolumne Meadows Lodge is the high country's tent-cabin option; its 2026 season ran June 5 to September 13."], ["Can I bring my dog to lodging in Yosemite?", "Not to the concessioner's lodging: the Ahwahnee, Yosemite Valley Lodge, Curry Village, Housekeeping Camp and Tuolumne Meadows Lodge allow service animals only. The Redwoods in Yosemite, private cabins in Wawona inside the park, offers pet-friendly cabins."], ["What if Yosemite lodging is sold out for my dates?", "Rooms come back. Cancellations reappear every morning, and there is a wave of them in the final weeks before any date. Check daily in the four to six weeks before the trip. If nothing turns up, El Portal on Highway 140 is the nearest gateway with rooms, 25 to 35 minutes from the Valley."], ["When is it easiest to get a room inside Yosemite?", "Winter. The Ahwahnee, Yosemite Valley Lodge and a reduced Curry Village run all year, rates drop, and midweek availability in January is far better than in July. The concessioner's winter offers put the floor at the Ahwahnee from $389, the Lodge from $172 and Curry Village from $95 a night on select dates."], ["Is Yosemite West inside the park?", "No. Yosemite West is a private enclave of vacation homes just outside the park's southern boundary, reached through the park on Wawona Road. It has no restaurant, store, gas station or shuttle."]];
  var MAP_W = 1760,
    MAP_H = 1410;
  var SPOTS = [{
    at: [686, 659],
    side: "t",
    tone: "full",
    name: "Yosemite Valley",
    note: "Four properties, three year-round"
  }, {
    at: [710, 706],
    side: "b",
    tone: "store",
    name: "Glacier Point Ski Hut",
    note: "Winter, guided"
  }, {
    at: [768, 969],
    side: "r",
    tone: "store",
    name: "Ostrander Ski Hut",
    note: "Winter lottery"
  }, {
    at: [1205, 318],
    side: "r",
    tone: "seasonal",
    name: "Tuolumne Meadows Lodge",
    note: "June to September"
  }, {
    at: [548, 331],
    side: "t",
    tone: "none",
    name: "White Wolf Lodge",
    note: "Closed"
  }, {
    at: [1043, 222],
    side: "u",
    tone: "store",
    name: "Glen Aulin",
    note: "High Sierra Camp"
  }, {
    at: [886, 402],
    side: "l",
    tone: "store",
    name: "May Lake",
    note: "High Sierra Camp"
  }, {
    at: [1000, 499],
    side: "l",
    tone: "store",
    name: "Sunrise",
    note: "High Sierra Camp"
  }, {
    at: [1199, 530],
    side: "r",
    tone: "store",
    name: "Vogelsang",
    note: "High Sierra Camp"
  }, {
    at: [1072, 684],
    side: "r",
    tone: "store",
    name: "Merced Lake",
    note: "High Sierra Camp"
  }, {
    at: [537, 1230],
    side: "l",
    tone: "none",
    name: "Wawona Hotel",
    note: "Closed"
  }, {
    at: [563, 1211],
    side: "r",
    tone: "town",
    name: "The Redwoods",
    note: "Private cabins"
  }];
  var TONES = [["full", "Year-round"], ["seasonal", "Summer only"], ["store", "By lottery or guided trip"], ["none", "Closed"], ["town", "Private rentals"]];
  var pct = (x, y) => ({
    left: x / MAP_W * 100 + "%",
    top: y / MAP_H * 100 + "%"
  });
  function LodgingMap() {
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
      alt: "National Park Service map of Yosemite, cropped from Hetch Hetchy south to the Mariposa Grove, marking every place to sleep inside the park: the four Yosemite Valley properties, Tuolumne Meadows Lodge, the closed White Wolf Lodge and Wawona Hotel, the five High Sierra Camps, the Glacier Point and Ostrander ski huts, and the private cabins of The Redwoods in Wawona."
    }), React.createElement("div", {
      className: "eat-map__layer",
      "aria-hidden": "true"
    }, SPOTS.map(s => React.createElement("span", {
      key: s.name,
      className: "eat-spot eat-spot--" + s.side + " is-" + s.tone,
      style: pct(s.at[0], s.at[1])
    }, React.createElement("i", null), React.createElement("b", null, s.name), React.createElement("small", null, s.note))))), React.createElement("figcaption", null, React.createElement("ul", {
      className: "eat-key"
    }, TONES.map(([t, label]) => React.createElement("li", {
      key: t,
      className: "is-" + t
    }, label))), React.createElement("span", null, "Map: National Park Service (public domain), cropped. Camp pins are approximate.")));
  }
  var BOARD = [["The Ahwahnee", "Yosemite Valley", "open", "Year-round", "#sec-0-the-ahwahnee-the-splurge-and-when-it-ear"], ["Yosemite Valley Lodge", "Yosemite Valley", "open", "Year-round", "#sec-1-yosemite-valley-lodge-the-location-is-th"], ["Curry Village", "Yosemite Valley", "open", "Year-round, reduced in winter", "#sec-2-curry-village-canvas-bear-boxes-and-prox"], ["Housekeeping Camp", "Yosemite Valley", "seasonal", "April 3 to October 12, 2026", "#sec-3-housekeeping-camp-the-sleeper-pick"], ["Tuolumne Meadows Lodge", "Tioga Road, 8,700 ft", "seasonal", "June 5 to September 13, 2026", "#sec-4-the-high-country-white-wolf-and-tuolumne"], ["High Sierra Camps", "The backcountry", "lottery", "July 3 to September 9, 2026; three of five ran in 2025", "#high-sierra-camps"], ["Ostrander Ski Hut", "Off Glacier Point Road, 8,500 ft", "lottery", "December 23, 2026 to April 4, 2027", "#winter-huts"], ["Glacier Point Ski Hut", "Glacier Point", "closed", "Did not open in winter 2025 to 2026", "#winter-huts"], ["White Wolf Lodge", "Tioga Road, 8,000 ft", "closed", "Closed for the 2026 season", "#sec-4-the-high-country-white-wolf-and-tuolumne"], ["Wawona Hotel", "Wawona", "closed", "Closed since December 2, 2024", "#wawona-hotel"], ["The Redwoods in Yosemite", "Wawona", "private", "Private cabins, booked direct", "#private-homes"]];
  var STATUS = {
    open: "Open",
    seasonal: "Seasonal",
    lottery: "Lottery",
    closed: "Closed",
    private: "Private"
  };
  var TABLE = [["The Ahwahnee", "valley", "Valley, east end", "Hotel rooms, cottages, suites", "Private", "Full", "Dining room, bar", "The most in the park"], ["Yosemite Valley Lodge", "valley", "Valley, by Yosemite Falls", "Hotel, bunk and family rooms", "Private", "Full", "Base Camp Eatery, Mountain Room", "Mid-range"], ["Curry Village: Stoneman rooms", "valley", "Valley, below Glacier Point", "Motel rooms", "Private", "Full", "Pizza deck, pavilion, taqueria", "Low to mid"], ["Curry Village: cabins", "valley", "Valley, below Glacier Point", "Wood cabins", "Private, or shared", "Full", "Pizza deck, pavilion, taqueria", "Low to mid"], ["Curry Village: tent cabins", "valley", "Valley, below Glacier Point", "Canvas tents, real beds", "Shared", "Heated tents have one outlet", "Pizza deck, pavilion, taqueria", "The lowest roof in the Valley"], ["Housekeeping Camp", "valley", "Valley, on the Merced", "Bunk and double bed, sleeps 6", "Shared", "Lights and outlets", "Your own, over the fire ring", "Low, plus bedding"], ["Tuolumne Meadows Lodge", "high", "Tioga Road, 8,700 ft", "Canvas tents, up to 4", "Shared", "Wood stove, no electricity", "Dining tent, by reservation", "Modest"], ["High Sierra Camps", "high", "Backcountry, on foot", "Canvas tents", "Shared", "Varies by camp", "Dinner and breakfast included", "Per person, meals included"], ["Ostrander Ski Hut", "high", "Ski in, 10 to 12 miles", "Bunks", "Shared", "Hut", "Bring your own", "By lottery"], ["The Redwoods in Yosemite", "private", "Wawona", "Private cabins and homes", "Private", "Full", "Your own kitchen", "Varies by cabin"]];
  var FILTERS = [["all", "Everything"], ["valley", "Yosemite Valley"], ["high", "High country"], ["private", "Private"]];
  var [group, setGroup] = React.useState("all");
  var rows = TABLE.filter(r => group === "all" || r[1] === group);
  function Facts({
    items
  }) {
    return React.createElement("dl", {
      className: "wts-facts"
    }, items.map(([k, v]) => React.createElement("div", {
      key: k
    }, React.createElement("dt", null, k), React.createElement("dd", null, v))));
  }
  function Photo({
    image,
    ratio,
    alt,
    credit,
    focus,
    sizes
  }) {
    return React.createElement("figure", {
      className: "wts-photo"
    }, React.createElement(ResponsiveImage, {
      image: image,
      alt: alt,
      sizes: sizes || "(max-width: 880px) calc(100vw - 40px), 600px",
      style: {
        aspectRatio: ratio,
        objectPosition: focus || undefined
      }
    }), React.createElement("figcaption", null, credit));
  }
  return React.createElement("div", {
    className: "eat-feature wts-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "bed"
  }), React.createElement("dt", null, "Bookable all year"), React.createElement("dd", null, "Three properties, all in the Valley")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "Reservations open"), React.createElement("dd", null, "366 days ahead, on a rolling basis")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "At booking"), React.createElement("dd", null, "First night due, refundable to 7 days out")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("dt", null, "Check in, check out"), React.createElement("dd", null, "4 p.m. and 11 a.m., everywhere"))), React.createElement("nav", {
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
  }, "The question I field more than any other, after twenty seasons of living and working in this park, is some version of \"where should we stay?\" My first answer is that ", React.createElement("strong", null, "staying inside the park changes the trip"), " in a way no other single decision does. The people sleeping in the Valley are standing under Yosemite Falls at seven in the morning with the mist still hanging and nobody around. The people sleeping in a gateway town are, at that same moment, sitting in the entrance line. Only one group is in the park for the first two hours and the last two hours of the day, which are its best."), React.createElement("p", null, "One piece of mechanics first: every hotel, lodge and tent cabin inside Yosemite is run by a single ", React.createElement("strong", null, "park concessioner"), ", Yosemite Hospitality, and all of it books through one website, ", React.createElement("a", {
    href: TY,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "travelyosemite.com"), ". There is no chain hotel inside the park. The exceptions are a lottery for the backcountry camps, a lottery for a ski hut run by Yosemite Conservancy, and a set of private cabins on old land claims in Wawona."), React.createElement("p", null, "Below: every bed inside the boundary on one map, each property in turn with what the room actually has, the two that are closed and why, how the booking works, and a table.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "bed"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "A first trip: Yosemite Valley Lodge."), React.createElement("li", null, "A family that half-camps: Housekeeping Camp."), React.createElement("li", null, "Hikers on a budget: a Curry Village tent."), React.createElement("li", null, "An occasion: the Ahwahnee."), React.createElement("li", null, "A high-country trip: Tuolumne Meadows Lodge, in summer.")), React.createElement("a", {
    className: "eat-short__link",
    href: TY,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Check in-park rooms at Travel Yosemite ↗")))), React.createElement("section", {
    className: "ff-band",
    id: "inside-the-boundary",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "EVERY BED INSIDE THE BOUNDARY"), React.createElement("h2", null, "Eleven places, and three of them are shut"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "Four of the park's properties are in ", React.createElement("strong", null, "Yosemite Valley"), ", and three of those run all year. The rest are seasonal, lotteried or closed. ", React.createElement("strong", null, "Tuolumne Meadows Lodge"), " runs for about three summer months. The ", React.createElement("strong", null, "High Sierra Camps"), " and the ", React.createElement("strong", null, "Ostrander Ski Hut"), " go by lottery. The ", React.createElement("strong", null, "Wawona Hotel"), " and ", React.createElement("strong", null, "White Wolf Lodge"), " are closed with no reopening date, and the Glacier Point Ski Hut did not open last winter."))), React.createElement(LodgingMap, null)), React.createElement("ul", {
    className: "wts-board"
  }, BOARD.map(([name, where, status, season, href]) => React.createElement("li", {
    key: name,
    className: "is-" + status
  }, React.createElement("span", {
    className: "wts-status wts-status--" + status
  }, STATUS[status]), React.createElement("a", {
    href: href
  }, React.createElement("strong", null, name)), React.createElement("span", {
    className: "wts-board__where"
  }, where), React.createElement("span", {
    className: "wts-board__season"
  }, season)))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-0-the-ahwahnee-the-splurge-and-when-it-ear",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE AHWAHNEE"), React.createElement("h2", null, "The splurge, and when it earns it"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "The Ahwahnee"), " opened in 1927, designed by Gilbert Stanley Underwood, and is a ", React.createElement("strong", null, "National Historic Landmark"), ", a federal designation. The Great Lounge with its floor-to-ceiling windows, the stenciled beams, the stone fireplaces, the dining room with its 34-foot ceiling: this is one of the great park lodges in the national system, in the same conversation as Old Faithful Inn and the Grand Canyon's El Tovar. The building sits under the Royal Arches at the quiet east end of the Valley, and at dusk Half Dome turns pink above the meadow outside the front door. The Park Service calls it the park's only luxury hotel."), React.createElement("p", null, "The rooms come in three kinds: rooms in the main building, in standard, classic and view grades; cottages in the trees beside it; and a set of named suites. They are nice hotel rooms, not extraordinary ones, and you are paying ", React.createElement("strong", null, "several times the rate of Yosemite Valley Lodge"), " for them. What the money buys is the public spaces, the address, and the feeling of the place: afternoon light in the Great Lounge, a drink by the fire after a day on the trails, dinner in a dining room that requires you to look up. The outdoor pool is heated and open all year."), React.createElement("p", null, "If you will use those things, if you are marking an anniversary or a retirement or ", React.createElement("a", {
    href: "/articles/where-to-propose-in-yosemite"
  }, "a once-in-a-lifetime trip"), ", the Ahwahnee is worth it. If you plan to leave at dawn and return at dark, it is not, and the Lodge will make you just as happy for a fraction of the cost. The compromise I recommend constantly: stay somewhere cheaper and come to the Ahwahnee for ", React.createElement("a", {
    href: "/articles/where-to-eat-yosemite#ahwahnee-dining-room"
  }, "dinner or a drink"), ". The Great Lounge does not check room keys. A hotel reservation does not hold you a dinner table, though; book that separately. From 2016 to 2019 the hotel was called the Majestic Yosemite Hotel while the old names were tied up in a dispute with the previous concessioner, which is why some guidebooks and old reviews use it.")), React.createElement(Facts, {
    items: [["Season", "Year-round"], ["Rooms", "Main building, cottages, suites; accessible rooms in several grades"], ["Pool", "Outdoor, heated, all year, 9 a.m. to dusk"], ["Wi-Fi", "Hotel guests only, and limited"], ["On site", "Dining room, bar, gift shop"]]
  })), React.createElement("div", {
    className: "wts-photos"
  }, React.createElement(Photo, {
    image: "img/ahwahnee-hotel.jpg",
    ratio: "1600 / 1200",
    alt: "The Ahwahnee in winter, its stone and timber front below the Valley's north wall",
    credit: "The Ahwahnee. Photo: Chris Dunstan / Wikimedia Commons (public domain)"
  }), React.createElement(Photo, {
    image: "img/ahwahnee-great-lounge.jpg",
    ratio: "1600 / 1200",
    alt: "The Ahwahnee's Great Lounge from above: chandeliers, tall leaded windows, and sofas around low tables",
    credit: "The Great Lounge. Photo: David Berry / Wikimedia Commons (CC BY 2.0)"
  })))), React.createElement("section", {
    className: "ff-band",
    id: "sec-1-yosemite-valley-lodge-the-location-is-th",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement(Photo, {
    image: "img/yosemite-valley-lodge-entrance.jpg",
    ratio: "1600 / 1200",
    alt: "The front entrance of Yosemite Valley Lodge under tall pines",
    credit: "Yosemite Valley Lodge. Photo: Rennett Stowe / Wikimedia Commons (CC BY 2.0)"
  }), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YOSEMITE VALLEY LODGE"), React.createElement("h2", null, "The location is the product"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Yosemite Valley Lodge"), " is the park's standard hotel: 245 rooms in low-slung motel-style buildings, including bunk rooms and family rooms, clean and functional, with a food court, a steakhouse and a pool in summer. Nobody has ever described the architecture as memorable. What it has instead is a position directly across the road from ", React.createElement("strong", null, "Lower Yosemite Fall"), ", on the shuttle loop, walking distance to the falls trail and an easy ride to everything else. In spring you can hear the waterfall from the grounds at night."), React.createElement("blockquote", {
    className: "wts-quote"
  }, "You are not buying the room. You are buying the two hours a day the day-trippers never see."), React.createElement("p", null, "For most first-time visitors with a hotel budget, this is the answer, and it books out accordingly. Among the roofed options it ranks first for value: not the cheapest or the grandest, but the best balance of location, comfort and price. The accessible rooms have widened doors and grab bars, and roll-in showers on request. If it is gone for your dates, El Portal is the nearest gateway, 25 to 35 minutes out, and ", React.createElement(AvailabilityLink, {
    destination: "El Portal, California",
    list: "article_inline",
    slug: "where-to-stay-in-yosemite",
    name: "El Portal availability search"
  }, "a search there"), " shows what is left.")), React.createElement(Facts, {
    items: [["Season", "Year-round"], ["Pool", "Memorial Day to Labor Day, weather permitting"], ["On site", "Base Camp Eatery, the Mountain Room, Starbucks, bike rental in season, a tour desk"], ["Free for guests", "Parking and Wi-Fi"]]
  })))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-2-curry-village-canvas-bear-boxes-and-prox",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "CURRY VILLAGE"), React.createElement("h2", null, "Canvas, bear lockers, and proximity"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Curry Village"), " has been putting visitors in tents at the base of Glacier Point since 1899. Today it is a dense grid of ", React.createElement("strong", null, "canvas tent cabins"), " (wood frame, canvas walls and roof, real beds, no plumbing), a smaller number of wood cabins, some with a private bath, and the ", React.createElement("strong", null, "Stoneman"), " rooms, motel rooms with their own bathrooms. The tents are the cheapest roofed beds in Yosemite Valley, and the tradeoffs follow from the canvas. You will hear your neighbors, and they will hear you. Quiet hours run 10 p.m. to 6 a.m. for that reason."), React.createElement("p", null, "The heat question decides the tent. An ", React.createElement("strong", null, "unheated tent"), " has an electric light and no outlet, and it is cold in spring and fall. A ", React.createElement("strong", null, "heated tent"), " has one outlet and heat from the Tuesday after Labor Day to the Friday before Memorial Day, and the heated ones go first. The shower houses are open around the clock. Wi-Fi is in the guest lounge, not the tents."), React.createElement("p", null, "And you must use the ", React.createElement("strong", null, "bear locker"), ". Every tent has a steel food locker outside, and everything with a scent, food, toothpaste, sunscreen, the gum in your daypack, goes in it, every time, because canvas is not a barrier a bear respects. Staff repeat this rule at check-in."), React.createElement("p", null, "What you get in exchange is the best cheap address in the Valley: shuttle stop, ", React.createElement("a", {
    href: "/articles/where-to-eat-yosemite#sec-1-where-to-eat-in-yosemite-valley"
  }, "pizza deck"), ", mountaineering shop, the ", React.createElement("a", {
    href: "/articles/mist-trail-the-real-guide"
  }, "Mist Trail"), " trailhead a short walk away, and Half Dome over the whole compound. Families and hikers who treat the tent as a place to sleep tend to love it. People expecting a quiet hotel at a discount write the bad reviews. Know which one you are before you book."), React.createElement("p", null, "Two pieces of history explain the place. In October 2008 a rockfall off Glacier Point hit the back of the village, and the park closed the units under the cliff for good, roughly a third of the camp, which is why the grid stops where it does. From 2016 to 2019 it was called Half Dome Village, during the same naming dispute that renamed the Ahwahnee. The outdoor ice rink, skated since 1928, is closed until the 2026 to 2027 season, with no opening date set."))), React.createElement("div", null, React.createElement(Photo, {
    image: "img/curry-village.jpg",
    ratio: "1600 / 1072",
    focus: "50% 60%",
    alt: "Wooden cabins at Curry Village among pines and granite boulders",
    credit: "Curry Village cabins. Photo: US National Park Service / Wikimedia Commons (public domain)"
  }), React.createElement("table", {
    className: "wts-units"
  }, React.createElement("caption", null, "The four kinds of room at Curry Village"), React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Room"), React.createElement("th", {
    scope: "col"
  }, "Bath"), React.createElement("th", {
    scope: "col"
  }, "Power and heat"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Unheated tent"), React.createElement("td", null, "Shared"), React.createElement("td", null, "A light, no outlet, no heat")), React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Heated tent"), React.createElement("td", null, "Shared"), React.createElement("td", null, "One outlet; heat from September to May")), React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Cabin"), React.createElement("td", null, "Private or shared"), React.createElement("td", null, "Full")), React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Stoneman room"), React.createElement("td", null, "Private"), React.createElement("td", null, "Full; one to three double beds")))), React.createElement(Facts, {
    items: [["Season", "Year-round, reduced in winter"], ["Pool", "Memorial Day to Labor Day, 11 a.m. to 6 p.m."], ["Bikes", "Rental, spring to fall"]]
  })))), React.createElement("section", {
    className: "ff-band",
    id: "sec-3-housekeeping-camp-the-sleeper-pick",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement(Photo, {
    image: "img/housekeeping-camp-yosemite.jpg",
    ratio: "1600 / 1071",
    alt: "A Housekeeping Camp unit: concrete walls, a canvas roof over the patio, a table and folding chairs, pines behind",
    credit: "A Housekeeping Camp unit. Photo: advencap / Wikimedia Commons (CC BY-SA 2.0)"
  }), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HOUSEKEEPING CAMP"), React.createElement("h2", null, "The sleeper pick"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Housekeeping Camp"), " is the option almost nobody outside of returning families has heard of, and it is the one I recommend most often to people who want to half-camp. Its 266 units are ", React.createElement("strong", null, "three-walled concrete structures"), " on the bank of the ", React.createElement("strong", null, "Merced River"), ": concrete on three sides, a canvas roof, a curtain across the fourth wall, a bunk bed and a double bed inside, electric lights and an outlet, and outside a covered patio with a table, a fire ring and a bear locker. A unit sleeps up to six, with room for two extra cots. You bring bedding, or rent a ", React.createElement("strong", null, "bed pack"), " at the office: $15 a night for a double, $9 for a single."), React.createElement("p", null, "It is austere, but you can cook your own meals over a fire, which no other lodging in the Valley allows (fires between 5 and 10 p.m.), the river beach is steps away for the hot afternoons, and the place feels like a family summer camp. The camp has the Valley's laundromat and a shower house with soap and towels. For a family of four on a budget who would otherwise be choosing between a motel outside the park and ", React.createElement("a", {
    href: "/articles/yosemite-camping-complete-guide"
  }, "a campsite they failed to win"), ", Housekeeping Camp splits the difference: camping's economics and campfires with a real bed and no tent to pitch.")), React.createElement(Facts, {
    items: [["Season", "April 3 to October 12, 2026"], ["Showers", "7 a.m. to 10 p.m."], ["Laundry", "8 a.m. to 10 p.m."], ["Store", "Groceries, snacks and camp supplies, closes with the camp"]]
  })))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sec-4-the-high-country-white-wolf-and-tuolumne",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE HIGH COUNTRY: TUOLUMNE AND WHITE WOLF"), React.createElement("h2", null, "One tent camp open, one closed"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Tuolumne Meadows Lodge"), " is 69 canvas tent cabins at 8,700 feet, near the meadows and the Dana Fork of the Tuolumne River, about 50 miles from the Valley. Each tent has a wood stove with free firewood and no electricity (a solar lantern is provided), sleeps up to four, and comes with sheets, pillows and towels. Showers and restrooms are shared. Dinner is in the riverside dining tent, and dinner reservations are required and taken only in person at the lodge. Its 2026 season ran June 5 to September 13, conditions permitting, which means snow decides the opening and the fall decides the close. A night up here under that sky is one of the best sleeps the park sells."), React.createElement("p", null, React.createElement("strong", null, "White Wolf Lodge"), ", off Tioga Road at 8,000 feet, is closed. The Park Service ordered it shut for the 2026 season because of severely damaged sewer lines, and has not announced a reopening. It was 24 canvas tents and four wood cabins with private baths, about 30 miles from the Valley. The campground beside it stayed open without drinking water."), React.createElement("p", null, "Neither is a base for a Valley trip; the Valley is an hour and a half or more away. They are bases for the high country itself. ", React.createElement("a", {
    href: "/articles/tuolumne-meadows-in-a-day"
  }, "The Tuolumne Meadows day guide"), " and ", React.createElement("a", {
    href: "/articles/cathedral-lakes-day-hike"
  }, "the Cathedral Lakes hike"), " are the trip a night at Tuolumne suits. If the lodge is out of season or full, Lee Vining is 30 minutes from the meadows, over Tioga Pass."))), React.createElement("div", null, React.createElement(Photo, {
    image: "img/tuolumne-meadows-lembert-dome.jpg",
    ratio: "1600 / 1067",
    alt: "Lembert Dome above Tuolumne Meadows, with hikers on the granite in the foreground",
    credit: "Lembert Dome, Tuolumne Meadows. Photo: Pacific Southwest Region USFWS / Wikimedia Commons (public domain)"
  }), React.createElement("div", {
    className: "wts-closed"
  }, React.createElement("p", {
    className: "wts-closed__head"
  }, React.createElement(EventIcon, {
    name: "no",
    size: 22
  }), " White Wolf Lodge"), React.createElement("p", null, "Closed for the 2026 season by Park Service order: damaged sewer lines. No reopening date."))))), React.createElement("section", {
    className: "ff-band",
    id: "high-sierra-camps",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement(Photo, {
    image: "img/glen-aulin-tent-cabin.jpg",
    ratio: "1600 / 1200",
    alt: "A white canvas tent cabin at Glen Aulin High Sierra Camp, with a wood stovepipe, among lodgepole pines and granite",
    credit: "A tent cabin at Glen Aulin. Photo: Lela Getzler / Wikimedia Commons (CC BY 2.0)"
  }), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE HIGH SIERRA CAMPS"), React.createElement("h2", null, "A bed and dinner, six to ten miles from the road"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "Five tent camps sit in the backcountry above Tuolumne, six to ten miles apart on foot: ", React.createElement("strong", null, "Glen Aulin"), ", ", React.createElement("strong", null, "May Lake"), ", ", React.createElement("strong", null, "Sunrise"), ", ", React.createElement("strong", null, "Vogelsang"), " at about 10,200 feet and ", React.createElement("strong", null, "Merced Lake"), " at about 7,300. You walk in with a daypack instead of a tent and a stove; the camp has the canvas tent, the bed, dinner and breakfast. A box lunch is extra ($20 for an adult and $10 for a child, cash only). There are unguided stays and guided trips of five or seven days, which run $1,403 for an adult and $970 for a child with lodging, meals and the guide."), React.createElement("p", null, "Two caveats. The camps do not all open: in 2025 only Glen Aulin, May Lake and Sunrise operated, and Vogelsang and Merced Lake stayed closed. And they go by ", React.createElement("strong", null, "lottery"), ", not by the 366-day window. The 2026 season, July 3 to September 9, is sold out; the concessioner says the 2027 lottery opens in fall 2026. Winners are told by email and have seven days to pay. If you want a backcountry night and lose, ", React.createElement("a", {
    href: "/articles/yosemite-wilderness-permits-guide"
  }, "a wilderness permit"), " and your own tent is the other way in.")), React.createElement("a", {
    className: "ff-ghost wts-ghost",
    href: "https://www.travelyosemite.com/lodging/high-sierra-camps/high-sierra-camp-lottery",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The High Sierra Camp lottery ↗")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "wawona-hotel",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE WAWONA HOTEL"), React.createElement("h2", null, "Closed, with no date to reopen"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "The ", React.createElement("strong", null, "Wawona Hotel"), ", near the South Entrance and the Mariposa Grove, has been ", React.createElement("strong", null, "closed since December 2, 2024"), ". A roof replacement turned up problems, and the Park Service ordered a comprehensive condition assessment of the buildings. Every building in the complex is closed to the public, the main building, the cottages and the pool included, and there is no anticipated reopening date. The park's printed guide calls it closed for renovation. Either way, it is not bookable, and its dining room is closed with it."), React.createElement("p", null, "It is a loss worth knowing about. The site has housed travelers since 1856, when it was a stage stop; the main building, with its white verandas, went up in 1879, and the hotel is a National Historic Landmark. From 2016 to 2019 it was called Big Trees Lodge. With it closed there is no concessioner bed on the Highway 41 side of the park, which puts more pressure on Fish Camp and Oakhurst in summer (", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "the gateway towns compared"), ") and makes the private cabins below the only in-park beds near the grove.")), React.createElement("div", {
    className: "wts-closed"
  }, React.createElement("p", {
    className: "wts-closed__head"
  }, React.createElement(EventIcon, {
    name: "no",
    size: 22
  }), " Wawona Hotel"), React.createElement("p", null, "Closed since December 2, 2024, for a condition assessment. No reopening date. Check the ", React.createElement("a", {
    href: "https://www.nps.gov/places/000/wawona-hotel.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Park Service notice"), " for news."))), React.createElement(Photo, {
    image: "img/wawona-hotel.jpg",
    ratio: "1600 / 1032",
    alt: "A white two-story Wawona Hotel building wrapped in verandas, behind a lawn and an oak",
    credit: "The Wawona Hotel. Photo: Rennett Stowe / Wikimedia Commons (CC BY 2.0)"
  }))), React.createElement("section", {
    className: "ff-band",
    id: "winter-huts",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WINTER HUTS"), React.createElement("h2", null, "Two huts you ski to, one of them dark"), React.createElement("div", {
    className: "wts-huts"
  }, React.createElement("article", {
    className: "ff-inpark"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YOSEMITE CONSERVANCY · BY LOTTERY"), React.createElement("h3", null, "Ostrander Ski Hut"), React.createElement("p", null, "A stone hut at 8,500 feet above Ostrander Lake, ten to twelve or more miles each way on skis or snowshoes with 2,500 feet of climbing. Yosemite Conservancy runs it, not the concessioner, and the space goes by lottery."), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Season"), React.createElement("dd", null, "December 23, 2026 to April 4, 2027, subject to change")), React.createElement("div", null, React.createElement("dt", null, "Lottery"), React.createElement("dd", null, "October 12 to 18, 2026; one application a person, up to ten dates")), React.createElement("div", null, React.createElement("dt", null, "Results"), React.createElement("dd", null, "By October 23; payment due December 1")), React.createElement("div", null, React.createElement("dt", null, "Leftovers"), React.createElement("dd", null, "First come, from 9 a.m. December 1, 2026"))), React.createElement("a", {
    className: "ff-ghost",
    href: "https://yosemite.org/experience/ostrander-ski-hut/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Ostrander at Yosemite Conservancy ↗")), React.createElement("article", {
    className: "ff-inpark"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE CONCESSIONER · GUIDED"), React.createElement("h3", null, "Glacier Point Ski Hut"), React.createElement("p", null, "A guided overnight: a 10.5-mile ski in to a hut that sleeps up to 20, minimum age 14 with an adult. It did not open for the 2025 to 2026 season because it had no power, and nothing has been announced for this winter."), React.createElement("a", {
    className: "ff-ghost",
    href: "https://www.travelyosemite.com/lodging/glacier-point-ski-hut/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Glacier Point Ski Hut ↗"))), React.createElement("p", {
    className: "ff-note"
  }, "Both routes run through the Glacier Point Road area. Check the park's ", React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/management/closures.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "closures page"), " before you apply and again before you go."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "private-homes",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "PRIVATE CABINS INSIDE THE PARK"), React.createElement("h2", null, "Wawona's cabins, and the enclave that is not in the park"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "Parts of Wawona are private inholdings, land that stayed in private hands when the park took in the area, and on them sits ", React.createElement("strong", null, "The Redwoods in Yosemite"), ": more than 120 cabins and homes on Chilnualna Falls Road, rented through the company's own site rather than the concessioner. You get a kitchen, which matters here, because the nearest groceries are the ", React.createElement("a", {
    href: "/articles/where-to-eat-yosemite#groceries-and-supplies"
  }, "Wawona Store"), " and the nearest restaurants are in Fish Camp. It is also the one in-park lodging with pet-friendly cabins; the concessioner's properties take service animals only. With the hotel closed, it is the only bed inside the boundary near the ", React.createElement("a", {
    href: "/articles/mariposa-grove-how-to-visit"
  }, "Mariposa Grove"), "."), React.createElement("p", null, React.createElement("strong", null, "Yosemite West"), " is the place people mistake for this. It is a private enclave of vacation homes on a ridge just ", React.createElement("strong", null, "outside"), " the southern boundary, reached through the park on Wawona Road, and listings often sell it as \"in Yosemite.\" It has no restaurant, store, gas station or shuttle, so shop before you arrive. It is a fine base for the south end. It is not inside the park."))), React.createElement("ul", {
    className: "wts-compare"
  }, React.createElement("li", null, React.createElement("strong", null, "The Redwoods in Yosemite"), React.createElement("span", null, "Inside the park, Wawona"), React.createElement("span", null, "Private cabins, booked direct"), React.createElement("span", null, "Pet-friendly cabins offered")), React.createElement("li", {
    className: "is-out"
  }, React.createElement("strong", null, "Yosemite West"), React.createElement("span", null, "Outside the boundary, off Wawona Road"), React.createElement("span", null, "Private vacation homes"), React.createElement("span", null, "No restaurant, store or gas"))))), React.createElement("section", {
    className: "ff-band",
    id: "sec-5-how-the-booking-actually-works",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HOW THE BOOKING ACTUALLY WORKS"), React.createElement("h2", null, "Book at 366 days, or check every morning"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "Everything the concessioner runs books through travelyosemite.com, and reservations open ", React.createElement("strong", null, "366 days in advance"), ", a year and a day ahead, on a rolling basis. For peak summer dates at the Valley properties, availability at the moment of release is measured in minutes. If your dates are fixed and in July, set a reminder for the morning your window opens, and book then."), React.createElement("p", null, "Missing the release is not the end: ", React.createElement("strong", null, "rooms come back"), ". Cancellations come in continuously, with a distinct wave in the final weeks before any date as plans collapse, and the Park Service says they become available in the morning. Check daily, in the morning, in the four to six weeks before your trip. I have watched people assemble three-night Valley stays in June out of one-night cancellations."), React.createElement("p", null, "The other lever is the calendar. ", React.createElement("strong", null, "Winter is far easier and cheaper."), " The seasonal operations close, but the Ahwahnee, the Lodge and a reduced Curry Village run all year. The concessioner's winter offers put the floor at the Ahwahnee from $389, the Lodge from $172 and Curry Village from $95 a night, on select dates with holiday blackouts; ", React.createElement("a", {
    href: "/articles/yosemite-in-winter"
  }, "the winter guide"), " has the codes and the dates. Entry itself needs no timed reservation in 2026 (", React.createElement("a", {
    href: "/articles/yosemite-without-reservations-2026"
  }, "what changed this year"), ")."))), React.createElement("ol", {
    className: "wts-steps"
  }, React.createElement("li", null, React.createElement("span", null, "366 days out"), React.createElement("strong", null, "The date opens"), React.createElement("p", null, "On travelyosemite.com, one date at a time.")), React.createElement("li", null, React.createElement("span", null, "At booking"), React.createElement("strong", null, "The first night is charged"), React.createElement("p", null, "To a card, as the deposit.")), React.createElement("li", null, React.createElement("span", null, "7 days out"), React.createElement("strong", null, "Last day for a refund"), React.createElement("p", null, "Cancel by then and the deposit comes back.")), React.createElement("li", null, React.createElement("span", null, "Every morning"), React.createElement("strong", null, "Cancellations reappear"), React.createElement("p", null, "Check then, most of all in the last six weeks.")), React.createElement("li", null, React.createElement("span", null, "Arrival"), React.createElement("strong", null, "Check in at 4 p.m."), React.createElement("p", null, "Every guest gets a parking pass. Check out by 11 a.m.")))), React.createElement("ul", {
    className: "ff-rules wts-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "Pets"), React.createElement("p", null, "Service animals only, at every concessioner property.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "Smoking"), React.createElement("p", null, "Not allowed in any room or tent.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "Parking"), React.createElement("p", null, "A pass with the room, so the car can stay put.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "signal",
    size: 26
  }), React.createElement("strong", null, "Wi-Fi"), React.createElement("p", null, "Free for guests at the Lodge; limited at the Ahwahnee; the lounge only at Curry. ", React.createElement("a", {
    href: "/articles/cell-service-in-yosemite"
  }, "Cell service"), " is its own story."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "compare",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "EVERY OPTION, SIDE BY SIDE"), React.createElement("h2", null, "The table"), React.createElement("div", {
    className: "eat-filter",
    role: "group",
    "aria-label": "Show lodging in"
  }, FILTERS.map(([k, label]) => React.createElement("button", {
    key: k,
    type: "button",
    className: "eat-filter__chip" + (group === k ? " is-on" : ""),
    "aria-pressed": group === k,
    onClick: () => setGroup(k)
  }, label))), React.createElement("div", {
    className: "eat-table-wrap"
  }, React.createElement("table", {
    className: "eat-table wts-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Where to sleep"), React.createElement("th", {
    scope: "col"
  }, "Where"), React.createElement("th", {
    scope: "col"
  }, "Beds"), React.createElement("th", {
    scope: "col"
  }, "Bath"), React.createElement("th", {
    scope: "col"
  }, "Heat and power"), React.createElement("th", {
    scope: "col"
  }, "Food"), React.createElement("th", {
    scope: "col"
  }, "Price"))), React.createElement("tbody", null, rows.map(([name,, where, beds, bath, power, food, price]) => React.createElement("tr", {
    key: name
  }, React.createElement("th", {
    scope: "row",
    "data-label": "Where to sleep"
  }, name), React.createElement("td", {
    "data-label": "Where"
  }, where), React.createElement("td", {
    "data-label": "Beds"
  }, beds), React.createElement("td", {
    "data-label": "Bath"
  }, bath), React.createElement("td", {
    "data-label": "Heat and power"
  }, power), React.createElement("td", {
    "data-label": "Food"
  }, food), React.createElement("td", {
    "data-label": "Price"
  }, price)))))), React.createElement("p", {
    className: "ff-note"
  }, "The Wawona Hotel and White Wolf Lodge are left off because they are closed. Prices are the shape, not a rate: the concessioner's rates move with the date, and its ", React.createElement("a", {
    href: "https://www.travelyosemite.com/special-offers/specials-packages",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "specials page"), " carries the current offers.")), React.createElement("section", {
    className: "ff-band",
    id: "sec-6-the-alternative-for-honesty-s-sake",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE ALTERNATIVE, FOR HONESTY'S SAKE"), React.createElement("h2", null, "If you can get a bed inside the boundary, get it"), React.createElement("div", {
    className: "eat-prose"
  }, React.createElement("p", null, "None of this means in-park lodging is the only defensible choice. If the inventory is gone or the rates are indefensible for your budget, the ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "gateway towns"), " are a real option with real tradeoffs, mostly measured in windshield time, and camping remains the cheapest way to sleep in the park if you can win a site. For the full arithmetic of what each approach does to a trip budget, I've run the numbers ", React.createElement("a", {
    href: "/articles/yosemite-trip-cost-budget"
  }, "separately"), ". When you want the raw view, ", React.createElement(AvailabilityLink, {
    destination: "Yosemite National Park",
    list: "article_inline",
    slug: "where-to-stay-in-yosemite",
    name: "Gateway availability search"
  }, "one availability search around the park"), " shows what the gateway towns have left on your dates."), React.createElement("p", null, "But rank them like this: Valley Lodge for most first-timers, Housekeeping Camp for families who half-camp, Curry Village for hikers on a budget, the Ahwahnee when the occasion justifies it, Tuolumne for people whose trip is the high country. Then set the reminder for 366 days out, and if you miss it, start checking every morning. Every option above, plus the gateway towns and Fish Camp on one page, is at ", React.createElement("a", {
    href: "/stay"
  }, "where to stay"), "."))), React.createElement("div", {
    className: "wts-cta"
  }, React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "Before you rearrange the trip",
    note: "The ranking above does not change with anyone's inventory. What it cannot tell you is what is left on your specific dates, which is a two-minute question and worth answering before you decide the park is full.",
    list: "article_cta",
    slug: "where-to-stay-in-yosemite",
    cta: "Search lodging around Yosemite →"
  })))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "where-to-stay-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Sleeping in Yosemite, answered"), React.createElement("div", {
    className: "eat-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/lodging/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lodging, and each property's page, Travel Yosemite (Yosemite Hospitality)")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/plan/policies-information",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Policies and information, Travel Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/lodging/high-sierra-camps/trips",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "High Sierra Camps, Travel Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lodging.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lodging, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/reservehelp.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Reservation help, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/places/000/wawona-hotel.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Wawona Hotel, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://yosemite.org/experience/ostrander-ski-hut/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Ostrander Ski Hut, Yosemite Conservancy")), React.createElement("li", null, React.createElement("a", {
    href: "https://redwoodsinyosemite.com/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The Redwoods in Yosemite"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a))))), React.createElement(AffiliateNote, null)));
};
