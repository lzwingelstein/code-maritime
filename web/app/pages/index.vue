<script setup lang="ts">
import { COURSES, findLesson, LESSON_IDS } from '~/courses'
import { EXAM, EXAM_ID } from '~/courses/exam'
import { PRACTICE, PRACTICE_ID, weakCards } from '~/courses/practice'
import { lessonsToReview } from '~/engine/lesson-status'
import { nextStep } from '~/engine/next'
import { bestExam, DAILY_GOAL, isUnlocked, todayXp } from '~/engine/progress'
import { currentStreak, dayKey } from '~/engine/streak'

const { progress } = useProgress()
const today = dayKey(new Date())

const streak = computed(() => currentStreak(progress.value.streak, today))
const dayXp = computed(() => todayXp(progress.value, today))
// Lessons are unlocked in path order, across units.
const toReview = computed(() => lessonsToReview(
  COURSES.flatMap(c => c.lessons).map(l => ({ id: l.id, cards: l.plan.cards, done: !!progress.value.completions[l.id] })),
  progress.value.mastery,
))
const units = computed(() => COURSES.map((course, u) => ({
  course,
  label: `Unité ${u + 1} · ${course.unit}`,
  nodes: course.lessons.map((lesson) => {
    const i = LESSON_IDS.indexOf(lesson.id)
    const done = !!progress.value.completions[lesson.id]
    return { lesson, index: i, unlocked: isUnlocked(progress.value, LESSON_IDS, i), done, review: toReview.value.includes(lesson.id) }
  }),
})))
const current = computed(() => LESSON_IDS.findIndex((id, i) => isUnlocked(progress.value, LESSON_IDS, i) && !progress.value.completions[id]))

const seen = computed(() => Object.keys(progress.value.mastery).length)
const weak = computed(() => weakCards(COURSES, progress.value.mastery, Date.now()).length)
const next = computed(() => nextStep({ weak: weak.value, seen: seen.value, minCards: PRACTICE.minCards, current: current.value }))
const nextLesson = computed(() => (current.value >= 0 ? findLesson(LESSON_IDS[current.value]!) : null))
const points = (n: number) => `${n} point${n > 1 ? 's' : ''} faible${n > 1 ? 's' : ''}`
const reason = computed(() => {
  if (next.value.main === 'lesson') {
    return weak.value
      ? `Seulement ${points(weak.value)} pour l’instant : tu peux découvrir la suite.`
      : 'Aucun point faible pour l’instant : tu peux découvrir la suite.'
  }
  if (current.value < 0) return `Tu as fini le parcours ! Entraîne-toi sur tout le programme${weak.value ? `, surtout tes ${points(weak.value)}` : ''}.`
  return `Tu as ${points(weak.value)} : on les consolide avant d’avancer.`
})
const link = (k: 'lesson' | 'practice') => `/lecon/${k === 'practice' ? PRACTICE_ID : LESSON_IDS[current.value]}`
const label = (k: 'lesson' | 'practice') => (k === 'practice'
  ? (weak.value ? `Retravailler mes ${points(weak.value)}` : `S’entraîner (${PRACTICE.questions} questions)`)
  : `Continuer : ${nextLesson.value?.lesson.title ?? ''}`)
const altLabel = (k: 'lesson' | 'practice') => (k === 'practice' ? 'Plutôt m’entraîner' : 'Plutôt avancer dans le parcours')
const best = computed(() => bestExam(progress.value))
const last = computed(() => progress.value.exams?.[0] ?? null)

const OFFSETS = [0, 52, 74, 52, 0, -52, -74, -52]
</script>

<template>
  <div class="shell">
    <header class="top">
      <span class="stat" :aria-label="`Série : ${streak} jours`">🔥 {{ streak }}</span>
      <span class="stat course">⛵ Permis côtier</span>
      <span class="stat xp" :aria-label="`${progress.xp} points d’expérience`">⚡ {{ progress.xp }} XP</span>
    </header>

    <section class="goal">
      <div class="lab">
        <span>Objectif du jour</span>
        <span>{{ Math.min(dayXp, DAILY_GOAL) }} / {{ DAILY_GOAL }} XP</span>
      </div>
      <div class="bar" role="progressbar" :aria-valuenow="Math.min(dayXp, DAILY_GOAL)" :aria-valuemax="DAILY_GOAL">
        <i :style="{ width: Math.min(100, dayXp / DAILY_GOAL * 100) + '%', background: 'var(--gold)' }" />
      </div>
    </section>

    <section class="exam practice" aria-labelledby="next-title">
      <h2 id="next-title">{{ next.main === 'practice' ? '🎯 On consolide' : '⛵ On avance' }}</h2>
      <p>{{ reason }}</p>
      <NuxtLink :to="link(next.main)" class="btn">{{ label(next.main) }}</NuxtLink>
      <NuxtLink v-if="next.other" :to="link(next.other)" class="alt">{{ altLabel(next.other) }}</NuxtLink>
    </section>

    <template v-for="u in units" :key="u.course.id">
      <section class="unit" :class="{ locked: !u.nodes[0]?.unlocked }">
        <small>{{ u.label }}<template v-if="!u.nodes[0]?.unlocked"> · 🔒 verrouillée</template></small>
        <h1>{{ u.course.title }}</h1>
      </section>

      <nav class="path" :aria-label="`Leçons : ${u.course.title}`">
        <div v-for="n in u.nodes" :key="n.lesson.id" class="nwrap" :style="{ transform: `translateX(${OFFSETS[n.index % 8]}px)` }">
          <NuxtLink
            v-if="n.unlocked"
            :to="`/lecon/${n.lesson.id}`"
            class="node"
            :class="{ done: n.done }"
            :aria-label="`${n.lesson.title}${n.review ? ', à revoir : erreurs récentes' : n.done ? ', terminée' : ''}`"
          >
            <CardVisual :visual="n.lesson.icon" />
            <span v-if="n.review" class="badge review" aria-hidden="true">↻</span>
            <span v-else-if="n.done" class="badge" aria-hidden="true">✓</span>
            <span v-if="n.index === current" class="bubble">Commencer</span>
          </NuxtLink>
          <span v-else class="node locked" :aria-label="`${n.lesson.title}, verrouillée`">
            <CardVisual :visual="n.lesson.icon" />
            <span class="lock" aria-hidden="true">🔒</span>
          </span>
          <span class="nlab">{{ n.lesson.title }}</span>
          <span v-if="n.review" class="why" aria-hidden="true">À revoir · erreurs récentes</span>
        </div>
      </nav>
    </template>

    <section class="exam" aria-labelledby="exam-title">
      <h2 id="exam-title">🎓 Examen blanc</h2>
      <p>{{ EXAM.questions }} questions de toutes les unités, {{ EXAM.maxErrors }} erreurs au plus, environ {{ EXAM.minutes }} minutes : comme le jour de l’examen.</p>
      <p v-if="best" class="score">
        Meilleur : {{ best.total - best.errors }}/{{ best.total }} {{ best.passed ? '✓ reçu' : '' }}
        <template v-if="last"> · Dernier : {{ last.total - last.errors }}/{{ last.total }}</template>
      </p>
      <NuxtLink :to="`/lecon/${EXAM_ID}`" class="btn">Passer un examen blanc</NuxtLink>
    </section>

  </div>
</template>

<style scoped>
.top {
  position: sticky; top: 0; z-index: 5; display: flex; justify-content: space-between; align-items: center;
  padding: 14px 18px; border-bottom: 2px solid var(--line); background: var(--surface);
}
.stat { font-size: 17px; }
.course { color: var(--primary); font-weight: 900; }
.xp { color: var(--gold-text); }
.goal { padding: 14px 18px 4px; }
.lab { display: flex; justify-content: space-between; font-size: 13px; color: var(--ink-mute); margin-bottom: 6px; }
/* Unit headers are titles, not buttons: no fill, no raised shadow, a rule underneath. */
.unit { margin: 26px 16px 0; padding: 0 2px 10px; border-bottom: 2px solid var(--line); }
.unit small { font-size: 12px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: .06em; }
.unit h1 { margin: 2px 0 0; font-size: 20px; font-weight: 900; color: var(--ink); }
.unit.locked small, .unit.locked h1 { color: var(--ink-mute); }
.path { display: flex; flex-direction: column; align-items: center; gap: 62px; padding: 62px 0 40px; }
.nwrap { display: flex; flex-direction: column; align-items: center; }
.node {
  position: relative; display: flex; align-items: center; justify-content: center; width: 78px; height: 72px;
  border-radius: 50%; background: var(--primary); box-shadow: 0 7px 0 var(--primary-shadow);
}
.node :deep(svg) { height: 56px; }
.node:active { transform: translateY(5px); box-shadow: 0 2px 0 var(--primary-shadow); }
.node.done { background: var(--gold); box-shadow: 0 7px 0 var(--gold-shadow); }
.node.locked { background: var(--disabled); box-shadow: 0 7px 0 var(--disabled-shadow); }
.node.locked :deep(svg), .node.locked :deep(.emoji) { filter: grayscale(1) opacity(.4); }
.lock { position: absolute; right: -4px; bottom: -6px; font-size: 18px; }
.badge {
  position: absolute; right: -10px; bottom: -8px; min-width: 28px; padding: 1px 7px; border: 2px solid var(--line); border-radius: 99px;
  background: var(--surface); color: var(--gold-text); font-size: 15px; font-weight: 900; text-align: center; white-space: nowrap;
}
.badge.review { color: var(--primary); border-color: var(--primary); }
.bubble {
  position: absolute; top: -46px; left: 50%; padding: 6px 12px; border: 2px solid var(--line); border-radius: 12px;
  background: var(--surface); color: var(--primary); font-size: 13px; white-space: nowrap;
  text-transform: uppercase; letter-spacing: .04em; transform: translateX(-50%); animation: bob 1.4s ease-in-out infinite;
}
.bubble::after {
  content: ""; position: absolute; bottom: -8px; left: 50%; margin-left: -7px;
  border: 7px solid transparent; border-top-color: var(--surface); border-bottom: 0;
}
@keyframes bob { 50% { transform: translate(-50%, -5px); } }
.why { margin-top: 2px; font-size: 13px; font-weight: 800; color: var(--primary); }
.nlab { max-width: 150px; margin-top: 12px; font-size: 14px; color: var(--ink-mute); text-align: center; }
.exam { margin: 0 16px 34px; padding: 18px; border: 2px solid var(--line); border-radius: 18px; text-align: center; }
.exam h2 { margin: 0 0 6px; font-size: 20px; font-weight: 900; }
.exam p { margin: 0 0 12px; font-size: 15px; font-weight: 600; color: var(--ink-mute); line-height: 1.4; }
.exam .score { color: var(--ink); font-weight: 800; }
.exam.practice { margin: 14px 16px 0; }
.exam .alt { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; margin-top: 6px; color: var(--primary); font-size: 15px; font-weight: 800; }
.exam .btn { display: block; text-decoration: none; line-height: 28px; }
</style>
