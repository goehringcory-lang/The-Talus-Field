function FirefallPage({
  go
}) {
  var goArticle = (e, slug) => {
    e.preventDefault();
    go(`a:${slug}`);
  };
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "Firefall"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Seasonal event · mid-to-late February"), React.createElement("h1", null, "The Yosemite Firefall"), React.createElement("p", {
    className: "page-head__dek"
  }, "For roughly two weeks in mid-to-late February, sunset light can turn Horsetail Fall into a glowing orange ribbon on El Capitan. It is real, it is not enhanced in the photographs, and most evenings it does not happen. This page is the honest version: when the window runs, what has to line up, and how to plan an evening around uncertain odds."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "The window"), React.createElement("p", null, "The sun angle that lights the fall runs roughly the second week of February through the last week, with the strongest color usually in the middle of that span. The same geometry occurs in late October, but by then the fall is almost always dry, so February is the season. Outside those dates the sunset light either misses the fall or fails to isolate it against shadowed rock. The glow itself is short: it builds for a few minutes, peaks near sunset, and is finished about ten minutes later."), React.createElement("h2", null, "Three conditions, and all of them must hold"), React.createElement("p", null, "The firefall is an alignment problem. Any one condition failing cancels the show entirely."), React.createElement("ol", null, React.createElement("li", null, React.createElement("strong", null, "Water in the fall."), " Horsetail has a tiny drainage and no lake feeding it; it flows only when recent rain or melting snow is running off El Capitan's summit. A cold, dry February leaves it empty. A storm the week before, followed by mild afternoons, is the ideal setup."), React.createElement("li", null, React.createElement("strong", null, "A clear western horizon at sunset."), " The light travels from the horizon up the Merced canyon onto the cliff. A cloud bank sitting where the sun goes down kills the show even on an otherwise clear evening."), React.createElement("li", null, React.createElement("strong", null, "The sun angle."), " The only condition you can schedule, and the reason the window above exists at all.")), React.createElement("p", null, "The arithmetic: fourteen to eighteen candidate evenings a year, minus February's clouds, minus dry years. Some years several evenings converge and produce the famous photographs. Some years the firefall effectively does not happen. Anyone selling certainty for one specific evening is selling something.")), React.createElement("div", {
    style: {
      marginTop: 48
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "Check the two conditions that change"), React.createElement(WebcamStrip, null), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      marginTop: 16
    }
  }, "Water and weather, live:", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "webcams, entrance waits, and the Valley forecast →"), " ", "For the current year's viewing rules (parking, closures, and any reservation requirement, which change annually), check", " ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/horsetailfall.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "the NPS Horsetail Fall page"), " ", "and", " ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "current conditions"), " ", "in the week before you commit.")), React.createElement("section", {
    className: "prose",
    style: {
      marginTop: 48
    }
  }, React.createElement("h2", null, "The shape of the evening"), React.createElement("p", null, "Whatever the current rules are, assume this: you will park somewhere designated, probably at Yosemite Falls parking, and walk a mile or more each way on pavement toward the classic viewing zone on Northside Drive near the El Capitan Picnic Area. Photographers stake tripod positions by early afternoon on promising days; even a casual viewer should be in place at least an hour before sunset. Then you wait, standing still, through a February evening in a shaded valley at 4,000 feet. Bring real layers, something insulated to stand on, a headlamp for the walk out, and a thermos. The people who suffer at the firefall are underdressed for standing still, not for hiking."), React.createElement("p", null, "February driving matters too: chain control on the approach highways is routine after storms, which is exactly the weather that fills the fall."), React.createElement("p", null, "The full story, the history, the photography notes, and the naturalist's case for February with or without the show:", " ", React.createElement("a", {
    href: "/articles/horsetail-fall-firefall",
    onClick: e => goArticle(e, "horsetail-fall-firefall")
  }, React.createElement("strong", null, "the complete firefall guide →")))), React.createElement(NewsletterInline, {
    location: "firefall",
    tag: "firefall",
    heading: "February, watched from inside the park",
    blurb: "Sunday Field Notes carries the firefall window as it develops: water in the fall, the week's weather, and what the rules are this year. One short letter a week. Free."
  })));
}
window.FirefallPage = FirefallPage;
