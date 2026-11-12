import { describe, expect, it } from 'vitest'
import { buildLesson } from '~/engine/builder'
import { seeded } from '~/engine/random'
import { ASPECT_VESSELS, exerciseGenerator, KINDS } from './exercises'
import { LESSONS } from './index'
import { VESSEL_IDS, VESSELS } from './vessels'

const rng = seeded(11)
const review = LESSONS.at(-1)!

describe('ship exercises', () => {
  it('every exercise has its answer among unique choices', () => {
    for (const lesson of LESSONS) {
      const generate = exerciseGenerator(lesson)
      for (const id of lesson.plan.cards) for (const kind of KINDS) for (let i = 0; i < 15; i++) {
        const e = generate(id, kind, rng)
        if (!e) continue
        const ids = e.choices.map(c => c.id)
        expect(ids).toContain(e.answer)
        expect(new Set(ids).size).toBe(ids.length)
        expect(ids.length).toBeGreaterThanOrEqual(2)
      }
    }
  })

  it('never offers two vessels with the same day shapes in one question', () => {
    const generate = exerciseGenerator(review)
    for (let i = 0; i < 50; i++) {
      for (const kind of ['dayshape', 'dayfind']) {
        const ids = generate('trawler', kind, rng)!.choices.map(c => c.id)
        expect(ids).not.toContain('fishing')
      }
    }
  })

  it('night questions only show vessels asked at night, day questions only vessels with day shapes', () => {
    const generate = exerciseGenerator(review)
    expect(generate('motorsail', 'identify', rng)).toBeNull()
    expect(generate('pilot', 'dayshape', rng)).toBeNull()
    for (let i = 0; i < 30; i++) {
      expect(generate('power', 'identify', rng)!.choices.every(c => VESSELS[c.id as keyof typeof VESSELS].night)).toBe(true)
      expect(generate('nuc', 'dayfind', rng)!.choices.every(c => VESSELS[c.id as keyof typeof VESSELS].shapes)).toBe(true)
    }
  })

  it('asks "from which side" only where the lights tell it, and never shows an anchored vessel from astern', () => {
    const generate = exerciseGenerator(review)
    for (const id of VESSEL_IDS) expect(generate(id, 'aspect', rng) !== null).toBe(ASPECT_VESSELS.includes(id))
    for (let i = 0; i < 30; i++) {
      const e = generate('sail', 'identify', rng)!
      expect(e.visual?.type === 'ship' && e.visual.aspect).not.toBe('astern')
    }
  })

  it('the aspect answer matches the scene', () => {
    const e = exerciseGenerator(LESSONS[0]!)('power', 'aspect', rng)!
    expect(e.visual?.type === 'ship' && e.visual.aspect).toBe(e.answer)
  })

  it('every lesson builds its planned number of questions', () => {
    for (const lesson of LESSONS) {
      const steps = buildLesson(lesson.plan, { rng: seeded(3), isKnown: () => false, generate: exerciseGenerator(lesson), firstKind: lesson.firstKind })
      expect(steps.filter(s => s.type === 'question')).toHaveLength(lesson.plan.count)
    }
  })
})
