window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["yosemite-rockfall"] = function YosemiteRockfallBody() {
  var SANS = "var(--sans)";
  var capStyle = {
    fontFamily: SANS,
    fontSize: 13,
    color: "var(--ink-3)",
    marginTop: 10
  };
  var kickStyle = {
    fontFamily: SANS,
    fontSize: 11.5,
    fontWeight: 600,
    letterSpacing: "1.4px",
    color: "var(--rust)",
    textTransform: "uppercase",
    margin: "0 0 12px"
  };
  var fmt = n => n.toLocaleString("en-US");
  var INK = "var(--ink)",
    RUST = "var(--rust)",
    GREY = "var(--ink-3)";
  function Pin({
    n,
    rust
  }) {
    return React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: rust ? RUST : INK,
        color: "var(--paper)",
        fontSize: 11,
        fontWeight: 700,
        marginRight: 8,
        flex: "none"
      }
    }, n);
  }
  function BarList({
    title,
    rows,
    pct,
    labelBasis
  }) {
    return React.createElement("div", {
      style: {
        fontFamily: SANS
      }
    }, React.createElement("p", {
      style: kickStyle
    }, title), rows.map(r => React.createElement("div", {
      key: r.label,
      style: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        columnGap: 12,
        rowGap: 4,
        marginBottom: 12
      }
    }, React.createElement("div", {
      style: {
        flex: `1 1 ${labelBasis || 170}px`,
        display: "flex",
        alignItems: "center",
        minWidth: 0
      }
    }, r.pin && React.createElement(Pin, {
      n: r.pin
    }), React.createElement("div", null, React.createElement("div", {
      style: {
        fontSize: 14,
        color: INK,
        lineHeight: 1.3
      }
    }, r.label), r.sub && React.createElement("div", {
      style: {
        fontSize: 12,
        color: GREY,
        lineHeight: 1.3
      }
    }, r.sub))), React.createElement("div", {
      style: {
        flex: "999 1 240px",
        display: "flex",
        alignItems: "center",
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        display: "block",
        height: 20,
        width: `calc(${Math.max(0.6, pct(r))}% * 0.82)`,
        minWidth: 3,
        borderRadius: 2,
        background: r.dashed ? "transparent" : r.color || INK,
        border: r.dashed ? `1.5px dashed ${GREY}` : "none",
        boxSizing: "border-box"
      }
    }), React.createElement("span", {
      style: {
        marginLeft: 8,
        fontSize: 13,
        color: "var(--ink-2)",
        whiteSpace: "nowrap"
      }
    }, r.show || fmt(r.value))))));
  }
  function Columns({
    title,
    values,
    labels,
    colors,
    max,
    height,
    showValues,
    ticks
  }) {
    var h = height || 170;
    return React.createElement("div", {
      style: {
        fontFamily: SANS
      }
    }, React.createElement("p", {
      style: kickStyle
    }, title), React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-end",
        gap: "2%",
        height: h + 22,
        borderBottom: "1px solid var(--rule-soft)"
      }
    }, values.map((v, i) => React.createElement("div", {
      key: i,
      style: {
        flex: "1 1 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        height: "100%",
        minWidth: 0
      }
    }, showValues && React.createElement("span", {
      style: {
        fontSize: 11,
        color: GREY,
        marginBottom: 3
      }
    }, v), React.createElement("span", {
      style: {
        display: "block",
        width: "100%",
        height: Math.max(2, v / max * h),
        background: colors[i],
        borderRadius: "2px 2px 0 0"
      }
    })))), React.createElement("div", {
      style: {
        display: "flex",
        gap: "2%",
        marginTop: 6
      }
    }, values.map((v, i) => React.createElement("span", {
      key: i,
      style: {
        flex: "1 1 0",
        textAlign: "center",
        fontSize: 11.5,
        color: "var(--ink-2)",
        minWidth: 0,
        overflow: "visible",
        whiteSpace: "nowrap"
      }
    }, labels[i] || ""))), ticks && React.createElement("p", {
      style: {
        ...capStyle,
        marginTop: 8
      }
    }, ticks));
  }
  function BigNumbers() {
    var tiles = [{
      n: "1,760",
      t: "rockfalls and rock slides on record"
    }, {
      n: "1857",
      t: "the first one written down"
    }, {
      n: "About 55",
      t: "a year, on average, from 2006 to 2025"
    }, {
      n: "43",
      t: "in 2025, a quiet year"
    }];
    return React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: 12
      }
    }, tiles.map((t, i) => React.createElement("div", {
      key: t.n,
      style: {
        border: i === 0 ? `2px solid ${RUST}` : "1.2px solid var(--rule-soft)",
        borderRadius: 3,
        padding: "14px 14px 16px",
        background: "var(--paper)"
      }
    }, React.createElement("div", {
      style: {
        fontFamily: "var(--serif)",
        fontSize: 32,
        lineHeight: 1.1,
        color: INK
      }
    }, t.n), React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 13.5,
        color: "var(--ink-2)",
        marginTop: 8,
        lineHeight: 1.35
      }
    }, t.t))));
  }
  function CauseBars() {
    var rows = [{
      label: "Rain or melting snow",
      value: 769,
      color: INK
    }, {
      label: "No clear cause",
      value: 738,
      color: GREY
    }, {
      label: "Something else",
      value: 87,
      color: RUST
    }, {
      label: "Hot days (heat)",
      value: 69,
      color: RUST
    }, {
      label: "Freezing and thawing",
      value: 66,
      color: RUST
    }, {
      label: "Earthquakes",
      value: 31,
      color: RUST
    }];
    return React.createElement(BarList, {
      title: "What set them off, 1857 to 2025",
      rows: rows,
      pct: r => r.value / 769 * 100
    });
  }
  function MonthBars() {
    var m = [162, 154, 201, 117, 133, 101, 150, 87, 118, 166, 122, 153];
    var names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var colors = m.map((v, i) => i === 2 ? RUST : i === 7 ? GREY : INK);
    return React.createElement("div", {
      role: "img",
      "aria-label": "Rockfalls by month, for the 1,664 records with a known month. January 162, February 154, March 201, April 117, May 133, June 101, July 150, August 87, September 118, October 166, November 122, December 153. March has the most. August has the fewest. Every month has had rockfalls."
    }, React.createElement(Columns, {
      title: "Rockfalls by month",
      values: m,
      labels: names,
      colors: colors,
      max: 201,
      showValues: true
    }));
  }
  function RockfallMap() {
    var pins = [{
      n: "1",
      x: 700,
      y: 340
    }, {
      n: "2",
      x: 452,
      y: 98
    }, {
      n: "3",
      x: 330,
      y: 232
    }, {
      n: "4",
      x: 85,
      y: 265
    }, {
      n: "5",
      x: 1050,
      y: 225
    }, {
      n: "6",
      x: 626,
      y: 62
    }, {
      n: "7",
      x: 945,
      y: 428
    }];
    var events = [{
      n: "A",
      x: 812,
      y: 345
    }, {
      n: "B",
      x: 668,
      y: 258
    }];
    return React.createElement("div", {
      className: "npsmap__frame"
    }, React.createElement("img", {
      src: "/img/nps-rockfall-valley-map.jpg",
      width: "1120",
      height: "608",
      loading: "lazy",
      decoding: "async",
      alt: "National Park Service map of eastern Yosemite Valley, from El Capitan in the west to Half Dome and Vernal Fall in the east, with Yosemite Village, Curry Village and Glacier Point."
    }), React.createElement("svg", {
      viewBox: "0 0 1120 608",
      role: "img",
      "aria-label": "Numbered pins mark the Valley cliffs with the most recorded rockfalls. One, Glacier Point, 223. Two, Yosemite Falls, 123. Three, Three Brothers, 98. Four, El Capitan, 93. Five, Half Dome, 88. Six, Indian Canyon, 74. Seven, the Giant Staircase by Vernal Fall, 61. Lettered pins mark two famous rockfalls. A, Happy Isles, July 1996. B, Curry Village, October 2008."
    }, pins.map(p => React.createElement("g", {
      key: p.n
    }, React.createElement("circle", {
      cx: p.x,
      cy: p.y,
      r: "17",
      className: "npsmap__pin npsmap__pin--ink"
    }), React.createElement("text", {
      x: p.x,
      y: p.y + 6,
      textAnchor: "middle",
      className: "npsmap__num"
    }, p.n))), events.map(p => React.createElement("g", {
      key: p.n
    }, React.createElement("circle", {
      cx: p.x,
      cy: p.y,
      r: "17",
      className: "npsmap__pin npsmap__pin--rust"
    }), React.createElement("text", {
      x: p.x,
      y: p.y + 6,
      textAnchor: "middle",
      className: "npsmap__num"
    }, p.n)))));
  }
  function PlaceBars() {
    var rows = [{
      label: "Merced River Gorge",
      sub: "The roads below the Valley",
      value: 405,
      color: RUST
    }, {
      label: "Glacier Point",
      value: 223,
      pin: "1"
    }, {
      label: "Yosemite Falls",
      value: 123,
      pin: "2"
    }, {
      label: "Three Brothers",
      value: 98,
      pin: "3"
    }, {
      label: "El Capitan",
      value: 93,
      pin: "4"
    }, {
      label: "Half Dome",
      value: 88,
      pin: "5"
    }, {
      label: "Indian Canyon",
      value: 74,
      pin: "6"
    }, {
      label: "Giant Staircase",
      value: 61,
      pin: "7"
    }];
    return React.createElement(BarList, {
      title: "Where they fall most",
      rows: rows,
      pct: r => r.value / 405 * 100
    });
  }
  function SizeClasses() {
    var rows = [{
      label: "Tiny",
      sub: "under 0.5 m³",
      value: 114
    }, {
      label: "Very small",
      sub: "0.5 to 5 m³",
      value: 437
    }, {
      label: "Small",
      sub: "5 to 50 m³",
      value: 779
    }, {
      label: "Medium",
      sub: "50 to 500 m³",
      value: 287,
      color: RUST
    }, {
      label: "Large",
      sub: "500 to 5,000 m³",
      value: 104,
      color: RUST
    }, {
      label: "Very large",
      sub: "5,000 to 50,000 m³",
      value: 35,
      color: RUST
    }, {
      label: "Giant",
      sub: "the top group",
      value: 3,
      color: RUST
    }];
    return React.createElement(BarList, {
      title: "How big, in cubic meters (m³) of rock",
      rows: rows,
      pct: r => r.value / 779 * 100
    });
  }
  function SizeLadder() {
    var rows = [{
      label: "Mist Trail, March 2025",
      sub: "about 446 tons",
      value: 150,
      show: "150 m³"
    }, {
      label: "Porcelain Wall, June 2020",
      sub: "about 3,100 tons",
      value: 1040,
      show: "1,040 m³"
    }, {
      label: "One Olympic pool",
      sub: "for scale",
      value: 2500,
      show: "2,500 m³",
      dashed: true
    }, {
      label: "Happy Isles, July 1996",
      sub: "about 90,000 tons",
      value: 30000,
      show: "12 pools"
    }, {
      label: "Ahwiyah Point, March 2009",
      sub: "about 115,000 tons",
      value: 43000,
      show: "17 pools"
    }, {
      label: "El Capitan, 3,600 years ago",
      sub: "about 8 million tons",
      value: 2870000,
      show: "1,000+ pools",
      color: RUST
    }];
    return React.createElement(BarList, {
      title: "A size ladder: each step is 10 times bigger",
      rows: rows,
      pct: r => Math.log10(r.value) / 6.5 * 100
    });
  }
  function DecadeBars() {
    var v = [2, 3, 11, 6, 5, 9, 30, 31, 81, 36, 40, 23, 30, 115, 68, 367, 615, 288];
    var labels = v.map((x, i) => i % 5 === 0 ? `${1850 + i * 10}s` : "");
    var colors = v.map((x, i) => i >= 13 ? RUST : INK);
    return React.createElement("div", {
      role: "img",
      "aria-label": "Recorded rockfalls by decade. 1850s, 2. 1860s, 3. 1870s, 11. 1880s, 6. 1890s, 5. 1900s, 9. 1910s, 30. 1920s, 31. 1930s, 81. 1940s, 36. 1950s, 40. 1960s, 23. 1970s, 30. 1980s, 115. 1990s, 68. 2000s, 367. 2010s, 615. 2020 through 2025 only, 288. The count rises as more people kept records, starting with park reports after 1916 and scientists after 1980."
    }, React.createElement(Columns, {
      title: "Recorded rockfalls, by decade",
      values: v,
      labels: labels,
      colors: colors,
      max: 615,
      height: 180,
      ticks: "Green bars: 1850s to 1970s. Rust bars: 1980 and after, when scientists joined the count. The last bar covers 2020 to 2025 only; the tallest is the 2010s, with 615."
    }));
  }
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "dropcap"
  }, "At 2:25 in the morning on March 26, 1872, ", React.createElement("strong", null, "John Muir"), " woke up because the ground was shaking. He was sleeping in a cabin on the floor of Yosemite Valley. A huge earthquake had struck east of the Sierra Nevada, near the town of Lone Pine. Muir ran outside, \"both glad and frightened,\" and shouted, \"A noble earthquake.\" Then he watched a piece of cliff called Eagle Rock break away and fall \"in thousands of the great boulders\" to the Valley floor. He was watching a rockfall. The park's records list at least seven of them that morning."), React.createElement("p", null, "Rockfalls are still happening. Rock comes down in Yosemite ", React.createElement("strong", null, "about once a week"), ", on average. Most of it is small, and most of it falls where nobody is standing. But the park keeps a careful list of every one it can confirm, and that list is now public. We read all ", React.createElement("strong", null, "1,760 entries"), ", from 1857 to 2025, and turned them into the charts below. They show where the rock falls, when it falls, what sets it off, and how big it gets."), React.createElement(Placeholder, {
    caption: "The old Big Oak Flat Road crossing a talus slope above Yosemite Valley, with Cathedral Rocks and Bridalveil Fall in the distance",
    image: "img/talus-slope-old-big-oak-flat-road.jpg",
    credit: "Photo: Brian Grogan, Historic American Engineering Record / Library of Congress (public domain)",
    tag: "PLATE I",
    size: "lg",
    style: {
      aspectRatio: "1600 / 998",
      margin: "32px 0"
    }
  }), React.createElement("h2", null, "What a rockfall is"), React.createElement("p", null, "A ", React.createElement("strong", null, "rockfall"), " is just what it sounds like. A piece of rock breaks off a cliff and drops, bounces or slides down. It can be a single stone the size of a fist. It can also be a slab as big as a building."), React.createElement("p", null, "Look at the bottom of almost any cliff in Yosemite Valley and you will see a slope of broken rock. That slope is called ", React.createElement("strong", null, "talus"), ". Every block in it fell from the cliff above, one rockfall at a time, over thousands of years. The photo at the top of this page shows an old road crossing one of those slopes. This journal is named after them, and our guide to ", React.createElement("a", {
    href: "/articles/what-is-a-talus-field"
  }, "what a talus field is"), " explains how they grow and where to see a good one."), React.createElement("p", null, "The Park Service says rockfall is ", React.createElement("strong", null, "the most powerful force changing Yosemite today"), ". Glaciers carved the Valley long ago. Since the ice melted, falling rock has done most of the work."), React.createElement("figure", {
    style: {
      margin: "28px 0 32px"
    }
  }, React.createElement(BigNumbers, null), React.createElement("figcaption", {
    style: capStyle
  }, "The park's rockfall list, as published on the Park Service's open data site. It includes rockfalls, rock slides and a few debris flows.")), React.createElement("h2", null, "Why the cliffs break"), React.createElement("p", null, "Yosemite's cliffs are made of ", React.createElement("strong", null, "granite"), ", a hard rock that cooled deep underground. Over time it cracked. Some of those cracks run side to side, parallel to the face of the cliff. They split the rock into thin sheets, a little like the layers of an onion. You can see the sheets on Half Dome and on the Royal Arches. Geologists call those cracks ", React.createElement("strong", null, "sheeting joints"), "."), React.createElement("p", null, "Once a sheet is loose, something has to give it the last push. Scientists have found five main pushes."), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "Water."), " Rain and melting snow run into the cracks. The water presses on the loose rock from behind."), React.createElement("li", null, React.createElement("strong", null, "Ice."), " When water freezes, it takes up about 9 percent more space. Ice in a crack works like a wedge."), React.createElement("li", null, React.createElement("strong", null, "Heat."), " On hot days the sun warms a thin slab. It bends out a tiny bit by day and back at night. After enough days, it can snap."), React.createElement("li", null, React.createElement("strong", null, "Roots."), " Trees like firs, pines and canyon live oaks grow into the cracks. Their roots pry them wider."), React.createElement("li", null, React.createElement("strong", null, "Earthquakes."), " Shaking knocks loose rock free, as Muir saw in 1872.")), React.createElement("figure", {
    className: "diagram-plate diagram-plate--narrow"
  }, React.createElement(Placeholder, {
    caption: "How Rockfalls Happen in Yosemite. Yosemite's granite cliffs break along natural fractures. Water, temperature changes, and earthquakes can loosen rock until gravity takes over. 1, exfoliation cracks form: granite peels away in sheets, like an onion. 2, rain and snowmelt seep in: water pushes on loose slabs from behind. 3, freeze-thaw widens fractures: ice expands and opens cracks. 4, sun and heat flex the rock: the slab bends outward a little, then back. 5, earthquakes and gravity release the rock: blocks detach, fall, bounce, and build talus below.",
    image: "img/how-rockfalls-happen-yosemite.jpg",
    style: {
      aspectRatio: "1122 / 1402"
    },
    credit: "Illustration: The Talus Field",
    tag: "FIG. 1",
    natural: true,
    sizes: "(max-width: 560px) calc(100vw - 32px), 520px"
  }), React.createElement("figcaption", null, "The five pushes, from the Park Service's rockfall page and the U.S. Geological Survey's rockfall report. The illustration is a diagram, not a real cliff. Select it to enlarge it.")), React.createElement("h2", null, "What set them off"), React.createElement("p", null, "For each rockfall, scientists write down the most likely cause. They call it the ", React.createElement("strong", null, "trigger"), ". When they sort all 1,760, two answers are far ahead of the rest."), React.createElement("p", null, "The first is ", React.createElement("strong", null, "water"), ". Rain or melting snow was the likely trigger for ", React.createElement("strong", null, "769"), " rockfalls, more than any other cause. The second is a surprise: ", React.createElement("strong", null, "no clear cause at all"), ". For ", React.createElement("strong", null, "738"), " rockfalls, about 4 out of every 10, nobody could tell what set them off. Some of those were watched closely and still had no trigger anyone could spot. Others were found later, as fresh rock on a trail, with no one around to see them fall."), React.createElement("figure", {
    style: {
      margin: "28px 0 32px"
    }
  }, React.createElement(CauseBars, null), React.createElement("figcaption", {
    style: capStyle
  }, "\"Something else\" includes cracks spreading after an earlier rockfall, snow avalanches, blasting and road work, lightning, wind, and roots. The scientists call every trigger \"probable,\" because a cause can only be guessed from timing.")), React.createElement("p", null, "That second bar matters. It means a rockfall can happen on a calm, sunny day, with no storm and no earthquake. Some of the biggest ones have."), React.createElement("h2", null, "When they happen"), React.createElement("p", null, "Rockfalls happen in every month of the year. But they are not spread out evenly. ", React.createElement("strong", null, "March"), " has the most, with 201. Then come October, January, February and December. That is the stormy, freezing, melting part of the year. ", React.createElement("strong", null, "August"), ", usually dry and steady, has the fewest, with 87."), React.createElement("figure", {
    style: {
      margin: "28px 0 32px"
    }
  }, React.createElement(MonthBars, null), React.createElement("figcaption", {
    style: capStyle
  }, "Rockfalls by month, for the 1,664 records with a known month. The rest are dated only by season or by year.")), React.createElement("p", null, "Park rangers noticed this pattern long before anyone made a chart. In February 1933, ranger-naturalist C.C. Jensen wrote in ", React.createElement("a", {
    href: "/archive/1933/vol-12-no-2/"
  }, "the park's Nature Notes"), " that \"the greatest number of rock falls occur in the early spring when the ice and snow begin to melt.\" The year before, he had heard \"a thunderlike roar\" from Indian Canyon and watched a cloud of dust hang over the trees for several minutes. Ninety years of records later, his guess still holds."), React.createElement("p", null, "Summer has its own kind of rockfall. On hot afternoons the sun heats the thin sheets of granite. Scientists who study Yosemite's cliffs think that daily heating can help crack them loose, which is why some large rockfalls happen in warm, clear weather."), React.createElement("h2", null, "Where they fall"), React.createElement("p", null, "Rock falls from almost every cliff in the park, but some cliffs drop far more than others. The map below uses the Park Service's own Valley map. The numbers mark the seven Valley cliffs with the most rockfalls on record. The letters mark two famous ones, which we come back to below."), React.createElement("figure", {
    className: "npsmap",
    style: {
      margin: "30px 0 34px"
    }
  }, React.createElement(RockfallMap, null), React.createElement("figcaption", null, React.createElement("span", null, React.createElement("b", null, "1"), " Glacier Point, 223 rockfalls. The cliff rises right behind Curry Village."), React.createElement("span", null, React.createElement("b", null, "2"), " Yosemite Falls, 123. ", React.createElement("b", null, "3"), " Three Brothers, 98. ", React.createElement("b", null, "4"), " El Capitan, 93."), React.createElement("span", null, React.createElement("b", null, "5"), " Half Dome, 88. ", React.createElement("b", null, "6"), " Indian Canyon, 74. ", React.createElement("b", null, "7"), " Giant Staircase, by Vernal Fall, 61."), React.createElement("span", null, React.createElement("b", null, "A"), " Happy Isles, July 1996. ", React.createElement("b", null, "B"), " Curry Village, October 2008."), React.createElement("span", null, "Pins mark the general area, not the exact spot. Map: National Park Service (public domain), cropped."))), React.createElement("p", null, "One place beats all of them, and it is not on the map. The ", React.createElement("strong", null, "Merced River Gorge"), ", the steep canyon west of the Valley, has ", React.createElement("strong", null, "405"), " rockfalls on record. Two of the main roads into the park run along it. Most of those 405 were small, most came down in rainy weather, and more than half of them landed on a road. Rock on a road gets noticed and cleared, so it gets written down. Our guide to ", React.createElement("a", {
    href: "/articles/highway-140-closed-yosemite"
  }, "Highway 140 closures"), " explains what a slide in that canyon does to a trip."), React.createElement("figure", {
    style: {
      margin: "28px 0 32px"
    }
  }, React.createElement(PlaceBars, null), React.createElement("figcaption", {
    style: capStyle
  }, "The eight places with the most rockfalls on record. Hetch Hetchy (58) and Sentinel Rock (54) are next.")), React.createElement("h2", null, "How big they get"), React.createElement("p", null, "Scientists measure a rockfall by how much rock came down, in ", React.createElement("strong", null, "cubic meters"), ". Picture a box about 3.3 feet long, 3.3 feet wide and 3.3 feet tall, filled with solid granite. That is one cubic meter, and it weighs about 3 tons."), React.createElement("p", null, "Most rockfalls are small. About ", React.createElement("strong", null, "3 out of every 4"), " were less than 50 cubic meters. Only three in the whole record made the top size group, which we call \"giant.\" Two of them came down in the 1850s, at Taft Point and at Yosemite Falls, and their sizes are rough guesses from old written accounts. The third fell in the Merced River Gorge in 1982."), React.createElement("figure", {
    style: {
      margin: "28px 0 32px"
    }
  }, React.createElement(SizeClasses, null), React.createElement("figcaption", {
    style: capStyle
  }, "Size groups from the U.S. Geological Survey's rockfall report. We renamed \"extremely small\" and \"extremely large\" as \"tiny\" and \"giant.\"")), React.createElement("p", null, "Big ones are hard to picture, so here is a ladder. Its bars use a stretched scale: each step along it is ten times bigger than the last. An Olympic swimming pool holds at least 2,500 cubic meters. The 1996 Happy Isles rockfall was about ", React.createElement("strong", null, "12 pools of solid rock"), ". The 2009 rockfall at Ahwiyah Point, near Half Dome, was about 17."), React.createElement("figure", {
    style: {
      margin: "28px 0 32px"
    }
  }, React.createElement(SizeLadder, null), React.createElement("figcaption", {
    style: capStyle
  }, "Sizes are the Park Service's published figures, and 1 m³ is one cubic meter. Bar lengths use the stretched scale, so a bar twice as long means far more than twice as much rock. Pool counts are rounded. The El Capitan rock avalanche fell before anyone was keeping records; its size comes from the boulders still lying in the Valley.")), React.createElement("h2", null, "Four rockfalls people remember"), React.createElement("p", null, React.createElement("strong", null, "Happy Isles, July 10, 1996."), " Two huge blocks broke off near Glacier Point, about 30,000 cubic meters of rock weighing about 90,000 tons. They fell more than 2,000 feet and hit the ground near Happy Isles. The crash pushed out a blast of air with winds up to ", React.createElement("strong", null, "280 miles per hour"), ", faster than most tornadoes. It knocked down about 1,000 trees and covered the area in rock dust. One person was killed and several others were badly hurt. The photo below, from the U.S. Geological Survey, shows the bright scar the blocks left on the cliff."), React.createElement(Placeholder, {
    caption: "The fresh scar on the cliff near Glacier Point after the July 10, 1996 Happy Isles rockfall, with the debris path running down to the Valley floor",
    image: "img/happy-isles-rockfall-scar-1996.jpg",
    credit: "Photo: U.S. Geological Survey / Wikimedia Commons (public domain)",
    tag: "PLATE II",
    natural: true,
    style: {
      maxWidth: 390,
      margin: "32px auto"
    }
  }), React.createElement("p", null, React.createElement("strong", null, "Curry Village, October 2008."), " On October 7 and 8, rock fell from the cliffs below Glacier Point onto Curry Village, where visitors sleep in cabins and tents. On the second day, three people were hurt. One boulder crashed through a cabin roof, as the Park Service photo below shows. Look at its color: the fresh rock is bright and pale, while older boulders nearby are dark. After a careful study of the danger, finished in 2014, the park removed some buildings in the riskiest spots and changed how others are used. The Park Service says that cut the rockfall risk in the Valley by ", React.createElement("strong", null, "95 percent"), "."), React.createElement(Placeholder, {
    caption: "A pale, freshly fallen boulder resting on the crushed roof of a Curry Village cabin after the October 2008 rockfall",
    image: "img/curry-village-rockfall-boulder-2008.jpg",
    credit: "Photo: National Park Service / Wikimedia Commons (public domain)",
    tag: "PLATE III",
    natural: true,
    style: {
      maxWidth: 600,
      margin: "32px auto"
    }
  }), React.createElement("p", null, React.createElement("strong", null, "Ahwiyah Point, March 28, 2009."), " Rock fell about 1,800 feet from Ahwiyah Point, next to Half Dome. It was about 43,000 cubic meters, bigger than Happy Isles. The ground shook as hard as a magnitude 2.4 earthquake. It knocked down hundreds of trees and buried part of the trail around Mirror Lake. Nobody was hurt."), React.createElement("p", null, React.createElement("strong", null, "El Capitan, September 2017."), " On September 27, rock fell from the east side of El Capitan, near Horsetail Fall. A visitor was killed and another was hurt. The next day a much bigger piece fell from the same area. El Capitan is also where people watch climbers, and our guide to ", React.createElement("a", {
    href: "/articles/watching-climbers-el-capitan"
  }, "watching climbers on El Capitan"), " covers the meadow below it."), React.createElement("p", null, "In the whole record, back to 1857, rockfalls and rock slides have killed ", React.createElement("strong", null, "19 people"), " and hurt at least ", React.createElement("strong", null, "108"), ". That is out of many millions of visits. The danger is real, but it is small, and the park works hard to keep it that way."), React.createElement(NatureNotesFilm, {
    id: "rock-fall",
    title: "Rock Fall",
    youtubeId: "H0YhlqP1BgE",
    episode: 10,
    note: "The Park Service's short film on how geologists study Yosemite's rockfalls, and how the cliffs have changed since the glaciers left.",
    location: "article"
  }), React.createElement("h2", null, "Is it getting worse?"), React.createElement("p", null, "The chart below looks scary at first. There are hundreds more rockfalls in recent decades than in the old days. But the rock is not falling faster. More people are ", React.createElement("strong", null, "writing it down"), "."), React.createElement("p", null, "In the 1800s, a rockfall made the record only if a famous visitor wrote about it in a letter or a book. After 1916, park leaders started listing rockfalls in their monthly reports, because damaged trails and roads had to be fixed. After a deadly rockfall on the Yosemite Falls Trail in 1980, scientists from the U.S. Geological Survey joined the park to study every event in detail. Now even small ones get counted."), React.createElement("figure", {
    style: {
      margin: "28px 0 32px"
    }
  }, React.createElement(DecadeBars, null), React.createElement("figcaption", {
    style: capStyle
  }, "Recorded rockfalls by decade. The bars grow because the counting got better, not because the cliffs got weaker.")), React.createElement("blockquote", null, "The cliffs are not falling faster. We are just better at counting."), React.createElement("p", null, "In 2009, after several big rockfalls close together, the Park Service looked at this question directly. Its geologists said they could find no real increase in rockfall in Yosemite Valley. And 2025 was a quiet year: 43 rockfalls, below the average for the last 20 years."), React.createElement("h2", null, "Rockfalls older than any record"), React.createElement("p", null, "Some of the Valley's biggest rockfalls happened long before anyone wrote anything down. Geologists find them by reading the land."), React.createElement("p", null, "Below El Capitan, a giant tongue of boulders stretches about ", React.createElement("strong", null, "2,200 feet"), " out into the Valley. It is so big that it pushes the Merced River, and Northside Drive, into a sharp bend. Scientists dated it with an unusual method. Rays from space slowly change the surface of any rock left out in the open. By measuring that change in five boulders, they found that four had been lying there for about ", React.createElement("strong", null, "3,600 years"), ". The whole pile weighs about 8 million tons."), React.createElement("p", null, "Mirror Lake has a rockfall story too. Long ago, a huge piece of cliff in Tenaya Canyon fell and piled up more than 100 feet deep. The rubble dammed Tenaya Creek, and water backed up behind it into a lake more than a mile long. Sand and mud have filled most of it in. The little lake left today is Mirror Lake."), React.createElement("h2", null, "What to do if you see one"), React.createElement("p", null, "You will probably never be near a rockfall. If you are, the Park Service gives simple advice."), React.createElement("ul", null, React.createElement("li", null, React.createElement("strong", null, "On the Valley floor:"), " move away from the cliff, toward the middle of the Valley."), React.createElement("li", null, React.createElement("strong", null, "Near the bottom of a cliff or a talus slope:"), " get behind the biggest boulder close to you. When the rocks stop falling, move quickly away from the cliff."), React.createElement("li", null, React.createElement("strong", null, "On the trail:"), " obey warning signs, and stay off closed trails. Rangers close a trail after a rockfall for a reason."), React.createElement("li", null, React.createElement("strong", null, "Tell someone:"), " report any rockfall you see or hear to a ranger or a visitor center. Every report goes into the park's list.")), React.createElement("p", null, "Trail closures after a rockfall can last for weeks. In March 2025, about 150 cubic meters of rock fell from Grizzly Peak at night and blocked the ", React.createElement("a", {
    href: "/articles/mist-trail-the-real-guide"
  }, "Mist Trail"), " near the Vernal Fall footbridge. Crews blasted and cleared the boulders before the trail reopened. Before a hike, check the park's current trail closures, which our ", React.createElement("a", {
    href: "/conditions"
  }, "conditions page"), " links to."), React.createElement("h2", null, "How to see the story for yourself"), React.createElement("p", null, "Next time you are in the Valley, look at the bottom of a cliff. Find the pale boulders on the talus. They fell recently, maybe in your lifetime. The dark, lichen-covered ones fell long ago. Then look up and find the bright patch on the cliff where a slab came off. You are looking at the newest page in a story that has been written one rock at a time for thousands of years."), React.createElement("h3", null, "Sources"), React.createElement("ul", {
    style: {
      fontSize: 14
    }
  }, React.createElement("li", null, React.createElement("a", {
    href: "https://yose-nps.opendata.arcgis.com/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite National Park - Rockfalls - Open Data, NPS Yosemite Geoportal"), " (1,760 records, 1857 to 2025, read October 14, 2026)"), React.createElement("li", null, React.createElement("a", {
    href: "https://pubs.usgs.gov/ds/746/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Historical Rock Falls in Yosemite National Park, California (1857–2011), Stock and others, USGS Data Series 746")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/nature/rockfall.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Rockfall, NPS Yosemite"), ", including the 2025 year in review"), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/news/ahwiyahrockfall.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Ahwiyah Point Rockfall Size Estimated, NPS news release, April 8, 2009")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/nature/investigating-the-el-capitan-rock-avalanche.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Investigating the El Capitan Rock Avalanche, Greg Stock, Yosemite Association, 2008")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/nature/ynn-rock-slides-in-yosemite.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Rock Slides in Yosemite, C.C. Jensen, Yosemite Nature Notes, February 1933"))));
};
