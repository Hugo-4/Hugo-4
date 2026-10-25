import type { CategorieManque, Priorite, TypeEvenement } from './types';

/** Valeurs acceptées par le serveur (routes/athlete.js) pour les compétitions et les séances manquées. */

export const PRIORITES: Priorite[] = ['A', 'B', 'C'];

export const TYPES_EVENEMENT: TypeEvenement[] = ['competition', 'combat', 'match', 'course', 'test', 'objectif_perso', 'stage'];

/** CATEGORIES_MANQUE (tools/personne.js). */
export const CATEGORIES_MANQUE: CategorieManque[] = [
  'fatigue',
  'douleur',
  'maladie',
  'travail',
  'famille',
  'motivation',
  'meteo',
  'voyage',
  'oubli',
  'autre',
];

/** Catégories qui relèvent de la santé : proposées seulement avec le consentement « données de santé ». */
export const CATEGORIES_SANTE: CategorieManque[] = ['douleur', 'maladie'];

/** Précision demandée pour une compétition selon le sport. */
export type Precision = 'distance' | 'categorie_poids' | 'poste';

/**
 * Correspondance sport (slug de la table `sports`) → précision. Un sport absent n'a pas de précision.
 * distance → champ `discipline` (accepté par le serveur) ; poste → `discipline` aussi ;
 * catégorie de poids → colonne `categorie_poids_kg`, écrite en direct (absente de CHAMPS_EVT côté serveur).
 */
export const PRECISION_PAR_SPORT: Record<string, Precision> = {
  course_a_pied: 'distance',
  trail: 'distance',
  triathlon: 'distance',
  natation: 'distance',
  cyclisme: 'distance',
  boxe_anglaise: 'categorie_poids',
  boxe: 'categorie_poids',
  mma: 'categorie_poids',
  kickboxing: 'categorie_poids',
  muay_thai: 'categorie_poids',
  judo: 'categorie_poids',
  lutte: 'categorie_poids',
  football: 'poste',
  rugby: 'poste',
  basketball: 'poste',
  handball: 'poste',
  volleyball: 'poste',
};

/** Type d'événement proposé par défaut selon la précision du sport. */
export const TYPE_PAR_PRECISION: Record<Precision, TypeEvenement> = {
  distance: 'course',
  categorie_poids: 'combat',
  poste: 'match',
};

/** Bornes de la catégorie de poids (mêmes bornes que l'inscription). */
export const POIDS_MIN_KG = 30;
export const POIDS_MAX_KG = 200;

/** Longueurs maximales acceptées par le serveur. */
export const RAISON_MAX = 300;

/** Délai avant un nouvel essai quand le détail d'une séance est en préparation (202). */
export const DELAI_PREPARATION_MS = 4_000;

/** Puces de date proposées pour déplacer une séance (aujourd'hui + 6 jours, limite du serveur). */
export const JOURS_DEPLACEMENT = 7;
