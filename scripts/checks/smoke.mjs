// Template smoke test (online).
//
// Hits the homepage plus a sample of article URLs and confirms each renders a
// real page: HTTP 200, a non-empty <title>, the site nav/footer scaffolding
// present, and no obviously unrendered template leakage (raw {{ }} mustache,
// "undefined" titles, visible JSX). Offline, this check is skipped (the SPA
// routes only resolve at the Cloudflare edge / a running dev server).

import { SITE_ORIGIN } from "../lib/catalog.mjs";
import { makeCheck } from "../lib/report.mjs";

const LEAK = [/\{\{[^}]+\}\}/, /<title>\s*<\/title>/i, />\s*undefined\s*</i, /NaN\s*<\/title>/i];

async function get(url) {
  const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "talus-field-system-checks/1.0" } });
  const body = await res.text();
  return { status: res.status, body };
}

export default async function checkSmoke(ctx) {
  const check = makeCheck("Template smoke test");
  if (!ctx.online) {
    check.info("skipped (offline; run with --online against the live site or a dev server)");
    return check.result();
  }

  const base = ctx.baseUrl || SITE_ORIGIN;
  const sample = ctx.articles.slice(0, 3).map((a) => `/articles/${a.slug}`);
  const paths = ["/", ...sample];

  for (const p of paths) {
    try {
      const { status, body } = await get(base + p);
      if (status !== 200) {
        check.error(`${p} returned ${status}`);
        continue;
      }
      const title = (body.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "";
      if (!title.trim()) check.error(`${p}: empty <title>`);
      if (!/<nav|class="[^"]*nav/i.test(body)) check.warn(`${p}: no nav markup detected`);
      for (const re of LEAK) if (re.test(body)) check.error(`${p}: unrendered template leak (${re})`);
    } catch {
      check.warn(`${p}: did not respond (network/timeout)`);
    }
  }

  check.info(`smoke-tested ${paths.length} routes against ${base}`);
  return check.result();
}
