// =============================================================================
// Download manager state.
//
// Downloads run in page context: the Cache API is shared with the service
// worker, so the page can fill the same caches the SW serves from, which
// gives real progress without a SW message protocol. Completion is recorded
// in localStorage and re-verified against the Cache API on mount, because
// browsers (iOS Safari especially) can evict caches behind our back — a pack
// that fails verification is surfaced as needing re-download.
//
// Live status and abort controllers are module state, not hook state:
// downloads deliberately outlive component unmount (they fill a shared
// cache, so finishing beats aborting), and a remounted DownloadManager must
// show the in-flight download and keep Cancel working instead of offering a
// duplicate "Download".
// =============================================================================

import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildPacks, type Pack } from './manifest'
import { detectPhotoFormat, type PhotoFormat } from '../utils/photo'

const STORAGE_KEY = 'tfg.downloads'
const CONCURRENCY = 6
const VERIFY_SAMPLE = 8

export type PackStatus =
  | { state: 'idle' }
  | { state: 'downloading'; done: number; total: number }
  | { state: 'done' }
  | { state: 'stale' } // marked done previously but cache verification failed
  | { state: 'error'; message: string }

// `true` is the legacy shape; packs completed with tolerated failures record
// which URLs never landed so verification doesn't demand them forever.
type PackCompletion = true | { failedUrls: string[] }
type CompletionMap = Record<string, PackCompletion>

function readCompleted(): CompletionMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as CompletionMap
    }
  } catch {
    /* unreadable storage counts as nothing downloaded */
  }
  return {}
}

function writeCompleted(map: CompletionMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* non-fatal: cache contents still exist, only the flag is lost */
  }
}

/** URLs a completed pack is known to be missing (tolerated at download time). */
function knownMissing(entry: PackCompletion | undefined): Set<string> {
  if (entry && entry !== true && Array.isArray(entry.failedUrls)) {
    return new Set(entry.failedUrls)
  }
  return new Set()
}

function cachesAvailable(): boolean {
  return typeof window !== 'undefined' && 'caches' in window
}

/** Spot-check a sample of a pack's URLs against the Cache API. URLs the
 * download already tolerated as missing (tile-pack bbox edges) are skipped —
 * demanding them would flag the pack "stale" on every mount, and
 * re-downloading can never satisfy the check. */
async function verifyPack(pack: Pack, missing: Set<string>): Promise<boolean> {
  if (!cachesAvailable()) return false
  const cache = await caches.open(pack.cacheName)
  const step = Math.max(1, Math.floor(pack.urls.length / VERIFY_SAMPLE))
  for (let i = 0; i < pack.urls.length; i += step) {
    const url = pack.urls[i]
    if (missing.has(url)) continue
    const hit = await cache.match(url)
    if (!hit) return false
  }
  return true
}

// --- Module-level live state -------------------------------------------------

let moduleStatuses: Record<string, PackStatus> | null = null
const controllers: Record<string, AbortController> = {}
const statusSubscribers = new Set<() => void>()

function initModuleStatuses(packs: Pack[]): Record<string, PackStatus> {
  if (!moduleStatuses) {
    const completed = readCompleted()
    moduleStatuses = Object.fromEntries(
      packs.map((p) => [p.id, completed[p.id] ? { state: 'done' } : { state: 'idle' }]),
    )
  }
  return moduleStatuses
}

function setModuleStatus(id: string, status: PackStatus) {
  moduleStatuses = { ...(moduleStatuses ?? {}), [id]: status }
  for (const fn of statusSubscribers) fn()
}

export function useDownloads() {
  // Packs fetch only the image format this device renders. Default to jpg (it
  // decodes everywhere) until the async probe resolves — a hair after mount,
  // well before a user reads the page and taps Download — then rebuild leaner.
  const [photoFormat, setPhotoFormat] = useState<PhotoFormat>('jpg')
  // Verification must wait for the probe: verifying the jpg-default pack URLs
  // on a device that downloaded AVIF/WebP packs misses the cache and would
  // flag intact packs "stale".
  const [formatReady, setFormatReady] = useState(false)
  useEffect(() => {
    let active = true
    void detectPhotoFormat().then((f) => {
      if (active) {
        setPhotoFormat(f)
        setFormatReady(true)
      }
    })
    return () => {
      active = false
    }
  }, [])
  const packs = useMemo(() => buildPacks(photoFormat), [photoFormat])
  const [statuses, setStatuses] = useState<Record<string, PackStatus>>(() =>
    initModuleStatuses(packs),
  )
  const [storageEstimate, setStorageEstimate] = useState<{ usage: number; quota: number } | null>(null)

  useEffect(() => {
    const refresh = () => {
      if (moduleStatuses) setStatuses(moduleStatuses)
    }
    statusSubscribers.add(refresh)
    // Catch status changes that landed between first render and subscribe.
    refresh()
    return () => {
      statusSubscribers.delete(refresh)
    }
  }, [])

  const setPackStatus = useCallback((id: string, status: PackStatus) => {
    setModuleStatus(id, status)
  }, [])

  // Re-verify completed packs against the Cache API on mount, once the photo
  // format is known (see formatReady above).
  useEffect(() => {
    if (!formatReady) return
    let cancelled = false
    const completed = readCompleted()
    for (const pack of packs) {
      const entry = completed[pack.id]
      if (!entry) continue
      // A re-download in flight must not have its progress stomped by a
      // verification of the previous (stale) contents.
      if (moduleStatuses?.[pack.id]?.state === 'downloading') continue
      verifyPack(pack, knownMissing(entry)).then((ok) => {
        if (cancelled) return
        const current = moduleStatuses?.[pack.id]?.state
        if (current === 'downloading') return
        if (!ok) {
          setPackStatus(pack.id, { state: 'stale' })
        } else if (current === 'stale') {
          // A pass after an earlier false alarm restores the pack.
          setPackStatus(pack.id, { state: 'done' })
        }
      })
    }
    return () => {
      cancelled = true
    }
  }, [packs, formatReady, setPackStatus])

  const refreshEstimate = useCallback(() => {
    if (!('storage' in navigator) || !navigator.storage.estimate) return
    navigator.storage.estimate().then((est) => {
      setStorageEstimate({ usage: est.usage ?? 0, quota: est.quota ?? 0 })
    }).catch(() => { /* estimate is best-effort UI */ })
  }, [])

  useEffect(() => {
    refreshEstimate()
  }, [refreshEstimate])

  const download = useCallback(
    async (pack: Pack) => {
      if (!cachesAvailable()) {
        setPackStatus(pack.id, { state: 'error', message: 'Offline storage is not available in this browser.' })
        return
      }

      // Already running (possibly started by a since-unmounted instance).
      if (controllers[pack.id]) return

      // Ask the browser not to evict our caches under storage pressure.
      try {
        await navigator.storage?.persist?.()
      } catch {
        /* persistence is a hint; downloads proceed without it */
      }

      const controller = new AbortController()
      controllers[pack.id] = controller
      const total = pack.urls.length
      let done = 0
      setPackStatus(pack.id, { state: 'downloading', done, total })

      const cache = await caches.open(pack.cacheName)
      const queue = [...pack.urls]
      let failedUrls: string[] = []

      async function fetchIntoCache(url: string): Promise<boolean> {
        const cached = await cache.match(url)
        if (cached) return true
        const res = await fetch(url, { signal: controller.signal })
        // The SPA _redirects fallback answers a missing file with the HTML
        // shell and a 200. Caching that under a photo/tile URL poisons a
        // deploy-surviving cache (the SW's activate handler exists to clean
        // exactly this up), so count it as a failed URL instead.
        const type = res.headers.get('content-type')
        if (!res.ok || (type && type.includes('text/html'))) return false
        await cache.put(url, res)
        return true
      }

      async function worker() {
        while (queue.length > 0) {
          if (controller.signal.aborted) return
          const url = queue.shift()
          if (!url) return
          try {
            if (!(await fetchIntoCache(url))) failedUrls.push(url)
          } catch {
            if (controller.signal.aborted) return
            failedUrls.push(url)
          }
          done++
          setPackStatus(pack.id, { state: 'downloading', done, total })
        }
      }

      await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

      // One sequential retry pass: a transient hiccup shouldn't surface as a
      // failed pack, and a paid offline product must not record "done" over
      // silently missing files.
      if (!controller.signal.aborted && failedUrls.length > 0) {
        const retry = failedUrls
        failedUrls = []
        for (const url of retry) {
          if (controller.signal.aborted) break
          try {
            if (!(await fetchIntoCache(url))) failedUrls.push(url)
          } catch {
            if (controller.signal.aborted) break
            failedUrls.push(url)
          }
        }
      }

      delete controllers[pack.id]

      if (controller.signal.aborted) {
        setPackStatus(pack.id, { state: 'idle' })
        return
      }

      if (failedUrls.length > total * pack.tolerateMissing) {
        setPackStatus(pack.id, {
          state: 'error',
          message: `${failedUrls.length} of ${total} files didn't download. Check your connection and try again.`,
        })
        return
      }

      const completed = readCompleted()
      completed[pack.id] = failedUrls.length > 0 ? { failedUrls } : true
      writeCompleted(completed)
      setPackStatus(pack.id, { state: 'done' })
      refreshEstimate()
    },
    [refreshEstimate, setPackStatus],
  )

  const cancel = useCallback((packId: string) => {
    controllers[packId]?.abort()
  }, [])

  const remove = useCallback(
    async (pack: Pack) => {
      if (!cachesAvailable()) return
      // Photos are reused across regions and packs share one cache bucket, so
      // deleting this pack's full URL list would silently hole out other
      // still-"Downloaded" packs. Keep anything another completed pack claims.
      const completed = readCompleted()
      const keep = new Set<string>()
      for (const other of packs) {
        if (other.id === pack.id || other.cacheName !== pack.cacheName) continue
        if (!completed[other.id]) continue
        for (const url of other.urls) keep.add(url)
      }
      const cache = await caches.open(pack.cacheName)
      await Promise.all(pack.urls.filter((url) => !keep.has(url)).map((url) => cache.delete(url)))
      delete completed[pack.id]
      writeCompleted(completed)
      setPackStatus(pack.id, { state: 'idle' })
      refreshEstimate()
    },
    [packs, refreshEstimate, setPackStatus],
  )

  return { packs, statuses, storageEstimate, download, cancel, remove }
}

/** Cheap read for surfaces that only need "is this pack downloaded". */
export function isPackCompleted(packId: string): boolean {
  return Boolean(readCompleted()[packId])
}
