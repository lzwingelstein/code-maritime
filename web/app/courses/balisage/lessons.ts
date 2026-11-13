import type { Visual } from '../types'
import type { BalisageLesson } from './exercises'
import { MARK_IDS, type MarkId } from './marks'

const icon = (markId: MarkId): Visual => ({ type: 'mark', markId, topOnly: true })
const full = (markId: MarkId): Visual => ({ type: 'mark', markId, topOnly: false })

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
      text: 'En Europe (région A), **en rentrant au port** :',
        rows: [
          { visual: full('port'), label: '**À gauche** (bâbord) : rouge, cylindre' },
          { visual: full('starboard'), label: '**À droite** (tribord) : vert, cône' },
        ],
    },
  },
  {
    id: 'voyants', title: 'Voyants cardinaux', icon: icon('north'), topOnly: true, firstKind: 'identify',
    plan: { cards: ['north', 'east', 'south', 'west'], count: 10, kinds: ['identify', 'identify', 'find', 'truefalse'], tip: true },
    tip: {
      emoji: '🧭', title: 'Lis les cônes',
      text: 'Deux cônes noirs, et ce qu’ils dessinent :',
        rows: [
          { visual: icon('north'), label: '**Nord** : pointes en haut' },
          { visual: icon('south'), label: '**Sud** : pointes en bas' },
          { visual: icon('east'), label: '**Est** : base contre base' },
          { visual: icon('west'), label: '**Ouest** : pointe contre pointe' },
        ],
    },
  },
  {
    id: 'cardinales', title: 'Couleurs et passage', icon: icon('west'), firstKind: 'find',
    plan: { cards: ['north', 'east', 'south', 'west'], count: 10, kinds: ['identify', 'find', 'side', 'side', 'truefalse'], tip: true },
    tip: {
      emoji: '💡', title: 'L’astuce des pointes',
      text: 'Les pointes des cônes montrent **où est le noir**. On passe du côté du nom.',
        rows: [
          { visual: full('north'), label: '**Nord** : noir en haut' },
          { visual: full('south'), label: '**Sud** : noir en bas' },
          { visual: full('east'), label: '**Est** : noir en haut et en bas' },
          { visual: full('west'), label: '**Ouest** : noir au milieu' },
        ],
    },
  },
  {
    id: 'feux-cardinaux', title: 'Feux cardinaux', icon: icon('east'), firstKind: 'find',
    plan: { cards: ['north', 'east', 'south', 'west'], count: 8, kinds: ['light', 'light', 'truefalse'], tip: true },
    tip: {
      emoji: '🕒', title: 'Pense à une horloge',
      text: 'Feux **blancs**, comptés comme les heures :',
        rows: [
          { visual: icon('north'), label: '**Nord** = midi : scintille sans arrêt' },
          { visual: icon('east'), label: '**Est** = 3 h : 3 scintillements' },
          { visual: icon('south'), label: '**Sud** = 6 h : 6 + 1 éclat long' },
          { visual: icon('west'), label: '**Ouest** = 9 h : 9 scintillements' },
        ],
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
