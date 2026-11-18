import { describe, expect, it } from 'vitest'
import { COURSES, EXAM_COURSES, findLesson, LESSON_IDS } from './index'
import { PICTOS, TONES } from './pictos'

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

describe('exam courses', () => {
  it('leave out the boat basics, which are not an exam point', () => {
    expect(EXAM_COURSES.map(c => c.id)).not.toContain('bases')
    expect(EXAM_COURSES).toHaveLength(COURSES.length - 1)
  })
})

describe('sheet pictures', () => {
  it('never shows an emoji on a card: drawn scenes or illustrations only', () => {
    for (const c of COURSES) {
      for (const id of new Set(c.lessons.flatMap(l => l.plan.cards))) {
        const v = c.card(id).visual
        expect(v.type, `${c.id}/${id}`).not.toBe('emoji')
        if (v.type === 'picto') {
          expect(PICTOS[v.name], `${c.id}/${id}`).toBeDefined()
          expect(TONES[v.tone], `${c.id}/${id}`).toBeDefined()
        }
      }
    }
  })
})
