<script setup lang="ts">
/**
 * Line pictograms for course sheets that have no drawn scene (rules, VHF, safety…): 24 px grid, stroke in
 * currentColor (the primary blue). They replace the emoji pictures, which rendered differently on every phone.
 */
import { PICTOS, type Picto, type PictoName } from '~/courses/pictos'

const props = defineProps<{ name: PictoName }>()
const picto = computed<Picto>(() => PICTOS[props.name])
</script>

<template>
  <svg class="picto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path v-for="(d, i) in picto.paths" :key="i" :d="d" />
    <text v-if="picto.text" x="12" :y="picto.textY ?? 13.8" text-anchor="middle" stroke="none" fill="currentColor" :font-size="picto.textSize ?? 5.5" font-weight="700" font-family="Inter Variable, Inter, system-ui, sans-serif">{{ picto.text }}</text>
  </svg>
</template>

<style scoped>
.picto { width: 64px; height: 64px; color: var(--primary); }
</style>
