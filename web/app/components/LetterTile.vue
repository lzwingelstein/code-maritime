<script setup lang="ts">
/** A big letter tile for the radio alphabet. */
defineProps<{ char: string }>()
</script>

<template>
  <span class="letter-tile display" role="img" :aria-label="`Lettre ${char}`">{{ char }}</span>
</template>

<style scoped>
.letter-tile {
  display: inline-flex; align-items: center; justify-content: center; width: 112px; height: 112px; border-radius: 28px;
  background: var(--primary); color: #fff; font-size: 64px; font-weight: 700; line-height: 1;
}
</style>
