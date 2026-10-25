# Routes manquantes : Profil et Notifications (étape 9)

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

## 1. Crédits du mois

### GET /credits
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

## 2. Export de toutes mes données (RGPD, droit à la portabilité)

### POST /compte/export
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

### GET /compte/export
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

## 3. Suppression du compte (RGPD, droit à l'effacement)

### POST /compte/suppression
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

## 4. Préférences de nutrition

### GET /preferences/nutrition
- Protection : jeton. Corps : aucun. Lit `preferences_nutrition` (ou les colonnes équivalentes).
- `regime` : `omnivore` | `flexitarien` | `pescetarien` | `vegetarien` | `vegan` | `null`. `repas_par_jour` : 2 à 6
  ou `null`. `allergies` : liste de codes (`gluten`, `lactose`, `arachide`, `fruits_a_coque`, `oeuf`, `poisson`,
  `crustaces`, `soja`, `sesame`) — **donnée de santé** : renvoyer `[]` si `a_consentement(req.userId, 'donnees_sante')`
  est faux.
- Réponse 200 :
```json
{ "regime": "omnivore", "repas_par_jour": 4, "allergies": ["lactose"] }
```

### PATCH /preferences/nutrition
- Protection : jeton. Corps : uniquement les champs modifiés.
```json
{ "regime": "vegetarien", "repas_par_jour": 5, "allergies": ["lactose", "gluten"] }
```
- `allergies` refusé (403 `{ "erreur": "consentement données de santé requis" }`) sans le consentement santé.
- Réponse 200 : l'objet complet, au format de GET.
- Écran : Profil › Préférences › Nutrition (`SectionNutrition`, `useNutrition`).

## 5. Centre de notifications (avec état « lu »)

La route existante `GET /notifications` ne renvoie que les rappels planifiés (`notifications_planifiees`), sans
état « lu ». Le centre affiche ce qui a été **envoyé** à l'athlète, avec un état « lu » par notification.

### GET /notifications/centre?limite=50
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

### PATCH /notifications/centre/:id
- Protection : jeton ; filtrer sur `user_id = req.userId` (404 sinon). Corps :
```json
{ "lue": true }
```
- Réponse 200 :
```json
{ "id": "0b7e5d1c-41a2-4b8f-8c3e-2f6a9d0e1b23", "lue": true, "lue_le": "2026-10-25T09:30:00.000Z" }
```

### POST /notifications/centre/tout-lu
- Protection : jeton. Corps : aucun. Marque toutes les notifications de l'athlète comme lues.
- Réponse 200 :
```json
{ "mises_a_jour": 2 }
```
- Écran : Notifications (`app/notifications.tsx`), cloche d'Aujourd'hui (`useNombreNonLues`), pastille de l'onglet
  Coach (`useBadges`, notification non lue de type `proposition_coach`).

## 6. Santé (facultatif : route préférable à la lecture directe)

Aujourd'hui l'écran Santé lit directement Supabase (RLS) : `user_profiles.blessures_actives` et `user_reeducation`
(`statut = 'actif'`), seulement si `a_consentement(..., 'donnees_sante')` est vrai côté app. Une route serveur serait
plus sûre (le serveur vérifie lui-même le consentement) et pourrait aussi regrouper la table `blessures`
(déclarations de l'inscription), que l'app ne lit pas.

### GET /sante
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

## 7. Ajustements souhaités sur des routes existantes

- `GET /memoire` : ne pas renvoyer les souvenirs de santé (`douleur`, `historique`) quand le consentement santé
  est retiré. L'app les masque déjà, mais ils transitent aujourd'hui jusqu'au téléphone.
- `GET /preferences` : renvoyer les valeurs effectives des notifications (avec les valeurs par défaut utilisées par
  `planifier_notifications`) quand l'athlète n'a encore rien choisi. L'app affiche en attendant
  `actives: true, checkin: true, rappel_min_avant: 30, heure_calme_debut: "21:30", heure_calme_fin: "07:00"`
  (`NOTIFICATIONS_DEFAUT`, `features/parametres/constantes.ts`), sans les enregistrer.
- `GET /disponibilites` : renvoyer `heure_debut` au format « HH:MM » (la colonne `time` sort en « HH:MM:SS », que
  `PUT /disponibilites` refuse ; l'app coupe les secondes avant de renvoyer).
