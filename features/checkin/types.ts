import type { Zone } from '@/features/inscription/constantes';

import type { CausePonctuelle, Echelle } from './constantes';

export type SaisieCheckin = {
  notes: Record<Echelle, number | null>;
  douleurs: Zone[];
  causePonctuelle: CausePonctuelle | null;
  dureeMin: number | null;
  lieuId: string | null;
};

export const SAISIE_VIDE: SaisieCheckin = {
  notes: { energie: null, sommeil: null, courbatures: null, motivation: null, stress: null },
  douleurs: [],
  causePonctuelle: null,
  dureeMin: null,
  lieuId: null,
};

/** Toutes les échelles sont obligatoires ; le reste est facultatif. */
export function saisieComplete(saisie: SaisieCheckin): boolean {
  return Object.values(saisie.notes).every((note) => note !== null);
}
