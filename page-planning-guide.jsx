/* global React, LodgingCta, ResponsiveImage, HomeLink, HpPageHead, HpHeading, HpRow, HpArticleCard, HpGuideBand, HpLetter */

// =============================================================================
// THE PLANNING GUIDE — `/planning`.
//
// Two modes on one page. By default it reads as the curated five-part guide it
// has always been. The moment the reader answers the trip selector, touches a
// filter chip, or asks for every entry, it becomes a decision tool: the parts
// give way to the entries that match, drawn from the WHOLE catalog rather than
// the twenty-one pieces the parts curate, because a reader who filters for
// "camping" wants the camping guide whether or not it earned a slot in the
// curation.
//
// "Every entry" is the third of those doors and the one that makes this page
// reach the whole site. The parts curate a third of the catalog and a chip can
// only find an article that carries that tag, so the remaining entries, and the
// one piece that carries no tag in any facet by design, had no path from here
// that did not involve guessing. scripts/check-intent-tags.mjs asserts that the
// browse list is the whole catalog and that nothing else on this page is
// quietly holding entries back.
//
// The five curated parts below own the copy (eyebrow, title, lede, columns) but
// NOT the membership: the slugs come from window.PLANNING_SERIES in data.js,
// which the article pages already read to draw their "part of the Planning
// Guide" series band. One list, so the page and the band cannot disagree about
// what is in Part Three.
//
// The selector and filters live in intent.jsx / intent-data.js, loaded with this
// bundle by PAGE_MODULES.
//
// Since September 2026 the page is built on the homepage's design system
// (the Hp* components in components.jsx): the head carries the five parts as its
// index, each part is a design section, the catalog renders as journal cards,
// and the closing asks are the shared Field Guide band and letter.
// =============================================================================

const { useState: useStatePg, useRef: useRefPg, useEffect: useEffectPg } = React;

const PLANNING_PARTS = [
  {
    part: "Part One · Before you book",
    eyebrow: "Part One",
    title: "Before you book",
    cols: 2,
    lodging: true,
    lede: "The decisions you make from your kitchen table, before the trip starts, are the ones that shape the whole experience. When you visit, where you base, whether the park is in smoke season, whether you have internalized that 2026 is different. Read these four before you put money down.",
  },
  {
    part: "Part Two · Getting there and getting in",
    eyebrow: "Part Two",
    title: "Getting there and getting in",
    cols: 2,
    lede: "Five entrances, four highways, one seasonal pass that does not exist half the year, three parking lots that decide how the day goes, two bus systems that make the lots optional, and a permit system guarding the 95 percent of the park most visitors never see. The logistics of arrival, and the paperwork for going deeper.",
  },
  {
    part: "Part Three · When you arrive",
    eyebrow: "Part Three",
    title: "When you arrive",
    cols: 3,
    lede: "What is in the car, who you are traveling with, whether everyone in your group can hike, and what you can still get today if you arrived with nothing booked. The pragmatic decisions that make a Yosemite day flow or stall. The cooler, the camp chair, the Junior Ranger booklet, the bridge view from a wheelchair, the dog.",
  },
  {
    part: "Part Four · If you're hiking Half Dome",
    eyebrow: "Part Four",
    title: "If you're hiking Half Dome",
    cols: 3,
    lede: "Half Dome is on every Yosemite list. It also requires a permit lottery that most applicants do not win, and the standard approach is the Mist Trail, the most-hiked and most-injured trail in any national park. Three pieces on what the cables, the lottery, and the wet granite actually demand, and the better hike most visitors do not know about.",
  },
  {
    part: "Part Five · The seasonal calendar",
    eyebrow: "Part Five",
    title: "The seasonal calendar",
    cols: 3,
    lede: "Yosemite has at least four seasons inside any given summer. Tioga Road opens, Glacier Point opens, the waterfalls peak and then dry, smoke comes in from somewhere else, and the Milky Way arrives. Knowing what is open and when changes the trip entirely.",
  },
];

function planningPartSlugs(partLabel) {
  const entry = (window.PLANNING_SERIES || []).find((s) => s.part === partLabel);
  return entry ? entry.slugs : [];
}

function PlanningGuide({ go }) {
  const filters = window.useIntentFilters();
  const resultsRef = useRefPg(null);
  const [jumped, setJumped] = useStatePg(false);

  const matches = window.filterArticlesByIntent(window.ARTICLES, filters.value);
  const filtering = filters.count > 0;
  // Two ways to reach the list. A chip narrows the archive; "Every entry" opens
  // it. The second one exists because the first cannot reach everything: the
  // parts curate twenty-one of sixty-seven entries, a chip only finds an article
  // that carries that tag, and one piece carries no tag in any facet on purpose
  // (INTENT_NO_TAGS). Without a way to just list the archive, the rest of it was
  // reachable from this page only by guessing the combination that surfaces it.
  const listing = filtering || filters.browse;

  // A hand-off from the trip selector ("show all N entries that fit this trip")
  // sets the filters and then has to move the reader to the results, which are
  // a screen and a half further down.
  useEffectPg(() => {
    if (!jumped) return;
    setJumped(false);
    // CSS scroll-behavior does not reach an explicit JS option, so honor the
    // preference by hand (same guard as page-article.jsx).
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [jumped]);

  const applyIntent = (intent) => {
    filters.apply(intent);
    setJumped(true);
  };

  // The index in the head is always on screen, including while the list is
  // showing, when the parts are not rendered. A jump from there clears the
  // filters first and scrolls once the guide is back.
  const [pendingPart, setPendingPart] = useStatePg(null);
  useEffectPg(() => {
    if (pendingPart == null || listing) return;
    const el = document.getElementById(`part-${pendingPart}`);
    setPendingPart(null);
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
  }, [pendingPart, listing]);
  const jumpToPart = (n) => (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (window.track) window.track("cta_click", { location: "planning_index", target: `#part-${n}` });
    if (listing) filters.clear();
    setPendingPart(n);
  };

  return (
    <div className="page hp-design hp-planning">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "The Planning Guide" }]}
        eyebrow="THE PLANNING GUIDE"
        title={<>Yosemite,<br />planned <em>properly.</em></>}
        intro="The questions that come up before, during, and after a Yosemite trip, answered in the order most visitors actually run into them. Drawn from the full archive of The Talus Field, organized to read like a guide rather than a search result."
        actions={<>
          <HomeLink go={go} location="planning_hero" className="hp-button" href="#trip-selector">Build a plan for your trip &nbsp; ↓</HomeLink>
          <a className="hp-link" href="#part-1" onClick={jumpToPart(1)}>Read the guide in order ↓</a>
        </>}
        byline="Planning advice from inside the park, checked on foot."
        aside={
          /* The index. The five parts run a screen and a half each, so a reader
             who came for Part Four had to scroll past three parts to find it.
             Counts are read from PLANNING_SERIES like everything else on this
             page: the parts own their copy, never their membership. This adds
             links rather than replacing them: the full card sections stay
             below, because they are most of the contextual internal linking
             this page does. */
          <nav className="hp-list hp-partindex" aria-label="The five parts">
            {PLANNING_PARTS.map((p, i) => {
              const slugs = planningPartSlugs(p.part);
              const lead = slugs.map((s) => window.findArticle(s)).find((a) => a && a.image);
              const n = slugs.length;
              return (
                <a key={p.part} className="hp-row" href={`#part-${i + 1}`} onClick={jumpToPart(i + 1)}>
                  {lead ? <ResponsiveImage image={lead.image} alt="" sizes="136px" /> : <span className="hp-row__blank" aria-hidden="true" />}
                  <div>
                    <p className="hp-eyebrow">{String(i + 1).padStart(2, "0")} / {p.eyebrow.toUpperCase()}</p>
                    <h3>{p.title}</h3>
                    <b>{n} {n === 1 ? "entry" : "entries"} <span>↓</span></b>
                  </div>
                </a>
              );
            })}
          </nav>
        }
      />

      <section className="hp-wrap hp-section hp-planning__selector" id="trip-selector" tabIndex={-1}>
        <window.TripSelector go={go} onApplyIntent={applyIntent} />
      </section>

      <section className="hp-wrap hp-planning__filters" ref={resultsRef}>
        <window.IntentFilters
          articles={window.ARTICLES}
          value={filters.value}
          onToggle={filters.toggle}
          onClear={filters.clear}
          onClearMonth={filters.clearMonth}
          onToggleBrowse={filters.toggleBrowse}
          browse={filters.browse}
          count={filters.count}
          resultCount={matches.length}
          note="Drawn from the whole archive, not only the five parts below."
        />
      </section>

      {listing ? (
        <section className="hp-wrap hp-section hp-planning__results">
          {matches.length > 0 ? (
            <div className="hp-journal-grid">
              {matches.map((a) => <HpArticleCard key={a.slug} article={a} go={go} location="planning_list" />)}
            </div>
          ) : (
            <p className="hp-sub hp-planning__empty">
              Nothing in the archive carries all of those at once
              {window.intentMonthOf(filters.value)
                ? `, in ${window.intentMonthLabel(window.intentMonthOf(filters.value))}`
                : ""}
              . Drop a filter and try again, or{" "}
              <a href="/search" onClick={(e) => { e.preventDefault(); go("search"); }}>search the whole site</a>.
            </p>
          )}
          <p className="hp-planning__back">
            <button type="button" className="hp-link" onClick={filters.clear}>
              {filtering ? "Clear the filters to read the guide in order ↑" : "Back to the five-part guide ↑"}
            </button>
          </p>
        </section>
      ) : (
        <>
          <div className="hp-wrap hp-planning__lead">
            <p>
              Yosemite in 2026 is a different park from Yosemite in 2024. The entrance reservation system is gone, the crowds are heavier, the gateway towns matter more, and the difference between a great trip and a frustrating one is almost always strategy, not luck. Here is the strategy, in five parts.
            </p>
          </div>

          {PLANNING_PARTS.map((p, i) => {
            const items = planningPartSlugs(p.part).map((s) => window.findArticle(s)).filter(Boolean);
            return (
              <section key={p.part} id={`part-${i + 1}`} tabIndex={-1} className="hp-wrap hp-section hp-part">
                <HpHeading eyebrow={`${String(i + 1).padStart(2, "0")} / ${p.eyebrow.toUpperCase()}`} title={p.title} />
                <p className="hp-sub">{p.lede}</p>
                <div className={`hp-journal-grid${p.cols === 2 ? " hp-journal-grid--2" : ""}`}>
                  {items.map((a) => <HpArticleCard key={a.slug} article={a} go={go} location="planning_part" />)}
                </div>

                {/* "Before you book" is the one part of this guide with an actual
                    deadline attached, so the lodging board and a live availability
                    search belong here rather than at the end. */}
                {p.lodging && (
                  <div className="hp-part__lodging">
                    <LodgingCta
                      destination="Yosemite National Park"
                      heading="The booking with the earliest deadline"
                      note="In-park beds open 366 days ahead and gateway rooms fill six to twelve months out for summer dates. Everything else in this guide flexes; this one does not, which is why it belongs in Part One."
                      list="page_planning"
                      slug="planning"
                      cta="See what is available on your dates →"
                    />
                  </div>
                )}
              </section>
            );
          })}

          {/* Closing */}
          <section className="hp-wrap hp-section hp-planning__takeaway">
            <HpHeading go={go} location="planning_hub" eyebrow="THE TAKEAWAY" title="Strategy beats research." link={{ href: "/articles", label: "Browse all entries ↗" }} />
            <p className="hp-sub">
              Almost every "Yosemite was crowded and frustrating" story comes from a trip that was not planned around the park's actual rhythms. The articles above are how this site closes that gap. Read what is relevant. Skip what is not. Then pack the car.
            </p>
          </section>

          {/* The purchase ask: a reader who finished the hub has a trip. The app
              is the in-park half of the same advice. Paid first, free second,
              in the homepage's order. */}
          <HpGuideBand
            go={go}
            location="planning_hub"
            title="Reading is planning. This is the trip."
            intro="The Field Guide app carries the same advice into the park: 50-plus stops with parking and timing notes, offline maps, a day-by-day planner, and the secret guide. Works with no signal, which is most of the park."
            sample
          />
          <HpLetter
            eyebrow="ONE YOSEMITE EMAIL A WEEK"
            title="Get the conditions before you go"
            heading="Get the conditions before you go"
            blurb="Reservation windows, road openings, what's booked out: one Yosemite email a week while you plan. Free."
            location="planning_hub"
            tag="planning"
          />
        </>
      )}
    </div>
  );
}

window.PlanningGuide = PlanningGuide;
