import type {
  Ambition,
  Cote,
  Creneau,
  Encadrement,
  Gravite,
  Impact,
  Lieu,
  Longueur,
  NatureDouleur,
  Niveau,
  Pays,
  Precision,
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
  pays: Pays | null;
  /** « Tu pratiques déjà un sport ? » : parcours A (oui) ou B (pas encore). */
  pratique: 'oui' | 'non' | null;
  sportId: string | null;
  ambition: Ambition | null;
  objectifSport: ObjectifChoisi | null;
  echeance: { date: DateSaisie; epreuve: string; precision: string };
  niveau: Niveau | null;
  /** Slugs de `objectifs_entrainement` proposables en secondaire. */
  objectifsSecondaires: string[];
  // Parcours B
  besoins: string[];
  contraintes: {
    impactMax: Impact | null;
    lieux: string[];
    encadrement: Encadrement | null;
    minutesSemaine: number | null;
  };
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

/** Objectif précis choisi (`objectifs_sport`), avec ce qu'il demande en plus. */
export type ObjectifChoisi = {
  id: string;
  echeanceRequise: boolean;
  precisionDemandee: Precision | null;
  qualitePrincipale: string;
};

export const DATE_VIDE: DateSaisie = { jour: '', mois: '', annee: '' };

export const REPONSES_INITIALES: Reponses = {
  prenom: '',
  naissance: DATE_VIDE,
  pays: null,
  pratique: null,
  sportId: null,
  ambition: null,
  objectifSport: null,
  echeance: { date: DATE_VIDE, epreuve: '', precision: '' },
  niveau: null,
  objectifsSecondaires: [],
  besoins: [],
  contraintes: { impactMax: null, lieux: [], encadrement: null, minutesSemaine: null },
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
