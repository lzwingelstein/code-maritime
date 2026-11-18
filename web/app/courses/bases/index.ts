/**
 * The few words about a boat that the exam questions use without explaining them: bow and stern, port and
 * starboard, the beam, waterline and draft, tacks. Not an exam point by itself (arrêté du 28 septembre 2007,
 * art. 1.2), so it opens the path but stays out of the mock exam. Sources: RIPAM rules 3, 12, 13, 21.
 */
import type { BoatPart, Visual } from '../types'
import { quizCourse } from '../quiz'

const boat = (part: BoatPart, labelled = false): Visual => ({ type: 'boat', part, labelled })
const WHAT = 'Comment s’appelle ce qui est marqué « ? » ?'

export const bases = quizCourse({
  id: 'bases',
  unit: 'Pour commencer',
  title: 'Les bases du bord',
  badge: 'Nouveau mot',
  heading: 'À bord',
  cards: [
    {
      id: 'bow-stern', name: 'L’avant et l’arrière', visual: boat('bow', true),
      intro: 'L’**avant** du bateau s’appelle aussi la **proue**. L’**arrière** s’appelle la **poupe** : c’est là qu’est le **feu de poupe**, blanc.',
      questions: [
        { prompt: WHAT, visual: boat('bow'), answer: 'L’avant (la proue)', wrong: ['L’arrière (la poupe)', 'Bâbord', 'Tribord'] },
        { prompt: WHAT, visual: boat('stern'), answer: 'L’arrière (la poupe)', wrong: ['L’avant (la proue)', 'Bâbord', 'Le travers'] },
        { prompt: 'La poupe, c’est…', answer: 'L’arrière du bateau', wrong: ['L’avant du bateau', 'Le côté gauche', 'Le mât'] },
      ],
      statements: [
        ['La proue est l’avant du bateau.', true],
        ['La poupe est l’avant du bateau.', false],
      ],
    },
    {
      id: 'port-starboard', name: 'Bâbord et tribord', visual: boat('port', true),
      intro: 'En regardant vers l’**avant**, **bâbord** est à **gauche** et **tribord** à **droite**. Les feux de côté suivent : **rouge à bâbord**, **vert à tribord**.',
      questions: [
        { prompt: `${WHAT} (l’avant est en haut)`, visual: boat('port'), answer: 'Bâbord', wrong: ['Tribord', 'L’avant', 'Le travers'] },
        { prompt: `${WHAT} (l’avant est en haut)`, visual: boat('starboard'), answer: 'Tribord', wrong: ['Bâbord', 'L’arrière', 'Le travers'] },
        { prompt: 'Le feu de côté rouge est placé…', answer: 'À bâbord', wrong: ['À tribord', 'À l’arrière', 'En haut du mât'] },
        { prompt: 'En regardant vers l’avant, tribord est…', answer: 'À droite', wrong: ['À gauche', 'Derrière moi'] },
      ],
      statements: [
        ['Bâbord est à gauche quand on regarde vers l’avant.', true],
        ['Le feu vert est à bâbord.', false],
      ],
    },
    {
      id: 'beam', name: 'Le travers', visual: boat('abeam', true),
      intro: 'Le **travers**, c’est la direction **perpendiculaire** au bateau, sur le côté. Un navire **par le travers** est exactement sur mon côté. Un navire qui arrive à **plus de 22,5° sur l’arrière de mon travers** est en train de me **rattraper**.',
      questions: [
        { prompt: WHAT, visual: boat('abeam'), answer: 'Le travers', wrong: ['La poupe', 'La proue', 'La ligne de flottaison'] },
        { prompt: 'Un navire « par le travers » est…', answer: 'Exactement sur mon côté', wrong: ['Droit devant moi', 'Droit derrière moi'] },
        { prompt: 'Un navire arrive de la zone marquée « ? » (plus de 22,5° sur l’arrière de mon travers). Il est…', visual: boat('abaft'), answer: 'En train de me rattraper', wrong: ['Face à moi', 'En route croisée venant de l’avant'] },
      ],
      statements: [
        ['Le travers est la direction perpendiculaire à l’axe du bateau.', true],
        ['Un navire par le travers est droit devant.', false],
      ],
    },
    {
      id: 'draft', name: 'Flottaison et tirant d’eau', visual: boat('draft', true),
      intro: 'La **ligne de flottaison** est la limite entre la coque et l’eau. Le **tirant d’eau** est la hauteur de la partie **sous l’eau**, jusqu’au point le plus bas. Le bateau ne passe que là où l’eau est **plus profonde** que son tirant d’eau.',
      questions: [
        { prompt: WHAT, visual: boat('waterline'), answer: 'La ligne de flottaison', wrong: ['Le tirant d’eau', 'Le travers', 'La poupe'] },
        { prompt: WHAT, visual: boat('draft'), answer: 'Le tirant d’eau', wrong: ['La ligne de flottaison', 'Le travers', 'La proue'] },
        { prompt: 'Mon bateau a 1,5 m de tirant d’eau. Où peut-il passer sans toucher le fond ?', answer: 'Là où il y a 2 m d’eau', wrong: ['Là où il y a 1 m d’eau', 'Là où il y a 1,2 m d’eau'] },
      ],
      statements: [
        ['Le tirant d’eau est la hauteur de la partie immergée du bateau.', true],
        ['Un bateau peut passer là où l’eau est moins profonde que son tirant d’eau.', false],
      ],
    },
    {
      id: 'tacks', name: 'Amures, au vent, sous le vent', visual: boat('tack-starboard', true),
      intro: 'Un voilier est **tribord amures** quand il reçoit le vent **par tribord** (de sa droite) : sa voile est alors à bâbord. **Bâbord amures** : le vent vient de **bâbord**. Le côté **au vent** est celui d’où vient le vent ; l’autre est **sous le vent**.',
      questions: [
        { prompt: 'Ce voilier est…', visual: boat('tack-starboard'), answer: 'Tribord amures', wrong: ['Bâbord amures'] },
        { prompt: 'Ce voilier est…', visual: boat('tack-port'), answer: 'Bâbord amures', wrong: ['Tribord amures'] },
        { prompt: 'Un voilier bâbord amures reçoit le vent…', answer: 'Par bâbord (de sa gauche)', wrong: ['Par tribord (de sa droite)', 'Par l’arrière'] },
        { prompt: 'Le côté « au vent », c’est…', answer: 'Le côté d’où vient le vent', wrong: ['Le côté où va le vent', 'L’avant du bateau'] },
      ],
      statements: [
        ['Tribord amures : le voilier reçoit le vent par tribord.', true],
        ['Le côté sous le vent est celui d’où vient le vent.', false],
      ],
    },
  ],
  lessons: [
    {
      id: 'se-reperer', title: 'Se repérer à bord', icon: { type: 'emoji', char: '🧭' }, cards: ['bow-stern', 'port-starboard', 'beam'], count: 8,
      tip: { emoji: '🧭', title: 'Toujours en regardant vers l’avant', text: 'Bâbord, tribord, travers : on se repère **comme si on regardait vers l’avant du bateau**, quel que soit l’endroit où l’on est assis.' },
    },
    { id: 'coque-vent', title: 'La coque et le vent', icon: { type: 'emoji', char: '⛵' }, cards: ['draft', 'tacks'], count: 8 },
    { id: 'revision-bases', title: 'Révision', icon: { type: 'emoji', char: '⚓' }, cards: ['bow-stern', 'port-starboard', 'beam', 'draft', 'tacks'], count: 10, review: true },
  ],
})
