window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["showy-milkweed-yosemite-valley"] = function ShowyMilkweedYosemiteValleyBody() {
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
  var STEP = {
    fontFamily: "var(--serif)",
    fontSize: 16,
    fill: "var(--ink)"
  };
  var HEAD = {
    fontFamily: "var(--sans)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 1.4,
    fill: "var(--rust)"
  };
  var INBAR = {
    fontFamily: "var(--sans)",
    fontSize: 12.5,
    fontWeight: 600,
    fill: "var(--paper)"
  };
  var svgStyle = {
    width: "100%",
    height: "auto",
    display: "block"
  };
  var MONTHS = ["June", "July", "August", "September"];
  var CHAIN = [["Milkweed", ["latex carries", "cardiac glycosides"]], ["Egg", ["laid only", "on milkweed"]], ["Caterpillar", ["eats only milkweed,", "stores the toxin"]], ["Chrysalis", ["the toxin", "carried through"]], ["Butterfly", ["orange and black:", "a warning"]]];
  function MilkweedSeason() {
    var W = 680,
      H = 330,
      L = 10,
      R = 10,
      T = 44;
    var col = (W - L - R) / 4,
      mx = m => L + m * col;
    var cw = (W - L - R) / 5;
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: svgStyle,
      role: "img",
      "aria-label": "Two panels. The season on the Yosemite Valley floor: showy milkweed blooms from roughly late June through July, peaking in mid-July; in August the flowers give way to seed pods, which split to release seeds on silky floss that fills the air in September. The borrowed poison: milkweed latex carries cardiac glycosides; the monarch lays its eggs only on milkweed; the caterpillars eat only milkweed and store the toxin; it carries through the chrysalis into the adult, whose orange and black coloring is a warning to birds."
    }, React.createElement("text", {
      x: L,
      y: 18,
      style: HEAD
    }, "THE SEASON ON THE VALLEY FLOOR"), MONTHS.map((m, i) => React.createElement("g", {
      key: m
    }, React.createElement("line", {
      x1: mx(i),
      x2: mx(i),
      y1: T - 4,
      y2: T + 50,
      stroke: "var(--rule-soft)"
    }), React.createElement("text", {
      x: mx(i) + 8,
      y: T + 10,
      style: SMALL
    }, m))), React.createElement("rect", {
      x: mx(0.7),
      y: T + 20,
      width: mx(2) - mx(0.7) - 2,
      height: 28,
      rx: "3",
      fill: "var(--moss)"
    }), React.createElement("text", {
      x: mx(0.7) + 10,
      y: T + 39,
      style: INBAR
    }, "In bloom"), React.createElement("path", {
      d: `M${mx(1.5)} ${T + 52} l-7 9 h14 z`,
      fill: "var(--rust)"
    }), React.createElement("text", {
      x: mx(1.5) + 12,
      y: T + 64,
      style: {
        ...LABEL,
        fill: "var(--rust)"
      }
    }, "peak, mid-July"), React.createElement("rect", {
      x: mx(2) + 2,
      y: T + 20,
      width: col - 4,
      height: 28,
      rx: "3",
      fill: "none",
      stroke: "var(--moss)",
      strokeWidth: "1.5"
    }), React.createElement("text", {
      x: mx(2) + 12,
      y: T + 39,
      style: {
        ...INBAR,
        fill: "var(--moss)"
      }
    }, "Seed pods"), React.createElement("rect", {
      x: mx(3) + 2,
      y: T + 20,
      width: col - 4,
      height: 28,
      rx: "3",
      fill: "none",
      stroke: "var(--moss)",
      strokeWidth: "1.5",
      strokeDasharray: "4 3"
    }), React.createElement("text", {
      x: mx(3) + 12,
      y: T + 39,
      style: {
        ...INBAR,
        fill: "var(--moss)"
      }
    }, "Floss in the air"), React.createElement("text", {
      x: L,
      y: T + 88,
      style: SMALL
    }, "Bloom from roughly late June; pods split to release hundreds of seeds, each on a tuft of floss."), React.createElement("text", {
      x: L,
      y: T + 124,
      style: HEAD
    }, "THE BORROWED POISON"), CHAIN.map(([name, note], i) => {
      var cx = L + i * cw + cw / 2,
        cy = T + 176;
      return React.createElement("g", {
        key: name
      }, React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "22",
        fill: i === 0 ? "var(--moss)" : i === 4 ? "var(--rust)" : "none",
        stroke: i === 0 ? "var(--moss)" : "var(--rust)",
        strokeWidth: "1.8"
      }), React.createElement("text", {
        x: cx,
        y: cy + 5,
        textAnchor: "middle",
        style: {
          ...LABEL,
          fontWeight: 700,
          fill: i === 0 || i === 4 ? "var(--paper)" : "var(--rust)"
        }
      }, i === 0 ? "M" : i), i < CHAIN.length - 1 && React.createElement("path", {
        d: `M${cx + 28} ${cy} H${cx + cw - 30} m-7 -5 l7 5 l-7 5`,
        fill: "none",
        stroke: "var(--ink-3)",
        strokeWidth: "1.4"
      }), React.createElement("text", {
        x: cx,
        y: cy + 46,
        textAnchor: "middle",
        style: STEP
      }, name), note.map((line, j) => React.createElement("text", {
        key: j,
        x: cx,
        y: cy + 64 + j * 16,
        textAnchor: "middle",
        style: SMALL
      }, line)));
    }));
  }
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "dropcap"
  }, "Across the meadows of Yosemite Valley right now, in mid-July, a stout gray-green plant is bearing clusters of dusty pink flowers the size of a fist. This is showy milkweed, ", React.createElement("em", null, "Asclepias speciosa"), ", and it is having its best two weeks of the year. Walk out into Cook's Meadow, one of the best places to find it, or ", React.createElement("a", {
    href: "/articles/watching-climbers-el-capitan"
  }, "El Capitan Meadow"), ", and you will find it standing two to five feet tall, its stems furred, its broad leaves felted like a rabbit's ear. The flower heads are busy with bees, wasps, and, if the summer is kind, monarch butterflies. It is one of the most quietly important plants in the park, and for the next few weeks it is impossible to miss."), React.createElement("p", null, "Most Valley visitors walk past it. It does not have the reach of a dogwood or the drama of a lupine field. But few plants here carry as much ecological weight per stem, and none has a flower built quite like it."), React.createElement("h2", null, "How to identify showy milkweed"), React.createElement("p", null, "Showy milkweed is easy to identify once you know the four things to look for. It is a robust perennial, waist-high, with a single stout stem that feels fuzzy to the touch. The leaves are broad, oval, and arranged in opposite pairs up the stem, with a pale midrib and prominent veins; the underside feels like felt. Break a leaf or a stem, and it bleeds a thick white latex, the milk that gives the whole family its name. And at the top sit the flowers: rounded umbels of dozens of small star-shaped blooms in dusty pink to rose lavender, faintly fragrant in the afternoon heat."), React.createElement("p", null, "That is enough to name it. The flower is worth a closer look: it is one of the strangest structures in the Sierra."), React.createElement("h2", null, "The most complicated flower in the meadow"), React.createElement("p", null, "A milkweed flower does not look like a normal flower because it is not built like one. Each individual bloom has five petals that curve sharply backward and down, out of the way. Above them sits a crown of five cupped, pointed hoods, and from inside each hood curves a small horn. In the center, where a normal flower would show stamens and a stigma, milkweed fuses everything into a single waxy column called the gynostegium. The nectar pools in the hoods. The reproductive machinery is hidden inside the column."), React.createElement("p", null, "The consequence is that milkweed cannot be pollinated the ordinary way, by pollen dusting off on a passing insect. Instead its pollen comes packaged in tiny saddlebag-shaped sacs called pollinia, joined in pairs by a slot-and-clip mechanism. When an insect lands to drink and its leg slips into one of the narrow grooves between the hoods, the clip catches the leg like a snap fastener. As the insect pulls free, it walks off wearing a pair of pollinia, which it then jams into the next flower's groove. It is closer to a machine than a blossom."), React.createElement("p", null, "This is efficient and occasionally lethal. Small or weak insects sometimes cannot pull their legs back out, and you will find bees and flies that died held fast by a flower. The system is also unreliable: a whole umbel of dozens of flowers may set only one or two seed pods. The plant makes up the difference in numbers."), React.createElement("h2", null, "Why monarchs depend on milkweed"), React.createElement("p", null, "The reason milkweed matters out of all proportion to its looks is the monarch butterfly. Monarchs are what biologists call an obligate specialist: the adult will drink nectar from many flowers, but the female lays her eggs only on milkweed, and the caterpillars eat only milkweed leaves. No milkweed, no monarchs. It is that direct."), React.createElement("p", null, "The caterpillars do more than eat the plant. Milkweed latex is loaded with cardiac glycosides, a class of toxins that stop the hearts of most animals that swallow enough of them. Monarch caterpillars have evolved to eat the leaves anyway and to store the toxins in their own bodies, carrying them through the chrysalis and into the adult butterfly. That is what the monarch's orange-and-black coloring advertises: a bird that eats one learns not to eat the next. The whole gaudy warning is borrowed, molecule by molecule, from the milkweed."), React.createElement("figure", {
    style: {
      margin: "30px 0 34px"
    }
  }, React.createElement(MilkweedSeason, null), React.createElement("figcaption", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      marginTop: 10
    }
  }, "The plant's year and the monarch's use of it, drawn from this article. Valley floor timing, approximate; the steps are not to scale.")), React.createElement("p", null, "The western monarch, the population that breeds across the Sierra in summer and clusters on the California coast to overwinter, has fallen hard. Overwintering numbers, estimated in the low millions in the 1980s, have dropped to a small fraction of that, and in some recent winters the coastal count has come in below ten thousand butterflies. The reasons are tangled: climate, pesticides, and the disappearance of the coastal groves among them, but the vanishing of breeding milkweed across the West is high on every biologist's list. Which is the plain case for the plant on the Valley roadside: a stand of blooming milkweed in July is breeding habitat for an animal that is running out of it."), React.createElement(NatureNotesFilm, {
    id: "monarchs-milkweed",
    title: "Monarchs & Milkweed",
    youtubeId: "V3jpu2th34o",
    episode: 24,
    note: "The Park Service's short on a milkweed field and everything that feeds on it: bees, wasps, hummingbirds and the monarch.",
    location: "article"
  }), React.createElement("h2", null, "Is milkweed poisonous? The milky sap"), React.createElement("p", null, "Snap any part of the plant and it weeps within seconds. This is the plant's defense, and it is a good one. The latex is sticky enough to gum up the mouthparts of a chewing insect, and it carries the same cardiac glycosides the monarch turns to its own use. Most animals that take a bite learn quickly to leave it alone. Deer avoid it. Cattle avoid it. The plant is, for practical purposes, left standing in landscapes where almost everything else gets grazed, which is part of why it thrives out in the open, sunny meadows of the Valley floor as well as along roadsides and old pullouts."), React.createElement("p", null, "A handful of specialists have cracked the code. Along with the monarch, milkweed hosts milkweed beetles, milkweed bugs, and tussock moth caterpillars, most of them wearing the same orange-and-black livery, all of them advertising the same stolen chemistry. A milkweed plant in full bloom is less a flower than a small, self-defending ecosystem."), React.createElement("h2", null, "Where and when to see milkweed in Yosemite Valley"), React.createElement("p", null, "Look on open, sunny ground rather than in the shady forest. The Valley's big meadows are the reliable places to find it, Cook's Meadow among the best, and it grows out through the grass as well as around the edges. The sunnier roadside verges and old pullouts along Northside and Southside Drives hold it too. It wants heat and open ground, so the bright, unshaded stretches are exactly where it does best."), React.createElement("p", null, "Timing matters here. The bloom runs from roughly late June through July on the Valley floor, and mid-July is close to its peak. By August the flowers give way to the next act: fat, warty seed pods (the follicles) that split down one side to release hundreds of flat brown seeds, each trailing a tuft of silky white floss called a coma. On a breezy September afternoon the air along the road shoulders fills with it. If you would rather track the season as a whole, our ", React.createElement("a", {
    href: "/articles/yosemite-wildflowers-guide"
  }, "Yosemite wildflower bloom calendar"), " follows the flowers uphill from the canyon floor to the Tuolumne high country as summer climbs the mountain."), React.createElement("h2", null, "Leave it standing"), React.createElement("p", null, "The one thing to do with a blooming milkweed is nothing. Do not pick it, and do not dig it up to plant at home; collecting plants is prohibited in the park, and a cut milkweed is a monarch nursery removed from the landscape. If you want milkweed in your own yard, and it is a strong pollinator plant for California gardens, buy nursery stock of a species native to your area rather than taking it from the wild. The latex is also a mild skin and eye irritant, so if you do handle a broken stem, keep it away from your face and wash your hands."), React.createElement("p", null, "Milkweed asks nothing of the people who walk past it. It has its pollinators, its poisons, and its one devoted butterfly. For the next couple of weeks it is doing the most consequential work on the Valley floor in plain sight, at knee height, on the ground everyone else is walking over. Slow down at the next sunny roadside and look."), React.createElement("h3", null, "Further reading"), React.createElement("ul", {
    style: {
      fontSize: 14
    }
  }, React.createElement("li", null, React.createElement("a", {
    href: "/articles/yosemite-wildflowers-guide"
  }, "Yosemite Wildflowers: A Bloom Calendar That Climbs the Mountain"), ". The month-by-month, elevation-by-elevation guide to the park's bloom."), React.createElement("li", null, React.createElement("a", {
    href: "/articles/water-ouzels-waterfalls"
  }, "How water ouzels live inside a waterfall"), ". Another Yosemite specialist whose presence reads the health of its habitat."), React.createElement("li", null, "Xerces Society for Invertebrate Conservation: Western Monarch Count and milkweed planting guidance for California."), React.createElement("li", null, "National Park Service, Yosemite: plants and pollinators resources, and the park's leave-what-you-find regulations.")));
};
