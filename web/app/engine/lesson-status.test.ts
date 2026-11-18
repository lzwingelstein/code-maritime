import { describe, expect, it } from 'vitest'
import { DAY_MS } from './mastery'
import { lessonsToReview, MAX_REVIEW_MARKERS } from './lesson-status'

const now = 100 * DAY_MS
const later = now + DAY_MS
const missed = { level: 0, due: now }
const solid = { level: 3, due: later }
const dueAgain = { level: 2, due: now - 1 }

describe('lessonsToReview', () => {
  it('marks done lessons with recent mistakes only, not lessons merely due for review', () => {
    const lessons = [
      { id: 'l1', cards: ['a', 'b'], done: true },
      { id: 'l2', cards: ['c'], done: true },
      { id: 'l3', cards: ['d'], done: false },
    ]
    const mastery = { a: missed, b: solid, c: dueAgain, d: missed }
    expect(lessonsToReview(lessons, mastery)).toEqual(['l1'])
  })

  it(`keeps at most ${MAX_REVIEW_MARKERS}, the ones with the most mistakes, path order on ties`, () => {
    const lessons = [
      { id: 'l1', cards: ['a'], done: true },
      { id: 'l2', cards: ['b', 'c'], done: true },
      { id: 'l3', cards: ['d'], done: true },
    ]
    const mastery = { a: missed, b: missed, c: missed, d: missed }
    expect(lessonsToReview(lessons, mastery)).toEqual(['l2', 'l1'])
  })
})
