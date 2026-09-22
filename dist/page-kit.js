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
  return React.createElement("div", {
    className: "page hp-kit"
  }, React.createElement("style", null, `
        @media print {
          header, footer, .hp-navigation, .hp-product, .hp-letter, .kit__tabs, .kit__count, .kit__photo { display: none !important; }
          body { background: #fff !important; color: #000 !important; }
          a { color: #000 !important; text-decoration: none !important; }
          .kit-group { page-break-inside: avoid; }
        }
      `), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Kit"
    }],
    eyebrow: "KIT",
    title: "What to pack",
    intro: "Three packing checklists for a Yosemite trip: a day pack, what an overnight adds to it, and the full car load. Tick items off as you plan and pack. Your progress is saved in this browser, so you can close the tab and come back to it. Press Cmd+P or Ctrl+P for a clean printable copy."
  }, React.createElement("p", {
    className: "hp-byline kit__aff-note"
  }, "Some gear here links to Patagonia through an affiliate link, marked with a star. If you buy through it, the site may earn a small commission at no extra cost to you. See the ", React.createElement("a", {
    className: "hp-inline",
    href: "/affiliate",
    onClick: e => {
      e.preventDefault();
      go("affiliate");
    }
  }, "Affiliate Disclosure"), ".")), React.createElement("section", {
    className: "hp-wrap hp-kit__tabs"
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
      className: "hp-wrap hp-kit__list"
    }, React.createElement("div", {
      className: "kit__head"
    }, React.createElement("div", null, React.createElement("div", {
      className: "kit__list-roman"
    }, list.icon), React.createElement("h2", {
      className: "kit__title"
    }, list.title), React.createElement("p", {
      className: "hp-sub kit__summary"
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
    }, "Uncheck all"))), list.photo && React.createElement("figure", {
      className: "kit__photo"
    }, React.createElement(ResponsiveImage, {
      image: list.photo.image,
      alt: list.photo.alt,
      sizes: "(max-width: 700px) 100vw, 560px"
    }), list.photo.caption && React.createElement("figcaption", null, list.photo.caption)), (list.groups || []).filter(g => (g.items || []).length > 0).map(group => React.createElement("section", {
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
    }, React.createElement("p", {
      className: "hp-eyebrow"
    }, "THE ESSAY BEHIND THE LIST"), React.createElement("h3", null, list.essay.title), React.createElement("p", {
      className: "hp-sub"
    }, list.essay.blurb), React.createElement("a", {
      className: "hp-link",
      href: `/articles/${list.essay.slug}`,
      onClick: e => {
        e.preventDefault();
        go(`a:${list.essay.slug}`);
      }
    }, "Read the essay →")));
  }), React.createElement("section", {
    className: "hp-wrap hp-section hp-kit__dir"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "LOOKING FOR LODGING OR A GUIDE?"), React.createElement("h2", null, "The directory lives on its own page now."), React.createElement("p", {
    className: "hp-sub"
  }, "Lodges, inns, guiding services, and outfitters in and around Yosemite, moved into ", React.createElement("a", {
    className: "hp-inline",
    href: "/places",
    onClick: e => {
      e.preventDefault();
      go("places");
    }
  }, "The Directory"), " to keep this page about gear.")), React.createElement("a", {
    className: "hp-button",
    href: "/places",
    onClick: e => {
      e.preventDefault();
      go("places");
    }
  }, "Open the directory →")), React.createElement(HpGuideBand, {
    go: go,
    location: "kit",
    title: "One more thing for the trunk.",
    intro: "The Field Guide app weighs nothing and works with no signal: offline maps, 50-plus stops with parking and timing notes, and a trip planner. The last item on the packing list.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Gear notes with the letter",
    heading: "Gear notes with the letter",
    blurb: "What's working this season, what wore out, and what changed in the packing list. Comes with Sunday Field Notes.",
    location: "kit",
    tag: "kit"
  }));
}
window.KitPage = KitPage;
