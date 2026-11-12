<script setup lang="ts">
/** Port traffic signal: three lights in a column (top to bottom), flashing or fixed, optional yellow light on the left. */
import type { PortLight } from '~/courses/types'

const props = defineProps<{ lights: PortLight[], flashing?: boolean, exemption?: boolean }>()
const COLOUR: Record<PortLight, string> = { red: '#FF453A', green: '#32D74B', white: '#FFF6CC' }
const NAME: Record<PortLight, string> = { red: 'rouge', green: 'vert', white: 'blanc' }
const label = computed(() => `Feux d’entrée de port, de haut en bas : ${props.lights.map(l => NAME[l]).join(', ')}${props.flashing ? ', à éclats' : ''}${props.exemption ? ', avec un feu jaune à gauche' : ''}`)
</script>

<template>
  <svg class="port" viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="label">
    <rect x="0" y="0" width="220" height="170" rx="16" class="night" />
    <rect x="96" y="10" width="44" height="140" rx="8" class="mast" />
    <rect x="104" y="140" width="28" height="30" class="mast" />
    <g :class="{ flash: flashing }">
      <circle v-for="(l, i) in lights" :key="i" cx="118" :cy="34 + i * 46" r="15" :fill="COLOUR[l]" class="lamp" />
    </g>
    <circle v-if="exemption" cx="72" cy="34" r="13" fill="#FFD60A" class="lamp" />
    <text v-if="flashing" x="148" y="84" class="note">à éclats</text>
  </svg>
</template>

<style scoped>
.port { width: 100%; max-width: 280px; height: auto; display: block; margin: 0 auto; }
.night { fill: var(--night-mid); }
.mast { fill: #3A4250; }
.lamp { filter: drop-shadow(0 0 6px rgba(255, 255, 255, .45)); }
.flash { animation: flash 1s steps(1) infinite; }
@keyframes flash { 50% { opacity: .1; } }
.note { font-size: 14px; font-weight: 800; fill: var(--night-text); }
</style>
