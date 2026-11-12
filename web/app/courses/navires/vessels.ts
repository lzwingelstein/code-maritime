/**
 * Lights and day shapes of vessels (COLREG / RIPAM), as asked in the French "permis côtier" exam.
 * Vessels are shown making way unless stated (anchored). Positions are for drawing:
 * pos runs from -1 (stern) to 1 (bow), height from the waterline up.
 */
export type VesselId =
  | 'power' | 'power50' | 'sail' | 'anchor' | 'trawler' | 'fishing' | 'pilot' | 'nuc' | 'ram' | 'cbd' | 'motorsail'
export type Aspect = 'ahead' | 'starboard' | 'port' | 'astern'
export type LightColour = 'white' | 'red' | 'green'
export type DayShape = 'ball' | 'diamond' | 'cylinder' | 'cone-up' | 'cone-down'

export interface ShipLight {
  /** masthead: forward 225°; side: red to port, green to starboard; stern: aft 135°; allround: 360°. */
  kind: 'masthead' | 'side' | 'stern' | 'allround'
  colour: LightColour
  pos: number
  height: number
}

export interface Vessel {
  id: VesselId
  name: string
  hull: 'power' | 'sail'
  lights: ShipLight[]
  /** Day shapes from top to bottom; null when the exam asks none. */
  shapes: DayShape[] | null
  /** Day shapes hoisted forward (anchor ball, motor-sailing cone) rather than on the mast. */
  shapesForward?: boolean
  /** Shown at night in the exam: false for a vessel only asked by day. */
  night: boolean
  intro: string
  statements: [string, boolean][]
}

export const ASPECTS: Aspect[] = ['ahead', 'starboard', 'port', 'astern']
export const ASPECT_LABELS: Record<Aspect, string> = {
  ahead: 'De face : il vient vers moi',
  starboard: 'Par son tribord',
  port: 'Par son bâbord',
  astern: 'Par l’arrière : il s’éloigne',
}

const sides = (pos: number, height: number): ShipLight[] => [
  { kind: 'side', colour: 'red', pos, height },
  { kind: 'side', colour: 'green', pos, height },
]
const stern = (height = 1): ShipLight => ({ kind: 'stern', colour: 'white', pos: -0.95, height })
const masthead = (pos: number, height: number): ShipLight => ({ kind: 'masthead', colour: 'white', pos, height })
/** All-round lights in a vertical line, given top to bottom. */
const allRound = (pos: number, top: number, ...colours: LightColour[]): ShipLight[] =>
  colours.map((colour, i) => ({ kind: 'allround', colour, pos, height: top - i * 0.8 }))

export const VESSELS: Record<VesselId, Vessel> = {
  power: {
    id: 'power', name: 'Navire à moteur', hull: 'power', night: true,
    lights: [masthead(0.3, 3), ...sides(0.1, 1.4), stern()], shapes: null,
    intro: 'Un **feu blanc de tête de mât** vers l’avant (225°), un **feu rouge à bâbord** et un **feu vert à tribord** (112,5° chacun), et un **feu blanc de poupe** vers l’arrière (135°).',
    statements: [
      ['En route, un navire à moteur montre un feu de tête de mât, ses feux de côté et son feu de poupe.', true],
      ['Le feu de poupe est rouge.', false],
      ['Si je vois son feu vert, je le vois par son tribord.', true],
    ],
  },
  power50: {
    id: 'power50', name: 'Navire à moteur de 50 m ou plus', hull: 'power', night: true,
    lights: [masthead(0.55, 2.6), masthead(-0.25, 3.6), ...sides(0.1, 1.4), stern()], shapes: null,
    intro: 'À partir de 50 m, **deux feux de tête de mât** sont obligatoires : celui de l’arrière est **plus haut**. Vu de côté, ils montrent où va le navire. (En dessous de 50 m, le second est facultatif.)',
    statements: [
      ['À partir de 50 m, un navire à moteur doit porter deux feux de tête de mât.', true],
      ['Le feu de tête de mât arrière est plus bas que celui de l’avant.', false],
    ],
  },
  sail: {
    id: 'sail', name: 'Voilier sous voiles', hull: 'sail', night: true,
    lights: [...sides(0.8, 0.9), stern(0.9)], shapes: null,
    intro: 'Seulement ses **feux de côté** (rouge, vert) et son **feu de poupe**. **Pas de feu de tête de mât** : c’est ce qui le distingue d’un navire à moteur. Sous 20 m, ces trois feux peuvent être réunis en un fanal en haut du mât.',
    statements: [
      ['Un voilier sous voiles ne porte pas de feu de tête de mât.', true],
      ['Un voilier sous voiles porte un feu blanc de tête de mât.', false],
      ['Un voilier qui avance au moteur porte les feux d’un navire à moteur.', true],
    ],
  },
  anchor: {
    id: 'anchor', name: 'Navire au mouillage', hull: 'power', night: true,
    lights: allRound(0.8, 2.4, 'white'), shapes: ['ball'], shapesForward: true,
    intro: '**Un feu blanc visible sur tout l’horizon** à l’avant, et plus de feux de route. À partir de 50 m, un second feu blanc, plus bas, à l’arrière. De jour : **une boule noire** à l’avant.',
    statements: [
      ['Au mouillage, un navire de moins de 50 m montre un feu blanc visible sur tout l’horizon.', true],
      ['Au mouillage, on garde ses feux de côté allumés.', false],
      ['De jour, un navire au mouillage hisse une boule noire.', true],
    ],
  },
  trawler: {
    id: 'trawler', name: 'Chalutier en pêche', hull: 'power', night: true,
    lights: [...allRound(0.15, 3.8, 'green', 'white'), ...sides(0.1, 1.4), stern()], shapes: ['cone-down', 'cone-up'],
    intro: '**Vert sur blanc** visibles sur tout l’horizon : chalutier en pêche. En route, il ajoute ses feux de côté et de poupe. De jour : **deux cônes réunis par la pointe**.',
    statements: [
      ['Vert sur blanc : chalutier en pêche.', true],
      ['Un chalutier en pêche montre blanc sur vert.', false],
      ['De jour, un navire en pêche montre deux cônes réunis par la pointe.', true],
    ],
  },
  fishing: {
    id: 'fishing', name: 'Navire en pêche (autre que chalut)', hull: 'power', night: true,
    lights: [...allRound(0.15, 3.8, 'red', 'white'), ...sides(0.1, 1.4), stern()], shapes: ['cone-down', 'cone-up'],
    intro: '**Rouge sur blanc** visibles sur tout l’horizon : navire en pêche avec des filets ou des lignes (pas un chalut).',
    statements: [
      ['Rouge sur blanc : navire en pêche, autre que chalutier.', true],
      ['Rouge sur blanc signale un pilote.', false],
    ],
  },
  pilot: {
    id: 'pilot', name: 'Pilote en service', hull: 'power', night: true,
    lights: [...allRound(0.2, 3.8, 'white', 'red'), ...sides(0.1, 1.4), stern()], shapes: null,
    intro: '**Blanc sur rouge** visibles sur tout l’horizon : bateau pilote en service. En route, il ajoute ses feux de côté et de poupe.',
    statements: [
      ['Blanc sur rouge : pilote en service.', true],
      ['Un pilote en service montre rouge sur blanc.', false],
    ],
  },
  nuc: {
    id: 'nuc', name: 'Navire non maître de sa manœuvre', hull: 'power', night: true,
    lights: [...allRound(0.15, 3.8, 'red', 'red'), ...sides(0.1, 1.4), stern()], shapes: ['ball', 'ball'],
    intro: '**Deux feux rouges** l’un au-dessus de l’autre : avarie, il ne peut pas manœuvrer. **Pas de feu de tête de mât** ; en route, il ajoute ses feux de côté et de poupe. De jour : **deux boules noires**.',
    statements: [
      ['Deux feux rouges superposés : navire non maître de sa manœuvre.', true],
      ['Il montre un feu de tête de mât quand il fait route.', false],
      ['De jour, il hisse deux boules noires.', true],
    ],
  },
  ram: {
    id: 'ram', name: 'Navire à capacité de manœuvre restreinte', hull: 'power', night: true,
    lights: [...allRound(0, 5, 'red', 'white', 'red'), masthead(0.55, 2.2), ...sides(0.1, 1.4), stern()],
    shapes: ['ball', 'diamond', 'ball'],
    intro: '**Rouge, blanc, rouge** superposés : un navire gêné par son travail (dragage, câble, ravitaillement…). En route, il ajoute ses feux de tête de mât, de côté et de poupe. De jour : **boule, bicône (un losange), boule**.',
    statements: [
      ['Rouge, blanc, rouge superposés : navire à capacité de manœuvre restreinte.', true],
      ['De jour, il montre trois boules noires.', false],
      ['De jour, il montre une boule, un bicône et une boule.', true],
    ],
  },
  cbd: {
    id: 'cbd', name: 'Navire handicapé par son tirant d’eau', hull: 'power', night: true,
    lights: [...allRound(0, 5, 'red', 'red', 'red'), masthead(0.55, 2.2), ...sides(0.1, 1.4), stern()],
    shapes: ['cylinder'],
    intro: 'Il **peut** montrer **trois feux rouges** superposés, en plus de ses feux de navire à moteur : trop profond pour s’écarter du chenal. De jour : **un cylindre noir**.',
    statements: [
      ['Trois feux rouges superposés : navire handicapé par son tirant d’eau.', true],
      ['De jour, il hisse un cylindre noir.', true],
      ['Il montre deux feux rouges superposés.', false],
    ],
  },
  motorsail: {
    id: 'motorsail', name: 'Voilier faisant route au moteur', hull: 'sail', night: false,
    lights: [masthead(0.2, 3.2), ...sides(0.8, 0.9), stern(0.9)], shapes: ['cone-down'], shapesForward: true,
    intro: 'Un voilier qui avance au moteur, même voiles hissées, est un navire à moteur. De jour il le signale par **un cône noir pointe en bas**, à l’avant.',
    statements: [
      ['Un voilier qui avance au moteur montre de jour un cône pointe en bas.', true],
      ['Ce cône a la pointe en haut.', false],
    ],
  },
}

export const VESSEL_IDS = Object.keys(VESSELS) as VesselId[]

export function isVisible(light: ShipLight, aspect: Aspect): boolean {
  switch (light.kind) {
    case 'allround': return true
    case 'masthead': return aspect !== 'astern'
    case 'stern': return aspect === 'astern'
    case 'side': return aspect === 'ahead' || aspect === (light.colour === 'red' ? 'port' : 'starboard')
  }
}

export function visibleLights(id: VesselId, aspect: Aspect): ShipLight[] {
  return VESSELS[id].lights.filter(l => isVisible(l, aspect))
}

export function dayShapes(id: VesselId): DayShape[] | null {
  return VESSELS[id].shapes
}
