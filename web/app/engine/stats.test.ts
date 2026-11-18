import { describe, expect, it } from 'vitest'
import { DAY_MS } from './mastery'
import { emptyProgress, recordLesson } from './progress'
import { accuracy, activity, fragileUnits, HISTORY_DAYS, masteryBreakdown, mostMissed, totals } from './stats'

const day0 = new Date(2026, 10, 10, 10).getTime()
const ans = (cardId: string, correct: boolean, isRetry = false) => ({ cardId, correct, isRetry })

describe('answer history', () => {
  it('counts right and wrong answers per card and per day, for won and lost lessons', () => {
    let p = recordLesson(emptyProgress(), { lessonId: 'l', won: true, xp: 12, answers: [ans('a', true), ans('b', false), ans('b', true, true)] }, day0)
    p = recordLesson(p, { lessonId: 'l', won: false, xp: 0, answers: [ans('a', false)] }, day0 + DAY_MS)
    expect(p.cards).toEqual({ a: { right: 1, wrong: 1 }, b: { right: 1, wrong: 1 } })
    expect(p.history).toEqual({
      '2026-11-10': { right: 2, wrong: 1, xp: 12, lessons: 1 },
      '2026-11-11': { right: 0, wrong: 1, xp: 0 },
    })
    expect(totals(p)).toEqual({ right: 2, wrong: 2 })
    expect(accuracy(p)).toBe(50)
    expect(accuracy(p, ['a'])).toBe(50)
  })

  it('keeps a bounded history', () => {
    let p = emptyProgress()
    for (let d = 0; d < HISTORY_DAYS + 20; d++) p = recordLesson(p, { lessonId: 'l', won: true, xp: 1, answers: [ans('a', true)] }, day0 + d * DAY_MS)
    expect(Object.keys(p.history!)).toHaveLength(HISTORY_DAYS)
  })

  it('accuracy is null without answers', () => {
    expect(accuracy(emptyProgress())).toBeNull()
  })
})

describe('stats', () => {
  it('activity lists the last days, oldest first, with empty days at zero', () => {
    const p = recordLesson(emptyProgress(), { lessonId: 'l', won: true, xp: 10, answers: [ans('a', true), ans('a', false)] }, day0)
    expect(activity(p, '2026-11-12', 4)).toEqual([
      { day: '2026-11-09', right: 0, wrong: 0, xp: 0 },
      { day: '2026-11-10', right: 1, wrong: 1, xp: 10, lessons: 1 },
      { day: '2026-11-11', right: 0, wrong: 0, xp: 0 },
      { day: '2026-11-12', right: 0, wrong: 0, xp: 0 },
    ])
  })

  it('most missed: wrong answers first, then error rate; never-missed cards excluded', () => {
    const p = { ...emptyProgress(), cards: { a: { right: 9, wrong: 3 }, b: { right: 1, wrong: 3 }, c: { right: 0, wrong: 1 }, d: { right: 5, wrong: 0 } } }
    expect(mostMissed(p, 5).map(m => m.cardId)).toEqual(['b', 'a', 'c'])
    expect(mostMissed(p, 1)[0]).toEqual({ cardId: 'b', right: 1, wrong: 3, rate: 75 })
  })

  it('mastery breakdown counts cards to rework, in progress and known', () => {
    const now = day0
    const mastery = {
      a: { level: 0, due: now }, b: { level: 1, due: now - 1 }, c: { level: 1, due: now + DAY_MS },
      d: { level: 2, due: now + DAY_MS }, e: { level: 3, due: now + DAY_MS }, f: { level: 4, due: now - 1 },
    }
    expect(masteryBreakdown(mastery, ['a', 'b', 'c', 'd', 'e', 'f', 'g'], now))
      .toEqual({ unseen: 1, weak: 2, learning: 2, known: 2, total: 7 })
  })
})

describe('fragile units', () => {
  it('lists started units only, weakest accuracy first, with their weak cards', () => {
    const now = day0
    const p = {
      ...emptyProgress(),
      cards: { a: { right: 9, wrong: 1 }, b: { right: 1, wrong: 1 }, c: { right: 3, wrong: 1 } },
      mastery: { a: { level: 3, due: now + DAY_MS }, b: { level: 0, due: now }, c: { level: 1, due: now - 1 } },
    }
    const units = [{ id: 'u1', cards: ['a'] }, { id: 'u2', cards: ['b', 'c'] }, { id: 'u3', cards: ['z'] }]
    expect(fragileUnits(p, units, now)).toEqual([
      { id: 'u2', accuracy: 67, answers: 6, weak: 2 },
      { id: 'u1', accuracy: 90, answers: 10, weak: 0 },
    ])
  })
})
