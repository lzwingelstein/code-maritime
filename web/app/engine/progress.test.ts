import { describe, expect, it } from 'vitest'
import { emptyProgress, introduce, isUnlocked, parseProgress, recordLesson, todayXp } from './progress'
import { DAY_MS } from './mastery'

const now = new Date(2026, 10, 12, 9).getTime()

describe('progress', () => {
  it('a won lesson adds XP, a completion, a streak day and mastery', () => {
    const p = recordLesson(emptyProgress(), {
      lessonId: 'l1', won: true, xp: 15,
      answers: [{ cardId: 'a', correct: true, isRetry: false }, { cardId: 'b', correct: false, isRetry: false }],
    }, now)
    expect(p.xp).toBe(15)
    expect(todayXp(p, '2026-11-12')).toBe(15)
    expect(todayXp(p, '2026-11-13')).toBe(0)
    expect(p.completions).toEqual({ l1: 1 })
    expect(p.streak).toEqual({ count: 1, lastDay: '2026-11-12' })
    expect(p.mastery.a).toEqual({ level: 1, due: now + DAY_MS })
    expect(p.mastery.b).toEqual({ level: 0, due: now })
  })

  it('a lost lesson still records mastery, but no XP, completion or streak', () => {
    const p = recordLesson(emptyProgress(), {
      lessonId: 'l1', won: false, xp: 0, answers: [{ cardId: 'a', correct: false, isRetry: false }],
    }, now)
    expect(p.xp).toBe(0)
    expect(p.completions).toEqual({})
    expect(p.streak.count).toBe(0)
    expect(p.mastery.a).toEqual({ level: 0, due: now })
  })

  it('introducing a card makes it known without changing its level', () => {
    const p = introduce(emptyProgress(), 'a', now)
    expect(p.mastery.a).toEqual({ level: 0, due: now })
    expect(introduce(recordLesson(p, { lessonId: 'x', won: true, xp: 0, answers: [{ cardId: 'a', correct: true, isRetry: false }] }, now), 'a', now).mastery.a!.level).toBe(1)
  })

  it('unlocks a lesson once the previous one is done', () => {
    const ids = ['l1', 'l2', 'l3']
    const p = { ...emptyProgress(), completions: { l1: 2 } }
    expect(ids.map((_, i) => isUnlocked(p, ids, i))).toEqual([true, true, false])
  })

  it('reads saved data defensively', () => {
    expect(parseProgress('not json')).toEqual(emptyProgress())
    expect(parseProgress(null)).toEqual(emptyProgress())
    expect(parseProgress(JSON.stringify({ xp: 12 })).xp).toBe(12)
  })
})
