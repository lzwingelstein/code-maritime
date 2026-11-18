import { describe, expect, it } from 'vitest'
import { seeded } from '~/engine/random'
import { buildLesson } from '~/engine/builder'
import { ALPHABET_CARDS, letterOf, PHONETIC, SPELL_WORDS } from './letters'
import { alphabet } from './index'

const rngs = Array.from({ length: 30 }, (_, i) => seeded(i + 1))

describe('alphabet content', () => {
  it('has the 26 letters of the international phonetic alphabet, one card each', () => {
    expect(PHONETIC).toHaveLength(26)
    expect(ALPHABET_CARDS).toHaveLength(26)
    expect(new Set(ALPHABET_CARDS).size).toBe(26)
  })
  it('has a word to spell for every letter, all in capitals', () => {
    for (const [letter] of PHONETIC) expect(SPELL_WORDS.some(w => w.includes(letter)), letter).toBe(true)
    for (const w of SPELL_WORDS) expect(w).toMatch(/^[A-Z]{3,6}$/)
  })
})

describe('alphabet exercises', () => {
  const lessons = alphabet.lessons
  it('word: the letter’s word is the answer, among four unique words', () => {
    for (const rng of rngs) {
      for (const id of ALPHABET_CARDS) {
        const e = alphabet.generator(lessons.at(-1)!)(id, 'word', rng)!
        const words = e.choices.map(c => c.id)
        expect(new Set(words).size).toBe(4)
        expect(words).toContain(e.answer)
        expect(e.answer).toBe(PHONETIC.find(([l]) => l === letterOf(id))![1])
      }
    }
  })
  it('letter: the letter is the answer, among six unique letters', () => {
    for (const rng of rngs) {
      for (const id of ALPHABET_CARDS) {
        const e = alphabet.generator(lessons.at(-1)!)(id, 'letter', rng)!
        expect(new Set(e.choices.map(c => c.id)).size).toBe(6)
        expect(e.answer).toBe(letterOf(id))
        expect(e.choices.map(c => c.id)).toContain(e.answer)
      }
    }
  })
  it('spell: a word holding the letter, answered word by word, every word in the bank', () => {
    for (const rng of rngs) {
      for (const id of ALPHABET_CARDS) {
        const e = alphabet.generator(lessons.at(-1)!)(id, 'spell', rng)!
        expect(e.layout).toBe('sequence')
        const parts = e.answer.split(' ')
        const bank = e.choices.map(c => c.id)
        expect(new Set(bank).size).toBe(bank.length)
        for (const w of parts) expect(bank).toContain(w)
        expect(parts.map(w => w[0]).join('')).toContain(letterOf(id))
      }
    }
  })
  it('every lesson fills its count', () => {
    for (const lesson of lessons) {
      const steps = buildLesson(lesson.plan, { rng: seeded(3), generate: alphabet.generator(lesson), isKnown: () => true, firstKind: lesson.firstKind, weight: () => 1 })
      expect(steps.filter(s => s.type === 'question').length, lesson.id).toBe(lesson.plan.count)
    }
  })
})
