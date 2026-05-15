// Google Maps helpers for the /map route. Ported from the editorial site's
// page-map.jsx. The Maps JS script is loaded async from index.html with a
// token-substituted API key; the route polls for window.google.maps to be
// ready before initializing the map.

import type { StopKind, StopT } from '../content'

// Teardrop pin path, anchored at the tip. Rendered as a Google Maps Symbol
// so we can recolor without shipping image assets.
export const PIN_PATH =
  'M 0,0 C -2,-18 -11,-22 -11,-30 A 11,11 0 1,1 11,-30 C 11,-22 2,-18 0,0 z'

export type KindStyle = { color: string; label: string }

export const KIND_STYLES: Record<StopKind, KindStyle> = {
  viewpoint: { color: '#1e6fb8', label: 'Viewpoint' },
  trailhead: { color: '#2f8a3e', label: 'Trailhead' },
  parking: { color: '#6b6b6b', label: 'Parking' },
  lodging: { color: '#7a4ea8', label: 'Lodging' },
  meal: { color: '#e07a1a', label: 'Meal' },
  drive: { color: '#b8442e', label: 'Drive' },
}

export function getKindStyle(kind: StopKind): KindStyle {
  return KIND_STYLES[kind]
}

export function buildMarkerIcon(kind: StopKind): google.maps.Symbol {
  const { color } = getKindStyle(kind)
  return {
    path: PIN_PATH,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    scale: 1,
    anchor: new window.google.maps.Point(0, 0),
    labelOrigin: new window.google.maps.Point(0, -28),
  }
}

// Google Maps Directions deeplink. On phones with the Google Maps app
// installed, the OS deep-links into the app, which uses the user's
// pre-downloaded Yosemite offline area for routing.
export function directionsUrl(coord: [number, number]): string {
  const [lng, lat] = coord
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
}

export function buildInfoHtml(stop: StopT): string {
  const style = getKindStyle(stop.kind)
  const kindChip = `
    <span style="display:inline-flex;align-items:center;gap:6px;text-transform:uppercase;font-size:11px;letter-spacing:0.06em;color:${style.color};font-weight:600;">
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${style.color};"></span>
      ${escapeHtml(style.label)}
    </span>`
  const directions = stop.coord
    ? `<p style="margin:10px 0 0;"><a href="${directionsUrl(stop.coord)}" target="_blank" rel="noopener" style="display:inline-block;font:600 12px/1 system-ui,sans-serif;text-transform:uppercase;letter-spacing:0.08em;color:#1e6fb8;text-decoration:none;border:1px solid #1e6fb8;padding:8px 12px;border-radius:4px;">Open in Google Maps →</a></p>`
    : ''
  const swap = stop.swap
    ? `<p style="margin:8px 0 0;font-size:13px;color:#555;"><em>${escapeHtml(stop.swap)}</em></p>`
    : ''
  return `
    <div style="font:14px/1.4 system-ui,sans-serif;max-width:260px;color:#222;">
      <strong style="font-size:15px;">${escapeHtml(stop.title)}</strong><br/>
      ${kindChip}
      ${swap}
      ${directions}
    </div>
  `
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Polls window.google.maps for up to timeoutMs. The script in index.html
// loads async, so the namespace may not exist yet when the route mounts.
export function waitForGoogleMaps(timeoutMs = 8000): Promise<typeof google.maps> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      resolve(window.google.maps)
      return
    }
    const start = Date.now()
    const interval = window.setInterval(() => {
      if (window.google && window.google.maps) {
        window.clearInterval(interval)
        resolve(window.google.maps)
      } else if (Date.now() - start > timeoutMs) {
        window.clearInterval(interval)
        reject(
          new Error(
            "Google Maps API didn't load. Check VITE_GOOGLE_MAPS_API_KEY and that the Maps JavaScript API is enabled for this domain in the Cloud console.",
          ),
        )
      }
    }, 100)
  })
}
