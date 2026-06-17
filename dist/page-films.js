var {
  useState: useStateF,
  useEffect: useEffectF,
  useRef: useRefF
} = React;
function FilmEmbed({
  ep
}) {
  var [playing, setPlaying] = useStateF(false);
  var frameRef = useRefF(null);
  useEffectF(() => {
    if (playing && frameRef.current) frameRef.current.focus();
  }, [playing]);
  if (playing) {
    return React.createElement("div", {
      className: "film__frame"
    }, React.createElement("iframe", {
      ref: frameRef,
      src: `https://www.youtube-nocookie.com/embed/${ep.youtubeId}?autoplay=1&rel=0`,
      title: `Yosemite Nature Notes: ${ep.title}`,
      allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share",
      allowFullScreen: true
    }));
  }
  return React.createElement("button", {
    type: "button",
    className: "film__facade",
    "aria-label": `Play film: ${ep.title}`,
    onClick: () => {
      if (window.track) window.track("film_play", {
        film_id: ep.id,
        film_title: ep.title
      });
      setPlaying(true);
    }
  }, React.createElement("img", {
    className: "film__thumb",
    src: `https://i.ytimg.com/vi/${ep.youtubeId}/hqdefault.jpg`,
    alt: "",
    loading: "lazy",
    decoding: "async",
    referrerPolicy: "no-referrer"
  }), React.createElement("span", {
    className: "film__play",
    "aria-hidden": "true"
  }, React.createElement("svg", {
    viewBox: "0 0 64 64",
    width: "56",
    height: "56"
  }, React.createElement("circle", {
    cx: "32",
    cy: "32",
    r: "30",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }), React.createElement("path", {
    d: "M26 21 L46 32 L26 43 Z",
    fill: "currentColor"
  }))));
}
function FilmCard({
  ep
}) {
  return React.createElement("div", {
    className: "film-card"
  }, React.createElement(FilmEmbed, {
    ep: ep
  }), React.createElement("div", {
    className: "film-card__meta"
  }, React.createElement("span", null, ep.episode != null ? `Episode ${ep.episode}` : "Special"), ep.year && React.createElement("span", null, ep.year)), React.createElement("div", {
    className: "film-card__title"
  }, ep.title), React.createElement("p", {
    className: "film-card__dek"
  }, ep.dek));
}
function FilmsPage() {
  var nn = window.NATURE_NOTES;
  var byTheme = themeId => nn.episodes.filter(ep => ep.theme === themeId).sort((a, b) => (a.episode == null ? 1 : 0) - (b.episode == null ? 1 : 0) || (a.episode || 0) - (b.episode || 0));
  var count = nn.episodes.length;
  return React.createElement("div", null, React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 56,
      paddingBottom: 24
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 18
    }
  }, "The Film Archive"), React.createElement("h1", {
    className: "display",
    style: {
      fontSize: "clamp(46px, 6vw, 84px)",
      lineHeight: 0.98,
      marginBottom: 24,
      fontWeight: 500,
      letterSpacing: "-0.01em"
    }
  }, "Moving pictures"), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 21,
      lineHeight: 1.5,
      color: "var(--ink-2)",
      maxWidth: "62ch",
      textWrap: "pretty"
    }
  }, "The National Park Service spent the better part of two decades producing a film series about this park, released it to the public, and barely told anyone. The complete run of Yosemite Nature Notes is archived below, ", count, " films grouped by subject. Most run under ten minutes. One of them is about the rock piles this journal is named for.")), React.createElement("section", {
    className: "wrap",
    style: {
      paddingBottom: 24
    }
  }, React.createElement("div", {
    className: "films__credit"
  }, React.createElement("p", null, "Yosemite Nature Notes is produced by the National Park Service at Yosemite National Park. The films are works of the United States government and are in the public domain. The Talus Field is independent and is not affiliated with the National Park Service; the notes under each film are this journal's, not the Park Service's. The originals live at", " ", React.createElement("a", {
    href: nn.series.npsUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "nps.gov ↗"), " ", "and on the park's", " ", React.createElement("a", {
    href: nn.series.playlistUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "YouTube channel ↗"), ". Nothing plays, and nothing loads from YouTube, until you press play."))), nn.themes.map(theme => {
    var eps = byTheme(theme.id);
    if (!eps.length) return null;
    return React.createElement("section", {
      key: theme.id,
      className: "wrap",
      style: {
        paddingTop: 40,
        paddingBottom: 8
      }
    }, React.createElement("div", {
      className: "section-head"
    }, React.createElement("h2", null, theme.title), React.createElement("span", {
      className: "film-section__count"
    }, eps.length, " ", eps.length === 1 ? "film" : "films")), React.createElement("p", {
      className: "film-section__note"
    }, theme.note), React.createElement("div", {
      className: "film-grid"
    }, eps.map(ep => React.createElement(FilmCard, {
      key: ep.id,
      ep: ep
    }))));
  }), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 40,
      paddingBottom: 72
    }
  }, React.createElement("div", {
    className: "films__credit"
  }, React.createElement("p", null, "The series ran from 2009 to 2025 under producer Steven M. Bumgardner and a long roster of rangers, scientists, and historians. Your tax dollars paid for these films once already. Watching them is the closest thing to a free trip to the park."))));
}
window.FilmsPage = FilmsPage;
