// =============================================================================
// Photo credits, keyed by the src path exactly as written in stops.ts,
// secret-spots.ts, and REGIONS. A separate map (not a field on each photos
// entry) because one file can serve several slots, and because the object
// below is machine-written: scripts/fetch-guide-photos.mjs emit-credits
// regenerates everything between the GENERATED markers from
// scripts/data/photo-credits.json. Hand-edit that JSON, not this literal.
// =============================================================================

export type PhotoCredit = {
  author: string // "Diliff" or "NPS / Damon Joyce"
  license: string // "Public domain" | "CC0" | "CC BY 4.0" | "CC BY-SA 4.0" | "All rights reserved"
  source: string // Commons file page or nps.gov page; empty for house photography
}

// BEGIN GENERATED
export const PHOTO_CREDITS: Record<string, PhotoCredit> = {}
// END GENERATED

/** One-line courtesy credit for a plate caption. */
export function formatCredit(c: PhotoCredit): string {
  const license = c.license.toLowerCase() === 'public domain' ? 'public domain' : c.license
  return `Photo: ${c.author}, ${license}`
}
