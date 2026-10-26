# Carte du front Athlenis (contexte commun des étapes 6 à 9)

Version du 25/10/2026. À lire avec `CLAUDE.md`, `FRONTEND.md` (gagne sur navigation et design), `docs/ECRANS.md`
(gagne sur données et routes), `docs/PLAN.md`, `docs/API.md`.

## 1. Pile et conventions

- Expo SDK 58 (Expo Go à jour sur le téléphone de Hugo), React Native 0.88, React 19.3, TypeScript strict,
  expo-router 58 (routes typées : `.expo/types/router.d.ts`, régénéré par `npx expo start`), React Compiler actif.
- Données serveur : TanStack Query (`lib/queryClient.ts`), client unique `lib/api.ts`
  (`api.get/post/put/patch/delete`, jeton Supabase, 401 → rafraîchissement puis déconnexion, `Accept-Language`,
  option `entetes`, option `delaiMs`). Erreurs lisibles : `lib/texteErreur.ts` (`useTexteErreur`, `detailTechnique`).
- Supabase direct (RLS) : `lib/supabase.ts`, uniquement pour les lectures/écritures simples protégées par RLS
  (users, user_profiles, user_sport_profiles, consentements, checkins_forme…). Aucun `userId` dans un corps de
  requête serveur ; côté Supabase, filtrer sur `session.user.id` (déjà le cas dans `features/profil/useProfil.ts`).
- Textes : `locales/fr.json` / `locales/en.json` (mêmes clés, vérifié par tsc via `typeof fr`). À partir des étapes
  6 à 9 : un fichier par domaine, `locales/fr/<domaine>.json` et `locales/en/<domaine>.json`, fusionné sous la clé
  du domaine (`coach.*`, `programme.*`, `progres.*`, `parametres.*`, `notifications.*`) dans `lib/i18n.ts`.
- Design : tout vient de `theme/tokens.ts` et `theme/typography.ts` (variantes `AppText` : display, chiffreXL, titre,
  sousTitre, chiffre, surTitre, corps, corpsGras, secondaire, libelle, bouton). Aucune couleur, taille, police en dur.
- Nommage : termes métier comme l'API (`seance`, `programme`, `bloc`, `evenement`, `memoire`), le reste en anglais.
  Un composant par fichier, moins de 150 lignes, pas de logique métier dans `app/` (les écrans assemblent).
- Source interchangeable (modèle : `features/seance/source.ts`) : une interface typée, une implémentation réelle
  prête, une implémentation fictive réaliste (identifiants préfixés `fictif-`), **une seule constante** à changer
  (`<DOMAINE>_FICTIF = true`). L'écran doit marcher entièrement avec la source fictive.

## 2. Routes expo-router

Existantes : `(tabs)/index` (Aujourd'hui), `(tabs)/programme`, `(tabs)/coach`, `(tabs)/progres`, `(tabs)/profil`,
`checkin` (formSheet), `seance/[id]/` (index, fin ; plein écran), `compte/` (identite, consentements,
sport/[id] ; pile avec en-tête), `inscription/…`, écrans de connexion.

Ajoutées par les fondations (squelettes à remplir) et déclarées dans `components/RootNavigator.tsx` :

| Route | Rôle | Étape |
| --- | --- | --- |
| `(tabs)/coach` | chat du coach (la barre d'onglets est masquée sur cet onglet, en-tête avec retour) | 6 |
| `programme/seance/[id]` | détail d'une séance prévue | 7 |
| `programme/evenement/nouveau`, `programme/evenement/[id]` | créer / modifier une compétition | 7 |
| `programme/adaptations` | historique des adaptations | 7 |
| `exercice/[slug]` | fiche technique (feuille formSheet) | 7 (lien depuis séance) |
| `progres/[vue]` | détail Progrès (`tests`, `charge`, `records`, `niveaux`, `regularite`) | 8 |
| `compte/objectifs`, `compte/disponibilites`, `compte/lieux`, `compte/abonnement`, `compte/appareils`, `compte/preferences`, `compte/sante`, `compte/memoire`, `compte/donnees` | sous-pages du Profil (FRONTEND §4.7 ; dossier `compte/` existant plutôt que `profil/` pour ne pas entrer en conflit avec l'onglet `/profil`) | 9 |
| `notifications` | liste des notifications | finitions |
| `coach-seance` | le Coach en modale par-dessus une séance en cours (« Remplacer avec le coach ») : le retour ramène à la séance | corrections |

Ouvrir le Coach avec un contexte : `ouvrirCoach(contexte?)` (`features/coach/ouvrirCoach.ts`) ; contexte =
`{ type: 'seance', programmeSeanceId, titre }` ou `{ type: 'exercice', programmeSeanceId, exerciceSlug, nom }`,
passé en paramètres de route (`/coach?contexte=…`). Depuis une séance en cours : `ouvrirCoachEnSeance(contexte?)`
(route `coach-seance`). Le contexte de l'onglet est oublié quand on le quitte.

## 3. Composants communs (`components/`)

Existants : AppText, Button (principal, secondaire, discret, danger), Card, Chip (puce), ChoixOption, ChoixNote
(RPE, notes 1-10, 0-10), CoachTabButton, DateField, EmptyState (état vide), ErrorState (erreur + Réessayer, cause
précise), Feuille (Modal du bas), IconButton (`accessibilityLabel` obligatoire), Logo, PasAPas (− valeur +),
PlaceholderScreen, ProgressBar, Ring (anneau), Screen, Segmente, Skeleton (squelette), TabBar, TabBarItem,
TextField, Bandeau (info, alerte, urgence).

Ajoutés par les fondations (FRONTEND §5.5) : EnTete (retour + titre + action), EtatsEcran (les 5 états d'un écran
pilotés par une requête), BandeauHorsLigne (+ `lib/useEnLigne.ts`, NetInfo), Toast (message court avec action,
ex. « Annuler » 10 s), CarteModification (avant barré / après / ce qui ne change pas, Appliquer / Garder,
état « Appliqué » + Annuler), CompteARebours (« dans 4 ans et 7 mois » / « dans 23 semaines » / « J-45 » + date),
GraphiqueBarres et GraphiqueCourbe (react-native-svg, zone optimale, résumé texte pour le lecteur d'écran),
LigneListe (ligne tactile ≥ 48 px : icône, titre, sous-titre, valeur, chevron), Interrupteur (Switch avec libellé).

Remonter en haut quand on touche l'onglet actif : `useScrollToTop(ref)` importé de `expo-router` sur la liste
principale de chaque onglet. Pastilles orange de la barre d'onglets : `features/notifications/useBadges.ts`.
Écran secondaire pas encore fait : `components/EcranAVenir.tsx`.

TanStack Query est relié à NetInfo (`onlineManager`) : hors ligne, les requêtes sont mises en pause et les données
en cache restent affichées ; elles repartent seules au retour du réseau.

## 4. Routes serveur (préfixe `/api/athlete`, jeton obligatoire) — source : `coachia-agents-v6/routes/athlete.js`

Existantes et utilisables telles quelles (format exact : lire le gestionnaire dans le serveur, lecture seule) :

| Écran | Route | Notes |
| --- | --- | --- |
| Programme | `GET /calendrier?mois=AAAA-MM` | `{ mois, debut, fin, blocs[{id,nom,phase,date_debut,date_fin,statut}], jours[{date, jour, aujourdhui, passe, seances[ResumeSeance + realise?], evenements[{id,nom,priorite,type,discipline,icone}], repos}], stats{seances_prevues, faites, manquees, minutes_prevues, hors_programme, assiduite_pct}, legende }` |
| Programme | `GET /calendrier/legende` | `{ sports[{code,nom}], types[{code,libelle}], intensites[{niveau,libelle,…}], statuts[{code,libelle}], badges[{code,libelle}], zones[] }` (tools/presentationSeance.js) |
| Programme | `GET /programme` | `{ programme, blocs[{id, ordre, nom, phase, date_debut, date_fin, nb_semaines, semaine_deload, objectif_bloc, statut, evenements, modele}], bloc_en_cours, seances, exercices_bloc }` |
| Programme | `GET /programme/seances/:id` | detailSeance (source `apercu` ou `finale`), 202 si `en_preparation` (réessayer) |
| Programme | `POST /programme/adapter` | `{ categorie: 'deplacer', programme_seance_id, changements: { date: 'AAAA-MM-JJ', creneau? } }` (catégories : agenda, lieu, materiel, meteo, duree, envie, voyage, deplacer, fatigue, courbatures, sommeil, stress, blessure, surentrainement, fatigue_persistante, douleur, maladie) |
| Programme | `POST /programme/seances/:id/manquee` | `{ categorie: fatigue\|douleur\|maladie\|travail\|famille\|motivation\|meteo\|voyage\|oubli\|autre, raison?, reporter? }` |
| Programme | `GET /programme/adaptations` | 30 derniers jours : `[{ id, declencheur, categorie, raison, portee, seances_modifiees, details, statut, created_at }]` |
| Programme / Profil | `GET /evenements`, `POST /evenements`, `PATCH /evenements/:id`, `DELETE /evenements/:id` (→ statut annule) | corps : `nom, date_evenement, date_fin?, priorite A\|B\|C, type_evenement (competition, combat, match, course, test, objectif_perso, stage), discipline?, objectif_resultat?, lieu?, notes?, statut?, sport_slug?`. La catégorie de poids n'est PAS dans CHAMPS_EVT côté serveur : manque signalé. |
| Progrès | `GET /tests`, `GET /tests/types`, `POST /tests` | tests_athlete avec types_tests(slug, nom, unite) |
| Progrès | `GET /progressions` | progressions_exercice (e1rm_recent, one_rep_max_kg, tendance, statut_progression, exercices(slug,nom)…) |
| Progrès | `GET /assiduite` | taux 14/28/56 j, manquées d'affilée, raisons, `lecture`, `manquees[]` |
| Progrès | `GET /profil` | `{ charge{acwr, zone, aigue_7j, monotonie, contrainte, chronique_hebdo_28j, donnees_suffisantes…}, zones, references, evenements, memoire, lieux }` |
| Profil | `GET /memoire`, `PATCH /memoire/:id { confirme?, contenu?, importance?, actif? }`, `DELETE /memoire/:id` | |
| Profil | `GET /preferences`, `PATCH /preferences` | `preference_variete 1-5, style_coaching{ton strict\|equilibre\|bienveillant, longueur bref\|standard\|detaille, motivations[], tutoiement, emojis}, contexte_vie{…}, moment_prefere matin\|midi\|soir\|indifferent, notifications{actives, checkin, rappel_min_avant, heure_calme_debut, heure_calme_fin}` + `capacite_recuperation` en lecture |
| Profil | `GET /disponibilites`, `PUT /disponibilites { creneaux[{ jour 1-7, creneau?, heure_debut?, duree_max_min, lieu_id? }] }` | remplace tout |
| Profil | `GET /lieux`, `POST /lieux`, `PATCH /lieux/:id`, `DELETE /lieux/:id` | `nom, type_lieu (salle, domicile, bureau, hotel, exterieur, piste, piscine, terrain, club), equipements[], salle_complete, par_defaut, ville, notes` |
| Notifications | `GET /notifications` | `{ a_venir[{id, type, envoyer_le, titre, corps, donnees, programme_seance_id}], envoyees[{id, type, envoyee_le, titre, corps}] }` (rappels planifiés : pas d'état « lu ») |

Absentes (à créer côté serveur, liste exacte dans `docs/MANQUES-SERVEUR.md`) : chat du coach protégé par le jeton
(le superviseur n'est joignable que par `POST /api/agent/ask`, non protégé : interdit à l'app), propositions du
coach (appliquer / annuler), crédits, `POST /programme/seances/:id/demarrer`, champ `recuperation` de `/accueil`,
records et jalons, percentiles, charge par semaine, ligues et défis, état « lu » des notifications, export et
suppression du compte (RGPD), abonnement (lecture), santé (blessures), catégorie de poids des événements.

## 5. Écarts encore ouverts sur Aujourd'hui et En séance (FRONTEND §1, §4.1, §4.3)

- Onglets : icônes FRONTEND §3.1 (`sun`, `calendar`, `message-circle`, `bar-chart-3`, `user`), badge orange Coach
  (proposition en attente) et Profil (consentement manquant), barre masquée dans le chat → fondations.
- Aujourd'hui : cloche → Notifications avec compteur ; anneau Forme → détail ; carte séance → détail
  (`programme/seance/[id]`) ; carte objectif → événement ; « Modifier avec le coach » → coach avec contexte ;
  états de la carte séance « faite » et « aucun programme (Générer) » ; couleur de forme toujours avec libellé.
- En séance : « Remplacer » → coach avec le contexte de l'exercice ; nom de l'exercice → `exercice/[slug]`.
- Restent côté serveur : `demarrer`, `recuperation`.

## 6. Vérification de référence (avant les étapes 6 à 9)

- `npx tsc --noEmit` : 0 erreur. `npx expo lint` : 0 erreur (eslint.config.js présent).
- `npx expo export --platform android|ios` : OK.
- `npx expo-doctor` : 17/20 ; les 3 échecs viennent de l'absence de réseau vers exp.host dans le conteneur
  (schéma de configuration, React Native Directory, versions attendues) : rien de nouveau ne doit apparaître.
