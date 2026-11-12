import { describe, expect, it } from 'vitest'
import { seeded } from '~/engine/random'
import { buildExam, EXAM } from './exam'
import { COURSES } from './index'

describe('mock exam', () => {
  it('has the official number of questions, all of them questions', () => {
    const steps = buildExam(COURSES, seeded(1))
    expect(steps).toHaveLength(EXAM.questions)
    expect(steps.every(s => s.type === 'question')).toBe(true)
    expect(EXAM).toEqual({ questions: 40, maxErrors: 5, minutes: 30 })
  })

  it('draws from every unit, evenly', () => {
    const steps = buildExam(COURSES, seeded(2))
    const cardsByCourse = COURSES.map(c => new Set(c.lessons.flatMap(l => l.plan.cards)))
    const counts = cardsByCourse.map(cards => steps.filter(s => s.type === 'question' && cards.has(s.exercise.cardId)).length)
    expect(Math.min(...counts)).toBeGreaterThanOrEqual(Math.floor(EXAM.questions / COURSES.length))
  })

  it('never asks the same question twice', () => {
    for (const seed of [3, 4, 5]) {
      const keys = buildExam(COURSES, seeded(seed)).map(s => s.type === 'question' ? `${s.exercise.cardId}|${s.exercise.prompt}` : '')
      expect(new Set(keys).size).toBe(keys.length)
    }
  })

  it('is deterministic for a seed', () => {
    expect(buildExam(COURSES, seeded(9))).toEqual(buildExam(COURSES, seeded(9)))
  })
})
