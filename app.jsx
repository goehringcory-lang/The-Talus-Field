/* global React, ReactDOM, Header, Footer,
   HomePage, AboutPage, ArticlesIndex, CategoryPage, ArticlePage,
   KitPage, PlacesPage, AdvertisePage, GuidePage, MapPage,
   PlanningGuide, ChecklistPage,
   NewsletterPage, ContactPage, PrivacyPage, TermsPage, AffiliatePage,
   TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle */

const { useState, useEffect } = React;

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

function pathToRoute(pathname) {
  const path = (pathname || "/").replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  if (path === "/articles") return "articles";
  const article = path.match(/^\/articles\/([a-z0-9-]+)$/i);
  if (article) return `a:${article[1]}`;
  const section = path.match(/^\/section\/([a-z0-9-]+)$/i);
  if (section) return `cat:${section[1]}`;
  const simple = path.match(/^\/([a-z0-9-]+)$/i);
  if (simple) return simple[1];
  return "home";
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
const SITE_TAGLINE = "Yosemite, written from inside it";
const SITE_DEFAULT_IMAGE = `${SITE_ORIGIN}/img/Half%20Dome%20Main%20Photo.jpg`;
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

  // Article
  if (route.startsWith("a:")) {
    const slug = route.slice(2);
    const a = window.findArticle && window.findArticle(slug);
    if (a) {
      const cat = window.findCategory(a.cat);
      const image = absolute(a.image || "img/Half%20Dome%20Main%20Photo.jpg");
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
          author: {
            "@type": "Person",
            name: window.SITE.authorName,
            url: `${SITE_ORIGIN}/about`,
          },
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
      numberOfItems: list.items.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      url: `${SITE_ORIGIN}/kit#${list.slug}`,
      itemListElement: list.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        description: it.note,
      })),
    }));
    return {
      title: `Kit: What I carry in Yosemite — ${SITE_NAME}`,
      description:
        "Three gear lists for Yosemite: a day pack, an overnight pack, and a car kit. The actual items, each with the reasoning behind it.",
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
        "Plan a Yosemite trip in 2026: gateway towns, reservations, Half Dome, smoke season, the seasonal calendar. A hub for The Talus Field's planning archive.",
      ogType: "website",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Planning Guide", null]],
      faq: [
        { q: "Do I need a reservation to enter Yosemite in 2026?", a: "No. The day-use vehicle reservation system is not in effect in 2026. A standard Yosemite entrance pass ($35 per vehicle, valid 7 days) is required." },
        { q: "What is the best time of year to visit Yosemite?", a: "Late May through early June for peak waterfalls and moderate crowds. September and October for warm days, smaller crowds, and golden light. July and August are the most crowded months." },
        { q: "How much does it cost to enter Yosemite?", a: "$35 per vehicle (7-day pass), $20 per person on foot or bike. The America the Beautiful annual pass ($80) covers all national parks for one year." },
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
    },
    map: {
      // Hidden preview. URL-only access while the feature is being tested.
      // robots:noindex keeps it out of search even if someone shares the URL.
      title: `Map — ${SITE_NAME}`,
      description: SITE_DEFAULT_DESC,
      ogType: "website",
      robots: "noindex, nofollow",
    },
  };
  const meta = known[route] || known.home;
  return {
    title: meta.title,
    description: meta.description,
    canonical: url,
    ogType: meta.ogType || "website",
    image: SITE_DEFAULT_IMAGE,
    jsonLd: null,
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

function applySeo(route) {
  const seo = buildSeo(route);
  document.title = seo.title;
  setMeta("description", seo.description);
  setLink("canonical", seo.canonical);
  // Per-route robots override (e.g. /map ships with noindex while hidden).
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
  else clearJsonLd("ld-faq");
}

// ============================================================
// App
// ============================================================
function App() {
  const [route, setRoute] = useState(() => {
    // Convert legacy hash URLs (e.g. /#a:foo, /#about) into real paths
    // so subsequent navigation and indexing use proper URLs.
    if (window.location.hash) {
      const fromHash = legacyHashToRoute(window.location.hash);
      if (fromHash) {
        const path = routeToPath(fromHash);
        window.history.replaceState({ route: fromHash }, "", path);
        return fromHash;
      }
    }
    return pathToRoute(window.location.pathname);
  });

  // Apply SEO whenever the route changes.
  useEffect(() => {
    applySeo(route);
  }, [route]);

  // GA4 affiliate-click tracking. Delegated listener at the document root so it
  // survives every SPA navigation without rebinding. Any anchor with a
  // data-aff-network attribute fires an "affiliate_click" event.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest("a[data-aff-network]");
      if (!a) return;
      if (typeof window.gtag !== "function") return;
      window.gtag("event", "affiliate_click", {
        aff_network: a.dataset.affNetwork || "unknown",
        aff_list: a.dataset.affList || "",
        aff_item_slug: a.dataset.affItemSlug || "",
        aff_name: a.dataset.affName || "",
        destination: a.href,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Browser back/forward.
  useEffect(() => {
    const onPop = () => {
      setRoute(pathToRoute(window.location.pathname));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = (r) => {
    const path = routeToPath(r);
    if (path !== window.location.pathname) {
      window.history.pushState({ route: r }, "", path);
    }
    setRoute(r);
    window.scrollTo({ top: 0 });
  };

  // Tweaks
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  useEffect(() => {
    document.documentElement.setAttribute("data-palette", tweaks.palette);
    document.documentElement.setAttribute("data-density", tweaks.density);
  }, [tweaks.palette, tweaks.density]);

  // Route resolution
  let page;
  let currentNav = "home";
  if (route === "home") {
    page = <HomePage go={go} />;
    currentNav = "home";
  } else if (route === "about") {
    page = <AboutPage go={go} />;
    currentNav = "about";
  } else if (route === "kit") {
    page = <KitPage go={go} />;
    currentNav = "kit";
  } else if (route === "places") {
    page = <PlacesPage go={go} />;
    currentNav = "places";
  } else if (route === "advertise") {
    page = <AdvertisePage go={go} />;
  } else if (route === "articles") {
    page = <ArticlesIndex go={go} />;
    currentNav = "articles";
  } else if (route === "planning") {
    page = <PlanningGuide go={go} />;
    currentNav = "articles";
  } else if (route === "checklist") {
    page = <ChecklistPage go={go} />;
    currentNav = "articles";
  } else if (route.startsWith("cat:")) {
    page = <CategoryPage slug={route.slice(4)} go={go} />;
    currentNav = "articles";
  } else if (route.startsWith("a:")) {
    page = <ArticlePage slug={route.slice(2)} go={go} />;
    currentNav = "articles";
  } else if (route === "newsletter") {
    page = <NewsletterPage go={go} />;
    currentNav = "newsletter";
  } else if (route === "contact") {
    page = <ContactPage go={go} />;
    currentNav = "contact";
  } else if (route === "privacy") {
    page = <PrivacyPage />;
  } else if (route === "terms") {
    page = <TermsPage />;
  } else if (route === "affiliate") {
    page = <AffiliatePage />;
  } else if (route === "guide") {
    page = <GuidePage go={go} />;
  } else if (route === "map") {
    // Hidden preview route. Intentionally not added to the nav, sitemap, or
    // article footer — typed-URL access only while the feature is tested.
    page = <MapPage go={go} />;
    // currentNav stays "home" so no nav link highlights.
  } else {
    page = <HomePage go={go} />;
  }

  return (
    <>
      <Header current={currentNav} go={go} />
      <main key={route}>{page}</main>
      <Footer go={go} />

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

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// The static SEO <h1> in index.html exists for non-JS HTML parsers. Now that
// React is mounting its own per-route <h1>, remove it so JS-rendering crawlers
// (Google) and JS users see exactly one H1 per page.
document.getElementById("seo-static-h1")?.remove();
