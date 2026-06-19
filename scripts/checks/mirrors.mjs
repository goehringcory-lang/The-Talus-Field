// SEO mirror freshness.
//
// The sitemap/feed/articles.json validators check content; this check catches the
// other failure mode: a committed mirror that has drifted from data.js /
// seo-data.json because someone edited an article and forgot to regenerate. It
// just runs the existing generator in --check mode (the single source of truth
// for "are the mirrors current"), so the suite reports drift in one place.

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { makeCheck } from "../lib/report.mjs";

export default async function checkMirrors() {
  const check = makeCheck("SEO mirror freshness");
  const gen = path.resolve(fileURLToPath(import.meta.url), "../../gen-seo-artifacts.mjs");
  try {
    execFileSync(process.execPath, [gen, "--check"], { stdio: "pipe" });
    check.info("articles.json / sitemap.xml / feed.xml / llms.txt all current");
  } catch (e) {
    const out = `${e.stdout || ""}${e.stderr || ""}`.trim();
    const stale = out.split("\n").filter((l) => l.includes("stale"));
    if (stale.length) for (const l of stale) check.error(l.replace(/^✗\s*/, "").trim());
    else check.error(`gen-seo-artifacts --check failed: ${out || e.message}`);
  }
  return check.result();
}
