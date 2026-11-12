import type { Course, Lesson } from '../types'
import { day, exerciseGenerator, night } from './exercises'
import { VESSEL_IDS, VESSELS, type VesselId } from './vessels'

const icon = (char: string) => ({ type: 'emoji' as const, char })

export const LESSONS: Lesson[] = [
  {
    id: 'navire-moteur', title: 'Navire à moteur', icon: icon('🚤'), firstKind: 'aspect',
    plan: { cards: ['power', 'power50'], count: 8, kinds: ['aspect', 'aspect', 'identify', 'truefalse'], tip: true },
    tip: {
      emoji: '🔦', title: 'Chaque feu a son secteur',
      text: 'Le **feu de tête de mât** (blanc) éclaire vers l’avant. Les **feux de côté** : **rouge à bâbord**, **vert à tribord**. Le **feu de poupe** (blanc) éclaire vers l’arrière. Les feux que tu vois disent donc **sous quel angle** tu vois le navire.',
    },
  },
  {
    id: 'voilier', title: 'Le voilier', icon: icon('⛵'), firstKind: 'identify',
    plan: { cards: ['power', 'sail'], count: 8, kinds: ['aspect', 'identify', 'find', 'truefalse'], tip: true },
    tip: {
      emoji: '⛵', title: 'Pas de blanc en haut',
      text: 'Un voilier sous voiles n’a **pas de feu de tête de mât**. Rouge et vert sans blanc au-dessus : c’est un voilier.',
    },
  },
  {
    id: 'peche-pilote', title: 'Pêche et pilote', icon: icon('🎣'), firstKind: 'identify',
    plan: { cards: ['trawler', 'fishing', 'pilot'], count: 10, kinds: ['identify', 'identify', 'find', 'truefalse'], tip: true },
    tip: {
      emoji: '🧠', title: 'Lis de haut en bas',
      text: '**Vert sur blanc** : chalutier en pêche. **Rouge sur blanc** : autre pêcheur. **Blanc sur rouge** : pilote en service. Ces feux sont visibles **sur tout l’horizon**.',
    },
  },
  {
    id: 'navires-genes', title: 'Mouillage et navires gênés', icon: icon('⚓'), firstKind: 'identify',
    plan: { cards: ['anchor', 'nuc', 'ram', 'cbd'], count: 10, kinds: ['identify', 'identify', 'find', 'truefalse'], tip: true },
    tip: {
      emoji: '🚨', title: 'Compte les rouges',
      text: '**Un blanc seul** : au mouillage. **Deux rouges** : non maître de sa manœuvre. **Rouge, blanc, rouge** : capacité de manœuvre restreinte. **Trois rouges** : handicapé par son tirant d’eau.',
    },
  },
  {
    id: 'marques-jour', title: 'Marques de jour', icon: icon('☀️'), firstKind: 'dayshape',
    plan: { cards: ['anchor', 'trawler', 'nuc', 'ram', 'cbd', 'motorsail'], count: 10, kinds: ['dayshape', 'dayfind'], tip: true },
    tip: {
      emoji: '☀️', title: 'Les mêmes idées, en formes noires',
      text: 'Mouillage : **une boule**. Non maître de sa manœuvre : **deux boules**. Capacité restreinte : **boule, losange, boule**. Tirant d’eau : **cylindre**. Pêche : **deux cônes pointe contre pointe**. Voilier au moteur : **cône pointe en bas**.',
    },
  },
  {
    id: 'revision-navires', title: 'Révision', icon: icon('🧭'), firstKind: 'identify',
    plan: { cards: VESSEL_IDS, count: 12, kinds: ['identify', 'find', 'aspect', 'truefalse', 'dayshape', 'dayfind'], review: true },
  },
]

export const navires: Course = {
  id: 'navires',
  unit: 'Unité 2 · Permis côtier',
  title: 'Feux et marques des navires',
  lessons: LESSONS,
  card: (id) => {
    const v = VESSELS[id as VesselId]
    return { name: v.name, intro: v.intro, badge: 'Nouveau navire', visual: v.night ? night(v.id, 'starboard', true) : day(v.id) }
  },
  generator: exerciseGenerator,
}
