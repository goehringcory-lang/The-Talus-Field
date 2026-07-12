// =============================================================================
// WEATHER — NWS forecasts for four fixed park spots, one per guide region.
//
// api.weather.gov is keyless; the only requirement is an identifying
// User-Agent. Two-step protocol: /points/{lat},{lon} resolves the gridpoint
// forecast URL (cached in KV: the NWS docs say not to hardcode grid
// assignments), then the forecast URL yields the periods.
//
// KEEP IN SYNC with apps/guide/src/weather/schema.ts — the PWA re-declares
// the response schema at its parse boundary, same convention as programs.
// =============================================================================

import { z } from 'zod'
import type { Env } from '../env'

// NWS asks every client to identify itself; requests without a UA get 403.
const NWS_USER_AGENT =
  'The Talus Field Guide (thetalusfieldjournal.com, cory@thetalusfieldjournal.com)'

export const WeatherSpotId = z.enum(['valley', 'glacier-mariposa', 'tuolumne', 'hetch-hetchy'])
export type WeatherSpotIdT = z.infer<typeof WeatherSpotId>

export const WeatherPeriod = z.object({
  name: z.string(),                       // "Today", "Tonight", "Friday"
  startTime: z.string(),                  // ISO with offset, straight from NWS
  isDaytime: z.boolean(),
  tempF: z.number(),
  shortForecast: z.string(),              // "Sunny", "Chance Showers And Thunderstorms"
  precipChance: z.number().nullable(),
  windSpeed: z.string().nullable(),       // "5 to 10 mph"
})
export type WeatherPeriodT = z.infer<typeof WeatherPeriod>

export const WeatherSpot = z.object({
  id: WeatherSpotId,
  label: z.string(),
  elevationFt: z.number(),
  updatedAt: z.string(),                  // NWS forecast generation stamp
  periods: z.array(WeatherPeriod),
})
export type WeatherSpotT = z.infer<typeof WeatherSpot>

export const WeatherRecord = z.object({
  fetchedAt: z.string(),
  spots: z.array(WeatherSpot),
})
export type WeatherRecordT = z.infer<typeof WeatherRecord>

// Forecast display points, ids matching the PWA's Region enum so the app can
// look a spot up by regionId with no mapping. These are representative points
// for the elevation band, not ground-truthed stop coordinates; the elevation
// number is the editorial point (why the valley bakes while Tuolumne needs a
// jacket). NWS wants lat,lon order.
export const WEATHER_SPOTS: Array<{
  id: WeatherSpotIdT
  label: string
  elevationFt: number
  lat: number
  lon: number
}> = [
  { id: 'valley', label: 'Yosemite Valley', elevationFt: 3970, lat: 37.7456, lon: -119.5936 },
  { id: 'glacier-mariposa', label: 'Glacier Point', elevationFt: 7214, lat: 37.7281, lon: -119.5734 },
  { id: 'tuolumne', label: 'Tuolumne Meadows', elevationFt: 8619, lat: 37.8742, lon: -119.3514 },
  { id: 'hetch-hetchy', label: 'Hetch Hetchy', elevationFt: 3796, lat: 37.9469, lon: -119.7883 },
]

// Two 7-day forecasts per day: day + night periods.
const MAX_PERIODS = 14

// ── KV layout (GUIDE_PROGRAMS: the "guide data cache, safe to lose" bucket) ──
// weather:v1        → WeatherRecordT (all four spots, merged)
// weather:points:v1 → Record<spotId, forecastUrl> (gridpoint resolution cache)

const WEATHER_KEY = 'weather:v1'
const POINTS_KEY = 'weather:points:v1'

export async function readWeatherRecord(env: Env): Promise<WeatherRecordT | null> {
  const raw = await env.GUIDE_PROGRAMS.get(WEATHER_KEY)
  if (!raw) return null
  try {
    const parsed = WeatherRecord.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      console.error('readWeatherRecord: schema drift in KV', parsed.error.issues[0])
      return null
    }
    return parsed.data
  } catch (err) {
    console.error('readWeatherRecord: corrupt KV record', err)
    return null
  }
}

export async function writeWeatherRecord(env: Env, record: WeatherRecordT): Promise<void> {
  await env.GUIDE_PROGRAMS.put(WEATHER_KEY, JSON.stringify(record))
}

async function nwsFetch(url: string): Promise<Response> {
  return fetch(url, {
    headers: { 'User-Agent': NWS_USER_AGENT, Accept: 'application/geo+json' },
  })
}

async function readPointsCache(env: Env): Promise<Record<string, string>> {
  const raw = await env.GUIDE_PROGRAMS.get(POINTS_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === 'object') return parsed as Record<string, string>
  } catch {
    /* corrupt cache reads as empty; re-resolved below */
  }
  return {}
}

async function resolveForecastUrl(spot: (typeof WEATHER_SPOTS)[number]): Promise<string> {
  const res = await nwsFetch(`https://api.weather.gov/points/${spot.lat},${spot.lon}`)
  if (!res.ok) throw new Error(`NWS points lookup ${res.status} for ${spot.id}`)
  const body = (await res.json()) as { properties?: { forecast?: string } }
  const url = body.properties?.forecast
  if (!url) throw new Error(`NWS points response missing forecast URL for ${spot.id}`)
  return url
}

type NwsPeriod = {
  name?: string
  startTime?: string
  isDaytime?: boolean
  temperature?: number
  temperatureUnit?: string
  probabilityOfPrecipitation?: { value?: number | null }
  windSpeed?: string
  shortForecast?: string
}

function normalizePeriods(periods: NwsPeriod[]): WeatherPeriodT[] {
  const out: WeatherPeriodT[] = []
  for (const p of periods.slice(0, MAX_PERIODS)) {
    if (typeof p.name !== 'string' || typeof p.startTime !== 'string') continue
    if (typeof p.temperature !== 'number') continue
    out.push({
      name: p.name,
      startTime: p.startTime,
      isDaytime: p.isDaytime === true,
      // NWS serves Fahrenheit for CONUS; convert defensively anyway.
      tempF: p.temperatureUnit === 'C' ? Math.round((p.temperature * 9) / 5 + 32) : p.temperature,
      shortForecast: typeof p.shortForecast === 'string' ? p.shortForecast : '',
      precipChance: p.probabilityOfPrecipitation?.value ?? null,
      windSpeed: typeof p.windSpeed === 'string' && p.windSpeed ? p.windSpeed : null,
    })
  }
  return out
}

async function fetchSpotForecast(
  spot: (typeof WEATHER_SPOTS)[number],
  pointsCache: Record<string, string>,
): Promise<WeatherSpotT> {
  let forecastUrl = pointsCache[spot.id]
  let resolvedFresh = false
  if (!forecastUrl) {
    forecastUrl = await resolveForecastUrl(spot)
    pointsCache[spot.id] = forecastUrl
    resolvedFresh = true
  }

  let res = await nwsFetch(forecastUrl)
  // Gridpoint drift: a cached forecast URL can go stale. Re-resolve once.
  if (res.status === 404 && !resolvedFresh) {
    forecastUrl = await resolveForecastUrl(spot)
    pointsCache[spot.id] = forecastUrl
    res = await nwsFetch(forecastUrl)
  }
  if (!res.ok) throw new Error(`NWS forecast ${res.status} for ${spot.id}`)

  const body = (await res.json()) as {
    properties?: { updateTime?: string; updated?: string; periods?: NwsPeriod[] }
  }
  const periods = normalizePeriods(body.properties?.periods ?? [])
  if (periods.length === 0) throw new Error(`NWS forecast empty for ${spot.id}`)

  return {
    id: spot.id,
    label: spot.label,
    elevationFt: spot.elevationFt,
    updatedAt: body.properties?.updateTime ?? body.properties?.updated ?? new Date().toISOString(),
    periods,
  }
}

/**
 * Fetch all four spots and merge with the previous record: one NWS failure
 * keeps that spot's stale copy rather than blanking it. Returns null only
 * when nothing could be fetched AND nothing was cached.
 */
export async function refreshWeather(env: Env): Promise<WeatherRecordT | null> {
  const [previous, pointsCache] = await Promise.all([
    readWeatherRecord(env),
    readPointsCache(env),
  ])

  const results = await Promise.allSettled(
    WEATHER_SPOTS.map((spot) => fetchSpotForecast(spot, pointsCache)),
  )

  const spots: WeatherSpotT[] = []
  let fetchedAny = false
  for (let i = 0; i < WEATHER_SPOTS.length; i++) {
    const result = results[i]
    if (result.status === 'fulfilled') {
      spots.push(result.value)
      fetchedAny = true
    } else {
      console.error('refreshWeather: spot fetch failed', WEATHER_SPOTS[i].id, result.reason)
      const stale = previous?.spots.find((s) => s.id === WEATHER_SPOTS[i].id)
      if (stale) spots.push(stale)
    }
  }

  if (!fetchedAny) return previous

  const record: WeatherRecordT = { fetchedAt: new Date().toISOString(), spots }
  await Promise.all([
    writeWeatherRecord(env, record),
    env.GUIDE_PROGRAMS.put(POINTS_KEY, JSON.stringify(pointsCache)),
  ])
  return record
}
