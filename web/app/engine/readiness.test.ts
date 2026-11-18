import { describe, expect, it } from 'vitest'
import { pace, readiness } from './readiness'

describe('readiness', () => {
  it('averages the path done and how well the cards are known (level 3 counts as fully known)', () => {
    const r = readiness({ lessonsDone: 10, lessonsTotal: 40, levels: [3, 4, 0, 1, 2, null, null, null], perDay: 2 })
    // path 25 %, cards (1 + 1 + 0 + 1/3 + 2/3) / 8 = 37.5 %
    expect(r).toEqual({ percent: 31, path: 25, mastery: 38, lessonsLeft: 30, daysLeft: 15 })
  })

  it('is 0 at the start and 100 when everything is done and known', () => {
    expect(readiness({ lessonsDone: 0, lessonsTotal: 4, levels: [null, null], perDay: 2 }).percent).toBe(0)
    expect(readiness({ lessonsDone: 4, lessonsTotal: 4, levels: [3, 4], perDay: 2 })).toMatchObject({ percent: 100, daysLeft: 0 })
  })
})

describe('pace', () => {
  it('is the path lessons per day over the last two weeks, since the first active day', () => {
    const h = { '2026-11-10': { lessons: 2 }, '2026-11-12': { lessons: 0 }, '2026-11-14': { lessons: 4 } }
    // 6 lessons from the 10th to the 18th: 9 days
    expect(pace(h, '2026-11-18')).toBeCloseTo(6 / 9)
  })

  it('ignores days older than the window', () => {
    expect(pace({ '2026-10-01': { lessons: 30 }, '2026-11-17': { lessons: 3 } }, '2026-11-18')).toBe(1)
  })

  it('counts at least three days so a first busy day does not promise too much', () => {
    expect(pace({ '2026-11-18': { lessons: 6 } }, '2026-11-18')).toBe(2)
  })

  it('is null without any lesson done in the window', () => {
    expect(pace({ '2026-11-18': { lessons: 0 } }, '2026-11-18')).toBeNull()
    expect(pace({ '2026-11-18': {} }, '2026-11-18')).toBeNull()
  })
})

