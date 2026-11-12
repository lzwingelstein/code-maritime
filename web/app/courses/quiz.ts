/**
 * Quiz course factory: a course written as cards with authored multiple-choice questions and true/false statements.
 * For units that are mostly rules and numbers (safety, regulations, VHF, weather…).
 * Two kinds: qcm (one authored question, its answer and up to three wrong choices) and truefalse.
 */
import { shuffle, type Random } from '~/engine/random'
import { plain, trueFalse } from './shared'
import type { Course, CourseExercise, Lesson, Tip, Visual } from './types'

export interface QuizQuestion {
  prompt: string
  answer: string
  /** One or more wrong answers; three are drawn at most. */
  wrong: string[]
  visual?: Visual
  heading?: string
  /** Shown after a wrong answer; defaults to the card intro. */
  explanation?: string
}

export interface QuizCard {
  id: string
  name: string
  /** **bold** is rendered. */
  intro: string
  visual: Visual
  note?: string
  questions: QuizQuestion[]
  statements: [string, boolean][]
}

export interface QuizLessonDef {
  id: string
  title: string
  icon: Visual
  cards: string[]
  count?: number
  tip?: Tip
  review?: boolean
}

export type QuizCourse = Course & { cards: QuizCard[] }

export function quizCourse(def: {
  id: string
  unit: string
  title: string
  /** Label of the intro card: « Nouvelle règle », « Nouveau signal »… */
  badge: string
  cards: QuizCard[]
  lessons: QuizLessonDef[]
}): QuizCourse {
  const byId = new Map(def.cards.map(c => [c.id, c]))

  const lessons: Lesson[] = def.lessons.map(l => ({
    id: l.id,
    title: l.title,
    icon: l.icon,
    tip: l.tip,
    firstKind: 'qcm',
    plan: { cards: l.cards, count: l.count ?? 8, kinds: ['qcm', 'qcm', 'truefalse'], tip: !!l.tip, review: l.review },
  }))

  const generate = (cardId: string, kind: string, rng: Random, index?: number): CourseExercise | null => {
    const card = byId.get(cardId)
    if (!card) return null
    if (kind === 'truefalse') return trueFalse(card.id, card.statements, rng, index, card.visual, plain(card.intro))
    if (kind !== 'qcm') return null
    const i = index ?? Math.floor(rng() * card.questions.length)
    const q = card.questions[i]!
    const labels = shuffle([q.answer, ...shuffle(q.wrong, rng).slice(0, 3)], rng)
    return {
      cardId: card.id, kind, statement: i, heading: q.heading ?? card.name, prompt: q.prompt, answer: q.answer,
      layout: labels.length === 2 ? 'pair' : 'list', visual: q.visual ?? null,
      choices: labels.map(label => ({ id: label, name: label })),
      explanation: q.explanation ?? plain(card.intro),
    }
  }

  return {
    id: def.id,
    unit: def.unit,
    title: def.title,
    lessons,
    cards: def.cards,
    card: (id) => {
      const c = byId.get(id)!
      return { name: c.name, intro: c.intro, visual: c.visual, note: c.note, badge: def.badge }
    },
    generator: () => generate,
  }
}
