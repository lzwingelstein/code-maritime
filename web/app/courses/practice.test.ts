import { describe, expect, it } from 'vitest'
import { DAY_MS } from '~/engine/mastery'
import { seeded } from '~/engine/random'
import { COURSES } from './index'
import { buildPractice, PRACTICE, weakCards } from './practice'

const now = 1_800_000_000_000
const ok = { level: 3, due: now + 5 * DAY_MS }
const weak = { level: 0, due: now - 1 }

const ids = (steps: ReturnType<typeof buildPractice>) =>
  steps.map(s => (s.type === 'question' ? s.exercise.cardId : ''))

describe('practice series', () => {
  const known = { port: ok, starboard: ok, north: ok, power: ok, sail: ok, 'crossing-starboard': ok, ch16: weak, eif: weak }

  it('only asks about cards already seen', () => {
    const steps = buildPractice(COURSES, known, now, seeded(1))
    expect(steps).toHaveLength(PRACTICE.questions)
    for (const id of ids(steps)) expect(Object.keys(known)).toContain(id)
  })

  it('mixes several units', () => {
    const courseOf = (id: string) => COURSES.find(c => c.lessons.some(l => l.plan.cards.includes(id)))!.id
    expect(new Set(ids(buildPractice(COURSES, known, now, seeded(2))).map(courseOf)).size).toBeGreaterThanOrEqual(3)
  })

  it('asks the weak cards much more often', () => {
    let weakCount = 0
    let total = 0
    for (let seed = 0; seed < 20; seed++) {
      for (const id of ids(buildPractice(COURSES, known, now, seeded(seed)))) {
        total++
        if (id === 'ch16' || id === 'eif') weakCount++
      }
    }
    // 2 weak cards out of 8 known, but well over a quarter of the questions.
    expect(weakCount / total).toBeGreaterThan(0.5)
  })

  it('never asks the same card twice in a row', () => {
    const list = ids(buildPractice(COURSES, known, now, seeded(3)))
    list.forEach((id, i) => { if (i) expect(id).not.toBe(list[i - 1]) })
  })

  it('needs a few known cards to start', () => {
    expect(buildPractice(COURSES, { port: ok, north: ok }, now, seeded(4))).toEqual([])
  })

  it('lists weak cards: wrong recently or due again at a low level', () => {
    expect(weakCards(COURSES, known, now).sort()).toEqual(['ch16', 'eif'])
    expect(weakCards(COURSES, { port: { level: 1, due: now - 1 } }, now)).toEqual(['port'])
    expect(weakCards(COURSES, { port: { level: 1, due: now + DAY_MS } }, now)).toEqual([])
  })
})
