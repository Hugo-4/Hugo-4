# Contrat avec le serveur et la base — inscription et génération du programme

Source : `routes/athlete.js` et `agents/programme/generateurProgramme.js` du serveur coachia-agents-v6.

## Base de l'API

- Les routes athlète sont montées sous `/api/athlete` (`index.js` du serveur : `app.use('/api/athlete', athleteRouter)`). Ce préfixe est inclus dans `EXPO_PUBLIC_API_URL`.
- Les routes `/api/*` hors `/api/athlete` (ex. `/api/checkin`, `/api/agent/ask`) n'ont pas d'authentification et prennent un `userId` dans le corps : l'app ne les utilise pas.
- Chaque requête : `Authorization: Bearer <access_token Supabase>`. Sans jeton ou jeton invalide : `401 { erreur }`.
- Erreurs : `400 { erreur: "message lisible" }` pour une donnée invalide, `500 { erreur: "erreur serveur" }` sinon.
- La liste complète des routes est dans l'en-tête de `routes/athlete.js` (copiée en bas de ce fichier).

## Où l'app enregistre le questionnaire

**Directement dans Supabase**, avec la session de l'athlète (les règles RLS le permettent). Le serveur ne sert qu'à générer le programme.

| Donnée | Table | Champs | Remarques |
| --- | --- | --- | --- |
| Identité | `users` | `prenom`, `nom`, `langue`, `systeme_unites` | ligne créée automatiquement à l'inscription : `update` seulement |
| Profil | `user_profiles` | `date_naissance` (l'âge se calcule seul), `sexe`, `taille_cm`, `poids_kg`, `niveau_general` (`debutant`, `amateur`, `confirme`, `pro`), `objectif_principal`, `sport_principal_id`, `seances_par_semaine`, `duree_seance_minutes`, `moment_prefere` (`matin`, `midi`, `soir`, `indifferent`), `materiel_disponible`, `annees_pratique`, `activite_quotidienne` | ligne créée automatiquement : `update` seulement |
| Sports | `user_sport_profiles` | `sport_id`, `role` (`principal`, `complementaire`, `maintien`, `loisir`), `priorite` 1-10, `niveau`, `objectif_id` (→ `objectifs_entrainement`), `seances_semaine_cible` | **une ligne par sport**, le sport principal avec `role = 'principal'` |
| Disponibilités | `disponibilites_athlete` | `jour` 1-7 (1 = lundi), `creneau` (`matin`, `midi`, `soir`), `heure_debut` "18:30" (facultatif), `duree_max_min`, `lieu_id`, `actif = true` | une ligne par créneau ; ou bien `PUT /disponibilites` du serveur, qui remplace tout |
| Lieux | `lieux_athlete` | `nom`, `type_lieu`, `environnement`, `equipements`, `par_defaut` | facultatif au parcours Rapide |
| Consentements | `consentements` | `type`, `accorde`, `version_document`, `source = 'onboarding'` | à écrire **avant** toute donnée de santé |
| Blessures et douleurs | `blessures` | `type`, `zone`, `cote`, `gravite`, `date_debut`, `source = 'onboarding'` | refusé par la base sans le consentement `donnees_sante` |
| Préférences | `preferences_athlete`, `preferences_nutrition` | voir les colonnes en base | parcours Complet |

**Sport** : oui, afficher la table `sports` (filtrée sur `actif = true`, sans le slug `general`). Enregistrer le choix à **deux endroits** : `user_profiles.sport_principal_id` ET une ligne `user_sport_profiles` avec `role = 'principal'`, `priorite = 1` et l'objectif. Le générateur lit d'abord `user_sport_profiles`, puis `sport_principal_id` en secours ; sans aucun des deux, la génération échoue (« Aucun sport renseigné pour cet athlète »).

**Objectif** : lister `objectifs_entrainement` (`force_max`, `hypertrophie`, `puissance`, `endurance_musculaire`, `endurance_aerobie`, `capacite_anaerobie`, `perte_de_gras`, `mobilite`, `reathletisation`, `maintien`) et l'enregistrer dans `user_sport_profiles.objectif_id` du sport principal. Une compétition visée (parcours Complet) s'ajoute avec `POST /evenements` (`{ nom, date_evenement, priorite: 'A', type_evenement }`) : le programme se construit alors autour d'elle.

**Disponibilités** : sans créneaux enregistrés, le serveur prend par défaut lundi, mardi, jeudi et samedi le soir. Il faut donc toujours les enregistrer.

## Inscription v2 : objectif précis (docs/PLAN.md, étape 3)

- **Parcours A** : `user_sport_profiles` du sport principal reçoit `ambition` (`plaisir`, `progresser`, `competition`, `elite` ; la base en déduit `cadre_pratique`), `objectif_sport_id` (→ `objectifs_sport`), `echeance`, `objectifs_secondaires` (slugs de `objectifs_entrainement` où `proposable_en_secondaire`), `niveau`.
- **Parcours B** : `rpc('recommander_sports', { p_besoins, p_impact_max, p_lieux, p_prefere_encadre, p_minutes_semaine, p_age })` → 3 sports ; le sport choisi est enregistré avec `ambition = 'plaisir'` et `niveau = 'debutant'`.
- **Format de `user_sport_profiles.echeance`** (jsonb, défini par l'app) : `{ "date": "AAAA-MM-JJ", "epreuve": "texte", "distance": "texte", "categorie_poids_kg": 66, "poste": "texte" }` — seules les clés demandées par l'objectif sont présentes (`echeance_requise` → `date` et `epreuve` ; `precision_demandee` → `distance`, `categorie_poids_kg` ou `poste`). Quand il y a une date, un événement A est aussi créé dans `evenements_athlete`.
- **Pont avec le générateur actuel** : tant que `POST /programme/generer` lit `objectif_id` (objectifs_entrainement) et pas encore `objectif_sport_id`, l'app renseigne aussi `objectif_id` avec la qualité principale de l'objectif choisi (`objectifs_sport.qualite_principale`). Rien de tout cela n'est affiché à l'athlète.
- **À faire côté serveur** : lire `objectif_sport_id`, `objectifs_sport.qualites` (pondération) et `objectifs_secondaires` (nutrition et volume, jamais l'objectif principal), puis l'échéance.

## POST /programme/generer

- **Corps** (tout est facultatif) : `{ "date_debut": "AAAA-MM-JJ", "nb_semaines": 4-26 }`. Sans `date_debut` : aujourd'hui. Sans `nb_semaines` : 16 semaines, ou jusqu'à la compétition A si elle existe.
- **Réponse** : `{ programme_id, nom, blocs: [{ nom, phase, date_debut, date_fin }], bloc_en_cours }`.
- **Synchrone** : la réponse arrive quand le programme et le premier bloc sont prêts, en général entre 40 et 90 secondes. Délai d'attente du client : 150 secondes. Pas d'interrogation répétée à prévoir. Les aperçus des séances se génèrent ensuite en arrière-plan : la première ouverture d'une séance peut prendre quelques secondes de plus.
- En cas d'échec réseau pendant l'attente, ne relance pas tout de suite : vérifie d'abord avec `GET /programme` si un programme actif existe déjà, pour ne pas en créer deux.
- **Fin d'inscription** : `users.onboarding_complete` passe à `true` côté base, automatiquement, dès qu'un programme est créé (déclencheur `programme_cree_marque_onboarding` sur `programmes`). L'app relit ensuite ce statut et part sur Aujourd'hui.

## Après la génération

- `GET /accueil` : écran Aujourd'hui.
- `GET /programme` : programme actif, blocs, séances du bloc en cours.

---

## En séance (docs/PLAN.md, étape 5 ; FRONTEND.md §0 et §4.3)

À ajouter côté serveur (option B validée) :

```
POST /programme/seances/:id/demarrer   protégée par le jeton (req.userId)
  → crée la séance finale du jour avec le check-in (comme le fait le superviseur) et renvoie
    detailSeance(userId, id) au format « finale » : seance_finale_id, exercices.blocs[].exercices[]
    avec exercice_seance_id (lignes exercices_seance). Si la séance finale existe déjà, la renvoie telle quelle.
```

En attendant, l'app utilise une séance fictive au même format (`features/seance/source.ts`, `SEANCE_FICTIVE = true`) :
passer la constante à `false` quand la route est en ligne, rien d'autre ne change.

L'app envoie ensuite, via sa file hors ligne (`features/seance/fileEnvoi.ts`) :
- `PUT /exercices-seance/:id/series` après chaque série validée, avec la liste complète des séries de l'exercice ;
- `POST /seances/:id/feedback` à la fin (`douleurs` seulement avec le consentement santé) ;
- `POST /serie-suivante` directement (sans file) pour la charge conseillée.

Chaque envoi de la file porte un en-tête `Idempotency-Key` (identifiant généré sur le téléphone) : le serveur peut
ignorer un doublon. `PUT …/series` et `…/feedback` sont déjà idempotents (ils remplacent les valeurs).

Tous les appels portent aussi `Accept-Language: fr` ou `en` (langue du profil, `users.langue`) : le serveur peut rédiger
ses textes dans cette langue.

## En-tête de routes/athlete.js (référence)

```
GET    /profil                      profil avancé (références, zones, charge, événements, mémoire, lieux)
GET    /tests/types                 liste des tests disponibles + protocoles
GET    /tests                       historique des tests
POST   /tests                       { type, valeur, exercice?, cote?, date_test?, methode?, notes? }
GET    /evenements                  événements (à venir et passés)
POST   /evenements                  { nom, date_evenement, priorite, type_evenement, discipline?, objectif_resultat?, sport_slug?, lieu?, notes? }
PATCH  /evenements/:id              champs modifiables + statut + resultat
DELETE /evenements/:id              → statut "annule"
GET    /lieux | POST /lieux | PATCH /lieux/:id | DELETE /lieux/:id (désactive)
POST   /checkin/lieu                { lieu_id?, mode_seance?, duree_disponible_min? } pour aujourd'hui
GET    /memoire                     ce que le coach a retenu
PATCH  /memoire/:id                 { confirme?, contenu?, importance?, actif? }
DELETE /memoire/:id                 suppression définitive (droit à l'effacement)
POST   /seances/:id/feedback        { rpe, duree_reelle_min, niveau_fatigue_apres?, douleurs?, commentaire? }
PUT    /exercices-seance/:id/series { series_realisees: [{ serie, reps, charge_kg, rpe | rir, complete }] }
POST   /serie-suivante              { charge_kg, reps, rpe | rir, reps_cible, rpe_cible } → charge de la série suivante
GET    /etat-musculaire?objectif=   volume 7 j par muscle, fatigue résiduelle, charge nerveuse
GET    /progressions                statut de progression par exercice (e1RM, stagnation…)
POST   /programme/replanifier       reporte ou saute les séances manquées
GET    /disponibilites              créneaux (jour 1-7 × matin/midi/soir)
PUT    /disponibilites              { creneaux: [{ jour, creneau?, heure_debut? "18:30", duree_max_min, lieu_id? }] } remplace tout
PATCH  /preferences                 { preference_variete?, style_coaching?, contexte_vie?, moment_prefere?, notifications? }
POST   /programme/generer           { date_debut?, nb_semaines? }
GET    /programme                   programme actif, blocs, séances du bloc en cours, exercices du bloc
POST   /programme/bloc-suivant      clôt le bloc terminé et génère le suivant
GET    /sports/:slug/profil         champs du profil spécifique (garde, poste, distance…) + valeurs actuelles
PUT    /sports/:slug/profil         { valeurs: { garde: 'fausse_garde', categorie_poids_kg: 66 } }
POST   /poids                       { poids_kg, date_mesure?, moment? }
GET    /poids                       tendance (moyenne 7 j, pente) + 60 derniers jours
GET    /nutrition/jour              plan du jour pour la séance prévue (glucides, hydratation, poids)
GET    /meteo?lieu_id=&creneau=     météo au créneau + adaptations
GET    /preferences                 style de coaching, contexte de vie, moment préféré, notifications
GET    /assiduite                   taux 14/28/56 j, séances manquées d'affilée, raisons, statut
POST   /programme/seances/:id/manquee  { categorie, raison?, reporter? }
GET    /notifications               rappels prévus (14 j) et derniers envoyés
GET    /accueil                     aujourd'hui (détail complet), demain (résumé), la semaine, bloc, compétition
GET    /calendrier?mois=2026-10     le mois jour par jour
GET    /calendrier/legende          codes → libellés et couleurs
GET    /programme/seances/:id       détail d'une séance ; ?regenerer=1 pour refaire l'aperçu
POST   /programme/adapter           { categorie, raison?, programme_seance_id?, douleur?, zone?, jours?, intensite?, changements? }
POST   /programme/adapter/simuler   même corps, sans rien changer
GET    /programme/adaptations       historique des adaptations (30 j)
POST   /programme/adaptations/:id/accepter | /refuser
GET    /fiche                       fiche athlète consolidée

style_coaching : { ton: strict|equilibre|bienveillant, longueur: bref|standard|detaille, motivations: [...], tutoiement, emojis }
contexte_vie   : { stress_habituel 1-5, travail, sommeil_h, qualite_sommeil 1-5, enfants_bas_age, horaires_decales, trajets_min }
notifications  : { actives, checkin, rappel_min_avant, heure_calme_debut "21:30", heure_calme_fin "07:00" }
```
