// =============================================================================
// One resolver for everything the agenda board needs to draw a trip item:
// its title, its color tone, its coordinate, its in-app link, and the meta
// chips under the title. /trip, the drag preview, and the day sheet all read
// from here so a stop looks the same wherever it appears.
//
// Tones come from the map's KIND_STYLES, so a viewpoint carries the same hue
// on the board that its pin carries on /map; programs get their own set keyed
// to the program category. Blocks tint the tone into the page background
// rather than filling with it, which keeps the board legible in both the
// light and the dark palette.
// =============================================================================

import { getHikeById, getStopById } from '../content'
import { DIFFICULTY_LABEL, KIND_LABEL } from '../content/labels'
import { KIND_STYLES } from '../map/kinds'
import type { ProgramCategoryT } from '../programs/schema'
import type { TripItemT } from './schema'

export type AgendaTone = {
  id: string
  label: string
  color: string
}

const PROGRAM_TONES: Record<ProgramCategoryT, AgendaTone> = {
  ranger: { id: 'ranger', label: 'Ranger program', color: '#2f5d3a' },
  'junior-ranger': { id: 'junior-ranger', label: 'Junior Ranger', color: '#8a661a' },
  walk: { id: 'walk', label: 'Guided walk', color: '#3d5a3f' },
  talk: { id: 'talk', label: 'Talk', color: '#4a4470' },
  astronomy: { id: 'astronomy', label: 'After dark', color: '#26355e' },
  kids: { id: 'kids', label: 'Kids', color: '#8a661a' },
  tour: { id: 'tour', label: 'Tour', color: '#7a4b12' },
  arts: { id: 'arts', label: 'Arts', color: '#5a3a5e' },
  other: { id: 'other', label: 'Program', color: '#50402e' },
}

const HIKE_TONE: AgendaTone = { id: 'hike', label: 'Day hike', color: KIND_STYLES.hike.color }
const MEAL_TONE: AgendaTone = { id: 'meal', label: 'Meal', color: KIND_STYLES.meal.color }
const LODGING_TONE: AgendaTone = { id: 'lodging', label: 'Lodging', color: KIND_STYLES.lodging.color }
const CUSTOM_TONE: AgendaTone = { id: 'custom', label: 'Your own', color: '#50402e' }

// A custom item is free text, so the only signal about what it is comes from
// what the user typed. Two cheap reads (a meal, a check-in) color the common
// cases; everything else stays the neutral "your own" tone.
const MEAL_WORDS = /\b(breakfast|brunch|lunch|dinner|supper|coffee|pizza|bar|grill|cafe|café|restaurant)\b/i
const LODGING_WORDS = /\b(check[\s-]?in|check[\s-]?out|hotel|lodge|motel|cabin|airbnb|campsite|campground|tent|yurt)\b/i

function toneForStopKind(kind: keyof typeof KIND_STYLES): AgendaTone {
  const style = KIND_STYLES[kind]
  return { id: kind, label: style.label, color: style.color }
}

export type ItemInfo = {
  title: string
  tone: AgendaTone
  /** [lng, lat] when the item sits somewhere on the map. */
  coord?: [number, number]
  /** In-app route for the item's own page, when it has one. */
  href?: string
  /** Short chips under the title: distance, difficulty, venue. */
  meta: string[]
  /** True when a stop or hike id no longer resolves against this edition. */
  missing: boolean
  /** Programs keep their published time: they can't be dragged or resized. */
  fixed: boolean
}

export function itemInfo(item: TripItemT): ItemInfo {
  if (item.type === 'program') {
    const ev = item.snapshot
    const meta: string[] = []
    if (ev.location) meta.push(ev.location)
    if (ev.reservationRequired) meta.push('Reservation required')
    return {
      title: ev.title,
      tone: PROGRAM_TONES[ev.category] ?? PROGRAM_TONES.other,
      coord: ev.coord ?? undefined,
      meta,
      missing: false,
      fixed: true,
    }
  }

  if (item.type === 'hike') {
    const hike = getHikeById(item.hikeId)
    if (!hike) {
      return { title: 'No longer in this edition', tone: HIKE_TONE, meta: [], missing: true, fixed: false }
    }
    return {
      title: hike.title,
      tone: HIKE_TONE,
      coord: hike.coord,
      href: `/hike/${hike.id}`,
      meta: [
        `${hike.distanceMi} mi${hike.route === 'one-way' ? ' one-way' : ''}`,
        `${hike.elevationGainFt.toLocaleString('en-US')} ft gain`,
        DIFFICULTY_LABEL[hike.difficulty],
      ],
      missing: false,
      fixed: false,
    }
  }

  if (item.type === 'stop') {
    const stop = getStopById(item.stopId)
    if (!stop) {
      return {
        title: 'No longer in this edition',
        tone: CUSTOM_TONE,
        meta: [],
        missing: true,
        fixed: false,
      }
    }
    const meta = [KIND_LABEL[stop.kind]]
    if (stop.difficulty) meta.push(DIFFICULTY_LABEL[stop.difficulty])
    return {
      title: stop.title,
      tone: toneForStopKind(stop.kind),
      coord: stop.coord,
      href: `/stop/${stop.id}`,
      meta,
      missing: false,
      fixed: false,
    }
  }

  const tone = MEAL_WORDS.test(item.title)
    ? MEAL_TONE
    : LODGING_WORDS.test(item.title)
      ? LODGING_TONE
      : CUSTOM_TONE
  return {
    title: item.title,
    tone,
    meta: item.note ? [item.note] : [],
    missing: false,
    fixed: false,
  }
}

/** The distinct tones in a plan, in first-seen order, for the board legend. */
export function tonesInPlan(items: TripItemT[]): AgendaTone[] {
  const seen = new Map<string, AgendaTone>()
  for (const item of items) {
    const { tone } = itemInfo(item)
    if (!seen.has(tone.id)) seen.set(tone.id, tone)
  }
  return [...seen.values()]
}

/** "37.71660, -119.64400" — the coordinate as the field guide prints it. */
export function coordLabel(coord: [number, number]): string {
  const [lng, lat] = coord
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}

export { directionsUrl } from '../map/kinds'
