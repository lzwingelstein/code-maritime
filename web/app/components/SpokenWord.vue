<script setup lang="ts">
/** A radio-alphabet word, written and read aloud on demand (speech synthesis, when the browser has it). */
const props = defineProps<{ word: string }>()
const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window
function say() {
  if (!canSpeak) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(props.word)
  u.lang = 'en-GB'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}
</script>

<template>
  <div class="spoken">
    <span class="word display">{{ word }}</span>
    <button v-if="canSpeak" type="button" class="say" :aria-label="`Écouter « ${word} »`" @click="say">
      <UiIcon name="speaker" :size="22" /> Écouter
    </button>
  </div>
</template>

<style scoped>
.spoken { display: inline-flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px 22px; border-radius: 20px; background: var(--primary-soft); }
.word { font-size: 28px; font-weight: 600; color: var(--primary-shadow); }
.say { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 14px; border: 2px solid var(--primary-soft-line); border-radius: 22px; background: var(--surface); color: var(--primary); font-size: 15px; font-weight: 600; }
</style>
