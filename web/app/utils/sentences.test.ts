import { describe, expect, it } from 'vitest'
import { sentences } from './sentences'

describe('sentences', () => {
  it('splits a paragraph into sentences, keeping bold markers', () => {
    expect(sentences('Rouge, voyant **cylindrique**. En venant du large, on la laisse à **bâbord**.'))
      .toEqual(['Rouge, voyant **cylindrique**.', 'En venant du large, on la laisse à **bâbord**.'])
  })

  it('splits before a bold sentence start', () => {
    expect(sentences('Un blanc. **Deux rouges** : avarie.')).toEqual(['Un blanc.', '**Deux rouges** : avarie.'])
  })

  it('does not split decimals, abbreviations in brackets or ellipses inside a sentence', () => {
    expect(sentences('Vagues de 0,5 m (ex. une houle courte). Fin.')).toEqual(['Vagues de 0,5 m (ex. une houle courte).', 'Fin.'])
    expect(sentences('Baignade, câble, zone militaire…')).toEqual(['Baignade, câble, zone militaire…'])
  })

  it('keeps a single sentence whole', () => {
    expect(sentences('Une seule phrase sans point')).toEqual(['Une seule phrase sans point'])
  })
})
