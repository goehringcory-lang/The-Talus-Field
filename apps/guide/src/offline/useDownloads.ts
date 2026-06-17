// =============================================================================
// Download manager state.
//
// Downloads run in page context: the Cache API is shared with the service
// worker, so the page can fill the same caches the SW serves from, which
// gives real progress without a SW message protocol. Completion is recorded
// in localStorage and re-verified against the Cache API on mount, because
// browsers (iOS Safari especially) can evict caches behind our back — a pack
// that fails verification is surfaced as needing re-download.
// =============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildPacks, type Pack } from './manifest'

const STORAGE_KEY = 'tfg.downloads'
const CONCURRENCY = 6
const VERIFY_SAMPLE = 8

export type PackStatus =
  | { state: 'idle' }
  | { state: 'downloading'; done: number; total: number }
  | { state: 'done' }
  | { state: 'stale' } // marked done previously but cache verification failed
  | { state: 'error'; message: string }

type CompletionMap = Record<string, true>

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

function cachesAvailable(): boolean {
  return typeof window !== 'undefined' && 'caches' in window
}

/** Spot-check a sample of a pack's URLs against the Cache API. */
async function verifyPack(pack: Pack): Promise<boolean> {
  if (!cachesAvailable()) return false
  const cache = await caches.open(pack.cacheName)
  const step = Math.max(1, Math.floor(pack.urls.length / VERIFY_SAMPLE))
  for (let i = 0; i < pack.urls.length; i += step) {
    const hit = await cache.match(pack.urls[i])
    if (!hit) return false
  }
  return true
}

export function useDownloads() {
  const packs = useMemo(() => buildPacks(), [])
  const [statuses, setStatuses] = useState<Record<string, PackStatus>>(() => {
    const completed = readCompleted()
    return Object.fromEntries(
      packs.map((p) => [p.id, completed[p.id] ? { state: 'done' } : { state: 'idle' }]),
    )
  })
  const [storageEstimate, setStorageEstimate] = useState<{ usage: number; quota: number } | null>(null)
  const abortRef = useRef<Record<string, AbortController>>({})

  const setPackStatus = useCallback((id: string, status: PackStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }))
  }, [])

  // Re-verify completed packs against the Cache API on mount.
  useEffect(() => {
    let cancelled = false
    const completed = readCompleted()
    for (const pack of packs) {
      if (!completed[pack.id]) continue
      verifyPack(pack).then((ok) => {
        if (cancelled || ok) return
        setPackStatus(pack.id, { state: 'stale' })
      })
    }
    return () => {
      cancelled = true
    }
  }, [packs, setPackStatus])

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

      // Ask the browser not to evict our caches under storage pressure.
      try {
        await navigator.storage?.persist?.()
      } catch {
        /* persistence is a hint; downloads proceed without it */
      }

      const controller = new AbortController()
      abortRef.current[pack.id] = controller
      const total = pack.urls.length
      let done = 0
      setPackStatus(pack.id, { state: 'downloading', done, total })

      const cache = await caches.open(pack.cacheName)
      const queue = [...pack.urls]
      let failed = 0

      async function worker() {
        while (queue.length > 0) {
          if (controller.signal.aborted) return
          const url = queue.shift()
          if (!url) return
          try {
            const cached = await cache.match(url)
            if (!cached) {
              const res = await fetch(url, { signal: controller.signal })
              if (res.ok) await cache.put(url, res)
              else failed++
            }
          } catch {
            if (controller.signal.aborted) return
            failed++
          }
          done++
          setPackStatus(pack.id, { state: 'downloading', done, total })
        }
      }

      await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))
      delete abortRef.current[pack.id]

      if (controller.signal.aborted) {
        setPackStatus(pack.id, { state: 'idle' })
        return
      }

      // A few missing tiles at the bbox edge shouldn't fail the whole pack.
      if (failed > total * 0.05) {
        setPackStatus(pack.id, {
          state: 'error',
          message: 'Some files failed to download. Check your connection and try again.',
        })
        return
      }

      const completed = readCompleted()
      completed[pack.id] = true
      writeCompleted(completed)
      setPackStatus(pack.id, { state: 'done' })
      refreshEstimate()
    },
    [refreshEstimate, setPackStatus],
  )

  const cancel = useCallback((packId: string) => {
    abortRef.current[packId]?.abort()
  }, [])

  const remove = useCallback(
    async (pack: Pack) => {
      if (!cachesAvailable()) return
      const cache = await caches.open(pack.cacheName)
      await Promise.all(pack.urls.map((url) => cache.delete(url)))
      const completed = readCompleted()
      delete completed[pack.id]
      writeCompleted(completed)
      setPackStatus(pack.id, { state: 'idle' })
      refreshEstimate()
    },
    [refreshEstimate, setPackStatus],
  )

  return { packs, statuses, storageEstimate, download, cancel, remove }
}

/** Cheap read for surfaces that only need "is this pack downloaded". */
export function isPackCompleted(packId: string): boolean {
  return Boolean(readCompleted()[packId])
}
