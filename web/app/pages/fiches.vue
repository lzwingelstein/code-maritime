<script setup lang="ts">
import { COURSES } from '~/courses'
import { revisionSheets } from '~/courses/sheets'
import { isDue } from '~/engine/mastery'

const { progress } = useProgress()
const now = Date.now()
const units = computed(() => revisionSheets(COURSES, progress.value.completions).map(u => ({
  ...u, label: `Unité ${COURSES.indexOf(u.course) + 1}`,
})))

/** Mastery said in words, never by colour alone. */
function state(cardId: string) {
  const m = progress.value.mastery[cardId]
  if (!m) return null
  if (m.level >= 3) return { text: '✓ Sue', cls: 'known' }
  if (m.level <= 1 && isDue(m, now)) return { text: '⚠️ À retravailler', cls: 'weak' }
  return { text: 'En cours', cls: 'learning' }
}
</script>

<template>
  <div class="shell">
    <header class="top">
      <h1>Mes fiches</h1>
    </header>
    <main class="body">
      <p v-if="!units.length" class="lead">Termine une leçon : ses fiches de cours apparaîtront ici pour que tu puisses les relire quand tu veux.</p>
      <p v-else class="lead">Le cours des leçons que tu as terminées. Touche une leçon pour relire ses fiches.</p>

      <section v-for="u in units" :key="u.course.id" class="unit">
        <h2><small>{{ u.label }}</small>{{ u.course.title }}</h2>
        <details v-for="l in u.lessons" :key="l.lesson.id" class="lesson">
          <summary>
            <span>{{ l.lesson.title }}</span>
            <small>{{ l.cards.length }} fiche{{ l.cards.length > 1 ? 's' : '' }}</small>
          </summary>
          <div class="cards">
            <TipCard v-if="l.lesson.tip" :tip="l.lesson.tip" />
            <InfoCard v-for="id in l.cards" :key="id" :card="u.course.card(id)" badge="Fiche">
              <p v-if="state(id)" class="state" :class="state(id)!.cls">{{ state(id)!.text }}</p>
            </InfoCard>
          </div>
        </details>
      </section>
    </main>
  </div>
</template>

<style scoped>
.top {
  position: sticky; top: 0; z-index: 5; display: flex; align-items: center; min-height: 56px; padding: 8px 12px;
  border-bottom: 2px solid var(--line); background: var(--surface);
}
.top h1 { flex: 1; margin: 0; font-size: 19px; font-weight: 900; text-align: center; }
.body { padding: 14px 16px 40px; }
.lead { margin: 0 0 8px; font-size: 15px; color: var(--ink-mute); line-height: 1.45; }
.unit { margin-top: 18px; }
.unit h2 { margin: 0 0 8px; padding-bottom: 8px; border-bottom: 2px solid var(--line); font-size: 19px; font-weight: 900; }
.unit h2 small { display: block; font-size: 12px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: .06em; }
.lesson { border-bottom: 1px solid var(--line); }
.lesson summary {
  display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 48px;
  font-size: 16px; font-weight: 800; cursor: pointer; list-style: none;
}
.lesson summary::-webkit-details-marker { display: none; }
.lesson summary::after { content: "▸"; color: var(--primary); font-size: 18px; }
.lesson[open] summary::after { content: "▾"; }
.lesson summary small { margin-left: auto; font-size: 13px; font-weight: 700; color: var(--ink-mute); }
.cards { display: flex; flex-direction: column; gap: 12px; padding: 4px 0 16px; }
.state { margin: 10px 0 0; font-size: 14px; font-weight: 800; }
.state.known { color: var(--ok-text); }
.state.weak { color: var(--ko-text); }
.state.learning { color: var(--ink-mute); }
</style>
