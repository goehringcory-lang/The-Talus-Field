import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../env'
import { getBuyer, queueFeedback, recordFeedbackAttempt } from '../lib/kv'
import { sendFeedbackSurvey, type FeedbackSurvey } from '../lib/email'
import { requireAuth, type AuthVariables } from '../middleware/require-auth'

// The Field Guide survey (apps/guide/src/components/FeedbackSurvey.tsx).
// JWT-gated: only a signed-in buyer or an operator login can answer, so the
// inbox hears from people who have used the paid guide, not from bots. The
// answers are mailed to the operator inbox; only a survey whose email fails is
// kept, in KV, until the nightly cron delivers it (lib/feedbackQueue.ts).
export const feedback = new Hono<{ Bindings: Env; Variables: AuthVariables }>()

// Hand-mirrored from SURVEY_FEATURES in apps/guide/src/lib/survey.ts. The ids
// are what the app sends; the labels are what the email prints. A new id on
// the app side without a row here 400s, which the app reports as a failed
// send, so add it here in the same PR.
export const SURVEY_FEATURES: Record<string, string> = {
  'availability-alerts': 'Campsite and lodging availability alerts',
  'shuttle-tracking': 'Live shuttle tracking',
  'audio-tours': 'Recorded naturalist audio tours',
  'backpacking': 'Wilderness permits and backpacking routes',
  'group-trips': 'Plan a trip together with your group',
  'more-parks': 'Sequoia and Kings Canyon coverage',
}

const WORTH = { yes: 'Yes', somewhat: 'Somewhat', no: 'No' } as const

const MAX_SENDS_PER_HOUR = 5

const Body = z.object({
  rating: z.number().int().min(1).max(5),
  worth: z.enum(['yes', 'somewhat', 'no']),
  // The reader's top picks in order, first is most wanted. At least one.
  ranking: z
    .array(z.string())
    .min(1)
    .max(3)
    .refine((ids) => new Set(ids).size === ids.length, 'duplicate feature')
    .refine((ids) => ids.every((id) => id in SURVEY_FEATURES), 'unknown feature'),
  missing: z.string().max(300).optional(),
  comment: z.string().max(2000).optional(),
  // Context the app adds, so a complaint can be matched to a build.
  build: z.string().max(40).optional(),
  installed: z.boolean().optional(),
})

feedback.post('/', requireAuth, async (c) => {
  const parsed = Body.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid survey' }, 400)

  const sub = c.get('authSub')
  const attempts = await recordFeedbackAttempt(c.env, sub)
  if (attempts > MAX_SENDS_PER_HOUR) {
    return c.json({ error: 'Too many requests. Try again later.' }, 429)
  }

  const d = parsed.data
  const survey: FeedbackSurvey = {
    sub,
    replyTo: sub.includes('@') ? sub : undefined,
    ...(await describeAccount(c.env, sub)),
    rating: d.rating,
    worth: WORTH[d.worth],
    ranking: d.ranking.map((id) => SURVEY_FEATURES[id]),
    missing: d.missing?.trim() || undefined,
    comment: d.comment?.trim() || undefined,
    build: d.build,
    installed: d.installed,
  }

  try {
    await sendFeedbackSurvey(c.env, survey)
  } catch (err) {
    // The reader's answers are already valid; a mail outage is ours, not
    // theirs. Keep the survey for the nightly retry and answer success, so
    // the app never tells a reader with a working connection to check it.
    console.error('feedback send failed, queueing for retry', err)
    try {
      await queueFeedback(c.env, survey)
    } catch (queueErr) {
      console.error('feedback queue failed', queueErr)
      return c.json({ error: 'Send failed' }, 502)
    }
    return c.json({ ok: true, queued: true }, 202)
  }

  return c.json({ ok: true }, 200)
})

// Who answered, in the terms the owner cares about: a paid buyer, a promo
// trial, or an operator login (no buyer record behind the username). Context
// for the email only, so it can never fail the send: a hand-seeded buyer
// record without a numeric purchasedAt used to throw RangeError from
// toISOString() here and 500 the whole survey.
async function describeAccount(
  env: Env,
  sub: string,
): Promise<{ account: string; purchasedAt: string | null }> {
  try {
    const buyer = sub.includes('@') ? await getBuyer(env, sub) : null
    if (!buyer) {
      return {
        account: sub.includes('@') ? 'Signed in, no buyer record' : 'Operator login',
        purchasedAt: null,
      }
    }
    const account = buyer.promoCode ? `Promo trial (${buyer.promoCode})` : 'Paid buyer'
    const at = Number(buyer.purchasedAt)
    const purchasedAt = Number.isFinite(at)
      ? new Date(at * 1000).toISOString().slice(0, 10)
      : null
    return { account, purchasedAt }
  } catch (err) {
    console.error('feedback account lookup failed', err)
    return { account: 'Signed in (account lookup failed)', purchasedAt: null }
  }
}
