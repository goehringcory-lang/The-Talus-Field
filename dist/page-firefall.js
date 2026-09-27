var FF_TOWNS = [{
  id: "el-portal",
  name: "El Portal",
  dest: "El Portal, California",
  drive: "25 to 35 min",
  road: "Highway 140, the winter road",
  tier: "Goes first",
  note: "The closest bed outside the boundary, and the first to fill. A room here on the Presidents' Day weekend is rare by late autumn."
}, {
  id: "mariposa",
  name: "Midpines and Mariposa",
  dest: "Mariposa, California",
  drive: "45 to 60 min",
  road: "Highway 140, rain when others get snow",
  tier: "Fills next",
  note: "The deepest inventory on the road that stays open all winter, which is why most firefall visitors end up here. Book it when you book the dates."
}, {
  id: "groveland",
  name: "Groveland",
  dest: "Groveland, California",
  drive: "65 to 80 min",
  road: "Highway 120, chains common",
  tier: "Later",
  note: "Often the easiest late booking, but the approach climbs into snow. Choose it with chains in the car and a flexible morning."
}, {
  id: "oakhurst",
  name: "Fish Camp and Oakhurst",
  dest: "Oakhurst, California",
  drive: "75 to 90 min",
  road: "Highway 41, over Chinquapin",
  tier: "Later",
  note: "Plenty of rooms and the longest drive. After a storm the Wawona Road is the slowest way home in the dark."
}];
var FF_GEAR = [{
  id: "insulated-jacket",
  what: "An insulated jacket",
  why: "You stand still for an hour or two at dusk. Synthetic fill keeps working if the snow is wet.",
  q: "nano puff",
  label: "Nano Puff"
}, {
  id: "down-layer",
  what: "A down layer for the walk out",
  why: "The temperature drops fast once the sun leaves the floor, and the walk back is after dark.",
  q: "down sweater",
  label: "Down Sweater"
}, {
  id: "warm-hat",
  what: "A warm hat",
  why: "The cheapest fix for a cold evening.",
  q: "beanie",
  label: "Beanies"
}, {
  id: "gloves",
  what: "Gloves you can work a camera in",
  why: "Thin liners under a warm mitt, or a glove with a fold-back finger.",
  q: "gloves",
  label: "Gloves"
}, {
  id: "base-layer",
  what: "A base layer",
  why: "Under everything, on the storm-week evenings.",
  q: "capilene thermal",
  label: "Capilene Thermal"
}, {
  id: "rain-shell",
  what: "A rain shell",
  why: "A storm is what fills the fall, and February is storm season.",
  q: "torrentshell",
  label: "Torrentshell"
}, {
  id: "fleece",
  what: "A fleece midlayer",
  why: "For the clear evenings when a puffy is too much on the walk in.",
  q: "better sweater",
  label: "Better Sweater"
}, {
  id: "snow-pants",
  what: "Snow pants",
  why: "For the years with snow on the viewing area. Sitting on snow soaks through anything else.",
  q: "snow pants",
  label: "Snow pants"
}];
var FF_KIT = ["A folding chair or an insulated pad", "A headlamp, with spare batteries", "A thermos and food; nothing is sold at the viewing area", "Traction for icy pavement", "Waterproof boots", "Chains in the car and a full tank; there is no gas in Yosemite Valley", "A trash bag: pack everything out", "A telephoto lens (100mm and longer) and a tripod", "Camera batteries kept warm in an inside pocket"];
var FF_HISTORY = [["1968", "The other firefall ends", "The Park Service stops the man-made ember fall from Glacier Point, a summer tradition since the 1870s. The name stays with the park."], ["1973", "Galen Rowell's photograph", "Rowell scrambles into position and shoots the lit fall on film. It becomes the reference image, and for decades February stays an appointment for photographers only."], ["Mid-2010s", "The crowd arrives", "Social media carries the photographs. The dates are predictable and the viewing area is a flat walk from a road."], ["2022", "About 2,500 in one spot", "Nearly 2,500 people pack a single viewing area. Trampled vegetation, overwhelmed restrooms, and a road that cannot move."], ["2024 and 2025", "Reservations on the peak weekends", "An entry reservation on the three weekends around Presidents' Day, weekdays free. One lane of Northside Drive becomes a footpath, and no stopping from Lower Yosemite Fall to El Capitan Crossover."], ["2026", "No reservation, more rangers", "The park drops the reservation and manages the road instead: the pedestrian lane, the no-stopping zone, and a full Northside closure for about half an hour after sunset on busy weekends. A storm leaves about four feet of snow and a closure from February 19 to 21, in the middle of the window."]];
var FF_WEATHER = [["NWS point forecast, Yosemite Valley", "Sky cover and temperature for the Valley floor", "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936"], ["NWS hourly graph", "The sky-cover line at 5 p.m. is the number that matters", "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936&unit=0&lg=english&FcstType=graphical"], ["NWS Hanford forecast discussion", "The forecasters' own words on incoming storms and clearing", "https://forecast.weather.gov/product.php?site=HNX&issuedby=HNX&product=AFD"], ["GOES-West satellite, Pacific Southwest", "Watch the cloud deck over the Coast Ranges move", "https://www.star.nesdis.noaa.gov/GOES/sector.php?sat=G18&sector=psw"], ["Caltrans QuickMap", "Chain controls on Highways 140, 41 and 120", "https://quickmap.dot.ca.gov/"], ["NPS current conditions", "Road status, closures, and this year's rules", "https://www.nps.gov/yose/planyourvisit/conditions.htm"]];
var FF_FAQ = [["When is the Yosemite firefall?", "Mid to late February, for about two weeks. The sun angle that lights Horsetail Fall runs from roughly the second week of February to the last, with the strongest color usually in the middle of the span. The glow itself lasts about ten minutes at sunset."], ["Do I need a reservation to see the firefall?", "It depends on the year. In 2024 and 2025 the park required an entry reservation on the three peak weekends; in 2026 it required none and managed traffic on the road instead. The park posts each year's rules on its Horsetail Fall page, usually in January."], ["Where do you park for the firefall?", "At Yosemite Falls parking, just west of Yosemite Valley Lodge. From there it is about 1.5 miles each way on a pedestrian lane on Northside Drive to the viewing area near El Capitan Picnic Area. If that lot is full, park at Yosemite Village or Curry Village and take the free Valley shuttle to Yosemite Falls."], ["Can someone drop me off near the viewing area?", "No. Parking, stopping and unloading passengers are prohibited between Lower Yosemite Fall and El Capitan Crossover, and on busy weekends Northside Drive can close completely for about half an hour after sunset. There is no loop to circle while you watch. Vehicles with a disability placard are the exception."], ["What time should I get there?", "At least an hour before sunset to watch, and by early afternoon on a promising weekend if you want a tripod spot. Allow 40 to 50 minutes for the 1.5-mile walk carrying a chair and gear."], ["What time does the firefall happen?", "In the last ten to fifteen minutes before sunset. In late February the sun sets over Yosemite Valley a little before 6 p.m.; the glow peaks just before and is gone within about ten minutes."], ["How do I know if Horsetail Fall is flowing?", "No gauge measures it. Look at the El Capitan webcam in the morning for a thin white streak on the east shoulder, and read the week: a storm that left snow on the rim, followed by afternoons above freezing, is the setup. A long cold, dry spell leaves it empty."], ["What if it is cloudy?", "A few high, thin clouds are fine and can deepen the color. A cloud bank on the western horizon at sunset cancels the show even under a clear sky overhead. Check the forecast's sky cover for the sunset hour, then the webcams in the afternoon."], ["Is February a quiet time to visit Yosemite?", "Not during the firefall window. The rest of the winter is quiet, but the window's dates are the same every year, so rooms inside the Valley go within days of release and the gateway towns fill closest first. Book a refundable room as early as you can."], ["Is the firefall worth it?", "Once, with the odds understood. Some years several evenings line up; some years it effectively does not happen. Plan a winter trip that is worth taking without it, and give yourself more than one evening."], ["Is it the same as the old Glacier Point firefall?", "No. From the 1870s until January 1968 a bonfire was pushed off Glacier Point on summer evenings. The Horsetail Fall firefall is natural sunset light on falling water, and nothing is lit."], ["Are there restrooms at the viewing area?", "Vault toilets, trash and recycling at El Capitan Picnic Area. Pack out everything else."]];
var FF_DAYS = Array.from({
  length: 21
}, (_, i) => {
  var d = i + 8;
  var x = (d - 20.5) / 6.2;
  return {
    d,
    v: Math.max(0.08, Math.exp(-x * x))
  };
});
function FfIcon({
  name,
  size = 22
}) {
  var paths = {
    drop: React.createElement("path", {
      d: "M12 3c3 4.5 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.5 6-11z"
    }),
    cloud: React.createElement("path", {
      d: "M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 11 3.5 3.5 0 0 0 7 18z"
    }),
    sun: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "4"
    }), React.createElement("path", {
      d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
    })),
    walk: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "13",
      cy: "4",
      r: "2"
    }), React.createElement("path", {
      d: "M9 21l2-6 3 3v3M8 11l3-4 3 2 3 1M11 7l-1 5"
    })),
    car: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M4 16V11l2-5h12l2 5v5M4 16h16M4 16v2M20 16v2"
    }), React.createElement("circle", {
      cx: "7.5",
      cy: "13.5",
      r: "1"
    }), React.createElement("circle", {
      cx: "16.5",
      cy: "13.5",
      r: "1"
    })),
    bed: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3"
    }), React.createElement("circle", {
      cx: "7",
      cy: "10.5",
      r: "1.5"
    })),
    clock: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), React.createElement("path", {
      d: "M12 7v5l3 2"
    })),
    therm: React.createElement("path", {
      d: "M14 14V5a2 2 0 0 0-4 0v9a4 4 0 1 0 4 0z"
    }),
    alert: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M12 3l10 18H2z"
    }), React.createElement("path", {
      d: "M12 10v5M12 18v.5"
    })),
    no: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), React.createElement("path", {
      d: "M6 6l12 12"
    })),
    pin: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"
    }), React.createElement("circle", {
      cx: "12",
      cy: "10",
      r: "2.5"
    })),
    check: React.createElement("path", {
      d: "M4 12l5 5L20 6"
    })
  };
  return React.createElement("svg", {
    className: "ff-icon",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false"
  }, paths[name]);
}
function FfBook({
  town,
  list,
  children
}) {
  return React.createElement(AvailabilityLink, {
    destination: town.dest,
    list: list,
    slug: town.id,
    className: "ff-book"
  }, children || "See February availability ↗");
}
function FfSunChart() {
  var W = 630,
    H = 190,
    base = H - 24,
    bw = W / FF_DAYS.length;
  return React.createElement("svg", {
    className: "ff-sun__chart",
    viewBox: `0 0 ${W} ${H}`,
    role: "img",
    "aria-label": "Relative strength of the sun angle on Horsetail Fall through February: weak around the 8th, strongest from about the 17th to the 24th, fading by the 28th"
  }, React.createElement("line", {
    x1: "0",
    y1: base,
    x2: W,
    y2: base,
    className: "ff-sun__axis"
  }), FF_DAYS.map((o, i) => {
    var h = Math.round(o.v * (base - 12));
    var cls = o.v > 0.75 ? "ff-sun__bar ff-sun__bar--peak" : o.v > 0.4 ? "ff-sun__bar ff-sun__bar--mid" : "ff-sun__bar";
    return React.createElement("g", {
      key: o.d
    }, React.createElement("rect", {
      x: i * bw + 2,
      y: base - h,
      width: bw - 4,
      height: h,
      className: cls
    }), o.d % 2 === 0 && React.createElement("text", {
      x: i * bw + bw / 2,
      y: H - 6,
      textAnchor: "middle",
      className: "ff-sun__label"
    }, o.d));
  }));
}
function FfRoadDiagram() {
  return React.createElement("svg", {
    className: "ff-map__svg",
    viewBox: "0 0 1000 420",
    role: "img",
    "aria-label": "Schematic of the Yosemite Valley loop. Park at Yosemite Falls parking beside Yosemite Valley Lodge and walk west about 1.5 miles on the pedestrian lane on Northside Drive to the viewing area near El Capitan Picnic Area. No parking, stopping or drop-offs between Lower Yosemite Fall and El Capitan Crossover. No stopping on Southside Drive between El Capitan Crossover and Swinging Bridge. Overflow parking at Yosemite Village and Curry Village, with the free shuttle to Yosemite Falls."
  }, React.createElement("path", {
    d: "M60 150 C 260 120, 520 120, 900 150",
    className: "ff-map__road"
  }), React.createElement("path", {
    d: "M60 290 C 260 320, 520 320, 900 290",
    className: "ff-map__road"
  }), React.createElement("path", {
    d: "M170 140 L 170 300",
    className: "ff-map__road ff-map__road--cross"
  }), React.createElement("path", {
    d: "M270 128 C 440 116, 600 118, 745 132",
    className: "ff-map__walk"
  }), React.createElement("path", {
    d: "M170 300 C 300 316, 440 318, 560 312",
    className: "ff-map__nostop"
  }), React.createElement("text", {
    x: "70",
    y: "112",
    className: "ff-map__roadname"
  }, "NORTHSIDE DRIVE · ONE WAY WEST"), React.createElement("text", {
    x: "70",
    y: "352",
    className: "ff-map__roadname"
  }, "SOUTHSIDE DRIVE · ONE WAY EAST"), React.createElement("text", {
    x: "182",
    y: "262",
    className: "ff-map__small"
  }, "El Capitan Crossover"), React.createElement("circle", {
    cx: "250",
    cy: "130",
    r: "16",
    className: "ff-map__view"
  }), React.createElement("text", {
    x: "250",
    y: "135",
    textAnchor: "middle",
    className: "ff-map__viewmark"
  }, "V"), React.createElement("text", {
    x: "250",
    y: "180",
    textAnchor: "middle",
    className: "ff-map__place"
  }, "Viewing area"), React.createElement("text", {
    x: "250",
    y: "200",
    textAnchor: "middle",
    className: "ff-map__small"
  }, "near El Capitan Picnic Area"), React.createElement("text", {
    x: "250",
    y: "216",
    textAnchor: "middle",
    className: "ff-map__small"
  }, "vault toilets"), React.createElement("rect", {
    x: "740",
    y: "116",
    width: "34",
    height: "34",
    rx: "3",
    className: "ff-map__p"
  }), React.createElement("text", {
    x: "757",
    y: "139",
    textAnchor: "middle",
    className: "ff-map__pmark"
  }, "P"), React.createElement("text", {
    x: "757",
    y: "180",
    textAnchor: "middle",
    className: "ff-map__place"
  }, "Yosemite Falls parking"), React.createElement("text", {
    x: "757",
    y: "200",
    textAnchor: "middle",
    className: "ff-map__small"
  }, "beside Yosemite Valley Lodge"), React.createElement("text", {
    x: "510",
    y: "78",
    textAnchor: "middle",
    className: "ff-map__walklabel"
  }, "walk about 1.5 mi on the pedestrian lane · 40 to 50 min with gear"), React.createElement("rect", {
    x: "330",
    y: "146",
    width: "340",
    height: "30",
    rx: "3",
    className: "ff-map__ban"
  }), React.createElement("text", {
    x: "500",
    y: "166",
    textAnchor: "middle",
    className: "ff-map__banlabel"
  }, "NO PARKING · NO STOPPING · NO DROP-OFFS"), React.createElement("text", {
    x: "300",
    y: "296",
    className: "ff-map__nostoplabel"
  }, "no stopping, El Cap Crossover to Swinging Bridge"), React.createElement("rect", {
    x: "870",
    y: "250",
    width: "34",
    height: "34",
    rx: "3",
    className: "ff-map__p"
  }), React.createElement("text", {
    x: "887",
    y: "273",
    textAnchor: "middle",
    className: "ff-map__pmark"
  }, "P"), React.createElement("text", {
    x: "860",
    y: "362",
    textAnchor: "end",
    className: "ff-map__place"
  }, "Overflow: Yosemite Village, Curry Village"), React.createElement("text", {
    x: "860",
    y: "382",
    textAnchor: "end",
    className: "ff-map__small"
  }, "free shuttle to Yosemite Falls and Valley Lodge"), React.createElement("text", {
    x: "40",
    y: "412",
    className: "ff-map__small"
  }, "Schematic, not to scale. West is left. Stay on the pavement; the meadows are closed."));
}
function FirefallPage({
  go
}) {
  var [elPortal, mariposa] = FF_TOWNS;
  var toc = [["#firefall-book", "Book early"], ["#firefall-stay", "Where to stay"], ["#firefall-tonight", "Is it on tonight?"], ["#firefall-dates", "Dates and times"], ["#firefall-parking", "Parking and the walk"], ["#firefall-day", "Hour by hour"], ["#firefall-bring", "What to bring"], ["#firefall-history", "How the park has run it"], ["#firefall-photography", "Photography"], ["#firefall-faq", "Questions"]];
  return React.createElement("div", {
    className: "page hp-tool hp-firefall"
  }, React.createElement("div", {
    className: "ff-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/horsetail-fall-firefall-glow.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "Horsetail Fall glowing orange at sunset on the east face of El Capitan",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Firefall"
    }],
    eyebrow: "HORSETAIL FALL · EL CAPITAN · EVERY FEBRUARY",
    title: "The Yosemite Firefall",
    intro: "For about two weeks each February, the last light of the day can turn Horsetail Fall into a ribbon of orange on El Capitan. It is real, it is brief, and most evenings it does not happen. This page covers the whole trip: the dates, the odds, the rooms, the walk, the weather, and what to wear while you wait.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "firefall_head",
      className: "hp-button",
      href: "#firefall-book"
    }, "Find a February room ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "firefall_head",
      className: "hp-link",
      href: "#firefall-tonight"
    }, "Is it on tonight? ↓"))
  }, React.createElement(AffiliateDisclosure, null)), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: Barney Moss / Wikimedia Commons (CC BY 2.0)")), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(FfIcon, {
    name: "sun"
  }), React.createElement("dt", null, "The window"), React.createElement("dd", null, "Mid to late February")), React.createElement("div", null, React.createElement(FfIcon, {
    name: "clock"
  }), React.createElement("dt", null, "The glow"), React.createElement("dd", null, "About ten minutes, at sunset")), React.createElement("div", null, React.createElement(FfIcon, {
    name: "walk"
  }), React.createElement("dt", null, "The walk"), React.createElement("dd", null, "1.5 miles each way, no drop-offs")), React.createElement("div", null, React.createElement(FfIcon, {
    name: "bed"
  }), React.createElement("dt", null, "The rooms"), React.createElement("dd", null, "Book months ahead, not weeks"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(HomeLink, {
    key: href,
    go: go,
    location: "firefall_toc",
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section ff-book-early",
    id: "firefall-book",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "BOOK BEFORE YOU KNOW THE FORECAST"), React.createElement("h2", null, "February is not the slow season. Not these two weeks."), React.createElement("p", {
    className: "ff-lede"
  }, "The rest of the winter is quiet. The firefall window is not. The dates are set by the sun, so every photographer, every Presidents' Day family and everyone who saw the photograph last year is booking the same fourteen nights. Rooms inside the Valley go within days of release. The gateway towns follow, closest first."), React.createElement("p", {
    className: "ff-lede"
  }, "Book the room when you pick the dates, on a rate you can cancel. Watch the weather in the last week, and let the room go if the forecast turns. The reverse, waiting for a good forecast before looking for a bed, is how people end up driving ninety minutes each way in chains.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(FfIcon, {
    name: "alert"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Book a refundable room now."), React.createElement("li", null, "Plan for two or three evenings, not one."), React.createElement("li", null, "Weekdays over weekends, always."), React.createElement("li", null, "Stay on Highway 140 if you can: it gets rain when the others get snow.")), React.createElement(FfBook, {
    town: elPortal,
    list: "firefall_urgency"
  }, "Check El Portal availability ↗"), React.createElement("p", {
    className: "ff-disclosure"
  }, "Availability search on Expedia. We may earn a commission if you book, at no cost to you. ", React.createElement("a", {
    href: "/affiliate"
  }, "Disclosure.")))), React.createElement("ol", {
    className: "ff-timeline"
  }, React.createElement("li", {
    className: "is-gone"
  }, React.createElement("span", null, "About a year out"), React.createElement("strong", null, "In-park rooms open"), React.createElement("p", null, "Yosemite Valley Lodge, The Ahwahnee and Curry Village release on a rolling basis about 366 days ahead. The firefall weekends go almost at once.")), React.createElement("li", {
    className: "is-gone"
  }, React.createElement("span", null, "Late summer to autumn"), React.createElement("strong", null, "El Portal fills"), React.createElement("p", null, "The closest gateway goes first. The Presidents' Day weekend here is usually gone well before winter.")), React.createElement("li", {
    className: "is-tight"
  }, React.createElement("span", null, "Autumn to January"), React.createElement("strong", null, "Mariposa and Midpines fill"), React.createElement("p", null, "The window's dates are the same every year, so planners book on the dates, not the forecast.")), React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "The final weeks"), React.createElement("strong", null, "Cancellations"), React.createElement("p", null, "Check in-park availability daily for cancellations. Groveland and Oakhurst may still have rooms, with a longer drive and more snow.")))), React.createElement("section", {
    className: "ff-band",
    id: "firefall-stay",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "WHERE TO STAY",
    title: "Sleep as close to the walk as you can"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "The glow ends in the dark. Then everyone walks 1.5 miles back to the same lots and drives out on the same road. Every mile closer you sleep is a mile you are not driving at night on a winter highway."), React.createElement("div", {
    className: "ff-stay"
  }, React.createElement("article", {
    className: "ff-inpark"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "INSIDE THE PARK · BOOKS THROUGH THE CONCESSIONER"), React.createElement("h3", null, "Yosemite Valley Lodge"), React.createElement("p", null, "The best-placed bed for the firefall: it sits beside Yosemite Falls parking, where the walk to El Capitan Picnic Area starts. You leave the car where it is and walk back to your room."), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Also in the Valley"), React.createElement("dd", null, "The Ahwahnee, Curry Village")), React.createElement("div", null, React.createElement("dt", null, "Opens"), React.createElement("dd", null, "About 366 days ahead, on a rolling basis")), React.createElement("div", null, React.createElement("dt", null, "Firefall weekends"), React.createElement("dd", null, "Gone within days of release"))), React.createElement("a", {
    className: "ff-ghost",
    href: "https://www.travelyosemite.com/lodging/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Check in-park rooms at Travel Yosemite ↗"), React.createElement("p", {
    className: "ff-note"
  }, "In-park rooms book only through the park concessioner. In the last two weeks, check daily for cancellations.")), React.createElement("div", {
    className: "ff-towns"
  }, FF_TOWNS.map(t => React.createElement("div", {
    className: "ff-town",
    key: t.id
  }, React.createElement("div", {
    className: "ff-town__name"
  }, React.createElement("h3", null, t.name), React.createElement("p", null, React.createElement("strong", null, t.drive), " to the Valley · ", t.road)), React.createElement("div", {
    className: "ff-town__note"
  }, React.createElement("span", {
    className: "ff-tier"
  }, t.tier), React.createElement("p", null, t.note)), React.createElement(FfBook, {
    town: t,
    list: "firefall_town"
  }))), React.createElement("p", {
    className: "ff-note"
  }, React.createElement("strong", null, "Camping:"), " Upper Pines stays open all winter and takes reservations on Recreation.gov. Expect a night in the 20s after a clear firefall evening."), React.createElement("p", {
    className: "ff-note"
  }, "The filled buttons search availability on Expedia; we may earn a commission. The recommendation is the same either way, and no link is to a specific property. ", React.createElement("a", {
    href: "/affiliate"
  }, "How we handle affiliate links."), " Every option compared: ", React.createElement(HomeLink, {
    go: go,
    location: "firefall_stay",
    href: "/stay"
  }, "where to stay"), "."))))), React.createElement("section", {
    className: "hp-wrap hp-section ff-tonight",
    id: "firefall-tonight",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "IS IT ON TONIGHT?"), React.createElement("h2", null, "Check the weather constantly. Then check it again."), React.createElement("p", {
    className: "ff-lede"
  }, "Two of the three conditions change by the hour: water in the fall and cloud on the western horizon. You can see both from anywhere with a signal. Check the night before, the morning of, and again in the early afternoon before you walk in. Expect little or no signal at the viewing area.")), React.createElement("dl", {
    className: "ff-conditions"
  }, React.createElement("div", null, React.createElement(FfIcon, {
    name: "drop",
    size: 24
  }), React.createElement("dt", null, "Water"), React.createElement("dd", null, "Changes daily")), React.createElement("div", null, React.createElement(FfIcon, {
    name: "cloud",
    size: 24
  }), React.createElement("dt", null, "A clear west"), React.createElement("dd", null, "Changes hourly")), React.createElement("div", null, React.createElement(FfIcon, {
    name: "sun",
    size: 24
  }), React.createElement("dt", null, "Sun angle"), React.createElement("dd", null, "Fixed: the dates")))), React.createElement(WebcamStrip, {
    variant: "board",
    only: ["El Capitan", "Half Dome"]
  }), React.createElement("div", {
    className: "ff-camreads"
  }, React.createElement("p", null, React.createElement("strong", null, "El Capitan, from Turtleback Dome: your water check."), " Horsetail runs down the east shoulder of El Capitan. A thin white line there in the morning means the fall is flowing. Bare, dry rock means it is not, whatever the sky does."), React.createElement("p", null, React.createElement("strong", null, "Half Dome, from Ahwahnee Meadow: your cloud check."), " In the morning it shows whether the storm has cleared. By mid-afternoon it shows whether low cloud is settling over the Valley for the evening.")), React.createElement("ol", {
    className: "ff-checks"
  }, React.createElement("li", null, React.createElement(FfIcon, {
    name: "drop"
  }), React.createElement("strong", null, "Morning: is there water?"), React.createElement("p", null, "Open the El Capitan cam before 10 a.m. and look for the streak. The setup that fills the fall: snow on the rim from the last storm, then afternoons above freezing up top.")), React.createElement("li", null, React.createElement(FfIcon, {
    name: "cloud"
  }), React.createElement("strong", null, "Early afternoon: where is the cloud?"), React.createElement("p", null, "Pull up the hourly sky cover for 5 to 6 p.m. and the satellite loop. The deck that ends the show usually sits over the Coast Ranges to the west, which nobody in the Valley can see.")), React.createElement("li", null, React.createElement(FfIcon, {
    name: "sun"
  }), React.createElement("strong", null, "Mid-afternoon: the sky over the Valley"), React.createElement("p", null, "Low grey across the whole Half Dome frame means the sun will not reach the wall. Broken high cloud is fine.")), React.createElement("li", null, React.createElement(FfIcon, {
    name: "clock"
  }), React.createElement("strong", null, "An hour before sunset: stay or go"), React.createElement("p", null, "Clear western horizon and a visible streak: stay. Solid overcast: go and eat, and watch the next evening, since tonight's storm may be tomorrow's water."))), React.createElement("div", {
    className: "ff-clouds"
  }, React.createElement("h3", null, "Some clouds help. A lot of clouds end it."), React.createElement("ul", null, React.createElement("li", {
    className: "is-good"
  }, React.createElement("span", null, "Good"), React.createElement("strong", null, "Clear, or thin high cloud"), React.createElement("p", null, "High, wispy cloud can catch the same light and deepen the color.")), React.createElement("li", {
    className: "is-maybe"
  }, React.createElement("span", null, "Maybe"), React.createElement("strong", null, "Broken cloud, gaps to the west"), React.createElement("p", null, "Wait. The sun can drop into a gap under the deck in the last minutes.")), React.createElement("li", {
    className: "is-no"
  }, React.createElement("span", null, "No show"), React.createElement("strong", null, "A bank on the western horizon"), React.createElement("p", null, "The light never reaches the cliff, even under blue sky overhead. This is the evening that fools people.")), React.createElement("li", {
    className: "is-no"
  }, React.createElement("span", null, "No show"), React.createElement("strong", null, "Overcast or storm"), React.createElement("p", null, "Nothing tonight, but it is filling the fall. The first clear evening after it is the one to be there for.")))), React.createElement("div", {
    className: "ff-sources"
  }, React.createElement("h3", null, "Weather sources to keep open"), React.createElement("ul", null, FF_WEATHER.map(([t, d, h]) => React.createElement("li", {
    key: h
  }, React.createElement("a", {
    href: h,
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, t, " ↗"), React.createElement("span", null, d))))), React.createElement("p", {
    className: "ff-note"
  }, "No gauge measures Horsetail Fall. The USGS gauge on the Merced River at Pohono Bridge is a rough proxy for how much the Valley's walls are shedding: a rising line after a storm is a good sign. ", React.createElement("a", {
    href: "https://waterdata.usgs.gov/monitoring-location/11266500/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Merced River at Pohono Bridge ↗"), " Every live feed on one page: ", React.createElement(HomeLink, {
    go: go,
    location: "firefall_tonight",
    href: "/conditions"
  }, "the conditions board"), "."))), React.createElement("section", {
    className: "ff-band",
    id: "firefall-dates",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "DATES AND TIMES"), React.createElement("h2", null, "When the sun lines up"), React.createElement("p", {
    className: "ff-lede"
  }, "The sun angle is the only one of the three conditions you can put in a calendar, and it is the same every year. The park posts the year's projected window in January; recent windows have run from about the 10th to the 26th."), React.createElement("p", {
    className: "ff-lede"
  }, "The middle week gives the strongest color and the biggest crowd. The edges give a softer glow and more room. Two weekday evenings in the middle of the window beat one Saturday at the peak.")), React.createElement("div", null, React.createElement("figure", {
    className: "ff-sun"
  }, React.createElement("figcaption", null, "Sun-angle strength through February (relative)"), React.createElement(FfSunChart, null), React.createElement("p", {
    className: "ff-note"
  }, "The shape, not a forecast. Water and cloud decide any given evening.")), React.createElement("dl", {
    className: "ff-when"
  }, React.createElement("div", null, React.createElement("dt", null, "Window opens"), React.createElement("dd", null, "About February 10"), React.createElement("p", null, "Color is weak and brief.")), React.createElement("div", null, React.createElement("dt", null, "Strongest color"), React.createElement("dd", null, "About February 17 to 24"), React.createElement("p", null, "Also the most crowded evenings, especially the Presidents' Day weekend.")), React.createElement("div", null, React.createElement("dt", null, "Window closes"), React.createElement("dd", null, "About February 26 to 28"), React.createElement("p", null, "The angle slides off the fall.")), React.createElement("div", null, React.createElement("dt", null, "The glow"), React.createElement("dd", null, "A little before 6 p.m."), React.createElement("p", null, "The last ten to fifteen minutes before sunset.")))))), React.createElement("section", {
    className: "hp-wrap hp-section ff-parking",
    id: "firefall-parking",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "PARKING AND THE WALK",
    title: "You park at Yosemite Falls, and you walk"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "For several years the park has run the firefall the same basic way, reservation or not: the viewing area along Northside Drive has no parking at all, and one lane of the road becomes a footpath from Yosemite Falls parking. Plan the evening around that walk."), React.createElement("figure", {
    className: "ff-map"
  }, React.createElement(FfRoadDiagram, null)), React.createElement("ul", {
    className: "ff-rules"
  }, React.createElement("li", null, React.createElement(FfIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "No parking near the viewing area"), React.createElement("p", null, "Parking, stopping and unloading passengers have been prohibited between Lower Yosemite Fall and El Capitan Crossover. Rangers enforce it.")), React.createElement("li", null, React.createElement(FfIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "No drop-off and circle back"), React.createElement("p", null, "There is nowhere to stop, the loop is long and one-way, and on busy weekends Northside Drive has closed entirely for about half an hour after sunset. Whoever drives walks too.")), React.createElement("li", null, React.createElement(FfIcon, {
    name: "walk",
    size: 26
  }), React.createElement("strong", null, "Everyone walks, carrying everything"), React.createElement("p", null, "Chairs, tripods, cameras, the thermos, the kids. About 1.5 miles each way on the road, in snow some years, and back in the dark.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(FfIcon, {
    name: "pin",
    size: 26
  }), React.createElement("strong", null, "The exception"), React.createElement("p", null, "Vehicles with a disability placard have been allowed to stop in the restricted zone. Check the year's rules for where."))), React.createElement("p", {
    className: "ff-alert"
  }, React.createElement(FfIcon, {
    name: "alert"
  }), React.createElement("span", null, React.createElement("strong", null, "The rules change every winter."), " Reservations were required on peak weekends in 2024 and 2025 and dropped in 2026. The park publishes the year's plan on its ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/horsetailfall.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Horsetail Fall page"), ", usually in January. Read it before you drive in."))), React.createElement("section", {
    className: "ff-band",
    id: "firefall-day",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE DAY, HOUR BY HOUR"), React.createElement("h2", null, "What time to get there"), React.createElement("p", {
    className: "ff-lede"
  }, "A firefall evening takes the whole afternoon. Most of it is waiting in the cold for ten minutes of light, and the people who enjoy it planned for the waiting."), React.createElement("figure", {
    className: "ff-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/el-capitan-snow-spring.jpg",
    alt: "El Capitan above snow on the Valley floor",
    sizes: "(max-width: 760px) calc(100vw - 40px), 520px"
  }), React.createElement("figcaption", null, "Photo: Anita Ritenour / Wikimedia Commons (CC BY 2.0)"))), React.createElement("ol", {
    className: "ff-hours"
  }, React.createElement("li", null, React.createElement("span", null, "The night before"), React.createElement("p", null, "Check the hourly sky cover for sunset and the storm track. Charge batteries. Pack the car.")), React.createElement("li", null, React.createElement("span", null, "7 a.m."), React.createElement("p", null, "El Capitan cam: is there a white line on the east shoulder? Half Dome cam: has the storm cleared?")), React.createElement("li", null, React.createElement("span", null, "Morning"), React.createElement("p", null, "Drive in. Carry chains; after a storm they can be required on the approach roads and in the park. There is no gas in Yosemite Valley.")), React.createElement("li", null, React.createElement("span", null, "Noon to 1 p.m."), React.createElement("p", null, "Park at Yosemite Falls on a weekend; the lot fills in the early afternoon. Weekdays give you more slack.")), React.createElement("li", null, React.createElement("span", null, "1:30 to 3 p.m."), React.createElement("p", null, "Last forecast check while you have a signal. Walk the 1.5 miles. Photographers claim tripod spots now.")), React.createElement("li", null, React.createElement("span", null, "4:30 p.m."), React.createElement("p", null, "Casual viewers: be in place at least an hour before sunset. Put the layers on before you get cold, not after.")), React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "Just before sunset"), React.createElement("p", null, "The glow builds, peaks just before the sun sets, and is gone within about ten minutes.")), React.createElement("li", null, React.createElement("span", null, "After sunset"), React.createElement("p", null, "Headlamps on. On busy weekends the road may stay closed for about half an hour. Walk out, then expect a slow line of cars leaving the Valley."))))), React.createElement("section", {
    className: "hp-wrap hp-section ff-bring",
    id: "firefall-bring",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT TO BRING"), React.createElement("h2", null, "Dress for standing still, not for hiking"), React.createElement("p", {
    className: "ff-lede"
  }, "February on the Valley floor at 4,000 feet can be two different trips. Pack for both until the last forecast, because the walk in happens in one and the walk out in the other.")), React.createElement("div", {
    className: "ff-weeks"
  }, React.createElement("div", null, React.createElement(FfIcon, {
    name: "sun",
    size: 24
  }), React.createElement("strong", null, "A clear week"), React.createElement("p", null, "Warm in the afternoon sun on the walk in, near freezing by the walk out. Layers you can take off and put back on.")), React.createElement("div", null, React.createElement(FfIcon, {
    name: "therm",
    size: 24
  }), React.createElement("strong", null, "A storm week"), React.createElement("p", null, "Snow at the viewing area, the teens and twenties after dark, and chains on the drive in. Snow pants, and a pad under the chair.")))), React.createElement("div", {
    className: "ff-kit"
  }, React.createElement("div", {
    className: "ff-gear"
  }, React.createElement("div", {
    className: "ff-gear__head"
  }, React.createElement("h3", null, "The layers"), React.createElement("p", null, "Picks from Patagonia")), React.createElement("ul", null, FF_GEAR.map(g => React.createElement("li", {
    key: g.id
  }, React.createElement("div", null, React.createElement("strong", null, g.what), React.createElement("p", null, g.why)), React.createElement("a", {
    className: "ff-gear__link",
    href: window.buildAffiliateLink ? window.buildAffiliateLink("patagonia", `https://www.patagonia.com/search/?q=${g.q.replace(/ /g, "+")}`) : `https://www.patagonia.com/search/?q=${g.q.replace(/ /g, "+")}`,
    target: "_blank",
    rel: "sponsored noopener",
    "data-aff-network": "patagonia",
    "data-aff-list": "firefall_gear",
    "data-aff-item-slug": g.id,
    "data-aff-name": g.what
  }, g.label, " ↗")))), React.createElement("p", {
    className: "ff-note"
  }, "Patagonia links are affiliate links; we may earn a commission. Any warm synthetic or down jacket does the same job. ", React.createElement("a", {
    href: "/affiliate"
  }, "Our affiliate policy."))), React.createElement("div", {
    className: "ff-else"
  }, React.createElement("h3", null, "Everything else"), React.createElement("ul", null, FF_KIT.map(k => React.createElement("li", {
    key: k
  }, React.createElement(FfIcon, {
    name: "check",
    size: 18
  }), k)))))), React.createElement("section", {
    className: "ff-band",
    id: "firefall-history",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "HOW THE PARK HAS RUN IT",
    title: "From a photographers' secret to a managed event"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "Recent years have each had a different rule on entry and the same rule on the road. What that means for planning: expect the walk, expect enforcement, and expect weather to take some of the window."), React.createElement("ol", {
    className: "ff-history"
  }, FF_HISTORY.map(([year, title, text]) => React.createElement("li", {
    key: year
  }, React.createElement("span", null, year), React.createElement("strong", null, title), React.createElement("p", null, text)))))), React.createElement("section", {
    className: "hp-wrap hp-section ff-split",
    id: "firefall-photography",
    tabIndex: -1
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "PHOTOGRAPHY"), React.createElement("h2", null, "A thin ribbon on a huge wall"), React.createElement("p", {
    className: "ff-lede"
  }, "The classic frames are shot at 100mm and longer, tight on the fall. The good light is dim light, so bring a tripod, expose for the orange, and let the wall go dark. Compose before it starts: ten minutes is not long. A phone renders the fall as a faint thread on a big grey cliff, so take one picture and then watch. More on where the same February light works: ", React.createElement(HomeLink, {
    go: go,
    location: "firefall_photo",
    href: "/articles/yosemite-photography-spots"
  }, "the photography guide"), ".")), React.createElement("dl", {
    className: "ff-photo-facts"
  }, React.createElement("div", null, React.createElement("dt", null, "Lens"), React.createElement("dd", null, "100 to 400mm")), React.createElement("div", null, React.createElement("dt", null, "Support"), React.createElement("dd", null, "Tripod, remote release")), React.createElement("div", null, React.createElement("dt", null, "Exposure"), React.createElement("dd", null, "For the highlights")), React.createElement("div", null, React.createElement("dt", null, "Phone"), React.createElement("dd", null, "Take one, then watch")))), React.createElement("section", {
    className: "ff-band",
    id: "firefall-faq",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Firefall questions, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "The long version, with the history and the naturalist's case for February with or without the show: ", React.createElement(HomeLink, {
    go: go,
    location: "firefall_faq",
    href: "/articles/horsetail-fall-firefall"
  }, "the complete firefall guide"), "."), React.createElement("div", {
    className: "ff-closing"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "STILL NO ROOM?"), React.createElement("h3", null, "Search the whole Highway 140 corridor"), React.createElement("p", null, "El Portal, Midpines and Mariposa sit on the road that gets rain when the others get snow, and it is the corridor with year-round bus service into the park."), React.createElement(FfBook, {
    town: mariposa,
    list: "page_firefall"
  }, "Search Highway 140 lodging ↗"))), React.createElement("div", {
    className: "ff-faq"
  }, FF_FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement(HpGuideBand, {
    go: go,
    location: "firefall",
    title: "Planning the February trip around it?",
    intro: "The Field Guide app carries the winter stops, parking notes for the viewing areas, offline maps for a park with no signal, and a day-by-day planner for the rest of the trip.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "February, watched from inside the park",
    heading: "February, watched from inside the park",
    blurb: "Sunday Field Notes carries the firefall window as it develops: water in the fall, the week's weather, and what the rules are this year.",
    location: "firefall",
    tag: "firefall"
  }));
}
window.FirefallPage = FirefallPage;
