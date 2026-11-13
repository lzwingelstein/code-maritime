<script setup lang="ts">
/** All-round lights in a vertical line on a night background, named in text for screen readers. */
import type { StackColour } from '~/courses/types'

const props = defineProps<{ colours: StackColour[] }>()
const FILL: Record<StackColour, string> = { white: '#FFF6CC', red: '#FF453A', green: '#32D74B' }
const NAME: Record<StackColour, string> = { white: 'blanc', red: 'rouge', green: 'vert' }
const height = computed(() => 40 + props.colours.length * 34)
</script>

<template>
  <svg
class="stack" :viewBox="`0 0 80 ${height}`" xmlns="http://www.w3.org/2000/svg" role="img"
       :aria-label="`Feux de haut en bas : ${colours.map(c => NAME[c]).join(', ')}`">
    <rect x="0" y="0" width="80" :height="height" rx="12" class="night" />
    <line x1="40" y1="8" x2="40" :y2="height - 8" class="mast" />
    <g v-for="(c, i) in colours" :key="i">
      <circle cx="40" :cy="30 + i * 34" r="15" :fill="FILL[c]" opacity=".35" />
      <circle cx="40" :cy="30 + i * 34" r="9" :fill="FILL[c]" />
    </g>
  </svg>
</template>

<style scoped>
.stack { height: 100%; max-height: 150px; width: auto; display: block; margin: 0 auto; }
.night { fill: var(--night-mid); }
.mast { stroke: #3A4250; stroke-width: 4; }
</style>
