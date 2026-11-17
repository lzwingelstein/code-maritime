/**
 * What the home "Continuer" button launches: the next lesson of the path, or a practice series
 * when weak points pile up. The other option stays offered as a secondary link.
 */
export const WEAK_THRESHOLD = 5

export type NextKind = 'lesson' | 'practice'

export function nextStep(s: { weak: number, seen: number, minCards: number, current: number }): { main: NextKind, other: NextKind | null } {
  const canPractice = s.seen >= s.minCards
  const hasLesson = s.current >= 0
  if (!hasLesson) return { main: 'practice', other: null }
  if (canPractice && s.weak >= WEAK_THRESHOLD) return { main: 'practice', other: 'lesson' }
  return { main: 'lesson', other: canPractice ? 'practice' : null }
}
