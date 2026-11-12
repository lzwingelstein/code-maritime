import { describe, expect, it } from 'vitest'
import { buildLesson } from '~/engine/builder'
import { seeded } from '~/engine/random'
import { QUIZ_COURSES } from './index'
import { quizCourse, type QuizCard } from './quiz'

const card = (id: string): QuizCard => ({
  id, name: id.toUpperCase(), intro: `Intro ${id} assez longue`, visual: { type: 'emoji', char: '⚓' },
  questions: [
    { prompt: `Q1 ${id}`, answer: 'Oui', wrong: ['Non', 'Peut-être', 'Jamais', 'Toujours'] },
    { prompt: `Q2 ${id}`, answer: 'A', wrong: ['B'], explanation: 'Parce que A.' },
  ],
  statements: [[`${id} vrai`, true], [`${id} faux`, false]],
})

const demo = quizCourse({
  id: 'demo', unit: 'U', title: 'Demo', badge: 'Nouveau',
  cards: [card('a'), card('b')],
  lessons: [{ id: 'demo-1', title: 'L1', icon: { type: 'emoji', char: '⚓' }, cards: ['a', 'b'], count: 6 }],
})

describe('quiz course factory', () => {
  const generate = demo.generator(demo.lessons[0]!)
  const rng = seeded(5)

  it('asks an authored question with its answer and at most three wrong choices', () => {
    for (let i = 0; i < 30; i++) {
      const e = generate('a', 'qcm', rng)!
      expect(e.choices.map(c => c.id)).toContain(e.answer)
      expect(e.choices.length).toBeLessThanOrEqual(4)
      expect(e.choices.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('keeps the same question when it comes back', () => {
    const e = generate('a', 'qcm', rng)!
    const again = generate('a', 'qcm', rng, e.statement)!
    expect(again.prompt).toBe(e.prompt)
  })

  it('uses the authored explanation, or the card intro', () => {
    expect(generate('a', 'qcm', rng, 1)!.explanation).toBe('Parce que A.')
    expect(generate('a', 'qcm', rng, 0)!.explanation).toBe('Intro a assez longue')
  })

  it('also asks true/false, and nothing else', () => {
    expect(generate('a', 'truefalse', rng)!.choices).toHaveLength(2)
    expect(generate('a', 'identify', rng)).toBeNull()
    expect(generate('zzz', 'qcm', rng)).toBeNull()
  })

  it('builds lessons of the planned size', () => {
    const steps = buildLesson(demo.lessons[0]!.plan, { rng, isKnown: () => false, generate, firstKind: 'qcm' })
    expect(steps.filter(s => s.type === 'question')).toHaveLength(6)
  })
})

describe('authored content of every quiz course', () => {
  for (const course of QUIZ_COURSES) {
    describe(course.id, () => {
      for (const c of course.cards) {
        it(`${c.id}: well-formed questions and statements`, () => {
          expect(c.questions.length).toBeGreaterThanOrEqual(2)
          for (const q of c.questions) {
            expect(q.wrong.length).toBeGreaterThanOrEqual(1)
            expect(q.wrong).not.toContain(q.answer)
            expect(new Set(q.wrong).size).toBe(q.wrong.length)
          }
          expect(c.statements.length).toBeGreaterThanOrEqual(2)
          expect(new Set(c.statements.map(s => s[1])).size).toBe(2)
        })
      }
      it('every lesson card exists', () => {
        const ids = new Set(course.cards.map(c => c.id))
        for (const l of course.lessons) for (const id of l.plan.cards) expect(ids.has(id)).toBe(true)
      })
    })
  }
})
