# Routes et champs manquants côté serveur (coachia-agents-v6)

Document à transmettre tel quel au serveur. Toutes les routes sont sous `/api/athlete`, protégées par le jeton
Supabase de l'athlète (`Authorization: Bearer <access_token>`, `req.userId`) : **aucune** ne doit lire un
`userId` dans le corps ou l'URL. Réponses en JSON ; erreurs au format existant `{ "erreur": "message" }`
(400 / 403 / 404 / 429, 500 → `{ "erreur": "erreur serveur" }`). Toutes acceptent `Accept-Language: fr | en`
(textes rédigés dans cette langue) et, pour les écritures rejouées par la file hors ligne, un en-tête
`Idempotency-Key` (identifiant unique généré par le téléphone : ignorer un doublon).

Tant qu'une route manque, l'écran qui l'utilise fonctionne sur une source fictive au même format : la constante à
passer à `false` est indiquée pour chaque route.

## Récapitulatif

| § | Méthode et chemin (sous /api/athlete, jeton) | Écran | Constante côté app |
| --- | --- | --- | --- |
| 0 | Protéger `POST /api/agent/ask` et les routes `/api/*` (faille) | aucun (l'app ne les appelle pas) | — |
| 1 | `POST /programme/seances/:id/demarrer` ; consentement santé vérifié par le serveur dans `POST /seances/:id/feedback` | En séance | `SEANCE_FICTIVE` (features/seance/source.ts) |
| 2 | Champs `recuperation`, `prochain_evenement.id`, `realise` / `record` de `GET /accueil` | Aujourd'hui | — (affichés dès qu'ils existent) |
| 3 | `POST /coach/messages`, `POST /coach/propositions/:id/appliquer` · `garder` · `annuler` ; conversation lue en direct (canal `coach`, colonne `actions`) | Coach | `COACH_FICTIF` (features/coach/source.ts) |
| 4 | `categorie_poids_kg`, `distance`, `poste` dans `POST/PATCH /evenements` ; une A par sport ; couleurs et langue de `/calendrier/legende` ; raison de séance manquée ; détail hors programme | Programme | — (routes existantes, champs en plus) |
| 5 | `GET /progres/records`, `/progres/niveaux`, `/progres/charge`, `/progres/regularite`, `/progres/ligues` (+ rejoindre / quitter) | Progrès | `PROGRES_FICTIF` (features/progres/source.ts) |
| 6 | `GET /credits` (Coach et Profil), `POST/GET /compte/export`, `POST /compte/suppression`, `GET/PATCH /preferences/nutrition`, `GET /notifications/centre` (+ lu, tout lu), `GET /sante` (facultatif) | Profil, Notifications, Coach | `PARAMETRES_FICTIF` (features/parametres/source.ts), `NOTIFICATIONS_FICTIF` (features/notifications/source.ts) |

## 0. Sécurité à corriger avant tout

- `POST /api/agent/ask` (et les autres routes `/api/*` hors `/api/athlete`) acceptent un `userId` dans le corps
  sans vérifier qui appelle. À protéger par le jeton (et `req.userId`) ou à réserver à l'admin (`x-admin-token`).
  L'app ne les appelle jamais.

## 1. En séance

### POST /programme/seances/:id/demarrer
- Protection : jeton. Corps : aucun.
- Crée la séance finale du jour (comme le superviseur, avec le check-in, la météo et le lieu) si elle n'existe pas,
  puis renvoie `detailSeance(userId, id)` au format « finale ». Si elle existe déjà, la renvoie telle quelle.
- Réponse 200 :
```json
{
  "source": "finale",
  "seance_finale_id": "uuid (seances_historique.id)",
  "seance": { "id": "uuid", "date": "2026-10-26", "titre": "Force · bas du corps", "duree_min": 60, "statut": { "code": "en_cours", "libelle": "En cours" } },
  "nom": "Force · bas du corps",
  "lieu": "Salle de sport",
  "exercices": {
    "blocs": [
      { "bloc": "principal", "libelle": "Corps de séance", "exercices": [
        { "ordre": 1, "bloc": "principal", "exercice": { "slug": "muscu_squat_barre", "nom": "Squat barre", "muscles": ["quadriceps"], "consignes": ["Dos neutre"], "type_mesure": "charge" },
          "series": 4, "reps": 5, "charge_kg": 80, "rpe_cible": 8, "rir_cible": 2, "repos_s": 150, "tempo": "3-1-X-1",
          "duree_s": null, "distance_m": null, "consigne": null, "exercice_seance_id": "uuid (exercices_seance.id)" }
      ] }
    ],
    "totaux": { "exercices": 5 }
  }
}
```
- Écran : En séance (`features/seance/source.ts`, `SEANCE_FICTIVE`).

### Consentement santé dans `POST /seances/:id/feedback` (route existante, ajustement)
- Aujourd'hui, le serveur tire des souvenirs de santé du commentaire de fin de séance sauf si le corps contient
  `consentement_sante: false` (`autoriserSante: b.consentement_sante !== false`) : un client qui n'envoie rien vaut accord.
- L'app envoie désormais toujours `consentement_sante` (`true` ou `false`, lu par `a_consentement`), et n'envoie
  `douleurs` qu'avec le consentement.
- Souhaité côté serveur : ne pas se fier au corps, appeler `a_consentement(req.userId, 'donnees_sante')` avant
  d'écrire `douleurs_signalees` et avant `extraireMemoireEnFond(..., autoriserSante)` (la base refuse déjà les autres
  écritures de santé sans consentement).
- Corps envoyé par l'app :
```json
{ "rpe": 8, "duree_reelle_min": 62, "niveau_fatigue_apres": 6, "douleurs": ["genou 4/10"], "commentaire": "…", "consentement_sante": true }
```

## 2. Aujourd'hui

### Champ `aujourdhui.recuperation` de GET /accueil
- Jour de repos : une action de récupération utile, rédigée par le serveur (jamais par l'app).
```json
{ "aujourdhui": { "repos": true, "seances": [], "recuperation": { "titre": "Mobilité des hanches", "duree_min": 10, "description": "3 exercices doux pour relâcher les hanches après la semaine de force.", "type": "mobilite" } } }
```
- `null` les jours de séance. Écran : Aujourd'hui, carte Repos.

### Champ `prochain_evenement.id` de GET /accueil
- La carte « Prochain objectif » ouvre la compétition (`programme/evenement/[id]`). Aujourd'hui l'app retrouve l'id
  dans `GET /evenements` (même nom, même date) : ajouter `id` évite cet appel.
```json
{ "prochain_evenement": { "id": "uuid", "nom": "Olympics game", "date": "2031-06-20", "priorite": "A", "jours_restants": 1699 } }
```
- Écran : Aujourd'hui (`features/accueil/useOuvrirEvenement.ts`).

### Champ `realise` des séances faites dans GET /accueil
- Carte « Séance faite » : résumé réel (comme `GET /calendrier`).
```json
{ "aujourdhui": { "seances": [ { "id": "uuid", "statut": { "code": "faite", "libelle": "Réalisée" }, "realise": { "duree_min": 58, "rpe": 7.5 }, "record": "Squat : 100 kg × 5 (nouveau record)" } ] } }
```
- `record` : fait réel rédigé par le serveur, `null` sinon. Écran : Aujourd'hui, carte séance.

## 3. Coach (étape 6) — constante COACH_FICTIF

Document à transmettre tel quel au serveur (coachia-agents-v6). Mêmes règles que `docs/MANQUES-SERVEUR.md` :
toutes les routes sont sous `/api/athlete`, protégées par le jeton Supabase de l'athlète
(`Authorization: Bearer <access_token>` → `req.userId`) ; **aucune** ne lit un `userId` dans le corps ou l'URL.
Réponses en JSON, erreurs au format existant `{ "erreur": "message" }` (400 / 402 / 403 / 404 / 409 / 429 ;
500 → `{ "erreur": "erreur serveur" }`). Toutes acceptent `Accept-Language: fr | en` : les textes (message du
coach, titres et lignes des propositions, erreurs) sont rédigés dans cette langue.

**Constante à passer à `false`** quand ces routes sont en ligne : `COACH_FICTIF` dans `features/coach/source.ts`.
Une seule constante pour tout le Coach : les routes 1, 3 et 4 doivent être livrées ensemble (la 2 n'est pas une
route). En attendant, l'écran Coach tourne sur `features/coach/sourceFictive.ts`, au même format.

Écran qui utilise tout ce document : **Coach** (`app/(tabs)/coach.tsx` → `features/coach/`).

### 0. Rappel sécurité

Le superviseur n'est joignable aujourd'hui que par `POST /api/agent/ask`, qui prend `userId` dans le corps sans
vérifier qui appelle. L'app ne l'appelle pas et ne l'appellera jamais : la route 1 ci-dessous appelle le
superviseur **avec `req.userId`**. `/api/agent/ask` doit être protégée par le jeton ou réservée à l'admin.

### 1. POST /coach/messages — envoyer un message au coach

- Protection : jeton (`req.userId`). En-tête **`Idempotency-Key`** (identifiant unique généré par le téléphone) :
  un renvoi avec la même clé (bouton « Réessayer » après une coupure) renvoie la réponse déjà calculée, sans
  nouveau message en base ni nouveau décompte de crédits.
- Corps :
```json
{
  "texte": "Je n'ai que 30 min",
  "conversation_id": "7b0c5e7e-1f0a-4c55-9a43-2f1d6c1b9e10",
  "contexte": { "programme_seance_id": "3f6a2c1e-8d4b-4f7a-b1c2-9e8d7c6b5a40", "exercice_slug": "muscu_squat_barre" },
  "reponse_rapide": "duree_30"
}
```
  - `texte` : 1 à 1500 caractères (obligatoire).
  - `conversation_id` : `null` pour la première question → le serveur crée la conversation
    (`conversations_coach`, `canal = 'coach'`, `contexte`, `programme_seance_id`, `statut = 'ouverte'`).
    Une conversation qui n'appartient pas à `req.userId` → 404.
  - `contexte` : `null`, ou la séance du programme concernée (« Modifier avec le coach » sur Aujourd'hui) ;
    `exercice_slug` en plus quand l'athlète vient de « Remplacer » un exercice en séance.
  - `reponse_rapide` : `null` ou `duree_30` | `sans_salle` | `decaler_demain` | `douleur` (puce touchée ; le texte
    est dans la langue de l'app, le code permet de router sans dépendre de la langue). `douleur` n'est proposé
    que si l'athlète a donné son consentement santé.
- Traitement attendu :
  1. Crédits : s'il n'en reste plus → **402** `{ "erreur": "Tu as utilisé tous tes crédits du mois.", "code": "credits_epuises" }`.
  2. Superviseur avec `userId = req.userId`, la demande, le contexte, et
     `consentementSante = a_consentement(req.userId, 'donnees_sante')` (aucune donnée de santé lue ni retenue sans).
  3. Une modification du programme n'est **jamais appliquée directement** : elle est enregistrée « proposée »
     (par exemple une ligne `adaptations_programme` au statut `proposee`, dont l'`id` sert d'identifiant de
     proposition) et décrite pour l'athlète : `titre`, `avant[]`, `apres[]`, `inchange[]` (phrases courtes, déjà
     rédigées : l'app ne compose rien).
  4. `urgence: true` quand des signes d'alerte sont repérés (douleur thoracique, malaise, essoufflement anormal,
     perte de connaissance, drapeau rouge de la rééducation, `validation: 'bloque'` du médecin avec signalement) :
     l'app affiche « Appelle le 15 ou le 112 » avec des boutons qui composent le numéro.
  5. Deux lignes `messages_coach` (`role = 'athlete'` puis `role = 'coach'`, `agent = 'superviseur'`), la seconde
     avec `actions` au format du §2 ; `conversations_coach.nb_messages` et `dernier_message_le` mis à jour ;
     crédits décomptés.
- Réponse 200 :
```json
{
  "conversation_id": "7b0c5e7e-1f0a-4c55-9a43-2f1d6c1b9e10",
  "message_athlete": {
    "id": "0c9f4b52-6a51-4d3e-9f0a-1b2c3d4e5f60",
    "role": "athlete",
    "contenu": "Je n'ai que 30 min",
    "created_at": "2026-10-26T07:41:12.000Z",
    "avis": null,
    "proposition": null,
    "urgence": false
  },
  "message": {
    "id": "5d1e2f3a-4b5c-4d6e-8f70-81a2b3c4d5e6",
    "role": "coach",
    "contenu": "D'accord pour 30 minutes. Je garde les deux exercices clés à la même charge, je retire les fentes et le gainage, et je raccourcis l'échauffement. Voici ce qui change :",
    "created_at": "2026-10-26T07:41:19.000Z",
    "avis": null,
    "proposition": {
      "id": "9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d",
      "titre": "Séance du jour raccourcie",
      "avant": ["60 min · 6 exercices"],
      "apres": ["30 min · 4 exercices"],
      "inchange": ["Squat barre : 4 × 5 à 80 kg", "Soulevé de terre roumain : 3 × 8 à 70 kg", "Objectif du jour : force · bas du corps"],
      "statut": "proposee",
      "annulable_jusqu_au": null
    },
    "urgence": false
  },
  "credits": { "restant": 41, "total": 50, "renouvellement_le": "2026-11-01" }
}
```
  - `message.proposition` : `null` si le coach répond sans rien proposer (question, conseil).
  - `message.urgence` : `true` → bandeau d'urgence (affiché tant que la dernière réponse du coach le porte).
- Erreurs : 400 (texte vide ou trop long, `reponse_rapide` inconnu, identifiant invalide), 402 (crédits épuisés),
  404 (conversation ou séance inconnue), 429 (trop de messages d'affilée).
- Délai : l'app attend jusqu'à 120 s et affiche « Le coach réfléchit… ».
- Plus tard (facultatif) : réponse au fil de l'eau en `text/event-stream` (événements `fragment` avec le texte déjà
  rédigé, puis `fin` avec le JSON ci-dessus). L'interface de l'app le prévoit déjà (`surFragment`), la source
  fictive le simule ; sans cela l'app reste sur l'indicateur.

### 2. Conversation courante — lecture directe Supabase (pas de route à créer)

L'app lit l'historique elle-même, protégée par RLS (`features/coach/sourceReelle.ts`, `lireConversation`) :
- `conversations_coach` : `user_id = moi`, `canal = 'coach'`, `statut = 'ouverte'`, la plus récente
  (`dernier_message_le` décroissant) ;
- `messages_coach` de cette conversation : `id, role, contenu, avis, actions, created_at` (200 derniers).

Ce que le serveur doit respecter pour que l'historique s'affiche correctement :
- **`canal = 'coach'`** pour toutes les conversations du coach (le chat savoir garde `savoir`). Si une contrainte
  limite les valeurs de `canal`, y ajouter `coach`.
- `role` : `athlete` ou `coach` (les autres valeurs sont ignorées par l'app).
- `actions` (jsonb) de la ligne du coach, **exactement** :
```json
[
  {
    "type": "proposition",
    "id": "9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d",
    "titre": "Séance du jour raccourcie",
    "avant": ["60 min · 6 exercices"],
    "apres": ["30 min · 4 exercices"],
    "inchange": ["Squat barre : 4 × 5 à 80 kg", "Objectif du jour : force · bas du corps"],
    "statut": "proposee",
    "annulable_jusqu_au": null
  },
  { "type": "urgence" }
]
```
  (`[]` si rien ; d'autres types d'action sont ignorés). Les routes du §3 **mettent à jour `statut` et
  `annulable_jusqu_au` dans cette colonne**, sinon l'app réafficherait « Appliquer » après un rechargement.
- 👍 / 👎 : écrit par l'app en direct (`update messages_coach set avis = 1 | -1 | null where id = … and
  user_id = moi and role = 'coach'`, politique `msg_avis_own`). Vérifier que la politique accepte `null`
  (l'athlète retire son avis en touchant à nouveau le pouce choisi).

Si le serveur préfère ne pas exposer `actions` : `GET /coach/conversation` (jeton, aucun paramètre) renvoyant
`{ "id": "7b0c…" | null, "messages": [ …même format que "message" au §1, du plus ancien au plus récent ] }`.
Dans ce cas, seule `lireConversation` change dans l'app.

### 3. Réponse à une proposition (fenêtre d'annulation de 10 s)

Trois routes, même protection (jeton ; la proposition doit appartenir à `req.userId`, sinon 404), **corps vide**,
même réponse : la proposition dans son nouvel état.

#### POST /coach/propositions/:id/appliquer
- `statut` doit être `proposee`, sinon **409** `{ "erreur": "Cette proposition a déjà reçu une réponse." }`.
- Applique la modification (même mécanique que `accepterProposition` / `adapter`), en gardant la version
  d'origine des séances touchées (`version_initiale` existe déjà) pour pouvoir annuler.
- `statut = 'appliquee'`, `annulable_jusqu_au = maintenant + 10 s` (heure du serveur, ISO).

#### POST /coach/propositions/:id/garder
- `statut` doit être `proposee` (sinon 409). Rien ne change dans le programme ; `statut = 'gardee'`
  (comme `refuserProposition`).

#### POST /coach/propositions/:id/annuler
- `statut` doit être `appliquee` et l'heure ≤ `annulable_jusqu_au` (prévoir 2 s de marge pour le réseau),
  sinon **409** `{ "erreur": "Le délai pour annuler est passé." }`.
- Remet les séances dans leur version d'origine ; `statut = 'proposee'`, `annulable_jusqu_au = null`
  (l'athlète peut de nouveau appliquer ou garder l'original).

- Réponse 200 (exemple après `appliquer`) :
```json
{
  "proposition": {
    "id": "9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d",
    "titre": "Séance du jour raccourcie",
    "avant": ["60 min · 6 exercices"],
    "apres": ["30 min · 4 exercices"],
    "inchange": ["Squat barre : 4 × 5 à 80 kg", "Objectif du jour : force · bas du corps"],
    "statut": "appliquee",
    "annulable_jusqu_au": "2026-10-26T07:41:40.000Z"
  }
}
```
- Après `appliquer` et `annuler`, l'app recharge `GET /accueil` et `GET /programme` : ces routes doivent déjà
  refléter la modification quand la réponse arrive.
- Pourquoi de nouvelles routes plutôt que `/programme/adaptations/:id/accepter | refuser` : `adapter` applique
  tout de suite les changements d'une séance (pas d'état « proposée »), il n'existe pas d'annulation, et la
  réponse doit renvoyer les textes de la proposition. Les nouvelles routes peuvent réutiliser ces fonctions.

### 4. Crédits

Une seule route pour le Coach et le Profil : `GET /credits` (voir §6.1). Le Coach n'en lit que `restants`, `inclus` et `renouvellement_le`.

## 4. Programme (étape 7) — routes existantes, champs manquants

À transmettre au serveur `coachia-agents-v6`. Mêmes conventions que `docs/MANQUES-SERVEUR.md` : routes sous
`/api/athlete`, protégées par le jeton Supabase (`Authorization: Bearer <access_token>`, `req.userId`), **aucun**
`userId` dans le corps ou l'URL, erreurs `{ "erreur": "message" }`, en-tête `Accept-Language: fr | en`.

L'écran Programme est branché sur les routes existantes (aucune source fictive) : `GET /programme`,
`GET /calendrier?mois=`, `GET /calendrier/legende`, `GET /programme/seances/:id` (202 `en_preparation` → nouvel
essai toutes les 4 s), `POST /programme/adapter` (`deplacer`), `POST /programme/seances/:id/manquee`,
`GET /programme/adaptations`, `GET/POST /evenements`, `PATCH/DELETE /evenements/:id`. Les manques ci-dessous ont un
contournement en place ; il suffira de le retirer quand le serveur sera prêt.

---

### 1. Précision d'une compétition dans `CHAMPS_EVT` (POST / PATCH /evenements)

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

### 2. Une seule compétition A par sport, et pas de doublon (POST / PATCH /evenements)

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

### 3. Couleurs dans `GET /calendrier/legende`

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

### 4. Textes de la légende et des refus selon `Accept-Language`

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

### 5. Raison d'une séance manquée dans `GET /programme/seances/:id`

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

### 6. Détail d'une séance faite hors programme

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

### 7. Identifiant de la compétition dans `GET /accueil`

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

## 5. Progrès (étape 8) — constante PROGRES_FICTIF

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

### 1. Records et jalons

#### GET /progres/records
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

### 2. Niveaux en percentile

#### GET /progres/niveaux
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

### 3. Charge par semaine et zone optimale

#### GET /progres/charge?semaines=12
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

### 4. Régularité

#### GET /progres/regularite?semaines=12
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

### 5. Ligues et défis

#### GET /progres/ligues
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

#### POST /progres/ligues/:id/rejoindre et POST /progres/ligues/:id/quitter
- Protection : jeton. Corps : aucun. `:id` = identifiant de la ligue.
- `rejoindre` : 403 `{ "erreur": "classement réservé aux 15 ans et plus" }` avant 15 ans ; 404 si la ligue n'existe pas
  ou n'est plus ouverte. Idempotent (rejoindre deux fois ne crée pas de doublon).
- Réponse 200 : `{ "id": "5b0e7c12-9d3a-4f61-a2b8-7e4c1d0f3a95", "inscrit": true }` (`false` après `quitter`).
- Écran : vue `/progres/ligues` (boutons « Rejoindre » / « Quitter »). L'app relit ensuite `GET /progres/ligues`.

## 6. Profil et Notifications (étape 9) — constantes PARAMETRES_FICTIF et NOTIFICATIONS_FICTIF

À transmettre au serveur `coachia-agents-v6`. Mêmes règles que `docs/MANQUES-SERVEUR.md` : routes sous
`/api/athlete`, protégées par le jeton Supabase de l'athlète (`Authorization: Bearer <access_token>`, `req.userId`),
**aucun** `userId` lu dans le corps ou l'URL, erreurs `{ "erreur": "message" }` (400 / 403 / 404 / 429, 500 →
`{ "erreur": "erreur serveur" }`), textes rédigés dans la langue d'`Accept-Language` (`fr` | `en`).

Tant qu'une route manque, l'écran fonctionne sur une source fictive au même format :

| Constante | Fichier | Routes |
| --- | --- | --- |
| `PARAMETRES_FICTIF` | `features/parametres/source.ts` | crédits, export, suppression du compte, préférences de nutrition |
| `NOTIFICATIONS_FICTIF` | `features/notifications/source.ts` | centre de notifications (liste, marquer lu) |

Passer la constante à `false` quand **toutes** les routes de sa ligne sont en ligne : rien d'autre ne change.

---

### 1. Crédits du mois

#### GET /credits
- Protection : jeton. Corps : aucun.
- Offre de l'athlète (`users.abonnement`), crédits inclus pour le mois en cours, consommés, restants, date de
  renouvellement, détail par usage. `detail[].type` : `chat` (messages au coach), `adaptation` (adaptations du
  programme), `generation` (génération de séances), `analyse` ; l'app traduit ces codes (un code inconnu est affiché tel quel).
- Réponse 200 :
```json
{
  "offre": "free",
  "periode": { "debut": "2026-10-01", "fin": "2026-10-31" },
  "inclus": 30,
  "utilises": 14,
  "restants": 16,
  "renouvellement_le": "2026-11-01",
  "detail": [
    { "type": "chat", "credits": 9 },
    { "type": "adaptation", "credits": 2 },
    { "type": "generation", "credits": 3 }
  ]
}
```
- Écran : Profil › Abonnement et crédits (`app/compte/abonnement.tsx`, `useCredits`).
- À unifier avec le solde de crédits du Coach (étape 6, FRONTEND §4.4) : une seule route pour les deux écrans.

### 2. Export de toutes mes données (RGPD, droit à la portabilité)

#### POST /compte/export
- Protection : jeton. Corps : aucun.
- Lance la préparation d'une archive (JSON, ou ZIP de fichiers JSON) avec **toutes** les données de l'athlète :
  `users`, `user_profiles`, `user_sport_profiles`, `consentements` (journal complet), `disponibilites_athlete`,
  `lieux_athlete`, `evenements_athlete`, programmes, blocs et séances, `seances_historique`, séries réalisées,
  `checkins_forme`, `blessures`, `user_reeducation`, `memoire_athlete`, messages et conversations du coach,
  tests, poids, notifications. Le fichier est déposé dans un stockage privé et un lien signé (7 jours) est envoyé
  par email à l'adresse du compte. Une seule préparation à la fois : si une demande est déjà « en préparation »,
  la renvoyer telle quelle (200) au lieu d'en créer une autre. Limite conseillée : 1 demande par 24 h (429 sinon).
- Réponse 202 :
```json
{
  "id": "6f1c2a9e-0d4b-4c8e-9a51-3b7d2e1f0a77",
  "statut": "en_preparation",
  "demande_le": "2026-10-25T09:12:44.000Z",
  "pret_le": null,
  "url": null,
  "expire_le": null
}
```

#### GET /compte/export
- Protection : jeton. Corps : aucun. Dernière demande d'export, ou `null`. L'app la relit toutes les 30 s tant
  qu'elle est « en préparation ». `statut` : `en_preparation` | `pret` | `expire` | `echec`.
- Réponse 200 :
```json
{
  "export": {
    "id": "6f1c2a9e-0d4b-4c8e-9a51-3b7d2e1f0a77",
    "statut": "pret",
    "demande_le": "2026-10-25T09:12:44.000Z",
    "pret_le": "2026-10-25T09:14:02.000Z",
    "url": "https://<projet>.supabase.co/storage/v1/object/sign/exports/<fichier>.zip?token=…",
    "expire_le": "2026-11-01T09:14:02.000Z"
  }
}
```
- Sans demande : `{ "export": null }`.
- Écran : Profil › Mes données (`app/compte/donnees.tsx`, `CarteExport`).

### 3. Suppression du compte (RGPD, droit à l'effacement)

#### POST /compte/suppression
- Protection : jeton. Corps exact (garde-fou contre un appel accidentel) :
```json
{ "confirmation": "SUPPRIMER" }
```
- L'app a déjà demandé une **double confirmation** à l'athlète. Le serveur :
  1. supprime toutes les lignes de l'athlète dans toutes les tables listées au §2 (programmes, séances, séries,
     check-ins, blessures, rééducation, mémoire, messages du coach, lieux, disponibilités, événements, tests,
     poids, notifications planifiées, `consentements`, `user_sport_profiles`, `user_profiles`, `users`) ;
  2. supprime les fichiers de l'athlète dans le stockage (exports, médias) ;
  3. supprime l'utilisateur d'authentification (`supabase.auth.admin.deleteUser(req.userId)`, côté serveur
     uniquement : la clé `service_role` ne quitte jamais le serveur) ;
  4. ne garde que des données anonymisées sans lien avec la personne (mesure agrégée des coûts d'IA sans
     `user_id`) et, si la loi l'impose, une trace de la suppression (date, sans identité).
  Un abonnement payé sur l'App Store ou Google Play n'est pas annulé par cette route : l'app le dit à l'athlète.
- Réponse 200 :
```json
{ "supprime": true, "supprime_le": "2026-10-25T09:20:11.000Z" }
```
- Erreurs : 400 si `confirmation` est absente ou différente. Après la réponse, l'app ferme la session locale
  (`signOut`) et revient à l'écran de connexion.
- Écran : Profil › Mes données (`FeuilleSuppression`, `useSupprimerCompte`).

### 4. Préférences de nutrition

#### GET /preferences/nutrition
- Protection : jeton. Corps : aucun. Lit `preferences_nutrition` (ou les colonnes équivalentes).
- `regime` : `omnivore` | `flexitarien` | `pescetarien` | `vegetarien` | `vegan` | `null`. `repas_par_jour` : 2 à 6
  ou `null`. `allergies` : liste de codes (`gluten`, `lactose`, `arachide`, `fruits_a_coque`, `oeuf`, `poisson`,
  `crustaces`, `soja`, `sesame`) — **donnée de santé** : renvoyer `[]` si `a_consentement(req.userId, 'donnees_sante')`
  est faux.
- Réponse 200 :
```json
{ "regime": "omnivore", "repas_par_jour": 4, "allergies": ["lactose"] }
```

#### PATCH /preferences/nutrition
- Protection : jeton. Corps : uniquement les champs modifiés.
```json
{ "regime": "vegetarien", "repas_par_jour": 5, "allergies": ["lactose", "gluten"] }
```
- `allergies` refusé (403 `{ "erreur": "consentement données de santé requis" }`) sans le consentement santé.
- Réponse 200 : l'objet complet, au format de GET.
- Écran : Profil › Préférences › Nutrition (`SectionNutrition`, `useNutrition`).

### 5. Centre de notifications (avec état « lu »)

La route existante `GET /notifications` ne renvoie que les rappels planifiés (`notifications_planifiees`), sans
état « lu ». Le centre affiche ce qui a été **envoyé** à l'athlète, avec un état « lu » par notification.

#### GET /notifications/centre?limite=50
- Protection : jeton. Plus récentes en premier, 50 au maximum.
- `type` : `proposition_coach` (proposition du coach en attente de réponse), `adaptation_semaine`,
  `rappel_checkin`, `competition_proche`, `nouveau_record`. `titre` et `corps` rédigés par le serveur dans la langue
  de l'athlète. `cible.ecran` : écran ouvert au toucher — `coach`, `aujourdhui`, `checkin`, `programme`,
  `adaptations`, `evenement` (avec `id` de l'événement), `seance` (avec `id` de la séance prévue), `records`.
  Si `cible` est `null`, l'app choisit d'après le type.
- Réponse 200 :
```json
{
  "non_lues": 2,
  "notifications": [
    {
      "id": "0b7e5d1c-41a2-4b8f-8c3e-2f6a9d0e1b23",
      "type": "proposition_coach",
      "titre": "Le coach te propose une modification",
      "corps": "Séance de jeudi raccourcie à 45 min : réponds dans le chat.",
      "cree_le": "2026-10-25T08:47:00.000Z",
      "lue": false,
      "cible": { "ecran": "coach", "id": null }
    },
    {
      "id": "5c2f8a4e-9b1d-4e7a-a6c0-7d3e1f2b9a41",
      "type": "competition_proche",
      "titre": "Compétition dans 3 semaines",
      "corps": "Ton programme entre en phase d'affûtage.",
      "cree_le": "2026-10-23T07:00:00.000Z",
      "lue": true,
      "cible": { "ecran": "evenement", "id": "a3d9c1e7-2b4f-4a6d-8e0c-5f7b9d1e3a20" }
    }
  ]
}
```

#### PATCH /notifications/centre/:id
- Protection : jeton ; filtrer sur `user_id = req.userId` (404 sinon). Corps :
```json
{ "lue": true }
```
- Réponse 200 :
```json
{ "id": "0b7e5d1c-41a2-4b8f-8c3e-2f6a9d0e1b23", "lue": true, "lue_le": "2026-10-25T09:30:00.000Z" }
```

#### POST /notifications/centre/tout-lu
- Protection : jeton. Corps : aucun. Marque toutes les notifications de l'athlète comme lues.
- Réponse 200 :
```json
{ "mises_a_jour": 2 }
```
- Écran : Notifications (`app/notifications.tsx`), cloche d'Aujourd'hui (`useNombreNonLues`), pastille de l'onglet
  Coach (`useBadges`, notification non lue de type `proposition_coach`).

### 6. Santé (facultatif : route préférable à la lecture directe)

Aujourd'hui l'écran Santé lit directement Supabase (RLS) : `user_profiles.blessures_actives` et `user_reeducation`
(`statut = 'actif'`), seulement si `a_consentement(..., 'donnees_sante')` est vrai côté app. Une route serveur serait
plus sûre (le serveur vérifie lui-même le consentement) et pourrait aussi regrouper la table `blessures`
(déclarations de l'inscription), que l'app ne lit pas.

#### GET /sante
- Protection : jeton. 403 `{ "erreur": "consentement données de santé requis" }` sans le consentement.
- Réponse 200 :
```json
{
  "blessures": [
    { "zone": "genou", "type": "douleur 5/10", "cote": "droit", "gravite": "moderee", "depuis": "2026-10-12", "source": "checkin" }
  ],
  "reeducations": [
    { "id": "9e4b2c1a-7d3f-4a8e-b5c6-1f0e2d3c4b5a", "blessure_type": "entorse", "zone_anatomique": "cheville", "cote": "gauche",
      "gravite": "legere", "phase_actuelle": 2, "nb_phases": 4, "protocole": "Entorse de cheville", "date_debut_protocole": "2026-10-01" }
  ]
}
```
- Écran : Profil › Santé (`features/parametres/useSante.ts`, à rebrancher sur cette route si elle est créée).

### 7. Ajustements souhaités sur des routes existantes

- `GET /memoire` : ne pas renvoyer les souvenirs de santé (`douleur`, `historique`) quand le consentement santé
  est retiré. L'app les masque déjà, mais ils transitent aujourd'hui jusqu'au téléphone.
- `GET /preferences` : renvoyer les valeurs effectives des notifications (avec les valeurs par défaut utilisées par
  `planifier_notifications`) quand l'athlète n'a encore rien choisi. L'app affiche en attendant
  `actives: true, checkin: true, rappel_min_avant: 30, heure_calme_debut: "21:30", heure_calme_fin: "07:00"`
  (`NOTIFICATIONS_DEFAUT`, `features/parametres/constantes.ts`), sans les enregistrer.
- `GET /disponibilites` : renvoyer `heure_debut` au format « HH:MM » (la colonne `time` sort en « HH:MM:SS », que
  `PUT /disponibilites` refuse ; l'app coupe les secondes avant de renvoyer).
