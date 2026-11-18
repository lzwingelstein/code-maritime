<script setup lang="ts">
/**
 * Renders course text: **words** are bold, and lexicon terms are underlined buttons that open their
 * definition (no v-html). `terms: false` for texts inside another button.
 */
import { splitTerms } from '~/glossary/split'
import { TERMS } from '~/glossary/terms'

const props = withDefaults(defineProps<{ text: string, terms?: boolean }>(), { terms: true })
const { open } = useGlossary()

const parts = computed(() => {
  const seen = new Set<string>()
  return props.text.split('**').map((t, i) => {
    const segs = props.terms ? splitTerms(t, TERMS, seen) : [{ text: t }]
    for (const s of segs) if ('termId' in s && s.termId) seen.add(s.termId)
    return { bold: i % 2 === 1, segs }
  })
})
</script>

<template>
  <span><template v-for="(p, i) in parts" :key="i"><component :is="p.bold ? 'strong' : 'span'"><template v-for="(s, j) in p.segs" :key="j"><button v-if="s.termId" type="button" class="term" :aria-label="`${s.text} : voir la définition`" @click.stop="open(s.termId)">{{ s.text }}</button><template v-else>{{ s.text }}</template></template></component></template></span>
</template>

<style scoped>
.term {
  display: inline; padding: 0; border: 0; background: none; font: inherit; color: inherit; cursor: help;
  text-decoration: underline dotted var(--primary); text-decoration-thickness: 2px; text-underline-offset: 3px;
}
/* Enlarge the tap area without moving the text. */
.term { position: relative; }
.term::after { content: ""; position: absolute; inset: -10px -2px; }
</style>
