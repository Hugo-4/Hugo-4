# Manques côté serveur — Programme (étape 7)

À transmettre au serveur `coachia-agents-v6`. Mêmes conventions que `docs/MANQUES-SERVEUR.md` : routes sous
`/api/athlete`, protégées par le jeton Supabase (`Authorization: Bearer <access_token>`, `req.userId`), **aucun**
`userId` dans le corps ou l'URL, erreurs `{ "erreur": "message" }`, en-tête `Accept-Language: fr | en`.

L'écran Programme est branché sur les routes existantes (aucune source fictive) : `GET /programme`,
`GET /calendrier?mois=`, `GET /calendrier/legende`, `GET /programme/seances/:id` (202 `en_preparation` → nouvel
essai toutes les 4 s), `POST /programme/adapter` (`deplacer`), `POST /programme/seances/:id/manquee`,
`GET /programme/adaptations`, `GET/POST /evenements`, `PATCH/DELETE /evenements/:id`. Les manques ci-dessous ont un
contournement en place ; il suffira de le retirer quand le serveur sera prêt.

---

## 1. Précision d'une compétition dans `CHAMPS_EVT` (POST / PATCH /evenements)

**Constat.** `CHAMPS_EVT` (`routes/athlete.js`) ne contient ni `categorie_poids_kg`, ni distance, ni poste.

**Contournement actuel (app).**
- Catégorie de poids (boxe, MMA…) : la compétition est créée / modifiée par la route, puis l'app écrit
  `categorie_poids_kg` **en direct** dans `evenements_athlete` avec Supabase (RLS « evenements_proprietaire »),
  filtré sur `id` ET `user_id = session.user.id` (`features/programme/mutationsEvenement.ts`).
- Distance (course, trail, triathlon, natation, vélo) et poste (sports collectifs) : envoyés dans `discipline`
  (champ accepté).

**Demande.** Ajouter à `CHAMPS_EVT` : `categorie_poids_kg` (nombre, 30 à 200), `distance` (texte, 60 caractères
max), `poste` (texte, 60 caractères max), avec les colonnes correspondantes si elles n'existent pas
(`distance`, `poste`). Valider dans `validerEvenement`.

- Méthode / chemin : `POST /evenements` et `PATCH /evenements/:id`
- Protection : jeton (`req.userId`), filtre `user_id = req.userId` comme aujourd'hui.
- Corps (création) :
```json
{
  "nom": "Gala de Lyon",
  "date_evenement": "2027-03-14",
  "priorite": "A",
  "type_evenement": "combat",
  "sport_slug": "boxe_anglaise",
  "categorie_poids_kg": 66,
  "distance": null,
  "poste": null,
  "lieu": "Lyon",
  "notes": "Combat amateur, 3 × 3 min"
}
```
- Réponse 200 (ligne créée, `select('*')` + sport comme `GET /evenements`) :
```json
{
  "id": "6f1c2a9e-3b0d-4c55-9a51-0d6f2f1e8a10",
  "nom": "Gala de Lyon",
  "date_evenement": "2027-03-14",
  "date_fin": null,
  "priorite": "A",
  "type_evenement": "combat",
  "discipline": null,
  "objectif_resultat": null,
  "lieu": "Lyon",
  "notes": "Combat amateur, 3 × 3 min",
  "statut": "prevu",
  "resultat": null,
  "sport_id": "2b7e5d1c-9f4a-4e1b-8c3d-5a6b7c8d9e0f",
  "categorie_poids_kg": 66,
  "distance": null,
  "poste": null,
  "created_at": "2026-10-25T12:00:00.000Z",
  "sports": { "slug": "boxe_anglaise", "nom": "Boxe anglaise" }
}
```
- Écrans : Programme › Nouvelle compétition / Compétition (`app/programme/evenement/nouveau.tsx`, `[id].tsx`).
- Quand c'est en ligne : envoyer `categorie_poids_kg` / `distance` / `poste` dans le corps et supprimer l'écriture
  Supabase directe de `useEnregistrerEvenement`.

## 2. Une seule compétition A par sport, et pas de doublon (POST / PATCH /evenements)

**Constat.** Le serveur accepte plusieurs A « prevu » pour le même sport et deux compétitions identiques (même nom,
même date). L'app applique les deux règles elle-même (confirmation « Tu as déjà « X » en objectif A. La passer
en B ? », puis `PATCH` de l'ancienne en B ; même nom + même date → mise à jour au lieu d'une création), mais un
autre client (ou deux appareils) peut les contourner.

**Demande.** Si la compétition envoyée est A et qu'une autre A `prevu` existe pour le même `sport_id` :
répondre **409** sans rien écrire, sauf si le corps contient `"retrograder_autre_a": true` (l'ancienne passe alors en
B dans la même transaction). Doublon (même `user_id`, `nom` sans casse, `date_evenement`, statut ≠ `annule`) :
mettre à jour l'existante et la renvoyer (200), ou accepter un en-tête `Idempotency-Key`.

- Réponse 409 :
```json
{
  "erreur": "une compétition A est déjà prévue pour ce sport",
  "conflit": { "id": "0a9b8c7d-6e5f-4a3b-2c1d-0e9f8a7b6c5d", "nom": "Championnat régional", "date_evenement": "2027-02-06" }
}
```
- Corps avec confirmation :
```json
{ "nom": "Gala de Lyon", "date_evenement": "2027-03-14", "priorite": "A", "type_evenement": "combat", "sport_slug": "boxe_anglaise", "retrograder_autre_a": true }
```
- Écrans : Programme › compétition (création, modification).

## 3. Couleurs dans `GET /calendrier/legende`

**Constat.** `types`, `statuts` et `badges` n'ont aucune couleur (seulement code → libellé). Les `intensites` ont
une `couleur` en hexadécimal (#4CAF50 … #F44336) qui ne suit pas la palette de l'app (mode sombre, un seul accent,
contrastes vérifiés) : l'app ne l'utilise pas. La pastille du jour est dessinée avec les jetons de
`theme/tokens.ts` : pleine = faite, contour = prévue, contour orange + croix = manquée, trophée = compétition,
intensité en 1 à 5 points pleins (lisible sans couleur, lue par le lecteur d'écran).

**Demande.** Donner une couleur par type et par statut sous forme de **nom de jeton** de l'app (et non d'un code
hexadécimal), pour que la palette reste maîtrisée par l'app :

- Méthode / chemin : `GET /calendrier/legende` (et le champ `legende` de `GET /calendrier`)
- Protection : jeton.
- Corps : aucun.
- Réponse 200 :
```json
{
  "sports": [{ "code": "boxe", "nom": "Boxe anglaise" }],
  "types": [
    { "code": "force", "libelle": "Force", "jeton": "accent" },
    { "code": "endurance", "libelle": "Endurance", "jeton": "info" },
    { "code": "recuperation_active", "libelle": "Récupération active", "jeton": "texte2" }
  ],
  "intensites": [
    { "niveau": 1, "libelle": "Récupération", "rpe": "≤ 4", "jeton": "texte2" },
    { "niveau": 2, "libelle": "Facile", "rpe": "4,5-5,5", "jeton": "texte2" },
    { "niveau": 3, "libelle": "Modérée", "rpe": "6-6,5", "jeton": "vigilance" },
    { "niveau": 4, "libelle": "Difficile", "rpe": "7-7,5", "jeton": "alerte" },
    { "niveau": 5, "libelle": "Très difficile", "rpe": "≥ 8", "jeton": "danger" }
  ],
  "statuts": [
    { "code": "a_venir", "libelle": "À venir", "jeton": "discret" },
    { "code": "faite", "libelle": "Réalisée", "jeton": "accent" },
    { "code": "manquee", "libelle": "Manquée", "jeton": "alerte" }
  ],
  "badges": [{ "code": "cle", "libelle": "Séance clé" }],
  "zones": []
}
```
- Écran : Programme (calendrier du mois, feuille Légende).
- Jetons disponibles côté app : `accent`, `alerte`, `vigilance`, `danger`, `texte`, `texte2`, `discret`
  (`info` à ajouter côté app si le serveur l'utilise). La couleur reste toujours doublée d'une icône ou d'un libellé.

## 4. Textes de la légende et des refus selon `Accept-Language`

**Constat.** Les libellés de `legende()` (types, intensités, statuts, badges, phases), `jour` de `GET /calendrier`
(« lundi »…) et `raison_refus` de `POST /programme/adapter` (« date passée », « créneau déjà occupé »…) sont en
français quelle que soit la langue demandée. L'app traduit elle-même les codes qu'elle connaît (types, statuts,
intensités, phases, catégories d'adaptation) et affiche tel quel le reste.

**Demande.** Rédiger ces textes dans la langue de `Accept-Language` (`fr` ou `en`), ou renvoyer un code stable pour
chaque refus :

- Méthode / chemin : `POST /programme/adapter`
- Réponse 200 (refus) :
```json
{ "portee": "seance", "applique": false, "code_refus": "creneau_occupe", "raison_refus": "Slot already taken" }
```
- Codes proposés : `date_passee`, `hors_semaine`, `creneau_occupe`, `incompatible_recuperation`.
- Écran : Programme › Séance prévue › Déplacer.

## 5. Raison d'une séance manquée dans `GET /programme/seances/:id`

**Constat.** `detailSeance` ne renvoie pas la catégorie ni la raison saisies par l'athlète quand la séance est
manquée (`raison_categorie`, `raison_manque` sont lues dans `SELECT_PS` mais pas exposées par `resumeSeance`).

**Demande.** Ajouter `manque` au détail quand `statut = 'sautee'` :
```json
{
  "seance": { "id": "…", "statut": { "code": "manquee", "libelle": "Manquée" } },
  "manque": { "categorie": "travail", "raison": "Réunion tardive" }
}
```
- Écran : Programme › Séance prévue (état « manquée »).

## 6. Détail d'une séance faite hors programme

**Constat.** Le calendrier renvoie les séances libres (`hors_programme: true`, `id: null`, `seance_id` =
`seances_historique.id`) mais aucune route ne donne leur détail : la feuille du jour les affiche sans lien.

**Demande.** `GET /seances/:id` (protégée par le jeton, filtrée sur `user_id = req.userId`) :
```json
{
  "id": "9c8b7a6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d",
  "date": "2026-10-18",
  "nom": "Footing libre",
  "sport": { "code": "course", "nom": "Course à pied", "slug": "course_a_pied" },
  "type": { "code": "endurance", "libelle": "Endurance" },
  "duree_min": 42,
  "rpe": 5,
  "exercices": { "blocs": [], "totaux": { "exercices": 0 } }
}
```
- Écran : Programme › feuille du jour.

## 7. Identifiant de la compétition dans `GET /accueil`

**Constat.** `prochain_evenement` de `GET /accueil` (`{ nom, date, priorite, jours_restants }`) n'a pas d'`id` :
la carte Objectif d'Aujourd'hui ne peut pas ouvrir `programme/evenement/[id]` sans relire `GET /evenements`.
De plus, il prend la prochaine compétition `prevu`, quelle que soit sa priorité (l'onglet Programme montre la
prochaine **A**).

**Demande.** Ajouter `id` (et garder la priorité) :
```json
{ "prochain_evenement": { "id": "6f1c2a9e-3b0d-4c55-9a51-0d6f2f1e8a10", "nom": "Gala de Lyon", "date": "2027-03-14", "priorite": "A", "jours_restants": 140 } }
```
- Écran : Aujourd'hui › carte Objectif (lien vers la compétition).
- En attendant, l'intégrateur peut retrouver l'id avec `useEvenements()` (`features/programme/requetes.ts`) en
  comparant nom + date.
