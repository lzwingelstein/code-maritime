# Permis côtier — Règles de jeu (résumé pour le code)

## Vision
On apprend le code du permis côtier par séries courtes de questions, avec les mécaniques de Duolingo.
Les thèmes de l'examen deviennent des **unités** ; la première est le balisage, le plus visuel et le plus piégeux.

## Accueil
- En haut, une seule action : la jauge **« Prêt pour l’examen »** (pourcentage, leçons restantes et date de fin estimée ; touche → stats), puis **un gros bouton** « Continuer » (nom de la leçon dessous) ou « Retravailler mes points faibles », avec la raison en une ligne et une alternative en lien.
- Le chemin des leçons vient dessous, puis l’examen blanc.
- Ni XP ni objectif du jour à l’écran : ils encombraient sans aider à se préparer (l’XP reste compté dans les données).

## Parcours
- Une unité = une suite de **leçons** débloquées dans l'ordre (la précédente finie une fois). Une leçon déjà faite reste ouverte, même si une leçon est ajoutée avant elle.
- **Préparation à l’examen** (en-tête, stats, fin de leçon) : moyenne du parcours fait et des fiches maîtrisées (niveau 3 = sue) ; date de fin du parcours estimée à ton rythme (nouvelles leçons par jour sur 14 jours, au moins 3 jours comptés ; 2 par jour tant qu'il n'est pas connu). La flamme (série de jours) n’est plus affichée.
- Une leçon finie affiche ✓ ; elle reste rejouable. Au plus 2 leçons avec des erreurs récentes sont marquées « À revoir ».
- La dernière leçon de l'unité est une **révision** : elle mélange toutes les marques et insiste sur les plus faibles.

### Pour commencer · Les bases du bord (hors examen)
Le vocabulaire que les questions utilisent sans l'expliquer. Ce n'est pas un point du programme : l'unité ouvre le parcours mais l'examen blanc n'y puise pas. Schéma d'un bateau vu de dessus (ou de profil), la partie demandée marquée « ? ».
1. Se repérer à bord : avant (proue) et arrière (poupe), bâbord et tribord, travers (et « plus de 22,5° sur l'arrière du travers »)
2. La coque et le vent : ligne de flottaison et tirant d'eau ; amures, au vent, sous le vent
3. Révision

### Unité 1 · Le balisage (région A)
1. Marques latérales (bâbord, tribord)
2. Voyants cardinaux (le voyant seul)
3. Couleurs et passage (bouée entière, côté des eaux saines)
4. Feux cardinaux (rythmes de nuit)
5. Autres marques (danger isolé, eaux saines, marque spéciale)
6. Révision

### Unité 2 · Feux et marques des navires
1. Navire à moteur (moins et plus de 50 m) : secteurs des feux, « sous quel angle je le vois »
2. Le voilier (pas de feu de tête de mât)
3. Pêche et bateau pilote (vert sur blanc, rouge sur blanc, blanc sur rouge)
4. Mouillage et navires gênés (un blanc, deux rouges, rouge-blanc-rouge, trois rouges)
5. Marques de jour (boule, deux boules, boule-losange-boule, cylindre, cônes, voilier au moteur)
6. Révision

De nuit, on ne voit que les feux visibles sous cet angle (tête de mât vers l'avant, rouge à bâbord, vert à tribord,
poupe vers l'arrière, les autres sur tout l'horizon). Jamais de question d'identification vue de l'arrière :
presque tous les navires n'y montrent qu'un feu blanc. Deux navires aux mêmes marques de jour (chalutier et autre
pêcheur) ne sont jamais proposés ensemble.

Les unités se suivent : la première leçon d'une unité s'ouvre quand la dernière de la précédente est faite.

## Une leçon
- Une **astuce** d'ouverture (moyen mnémotechnique), puis pour chaque marque jamais vue une carte
  **« Nouvelle marque »** suivie d'une première question facile, puis un mélange (8 à 12 questions).
- Formes de question (balisage) : reconnaître (bouée → nom), retrouver (nom → bouée), naviguer (de quel côté passer),
  de nuit (feu animé → marque), comprendre (signification → bouée), vrai ou faux.
- On choisit puis **« Vérifier »** ; le verdict s'affiche dans une bannière en bas (✓/✗ et texte), puis « Continuer ».
  Pas de passage automatique.
- **Pas de cœurs** : une question ratée revient à la fin sous une autre forme (nouveaux choix), marquée
  « ↻ Tu l'avais ratée », **jusqu'à ce qu'elle soit réussie**. La série ne se termine que quand tout est bon ;
  l'en-tête affiche le nombre de questions ratées encore à refaire. La barre de progression ne recule jamais.

## Progression
- **XP** (compté, plus affiché) : 10 par leçon, +5 sans aucune erreur, +1 par série de 3 bonnes réponses (5 au plus).
- **Objectif du jour** (30 XP) et **série** : comptés dans les données, plus affichés.
- **Répétition espacée** (comme BirdGuessr) : bonne réponse → la marque monte d'un niveau et revient après
  1 jour, 3 jours, 1 semaine puis 3 semaines ; erreur → elle redescend et redevient à revoir. Sert aux révisions.
- Tout est gardé dans le navigateur (pas de compte dans le prototype).

## Entraînement
- Série de **15 questions** qui **mélange toutes les unités**, uniquement sur les fiches **déjà vues**.
- Tirage pondéré par la maîtrise (répétition espacée), **au carré** : les fiches ratées récemment ou à revoir
  reviennent bien plus souvent que les fiches sues. Jamais deux fois la même fiche d'affilée.
- Comme une leçon : pas de cœurs, les erreurs reviennent jusqu'à être réussies ; XP et série du jour comptés.
- Entraînement **par thème** depuis les stats (une seule unité, dès 2 fiches vues).
- Ouvert dès 4 fiches vues ; l'accueil affiche le nombre de « points à retravailler »
  (fiches au niveau 0 ou 1 et à revoir).

## Examen blanc
- Au format officiel : **40 questions**, **5 erreurs au plus**, environ **30 minutes** (chrono affiché, pas bloquant).
- Questions tirées **à parts égales de toutes les unités** (leur leçon de révision), jamais deux fois la même.
- Pas de cœurs ni de question qui revient : chaque erreur compte. On garde la correction après chaque réponse pour apprendre.
- Résultat : « Reçu » ou « Pas encore », score, erreurs, temps (20 XP comptés si reçu, 10 sinon, non affichés). Les 10 derniers résultats sont gardés ; l'accueil affiche le meilleur et le dernier.
- Toujours accessible, sous le parcours.

## Pistes
- Unités suivantes (issues GitHub) : règles de barre et de route, signaux sonores et de détresse, VHF,
  sécurité et armement, météo.
