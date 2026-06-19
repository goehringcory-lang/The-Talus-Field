// Broken-link sweep.
//
// Offline: scan every editorial JSX source (root page-*.jsx + bodies/*.jsx) for
// <a href="..."> targets. Internal links (starting with "/") must resolve to a
// known route or article/section slug, or they 404 and dead-end a reader.
// Outbound https links are collected for the optional online liveness pass.
//
// Online (--online, run in CI where egress works): GET each internal URL against
// the base origin and error on 404/500; GET each unique outbound link and warn on
// dead ones (with a retry to ride out flaky external hosts).

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { ROOT, SITE_ORIGIN, knownRoutes } from "../lib/catalog.mjs";
import { makeCheck } from "../lib/report.mjs";

const HREF = /href\s*=\s*["']([^"']+)["']/g;

function jsxSources() {
  const files = [];
  for (const f of readdirSync(ROOT)) {
    if (f.endsWith(".jsx")) files.push(path.join(ROOT, f));
  }
  const bodies = path.join(ROOT, "bodies");
  for (const f of readdirSync(bodies)) {
    if (f.endsWith(".jsx")) files.push(path.join(bodies, f));
  }
  return files;
}

function collectLinks() {
  const internal = new Map(); // path -> Set(source files)
  const external = new Map(); // url -> Set(source files)
  for (const file of jsxSources()) {
    const rel = path.relative(ROOT, file);
    const src = readFileSync(file, "utf8");
    let m;
    while ((m = HREF.exec(src))) {
      const href = m[1].trim();
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
      // Skip dynamically-built hrefs (template literals / JSX expressions like
      // href="/articles/${slug}"); only static targets are checkable here.
      if (href.includes("${") || href.includes("{") || href.includes("`")) continue;
      if (/^https?:\/\//i.test(href)) {
        if (!external.has(href)) external.set(href, new Set());
        external.get(href).add(rel);
      } else if (href.startsWith("/")) {
        const clean = href.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
        if (!internal.has(clean)) internal.set(clean, new Set());
        internal.get(clean).add(rel);
      }
      // Anything else (relative, javascript:, protocol-relative) is left alone.
    }
  }
  return { internal, external };
}

async function fetchStatus(url, { method = "GET", timeoutMs = 12000, retries = 1 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "user-agent": "talus-field-system-checks/1.0" },
      });
      clearTimeout(t);
      return res.status;
    } catch {
      clearTimeout(t);
      if (attempt === retries) return 0; // 0 = network failure / timeout
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return 0;
}

export default async function checkLinks(ctx) {
  const check = makeCheck("Internal & outbound links");
  const { internal, external } = collectLinks();
  const routes = knownRoutes(ctx);

  // Offline: internal link integrity.
  let badInternal = 0;
  for (const [p, sources] of internal) {
    if (!routes.has(p)) {
      badInternal++;
      check.error(`internal link to "${p}" has no matching route (in ${[...sources].join(", ")})`);
    }
  }
  if (!badInternal) check.info(`${internal.size} distinct internal links all resolve`);
  check.info(`${external.size} distinct outbound links found`);

  if (ctx.online) {
    const base = ctx.baseUrl || SITE_ORIGIN;
    // Internal URL liveness.
    for (const p of internal.keys()) {
      const status = await fetchStatus(base + (p === "/" ? "/" : p));
      if (status === 404 || status === 410 || status >= 500) {
        check.error(`internal URL ${base}${p} returned ${status}`);
      } else if (status === 0) {
        check.warn(`internal URL ${base}${p} did not respond (network/timeout)`);
      }
    }
    // Outbound liveness (HEAD first, fall back to GET; warn only — external).
    for (const url of external.keys()) {
      let status = await fetchStatus(url, { method: "HEAD" });
      if (status === 0 || status === 405 || status === 403) status = await fetchStatus(url, { method: "GET" });
      if (status === 0) check.warn(`outbound link unreachable: ${url}`);
      else if (status === 404 || status === 410 || status >= 500) check.warn(`outbound link ${status}: ${url}`);
    }
  }

  return check.result();
}
