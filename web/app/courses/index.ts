/** All courses, in path order. A lesson id is unique across courses (it is the lesson URL). */
import type { Random } from '~/engine/random'
import { alphabet } from './alphabet'
import { ALPHABET_CARDS } from './alphabet/letters'
import { balisage } from './balisage'
import { bases } from './bases'
import { barre } from './barre'
import { environnement } from './environnement'
import { meteo } from './meteo'
import { navires } from './navires'
import { plages } from './plages'
import { reglementation } from './reglementation'
import { securite } from './securite'
import { signaux } from './signaux'
import { vhf } from './vhf'
import type { QuizCourse } from './quiz'
import type { Course, CourseExercise, Generator, Lesson } from './types'

export const COURSES: Course[] = [bases, balisage, navires, plages, barre, signaux, securite, reglementation, vhf, alphabet, meteo, environnement]

/** Courses written as authored quizzes: their content is checked by quiz.test.ts. */
export const QUIZ_COURSES: QuizCourse[] = [bases, plages, barre, signaux, securite, reglementation, vhf, meteo, environnement]

/** Courses the mock exam draws from: the official programme only (the boat basics are not an exam point). */
export const EXAM_COURSES: Course[] = COURSES.filter(c => c.id !== bases.id && c.id !== alphabet.id)

/** Cards split since an earlier version: old id → new ids (progress is migrated on load). */
export const CARD_RENAMES: Record<string, readonly string[]> = { alphabet: ALPHABET_CARDS }

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
