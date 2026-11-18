import { describe, expect, it } from 'vitest'
import { COURSES } from './index'
import { revisionSheets } from './sheets'

describe('revision sheets', () => {
  it('lists done lessons by unit, review lessons left out, each card once per unit', () => {
    const sheets = revisionSheets(COURSES, { 'navire-moteur': 1, 'voilier': 2, 'revision-navires': 1, 'laterales': 1 })
    expect(sheets.map(u => u.course.id)).toEqual(['balisage', 'navires'])
    const navires = sheets[1]!
    expect(navires.lessons.map(l => l.lesson.id)).toEqual(['navire-moteur', 'voilier'])
    expect(navires.lessons[0]!.cards).toEqual(['power', 'power50'])
    expect(navires.lessons[1]!.cards).toEqual(['sail'])
  })

  it('is empty before any lesson is done', () => {
    expect(revisionSheets(COURSES, {})).toEqual([])
  })
})
