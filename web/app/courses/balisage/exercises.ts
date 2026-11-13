/**
 * Turns a mark and an exercise kind into a question. Six kinds:
 * identify (mark → name), find (name → mark), side (where to pass), light (night light → mark),
 * meaning (what it means → mark) and truefalse (a statement about the mark).
 */
import type { Random } from '~/engine/random'
import { familyPool, options, plain, trueFalse } from '../shared'
import type { CourseExercise, Generator, Lesson, Visual } from '../types'
import { MARK_IDS, MARKS, SIDE_LABELS, type MarkId } from './marks'

export const KINDS = ['identify', 'find', 'side', 'light', 'meaning', 'truefalse'] as const
export type Kind = typeof KINDS[number]

/** Lessons of this course may show topmarks only. */
export type BalisageLesson = Lesson & { topOnly?: boolean }

function explain(id: MarkId, kind: string): string {
  const mark = MARKS[id]
  if (kind === 'light') return `${mark.name} : ${mark.light.description}.`
  if (kind === 'side' && mark.side) {
    return mark.family === 'lateral'
      ? `${mark.name} : on la laisse à ${mark.side === 'babord' ? 'bâbord' : 'tribord'} en rentrant au port.`
      : `${mark.name} : les eaux saines sont ${SIDE_LABELS[mark.side].toLowerCase().replace(' de la marque', '')}.`
  }
  return plain(mark.intro)
}

export function exerciseGenerator(lesson: BalisageLesson): Generator {
  const topOnly = !!lesson.topOnly
  const pool = (id: MarkId) => lesson.plan.review
    ? familyPool(MARK_IDS, m => MARKS[m].family, id)
    : lesson.plan.cards as MarkId[]

  return (cardId: string, kind: string, rng: Random, statement?: number): CourseExercise | null => {
    const id = cardId as MarkId
    const mark = MARKS[id]
    if (!mark) return null
    const markVisual = (m: MarkId, top = topOnly): Visual => ({ type: 'mark', markId: m, topOnly: top })
    const named = () => options(id, pool(id), rng).map(m => ({ id: m, name: MARKS[m].name }))
    const drawn = () => options(id, pool(id), rng).map(m => ({ id: m, name: MARKS[m].name, visual: markVisual(m) }))
    const base = { cardId: id, kind, explanation: explain(id, kind) }

    switch (kind) {
      case 'identify':
        return {
          ...base, heading: 'Reconnaître', answer: id, layout: 'list', choices: named(),
          prompt: topOnly ? 'À quelle marque appartient ce voyant ?' : 'Quelle est cette marque ?',
          visual: markVisual(id),
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
          ...base, heading: 'Naviguer', answer: mark.side, layout: lateral ? 'pair' : 'list',
          prompt: lateral ? 'En rentrant au port, je laisse cette marque à…' : 'Où sont les eaux saines ?',
          visual: markVisual(id, false),
          choices: sides.map(s => ({ id: s, name: SIDE_LABELS[s] })),
        }
      }
      case 'light':
        return {
          ...base, heading: 'De nuit', answer: id, layout: 'list', choices: named(),
          prompt: 'Quelle marque montre ce feu ?', visual: { type: 'light', markId: id },
          afterRight: `${mark.light.description}.`,
        }
      case 'meaning':
        return {
          ...base, heading: 'Comprendre', answer: id, layout: 'grid', choices: drawn(),
          prompt: `Quelle marque signifie : « ${mark.meaning} » ?`, visual: null,
        }
      case 'truefalse':
        return trueFalse(id, mark.statements, rng, statement, plain(mark.intro))
      default:
        return null
    }
  }
}
