/* global React, HpPageHead, HpHeading, HpLetter, FilmEmbed */

// ============================================================
// Moving Pictures. The Yosemite Nature Notes film archive.
// Every film is embedded as a click-to-load facade: the page serves
// only the YouTube thumbnail (i.ytimg.com, covered by img-src) until
// the reader presses play, at which point the youtube-nocookie.com
// iframe replaces it. No YouTube script runs before that click.
// ============================================================

// FilmEmbed (the click-to-load facade) lives in components.jsx since the
// September 2026 visual pass, so event pages and article bodies can embed
// one film with the same no-script-before-play behaviour.

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

function FilmsPage({ go }) {
  const nn = window.NATURE_NOTES;
  const byTheme = (themeId) =>
    nn.episodes
      .filter((ep) => ep.theme === themeId)
      .sort((a, b) => (a.episode == null ? 1 : 0) - (b.episode == null ? 1 : 0) || (a.episode || 0) - (b.episode || 0));
  const count = nn.episodes.length;

  return (
    <div className="page hp-films">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Films" }]}
        eyebrow="THE FILM ARCHIVE"
        title="Moving pictures"
        intro={`The National Park Service spent the better part of two decades producing a film series about this park, released it to the public, and barely told anyone. The complete run of Yosemite Nature Notes is archived below, ${count} films grouped by subject. Most run under ten minutes. One of them is about the rock piles this journal is named for.`}
        aside={
          /* Provenance. The films are public-domain government work; the deks are ours. */
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
        }
      >
        <p className="hp-intro">
          The films borrowed their name from something older. From 1922 into the 1980s the
          park's naturalists mailed out a bulletin called Yosemite Nature Notes, and all 512
          issues of it are transcribed in{" "}
          {/* Static pages under /archive, outside the SPA: a plain link, no go(). */}
          <a className="hp-inline" href="/archive/">the print archive</a>.
        </p>
      </HpPageHead>

      {/* Theme sections */}
      {nn.themes.map((theme) => {
        const eps = byTheme(theme.id);
        if (!eps.length) return null;
        return (
          <section key={theme.id} className="hp-wrap hp-section hp-films__theme">
            <HpHeading eyebrow={`${eps.length} ${eps.length === 1 ? "FILM" : "FILMS"}`} title={theme.title} />
            <p className="hp-sub">{theme.note}</p>
            <div className="film-grid">
              {eps.map((ep) => <FilmCard key={ep.id} ep={ep} />)}
            </div>
          </section>
        );
      })}

      {/* Closing note */}
      <section className="hp-wrap hp-films__close">
        <div className="films__credit">
          <p>
            The series ran from 2009 to 2025 under producer Steven M. Bumgardner and a long
            roster of rangers, scientists, and historians. Your tax dollars paid for these
            films once already. Watching them is the closest thing to a free trip to the park.
          </p>
          {/* The one Field Guide line on this page, in the archive's own words
              (askBlock in gen-archive.mjs): the guide quotes the print bulletins
              at the stops they describe. No count, so nothing here can drift. */}
          <p>
            <a
              className="hp-inline"
              href="/guide"
              onClick={(e) => { e.preventDefault(); if (window.track) window.track("guide_cta_click", { location: "films_close" }); go("guide"); }}
            >The Field Guide</a>{" "}
            quotes the print bulletins at the places they describe, offline, at the stop.
          </p>
        </div>
      </section>

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
