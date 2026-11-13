/**
 * Ship exercises. Six kinds:
 * identify (night lights → vessel), find (vessel → night scene), aspect (from which side do I see it),
 * truefalse, dayshape (day shapes → vessel) and dayfind (vessel → day shapes).
 */
import { pick, type Random } from '~/engine/random'
import { familyPool, options, plain, trueFalse } from '../shared'
import type { CourseExercise, Generator, Lesson, Visual } from '../types'
import { ASPECT_LABELS, ASPECTS, VESSEL_IDS, VESSELS, type Aspect, type VesselId } from './vessels'

export const KINDS = ['identify', 'find', 'aspect', 'truefalse', 'dayshape', 'dayfind'] as const

/** Vessels whose lights change enough with the aspect to ask "from which side". */
export const ASPECT_VESSELS: VesselId[] = ['power', 'power50', 'sail']

export const ASPECT_EXPLAIN: Record<Aspect, string> = {
  ahead: 'De face, on voit ses deux feux de côté, le rouge à droite et le vert à gauche (et le feu de tête de mât d’un navire à moteur) : il vient vers moi.',
  starboard: 'On voit son feu vert : on le voit par son tribord, il va vers la droite.',
  port: 'On voit son feu rouge : on le voit par son bâbord, il va vers la gauche.',
  astern: 'On ne voit que son feu blanc de poupe : on le voit par l’arrière, il s’éloigne.',
}

const sameShapes = (a: VesselId, b: VesselId) =>
  JSON.stringify(VESSELS[a].shapes) === JSON.stringify(VESSELS[b].shapes)

export const night = (vesselId: VesselId, aspect: Aspect, silhouette = false): Visual =>
  ({ type: 'ship', vesselId, aspect, mode: 'night', silhouette })
export const day = (vesselId: VesselId): Visual => ({ type: 'ship', vesselId, aspect: 'starboard', mode: 'day' })

/** An aspect that shows enough to recognise the vessel (never from astern, where most show one white light). */
function viewAspect(id: VesselId, rng: Random): Aspect {
  return id === 'anchor' ? 'ahead' : pick(['ahead', 'starboard', 'port'] as const, rng)
}

export function exerciseGenerator(lesson: Lesson): Generator {
  const cards = lesson.plan.cards as VesselId[]
  const basePool = (id: VesselId) => lesson.plan.review
    ? familyPool(VESSEL_IDS, v => (VESSELS[v].shapes ? 'day' : 'night'), id)
    : cards
  const nightPool = (id: VesselId) => basePool(id).filter(v => VESSELS[v].night)
  const dayPool = (id: VesselId) => basePool(id).filter(v => VESSELS[v].shapes && (v === id || !sameShapes(v, id)))

  return (cardId: string, kind: string, rng: Random, statement?: number): CourseExercise | null => {
    const id = cardId as VesselId
    const v = VESSELS[id]
    if (!v) return null
    const base = { cardId: id, kind, explanation: plain(v.intro) }

    switch (kind) {
      case 'identify':
        if (!v.night || nightPool(id).length < 2) return null
        return {
          ...base, heading: 'De nuit', answer: id, layout: 'list', prompt: 'Quel navire montre ces feux ?',
          visual: night(id, viewAspect(id, rng)),
          choices: options(id, nightPool(id), rng).map(x => ({ id: x, name: VESSELS[x].name })),
        }
      case 'find': {
        if (!v.night || nightPool(id).length < 2) return null
        const aspect = viewAspect(id === 'anchor' ? 'power' : id, rng)
        return {
          ...base, heading: 'Retrouver', answer: id, layout: 'grid', prompt: `Touche : « ${v.name} »`, visual: null,
          choices: options(id, nightPool(id), rng).map(x => ({ id: x, name: VESSELS[x].name, visual: night(x, aspect) })),
        }
      }
      case 'aspect': {
        if (!ASPECT_VESSELS.includes(id)) return null
        const aspect = pick(ASPECTS, rng)
        return {
          ...base, heading: 'Sous quel angle ?', answer: aspect, layout: 'list',
          prompt: `Voici un ${v.name.charAt(0).toLowerCase()}${v.name.slice(1)}. Comment le vois-tu ?`,
          visual: night(id, aspect), explanation: ASPECT_EXPLAIN[aspect],
          choices: ASPECTS.map(a => ({ id: a, name: ASPECT_LABELS[a] })),
        }
      }
      case 'dayshape':
        if (!v.shapes || dayPool(id).length < 2) return null
        return {
          ...base, heading: 'De jour', answer: id, layout: 'list', prompt: 'Que signale cette marque de jour ?',
          visual: day(id), choices: options(id, dayPool(id), rng).map(x => ({ id: x, name: VESSELS[x].name })),
        }
      case 'dayfind':
        if (!v.shapes || dayPool(id).length < 2) return null
        return {
          ...base, heading: 'De jour', answer: id, layout: 'grid', prompt: `Touche la marque de jour : « ${v.name} »`, visual: null,
          choices: options(id, dayPool(id), rng).map(x => ({ id: x, name: VESSELS[x].name, visual: day(x) })),
        }
      case 'truefalse':
        return trueFalse(id, v.statements, rng, statement, plain(v.intro))
      default:
        return null
    }
  }
}
