<script setup lang="ts">
/** Plays a mark's light rhythm on a night sea, twice, with a replay button. */
import { MARKS, type MarkId } from '~/courses/balisage/marks'

const props = defineProps<{ markId: MarkId }>()

const LAMP = { white: '#FFF6CC', red: '#FF3B30', green: '#34E06A', yellow: '#FFD60A' } as const

const lit = ref(false)
const playing = ref(false)
let token = 0

const light = computed(() => MARKS[props.markId].light)
const colour = computed(() => LAMP[light.value.colour])
const period = computed(() => Math.round(light.value.sequence.reduce((a, b) => a + b, 0) / 1000))

// Fixed star field: no randomness in render.
const stars = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 55,
  opacity: 0.25 + ((i * 7) % 10) / 16,
}))

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function play() {
  const mine = ++token
  playing.value = true
  lit.value = false
  await sleep(500)
  for (let cycle = 0; cycle < 2; cycle++) {
    for (const [i, ms] of light.value.sequence.entries()) {
      if (mine !== token) return
      lit.value = i % 2 === 0
      await sleep(ms)
    }
  }
  if (mine === token) {
    lit.value = false
    playing.value = false
  }
}

watch(() => props.markId, play)
onMounted(play)
onBeforeUnmount(() => { token++ })
</script>

<template>
  <div class="night" role="img" :aria-label="`Feu de nuit, période ${period} secondes`">
    <i v-for="(s, i) in stars" :key="i" class="star" :style="{ left: s.left + '%', top: s.top + '%', opacity: s.opacity }" />
    <span class="lamp" :class="{ on: lit }" :style="{ '--lamp': colour }" />
    <span class="refl" :class="{ on: lit }" :style="{ '--lamp': colour }" />
    <span class="period">Période {{ period }} s</span>
    <button class="replay" type="button" @click="play">
      ↻ {{ playing ? 'Recommencer' : 'Rejouer' }}
    </button>
  </div>
</template>

<style scoped>
.night {
  position: relative; width: 100%; height: 210px; border-radius: 18px; overflow: hidden;
  background: linear-gradient(var(--night-top) 0%, var(--night-mid) 62%, var(--night-sea) 62%, var(--night-deep) 100%);
}
.star { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: var(--night-text); }
.lamp {
  position: absolute; left: 50%; top: 44%; width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 50%;
  background: var(--lamp); box-shadow: 0 0 18px 8px var(--lamp), 0 0 60px 20px color-mix(in srgb, var(--lamp) 50%, transparent);
  opacity: 0;
}
.refl {
  position: absolute; left: 50%; top: 70%; width: 14px; height: 40px; margin-left: -7px; border-radius: 50%;
  background: var(--lamp); filter: blur(6px); opacity: 0;
}
.lamp.on { opacity: 1; }
.refl.on { opacity: .5; }
.period { position: absolute; left: 12px; bottom: 14px; color: var(--night-text); font-size: 13px; }
.replay {
  position: absolute; right: 8px; bottom: 8px; min-height: 44px; padding: 0 16px; border: 0; border-radius: 99px;
  background: rgba(255, 255, 255, .16); color: var(--night-text); font-size: 14px; font-weight: 800;
}
</style>
