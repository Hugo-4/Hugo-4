# FRONTEND.md — Plan du front-end Athlenis

Document de référence pour Claude Code (dépôt de l'app Expo). Il complète `ECRANS.md` (contenu de chaque écran) et `PLAN.md` (ordre des étapes) : en cas de conflit, ce fichier gagne pour la navigation, les boutons et le design ; `ECRANS.md` gagne pour les données et les routes serveur.

Version du 25/10/2026.

---

## 0. Décisions immédiates (réponse aux points bloquants de l'étape 5)

1. **Route de démarrage de séance : option B.** Ajouter côté serveur `POST /api/athlete/programme/seances/:id/demarrer`, protégée par le jeton (`req.userId`) : crée la séance finale du jour avec le check-in, renvoie le détail avec les identifiants (`seance_id`, lignes `exercices_seance`). Hugo pousse d'abord sa version du serveur sur GitHub, puis cette route est ajoutée **dans le dépôt serveur**, pas dans l'app.
2. **Faille à corriger avant toute autre chose côté serveur :** `POST /api/agent/ask` accepte un `userId` dans le corps sans vérifier qui appelle. Elle doit soit exiger le jeton et utiliser `req.userId`, soit être réservée à l'admin (`x-admin-token`). L'app ne l'appelle jamais.
3. **Stockage hors ligne : OK pour `@react-native-async-storage/async-storage`**, derrière une petite interface `features/seance/fileEnvoi.ts` (`ajouter`, `lister`, `retirer`) pour pouvoir passer à `expo-sqlite` plus tard sans toucher aux écrans. Une entrée par série validée, avec un identifiant unique généré sur le téléphone (le serveur doit ignorer un doublon).
4. **`expo-keep-awake` : OK**, activé seulement pendant l'écran En séance.

Règle générale inchangée : toute nouvelle dépendance est proposée à Hugo avant installation (liste prévue en section 7).

---

## 1. Ce qu'on corrige sur l'écran Aujourd'hui actuel

Constaté sur la capture du 25/10 (téléphone en anglais, programme qui démarre lundi) :

| # | Problème | Correction |
| --- | --- | --- |
| 1 | Interface en anglais, mais les textes du serveur en français (« HIIT — conditionnement anaerobie rounds intenses ») | La langue de l'app est un réglage du profil (colonne existante `users.langue`, défaut = langue du téléphone au premier lancement). Chaque appel au serveur envoie `Accept-Language`. Le serveur rédige dans cette langue. Signaler au serveur les accents manquants (« anaérobie »). |
| 2 | Bouton rond gris avec un engrenage, qui flotte par-dessus les cartes | S'il vient de l'app : le supprimer (les réglages sont dans Profil). Si c'est l'outil de développement d'Expo : rien à faire, il n'existe pas dans la version publiée. |
| 3 | « Ta semaine » affiche 7 × « Rest » et « 0/0 sessions done · 0 min planned » alors que la prochaine séance est lundi | Quand la semaine en cours est vide parce que le programme n'a pas commencé : afficher la semaine du programme (« Semaine 1 · dès lundi 26 ») au lieu de la semaine passée. Ne jamais écrire « Repos » sous un jour où il n'y a simplement rien de prévu : laisser vide. Masquer la ligne de bilan si 0 séance prévue. |
| 4 | « Olympics game · 1699 days » | Compte à rebours lisible : plus de 365 jours → « dans 4 ans et 7 mois » ; de 60 à 365 jours → « dans 23 semaines » ; moins de 60 jours → « J-45 ». Toujours la date en dessous (« 20 juin 2031 »). Toucher la carte ouvre l'événement. |
| 5 | Carte Repos sans rien à faire | Repos = récupération active : proposer 1 action utile fournie par le serveur (mobilité 10 min, marche, sommeil), plus « Voir ma prochaine séance ». Jamais de bouton « Faire une séance quand même » mis en avant. |
| 6 | La carte Forme n'existe pas avant le check-in | Correct selon la fiche. Ajouter sous le bouton une ligne d'aide : « 30 secondes, 7 questions » pour lever la barrière. |
| 7 | Contrastes | Tous les textes secondaires en `texte2` (#9AA39E). Le gris #6E7671 actuel des jours de repos ne passe pas le contraste minimal : ne l'utiliser que pour des éléments décoratifs. |

---

## 2. Principes (à appliquer à chaque écran)

1. **Une question par écran.** Aujourd'hui = « Qu'est-ce que je fais aujourd'hui et suis-je en forme ? ». Programme = « Qu'est-ce qui m'attend ? ». Progrès = « Est-ce que je progresse ? ». Coach = « Je veux changer quelque chose ». Profil = « Mes réglages et mes données ».
2. **La réponse en 3 secondes, le détail sur demande.** Chiffre principal en grand, détail derrière un toucher (trois niveaux : vue d'ensemble → tendance → détail, comme WHOOP).
3. **Une seule action principale par écran**, en couleur accent pleine. Tout le reste en bouton secondaire (contour) ou lien.
4. **Le pouce d'abord.** Actions principales dans la moitié basse de l'écran ; cibles tactiles de 48 × 48 minimum ; En séance utilisable d'une main, en sueur, sans lire.
5. **L'app n'invente aucun texte de coaching.** Phrases du coach, raisons d'ajustement, conseils de repos : toujours fournis par le serveur. L'app ne compose que des libellés d'interface.
6. **Honnête, jamais culpabilisant.** Pas de compliments génériques, pas de message de honte après une pause, pas de classement sur le poids ou le volume. Les records affichés sont des faits réels.
7. **Chaque écran a ses 5 états** : chargement (squelettes, pas de spinner plein écran), vide (explication + action), erreur (message clair + Réessayer), hors ligne (bandeau, données en cache), normal.
8. **La sécurité passe avant tout.** Le bouton « Signaler une douleur » est toujours visible en séance ; une douleur > 3/10 arrête l'exercice ; les signes d'urgence renvoient vers le 15 / 112.

---

## 3. Navigation

### 3.1 Barre d'onglets (5 onglets, toujours visible sauf en séance, au check-in et dans le chat)

| Ordre | Onglet FR / EN | Icône (lucide) | Badge |
| --- | --- | --- | --- |
| 1 | Aujourd'hui / Today | `sun` | — |
| 2 | Programme / Plan | `calendar` | — |
| 3 | **Coach** (central, surélevé, fond accent) | `message-circle` | point orange si une proposition attend une réponse |
| 4 | Progrès / Progress | `bar-chart-3` | — |
| 5 | Profil / Profile | `user` | point orange si un consentement ou un réglage manque |

Règles : l'onglet Coach est une destination (l'écran de chat), pas une action. Toucher l'onglet actif remonte en haut de la liste. Libellés toujours affichés sous les icônes.

### 3.2 Arborescence expo-router

```
app/
  _layout.tsx                 → fournisseurs (Query, i18n, thème), garde de connexion
  (auth)/connexion.tsx, inscription-compte.tsx, mot-de-passe.tsx
  (onboarding)/…              → questionnaire (parcours A / B, voir ECRANS.md §4)
  (tabs)/_layout.tsx          → barre d'onglets
  (tabs)/index.tsx            → Aujourd'hui
  (tabs)/programme/index.tsx  → Programme
  (tabs)/coach.tsx            → Coach
  (tabs)/progres/index.tsx    → Progrès
  (tabs)/profil/index.tsx     → Profil
  checkin.tsx                 → feuille modale (presentation: 'formSheet')
  seance/[id].tsx             → plein écran, sans onglets (presentation: 'fullScreenModal')
  seance/[id]/fin.tsx         → fin de séance et résumé
  programme/seance/[id].tsx   → détail d'une séance prévue
  programme/evenement/[id].tsx, programme/evenement/nouveau.tsx
  exercice/[slug].tsx         → fiche technique (consignes, vidéo plus tard)
  notifications.tsx
  profil/…                    → sous-pages (abonnement, appareils, préférences, consentements, mémoire, données)
  abonnement.tsx              → choix d'offre (plus tard)
```

Liens profonds : `athlenis://checkin`, `athlenis://seance/:id`, `athlenis://coach`. Ils servent aux notifications.

### 3.3 Qui ouvre quoi

```
Aujourd'hui ─┬─ « Faire mon check-in » ──────► checkin (feuille)
             ├─ « DÉMARRER LA SÉANCE » ──────► seance/[id] ──► seance/[id]/fin ──► Aujourd'hui
             ├─ « Modifier avec le coach » ──► coach (contexte = séance du jour)
             ├─ carte Semaine / « Voir le mois » ► Programme
             ├─ carte Objectif ──────────────► programme/evenement/[id]
             ├─ cloche ──────────────────────► notifications
             └─ avatar ──────────────────────► Profil
Programme ───┬─ jour / séance ───────────────► programme/seance/[id] ─► (si aujourd'hui) seance/[id]
             └─ « + Compétition » ───────────► programme/evenement/nouveau
Séance ──────┬─ nom d'un exercice ───────────► exercice/[slug] (feuille, la séance continue)
             └─ « Remplacer » ───────────────► coach (contexte = exercice)
```

---

## 4. Écran par écran : boutons et états

Notation : **[P]** bouton principal (accent plein), **[S]** secondaire (contour), **[L]** lien texte, **[I]** icône seule (avec `accessibilityLabel`).

### 4.1 Aujourd'hui

Ordre des blocs (de haut en bas) : en-tête → Forme ou check-in → carte fatigue (si présente) → séance du jour → objectif → semaine → nutrition → record.

| Élément | Type | Action |
| --- | --- | --- |
| Cloche (avec compteur) | [I] | ouvre Notifications |
| Avatar (initiales) | [I] | ouvre Profil |
| « Faire mon check-in » | [P] | ouvre la feuille Check-in (si non fait) |
| Anneau Forme | zone tactile | ouvre le détail de la forme (tendance 7 jours, sommeil, HRV, ressenti) |
| « Alléger ma semaine » / « Garder mon programme » | [P] / [S] | `POST /programme/adaptations/:id/accepter` / `refuser` |
| « DÉMARRER LA SÉANCE » | [P] | `POST …/demarrer` puis ouvre En séance |
| « Modifier avec le coach » | [S] | ouvre Coach avec le contexte de la séance |
| Carte séance (hors bouton) | zone tactile | ouvre le détail de la séance |
| Carte objectif | zone tactile | ouvre l'événement |
| « Voir le mois » | [L] | onglet Programme |
| « + Repas » | [S] | saisie repas (étape nutrition, plus tard) |

États de la carte séance :
- **Séance prévue** : titre, durée · RPE cible · nombre d'exercices · lieu, 3 premiers exercices, [P] + [S].
- **Séance en cours** (l'app a été fermée pendant la séance) : « Reprendre la séance » [P].
- **Séance faite** : coche accent, résumé (durée, RPE, record éventuel), [L] « Voir le détail ».
- **Repos** : action de récupération du serveur + prochaine séance.
- **Programme pas encore commencé** : « Ton programme démarre lundi 26 » + aperçu de la première séance.
- **Aucun programme** (génération échouée) : message + [P] « Générer mon programme ».

Forme du jour : couleur selon le score, **toujours accompagnée d'un libellé** (jamais la couleur seule) — ≥ 67 accent « Prêt à t'entraîner », 34 à 66 ambre « Journée à surveiller », ≤ 33 rouge « Journée à alléger ». Sans montre ni check-in : pas de score inventé.

### 4.2 Check-in (feuille modale)

- Curseurs 1-10 : énergie, sommeil, courbatures, motivation, stress. Libellé aux deux extrémités (« Épuisé » … « En pleine forme »). Valeur par défaut = la dernière saisie.
- Douleurs : silhouette corps ou liste de zones, puis intensité 0-10. « Aucune douleur » en un geste.
- Durée disponible et lieu : puces.
- Si énergie basse : « C'est passager ? » + puces (mauvaise nuit, soirée, voyage, décalage horaire, stress ponctuel, enfant, travail tardif, autre).
- [P] « Valider » en bas, toujours visible. Fermer sans valider ne perd pas la saisie (brouillon local).
- Questions de santé (douleurs) seulement si le consentement santé est donné ; sinon la ligne est remplacée par un lien vers Consentements.

### 4.3 En séance (étape 5)

Le plan proposé par Claude Code est validé. Ajouts :

- **Retours physiques** : vibration légère à la validation d'une série, vibration forte à la fin du repos (`expo-haptics`).
- **Minuteur de repos** : démarre à la validation ; boutons −15 s / +15 s ; « Passer » ; continue si l'app passe en arrière-plan (heure de fin enregistrée, notification locale à la fin — `expo-notifications`, à valider). Plus tard (version de développement) : Live Activity sur l'écran verrouillé.
- **Ligne « Série précédente »** et **charge conseillée** (`POST /serie-suivante`) avec sa raison en une ligne.
- **Toucher le nom de l'exercice** : fiche technique en feuille (consignes, erreurs, vidéo plus tard) sans quitter la séance.
- **Menu « ⋯ » de l'exercice** : Remplacer (ouvre Coach avec le contexte), Passer l'exercice (raison en puces), Ajouter une série.
- **Signaler une douleur** : toujours visible ; zone + intensité ; > 3/10 → exercice arrêté, proposition de remplacement du coach.
- **Quitter** : confirmation si des séries sont en cours, avec « Terminer la séance » (envoie ce qui est fait) ou « Abandonner ».
- **Hors ligne** : bandeau discret « Hors ligne · 3 séries en attente d'envoi » ; jamais de blocage.
- Écran allumé (`expo-keep-awake`) seulement sur cet écran.
- Chiffres en Barlow Condensed 40 px minimum ; boutons − / + de 48 px ; « VALIDER LA SÉRIE » de 60 px de haut, en bas de l'écran.

Fin de séance : RPE global (6-10), durée réelle (préremplie), fatigue, douleurs, commentaire libre ; puis résumé (volume, records battus, séries faites / prévues) et [P] « Terminer ».

### 4.4 Coach

- En-tête : retour, « Coach », puce de contexte (« Sur : Force · bas du corps ») avec une croix pour la retirer, solde de crédits (toucher → explication et abonnement).
- Messages : réponse du coach affichée au fil de l'eau si le serveur le permet, sinon indicateur « Le coach réfléchit… ».
- **Carte de modification** : avant (barré) / après, « Ce qui ne change pas », [P] « Appliquer » / [S] « Garder l'original ». Après application : la carte se fige avec « Appliqué » et un lien « Annuler » pendant 10 secondes.
- Réponses rapides (puces, 40 px de haut) : « Je n'ai que 30 min », « Pas de salle aujourd'hui », « Décaler à demain », « J'ai mal quelque part ».
- Saisie : champ texte, dictée, envoyer. Moins de 20 % de crédits : ligne discrète.
- 👍 / 👎 sous chaque réponse (`messages_coach.avis`).
- Bandeau d'urgence si le serveur signale des signes d'alerte : « Appelle le 15 ou le 112 » (bouton qui compose le numéro).
- Erreur réseau : le message reste dans le champ, [S] « Réessayer ».

### 4.5 Programme (étape 7)

- En haut : objectif A (nom, compte à rebours, date) + frise des blocs (nom, phase, dates, semaine allégée marquée).
- Calendrier du mois (`GET /calendrier?mois=`), une pastille par jour avec le code et la couleur de `GET /calendrier/legende`, intensité 1-5.
- Toucher un jour → détail de la séance : exercices, durée, objectif ; actions [S] « Déplacer » (sélecteur de date), [S] « Modifier avec le coach », [L] « Séance manquée ».
- [S] « + Compétition » → formulaire événement (nom, date, sport, distance / catégorie de poids / poste selon le sport, priorité A/B/C). Une seule compétition A par sport : en ajouter une seconde demande confirmation.
- Historique des adaptations (liste, plus bas).

### 4.6 Progrès (étape 8)

Trois niveaux : vue d'ensemble → tendance → détail.
- Records et jalons (faits réels, date).
- Tests (1RM estimé, VMA, FTP, saut…) : dernière valeur + courbe.
- Niveau par qualité en percentile, toujours avec le groupe de comparaison (« amateurs, 25-34 ans, boxe »).
- Charge d'entraînement : barres par semaine + zone optimale (ACWR), régularité (semaines réussies).
- Pas de classement public avant 15 ans ; jamais sur le poids ni le volume.

### 4.7 Profil (étape 9)

Liste de rubriques : Identité · Sports, ambitions et niveaux · Objectifs et compétitions · Disponibilités et lieux · Abonnement et crédits · Appareils connectés · Préférences (entraînement, nutrition, style de coaching, notifications, **langue**) · Santé · Consentements · Ce que le coach a retenu · Mes données (export, suppression du compte) · Aide.
Suppression du compte : double confirmation, rien d'autre en rouge sur l'écran.

### 4.8 Notifications (liste)

Types : proposition du coach en attente, adaptation de la semaine, rappel de check-in, compétition proche, nouveau record. Chaque ligne ouvre l'écran concerné. « Tout marquer comme lu » en [L].

---

## 5. Système de design

Base : les maquettes validées (canevas « Athlenis — Écrans de l'app », palette A « Vert électrique »). Toutes les valeurs vivent dans `theme/tokens.ts` ; aucun code couleur en dur dans les écrans.

### 5.1 Couleurs (contrastes vérifiés)

| Jeton | Valeur | Usage | Contraste |
| --- | --- | --- | --- |
| `fond` | #0B0D0C | fond d'écran | — |
| `surface1` | #151816 | cartes | — |
| `surface2` | #1E2220 | blocs dans une carte, champs | — |
| `bordure` | #2A2F2C | séparateurs, contours décoratifs | décoratif seulement |
| `bordureChamp` | #6A736E | contour des champs et boutons secondaires | 3,6:1 sur surface1 |
| `texte` | #F2F4F1 | texte principal | 16:1 |
| `texte2` | #9AA39E | texte secondaire, libellés | 6,9:1 sur surface1 |
| `accent` | #C8FF2E | action principale, état « fait », forme bonne | 16,5:1 sur fond |
| `surAccent` | #0B0D0C | texte sur fond accent | 16,5:1 |
| `alerte` | #FF8A3D | douleur, surcharge, badge | 7,6:1 sur surface1 |
| `vigilance` | #FFC94D | forme moyenne | 11,7:1 |
| `danger` | #FF6B6B | forme basse, erreur, urgence | 6,5:1 |
| `info` | #5EC8FF | information neutre, liens dans le chat | 9,5:1 |

Règles : une seule couleur d'accent ; une couleur ne porte jamais seule une information (toujours un libellé ou une icône) ; pas de dégradé ; mode sombre uniquement pour le lancement (barre d'état et écran de démarrage compris).

### 5.2 Typographie

- **Barlow Condensed** (600-700) : titres, chiffres, boutons principaux en majuscules.
- **Manrope** (400-700) : tout le reste.

| Style | Police | Taille / interligne | Usage |
| --- | --- | --- | --- |
| `chiffreXL` | Barlow 700 | 44 / 44 | score de forme, charge en séance |
| `titre1` | Barlow 700 | 30 / 34 | titre d'écran, nom de séance |
| `titre2` | Barlow 600 | 22 / 26 | titre de carte |
| `bouton` | Barlow 700 | 20-24, majuscules, espacement 1 | bouton principal |
| `corps` | Manrope 500 | 15 / 22 | texte courant |
| `corpsFort` | Manrope 700 | 15 / 22 | valeurs |
| `petit` | Manrope 500 | 13 / 18 | détails |
| `micro` | Manrope 600 | 11-12, majuscules, espacement 1 | sur-titres (« BLOC 2 · SEMAINE 3 / 8 ») |

Taille de texte du système respectée (`allowFontScaling`), avec `maxFontSizeMultiplier` à 1,3 sur les chiffres géants et les boutons pour ne pas casser la mise en page. Rien sous 11 px.

### 5.3 Espacements, formes, profondeur

- Grille de 4 : 4, 8, 12, 16, 20, 24, 32. Marges d'écran 16. Espace entre cartes 16. Padding de carte 18.
- Rayons : carte 20, bouton principal 16, bouton secondaire 14, puce 20 (pilule), petit bloc 12.
- Profondeur par la couleur de surface (fond → surface1 → surface2), pas d'ombres.
- Hauteurs : bouton principal 56 (60 en séance), secondaire 44-48, puce 40 ; toute zone tactile ≥ 48 × 48 (marge invisible si l'élément visible est plus petit).

### 5.4 Icônes, mouvement, retours

- Icônes `lucide-react-native`, trait 1,8, taille 20-24. Jamais d'emoji dans l'interface (sauf 👍/👎 du chat).
- Animations courtes (150-250 ms) avec Reanimated : apparition des cartes, remplissage de l'anneau, passage d'une série à l'autre. Si « Réduire les animations » est activé sur le téléphone : aucune animation décorative.
- Vibrations (`expo-haptics`) : validation de série, fin de repos, application d'une proposition du coach. Pas ailleurs.

### 5.5 Composants à créer dans `components/` (une fois, réutilisés partout)

`Bouton` (principal, secondaire, lien, danger) · `Carte` · `Puce` (sélectionnable) · `AnneauScore` · `BarreProgression` · `PastilleJour` (fait, aujourd'hui, prévu, repos, vide) · `Segmente` (bascule à 2-3 choix) · `PasAPas` (− valeur +) · `ChoixRPE` · `Curseur1a10` · `Feuille` (bottom sheet) · `Bandeau` (hors ligne, alerte, urgence) · `EtatVide` · `Squelette` · `Toast` · `CarteModification` (avant / après du coach) · `CompteARebours`.
Chaque composant : accessible (`accessibilityRole`, `accessibilityLabel`, `accessibilityState`), testé dans les deux langues.

### 5.6 Textes

- Tutoiement, phrases courtes, verbes d'action sur les boutons (« Démarrer », pas « OK »).
- Formats français : `1 840 kcal`, `7 h 12`, `2,5 kg`, `lun. 26 oct.` ; formats anglais équivalents via `Intl`.
- Tous les libellés dans `locales/fr.json` et `locales/en.json`, aucun texte en dur. Les textes du serveur sont affichés tels quels.

---

## 6. Données et fonctionnement

- **Cache serveur** : TanStack Query pour tous les `GET` (cache, rechargement au retour sur l'écran, tirer pour rafraîchir). Après une action (appliquer, accepter, valider) : invalider les requêtes concernées.
- **État local** : Zustand seulement pour ce qui ne vient pas du serveur (séance en cours, brouillon de check-in, préférence de vue en séance).
- **Hors ligne** : file d'envoi (section 0, point 3), rejouée au retour du réseau (`@react-native-community/netinfo`) et au démarrage de l'app.
- **Erreurs** : 401 → reconnexion ; 402 ou crédits épuisés → explication + abonnement ; 5xx → message + Réessayer ; jamais d'écran blanc.
- **Sécurité** : seule la clé publique Supabase dans l'app ; tous les appels portent le jeton de l'utilisateur ; aucune clé dans le dépôt.

---

## 7. Pile technique

Rester sur **Expo SDK 57 avec Expo Go** tant que l'app se teste dans Expo Go : le SDK 58 (sorti le 15/10/2026) n'a pas encore son Expo Go. Passer à une **version de développement** (EAS) quand on attaque : notifications push, Live Activity du minuteur, Apple Health / Health Connect, achats intégrés.

Dépendances (à valider par Hugo avant installation, cocher ce qui est déjà là) :

| Besoin | Paquet | Fonctionne dans Expo Go |
| --- | --- | --- |
| Navigation | `expo-router` (déjà) | oui |
| Cache serveur | `@tanstack/react-query` | oui |
| État local | `zustand` | oui |
| Stockage local | `@react-native-async-storage/async-storage` | oui |
| Réseau | `@react-native-community/netinfo` | oui |
| Écran allumé | `expo-keep-awake` | oui |
| Vibrations | `expo-haptics` | oui |
| Notification de fin de repos | `expo-notifications` (locales seulement) | oui pour les locales |
| Animations | `react-native-reanimated` | oui |
| Feuilles modales | `@gorhom/bottom-sheet` ou les feuilles natives d'expo-router | oui |
| Anneaux et icônes | `react-native-svg`, `lucide-react-native` | oui |
| Graphiques (Progrès) | `victory-native` + `@shopify/react-native-skia` | oui |
| Listes longues | `@shopify/flash-list` | oui |
| Traductions | `i18next`, `react-i18next`, `expo-localization` (déjà ?) | oui |

Structure : `app/` (routes), `features/<domaine>/` (données, logique, composants propres), `components/` (communs), `theme/`, `lib/` (api, supabase, file d'envoi), `locales/`.

---

## 8. Ordre des étapes (mise à jour de PLAN.md)

1. **Étape 5 — En séance** (avec la route `demarrer` côté serveur et la faille corrigée).
2. **Étape 5 bis — Corrections d'Aujourd'hui** (tableau de la section 1) et composants communs de la section 5.5 qui manquent.
3. **Étape 6 — Coach**.
4. **Étape 7 — Programme** (dont l'ajout de compétition).
5. **Étape 8 — Progrès**.
6. **Étape 9 — Profil** (dont la langue et la modification de l'échéance).
7. **Version de développement** : notifications, Live Activity, santé connectée, abonnements.

## 9. Une étape est finie quand

- Les 5 états de chaque écran existent (chargement, vide, erreur, hors ligne, normal).
- Tout fonctionne en français et en anglais, sans texte coupé, y compris avec la taille de texte du téléphone au maximum.
- Toutes les zones tactiles font 48 × 48 et tous les boutons-icônes ont un libellé d'accessibilité.
- Aucune couleur ni taille en dur hors de `theme/tokens.ts`.
- Testé sur le téléphone de Hugo (Expo Go), réseau coupé compris pour En séance.
- Commit sans push ; Hugo relit avant de pousser, jamais de `--force`.
