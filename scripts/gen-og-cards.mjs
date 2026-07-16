// Generate the static Open Graph cards for shared trip links (/map?trip=...).
//
// edge/seo.js picks img/og/trip-<n>.jpg by validated stop count (n clamped to
// 20; the 20 card reads "20+ stops"), so a shared trip unfurls in iMessage and
// social scrapers as a real card instead of the generic site image. Cards are
// static on purpose: stop-count granularity captures nearly all of the unfurl
// value at a fraction of the cost of per-trip dynamic rendering, and static
// JPEGs ride the same immutable /img/* cache as every other site image.
//
// Run after changing the backdrop or copy:  npm --prefix scripts run og
// Commit the regenerated img/og/*.jpg files. Text uses generic font families
// (rendered by sharp's librsvg), so regeneration is portable across machines
// even though exact glyph metrics may differ slightly.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "img", "og");
// A clean landscape without baked-in text; og-default.jpg carries the site
// wordmark already and would clash with the overlay.
const BACKDROP = path.join(ROOT, "img", "half-dome-valley-vista.jpg");

const WIDTH = 1200;
const HEIGHT = 630;
const MAX_CARD = 20;

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function overlaySvg(stopsLabel) {
  // Bottom-anchored scrim so the photo stays legible behind the text. Brand
  // palette: paper #f1ead6 for the text, moss-adjacent warm dark for depth.
  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.35" stop-color="#14110c" stop-opacity="0"/>
      <stop offset="1" stop-color="#14110c" stop-opacity="0.88"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scrim)"/>
  <text x="72" y="472" font-family="sans-serif" font-size="26" font-weight="700" letter-spacing="6" fill="#e6dcc1">A YOSEMITE TRIP</text>
  <text x="72" y="546" font-family="serif" font-size="64" fill="#f1ead6">${escapeXml(stopsLabel)}, in drive order</text>
  <text x="${WIDTH - 72}" y="90" text-anchor="end" font-family="serif" font-size="34" fill="#f1ead6">The Talus Field</text>
</svg>`;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const base = await sharp(BACKDROP)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
    .toBuffer();

  for (let n = 1; n <= MAX_CARD; n++) {
    const stopsLabel =
      n === MAX_CARD ? `${MAX_CARD}+ stops` : n === 1 ? "1 stop" : `${n} stops`;
    const out = path.join(OUT_DIR, `trip-${n}.jpg`);
    await sharp(base)
      .composite([{ input: Buffer.from(overlaySvg(stopsLabel)) }])
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(out);
    console.log(`wrote img/og/trip-${n}.jpg`);
  }
}

main().catch((e) => {
  console.error(e.stack || e);
  process.exit(2);
});
