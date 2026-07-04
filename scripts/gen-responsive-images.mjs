#!/usr/bin/env node
// Offline responsive-image generator for the build-free editorial site (and the
// PWA's public photos). Run manually from this dir: `cd scripts && npm install && npm run images`.
// The tooling's package.json lives here in scripts/ (NOT the repo root) so Cloudflare
// Pages keeps deploying the root as a static, build-free site.
//
// For each source JPEG it writes AVIF + WebP + JPEG variants at several widths
// into a sibling `responsive/` folder, using a slugified base name so the
// in-browser ResponsiveImage helper can derive the URLs with no manifest:
//
//   img/Half Dome Main Photo.jpg
//     -> img/responsive/half-dome-main-photo-400.avif  (+ .webp, .jpg)
//     -> img/responsive/half-dome-main-photo-800.avif  ...
//
// The generated files are committed to the repo; the live site serves them as
// plain static assets and never runs this script. Idempotent: a variant is
// regenerated only when its source is newer (or it is missing).

import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");

// Directories whose JPEGs get responsive variants. Output lands in `<dir>/responsive/`.
// `ogCards: true` additionally emits a `<slug>-og.jpg` social-card variant
// (upscaled to OG_MIN_WIDTH) for sources too small for scrapers' 1200px
// preference — editorial img/ only; the PWA photos never ship as og:image.
const TARGET_DIRS = [
  { dir: path.join(ROOT, "img"), ogCards: true },
  { dir: path.join(ROOT, "apps/guide/public/photos"), ogCards: false },
];

// Social scrapers (Facebook, Twitter/X, LinkedIn, Slack) want og:image at
// least 1200px wide for a full-bleed card. Sources below that get a dedicated
// upscaled -og.jpg used ONLY as og:image; the displayed srcset variants are
// never upscaled.
const OG_MIN_WIDTH = 1200;

// Per-source crop position overrides for the portrait→1200x630 og cards,
// keyed by slugified basename. Default is a center crop; add an entry here
// when the photo's subject sits away from the vertical center (verify the
// output visually after changing).
const OG_CROP_POSITION = {
  "lower-yosemite-fall": "top",
};

// The sitewide default social card: a 1200x630 (the canonical 1.91:1 og ratio)
// center crop of a landscape Half Dome source. Referenced by index.html,
// app.jsx, and functions/_middleware.js as the og:image for every non-article
// route. Regenerated only when the source is newer.
const DEFAULT_OG_CARD = {
  source: path.join(ROOT, "img/half-dome-alpenglow-madhu-shesharam.jpg"),
  out: path.join(ROOT, "img/og-default.jpg"),
  width: 1200,
  height: 630,
};

const WIDTHS = [400, 800, 1200, 1600];

const FORMATS = [
  { ext: "avif", apply: (img) => img.avif({ quality: 50 }) },
  { ext: "webp", apply: (img) => img.webp({ quality: 72 }) },
  { ext: "jpg", apply: (img) => img.jpeg({ quality: 72, mozjpeg: true }) },
];

const SOURCE_RE = /\.(jpe?g)$/i;

// Mirror of slugify() in the browser ResponsiveImage helper — keep in sync.
function slugify(basename) {
  return basename
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function newerThan(a, b) {
  // true if file `a` is newer than file `b` (or `b` is missing)
  if (!existsSync(b)) return true;
  const [sa, sb] = await Promise.all([stat(a), stat(b)]);
  return sa.mtimeMs > sb.mtimeMs;
}

async function processDir(dir, ogCards) {
  if (!existsSync(dir)) return { dir, made: 0, skipped: 0, sources: 0 };
  const outDir = path.join(dir, "responsive");
  await mkdir(outDir, { recursive: true });

  const entries = (await readdir(dir)).filter((f) => SOURCE_RE.test(f));
  let made = 0;
  let skipped = 0;

  for (const file of entries) {
    const srcPath = path.join(dir, file);
    const slug = slugify(file);
    // og-default.jpg is itself a generated social card (see DEFAULT_OG_CARD);
    // it is never rendered in-page, so it needs no srcset variants.
    if (slug === "og-default") continue;
    const meta = await sharp(srcPath).metadata();
    const srcWidth = meta.width || Math.max(...WIDTHS);

    for (const w of WIDTHS) {
      // Emit every width so the browser helper can list a fixed srcset with no
      // manifest and never 404. Never upscale: a width past the source size is
      // clamped to the source (withoutEnlargement makes this a no-op resize), so
      // those variants simply repeat the full-size bytes rather than enlarging.
      const targetW = Math.min(w, srcWidth);

      for (const fmt of FORMATS) {
        const outPath = path.join(outDir, `${slug}-${w}.${fmt.ext}`);
        if (!(await newerThan(srcPath, outPath))) {
          skipped++;
          continue;
        }
        await fmt
          .apply(sharp(srcPath).resize({ width: targetW, withoutEnlargement: true }))
          .toFile(outPath);
        made++;
      }
    }

    // Social-card variant: sources that make a bad og:image also get a
    // <slug>-og.jpg. Used only as og:image (see scripts/lib/catalog.mjs
    // ogImageFor), never in the displayed srcset. Two cases:
    //   - portrait sources → 1200x630 saliency crop (scrapers center-crop
    //     extreme portrait images unpredictably; every major platform wants
    //     ~1.91:1)
    //   - narrow landscape sources (< OG_MIN_WIDTH) → upscaled to 1200 wide
    const portrait = (meta.height || 0) > srcWidth;
    if (ogCards && (portrait || srcWidth < OG_MIN_WIDTH)) {
      const ogPath = path.join(outDir, `${slug}-og.jpg`);
      if (await newerThan(srcPath, ogPath)) {
        const resize = portrait
          ? { width: OG_MIN_WIDTH, height: 630, fit: "cover", position: OG_CROP_POSITION[slug] || "centre" }
          : { width: OG_MIN_WIDTH };
        await sharp(srcPath)
          .resize(resize)
          .jpeg({ quality: 78, mozjpeg: true })
          .toFile(ogPath);
        made++;
      } else {
        skipped++;
      }
    }
  }

  return { dir: path.relative(ROOT, dir), made, skipped, sources: entries.length };
}

async function makeDefaultOgCard() {
  const { source, out, width, height } = DEFAULT_OG_CARD;
  if (!existsSync(source)) {
    console.error(`default og card source missing: ${path.relative(ROOT, source)}`);
    process.exit(1);
  }
  if (!(await newerThan(source, out))) return false;
  await sharp(source)
    .resize({ width, height, fit: "cover" })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(out);
  return true;
}

async function main() {
  console.log("Generating responsive image variants...\n");
  for (const { dir, ogCards } of TARGET_DIRS) {
    const r = await processDir(dir, ogCards);
    console.log(
      `  ${r.dir.padEnd(28)} sources: ${String(r.sources).padStart(3)}  written: ${String(
        r.made
      ).padStart(4)}  up-to-date: ${String(r.skipped).padStart(4)}`
    );
  }
  const wroteCard = await makeDefaultOgCard();
  console.log(`  ${"img/og-default.jpg".padEnd(28)} ${wroteCard ? "written" : "up-to-date"}`);
  console.log("\nDone. Variants live in each directory's responsive/ subfolder.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
