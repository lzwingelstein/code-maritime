/**
 * How ready the player is for the exam, in percent: the mean of the path done and how well the cards are known.
 * A card counts fully from level 3 (seen right after a week), partly below, not at all if never seen.
 * Days left: lessons still to do at a steady pace (default two lessons a day, the daily goal).
 */
export function readiness(r: { lessonsDone: number, lessonsTotal: number, levels: (number | null)[], perDay: number }) {
  const path = r.lessonsTotal ? r.lessonsDone / r.lessonsTotal : 0
  const mastery = r.levels.length ? r.levels.reduce<number>((s, l) => s + (l === null ? 0 : Math.min(l, 3) / 3), 0) / r.levels.length : 0
  const lessonsLeft = Math.max(0, r.lessonsTotal - r.lessonsDone)
  return {
    percent: Math.round((path + mastery) / 2 * 100),
    path: Math.round(path * 100),
    mastery: Math.round(mastery * 100),
    lessonsLeft,
    daysLeft: Math.ceil(lessonsLeft / r.perDay),
  }
}
