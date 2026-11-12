/**
 * Spaced repetition, same rule as BirdGuessr: a right answer moves the card up a level and pushes it back
 * 1 day, 3 days, 1 week then 3 weeks; a mistake moves it down a level and makes it due now.
 */
export interface CardMastery {
  level: number
  /** Epoch ms after which the card should be reviewed. */
  due: number
}

export const DAY_MS = 86_400_000
export const INTERVAL_DAYS = [1, 3, 7, 21] as const
export const MAX_LEVEL = INTERVAL_DAYS.length

export function applyAnswer(m: CardMastery | undefined, correct: boolean, now: number): CardMastery {
  const level = m?.level ?? 0
  if (!correct) return { level: Math.max(0, level - 1), due: now }
  const next = Math.min(MAX_LEVEL, level + 1)
  return { level: next, due: now + INTERVAL_DAYS[next - 1]! * DAY_MS }
}

export function isDue(m: CardMastery | undefined, now: number): boolean {
  return !m || m.due <= now
}

/** How much a review lesson should pick this card: weak and due cards first, known ones rarely. */
export function reviewWeight(m: CardMastery | undefined, now: number): number {
  const weakness = MAX_LEVEL + 1 - (m?.level ?? 0)
  return isDue(m, now) ? weakness * 2 : weakness / 4
}
