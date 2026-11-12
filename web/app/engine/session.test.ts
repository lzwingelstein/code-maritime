import { describe, expect, it } from 'vitest'
import { advance, check, progress, select, startSession } from './session'
import type { BaseExercise, Step } from './types'

const q = (cardId: string, answer = 'a'): Step<BaseExercise> => ({
  type: 'question',
  isRetry: false,
  exercise: { cardId, answer, choices: [{ id: 'a' }, { id: 'b' }] },
})
const regenerate = (e: BaseExercise): BaseExercise => ({ ...e })

describe('session', () => {
  it('starts on the first step with full hearts', () => {
    const s = startSession([q('x')], { hearts: 3 })
    expect(s.index).toBe(0)
    expect(s.hearts).toBe(3)
    expect(s.phase).toBe('step')
    expect(progress(s)).toBe(0)
  })

  it('a right answer moves progress and ends the lesson as won', () => {
    const s = startSession([q('x'), q('y')])
    select(s, 'a')
    const v = check(s, regenerate)
    expect(v).toEqual({ correct: true, expected: 'a', chosen: 'a', cardId: 'x' })
    expect(progress(s)).toBe(0.5)
    advance(s)
    select(s, 'a')
    check(s, regenerate)
    advance(s)
    expect(s.phase).toBe('won')
    expect(progress(s)).toBe(1)
    expect(s.firstTry).toBe(2)
  })

  it('a wrong answer costs a heart and brings the question back at the end, as a retry', () => {
    const s = startSession([q('x'), q('y')])
    select(s, 'b')
    const v = check(s, regenerate)
    expect(v.correct).toBe(false)
    expect(s.hearts).toBe(4)
    expect(s.steps).toHaveLength(3)
    const last = s.steps[2]!
    expect(last.type === 'question' && last.isRetry && last.exercise.cardId).toBe('x')
    expect(progress(s)).toBe(0)
  })

  it('progress never goes back after a mistake', () => {
    const s = startSession([q('x'), q('y'), q('z')])
    select(s, 'a'); check(s, regenerate); advance(s)
    const before = progress(s)
    select(s, 'b'); check(s, regenerate)
    expect(progress(s)).toBe(before)
  })

  it('a right answer to a retry is not a first-try success', () => {
    const s = startSession([q('x')])
    select(s, 'b'); check(s, regenerate); advance(s)
    select(s, 'a'); check(s, regenerate); advance(s)
    expect(s.phase).toBe('won')
    expect(s.firstTry).toBe(0)
    expect(s.questions).toBe(1)
    expect(s.answers).toEqual([
      { cardId: 'x', correct: false, isRetry: false },
      { cardId: 'x', correct: true, isRetry: true },
    ])
  })

  it('the lesson is lost when hearts run out', () => {
    const s = startSession([q('x'), q('y')], { hearts: 1 })
    select(s, 'b'); check(s, regenerate); advance(s)
    expect(s.phase).toBe('lost')
  })

  it('tracks the best combo', () => {
    const s = startSession([q('a'), q('b'), q('c'), q('d')])
    for (const choice of ['a', 'a', 'b', 'a']) {
      select(s, choice); check(s, regenerate); advance(s)
    }
    expect(s.maxCombo).toBe(2)
    expect(s.combo).toBe(1)
  })

  it('passive steps (tip, intro) only need to be continued', () => {
    const s = startSession<BaseExercise>([{ type: 'tip' }, { type: 'intro', cardId: 'x' }, q('x')])
    advance(s)
    advance(s)
    expect(s.index).toBe(2)
    expect(progress(s)).toBeCloseTo(2 / 3)
  })

  it('refuses to check without a choice, or twice', () => {
    const s = startSession([q('x')])
    expect(() => check(s, regenerate)).toThrow()
    select(s, 'a'); check(s, regenerate)
    expect(() => check(s, regenerate)).toThrow()
    expect(() => select(s, 'b')).toThrow()
  })
})
