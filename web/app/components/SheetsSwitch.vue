<script setup lang="ts">
/** Two sections of the « Fiches » tab: course sheets and lexicon. */
const route = useRoute()
const ITEMS = [
  { to: '/fiches', label: 'Cours', icon: 'cards' },
  { to: '/lexique', label: 'Lexique', icon: 'book' },
] as const
</script>

<template>
  <nav class="switch" aria-label="Rubriques des fiches">
    <NuxtLink
      v-for="i in ITEMS"
      :key="i.to"
      :to="i.to"
      class="seg"
      :class="{ on: route.path === i.to }"
      :aria-current="route.path === i.to ? 'page' : undefined"
    >
      <UiIcon :name="i.icon" :size="18" />&nbsp;{{ i.label }}
    </NuxtLink>
  </nav>
</template>

<style scoped>
.switch { display: flex; gap: 4px; padding: 4px; border: 2px solid var(--line); border-radius: 14px; background: var(--surface); }
.seg {
  flex: 1; display: flex; align-items: center; justify-content: center; min-height: 44px; border-radius: 10px;
  color: var(--ink-mute); font-size: 15px; font-weight: 600; text-decoration: none;
}
/* Current section: filled and bold, not colour alone. */
.seg.on { background: var(--primary); color: #fff; }
</style>
