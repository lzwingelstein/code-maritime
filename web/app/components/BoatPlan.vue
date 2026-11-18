<script setup lang="ts">
/**
 * A boat seen from above (or from the side for `waterline`), with one part to point at.
 * In questions (`labelled` off) the part is outlined and marked « ? » so the name is not given away;
 * on cards (`labelled` on) every part is named in text, never by colour alone.
 */
import type { BoatPart } from '~/courses/types'

const props = defineProps<{ part: BoatPart, labelled?: boolean }>()

const CX = 150
const BEAM_Y = 132
const HULL = 'M150,46 C186,78 184,150 179,212 L121,212 C116,150 114,78 150,46 Z'
const rad = (d: number) => (d * Math.PI) / 180
/** Point at a bearing (degrees clockwise from the bow) and a distance from the beam centre. */
const at = (bearing: number, r: number) => ({ x: CX + r * Math.sin(rad(bearing)), y: BEAM_Y - r * Math.cos(rad(bearing)) })
function wedge(from: number, to: number, r: number) {
  const a = at(from, r)
  const b = at(to, r)
  return `M${CX},${BEAM_Y} L${a.x},${a.y} A${r},${r} 0 0 1 ${b.x},${b.y} Z`
}
const top = computed(() => props.part !== 'waterline' && props.part !== 'draft')
const wind = computed(() => (props.part === 'tack-starboard' ? 'starboard' : props.part === 'tack-port' ? 'port' : null))
/** Where the « ? » goes. */
const mark = computed(() => ({
  'bow': { x: 150, y: 74 }, 'stern': { x: 150, y: 198 }, 'port': { x: 128, y: 132 }, 'starboard': { x: 172, y: 132 },
  'abeam': { x: 262, y: 132 }, 'abaft': { x: 238, y: 222 }, 'tack-starboard': { x: 150, y: 24 }, 'tack-port': { x: 150, y: 24 },
  'waterline': { x: 262, y: 128 }, 'draft': { x: 262, y: 166 },
} as const)[props.part])
</script>

<template>
  <svg viewBox="0 0 300 250" class="plan" role="img" :aria-label="labelled ? undefined : 'Bateau, une partie marquée d’un point d’interrogation'">
    <template v-if="top">
      <!-- Highlighted zones, drawn under the hull outline -->
      <defs>
        <clipPath id="hull-clip"><path :d="HULL" /></clipPath>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" class="hl-fill" /><line x1="0" y1="0" x2="0" y2="8" class="hl-line" />
        </pattern>
      </defs>
      <path v-if="part === 'abaft'" :d="wedge(112.5, 247.5, 118)" fill="url(#hatch)" class="hl-edge" />
      <path :d="HULL" class="hull" />
      <g clip-path="url(#hull-clip)">
        <rect v-if="part === 'bow'" x="100" y="40" width="100" height="52" fill="url(#hatch)" />
        <rect v-if="part === 'stern'" x="100" y="180" width="100" height="40" fill="url(#hatch)" />
        <rect v-if="part === 'port' && !labelled" x="100" y="40" width="50" height="180" fill="url(#hatch)" />
        <rect v-if="part === 'starboard' && !labelled" x="150" y="40" width="50" height="180" fill="url(#hatch)" />
      </g>
      <path :d="HULL" class="hull-line" />
      <line x1="150" y1="58" x2="150" y2="206" class="axis" />
      <!-- Beam line -->
      <line v-if="part === 'abeam' || part === 'abaft'" x1="18" :y1="BEAM_Y" x2="282" :y2="BEAM_Y" :class="part === 'abeam' ? 'beam hl' : 'beam'" />
      <!-- Wind and sail -->
      <template v-if="wind">
        <line x1="150" y1="70" x2="150" y2="150" class="mast" />
        <path :d="wind === 'starboard' ? 'M150,72 Q128,112 146,150' : 'M150,72 Q172,112 154,150'" class="sail" />
        <g :transform="wind === 'starboard' ? 'translate(268,100)' : 'translate(32,100) scale(-1,1)'">
          <line x1="0" y1="0" x2="-44" y2="0" class="wind" />
          <path d="M-44,0 l12,-8 v16 Z" class="wind-head" />
        </g>
        <text :x="wind === 'starboard' ? 246 : 54" y="86" class="lab" text-anchor="middle">vent</text>
      </template>
      <!-- Labels -->
      <template v-if="labelled">
        <text v-if="part === 'bow'" x="150" y="32" class="lab" text-anchor="middle">Avant (proue)</text>
        <text v-if="part === 'stern'" x="150" y="234" class="lab" text-anchor="middle">Arrière (poupe)</text>
        <template v-if="part === 'port' || part === 'starboard'">
          <circle cx="116" cy="106" r="6" class="red" /><circle cx="184" cy="106" r="6" class="green" />
          <text x="58" y="128" class="lab" text-anchor="middle">Bâbord</text><text x="58" y="144" class="sub" text-anchor="middle">gauche</text><text x="58" y="158" class="sub" text-anchor="middle">feu rouge</text>
          <text x="242" y="128" class="lab" text-anchor="middle">Tribord</text><text x="242" y="144" class="sub" text-anchor="middle">droite</text><text x="242" y="158" class="sub" text-anchor="middle">feu vert</text>
          <text x="150" y="32" class="sub" text-anchor="middle">↑ avant</text>
        </template>
        <text v-if="part === 'abeam'" x="246" y="122" class="lab" text-anchor="middle">Travers</text>
        <text v-if="part === 'abaft'" x="236" y="236" class="lab" text-anchor="middle">Sur l’arrière du travers</text>
        <text v-if="wind" x="150" y="238" class="lab" text-anchor="middle">{{ wind === 'starboard' ? 'Tribord amures' : 'Bâbord amures' }}</text>
      </template>
    </template>

    <!-- Side view: waterline and draft -->
    <template v-else>
      <rect x="0" y="128" width="300" height="122" class="sea" />
      <path d="M40,96 L262,96 L248,142 L210,156 L90,156 L56,142 Z" class="hull" />
      <path d="M140,156 L150,184 L170,184 L176,156 Z" class="hull" />
      <line x1="24" y1="128" x2="282" y2="128" :class="part === 'waterline' ? 'beam hl' : 'beam'" />
      <g v-if="part === 'draft'">
        <line x1="236" y1="128" x2="236" y2="184" class="beam hl" />
        <line x1="166" y1="184" x2="246" y2="184" class="axis" />
      </g>
      <template v-if="labelled">
        <text v-if="part === 'waterline'" x="150" y="118" class="lab" text-anchor="middle">Ligne de flottaison</text>
        <text v-if="part === 'draft'" x="150" y="214" class="lab" text-anchor="middle">Tirant d’eau</text>
      </template>
    </template>

    <g v-if="!labelled" class="q">
      <circle :cx="mark.x" :cy="mark.y" r="13" /><text :x="mark.x" :y="mark.y + 5" text-anchor="middle">?</text>
    </g>
  </svg>
</template>

<style scoped>
.plan { width: 100%; max-width: 260px; height: auto; display: block; margin: 0 auto; }
.hull { fill: var(--surface); stroke: var(--ink); stroke-width: 3; }
.hull-line { fill: none; stroke: var(--ink); stroke-width: 3; }
.axis { stroke: var(--ink-mute); stroke-width: 2; stroke-dasharray: 5 5; }
.hl-fill { fill: var(--primary-soft); }
.hl-line { stroke: var(--primary); stroke-width: 3; }
.hl-edge { stroke: var(--primary); stroke-width: 2; }
.beam { stroke: var(--ink-mute); stroke-width: 2; stroke-dasharray: 6 5; }
.beam.hl { stroke: var(--primary); stroke-width: 4; stroke-dasharray: none; }
.mast { stroke: var(--ink); stroke-width: 3; }
.sail { fill: var(--primary-soft); stroke: var(--primary); stroke-width: 2; }
.wind { stroke: var(--ink); stroke-width: 4; }
.wind-head { fill: var(--ink); }
.sea { fill: var(--tip-soft); }
.red { fill: var(--ko-fill); } .green { fill: var(--ok-fill); }
.lab { font-size: 15px; font-weight: 800; fill: var(--ink); }
.sub { font-size: 12px; font-weight: 600; fill: var(--ink-mute); }
.q circle { fill: var(--primary); }
.q text { font-size: 17px; font-weight: 900; fill: #fff; }
</style>
