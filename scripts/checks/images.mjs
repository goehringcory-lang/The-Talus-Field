// Image hygiene.
//
// Flags oversized source images that aren't served through the responsive
// pipeline, and editorial image usages that risk layout shift (no aspect-ratio /
// dimensions) or hurt accessibility/SEO (no alt text). All warnings — these are
// quality signals, not breakages.
//
// Editorial images render via the Placeholder / ResponsiveImage components
// (components.jsx), where the `caption` prop becomes the <img alt> and an
// `aspectRatio` style reserves layout space. A bare <img> needs an explicit alt.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { ROOT, slugify } from "../lib/catalog.mjs";
import { makeCheck } from "../lib/report.mjs";

const OVERSIZE_BYTES = 1.5 * 1024 * 1024;

function hasResponsiveSet(file) {
  const variant = `img/responsive/${slugify(path.basename(file))}-1600.jpg`;
  return existsSync(path.join(ROOT, variant));
}

// Slice out a component's opening tag, tolerating nested JSX like
// motif={<MotifMountains />} that would fool a naive "first >" scan.
function tagWindow(src, start) {
  const blank = src.indexOf("\n\n", start);
  const end = blank === -1 ? Math.min(src.length, start + 900) : blank;
  return src.slice(start, end);
}

export default async function checkImages() {
  const check = makeCheck("Image hygiene");

  // 1. Oversized source images without a responsive variant.
  const imgDir = path.join(ROOT, "img");
  let oversized = 0;
  for (const f of readdirSync(imgDir)) {
    if (!/\.(jpe?g|png)$/i.test(f)) continue;
    const full = path.join(imgDir, f);
    if (!statSync(full).isFile()) continue;
    const bytes = statSync(full).size;
    if (bytes > OVERSIZE_BYTES && !hasResponsiveSet(f)) {
      oversized++;
      check.warn(`oversized source served directly: img/${f} (${(bytes / 1024 / 1024).toFixed(1)} MB, no responsive variant)`);
    }
  }
  if (!oversized) check.info("no oversized images lacking responsive variants");

  // 2. Editorial image usages: alt text + layout-shift guards.
  const bodies = path.join(ROOT, "bodies");
  let usages = 0;
  let missingAlt = 0;
  let missingDims = 0;
  for (const file of readdirSync(bodies)) {
    if (!file.endsWith(".jsx")) continue;
    const rel = `bodies/${file}`;
    const src = readFileSync(path.join(bodies, file), "utf8");

    for (const m of src.matchAll(/<(Placeholder|ResponsiveImage)\b/g)) {
      usages++;
      const win = tagWindow(src, m.index);
      if (!/\bcaption\s*=/.test(win) && !/\balt\s*=/.test(win)) {
        missingAlt++;
        check.warn(`${rel}: <${m[1]}> without caption/alt text`);
      }
      if (!/aspectRatio/.test(win) && !/\bwidth\s*=/.test(win) && !/\bheight\s*=/.test(win)) {
        missingDims++;
        check.warn(`${rel}: <${m[1]}> without aspectRatio/width/height (layout-shift risk)`);
      }
    }

    for (const m of src.matchAll(/<img\b[^>]*>/g)) {
      usages++;
      if (!/\balt\s*=/.test(m[0])) {
        missingAlt++;
        check.warn(`${rel}: bare <img> without alt`);
      }
    }
  }

  check.info(`${usages} editorial image usages; ${missingAlt} missing alt, ${missingDims} missing dimensions`);

  // 3. Every local image the site renders through ResponsiveImage (an article's
  // `image` in data.js, an `image=` prop in a page or body) needs its whole
  // ladder: the helper lists a fixed AVIF/WebP/JPEG srcset with no manifest,
  // so one missing width is a 404 the browser picks, and the hero renders as a
  // broken image. Seen October 2026 on the ranger-programs article, whose
  // master landed without `run images`. An error, since it is a visible break.
  const IMAGE_REF = /image(?:=\{?|:\s*)["'](\/?img\/[^"']+\.(?:jpe?g|png))["']/g;
  const sources = ["data.js", ...readdirSync(ROOT).filter((f) => f.endsWith(".jsx"))]
    .concat(readdirSync(bodies).filter((f) => f.endsWith(".jsx")).map((f) => `bodies/${f}`));
  const refs = new Set();
  for (const rel of sources) {
    for (const m of readFileSync(path.join(ROOT, rel), "utf8").matchAll(IMAGE_REF)) refs.add(m[1].replace(/^\//, ""));
  }
  let gaps = 0;
  for (const ref of refs) {
    const dir = path.dirname(ref);
    const slug = slugify(path.basename(ref));
    const missing = [];
    for (const w of [400, 800, 1200, 1600]) {
      for (const ext of ["avif", "webp", "jpg"]) {
        if (!existsSync(path.join(ROOT, dir, "responsive", `${slug}-${w}.${ext}`))) missing.push(`${w}.${ext}`);
      }
    }
    if (missing.length) {
      gaps++;
      check.error(`${ref}: responsive ladder incomplete (missing ${missing.join(", ")}); run \`npm --prefix scripts run images\``);
    }
  }
  if (!gaps) check.info(`${refs.size} rendered images, every responsive ladder complete`);
  return check.result();
}
