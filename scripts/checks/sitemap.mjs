// Sitemap rebuild validation.
//
// /sitemap.xml is a sitemap INDEX pointing at two children: sitemap-articles.xml
// (the editorial url set) and archive/sitemap.xml (the Nature Notes run). This
// check follows the index into both, then confirms each is well-formed XML,
// that every <loc> is a known route on the site origin, that nothing is listed
// twice, and that every published article appears exactly once in the editorial
// child. In online mode it also fetches each URL and expects a 200.
//
// Drift between the committed files and the current article set is caught by
// gen-seo-artifacts.mjs --check (run separately by the "mirror freshness"
// check); here we validate content and live reachability.

import { readFileSync } from "node:fs";
import path from "node:path";
import { ROOT, SITE_ORIGIN, knownRoutes } from "../lib/catalog.mjs";
import { makeCheck } from "../lib/report.mjs";
import { xmlWellFormed } from "../lib/xml.mjs";

const locsIn = (src) => [...src.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

// Index <loc>s are absolute URLs; map them back to the file that serves them.
// Both children are real committed files at the repo root, so the path is the
// path (archive/sitemap.xml is written by gen-archive.mjs, not by this repo's
// SEO generator, which is the reason to validate it here rather than assume it).
const childPath = (loc) => loc.slice(SITE_ORIGIN.length).replace(/^\//, "");

export default async function checkSitemap(ctx) {
  const check = makeCheck("Sitemap validation");
  const indexSrc = readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");

  const indexWf = xmlWellFormed(indexSrc);
  if (!indexWf.ok) {
    check.error(`sitemap.xml is not well-formed: ${indexWf.error}`);
    return check.result();
  }
  if (!/<sitemapindex[\s>]/.test(indexSrc)) {
    check.error("sitemap.xml is not a <sitemapindex> — the site publishes an index of two child sitemaps");
    return check.result();
  }

  const childLocs = locsIn(indexSrc);
  if (childLocs.length !== 2) {
    check.error(`sitemap index lists ${childLocs.length} child sitemap(s); expected 2 (editorial + archive)`);
  }

  const routes = knownRoutes(ctx);
  const seen = new Set();
  let editorialSrc = null;
  let total = 0;

  for (const childLoc of childLocs) {
    if (!childLoc.startsWith(SITE_ORIGIN)) {
      check.error(`sitemap index <loc> not on site origin: ${childLoc}`);
      continue;
    }
    const rel = childPath(childLoc);
    let src;
    try {
      src = readFileSync(path.join(ROOT, rel), "utf8");
    } catch {
      check.error(`sitemap index points at ${rel}, which does not exist on disk`);
      continue;
    }
    if (rel === "sitemap-articles.xml") editorialSrc = src;

    const wf = xmlWellFormed(src);
    if (!wf.ok) {
      check.error(`${rel} is not well-formed: ${wf.error}`);
      continue;
    }

    const locs = locsIn(src);
    if (!locs.length) {
      check.error(`${rel} contains no <loc> entries`);
      continue;
    }
    total += locs.length;

    for (const loc of locs) {
      if (!loc.startsWith(SITE_ORIGIN)) {
        check.error(`${rel} <loc> not on site origin: ${loc}`);
        continue;
      }
      const p = loc.slice(SITE_ORIGIN.length).replace(/\/$/, "") || "/";
      if (!routes.has(p)) check.error(`${rel} <loc> ${p} is not a known route`);
      if (seen.has(loc)) check.error(`<loc> duplicated across sitemaps: ${loc}`);
      seen.add(loc);
    }
  }

  // Every published article must appear exactly once, in the editorial child.
  if (editorialSrc === null) {
    check.error("sitemap index does not list sitemap-articles.xml");
  } else {
    const editorial = new Set(locsIn(editorialSrc));
    for (const a of ctx.articles) {
      const url = `${SITE_ORIGIN}/articles/${a.slug}`;
      if (!editorial.has(url)) check.error(`article missing from sitemap-articles.xml: ${a.slug}`);
    }
  }

  check.info(`${total} URLs across ${childLocs.length} child sitemap(s); ${ctx.articles.length} articles all present`);

  if (ctx.online) {
    const base = ctx.baseUrl || SITE_ORIGIN;
    // The index itself must serve, not just its children.
    for (const loc of [`${SITE_ORIGIN}/sitemap.xml`, ...childLocs, ...seen]) {
      const url = ctx.baseUrl ? loc.replace(SITE_ORIGIN, base) : loc;
      try {
        const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "talus-field-system-checks/1.0" } });
        if (res.status !== 200) check.error(`sitemap URL ${url} returned ${res.status}`);
      } catch {
        check.warn(`sitemap URL ${url} did not respond (network/timeout)`);
      }
    }
  }

  return check.result();
}
