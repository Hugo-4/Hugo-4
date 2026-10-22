/** Valeurs acceptées par `checkins_forme` (contraintes CHECK de la base). */

export const NOTES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const ECHELLES = ['energie', 'sommeil', 'courbatures', 'motivation', 'stress'] as const;
export type Echelle = (typeof ECHELLES)[number];

/** Énergie à partir de laquelle on demande « C'est passager ? ». */
export const SEUIL_ENERGIE_BASSE = 4;

export const CAUSES_PONCTUELLES = [
  'mauvaise_nuit',
  'soiree',
  'voyage',
  'decalage_horaire',
  'stress_ponctuel',
  'enfant',
  'travail_tardif',
  'autre',
] as const;
export type CausePonctuelle = (typeof CAUSES_PONCTUELLES)[number];

/** Durée disponible aujourd'hui (minutes) : `duree_disponible_min`. */
export const DUREES_DISPONIBLES = [20, 30, 45, 60, 75, 90, 120] as const;
