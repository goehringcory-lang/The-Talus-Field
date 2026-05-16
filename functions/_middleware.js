// Cloudflare Pages Function. Rewrites the static index.html on the edge so
// each route ships its own <title>, meta description, canonical, Open Graph,
// Twitter, and JSON-LD structured data — without a build step.
//
// Why this exists: the editorial site is a client-rendered SPA. Without this
// rewrite, every URL serves the homepage's <head>, so non-JS crawlers (most
// AI bots, social card scrapers, Bingbot under load) see the same metadata
// for every article. The browser-side code in app.jsx still updates these
// tags after hydration; this just makes the static HTML correct from the
// first byte.

import articles from "../articles.json" with { type: "json" };
import categories from "../categories.json" with { type: "json" };

const SITE_ORIGIN = "https://thetalusfieldjournal.com";
const SITE_NAME = "The Talus Field";
const SITE_TAGLINE = "Yosemite, written from inside it";
const SITE_DEFAULT_IMAGE = `${SITE_ORIGIN}/img/Half%20Dome%20Main%20Photo.jpg`;
const SITE_DEFAULT_DESC =
  "A field journal of Yosemite National Park, kept by a resident. Trails, planning notes, wildlife, and essays on the park's seasons and life.";
const AUTHOR_NAME = "Cory Goehring";
const PUBLISHER_LOGO = `${SITE_ORIGIN}/img/talus-field-mark-square.png`;

function absoluteImage(url) {
  if (!url) return SITE_DEFAULT_IMAGE;
  if (/^https?:/i.test(url)) return url;
  return `${SITE_ORIGIN}/${url.replace(/^\//, "")}`;
}

function safeJsonForScript(obj) {
  // Defend against premature </script> termination if any string contains it.
  return JSON.stringify(obj).replace(/<\/(script)/gi, "<\\/$1");
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

// Build a FAQPage from an array of {q, a} pairs.
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

function seoForPath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";

  const articleMatch = path.match(/^\/articles\/([a-z0-9-]+)$/i);
  if (articleMatch) {
    const a = articles.find((x) => x.slug === articleMatch[1]);
    if (!a) return null;
    const cat = categories.find((c) => c.slug === a.cat);
    const image = absoluteImage(a.image);
    const url = `${SITE_ORIGIN}/articles/${a.slug}`;
    return {
      title: `${a.title} — ${SITE_NAME}`,
      description: a.dek,
      canonical: url,
      ogType: "article",
      image,
      imageAlt: a.placeholder || a.title,
      articleOg: {
        publishedTime: a.isoDate || null,
        modifiedTime: a.isoModified || a.isoDate || null,
        author: AUTHOR_NAME,
        section: cat ? cat.label : null,
      },
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.dek,
        image: [image],
        datePublished: a.isoDate || a.date,
        dateModified: a.isoModified || a.isoDate || a.date,
        articleSection: cat ? cat.label : undefined,
        wordCount: typeof a.wordCount === "number" ? a.wordCount : undefined,
        keywords: Array.isArray(a.keywords) && a.keywords.length ? a.keywords : undefined,
        author: { "@type": "Person", name: AUTHOR_NAME, url: `${SITE_ORIGIN}/about` },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
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
      faq: Array.isArray(a.faq) && a.faq.length ? faqLd(a.faq) : null,
    };
  }

  const sectionMatch = path.match(/^\/section\/([a-z0-9-]+)$/i);
  if (sectionMatch) {
    const cat = categories.find((c) => c.slug === sectionMatch[1]);
    if (!cat) return null;
    const items = articles.filter((a) => a.cat === cat.slug);
    const url = `${SITE_ORIGIN}/section/${cat.slug}`;
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

  const known = {
    "/": {
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DEFAULT_DESC,
    },
    "/articles": {
      title: `Articles — ${SITE_NAME}`,
      description:
        "Every entry, in reverse chronological order. Yosemite trip planning, trails, wildlife, and seasonal guides.",
    },
    "/about": {
      title: `About — ${SITE_NAME}`,
      description:
        "About The Talus Field, an independent field journal of Yosemite kept by Cory Goehring, a resident of the park.",
    },
    "/kit": {
      title: `Kit — What I carry in Yosemite — ${SITE_NAME}`,
      description:
        "Gear lists for Yosemite: a day pack, an overnight pack, and a car kit. Each item with the reasoning behind it.",
    },
    "/places": {
      title: `The Directory — Yosemite lodging and guides — ${SITE_NAME}`,
      description:
        "A small, curated directory of Yosemite-area lodging, outfitters, and guiding services, drawn from twenty seasons.",
    },
    "/advertise": {
      title: `List your business — ${SITE_NAME}`,
      description:
        "How to list a Yosemite-area lodge, inn, guide service, or outfitter on The Talus Field directory.",
    },
    "/newsletter": {
      title: `Sunday Field Notes — ${SITE_NAME}`,
      description:
        "A short weekly note on Yosemite when there is something to say. Free.",
    },
    "/contact": {
      title: `Contact — ${SITE_NAME}`,
      description:
        "Send a note to the editor. Trip questions, corrections, press, or anything else.",
    },
    "/privacy": {
      title: `Privacy Policy — ${SITE_NAME}`,
      description:
        "What information The Talus Field collects, how it is used, and your rights under GDPR and CCPA.",
    },
    "/terms": {
      title: `Terms of Service — ${SITE_NAME}`,
      description:
        "Terms governing the use of The Talus Field, including content licensing and limitations of liability.",
    },
    "/affiliate": {
      title: `Affiliate Disclosure — ${SITE_NAME}`,
      description:
        "How affiliate links work on The Talus Field, and the editorial standards that don't change for paid placements.",
    },
    "/guide": {
      title: `The Field Guide — ${SITE_NAME}`,
      description:
        "An offline web app for Yosemite. Tappable GPS for the parking turnouts, quiet trailheads, and insider tactics that locals use. Works at the trailhead when service dies.",
    },
    "/cap": {
      title: `Why the Field Guide is capped at 100 a month — ${SITE_NAME}`,
      description:
        "The reasoning behind a hard monthly cap on Field Guide sales. Carrying capacity, editorial integrity, and why the cart closes when it closes.",
    },
    "/map": {
      // Hidden preview. URL-only access while the feature is being tested.
      // robots:noindex keeps it out of search even if someone shares the URL.
      title: `Map — ${SITE_NAME}`,
      description: SITE_DEFAULT_DESC,
      robots: "noindex, nofollow",
    },
  };

  const meta = known[path];
  if (!meta) return null;
  return {
    title: meta.title,
    description: meta.description,
    canonical: `${SITE_ORIGIN}${path === "/" ? "/" : path}`,
    ogType: "website",
    image: SITE_DEFAULT_IMAGE,
    jsonLd: null,
    robots: meta.robots || null,
  };
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const seo = seoForPath(url.pathname);
  if (!seo) return next();

  const response = await next();
  const ct = response.headers.get("content-type") || "";
  if (!ct.toLowerCase().includes("text/html")) return response;

  return new HTMLRewriter()
    .on("title", {
      element(el) {
        el.setInnerContent(seo.title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute("content", seo.description);
      },
    })
    .on('meta[name="twitter:title"]', {
      element(el) {
        el.setAttribute("content", seo.title);
      },
    })
    .on('meta[name="twitter:description"]', {
      element(el) {
        el.setAttribute("content", seo.description);
      },
    })
    .on('meta[name="twitter:image"]', {
      element(el) {
        el.setAttribute("content", seo.image);
      },
    })
    .on('meta[property="og:title"]', {
      element(el) {
        el.setAttribute("content", seo.title);
      },
    })
    .on('meta[property="og:description"]', {
      element(el) {
        el.setAttribute("content", seo.description);
      },
    })
    .on('meta[property="og:url"]', {
      element(el) {
        el.setAttribute("content", seo.canonical);
      },
    })
    .on('meta[property="og:type"]', {
      element(el) {
        el.setAttribute("content", seo.ogType);
      },
    })
    .on('meta[property="og:image"]', {
      element(el) {
        el.setAttribute("content", seo.image);
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute("href", seo.canonical);
      },
    })
    .on('meta[name="robots"]', {
      element(el) {
        if (seo.robots) el.setAttribute("content", seo.robots);
      },
    })
    .on('meta[property="og:image:alt"]', {
      element(el) {
        if (seo.imageAlt) el.setAttribute("content", seo.imageAlt);
      },
    })
    .on("head", {
      element(el) {
        if (seo.articleOg) {
          const og = seo.articleOg;
          if (og.publishedTime) {
            el.append(
              `<meta property="article:published_time" content="${og.publishedTime}" />`,
              { html: true }
            );
          }
          if (og.modifiedTime) {
            el.append(
              `<meta property="article:modified_time" content="${og.modifiedTime}" />`,
              { html: true }
            );
          }
          if (og.author) {
            el.append(
              `<meta property="article:author" content="${og.author}" />`,
              { html: true }
            );
          }
          if (og.section) {
            el.append(
              `<meta property="article:section" content="${og.section}" />`,
              { html: true }
            );
          }
        }
        if (seo.jsonLd) {
          el.append(
            `<script type="application/ld+json" id="ld-page">${safeJsonForScript(seo.jsonLd)}</script>`,
            { html: true }
          );
        }
        if (seo.breadcrumb) {
          el.append(
            `<script type="application/ld+json" id="ld-breadcrumb">${safeJsonForScript(seo.breadcrumb)}</script>`,
            { html: true }
          );
        }
        if (seo.faq) {
          el.append(
            `<script type="application/ld+json" id="ld-faq">${safeJsonForScript(seo.faq)}</script>`,
            { html: true }
          );
        }
      },
    })
    .transform(response);
}
