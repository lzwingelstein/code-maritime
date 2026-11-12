import type { Visual } from '../types'
import type { BalisageLesson } from './exercises'
import { MARK_IDS, type MarkId } from './marks'

const icon = (markId: MarkId): Visual => ({ type: 'mark', markId, topOnly: true })

export const COURSE = {
  id: 'balisage',
  unit: 'Permis côtier',
  title: 'Le balisage (région A)',
}

export const LESSONS: BalisageLesson[] = [
  {
    id: 'laterales', title: 'Marques latérales', icon: icon('port'), firstKind: 'find',
    plan: { cards: ['port', 'starboard'], count: 8, kinds: ['identify', 'side', 'truefalse', 'find', 'light'], tip: true },
    tip: {
      emoji: '⚓', title: 'Rouge à gauche en rentrant',
      text: 'En Europe (région A), quand on rentre au port : **rouge à bâbord** (gauche), **vert à tribord** (droite). Astuce : « BATTERIE » se lit de gauche à droite, BA(bord) puis T(ribord).',
    },
  },
  {
    id: 'voyants', title: 'Voyants cardinaux', icon: icon('north'), topOnly: true, firstKind: 'identify',
    plan: { cards: ['north', 'east', 'south', 'west'], count: 10, kinds: ['identify', 'identify', 'find', 'truefalse'], tip: true },
    tip: {
      emoji: '🧭', title: 'Lis les cônes',
      text: 'Une cardinale se reconnaît d’abord à son **voyant** : deux cônes noirs. Vers le haut ▲▲ : **nord**. Vers le bas ▼▼ : **sud**. Base contre base ▲▼ : **est**. Pointe contre pointe ▼▲ : **ouest**.',
    },
  },
  {
    id: 'cardinales', title: 'Couleurs et passage', icon: icon('west'), firstKind: 'find',
    plan: { cards: ['north', 'east', 'south', 'west'], count: 10, kinds: ['identify', 'find', 'side', 'side', 'truefalse'], tip: true },
    tip: {
      emoji: '💡', title: 'L’astuce des pointes',
      text: 'Les pointes des cônes montrent **où est le noir** sur la bouée. Nord ▲▲ : noir en haut. Sud ▼▼ : noir en bas. Est ▲▼ : noir en haut et en bas. Ouest ▼▲ : noir au milieu.',
    },
  },
  {
    id: 'feux-cardinaux', title: 'Feux cardinaux', icon: icon('east'), firstKind: 'find',
    plan: { cards: ['north', 'east', 'south', 'west'], count: 8, kinds: ['light', 'light', 'truefalse'], tip: true },
    tip: {
      emoji: '🕒', title: 'Pense à une horloge',
      text: 'Est = **3 h** : 3 scintillements. Sud = **6 h** : 6 scintillements et 1 éclat long. Ouest = **9 h** : 9 scintillements. Nord = **midi** : scintillement continu. Tous les feux cardinaux sont **blancs**.',
    },
  },
  {
    id: 'autres', title: 'Autres marques', icon: icon('isolated'), firstKind: 'find',
    plan: { cards: ['isolated', 'safe', 'special'], count: 10, kinds: ['identify', 'find', 'meaning', 'light', 'truefalse'] },
  },
  {
    id: 'revision', title: 'Révision', icon: icon('safe'), firstKind: 'find',
    plan: { cards: MARK_IDS, count: 12, kinds: ['identify', 'find', 'side', 'light', 'meaning', 'truefalse'], review: true },
  },
]
