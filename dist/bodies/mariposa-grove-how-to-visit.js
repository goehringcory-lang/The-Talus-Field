window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["mariposa-grove-how-to-visit"] = function MariposaGroveHowToVisitBody() {
  var SMALL = {
    fontFamily: "var(--sans)",
    fontSize: 12.5,
    fill: "var(--ink-3)"
  };
  var LABEL = {
    fontFamily: "var(--sans)",
    fontSize: 13,
    fill: "var(--ink-2)"
  };
  var PLACE = {
    fontFamily: "var(--serif)",
    fontSize: 16,
    fill: "var(--ink)"
  };
  var MARK = {
    fontFamily: "var(--sans)",
    fontSize: 14,
    fontWeight: 700,
    fill: "var(--paper)"
  };
  var HEAD = {
    fontFamily: "var(--sans)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 1.4,
    fill: "var(--rust)"
  };
  var svgStyle = {
    width: "100%",
    height: "auto",
    display: "block"
  };
  var WALKS = [{
    name: "Big Trees Loop",
    mi: 0.3,
    note: "0.3 mi, paved, flat, wheelchair accessible"
  }, {
    name: "Grizzly Giant Loop",
    mi: 2,
    note: "about 2 mi, the one to do if you do one"
  }, {
    name: "Guardians Loop",
    mi: 6.5,
    note: "about 6.5 mi, 1,000+ ft of gain"
  }, {
    name: "Wawona Point",
    mi: 7.75,
    note: "about 7.75 mi round trip, ends at a view"
  }];
  function GroveMap() {
    return React.createElement("div", {
      className: "npsmap__frame"
    }, React.createElement("img", {
      src: "/img/nps-mariposa-grove-map.jpg",
      width: "840",
      height: "540",
      loading: "lazy",
      decoding: "async",
      alt: "National Park Service map of the south end of Yosemite: Highway 41 entering at the South Entrance, Mariposa Grove Road running east to the Mariposa Grove, and Wawona to the northwest."
    }), React.createElement("svg", {
      viewBox: "0 0 840 540",
      role: "img",
      "aria-label": "Markers on the map. One, the South Entrance on Highway 41; the Welcome Plaza parking is the first right at the roundabout, less than a quarter mile in. Two, the Mariposa Grove, two miles up Mariposa Grove Road, which is closed to private vehicles in season; a free shuttle runs about every fifteen minutes and takes about ten minutes. Vehicles with a disability placard may drive the road. The Washburn Trail walks the same two miles."
    }, React.createElement("circle", {
      cx: "363",
      cy: "341",
      r: "15",
      className: "npsmap__pin npsmap__pin--ink"
    }), React.createElement("text", {
      x: "363",
      y: "347",
      textAnchor: "middle",
      className: "npsmap__num"
    }, "1"), React.createElement("circle", {
      cx: "458",
      cy: "358",
      r: "15",
      className: "npsmap__pin npsmap__pin--rust"
    }), React.createElement("text", {
      x: "458",
      y: "364",
      textAnchor: "middle",
      className: "npsmap__num"
    }, "2")));
  }
  function GroveWalks() {
    var W = 680,
      H = 300,
      x0 = 40;
    var scaleL = 170,
      scaleW = 470,
      mx = mi => scaleL + mi / 8 * scaleW;
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: svgStyle,
      role: "img",
      "aria-label": "The four walks from the Arrival Area, by length: the Big Trees Loop, 0.3 miles; the Grizzly Giant Loop, about 2 miles; the Guardians Loop, about 6.5 miles; and the trail to Wawona Point, about 7.75 miles round trip."
    }, React.createElement("text", {
      x: x0,
      y: 20,
      style: HEAD
    }, "THE FOUR WALKS FROM THE ARRIVAL AREA, BY LENGTH"), [0, 1, 2, 3, 4, 5, 6, 7, 8].map(m => React.createElement("g", {
      key: m
    }, React.createElement("line", {
      x1: mx(m),
      x2: mx(m),
      y1: 34,
      y2: H - 30,
      stroke: "var(--rule-soft)"
    }), React.createElement("text", {
      x: mx(m),
      y: H - 12,
      textAnchor: "middle",
      style: SMALL
    }, m === 8 ? "8 mi" : m))), WALKS.map((w, i) => {
      var wy = 44 + i * 58;
      return React.createElement("g", {
        key: w.name
      }, React.createElement("text", {
        x: x0,
        y: wy + 15,
        style: {
          ...LABEL,
          fill: "var(--ink)"
        }
      }, w.name), React.createElement("rect", {
        x: scaleL,
        y: wy,
        width: Math.max(4, mx(w.mi) - scaleL),
        height: 20,
        rx: "2",
        fill: i === 1 ? "var(--rust)" : "var(--moss)"
      }), React.createElement("text", {
        x: scaleL,
        y: wy + 38,
        style: SMALL
      }, w.note));
    }));
  }
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "dropcap"
  }, "Most visitors arrive at the Mariposa Grove with the same wrong plan: they intend to drive to the trees. You cannot, not in summer, and not since 2018. The parking is two miles down the hill by the South Entrance and a free shuttle covers the gap. Nearly everything else that goes wrong on a grove day follows from not knowing that one fact, so this piece starts there and works outward."), React.createElement("h2", null, "The geography, which is the whole problem"), React.createElement("p", null, "The grove sits in the park's southern corner, immediately inside the South Entrance on Highway 41. It is not near Yosemite Valley. From the Valley floor it is about an hour and a quarter of driving each way, which is the single most underestimated number in this article. For the same reason the grove is the natural stop on a day that leaves Yosemite for ", React.createElement("a", {
    href: "/articles/yosemite-sequoia-kings-canyon-trip"
  }, "Sequoia and Kings Canyon"), ", south on Highway 41."), React.createElement("p", null, "Once you are through the entrance station you reach a roundabout almost at once, and the ", React.createElement("strong", null, "Mariposa Grove Welcome Plaza"), " is the first right, less than a quarter mile in. That is where you park. The grove itself, what the Park Service calls the Arrival Area, is another two miles up Mariposa Grove Road, and in season that road is closed to private vehicles. A free shuttle covers the two miles. The rule is not relaxed on quiet days. It is the permanent arrangement the 2018 restoration created, for reasons covered below."), React.createElement("figure", {
    className: "npsmap",
    style: {
      margin: "30px 0 34px"
    }
  }, React.createElement(GroveMap, null), React.createElement("figcaption", null, React.createElement("span", null, React.createElement("b", null, "1"), " South Entrance, Highway 41. The Welcome Plaza parking is the first right at the roundabout, under a quarter mile in, too small to show at this scale."), React.createElement("span", null, React.createElement("b", null, "2"), " The grove, two miles up Mariposa Grove Road. Free shuttle about every 15 min, about 10 min up, no reservation; closed to private cars in season, and a disability placard may drive it. The Washburn Trail walks the same two miles."), React.createElement("span", null, "Map: National Park Service (public domain), cropped."))), React.createElement("figure", {
    style: {
      margin: "0 0 34px"
    }
  }, React.createElement(GroveWalks, null), React.createElement("figcaption", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      marginTop: 10
    }
  }, "The four walks, drawn from the distances in this article. Upper-grove distances vary between sources; read the map at the Arrival Area before the long walks.")), React.createElement("h2", null, "The shuttle"), React.createElement("p", null, "It is free, there is no ticket, and individual riders need no reservation. Buses run roughly every fifteen minutes and take about ten minutes to cover the two miles. They are wheelchair accessible, with lifts and tie-downs, and chair users board first."), React.createElement("p", null, "The Park Service's standing language is that the shuttle begins no earlier than April 15 and ends on or before November 30, and it posts the hours year by year. For 2026 they run 8 a.m. to 7 p.m. from May 3 through September 23 (last bus leaves the grove at 8 p.m.), 8 a.m. to 5 p.m. from September 24 through October 31, weather permitting (last bus at 5:30 p.m.), and 8 a.m. to 3:30 p.m. in November, weather permitting (last bus at 5 p.m.). There is no shuttle from December 1 until at least April 15."), React.createElement("p", null, "Buses and vehicles over about twenty-one feet must reserve grove parking through recreation.gov, and that reservation window this year runs May 3 through November 30. Check the posted hours at the plaza when you arrive, and note the last downhill departure before you walk away from the stop. People miss it, and the walk down is two miles."), React.createElement(Placeholder, {
    caption: "The Grizzly Giant standing above the fenced loop trail in the Mariposa Grove, with second-growth conifers filling the gaps around it",
    image: "img/mariposa-grove-grizzly-giant-nieves.jpg",
    credit: "Photo: Nieves / Pexels",
    tag: "PLATE I",
    size: "lg",
    style: {
      aspectRatio: "3 / 4",
      margin: "32px 0",
      maxWidth: "620px"
    },
    motif: React.createElement(MotifTrees, null)
  }), React.createElement("h2", null, "If you hold a disability placard"), React.createElement("p", null, "The road closure has an exception. A vehicle displaying a disability placard or plate may drive Mariposa Grove Road to the Arrival Area, and there is accessible parking at the top. The spaces are described by the Park Service as very limited, which in practice means a handful, so this is a privilege that works best early in the day. The Big Trees Loop at the top is paved and flat, which makes the grove one of the more rewarding accessible destinations in the park. ", React.createElement("a", {
    href: "/articles/yosemite-accessibility-guide"
  }, "The accessibility guide"), " covers what the placard does and does not get you elsewhere in Yosemite."), React.createElement("h2", null, "Walking up instead"), React.createElement("p", null, "You can also walk from the plaza to the grove on the Washburn Trail, which climbs roughly two miles and about 500 feet through mixed conifer forest before the first sequoias appear. There are two reasons to do it. First, the shuttle queue on an August afternoon can be long enough that walking is competitive. Second, on foot you watch the forest change as the sequoias appear."), React.createElement("h2", null, "The four walks, in order of ambition"), React.createElement("p", null, React.createElement("strong", null, "The Big Trees Loop."), " Three tenths of a mile, paved and boardwalked, flat, wheelchair accessible, starting from the Arrival Area. It passes the Fallen Monarch, the toppled sequoia whose upturned root mass appears in one of the most reproduced photographs in the park's history, a US Cavalry troop and their horses drawn up along the trunk. If someone in your group cannot walk far, this is the loop that still gives them the grove."), React.createElement("p", null, React.createElement("strong", null, "The Grizzly Giant Loop."), " About two miles with a few hundred feet of climbing, and the one to do if you are only doing one. It takes in the Bachelor and Three Graces, the Grizzly Giant itself, and the California Tunnel Tree. Two hours is a comfortable allowance, including time spent stopping at the trees."), React.createElement("p", null, React.createElement("strong", null, "The Guardians Loop."), " Six and a half miles or so into the upper grove, with about a thousand feet of gain. This is where the crowds thin to almost nothing, and where the Telescope Tree, the fallen Wawona Tunnel Tree and the Mariposa Grove Cabin are. Give it however long you would normally give a six-mile hike, then add an hour."), React.createElement("p", null, React.createElement("strong", null, "The Mariposa Grove Trail to Wawona Point."), " About 7.75 miles round trip from the Arrival Area with about 1,200 feet of climbing, past the Faithful Couple and the Clothespin Tree and ending at an overlook above the Wawona basin. It is the full day, and the only one of the four that ends with a view instead of a tree."), React.createElement("p", null, "Distances and gains published for the upper-grove trails vary between sources by enough to matter on a hot afternoon, and some trail-aggregator sites use loop names that do not appear on Park Service signage. Read the map at the Arrival Area before you commit to the long options."), React.createElement("h2", null, "The trees worth knowing by name"), React.createElement("p", null, React.createElement("strong", null, "The Grizzly Giant"), " is the one people come for. The Park Service calls it the 3,000-year-old Grizzly Giant, an age that is an estimate, which is the normal state of affairs for a tree nobody is going to cut down and count. Look at the first big limb rather than the trunk: it is thicker than the whole of most mature trees you have ever stood under, and it shows the scale better than the trunk does."), React.createElement("p", null, React.createElement("strong", null, "The California Tunnel Tree"), " stands a short way past it, cut through in 1895 so that stagecoaches could be photographed driving through it. It is the only living tree in Yosemite you can still walk through. The more famous one, the Wawona Tunnel Tree, was cut in 1881 and fell in 1969 under a heavy snow load, and its stump is up in this same grove. ", React.createElement("a", {
    href: "/articles/yosemite-tunnel-trees"
  }, "The tunnel trees piece"), " is the longer version of that story, which is less about vandalism than about what nineteenth-century Americans thought a national park was for."), React.createElement("p", null, React.createElement("strong", null, "The Bachelor and Three Graces"), " are four trees growing so close that their root systems are effectively one, which is the practical argument for staying on the trail. Sequoia roots are shallow and wide, running out in a plate rather than down in a taproot, and the thing that kills a mature sequoia is almost never fire or disease. It is losing its footing."), React.createElement(NatureNotesFilm, {
    id: "big-trees",
    title: "Big Trees",
    youtubeId: "GBiHAGYJXVQ",
    episode: 11,
    note: "The Park Service on how deep snow and a long growing season build a tree the size of the Grizzly Giant.",
    location: "article"
  }), React.createElement("h2", null, "Winter, when the road closes"), React.createElement("p", null, "Mariposa Grove Road closes to vehicles for the winter at the end of November and reopens when the snow allows, which has meant anywhere from early April onward in recent years. The reopening date moves with the snowpack and is not worth planning around more than a week out; ", React.createElement("a", {
    href: "/articles/yosemite-in-april"
  }, "Yosemite in April"), " plans a spring grove visit as a walk for that reason."), React.createElement("p", null, "The grove itself does not close. The road and the trails stay open to foot travel, and walking, snowshoeing, or skiing the two miles up from the South Entrance makes a quiet February day. You will likely have the Grizzly Giant to yourself. Note that this is not a sanctioned snow-play area; the park's designated sledding hill is at Crane Flat, on the other side of the park. ", React.createElement("a", {
    href: "/articles/yosemite-in-winter"
  }, "The winter guide"), " has the rest of the cold-season picture."), React.createElement("h2", null, "What the 2018 restoration changed, and why"), React.createElement("p", null, "For three years the grove was closed entirely. It reopened on June 15, 2018. What came out: the lower-grove parking lot, the gift shop, the pit toilets, and the commercial tram tours that had run through the trees for decades. Roughly four acres of habitat were restored, boardwalks went in over the wet ground, and the wetland hydrology the roads had interrupted was reconnected. The bill came to about forty million dollars, split evenly between the Park Service and the Yosemite Conservancy."), React.createElement("p", null, "The reason is a single finding from the park's own survey work. Young sequoias in this grove were found mostly in and beside its wet ground. The seeds need bare, wet mineral soil to take. Paving the wet ground and routing traffic across it did not kill the big trees, which is why the damage went unnoticed for a century. It quietly removed the next generation. ", React.createElement("a", {
    href: "/articles/giant-sequoias-fire-adaptation"
  }, "The piece on sequoias and fire"), " is the natural history behind that, and the two failures are related: a grove can look healthy and produce no new trees."), React.createElement("blockquote", null, "The trams are not coming back. That is not a scheduling problem or a budget problem. It is the point of the project."), React.createElement("h2", null, "The rules that catch people out"), React.createElement("p", null, React.createElement("strong", null, "Dogs are not allowed on any trail in the Mariposa Grove, including the paved ones."), " This is the rule that surprises people most, because Yosemite's general policy does allow leashed dogs on paved trails, and the Tuolumne Grove up on Highway 120 permits them on its paved section. The Mariposa Grove is an explicit exception. Dogs are fine in the parking lot and are not allowed on the shuttle, which means one adult stays with the car. ", React.createElement("a", {
    href: "/articles/pets-in-yosemite"
  }, "The pets guide"), " lays out where a dog can and cannot go in this park, and the answer is narrower than most owners expect."), React.createElement("p", null, React.createElement("strong", null, "Food stays within arm's reach."), " The picnic area at the plaza is a well-known bear spot. A daypack left on a table for three minutes is a daypack a bear has learned to check. ", React.createElement("a", {
    href: "/articles/yosemite-bears-safety-guide"
  }, "The bear guide"), " explains why a food-conditioned bear is usually a dead bear, and that is the part that should change how you act."), React.createElement("p", null, React.createElement("strong", null, "Stay on the trail and off the root plates."), " See the Bachelor and Three Graces, above. Compacted soil over a sequoia's roots is a slow injury that nobody watches happen."), React.createElement("p", null, React.createElement("strong", null, "Bikes are allowed on Mariposa Grove Road but never on the trails"), ", and only while the road is open to vehicles."), React.createElement("p", null, React.createElement("strong", null, "Buses and vehicles over about twenty-one feet need their own reservation."), " They book Mariposa Grove parking separately through recreation.gov; private cars do not. There is no separate fee for the grove beyond the park entrance fee, and there is ", React.createElement("a", {
    href: "/articles/yosemite-without-reservations-2026"
  }, "no park-wide vehicle reservation in effect for 2026"), "."), React.createElement("h2", null, "Timing, and the parking lot"), React.createElement("p", null, "The Welcome Plaza has about 300 parking spaces, and the Park Service says it may fill by late morning. It is a smaller number than it sounds, because grove visits are long and the turnover is slow: a lot that holds three hundred cars and empties every three hours serves far fewer people than one that turns over every forty minutes. The park's advice is to arrive by mid-morning at the latest. Early morning and late afternoon work. Midday on a summer weekend does not."), React.createElement("p", null, "For the day itself, allow two hours as an absolute floor, and that only buys the shuttle both ways and the Big Trees Loop. Half a day is right for the Grizzly Giant Loop with time to stand around. A full day is the upper grove. Add the hour each way from the Valley if that is where you are staying, and consider whether the grove wants to be ", React.createElement("a", {
    href: "/articles/wawona-yosemite-guide"
  }, "paired with Wawona"), " rather than squeezed onto a Valley day. ", React.createElement("a", {
    href: "/articles/yosemite-in-one-or-two-days"
  }, "The one or two day guide"), " takes a position on that trade."), React.createElement("h2", null, "The short version"), React.createElement("ol", null, React.createElement("li", null, "You cannot drive to the trees in season. Park at the Welcome Plaza by the South Entrance and take the free shuttle two miles up."), React.createElement("li", null, "The shuttle needs no reservation, runs about every fifteen minutes, and is wheelchair accessible. Its season runs from no earlier than April 15 to no later than November 30, and the hours shrink after September 23."), React.createElement("li", null, "A disability placard lets you drive the road. Accessible parking at the top is very limited."), React.createElement("li", null, "Big Trees Loop, three tenths of a mile and wheelchair accessible, is the everyone-can-do-it option. The Grizzly Giant Loop, about two miles, is the one to do if you do one."), React.createElement("li", null, "No dogs on any grove trail, paved included. This is an exception to the park's usual rule."), React.createElement("li", null, "In winter the road closes to cars and the grove stays open on foot. Snowshoe it."), React.createElement("li", null, "Allow two hours minimum, half a day to do it properly, plus an hour each way from the Valley.")), React.createElement("p", null, "The shuttle is part of the restoration. The old parking lot sat on the wet ground where young sequoias take root, and the two-mile ride costs visitors about fifteen minutes."), React.createElement("h2", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/mg.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Mariposa Grove of Giant Sequoias, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/places/000/mariposa-grove-welcome-plaza.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Mariposa Grove Welcome Plaza, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/pets.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Pets, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/accessibility.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Accessibility, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/bears.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Bears and Food Storage, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://yosemite.org/projects/restoring-the-mariposa-grove-of-giant-sequoias/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Restoring the Mariposa Grove of Giant Sequoias, Yosemite Conservancy"))));
};
