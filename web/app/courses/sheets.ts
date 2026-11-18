import type { Course, Lesson } from './types'

/**
 * The revision sheets: for each unit, its done lessons (reviews left out, they only mix the others)
 * with the cards they introduce, each card shown once per unit, in path order.
 */
export function revisionSheets(courses: Course[], completions: Record<string, number>) {
  return courses
    .map((course) => {
      const shown = new Set<string>()
      const lessons = course.lessons
        .filter(l => !l.plan.review && (completions[l.id] ?? 0) > 0)
        .map((lesson: Lesson) => {
          const cards = lesson.plan.cards.filter(id => !shown.has(id))
          cards.forEach(id => shown.add(id))
          return { lesson, cards }
        })
        .filter(l => l.cards.length || l.lesson.tip)
      return { course, lessons }
    })
    .filter(u => u.lessons.length)
}
