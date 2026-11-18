<script setup lang="ts">
import { COURSES } from '~/courses'
import { revisionSheets } from '~/courses/sheets'
import type { CardInfo, Tip } from '~/courses/types'
import { isDue } from '~/engine/mastery'

const { progress } = useProgress()
const now = Date.now()

type Item = { key: string, tip: Tip, title: string } | { key: string, card: CardInfo, cardId: string, title: string }

/** Every sheet of the done lessons, unit by unit: the lesson tip first, then its cards. */
const units = computed(() => revisionSheets(COURSES, progress.value.completions).map(u => ({
  id: u.course.id,
  label: `Unité ${COURSES.indexOf(u.course) + 1}`,
  title: u.course.title,
  items: u.lessons.flatMap(l => [
    ...(l.lesson.tip ? [{ key: `tip-${l.lesson.id}`, tip: l.lesson.tip, title: l.lesson.tip.title }] : []),
    ...l.cards.map(id => ({ key: id, card: u.course.card(id), cardId: id, title: u.course.card(id).name })),
  ] as Item[]),
})))
const all = computed(() => units.value.flatMap(u => u.items))

/** Mastery said in words, never by colour alone. */
function state(cardId: string) {
  const m = progress.value.mastery[cardId]
  if (!m) return null
  if (m.level >= 3) return { icon: '✓', text: 'Sue', cls: 'known' }
  if (m.level <= 1 && isDue(m, now)) return { icon: '⚠️', text: 'À retravailler', cls: 'weak' }
  return null
}
const plainName = (s: string) => s.replaceAll('**', '')

// Viewer: one sheet in full, previous / next, swipe.
const open = ref<number | null>(null)
const current = computed(() => (open.value === null ? null : all.value[open.value] ?? null))
const show = (key: string) => { open.value = all.value.findIndex(i => i.key === key) }
const move = (d: number) => {
  if (open.value === null) return
  open.value = Math.min(all.value.length - 1, Math.max(0, open.value + d))
}
let startX = 0
const onTouchStart = (e: TouchEvent) => { startX = e.touches[0]?.clientX ?? 0 }
const onTouchEnd = (e: TouchEvent) => {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - startX
  if (Math.abs(dx) > 60) move(dx < 0 ? 1 : -1)
}
function onKey(e: KeyboardEvent) {
  if (open.value === null) return
  if (e.key === 'Escape') open.value = null
  else if (e.key === 'ArrowRight') move(1)
  else if (e.key === 'ArrowLeft') move(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="shell">
    <header class="top">
      <h1>Fiches</h1>
    </header>
    <main class="body">
      <SheetsSwitch class="sw" />
      <p v-if="!units.length" class="lead">Termine une leçon : ses fiches de cours apparaîtront ici pour que tu puisses les relire quand tu veux.</p>
      <p v-else class="lead">Le cours des leçons que tu as terminées. Touche une fiche pour l’ouvrir.</p>

      <section v-for="u in units" :key="u.id" class="unit">
        <h2><small>{{ u.label }}</small>{{ u.title }}</h2>
        <ul class="grid">
          <li v-for="it in u.items" :key="it.key">
            <button type="button" class="thumb" :class="{ tip: 'tip' in it }" :aria-label="`${'tip' in it ? 'Astuce' : 'Fiche'} : ${plainName(it.title)}${'cardId' in it && state(it.cardId) ? `, ${state(it.cardId)!.text}` : ''}`" @click="show(it.key)">
              <span class="pic" aria-hidden="true">
                <span v-if="'tip' in it" class="emoji">{{ it.tip.emoji }}</span>
                <CardVisual v-else :visual="it.card.visual" />
              </span>
              <span class="name" aria-hidden="true">{{ 'tip' in it ? '💡 ' : '' }}{{ plainName(it.title) }}</span>
              <span v-if="'cardId' in it && state(it.cardId)" class="badge" :class="state(it.cardId)!.cls" aria-hidden="true">{{ state(it.cardId)!.icon }}</span>
            </button>
          </li>
        </ul>
      </section>
      <p v-if="units.length" class="legend">✓ fiche sue · ⚠️ à retravailler · 💡 astuce de la leçon</p>
    </main>

    <div v-if="current" class="viewer" role="dialog" aria-modal="true" :aria-label="plainName(current.title)" @touchstart.passive="onTouchStart" @touchend="onTouchEnd">
      <header class="vtop">
        <button type="button" class="vbtn" aria-label="Fermer" @click="open = null">✕</button>
        <span class="count">{{ open! + 1 }} / {{ all.length }}</span>
        <span class="vbtn" />
      </header>
      <div class="vbody">
        <TipCard v-if="'tip' in current" :key="current.key" :tip="current.tip" />
        <InfoCard v-else :key="current.key" :card="current.card" badge="Fiche">
          <p v-if="state(current.cardId)" class="state" :class="state(current.cardId)!.cls">{{ state(current.cardId)!.icon }} {{ state(current.cardId)!.text }}</p>
        </InfoCard>
      </div>
      <footer class="vnav">
        <button type="button" class="nav" :disabled="open === 0" @click="move(-1)">‹ Précédente</button>
        <button type="button" class="nav" :disabled="open === all.length - 1" @click="move(1)">Suivante ›</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.top {
  position: sticky; top: 0; z-index: 5; display: flex; align-items: center; min-height: 56px; padding: 8px 12px;
  border-bottom: 2px solid var(--line); background: var(--surface);
}
.top h1 { flex: 1; margin: 0; font-size: 19px; font-weight: 700; text-align: center; }
.sw { margin-bottom: 14px; }
.body { padding: 14px 16px 24px; }
.lead, .legend { margin: 0 0 8px; font-size: 14px; color: var(--ink-mute); line-height: 1.45; }
.legend { margin-top: 16px; text-align: center; }
.unit { margin-top: 18px; }
.unit h2 { margin: 0 0 10px; font-size: 18px; font-weight: 700; }
.unit h2 small { display: block; font-size: 12px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: .06em; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 0; padding: 0; list-style: none; }
.thumb {
  position: relative; display: flex; flex-direction: column; width: 100%; height: 100%; padding: 0; overflow: hidden;
  border: 2px solid var(--line); border-radius: 12px; background: var(--surface); color: var(--ink); text-align: center;
}
.thumb.tip { background: var(--tip-soft); border-color: var(--tip-line); }
.pic { display: flex; align-items: center; justify-content: center; height: 92px; padding: 6px; overflow: hidden; }
.pic :deep(svg) { max-height: 80px; width: auto; max-width: 100%; }
.pic :deep(.horn .legend), .pic :deep(.horn .replay) { display: none; }
.pic :deep(.emoji), .emoji { font-size: 40px; }
.name {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  max-height: calc(2.5em + 11px); padding: 4px 6px 7px; border-top: 1px solid var(--line); font-size: 12px; font-weight: 600; line-height: 1.25;
}
.badge {
  position: absolute; top: 4px; right: 4px; min-width: 22px; height: 22px; padding: 0 4px; border-radius: 99px;
  background: var(--surface); border: 2px solid currentColor; font-size: 12px; font-weight: 700; line-height: 18px;
}
.badge.known { color: var(--ok-text); }
.badge.weak { color: var(--ko-text); }

.viewer { position: fixed; inset: 0; z-index: 30; display: flex; flex-direction: column; background: var(--surface); }
.vtop { display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; border-bottom: 2px solid var(--line); }
.vbtn { display: grid; place-items: center; width: 44px; height: 44px; border: 0; background: none; font-size: 22px; color: var(--ink-mute); }
.count { font-size: 15px; font-weight: 600; color: var(--ink-mute); }
.vbody { flex: 1; overflow-y: auto; padding: 14px 16px; max-width: 480px; width: 100%; margin: 0 auto; }
.vnav { display: flex; gap: 10px; padding: 10px 16px calc(12px + env(safe-area-inset-bottom)); border-top: 2px solid var(--line); max-width: 480px; width: 100%; margin: 0 auto; }
.nav { flex: 1; min-height: 48px; border: 2px solid var(--line); border-radius: 14px; background: var(--surface); color: var(--primary); font-size: 16px; font-weight: 700; }
.nav:disabled { color: var(--ink-mute); opacity: .5; }
.state { margin: 10px 0 0; font-size: 14px; font-weight: 600; }
.state.known { color: var(--ok-text); }
.state.weak { color: var(--ko-text); }
</style>
