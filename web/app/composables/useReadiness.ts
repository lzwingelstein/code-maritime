import { COURSES } from '~/courses'
import { pace, readiness } from '~/engine/readiness'
import { dayKey } from '~/engine/streak'

/** Pace assumed before the player's own is known: two lessons a day, about the 30 XP daily goal. */
export const DEFAULT_PACE = 2

/**
 * Exam readiness over the whole path (the boat basics included: they are needed to read the questions),
 * with the end of the path dated at the player's own pace over the last two weeks.
 */
export function useReadiness() {
  const { progress } = useProgress()
  return computed(() => {
    const now = new Date()
    const today = dayKey(now)
    const lessons = COURSES.flatMap(c => c.lessons)
    const cards = [...new Set(lessons.flatMap(l => l.plan.cards))]
    const own = pace(progress.value.history ?? {}, today)
    const perDay = own ?? DEFAULT_PACE
    const r = readiness({
      lessonsDone: lessons.filter(l => progress.value.completions[l.id]).length,
      lessonsTotal: lessons.length,
      levels: cards.map(id => progress.value.mastery[id]?.level ?? null),
      perDay,
    })
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + r.daysLeft)
    return {
      ...r,
      perDay,
      paceKnown: own !== null,
      perDayText: perDay.toLocaleString('fr-FR', { maximumFractionDigits: 1 }),
      endText: r.daysLeft > 365 ? 'dans plus d’un an' : `vers le ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`,
    }
  })
}
