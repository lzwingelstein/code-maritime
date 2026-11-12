import { describe, expect, it } from 'vitest'
import { seeded } from '~/engine/random'
import { buildLesson } from '~/engine/builder'
import { exerciseGenerator, KINDS, regenerator } from './exercises'
import { LESSONS } from './lessons'
import { MARK_IDS, MARKS } from './marks'

describe('balisage exercises', () => {
  const rng = seeded(42)

  it('every generated exercise has its answer among unique choices', () => {
    for (const lesson of LESSONS) {
      const generate = exerciseGenerator(lesson)
      for (const id of lesson.plan.cards) {
        for (const kind of KINDS) {
          for (let i = 0; i < 20; i++) {
            const e = generate(id, kind, rng)
            if (!e) continue
            const ids = e.choices.map(c => c.id)
            expect(ids).toContain(e.answer)
            expect(new Set(ids).size).toBe(ids.length)
            expect(e.choices.length).toBeGreaterThanOrEqual(2)
            expect(e.choices.length).toBeLessThanOrEqual(4)
          }
        }
      }
    }
  })

  it('asks "which side" only for lateral and cardinal marks', () => {
    const generate = exerciseGenerator(LESSONS.at(-1)!)
    for (const id of MARK_IDS) {
      expect(generate(id, 'side', rng) === null).toBe(MARKS[id].family === 'other')
    }
  })

  it('lateral side answers are port/starboard, cardinal ones the four directions', () => {
    const generate = exerciseGenerator(LESSONS.at(-1)!)
    expect(generate('port', 'side', rng)!.answer).toBe('babord')
    expect(generate('starboard', 'side', rng)!.answer).toBe('tribord')
    const west = generate('west', 'side', rng)!
    expect(west.answer).toBe('W')
    expect(west.choices).toHaveLength(4)
  })

  it('true/false answers match the statement, and a retry keeps the same statement', () => {
    const generate = exerciseGenerator(LESSONS[0]!)
    const e = generate('port', 'truefalse', rng)!
    const [text, truth] = MARKS.port.statements[e.statement!]!
    expect(e.prompt).toBe(text)
    expect(e.answer).toBe(String(truth))
    const again = regenerator(LESSONS[0]!, rng)(e)
    expect(again.prompt).toBe(e.prompt)
  })

  it('topmark-only lessons show topmarks only', () => {
    const lesson = LESSONS.find(l => l.topOnly)!
    const e = exerciseGenerator(lesson)('east', 'identify', rng)!
    expect(e.visual).toEqual({ type: 'mark', markId: 'east', topOnly: true })
  })

  it('review distractors come from the same family first', () => {
    const generate = exerciseGenerator(LESSONS.at(-1)!)
    for (let i = 0; i < 20; i++) {
      const e = generate('north', 'identify', rng)!
      expect(e.choices.every(c => MARKS[c.id as keyof typeof MARKS].family === 'cardinal')).toBe(true)
    }
  })

  it('every lesson builds the planned number of questions', () => {
    for (const lesson of LESSONS) {
      const steps = buildLesson(lesson.plan, {
        rng: seeded(7), isKnown: () => false, generate: exerciseGenerator(lesson), firstKind: lesson.topOnly ? 'identify' : 'find',
      })
      expect(steps.filter(s => s.type === 'question')).toHaveLength(lesson.plan.count)
    }
  })
})
