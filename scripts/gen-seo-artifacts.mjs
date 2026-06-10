#!/usr/bin/env node
//
// Regenerates the SEO/AI-search mirror files from a single source of truth.
//
// Source of truth:
//   - data.js (window.ARTICLES / window.CATEGORIES) — the live runtime catalog
//     and core per-article metadata. Harvested via node:vm with a stubbed
//     window; data.js has no top-level browser-API calls, so this is safe.
//   - seo-data.json — non-runtime SEO enrichment keyed by slug (wordCount,
//     keywords, faq, trail). Kept out of data.js so the browser payload stays
//     small.
//
// Generates (deterministically, idempotently):
//   - articles.json   merged core + enrichment; consumed by functions/_middleware.js
//   - sitemap.xml     hub/section/static routes + one <url> per article (image + lastmod)
//   - feed.xml        RSS 2.0 channel + one <item> per article
//   - llms.txt        the "## Articles" section only (header/reference/optional preserved)
//
// Usage:
//   node scripts/gen-seo-artifacts.mjs          # write the files
//   node scripts/gen-seo-artifacts.mjs --check  # exit 1 if any file is stale
//
// When you add or edit an article: edit data.js (and its bodies/<slug>.jsx),
// add any enrichment to seo-data.json, then run this script. Do NOT hand-edit
// articles.json / sitemap.xml / feed.xml / the llms.txt article list.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const SITE_ORIGIN = "https://thetalusfieldjournal.com";
const AUTHOR_NAME = "Cory Goehring";

const CHECK = process.argv.includes("--check");

// ----------------------------------------------------------------------------
// Load sources
// ----------------------------------------------------------------------------

function loadDataJs() {
  const src = readFileSync(path.join(ROOT, "data.js"), "utf8");
  // data.js assigns to window.* and runs window.KIT.lists.forEach at load.
  // A stubbed window is enough; document/navigator are defensive (loadArticleBody
  // references them but is never called at load).
  const sandbox = {
    window: {},
    document: { createElement: () => ({}), querySelector: () => null, head: {} },
    navigator: { userAgent: "node" },
    console,
  };
  vm.createContext(sandbox);
  try {
    vm.runInContext(src, sandbox, { filename: "data.js" });
  } catch (e) {
    console.error(
      "Failed to evaluate data.js under node:vm. Keep its top-level code " +
        "Node-safe (no document/window API calls outside function bodies).\n" +
        e.stack
    );
    process.exit(2);
  }
  const w = sandbox.window;
  if (!Array.isArray(w.ARTICLES) || !Array.isArray(w.CATEGORIES)) {
    console.error("data.js did not populate window.ARTICLES / window.CATEGORIES");
    process.exit(2);
  }
  return { articles: w.ARTICLES, categories: w.CATEGORIES };
}

function loadSeoData() {
  return JSON.parse(readFileSync(path.join(ROOT, "seo-data.json"), "utf8"));
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function rfc822(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${DOW[d.getUTCDay()]}, ${dd} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()} 00:00:00 +0000`;
}

function xml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function imageUrl(img) {
  return `${SITE_ORIGIN}/${String(img).replace(/^\/+/, "").replace(/ /g, "%20")}`;
}

// Compact JSON: arrays of primitives and all-primitive objects stay on one line,
// everything else expands. Matches the existing articles.json house style.
function jsonCompact(value, indent = 0) {
  const pad = "  ".repeat(indent);
  const padIn = "  ".repeat(indent + 1);
  const prim = (v) => v === null || typeof v !== "object";
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    if (value.every(prim)) return `[${value.map((v) => JSON.stringify(v)).join(", ")}]`;
    const items = value.map((v) => padIn + jsonCompact(v, indent + 1));
    return `[\n${items.join(",\n")}\n${pad}]`;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0) return "{}";
    if (keys.every((k) => prim(value[k]))) {
      return `{ ${keys.map((k) => `${JSON.stringify(k)}: ${JSON.stringify(value[k])}`).join(", ")} }`;
    }
    const props = keys.map((k) => `${padIn}${JSON.stringify(k)}: ${jsonCompact(value[k], indent + 1)}`);
    return `{\n${props.join(",\n")}\n${pad}}`;
  }
  return JSON.stringify(value);
}

// ----------------------------------------------------------------------------
// Merge
// ----------------------------------------------------------------------------

function mergeArticles(articles, seoData) {
  return articles.map((art) => {
    const seo = seoData[art.slug] || {};
    const o = {
      slug: art.slug,
      cat: art.cat,
      title: art.title,
      dek: art.dek,
    };
    if (art.seoDek) o.seoDek = art.seoDek;
    o.date = art.date;
    o.isoDate = art.isoDate;
    o.isoModified = art.isoModified;
    o.read = art.read;
    o.image = art.image;
    if (art.placeholder) o.placeholder = art.placeholder;
    if (typeof seo.wordCount === "number") o.wordCount = seo.wordCount;
    if (Array.isArray(seo.keywords) && seo.keywords.length) o.keywords = seo.keywords;
    if (seo.trail) o.trail = seo.trail;
    // data.js inline faq wins over the sidecar (only one article uses inline faq).
    const faq = art.faq || seo.faq;
    if (Array.isArray(faq) && faq.length) o.faq = faq;
    return o;
  });
}

// ----------------------------------------------------------------------------
// Generators
// ----------------------------------------------------------------------------

function buildArticlesJson(merged) {
  return jsonCompact(merged, 0) + "\n";
}

function buildSitemap(merged, categories) {
  const mod = (a) => a.isoModified || a.isoDate;
  const newest = (arr) => arr.map(mod).sort().at(-1);
  const allNewest = newest(merged);
  const catNewest = (slug) => newest(merged.filter((a) => a.cat === slug));

  const urlBlock = ({ loc, lastmod, changefreq, priority, image }) => {
    const lines = [`  <url>`, `    <loc>${SITE_ORIGIN}${loc}</loc>`, `    <lastmod>${lastmod}</lastmod>`];
    if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
    if (priority) lines.push(`    <priority>${priority}</priority>`);
    if (image) {
      lines.push(`    <image:image>`);
      lines.push(`      <image:loc>${image.loc}</image:loc>`);
      if (image.title) lines.push(`      <image:title>${xml(image.title)}</image:title>`);
      lines.push(`    </image:image>`);
    }
    lines.push(`  </url>`);
    return lines.join("\n");
  };

  const hub = [
    urlBlock({
      loc: "/",
      lastmod: allNewest,
      image: { loc: `${SITE_ORIGIN}/img/Half%20Dome%20Main%20Photo.jpg`, title: "Half Dome at first light" },
    }),
    urlBlock({ loc: "/articles", lastmod: allNewest }),
    urlBlock({ loc: "/planning", lastmod: "2026-05-16", changefreq: "weekly", priority: "0.9" }),
    urlBlock({ loc: "/checklist", lastmod: "2026-05-16", changefreq: "monthly", priority: "0.8" }),
  ];

  const sections = categories.map((c) => urlBlock({ loc: `/section/${c.slug}`, lastmod: catNewest(c.slug) }));

  const staticPages = [
    ["/about", "2026-04-01"],
    ["/kit", "2026-04-26"],
    ["/places", "2026-04-26"],
    ["/advertise", "2026-04-01"],
    ["/newsletter", "2026-04-01"],
    ["/contact", "2026-04-01"],
    ["/privacy", "2026-04-01"],
    ["/terms", "2026-04-01"],
    ["/affiliate", "2026-04-01"],
    ["/guide", "2026-05-10"],
    ["/map", "2026-06-10"],
  ].map(([loc, lastmod]) => urlBlock({ loc, lastmod }));

  const articles = merged.map((a) =>
    urlBlock({
      loc: `/articles/${a.slug}`,
      lastmod: mod(a),
      image: { loc: imageUrl(a.image), title: a.placeholder },
    })
  );

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemaps-image/1.1">\n\n` +
    `  <!-- Hub pages -->\n${hub.join("\n")}\n\n` +
    `  <!-- Sections -->\n${sections.join("\n")}\n\n` +
    `  <!-- Static pages -->\n${staticPages.join("\n")}\n\n` +
    `  <!-- Articles -->\n${articles.join("\n")}\n` +
    `</urlset>\n`
  );
}

function buildFeed(merged, categories) {
  const label = Object.fromEntries(categories.map((c) => [c.slug, c.label]));
  const lastBuild = rfc822(merged.map((a) => a.isoDate).sort().at(-1));

  const items = merged
    .map((a) => {
      const url = `${SITE_ORIGIN}/articles/${a.slug}`;
      return (
        `    <item>\n` +
        `      <title>${xml(a.title)}</title>\n` +
        `      <link>${url}</link>\n` +
        `      <guid isPermaLink="true">${url}</guid>\n` +
        `      <pubDate>${rfc822(a.isoDate)}</pubDate>\n` +
        `      <dc:creator>${AUTHOR_NAME}</dc:creator>\n` +
        `      <category>${xml(label[a.cat] || a.cat)}</category>\n` +
        `      <description>${xml(a.dek)}</description>\n` +
        `      <media:content url="${imageUrl(a.image)}" medium="image" />\n` +
        `    </item>`
      );
    })
    .join("\n");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">\n` +
    `  <channel>\n` +
    `    <title>The Talus Field</title>\n` +
    `    <link>${SITE_ORIGIN}/</link>\n` +
    `    <atom:link href="${SITE_ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />\n` +
    `    <description>A field journal of Yosemite National Park, kept by a resident. Trail conditions, planning notes, wildlife, and longer essays on the park's seasons, geology, and life.</description>\n` +
    `    <language>en-us</language>\n` +
    `    <copyright>© 2026 The Talus Field</copyright>\n` +
    `    <managingEditor>cory@thetalusfieldjournal.com (Cory Goehring)</managingEditor>\n` +
    `    <webMaster>cory@thetalusfieldjournal.com (Cory Goehring)</webMaster>\n` +
    `    <lastBuildDate>${lastBuild}</lastBuildDate>\n` +
    `    <image>\n` +
    `      <url>${SITE_ORIGIN}/img/talus-field-mark.png</url>\n` +
    `      <title>The Talus Field</title>\n` +
    `      <link>${SITE_ORIGIN}/</link>\n` +
    `    </image>\n\n` +
    `${items}\n` +
    `  </channel>\n` +
    `</rss>\n`
  );
}

const LLMS_START = "<!-- GENERATED:ARTICLES:START — regenerated by scripts/gen-seo-artifacts.mjs; edit data.js / seo-data.json, not this list -->";
const LLMS_END = "<!-- GENERATED:ARTICLES:END -->";

function buildLlms(existing, merged, categories) {
  const idxArticles = existing.indexOf("## Articles");
  const idxReference = existing.indexOf("## Reference pages");
  if (idxArticles === -1 || idxReference === -1) {
    console.error('llms.txt is missing the "## Articles" or "## Reference pages" headings; cannot regenerate safely.');
    process.exit(2);
  }
  const head = existing.slice(0, idxArticles);
  const tail = existing.slice(idxReference);

  const sections = categories
    .map((c) => {
      const rows = merged
        .filter((a) => a.cat === c.slug)
        .map((a) => {
          const desc = a.seoDek || a.dek;
          return `- [${a.title}](${SITE_ORIGIN}/articles/${a.slug}): ${desc} (lastmod ${a.isoModified || a.isoDate})`;
        });
      return `### ${c.label}\n${rows.join("\n")}`;
    })
    .join("\n\n");

  const body = `${LLMS_START}\n\n${sections}\n\n${LLMS_END}`;
  return `${head}## Articles\n\n${body}\n\n${tail}`;
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

function main() {
  const { articles, categories } = loadDataJs();
  const seoData = loadSeoData();

  // Validate seo-data slugs against the catalog.
  const slugs = new Set(articles.map((a) => a.slug));
  const orphans = Object.keys(seoData).filter((k) => k !== "__comment" && !slugs.has(k));
  if (orphans.length) {
    console.error(`seo-data.json has entries with no matching article in data.js: ${orphans.join(", ")}`);
    process.exit(2);
  }

  const merged = mergeArticles(articles, seoData);

  const targets = {
    "articles.json": buildArticlesJson(merged),
    "sitemap.xml": buildSitemap(merged, categories),
    "feed.xml": buildFeed(merged, categories),
    "llms.txt": buildLlms(readFileSync(path.join(ROOT, "llms.txt"), "utf8"), merged, categories),
  };

  if (CHECK) {
    let stale = false;
    for (const [name, content] of Object.entries(targets)) {
      const current = readFileSync(path.join(ROOT, name), "utf8");
      if (current !== content) {
        stale = true;
        const a = current.split("\n");
        const b = content.split("\n");
        let line = 0;
        while (line < a.length && line < b.length && a[line] === b[line]) line++;
        console.error(`✗ ${name} is stale (first diff at line ${line + 1}). Run: npm --prefix scripts run seo`);
      } else {
        console.log(`✓ ${name} up to date`);
      }
    }
    if (stale) process.exit(1);
    console.log("All SEO artifacts up to date.");
    return;
  }

  for (const [name, content] of Object.entries(targets)) {
    writeFileSync(path.join(ROOT, name), content);
    console.log(`wrote ${name}`);
  }
}

main();
