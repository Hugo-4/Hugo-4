import { useConsentementSante } from '@/features/checkin/useConsentementSante';
import { useOffre } from '@/features/parametres/useAbonnement';
import { useReglagesManquants } from '@/features/parametres/useReglagesManquants';

import { useConsentementsAthlete, useIdentite, useSportsAthlete } from './useProfil';

/** Données de l'écran Profil et leurs états (chargement, erreur, rafraîchissement). */
export function useEcranProfil() {
  const identite = useIdentite();
  const sports = useSportsAthlete();
  const consentements = useConsentementsAthlete();
  const consentementSante = useConsentementSante();
  const offre = useOffre();
  const manquants = useReglagesManquants();
  const requetes = [identite, sports, consentements];
  return {
    identite: identite.data,
    sports: sports.data ?? [],
    consentements: consentements.data ?? {},
    /** La rubrique Santé n'existe qu'avec le consentement « données de santé ». */
    avecSante: consentementSante.data === true,
    offre: offre.data,
    manquants,
    chargement: requetes.some((r) => r.isPending),
    erreur: requetes.find((r) => r.isError)?.error ?? null,
    aDesDonnees: requetes.every((r) => r.data !== undefined),
    rafraichissement: requetes.some((r) => r.isRefetching),
    reessayer: () => [...requetes, consentementSante, offre].forEach((r) => r.refetch()),
  };
}
