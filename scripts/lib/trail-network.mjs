// =============================================================================
// trail-network.mjs — the shared trail router behind the generated tracks.
//
// Moved out of gen-hike-tracks.mjs (October 2026) when the backpacking routes
// (gen-backpacking-routes.mjs) needed the same pipeline: USGS National Map
// trail linework (NPS source) or OpenStreetMap linework via Overture, noded
// into a graph and routed by Dijkstra between snapped waypoints, then sampled
// against USGS 3DEP terrain tiles. Unchanged in behaviour; both generators
// import it so a fix to the router reaches every track.
//
// Everything downloaded is cached in scripts/data/.trailcache/ (gitignored).
// =============================================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AdmZip from 'adm-zip'
import * as shapefile from 'shapefile'
import { PNG } from 'pngjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const CACHE = path.join(__dirname, '..', 'data', '.trailcache')

export const TERRARIUM_Z = 14
export const NODE_TOL_M = 12       // endpoint cluster tolerance
export const SPLIT_TOL_M = 12      // T-junction noding tolerance
export const ROAD_PENALTY = 2.5    // cost multiplier steering routes onto trails
export const DEFAULT_SNAP_M = 120
export const SIMPLIFY_M = 4        // Douglas-Peucker tolerance for emitted lines
export const SAMPLE_M = 25         // elevation sample spacing
export const SMOOTH_WIN = 5        // moving-average window (samples) ≈ 125 m
export const HYSTERESIS_FT = 10    // climb must exceed this to count toward gain
export const GRADE_WIN_M = 400     // sustained-grade window; wide enough to dilute DEM cliff-bleed spikes

export const M_PER_MI = 1609.344
export const FT_PER_M = 3.28084

// --- fetch (works behind the CCR agent proxy when HTTPS_PROXY is set) -------
let fetchFn = globalThis.fetch
if (process.env.HTTPS_PROXY || process.env.https_proxy) {
  try {
    const undici = await import('undici')
    undici.setGlobalDispatcher(new undici.EnvHttpProxyAgent())
    fetchFn = undici.fetch
  } catch {
    /* no undici: plain fetch, fine outside the proxy */
  }
}

export async function fetchBuf(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetchFn(url)
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return Buffer.from(await res.arrayBuffer())
    } catch (err) {
      if (i === tries - 1) throw err
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)))
    }
  }
  return null
}

// --- geometry helpers --------------------------------------------------------
export function havM(a, b) {
  const dLat = ((b[1] - a[1]) * Math.PI) / 180
  const dLng = ((b[0] - a[0]) * Math.PI) / 180
  const la1 = (a[1] * Math.PI) / 180
  const la2 = (b[1] * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * 6371000 * Math.asin(Math.sqrt(h))
}

export function lineLenM(pts) {
  let d = 0
  for (let i = 1; i < pts.length; i++) d += havM(pts[i - 1], pts[i])
  return d
}

// Local planar projection of p onto segment a-b: returns {t, distM}.
export function projectPoint(p, a, b) {
  const kx = 111320 * Math.cos((a[1] * Math.PI) / 180)
  const ky = 110540
  const px = (p[0] - a[0]) * kx
  const py = (p[1] - a[1]) * ky
  const bx = (b[0] - a[0]) * kx
  const by = (b[1] - a[1]) * ky
  const L2 = bx * bx + by * by
  if (L2 === 0) return { t: 0, distM: Math.hypot(px, py) }
  const t = Math.max(0, Math.min(1, (px * bx + py * by) / L2))
  return { t, distM: Math.hypot(px - t * bx, py - t * by) }
}

export function douglasPeucker(pts, tolM) {
  if (pts.length <= 2) return pts
  const keep = new Uint8Array(pts.length)
  keep[0] = keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [s, e] = stack.pop()
    let maxD = 0
    let maxI = -1
    for (let i = s + 1; i < e; i++) {
      const { distM } = projectPoint(pts[i], pts[s], pts[e])
      if (distM > maxD) {
        maxD = distM
        maxI = i
      }
    }
    if (maxD > tolM && maxI > 0) {
      keep[maxI] = 1
      stack.push([s, maxI], [maxI, e])
    }
  }
  return pts.filter((_, i) => keep[i])
}

// --- quad download + parse ---------------------------------------------------
export function quadFileBase(name) {
  return `VECTOR_${name.replace(/ /g, '_')}_CA_7_5_Min_Shape`
}

export async function ensureQuad(name) {
  const base = quadFileBase(name)
  const zipPath = path.join(CACHE, `${base}.zip`)
  if (!fs.existsSync(zipPath)) {
    const url = `https://prd-tnm.s3.amazonaws.com/StagedProducts/TopoMapVector/CA/Shape/${base}.zip`
    process.stdout.write(`  fetching quad ${name}… `)
    const buf = await fetchBuf(url)
    if (!buf) throw new Error(`quad not found: ${name} (${url})`)
    fs.mkdirSync(CACHE, { recursive: true })
    fs.writeFileSync(zipPath, buf)
    console.log(`${(buf.length / 1e6).toFixed(1)} MB`)
  }
  return zipPath
}

export async function readLayer(zipPath, layer) {
  const zip = new AdmZip(zipPath)
  const shpEntry = zip.getEntry(`Shape/${layer}.shp`)
  const dbfEntry = zip.getEntry(`Shape/${layer}.dbf`)
  if (!shpEntry || !dbfEntry) return []
  // Slice out exact ArrayBuffers: Node Buffers share a pool, so .buffer alone
  // would hand shapefile a larger buffer at the wrong offset.
  const toAB = (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  const source = await shapefile.open(toAB(shpEntry.getData()), toAB(dbfEntry.getData()))
  const feats = []
  for (;;) {
    const { done, value } = await source.read()
    if (done) break
    if (value) feats.push(value)
  }
  return feats
}

// --- build the trail network -------------------------------------------------
/**
 * segs: [{pts: [[lng,lat],...], name, kind: 'trail'|'road'}]
 * Returns {segs, adj, nodeOf} where adj maps nodeId -> [{to, costM, lenM, seg, fwd}].
 */
export function buildNetwork(segs) {
  // 1) Noding: split segments where another segment's endpoint touches their
  // interior (T-junctions). Spatial hash of endpoints, then per-edge checks.
  const CELL = 0.0005
  const cellOf = (p) => `${Math.floor(p[0] / CELL)}|${Math.floor(p[1] / CELL)}`
  const epGrid = new Map()
  for (const s of segs) {
    for (const p of [s.pts[0], s.pts[s.pts.length - 1]]) {
      const k = cellOf(p)
      if (!epGrid.has(k)) epGrid.set(k, [])
      epGrid.get(k).push(p)
    }
  }
  const noded = []
  for (const s of segs) {
    const pts = s.pts
    const cuts = new Map() // edgeIndex -> [t,...]
    for (let vi = 0; vi < pts.length - 1; vi++) {
      const a = pts[vi]
      const b = pts[vi + 1]
      const cx = Math.floor(a[0] / CELL)
      const cy = Math.floor(a[1] / CELL)
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const cand = epGrid.get(`${cx + dx}|${cy + dy}`)
          if (!cand) continue
          for (const p of cand) {
            if ((p[0] === a[0] && p[1] === a[1]) || (p[0] === b[0] && p[1] === b[1])) continue
            const { t, distM } = projectPoint(p, a, b)
            if (distM < SPLIT_TOL_M && t > 0.02 && t < 0.98) {
              if (!cuts.has(vi)) cuts.set(vi, [])
              cuts.get(vi).push(t)
            }
          }
        }
      }
    }
    if (cuts.size === 0) {
      noded.push(s)
      continue
    }
    let cur = [pts[0]]
    for (let vi = 0; vi < pts.length - 1; vi++) {
      const a = pts[vi]
      const b = pts[vi + 1]
      for (const t of (cuts.get(vi) ?? []).sort((x, y) => x - y)) {
        const cp = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
        cur.push(cp)
        if (lineLenM(cur) > 1) noded.push({ ...s, pts: cur })
        cur = [cp]
      }
      cur.push(b)
    }
    if (lineLenM(cur) > 1) noded.push({ ...s, pts: cur })
  }

  // 2) Cluster endpoints within NODE_TOL_M into graph nodes (union-find).
  const eps = []
  for (const s of noded) {
    eps.push(s.pts[0], s.pts[s.pts.length - 1])
  }
  const grid = new Map()
  eps.forEach((p, i) => {
    const k = cellOf(p)
    if (!grid.has(k)) grid.set(k, [])
    grid.get(k).push(i)
  })
  const parent = eps.map((_, i) => i)
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]
      x = parent[x]
    }
    return x
  }
  eps.forEach((p, i) => {
    const cx = Math.floor(p[0] / CELL)
    const cy = Math.floor(p[1] / CELL)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (const j of grid.get(`${cx + dx}|${cy + dy}`) ?? []) {
          if (j > i && havM(p, eps[j]) < NODE_TOL_M) parent[find(i)] = find(j)
        }
      }
    }
  })

  const adj = new Map()
  const addEdge = (from, to, edge) => {
    if (!adj.has(from)) adj.set(from, [])
    adj.get(from).push({ to, ...edge })
  }
  noded.forEach((s, i) => {
    const a = find(2 * i)
    const b = find(2 * i + 1)
    const lenM = lineLenM(s.pts)
    const costM = s.kind === 'road' ? lenM * ROAD_PENALTY : lenM
    addEdge(a, b, { costM, lenM, seg: s, fwd: true })
    addEdge(b, a, { costM, lenM, seg: s, fwd: false })
  })

  // 3) Bridge genuine data gaps: a dangling (degree-1) endpoint within
  // GAP_BRIDGE_M of another node gets a straight connector, but ONLY when the
  // existing graph path between the two is longer than GAP_MIN_PATH_M — that
  // guard keeps switchback hairpins (whose legs pass within a few meters of
  // each other but connect a short way around) from being short-circuited.
  const GAP_BRIDGE_M = 40
  const GAP_MIN_PATH_M = 800
  const nodePos = new Map()
  eps.forEach((p, i) => {
    const r = find(i)
    if (!nodePos.has(r)) nodePos.set(r, p)
  })
  const degree = new Map()
  for (const [nid, edges] of adj) degree.set(nid, edges.length)
  const boundedDist = (src, dst, bound) => {
    const dist = new Map([[src, 0]])
    const heap = [[0, src]]
    while (heap.length) {
      heap.sort((x, y) => x[0] - y[0]) // tiny frontier, fine
      const [d, u] = heap.shift()
      if (u === dst) return d
      if (d > bound || d > (dist.get(u) ?? Infinity)) continue
      for (const e of adj.get(u) ?? []) {
        const nd = d + e.lenM
        if (nd <= bound && nd < (dist.get(e.to) ?? Infinity)) {
          dist.set(e.to, nd)
          heap.push([nd, e.to])
        }
      }
    }
    return Infinity
  }
  let bridged = 0
  for (const [nid, deg] of degree) {
    if (deg !== 1) continue
    const p = nodePos.get(nid)
    if (!p) continue
    let best = null
    for (const [oid, op] of nodePos) {
      if (oid === nid || !adj.has(oid)) continue
      const d = havM(p, op)
      if (d < GAP_BRIDGE_M && (!best || d < best.d)) best = { oid, op, d }
    }
    if (!best) continue
    if (boundedDist(nid, best.oid, GAP_MIN_PATH_M) !== Infinity) continue
    const seg = { pts: [p, best.op], name: '', kind: 'trail' }
    noded.push(seg)
    addEdge(nid, best.oid, { costM: best.d, lenM: best.d, seg, fwd: true })
    addEdge(best.oid, nid, { costM: best.d, lenM: best.d, seg, fwd: false })
    bridged++
  }
  if (bridged) console.log(`  bridged ${bridged} dangling gaps ≤${GAP_BRIDGE_M} m`)

  return { segs: noded, adj }
}

// Nearest location on the network to a point: {seg, edge nodes, t, distM}.
// trailOnly skips road segments: most hikes start at a parking lot where the
// highway is nearer than the trail, and a road snap sends the router on a
// giant detour when the two aren't joined in the data.
export function nearestOnNetwork(net, p, maxSnapM, trailOnly = true) {
  let best = null
  for (const s of net.segs) {
    if (trailOnly && s.kind === 'road') continue
    for (let vi = 0; vi < s.pts.length - 1; vi++) {
      const { t, distM } = projectPoint(p, s.pts[vi], s.pts[vi + 1])
      if (!best || distM < best.distM) best = { seg: s, vi, t, distM }
    }
  }
  if (!best || best.distM > maxSnapM) return null
  return best
}

// Dijkstra from a snapped location to another snapped location, returning the
// concatenated real polyline. Virtual terminus nodes attach mid-segment.
export function route(net, fromSnap, toSnap) {
  // Split geometry helper: portion of seg's polyline between arc positions.
  const segIndex = new Map(net.segs.map((s, i) => [s, i]))
  const nodeIdOfSegEnd = (s, end) => {
    // recompute clustering ids by matching adjacency entries
    // (we stored edges with seg refs; find via adj scan lazily below)
    return null
  }
  // Build node lookup from adj (seg -> its two node ids)
  const segNodes = new Map()
  for (const [nid, edges] of net.adj) {
    for (const e of edges) {
      if (!segNodes.has(e.seg)) segNodes.set(e.seg, {})
      const rec = segNodes.get(e.seg)
      if (e.fwd) rec.a = nid
      else rec.b = nid
    }
  }

  const V_FROM = -1
  const V_TO = -2
  // arc position of a snap within its segment
  const arcPos = (snap) => {
    let d = 0
    for (let i = 0; i < snap.vi; i++) d += havM(snap.seg.pts[i], snap.seg.pts[i + 1])
    d += havM(snap.seg.pts[snap.vi], snap.seg.pts[snap.vi + 1]) * snap.t
    return d
  }
  const subLine = (seg, fromM, toM) => {
    // polyline between arc positions (fromM < toM)
    const out = []
    let d = 0
    for (let i = 0; i < seg.pts.length - 1; i++) {
      const a = seg.pts[i]
      const b = seg.pts[i + 1]
      const L = havM(a, b)
      const s0 = d
      const s1 = d + L
      const lerp = (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
      if (s1 >= fromM && s0 <= toM && L > 0) {
        const t0 = Math.max(0, (fromM - s0) / L)
        const t1 = Math.min(1, (toM - s0) / L)
        if (out.length === 0) out.push(lerp(t0))
        out.push(lerp(t1))
      }
      d = s1
    }
    return out
  }

  const extra = new Map() // nodeId -> extra edges
  const addExtra = (from, to, edge) => {
    if (!extra.has(from)) extra.set(from, [])
    extra.get(from).push({ to, ...edge })
  }
  const attach = (snap, vid) => {
    const nodes = segNodes.get(snap.seg)
    const segLen = lineLenM(snap.seg.pts)
    const pos = arcPos(snap)
    const penalty = snap.seg.kind === 'road' ? ROAD_PENALTY : 1
    if (nodes?.a != null) {
      const geomToA = subLine(snap.seg, 0, pos).reverse()
      addExtra(vid, nodes.a, { costM: pos * penalty, lenM: pos, virtual: geomToA })
      addExtra(nodes.a, vid, { costM: pos * penalty, lenM: pos, virtual: geomToA.slice().reverse() })
    }
    if (nodes?.b != null) {
      const rest = segLen - pos
      const geomToB = subLine(snap.seg, pos, segLen)
      addExtra(vid, nodes.b, { costM: rest * penalty, lenM: rest, virtual: geomToB })
      addExtra(nodes.b, vid, { costM: rest * penalty, lenM: rest, virtual: geomToB.slice().reverse() })
    }
  }
  attach(fromSnap, V_FROM)
  attach(toSnap, V_TO)
  // Same segment: direct partial edge.
  if (fromSnap.seg === toSnap.seg) {
    const p0 = arcPos(fromSnap)
    const p1 = arcPos(toSnap)
    const lo = Math.min(p0, p1)
    const hi = Math.max(p0, p1)
    let geom = subLine(fromSnap.seg, lo, hi)
    if (p0 > p1) geom = geom.slice().reverse()
    const penalty = fromSnap.seg.kind === 'road' ? ROAD_PENALTY : 1
    addExtra(V_FROM, V_TO, { costM: (hi - lo) * penalty, lenM: hi - lo, virtual: geom })
  }

  const edgesOf = (n) => [...(net.adj.get(n) ?? []), ...(extra.get(n) ?? [])]
  const dist = new Map([[V_FROM, 0]])
  const prev = new Map()
  // binary-heap-free priority queue: simple array heap
  const heap = [[0, V_FROM]]
  const push = (item) => {
    heap.push(item)
    let i = heap.length - 1
    while (i > 0) {
      const p = (i - 1) >> 1
      if (heap[p][0] <= heap[i][0]) break
      ;[heap[p], heap[i]] = [heap[i], heap[p]]
      i = p
    }
  }
  const pop = () => {
    const top = heap[0]
    const last = heap.pop()
    if (heap.length) {
      heap[0] = last
      let i = 0
      for (;;) {
        const l = 2 * i + 1
        const r = l + 1
        let m = i
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r
        if (m === i) break
        ;[heap[m], heap[i]] = [heap[i], heap[m]]
        i = m
      }
    }
    return top
  }
  while (heap.length) {
    const [d, u] = pop()
    if (u === V_TO) break
    if (d > (dist.get(u) ?? Infinity)) continue
    for (const e of edgesOf(u)) {
      const nd = d + e.costM
      if (nd < (dist.get(e.to) ?? Infinity)) {
        dist.set(e.to, nd)
        prev.set(e.to, { from: u, edge: e })
        push([nd, e.to])
      }
    }
  }
  if (!dist.has(V_TO)) return null

  // Reconstruct geometry.
  const legs = []
  let cur = V_TO
  while (cur !== V_FROM) {
    const { from, edge } = prev.get(cur)
    let geom
    if (edge.virtual) geom = edge.virtual
    else geom = edge.fwd ? edge.seg.pts : edge.seg.pts.slice().reverse()
    legs.push(geom)
    cur = from
  }
  legs.reverse()
  const out = []
  for (const leg of legs) {
    for (const p of leg) {
      const last = out[out.length - 1]
      if (!last || havM(last, p) > 0.5) out.push(p)
    }
  }
  return out
}

// --- elevation ---------------------------------------------------------------
export const tileCache = new Map()
export async function terrariumTile(z, x, y) {
  const key = `${z}/${x}/${y}`
  if (tileCache.has(key)) return tileCache.get(key)
  const file = path.join(CACHE, 'terrarium', `${z}-${x}-${y}.png`)
  let buf
  if (fs.existsSync(file)) {
    buf = fs.readFileSync(file)
  } else {
    buf = await fetchBuf(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`)
    if (!buf) throw new Error(`no terrain tile ${key}`)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, buf)
  }
  const png = PNG.sync.read(buf)
  tileCache.set(key, png)
  return png
}

export async function elevationM(lng, lat) {
  const n = 2 ** TERRARIUM_Z
  const xf = ((lng + 180) / 360) * n
  const latR = (lat * Math.PI) / 180
  const yf = ((1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2) * n
  const tx = Math.floor(xf)
  const ty = Math.floor(yf)
  const png = await terrariumTile(TERRARIUM_Z, tx, ty)
  // pixel coords within tile, clamped bilinear
  const px = Math.min(255.999, Math.max(0, (xf - tx) * 256 - 0.5))
  const py = Math.min(255.999, Math.max(0, (yf - ty) * 256 - 0.5))
  const x0 = Math.floor(px)
  const y0 = Math.floor(py)
  const x1 = Math.min(255, x0 + 1)
  const y1 = Math.min(255, y0 + 1)
  const fx = px - x0
  const fy = py - y0
  const at = (x, y) => {
    const i = (y * 256 + x) * 4
    return (png.data[i] * 256 + png.data[i + 1] + png.data[i + 2] / 256) - 32768
  }
  return (
    at(x0, y0) * (1 - fx) * (1 - fy) +
    at(x1, y0) * fx * (1 - fy) +
    at(x0, y1) * (1 - fx) * fy +
    at(x1, y1) * fx * fy
  )
}

// Resample a line at SAMPLE_M spacing and read smoothed elevations.
export async function buildProfile(line) {
  const totalM = lineLenM(line)
  const nSamples = Math.max(2, Math.ceil(totalM / SAMPLE_M) + 1)
  const step = totalM / (nSamples - 1)
  const samples = [] // {m, lng, lat}
  let target = 0
  let acc = 0
  samples.push({ m: 0, p: line[0] })
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1]
    const b = line[i]
    const L = havM(a, b)
    while (target + step <= acc + L) {
      target += step
      const t = (target - acc) / L
      samples.push({ m: target, p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t] })
    }
    acc += L
  }
  if (samples[samples.length - 1].m < totalM - 1) samples.push({ m: totalM, p: line[line.length - 1] })

  const raw = []
  for (const s of samples) raw.push(await elevationM(s.p[0], s.p[1]))
  // centered moving average
  const half = Math.floor(SMOOTH_WIN / 2)
  const smooth = raw.map((_, i) => {
    let sum = 0
    let n = 0
    for (let j = Math.max(0, i - half); j <= Math.min(raw.length - 1, i + half); j++) {
      sum += raw[j]
      n++
    }
    return sum / n
  })
  return samples.map((s, i) => ({ m: s.m, ft: smooth[i] * FT_PER_M }))
}

export function profileStats(profile) {
  let gain = 0
  let loss = 0
  let minFt = Infinity
  let maxFt = -Infinity
  let maxAtM = 0
  // hysteresis gain/loss
  let anchor = profile[0].ft
  let dir = 0
  for (const { m, ft } of profile) {
    if (ft < minFt) minFt = ft
    if (ft > maxFt) {
      maxFt = ft
      maxAtM = m
    }
    const d = ft - anchor
    if (dir >= 0) {
      if (d > 0) {
        anchor = ft
        if (dir === 0) dir = 1
        gain += d
      } else if (d < -HYSTERESIS_FT) {
        dir = -1
        anchor = ft
        loss += -d
      }
    } else if (dir < 0) {
      if (d < 0) {
        anchor = ft
        loss += -d
      } else if (d > HYSTERESIS_FT) {
        dir = 1
        anchor = ft
        gain += d
      }
    }
  }
  // sustained max grade over GRADE_WIN_M
  let maxGrade = 0
  let j = 0
  for (let i = 0; i < profile.length; i++) {
    while (profile[i].m - profile[j].m > GRADE_WIN_M) j++
    if (i > j) {
      const dm = profile[i].m - profile[j].m
      if (dm >= GRADE_WIN_M * 0.6) {
        const g = Math.abs((profile[i].ft - profile[j].ft) / FT_PER_M / dm) * 100
        if (g > maxGrade) maxGrade = g
      }
    }
  }
  return { gainFt: gain, lossFt: loss, minFt, maxFt, maxAtM, maxGradePct: maxGrade }
}

