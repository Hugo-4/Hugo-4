import type {
  Cote,
  Creneau,
  Gravite,
  Lieu,
  Longueur,
  NatureDouleur,
  Niveau,
  Sexe,
  Ton,
  TypeEvenement,
  Zone,
} from './constantes';

export type Parcours = 'rapide' | 'complet';

/** Date saisie champ par champ (texte), validée au moment de passer à la suite. */
export type DateSaisie = { jour: string; mois: string; annee: string };

export type Douleur = {
  zone: Zone;
  cote: Cote;
  gravite: Gravite;
  nature: NatureDouleur;
};

export type Reponses = {
  prenom: string;
  naissance: DateSaisie;
  sportId: string | null;
  objectifId: string | null;
  niveau: Niveau | null;
  jours: number[];
  creneau: Creneau | null;
  dureeMin: number | null;
  aucuneDouleur: boolean;
  douleurs: Douleur[];
  // Parcours Complet
  sexe: Sexe | null;
  tailleCm: string;
  poidsKg: string;
  sportsSecondaires: string[];
  competition: { prevue: boolean | null; nom: string; date: DateSaisie; type: TypeEvenement | null };
  lieu: Lieu | null;
  ton: Ton | null;
  longueur: Longueur | null;
};

export const DATE_VIDE: DateSaisie = { jour: '', mois: '', annee: '' };

export const REPONSES_INITIALES: Reponses = {
  prenom: '',
  naissance: DATE_VIDE,
  sportId: null,
  objectifId: null,
  niveau: null,
  jours: [],
  creneau: null,
  dureeMin: null,
  aucuneDouleur: false,
  douleurs: [],
  sexe: null,
  tailleCm: '',
  poidsKg: '',
  sportsSecondaires: [],
  competition: { prevue: null, nom: '', date: DATE_VIDE, type: null },
  lieu: null,
  ton: null,
  longueur: null,
};
