# Routes manquantes côté serveur : Coach (étape 6)

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

## 0. Rappel sécurité

Le superviseur n'est joignable aujourd'hui que par `POST /api/agent/ask`, qui prend `userId` dans le corps sans
vérifier qui appelle. L'app ne l'appelle pas et ne l'appellera jamais : la route 1 ci-dessous appelle le
superviseur **avec `req.userId`**. `/api/agent/ask` doit être protégée par le jeton ou réservée à l'admin.

## 1. POST /coach/messages — envoyer un message au coach

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

## 2. Conversation courante — lecture directe Supabase (pas de route à créer)

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

## 3. Réponse à une proposition (fenêtre d'annulation de 10 s)

Trois routes, même protection (jeton ; la proposition doit appartenir à `req.userId`, sinon 404), **corps vide**,
même réponse : la proposition dans son nouvel état.

### POST /coach/propositions/:id/appliquer
- `statut` doit être `proposee`, sinon **409** `{ "erreur": "Cette proposition a déjà reçu une réponse." }`.
- Applique la modification (même mécanique que `accepterProposition` / `adapter`), en gardant la version
  d'origine des séances touchées (`version_initiale` existe déjà) pour pouvoir annuler.
- `statut = 'appliquee'`, `annulable_jusqu_au = maintenant + 10 s` (heure du serveur, ISO).

### POST /coach/propositions/:id/garder
- `statut` doit être `proposee` (sinon 409). Rien ne change dans le programme ; `statut = 'gardee'`
  (comme `refuserProposition`).

### POST /coach/propositions/:id/annuler
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

## 4. GET /coach/credits — solde de crédits du mois

- Protection : jeton. Aucun paramètre. Source : table des crédits à venir (plan de tarification).
- Réponse 200 :
```json
{ "restant": 41, "total": 50, "renouvellement_le": "2026-11-01" }
```
  - `renouvellement_le` : date de la prochaine recharge (AAAA-MM-JJ).
  - Chaque `POST /coach/messages` réussi décompte (le coût par message est décidé par le serveur ; l'app
    affiche seulement le solde, la ligne « moins de 20 % » et, à 0, l'explication avec le lien vers l'abonnement).
- Le même objet est renvoyé dans la réponse de `POST /coach/messages` (`credits`).
