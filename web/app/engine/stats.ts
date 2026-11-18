/** Read-only statistics computed from progress. Generic: cards are plain ids. */
import { isDue, type CardMastery } from './mastery'
import type { AnswerCount, DayStats, Progress } from './progress'
import { dayKey } from './streak'

export { HISTORY_DAYS } from './progress'

export function totals(p: Progress): AnswerCount {
  return Object.values(p.cards ?? {}).reduce((t, c) => ({ right: t.right + c.right, wrong: t.wrong + c.wrong }), { right: 0, wrong: 0 })
}

/** Share of right answers, in percent; null before any answer. */
export function accuracy(p: Progress, cardIds?: string[]): number | null {
  const list = cardIds ? cardIds.map(id => p.cards?.[id]).filter(Boolean) as AnswerCount[] : Object.values(p.cards ?? {})
  const right = list.reduce((n, c) => n + c.right, 0)
  const all = list.reduce((n, c) => n + c.right + c.wrong, 0)
  return all ? Math.round(right / all * 100) : null
}

/** The last `days` days up to today, oldest first. */
export function activity(p: Progress, today: string, days: number): (DayStats & { day: string })[] {
  const [y, m, d] = today.split('-').map(Number) as [number, number, number]
  return Array.from({ length: days }, (_, i) => {
    const day = dayKey(new Date(y, m - 1, d - (days - 1 - i)))
    return { day, ...(p.history?.[day] ?? { right: 0, wrong: 0, xp: 0 }) }
  })
}

/** Cards answered wrong at least once: most wrong answers first, then highest error rate. */
export function mostMissed(p: Progress, n: number): (AnswerCount & { cardId: string, rate: number })[] {
  return Object.entries(p.cards ?? {})
    .filter(([, c]) => c.wrong > 0)
    .map(([cardId, c]) => ({ cardId, ...c, rate: Math.round(c.wrong / (c.right + c.wrong) * 100) }))
    .sort((a, b) => b.wrong - a.wrong || b.rate - a.rate)
    .slice(0, n)
}

/** Cards of a set: never seen, to rework (level ≤ 1 and due), learning, known (level ≥ 3). */
export function masteryBreakdown(mastery: Record<string, CardMastery>, cardIds: string[], now: number) {
  const out = { unseen: 0, weak: 0, learning: 0, known: 0, total: cardIds.length }
  for (const id of cardIds) {
    const m = mastery[id]
    if (!m) out.unseen++
    else if (m.level >= 3) out.known++
    else if (m.level <= 1 && isDue(m, now)) out.weak++
    else out.learning++
  }
  return out
}

/** Units with answers, weakest first: lowest share of right answers, then most cards to rework. */
export function fragileUnits(p: Progress, units: { id: string, cards: string[] }[], now: number) {
  return units
    .map(u => ({
      id: u.id,
      accuracy: accuracy(p, u.cards),
      answers: u.cards.reduce((n, id) => n + (p.cards?.[id] ? p.cards[id].right + p.cards[id].wrong : 0), 0),
      weak: masteryBreakdown(p.mastery, u.cards, now).weak,
    }))
    .filter((u): u is typeof u & { accuracy: number } => u.accuracy !== null)
    .sort((a, b) => a.accuracy - b.accuracy || b.weak - a.weak)
}
