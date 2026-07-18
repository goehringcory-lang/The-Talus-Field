function formatIsoDate(iso) {
  var d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
var END_NEWSLETTER_OFFER = {
  planning: {
    heading: "Get the conditions before you go",
    blurb: "One Yosemite email a week: what's open, what's booked out, and what changed since you started planning. Free."
  },
  trails: {
    heading: "Sunday Field Notes",
    blurb: "One letter a week on trail conditions and what's worth the hike right now. Free, and you can leave anytime."
  },
  wildlife: {
    heading: "Sunday Field Notes",
    blurb: "One letter a week from someone who's out there year-round: wildlife notes, trail conditions, the occasional longer piece."
  },
  seasonal: {
    heading: "Sunday Field Notes",
    blurb: "One letter a week, timed to the season you're reading about: what's blooming, what's flowing, what's changed."
  }
};
var END_NEWSLETTER_OFFER_B = {
  planning: {
    heading: "What changed this week in Yosemite",
    blurb: "Reservation windows open and close. Roads do too. One Sunday note carries the week's changes so your plan doesn't age out."
  },
  trails: {
    heading: "Trail status, Sundays",
    blurb: "Trails close, creeks rise, the cables go up and come down. One letter a week with the status that matters before you drive in."
  },
  wildlife: {
    heading: "What's moving in the park",
    blurb: "Bears wake, owls fledge, the meadows turn week to week. One Sunday letter on what's happening out there right now."
  },
  seasonal: {
    heading: "Hit the window, not the crowd",
    blurb: "Waterfalls peak, colors turn, roads open late. One Sunday letter tracks the season so you time it right."
  }
};
function newsletterTag(placement, cat) {
  return cat ? `${placement}-${cat}` : placement;
}
function ArticlePage({
  slug,
  go
}) {
  var article = window.findArticle(slug);
  var [Body, setBody] = React.useState(() => (window.ARTICLE_BODIES || {})[slug] || null);
  var [bodyState, setBodyState] = React.useState(() => (window.ARTICLE_BODIES || {})[slug] ? "ready" : "loading");
  var proseRef = React.useRef(null);
  var [midHost, setMidHost] = React.useState(null);
  var [toc, setToc] = React.useState([]);
  React.useEffect(() => {
    if (bodyState !== "ready") {
      setToc([]);
      return;
    }
    var raf = requestAnimationFrame(() => {
      var prose = proseRef.current;
      if (!prose) return;
      var items = Array.from(prose.querySelectorAll("h2")).map((h, i) => {
        if (!h.id) {
          var base = (h.textContent || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
          h.id = "sec-" + i + (base ? "-" + base : "");
        }
        return {
          id: h.id,
          text: h.textContent || ""
        };
      }).filter(it => it.text);
      setToc(items.length >= 5 ? items : []);
    });
    return () => cancelAnimationFrame(raf);
  }, [bodyState, slug, Body]);
  React.useEffect(() => {
    var cancelled = false;
    var existing = (window.ARTICLE_BODIES || {})[slug];
    if (existing) {
      setBody(() => existing);
      setBodyState("ready");
      return;
    }
    setBody(null);
    setBodyState("loading");
    window.loadArticleBody(slug).then(fn => {
      if (cancelled) return;
      if (fn) {
        setBody(() => fn);
        setBodyState("ready");
      } else setBodyState("missing");
    }).catch(err => {
      console.error(`ArticlePage: body for "${slug}" unavailable`, err);
      if (!cancelled) setBodyState("missing");
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);
  React.useEffect(() => {
    if (article && article.image) preloadResponsive(article.image, SIZES_HERO);
  }, [slug]);
  var barRef = React.useRef(null);
  React.useEffect(() => {
    if (bodyState !== "ready") return;
    var prose = proseRef.current;
    if (!prose) return;
    var fired = {};
    var maxPct = 0;
    var savedPct = 0;
    var raf = 0;
    var measure = () => {
      raf = 0;
      var rect = prose.getBoundingClientRect();
      if (rect.height <= 0) return;
      var seen = Math.min(rect.height, Math.max(0, window.innerHeight - rect.top));
      var pct = Math.round(seen / rect.height * 100);
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct / 100})`;
      if (pct <= maxPct) return;
      maxPct = pct;
      [25, 50, 75, 100].forEach(t => {
        if (pct >= t && !fired[t]) {
          fired[t] = true;
          if (window.track) window.track("article_progress", {
            slug,
            percent: t
          });
        }
      });
      if (pct >= 90 && !fired.done) {
        fired.done = true;
        window.readHistory.markDone(slug);
        window.readHistory.clearLast(slug);
      }
      if (maxPct >= 10 && maxPct < 90 && maxPct >= savedPct + 5) {
        savedPct = maxPct;
        window.readHistory.setLast(slug, maxPct);
      }
    };
    var onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    var resume = window.safeStorage.get("tfg.read.resume");
    if (resume) window.safeStorage.remove("tfg.read.resume");
    var saved = window.readHistory.last();
    if (resume === slug && saved && saved.slug === slug && saved.pct > 0) {
      var top = window.scrollY + prose.getBoundingClientRect().top + saved.pct / 100 * prose.getBoundingClientRect().height - window.innerHeight;
      if (top > 0) window.scrollTo({
        top
      });
    }
    var saveUnfinished = () => {
      if (maxPct >= 10 && maxPct < 90) window.readHistory.setLast(slug, maxPct);
    };
    measure();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pagehide", saveUnfinished);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pagehide", saveUnfinished);
      saveUnfinished();
    };
  }, [bodyState, slug]);
  React.useEffect(() => {
    setMidHost(null);
    if (bodyState !== "ready") return;
    var host = null;
    var raf = requestAnimationFrame(() => {
      var prose = proseRef.current;
      if (!prose || prose.querySelector("[data-nl-mid]")) return;
      var blocks = Array.from(prose.children).filter(el => !el.classList.contains("statblock") && !el.hasAttribute("data-nl-mid"));
      if (blocks.length < 8) return;
      var anchor = blocks[Math.floor(blocks.length / 2)];
      if (!anchor) return;
      host = document.createElement("div");
      host.setAttribute("data-nl-mid", "1");
      anchor.insertAdjacentElement("afterend", host);
      setMidHost(host);
    });
    return () => {
      cancelAnimationFrame(raf);
      if (host && host.parentNode) host.parentNode.removeChild(host);
    };
  }, [bodyState, slug, Body]);
  if (!article) return React.createElement("div", {
    className: "wrap",
    style: {
      padding: 80
    }
  }, "Not found.");
  var cat = window.findCategory(article.cat);
  var doneSlugs = window.readHistory.done();
  var unreadFirst = list => [...list.filter(a => !doneSlugs.has(a.slug)), ...list.filter(a => doneSlugs.has(a.slug))];
  var sameCat = window.ARTICLES.filter(a => a.slug !== slug && a.cat === article.cat);
  var otherCat = window.ARTICLES.filter(a => a.slug !== slug && a.cat !== article.cat);
  var related = [...unreadFirst(sameCat), ...unreadFirst(otherCat)].slice(0, 3);
  var relatedSameCat = related.every(a => a.cat === article.cat);
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "readbar",
    "aria-hidden": "true"
  }, React.createElement("div", {
    className: "readbar__fill",
    ref: barRef
  })), React.createElement("article", null, React.createElement("header", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 64,
      paddingBottom: 32
    }
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: cat.label,
      route: `cat:${cat.slug}`
    }, {
      label: article.title
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 18
    }
  }, React.createElement("a", {
    href: `/section/${cat.slug}`,
    onClick: e => {
      e.preventDefault();
      go(`cat:${cat.slug}`);
    },
    style: {
      color: "var(--moss)",
      textDecoration: "none"
    }
  }, cat.label)), React.createElement("h1", {
    style: {
      marginBottom: 24
    }
  }, article.title), React.createElement("p", {
    style: {
      fontSize: 22,
      color: "var(--ink-2)",
      lineHeight: 1.45,
      fontFamily: "var(--serif)",
      marginBottom: 32
    }
  }, article.dek), React.createElement("address", {
    style: {
      display: "flex",
      gap: 18,
      alignItems: "center",
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      borderTop: "1px solid var(--rule)",
      borderBottom: "1px solid var(--rule)",
      padding: "14px 0",
      fontStyle: "normal"
    }
  }, React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "var(--paper-2)",
      border: "1px solid var(--rule)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--serif)",
      fontWeight: 600,
      color: "var(--ink-2)"
    }
  }, "CG"), React.createElement("div", null, React.createElement("div", {
    style: {
      color: "var(--ink)",
      fontWeight: 500
    }
  }, "By ", React.createElement("a", {
    href: "/about",
    rel: "author",
    onClick: e => {
      e.preventDefault();
      go("about");
    },
    style: {
      color: "inherit",
      textDecoration: "none",
      borderBottom: "1px solid var(--rule)"
    }
  }, window.SITE.authorName)), React.createElement("div", null, window.SITE.authorBio)), React.createElement("div", {
    style: {
      marginLeft: "auto",
      textAlign: "right"
    }
  }, React.createElement("time", {
    dateTime: article.isoModified || article.isoDate
  }, article.date), React.createElement("div", null, article.read, " read"), article.isoModified && article.isoModified !== article.isoDate && formatIsoDate(article.isoModified) && React.createElement("div", null, "Updated ", formatIsoDate(article.isoModified)))), (() => {
    var series = window.planningSeriesFor && window.planningSeriesFor(slug);
    if (!series) return null;
    var prev = series.prev ? window.findArticle(series.prev) : null;
    var next = series.next ? window.findArticle(series.next) : null;
    var seriesNav = (a, label) => React.createElement("a", {
      href: `/articles/${a.slug}`,
      title: a.title,
      onClick: e => {
        e.preventDefault();
        if (window.track) window.track("series_band_click", {
          from: slug,
          to: a.slug
        });
        go(`a:${a.slug}`);
      }
    }, label);
    return React.createElement("div", {
      className: "series-band"
    }, React.createElement("span", null, "Part of", " ", React.createElement("a", {
      href: "/planning",
      onClick: e => {
        e.preventDefault();
        if (window.track) window.track("series_band_click", {
          from: slug,
          to: "planning-hub"
        });
        go("planning");
      }
    }, "the Yosemite Planning Guide"), " · ", series.part), (prev || next) && React.createElement("span", {
      className: "series-band__nav"
    }, prev && seriesNav(prev, "← Previous"), next && seriesNav(next, "Next →")));
  })()), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingBottom: 32
    }
  }, React.createElement(Placeholder, {
    caption: article.placeholder,
    image: article.image,
    credit: article.credit,
    tag: "PLATE I",
    size: "lg",
    natural: true,
    eager: true,
    motif: React.createElement(MotifMountains, null)
  })), React.createElement("div", {
    className: "wrap wrap--read"
  }, toc.length > 0 && React.createElement("details", {
    className: "toc"
  }, React.createElement("summary", null, "In this guide"), React.createElement("ul", null, toc.map(it => React.createElement("li", {
    key: it.id
  }, React.createElement("a", {
    href: "#" + it.id,
    onClick: e => {
      e.preventDefault();
      document.getElementById(it.id)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      if (window.track) window.track("toc_jump", {
        slug
      });
    }
  }, it.text))))), React.createElement("div", {
    className: "prose",
    ref: proseRef
  }, article.cat === "planning" && React.createElement("div", {
    className: "statblock"
  }, React.createElement("div", {
    className: "statblock__item"
  }, React.createElement("span", {
    className: "label"
  }, "Best for"), React.createElement("span", {
    className: "val"
  }, "First visits")), React.createElement("div", {
    className: "statblock__item"
  }, React.createElement("span", {
    className: "label"
  }, "Reading time"), React.createElement("span", {
    className: "val"
  }, article.read)), React.createElement("div", {
    className: "statblock__item"
  }, React.createElement("span", {
    className: "label"
  }, "Updated"), React.createElement("span", {
    className: "val"
  }, article.date)), React.createElement("div", {
    className: "statblock__item"
  }, React.createElement("span", {
    className: "label"
  }, "Section"), React.createElement("span", {
    className: "val"
  }, cat.label))), bodyState === "ready" && Body ? React.createElement(Body, null) : bodyState === "loading" ? React.createElement("p", {
    style: {
      color: "var(--ink-3)",
      fontStyle: "italic"
    }
  }, "Loading…") : React.createElement("p", {
    style: {
      color: "var(--ink-3)",
      fontStyle: "italic"
    }
  }, "This article is coming soon.")), React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      alignItems: "flex-start",
      borderTop: "1px solid var(--rule)",
      padding: "24px 0",
      marginTop: 40
    }
  }, React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      flexShrink: 0,
      borderRadius: "50%",
      background: "var(--paper-2)",
      border: "1px solid var(--rule)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--serif)",
      fontWeight: 600,
      color: "var(--ink-2)"
    }
  }, "CG"), React.createElement("div", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-2)",
      lineHeight: 1.6
    }
  }, React.createElement("div", {
    style: {
      color: "var(--ink)",
      fontWeight: 500,
      marginBottom: 4
    }
  }, React.createElement("a", {
    href: "/about",
    rel: "author",
    onClick: e => {
      e.preventDefault();
      go("about");
    },
    style: {
      color: "inherit",
      textDecoration: "none",
      borderBottom: "1px solid var(--rule)"
    }
  }, window.SITE.authorName)), React.createElement("div", null, window.SITE.authorBio), React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, React.createElement("a", {
    href: "/about",
    onClick: e => {
      e.preventDefault();
      go("about");
    },
    style: {
      color: "var(--moss)",
      textDecoration: "none",
      borderBottom: "1px solid var(--rule)"
    }
  }, "Read how recommendations get made →")))), React.createElement(ShareRow, {
    title: article.title,
    slug: slug
  }), midHost && ReactDOM.createPortal(React.createElement(NewsletterInline, {
    location: "article_mid",
    tag: newsletterTag("article-mid", article.cat),
    heading: "Keep reading next week",
    blurb: "Sunday Field Notes: one short letter, only when there is something worth saying."
  }), midHost), React.createElement("a", {
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
      padding: "24px 28px",
      marginTop: 40
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 8
    }
  }, "The Map · Free"), React.createElement("div", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 24,
      fontWeight: 500,
      lineHeight: 1.15,
      marginBottom: 6
    }
  }, "Plan it on the interactive map."), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 16,
      color: "var(--ink-2)",
      lineHeight: 1.5,
      margin: 0
    }
  }, "Every vista, trailhead, parking turnout, and meal worth the stop, on one map. Browse it free, then build a trip from the pins."), React.createElement("div", {
    className: "mono",
    style: {
      color: "var(--moss)",
      fontWeight: 700,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.18em",
      marginTop: 12
    }
  }, "Open the map →")), (() => {
    var endVariant = window.abVariant ? window.abVariant("article_end_copy") : "a";
    var offers = endVariant === "b" ? END_NEWSLETTER_OFFER_B : END_NEWSLETTER_OFFER;
    var offer = offers[article.cat] || {};
    return React.createElement(NewsletterInline, {
      location: "article_end",
      tag: newsletterTag("article-end", article.cat),
      heading: offer.heading || "Sunday Field Notes",
      blurb: offer.blurb || "One letter a week. If you found this useful, you'll probably like the rest.",
      variant: endVariant
    });
  })(), (article.cat === "trails" || article.cat === "planning" || article.cat === "seasonal") && React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      lineHeight: 1.6,
      margin: "16px 0 0"
    }
  }, "The Field Guide puts this site's advice in your pocket: offline maps, GPS at the trailhead, every stop with parking notes. $19, eighteen months of access.", " ", React.createElement("a", {
    href: "/guide",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("guide_teaser_click", {
        location: "article_end"
      });
      go("guide");
    },
    style: {
      color: "var(--ink-2)"
    }
  }, "See the guide →")))), related.length > 0 && React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 48,
      paddingBottom: 32
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, relatedSameCat ? `More from ${cat.label}` : "Keep reading"), relatedSameCat ? React.createElement("a", {
    href: `/section/${cat.slug}`,
    onClick: e => {
      e.preventDefault();
      go(`cat:${cat.slug}`);
    }
  }, "All in ", cat.label, " →") : React.createElement("a", {
    href: "/articles",
    onClick: e => {
      e.preventDefault();
      go("articles");
    }
  }, "All entries →")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 36
    }
  }, related.map(a => React.createElement(ArticleCard, {
    key: a.slug,
    article: a,
    go: go,
    onNav: () => {
      if (window.track) window.track("related_click", {
        slug: a.slug,
        from: slug
      });
    }
  })))));
}
window.ArticlePage = ArticlePage;
