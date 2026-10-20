#!/usr/bin/env node
// =============================================================================
// gen-hike-tracks.mjs — verified trail tracks + elevation profiles for the
// Field Guide PWA's day-hike catalog (apps/guide/src/content/hikes.ts).
//
// Sources (all fetched over the network):
//   Geometry   USGS National Map, TopoMapVector 7.5' quads, Trans_TrailSegment
//              (+ Trans_RoadSegment for hikes that follow old road grades).
//              The park's segments carry NPS as the source originator.
//              https://prd-tnm.s3.amazonaws.com/StagedProducts/TopoMapVector/
//              Public domain.
//              For hikes whose route the USGS linework is missing or has
//              wrong (spec field `source: 'osm'`), OpenStreetMap linework via
//              the Overture Maps GeoParquet distribution on AWS Open Data
//              (© OpenStreetMap contributors, ODbL) — see lib/overture-trails.mjs.
//   Elevation  USGS 3DEP via the AWS Open Data terrain tiles ("terrarium"
//              encoding), sampled bilinearly at zoom 14 (~9 m/px).
//              https://s3.amazonaws.com/elevation-tiles-prod/
//
// For each hike, scripts/data/hike-track-specs.mjs supplies waypoints that
// steer a shortest-path router across the stitched trail network; the emitted
// geometry is entirely mapped linework, never hand-drawn. Every result is
// validated against the published distance and elevation gain in hikes.ts —
// a route that cannot be verified is NOT emitted (see the report).
//
// Outputs:
//   apps/guide/public/tracks/<hikeId>.json      per-hike track + profile
//   apps/guide/src/content/trails.generated.ts  bundled stats index
//   scripts/data/trail-tracks-report.md         verification report
//
// Usage:  cd scripts && npm install && node gen-hike-tracks.mjs [--only id,id]
// Downloads ~90 MB of quad data on first run into scripts/data/.trailcache/
// (gitignored). Re-runs are offline until the cache is cleared.
// =============================================================================

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { HIKE_TRACK_SPECS } from './data/hike-track-specs.mjs'
import { ensureOvertureTrails } from './lib/overture-trails.mjs'
import {
  CACHE,
  DEFAULT_SNAP_M,
  M_PER_MI,
  SIMPLIFY_M,
  buildNetwork,
  buildProfile,
  douglasPeucker,
  ensureQuad,
  fetchBuf,
  havM,
  lineLenM,
  nearestOnNetwork,
  profileStats,
  projectPoint,
  readLayer,
  route,
} from './lib/trail-network.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const TRACKS_OUT = path.join(ROOT, 'apps/guide/public/tracks')
const INDEX_OUT = path.join(ROOT, 'apps/guide/src/content/trails.generated.ts')
const REPORT_OUT = path.join(__dirname, 'data', 'trail-tracks-report.md')
const HIKES_SRC = path.join(ROOT, 'apps/guide/src/content/hikes.ts')

// 7.5-minute quads covering every routed hike. Names are USGS cell names.
const QUADS = [
  'Mariposa Grove', 'Wawona',
  'El Portal', 'El Capitan', 'Half Dome', 'Merced Peak',
  'Ackerson Mountain', 'Tamarack Flat', 'Yosemite Falls', 'Tenaya Lake',
  'Vogelsang Peak', 'Koip Peak',
  'Lake Eleanor', 'Hetch Hetchy Reservoir', 'Falls Ridge', 'Tioga Pass', 'Mount Dana',
]

// --- load hikes.ts -----------------------------------------------------------
function loadHikes() {
  const src = fs.readFileSync(HIKES_SRC, 'utf8')
  const m = src.match(/const seed: HikeT\[\] = (\[[\s\S]*\n\])\s*\n\s*export const HIKES/)
  if (!m) throw new Error('could not locate the seed array in hikes.ts')
  return vm.runInNewContext(`(${m[1]})`)
}

// --- main --------------------------------------------------------------------
async function main() {
  const only = process.argv.includes('--only')
    ? process.argv[process.argv.indexOf('--only') + 1].split(',')
    : null

  const hikes = loadHikes()
  console.log(`${hikes.length} hikes in the catalog`)

  console.log('Loading USGS quads…')
  const segs = []
  for (const q of QUADS) {
    const zipPath = await ensureQuad(q)
    for (const layer of ['Trans_TrailSegment', 'Trans_RoadSegment']) {
      const kind = layer === 'Trans_TrailSegment' ? 'trail' : 'road'
      for (const f of await readLayer(zipPath, layer)) {
        const g = f.geometry
        if (!g) continue
        const lines = g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : []
        for (const line of lines) {
          const pts = line.map((c) => [c[0], c[1]])
          if (pts.length >= 2) {
            segs.push({ pts, name: f.properties?.name ?? '', kind })
          }
        }
      }
    }
  }
  console.log(`${segs.length} raw segments (trails + roads)`)

  console.log('Building network…')
  const net = buildNetwork(segs)
  console.log(`${net.segs.length} noded segments`)

  // Second network from OSM linework (via Overture) for the hikes whose spec
  // opts in with `source: 'osm'` — routes the USGS quads are missing or map
  // on retired alignments. Built lazily; the debug tools use it with --osm.
  const needsOsm =
    process.argv.includes('--osm') ||
    hikes.some((h) => {
      if (only && !only.includes(h.id)) return false
      const s = HIKE_TRACK_SPECS[h.id]
      return s && !s.skip && s.source === 'osm'
    })
  let netOsm = null
  if (needsOsm) {
    console.log('Loading OSM linework (Overture)…')
    const osmSegs = await ensureOvertureTrails(CACHE, fetchBuf)
    console.log(`${osmSegs.length} raw OSM segments`)
    netOsm = buildNetwork(osmSegs)
    console.log(`${netOsm.segs.length} noded OSM segments`)
  }
  const debugNet = process.argv.includes('--osm') ? netOsm : net

  // Debug: --near lng,lat[,radiusM] lists nearby segments so a spec waypoint
  // can be placed on real linework.
  if (process.argv.includes('--near')) {
    for (const probe of process.argv[process.argv.indexOf('--near') + 1].split(';')) {
      const [lng, lat, r] = probe.split(',').map(Number)
      const radius = r || 400
      console.log(`--- near [${lng}, ${lat}] (${radius} m)`)
      const seen = []
      for (const s of debugNet.segs) {
        let best = Infinity
        for (let vi = 0; vi < s.pts.length - 1; vi++) {
          const { distM } = projectPoint([lng, lat], s.pts[vi], s.pts[vi + 1])
          if (distM < best) best = distM
        }
        if (best < radius) seen.push({ d: best, s })
      }
      seen.sort((a, b) => a.d - b.d)
      for (const { d, s } of seen.slice(0, 14)) {
        const a = s.pts[0]
        const b = s.pts[s.pts.length - 1]
        console.log(
          `  ${Math.round(d)} m  ${s.kind}  "${s.name}"  ${lineLenM(s.pts).toFixed(0)} m  [${a[0].toFixed(5)},${a[1].toFixed(5)}]→[${b[0].toFixed(5)},${b[1].toFixed(5)}]`,
        )
      }
    }
    return
  }

  // Debug: --dumpat lng,lat[,rank] prints the vertices of the segment nearest
  // that coordinate (rank picks the Nth nearest), every ~200 m.
  if (process.argv.includes('--dumpat')) {
    const [lng, lat, rank] = process.argv[process.argv.indexOf('--dumpat') + 1].split(',').map(Number)
    const scored = debugNet.segs
      .map((s) => {
        let best = Infinity
        for (let vi = 0; vi < s.pts.length - 1; vi++) {
          const { distM } = projectPoint([lng, lat], s.pts[vi], s.pts[vi + 1])
          if (distM < best) best = distM
        }
        return { d: best, s }
      })
      .sort((a, b) => a.d - b.d)
    const { d, s } = scored[rank || 0]
    console.log(`--- ${Math.round(d)} m away: "${s.name}" ${s.kind} ${(lineLenM(s.pts) / M_PER_MI).toFixed(2)} mi, ${s.pts.length} vertices`)
    let dd = 0
    let next = 0
    for (let i = 0; i < s.pts.length; i++) {
      if (i > 0) dd += havM(s.pts[i - 1], s.pts[i])
      if (dd >= next || i === s.pts.length - 1) {
        console.log(`   ${(dd / M_PER_MI).toFixed(2)} mi  [${s.pts[i][0].toFixed(5)}, ${s.pts[i][1].toFixed(5)}]`)
        next += 200
      }
    }
    return
  }

  // Debug: --dump <name-substring> walks matching segments printing a vertex
  // every ~400 m with cumulative distance, to place spec waypoints on long
  // segments (rim points, turnarounds).
  if (process.argv.includes('--dump')) {
    const needle = process.argv[process.argv.indexOf('--dump') + 1].toLowerCase()
    for (const s of debugNet.segs) {
      if (!s.name.toLowerCase().includes(needle)) continue
      const lenM = lineLenM(s.pts)
      if (lenM < 300) continue
      console.log(`--- "${s.name}" ${s.kind} ${(lenM / M_PER_MI).toFixed(2)} mi`)
      let d = 0
      let next = 0
      for (let i = 0; i < s.pts.length; i++) {
        if (i > 0) d += havM(s.pts[i - 1], s.pts[i])
        if (d >= next || i === s.pts.length - 1) {
          console.log(`   ${(d / M_PER_MI).toFixed(2)} mi  [${s.pts[i][0].toFixed(5)}, ${s.pts[i][1].toFixed(5)}]`)
          next += 400
        }
      }
    }
    return
  }

  fs.mkdirSync(TRACKS_OUT, { recursive: true })
  const report = []
  const index = {}

  for (const hike of hikes) {
    if (only && !only.includes(hike.id)) continue
    const spec = HIKE_TRACK_SPECS[hike.id]
    const rec = { id: hike.id, title: hike.title, status: '', detail: '' }
    report.push(rec)
    if (!spec) {
      rec.status = 'missing-spec'
      rec.detail = 'No routing spec.'
      continue
    }
    if (spec.skip) {
      rec.status = 'skipped'
      rec.detail = spec.skip
      continue
    }
    const start = spec.start ?? hike.coord
    if (!start) {
      rec.status = 'error'
      rec.detail = 'No start coord.'
      continue
    }
    const endSpec = spec.end === 'start' ? start : spec.end
    const waypoints = [start, ...(spec.via ?? []), ...(endSpec ? [endSpec] : [])]
    const maxSnap = spec.maxSnapM ?? DEFAULT_SNAP_M
    const hikeNet = spec.source === 'osm' ? netOsm : net

    // snap all waypoints
    const snaps = []
    let snapFail = null
    for (const wp of waypoints) {
      const s = nearestOnNetwork(hikeNet, wp, maxSnap, !spec.allowRoadSnap)
      if (!s) {
        snapFail = wp
        break
      }
      snaps.push(s)
    }
    if (snapFail) {
      rec.status = 'error'
      rec.detail = `Waypoint [${snapFail[1].toFixed(4)}, ${snapFail[0].toFixed(4)}] has no trail within ${maxSnap} m.`
      continue
    }
    const snapMax = Math.max(...snaps.map((s) => s.distM))

    // route leg by leg
    let line = null
    let legFail = null
    for (let i = 0; i < snaps.length - 1; i++) {
      const leg = route(hikeNet, snaps[i], snaps[i + 1])
      if (!leg) {
        legFail = i
        break
      }
      if (!line) line = leg
      else {
        for (const p of leg) {
          const last = line[line.length - 1]
          if (!last || havM(last, p) > 0.5) line.push(p)
        }
      }
    }
    if (legFail != null || !line || line.length < 2) {
      const snapDesc = (s) =>
        `"${s.seg.name || 'unnamed'}" ${s.seg.kind} @${Math.round(s.distM)}m`
      rec.status = 'error'
      rec.detail = `No route for leg ${legFail} (network gap): ${snapDesc(snaps[legFail])} → ${snapDesc(snaps[legFail + 1])}.`
      continue
    }

    const storedLenM = lineLenM(line)
    const isOAB = hike.route === 'out-and-back'
    const fullM = isOAB ? storedLenM * 2 : storedLenM
    const fullMi = fullM / M_PER_MI

    // published-distance validation
    const pubMi = hike.distanceMi
    const dErr = Math.abs(fullMi - pubMi)
    const dTolOk = Math.max(0.5, pubMi * 0.18)
    const dTolWarn = Math.max(1.0, pubMi * 0.3)
    let distStatus = dErr <= dTolOk ? 'match' : dErr <= dTolWarn ? 'approx' : 'fail'

    const profile = await buildProfile(line)
    const st = profileStats(profile)
    const gainFull = isOAB ? st.gainFt + st.lossFt : st.gainFt
    const lossFull = isOAB ? st.gainFt + st.lossFt : st.lossFt
    const pubGain = hike.elevationGainFt
    // Published gain figures don't all count the same thing. Default is
    // round-trip cumulative (matches monotonic climbs under any definition);
    // spec.gainDef picks the definition the published number actually uses:
    // 'net' = high point minus trailhead, 'oneWay' = cumulative climbing in
    // the harder direction of an out-and-back (rolling routes).
    let gainCompare = gainFull
    if (spec.gainDef === 'net') gainCompare = st.maxFt - profile[0].ft
    else if (spec.gainDef === 'oneWay' && isOAB) gainCompare = Math.max(st.gainFt, st.lossFt)
    const gErr = Math.abs(gainCompare - pubGain)
    const gTolOk = Math.max(400, pubGain * 0.3)
    const gTolWarn = Math.max(700, pubGain * 0.5)
    let gainStatus = gErr <= gTolOk ? 'match' : gErr <= gTolWarn ? 'approx' : 'fail'

    const gainDesc =
      spec.gainDef === 'net'
        ? `net gain ${Math.round(gainCompare)} ft (pub ${pubGain}, total climb ${Math.round(gainFull)})`
        : spec.gainDef === 'oneWay' && isOAB
          ? `one-way gain ${Math.round(gainCompare)} ft (pub ${pubGain}, total climb ${Math.round(gainFull)})`
          : `gain ${Math.round(gainFull)} ft (pub ${pubGain})`
    rec.detail = `${fullMi.toFixed(2)} mi (pub ${pubMi}), ${gainDesc}, snap≤${Math.round(snapMax)} m${spec.source === 'osm' ? ', OSM linework' : ''}`
    if (distStatus === 'fail' || gainStatus === 'fail') {
      rec.status = 'failed-validation'
      continue
    }
    rec.status = distStatus === 'match' && gainStatus === 'match' ? 'verified' : 'approx'

    const outLine = douglasPeucker(line, SIMPLIFY_M).map((p) => [
      Math.round(p[0] * 1e5) / 1e5,
      Math.round(p[1] * 1e5) / 1e5,
    ])
    // downsample profile to ≤ 240 points for the payload
    const PROF_N = 240
    const profStep = Math.max(1, Math.floor(profile.length / PROF_N))
    const outProfile = profile
      .filter((_, i) => i % profStep === 0 || i === profile.length - 1)
      .map(({ m, ft }) => [Math.round((m / M_PER_MI) * 1000) / 1000, Math.round(ft)])

    const track = {
      v: 1,
      id: hike.id,
      route: hike.route,
      source: {
        geometry:
          spec.source === 'osm'
            ? 'OpenStreetMap trail data via Overture Maps (© OpenStreetMap contributors, ODbL)'
            : 'USGS National Map transportation data (NPS source); public domain',
        elevation: 'USGS 3DEP via AWS Open Data terrain tiles',
      },
      verified: { distance: distStatus, gain: gainStatus },
      lineMi: Math.round((storedLenM / M_PER_MI) * 100) / 100,
      fullMi: Math.round(fullMi * 100) / 100,
      line: outLine,
      profile: outProfile,
      stats: {
        gainFt: Math.round(gainFull),
        lossFt: Math.round(lossFull),
        minFt: Math.round(st.minFt),
        maxFt: Math.round(st.maxFt),
        trailheadFt: Math.round(profile[0].ft),
        maxGradePct: Math.round(st.maxGradePct),
        highPointMi: Math.round((st.maxAtM / M_PER_MI) * 100) / 100,
      },
    }
    if (spec.note) track.note = spec.note
    fs.writeFileSync(path.join(TRACKS_OUT, `${hike.id}.json`), JSON.stringify(track))

    // sparkline: 24 full-route elevation samples
    const full = isOAB
      ? [...profile, ...profile.slice(0, -1).reverse().map(({ m, ft }) => ({ m: 2 * storedLenM - m, ft }))]
      : profile
    const spark = []
    for (let i = 0; i < 24; i++) {
      const idx = Math.round((i / 23) * (full.length - 1))
      spark.push(Math.round(full[idx].ft))
    }
    index[hike.id] = {
      mi: track.fullMi,
      gainFt: track.stats.gainFt,
      minFt: track.stats.minFt,
      maxFt: track.stats.maxFt,
      maxGradePct: track.stats.maxGradePct,
      trailheadFt: track.stats.trailheadFt,
      highPointMi: track.stats.highPointMi,
      verified: distStatus === 'match' && gainStatus === 'match',
      spark,
    }
  }

  // --- emit index -------------------------------------------------------------
  if (!only) {
    // Content hash over every emitted track: the app appends it as ?v= on
    // track fetches, so the service worker's cache-first runtime cache turns
    // over when tracks are regenerated and stays put otherwise.
    const hash = crypto.createHash('sha256')
    for (const id of Object.keys(index).sort()) {
      hash.update(fs.readFileSync(path.join(TRACKS_OUT, `${id}.json`)))
    }
    const version = hash.digest('hex').slice(0, 10)
    const lines = [
      '// =============================================================================',
      '// AUTO-GENERATED by scripts/gen-hike-tracks.mjs — do not hand-edit.',
      '// Summary stats for the per-hike track files in public/tracks/. Geometry is',
      '// USGS National Map trail data (NPS source), or OpenStreetMap linework via',
      '// Overture Maps where the USGS layers miss the signed route (each track',
      '// file carries its own source string); elevations are USGS 3DEP.',
      '// A hike absent from this map has no verified track (see',
      '// scripts/data/trail-tracks-report.md for why).',
      '// =============================================================================',
      '',
      'export type TrackSummary = {',
      '  mi: number // full walked distance (out-and-backs already doubled)',
      '  gainFt: number',
      '  minFt: number',
      '  maxFt: number',
      '  maxGradePct: number // steepest sustained 200 m stretch',
      '  trailheadFt: number',
      '  highPointMi: number // position of the high point along the stored line',
      '  verified: boolean // both distance and gain matched published stats',
      '  spark: number[] // 24 elevation samples across the full route, in feet',
      '}',
      '',
      '// Content hash of the track files; busts the runtime cache on regeneration.',
      `export const TRACKS_VERSION = '${version}'`,
      '',
      `export const TRACKS: Record<string, TrackSummary> = ${JSON.stringify(index, null, 2)}`,
      '',
    ]
    fs.writeFileSync(INDEX_OUT, lines.join('\n'))
  }

  // --- report -----------------------------------------------------------------
  const counts = {}
  for (const r of report) counts[r.status] = (counts[r.status] ?? 0) + 1
  const md = [
    '# Trail track generation report',
    '',
    'Generated by `scripts/gen-hike-tracks.mjs`. Geometry: USGS National Map',
    'transportation layers (NPS source data); hikes marked "OSM linework" route',
    'over OpenStreetMap data via Overture Maps instead (© OpenStreetMap',
    'contributors, ODbL), used where the USGS layers are missing the signed',
    'route or map a retired alignment. Elevation: USGS 3DEP via AWS Open',
    'Data terrain tiles. Every emitted track was routed over mapped linework',
    '(never hand-drawn) and validated against the published distance and',
    'elevation gain in `apps/guide/src/content/hikes.ts`; `verified` means both',
    'matched within tolerance, `approx` means one landed in the warn band (the',
    'track still ships, labeled). Failed or skipped hikes ship without a track.',
    '',
    `Summary: ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ')}.`,
    '',
    '| Hike | Status | Detail |',
    '|---|---|---|',
    ...report.map((r) => `| ${r.title} | ${r.status} | ${r.detail.replace(/\|/g, '\\|')} |`),
    '',
  ]
  fs.writeFileSync(REPORT_OUT, md.join('\n'))
  console.log(`\n${report.length} hikes: ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ')}`)
  for (const r of report) {
    const flag = r.status === 'verified' ? ' ' : r.status === 'approx' ? '~' : '✗'
    console.log(` ${flag} ${r.id}: ${r.status} — ${r.detail}`)
  }
}

await main()
