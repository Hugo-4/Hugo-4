import type { Moment, ReglagesNotifications, StyleCoaching } from './types';

/** Valeurs acceptées par le serveur (tools/personne.js, routes/athlete.js) et choix proposés à l'écran. */

export const MOMENTS: Moment[] = ['matin', 'midi', 'soir', 'indifferent'];

/** `lieux_athlete.type_lieu` (TYPES_LIEU de routes/athlete.js). */
export const TYPES_LIEU = ['salle', 'domicile', 'bureau', 'hotel', 'exterieur', 'piste', 'piscine', 'terrain', 'club'] as const;

/** Alimentation (préférences de nutrition). */
export const REGIMES = ['omnivore', 'flexitarien', 'pescetarien', 'vegetarien', 'vegan'] as const;

/** Variété des exercices (`preference_variete`, 1 à 5). */
export const VARIETES = [1, 2, 3, 4, 5] as const;

/** Durée maximale d'un créneau (15 à 300 min côté serveur). */
export const DUREES_CRENEAU = [30, 45, 60, 75, 90, 120, 150, 180] as const;
export const DUREE_CRENEAU_DEFAUT = 60;

/** Rappel avant la séance (5 à 720 min côté serveur). */
export const RAPPELS_MIN = [15, 30, 60, 120] as const;

/** Heures calmes : aucun rappel entre le début et la fin. */
export const DEBUTS_CALME = ['20:00', '21:00', '21:30', '22:00', '23:00'] as const;
export const FINS_CALME = ['06:00', '07:00', '08:00', '09:00'] as const;

/** Valeurs par défaut du serveur pour le style (STYLE_DEFAUT de tools/personne.js). */
export const STYLE_DEFAUT: Required<Omit<StyleCoaching, 'motivations'>> = {
  ton: 'equilibre',
  longueur: 'standard',
  tutoiement: true,
  emojis: false,
};

/**
 * Notifications : la base ne les renvoie pas tant que l'athlète n'a rien choisi. Valeurs affichées
 * dans ce cas (celles de la documentation du serveur) ; rien n'est enregistré avant un changement.
 */
export const NOTIFICATIONS_DEFAUT: Required<ReglagesNotifications> = {
  actives: true,
  checkin: true,
  rappel_min_avant: 30,
  heure_calme_debut: '21:30',
  heure_calme_fin: '07:00',
};

/** Catégories de `memoire_athlete` (tools/memoire.js), dans l'ordre d'affichage. */
export const CATEGORIES_MEMOIRE = [
  'objectif',
  'preference',
  'aversion',
  'contrainte_vie',
  'motivation',
  'technique',
  'materiel',
  'nutrition',
  'douleur',
  'historique',
  'autre',
] as const;

/** Souvenirs de santé : jamais affichés sans le consentement « données de santé » (même règle que le serveur). */
export const CATEGORIES_SANTE: readonly string[] = ['douleur', 'historique'];

/** Longueur maximale d'un souvenir (le serveur coupe à 300 caractères). */
export const LONGUEUR_SOUVENIR = 300;

/** Allergies et intolérances proposées (préférences de nutrition, données de santé). */
export const ALLERGIES = [
  'gluten',
  'lactose',
  'arachide',
  'fruits_a_coque',
  'oeuf',
  'poisson',
  'crustaces',
  'soja',
  'sesame',
] as const;

export const REPAS_PAR_JOUR = [3, 4, 5, 6] as const;

/** Clés TanStack Query du Profil (les données serveur sont propres à l'athlète connecté : cache vidé à la déconnexion). */
export const CLES = {
  preferences: ['parametres', 'preferences'],
  disponibilites: ['parametres', 'disponibilites'],
  lieux: ['parametres', 'lieux'],
  memoire: ['parametres', 'memoire'],
  credits: ['parametres', 'credits'],
  nutrition: ['parametres', 'nutrition'],
  export: ['parametres', 'export'],
  /** Préfixe des données de santé : supprimées du cache dès que le consentement est retiré. */
  sante: ['parametres', 'sante'],
  evenements: ['evenements'],
} as const;
