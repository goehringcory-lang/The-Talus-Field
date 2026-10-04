// =============================================================================
// The Field Guide survey: four short questions for signed-in readers (buyers,
// promo trials, operator logins), mailed to the owner by POST /api/feedback.
//
// When it asks: once, unprompted, on Home, the second distinct day this device
// opens Home signed in. A first-day reader has not used the guide yet, and a
// survey on day one measures the storefront, not the product. "Not now"
// snoozes it for a week; "Don't ask again" and a sent survey end it. The
// Account page's "Take the survey" opens it any time, which is also how the
// operator checks it.
//
// Every read fails CLOSED (unreadable storage counts as done), the opposite of
// install.ts: in a storage-denied browser the snooze could never stick, and a
// survey that reopens on every launch is worse than one that never opens.
// =============================================================================

import { apiFetch } from './api'
import { BUILD_DATE } from './buildInfo'
import { isStandalonePWA } from '../utils/platform'

// Mirrored by SURVEY_FEATURES in workers/src/routes/feedback.ts, which maps
// each id to the label the email prints and rejects any id it does not know.
// Change both in the same PR. Each is something the guide does not do today.
export const SURVEY_FEATURES = [
  { id: 'availability-alerts', label: 'Campsite and lodging availability alerts' },
  { id: 'shuttle-tracking', label: 'Live shuttle tracking' },
  { id: 'audio-tours', label: 'Recorded naturalist audio tours' },
  { id: 'backpacking', label: 'Wilderness permits and backpacking routes' },
  { id: 'group-trips', label: 'Plan a trip together with your group' },
  { id: 'more-parks', label: 'Sequoia and Kings Canyon coverage' },
] as const

export type SurveyFeatureId = (typeof SURVEY_FEATURES)[number]['id']

/** How many features the reader ranks. */
export const SURVEY_RANK_COUNT = 3

export type SurveyAnswers = {
  rating: number
  worth: 'yes' | 'somewhat' | 'no'
  ranking: SurveyFeatureId[]
  missing?: string
  comment?: string
}

const DONE_KEY = 'tfg.survey.done'
const SNOOZE_KEY = 'tfg.survey.snoozeUntil'
const DAYS_KEY = 'tfg.survey.days'
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000
const DAYS_BEFORE_ASK = 2

function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function readDays(): string[] {
  const raw = window.localStorage.getItem(DAYS_KEY)
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

/** Record today's visit to Home. Keeps only as many days as the rule needs. */
export function noteSurveyVisit(): void {
  try {
    const days = readDays()
    const d = today()
    if (days.includes(d) || days.length >= DAYS_BEFORE_ASK) return
    window.localStorage.setItem(DAYS_KEY, JSON.stringify([...days, d]))
  } catch {
    /* non-fatal: shouldAskSurvey fails closed */
  }
}

/** Whether Home should open the survey unprompted on this visit. */
export function shouldAskSurvey(): boolean {
  try {
    if (window.localStorage.getItem(DONE_KEY) === '1') return false
    const snoozeUntil = Number(window.localStorage.getItem(SNOOZE_KEY) ?? 0)
    if (snoozeUntil > Date.now()) return false
    return readDays().length >= DAYS_BEFORE_ASK
  } catch {
    return false
  }
}

export function snoozeSurvey(): void {
  try {
    window.localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS))
  } catch {
    /* non-fatal */
  }
}

export function endSurvey(): void {
  try {
    window.localStorage.setItem(DONE_KEY, '1')
  } catch {
    /* non-fatal */
  }
}

export async function sendSurvey(answers: SurveyAnswers): Promise<void> {
  await apiFetch('/api/feedback', {
    method: 'POST',
    body: JSON.stringify({
      ...answers,
      build: BUILD_DATE,
      installed: isStandalonePWA(),
    }),
  })
  endSurvey()
}
