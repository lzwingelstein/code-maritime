<script setup lang="ts">
/**
 * Draws a pillar buoy of the region A system, or only its topmark.
 * Signal colours are the real ones of the marks (content, not UI theme).
 */
import { drawnMark, type ExtraMarkId, type MarkId, type SignalColour, type Topmark } from '~/courses/balisage/marks'

const props = defineProps<{ markId: MarkId | ExtraMarkId, topOnly?: boolean }>()

const SIGNAL: Record<SignalColour, string> = {
  red: '#E5322D', green: '#1FA64F', yellow: '#F7C631', black: '#1E2228', white: '#FFFFFF', blue: '#1F5FC4',
}

type Shape = { tag: 'polygon' | 'rect' | 'circle' | 'path', attrs: Record<string, string | number> }

const cone = (dir: 'up' | 'down', y0: number, y1: number, fill: string): Shape => ({
  tag: 'polygon',
  attrs: { fill, points: dir === 'up' ? `60,${y0} 45,${y1} 75,${y1}` : `45,${y0} 75,${y0} 60,${y1}` },
})

function topmark(t: Topmark, colour?: SignalColour): Shape[] {
  const k = SIGNAL.black
  switch (t) {
    case 'can': return [{ tag: 'rect', attrs: { x: 48, y: 30, width: 24, height: 30, rx: 2, fill: SIGNAL[colour ?? 'red'] } }]
    case 'cone': return [cone('up', 28, 60, SIGNAL[colour ?? 'green'])]
    case 'north': return [cone('up', 8, 33, k), cone('up', 37, 62, k)]
    case 'south': return [cone('down', 8, 33, k), cone('down', 37, 62, k)]
    case 'east': return [cone('up', 8, 33, k), cone('down', 37, 62, k)]
    case 'west': return [cone('down', 8, 33, k), cone('up', 37, 62, k)]
    case 'two-spheres': return [
      { tag: 'circle', attrs: { cx: 60, cy: 21, r: 11, fill: k } },
      { tag: 'circle', attrs: { cx: 60, cy: 48, r: 11, fill: k } },
    ]
    case 'sphere': return [{ tag: 'circle', attrs: { cx: 60, cy: 46, r: 13, fill: SIGNAL.red } }]
    case 'plus': return [
      { tag: 'rect', attrs: { x: 56, y: 26, width: 8, height: 34, fill: SIGNAL.yellow, stroke: k, 'stroke-width': 1.5 } },
      { tag: 'rect', attrs: { x: 45, y: 37, width: 30, height: 8, fill: SIGNAL.yellow, stroke: k, 'stroke-width': 1.5 } },
    ]
    case 'none': return []
    case 'x': {
      const d = 'M47 33 L73 59 M73 33 L47 59'
      return [
        { tag: 'path', attrs: { d, stroke: k, 'stroke-width': 11, 'stroke-linecap': 'round' } },
        { tag: 'path', attrs: { d, stroke: SIGNAL.yellow, 'stroke-width': 6, 'stroke-linecap': 'round' } },
      ]
    }
  }
}

const BODIES = {
  pillar: '42,80 78,80 90,165 30,165',
  can: '30,95 90,95 90,165 30,165',
  cone: '60,72 92,165 28,165',
  sphere: '',
} as const

const mark = computed(() => drawnMark(props.markId))
const kind = computed(() => mark.value.body ?? 'pillar')
const outline = computed(() => BODIES[kind.value])

const body = computed<Shape[]>(() => {
  const m = mark.value
  if (m.stripes) {
    return Array.from({ length: 6 }, (_, i) => ({
      tag: 'rect' as const,
      attrs: { x: 30 + i * 10, y: 80, width: 10.5, height: 85, fill: SIGNAL[m.stripes![i % 2]!] },
    }))
  }
  let y = 80
  return (m.bands ?? []).map(([c, f]) => {
    const shape: Shape = { tag: 'rect', attrs: { x: 18, y, width: 84, height: 85 * f + 0.5, fill: SIGNAL[c] } }
    y += 85 * f
    return shape
  })
})

const shapes = computed(() => topmark(mark.value.topmark, mark.value.topmarkColour))
const clipId = useId()
</script>

<template>
  <svg
    class="buoy"
    :viewBox="topOnly ? '28 2 64 66' : '0 0 120 200'"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line v-if="mark.topmark !== 'none'" x1="60" y1="52" x2="60" y2="82" stroke="#3A3F47" stroke-width="4" />
    <component :is="s.tag" v-for="(s, i) in shapes" :key="'t' + i" v-bind="s.attrs" />
    <template v-if="!topOnly">
      <defs>
        <clipPath :id="clipId">
          <circle v-if="kind === 'sphere'" cx="60" cy="128" r="40" />
          <polygon v-else :points="outline" />
        </clipPath>
      </defs>
      <g :clip-path="`url(#${clipId})`">
        <component :is="s.tag" v-for="(s, i) in body" :key="'b' + i" v-bind="s.attrs" />
        <polygon points="30,80 50,80 46,165 20,165" fill="rgba(255,255,255,.16)" />
      </g>
      <circle v-if="kind === 'sphere'" cx="60" cy="128" r="40" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.5" />
      <polygon v-else :points="outline" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.5" />
      <rect x="24" y="162" width="72" height="11" rx="4" fill="#4A5059" />
      <path d="M0 176 Q15 168 30 176 T60 176 T90 176 T120 176 V200 H0Z" fill="#2B7BB9" />
      <path d="M0 184 Q15 178 30 184 T60 184 T90 184 T120 184 V200 H0Z" fill="#1E6299" />
    </template>
  </svg>
</template>
