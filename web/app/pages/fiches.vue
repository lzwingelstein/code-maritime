<script setup lang="ts">
import { COURSES } from '~/courses'
import { revisionSheets } from '~/courses/sheets'
import type { CardInfo, Tip } from '~/courses/types'
import { masteryStep, type MasteryStep } from '~/engine/mastery'

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

/** Mastery said in words and dots, never by colour alone. */
const WORD: Record<MasteryStep, string> = { new: 'Nouvelle', learning: 'En cours', known: '✓ Sue', weak: '! À revoir' }
function level(cardId: string) {
  const m = masteryStep(progress.value.mastery[cardId], now)
  return { ...m, word: WORD[m.step], text: m.step === 'weak' ? 'À retravailler' : WORD[m.step].replace(/^[✓!] /, '') }
}
// Kept for the sheet viewer: a line only when it says something useful.
function state(cardId: string) {
  const l = level(cardId)
  if (l.step === 'known') return { icon: 'check' as const, text: 'Sue', cls: 'known' }
  if (l.step === 'weak') return { icon: 'alert' as const, text: 'À retravailler', cls: 'weak' }
  return null
}

// Filters: every sheet, only the weak ones, only the known ones. Tips only show under « Toutes ».
type Filter = 'all' | 'weak' | 'known'
const filter = ref<Filter>('all')
const cardItems = computed(() => all.value.filter((i): i is Extract<Item, { cardId: string }> => 'cardId' in i))
const counts = computed(() => ({
  weak: cardItems.value.filter(i => level(i.cardId).step === 'weak').length,
  known: cardItems.value.filter(i => level(i.cardId).step === 'known').length,
}))
const FILTERS = computed(() => [
  { id: 'all' as const, label: 'Toutes' },
  { id: 'weak' as const, label: `À revoir (${counts.value.weak})` },
  { id: 'known' as const, label: `Sues (${counts.value.known})` },
])
const keep = (it: Item) => filter.value === 'all' || ('cardId' in it && level(it.cardId).step === filter.value)
const shownUnits = computed(() => units.value
  .map(u => ({ ...u, shown: u.items.filter(keep), known: u.items.filter(i => 'cardId' in i && level(i.cardId).step === 'known').length, cards: u.items.filter(i => 'cardId' in i).length }))
  .filter(u => u.shown.length))
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

      <div v-if="units.length" class="filters" role="group" aria-label="Filtrer les fiches">
        <button
          v-for="f in FILTERS"
          :key="f.id"
          type="button"
          class="chip"
          :class="{ on: filter === f.id }"
          :aria-pressed="filter === f.id"
          @click="filter = f.id"
        >
          {{ f.label }}
        </button>
      </div>
      <p v-if="units.length" class="lead">Chaque bonne réponse, espacée dans le temps, fait monter une fiche d’un niveau. Au 3ᵉ, elle est sue. Touche une fiche pour l’ouvrir.</p>
      <p v-if="units.length && !shownUnits.length" class="lead">Aucune fiche ici pour l’instant.</p>

      <section v-for="u in shownUnits" :key="u.id" class="unit">
        <h2>
          <span><small>{{ u.label }}</small>{{ u.title }}</span>
          <span class="ucount">{{ u.known }} sue{{ u.known > 1 ? 's' : '' }} sur {{ u.cards }}</span>
        </h2>
        <ul class="grid">
          <li v-for="it in u.shown" :key="it.key">
            <button type="button" class="thumb" :class="['tip' in it ? 'tip' : level(it.cardId).step]" :aria-label="`${'tip' in it ? 'Astuce' : 'Fiche'} : ${plainName(it.title)}${'cardId' in it ? `, ${level(it.cardId).text}` : ''}`" @click="show(it.key)">
              <span class="pic" aria-hidden="true">
                <span v-if="'tip' in it" class="bulb"><UiIcon name="bulb" :size="40" /></span>
                <CardVisual v-else :visual="it.card.visual" />
              </span>
              <span class="name" aria-hidden="true">{{ plainName(it.title) }}</span>
              <span class="lvl" aria-hidden="true">
                <template v-if="'cardId' in it">
                  <span class="dots"><i v-for="k in 3" :key="k" :class="{ on: k <= level(it.cardId).dots }" /></span>
                  <span class="word">{{ level(it.cardId).word }}</span>
                </template>
                <span v-else class="word">Astuce</span>
              </span>
            </button>
          </li>
        </ul>
      </section>
    </main>

    <div v-if="current" class="viewer" role="dialog" aria-modal="true" :aria-label="plainName(current.title)" @touchstart.passive="onTouchStart" @touchend="onTouchEnd">
      <header class="vtop">
        <button type="button" class="vbtn" aria-label="Fermer" @click="open = null"><UiIcon name="x" :size="22" /></button>
        <span class="count">{{ open! + 1 }} / {{ all.length }}</span>
        <span class="vbtn" />
      </header>
      <div class="vbody">
        <TipCard v-if="'tip' in current" :key="current.key" :tip="current.tip" />
        <InfoCard v-else :key="current.key" :card="current.card" badge="Fiche">
          <p v-if="state(current.cardId)" class="state" :class="state(current.cardId)!.cls"><UiIcon :name="state(current.cardId)!.icon" :size="18" /> {{ state(current.cardId)!.text }}</p>
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
  background: var(--bg);
}
.top h1 { flex: 1; margin: 0; font-size: 19px; font-weight: 700; text-align: center; }
.sw { margin-bottom: 14px; }
.body { padding: 14px 16px 24px; }
.lead { margin: 0 0 8px; font-size: 14px; color: var(--ink-mute); line-height: 1.45; }
.unit { margin-top: 18px; }
.unit h2 { margin: 0 0 10px; font-size: 18px; font-weight: 700; }
.unit h2 small { display: block; font-size: 12px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: .06em; }

.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.chip { min-height: 44px; padding: 0 16px; border: 2px solid var(--line); border-radius: 22px; background: var(--surface); color: var(--ink); font-size: 14px; font-weight: 600; }
.chip.on { border-color: var(--ink); background: var(--ink); color: #fff; }
.unit h2 { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; }
.ucount { flex-shrink: 0; font-family: 'Inter Variable', Inter, sans-serif; font-size: 13px; font-weight: 500; color: var(--ink-mute); }

.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 0; padding: 0; list-style: none; }
.thumb {
  display: flex; flex-direction: column; gap: 8px; width: 100%; height: 100%; padding: 10px 12px 12px; overflow: hidden;
  border: 2px solid var(--line); border-radius: 14px; background: var(--surface); color: var(--ink); text-align: left;
}
.thumb.tip { background: var(--tip-soft); border-color: var(--tip-line); }
.thumb.weak { border-color: var(--ko-soft); }
.pic { display: flex; align-items: center; justify-content: center; height: 84px; overflow: hidden; }
.pic :deep(svg) { max-height: 80px; width: auto; max-width: 100%; }
.pic :deep(.horn .legend), .pic :deep(.horn .replay) { display: none; }
.pic :deep(.emoji) { font-size: 40px; }
.bulb { color: var(--primary); }
.name {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  font-size: 14px; font-weight: 600; line-height: 1.3;
}
.lvl { display: flex; align-items: center; gap: 8px; margin-top: auto; }
.dots { display: flex; gap: 4px; }
.dots i { width: 8px; height: 8px; border: 1.5px solid var(--ink-mute); border-radius: 50%; box-sizing: border-box; }
.dots i.on { border-color: var(--primary); background: var(--primary); }
.known .dots i.on { border-color: var(--ok); background: var(--ok); }
.word { font-size: 13px; font-weight: 600; color: var(--ink-mute); }
.known .word { color: var(--ok-text); }
.weak .word { color: var(--ko-text); }
.tip .word { color: var(--primary); }

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
