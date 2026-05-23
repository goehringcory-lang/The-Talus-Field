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
const TARGET_DIRS = [
  path.join(ROOT, "img"),
  path.join(ROOT, "apps/guide/public/photos"),
];

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

async function processDir(dir) {
  if (!existsSync(dir)) return { dir, made: 0, skipped: 0, sources: 0 };
  const outDir = path.join(dir, "responsive");
  await mkdir(outDir, { recursive: true });

  const entries = (await readdir(dir)).filter((f) => SOURCE_RE.test(f));
  let made = 0;
  let skipped = 0;

  for (const file of entries) {
    const srcPath = path.join(dir, file);
    const slug = slugify(file);
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
  }

  return { dir: path.relative(ROOT, dir), made, skipped, sources: entries.length };
}

async function main() {
  console.log("Generating responsive image variants...\n");
  for (const dir of TARGET_DIRS) {
    const r = await processDir(dir);
    console.log(
      `  ${r.dir.padEnd(28)} sources: ${String(r.sources).padStart(3)}  written: ${String(
        r.made
      ).padStart(4)}  up-to-date: ${String(r.skipped).padStart(4)}`
    );
  }
  console.log("\nDone. Variants live in each directory's responsive/ subfolder.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
