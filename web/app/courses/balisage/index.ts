import type { Course } from '../types'
import { exerciseGenerator, type BalisageLesson } from './exercises'
import { COURSE, LESSONS } from './lessons'
import { MARKS, type MarkId } from './marks'

export const balisage: Course = {
  ...COURSE,
  lessons: LESSONS,
  card: (id) => {
    const m = MARKS[id as MarkId]
    return { name: m.name, intro: m.intro, note: `🌙 ${m.light.description}`, badge: 'Nouvelle marque', visual: { type: 'mark', markId: m.id, topOnly: false } }
  },
  generator: lesson => exerciseGenerator(lesson as BalisageLesson),
}
