/** Étape intermédiaire vers l'objectif principal (table `sous_objectifs`, migration sous_objectifs_etape_12). */
export const TYPES_ETAPE = ['competition', 'performance', 'volume', 'technique', 'autre'] as const;
export type TypeEtape = (typeof TYPES_ETAPE)[number];

export type StatutEtape = 'propose' | 'actif' | 'atteint' | 'abandonne';

export type SousObjectif = {
  id: string;
  sport_id: string | null;
  evenement_id: string | null;
  titre: string;
  type: TypeEtape;
  /** Slug de `types_tests` suivi (ex. `temps_marathon`), exercice si le test en demande un. */
  indicateur: string | null;
  exercice_slug: string | null;
  valeur_depart: number | null;
  valeur_cible: number | null;
  unite: string | null;
  progression_hebdo_pct: number | null;
  date_debut: string;
  date_cible: string;
  statut: StatutEtape;
  origine: 'athlete' | 'coach';
  raison: string | null;
  notes: string | null;
};

/** Ce que l'athlète saisit (création ou modification). */
export type SaisieEtape = Pick<
  SousObjectif,
  'titre' | 'type' | 'indicateur' | 'exercice_slug' | 'valeur_depart' | 'valeur_cible' | 'unite' | 'progression_hebdo_pct' | 'date_cible' | 'notes'
> & { evenement_id: string | null; sport_id: string | null };
