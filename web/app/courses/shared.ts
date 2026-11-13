/** Helpers shared by course exercise generators. */
import { shuffle, type Random } from '~/engine/random'
import type { CourseExercise } from './types'

/** The answer and up to n-1 other ids from the pool, shuffled. */
export function options<T extends string>(answer: T, pool: readonly T[], rng: Random, n = 4): T[] {
  const others = shuffle(pool.filter(x => x !== answer), rng).slice(0, n - 1)
  return shuffle([answer, ...others], rng)
}

/** Distractor pool: the lesson's own cards, or in a review the same family first, padded to four. */
export function familyPool<T extends string>(all: readonly T[], family: (id: T) => string, id: T): T[] {
  const same = all.filter(x => family(x) === family(id))
  return same.length >= 4 ? same : [...same, ...all.filter(x => !same.includes(x))]
}

/**
 * A true/false question on one of the card's statements (kept by index when the question comes back).
 * No picture: the statement stands on its own, and a picture could mislead or give the answer away.
 */
export function trueFalse(
  cardId: string,
  statements: [string, boolean][],
  rng: Random,
  statement: number | undefined,
  explanation: string,
): CourseExercise {
  const index = statement ?? Math.floor(rng() * statements.length)
  const [text, truth] = statements[index]!
  return {
    cardId, kind: 'truefalse', heading: 'Vrai ou faux ?', prompt: text, answer: String(truth), layout: 'pair',
    statement: index, visual: null, explanation,
    choices: [{ id: 'true', name: 'Vrai' }, { id: 'false', name: 'Faux' }],
  }
}

export const plain = (text: string) => text.replaceAll('**', '')
