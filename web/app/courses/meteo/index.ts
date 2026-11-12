/**
 * Marine weather: Beaufort scale, special bulletins (BMS), where to get forecasts, sea state, going-out decision.
 * Sources: Météo-France (BMS thresholds, Guide marine), WMO Beaufort scale. See docs/VERIFICATION.md.
 */
import { quizCourse, type QuizQuestion } from '../quiz'

const e = (char: string) => ({ type: 'emoji' as const, char })

/** Beaufort scale: force, French term, mean wind in knots. */
export const BEAUFORT: [number, string, string][] = [
  [0, 'Calme', 'moins de 1 nœud'],
  [1, 'Très légère brise', '1 à 3 nœuds'],
  [2, 'Légère brise', '4 à 6 nœuds'],
  [3, 'Petite brise', '7 à 10 nœuds'],
  [4, 'Jolie brise', '11 à 16 nœuds'],
  [5, 'Bonne brise', '17 à 21 nœuds'],
  [6, 'Vent frais', '22 à 27 nœuds'],
  [7, 'Grand frais', '28 à 33 nœuds'],
  [8, 'Coup de vent', '34 à 40 nœuds'],
  [9, 'Fort coup de vent', '41 à 47 nœuds'],
  [10, 'Tempête', '48 à 55 nœuds'],
  [11, 'Violente tempête', '56 à 63 nœuds'],
  [12, 'Ouragan', '64 nœuds et plus'],
]

/** Sea state scale used in French bulletins: term and significant wave height. */
export const SEA_STATE: [string, string][] = [
  ['Calme', '0 m'], ['Ridée', '0 à 0,1 m'], ['Belle', '0,1 à 0,5 m'], ['Peu agitée', '0,5 à 1,25 m'],
  ['Agitée', '1,25 à 2,5 m'], ['Forte', '2,5 à 4 m'], ['Très forte', '4 à 6 m'], ['Grosse', '6 à 9 m'],
  ['Très grosse', '9 à 14 m'], ['Énorme', 'plus de 14 m'],
]

const near = <T>(list: T[], i: number, offsets: number[]) =>
  offsets.map(k => list[(i + k + list.length) % list.length]!)

const termQuestions: QuizQuestion[] = BEAUFORT.filter(([f]) => f >= 3).map(([force, term]) => {
  const i = BEAUFORT.findIndex(b => b[0] === force)
  return {
    prompt: `Force ${force} Beaufort, c’est…`, answer: term,
    wrong: near(BEAUFORT, i, [-1, 1, 3]).map(b => b[1]),
  }
})

const knotQuestions: QuizQuestion[] = BEAUFORT.filter(([f]) => f >= 3 && f <= 10).map(([force, , knots]) => {
  const i = BEAUFORT.findIndex(b => b[0] === force)
  return {
    prompt: `Un vent moyen de ${knots}, c’est force…`, answer: String(force),
    wrong: near(BEAUFORT, i, [-1, 1, 2]).map(b => String(b[0])),
  }
})

const seaQuestions: QuizQuestion[] = SEA_STATE.slice(2, 8).map(([term, height], j) => {
  const i = j + 2
  return {
    prompt: `Une mer « ${term.toLowerCase()} » correspond à des vagues de…`, answer: height,
    wrong: near(SEA_STATE, i, [-1, 1, 2]).map(s => s[1]),
  }
})

export const meteo = quizCourse({
  id: 'meteo',
  unit: 'Permis côtier',
  title: 'Météo marine',
  badge: 'À retenir',
  heading: 'Météo',
  cards: [
    {
      id: 'beaufort', name: 'L’échelle de Beaufort', visual: e('🌬️'),
      intro: 'La **force du vent** va de **0 (calme)** à **12 (ouragan)** : 3 petite brise, 4 jolie brise, 5 bonne brise, **6 vent frais**, **7 grand frais**, **8 coup de vent**, 9 fort coup de vent, 10 tempête, 11 violente tempête, 12 ouragan.',
      questions: termQuestions,
      statements: [
        ['Force 8 Beaufort correspond à un coup de vent.', true],
        ['Force 5 Beaufort correspond à un grand frais.', false],
        ['L’échelle de Beaufort va de 0 à 12.', true],
      ],
    },
    {
      id: 'beaufort-knots', name: 'Forces et nœuds', visual: e('💨'),
      intro: 'Repères en **nœuds** (vent moyen) : force 4 = **11 à 16**, force 5 = **17 à 21**, force 6 = **22 à 27**, force 7 = **28 à 33**, force 8 = **34 à 40**. Les **rafales** peuvent être bien plus fortes que le vent moyen.',
      questions: knotQuestions,
      statements: [
        ['Un vent moyen de 30 nœuds correspond à force 7.', true],
        ['La force Beaufort se calcule sur les rafales les plus fortes.', false],
      ],
    },
    {
      id: 'bms', name: 'Le bulletin météo spécial (BMS)', visual: e('⚠️'),
      intro: 'Météo-France diffuse un **BMS côte** dès que le vent moyen atteint **force 7** (**avis de grand frais**). Puis **avis de coup de vent** (force 8), **de fort coup de vent** (9), **de tempête** (10). En plaisance côtière, un **avis de grand frais** veut dire : **on reste au port**.',
      questions: [
        { prompt: 'À partir de quelle force Météo-France diffuse-t-il un BMS côte ?', answer: 'Force 7', wrong: ['Force 5', 'Force 6', 'Force 9'] },
        { prompt: 'Un « avis de coup de vent » annonce un vent de force…', answer: '8', wrong: ['6', '7', '10'] },
        { prompt: 'Un avis de grand frais est annoncé pour cet après-midi. Je…', answer: 'Reste au port', wrong: ['Pars quand même, le matin est calme', 'Sors juste dans la bande des 300 m', 'Pars en réduisant la vitesse'] },
      ],
      statements: [
        ['Un avis de grand frais correspond à force 7.', true],
        ['Un BMS est un bulletin de beau temps.', false],
      ],
    },
    {
      id: 'sources', name: 'Où trouver la météo', visual: e('📡'),
      intro: 'Le **bulletin côte** de **Météo-France** couvre jusqu’à **20 milles**. Il est diffusé par les **CROSS** en **VHF** à heures fixes (annoncé sur le **canal 16**, puis lu sur un canal de travail), affiché dans les **capitaineries**, et disponible sur le **site et l’appli Météo-France**.',
      questions: [
        { prompt: 'Qui diffuse les bulletins météo côtiers à la VHF ?', answer: 'Les CROSS', wrong: ['La SNSM', 'Les capitaineries uniquement', 'Les douanes'] },
        { prompt: 'Le bulletin météo est annoncé à la VHF sur le canal…', answer: '16, puis lu sur un canal de travail', wrong: ['70 uniquement', '9 uniquement', '72'] },
        { prompt: 'Le bulletin « côte » de Météo-France couvre jusqu’à…', answer: '20 milles de la côte', wrong: ['2 milles', '6 milles', '60 milles'] },
      ],
      statements: [
        ['Les capitaineries affichent les prévisions de météo marine.', true],
        ['Le canal 16 est le canal où l’on discute de la météo avec les autres plaisanciers.', false],
      ],
    },
    {
      id: 'sea-state', name: 'L’état de la mer', visual: e('🌊'),
      intro: 'Les bulletins décrivent la mer selon la **hauteur des vagues** : calme, ridée, **belle** (jusqu’à 0,5 m), **peu agitée** (jusqu’à 1,25 m), **agitée** (jusqu’à 2,5 m), **forte** (jusqu’à 4 m), très forte, grosse, très grosse, énorme.',
      questions: seaQuestions,
      statements: [
        ['Une mer « agitée » a des vagues de 1,25 à 2,5 m.', true],
        ['Une mer « belle » a des vagues de plus de 2 m.', false],
      ],
    },
    {
      id: 'decision', name: 'Décider de sortir', visual: e('🤔'),
      intro: 'Avant de partir, on regarde la **prévision** pour **toute la durée** de la sortie, pas seulement l’instant. On tient compte des **rafales** et du **vent contre le courant** qui lève la mer. En mer, on **réécoute les bulletins**. Près des côtes l’été, la **brise thermique** souffle de la mer vers la terre l’après-midi.',
      questions: [
        { prompt: 'Pour décider de sortir, je regarde la météo…', answer: 'Pour toute la durée de la sortie', wrong: ['Seulement au moment du départ', 'De la veille', 'Seulement si le ciel est gris'] },
        { prompt: 'L’été, l’après-midi, la brise thermique souffle généralement…', answer: 'De la mer vers la terre', wrong: ['De la terre vers la mer', 'Parallèlement à la côte'] },
        { prompt: 'Le vent est annoncé force 4 avec des rafales à 30 nœuds. Je…', answer: 'Tiens compte des rafales pour décider', wrong: ['Ne regarde que le vent moyen', 'Ignore les rafales, elles sont courtes'] },
      ],
      statements: [
        ['Le vent contre le courant rend la mer plus dure.', true],
        ['Une fois en mer, il est inutile de réécouter les bulletins.', false],
      ],
    },
  ],
  lessons: [
    {
      id: 'beaufort', title: 'L’échelle de Beaufort', icon: e('🌬️'), cards: ['beaufort', 'beaufort-knots'], count: 10,
      tip: { emoji: '🌬️', title: '6, 7, 8', text: '**6** vent frais (22-27 nœuds), **7** grand frais (28-33), **8** coup de vent (34-40). À partir de **7**, Météo-France lance un **avis** : la plaisance côtière reste au port.' },
    },
    { id: 'avis-sources', title: 'Avis et bulletins', icon: e('📡'), cards: ['bms', 'sources'], count: 8 },
    { id: 'mer-decision', title: 'La mer et la décision', icon: e('🌊'), cards: ['sea-state', 'decision'], count: 8 },
    {
      id: 'revision-meteo', title: 'Révision', icon: e('🧭'), count: 10, review: true,
      cards: ['beaufort', 'beaufort-knots', 'bms', 'sources', 'sea-state', 'decision'],
    },
  ],
})
