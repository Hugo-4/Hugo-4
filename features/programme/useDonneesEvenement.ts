import { useSportsAthlete } from '@/features/profil/useProfil';

import { etatsRequete } from './etatRequete';
import { useEvenements } from './requetes';

/**
 * Ce qu'il faut pour le formulaire d'une compétition : les compétitions existantes (règle d'une seule A par sport,
 * pas de doublon) et les sports de l'athlète. `id` absent : création.
 */
export function useDonneesEvenement(id?: string) {
  const evenements = useEvenements();
  const sports = useSportsAthlete();
  const etatEvenements = etatsRequete(evenements);
  const etatSports = etatsRequete(sports);
  const evenement = id ? (evenements.data?.find((e) => e.id === id) ?? null) : null;
  return {
    chargement: etatEvenements.chargement || etatSports.chargement,
    erreur: etatEvenements.erreur ?? etatSports.erreur,
    aDesDonnees: etatEvenements.aDesDonnees && etatSports.aDesDonnees,
    reessayer: () => Promise.all([evenements.refetch(), sports.refetch()]),
    evenements: evenements.data ?? [],
    sports: (sports.data ?? []).flatMap((s) => (s.sports ? [s.sports] : [])),
    evenement,
    /** Modification d'une compétition qui n'existe pas (ou plus) chez cet athlète. */
    introuvable: Boolean(id) && evenements.data !== undefined && !evenement,
  };
}

export type DonneesEvenement = ReturnType<typeof useDonneesEvenement>;
