// =============================================================================
// TripAgenda — the trip plan drawn as a calendar board, one full-width day
// after another. Blocks are sized by how long the thing takes (a full-day
// hike is a tall slab, a one-hour ranger walk is a sliver) and colored by
// what it is (see trip/agendaItem.ts), so the shape of a day is readable
// before any of the words are.
//
// Direct manipulation, because a plan is a spatial thing:
//   - press and hold a block, then drag it to move it in time, or onto
//     another day's timeline to move it across days
//   - drag the handle at a block's bottom edge to make it longer or shorter
//   - arrow keys do the same thing without a pointer (see onBlockKeyDown)
// Dropping a block pins it: the day's greedy auto-slotting stops moving it.
//
// Everything here is local. The plan lives in localStorage (tfg.trip.plan),
// the content is bundled, and no edit on this board touches the network, so
// the board works in the park with the radio off. The calendar export stays
// where it was, below the board.
// =============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  coordLabel,
  directionsUrl,
  itemInfo,
  tonesInPlan,
  type AgendaTone,
} from '../trip/agendaItem'
import {
  clamp,
  clockLabel,
  dayWindowFor,
  durationLabel,
  hourMarks,
  layoutDay,
  snapMinutes,
  type DayWindow,
  type Placed,
} from '../trip/agendaLayout'
import { driveMinutesBetween, toHhmm, type SlottedItem } from '../trip/slotting'
import { hikeItemId, stopItemId, type TripItemT } from '../trip/schema'
import { useTripPlan } from '../trip/useTripPlan'
import { addDaysIso, formatDayHeader, parkNowMinutes, todayIso } from '../utils/date'
import './TripAgenda.css'

// Vertical scale. "Normal" puts an hour at ~87px, so a one-hour program is
// about an eighth of a phone screen and an eight-hour hike fills one.
type Density = 'compact' | 'normal' | 'roomy'
const PX_PER_MIN: Record<Density, number> = { compact: 0.85, normal: 1.45, roomy: 2.2 }
const DENSITY_LABEL: Record<Density, string> = { compact: 'Compact', normal: 'Normal', roomy: 'Roomy' }
const DENSITY_ORDER: Density[] = ['compact', 'normal', 'roomy']
const DENSITY_KEY = 'tfg.trip.density'

const LONG_PRESS_MS = 200   // press-and-hold before a touch drag lifts
const MOVE_CANCEL_PX = 12   // finger travelled this far first: it's a scroll
const MOUSE_LIFT_PX = 4
const MIN_DURATION_MIN = 15
const MIN_BLOCK_PX = 34
const EDGE_PX = 96          // auto-scroll band at the top and bottom of the viewport
const EDGE_SPEED = 16

function readDensity(): Density {
  try {
    const stored = window.localStorage.getItem(DENSITY_KEY)
    if (stored === 'compact' || stored === 'normal' || stored === 'roomy') return stored
  } catch {
    /* storage-denied browsers just get the default */
  }
  return 'normal'
}

function writeDensity(density: Density) {
  try {
    window.localStorage.setItem(DENSITY_KEY, density)
  } catch {
    /* non-fatal: the zoom level just won't persist */
  }
}

/**
 * Where a placement is really stored. A day's timeline runs past midnight (see
 * agendaLayout's LATEST), so a block can be dropped at 00:30 of the following
 * morning; toHhmm wraps the clock, and without moving the date with it the
 * block is written back to 00:30 of the same day, 24 hours earlier than where
 * it was dropped.
 */
function placement(day: string, startMin: number): { day: string; time: string } {
  const rollover = Math.floor(startMin / 1440)
  return { day: rollover > 0 ? addDaysIso(day, rollover) : day, time: toHhmm(startMin) }
}

/** The itemId a stop or hike carries after moving to another day: those ids
 * embed the day, so placeItem mints a new one and the old DOM node unmounts. */
function movedItemId(item: TripItemT, day: string): string {
  if (item.type === 'hike') return hikeItemId(item.hikeId, day)
  if (item.type === 'stop') return stopItemId(item.stopId, day)
  return item.itemId
}

function dayParts(day: string): { weekday: string; dayNum: string; month: string } {
  const d = new Date(`${day}T12:00:00Z`)
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    dayNum: d.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' }),
    month: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
  }
}

/** The live drag. `startMin`/`durationMin`/`day` are the proposed placement. */
type Drag = {
  itemId: string
  mode: 'move' | 'resize'
  pointerId: number
  /** Minutes between the block's start and where the pointer grabbed it. */
  grabMin: number
  day: string
  startMin: number
  durationMin: number
}

/** A press that hasn't become a drag yet: a tap, or a scroll about to start. */
type Pending = Drag & { x: number; y: number; timer: number | null }

/**
 * A finger that started on a block and moved before the hold completed, so it
 * is a scroll rather than a drag. Blocks carry touch-action: none — the only
 * way Chrome and Safari will let a held block be dragged instead of handing
 * the gesture to the scroller mid-drag (it fires pointercancel the moment it
 * does) — which means the page scroll for those touches is ours to do.
 */
type Pan = { pointerId: number; lastY: number; vy: number; lastT: number }

type Props = {
  slotted: Map<string, SlottedItem[]>
  windowDays: string[]
  dayForecasts?: Map<string, string>
}

export default function TripAgenda({ slotted, windowDays, dayForecasts }: Props) {
  const { plan, placeItem, setItemDuration, setStopTime, removeItem } = useTripPlan()
  const [density, setDensity] = useState<Density>(readDensity)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [nowMin, setNowMin] = useState(parkNowMinutes)
  // A keyboard edit moves a block silently: the block's own aria-label changes
  // underneath the focus, which a screen reader will not re-read. This is what
  // it says out loud instead.
  const [announcement, setAnnouncement] = useState('')

  const pxPerMin = PX_PER_MIN[density]
  const today = todayIso()

  const trackRefs = useRef(new Map<string, HTMLDivElement>())
  const dragRef = useRef<Drag | null>(null)
  const pendingRef = useRef<Pending | null>(null)
  const pointRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const panRef = useRef<Pan | null>(null)
  const flingRef = useRef<number | null>(null)
  const draggedRef = useRef(false) // suppresses the click that follows a drag
  const pxPerMinRef = useRef(pxPerMin)
  const windowsRef = useRef(new Map<string, DayWindow>())
  // A keyboard move across days unmounts the focused block (its section, and
  // for stops and hikes its itemId, both change), dropping focus to <body> so
  // further arrow presses do nothing. This carries the id to focus after the
  // re-render.
  const refocusRef = useRef<string | null>(null)

  // Every day in the trip window gets a timeline, even an empty one: an empty
  // day you can't drop onto isn't a plan surface, it's a gap.
  const days = useMemo(() => {
    const set = new Set<string>([...windowDays, ...slotted.keys()])
    return [...set].sort()
  }, [windowDays, slotted])

  const layouts = useMemo(() => {
    const out = new Map<string, ReturnType<typeof layoutDay>>()
    for (const day of days) out.set(day, layoutDay(slotted.get(day) ?? []))
    return out
  }, [days, slotted])

  const windows = useMemo(() => {
    const out = new Map<string, DayWindow>()
    for (const day of days) out.set(day, dayWindowFor(layouts.get(day)?.placed ?? []))
    return out
  }, [days, layouts])

  useEffect(() => {
    pxPerMinRef.current = pxPerMin
  }, [pxPerMin])
  useEffect(() => {
    windowsRef.current = windows
  }, [windows])

  // The "now" rule only matters while the app is open on the trip's own day.
  useEffect(() => {
    const id = window.setInterval(() => setNowMin(parkNowMinutes()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  const itemsById = useMemo(() => {
    const out = new Map<string, TripItemT>()
    for (const item of plan.items) out.set(item.itemId, item)
    return out
  }, [plan.items])

  const dragItem = drag ? itemsById.get(drag.itemId) : undefined

  // --- drag machinery -------------------------------------------------------

  const updateDrag = useCallback((next: Drag | null) => {
    dragRef.current = next
    setDrag(next)
  }, [])

  const cancelPending = useCallback(() => {
    const p = pendingRef.current
    if (p?.timer !== null && p?.timer !== undefined) window.clearTimeout(p.timer)
    pendingRef.current = null
  }, [])

  const stopFling = useCallback(() => {
    if (flingRef.current !== null) cancelAnimationFrame(flingRef.current)
    flingRef.current = null
  }, [])

  // Coasting after a swipe that started on a block. Native momentum isn't
  // available to us here (see Pan), and a scroll that stops dead at the
  // fingertip reads as a stuck page.
  const startFling = useCallback((velocity: number) => {
    let v = clamp(velocity, -4, 4) // px per ms
    if (Math.abs(v) < 0.08) return
    let last = performance.now()
    const step = () => {
      const now = performance.now()
      const dt = Math.min(48, now - last)
      last = now
      window.scrollBy(0, v * dt)
      v *= Math.pow(0.994, dt)
      flingRef.current = Math.abs(v) > 0.02 ? requestAnimationFrame(step) : null
    }
    flingRef.current = requestAnimationFrame(step)
  }, [])

  /** Recompute the proposed placement from a viewport Y (pointer or autoscroll). */
  const applyPoint = useCallback((clientY: number) => {
    const d = dragRef.current
    if (!d) return
    const perMin = pxPerMinRef.current

    if (d.mode === 'resize') {
      const track = trackRefs.current.get(d.day)
      const win = windowsRef.current.get(d.day)
      if (!track || !win) return
      const rect = track.getBoundingClientRect()
      const endMin = win.from + (clientY - rect.top) / perMin
      const max = Math.max(MIN_DURATION_MIN, win.to - d.startMin)
      const durationMin = clamp(snapMinutes(endMin - d.startMin), MIN_DURATION_MIN, max)
      if (durationMin !== d.durationMin) updateDrag({ ...d, durationMin })
      return
    }

    // Which day's timeline is under the pointer? Falling back to the current
    // target keeps a drag that strays into a day header from snapping away.
    let targetDay = d.day
    for (const [day, el] of trackRefs.current) {
      const rect = el.getBoundingClientRect()
      if (clientY >= rect.top && clientY <= rect.bottom) {
        targetDay = day
        break
      }
    }
    const track = trackRefs.current.get(targetDay)
    const win = windowsRef.current.get(targetDay)
    if (!track || !win) return
    const rect = track.getBoundingClientRect()
    const raw = win.from + (clientY - rect.top) / perMin - d.grabMin
    // A block may be dropped so its tail runs past the drawn window: the day
    // redraws around the new placement, so the timeline grows to fit rather
    // than refusing the drop. Keeping an hour of the block inside the window
    // is what stops it being dragged out of sight entirely.
    const latestStart = Math.max(win.from, win.to - Math.min(d.durationMin, 60))
    const startMin = clamp(snapMinutes(raw), win.from, latestStart)
    if (startMin !== d.startMin || targetDay !== d.day) {
      updateDrag({ ...d, day: targetDay, startMin })
    }
  }, [updateDrag])

  const lift = useCallback(() => {
    const p = pendingRef.current
    if (!p) return
    pendingRef.current = { ...p, timer: null }
    draggedRef.current = true
    updateDrag({
      itemId: p.itemId,
      mode: p.mode,
      pointerId: p.pointerId,
      grabMin: p.grabMin,
      day: p.day,
      startMin: p.startMin,
      durationMin: p.durationMin,
    })
    setExpandedId(null)
    if (typeof navigator.vibrate === 'function') navigator.vibrate(8)
    applyPoint(pointRef.current.y)
  }, [applyPoint, updateDrag])

  // One set of window-level listeners for the whole board: pointer capture on
  // individual blocks would be lost the moment a drag crosses into another
  // day's track.
  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      pointRef.current = { x: e.clientX, y: e.clientY }
      const d = dragRef.current
      if (d) {
        if (e.pointerId === d.pointerId) applyPoint(e.clientY)
        return
      }

      const p = pendingRef.current
      if (p && e.pointerId === p.pointerId) {
        const dx = Math.abs(e.clientX - p.x)
        const dy = Math.abs(e.clientY - p.y)
        if (p.timer !== null) {
          // Still waiting out the hold: this much travel is a scroll, not a
          // drag. The block swallowed the touch, so scroll the page ourselves.
          if (dx <= MOVE_CANCEL_PX && dy <= MOVE_CANCEL_PX) return
          cancelPending()
          panRef.current = { pointerId: e.pointerId, lastY: p.y, vy: 0, lastT: performance.now() }
        } else if (dx > MOUSE_LIFT_PX || dy > MOUSE_LIFT_PX) {
          lift()
          return
        } else {
          return
        }
      }

      const pan = panRef.current
      if (pan && e.pointerId === pan.pointerId) {
        const delta = pan.lastY - e.clientY
        const now = performance.now()
        const dt = Math.max(1, now - pan.lastT)
        window.scrollBy(0, delta)
        pan.vy = delta / dt
        pan.lastY = e.clientY
        pan.lastT = now
      }
    }

    function onPointerUp(e: PointerEvent) {
      const d = dragRef.current
      if (d && e.pointerId === d.pointerId) {
        if (d.mode === 'resize') setItemDuration(d.itemId, d.durationMin)
        else {
          const at = placement(d.day, d.startMin)
          placeItem(d.itemId, at.day, at.time)
        }
        updateDrag(null)
        // The click that follows the release is not a tap on the block.
        window.setTimeout(() => {
          draggedRef.current = false
        }, 0)
      }
      const pan = panRef.current
      if (pan && e.pointerId === pan.pointerId) {
        // A swipe that ends more than a moment after the last move is a park,
        // not a flick.
        if (performance.now() - pan.lastT < 90) startFling(pan.vy)
        panRef.current = null
      }
      cancelPending()
    }

    function onPointerCancel() {
      cancelPending()
      panRef.current = null
      updateDrag(null)
      draggedRef.current = false
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerCancel)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerCancel)
    }
  }, [applyPoint, cancelPending, lift, placeItem, setItemDuration, startFling, updateDrag])

  useEffect(() => stopFling, [stopFling])

  // Restore focus after a keyboard move re-rendered the block elsewhere.
  useEffect(() => {
    const id = refocusRef.current
    if (!id) return
    refocusRef.current = null
    document.querySelector<HTMLElement>(`[data-item-id="${CSS.escape(id)}"]`)?.focus()
  }, [plan])

  // Auto-scroll while a drag sits near the top or bottom of the viewport, so
  // a block can be carried from one day to a day two screens down.
  useEffect(() => {
    if (!drag) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      return
    }
    const step = () => {
      const y = pointRef.current.y
      const h = window.innerHeight
      let dy = 0
      if (y < EDGE_PX) dy = -Math.ceil(((EDGE_PX - y) / EDGE_PX) * EDGE_SPEED)
      else if (y > h - EDGE_PX) dy = Math.ceil(((y - (h - EDGE_PX)) / EDGE_PX) * EDGE_SPEED)
      if (dy !== 0) {
        window.scrollBy(0, dy)
        applyPoint(y)
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [drag, applyPoint])

  const startPress = useCallback(
    (
      e: React.PointerEvent,
      s: SlottedItem,
      mode: 'move' | 'resize',
      day: string,
      fallbackStart: number,
    ) => {
      if (s.item.type === 'program') return // published times are not ours to move
      if (e.pointerType === 'mouse' && e.button !== 0) return
      stopFling()
      const host = (e.currentTarget as HTMLElement).closest('.ag-block, .ag-chip')
      if (!host) return
      const rect = host.getBoundingClientRect()
      const startMin = s.startMin ?? fallbackStart
      const durationMin = Math.max(MIN_DURATION_MIN, s.durationMin)
      // A chip in the tray has no timeline height, so grab it near its head.
      const grabMin =
        mode === 'resize' || s.startMin === null
          ? Math.min(durationMin / 2, 30)
          : clamp((e.clientY - rect.top) / pxPerMinRef.current, 0, durationMin)
      pointRef.current = { x: e.clientX, y: e.clientY }
      const pending: Pending = {
        itemId: s.item.itemId,
        mode,
        pointerId: e.pointerId,
        grabMin,
        day,
        startMin,
        durationMin,
        x: e.clientX,
        y: e.clientY,
        timer: null,
      }
      pendingRef.current = pending
      // The resize handle is a dedicated target with touch-action: none, so it
      // lifts on contact. A block body waits out the hold on touch, and lifts
      // on the first few pixels of travel with a mouse.
      if (mode === 'resize') lift()
      else if (e.pointerType !== 'mouse') pending.timer = window.setTimeout(lift, LONG_PRESS_MS)
    },
    [lift, stopFling],
  )

  // --- keyboard equivalents -------------------------------------------------

  const nudge = useCallback(
    (s: SlottedItem, day: string, deltaMin: number, win: DayWindow) => {
      if (s.item.type === 'program') return
      const from = s.startMin ?? win.from
      const next = clamp(
        snapMinutes(from + deltaMin),
        win.from,
        Math.max(win.from, win.to - s.durationMin),
      )
      const at = placement(day, next)
      const title = itemInfo(s.item).title
      const range = `${clockLabel(next)} to ${clockLabel(next + s.durationMin)}`
      if (at.day !== day) {
        const newId = movedItemId(s.item, at.day)
        const duplicate = plan.items.some(
          (it) => it.itemId === newId && it.itemId !== s.item.itemId,
        )
        refocusRef.current = newId
        setAnnouncement(
          duplicate
            ? `${title} is already planned on ${formatDayHeader(at.day)}; this copy was removed`
            : `${title}, ${formatDayHeader(at.day)}, ${range}`,
        )
      } else {
        setAnnouncement(`${title}, ${range}`)
      }
      placeItem(s.item.itemId, at.day, at.time)
    },
    [placeItem, plan],
  )

  const resizeBy = useCallback(
    (s: SlottedItem, deltaMin: number) => {
      if (s.item.type === 'program') return
      const durationMin = Math.max(MIN_DURATION_MIN, s.durationMin + deltaMin)
      setItemDuration(s.item.itemId, durationMin)
      setAnnouncement(
        s.startMin !== null
          ? `${itemInfo(s.item).title}, ${clockLabel(s.startMin)} to ${clockLabel(
              s.startMin + durationMin,
            )}, ${durationLabel(durationMin)}`
          : `${itemInfo(s.item).title}, ${durationLabel(durationMin)}`,
      )
    },
    [setItemDuration],
  )

  const shiftDay = useCallback(
    (s: SlottedItem, day: string, step: number) => {
      if (s.item.type === 'program') return
      const index = days.indexOf(day)
      const target = days[clamp(index + step, 0, days.length - 1)]
      if (!target || target === day) return
      const newId = movedItemId(s.item, target)
      const duplicate = plan.items.some((it) => it.itemId === newId && it.itemId !== s.item.itemId)
      refocusRef.current = newId
      setAnnouncement(
        duplicate
          ? `${itemInfo(s.item).title} is already planned on ${formatDayHeader(target)}; this copy was removed`
          : `${itemInfo(s.item).title}, ${formatDayHeader(target)}`,
      )
      placeItem(s.item.itemId, target, s.startMin !== null ? toHhmm(s.startMin) : undefined)
    },
    [days, placeItem, plan],
  )

  function onBlockKeyDown(e: React.KeyboardEvent, s: SlottedItem, day: string, win: DayWindow) {
    if (s.item.type === 'program') return
    const step = e.shiftKey ? 5 : 15
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const delta = e.key === 'ArrowUp' ? -step : step
      if (e.altKey) resizeBy(s, delta)
      else nudge(s, day, delta, win)
    } else if (e.key === 'PageUp' || e.key === '[') {
      e.preventDefault()
      shiftDay(s, day, -1)
    } else if (e.key === 'PageDown' || e.key === ']') {
      e.preventDefault()
      shiftDay(s, day, 1)
    }
  }

  // --- render ---------------------------------------------------------------

  const legend = useMemo(() => tonesInPlan(plan.items), [plan.items])
  const totalItems = plan.items.length

  return (
    <div className="ag">
      <div className="ag-toolbar">
        <ul className="ag-legend" aria-label="What the colors mean">
          {legend.map((tone) => (
            <li className="ag-legend__item" key={tone.id}>
              <span className="ag-legend__swatch" style={swatchStyle(tone)} aria-hidden="true" />
              {tone.label}
            </li>
          ))}
        </ul>
        <div className="ag-zoom" role="group" aria-label="Board zoom">
          {DENSITY_ORDER.map((d) => (
            <button
              key={d}
              type="button"
              className="ag-zoom__btn"
              aria-pressed={density === d}
              onClick={() => {
                setDensity(d)
                writeDensity(d)
              }}
            >
              {DENSITY_LABEL[d]}
            </button>
          ))}
        </div>
      </div>

      <p className="ag-hint">
        Press and hold a block to pick it up, then drag it up, down, or onto another day. Drag the
        bar at its bottom edge to make it longer or shorter. With a keyboard: arrow keys move a
        selected block, Alt with the arrows resizes it, Page&nbsp;Up and Page&nbsp;Down move it a
        day. Every edit saves to this device straight away and works offline.
      </p>

      <p className="sr-only" role="status">
        {announcement}
      </p>

      {days.map((day) => {
        const layout = layouts.get(day)!
        const win = windows.get(day)!
        const marks = hourMarks(win)
        const trackHeight = (win.to - win.from) * pxPerMin
        const outside = day < plan.dates.start || day > plan.dates.end
        const forecast = dayForecasts?.get(day)
        const { weekday, dayNum, month } = dayParts(day)

        // The dragged block is drawn at its proposed spot, not its stored one.
        const placed = layout.placed.filter((p) => p.s.item.itemId !== drag?.itemId)
        const loose = layout.loose.filter((s) => s.item.itemId !== drag?.itemId)
        const plannedMin = layout.placed.reduce((sum, p) => sum + p.s.durationMin, 0)
        const isToday = day === today
        const showNow = isToday && nowMin >= win.from && nowMin <= win.to

        return (
          <section
            className={`ag-day${outside ? ' ag-day--outside' : ''}${
              drag?.day === day ? ' ag-day--target' : ''
            }`}
            key={day}
            aria-label={formatDayHeader(day)}
          >
            <header className="ag-day__bar">
              <span className="ag-day__date">
                <span className="ag-day__weekday">{weekday}</span>
                <span className="ag-day__num">{dayNum}</span>
                <span className="ag-day__month">{month}</span>
              </span>
              <span className="ag-day__facts">
                <span className="ag-day__count">
                  {layout.placed.length + layout.loose.length === 0
                    ? 'Nothing planned'
                    : `${layout.placed.length + layout.loose.length} planned · ${durationLabel(plannedMin)}`}
                  {isToday ? ' · today' : ''}
                  {outside ? ' · outside your dates' : ''}
                </span>
                {forecast && <span className="ag-day__forecast">{forecast}</span>}
              </span>
            </header>

            <div className="ag-grid" style={{ height: trackHeight }}>
              <div className="ag-gutter" aria-hidden="true">
                {marks.map((m) => (
                  <span className="ag-gutter__label" key={m} style={{ top: (m - win.from) * pxPerMin }}>
                    {clockLabel(m)}
                  </span>
                ))}
              </div>
              <div
                className="ag-track"
                ref={(el) => {
                  if (el) trackRefs.current.set(day, el)
                  else trackRefs.current.delete(day)
                }}
              >
                {marks.map((m) => (
                  <span
                    className="ag-rule"
                    key={m}
                    aria-hidden="true"
                    style={{ top: (m - win.from) * pxPerMin }}
                  />
                ))}

                {showNow && (
                  <span
                    className="ag-now"
                    aria-hidden="true"
                    style={{ top: (nowMin - win.from) * pxPerMin }}
                  />
                )}

                {placed.length === 0 && !drag && (
                  <p className="ag-empty">
                    Nothing on this day yet. Drag something here, or add a hike, a program, or a
                    stop from its page.
                  </p>
                )}

                {placed.map((p, i) => {
                  const prev = placed[i - 1]
                  const gapMin = prev ? p.startMin - prev.endMin : 0
                  const drive =
                    prev && prev.lanes === 1 && p.lanes === 1
                      ? driveMinutesBetween(prev.s.item, p.s.item)
                      : null
                  return (
                    <div key={p.s.item.itemId}>
                      {drive !== null && gapMin * pxPerMin >= 26 && (
                        <span
                          className="ag-gap"
                          style={{ top: (prev.endMin - win.from) * pxPerMin, height: gapMin * pxPerMin }}
                        >
                          {drive === 0 ? 'Same parking area' : `~${drive} min drive`}
                        </span>
                      )}
                      <AgendaBlock
                        placed={p}
                        day={day}
                        win={win}
                        pxPerMin={pxPerMin}
                        expanded={expandedId === p.s.item.itemId}
                        onToggle={() => {
                          if (draggedRef.current) return
                          setExpandedId((cur) => (cur === p.s.item.itemId ? null : p.s.item.itemId))
                        }}
                        onPointerDown={(e, mode) => startPress(e, p.s, mode, day, p.startMin)}
                        onKeyDown={(e) => onBlockKeyDown(e, p.s, day, win)}
                        days={days}
                        onPlace={placeItem}
                        onDuration={setItemDuration}
                        onUnpin={() => setStopTime(p.s.item.itemId, undefined)}
                        onRemove={() => removeItem(p.s.item.itemId)}
                      />
                    </div>
                  )
                })}

                {drag && dragItem && drag.day === day && (
                  <DragPreview drag={drag} item={dragItem} win={win} pxPerMin={pxPerMin} />
                )}
              </div>
            </div>

            {loose.length > 0 && (
              <div className="ag-tray">
                <p className="ag-tray__note">
                  No place on this day yet. Drag one onto the timeline, or give it a time below.
                  Left as they are, these go on the calendar as all-day events.
                </p>
                <div className="ag-tray__row">
                  {loose.map((s) => (
                    <TrayChip
                      key={s.item.itemId}
                      s={s}
                      expanded={expandedId === s.item.itemId}
                      onToggle={() => {
                        if (draggedRef.current) return
                        setExpandedId((cur) => (cur === s.item.itemId ? null : s.item.itemId))
                      }}
                      onPointerDown={(e) => startPress(e, s, 'move', day, win.from)}
                      day={day}
                      days={days}
                      onPlace={placeItem}
                      onDuration={setItemDuration}
                      onRemove={() => removeItem(s.item.itemId)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )
      })}

      {totalItems === 0 && (
        <p className="ag-hint">
          The board fills in as you add things: hikes from the trail list, programs from the
          program list, stops from their own pages or the map.
        </p>
      )}
    </div>
  )
}

function swatchStyle(tone: AgendaTone): React.CSSProperties {
  return { '--tone': tone.color } as React.CSSProperties
}

// --- one block on the timeline ----------------------------------------------

type BlockProps = {
  placed: Placed
  day: string
  win: DayWindow
  pxPerMin: number
  expanded: boolean
  onToggle: () => void
  onPointerDown: (e: React.PointerEvent, mode: 'move' | 'resize') => void
  onKeyDown: (e: React.KeyboardEvent) => void
  days: string[]
  onPlace: (itemId: string, day: string, startTime: string | undefined) => void
  onDuration: (itemId: string, durationMin: number | undefined) => void
  onUnpin: () => void
  onRemove: () => void
}

function AgendaBlock({
  placed,
  day,
  win,
  pxPerMin,
  expanded,
  onToggle,
  onPointerDown,
  onKeyDown,
  days,
  onPlace,
  onDuration,
  onUnpin,
  onRemove,
}: BlockProps) {
  const { s, startMin, lane, lanes } = placed
  const info = itemInfo(s.item)
  const height = Math.max(s.durationMin * pxPerMin, MIN_BLOCK_PX)
  const top = (startMin - win.from) * pxPerMin
  const size = height < 46 ? 'xs' : height < 96 ? 'sm' : 'lg'
  const fixedTime = s.item.type === 'program'
  const pinned = s.item.type !== 'program' && !!s.item.startTime
  const timeRange = `${clockLabel(startMin)} – ${clockLabel(startMin + s.durationMin)}`

  return (
    <div
      className={`ag-block ag-block--${size}${fixedTime ? ' ag-block--fixed' : ''}`}
      style={
        {
          top,
          height,
          left: `calc(${(lane * 100) / lanes}% + ${lane ? 3 : 0}px)`,
          width: `calc(${100 / lanes}% - ${lanes > 1 ? 3 : 0}px)`,
          '--tone': info.tone.color,
        } as React.CSSProperties
      }
    >
      <div
        className="ag-block__body"
        role="button"
        tabIndex={0}
        data-item-id={s.item.itemId}
        aria-expanded={expanded}
        aria-label={`${info.title}, ${timeRange}`}
        onPointerDown={(e) => onPointerDown(e, 'move')}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          } else {
            onKeyDown(e)
          }
        }}
      >
        <span className="ag-block__time">
          {timeRange}
          <span className="ag-block__dur">{durationLabel(s.durationMin)}</span>
          {fixedTime && <span className="ag-block__flag">Published time</span>}
          {pinned && <span className="ag-block__flag">Pinned</span>}
        </span>
        <span className="ag-block__title">{info.title}</span>
        {size === 'lg' && info.meta.length > 0 && (
          <span className="ag-block__meta">
            {info.meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </span>
        )}
        {size === 'lg' && info.coord && (
          <span className="ag-block__coord mono">{coordLabel(info.coord)}</span>
        )}
      </div>

      {size === 'lg' && info.coord && (
        <a
          className="ag-block__nav"
          href={directionsUrl(info.coord)}
          target="_blank"
          rel="noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
        >
          Directions →
        </a>
      )}

      {!fixedTime && (
        <span
          className="ag-block__resize"
          role="separator"
          aria-label={`Change how long ${info.title} takes`}
          onPointerDown={(e) => onPointerDown(e, 'resize')}
        />
      )}

      {expanded && (
        <BlockPanel
          s={s}
          info={info}
          day={day}
          days={days}
          onPlace={onPlace}
          onDuration={onDuration}
          onUnpin={onUnpin}
          onRemove={onRemove}
          onClose={onToggle}
          pinned={pinned}
        />
      )}
    </div>
  )
}

// --- the block's own controls, for everything a drag can't say ---------------

const DURATION_CHOICES = [30, 60, 90, 120, 180, 240, 360, 480]

type PanelProps = {
  s: SlottedItem
  info: ReturnType<typeof itemInfo>
  day: string
  days: string[]
  pinned: boolean
  onPlace: (itemId: string, day: string, startTime: string | undefined) => void
  onDuration: (itemId: string, durationMin: number | undefined) => void
  onUnpin?: () => void
  onRemove: () => void
  onClose: () => void
}

function BlockPanel({
  s,
  info,
  day,
  days,
  pinned,
  onPlace,
  onDuration,
  onUnpin,
  onRemove,
  onClose,
}: PanelProps) {
  const { item } = s
  // Narrowed rather than a boolean: programs have no user-settable time or
  // length, and the controls below read those fields directly.
  const editable = item.type === 'program' ? null : item
  return (
    <div className="ag-panel" onPointerDown={(e) => e.stopPropagation()}>
      <div className="ag-panel__head">
        <strong className="ag-panel__title">{info.title}</strong>
        <button type="button" className="ag-panel__close" aria-label="Close details" onClick={onClose}>
          ×
        </button>
      </div>

      {info.missing && (
        <p className="ag-panel__note">
          This is no longer in the guide. It won't export to your calendar; remove it.
        </p>
      )}

      {info.href && (
        <Link className="ag-panel__link" to={info.href}>
          Open the full entry →
        </Link>
      )}
      {info.coord && (
        <a
          className="ag-panel__link"
          href={directionsUrl(info.coord)}
          target="_blank"
          rel="noreferrer"
        >
          Directions to {coordLabel(info.coord)} →
        </a>
      )}

      {editable ? (
        <div className="ag-panel__controls">
          <label className="ag-panel__field">
            Starts
            <input
              className="field-control field-control--sm"
              type="time"
              value={editable.startTime ?? (s.startMin !== null ? toHhmm(s.startMin) : '')}
              onChange={(e) => onPlace(item.itemId, day, e.target.value || undefined)}
            />
          </label>
          <label className="ag-panel__field">
            Day
            <select
              className="field-control field-control--sm"
              value={day}
              onChange={(e) => onPlace(item.itemId, e.target.value, editable.startTime)}
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {formatDayHeader(d)}
                </option>
              ))}
              {!days.includes(day) && <option value={day}>{formatDayHeader(day)}</option>}
            </select>
          </label>
          <label className="ag-panel__field">
            Takes
            <select
              className="field-control field-control--sm"
              value={DURATION_CHOICES.includes(s.durationMin) ? String(s.durationMin) : 'custom'}
              onChange={(e) => {
                if (e.target.value === 'custom') return
                onDuration(item.itemId, Number(e.target.value))
              }}
            >
              {!DURATION_CHOICES.includes(s.durationMin) && (
                <option value="custom">{durationLabel(s.durationMin)}</option>
              )}
              {DURATION_CHOICES.map((min) => (
                <option key={min} value={min}>
                  {durationLabel(min)}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <p className="ag-panel__note">
          A published program time. Move the things around it instead.
        </p>
      )}

      <div className="ag-panel__actions">
        {editable && pinned && onUnpin && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onUnpin}>
            Unpin time
          </button>
        )}
        {editable && editable.durationMin !== undefined && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => onDuration(item.itemId, undefined)}
          >
            Reset length
          </button>
        )}
        <button type="button" className="btn btn--ghost btn--sm" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  )
}

// --- the block that follows the finger --------------------------------------

function DragPreview({
  drag,
  item,
  win,
  pxPerMin,
}: {
  drag: Drag
  item: TripItemT
  win: DayWindow
  pxPerMin: number
}) {
  const info = itemInfo(item)
  const height = Math.max(drag.durationMin * pxPerMin, MIN_BLOCK_PX)
  return (
    <div
      className="ag-block ag-block--dragging"
      aria-hidden="true"
      style={
        {
          top: (drag.startMin - win.from) * pxPerMin,
          height,
          left: 0,
          width: '100%',
          '--tone': info.tone.color,
        } as React.CSSProperties
      }
    >
      <div className="ag-block__body">
        <span className="ag-block__time">
          {clockLabel(drag.startMin)} – {clockLabel(drag.startMin + drag.durationMin)}
          <span className="ag-block__dur">{durationLabel(drag.durationMin)}</span>
        </span>
        <span className="ag-block__title">{info.title}</span>
      </div>
    </div>
  )
}

// --- items with nowhere to sit yet ------------------------------------------

function TrayChip({
  s,
  expanded,
  onToggle,
  onPointerDown,
  day,
  days,
  onPlace,
  onDuration,
  onRemove,
}: {
  s: SlottedItem
  expanded: boolean
  onToggle: () => void
  onPointerDown: (e: React.PointerEvent) => void
  day: string
  days: string[]
  onPlace: (itemId: string, day: string, startTime: string | undefined) => void
  onDuration: (itemId: string, durationMin: number | undefined) => void
  onRemove: () => void
}) {
  const info = itemInfo(s.item)
  const draggable = s.item.type !== 'program'
  return (
    <div className="ag-chip" style={{ '--tone': info.tone.color } as React.CSSProperties}>
      <div
        className="ag-chip__body"
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onPointerDown={draggable ? onPointerDown : undefined}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <span className="ag-chip__title">{info.title}</span>
        <span className="ag-chip__meta">{durationLabel(s.durationMin)}</span>
      </div>
      {expanded && (
        <BlockPanel
          s={s}
          info={info}
          day={day}
          days={days}
          pinned={false}
          onPlace={onPlace}
          onDuration={onDuration}
          onRemove={onRemove}
          onClose={onToggle}
        />
      )}
    </div>
  )
}
