var {
  useMemo,
  useState
} = React;
function HomeHeroCapture() {
  var [done, setDone] = useState(false);
  var subscribed = isSubscribed();
  var ref = useNewsletterImpression("home_hero", "home", !subscribed && !done);
  if (subscribed && !done) {
    return React.createElement("p", {
      className: "hero__capture-note",
      ref: ref
    }, "You're on the list. ", React.createElement("a", {
      href: "/map"
    }, "The interactive map is open to you →"));
  }
  if (done) {
    return React.createElement("p", {
      className: "hero__capture-note",
      ref: ref
    }, "You're in. ", React.createElement("a", {
      href: "/map"
    }, "The map is open to you →"));
  }
  return React.createElement("div", {
    ref: ref
  }, React.createElement("form", {
    className: "hero__capture nlbox__form",
    action: "https://buttondown.com/api/emails/embed-subscribe/goehring",
    method: "post",
    target: "buttondown-target",
    onSubmit: () => {
      if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("home_hero", "home");
      setTimeout(() => setDone(true), 0);
    }
  }, React.createElement("input", {
    type: "email",
    name: "email",
    "aria-label": "Email address",
    placeholder: "you@email.com",
    required: true
  }), React.createElement("input", {
    type: "hidden",
    name: "tag",
    value: "home"
  }), React.createElement("input", {
    type: "hidden",
    name: "embed",
    value: "1"
  }), React.createElement("button", {
    type: "submit"
  }, "Unlock the map →")), React.createElement("p", {
    className: "hero__capture-note"
  }, "Free interactive Yosemite map with a trip builder, plus a short note on Sundays."));
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
  return React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 40
    }
  }, React.createElement("a", {
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
  }, "Keep reading →")));
}
var HOME_BULLETIN_URL = "/bulletin.json?v=2";
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
  }, "The Park Bulletin · covering ", edition.label), React.createElement("span", {
    className: "home-dispatch__title"
  }, "One page, the whole park, right now"), React.createElement("p", {
    className: "home-dispatch__excerpt"
  }, edition.lede), React.createElement("span", {
    className: "mono home-dispatch__cta"
  }, "Scan the bulletin →"));
}
function HomePage({
  go
}) {
  var recent = window.ARTICLES.slice(0, 6);
  var seasonal = window.byCategory("seasonal").slice(0, 2);
  var startHere = (window.START_HERE || []).map(slug => window.findArticle(slug)).filter(Boolean);
  var scrollToStartHere = e => {
    e.preventDefault();
    document.getElementById("start-here")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  var parkThisWeekSection = React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 64
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "From the park, right now"), React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "Conditions and webcams →")), React.createElement(HomeBulletin, {
    go: go
  }), React.createElement(WebcamStrip, null));
  return React.createElement("div", {
    className: "page"
  }, React.createElement("section", {
    className: "hero"
  }, React.createElement("div", {
    className: "wrap hero__grid"
  }, React.createElement("div", null, React.createElement("div", {
    className: "hero__kicker"
  }, React.createElement("span", {
    className: "dot"
  }), React.createElement("span", null, window.SITE && window.SITE.issue || "Vol. III", window.SITE && window.SITE.issueDetail ? ` · ${window.SITE.issueDetail}` : "")), React.createElement("h1", null, "Notes from the Field."), React.createElement("p", {
    className: "hero__dek"
  }, "A field journal of one national park, written by someone who lives here. Trails, weather, what is open and what is not, and the occasional longer essay when something is worth sitting with."), React.createElement(HomeHeroCapture, null), React.createElement("div", {
    className: "hero__cta",
    style: {
      marginTop: 18
    }
  }, React.createElement("a", {
    href: "#start-here",
    onClick: scrollToStartHere,
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      color: "var(--ink-2)",
      textDecoration: "none",
      borderBottom: "1px solid var(--rule)",
      paddingBottom: 2
    }
  }, "First time in Yosemite? Start here →"))), React.createElement(Placeholder, {
    caption: "El Capitan and Bridalveil at sunset",
    credit: "Rodrigo Soares / Unsplash",
    image: "img/valley-view-sunset-rodrigo-soares.jpg",
    tag: "PLATE I",
    size: "lg",
    natural: true,
    eager: true,
    motif: React.createElement(MotifMountains, null)
  }))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 28
    }
  }, React.createElement("nav", {
    className: "home-utility",
    "aria-label": "Trip tools"
  }, React.createElement("span", {
    className: "home-utility__label"
  }, "Plan your trip"), [["map", "/map", "The Map"], ["itineraries", "/itineraries", "Itineraries"], ["planning", "/planning", "Planning Guide"], ["checklist", "/checklist", "Checklist"], ["conditions", "/conditions", "Conditions"]].map(([key, href, label], i) => React.createElement(React.Fragment, {
    key: key
  }, i > 0 && React.createElement("span", {
    className: "home-utility__sep",
    "aria-hidden": "true"
  }, "·"), React.createElement("a", {
    href: href,
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("home_utility_click", {
        target: key
      });
      go(key);
    }
  }, label))))), React.createElement(ResumeReading, {
    go: go
  }), startHere.length > 0 && React.createElement("section", {
    id: "start-here",
    className: "wrap",
    style: {
      paddingTop: 72,
      scrollMarginTop: 24
    }
  }, React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 14
    }
  }, "For first-time visitors"), React.createElement("h2", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 44,
      lineHeight: 1.05,
      marginBottom: 12,
      fontWeight: 500,
      letterSpacing: "-0.01em",
      textTransform: "none"
    }
  }, "Start here."), React.createElement("p", {
    style: {
      fontFamily: "var(--display)",
      fontStyle: "italic",
      fontSize: 19,
      color: "var(--ink-2)",
      lineHeight: 1.5,
      maxWidth: "60ch"
    }
  }, "The four pieces to read before you book anything.")), React.createElement("div", {
    className: "start-here-grid",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 32,
      rowGap: 40
    }
  }, startHere.map(a => React.createElement(ArticleCard, {
    key: a.slug,
    article: a,
    go: go
  })))), parkThisWeekSection, React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 80
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Latest Entries"), React.createElement("a", {
    href: "/articles",
    onClick: e => {
      e.preventDefault();
      go("articles");
    }
  }, "All entries →")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 36,
      rowGap: 48
    }
  }, recent.map(a => React.createElement(ArticleCard, {
    key: a.slug,
    article: a,
    go: go
  })))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 80
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "By Section"), React.createElement("a", {
    href: "/articles",
    onClick: e => {
      e.preventDefault();
      go("articles");
    }
  }, "Everything →")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 0,
      borderTop: "1px solid var(--ink)",
      borderLeft: "1px solid var(--ink)"
    }
  }, window.CATEGORIES.map((c, i) => {
    var count = window.byCategory(c.slug).length;
    return React.createElement("a", {
      key: c.slug,
      href: `/section/${c.slug}`,
      onClick: e => {
        e.preventDefault();
        go(`cat:${c.slug}`);
      },
      style: {
        textDecoration: "none",
        color: "inherit",
        borderRight: "1px solid var(--ink)",
        borderBottom: "1px solid var(--ink)",
        padding: 28,
        display: "block"
      }
    }, React.createElement("div", {
      className: "mono",
      style: {
        color: "var(--moss)",
        fontWeight: 700
      }
    }, "№ 0", i + 1), React.createElement("div", {
      style: {
        fontFamily: "var(--display)",
        fontSize: 26,
        fontWeight: 500,
        margin: "16px 0 10px",
        letterSpacing: "-0.005em",
        lineHeight: 1.1
      }
    }, c.label), React.createElement("div", {
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 15,
        color: "var(--ink-2)",
        lineHeight: 1.45,
        marginBottom: 20
      }
    }, c.blurb), React.createElement("div", {
      style: {
        fontFamily: "var(--sans)",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: "var(--ink-3)",
        fontWeight: 700
      }
    }, count, " ", count === 1 ? "Entry" : "Entries", " →"));
  }))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 80
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Go Deeper")), React.createElement("a", {
    href: "/map",
    onClick: e => {
      e.preventDefault();
      go("map");
    },
    style: {
      display: "block",
      textDecoration: "none",
      color: "inherit",
      border: "1px solid var(--ink)",
      borderLeft: "6px solid var(--moss)",
      background: "var(--paper-2)",
      padding: "36px 32px"
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: 48,
      alignItems: "center"
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "The Map · Free"), React.createElement("div", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 36,
      fontWeight: 400,
      lineHeight: 1.1,
      letterSpacing: "-0.01em"
    }
  }, "Yosemite, on a map.")), React.createElement("div", null, React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 19,
      lineHeight: 1.5,
      color: "var(--ink-2)",
      margin: 0,
      marginBottom: 16
    }
  }, "Every vista, trailhead, parking turnout, and meal in one interactive map. Browse it free. A newsletter signup unlocks the trip builder: tap pins to assemble a route, or load a suggested one-, two-, or three-day trip."), React.createElement("div", {
    className: "mono",
    style: {
      color: "var(--moss)",
      fontWeight: 700,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.18em"
    }
  }, "Open the map →")))), React.createElement("a", {
    className: "band-guide",
    href: "/guide",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("guide_cta_click", {
        location: "home_band"
      });
      go("guide");
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: 48,
      alignItems: "center"
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "band-guide__eyebrow"
  }, "The Field Guide · $19"), React.createElement("div", {
    className: "band-guide__title"
  }, "The park, in your pocket.")), React.createElement("div", null, React.createElement("p", {
    className: "band-guide__body"
  }, "The app version of this journal: 50-plus stops with parking and timing notes, offline maps, a trip planner, and the secret guide. Works with no signal, which is most of the park. One purchase, eighteen months of access."), React.createElement("div", {
    className: "mono band-guide__cta"
  }, "See the Field Guide →")))), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24,
      marginTop: 24
    }
  }, [{
    key: "planning",
    eyebrow: "The Planning Guide · Free",
    title: "Yosemite, planned properly.",
    blurb: "The full archive organized for a real trip: gateway towns, reservations, Half Dome, smoke season, in the order you'll need them.",
    cta: "Read the guide →"
  }, {
    key: "consult",
    eyebrow: "Field Consult · $95",
    title: "Your plan, thirty minutes.",
    blurb: "One on one with a naturalist who lives in the park: your dates, your group, your plan taken apart and put back together. Six a month.",
    cta: "Book a consult →"
  }, {
    key: "kit",
    eyebrow: "The Kit",
    title: "What I carry.",
    blurb: "Three lists for three trips: day pack, overnight pack, car kit. The actual gear, with the actual reasons, and a plain disclosure.",
    cta: "See the kit →"
  }].map(p => React.createElement("a", {
    key: p.key,
    href: `/${p.key}`,
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "home_path",
        target: p.key
      });
      go(p.key);
    },
    style: {
      display: "block",
      textDecoration: "none",
      color: "inherit",
      border: "1px solid var(--ink)",
      padding: 28
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, p.eyebrow), React.createElement("div", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 26,
      fontWeight: 500,
      lineHeight: 1.1,
      letterSpacing: "-0.005em",
      marginBottom: 10
    }
  }, p.title), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 15,
      color: "var(--ink-2)",
      lineHeight: 1.45,
      margin: "0 0 18px"
    }
  }, p.blurb), React.createElement("div", {
    className: "mono",
    style: {
      color: "var(--moss)",
      fontWeight: 700,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.18em"
    }
  }, p.cta))))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 96
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 48,
      alignItems: "center",
      borderTop: "2px solid var(--ink)",
      borderBottom: "2px solid var(--ink)",
      padding: "56px 0"
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 14
    }
  }, "From the Editor"), React.createElement("h2", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 38,
      marginBottom: 18,
      fontWeight: 400,
      lineHeight: 1.1,
      letterSpacing: "-0.01em",
      textTransform: "none"
    }
  }, "The same waterfall, again, in a different year."), React.createElement("p", {
    style: {
      fontFamily: "var(--display)",
      fontStyle: "italic",
      fontSize: 19,
      color: "var(--ink-2)",
      lineHeight: 1.5,
      marginBottom: 24
    }
  }, "The park looks like a single place from a postcard and like four different ones from a parking lot. This is a record of looking at it slowly."), React.createElement("a", {
    className: "btn btn--ghost",
    href: "/about",
    onClick: e => {
      e.preventDefault();
      go("about");
    }
  }, "About the editor →"), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      lineHeight: 1.6,
      margin: "20px 0 0"
    }
  }, "The whole park fits on one page.", " ", React.createElement("a", {
    href: "/now",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("cta_click", {
        location: "home_strip_now"
      });
      go("now");
    },
    style: {
      color: "var(--ink-2)"
    }
  }, "The Park Bulletin is current →"))), React.createElement(NewsletterInline, {
    location: "home_strip",
    tag: "home"
  }))));
}
window.HomePage = HomePage;
