// =============================================================================
// overture-trails.mjs — Yosemite trail/road linework from the Overture Maps
// transportation theme (OSM-derived, © OpenStreetMap contributors, ODbL),
// read straight from the public S3 bucket as GeoParquet.
//
// Why this exists: the USGS National Map quads that gen-hike-tracks.mjs routes
// over are missing or wrong for a handful of signed park trails (see
// scripts/data/trail-tracks-report.md). OpenStreetMap carries the current
// alignments, GPS-trace-verified; Overture republishes OSM on AWS Open Data,
// which is reachable from the build environment. The published-stats
// validation in the generator still applies to every routed hike, so a wrong
// line cannot ship regardless of source.
//
// Mechanics: every parquet part file's footer is fetched with HTTP range
// requests (hyparquet), row groups are pruned by their bbox column statistics
// against PARK_BBOX, and only matching groups are downloaded. The filtered
// segment list is cached in scripts/data/.trailcache/ (gitignored); re-runs
// are offline until the cache is cleared.
// =============================================================================

import fs from 'node:fs'
import path from 'node:path'
import { asyncBufferFromUrl, parquetMetadataAsync, parquetRead } from 'hyparquet'
import { compressors } from 'hyparquet-compressors'

const RELEASE = '2026-06-17.0'
const BUCKET = 'https://overturemaps-us-west-2.s3.us-west-2.amazonaws.com'
const PREFIX = `release/${RELEASE}/theme=transportation/type=segment/`

// Yosemite + margin: covers every hike in the catalog, Hetch Hetchy to Tioga.
export const PARK_BBOX = { xmin: -119.92, ymin: 37.45, xmax: -119.15, ymax: 37.98 }

// Overture road classes walked on foot get 'trail'; drivable classes stay
// 'road' and pick up the router's ROAD_PENALTY like the USGS road layer.
const TRAIL_CLASSES = new Set(['path', 'footway', 'steps', 'track', 'bridleway', 'pedestrian'])

async function listPartFiles(fetchBuf) {
  const files = []
  let token = ''
  for (;;) {
    const tok = token ? `&continuation-token=${encodeURIComponent(token)}` : ''
    const xml = (await fetchBuf(`${BUCKET}/?list-type=2&prefix=${encodeURIComponent(PREFIX)}${tok}`)).toString('utf8')
    for (const m of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
      const key = m[1].match(/<Key>([^<]+)<\/Key>/)?.[1]
      const size = m[1].match(/<Size>(\d+)<\/Size>/)?.[1]
      if (key?.endsWith('.parquet') && size) files.push({ key, size: Number(size) })
    }
    const next = xml.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/)
    if (!next) break
    token = next[1]
  }
  if (!files.length) throw new Error('Overture listing returned no parquet files')
  return files
}

// hyparquet decodes the parquet GEOMETRY logical type to GeoJSON objects.
function geomLines(g) {
  if (!g || !g.type) return []
  if (g.type === 'LineString') return [g.coordinates.map((c) => [c[0], c[1]])]
  if (g.type === 'MultiLineString') return g.coordinates.map((line) => line.map((c) => [c[0], c[1]]))
  return []
}

// Overture segments are NOT pre-noded at junctions: a crossing is recorded in
// each segment's `connectors` list (linear-referenced `at` ∈ [0,1]), and both
// ways usually continue through it mid-segment. The router's graph builder
// only joins segment ENDPOINTS, so split every segment at its connector
// positions — shared connectors then produce coincident endpoints.
function havM(a, b) {
  const dLat = ((b[1] - a[1]) * Math.PI) / 180
  const dLng = ((b[0] - a[0]) * Math.PI) / 180
  const la1 = (a[1] * Math.PI) / 180
  const la2 = (b[1] * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * 6371000 * Math.asin(Math.sqrt(h))
}

function splitAtConnectors(pts, connectors) {
  const ats = [...new Set((connectors ?? []).map((c) => Number(c.at)).filter((a) => a > 0.001 && a < 0.999))].sort(
    (x, y) => x - y,
  )
  if (!ats.length) return [pts]
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + havM(pts[i - 1], pts[i]))
  const total = cum[cum.length - 1]
  if (total === 0) return [pts]
  const out = []
  let cur = [pts[0]]
  let vi = 1
  for (const at of ats) {
    const target = at * total
    while (vi < pts.length && cum[vi] < target) cur.push(pts[vi++])
    const a = pts[vi - 1]
    const b = pts[Math.min(vi, pts.length - 1)]
    const segLen = cum[Math.min(vi, pts.length - 1)] - cum[vi - 1]
    const t = segLen > 0 ? (target - cum[vi - 1]) / segLen : 0
    const cp = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    cur.push(cp)
    if (cur.length >= 2) out.push(cur)
    cur = [cp]
  }
  while (vi < pts.length) cur.push(pts[vi++])
  if (cur.length >= 2) out.push(cur)
  return out
}

// Row-group pruning: read bbox.{xmin,xmax,ymin,ymax} column statistics.
function groupIntersects(rowGroup, bbox) {
  const stat = {}
  for (const c of rowGroup.columns) {
    const p = c.meta_data?.path_in_schema?.join('.')
    if (p === 'bbox.xmin' || p === 'bbox.xmax' || p === 'bbox.ymin' || p === 'bbox.ymax') {
      const s = c.meta_data.statistics
      if (!s || s.min_value == null || s.max_value == null) return true // no stats: read it
      stat[p] = [Number(s.min_value), Number(s.max_value)]
    }
  }
  if (!stat['bbox.xmin']) return true
  return (
    stat['bbox.xmin'][0] <= bbox.xmax &&
    stat['bbox.xmax'][1] >= bbox.xmin &&
    stat['bbox.ymin'][0] <= bbox.ymax &&
    stat['bbox.ymax'][1] >= bbox.ymin
  )
}

async function readMatchingRows(file, bbox) {
  const url = `${BUCKET}/${file.key}`
  const buf = await asyncBufferFromUrl({ url, byteLength: file.size })
  const md = await parquetMetadataAsync(buf)
  const rows = []
  let rowStart = 0
  const spans = []
  for (const rg of md.row_groups) {
    const n = Number(rg.num_rows)
    if (groupIntersects(rg, bbox)) spans.push([rowStart, rowStart + n])
    rowStart += n
  }
  for (const [s, e] of spans) {
    await parquetRead({
      file: buf,
      metadata: md,
      compressors,
      columns: ['bbox', 'subtype', 'class', 'names', 'geometry', 'connectors'],
      rowStart: s,
      rowEnd: e,
      rowFormat: 'object',
      onComplete: (data) => rows.push(...data),
    })
  }
  return rows
}

/**
 * Returns [{pts: [[lng,lat],...], name, kind: 'trail'|'road'}] for the park
 * bbox, from the local cache when present.
 */
export async function ensureOvertureTrails(cacheDir, fetchBuf) {
  const cacheFile = path.join(cacheDir, `overture-trails-${RELEASE}-v2.json`)
  if (fs.existsSync(cacheFile)) return JSON.parse(fs.readFileSync(cacheFile, 'utf8'))

  console.log(`  fetching Overture ${RELEASE} transportation segments (OSM-derived)…`)
  const files = await listPartFiles(fetchBuf)
  console.log(`  ${files.length} part files; pruning row groups by bbox stats`)

  const segs = []
  let done = 0
  const CONCURRENCY = 8
  const queue = [...files]
  const worker = async () => {
    for (;;) {
      const file = queue.shift()
      if (!file) return
      const rows = await readMatchingRows(file, PARK_BBOX)
      for (const r of rows) {
        if (r.subtype !== 'road' || !r.geometry) continue
        const b = r.bbox
        if (!b || b.xmin > PARK_BBOX.xmax || b.xmax < PARK_BBOX.xmin || b.ymin > PARK_BBOX.ymax || b.ymax < PARK_BBOX.ymin) continue
        const kind = TRAIL_CLASSES.has(r.class) ? 'trail' : 'road'
        for (const line of geomLines(r.geometry)) {
          for (const pts of splitAtConnectors(line, r.connectors)) {
            if (pts.length >= 2) segs.push({ pts, name: r.names?.primary ?? '', kind })
          }
        }
      }
      done++
      if (done % 40 === 0) console.log(`  …${done}/${files.length} files scanned, ${segs.length} segments so far`)
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  fs.mkdirSync(cacheDir, { recursive: true })
  fs.writeFileSync(cacheFile, JSON.stringify(segs))
  console.log(`  ${segs.length} Overture segments cached (${(fs.statSync(cacheFile).size / 1e6).toFixed(1)} MB)`)
  return segs
}
