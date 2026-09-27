// =============================================================================
// gen-map-data.ts: the 3D map's bundled geodata.
//
//   npm run map:data
//
// Writes (all committed, all small enough to ship in the map chunk):
//   src/map/data/park-boundary.json   the NPS legal boundary, simplified
//
// Source: the NPS Land Resources Division boundary service (public domain,
// the authoritative legal boundary; the record carries its own edit date).
// https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/NPS_Land_Resources_Division_Boundary_and_Tract_Data_Service/FeatureServer/2
//
// The boundary is simplified (Douglas-Peucker, ~12 m) and rounded to five
// decimals (~1 m): the line is a subtle outline and a mask edge, never a
// trespass line, and the unsimplified record is 400 KB.
// =============================================================================

import fs from 'node:fs'
import path from 'node:path'

const APP_DIR = path.resolve(import.meta.dirname, '..')
const OUT_DIR = path.join(APP_DIR, 'src/map/data')
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

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  await boundary()
}

await main()
