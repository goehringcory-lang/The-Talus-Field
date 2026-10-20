// =============================================================================
// gen-backpacking-routes.ts: the backpacking trips' routes, measured.
//
//   npm run map:backpacking            (needs network on the first run)
//   npm run map:backpacking -- --near lng,lat[,radiusM]   debug: trails nearby
//
// For each trip in src/content/backpacking.ts, scripts/data/
// backpacking-route-specs.mjs supplies the on-trail waypoints that steer the
// shared router (scripts/lib/trail-network.mjs, the same one behind the day
// hikes' tracks) across USGS National Map trail linework (NPS source data),
// or OpenStreetMap linework via Overture where a spec says `source: 'osm'`.
// Elevations are USGS 3DEP. Nothing here is drawn by hand.
//
// Then it measures the trip's own content against that line, which is the
// fact check a coordinate cannot pass by being plausible:
//   - the total distance and climbing against the published figures;
//   - every camp and water source's distance from the route, and where along
//     it the hiker reaches it (the mile marks the app prints);
//   - each night's camp in order, which cuts the route into days.
// A trip that fails any of these is reported and NOT emitted: the app shows
// the trip's text without a line rather than a line it cannot vouch for.
//
// Writes (all committed):
//   public/map/backpacking-<hash>.json   every route in one content-hashed file
//                                        (served cache-first with the map data,
//                                        carried by the map overview pack)
//   src/map/backpacking.generated.ts     its URL plus per-trip summary numbers
//   ../../scripts/data/backpacking-routes-report.md   the verification report
// =============================================================================

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { BACKPACK_TRIPS } from '../src/content/backpacking'
import type { BackpackTripT } from '../src/content/schema'
import { encodePolyline } from '../src/map/roadGraph'
// @ts-expect-error untyped shared .mjs modules (scripts/ is plain JS)
import * as tn from '../../../scripts/lib/trail-network.mjs'
// @ts-expect-error untyped shared .mjs module
import { ensureOvertureTrails } from '../../../scripts/lib/overture-trails.mjs'
// @ts-expect-error untyped spec table
import { BACKPACKING_ROUTE_SPECS } from '../../../scripts/data/backpacking-route-specs.mjs'

type Pt = [number, number]
type Snap = { seg: { name: string; kind: string }; distM: number }
type ProfilePt = { m: number; ft: number }
type Spec = {
  via?: Pt[]
  turnaround?: Pt // out-and-back: the far end; the return is the same line
  source?: 'osm'
  maxSnapM?: number
  gainDef?: 'oneWay' // published gain counts one direction of an out-and-back
  sideTrips?: Record<string, { from: Pt; to: Pt; source?: 'osm'; maxSnapM?: number }>
  note?: string
}

const APP_DIR = path.resolve(import.meta.dirname, '..')
const REPO = path.resolve(APP_DIR, '../..')
const PUBLIC_DIR = path.join(APP_DIR, 'public/map')
const MODULE_OUT = path.join(APP_DIR, 'src/map/backpacking.generated.ts')
const REPORT_OUT = path.join(REPO, 'scripts/data/backpacking-routes-report.md')

// 7.5-minute quads under every route (USGS cell names).
const QUADS = [
  'Yosemite Falls', 'Half Dome', 'Merced Peak', 'Tenaya Lake', 'Vogelsang Peak',
  'Koip Peak', 'Mount Lyell', 'Tioga Pass', 'Falls Ridge', 'Ten Lakes',
  'Tamarack Flat', 'Hetch Hetchy Reservoir', 'El Capitan',
]

const M_PER_MI: number = tn.M_PER_MI
const MI = (m: number) => m / M_PER_MI
const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d

// Tolerances. Distance: guidebooks round and disagree by a few tenths, and a
// mapped line runs a little long on switchbacks. Gain: published figures
// differ by definition and DEM smoothing, so the band is wider.
const DIST_OK = (pub: number) => Math.max(0.6, pub * 0.1)
const DIST_WARN = (pub: number) => Math.max(1.2, pub * 0.2)
const GAIN_OK = (pub: number) => Math.max(500, pub * 0.25)
const GAIN_WARN = (pub: number) => Math.max(900, pub * 0.4)
// How far a mapped point may sit from the route. A camp zone is an area
// beside a lake, often a few hundred feet off the trail; water is where the
// trail meets it. Past the fail line the coordinate (or the route) is wrong.
const OFF_WARN_M = { camp: 250, water: 150 }
const OFF_FAIL_M = { camp: 700, water: 450 }

// --- geometry on the walked line ---------------------------------------------

/** Cumulative metres at each vertex. */
function cumulative(line: Pt[]): number[] {
  const out = [0]
  for (let i = 1; i < line.length; i++) out.push(out[i - 1] + tn.havM(line[i - 1], line[i]))
  return out
}

/** Nearest position on the line to p at or after fromM: {m, distM}. */
function locate(line: Pt[], cum: number[], p: Pt, fromM = 0): { m: number; distM: number } {
  let best = { m: Infinity, distM: Infinity }
  for (let i = 0; i < line.length - 1; i++) {
    if (cum[i + 1] < fromM) continue
    const { t, distM } = tn.projectPoint(p, line[i], line[i + 1])
    const m = cum[i] + (cum[i + 1] - cum[i]) * t
    if (m < fromM) continue
    // Prefer the first pass when two are equally near (an out-and-back
    // reaches the same lake twice; the outbound reach is the one that counts).
    if (distM < best.distM - 1) best = { m, distM }
  }
  return best
}

/** Gain and loss over a slice of the profile, with the router's hysteresis. */
function sliceStats(profile: ProfilePt[], fromM: number, toM: number) {
  const pts = profile.filter((p) => p.m >= fromM - 1 && p.m <= toM + 1)
  if (pts.length < 2) return { gainFt: 0, lossFt: 0 }
  const s = tn.profileStats(pts)
  return { gainFt: Math.round(s.gainFt), lossFt: Math.round(s.lossFt) }
}

// --- routing ---------------------------------------------------------------------

type Net = unknown
function routeThrough(net: Net, points: Pt[], maxSnapM: number): { line: Pt[]; snapMax: number } | string {
  const snaps: Snap[] = []
  for (const p of points) {
    const s = tn.nearestOnNetwork(net, p, maxSnapM) as Snap | null
    if (!s) return `waypoint [${p[0]}, ${p[1]}] has no trail within ${maxSnapM} m`
    snaps.push(s)
  }
  let line: Pt[] | null = null
  for (let i = 0; i < snaps.length - 1; i++) {
    const leg = tn.route(net, snaps[i], snaps[i + 1]) as Pt[] | null
    if (!leg) {
      const d = (s: Snap) => `"${s.seg.name || 'unnamed'}" ${s.seg.kind} @${Math.round(s.distM)}m`
      return `no route for leg ${i} (network gap): ${d(snaps[i])} -> ${d(snaps[i + 1])}`
    }
    if (!line) line = leg
    else for (const p of leg) if (tn.havM(line[line.length - 1], p) > 0.5) line.push(p)
  }
  if (!line || line.length < 2) return 'empty route'
  return { line, snapMax: Math.max(...snaps.map((s) => s.distM)) }
}

function simplify(line: Pt[]): Pt[] {
  return (tn.douglasPeucker(line, tn.SIMPLIFY_M) as Pt[]).map((p) => [round(p[0], 5), round(p[1], 5)] as Pt)
}

function downsample(profile: ProfilePt[], n: number): [number, number][] {
  const step = Math.max(1, Math.floor(profile.length / n))
  return profile
    .filter((_, i) => i % step === 0 || i === profile.length - 1)
    .map(({ m, ft }) => [round(MI(m), 3), Math.round(ft)])
}

// --- one trip --------------------------------------------------------------------

type Report = { id: string; title: string; status: string; lines: string[] }

async function buildTrip(trip: BackpackTripT, spec: Spec, nets: { usgs: Net; osm: Net | null }, rep: Report) {
  const net = spec.source === 'osm' ? nets.osm : nets.usgs
  if (!net) throw new Error('OSM network requested but not loaded')
  const maxSnap = spec.maxSnapM ?? tn.DEFAULT_SNAP_M
  const start = trip.trailhead.coord
  const via = spec.via ?? []
  let points: Pt[]
  if (trip.route === 'one-way') points = [start, ...via, trip.exit!.coord]
  else if (trip.route === 'out-and-back') {
    if (!spec.turnaround) return fail(rep, 'out-and-back spec needs a turnaround')
    points = [start, ...via, spec.turnaround]
  } else points = [start, ...via, start]

  const routed = routeThrough(net, points, maxSnap)
  if (typeof routed === 'string') return fail(rep, routed)
  let line = routed.line
  if (trip.route === 'out-and-back') line = [...line, ...line.slice(0, -1).reverse()]
  const cum = cumulative(line)
  const totalM = cum[cum.length - 1]

  const profile: ProfilePt[] = await tn.buildProfile(line)
  const st = tn.profileStats(profile)

  // Totals against the published figures.
  const mi = MI(totalM)
  const dErr = Math.abs(mi - trip.distanceMi)
  const distance = dErr <= DIST_OK(trip.distanceMi) ? 'match' : dErr <= DIST_WARN(trip.distanceMi) ? 'approx' : 'fail'
  const gainCompare =
    spec.gainDef === 'oneWay' && trip.route === 'out-and-back'
      ? Math.max(sliceStats(profile, 0, totalM / 2).gainFt, sliceStats(profile, totalM / 2, totalM).gainFt)
      : st.gainFt
  const gErr = Math.abs(gainCompare - trip.elevationGainFt)
  const gain = gErr <= GAIN_OK(trip.elevationGainFt) ? 'match' : gErr <= GAIN_WARN(trip.elevationGainFt) ? 'approx' : 'fail'
  rep.lines.push(
    `route ${mi.toFixed(2)} mi (published ${trip.distanceMi}) ${distance}; climbing ${Math.round(gainCompare)} ft` +
      `${spec.gainDef === 'oneWay' ? ' one-way' : ''} (published ${trip.elevationGainFt}) ${gain}; ` +
      `high point ${Math.round(st.maxFt)} ft (published ${trip.highPointFt}); snap <= ${Math.round(routed.snapMax)} m` +
      (spec.source === 'osm' ? '; OSM linework' : ''),
  )
  if (Math.abs(st.maxFt - trip.highPointFt) > 400) rep.lines.push(`WARN high point differs from the published ${trip.highPointFt} ft by more than 400 ft`)
  if (distance === 'fail' || gain === 'fail') return fail(rep, 'totals outside tolerance')

  // Camps and water: distance from the route, and the mile they are reached.
  const markers: Record<string, { mi: number; offM: number }> = {}
  let bad = false
  const place = (id: string, name: string, coord: Pt, kind: 'camp' | 'water') => {
    const at = locate(line, cum, coord)
    const off = Math.round(at.distM)
    const level = off > OFF_FAIL_M[kind] ? 'FAIL' : off > OFF_WARN_M[kind] ? 'WARN' : 'ok'
    if (level !== 'ok') rep.lines.push(`${level} ${kind} ${id} (${name}) sits ${off} m off the route`)
    if (level === 'FAIL') bad = true
    markers[id] = { mi: round(MI(at.m)), offM: off }
  }
  for (const c of trip.camps) place(c.id, c.name, c.coord, 'camp')
  for (const w of trip.water) place(w.id, w.name, w.coord, 'water')
  if (bad) return fail(rep, 'a camp or water source is off the route')

  // Days: each night's camp, in order, searched forward along the line, so an
  // out-and-back's second visit to a lake lands on the return leg.
  const days: { startMi: number; endMi: number; mi: number; gainFt: number; lossFt: number }[] = []
  let at = 0
  for (const [i, d] of trip.days.entries()) {
    let endM = totalM
    if (d.campId) {
      const camp = trip.camps.find((c) => c.id === d.campId)!
      const prev = i > 0 ? trip.days[i - 1].campId : null
      endM = d.campId === prev ? at : locate(line, cum, camp.coord, at + 200).m
      if (!Number.isFinite(endM)) return fail(rep, `day ${i + 1}: camp ${d.campId} is not ahead on the route`)
    }
    const s = sliceStats(profile, at, endM)
    days.push({ startMi: round(MI(at)), endMi: round(MI(endM)), mi: round(MI(endM - at), 1), ...s })
    at = endM
  }
  rep.lines.push(
    'days: ' +
      days.map((d, i) => `${i + 1}) ${d.mi} mi +${d.gainFt}/-${d.lossFt} ft${trip.days[i].sideTripId ? ' + side trip' : ''}`).join('; '),
  )

  // Side trips (Half Dome from Little Yosemite Valley): routed on their own,
  // walked there and back.
  const sideTrips: Record<string, { line: string; mi: number; gainFt: number; maxFt: number }> = {}
  for (const st2 of trip.sideTrips ?? []) {
    const s = spec.sideTrips?.[st2.id]
    if (!s) return fail(rep, `side trip ${st2.id} has no spec`)
    const sNet = s.source === 'osm' ? nets.osm : nets.usgs
    const r = routeThrough(sNet, [s.from, s.to], s.maxSnapM ?? maxSnap)
    if (typeof r === 'string') return fail(rep, `side trip ${st2.id}: ${r}`)
    const prof: ProfilePt[] = await tn.buildProfile(r.line)
    const ps = tn.profileStats(prof)
    const oneWayMi = MI(cumulative(r.line).at(-1)!)
    sideTrips[st2.id] = {
      line: encodePolyline(simplify(r.line)),
      mi: round(oneWayMi * 2, 1),
      gainFt: Math.round(ps.gainFt + ps.lossFt),
      maxFt: Math.round(ps.maxFt),
    }
    rep.lines.push(`side trip ${st2.id}: ${(oneWayMi * 2).toFixed(1)} mi round trip, +${Math.round(ps.gainFt + ps.lossFt)} ft`)
  }

  rep.status = distance === 'match' && gain === 'match' && !rep.lines.some((l) => l.startsWith('WARN')) ? 'verified' : 'approx'
  return {
    route: trip.route,
    source:
      spec.source === 'osm'
        ? 'OpenStreetMap trail data via Overture Maps (© OpenStreetMap contributors, ODbL)'
        : 'USGS National Map transportation data (NPS source); public domain',
    verified: { distance, gain },
    line: encodePolyline(simplify(line)),
    profile: downsample(profile, 320),
    stats: {
      mi: round(mi, 1),
      gainFt: Math.round(st.gainFt),
      lossFt: Math.round(st.lossFt),
      minFt: Math.round(st.minFt),
      maxFt: Math.round(st.maxFt),
      highPointMi: round(MI(st.maxAtM)),
      maxGradePct: Math.round(st.maxGradePct),
    },
    days,
    markers,
    sideTrips,
    ...(spec.note ? { note: spec.note } : {}),
  }
}

function fail(rep: Report, why: string): null {
  rep.status = 'failed'
  rep.lines.push(`FAILED: ${why}`)
  return null
}

// --- main ------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2)
  console.log('Loading USGS quads…')
  const segs: { pts: Pt[]; name: string; kind: string }[] = []
  for (const q of QUADS) {
    const zip = await tn.ensureQuad(q)
    for (const layer of ['Trans_TrailSegment', 'Trans_RoadSegment']) {
      const kind = layer === 'Trans_TrailSegment' ? 'trail' : 'road'
      for (const f of await tn.readLayer(zip, layer)) {
        const g = f.geometry
        if (!g) continue
        const lines = g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : []
        for (const l of lines) if (l.length >= 2) segs.push({ pts: l.map((c: number[]) => [c[0], c[1]]), name: f.properties?.name ?? '', kind })
      }
    }
  }
  const usgs = tn.buildNetwork(segs)
  const specs = BACKPACKING_ROUTE_SPECS as Record<string, Spec>
  const needsOsm =
    args.includes('--osm') ||
    Object.values(specs).some((s) => s.source === 'osm' || Object.values(s.sideTrips ?? {}).some((x) => x.source === 'osm'))
  const osm = needsOsm ? tn.buildNetwork(await ensureOvertureTrails(tn.CACHE, tn.fetchBuf)) : null

  // Debug: list the trail segments near a point, to place a waypoint on them.
  const nearAt = args.indexOf('--near')
  if (nearAt >= 0) {
    const n = (args.includes('--osm') ? osm : usgs) as { segs: { pts: Pt[]; name: string; kind: string }[] }
    for (const probe of args[nearAt + 1].split(';')) {
      const [lng, lat, r] = probe.split(',').map(Number)
      const radius = r || 400
      const seen: { d: number; s: { pts: Pt[]; name: string; kind: string } }[] = []
      for (const s of n.segs) {
        let best = Infinity
        for (let i = 0; i < s.pts.length - 1; i++) best = Math.min(best, tn.projectPoint([lng, lat], s.pts[i], s.pts[i + 1]).distM)
        if (best < radius) seen.push({ d: best, s })
      }
      seen.sort((a, b) => a.d - b.d)
      console.log(`--- near [${lng}, ${lat}]`)
      for (const { d, s } of seen.slice(0, 12)) {
        const a = s.pts[0]
        const b = s.pts[s.pts.length - 1]
        console.log(`  ${Math.round(d)} m ${s.kind} "${s.name}" ${Math.round(tn.lineLenM(s.pts))} m [${a[0].toFixed(5)},${a[1].toFixed(5)}]->[${b[0].toFixed(5)},${b[1].toFixed(5)}]`)
      }
    }
    return
  }

  const out: Record<string, unknown> = {}
  const reports: Report[] = []
  for (const trip of BACKPACK_TRIPS) {
    const rep: Report = { id: trip.id, title: trip.title, status: '', lines: [] }
    reports.push(rep)
    const spec = specs[trip.id]
    if (!spec) {
      fail(rep, 'no routing spec')
      continue
    }
    const built = await buildTrip(trip, spec, { usgs, osm }, rep)
    if (built) out[trip.id] = built
  }
  for (const id of Object.keys(specs)) {
    if (!BACKPACK_TRIPS.some((t) => t.id === id)) throw new Error(`spec ${id} has no trip in backpacking.ts`)
  }

  // One content-hashed file, the map-data convention (gen-map-data.ts).
  const body =
    JSON.stringify({
      v: 1,
      licence:
        'Route geometry: USGS National Map (NPS source data), and OpenStreetMap contributors (ODbL) where a route says so. Elevations: USGS 3DEP.',
      trips: out,
    }) + '\n'
  const hash = crypto.createHash('sha256').update(body).digest('hex').slice(0, 10)
  for (const f of fs.readdirSync(PUBLIC_DIR)) if (/^backpacking-[0-9a-f]+\.json$/.test(f)) fs.rmSync(path.join(PUBLIC_DIR, f))
  const file = `backpacking-${hash}.json`
  fs.writeFileSync(path.join(PUBLIC_DIR, file), body)

  // The list pages and the map pane read these numbers without the file.
  const summary: Record<string, unknown> = {}
  for (const [id, t] of Object.entries(out) as [string, { stats: { mi: number; gainFt: number; maxFt: number }; verified: { distance: string; gain: string }; days: { mi: number }[]; profile: [number, number][] }][]) {
    const spark: number[] = []
    for (let i = 0; i < 24; i++) spark.push(t.profile[Math.round((i / 23) * (t.profile.length - 1))][1])
    summary[id] = {
      mi: t.stats.mi,
      gainFt: t.stats.gainFt,
      maxFt: t.stats.maxFt,
      dayMi: t.days.map((d) => d.mi),
      verified: t.verified.distance === 'match' && t.verified.gain === 'match',
      spark,
    }
  }
  fs.writeFileSync(
    MODULE_OUT,
    [
      '// GENERATED by scripts/gen-backpacking-routes.ts. Do not edit; rerun `npm run map:backpacking`.',
      '// The backpacking routes file under public/ (content-hashed: immutable, cached',
      '// with the map data) and the numbers the list pages print without fetching it.',
      '// A trip absent from ROUTE_SUMMARY has no verified route (see',
      '// scripts/data/backpacking-routes-report.md).',
      '',
      `export const BACKPACKING_URL = '/map/${file}'`,
      `export const BACKPACKING_BYTES = ${Buffer.byteLength(body)} // the overview pack's size estimate`,
      '',
      'export type RouteSummary = {',
      '  mi: number // the walked route, as routed',
      '  gainFt: number',
      '  maxFt: number',
      '  dayMi: number[] // each day, in order',
      '  verified: boolean // distance and climbing both matched the published figures',
      '  spark: number[] // 24 elevation samples across the route, in feet',
      '}',
      '',
      `export const ROUTE_SUMMARY: Record<string, RouteSummary> = ${JSON.stringify(summary, null, 2)}`,
      '',
    ].join('\n'),
  )

  const md = [
    '# Backpacking route report',
    '',
    'Generated by `apps/guide/scripts/gen-backpacking-routes.ts`. Each route is',
    'routed over USGS National Map trail linework (NPS source data), or',
    'OpenStreetMap linework via Overture where noted, between the waypoints in',
    '`scripts/data/backpacking-route-specs.mjs`; elevations are USGS 3DEP.',
    'The totals are checked against the published figures in',
    '`apps/guide/src/content/backpacking.ts`, and every camp and water source is',
    'measured against the routed line (warn past 250 m for a camp and 150 m for',
    'water; fail past 700 m and 450 m). A failed trip ships without a route.',
    '',
    ...reports.flatMap((r) => [`## ${r.title} (\`${r.id}\`): ${r.status}`, '', ...r.lines.map((l) => `- ${l}`), '']),
  ]
  fs.writeFileSync(REPORT_OUT, md.join('\n'))
  for (const r of reports) {
    console.log(`${r.status === 'verified' ? ' ' : r.status === 'approx' ? '~' : 'x'} ${r.id}: ${r.status}`)
    for (const l of r.lines) console.log(`    ${l}`)
  }
  console.log(`wrote public/map/${file} (${body.length} bytes)`)
}

await main()
