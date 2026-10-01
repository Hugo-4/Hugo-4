/** Valeurs acceptées par la base (contraintes CHECK) pour le questionnaire d'inscription. */

export const AGE_MIN_SANS_PARENT = 15;

/** Version des documents acceptés (CGU, données de santé) enregistrée dans `consentements`. */
export const VERSION_DOCUMENTS = '1.0';

/** Sport « Général » exclu de la liste de choix (docs/API.md). */
export const SLUG_SPORT_EXCLU = 'general';

export const NIVEAUX = ['debutant', 'amateur', 'confirme', 'pro'] as const;
export type Niveau = (typeof NIVEAUX)[number];

export const CRENEAUX = ['matin', 'midi', 'soir'] as const;
export type Creneau = (typeof CRENEAUX)[number];

export const DUREES_MIN = [30, 45, 60, 75, 90, 120] as const;

/** 1 = lundi … 7 = dimanche. */
export const JOURS = [1, 2, 3, 4, 5, 6, 7] as const;

export const ZONES = [
  'cervicale',
  'epaule',
  'coude',
  'poignet_main',
  'thoracique',
  'lombaire',
  'hanche',
  'pubis_adducteurs',
  'ischio_jambiers',
  'genou',
  'mollet',
  'tendon_achille',
  'cheville',
  'pied',
] as const;
export type Zone = (typeof ZONES)[number];

export const COTES = ['gauche', 'droit', 'bilateral', 'non_applicable'] as const;
export type Cote = (typeof COTES)[number];

export const GRAVITES = ['legere', 'moderee', 'severe'] as const;
export type Gravite = (typeof GRAVITES)[number];

export const NATURES_DOULEUR = ['douleur', 'blessure'] as const;
export type NatureDouleur = (typeof NATURES_DOULEUR)[number];

export const SEXES = ['homme', 'femme'] as const;
export type Sexe = (typeof SEXES)[number];

/** Lieu principal (parcours Complet) → `lieux_athlete.type_lieu` et `environnement`. */
export const LIEUX = ['salle', 'domicile', 'exterieur', 'piste', 'piscine', 'terrain'] as const;
export type Lieu = (typeof LIEUX)[number];

export const TYPES_EVENEMENT = ['competition', 'combat', 'match', 'course', 'objectif_perso'] as const;
export type TypeEvenement = (typeof TYPES_EVENEMENT)[number];

export const TONS = ['strict', 'equilibre', 'bienveillant'] as const;
export type Ton = (typeof TONS)[number];

export const LONGUEURS = ['bref', 'standard', 'detaille'] as const;
export type Longueur = (typeof LONGUEURS)[number];
