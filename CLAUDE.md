# Athlenis — application mobile

Athlenis est un coach sportif IA pour les athlètes qui visent la performance : amateurs qui s'entraînent comme des semi-pros, semi-pros, athlètes olympiques et jeunes espoirs. Ce dépôt contient **uniquement l'application mobile**. Toute l'intelligence (agents IA, doctrine scientifique, génération des programmes, adaptations) vit dans le serveur `coachia-agents-v6` et dans Supabase : l'application affiche, saisit et envoie, elle ne décide rien.

Lis ce fichier en entier au début de chaque session, puis `docs/PLAN.md` (l'étape en cours) et la fiche de l'écran concerné dans `docs/ECRANS.md`.

## Pile technique

- **Expo** (dernière version stable du SDK), **React Native**, **TypeScript** strict.
- **expo-router** pour la navigation (routes par fichiers, onglets).
- **@supabase/supabase-js** pour l'authentification et les lectures simples protégées par RLS, session stockée avec `expo-secure-store`.
- **@tanstack/react-query** pour toutes les données venant du serveur (cache, chargement, erreurs, rafraîchissement).
- **i18next** + **react-i18next** + **expo-localization** : français et anglais dès le premier écran.
- **react-native-svg** pour les anneaux et jauges, **react-native-reanimated** pour les animations, **lucide-react-native** pour les icônes.
- Polices : **Barlow Condensed** (titres, chiffres) et **Manrope** (texte), via `@expo-google-fonts/barlow-condensed` et `@expo-google-fonts/manrope`.
- Plus tard seulement (ne pas installer avant l'étape prévue) : Apple Health / Health Connect, RevenueCat (abonnements), notifications push.

Avant d'ajouter une dépendance qui n'est pas listée ici, explique pourquoi et attends mon accord.

## Connexion au serveur et à Supabase

- Variables d'environnement (fichier `.env`, jamais commité) :
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY` (clé publique « anon » / « publishable »)
  - `EXPO_PUBLIC_API_URL` (URL du serveur coachia-agents-v6)
- **Règle de sécurité absolue : la clé secrète Supabase (`service_role` / `secret`) et l'`ADMIN_TOKEN` ne doivent JAMAIS apparaître dans ce dépôt ni dans l'application.** Si une tâche semble en avoir besoin, c'est qu'elle doit être faite côté serveur : arrête-toi et dis-le.
- Chaque appel au serveur envoie `Authorization: Bearer <access_token>` de la session Supabase. Centralise-le dans `lib/api.ts` (un seul client, gestion des erreurs 401 → reconnexion).
- La liste des routes est documentée en tête de `routes/athlete.js` dans le projet serveur. Pour une route que tu ne trouves pas (génération de la séance du jour, chat avec le coach, check-in), cherche dans le dossier `routes/` et le fichier principal du serveur, ou demande-moi. N'invente jamais une route.
- Les données de santé (douleurs, blessures, cycle) ne sont envoyées que si l'athlète a donné son consentement (table `consentements`, fonction `a_consentement`). La base refuse sinon.

## Design

Mode sombre uniquement. Toutes les valeurs viennent de `theme/tokens.ts` : aucune couleur, taille ou espacement écrit en dur dans un composant.

| Jeton | Valeur | Usage |
| --- | --- | --- |
| `fond` | `#0B0D0C` | arrière-plan de l'app |
| `carte` | `#151816` | cartes |
| `carte2` | `#1E2220` | encarts dans une carte, champs |
| `ligne` | `#2A2F2C` | bordures, séparateurs |
| `texte` | `#F2F4F1` | texte principal |
| `texte2` | `#C9D0CB` | texte secondaire fort |
| `discret` | `#9AA39E` | libellés, légendes |
| `accent` | `#C8FF2E` | couleur principale (vert électrique) : boutons principaux, anneaux, éléments actifs |
| `surAccent` | `#0B0D0C` | texte posé sur l'accent |
| `alerte` | `#FF8A3D` | douleur, fatigue, série de semaines, compteur de notifications |

- Rayons : cartes 20, boutons 16, petits éléments 12. Espacements : multiples de 4 (bord d'écran 16, entre cartes 16, dans une carte 14).
- Titres et chiffres : Barlow Condensed 600-700. Texte : Manrope 400-700. Taille minimale 12.
- Cibles tactiles de 44 × 44 minimum. Chaque bouton qui n'a qu'une icône a un `accessibilityLabel`. Contraste du texte ≥ 4,5:1.
- Les maquettes de référence sont dans le canvas « Athlenis — Écrans de l'app » (écrans Aujourd'hui, En séance, Coach, Inscription). Reproduis leur structure ; adapte les détails à ce qui est natif sur iOS et Android.

## Règles de code

- Arborescence : `app/` (écrans, expo-router), `components/` (composants réutilisables), `features/<domaine>/` (logique et hooks par domaine : seance, programme, coach, nutrition, profil), `lib/` (api, supabase, i18n), `theme/`, `locales/fr.json` et `locales/en.json`.
- Noms : les termes métier suivent ceux de l'API et de la base (`seance`, `programme`, `bloc`, `checkin`, `rpe`), le reste en anglais (`useQuery`, `Button`, `isLoading`).
- Aucun texte affiché écrit en dur : tout passe par `t('...')`, avec les deux langues remplies.
- Petits composants (moins de 150 lignes), un composant par fichier, pas de logique métier dans les écrans.
- Chaque écran gère les quatre états : chargement (squelette), erreur (message + réessayer), vide, rempli.
- Ne recalcule jamais côté app une décision du coach (charge, volume, RPE, fatigue) : affiche ce que renvoie le serveur.
- Pendant une séance, une série validée est enregistrée localement tout de suite, puis envoyée au serveur ; une coupure réseau ne doit rien faire perdre.

## Façon de travailler

1. Une étape de `docs/PLAN.md` à la fois. Ne commence pas l'étape suivante sans que je la valide.
2. Avant de coder, résume en quelques lignes ce que tu vas faire et les fichiers touchés.
3. Après chaque étape : `npx tsc --noEmit` sans erreur, `npx expo lint` sans erreur, l'app démarre avec `npx expo start`, puis dis-moi exactement quoi tester sur mon téléphone.
4. Un commit par étape, message en français qui dit ce qui marche maintenant.
5. Si une information manque (route, champ, comportement), demande plutôt que deviner.
