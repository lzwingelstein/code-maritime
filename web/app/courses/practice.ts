/**
 * Practice series: questions mixed across every unit, on cards already seen, picked mostly where the player struggles.
 * A card's weight comes from its mastery (spaced repetition), squared so that weak and due cards dominate.
 */
import { reviewWeight, type CardMastery } from '~/engine/mastery'
import { pickWeighted, shuffle, type Random } from '~/engine/random'
import type { Step } from '~/engine/types'
import type { Course, CourseExercise, Generator } from './types'

export const PRACTICE = { questions: 15, minCards: 4 } as const
export const PRACTICE_ID = 'entrainement'

/** Each card with the generator of its unit's review lesson (widest choices) and that lesson's kinds. */
function cardSources(courses: Course[]) {
  const sources = new Map<string, { generate: Generator, kinds: string[] }>()
  for (const course of courses) {
    const review = course.lessons.find(l => l.plan.review) ?? course.lessons.at(-1)!
    const source = { generate: course.generator(review), kinds: review.plan.kinds }
    for (const lesson of course.lessons) for (const id of lesson.plan.cards) sources.set(id, source)
  }
  return sources
}

/** One generator for every card, routed to its unit (used to bring a missed question back with new choices). */
export function practiceGenerator(courses: Course[]): Generator {
  const sources = cardSources(courses)
  return (cardId, kind, rng, statement) => sources.get(cardId)?.generate(cardId, kind, rng, statement) ?? null
}

/** Cards to work on: answered wrong recently (level 0), or back due at a low level. */
export function weakCards(courses: Course[], mastery: Record<string, CardMastery>, now: number): string[] {
  const known = cardSources(courses)
  return Object.entries(mastery)
    .filter(([id, m]) => known.has(id) && m.level <= 1 && m.due <= now)
    .map(([id]) => id)
}

export function buildPractice(
  courses: Course[],
  mastery: Record<string, CardMastery>,
  now: number,
  rng: Random,
  total: number = PRACTICE.questions,
): Step<CourseExercise>[] {
  const sources = cardSources(courses)
  const cards = Object.keys(mastery).filter(id => sources.has(id))
  if (cards.length < PRACTICE.minCards) return []

  const weight = (id: string) => reviewWeight(mastery[id], now) ** 2
  const steps: Step<CourseExercise>[] = []
  const seen = new Set<string>()
  let last: string | null = null
  let guard = total * 50
  while (steps.length < total && guard-- > 0) {
    const cardId = pickWeighted(cards.filter(c => c !== last), weight, rng)
    const { generate, kinds } = sources.get(cardId)!
    for (const kind of shuffle(kinds, rng)) {
      const exercise = generate(cardId, kind, rng)
      if (!exercise) continue
      const key = `${cardId}|${exercise.prompt}`
      // The same question may come back only once every card has been asked.
      if (seen.has(key) && seen.size < cards.length * 2) continue
      seen.add(key)
      steps.push({ type: 'question', exercise, isRetry: false })
      last = cardId
      break
    }
  }
  return steps
}
