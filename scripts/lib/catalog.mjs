#!/usr/bin/env node
//
// Shared catalog loaders for the editorial-site dev tooling.
//
// The single source of truth for the article catalog is data.js (window.ARTICLES
// / window.CATEGORIES / window.KIT), with the film archive in videos-data.js
// (window.NATURE_NOTES) and non-runtime SEO enrichment in seo-data.json. Both
// gen-seo-artifacts.mjs (which writes the SEO mirrors) and system-checks.mjs
// (which validates them) read the catalog through this module so there is exactly
// one harvester. Keep these loaders behaviour-neutral: gen-seo-artifacts.mjs
// depends on them producing the same shapes it always has.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";
import sharp from "sharp";

export const ROOT = path.resolve(fileURLToPath(import.meta.url), "../../..");
export const SITE_ORIGIN = "https://thetalusfieldjournal.com";
export const AUTHOR_NAME = "Cory Goehring";

// Static (non-article, non-section) routes the site serves. Mirrors the keys of
// the `known` map in functions/_middleware.js plus the hub pages. Used to build
// the canonical internal-URL set for link checking, sitemap validation, and the
// smoke test.
export const STATIC_ROUTES = [
  "/",
  "/articles",
  "/planning",
  "/checklist",
  "/about",
  "/kit",
  "/films",
  "/places",
  "/advertise",
  "/newsletter",
  "/contact",
  "/privacy",
  "/terms",
  "/affiliate",
  "/guide",
  "/map",
  "/itineraries",
  "/conditions",
  "/now",
  "/firefall",
  "/consult",
  "/widget",
];

function harvestWindow(file, preload = []) {
  // data.js / videos-data.js assign to window.* and may run small top-level
  // IIFEs. A stubbed window/document/navigator is enough; neither file makes
  // un-guarded browser-API calls at load. See gen-seo-artifacts.mjs history.
  const sandbox = {
    window: {},
    document: { createElement: () => ({}), querySelector: () => null, head: {} },
    navigator: { userAgent: "node" },
    console,
  };
  vm.createContext(sandbox);
  // Evaluate any window-global dependencies first, mirroring index.html's
  // script order (e.g. affiliate.js before data.js, so data.js can call
  // window.buildPatagoniaAffiliateLink for kit aff links).
  const files = [...preload, file];
  let current = file;
  try {
    for (current of files) {
      vm.runInContext(readFileSync(path.join(ROOT, current), "utf8"), sandbox, { filename: current });
    }
  } catch (e) {
    console.error(
      `Failed to evaluate ${current} under node:vm. Keep its top-level code ` +
        "Node-safe (no document/window API calls outside function bodies).\n" +
        e.stack
    );
    process.exit(2);
  }
  return sandbox.window;
}

export function loadDataJs() {
  const w = harvestWindow("data.js", ["affiliate.js"]);
  if (!Array.isArray(w.ARTICLES) || !Array.isArray(w.CATEGORIES)) {
    console.error("data.js did not populate window.ARTICLES / window.CATEGORIES");
    process.exit(2);
  }
  return { articles: w.ARTICLES, categories: w.CATEGORIES, kit: w.KIT };
}

export function loadVideosJs() {
  const nn = harvestWindow("videos-data.js").NATURE_NOTES;
  if (!nn || !Array.isArray(nn.episodes)) {
    console.error("videos-data.js did not populate window.NATURE_NOTES.episodes");
    process.exit(2);
  }
  return nn.episodes;
}

export function loadSeoData() {
  return JSON.parse(readFileSync(path.join(ROOT, "seo-data.json"), "utf8"));
}

// Mirror of slugify() in scripts/gen-responsive-images.mjs and the browser
// ResponsiveImage helper — keep in sync. Used to derive the slug-named social
// image variant from a source filename.
export function slugify(basename) {
  return basename
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Resolve the social-share image for an article: prefer the pre-generated 1600px
// responsive JPEG variant (slug-named, a few hundred KB) over the source JPEG
// (which can be many MB). Sources that make a bad card — narrower than 1200px,
// or portrait (scrapers center-crop extreme portrait images unpredictably) —
// fall back to the dedicated <slug>-og.jpg card emitted by
// gen-responsive-images.mjs (1200px-wide upscale, or a 1200x630 crop for
// portrait sources). Returns { url, width, height } with real pixel
// dimensions, or null for external/missing images.
const OG_CARD_MIN_WIDTH = 1200;

export async function ogImageFor(art) {
  const img = art.image;
  if (!img || /^https?:/i.test(img)) return null;
  const base = slugify(path.basename(img));
  // In preference order: the real-pixel 1600 variant, the generated og card
  // (wins when the source is sub-1200px or portrait), the raw source.
  const candidates = [
    `img/responsive/${base}-1600.jpg`,
    `img/responsive/${base}-og.jpg`,
    img.replace(/^\/+/, ""),
  ].filter((rel) => existsSync(path.join(ROOT, rel)));
  let fallback = null;
  for (const rel of candidates) {
    const meta = await sharp(path.join(ROOT, rel)).metadata();
    if (!meta.width || !meta.height) continue;
    const resolved = { url: rel, width: meta.width, height: meta.height };
    if (meta.width >= OG_CARD_MIN_WIDTH && meta.width > meta.height) return resolved;
    if (!fallback) fallback = resolved;
  }
  return fallback;
}

// The canonical set of internal paths the site is expected to serve: static
// routes + one /section/<cat> per category + one /articles/<slug> per article.
export function knownRoutes({ articles, categories }) {
  const set = new Set(STATIC_ROUTES);
  for (const c of categories) set.add(`/section/${c.slug}`);
  for (const a of articles) set.add(`/articles/${a.slug}`);
  return set;
}
