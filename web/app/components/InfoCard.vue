<script setup lang="ts">
/** A card as introduced in a lesson: badge, name, picture, one point per sentence. */
import type { CardInfo } from '~/courses/types'
import { sentences } from '~/utils/sentences'

defineProps<{ card: CardInfo, badge?: string }>()
</script>

<template>
  <div class="card">
    <span class="new">{{ badge ?? card.badge }}</span>
    <h2><RichText :text="card.name" /></h2>
    <div class="intro-visual">
      <CardVisual :visual="card.visual" />
    </div>
    <ul class="points">
      <li v-for="(line, i) in sentences(card.intro)" :key="i"><RichText :text="line" /></li>
    </ul>
    <p v-if="card.note" class="lightinfo">{{ card.note }}</p>
    <slot />
  </div>
</template>

<style scoped>
.card { padding: 18px; border: 2px solid var(--line); border-radius: 18px; text-align: center; animation: pop .25s; }
.card h2 { margin: 10px 0 6px; font-size: 23px; font-weight: 900; }
.card p { margin: 8px 0 0; font-size: 16px; font-weight: 600; line-height: 1.45; }
.points { margin: 12px 0 0; padding: 0; list-style: none; text-align: left; }
.points li { position: relative; padding: 6px 0 6px 22px; font-size: 16px; font-weight: 600; line-height: 1.4; border-top: 1px solid var(--line); }
.points li:first-child { border-top: 0; }
.points li::before { content: "•"; position: absolute; left: 6px; color: var(--primary); font-weight: 900; }
.new { display: inline-block; padding: 2px 10px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }
.intro-visual { display: flex; justify-content: center; margin: 8px 0 0; }
.intro-visual :deep(svg.buoy) { height: 190px; }
.lightinfo { color: var(--ink-mute); font-size: 14px !important; font-weight: 700 !important; }

@keyframes pop { 0% { transform: scale(.96); } 60% { transform: scale(1.03); } 100% { transform: scale(1); } }
</style>
