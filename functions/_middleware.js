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
import videos from "../videos.json" with { type: "json" };
import kit from "../kit.json" with { type: "json" };

const SITE_ORIGIN = "https://thetalusfieldjournal.com";
const SITE_NAME = "The Talus Field";
const SITE_TAGLINE = "Yosemite, written from inside it";
const SITE_DEFAULT_IMAGE = `${SITE_ORIGIN}/img/Half%20Dome%20Main%20Photo.jpg`;
const SITE_DEFAULT_DESC =
  "A field journal of Yosemite National Park, kept by a resident. Trails, planning notes, wildlife, and essays on the park's seasons and life.";
const AUTHOR_NAME = "Cory Goehring";
// Single author node lives in index.html (<script id="ld-person">). Article
// schema references it by @id so there is one Person entity for the whole site.
const AUTHOR_ID = `${SITE_ORIGIN}/#person-cory-goehring`;
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

// Build a TouristAttraction for a trail guide from the article's `trail` facts
// (seo-data.json). HikingTrail is not a type Google parses for rich results, so
// the hike stats ride along as additionalProperty PropertyValues. Numbers come
// from the article body; geo is emitted only when a trailhead coord is verified.
function trailLd(a, url) {
  const t = a.trail;
  const props = [];
  if (t.distance) props.push({ "@type": "PropertyValue", name: "Distance", value: t.distance });
  if (t.elevationGain) props.push({ "@type": "PropertyValue", name: "Elevation gain", value: t.elevationGain });
  if (t.difficulty) props.push({ "@type": "PropertyValue", name: "Difficulty", value: t.difficulty });
  const ld = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: t.name || a.title,
    description: a.seoDek || a.dek,
    url,
    touristType: "Hikers",
    isAccessibleForFree: true,
    containedInPlace: { "@type": "Place", name: "Yosemite National Park" },
  };
  if (props.length) ld.additionalProperty = props;
  if (t.geo && typeof t.geo.lat === "number" && typeof t.geo.lng === "number") {
    ld.geo = { "@type": "GeoCoordinates", latitude: t.geo.lat, longitude: t.geo.lng };
  }
  return ld;
}

function seoForPath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";

  const articleMatch = path.match(/^\/articles\/([a-z0-9-]+)$/i);
  if (articleMatch) {
    const a = articles.find((x) => x.slug === articleMatch[1]);
    if (!a) return null;
    const cat = categories.find((c) => c.slug === a.cat);
    // Prefer the slug-named responsive variant (a few hundred KB, under the
    // social scrapers' size caps) over the multi-MB source JPEG.
    const image = absoluteImage(a.ogImage ? a.ogImage.url : a.image);
    const url = `${SITE_ORIGIN}/articles/${a.slug}`;
    // Prefer the short SEO description when authored, otherwise fall back to
    // the visible dek. Keeps Bing/Google snippets under the 160-char cutoff.
    const desc = a.seoDek || a.dek;
    return {
      title: `${a.title} — ${SITE_NAME}`,
      description: desc,
      canonical: url,
      ogType: "article",
      image,
      imageWidth: a.ogImage ? a.ogImage.width : null,
      imageHeight: a.ogImage ? a.ogImage.height : null,
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
        description: desc,
        image: [image],
        datePublished: a.isoDate || a.date,
        dateModified: a.isoModified || a.isoDate || a.date,
        articleSection: cat ? cat.label : undefined,
        wordCount: typeof a.wordCount === "number" ? a.wordCount : undefined,
        keywords: Array.isArray(a.keywords) && a.keywords.length ? a.keywords : undefined,
        author: { "@id": AUTHOR_ID },
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
      trail: a.trail ? trailLd(a, url) : null,
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

  const known = {
    "/": {
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DEFAULT_DESC,
    },
    "/articles": {
      title: `Articles — ${SITE_NAME}`,
      description:
        "Every entry, in reverse chronological order. Yosemite trip planning, trails, wildlife, and seasonal guides.",
      // CollectionPage whose mainEntity is the full catalog as an ItemList.
      // Mirrored client-side in app.jsx buildSeo so hydration replaces like
      // with like. Slim ListItems (url + name) avoid duplicating the Article
      // entities that live on the detail pages.
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `Articles — ${SITE_NAME}`,
        url: `${SITE_ORIGIN}/articles`,
        description:
          "Every entry, in reverse chronological order. Yosemite trip planning, trails, wildlife, and seasonal guides.",
        inLanguage: "en-US",
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_ORIGIN },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: articles.length,
          itemListElement: articles.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_ORIGIN}/articles/${a.slug}`,
            name: a.title,
          })),
        },
      },
    },
    "/planning": {
      title: `The Yosemite Planning Guide — ${SITE_NAME}`,
      description:
        "Plan a Yosemite trip in 2026: gateway towns, reservations, Half Dome, smoke season, the seasonal calendar. A curated hub through The Talus Field's planning archive.",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Planning Guide", null]],
      faq: [
        { q: "Do I need a reservation to enter Yosemite in 2026?", a: "No. The day-use vehicle reservation system is not in effect in 2026. A standard Yosemite entrance pass ($35 per vehicle, valid 7 days) is required." },
        { q: "What is the best time of year to visit Yosemite?", a: "Late May through early June for peak waterfalls and moderate crowds. September and October for warm days, smaller crowds, and golden light. July and August are the most crowded months. April has spring waterfalls but Tioga Road and Glacier Point Road are usually still closed." },
        { q: "How much does it cost to enter Yosemite?", a: "$35 per vehicle (7-day pass), $20 per person entering on foot, bike, or motorcycle. The America the Beautiful annual pass ($80) covers entry to all national parks for one year and is worthwhile for two or more Yosemite visits." },
        { q: "How long should I spend at Yosemite?", a: "Minimum two full days: one for the Valley floor, one for a second area like Glacier Point, Mariposa Grove, or Tioga Road. Three to four days lets you cover all of these without rushing. A single-day trip is doable but you'll be moving the entire time." },
        { q: "Is Yosemite open year-round?", a: "Yosemite Valley is open year-round. Tioga Road (Highway 120 through the park) is typically closed November through May. Glacier Point Road closes in late November and reopens around Memorial Day. Mariposa Grove is open year-round but the tram is seasonal. Some campgrounds have seasonal closures." }
      ],
    },
    "/checklist": {
      title: `The Yosemite First-Week Checklist — ${SITE_NAME}`,
      description:
        "A printable single-page checklist for planning a Yosemite trip in 2026: when to come, what to book, what to pack, gateway choice, and the non-negotiables. Free.",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Planning Checklist", null]],
    },
    "/about": {
      title: `About — ${SITE_NAME}`,
      description:
        "About The Talus Field, an independent field journal of Yosemite kept by Cory Goehring, a resident of the park.",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["About", null]],
    },
    "/kit": {
      title: `Kit — What I carry in Yosemite — ${SITE_NAME}`,
      description:
        "Gear lists for Yosemite: a day pack, an overnight pack, and a car kit. Each item with the reasoning behind it.",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Kit", null]],
      // One ItemList per packing list. Matches the @graph app.jsx builds
      // client-side from window.KIT, so JS and non-JS crawlers see the same
      // entities. Sourced from the kit.json mirror.
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": kit.lists.map((list) => ({
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
        })),
      },
    },
    "/places": {
      title: `The Directory — Yosemite lodging and guides — ${SITE_NAME}`,
      description:
        "A small, curated directory of Yosemite-area lodging, outfitters, and guiding services, drawn from twenty seasons.",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Directory", null]],
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
    "/films": {
      title: `Moving Pictures — the Yosemite Nature Notes film archive — ${SITE_NAME}`,
      description:
        "The complete Yosemite Nature Notes film series from the National Park Service, grouped by subject. Public domain, free to watch, most under ten minutes.",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Films", null]],
      // ItemList of VideoObject nodes, one per episode, built from the
      // videos.json mirror. Matches the shape app.jsx builds client-side from
      // videos-data.js so JS and non-JS crawlers see the same entity.
      // uploadDate is deliberately omitted: only publication years are sourced.
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Yosemite Nature Notes — the film archive",
        url: `${SITE_ORIGIN}/films`,
        numberOfItems: videos.length,
        itemListElement: videos.map((ep, i) => ({
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
    },
    "/map": {
      title: `Yosemite Trip Planner Map — ${SITE_NAME}`,
      description:
        "An interactive Yosemite map of vistas, trailheads, parking turnouts, picnic spots, and places to eat, with a trip builder. Curated by a resident of the park. Free.",
      breadcrumb: [["Home", `${SITE_ORIGIN}/`], ["Map", null]],
      // Honest, static WebPage node. The pin list itself stays out of the
      // structured data until the new points pass a ground-truth check.
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
  };

  const meta = known[path];
  if (!meta) return null;
  return {
    title: meta.title,
    description: meta.description,
    canonical: `${SITE_ORIGIN}${path === "/" ? "/" : path}`,
    ogType: "website",
    image: SITE_DEFAULT_IMAGE,
    jsonLd: meta.jsonLd || null,
    breadcrumb: meta.breadcrumb ? breadcrumbLd(meta.breadcrumb) : null,
    faq: meta.faq ? faqLd(meta.faq) : null,
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
    .on('meta[property="og:image:width"]', {
      element(el) {
        if (seo.imageWidth) el.setAttribute("content", String(seo.imageWidth));
      },
    })
    .on('meta[property="og:image:height"]', {
      element(el) {
        if (seo.imageHeight) el.setAttribute("content", String(seo.imageHeight));
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
        if (seo.trail) {
          el.append(
            `<script type="application/ld+json" id="ld-trail">${safeJsonForScript(seo.trail)}</script>`,
            { html: true }
          );
        }
      },
    })
    .transform(response);
}
