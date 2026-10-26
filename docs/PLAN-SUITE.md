# Suite du plan : retours du premier essai sur téléphone (26/10/2026)

Retours de Hugo après le premier essai des étapes 6 à 9, rangés en étapes. Une étape à la fois, validée avant la
suivante (CLAUDE.md). Pour chaque étape : ce que fait l'app, et ce qu'il faut côté serveur ou base (à écrire dans
`docs/MANQUES-SERVEUR.md`, aucune table ni colonne ajoutée sans montrer la migration d'abord).

## Étape 10 — Finir l'inscription (questionnaires par blocs, sauvegarde à tout moment) — FAITE (voir docs/ETAPE-10-QUESTIONNAIRE.md)

Problème : après l'inscription rapide, le coach génère des séances sans connaître les charges (1RM), les records ni
les allures. Une séance « à RPE 9 » ou « à 80 % » ne veut rien dire sans ces données.

- Bandeau « Finir mon inscription » sur Aujourd'hui et dans le Profil tant que le questionnaire long n'est pas
  terminé (avec le pourcentage rempli). Il ne disparaît que quand tout est rempli.
- Questionnaire découpé en blocs de 3 à 5 questions. Chaque bloc est enregistré dès qu'on le valide ; « Enregistrer
  et quitter » à tout moment ; on reprend au premier bloc non fait.
- Ordre : d'abord ce qui sert à construire les séances.
  1. Sport et exercices pratiqués.
  2. Maximums : 1RM (ou meilleure série, ex. 5 × 100 kg, convertie par le serveur) sur les exercices clés du sport.
  3. Records et allures : 5 km, 10 km, semi, marathon, VMA, FC max / repos (selon le sport).
  4. Habitudes : volume par semaine, allure habituelle, séances types.
  5. Vie : sommeil, travail, stress, fréquence possible.
- Côté serveur / base : les maximums et records vont dans `tests_athlete` (route existante `POST /tests`) ;
  à vérifier pour les habitudes et la vie (colonnes existantes de `user_profiles.contexte_vie` ?) ; un champ
  « avancement du questionnaire » par athlète (bloc fait / pas fait) est à créer. Le générateur de séances doit
  refuser d'inventer une charge sans maximum connu (demander plutôt un test ou une séance de calibration).

## Étape 11 — Profil physique accessible — FAITE (Profil → Mon corps, `app/compte/corps.tsx`)

- Carte « Mon corps » en haut du Profil et accès direct depuis Aujourd'hui : poids, taille (rapide), puis section
  avancée : fréquence cardiaque de repos, sommeil moyen, masse grasse si connue…
- Le poids débloque le plan nutrition du jour (aujourd'hui : « poids inconnu »).
- Côté base : colonnes existantes de `user_profiles` (à vérifier : `poids_kg`, `taille_cm`…), historique du poids
  si on veut une courbe.

## Étape 12 — Objectif principal et sous-objectifs construits avec le coach — FAITE (Programme → Mon objectif)

- Un objectif principal (ex. « Jeux olympiques dans 4 ans et 7 mois ») et des étapes intermédiaires datées
  (ex. « marathon en 3 h », « +15 % de charge en 12 semaines »), affichées comme une frise dans Programme.
- Construites ensemble dans le Coach : il propose les étapes, l'athlète les accepte, les modifie ou les refuse.
- Côté serveur / base : table des sous-objectifs (à créer, migration à montrer), route de proposition par le coach.

## Étape 13 — Coach plus précis et plus général — FAITE côté app (le vrai coach : docs/MANQUES-SERVEUR.md §9)

- Adapter la séance du jour selon la forme, une blessure, le temps disponible (le serveur le fait en partie :
  propositions avant / après déjà en place côté app).
- Répondre aux questions générales de l'app (« change la langue », « où est mon abonnement ») : actions simples
  exécutées par l'app avec confirmation.
- Crédits : 50 par mois aujourd'hui, à revoir (décision produit et serveur).
- Côté serveur : brancher la vraie route `POST /coach/messages` (`docs/MANQUES-SERVEUR.md` §3), puis passer
  `COACH_FICTIF` à `false`.

## Étape 14 — Nutrition du jour complète — FAITE (Aujourd'hui → Nutrition, `app/nutrition/`, serveur : docs/MANQUES-SERVEUR.md §10)

- Saisir ce qu'on a mangé (repas, aliments, quantités), voir l'écart avec les objectifs : calories, protéines,
  glucides, lipides, micronutriments principaux, équilibre, et le moment conseillé des glucides et protéines
  autour des séances.
- Côté serveur / base : journal alimentaire (table et routes à créer), base d'aliments (à choisir : table
  existante ? source externe ?), calcul des objectifs par le serveur.

## Design

- Abandonné (décision du 26/10/2026).

## Questions à trancher avant de commencer

1. Ordre des étapes : 10 → 11 → 12 → 13 → 14 te convient ?
2. Étape 10 : quels exercices « clés » par sport pour les maximums (ex. musculation : squat, développé couché,
   soulevé de terre, développé militaire, traction) ? Je peux proposer une liste par sport à valider.
3. Peut-on ajouter en base la table d'avancement du questionnaire et celle des sous-objectifs (migrations
   montrées avant) ?
4. Nutrition : as-tu déjà une base d'aliments dans Supabase, ou faut-il en choisir une ?
