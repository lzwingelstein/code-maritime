<script setup lang="ts">
/**
 * Line icons for the UI chrome (no emoji in the interface): 24 px grid, stroke in currentColor, decorative.
 * Always pair an icon with text, or give its parent an aria-label.
 */
const PATHS = {
  boat: ['M3 17h18l-2.5 4h-13z', 'M12 3v11', 'M12 4l6 9H6z'],
  compass: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M15.5 8.5l-2 5-5 2 2-5z'],
  cards: ['M4 7h12v13H4z', 'M8 4h12v13'],
  chart: ['M4 20V11', 'M10 20V5', 'M16 20v-6', 'M21 20H3'],
  book: ['M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z', 'M4 21V5', 'M8 7h7'],
  lock: ['M5 11h14v10H5z', 'M8 11V8a4 4 0 0 1 8 0v3'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  x: ['M6 6l12 12', 'M18 6L6 18'],
  clock: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M12 7v5l3 2'],
  target: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M12 7.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9z', 'M12 11.5v1'],
  cap: ['M2 9l10-5 10 5-10 5z', 'M6 11v5c3 2.5 9 2.5 12 0v-5', 'M22 9v6'],
  pen: ['M4 20l1-4L16 5l3 3L8 19z', 'M14 7l3 3'],
  layers: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5'],
  alert: ['M12 4l9.5 16h-19z', 'M12 10v4', 'M12 17v.5'],
  bulb: ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'],
  speaker: ['M4 10v4h4l5 4V6L8 10z', 'M16.5 9a4 4 0 0 1 0 6', 'M19 6.5a7.5 7.5 0 0 1 0 11'],
  bell: ['M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z', 'M10 21h4'],
  trophy: ['M8 4h8v5a4 4 0 0 1-8 0z', 'M8 6H4.5a3 3 0 0 0 3.5 4', 'M16 6h3.5a3 3 0 0 1-3.5 4', 'M12 13v4', 'M8 21h8', 'M9 17h6v4H9z'],
  refresh: ['M20 11a8 8 0 1 0-2.3 5.7', 'M20 5v6h-6'],
} as const

export type IconName = keyof typeof PATHS

withDefaults(defineProps<{ name: IconName, size?: number }>(), { size: 20 })
</script>

<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, i) in PATHS[name]" :key="i" :d="d" />
  </svg>
</template>

<style scoped>
.icon { display: inline-block; flex-shrink: 0; vertical-align: -0.2em; }
</style>
