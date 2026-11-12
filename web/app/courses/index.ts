/** All courses, in path order. A lesson id is unique across courses (it is the lesson URL). */
import type { Random } from '~/engine/random'
import { balisage } from './balisage'
import { barre } from './barre'
import { navires } from './navires'
import { plages } from './plages'
import type { QuizCourse } from './quiz'
import type { Course, CourseExercise, Generator, Lesson } from './types'

export const COURSES: Course[] = [balisage, navires, plages, barre]

/** Courses written as authored quizzes: their content is checked by quiz.test.ts. */
export const QUIZ_COURSES: QuizCourse[] = [plages, barre]

export const LESSON_IDS = COURSES.flatMap(c => c.lessons.map(l => l.id))

export function findLesson(id: string): { course: Course, lesson: Lesson } | undefined {
  for (const course of COURSES) {
    const lesson = course.lessons.find(l => l.id === id)
    if (lesson) return { course, lesson }
  }
  return undefined
}

/** A wrong question comes back in the same form with new choices (same statement for true/false). */
export function regenerator(generate: Generator, rng: Random) {
  return (e: CourseExercise): CourseExercise => generate(e.cardId, e.kind, rng, e.statement) ?? e
}

export function choiceName(e: CourseExercise, id: string): string {
  return e.choices.find(c => c.id === id)?.name ?? id
}
