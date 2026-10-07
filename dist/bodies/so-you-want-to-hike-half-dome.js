window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["so-you-want-to-hike-half-dome"] = function SoYouWantToHikeHalfDomeBody() {
  var AXIS = {
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
    fontSize: 18,
    fill: "var(--ink)"
  };
  var svgStyle = {
    width: "100%",
    height: "auto",
    display: "block"
  };
  function StartHigh() {
    var W = 680,
      H = 360,
      L = 58,
      T = 24,
      B = 34;
    var lo = 3000,
      hi = 10500,
      ph = H - T - B;
    var y = ft => T + ph - (ft - lo) / (hi - lo) * ph;
    var bw = 92;
    var hd = 170,
      cr = 440;
    return React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      style: svgStyle,
      role: "img",
      "aria-label": "Where each hike starts and ends. Half Dome starts on the Valley floor at about 4,000 feet and tops out at 8,839 feet, about 4,800 feet of total climbing, the last 400 vertical feet on the cables. Clouds Rest starts at the Sunrise trailhead on Tioga Road at 8,151 feet, most of the way to Half Dome's summit before a step is taken, and tops out at 9,926 feet, more than a thousand feet higher than Half Dome, in two climbs of about 1,000 feet each."
    }, [4000, 6000, 8000, 10000].map(f => React.createElement("g", {
      key: f
    }, React.createElement("line", {
      x1: L,
      x2: W - 10,
      y1: y(f),
      y2: y(f),
      stroke: "var(--rule-soft)",
      strokeWidth: "1"
    }), React.createElement("text", {
      x: L - 8,
      y: y(f) + 4,
      textAnchor: "end",
      style: AXIS
    }, f.toLocaleString("en-US")))), React.createElement("text", {
      x: L - 8,
      y: T - 8,
      textAnchor: "end",
      style: AXIS
    }, "feet"), React.createElement("rect", {
      x: hd,
      y: y(8839),
      width: bw,
      height: y(4000) - y(8839),
      fill: "var(--moss)",
      opacity: "0.22"
    }), React.createElement("rect", {
      x: hd,
      y: y(8839),
      width: bw,
      height: y(8439) - y(8839),
      fill: "var(--rust)"
    }), React.createElement("line", {
      x1: hd,
      x2: hd + bw,
      y1: y(8839),
      y2: y(8839),
      stroke: "var(--ink)",
      strokeWidth: "2"
    }), React.createElement("text", {
      x: hd + bw / 2,
      y: y(8839) - 26,
      textAnchor: "middle",
      style: PLACE
    }, "Half Dome"), React.createElement("text", {
      x: hd + bw / 2,
      y: y(8839) - 8,
      textAnchor: "middle",
      style: LABEL
    }, "8,839 ft"), React.createElement("text", {
      x: hd + bw / 2,
      y: y(4000) + 18,
      textAnchor: "middle",
      style: LABEL
    }, "Valley, ~4,000 ft"), React.createElement("text", {
      x: hd + bw + 12,
      y: y(8639) + 5,
      style: {
        ...LABEL,
        fill: "var(--rust)"
      }
    }, "the cables, 400 ft"), React.createElement("text", {
      x: hd + bw + 12,
      y: y(6400),
      style: LABEL
    }, "about 4,800 ft"), React.createElement("text", {
      x: hd + bw + 12,
      y: y(6400) + 18,
      style: LABEL
    }, "of climbing"), React.createElement("rect", {
      x: cr,
      y: y(9926),
      width: bw,
      height: y(8151) - y(9926),
      fill: "var(--moss)",
      opacity: "0.55"
    }), React.createElement("line", {
      x1: cr,
      x2: cr + bw,
      y1: y(9926),
      y2: y(9926),
      stroke: "var(--ink)",
      strokeWidth: "2"
    }), React.createElement("text", {
      x: cr + bw / 2,
      y: y(9926) - 26,
      textAnchor: "middle",
      style: PLACE
    }, "Clouds Rest"), React.createElement("text", {
      x: cr + bw / 2,
      y: y(9926) - 8,
      textAnchor: "middle",
      style: LABEL
    }, "9,926 ft"), React.createElement("text", {
      x: cr + bw / 2,
      y: y(8151) + 18,
      textAnchor: "middle",
      style: LABEL
    }, "Sunrise trailhead, 8,151 ft"), React.createElement("text", {
      x: cr + bw + 12,
      y: y(9100),
      style: LABEL
    }, "two climbs,"), React.createElement("text", {
      x: cr + bw + 12,
      y: y(9100) + 18,
      style: LABEL
    }, "~1,000 ft each"), React.createElement("text", {
      x: cr + bw / 2,
      y: y(6000),
      textAnchor: "middle",
      style: {
        ...LABEL,
        fill: "var(--ink-3)"
      }
    }, "You drive this part."), React.createElement("line", {
      x1: cr + bw / 2,
      x2: cr + bw / 2,
      y1: y(6000) + 10,
      y2: y(8151) + 30,
      stroke: "var(--ink-3)",
      strokeDasharray: "3 4"
    }));
  }
  return React.createElement(React.Fragment, null, React.createElement("p", {
    className: "dropcap"
  }, "I get it. You want to hike Half Dome."), React.createElement("p", null, "Everybody does. It's the silhouette on the license plate, the logo on the beer can, the thing your friend did last summer that they won't shut up about. And I'm not going to tell you you're wrong for wanting it. The cables are unlike anything I've ever done anywhere else in the national park system. You clip your hands onto those steel cables, lean into the granite at a 45-degree angle, and pull yourself up 400 vertical feet of rock with nothing between you and the Valley floor but air and gravity. It is hard on the arms and legs, and the exposure is real. When you stand on top, at 8,839 feet, looking out at a panorama that stretches from the Clark Range to the Cathedral Peaks, it feels earned."), React.createElement("p", null, "It's worth doing once."), React.createElement("p", null, "If you get the permit, you're in shape, and the weather cooperates, do it. But for most people planning a Yosemite trip, those conditions don't all line up, and that is what the rest of this article is about."), React.createElement("h2", null, "The hike itself"), React.createElement("p", null, "The Half Dome day hike is a 14 to 16 mile round trip from Happy Isles in Yosemite Valley with about 4,800 feet of total elevation gain. The National Park Service says most hikers take 10 to 12 hours. Some take longer. You're leaving before sunrise and getting back after dark unless you're in serious shape and moving fast."), React.createElement("p", null, "The route follows the Mist Trail or the John Muir Trail (or one up and the other down) past ", React.createElement("a", {
    href: "/articles/yosemite-waterfalls-guide"
  }, "Vernal Fall and Nevada Fall"), ", two of the most famous waterfalls in the world, and then up through Little Yosemite Valley to the base of the subdome."), React.createElement("p", null, "The subdome is a steep granite staircase carved into the rock. It's exhausting after the miles you've already put in. And then you reach the cables."), React.createElement("p", null, "Two steel cables, held up by metal poles, run 400 feet up the back of Half Dome at roughly a 45-degree grade. You grab the cables, you pull, you step, you repeat. There are wooden crossboards every few feet to brace your feet on. When it's crowded (and in July and August, it's crowded), you're doing this in a conga line, waiting for people above you to move, gripping cables that a hundred sweaty hands have already gripped that morning. When the rock is dry and the sky is clear, it's thrilling. When the rock is wet, it's dangerous. Nearly all fatal falls from the cable route have happened when the rock was wet."), React.createElement("p", null, "The NPS doesn't sugarcoat it: rangers assist hundreds of people on the Half Dome trail every summer. Most of those emergencies could have been prevented with better preparation."), React.createElement(NatureNotesFilm, {
    id: "half-dome",
    title: "Half Dome",
    youtubeId: "ihNpkUp5JdM",
    episode: 4,
    note: "The Park Service's film on the rock and what it takes to stand on top. Watch it before the lottery, not after.",
    location: "article"
  }), React.createElement("h2", null, "The permit problem"), React.createElement("p", null, "You need a permit to hike past the subdome, seven days a week, whenever the cables are up. The cables typically go up the Friday before Memorial Day and come down the day after Columbus Day. No permit means a ranger turns you around. No exceptions."), React.createElement("p", null, "A maximum of 300 people per day are allowed past the base of the subdome: roughly 225 day hikers and 75 ", React.createElement("a", {
    href: "/articles/yosemite-wilderness-permits-guide"
  }, "backpackers"), "."), React.createElement("p", null, "There are two ways to get a day-hiker permit, and both are lotteries."), React.createElement("p", null, React.createElement("strong", null, "The preseason lottery"), " has its application window during the month of March, with results emailed in mid-April. You can request permits for up to six people and specify your preferred dates or a date range. In 2024, 35,289 applications were submitted. The success rate was 22%. That means roughly four out of five people who applied didn't get a permit for any of their requested dates."), React.createElement("p", null, "Saturdays are the most requested day, with about 21% of all applications targeting a Saturday. Mondays and Thursdays are the least popular, at about 12% each. If you have flexibility on dates, weekdays give you better odds, but \"better\" still means most people don't get in."), React.createElement("p", null, React.createElement("strong", null, "The daily lottery"), " is a second chance. During cable season, ", React.createElement("a", {
    href: "/articles/yosemite-walk-up-and-day-of-permits"
  }, "additional permits are released two days before each hiking date"), ". You apply by 4 PM Pacific time, and results come late that evening. In 2024, 35,561 daily lottery applications were submitted with a 19% success rate. Weekday odds run around 22%. Weekend odds drop to about 14%."), React.createElement("p", null, "Both lotteries charge a $10 non-refundable application fee. If you win, there's an additional $10 per person permit fee. Permits are non-transferable and require photo ID at the subdome checkpoint."), React.createElement("p", null, "For the full breakdown on how both lotteries work, including strategy tips, see the ", React.createElement("a", {
    href: "/half-dome-lottery"
  }, "permit lottery guide"), "."), React.createElement("p", null, "If you're planning a Yosemite trip around specific dates, there's roughly a one-in-five chance you'll get a Half Dome permit. If your entire trip hinges on that permit, you're building a vacation on a coin flip. And if you don't get the permit, you might spend your best hiking day in Yosemite feeling like the trip was incomplete."), React.createElement("h2", null, "Here's what I actually want to tell you"), React.createElement("p", null, "If what you're after is the cables, the specific experience of pulling yourself up the back of Half Dome on steel cables, standing on that famous summit, looking down at the Valley from the place in every photograph, then yes, you need the permit, and you should go for it. Play both lotteries. I hope you get it."), React.createElement("p", null, "But if what you're really after is an incredible full-day hike in Yosemite with a summit that makes your jaw drop and views that make you feel like you're standing on top of the Sierra Nevada, I want to tell you about ", React.createElement("a", {
    href: "/articles/clouds-rest-hike"
  }, "Clouds Rest"), "."), React.createElement("p", null, "Clouds Rest is the better hike."), React.createElement("h2", null, "Clouds Rest from Sunrise trailhead"), React.createElement("p", null, "Clouds Rest is a 9,926-foot peak on the north rim of Tenaya Canyon. Its summit is more than a thousand feet higher than Half Dome. From the top, you get a 360-degree panorama that includes Half Dome itself (looking down at it from above), Tenaya Canyon (one of the most dramatic canyons in the park), Yosemite Valley, the Cathedral Range, Mount Hoffmann, and the entire high country stretching to the Sierra crest. On a clear day, you can see from the foothills to the peaks of the Ritter Range."), React.createElement("p", null, "The view is bigger than Half Dome's in every direction."), React.createElement("p", null, "And you don't need a permit."), React.createElement("p", null, "The hike starts at the Sunrise Lakes trailhead on Tioga Road, east of Olmsted Point at the west end of Tenaya Lake. It's 14 miles round trip with roughly 2,300 feet of elevation gain in two separate pushes. The trailhead sits at 8,151 feet, which means you start high and stay high the entire day. No climbing 4,800 feet from the Valley floor. No Mist Trail staircase with a thousand other people. No heat radiating off the Valley walls in July."), React.createElement("p", null, "The heat matters more than most people expect."), React.createElement("figure", {
    style: {
      margin: "28px 0 32px"
    }
  }, React.createElement(StartHigh, null), React.createElement("figcaption", null, "Start and summit elevations from this article. Clouds Rest starts nearly as high as Half Dome's summit, which is most of the argument for it in July.")), React.createElement("h2", null, "Why this is better than Half Dome in July and August"), React.createElement("p", null, "Half Dome's cable season peaks in July and August. Those are also the hottest months in Yosemite Valley, where the trailhead sits at 4,000 feet. You wake up at 4 AM to beat the heat. You climb 4,800 feet on a trail that has no shade for long stretches. You share the Mist Trail with what feels like the entire state of California, and the ", React.createElement("a", {
    href: "/articles/mist-trail-the-real-guide"
  }, "Mist Trail can be genuinely dangerous"), " when it's that crowded. By the time you reach the subdome, you've been hiking for five or six hours in ", React.createElement("a", {
    href: "/articles/yosemite-heat-safety-guide"
  }, "conditions that punish anyone who didn't bring enough water"), " or didn't train enough."), React.createElement("p", null, "Clouds Rest from Sunrise trailhead starts at 8,150 feet. The air is cooler. The trail is shaded through lodgepole forest for most of the first several miles. You're sharing the trail with maybe a few dozen people all day, not hundreds. There's no permit lottery, no subdome checkpoint, no conga line."), React.createElement("p", null, "As soon as Tioga Road opens, typically late May to early June depending on the snow year, this hike is available. In a low snow year, the trail can be clear by early June. You might encounter a few snow patches here and there in the first couple of weeks after Tioga opens, but the trail is well-defined and the route is intuitive. Bring trekking poles if you're hiking in early season, and gaiters if the snow is still melting. By late June or early July, the trail is fully clear."), React.createElement("h2", null, "The trail, section by section"), React.createElement("p", null, React.createElement("strong", null, "Miles 0 to 1.5: The flat approach."), " From the trailhead, cross Tenaya Creek (early season: expect wet feet; by July you can rock-hop) and follow signs toward Clouds Rest and Sunrise High Sierra Camp. The first mile and a half is gentle, rolling through forest over granite slabs. This is the warmup."), React.createElement("p", null, React.createElement("strong", null, "Miles 1.5 to 2.5: The first climb."), " The trail gains about 1,000 feet through a series of switchbacks up to the ridgeline east of Tenaya Canyon. This is the hardest sustained climb of the day. Old stone trail work (steps, walls) marks the path, though some of it has crumbled with time. Take your time. You're at altitude and it's going to feel harder than 1,000 feet normally feels."), React.createElement("p", null, React.createElement("strong", null, "Miles 2.5 to 4.5: The descent and meadow."), " At the saddle, you'll pass the junction with the trail to Sunrise High Sierra Camp. Continue south as the trail drops about 400 feet into a forested meadow. Sunrise Mountain rises to the east. In early season, parts of this section can be marshy. A small pond sits in the meadow, and the surrounding area can be wet. This is the quiet middle of the hike. You'll likely see almost no one."), React.createElement("p", null, React.createElement("strong", null, "Miles 4.5 to 5.5: The second climb."), " The trail turns west and begins its second major ascent, another 1,000 feet up toward the Clouds Rest ridgeline. This one is steady but less steep than the first. As you climb, the trees thin and the views start opening up. You'll catch your first glimpses down into Tenaya Canyon, sheer granite walls dropping thousands of feet."), React.createElement("p", null, React.createElement("strong", null, "Miles 5.5 to 6.5: The spine."), " And then the trees fall away entirely."), React.createElement("p", null, "The final half-mile to the summit follows a narrow granite ridge, the spine of Clouds Rest. The ridge is maybe 10 to 20 feet wide in most places, with the north side dropping thousands of feet into Tenaya Canyon and the south side falling steeply toward the Merced River drainage. The trail uses the slightly less exposed south side of the ridge for most of the approach, but there's no hiding from the fact that you're walking along the top of a wall."), React.createElement("p", null, "It's not technical. You don't need ropes or climbing experience. But if you're afraid of heights, this section will test you. The granite is solid underfoot (good traction when dry) and the trail is clear. But the exposure is real, and on a windy day, it's intense."), React.createElement("p", null, "Take your time. Stop often. Look around. The views open in every direction and they only get better the higher you go."), React.createElement("p", null, React.createElement("strong", null, "The summit."), " The top of Clouds Rest is a broad granite platform. Not a point, not a knife-edge, a place where you can sit, eat lunch, lie on the warm rock, and take in a panorama that most people in Yosemite never see."), React.createElement("p", null, "Half Dome rises to the south, and you're looking down at it. You spent your whole trip staring up at Half Dome from the Valley, and now you're above it. Tenaya Canyon drops away to the north in one of the most dramatic vertical landscapes in the Sierra. To the west, Yosemite Valley unfolds: El Capitan, Bridalveil Fall, the whole sweep of it. To the east, the Cathedral Range and the high country. To the south, the Clark Range and the Merced watershed."), React.createElement("p", null, "It's one of the great summits in the national park system. And on a Tuesday in June, you might have it to yourself."), React.createElement("h2", null, "Water and logistics"), React.createElement("p", null, React.createElement("strong", null, "Water plan:"), " The only reliable water on the trail is in the first couple of miles: Tenaya Creek at the trailhead, and a few seasonal streams and the marshy meadow in the middle section. After that, there's nothing until you return. Carry at least 3 liters. If it's a hot day or you're a heavy drinker, carry 4. A water filter is useful in early season for topping off at the meadow streams, but by late July those may be dry. For a full day-pack checklist, see the ", React.createElement("a", {
    href: "/kit"
  }, "day pack guide"), "."), React.createElement("p", null, React.createElement("strong", null, "Start time:"), " Leave the trailhead by 7 AM at the latest in summer. Earlier is better. The Park Service puts the round trip at 8 to 10 hours, and you want to be off the summit before afternoon thunderstorms build. Lightning on the spine of Clouds Rest is not a theoretical risk. It's the primary safety concern of this hike. If you see clouds building, turn around. The summit will be there tomorrow."), React.createElement("p", null, React.createElement("strong", null, "Parking:"), " The Sunrise Lakes trailhead parking lot is small, and on summer weekends it can fill early. Additional parking is available along the shoulder of Tioga Road nearby, but check for \"no parking\" signs. On weekdays, parking is rarely an issue before 8 AM."), React.createElement("p", null, React.createElement("strong", null, "What to wear:"), " Trail runners or hiking boots with good traction. The granite on the spine is grippy when dry but slick when wet, same as Half Dome's cables. Layers for the summit: at nearly 10,000 feet, it can be 15 to 20 degrees cooler than the Valley and windy even on a calm day below. Sun protection is critical at this elevation."), React.createElement("p", null, React.createElement("strong", null, "The trailhead creek crossing:"), " Tenaya Creek crosses the trail within the first few hundred feet. In spring and early summer when snowmelt is heavy, this can be a real ford: knee-deep, cold, fast. By mid-July, it's usually a rock-hop. By late August, it might be dry. If you're hiking in early season, bring shoes you don't mind getting wet or carry sandals for the crossing."), React.createElement("h2", null, "Safety"), React.createElement("p", null, "Clouds Rest is safer than Half Dome in most respects. No cables, no conga line, no permit-pressure pushing people to hike in conditions they shouldn't. But it has its own risks."), React.createElement("p", null, React.createElement("strong", null, "Lightning."), " This is the big one. The summit and spine are fully exposed at nearly 10,000 feet. Afternoon thunderstorms are common in July and August. If you see dark clouds building or hear distant thunder, descend immediately. Do not wait to see if the storm passes. Get off the ridgeline and into the trees. The standard rule applies: summit before noon, descend by early afternoon."), React.createElement("p", null, React.createElement("strong", null, "The spine exposure."), " The narrow ridge is not dangerous if you're careful, but it demands respect. Stay on the trail, don't scramble onto side ledges for photos, and be honest with yourself about your comfort with heights. There's an old alternate trail that goes around the east side of the summit, avoiding the exposed ridgeline, though it's less maintained and can be hard to follow."), React.createElement("p", null, React.createElement("strong", null, "Distance and altitude."), " Fourteen miles at 8,000 to 10,000 feet is a serious day, especially if you're visiting from sea level. The altitude makes everything harder. Drink water before you're thirsty, eat before you're hungry, and take rest breaks in the shade. Altitude sickness symptoms include headache and nausea. If you feel them, descend."), React.createElement("p", null, React.createElement("strong", null, "Early season hazards."), " Snow patches on the trail can linger into late June, especially on north-facing slopes. Post-holing through soft snow is exhausting and disorienting. If you're hiking in the first two weeks after Tioga opens, check current conditions and be prepared to turn around if snow coverage is too heavy."), React.createElement("h2", null, "Half Dome vs. Clouds Rest: the honest comparison"), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null), React.createElement("th", null, "Half Dome"), React.createElement("th", null, "Clouds Rest (from Sunrise)"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Round trip distance")), React.createElement("td", null, "14 to 16 miles"), React.createElement("td", null, "14 miles")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Elevation gain")), React.createElement("td", null, "4,800 feet"), React.createElement("td", null, "~2,300 feet")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Summit elevation")), React.createElement("td", null, "8,839 feet"), React.createElement("td", null, "9,926 feet")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Starting elevation")), React.createElement("td", null, "~4,000 feet (Valley)"), React.createElement("td", null, "8,151 feet (Tioga Road)")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Permit required")), React.createElement("td", null, "Yes, lottery, ~20% odds"), React.createElement("td", null, "No")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Typical time")), React.createElement("td", null, "10 to 12 hours"), React.createElement("td", null, "8 to 10 hours")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Crowds on trail")), React.createElement("td", null, "Heavy (Mist Trail, cables)"), React.createElement("td", null, "Light to moderate")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "The cables")), React.createElement("td", null, "Unique, nothing like it"), React.createElement("td", null, "No cables, open granite ridge")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Summit views")), React.createElement("td", null, "Spectacular, mostly south/west"), React.createElement("td", null, "360-degree, higher elevation")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Available")), React.createElement("td", null, "Cable season (late May to mid-October)"), React.createElement("td", null, "Whenever Tioga Road is open")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Heat exposure")), React.createElement("td", null, "Significant (Valley start, low elevation)"), React.createElement("td", null, "Minimal (high elevation start)")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Biggest risk")), React.createElement("td", null, "Wet cables, lightning, overcrowding"), React.createElement("td", null, "Lightning, exposure on spine")))), React.createElement("p", null, "Half Dome gives you the cables. Nothing else in the park, nothing else in any park, gives you that experience. The cables are singular."), React.createElement("p", null, "Clouds Rest gives you everything else. The bigger views, the higher summit, the quieter trail, the cooler temperatures, the freedom from lottery stress, and a ridgeline walk as thrilling as the cables."), React.createElement("h2", null, "If you still want Half Dome"), React.createElement("p", null, "Do it. Seriously, if you have the permit, you're in shape, and the weather is good, go hike Half Dome. It's one of the great experiences in the American outdoors. Read the ", React.createElement("a", {
    href: "/half-dome-lottery"
  }, "permit lottery guide"), " for strategy on both lotteries, pack the ", React.createElement("a", {
    href: "/kit"
  }, "right day pack"), ", start before dawn, bring 4 liters of water and gloves for the cables, and check the weather forecast the night before. If there's any chance of rain, don't go. The cables are not worth your life when the rock is wet."), React.createElement("p", null, "But if the permit doesn't come through, or if you're visiting in June before the cables go up, or if the idea of the Mist Trail in August makes you feel tired just thinking about it, go do Clouds Rest. ", React.createElement("a", {
    href: "/articles/tioga-road-stop-by-stop"
  }, "Drive up Tioga Road"), ", park at the Sunrise trailhead, walk seven miles through some of the most beautiful high country in the Sierra Nevada, and stand on a summit that's higher than Half Dome, quieter than Half Dome, and more beautiful than Half Dome."), React.createElement("p", null, "You won't feel like you missed anything."));
};
