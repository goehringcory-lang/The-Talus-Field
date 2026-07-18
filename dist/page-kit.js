var {
  useState: useStateK,
  useCallback: useCallbackK
} = React;
var KIT_STORAGE_KEY = "tfg.kit.checked";
var KIT_STORAGE_VERSION = 1;
function loadKitChecked() {
  var parsed = window.safeStorage.getJSON(KIT_STORAGE_KEY);
  if (!parsed || typeof parsed.ids !== "object" || parsed.ids === null) return {};
  var out = {};
  for (var k of Object.keys(parsed.ids)) {
    if (parsed.ids[k] === true) out[k] = true;
  }
  return out;
}
function saveKitChecked(ids) {
  window.safeStorage.setJSON(KIT_STORAGE_KEY, {
    v: KIT_STORAGE_VERSION,
    ids
  });
}
function KitPage({
  go
}) {
  var kit = window.KIT;
  var initialSlug = (() => {
    var h = (window.location.hash || "").replace(/^#/, "");
    var match = kit.lists.find(l => h.startsWith(l.slug));
    return match ? match.slug : kit.lists[0].slug;
  })();
  var [open, setOpen] = useStateK(initialSlug);
  var [checked, setChecked] = useStateK(loadKitChecked);
  var selectTab = slug => {
    setOpen(slug);
    history.replaceState({}, "", `/kit#${slug}`);
  };
  var toggle = useCallbackK(id => {
    setChecked(prev => {
      var next = {
        ...prev
      };
      if (next[id]) delete next[id];else next[id] = true;
      window.track("kit_item_toggle", {
        item_id: id,
        checked: !!next[id]
      });
      saveKitChecked(next);
      return next;
    });
  }, []);
  if (window.location.hostname === "localhost") {
    var seen = new Set();
    var dupes = [];
    kit.lists.forEach(l => (l.groups || []).forEach(g => (g.items || []).forEach(it => {
      if (seen.has(it.id)) dupes.push(it.id);else seen.add(it.id);
    })));
    if (dupes.length) console.warn("KIT duplicate item ids:", dupes);
  }
  return React.createElement("div", null, React.createElement("style", null, `
        @media print {
          header, footer, .tweaks-panel, .kit__tabs, .kit__count { display: none !important; }
          body { background: #fff !important; color: #000 !important; }
          a { color: #000 !important; text-decoration: none !important; }
          .kit-group { page-break-inside: avoid; }
        }
      `), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 56,
      paddingBottom: 24
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 18
    }
  }, "Kit"), React.createElement("h1", {
    className: "display",
    style: {
      fontSize: "clamp(46px, 6vw, 84px)",
      lineHeight: 0.98,
      marginBottom: 24,
      fontWeight: 500,
      letterSpacing: "-0.01em"
    }
  }, "What to pack"), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 21,
      lineHeight: 1.5,
      color: "var(--ink-2)",
      maxWidth: "62ch",
      textWrap: "pretty"
    }
  }, "Three packing checklists for a Yosemite trip: a day pack, what an overnight adds to it, and the full car load. Tick items off as you plan and pack. Your progress is saved in this browser, so you can close the tab and come back to it. Press Cmd+P or Ctrl+P for a clean printable copy."), React.createElement("p", {
    className: "kit__aff-note",
    style: {
      fontFamily: "var(--serif)",
      fontSize: 14,
      lineHeight: 1.5,
      color: "var(--ink-2)",
      marginTop: 14,
      maxWidth: "62ch"
    }
  }, "Some gear here links to Patagonia through an affiliate link, marked with a star. If you buy through it, the site may earn a small commission at no extra cost to you. See the ", React.createElement("a", {
    href: "/affiliate",
    onClick: e => {
      e.preventDefault();
      go("affiliate");
    }
  }, "Affiliate Disclosure"), ".")), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 24
    }
  }, React.createElement("div", {
    className: "kit__tabs"
  }, kit.lists.map(l => React.createElement("button", {
    key: l.slug,
    className: `kit__tab ${open === l.slug ? "is-active" : ""}`,
    onClick: () => selectTab(l.slug)
  }, React.createElement("span", {
    className: "kit__tab-roman"
  }, l.icon), React.createElement("span", {
    className: "kit__tab-label"
  }, l.title))))), kit.lists.filter(l => l.slug === open).map(list => {
    var flat = (list.groups || []).flatMap(g => g.items || []);
    var total = flat.length;
    var done = flat.reduce((n, it) => n + (checked[it.id] ? 1 : 0), 0);
    var resetList = () => {
      setChecked(prev => {
        var next = {
          ...prev
        };
        flat.forEach(it => {
          delete next[it.id];
        });
        saveKitChecked(next);
        return next;
      });
    };
    return React.createElement("section", {
      key: list.slug,
      className: "wrap",
      style: {
        paddingTop: 32,
        paddingBottom: 64
      }
    }, React.createElement("div", {
      className: "kit__head"
    }, React.createElement("div", null, React.createElement("div", {
      className: "kit__list-roman"
    }, list.icon), React.createElement("h2", {
      style: {
        fontFamily: "var(--display)",
        fontSize: 44,
        fontWeight: 500,
        lineHeight: 1.05,
        margin: "8px 0 12px"
      }
    }, list.title), React.createElement("p", {
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        color: "var(--ink-2)",
        fontSize: 18,
        maxWidth: "52ch"
      }
    }, list.summary)), React.createElement("div", {
      className: "kit__count"
    }, React.createElement("span", {
      className: "kit__count-num"
    }, done), React.createElement("span", {
      className: "kit__count-label"
    }, "of ", total, " packed"), done > 0 && React.createElement("button", {
      type: "button",
      className: "kit-reset",
      onClick: resetList
    }, "Uncheck all"))), (list.groups || []).filter(g => (g.items || []).length > 0).map(group => React.createElement("section", {
      key: group.id,
      className: "kit-group"
    }, React.createElement("h3", {
      className: "kit-group__title"
    }, group.title), React.createElement("ul", {
      className: "kit-group__list"
    }, group.items.map(it => {
      var isAff = it.aff && it.aff !== "#";
      return React.createElement("li", {
        key: it.id,
        id: it.id.replace(/:/g, "-"),
        className: `kit-check ${it.link || isAff ? "kit-check--callout" : ""}`
      }, React.createElement("label", {
        className: "kit-check__row"
      }, React.createElement("input", {
        type: "checkbox",
        className: "kit-check__box",
        checked: !!checked[it.id],
        onChange: () => toggle(it.id)
      }), React.createElement("span", {
        className: "kit-check__text"
      }, React.createElement("span", {
        className: "kit-check__name"
      }, it.name), it.note && React.createElement("span", {
        className: "kit-check__note"
      }, it.note))), (it.link || isAff || it.articleSlug) && React.createElement("div", {
        className: "kit-check__links"
      }, it.link && React.createElement("a", {
        className: "kit-check__link",
        href: it.link.href,
        target: "_blank",
        rel: "noopener noreferrer"
      }, it.link.label, " ↗"), isAff && React.createElement("a", {
        className: "kit-check__link kit-check__aff",
        href: it.aff,
        target: "_blank",
        rel: "sponsored noopener noreferrer",
        "data-aff-network": "patagonia",
        "data-aff-list": list.slug,
        "data-aff-item-slug": it.id,
        "data-aff-name": it.name
      }, "Shop Patagonia ↗"), it.articleSlug && React.createElement("a", {
        className: "kit-check__article",
        href: `/articles/${it.articleSlug}`,
        onClick: e => {
          e.preventDefault();
          go(`a:${it.articleSlug}`);
        }
      }, "Read the piece →")));
    })))), list.essay && React.createElement("aside", {
      className: "kit__essay"
    }, React.createElement("div", {
      className: "eyebrow eyebrow--moss",
      style: {
        marginBottom: 12
      }
    }, "The essay behind the list"), React.createElement("h3", {
      style: {
        fontFamily: "var(--display)",
        fontSize: 28,
        fontWeight: 500,
        lineHeight: 1.15,
        margin: "0 0 12px"
      }
    }, list.essay.title), React.createElement("p", {
      style: {
        fontFamily: "var(--serif)",
        fontSize: 17,
        color: "var(--ink-2)",
        lineHeight: 1.55,
        margin: "0 0 16px",
        maxWidth: "60ch"
      }
    }, list.essay.blurb), React.createElement("a", {
      className: "btn btn--ghost",
      href: `/articles/${list.essay.slug}`,
      onClick: e => {
        e.preventDefault();
        go(`a:${list.essay.slug}`);
      }
    }, "Read the essay →")));
  }), React.createElement("section", {
    className: "wrap",
    style: {
      paddingTop: 56,
      paddingBottom: 80,
      borderTop: "1px solid var(--rule)"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 32,
      flexWrap: "wrap"
    }
  }, React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 280
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "Looking for lodging or a guide?"), React.createElement("h2", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 32,
      fontWeight: 500,
      lineHeight: 1.1,
      margin: "0 0 12px"
    }
  }, "The directory lives on its own page now."), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 17,
      color: "var(--ink-2)",
      margin: 0,
      lineHeight: 1.5
    }
  }, "Lodges, inns, guiding services, and outfitters in and around Yosemite, moved into ", React.createElement("a", {
    href: "/places",
    onClick: e => {
      e.preventDefault();
      go("places");
    }
  }, "The Directory"), " to keep this page about gear.")), React.createElement("a", {
    className: "btn",
    href: "/places",
    onClick: e => {
      e.preventDefault();
      go("places");
    }
  }, "Open the directory →"))), React.createElement("section", {
    className: "wrap",
    style: {
      paddingBottom: 24
    }
  }, React.createElement(GuidePromo, {
    go: go,
    location: "kit",
    title: "One more thing for the trunk.",
    body: "The Field Guide app weighs nothing and works with no signal: offline maps, 50-plus stops with parking and timing notes, and a trip planner. The last item on the packing list.",
    style: {
      maxWidth: 680
    }
  })), React.createElement("section", {
    className: "wrap",
    style: {
      paddingBottom: 80
    }
  }, React.createElement(NewsletterInline, {
    location: "kit",
    tag: "kit",
    heading: "Gear notes with the letter",
    blurb: "What's working this season, what wore out, and what changed in the packing list. Comes with Sunday Field Notes."
  })));
}
window.KitPage = KitPage;
