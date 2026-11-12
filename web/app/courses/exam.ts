/**
 * Mock exam in the official format (arrêté du 28 septembre 2007, art. 1.1): 40 questions, 5 errors allowed,
 * about 30 minutes. Questions are drawn evenly from every unit, using each unit's review lesson.
 */
import { pick, shuffle, type Random } from '~/engine/random'
import type { Step } from '~/engine/types'
import type { Course, CourseExercise } from './types'

export const EXAM = { questions: 40, maxErrors: 5, minutes: 30 } as const
export const EXAM_ID = 'examen'

export function buildExam(courses: Course[], rng: Random, total: number = EXAM.questions): Step<CourseExercise>[] {
  const base = Math.floor(total / courses.length)
  const extra = new Set(shuffle(courses.map((_, i) => i), rng).slice(0, total - base * courses.length))
  const seen = new Set<string>()
  const steps: Step<CourseExercise>[] = []

  courses.forEach((course, i) => {
    const review = course.lessons.find(l => l.plan.review) ?? course.lessons.at(-1)!
    const generate = course.generator(review)
    const cards = [...new Set(course.lessons.flatMap(l => l.plan.cards))]
    let wanted = base + (extra.has(i) ? 1 : 0)
    let guard = wanted * 50
    while (wanted > 0 && guard-- > 0) {
      const cardId = pick(cards, rng)
      for (const kind of shuffle(review.plan.kinds, rng)) {
        const exercise = generate(cardId, kind, rng)
        const key = exercise && `${exercise.cardId}|${exercise.prompt}`
        if (exercise && !seen.has(key!)) {
          seen.add(key!)
          steps.push({ type: 'question', exercise, isRetry: false })
          wanted--
          break
        }
      }
    }
  })
  return shuffle(steps, rng)
}
