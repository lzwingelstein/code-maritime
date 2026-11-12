<script setup lang="ts">
/**
 * A vessel at night (only the lights you would see from that aspect, optional faint silhouette)
 * or by day (silhouette and its day shapes, seen from the side).
 * Light and shape colours are content (real signal colours), not UI theme.
 */
import { VESSELS, visibleLights, type Aspect, type DayShape, type ShipLight, type VesselId } from '~/courses/navires/vessels'

const props = defineProps<{ vesselId: VesselId, aspect: Aspect, mode: 'night' | 'day', silhouette?: boolean }>()

const LIGHT = { white: '#FFF6CC', red: '#FF453A', green: '#32D74B' } as const
const CX = 150
const WATER = 120
const HALF = 95
const UNIT = 20
const y = (h: number) => WATER - 4 - h * UNIT

const vessel = computed(() => VESSELS[props.vesselId])
const aspect = computed<Aspect>(() => (props.mode === 'day' ? 'starboard' : props.aspect))
const side = computed(() => aspect.value === 'starboard' || aspect.value === 'port')
/** Bow to the right when we see the starboard side. */
const dir = computed(() => (aspect.value === 'port' ? -1 : 1))

function lightX(l: ShipLight): number {
  if (side.value) return CX + dir.value * l.pos * HALF
  if (l.kind === 'side' && aspect.value === 'ahead') return CX + (l.colour === 'red' ? 16 : -16)
  return CX
}

const lights = computed(() => visibleLights(props.vesselId, aspect.value)
  .map(l => ({ x: lightX(l), y: y(l.height), fill: LIGHT[l.colour] })))

const mastPos = computed(() => {
  const tall = vessel.value.lights.filter(l => l.kind !== 'side' && l.kind !== 'stern')
  return tall.length ? Math.max(...tall.map(l => l.pos)) : 0.2
})
const mastTop = computed(() => {
  const heights = vessel.value.lights.map(l => l.height)
  return props.mode === 'day' ? 5 : Math.max(2.6, ...heights) + 0.4
})
const mastX = computed(() => (side.value ? CX + dir.value * mastPos.value * HALF : CX))

const hull = computed(() => {
  const d = dir.value
  const sx = (pos: number) => CX + d * pos * HALF
  if (side.value) {
    const deck = vessel.value.hull === 'sail' ? 0.5 : 0.9
    return `${sx(-0.98)},${y(deck)} ${sx(1.05)},${y(deck + 0.2)} ${sx(0.88)},${WATER + 2} ${sx(-0.95)},${WATER + 2}`
  }
  return `${CX - 26},${y(0.8)} ${CX + 26},${y(0.8)} ${CX + 18},${WATER + 2} ${CX - 18},${WATER + 2}`
})
const cabin = computed(() => {
  if (vessel.value.hull === 'sail' || !side.value) return null
  const a = CX + dir.value * -0.1 * HALF
  const b = CX + dir.value * 0.4 * HALF
  return { x: Math.min(a, b), y: y(2.2), w: Math.abs(b - a), h: y(0.9) - y(2.2) }
})
const sail = computed(() => {
  if (vessel.value.hull !== 'sail') return null
  const top = y(mastTop.value - 0.2)
  if (!side.value) return `${CX},${top} ${CX + 3},${y(0.9)} ${CX - 3},${y(0.9)}`
  const aft = CX + dir.value * -0.75 * HALF
  return `${mastX.value},${top} ${mastX.value},${y(0.9)} ${aft},${y(0.9)}`
})

type Shape = { tag: 'circle' | 'polygon' | 'rect', attrs: Record<string, number | string> }
function shape(s: DayShape, cx: number, top: number): Shape {
  switch (s) {
    case 'ball': return { tag: 'circle', attrs: { cx, cy: top + 8, r: 8 } }
    case 'diamond': return { tag: 'polygon', attrs: { points: `${cx},${top} ${cx + 8},${top + 8} ${cx},${top + 16} ${cx - 8},${top + 8}` } }
    case 'cylinder': return { tag: 'rect', attrs: { x: cx - 7, y: top, width: 14, height: 18 } }
    case 'cone-up': return { tag: 'polygon', attrs: { points: `${cx},${top} ${cx + 9},${top + 16} ${cx - 9},${top + 16}` } }
    case 'cone-down': return { tag: 'polygon', attrs: { points: `${cx - 9},${top} ${cx + 9},${top} ${cx},${top + 16}` } }
  }
}
const shapes = computed<Shape[]>(() => {
  if (props.mode !== 'day') return []
  const list = vessel.value.shapes ?? []
  // Hoisted on a halyard just ahead of the mast, top to bottom.
  const x = mastX.value + 14 * dir.value
  return list.map((s, i) => shape(s, x, y(mastTop.value) + 4 + i * 21))
})

const showHull = computed(() => props.mode === 'day' || props.silhouette)
const blurId = useId()
const label = computed(() => (props.mode === 'day' ? 'Navire de jour avec ses marques' : 'Feux d’un navire de nuit'))
</script>

<template>
  <svg class="ship" :class="mode" :viewBox="mode === 'night' ? '35 0 230 138' : '0 0 300 160'" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="label">
    <defs>
      <filter :id="blurId" x="-2" y="-2" width="5" height="5"><feGaussianBlur stdDeviation="4" /></filter>
    </defs>
    <rect class="sky" x="0" y="0" width="300" height="160" />
    <rect class="sea" x="0" :y="WATER" width="300" :height="160 - WATER" />
    <g v-if="showHull" class="hull">
      <line :x1="mastX" :y1="y(0.8)" :x2="mastX" :y2="y(mastTop)" stroke-width="2.5" />
      <polygon v-if="sail" :points="sail" class="sail" />
      <rect v-if="cabin" :x="cabin.x" :y="cabin.y" :width="cabin.w" :height="cabin.h" rx="2" />
      <polygon :points="hull" />
    </g>
    <component :is="s.tag" v-for="(s, i) in shapes" :key="'s' + i" v-bind="s.attrs" class="dayshape" />
    <g v-if="mode === 'night'">
      <circle v-for="(l, i) in lights" :key="'g' + i" :cx="l.x" :cy="l.y" r="12" :fill="l.fill" opacity=".6" :filter="`url(#${blurId})`" />
      <circle v-for="(l, i) in lights" :key="'l' + i" :cx="l.x" :cy="l.y" r="5.5" :fill="l.fill" />
    </g>
  </svg>
</template>

<style scoped>
.ship { width: 100%; height: auto; border-radius: 16px; display: block; }
.night .sky { fill: var(--night-mid); }
.night .sea { fill: var(--night-deep); }
.night .hull { fill: #8FA3BF; stroke: #8FA3BF; opacity: .22; }
.day .sky { fill: #CFE6F7; }
.day .sea { fill: #4F8FC0; }
.day .hull { fill: #3A4250; stroke: #3A4250; }
.day .sail { fill: #F4F1EA; stroke: #9AA3AE; stroke-width: 1; }
.dayshape { fill: #111418; }
</style>
