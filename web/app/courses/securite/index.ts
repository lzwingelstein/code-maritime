/**
 * Safety equipment by distance from a shelter (division 240, version published by the ministère de la Mer, 2024),
 * and first reactions to a man overboard. See docs/VERIFICATION.md.
 */
import { quizCourse } from '../quiz'

const e = (char: string) => ({ type: 'emoji' as const, char })

export const securite = quizCourse({
  id: 'securite',
  unit: 'Permis côtier',
  title: 'Sécurité et matériel d’armement',
  badge: 'À retenir',
  cards: [
    {
      id: 'zones', name: 'Les zones de navigation', visual: e('📏'),
      intro: 'Le matériel dépend de la **distance d’un abri** : **basique** à moins de **2 milles**, **côtier** de **2 à moins de 6 milles**, **semi-hauturier** de 6 à moins de 60 milles, **hauturier** au-delà. Le permis côtier permet d’aller jusqu’à **6 milles d’un abri**.',
      questions: [
        { prompt: 'Je navigue à 4 milles d’un abri. Quel armement me faut-il ?', answer: 'Côtier', wrong: ['Basique', 'Semi-hauturier', 'Hauturier'] },
        { prompt: 'L’armement basique suffit jusqu’à…', answer: '2 milles d’un abri', wrong: ['300 mètres du rivage', '6 milles d’un abri', '12 milles de la côte'] },
        { prompt: 'Les distances de la division 240 se mesurent depuis…', answer: 'Un abri', wrong: ['Le port de départ', 'La ligne de côte la plus proche', 'La bouée la plus proche'] },
      ],
      statements: [
        ['À 5 milles d’un abri, il faut l’armement côtier.', true],
        ['L’armement basique suffit jusqu’à 6 milles d’un abri.', false],
      ],
    },
    {
      id: 'eif', name: 'Gilets : équipement individuel de flottabilité', visual: e('🦺'),
      intro: 'Un **équipement individuel de flottabilité** par personne, facile à attraper : **50 N** en basique, **100 N** en côtier. Un enfant de **30 kg ou moins** porte un **100 N**, quelle que soit la distance. Les enfants de **moins d’un an** ne comptent pas dans le nombre de personnes à bord.',
      questions: [
        { prompt: 'En navigation côtière, chaque adulte dispose d’un gilet d’au moins…', answer: '100 N', wrong: ['50 N', '150 N', '275 N'] },
        { prompt: 'Jusqu’à 2 milles d’un abri, le gilet d’un adulte doit faire au moins…', answer: '50 N', wrong: ['100 N', '150 N', '30 N'] },
        { prompt: 'Un enfant de 25 kg, à 1 mille d’un abri, porte un gilet d’au moins…', answer: '100 N', wrong: ['50 N', '150 N'] },
      ],
      statements: [
        ['Un enfant de 30 kg ou moins doit porter un gilet de 100 N, même près de l’abri.', true],
        ['En côtier, un gilet de 50 N suffit pour un adulte.', false],
      ],
    },
    {
      id: 'light', name: 'Dispositif lumineux', visual: e('🔦'),
      intro: 'Un **dispositif lumineux étanche** d’au moins **6 heures d’autonomie** : une lampe torche pour le bord, **ou** une lampe par personne (flash, torche ou cyalume) **portée ou fixée au gilet**.',
      questions: [
        { prompt: 'Quelle autonomie minimale pour le dispositif lumineux ?', answer: '6 heures', wrong: ['1 heure', '3 heures', '12 heures'] },
        { prompt: 'Une lampe individuelle doit être…', answer: 'Étanche et portée ou fixée au gilet', wrong: ['Rangée dans le coffre avant', 'Rechargeable par USB', 'De couleur rouge'] },
      ],
      statements: [
        ['Un cyalume fixé au gilet peut servir de dispositif lumineux individuel.', true],
        ['Le dispositif lumineux n’est obligatoire qu’au-delà de 2 milles.', false],
      ],
    },
    {
      id: 'basic-kit', name: 'Armement basique', visual: e('🧰'),
      intro: 'Jusqu’à 2 milles : **gilets**, **dispositif lumineux**, **extincteur(s)**, **écope ou pompe à main** (si le bateau n’est pas autovideur ou s’il est habitable), **point et bout de remorquage**, **ligne de mouillage** adaptée, un moyen de connaître **l’heure et le coefficient de la marée** (sauf en Méditerranée), et le **pavillon national** hors des eaux territoriales.',
      questions: [
        { prompt: 'Lequel de ces équipements fait partie de l’armement basique ?', answer: 'Un dispositif de remorquage', wrong: ['Trois feux rouges à main', 'Un compas magnétique', 'Des cartes marines officielles'] },
        { prompt: 'Qui peut se passer de ligne de mouillage, sous la responsabilité du chef de bord ?', answer: 'Un scooter des mers', wrong: ['Un bateau à moteur de 6 m', 'Tout bateau en zone basique', 'Personne'] },
        { prompt: 'En zone basique, il faut pouvoir connaître l’heure et le coefficient de la marée…', answer: 'Sauf en Méditerranée', wrong: ['Seulement en Méditerranée', 'Jamais', 'Seulement la nuit'] },
      ],
      statements: [
        ['Un dispositif d’assèchement manuel (écope, seau ou pompe) fait partie de l’armement basique.', true],
        ['Les feux rouges à main font partie de l’armement basique.', false],
      ],
    },
    {
      id: 'kill-cord', name: 'Coupe-circuit', visual: e('🔌'),
      intro: 'Quand le bateau en a un, le **coupe-circuit** est **attaché au poignet, à la jambe ou au gilet** du pilote **dès que le moteur tourne** : s’il tombe à l’eau, le moteur s’arrête. Un **second** coupe-circuit doit être facile à atteindre, et tout le monde à bord sait où il est.',
      questions: [
        { prompt: 'Le moteur tourne. Le coupe-circuit est…', answer: 'Attaché au pilote (poignet, jambe ou gilet)', wrong: ['Rangé près du moteur', 'Retiré pour ne pas gêner', 'Attaché au volant'] },
        { prompt: 'À quoi sert le coupe-circuit ?', answer: 'À arrêter le moteur si le pilote tombe à l’eau', wrong: ['À couper la batterie la nuit', 'À limiter la vitesse à 5 nœuds'] },
      ],
      statements: [
        ['Le coupe-circuit doit être attaché au pilote dès que le moteur tourne.', true],
        ['Le coupe-circuit peut rester accroché au tableau de bord pendant la navigation.', false],
      ],
    },
    {
      id: 'coastal-kit', name: 'Armement côtier', visual: e('🧭'),
      intro: 'De 2 à 6 milles, en plus du basique (et avec des gilets de **100 N**) : une **bouée** de sauvetage (fer à cheval ou couronne, au nom du bateau), **3 feux rouges à main**, un **compas magnétique étanche**, les **cartes marines officielles** à jour, le **RIPAM** (ou un résumé) et un **document sur le balisage** de la zone.',
      questions: [
        { prompt: 'Combien de feux rouges à main en armement côtier ?', answer: '3', wrong: ['1', '2', '6'] },
        { prompt: 'Lequel de ces équipements ajoute l’armement côtier ?', answer: 'Une bouée de sauvetage', wrong: ['Un extincteur', 'Un bout de remorquage', 'Un dispositif lumineux'] },
        { prompt: 'Quels documents faut-il à bord en armement côtier ?', answer: 'Cartes marines officielles, RIPAM et document sur le balisage', wrong: ['Le manuel du moteur seulement', 'Un plan de la plage', 'Aucun document'] },
      ],
      statements: [
        ['L’armement côtier comprend un compas magnétique étanche.', true],
        ['En armement côtier, une carte routière de la région remplace les cartes marines.', false],
      ],
    },
    {
      id: 'man-overboard', name: 'Un homme à la mer', visual: e('🛟'),
      intro: 'Si quelqu’un tombe à l’eau : **crier « un homme à la mer »**, **lancer la bouée**, **désigner quelqu’un qui ne le quitte pas des yeux** et le montre du bras, **éloigner l’hélice** de la personne (débrayer), noter la position (touche MOB du GPS) et **alerter les secours** si besoin : **VHF canal 16** en priorité en mer, ou le **196** au téléphone (CROSS).',
      questions: [
        { prompt: 'Quelqu’un tombe à l’eau. Le premier réflexe est de…', answer: 'Crier « un homme à la mer » et lancer la bouée', wrong: ['Plonger tout de suite pour le chercher', 'Accélérer pour faire demi-tour', 'Appeler sa famille'] },
        { prompt: 'Pendant la manœuvre de récupération, une personne à bord…', answer: 'Ne quitte pas des yeux la victime et la montre du bras', wrong: ['Prépare le mouillage', 'Range le pont', 'Va chercher les papiers du bateau'] },
        { prompt: 'Depuis un téléphone, le numéro d’urgence en mer est le…', answer: '196', wrong: ['15', '17', '115'] },
      ],
      statements: [
        ['En approchant d’une personne dans l’eau, on débraye pour éloigner l’hélice.', true],
        ['On garde le moteur embrayé jusqu’à toucher la personne pour aller plus vite.', false],
        ['En mer, la VHF canal 16 reste prioritaire sur le téléphone pour alerter le CROSS.', true],
      ],
    },
  ],
  lessons: [
    {
      id: 'zones-gilets', title: 'Zones et gilets', icon: e('🦺'), cards: ['zones', 'eif', 'light'], count: 8,
      tip: { emoji: '📏', title: '2 et 6 milles', text: 'Moins de **2 milles** d’un abri : armement **basique**, gilets **50 N**. De **2 à 6 milles** : armement **côtier**, gilets **100 N**. Enfants de 30 kg ou moins : **100 N** partout.' },
    },
    { id: 'armement-basique', title: 'Armement basique', icon: e('🧰'), cards: ['basic-kit', 'kill-cord'], count: 8 },
    { id: 'armement-cotier', title: 'Armement côtier', icon: e('🧭'), cards: ['coastal-kit', 'man-overboard'], count: 8 },
    {
      id: 'revision-securite', title: 'Révision', icon: e('🧭'), count: 10, review: true,
      cards: ['zones', 'eif', 'light', 'basic-kit', 'kill-cord', 'coastal-kit', 'man-overboard'],
    },
  ],
})
