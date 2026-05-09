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
//
// For article routes we also fetch /bodies/{slug}.jsx, transform it from
// JSX-prose to plain HTML, and inject it into the existing <noscript> block.
// That gives non-JS crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot) the
// full article body to read and cite — not just the metadata.

import articles from "../articles.json" with { type: "json" };
import categories from "../categories.json" with { type: "json" };

const SITE_ORIGIN = "https://thetalusfieldjournal.com";
const SITE_NAME = "The Talus Field";
const SITE_TAGLINE = "Yosemite, written from inside it";
const SITE_DEFAULT_IMAGE = `${SITE_ORIGIN}/img/Half%20Dome%20Main%20Photo.jpg`;
const SITE_DEFAULT_DESC =
  "A field journal of Yosemite National Park, kept by a resident. Trail conditions, planning notes, wildlife, and longer essays on the park's seasons, geology, and life.";
const AUTHOR_NAME = "Cory Goehring";
const PUBLISHER_LOGO = `${SITE_ORIGIN}/img/talus-field-mark.png`;

function absoluteImage(url) {
  if (!url) return SITE_DEFAULT_IMAGE;
  if (/^https?:/i.test(url)) return url;
  return `${SITE_ORIGIN}/${url.replace(/^\//, "")}`;
}

function safeJsonForScript(obj) {
  return JSON.stringify(obj).replace(/<\/(script)/gi, "<\\/$1");
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// Strip the JS wrapper from a body file and convert the JSX-prose inside the
// `return ( ... )` into plain HTML. The bodies are intentionally HTML-shaped
// JSX (no custom React components, no embedded expressions in prose), so this
// is a small set of regex passes rather than a real parser.
function transformJsxBodyToHtml(jsx) {
  const match = jsx.match(/return\s*\(\s*([\s\S]*?)\s*\)\s*;\s*\}/);
  if (!match) return null;
  let html = match[1];
  html = html.replace(/^\s*<>\s*/, "").replace(/\s*<\/>\s*$/, "");
  html = html.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  html = html.replace(/\bclassName=/g, "class=");
  html = html.replace(
    /style=\{\{\s*fontSize:\s*(\d+)\s*\}\}/g,
    'style="font-size: $1px"'
  );
  return html.trim();
}

async function fetchArticleBodyHtml(slug, origin) {
  try {
    const res = await fetch(`${origin}/bodies/${slug}.jsx`, {
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (!res.ok) return null;
    return transformJsxBodyToHtml(await res.text());
  } catch {
    return null;
  }
}

function buildArticleNoscript(article, category, bodyHtml) {
  const crumbs = [
    `<a href="/">The Talus Field</a>`,
    `<a href="/articles">Articles</a>`,
    category ? `<a href="/section/${category.slug}">${escapeHtml(category.label)}</a>` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const moreLink = category
    ? `<p><a href="/section/${category.slug}">More from ${escapeHtml(category.label)}</a> · <a href="/articles">All articles</a></p>`
    : `<p><a href="/articles">All articles</a></p>`;

  return `
      <header>
        <p>${crumbs}</p>
        <h1>${escapeHtml(article.title)}</h1>
        <p><em>${escapeHtml(article.dek)}</em></p>
        <p>By ${escapeHtml(AUTHOR_NAME)} · ${escapeHtml(article.date)} · ${escapeHtml(article.read)} read</p>
      </header>
      <article>${bodyHtml}</article>
      <footer>${moreLink}</footer>
    `;
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
      article: a,
      category: cat || null,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.dek,
        image: [image],
        datePublished: a.isoDate || a.date,
        dateModified: a.isoDate || a.date,
        articleSection: cat ? cat.label : undefined,
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
  };
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const seo = seoForPath(url.pathname);
  if (!seo) return next();

  const response = await next();
  const ct = response.headers.get("content-type") || "";
  if (!ct.toLowerCase().includes("text/html")) return response;

  let articleNoscriptHtml = null;
  if (seo.article) {
    const bodyHtml = await fetchArticleBodyHtml(seo.article.slug, url.origin);
    if (bodyHtml) {
      articleNoscriptHtml = buildArticleNoscript(seo.article, seo.category, bodyHtml);
    }
  }

  const rewriter = new HTMLRewriter()
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
    .on("head", {
      element(el) {
        if (seo.jsonLd) {
          el.append(
            `<script type="application/ld+json" id="ld-page">${safeJsonForScript(seo.jsonLd)}</script>`,
            { html: true }
          );
        }
      },
    });

  if (articleNoscriptHtml) {
    rewriter.on("noscript", {
      element(el) {
        el.setInnerContent(articleNoscriptHtml, { html: true });
      },
    });
  }

  return rewriter.transform(response);
}
