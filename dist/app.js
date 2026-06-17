var {
  useState,
  useEffect
} = React;
var SITE_ORIGIN = "https://thetalusfieldjournal.com";
function routeToPath(route) {
  if (!route || route === "home") return "/";
  if (route === "articles") return "/articles";
  if (route.startsWith("cat:")) return `/section/${route.slice(4)}`;
  if (route.startsWith("a:")) return `/articles/${route.slice(2)}`;
  return `/${route}`;
}
function pathToRoute(pathname) {
  var path = (pathname || "/").replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  if (path === "/articles") return "articles";
  var article = path.match(/^\/articles\/([a-z0-9-]+)$/i);
  if (article) return `a:${article[1]}`;
  var section = path.match(/^\/section\/([a-z0-9-]+)$/i);
  if (section) return `cat:${section[1]}`;
  var simple = path.match(/^\/([a-z0-9-]+)$/i);
  if (simple) return simple[1];
  return "home";
}
function legacyHashToRoute(hash) {
  if (!hash) return null;
  var h = hash.replace(/^#+/, "");
  if (!h) return "home";
  if (h.startsWith("a:") || h.startsWith("cat:")) return h;
  return h;
}
var SITE_NAME = "The Talus Field";
var PERSON_ID = `${SITE_ORIGIN}/#person-cory-goehring`;
var SITE_TAGLINE = "Yosemite, written from inside it";
var SITE_DEFAULT_IMAGE = `${SITE_ORIGIN}/img/Half%20Dome%20Main%20Photo.jpg`;
var SITE_DEFAULT_DESC = "A field journal of Yosemite National Park, kept by a resident. Trails, planning notes, wildlife, and essays on the park's seasons and life.";
function setMeta(name, content, attr = "name") {
  if (!content) return;
  var el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
function setLink(rel, href) {
  var el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
function setJsonLd(id, data) {
  var el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}
function clearJsonLd(id) {
  var el = document.getElementById(id);
  if (el) el.remove();
}
function absolute(url) {
  if (!url) return SITE_DEFAULT_IMAGE;
  if (/^https?:/i.test(url)) return url;
  return `${SITE_ORIGIN}/${url.replace(/^\//, "")}`;
}
function breadcrumbLd(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, url], i) => {
      var item = {
        "@type": "ListItem",
        position: i + 1,
        name
      };
      if (url) item.item = url;
      return item;
    })
  };
}
function faqLd(pairs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(({
      q,
      a
    }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a
      }
    }))
  };
}
function buildSeo(route) {
  var path = routeToPath(route);
  var url = `${SITE_ORIGIN}${path}`;
  if (route.startsWith("a:")) {
    var slug = route.slice(2);
    var a = window.findArticle && window.findArticle(slug);
    if (a) {
      var cat = window.findCategory(a.cat);
      var image = absolute(a.image || "img/Half%20Dome%20Main%20Photo.jpg");
      var desc = a.seoDek || a.dek;
      return {
        title: `${a.title} — ${SITE_NAME}`,
        description: desc,
        canonical: url,
        ogType: "article",
        image,
        imageAlt: a.placeholder || a.title,
        articleOg: {
          publishedTime: a.isoDate || null,
          modifiedTime: a.isoModified || a.isoDate || null,
          author: window.SITE.authorName,
          section: cat ? cat.label : null
        },
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: desc,
          image: [image],
          datePublished: a.isoDate || a.date,
          dateModified: a.isoModified || a.isoDate || a.date,
          articleSection: cat ? cat.label : undefined,
          author: {
            "@id": PERSON_ID
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_ORIGIN}/img/talus-field-mark-square.png`,
              width: 512,
              height: 512
            }
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url
          },
          isAccessibleForFree: true,
          inLanguage: "en-US"
        },
        breadcrumb: breadcrumbLd([["Home", `${SITE_ORIGIN}/`], cat ? [cat.label, `${SITE_ORIGIN}/section/${cat.slug}`] : null, [a.title, null]].filter(Boolean)),
        faq: a.faq ? faqLd(a.faq) : null
      };
    }
  }
  if (route.startsWith("cat:")) {
    var _slug = route.slice(4);
    var _cat = window.findCategory && window.findCategory(_slug);
    var items = window.byCategory && window.byCategory(_slug) || [];
    if (_cat) {
      return {
        title: `${_cat.label} — ${SITE_NAME}`,
        description: `${_cat.blurb} ${items.length} entries from The Talus Field's Yosemite field journal.`,
        canonical: url,
        ogType: "website",
        image: SITE_DEFAULT_IMAGE,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${_cat.label} — ${SITE_NAME}`,
          description: _cat.blurb,
          url,
          inLanguage: "en-US",
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_ORIGIN
          },
          hasPart: items.map(a => ({
            "@type": "Article",
            headline: a.title,
            description: a.dek,
            url: `${SITE_ORIGIN}/articles/${a.slug}`,
            datePublished: a.isoDate || a.date
          }))
        },
        breadcrumb: breadcrumbLd([["Home", `${SITE_ORIGIN}/`], [_cat.label, null]])
      };
    }
  }
  if (route === "kit") {
    var k = window.KIT;
    var itemLists = (k && k.lists ? k.lists : []).map(list => ({
      "@type": "ItemList",
      name: list.title,
      description: list.summary,
      numberOfItems: list.allItems.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      url: `${SITE_ORIGIN}/kit#${list.slug}`,
      itemListElement: list.allItems.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        description: it.note
      }))
    }));
    return {
      title: `Packing checklists for Yosemite — ${SITE_NAME}`,
      description: "Three Yosemite packing checklists to tick off as you plan: a day pack, what an overnight adds, and the full car load. The small, easily forgotten things included.",
      canonical: url,
      ogType: "website",
      image: SITE_DEFAULT_IMAGE,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": itemLists
      },
      breadcrumb: breadcrumbLd([["Home", `${SITE_ORIGIN}/`], ["Kit", null]])
    };
  }
  if (route === "films") {
    var nn = window.NATURE_NOTES;
    var episodes = nn && nn.episodes || [];
    return {
      title: `Moving Pictures — the Yosemite Nature Notes film archive — ${SITE_NAME}`,
      description: "The complete Yosemite Nature Notes film series from the National Park Service, grouped by subject. Public domain, free to watch, most under ten minutes.",
      canonical: url,
      ogType: "website",
      image: SITE_DEFAULT_IMAGE,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Yosemite Nature Notes — the film archive",
        url,
        numberOfItems: episodes.length,
        itemListElement: episodes.map((ep, i) => ({
          "@type": "VideoObject",
          position: i + 1,
          name: ep.title,
          description: ep.dek,
          thumbnailUrl: `https://i.ytimg.com/vi/${ep.youtubeId}/hqdefault.jpg`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${ep.youtubeId}`,
          publisher: {
            "@type": "Organization",
            name: "National Park Service"
          },
          isAccessibleForFree: true
        }))
      },
      breadcrumb: breadcrumbLd([["Home", `${SITE_ORIGIN}/`], ["Films", null]])
    };
  }
  if (route === "articles") {
    var all = window.ARTICLES || [];
    var _desc = "Every entry, in reverse chronological order. Yosemite trip planning, trails, wildlife, and seasonal guides.";
    return {
      title: `Articles — ${SITE_NAME}`,
      description: _desc,
      canonical: url,
      ogType: "website",
      image: SITE_DEFAULT_IMAGE,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `Articles — ${SITE_NAME}`,
        url,
        description: _desc,
        inLanguage: "en-US",
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_ORIGIN
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: all.length,
          itemListElement: all.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_ORIGIN}/articles/${a.slug}`,
            name: a.title
          }))
        }
      },
      breadcrumb: null,
      faq: null
    };
  }
  var known = {
    home: {
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DEFAULT_DESC,
      ogType: "website"
    },
    articles: {
      title: `Articles — ${SITE_NAME}`,
      description: "Every entry, in reverse chronological order. Yosemite trip planning, trails, wildlife, and seasonal guides.",
      ogType: "website"
    },
    planning: {
      title: `The Yosemite Planning Guide — ${SITE_NAME}`,
      description: "Plan a Yosemite trip in 2026: gateway towns, reservations, Half Dome, smoke season, the seasonal calendar. A hub for The Talus Field's planning archive.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Planning Guide", null]],
      faq: [{
        q: "Do I need a reservation to enter Yosemite in 2026?",
        a: "No. The day-use vehicle reservation system is not in effect in 2026. A standard Yosemite entrance pass ($35 per vehicle, valid 7 days) is required."
      }, {
        q: "What is the best time of year to visit Yosemite?",
        a: "Late May through early June for peak waterfalls and moderate crowds. September and October for warm days, smaller crowds, and golden light. July and August are the most crowded months."
      }, {
        q: "How much does it cost to enter Yosemite?",
        a: "$35 per vehicle (7-day pass), $20 per person on foot or bike. The America the Beautiful annual pass ($80) covers all national parks for one year."
      }, {
        q: "How long should I spend at Yosemite?",
        a: "Minimum two full days. Three to four days lets you cover the Valley, Glacier Point, and Tioga Road without rushing."
      }, {
        q: "Is Yosemite open year-round?",
        a: "Yosemite Valley is open year-round. Tioga Road closes November through May. Glacier Point Road closes late November and reopens around Memorial Day."
      }]
    },
    checklist: {
      title: `The Yosemite First-Week Checklist — ${SITE_NAME}`,
      description: "A printable single-page checklist for planning a Yosemite trip in 2026: when to come, what to book, what to pack, gateway choice, and the non-negotiables. Free.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Planning Checklist", null]]
    },
    about: {
      title: `About — ${SITE_NAME}`,
      description: "About The Talus Field, an independent field journal of Yosemite kept by Cory Goehring, a resident of the park.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["About", null]]
    },
    places: {
      title: `The Directory — Yosemite lodging and guides — ${SITE_NAME}`,
      description: "A small, curated directory of Yosemite-area lodging, outfitters, and guiding services, drawn from twenty seasons.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Directory", null]]
    },
    advertise: {
      title: `List your business — ${SITE_NAME}`,
      description: "How to list a Yosemite-area lodge, inn, guide service, or outfitter on The Talus Field directory.",
      ogType: "website"
    },
    newsletter: {
      title: `Sunday Field Notes — ${SITE_NAME}`,
      description: "A short weekly note on Yosemite when there is something to say. Free.",
      ogType: "website"
    },
    contact: {
      title: `Contact — ${SITE_NAME}`,
      description: "Send a note to the editor. Trip questions, corrections, press, or anything else.",
      ogType: "website"
    },
    privacy: {
      title: `Privacy Policy — ${SITE_NAME}`,
      description: "What information The Talus Field collects, how it is used, and your rights under GDPR and CCPA.",
      ogType: "website"
    },
    terms: {
      title: `Terms of Service — ${SITE_NAME}`,
      description: "Terms governing the use of The Talus Field, including content licensing and limitations of liability.",
      ogType: "website"
    },
    affiliate: {
      title: `Affiliate Disclosure — ${SITE_NAME}`,
      description: "How affiliate links work on The Talus Field, and the editorial standards that don't change for paid placements.",
      ogType: "website"
    },
    guide: {
      title: `The Field Guide — ${SITE_NAME}`,
      description: "An offline web app for Yosemite. Tappable GPS for the parking turnouts, quiet trailheads, and insider tactics locals use. Works when service dies.",
      ogType: "website"
    },
    map: {
      title: `Yosemite Trip Planner Map — ${SITE_NAME}`,
      description: "An interactive Yosemite map of vistas, trailheads, parking turnouts, picnic spots, and places to eat, with a trip builder. Curated by a resident of the park. Free.",
      ogType: "website"
    }
  };
  var meta = known[route] || known.home;
  return {
    title: meta.title,
    description: meta.description,
    canonical: url,
    ogType: meta.ogType || "website",
    image: SITE_DEFAULT_IMAGE,
    jsonLd: null,
    breadcrumb: meta.breadcrumb ? breadcrumbLd(meta.breadcrumb) : null,
    faq: meta.faq ? faqLd(meta.faq) : null,
    robots: meta.robots || null
  };
}
var DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
function removeMeta(name, attr = "name") {
  var el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (el) el.remove();
}
var ARTICLE_OG_TAGS = ["article:published_time", "article:modified_time", "article:author", "article:section"];
var seoApplied = false;
function applySeo(route) {
  var seo = buildSeo(route);
  document.title = seo.title;
  setMeta("description", seo.description);
  setLink("canonical", seo.canonical);
  setMeta("robots", seo.robots || DEFAULT_ROBOTS);
  setMeta("og:title", seo.title, "property");
  setMeta("og:description", seo.description, "property");
  setMeta("og:url", seo.canonical, "property");
  setMeta("og:type", seo.ogType, "property");
  setMeta("og:image", seo.image, "property");
  setMeta("og:image:alt", seo.imageAlt || SITE_DEFAULT_DESC, "property");
  setMeta("og:site_name", SITE_NAME, "property");
  if (seo.articleOg) {
    var og = seo.articleOg;
    if (og.publishedTime) setMeta("article:published_time", og.publishedTime, "property");else removeMeta("article:published_time", "property");
    if (og.modifiedTime) setMeta("article:modified_time", og.modifiedTime, "property");else removeMeta("article:modified_time", "property");
    if (og.author) setMeta("article:author", og.author, "property");else removeMeta("article:author", "property");
    if (og.section) setMeta("article:section", og.section, "property");else removeMeta("article:section", "property");
  } else {
    ARTICLE_OG_TAGS.forEach(t => removeMeta(t, "property"));
  }
  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", seo.title);
  setMeta("twitter:description", seo.description);
  setMeta("twitter:image", seo.image);
  if (seo.jsonLd) setJsonLd("ld-page", seo.jsonLd);else clearJsonLd("ld-page");
  if (seo.breadcrumb) setJsonLd("ld-breadcrumb", seo.breadcrumb);else clearJsonLd("ld-breadcrumb");
  if (seo.faq) setJsonLd("ld-faq", seo.faq);else if (seoApplied) clearJsonLd("ld-faq");
  seoApplied = true;
}
function App() {
  var [route, setRoute] = useState(() => {
    if (window.location.hash) {
      var fromHash = legacyHashToRoute(window.location.hash);
      if (fromHash) {
        var path = routeToPath(fromHash);
        window.history.replaceState({
          route: fromHash
        }, "", path);
        return fromHash;
      }
    }
    return pathToRoute(window.location.pathname);
  });
  useEffect(() => {
    applySeo(route);
  }, [route]);
  useEffect(() => {
    var onClick = e => {
      var a = e.target.closest && e.target.closest("a[data-aff-network]");
      if (!a) return;
      window.track("affiliate_click", {
        aff_network: a.dataset.affNetwork || "unknown",
        aff_list: a.dataset.affList || "",
        aff_item_slug: a.dataset.affItemSlug || "",
        aff_name: a.dataset.affName || "",
        destination: a.href
      });
    };
    document.addEventListener("click", onClick, {
      capture: true
    });
    return () => document.removeEventListener("click", onClick, {
      capture: true
    });
  }, []);
  useEffect(() => {
    var onPop = () => {
      setRoute(pathToRoute(window.location.pathname));
      window.scrollTo({
        top: 0
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  var go = r => {
    var path = routeToPath(r);
    if (path !== window.location.pathname) {
      window.history.pushState({
        route: r
      }, "", path);
    }
    setRoute(r);
    window.scrollTo({
      top: 0
    });
  };
  var [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  useEffect(() => {
    document.documentElement.setAttribute("data-palette", tweaks.palette);
    document.documentElement.setAttribute("data-density", tweaks.density);
  }, [tweaks.palette, tweaks.density]);
  var page;
  var currentNav = "home";
  if (route === "home") {
    page = React.createElement(HomePage, {
      go: go
    });
    currentNav = "home";
  } else if (route === "about") {
    page = React.createElement(AboutPage, {
      go: go
    });
    currentNav = "about";
  } else if (route === "kit") {
    page = React.createElement(KitPage, {
      go: go
    });
    currentNav = "kit";
  } else if (route === "places") {
    page = React.createElement(PlacesPage, {
      go: go
    });
    currentNav = "places";
  } else if (route === "films") {
    page = React.createElement(FilmsPage, null);
    currentNav = "films";
  } else if (route === "advertise") {
    page = React.createElement(AdvertisePage, {
      go: go
    });
  } else if (route === "articles") {
    page = React.createElement(ArticlesIndex, {
      go: go
    });
    currentNav = "articles";
  } else if (route === "planning") {
    page = React.createElement(PlanningGuide, {
      go: go
    });
    currentNav = "articles";
  } else if (route === "checklist") {
    page = React.createElement(ChecklistPage, {
      go: go
    });
    currentNav = "articles";
  } else if (route.startsWith("cat:")) {
    page = React.createElement(CategoryPage, {
      slug: route.slice(4),
      go: go
    });
    currentNav = "articles";
  } else if (route.startsWith("a:")) {
    page = React.createElement(ArticlePage, {
      slug: route.slice(2),
      go: go
    });
    currentNav = "articles";
  } else if (route === "newsletter") {
    page = React.createElement(NewsletterPage, {
      go: go
    });
    currentNav = "newsletter";
  } else if (route === "contact") {
    page = React.createElement(ContactPage, {
      go: go
    });
    currentNav = "contact";
  } else if (route === "privacy") {
    page = React.createElement(PrivacyPage, null);
  } else if (route === "terms") {
    page = React.createElement(TermsPage, null);
  } else if (route === "affiliate") {
    page = React.createElement(AffiliatePage, null);
  } else if (route === "guide") {
    page = React.createElement(GuidePage, {
      go: go
    });
  } else if (route === "map") {
    page = React.createElement(MapPage, {
      go: go
    });
  } else {
    page = React.createElement(HomePage, {
      go: go
    });
  }
  var exitDisabled = ["newsletter", "contact", "privacy", "terms", "affiliate", "films"].includes(route);
  return React.createElement(React.Fragment, null, React.createElement(Header, {
    current: currentNav,
    go: go
  }), React.createElement("main", {
    key: route
  }, page), React.createElement(Footer, {
    go: go
  }), React.createElement(ExitIntentNewsletter, {
    disabled: exitDisabled
  }), React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, React.createElement(TweakSection, {
    title: "Palette",
    subtitle: "The look of every page on the site."
  }, React.createElement(TweakRadio, {
    value: tweaks.palette,
    onChange: v => setTweak("palette", v),
    options: [{
      value: "golden",
      label: "Golden hour"
    }, {
      value: "granite",
      label: "Granite"
    }, {
      value: "sierra",
      label: "Sierra"
    }]
  })), React.createElement(TweakSection, {
    title: "Density",
    subtitle: "Reading width and gutter."
  }, React.createElement(TweakRadio, {
    value: tweaks.density,
    onChange: v => setTweak("density", v),
    options: [{
      value: "airy",
      label: "Airy"
    }, {
      value: "dense",
      label: "Dense"
    }]
  }))));
}
window.routeToPath = routeToPath;
window.SITE_ORIGIN = SITE_ORIGIN;
var REQUIRED_GLOBALS = ["Header", "Footer", "ExitIntentNewsletter", "HomePage", "AboutPage", "ArticlesIndex", "CategoryPage", "ArticlePage", "KitPage", "PlacesPage", "AdvertisePage", "GuidePage", "MapPage", "FilmsPage", "PlanningGuide", "ChecklistPage", "NewsletterPage", "ContactPage", "PrivacyPage", "TermsPage", "AffiliatePage", "TweaksPanel", "useTweaks", "TweakSection", "TweakRadio"];
var missingGlobals = REQUIRED_GLOBALS.filter(n => typeof window[n] === "undefined");
if (missingGlobals.length) {
  console.error("app.jsx boot: missing page globals (a script failed to load or register):", missingGlobals.join(", "));
  if (window.location.hostname === "localhost") {
    var warn = document.createElement("div");
    warn.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:9999;background:#b9453d;color:#fff;font:13px/1.4 monospace;padding:8px 14px;";
    warn.textContent = "Missing globals: " + missingGlobals.join(", ");
    document.body.appendChild(warn);
  }
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
document.getElementById("seo-static-h1")?.remove();
document.getElementById("prerender-prose")?.remove();
