<script setup lang="ts">
import { choiceName, COURSES, EXAM_COURSES, findLesson, regenerator } from '~/courses'
import { buildExam, EXAM, EXAM_ID } from '~/courses/exam'
import { buildPractice, PRACTICE, PRACTICE_ID, practiceGenerator } from '~/courses/practice'
import type { CourseExercise } from '~/courses/types'
import { buildLesson, lessonXp } from '~/engine/builder'
import { reviewWeight } from '~/engine/mastery'
import { DAILY_GOAL, introduce, recordExam, recordLesson, todayXp } from '~/engine/progress'
import { pick, seeded } from '~/engine/random'
import { advance, check, currentStep, progress as share, select, startSession, type Session } from '~/engine/session'
import { currentStreak, dayKey } from '~/engine/streak'

definePageMeta({ layout: false })
const route = useRoute()
const isExam = String(route.params.id) === EXAM_ID
const isPractice = String(route.params.id) === PRACTICE_ID
const found = isExam || isPractice ? undefined : findLesson(String(route.params.id))
// A practice series may be limited to one unit: /lecon/entrainement?unite=<course id>.
const practiceUnit = isPractice ? COURSES.find(c => c.id === route.query.unite) : undefined
const practiceCourses = practiceUnit ? [practiceUnit] : COURSES
const lesson = found?.lesson
const course = found?.course
const { progress, save } = useProgress()
const sound = useSound()

const rng = seeded(Date.now())
const generate = found ? found.course.generator(found.lesson) : null
// The exam never brings a question back, so it never regenerates one.
const regenerate = generate
  ? regenerator(generate, rng)
  : isPractice ? regenerator(practiceGenerator(practiceCourses), rng) : (e: CourseExercise) => e

function newSession(): Session<CourseExercise> {
  const now = Date.now()
  if (isPractice) return reactive(startSession(practiceUnit
    ? buildPractice(practiceCourses, progress.value.mastery, now, rng, PRACTICE.questions, PRACTICE.unitMinCards)
    : buildPractice(COURSES, progress.value.mastery, now, rng))) as Session<CourseExercise>
  if (isExam) return reactive(startSession(buildExam(EXAM_COURSES, rng), { hearts: null, retryWrong: false })) as Session<CourseExercise>
  const steps = lesson && generate
    ? buildLesson(lesson.plan, {
        rng,
        generate,
        isKnown: id => id in progress.value.mastery,
        firstKind: lesson.firstKind,
        weight: id => reviewWeight(progress.value.mastery[id], now),
      })
    : []
  return reactive(startSession(steps)) as Session<CourseExercise>
}

const s = shallowRef(newSession())
const startedAt = ref(Date.now())
const step = computed(() => currentStep(s.value))
const exercise = computed(() => (step.value?.type === 'question' ? step.value.exercise : null))
const card = computed(() => (step.value?.type === 'intro' && course ? course.card(step.value.cardId) : null))
const tip = lesson?.tip
const verdictTitle = ref('')
const result = ref<{ xp: number, seconds: number, accuracy: number, passed?: boolean } | null>(null)

const PRAISE = ['Bien joué !', 'Excellent !', 'Parfait !', 'Bravo, moussaillon !', 'Cap tenu !']

function choose(id: string) {
  if (s.value.phase !== 'step') return
  select(s.value, id)
  sound.tap()
}

function onMain() {
  const session = s.value
  if (session.phase === 'step' && exercise.value) {
    const v = check(session, regenerate)
    if (v.correct) {
      sound.right()
      verdictTitle.value = session.combo >= 3 && session.combo % 2 === 1 ? `🔥 ${session.combo} bonnes réponses d’affilée !` : pick(PRAISE, rng)
    }
    else {
      sound.wrong()
      verdictTitle.value = 'Pas tout à fait…'
    }
    return
  }
  if (step.value?.type === 'intro') save(introduce(progress.value, step.value.cardId, Date.now()))
  advance(session)
  if (session.phase === 'won' || session.phase === 'lost') finish(session.phase === 'won')
  window.scrollTo(0, 0)
}

function finish(won: boolean) {
  const session = s.value
  const now = Date.now()
  const seconds = Math.round((now - startedAt.value) / 1000)
  if (isExam) {
    const passed = session.errors <= EXAM.maxErrors
    const xp = passed ? 20 : 10
    const after = recordLesson(progress.value, { lessonId: EXAM_ID, won: true, xp, answers: session.answers }, now)
    save(recordExam(after, { errors: session.errors, total: session.questions, passed }, now))
    result.value = { xp, seconds, accuracy: Math.round((session.questions - session.errors) / session.questions * 100), passed }
    if (passed) sound.win()
    return
  }
  const xp = won ? lessonXp(session) : 0
  save(recordLesson(progress.value, { lessonId: isPractice ? PRACTICE_ID : lesson!.id, won, xp, answers: session.answers }, now))
  result.value = { xp, seconds, accuracy: Math.round(session.firstTry / Math.max(1, session.questions) * 100) }
  if (won) sound.win()
}

// Exam clock, shown in the header.
const elapsed = ref(0)
let clock: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  if (isExam) clock = setInterval(() => { elapsed.value = Math.floor((Date.now() - startedAt.value) / 1000) }, 1000)
})
onBeforeUnmount(() => clearInterval(clock))
const mmss = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
const answered = computed(() => s.value.answers.length)
/** Missed questions still waiting at the end of the series. */
const pending = computed(() => s.value.steps.slice(s.value.index + (s.value.verdict?.correct ? 1 : 0)).filter(st => st.type === 'question' && st.isRetry).length)

function retry() {
  s.value = newSession()
  startedAt.value = Date.now()
  result.value = null
}

function choiceState(id: string): 'sel' | 'good' | 'bad' | '' {
  const v = s.value.verdict
  if (v) return id === v.expected ? 'good' : id === v.chosen ? 'bad' : ''
  return s.value.selected === id ? 'sel' : ''
}

const detail = computed(() => {
  const v = s.value.verdict
  const e = exercise.value
  if (!v || !e) return ''
  if (v.correct) return e.afterRight ?? ''
  const answer = e.kind === 'truefalse' ? `C’était « ${choiceName(e, v.expected)} ».` : `Bonne réponse : ${choiceName(e, v.expected)}.`
  return `${answer} ${e.explanation}`
})

const today = dayKey(new Date())
const LETTERS = ['A', 'B', 'C', 'D']
const confetti = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 41) % 100,
  delay: ((i * 7) % 10) / 25,
  duration: 1.6 + ((i * 13) % 10) / 6,
  colour: ['var(--ok-fill)', 'var(--gold)', 'var(--primary)', 'var(--ko-fill)', 'var(--accent)'][i % 5],
}))
</script>

<template>
  <div class="shell">
    <!-- Unknown lesson -->
    <div v-if="isPractice && !s.steps.length" class="end">
      <p v-if="practiceUnit">Fais d’abord une leçon de l’unité « {{ practiceUnit.title }} » pour t’entraîner dessus.</p>
      <p v-else>Termine d’abord quelques leçons : l’entraînement mélange les thèmes que tu as déjà vus.</p>
      <NuxtLink to="/" class="btn">Retour au parcours</NuxtLink>
    </div>

    <div v-else-if="!lesson && !isExam && !isPractice" class="end">
      <p>Cette leçon n’existe pas.</p>
      <NuxtLink to="/" class="btn">Retour au parcours</NuxtLink>
    </div>

    <!-- End of lesson -->
    <div v-else-if="result" class="end">
      <template v-if="isExam">
        <template v-if="result.passed">
          <i v-for="(c, i) in confetti" :key="i" class="conf" :style="{ left: c.left + 'vw', background: c.colour, animationDelay: c.delay + 's', animationDuration: c.duration + 's' }" />
        </template>
        <div class="big" aria-hidden="true">{{ result.passed ? '🎓' : '📚' }}</div>
        <h1 :class="{ fail: !result.passed }">{{ result.passed ? 'Reçu à l’examen blanc !' : 'Pas encore…' }}</h1>
        <div class="tiles">
          <div class="tile ok"><b>Bonnes réponses</b><span>✓ {{ s.questions - s.errors }} / {{ s.questions }}</span></div>
          <div class="tile gold"><b>Erreurs</b><span>✗ {{ s.errors }} / {{ EXAM.maxErrors }} max</span></div>
          <div class="tile blue"><b>Temps</b><span>⏱ {{ mmss(result.seconds) }}</span></div>
        </div>
        <p class="sub">
          {{ result.passed ? 'Comme à l’examen : 5 erreurs au plus.' : `Il faut 5 erreurs au plus : continue les révisions, les questions ratées reviendront plus souvent.` }}
          · ⚡ {{ result.xp }} XP
        </p>
        <div class="endbtns">
          <button type="button" class="btn" :class="{ ok: result.passed }" @click="retry">Nouvel examen</button>
          <NuxtLink to="/" class="btn ghost">Retour au parcours</NuxtLink>
        </div>
      </template>
      <template v-else-if="s.phase === 'won'">
        <i v-for="(c, i) in confetti" :key="i" class="conf" :style="{ left: c.left + 'vw', background: c.colour, animationDelay: c.delay + 's', animationDuration: c.duration + 's' }" />
        <div class="big" aria-hidden="true">🏆</div>
        <h1>{{ isPractice ? 'Entraînement terminé !' : 'Leçon terminée !' }}</h1>
        <div class="tiles">
          <div class="tile gold"><b>XP gagnés</b><span>⚡ {{ result.xp }}</span></div>
          <div class="tile ok"><b>Précision</b><span>🎯 {{ result.accuracy }} %</span></div>
          <div class="tile blue"><b>Temps</b><span>⏱ {{ Math.floor(result.seconds / 60) }}:{{ String(result.seconds % 60).padStart(2, '0') }}</span></div>
        </div>
        <p class="sub">
          🔥 Série : {{ currentStreak(progress.streak, today) }} jour(s) · objectif du jour
          {{ Math.min(todayXp(progress, today), DAILY_GOAL) }} / {{ DAILY_GOAL }} XP
        </p>
        <NuxtLink to="/" class="btn ok">Continuer</NuxtLink>
      </template>
    </div>

    <!-- Lesson -->
    <template v-else>
      <header class="lhead">
        <NuxtLink to="/" class="close" aria-label="Quitter la leçon">✕</NuxtLink>
        <div class="bar" role="progressbar" :aria-valuenow="Math.round(share(s) * 100)" aria-valuemax="100">
          <i :style="{ width: share(s) * 100 + '%', background: 'var(--ok-fill)' }" />
        </div>
        <span v-if="isExam" class="hearts" :aria-label="`${s.errors} erreurs sur ${EXAM.maxErrors} permises`">✗ {{ s.errors }}/{{ EXAM.maxErrors }}</span>
        <span v-else class="hearts" :aria-label="pending ? `${pending} question${pending > 1 ? 's' : ''} ratée${pending > 1 ? 's' : ''} à refaire` : undefined">{{ pending ? `↻ ${pending}` : '' }}</span>
      </header>
      <p v-if="isExam" class="examline">
        Question {{ Math.min(answered + (s.verdict ? 0 : 1), s.questions) }} / {{ s.questions }} · ⏱ {{ mmss(elapsed) }} / {{ EXAM.minutes }}:00
      </p>

      <main class="body" :class="{ shake: s.verdict && !s.verdict.correct }">
        <!-- Tip -->
        <TipCard v-if="step?.type === 'tip' && tip" :tip="tip" />

        <!-- New card -->
        <InfoCard v-else-if="card" :card="card" />

        <!-- Question -->
        <template v-else-if="exercise">
          <p v-if="step?.type === 'question' && step.isRetry" class="retry">↻ Tu l’avais ratée : réessaie</p>
          <p class="heading">{{ exercise.heading }}</p>
          <h2 class="prompt"><RichText :text="exercise.prompt" /></h2>
          <div v-if="exercise.visual" class="visual" :class="`v-${exercise.visual.type}${exercise.visual.type === 'mark' && exercise.visual.topOnly ? '-top' : ''}`">
            <CardVisual :key="s.index" :visual="exercise.visual" />
          </div>
          <div :class="['choices', exercise.layout, exercise.choices[0]?.visual ? `pics-${exercise.choices[0].visual.type}` : '', { tops: exercise.choices[0]?.visual?.type === 'mark' && exercise.choices[0].visual.topOnly }]">
            <button
              v-for="(c, i) in exercise.choices"
              :key="c.id"
              type="button"
              class="choice"
              :class="choiceState(c.id)"
              :aria-pressed="s.selected === c.id"
              :aria-label="c.visual ? `Choix ${LETTERS[i]}` : undefined"
              :disabled="!!s.verdict"
              @click="choose(c.id)"
            >
              <CardVisual v-if="c.visual" :visual="c.visual" />
              <span v-else>{{ c.name }}</span>
              <span v-if="choiceState(c.id) === 'good'" class="mark" aria-hidden="true">✓</span>
              <span v-else-if="choiceState(c.id) === 'bad'" class="mark" aria-hidden="true">✗</span>
            </button>
          </div>
        </template>
      </main>

      <footer class="sheet" :class="s.verdict ? (s.verdict.correct ? 'ok' : 'ko') : ''" aria-live="polite">
        <div>
          <template v-if="s.verdict">
            <h3>{{ s.verdict.correct ? '✓' : '✗' }} {{ verdictTitle }}</h3>
            <p v-if="detail"><RichText :text="detail" /></p>
          </template>
          <button
            type="button"
            class="btn"
            :class="s.verdict ? (s.verdict.correct ? 'ok' : 'ko') : ''"
            :disabled="!!exercise && !s.verdict && s.selected === null"
            @click="onMain"
          >
            {{ exercise && !s.verdict ? 'Vérifier' : 'Continuer' }}
          </button>
        </div>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.lhead { display: flex; align-items: center; gap: 12px; padding: 12px 16px 6px; }
.close { display: grid; place-items: center; width: 44px; height: 44px; font-size: 24px; color: var(--ink-mute); text-decoration: none; }
.lhead .bar { flex: 1; height: 16px; }
.hearts { min-width: 48px; text-align: right; font-size: 18px; color: var(--ko-text); }
.examline { margin: 0; padding: 0 18px; font-size: 14px; color: var(--ink-mute); }

.body { flex: 1; display: flex; flex-direction: column; padding: 8px 18px 190px; }
.retry { display: inline-block; margin: 8px 0 0; padding: 3px 10px; border: 2px solid var(--primary); border-radius: 99px; font-size: 13px; font-weight: 800; color: var(--primary); }
.heading { margin: 6px 0 4px; font-size: 13px; color: var(--accent); text-transform: uppercase; letter-spacing: .06em; }
.prompt { margin: 0 0 14px; font-size: 21px; font-weight: 900; line-height: 1.25; }
.visual { display: flex; justify-content: center; margin: 4px 0 16px; }
.v-mark :deep(svg) { height: 200px; }
.v-mark-top :deep(svg) { height: 130px; }
.visual.v-ship, .visual.v-light { display: block; }

.choices { display: flex; flex-direction: column; gap: 10px; }
.choices.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.choices.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.choice {
  position: relative; min-height: 56px; padding: 14px; border: 2px solid var(--line); border-radius: 14px;
  background: var(--surface); box-shadow: 0 4px 0 var(--line); color: var(--ink); font-size: 17px; font-weight: 800; text-align: left;
}
.pair .choice { text-align: center; }
.grid .choice { display: flex; justify-content: center; padding: 10px; }
.grid .choice :deep(svg.buoy) { height: 130px; }
.grid.tops .choice :deep(svg.buoy) { height: 84px; }
.grid.pics-ship .choice { padding: 6px; }
.choice.sel { border-color: var(--primary-soft-line); background: var(--primary-soft); box-shadow: 0 4px 0 var(--primary-soft-line); color: var(--primary); }
.choice.good { border-color: var(--ok-fill); background: var(--ok-soft); box-shadow: 0 4px 0 var(--ok-fill); color: var(--ok-text); }
.choice.bad { border-color: var(--ko-fill); background: var(--ko-soft); box-shadow: 0 4px 0 var(--ko-fill); color: var(--ko-text); }
.choice:disabled { cursor: default; }
.mark { position: absolute; top: 6px; right: 10px; font-size: 18px; }

.sheet { position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; display: flex; justify-content: center; border-top: 2px solid var(--line); background: var(--surface); }
.sheet > div { width: 100%; max-width: 480px; padding: 16px 18px calc(20px + env(safe-area-inset-bottom)); }
.sheet.ok { background: var(--ok-soft); border-color: transparent; }
.sheet.ko { background: var(--ko-soft); border-color: transparent; }
.sheet h3 { margin: 0 0 4px; font-size: 21px; font-weight: 900; }
.sheet p { margin: 0 0 12px; font-size: 15px; line-height: 1.4; }
.sheet.ok h3, .sheet.ok p { color: var(--ok-text); }
.sheet.ko h3, .sheet.ko p { color: var(--ko-text); }

.shake { animation: shake .35s; }
@keyframes shake { 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
@keyframes pop { 0% { transform: scale(.96); } 60% { transform: scale(1.03); } 100% { transform: scale(1); } }

.end { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; padding: 30px 22px; text-align: center; }
.end .big { font-size: 72px; }
.end h1 { margin: 12px 0 22px; font-size: 28px; font-weight: 900; color: var(--gold-text); }
.end h1.fail { color: var(--ko); }
.end .btn { display: block; text-decoration: none; text-align: center; line-height: 28px; }
.sub { margin: 0 0 26px; color: var(--ink-mute); }
.tiles { display: flex; gap: 12px; width: 100%; margin-bottom: 24px; }
.tile { flex: 1; overflow: hidden; border: 2px solid; border-radius: 16px; }
.tile b { display: block; padding: 5px; color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
.tile span { display: block; padding: 12px 4px; font-size: 20px; font-weight: 900; }
.tile.gold { border-color: var(--gold); } .tile.gold b { background: var(--gold-text); } .tile.gold span { color: var(--gold-text); }
.tile.ok { border-color: var(--ok); } .tile.ok b { background: var(--ok); } .tile.ok span { color: var(--ok); }
.tile.blue { border-color: var(--primary); } .tile.blue b { background: var(--primary); } .tile.blue span { color: var(--primary); }
.endbtns { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.conf { position: fixed; top: -14px; z-index: 30; width: 9px; height: 14px; animation: fall linear forwards; }
@keyframes fall { to { transform: translateY(110vh) rotate(720deg); } }
</style>
