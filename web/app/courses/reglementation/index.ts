/**
 * Regulations: licence, papers, skipper, CE design categories, fuel, alcohol and control of the vessel,
 * divers, towed sports, locks. Sources in docs/VERIFICATION.md.
 */
import { quizCourse } from '../quiz'

const e = (char: string) => ({ type: 'emoji' as const, char })

export const reglementation = quizCourse({
  id: 'reglementation',
  unit: 'Permis côtier',
  title: 'Réglementation',
  badge: 'À retenir',
  cards: [
    {
      id: 'licence', name: 'Le permis plaisance', visual: e('🪪'),
      intro: 'Le permis est obligatoire pour conduire un bateau de plaisance **à moteur** dont la puissance dépasse **4,5 kW (6 ch)**. On peut le passer dès **16 ans**. L’**option côtière** permet de naviguer **jusqu’à 6 milles d’un abri**, **de jour comme de nuit**, sans limite de puissance ; au-delà, il faut l’**extension hauturière**.',
      questions: [
        { prompt: 'Le permis est obligatoire au-delà de quelle puissance ?', answer: '4,5 kW (6 ch)', wrong: ['3 kW (4 ch)', '7,5 kW (10 ch)', '15 kW (20 ch)'] },
        { prompt: 'Avec le permis côtier, je peux naviguer jusqu’à…', answer: '6 milles d’un abri', wrong: ['2 milles d’un abri', '6 milles de la côte', '12 milles d’un abri'] },
        { prompt: 'Âge minimum pour passer le permis côtier ?', answer: '16 ans', wrong: ['14 ans', '18 ans', '15 ans'] },
      ],
      statements: [
        ['Le permis côtier permet de naviguer de nuit.', true],
        ['Le permis côtier limite la puissance du moteur à 100 ch.', false],
      ],
    },
    {
      id: 'papers', name: 'Les papiers du bord', visual: e('📄'),
      intro: 'À bord : le **certificat d’enregistrement** du bateau (qui remplace depuis **2022** l’acte de francisation et la carte de circulation ; les anciens titres restent valables) et le **permis** du pilote.',
      questions: [
        { prompt: 'Quel document a remplacé l’acte de francisation et la carte de circulation ?', answer: 'Le certificat d’enregistrement', wrong: ['Le permis plaisance', 'La carte grise du véhicule', 'Le rôle d’équipage'] },
        { prompt: 'Depuis quand le certificat d’enregistrement existe-t-il ?', answer: '2022', wrong: ['2008', '2015', '2026'] },
      ],
      statements: [
        ['Le certificat d’enregistrement est le titre de navigation du bateau.', true],
        ['Un acte de francisation délivré avant 2022 n’est plus valable du tout.', false],
      ],
    },
    {
      id: 'skipper', name: 'Le chef de bord', visual: e('🧑‍✈️'),
      intro: 'Le **chef de bord** est **responsable** du bateau et des **personnes à bord** : il prépare la sortie (météo, carburant, matériel), fait respecter les règles et choisit l’**abri** selon le bateau et les conditions. Sa responsabilité peut être **civile et pénale**.',
      questions: [
        { prompt: 'Qui est responsable de la sécurité des personnes à bord ?', answer: 'Le chef de bord', wrong: ['Le propriétaire, même absent', 'Chaque passager pour lui-même', 'Le port de départ'] },
        { prompt: 'Avant de partir, le chef de bord vérifie notamment…', answer: 'La météo, le carburant et le matériel', wrong: ['Seulement le carburant', 'Seulement la marée', 'Rien, c’est au loueur'] },
      ],
      statements: [
        ['Le chef de bord peut voir sa responsabilité pénale engagée.', true],
        ['Le chef de bord n’est pas responsable de ses passagers.', false],
      ],
    },
    {
      id: 'ce-categories', name: 'Catégories de conception CE', visual: e('🏷️'),
      intro: 'Chaque bateau marqué CE a une **catégorie de conception** : **A** vent au-delà de force 8 et vagues de plus de 4 m ; **B** jusqu’à force 8 et 4 m ; **C** jusqu’à force 6 et 2 m ; **D** jusqu’à force 4 et 0,3 m (eaux protégées). La **plaque du constructeur** indique aussi le **nombre maximal de personnes**.',
      questions: [
        { prompt: 'Un bateau de catégorie C est conçu pour un vent jusqu’à…', answer: 'Force 6 et des vagues de 2 m', wrong: ['Force 8 et des vagues de 4 m', 'Force 4 et des vagues de 0,3 m', 'Force 10 et des vagues de 7 m'] },
        { prompt: 'Quelle catégorie pour des eaux protégées, vent jusqu’à force 4 ?', answer: 'D', wrong: ['A', 'B', 'C'] },
        { prompt: 'Où trouve-t-on le nombre maximal de personnes à bord ?', answer: 'Sur la plaque du constructeur', wrong: ['Sur le permis du pilote', 'Sur le certificat d’enregistrement seulement', 'Nulle part : c’est libre'] },
      ],
      statements: [
        ['Un bateau de catégorie B est conçu pour un vent jusqu’à force 8.', true],
        ['La catégorie D convient à la haute mer.', false],
      ],
    },
    {
      id: 'fuel', name: 'Autonomie en carburant', visual: e('⛽'),
      intro: 'On part **toujours avec le plein** et on garde une **marge de sécurité**. Règle pratique : **un tiers** du carburant pour l’aller, **un tiers** pour le retour, **un tiers** en réserve. Le vent, la mer et la vitesse augmentent la consommation.',
      questions: [
        { prompt: 'Selon la règle pratique du tiers, quelle part garder en réserve ?', answer: 'Un tiers', wrong: ['Un quart', 'La moitié', 'Rien si la mer est calme'] },
        { prompt: 'Avant une sortie, côté carburant, je…', answer: 'Pars avec le plein et une marge de sécurité', wrong: ['Prends juste de quoi faire l’aller', 'Compte sur une station en mer'] },
      ],
      statements: [
        ['La mer formée augmente la consommation de carburant.', true],
        ['On peut partir avec juste assez de carburant pour l’aller-retour.', false],
      ],
    },
    {
      id: 'alcohol', name: 'Alcool et maîtrise du bateau', visual: e('🚫'),
      intro: 'Depuis le **5 juin 2026**, conduire un bateau de plaisance à moteur en **état d’ivresse manifeste** est une **contravention**, comme le **défaut de maîtrise** : on doit **adapter sa vitesse et sa conduite** aux circonstances (croisement, zone fréquentée, visibilité, météo). Il n’y a **pas de taux d’alcool chiffré** comme sur la route : l’agent juge sur des **signes observables**.',
      questions: [
        { prompt: 'Depuis juin 2026, piloter un bateau à moteur en état d’ivresse manifeste…', answer: 'Est une infraction sanctionnée', wrong: ['Est autorisé hors des ports', 'N’est sanctionné qu’en cas d’accident'] },
        { prompt: 'Le « défaut de maîtrise » sanctionne le pilote qui…', answer: 'N’adapte pas sa vitesse et sa conduite aux circonstances', wrong: ['Dépasse 20 nœuds', 'Navigue de nuit', 'N’a pas de VHF'] },
      ],
      statements: [
        ['Le pilote doit adapter sa vitesse à la visibilité et au trafic.', true],
        ['Le défaut de maîtrise ne concerne que les ports.', false],
      ],
    },
    {
      id: 'divers', name: 'Plongeurs', visual: e('🤿'),
      intro: 'Le bateau support de plongée hisse le **pavillon « Alpha »** (blanc et bleu) : des plongeurs sont sous l’eau. On **ralentit** et on **reste à bonne distance** (on enseigne souvent **100 m**) ou on passe **très lentement**.',
      questions: [
        { prompt: 'Un pavillon blanc et bleu « Alpha » signifie…', answer: 'Des plongeurs sont sous l’eau', wrong: ['Le bateau est en détresse', 'Le bateau est au mouillage', 'Pêche en cours'] },
        { prompt: 'Près d’un bateau qui arbore le pavillon Alpha, je…', answer: 'Ralentis et reste à bonne distance', wrong: ['Passe au ras pour voir les bulles', 'Accélère pour m’éloigner vite', 'Mouille juste à côté'] },
      ],
      statements: [
        ['Le pavillon Alpha signale des plongeurs.', true],
        ['On peut passer à pleine vitesse près d’un pavillon Alpha si on ne voit pas de bulles.', false],
      ],
    },
    {
      id: 'towing', name: 'Ski nautique et engins tractés', visual: e('🏄'),
      intro: 'Pour tracter un skieur, une bouée ou un wakeboard : **2 personnes d’au moins 16 ans** à bord, **l’une conduit**, **l’autre surveille** les personnes tractées. Elles portent un **gilet de couleur vive**, et le bateau doit pouvoir **les embarquer toutes** en plus de l’équipage.',
      questions: [
        { prompt: 'Combien de personnes faut-il au minimum à bord du bateau tracteur ?', answer: '2 : un pilote et un observateur', wrong: ['1 seul pilote', '3 personnes', 'Aucune règle'] },
        { prompt: 'Le rôle de la deuxième personne à bord est de…', answer: 'Surveiller en permanence les personnes tractées', wrong: ['Prendre des photos', 'Préparer le mouillage', 'Conduire à tour de rôle'] },
      ],
      statements: [
        ['Les personnes tractées portent un gilet de couleur vive.', true],
        ['Un pilote seul peut tracter une bouée s’il regarde dans son rétroviseur.', false],
      ],
    },
    {
      id: 'locks', name: 'Passer une écluse', visual: e('🚦'),
      intro: 'À l’approche d’une écluse, on **ralentit** et on **attend son tour**. **Feu rouge** : accès interdit. **Rouge et vert** : l’écluse se prépare. **Feu vert** : on peut entrer. Dans le sas : bateau **amarré**, **défenses** en place, **moteur arrêté**, et on suit les instructions de l’éclusier.',
      questions: [
        { prompt: 'Feux rouge et vert allumés ensemble à l’entrée d’une écluse :', answer: 'Elle se prépare, l’accès est encore interdit', wrong: ['J’entre tout de suite', 'L’écluse est hors service pour la journée'] },
        { prompt: 'Dans le sas d’une écluse, mon moteur est…', answer: 'Arrêté, le bateau amarré', wrong: ['Au ralenti pour rester au centre', 'Embrayé en avant'] },
      ],
      statements: [
        ['On n’entre dans une écluse qu’au feu vert ou sur instruction de l’éclusier.', true],
        ['Dans le sas, on peut laisser le bateau dériver sans l’amarrer.', false],
      ],
    },
  ],
  lessons: [
    {
      id: 'permis-papiers', title: 'Permis, papiers, chef de bord', icon: e('🪪'), cards: ['licence', 'papers', 'skipper'], count: 8,
      tip: { emoji: '🪪', title: '6 ch, 16 ans, 6 milles', text: 'Permis obligatoire au-delà de **4,5 kW (6 ch)**, dès **16 ans**. Le côtier va jusqu’à **6 milles d’un abri**, de jour comme de nuit.' },
    },
    { id: 'bateau-autonomie', title: 'Le bateau et son autonomie', icon: e('🏷️'), cards: ['ce-categories', 'fuel'], count: 8 },
    { id: 'conduite', title: 'Alcool et maîtrise', icon: e('🚫'), cards: ['alcohol'], count: 5 },
    { id: 'cohabitation', title: 'Plongeurs, ski, écluses', icon: e('🤿'), cards: ['divers', 'towing', 'locks'], count: 8 },
    {
      id: 'revision-reglementation', title: 'Révision', icon: e('🧭'), count: 10, review: true,
      cards: ['licence', 'papers', 'skipper', 'ce-categories', 'fuel', 'alcohol', 'divers', 'towing', 'locks'],
    },
  ],
})
