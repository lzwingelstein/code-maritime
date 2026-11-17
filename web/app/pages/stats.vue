<script setup lang="ts">
import { COURSES } from '~/courses'
import { PRACTICE_ID } from '~/courses/practice'
import { currentStreak, dayKey } from '~/engine/streak'
import { accuracy, activity, masteryBreakdown, mostMissed, totals } from '~/engine/stats'

const { progress } = useProgress()
const now = Date.now()
const today = dayKey(new Date(now))

const all = computed(() => totals(progress.value))
const acc = computed(() => accuracy(progress.value))
const streak = computed(() => currentStreak(progress.value.streak, today))
const lessonsDone = computed(() => COURSES.flatMap(c => c.lessons).filter(l => progress.value.completions[l.id]).length)
const lessonsTotal = COURSES.reduce((n, c) => n + c.lessons.length, 0)

const days = computed(() => activity(progress.value, today, 14))
const peak = computed(() => Math.max(1, ...days.value.map(d => d.right + d.wrong)))
const WEEKDAY = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
const weekday = (day: string) => { const [y, m, d] = day.split('-').map(Number) as [number, number, number]; return WEEKDAY[new Date(y, m - 1, d).getDay()] }

const units = computed(() => COURSES.map((course, i) => {
  const cards = [...new Set(course.lessons.flatMap(l => l.plan.cards))]
  return {
    id: course.id,
    label: `Unité ${i + 1}`,
    title: course.title,
    done: course.lessons.filter(l => progress.value.completions[l.id]).length,
    lessons: course.lessons.length,
    accuracy: accuracy(progress.value, cards),
    mastery: masteryBreakdown(progress.value.mastery, cards, now),
  }
}))

/** Card name and unit, for the most missed list. */
function cardInfo(id: string) {
  const i = COURSES.findIndex(c => c.lessons.some(l => l.plan.cards.includes(id)))
  return i < 0 ? { name: id, unit: '' } : { name: COURSES[i]!.card(id).name, unit: `Unité ${i + 1}` }
}
const missed = computed(() => mostMissed(progress.value, 8).map(m => ({ ...m, ...cardInfo(m.cardId) })))
const exams = computed(() => progress.value.exams ?? [])
const shortDay = (day: string) => day.split('-').reverse().slice(0, 2).join('/')
const pct = (n: number, total: number) => (total ? n / total * 100 : 0)
</script>

<template>
  <div class="shell">
    <header class="top">
      <NuxtLink to="/" class="back" aria-label="Retour au parcours">←</NuxtLink>
      <h1>Statistiques</h1>
      <span class="spacer" />
    </header>

    <main class="body">
      <!-- Summary -->
      <section class="tiles" aria-label="Résumé">
        <div class="tile"><b>{{ acc === null ? '–' : `${acc} %` }}</b><span>🎯 de bonnes réponses</span></div>
        <div class="tile"><b>{{ all.right + all.wrong }}</b><span>✍️ réponses</span></div>
        <div class="tile"><b>{{ lessonsDone }} / {{ lessonsTotal }}</b><span>📚 leçons finies</span></div>
        <div class="tile"><b>{{ streak }}</b><span>🔥 jours de suite</span></div>
      </section>

      <!-- Activity -->
      <section class="card">
        <h2>Les 14 derniers jours</h2>
        <div class="chart" role="img" :aria-label="`Réponses par jour : ${days.map(d => `${shortDay(d.day)} ${d.right} justes ${d.wrong} fausses`).join(', ')}`">
          <div v-for="d in days" :key="d.day" class="col">
            <div class="stack" :style="{ height: pct(d.right + d.wrong, peak) + '%' }">
              <i class="wrong" :style="{ flexGrow: d.wrong }" />
              <i class="right" :style="{ flexGrow: d.right }" />
            </div>
            <span class="wd" :class="{ today: d.day === today }">{{ weekday(d.day) }}</span>
          </div>
        </div>
        <p class="legend"><span class="sw right" /> justes <span class="sw wrong" /> fausses</p>
      </section>

      <!-- By unit -->
      <section class="card">
        <h2>Par unité</h2>
        <ul class="units">
          <li v-for="u in units" :key="u.id">
            <div class="uhead">
              <span><small>{{ u.label }}</small> {{ u.title }}</span>
              <b>{{ u.accuracy === null ? '–' : `${u.accuracy} %` }}</b>
            </div>
            <div class="mbar" role="img" :aria-label="`${u.mastery.known} sues, ${u.mastery.learning} en cours, ${u.mastery.weak} à retravailler, ${u.mastery.unseen} pas vues`">
              <i class="known" :style="{ width: pct(u.mastery.known, u.mastery.total) + '%' }" />
              <i class="learning" :style="{ width: pct(u.mastery.learning, u.mastery.total) + '%' }" />
              <i class="weak" :style="{ width: pct(u.mastery.weak, u.mastery.total) + '%' }" />
            </div>
            <p class="umeta">
              {{ u.done }}/{{ u.lessons }} leçons · ✓ {{ u.mastery.known }} sues · {{ u.mastery.learning }} en cours<template v-if="u.mastery.weak"> · ⚠️ {{ u.mastery.weak }} à retravailler</template>
            </p>
          </li>
        </ul>
        <p class="legend"><span class="sw known" /> sues <span class="sw learning" /> en cours <span class="sw weak" /> à retravailler</p>
        <p class="explain">
          Chaque bonne réponse fait monter une fiche d’un niveau et la fait revenir plus tard (1 jour, 3 jours, 1 semaine, 3 semaines).
          Chaque erreur la fait redescendre d’un niveau et la fait revenir tout de suite.
          Une fiche est <b>à retravailler</b> quand elle est à un niveau bas et qu’il est temps de la revoir ; elle est <b>sue</b> à partir du niveau 3.
        </p>
      </section>

      <!-- Most missed -->
      <section class="card">
        <h2>Tes erreurs les plus fréquentes</h2>
        <p v-if="!missed.length" class="empty">Pas encore d’erreur enregistrée. Bravo, ou à toi de jouer !</p>
        <ol v-else class="missed">
          <li v-for="m in missed" :key="m.cardId">
            <span class="mname">{{ m.name }} <small>{{ m.unit }}</small></span>
            <span class="mcount">✗ {{ m.wrong }} · {{ m.rate }} %</span>
          </li>
        </ol>
        <NuxtLink v-if="missed.length" :to="`/lecon/${PRACTICE_ID}`" class="btn">Les retravailler</NuxtLink>
      </section>

      <!-- Exams -->
      <section class="card">
        <h2>Examens blancs</h2>
        <p v-if="!exams.length" class="empty">Aucun examen blanc passé pour l’instant.</p>
        <ul v-else class="exams">
          <li v-for="(e, i) in exams" :key="i">
            <span>{{ shortDay(e.day) }}</span>
            <span class="ebar"><i :style="{ width: pct(e.total - e.errors, e.total) + '%' }" /></span>
            <b>{{ e.total - e.errors }}/{{ e.total }} {{ e.passed ? '✓' : '✗' }}</b>
          </li>
        </ul>
      </section>

      <p class="note">Les statistiques sont gardées sur ce téléphone, depuis la mise à jour du 18/11/2026.</p>
    </main>
  </div>
</template>

<style scoped>
.top {
  position: sticky; top: 0; z-index: 5; display: flex; align-items: center; padding: 8px 12px;
  border-bottom: 2px solid var(--line); background: var(--surface);
}
.top h1 { flex: 1; margin: 0; font-size: 19px; font-weight: 900; text-align: center; }
.back, .spacer { display: grid; place-items: center; width: 44px; height: 44px; font-size: 24px; color: var(--ink-mute); text-decoration: none; }
.body { padding: 14px 16px 40px; display: flex; flex-direction: column; gap: 14px; }

.tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.tile { padding: 12px; border: 2px solid var(--line); border-radius: 16px; text-align: center; }
.tile b { display: block; font-size: 24px; font-weight: 900; color: var(--primary); }
.tile span { font-size: 13px; color: var(--ink-mute); }

.card { padding: 16px; border: 2px solid var(--line); border-radius: 18px; }
.card h2 { margin: 0 0 12px; font-size: 18px; font-weight: 900; }
.empty, .note { margin: 0; font-size: 14px; font-weight: 600; color: var(--ink-mute); }
.note { text-align: center; }
.card .btn { display: block; margin-top: 12px; text-align: center; text-decoration: none; line-height: 28px; }

.chart { display: flex; align-items: flex-end; gap: 4px; height: 130px; }
.col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; gap: 4px; }
.stack { display: flex; flex-direction: column; width: 100%; min-height: 2px; border-radius: 4px; overflow: hidden; background: var(--line); }
.stack i { display: block; min-height: 0; }
.right { background: var(--ok-fill); }
.wrong { background: var(--ko-fill); }
.wd { font-size: 12px; color: var(--ink-mute); }
.wd.today { color: var(--primary); font-weight: 900; }
.legend { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin: 10px 0 0; font-size: 13px; color: var(--ink-mute); }
.sw { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-left: 6px; }
.sw.right { background: var(--ok-fill); } .sw.wrong { background: var(--ko-fill); }
.sw.known { background: var(--ok-fill); } .sw.learning { background: var(--gold); } .sw.weak { background: var(--ko-fill); }

.units { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 14px; }
.uhead { display: flex; justify-content: space-between; gap: 8px; font-size: 15px; }
.uhead small { color: var(--ink-mute); font-size: 12px; text-transform: uppercase; }
.mbar { display: flex; height: 12px; margin: 6px 0 4px; border-radius: 99px; overflow: hidden; background: var(--line); }
.mbar .known { background: var(--ok-fill); } .mbar .learning { background: var(--gold); } .mbar .weak { background: var(--ko-fill); }
.explain { margin: 10px 0 0; font-size: 14px; line-height: 1.45; color: var(--ink-mute); }
.umeta { margin: 0; font-size: 13px; font-weight: 600; color: var(--ink-mute); }

.missed { margin: 0; padding: 0 0 0 22px; display: flex; flex-direction: column; gap: 8px; }
.missed li { font-size: 15px; }
.missed li::marker { color: var(--ink-mute); font-weight: 800; }
.mname { display: block; }
.mname small { color: var(--ink-mute); font-size: 12px; }
.mcount { font-size: 13px; color: var(--ko-text); }

.exams { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.exams li { display: grid; grid-template-columns: 48px 1fr auto; align-items: center; gap: 10px; font-size: 14px; }
.ebar { height: 10px; border-radius: 99px; background: var(--line); overflow: hidden; }
.ebar i { display: block; height: 100%; background: var(--primary); }
</style>
