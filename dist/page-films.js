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
function FilmsPage({
  go
}) {
  var nn = window.NATURE_NOTES;
  var byTheme = themeId => nn.episodes.filter(ep => ep.theme === themeId).sort((a, b) => (a.episode == null ? 1 : 0) - (b.episode == null ? 1 : 0) || (a.episode || 0) - (b.episode || 0));
  var count = nn.episodes.length;
  return React.createElement("div", {
    className: "page hp-films"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Films"
    }],
    eyebrow: "THE FILM ARCHIVE",
    title: "Moving pictures",
    intro: `The National Park Service spent the better part of two decades producing a film series about this park, released it to the public, and barely told anyone. The complete run of Yosemite Nature Notes is archived below, ${count} films grouped by subject. Most run under ten minutes. One of them is about the rock piles this journal is named for.`,
    aside: React.createElement("div", {
      className: "films__credit"
    }, React.createElement("p", null, "Yosemite Nature Notes is produced by the National Park Service at Yosemite National Park. The films are works of the United States government and are in the public domain. The Talus Field is independent and is not affiliated with the National Park Service; the notes under each film are this journal's, not the Park Service's. The originals live at", " ", React.createElement("a", {
      href: nn.series.npsUrl,
      target: "_blank",
      rel: "noopener noreferrer"
    }, "nps.gov ↗"), " ", "and on the park's", " ", React.createElement("a", {
      href: nn.series.playlistUrl,
      target: "_blank",
      rel: "noopener noreferrer"
    }, "YouTube channel ↗"), ". Nothing plays, and nothing loads from YouTube, until you press play."))
  }, React.createElement("p", {
    className: "hp-intro"
  }, "The films borrowed their name from something older. From 1922 into the 1980s the park's naturalists mailed out a bulletin called Yosemite Nature Notes, and all 512 issues of it are transcribed in", " ", React.createElement("a", {
    className: "hp-inline",
    href: "/archive/"
  }, "the print archive"), ".")), nn.themes.map(theme => {
    var eps = byTheme(theme.id);
    if (!eps.length) return null;
    return React.createElement("section", {
      key: theme.id,
      className: "hp-wrap hp-section hp-films__theme"
    }, React.createElement(HpHeading, {
      eyebrow: `${eps.length} ${eps.length === 1 ? "FILM" : "FILMS"}`,
      title: theme.title
    }), React.createElement("p", {
      className: "hp-sub"
    }, theme.note), React.createElement("div", {
      className: "film-grid"
    }, eps.map(ep => React.createElement(FilmCard, {
      key: ep.id,
      ep: ep
    }))));
  }), React.createElement("section", {
    className: "hp-wrap hp-films__close"
  }, React.createElement("div", {
    className: "films__credit"
  }, React.createElement("p", null, "The series ran from 2009 to 2025 under producer Steven M. Bumgardner and a long roster of rangers, scientists, and historians. Your tax dollars paid for these films once already. Watching them is the closest thing to a free trip to the park."), React.createElement("p", null, React.createElement("a", {
    className: "hp-inline",
    href: "/guide",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("guide_cta_click", {
        location: "films_close"
      });
      go("guide");
    }
  }, "The Field Guide"), " ", "quotes the print bulletins at the places they describe, offline, at the stop."))), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Sunday Field Notes",
    heading: "Sunday Field Notes",
    blurb: "One Yosemite email a week. Notes on the park worth reading alongside the films.",
    location: "films",
    tag: "films"
  }));
}
window.FilmsPage = FilmsPage;
