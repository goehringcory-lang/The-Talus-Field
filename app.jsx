/* global React, ReactDOM, Header, Footer,
   HomePage, AboutPage, ArticlesIndex, CategoryPage, ArticlePage,
   KitPage, PlacesPage, AdvertisePage,
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
  "A field journal of Yosemite National Park, kept by a resident. Trail conditions, planning notes, wildlife, and longer essays on the park's seasons, geology, and life.";

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
      const desc = a.dek;
      return {
        title: `${a.title} — ${SITE_NAME}`,
        description: desc,
        canonical: url,
        ogType: "article",
        image,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: desc,
          image: [image],
          datePublished: a.date,
          dateModified: a.date,
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
              url: `${SITE_ORIGIN}/img/talus-field-mark.png`,
            },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          isAccessibleForFree: true,
          inLanguage: "en-US",
        },
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
            datePublished: a.date,
          })),
        },
      };
    }
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
    about: {
      title: `About — ${SITE_NAME}`,
      description:
        "About The Talus Field, an independent field journal of Yosemite kept by Cory Goehring, a resident of the park.",
      ogType: "website",
    },
    kit: {
      title: `Kit — What I carry in Yosemite — ${SITE_NAME}`,
      description:
        "Gear lists for Yosemite: a day pack, an overnight pack, and a car kit. Each item with the reasoning behind it.",
      ogType: "website",
    },
    places: {
      title: `Places & People — Yosemite lodging and guides — ${SITE_NAME}`,
      description:
        "A small, curated directory of Yosemite-area lodging, outfitters, and guiding services, drawn from twenty seasons.",
      ogType: "website",
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
  };
  const meta = known[route] || known.home;
  return {
    title: meta.title,
    description: meta.description,
    canonical: url,
    ogType: meta.ogType || "website",
    image: SITE_DEFAULT_IMAGE,
    jsonLd: null,
  };
}

function applySeo(route) {
  const seo = buildSeo(route);
  document.title = seo.title;
  setMeta("description", seo.description);
  setLink("canonical", seo.canonical);

  // Open Graph
  setMeta("og:title", seo.title, "property");
  setMeta("og:description", seo.description, "property");
  setMeta("og:url", seo.canonical, "property");
  setMeta("og:type", seo.ogType, "property");
  setMeta("og:image", seo.image, "property");
  setMeta("og:site_name", SITE_NAME, "property");

  // Twitter
  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", seo.title);
  setMeta("twitter:description", seo.description);
  setMeta("twitter:image", seo.image);

  // Per-page JSON-LD
  if (seo.jsonLd) setJsonLd("ld-page", seo.jsonLd);
  else clearJsonLd("ld-page");
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
