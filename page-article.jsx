/* global React, Placeholder, MotifMountains, preloadResponsive, SIZES_HERO, ShareRow, MapLightbox, HpPageHead, HpHeading, HpGuideBand, HpLetter, HomeLink, ResponsiveImage */

// Paragraph-shaped lines for the body's loading state. Widths are fixed, not
// random, so the skeleton is the same on every render and never shifts.
const SKELETON_LINES = [
  [100, 96, 98, 62], [100, 94, 97, 100, 40], "head", [98, 100, 93, 71],
];
function BodySkeleton() {
  return (
    <div className="skeleton" role="status" aria-live="polite" aria-label="Loading the article">
      {SKELETON_LINES.map((para, i) =>
        para === "head"
          ? <span key={i} className="skeleton__line skeleton__line--head" />
          : para.map((w, j) => (
              <span
                key={`${i}-${j}`}
                className={`skeleton__line${j === para.length - 1 ? " skeleton__line--gap" : ""}`}
                style={{ width: `${w}%` }}
              />
            ))
      )}
    </div>
  );
}

// The largest JPEG in a plate's srcset, for the lightbox. The <img> carries
// the JPEG set with w-descriptors (ResponsiveImage), so the last, widest
// entry is the sharpest file the site has; the bare src is the master, which
// is the one file a reader should never be handed (see the prerender note
// in CLAUDE.md).
function largestSource(img) {
  const set = img.getAttribute("srcset") || "";
  let best = null, bestW = 0;
  for (const part of set.split(",")) {
    const m = part.trim().match(/^(\S+)\s+(\d+)w$/);
    if (m && Number(m[2]) > bestW) { bestW = Number(m[2]); best = m[1]; }
  }
  return best || img.currentSrc || img.src;
}

// A feature article's cover runs the full width of the page (the /firefall
// cover), so its image takes the viewport's width, not the plate's 700px.
// edge/seo.js preloads the hero with the same sizes when articles.json marks
// the entry `cover` (gen-seo-artifacts.mjs sets it from `feature`), so the
// preload and the <picture> pick the same file.
const ARTICLE_SIZES_COVER = "100vw";


// "Month D, YYYY" for an ISO date string, used to surface a genuine revision
// date (isoModified) distinct from the publish date shown in the byline.
function formatIsoDate(iso) {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// End-of-article newsletter offer, varied by section so the highest-intent
// moment on the page (a reader who just finished the piece) matches the ask
// to what they've shown they care about.
const END_NEWSLETTER_OFFER = {
  planning: {
    heading: "Get the conditions before you go",
    blurb: "One Yosemite email a week: what's open, what's booked out, and what changed since you started planning. Free.",
  },
  trails: {
    heading: "Sunday Field Notes",
    blurb: "One letter a week on trail conditions and what's worth the hike right now. Free, and you can leave anytime.",
  },
  wildlife: {
    heading: "Sunday Field Notes",
    blurb: "One letter a week from someone who's out there year-round: wildlife notes, trail conditions, the occasional longer piece.",
  },
  seasonal: {
    heading: "Sunday Field Notes",
    blurb: "One letter a week, timed to the season you're reading about: what's blooming, what's flowing, what's changed.",
  },
};

// B arm of the article_end_copy test: same placement, concrete-utility
// framing. The device's sticky bucket (abVariant) picks the arm; the variant
// rides on the GA4 impression/signup events so each arm's rate is sliceable.
const END_NEWSLETTER_OFFER_B = {
  planning: {
    heading: "What changed this week in Yosemite",
    blurb: "Reservation windows open and close. Roads do too. One Sunday note carries the week's changes so your plan doesn't age out.",
  },
  trails: {
    heading: "Trail status, Sundays",
    blurb: "Trails close, creeks rise, the cables go up and come down. One letter a week with the status that matters before you drive in.",
  },
  wildlife: {
    heading: "What's moving in the park",
    blurb: "Bears wake, owls fledge, the meadows turn week to week. One Sunday letter on what's happening out there right now.",
  },
  seasonal: {
    heading: "Hit the window, not the crowd",
    blurb: "Waterfalls peak, colors turn, roads open late. One Sunday letter tracks the season so you time it right.",
  },
};

// Buttondown's embed-subscribe form accepts one `tag` field per submission
// (multiple hidden inputs behave like radio buttons, not an array), so a
// placement tag and an interest tag are combined into one compound value
// here. The Worker subscribe proxy sends a real tag array and can keep both
// as independent tags once that ships.
function newsletterTag(placement, cat) {
  return cat ? `${placement}-${cat}` : placement;
}

// ---------------------------------------------------------------------------
// Subscriber bonus sheets. A few of the planning guides end with a short,
// practical sheet (the booking-day steps, the permit application steps) that
// opens with the Sunday letter or "No thanks, show me" (window.SoftGate, gate
// key bonus-<slug>). Four rules:
// (1) every line restates a fact the article's own body already publishes;
//     a sheet is a reorganisation of the piece into steps, never new facts,
//     so a change to the article's figures is a change here too;
// (2) the sheet is not article text and never enters the prerendered
//     fragment or the crawler prose (gen-prerender.mjs reads bodies/, not this
//     table), and its locked lines are not in the DOM until the gate opens;
// (3) the first line is always free, so the reader sees what the sheet is;
// (4) an article with a sheet drops its end-of-article letter box, because
//     the sheet's gate is that article's one letter ask.
// ---------------------------------------------------------------------------
const ARTICLE_BONUS = {
  "yosemite-camping-complete-guide": {
    title: "The booking-day sheet",
    intro: "The steps for the morning a campground releases its sites on Recreation.gov, in the order they happen.",
    heading: "The booking-day sheet for this guide",
    blurb: "Unlock the release-morning checklist, from the account you set up a week ahead to the ten minutes after 7:00. It comes with Sunday Field Notes, a free weekly letter.",
    items: [
      "Know your morning. Upper, Lower and North Pines, Wawona and Hodgdon Meadow open one block of arrivals, the 15th through the 14th, on the 15th at 7 a.m. Pacific.",
      "The week before, create the Recreation.gov account, confirm the email address and save a payment method. A last-minute account asks you to verify an email at 7:01.",
      "The night before, write down the campground, the arrival date, the nights and two fallback date ranges. Confirm the on-sale time on the campground's own page.",
      "Five minutes out, log in and load the campground page with your dates entered. Use one tab; a second one does not double your odds.",
      "At 7:00, refresh once. Take the first available site that fits your party and go straight to checkout. Skip the site photos and loop comparisons.",
      "If the page stalls on a spinner, wait it out. A reload throws away a request that may have been about to succeed.",
      "If you miss, stay on the page ten more minutes. Sites left unpaid in a cart return to the pool, so sold out at 7:03 is not always sold out at 7:12.",
    ],
  },
  "yosemite-wilderness-permits-guide": {
    title: "The permit application sheet",
    intro: "What to decide, have ready and do, in order, to apply for a Yosemite wilderness permit and collect it.",
    heading: "The permit application sheet for this guide",
    blurb: "Unlock the step-by-step application sheet, from choosing the lottery or the seven-day release to the pickup window on your start date. It comes with Sunday Field Notes, a free weekly letter.",
    items: [
      "Decide how attached you are to a specific route. Very: enter the 24-week lottery with every plausible alternate. Not very: skip to the seven-day release and aim off-peak.",
      "For the lottery, applications for a Sunday-through-Saturday window of start dates open on a Sunday, close the following Saturday, and process the day after. One application per window.",
      "List alternate trailheads and dates on the application; that is where most of the winning happens. It costs $10 to apply, plus $5 per person if you win.",
      "For the seven-day release, set a 7 a.m. Pacific alarm for seven days before your ideal start, with second and third trailhead choices already written down.",
      "Improve the odds: consider a Tuolumne or Hetch Hetchy start rather than the Valley, and book a midweek start.",
      "Plan for an approved bear-resistant food canister, required for every overnight trip. Rentals are cheap at wilderness centers if you do not own one.",
      "Collect the permit at a wilderness center on the start date between 8 and 11 a.m. Arriving later, ask Recreation.gov for a late-arrival hold, which extends pickup to 5 p.m.",
    ],
  },
  "mist-trail-the-real-guide": {
    title: "The night-before and trailhead sheet",
    intro: "What to settle the night before a Mist Trail hike and what to do at Happy Isles, so the early start actually happens.",
    heading: "The night-before sheet for the Mist Trail",
    blurb: "Unlock the short checklist for the evening before and the morning at the trailhead: turnaround, closures, water, layers and parking. It comes with Sunday Field Notes, a free weekly letter.",
    items: [
      "Pick your turnaround: 1.6 miles round trip to the footbridge, 2.4 miles to the top of Vernal Fall, or 5.4 miles to the top of Nevada Fall.",
      "Check for repair closures before you go. When one is posted, follow the signed JMT detour.",
      "Fill water: 1 liter per person for the footbridge, 2 for Vernal Fall, 3 to 4 for Nevada Fall. There is no drinking-water tap at Nevada Fall.",
      "Pack a headlamp, food, a ziplock bag for your phone and a dry shirt in a ziplock to change into at the top.",
      "Lay out synthetic or wool, not cotton, and boots or trail shoes with good tread that you have already walked in. No flip-flops, sandals or fashion sneakers.",
      "Happy Isles has no trailhead parking. Park at Curry Village and walk, or take the Valley shuttle to stop 16, and start early.",
      "On the trail, stay behind the railings, and do not wade or swim in the pools above the falls.",
    ],
  },
};

function ArticleBonus({ slug }) {
  const b = ARTICLE_BONUS[slug];
  const SoftGate = window.SoftGate;
  if (!b || !SoftGate || !b.items || b.items.length < 2) return null;
  const list = (items, start) => (
    <ol className="bonus__list" start={start}>
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ol>
  );
  const teaser = (
    <ol className="bonus__list bonus__list--teaser" start={2}>
      {b.items.slice(1).map((_t, i) => <li key={i}><span className="bonus__bar" style={{ width: `${62 + ((i * 17) % 30)}%` }} /></li>)}
    </ol>
  );
  return (
    <aside className="bonus" aria-label={b.title}>
      <p className="bonus__eyebrow">Subscriber bonus</p>
      <h2 className="bonus__title">{b.title}</h2>
      <p className="bonus__intro">{b.intro}</p>
      {list(b.items.slice(0, 1), 1)}
      <SoftGate
        gateKey={`bonus-${slug}`}
        location="article_bonus_gate"
        tag="article-bonus"
        heading={b.heading}
        blurb={b.blurb}
        cta="Show the sheet →"
        teaser={teaser}
      >
        {list(b.items.slice(1), 2)}
      </SoftGate>
    </aside>
  );
}

function ArticlePage({ slug, go }) {
  const article = window.findArticle(slug);

  // Article bodies load on demand (data.js#loadArticleBody) rather than all 23
  // transpiling up front. Hold the resolved component and a status for the
  // loading / coming-soon states.
  const [Body, setBody] = React.useState(() => (window.ARTICLE_BODIES || {})[slug] || null);
  const [bodyState, setBodyState] = React.useState(
    () => ((window.ARTICLE_BODIES || {})[slug] ? "ready" : "loading")
  );

  // The rendered body, for the heading scrape and the photo plates below.
  const proseRef = React.useRef(null);

  // Once the body is ready, scrape its H2 section headings, give each a
  // stable id, and expose a jump list for long pieces (>= 5 sections).
  const [toc, setToc] = React.useState([]);
  React.useEffect(() => {
    if (bodyState !== "ready") { setToc([]); return; }
    // A feature body (see `feature` below) prints its own jump list and pins
    // its own section ids, so it gets neither the scrape nor the details
    // list; its links get the same in-page behaviour instead: smooth scroll,
    // the anchor kept in the address bar with replaceState, toc_jump.
    if (article && article.feature) {
      setToc([]);
      const prose = proseRef.current;
      if (!prose) return;
      const onClick = (e) => {
        const a = e.target.closest && e.target.closest('.ff-toc a[href^="#"]');
        if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const target = document.getElementById(a.getAttribute("href").slice(1));
        if (!target) return;
        e.preventDefault();
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        target.focus({ preventScroll: true });
        if (window.history && window.history.replaceState) window.history.replaceState(null, "", "#" + target.id);
        if (window.track) window.track("toc_jump", { slug });
      };
      prose.addEventListener("click", onClick);
      return () => prose.removeEventListener("click", onClick);
    }
    const raf = requestAnimationFrame(() => {
      const prose = proseRef.current;
      if (!prose) return;
      const items = Array.from(prose.querySelectorAll("h2")).map((h, i) => {
        if (!h.id) {
          const base = (h.textContent || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
          h.id = "sec-" + i + (base ? "-" + base : "");
        }
        return { id: h.id, text: h.textContent || "" };
      }).filter((it) => it.text);
      setToc(items.length >= 5 ? items : []);
    });
    return () => cancelAnimationFrame(raf);
  }, [bodyState, slug, Body]);

  // Land on the fragment once the body exists. The browser tries the hash at
  // load, when the lazy-loaded body is not yet in the DOM, so a deep link
  // (a Google #sec- result, or a cross-link to a subsection such as the bears
  // guide's #spring-bears-hungriest) opened at the top of the article. Two
  // frames: the effect above assigns the sec- ids in the first.
  React.useEffect(() => {
    if (bodyState !== "ready") return;
    const id = decodeURIComponent((window.location.hash || "").slice(1));
    if (!id) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target && proseRef.current && proseRef.current.contains(target)) target.scrollIntoView({ block: "start" });
      });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [bodyState, slug]);

  React.useEffect(() => {
    let cancelled = false;
    const existing = (window.ARTICLE_BODIES || {})[slug];
    if (existing) {
      setBody(() => existing);
      setBodyState("ready");
      return;
    }
    setBody(null);
    setBodyState("loading");
    window
      .loadArticleBody(slug)
      .then((fn) => {
        if (cancelled) return;
        if (fn) { setBody(() => fn); setBodyState("ready"); }
        else setBodyState("missing");
      })
      .catch((err) => {
        // loadArticleBody memoizes rejected promises, so on SPA re-navigation
        // this catch can fire without the data.js log repeating.
        console.error(`ArticlePage: body for "${slug}" unavailable`, err);
        if (!cancelled) setBodyState("missing");
      });
    return () => { cancelled = true; };
  }, [slug]);

  // Preload the hero's responsive srcset so the LCP image fetches before the
  // <picture> mounts.
  React.useEffect(() => {
    if (article && article.image) preloadResponsive(article.image, article.feature ? ARTICLE_SIZES_COVER : SIZES_HERO);
  }, [slug]);

  // Reading progress. Depth is measured against the body (.prose), not the
  // document, so the related rail and footer never count as "read". Drives
  // three things: the thin bar fixed at the top of the viewport (written
  // imperatively through barRef so scrolling never re-renders the page), an
  // article_progress GA4 event at each quarter mark (once per view), and the
  // read history behind the home resume band. A piece scrolled past 90% is
  // recorded done; anything abandoned between 10% and 90% is saved as the
  // resume target on navigation away or tab close.
  // Plates open in the lightbox. Every photo plate inside the article (the
  // hero and the body's) is marked zoomable once the body is in, and one
  // delegated listener on the article opens MapLightbox, the pan-and-zoom
  // viewer the map pages already carry, with the plate's own alt as the
  // caption. The plates are made focusable here rather than in Placeholder,
  // because that component's markup is mirrored by the prerender stubs and
  // rendered inside card links elsewhere, where a second focus stop would be
  // noise. The lightbox itself restores focus to the plate on close.
  const articleRef = React.useRef(null);
  const [lightbox, setLightbox] = React.useState(null);
  React.useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    const plates = Array.from(root.querySelectorAll(".placeholder--photo"))
      .filter((el) => !el.closest("a") && el.querySelector("img"));
    plates.forEach((el) => {
      el.classList.add("is-zoomable");
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      const alt = (el.querySelector("img") || {}).alt || "";
      el.setAttribute("aria-label", alt ? `Enlarge: ${alt}` : "Enlarge this photo");
    });
    const open = (el) => {
      const img = el.querySelector("img");
      if (!img) return;
      const credit = el.querySelector(".placeholder__credit");
      setLightbox({
        src: largestSource(img),
        alt: img.alt || "",
        caption: [img.alt, credit && credit.textContent].filter(Boolean).join(" · "),
      });
      if (window.track) window.track("plate_zoom", { slug });
    };
    const onClick = (e) => {
      const el = e.target.closest && e.target.closest(".placeholder.is-zoomable");
      if (el && root.contains(el)) { e.preventDefault(); open(el); }
    };
    const onKey = (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const el = e.target.closest && e.target.closest(".placeholder.is-zoomable");
      if (el && root.contains(el)) { e.preventDefault(); open(el); }
    };
    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey);
      plates.forEach((el) => {
        el.classList.remove("is-zoomable");
        el.removeAttribute("tabindex");
        el.removeAttribute("role");
        el.removeAttribute("aria-label");
      });
    };
  }, [bodyState, slug, Body]);
  const closeLightbox = React.useCallback(() => setLightbox(null), []);

  const barRef = React.useRef(null);
  React.useEffect(() => {
    if (bodyState !== "ready") return;
    const prose = proseRef.current;
    if (!prose) return;
    const fired = {};
    let maxPct = 0;
    let savedPct = 0;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const rect = prose.getBoundingClientRect();
      if (rect.height <= 0) return;
      const seen = Math.min(rect.height, Math.max(0, window.innerHeight - rect.top));
      const pct = Math.round((seen / rect.height) * 100);
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct / 100})`;
      if (pct <= maxPct) return;
      maxPct = pct;
      [25, 50, 75, 100].forEach((t) => {
        if (pct >= t && !fired[t]) {
          fired[t] = true;
          if (window.track) window.track("article_progress", { slug, percent: t });
        }
      });
      if (pct >= 90 && !fired.done) {
        fired.done = true;
        window.readHistory.markDone(slug);
        window.readHistory.clearLast(slug);
      }
      // Write the resume target through as the reader goes (every 5 points of
      // new depth), not only on teardown: on SPA navigation the next page
      // renders before this effect's cleanup runs, so a cleanup-only save
      // would always be one page behind the resume band reading it.
      if (maxPct >= 10 && maxPct < 90 && maxPct >= savedPct + 5) {
        savedPct = maxPct;
        window.readHistory.setLast(slug, maxPct);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };

    // A resume click on the home page sets tfg.read.resume before navigating;
    // jump back to the saved depth once, then behave like a normal read. The
    // flag is consumed (removed) whether or not it matches, so it can never go
    // stale and surprise a later pageview.
    const resume = window.safeStorage.get("tfg.read.resume");
    if (resume) window.safeStorage.remove("tfg.read.resume");
    const saved = window.readHistory.last();
    if (resume === slug && saved && saved.slug === slug && saved.pct > 0) {
      const top = window.scrollY + prose.getBoundingClientRect().top
        + (saved.pct / 100) * prose.getBoundingClientRect().height - window.innerHeight;
      if (top > 0) window.scrollTo({ top });
    }

    const saveUnfinished = () => {
      if (maxPct >= 10 && maxPct < 90) window.readHistory.setLast(slug, maxPct);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
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

  if (!article) return <div className="wrap" style={{ padding: 80 }}>Not found.</div>;
  const cat = window.findCategory(article.cat);
  // Related rail: same-section pieces the reader has not finished come first,
  // then finished same-section pieces, then other sections (unread-first), so
  // the rail always fills its three slots and repeat visitors are not shown
  // the same three pieces they already read.
  // Related rail: the article's own curated set (window.RELATED in data.js,
  // falling back to relatedFor's rotation), reordered so pieces the reader has
  // not finished come first.
  //
  // It used to be computed here instead: same-section articles in catalog
  // order, unread first. A crawler has no read history, so every article in a
  // section resolved to the same three links and the site's internal link
  // graph collapsed onto a handful of early-catalog pieces. Curation moved to
  // data.js because three surfaces need the same answer now: this rail, the
  // Related reading block edge/seo.js injects for crawlers, and the `related`
  // field in articles.json. Read history stays a client-side nicety layered on
  // top; it reorders the set, it does not choose it.
  const doneSlugs = window.readHistory.done();
  const unreadFirst = (list) => [
    ...list.filter(a => !doneSlugs.has(a.slug)),
    ...list.filter(a => doneSlugs.has(a.slug)),
  ];
  const related = unreadFirst(
    (window.relatedFor ? window.relatedFor(slug) : [])
      .map(s => window.findArticle(s))
      .filter(a => a && a.slug !== slug)
  );
  const relatedSameCat = related.length > 0 && related.every(a => a.cat === article.cat);

  // Tracked-caps eyebrow text, the design system's label voice.
  const upper = (t) => (t || "").toUpperCase();
  const tripIntent = article.cat === "trails" || article.cat === "planning" || article.cat === "seasonal";

  // A feature article (September 2026, the El Capitan redesign): the catalog
  // entry's `feature` block ({ eyebrow, focus, actions }) moves the page onto
  // the /firefall system. The head becomes the full-width photo cover, the
  // body gets the page's full width instead of the reading column (it lays
  // out its own sections on `hp-wrap`), and the `.hp-event` class brings the
  // event pages' tokens. Everything else on the page, the byline, the author
  // box, the share row, the related rail and the two asks, is unchanged.
  const feature = article.feature || null;
  const bodyEl = bodyState === "ready" && Body ? <Body /> :
    bodyState === "loading" ? <BodySkeleton /> :
    <p className="hp-article__soon">This article is coming soon.</p>;

  return (
    <div className={"page hp-article" + (feature ? " hp-event hp-article--feature" : "")}>
      <div className="readbar" aria-hidden="true"><div className="readbar__fill" ref={barRef} /></div>
      {lightbox && (
        <MapLightbox src={lightbox.src} alt={lightbox.alt} caption={lightbox.caption} onClose={closeLightbox} />
      )}
      <article ref={articleRef}>
        {/* The head: the homepage hero's split, the copy beside the plate.
            The plate keeps SIZES_HERO (it never draws wider than 700px here),
            so the Worker's AVIF preload and preloadResponsive still match. */}
        {(() => { const head = (
        <HpPageHead
          as={feature ? "div" : "header"}
          go={go}
          className="hp-article__head"
          crumbs={[
            { label: "Home", route: "home" },
            { label: cat.label, route: `cat:${cat.slug}` },
            { label: article.title },
          ]}
          eyebrow={feature && feature.eyebrow ? feature.eyebrow :
            <a href={`/section/${cat.slug}`} onClick={(e) => { e.preventDefault(); go(`cat:${cat.slug}`); }}>
              {upper(cat.label)}
            </a>
          }
          title={article.title}
          intro={article.dek}
          actions={feature && feature.actions ? (
            <React.Fragment>
              {feature.actions.map(([href, label], i) => (
                <HomeLink key={href} go={go} location="article_cover" href={href} className={i === 0 ? "hp-button" : "hp-link"}>
                  {label} {i === 0 ? <span>↓</span> : "↓"}
                </HomeLink>
              ))}
            </React.Fragment>
          ) : null}
          aside={feature ? null :
            <div className="hp-article__plate">
              <Placeholder
                caption={article.placeholder}
                image={article.image}
                credit={article.credit}
                tag="PLATE I"
                size="lg"
                eager
                motif={<MotifMountains />}
              />
            </div>
          }
        >
          <address className="hp-article__byline">
            <span className="hp-article__avatar" aria-hidden="true">CG</span>
            <span>
              <span className="hp-article__author">
                By <a href="/about" rel="author" onClick={(e) => { e.preventDefault(); go("about"); }}>{window.SITE.authorName}</a>
              </span>
              <span className="hp-article__bio">{window.SITE.authorBio}</span>
            </span>
            <span className="hp-article__dates">
              <time dateTime={article.isoModified || article.isoDate}>{article.date}</time>
              <span>{article.read} read</span>
              {article.isoModified && article.isoModified !== article.isoDate && formatIsoDate(article.isoModified) && (
                <span>Updated {formatIsoDate(article.isoModified)}</span>
              )}
            </span>
          </address>

          {/* Affiliate disclosure before the first link (CLAUDE.md, affiliate
              rules). Read from the catalog, not the lazy body, so it is in
              the first commit and nothing shifts when the body arrives. */}
          {article.aff && window.AffiliateDisclosure && (
            <window.AffiliateDisclosure>
              This article has affiliate links. If you buy or book through one, The Talus Field may earn a commission at no extra cost to you, and the recommendations do not change for it.
            </window.AffiliateDisclosure>
          )}

          {/* Series band: cluster articles surface their Planning Guide
              membership (window.PLANNING_SERIES in data.js) so a search
              lander discovers the hub and the neighboring parts. */}
          {(() => {
            const series = window.planningSeriesFor && window.planningSeriesFor(slug);
            if (!series) return null;
            const prev = series.prev ? window.findArticle(series.prev) : null;
            const next = series.next ? window.findArticle(series.next) : null;
            const seriesNav = (a, label) => (
              <a
                href={`/articles/${a.slug}`}
                title={a.title}
                onClick={(e) => {
                  e.preventDefault();
                  if (window.track) window.track("series_band_click", { from: slug, to: a.slug });
                  go(`a:${a.slug}`);
                }}
              >{label}</a>
            );
            return (
              <div className="series-band">
                <span>
                  Part of{" "}
                  <a
                    href="/planning"
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.track) window.track("series_band_click", { from: slug, to: "planning-hub" });
                      go("planning");
                    }}
                  >the Yosemite Planning Guide</a>
                  {" · "}{series.part}
                </span>
                {(prev || next) && (
                  <span className="series-band__nav">
                    {prev && seriesNav(prev, "← Previous")}
                    {next && seriesNav(next, "Next →")}
                  </span>
                )}
              </div>
            );
          })()}
        </HpPageHead>
        );
        if (!feature) return head;
        // The cover: the article's own photograph behind the head, the wash
        // on the copy's side, the credit in the corner. `focus` is the
        // object-position of the crop, per photograph.
        return (
          <header className="ff-cover hp-article__cover" style={feature.focus ? { "--cover-focus": feature.focus } : undefined}>
            <ResponsiveImage image={article.image} eager className="ff-cover__img" alt={article.placeholder} sizes={ARTICLE_SIZES_COVER} />
            {head}
            {article.credit && <p className="ff-cover__credit">{article.credit}</p>}
          </header>
        );
        })()}

        {/* A feature body lays out its own full-width sections; its loading
            skeleton still sits in the reading column. */}
        {feature && (bodyState === "ready" && Body ? (
          <div className="hp-feature" ref={proseRef}>{bodyEl}</div>
        ) : (
          <div className="hp-wrap hp-reading"><div className="hp-reading__column prose">{bodyEl}</div></div>
        ))}

        {/* Body: one reading column on the page's wrap. */}
        <div className={"hp-wrap hp-reading" + (feature ? " hp-feature__end" : "")}>
          <div className="hp-reading__column">
            {toc.length > 0 && (
              <details className="toc">
                <summary>In this guide</summary>
                <ul>
                  {toc.map((it) => (
                    <li key={it.id}>
                      <a
                        href={"#" + it.id}
                        onClick={(e) => {
                          e.preventDefault();
                          const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                          document.getElementById(it.id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
                          // Keep the section anchor in the address bar so the
                          // reader can copy the deep link Google already
                          // surfaces; replace, so Back still leaves the article.
                          if (window.history && window.history.replaceState) window.history.replaceState(null, "", "#" + it.id);
                          if (window.track) window.track("toc_jump", { slug });
                        }}
                      >{it.text}</a>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {!feature && <div className="prose" ref={proseRef}>
              {article.cat === "planning" && (
                <div className="statblock">
                  <div className="statblock__item"><span className="label">Best for</span><span className="val">First visits</span></div>
                  <div className="statblock__item"><span className="label">Reading time</span><span className="val">{article.read}</span></div>
                  <div className="statblock__item"><span className="label">Updated</span><span className="val">{(article.isoModified && formatIsoDate(article.isoModified)) || article.date}</span></div>
                  <div className="statblock__item"><span className="label">Section</span><span className="val">{cat.label}</span></div>
                </div>
              )}

              {bodyEl}
            </div>}

            {bodyState === "ready" && <ArticleBonus slug={slug} />}

            {/* Author box. Puts the naturalist credential at the point where
                trust decisions actually happen: right after the reader has
                finished the piece, before the conversion asks below. */}
            <div className="hp-article__authorbox">
              <span className="hp-article__avatar" aria-hidden="true">CG</span>
              <div>
                <p className="hp-article__author">
                  <a href="/about" rel="author" onClick={(e) => { e.preventDefault(); go("about"); }}>{window.SITE.authorName}</a>
                </p>
                <p className="hp-article__bio">{window.SITE.authorBio}</p>
                <a className="hp-link" href="/about" onClick={(e) => { e.preventDefault(); go("about"); }}>Read how recommendations get made ↗</a>
              </div>
            </div>

            {/* Share affordance: the map's trip links have had a share loop for
                months; this is the articles' equivalent, and article_share
                finally makes editorial referrals measurable. */}
            <ShareRow title={article.title} slug={slug} />
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="hp-wrap hp-section hp-article__related">
          <HpHeading
            go={go}
            location="article_related"
            eyebrow="THE JOURNAL"
            title={relatedSameCat ? `More from ${cat.label}` : "Keep reading"}
            link={relatedSameCat
              ? { href: `/section/${cat.slug}`, label: `All in ${cat.label} ↗` }
              : { href: "/articles", label: "All entries ↗" }}
          />
          {/* Text rows, not a card grid. Five or six curated links carry more
              of the internal link graph than three did, and doing it as cards
              would have put five more images below the fold on every article.
              The dek is the whole reason a reader picks one. */}
          <ul className="relrail">
            {related.map(a => (
              <li key={a.slug}>
                <a
                  href={`/articles/${a.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.track) window.track("related_click", { slug: a.slug, from: slug });
                    go(`a:${a.slug}`);
                  }}
                >{a.title}</a>
                <span className="relrail__dek">{a.seoDek || a.dek}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Field Guide: trip-intent readers (trails, planning, seasonal) only,
          the same one guide ask this slot always carried, now the shared
          design band (guide_cta_click / guide_sample_click, location
          article_end, as before). */}
      {tripIntent && (
        <HpGuideBand
          go={go}
          location="article_end"
          title="The park, in your pocket."
          intro="The app version of this journal: offline maps, GPS at the trailhead, and every stop with parking and timing notes. Works with no signal, which is most of the park."
          sample
        />
      )}

      {!ARTICLE_BONUS[slug] && (() => {
        // article_end copy test: arm a keeps the standing section offers,
        // arm b leads with concrete utility. Copy is chosen here (the
        // caller-controlled A/B path); NewsletterInline just tags the
        // variant onto its GA4 events.
        const endVariant = window.abVariant ? window.abVariant("article_end_copy") : "a";
        const offers = endVariant === "b" ? END_NEWSLETTER_OFFER_B : END_NEWSLETTER_OFFER;
        const offer = offers[article.cat] || {};
        const heading = offer.heading || "Sunday Field Notes";
        return (
          <HpLetter
            eyebrow="SUNDAY FIELD NOTES / FREE"
            title={heading}
            heading={heading}
            blurb={offer.blurb || "One letter a week. If you found this useful, you'll probably like the rest."}
            location="article_end"
            tag={newsletterTag("article-end", article.cat)}
            variant={endVariant}
          />
        );
      })()}

    </div>
  );
}

window.ArticlePage = ArticlePage;
