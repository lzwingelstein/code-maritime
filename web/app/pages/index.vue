<script setup lang="ts">
import { COURSES, findLesson, LESSON_IDS } from '~/courses'
import { EXAM, EXAM_ID } from '~/courses/exam'
import { PRACTICE, PRACTICE_ID, weakCards } from '~/courses/practice'
import { lessonsToReview } from '~/engine/lesson-status'
import { nextStep } from '~/engine/next'
import { bestExam, isUnlocked } from '~/engine/progress'

const { progress } = useProgress()

const ready = useReadiness()
// Readiness ring: circumference of a 52 px radius circle.
const RING = 2 * Math.PI * 52
// Lessons are unlocked in path order, across units.
const toReview = computed(() => lessonsToReview(
  COURSES.flatMap(c => c.lessons).map(l => ({ id: l.id, cards: l.plan.cards, done: !!progress.value.completions[l.id] })),
  progress.value.mastery,
))
const units = computed(() => COURSES.map((course, u) => ({
  course,
  label: `Unité ${u + 1} · ${course.unit}`,
  nodes: course.lessons.map((lesson, k) => {
    const i = LESSON_IDS.indexOf(lesson.id)
    const done = !!progress.value.completions[lesson.id]
    return { lesson, num: k + 1, index: i, unlocked: isUnlocked(progress.value, LESSON_IDS, i), done, review: toReview.value.includes(lesson.id) }
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
  : 'Continuer ma révision')
const sub = computed(() => (next.value.main === 'lesson'
  ? (nextLesson.value ? `${nextLesson.value.course.title} · ${nextLesson.value.lesson.title}` : '')
  : `${PRACTICE.questions} questions sur les fiches déjà vues`))
const altLabel = (k: 'lesson' | 'practice') => (k === 'practice' ? 'Plutôt m’entraîner' : 'Plutôt avancer dans le parcours')
const best = computed(() => bestExam(progress.value))
const last = computed(() => progress.value.exams?.[0] ?? null)

const OFFSETS = [0, 52, 74, 52, 0, -52, -74, -52]
</script>

<template>
  <div class="shell">
    <header class="top">
      <span class="course display"><UiIcon name="boat" :size="22" /> Permis côtier</span>
      <span class="info">
        <template v-if="ready.lessonsLeft">Fin <b>{{ ready.endShort }}</b></template>
        <template v-else>Parcours terminé ✓</template>
      </span>
    </header>

    <section class="hero" aria-labelledby="ready-title">
      <h2 id="ready-title" class="kicker">Prêt pour l’examen</h2>
      <NuxtLink to="/stats" class="gauge" :aria-label="`Prêt à ${ready.percent} % pour l’examen : voir le détail`">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="52" class="track" />
          <circle v-if="ready.percent" cx="60" cy="60" r="52" class="fill" :stroke-dasharray="`${RING * ready.percent / 100} ${RING}`" />
        </svg>
        <b class="display">{{ ready.percent }}<small>%</small></b>
      </NuxtLink>
      <p class="when">
        <template v-if="ready.lessonsLeft">Encore {{ ready.lessonsLeft }} leçon{{ ready.lessonsLeft > 1 ? 's' : '' }} à faire, puis des révisions.</template>
        <template v-else>Parcours terminé : ancre tes fiches, puis vise un examen blanc.</template>
      </p>
    </section>

    <section class="next" aria-label="Prochaine étape">
      <NuxtLink :to="link(next.main)" class="go">
        <span class="go-title display">{{ label(next.main) }}</span>
        <span class="go-sub">{{ sub }}</span>
      </NuxtLink>
      <p class="reason">{{ reason }}</p>
      <NuxtLink v-if="next.other" :to="link(next.other)" class="alt">{{ altLabel(next.other) }}</NuxtLink>
    </section>

    <template v-for="u in units" :key="u.course.id">
      <section class="unit" :class="{ locked: !u.nodes[0]?.unlocked }">
        <small>{{ u.label }}<template v-if="!u.nodes[0]?.unlocked"> · verrouillée</template></small>
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
            <CardVisual v-if="n.lesson.icon.type !== 'emoji'" :visual="n.lesson.icon" />
            <span v-else class="num display" aria-hidden="true">{{ n.num }}</span>
            <span v-if="n.review" class="badge review" aria-hidden="true">↻</span>
            <span v-else-if="n.done" class="badge" aria-hidden="true">✓</span>
            <span v-if="n.index === current" class="bubble">Commencer</span>
          </NuxtLink>
          <span v-else class="node locked" :aria-label="`${n.lesson.title}, verrouillée`">
            <CardVisual v-if="n.lesson.icon.type !== 'emoji'" :visual="n.lesson.icon" />
            <span v-else class="num display" aria-hidden="true">{{ n.num }}</span>
            <span class="lock" aria-hidden="true"><UiIcon name="lock" :size="16" /></span>
          </span>
          <span class="nlab">{{ n.lesson.title }}</span>
          <span v-if="n.review" class="why" aria-hidden="true">À revoir · erreurs récentes</span>
        </div>
      </nav>
    </template>

    <section class="exam" aria-labelledby="exam-title">
      <h2 id="exam-title"><UiIcon name="cap" :size="22" /> Examen blanc</h2>
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
  position: sticky; top: 0; z-index: 5; display: flex; justify-content: space-between; align-items: center; gap: 12px;
  min-height: 56px; padding: 0 18px; background: var(--bg);
}
.course { color: var(--primary); font-size: 17px; font-weight: 700; white-space: nowrap; }
.info { font-size: 14px; font-weight: 500; color: var(--ink-mute); text-align: right; white-space: nowrap; }
.info b { color: var(--ink); font-weight: 600; }
/* One main action: readiness first, then the single big button. */
.hero { display: flex; flex-direction: column; align-items: center; gap: 12px; margin: 16px 16px 0; padding: 20px 18px; border: 2px solid var(--line); border-radius: 18px; background: var(--surface); text-align: center; }
.kicker { margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-mute); }
.gauge { position: relative; display: block; width: 136px; height: 136px; color: var(--ink); text-decoration: none; }
.gauge svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.gauge circle { fill: none; stroke-width: 12; }
.gauge .track { stroke: var(--primary-soft); }
.gauge .fill { stroke: var(--primary); stroke-linecap: round; }
.gauge b { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 38px; font-weight: 700; }
.gauge b small { font-size: 18px; color: var(--ink-mute); margin-left: 2px; }
.when { margin: 0; font-size: 15px; font-weight: 500; line-height: 1.4; color: var(--ink); }
/* The main action: its own card under the gauge, text aligned left. */
.next { display: flex; flex-direction: column; gap: 8px; margin: 14px 16px 0; }
.go {
  display: flex; flex-direction: column; gap: 4px; padding: 18px 22px; border-radius: 18px;
  background: var(--primary); color: #fff; text-decoration: none;
}
.go:active { transform: translateY(1px); background: var(--primary-shadow); }
.go-title { font-size: 20px; font-weight: 600; }
.go-sub { font-size: 14px; font-weight: 400; color: var(--on-primary-mute); }
.reason { margin: 0; padding: 0 4px; font-size: 14px; font-weight: 500; line-height: 1.4; color: var(--ink-mute); }
.next .alt { align-self: flex-start; display: inline-flex; align-items: center; justify-content: center; min-height: 44px; color: var(--primary); font-size: 15px; font-weight: 600; }
/* Unit headers are titles, not buttons: no fill, no raised shadow, a rule underneath. */
.unit { margin: 26px 16px 0; padding: 0 2px 10px; border-bottom: 2px solid var(--line); }
.unit small { font-size: 12px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: .06em; }
.unit h1 { margin: 2px 0 0; font-size: 20px; font-weight: 700; color: var(--ink); }
.unit.locked small, .unit.locked h1 { color: var(--ink-mute); }
.path { display: flex; flex-direction: column; align-items: center; gap: 62px; padding: 62px 0 40px; }
.nwrap { display: flex; flex-direction: column; align-items: center; }
.node {
  position: relative; display: flex; align-items: center; justify-content: center; width: 78px; height: 72px;
  border-radius: 50%; background: var(--primary); box-shadow: 0 4px 0 var(--primary-shadow);
}
.node :deep(svg:not(.icon)) { height: 56px; }
.node:active { transform: translateY(3px); box-shadow: 0 1px 0 var(--primary-shadow); }
.node.done { background: var(--gold); box-shadow: 0 4px 0 var(--gold-shadow); }
.node.locked { background: var(--disabled); box-shadow: 0 4px 0 var(--disabled-shadow); }
.node.locked :deep(svg:not(.icon)) { filter: grayscale(1) opacity(.4); }
.lock {
  position: absolute; right: -8px; bottom: -8px; display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;
  border: 2px solid var(--line); border-radius: 50%; background: var(--surface); color: var(--ink-mute);
}
/* Lessons without a drawn picture show their number in the unit (no emoji in the interface). */
.num { color: #fff; font-size: 30px; font-weight: 700; }
.node.done .num { color: var(--gold-text); }
.node.locked .num { color: var(--disabled-text); }
.badge {
  position: absolute; right: -10px; bottom: -8px; min-width: 28px; padding: 1px 7px; border: 2px solid var(--line); border-radius: 99px;
  background: var(--surface); color: var(--gold-text); font-size: 15px; font-weight: 700; text-align: center; white-space: nowrap;
}
.badge.review { color: var(--primary); border-color: var(--primary); }
.bubble {
  position: absolute; top: -46px; left: 50%; padding: 6px 12px; border: 2px solid var(--line); border-radius: 12px;
  background: var(--surface); color: var(--primary); font-size: 13px; white-space: nowrap;
  font-weight: 600; transform: translateX(-50%); animation: bob 1.4s ease-in-out infinite;
}
.bubble::after {
  content: ""; position: absolute; bottom: -8px; left: 50%; margin-left: -7px;
  border: 7px solid transparent; border-top-color: var(--surface); border-bottom: 0;
}
@keyframes bob { 50% { transform: translate(-50%, -5px); } }
.why { margin-top: 2px; font-size: 13px; font-weight: 600; color: var(--primary); }
.nlab { max-width: 150px; margin-top: 12px; font-size: 14px; color: var(--ink-mute); text-align: center; }
.exam { margin: 0 16px 34px; padding: 18px; border: 2px solid var(--line); border-radius: 18px; background: var(--surface); text-align: center; }
.exam h2 { margin: 0 0 6px; font-size: 20px; font-weight: 700; }
.exam p { margin: 0 0 12px; font-size: 15px; font-weight: 500; color: var(--ink-mute); line-height: 1.4; }
.exam .score { color: var(--ink); font-weight: 600; }
.exam .btn { display: block; text-decoration: none; line-height: 28px; }
</style>
