import { describe, expect, it } from 'vitest'
import { splitTerms } from './split'
import type { Term } from './terms'

const T: Term[] = [
  { id: 'tirant', term: 'Tirant d’eau', match: ['tirant d’eau'], definition: '' },
  { id: 'cbd', term: 'Handicapé', match: ['handicapé par son tirant d’eau'], definition: '' },
  { id: 'cap', term: 'Cap', match: ['cap'], definition: '' },
]

describe('splitTerms', () => {
  it('marks known terms, case-insensitive, keeping the original text', () => {
    expect(splitTerms('Un Tirant d’eau de 2 m.', T)).toEqual([
      { text: 'Un ' }, { text: 'Tirant d’eau', termId: 'tirant' }, { text: ' de 2 m.' },
    ])
  })

  it('prefers the longest term and never overlaps', () => {
    expect(splitTerms('Navire handicapé par son tirant d’eau', T)).toEqual([
      { text: 'Navire ' }, { text: 'handicapé par son tirant d’eau', termId: 'cbd' },
    ])
  })

  it('matches whole words only and each term once', () => {
    expect(splitTerms('Sa capacité, son cap, puis le cap.', T)).toEqual([
      { text: 'Sa capacité, son ' }, { text: 'cap', termId: 'cap' }, { text: ', puis le cap.' },
    ])
  })

  it('can skip terms already explained', () => {
    expect(splitTerms('Le cap.', T, new Set(['cap']))).toEqual([{ text: 'Le cap.' }])
  })
})
