<script setup lang="ts">
/** Main navigation, always at the bottom except inside a lesson. Icon and text on every tab. The lexicon lives in the « Fiches » tab. */
const TABS = [
  { to: '/', icon: '🧭', label: 'Parcours' },
  { to: '/fiches', icon: '🗂️', label: 'Fiches', also: ['/lexique'] },
  { to: '/stats', icon: '📊', label: 'Stats' },
] as const
const route = useRoute()
const isOn = (t: typeof TABS[number]) => route.path === t.to || ('also' in t && (t.also as readonly string[]).includes(route.path))
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
      <span class="ic" aria-hidden="true">{{ t.icon }}</span>
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
.tab .ic { font-size: 22px; line-height: 1; filter: grayscale(1); opacity: .7; }
/* Current tab: colour, a bar above it and the full-colour icon — not colour alone. */
.tab.on { color: var(--primary); border-top-color: var(--primary); }
.tab.on .ic { filter: none; opacity: 1; }
</style>
