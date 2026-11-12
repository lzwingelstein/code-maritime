/** Daily streak: one flame per day with at least one finished lesson. Days are local 'YYYY-MM-DD' keys. */
export interface Streak {
  count: number
  lastDay: string | null
}

export function dayKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function previousDay(day: string): string {
  const [y, m, d] = day.split('-').map(Number) as [number, number, number]
  return dayKey(new Date(y, m - 1, d - 1))
}

export function currentStreak(s: Streak, today: string): number {
  return s.lastDay === today || s.lastDay === previousDay(today) ? s.count : 0
}

export function recordPlay(s: Streak, today: string): Streak {
  if (s.lastDay === today) return s
  return { count: currentStreak(s, today) + 1, lastDay: today }
}
