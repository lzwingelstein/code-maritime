/**
 * Marker of a lesson on the path: done and solid, or worth doing again because some of its cards
 * were missed recently (level 0) or are due again under spaced repetition (done a while ago).
 */
import { isDue, type CardMastery } from './mastery'

export type LessonStatus = { state: 'todo' } | { state: 'done' } | { state: 'review', reason: 'mistakes' | 'due' }

export function lessonStatus(cards: string[], mastery: Record<string, CardMastery>, done: boolean, now: number): LessonStatus {
  if (!done) return { state: 'todo' }
  const seen = cards.map(id => mastery[id]).filter((m): m is CardMastery => !!m)
  if (seen.some(m => m.level === 0)) return { state: 'review', reason: 'mistakes' }
  if (seen.some(m => isDue(m, now))) return { state: 'review', reason: 'due' }
  return { state: 'done' }
}
