/**
 * Sound and light signals: manoeuvring and warning (RIPAM rule 34), restricted visibility (rule 35),
 * distress (rule 37, annex IV), port traffic signals and strong wind warning lights (SHOM ouvrage 3C).
 * See docs/VERIFICATION.md.
 */
import { quizCourse } from '../quiz'
import type { HornNote, PortLight, Visual } from '../types'

const horn = (caption: string | undefined, ...pattern: HornNote[]): Visual => ({ type: 'horn', pattern, caption })
const port = (lights: PortLight[], extra: { flashing?: boolean, exemption?: boolean } = {}): Visual => ({ type: 'port', lights, ...extra })
const S = 'short' as const
const L = 'long' as const

const MEANINGS = {
  starboard: 'Je viens sur tribord',
  port: 'Je viens sur bâbord',
  astern: 'Je bats en arrière (marche arrière)',
  doubt: 'Je doute de vos intentions',
  bend: 'J’approche d’un coude sans visibilité',
}
const heard = 'Que signifie ce signal ?'
const others = (answer: string, pool: Record<string, string>) => Object.values(pool).filter(x => x !== answer)

const FOG = {
  power: 'Navire à moteur faisant route',
  stopped: 'Navire à moteur stoppé, sans erre',
  restricted: 'Voilier, pêcheur ou navire gêné',
  anchor: 'Navire au mouillage',
}

const PORT = {
  emergency: 'Danger grave : tous les navires s’arrêtent',
  closed: 'Interdiction de passer',
  oneWay: 'Passage autorisé, trafic à sens unique',
  twoWay: 'Passage autorisé, trafic à double sens',
  orders: 'Passage seulement sur instruction',
}

export const signaux = quizCourse({
  id: 'signaux',
  unit: 'Permis côtier',
  title: 'Signaux sonores, de détresse et portuaires',
  badge: 'Nouveau signal',
  cards: [
    {
      id: 'sound-starboard', name: '1 son bref', visual: horn(undefined, S),
      intro: 'Entre navires **en vue**, un navire à moteur qui manœuvre l’annonce : **1 son bref** (environ 1 s) = **je viens sur tribord**.',
      questions: [
        { prompt: heard, visual: horn(undefined, S), answer: MEANINGS.starboard, wrong: others(MEANINGS.starboard, MEANINGS) },
        { prompt: 'Je viens sur tribord. Quel signal fais-je entendre ?', answer: '1 son bref', wrong: ['2 sons brefs', '3 sons brefs', '1 son prolongé'] },
      ],
      statements: [['Un son bref signifie : je viens sur tribord.', true], ['Un son bref dure de 4 à 6 secondes.', false]],
    },
    {
      id: 'sound-port', name: '2 sons brefs', visual: horn(undefined, S, S),
      intro: '**2 sons brefs** = **je viens sur bâbord**.',
      questions: [
        { prompt: heard, visual: horn(undefined, S, S), answer: MEANINGS.port, wrong: others(MEANINGS.port, MEANINGS) },
        { prompt: 'Je viens sur bâbord. Quel signal fais-je entendre ?', answer: '2 sons brefs', wrong: ['1 son bref', '3 sons brefs', '2 sons prolongés'] },
      ],
      statements: [['Deux sons brefs signifient : je viens sur bâbord.', true], ['Deux sons brefs signifient : je viens sur tribord.', false]],
    },
    {
      id: 'sound-astern', name: '3 sons brefs', visual: horn(undefined, S, S, S),
      intro: '**3 sons brefs** = **je bats en arrière** (je mets la machine en arrière).',
      questions: [
        { prompt: heard, visual: horn(undefined, S, S, S), answer: MEANINGS.astern, wrong: others(MEANINGS.astern, MEANINGS) },
        { prompt: 'Je bats en arrière. Quel signal fais-je entendre ?', answer: '3 sons brefs', wrong: ['2 sons brefs', '5 sons brefs', '1 son prolongé'] },
      ],
      statements: [['Trois sons brefs signifient : je bats en arrière.', true], ['Trois sons brefs signifient : je suis en détresse.', false]],
    },
    {
      id: 'sound-doubt', name: 'Au moins 5 sons brefs', visual: horn(undefined, S, S, S, S, S),
      intro: '**Au moins 5 sons brefs et rapides** = **je doute de vos intentions** (ou que vous manœuvriez assez pour éviter l’abordage).',
      questions: [
        { prompt: heard, visual: horn(undefined, S, S, S, S, S), answer: MEANINGS.doubt, wrong: others(MEANINGS.doubt, MEANINGS) },
        { prompt: 'Je ne comprends pas ce que fait l’autre navire. Quel signal fais-je ?', answer: 'Au moins 5 sons brefs et rapides', wrong: ['3 sons brefs', '1 son prolongé', '2 sons prolongés'] },
      ],
      statements: [['Au moins cinq sons brefs rapides expriment un doute sur les intentions de l’autre navire.', true], ['Cinq sons brefs sont un signal de détresse.', false]],
    },
    {
      id: 'sound-bend', name: '1 son prolongé (coude)', visual: horn(undefined, L),
      intro: 'À l’approche d’un **coude** ou d’un endroit qui **masque la vue** : **1 son prolongé** (4 à 6 s). Un navire qui l’entend de l’autre côté répond par 1 son prolongé.',
      questions: [
        { prompt: 'En chenal, devant un coude qui cache la vue, ce signal veut dire…', visual: horn(undefined, L), answer: MEANINGS.bend, wrong: others(MEANINGS.bend, MEANINGS) },
        { prompt: 'J’entends 1 son prolongé de l’autre côté d’un coude. Je réponds par…', answer: '1 son prolongé', wrong: ['1 son bref', '5 sons brefs', 'Rien'] },
      ],
      statements: [['Un son prolongé dure de 4 à 6 secondes.', true], ['À l’approche d’un coude sans visibilité, on émet 3 sons brefs.', false]],
    },
    {
      id: 'sound-overtake', name: 'Dépasser en chenal étroit', visual: horn(undefined, L, L, S),
      intro: 'En **chenal étroit**, pour dépasser : **2 prolongés + 1 bref** = je veux vous dépasser **par tribord** ; **2 prolongés + 2 brefs** = **par bâbord**. Le navire dépassé **accepte** par **prolongé, bref, prolongé, bref**.',
      questions: [
        { prompt: heard, visual: horn(undefined, L, L, S), answer: 'Je veux vous dépasser par tribord', wrong: ['Je veux vous dépasser par bâbord', 'J’accepte d’être dépassé', 'Je viens sur tribord'] },
        { prompt: heard, visual: horn(undefined, L, L, S, S), answer: 'Je veux vous dépasser par bâbord', wrong: ['Je veux vous dépasser par tribord', 'J’accepte d’être dépassé', 'Je bats en arrière'] },
        { prompt: 'On me demande de me dépasser et j’accepte. Ce signal…', visual: horn(undefined, L, S, L, S), answer: 'Est le bon : prolongé, bref, prolongé, bref', wrong: ['Est faux : il faut 2 sons brefs', 'Est faux : il faut 1 son prolongé'] },
      ],
      statements: [['Deux prolongés et un bref : je veux vous dépasser par tribord.', true], ['Le navire dépassé accepte par trois sons brefs.', false]],
    },
    {
      id: 'fog-power', name: 'Brume : navire à moteur faisant route', visual: horn('toutes les 2 min au plus', L),
      intro: 'Par **visibilité réduite**, de jour comme de nuit, un navire à moteur **qui avance** émet **1 son prolongé** au plus **toutes les 2 minutes**.',
      questions: [
        { prompt: 'Dans la brume, j’entends ce signal toutes les 2 minutes. C’est…', visual: horn('toutes les 2 min au plus', L), answer: FOG.power, wrong: others(FOG.power, FOG) },
        { prompt: 'Par brume, un navire à moteur qui avance émet…', answer: '1 son prolongé toutes les 2 minutes', wrong: ['2 sons prolongés toutes les 2 minutes', '1 prolongé et 2 brefs toutes les 2 minutes', 'Un coup de cloche chaque minute'] },
      ],
      statements: [['Les signaux de brume s’emploient de jour comme de nuit.', true], ['Par brume, un navire à moteur qui avance émet 1 son bref par minute.', false]],
    },
    {
      id: 'fog-stopped', name: 'Brume : navire à moteur stoppé', visual: horn('toutes les 2 min au plus', L, L),
      intro: 'Navire à moteur **en route mais stoppé, sans erre** : **2 sons prolongés** (séparés d’environ 2 s) au plus **toutes les 2 minutes**.',
      questions: [
        { prompt: 'Dans la brume, j’entends ce signal toutes les 2 minutes. C’est…', visual: horn('toutes les 2 min au plus', L, L), answer: FOG.stopped, wrong: others(FOG.stopped, FOG) },
        { prompt: 'Par brume, mon bateau à moteur est stoppé, sans erre. J’émets…', answer: '2 sons prolongés toutes les 2 minutes', wrong: ['1 son prolongé toutes les 2 minutes', '1 prolongé et 2 brefs toutes les 2 minutes', 'Un coup de cloche chaque minute'] },
      ],
      statements: [['Deux sons prolongés par brume : navire à moteur stoppé, sans erre.', true], ['Deux sons prolongés par brume : navire au mouillage.', false]],
    },
    {
      id: 'fog-restricted', name: 'Brume : voilier, pêcheur, navire gêné', visual: horn('toutes les 2 min au plus', L, S, S),
      intro: '**1 prolongé + 2 brefs** au plus toutes les 2 minutes : **voilier**, **navire en pêche**, **non maître de sa manœuvre**, **à capacité restreinte**, **handicapé par son tirant d’eau**, **remorqueur ou pousseur**.',
      questions: [
        { prompt: 'Dans la brume, j’entends ce signal toutes les 2 minutes. C’est…', visual: horn('toutes les 2 min au plus', L, S, S), answer: FOG.restricted, wrong: others(FOG.restricted, FOG) },
        { prompt: 'Par brume, un voilier émet…', answer: '1 son prolongé suivi de 2 brefs', wrong: ['1 son prolongé', '2 sons prolongés', '3 sons brefs'] },
      ],
      statements: [['Par brume, un voilier émet 1 prolongé et 2 brefs.', true], ['Par brume, un voilier n’émet aucun signal.', false]],
    },
    {
      id: 'fog-anchor', name: 'Brume : navire au mouillage', visual: horn('chaque minute', 'bell'),
      intro: 'Au **mouillage** par brume : la **cloche** sonne rapidement pendant **environ 5 secondes**, **chaque minute**. Un navire de **moins de 12 m** peut faire **tout autre signal sonore efficace**.',
      questions: [
        { prompt: 'Dans la brume, j’entends une cloche chaque minute. C’est…', visual: horn('chaque minute', 'bell'), answer: FOG.anchor, wrong: others(FOG.anchor, FOG) },
        { prompt: 'Un bateau de moins de 12 m au mouillage dans la brume…', answer: 'Peut faire un autre signal sonore efficace', wrong: ['N’a besoin d’aucun signal', 'Doit sonner 3 sons brefs'] },
      ],
      statements: [['Au mouillage par brume, on sonne la cloche environ 5 secondes chaque minute.', true], ['Au mouillage par brume, on émet un son prolongé toutes les 2 minutes.', false]],
    },
    {
      id: 'distress-visual', name: 'Signaux de détresse visuels', visual: { type: 'emoji', char: '🧨' },
      intro: 'Pour signaler une **détresse** : **fusée à parachute** ou **feu à main rouge**, **fumigène orange**, **bras tendus levés et abaissés** lentement, **flammes** à bord, pavillons **N sur C**, pavillon carré avec une **boule**. On ne s’en sert **qu’en cas de vraie détresse**.',
      questions: [
        { prompt: 'Lequel de ces signaux est un signal de détresse ?', answer: 'Un fumigène orange', wrong: ['Un fumigène blanc', 'Un feu vert à main', 'Un pavillon jaune'] },
        { prompt: 'Quel geste signale une détresse ?', answer: 'Lever et abaisser lentement les bras tendus', wrong: ['Agiter un bras au-dessus de la tête', 'Croiser les bras'] },
        { prompt: 'De quelle couleur est une fusée à parachute de détresse ?', answer: 'Rouge', wrong: ['Verte', 'Blanche', 'Bleue'] },
      ],
      statements: [['Un signal fumigène orange est un signal de détresse.', true], ['On peut tirer une fusée de détresse pour saluer un autre bateau.', false]],
    },
    {
      id: 'distress-sound-radio', name: 'Détresse : son et radio', visual: { type: 'emoji', char: '🆘' },
      intro: 'Par le son ou la radio : **son continu** d’un appareil de brume, **coups de canon** environ chaque minute, **SOS** en Morse (··· — — — ···), **« MAYDAY »** à la radio, **alerte ASN** (canal 70), **radiobalise**.',
      questions: [
        { prompt: 'Lequel de ces signaux sonores est un signal de détresse ?', answer: 'Un son continu d’un appareil de brume', wrong: ['3 sons brefs', '1 son prolongé toutes les 2 minutes', '5 sons brefs'] },
        { prompt: 'À la radio, le mot de détresse est…', answer: 'MAYDAY', wrong: ['PAN PAN', 'SÉCURITÉ', 'HELP'] },
        { prompt: 'L’alerte de détresse ASN se déclenche en VHF sur…', answer: 'Le canal 70', wrong: ['Le canal 16', 'Le canal 9', 'Le canal 72'] },
      ],
      statements: [['SOS en Morse est un signal de détresse.', true], ['Cinq sons brefs sont un signal de détresse.', false]],
    },
    {
      id: 'port-emergency', name: '3 feux rouges à éclats', visual: port(['red', 'red', 'red'], { flashing: true }),
      intro: 'À l’entrée d’un port, **3 feux rouges à éclats** : **danger grave**, tous les navires **s’arrêtent** ou se déroutent selon les instructions.',
      questions: [{ prompt: 'Que signifient ces feux ?', visual: port(['red', 'red', 'red'], { flashing: true }), answer: PORT.emergency, wrong: others(PORT.emergency, PORT) }, { prompt: 'Le seul signal portuaire à éclats signifie…', answer: 'Un danger grave', wrong: ['Une entrée autorisée', 'Un trafic à sens unique'] }],
      statements: [['Trois feux rouges à éclats signalent un danger grave.', true], ['Trois feux rouges à éclats autorisent les petits bateaux à passer.', false]],
    },
    {
      id: 'port-closed', name: '3 feux rouges fixes', visual: port(['red', 'red', 'red']),
      intro: '**3 feux rouges** fixes (ou à occultations lentes) : **interdiction de passer**. Un **feu jaune** à gauche ajoute une **exception** : seuls les navires qui peuvent naviguer **hors du chenal principal** peuvent passer.',
      questions: [
        { prompt: 'Que signifient ces feux ?', visual: port(['red', 'red', 'red']), answer: PORT.closed, wrong: others(PORT.closed, PORT) },
        { prompt: 'Avec un feu jaune à gauche, ces feux signifient…', visual: port(['red', 'red', 'red'], { exemption: true }), answer: 'Seuls les navires qui naviguent hors du chenal principal peuvent passer', wrong: ['Personne ne passe', 'Tout le monde passe', 'Danger grave'] },
      ],
      statements: [['Trois feux rouges fixes : interdiction de passer.', true], ['Un feu jaune à gauche annule l’interdiction pour tous les navires.', false]],
    },
    {
      id: 'port-green', name: '3 feux verts', visual: port(['green', 'green', 'green']),
      intro: '**3 feux verts** : **passage autorisé**, trafic à **sens unique**. **Vert, vert, blanc** : passage autorisé, trafic à **double sens**.',
      questions: [
        { prompt: 'Que signifient ces feux ?', visual: port(['green', 'green', 'green']), answer: PORT.oneWay, wrong: others(PORT.oneWay, PORT) },
        { prompt: 'Que signifient ces feux ?', visual: port(['green', 'green', 'white']), answer: PORT.twoWay, wrong: others(PORT.twoWay, PORT) },
      ],
      statements: [['Trois feux verts : passage autorisé, trafic à sens unique.', true], ['Vert, vert, blanc : passage interdit.', false]],
    },
    {
      id: 'port-orders', name: 'Vert, blanc, vert', visual: port(['green', 'white', 'green']),
      intro: '**Vert, blanc, vert** : on ne passe **que sur instruction** (souvent par VHF auprès de la capitainerie).',
      questions: [{ prompt: 'Que signifient ces feux ?', visual: port(['green', 'white', 'green']), answer: PORT.orders, wrong: others(PORT.orders, PORT) },
        { prompt: 'Devant vert, blanc, vert à l’entrée du port, je…', answer: 'Demande l’autorisation, souvent par VHF', wrong: ['Entre librement', 'Fais demi-tour définitivement'] }],
      statements: [['Vert, blanc, vert : on attend l’autorisation de passer.', true], ['Vert, blanc, vert : trafic à double sens, on passe librement.', false]],
    },
    {
      id: 'wind-warning', name: 'Avis de vent fort', visual: { type: 'emoji', char: '💨' },
      intro: 'À la sortie de certains ports, un **feu blanc scintillant**, **de jour seulement**, annonce un **vent fort** : vent de **force 6 ou plus** observé ou prévu dans les prochaines heures. Éteint : pas d’avis.',
      questions: [
        { prompt: 'À la sortie du port, de jour, un feu blanc scintillant est allumé. Il annonce…', answer: 'Un vent de force 6 ou plus, observé ou prévu', wrong: ['Une entrée interdite', 'Un danger grave', 'Une marée haute'] },
        { prompt: 'Le feu d’avis de vent fort fonctionne…', answer: 'De jour seulement', wrong: ['De nuit seulement', 'Jour et nuit'] },
      ],
      statements: [['Le feu d’avis de vent fort est un feu blanc scintillant visible de jour.', true], ['Le feu d’avis de vent fort s’allume au-dessus de force 3.', false]],
    },
  ],
  lessons: [
    {
      id: 'sons-manoeuvre', title: 'Signaux de manœuvre', icon: { type: 'emoji', char: '📯' },
      cards: ['sound-starboard', 'sound-port', 'sound-astern', 'sound-doubt'], count: 10,
      tip: { emoji: '📯', title: 'Compte les sons brefs', text: '**1 bref** : tribord. **2 brefs** : bâbord. **3 brefs** : je bats en arrière. **5 brefs ou plus** : je doute de vos intentions.' },
    },
    {
      id: 'sons-chenal', title: 'Coudes et dépassements', icon: { type: 'emoji', char: '↪️' }, cards: ['sound-bend', 'sound-overtake'], count: 6,
    },
    {
      id: 'brume', title: 'Signaux de brume', icon: { type: 'emoji', char: '🌫️' },
      cards: ['fog-power', 'fog-stopped', 'fog-restricted', 'fog-anchor'], count: 10,
      tip: { emoji: '🌫️', title: 'Toutes les 2 minutes', text: 'Moteur qui avance : **1 prolongé**. Moteur stoppé : **2 prolongés**. Voilier, pêcheur, navire gêné : **1 prolongé + 2 brefs**. Au mouillage : **cloche chaque minute**.' },
    },
    {
      id: 'detresse', title: 'Signaux de détresse', icon: { type: 'emoji', char: '🆘' }, cards: ['distress-visual', 'distress-sound-radio'], count: 8,
    },
    {
      id: 'port-meteo', title: 'Entrée de port et vent fort', icon: { type: 'emoji', char: '🚦' },
      cards: ['port-emergency', 'port-closed', 'port-green', 'port-orders', 'wind-warning'], count: 10,
      tip: { emoji: '🚦', title: 'Rouge : on attend, vert : on passe', text: '**Rouges à éclats** : danger grave. **Rouges** : interdit. **Verts** : sens unique. **Vert, vert, blanc** : double sens. **Vert, blanc, vert** : sur instruction. **Feu jaune** à gauche : exception pour ceux qui naviguent hors du chenal.' },
    },
    {
      id: 'revision-signaux', title: 'Révision', icon: { type: 'emoji', char: '🧭' }, count: 12, review: true,
      cards: ['sound-starboard', 'sound-port', 'sound-astern', 'sound-doubt', 'sound-bend', 'sound-overtake', 'fog-power', 'fog-stopped', 'fog-restricted', 'fog-anchor', 'distress-visual', 'distress-sound-radio', 'port-emergency', 'port-closed', 'port-green', 'port-orders', 'wind-warning'],
    },
  ],
})
