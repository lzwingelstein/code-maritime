/** Player progress: XP, daily goal, streak, lesson completions and card mastery. Pure functions; storage is elsewhere. */
import { applyAnswer, type CardMastery } from './mastery'
import { dayKey, recordPlay, type Streak } from './streak'
import type { AnswerLog } from './types'

export interface Progress {
  xp: number
  /** XP earned per day key, for the daily goal (only today's is kept). */
  daily: Record<string, number>
  streak: Streak
  completions: Record<string, number>
  mastery: Record<string, CardMastery>
  /** Mock exam attempts, newest first (ten at most). */
  exams?: ExamResult[]
  /** Answers per card, all time. */
  cards?: Record<string, AnswerCount>
  /** Answers and XP per day, for the last HISTORY_DAYS days with activity. */
  history?: Record<string, DayStats>
}

export interface AnswerCount {
  right: number
  wrong: number
}

export interface DayStats extends AnswerCount {
  xp: number
  /** Lessons of the path done for the first time that day (replays, practice and exams left out). */
  lessons?: number
}

export const HISTORY_DAYS = 60

export interface ExamResult {
  day: string
  errors: number
  total: number
  passed: boolean
}

export const DAILY_GOAL = 30

export function emptyProgress(): Progress {
  return { xp: 0, daily: {}, streak: { count: 0, lastDay: null }, completions: {}, mastery: {} }
}

export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress()
  try {
    const data = JSON.parse(raw)
    return typeof data === 'object' && data ? { ...emptyProgress(), ...data } : emptyProgress()
  }
  catch {
    return emptyProgress()
  }
}

export function todayXp(p: Progress, today: string): number {
  return p.daily[today] ?? 0
}

export function introduce(p: Progress, cardId: string, now: number): Progress {
  if (p.mastery[cardId]) return p
  return { ...p, mastery: { ...p.mastery, [cardId]: { level: 0, due: now } } }
}

export function recordLesson(
  p: Progress,
  /** `path: false` for a practice or an exam: it does not move the path forward. */
  r: { lessonId: string, won: boolean, xp: number, answers: AnswerLog[], path?: boolean },
  now: number,
): Progress {
  const mastery = { ...p.mastery }
  const cards = { ...p.cards }
  const today = dayKey(new Date(now))
  const day: DayStats = { ...(p.history?.[today] ?? { right: 0, wrong: 0, xp: 0 }) }
  for (const a of r.answers) {
    mastery[a.cardId] = applyAnswer(mastery[a.cardId], a.correct, now)
    const c = { ...(cards[a.cardId] ?? { right: 0, wrong: 0 }) }
    if (a.correct) { c.right++; day.right++ }
    else { c.wrong++; day.wrong++ }
    cards[a.cardId] = c
  }
  if (r.won) day.xp += r.xp
  if (r.won && r.path !== false && !p.completions[r.lessonId]) day.lessons = (day.lessons ?? 0) + 1
  const history = Object.fromEntries(
    Object.entries({ ...p.history, [today]: day }).sort(([a], [b]) => a.localeCompare(b)).slice(-HISTORY_DAYS),
  )
  if (!r.won) return { ...p, mastery, cards, history }

  return {
    ...p,
    cards,
    history,
    xp: p.xp + r.xp,
    daily: { [today]: todayXp(p, today) + r.xp },
    streak: recordPlay(p.streak, today),
    completions: { ...p.completions, [r.lessonId]: (p.completions[r.lessonId] ?? 0) + 1 },
    mastery,
  }
}

export function isUnlocked(p: Progress, lessonIds: string[], index: number): boolean {
  // A lesson already done stays open, even if a lesson is added before it in the path.
  return index === 0 || (p.completions[lessonIds[index - 1]!] ?? 0) > 0 || (p.completions[lessonIds[index]!] ?? 0) > 0
}

export function recordExam(p: Progress, r: Omit<ExamResult, 'day'>, now: number): Progress {
  const entry: ExamResult = { day: dayKey(new Date(now)), ...r }
  return { ...p, exams: [entry, ...(p.exams ?? [])].slice(0, 10) }
}

export function bestExam(p: Progress): ExamResult | null {
  const list = p.exams ?? []
  return list.length ? list.reduce((a, b) => (b.errors < a.errors ? b : a)) : null
}
