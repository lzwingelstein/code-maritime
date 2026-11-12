/**
 * Lesson session: plain TypeScript state + functions that mutate it (wrap it in `reactive()` in a page).
 * - choose, then check: the verdict shows, then the player continues (no automatic move);
 * - a wrong answer costs a heart and the question comes back at the end, regenerated (other choices);
 * - progress counts finished steps, so a mistake never moves the bar back;
 * - no hearts left: the lesson is lost.
 * Exam mode (hearts: null, retryWrong: false): no heart limit, a wrong answer is final and only counted in `errors`.
 */
import type { AnswerLog, BaseExercise, Step, Verdict } from './types'

export type Phase = 'step' | 'verdict' | 'won' | 'lost'

export interface Session<E extends BaseExercise> {
  steps: Step<E>[]
  index: number
  phase: Phase
  /** null: no limit (exam mode). */
  hearts: number | null
  maxHearts: number | null
  /** A wrong question comes back at the end (lessons), or not (exam). */
  retryWrong: boolean
  errors: number
  selected: string | null
  verdict: Verdict | null
  /** Steps finished (passive steps and right answers). */
  done: number
  combo: number
  maxCombo: number
  /** Questions in the lesson as built (retries excluded). */
  questions: number
  /** Right at the first try. */
  firstTry: number
  answers: AnswerLog[]
}

export function startSession<E extends BaseExercise>(
  steps: Step<E>[],
  options: { hearts?: number | null, retryWrong?: boolean } = {},
): Session<E> {
  const hearts = options.hearts === undefined ? 5 : options.hearts
  return {
    steps: [...steps],
    index: 0,
    phase: steps.length ? 'step' : 'won',
    hearts,
    maxHearts: hearts,
    retryWrong: options.retryWrong ?? true,
    errors: 0,
    selected: null,
    verdict: null,
    done: 0,
    combo: 0,
    maxCombo: 0,
    questions: steps.filter(s => s.type === 'question').length,
    firstTry: 0,
    answers: [],
  }
}

export function currentStep<E extends BaseExercise>(s: Session<E>): Step<E> | undefined {
  return s.steps[s.index]
}

export function select<E extends BaseExercise>(s: Session<E>, choiceId: string): void {
  if (s.phase !== 'step' || currentStep(s)?.type !== 'question') throw new Error('select: no open question')
  s.selected = choiceId
}

export function check<E extends BaseExercise>(s: Session<E>, regenerate: (e: E) => E): Verdict {
  const step = currentStep(s)
  if (s.phase !== 'step' || step?.type !== 'question') throw new Error('check: no open question')
  if (s.selected === null) throw new Error('check: nothing selected')

  const { exercise, isRetry } = step
  const correct = s.selected === exercise.answer
  s.answers.push({ cardId: exercise.cardId, correct, isRetry })
  if (correct) {
    s.done++
    s.combo++
    s.maxCombo = Math.max(s.maxCombo, s.combo)
    if (!isRetry) s.firstTry++
  }
  else {
    s.errors++
    s.combo = 0
    if (s.hearts !== null) s.hearts--
    if (s.retryWrong) s.steps.push({ type: 'question', exercise: regenerate(exercise), isRetry: true })
    else s.done++
  }
  s.verdict = { correct, expected: exercise.answer, chosen: s.selected, cardId: exercise.cardId }
  s.phase = 'verdict'
  return s.verdict
}

/** Continue: after a verdict, or past a passive step (tip, intro). */
export function advance<E extends BaseExercise>(s: Session<E>): void {
  if (s.phase === 'step') {
    if (currentStep(s)?.type === 'question') throw new Error('advance: answer the question first')
    s.done++
  }
  else if (s.phase !== 'verdict') return

  s.index++
  s.selected = null
  s.verdict = null
  if (s.hearts !== null && s.hearts <= 0) s.phase = 'lost'
  else if (s.index >= s.steps.length) s.phase = 'won'
  else s.phase = 'step'
}

/** Share of the lesson finished, 0 to 1. */
export function progress<E extends BaseExercise>(s: Session<E>): number {
  // Once checked, the current question is either done or replaced by its retry at the end.
  const remaining = s.steps.length - s.index - (s.phase === 'verdict' ? 1 : 0)
  const total = s.done + remaining
  return total ? s.done / total : 1
}
