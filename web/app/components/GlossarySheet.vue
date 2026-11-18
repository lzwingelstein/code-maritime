<script setup lang="ts">
/** Bottom sheet with the definition of a lexicon term. */
const { current, close } = useGlossary()
const closeBtn = ref<HTMLButtonElement | null>(null)
watch(current, async (t) => {
  if (!t) return
  await nextTick()
  closeBtn.value?.focus()
})
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="current" class="veil" @click.self="close">
    <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="gl-title">
      <p class="kicker"><UiIcon name="book" :size="16" /> Lexique</p>
      <h2 id="gl-title">{{ current.term }}</h2>
      <p class="def"><RichText :text="current.definition" :terms="false" /></p>
      <button ref="closeBtn" type="button" class="btn" @click="close">J’ai compris</button>
      <NuxtLink to="/lexique" class="all" @click="close">Voir tout le lexique</NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.veil { position: fixed; inset: 0; z-index: 50; display: flex; align-items: flex-end; justify-content: center; background: rgb(0 0 0 / .45); }
.sheet {
  width: 100%; max-width: 560px; padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
  border-radius: 20px 20px 0 0; background: var(--surface); color: var(--ink); text-align: left;
}
.kicker { margin: 0; font-size: 13px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: .06em; }
.sheet h2 { margin: 4px 0 8px; font-size: 21px; font-weight: 700; }
.def { margin: 0 0 16px; font-size: 17px; line-height: 1.45; }
.sheet .btn { display: block; width: 100%; }
.all { display: flex; align-items: center; justify-content: center; min-height: 44px; margin-top: 4px; color: var(--primary); font-weight: 600; }
</style>
