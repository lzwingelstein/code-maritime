<script setup lang="ts">
import { choiceLabel, explain, exerciseGenerator, regenerator, type MarkExercise } from '~/courses/balisage/exercises'
import { findLesson } from '~/courses/balisage/lessons'
import { MARKS } from '~/courses/balisage/marks'
import { buildLesson, lessonXp } from '~/engine/builder'
import { reviewWeight } from '~/engine/mastery'
import { DAILY_GOAL, introduce, recordLesson, todayXp } from '~/engine/progress'
import { pick, seeded } from '~/engine/random'
import { advance, check, currentStep, progress as share, select, startSession, type Session } from '~/engine/session'
import { currentStreak, dayKey } from '~/engine/streak'

const route = useRoute()
const lesson = findLesson(String(route.params.id))
const { progress, save } = useProgress()
const sound = useSound()

const rng = seeded(Date.now())
const generate = lesson ? exerciseGenerator(lesson) : null
const regenerate = lesson ? regenerator(lesson, rng) : null

function newSession(): Session<MarkExercise> {
  const now = Date.now()
  const steps = lesson && generate
    ? buildLesson(lesson.plan, {
        rng,
        generate,
        isKnown: id => id in progress.value.mastery,
        firstKind: lesson.topOnly ? 'identify' : 'find',
        weight: id => reviewWeight(progress.value.mastery[id], now),
      })
    : []
  return reactive(startSession(steps)) as Session<MarkExercise>
}

const s = shallowRef(newSession())
const startedAt = ref(Date.now())
const step = computed(() => currentStep(s.value))
const exercise = computed(() => (step.value?.type === 'question' ? step.value.exercise : null))
const verdictTitle = ref('')
const result = ref<{ xp: number, seconds: number, accuracy: number } | null>(null)

const PRAISE = ['Bien joué !', 'Excellent !', 'Parfait !', 'Bravo, moussaillon !', 'Cap tenu !']

function choose(id: string) {
  if (s.value.phase !== 'step') return
  select(s.value, id)
  sound.tap()
}

function onMain() {
  const session = s.value
  if (session.phase === 'step' && exercise.value) {
    const v = check(session, regenerate!)
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
  const xp = won ? lessonXp(session) : 0
  save(recordLesson(progress.value, { lessonId: lesson!.id, won, xp, answers: session.answers }, Date.now()))
  result.value = {
    xp,
    seconds: Math.round((Date.now() - startedAt.value) / 1000),
    accuracy: Math.round(session.firstTry / Math.max(1, session.questions) * 100),
  }
  if (won) sound.win()
}

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

const wrongDetail = computed(() => {
  const v = s.value.verdict
  const e = exercise.value
  if (!v || !e) return ''
  if (v.correct) return e.kind === 'light' ? `${MARKS[e.cardId].light.description}.` : ''
  const answer = e.kind === 'truefalse' ? `C’était « ${choiceLabel(e, v.expected)} ».` : `Bonne réponse : ${choiceLabel(e, v.expected)}.`
  return `${answer} ${explain(e)}`
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
    <div v-if="!lesson" class="end">
      <p>Cette leçon n’existe pas.</p>
      <NuxtLink to="/" class="btn">Retour au parcours</NuxtLink>
    </div>

    <!-- End of lesson -->
    <div v-else-if="result" class="end">
      <template v-if="s.phase === 'won'">
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
        <span class="hearts" :aria-label="`${s.hearts} cœurs restants`">❤️ {{ s.hearts }}</span>
      </header>

      <main class="body" :class="{ shake: s.verdict && !s.verdict.correct }">
        <!-- Tip -->
        <div v-if="step?.type === 'tip' && lesson.tip" class="card tip">
          <div class="big" aria-hidden="true">{{ lesson.tip.emoji }}</div>
          <h2>{{ lesson.tip.title }}</h2>
          <p><RichText :text="lesson.tip.text" /></p>
        </div>

        <!-- New mark -->
        <div v-else-if="step?.type === 'intro'" class="card">
          <span class="new">Nouvelle marque</span>
          <h2>{{ MARKS[step.cardId as keyof typeof MARKS].name }}</h2>
          <BuoyMark :mark-id="step.cardId as keyof typeof MARKS" class="intro-buoy" />
          <p><RichText :text="MARKS[step.cardId as keyof typeof MARKS].intro" /></p>
          <p class="lightinfo">🌙 {{ MARKS[step.cardId as keyof typeof MARKS].light.description }}</p>
        </div>

        <!-- Question -->
        <template v-else-if="exercise">
          <p class="heading">{{ exercise.heading }}</p>
          <h2 class="prompt">{{ exercise.prompt }}</h2>
          <div v-if="exercise.visual" class="visual">
            <NightLight v-if="exercise.visual.type === 'light'" :key="s.index" :mark-id="exercise.visual.markId" />
            <BuoyMark v-else :mark-id="exercise.visual.markId" :top-only="exercise.visual.topOnly" :class="exercise.visual.topOnly ? 'v-top' : 'v-full'" />
          </div>
          <div :class="['choices', exercise.layout, { tops: exercise.topOnly }]">
            <button
              v-for="(c, i) in exercise.choices"
              :key="c.id"
              type="button"
              class="choice"
              :class="choiceState(c.id)"
              :aria-pressed="s.selected === c.id"
              :aria-label="c.markId ? `Marque ${LETTERS[i]}` : undefined"
              :disabled="!!s.verdict"
              @click="choose(c.id)"
            >
              <BuoyMark v-if="c.markId" :mark-id="c.markId" :top-only="exercise.topOnly" />
              <span v-else>{{ c.label }}</span>
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
            <p v-if="wrongDetail">{{ wrongDetail }}</p>
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

.body { flex: 1; display: flex; flex-direction: column; padding: 8px 18px 190px; }
.heading { margin: 6px 0 4px; font-size: 13px; color: var(--accent); text-transform: uppercase; letter-spacing: .06em; }
.prompt { margin: 0 0 14px; font-size: 21px; font-weight: 900; line-height: 1.25; }
.visual { display: flex; justify-content: center; margin: 4px 0 16px; }
.v-full { height: 200px; }
.v-top { height: 130px; }

.choices { display: flex; flex-direction: column; gap: 10px; }
.choices.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.choices.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.choice {
  position: relative; min-height: 56px; padding: 14px; border: 2px solid var(--line); border-radius: 14px;
  background: var(--surface); box-shadow: 0 4px 0 var(--line); color: var(--ink); font-size: 17px; font-weight: 800; text-align: left;
}
.pair .choice { text-align: center; }
.grid .choice { display: flex; justify-content: center; padding: 10px; }
.grid .choice :deep(svg) { height: 130px; }
.grid.tops .choice :deep(svg) { height: 84px; }
.choice.sel { border-color: var(--primary-soft-line); background: var(--primary-soft); box-shadow: 0 4px 0 var(--primary-soft-line); color: var(--primary); }
.choice.good { border-color: var(--ok-fill); background: var(--ok-soft); box-shadow: 0 4px 0 var(--ok-fill); color: var(--ok-text); }
.choice.bad { border-color: var(--ko-fill); background: var(--ko-soft); box-shadow: 0 4px 0 var(--ko-fill); color: var(--ko-text); }
.choice:disabled { cursor: default; }
.mark { position: absolute; top: 6px; right: 10px; font-size: 18px; }

.card { padding: 18px; border: 2px solid var(--line); border-radius: 18px; text-align: center; animation: pop .25s; }
.card h2 { margin: 10px 0 6px; font-size: 23px; font-weight: 900; }
.card p { margin: 8px 0 0; font-size: 16px; font-weight: 600; line-height: 1.45; }
.card.tip { background: var(--tip-soft); border-color: var(--tip-line); }
.card .big { font-size: 44px; }
.new { display: inline-block; padding: 2px 10px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }
.intro-buoy { display: block; height: 190px; margin: 8px auto 0; }
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
