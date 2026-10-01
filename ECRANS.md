# Fiches écrans

Chaque fiche dit ce que l'écran affiche, d'où viennent les données et ce que fait chaque action. Les écrans 1 à 4 ont une maquette validée ; les écrans 5 à 7 sont à maquetter, la fiche fixe leur contenu.

---

## 1. Aujourd'hui (onglet 1)

**But** : en un coup d'œil, l'athlète sait s'il est en forme et ce qu'il fait aujourd'hui, et démarre en un geste.

**Données** : `GET /accueil` (aujourd'hui en détail, demain en résumé, la semaine, le bloc, la compétition), `GET /nutrition/jour`. Le bloc `fatigue` renvoyé par le serveur avec la séance du jour (voir plus bas).

De haut en bas :

1. **En-tête** : date du jour, « Bonjour {prénom} », bouton notifications (compteur orange), avatar (ouvre Profil).
2. **Forme du jour** : anneau 0-100 couleur accent, libellé (« Prêt à t'entraîner », « Journée à alléger »…), sommeil, HRV et écart à la normale, ressenti. Dessous, la phrase du coach qui explique l'adaptation du jour (texte fourni par le serveur, jamais composé par l'app).
   - Si le check-in du jour n'est pas fait : la carte devient « Comment tu te sens ? » avec un bouton vers le check-in.
3. **Carte fatigue** (seulement si le serveur renvoie `fatigue` non nul) : bordure orange, message du coach. Si `fatigue.proposition` existe : boutons « Alléger ma semaine » (`POST /programme/adaptations/:id/accepter`) et « Garder mon programme » (`POST /programme/adaptations/:id/refuser`). Si `fatigue.seance_remplacee` : « Ta séance {avant} est remplacée par {apres} aujourd'hui. »
4. **Séance du jour** : bloc et semaine (« BLOC 2 · SEMAINE 3 / 8 »), série de semaines réussies (flamme orange), titre, durée · RPE cible · nombre d'exercices · lieu, les 3 premiers exercices avec leur prescription, « + N exercices ». Bouton principal « DÉMARRER LA SÉANCE » (ouvre En séance), bouton secondaire « Modifier avec le coach » (ouvre Coach avec le contexte de cette séance).
   - Jour de repos : la carte affiche « Repos » et la prochaine séance.
5. **Ta semaine** : 7 pastilles (fait = plein accent, aujourd'hui = contour accent, prévu = contour gris, repos = gris foncé) avec le type de séance sous chaque jour ; « Voir le mois » ouvre Programme. Jauge de charge de la semaine : faible, zone optimale, élevée.
6. **Nutrition** : calories du jour sur l'objectif, protéines, glucides, eau ; bouton « + Repas » ; ligne « Souvent mangé à cette heure : … » (raccourcis vers les aliments les plus fréquents de l'athlète à ce moment de la journée).
7. **Dernier record ou percentile** (gamification) : fait réel uniquement, jamais un compliment générique.

**Check-in du matin** (feuille modale) : énergie, sommeil, courbatures, motivation, stress (curseurs 1-10), douleurs (zone + intensité 0-10), durée disponible, lieu. Si l'énergie est basse, une question supplémentaire : « C'est passager ? » avec des puces (mauvaise nuit, soirée, voyage, décalage horaire, stress ponctuel, enfant, travail tardif, autre) → colonne `cause_ponctuelle` de `checkins_forme`. Une journée expliquée ainsi ne change que la séance du jour.

---

## 2. En séance

**But** : utilisable en sueur, d'une main, sans réseau.

**Données** : `GET /programme/seances/:id` (exercices, séries, reps, charges, RIR, repos, tempo, médias). Envoi : `PUT /exercices-seance/:id/series` après chaque exercice, `POST /serie-suivante` pour la charge conseillée de la série suivante, `POST /seances/:id/feedback` à la fin.

- **En-tête** : quitter (confirmation si des séries sont en cours), titre de la séance, « Exercice 2 / 6 · 18:24 » (chrono total), barre de progression.
- **Bascule** « Exercice » / « Toute la séance » ; on garde le choix de l'athlète pour les séances suivantes.
- **Vue exercice** : nom, « Série 2 / 4 », consigne (RIR cible, tempo, raison d'un ajustement), charge et répétitions préremplies avec boutons − / + (pas de 2,5 kg ou 1 kg selon le matériel), RPE en un geste (6 à 10), série précédente, gros bouton « VALIDER LA SÉRIE ». Après validation : minuteur de repos automatique (vibration à la fin), charge de la série suivante éventuellement ajustée par le serveur avec la raison.
- **Bouton « Signaler une douleur »** toujours visible : zone, intensité 0-10. Au-delà de 3/10, l'exercice est arrêté et le coach propose un remplacement.
- **Vue liste** : tous les exercices avec leur prescription et leur état (fait, en cours, à faire) ; toucher un exercice l'ouvre en vue exercice.
- **Fin de séance** : RPE global, durée réelle, fatigue après, douleurs, commentaire libre ; résumé (volume, records battus).
- **Hors ligne** : chaque série validée est écrite localement immédiatement et envoyée dès que le réseau revient.

---

## 3. Coach (onglet central)

**But** : demander n'importe quel changement en langage naturel, et voir clairement ce qui change avant d'accepter.

**Données** : route de chat du serveur (le superviseur) ; historique dans `conversations_coach` et `messages_coach`. Solde de crédits (table à venir, voir le plan de tarification).

- **En-tête** : retour, « Coach », contexte (« Sur : Force · bas du corps (aujourd'hui) » quand le chat est ouvert depuis une séance), solde de crédits.
- **Messages** : bulles athlète à droite, coach à gauche. Une modification proposée s'affiche en carte : avant (barré) / après, ce qui ne change pas, boutons « Appliquer » et « Garder l'original ».
- **Réponses rapides** : « Je n'ai que 30 min », « Pas de salle aujourd'hui », « Décaler à demain », « J'ai mal quelque part ».
- **Saisie** : champ texte, dictée vocale, envoyer. Un message coûte des crédits ; quand il en reste moins de 20 %, une ligne discrète le signale.
- 👍 / 👎 sur chaque réponse du coach (colonne `avis` de `messages_coach`).

---

## 4. Inscription

**But** : un premier programme en moins de 5 minutes, ou une personnalisation maximale pour ceux qui le veulent.

- Bascule FR / EN en haut, logo ATHLENIS.
- Choix **Rapide (4 min)** : sport principal, objectif, niveau (débutant, amateur, confirmé, pro), disponibilités (jours, créneaux, durée), blessures et douleurs actuelles. Le reste est demandé au fil des jours, une question à la fois sur Aujourd'hui.
- Choix **Complet (15 min)** : en plus, tests physiques (ou valeurs connues : 1RM, VMA, FTP…), historique de blessures, sports secondaires, compétitions de la saison, matériel et lieux, nutrition (régime, aliments exclus), préférences d'entraînement, style de coaching.
- Avant toute question de santé : écran de consentements (CGU, données de santé ; santé féminine proposée plus tard en option). Sans consentement santé, on ne pose pas les questions de santé.
- Mineurs : avant 15 ans, compte parent obligatoire (écran dédié).
- Fin : « 4 semaines d'essai de l'offre Compétition », `POST /programme/generer`, écran d'attente animé (la génération prend environ une minute).

---

## 5. Programme (onglet 2) — à maquetter

- Calendrier du mois (`GET /calendrier?mois=`), codes et couleurs de `GET /calendrier/legende` ; intensité de 1 à 5 par jour.
- Frise des blocs du programme (nom, phase, dates, semaine allégée), compétition objectif et compte à rebours.
- Détail d'une séance (`GET /programme/seances/:id`) ; actions : déplacer (`POST /programme/adapter` avec `changements.date`), signaler manquée (`POST /programme/seances/:id/manquee`), modifier avec le coach.
- Historique des adaptations (`GET /programme/adaptations`).

## 6. Progrès (onglet 4) — à maquetter

- Records personnels et jalons, évolution des tests (`GET /tests`, `GET /progressions`).
- Niveau par qualité physique en percentile (force relative, VMA, détente, vitesse, endurance), par âge, sexe, sport et niveau.
- Charge d'entraînement (ACWR, monotonie) et régularité (semaines réussies).
- Ligues au choix et défis ; jamais de classement sur le poids ou le volume d'entraînement ; pas de classement public avant 15 ans.

## 7. Profil (onglet 5) — à maquetter

- Identité, sports et niveaux, objectifs, disponibilités et lieux.
- Abonnement (offre, renouvellement, changer d'offre) et crédits du mois.
- Appareils connectés (Apple Health, Health Connect, Strava, Garmin, Coros, Kiprun…).
- Préférences (entraînement, nutrition, style de coaching, notifications), santé (blessures, santé féminine si activée).
- Consentements (voir, retirer), ce que le coach a retenu (`GET /memoire`, modifier, supprimer).
- Export de toutes mes données, suppression du compte, langue.
