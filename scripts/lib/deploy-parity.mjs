// Editorial deploy parity: does production run the catalog the repo says it
// does?
//
// Three views of the article catalog exist at any moment, and the August 2026
// incidents were the case where they disagreed:
//
//   repo   — articles.json in the checkout (what the last merge shipped);
//   asset  — the live /articles.json, served off the asset layer of whichever
//            deployment is active;
//   worker — the catalog frozen into the live Worker bundle by the static
//            import at the top of edge/seo.js, reported by the build-info
//            route (BUILD_INFO_PATH) along with the Worker's version id.
//
// "asset lists a slug the Worker lacks" is the Aug 9 / Aug 12-14 signature:
// the sitemap advertises an article and the Worker 404s it. Nothing in the
// repo can fix that; only a redeploy of current main can. This module is the
// pure comparison plus the two fetches, shared by checks/deploy-parity.mjs
// (the nightly system-checks module, error on the signature) and
// deploy-parity-log.mjs (the nightly record in data/deploy-parity-log.json).
//
// Builtins only. The lighthouse job that writes the log never runs `npm ci`,
// and lib/catalog.mjs imports sharp, so nothing here may import it.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getJson } from "./http.mjs";

export const ROOT = path.resolve(fileURLToPath(import.meta.url), "../../..");
export const SITE_ORIGIN = "https://thetalusfieldjournal.com";
// Duplicated from edge/seo.js on purpose (check-edge-redirects.mjs asserts the
// two agree): the log script must not import the Worker module.
export const BUILD_INFO_PATH = "/.well-known/talus-build.json";
export const LOG_PATH = path.join(ROOT, "scripts", "data", "deploy-parity-log.json");
// Half a year of nightly records; the file stays a few hundred lines.
export const LOG_CAP = 180;

export const VERDICTS = ["parity", "stale-worker", "stale-deploy", "no-route", "unreachable"];

// The newest article by isoDate, not by index: articles.json is newest-first
// today, but a dated correction can re-sort it, and "newest" in a log line has
// to mean the same thing every night.
export function newestSlug(list) {
  let best = null;
  for (const a of list || []) {
    if (!best || String(a.isoDate || "") > String(best.isoDate || "")) best = a;
  }
  return best ? best.slug : null;
}

function diff(a, b) {
  const have = new Set(b);
  return a.filter((s) => !have.has(s));
}

// Pure. workerSlugs is an array, null (unreachable / non-JSON), or the string
// "no-route" (the Worker answered 404: a build older than the route is live).
export function compareCatalogs({ repoSlugs, workerSlugs, assetSlugs }) {
  const out = { missingFromWorker: [], missingFromAsset: [], missingFromRepo: [], extraLive: [], verdict: "parity" };
  if (workerSlugs === "no-route") return { ...out, verdict: "no-route" };
  if (!Array.isArray(workerSlugs) || !Array.isArray(assetSlugs)) return { ...out, verdict: "unreachable" };

  out.missingFromWorker = diff(assetSlugs, workerSlugs);
  out.missingFromAsset = diff(repoSlugs, assetSlugs);
  out.missingFromRepo = diff(repoSlugs, workerSlugs);
  const live = new Set([...assetSlugs, ...workerSlugs]);
  const repo = new Set(repoSlugs);
  out.extraLive = [...live].filter((s) => !repo.has(s));

  if (out.missingFromWorker.length) out.verdict = "stale-worker";
  else if (out.missingFromAsset.length || out.missingFromRepo.length || out.extraLive.length) out.verdict = "stale-deploy";
  return out;
}

// The two live fetches. The asset URL carries a cache-busting query so the
// answer is the active deployment's file, not the CDN's copy of the last one.
export async function fetchLiveViews(baseUrl = SITE_ORIGIN, { getJson: fn = getJson } = {}) {
  const base = String(baseUrl).replace(/\/$/, "");
  const [worker, asset] = await Promise.all([
    fn(`${base}${BUILD_INFO_PATH}`),
    fn(`${base}/articles.json?t=${Date.now()}`),
  ]);
  return {
    worker: { status: worker.status, body: worker.body, error: worker.error || null },
    asset: { status: asset.status, body: asset.body, error: asset.error || null },
  };
}

function slugsOf(status, body, { worker = false } = {}) {
  if (worker && status === 404) return "no-route";
  if (worker) return body && Array.isArray(body.slugs) ? body.slugs : null;
  return Array.isArray(body) ? body.map((a) => a.slug) : null;
}

export function buildRecord({ date, repo, worker, asset }) {
  const workerSlugs = slugsOf(worker.status, worker.body, { worker: true });
  const assetSlugs = slugsOf(asset.status, asset.body);
  const cmp = compareCatalogs({ repoSlugs: repo.slugs, workerSlugs, assetSlugs });
  const wb = worker.body && typeof worker.body === "object" ? worker.body : null;
  const version = wb && wb.version && typeof wb.version === "object" ? wb.version : null;
  return {
    date,
    verdict: cmp.verdict,
    workerVersion: version ? { id: version.id ?? null, tag: version.tag ?? null, timestamp: version.timestamp ?? null } : null,
    worker: {
      status: worker.status,
      count: Array.isArray(workerSlugs) ? workerSlugs.length : null,
      newest: wb && typeof wb.newest === "string" ? wb.newest : null,
      bulletinUpdated: wb && typeof wb.bulletinUpdated === "string" ? wb.bulletinUpdated : null,
    },
    asset: {
      status: asset.status,
      count: Array.isArray(assetSlugs) ? assetSlugs.length : null,
      newest: Array.isArray(asset.body) ? newestSlug(asset.body) : null,
    },
    repo: { count: repo.slugs.length, newest: repo.newest, bulletinUpdated: repo.bulletinUpdated ?? null },
    missingFromWorker: cmp.missingFromWorker,
    missingFromAsset: cmp.missingFromAsset,
    extraLive: cmp.extraLive,
  };
}

// One record per calendar day: a re-run replaces that day's entry, and the
// file keeps the last `cap` days.
export function appendLogEntry(history, entry, cap = LOG_CAP) {
  const kept = (Array.isArray(history) ? history : []).filter((e) => e && e.date !== entry.date);
  kept.push(entry);
  return kept.slice(Math.max(0, kept.length - cap));
}

export function readLog(file = LOG_PATH) {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// The repo's own view, read from the mirrors rather than data.js: the mirrors
// check already fails the build when articles.json drifts from data.js, and
// reading JSON keeps this file free of lib/catalog.mjs.
export function repoView(root = ROOT) {
  const articles = JSON.parse(readFileSync(path.join(root, "articles.json"), "utf8"));
  let bulletinUpdated = null;
  try {
    const bulletin = JSON.parse(readFileSync(path.join(root, "bulletin.json"), "utf8"));
    bulletinUpdated = bulletin?.edition?.updated ?? null;
  } catch {
    /* no bulletin, no stamp */
  }
  return { slugs: articles.map((a) => a.slug), newest: newestSlug(articles), bulletinUpdated };
}

export const REMEDY =
  "redeploy current main from the Cloudflare dashboard (Workers & Pages > the-talus-field > " +
  "Deployments > retry the latest build), or merge anything to main to re-trigger the Workers Build; " +
  "the repo is not wrong, do not change it.";

export function describe(record) {
  const v = record.workerVersion;
  const ver = v && v.id ? `version ${v.id}${v.tag ? ` (${v.tag})` : ""}${v.timestamp ? ` deployed ${v.timestamp}` : ""}` : "version binding not reported";
  switch (record.verdict) {
    case "parity":
      return `deploy parity OK: ${record.repo.count} articles, newest ${record.repo.newest}; Worker ${ver}`;
    case "stale-worker":
      return (
        `the live Worker is STALE: the asset layer serves ${record.missingFromWorker.length} article(s) the Worker bundle ` +
        `does not know (${record.missingFromWorker.join(", ")}), so they 404 while the sitemap lists them ` +
        `(the Aug 2026 signature). Worker ${ver}. Fix: ${REMEDY}`
      );
    case "stale-deploy": {
      const parts = [];
      if (record.missingFromAsset.length) parts.push(`asset layer lacks ${record.missingFromAsset.join(", ")}`);
      if (record.extraLive.length) parts.push(`live carries ${record.extraLive.join(", ")} which the repo does not`);
      return `live lags the repo (${parts.join("; ") || "catalog mismatch"}); a merge may still be deploying (a Workers Build takes a few minutes). Worker ${ver}.`;
    }
    case "no-route":
      return `build-info route not deployed yet (404 at ${BUILD_INFO_PATH}); asset layer ${record.asset.count ?? "?"} vs repo ${record.repo.count} articles`;
    default:
      return `live site unreachable (worker ${record.worker.status}, asset ${record.asset.status})`;
  }
}
