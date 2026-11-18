<script setup lang="ts">
/** Main navigation, always at the bottom except inside a lesson. Line icon and text on every tab. The lexicon lives in the « Fiches » tab. */
const TABS = [
  { to: '/', icon: 'compass', label: 'Parcours' },
  { to: '/fiches', icon: 'cards', label: 'Fiches', also: ['/lexique'] },
  { to: '/stats', icon: 'chart', label: 'Stats' },
] as const
const route = useRoute()
// Static hosting may add a trailing slash (/stats/): compare without it.
const here = computed(() => (route.path.length > 1 ? route.path.replace(/\/$/, '') : route.path))
const isOn = (t: typeof TABS[number]) => here.value === t.to || ('also' in t && (t.also as readonly string[]).includes(here.value))
</script>

<template>
  <nav class="tabs" aria-label="Navigation principale">
    <NuxtLink
      v-for="t in TABS"
      :key="t.to"
      :to="t.to"
      class="tab"
      :class="{ on: isOn(t) }"
      :aria-current="isOn(t) ? 'page' : undefined"
    >
      <UiIcon :name="t.icon" :size="24" />
      <span>{{ t.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.tabs {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 10; display: flex; justify-content: center;
  padding-bottom: env(safe-area-inset-bottom); border-top: 2px solid var(--line); background: var(--surface);
}
.tab {
  flex: 1; max-width: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  min-height: 64px; color: var(--ink-mute); font-size: 12px; font-weight: 600; text-decoration: none;
  border-top: 3px solid transparent; margin-top: -2px;
}
/* Current tab: colour and a bar above it — not colour alone. */
.tab.on { color: var(--primary); border-top-color: var(--primary); }
</style>
