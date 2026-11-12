/**
 * Steering and sailing rules (RIPAM rules 9, 10, 12 to 18). Source: SHOM, ouvrage 2, éd. 2016. See docs/VERIFICATION.md.
 * Scenes: my boat heads up (0°); bearing = where the other vessel is, clockwise from my bow; heading = its course.
 */
import { quizCourse } from '../quiz'
import type { EncounterVessel, Visual } from '../types'

const scene = (me: EncounterVessel, other: EncounterVessel, bearing: number, heading: number, extra: { wind?: number, channel?: boolean } = {}): Visual =>
  ({ type: 'encounter', me, other, bearing, heading, ...extra })

const WHO = 'Qui doit manœuvrer ?'
const who = (answer: 'Moi' | 'L’autre navire' | 'Les deux') =>
  ({ answer, wrong: (['Moi', 'L’autre navire', 'Les deux'] as const).filter(x => x !== answer) })

export const barre = quizCourse({
  id: 'barre',
  unit: 'Permis côtier',
  title: 'Règles de barre et de route',
  badge: 'Nouvelle règle',
  heading: 'Règles de route',
  cards: [
    {
      id: 'crossing-starboard', name: 'Il arrive sur ma droite', visual: scene('power', 'power', 60, 270),
      intro: 'Deux navires à moteur dont les routes se croisent : **celui qui voit l’autre sur son tribord s’écarte**, si possible en **passant derrière lui**. Ici, l’autre arrive de ma droite : **je manœuvre**.',
      questions: [
        { prompt: WHO, visual: scene('power', 'power', 60, 270), ...who('Moi') },
        { prompt: WHO, visual: scene('power', 'power', 95, 240), ...who('Moi') },
        { prompt: 'Que dois-je faire ?', visual: scene('power', 'power', 60, 270), answer: 'Venir sur tribord pour passer derrière lui', wrong: ['Venir sur bâbord pour passer devant lui', 'Garder mon cap et ma vitesse', 'Accélérer pour passer devant'] },
      ],
      statements: [
        ['Un navire à moteur qui voit un autre navire à moteur sur son tribord doit s’écarter.', true],
        ['Pour s’écarter, il vaut mieux couper la route devant l’autre navire.', false],
      ],
    },
    {
      id: 'crossing-port', name: 'Il arrive sur ma gauche', visual: scene('power', 'power', 300, 90),
      intro: 'Si l’autre navire à moteur arrive de **ma gauche** (bâbord), c’est **lui** qui s’écarte. Je **garde mon cap et ma vitesse**, en surveillant : s’il ne manœuvre pas, j’agis seul, **sans venir sur bâbord**.',
      questions: [
        { prompt: WHO, visual: scene('power', 'power', 300, 90), ...who('L’autre navire') },
        { prompt: 'Que dois-je faire ?', visual: scene('power', 'power', 300, 90), answer: 'Garder mon cap et ma vitesse', wrong: ['Venir sur bâbord', 'M’arrêter', 'Venir tout de suite sur tribord'] },
        { prompt: 'Il ne manœuvre pas et le risque d’abordage grandit. Je…', visual: scene('power', 'power', 320, 110), answer: 'Manœuvre seul, sans venir sur bâbord', wrong: ['Garde mon cap jusqu’au bout', 'Viens sur bâbord, vers lui'] },
      ],
      statements: [
        ['Le navire privilégié doit garder son cap et sa vitesse.', true],
        ['Le navire privilégié n’a jamais le droit de manœuvrer.', false],
      ],
    },
    {
      id: 'give-way-manner', name: 'Comment s’écarter', visual: { type: 'emoji', char: '↪️' },
      intro: 'Celui qui doit s’écarter manœuvre **tôt et franchement**, pour passer **largement**. Le privilégié garde **cap et vitesse**, mais si l’abordage devient inévitable, il fait **la manœuvre la plus utile**.',
      questions: [
        { prompt: 'Le navire qui doit s’écarter manœuvre…', answer: 'Tôt et franchement', wrong: ['Au dernier moment', 'Par petites touches pour ne pas gêner', 'Seulement si l’autre le demande'] },
        { prompt: 'L’abordage devient inévitable. Le navire privilégié…', answer: 'Fait la manœuvre la plus utile pour l’éviter', wrong: ['Garde quand même son cap', 'Attend que l’autre manœuvre'] },
      ],
      statements: [
        ['Une manœuvre d’évitement doit être nette pour que l’autre la voie.', true],
        ['Le navire privilégié reste sans rien faire, même si l’abordage devient inévitable.', false],
      ],
    },
    {
      id: 'head-on', name: 'Face à face', visual: scene('power', 'power', 0, 180),
      intro: 'Deux navires à moteur qui se font face : **chacun vient sur tribord** et ils se croisent **bâbord contre bâbord**. En cas de doute, on fait la même chose.',
      questions: [
        { prompt: WHO, visual: scene('power', 'power', 0, 180), ...who('Les deux') },
        { prompt: 'Que fait chacun des deux navires ?', visual: scene('power', 'power', 3, 182), answer: 'Il vient sur tribord', wrong: ['Il vient sur bâbord', 'Il garde son cap', 'L’un vient sur bâbord, l’autre sur tribord'] },
      ],
      statements: [
        ['Face à face, les deux navires à moteur viennent sur tribord.', true],
        ['Face à face, on se croise tribord contre tribord.', false],
      ],
    },
    {
      id: 'overtaking', name: 'Rattraper un navire', visual: scene('power', 'power', 0, 0),
      intro: 'Le navire qui en **rattrape** un autre (il arrive à plus de 22,5° sur l’arrière de son travers) **s’écarte**, quel qu’il soit, **même un voilier**. Il le reste jusqu’à ce qu’il soit dégagé. En cas de doute, on se considère comme rattrapant.',
      questions: [
        { prompt: 'Je vais plus vite que lui et je le rattrape. ' + WHO, visual: scene('power', 'power', 0, 0), ...who('Moi') },
        { prompt: 'Il va plus vite que moi et me rattrape. ' + WHO, visual: scene('power', 'power', 180, 0), ...who('L’autre navire') },
        { prompt: 'Je suis un voilier et je rattrape un navire à moteur. ' + WHO, visual: scene('sail', 'power', 0, 0), ...who('Moi') },
      ],
      statements: [
        ['Un voilier qui rattrape un navire à moteur doit s’écarter.', true],
        ['Le rattrapant devient privilégié dès qu’il arrive par le travers de l’autre.', false],
      ],
    },
    {
      id: 'hierarchy-power', name: 'Le navire à moteur s’écarte', visual: scene('power', 'sail', 300, 90),
      intro: 'Un **navire à moteur** s’écarte d’un **voilier**, d’un **navire en pêche**, d’un navire **à capacité de manœuvre restreinte** et d’un navire **non maître de sa manœuvre**, d’où qu’il vienne (sauf s’il le rattrape, ou en chenal étroit).',
      questions: [
        { prompt: 'Le voilier arrive de ma gauche. ' + WHO, visual: scene('power', 'sail', 300, 90, { wind: 0 }), ...who('Moi') },
        { prompt: WHO, visual: scene('power', 'fishing', 320, 100), ...who('Moi') },
        { prompt: WHO, visual: scene('power', 'nuc', 40, 250), ...who('Moi') },
      ],
      statements: [
        ['Un navire à moteur doit s’écarter d’un voilier, même si le voilier arrive de bâbord.', true],
        ['Un chalutier en pêche doit s’écarter d’un navire à moteur.', false],
      ],
    },
    {
      id: 'hierarchy-sail', name: 'Qui passe avant le voilier', visual: scene('sail', 'fishing', 60, 270),
      intro: 'Un **voilier** s’écarte d’un navire **en pêche**, d’un navire **à capacité de manœuvre restreinte** et d’un navire **non maître de sa manœuvre**. Un **navire en pêche** s’écarte des deux derniers. Et tous évitent de **gêner** un navire **handicapé par son tirant d’eau**.',
      questions: [
        { prompt: 'Je suis à la voile. ' + WHO, visual: scene('sail', 'fishing', 60, 270, { wind: 300 }), ...who('Moi') },
        { prompt: 'Un chalutier en pêche croise un navire non maître de sa manœuvre. Qui s’écarte ?', answer: 'Le chalutier', wrong: ['Le navire non maître de sa manœuvre', 'Aucun des deux'] },
        { prompt: 'Lequel de ces navires est le plus prioritaire ?', answer: 'Navire non maître de sa manœuvre', wrong: ['Chalutier en pêche', 'Voilier', 'Navire à moteur'] },
      ],
      statements: [
        ['Un voilier doit s’écarter d’un chalutier en pêche.', true],
        ['Un navire non maître de sa manœuvre doit s’écarter d’un voilier.', false],
      ],
    },
    {
      id: 'sail-tack', name: 'Deux voiliers, vent de bords différents', visual: scene('sail', 'sail', 50, 240, { wind: 300 }),
      intro: 'Deux voiliers qui reçoivent le vent de **bords différents** : celui qui reçoit le vent de **bâbord** (de sa gauche) **s’écarte**.',
      questions: [
        { prompt: 'Je reçois le vent de bâbord, lui de tribord. ' + WHO, visual: scene('sail', 'sail', 50, 240, { wind: 300 }), ...who('Moi') },
        { prompt: 'Je reçois le vent de tribord, lui de bâbord. ' + WHO, visual: scene('sail', 'sail', 310, 120, { wind: 60 }), ...who('L’autre navire') },
        { prompt: 'Entre deux voiliers aux vents de bords différents, s’écarte celui qui reçoit le vent…', answer: 'De bâbord', wrong: ['De tribord', 'De l’arrière'] },
      ],
      statements: [
        ['Un voilier qui reçoit le vent de bâbord s’écarte d’un voilier qui le reçoit de tribord.', true],
        ['Entre deux voiliers, celui qui vient de droite est toujours privilégié.', false],
      ],
    },
    {
      id: 'sail-windward', name: 'Deux voiliers, même bord', visual: scene('sail', 'sail', 290, 20, { wind: 270 }),
      intro: 'Deux voiliers qui reçoivent le vent du **même bord** : celui qui est **au vent** (du côté d’où vient le vent) **s’écarte** de celui qui est **sous le vent**. En cas de doute sur le bord de l’autre, on s’écarte.',
      questions: [
        { prompt: 'Même bord de vent, il est plus près du vent que moi. ' + WHO, visual: scene('sail', 'sail', 290, 20, { wind: 270 }), ...who('L’autre navire') },
        { prompt: 'Même bord de vent, je suis plus près du vent que lui. ' + WHO, visual: scene('sail', 'sail', 70, 340, { wind: 270 }), ...who('Moi') },
        { prompt: 'Deux voiliers reçoivent le vent du même bord. Qui s’écarte ?', answer: 'Celui qui est au vent', wrong: ['Celui qui est sous le vent', 'Le plus petit', 'Celui qui va le plus vite'] },
      ],
      statements: [
        ['Même bord de vent : le voilier au vent s’écarte.', true],
        ['Même bord de vent : le voilier sous le vent s’écarte.', false],
      ],
    },
    {
      id: 'narrow-channel', name: 'Chenal étroit', visual: scene('sail', 'big', 0, 180, { channel: true }),
      intro: 'Dans un **chenal étroit**, un navire de **moins de 20 m** ou un **voilier** ne doit pas **gêner** un navire qui ne peut naviguer qu’à l’intérieur du chenal. On navigue près du **bord situé sur tribord**.',
      questions: [
        { prompt: 'Je suis un voilier de 9 m. Ce cargo ne peut naviguer que dans le chenal. Qui doit éviter de gêner l’autre ?', visual: scene('sail', 'big', 0, 180, { channel: true }), answer: 'Moi', wrong: ['Le cargo', 'Personne'] },
        { prompt: 'Dans un chenal étroit, je navigue…', answer: 'Près du bord situé sur mon tribord', wrong: ['Au milieu du chenal', 'Près du bord situé sur mon bâbord'] },
      ],
      statements: [
        ['Dans un chenal étroit, un voilier ne doit pas gêner un grand navire qui ne peut naviguer que dans ce chenal.', true],
        ['Un voilier est toujours privilégié dans un chenal étroit.', false],
      ],
    },
    {
      id: 'tss', name: 'Dispositif de séparation du trafic', visual: { type: 'emoji', char: '🛳️' },
      intro: 'Dans un **dispositif de séparation du trafic** (« rail »), on suit la voie **dans le sens du trafic**, loin de la ligne de séparation. Pour le **traverser**, on le coupe **à peu près perpendiculairement**.',
      questions: [
        { prompt: 'Pour traverser un rail de navigation, je coupe le trafic…', answer: 'À peu près perpendiculairement', wrong: ['En biais, dans le sens du courant', 'En suivant la ligne de séparation'] },
        { prompt: 'Dans une voie de circulation, je navigue…', answer: 'Dans le sens général du trafic', wrong: ['À contre-sens pour mieux voir', 'Sur la ligne de séparation'] },
      ],
      statements: [
        ['On traverse un dispositif de séparation du trafic à peu près perpendiculairement.', true],
        ['On peut naviguer à contre-sens dans une voie de circulation si elle est vide.', false],
      ],
    },
  ],
  lessons: [
    {
      id: 'croisements', title: 'Routes qui se croisent', icon: { type: 'emoji', char: '✖️' },
      cards: ['crossing-starboard', 'crossing-port', 'give-way-manner'], count: 8,
      tip: { emoji: '🚗', title: 'Comme la priorité à droite', text: 'Entre deux navires à moteur, **celui qui voit l’autre à sa droite (tribord) s’écarte**, comme la priorité à droite sur la route. L’autre **garde cap et vitesse**.' },
    },
    {
      id: 'face-rattrapage', title: 'Face à face et rattrapage', icon: { type: 'emoji', char: '⏩' },
      cards: ['head-on', 'overtaking'], count: 8,
      tip: { emoji: '↗️', title: 'Tous sur tribord', text: 'Face à face : **chacun vient sur tribord**. Rattrapage : **celui qui rattrape s’écarte**, même un voilier.' },
    },
    {
      id: 'hierarchie', title: 'Qui est prioritaire ?', icon: { type: 'emoji', char: '🎣' },
      cards: ['hierarchy-power', 'hierarchy-sail'], count: 8,
      tip: { emoji: '🪜', title: 'L’échelle des priorités', text: 'Du plus prioritaire au moins prioritaire : **non maître de sa manœuvre** et **capacité de manœuvre restreinte** (au même niveau), puis **en pêche**, **voilier**, **à moteur**. Chacun s’écarte de ceux qui sont au-dessus de lui.' },
    },
    {
      id: 'voiliers', title: 'Entre voiliers', icon: { type: 'emoji', char: '⛵' },
      cards: ['sail-tack', 'sail-windward'], count: 8,
      tip: { emoji: '🌬️', title: 'Bâbord s’écarte, puis le plus au vent', text: 'Vents de bords différents : celui qui reçoit le vent de **bâbord** s’écarte. Même bord : celui qui est **au vent** s’écarte.' },
    },
    {
      id: 'chenaux', title: 'Chenaux et rails', icon: { type: 'emoji', char: '🛳️' }, cards: ['narrow-channel', 'tss'], count: 6,
    },
    {
      id: 'revision-barre', title: 'Révision', icon: { type: 'emoji', char: '🧭' }, count: 12, review: true,
      cards: ['crossing-starboard', 'crossing-port', 'give-way-manner', 'head-on', 'overtaking', 'hierarchy-power', 'hierarchy-sail', 'sail-tack', 'sail-windward', 'narrow-channel', 'tss'],
    },
  ],
})
