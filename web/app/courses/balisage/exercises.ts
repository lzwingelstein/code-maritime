/**
 * Turns a mark and an exercise kind into a question. Six kinds:
 * identify (mark → name), find (name → mark), side (where to pass), light (night light → mark),
 * meaning (what it means → mark) and truefalse (a statement about the mark).
 */
import type { BaseExercise } from '~/engine/types'
import { shuffle, type Random } from '~/engine/random'
import { MARK_IDS, MARKS, SIDE_LABELS, type MarkId } from './marks'
import type { Lesson } from './lessons'

export const KINDS = ['identify', 'find', 'side', 'light', 'meaning', 'truefalse'] as const
export type Kind = typeof KINDS[number]

export type Visual =
  | { type: 'mark', markId: MarkId, topOnly: boolean }
  | { type: 'light', markId: MarkId }

export interface Choice {
  id: string
  /** Text choice. */
  label?: string
  /** Picture choice: the mark to draw. */
  markId?: MarkId
}

export interface MarkExercise extends BaseExercise {
  cardId: MarkId
  kind: Kind
  /** Small heading above the question. */
  heading: string
  prompt: string
  visual: Visual | null
  layout: 'list' | 'grid' | 'pair'
  topOnly: boolean
  choices: Choice[]
  /** truefalse: index of the statement, kept when the question comes back. */
  statement?: number
}

/** Marks to draw the wrong choices from: the lesson's own, or in a review, the same family first. */
function distractorPool(lesson: Lesson, id: MarkId): MarkId[] {
  if (!lesson.plan.review) return lesson.plan.cards
  const family = MARK_IDS.filter(m => MARKS[m].family === MARKS[id].family)
  return family.length >= 4 ? family : [...family, ...MARK_IDS.filter(m => !family.includes(m))]
}

function options(answer: MarkId, pool: MarkId[], rng: Random): MarkId[] {
  const others = shuffle(pool.filter(m => m !== answer), rng).slice(0, 3)
  return shuffle([answer, ...others], rng)
}

export function exerciseGenerator(lesson: Lesson) {
  const topOnly = !!lesson.topOnly
  return (cardId: string, kind: string, rng: Random, statement?: number): MarkExercise | null => {
    const id = cardId as MarkId
    const mark = MARKS[id]
    if (!mark) return null
    const base = { cardId: id, kind: kind as Kind, topOnly }
    const named = () => options(id, distractorPool(lesson, id), rng).map(m => ({ id: m, label: MARKS[m].name }))
    const drawn = () => options(id, distractorPool(lesson, id), rng).map(m => ({ id: m, markId: m }))

    switch (kind) {
      case 'identify':
        return {
          ...base, heading: 'Reconnaître', answer: id, layout: 'list', choices: named(),
          prompt: topOnly ? 'À quelle marque appartient ce voyant ?' : 'Quelle est cette marque ?',
          visual: { type: 'mark', markId: id, topOnly },
        }
      case 'find':
        return {
          ...base, heading: 'Retrouver', answer: id, layout: 'grid', choices: drawn(),
          prompt: `Touche la marque « ${mark.name} »`, visual: null,
        }
      case 'side': {
        if (!mark.side) return null
        const lateral = mark.family === 'lateral'
        const sides = lateral ? ['babord', 'tribord'] as const : ['N', 'E', 'S', 'W'] as const
        return {
          ...base, heading: 'Naviguer', answer: mark.side, topOnly: false,
          layout: lateral ? 'pair' : 'list',
          prompt: lateral ? 'En rentrant au port, je laisse cette marque à…' : 'Où sont les eaux saines ?',
          visual: { type: 'mark', markId: id, topOnly: false },
          choices: sides.map(s => ({ id: s, label: SIDE_LABELS[s] })),
        }
      }
      case 'light':
        return {
          ...base, heading: 'De nuit', answer: id, layout: 'list', choices: named(), topOnly: false,
          prompt: 'Quelle marque montre ce feu ?', visual: { type: 'light', markId: id },
        }
      case 'meaning':
        return {
          ...base, heading: 'Comprendre', answer: id, layout: 'grid', choices: drawn(),
          prompt: `Quelle marque signifie : « ${mark.meaning} » ?`, visual: null,
        }
      case 'truefalse': {
        const index = statement ?? Math.floor(rng() * mark.statements.length)
        const [text, truth] = mark.statements[index]!
        return {
          ...base, heading: 'Vrai ou faux ?', answer: String(truth), layout: 'pair', prompt: text, statement: index,
          visual: { type: 'mark', markId: id, topOnly },
          choices: [{ id: 'true', label: 'Vrai' }, { id: 'false', label: 'Faux' }],
        }
      }
      default:
        return null
    }
  }
}

/** A wrong question comes back in the same form with new choices (same statement for true/false). */
export function regenerator(lesson: Lesson, rng: Random) {
  const generate = exerciseGenerator(lesson)
  return (e: MarkExercise): MarkExercise => generate(e.cardId, e.kind, rng, e.statement) ?? e
}

/** Short explanation shown after a wrong answer. */
export function explain(e: MarkExercise): string {
  const mark = MARKS[e.cardId]
  if (e.kind === 'light') return `${mark.name} : ${mark.light.description}.`
  if (e.kind === 'side' && mark.side) {
    return mark.family === 'lateral'
      ? `${mark.name} : on la laisse à ${mark.side === 'babord' ? 'bâbord' : 'tribord'} en rentrant au port.`
      : `${mark.name} : les eaux saines sont ${SIDE_LABELS[mark.side].toLowerCase().replace(' de la marque', '')}.`
  }
  return mark.intro.replaceAll('**', '')
}

export function choiceLabel(e: MarkExercise, choiceId: string): string {
  const c = e.choices.find(x => x.id === choiceId)
  return c?.label ?? (c?.markId ? MARKS[c.markId].name : choiceId)
}

