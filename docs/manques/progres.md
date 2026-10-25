# Routes manquantes côté serveur — onglet Progrès (étape 8)

Document à transmettre tel quel au serveur `coachia-agents-v6`. Même règles que `docs/MANQUES-SERVEUR.md` :
toutes les routes sont sous `/api/athlete`, protégées par le jeton Supabase de l'athlète
(`Authorization: Bearer <access_token>` → `req.userId`) ; **aucune** ne lit un `userId` dans le corps ou l'URL.
Réponses en JSON ; erreurs au format existant `{ "erreur": "message" }` (400 / 403 / 404, 500 → `{ "erreur": "erreur serveur" }`).
Toutes acceptent `Accept-Language: fr | en` : les textes (titres de records, libellés de qualités, noms de ligues et
de défis, règle de la semaine réussie) sont rédigés dans cette langue. Dates au format `AAAA-MM-JJ` (heure de Paris).

**Constante côté app : `PROGRES_FICTIF` dans `features/progres/source.ts`.** Elle couvre les cinq routes ci-dessous :
la passer à `false` quand **toutes** sont en ligne (rien d'autre ne change dans l'app). Tant qu'elle vaut `true`, les
cartes alimentées par ces routes portent l'étiquette « Exemple ».

Routes déjà utilisées en vrai par l'onglet (rien à faire) : `GET /tests`, `GET /tests/types`, `POST /tests`,
`GET /progressions`, `GET /assiduite`, `GET /profil` (champ `charge`).

Règles communes, à appliquer **côté serveur aussi** :
- Les records et jalons sont des **faits réels** (séries réellement enregistrées, tests saisis, séances terminées) :
  jamais une prévision, jamais un compliment.
- **Aucun classement sur le poids** (ni masse, ni IMC) **ni sur le volume d'entraînement** (minutes, séances, tonnage,
  distance cumulée). L'app filtre aussi ces critères par prudence.
- **Pas de classement public avant 15 ans** (âge calculé depuis `user_profiles.date_naissance` ; date absente = non
  autorisé).

---

## 1. Records et jalons

### GET /progres/records
- Protection : jeton. Corps : aucun. Paramètre facultatif `?limite=50` (défaut 50).
- Records : meilleure valeur d'un test (`tests_athlete`, en tenant compte de `types_tests.plus_haut_mieux`), meilleur
  1RM estimé d'un exercice d'après les séries réelles (`progressions_exercice`), meilleur résultat de compétition.
  `precedent` = l'ancien record battu (absent pour un premier résultat, qui n'est pas un record).
- Jalons : faits datés (« 50e séance terminée », « premier bloc terminé », « première compétition »). Pas de jalon
  sur le volume présenté comme un classement.
- Tri : du plus récent au plus ancien. Le premier élément alimente la carte « Dernier record ou jalon » (Progrès et,
  plus tard, Aujourd'hui).
- Réponse 200 :
```json
[
  {
    "id": "8c1f5a8e-2b7d-4a51-9a64-3c1f0e2d9b10",
    "nature": "record",
    "date": "2026-10-21",
    "titre": "Squat barre · 1RM estimé",
    "valeur": 112.5,
    "unite": "kg",
    "precedent": { "valeur": 107.5, "date": "2026-09-17" },
    "origine": { "type": "seance", "id": "1d0c7b9a-55f2-4c1e-b8a7-0f3e6d2c4a91" }
  },
  {
    "id": "f2a9c3d4-7e61-4b0a-8d25-6c9b1e0f7a32",
    "nature": "jalon",
    "date": "2026-10-16",
    "titre": "50e séance terminée",
    "valeur": null,
    "unite": null,
    "precedent": null,
    "origine": { "type": "seance", "id": "2b4e6f80-1a3c-4d5e-9f70-8a1b2c3d4e5f" }
  }
]
```
- `nature` : `record` | `jalon`. `origine.type` : `seance` | `test` | `competition` | `programme`.
- Écrans : Progrès (carte « Dernier record ou jalon », vue `/progres/records`) ; Aujourd'hui (carte « Dernier record »,
  `features/progres/components/CarteDernierRecord.tsx`).

## 2. Niveaux en percentile

### GET /progres/niveaux
- Protection : jeton. Corps : aucun.
- Une entrée par qualité physique mesurée (`force_relative`, `vma`, `detente`, `vitesse`, `endurance`), calculée à
  partir du test le plus récent et encore valable (`types_tests.validite_jours`).
- **Groupe de comparaison obligatoire** pour chaque qualité : niveau, tranche d'âge, sexe, sport, effectif. Le
  percentile n'est renvoyé que si l'effectif du groupe est suffisant (seuil à fixer côté serveur, par exemple 30) ;
  sinon la qualité passe dans `manquantes` ou le groupe est élargi (et l'élargissement se voit dans le groupe renvoyé).
- `percentile` : entier de 0 à 100 = part du groupe que l'athlète dépasse (« mieux que 72 % »).
- `force_relative` = 1RM / poids de corps : c'est un rapport de force, pas un classement sur le poids.
- Jamais de qualité sur le poids ni sur le volume d'entraînement.
- Réponse 200 :
```json
{
  "qualites": [
    {
      "qualite": "vma",
      "libelle": "VMA",
      "percentile": 72,
      "valeur": 17.5,
      "unite": "km/h",
      "test": { "slug": "vma", "date": "2026-10-09", "methode": "teste" },
      "groupe": {
        "niveau": "amateur",
        "tranche_age": "25-34",
        "sexe": "homme",
        "sport": { "slug": "boxe_anglaise", "nom": "Boxe anglaise" },
        "effectif": 1240
      }
    },
    {
      "qualite": "force_relative",
      "libelle": "Force relative",
      "percentile": 64,
      "valeur": 1.5,
      "unite": "× poids du corps",
      "test": { "slug": "1rm", "date": "2026-10-21", "methode": "estime_seance" },
      "groupe": {
        "niveau": "amateur",
        "tranche_age": "25-34",
        "sexe": "homme",
        "sport": { "slug": "boxe_anglaise", "nom": "Boxe anglaise" },
        "effectif": 980
      }
    }
  ],
  "manquantes": [
    {
      "qualite": "endurance",
      "libelle": "Endurance",
      "test_conseille": { "slug": "cooper", "nom": "Test de Cooper (12 min)" }
    }
  ]
}
```
- `groupe.niveau` : `debutant` | `amateur` | `confirme` | `pro` | `elite` ; `groupe.sexe` : `homme` | `femme` | `null` ;
  `test.methode` : valeurs de `tests_athlete.methode`. `test_conseille.slug` est un slug de `types_tests` (l'app ouvre
  « Ajouter un résultat » avec ce test présélectionné).
- Écrans : Progrès (carte « Niveaux », vue `/progres/niveaux`, détail `/progres/niveaux?qualite=vma`).

## 3. Charge par semaine et zone optimale

### GET /progres/charge?semaines=12
- Protection : jeton. Corps : aucun. `semaines` : 4 à 26 (défaut 12).
- Charge d'une semaine (lundi → dimanche) = somme des sRPE des séances réalisées (RPE × durée en minutes), même calcul
  que `profil_avance.charge`. La dernière semaine est la semaine en cours (`en_cours: true`).
- `zone_optimale` : bornes de la zone optimale **de la semaine en cours**, calculées par le serveur selon sa doctrine
  ACWR (par exemple 0,8 à 1,3 × la moyenne hebdomadaire des 4 semaines précédentes). L'app ne fait que la dessiner.
  `null` si les données ne suffisent pas.
- `donnees_suffisantes` : même règle que `profil_avance.charge.donnees_suffisantes`.
- Réponse 200 :
```json
{
  "unite": "UA",
  "semaines": [
    { "debut": "2026-08-03", "charge": 980, "seances": 3, "en_cours": false },
    { "debut": "2026-08-10", "charge": 1120, "seances": 4, "en_cours": false },
    { "debut": "2026-08-17", "charge": 1240, "seances": 4, "en_cours": false },
    { "debut": "2026-08-24", "charge": 1310, "seances": 4, "en_cours": false },
    { "debut": "2026-08-31", "charge": 860, "seances": 3, "en_cours": false },
    { "debut": "2026-09-07", "charge": 1290, "seances": 4, "en_cours": false },
    { "debut": "2026-09-14", "charge": 1380, "seances": 4, "en_cours": false },
    { "debut": "2026-09-21", "charge": 1450, "seances": 4, "en_cours": false },
    { "debut": "2026-09-28", "charge": 1010, "seances": 3, "en_cours": false },
    { "debut": "2026-10-05", "charge": 1420, "seances": 4, "en_cours": false },
    { "debut": "2026-10-12", "charge": 1510, "seances": 4, "en_cours": false },
    { "debut": "2026-10-19", "charge": 1180, "seances": 2, "en_cours": true }
  ],
  "zone_optimale": { "min": 1050, "max": 1710 },
  "donnees_suffisantes": true
}
```
- Une semaine sans séance renvoie `"charge": 0, "seances": 0` (elle reste dans la liste).
- Écrans : Progrès (carte « Charge d'entraînement », vue `/progres/charge`). La zone affichée en mots (« Dans ta zone
  optimale », « En hausse rapide »…) vient déjà de `GET /profil` → `charge.zone`.

## 4. Régularité

### GET /progres/regularite?semaines=12
- Protection : jeton. Corps : aucun. `semaines` : 4 à 52 (défaut 12).
- Une semaine (lundi → dimanche) est `reussie` selon la règle du serveur (par exemple ≥ 80 % des séances prévues
  faites), `non_reussie` sinon, `pause` quand aucune séance n'était prévue (vacances, blessure, semaine retirée par le
  coach) et `en_cours` pour la semaine actuelle. Une semaine `pause` ne compte pas et ne casse pas la série.
- `regle` : la règle en une phrase, rédigée par le serveur (affichée telle quelle).
- `semaines_comptees` = semaines `reussie` + `non_reussie` sur la période ; `serie_en_cours` = semaines réussies
  d'affilée jusqu'à la dernière semaine terminée ; `meilleure_serie` sur tout l'historique.
- Réponse 200 :
```json
{
  "regle": "Une semaine est réussie quand tu fais au moins 80 % des séances prévues. Une semaine sans séance prévue ne compte pas.",
  "semaines": [
    { "debut": "2026-08-03", "prevues": 4, "faites": 4, "statut": "reussie" },
    { "debut": "2026-08-10", "prevues": 4, "faites": 4, "statut": "reussie" },
    { "debut": "2026-08-17", "prevues": 4, "faites": 2, "statut": "non_reussie" },
    { "debut": "2026-08-24", "prevues": 4, "faites": 4, "statut": "reussie" },
    { "debut": "2026-08-31", "prevues": 0, "faites": 0, "statut": "pause" },
    { "debut": "2026-09-07", "prevues": 4, "faites": 4, "statut": "reussie" },
    { "debut": "2026-09-14", "prevues": 4, "faites": 4, "statut": "reussie" },
    { "debut": "2026-09-21", "prevues": 4, "faites": 2, "statut": "non_reussie" },
    { "debut": "2026-09-28", "prevues": 4, "faites": 4, "statut": "reussie" },
    { "debut": "2026-10-05", "prevues": 4, "faites": 4, "statut": "reussie" },
    { "debut": "2026-10-12", "prevues": 4, "faites": 4, "statut": "reussie" },
    { "debut": "2026-10-19", "prevues": 4, "faites": 2, "statut": "en_cours" }
  ],
  "semaines_reussies": 8,
  "semaines_comptees": 10,
  "serie_en_cours": 3,
  "meilleure_serie": 3
}
```
- Écrans : Progrès (carte « Régularité », vue `/progres/regularite`). Le taux sur 28 jours vient de `GET /assiduite`.
- Remarque : la série de semaines réussies est aussi attendue sur Aujourd'hui (flamme orange de la carte séance,
  docs/ECRANS.md §1) : `serie_en_cours` peut être ajouté à `GET /accueil`.

## 5. Ligues et défis

### GET /progres/ligues
- Protection : jeton. Corps : aucun.
- **Avant 15 ans (ou date de naissance absente) : `200 { "autorise": false, "ligues": [], "defis": [] }`**, sans rien
  d'autre. L'app ne lance même pas la requête dans ce cas, mais le serveur doit appliquer la règle lui-même.
- Ligues : au choix (l'athlète les rejoint ou les quitte). Critères autorisés : performances mesurées (tests, qualités).
  Critères interdits : poids, masse, IMC, volume, tonnage, minutes, séances, durée, distance cumulée.
  `rang` n'est renvoyé que si l'athlète a rejoint la ligue (`inscrit: true`), sinon `null`.
- Défis : personnels (tables existantes `defis` / `user_defis` : `valeur_actuelle`, `valeur_cible`, `date_expiration`,
  `statut`). `nom`, `description` et `unite` rédigés par le serveur.
- Réponse 200 :
```json
{
  "autorise": true,
  "ligues": [
    {
      "id": "5b0e7c12-9d3a-4f61-a2b8-7e4c1d0f3a95",
      "nom": "Ligue VMA · boxe amateurs",
      "critere": "vma",
      "critere_libelle": "VMA (test)",
      "inscrit": true,
      "rang": 14,
      "participants": 86,
      "fin": "2026-11-30"
    },
    {
      "id": "c7d1e2f3-4a5b-4c6d-8e9f-0a1b2c3d4e5f",
      "nom": "Ligue détente · 25-34 ans",
      "critere": "detente",
      "critere_libelle": "Saut vertical (test)",
      "inscrit": false,
      "rang": null,
      "participants": 212,
      "fin": "2026-11-14"
    }
  ],
  "defis": [
    {
      "id": "0e9d8c7b-6a5f-4e3d-2c1b-0a9f8e7d6c5b",
      "nom": "Quatre semaines réussies",
      "description": "Réussis 4 semaines d'affilée.",
      "valeur_actuelle": 3,
      "valeur_cible": 4,
      "unite": "semaines",
      "date_expiration": "2026-11-21",
      "statut": "en_cours"
    }
  ]
}
```
- `defis[].statut` : `en_cours` | `complete` | `expire`.
- Écrans : Progrès (carte « Ligues et défis », visible à partir de 15 ans ; vue `/progres/ligues`).

### POST /progres/ligues/:id/rejoindre et POST /progres/ligues/:id/quitter
- Protection : jeton. Corps : aucun. `:id` = identifiant de la ligue.
- `rejoindre` : 403 `{ "erreur": "classement réservé aux 15 ans et plus" }` avant 15 ans ; 404 si la ligue n'existe pas
  ou n'est plus ouverte. Idempotent (rejoindre deux fois ne crée pas de doublon).
- Réponse 200 : `{ "id": "5b0e7c12-9d3a-4f61-a2b8-7e4c1d0f3a95", "inscrit": true }` (`false` après `quitter`).
- Écran : vue `/progres/ligues` (boutons « Rejoindre » / « Quitter »). L'app relit ensuite `GET /progres/ligues`.
