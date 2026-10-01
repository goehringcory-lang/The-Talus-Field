window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["yosemite-wildflowers-guide"] = function YosemiteWildflowersBody() {
  var AXIS = {
    fontFamily: "var(--sans)",
    fontSize: 12.5,
    fill: "var(--ink-3)"
  };
  var ROW = {
    fontFamily: "var(--serif)",
    fontSize: 16,
    fill: "var(--ink)"
  };
  var ELEV = {
    fontFamily: "var(--sans)",
    fontSize: 12,
    fill: "var(--ink-3)"
  };
  var INBAR = {
    fontFamily: "var(--sans)",
    fontSize: 12.5,
    fill: "var(--paper)",
    fontWeight: 600
  };
  var svgStyle = {
    width: "100%",
    height: "auto",
    display: "block"
  };
  var MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  var BANDS = [{
    name: "High country",
    elev: "8,000 to 10,000 ft",
    from: 5,
    to: 6,
    what: "Tuolumne Meadows"
  }, {
    name: "Middle elevations",
    elev: "6,000 to 8,000 ft",
    from: 3,
    to: 5,
    what: "McGurk, Crane Flat, lupine"
  }, {
    name: "Valley floor",
    elev: "about 4,000 ft",
    from: 2,
    to: 4,
    what: "Dogwood, meadows, azalea"
  }, {
    name: "Foothills",
    elev: "1,500 to 3,000 ft",
    from: 0,
    to: 2,
    what: "Redbud, then poppies"
  }];
  function BloomWave() {
    var W = 680,
      L = 168,
      R = 8,
      T = 34,
      rowH = 58,
      H = T + rowH * BANDS.length + 8;
    var col = (W - L - R) / MONTHS.length;
    var barY = i => T + i * rowH + 12;
    var start = BANDS.map((b, i) => [L + b.from * col + 6, barY(i) + 17]).reverse();
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: svgStyle,
      role: "img",
      "aria-label": "Chart of the Yosemite wildflower bloom climbing the mountain. Foothills, 1,500 to 3,000 feet: February to April, redbud then poppies. Valley floor, about 4,000 feet: April to June, dogwood, meadow flowers and azalea. Middle elevations, 6,000 to 8,000 feet: May to July, McGurk Meadow, Crane Flat and lupine. High country, 8,000 to 10,000 feet: July and August, Tuolumne Meadows."
    }, React.createElement("defs", null, React.createElement("marker", {
      id: "tfWaveHead",
      viewBox: "0 0 10 10",
      refX: "8",
      refY: "5",
      markerWidth: "7",
      markerHeight: "7",
      orient: "auto-start-reverse"
    }, React.createElement("path", {
      d: "M0 0 L10 5 L0 10 z",
      fill: "var(--rust)"
    }))), MONTHS.map((m, i) => React.createElement("g", {
      key: m
    }, React.createElement("line", {
      x1: L + i * col,
      x2: L + i * col,
      y1: T - 6,
      y2: H - 8,
      stroke: "var(--rule-soft)",
      strokeWidth: "1"
    }), React.createElement("text", {
      x: L + i * col + col / 2,
      y: T - 12,
      textAnchor: "middle",
      style: AXIS
    }, m))), BANDS.map((b, i) => React.createElement("g", {
      key: b.name
    }, React.createElement("text", {
      x: 0,
      y: barY(i) + 15,
      style: ROW
    }, b.name), React.createElement("text", {
      x: 0,
      y: barY(i) + 32,
      style: ELEV
    }, b.elev), React.createElement("rect", {
      x: L + b.from * col + 3,
      y: barY(i),
      width: (b.to - b.from + 1) * col - 6,
      height: 34,
      rx: "3",
      fill: "var(--moss)"
    }), React.createElement("text", {
      x: L + b.from * col + 14,
      y: barY(i) + 22,
      style: INBAR
    }, b.what))), React.createElement("polyline", {
      points: start.map(p => p.join(",")).join(" "),
      fill: "none",
      stroke: "var(--rust)",
      strokeWidth: "1.6",
      strokeDasharray: "5 4",
      markerEnd: "url(#tfWaveHead)",
      transform: "translate(-10 0)"
    }));
  }
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "dropcap"
  }, "I live in El Portal, in the Merced River canyon at about 2,000 feet, which means my spring starts in February. The ", React.createElement("strong", null, "western redbud"), " goes first: bare gray branches on the canyon walls suddenly covered in small magenta flowers, weeks before a single leaf appears, while the high country above me is still under ten feet of snow. By the time the redbud fades in April, the California poppies have taken over the south-facing slopes. By the time the poppies dry out in May, the dogwoods are blooming on the Valley floor, 2,000 feet above my house. By the time the dogwoods drop their bracts in June, the shooting stars are opening at 8,000 feet. In twenty seasons here I have learned to think of the bloom not as an event but as a wave, one that starts in the canyon in late winter and takes five months to climb the mountain."), React.createElement("p", null, "This is the most useful thing to know about Yosemite wildflowers, and few visitors arrive knowing it. Visitors ask when the flowers bloom, expecting a date. The answer depends on elevation. The park runs from about 2,000 feet at the Arch Rock entrance to over 13,000 feet at its highest peaks, and spring moves uphill at a rate of very roughly a thousand feet a month. There is a bloom happening somewhere in or near the park from February through August. You just have to drive to the right altitude."), React.createElement("blockquote", null, "In Yosemite, the bloom is not a date. It is an elevation."), React.createElement("p", null, "Here is the wave, bottom to top, with where to stand when it passes."), React.createElement("figure", {
    style: {
      margin: "30px 0 34px"
    }
  }, React.createElement(BloomWave, null), React.createElement("figcaption", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      marginTop: 10
    }
  }, "The bloom climbs about a thousand feet a month. Drawn from the bands and months in this article; bars are approximate and a wet or dry year moves every one of them.")), React.createElement("h2", null, "February to April: the foothills, 1,500 to 3,000 feet"), React.createElement("p", null, "The earliest show is not in the park proper. It is on the drive in, along ", React.createElement("strong", null, "Highway 140"), " through the Merced River canyon between Mariposa and the Arch Rock entrance. This stretch of canyon is low, hot, and south-facing in long sections, and it wakes up while the rest of the Sierra is still winter."), React.createElement("p", null, "Redbud is the opening act, usually late February into March, and it is easy to catch because you cannot miss it: the shrubs grow right along the highway and glow magenta against gray granite and green river. Then come the ", React.createElement("strong", null, "California poppies"), ", along with goldfields, fiddlenecks, popcorn flower, and baby blue eyes, painting the canyon slopes through March and April. In a wet year the poppy displays on the walls above the Merced are the most concentrated color the region produces all year."), React.createElement("p", null, "The classic foothill walk is the ", React.createElement("strong", null, "Hite Cove trail"), ", which leaves Highway 140 near Savage's Trading Post and follows the South Fork of the Merced. It sits on national forest land just outside the park boundary, and in a good March it is one of the better poppy walks in the Sierra foothills. The 2018 Ferguson Fire burned through this country, and the slopes have come back in flowers, which is not a coincidence. More on fire below."), React.createElement("p", null, "The practical point: if you are ", React.createElement("a", {
    href: "/articles/yosemite-in-march"
  }, "visiting in March"), " or early April, when the Valley's waterfalls are just warming up and the high country is closed, the flowers are below the park. Slow down on the drive in. Use the turnouts."), React.createElement("h2", null, "April to June: the Valley floor, 4,000 feet"), React.createElement("p", null, "The Valley bloom is the one most visitors actually see, and its centerpiece is a tree, not a meadow. The ", React.createElement("strong", null, "Pacific dogwood"), " blooms from mid-April into May, an understory tree that spends most of the year invisible among the pines and then covers itself in broad white blossoms. Strictly speaking the white parts are bracts, modified leaves, not petals; the true flowers are the small greenish cluster at the center. The effect is the same either way: floating layers of white under the conifers, best along the Merced between Pohono Bridge and the chapel, and it happens to peak in the same weeks the ", React.createElement("a", {
    href: "/articles/yosemite-waterfalls-guide"
  }, "waterfalls"), " do. Late April and May in the Valley is dogwood over whitewater, and it is the best two-for-one in the park's calendar."), React.createElement("p", null, "The Valley meadows follow. ", React.createElement("strong", null, "Cook's Meadow"), " and ", React.createElement("strong", null, "El Capitan Meadow"), " green up in April and carry flowers into June: buttercups and violets early, then larkspur, cow parsnip standing shoulder high, milkweed that will feed monarch caterpillars in summer. None of it is a wall of color. Valley meadow blooms are patchy, mixed into tall grass, and better appreciated from the boardwalk at a walking pace than through a windshield. The flat paved loops through Cook's Meadow also make this the most accessible bloom in the park, a fair answer for anyone planning around ", React.createElement("a", {
    href: "/articles/yosemite-for-non-hikers"
  }, "limited hiking"), "."), React.createElement("p", null, "Early summer brings the Valley's most fragrant flower, the ", React.createElement("strong", null, "western azalea"), ", which blooms white and pale pink in wet meadow edges in June, often when the crowds have already turned their attention uphill. You usually smell it before you see it. If your trip lands in ", React.createElement("a", {
    href: "/articles/yosemite-in-june"
  }, "June"), ", the azaleas along the meadow margins are worth a detour on their own."), React.createElement("h2", null, "May to July: the middle elevations, 6,000 to 8,000 feet"), React.createElement("p", null, "As the Valley dries out, the wave climbs into the forest belt, and here the geography matters: at these elevations the bloom concentrates almost entirely in meadows, because the forest itself blooms sparsely. A mature conifer stand is a dark place. Very little sunlight reaches the ground, and the trees take most of the water. A meadow is the opposite: full sun all day and soil that stays wet into midsummer, often because a creek runs through it or the water table sits just under the sod. Light plus water is the whole formula. Yosemite's meadows cover roughly three percent of the park and hold a wildly disproportionate share of its flowering plants, which number more than 1,400 species parkwide."), React.createElement(NatureNotesFilm, {
    id: "wildflowers",
    title: "Wildflowers",
    youtubeId: "HFpvV7ZjvYA",
    episode: 1,
    note: "The Park Service's own short on the same idea: hundreds of species, one schedule, set by elevation.",
    location: "article"
  }), React.createElement("p", null, React.createElement("strong", null, "McGurk Meadow"), " is my standard recommendation in this band. The trailhead is a small pullout on ", React.createElement("a", {
    href: "/articles/glacier-point-road-open-2026"
  }, "Glacier Point Road"), ", and an easy mile of forest walking drops you at a long meadow around 7,000 feet with an old cabin at its edge. Shooting stars early in the season, then lupine, corn lilies, and paintbrush as summer settles in. Peak is usually late June into July, a few weeks after the road opens. Most Glacier Point traffic drives right past the pullout, which is part of the appeal."), React.createElement("p", null, React.createElement("strong", null, "Crane Flat"), ", at about 6,200 feet where the Tioga Road leaves Big Oak Flat Road, blooms in June and early July and can be surveyed from a parked car. The ", React.createElement("strong", null, "Wawona Meadow loop"), ", a flat three-and-a-half-mile circuit behind the Wawona Hotel, runs a long season from May into July and doubles as one of the only trails in the park where a leashed dog is legal."), React.createElement("p", null, "This band is also where you see ", React.createElement("strong", null, "fire followers"), ". Several Sierra plants are adapted to bloom hard after a burn: their seeds wait in the soil for decades until fire clears the canopy and chemical cues in smoke and charred wood trigger germination. The most visible result is lupine. In the years after the 2013 Rim Fire, whole hillsides along Big Oak Flat Road turned solid purple, a display that did not exist before the burn and will fade as the forest closes back in. A burned slope three or four Junes after the fire is often the best flower show at its elevation. It is worth recalibrating your eye to see burn scars that way."), React.createElement("h2", null, "July and August: the high country, 8,000 to 10,000 feet"), React.createElement("p", null, "The wave arrives last at the top, and it is in a hurry. Above 8,000 feet the growing season is roughly six weeks long. Snow lingers into July, frost returns in September, and everything that grows, blooms, and sets seed must do it in the gap. The result is the most compressed and, to my eye, the most intense bloom in the park."), React.createElement("p", null, React.createElement("strong", null, "Tuolumne Meadows"), ", at 8,600 feet along ", React.createElement("a", {
    href: "/articles/tioga-road-opening-weekend"
  }, "Tioga Road"), ", is the headline: one of the largest subalpine meadows in the Sierra, purple with Lemmon's paintbrush and little elephant's head in July, gentians closing out the season in August. ", React.createElement("strong", null, "Lukens Lake"), ", reached by an easy mile of trail from Tioga Road, is the single most reliable set piece I know: in mid-July the wet meadow at the lake's west end turns into a field of ", React.createElement("strong", null, "shooting stars"), ", thousands of small magenta flowers with swept-back petals, all nodding the same direction. It lasts about two weeks. I have hiked in a week late and found green where the pink had been."), React.createElement("p", null, "Look down as well as out. In the decomposed granite between slabs, where there is no soil to speak of, ", React.createElement("strong", null, "pussypaws"), " spread their low pink clusters flat against the gravel, and ridgelines carry mats of penstemon and phlox an inch tall. Alpine plants grow low because wind and cold punish anything that stands up. The flowers along the ", React.createElement("a", {
    href: "/articles/cathedral-lakes-day-hike"
  }, "Cathedral Lakes trail"), " in late July are a fine crash course in the whole strategy."), React.createElement("h2", null, "Manners, and a word about trampling"), React.createElement("p", null, "Two rules, both absolute. ", React.createElement("strong", null, "Never pick anything."), " It is illegal in a national park, and a picked flower is a plant that sets no seed in a growing season that, up high, allows no second chance. ", React.createElement("strong", null, "Stay on trails and boardwalks in meadows."), " Meadow sod is wet, soft, and slow to heal; a social trail stamped into a subalpine meadow by one summer of photographers can take a decade to close. The park's meadow restoration crews spend real money undoing footprints."), React.createElement("h2", null, "Honest expectations"), React.createElement("p", null, "Yosemite is not a superbloom park. If you have seen photographs of desert valleys carpeted horizon to horizon in orange, leave that image at home. The Sierra bloom is longer, quieter, and more dispersed: a canyon wall of poppies in March, a white tree over a green river in May, a meadow gone purple for two weeks in July. It is also hard to miss. Because the bloom climbs, there is no month between March and August without one, and a single long day in early summer can drive through three of them: azaleas on the Valley floor in the morning, lupine at McGurk at midday, the first shooting stars at Lukens Lake before dinner. Build the elevation into the plan, the way you would build in the ", React.createElement("a", {
    href: "/map"
  }, "driving"), ", and the mountain will meet you with something open."), React.createElement("h3", null, "Sources"), React.createElement("ul", {
    style: {
      fontSize: 14
    }
  }, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/nature/plants.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Plants, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/nature/meadows.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Meadows, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://yosemite.org/incredible-wildflowers-that-bloom-in-yosemite/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Where to Find Wildflowers in Yosemite, Yosemite Conservancy")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.fs.usda.gov/recarea/sierra/recarea/?recid=10778",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Hite Cove Trail, Sierra National Forest"))));
};
