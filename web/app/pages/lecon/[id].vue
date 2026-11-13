<script setup lang="ts">
import { choiceName, COURSES, findLesson, regenerator } from '~/courses'
import { buildExam, EXAM, EXAM_ID } from '~/courses/exam'
import type { CourseExercise } from '~/courses/types'
import { buildLesson, lessonXp } from '~/engine/builder'
import { reviewWeight } from '~/engine/mastery'
import { DAILY_GOAL, introduce, recordExam, recordLesson, todayXp } from '~/engine/progress'
import { pick, seeded } from '~/engine/random'
import { advance, check, currentStep, progress as share, select, startSession, type Session } from '~/engine/session'
import { currentStreak, dayKey } from '~/engine/streak'

const route = useRoute()
const isExam = String(route.params.id) === EXAM_ID
const found = isExam ? undefined : findLesson(String(route.params.id))
const lesson = found?.lesson
const course = found?.course
const { progress, save } = useProgress()
const sound = useSound()

const rng = seeded(Date.now())
const generate = found ? found.course.generator(found.lesson) : null
// The exam never brings a question back, so it never regenerates one.
const regenerate = generate ? regenerator(generate, rng) : (e: CourseExercise) => e

function newSession(): Session<CourseExercise> {
  const now = Date.now()
  if (isExam) return reactive(startSession(buildExam(COURSES, rng), { hearts: null, retryWrong: false })) as Session<CourseExercise>
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
  save(recordLesson(progress.value, { lessonId: lesson!.id, won, xp, answers: session.answers }, now))
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
    <div v-if="!lesson && !isExam" class="end">
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
        <h1>Leçon terminée !</h1>
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
      <template v-else>
        <div class="big" aria-hidden="true">🌊</div>
        <h1 class="fail">Plus de cœurs…</h1>
        <p class="sub">Tu as fait 5 erreurs. Les marques ratées reviendront plus souvent : retente la leçon !</p>
        <div class="endbtns">
          <button type="button" class="btn" @click="retry">Réessayer</button>
          <NuxtLink to="/" class="btn ghost">Retour au parcours</NuxtLink>
        </div>
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
        <span v-else class="hearts" :aria-label="`${s.hearts} cœurs restants`">❤️ {{ s.hearts }}</span>
      </header>
      <p v-if="isExam" class="examline">
        Question {{ Math.min(answered + (s.verdict ? 0 : 1), s.questions) }} / {{ s.questions }} · ⏱ {{ mmss(elapsed) }} / {{ EXAM.minutes }}:00
      </p>

      <main class="body" :class="{ shake: s.verdict && !s.verdict.correct }">
        <!-- Tip -->
        <div v-if="step?.type === 'tip' && tip" class="card tip">
          <div class="big" aria-hidden="true">{{ tip.emoji }}</div>
          <h2>{{ tip.title }}</h2>
          <p><RichText :text="tip.text" /></p>
          <ul v-if="tip.rows" class="tiprows">
            <li v-for="(r, i) in tip.rows" :key="i">
              <div class="tippic"><CardVisual :visual="r.visual" /></div>
              <span><RichText :text="r.label" /></span>
            </li>
          </ul>
        </div>

        <!-- New card -->
        <div v-else-if="card" class="card">
          <span class="new">{{ card.badge }}</span>
          <h2>{{ card.name }}</h2>
          <div class="intro-visual">
            <CardVisual :visual="card.visual" />
          </div>
          <ul class="points">
            <li v-for="(line, i) in sentences(card.intro)" :key="i"><RichText :text="line" /></li>
          </ul>
          <p v-if="card.note" class="lightinfo">{{ card.note }}</p>
        </div>

        <!-- Question -->
        <template v-else-if="exercise">
          <p class="heading">{{ exercise.heading }}</p>
          <h2 class="prompt">{{ exercise.prompt }}</h2>
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
            <p v-if="detail">{{ detail }}</p>
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
.hearts { min-width: 48px; text-align: right; font-size: 18px; color: var(--ko); }
.examline { margin: 0; padding: 0 18px; font-size: 14px; color: var(--ink-mute); }

.body { flex: 1; display: flex; flex-direction: column; padding: 8px 18px 190px; }
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

.card { padding: 18px; border: 2px solid var(--line); border-radius: 18px; text-align: center; animation: pop .25s; }
.card h2 { margin: 10px 0 6px; font-size: 23px; font-weight: 900; }
.card p { margin: 8px 0 0; font-size: 16px; font-weight: 600; line-height: 1.45; }
.card.tip { background: var(--tip-soft); border-color: var(--tip-line); }
.tiprows { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin: 14px 0 0; padding: 0; list-style: none; }
.tiprows li { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px; border-radius: 14px; background: var(--surface); font-size: 14px; line-height: 1.3; }
.tippic { display: flex; align-items: center; justify-content: center; width: 100%; height: 110px; overflow: hidden; }
.tippic :deep(svg) { max-height: 110px; width: auto; max-width: 100%; }
/* Top-down scenes need the full width to stay readable. */
.tiprows li:has(.encounter) { grid-column: 1 / -1; }
.tippic:has(.encounter) { height: 230px; }
.tippic :deep(svg.encounter) { max-height: 230px; }
.tippic :deep(.horn) { padding: 8px 4px; }
.tippic :deep(.horn .legend), .tippic :deep(.horn .replay) { display: none; }
.points { margin: 12px 0 0; padding: 0; list-style: none; text-align: left; }
.points li { position: relative; padding: 6px 0 6px 22px; font-size: 16px; font-weight: 600; line-height: 1.4; border-top: 1px solid var(--line); }
.points li:first-child { border-top: 0; }
.points li::before { content: "•"; position: absolute; left: 6px; color: var(--primary); font-weight: 900; }
.card .big { font-size: 44px; }
.new { display: inline-block; padding: 2px 10px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }
.intro-visual { display: flex; justify-content: center; margin: 8px 0 0; }
.intro-visual :deep(svg.buoy) { height: 190px; }
.lightinfo { color: var(--ink-mute); font-size: 14px !important; font-weight: 700 !important; }

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
