/**
 * The radio alphabet, letter by letter: one card per letter so spaced repetition follows each one.
 * Kinds: word (letter → its word), letter (word heard → its letter), spell (a short word, word by word).
 */
import { options } from '../shared'
import type { Course, CourseExercise, Lesson, Visual } from '../types'
import { pick, shuffle, type Random } from '~/engine/random'
import { ALPHABET_CARDS, cardOf, letterOf, PHONETIC, spell, SPELL_WORDS, wordOf } from './letters'

const e = (char: string): Visual => ({ type: 'emoji', char })
const letters = (from: string, to: string) => PHONETIC.map(([l]) => l).filter(l => l >= from && l <= to).map(cardOf)
const HEADING = 'Alphabet radio'

const lessons: Lesson[] = [
  {
    id: 'alphabet-a-i', title: 'De A à I', icon: e('🔤'), firstKind: 'word',
    tip: { emoji: '🔤', title: 'Un mot par lettre', text: 'À la radio, **B**, **D**, **P** et **T** se confondent. On dit donc **Bravo**, **Delta**, **Papa**, **Tango** : chaque lettre a son mot, le même dans le monde entier.' },
    plan: { cards: letters('A', 'I'), count: 10, kinds: ['word', 'letter'], tip: true },
  },
  { id: 'alphabet-j-r', title: 'De J à R', icon: e('🔤'), firstKind: 'word', plan: { cards: letters('J', 'R'), count: 10, kinds: ['word', 'letter'] } },
  { id: 'alphabet-s-z', title: 'De S à Z', icon: e('🔤'), firstKind: 'word', plan: { cards: letters('S', 'Z'), count: 10, kinds: ['word', 'letter'] } },
  {
    id: 'alphabet-epeler', title: 'Épeler un nom', icon: e('📻'), firstKind: 'spell',
    tip: { emoji: '📻', title: 'Épeler à la radio', text: 'Un **nom de bateau**, un **indicatif**, un mot mal compris : on l’épelle lettre par lettre avec l’alphabet, par exemple **Kilo Alpha Yankee Alpha Kilo**.' },
    plan: { cards: ALPHABET_CARDS, count: 8, kinds: ['spell'], tip: true },
  },
  { id: 'revision-alphabet', title: 'Révision', icon: e('🧭'), firstKind: 'word', plan: { cards: ALPHABET_CARDS, count: 12, kinds: ['word', 'letter', 'spell'], review: true } },
]

function generator(lesson: Lesson) {
  // Distractors from the lesson's own letters when there are enough, else from the whole alphabet.
  const pool = lesson.plan.cards.length >= 6 ? lesson.plan.cards.map(letterOf) : PHONETIC.map(([l]) => l)
  return (cardId: string, kind: string, rng: Random): CourseExercise | null => {
    if (!ALPHABET_CARDS.includes(cardId)) return null
    const letter = letterOf(cardId)
    const word = wordOf(letter)
    const explanation = `${letter} se dit « ${word} ».`
    if (kind === 'word') {
      const words = options(letter, pool, rng).map(wordOf)
      return {
        cardId, kind, heading: HEADING, prompt: 'À la radio, comment épelle-t-on cette lettre ?', answer: word,
        visual: { type: 'letter', char: letter }, layout: 'grid', explanation,
        choices: words.map(w => ({ id: w, name: w })),
      }
    }
    if (kind === 'letter') {
      return {
        cardId, kind, heading: HEADING, prompt: `On t’épelle « **${word}** ». C’est quelle lettre ?`, answer: letter,
        visual: { type: 'spoken', word }, layout: 'letters', explanation,
        choices: options(letter, PHONETIC.map(([l]) => l), rng, 6).map(l => ({ id: l, name: l })),
      }
    }
    if (kind === 'spell') {
      const target = pick(SPELL_WORDS.filter(w => w.includes(letter)), rng)
      const parts = spell(target)
      const extra = shuffle(PHONETIC.map(([, w]) => w).filter(w => !parts.includes(w)), rng).slice(0, 3)
      return {
        cardId, kind, heading: HEADING, prompt: `Épelle « **${target}** » à la radio.`, answer: parts.join(' '),
        visual: null, layout: 'sequence', explanation: [...target].map(l => `${l} = ${wordOf(l)}`).join(' · '),
        choices: shuffle([...new Set(parts), ...extra], rng).map(w => ({ id: w, name: w })),
        slots: [...target],
      }
    }
    return null
  }
}

export const alphabet: Course = {
  id: 'alphabet',
  unit: 'Permis côtier',
  title: 'L’alphabet radio',
  lessons,
  card: (id) => {
    const letter = letterOf(id)
    return {
      name: `${letter} · ${wordOf(letter)}`,
      intro: `À la radio, **${letter}** se dit « **${wordOf(letter)}** ».`,
      visual: { type: 'letter', char: letter },
      badge: 'Nouvelle lettre',
    }
  },
  generator,
}
