// =============================================================================
// useTrack — loads a hike's track file. Track JSONs are static assets served
// cache-first by the service worker's runtime cache (they match the /tracks/
// runtime pattern), so once the Trail tracks pack (or a prior visit) has
// cached them they resolve in airplane mode. The ?v= content hash on the URL
// busts the cache when tracks are regenerated. A direct Cache API fallback
// covers the SW-not-yet-controlling case (first visit, hard reload).
// =============================================================================

import { useEffect, useState } from 'react'
import { Track, type TrackT } from './schema'
import { hasTrack, trackUrl } from './track'

export type TrackState =
  | { status: 'none' }      // hike has no verified track
  | { status: 'loading' }
  | { status: 'ready'; track: TrackT }
  | { status: 'error' }     // offline with nothing cached, or a bad payload

const memory = new Map<string, TrackT>()

async function loadTrack(hikeId: string): Promise<TrackT> {
  const cached = memory.get(hikeId)
  if (cached) return cached
  const url = trackUrl(hikeId)
  let raw: unknown
  try {
    const res = await fetch(url)
    const type = res.headers.get('content-type')
    // The SPA _redirects fallback answers a missing file with HTML and a 200;
    // treat it as missing, never parse it.
    if (!res.ok || (type && type.includes('text/html'))) throw new Error(`bad response for ${url}`)
    raw = await res.json()
  } catch (err) {
    // SW not controlling yet (first load) but the pack may be downloaded:
    // consult the Cache API directly before giving up.
    if (typeof caches === 'undefined') throw err
    const hit = await caches.match(url)
    if (!hit) throw err
    raw = await hit.json()
  }
  const track = Track.parse(raw)
  memory.set(hikeId, track)
  return track
}

export function useTrack(hikeId: string | undefined): TrackState {
  const [state, setState] = useState<TrackState>(() =>
    hikeId && hasTrack(hikeId) ? { status: 'loading' } : { status: 'none' },
  )

  useEffect(() => {
    let cancelled = false
    // Deferred so no state update runs synchronously inside the effect body
    // (house pattern, same as usePrograms and the Map URL-restore effect).
    Promise.resolve().then(async () => {
      if (cancelled) return
      if (!hikeId || !hasTrack(hikeId)) {
        setState((prev) => (prev.status === 'none' ? prev : { status: 'none' }))
        return
      }
      setState({ status: 'loading' })
      try {
        const track = await loadTrack(hikeId)
        if (!cancelled) setState({ status: 'ready', track })
      } catch {
        if (!cancelled) setState({ status: 'error' })
      }
    })
    return () => {
      cancelled = true
    }
  }, [hikeId])

  return state
}
