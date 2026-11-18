<script setup lang="ts">
/**
 * Sheet illustration (style A): flat rounded shapes on a round backdrop in the colour of the sheet's theme.
 * Replaces the emoji pictures, which looked different on every phone. Decorative: the sheet name says it all.
 */
import { PICTOS, TONES, type PictoName, type PictoPart, type PictoTone } from '~/courses/pictos'

const props = defineProps<{ name: PictoName, tone: PictoTone }>()
const parts = computed<readonly PictoPart[]>(() => PICTOS[props.name])
</script>

<template>
  <svg class="picto" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <circle cx="24" cy="24" r="23" :fill="TONES[tone]" />
    <template v-for="(p, i) in parts" :key="i">
      <text
        v-if="'text' in p"
        :x="p.x"
        :y="p.y"
        text-anchor="middle"
        :font-size="p.size"
        :fill="p.fill"
        font-weight="700"
        font-family="Inter Variable, Inter, system-ui, sans-serif"
      >{{ p.text }}</text>
      <path
        v-else-if="p.stroke"
        :d="p.d"
        fill="none"
        :stroke="p.stroke"
        :stroke-width="p.w ?? 2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path v-else :d="p.d" :fill="p.fill" />
    </template>
  </svg>
</template>

<style scoped>
.picto { width: 72px; height: 72px; }
</style>
