/* global React, Placeholder, NewsletterInline, MotifMountains, LodgingCta */
const { useState } = React;

// ============================================================
// THE FRONT PAGE (August 2026 homepage redesign)
//
// The page this replaced had grown to eleven stacked sections: a hero carrying
// four separate asks, a utility row, a month planner, Start Here, a lodging
// band, a six-card feed, a By Section grid, a three-part "Go Deeper" ladder,
// and an editor strip. It asked for the newsletter three times and pitched the
// Field Guide twice, and no single screenful said what the site was.
//
// The redesign is a broadsheet: an edition rule, a lede, a four-item index of
// what this site actually is, and then ONE two-column body. The left column is
// editorial (the Bulletin, the four first-visit answers, the latest entries).
// The right column is the rail: every offer on the page, made once, ordered by
// commitment (paid guide, free letter, lodging availability). Nothing
// interrupts the reading column to sell, and nothing is asked for twice.
//
// Three constraints shaped the code, all of them pre-existing:
//   1. HomeHero is rendered offline into index.html's static shell
//      (scripts/gen-home-shell.mjs), so it must render with no browser APIs and
//      bake nothing date-derived. See the comment on HomeHero.
//   2. Everything heavy stays below the DeferredSection boundary, which is what
//      keeps the homepage's main-thread time near an article page's.
//   3. The archive is not an SPA route: its link is a real navigation with no
//      go() handler (CLAUDE.md, "The Nature Notes archive").
// ============================================================

// ============================================================
// The hero: everything above the fold, and the only part of this file that is
// ALSO rendered offline into the static shell baked into index.html
// (scripts/gen-home-shell.mjs), which paints before any JavaScript runs. Two
// rules follow from that:
//
//   1. Its first render must not depend on anything the generator cannot
//      supply: no fetches, no storage reads, no observers, no route state
//      beyond the `go` handler, which the generator stubs.
//   2. Nothing date-derived may be baked in. The generator blanks the one
//      date-derived slot below (the issue label in the edition rule) to a
//      stable-height placeholder and lets React fill it on boot; index.html is
//      cached hard, so a baked month name would go stale. The
//      `data-shell-blank` attribute marks the slot for the generator, which
//      fails loudly if it disappears.
//
// Keeping the markup identical between the shell and this component is what
// keeps CLS at zero when React replaces the shell.
// ============================================================
function HomeHero({ go }) {
  return (
    <React.Fragment>
      {/* The edition rule: the masthead states the brand, this states the
          issue. Full width, above the lede, so the page opens like a dated
          publication rather than a landing page. */}
      <div className="home-edition">
        <div className="wrap home-edition__inner">
          <span className="home-edition__issue">
            <span className="dot"></span>
            <span data-shell-blank="issue">
              {(window.SITE && window.SITE.issue) || "Vol. III"}
              {window.SITE && window.SITE.issueDetail ? ` · ${window.SITE.issueDetail}` : ""}
            </span>
          </span>
          <span className="home-edition__where">Published from El Portal, inside the park</span>
        </div>
      </div>
      <section className="hero">
        <div className="wrap hero__grid">
          <div>
            <h1>Yosemite, from the inside.</h1>
            <p className="hero__dek">
              A working journal of one national park: current conditions, resident-tested planning, and twenty seasons of looking closely.
            </p>
            {/* One primary action, one secondary. Every other ask on this page
                lives in the rail below, so the hero carries no third or fourth
                one. Judged on cta_click{location: home_hero}, the same event
                the previous hero fired. */}
            <div className="hero__cta">
              <a
                className="btn"
                href="/planning"
                onClick={(e) => {
                  e.preventDefault();
                  if (window.track) window.track("cta_click", { location: "home_hero", target: "planning" });
                  go("planning");
                }}
              >Plan my Yosemite trip <span className="btn__arrow">→</span></a>
              <a
                className="btn btn--ghost"
                href="/conditions"
                onClick={(e) => {
                  e.preventDefault();
                  if (window.track) window.track("cta_click", { location: "home_hero", target: "conditions" });
                  go("conditions");
                }}
              >Check today's conditions</a>
            </div>
          </div>
          <Placeholder
            caption={"El Capitan and Bridalveil at sunset"}
            credit={"Rodrigo Soares / Unsplash"}
            image="img/valley-view-sunset-rodrigo-soares.jpg"
            tag="PLATE I"
            size="lg"
            natural
            eager
            motif={<MotifMountains />}
          />
        </div>
      </section>
    </React.Fragment>
  );
}

// ============================================================
// Below-the-fold mount gate. Everything it wraps renders only once it is within
// 600px of the viewport. The homepage's problem was never bytes, it was
// main-thread time: the July 2026 measurement had the homepage at ~1.7s TBT
// against ~150ms on an article page, from mounting six article cards, four
// section tiles, five Go Deeper surfaces, and their images in one synchronous
// pass. The redesign removed most of that work outright (the page below the
// hero is now text, with no card images at all); this keeps the remainder off
// the critical path.
//
// Fails open: no IntersectionObserver (or no ref) renders immediately, so a
// browser without it sees the whole page as before. The placeholder reserves
// `minHeight` and the 600px margin means the swap happens below the viewport,
// so nothing visible shifts. `render` is a function, not children, so the
// deferred subtree is not even constructed until it is needed.
// ============================================================
function DeferredSection({ minHeight, render }) {
  const [shown, setShown] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (shown) return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  if (shown) return render();
  return <div ref={ref} aria-hidden="true" style={{ minHeight }} />;
}

// ============================================================
// The index: what this site is, in four lines, directly under the lede. This
// is the section the old page never had. A first-time visitor arriving from a
// search result could not tell from the homepage that there is a map, a live
// bulletin, or a century of archive under it; they were discoverable only by
// scrolling past six sections or opening a dropdown.
//
// Counts come from the catalog, never from a constant that can drift. Note
// this section is NOT part of the static shell (the generator renders with an
// empty window.ARTICLES, so a live count would bake as zero), which is exactly
// why it sits below the hero rather than inside it.
//
// The archive entry is a real navigation: /archive/ is generated static HTML,
// not an SPA route, so it must never carry a go() handler.
// ============================================================
function HomeIndex({ go }) {
  const entries = window.ARTICLES.length;
  const sections = window.CATEGORIES.length;

  const items = [
    {
      key: "articles",
      num: "01",
      title: "The Journal",
      blurb: `${entries} entries across ${sections} sections, newest first.`,
      cta: "All entries →",
    },
    {
      key: "map",
      num: "02",
      title: "The Trip Map",
      blurb: "Every vista, trailhead, parking turnout, and meal, assembled into a route.",
      cta: "Open the map →",
    },
    {
      key: "now",
      num: "03",
      title: "The Park Bulletin",
      blurb: "Alerts, road status, free programs, and what is open, in the current edition.",
      cta: "Scan the bulletin →",
    },
    {
      href: "/archive/",
      num: "04",
      title: "The Archive",
      blurb: "512 issues of Yosemite Nature Notes, 1922 onward, transcribed.",
      cta: "Browse the archive →",
    },
  ];

  return (
    <section className="wrap home-index-wrap">
      <nav className="home-index" aria-label="What is on this site">
        {items.map((it) => {
          const track = () => {
            if (window.track) window.track("cta_click", { location: "home_index", target: it.key || "archive" });
          };
          const inner = (
            <React.Fragment>
              <span className="mono home-index__num">№ {it.num}</span>
              <span className="home-index__title">{it.title}</span>
              <span className="home-index__blurb">{it.blurb}</span>
              <span className="mono home-index__cta">{it.cta}</span>
            </React.Fragment>
          );
          // A real navigation for the generated archive pages; an SPA route for
          // everything else.
          return it.href ? (
            <a key={it.num} className="home-index__item" href={it.href} onClick={track}>{inner}</a>
          ) : (
            <a
              key={it.num}
              className="home-index__item"
              href={`/${it.key}`}
              onClick={(e) => { e.preventDefault(); track(); go(it.key); }}
            >{inner}</a>
          );
        })}
      </nav>
    </section>
  );
}

// ============================================================
// Resume band. Renders only when a recent article was left unfinished
// (tfg.read.last, written by the article page's progress tracker) and the
// piece still exists in the catalog. One quiet line at the top of the
// editorial column: the cheapest engagement win on the page is a returning
// reader with an open thread. Clicking sets the one-shot tfg.read.resume flag
// so the article page jumps back to the saved depth.
// ============================================================
const RESUME_MAX_AGE_DAYS = 30;

function ResumeReading({ go }) {
  const last = React.useMemo(() => (window.readHistory ? window.readHistory.last() : null), []);
  const article = last ? window.findArticle(last.slug) : null;
  const ageDays = last && last.at ? (Date.now() - new Date(last.at).getTime()) / 86400000 : 0;
  const show = Boolean(article) && ageDays < RESUME_MAX_AGE_DAYS;

  React.useEffect(() => {
    if (show && window.track) window.track("resume_shown", { slug: last.slug, percent: last.pct });
  }, [show]);

  if (!show) return null;

  // "About n min left" from the catalog's read estimate; falls back to the
  // saved depth when the estimate does not parse.
  const totalMin = parseInt(article.read, 10);
  const remaining = Number.isFinite(totalMin)
    ? `About ${Math.max(1, Math.round(totalMin * (100 - last.pct) / 100))} min left`
    : `${last.pct}% read`;

  return (
    <a
      className="resume-band"
      href={`/articles/${article.slug}`}
      onClick={(e) => {
        e.preventDefault();
        window.safeStorage.set("tfg.read.resume", article.slug);
        if (window.track) window.track("resume_click", { slug: article.slug, percent: last.pct });
        go(`a:${article.slug}`);
      }}
    >
      <span className="eyebrow eyebrow--moss">Where you left off</span>
      <span className="resume-band__title">{article.title}</span>
      <span className="resume-band__meta">{remaining}</span>
      <span className="mono resume-band__cta">Keep reading →</span>
    </a>
  );
}

// ============================================================
// Park Bulletin teaser, at the top of the editorial column. Recency is the
// proof a cold planner trusts, so the first thing under the index is the
// current edition, dated. Fails quiet: any fetch or shape problem and the band
// renders nothing.
// Keep the ?v= in sync with BULLETIN_URL in page-now.jsx when bulletin.json
// changes. The .home-dispatch class names carry over from the dispatch era.
// ============================================================
const HOME_BULLETIN_URL = "/bulletin.json?v=8";

function HomeBulletin({ go }) {
  const [edition, setEdition] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch(HOME_BULLETIN_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))))
      .then((data) => {
        const e = data && data.edition;
        if (!cancelled && e && e.label && e.lede) setEdition(e);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!edition) return null;

  // Same commitment as /now: an ended edition is never presented as current.
  // The band stays (it is the door to the bulletin, which carries its own
  // fuller note), but the dateline says so.
  const endDate = new Date(edition.end + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ended = !Number.isNaN(endDate.getTime()) && today > endDate;

  return (
    <a
      className="home-dispatch"
      href="/now"
      onClick={(e) => {
        e.preventDefault();
        if (window.track) window.track("cta_click", { location: "home_dispatch" });
        go("now");
      }}
    >
      <span className="home-dispatch__date">
        The Park Bulletin · covering {edition.label}
        {ended ? " · this edition has ended" : ""}
      </span>
      <span className="home-dispatch__title">One page, the whole park, right now</span>
      <p className="home-dispatch__excerpt">{edition.lede}</p>
      <span className="mono home-dispatch__cta">Scan the bulletin →</span>
    </a>
  );
}

// Question labels for the Start Here answers, keyed by START_HERE slug.
// Task-mode visitors click questions, not essay titles, so each entry leads
// with the question its article answers, in the visitor's words. A slug with
// no entry renders its title alone.
const START_HERE_QUESTIONS = {
  "first-time-yosemite-overwhelm": "First time, and it feels like a lot?",
  "yosemite-without-reservations-2026": "Do you need a reservation this year?",
  "yosemite-gateway-towns-compared": "Where should you actually stay?",
  "yosemite-in-one-or-two-days": "Only have a day or two?",
};

// ============================================================
// The rail. Every offer on the page, in one column, ordered by commitment: the
// paid Field Guide, the free Sunday letter, then lodging availability. It is
// sticky (styles.css) so it travels with the reader down the editorial column.
//
// One ask per offer, made once. The Field Guide had two pitches on the old page
// (hero card and Go Deeper band) and the newsletter had three (hero capture,
// map band, editor strip); the redundancy is what made the page feel like a
// storefront. Price is stated plainly per house style; the live number renders
// on /guide.
// ============================================================
function HomeRail({ go }) {
  return (
    <aside className="home-rail" aria-label="From The Talus Field">
      <a
        className="rail-guide"
        href="/guide"
        onClick={(e) => {
          e.preventDefault();
          if (window.track) window.track("guide_cta_click", { location: "home_rail" });
          go("guide");
        }}
      >
        <span className="rail-guide__eyebrow">The Field Guide · Offline app</span>
        {/* h3, matching the newsletter unit below: a screen reader skimming by
            headings has to find all three rail offers, not one of three. */}
        <h3 className="rail-guide__title">The park, in your pocket.</h3>
        <p className="rail-guide__body">
          57 hikes with parking and timing notes, offline maps, and the local tactics for every major region. Works with no signal, which is most of the park. One purchase, eighteen months of access.
        </p>
        <span className="mono rail-guide__cta">See the Field Guide · $3.99 →</span>
      </a>

      <NewsletterInline
        location="home_rail"
        tag="home"
        heading="The Sunday Letter"
        blurb="What is open, what is booking out, and what the week looked like from inside the park. The interactive trip planner map comes with it. Free."
        cta="Get the Sunday letter →"
        modifier="nlbox--rail"
      />

      <LodgingCta
        destination="Yosemite National Park"
        heading="The decision with a deadline"
        note="Inside the park there is one operator and one inventory, opening 366 days ahead. Outside it there are five gateway towns whose drive times to the Valley differ by more than an hour. Both are covered, honestly, on one page."
        list="page_home"
        slug="home"
        cta="See what is available on your dates →"
      />
    </aside>
  );
}

// ============================================================
// HOME
// ============================================================
function HomePage({ go }) {
  const recent = window.ARTICLES.slice(0, 3);
  const startHere = (window.START_HERE || [])
    .map(slug => window.findArticle(slug))
    .filter(Boolean);

  return (
    <div className="page">
      <HomeHero go={go} />

      <HomeIndex go={go} />

      {/* The body: editorial on the left, every offer on the right. */}
      <section className="wrap home-body">
        <div className="home-spine">
          <ResumeReading go={go} />
          <HomeBulletin go={go} />

          {/* Start Here — the answers block, framed as the questions everyone
              asks: task mode clicks questions, and the articles underneath do
              the depth conversion. */}
          {startHere.length > 0 && (
            <div id="start-here" style={{ scrollMarginTop: 24 }}>
              <div className="home-section__head">
                <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>For first-time visitors</div>
                <h2 className="home-section__title">Start here.</h2>
                <p className="home-section__dek">Four answers before you book anything.</p>
              </div>
              <div className="home-answers">
                {startHere.map(a => (
                  <a
                    key={a.slug}
                    className="home-answer"
                    href={`/articles/${a.slug}`}
                    onClick={(e) => { e.preventDefault(); go(`a:${a.slug}`); }}
                  >
                    {START_HERE_QUESTIONS[a.slug] && (
                      <span className="home-answer__q">{START_HERE_QUESTIONS[a.slug]}</span>
                    )}
                    <span className="home-answer__title">{a.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Latest entries. Text rows, not cards: the old six-card grid was
              the single most expensive thing on the page, and a homepage feed
              is a list of what is new, not a gallery. */}
          <div className="home-latest">
            <DeferredSection
              minHeight={560}
              render={() => (
                <div>
                  <div className="home-section__head home-section__head--row">
                    <h2 className="home-section__title">Latest Entries</h2>
                    <a
                      className="mono home-section__more"
                      href="/articles"
                      onClick={(e) => { e.preventDefault(); go("articles"); }}
                    >All {window.ARTICLES.length} entries →</a>
                  </div>
                  <div className="home-entries">
                    {recent.map(a => {
                      const cat = window.findCategory(a.cat);
                      return (
                        <a
                          key={a.slug}
                          className="home-entry"
                          href={`/articles/${a.slug}`}
                          onClick={(e) => { e.preventDefault(); go(`a:${a.slug}`); }}
                        >
                          <span className="eyebrow eyebrow--moss">{cat.label}</span>
                          <span className="home-entry__title">{a.title}</span>
                          <span className="home-entry__dek">{a.dek}</span>
                          <span className="mono home-entry__meta">
                            <span>{a.date}</span>
                            <span>{a.read}</span>
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        <HomeRail go={go} />
      </section>
    </div>
  );
}

window.HomePage = HomePage;
// Exported for scripts/gen-home-shell.mjs, which renders this component (and
// the masthead) into the static above-the-fold shell baked into index.html.
window.HomeHero = HomeHero;
