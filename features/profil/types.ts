import type { Ambition, Cadre, Niveau, Pays } from '@/features/inscription/constantes';

export type Identite = {
  prenom: string | null;
  /** AAAA-MM-JJ */
  dateNaissance: string | null;
  pays: Pays | string | null;
};

export type SportAthlete = {
  id: string;
  role: 'principal' | 'complementaire' | 'maintien' | 'loisir' | null;
  niveau: Niveau | null;
  cadre_pratique: Cadre;
  ambition: Ambition | null;
  objectif_sport_id: string | null;
  objectifs_secondaires: string[];
  sports: { id: string; slug: string; nom: string } | null;
  objectifs_sport: { libelle_fr: string; libelle_en: string } | null;
};

export type TypeConsentement = 'cgu' | 'donnees_sante';

export type EtatConsentement = {
  accorde: boolean;
  /** Horodatage du dernier choix (ISO). */
  le: string;
};
