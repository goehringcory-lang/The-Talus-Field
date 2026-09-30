/* global React, HpPageHead, HpGuideBand, HpLetter */

// ============================================================
// Moving Pictures. The Yosemite Nature Notes film archive.
//
// The September 2026 theater redesign: one large screen near the top of
// the page, a subject selector with a strip of small thumbnails under it,
// and the full archive by subject below. Choosing any film (a thumbnail or
// a card) puts it on the screen and starts it. Nothing is fetched from
// YouTube but thumbnails (i.ytimg.com, covered by img-src) until the
// reader presses play or picks a film, at which point the
// youtube-nocookie.com iframe replaces the still. No YouTube script runs
// before that click.
// ============================================================

const { useState: useFilmsState, useRef: useFilmsRef, useEffect: useFilmsEffect } = React;

// The film on the screen when the page opens: the one this journal is
// named for, and the page head says so.
const FILMS_START_ID = "rock-fall";

// Short labels for the selector buttons, keyed by theme id. The section
// headings keep the full theme titles from videos-data.js.
const FILMS_THEME_SHORT = {
  granite: "Granite",
  water: "Water",
  winter: "Winter",
  "after-dark": "After dark",
  forest: "Forest",
  wildlife: "Wildlife",
  people: "People",
};

function filmsPad(n) { return n < 10 ? `0${n}` : String(n); }
function filmsTag(ep) { return ep.episode == null ? "SPECIAL" : `EP. ${filmsPad(ep.episode)}`; }
function filmsSorted(eps) {
  return eps.slice().sort((a, b) =>
    (a.episode == null ? 1 : 0) - (b.episode == null ? 1 : 0) || (a.episode || 0) - (b.episode || 0));
}
function filmsThumb(ep) { return `https://i.ytimg.com/vi/${ep.youtubeId}/hqdefault.jpg`; }

function FilmsPlayGlyph({ size }) {
  return (
    <svg viewBox="0 0 12 14" width={size} height={Math.round(size * 14 / 12)} fill="currentColor" aria-hidden="true">
      <path d="M1.5 0 L12 7 L1.5 14 Z" />
    </svg>
  );
}

// The screen. A still with a play button until the reader presses it, then
// the youtube-nocookie iframe. The still asks for maxresdefault (sharp at
// this size) and falls back to hqdefault for the uploads that have none.
function FilmsTheater({ ep, themeTitle, playing, onPlay, screenRef }) {
  const frameRef = useFilmsRef(null);
  useFilmsEffect(() => {
    if (playing && frameRef.current) frameRef.current.focus({ preventScroll: true });
  }, [playing, ep.id]);

  const kicker = `${ep.episode == null ? "SPECIAL" : `EPISODE ${ep.episode}`} / ${themeTitle.toUpperCase()}`;
  return (
    <section className="hp-films__theater" id="feature" ref={screenRef} tabIndex={-1} aria-label="Now showing">
      <div className="hp-films__stage">
        {playing ? (
          <div className="hp-films__screen hp-films__screen--live">
            <iframe
              key={ep.id}
              ref={frameRef}
              src={`https://www.youtube-nocookie.com/embed/${ep.youtubeId}?autoplay=1&rel=0`}
              title={`Yosemite Nature Notes: ${ep.title}`}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <button type="button" className="hp-films__screen" aria-label={`Play film: ${ep.title}`} onClick={onPlay}>
            <img
              key={ep.id}
              src={`https://i.ytimg.com/vi/${ep.youtubeId}/maxresdefault.jpg`}
              alt=""
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.dataset.fallback) return;
                img.dataset.fallback = "1";
                img.src = filmsThumb(ep);
              }}
            />
            <span className="hp-films__shade" aria-hidden="true" />
            <span className="hp-films__bigplay" aria-hidden="true"><FilmsPlayGlyph size={28} /></span>
            <span className="hp-films__badge">{ep.id === FILMS_START_ID ? "START HERE" : "NOW SHOWING"}</span>
          </button>
        )}
        <div className="hp-films__caption">
          <div>
            <p className="hp-films__kicker">{kicker}</p>
            <h2 className="hp-films__now">{ep.title}</h2>
            <p className="hp-films__nowdek">{ep.dek}</p>
          </div>
          <p className="hp-films__rights">
            <span>Film: National Park Service, public domain</span>
            <span>Nothing loads from YouTube until you press play</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function FilmCard({ ep, onPick }) {
  return (
    <button type="button" className="hp-films__card" onClick={() => onPick(ep, "grid")} aria-label={`Play film: ${ep.title}`}>
      <span className="hp-films__thumb">
        <img src={filmsThumb(ep)} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
        <span className="hp-films__tag">{filmsTag(ep)}</span>
        <span className="hp-films__play" aria-hidden="true"><FilmsPlayGlyph size={12} /></span>
      </span>
      <span className="hp-films__meta">
        <span>{ep.episode == null ? "SPECIAL" : `EPISODE ${ep.episode}`}</span>
        {ep.year && <span>{ep.year}</span>}
      </span>
      <span className="hp-films__title">{ep.title}</span>
      <span className="hp-films__dek">{ep.dek}</span>
    </button>
  );
}

function FilmsPage({ go }) {
  const nn = window.NATURE_NOTES;
  const count = nn.episodes.length;
  const themeTitle = {};
  nn.themes.forEach((t) => { themeTitle[t.id] = t.title; });
  const byTheme = (id) => filmsSorted(nn.episodes.filter((ep) => ep.theme === id));

  const [theme, setTheme] = useFilmsState("all");
  const [filmId, setFilmId] = useFilmsState(FILMS_START_ID);
  const [playing, setPlaying] = useFilmsState(false);
  const screenRef = useFilmsRef(null);

  const current = nn.episodes.find((ep) => ep.id === filmId) || nn.episodes[0];
  const track = (ep, surface) => {
    if (window.track) window.track("film_play", { film_id: ep.id, film_title: ep.title, location: "films", surface });
  };

  // Choosing a film is the click that plays it: put it on the screen,
  // start it, and bring the screen into view.
  const pick = (ep, surface) => {
    track(ep, surface);
    setFilmId(ep.id);
    setPlaying(true);
    const el = screenRef.current;
    if (el) {
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  };

  const chips = [{ id: "all", label: "All films", n: count }].concat(
    nn.themes.map((t) => ({ id: t.id, label: FILMS_THEME_SHORT[t.id] || t.title, n: byTheme(t.id).length }))
  );
  const strip = theme === "all"
    ? nn.themes.reduce((acc, t) => acc.concat(byTheme(t.id)), [])
    : byTheme(theme);
  const stripLabel = theme === "all"
    ? `All ${count} films, by subject`
    : `${themeTitle[theme]}, ${strip.length} ${strip.length === 1 ? "film" : "films"}`;
  const shown = nn.themes
    .map((t, i) => ({ t, i }))
    .filter((x) => theme === "all" || x.t.id === theme);

  const jump = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="page hp-films">
      <HpPageHead
        go={go}
        className="hp-films__head"
        crumbs={[{ label: "Home", route: "home" }, { label: "Read", route: "articles" }, { label: "Films" }]}
        eyebrow="THE FILM ARCHIVE / YOSEMITE NATURE NOTES"
        title={<React.Fragment>Moving <em>pictures</em></React.Fragment>}
        aside={
          <div className="hp-films__lede">
            <p className="hp-films__intro">
              The National Park Service spent the better part of two decades producing a film series
              about this park, released it to the public, and barely told anyone. The complete run of
              Yosemite Nature Notes is below: {count} films, grouped by subject. Most run under ten minutes.
            </p>
            <p className="hp-films__intro hp-films__intro--quiet">
              The films borrowed their name from something older. From 1922 the park's naturalists
              mailed out a bulletin by the same name, and all 512 issues are transcribed in{" "}
              {/* Static pages under /archive, outside the SPA: a plain link, no go(). */}
              <a className="hp-inline" href="/archive/">the print archive</a>.
            </p>
            <a className="hp-link" href="#subjects" onClick={(e) => jump(e, "subjects")}>Browse the seven subjects</a>
          </div>
        }
      />

      <FilmsTheater
        ep={current}
        themeTitle={themeTitle[current.theme] || ""}
        playing={playing}
        screenRef={screenRef}
        onPlay={() => { track(current, "theater"); setPlaying(true); }}
      />

      {/* Selector and strip: pick a subject, pick a film, it plays above. */}
      <section className="hp-films__picker" id="subjects" tabIndex={-1}>
        <div className="hp-wrap">
          <div className="hp-films__chips" role="group" aria-label="Filter films by subject">
            <span className="hp-films__chiplabel">BY SUBJECT</span>
            {chips.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`hp-films__chip${theme === c.id ? " is-on" : ""}`}
                aria-pressed={theme === c.id}
                onClick={() => setTheme(c.id)}
              >
                {c.label}<span>{c.n}</span>
              </button>
            ))}
          </div>
          <div className="hp-films__striphead">
            <span>{stripLabel}</span>
            <small>Choose a film to put it on the screen</small>
          </div>
          <div className="hp-films__strip">
            {strip.map((ep) => {
              const on = ep.id === current.id;
              return (
                <button
                  key={ep.id}
                  type="button"
                  className={`hp-films__mini${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  aria-label={`Play film: ${ep.title}`}
                  onClick={() => pick(ep, "strip")}
                >
                  <span className="hp-films__minithumb">
                    <img src={filmsThumb(ep)} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                    <span className="hp-films__minitag">{filmsTag(ep)}</span>
                    {on && <span className="hp-films__nowtag">NOW SHOWING</span>}
                  </span>
                  <span className="hp-films__minititle">{ep.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="hp-wrap">
        <dl className="hp-films__facts">
          <div><dt>Films</dt><dd>{count}, in seven subjects</dd></div>
          <div><dt>The run</dt><dd>2009 to 2025</dd></div>
          <div><dt>Length</dt><dd>Most under ten minutes</dd></div>
          <div><dt>Rights</dt><dd>Public domain</dd></div>
        </dl>
      </div>

      {shown.map(({ t, i }, k) => {
        const eps = byTheme(t.id);
        if (!eps.length) return null;
        const nums = eps.filter((ep) => ep.episode != null).map((ep) => ep.episode);
        return (
          <section key={t.id} className={`hp-films__theme${k % 2 ? " is-tint" : ""}`}>
            <div className="hp-wrap">
              <div className="hp-films__themehead">
                <div>
                  <p className="hp-eyebrow">{filmsPad(i + 1)} / {eps.length} {eps.length === 1 ? "FILM" : "FILMS"}</p>
                  <h2>{t.title}</h2>
                  <p className="hp-films__note">{t.note}</p>
                </div>
                {nums.length > 1 && (
                  <span className="hp-films__range">Episodes {Math.min(...nums)} to {Math.max(...nums)}</span>
                )}
              </div>
              <div className="hp-films__grid">
                {eps.map((ep) => <FilmCard key={ep.id} ep={ep} onPick={pick} />)}
              </div>
            </div>
          </section>
        );
      })}

      {/* Provenance. The films are public-domain government work; the deks are ours. */}
      <section className="hp-films__source">
        <div className="hp-wrap hp-films__two">
          <div>
            <p className="hp-eyebrow">WHERE THESE COME FROM</p>
            <h2>Made by the park, <em>paid for once</em></h2>
            <p className="hp-films__body">
              The series ran from 2009 to 2025 under producer Steven M. Bumgardner and a long roster of
              rangers, scientists, and historians. Your tax dollars paid for these films once already.
              Watching them is the closest thing to a free trip to the park.
            </p>
            <p className="hp-films__fine">
              Yosemite Nature Notes is produced by the National Park Service at Yosemite National Park.
              The films are works of the United States government and are in the public domain. The
              Talus Field is independent and is not affiliated with the National Park Service; the notes
              under each film are this journal's, not the Park Service's.
            </p>
            <div className="hp-films__links">
              <a className="hp-link" href={nn.series.npsUrl} target="_blank" rel="noopener noreferrer">The originals at nps.gov ↗</a>
              <a className="hp-link" href={nn.series.playlistUrl} target="_blank" rel="noopener noreferrer">The park's YouTube channel ↗</a>
            </div>
          </div>
          {/* Static pages under /archive, outside the SPA: a plain link, no go(). */}
          <a className="hp-films__archive" href="/archive/">
            <span>
              <span className="hp-films__archivekicker">THE PRINT ARCHIVE / 1922 ONWARD</span>
              <span className="hp-films__archivetitle">Before the films, a bulletin</span>
              <span className="hp-films__archivebody">
                From 1922 into the 1980s the park's naturalists mailed out a bulletin called Yosemite
                Nature Notes. All 512 issues are transcribed here, about 1.87 million words.
              </span>
            </span>
            <b>Read the archive <span>→</span></b>
          </a>
        </div>
      </section>

      {/* The one Field Guide ask on this page: the guide quotes the print
          bulletins at the stops they describe. */}
      <HpGuideBand
        go={go}
        location="films"
        title={<React.Fragment>The bulletins, <em>at the stop they describe</em></React.Fragment>}
        intro="The Field Guide quotes the print Nature Notes at the places they were written about, and it works with no signal."
      />

      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="Sunday Field Notes"
        heading="Sunday Field Notes"
        blurb="One Yosemite email a week. Notes on the park worth reading alongside the films."
        location="films"
        tag="films"
      />
    </div>
  );
}

window.FilmsPage = FilmsPage;
