var {
  useState: useFilmsState,
  useRef: useFilmsRef,
  useEffect: useFilmsEffect
} = React;
var FILMS_START_ID = "rock-fall";
var FILMS_THEME_SHORT = {
  granite: "Granite",
  water: "Water",
  winter: "Winter",
  "after-dark": "After dark",
  forest: "Forest",
  wildlife: "Wildlife",
  people: "People"
};
function filmsPad(n) {
  return n < 10 ? `0${n}` : String(n);
}
function filmsTag(ep) {
  return ep.episode == null ? "SPECIAL" : `EP. ${filmsPad(ep.episode)}`;
}
function filmsSorted(eps) {
  return eps.slice().sort((a, b) => (a.episode == null ? 1 : 0) - (b.episode == null ? 1 : 0) || (a.episode || 0) - (b.episode || 0));
}
function filmsThumb(ep) {
  return `https://i.ytimg.com/vi/${ep.youtubeId}/hqdefault.jpg`;
}
function FilmsPlayGlyph({
  size
}) {
  return React.createElement("svg", {
    viewBox: "0 0 12 14",
    width: size,
    height: Math.round(size * 14 / 12),
    fill: "currentColor",
    "aria-hidden": "true"
  }, React.createElement("path", {
    d: "M1.5 0 L12 7 L1.5 14 Z"
  }));
}
function FilmsTheater({
  ep,
  themeTitle,
  playing,
  onPlay,
  screenRef
}) {
  var frameRef = useFilmsRef(null);
  useFilmsEffect(() => {
    if (playing && frameRef.current) frameRef.current.focus({
      preventScroll: true
    });
  }, [playing, ep.id]);
  var kicker = `${ep.episode == null ? "SPECIAL" : `EPISODE ${ep.episode}`} / ${themeTitle.toUpperCase()}`;
  return React.createElement("section", {
    className: "hp-films__theater",
    id: "feature",
    ref: screenRef,
    tabIndex: -1,
    "aria-label": "Now showing"
  }, React.createElement("div", {
    className: "hp-films__stage"
  }, playing ? React.createElement("div", {
    className: "hp-films__screen hp-films__screen--live"
  }, React.createElement("iframe", {
    key: ep.id,
    ref: frameRef,
    src: `https://www.youtube-nocookie.com/embed/${ep.youtubeId}?autoplay=1&rel=0`,
    title: `Yosemite Nature Notes: ${ep.title}`,
    allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share",
    allowFullScreen: true
  })) : React.createElement("button", {
    type: "button",
    className: "hp-films__screen",
    "aria-label": `Play film: ${ep.title}`,
    onClick: onPlay
  }, React.createElement("img", {
    key: ep.id,
    src: `https://i.ytimg.com/vi/${ep.youtubeId}/maxresdefault.jpg`,
    alt: "",
    decoding: "async",
    referrerPolicy: "no-referrer",
    onError: e => {
      var img = e.currentTarget;
      if (img.dataset.fallback) return;
      img.dataset.fallback = "1";
      img.src = filmsThumb(ep);
    }
  }), React.createElement("span", {
    className: "hp-films__shade",
    "aria-hidden": "true"
  }), React.createElement("span", {
    className: "hp-films__bigplay",
    "aria-hidden": "true"
  }, React.createElement(FilmsPlayGlyph, {
    size: 28
  })), React.createElement("span", {
    className: "hp-films__badge"
  }, ep.id === FILMS_START_ID ? "START HERE" : "NOW SHOWING")), React.createElement("div", {
    className: "hp-films__caption"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-films__kicker"
  }, kicker), React.createElement("h2", {
    className: "hp-films__now"
  }, ep.title), React.createElement("p", {
    className: "hp-films__nowdek"
  }, ep.dek)), React.createElement("p", {
    className: "hp-films__rights"
  }, React.createElement("span", null, "Film: National Park Service, public domain"), React.createElement("span", null, "Nothing loads from YouTube until you press play")))));
}
function FilmCard({
  ep,
  onPick
}) {
  return React.createElement("button", {
    type: "button",
    className: "hp-films__card",
    onClick: () => onPick(ep, "grid"),
    "aria-label": `Play film: ${ep.title}`
  }, React.createElement("span", {
    className: "hp-films__thumb"
  }, React.createElement("img", {
    src: filmsThumb(ep),
    alt: "",
    loading: "lazy",
    decoding: "async",
    referrerPolicy: "no-referrer"
  }), React.createElement("span", {
    className: "hp-films__tag"
  }, filmsTag(ep)), React.createElement("span", {
    className: "hp-films__play",
    "aria-hidden": "true"
  }, React.createElement(FilmsPlayGlyph, {
    size: 12
  }))), React.createElement("span", {
    className: "hp-films__meta"
  }, React.createElement("span", null, ep.episode == null ? "SPECIAL" : `EPISODE ${ep.episode}`), ep.year && React.createElement("span", null, ep.year)), React.createElement("span", {
    className: "hp-films__title"
  }, ep.title), React.createElement("span", {
    className: "hp-films__dek"
  }, ep.dek));
}
function FilmsPage({
  go
}) {
  var nn = window.NATURE_NOTES;
  var count = nn.episodes.length;
  var themeTitle = {};
  nn.themes.forEach(t => {
    themeTitle[t.id] = t.title;
  });
  var byTheme = id => filmsSorted(nn.episodes.filter(ep => ep.theme === id));
  var [theme, setTheme] = useFilmsState("all");
  var [filmId, setFilmId] = useFilmsState(FILMS_START_ID);
  var [playing, setPlaying] = useFilmsState(false);
  var screenRef = useFilmsRef(null);
  var current = nn.episodes.find(ep => ep.id === filmId) || nn.episodes[0];
  var track = (ep, surface) => {
    if (window.track) window.track("film_play", {
      film_id: ep.id,
      film_title: ep.title,
      location: "films",
      surface
    });
  };
  var pick = (ep, surface) => {
    track(ep, surface);
    setFilmId(ep.id);
    setPlaying(true);
    var el = screenRef.current;
    if (el) {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start"
      });
    }
  };
  var chips = [{
    id: "all",
    label: "All films",
    n: count
  }].concat(nn.themes.map(t => ({
    id: t.id,
    label: FILMS_THEME_SHORT[t.id] || t.title,
    n: byTheme(t.id).length
  })));
  var strip = theme === "all" ? nn.themes.reduce((acc, t) => acc.concat(byTheme(t.id)), []) : byTheme(theme);
  var stripLabel = theme === "all" ? `All ${count} films, by subject` : `${themeTitle[theme]}, ${strip.length} ${strip.length === 1 ? "film" : "films"}`;
  var shown = nn.themes.map((t, i) => ({
    t,
    i
  })).filter(x => theme === "all" || x.t.id === theme);
  var jump = (e, id) => {
    e.preventDefault();
    var el = document.getElementById(id);
    if (!el) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start"
    });
  };
  return React.createElement("div", {
    className: "page hp-films"
  }, React.createElement(HpPageHead, {
    go: go,
    className: "hp-films__head",
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Read",
      route: "articles"
    }, {
      label: "Films"
    }],
    eyebrow: "THE FILM ARCHIVE / YOSEMITE NATURE NOTES",
    title: React.createElement(React.Fragment, null, "Moving ", React.createElement("em", null, "pictures")),
    aside: React.createElement("div", {
      className: "hp-films__lede"
    }, React.createElement("p", {
      className: "hp-films__intro"
    }, "The National Park Service spent the better part of two decades producing a film series about this park, released it to the public, and barely told anyone. The complete run of Yosemite Nature Notes is below: ", count, " films, grouped by subject. Most run under ten minutes."), React.createElement("p", {
      className: "hp-films__intro hp-films__intro--quiet"
    }, "The films borrowed their name from something older. From 1922 the park's naturalists mailed out a bulletin by the same name, and all 512 issues are transcribed in", " ", React.createElement("a", {
      className: "hp-inline",
      href: "/archive/"
    }, "the print archive"), "."), React.createElement("a", {
      className: "hp-link",
      href: "#subjects",
      onClick: e => jump(e, "subjects")
    }, "Browse the seven subjects"))
  }), React.createElement(FilmsTheater, {
    ep: current,
    themeTitle: themeTitle[current.theme] || "",
    playing: playing,
    screenRef: screenRef,
    onPlay: () => {
      track(current, "theater");
      setPlaying(true);
    }
  }), React.createElement("section", {
    className: "hp-films__picker",
    id: "subjects",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("div", {
    className: "hp-films__chips",
    role: "group",
    "aria-label": "Filter films by subject"
  }, React.createElement("span", {
    className: "hp-films__chiplabel"
  }, "BY SUBJECT"), chips.map(c => React.createElement("button", {
    key: c.id,
    type: "button",
    className: `hp-films__chip${theme === c.id ? " is-on" : ""}`,
    "aria-pressed": theme === c.id,
    onClick: () => setTheme(c.id)
  }, c.label, React.createElement("span", null, c.n)))), React.createElement("div", {
    className: "hp-films__striphead"
  }, React.createElement("span", null, stripLabel), React.createElement("small", null, "Choose a film to put it on the screen")), React.createElement("div", {
    className: "hp-films__strip"
  }, strip.map(ep => {
    var on = ep.id === current.id;
    return React.createElement("button", {
      key: ep.id,
      type: "button",
      className: `hp-films__mini${on ? " is-on" : ""}`,
      "aria-pressed": on,
      "aria-label": `Play film: ${ep.title}`,
      onClick: () => pick(ep, "strip")
    }, React.createElement("span", {
      className: "hp-films__minithumb"
    }, React.createElement("img", {
      src: filmsThumb(ep),
      alt: "",
      loading: "lazy",
      decoding: "async",
      referrerPolicy: "no-referrer"
    }), React.createElement("span", {
      className: "hp-films__minitag"
    }, filmsTag(ep)), on && React.createElement("span", {
      className: "hp-films__nowtag"
    }, "NOW SHOWING")), React.createElement("span", {
      className: "hp-films__minititle"
    }, ep.title));
  })))), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "hp-films__facts"
  }, React.createElement("div", null, React.createElement("dt", null, "Films"), React.createElement("dd", null, count, ", in seven subjects")), React.createElement("div", null, React.createElement("dt", null, "The run"), React.createElement("dd", null, "2009 to 2025")), React.createElement("div", null, React.createElement("dt", null, "Length"), React.createElement("dd", null, "Most under ten minutes")), React.createElement("div", null, React.createElement("dt", null, "Rights"), React.createElement("dd", null, "Public domain")))), shown.map(({
    t,
    i
  }, k) => {
    var eps = byTheme(t.id);
    if (!eps.length) return null;
    var nums = eps.filter(ep => ep.episode != null).map(ep => ep.episode);
    return React.createElement("section", {
      key: t.id,
      className: `hp-films__theme${k % 2 ? " is-tint" : ""}`
    }, React.createElement("div", {
      className: "hp-wrap"
    }, React.createElement("div", {
      className: "hp-films__themehead"
    }, React.createElement("div", null, React.createElement("p", {
      className: "hp-eyebrow"
    }, filmsPad(i + 1), " / ", eps.length, " ", eps.length === 1 ? "FILM" : "FILMS"), React.createElement("h2", null, t.title), React.createElement("p", {
      className: "hp-films__note"
    }, t.note)), nums.length > 1 && React.createElement("span", {
      className: "hp-films__range"
    }, "Episodes ", Math.min(...nums), " to ", Math.max(...nums))), React.createElement("div", {
      className: "hp-films__grid"
    }, eps.map(ep => React.createElement(FilmCard, {
      key: ep.id,
      ep: ep,
      onPick: pick
    })))));
  }), React.createElement("section", {
    className: "hp-films__source"
  }, React.createElement("div", {
    className: "hp-wrap hp-films__two"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHERE THESE COME FROM"), React.createElement("h2", null, "Made by the park, ", React.createElement("em", null, "paid for once")), React.createElement("p", {
    className: "hp-films__body"
  }, "The series ran from 2009 to 2025 under producer Steven M. Bumgardner and a long roster of rangers, scientists, and historians. Your tax dollars paid for these films once already. Watching them is the closest thing to a free trip to the park."), React.createElement("p", {
    className: "hp-films__fine"
  }, "Yosemite Nature Notes is produced by the National Park Service at Yosemite National Park. The films are works of the United States government and are in the public domain. The Talus Field is independent and is not affiliated with the National Park Service; the notes under each film are this journal's, not the Park Service's."), React.createElement("div", {
    className: "hp-films__links"
  }, React.createElement("a", {
    className: "hp-link",
    href: nn.series.npsUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The originals at nps.gov ↗"), React.createElement("a", {
    className: "hp-link",
    href: nn.series.playlistUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The park's YouTube channel ↗"))), React.createElement("a", {
    className: "hp-films__archive",
    href: "/archive/"
  }, React.createElement("span", null, React.createElement("span", {
    className: "hp-films__archivekicker"
  }, "THE PRINT ARCHIVE / 1922 ONWARD"), React.createElement("span", {
    className: "hp-films__archivetitle"
  }, "Before the films, a bulletin"), React.createElement("span", {
    className: "hp-films__archivebody"
  }, "From 1922 into the 1980s the park's naturalists mailed out a bulletin called Yosemite Nature Notes. All 512 issues are transcribed here, about 1.87 million words.")), React.createElement("b", null, "Read the archive ", React.createElement("span", null, "→"))))), React.createElement(HpGuideBand, {
    go: go,
    location: "films",
    title: React.createElement(React.Fragment, null, "The bulletins, ", React.createElement("em", null, "at the stop they describe")),
    intro: "The Field Guide quotes the print Nature Notes at the places they were written about, and it works with no signal."
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Sunday Field Notes",
    heading: "Sunday Field Notes",
    blurb: "One Yosemite email a week. Notes on the park worth reading alongside the films.",
    location: "films",
    tag: "films"
  }));
}
window.FilmsPage = FilmsPage;
