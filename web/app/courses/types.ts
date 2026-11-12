/**
 * What a course gives the app: its cards, its lessons and an exercise generator.
 * The lesson page and the home path only know these types, never a specific course.
 */
import type { LessonPlan } from '~/engine/builder'
import type { Random } from '~/engine/random'
import type { BaseExercise } from '~/engine/types'
import type { ExtraMarkId, MarkId } from './balisage/marks'
import type { Aspect, VesselId } from './navires/vessels'

/** Something to draw: the question picture, a picture choice, a card, a path icon. */
export type Visual =
  | { type: 'mark', markId: MarkId | ExtraMarkId, topOnly: boolean }
  | { type: 'light', markId: MarkId }
  | { type: 'ship', vesselId: VesselId, aspect: Aspect, mode: 'night' | 'day', silhouette?: boolean }
  | { type: 'emoji', char: string }

export interface Choice {
  id: string
  /** Name of the choice, used in the verdict; shown as the button text when there is no picture. */
  name: string
  visual?: Visual
}

export interface CourseExercise extends BaseExercise {
  kind: string
  /** Small heading above the question. */
  heading: string
  prompt: string
  visual: Visual | null
  layout: 'list' | 'grid' | 'pair'
  choices: Choice[]
  /** Shown after a wrong answer. */
  explanation: string
  /** Shown after a right answer, when worth it (a light rhythm…). */
  afterRight?: string
  /** truefalse: index of the statement, kept when the question comes back. */
  statement?: number
}

export interface Tip {
  emoji: string
  title: string
  /** **bold** is rendered. */
  text: string
}

export interface Lesson {
  id: string
  title: string
  icon: Visual
  plan: LessonPlan
  /** Kind of the first question after a new card. */
  firstKind: string
  tip?: Tip
}

export interface CardInfo {
  name: string
  /** **bold** is rendered. */
  intro: string
  visual: Visual
  /** Small line under the intro (a light rhythm…). */
  note?: string
  /** Label above the card name: « Nouvelle marque », « Nouveau navire »… */
  badge: string
}

export type Generator = (cardId: string, kind: string, rng: Random, statement?: number) => CourseExercise | null

export interface Course {
  id: string
  unit: string
  title: string
  lessons: Lesson[]
  card: (id: string) => CardInfo
  generator: (lesson: Lesson) => Generator
}
