import { describe, expect, it } from 'vitest'
import { readiness } from './readiness'

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
