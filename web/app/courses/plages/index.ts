/**
 * Beach buoyage and the 300 m band, region B lateral marks, emergency wreck and new dangers.
 * Sources: arrêté du 28/09/2007 art. 1.2 (programme); SHOM ouvrage 3C (wreck, new dangers);
 * Direction de la Mer (300 m band buoyage); ministère de la Mer (region B). See docs/VERIFICATION.md.
 */
import { quizCourse } from '../quiz'
import type { Visual } from '../types'
import type { ExtraMarkId, MarkId } from '../balisage/marks'

const mark = (markId: MarkId | ExtraMarkId): Visual => ({ type: 'mark', markId, topOnly: false })
const which = 'Quelle est cette bouée ?'

export const plages = quizCourse({
  id: 'plages',
  unit: 'Permis côtier',
  title: 'Balisage : plages, région B, épaves',
  badge: 'Nouvelle marque',
  heading: 'Balisage',
  cards: [
    {
      id: 'beach-limit', name: 'Limite de la bande des 300 m', visual: mark('beach-limit'),
      intro: 'De grosses **bouées sphériques jaunes**, espacées d’environ 200 m, marquent la limite de la **bande des 300 m** : la vitesse y est limitée à **5 nœuds**. La règle s’applique même sans bouées. Ces bouées ne sont **pas éclairées**.',
      questions: [
        { prompt: which, visual: mark('beach-limit'), answer: 'Limite de la bande des 300 m', wrong: ['Bâbord de chenal traversier', 'Tribord de chenal traversier', 'Marque spéciale'] },
        { prompt: 'Dans la bande des 300 m, la vitesse est limitée à…', answer: '5 nœuds', wrong: ['3 nœuds', '8 nœuds', '10 nœuds'] },
        { prompt: 'À moins de 300 m du rivage, sans aucune bouée, la limite de vitesse…', answer: 'S’applique quand même', wrong: ['Ne s’applique pas', 'Ne s’applique que l’été', 'Ne s’applique qu’aux scooters des mers'] },
      ],
      statements: [
        ['Les bouées jaunes de la bande des 300 m sont éclairées la nuit.', false],
        ['La bande des 300 m se mesure à partir de la limite des eaux.', true],
        ['Sans bouées, on peut dépasser 5 nœuds à 200 m du rivage.', false],
      ],
    },
    {
      id: 'swim-zone', name: 'Zone réservée à la baignade', visual: mark('beach-limit'),
      intro: 'Les mêmes **bouées sphériques jaunes**, mais **très rapprochées**, délimitent une **zone réservée à la baignade** : **interdite aux engins à moteur**, scooters des mers compris.',
      questions: [
        { prompt: 'Des bouées sphériques jaunes très rapprochées délimitent…', answer: 'Une zone réservée à la baignade', wrong: ['Un chenal traversier', 'Une zone de mouillage', 'Un danger isolé'] },
        { prompt: 'Qui peut entrer dans une zone réservée à la baignade ?', answer: 'Les baigneurs', wrong: ['Les scooters des mers à 5 nœuds', 'Les bateaux à moteur au ralenti', 'Tous les bateaux'] },
      ],
      statements: [
        ['Un scooter des mers peut traverser une zone de baignade à 5 nœuds.', false],
        ['Une zone de baignade est interdite aux engins à moteur.', true],
      ],
    },
    {
      id: 'beach-port', name: 'Bâbord de chenal traversier', visual: mark('beach-port'),
      intro: '**Bouée jaune cylindrique**, à laisser à **bâbord en venant du large**. Le **chenal traversier** permet de traverser la bande des 300 m pour quitter ou rejoindre le rivage ; il est **interdit aux baigneurs**.',
      questions: [
        { prompt: which, visual: mark('beach-port'), answer: 'Bâbord de chenal traversier', wrong: ['Tribord de chenal traversier', 'Limite de la bande des 300 m', 'Latérale bâbord'] },
        { prompt: 'En venant du large, je laisse la bouée jaune cylindrique d’un chenal traversier…', answer: 'À bâbord', wrong: ['À tribord'] },
        { prompt: 'À quoi sert un chenal traversier ?', answer: 'À traverser la bande des 300 m pour quitter ou rejoindre le rivage', wrong: ['À mouiller près de la plage', 'À se baigner en sécurité', 'À dépasser les 5 nœuds'] },
      ],
      statements: [
        ['Le chenal traversier est interdit aux baigneurs.', true],
        ['La bouée bâbord d’un chenal traversier est conique.', false],
      ],
    },
    {
      id: 'beach-starboard', name: 'Tribord de chenal traversier', visual: mark('beach-starboard'),
      intro: '**Bouée jaune conique**, à laisser à **tribord en venant du large**. Même logique que les latérales : cylindre à bâbord, cône à tribord, mais en **jaune**.',
      questions: [
        { prompt: which, visual: mark('beach-starboard'), answer: 'Tribord de chenal traversier', wrong: ['Bâbord de chenal traversier', 'Limite de la bande des 300 m', 'Latérale tribord'] },
        { prompt: 'En venant du large, je laisse la bouée jaune conique d’un chenal traversier…', answer: 'À tribord', wrong: ['À bâbord'] },
      ],
      statements: [
        ['La bouée tribord d’un chenal traversier est jaune et conique.', true],
        ['Les bouées de chenal traversier sont rouges et vertes.', false],
      ],
    },
    {
      id: 'port-b', name: 'Latérale bâbord en région B', visual: mark('port-b'),
      intro: 'En **région B** (Amériques, Antilles, Guyane, Saint-Pierre-et-Miquelon, Japon, Corée, Philippines), les **couleurs** des latérales sont **inversées** : bâbord est **vert**. La **forme ne change pas** : cylindre à bâbord.',
      questions: [
        { prompt: 'En région B, en rentrant au port, cette marque se laisse…', visual: mark('port-b'), answer: 'À bâbord', wrong: ['À tribord'] },
        { prompt: 'Entre la région A et la région B, qu’est-ce qui change sur les latérales ?', answer: 'Les couleurs', wrong: ['Les formes', 'Les couleurs et les formes', 'Rien'] },
        { prompt: 'Lequel de ces lieux est en région B ?', answer: 'La Martinique', wrong: ['La Corse', 'La Bretagne', 'La Réunion'] },
      ],
      statements: [
        ['En région B, la marque bâbord est verte.', true],
        ['En région B, la marque bâbord est conique.', false],
        ['Les marques cardinales sont les mêmes en région A et en région B.', true],
      ],
    },
    {
      id: 'starboard-b', name: 'Latérale tribord en région B', visual: mark('starboard-b'),
      intro: 'En **région B**, tribord est **rouge** et garde sa forme **conique**. Astuce : la **forme** dit le côté partout dans le monde, la **couleur** dépend de la région.',
      questions: [
        { prompt: 'En région B, en rentrant au port, cette marque se laisse…', visual: mark('starboard-b'), answer: 'À tribord', wrong: ['À bâbord'] },
        { prompt: 'En région B, de quelle couleur est la marque tribord ?', answer: 'Rouge', wrong: ['Verte', 'Jaune', 'Noire'] },
      ],
      statements: [
        ['En région B, la marque tribord est rouge et conique.', true],
        ['En région B, on laisse le rouge à bâbord en rentrant au port.', false],
      ],
    },
    {
      id: 'wreck', name: 'Bouée d’épave d’urgence', visual: mark('wreck'),
      intro: 'Bouée à **bandes verticales bleues et jaunes**, surmontée d’une **croix jaune droite** : elle balise une **épave récente**, en attendant le balisage définitif. Son feu est **alternatif bleu et jaune**.',
      questions: [
        { prompt: which, visual: mark('wreck'), answer: 'Bouée d’épave d’urgence', wrong: ['Marque spéciale', 'Eaux saines', 'Danger isolé'] },
        { prompt: 'De quelles couleurs est le feu d’une bouée d’épave d’urgence ?', answer: 'Bleu et jaune, en alternance', wrong: ['Blanc, 2 éclats', 'Jaune seul', 'Rouge et blanc'] },
        { prompt: 'Le voyant d’une bouée d’épave d’urgence est…', answer: 'Une croix jaune droite', wrong: ['Un X jaune', 'Deux sphères noires', 'Une sphère rouge'] },
      ],
      statements: [
        ['Une bouée d’épave d’urgence a des bandes verticales bleues et jaunes.', true],
        ['Son voyant est un X jaune, comme une marque spéciale.', false],
      ],
    },
    {
      id: 'new-danger', name: 'Danger nouveau', visual: { type: 'emoji', char: '⚠️' },
      intro: 'Un **danger nouveau** n’est pas encore sur les cartes. On le balise avec des marques **cardinales ou latérales** (parfois de danger isolé), à **feux scintillants**. S’il est grave, une marque peut être **doublée** ; une balise radar peut émettre la lettre Morse **« D »**.',
      questions: [
        { prompt: 'Deux marques cardinales Nord identiques côte à côte signalent probablement…', answer: 'Un danger nouveau et grave', wrong: ['Un chenal préféré', 'Une zone de baignade', 'Une erreur de balisage'] },
        { prompt: 'Une balise radar sur un danger nouveau peut émettre en Morse la lettre…', answer: 'D', wrong: ['A', 'S', 'U'] },
      ],
      statements: [
        ['Un danger nouveau peut être balisé par des marques cardinales.', true],
        ['Un danger nouveau est toujours balisé par une marque spéciale jaune.', false],
      ],
    },
  ],
  lessons: [
    {
      id: 'plages', title: 'Plages et bande des 300 m', icon: mark('beach-limit'),
      cards: ['beach-limit', 'swim-zone', 'beach-port', 'beach-starboard'], count: 10,
      tip: { emoji: '🏖️', title: 'Jaune à la plage', text: 'Près des plages, tout est **jaune**. En venant du large :',
        rows: [
          { visual: mark('beach-limit'), label: '**Sphère** : limite des 300 m (5 nœuds), baignade' },
          { visual: mark('beach-port'), label: '**Cylindre** : bâbord du chenal' },
          { visual: mark('beach-starboard'), label: '**Cône** : tribord du chenal' },
        ] },
    },
    {
      id: 'region-b', title: 'Région B', icon: mark('port-b'), cards: ['port-b', 'starboard-b'], count: 8,
      tip: { emoji: '🌎', title: 'Les couleurs s’inversent, pas les formes', text: 'En région B (Amériques, Antilles, Guyane…), en rentrant au port :',
        rows: [
          { visual: mark('port-b'), label: '**À gauche** : vert, cylindre' },
          { visual: mark('starboard-b'), label: '**À droite** : rouge, cône' },
        ] },
    },
    {
      id: 'epaves', title: 'Épaves et dangers nouveaux', icon: mark('wreck'), cards: ['wreck', 'new-danger'], count: 6,
    },
    {
      id: 'revision-plages', title: 'Révision', icon: { type: 'emoji', char: '🧭' },
      cards: ['beach-limit', 'swim-zone', 'beach-port', 'beach-starboard', 'port-b', 'starboard-b', 'wreck', 'new-danger'], count: 10, review: true,
    },
  ],
})
