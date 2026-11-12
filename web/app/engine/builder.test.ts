import { describe, expect, it } from 'vitest'
import { buildLesson, lessonXp } from './builder'
import { seeded } from './random'
import type { BaseExercise } from './types'

const generate = (cardId: string, kind: string): (BaseExercise & { kind: string }) | null =>
  kind === 'never' ? null : { cardId, kind, answer: cardId, choices: [{ id: cardId }] }

const questions = <E>(steps: { type: string, exercise?: E }[]) =>
  steps.filter(s => s.type === 'question').map(s => s.exercise as E)

describe('buildLesson', () => {
  it('opens with the tip, then an intro and a first question for each new card', () => {
    const steps = buildLesson(
      { cards: ['a', 'b'], count: 4, kinds: ['k'], tip: true },
      { rng: seeded(1), isKnown: () => false, generate, firstKind: 'first' },
    )
    expect(steps.slice(0, 5).map(s => s.type)).toEqual(['tip', 'intro', 'question', 'intro', 'question'])
    expect(questions<{ kind: string }>(steps).slice(0, 2).map(e => e.kind)).toEqual(['first', 'first'])
    expect(questions(steps)).toHaveLength(4)
  })

  it('skips intros for known cards', () => {
    const steps = buildLesson(
      { cards: ['a', 'b'], count: 3, kinds: ['k'] },
      { rng: seeded(2), isKnown: () => true, generate, firstKind: 'first' },
    )
    expect(steps.every(s => s.type === 'question')).toBe(true)
    expect(steps).toHaveLength(3)
  })

  it('never asks about the same card twice in a row', () => {
    const steps = buildLesson(
      { cards: ['a', 'b', 'c'], count: 30, kinds: ['k'] },
      { rng: seeded(3), isKnown: () => true, generate, firstKind: 'k' },
    )
    const ids = questions<BaseExercise>(steps).map(e => e.cardId)
    ids.forEach((id, i) => { if (i) expect(id).not.toBe(ids[i - 1]) })
  })

  it('only uses kinds the generator accepts for a card', () => {
    const steps = buildLesson(
      { cards: ['a', 'b'], count: 10, kinds: ['never', 'k'] },
      { rng: seeded(4), isKnown: () => true, generate, firstKind: 'k' },
    )
    expect(questions<{ kind: string }>(steps).every(e => e.kind === 'k')).toBe(true)
  })

  it('favours heavier cards in review lessons', () => {
    const steps = buildLesson(
      { cards: ['weak', 'x', 'y', 'z'], count: 200, kinds: ['k'], review: true },
      { rng: seeded(5), isKnown: () => true, generate, firstKind: 'k', weight: id => (id === 'weak' ? 20 : 1) },
    )
    const weak = questions<BaseExercise>(steps).filter(e => e.cardId === 'weak').length
    expect(weak).toBeGreaterThan(70)
  })

  it('is deterministic for a given seed', () => {
    const plan = { cards: ['a', 'b', 'c'], count: 8, kinds: ['k', 'l'] }
    const ctx = { isKnown: () => true, generate, firstKind: 'k' }
    expect(buildLesson(plan, { ...ctx, rng: seeded(9) })).toEqual(buildLesson(plan, { ...ctx, rng: seeded(9) }))
  })
})

describe('lessonXp', () => {
  it('gives 10, +5 when no heart was lost, +1 per 3-answer combo up to 5', () => {
    expect(lessonXp({ hearts: 3, maxHearts: 5, maxCombo: 2 })).toBe(10)
    expect(lessonXp({ hearts: 5, maxHearts: 5, maxCombo: 7 })).toBe(17)
    expect(lessonXp({ hearts: 5, maxHearts: 5, maxCombo: 40 })).toBe(20)
  })
})
