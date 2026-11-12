import { describe, expect, it } from 'vitest'
import { COURSES, findLesson, LESSON_IDS } from './index'

describe('courses', () => {
  it('lesson ids are unique across courses', () => {
    expect(new Set(LESSON_IDS).size).toBe(LESSON_IDS.length)
  })

  it('card ids are unique across courses (mastery is keyed by card)', () => {
    const cards = COURSES.flatMap(c => [...new Set(c.lessons.flatMap(l => l.plan.cards))])
    expect(new Set(cards).size).toBe(cards.length)
  })

  it('every card of every lesson has an intro', () => {
    for (const c of COURSES) for (const l of c.lessons) for (const id of l.plan.cards) {
      expect(c.card(id).intro.length).toBeGreaterThan(10)
    }
  })

  it('finds a lesson and its course', () => {
    expect(findLesson('voilier')?.course.id).toBe('navires')
    expect(findLesson('nope')).toBeUndefined()
  })
})
