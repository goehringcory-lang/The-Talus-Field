/* global React */
const { useState: useStateK, useCallback: useCallbackK } = React;

// Ticked items persist here so a reader can plan over several sessions.
const KIT_STORAGE_KEY = "tfg.kit.checked";
const KIT_STORAGE_VERSION = 1;

// Checklist persistence via window.safeStorage (see storage.js); an
// unavailable storage falls back silently to in-memory state. We store only
// ticked ids, so items added to a list later default to unchecked with no
// migration.
function loadKitChecked() {
  const parsed = window.safeStorage.getJSON(KIT_STORAGE_KEY);
  if (!parsed || typeof parsed.ids !== "object" || parsed.ids === null) return {};
  const out = {};
  for (const k of Object.keys(parsed.ids)) {
    if (parsed.ids[k] === true) out[k] = true;
  }
  return out;
}

function saveKitChecked(ids) {
  window.safeStorage.setJSON(KIT_STORAGE_KEY, { v: KIT_STORAGE_VERSION, ids });
}

function KitPage({ go }) {
  const kit = window.KIT;
  const initialSlug = (() => {
    const h = (window.location.hash || "").replace(/^#/, "");
    const match = kit.lists.find(l => h.startsWith(l.slug));
    return match ? match.slug : kit.lists[0].slug;
  })();
  const [open, setOpen] = useStateK(initialSlug);
  const [checked, setChecked] = useStateK(loadKitChecked);

  const selectTab = (slug) => {
    setOpen(slug);
    history.replaceState({}, "", `/kit#${slug}`);
  };

  const toggle = useCallbackK((id) => {
    setChecked((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id]; else next[id] = true;
      saveKitChecked(next);
      return next;
    });
  }, []);

  // Dev-only: surface duplicate item ids (the localStorage keys) so a copied id
  // never silently shares a checkbox. No-op on production hosts.
  if (window.location.hostname === "localhost") {
    const seen = new Set();
    const dupes = [];
    kit.lists.forEach((l) => (l.groups || []).forEach((g) => (g.items || []).forEach((it) => {
      if (seen.has(it.id)) dupes.push(it.id); else seen.add(it.id);
    })));
    if (dupes.length) console.warn("KIT duplicate item ids:", dupes);
  }

  return (
    <div>
      <style>{`
        @media print {
          header, footer, .tweaks-panel, .kit__tabs, .kit__count { display: none !important; }
          body { background: #fff !important; color: #000 !important; }
          a { color: #000 !important; text-decoration: none !important; }
          .kit-group { page-break-inside: avoid; }
        }
      `}</style>

      {/* Page head */}
      <section className="wrap" style={{ paddingTop: 56, paddingBottom: 24 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 18 }}>Kit</div>
        <h1 className="display" style={{ fontSize: "clamp(46px, 6vw, 84px)", lineHeight: 0.98, marginBottom: 24, fontWeight: 500, letterSpacing: "-0.01em" }}>
          What to pack
        </h1>
        <p style={{ fontFamily: "var(--serif)", fontSize: 21, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: "62ch", textWrap: "pretty" }}>
          Three packing checklists for a Yosemite trip: a day pack, what an overnight adds to it, and the full car load. Tick items off as you plan and pack. Your progress is saved in this browser, so you can close the tab and come back to it. Press Cmd+P or Ctrl+P for a clean printable copy.
        </p>
      </section>

      {/* Tab strip */}
      <section className="wrap" style={{ paddingTop: 24 }}>
        <div className="kit__tabs">
          {kit.lists.map((l) => (
            <button
              key={l.slug}
              className={`kit__tab ${open === l.slug ? "is-active" : ""}`}
              onClick={() => selectTab(l.slug)}
            >
              <span className="kit__tab-roman">{l.icon}</span>
              <span className="kit__tab-label">{l.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Active list */}
      {kit.lists.filter(l => l.slug === open).map((list) => {
        const flat = (list.groups || []).flatMap((g) => g.items || []);
        const total = flat.length;
        const done = flat.reduce((n, it) => n + (checked[it.id] ? 1 : 0), 0);
        const resetList = () => {
          setChecked((prev) => {
            const next = { ...prev };
            flat.forEach((it) => { delete next[it.id]; });
            saveKitChecked(next);
            return next;
          });
        };
        return (
          <section key={list.slug} className="wrap" style={{ paddingTop: 32, paddingBottom: 64 }}>
            <div className="kit__head">
              <div>
                <div className="kit__list-roman">{list.icon}</div>
                <h2 style={{ fontFamily: "var(--display)", fontSize: 44, fontWeight: 500, lineHeight: 1.05, margin: "8px 0 12px" }}>{list.title}</h2>
                <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ink-2)", fontSize: 18, maxWidth: "52ch" }}>{list.summary}</p>
              </div>
              <div className="kit__count">
                <span className="kit__count-num">{done}</span>
                <span className="kit__count-label">of {total} packed</span>
                {done > 0 && (
                  <button type="button" className="kit-reset" onClick={resetList}>Uncheck all</button>
                )}
              </div>
            </div>

            {(list.groups || []).filter((g) => (g.items || []).length > 0).map((group) => (
              <section key={group.id} className="kit-group">
                <h3 className="kit-group__title">{group.title}</h3>
                <ul className="kit-group__list">
                  {group.items.map((it) => (
                    <li key={it.id} id={it.id.replace(/:/g, "-")} className={`kit-check ${it.link ? "kit-check--callout" : ""}`}>
                      <label className="kit-check__row">
                        <input
                          type="checkbox"
                          className="kit-check__box"
                          checked={!!checked[it.id]}
                          onChange={() => toggle(it.id)}
                        />
                        <span className="kit-check__text">
                          <span className="kit-check__name">{it.name}</span>
                          {it.note && <span className="kit-check__note">{it.note}</span>}
                        </span>
                      </label>
                      {(it.link || it.articleSlug) && (
                        <div className="kit-check__links">
                          {it.link && (
                            <a
                              className="kit-check__link"
                              href={it.link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >{it.link.label} ↗</a>
                          )}
                          {it.articleSlug && (
                            <a
                              className="kit-check__article"
                              href={`/articles/${it.articleSlug}`}
                              onClick={(e) => { e.preventDefault(); go(`a:${it.articleSlug}`); }}
                            >Read the piece →</a>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

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
          </section>
        );
      })}

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
