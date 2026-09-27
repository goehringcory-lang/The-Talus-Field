// =============================================================================
// The road and path graph, and routing over it on the device.
//
// scripts/gen-map-data.ts writes public/map/roads.json from OpenStreetMap; the
// map fetches it once (the service worker keeps it for offline) and routes a
// trip's driving and walking legs here, so a line follows the road it will be
// driven on with no signal and no routing service.
//
// What this module decides and what it does not: it draws the route and
// measures its length. How long a leg takes stays with trip/slotting.ts (the
// park's published driving table, the walking and shuttle estimates), so the
// map, the trip board and the drive check can never disagree about a time.
//
// Pure: no DOM, no fetch. Tested in roadGraph.test.ts.
// =============================================================================

export type Pt = [number, number] // [lng, lat]

export const GRAPH_FLAGS = {
  DRIVE_FORWARD: 1, // a car may go from the edge's first node to its second
  DRIVE_BACKWARD: 2,
  WALK: 4, // both directions
} as const

/** On disk: nodes as flat [lngE5, latE5, ...]; edges as [a, b, metres, flags, polyline]. */
export type RoadGraphFile = {
  v: 1
  licence: string
  osm: string
  nodes: number[]
  edges: [number, number, number, number, string][]
}

export type RouteMode = 'drive' | 'walk'

export type Route = {
  coords: Pt[]
  metres: number
  /** Straight-line distance from each end to the graph, walked or driven off-network. */
  snapMetres: [number, number]
}

// --- polyline (Google's algorithm, precision 5) ------------------------------

export function encodePolyline(points: Pt[]): string {
  let out = ''
  let lastLat = 0
  let lastLng = 0
  const enc = (v: number) => {
    let n = v < 0 ? ~(v << 1) : v << 1
    while (n >= 0x20) {
      out += String.fromCharCode((0x20 | (n & 0x1f)) + 63)
      n >>= 5
    }
    out += String.fromCharCode(n + 63)
  }
  for (const [lng, lat] of points) {
    const la = Math.round(lat * 1e5)
    const ln = Math.round(lng * 1e5)
    enc(la - lastLat)
    enc(ln - lastLng)
    lastLat = la
    lastLng = ln
  }
  return out
}

export function decodePolyline(str: string): Pt[] {
  const out: Pt[] = []
  let i = 0
  let lat = 0
  let lng = 0
  const dec = () => {
    let shift = 0
    let result = 0
    let b: number
    do {
      b = str.charCodeAt(i++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    return result & 1 ? ~(result >> 1) : result >> 1
  }
  while (i < str.length) {
    lat += dec()
    lng += dec()
    out.push([lng / 1e5, lat / 1e5])
  }
  return out
}

// --- geometry ------------------------------------------------------------------

export function metresBetween(a: Pt, b: Pt): number {
  const R = 6371008.8
  const rad = Math.PI / 180
  const dLat = (b[1] - a[1]) * rad
  const dLng = (b[0] - a[0]) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Farther than this from the graph at either end, and a route is not the graph's to draw. */
export const MAX_SNAP_METRES: Record<RouteMode, number> = { drive: 1500, walk: 500 }

const CELL = 0.01 // degrees; ~1 km

type Adjacent = { to: number; edge: number; forward: boolean }

// --- the graph -----------------------------------------------------------------

export class RoadGraph {
  private readonly lng: Float64Array
  private readonly lat: Float64Array
  private readonly adj: Record<RouteMode, Adjacent[][]>
  private readonly grid = new Map<string, number[]>()
  private readonly geometry: (Pt[] | null)[]
  private readonly largest: Record<RouteMode, Uint8Array>
  private readonly file: RoadGraphFile

  constructor(file: RoadGraphFile) {
    this.file = file
    const n = file.nodes.length / 2
    this.lng = new Float64Array(n)
    this.lat = new Float64Array(n)
    for (let i = 0; i < n; i++) {
      this.lng[i] = file.nodes[2 * i] / 1e5
      this.lat[i] = file.nodes[2 * i + 1] / 1e5
      const key = this.cellKey(this.lng[i], this.lat[i])
      const list = this.grid.get(key)
      if (list) list.push(i)
      else this.grid.set(key, [i])
    }
    this.adj = { drive: Array.from({ length: n }, () => []), walk: Array.from({ length: n }, () => []) }
    file.edges.forEach(([a, b, , flags], e) => {
      if (flags & GRAPH_FLAGS.DRIVE_FORWARD) this.adj.drive[a].push({ to: b, edge: e, forward: true })
      if (flags & GRAPH_FLAGS.DRIVE_BACKWARD) this.adj.drive[b].push({ to: a, edge: e, forward: false })
      if (flags & GRAPH_FLAGS.WALK) {
        this.adj.walk[a].push({ to: b, edge: e, forward: true })
        this.adj.walk[b].push({ to: a, edge: e, forward: false })
      }
    })
    this.geometry = new Array(file.edges.length).fill(null)
    this.largest = { drive: this.largestComponent('drive'), walk: this.largestComponent('walk') }
  }

  get osmTimestamp(): string {
    return this.file.osm
  }

  private cellKey(lng: number, lat: number): string {
    return `${Math.floor(lng / CELL)},${Math.floor(lat / CELL)}`
  }

  private point(i: number): Pt {
    return [this.lng[i], this.lat[i]]
  }

  // Weakly connected: a one-way loop is one component, which is what snapping
  // needs (a node on it can reach and be reached by the rest of the loop).
  private largestComponent(mode: RouteMode): Uint8Array {
    const n = this.lng.length
    const undirected: number[][] = Array.from({ length: n }, () => [])
    for (let i = 0; i < n; i++) {
      for (const { to } of this.adj[mode][i]) {
        undirected[i].push(to)
        undirected[to].push(i)
      }
    }
    const comp = new Int32Array(n).fill(-1)
    const sizes: number[] = []
    for (let s = 0; s < n; s++) {
      if (comp[s] !== -1 || undirected[s].length === 0) continue
      const id = sizes.length
      let size = 0
      const stack = [s]
      comp[s] = id
      while (stack.length) {
        const v = stack.pop()!
        size++
        for (const w of undirected[v]) {
          if (comp[w] === -1) {
            comp[w] = id
            stack.push(w)
          }
        }
      }
      sizes.push(size)
    }
    const best = sizes.indexOf(Math.max(...sizes, 0))
    const out = new Uint8Array(n)
    for (let i = 0; i < n; i++) out[i] = comp[i] === best ? 1 : 0
    return out
  }

  /** The nearest node a route in this mode can start from, preferring the main network. */
  nearestNode(p: Pt, mode: RouteMode): { node: number; metres: number } | null {
    const cx = Math.floor(p[0] / CELL)
    const cy = Math.floor(p[1] / CELL)
    let best: { node: number; metres: number } | null = null
    for (let r = 0; r <= 2 && !best; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          for (const i of this.grid.get(`${cx + dx},${cy + dy}`) ?? []) {
            if (!this.largest[mode][i]) continue
            const m = metresBetween(p, this.point(i))
            if (!best || m < best.metres) best = { node: i, metres: m }
          }
        }
      }
    }
    return best
  }

  private edgeLine(e: number, forward: boolean): Pt[] {
    let line = this.geometry[e]
    if (!line) {
      line = decodePolyline(this.file.edges[e][4])
      this.geometry[e] = line
    }
    return forward ? line : [...line].reverse()
  }

  /**
   * The shortest route between two points in one mode, from the graph node
   * nearest each (the straight bits to and from the graph are included), or
   * null when either end is too far from the network or no route exists.
   */
  route(from: Pt, to: Pt, mode: RouteMode): Route | null {
    const a = this.nearestNode(from, mode)
    const b = this.nearestNode(to, mode)
    if (!a || !b) return null
    if (a.metres > MAX_SNAP_METRES[mode] || b.metres > MAX_SNAP_METRES[mode]) return null
    const path = this.astar(a.node, b.node, mode)
    if (!path) return null
    const coords: Pt[] = [from]
    let metres = 0
    for (const step of path) {
      const line = this.edgeLine(step.edge, step.forward)
      coords.push(...line)
      metres += this.file.edges[step.edge][2]
    }
    coords.push(to)
    return { coords: dedupe(coords), metres: metres + a.metres + b.metres, snapMetres: [a.metres, b.metres] }
  }

  private astar(start: number, goal: number, mode: RouteMode): Adjacent[] | null {
    if (start === goal) return []
    const n = this.lng.length
    const g = new Float64Array(n).fill(Infinity)
    const came: (Adjacent & { from: number })[] = new Array(n)
    const goalPt = this.point(goal)
    const heap = new MinHeap()
    g[start] = 0
    heap.push(start, metresBetween(this.point(start), goalPt))
    while (heap.size) {
      const v = heap.pop()
      if (v === goal) break
      for (const step of this.adj[mode][v]) {
        const cost = g[v] + this.file.edges[step.edge][2]
        if (cost < g[step.to]) {
          g[step.to] = cost
          came[step.to] = { ...step, from: v }
          heap.push(step.to, cost + metresBetween(this.point(step.to), goalPt))
        }
      }
    }
    if (g[goal] === Infinity) return null
    const path: Adjacent[] = []
    for (let v = goal; v !== start; v = came[v].from) path.push(came[v])
    return path.reverse()
  }
}

function dedupe(points: Pt[]): Pt[] {
  const out: Pt[] = []
  for (const p of points) {
    const last = out[out.length - 1]
    if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p)
  }
  return out
}

// Binary heap of node ids keyed by priority; stale entries are skipped by the
// caller's g-cost check being monotone (a node popped twice relaxes nothing).
class MinHeap {
  private ids: number[] = []
  private keys: number[] = []
  get size() {
    return this.ids.length
  }
  push(id: number, key: number) {
    this.ids.push(id)
    this.keys.push(key)
    let i = this.ids.length - 1
    while (i > 0) {
      const p = (i - 1) >> 1
      if (this.keys[p] <= this.keys[i]) break
      this.swap(i, p)
      i = p
    }
  }
  pop(): number {
    const top = this.ids[0]
    const lastId = this.ids.pop()!
    const lastKey = this.keys.pop()!
    if (this.ids.length) {
      this.ids[0] = lastId
      this.keys[0] = lastKey
      let i = 0
      for (;;) {
        const l = 2 * i + 1
        const r = l + 1
        let m = i
        if (l < this.ids.length && this.keys[l] < this.keys[m]) m = l
        if (r < this.ids.length && this.keys[r] < this.keys[m]) m = r
        if (m === i) break
        this.swap(i, m)
        i = m
      }
    }
    return top
  }
  private swap(a: number, b: number) {
    ;[this.ids[a], this.ids[b]] = [this.ids[b], this.ids[a]]
    ;[this.keys[a], this.keys[b]] = [this.keys[b], this.keys[a]]
  }
}
