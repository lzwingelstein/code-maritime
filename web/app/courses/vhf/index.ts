/**
 * VHF, GMDSS basics and rescue organisation. Sources: ANFR / ministère de la Mer leaflet « La VHF » (2021),
 * CROSS Gris-Nez, ministère de la Mer (196). See docs/VERIFICATION.md.
 */
import { quizCourse, type QuizQuestion } from '../quiz'

const e = (char: string) => ({ type: 'emoji' as const, char })

/** International phonetic alphabet. */
export const PHONETIC: [string, string][] = [
  ['A', 'Alpha'], ['B', 'Bravo'], ['C', 'Charlie'], ['D', 'Delta'], ['E', 'Echo'], ['F', 'Foxtrot'], ['G', 'Golf'],
  ['H', 'Hotel'], ['I', 'India'], ['J', 'Juliett'], ['K', 'Kilo'], ['L', 'Lima'], ['M', 'Mike'], ['N', 'November'],
  ['O', 'Oscar'], ['P', 'Papa'], ['Q', 'Quebec'], ['R', 'Romeo'], ['S', 'Sierra'], ['T', 'Tango'], ['U', 'Uniform'],
  ['V', 'Victor'], ['W', 'Whiskey'], ['X', 'X-ray'], ['Y', 'Yankee'], ['Z', 'Zulu'],
]

const alphabetQuestions: QuizQuestion[] = PHONETIC.map(([letter, word], i) => ({
  prompt: `À la VHF, comment épelle-t-on la lettre « ${letter} » ?`,
  answer: word,
  wrong: [1, 7, 13].map(k => PHONETIC[(i + k) % PHONETIC.length]![1]),
  explanation: `${letter} se dit « ${word} » dans l’alphabet phonétique international.`,
}))

const PRIORITY = { mayday: 'MAYDAY (détresse)', panpan: 'PAN PAN (urgence)', securite: 'SÉCURITÉ (sécurité)' }

export const vhf = quizCourse({
  id: 'vhf',
  unit: 'Permis côtier',
  title: 'VHF et sauvetage',
  badge: 'À retenir',
  heading: 'VHF',
  cards: [
    {
      id: 'ch16', name: 'Le canal 16', visual: e('📻'),
      intro: 'Le **canal 16** est le canal d’**appel**, de **détresse**, d’**urgence** et de **sécurité** : tout le monde l’écoute, les CROSS aussi. On y fait des appels **courts**, puis on **dégage** sur un canal de travail.',
      questions: [
        { prompt: 'Quel canal VHF est celui de la détresse et de l’appel ?', answer: '16', wrong: ['9', '70', '72'] },
        { prompt: 'Après avoir appelé un ami sur le 16, je…', answer: 'Lui propose de passer sur un canal de travail', wrong: ['Continue la conversation sur le 16', 'Coupe ma VHF'] },
      ],
      statements: [
        ['Le canal 16 doit être réservé aux appels et à la sécurité.', true],
        ['On peut discuter longuement sur le canal 16 s’il n’y a pas de détresse.', false],
      ],
    },
    {
      id: 'ch-work', name: 'Canaux de travail', visual: e('🔁'),
      intro: 'Les canaux **6, 8, 72 et 77** servent aux échanges **de navire à navire**. Le canal **9** est le plus utilisé par les **capitaineries** des ports de plaisance.',
      questions: [
        { prompt: 'Lequel de ces canaux sert aux échanges entre navires ?', answer: '72', wrong: ['16', '70', '9'] },
        { prompt: 'Pour joindre la capitainerie d’un port de plaisance, on utilise le plus souvent le canal…', answer: '9', wrong: ['16', '70', '77'] },
        { prompt: 'Quelle liste contient uniquement des canaux navire à navire ?', answer: '6, 8, 72, 77', wrong: ['9, 16, 70', '6, 16, 70', '8, 9, 12'] },
      ],
      statements: [
        ['Les canaux 6, 8, 72 et 77 sont des canaux navire à navire.', true],
        ['Le canal 70 sert aux conversations entre plaisanciers.', false],
      ],
    },
    {
      id: 'licence-vhf', name: 'Qui peut utiliser une VHF ?', visual: e('🪪'),
      intro: 'Dans les **eaux territoriales françaises**, le **permis plaisance** suffit pour utiliser **toute VHF** (fixe, portable, avec ou sans ASN). Une **portable sans ASN de 6 W au plus** ne demande aucune qualification. **Hors des eaux françaises**, il faut le **CRR** (certificat restreint de radiotéléphoniste).',
      questions: [
        { prompt: 'Avec mon permis côtier, puis-je utiliser une VHF fixe dans les eaux françaises ?', answer: 'Oui, le permis suffit', wrong: ['Non, il faut le CRR', 'Seulement une portable', 'Seulement en cas de détresse'] },
        { prompt: 'Hors des eaux territoriales françaises, pour utiliser une VHF, il faut…', answer: 'Le CRR', wrong: ['Rien de plus que le permis côtier', 'Une licence de pêche'] },
      ],
      statements: [
        ['Le permis plaisance permet d’utiliser une VHF dans les eaux territoriales françaises.', true],
        ['Le permis côtier remplace le CRR dans les eaux internationales.', false],
      ],
    },
    {
      id: 'asn', name: 'ASN, canal 70 et MMSI', visual: e('🆘'),
      intro: 'L’**ASN** (appel sélectif numérique) envoie une alerte automatique sur le **canal 70** avec le bouton **DISTRESS** : il transmet l’**identité** du bateau (son **MMSI**, **9 chiffres**, qui commence par **226, 227 ou 228** en France) et sa **position** si la VHF est reliée au GPS. On confirme ensuite en phonie sur le **16**.',
      questions: [
        { prompt: 'Sur quel canal passe l’alerte numérique ASN ?', answer: '70', wrong: ['16', '9', '6'] },
        { prompt: 'Combien de chiffres compte un numéro MMSI ?', answer: '9', wrong: ['6', '10', '12'] },
        { prompt: 'Après une alerte ASN de détresse, je…', answer: 'Donne mon message MAYDAY en phonie sur le 16', wrong: ['Éteins la VHF pour économiser la batterie', 'Attends sans rien dire', 'Appelle sur le 72'] },
      ],
      statements: [
        ['Le MMSI identifie le bateau lors d’une alerte ASN.', true],
        ['On parle sur le canal 70 pour donner son message de détresse.', false],
      ],
    },
    {
      id: 'cross', name: 'Le sauvetage en mer', visual: e('🚁'),
      intro: 'Les **CROSS** coordonnent le sauvetage en mer et veillent le **canal 16**. On les joint par **VHF 16** en mer (en priorité) ou au **196** par téléphone. Les bénévoles de la **SNSM** font une grande partie des interventions.',
      questions: [
        { prompt: 'Qui coordonne les opérations de sauvetage en mer en France ?', answer: 'Le CROSS', wrong: ['La capitainerie', 'Météo-France', 'Le club nautique'] },
        { prompt: 'En mer, le moyen prioritaire pour alerter le CROSS est…', answer: 'La VHF canal 16', wrong: ['Un SMS', 'Le téléphone fixe du port', 'Les réseaux sociaux'] },
      ],
      statements: [
        ['Le 196 permet de joindre le CROSS par téléphone.', true],
        ['La SNSM est un service payant de remorquage.', false],
      ],
    },
    {
      id: 'mayday', name: 'MAYDAY : détresse', visual: e('🆘'),
      intro: '**MAYDAY** = **détresse** : **danger grave et imminent**, une **aide immédiate** est demandée. Sur le 16 : « **MAYDAY MAYDAY MAYDAY**, ici [nom du bateau ×3, MMSI] », puis **position**, **nature de la détresse**, **aide demandée**, **nombre de personnes**, autres informations, « **à vous** ».',
      questions: [
        { prompt: 'Mon bateau coule et nous devons l’abandonner. Je lance…', answer: PRIORITY.mayday, wrong: [PRIORITY.panpan, PRIORITY.securite] },
        { prompt: 'Après « MAYDAY, ici [nom du bateau] », quelle information donner en premier ?', answer: 'Ma position', wrong: ['La couleur de ma coque', 'Le nom de mon port d’attache', 'L’heure de mon départ'] },
        { prompt: 'Lequel de ces messages passe en priorité sur tous les autres ?', answer: PRIORITY.mayday, wrong: [PRIORITY.panpan, PRIORITY.securite] },
      ],
      statements: [
        ['Un message MAYDAY passe avant tous les autres.', true],
        ['On lance un MAYDAY pour une simple panne de moteur par beau temps près du port.', false],
      ],
    },
    {
      id: 'panpan', name: 'PAN PAN : urgence', visual: e('⚠️'),
      intro: '**PAN PAN** = **urgence** : un problème sérieux pour le bateau ou une personne, **sans danger immédiat pour la vie** (panne moteur qui dérive vers des cailloux loin, blessé léger…). Même structure que le MAYDAY : « PAN PAN ×3, à tous ×3, ici… », position, problème, aide demandée.',
      questions: [
        { prompt: 'Panne de moteur, je dérive lentement au large, personne n’est en danger immédiat. Je lance…', answer: PRIORITY.panpan, wrong: [PRIORITY.mayday, PRIORITY.securite] },
        { prompt: 'Un équipier s’est blessé, sans danger vital, et il faut un avis médical. Je lance…', answer: PRIORITY.panpan, wrong: [PRIORITY.mayday, PRIORITY.securite] },
      ],
      statements: [
        ['PAN PAN signale une urgence sans danger immédiat pour la vie.', true],
        ['PAN PAN passe avant MAYDAY.', false],
      ],
    },
    {
      id: 'securite', name: 'SÉCURITÉ : information', visual: e('📢'),
      intro: '**SÉCURITÉ** annonce une **information pour la sécurité de la navigation** ou la **météo** : conteneur à la dérive, bouée cardinale manquante, avis de coup de vent…',
      questions: [
        { prompt: 'Je vois un conteneur flottant entre deux eaux. Je lance…', answer: PRIORITY.securite, wrong: [PRIORITY.mayday, PRIORITY.panpan] },
        { prompt: 'Une marque cardinale a disparu. Quel message ?', answer: PRIORITY.securite, wrong: [PRIORITY.mayday, PRIORITY.panpan] },
      ],
      statements: [
        ['Un bulletin d’avis de coup de vent est annoncé par « SÉCURITÉ ».', true],
        ['« SÉCURITÉ » sert à demander un remorquage urgent.', false],
      ],
    },
    {
      id: 'alphabet', name: 'L’alphabet phonétique', visual: e('🔤'),
      intro: 'Pour **épeler** un nom à la VHF sans erreur, on utilise l’**alphabet phonétique international** : **A**lpha, **B**ravo, **C**harlie, **D**elta, **E**cho, **F**oxtrot, **G**olf, **H**otel, **I**ndia, **J**uliett, **K**ilo, **L**ima, **M**ike, **N**ovember, **O**scar, **P**apa, **Q**uebec, **R**omeo, **S**ierra, **T**ango, **U**niform, **V**ictor, **W**hiskey, **X**-ray, **Y**ankee, **Z**ulu.',
      questions: alphabetQuestions,
      statements: [
        ['« Sierra » correspond à la lettre S.', true],
        ['« Mike » correspond à la lettre N.', false],
        ['« Golf » correspond à la lettre G.', true],
      ],
    },
    {
      id: 'english', name: 'Anglais de base', visual: e('🇬🇧'),
      intro: 'Quelques mots à connaître : **Over** = « à vous » (j’attends la réponse), **Out** = « terminé », **Say again** = « répétez », **Roger** = « reçu », **Mayday relay** = relais d’un message de détresse.',
      questions: [
        { prompt: 'À la VHF, « Over » signifie…', answer: 'À vous, j’attends votre réponse', wrong: ['Terminé, je coupe', 'Répétez', 'Reçu'] },
        { prompt: 'Je n’ai pas compris le message. Je dis…', answer: 'Say again', wrong: ['Over', 'Out', 'Roger'] },
        { prompt: '« Out » signifie…', answer: 'Terminé, fin de la communication', wrong: ['À vous', 'Reçu', 'Urgence'] },
      ],
      statements: [
        ['« Roger » signifie « reçu ».', true],
        ['« Over » signifie que la communication est terminée.', false],
      ],
    },
  ],
  lessons: [
    {
      id: 'canaux', title: 'Les canaux', icon: e('📻'), cards: ['ch16', 'ch-work', 'licence-vhf'], count: 8,
      tip: { emoji: '📻', title: '16 pour appeler, 6-8-72-77 pour parler', text: 'On appelle sur le **16**, on parle sur **6, 8, 72 ou 77**, la capitainerie est souvent sur le **9**, l’ASN passe par le **70**.' },
    },
    { id: 'asn-cross', title: 'ASN et sauvetage', icon: e('🚁'), cards: ['asn', 'cross'], count: 8 },
    {
      id: 'messages', title: 'MAYDAY, PAN PAN, SÉCURITÉ', icon: e('🆘'), cards: ['mayday', 'panpan', 'securite'], count: 10,
      tip: { emoji: '🆘', title: 'Trois niveaux', text: '**MAYDAY** : vie en danger, aide immédiate. **PAN PAN** : urgence sans danger immédiat pour la vie. **SÉCURITÉ** : information pour les autres navigateurs.' },
    },
    { id: 'alphabet-anglais', title: 'Alphabet et anglais', icon: e('🔤'), cards: ['alphabet', 'english'], count: 10 },
    {
      id: 'revision-vhf', title: 'Révision', icon: e('🧭'), count: 12, review: true,
      cards: ['ch16', 'ch-work', 'licence-vhf', 'asn', 'cross', 'mayday', 'panpan', 'securite', 'alphabet', 'english'],
    },
  ],
})
