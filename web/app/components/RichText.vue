<script setup lang="ts">
/** Renders course text where **words** are bold, without v-html. */
const props = defineProps<{ text: string }>()
const parts = computed(() => props.text.split('**').map((t, i) => ({ t, bold: i % 2 === 1 })))
</script>

<template>
  <span><template v-for="(p, i) in parts" :key="i"><strong v-if="p.bold">{{ p.t }}</strong><template v-else>{{ p.t }}</template></template></span>
</template>
