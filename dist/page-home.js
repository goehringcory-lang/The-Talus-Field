var {
  useState
} = React;
function HomeHero({
  go
}) {
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "home-edition"
  }, React.createElement("div", {
    className: "wrap home-edition__inner"
  }, React.createElement("span", {
    className: "home-edition__issue"
  }, React.createElement("span", {
    className: "dot"
  }), React.createElement("span", {
    "data-shell-blank": "issue"
  }, window.SITE && window.SITE.issue || "Vol. III", window.SITE && window.SITE.issueDetail ? ` · ${window.SITE.issueDetail}` : "")), React.createElement("span", {
    className: "home-edition__where"
  }, "Published from El Portal, inside the park"))), React.createElement("section", {
    className: "hero"
  }, React.createElement("div", {
    className: "wrap hero__grid"
  }, React.createElement("div", null, React.createElement("h1", null, "Yosemite, from the inside."), React.createElement("p", {
    className: "hero__dek"
  }, "A working journal of one national park: current conditions, resident-tested planning, and twenty seasons of looking closely."), React.createElement("div", {
    className: "hero__cta"
  }, React.createElement("a", {
    className: "btn",
    href: "/planning",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "home_hero",
        target: "planning"
      });
      go("planning");
    }
  }, "Plan my Yosemite trip ", React.createElement("span", {
    className: "btn__arrow"
  }, "→")), React.createElement("a", {
    className: "btn btn--ghost",
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "home_hero",
        target: "conditions"
      });
      go("conditions");
    }
  }, "Check today's conditions"))), React.createElement(Placeholder, {
    caption: "El Capitan and Bridalveil at sunset",
    credit: "Rodrigo Soares / Unsplash",
    image: "img/valley-view-sunset-rodrigo-soares.jpg",
    tag: "PLATE I",
    size: "lg",
    natural: true,
    eager: true,
    motif: React.createElement(MotifMountains, null)
  }))));
}
function DeferredSection({
  minHeight,
  render
}) {
  var [shown, setShown] = React.useState(false);
  var ref = React.useRef(null);
  React.useEffect(() => {
    if (shown) return undefined;
    var el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }
    var io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        setShown(true);
        io.disconnect();
      }
    }, {
      rootMargin: "600px 0px"
    });
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  if (shown) return render();
  return React.createElement("div", {
    ref: ref,
    "aria-hidden": "true",
    style: {
      minHeight
    }
  });
}
function HomeIndex({
  go
}) {
  var entries = window.ARTICLES.length;
  var sections = window.CATEGORIES.length;
  var items = [{
    key: "articles",
    num: "01",
    title: "The Journal",
    blurb: `${entries} entries across ${sections} sections, newest first.`,
    cta: "All entries →"
  }, {
    key: "map",
    num: "02",
    title: "The Trip Map",
    blurb: "Every vista, trailhead, parking turnout, and meal, assembled into a route.",
    cta: "Open the map →"
  }, {
    key: "now",
    num: "03",
    title: "The Park Bulletin",
    blurb: "Alerts, road status, free programs, and what is open, in the current edition.",
    cta: "Scan the bulletin →"
  }, {
    href: "/archive/",
    num: "04",
    title: "The Archive",
    blurb: "512 issues of Yosemite Nature Notes, 1922 onward, transcribed.",
    cta: "Browse the archive →"
  }];
  return React.createElement("section", {
    className: "wrap home-index-wrap"
  }, React.createElement("nav", {
    className: "home-index",
    "aria-label": "What is on this site"
  }, items.map(it => {
    var track = () => {
      if (window.track) window.track("cta_click", {
        location: "home_index",
        target: it.key || "archive"
      });
    };
    var inner = React.createElement(React.Fragment, null, React.createElement("span", {
      className: "mono home-index__num"
    }, "№ ", it.num), React.createElement("span", {
      className: "home-index__title"
    }, it.title), React.createElement("span", {
      className: "home-index__blurb"
    }, it.blurb), React.createElement("span", {
      className: "mono home-index__cta"
    }, it.cta));
    return it.href ? React.createElement("a", {
      key: it.num,
      className: "home-index__item",
      href: it.href,
      onClick: track
    }, inner) : React.createElement("a", {
      key: it.num,
      className: "home-index__item",
      href: `/${it.key}`,
      onClick: e => {
        e.preventDefault();
        track();
        go(it.key);
      }
    }, inner);
  })));
}
var RESUME_MAX_AGE_DAYS = 30;
function ResumeReading({
  go
}) {
  var last = React.useMemo(() => window.readHistory ? window.readHistory.last() : null, []);
  var article = last ? window.findArticle(last.slug) : null;
  var ageDays = last && last.at ? (Date.now() - new Date(last.at).getTime()) / 86400000 : 0;
  var show = Boolean(article) && ageDays < RESUME_MAX_AGE_DAYS;
  React.useEffect(() => {
    if (show && window.track) window.track("resume_shown", {
      slug: last.slug,
      percent: last.pct
    });
  }, [show]);
  if (!show) return null;
  var totalMin = parseInt(article.read, 10);
  var remaining = Number.isFinite(totalMin) ? `About ${Math.max(1, Math.round(totalMin * (100 - last.pct) / 100))} min left` : `${last.pct}% read`;
  return React.createElement("a", {
    className: "resume-band",
    href: `/articles/${article.slug}`,
    onClick: e => {
      e.preventDefault();
      window.safeStorage.set("tfg.read.resume", article.slug);
      if (window.track) window.track("resume_click", {
        slug: article.slug,
        percent: last.pct
      });
      go(`a:${article.slug}`);
    }
  }, React.createElement("span", {
    className: "eyebrow eyebrow--moss"
  }, "Where you left off"), React.createElement("span", {
    className: "resume-band__title"
  }, article.title), React.createElement("span", {
    className: "resume-band__meta"
  }, remaining), React.createElement("span", {
    className: "mono resume-band__cta"
  }, "Keep reading →"));
}
var HOME_BULLETIN_URL = "/bulletin.json?v=5";
function HomeBulletin({
  go
}) {
  var [edition, setEdition] = React.useState(null);
  React.useEffect(() => {
    var cancelled = false;
    fetch(HOME_BULLETIN_URL).then(r => r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))).then(data => {
      var e = data && data.edition;
      if (!cancelled && e && e.label && e.lede) setEdition(e);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  if (!edition) return null;
  var endDate = new Date(edition.end + "T00:00:00");
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var ended = !Number.isNaN(endDate.getTime()) && today > endDate;
  return React.createElement("a", {
    className: "home-dispatch",
    href: "/now",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "home_dispatch"
      });
      go("now");
    }
  }, React.createElement("span", {
    className: "home-dispatch__date"
  }, "The Park Bulletin · covering ", edition.label, ended ? " · this edition has ended" : ""), React.createElement("span", {
    className: "home-dispatch__title"
  }, "One page, the whole park, right now"), React.createElement("p", {
    className: "home-dispatch__excerpt"
  }, edition.lede), React.createElement("span", {
    className: "mono home-dispatch__cta"
  }, "Scan the bulletin →"));
}
var START_HERE_QUESTIONS = {
  "first-time-yosemite-overwhelm": "First time, and it feels like a lot?",
  "yosemite-without-reservations-2026": "Do you need a reservation this year?",
  "yosemite-gateway-towns-compared": "Where should you actually stay?",
  "yosemite-in-one-or-two-days": "Only have a day or two?"
};
function HomeRail({
  go
}) {
  return React.createElement("aside", {
    className: "home-rail",
    "aria-label": "From The Talus Field"
  }, React.createElement("a", {
    className: "rail-guide",
    href: "/guide",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("guide_cta_click", {
        location: "home_rail"
      });
      go("guide");
    }
  }, React.createElement("span", {
    className: "rail-guide__eyebrow"
  }, "The Field Guide · Offline app"), React.createElement("span", {
    className: "rail-guide__title"
  }, "The park, in your pocket."), React.createElement("p", {
    className: "rail-guide__body"
  }, "57 hikes with parking and timing notes, offline maps, and the local tactics for every major region. Works with no signal, which is most of the park. One purchase, eighteen months of access."), React.createElement("span", {
    className: "mono rail-guide__cta"
  }, "See the Field Guide · $3.99 →")), React.createElement(NewsletterInline, {
    location: "home_rail",
    tag: "home",
    heading: "The Sunday Letter",
    blurb: "What is open, what is booking out, and what the week looked like from inside the park. The interactive trip planner map comes with it. Free.",
    cta: "Get the Sunday letter →",
    modifier: "nlbox--rail"
  }), React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "The decision with a deadline",
    note: "Inside the park there is one operator and one inventory, opening 366 days ahead. Outside it there are five gateway towns whose drive times to the Valley differ by more than an hour. Both are covered, honestly, on one page.",
    list: "page_home",
    slug: "home",
    cta: "See what is available on your dates →"
  }));
}
function HomePage({
  go
}) {
  var recent = window.ARTICLES.slice(0, 3);
  var startHere = (window.START_HERE || []).map(slug => window.findArticle(slug)).filter(Boolean);
  return React.createElement("div", {
    className: "page"
  }, React.createElement(HomeHero, {
    go: go
  }), React.createElement(HomeIndex, {
    go: go
  }), React.createElement("section", {
    className: "wrap home-body"
  }, React.createElement("div", {
    className: "home-spine"
  }, React.createElement(ResumeReading, {
    go: go
  }), React.createElement(HomeBulletin, {
    go: go
  }), startHere.length > 0 && React.createElement("div", {
    id: "start-here",
    style: {
      scrollMarginTop: 24
    }
  }, React.createElement("div", {
    className: "home-section__head"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 14
    }
  }, "For first-time visitors"), React.createElement("h2", {
    className: "home-section__title"
  }, "Start here."), React.createElement("p", {
    className: "home-section__dek"
  }, "Four answers before you book anything.")), React.createElement("div", {
    className: "home-answers"
  }, startHere.map(a => React.createElement("a", {
    key: a.slug,
    className: "home-answer",
    href: `/articles/${a.slug}`,
    onClick: e => {
      e.preventDefault();
      go(`a:${a.slug}`);
    }
  }, START_HERE_QUESTIONS[a.slug] && React.createElement("span", {
    className: "home-answer__q"
  }, START_HERE_QUESTIONS[a.slug]), React.createElement("span", {
    className: "home-answer__title"
  }, a.title))))), React.createElement("div", {
    className: "home-latest"
  }, React.createElement(DeferredSection, {
    minHeight: 560,
    render: () => React.createElement("div", null, React.createElement("div", {
      className: "home-section__head home-section__head--row"
    }, React.createElement("h2", {
      className: "home-section__title"
    }, "Latest Entries"), React.createElement("a", {
      className: "mono home-section__more",
      href: "/articles",
      onClick: e => {
        e.preventDefault();
        go("articles");
      }
    }, "All ", window.ARTICLES.length, " entries →")), React.createElement("div", {
      className: "home-entries"
    }, recent.map(a => {
      var cat = window.findCategory(a.cat);
      return React.createElement("a", {
        key: a.slug,
        className: "home-entry",
        href: `/articles/${a.slug}`,
        onClick: e => {
          e.preventDefault();
          go(`a:${a.slug}`);
        }
      }, React.createElement("span", {
        className: "eyebrow eyebrow--moss"
      }, cat.label), React.createElement("span", {
        className: "home-entry__title"
      }, a.title), React.createElement("span", {
        className: "home-entry__dek"
      }, a.dek), React.createElement("span", {
        className: "mono home-entry__meta"
      }, React.createElement("span", null, a.date), React.createElement("span", null, a.read)));
    })))
  }))), React.createElement(HomeRail, {
    go: go
  })));
}
window.HomePage = HomePage;
window.HomeHero = HomeHero;
