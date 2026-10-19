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
var KIT_FAQ = [["What should I pack for a day hike in Yosemite?", "Start with a paper map and downloaded offline maps, because cell service dies past Crane Flat; a wide-brim sun hat and SPF 50 sunscreen, because granite reflects; a packable insulated jacket, because the Valley is warm at 10 a.m. and 40\u00b0F at the rim by 3 p.m.; a headlamp with a spare battery, because day hikes turn into night hikes; a water filter; twice the snacks you think you need; and cash in small bills, since parking is cash-only at several trailheads. The full day pack list is on this page."], ["Is there cell service in Yosemite?", "Not reliably. Service dies past Crane Flat and the park has no reliable data connection, so download offline maps at home before you leave, and carry a paper map and a baseplate compass for when the phone is dead."], ["Do I need a bear canister in Yosemite?", "For overnight backpacking, yes: a bear canister is required, along with a wilderness permit, which is required year-round. All food, trash and scented items go inside it. Yosemite rents Garcia jugs at the wilderness center. In a campground or a parking lot, all food and scented items go in the bear box, because the trunk is not bear-proof."], ["Is bear spray allowed in Yosemite?", "No. Bear spray is not permitted in Yosemite. Do not bring it."], ["Do I need tire chains in Yosemite?", "Carry them from November through April. They are required during chain controls and rangers check, so practice putting them on once at home."], ["What should I wear in Yosemite?", "Layers. The Valley is warm at 10 a.m. and 40\u00b0F at the rim by 3 p.m., a synthetic insulated jacket still works if it gets wet, and a packable rain jacket earns its place because summer afternoon thunderstorms are not rare."], ["Can I print the Yosemite packing list?", "Yes. Tick items off on the page, and your progress is saved in this browser, so you can close the tab and come back to it. Press Cmd+P or Ctrl+P for a clean printable copy of the list."]];
var KIT_FACT_ICONS = ["walk", "bed", "car"];
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
      if (window.track) window.track("kit_item_toggle", {
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
    className: "page hp-tool hp-event hp-kit"
  }, React.createElement("style", null, `
        @media print {
          header, footer, .hp-navigation, .hp-product, .hp-letter, .hp-kit__books, .kit__tabs, .kit__count, .kit__photo, .ff-cover, .ff-facts, .ff-toc, .ff-band, .kit-faq { display: none !important; }
          body { background: #fff !important; color: #000 !important; }
          a { color: #000 !important; text-decoration: none !important; }
          .kit-group { page-break-inside: avoid; }
        }
      `), React.createElement("div", {
    className: "ff-cover kit-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/half-dome-subdome-hikers-heat.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "Two hikers with day packs and sun hats descending granite slabs above a forested canyon in the Yosemite high country",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Kit"
    }],
    eyebrow: "PACKING CHECKLISTS · DAY PACK · OVERNIGHT · CAR LOAD",
    title: "What to pack for Yosemite",
    intro: "Three packing checklists for a Yosemite trip: a day pack, what an overnight adds to it, and the full car load. Tick items off as you plan and pack. Your progress is saved in this browser, so you can close the tab and come back to it. Press Cmd+P or Ctrl+P for a clean printable copy.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "kit_head",
      className: "hp-button",
      href: "#kit-lists"
    }, "Open the lists ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "kit_head",
      className: "hp-link",
      href: "#kit-faq"
    }, "Packing questions ↓"))
  }, React.createElement("p", {
    className: "hp-byline kit__aff-note"
  }, "Some gear here links to Patagonia through an affiliate link, marked with a star, and the book list at the end links to Bookshop.org the same way. If you buy through one, the site may earn a small commission at no extra cost to you. See the ", React.createElement("a", {
    className: "hp-inline",
    href: "/affiliate",
    onClick: e => {
      e.preventDefault();
      go("affiliate");
    }
  }, "Affiliate Disclosure"), ".")), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: Murray Foubister / Wikimedia Commons (CC BY-SA 2.0)")), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, kit.lists.map((l, i) => React.createElement("div", {
    key: l.slug
  }, React.createElement(EventIcon, {
    name: KIT_FACT_ICONS[i] || "check"
  }), React.createElement("dt", null, l.title), React.createElement("dd", null, (l.groups || []).reduce((n, g) => n + (g.items || []).length, 0), " items"))), React.createElement("div", null, React.createElement(EventIcon, {
    name: "check"
  }), React.createElement("dt", null, "Your ticks"), React.createElement("dd", null, "Saved in this browser"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), [["#kit-lists", "The lists"], ["#kit-why", "What they prevent"], ["#kit-books", "A field guide"], ["#kit-faq", "Questions"]].map(([href, label]) => React.createElement(HomeLink, {
    key: href,
    go: go,
    location: "kit_toc",
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-kit__tabs",
    id: "kit-lists",
    tabIndex: -1
  }, React.createElement("div", {
    className: "kit__tabs"
  }, kit.lists.map(l => React.createElement("button", {
    key: l.slug,
    type: "button",
    "aria-pressed": open === l.slug,
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
      }, it.link.label, "\xA0↗"), isAff && React.createElement("a", {
        className: "kit-check__link kit-check__aff",
        href: it.aff,
        target: "_blank",
        rel: "sponsored nofollow noopener",
        "data-aff-network": "patagonia",
        "data-aff-list": list.slug,
        "data-aff-item-slug": it.id,
        "data-aff-name": it.name
      }, "Shop Patagonia\xA0↗"), it.articleSlug && React.createElement("a", {
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
    className: "ff-band",
    id: "kit-why",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT THE LISTS PREVENT"), React.createElement("h2", null, "Four mistakes the lists are written against"), React.createElement("ul", {
    className: "ff-rules kit-why"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "signal",
    size: 26
  }), React.createElement("strong", null, "Counting on a signal"), React.createElement("p", null, "Cell service dies past Crane Flat. Download offline maps at home and carry a paper map and a compass.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "therm",
    size: 26
  }), React.createElement("strong", null, "Dressing for the Valley floor"), React.createElement("p", null, "The Valley is warm at 10 a.m. and 40°F at the rim by 3 p.m. Pack an insulated layer and a rain jacket.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "Trusting the trunk with food"), React.createElement("p", null, "The trunk is not bear-proof. All food and scented items, deodorant, toothpaste, sunscreen and trash included, go in the bear box.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "snow",
    size: 26
  }), React.createElement("strong", null, "Skipping the chains"), React.createElement("p", null, "Carry tire chains from November through April. They are required during chain controls and rangers check. Practice once at home."))), React.createElement("p", {
    className: "ff-note"
  }, "Trip dates in hand? The ", React.createElement(HomeLink, {
    go: go,
    location: "kit_why",
    href: "/conditions"
  }, "conditions board"), " reads the weather and the gates the morning you drive in, and ", React.createElement(HomeLink, {
    go: go,
    location: "kit_why",
    href: "/articles/when-to-visit-yosemite"
  }, "when to visit"), " says what each month asks you to carry."))), React.createElement("section", {
    className: "hp-wrap hp-reading hp-kit__books",
    id: "kit-books",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-reading__column"
  }, React.createElement(window.BookshelfCard, {
    list: "kit_bookshelf",
    slug: "kit",
    heading: "And a field guide",
    note: "A field guide earns its place in the pack. The ones I recommend for Yosemite are kept as one list."
  }))), React.createElement("section", {
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
  }, "Open the directory →")), React.createElement("section", {
    className: "hp-wrap hp-section ff-split kit-faq",
    id: "kit-faq",
    tabIndex: -1
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Yosemite packing questions, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "The rest of the preparation: ", React.createElement(HomeLink, {
    go: go,
    location: "kit_faq",
    href: "/checklist"
  }, "the first-week checklist"), ", ", React.createElement(HomeLink, {
    go: go,
    location: "kit_faq",
    href: "/dates"
  }, "the dates that decide a trip"), " and ", React.createElement(HomeLink, {
    go: go,
    location: "kit_faq",
    href: "/articles/yosemite-bears-safety-guide"
  }, "bear safety in the park"), ".")), React.createElement("div", {
    className: "ff-faq"
  }, KIT_FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a))))), React.createElement(HpGuideBand, {
    go: go,
    location: "kit",
    title: "One more thing for the trunk.",
    intro: "The Field Guide app weighs nothing and works with no signal: offline maps, every stop with parking and timing notes, and a trip planner. The last item on the packing list.",
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
