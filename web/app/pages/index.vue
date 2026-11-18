<script setup lang="ts">
import { COURSES, findLesson, LESSON_IDS } from '~/courses'
import { EXAM, EXAM_ID } from '~/courses/exam'
import { PRACTICE, PRACTICE_ID, weakCards } from '~/courses/practice'
import { lessonsToReview, unitProgress } from '~/engine/lesson-status'
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
const units = computed(() => COURSES.map((course, u) => {
  const nodes = course.lessons.map((lesson, k) => {
    const i = LESSON_IDS.indexOf(lesson.id)
    const done = !!progress.value.completions[lesson.id]
    return { lesson, num: k + 1, index: i, unlocked: isUnlocked(progress.value, LESSON_IDS, i), done, review: toReview.value.includes(lesson.id) }
  })
  return { course, num: u + 1, nodes, progress: unitProgress(nodes) }
}))
const doneCount = computed(() => units.value.reduce((n, u) => n + u.progress.done, 0))
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


// Path summary: only the unit holding the next lesson is open at first; the player can open or close any.
const opened = ref<string | null | undefined>(undefined)
const activeUnit = computed(() => units.value.find(u => u.nodes.some(n => n.index === current.value))?.course.id ?? null)
const isOpen = (id: string) => (opened.value === undefined ? activeUnit.value : opened.value) === id
const toggle = (id: string) => { opened.value = isOpen(id) ? null : id }
type Node = (typeof units.value)[number]['nodes'][number]
const lessonState = (n: Node) => {
  if (!n.unlocked) return { text: 'Verrouillée', cls: 'locked' }
  if (n.review) return { text: '↻ À revoir · erreurs récentes', cls: 'review' }
  if (n.done) return { text: '✓ Faite', cls: 'done' }
  if (n.index === current.value) return { text: 'Prochaine leçon', cls: 'current' }
  return { text: 'À faire', cls: 'todo' }
}
const unitCount = (u: (typeof units.value)[number]) => (u.progress.state === 'locked'
  ? `${u.progress.total} leçons · verrouillée`
  : `${u.progress.done} / ${u.progress.total}`)
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

    <section class="route" aria-labelledby="route-title">
      <div class="rhead">
        <h2 id="route-title">Ton parcours</h2>
        <span>{{ doneCount }} / {{ LESSON_IDS.length }} leçons</span>
      </div>
      <ol class="units">
        <li v-for="u in units" :key="u.course.id" class="ucard" :class="u.progress.state">
          <button
            type="button"
            class="uhead"
            :aria-expanded="isOpen(u.course.id)"
            :aria-controls="`unit-${u.course.id}`"
            @click="toggle(u.course.id)"
          >
            <span class="dot" aria-hidden="true">
              <UiIcon v-if="u.progress.state === 'done'" name="check" :size="18" />
              <UiIcon v-else-if="u.progress.state === 'locked'" name="lock" :size="16" />
              <span v-else class="display">{{ u.num }}</span>
            </span>
            <span class="utext">
              <span class="utitle display">{{ u.course.title }}</span>
              <span class="umeta">
                <span class="ubar" role="progressbar" :aria-valuenow="u.progress.done" aria-valuemin="0" :aria-valuemax="u.progress.total" :aria-label="`${u.course.title} : ${u.progress.done} leçons faites sur ${u.progress.total}`">
                  <i :style="{ width: `${u.progress.done / u.progress.total * 100}%` }" />
                </span>
                <span class="ucount">{{ unitCount(u) }}</span>
              </span>
            </span>
            <UiIcon name="chevron" class="chev" :class="{ up: isOpen(u.course.id) }" />
          </button>
          <ol v-if="isOpen(u.course.id)" :id="`unit-${u.course.id}`" class="lessons">
            <li v-for="n in u.nodes" :key="n.lesson.id">
              <NuxtLink v-if="n.unlocked" :to="`/lecon/${n.lesson.id}`" class="lrow" :class="lessonState(n).cls">
                <span class="lnum display" aria-hidden="true">{{ n.num }}</span>
                <span class="ltext">
                  <span class="ltitle">{{ n.lesson.title }}</span>
                  <span class="lstate">{{ lessonState(n).text }}</span>
                </span>
                <span v-if="n.index === current" class="pill">Commencer</span>
                <span v-else-if="n.review" class="pill ghost">Revoir</span>
              </NuxtLink>
              <span v-else class="lrow locked">
                <span class="lnum display" aria-hidden="true">{{ n.num }}</span>
                <span class="ltext">
                  <span class="ltitle">{{ n.lesson.title }}</span>
                  <span class="lstate">Verrouillée</span>
                </span>
              </span>
            </li>
          </ol>
        </li>
      </ol>
    </section>

    <section class="exam" aria-labelledby="exam-title">
      <span class="eic" aria-hidden="true"><UiIcon name="cap" :size="22" /></span>
      <div class="etext">
        <h2 id="exam-title">Examen blanc</h2>
        <span class="emeta">
          {{ EXAM.questions }} questions · {{ EXAM.maxErrors }} fautes max · {{ EXAM.minutes }} min<template v-if="best"> · Meilleur {{ best.total - best.errors }}/{{ best.total }}{{ best.passed ? ' ✓' : '' }}</template><template v-if="last"> · Dernier {{ last.total - last.errors }}/{{ last.total }}</template>
        </span>
      </div>
      <NuxtLink :to="`/lecon/${EXAM_ID}`" class="pill ghost" aria-label="Passer un examen blanc">Passer</NuxtLink>
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
/* Path summary: one card per unit, only the open one lists its lessons. */
.route { margin: 28px 16px 0; }
.rhead { display: flex; align-items: baseline; justify-content: space-between; padding: 0 4px 10px; }
.rhead h2 { margin: 0; font-size: 20px; font-weight: 600; }
.rhead span { font-size: 14px; color: var(--ink-mute); }
.units { display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; list-style: none; }
.ucard { overflow: hidden; border: 2px solid var(--line); border-radius: 16px; background: var(--surface); }
.ucard.active { border-color: var(--primary-soft-line); }
.uhead {
  display: flex; align-items: center; gap: 12px; width: 100%; min-height: 64px; padding: 12px 14px;
  border: 0; background: none; color: var(--ink); text-align: left;
}
.dot { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; font-size: 15px; font-weight: 700; }
.done .dot { background: var(--ok-soft); color: var(--ok-text); }
.active .dot { background: var(--primary); color: #fff; }
.locked .dot { background: var(--line); color: var(--ink-mute); }
.utext { display: flex; flex: 1; flex-direction: column; gap: 6px; min-width: 0; }
.utitle { overflow: hidden; font-size: 16px; font-weight: 600; white-space: nowrap; text-overflow: ellipsis; }
.locked .utitle { color: var(--ink-mute); }
.umeta { display: flex; align-items: center; gap: 8px; }
.ubar { flex: 1; height: 6px; overflow: hidden; border-radius: 3px; background: var(--line); }
.ubar i { display: block; height: 100%; border-radius: 3px; background: var(--primary); }
.done .ubar i { background: var(--ok); }
.ucount { font-size: 13px; color: var(--ink-mute); white-space: nowrap; }
.chev { color: var(--ink-mute); transition: transform .2s; }
.chev.up { transform: rotate(180deg); }
.lessons { display: flex; flex-direction: column; gap: 2px; margin: 0; padding: 6px 10px 10px; border-top: 1px solid var(--line); list-style: none; }
.lrow { display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 6px 8px; border-radius: 12px; color: var(--ink); text-decoration: none; }
.lrow.current { background: var(--primary-soft); }
.lnum { width: 26px; flex-shrink: 0; font-size: 15px; font-weight: 600; text-align: center; }
.ltext { display: flex; flex: 1; flex-direction: column; gap: 2px; min-width: 0; }
.ltitle { font-size: 15px; font-weight: 500; }
.current .ltitle { font-weight: 600; }
.lstate { font-size: 13px; font-weight: 500; color: var(--ink-mute); }
.done .lstate { color: var(--ok-text); }
.review .lstate { color: var(--primary); }
.current .lstate { color: var(--primary-shadow); }
.lrow.locked .ltitle, .lrow.locked .lnum { color: var(--ink-mute); }
.pill {
  display: inline-flex; flex-shrink: 0; align-items: center; min-height: 44px; padding: 0 14px; border-radius: 12px;
  background: var(--primary); color: #fff; font-size: 14px; font-weight: 600; text-decoration: none;
}
.pill.ghost { padding: 0 12px; border: 2px solid var(--line); background: var(--surface); color: var(--primary); }
.exam { display: flex; align-items: center; gap: 14px; margin: 12px 16px 34px; padding: 14px 16px; border: 2px solid var(--line); border-radius: 18px; background: var(--surface); }
.eic { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: var(--primary-soft); color: var(--primary); }
.etext { display: flex; flex: 1; flex-direction: column; gap: 2px; min-width: 0; }
.exam h2 { margin: 0; font-size: 16px; font-weight: 600; }
.emeta { font-size: 13px; line-height: 1.35; color: var(--ink-mute); }
</style>
