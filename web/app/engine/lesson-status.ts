/**
 * Lessons flagged "À revoir" on the path. Only recent mistakes (cards back at level 0) count, and only a few
 * lessons are flagged at once so the path never turns into a wall of reviews. Cards merely due under spaced
 * repetition are left to the practice series, which already picks them first.
 */
import type { CardMastery } from './mastery'

export const MAX_REVIEW_MARKERS = 2

export function lessonsToReview(
  lessons: { id: string, cards: string[], done: boolean }[],
  mastery: Record<string, CardMastery>,
  max: number = MAX_REVIEW_MARKERS,
): string[] {
  return lessons
    .map((l, order) => ({ id: l.id, order, mistakes: l.done ? l.cards.filter(id => mastery[id]?.level === 0).length : 0 }))
    .filter(l => l.mistakes > 0)
    .sort((a, b) => b.mistakes - a.mistakes || a.order - b.order)
    .slice(0, max)
    .map(l => l.id)
}

export type UnitState = 'done' | 'active' | 'locked'

/** A unit on the path summary: lessons done out of its total, and whether it is done, open or still locked. */
export function unitProgress(lessons: { unlocked: boolean, done: boolean }[]): { done: number, total: number, state: UnitState } {
  const done = lessons.filter(l => l.done).length
  const total = lessons.length
  const state: UnitState = total > 0 && done === total ? 'done' : lessons[0]?.unlocked ? 'active' : 'locked'
  return { done, total, state }
}
