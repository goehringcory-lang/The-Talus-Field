// =============================================================================
// gen-map-data.ts: the 3D map's bundled geodata.
//
//   npm run map:data
//
// Writes (all committed):
//   src/map/data/park-boundary.json   the NPS legal boundary, simplified
//   public/map/roads-<hash>.json      the routable road and path graph
//   src/map/roads.generated.ts        that file's name (content-hashed, so the
//                                     service worker can cache it forever)
//
//   npm run map:data -- --refresh     refetch OSM instead of the cached pull
//
// Source: the NPS Land Resources Division boundary service (public domain,
// the authoritative legal boundary; the record carries its own edit date).
// https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/NPS_Land_Resources_Division_Boundary_and_Tract_Data_Service/FeatureServer/2
//
// The boundary is simplified (Douglas-Peucker, ~12 m) and rounded to five
// decimals (~1 m): the line is a subtle outline and a mask edge, never a
// trespass line, and the unsimplified record is 400 KB.
//
// The road graph is OpenStreetMap (ODbL: the graph file is a derived database
// and is published under the same licence, which its header says) via the
// Overpass API. The app routes over it on the device (src/map/routing.ts), so
// a trip's driving lines follow the roads with no signal and no routing
// service. It carries every public road in the extent that a car may use,
// one-way rules included (Northside and Southside Drive are one-way loops, and
// a route that ignored that would send a reader the wrong way up the Valley),
// and every footpath within WALK_REACH_M of a place the guide knows, which is
// what the walking legs of a plan (lot to trailhead, shuttle stop to program)
// need. The rest of the park's trail network is the basemap's to draw.
// =============================================================================

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { AMENITIES, DINING, HIKES, SECRET_SPOTS, stops } from '../src/content'
import { MAP_EXTENT } from '../src/map/regions'
import { GRAPH_FLAGS, encodePolyline, type RoadGraphFile } from '../src/map/roadGraph'

const APP_DIR = path.resolve(import.meta.dirname, '..')
const OUT_DIR = path.join(APP_DIR, 'src/map/data')
const PUBLIC_DIR = path.join(APP_DIR, 'public/map')
const ROADS_MODULE = path.join(APP_DIR, 'src/map/roads.generated.ts')
const CACHE = path.join(APP_DIR, 'scripts/.mapcache')
const OVERPASS = 'https://overpass-api.de/api/interpreter'
const UA = 'TalusFieldGuide/1.0 (map data pipeline; thetalusfieldjournal.com)'

const BOUNDARY_URL =
  'https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/NPS_Land_Resources_Division_Boundary_and_Tract_Data_Service/FeatureServer/2/query' +
  "?where=UNIT_CODE%3D'YOSE'&outFields=UNIT_CODE,UNIT_NAME,DATE_EDIT&outSR=4326&f=geojson"

// Degrees. At 37.7 N one degree of longitude is ~88 km, so this is ~12 m.
const SIMPLIFY_TOLERANCE = 0.00014

type Pt = [number, number]

function perpDistance(p: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = dx * dx + dy * dy
  if (len === 0) return Math.hypot(p[0] - a[0], p[1] - a[1])
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len))
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy))
}

/** Douglas-Peucker, iterative (a 20,000-vertex ring would blow a recursive stack). */
export function simplify(points: Pt[], tolerance: number): Pt[] {
  if (points.length < 3) return points
  const keep = new Uint8Array(points.length)
  keep[0] = keep[points.length - 1] = 1
  const stack: [number, number][] = [[0, points.length - 1]]
  while (stack.length) {
    const [first, last] = stack.pop()!
    let maxD = 0
    let index = -1
    for (let i = first + 1; i < last; i++) {
      const d = perpDistance(points[i], points[first], points[last])
      if (d > maxD) {
        maxD = d
        index = i
      }
    }
    if (maxD > tolerance && index > 0) {
      keep[index] = 1
      stack.push([first, index], [index, last])
    }
  }
  return points.filter((_, i) => keep[i])
}

const round = ([lng, lat]: Pt): Pt => [Math.round(lng * 1e5) / 1e5, Math.round(lat * 1e5) / 1e5]

async function boundary() {
  const res = await fetch(BOUNDARY_URL, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`NPS boundary: HTTP ${res.status}`)
  const data = (await res.json()) as {
    features: { properties: { UNIT_NAME: string; DATE_EDIT: number }; geometry: { type: string; coordinates: unknown } }[]
  }
  const feature = data.features?.[0]
  if (!feature) throw new Error('NPS boundary: no YOSE feature')
  const polygons = (feature.geometry.type === 'MultiPolygon'
    ? feature.geometry.coordinates
    : [feature.geometry.coordinates]) as Pt[][][]
  let before = 0
  let after = 0
  const simplified = polygons.map((rings) =>
    rings.map((ring) => {
      before += ring.length
      const out = simplify(ring, SIMPLIFY_TOLERANCE).map(round)
      after += out.length
      return out
    }),
  )
  const edited = new Date(feature.properties.DATE_EDIT).toISOString().slice(0, 10)
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: feature.properties.UNIT_NAME, source: 'NPS Land Resources Division', edited },
        geometry:
          simplified.length === 1
            ? { type: 'Polygon', coordinates: simplified[0] }
            : { type: 'MultiPolygon', coordinates: simplified },
      },
    ],
  }
  const file = path.join(OUT_DIR, 'park-boundary.json')
  fs.writeFileSync(file, JSON.stringify(geojson) + '\n')
  console.log(`boundary: ${before} -> ${after} vertices, NPS edit ${edited}, ${fs.statSync(file).size} bytes`)
}

// --- the road and path graph ---------------------------------------------------

type OsmWay = {
  id: number
  tags: Record<string, string>
  nodes: number[]
  geometry: { lat: number; lon: number }[]
}

const DRIVE_CLASSES = new Set([
  'motorway', 'motorway_link', 'trunk', 'trunk_link', 'primary', 'primary_link',
  'secondary', 'secondary_link', 'tertiary', 'tertiary_link', 'unclassified',
  'residential', 'living_street', 'service',
])
// Kept everywhere in the extent: the through roads.
const MAJOR_CLASSES = new Set([
  'motorway', 'motorway_link', 'trunk', 'trunk_link', 'primary', 'primary_link',
  'secondary', 'secondary_link', 'tertiary', 'tertiary_link',
])
const PATH_CLASSES = new Set(['footway', 'path', 'pedestrian', 'steps', 'cycleway', 'bridleway', 'track'])
// A lot's aisles and a lodge's driveway are not a route anywhere.
const SKIP_SERVICE = new Set(['driveway', 'parking_aisle', 'drive-through', 'emergency_access'])
const NO = new Set(['no', 'private'])
/** Minor roads and paths are kept only this near a place the guide knows. */
const WALK_REACH_M = 2000
const GEOMETRY_TOLERANCE = 0.00003 // ~3 m

function metres(a: Pt, b: Pt): number {
  const R = 6371008.8
  const rad = Math.PI / 180
  const dLat = (b[1] - a[1]) * rad
  const dLng = (b[0] - a[0]) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function guidePlaces(): Pt[] {
  const out: Pt[] = []
  for (const s of [...stops, ...SECRET_SPOTS]) if (s.coord) out.push(s.coord)
  for (const h of HIKES) if (h.coord) out.push(h.coord)
  for (const a of AMENITIES) out.push(a.coord)
  for (const d of DINING) if (d.coord) out.push(d.coord)
  return out
}

async function fetchWays(refresh: boolean): Promise<{ ways: OsmWay[]; timestamp: string }> {
  const file = path.join(CACHE, 'osm-ways.json')
  if (!refresh && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))
  const [w, s, e, n] = MAP_EXTENT
  const bbox = `${s},${w},${n},${e}`
  const query = `[out:json][timeout:180];(way["highway"~"^(${[...DRIVE_CLASSES, ...PATH_CLASSES].join('|')})$"](${bbox}););out body geom;`
  console.log('overpass: fetching roads and paths')
  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ data: query }),
  })
  if (!res.ok) throw new Error(`Overpass: HTTP ${res.status}`)
  const data = (await res.json()) as { osm3s: { timestamp_osm_base: string }; elements: OsmWay[] }
  const out = { ways: data.elements.filter((e) => e.nodes && e.geometry), timestamp: data.osm3s.timestamp_osm_base }
  fs.mkdirSync(CACHE, { recursive: true })
  fs.writeFileSync(file, JSON.stringify(out))
  return out
}

function classify(tags: Record<string, string>): { drive: 0 | 1 | 2 | 3; walk: boolean } {
  const hw = tags.highway
  const access = tags.access ?? ''
  const motor = tags.motor_vehicle ?? tags.motorcar ?? ''
  let driveOk = DRIVE_CLASSES.has(hw) && !SKIP_SERVICE.has(tags.service ?? '')
  if (NO.has(access) && motor !== 'yes' && motor !== 'destination') driveOk = false
  if (NO.has(motor)) driveOk = false
  let drive: 0 | 1 | 2 | 3 = 0
  if (driveOk) {
    const oneway = tags.oneway ?? (tags.junction === 'roundabout' ? 'yes' : 'no')
    drive = oneway === '-1' ? 2 : ['yes', '1', 'true'].includes(oneway) ? 1 : 3
  }
  const walk =
    !NO.has(tags.foot ?? '') &&
    !(NO.has(access) && tags.foot !== 'yes' && tags.foot !== 'designated') &&
    (PATH_CLASSES.has(hw) || (DRIVE_CLASSES.has(hw) && !hw.startsWith('motorway') && !hw.startsWith('trunk')))
  return { drive, walk }
}

async function roadGraph(refresh: boolean) {
  const { ways, timestamp } = await fetchWays(refresh)
  const places = guidePlaces()
  const nearPlace = (p: Pt) => places.some((q) => Math.abs(q[1] - p[1]) < 0.02 && metres(p, q) < WALK_REACH_M)

  type Kept = { way: OsmWay; drive: 0 | 1 | 2 | 3; walk: boolean }
  const kept: Kept[] = []
  for (const way of ways) {
    const c = classify(way.tags)
    if (!c.drive && !c.walk) continue
    const major = MAJOR_CLASSES.has(way.tags.highway)
    const near = major || way.geometry.some((g) => nearPlace([g.lon, g.lat]))
    if (!near) continue
    // Tracks and paths far from everything went above; a track is walked,
    // never driven, in this graph (fire roads are gated).
    kept.push({ way, drive: way.tags.highway === 'track' ? 0 : c.drive, walk: c.walk })
  }

  // Graph nodes: every way end, and every OSM node two kept ways share.
  const uses = new Map<number, number>()
  for (const { way } of kept) {
    way.nodes.forEach((id, i) => {
      const end = i === 0 || i === way.nodes.length - 1
      uses.set(id, (uses.get(id) ?? 0) + (end ? 2 : 1))
    })
  }
  const index = new Map<number, number>()
  const nodes: number[] = []
  const nodeFor = (id: number, g: { lat: number; lon: number }) => {
    let i = index.get(id)
    if (i === undefined) {
      i = nodes.length / 2
      index.set(id, i)
      nodes.push(Math.round(g.lon * 1e5), Math.round(g.lat * 1e5))
    }
    return i
  }

  const edges: RoadGraphFile['edges'] = []
  for (const { way, drive, walk } of kept) {
    let start = 0
    for (let i = 1; i < way.nodes.length; i++) {
      if (i < way.nodes.length - 1 && (uses.get(way.nodes[i]) ?? 0) < 2) continue
      const line: Pt[] = way.geometry.slice(start, i + 1).map((g) => [g.lon, g.lat])
      let length = 0
      for (let k = 1; k < line.length; k++) length += metres(line[k - 1], line[k])
      const a = nodeFor(way.nodes[start], way.geometry[start])
      const b = nodeFor(way.nodes[i], way.geometry[i])
      let flags = 0
      if (drive & 1) flags |= GRAPH_FLAGS.DRIVE_FORWARD
      if (drive & 2) flags |= GRAPH_FLAGS.DRIVE_BACKWARD
      if (walk) flags |= GRAPH_FLAGS.WALK
      if (a !== b || length > 0) {
        edges.push([a, b, Math.round(length), flags, encodePolyline(simplify(line, GEOMETRY_TOLERANCE))])
      }
      start = i
    }
  }

  const file: RoadGraphFile = {
    v: 1,
    licence: 'Data © OpenStreetMap contributors, available under the Open Database License (ODbL) 1.0: https://www.openstreetmap.org/copyright',
    osm: timestamp,
    nodes,
    edges,
  }
  const body = JSON.stringify(file) + '\n'
  const name = `roads-${crypto.createHash('sha256').update(body).digest('hex').slice(0, 10)}.json`
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  for (const old of fs.readdirSync(PUBLIC_DIR)) if (/^roads-[0-9a-f]+\.json$/.test(old)) fs.rmSync(path.join(PUBLIC_DIR, old))
  const PUBLIC_OUT = path.join(PUBLIC_DIR, name)
  fs.writeFileSync(PUBLIC_OUT, body)
  fs.writeFileSync(
    ROADS_MODULE,
    `// GENERATED by scripts/gen-map-data.ts. Do not edit; rerun \`npm run map:data\`.\n` +
      `// The road graph's file under public/, content-hashed: immutable, cached forever.\n\n` +
      `export const ROADS_URL = '/map/${name}'\n` +
      `export const ROADS_OSM_TIMESTAMP = '${timestamp}'\n`,
  )
  const drive = edges.filter((e) => e[3] & (GRAPH_FLAGS.DRIVE_FORWARD | GRAPH_FLAGS.DRIVE_BACKWARD)).length
  console.log(
    `roads: ${kept.length} of ${ways.length} ways -> ${nodes.length / 2} nodes, ${edges.length} edges ` +
      `(${drive} drivable), OSM ${timestamp}, ${fs.statSync(PUBLIC_OUT).size} bytes`,
  )
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  await boundary()
  await roadGraph(process.argv.includes('--refresh'))
}

await main()
