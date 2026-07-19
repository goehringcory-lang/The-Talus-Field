// =============================================================================
// GPX export: a standard GPX 1.1 track any backcountry app or GPS watch can
// import (Gaia, Caltopo, Garmin, organic maps). Elevations are interpolated
// from the track's profile at each vertex's along-line distance, so the file
// carries real 3DEP elevations without doubling the stored payload.
//
// Delivery mirrors trip/exportTrip.ts: Web Share with a File first (iOS
// standalone PWAs can't reliably download blobs), anchor download second.
// =============================================================================

import { isIOS, isStandalonePWA } from '../utils/platform'
import type { HikeT } from '../content'
import type { TrackT } from './schema'

const M_PER_MI = 1609.344
const EARTH_R = 6371000

function havM(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[1] - a[1])
  const dLng = toRad(b[0] - a[0])
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_R * Math.asin(Math.sqrt(h))
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Elevation (meters) at a given along-line position, linearly interpolated
 * from the [mi, ft] profile. */
function eleAtMi(profile: [number, number][], mi: number): number {
  let i = 1
  while (i < profile.length - 1 && profile[i][0] < mi) i++
  const [m0, f0] = profile[i - 1]
  const [m1, f1] = profile[i]
  const t = m1 > m0 ? Math.min(1, Math.max(0, (mi - m0) / (m1 - m0))) : 0
  return ((f0 + (f1 - f0) * t) / 3.28084)
}

export function buildGpx(hike: HikeT, track: TrackT): string {
  const pts: string[] = []
  let acc = 0
  for (let i = 0; i < track.line.length; i++) {
    if (i > 0) acc += havM(track.line[i - 1], track.line[i])
    const [lng, lat] = track.line[i]
    const ele = eleAtMi(track.profile, acc / M_PER_MI)
    pts.push(`      <trkpt lat="${lat}" lon="${lng}"><ele>${ele.toFixed(1)}</ele></trkpt>`)
  }
  const desc =
    `${hike.route === 'out-and-back' ? 'Out-and-back: this track is the outbound leg; return the same way.' : ''} ` +
    `Geometry: ${track.source.geometry}. Elevation: ${track.source.elevation}.`
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<gpx version="1.1" creator="The Talus Field Guide" xmlns="http://www.topografix.com/GPX/1/1">',
    '  <metadata>',
    `    <name>${esc(hike.title)}</name>`,
    `    <desc>${esc(desc.trim())}</desc>`,
    '  </metadata>',
    '  <trk>',
    `    <name>${esc(hike.title)}</name>`,
    '    <trkseg>',
    ...pts,
    '    </trkseg>',
    '  </trk>',
    '</gpx>',
    '',
  ].join('\n')
}

export type GpxExportResult = 'shared' | 'downloaded' | 'cancelled' | 'failed'

export async function exportGpx(hike: HikeT, track: TrackT): Promise<GpxExportResult> {
  const gpx = buildGpx(hike, track)
  const filename = `${hike.id}.gpx`
  const file = new File([gpx], filename, { type: 'application/gpx+xml' })

  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: hike.title })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      if (isIOS() && isStandalonePWA()) return 'failed'
      /* fall through to download */
    }
  }

  try {
    const url = URL.createObjectURL(new Blob([gpx], { type: 'application/gpx+xml' }))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
    return 'downloaded'
  } catch {
    return 'failed'
  }
}
