/**
 * The marks of the IALA region A buoyage system, as asked in the French "permis côtier" theory exam.
 * Light rhythms are typical examples: real buoys vary in period, the exam asks for the pattern.
 */
export type MarkId = 'port' | 'starboard' | 'north' | 'east' | 'south' | 'west' | 'isolated' | 'safe' | 'special'
export type Family = 'lateral' | 'cardinal' | 'other'
export type SignalColour = 'red' | 'green' | 'yellow' | 'black' | 'white'
export type Topmark = 'can' | 'cone' | 'north' | 'south' | 'east' | 'west' | 'two-spheres' | 'sphere' | 'x'
export type Side = 'babord' | 'tribord' | 'N' | 'E' | 'S' | 'W'

export interface Light {
  colour: 'white' | 'red' | 'green' | 'yellow'
  /** Milliseconds, alternating on/off, starting with "on"; the last value is the dark gap before the next cycle. */
  sequence: number[]
  /** Text shown with the answer. */
  description: string
}

export interface Mark {
  id: MarkId
  name: string
  family: Family
  /** Horizontal bands from top to bottom, as fractions of the body height. */
  bands?: [SignalColour, number][]
  /** Vertical stripes instead of bands. */
  stripes?: [SignalColour, SignalColour]
  topmark: Topmark
  light: Light
  /** Lateral: side to leave it on when entering harbour. Cardinal: where the safe water is. */
  side?: Side
  meaning: string
  /** Intro text; **bold** is rendered. */
  intro: string
  statements: [string, boolean][]
}

const PERIOD_GAP = (onOff: number[], period: number) => [...onOff, Math.max(400, period - onOff.reduce((a, b) => a + b, 0))]

/** "Very quick" flashes: about 120 a minute. */
export function veryQuick(count: number): number[] {
  return Array.from({ length: count * 2 - 1 }, () => 250)
}

export const MARKS: Record<MarkId, Mark> = {
  port: {
    id: 'port', name: 'Latérale bâbord', family: 'lateral',
    bands: [['red', 1]], topmark: 'can', side: 'babord',
    light: { colour: 'red', sequence: PERIOD_GAP([600], 4000), description: 'Feu rouge, rythme libre (ici 1 éclat toutes les 4 s)' },
    meaning: 'Limite gauche du chenal quand on rentre au port',
    intro: 'Rouge, voyant **cylindrique**. En venant du large vers le port, on la laisse à **bâbord** (à gauche).',
    statements: [
      ['En rentrant au port, je laisse la marque rouge à ma gauche.', true],
      ['Le voyant d’une marque bâbord est un cône.', false],
      ['Le feu d’une marque bâbord est rouge.', true],
    ],
  },
  starboard: {
    id: 'starboard', name: 'Latérale tribord', family: 'lateral',
    bands: [['green', 1]], topmark: 'cone', side: 'tribord',
    light: { colour: 'green', sequence: PERIOD_GAP([600], 4000), description: 'Feu vert, rythme libre (ici 1 éclat toutes les 4 s)' },
    meaning: 'Limite droite du chenal quand on rentre au port',
    intro: 'Verte, voyant **conique**, pointe en haut. En rentrant au port, on la laisse à **tribord** (à droite).',
    statements: [
      ['En sortant du port, la marque verte est sur ma gauche.', true],
      ['Une marque tribord a un feu rouge.', false],
      ['Le voyant d’une marque tribord est un cône pointe en haut.', true],
    ],
  },
  north: {
    id: 'north', name: 'Cardinale Nord', family: 'cardinal',
    bands: [['black', 0.5], ['yellow', 0.5]], topmark: 'north', side: 'N',
    light: { colour: 'white', sequence: PERIOD_GAP(veryQuick(16), 8000), description: 'Feu blanc, scintillement continu' },
    meaning: 'Eaux saines au nord de la marque',
    intro: 'Noire **en haut**, jaune en bas. Voyant : 2 cônes **pointes vers le haut**. Les eaux saines sont **au nord** : on passe au nord.',
    statements: [
      ['Il faut passer au nord d’une cardinale Nord.', true],
      ['Le feu d’une cardinale Nord est rouge.', false],
      ['Une cardinale Nord est jaune en haut.', false],
    ],
  },
  east: {
    id: 'east', name: 'Cardinale Est', family: 'cardinal',
    bands: [['black', 1 / 3], ['yellow', 1 / 3], ['black', 1 / 3]], topmark: 'east', side: 'E',
    light: { colour: 'white', sequence: PERIOD_GAP(veryQuick(3), 5000), description: 'Feu blanc, 3 scintillements (3 h sur l’horloge)' },
    meaning: 'Eaux saines à l’est de la marque',
    intro: 'Noire, jaune, noire. Voyant : 2 cônes **base contre base**, comme un losange. Les eaux saines sont **à l’est**.',
    statements: [
      ['Le feu d’une cardinale Est fait 3 scintillements.', true],
      ['Les cônes d’une cardinale Est se touchent par la pointe.', false],
      ['Une cardinale Est a une bande jaune au milieu.', true],
    ],
  },
  south: {
    id: 'south', name: 'Cardinale Sud', family: 'cardinal',
    bands: [['yellow', 0.5], ['black', 0.5]], topmark: 'south', side: 'S',
    light: { colour: 'white', sequence: PERIOD_GAP([...veryQuick(6), 250, 2000], 10000), description: 'Feu blanc, 6 scintillements puis 1 éclat long (6 h)' },
    meaning: 'Eaux saines au sud de la marque',
    intro: 'Jaune en haut, noire **en bas**. Voyant : 2 cônes **pointes vers le bas**. Les eaux saines sont **au sud**.',
    statements: [
      ['Une cardinale Sud est noire en haut.', false],
      ['Le feu d’une cardinale Sud finit par un éclat long.', true],
      ['Les cônes d’une cardinale Sud pointent vers le bas.', true],
    ],
  },
  west: {
    id: 'west', name: 'Cardinale Ouest', family: 'cardinal',
    bands: [['yellow', 1 / 3], ['black', 1 / 3], ['yellow', 1 / 3]], topmark: 'west', side: 'W',
    light: { colour: 'white', sequence: PERIOD_GAP(veryQuick(9), 10000), description: 'Feu blanc, 9 scintillements (9 h)' },
    meaning: 'Eaux saines à l’ouest de la marque',
    intro: 'Jaune, noire, jaune. Voyant : 2 cônes **pointe contre pointe**, comme un sablier. Les eaux saines sont **à l’ouest**.',
    statements: [
      ['Le feu d’une cardinale Ouest fait 9 scintillements.', true],
      ['Une cardinale Ouest est noire en haut et en bas.', false],
      ['Les cônes d’une cardinale Ouest se touchent par la pointe.', true],
    ],
  },
  isolated: {
    id: 'isolated', name: 'Danger isolé', family: 'other',
    bands: [['black', 0.36], ['red', 0.28], ['black', 0.36]], topmark: 'two-spheres',
    light: { colour: 'white', sequence: PERIOD_GAP([400, 600, 400], 5000), description: 'Feu blanc, 2 éclats groupés' },
    meaning: 'Danger de faible étendue, eaux saines tout autour',
    intro: 'Noire avec une bande **rouge**. Voyant : **2 sphères noires**. Petit danger isolé : on peut passer tout autour, à bonne distance.',
    statements: [
      ['On peut passer de tous les côtés d’un danger isolé, à bonne distance.', true],
      ['Son voyant est fait de deux sphères rouges.', false],
      ['Son feu fait 2 éclats blancs groupés.', true],
    ],
  },
  safe: {
    id: 'safe', name: 'Eaux saines', family: 'other',
    stripes: ['red', 'white'], topmark: 'sphere',
    light: { colour: 'white', sequence: PERIOD_GAP([2000], 10000), description: 'Feu blanc, 1 éclat long toutes les 10 s (ou isophase, ou à occultations)' },
    meaning: 'Eaux saines tout autour : milieu de chenal ou atterrissage',
    intro: 'Bandes **verticales** rouges et blanches. Voyant : **1 sphère rouge**. Eaux sûres tout autour : milieu de chenal, arrivée vers la côte.',
    statements: [
      ['Une marque d’eaux saines a des bandes verticales rouges et blanches.', true],
      ['Elle signale un danger à éviter.', false],
      ['Son voyant est une sphère rouge.', true],
    ],
  },
  special: {
    id: 'special', name: 'Marque spéciale', family: 'other',
    bands: [['yellow', 1]], topmark: 'x',
    light: { colour: 'yellow', sequence: PERIOD_GAP([700], 4000), description: 'Feu jaune' },
    meaning: 'Zone ou usage particulier : baignade, câble, zone militaire…',
    intro: 'Toute **jaune**, voyant en **croix de Saint-André** (un X) jaune. Elle signale une zone particulière : baignade, câble, mouillage, zone militaire…',
    statements: [
      ['Le feu d’une marque spéciale est jaune.', true],
      ['Une marque spéciale indique le chenal principal.', false],
      ['Son voyant est un X jaune.', true],
    ],
  },
}

export const MARK_IDS = Object.keys(MARKS) as MarkId[]

export const SIDE_LABELS: Record<Side, string> = {
  babord: 'Bâbord (gauche)',
  tribord: 'Tribord (droite)',
  N: 'Au nord de la marque',
  E: 'À l’est de la marque',
  S: 'Au sud de la marque',
  W: 'À l’ouest de la marque',
}
