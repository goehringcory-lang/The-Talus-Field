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
import { canCompletePack, fetchPackFile, verifyCachedPack } from './cache'
import { detectPhotoFormat, type PhotoFormat } from '../utils/photo'

const STORAGE_KEY = 'tfg.downloads'
const CONCURRENCY = 6

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

/** Verify the current manifest, including new URLs after an app update. */
async function verifyPack(pack: Pack, missing: Set<string>): Promise<boolean> {
  if (!cachesAvailable()) return false
  try {
    return await verifyCachedPack(await caches.open(pack.cacheName), pack, missing)
  } catch {
    // Storage can be present but refuse reads (private mode or pressure).
    return false
  }
}

// --- Module-level live state -------------------------------------------------

let moduleStatuses: Record<string, PackStatus> | null = null
const controllers: Record<string, AbortController> = {}
type DownloadOutcome = 'done' | 'error' | 'cancelled'
const activeDownloads: Record<string, Promise<DownloadOutcome> | undefined> = {}
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
          // The cache lost files behind our back (iOS eviction, cleared site
          // data). Clear the stored completion too: isPackCompleted() feeds
          // Home's "works in airplane mode" line and the map's Downloaded
          // badge, and a flag the cache no longer backs would keep both
          // claiming an offline capability the device does not have. Only
          // when the Cache API is actually present — its absence proves
          // nothing about what a normal window still holds.
          if (cachesAvailable()) {
            const latest = readCompleted()
            if (latest[pack.id]) {
              delete latest[pack.id]
              writeCompleted(latest)
            }
          }
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

  // Resolves with the outcome so a batch caller ("Download everything") can
  // tell a cancel from a finish and stop instead of marching into the next
  // pack the user just tried to escape.
  const download = useCallback(
    async function download(pack: Pack): Promise<DownloadOutcome> {
      // Share the actual outcome, not a 'skipped' placeholder: a corridor
      // must wait for an already-running overview before it can finish.
      if (activeDownloads[pack.id]) return activeDownloads[pack.id]!
      const run = Promise.resolve().then(async (): Promise<DownloadOutcome> => {
        if (!cachesAvailable()) {
          setPackStatus(pack.id, { state: 'error', message: 'Offline storage is not available in this browser.' })
          return 'error'
        }

        // A corridor map without the overview under it draws trailhead-scale
        // tiles into a blank park, so the overview comes first, once. Its own
        // row shows the progress; a failure or a cancel there stops this one.
        if (pack.requires) {
          const required = packs.find((p) => p.id === pack.requires)
          const entry = readCompleted()[pack.requires]
          if (required && (!entry || !(await verifyPack(required, knownMissing(entry))))) {
            const outcome = await download(required)
            if (outcome !== 'done') return outcome
          }
        }

        const controller = new AbortController()
        controllers[pack.id] = controller
        const total = pack.urls.length
        let done = 0
        const previous = readCompleted()
        delete previous[pack.id]
        writeCompleted(previous)
        setPackStatus(pack.id, { state: 'downloading', done, total })

        // Everything past the controller registration runs guarded: caches.open
        // itself rejects on iOS Safari under storage pressure, and an escape
        // from here used to leave a live controller in module state plus a
        // frozen 0% status, so the "already running" guard above blocked every
        // retry until a full reload.
        try {
          // Ask the browser not to evict our caches under storage pressure.
          try {
            await navigator.storage?.persist?.()
          } catch {
            /* persistence is a hint; downloads proceed without it */
          }

          const cache = await caches.open(pack.cacheName)
          const queue = [...pack.urls]
          let failedUrls: string[] = []
          // Storage-full failures get named: "check your connection" on a full
          // device sends the buyer retrying something that can never succeed.
          let quotaHit = false

          function noteFailure(err: unknown) {
            if (err instanceof DOMException && err.name === 'QuotaExceededError') {
              quotaHit = true
            }
          }

          const absentTiles = new Set<string>()
          async function fetchIntoCache(url: string): Promise<boolean> {
            // A retry's latest result wins: a 404 followed by a connection
            // failure is not evidence that the missing tile is optional.
            absentTiles.delete(url)
            const result = await fetchPackFile(cache, url, controller.signal)
            if (result === 'absent') absentTiles.add(url)
            return result === 'cached'
          }

          async function worker() {
            while (queue.length > 0) {
              if (controller.signal.aborted) return
              const url = queue.shift()
              if (!url) return
              try {
                if (!(await fetchIntoCache(url))) failedUrls.push(url)
              } catch (err) {
                if (controller.signal.aborted) return
                noteFailure(err)
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
              } catch (err) {
                if (controller.signal.aborted) break
                noteFailure(err)
                failedUrls.push(url)
              }
            }
          }

          if (controller.signal.aborted) {
            setPackStatus(pack.id, { state: 'idle' })
            return 'cancelled'
          }

          if (!canCompletePack(pack, failedUrls, absentTiles)) {
            setPackStatus(pack.id, {
              state: 'error',
              message: quotaHit
                ? 'This device is out of storage space. Free some up, then try again.'
                : `${failedUrls.length} of ${total} files didn't download. Check your connection and try again.`,
            })
            return 'error'
          }

          const completed = readCompleted()
          completed[pack.id] = failedUrls.length > 0 ? { failedUrls } : true
          writeCompleted(completed)
          setPackStatus(pack.id, { state: 'done' })
          refreshEstimate()
          return 'done'
        } catch {
          // A cancel is not a failure: it lands as idle exactly as it does above.
          if (controller.signal.aborted) {
            setPackStatus(pack.id, { state: 'idle' })
            return 'cancelled'
          }
          setPackStatus(pack.id, {
            state: 'error',
            message: 'Offline storage is unavailable right now. Try again in a moment.',
          })
          return 'error'
        } finally {
          delete controllers[pack.id]
        }
      })
      activeDownloads[pack.id] = run
      try {
        return await run
      } finally {
        delete activeDownloads[pack.id]
      }
    },
    [packs, refreshEstimate, setPackStatus],
  )

  const cancel = useCallback((packId: string) => {
    controllers[packId]?.abort()
  }, [])

  /** Downloaded packs that require this one, which keep it from being deleted. */
  const dependentsOf = useCallback(
    (packId: string): Pack[] => {
      const completed = readCompleted()
      return packs.filter((p) => p.requires === packId && (completed[p.id] || activeDownloads[p.id]))
    },
    [packs],
  )

  const remove = useCallback(
    async (pack: Pack) => {
      if (!cachesAvailable()) return
      if (activeDownloads[pack.id] || dependentsOf(pack.id).length > 0) return
      // Photos are reused across regions and packs share one cache bucket, so
      // deleting this pack's full URL list would silently hole out other
      // still-"Downloaded" packs. Keep anything another completed pack claims.
      const completed = readCompleted()
      const keep = new Set<string>()
      for (const other of packs) {
        if (other.id === pack.id || other.cacheName !== pack.cacheName) continue
        if (!completed[other.id] && !activeDownloads[other.id]) continue
        for (const url of other.urls) keep.add(url)
      }
      const cache = await caches.open(pack.cacheName)
      await Promise.all(pack.urls.filter((url) => !keep.has(url)).map((url) => cache.delete(url)))
      // Re-read before writing back: another pack can complete during those
      // awaits, and writing the map read above would clobber its fresh
      // completed flag (shows Downloaded this session, reverts on relaunch).
      const current = readCompleted()
      delete current[pack.id]
      writeCompleted(current)
      setPackStatus(pack.id, { state: 'idle' })
      refreshEstimate()
    },
    [packs, dependentsOf, refreshEstimate, setPackStatus],
  )

  return { packs, statuses, storageEstimate, download, cancel, remove, dependentsOf }
}

/** Cheap read for surfaces that only need "is this pack downloaded". */
export function isPackCompleted(packId: string): boolean {
  return Boolean(readCompleted()[packId])
}
