/* global React, Placeholder, MotifMountains */
const { useState: useStateK } = React;

function KitPage({ go }) {
  const kit = window.KIT;
  const [open, setOpen] = useStateK(kit.lists[0].slug);

  return (
    <div>
      {/* Page head */}
      <section className="wrap" style={{ paddingTop: 56, paddingBottom: 24 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 18 }}>Kit</div>
        <h1 className="display" style={{ fontSize: "clamp(46px, 6vw, 84px)", lineHeight: 0.98, marginBottom: 24, fontWeight: 500, letterSpacing: "-0.01em" }}>
          What I carry
        </h1>
        <p style={{ fontFamily: "var(--serif)", fontSize: 21, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: "62ch", textWrap: "pretty" }}>
          Three lists, plus a short page of places and people. The links go to the products themselves; some are affiliate links. The <a href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>disclosure page</a> explains the rules I keep.
        </p>
      </section>

      {/* Tab strip */}
      <section className="wrap" style={{ paddingTop: 24 }}>
        <div className="kit__tabs">
          {kit.lists.map((l) => (
            <button
              key={l.slug}
              className={`kit__tab ${open === l.slug ? "is-active" : ""}`}
              onClick={() => setOpen(l.slug)}
            >
              <span className="kit__tab-roman">{l.icon}</span>
              <span className="kit__tab-label">{l.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Active list */}
      {kit.lists.filter(l => l.slug === open).map((list) => (
        <section key={list.slug} className="wrap" style={{ paddingTop: 32, paddingBottom: 64 }}>
          <div className="kit__head">
            <div>
              <div className="kit__list-roman">{list.icon}</div>
              <h2 style={{ fontFamily: "var(--display)", fontSize: 44, fontWeight: 500, lineHeight: 1.05, margin: "8px 0 12px" }}>{list.title}</h2>
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-2)", fontSize: 18, maxWidth: "52ch" }}>{list.summary}</p>
            </div>
            <div className="kit__count">
              <span className="kit__count-num">{list.items.length}</span>
              <span className="kit__count-label">items</span>
            </div>
          </div>

          {list.image && (
            <div style={{ marginTop: 32 }}>
              <Placeholder
                caption={list.imageCaption}
                credit={list.imageCredit}
                image={list.image}
                tag={`PLATE ${list.icon}`}
                size="lg"
                style={{ aspectRatio: "16 / 9" }}
                motif={<MotifMountains />}
              />
            </div>
          )}

          <ol className="kit__list">
            {list.items.map((it, i) => (
              <li key={i} className="kit__item">
                <div className="kit__item-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="kit__item-body">
                  <div className="kit__item-name">{it.name}</div>
                  <div className="kit__item-note">{it.note}</div>
                </div>
                <div className="kit__item-link">
                  <a href={it.aff} target="_blank" rel="noopener nofollow sponsored noreferrer">View ↗</a>
                </div>
              </li>
            ))}
          </ol>

          {list.essay && (
            <aside className="kit__essay">
              <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The essay behind the list</div>
              <h3 style={{ fontFamily: "var(--display)", fontSize: 28, fontWeight: 500, lineHeight: 1.15, margin: "0 0 12px" }}>{list.essay.title}</h3>
              <p style={{ fontFamily: "var(--serif)", fontSize: 17, color: "var(--ink-2)", lineHeight: 1.55, margin: "0 0 16px", maxWidth: "60ch" }}>{list.essay.blurb}</p>
              <a
                className="btn btn--ghost"
                href={`/articles/${list.essay.slug}`}
                onClick={(e) => { e.preventDefault(); go(`a:${list.essay.slug}`); }}
              >Read the essay →</a>
            </aside>
          )}

          <div className="kit__disclosure">
            Some of the links above are affiliate links. <a href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>How that works.</a>
          </div>
        </section>
      ))}

      {/* Pointer to the standalone Directory page */}
      <section className="wrap" style={{ paddingTop: 56, paddingBottom: 80, borderTop: "1px solid var(--rule)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>Looking for lodging or a guide?</div>
            <h2 style={{ fontFamily: "var(--display)", fontSize: 32, fontWeight: 500, lineHeight: 1.1, margin: "0 0 12px" }}>The directory lives on its own page now.</h2>
            <p style={{ fontFamily: "var(--serif)", fontSize: 17, color: "var(--ink-2)", margin: 0, lineHeight: 1.5 }}>
              Lodges, inns, guiding services, and outfitters in and around Yosemite, moved into <a href="/places" onClick={(e) => { e.preventDefault(); go("places"); }}>The Directory</a> to keep this page about gear.
            </p>
          </div>
          <a
            className="btn"
            href="/places"
            onClick={(e) => { e.preventDefault(); go("places"); }}
          >Open the directory →</a>
        </div>
      </section>
    </div>
  );
}

window.KitPage = KitPage;
