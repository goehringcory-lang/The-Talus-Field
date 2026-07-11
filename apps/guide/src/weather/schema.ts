// =============================================================================
// Weather — the PWA's parse boundary for /api/weather.
//
// KEEP IN SYNC with workers/src/lib/weather.ts. The repo deliberately has no
// shared package; the schema is small enough to mirror by hand. Spot ids
// match the Region enum so the app can look a forecast up by regionId.
// =============================================================================

import { z } from 'zod'

export const WeatherSpotId = z.enum(['valley', 'glacier-mariposa', 'tuolumne', 'hetch-hetchy'])
export type WeatherSpotIdT = z.infer<typeof WeatherSpotId>

export const WeatherPeriod = z.object({
  name: z.string(),                 // "Today", "Tonight", "Friday"
  startTime: z.string(),            // ISO with offset, straight from NWS
  isDaytime: z.boolean(),
  tempF: z.number(),
  shortForecast: z.string(),        // "Sunny", "Chance Showers And Thunderstorms"
  precipChance: z.number().nullable(),
  windSpeed: z.string().nullable(), // "5 to 10 mph"
})
export type WeatherPeriodT = z.infer<typeof WeatherPeriod>

export const WeatherSpot = z.object({
  id: WeatherSpotId,
  label: z.string(),
  elevationFt: z.number(),
  updatedAt: z.string(),
  periods: z.array(WeatherPeriod),
})
export type WeatherSpotT = z.infer<typeof WeatherSpot>

export const WeatherResponse = z.object({
  fetchedAt: z.string().nullable(),
  spots: z.array(WeatherSpot),
})
export type WeatherResponseT = z.infer<typeof WeatherResponse>
