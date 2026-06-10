/* global React */
const { useState: useStateF, useEffect: useEffectF, useRef: useRefF } = React;

// ============================================================
// Moving Pictures. The Yosemite Nature Notes film archive.
// Every film is embedded as a click-to-load facade: the page serves
// only the YouTube thumbnail (i.ytimg.com, covered by img-src) until
// the reader presses play, at which point the youtube-nocookie.com
// iframe replaces it. No YouTube script runs before that click.
// ============================================================

function FilmEmbed({ ep }) {
  const [playing, setPlaying] = useStateF(false);
  const frameRef = useRefF(null);

  // After the swap, move focus into the player so a keyboard user who
  // activated the facade button is not left focused on a removed element.
  useEffectF(() => {
    if (playing && frameRef.current) frameRef.current.focus();
  }, [playing]);

  if (playing) {
    return (
      <div className="film__frame">
        <iframe
          ref={frameRef}
          src={`https://www.youtube-nocookie.com/embed/${ep.youtubeId}?autoplay=1&rel=0`}
          title={`Yosemite Nature Notes: ${ep.title}`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="film__facade"
      aria-label={`Play film: ${ep.title}`}
      onClick={() => {
        if (window.track) window.track("film_play", { film_id: ep.id, film_title: ep.title });
        setPlaying(true);
      }}
    >
      {/* hqdefault is 4:3 with letterbox bars; the 16:9 facade crops them via object-fit. */}
      <img
        className="film__thumb"
        src={`https://i.ytimg.com/vi/${ep.youtubeId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
      <span className="film__play" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="56" height="56">
          <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M26 21 L46 32 L26 43 Z" fill="currentColor" />
        </svg>
      </span>
    </button>
  );
}

function FilmCard({ ep }) {
  return (
    <div className="film-card">
      <FilmEmbed ep={ep} />
      <div className="film-card__meta">
        <span>{ep.episode != null ? `Episode ${ep.episode}` : "Special"}</span>
        {ep.year && <span>{ep.year}</span>}
      </div>
      <div className="film-card__title">{ep.title}</div>
      <p className="film-card__dek">{ep.dek}</p>
    </div>
  );
}

function FilmsPage() {
  const nn = window.NATURE_NOTES;
  const byTheme = (themeId) =>
    nn.episodes
      .filter((ep) => ep.theme === themeId)
      .sort((a, b) => (a.episode == null ? 1 : 0) - (b.episode == null ? 1 : 0) || (a.episode || 0) - (b.episode || 0));
  const count = nn.episodes.length;

  return (
    <div>
      {/* Page head */}
      <section className="wrap" style={{ paddingTop: 56, paddingBottom: 24 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 18 }}>The Film Archive</div>
        <h1 className="display" style={{ fontSize: "clamp(46px, 6vw, 84px)", lineHeight: 0.98, marginBottom: 24, fontWeight: 500, letterSpacing: "-0.01em" }}>
          Moving pictures
        </h1>
        <p style={{ fontFamily: "var(--serif)", fontSize: 21, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: "62ch", textWrap: "pretty" }}>
          The National Park Service spent the better part of two decades producing a film
          series about this park, released it to the public, and barely told anyone.
          The complete run of Yosemite Nature Notes is archived below, {count} films grouped
          by subject. Most run under ten minutes. One of them is about the rock piles this
          journal is named for.
        </p>
      </section>

      {/* Provenance. The films are public-domain government work; the deks are ours. */}
      <section className="wrap" style={{ paddingBottom: 24 }}>
        <div className="films__credit">
          <p>
            Yosemite Nature Notes is produced by the National Park Service at Yosemite
            National Park. The films are works of the United States government and are in
            the public domain. The Talus Field is independent and is not affiliated with
            the National Park Service; the notes under each film are this journal's, not
            the Park Service's. The originals live at{" "}
            <a href={nn.series.npsUrl} target="_blank" rel="noopener noreferrer">nps.gov ↗</a>{" "}
            and on the park's{" "}
            <a href={nn.series.playlistUrl} target="_blank" rel="noopener noreferrer">YouTube channel ↗</a>.
            Nothing plays, and nothing loads from YouTube, until you press play.
          </p>
        </div>
      </section>

      {/* Theme sections */}
      {nn.themes.map((theme) => {
        const eps = byTheme(theme.id);
        if (!eps.length) return null;
        return (
          <section key={theme.id} className="wrap" style={{ paddingTop: 40, paddingBottom: 8 }}>
            <div className="section-head">
              <h2>{theme.title}</h2>
              <span className="film-section__count">{eps.length} {eps.length === 1 ? "film" : "films"}</span>
            </div>
            <p className="film-section__note">{theme.note}</p>
            <div className="film-grid">
              {eps.map((ep) => <FilmCard key={ep.id} ep={ep} />)}
            </div>
          </section>
        );
      })}

      {/* Closing note */}
      <section className="wrap" style={{ paddingTop: 40, paddingBottom: 72 }}>
        <div className="films__credit">
          <p>
            The series ran from 2009 to 2025 under producer Steven M. Bumgardner and a long
            roster of rangers, scientists, and historians. Your tax dollars paid for these
            films once already. Watching them is the closest thing to a free trip to the park.
          </p>
        </div>
      </section>
    </div>
  );
}

window.FilmsPage = FilmsPage;
