/* global React, ResponsiveImage, HpPageHead, HpGuideBand, HpLetter */
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
      window.track("kit_item_toggle", { item_id: id, checked: !!next[id] });
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
    <div className="page hp-kit">
      <style>{`
        @media print {
          header, footer, .hp-navigation, .hp-product, .hp-letter, .kit__tabs, .kit__count, .kit__photo { display: none !important; }
          body { background: #fff !important; color: #000 !important; }
          a { color: #000 !important; text-decoration: none !important; }
          .kit-group { page-break-inside: avoid; }
        }
      `}</style>

      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Kit" }]}
        eyebrow="KIT"
        title="What to pack"
        intro="Three packing checklists for a Yosemite trip: a day pack, what an overnight adds to it, and the full car load. Tick items off as you plan and pack. Your progress is saved in this browser, so you can close the tab and come back to it. Press Cmd+P or Ctrl+P for a clean printable copy."
      >
        <p className="hp-byline kit__aff-note">
          Some gear here links to Patagonia through an affiliate link, marked with a star. If you buy through it, the site may earn a small commission at no extra cost to you. See the <a className="hp-inline" href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>Affiliate Disclosure</a>.
        </p>
      </HpPageHead>

      {/* Tab strip */}
      <section className="hp-wrap hp-kit__tabs">
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
          <section key={list.slug} className="hp-wrap hp-kit__list">
            <div className="kit__head">
              <div>
                <div className="kit__list-roman">{list.icon}</div>
                <h2 className="kit__title">{list.title}</h2>
                <p className="hp-sub kit__summary">{list.summary}</p>
              </div>
              <div className="kit__count">
                <span className="kit__count-num">{done}</span>
                <span className="kit__count-label">of {total} packed</span>
                {done > 0 && (
                  <button type="button" className="kit-reset" onClick={resetList}>Uncheck all</button>
                )}
              </div>
            </div>

            {list.photo && (
              <figure className="kit__photo">
                <ResponsiveImage
                  image={list.photo.image}
                  alt={list.photo.alt}
                  sizes="(max-width: 700px) 100vw, 560px"
                />
                {list.photo.caption && <figcaption>{list.photo.caption}</figcaption>}
              </figure>
            )}

            {(list.groups || []).filter((g) => (g.items || []).length > 0).map((group) => (
              <section key={group.id} className="kit-group">
                <h3 className="kit-group__title">{group.title}</h3>
                <ul className="kit-group__list">
                  {group.items.map((it) => {
                    // A real aff URL (not the "#" placeholder) renders a tracked
                    // "Shop Patagonia" CTA wired to the app.jsx affiliate-click
                    // listener; see affiliate.js for how the links are built.
                    const isAff = it.aff && it.aff !== "#";
                    return (
                    <li key={it.id} id={it.id.replace(/:/g, "-")} className={`kit-check ${(it.link || isAff) ? "kit-check--callout" : ""}`}>
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
                      {(it.link || isAff || it.articleSlug) && (
                        <div className="kit-check__links">
                          {it.link && (
                            <a
                              className="kit-check__link"
                              href={it.link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >{it.link.label} ↗</a>
                          )}
                          {isAff && (
                            <a
                              className="kit-check__link kit-check__aff"
                              href={it.aff}
                              target="_blank"
                              rel="sponsored noopener noreferrer"
                              data-aff-network="patagonia"
                              data-aff-list={list.slug}
                              data-aff-item-slug={it.id}
                              data-aff-name={it.name}
                            >Shop Patagonia ↗</a>
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
                    );
                  })}
                </ul>
              </section>
            ))}

            {list.essay && (
              <aside className="kit__essay">
                <p className="hp-eyebrow">THE ESSAY BEHIND THE LIST</p>
                <h3>{list.essay.title}</h3>
                <p className="hp-sub">{list.essay.blurb}</p>
                <a
                  className="hp-link"
                  href={`/articles/${list.essay.slug}`}
                  onClick={(e) => { e.preventDefault(); go(`a:${list.essay.slug}`); }}
                >Read the essay →</a>
              </aside>
            )}
          </section>
        );
      })}

      {/* Pointer to the standalone Directory page */}
      <section className="hp-wrap hp-section hp-kit__dir">
        <div>
          <p className="hp-eyebrow">LOOKING FOR LODGING OR A GUIDE?</p>
          <h2>The directory lives on its own page now.</h2>
          <p className="hp-sub">
            Lodges, inns, guiding services, and outfitters in and around Yosemite, moved into <a className="hp-inline" href="/places" onClick={(e) => { e.preventDefault(); go("places"); }}>The Directory</a> to keep this page about gear.
          </p>
        </div>
        <a
          className="hp-button"
          href="/places"
          onClick={(e) => { e.preventDefault(); go("places"); }}
        >Open the directory →</a>
      </section>

      {/* The purchase ask: kit readers are packing for confirmed dates. */}
      <HpGuideBand
        go={go}
        location="kit"
        title="One more thing for the trunk."
        intro="The Field Guide app weighs nothing and works with no signal: offline maps, 50-plus stops with parking and timing notes, and a trip planner. The last item on the packing list."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="Gear notes with the letter"
        heading="Gear notes with the letter"
        blurb="What's working this season, what wore out, and what changed in the packing list. Comes with Sunday Field Notes."
        location="kit"
        tag="kit"
      />
    </div>
  );
}

window.KitPage = KitPage;
