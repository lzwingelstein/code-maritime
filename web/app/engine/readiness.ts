import { dayKey } from './streak'

/**
 * How ready the player is for the exam, in percent: the mean of the path done and how well the cards are known.
 * A card counts fully from level 3 (seen right after a week), partly below, not at all if never seen.
 * Days left: lessons still to do at a steady pace (default two lessons a day, the daily goal).
 */
export function readiness(r: { lessonsDone: number, lessonsTotal: number, levels: (number | null)[], perDay: number }) {
  const path = r.lessonsTotal ? r.lessonsDone / r.lessonsTotal : 0
  const mastery = r.levels.length ? r.levels.reduce<number>((s, l) => s + (l === null ? 0 : Math.min(l, 3) / 3), 0) / r.levels.length : 0
  const lessonsLeft = Math.max(0, r.lessonsTotal - r.lessonsDone)
  return {
    percent: Math.round((path + mastery) / 2 * 100),
    path: Math.round(path * 100),
    mastery: Math.round(mastery * 100),
    lessonsLeft,
    daysLeft: Math.ceil(lessonsLeft / r.perDay),
  }
}

const daysBetween = (a: string, b: string) => {
  const d = (k: string) => { const [y, m, dd] = k.split('-').map(Number) as [number, number, number]; return Date.UTC(y, m - 1, dd) }
  return Math.round((d(b) - d(a)) / 86_400_000)
}

/**
 * The player's own pace, in path lessons a day, over the last `window` days (today included), counted from the
 * first day with a lesson in that window and over at least `minDays` days. Null without any lesson in the window.
 */
export function pace(history: Record<string, { lessons?: number }>, today: string, window = 14, minDays = 3): number | null {
  const [y, m, d] = today.split('-').map(Number) as [number, number, number]
  const from = dayKey(new Date(y, m - 1, d - (window - 1)))
  const days = Object.entries(history).filter(([k, v]) => k >= from && k <= today && (v.lessons ?? 0) > 0)
  if (!days.length) return null
  const first = days.map(([k]) => k).sort()[0]!
  const total = days.reduce((n, [, v]) => n + (v.lessons ?? 0), 0)
  return total / Math.max(minDays, daysBetween(first, today) + 1)
}

/** When the player plans to sit the exam, as asked on first launch. */
export interface ExamPlan {
  choice: 'date' | 'month' | 'unknown'
  /** Day key (YYYY-MM-DD) when `choice` is 'date'. */
  day?: string
}

/** Days kept at the end for reviews only, once the path is done. */
export const REVIEW_DAYS = 10

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/

/** The exam day to aim at: the chosen day, a month from today, or null when unknown. */
export function examTarget(plan: ExamPlan | undefined, today: string): string | null {
  if (plan?.choice === 'date') return plan.day && DAY_KEY.test(plan.day) ? plan.day : null
  if (plan?.choice === 'month') {
    const [y, m, d] = today.split('-').map(Number) as [number, number, number]
    return dayKey(new Date(y, m, d))
  }
  return null
}

/**
 * New lessons a day to finish the path before the exam with REVIEW_DAYS left for reviews.
 * Tight when the exam is too close for that: the lessons left are then spread over the days that remain.
 */
export function examPace(r: { lessonsLeft: number, today: string, target: string, reviewDays?: number }) {
  const daysUntil = daysBetween(r.today, r.target)
  const reviewDays = r.reviewDays ?? REVIEW_DAYS
  const tight = daysUntil <= reviewDays
  const studyDays = Math.max(1, tight ? daysUntil : daysUntil - reviewDays)
  return { daysUntil, perDay: Math.ceil(r.lessonsLeft / studyDays), tight }
}
