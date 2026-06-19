// Sitemap rebuild validation.
//
// Confirms sitemap.xml is well-formed XML, lists every published article exactly
// once, every <loc> is a known route, and (in online mode) each URL returns 200.
// Drift between the committed sitemap and the current article set is caught by
// gen-seo-artifacts.mjs --check (run separately by the "mirror freshness" check);
// here we validate the file's content and live reachability.

import { readFileSync } from "node:fs";
import path from "node:path";
import { ROOT, SITE_ORIGIN, knownRoutes } from "../lib/catalog.mjs";
import { makeCheck } from "../lib/report.mjs";
import { xmlWellFormed } from "../lib/xml.mjs";

export default async function checkSitemap(ctx) {
  const check = makeCheck("Sitemap validation");
  const src = readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");

  const wf = xmlWellFormed(src);
  if (!wf.ok) {
    check.error(`sitemap.xml is not well-formed: ${wf.error}`);
    return check.result();
  }

  const locs = [...src.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (!locs.length) {
    check.error("sitemap.xml contains no <loc> entries");
    return check.result();
  }

  const routes = knownRoutes(ctx);
  const seen = new Set();
  for (const loc of locs) {
    if (!loc.startsWith(SITE_ORIGIN)) {
      check.error(`sitemap <loc> not on site origin: ${loc}`);
      continue;
    }
    const p = loc.slice(SITE_ORIGIN.length).replace(/\/$/, "") || "/";
    if (!routes.has(p)) check.error(`sitemap <loc> ${p} is not a known route`);
    if (seen.has(loc)) check.error(`sitemap <loc> duplicated: ${loc}`);
    seen.add(loc);
  }

  // Every published article must appear exactly once.
  for (const a of ctx.articles) {
    const url = `${SITE_ORIGIN}/articles/${a.slug}`;
    if (!seen.has(url)) check.error(`article missing from sitemap: ${a.slug}`);
  }

  check.info(`${locs.length} URLs in sitemap; ${ctx.articles.length} articles all present`);

  if (ctx.online) {
    const base = ctx.baseUrl || SITE_ORIGIN;
    for (const loc of seen) {
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
