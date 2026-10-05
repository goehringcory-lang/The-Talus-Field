import type { Env } from '../env'
import { sendFeedbackSurvey, type FeedbackSurvey } from './email'
import { FEEDBACK_QUEUE_PREFIX } from './kv'

// Nightly delivery of Field Guide surveys whose email failed at answer time
// (routes/feedback.ts queues them). Each one is mailed and then deleted; one
// that fails again stays for the next night until its KV TTL runs out.
export async function retryQueuedFeedback(env: Env): Promise<{ sent: number; failed: number }> {
  let sent = 0
  let failed = 0
  let cursor: string | undefined
  do {
    const page = await env.GUIDE_BUYERS.list({ prefix: FEEDBACK_QUEUE_PREFIX, cursor })
    for (const { name } of page.keys) {
      const raw = await env.GUIDE_BUYERS.get(name)
      if (!raw) continue
      let survey: FeedbackSurvey
      try {
        survey = JSON.parse(raw) as FeedbackSurvey
      } catch {
        await env.GUIDE_BUYERS.delete(name)
        continue
      }
      try {
        await sendFeedbackSurvey(env, survey)
        await env.GUIDE_BUYERS.delete(name)
        sent++
      } catch (err) {
        console.error('feedback retry failed', { name, err })
        failed++
      }
    }
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)
  return { sent, failed }
}
