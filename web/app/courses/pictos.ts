/**
 * Line pictograms for course sheets (drawn by components/CardPicto.vue): SVG paths on a 24 px grid,
 * an optional short text inside. Content, not UI chrome: the UI icons live in components/UiIcon.vue.
 */
export interface Picto {
  paths: readonly string[]
  text?: string
  textY?: number
  textSize?: number
}

const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`
const wave = (y: number) => `M2 ${y}c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0`

export const PICTOS = {
  wind: { paths: ['M3 8h10a3 3 0 1 0-3-3', 'M3 12h15a3 3 0 1 1-3 3', 'M3 16h7'] },
  gauge: { paths: ['M4 17a8 8 0 1 1 16 0', 'M12 17l4-5', 'M8 10l.7.7', 'M12 8.5v1', 'M16 10l-.7.7', 'M4 20h16'] },
  alert: { paths: ['M12 3.5l9.5 16.5h-19z', 'M12 10v4.5', 'M12 17.2v.3'] },
  antenna: { paths: ['M12 13v8', 'M8 21h8', 'M8.5 9.5a5 5 0 0 1 7 0', 'M5.5 6.5a9 9 0 0 1 13 0', circle(12, 12.5, 0.6)] },
  waves: { paths: [wave(7), wave(12), wave(17)] },
  question: { paths: [circle(12, 12, 9), 'M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7', 'M12 16.8v.2'] },
  flare: { paths: ['M10 11h4v10h-4z', 'M12 11V8.5', 'M12 3c1.5 1.2 2 3 0 5c-2-2-1.5-3.8 0-5z', 'M7 5.5L5.5 4', 'M17 5.5L18.5 4', 'M6.5 9.5H5', 'M17.5 9.5H19'] },
  sos: { paths: ['M3 7h18v10H3z'], text: 'SOS', textY: 14, textSize: 6 },
  trash: { paths: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 13h10l1-13', 'M10 11v6', 'M14 11v6'] },
  droplet: { paths: ['M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z', 'M9 15a3 3 0 0 0 3 3'] },
  brush: { paths: ['M4 4h12v5H4z', 'M16 6.5h3v5h-7v3', 'M11 14.5h2v6.5h-2z'] },
  hook: { paths: [circle(16, 4, 1.5), 'M16 5.5V14a6 6 0 0 1-12 0v-2', 'M4 12l3 2.5'] },
  mask: { paths: ['M3 9h15v5a3 3 0 0 1-3 3h-2l-1.5-2h-3L7 17H6a3 3 0 0 1-3-3z', 'M20.5 15V5', 'M20.5 5h-2'] },
  map: { paths: ['M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z', 'M9 4v14', 'M15 6v14'] },
  dividers: { paths: [circle(12, 4.5, 1.5), 'M11.2 5.8L6 21', 'M12.8 5.8L18 21', 'M8.5 14h7'] },
  tide: { paths: ['M3 21h18', 'M3 3v18', 'M5 12c2.3-7 4.7-7 7 0s4.7 7 7 0'] },
  steps: { paths: ['M3 21h18', 'M3 3v18', 'M5 19h2.5v-1.5H10V15h2.5v-3.5H15V8h2.5V6.5H20'] },
  radio: { paths: ['M4 9h16v11H4z', 'M7 9l9-5', circle(8.5, 14.5, 2), 'M13.5 13h3.5', 'M13.5 16h3.5'] },
  swap: { paths: ['M4 8h15', 'M16 5l3 3-3 3', 'M20 16H5', 'M8 13l-3 3 3 3'] },
  idcard: { paths: ['M3 5h18v14H3z', circle(9, 10, 2), 'M5.5 16c.5-2 2-3 3.5-3s3 1 3.5 3', 'M14.5 9.5h4', 'M14.5 13h4'] },
  helicopter: { paths: ['M3 4.5h17', 'M12 4.5V8', 'M6 8h9a4 4 0 0 1 0 8H9a3 3 0 0 1-3-3z', 'M19 12h2.5', 'M21.5 10v4', 'M9 16l-1 3', 'M14 16l1 3', 'M5.5 19h12'] },
  megaphone: { paths: ['M3 10v4h3l9 5V5l-9 5z', 'M6 14l1.5 5h2.5l-1-4.5', 'M18 9a4 4 0 0 1 0 6'] },
  abc: { paths: ['M3 6h18v12H3z'], text: 'ABC', textY: 14, textSize: 6 },
  english: { paths: ['M4 4h16v11H10l-4 4v-4H4z'], text: 'EN', textY: 11.6, textSize: 6 },
  document: { paths: ['M6 3h8l4 4v14H6z', 'M14 3v4h4', 'M9 12h6', 'M9 16h6'] },
  captain: { paths: ['M2.5 10.5c0-3.3 4.3-6 9.5-6s9.5 2.7 9.5 6c0 1.2-1.8 2.1-4.5 2.4H7c-2.7-.3-4.5-1.2-4.5-2.4z', 'M6.5 12.9h11v3.6h-11z', 'M6.5 16.5c2 3.2 9 3.2 11 0', 'M12 6.6v3.6', 'M10.6 7.5h2.8', 'M10.2 9.2c.5 1.2 3.1 1.2 3.6 0'] },
  tag: { paths: ['M3 3h8l10 10-8 8L3 11z', circle(7.5, 7.5, 1.2)] },
  fuel: { paths: ['M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16', 'M3 21h12', 'M7 7h4v4H7z', 'M14 10h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3'] },
  ban: { paths: ['M10 3h4', 'M10.5 3v4c-1.5 1-2.5 2.5-2.5 4.5V21h8v-9.5c0-2-1-3.5-2.5-4.5V3', 'M3.5 3.5l17 17'] },
  tow: { paths: [wave(19), 'M13 13.5h8l-1.5 2.5H14z', 'M13 14L5 10', circle(4.5, 6, 1.3), 'M4.5 7.5V13', 'M3 16h3'] },
  trafficLight: { paths: ['M8 2.5h8v19H8z', circle(12, 7, 1.7), circle(12, 12, 1.7), circle(12, 17, 1.7)] },
  turn: { paths: ['M9 21V12a4 4 0 0 1 4-4h6', 'M16 5l3 3-3 3'] },
  lanes: { paths: ['M3 3v18', 'M21 3v18', 'M12 3v3', 'M12 9.5v5', 'M12 18v3', 'M7.5 18V6', 'M5.5 8l2-2 2 2', 'M16.5 6v12', 'M14.5 16l2 2 2-2'] },
  zones: { paths: ['M4 3c2 5 2 13 0 18', 'M8 12h12', 'M17 9l3 3-3 3', 'M8 9.5v5'] },
  vest: { paths: ['M8.5 3L4 6v15h6.5V9', 'M15.5 3L20 6v15h-6.5V9', 'M8.5 3c1 2 2 3 3.5 3s2.5-1 3.5-3', 'M4 14h6.5', 'M13.5 14H20'] },
  flashlight: { paths: ['M8 3h8v4l-2 3v11h-4V10L8 7z', 'M8 7h8', 'M12 13v2'] },
  toolbox: { paths: ['M3 9h18v11H3z', 'M8.5 9V5h7v4', 'M3 13.5h18', 'M10 12v3h4v-3'] },
  cord: { paths: [circle(6, 18, 3), 'M8.5 16c1-1 2 0 3-1s0-2 1-3 2 0 3-1 0-2 1-3', 'M16.5 4h4.5v4.5h-4.5z', 'M18.75 8.5V10'] },
  compass: { paths: [circle(12, 12, 9), 'M15.5 8.5l-2 5-5 2 2-5z'] },
  lifebuoy: { paths: [circle(12, 12, 9), circle(12, 12, 4), 'M5.6 5.6l3.6 3.6', 'M14.8 14.8l3.6 3.6', 'M18.4 5.6l-3.6 3.6', 'M9.2 14.8l-3.6 3.6'] },
} as const satisfies Record<string, Picto>

export type PictoName = keyof typeof PICTOS

/** A sheet picture drawn as a pictogram. */
export const picto = (name: PictoName) => ({ type: 'picto' as const, name })
