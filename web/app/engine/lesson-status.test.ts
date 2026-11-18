import { describe, expect, it } from 'vitest'
import { DAY_MS } from './mastery'
import { lessonStatus } from './lesson-status'

const now = 100 * DAY_MS
const later = now + DAY_MS

describe('lessonStatus', () => {
  it('is todo until the lesson is done', () => {
    expect(lessonStatus(['a'], {}, false, now)).toEqual({ state: 'todo' })
  })

  it('is done while no card needs work', () => {
    expect(lessonStatus(['a', 'b'], { a: { level: 2, due: later }, b: { level: 1, due: later } }, true, now)).toEqual({ state: 'done' })
  })

  it('asks for a review after recent mistakes', () => {
    expect(lessonStatus(['a', 'b'], { a: { level: 0, due: now }, b: { level: 3, due: later } }, true, now)).toEqual({ state: 'review', reason: 'mistakes' })
  })

  it('asks for a review when cards are due again (done a while ago)', () => {
    expect(lessonStatus(['a', 'b'], { a: { level: 2, due: now - 1 }, b: { level: 3, due: later } }, true, now)).toEqual({ state: 'review', reason: 'due' })
  })
})
