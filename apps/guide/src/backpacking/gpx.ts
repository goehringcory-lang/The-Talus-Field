// =============================================================================
// GPX for a backpacking trip: one track with a segment per day, and a named
// waypoint for the trailhead, the exit, every night's camp and every water
// source, so a GPS app (Gaia, Caltopo, a Garmin) shows where to sleep and
// where to fill up without this guide open. Elevations come from the route's
// 3DEP profile, interpolated at each vertex. Delivered through
// lib/shareFile.ts (Web Share first, download second), offline either way.
// =============================================================================

import type { BackpackTripT } from '../content/schema'
import { shareOrDownloadFile, type ShareFileMethod } from '../lib/shareFile'
import { decodeRoute, sliceByMiles, type BackpackRouteT } from './routes'

const FT_PER_M = 3.28084

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function eleAt(profile: [number, number][], mi: number): number {
  let i = 1
  while (i < profile.length - 1 && profile[i][0] < mi) i++
  const [m0, f0] = profile[i - 1]
  const [m1, f1] = profile[i]
  const t = m1 > m0 ? Math.min(1, Math.max(0, (mi - m0) / (m1 - m0))) : 0
  return (f0 + (f1 - f0) * t) / FT_PER_M
}

export function buildBackpackGpx(trip: BackpackTripT, route: BackpackRouteT): string {
  const decoded = decodeRoute(trip.id, route)
  const wpt = (coord: [number, number], name: string, desc: string, sym: string) =>
    `  <wpt lat="${coord[1]}" lon="${coord[0]}"><name>${esc(name)}</name><desc>${esc(desc)}</desc><sym>${sym}</sym></wpt>`
  const points = [
    wpt(trip.trailhead.coord, `Start: ${trip.trailhead.name}`, trip.trailhead.parking, 'Trail Head'),
    ...(trip.exit ? [wpt(trip.exit.coord, `Exit: ${trip.exit.name}`, trip.exit.parking, 'Trail Head')] : []),
    ...trip.camps.map((c) => wpt(c.coord, c.name, `${c.kind === 'designated' ? 'Designated camp' : 'Legal camping area'}. ${c.rules}`, 'Campground')),
    ...trip.water.map((w) =>
      wpt(w.coord, w.name, `${w.reliability === 'reliable' ? 'Reliable' : 'Seasonal'} water. Treat it.${w.note ? ` ${w.note}` : ''}`, 'Drinking Water'),
    ),
  ]
  const segments = route.days.map((d) => {
    const pts = sliceByMiles(decoded, d.startMi, d.endMi)
    // Elevation by along-line position: the slice's own vertices map back to
    // the route's miles through the cumulative table.
    const out: string[] = []
    let mi = d.startMi
    for (let i = 0; i < pts.length; i++) {
      if (i > 0) {
        const [a, b] = [pts[i - 1], pts[i]]
        const r = (x: number) => (x * Math.PI) / 180
        const h = Math.sin(r(b[1] - a[1]) / 2) ** 2 + Math.cos(r(a[1])) * Math.cos(r(b[1])) * Math.sin(r(b[0] - a[0]) / 2) ** 2
        mi += (2 * 6371000 * Math.asin(Math.sqrt(h))) / 1609.344
      }
      out.push(`      <trkpt lat="${pts[i][1]}" lon="${pts[i][0]}"><ele>${eleAt(route.profile, Math.min(mi, d.endMi)).toFixed(1)}</ele></trkpt>`)
    }
    return ['    <trkseg>', ...out, '    </trkseg>'].join('\n')
  })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<gpx version="1.1" creator="The Talus Field Guide" xmlns="http://www.topografix.com/GPX/1/1">',
    '  <metadata>',
    `    <name>${esc(trip.title)}</name>`,
    `    <desc>${esc(`One track segment per day. Geometry: ${route.source}. Elevation: USGS 3DEP. Permit trailhead: ${trip.permit.trailhead}.`)}</desc>`,
    '  </metadata>',
    ...points,
    '  <trk>',
    `    <name>${esc(trip.title)}</name>`,
    ...segments,
    '  </trk>',
    '</gpx>',
    '',
  ].join('\n')
}

export function exportBackpackGpx(trip: BackpackTripT, route: BackpackRouteT): Promise<ShareFileMethod> {
  const file = new File([buildBackpackGpx(trip, route)], `${trip.id}.gpx`, { type: 'application/gpx+xml' })
  return shareOrDownloadFile(file, trip.title)
}
