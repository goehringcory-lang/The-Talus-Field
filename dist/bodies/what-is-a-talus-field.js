window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["what-is-a-talus-field"] = function WhatIsATalusFieldBody() {
  var SVG_STYLE = {
    width: "100%",
    height: "auto",
    display: "block"
  };
  var T_HEAD = {
    fontFamily: "var(--sans)",
    fontSize: 12.5,
    fontWeight: 600,
    letterSpacing: 1.1,
    fill: "var(--rust)"
  };
  var T_BODY = {
    fontFamily: "var(--sans)",
    fontSize: 14,
    fill: "var(--ink)"
  };
  var T_SOFT = {
    fontFamily: "var(--sans)",
    fontSize: 13,
    fill: "var(--ink-2)"
  };
  var T_BIG = {
    fontFamily: "var(--serif)",
    fontSize: 19,
    fill: "var(--ink)"
  };
  function TalusSection() {
    var W = 600,
      H = 470,
      BASE = 430;
    var blocks = [[214, 272, 16, 1], [236, 288, 12, 1], [226, 312, 20, 0], [256, 306, 14, 1], [250, 334, 18, 0], [278, 330, 12, 0], [274, 358, 22, 0], [302, 356, 16, 0], [298, 384, 18, 0], [326, 378, 14, 0], [322, 404, 20, 0], [350, 398, 12, 0], [352, 418, 14, 0], [376, 412, 16, 0], [400, 422, 12, 0], [230, 364, 16, 0], [262, 392, 20, 0], [240, 404, 22, 0], [290, 414, 16, 0], [216, 418, 14, 0]];
    var poly = (x, y, s) => `${x},${y} ${x + s},${y - s * 0.25} ${x + s * 1.1},${y + s * 0.6} ${x + s * 0.2},${y + s * 0.8}`;
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: SVG_STYLE,
      role: "img",
      "aria-label": "Cross-section of a talus field. A granite cliff on the left is cut by joints, the fracture planes where water freezes, expands and wedges blocks loose, and it sheds curved exfoliation sheets from its face. A block falls from the cliff and lands on the slope below. The slope of broken, angular blocks stands at the angle of repose, about 30 to 35 degrees for Sierra granite. Pale, unlichened blocks near the top are recent rockfall and the least trustworthy footing; grey-green lichened blocks are decades old. At the foot of the slope the flat meadow soil begins."
    }, React.createElement("path", {
      d: `M0 20 L188 20 C 196 120, 200 200, 208 262 L 208 ${BASE} L 0 ${BASE} Z`,
      fill: "var(--paper-2)",
      stroke: "var(--ink-3)",
      strokeWidth: "1.5"
    }), [[0, 70, 150, 90], [0, 130, 170, 150], [20, 200, 190, 212], [0, 262, 120, 280]].map(([a, b, c, d]) => React.createElement("line", {
      key: b,
      x1: a,
      y1: b,
      x2: c,
      y2: d,
      stroke: "var(--ink-3)",
      strokeWidth: "1.2"
    })), [[60, 20, 70, 130], [120, 90, 128, 210]].map(([a, b, c, d]) => React.createElement("line", {
      key: a,
      x1: a,
      y1: b,
      x2: c,
      y2: d,
      stroke: "var(--ink-3)",
      strokeWidth: "1.2"
    })), React.createElement("path", {
      d: "M176 40 C 186 90, 190 130, 192 170",
      fill: "none",
      stroke: "var(--rust)",
      strokeWidth: "3"
    }), React.createElement("path", {
      d: "M196 120 C 230 150, 250 200, 258 250",
      fill: "none",
      stroke: "var(--ink-3)",
      strokeWidth: "1.3",
      strokeDasharray: "4 5"
    }), React.createElement("polygon", {
      points: poly(252, 244, 14),
      fill: "var(--paper)",
      stroke: "var(--ink)",
      strokeWidth: "1.3"
    }), React.createElement("path", {
      d: `M208 262 L 486 ${BASE} L 208 ${BASE} Z`,
      fill: "var(--paper-2)"
    }), blocks.map(([x, y, s, fresh], i) => React.createElement("polygon", {
      key: i,
      points: poly(x, y, s),
      fill: fresh ? "var(--paper)" : "var(--moss)",
      fillOpacity: fresh ? 1 : 0.35,
      stroke: "var(--ink)",
      strokeWidth: "1"
    })), React.createElement("line", {
      x1: "208",
      y1: "262",
      x2: "486",
      y2: BASE,
      stroke: "var(--ink)",
      strokeWidth: "1.5"
    }), React.createElement("line", {
      x1: "208",
      y1: BASE,
      x2: W,
      y2: BASE,
      stroke: "var(--ink)",
      strokeWidth: "1.5"
    }), React.createElement("path", {
      d: `M 426 ${BASE} A 60 60 0 0 1 435 ${BASE - 31}`,
      fill: "none",
      stroke: "var(--rust)",
      strokeWidth: "2"
    }), React.createElement("text", {
      x: "500",
      y: BASE - 12,
      style: {
        ...T_BODY,
        fontWeight: 600,
        fill: "var(--rust)"
      }
    }, "30 to 35°"), React.createElement("text", {
      x: "496",
      y: BASE + 24,
      style: T_SOFT
    }, "meadow soil"), React.createElement("text", {
      x: "236",
      y: BASE + 24,
      style: T_SOFT
    }, "the talus field"), React.createElement("text", {
      x: "300",
      y: "40",
      style: T_HEAD
    }, "JOINTS"), React.createElement("text", {
      x: "300",
      y: "60",
      style: T_SOFT
    }, "Water works in, freezes, expands:"), React.createElement("text", {
      x: "300",
      y: "78",
      style: T_SOFT
    }, "a slow wedge."), React.createElement("text", {
      x: "300",
      y: "106",
      style: T_HEAD
    }, "EXFOLIATION"), React.createElement("text", {
      x: "300",
      y: "126",
      style: T_SOFT
    }, "Granite sheds in curved sheets."), React.createElement("text", {
      x: "300",
      y: "154",
      style: T_HEAD
    }, "ROCKFALL"), React.createElement("text", {
      x: "300",
      y: "174",
      style: T_SOFT
    }, "Recorded every year. A block"), React.createElement("text", {
      x: "300",
      y: "192",
      style: T_SOFT
    }, "fell, hit, and stopped: angular."), React.createElement("text", {
      x: "300",
      y: "220",
      style: T_HEAD
    }, "THE ANGLE OF REPOSE"), React.createElement("text", {
      x: "300",
      y: "240",
      style: T_SOFT
    }, "The steepest slope loose rock holds."), React.createElement("g", null, React.createElement("rect", {
      x: "300",
      y: "256",
      width: "14",
      height: "14",
      fill: "var(--paper)",
      stroke: "var(--ink)",
      strokeWidth: "1"
    }), React.createElement("text", {
      x: "322",
      y: "268",
      style: T_SOFT
    }, "pale, unlichened: recent"), React.createElement("rect", {
      x: "300",
      y: "280",
      width: "14",
      height: "14",
      fill: "var(--moss)",
      fillOpacity: "0.35",
      stroke: "var(--ink)",
      strokeWidth: "1"
    }), React.createElement("text", {
      x: "322",
      y: "292",
      style: T_SOFT
    }, "grey-green lichen: decades")));
  }
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "dropcap"
  }, "Walk to the base of almost any cliff in Yosemite Valley and the ground changes under you. The flat meadow soil gives way to a slope of broken rock: blocks the size of dinner plates, blocks the size of cars, piled at an angle that feels deliberate and is not. That slope is a talus field. It is the most common landform in the Valley that visitors never learn the name of, and it is the thing this journal is named after."), React.createElement("h2", null, "What a talus field is"), React.createElement("p", null, "A ", React.createElement("strong", null, "talus field"), " is an accumulation of rock fragments at the base of a cliff, built by repeated rockfall over a long time. The individual pieces are talus; the slope they form is a talus field, sometimes called a talus slope or a scree slope. Geologists distinguish talus (coarse, angular, block-sized) from scree (finer, gravel-sized), though in ordinary speech the words are used interchangeably and nobody minds."), React.createElement("p", null, "The defining feature is the angle. Loose angular rock piles up until it reaches the steepest slope it can hold without sliding, and then it stops. That limit is the ", React.createElement("strong", null, "angle of repose"), ", and for Sierra granite blocks it lands somewhere between about 30 and 35 degrees. Every talus field you have ever seen is sitting at roughly the same angle, which is why they all look related from across a valley. Friction sets that shape."), React.createElement("p", null, "The blocks are angular rather than rounded because they have not travelled far or been worked by water. A river cobble is smooth because it has been tumbled for miles. A talus block fell, hit, and stopped. The sharp edges show the rock has not moved far from where it broke off."), React.createElement("h2", null, "How Yosemite builds them"), React.createElement("p", null, "Yosemite makes talus faster than most landscapes, because it has more cliff than most landscapes. The Valley's walls were steepened by glaciers that have since gone, and steep granite without ice to support it sheds rock."), React.createElement("p", null, "The mechanism is mostly water and cold. Rain and snowmelt work into the joints, the natural fracture planes that run through granite in sheets and blocks. Water expands when it freezes, so a wet joint in a freezing night is a slow wedge. Do that a few thousand times and a block that was part of the cliff becomes a block resting against it. Then some ordinary morning, it is not resting against anything."), React.createElement("p", null, "The other mechanism is the granite's own habit of shedding in curved sheets, exfoliation, which is why Half Dome and Royal Arches look the way they do. A sheet lets go, and what lands below is a fresh apron of pale rock that has not weathered yet. You can date a rockfall roughly by colour: bright white scars and light blocks are recent, and the grey-green of lichen takes decades to arrive."), React.createElement("figure", null, React.createElement(TalusSection, null), React.createElement("figcaption", null, "How a talus field is built, drawn from this article. Schematic, not to scale; the slope is drawn inside the 30 to 35 degrees Sierra granite holds.")), React.createElement("p", null, "Rockfall is not a historical event in this park. It is a current one. The Park Service records rockfalls every year, and the talus below ", React.createElement("a", {
    href: "/articles/watching-climbers-el-capitan"
  }, "El Capitan"), " and the Rhombus Wall and the Glacier Point Apron is still being added to. ", React.createElement("a", {
    href: "/articles/yosemite-glaciers-climate"
  }, "The glaciers"), " did the carving; the rockfall does the ongoing demolition."), React.createElement(NatureNotesFilm, {
    id: "rock-fall",
    title: "Rock Fall",
    youtubeId: "H0YhlqP1BgE",
    episode: 10,
    note: "The Park Service's film on the process that builds every talus slope in the Valley, and so the one this journal is named for.",
    location: "article"
  }), React.createElement("h2", null, "Where to see one"), React.createElement("p", null, "You will not have to look. From the Valley floor the talus is the skirt at the bottom of every wall, most obviously below the Rhombus Wall east of Camp 4, below the Glacier Point Apron behind Half Dome Village, and along the base of the north wall between the Three Brothers and Yosemite Falls. The road and the bike paths run across old talus in several places without announcing it."), React.createElement("p", null, "The one to walk is the approach to ", React.createElement("a", {
    href: "/articles/mist-trail-the-real-guide"
  }, "the Mist Trail"), " and the lower Yosemite Falls trail, both of which cross talus that has been improved into a staircase. If you want the untouched version, look up at the base of Middle Cathedral from the meadow across the road: acres of angular blocks at the same tidy angle, with pines growing out of the gaps."), React.createElement("p", null, "Higher up, talus becomes habitat. The blocky slopes above 8,000 feet along ", React.createElement("a", {
    href: "/tioga-opening"
  }, "Tioga Road"), " are where pikas live, in the cold air spaces between rocks, and where marmots sun themselves on the flat tops. A talus field in the high country is not empty ground. It is an address."), React.createElement("h2", null, "Walking on talus"), React.createElement("p", null, "Talus is stable until it is not, and the failure mode is a block rolling under your weight with a tonne of rock stacked above it. Three rules from people who spend time on it. Step on the tops of blocks rather than the gaps, because a foot wedged between two rocks is how ankles break. Move one at a time in a group, or spread out sideways rather than climbing in a line, so nothing anyone dislodges is heading for a friend. And treat fresh, pale, unlichened rock as the least trustworthy surface on the slope: it is there because that part of the mountain moved recently."), React.createElement("p", null, "Nothing in the Valley requires you to cross untracked talus, which is worth knowing before someone suggests a shortcut. The maintained trails that cross it have already done the hard part."), React.createElement("h2", null, "Why the journal is called The Talus Field"), React.createElement("p", null, "Because a talus field is what accumulates. No single rockfall builds one. Each block arrives on its own schedule, from a cliff that looks permanent and is not, and the pile at the bottom is the record of every one of them. Stand on it and you are standing on a few hundred thousand years of small events that nobody was there to see."), React.createElement("p", null, "That is what a field journal is for. One entry is a note about a road opening or a bear in a parking lot or the week the dogwoods came out. None of them is the park. Enough of them, kept honestly over enough seasons, start to describe a place that is changing faster than it looks like it is."), React.createElement("p", null, "It also happens to be the landform I can see from the house. That is the other half of the answer, and the more truthful one."), React.createElement("h3", null, "Sources"), React.createElement("ul", {
    style: {
      fontSize: 14
    }
  }, React.createElement("li", null, "National Park Service, Yosemite: rockfall monitoring and geology programs."), React.createElement("li", null, "Huber, N. King, ", React.createElement("em", null, "The Geologic Story of Yosemite National Park"), ", U.S. Geological Survey Bulletin 1595."), React.createElement("li", null, "Field observation, El Portal and Yosemite Valley.")));
};
