import { describe, expect, it } from 'vitest'
import { nextStep, WEAK_THRESHOLD } from './next'

describe('nextStep', () => {
  const base = { weak: 0, seen: 10, minCards: 4, current: 3 }

  it('goes on with the path while there are few weak points', () => {
    expect(nextStep({ ...base, weak: WEAK_THRESHOLD - 1 })).toEqual({ main: 'lesson', other: 'practice' })
  })

  it('suggests practice from the threshold on, the path staying one tap away', () => {
    expect(nextStep({ ...base, weak: WEAK_THRESHOLD })).toEqual({ main: 'practice', other: 'lesson' })
  })

  it('offers no practice before enough cards were seen', () => {
    expect(nextStep({ ...base, weak: 9, seen: 3 })).toEqual({ main: 'lesson', other: null })
  })

  it('practices once the path is finished', () => {
    expect(nextStep({ ...base, current: -1 })).toEqual({ main: 'practice', other: null })
  })
})
