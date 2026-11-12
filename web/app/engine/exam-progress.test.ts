import { describe, expect, it } from 'vitest'
import { bestExam, emptyProgress, recordExam, recordLesson } from './progress'

const now = new Date(2026, 10, 12, 9).getTime()

describe('exam results', () => {
  it('keeps the last ten attempts, newest first', () => {
    let p = emptyProgress()
    for (let i = 0; i < 12; i++) p = recordExam(p, { errors: i, total: 40, passed: i <= 5 }, now + i)
    expect(p.exams).toHaveLength(10)
    expect(p.exams![0]!.errors).toBe(11)
  })

  it('finds the best attempt', () => {
    let p = emptyProgress()
    expect(bestExam(p)).toBeNull()
    p = recordExam(p, { errors: 7, total: 40, passed: false }, now)
    p = recordExam(p, { errors: 3, total: 40, passed: true }, now)
    p = recordExam(p, { errors: 9, total: 40, passed: false }, now)
    expect(bestExam(p)!.errors).toBe(3)
  })

  it('a finished lesson keeps the exam history', () => {
    const p = recordExam(emptyProgress(), { errors: 2, total: 40, passed: true }, now)
    const after = recordLesson(p, { lessonId: 'x', won: true, xp: 10, answers: [] }, now)
    expect(after.exams).toHaveLength(1)
  })
})
