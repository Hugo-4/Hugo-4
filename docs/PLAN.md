# Plan de construction

Une étape par session de travail. Chaque étape se termine par une app qui démarre et que je peux tester sur mon téléphone.

## Étape 1 — Squelette, thème et navigation (données fictives)
- Créer le projet Expo (TypeScript, expo-router), installer les dépendances de base listées dans `CLAUDE.md`.
- `theme/tokens.ts`, chargement des polices, mode sombre partout (y compris barre d'état et écran de démarrage).
- i18n FR/EN en place, langue du téléphone par défaut.
- Barre d'onglets : Aujourd'hui · Programme · **Coach** (bouton central surélevé, couleur accent) · Progrès · Profil.
- Écran Aujourd'hui construit avec des **données fictives** (`features/accueil/mock.ts`) en suivant la fiche.
- **Test** : l'app s'ouvre sur Aujourd'hui, les 5 onglets fonctionnent, FR/EN bascule selon le téléphone.

## Étape 2 — Connexion
- Client Supabase, écrans d'inscription et de connexion (email + mot de passe ; Apple et Google plus tard), session persistante.
- `lib/api.ts` : client du serveur avec le jeton, gestion du 401.
- Redirection : non connecté → connexion ; connecté sans profil → Inscription ; sinon Aujourd'hui.
- **Test** : je crée un compte, je ferme l'app, je la rouvre et je suis toujours connecté.

## Étape 3 — Inscription (questionnaire)
- Choix Rapide (4 min) ou Complet (15 min), suivi du parcours correspondant (voir fiche).
- Écran des consentements (CGU, données de santé, santé féminine si concerné) avant toute question de santé ; enregistrement dans `consentements`.
- À la fin : `POST /programme/generer`, écran d'attente animé pendant la génération.
- **Test** : je termine le parcours Rapide et j'arrive sur Aujourd'hui avec mon vrai premier programme.

## Étape 4 — Aujourd'hui branché sur le serveur
- `GET /accueil` remplace les données fictives ; check-in du matin (énergie, sommeil, courbatures, motivation, stress, douleurs, « c'est passager ? »).
- Carte fatigue et proposition de semaine allégée (accepter / refuser).
- **Test** : je fais mon check-in, le score et la séance du jour se mettent à jour.

## Étape 5 — En séance
- Vue « un exercice à la fois » et vue « toute la séance », minuteur de repos, saisie des séries, RPE, douleur, fin de séance avec ressenti.
- Enregistrement local immédiat puis envoi (`PUT /exercices-seance/:id/series`, `POST /serie-suivante`, `POST /seances/:id/feedback`).
- **Test** : je fais une séance complète en mode avion puis je réactive le réseau : tout est envoyé.

## Étape 6 — Coach
- Chat ouvert depuis l'onglet central ou depuis une séance (le contexte de la séance est transmis), propositions de modification avec Appliquer / Garder l'original, réponses rapides, solde de crédits.
- **Test** : je demande « je n'ai que 30 minutes », la séance est raccourcie après Appliquer.

## Étape 7 — Programme
- Calendrier du mois (`GET /calendrier`, `GET /calendrier/legende`), blocs, détail d'une séance, déplacer ou signaler une séance manquée.

## Étape 8 — Progrès
- Records, tests et percentiles, charge d'entraînement, ligues et défis.

## Étape 9 — Profil
- Abonnement et crédits, appareils connectés, préférences, consentements, export et suppression des données, langue.

## Plus tard
- Apple Health et Health Connect, puis Strava et Garmin.
- Abonnements (RevenueCat : App Store, Play Store, Stripe).
- Notifications push (rappels de séance, check-in).
