import { describe, expect, it } from 'vitest'
import { applyAnswer, DAY_MS, isDue, masteryStep, MAX_LEVEL, reviewWeight } from './mastery'

const now = 1_000_000_000_000

describe('mastery', () => {
  it('a first right answer reaches level 1, due one day later', () => {
    expect(applyAnswer(undefined, true, now)).toEqual({ level: 1, due: now + DAY_MS })
  })

  it('levels follow 1, 3, 7 then 21 days', () => {
    let m = applyAnswer(undefined, true, now)
    m = applyAnswer(m, true, now)
    expect(m).toEqual({ level: 2, due: now + 3 * DAY_MS })
    m = applyAnswer(m, true, now)
    m = applyAnswer(m, true, now)
    expect(m).toEqual({ level: MAX_LEVEL, due: now + 21 * DAY_MS })
    expect(applyAnswer(m, true, now).level).toBe(MAX_LEVEL)
  })

  it('a mistake drops a level and makes the card due now', () => {
    expect(applyAnswer({ level: 3, due: now + 9 }, false, now)).toEqual({ level: 2, due: now })
    expect(applyAnswer(undefined, false, now)).toEqual({ level: 0, due: now })
  })

  it('weights due and weak cards above known ones', () => {
    const weak = reviewWeight({ level: 0, due: now }, now)
    const dueStrong = reviewWeight({ level: 3, due: now - 1 }, now)
    const notDue = reviewWeight({ level: 3, due: now + DAY_MS }, now)
    expect(weak).toBeGreaterThan(dueStrong)
    expect(dueStrong).toBeGreaterThan(notDue)
    expect(notDue).toBeGreaterThan(0)
    expect(isDue({ level: 3, due: now }, now)).toBe(true)
  })
})

describe('masteryStep', () => {
  const now = 100 * DAY_MS
  it('says new for a card never answered', () => {
    expect(masteryStep(undefined, now)).toEqual({ step: 'new', dots: 0 })
  })
  it('says known from level 3, with three dots at most', () => {
    expect(masteryStep({ level: 3, due: now + DAY_MS }, now)).toEqual({ step: 'known', dots: 3 })
    expect(masteryStep({ level: 4, due: now - 1 }, now)).toEqual({ step: 'known', dots: 3 })
  })
  it('says weak for a low card that is due again', () => {
    expect(masteryStep({ level: 0, due: now }, now)).toEqual({ step: 'weak', dots: 0 })
    expect(masteryStep({ level: 1, due: now - 1 }, now)).toEqual({ step: 'weak', dots: 1 })
  })
  it('says learning otherwise', () => {
    expect(masteryStep({ level: 1, due: now + DAY_MS }, now)).toEqual({ step: 'learning', dots: 1 })
    expect(masteryStep({ level: 2, due: now - 1 }, now)).toEqual({ step: 'learning', dots: 2 })
  })
})
