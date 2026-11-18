<script setup lang="ts">
import { TERMS } from '~/glossary/terms'

const sorted = [...TERMS].sort((a, b) => a.term.localeCompare(b.term, 'fr'))
</script>

<template>
  <div class="shell">
    <header class="top">
      <h1>Fiches</h1>
    </header>
    <main class="body">
      <SheetsSwitch class="sw" />
      <p class="lead">Les mots du permis expliqués simplement. Dans les leçons, touche un mot <span class="u">souligné en pointillés</span> pour voir sa définition.</p>
      <dl>
        <template v-for="t in sorted" :key="t.id">
          <dt :id="t.id">{{ t.term }}</dt>
          <dd><RichText :text="t.definition" :terms="false" /></dd>
        </template>
      </dl>
    </main>
  </div>
</template>

<style scoped>
.top {
  position: sticky; top: 0; z-index: 5; display: flex; align-items: center; min-height: 56px; padding: 8px 12px;
  background: var(--bg);
}
.top h1 { flex: 1; margin: 0; font-size: 19px; font-weight: 700; text-align: center; }
.sw { margin-bottom: 14px; }
.body { padding: 14px 16px 40px; }
.lead { margin: 0 0 16px; font-size: 15px; color: var(--ink-mute); line-height: 1.45; }
.u { text-decoration: underline dotted var(--primary); text-decoration-thickness: 2px; text-underline-offset: 3px; }
dl { margin: 0; }
dt { margin-top: 16px; font-size: 17px; font-weight: 700; }
dd { margin: 4px 0 0; padding-bottom: 14px; border-bottom: 2px solid var(--line); font-size: 15px; line-height: 1.45; }
</style>
