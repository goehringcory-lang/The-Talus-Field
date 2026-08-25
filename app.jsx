/* global React, ReactDOM, Header, Footer, KeepGoing, ExitIntentNewsletter,
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
  "guide", "map", "films", "itineraries", "conditions", "now", "firefall", "stay",
  "consult", "widget", "partners", "search", "tioga-opening", "half-dome-lottery",
  "explore", "distances", "webcams",
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
// register. Section (cat:) routes resolve to the "articles" entry below in
// routeModule — CategoryPage is registered by page-articles.js, NOT the eager
// components bundle, so a section render still has to await ensureRoute.
const PAGE_MODULES = {
  home: { scripts: ["/dist/page-home.js"], globals: ["HomePage"] },
  about: { scripts: ["/dist/page-about.js"], globals: ["AboutPage"] },
  kit: { scripts: ["/dist/page-kit.js"], globals: ["KitPage"] },
  places: { scripts: ["/dist/page-places.js"], globals: ["PlacesPage"] },
  advertise: { scripts: ["/dist/page-advertise.js"], globals: ["AdvertisePage"] },
  // The intent model (taxonomy + trip selector) rides along on the two routes
  // that render it. /planning also pulls the itineraries data so the trip
  // selector can hand back a real /map?trip= link rather than a generic pointer
  // at /itineraries.
  articles: { scripts: ["/intent-data.js", "/dist/intent.js", "/dist/page-articles.js"], globals: ["ArticlesIndex", "CategoryPage", "IntentFilters", "useIntentFilters"] },
  planning: { scripts: ["/itineraries-data.js", "/intent-data.js", "/dist/intent.js", "/dist/page-planning-guide.js"], globals: ["PlanningGuide", "TripSelector", "IntentFilters", "useIntentFilters"] },
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
  stay: { scripts: ["/dist/page-stay.js"], globals: ["StayPage"] },
  now: { scripts: ["/dist/page-now.js"], globals: ["BulletinPage"] },
  firefall: { scripts: ["/dist/page-firefall.js"], globals: ["FirefallPage"] },
  consult: { scripts: ["/dist/page-consult.js"], globals: ["ConsultPage"] },
  widget: { scripts: ["/dist/page-widget.js"], globals: ["WidgetPage"] },
  partners: { scripts: ["/dist/page-partners.js"], globals: ["PartnersPage"] },
  search: { scripts: ["/dist/page-search.js"], globals: ["SearchPage"] },
  // videos-data.js rides along so the index can print a real film count rather
  // than a number that would go stale the next time an episode is added.
  explore: { scripts: ["/videos-data.js", "/dist/page-explore.js"], globals: ["ExplorePage"] },
  "tioga-opening": { scripts: ["/dist/page-tioga-opening.js"], globals: ["TiogaOpeningPage"] },
  "half-dome-lottery": { scripts: ["/dist/page-half-dome-lottery.js"], globals: ["HalfDomeLotteryPage"] },
  distances: { scripts: ["/dist/page-distances.js"], globals: ["DistancesPage"] },
  webcams: { scripts: ["/dist/page-webcams.js"], globals: ["WebcamsPage"] },
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
    }).catch((err) => {
      // Only successes stay cached. The prefetch warm-up loads every bundle
      // at once, and caching one flaky failure would poison its route for the
      // whole session: every later click falls back to a full page load.
      delete loadedScripts[src];
      throw err;
    });
  }
  return loadedScripts[src];
}

async function ensureRoute(route) {
  const mod = routeModule(route);
  if (!mod) return;

  // Article bodies load alongside the page bundle, not after it. They used to
  // arrive on a second hop: page-article.js rendered, its effect fired, and
  // only then was /dist/bodies/<slug>.js injected. That cost a visible
  // "Loading…" flash, and it appears to have cost the site its internal link
  // graph. Search Console counts internal links from the RENDERED page, and
  // the whole site had 33 link targets, which is exactly the number of
  // distinct links in the masthead and footer combined: the in-body links,
  // 59 distinct article targets across the catalog, were not being counted at
  // all. A body that is already registered before the first commit renders
  // inside it, because ArticlePage's useState initializer reads
  // window.ARTICLE_BODIES[slug] synchronously.
  //
  // Three guards. The findArticle gate keeps an unknown slug on the normal
  // not-found path instead of rejecting here (a rejection makes go() fall back
  // to a full page load). The catch means a flaky body fetch degrades to the
  // component's own async load rather than blocking the route. And this lives
  // in ensureRoute rather than in loadScriptOnce or prefetchAllModules, so the
  // interaction warm-up does not pull all 61 bodies down at once.
  const slug = route.startsWith("a:") ? route.slice(2) : null;
  const body =
    slug && window.findArticle && window.findArticle(slug) && window.loadArticleBody
      ? window.loadArticleBody(slug).catch(() => {})
      : null;

  // The script chain stays sequential. Several routes list a data file ahead of
  // the bundle that consumes it (intent-data.js before dist/intent.js, and so
  // on), and loading those in parallel would be a race. Only the body, which
  // depends on nothing here, overlaps it.
  const scripts = (async () => {
    for (const src of mod.scripts) await loadScriptOnce(src);
  })();

  await Promise.all([scripts, body]);
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

// Map old hash URLs (#a:slug, #cat:slug, #foo) to the new route keys. Only
// hashes that name a real route are rewritten: the home shell ships real
// in-page anchors on / (e.g. #start-here), and rewriting one of those turned
// the homepage's own hero CTA into a 404 on reload.
function legacyHashToRoute(hash) {
  if (!hash) return null;
  const h = hash.replace(/^#+/, "");
  if (!h) return "home";
  if (h.startsWith("a:") || h.startsWith("cat:")) return h;
  return STATIC_ROUTE_KEYS.has(h) ? h : null;
}

// ============================================================
// SEO. Per-route title, description, canonical, robots, JSON-LD.
// Search engines (Google) and AI crawlers (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended) read these on render.
// ============================================================
const SITE_NAME = "The Talus Field";
// Single author node defined in index.html (<script id="ld-person">). Article
// schema references it by @id so there is one Person entity for the whole site,
// matching edge/seo.js (the edge Worker) and the Organization founder.
const PERSON_ID = `${SITE_ORIGIN}/#person-cory-goehring`;
// The homepage title, and the one page title that does not end in SITE_NAME.
// It leads with the brand on purpose: the site ranked around position 16 for
// "talus field", its own name, against the geology term it is named after, and
// a title built from the bare brand plus a tagline gave Google nothing to
// distinguish the two. "The Talus Field Journal" is the form people say out
// loud, and Search Console shows them misspelling it ("tallus field",
// "talisfield"), which means the name is travelling by word of mouth and not
// landing.
//
// This string is duplicated byte for byte in index.html (<title>, og:title,
// twitter:title) and in the other of app.jsx / edge/seo.js, because `/` is
// served straight off the asset layer and never invokes the Worker, so
// index.html is what a homepage visitor actually gets. All five must move
// together; scripts/check-home-title.mjs fails the build if they drift.
const HOME_TITLE = "The Talus Field Journal — Yosemite field notes, conditions, and guides";
// 1200x630 landscape card generated by scripts/gen-responsive-images.mjs —
// matches the og:image:width/height declared in index.html and the edge
// default in edge/seo.js.
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
            // seoDek first, like the edge — the two renders should describe
            // each part with the same text.
            description: a.seoDek || a.dek,
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
  // uploadDate rides on an episode's sourced `uploaded` date and is omitted
  // when there is none: Google requires the field, but a full date derived from
  // the bare publication `year` would be a fabrication, and a false fact in
  // structured data is worse than a missing one. Mirrors edge/seo.js; populate
  // with scripts/fetch-video-dates.mjs.
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
        // ListItem wrappers, not bare VideoObjects with a position property:
        // schema.org puts position on the ListItem. Mirrors edge/seo.js.
        itemListElement: episodes.map((ep, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "VideoObject",
            name: ep.title,
            description: ep.dek,
            thumbnailUrl: `https://i.ytimg.com/vi/${ep.youtubeId}/hqdefault.jpg`,
            embedUrl: `https://www.youtube-nocookie.com/embed/${ep.youtubeId}`,
            ...(ep.uploaded ? { uploadDate: ep.uploaded } : {}),
            publisher: { "@type": "Organization", name: "National Park Service" },
            isAccessibleForFree: true,
          },
        })),
      },
      breadcrumb: breadcrumbLd([
        ["Home", `${SITE_ORIGIN}/`],
        ["Films", null],
      ]),
    };
  }

  // Articles index. CollectionPage whose mainEntity is the full catalog as an
  // ItemList. Mirrored at the edge in edge/seo.js; building it
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
      breadcrumb: breadcrumbLd([
        ["Home", `${SITE_ORIGIN}/`],
        ["Articles", null],
      ]),
      faq: null,
    };
  }

  // Static known routes
  const known = {
    home: {
      title: HOME_TITLE,
      description: SITE_DEFAULT_DESC,
      ogType: "website",
    },
    // No "articles" entry here: that route early-returns from its own branch
    // above (CollectionPage + ItemList), so an entry in this table would be
    // dead code an edit could silently land in.
    planning: {
      title: `The Yosemite Planning Guide — ${SITE_NAME}`,
      description:
        "Plan a Yosemite trip in 2026: entrances, gateway towns, permits, Half Dome, accessibility, smoke season, month by month. A curated hub through the planning archive.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Planning Guide", null]],
      // Kept word-for-word in sync with edge/seo.js "/planning" — applySeo
      // replaces the edge-injected #ld-faq with this copy on hydration, so a
      // drifted answer here means Googlebot indexes different FAQ text than
      // non-JS crawlers see.
      faq: [
        { q: "Do I need a reservation to enter Yosemite in 2026?", a: "No. The day-use vehicle reservation system is not in effect in 2026. A standard Yosemite entrance pass ($35 per vehicle, valid 7 days) is required." },
        { q: "What is the best time of year to visit Yosemite?", a: "Late May through early June for peak waterfalls and moderate crowds. September and October for warm days, smaller crowds, and golden light. July and August are the most crowded months. April has spring waterfalls but Tioga Road and Glacier Point Road are usually still closed." },
        { q: "How much does it cost to enter Yosemite?", a: "$35 per vehicle (7-day pass), $20 per person entering on foot or bike. Since January 1, 2026, international visitors pay a $100 per-person surcharge (age 16 and older). The America the Beautiful annual pass ($80 for U.S. residents, $250 for nonresidents) covers entry to all national parks for one year." },
        { q: "How long should I spend at Yosemite?", a: "Minimum two full days: one for the Valley floor, one for a second area like Glacier Point, Mariposa Grove, or Tioga Road. Three to four days lets you cover all of these without rushing. A single-day trip is doable but you'll be moving the entire time." },
        { q: "Is Yosemite open year-round?", a: "Yosemite Valley is open year-round. Tioga Road (Highway 120 through the park) is typically closed November through May. Glacier Point Road closes in late November and reopens around Memorial Day. Mariposa Grove is open year-round but the tram is seasonal. Some campgrounds have seasonal closures." }
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
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["List your business", null]],
    },
    newsletter: {
      title: `Sunday Field Notes — ${SITE_NAME}`,
      description:
        "A short weekly note on Yosemite when there is something to say. Free.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Newsletter", null]],
    },
    contact: {
      title: `Contact — ${SITE_NAME}`,
      description:
        "Send a note to the editor. Trip questions, corrections, press, or anything else.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Contact", null]],
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
        "The offline Yosemite guide: 81 entries with tappable GPS, time budgets, and crowd swaps, all 57 day hikes, a drive-order trip planner, and a topo map that works when service dies.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["The Field Guide", null]],
      // On sale since the July 2026 flip (GUIDE_ON_SALE in page-guide.jsx):
      // the page carries the live buy box.
      // FAQ pairs mirror GUIDE_FAQ in page-guide.jsx and the known["/guide"]
      // entry in edge/seo.js. All three carry the same questions and answers,
      // kept in sync by hand (the /partners pattern): the published page copy
      // is the canonical text.
      faq: [
        {
          q: "Does it really work with no cell service?",
          a: "Yes. One tap downloads the whole guide, about 50 MB: every entry, every photo, all 57 hike tracks, and a topographic map of the park. Only the live extras need signal: webcams, entrance waits, and fresh weather and program updates.",
        },
        {
          q: "Is it an App Store app?",
          a: "No. It is a web app you add to your home screen in one step, on iPhone or Android. No store account, no install wait, no version to manage. Once it is there it looks and behaves like a native app.",
        },
        {
          q: "What happens right after I pay?",
          a: "Stripe handles checkout. Within about a minute you get an email with a sign-in link and a 6-digit code. Both keep working for the full 18 months, so you can sign in on a new device whenever you like.",
        },
        {
          q: "How many devices can I use it on?",
          a: "Every device you personally own. Phone at the trailhead, tablet in the car, laptop the night before. The same code signs them all in.",
        },
        {
          q: "Is it a subscription?",
          a: "No. You pay $3.99 once and access runs 18 months. Nothing auto-renews. Near the end you are offered a discounted renewal, and if you do nothing, access simply ends.",
        },
        {
          q: "What if I lose the email or can't sign in?",
          a: "Email cory@thetalusfieldjournal.com and it gets sorted. The sign-in link and the code stay reusable for the whole 18 months, so finding the original email is usually the fix.",
        },
        {
          q: "What is the refund policy?",
          a: "If the guide does not work as described, email within 30 days of purchase and it is refunded in full. After a refund the access code is deactivated. The full policy is on the terms page.",
        },
        {
          q: "What do I get that the free site doesn't already give me?",
          a: "The complete library: 81 entries including the 37-entry Secret Guide, all 57 day hikes with verified GPS tracks, the drag-and-drop trip builder, and the offline download. The free site keeps the articles, the trip map, the itineraries, and the conditions board.",
        },
        {
          q: "Does the guide change after I buy it?",
          a: "Yes. Updates, seasonal addenda, and Secret Guide additions push silently through your access window. Nothing to re-download, nothing extra to pay.",
        },
      ],
    },
    map: {
      title: `Yosemite Trip Planner Map — ${SITE_NAME}`,
      description:
        "An interactive Yosemite map of vistas, trailheads, parking turnouts, picnic spots, and places to eat, with a trip builder. Curated by a resident of the park. Free with an email signup.",
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
          "An interactive Yosemite map of vistas, trailheads, parking turnouts, picnic spots, and places to eat, with a trip builder. Curated by a resident of the park. Free with an email signup.",
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
      title: `The Park Bulletin — what's happening in Yosemite right now — ${SITE_NAME}`,
      description:
        "Everything happening in Yosemite on one page: closures, roads, free ranger programs, dated events, trail status, hours, and phone numbers, updated each Guide edition.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["The Park Bulletin", null]],
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
    // Event, service, and embed pages. These mirror the edge copy in
    // edge/seo.js so SPA navigation applies the same title/description a
    // direct load gets (routes missing here silently fall back to home meta).
    firefall: {
      title: `The Yosemite Firefall — dates, conditions, and how to plan — ${SITE_NAME}`,
      description:
        "When the Horsetail Fall firefall happens, the three conditions that must line up, and how to plan a February evening around uncertain odds. By a park resident.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Firefall", null]],
    },
    "tioga-opening": {
      title: `The Tioga Road Opening — when it opens and how to plan — ${SITE_NAME}`,
      description:
        "How the Tioga Road opening actually works: why the date is announced only days ahead, what is really open in week one, and how to drive the early season well. By a park resident.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Tioga opening", null]],
    },
    "half-dome-lottery": {
      title: `The Half Dome Lottery — calendar, odds, and strategy — ${SITE_NAME}`,
      description:
        "Both Half Dome permit lotteries explained: the March preseason draw, the daily lottery almost nobody uses, the honest odds, and the strategy that actually works. By a park resident.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Half Dome lottery", null]],
    },
    webcams: {
      title: `Yosemite Webcams — the live views worth checking — ${SITE_NAME}`,
      description:
        "Live Yosemite webcams: Half Dome, Yosemite Falls, El Capitan and Wawona, what each camera shows, how often it refreshes, and how to read them before you drive in.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Webcams", null]],
    },
    distances: {
      title: `Yosemite Drive Times — every gateway town, in one table — ${SITE_NAME}`,
      description:
        "How far Yosemite Valley is from El Portal, Mariposa, Groveland, Oakhurst and Lee Vining: miles, drive times, entrances, elevations and what the season does to each route.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Distances", null]],
    },
    consult: {
      title: `Field Consult — thirty minutes on your Yosemite plan — ${SITE_NAME}`,
      description:
        "A one-on-one planning consult with a Yosemite naturalist: your dates, group, and constraints, turned into a plan that fits the park. $95, thirty minutes, a few slots a month.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Field consult", null]],
    },
    widget: {
      title: `Yosemite Conditions Widget — free embed for area businesses — ${SITE_NAME}`,
      description:
        "A free embeddable box with live Yosemite entrance waits and the three-day Valley forecast, for gateway hotels, rental hosts, and tour operators. One script tag.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Widget", null]],
    },
    // Four routes the edge has always carried but this table did not, so an
    // SPA navigation to them silently fell back to homepage meta (a direct
    // load was correct, a click was not). Titles and descriptions mirror
    // edge/seo.js.
    stay: {
      title: `Where to Stay in Yosemite — in-park lodging and gateway towns — ${SITE_NAME}`,
      description:
        "Every place to sleep in and around Yosemite, compared honestly: the six in-park lodges and camps, the five gateway towns with real drive times, and how the 366-day booking window actually works.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Where to stay", null]],
    },
    partners: {
      title: `Group Codes — the Yosemite Field Guide for your guests — ${SITE_NAME}`,
      description:
        "Yosemite-area hotels, inns, rental hosts, and property managers: buy The Talus Field Guide in packs and give every guest a code. Offline app, 18 months of access, nothing to install on your side.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Group codes", null]],
    },
    search: {
      title: `Search — ${SITE_NAME}`,
      description:
        "Search every article, section, and page in The Talus Field: Yosemite planning notes, trail reports, wildlife and natural history, and seasonal guides.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Search", null]],
      // Matches the edge: a results page is thin, duplicative content and
      // every ?q= is another near-identical URL.
      robots: "noindex, follow",
    },
    explore: {
      title: `Site index — every page on the site — ${SITE_NAME}`,
      description:
        "Every page in The Talus Field, grouped and described: the sections, the Park Bulletin, the Nature Notes archive and films, the map, lodging, and the Field Guide app.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Site index", null]],
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

// True once the first applySeo has run. edge/seo.js injects the
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
          <a href="/explore" onClick={(e) => { e.preventDefault(); go("explore"); }}>the site index</a>,{" "}
          <a href="/search" onClick={(e) => { e.preventDefault(); go("search"); }}>search</a>,{" "}
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
  // After an SPA navigation, focus lands on <main> (React unmounted whatever
  // held it, which drops focus to <body> and strands keyboard and
  // screen-reader users at the top of the document with nothing announced).
  // Flagged in go()/onPop but performed in an effect: the keyed <main> only
  // exists after the route render commits, and focusing the old one would
  // hand focus right back to <body> on the remount. Initial load is not a
  // navigation, so the flag starts false. preventScroll: the scrollTo in
  // go()/onPop already owns the viewport.
  const navigatedRef = useRef(false);
  useEffect(() => {
    if (!navigatedRef.current) return;
    navigatedRef.current = false;
    const el = document.getElementById("main");
    if (el) el.focus({ preventScroll: true });
  }, [route]);

  // Navigations await the target bundle before the route commits, so two in
  // quick succession can resolve out of order and the slower bundle would
  // paint under the faster one's URL. Each navigation takes a ticket; a
  // resolution (or failure) that is no longer the latest ticket is dropped —
  // without the guard on .catch, a stale failed fetch would yank the reader
  // back to a page they already left.
  const navTokenRef = useRef(0);

  useEffect(() => {
    const onPop = () => {
      const r = pathToRoute(window.location.pathname);
      const token = ++navTokenRef.current;
      ensureRoute(r)
        .then(() => {
          if (token !== navTokenRef.current) return;
          navigatedRef.current = true;
          setRoute(r);
          window.scrollTo({ top: 0 });
        })
        .catch(() => {
          if (token === navTokenRef.current) window.location.reload();
        });
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
    const token = ++navTokenRef.current;
    ensureRoute(r)
      .then(() => {
        if (token !== navTokenRef.current) return;
        navigatedRef.current = true;
        setRoute(r);
        window.scrollTo({ top: 0 });
      })
      .catch(() => {
        if (token === navTokenRef.current) window.location.assign(path);
      });
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
    page = <window.FilmsPage go={go} />;
    currentNav = "films";
  } else if (route === "advertise") {
    page = <window.AdvertisePage go={go} />;
    currentNav = "advertise";
  } else if (route === "articles") {
    page = <window.ArticlesIndex go={go} />;
    currentNav = "articles";
  } else if (route === "planning") {
    page = <window.PlanningGuide go={go} />;
    currentNav = "planning";
  } else if (route === "checklist") {
    page = <window.ChecklistPage go={go} />;
    currentNav = "checklist";
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
    currentNav = "guide";
  } else if (route === "itineraries") {
    page = <window.ItinerariesPage go={go} />;
    currentNav = "itineraries";
  } else if (route === "search") {
    page = <window.SearchPage go={go} />;
    currentNav = "search";
  } else if (route === "explore") {
    page = <window.ExplorePage go={go} />;
    currentNav = "explore";
  } else if (route === "stay") {
    page = <window.StayPage go={go} />;
    currentNav = "stay";
  } else if (route === "conditions") {
    page = <window.ConditionsPage go={go} />;
    currentNav = "conditions";
  } else if (route === "now") {
    page = <window.BulletinPage go={go} />;
    currentNav = "now";
  } else if (route === "webcams") {
    page = <window.WebcamsPage go={go} />;
    currentNav = "webcams";
  } else if (route === "distances") {
    page = <window.DistancesPage go={go} />;
    currentNav = "distances";
  } else if (route === "firefall") {
    page = <window.FirefallPage go={go} />;
    currentNav = "firefall";
  } else if (route === "tioga-opening") {
    page = <window.TiogaOpeningPage go={go} />;
    currentNav = "tioga-opening";
  } else if (route === "half-dome-lottery") {
    page = <window.HalfDomeLotteryPage go={go} />;
    currentNav = "half-dome-lottery";
  } else if (route === "consult") {
    page = <window.ConsultPage go={go} />;
    currentNav = "consult";
  } else if (route === "widget") {
    page = <window.WidgetPage go={go} />;
    currentNav = "widget";
  } else if (route === "partners") {
    page = <window.PartnersPage go={go} />;
    currentNav = "partners";
  } else if (route === "map") {
    page = <window.MapPage go={go} />;
    // Real key: BottomNav hides itself on the map (the bottom sheet owns
    // that edge) and the Plan a Trip group highlights its member route.
    currentNav = "map";
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
      {/* id + tabIndex: the skip link's target, and where go() parks focus
          after each SPA navigation. */}
      <main key={route} id="main" tabIndex={-1}>
        {page}
        {/* Curated onward links, keyed by route (see KEEP_GOING in
            components.jsx). Mounted here rather than pasted into twenty page
            components, and skipped entirely on routes that are not in the
            table — articles carry their own related-reading rails, and the
            legal pages and the home page do not want one. */}
        {routeReady && <KeepGoing route={routeExists(route) ? route : "notfound"} go={go} />}
      </main>
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
  "Header", "Footer", "KeepGoing", "ExitIntentNewsletter",
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

    // Same for the homepage's static above-the-fold shell (baked into
    // index.html by scripts/gen-home-shell.mjs), which is what painted before
    // this boot ran.
    document.getElementById("home-shell")?.remove();

    // Drop the pre-React marker so SPA navigations get the .page entry
    // animation again. Deferred a frame so it cannot suppress the animation's
    // own starting styles for the first render.
    requestAnimationFrame(() => document.documentElement.removeAttribute("data-boot"));

    // Warm the remaining page bundles on the reader's first interaction so
    // SPA navigation is instant, without taxing first paint or lab metrics.
    const warm = () => prefetchAllModules();
    ["pointerdown", "keydown", "touchstart", "scroll"].forEach((ev) =>
      window.addEventListener(ev, warm, { once: true, passive: true })
    );
  });
