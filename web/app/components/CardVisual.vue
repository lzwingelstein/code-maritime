<script setup lang="ts">
/** Draws any course visual: a buoy, a light rhythm, a ship scene or an emoji icon. */
import type { Visual } from '~/courses/types'

defineProps<{ visual: Visual }>()
</script>

<template>
  <BuoyMark v-if="visual.type === 'mark'" :mark-id="visual.markId" :top-only="visual.topOnly" />
  <NightLight v-else-if="visual.type === 'light'" :mark-id="visual.markId" />
  <ShipScene
    v-else-if="visual.type === 'ship'"
    :vessel-id="visual.vesselId"
    :aspect="visual.aspect"
    :mode="visual.mode"
    :silhouette="visual.silhouette"
  />
  <EncounterScene v-else-if="visual.type === 'encounter'" v-bind="visual" />
  <HornSignal v-else-if="visual.type === 'horn'" :pattern="visual.pattern" :caption="visual.caption" />
  <PortSignal v-else-if="visual.type === 'port'" :lights="visual.lights" :flashing="visual.flashing" :exemption="visual.exemption" />
  <span v-else class="emoji" aria-hidden="true">{{ visual.char }}</span>
</template>

<style scoped>
.emoji { font-size: 34px; line-height: 1; }
</style>
