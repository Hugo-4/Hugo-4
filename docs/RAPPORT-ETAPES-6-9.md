# Rapport : étapes 6 à 9 de l'application Athlenis

Version du 26/10/2026, branche `claude/etape-1-setup-jw60p2`.

Ce rapport dit ce qui est fait, comment le tester sur ton téléphone, ce qui reste sur données fictives, et ce qui
manque encore côté serveur. Les routes serveur à créer sont toutes dans [`docs/MANQUES-SERVEUR.md`](MANQUES-SERVEUR.md).

## 1. Avant de tester

1. Sur l'ordinateur, dans le dossier de l'app : `git pull`, puis `npm install`, puis `npx expo start -c`.
2. Le serveur `coachia-agents-v6` doit tourner (`npm start`) et le téléphone doit être sur le même Wi-Fi.
3. Ouvre l'app dans Expo Go (scanne le QR code) et connecte-toi avec ton compte.

Ce qui n'existe pas encore côté serveur fonctionne avec des **données fictives** au même format (voir §4) :
tu peux tout parcourir, mais ces données ne viennent pas de ta base.

## 2. Ce qui est fait, étape par étape

### Fondations (avant les étapes)
- Composants communs ajoutés et réutilisés partout : en-tête avec retour, les 5 états d'un écran (squelette,
  erreur + Réessayer, vide + action, hors ligne avec bandeau, normal), bandeau hors ligne, message court avec
  « Annuler », carte « avant / après » du coach, compte à rebours, graphiques en barres et en courbe
  (`react-native-svg`, résumé lisible par le lecteur d'écran), ligne de liste, interrupteur, point de badge.
- Le cache des données se met en pause hors ligne et repart seul au retour du réseau.
- Textes en deux fichiers par domaine (`locales/fr/<domaine>.json`, `locales/en/<domaine>.json`).

### Étape 6 — Coach (onglet central)
Ce qui marche :
- Chat avec historique, réponses rapides, saisie de texte, solde de crédits (ligne discrète sous 20 %).
- Ouverture depuis l'onglet, depuis « Modifier avec le coach » (Aujourd'hui, détail d'une séance) ou
  « Remplacer » en séance : une puce « Sur : … » rappelle le contexte, avec une croix pour le retirer.
- Proposition du coach : carte avant / après, « Appliquer » ou « Garder l'original », puis « Appliqué » avec
  « Annuler » pendant 10 s.
- 👍 / 👎 sur chaque réponse, bandeau d'urgence avec « Appeler le 15 » et « Appeler le 112 » si le serveur le
  signale, message non envoyé conservé avec « Réessayer ».
- Badge orange sur l'onglet Coach quand une proposition attend.

À tester sur le téléphone :
1. Aujourd'hui → « Modifier avec le coach » : le chat s'ouvre avec « Sur : <ta séance> ».
2. Touche « Je n'ai que 30 min » : le coach réfléchit, puis une carte avant / après apparaît.
3. « Appliquer », puis « Annuler (10 s) » avant la fin du décompte.
4. Écris « J'ai une douleur dans la poitrine » : le bandeau rouge et les deux boutons d'appel apparaissent.
5. Retour, puis touche l'onglet Coach : le chat s'ouvre **sans** contexte.
6. En séance, menu « ⋯ » d'un exercice → « Remplacer » : le coach s'ouvre par-dessus la séance ; « Retour »
   ramène à la séance.

### Étape 7 — Programme
Ce qui marche :
- Objectif A en tête (compte à rebours), frise des blocs, compétitions à venir.
- Calendrier du mois avec la légende du serveur, intensité 1 à 5 en points, mois précédent / suivant ;
  aucune information donnée par la couleur seule.
- Détail d'une séance : déplacer (dans la fenêtre acceptée par le serveur), modifier avec le coach, signaler
  manquée (douleur et maladie proposées seulement avec le consentement santé), « Démarrer » si c'est aujourd'hui.
- Compétitions : créer, modifier, supprimer ; précision selon le sport ; une seule A par sport avec
  confirmation ; même nom et même date = mise à jour (pas de doublon).
- Historique des adaptations.

À tester :
1. Onglet Programme : le calendrier du mois, puis « mois suivant ».
2. Touche un jour avec une séance → détail → « Déplacer » → choisis un jour → la séance change de jour.
3. « + Compétition » → nom, date, sport, priorité A → si une A existe déjà, l'app demande de passer l'ancienne
   en B.
4. « Historique des adaptations ».

### Étape 8 — Progrès
Ce qui marche :
- Vue d'ensemble avec une carte par sujet, chacune avec son propre état.
- Tests avec courbe et historique, ajout d'un résultat (`POST /tests`), 1RM estimé par le serveur.
- Charge par semaine avec la zone optimale, régularité (semaines réussies, série en cours, jamais de reproche
  après une pause), records et jalons, niveaux en percentile **toujours** avec le groupe de comparaison.
- Ligues : rien avant 15 ans, jamais sur le poids ni le volume.
- Les données fictives portent l'étiquette « Exemple ».

À tester :
1. Onglet Progrès : chaque carte s'ouvre sur sa vue détaillée.
2. Tests → « Ajouter un résultat » → le point apparaît sur la courbe.
3. Charge : barres de 12 semaines et zone optimale, avec l'explication.

### Étape 9 — Profil complet et Notifications
Ce qui marche :
- Profil : identité, sport, ambitions et niveaux, objectifs et compétitions (dont l'échéance), disponibilités et
  lieux, abonnement et crédits (lecture seule), appareils connectés (« bientôt disponible »), préférences
  (entraînement, nutrition, style de coaching, notifications, langue), santé (seulement avec le consentement),
  « Ce que le coach a retenu » (voir, corriger, effacer), mes données (export, suppression du compte avec double
  confirmation), consentements, déconnexion.
- Retirer le consentement santé masque tout de suite la rubrique Santé, les allergies et les souvenirs de santé.
- La suppression du compte vide aussi ce que l'app garde sur le téléphone, puis ferme la session.
- Notifications : liste avec « lu / non lu », « Tout marquer comme lu », compteur sur la cloche d'Aujourd'hui.

À tester :
1. Profil → Préférences → change le style de coaching : le réglage est enregistré.
2. Profil → Consentements → retire « données de santé » : la rubrique Santé disparaît du Profil.
3. Cloche d'Aujourd'hui → Notifications → « Tout marquer comme lu » : le compteur disparaît.

### Finitions et corrections (Aujourd'hui, check-in, En séance)
- Aujourd'hui : hors ligne sans données, message « Pas de réseau » + Réessayer (plus de squelette sans fin) ;
  avec des données, bandeau hors ligne ; toucher l'onglet remonte en haut ; « Voir ma prochaine séance » ouvre son
  détail ; jours manqués en pointillés et jour courant souligné.
- Check-in : la saisie est gardée sur le téléphone, pour ton compte seulement, et effacée à la déconnexion
  (fermer la feuille ne perd rien) ; « Refaire » reprend tout ce que tu avais envoyé (notes, douleurs, cause, durée,
  lieu) ; « Aucune douleur » ; lien vers le consentement ; hors ligne, l'envoi est désactivé et expliqué.
- En séance : le retour de fin envoie le consentement santé ; aucune durée de repos ni RPE inventés (pas de repos
  après la dernière série, le RPE part vide et la cible s'affiche en repère) ; un double toucher sur « Valider »
  n'enregistre qu'une série ; le conseil du serveur n'écrase plus une charge que tu as modifiée ; minuteur aussi
  dans « Toute la séance » ; boutons 15 / 112 dans la feuille douleur ; lien vers la fiche complète de l'exercice ;
  bouton retour Android avec confirmation ; « Fermer » si le démarrage échoue (sans réseau).

À tester :
1. Ouvre le check-in, réponds à deux questions, ferme la feuille, rouvre : tes réponses sont là. Envoie-le, puis
   « Refaire mon check-in » : tout ce que tu avais envoyé est déjà rempli.
2. Mode avion, puis ouvre une rubrique du Profil jamais ouverte : « Pas de réseau » ; coupe le mode avion :
   la page se charge seule.
3. Démarre une séance, valide une série en touchant deux fois très vite : une seule série est comptée.

## 3. Vérifications obligatoires

Lancées sur le dernier commit, dans le conteneur de travail (Linux ; les mêmes commandes marchent dans PowerShell).

| Vérification | Résultat |
| --- | --- |
| `npx tsc --noEmit` | 0 erreur |
| `npx expo lint` | 0 erreur, 0 avertissement |
| `npx expo export --platform android` | paquet construit sans erreur (sorti hors du dépôt, aucun `dist` commité) |
| `npx expo export --platform ios` | paquet construit sans erreur (idem) |
| `npx expo-doctor` | 17/20, **identique à avant le travail** : les 3 échecs demandent l'accès à exp.host, coupé dans le conteneur (schéma de `app.json`, annuaire React Native, versions du SDK). Aucun nouveau problème. Chez toi, avec Internet, ces 3 contrôles devraient passer. |
| `node scripts/verifier-front.mjs` | 0 problème : traductions (mêmes clés FR / EN, aucune clé manquante), design (aucune couleur ni police en dur hors `theme/`), textes (aucun texte affiché en dur), sécurité (aucun `userId` dans un corps de requête, aucune chaîne ressemblant à une clé) |
| Relecture écran par écran (1er tour, 3 relecteurs qui n'ont pas écrit le code) | 10 écarts bloquants et 82 mineurs. Les 10 bloquants et la grande majorité des mineurs sont corrigés ; ce qui reste est listé en §8 |
| Relecture du 2e tour (relecteur indépendant) | les 10 bloquants sont confirmés corrigés ; il a trouvé 3 régressions réelles dans les corrections (brouillon du check-in partagé entre comptes, « Refaire » le check-in qui effaçait douleurs / durée / lieu, langue remise en français après une confirmation d'email tardive) et 6 autres points (séance sans sortie si le démarrage échoue, 5xx pris pour un refus de suppression, RPE prérempli, double toucher, contexte du Coach perdu en revenant d'un écran ouvert depuis le Coach, rafraîchissement après une adaptation acceptée depuis Aujourd'hui) : **tous corrigés** (commits `b567aca` et `474da11`), revérifiés au banc d'essai. Un trou fonctionnel reste (voir §8) |
| Banc d'essai dans un navigateur (serveur et Supabase simulés) | Coach, Programme, Progrès, Profil, check-in, séance complète, hors ligne, Coach depuis une séance, passage en anglais : tout passe |

Ce qui n'a pas pu être fait ici : l'essai sur un vrai téléphone (Expo Go). C'est la liste « À tester » de §2.

## 4. Écrans sur données fictives et constante à changer

Quand la route serveur existe (voir `docs/MANQUES-SERVEUR.md`), passer la constante à `false` suffit : rien
d'autre ne change dans l'app.

| Écran | Données fictives | Constante (fichier) |
| --- | --- | --- |
| En séance (démarrage) | séance du jour | `SEANCE_FICTIVE` (`features/seance/source.ts`) |
| Coach | réponses, propositions, crédits | `COACH_FICTIF` (`features/coach/source.ts`) |
| Progrès | records, niveaux, charge, régularité, ligues (étiquette « Exemple ») | `PROGRES_FICTIF` (`features/progres/source.ts`) |
| Profil | crédits du mois, export, suppression du compte, préférences de nutrition | `PARAMETRES_FICTIF` (`features/parametres/source.ts`) |
| Notifications | liste avec état « lu » | `NOTIFICATIONS_FICTIF` (`features/notifications/source.ts`) |

Programme n'a pas de données fictives : toutes ses routes existent déjà. Les tests, l'assiduité et le profil de
Progrès, les préférences, disponibilités, lieux, mémoire et compétitions du Profil sont déjà réels.

## 5. Routes serveur manquantes

Tout est dans [`docs/MANQUES-SERVEUR.md`](MANQUES-SERVEUR.md) (méthode, chemin, protection, corps, réponse JSON
exacte, écran). À traiter en premier : la faille de `POST /api/agent/ask` (§0), puis
`POST /programme/seances/:id/demarrer` (§1) et le consentement santé vérifié par le serveur dans
`POST /seances/:id/feedback` (§1).

## 6. Décisions prises sans validation

- **Poussé sur GitHub** : tu as donné l'autorisation de pousser ; chaque commit a été poussé (jamais de
  `--force`, aucun historique réécrit).
- **SDK 58** gardé (FRONTEND §7 parle du 57) : c'est celui d'Expo Go sur ton téléphone.
- **Cibles tactiles à 48 px** (le jeton passait de 44 à 48) et bouton principal à 56 px, comme FRONTEND §5.3.
- **Dictée** : bouton masqué (impossible sans nouvelle dépendance).
- **Message au coach non envoyé** : il reste dans le fil avec « Non envoyé » et « Réessayer ».
- **Fiche d'exercice en séance** : la fiche locale reste (elle marche hors ligne), avec un lien vers la fiche
  complète du catalogue.
- **Une seule route de crédits** (`GET /credits`) pour le Coach et le Profil.
- **Coach depuis une séance** : nouvelle route `coach-seance` en modale, pour que le retour ramène à la séance.
- **RPE d'une série** : il part vide à chaque série et la cible prescrite s'affiche en repère ; si tu ne le donnes
  pas, la série part sans RPE (l'app n'en invente pas) et le serveur ne propose pas de charge pour la suivante.
- **Double toucher sur « Valider »** : un second toucher à moins d'une seconde est ignoré.
- **Recommandation du check-in** écrite en couleur neutre (seul l'anneau suit le score), pour qu'un texte de la
  base ne contredise jamais la couleur.
- **Données fictives de Progrès** marquées « Exemple ».
- **Suppression du compte en démonstration** (`PARAMETRES_FICTIF = true`) : le stockage du téléphone n'est pas
  vidé, puisque le compte n'est pas vraiment supprimé (on ne perd pas de séries non envoyées).
- **Langue** : la langue du téléphone n'est écrite dans le compte qu'au tout premier lancement d'un compte
  créé depuis moins de 10 minutes ; ensuite c'est toujours la langue du compte qui s'applique.

## 7. Dépendances écartées

Aucune dépendance ajoutée pendant les étapes 6 à 9.
- `zustand` : inutile, TanStack Query et l'état local suffisent.
- Bibliothèque de dictée : écartée, bouton masqué.
- Bibliothèque de graphiques (victory-native, skia) : écartée, graphiques dessinés avec `react-native-svg`.
- `flash-list` : inutile pour la taille des listes actuelles.

## 8. Écarts restants

Écarts connus, non bloquants :
- **Calendrier sur un petit Android (360 px de large)** : une case fait 46,6 px au lieu de 48 (50,9 px sur un écran
  de 390 px). Il faudrait réduire le bord d'écran de 16 px sur cet onglet.
- **Graphique de charge** : sur Android, la rangée de libellés vides sous les barres peut garder environ 16 px de
  hauteur. Correction propre : que `GraphiqueBarres` ne dessine pas cette rangée quand elle est vide.
- **Code de la zone optimale** dans `GET /profil` → `charge.zone` : supposé `optimale`, non confirmé (voir
  `docs/MANQUES-SERVEUR.md` §5). Si le serveur renvoie autre chose, la zone ne s'affiche simplement pas.
- **Toucher l'anneau de forme** (Aujourd'hui) : la destination n'est pas définie dans FRONTEND, rien ne se passe.
- **Programme pas encore commencé** : pas de carte « Ton programme démarre lundi 26 » ; la carte de repos montre la
  prochaine séance.
- **Carte de la séance du jour** : elle montre l'heure, pas le lieu.
- **Aujourd'hui** peut afficher jusqu'à trois boutons principaux le même jour (check-in, démarrer, adaptation) ;
  l'ordre de la fiche est respecté mais aucun n'est rétrogradé.
- **Flamme de série et jauge de récupération** d'Aujourd'hui : elles attendent les champs de `GET /accueil`
  (`docs/MANQUES-SERVEUR.md` §2).
- **Grands textes** : la limite d'agrandissement (`multiplicateurMax`) est posée sur les chiffres et libellés
  serrés (onglets, minuteur, pas-à-pas, Progrès, calendrier), pas sur tous les textes.
- **En séance** : sans prescription, les répétitions partent de 10 et la durée de 30 s (valeurs de départ du
  pas-à-pas, modifiables).
- **Remplacement d'un exercice en cours de séance** : quand le coach remplace un exercice (proposition appliquée
  depuis la séance), la séance déjà chargée sur le téléphone ne se recharge pas ; il faudra décider avec le serveur
  comment la relire (nouvelle réponse de `/demarrer` ou route dédiée).
- **Constantes de démonstration** (`…_FICTIF = true`) écrites en dur : à passer à `false` route par route quand le
  serveur est prêt (on pourra les lier à une variable d'environnement).
- **Essai sur un vrai téléphone** : pas faisable ici ; à faire avec la liste « À tester » de §2.

## 9. Commits

Sur la branche `claude/etape-1-setup-jw60p2`, du plus récent au plus ancien. Contrairement au prompt (« rien
n'est poussé »), **tout est poussé** sur GitHub, avec ton autorisation explicite ; jamais de `--force`.

- `474da11` Coach : contexte oublié quand on change d'onglet, gardé au retour d'un écran ouvert depuis le Coach
- `3782f43` Rapport des étapes 6 à 9 : résultat du second tour et écarts restants
- `b567aca` Corrections du second tour de relecture
- `cb30aa9` Rapport des étapes 6 à 9 (docs/RAPPORT-ETAPES-6-9.md)
- `51d1432` Carte du front : route coach-seance et ouverture du Coach depuis une séance
- `cde0fab` Corrections après relecture : Programme et Progrès
- `c0263a5` Séance : le RPE d'une série reste facultatif (aucune valeur inventée, la série part sans)
- `7355683` Corrections après relecture : Profil et Notifications
- `c85a2f0` Corrections après relecture : composants communs, Aujourd'hui, check-in, séance, Coach
- `abf6061` Finitions et intégration des étapes 6 à 9
- `cb0bb88` Étape 9 : Profil complet et Notifications
- `e904593` Étape 7 : Programme
- `35498af` Étape 8 : Progrès
- `9c2f1d7` Étape 6 : Coach
- `7c6cea7` Aujourd'hui : mise en forme de la carte objectif
- `9e7d3ef` Finitions d'Aujourd'hui (FRONTEND.md §4.1)
- `453c634` Fondations des étapes 6 à 9
- (mise à jour finale de ce rapport)
