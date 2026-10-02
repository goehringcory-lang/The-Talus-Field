var SKELETON_LINES = [[100, 96, 98, 62], [100, 94, 97, 100, 40], "head", [98, 100, 93, 71]];
function BodySkeleton() {
  return React.createElement("div", {
    className: "skeleton",
    role: "status",
    "aria-live": "polite",
    "aria-label": "Loading the article"
  }, SKELETON_LINES.map((para, i) => para === "head" ? React.createElement("span", {
    key: i,
    className: "skeleton__line skeleton__line--head"
  }) : para.map((w, j) => React.createElement("span", {
    key: `${i}-${j}`,
    className: `skeleton__line${j === para.length - 1 ? " skeleton__line--gap" : ""}`,
    style: {
      width: `${w}%`
    }
  }))));
}
function largestSource(img) {
  var set = img.getAttribute("srcset") || "";
  var best = null,
    bestW = 0;
  for (var part of set.split(",")) {
    var m = part.trim().match(/^(\S+)\s+(\d+)w$/);
    if (m && Number(m[2]) > bestW) {
      bestW = Number(m[2]);
      best = m[1];
    }
  }
  return best || img.currentSrc || img.src;
}
var ARTICLE_SIZES_COVER = "100vw";
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
var ARTICLE_BONUS = {
  "yosemite-camping-complete-guide": {
    title: "The booking-day sheet",
    intro: "The steps for the morning a campground releases its sites on Recreation.gov, in the order they happen.",
    heading: "The booking-day sheet for this guide",
    blurb: "Unlock the release-morning checklist, from the account you set up a week ahead to the ten minutes after 7:00. It comes with Sunday Field Notes, a free weekly letter.",
    items: ["Know your morning. Upper, Lower and North Pines, Wawona and Hodgdon Meadow open one block of arrivals, the 15th through the 14th, on the 15th at 7 a.m. Pacific.", "The week before, create the Recreation.gov account, confirm the email address and save a payment method. A last-minute account asks you to verify an email at 7:01.", "The night before, write down the campground, the arrival date, the nights and two fallback date ranges. Confirm the on-sale time on the campground's own page.", "Five minutes out, log in and load the campground page with your dates entered. Use one tab; a second one does not double your odds.", "At 7:00, refresh once. Take the first available site that fits your party and go straight to checkout. Skip the site photos and loop comparisons.", "If the page stalls on a spinner, wait it out. A reload throws away a request that may have been about to succeed.", "If you miss, stay on the page ten more minutes. Sites left unpaid in a cart return to the pool, so sold out at 7:03 is not always sold out at 7:12."]
  },
  "yosemite-wilderness-permits-guide": {
    title: "The permit application sheet",
    intro: "What to decide, have ready and do, in order, to apply for a Yosemite wilderness permit and collect it.",
    heading: "The permit application sheet for this guide",
    blurb: "Unlock the step-by-step application sheet, from choosing the lottery or the seven-day release to the pickup window on your start date. It comes with Sunday Field Notes, a free weekly letter.",
    items: ["Decide how attached you are to a specific route. Very: enter the 24-week lottery with every plausible alternate. Not very: skip to the seven-day release and aim off-peak.", "For the lottery, applications for a Sunday-through-Saturday window of start dates open on a Sunday, close the following Saturday, and process the day after. One application per window.", "List alternate trailheads and dates on the application; that is where most of the winning happens. It costs $10 to apply, plus $5 per person if you win.", "For the seven-day release, set a 7 a.m. Pacific alarm for seven days before your ideal start, with second and third trailhead choices already written down.", "Improve the odds: consider a Tuolumne or Hetch Hetchy start rather than the Valley, and book a midweek start.", "Plan for an approved bear-resistant food canister, required for every overnight trip. Rentals are cheap at wilderness centers if you do not own one.", "Collect the permit at a wilderness center on the start date between 8 and 11 a.m. Arriving later, ask Recreation.gov for a late-arrival hold, which extends pickup to 5 p.m."]
  },
  "mist-trail-the-real-guide": {
    title: "The night-before and trailhead sheet",
    intro: "What to settle the night before a Mist Trail hike and what to do at Happy Isles, so the early start actually happens.",
    heading: "The night-before sheet for the Mist Trail",
    blurb: "Unlock the short checklist for the evening before and the morning at the trailhead: turnaround, closures, water, layers and parking. It comes with Sunday Field Notes, a free weekly letter.",
    items: ["Pick your turnaround: 1.6 miles round trip to the footbridge, 2.4 miles to the top of Vernal Fall, or 5.4 miles to the top of Nevada Fall.", "Check for repair closures before you go. When one is posted, follow the signed JMT detour.", "Fill water: 1 liter per person for the footbridge, 2 for Vernal Fall, 3 to 4 for Nevada Fall. There is no drinking-water tap at Nevada Fall.", "Pack a headlamp, food, a ziplock bag for your phone and a dry shirt in a ziplock to change into at the top.", "Lay out synthetic or wool, not cotton, and boots or trail shoes with good tread that you have already walked in. No flip-flops, sandals or fashion sneakers.", "Happy Isles has no trailhead parking. Park at Curry Village and walk, or take the Valley shuttle to stop 16, and start early.", "On the trail, stay behind the railings, and do not wade or swim in the pools above the falls."]
  }
};
function ArticleBonus({
  slug
}) {
  var b = ARTICLE_BONUS[slug];
  var SoftGate = window.SoftGate;
  if (!b || !SoftGate || !b.items || b.items.length < 2) return null;
  var list = (items, start) => React.createElement("ol", {
    className: "bonus__list",
    start: start
  }, items.map((t, i) => React.createElement("li", {
    key: i
  }, t)));
  var teaser = React.createElement("ol", {
    className: "bonus__list bonus__list--teaser",
    start: 2
  }, b.items.slice(1).map((_t, i) => React.createElement("li", {
    key: i
  }, React.createElement("span", {
    className: "bonus__bar",
    style: {
      width: `${62 + i * 17 % 30}%`
    }
  }))));
  return React.createElement("aside", {
    className: "bonus",
    "aria-label": b.title
  }, React.createElement("p", {
    className: "bonus__eyebrow"
  }, "Subscriber bonus"), React.createElement("h2", {
    className: "bonus__title"
  }, b.title), React.createElement("p", {
    className: "bonus__intro"
  }, b.intro), list(b.items.slice(0, 1), 1), React.createElement(SoftGate, {
    gateKey: `bonus-${slug}`,
    location: "article_bonus_gate",
    tag: "article-bonus",
    heading: b.heading,
    blurb: b.blurb,
    cta: "Show the sheet →",
    teaser: teaser
  }, list(b.items.slice(1), 2)));
}
function ArticlePage({
  slug,
  go
}) {
  var article = window.findArticle(slug);
  var [Body, setBody] = React.useState(() => (window.ARTICLE_BODIES || {})[slug] || null);
  var [bodyState, setBodyState] = React.useState(() => (window.ARTICLE_BODIES || {})[slug] ? "ready" : "loading");
  var proseRef = React.useRef(null);
  var [toc, setToc] = React.useState([]);
  React.useEffect(() => {
    if (bodyState !== "ready") {
      setToc([]);
      return;
    }
    if (article && article.feature) {
      setToc([]);
      var prose = proseRef.current;
      if (!prose) return;
      var onClick = e => {
        var a = e.target.closest && e.target.closest('.ff-toc a[href^="#"]');
        if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var target = document.getElementById(a.getAttribute("href").slice(1));
        if (!target) return;
        e.preventDefault();
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start"
        });
        target.focus({
          preventScroll: true
        });
        if (window.history && window.history.replaceState) window.history.replaceState(null, "", "#" + target.id);
        if (window.track) window.track("toc_jump", {
          slug
        });
      };
      prose.addEventListener("click", onClick);
      return () => prose.removeEventListener("click", onClick);
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
    if (bodyState !== "ready") return;
    var id = decodeURIComponent((window.location.hash || "").slice(1));
    if (!id) return;
    var raf2 = 0;
    var raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        var target = document.getElementById(id);
        if (target && proseRef.current && proseRef.current.contains(target)) target.scrollIntoView({
          block: "start"
        });
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [bodyState, slug]);
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
    if (article && article.image) preloadResponsive(article.image, article.feature ? ARTICLE_SIZES_COVER : SIZES_HERO);
  }, [slug]);
  var articleRef = React.useRef(null);
  var [lightbox, setLightbox] = React.useState(null);
  React.useEffect(() => {
    var root = articleRef.current;
    if (!root) return;
    var plates = Array.from(root.querySelectorAll(".placeholder--photo")).filter(el => !el.closest("a") && el.querySelector("img"));
    plates.forEach(el => {
      el.classList.add("is-zoomable");
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      var alt = (el.querySelector("img") || {}).alt || "";
      el.setAttribute("aria-label", alt ? `Enlarge: ${alt}` : "Enlarge this photo");
    });
    var open = el => {
      var img = el.querySelector("img");
      if (!img) return;
      var credit = el.querySelector(".placeholder__credit");
      setLightbox({
        src: largestSource(img),
        alt: img.alt || "",
        caption: [img.alt, credit && credit.textContent].filter(Boolean).join(" · ")
      });
      if (window.track) window.track("plate_zoom", {
        slug
      });
    };
    var onClick = e => {
      var el = e.target.closest && e.target.closest(".placeholder.is-zoomable");
      if (el && root.contains(el)) {
        e.preventDefault();
        open(el);
      }
    };
    var onKey = e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      var el = e.target.closest && e.target.closest(".placeholder.is-zoomable");
      if (el && root.contains(el)) {
        e.preventDefault();
        open(el);
      }
    };
    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey);
      plates.forEach(el => {
        el.classList.remove("is-zoomable");
        el.removeAttribute("tabindex");
        el.removeAttribute("role");
        el.removeAttribute("aria-label");
      });
    };
  }, [bodyState, slug, Body]);
  var closeLightbox = React.useCallback(() => setLightbox(null), []);
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
  if (!article) return React.createElement("div", {
    className: "wrap",
    style: {
      padding: 80
    }
  }, "Not found.");
  var cat = window.findCategory(article.cat);
  var doneSlugs = window.readHistory.done();
  var unreadFirst = list => [...list.filter(a => !doneSlugs.has(a.slug)), ...list.filter(a => doneSlugs.has(a.slug))];
  var related = unreadFirst((window.relatedFor ? window.relatedFor(slug) : []).map(s => window.findArticle(s)).filter(a => a && a.slug !== slug));
  var relatedSameCat = related.length > 0 && related.every(a => a.cat === article.cat);
  var upper = t => (t || "").toUpperCase();
  var tripIntent = article.cat === "trails" || article.cat === "planning" || article.cat === "seasonal";
  var feature = article.feature || null;
  var bodyEl = bodyState === "ready" && Body ? React.createElement(Body, null) : bodyState === "loading" ? React.createElement(BodySkeleton, null) : React.createElement("p", {
    className: "hp-article__soon"
  }, "This article is coming soon.");
  return React.createElement("div", {
    className: "page hp-article" + (feature ? " hp-event hp-article--feature" : "")
  }, React.createElement("div", {
    className: "readbar",
    "aria-hidden": "true"
  }, React.createElement("div", {
    className: "readbar__fill",
    ref: barRef
  })), lightbox && React.createElement(MapLightbox, {
    src: lightbox.src,
    alt: lightbox.alt,
    caption: lightbox.caption,
    onClose: closeLightbox
  }), React.createElement("article", {
    ref: articleRef
  }, (() => {
    var head = React.createElement(HpPageHead, {
      as: feature ? "div" : "header",
      go: go,
      className: "hp-article__head",
      crumbs: [{
        label: "Home",
        route: "home"
      }, {
        label: cat.label,
        route: `cat:${cat.slug}`
      }, {
        label: article.title
      }],
      eyebrow: feature && feature.eyebrow ? feature.eyebrow : React.createElement("a", {
        href: `/section/${cat.slug}`,
        onClick: e => {
          e.preventDefault();
          go(`cat:${cat.slug}`);
        }
      }, upper(cat.label)),
      title: article.title,
      intro: article.dek,
      actions: feature && feature.actions ? React.createElement(React.Fragment, null, feature.actions.map(([href, label], i) => React.createElement(HomeLink, {
        key: href,
        go: go,
        location: "article_cover",
        href: href,
        className: i === 0 ? "hp-button" : "hp-link"
      }, label, " ", i === 0 ? React.createElement("span", null, "↓") : "↓"))) : null,
      aside: feature ? null : React.createElement("div", {
        className: "hp-article__plate"
      }, React.createElement(Placeholder, {
        caption: article.placeholder,
        image: article.image,
        credit: article.credit,
        tag: "PLATE I",
        size: "lg",
        eager: true,
        motif: React.createElement(MotifMountains, null)
      }))
    }, React.createElement("address", {
      className: "hp-article__byline"
    }, React.createElement("span", {
      className: "hp-article__avatar",
      "aria-hidden": "true"
    }, "CG"), React.createElement("span", null, React.createElement("span", {
      className: "hp-article__author"
    }, "By ", React.createElement("a", {
      href: "/about",
      rel: "author",
      onClick: e => {
        e.preventDefault();
        go("about");
      }
    }, window.SITE.authorName)), React.createElement("span", {
      className: "hp-article__bio"
    }, window.SITE.authorBio)), React.createElement("span", {
      className: "hp-article__dates"
    }, React.createElement("time", {
      dateTime: article.isoModified || article.isoDate
    }, article.date), React.createElement("span", null, article.read, " read"), article.isoModified && article.isoModified !== article.isoDate && formatIsoDate(article.isoModified) && React.createElement("span", null, "Updated ", formatIsoDate(article.isoModified)))), article.aff && window.AffiliateDisclosure && React.createElement(window.AffiliateDisclosure, null, "This article has affiliate links. If you buy or book through one, The Talus Field may earn a commission at no extra cost to you, and the recommendations do not change for it."), (() => {
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
    })());
    if (!feature) return head;
    return React.createElement("header", {
      className: "ff-cover hp-article__cover",
      style: feature.focus ? {
        "--cover-focus": feature.focus
      } : undefined
    }, React.createElement(ResponsiveImage, {
      image: article.image,
      eager: true,
      className: "ff-cover__img",
      alt: article.placeholder,
      sizes: ARTICLE_SIZES_COVER
    }), head, article.credit && React.createElement("p", {
      className: "ff-cover__credit"
    }, article.credit));
  })(), feature && (bodyState === "ready" && Body ? React.createElement("div", {
    className: "hp-feature",
    ref: proseRef
  }, bodyEl) : React.createElement("div", {
    className: "hp-wrap hp-reading"
  }, React.createElement("div", {
    className: "hp-reading__column prose"
  }, bodyEl))), React.createElement("div", {
    className: "hp-wrap hp-reading" + (feature ? " hp-feature__end" : "")
  }, React.createElement("div", {
    className: "hp-reading__column"
  }, toc.length > 0 && React.createElement("details", {
    className: "toc"
  }, React.createElement("summary", null, "In this guide"), React.createElement("ul", null, toc.map(it => React.createElement("li", {
    key: it.id
  }, React.createElement("a", {
    href: "#" + it.id,
    onClick: e => {
      e.preventDefault();
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(it.id)?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start"
      });
      if (window.history && window.history.replaceState) window.history.replaceState(null, "", "#" + it.id);
      if (window.track) window.track("toc_jump", {
        slug
      });
    }
  }, it.text))))), !feature && React.createElement("div", {
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
  }, article.isoModified && formatIsoDate(article.isoModified) || article.date)), React.createElement("div", {
    className: "statblock__item"
  }, React.createElement("span", {
    className: "label"
  }, "Section"), React.createElement("span", {
    className: "val"
  }, cat.label))), bodyEl), bodyState === "ready" && React.createElement(ArticleBonus, {
    slug: slug
  }), React.createElement("div", {
    className: "hp-article__authorbox"
  }, React.createElement("span", {
    className: "hp-article__avatar",
    "aria-hidden": "true"
  }, "CG"), React.createElement("div", null, React.createElement("p", {
    className: "hp-article__author"
  }, React.createElement("a", {
    href: "/about",
    rel: "author",
    onClick: e => {
      e.preventDefault();
      go("about");
    }
  }, window.SITE.authorName)), React.createElement("p", {
    className: "hp-article__bio"
  }, window.SITE.authorBio), React.createElement("a", {
    className: "hp-link",
    href: "/about",
    onClick: e => {
      e.preventDefault();
      go("about");
    }
  }, "Read how recommendations get made ↗"))), React.createElement(ShareRow, {
    title: article.title,
    slug: slug
  })))), related.length > 0 && React.createElement("section", {
    className: "hp-wrap hp-section hp-article__related"
  }, React.createElement(HpHeading, {
    go: go,
    location: "article_related",
    eyebrow: "THE JOURNAL",
    title: relatedSameCat ? `More from ${cat.label}` : "Keep reading",
    link: relatedSameCat ? {
      href: `/section/${cat.slug}`,
      label: `All in ${cat.label} ↗`
    } : {
      href: "/articles",
      label: "All entries ↗"
    }
  }), React.createElement("ul", {
    className: "relrail"
  }, related.map(a => React.createElement("li", {
    key: a.slug
  }, React.createElement("a", {
    href: `/articles/${a.slug}`,
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("related_click", {
        slug: a.slug,
        from: slug
      });
      go(`a:${a.slug}`);
    }
  }, a.title), React.createElement("span", {
    className: "relrail__dek"
  }, a.seoDek || a.dek))))), tripIntent && React.createElement(HpGuideBand, {
    go: go,
    location: "article_end",
    title: "The park, in your pocket.",
    intro: "The app version of this journal: offline maps, GPS at the trailhead, and every stop with parking and timing notes. Works with no signal, which is most of the park.",
    sample: true
  }), !ARTICLE_BONUS[slug] && (() => {
    var endVariant = window.abVariant ? window.abVariant("article_end_copy") : "a";
    var offers = endVariant === "b" ? END_NEWSLETTER_OFFER_B : END_NEWSLETTER_OFFER;
    var offer = offers[article.cat] || {};
    var heading = offer.heading || "Sunday Field Notes";
    return React.createElement(HpLetter, {
      eyebrow: "SUNDAY FIELD NOTES / FREE",
      title: heading,
      heading: heading,
      blurb: offer.blurb || "One letter a week. If you found this useful, you'll probably like the rest.",
      location: "article_end",
      tag: newsletterTag("article-end", article.cat),
      variant: endVariant
    });
  })());
}
window.ArticlePage = ArticlePage;
