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
];

function harvestWindow(file) {
  const src = readFileSync(path.join(ROOT, file), "utf8");
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
  try {
    vm.runInContext(src, sandbox, { filename: file });
  } catch (e) {
    console.error(
      `Failed to evaluate ${file} under node:vm. Keep its top-level code ` +
        "Node-safe (no document/window API calls outside function bodies).\n" +
        e.stack
    );
    process.exit(2);
  }
  return sandbox.window;
}

export function loadDataJs() {
  const w = harvestWindow("data.js");
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
// (which can be many MB). Returns { url, width, height } with real pixel
// dimensions, or null for external/missing images.
export async function ogImageFor(art) {
  const img = art.image;
  if (!img || /^https?:/i.test(img)) return null;
  const variant = `img/responsive/${slugify(path.basename(img))}-1600.jpg`;
  const variantPath = path.join(ROOT, variant);
  let url, filePath;
  if (existsSync(variantPath)) {
    url = variant;
    filePath = variantPath;
  } else {
    url = img.replace(/^\/+/, "");
    filePath = path.join(ROOT, url);
  }
  if (!existsSync(filePath)) return null;
  const meta = await sharp(filePath).metadata();
  if (!meta.width || !meta.height) return null;
  return { url, width: meta.width, height: meta.height };
}

// The canonical set of internal paths the site is expected to serve: static
// routes + one /section/<cat> per category + one /articles/<slug> per article.
export function knownRoutes({ articles, categories }) {
  const set = new Set(STATIC_ROUTES);
  for (const c of categories) set.add(`/section/${c.slug}`);
  for (const a of articles) set.add(`/articles/${a.slug}`);
  return set;
}
