/**
 * Lexicon: words of the exam that a beginner may not know, explained in plain French.
 * Sources: RIPAM rule 3 (general definitions) and rules 21, 24 to 28; mer.gouv.fr (CROSS, 196); SHOM (zéro des cartes).
 * See docs/VERIFICATION.md. A term is spotted in course texts by `match` (case-insensitive, whole words).
 */
export interface Term {
  id: string
  /** Shown as the entry title. */
  term: string
  /** Forms found in texts; the longest are tried first. */
  match: string[]
  definition: string
}

export const TERMS: Term[] = [
  {
    id: 'mouillage', term: 'Au mouillage (à l’ancre)', match: ['au mouillage', 'à l’ancre', 'mouillage'],
    definition: 'Le bateau est arrêté et retenu au fond par son **ancre**. Le mouillage, c’est aussi l’endroit où l’on jette l’ancre. Un navire au mouillage ne fait pas route.',
  },
  {
    id: 'nuc', term: 'Non maître de sa manœuvre', match: ['non maître de sa manœuvre', 'non maîtres de leur manœuvre', 'pas maître de sa manœuvre', 'maître de sa manœuvre'],
    definition: 'Navire qui, à cause d’une **circonstance exceptionnelle** (panne de moteur ou de barre, avarie), **ne peut pas manœuvrer** comme le demandent les règles. Il ne peut donc pas s’écarter de ta route : c’est à toi de l’éviter.',
  },
  {
    id: 'ram', term: 'Capacité de manœuvre restreinte', match: ['capacité de manœuvre restreinte', 'manœuvre restreinte', 'capacité restreinte'],
    definition: 'Navire qui peut manœuvrer, mais que **son travail empêche de s’écarter** de ta route : pose ou entretien d’une bouée ou d’un câble, dragage, plongeurs, ravitaillement en mer, certains remorquages…',
  },
  {
    id: 'cbd', term: 'Handicapé par son tirant d’eau', match: ['handicapé par son tirant d’eau', 'handicapés par leur tirant d’eau'],
    definition: 'Gros navire à moteur qui, parce qu’il est **très enfoncé dans l’eau** et que la profondeur et la largeur disponibles sont faibles, **peut difficilement changer de route** : il doit rester dans le chenal.',
  },
  {
    id: 'tirant', term: 'Tirant d’eau', match: ['tirant d’eau'],
    definition: 'Hauteur de la **partie immergée** du bateau : de la ligne de flottaison jusqu’au point le plus bas de la coque. Un bateau ne peut pas passer là où l’eau est moins profonde que son tirant d’eau.',
  },
  {
    id: 'pilote', term: 'Bateau pilote', match: ['bateau pilote', 'pilote en service', 'navire pilote'],
    definition: 'Le **pilote** est un marin qui connaît parfaitement un port : il monte à bord des grands navires pour les guider à l’entrée et à la sortie. Le **bateau pilote** l’amène jusqu’au navire et vient le reprendre.',
  },
  {
    id: 'chalut', term: 'Chalutier, chalut', match: ['chalutiers', 'chalutier', 'chalut'],
    definition: 'Le **chalut** est un grand filet en forme de poche que le bateau **traîne derrière lui**. Le **chalutier** est le bateau de pêche qui le tire : pendant la pêche, il est lent et manœuvre mal.',
  },
  {
    id: 'peche', term: 'Navire en pêche', match: ['en train de pêcher', 'en pêche'],
    definition: 'Navire qui pêche avec des **filets, lignes ou chaluts** qui le gênent pour manœuvrer. Un bateau qui traîne simplement une ligne (pêche à la traîne) n’en fait pas partie.',
  },
  {
    id: 'route', term: 'Faire route', match: ['faisant route', 'fait route', 'en route'],
    definition: 'Un navire **fait route** dès qu’il n’est **ni à l’ancre, ni amarré à quai, ni échoué**, même s’il est arrêté sur l’eau.',
  },
  {
    id: 'erre', term: 'Erre', match: ['avec erre', 'sans erre', 'erre'],
    definition: 'La **vitesse du bateau par rapport à l’eau**. « Avec erre » : il avance encore. « Sans erre » : il est arrêté sur l’eau, sans être à l’ancre.',
  },
  {
    id: 'masthead', term: 'Feu de tête de mât', match: ['feux de tête de mât', 'feu de tête de mât', 'feu blanc de tête de mât', 'tête de mât'],
    definition: 'Feu **blanc**, placé haut, dans l’axe du navire, visible **de l’avant et des côtés** (225°). Les navires **à moteur** le portent, pas les voiliers sous voiles.',
  },
  {
    id: 'sidelights', term: 'Feux de côté', match: ['feux de côté', 'feu de côté'],
    definition: 'Un feu **rouge à bâbord** (gauche) et un feu **vert à tribord** (droite), visibles de l’avant jusqu’un peu en arrière du côté (112,5° chacun). Vu de l’arrière, on ne les voit pas.',
  },
  {
    id: 'poupe', term: 'Poupe, feu de poupe', match: ['feu blanc de poupe', 'feu de poupe', 'poupe'],
    definition: 'La **poupe** est l’**arrière** du bateau (l’avant est la proue). Le **feu de poupe** est un feu blanc visible **seulement depuis l’arrière** (135°).',
  },
  {
    id: 'remorquage', term: 'Remorquage', match: ['remorquage', 'remorqueurs', 'remorqueur'],
    definition: 'Un navire, le **remorqueur**, en **tire** (ou pousse) un autre avec un câble. L’ensemble est long et change difficilement de route.',
  },
  {
    id: 'amures', term: 'Amures (bâbord, tribord)', match: ['bâbord amures', 'tribord amures', 'amures'],
    definition: 'Le côté par lequel un voilier **reçoit le vent**. **Tribord amures** : le vent vient de tribord (de sa droite). **Bâbord amures** : il vient de bâbord (de sa gauche).',
  },
  {
    id: 'auvent', term: 'Au vent, sous le vent', match: ['au vent', 'sous le vent'],
    definition: 'Le côté **au vent** est celui **d’où vient le vent** ; le côté **sous le vent** est l’autre, celui où il va.',
  },
  {
    id: 'flottaison', term: 'Ligne de flottaison', match: ['ligne de flottaison', 'flottaison'],
    definition: 'La limite entre la **coque** et l’**eau** : ce qui est en dessous est immergé.',
  },
  {
    id: 'chenal', term: 'Chenal', match: ['chenaux', 'chenal'],
    definition: 'Passage, souvent **étroit et balisé**, où l’eau est assez profonde pour les navires : entrée de port, d’estuaire ou de rivière.',
  },
  {
    id: 'travers', term: 'Travers', match: ['par le travers', 'travers'],
    definition: 'Direction **perpendiculaire** à l’axe du bateau, sur le côté. « Par le travers » : exactement sur le côté.',
  },
  {
    id: 'cross', term: 'CROSS', match: ['CROSS'],
    definition: '**Centre régional opérationnel de surveillance et de sauvetage** : il coordonne les secours en mer. On le joint par la **VHF, canal 16**, en mer, ou au **196** par téléphone depuis la côte.',
  },
  {
    id: 'asn', term: 'ASN', match: ['ASN'],
    definition: '**Appel sélectif numérique** (DSC en anglais) : fonction de la VHF qui envoie une alerte de détresse automatique, avec l’identité et la position du bateau, sur le **canal 70**.',
  },
  {
    id: 'zero', term: 'Zéro des cartes', match: ['zéro des cartes'],
    definition: 'Niveau de référence des cartes marines, **proche des plus basses mers** : les profondeurs (les **sondes**) sont comptées à partir de lui. Il y a donc presque toujours plus d’eau que ce qu’indique la carte.',
  },
  {
    id: 'coefficient', term: 'Coefficient de marée', match: ['coefficients de marée', 'coefficient de marée', 'coefficient'],
    definition: 'Nombre de **20 à 120** qui dit si la marée est forte : plus il est grand, plus la mer **monte et descend** (vives-eaux) ; petit, c’est une marée faible (mortes-eaux).',
  },
  {
    id: 'marnage', term: 'Marnage', match: ['marnage'],
    definition: 'Différence de **hauteur d’eau** entre la **pleine mer** et la **basse mer** d’une même marée.',
  },
  {
    id: 'beaufort', term: 'Échelle de Beaufort', match: ['échelle de Beaufort', 'Beaufort'],
    definition: 'Échelle de **0 à 12** qui mesure la **force du vent** (vitesse moyenne), en s’aidant de son effet sur la mer.',
  },
  {
    id: 'cap', term: 'Cap', match: ['cap'],
    definition: 'Direction vers laquelle **pointe l’avant du bateau**, en degrés de 0 à 360 (0 : nord, 90 : est…).',
  },
]
