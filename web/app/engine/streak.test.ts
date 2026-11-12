import { describe, expect, it } from 'vitest'
import { currentStreak, dayKey, recordPlay } from './streak'

describe('streak', () => {
  it('formats local days', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('starts at 1 and grows on consecutive days, across months', () => {
    let s = recordPlay({ count: 0, lastDay: null }, '2026-01-31')
    expect(s).toEqual({ count: 1, lastDay: '2026-01-31' })
    s = recordPlay(s, '2026-02-01')
    expect(s.count).toBe(2)
    expect(recordPlay(s, '2026-02-01').count).toBe(2)
  })

  it('restarts after a missed day', () => {
    expect(recordPlay({ count: 5, lastDay: '2026-03-01' }, '2026-03-03').count).toBe(1)
  })

  it('shows the streak only while it is alive', () => {
    const s = { count: 4, lastDay: '2026-03-01' }
    expect(currentStreak(s, '2026-03-01')).toBe(4)
    expect(currentStreak(s, '2026-03-02')).toBe(4)
    expect(currentStreak(s, '2026-03-03')).toBe(0)
  })
})
