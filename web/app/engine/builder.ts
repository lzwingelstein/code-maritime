/**
 * Builds the steps of one lesson from a plan. The course provides the exercise generator;
 * the builder decides the order: tip, then each new card introduced and asked once, then a mix.
 */
import { pick, pickWeighted, shuffle, type Random } from './random'
import type { BaseExercise, Step } from './types'

export interface LessonPlan {
  cards: string[]
  /** Questions in the lesson (retries come on top). */
  count: number
  /** Exercise kinds to mix; a kind listed twice comes up twice as often. */
  kinds: string[]
  tip?: boolean
  /** Review lesson: cards are picked by weight (weak and due ones first). */
  review?: boolean
}

export interface BuildContext<E extends BaseExercise> {
  rng: Random
  isKnown: (cardId: string) => boolean
  /** Returns null when the kind does not apply to the card. */
  generate: (cardId: string, kind: string, rng: Random) => E | null
  /** Kind of the first question right after a new card's intro. */
  firstKind: string
  weight?: (cardId: string) => number
}

export function buildLesson<E extends BaseExercise>(plan: LessonPlan, ctx: BuildContext<E>): Step<E>[] {
  const steps: Step<E>[] = []
  const ask = (cardId: string, kinds: string[]): boolean => {
    for (const kind of shuffle(kinds, ctx.rng)) {
      const exercise = ctx.generate(cardId, kind, ctx.rng)
      if (exercise) {
        steps.push({ type: 'question', exercise, isRetry: false })
        return true
      }
    }
    return false
  }

  if (plan.tip) steps.push({ type: 'tip' })

  let asked = 0
  let last: string | null = null
  for (const cardId of plan.cards.filter(c => !ctx.isKnown(c))) {
    steps.push({ type: 'intro', cardId })
    if (ask(cardId, [ctx.firstKind]) || ask(cardId, plan.kinds)) asked++
    last = cardId
  }

  let guard = plan.count * 20
  while (asked < plan.count && guard-- > 0) {
    const candidates = plan.cards.length > 1 ? plan.cards.filter(c => c !== last) : plan.cards
    const cardId = plan.review && ctx.weight
      ? pickWeighted(candidates, ctx.weight, ctx.rng)
      : pick(candidates, ctx.rng)
    if (ask(cardId, plan.kinds)) {
      asked++
      last = cardId
    }
  }
  return steps
}

/** 10 XP per lesson, +5 without losing a heart, +1 per 3 answers in a row (at most +5). */
export function lessonXp(r: { hearts: number, maxHearts: number, maxCombo: number }): number {
  return 10 + (r.hearts === r.maxHearts ? 5 : 0) + Math.min(5, Math.floor(r.maxCombo / 3))
}
