import { describe, expect, it } from 'vitest'
import { seeded } from '~/engine/random'
import { COURSES } from './index'

/**
 * A picture must carry the question, never mislead or give the answer away.
 * True/false statements are self-contained: they show no picture.
 */
describe('question pictures', () => {
  for (const course of COURSES) {
    it(`${course.id}: true/false questions show no picture`, () => {
      for (const lesson of course.lessons) {
        const generate = course.generator(lesson)
        for (const id of new Set(lesson.plan.cards)) {
          for (let i = 0; i < 3; i++) {
            const e = generate(id, 'truefalse', seeded(i))
            if (e) expect(e.visual).toBeNull()
          }
        }
      }
    })

    it(`${course.id}: questions never show a decorative emoji`, () => {
      for (const lesson of course.lessons) {
        const generate = course.generator(lesson)
        for (const id of new Set(lesson.plan.cards)) {
          for (const kind of lesson.plan.kinds) {
            const e = generate(id, kind, seeded(1))
            if (e?.visual) expect(e.visual.type).not.toBe('emoji')
          }
        }
      }
    })
  }
})
