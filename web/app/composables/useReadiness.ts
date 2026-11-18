import { COURSES } from '~/courses'
import { readiness } from '~/engine/readiness'

/** Lessons a day at the daily goal (about 15 XP a lesson for 30 XP a day). */
export const LESSONS_PER_DAY = 2

/** Exam readiness over the whole path (the boat basics included: they are needed to read the questions). */
export function useReadiness() {
  const { progress } = useProgress()
  return computed(() => {
    const lessons = COURSES.flatMap(c => c.lessons)
    const cards = [...new Set(lessons.flatMap(l => l.plan.cards))]
    return readiness({
      lessonsDone: lessons.filter(l => progress.value.completions[l.id]).length,
      lessonsTotal: lessons.length,
      levels: cards.map(id => progress.value.mastery[id]?.level ?? null),
      perDay: LESSONS_PER_DAY,
    })
  })
}
