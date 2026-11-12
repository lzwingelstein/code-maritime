/**
 * Environment (waste, black water, antifouling), recreational and spear fishing, chart basics and tides.
 * Sources: loi sur l'eau 2006 art. 43, préfectures (pêche de loisir), arrêté du 17 mai 2011 (marquage),
 * SHOM (carte marine, zéro hydrographique). See docs/VERIFICATION.md.
 */
import { quizCourse } from '../quiz'

const e = (char: string) => ({ type: 'emoji' as const, char })

export const environnement = quizCourse({
  id: 'environnement',
  unit: 'Permis côtier',
  title: 'Environnement, pêche, carte et marée',
  badge: 'À retenir',
  heading: 'Environnement',
  cards: [
    {
      id: 'waste', name: 'Les déchets', visual: e('🗑️'),
      intro: 'On ne **jette rien à la mer** : plastiques, emballages, mégots, huiles… Tout se **garde à bord** et se **dépose à terre**, dans les installations de collecte du port. Les **hydrocarbures** ne doivent jamais partir à l’eau (attention en faisant le plein).',
      questions: [
        { prompt: 'Que faire des déchets produits à bord ?', answer: 'Les garder à bord et les déposer au port', wrong: ['Les jeter au large, loin des plages', 'Les jeter s’ils sont biodégradables', 'Les brûler à bord'] },
        { prompt: 'En faisant le plein, un peu de carburant coule à l’eau. C’est…', answer: 'Une pollution à éviter absolument', wrong: ['Sans importance en petite quantité', 'Autorisé dans les ports'] },
      ],
      statements: [
        ['Il est interdit de jeter ses déchets à la mer.', true],
        ['Les sacs plastiques peuvent être jetés au-delà de 3 milles.', false],
      ],
    },
    {
      id: 'black-water', name: 'Eaux noires et eaux grises', visual: e('🚽'),
      intro: 'Les **eaux noires** viennent des **toilettes**. Les bateaux de plaisance **avec toilettes construits depuis 2008** qui vont dans les **ports** et les **zones de mouillage** doivent avoir une **cuve de stockage** ou un **système de traitement**. **Aucun rejet dans les ports**. Les **eaux grises** (vaisselle, douche) : savons biodégradables et rejets limités.',
      questions: [
        { prompt: 'D’où viennent les eaux noires ?', answer: 'Des toilettes', wrong: ['De la vaisselle', 'De la douche', 'Du moteur'] },
        { prompt: 'Un bateau avec toilettes construit en 2015 qui va au port doit avoir…', answer: 'Une cuve de stockage ou un système de traitement', wrong: ['Rien de particulier', 'Seulement un seau', 'Un filtre à café'] },
        { prompt: 'Dans un port, vider ses toilettes à l’eau est…', answer: 'Interdit', wrong: ['Autorisé la nuit', 'Autorisé si le port est grand'] },
      ],
      statements: [
        ['Les eaux noires proviennent des toilettes du bord.', true],
        ['On peut vider ses eaux noires dans un port s’il y a du courant.', false],
      ],
    },
    {
      id: 'antifouling', name: 'Peintures antisalissures et carénage', visual: e('🎨'),
      intro: 'Les **peintures antisalissures** (antifouling) empêchent les algues et coquillages de coller à la coque, mais elles sont **toxiques**. Celles au **TBT** sont **interdites**. On **carène** sur une **aire de carénage** équipée pour récupérer les eaux et les résidus, **pas sur la plage**.',
      questions: [
        { prompt: 'Où faire le carénage de son bateau ?', answer: 'Sur une aire de carénage équipée', wrong: ['Sur la plage à marée basse', 'Au mouillage, en plongée', 'N’importe où sur le port'] },
        { prompt: 'Pourquoi les peintures antisalissures posent-elles problème ?', answer: 'Elles sont toxiques pour le milieu marin', wrong: ['Elles ralentissent le bateau', 'Elles sont interdites pour tous les bateaux'] },
      ],
      statements: [
        ['Les peintures antisalissures au TBT sont interdites.', true],
        ['On peut gratter sa coque sur la plage, à marée basse.', false],
      ],
    },
    {
      id: 'rec-fishing', name: 'Pêche de loisir', visual: e('🎣'),
      intro: 'Le pêcheur de loisir respecte les **tailles minimales** (on relâche tout de suite les poissons trop petits) et les **périodes et zones** interdites. Pour certaines espèces (bar, dorade…), il **marque** ses prises en **coupant la partie inférieure de la nageoire caudale**. **Vendre sa pêche est interdit**.',
      questions: [
        { prompt: 'Un poisson est plus petit que la taille minimale. Je…', answer: 'Le relâche tout de suite', wrong: ['Le garde s’il est mort', 'Le garde pour l’appât', 'Le vends'] },
        { prompt: 'Comment marquer les prises soumises à marquage ?', answer: 'En coupant la partie inférieure de la nageoire caudale', wrong: ['En coupant la nageoire dorsale', 'Avec une étiquette', 'En les vidant'] },
        { prompt: 'Le pêcheur de loisir peut-il vendre ses prises ?', answer: 'Non, c’est interdit', wrong: ['Oui, au marché', 'Oui, au restaurant', 'Oui, sous 5 kg'] },
      ],
      statements: [
        ['Le marquage des prises lutte contre la revente illégale.', true],
        ['La pêche de loisir permet de vendre ses surplus.', false],
      ],
    },
    {
      id: 'spearfishing', name: 'Pêche sous-marine', visual: e('🤿'),
      intro: 'La **pêche sous-marine** est interdite **avant 16 ans**, **la nuit** (du coucher au lever du soleil) et **avec une bouteille** de plongée. Le pêcheur a une **assurance responsabilité civile**, signale sa position par une **bouée** et ne s’approche pas **à moins de 150 m** des navires et engins de pêche signalés.',
      questions: [
        { prompt: 'Âge minimum pour la pêche sous-marine au fusil-harpon ?', answer: '16 ans', wrong: ['12 ans', '14 ans', '18 ans'] },
        { prompt: 'La pêche sous-marine avec une bouteille de plongée est…', answer: 'Interdite', wrong: ['Autorisée', 'Autorisée la nuit seulement'] },
        { prompt: 'À quelle distance minimale des engins de pêche signalés doit rester le chasseur sous-marin ?', answer: '150 m', wrong: ['50 m', '300 m', '1 mille'] },
      ],
      statements: [
        ['La pêche sous-marine est interdite la nuit.', true],
        ['Le chasseur sous-marin n’a pas besoin de signaler sa position.', false],
      ],
    },
    {
      id: 'chart-depths', name: 'Lire la carte : sondes et couleurs', visual: e('🗺️'),
      intro: 'Les **sondes** (chiffres sur l’eau) donnent la profondeur en mètres sous le **zéro hydrographique**, voisin des **plus basses mers** (coefficient 120) : il y a donc **au moins** cette profondeur. Une sonde **soulignée** est un **découvrant** (hauteur au-dessus du zéro). Couleurs : **bistre** = terre, **vert** = estran (couvre et découvre), **bleu** = petits fonds.',
      questions: [
        { prompt: 'Une sonde de 5 sur la carte signifie…', answer: 'Au moins 5 m d’eau aux plus basses mers', wrong: ['5 m d’eau à marée haute', 'Une roche à 5 m au-dessus de l’eau', '5 brasses'] },
        { prompt: 'Sur une carte marine, la couleur verte indique…', answer: 'L’estran, qui couvre et découvre', wrong: ['La terre', 'Les grands fonds', 'Une zone interdite'] },
        { prompt: 'Une sonde soulignée indique…', answer: 'Un découvrant, au-dessus du zéro des cartes', wrong: ['Une épave', 'Une grande profondeur', 'Un mouillage'] },
      ],
      statements: [
        ['Les sondes sont rapportées au zéro hydrographique.', true],
        ['La couleur bistre indique les grands fonds.', false],
      ],
    },
    {
      id: 'chart-units', name: 'Mille, nœud et coordonnées', visual: e('📐'),
      intro: 'Une position se donne en **latitude** (nord ou sud) et **longitude** (est ou ouest). Le **mille nautique** vaut **1 852 m**, soit **une minute de latitude**. Le **nœud** est une vitesse : **1 mille par heure**.',
      questions: [
        { prompt: 'Combien mesure un mille nautique ?', answer: '1 852 m', wrong: ['1 000 m', '1 609 m', '2 000 m'] },
        { prompt: 'Un bateau à 10 nœuds parcourt en une heure…', answer: '10 milles', wrong: ['10 km', '18,52 milles', '5 milles'] },
        { prompt: 'Un mille correspond à…', answer: 'Une minute de latitude', wrong: ['Un degré de latitude', 'Une minute de longitude partout', 'Une seconde de latitude'] },
      ],
      statements: [
        ['Le nœud est une unité de vitesse.', true],
        ['Un mille nautique fait 1 000 mètres.', false],
      ],
    },
    {
      id: 'tide-basics', name: 'La marée', visual: e('🌊'),
      intro: 'La mer monte jusqu’à la **pleine mer** et descend jusqu’à la **basse mer** : environ **6 heures** entre les deux. Le **marnage** est la différence de hauteur entre pleine et basse mer. Le **coefficient** va de **20 à 120** : **70** est une marée moyenne, au-dessus on parle de **vives-eaux** (fort marnage, forts courants), en dessous de **mortes-eaux**. La marée est très faible en **Méditerranée**.',
      questions: [
        { prompt: 'Combien de temps environ entre une basse mer et la pleine mer suivante ?', answer: 'Environ 6 heures', wrong: ['Environ 3 heures', 'Environ 12 heures', 'Environ 24 heures'] },
        { prompt: 'Un coefficient de 105, c’est une marée de…', answer: 'Vives-eaux', wrong: ['Mortes-eaux', 'Marée moyenne'] },
        { prompt: 'Le marnage est…', answer: 'La différence de hauteur entre pleine mer et basse mer', wrong: ['La vitesse du courant', 'L’heure de la pleine mer', 'La profondeur au zéro des cartes'] },
      ],
      statements: [
        ['Plus le coefficient est grand, plus le marnage et les courants sont forts.', true],
        ['Le coefficient de marée va de 0 à 100.', false],
      ],
    },
    {
      id: 'twelfths', name: 'La règle des douzièmes', visual: e('📈'),
      intro: 'Pour estimer la hauteur d’eau heure par heure, on découpe le **marnage en 12** : la mer monte (ou descend) de **1/12** la 1re heure, **2/12** la 2e, **3/12** la 3e, **3/12** la 4e, **2/12** la 5e, **1/12** la 6e. La **hauteur d’eau** à un endroit = **sonde + hauteur de la marée**.',
      questions: [
        { prompt: 'Marnage de 6 m. De combien la mer monte-t-elle pendant la 3e heure ?', answer: '1,50 m', wrong: ['0,50 m', '1 m', '3 m'], explanation: '3/12 de 6 m = 1,50 m.' },
        { prompt: 'Pendant quelles heures la mer monte-t-elle le plus vite ?', answer: 'La 3e et la 4e', wrong: ['La 1re et la 6e', 'La 2e et la 5e', 'Toutes pareil'] },
        { prompt: 'Sonde 2 m, hauteur de marée 3 m. Hauteur d’eau ?', answer: '5 m', wrong: ['1 m', '3 m', '6 m'], explanation: 'Hauteur d’eau = sonde + hauteur de marée = 2 + 3 = 5 m.' },
      ],
      statements: [
        ['Selon la règle des douzièmes, la mer monte de 1/12 du marnage la première heure.', true],
        ['La mer monte de la même hauteur chaque heure.', false],
      ],
    },
  ],
  lessons: [
    {
      id: 'rejets', title: 'Protéger la mer', icon: e('🐢'), cards: ['waste', 'black-water', 'antifouling'], count: 8,
      tip: { emoji: '🐢', title: 'Rien à l’eau', text: '**Aucun déchet** à la mer, **aucun rejet** de toilettes dans les ports, **carénage** sur une aire équipée.' },
    },
    { id: 'peche', title: 'Pêche de loisir', icon: e('🎣'), cards: ['rec-fishing', 'spearfishing'], count: 8 },
    { id: 'carte', title: 'La carte marine', icon: e('🗺️'), cards: ['chart-depths', 'chart-units'], count: 8 },
    {
      id: 'maree', title: 'La marée', icon: e('🌊'), cards: ['tide-basics', 'twelfths'], count: 8,
      tip: { emoji: '📈', title: '1, 2, 3, 3, 2, 1', text: 'La mer monte de **1, 2, 3, 3, 2 puis 1 douzièmes** du marnage pendant les six heures de la marée. **Coefficient 70** : marée moyenne.' },
    },
    {
      id: 'revision-environnement', title: 'Révision', icon: e('🧭'), count: 12, review: true,
      cards: ['waste', 'black-water', 'antifouling', 'rec-fishing', 'spearfishing', 'chart-depths', 'chart-units', 'tide-basics', 'twelfths'],
    },
  ],
})
