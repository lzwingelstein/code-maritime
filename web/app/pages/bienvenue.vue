<script setup lang="ts">
/** First launch (and « Modifier » from the stats): when do you sit the exam? Optional, one screen, no account. */
import { examPace, examTarget, type ExamPlan } from '~/engine/readiness'
import { dayKey } from '~/engine/streak'

definePageMeta({ layout: false })
const route = useRoute()
const back = route.query.retour === 'stats' ? '/stats' : '/'
const { progress, save } = useProgress()
const ready = useReadiness()
const today = dayKey(new Date())

const choice = ref<ExamPlan['choice']>(progress.value.examPlan?.choice ?? 'date')
const day = ref(progress.value.examPlan?.day ?? '')
const plan = computed<ExamPlan>(() => (choice.value === 'date' ? { choice: 'date', day: day.value } : { choice: choice.value }))
const target = computed(() => examTarget(plan.value, today))

const OPTIONS = [
  { id: 'date' as const, label: 'J’ai une date' },
  { id: 'month' as const, label: 'Dans le mois' },
  { id: 'unknown' as const, label: 'Je ne sais pas encore' },
]

const lessons = (n: number) => `${n} leçon${n > 1 ? 's' : ''}`
const hint = computed(() => {
  if (!target.value) {
    return choice.value === 'date'
      ? 'Choisis le jour de ton examen.'
      : 'Révise à ton rythme : la jauge te dira quand tu es prêt.'
  }
  const p = examPace({ lessonsLeft: ready.value.lessonsLeft, today, target: target.value })
  if (p.daysUntil < 0) return 'Cette date est passée : choisis le jour de ton examen.'
  if (!p.perDay) return 'Le parcours est fini : entraîne-toi et passe des examens blancs.'
  if (p.tight) return `C’est court : environ ${lessons(p.perDay)} par jour, puis entraîne-toi sur tes points faibles.`
  return `Environ ${lessons(p.perDay)} par jour, puis 10 jours de révisions avant l’examen.`
})
const canSave = computed(() => choice.value !== 'date' || (!!target.value && target.value >= today))

function done(p: ExamPlan) {
  save({ ...progress.value, examPlan: p })
  navigateTo(back)
}
</script>

<template>
  <div class="shell">
    <main class="body">
      <div class="top">
        <span class="course display"><UiIcon name="boat" :size="22" /> Permis côtier</span>
        <button type="button" class="skip" @click="done({ choice: 'unknown' })">Passer</button>
      </div>

      <h1>Quand passes-tu l’examen ?</h1>
      <p class="lead">On adapte le rythme des leçons. Facultatif, et modifiable plus tard dans les stats.</p>

      <fieldset class="options">
        <legend class="sr">Date de l’examen</legend>
        <label v-for="o in OPTIONS" :key="o.id" class="opt" :class="{ on: choice === o.id }">
          <input v-model="choice" type="radio" name="when" :value="o.id">
          <span class="olabel">{{ o.label }}</span>
          <span class="dot" aria-hidden="true" />
        </label>
      </fieldset>

      <label v-if="choice === 'date'" class="date">
        <span>Jour de l’examen</span>
        <input v-model="day" type="date" :min="today">
      </label>

      <p class="hint" aria-live="polite"><UiIcon name="clock" /> {{ hint }}</p>

      <button type="button" class="btn go" :disabled="!canSave" @click="done(plan)">{{ back === '/stats' ? 'Enregistrer' : 'Commencer' }}</button>
    </main>
  </div>
</template>

<style scoped>
.body { display: flex; flex-direction: column; gap: 18px; min-height: 100dvh; box-sizing: border-box; padding: 16px 20px calc(28px + env(safe-area-inset-bottom)); }
.top { display: flex; align-items: center; justify-content: space-between; min-height: 48px; }
.course { color: var(--primary); font-size: 17px; font-weight: 700; }
.skip { min-height: 44px; padding: 0 4px; border: 0; background: none; color: var(--primary); font-size: 15px; font-weight: 600; }
h1 { margin: 12px 0 0; font-size: 28px; font-weight: 700; line-height: 1.15; }
.lead { margin: 0; font-size: 15px; line-height: 1.5; color: var(--ink-mute); }
.options { display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; border: 0; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.opt {
  position: relative; display: flex; align-items: center; gap: 12px; min-height: 60px; padding: 0 18px;
  border: 2px solid var(--line); border-radius: 16px; background: var(--surface); cursor: pointer;
}
.opt.on { border-color: var(--primary); }
.opt:has(input:focus-visible) { outline: 3px solid var(--primary); outline-offset: 3px; }
.opt input { position: absolute; opacity: 0; pointer-events: none; }
.olabel { flex: 1; font-size: 16px; font-weight: 600; }
.dot { width: 22px; height: 22px; flex-shrink: 0; box-sizing: border-box; border: 2px solid var(--ink-mute); border-radius: 50%; background: var(--surface); }
.opt.on .dot { border: 7px solid var(--primary); }
.date { display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 600; color: var(--ink-mute); }
.date input {
  min-height: 52px; padding: 0 14px; border: 2px solid var(--line); border-radius: 14px; background: var(--surface);
  color: var(--ink); font: inherit; font-size: 16px;
}
.hint { display: flex; gap: 10px; align-items: flex-start; margin: 0; padding: 14px 16px; border-radius: 16px; background: var(--primary-soft); color: var(--primary-shadow); font-size: 15px; line-height: 1.4; }
.go { margin-top: auto; }
</style>
