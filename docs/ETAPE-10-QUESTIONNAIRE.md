# Étape 10 — Questionnaire complet par blocs (proposition à valider)

Source : « Athlenis — Questionnaire complet de l'athlète » (PDF du 26/10/2026, 30 pages). Les identifiants de
questions (TC41, MU04, CO05…) sont repris tels quels comme clés dans le code.

## 1. Valeurs clés et tests par sport (proposition)

Principe du questionnaire : on demande d'abord ce que l'athlète connaît (valeur + date + méthode : connue, montre,
estimée) ; s'il ne sait pas, on propose un test court guidé. Chaque valeur va dans `tests_athlete` (route existante
`POST /tests`) avec un type de `types_tests`.

| Sport | Valeurs demandées (dans l'ordre) | Test proposé si inconnu |
| --- | --- | --- |
| Musculation | 1RM (ou charge × répétitions, 1RM estimé par le serveur) : squat barre, développé couché barre, soulevé de terre, développé militaire, rowing barre ; tractions et pompes max d'affilée | Répétitions maximales à charge sous-maximale (jamais de 1RM réel pour un débutant) |
| Course à pied | Temps récents 5 km, 10 km, semi, marathon ; VMA ; allure au seuil ; FC max et repos | Test de Cooper (12 min) |
| Trail | Comme la course + dénivelé positif par semaine, plus longue course en trail (km, D+, temps) | Cooper ; montée chronométrée plus tard |
| Cyclisme | FTP (si capteur de puissance), PMA, FC au seuil, FC max | Test de 20 min (capteur ou home-trainer), sinon FC au seuil |
| Natation | Temps 100 m, 200 m et 400 m crawl (la CSS est calculée par le serveur) | 400 m puis 200 m chronométrés |
| Triathlon | Les valeurs clés des trois sports (VMA ou 10 km, FTP, CSS) | Un test par discipline sur 2 semaines |
| Boxe anglaise | **Cardio d'abord** : VMA (ou Cooper), FC repos et max ; puis explosivité : saut vertical (CMJ), sprint 10 m, T-test (appuis) ; gainage max ; pompes et tractions max | Cooper, CMJ, T-test, gainage (sans matériel) |
| MMA | Comme la boxe + force de préhension et 1RM squat / soulevé de terre si salle | Idem boxe |
| Football | VMA (ou Cooper), sprint 10 m et 30 m, T-test, CMJ | Sprints et T-test sur terrain, Cooper |
| Remise en forme | FC de repos, gainage max, mobilité de cheville, souplesse (sit and reach), pompes max | Les mêmes, guidés à la maison |
| Tous | FC de repos au réveil, mobilité de cheville | Guidés, sans matériel |

Types de tests à **ajouter** dans `types_tests` (les autres existent déjà : 1rm, reps_max, vma, cooper,
allure_seuil, ftp, pma, css, fc_max, fc_repos, fc_seuil, cmj, sprint_10m, sprint_30m, t_test, gainage_max,
grip, mobilite_cheville, sit_and_reach) : `temps_5km`, `temps_10km`, `temps_semi`, `temps_marathon`
(secondes, plus bas = mieux), `nage_100m`, `nage_200m`, `nage_400m` (secondes).

## 2. Migration (additive, NON appliquée) — `docs/migrations/2026-10-26-questionnaire.sql`

Ce qui manque en base d'après le questionnaire (tout le reste existe déjà : `preferences_athlete`,
`preferences_nutrition`, `sante_athlete`, `sante_feminine`, `blessures`, `tests_athlete`, colonnes de
`user_profiles`, `user_sport_profiles.profil_specifique`) :

- table `questions_posees` : une ligne par athlète et par question (répondue, passée, « plus tard »), pour
  reprendre où on s'est arrêté, calculer le pourcentage et ne jamais reposer une question ;
- table `indisponibilites_athlete` (vacances, examens : début, fin, raison) ;
- table `comptes_parents` (moins de 15 ans) ;
- colonnes `sante_athlete.signaux_effort` (jsonb), `user_profiles.acces_piste` (bool),
  `preferences_athlete.recuperation` (text[]) ;
- les 7 types de tests ci-dessus.

Chaque nouvelle table a la RLS « l'athlète ne lit et n'écrit que ses lignes ».

## 3. Ce que fera l'app (étape 10)

- **Questionnaire par blocs** de 3 à 5 questions, une question par écran, « Je ne sais pas » / « Passer »
  partout sauf ★. Chaque réponse est enregistrée tout de suite ; « Enregistrer et quitter » à tout moment ; on
  reprend à la première question non traitée.
- **Ordre des blocs** (le plus utile au programme d'abord) :
  1. Valeurs connues et tests (TC100 à TC104 + valeurs du sport, tableau ci-dessus).
  2. Bloc du sport principal (MU, CO, TR, CY, NA, TRI, BX, MM, FO ou GE : questions C).
  3. Niveau et historique (TC41 à TC48).
  4. Disponibilités détaillées, lieux, matériel (TC63 à TC73).
  5. Santé : historique (TC90 à TC97) et sécurité si elle manque (TC80 à TC85) — seulement avec le consentement.
  6. Nutrition de base (TC110 à TC119) et sommeil (TC125, TC127).
  7. Préférences et style de coaching (TC130 à TC141).
- **Bandeau « Finir mon inscription · 35 % »** sur Aujourd'hui et dans le Profil tant qu'il reste des questions
  C ; il ouvre la liste des blocs avec l'avancement de chacun.
- **Mon corps** en haut du Profil : taille, poids (facultatif, règles d'âge du questionnaire), latéralité, puis
  sommeil, stress, activité quotidienne.
- Écritures directes Supabase sur les tables de l'athlète (RLS) ; valeurs et tests par `POST /tests` ; questions de
  santé seulement avec le consentement (la base refuse sinon).
- Les questions J (une par jour sur Aujourd'hui, déclencheurs) viendront dans une étape suivante.

## 4. Côté serveur (à ajouter dans `docs/MANQUES-SERVEUR.md`)

- Le générateur ne doit plus inventer une charge ou une allure sans valeur connue : utiliser `tests_athlete`,
  sinon prescrire au ressenti (RPE) avec une séance de test dans la première semaine.
- Lire les nouvelles réponses (`profil_specifique`, préférences, santé) pour affiner le programme et recalculer
  après chaque bloc terminé.
