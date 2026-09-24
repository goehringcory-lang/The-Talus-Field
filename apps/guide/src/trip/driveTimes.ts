// =============================================================================
// Drive times between two places in the park, from the park's own table.
//
// content/driveTimes.ts carries the published minutes-from-the-Valley figures
// and the road tree they sit on; this module answers "how long between A and
// B" from them. Every place with a coordinate is anchored to the nearest
// published point in its own region (secret spots name theirs by hand), and a
// leg between two different anchors costs the tree distance between them:
// the two Valley times less twice the time to where their roads part.
//
// slotting.ts keeps its straight-line estimate for short hops and takes the
// larger of the two, so a leg inside one area (Tunnel View down to Bridalveil,
// Olmsted Point to Tenaya Lake) is priced exactly as before, and a leg across
// the park stops pretending Glacier Point is fifteen minutes above the Valley.
// =============================================================================

import { AMENITIES, SECRET_SPOTS, getHikeById, getStopById, stops } from '../content'
import type { GuideStopT, HikeT } from '../content'
import {
  DRIVE_NODES,
  REGION_DRIVE_NODES,
  SECRET_SPOT_DRIVE_NODE,
  type DriveNode,
  type DriveNodeId,
} from '../content/driveTimes'
import { haversineMiles } from '../utils/geo'
import type { TripItemT } from './schema'

const NODE = new Map<DriveNodeId, DriveNode>(DRIVE_NODES.map((n) => [n.id, n]))

/** Coordinate behind a node's `at` reference, or undefined when the entry it
 *  names is missing (driveTimes.test.ts fails on that). */
export function resolveDriveNodeAt(ref: string): [number, number] | undefined {
  const i = ref.indexOf(':')
  const kind = ref.slice(0, i)
  const id = ref.slice(i + 1)
  if (kind === 'amenity') return AMENITIES.find((a) => a.id === id)?.coord
  if (kind === 'stop') return stops.find((s) => s.id === id)?.coord
  if (kind === 'hike') return getHikeById(id)?.coord
  if (kind === 'secret') return SECRET_SPOTS.find((s) => s.id === id)?.coord
  return undefined
}

let nodeCoords: Map<DriveNodeId, [number, number]> | null = null
function coordOfNode(id: DriveNodeId): [number, number] | undefined {
  if (!nodeCoords) {
    nodeCoords = new Map()
    for (const n of DRIVE_NODES) {
      const c = n.at ? resolveDriveNodeAt(n.at) : undefined
      if (c) nodeCoords.set(n.id, c)
    }
  }
  return nodeCoords.get(id)
}

function nearestNode(coord: [number, number], candidates: DriveNodeId[]): DriveNodeId | null {
  let best: DriveNodeId | null = null
  let bestMi = Infinity
  for (const id of candidates) {
    const c = coordOfNode(id)
    if (!c) continue
    const mi = haversineMiles(coord, c)
    const limit = NODE.get(id)?.anchorWithinMi
    if (limit !== undefined && mi > limit) continue
    if (mi < bestMi) {
      bestMi = mi
      best = id
    }
  }
  return best
}

/** Minutes between two published points along the road tree. */
export function treeMinutes(a: DriveNodeId, b: DriveNodeId): number {
  if (a === b) return 0
  const seen = new Set<DriveNodeId>()
  for (let id: DriveNodeId | null = a; id; id = NODE.get(id)?.parent ?? null) seen.add(id)
  let fork: DriveNodeId | null = b
  while (fork && !seen.has(fork)) fork = NODE.get(fork)?.parent ?? null
  const forkMin = fork ? NODE.get(fork)!.minutes : 0
  return NODE.get(a)!.minutes + NODE.get(b)!.minutes - 2 * forkMin
}

/** The published point a stop, hidden stop, or secret spot is driven to. */
export function driveNodeForStop(stop: GuideStopT): DriveNodeId | null {
  if (!stop.coord) return null
  if (!('region' in stop)) return SECRET_SPOT_DRIVE_NODE[stop.id] ?? null
  return nearestNode(stop.coord, REGION_DRIVE_NODES[stop.region])
}

export function driveNodeForHike(hike: HikeT): DriveNodeId | null {
  if (!hike.coord) return null
  return nearestNode(hike.coord, REGION_DRIVE_NODES[hike.region])
}

// Programs carry a coordinate but no region, and nearest-point-overall is
// exactly the trap the region fence exists for: a talk at Curry Village is
// closer to Glacier Point's pin than to the Valley's. They meet at developed
// places (amphitheaters, visitor centers, trailheads) where the guide has a
// stop, so a program borrows the region of the nearest stop within this
// radius; further than that it is somewhere the guide does not describe and
// the leg falls back to distance alone.
const PROGRAM_REGION_MAX_MI = 1

function regionNear(coord: [number, number]): (typeof stops)[number]['region'] | null {
  let best: (typeof stops)[number] | null = null
  let bestMi = Infinity
  for (const s of stops) {
    if (!s.coord) continue
    const mi = haversineMiles(coord, s.coord)
    if (mi < bestMi) {
      bestMi = mi
      best = s
    }
  }
  return best && bestMi <= PROGRAM_REGION_MAX_MI ? best.region : null
}

export function driveNodeForItem(item: TripItemT): DriveNodeId | null {
  if (item.type === 'stop') {
    const stop = getStopById(item.stopId)
    return stop ? driveNodeForStop(stop) : null
  }
  if (item.type === 'hike') {
    const hike = getHikeById(item.hikeId)
    return hike ? driveNodeForHike(hike) : null
  }
  if (item.type === 'program') {
    const coord = item.snapshot.coord
    if (!coord) return null
    const region = regionNear(coord)
    return region ? nearestNode(coord, REGION_DRIVE_NODES[region]) : null
  }
  return null
}

// The Valley's three points sit a few minutes apart on a road system of
// one-way loops the tree does not model, and the straight-line estimate was
// tuned on exactly those legs; a hop between two of them stays with it.
const VALLEY_NODES = new Set<DriveNodeId>(REGION_DRIVE_NODES.valley)

/** The park-table drive between two items, in minutes of driving (no
 *  parking allowance), or null when the table does not decide the leg: either
 *  side has no published anchor, both share one, or both are on the Valley
 *  floor (see above). */
export function publishedDriveMinutes(a: TripItemT, b: TripItemT): number | null {
  const na = driveNodeForItem(a)
  const nb = driveNodeForItem(b)
  if (!na || !nb || na === nb) return null
  if (VALLEY_NODES.has(na) && VALLEY_NODES.has(nb)) return null
  return treeMinutes(na, nb)
}
