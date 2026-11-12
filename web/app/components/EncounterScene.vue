<script setup lang="ts">
/**
 * Two vessels seen from above: mine at the bottom heading up, the other at a bearing with its heading,
 * dashed routes ahead of both, optional wind arrow and narrow channel. Every vessel is labelled in text.
 */
import type { EncounterVessel } from '~/courses/types'

const props = defineProps<{
  me: EncounterVessel
  other: EncounterVessel
  bearing: number
  heading: number
  wind?: number
  channel?: boolean
}>()

const ME = { x: 150, y: 150 }
const DIST = 105
const rad = (d: number) => (d * Math.PI) / 180

const pos = computed(() => ({
  x: ME.x + DIST * Math.sin(rad(props.bearing)),
  y: ME.y - DIST * Math.cos(rad(props.bearing)),
}))

const LABELS: Record<EncounterVessel, string> = {
  power: 'Navire à moteur', sail: 'Voilier', fishing: 'Chalutier en pêche', nuc: 'Non maître de sa manœuvre', big: 'Cargo',
}

function hull(kind: EncounterVessel): string {
  const L = kind === 'big' ? 34 : 18
  const W = kind === 'big' ? 9 : 7
  return `0,${-L} ${W},${-L / 3} ${W},${L} ${-W},${L} ${-W},${-L / 3}`
}

/** Sail on the side away from the wind (leeward), given the boat heading. */
function sail(heading: number): string | null {
  if (props.wind === undefined) return '0,-10 9,10 0,10'
  const rel = ((props.wind - heading) % 360 + 360) % 360
  const side = rel < 180 ? -1 : 1
  return `0,-10 ${9 * side},10 0,10`
}

const routeEnd = (x: number, y: number, h: number, len = 80) =>
  ({ x: x + len * Math.sin(rad(h)), y: y - len * Math.cos(rad(h)) })
const myRoute = routeEnd(ME.x, ME.y, 0, 130)
const otherRoute = computed(() => routeEnd(pos.value.x, pos.value.y, props.heading))

const labelY = computed(() => (pos.value.y < 80 ? pos.value.y + 46 : pos.value.y - 34))
/** Keep the label inside the picture. */
const labelX = computed(() => Math.min(212, Math.max(88, pos.value.x)))
const wind = computed(() => {
  if (props.wind === undefined) return null
  // Arrow drawn where the wind blows to, in the bottom-left corner.
  const cx = 42
  const cy = 246
  const from = routeEnd(cx, cy, props.wind, 22)
  const to = routeEnd(cx, cy, props.wind + 180, 22)
  return { from, to }
})
</script>

<template>
  <svg
class="encounter" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img"
       :aria-label="`Vu du dessus : moi (${LABELS[me]}) et un ${LABELS[other].toLowerCase()}`">
    <defs>
      <marker id="arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" class="arrow" />
      </marker>
    </defs>
    <rect class="water" x="0" y="0" width="300" height="300" rx="16" />
    <g v-if="channel" class="channel">
      <line x1="118" y1="0" x2="118" y2="300" />
      <line x1="182" y1="0" x2="182" y2="300" />
      <text x="190" y="292">Chenal étroit</text>
    </g>

    <line :x1="ME.x" :y1="ME.y" :x2="myRoute.x" :y2="myRoute.y" class="route mine" />
    <line :x1="pos.x" :y1="pos.y" :x2="otherRoute.x" :y2="otherRoute.y" class="route" />

    <g :transform="`translate(${ME.x} ${ME.y})`">
      <polygon :points="hull(me)" class="boat mine" />
      <polygon v-if="me === 'sail'" :points="sail(0) ?? ''" class="sail" />
      <text y="38" class="label mine">Moi</text>
    </g>

    <g :transform="`translate(${pos.x} ${pos.y}) rotate(${heading})`">
      <polygon :points="hull(other)" class="boat" />
      <polygon v-if="other === 'sail'" :points="sail(heading) ?? ''" class="sail" />
      <path v-if="other === 'fishing'" d="M-4 18 L-10 40 M4 18 L10 40 M-10 40 L10 40" class="net" />
    </g>
    <text :x="labelX" :y="labelY" class="label">{{ LABELS[other] }}</text>

    <g v-if="wind" class="wind">
      <line :x1="wind.from.x" :y1="wind.from.y" :x2="wind.to.x" :y2="wind.to.y" marker-end="url(#arrow-head)" />
      <text x="42" y="288">Vent</text>
    </g>
  </svg>
</template>

<style scoped>
.encounter { width: 100%; height: auto; display: block; }
.water { fill: #CFE6F7; }
.channel line { stroke: #6E8597; stroke-width: 2; stroke-dasharray: 6 5; }
.channel text { font-size: 12px; fill: #2B3440; font-weight: 700; }
.route { stroke: #4A5059; stroke-width: 2; stroke-dasharray: 5 5; }
.route.mine { stroke: #1268BD; }
.boat { fill: #3A4250; }
.boat.mine { fill: #1268BD; }
.sail { fill: #FFFFFF; stroke: #4A5059; stroke-width: 1; }
.net { stroke: #3A4250; stroke-width: 1.5; fill: none; }
.label { font-size: 13px; font-weight: 800; fill: #2B3440; text-anchor: middle; }
.label.mine { fill: #0B4F92; }
.wind line { stroke: #2B3440; stroke-width: 3; }
.wind text { font-size: 12px; font-weight: 800; fill: #2B3440; text-anchor: middle; }
.arrow { fill: #2B3440; }
</style>
