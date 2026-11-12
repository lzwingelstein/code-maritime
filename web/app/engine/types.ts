/**
 * Generic lesson engine types. Nothing here knows about boats: a course plugs in its own cards and exercises.
 * - card: one thing to learn (a buoy, a light, a rule…), identified by a string id;
 * - exercise: one question about a card, with choice ids and the expected one;
 * - step: what the lesson shows next (a tip, a new-card intro, or a question).
 */
export interface BaseExercise {
  cardId: string
  answer: string
  choices: { id: string }[]
}

export type Step<E extends BaseExercise> =
  | { type: 'tip' }
  | { type: 'intro', cardId: string }
  | { type: 'question', exercise: E, isRetry: boolean }

export interface Verdict {
  correct: boolean
  expected: string
  chosen: string
  cardId: string
}

export interface AnswerLog {
  cardId: string
  correct: boolean
  isRetry: boolean
}
