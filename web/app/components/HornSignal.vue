<script setup lang="ts">
/** A sound signal: played on show and on demand, and drawn as bars (short • / long ▬ / bell 🔔) for those who can't hear it. */
import type { HornNote } from '~/courses/types'

const props = defineProps<{ pattern: HornNote[], caption?: string }>()
const playing = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function play() {
  clearTimeout(timer)
  playing.value = true
  const ms = playHorn(props.pattern)
  timer = setTimeout(() => { playing.value = false }, ms)
}

const LABEL: Record<HornNote, string> = { short: 'bref', long: 'prolongé', bell: 'cloche' }
const spoken = computed(() => props.pattern.map(n => LABEL[n]).join(', '))

onMounted(play)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="horn" role="img" :aria-label="`Signal sonore : ${spoken}${caption ? `, ${caption}` : ''}`">
    <div class="bars" aria-hidden="true">
      <span v-for="(n, i) in pattern" :key="i" :class="['note', n]">{{ n === 'bell' ? '🔔' : '' }}</span>
    </div>
    <p class="legend">{{ spoken }}<template v-if="caption"> · {{ caption }}</template></p>
    <button type="button" class="replay" @click="play">
      🔊 {{ playing ? 'Lecture…' : 'Écouter' }}
    </button>
  </div>
</template>

<style scoped>
.horn {
  display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%;
  padding: 18px 12px 14px; border-radius: 18px; background: var(--tip-soft);
}
.bars { display: flex; align-items: center; gap: 10px; min-height: 28px; flex-wrap: wrap; justify-content: center; }
.note { display: inline-flex; align-items: center; justify-content: center; height: 18px; border-radius: 9px; background: var(--ink); }
.note.short { width: 18px; }
.note.long { width: 72px; }
.note.bell { width: auto; height: auto; background: none; font-size: 26px; }
.legend { margin: 0; font-size: 14px; color: var(--ink-mute); text-align: center; }
.replay {
  min-height: 44px; padding: 0 18px; border: 2px solid var(--line); border-radius: 99px;
  background: var(--surface); color: var(--primary); font-size: 15px; font-weight: 800;
}
</style>
