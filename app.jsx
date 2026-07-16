/* global React, ReactDOM, Header, Footer, ExitIntentNewsletter,
   TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle */
/* Page components (HomePage, ArticlePage, MapPage, ...) are NOT bare globals
   here: their bundles lazy-load per route (see PAGE_MODULES) and the route
   switch reads them from window.* after ensureRoute resolves. */

const { useState, useEffect, useRef } = React;

// ============================================================
// Routing. Real paths via History API so each entry is its own URL
// in Google's index. Internal pages still navigate via go("key");
// the helpers below translate route keys ↔ paths.
// ============================================================
const SITE_ORIGIN = "https://thetalusfieldjournal.com";

function routeToPath(route) {
  if (!route || route === "home") return "/";
  if (route === "articles") return "/articles";
  if (route.startsWith("cat:")) return `/section/${route.slice(4)}`;
  if (route.startsWith("a:")) return `/articles/${route.slice(2)}`;
  return `/${route}`;
}

// Every static route key the App switch below can render. Unknown paths fall
// to the "notfound" route (rendered noindex, mirrored by a 404 status at the
// edge in edge/seo.js) instead of silently duplicating the homepage.
const STATIC_ROUTE_KEYS = new Set([
  "home", "articles", "planning", "checklist", "about", "kit", "places",
  "advertise", "newsletter", "contact", "privacy", "terms", "affiliate",
  "guide", "map", "films", "itineraries", "conditions", "now", "firefall",
  "consult",
]);

function pathToRoute(pathname) {
  const path = (pathname || "/").replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  if (path === "/articles") return "articles";
  const article = path.match(/^\/articles\/([a-z0-9-]+)$/i);
  if (article) return `a:${article[1]}`;
  const section = path.match(/^\/section\/([a-z0-9-]+)$/i);
  if (section) return `cat:${section[1]}`;
  const simple = path.match(/^\/([a-z0-9-]+)$/i);
  if (simple && STATIC_ROUTE_KEYS.has(simple[1])) return simple[1];
  return "notfound";
}

// True when a route key resolves to real content. Article and section routes
// are checked against the catalog so /articles/typo-slug 404s instead of
// rendering an empty reader over homepage SEO.
function routeExists(route) {
  if (route === "notfound") return false;
  if (route.startsWith("a:")) return !!(window.findArticle && window.findArticle(route.slice(2)));
  if (route.startsWith("cat:")) return !!(window.findCategory && window.findCategory(route.slice(4)));
  return STATIC_ROUTE_KEYS.has(route);
}

// ============================================================
// Route-level code loading (LCP pass). index.html eagerly loads only the
// shared shell (React vendor files, storage, affiliate, data, tweaks-panel,
// components, app); each route's page bundle — plus the films/itineraries
// data files — loads on demand here. The active route's scripts are awaited
// before boot render and before any SPA navigation commits, and the rest are
// prefetched on the reader's first interaction, so navigation stays instant
// without taxing first paint. Add new page scripts to PAGE_MODULES, not to
// index.html.
// ============================================================

// Shared cache-buster: read from the app.js script tag so injected scripts
// ride the same ?v=N as index.html (the bump discipline is unchanged).
const ASSET_VERSION = (() => {
  const tags = document.querySelectorAll("script[src]");
  for (const t of tags) {
    const m = (t.getAttribute("src") || "").match(/\/dist\/app\.js\?v=(\d+)/);
    if (m) return m[1];
  }
  return "0";
})();

// Registry: route family -> the scripts it needs and the globals they
// register. Section pages need nothing extra (CategoryPage lives in the eager
// components bundle).
const PAGE_MODULES = {
  home: { scripts: ["/dist/page-home.js"], globals: ["HomePage"] },
  about: { scripts: ["/dist/page-about.js"], globals: ["AboutPage"] },
  kit: { scripts: ["/dist/page-kit.js"], globals: ["KitPage"] },
  places: { scripts: ["/dist/page-places.js"], globals: ["PlacesPage"] },
  advertise: { scripts: ["/dist/page-advertise.js"], globals: ["AdvertisePage"] },
  articles: { scripts: ["/dist/page-articles.js"], globals: ["ArticlesIndex", "CategoryPage"] },
  planning: { scripts: ["/dist/page-planning-guide.js"], globals: ["PlanningGuide"] },
  checklist: { scripts: ["/dist/page-checklist.js"], globals: ["ChecklistPage"] },
  article: { scripts: ["/dist/page-article.js"], globals: ["ArticlePage"] },
  newsletter: { scripts: ["/dist/page-newsletter-contact.js"], globals: ["NewsletterPage", "ContactPage"] },
  contact: { scripts: ["/dist/page-newsletter-contact.js"], globals: ["NewsletterPage", "ContactPage"] },
  privacy: { scripts: ["/dist/page-legal.js"], globals: ["PrivacyPage", "TermsPage", "AffiliatePage"] },
  terms: { scripts: ["/dist/page-legal.js"], globals: ["PrivacyPage", "TermsPage", "AffiliatePage"] },
  affiliate: { scripts: ["/dist/page-legal.js"], globals: ["PrivacyPage", "TermsPage", "AffiliatePage"] },
  guide: { scripts: ["/dist/page-guide.js"], globals: ["GuidePage"] },
  films: { scripts: ["/videos-data.js", "/dist/page-films.js"], globals: ["FilmsPage"] },
  itineraries: { scripts: ["/itineraries-data.js", "/dist/page-itineraries.js"], globals: ["ItinerariesPage"] },
  map: { scripts: ["/itineraries-data.js", "/dist/page-map.js"], globals: ["MapPage"] },
  conditions: { scripts: ["/dist/page-conditions.js"], globals: ["ConditionsPage"] },
  now: { scripts: ["/dist/page-now.js"], globals: ["NowPage"] },
  firefall: { scripts: ["/dist/page-firefall.js"], globals: ["FirefallPage"] },
  consult: { scripts: ["/dist/page-consult.js"], globals: ["ConsultPage"] },
};

function routeModule(route) {
  if (route.startsWith("a:")) return PAGE_MODULES.article;
  if (route.startsWith("cat:")) return PAGE_MODULES.articles; // CategoryPage lives in page-articles.js
  return PAGE_MODULES[route] || null;
}

// One injected <script> per file per session; repeated calls share the promise.
const loadedScripts = {};
function loadScriptOnce(src) {
  if (!loadedScripts[src]) {
    loadedScripts[src] = new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = `${src}?v=${ASSET_VERSION}`;
      el.onload = () => resolve();
      el.onerror = () => reject(new Error(`failed to load ${src}`));
      document.head.appendChild(el);
    });
  }
  return loadedScripts[src];
}

async function ensureRoute(route) {
  const mod = routeModule(route);
  if (!mod) return;
  for (const src of mod.scripts) await loadScriptOnce(src);
  const missing = mod.globals.filter((n) => typeof window[n] === "undefined");
  if (missing.length) throw new Error(`route "${route}" loaded but did not register: ${missing.join(", ")}`);
}

// Warm every remaining bundle once the reader shows intent (first interaction).
// Crawlers and Lighthouse never trigger this, so lab metrics reflect the lean
// boot; real readers get instant SPA navigation from the second click on.
function prefetchAllModules() {
  Object.values(PAGE_MODULES).forEach((mod) => {
    mod.scripts.forEach((src) => loadScriptOnce(src).catch(() => {}));
  });
}

// Map old hash URLs (#a:slug, #cat:slug, #foo) to the new route keys.
function legacyHashToRoute(hash) {
  if (!hash) return null;
  const h = hash.replace(/^#+/, "");
  if (!h) return "home";
  if (h.startsWith("a:") || h.startsWith("cat:")) return h;
  return h;
}

// ============================================================
// SEO. Per-route title, description, canonical, robots, JSON-LD.
// Search engines (Google) and AI crawlers (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended) read these on render.
// ============================================================
const SITE_NAME = "The Talus Field";
// Single author node defined in index.html (<script id="ld-person">). Article
// schema references it by @id so there is one Person entity for the whole site,
// matching functions/_middleware.js (edge) and the Organization founder.
const PERSON_ID = `${SITE_ORIGIN}/#person-cory-goehring`;
const SITE_TAGLINE = "Yosemite, written from inside it";
// 1200x630 landscape card generated by scripts/gen-responsive-images.mjs —
// matches the og:image:width/height declared in index.html and the edge
// default in functions/_middleware.js.
const SITE_DEFAULT_IMAGE = `${SITE_ORIGIN}/img/og-default.jpg`;
const SITE_DEFAULT_DESC =
  "A field journal of Yosemite National Park, kept by a resident. Trails, planning notes, wildlife, and essays on the park's seasons and life.";

function setMeta(name, content, attr = "name") {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function clearJsonLd(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function absolute(url) {
  if (!url) return SITE_DEFAULT_IMAGE;
  if (/^https?:/i.test(url)) return url;
  return `${SITE_ORIGIN}/${url.replace(/^\//, "")}`;
}

// Build a BreadcrumbList from an array of [name, url] (last item omits url).
function breadcrumbLd(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, url], i) => {
      const item = { "@type": "ListItem", position: i + 1, name };
      if (url) item.item = url;
      return item;
    }),
  };
}

function faqLd(pairs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// Build per-route SEO data (title, description, image, JSON-LD).
function buildSeo(route) {
  const path = routeToPath(route);
  const url = `${SITE_ORIGIN}${path}`;

  // Not-found: noindex so soft-404s never become indexable homepage clones.
  // The edge Worker (edge/seo.js) additionally serves these with a 404 status.
  if (!routeExists(route)) {
    return {
      title: `Page not found — ${SITE_NAME}`,
      description:
        "That page does not exist on The Talus Field. The articles index, planning guide, and trip planner map are good places to reorient.",
      canonical: url,
      ogType: "website",
      image: SITE_DEFAULT_IMAGE,
      jsonLd: null,
      breadcrumb: null,
      faq: null,
      robots: "noindex, follow",
    };
  }

  // Article
  if (route.startsWith("a:")) {
    const slug = route.slice(2);
    const a = window.findArticle && window.findArticle(slug);
    if (a) {
      const cat = window.findCategory(a.cat);
      const image = absolute(a.image || "img/og-default.jpg");
      // Prefer a short SEO description when authored (≤160 chars to fit Bing/Google
      // SERPs). Fall back to the visible dek otherwise.
      const desc = a.seoDek || a.dek;
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
          section: cat ? cat.label : null,
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
          author: { "@id": PERSON_ID },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_ORIGIN}/img/talus-field-mark-square.png`,
              width: 512,
              height: 512,
            },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          isAccessibleForFree: true,
          inLanguage: "en-US",
        },
        breadcrumb: breadcrumbLd([
          ["Home", `${SITE_ORIGIN}/`],
          cat ? [cat.label, `${SITE_ORIGIN}/section/${cat.slug}`] : null,
          [a.title, null],
        ].filter(Boolean)),
        faq: a.faq ? faqLd(a.faq) : null,
      };
    }
  }

  // Category
  if (route.startsWith("cat:")) {
    const slug = route.slice(4);
    const cat = window.findCategory && window.findCategory(slug);
    const items = (window.byCategory && window.byCategory(slug)) || [];
    if (cat) {
      return {
        title: `${cat.label} — ${SITE_NAME}`,
        description: `${cat.blurb} ${items.length} entries from The Talus Field's Yosemite field journal.`,
        canonical: url,
        ogType: "website",
        image: SITE_DEFAULT_IMAGE,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${cat.label} — ${SITE_NAME}`,
          description: cat.blurb,
          url,
          inLanguage: "en-US",
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_ORIGIN },
          hasPart: items.map((a) => ({
            "@type": "Article",
            headline: a.title,
            description: a.dek,
            url: `${SITE_ORIGIN}/articles/${a.slug}`,
            datePublished: a.isoDate || a.date,
          })),
        },
        breadcrumb: breadcrumbLd([
          ["Home", `${SITE_ORIGIN}/`],
          [cat.label, null],
        ]),
      };
    }
  }

  // Kit. Per-list ItemList JSON-LD so each gear list is its own indexed entity.
  if (route === "kit") {
    const k = window.KIT;
    const itemLists = (k && k.lists ? k.lists : []).map((list) => ({
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
        description: it.note,
      })),
    }));
    return {
      title: `Packing checklists for Yosemite — ${SITE_NAME}`,
      description:
        "Three Yosemite packing checklists to tick off as you plan: a day pack, what an overnight adds, and the full car load. The small, easily forgotten things included.",
      canonical: url,
      ogType: "website",
      image: SITE_DEFAULT_IMAGE,
      jsonLd: { "@context": "https://schema.org", "@graph": itemLists },
      breadcrumb: breadcrumbLd([
        ["Home", `${SITE_ORIGIN}/`],
        ["Kit", null],
      ]),
    };
  }

  // Films. ItemList of VideoObject nodes built from the archive catalog.
  // uploadDate is deliberately omitted: only publication years are sourced,
  // and a fabricated full date is worse than none.
  if (route === "films") {
    const nn = window.NATURE_NOTES;
    const episodes = (nn && nn.episodes) || [];
    return {
      title: `Moving Pictures — the Yosemite Nature Notes film archive — ${SITE_NAME}`,
      description:
        "The complete Yosemite Nature Notes film series from the National Park Service, grouped by subject. Public domain, free to watch, most under ten minutes.",
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
          publisher: { "@type": "Organization", name: "National Park Service" },
          isAccessibleForFree: true,
        })),
      },
      breadcrumb: breadcrumbLd([
        ["Home", `${SITE_ORIGIN}/`],
        ["Films", null],
      ]),
    };
  }

  // Articles index. CollectionPage whose mainEntity is the full catalog as an
  // ItemList. Mirrored at the edge in functions/_middleware.js; building it
  // here too means the hydration clear of #ld-page replaces like with like
  // instead of stripping the edge node for JS-rendering crawlers.
  if (route === "articles") {
    const all = window.ARTICLES || [];
    const desc =
      "Every entry, in reverse chronological order. Yosemite trip planning, trails, wildlife, and seasonal guides.";
    return {
      title: `Articles — ${SITE_NAME}`,
      description: desc,
      canonical: url,
      ogType: "website",
      image: SITE_DEFAULT_IMAGE,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `Articles — ${SITE_NAME}`,
        url,
        description: desc,
        inLanguage: "en-US",
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_ORIGIN },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: all.length,
          itemListElement: all.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_ORIGIN}/articles/${a.slug}`,
            name: a.title,
          })),
        },
      },
      breadcrumb: null,
      faq: null,
    };
  }

  // Static known routes
  const known = {
    home: {
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DEFAULT_DESC,
      ogType: "website",
    },
    articles: {
      title: `Articles — ${SITE_NAME}`,
      description:
        "Every entry, in reverse chronological order. Yosemite trip planning, trails, wildlife, and seasonal guides.",
      ogType: "website",
    },
    planning: {
      title: `The Yosemite Planning Guide — ${SITE_NAME}`,
      description:
        "Plan a Yosemite trip in 2026: entrances and getting there, gateway towns, permits, Half Dome, accessibility, smoke season, the seasonal calendar. A hub for The Talus Field's planning archive.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Planning Guide", null]],
      faq: [
        { q: "Do I need a reservation to enter Yosemite in 2026?", a: "No. The day-use vehicle reservation system is not in effect in 2026. A standard Yosemite entrance pass ($35 per vehicle, valid 7 days) is required." },
        { q: "What is the best time of year to visit Yosemite?", a: "Late May through early June for peak waterfalls and moderate crowds. September and October for warm days, smaller crowds, and golden light. July and August are the most crowded months." },
        { q: "How much does it cost to enter Yosemite?", a: "$35 per vehicle (7-day pass), $20 per person on foot or bike. Since January 1, 2026, international visitors pay a $100 per-person surcharge (age 16 and older). The America the Beautiful annual pass ($80 for U.S. residents, $250 for nonresidents) covers all national parks for one year." },
        { q: "How long should I spend at Yosemite?", a: "Minimum two full days. Three to four days lets you cover the Valley, Glacier Point, and Tioga Road without rushing." },
        { q: "Is Yosemite open year-round?", a: "Yosemite Valley is open year-round. Tioga Road closes November through May. Glacier Point Road closes late November and reopens around Memorial Day." }
      ],
    },
    checklist: {
      title: `The Yosemite First-Week Checklist — ${SITE_NAME}`,
      description:
        "A printable single-page checklist for planning a Yosemite trip in 2026: when to come, what to book, what to pack, gateway choice, and the non-negotiables. Free.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Planning Checklist", null]],
    },
    about: {
      title: `About — ${SITE_NAME}`,
      description:
        "About The Talus Field, an independent field journal of Yosemite kept by Cory Goehring, a resident of the park.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["About", null]],
    },
    places: {
      title: `The Directory — Yosemite lodging and guides — ${SITE_NAME}`,
      description:
        "A small, curated directory of Yosemite-area lodging, outfitters, and guiding services, drawn from twenty seasons.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Directory", null]],
    },
    advertise: {
      title: `List your business — ${SITE_NAME}`,
      description:
        "How to list a Yosemite-area lodge, inn, guide service, or outfitter on The Talus Field directory.",
      ogType: "website",
    },
    newsletter: {
      title: `Sunday Field Notes — ${SITE_NAME}`,
      description:
        "A short weekly note on Yosemite when there is something to say. Free.",
      ogType: "website",
    },
    contact: {
      title: `Contact — ${SITE_NAME}`,
      description:
        "Send a note to the editor. Trip questions, corrections, press, or anything else.",
      ogType: "website",
    },
    privacy: {
      title: `Privacy Policy — ${SITE_NAME}`,
      description:
        "What information The Talus Field collects, how it is used, and your rights under GDPR and CCPA.",
      ogType: "website",
    },
    terms: {
      title: `Terms of Service — ${SITE_NAME}`,
      description:
        "Terms governing the use of The Talus Field, including content licensing and limitations of liability.",
      ogType: "website",
    },
    affiliate: {
      title: `Affiliate Disclosure — ${SITE_NAME}`,
      description:
        "How affiliate links work on The Talus Field, and the editorial standards that don't change for paid placements.",
      ogType: "website",
    },
    guide: {
      title: `The Field Guide — ${SITE_NAME}`,
      description:
        "An offline web app for Yosemite. Tappable GPS for the parking turnouts, quiet trailheads, and insider tactics locals use. Works when service dies.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["The Field Guide", null]],
      // Indexable pre-launch: the page carries a waitlist (GUIDE_ON_SALE in
      // page-guide.jsx) and accumulates search authority while it waits.
    },
    map: {
      title: `Yosemite Trip Planner Map — ${SITE_NAME}`,
      description:
        "An interactive Yosemite map of vistas, trailheads, parking turnouts, picnic spots, and places to eat, with a trip builder. Curated by a resident of the park. Free.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Map", null]],
      // Mirrors the edge's static WebPage node (edge/seo.js) so JS and non-JS
      // crawlers see the same entity. The pin list itself stays out of the
      // structured data until the points pass a ground-truth check.
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Yosemite Trip Planner Map — ${SITE_NAME}`,
        url: `${SITE_ORIGIN}/map`,
        description:
          "An interactive Yosemite map of vistas, trailheads, parking turnouts, picnic spots, and places to eat, with a trip builder. Curated by a resident of the park. Free.",
        isAccessibleForFree: true,
        inLanguage: "en-US",
        about: {
          "@type": "Place",
          name: "Yosemite National Park",
          geo: { "@type": "GeoCoordinates", latitude: 37.8651, longitude: -119.5383 },
        },
      },
    },
    conditions: {
      title: `Yosemite Conditions — webcams, waits, and weather — ${SITE_NAME}`,
      description:
        "Live Yosemite webcams, entrance wait times, and elevation-aware weather forecasts on one page. Check it the morning you drive in.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Conditions", null]],
    },
    now: {
      title: `This Week in the Park — the weekly Yosemite dispatch — ${SITE_NAME}`,
      description:
        "A short weekly note on what Yosemite is actually doing right now: what's open, what's flowing, what's blooming, and what changed. Written from inside the park.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["This Week in the Park", null]],
    },
    itineraries: {
      title: `Yosemite Itineraries — day plans on the map — ${SITE_NAME}`,
      description:
        "Curated Yosemite itineraries for one, two, or three days, plus a half-day plan for late arrivals. Each opens as a ready-made trip on the interactive map.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Itineraries", null]],
      // ItemList of TouristTrip nodes built from the same data the page
      // renders. Mirrors the hand-maintained literal in edge/seo.js.
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Yosemite itineraries",
        url: `${SITE_ORIGIN}/itineraries`,
        numberOfItems: (window.ITINERARIES || []).length,
        itemListElement: (window.ITINERARIES || []).map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "TouristTrip",
            name: it.title,
            description: it.dek,
            url: `${SITE_ORIGIN}/itineraries#${it.id}`,
            touristType: "National park visitors",
          },
        })),
      },
    },
  };
  const meta = known[route] || known.home;
  return {
    title: meta.title,
    description: meta.description,
    canonical: url,
    ogType: meta.ogType || "website",
    image: SITE_DEFAULT_IMAGE,
    jsonLd: meta.jsonLd || null,
    breadcrumb: meta.breadcrumb ? breadcrumbLd(meta.breadcrumb) : null,
    faq: meta.faq ? faqLd(meta.faq) : null,
    robots: meta.robots || null,
  };
}

// Default robots policy — must match the static <meta name="robots"> in
// index.html so we restore it when navigating off a hidden route.
const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

function removeMeta(name, attr = "name") {
  const el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (el) el.remove();
}

const ARTICLE_OG_TAGS = [
  "article:published_time",
  "article:modified_time",
  "article:author",
  "article:section",
];

// True once the first applySeo has run. functions/_middleware.js injects the
// per-route ld-faq / ld-trail into the static HTML for crawlers that don't run
// JS. On the very first paint (the only state a crawler that *does* render JS,
// e.g. Googlebot, ever sees per URL) we must not clear an edge-injected ld-faq
// just because this route carries no inline faq in data.js — that would strip
// the FAQ rich result on hydration. On later SPA navigations we clear as usual
// so stale schema does not bleed across routes.
let seoApplied = false;

function applySeo(route) {
  const seo = buildSeo(route);
  document.title = seo.title;
  setMeta("description", seo.description);
  setLink("canonical", seo.canonical);
  // Per-route robots override (the not-found route ships noindex).
  setMeta("robots", seo.robots || DEFAULT_ROBOTS);

  // Open Graph
  setMeta("og:title", seo.title, "property");
  setMeta("og:description", seo.description, "property");
  setMeta("og:url", seo.canonical, "property");
  setMeta("og:type", seo.ogType, "property");
  setMeta("og:image", seo.image, "property");
  setMeta("og:image:alt", seo.imageAlt || SITE_DEFAULT_DESC, "property");
  setMeta("og:site_name", SITE_NAME, "property");

  // Article-specific OG tags. Set on article routes, removed elsewhere so
  // they don't bleed across SPA navigations.
  if (seo.articleOg) {
    const og = seo.articleOg;
    if (og.publishedTime) setMeta("article:published_time", og.publishedTime, "property");
    else removeMeta("article:published_time", "property");
    if (og.modifiedTime) setMeta("article:modified_time", og.modifiedTime, "property");
    else removeMeta("article:modified_time", "property");
    if (og.author) setMeta("article:author", og.author, "property");
    else removeMeta("article:author", "property");
    if (og.section) setMeta("article:section", og.section, "property");
    else removeMeta("article:section", "property");
  } else {
    ARTICLE_OG_TAGS.forEach((t) => removeMeta(t, "property"));
  }

  // Twitter
  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", seo.title);
  setMeta("twitter:description", seo.description);
  setMeta("twitter:image", seo.image);

  // Per-page JSON-LD
  if (seo.jsonLd) setJsonLd("ld-page", seo.jsonLd);
  else clearJsonLd("ld-page");
  if (seo.breadcrumb) setJsonLd("ld-breadcrumb", seo.breadcrumb);
  else clearJsonLd("ld-breadcrumb");
  if (seo.faq) setJsonLd("ld-faq", seo.faq);
  else if (seoApplied) clearJsonLd("ld-faq");

  seoApplied = true;
}

// ============================================================
// Not found. Rendered for unknown paths, dead article slugs, and unknown
// sections; buildSeo pairs it with a noindex robots tag, and edge/seo.js
// serves the same routes with a real 404 status for crawlers.
// ============================================================
function NotFoundPage({ go }) {
  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">Off the trail</div>
          <h1>Page not found</h1>
          <p className="lede">
            There is nothing at this address. The link may be old, or the page
            may have moved.
          </p>
        </div>
      </div>
      <div className="wrap wrap--narrow" style={{ paddingBottom: 64 }}>
        <p>
          Good places to reorient:{" "}
          <a href="/articles" onClick={(e) => { e.preventDefault(); go("articles"); }}>the articles index</a>,{" "}
          <a href="/planning" onClick={(e) => { e.preventDefault(); go("planning"); }}>the planning guide</a>, or{" "}
          <a href="/map" onClick={(e) => { e.preventDefault(); go("map"); }}>the trip planner map</a>.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// App
// ============================================================
function App() {
  const [route, setRoute] = useState(() => {
    // Convert legacy hash URLs (e.g. /#a:foo, /#about) into real paths
    // so subsequent navigation and indexing use proper URLs. Legacy hash
    // URLs only ever lived at the root, so ignore in-page anchors like
    // /kit#overnight-pack that belong to a real page.
    if (window.location.hash && window.location.pathname === "/") {
      const fromHash = legacyHashToRoute(window.location.hash);
      if (fromHash) {
        const path = routeToPath(fromHash);
        window.history.replaceState({ route: fromHash }, "", path);
        return fromHash;
      }
    }
    return pathToRoute(window.location.pathname);
  });

  // Apply SEO whenever the route changes, then report the SPA navigation to
  // GA4. The gtag config in index.html already sends the initial pageview, so
  // the first render is skipped here to avoid a double count.
  const initialPageView = useRef(true);
  useEffect(() => {
    applySeo(route);
    if (initialPageView.current) {
      initialPageView.current = false;
      return;
    }
    window.track("page_view", {
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [route]);

  // GA4 click tracking. Delegated listener at the document root so it
  // survives every SPA navigation without rebinding. Anchors with a
  // data-aff-network attribute fire "affiliate_click"; any other anchor
  // leaving the site in a new tab (webcams, weather, NPS) fires
  // "outbound_click" with no per-link markup required.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      if (a.dataset.affNetwork) {
        window.track("affiliate_click", {
          aff_network: a.dataset.affNetwork || "unknown",
          aff_list: a.dataset.affList || "",
          aff_item_slug: a.dataset.affItemSlug || "",
          aff_name: a.dataset.affName || "",
          destination: a.href,
        });
        return;
      }
      if (a.target === "_blank" && a.host && a.host !== window.location.host) {
        window.track("outbound_click", {
          link_domain: a.host,
          link_url: a.href,
          location: window.location.pathname,
        });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Browser back/forward. The target route's bundle is awaited before the
  // route state commits (usually a no-op: bundles are prefetched on first
  // interaction); if it can't be fetched, a full reload retries from scratch.
  useEffect(() => {
    const onPop = () => {
      const r = pathToRoute(window.location.pathname);
      ensureRoute(r)
        .then(() => {
          setRoute(r);
          window.scrollTo({ top: 0 });
        })
        .catch(() => window.location.reload());
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = (r) => {
    const path = routeToPath(r);
    if (path !== window.location.pathname) {
      window.history.pushState({ route: r }, "", path);
    }
    // The URL updates immediately; the previous page stays rendered for the
    // (usually zero) beat the target bundle takes to arrive. A fetch failure
    // falls back to a full navigation, which retries everything.
    ensureRoute(r)
      .then(() => {
        setRoute(r);
        window.scrollTo({ top: 0 });
      })
      .catch(() => window.location.assign(path));
  };

  // Tweaks
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  useEffect(() => {
    document.documentElement.setAttribute("data-palette", tweaks.palette);
    document.documentElement.setAttribute("data-density", tweaks.density);
  }, [tweaks.palette, tweaks.density]);

  // Route resolution. Page components are read from window (each lazy bundle
  // registers its component there); ensureRoute guarantees they exist before
  // the route state commits, and the readiness guard below catches the only
  // remaining gap (a bundle that failed at boot).
  const mod = routeModule(route);
  const routeReady = !mod || mod.globals.every((n) => typeof window[n] !== "undefined");
  let page;
  let currentNav = "home";
  if (!routeReady) {
    page = (
      <div className="page">
        <div className="wrap wrap--narrow" style={{ padding: "64px 0" }}>
          <p>
            This page failed to load.{" "}
            <a href={routeToPath(route)}>Try again</a>.
          </p>
        </div>
      </div>
    );
  } else if (!routeExists(route)) {
    page = <NotFoundPage go={go} />;
  } else if (route === "home") {
    page = <window.HomePage go={go} />;
    currentNav = "home";
  } else if (route === "about") {
    page = <window.AboutPage go={go} />;
    currentNav = "about";
  } else if (route === "kit") {
    page = <window.KitPage go={go} />;
    currentNav = "kit";
  } else if (route === "places") {
    page = <window.PlacesPage go={go} />;
    currentNav = "places";
  } else if (route === "films") {
    page = <window.FilmsPage />;
    currentNav = "films";
  } else if (route === "advertise") {
    page = <window.AdvertisePage go={go} />;
  } else if (route === "articles") {
    page = <window.ArticlesIndex go={go} />;
    currentNav = "articles";
  } else if (route === "planning") {
    page = <window.PlanningGuide go={go} />;
    currentNav = "articles";
  } else if (route === "checklist") {
    page = <window.ChecklistPage go={go} />;
    currentNav = "articles";
  } else if (route.startsWith("cat:")) {
    page = <window.CategoryPage slug={route.slice(4)} go={go} />;
    currentNav = "articles";
  } else if (route.startsWith("a:")) {
    page = <window.ArticlePage slug={route.slice(2)} go={go} />;
    currentNav = "articles";
  } else if (route === "newsletter") {
    page = <window.NewsletterPage go={go} />;
    currentNav = "newsletter";
  } else if (route === "contact") {
    page = <window.ContactPage go={go} />;
    currentNav = "contact";
  } else if (route === "privacy") {
    page = <window.PrivacyPage />;
  } else if (route === "terms") {
    page = <window.TermsPage />;
  } else if (route === "affiliate") {
    page = <window.AffiliatePage />;
  } else if (route === "guide") {
    page = <window.GuidePage go={go} />;
  } else if (route === "itineraries") {
    page = <window.ItinerariesPage go={go} />;
    // currentNav stays "home" so no nav link highlights, matching /map.
  } else if (route === "conditions") {
    page = <window.ConditionsPage go={go} />;
  } else if (route === "now") {
    page = <window.NowPage go={go} />;
  } else if (route === "firefall") {
    page = <window.FirefallPage go={go} />;
    // currentNav stays "home"; the event page hangs off articles + /now links.
  } else if (route === "consult") {
    page = <window.ConsultPage go={go} />;
  } else if (route === "map") {
    page = <window.MapPage go={go} />;
    // currentNav stays "home" so no nav link highlights.
  } else {
    page = <NotFoundPage go={go} />;
  }

  // Exit-intent newsletter modal, mounted site-wide (outside the keyed <main>
  // so it persists across SPA navigation and does not re-arm). Suppressed on
  // pages where a popup is redundant or out of place.
  // "films" is included so the popup never interrupts a playing film.
  const exitDisabled = ["newsletter", "contact", "privacy", "terms", "affiliate", "films"].includes(route);

  return (
    <>
      <Header current={currentNav} go={go} />
      <main key={route}>{page}</main>
      <Footer go={go} />
      <ExitIntentNewsletter disabled={exitDisabled} />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Palette" subtitle="The look of every page on the site.">
          <TweakRadio
            value={tweaks.palette}
            onChange={(v) => setTweak("palette", v)}
            options={[
              { value: "golden",  label: "Golden hour" },
              { value: "granite", label: "Granite" },
              { value: "sierra",  label: "Sierra" },
            ]}
          />
        </TweakSection>
        <TweakSection title="Density" subtitle="Reading width and gutter.">
          <TweakRadio
            value={tweaks.density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "airy", label: "Airy" },
              { value: "dense", label: "Dense" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// Expose the route helpers so individual link components can render
// real href attributes that match what go() will navigate to.
window.routeToPath = routeToPath;
window.SITE_ORIGIN = SITE_ORIGIN;

// Boot-time registration check for the EAGER shell only (components.jsx and
// tweaks-panel.jsx). Page components are lazy-loaded per route and verified by
// ensureRoute after each load, so they are deliberately absent here.
const REQUIRED_GLOBALS = [
  "Header", "Footer", "ExitIntentNewsletter",
  "TweaksPanel", "useTweaks", "TweakSection", "TweakRadio",
];
const missingGlobals = REQUIRED_GLOBALS.filter((n) => typeof window[n] === "undefined");
if (missingGlobals.length) {
  console.error(
    "app.jsx boot: missing shell globals (a script failed to load or register):",
    missingGlobals.join(", ")
  );
  if (window.location.hostname === "localhost") {
    const warn = document.createElement("div");
    warn.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:9999;background:#b9453d;color:#fff;font:13px/1.4 monospace;padding:8px 14px;";
    warn.textContent = "Missing globals: " + missingGlobals.join(", ");
    document.body.appendChild(warn);
  }
}

// Boot. Load the initial route's page bundle, then render. The route
// computation mirrors App's useState initializer (including the legacy-hash
// translation) so the awaited bundle is always the one App will render.
const bootRoute = (() => {
  if (window.location.hash && window.location.pathname === "/") {
    const fromHash = legacyHashToRoute(window.location.hash);
    if (fromHash) return fromHash;
  }
  return pathToRoute(window.location.pathname);
})();

ensureRoute(bootRoute)
  .catch((e) => console.error("app.jsx boot: initial route bundle failed:", e))
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(<App />);

    // The static SEO <h1> in index.html exists for non-JS HTML parsers. Now
    // that React is mounting its own per-route <h1>, remove it so JS-rendering
    // crawlers (Google) and JS users see exactly one H1 per page.
    document.getElementById("seo-static-h1")?.remove();

    // The edge middleware injects prerendered prose into #root as
    // #prerender-prose for non-JS crawlers. createRoot().render() above
    // already replaces #root's children; remove it explicitly too so it never
    // flashes.
    document.getElementById("prerender-prose")?.remove();

    // Warm the remaining page bundles on the reader's first interaction so
    // SPA navigation is instant, without taxing first paint or lab metrics.
    const warm = () => prefetchAllModules();
    ["pointerdown", "keydown", "touchstart", "scroll"].forEach((ev) =>
      window.addEventListener(ev, warm, { once: true, passive: true })
    );
  });
