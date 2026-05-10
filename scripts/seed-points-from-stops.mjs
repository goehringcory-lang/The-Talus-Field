// One-shot ETL: read apps/guide/src/content/stops.ts, write points.geojson.
// Run once after the editorial map is set up; thereafter maintain points.geojson
// by hand. Re-running is non-destructive only if you've kept the seed pins
// untouched — it overwrites the file.
//
//   node scripts/seed-points-from-stops.mjs
//
// Drives, meals, and stops without coords are skipped. A small per-id override
// map handles cases where the PWA's `kind` enum doesn't cleanly map to the
// editorial map's `category` enum (e.g. Bridalveil Fall is `trailhead` in the
// PWA but should be `waterfall` on the map).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const STOPS_FILE = resolve(ROOT, 'apps', 'guide', 'src', 'content', 'stops.ts')
const OUT_FILE = resolve(ROOT, 'points.geojson')

// Per-id category override. Where blank, falls back to kind→category mapping.
const CATEGORY_BY_ID = {
  'bridalveil-fall': 'waterfall',
  'ahwahnee-hotel': 'lodging',
  'mariposa-grove': 'sequoia',
  'sentinel-dome': 'viewpoint', // composite stop covering both Sentinel Dome and Taft Point
  'mist-trail': 'hike',
  'cooks-meadow-loop': 'hike',
  'mirror-lake': 'hike',
  'cathedral-lakes': 'hike',
  'soda-springs-parsons-lodge': 'hike',
  'old-big-oak-flat-road': 'hike',
}

// Per-id article-slug list. Empty arrays for stops without confirmed mentions —
// fill in by hand as the article-to-pin reverse index gets built out.
const ARTICLES_BY_ID = {
  'tunnel-view': ['first-time-yosemite-overwhelm', 'yosemite-for-non-hikers'],
  'cooks-meadow-loop': ['first-time-yosemite-overwhelm', 'yosemite-for-non-hikers'],
  'bridalveil-fall': ['first-time-yosemite-overwhelm', 'water-ouzels-waterfalls'],
  'old-big-oak-flat-road': [],
  'el-capitan-meadow': ['first-time-yosemite-overwhelm', 'yosemite-for-non-hikers'],
  'mirror-lake': ['yosemite-for-non-hikers'],
  'mist-trail': ['water-ouzels-waterfalls'],
  'ahwahnee-hotel': ['yosemite-for-non-hikers'],
  'sentinel-bridge-sunset': ['first-time-yosemite-overwhelm', 'yosemite-for-non-hikers'],
  'curry-village': ['first-time-yosemite-overwhelm', 'yosemite-without-reservations-2026'],
  'sentinel-dome': ['yosemite-stargazing-where-to-look-up'],
  'glacier-point': ['first-time-yosemite-overwhelm', 'yosemite-for-non-hikers'],
  'mariposa-grove': ['giant-sequoias-fire-adaptation'],
  'olmsted-point': ['yosemite-stargazing-where-to-look-up'],
  'tenaya-lake': [],
  'cathedral-lakes': [],
  'soda-springs-parsons-lodge': [],
}

// Skip these — they're either roads (drives) or food (meal redundant with lodging coord).
const SKIP_KINDS = new Set(['drive', 'meal'])

const KIND_TO_CATEGORY = {
  viewpoint: 'viewpoint',
  trailhead: 'hike',
  parking: 'viewpoint',
  lodging: 'lodging',
}

// Extract a JS-evaluable array literal from a TypeScript file by carefully
// counting brackets while respecting strings, template literals, and comments.
function extractArrayLiteral(src, marker) {
  const markerIdx = src.indexOf(marker)
  if (markerIdx === -1) throw new Error(`Could not find marker: ${marker}`)
  // Anchor on `=` after the marker to skip past any TypeScript type annotation
  // brackets in the marker itself (e.g. `StopInput[]`).
  const eqIdx = src.indexOf('=', markerIdx)
  if (eqIdx === -1) throw new Error('No = after marker')
  let i = src.indexOf('[', eqIdx)
  if (i === -1) throw new Error('No [ after =')
  const startIdx = i
  let depth = 1
  let pos = i + 1
  let inStr = null
  let inLine = false
  let inBlock = false
  while (pos < src.length && depth > 0) {
    const c = src[pos]
    const next = src[pos + 1]
    if (inLine) {
      if (c === '\n') inLine = false
      pos++; continue
    }
    if (inBlock) {
      if (c === '*' && next === '/') { inBlock = false; pos += 2; continue }
      pos++; continue
    }
    if (inStr) {
      if (c === '\\') { pos += 2; continue }
      if (c === inStr) inStr = null
      pos++; continue
    }
    if (c === '/' && next === '/') { inLine = true; pos += 2; continue }
    if (c === '/' && next === '*') { inBlock = true; pos += 2; continue }
    if (c === '\'' || c === '"' || c === '`') { inStr = c; pos++; continue }
    if (c === '[') depth++
    if (c === ']') depth--
    pos++
  }
  return src.slice(startIdx, pos)
}

function firstSentence(body) {
  if (!body) return ''
  // Take everything up to the first sentence-ending punctuation followed by space + capital,
  // or up to the first newline if shorter. Cap at ~200 chars.
  const trimmed = body.trim()
  const newlineIdx = trimmed.indexOf('\n')
  const candidate = newlineIdx > 0 ? trimmed.slice(0, newlineIdx) : trimmed
  const match = candidate.match(/^(.{1,200}?[.!?])(?:\s|$)/)
  if (match) return match[1].trim()
  return candidate.slice(0, 200).trim()
}

function nameFromTitle(title) {
  // Strip trailing ", subtitle clause" — e.g. "Tunnel View, the moment the valley opens" → "Tunnel View"
  return title.split(',')[0].trim()
}

function main() {
  const src = readFileSync(STOPS_FILE, 'utf8')
  const arrText = extractArrayLiteral(src, 'const seed: StopInput[] =')
  // Evaluate the array literal in an isolated function. The array is plain JS
  // object syntax once TS annotations on the surrounding line are stripped.
  const stops = new Function(`return ${arrText}`)()

  const features = []
  for (const stop of stops) {
    if (SKIP_KINDS.has(stop.kind)) continue
    if (!stop.coord) continue
    const category = CATEGORY_BY_ID[stop.id] || KIND_TO_CATEGORY[stop.kind] || 'viewpoint'
    const articles = ARTICLES_BY_ID[stop.id] || []
    // PWA serves photos at /photos/<file>. The editorial site has the same
    // photographs in img/<file>. Rewrite the path to point at the editorial
    // site's copy. (If a file name differs, the <img> just 404s — acceptable
    // for the hidden preview; pin still renders.)
    const image = stop.photos && stop.photos[0]
      ? stop.photos[0].src.replace(/^\/?photos\//, 'img/')
      : null
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: stop.coord },
      properties: {
        id: stop.id,
        name: nameFromTitle(stop.title),
        category,
        region: stop.region,
        blurb: firstSentence(stop.body),
        image,
        articles,
        verified: false,
      },
    })
  }

  // Editorial pins not in the PWA — coords sourced from the user's research table.
  const editorialPins = [
    {
      id: 'half-dome',
      name: 'Half Dome',
      category: 'geology',
      region: 'valley',
      coord: [-119.532939, 37.746036],
      blurb: 'The granite anchor of the valley. Pin marks the summit; you look at it, you don\'t go there without a permit.',
      image: 'img/half-dome.jpg',
      articles: ['first-time-yosemite-overwhelm', 'yosemite-glaciers-climate'],
      verified: false,
    },
    {
      id: 'cathedral-peak',
      name: 'Cathedral Peak',
      category: 'geology',
      region: 'tuolumne',
      coord: [-119.405621, 37.847828],
      blurb: 'The granite arête John Muir camped on in 1869. 10,916 ft, the centerpiece of the Cathedral Range.',
      image: null,
      articles: [],
      verified: false,
    },
    {
      id: 'hetch-hetchy-dam',
      name: 'O\'Shaughnessy Dam',
      category: 'viewpoint',
      region: 'hetch-hetchy',
      coord: [-119.788333, 37.947500],
      blurb: 'The dam that flooded the other Yosemite Valley in 1923. Walk the crest for the long view up the reservoir.',
      image: null,
      articles: ['hetch-hetchy-the-other-yosemite-valley'],
      verified: false,
    },
    {
      id: 'wapama-falls',
      name: 'Wapama Falls',
      category: 'waterfall',
      region: 'hetch-hetchy',
      coord: [-119.765555, 37.967222],
      blurb: '1,080 feet of tiered falls. The bridge crossing gets soaked in spring; bring a layer.',
      image: null,
      articles: ['hetch-hetchy-the-other-yosemite-valley', 'water-ouzels-waterfalls'],
      verified: false,
    },
    {
      id: 'tueeulala-falls',
      name: 'Tueeulala Falls',
      category: 'waterfall',
      region: 'hetch-hetchy',
      coord: [-119.772777, 37.964166],
      blurb: 'An 880-foot plunge fall on the north side of the reservoir. Dries by midsummer.',
      image: null,
      articles: ['hetch-hetchy-the-other-yosemite-valley'],
      verified: false,
    },
    {
      id: 'mt-lyell-glacier',
      name: 'Mt. Lyell Glacier',
      category: 'geology',
      region: 'tuolumne',
      coord: [-119.269166, 37.743055],
      blurb: 'Historically the park\'s largest glacier. The 1933 cairn is now four hundred feet from the ice.',
      image: 'img/tuolumne-meadows.jpg',
      articles: ['yosemite-glaciers-climate'],
      verified: false,
    },
    {
      id: 'valley-view',
      name: 'Valley View',
      category: 'viewpoint',
      region: 'valley',
      coord: [-119.667232, 37.717431],
      blurb: 'Gates of the Valley. Lower angle than Tunnel View, fewer cars, El Capitan straight ahead.',
      image: null,
      articles: ['first-time-yosemite-overwhelm'],
      verified: false,
    },
    {
      id: 'washburn-point',
      name: 'Washburn Point',
      category: 'viewpoint',
      region: 'glacier-mariposa',
      coord: [-119.573000, 37.720388],
      blurb: '7,450 feet. Edge-on profile of Half Dome and the Vernal-Nevada chain. Often empty when Glacier Point is mobbed.',
      image: null,
      articles: ['first-time-yosemite-overwhelm'],
      verified: false,
    },
    {
      id: 'cathedral-rocks',
      name: 'Cathedral Rocks',
      category: 'geology',
      region: 'valley',
      coord: [-119.636500, 37.714720],
      blurb: 'Middle Cathedral Rock at 6,648 ft, due south of El Capitan. Best seen from the Bridalveil parking lot.',
      image: 'img/cathedral-rocks.jpg',
      articles: [],
      verified: false,
    },
    {
      id: 'glen-aulin',
      name: 'Glen Aulin',
      category: 'lodging',
      region: 'tuolumne',
      coord: [-119.418651, 37.909501],
      blurb: 'High Sierra Camp at 7,800 ft in the Tuolumne River gorge. Tent cabins, meals, a swimming hole below the falls.',
      image: null,
      articles: [],
      verified: false,
    },
  ]

  for (const p of editorialPins) {
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: p.coord },
      properties: {
        id: p.id,
        name: p.name,
        category: p.category,
        region: p.region,
        blurb: p.blurb,
        image: p.image,
        articles: p.articles,
        verified: p.verified,
      },
    })
  }

  const collection = { type: 'FeatureCollection', features }

  if (!existsSync(dirname(OUT_FILE))) mkdirSync(dirname(OUT_FILE), { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify(collection, null, 2) + '\n', 'utf8')

  console.log(`Wrote ${features.length} features to ${OUT_FILE}`)
  const byCategory = {}
  const byRegion = {}
  for (const f of features) {
    byCategory[f.properties.category] = (byCategory[f.properties.category] || 0) + 1
    byRegion[f.properties.region] = (byRegion[f.properties.region] || 0) + 1
  }
  console.log('  by category:', byCategory)
  console.log('  by region:', byRegion)
}

main()
