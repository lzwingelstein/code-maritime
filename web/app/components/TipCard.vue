<script setup lang="ts">
import type { Tip } from '~/courses/types'

defineProps<{ tip: Tip }>()
</script>

<template>
  <div class="card tip">
    <div class="big"><UiIcon name="bulb" :size="40" /></div>
    <h2>{{ tip.title }}</h2>
    <p><RichText :text="tip.text" /></p>
    <ul v-if="tip.rows" class="tiprows">
      <li v-for="(r, i) in tip.rows" :key="i">
        <div class="tippic"><CardVisual :visual="r.visual" /></div>
        <span><RichText :text="r.label" /></span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.card { padding: 18px; border: 2px solid var(--line); border-radius: 18px; text-align: center; animation: pop .25s; }
.card h2 { margin: 10px 0 6px; font-size: 23px; font-weight: 700; }
.card p { margin: 8px 0 0; font-size: 16px; font-weight: 500; line-height: 1.45; }
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
.card .big { color: var(--primary); }
@keyframes pop { 0% { transform: scale(.96); } 60% { transform: scale(1.03); } 100% { transform: scale(1); } }
</style>
