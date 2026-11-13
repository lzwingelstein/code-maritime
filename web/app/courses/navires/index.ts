import type { Course, Lesson, StackColour, Visual } from '../types'
import { day, exerciseGenerator, night } from './exercises'
import { VESSEL_IDS, VESSELS, type VesselId } from './vessels'

const icon = (char: string) => ({ type: 'emoji' as const, char })
const stack = (...colours: StackColour[]): Visual => ({ type: 'stack', colours })

export const LESSONS: Lesson[] = [
  {
    id: 'navire-moteur', title: 'Navire à moteur', icon: icon('🚤'), firstKind: 'aspect',
    plan: { cards: ['power', 'power50'], count: 8, kinds: ['aspect', 'aspect', 'identify', 'truefalse'], tip: true },
    tip: {
      emoji: '🔦', title: 'Chaque feu a son secteur',
      text: 'Chaque feu n’éclaire que d’un côté : ce que tu vois dit **sous quel angle** tu vois le navire.',
        rows: [
          { visual: night('power', 'ahead'), label: '**De face** : blanc, rouge et vert' },
          { visual: night('power', 'starboard'), label: '**Par tribord** : blanc et vert' },
          { visual: night('power', 'port'), label: '**Par bâbord** : blanc et rouge' },
          { visual: night('power', 'astern'), label: '**Par l’arrière** : un seul blanc (poupe)' },
        ],
    },
  },
  {
    id: 'voilier', title: 'Le voilier', icon: icon('⛵'), firstKind: 'identify',
    plan: { cards: ['power', 'sail'], count: 8, kinds: ['aspect', 'identify', 'find', 'truefalse'], tip: true },
    tip: {
      emoji: '⛵', title: 'Pas de blanc en haut',
      text: 'Le voilier n’a **pas de feu blanc en haut**.',
        rows: [
          { visual: night('power', 'ahead'), label: '**Navire à moteur** : blanc au-dessus' },
          { visual: night('sail', 'ahead'), label: '**Voilier** : rouge et vert seuls' },
        ],
    },
  },
  {
    id: 'peche-pilote', title: 'Pêche et pilote', icon: icon('🎣'), firstKind: 'identify',
    plan: { cards: ['trawler', 'fishing', 'pilot'], count: 10, kinds: ['identify', 'identify', 'find', 'truefalse'], tip: true },
    tip: {
      emoji: '🧠', title: 'Lis de haut en bas',
      text: 'Feux visibles **sur tout l’horizon**, lus **de haut en bas** :',
        rows: [
          { visual: stack('green', 'white'), label: '**Vert sur blanc** : chalutier' },
          { visual: stack('red', 'white'), label: '**Rouge sur blanc** : autre pêcheur' },
          { visual: stack('white', 'red'), label: '**Blanc sur rouge** : pilote' },
        ],
    },
  },
  {
    id: 'navires-genes', title: 'Mouillage et navires gênés', icon: icon('⚓'), firstKind: 'identify',
    plan: { cards: ['anchor', 'nuc', 'ram', 'cbd'], count: 10, kinds: ['identify', 'identify', 'find', 'truefalse'], tip: true },
    tip: {
      emoji: '🚨', title: 'Compte les rouges',
      text: 'Feux superposés, visibles sur tout l’horizon :',
        rows: [
          { visual: stack('white'), label: '**Un blanc** : au mouillage' },
          { visual: stack('red', 'red'), label: '**Deux rouges** : non maître de sa manœuvre' },
          { visual: stack('red', 'white', 'red'), label: '**Rouge, blanc, rouge** : capacité restreinte' },
          { visual: stack('red', 'red', 'red'), label: '**Trois rouges** : tirant d’eau' },
        ],
    },
  },
  {
    id: 'marques-jour', title: 'Marques de jour', icon: icon('☀️'), firstKind: 'dayshape',
    plan: { cards: ['anchor', 'trawler', 'nuc', 'ram', 'cbd', 'motorsail'], count: 10, kinds: ['dayshape', 'dayfind'], tip: true },
    tip: {
      emoji: '☀️', title: 'Les mêmes idées, en formes noires',
      text: 'De jour, des formes noires disent la même chose :',
        rows: [
          { visual: day('anchor'), label: '**Une boule** : mouillage' },
          { visual: day('nuc'), label: '**Deux boules** : non maître' },
          { visual: day('ram'), label: '**Boule, bicône, boule** : capacité restreinte' },
          { visual: day('cbd'), label: '**Cylindre** : tirant d’eau' },
          { visual: day('trawler'), label: '**Deux cônes pointe à pointe** : pêche' },
          { visual: day('motorsail'), label: '**Cône pointe en bas** : voilier au moteur' },
        ],
    },
  },
  {
    id: 'revision-navires', title: 'Révision', icon: icon('🧭'), firstKind: 'identify',
    plan: { cards: VESSEL_IDS, count: 12, kinds: ['identify', 'find', 'aspect', 'truefalse', 'dayshape', 'dayfind'], review: true },
  },
]

export const navires: Course = {
  id: 'navires',
  unit: 'Permis côtier',
  title: 'Feux et marques des navires',
  lessons: LESSONS,
  // Intro seen from ahead (both sidelights, as the text says); over 50 m from the side, to show the two masthead lights.
  card: (id) => {
    const v = VESSELS[id as VesselId]
    return { name: v.name, intro: v.intro, badge: 'Nouveau navire', visual: v.night ? night(v.id, v.id === 'power50' ? 'starboard' : 'ahead', true) : day(v.id) }
  },
  generator: exerciseGenerator,
}
