# Routes et champs manquants côté serveur (coachia-agents-v6)

Document à transmettre tel quel au serveur. Toutes les routes sont sous `/api/athlete`, protégées par le jeton
Supabase de l'athlète (`Authorization: Bearer <access_token>`, `req.userId`) : **aucune** ne doit lire un
`userId` dans le corps ou l'URL. Réponses en JSON ; erreurs au format existant `{ "erreur": "message" }`
(400 / 403 / 404 / 429, 500 → `{ "erreur": "erreur serveur" }`). Toutes acceptent `Accept-Language: fr | en`
(textes rédigés dans cette langue) et, pour les écritures rejouées par la file hors ligne, un en-tête
`Idempotency-Key` (identifiant unique généré par le téléphone : ignorer un doublon).

Tant qu'une route manque, l'écran qui l'utilise fonctionne sur une source fictive au même format : la constante à
passer à `false` est indiquée pour chaque route.

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
